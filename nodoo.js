const http = require("axios").default;
const uuid = require("uuid").v4;

let url = "http://localhost:8069";
let db = "odoo12";
let options;
let session;

const searchRead = async (
  model,
  domains = null,
  fields = null,
  sort = null,
  offset = 0,
  limit = null
) => {
  const path = "/web/dataset/search_read";
  const params = { model };
  if (domains) params["domain"] = domains;
  if (fields) params["fields"] = fields;
  if (offset) params["offset"] = offset;
  if (limit) params["limit"] = limit;
  if (sort) params["domain"] = sort;
  const response = await rpc(path, params);
  return response.data.result;
};

const load = async (model, id) => {
  const path = "/web/dataset/load";
  const params = { model, id, fields: [] };
  const response = await rpc(path, params);
  return response.data.result.value;
};

const search = async (model, domains = [], options = {}) => {
  return call_kw(model, "search", [domains], options);
};

const searchCount = async (model, domains = []) => {
  return call_kw(model, "search_count", [domains], {});
};

const read = async (model, ids = [], fields = []) => {
  return call_kw(model, "read", [ids], { fields });
};

const readGroup = async (
  model,
  domain = null,
  fields = null,
  groupby = null,
  offset = 0,
  limit = null,
  orderby = null,
  lazy = true
) => {
  return call_kw(
    model,
    "read_group",
    [domain, fields, groupby, offset, limit, orderby, lazy],
    {}
  );
};

const fieldsGet = async (model, attributes = ["string", "help", "type"]) => {
  return call_kw(model, "fields_get", [], { attributes });
};

const call_kw = async (model, method, args = [], kwargs = {}) => {
  const path = "/web/dataset/call_kw";
  const params = { model, method: method, args: args, kwargs: kwargs };
  const response = await rpc(path, params);
  return response.data.result;
};

const login = async (login, password) => {
  const path = "/web/session/authenticate";
  const response = await rpc(path, { db, login, password });
  const cookie = parseCookie(response);
  this.session = cookie.session_id;
  response.data.result.session_id = this.session;
  return response.data.result;
};

const logout = async () => {
  const path = "/web/session/destroy";
  const response = await rpc(path, {});
  return response.data;
};

const databases = async () => {
  const path = "/web/database/list";
  const response = await rpc(path, {});
  return response.data.result;
};

const serverInfo = async () => {
  const path = "/web/webclient/version_info";
  const response = await rpc(path, {});
  return response.data.result;
};

const sessionInfo = async () => {
  const path = "/web/session/get_session_info";
  const response = await rpc(path, {});
  return response.data.result;
};

const rpc = async (path, params) => {
  const headers = {
    "Content-Type": "application/json"
  };
  if (this.session) {
    headers["X-Openerp-Session-Id"] = this.session;
  }
  const body = {
    jsonrpc: "2.0",
    method: "call",
    params: params, //payload
    id: uuid()
  };
  const api = url + path;
  console.log(`Odoo RPC: ${api}`);
  let response = await http.post(api, body, { headers });
  response = sanitizeRpcError(response);
  return response;
};

// Check if Contain Odoo Error
const sanitizeRpcError = response => {
  const data = response.data;
  if (!data.error) {
    return response;
  }
  // Handle Odoo Error
  const error = data.error;
  var errorObj = {
    title: "",
    message: "",
    fullTrace: error
  };
  if (
    error.code === 200 &&
    error.message === "Odoo Server Error" &&
    error.data.name === "werkzeug.exceptions.NotFound"
  ) {
    errorObj.title = "page_not_found";
    errorObj.message = "HTTP Error";
  } else if (
    (error.code === 100 && error.message === "Odoo Session Expired") || //v8
    (error.code === 300 &&
      error.message === "OpenERP WebClient Error" &&
      error.data.debug.match("SessionExpiredException")) //v7
  ) {
    errorObj.title = "session_expired";
    // cookies.delete_sessionId();
  } else if (
    error.message === "Odoo Server Error" &&
    /FATAL:  database "(.+)" does not exist/.test(error.data.message)
  ) {
    errorObj.title = "database_not_found";
    errorObj.message = error.data.message;
  } else if (error.data.name === "openerp.exceptions.AccessError") {
    errorObj.title = "AccessError";
    errorObj.message = error.data.message;
  } else {
    var split = ("" + error.data.fault_code).split("\n")[0].split(" -- ");
    if (split.length > 1) {
      error.type = split.shift();
      error.data.fault_code = error.data.fault_code.substr(
        error.type.length + 4
      );
    }

    if (error.code === 200 && error.type) {
      errorObj.title = error.type;
      errorObj.message = error.data.fault_code.replace(/\n/g, "<br />");
    } else {
      errorObj.title = error.message;
      errorObj.message = error.data.debug.replace(/\n/g, "<br />");
    }
  }
};

const parseCookie = response => {
  // cookie string to object
  const cookie = response.headers["set-cookie"][0]
    .split(";")
    .reduce((res, c) => {
      const [key, val] = c
        .trim()
        .split("=")
        .map(decodeURIComponent);
      try {
        return Object.assign(res, { [key]: JSON.parse(val) });
      } catch (e) {
        return Object.assign(res, { [key]: val });
      }
    }, {});
  return cookie;
};

module.exports = (url, db, options = null) => {
  this.url = url;
  this.db = db;
  this.options = options;
  return {
    login,
    logout,
    databases,
    serverInfo,
    sessionInfo,
    searchRead,
    load,
    search,
    searchCount,
    read,
    fieldsGet,
    readGroup
  };
};
