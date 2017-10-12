---
layout: software
title: Okta Sign-In Widget and React
language: React
weight: 30
excerpt: Integrate Okta with a React app using the Sign-In Widget.
---

# Overview
This guide will walk you through integrating authentication into a React app with Okta by performing these steps:
1. [Add an OpenID Connect Client in Okta](#add-an-openid-connect-client-in-okta)
2. [Create a React App](#create-a-react-app)
3. [Create an Authentication Utility](#create-an-authentication-utility)
4. [Create a Widget Wrapper](#create-a-widget-wrapper)
5. [Create a SecureRoute](#create-a-secureroute)
6. [Create Routes](#create-routes)
7. [Connect the Routes](#connect-the-routes)
8. [Start Your App](#start-your-app)

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
npm install -g create-react-app
```

Now, create a new app:
```bash
create-react-app okta-app
```

This creates a new project named `okta-app` and installs all required dependencies.

A simple way to add authentication into a React app is using the [Okta Sign-In Widget](/code/javascript/okta_sign-in_widget/) library. We can install it via `npm`:
```bash
cd okta-app && npm install @okta/okta-signin-widget --save
```

We'll also need `react-router-dom` to manage our routes:
```bash
npm install react-router-dom --save
```

## Create an Authentication Utility
Users can sign in to your React app a number of different ways.
To provide a fully featured and customizable login experience, the [Okta Sign-In Widget](/code/javascript/okta_sign-in_widget/) is available to handle User Lifecycle operations, MFA, and more.

First, create `src/auth.js` as an authorization utility file and use it to bootstrap the required fields to login. This file will expose a `withAuth` method that makes it easy to create [Higher-Order Components](https://facebook.github.io/react/docs/higher-order-components.html) that include an `auth` prop:

> Important: We're using Okta's organization authorization server to make setup easy, but it's less flexible than a custom authorization server. Most SPAs send access tokens to access APIs. If you're building an API that will need to accept access tokens, [create an authorization server](/docs/how-to/set-up-auth-server.html#create-an-authorization-server)

```typescript
// src/auth.js

import React from 'react';
import OktaSignIn from '@okta/okta-signin-widget/dist/js/okta-sign-in.min.js';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import '@okta/okta-signin-widget/dist/css/okta-theme.css';

class Auth {
  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);

    this.widget = new OktaSignIn({
      baseUrl: 'https://{yourOktaDomain}.com/',
      clientId: '{clientId}',
      redirectUri: 'http://localhost:3000/callback',
      authParams: {
        issuer: 'https://{yourOktaDomain}.com/oauth2/{authorizationServerId}',
        responseType: ['id_token', 'token'],
        scopes: ['openid', 'email', 'profile']
      }
    });
  }

  isAuthenticated() {
    // Checks if there is a current accessToken in the TokenManger.
    return !!this.widget.tokenManager.get('accessToken');
  }

  login(history) {
    // Redirect to the login page
    history.push('/login');
  }

  async logout(history) {
    this.widget.tokenManager.clear();
    await this.widget.signOut();
    history.push('/');
  }

  handleAuthentication(tokens) {
    for (let token of tokens) {
      if (token.idToken) {
        this.widget.tokenManager.add('idToken', token);
      } else if (token.accessToken) {
        this.widget.tokenManager.add('accessToken', token);
      }
    }
  }
}

// create a singleton
const auth = new Auth();
export const withAuth = WrappedComponent => props =>
  <WrappedComponent auth={auth} {...props} />;
```

## Create a Widget Wrapper

To render the Sign-In Widget in React, we must create a wrapper that allows us to treat it as a React component.

Create a `src/OktaSignInWidget.js` file:

```typescript
// src/OktaSignInWidget.js

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class OktaSignInWidget extends Component {
  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    this.widget = this.props.widget;
    this.widget.renderEl({el}, this.props.onSuccess, this.props.onError);
  }

  componentWillUnmount() {
    this.widget.remove();
  }

  render() {
    return <div />;
  }
};
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
- `/login`: Show the login page.

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

### `/login`
This route hosts the Sign-In Widget and redirects if the user is already logged in. If the user is coming from a protected page, they'll be redirected back to the page upon login.

Create a new component `src/Login.js`:

```typescript
// src/Login.js

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import OktaSignInWidget from './OktaSignInWidget';
import { withAuth } from './auth';

export default withAuth(class Login extends Component {
  state = {
    redirectToReferrer: false
  };

  componentWillMount() {
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
  }

  onSuccess(tokens) {
    this.props.auth.handleAuthentication(tokens);
    this.setState({
      redirectToReferrer: true
    });
  }

  onError(err) {
    console.log('error logging in', err);
  }
  
  render() {
    let from;
    if (this.props.location && this.props.location.state) {
      from = this.props.location.state;
    } else {
      from = { pathname: '/' };
    }

    if (this.props.auth.isAuthenticated() || this.state.redirectToReferrer) {
      return <Redirect to={from}/>;
    }

    return (
      <OktaSignInWidget
        widget={this.props.auth.widget}
        onSuccess={this.onSuccess}
        onError={this.onError}/>
    );
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
import Protected from './Protected';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path='/' exact={true} component={Home}/>
          <SecureRoute path='/protected' component={Protected}/>
          <Route path='/login' component={Login}/>
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
npm start
```

## Conclusion
You have now successfully authenticated with Okta! Now what? With a user's `id_token`, you have basic claims for the user's identity. You can extend the set of claims by modifying the `scopes` to retrieve custom information about the user. This includes `locale`, `address`, `groups`, and [more](../../docs/api/resources/oidc.html).

Want to learn how to use the user's `access_token`? Check out our [React Quickstart integrations](/quickstart/#/react/nodejs/generic.html) to learn about protecting routes on your server, validating the `access_token`, and more!

## Support 
Have a question or see a bug? Post your question on [Okta Developer Forums](https://devforum.okta.com/).
