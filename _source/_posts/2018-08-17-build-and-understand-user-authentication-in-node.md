---
layout: blog_post
title: "Build and Understand a Simple Node.js Website with User Authentication"
author: rdegges
description: "Learn how to build and understand authentication in Node.js websites in this in-depth post."
tags: [node, nodejs, authentication, auth, user management]
tweets:
- "Are you a @NodeJS developer? Read this post to actually understand how web authentication works!"
- "Like building web apps in @nodejs? @rdegges just published a tutorial that walks you through building and understanding web authentication."
- "Check out @rdegges' new tutorial that helps you truly understand user authentication in a @nodejs web app."
---

Building websites with user authentication and management (login, registration, password reset, etc.), can be a huge pain. As a developer there are a million little things you need to worry about:
 
* Storing the users in your database
* Making sure you have the right user attributes defined
* Forcing users to be logged in to view a page
* Building registration and login forms
* Creating password reset workflows that email users a link
* Verifying new users when they sign up via email
* Etc...
 
The list goes on and on.
 
Today I'm not only going to show you how to quickly build a Node.js website that supports all those things above, I'm going to teach you exactly what's going on behind the scenes so you fully *understand* how web authentication works.
 
If you've ever been curious about how web authentication and user security works, you will enjoy this. =)
 
 
## What We're Building
 
As I mentioned above, today we'll be building a simple Node.js site that supports a few key user flows:
 
* User registration
* User login
* Password reset
* Email verification
 
The end product of this article looks like this:
 
{% img blog/build-understand-auth-node/using-the-site.gif alt:"using the site" width:"800" %}{: .center-image }
 
