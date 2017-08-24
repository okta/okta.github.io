---
layout: software
title: React + Okta Auth SDK
weight: 30
excerpt: Integrate Okta with a React app using Auth JS.
---

# Overview
This guide will walk you through integrating authentication into a React app with Okta by performing these steps:
1. [Add an OpenID Connect Client in Okta](#add-an-openid-connect-client-in-okta)
2. [Create a React App](#create-a-react-app)
3. [Create an Authentication Utility](#create-an-authentication-utility)
4. [Create a SecureRoute](#create-a-secureroute)
5. [Create Routes](#create-routes)
6. [Connect the Routes](#connect-the-routes)
7. [Start Your App](#start-your-app)

## Prerequisites
If you do not already have a **Developer Edition Account**, you can create one at [https://developer.okta.com/signup/](/signup/).

## Add an OpenID Connect Client in Okta
* Log into the Okta Developer Dashboard, and **Create New App**
* Choose **Single Page App (SPA)** as the platform, then populate your new OpenID Connect app with values similar to:

| Setting             | Value                                               |
| ------------------- | --------------------------------------------------- |
| App Name    | OpenId Connect App *(must be unique)*               |
| Login redirect URIs | http://localhost:3000/callback                      |
| Logout redirect URIs| http://localhost:3000/login                         |

> **Note:** CORS is automatically enabled for the granted login redirect URIs.

## Create a React App
To quickly create a React app, install the create-react-app CLI:
```bash
$ npm install -g create-react-app
```

Now, create a new app:
```bash
$ create-react-app okta-app
```

This creates a new project named `okta-app` and installs all required dependencies.

A simple way to add authentication into a React app is using the [Okta Auth JS](/code/javascript/okta_auth_sdk/) library. We can install it via `npm`:
```bash
$ cd okta-app && npm install @okta/okta-auth-js --save
```

We'll also need `react-router-dom` to manage our routes:
```bash
[okta-app] $ npm install react-router-dom --save
```

## Create an Authentication Utility
Users can sign in to your React app a number of different ways.
To provide a fully featured and customizable login experience, the [Okta Sign-In Widget](/code/javascript/okta_sign-in_widget/) is available to handle User Lifecycle operations, MFA, and more.

First, create `src/auth.js` as an authorization utility file and use it to bootstrap the required fields to login. This file will expose a `withAuth` method that makes it easy to create [Higher-Order Components](https://facebook.github.io/react/docs/higher-order-components.html) that include an `auth` prop:

> Important: We're using Okta's organization authorization server to make setup easy, but it's less flexible than a custom authorization server. Most SPAs send access tokens to access APIs. If you're building an API that will need to accept access tokens, [create an authorization server](/docs/how-to/set-up-auth-server.html#create-an-authorization-server)

```typescript
// src/auth.js

import React from 'react';
import OktaAuth from '@okta/okta-auth-js';

class Auth {
  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.redirect = this.redirect.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);

    oktaAuth = new OktaAuth({
      url: 'https://{yourOktaDomain}.com',
      clientId: '{clientId}',
      issuer: 'https://{yourOktaDomain}.com',
      redirectUri: 'http://localhost:3000/callback',
    });
  }

  login(history) {
    // Redirect to the login page
    history.push('/login');
  }

  async logout(history) {
    this.oktaAuth.tokenManager.clear();
    await this.oktaAuth.signOut();
    history.push('/');
  }

  redirect() {
    // Launches the login redirect.
    this.oktaAuth.token.getWithRedirect({
      responseType: ['id_token', 'token'],
      scopes: ['openid', 'email', 'profile']
    });
  }

  isAuthenticated() {
    // Checks if there is a current accessToken in the TokenManger.
    return !!this.oktaAuth.tokenManager.get('accessToken');
  }

  async handleAuthentication() {
    const tokens = await this.oktaAuth.token.parseFromUrl();
    for (let token of tokens) {
      if (token.idToken) {
        this.oktaAuth.tokenManager.add('idToken', token);
      } else if (token.accessToken) {
        this.oktaAuth.tokenManager.add('accessToken', token);
      }
    }
  }
}

// create a singleton
const auth = new Auth();
export const withAuth = WrappedComponent => props =>
  <WrappedComponent auth={auth} {...props} />;
```

## Create a SecureRoute
Some routes require authentication in order to render. Defining those routes is easy if we centralize our logic by creating a `src/SecureRoute.js` file:
{% raw %}
```typescript
// src/SecureRoute.js

import React from 'react';
import { Route, Redirect } from 'react-router';
import { withAuth } from './auth';

export default withAuth(({ auth, component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    auth.isAuthenticated() ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
));
```
{% endraw %}
## Create Routes
Lets take a look at what routes are needed:
- `/`: A default page to handle basic control of the app.
- `/protected`: A route protected by `SecureRoute`.
- `/callback`: Handle the response from Okta and store the returned tokens.
- `/login`: Redirect to the org login page.

### `/`
First, create `src/Home.js` to provide links to navigate our app:

```typescript
// src/Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { withAuth } from './auth';

export default withAuth(withRouter(props => {
  // Change the button that's displayed, based on our authentication status
  const button = props.auth.isAuthenticated() ?
    <button onClick={props.auth.logout.bind(null, props.history)}>Logout</button> :
    <button onClick={props.auth.login.bind(null, props.history)}>Login</button>;

  return (
    <div>
      <Link to='/'>Home</Link><br/>
      <Link to='/protected'>Protected</Link><br/>
      {button}
    </div>
  );
}));
```

### `/protected`
This route will only be visible to users with a valid `accessToken`.

Create a new component `src/Protected.js`:

```typescript
// src/Protected.js

import React from 'react';

export default () => <h3>Protected</h3>;
```

### `/callback`
In order to handle the redirect back from Okta, we need to capture the token values from the URL. Use the `/callback` route to handle the logic of storing these tokens and redirecting back to the main page.

Create a new component `src/Callback.js`:

```typescript
// src/Callback.js

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withAuth } from './auth';

export default withAuth(class Callback extends Component {
  state = {
    parsingTokens: false
  }

  componentWillMount() {
    if (window.location.hash) {
      this.setState({
        parsingTokens: true
      });

      this.props.auth.handleAuthentication()
      .then(() => {
        this.setState({
          parsingTokens: false
        });
      })
      .catch(err => {
        console.log('error logging in', err);
      });
    }
  }

  render() {
    if (!this.state.parsingTokens) {
      const pathname = localStorage.getItem('referrerPath') || '/';
      return (
        <Redirect to={pathname}/>
      )
    }

    return null;
  }
});
```

### `/login`
This route redirects if the user is already logged in. If the user is coming from a protected page, they'll be redirected back to the page upon login.

Create a new component `src/Login.js`:

```typescript
// src/Login.js

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withAuth } from './auth';

export default withAuth(class Login extends Component {
  render() {
    let from;
    if (this.props.location && this.props.location.state) {
      from = this.props.location.state.from;
    } else {
      from = { pathname: '/' };
    }

    if (this.props.auth.isAuthenticated()) {
      return <Redirect to={from}/>;
    }

    localStorage.setItem('referrerPath', from.pathname);
    this.props.auth.redirect();
    return null;
  }
});
```

### Connect the Routes
Update `src/App.js` to include your project components and routes:

```typescript
// src/App.js

import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SecureRoute from './SecureRoute';
import Home from './Home';
import Login from './Login';
import Callback from './Callback';
import Protected from './Protected';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path='/' exact={true} component={Home}/>
          <SecureRoute path='/protected' component={Protected}/>
          <Route path='/login' component={Login}/>
          <Route path='/callback' component={Callback}/>
        </div>
      </Router>
    );
  }
}

export default App;
```

## Start your app
Finally, start your app:

```bash
[okta-app] $ npm start
```

## Conclusion
You have now successfully authenticated with Okta! Now what? With a user's `id_token`, you have basic claims for the user's identity. You can extend the set of claims by modifying the `scopes` to retrieve custom information about the user. This includes `locale`, `address`, `groups`, and [more](../../docs/api/resources/oidc.html).

Want to learn how to use the user's `access_token`? Check out our [React Quickstart integrations](/quickstart/#/react/nodejs/generic.html) to learn about protecting routes on your server, validating the `access_token`, and more!

## Support 
Have a question or see a bug? Post your question on [Okta Developer Forums](https://devforum.okta.com/).
