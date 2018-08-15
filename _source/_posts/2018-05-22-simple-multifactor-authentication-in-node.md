---
layout: blog_post
title: "Simple Multi-Factor Authentication in Node"
author: bkelley
description: "This post explains multi-factor authentication and some challenges that developers face with it."
tags: [multi-factor, authentication, developer, nodejs]
tweets:
- "Who knew how easy adding multi-factor authentication to your #Node app is! #mfa #javascript"
- "Learn how to quickly add multi-factor authentication to your #Node app! #mfa #javascript"
---

If you're building a web application, chances are you're going to want to serve different content depending on the user. Authenticating users can be difficult for a number of reasons. The simplest route is to allow users to sign in with a username and password. The problem with this is, no matter how strongly you hash passwords, there's no stopping someone from guessing that your user's password is `hunter2`, `letmein`, or `correct horse battery staple`.

Maybe you implement some requirements to say your users must have uppercase and lowercase characters, a number, a special character, and at least 10 characters total, but you can't keep them from writing their password down on a sticky note next to their computer. What happens when they reuse the same username and password on every site and one of those sites has a database leak? Or perhaps they access your site from a public computer that has a password manager, and now their really secure password is there for the next person to use.

This is where multi-factor authentication (MFA) comes in to play. By adding an extra level of security, even if someone manages to phish your user's login information, they still won't be able to sign in without access to another device such as their mobile phone or a U2F key. You might be thinking, _managing passwords is hard enough, keeping track of various devices in a secure way will be a nightmare_.

To make that simpler, we're going to use Okta to add basic authentication and MFA. Before we dive in, I'd like to give you a quick overview of what Okta does, and how it can simplify the development process for you, while ensuring best-in-class security for both you and your users.

## What is Okta?

Okta is a cloud service that allows developers to create, edit, and securely store user accounts and user account data, and connect them with one or multiple applications. Our API enables you to:

