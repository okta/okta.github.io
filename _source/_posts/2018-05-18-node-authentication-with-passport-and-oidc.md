---
layout: blog_post
title: "Build Secure Node Authentication with Passport.js and OpenID Connect"
author: leebrandt
description: "This post demonstrates how to set up OpenID Connect authentication in Node with Passport.js."
tags: [nodejs, node, passportjs, passport.js, authentication, openid connect, oidc]
tweets:
 - "Checkout @nodejs authentication using @passportjs and OpenID Connect from @leebrandt! >>"
 - "Learn how to get OpenID Connect authentication into your @nodejs apps easier with @passportjs! <3"
 - "Make it easy to get authentication into your @nodejs apps with @passportjs and OpenID Connect! >>"
---

Building local or social login in Node can be simple with Passport.js. There are over 500 strategies already built that make it easy to wire up identity providers. But what do you do if your identity provider doesn't already have a pre-built strategy? Do you have to build all that stuff yourself? Absolutely not! You can use generic strategies for Passport.js that make it easy to use your provider of choice without having to write all the plumbing yourself. In this tutorial we'll walk through how to use my identity provider of choice (Okta) with the generic `passport-openidconnect` package to build secure Node authentication and user management!

Before we get started, let me tell you what Okta is, and why I think Okta is a no-brainer choice for your next Node project.

## What is Okta?

Okta is a cloud service that allows developers to create, edit, and securely store user accounts and user account data, and connect them with one or multiple applications. Our API enables you to:

