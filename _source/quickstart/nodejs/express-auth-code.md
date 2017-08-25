---
layout: quickstart_partial
exampleDescription: Express.js Auth Code Example
---

### Create the project and install dependencies

```bash
mkdir okta-express && cd okta-express && npm init -y
npm install express express-session @okta/oidc-middleware uuid
```

### Create your application

Next, we'll create a server with OpenId Connect middleware that will automatically configure your app to work with Okta. Create a `server.js` file:

```javascript
// server.js

const express = require('express');
const session = require('express-session');
const uuid = require('uuid');
const { ExpressOIDC } = require('@okta/oidc-middleware');

const app = express();

// This adds session support to your server
app.use(session({
  secret: uuid(), // this will invalidate all sessions on each restart
  resave: true,
  saveUninitialized: false
}));

// Configure the OIDC middleware
const oidc = new ExpressOIDC({
  issuer: 'https://{yourOktaDomain}.com/oauth2/default',
  client_id: '{clientId}',
  client_secret: '{clientSecret}',
  redirect_uri: 'http://localhost:3000/authorization-code/callback',
  scope: 'openid profile'
});

// Allow ExpressOIDC to add the /login and /authorization-code/callback routes
app.use(oidc.router);

// Use userinfo in a response
app.get('/', (req, res) => {
  if (req.userinfo) {
    res.send(`Hi ${req.userinfo.name}!`);
  } else {
    res.send('Hi!');
  }
});

// Redirect to the login page if a user is not authenticated
app.get('/protected', oidc.ensureAuthenticated(), (req, res) => {
  res.send(JSON.stringify(req.userinfo));
});

// Log the user out
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(3000, () => console.log(`Started!`));
```

### Start your server

```javascript
node server.js
```

Now, read more about [@okta/oidc-middleware](https://github.com/okta/okta-oidc-js/tree/master/packages/oidc-middleware)