* [Authenticate](https://developer.okta.com/product/authentication/) and [authorize](https://developer.okta.com/product/authorization/) your users
* Store data about your users
* Perform password-based and [social login](/authentication-guide/social-login/)
* Secure your application with (multi-factor authentication](/use_cases/mfa/)
* And much more! Check out our [product documentation](https://developer.okta.com/documentation/)

In short: we make [user account management](https://developer.okta.com/product/user-management/) a lot easier, more secure, and more scalable than what you're probably used to. It's super easy to [register for a free developer account](https://developer.okta.com/signup/), and when you're done, come on back so we can learn more about building secure authentication in Node and implementing MFA with Okta.


## Set Up the Express Application

To keep things simple, I'll assume you already have Node installed. You can get a quick boilerplate web app up and running using the [Express Generator](https://expressjs.com/en/starter/generator.html).

```bash
npm install -g express-generator@4.16.0
express --git simple-multifactor-auth
cd simple-multifactor-auth
npm install
git init && git add . && git commit -m 'initial commit'
PORT=8080 npm start
```

This installs the generator globally as a command line tool and creates a new application in a directory called `simple-multifactor-auth`. The `--git` flag creates a `.gitignore` file with some sane defaults.

Inside the new directory, `npm install` adds all the dependencies needed for the application, and `npm start` runs the app. The `git` commands save the current state so that it's easier to track changes you make going forward.

The last command, `npm start`, starts the application. You can now go to `http://localhost:8080` to see a very simple welcome page. You can use `ctrl-c` at any time to stop the Node app and return to the terminal.

## Create an Okta Application to Support Adding Multi-Factor Authentication to Your Node App
In order to add authentication, your app will need a few configuration variables. To keep these private, store them in a file named `.env` in the root of your project. The `.gitignore` file created earlier already says to ignore this file from git, so these won't end up in source control (this is especially important on an open source project where you wouldn't want people to have full access to your configuration settings).

One thing you will need in your `.env` file is an application secret, which should be random. One way to do this is with the following command:

```bash
echo "APP_SECRET=`openssl rand -base64 32`" >> .env
```

For the next step, you need to [sign up for a free Okta Developer account](https://developer.okta.com/signup/), if you haven't already. Once you sign up, you'll be given a unique Okta Org URL. You'll need to save this in your `.env` file. Each line should have a separate environment variable with syntax like `ORG_URL=https://{yourOktaDomain}`.

After logging into your dev console, click the **Applications** tab, click **Add Application**, then select the **Web** option. You can keep all these settings at their default for now, and just change the name. If you already know the URI(s) where you will be hosting your application, this is where you would add them. You can always come back here later.

{% img blog/simple-multifactor-authentication-in-node/add-application.png alt:"Add Application" width:"800" %}{: .center-image }

Once you create the application, you will get a **Client ID** and **Client Secret**. You'll save these variables along with the **Base URI** you just entered in the last screen. Your `.env` file should now look something like this:

```bash
APP_SECRET=super-secret-string
ORG_URL=https://{yourOktaDomain}
HOST_URL=http://localhost:8080
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
```

By keeping these variables in a separate file, it not only keeps them private, but also makes it easy to deploy the same code to different environments (e.g. development, staging, and production) by just swapping out one file.

## Add a Protected Dashboard to Support MFA in Your Node Application

Your application is currently public, which is great for the homepage. To add a protected route for after your users log in, you can create a couple new files:

**views/dashboard.jade**
```jade
extends layout

block content
  h1 Dashboard
  p Hi #{given_name}! Welcome to your dashboard
  p Click #[a(href="/logout") here] to log out
```

**routes/dashboard.js**
```javascript
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('dashboard', req.userinfo)
})

module.exports = router;
```

At the time of this writing, Express Generator uses the [Jade](http://jade-lang.com/) templating engine (which is now called Pug) by default. When you call `res.render` you pass in the name of the template and the context. In this example, the context is `req.userinfo`, which contains information about the user. That lets you access data like `given_name` inside the template.

On the homepage, you'll also need to add a link to the dashboard.

**views/index.jade**
```jade
  p Click #[a(href="/dashboard") here] to view your dashboard
```

The place where all this ties together is in `app.js`. You need to add `/dashboard` and `/logout` routes to the Express app, and you also need to tell the app to use Okta's OpenID Connect middleware.

**app.js**
```javascript

// This code should come after the following line:
// var app = express()

const session = require('express-session')
app.use(session({
  secret: process.env.APP_SECRET,
  resave: true,
  saveUninitialized: false,
}))

const { ExpressOIDC } = require('@okta/oidc-middleware')
const oidc = new ExpressOIDC({
  issuer: `${process.env.ORG_URL}/oauth2/default`,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: `${process.env.HOST_URL}/authorization-code/callback`,
  scope: 'openid profile',
})
app.use(oidc.router)

const dashboardRouter = require('./routes/dashboard')
app.use('/dashboard', oidc.ensureAuthenticated(), dashboardRouter)
app.use('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})
```

You also need Node to be able to read the `.env` file to access the environment variables. You can do this by using a module called `dotenv`. It needs to be the first thing in the code, so it should go at the top of `bin/www`, which is the entry point to the app. Just make sure it goes below the shebang (`#!/usr/bin/env node`).

**bin/www**
```javascript
require('dotenv').config()
```

Now that you've added the necessary code, you just need to add the new dependencies and start the app again.

```bash
npm install @okta/oidc-middleware express-session dotenv
PORT=8080 npm start
```

Test that the app works by visiting the dashboard. If you notice it takes you there without asking for your credentials, it could be because you're already logged into your Okta Org URL. Try again in Incognito Mode (or your favorite browser's equivalent) and you'll see that it asks you to log in to Okta when you click the dashboard link. You will be redirected to the dashboard as soon as you log in.

{% img blog/simple-multifactor-authentication-in-node/dashboard.png alt:"Dashboard" width:"300" %}{: .center-image }

## Add Multi-Factor Authentication to Your Node Application

The real bread-and-butter behind this tutorial is adding MFA. It turns out Okta makes this extremely simple as well! Now that you have your Okta Developer account already set up and hooked into a Node app, you don't even need to change any of your code around. From this point on, it's just a matter of changing some configuration settings inside Okta.

From inside your developer portal, the default view is `Developer Console`. In order to access the multifactor settings, the easiest way to find it is to switch to the `Classic UI`. You can do this by selecting it in the drop-down at the top left corner of the page. You'll know you're in the right place if you have a blue background.

{% img blog/simple-multifactor-authentication-in-node/switch-to-classic-ui.png alt:"Switch to classic UI" width:"300" %}{: .center-image }

Once you've enabled the Classic UI, you can click on the **Security** tab, then click **Multifactor** to select some factor types to enable. You can choose which applications will use MFA, but this step is required to enable it on any of them. There are quite a few options, but for now choose Okta Verify, Google Authenticator, and SMS Authentication.

{% img blog/simple-multifactor-authentication-in-node/factor-types.png alt:"Multi-factor Authentication Factor Types" width:"800" %}{: .center-image }

Back in your application settings (click on the **Applications** tab, then click on the application you want to have MFA), click on the **Sign On** tab to view your policy settings. You'll notice under **Sign On Policy** that you have a single rule called `Default sign on rule` that you cannot edit. This is the rule that allows users to sign in to the app.

Click on `Add Rule` to create a new rule. You have a lot of flexibility here. For example, you can define zones where users have to re-enter their password every 20 minutes, groups of users that are denied access, or make multifactor authentication required once a week. For now, create a rule that applies to all users of the app in any location. Give it a useful name like `Require Multifactor`, then check the box for `Prompt for factor` and select `Every sign on`.

{% img blog/simple-multifactor-authentication-in-node/app-sign-on-rule.png alt:"App Sign On Rule" width:"800" %}{: .center-image }

Head back to your Node app running at `http://localhost:8080` and sign in. This time you'll be prompted to sign up for a form of Multifactor Authentication. By default, all the forms we allowed are optional, so you can choose which of the three you want to use. If you want to change which ones are required and which are optional, you can do this back in **Security** → **Multifactor** under the `Factor Enrollment` tab. Like the sign on policies, you also have the option of setting different rules for different groups of users.

## Learn More About Node and Secure Multi-Factor Authentication with Okta

If you've learned anything today, hopefully it's that securing your application doesn't need to be scary. You can add really robust user sign on with multi-factor authentication in a single afternoon without breaking a sweat! Your users can rest assured that their data is in good hands.

If you'd like to learn more about Node, Okta, and authentication or MFA, take a look at these resources, as well as the rest of the Okta developer blog:

* [More detail about the different factor types](https://support.okta.com/help/Documentation/Knowledge_Article/Multifactor-Authentication-1320134400)
* [Okta Multi-Factor Authentication Use Cases](/use_cases/mfa/)
* [Multi-factor Authentication: Because Phishing Happens](https://www.okta.com/security-blog/2018/04/multi-factor-authentication-because-phishing-happens/)
* [Two-Factor Authentication vs. Multi-Factor Authentication: What Are the Risks?](https://www.okta.com/blog/2016/12/two-factor-authentication-vs-multi-factor-authentication-what-are-the-risks/)
* [Build User Registration with Node, React, and Okta](/blog/2018/02/06/build-user-registration-with-node-react-and-okta)
* [Okta OIDC Middleware Documentation](https://github.com/okta/okta-oidc-js/tree/master/packages/oidc-middleware)

And as always, we'd love your feedback! Hit us up in the comments below, or on Twitter [@oktadev](https://twitter.com/OktaDev).