* [Authenticate](https://developer.okta.com/product/authentication/) and [authorize](https://developer.okta.com/product/authorization/) your users
* Store data about your users
* Perform password-based and [social login](https://developer.okta.com/authentication-guide/social-login/)
* Secure your application with [multi-factor authentication](https://developer.okta.com/use_cases/mfa/)
* And much more! Check out our [product documentation](https://developer.okta.com/documentation/)

In short: we make [user account management](https://developer.okta.com/product/user-management/) a lot easier, more secure, and more scalable than what you're probably used to.

Sound amazing? [Register for a free developer account](https://developer.okta.com/signup/), and when you're done, come on back so we can learn more about building secure authentication in Node.

Now, let's dive in!

## Use Express to Scaffold the Base Node Authentication Project

Start by installing the [Express application generator](https://expressjs.com/en/starter/generator.html) if you don't already have it installed.

```bash
npm install express-generator -g
```

Then use the `express` command to scaffold a base Node and Express application.

```bash
express -e --git passport-oidc-example
```

The generator will quickly create a new app in the **passport-oidc-example** folder. It uses the Embedded JavaScript syntax for the view templates and will generate a base **.gitignore** file. There will be instructions at the bottom of the output telling you how to proceed.

```bash
change directory:
  $ cd passport-oidc-example

install dependencies:
  $ npm install

run the app:
  $ DEBUG=passport-oidc-example:* npm start
```

Go ahead and change into the new directory, and install the dependencies. I use [Visual Studio Code](https://code.visualstudio.com/) for my Node development which has great support for writing and debugging Node applications. It works on all platforms and is completely free. Running the application with a debugger attached is as easy as hitting the `F5` key!

Once you have VS Code installed, you can open the project from the command line using the `code` command.

```bash
code .
```

Now, run the app by hitting the `F5` key and it will start the Node debugger in the output window. Open a browser to http://localhost:3000 and make sure your base application is running.

{% img blog/node-passport/express-app-init.png alt:"The initial application running." width:"800" %}{: .center-image }

## Add Passport.js to the Node Application

The first thing you'll need is three npm packages:

* passport
* passport-openidconnect
* express-session

```bash
npm install passport@0.4.0 passport-openidconnect@0.0.2 express-session@1.15.6 --save
```

Once those are installed, open the `app.js` file in the root folder of the application and add Passport.js to the requirements so that the top section of the file looks like:

```js
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var OidcStrategy = require('passport-openidconnect').Strategy;
```

## Configure Express to Use Passport.js

Passport relies on `express-session` to store the user information once the user has logged in. To configure it, right below the line that reads:

```js
app.use(express.static(path.join(__dirname, 'public')));
```

add the configuration.

```js
app.use(session({
  secret: 'MyVoiceIsMyPassportVerifyMe',
  resave: false,
  saveUninitialized: true
}));
```

Right below that, add the configuration that tells Express to use Passport for sessions.

```js
app.use(passport.initialize());
app.use(passport.session());
```

## Create an Okta Application to Support Node Authentication

If you don't already have an account (and didn't create one at the start of this tutorial), [it's time to sign up for one](https://developer.okta.com/signup/)! Once you're logged into your Okta dashboard, click on the **Applications** menu item and click **Add Application**. From the wizard, choose **Web** and click **Next**.

{% img blog/node-passport/create-web-application.png alt:"Create web application" width:"800" %}{: .center-image }


On the **Application Settings** screen, name the application (I've named mine "PassportOidc") and change the ports for both the **Base URIs** and **Login redirect URIs** settings. Then click **Done**.

{% img blog/node-passport/application-settings.png alt:"The application settings" width:"800" %}{: .center-image }


## Configure Passport.js for OpenID Connect

Now you'll configure Passport.js to use Okta as your Identity Provider (IdP). To do this, right below the Passport.js configuration from the last section, tell passport to use the `OidcStrategy` created in the requirements.

```js
// set up passport
passport.use('oidc', new OidcStrategy({
  issuer: 'https://{yourOktaDomain}/oauth2/default',
  authorizationURL: 'https://{yourOktaDomain}/oauth2/default/v1/authorize',
  tokenURL: 'https://{yourOktaDomain}/oauth2/default/v1/token',
  userInfoURL: 'https://{yourOktaDomain}/oauth2/default/v1/userinfo',
  clientID: '{ClientID}',
  clientSecret: '{ClientSecret}',
  callbackURL: 'http://localhost:3000/authorization-code/callback',
  scope: 'openid profile'
}, (issuer, sub, profile, accessToken, refreshToken, done) => {
  return done(null, profile);
}));
```

The code above sets the name of the strategy as 'oidc' and set all the URLs that the strategy needs to know to pull off the authorization code flow for OpenID Connect. The issuer is the URL for your authorization server that was created for you when you signed up for an Okta developer account. You can view it by clicking on **API** in your Okta dashboard and choosing the **Authorization Servers** tab. To find the `authorizationURL`, `tokenURL` and `userInfoURL` settings, you can click on the default authorization server and view its settings. There is a **Metadata URI** setting that, by clicking on the link, will show you the `.well-known` document. This document tells anyone using this authorization server about the information and endpoints it can provide.

{% img blog/node-passport/default-authorization-server-settings.png alt:"The default authorization server settings" width:"800" %}{: .center-image }

The last argument is a function that pushes the profile object returned from the authentication call into `req.user` so that you can use it in the route handlers. You could manipulate the object you pass in so that it has other information, or save/update the user in your database.

You'll also need to tell Passport.js how to serialize the user information into a session. To do this, you'll add to methods right below the configuration you just set up.

```js
passport.serializeUser((user, next) => {
  next(null, user);
});

passport.deserializeUser((obj, next) => {
  next(null, obj);
});
```

## Call Passport.js

The last thing that Passport.js needs is two endpoints in your application: one that kicks off the login flow and one that handles the callback from the OpenID Connect provider. You can put these two routes right below the `app.use()` method for the index and user routers.

```js
app.use('/login', passport.authenticate('oidc'));

app.use('/authorization-code/callback',
  passport.authenticate('oidc', { failureRedirect: '/error' }),
  (req, res) => {
    res.redirect('/');
  }
);
```

Now you could run this application and navigate to the login route, and it would take you through the login flow and back to your homepage. But there's nothing that gives visual proof the login succeeded and that there is a user object available on the request parameter.

To do that, create a profile page that shows the logged in user's name. Start with the profile route.

```js
app.use('/profile', (req, res) => {
  res.render('profile', { title: 'Express', user: req.user });
});
```

Then in the **views** folder add a **profile.ejs** file.

```html
<!DOCTYPE html>
<html>
  <head>
    <title><%= title %></title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <h1><%= title %></h1>
    <p>Welcome <%= user.displayName %>!</p>
  </body>
</html>
```

Then, to make things a bit easier, add a login link to the home page.

```html
<!DOCTYPE html>
<html>
  <head>
    <title><%= title %></title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <h1><%= title %></h1>
    <p>Welcome to <%= title %></p>
    <a href="/login">Log In</a>
  </body>
</html>
```

Now when you run the application, you can click the **Log In** link, start the login flow, and see the profile page with the user's name displayed!

There is still a problem with the application. Anyone could go to the profile route and cause an error to happen. If there is no user in the request session, there is nothing to pass and nothing to display in the view.

To ensure that only logged in users can get to the profile page, add a middleware function.

```js
function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login')
}
```

This function checks the request's `isAuthenticated()` method and passes the request on to the next handler if the user is logged in. If not, it redirects the user to the login page which with kick off the login process.

Now add that middleware to the routes you need protected. In this case, just the profile route for now.

```js
app.use('/profile', ensureLoggedIn, (req, res) => {
  res.render('profile', { title: 'Express', user: req.user });
});
```

Now if you manually try to go to the profile page, you will be routed to the login flow and then back to the profile page once you're logged in. But there still something missing.

## Log Out of the Passport.js Session

The last thing is being able to kill the login session and redirect the user back to the homepage. First, create a route to handle the logout route. Right below the authorization callback route, add a new route.

```js
app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});
```

It's just that simple. This route handler calls the `logout()` method on the incoming request, destroys the session, and redirects the user to the homepage.

That's all the basics of getting Passport.js to handle an OpenID Connect authentication provider that doesn't already have a specific strategy in the Passport.js library!

## Learn More About Node, Authentication, and Okta

Can't get enough Node? Check out our [quickstarts for Node](https://developer.okta.com/code/nodejs/) and other cool posts from the Okta Developer blog, like our post on [simple Node authentication](https://developer.okta.com/blog/2018/04/24/simple-node-authentication), and my post on [user registration with Node and React](https://developer.okta.com/blog/2018/02/06/build-user-registration-with-node-react-and-okta).

As always, feel free to ping us on Twitter [@oktadev](https://twitter.com/oktadev) or leave comments below, and don't forget to check out our [YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q)!