If you want to see a preview of this project live, you can do so here: [https://okta-express-login-portal.herokuapp.com/](https://okta-express-login-portal.herokuapp.com/).
 
The site will be built using a few different tools (you don't need to know them already):
 
* [Express.js](https://expressjs.com/), the most popular web framework in the Node.js ecosystem.
* [express-session](https://github.com/expressjs/session), a popular session management library. This is what will allow us to create and store cookies that remember who a user is.
* [Pug](https://pugjs.org/api/getting-started.html), a popular templating language that makes writing HTML a bit simpler.
* [oidc-middleware](https://github.com/okta/okta-oidc-js/tree/master/packages/oidc-middleware), a popular developer library that makes handling authentication using the [OpenID Connect](/blog/2017/07/25/oidc-primer-part-1) protocol simple
 
## Install the Tools
 
The first thing you need to do is install all the open source tools we'll be using to build this Node.js site.
 
**PS**: If you don't already have Node.js setup and working on your computer, you can go checkout [this link](https://nodejs.org/en/download/package-manager/) which shows you the best way to get it working regardless of what operating system you're using.
 
Next, install the [express-generator](https://github.com/expressjs/generator) tool, which is the officially supported bootstrapping tool for quickly getting started with Express.js.
 
```bash
npm install express-generator@4.16.0
```
 
Once that's done, you'll want to scaffold your new Express.js site using express-generator.
 
```bash
express --view pug login-portal
cd login-portal
npm install
```
 
You now have a simple Express.js website that you can run and test out. Start up your new web server by running `npm start` then go visit `http://localhost:3000` in your browser to make sure everything is working OK. If all is well, you should see a page like the one below.
 
{% img blog/build-understand-auth-node/express-starter-page.png alt:"express starter page" width:"800" %}{: .center-image }
 
Next, install some additional packages. We'll use these packages through the rest of the tutorial. Getting them installed and out of the way upfront will make it simpler later on.
 
To install all the extra dependencies, run the following commands in your terminal.
 
```bash
npm install express-session@1.15.6
npm install @okta/oidc-middleware@0.1.3
npm install @okta/okta-sdk-nodejs@1.1.0
```
 
Now, on with the show!
 
## Setup Your Authorization Server
 
Historically, implementing web authentication has been a bit of a mess. Everyone used to implement authentication patterns in different, arbitrary ways. Over the last few years, however, the game has changed quite a bit with the introduction and growing popularity of the OpenID Connect protocol. If you want to read up on OpenID Connect, I recommend [this series](/blog/2017/07/25/oidc-primer-part-1).
 
One of the core tenants of OpenID Connect is the **authorization server**. An authorization server is a one-stop shop that handles all of the user login flows for your applications. The idea is that your application redirects to the authorization server to process user logins and the authorization server then redirects the user back to your website once the user has been authenticated.
 
Authorization servers make handling user management a significantly simpler, less risky task — so that's what we'll be doing today: using an authorization server provider ([Okta](https://developer.okta.com/)) to make the process simple and secure.
 
Okta is free to use and allows you to create and manage users, authorization servers, and lots of other tasks that make handling web authentication simple.
 
To get started with the authorization server setup, you first need to go create a free Okta developer account: [https://developer.okta.com/signup/](https://developer.okta.com/signup/). Once you've created your account and logged in, follow the steps below configure Okta and then you'll be ready to write some code!
 
{% img blog/build-understand-auth-node/okta-signup.png alt:"Okta signup" width:"800" %}{: .center-image }
 
 
### Step 1: Store Your Org URL
 
The first thing you need to do is copy down the **Org URL** from the top-right portion of your Okta dashboard page. This URL will be used to route to your authorization server, communicate with it, and much more. You'll need this value later, so don't forget it.
 
{% img blog/build-understand-auth-node/okta-org-url.png alt:"Okta org url" width:"800" %}{: .center-image } 
 
### Step 2: Create an OpenID Connect Application
 
Okta allows you to store and manage users for multiple applications you might be creating. This means that before we can go any further, you need to create a new OpenID Connect application for this project.
 
Applications in OpenID Connect have a username and password (referred to as a client ID and client secret) that allow your authorization server to recognize which application is talking to it at any given time.
 
To create a new application browse to the **Applications** tab and click **Add Application**.
 
{% img blog/build-understand-auth-node/okta-app-dashboard.png alt:"Okta add application" width:"800" %}{: .center-image }

Next, click the **Web** platform option (since this project is a web app).
 
{% img blog/build-understand-auth-node/okta-create-app-platform.png alt:"Okta create app web" width:"800" %}{: .center-image }

On the settings page, enter the following values:
 
* **Name**: login-portal
* **Base URIs**: `http://localhost:3000`
* **Login redirect URIs**: `http://localhost:3000/users/callback`
 
You can leave all the other values unchanged.
 
{% img blog/build-understand-auth-node/okta-create-app-settings.png alt:"Okta create app settings" width:"800" %}{: .center-image }

Now that your application has been created, copy down the **Client ID** and **Client secret** values on the following page, you'll need them later when we start writing code.
 
{% img blog/build-understand-auth-node/okta-app-credentials.png alt:"Okta signup" width:"800" %}{: .center-image }

 
### Step 3: Create an Authentication Token
 
In order to access the Okta APIs and be able to manage your user accounts with a great deal of granularity, you'll also need to create an Okta authentication token. This is an API key that will be used later on communicate with the Okta APIs and allows you to do things like:
 
* Create, update, and delete users
* Create, update, and delete groups
* Manage application settings
* Etc.
 
To create an authentication token click the **API** tab at the top of the page followed by the **Create Token** button. Give your token a name, preferably the same name as your application, then click **Create Token**. Once your token has been created, copy down the token value as you will need it later.
 
{% img blog/build-understand-auth-node/okta-create-token.png alt:"Okta create token" width:"800" %}{: .center-image }
 
### Step 4: Enable User Registration
 
The last piece of setup you need to complete is to enable user registration functionality for the authorization server. Normally, authorization servers only support login, logout, and stuff like that. But Okta's authorization server also supports self-service registration, so that users can create accounts, log into them, reset passwords, and basically do everything without you writing any code for it.
 
In your Okta dashboard, you'll notice a small button labeled **< > Developer Console** at the top-left of your page. Hover over that button and select the **Classic UI** menu option that appears.
 
{% img blog/build-understand-auth-node/okta-switch-to-classic-ui.png alt:"Okta switch to classic ui" width:"800" %}{: .center-image }
 
Next, hover over the **Directory** tab at the top of the page then select the **Self-Service Registration** menu item. On this page click the **Enable Registration** button.
 
{% img blog/build-understand-auth-node/okta-enable-registration.png alt:"Okta enable registration" width:"800" %}{: .center-image }

On the configuration page, leave all the settings as their default values, except for the **Default redirect** option. For this option, click the **Custom URL** radiobox and enter `http://localhost:3000/dashboard` as the value.
 
This setting essentially tells the authorization server where to redirect users after they've successfully created a new account on your site.
 
Once you've clicked **Save**, the last thing you need to is switch back to the developer console.
 
{% img blog/build-understand-auth-node/okta-registration-settings.png alt:"Okta registration settings" width:"800" %}{: .center-image }

Hover over the **Classic UI** button at the top right of the page and select the **< > Developer Console** menu item from the dropdown.
 
## Configure Session Management
 
Now that all the setup work is done, let's write some code!
 
The first thing we'll add to this basic Express.js site is support for sessions using the [express-session](https://github.com/expressjs/session) library.
 
Session management is the core of any authentication system. It's what allows a user to stay logged into your site and not have to re-enter their credentials before viewing each page. The most [secure way](https://www.rdegges.com/2018/please-stop-using-local-storage/) to handle user sessions is via server-side cookies, which is why we'll be using the express-session library: it allows us to create and manage server-side cookies.
 
To start, open up the `./app.js` file in your favorite editor (I prefer [neovim](https://neovim.io/)), and import the session library at the top of the file alongside the other import statements. The `app.js` file is the heart of your Express.js site. It initializes the Express.js web server, contains the site settings, etc.
 
```javascript
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session");
```
 
Next, you need to remove the `cookie-parser` library that express-generator included by default, since we won't be using it. In the `./app.js` file delete the following two lines of code.
 
```javascript
var cookieParser = require('cookie-parser');
 
// and...
 
app.use(cookieParser());
```
 
Now all you need to do is plug the express-session library into the `./app.js` file along with the other middlewares.
 
```javascript
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'LONG_RANDOM_STRING_HERE',
  resave: true,
  saveUninitialized: false
}));
```
Make sure to replace `LONG_RANDOM_STRING_HERE` with an actual random string you type. This string is what will keep your user's cookies safe from compromise. I personally like to bash my hands around on the keyboard for a second to generate something random.
 
{% img blog/build-understand-auth-node/programming.gif alt:"programming" width:"400" %}{: .center-image }
 
This session library handles a lot of work behind the scenes:
 
* It creates secure, cryptographically signed cookies so you can store data in a user's browser. Cryptographic signing is a technique that allows your server to tell whether or not a user has tried to "modify" their cookies to make it look as if they're someone they're not.
* It gives you a simple API for creating and removing cookies
* It allows you to tweak and configure cookie settings based on what you need to do
 
As you'll see in a moment, this library is used by the oidc-middleware library behind the scenes to make user authentication magical.
 
## Create Express.js Views
 
The next thing we're going to do is create our Express.js views. Views in Express.js are nothing more than HTML templates (web pages) that we want to display to a user. But unlike normal HTML, we'll be using the [Pug](https://pugjs.org/api/getting-started.html) templating language to create our views.
 
Pug is one of the most popular templating languages in the Node.js ecosystem because it allows you more concisely write HTML, use variables, and things like that.
 
### Create the Layout View
 
The first (and most important!) view we're going to create is the `./views/layout.pug` view. This is the "base" view that all our other views will extend.
 
In this view we'll define the basic layout of all the pages, the navbar, and stuff like that. Open up the `./views/layout.pug` and replace whatever is in the file with the following.
 
```html
block variables
 
doctype html
html(lang="en")
  head
    meta(charset="utf-8")
    meta(name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no")
    link(rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous")
    link(rel="stylesheet", href="/stylesheets/style.css")
    title okta-express-login-portal: #{title}
  body
    div.top-bar.d-flex.flex-column.flex-md-row.align-items-center.p-3.px-md-4.mb-3.bg-white.border-bottom.box-shadow
      h5.my-0.mr-md-auto.font-weight-normal
        a(href="/", title="Expresso") okta-express-login-portal
      nav.my-2.my-md-0.mr-md-3
        a.p-2.text-dark(href="/", title="Home") Home
 
        if user == undefined
          a.p-2.text-dark(href="/users/login") Log In / Register
        else
          a.p-2.text-dark(href="/dashboard") Dashboard
          a.p-2.text-dark(href="/users/logout") Logout
    .container
      block content
 
    footer.
      Built with #[a(href="https://expressjs.com/") Express.js], login powered by #[a(href="https://developer.okta.com/") Okta].
```
 
As you can probably figure out if you're at all familiar with HTML, pug is very similar to HTML but uses whitespace instead of closing tags (like the Python programming language).
 
This layout view doesn't do anything except render a simple page with a navbar at the top, a footer at the bottom, and two special constructs, `block variables` and `block content`.
 
The `block variables` line at the top of the file means that any of the templates that inherit from this one will be able to inject some variables into the page. You might have noticed that the `title` tag contains a variable: `#{title}` — this is one of the variables that a child template can overwrite later on.
 
Did you notice the `block content` line right above the footer? This block allows a child template to inject HTML into our layout template at just the right spot — this way our child templates don't need to re-define a navbar, page header, etc.
 
By using these two blocks: `variables` and `content`, our child templates can build full web pages with nothing more than a title and some body content. Pretty nifty.
 
### Create the Homepage View
 
The next view we'll create is the `./views/index.pug` view. Open that file and insert the following code.
 
```html
extends layout
 
block variables
  - var title = "Home"
 
block content
  h2.text-center Express App
 
  .row
    .offset-sm-2.col-sm-8
      .jumbotron.text-center.
        Welcome to your new Express app! Please visit the
        #[a(href="https://github.com/rdegges/okta-express-login-portal", title="okkta-express-login-portal on GitHub") GitHub page] to learn more.
```
 
Notice the `extends layout` line at the top. This is what tells pug that this template is a child of the `layout` template we created earlier.
 
In the `block variables` section we then define our `title` variable which will be used in the layout template to output the page title, and in the `block content` section we insert the HTML for the rest of the page.
 
As you can hopefully see by now, template inheritance in Pug is pretty straightforward.
 
### Create the Dashboard View
 
The next view to create is the dashboard view. This is the page users will see once they've logged into the site. Open up the `./views/dashboard.pug` file and insert the following code.
 
```html
extends layout
 
block variables
  - var title = "Dashboard"
 
block content
  h2.text-center Dashboard
 
  .row
    .offset-sm-2.col-sm-8
      .jumbotron.text-center.
        Welcome to your dashboard page, #{user.profile.firstName}.
```
 
You'll notice that in this template there's a new variable being used: `#{user}`. This will *eventually* refer to the currently logged in user as you'll see later on.
 
### Create the Error Views
 
The last two views you need to create are for handling errors.
 
Open up the `./views/error.pug` view and insert the following code.
 
```html
extends layout
 
block content
  h1= message
  h2= error.status
  pre #{error.stack}
```
 
This view will be rendered when the user hits a URL that doesn't exist (404), or when the web server has a problem (5XX).
 
You'll also need to create a file named `./views/unauthenticated.pug` and insert the following code. This view will be displayed to a user if they visit a page that requires them to be logged in.
 
```html
extends layout
 
block variables
  - var title = "Unauthenticated"
 
block content
  h2.text-center You Must Log In to View This Page
  p.text-center.
    You must be signed in to view this page. Please #[a(href="/users/login", title="Login") login or register] to view this page.
```
 
## Create Public Routes
 
Routes in Express.js are the place where you define application logic. They dictate what code runs when a particular URL is hit by a user, and what response is sent back.
 
To get started, let's remove the default routes that express-generator created for you. Run the following command to remove them.
 
```bash
rm routes/*
```
 
Next, create a file named `./routes/public.js` and insert the following code.
 
```javascript
const express = require("express");
 
const router = express.Router();
 
// Home page
router.get("/", (req, res) => {
  res.render("index");
});
 
module.exports = router;
```
 
In this module we're creating a new [Express.js Router](https://expressjs.com/en/4x/api.html#router) and telling it that if a user makes a GET request to the `/` URL, then we're going to run a function that renders the `index.pug` view file we created earlier and returns it to the user.
 
Now this won't take effect just yet (for reasons you'll learn about later on), but once this router is "enabled", every time a user makes a request for the homepage of the site, eg: `http://localhost:3000`, this code will run and the `index.pug` view will be shown.
 
Pretty neat, right?
 
Next, create a file named `./routes/dashboard.js` and insert the following code.
 
```javascript
const express = require("express");
 
const router = express.Router();
 
// Display the dashboard page
router.get("/", (req, res) => {
  res.render("dashboard");
});
 
module.exports = router;
```
 
This router acts similarly to the homepage router above, except it is rendering our dashboard page. While it doesn't make sense just yet, if a user eventually visits the `/dashboard` URL, this function will run which will render the `dashboard.pug` defined earlier.
 
If you were to go into this file and define another route, for example:
 
```javascript
router.get("/test", (req, res) => {
  res.render("test");
});
```
 
... You would find that a user would need to visit `/dashboard/test` to trigger the function to run. Again: don't worry about this not adding up just yet, we'll get to that down below.
 
## Enable the Routes
 
Now that you've created some routes for public pages, let's *enable* them with Express.js so we can actually see them in action!
 
To do this, open up the `./app.js` file and delete the following two lines.
 
```javascript
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
```
 
Replace those two lines with the two lines of code below.
 
```javascript
const dashboardRouter = require("./routes/dashboard");        
const publicRouter = require("./routes/public");
```
 
Now we're importing the correct route files we just defined above.
 
Next, scroll down until you see the following two lines of code and delete them.
 
```javascript
app.use('/', indexRouter);
app.use('/users', usersRouter);
```
 
Those lines of code were loading up the old routes we just deleted. Now you need to change those lines of code to look like this.
 
```javascript
app.use('/', publicRouter);
app.use('/dashboard', dashboardRouter);
```
 
Is it starting to make sense now? These `app.use` lines of code tell Express.js that if a user visits the `/` URL, it should look into the `./routes/public.js` file and start matching URLs there to run against. So if a user visits the homepage, eg: `/`, Express.js will look in the `./routes/public.js` file, find the route that serves the `/` URL, then run the associated function.
 
The same thing happens with the `dashboardRouter` below. If a user visits `/dashboard`, then Express.js will look in the `./routes/dashboard.js` file for a function that runs when the `/` URL is called, because `/dashboard` + `/` is the path the user is visiting!
 
Routes in Express.js make it easy to compose complex sites with lots of nested URLs without a lot of work.
 
Now that you've enabled your routes, go test them out. Start your web server by running the command below.
 
```bash
npm start
```
 
Then visit `http://localhost:3000` in your browser. You should see the following page rendered.
 
{% img blog/build-understand-auth-node/app-unstyled.png alt:"app unstyled" width:"800" %}{: .center-image }
 
**NOTE**: This page doesn't look just right yet because we haven't created any CSS yet. We'll do that last.
 
If you now go visit the dashboard page you created, `http://localhost:3000/dashboard`, you'll notice you get an error. That is because that Pug view refers to the `#{user}` variable we haven't yet defined. We'll get to that soon.
 
## Configure User Authentication
 
Now that our Express.js site is starting to become functional, let's dive deeper into user authentication.
 
The first thing you need to do is open up `./app.js` and import the following two libraries at the top of the file.
 
```javascript
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var okta = require("@okta/okta-sdk-nodejs");
var ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;
```
 
The two libraries we just added are at the bottom of the list: `@okta/okta-sdk-nodejs` and `@okta/oidc-middleware`. These two libraries handle all of the OpenID Connect communication and routing.
 
The next thing we need to do is create an `oktaClient` object as well as an `ExpressOIDC` object. These will be used in a moment once we've configured them and given them the right credentials.
 
To do this, open up your `./app.js` file again, find the line that reads `var app = express();`, and insert the following code immediately beneath it.
 
```javascript
var oktaClient = new okta.Client({
  orgUrl: 'https://{yourOktaDomain}',
  token: '{yourOktaToken}'
});

const oidc = new ExpressOIDC({
  issuer: "https://{yourOktaDomain}/oauth2/default",
  client_id: {yourClientId},
  client_secret: {yourClientSecret},
  redirect_uri: 'http://localhost:3000/users/callback',
  scope: "openid profile",
  routes: {
    login: {
      path: "/users/login"
    },
    callback: {
      path: "/users/callback",
      defaultRedirect: "/dashboard"
    }
  }
});
```
 
Now, remember those values I told you to write down way back at the beginning of this post? Now you need them! Make sure you substitute out the following variables above for the proper values: `{yourOktaDomain}`, `{yourOktaToken}`, `{yourClientId}`, and `{yourClientSecret}`.
 
The `oidc` object created handles 100% of the OpenID Connect protocol support. It handles router the users to the authorization server to handle user registration, login, password reset, etc. It handles logging the users into your application using secure cookies (powered by express-session), and it also handles everything else.
 
The `oktaClient` object is merely used to retrieve user data from the Okta API service.
 
Now that our OpenID Connect support is ready to be used, let's enable it. To do this, open up the `./app.js` and find the session middleware from earlier, then add the following line beneath it.
 
```javascript
app.use(session({
  secret: 'asdf;lkjh3lkjh235l23h5l235kjh',
  resave: true,
  saveUninitialized: false
}));
app.use(oidc.router);
```
 
The `app.use(oidc.router);` call is all that's needed to tell Express.js to enable the routes that ship with the oidc-middleware library to handle all of the OpenID Connect support. You might have noticed above that when we created the `oidc` object we specified some `routes` in the configuration. These settings dictate what URLs we want to use to handle user login, and what URLs we want to redirect users to after they've been logged in.
 
One benefit of this router being enabled is that from this point forward, in *any* of our route code, we'll have access to a special variable, `req.userinfo`, which contains some of the currently logged in user's basic profile information (pulled from Okta).
 
And while `req.userinfo` is nice, it'd be a lot nicer if we could get *any* data about the currently logged in user that we want.
 
So let's go ahead and define another middleware to help us with that. Immediately below the `app.use(oidc.router);` code, insert the following:
 
```javascript
app.use((req, res, next) => {
  if (!req.userinfo) {
    return next();
  }
 
  oktaClient.getUser(req.userinfo.sub)
    .then(user => {
      req.user = user;
      res.locals.user = user;
      next();
    }).catch(err => {
      next(err);
    });
});
```
 
This middleware will run on every user request, and does the following:
 
* It checks to see if there is a currently logged in user or not by looking at the `req.userinfo` object. If there is no user logged in, it will do nothing (`return next();`).
* If there IS a user logged in, this middleware will then use the Okta Node SDK library to retrieve the user object from the Okta API.
* Finally, it will create two new values: `req.user` and `res.locals.user` which point to the user object directly.
 
This means that in any route we define later on, we could access the `req.user` object directly to view the user's information, edit it, or even delete it.
 
For example, you could create the following route below to display the user's profile information each time a user visits the `/test` URL:
 
```javascript
app.get('/test', (req, res) => {
  res.json({ profile: req.user ? req.user.profile : null });
});
```
 
Let's also go ahead and create one additional middleware, `loginRequired`, that will only allow a user to visit a route if they've been logged in already. This will come in handy if you want to build pages that only logged in users can access (a dashboard, etc.).
 
Below the code above, go ahead and define the function below.
 
```javascript
function loginRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).render("unauthenticated");
  }
 
  next();
}
```
 
Since we want to ensure only logged in users can view our dashboard page, let's also go back and modify our route code for the dashboard.
 
Find the line of code that enabled the dashboard route in your `./app.js`.
 
```javascript
app.use('/dashboard', dashboardRouter);                       
```
 
Now modify it to look like this.
 
```javascript
app.use('/dashboard', loginRequired, dashboardRouter);
```
 
By injecting the `loginRequired` function immediately after the URL pattern, Express.js will first run our `loginRequired` middleware BEFORE the `dashboardRouter` is processed. This way, if a user visits *any* page that starts with the URL `/dashboard` they'll be required to log in before they can access it!
 
The final thing we need to do to finish up our authentication component is define a logout route. The oidc-middleware library provides logout functionality, but doesn't automatically generate a route for it.
 
To do this, create a new file named `./routes/users.js` and put the following code inside of it.
 
```javascript
const express = require("express");
 
const router = express.Router();
 
// Log a user out
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
 
module.exports = router;
```
 
As you can probably tell, this route will log a user out of their account if they send a POST request to the `/users/logout` URL. The only thing we need to do now is enable this route in our `./app.js`.
 
Open up `./app.js`,  and import this new route file alongside the others at the top of the file.
 
```javascript
const dashboardRouter = require("./routes/dashboard");
const publicRouter = require("./routes/public");
const usersRouter = require("./routes/users");
```
 
Next, scroll down until you see your other routers being enabled, and enable this router as well.
 
```javascript
app.use('/', publicRouter);
app.use('/dashboard', loginRequired, dashboardRouter);
app.use('/users', usersRouter);
```
 
Congratulations, you've now got user management and authentication fully configured for your website! And you didn't even have to write any code, manage any passwords, store anything in a database, etc!
 
## How Authentication Works
 
Now that you've seen how to successfully setup authentication for your Node.js websites, let's talk a bit more about *how* it works and explore the full authentication flow.
 
In order to explain each component, let's assume that you're visiting this website and are not currently logged into your account.
 
When you first click the `Log In / Register` button at the top of the page, the oidc-middleware library is going to redirect you to an Okta hosted domain (the authorization server). Here's the sort of URL you'll be redirected to:
 
```
https://dev-842917.oktapreview.com/login/login.htm?fromURI=/oauth2/v1/authorize/redirect?okta_key=qBpZVCpQIJlxUALtybnI9oajmFSOmWJNKL9pDpGtZRU
```
 
**NOTE**: You can fully customize this domain name, look, and feel using Okta.
 
Once you've landed on the authorization server page, you can either enter your account credentials and login immediately or create a new account. This functionality is handled by the authorization server completely.
 
If you enter your credentials and click the **Sign In** button on the authorization server, what happens behind the scenes is:
 
* Your password is hashed and your credentials are checked against the Okta user database to determine whether or not they are correct
* If your credentials are correct, a new session cookie is created for you on the Okta hosted domain (eg: `dev-842917.oktapreview.com`, in this case), and you are redirected to the `redirect_uri` setting you provided earlier when defining the `ExpressOIDC` object. In this case, you'd be redirected to `http://localhost:3000/users/callback`. When you're redirected to this URL, the authorization server will also pass along a special `code` token. This is part of the [OpenID Connect Authorization Code flow](/authentication-guide/implementing-authentication/auth-code).
* Your Express.js app will receive the request to `/users/callback` and service the request automatically using the oidc-middleware library's built-in routes. The route servicing this URL will intercept the request and exchange the `code` token for an `access` and `id` token. This process of exchanging the code token is part of the OpenID Connect authorization code flow and is detailed more here: [/authentication-guide/implementing-authentication/auth-code#3-exchanging-the-code-for-tokens](/authentication-guide/implementing-authentication/auth-code#3-exchanging-the-code-for-tokens).
* Once these tokens have been retrieved, the oidc-middleware library takes the user's basic information embedded in the id token and stores it in a session cookie.
* Then, the oidc-middleware library redirects you to the dashboard page as a fully logged-in user.
* From this point on, each time your browser makes a request to the Express.js website, the cookie containing your profile information will be sent back to Express.js, so that the oidc-middleware library can recognize who you are and populate a `req.userinfo` object with your account data.
 
Once your session cookies have expired (or have been wiped via a logout procedure), the process starts all over again.
 
## Create Styles
 
I'm not a professional designer, but even I can make this website look a little better.
 
Create a file named `./public/stylesheets/style.css` and put the following CSS into it.
 
```css
.top-bar a {
 text-decoration: none;
  color: inherit;
}
 
footer {
  border-top: 1px solid rgba(0,0,0,.1);
  margin-top: 4em !important;
  padding-top: 1em;
  text-align: center;
  margin-top: 1em;
}
 
h2 {
  margin-bottom: 2em;
}
 
.container {
  padding-top: 2em;
}
```
 
This will make the page styles look a little nicer.
 
## Test Out Your New Login Portal
 
Now that your Express.js website is built, why not take it for a test drive?  Start up your web server by running the `npm start` command, visit `http://localhost:3000`, and test things out!
 
{% img blog/build-understand-auth-node/using-the-site-local.gif alt:"using the site locally" width:"800" %}{: .center-image }
 
You'll notice a few things:
 
* If you click the `Log In / Register` button at the top of the page, you can either create a new user account OR log into an existing one. This functionality is all provided by Okta's authorization server automatically.
* Once you're logged in, you'll be redirected to the `/dashboard` page, which will greet you by your first name. Remember that `#{user.profile.firstName}` variable in the `./views/dashboard.pug` file earlier? That variable is now you actual user account since you've now plugged in all the appropriate middleware.
* If you log out, then immediately click the `Log In / Register` button again, you'll be instantly logged in without needing to re-enter your username and password. This is a feature of OpenID Connect — the authorization server remembers who you are for a set amount of time. This is the same way that Google Login and Facebook Login work!
 
If you're already logged into your Okta account and instantly get logged into the dashboard, don't worry. Just open a new incognito window in your browser and go through the flow there.
 
## Learn More About Node.js and Authentication
 
I hope you enjoyed seeing how authentication works with OpenID Connect and Node.js. Building websites with user management can be a pain, but new protocols like OpenID Connect alongside providers like [Okta](https://developer.okta.com) make the process much simpler.
 
If you'd like to learn more about building web apps in Node, you might want to check out these other great posts:
 
* [Build Secure Node Authentication with Passport.js and OpenID Connect](/blog/2018/05/18/node-authentication-with-passport-and-oidc)
* [Build User Registration with Node, React, and Okta](/blog/2018/02/06/build-user-registration-with-node-react-and-okta)
* [Simple Node Authentication](/blog/2018/04/24/simple-node-authentication)
* [Build a Basic CRUD App with Vue.js and Node](/blog/2018/02/15/build-crud-app-vuejs-node)
 
Finally, please [follow us on Twitter](https://twitter.com/OktaDev) to find more great resources like this, request other topics for us to write about, and follow along with our new open source libraries and projects!
 
**PS**: If you liked this project and want to see the source code in one place, please go checkout and star the [GitHub repository](https://github.com/rdegges/okta-express-login-portal).
 
And... If you have any questions, please leave a comment below!