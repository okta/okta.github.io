---
layout: quickstart_partial
exampleDescription: React Implicit
---

This guide will walk you through integrating authentication into a React app with Okta by performing these steps:

1. Add an OpenID Connect Client in Okta
2. Create an Authentication Utility
3. Create Routes
4. Connect the Routes
5. Using the Access Token

At the end of the React instructions you can choose your server type to learn more about post-authentication workflows, such as verifying tokens that your React application can send to your server.

Starting from scratch with React?  Our [React + Okta Auth SDK](/code/react/okta_react) walkthrough will help you setup a new React application and cover the same topics as this quickstart.

## Prerequisites
If you do not already have a **Developer Edition Account**, you can create one at [https://developer.okta.com/signup/](https://developer.okta.com/signup/).

## Add an OpenID Connect Client in Okta
In Okta, applications are OpenID Connect clients that can use Okta Authorization servers to authenticate users.  Your Okta Org already has a default authorization server, so you just need to create an OIDC client that will use it.
* Log into the Okta Developer Dashboard, click **Applications** then **Add Application**.
* Choose **Single Page App (SPA)** as the platform, then submit the form the default values, which should look like this:

| Setting             | Value                                        |
| ------------------- | -------------------------------------------- |
| App Name            | My SPA App                                   |
| Base URIs           | http://localhost:{port}                      |
| Login redirect URIs | http://localhost:{port}/implicit/callback    |
| Grant Types Allowed | Implicit                                     |

After you have created the application there are two more values you will need to gather:

| Setting       | Where to Find                                                                  |
| ------------- | ------------------------------------------------------------------------------ |
| Client ID     | In the applications list, or on the "General" tab of a specific application.    |
| Org URL       | On the home screen of the developer dashboard, in the upper right.             |


These values will be used in your React application to setup the OpenID Connect flow with Okta.

## Create an Authentication Utility

Your React app will use the [Okta Auth JS](/code/javascript/okta_auth_sdk) library to redirect the user to the authorization endpoint on your Okta Org. You can install it via npm:

```bash
npm install @okta/okta-auth-js --save
```

You'll also need `react-router-dom` to manage our routes:

```bash
npm install react-router-dom --save
```

You will need to create a class that encapsulates the interaction with the [Okta Auth JS](/code/javascript/okta_auth_sdk) library. This file will expose a `withAuth` method that makes it easy to create [Higher-Order Components](https://facebook.github.io/react/docs/higher-order-components.html) that include an `auth` property.

To create this file, you will need the values from the OIDC client that you created in the previous step.  You will also need to know your Okta Org URL, which you can see on the home page of the Okta Developer console.

Create a new file `src/auth.js` and add the following code to it, replacing the `{yourOktaDomain}` with your Org URL, and `{clientId}` with the Client ID of the application that you created:

```typescript
// src/auth.js

import React from 'react';
import OktaAuth from '@okta/okta-auth-js';

class Auth {
  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.redirect = this.redirect.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);

    this.oktaAuth = new OktaAuth({
      url: 'https://{yourOktaDomain}.com',
      clientId: '{clientId}',
      issuer: 'https://{yourOktaDomain}.com/oauth2/default',
      redirectUri: 'http://localhost:{port}/implicit/callback',
    });
  }

  getIdToken() {
    return this.oktaAuth.tokenManager.get('idToken');
  }

  getAccessToken() {
    // Return the token from the accessToken object.
    return this.oktaAuth.tokenManager.get('accessToken').accessToken;
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

## Create Routes

You'll want to create these routes in your sample application:

- `/`: A default home page to handle basic control of the app.
- `/implicit/callback`: Handle the response from Okta and store the returned tokens.
- `/login`: Redirect to the Okta Org login page.

Follow the next sections to create these routes in your React application.

### `/`
Place the following code in a new file, `src/Home.js`.  This will render a home page and show links to navigate within app:

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
      {button}
    </div>
  );
}));
```

### `/implicit/callback`
In order to handle the redirect back from Okta, you need to capture the token values from the URL. You'll use `/implicit/callback` as the callback URL, and again you'll use our `auth.js` to delegate the callback details to the [Okta Auth JS](/code/javascript/okta_auth_sdk) library.

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
This route redirects to the Okta Authorization URL if the user is not authenticated.

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

## Connect the Routes
Open `src/App.js` (this was created by the generator) and replace its contents with this code, this will create your final application with the routes that you've created:

```typescript
// src/App.js

import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Callback from './Callback';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path='/' exact={true} component={Home}/>
          <Route path='/login' component={Login}/>
          <Route path='/implicit/callback' component={Callback}/>
        </div>
      </Router>
    );
  }
}

export default App;
```

## Using the Access Token

Your React application now has an access token in local storage that was issued by your Okta Authorization server. You can use this token to authenticate requests for resources on your server or API. As a hypothetical example, let's say that you have an API that gives us messages for our user.  You could create a `MessageList` component that gets the access token from local storage, and use it to make an authenticated request to your server.

Please continue down to the next section, Server Setup, to learn about access token validation on the server.  Here is what the React component could look like for this hypothetical example:

```typescript
import fetch from 'isomorphic-fetch';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withAuth } from './auth';

export default withAuth(withRouter(class MessageList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      messages: null
    }
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated()) {
      fetch('http://localhost:{serverPort}/api/messages', {
        headers: {
          Authorization: 'Bearer ' + this.props.auth.getAccessToken().accessToken
        }
      }).then(response => {
        response.json().then(data => {
          this.setState({messages: data.messages});
        });
      }).catch(response => {
        // handle error as needed
      });
    };
  }

  render() {
    if (this.state.messages) {
      const items = this.state.messages.map((message) =>
        <li key={message}>{message}</li>
      );
      return (<ul>{items}</ul>);
    } else {
      return (
        <div>Loading..</div>
      )
    }
  }
}));
```
