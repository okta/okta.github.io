---
layout: blog_post
title: Build a React Application with User Authentication in 15 Minutes
author: leebrandt
tags: [react, sign-in widget, okta, es6]
---

React has quickly become one of the most favored front-end web frameworks, and is second only to plain old HTML5, [according to JAXenter](https://jaxenter.com/technology-trends-2017-top-frameworks-131993.html). So it's no surprise that [developers are learning it](https://www.lynda.com/React-js-training-tutorials/7049-0.html), and [employers are asking for it](https://stackoverflow.com/jobs?sort=i&q=ReactJS).

In this tutorial, you'll start with a very simple React app with a couple of pages and some routing built in, and add authentication using [Okta's Sign-In Widget](/code/javascript/okta_sign-in_widget). The Sign-In Widget is an embeddable Javascript widget that allows developers to use Okta's secure, scalable architecture with a minimum of effort from within React applications. Let's get started!
## Get the Simple React Seed Project
Start by cloning the simple React seed project.

```bash
git clone https://github.com/leebrandt/simple-react-seed.git okta-react-widget-sample
cd okta-react-widget-sample
```

## Add the Okta Sign-In Widget

Install the [Okta Sign-In Widget](https://github.com/okta/okta-signin-widget) using npm.

```bash
npm install @okta/okta-signin-widget@2.3.0 --save
```

This will add the Okta Sign-In Widget code to your `node_modules` folder. We'll be using version 2.3.0 of the Sign-In Widget.

{% img blog/react-sign-in-widget/Okta-Widget-NPM-Modules-Screener.png alt:"Okta in node_modules" %}

Then add the styles for the widget in your `index.html` file from the Okta CDN. Add these lines inside the `<head>` tag:

```html
    <link
     href="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/2.3.0/css/okta-sign-in.min.css"
      type="text/css"
      rel="stylesheet"/>

    <!-- Theme file: Customize or replace this file if you want to override our default styles -->
    <link
      href="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/2.3.0/css/okta-theme.css"
      type="text/css"
      rel="stylesheet"/>
```

## The LoginPage Component

First, create a folder called `auth` in the `./src/components` folder, then create a file called `LoginPage.js` where the `LoginPage` component will go.

Start with the most basic of components:

```js
import React from 'react';

export default class LoginPage extends React.Component{
  render(){
    return(
      <div>Login Page</div>
    );
  }
}
```

This little component doesn't *do* much but at least you now have a handle to add the `LoginPage` to your routing. So in your `./src/app.js` file, you'll import the component at the top:

```js
import LoginPage from './components/auth/LoginPage';
```

and then add the route inside the main route (the one with the path of "/")

```js
<Route path="/login" component={LoginPage}/>
```

## Add the OpenID Connect Application in Okta

In order to use Okta as your OpenID Connect provider for authentication, you'll need to set up an application in the [Okta developer console](https://developer.okta.com).

If you don't have an Okta developer account, [go create one](https://developer.okta.com/signup/)! Once you're logged in, click on **Applications** in the top navbar, then click **Add Application**. Select SPA as the platform and click Next. Change the redirect URI to `http://localhost:3000`, and click Done. The application will be created with the following settings:

{% img blog/react-sign-in-widget/react-sample-app-settings.png alt:"OIDC Application Settings" width:"800" %}

Now that you have an application created in Okta, you can set up the widget to talk to your new app!

## Add the Widget to Your Component

```js
import React from 'react';
import OktaSignIn from '@okta/okta-signin-widget';

export default class LoginPage extends React.Component{
  constructor(){
    super();
    this.widget = new OktaSignIn({
      baseUrl: 'https://{yourOktaDomain}',
      clientId: '{clientId}',
      redirectUri: 'http://localhost:3000',
      authParams: {
        responseType: 'id_token'
      }
    });
  }

  render(){
    return(
      <div>Login Page</div>
    );
  }
}
```

Copy the Client ID generated from your application's settings page and paste it over `{clientId}`. Make sure you also replace `{yourOktaDomain}` with your Okta organization URL, which you can find by going back to the main Dashboard page in the developer console. It will look like: `https://{yourOktaDomain}`.

Thus far you've imported the `OktaSignIn` function from the [Okta Sign-In Widget](https://github.com/okta/okta-signin-widget) `npm` module you installed earlier. Next, in the constructor of the component, you initialized an instance of `OktaSignIn` with the configuration for the application. This way, the application code will be able to talk to Okta and Okta will recognize that this is the app you just created.

## Show The Login Widget

Next, you'll create the code to actually render the Sign-In Widget to the page! You'll need to change your render method to create an HTML element  you can render the widget into. Make sure to get a [reference to the element](https://facebook.github.io/react/docs/refs-and-the-dom.html) that will be rendered. Then, add a `componentDidMount` function to make sure you don't try to render the widget before the HTML element is on the page.

```js
import React from 'react';
import OktaSignIn from '@okta/okta-signin-widget';

export default class LoginPage extends React.Component{
  constructor(){
    super();
    this.state = {user:null};
    this.widget = new OktaSignIn({
      baseUrl: 'https://{yourOktaDomain}',
      clientId: '{clientId}',
      redirectUri: 'http://localhost:3000',
      authParams: {
        issuer: 'default'
        responseType: 'id_token'
      }
    });
  }

  componentDidMount(){
    this.widget.renderEl({el:this.loginContainer},
      (response) => {
        this.setState({user: response.claims.email});
      },
      (err) => {
        console.log(err);
      }
    );
  }

  render(){
    return(
     <div ref={(div) => {this.loginContainer = div; }} />
    );
  }
}
```

You also added state to your component. If you're using a flux implementation, this would naturally come from the app state. But to keep this tutorial simple, let your `LoginPage` keep track of it's own state.

## Check Whether the User is Logged In

We're almost there, but you don't necessarily want to render the widget right away. You'll need to add a check to make sure the user isn't already logged in, and move your `renderEl` out to a function called `showLogin`.

```js
 // ...other stuff removed for brevity's sake
 componentDidMount(){
    this.widget.session.get((response) => {
      if(response.status !== 'INACTIVE'){
        this.setState({user:response.login});
      }else{
        this.showLogin();
      }
    });
  }

  showLogin(){
    Backbone.history.stop();
    this.widget.renderEl({el:this.loginContainer},
      (response) => {
        this.setState({user: response.claims.email});
      },
      (err) => {
        console.log(err);
      }
    );
  }
```

You might have noticed a weird bit of code in that `showLogin` method. That first line: `Backbone.history.stop()`. The widget itself uses [Backbone.js](http://backbonejs.org/) to navigate between its own screens (login, forgot password, etc.), and when it renders, it starts the `Backbone.history`. Since you've now moved it out into a `showLogin` function, the widget is going to re-render whenever the function is called. So this is just a little trick to tell Backbone to stop the history, because it's going to restart when the widget is rendered.

## The Final LoginPage React Component

Let's wrap this up. Make sure you bind the class's `this` context to each of your methods. Add a `logout` method, and change your `render` method to make a decision on what to render, based on whether there is a currently logged in user.

So the final version of `LoginPage.js` should look like this:

```js
import React from 'react';
import OktaSignIn from '@okta/okta-signin-widget';

export default class LoginPage extends React.Component{
  constructor(){
    super();
    this.state = { user: null };
    this.widget = new OktaSignIn({
      baseUrl: 'https://{oktaOrgUrl}',
      clientId: '{clientId}',
      redirectUri: 'http://localhost:3000',
      authParams: {
        responseType: 'id_token'
      }
    });

    this.showLogin = this.showLogin.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount(){
    this.widget.session.get((response) => {
      if(response.status !== 'INACTIVE'){
        this.setState({user:response.login});
      }else{
        this.showLogin();
      }
    });
  }

  showLogin(){
    Backbone.history.stop();
    this.widget.renderEl({el:this.loginContainer},
      (response) => {
        this.setState({user: response.claims.email});
      },
      (err) => {
        console.log(err);
      }
    );
  }

  logout(){
    this.widget.signOut(() => {
      this.setState({user: null});
      this.showLogin();
    });
  }

  render(){
    return(
      <div>
        {this.state.user ? (
          <div className="container">
            <div>Welcome, {this.state.user}!</div>
            <button onClick={this.logout}>Logout</button>
          </div>
        ) : null}
        {this.state.user ? null : (
          <div ref={(div) => {this.loginContainer = div; }} />
        )}
      </div>
    );
  }
}
```

## Add a Login Link

React is now wired up to handle the `/login` route and display the Okta Sign-In Widget to prompt the user to log in.

Add a Login link to the top navbar by editing `./src/components/common/Navigation.js` and adding a new link under the existing Contact link:

```html
<li><Link to="login">Login</Link></li>
```

## Check It Out

Now install the npm packages:

```bash
npm install
```

When you run the app now (with `npm start`), you should see something like this:

{% img blog/react-sign-in-widget/Finished-Sample-Screener.gif alt:"Finished Sample" %}

If you have any problems with the application, one thing to try first is, delete the `node_modules` folder **and** the `package-lock.json` file and re-run the `npm install` command. This should fix any problems with package dependency management.

If it works - congrats! If it doesn't, please post a question to Stack Overflow with an [okta tag](http://stackoverflow.com/questions/tagged/okta), or hit me up on Twitter [@leebrandt](https://twitter.com/leebrandt).

## React + Okta

You can find a completed version of the application created in this blog post [on GitHub](https://github.com/leebrandt/okta-react-widget-sample).

Building authentication in an application is hard. It's even less fun to build it over and over again in each application you build. Okta does the hard part for you and makes it a lot more fun to be a developer! [Sign up for a forever-free developer account](https://developer.okta.com/signup/) and try Okta today!

I hope you've enjoyed this quick tour of our React support. If you have questions about Okta's features, or what we're building next, please hit me up on Twitter [@leebrandt](https://twitter.com/leebrandt), leave a comment below, or open an issue on GitHub.

### Changelog

* October 20, 2017: Changed npm install to version 2.3.0 of widget and removed npm install at beginning. Also added instructions for fixing dependency issues in npm.
* October 17, 2017: Fixed bugs and added navbar instructions.
* September 30, 2017: Updated "create an OIDC app" instructions for the [Okta Developer Console](/blog/2017/09/25/all-new-developer-console). Updated the widget reference to 2.1.0.
