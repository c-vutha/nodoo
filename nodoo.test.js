const Nodoo = require('./nodoo');
const url = 'http://127.0.0.1:8069';
const db = 'odoo';

test('Login with Odoo user: "admin" and pwd: "admin"', async () => {
  const odoo = Nodoo(url, db);
  await expect(odoo.login('admin', 'admin')).resolves.not.toBeNull();
});
