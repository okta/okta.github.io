---
layout: quickstart_partial
exampleDescription: Express.js Auth Code Example
---

### Install the dependency

```bash
npm install express-session @okta/oidc-middleware
```

### Add the router with your properties

We'll create a server with OpenId Connect middleware that will automatically configure your app to work with Okta.

```javascript
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');

// session support is required to use ExpressOIDC
app.use(session({
  secret: 'this should be secure',
  resave: true,
  saveUninitialized: false
}));

const oidc = new ExpressOIDC({
  issuer: 'https://{yourOktaDomain}.com/oauth2/default',
  client_id: '{clientId}',
  client_secret: '{clientSecret}',
  redirect_uri: 'http://localhost:3000/authorization-code/callback',
  scope: 'openid profile'
});

// Let ExpressOIDC add the /login and /authorization-code/callback routes
app.use(oidc.router);
```

### Protect your routes

You can use ExpressOIDC to redirect to the login page for authentication:

```javascript
app.get('/protected', oidc.ensureAuthenticated(), (req, res) => {
  res.send(JSON.stringify(req.userinfo));
});
```

Or you can use the userinfo in a route:

```javascript
app.get('/', (req, res) => {
  if (req.userinfo) {
    res.send(`Hi ${req.userinfo.name}!`);
  } else {
    res.send('Hi!');
  }
});
```

### Start your server

Wait to start listening until ExpressOIDC is ready.

```javascript
oidc.on('ready', () => {
  app.listen(3000, () => console.log(`Started!`));
});

oidc.on('error', err => {
  console.log('Unable to configure ExpressOIDC', err);
});
```

Now, read more about [@okta/oidc-middleware](https://github.com/okta/okta-oidc-js/tree/master/packages/oidc-middleware)
