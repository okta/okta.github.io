---
layout: blog_post
title: "Build and Understand Express Middleware through Examples"
author: leebrandt
description: "This tutorial walks you through creating and understanding middleware for Express."
tags: [Express, ExpressJS, Node, NodeJS, Middleware]
tweets:
- "Learn #express middleware by example with @leebrandt →"
- "Need to build and understand #express middleware? We've got you covered. <3"
- "Let @leebrandt show you how to create and use middleware in #Express →"
---

If you've done any significant Node development in the past seven or eight years, you've probably used [Express](https://expressjs.com) to build a web server at some point. While you can create a server in Node without using a library, it doesn't give you a lot out of the box and can be quite cumbersome to add functionality. Express is a minimalist, "unopinionated" server library and has become the defacto standard for building web apps in Node. To understand Express, you need to understand Express Middleware.

## What is Express Middleware?
Middleware literally means anything you put in the middle of one layer of the software and another. Express middleware are functions that execute during the lifecycle of a request to the Express server.  Each middleware has access to the HTTP `request` and `response` for each route (or path) it's attached to. In fact, Express itself is compromised wholly of middleware functions. Additionally, middleware can either terminate the HTTP request or pass it on to another middleware function using `next` (more on that soon!) This "chaining" of middleware allows you to compartmentalize your code and create reusable middleware.

In this article I'll explain what middleware is, why you would use it, how to use existing Express middleware, and how to write your own middleware for Express.

## Requirements to Write Express Middleware
There are a few things you will need installed to create, use, and test Express middleware. First, you will need Node and NPM. To ensure you have them installed, you can run:

```sh
npm -v && node -v
```

You should see the Node and NPM versions you have installed. If you get an error, you need to [install Node](https://nodejs.org/en/). I'm using the latest version of both as of the time of this article, which is Node 10.9.0 and NPM 6.4.1, but all the examples should work with Node versions 8+ and NPM versions 5+.

I will also be using Express version 4.x. This is important because major changes were made from version 3.x to 4.x.

It will also be helpful to have [Postman](https://www.getpostman.com/) installed to test routes using any HTTP verbs other than `GET`.

## Express Middleware: The Basics
To get started, you'll use the most basic of Express' built-in middleware. This will give you the chance to see how middleware is used, and how Express middleware is structured.

Create a new project and `npm init` it...

```sh
npm init
npm install express --save
```

Create `server.js` and paste the following code:

```js
const express = require('express');
const app = express();

app.get('/', (req, res, next) => {
  res.send('Welcome Home');
});

app.listen(3000);
```

Run the server via `node server.js`, access `http://localhost:3000`, and you should see "Welcome Home" printed in your browser.

The `app.get()` function is actually built-in Express middleware. You'll notice the parameters passed to the method are `req`, `res`, and `next`. These are the incoming request, the response being written and a method to call once the middleware is finished. In this case, once the response is sent, the function exits so there is no need to call the `next()` method. You could also chain other middleware here by calling the `next()` method.

Let's take a look at a few more examples of the different types of middleware.

## Express Request Logging Middleware Example
In Express, you can set up middleware to be "global" middleware; meaning it will be called for every incoming request.

Change the contents of `server.js` to:

```js
const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log(req);
  next();
});

app.get('/', (req, res, next) => {
  res.send('Welcome Home');
});

app.listen(3000);
```

This time, when you go to `http://localhost:3000` you should see the same thing in your browser window, but back in the console window you will see the output of the incoming request object.

The middleware logs out the request object and then calls `next()`. The next middleware in the pipeline handles the get request to the root URL and sends back the text response. Using `app.use()` means that this is global middleware and will be called for every call. 

## Restrict Express Request Content Type Example
In addition to running middleware for all calls, you could also specify to only run middleware for specific calls. 

Change the `server.js` file again to:

```js
const express = require('express');
const app = express();

const requireJsonContent = () => {
  return (req, res, next) => {
    if (req.headers['content-type'] !== 'application/json') {
        res.status(400).send('Server requires application/json')
    } else {
      next()
    }
  }
}

app.get('/', (req, res, next) => {
  res.send('Welcome Home');
});

app.post('/', requireJsonContent(), () => {
  res.send('You sent JSON');
})

app.listen(3000);
```

This time, start the server by running:

```sh
node server.js
```

To test this, open up Postman and create a post request to `http://localhost:3000`. Don't set any headers and run the request. You will get back the "Server requires application/json" message.

Now go back and add the `Content-Type` header with a value of `application/json` and run the request again. You will get the "You sent JSON" message back from the server.

This `app.post()` method call adds the `requireJsonContent()` middleware function to ensure the incoming request payload has a `Content-Type` header value set to `application/json`. If it doesn't pass the check, an error response is sent. If it does, the request is then handed off to the next piece of middleware in the chain via the `next()` method.

## Third-Party Express Middleware
You've built a couple of custom middlewares to far, but there are lots of packages already built to do the things you might normally want to do. In fact, you've used the simple routing middleware library by using the `app.get()` or `app.post()` middleware functions. There are thousands of middleware libraries for doing things like parsing incoming data, routing, and authorization. 

Okta has an Express middleware for OIDC security that I'll show you to demonstrate using third-party middleware libraries.


### Why Okta for Express Applications
At Okta, our goal is to make [identity management](https://developer.okta.com/product/user-management/) a lot easier, more secure, and more scalable than what you're used to. Okta is a cloud service that allows developers to create, edit, and securely store user accounts and user account data, and connect them with one or multiple applications. Our API enables you to:

- [Authenticate](https://developer.okta.com/product/authentication/) and [authorize](https://developer.okta.com/product/authorization/) your users
- Store data about your users
- Perform password-based and [social login](https://developer.okta.com/authentication-guide/social-login/)
- Secure your application with [multi-factor authentication](https://developer.okta.com/use_cases/mfa/)
- And much more! Check out our [product documentation](https://developer.okta.com/documentation/)

## Okta's OIDC Express Middleware
To install Okta's OIDC middleware for Express, run:

```sh
npm install @okta/oidc-middleware --save
```

Then in the `server.js` file, you create an instance if the middleware with some configuration options so that Okta knows how to connect to your Okta application.

```js
const oidc = new ExpressOIDC({
  issuer: 'https://{yourOktaDomain}/oauth2/default',
  client_id: '{yourClientId}',
  client_secret: '{yourClientSecret}',
  redirect_uri: 'http://localhost:3000/authorization-code/callback',
  scope: 'openid profile'
});
```

You'll also need to tell Express to use the OIDC middleware router instead of the default router.

```js
app.use(oidc.router);
```

Then you use it like any other middleware:

```js
app.get('/protected', oidc.ensureAuthenticated(), (req, res) => {
  res.send('Top Secret');
});
```

The `oidc.ensureAuthenticated()` function is a middleware in the Okta library. It runs a function to see if the current user is logged in. If they are, it calls `next()` to let the `app.get()` function continue handling the request. If they aren't it will send back an `HTTP 401 (Unauthorized)` response.

## Middleware Order is Important
When a request is received by Express, each middleware that matches the request is run in the order it is initialized until there is a terminating action (like a response being sent). 

{% img blog/express-middleware-examples/middleware.png alt:"Middleware Flow" width:"800" %}{: .center-image }

So if an error occurs, all middleware that is meant to handle errors will be called in order until one of them calls a terminating event like `res.send()` or `res.end()`.

## Learn More About Express Middleware
For detailed instructions on setting up the Okta OIDC middleware, you can follow the [ExpressJS Quickstart](https://developer.okta.com/quickstart/#/okta-sign-in-page/nodejs/express).

There is also a list of officially supported Express middleware in this [GitHub repo](https://github.com/senchalabs/connect#middleware) you can try out and dig into to learn more

Finally, if you're interested in learning more about how to use Okta, there's an [Okta Node SDK](https://github.com/okta/okta-sdk-nodejs) for implementing more user management functionality in your application.

As always, I'd love to hear your thoughts and questions in the comments or on twitter @oktadev!
