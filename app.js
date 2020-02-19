const Nodoo = require("./nodoo");

let url = "http://localhost:8069";
let db = "odoo12";
const odoo = Nodoo(url, db);

const playground = async () => {
  let res = await odoo.login("admin", "admin");
  //   console.log(res);
  res = await odoo.databases();
  //   console.log(res);
  res = await odoo.sessionInfo();
  //   console.log(res);
  res = await odoo.serverInfo();
  //   console.log(res);
  res = await odoo.searchRead("res.users", null, ["name", "login", "email"]);

  res = await odoo.readGroup(
    "hr.leave.report",
    [["employee_id", "=", 1]],
    ["employee_id", "number_of_days"],
    ["employee_id", "holiday_status_id"],
    null,
    null,
    null,
    false
  );
  console.log(res);
  res = await odoo.load("res.users", 2);
  //   console.log(res.login);
  const res_company = await odoo.search(
    "res.partner",
    [["is_company", "=", "True"]],
    {
      limit: 5
    }
  );
  console.log(res_company);
  res = await odoo.searchCount("res.partner", [["is_company", "=", "True"]]);
  console.log(res);
  res = await odoo.read("res.partner", res_company, ["name"]);
  console.log(res);
  res = await odoo.fieldsGet("res.bank", ["string", "help", "type"]);
  console.log(res);
  res = await odoo.logout();
  //   console.log(res);
};

playground(odoo);
