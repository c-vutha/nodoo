# Nodoo

NodeJS Library for connecting to Odoo via JSON RPC

## Installation

```bash
$ npm install

```

## Usage

```js
const nodoo = require('./nodoo');

let url = 'http://localhost:8069';
let db = 'odoo';
const odoo = Nodoo(url, db);
```

### // Login with Odoo user

```js
let session = await odoo.login('admin', 'admin');
```

### // Logout (Clear Session)

```js
await odoo.logout();
```

### // Get res.users (using session from login)

```js
const users = await odoo.searchRead(
  'res.users',
  ['login', '=', 'admin'],
  ['name', 'login', 'email']
);
```

### // Get All by ID

```js
const user = await odoo.load('res.users', 2);
```

### // Get Fields by ID

```js
const companies = await odoo.searchCount('res.partner', [
  ['is_company', '=', 'True']
]);
```

### // Search for ID with domains

```js
const res_company = await odoo.search(
  'res.partner',
  [['is_company', '=', 'True']],
  {
    limit: 5
  }
);
```

### // Count record by domains

```js
const companyCount = await odoo.searchCount('res.partner', [
  ['is_company', '=', 'True']
]);
```

### // List fields for a model

```js
const bankModel = await odoo.fieldsGet('res.bank', ['string', 'help', 'type']);
```
