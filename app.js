const Nodoo = require('./nodoo');

let url = 'http://172.16.1.138:8069';
let db = 'odoo12';
// let url = 'http://localhost:8069';
// let db = 'odoo12';
const odoo = Nodoo(url, db);
const odoo2 = Nodoo(url, db);

const playground = async () => {
  let res = await odoo.login('admin', 'admin');
  let res2 = await odoo2.login('admin', 'admin');
  //   console.log(res);
  res = await odoo.databases();
  //   console.log(res);
  res = await odoo.sessionInfo();
  //   console.log(res);
  res = await odoo.serverInfo();
  //   console.log(res);
  res = await odoo.searchRead('res.users', null, ['name', 'login', 'email']);
  // console.log(res);
  // res = await odoo.load('res.users', 2);
  res = await odoo.searchRead('res.users', null, ['name', 'login', 'email']);

  res = await odoo.readGroup(
    'hr.leave.report',
    [['employee_id', '=', 1]],
    ['employee_id', 'number_of_days'],
    ['employee_id', 'holiday_status_id'],
    null,
    null,
    null,
    false
  );
  console.log(res);
  res = await odoo.load('res.users', 2);
  //   console.log(res.login);
  const res_company = await odoo.search(
    'res.partner',
    [['is_company', '=', 'True']],
    {
      limit: 5
    }
  );
  // console.log(res_company);
  res = await odoo.searchCount('res.partner', [['is_company', '=', 'True']]);
  // console.log(res);
  res = await odoo.read('res.partner', res_company, ['name']);
  // console.log(res);
  res = await odoo.fieldsGet('res.bank', ['string', 'help', 'type']);
  // console.log(res);
  // res = await odoo.create('res.partner', { name: 'New Partner' });
  // console.log(res);
  // const date = new Date().toISOString();
  // res = await odoo.create('hr.leave', {
  //   holiday_status_id: 1,
  //   request_date_from: date,
  //   request_date_to: date,
  //   name: 'Test Leaves'
  // });
  // console.log(res);
  // const leave_id = res;

  res = await odoo.call_kw('hr.leave', 'action_approve', [5]);
  res = await odoo.call_kw('hr.leave', 'action_refuse', [5]);
  res = await odoo.call_kw('hr.leave', 'action_draft', [5]);
  res = await odoo.call_kw('hr.leave', 'action_confirm', [5]);
  // res = await odoo.write('hr.leave', [5], { name: 'Test Leaves' });

  // res = await odoo.unlink('hr.leave', [leave_id]);
  console.log(res_company);
  res = await odoo.searchCount('res.partner', [['is_company', '=', 'True']]);
  console.log(res);
  res = await odoo.read('res.partner', res_company, ['name']);
  console.log(res);
  res = await odoo.fieldsGet('res.bank', ['string', 'help', 'type']);
  console.log(res);
  res = await odoo.logout();
  //   console.log(res);
};

playground(odoo);
