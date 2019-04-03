---
layout: blog_post
title: "Use TypeScript to Build a Node API with Express"
author: reverentgeek
description: "This tutorial walks you through building a simple and secure Node application using TypeScript, Express, and Okta."
tags: [authentication, typescript, web, express, node]
tweets:
- "Can you build a @nodejs application using @typescriptlang? @reverentgeek shows you how!"
- "A quick introduction to building a @nodejs application using @typescriptlang"
- "Build a @nodejs application using @typescriptlang and #expressjs"
image: blog/node-express-typescript/node-express-typescript.jpg
---

Like it or not, JavaScript has been helping developers power the Internet since 1995. In that time, JavaScript usage has grown from small user experience enhancements to complex full-stack applications using Node.js on the server and one of many frameworks on the client such as Angular, React, or Vue. 

Today, building JavaScript applications _at scale_ remains a challenge. More and more teams are turning to TypeScript to supplement their JavaScript projects. 

Node.js server applications can benefit from using TypeScript, as well. The goal of this tutorial is to show you how to build a new Node.js application using TypeScript and Express.

## The Case for TypeScript

As a web developer, I long ago stopped resisting JavaScript, and have grown to appreciate its flexibility and ubiquity. Language features added to ES2015 and beyond have significantly improved its utility and reduced common frustrations of writing applications.

However, larger JavaScript projects demand tools such as ESLint to catch common mistakes, and greater discipline to saturate the code base with useful tests. As with any software project, a healthy team culture that includes a peer review process can improve quality and guard against issues that can creep into a project.

The primary benefits of using TypeScript are to catch more errors before they go into production and make it easier to work with your code base. 

TypeScript is not a different language. It's a flexible _superset_ of JavaScript with ways to describe optional data types. All "standard" and valid JavaScript is also valid TypeScript. You can dial in as much or little as you desire. 

As soon as you add the TypeScript compiler or a TypeScript plugin to your favorite code editor, there are immediate safety and productivity benefits. TypeScript can alert you to misspelled functions and properties, detect passing the wrong types of arguments or the wrong number of arguments to functions, and provide smarter autocomplete suggestions.

## Build a Guitar Inventory Application with TypeScript and Node.js


Among guitar players, there's a joke everyone _should_ understand.

> Q: "How many guitars do you _need_?"

> A: "_n_ + 1. Always one more."

In this tutorial, you are going to create a new Node.js application to keep track of an inventory of guitars. In a nutshell, this tutorial uses [Node.js](https://nodejs.org) with [Express](https://expressjs.com/), [EJS](https://github.com/mde/ejs), and [PostgreSQL](https://www.postgresql.org/) on the backend, [Vue](https://vuejs.org/), [Materialize](https://materializecss.com/), and [Axios](https://github.com/axios/axios) on the frontend, [Okta](https://developer.okta.com/) for account registration and authorization, and [TypeScript](https://www.typescriptlang.org/) to govern the JavaScripts!

{% img blog/node-express-typescript/guitar-inventory-demo.gif alt:"Guitar Inventory Demo" width:"800" %}{: .center-image }

## Create Your Node.js Project

Open up a terminal (Mac/Linux) or a command prompt (Windows) and type the following command:

```
node --version
```

If you get an error, or the version of Node.js you have is less than version 8, you'll need to install Node.js. On Mac or Linux, I recommend you first install [nvm](https://github.com/creationix/nvm) and use nvm to install Node.js. On Windows, I recommend you use [Chocolatey](https://chocolatey.org/).

After ensuring you have a recent version of Node.js installed, create a folder for your project.

```bash
mkdir guitar-inventory
cd guitar-inventory
```

Use `npm` to initialize a `package.json` file.

```bash
npm init -y
```

### Hello, world!

In this sample application, [Express](https://expressjs.com/) is used to serve web pages and implement an API. Dependencies are installed using `npm`. Add Express to your project with the following command.

```bash
npm install express
```

Next, open the project in your editor of choice.

> If you don't already have a favorite code editor, I use and recommend [Visual Studio Code](https://code.visualstudio.com/). VS Code has exceptional support for JavaScript and Node.js, such as smart code completion and debugging, and there's a vast library of free extensions contributed by the community.


Create a folder named `src`. In this folder, create a file named `index.js`. Open the file and add the following JavaScript.

```javascript
const express = require( "express" );
const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
```

Next, update `package.json` to instruct `npm` on how to run your application. Change the `main` property value to point to `src/index.js`, and add a `start` script to the `scripts` object.

```json
  "main": "src/index.js",
  "scripts": {
    "start": "node .",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

Now, from the terminal or command line, you can launch the application.

```bash
npm run start
```

If all goes well, you should see this message written to the console.

```
server started at http://localhost:8080
```

Launch your browser and navigate to `http://localhost:8080`. You should see the text "Hello world!"

{% img blog/node-express-typescript/hello-world.jpg alt:"Hello World" width:"500" %}{: .center-image }

> Note: To stop the web application, you can go back to the terminal or command prompt and press `CTRL+C`.

## Set Up Your Node.js Project to Use TypeScript

The first step is to add the TypeScript compiler. You can install the compiler as a developer dependency using the `--save-dev` flag.

```bash
npm install --save-dev typescript
```

The next step is to add a `tsconfig.json` file. This file instructs TypeScript how to compile (transpile) your TypeScript code into plain JavaScript. 

Create a file named `tsconfig.json` in the root folder of your project, and add the following configuration.

```javascript
{
    "compilerOptions": {
        "module": "commonjs",
        "esModuleInterop": true,
        "target": "es6",
        "noImplicitAny": true,
        "moduleResolution": "node",
        "sourceMap": true,
        "outDir": "dist",
        "baseUrl": ".",
        "paths": {
            "*": [
                "node_modules/*"
            ]
        }
    },
    "include": [
        "src/**/*"
    ]
}
```

Based on this `tsconfig.json` file, the TypeScript compiler will (attempt to) compile any files ending with `.ts` it finds in the `src` folder, and store the results in a folder named `dist`. Node.js uses the CommonJS module system, so the value for the `module` setting is `commonjs`. Also, the target version of JavaScript is ES6 (ES2015), which is compatible with modern versions of Node.js.

It's also a great idea to add `tslint` and create a `tslint.json` file that instructs TypeScript how to lint your code. If you're not familiar with linting, it is a code analysis tool to alert you to potential problems in your code beyond syntax issues.

Install `tslint` as a developer dependency.

```bash
npm install --save-dev tslint
```

Next, create a new file in the root folder named `tslint.json` file and add the following configuration.

```javascript
{
    "defaultSeverity": "error",
    "extends": [
        "tslint:recommended"
    ],
    "jsRules": {},
    "rules": {
        "trailing-comma": [ false ]
    },
    "rulesDirectory": []
}
```

Next, update your `package.json` to change `main` to point to the new `dist` folder created by the TypeScript compiler. Also, add a couple of scripts to execute TSLint and the TypeScript compiler just before starting the Node.js server.

```
  "main": "dist/index.js",
  "scripts": {
    "prebuild": "tslint -c tslint.json -p tsconfig.json --fix",
    "build": "tsc",
    "prestart": "npm run build",
    "start": "node .",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

Finally, change the extension of the `src/index.js` file from `.js` to `.ts`, the TypeScript extension, and run the start script. 

```bash
npm run start
```

> Note: You can run TSLint and the TypeScript compiler without starting the Node.js server using `npm run build`.

### TypeScript errors

Oh no! Right away, you may see some errors logged to the console like these.

```bash

ERROR: /Users/reverentgeek/Projects/guitar-inventory/src/index.ts[12, 5]: Calls to 'console.log' are not allowed.

src/index.ts:1:17 - error TS2580: Cannot find name 'require'. Do you need to install type definitions for node? Try `npm i @types/node`.

1 const express = require( "express" );
                  ~~~~~~~

src/index.ts:6:17 - error TS7006: Parameter 'req' implicitly has an 'any' type.

6 app.get( "/", ( req, res ) => {
                  ~~~
```

The two most common errors you may see are syntax errors and missing type information. TSLint considers using `console.log` to be an issue for production code. The best solution is to replace uses of console.log with a logging framework such as [winston](https://www.npmjs.com/package/winston). For now, add the following comment to `src/index.ts` to disable the rule.

```typescript
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );
```

TypeScript prefers to use the `import` module syntax over `require`, so you'll start by changing the first line in `src/index.ts` from:

```typescript
const express = require( "express" );
```

to:

```typescript
import express from "express";
```

### Getting the right types

To assist TypeScript developers, library authors and community contributors publish companion libraries called [TypeScript declaration files](http://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html). Declaration files are published to the [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) open source repository, or sometimes found in the original JavaScript library itself.

Update your project so that TypeScript can use the type declarations for Node.js and Express.

```bash
npm install --save-dev @types/node @types/express
```

Next, rerun the start script and verify there are no more errors.

```bash
npm run start
```

## Build a Better User Interface with Materialize and EJS

Your Node.js application is off to a great start, but perhaps not the best looking, yet. This step adds [Materialize](https://materializecss.com/), a modern CSS framework based on Google's Material Design, and [Embedded JavaScript Templates](https://www.npmjs.com/package/ejs) (EJS), an HTML template language for Express. Materialize and EJS are a good foundation for a much better UI.

First, install EJS as a dependency.

```bash
npm install ejs
```

Next, make a new folder under `/src` named `views`. In the `/src/views` folder, create a file named `index.ejs`. Add the following code to `/src/views/index.ejs`.

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Guitar Inventory</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
<body>
    <div class="container">
        <h1 class="header">Guitar Inventory</h1>
        <a class="btn" href="/guitars"><i class="material-icons right">arrow_forward</i>Get started!</a>
    </div>
</body>
</html>
```

Update `/src/index.ts` with the following code.

```typescript
import express from "express";
import path from "path";
const app = express();
const port = 8080; // default port to listen

// Configure Express to use EJS
app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    // render the index template
    res.render( "index" );
} );

// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );
```

### Add an asset build script for Typescript

The TypeScript compiler does the work of generating the JavaScript files and copies them to the `dist` folder. However, it does not copy the other types of files the project needs to run, such as the EJS view templates. To accomplish this, create a build script that copies all the other files to the `dist` folder.

Install the needed modules and TypeScript declarations using these commands.

```bash
npm install --save-dev ts-node shelljs fs-extra nodemon rimraf npm-run-all
npm install --save-dev @types/fs-extra @types/shelljs
```

Here is a quick overview of the modules you just installed.

|Module|Description|
|------|-----------|
|[`ts-node`](https://www.npmjs.com/package/ts-node)|Use to run TypeScript files directly.|
|[shelljs](https://www.npmjs.com/package/shelljs)|Use to execute shell commands such as to copy files and remove directories.|
|[fs-extra](https://www.npmjs.com/package/fs-extra)|A module that extends the Node.js file system (`fs`) module with features such as reading and writing JSON files.|
|[rimraf](https://www.npmjs.com/package/rimraf)|Use to recursively remove folders.|
|[npm-run-all](https://www.npmjs.com/package/npm-run-all)|Use to execute multiple `npm` scripts sequentially or in parallel.|
|[nodemon](https://www.npmjs.com/package/nodemon)|A handy tool for running Node.js in a development environment. Nodemon watches files for changes and automatically restarts the Node.js application when changes are detected. No more stopping and restarting Node.js!|

Make a new folder in the root of the project named `tools`. Create a file in the `tools` folder named `copyAssets.ts`. Copy the following code into this file.

```typescript
import * as shell from "shelljs";

// Copy all the view templates
shell.cp( "-R", "src/views", "dist/" );
```

### Update npm scripts

Update the `scripts` in `package.json` to the following code.

```javascript
  "scripts": {
    "clean": "rimraf dist/*",
    "copy-assets": "ts-node tools/copyAssets",
    "lint": "tslint -c tslint.json -p tsconfig.json --fix",
    "tsc": "tsc",
    "build": "npm-run-all clean lint tsc copy-assets",
    "dev:start": "npm-run-all build start",
    "dev": "nodemon --watch src -e ts,ejs --exec npm run dev:start",
    "start": "node .",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

> Note: If you are not familiar with using `npm` scripts, they can be very powerful and useful to any Node.js project. Scripts can be chained together in several ways. One way to chain scripts together is to use the `pre` and `post` prefixes. For example, if you have one script labeled `start` and another labeled `prestart`, executing `npm run start` at the terminal will first run `prestart`, and only after it successfully finishes does `start` run.

Now run the application and navigate to http://localhost:8080.

```bash
npm run dev
```

{% img blog/node-express-typescript/guitar-inventory-home-v2.jpg alt:"Guitar Inventory home page" width:"500" %}{: .center-image }

The home page is starting to look better! Of course, the **Get Started** button leads to a disappointing error message. No worries! The fix for that is coming soon!

## A Better Way to Manage Configuration Settings in Node.js

Node.js applications typically use environment variables for configuration. However, managing environment variables can be a chore. A popular module for managing application configuration data is [dotenv](https://www.npmjs.com/package/dotenv).

Install `dotenv` as a project dependency.

```bash
npm install dotenv
npm install --save-dev @types/dotenv
```

Create a file named `.env` in the root folder of the project, and add the following code. 

```bash
# Set to production when deploying to production
NODE_ENV=development

# Node.js server configuration
SERVER_PORT=8080
```

> Note: When using a source control system such as `git`, **do not** add the `.env` file to source control. Each environment requires a custom `.env` file. It is recommended you document the values expected in the `.env` file in the project README or a separate `.env.sample` file.

Now, update `src/index.ts` to use `dotenv` to configure the application server port value.

```typescript
import dotenv from "dotenv";
import express from "express";
import path from "path";

// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime 
// as if it were an environment variable
const port = process.env.SERVER_PORT;

const app = express();

// Configure Express to use EJS
app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    // render the index template
    res.render( "index" );
} );

// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );
```

You will use the `.env` for much more configuration information as the project grows.

## Easily Add Authentication to Node and Express

Adding user registration and login (authentication) to any application is not a trivial task. The good news is Okta makes this step very easy. To begin, create a free developer account with Okta. First, navigate to [developer.okta.com](https://developer.okta.com/) and click the **Create Free Account** button, or click the [Sign Up](https://developer.okta.com/signup/) button.

{% img blog/node-express-typescript/add-application-00.jpg alt:"Sign up for free account" width:"800" %}{: .center-image }

After creating your account, click the **Applications** link at the top, and then click **Add Application**.

{% img blog/node-express-typescript/add-application-01.jpg alt:"Create application" width:"500" %}{: .center-image }

Next, choose a **Web Application** and click **Next**.

{% img blog/node-express-typescript/add-application-02.jpg alt:"Create a web application" width:"800" %}{: .center-image }

Enter a name for your application, such as *Guitar Inventory*. Verify the port number is the same as configured for your local web application. Then, click **Done** to finish creating the application.

{% img blog/node-express-typescript/add-application-03.jpg alt:"Application settings" width:"800" %}{: .center-image }

Copy and paste the following code into your `.env` file.

```bash
# Okta configuration
OKTA_ORG_URL=https://{yourOktaDomain}
OKTA_CLIENT_ID={yourClientId}
OKTA_CLIENT_SECRET={yourClientSecret}
```

In the Okta application console, click on your new application's **General** tab, and find near the bottom of the page a section titled "Client Credentials." Copy the **Client ID** and **Client secret** values and paste them into your `.env` file to replace `{yourClientId}` and `{yourClientSecret}`, respectively.

{% img blog/node-express-typescript/add-application-04.jpg alt:"Client credentials" width:"800" %}{: .center-image }


### Enable self-service registration

One of the great features of Okta is allowing users of your application to sign up for an account. By default, this feature is disabled, but you can easily enable it. First, click on the **Users** menu and select **Registration**.

{% img blog/node-express-typescript/self-service-registration-01.jpg alt:"User registration" width:"500" %}{: .center-image }

1. Click on the **Edit** button.
2. Change **Self-service registration** to *Enabled*.
3. Click the **Save** button at the bottom of the form.

{% img blog/node-express-typescript/self-service-registration-02.jpg alt:"Enable self-registration" width:"800" %}{: .center-image }

### Secure your Node.js application

The last step to securing your Node.js application is to configure Express to use the [Okta OpenId Connect (OIDC) middleware](https://www.npmjs.com/package/@okta/oidc-middleware).

```bash
npm install @okta/oidc-middleware@1.0.2 express-session
npm install --save-dev @types/express-session
```

Next, update your `.env` file to add a `HOST_URL` and `SESSION_SECRET` value. You may change the `SESSION_SECRET` value to any string you wish.

```bash
# Node.js server configuration
SERVER_PORT=8080
HOST_URL=http://localhost:8080
SESSION_SECRET=MySuperCoolAndAwesomeSecretForSigningSessionCookies
```

Create a folder under `src` named `middleware`. Add a file to the `src/middleware` folder named `sessionAuth.ts`. Add the following code to `src/middleware/sessionAuth.ts`.

```typescript
import { ExpressOIDC } from "@okta/oidc-middleware";
import session from "express-session";

export const register = ( app: any ) => {
    // Create the OIDC client
    const oidc = new ExpressOIDC( {
        client_id: process.env.OKTA_CLIENT_ID,
        client_secret: process.env.OKTA_CLIENT_SECRET,
        issuer: `${ process.env.OKTA_ORG_URL }/oauth2/default`,
        redirect_uri: `${ process.env.HOST_URL }/authorization-code/callback`,
        scope: "openid profile"
    } );

    // Configure Express to use authentication sessions
    app.use( session( {
        resave: true,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET
    } ) );

    // Configure Express to use the OIDC client router
    app.use( oidc.router );

    // add the OIDC client to the app.locals
    app.locals.oidc = oidc;
};
```

At this point, if you are using a code editor like VS Code, you may see TypeScript complaining about the `@okta/oidc-middleware` module. At the time of this writing, this module does not yet have an official TypeScript declaration file. For now, create a file in the `src` folder named `global.d.ts` and add the following code.

```typescript
declare module "@okta/oidc-middleware";
```

### Refactor routes

As the application grows, you will add many more routes. It is a good idea to define all the routes in one area of the project. Make a new folder under `src` named `routes`. Add a new file to `src/routes` named `index.ts`. Then, add the following code to this new file.

```typescript
import * as express from "express";

export const register = ( app: express.Application ) => {
    const oidc = app.locals.oidc;

    // define a route handler for the default home page
    app.get( "/", ( req: any, res ) => {
        res.render( "index" );
    } );

    // define a secure route handler for the login page that redirects to /guitars
    app.get( "/login", oidc.ensureAuthenticated(), ( req, res ) => {
        res.redirect( "/guitars" );
    } );

    // define a route to handle logout
    app.get( "/logout", ( req: any, res ) => {
        req.logout();
        res.redirect( "/" );
    } );

    // define a secure route handler for the guitars page
    app.get( "/guitars", oidc.ensureAuthenticated(), ( req: any, res ) => {
        res.render( "guitars" );
    } );
};
```

Next, update `src/index.ts` to use the `sessionAuth` and `routes` modules you created.

```typescript
import dotenv from "dotenv";
import express from "express";
import path from "path";
import * as sessionAuth from "./middleware/sessionAuth";
import * as routes from "./routes";

// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;

const app = express();

// Configure Express to use EJS
app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );

// Configure session auth
sessionAuth.register( app );

// Configure routes
routes.register( app );

// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );
```

Next, create a new file for the guitar list view template at `src/views/guitars.ejs` and enter the following HTML.

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Guitar Inventory</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
<body>
    <div class="container">
        <h1 class="header">Guitar Inventory</h1>
        <p>Your future list of guitars!</p>
    </div>
</body>
</html>
```

Finally, run the application.

```bash
npm run dev
```

> Note: To verify authentication is working as expected, open a new browser or use a private/incognito browser window.

Click the **Get Started** button. If everything goes well, log in with your Okta account, and Okta should automatically redirect you back to the "Guitar List" page!

{% img blog/node-express-typescript/okta-login.jpg alt:"Okta login" width:"500" %}{: .center-image }

## Add a Navigation Menu to Your Node + Typescript App

With authentication working, you can take advantage of the user profile information returned from Okta. The OIDC middleware automatically attaches a `userContext` object and an `isAuthenticated()` function to every request. This `userContext` has a `userinfo` property that contains information that looks like the following object.

```javascript
{ 
  sub: '00abc12defg3hij4k5l6',
  name: 'First Last',
  locale: 'en-US',
  preferred_username: 'account@company.com',
  given_name: 'First',
  family_name: 'Last',
  zoneinfo: 'America/Los_Angeles',
  updated_at: 1539283620 
}
```

The first step is get the user profile object and pass it to the views as data. Update the `src/routes/index.ts` with the following code.

```typescript
import * as express from "express";

export const register = ( app: express.Application ) => {
    const oidc = app.locals.oidc;

    // define a route handler for the default home page
    app.get( "/", ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        res.render( "index", { isAuthenticated: req.isAuthenticated(), user } );
    } );

    // define a secure route handler for the login page that redirects to /guitars
    app.get( "/login", oidc.ensureAuthenticated(), ( req, res ) => {
        res.redirect( "/guitars" );
    } );

    // define a route to handle logout
    app.get( "/logout", ( req: any, res ) => {
        req.logout();
        res.redirect( "/" );
    } );

    // define a secure route handler for the guitars page
    app.get( "/guitars", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        res.render( "guitars", { isAuthenticated: req.isAuthenticated(), user } );
    } );
};
```

Make a new folder under `src/views` named `partials`. Create a new file in this folder named `nav.ejs`. Add the following code to `src/views/partials/nav.ejs`.

```html
<nav>
    <div class="nav-wrapper">
        <a href="/" class="brand-logo"><% if ( user ) { %><%= user.name %>'s <% } %>Guitar Inventory</a>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
            <li><a href="/guitars">My Guitars</a></li>
            <% if ( isAuthenticated ) { %>
            <li><a href="/logout">Logout</a></li>
            <% } %>
            <% if ( !isAuthenticated ) { %>
            <li><a href="/login">Login</a></li>
            <% } %>
        </ul>
    </div>
</nav>
```

Modify the `src/views/index.ejs` and `src/views/guitars.ejs` files. Immediately following the `<body>` tag, insert the following code.

```html
<body>
    <% include partials/nav %>
```

With these changes in place, your application now has a navigation menu at the top that changes based on the login status of the user.

{% img blog/node-express-typescript/navigation.jpg alt:"Navigation" width:"800" %}{: .center-image }

## Create an API with Node and PostgreSQL

The next step is to add the API to the Guitar Inventory application. However, before moving on, you need a way to store data.

### Create a PostgreSQL database

This tutorial uses [PostgreSQL](https://www.postgresql.org/). To make things easier, use [Docker](https://www.docker.com) to set up an instance of PostgreSQL. If you don't already have Docker installed, you can follow the [install guide](https://docs.docker.com/install/#supported-platforms).

Once you have Docker installed, run the following command to download the latest PostgreSQL container.

```bash
docker pull postgres:latest
```

Now, run this command to create an instance of a PostgreSQL database server. Feel free to change the administrator password value.

```bash
docker run -d --name guitar-db -p 5432:5432 -e 'POSTGRES_PASSWORD=p@ssw0rd42' postgres
```

> Note: If you already have PostgreSQL installed locally, you will need to change the `-p` parameter to map port 5432 to a different port that does not conflict with your existing instance of PostgreSQL.

Here is a quick explanation of the previous Docker parameters.

| parameter | description |
|:----------|:------------|
|-d         |This launches the container in daemon mode, so it runs in the background.|
|--name|This gives your Docker container a friendly name, which is useful for stopping and starting containers|
|-p|This maps the host (your computer) port 5432 to the container's port 5432. PostgreSQL, by default, listens for connections on TCP port 5432.|
|-e|This sets an environment variable in the container. In this example, the administrator password is `p@ssw0rd42`. You can change this value to any password you desire.|
|postgres|This final parameter tells Docker to use the postgres image.|

> Note: If you restart your computer, may need to restart the Docker container. You can do that using the `docker start guitar-db` command.

Install the PostgreSQL client module and type declarations using the following commands.

```bash
npm install pg pg-promise
npm install --save-dev @types/pg
```

### Database configuration settings

Add the following settings to the end of the `.env` file. 

```bash
# Postgres configuration
PGHOST=localhost
PGUSER=postgres
PGDATABASE=postgres
PGPASSWORD=p@ssw0rd42
PGPORT=5432
```
*Note: If you changed the database administrator password, be sure to replace the default `p@ssw0rd42` with that password in this file.*

### Add a database build script

You need a build script to initialize the PostgreSQL database. This script should read in a `.pgsql` file and execute the SQL commands against the local database.

In the `tools` folder, create two files: `initdb.ts` and `initdb.pgsql`. Copy and paste the following code into `initdb.ts`.

```typescript
import dotenv from "dotenv";
import fs from "fs-extra";
import { Client } from "pg";

const init = async () => {
    // read environment variables
    dotenv.config();
    // create an instance of the PostgreSQL client
    const client = new Client();
    try {
        // connect to the local database server
        await client.connect();
        // read the contents of the initdb.pgsql file
        const sql = await fs.readFile( "./tools/initdb.pgsql", { encoding: "UTF-8" } );
        // split the file into separate statements
        const statements = sql.split( /;\s*$/m );
        for ( const statement of statements ) {
            if ( statement.length > 3 ) {
                // execute each of the statements
                await client.query( statement );
            }
        }
    } catch ( err ) {
        console.log( err );
        throw err;
    } finally {
        // close the database client
        await client.end();
    }
};

init().then( () => {
    console.log( "finished" );
} ).catch( () => {
    console.log( "finished with errors" );
} );
```

Next, copy and paste the following code into `initdb.pgsql`.

```sql
-- Drops guitars table
DROP TABLE IF EXISTS guitars;

-- Creates guitars table
CREATE TABLE IF NOT EXISTS guitars (
    id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
    , user_id varchar(50) NOT NULL
    , brand varchar(50) NOT NULL
    , model varchar(50) NOT NULL
    , year smallint NULL 
    , color varchar(50) NULL
);
```

Next, add a new script to `package.json`.

```javascript
    "initdb": "ts-node tools/initdb",
```

Now, go to the terminal and run the new script.

```bash
npm run initdb
```

You should see the message `finished` at the console. A new table named `guitars` is now in your database! Any time you want to reset your database, just rerun the script.

### Add API routes in Node.js

To complete the API, you need to add new routes to Express to create, query, update, and delete guitars. First, create a new file under `src/routes` named `api.ts`. Add the following code to this file.

```typescript
import * as express from "express";
import pgPromise from "pg-promise";

export const register = ( app: express.Application ) => {
    const oidc = app.locals.oidc;
    const port = parseInt( process.env.PGPORT || "5432", 10 );
    const config = {
        database: process.env.PGDATABASE || "postgres",
        host: process.env.PGHOST || "localhost",
        port,
        user: process.env.PGUSER || "postgres"
    };

    const pgp = pgPromise();
    const db = pgp( config );

    app.get( `/api/guitars/all`, oidc.ensureAuthenticated(), async ( req: any, res ) => {
        try {
            const userId = req.userContext.userinfo.sub;
            const guitars = await db.any( `
                SELECT
                    id
                    , brand
                    , model
                    , year
                    , color
                FROM    guitars
                WHERE   user_id = $[userId]
                ORDER BY year, brand, model`, { userId } );
            return res.json( guitars );
        } catch ( err ) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json( { error: err.message || err } );
        }
    } );

    app.get( `/api/guitars/total`, oidc.ensureAuthenticated(), async ( req: any, res ) => {
        try {
            const userId = req.userContext.userinfo.sub;
            const total = await db.one( `
            SELECT  count(*) AS total
            FROM    guitars
            WHERE   user_id = $[userId]`, { userId }, ( data: { total: number } ) => {
                return {
                    total: +data.total
                };
            } );
            return res.json( total );
        } catch ( err ) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json( { error: err.message || err } );
        }
    } );

    app.get( `/api/guitars/find/:search`, oidc.ensureAuthenticated(), async ( req: any, res ) => {
        try {
            const userId = req.userContext.userinfo.sub;
            const guitars = await db.any( `
                SELECT
                    id
                    , brand
                    , model
                    , year
                    , color
                FROM    guitars
                WHERE   user_id = $[userId]
                AND   ( brand ILIKE $[search] OR model ILIKE $[search] )`,
                { userId, search: `%${ req.params.search }%` } );
            return res.json( guitars );
        } catch ( err ) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json( { error: err.message || err } );
        }
    } );

    app.post( `/api/guitars/add`, oidc.ensureAuthenticated(), async ( req: any, res ) => {
        try {
            const userId = req.userContext.userinfo.sub;
            const id = await db.one( `
                INSERT INTO guitars( user_id, brand, model, year, color )
                VALUES( $[userId], $[brand], $[model], $[year], $[color] )
                RETURNING id;`,
                { userId, ...req.body  } );
            return res.json( { id } );
        } catch ( err ) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json( { error: err.message || err } );
        }
    } );

    app.post( `/api/guitars/update`, oidc.ensureAuthenticated(), async ( req: any, res ) => {
        try {
            const userId = req.userContext.userinfo.sub;
            const id = await db.one( `
                UPDATE guitars
                SET brand = $[brand]
                    , model = $[model]
                    , year = $[year]
                    , color = $[color]
                WHERE
                    id = $[id]
                    AND user_id = $[userId]
                RETURNING
                    id;`,
                { userId, ...req.body  } );
            return res.json( { id } );
        } catch ( err ) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json( { error: err.message || err } );
        }
    } );

    app.delete( `/api/guitars/remove/:id`, oidc.ensureAuthenticated(), async ( req: any, res ) => {
        try {
            const userId = req.userContext.userinfo.sub;
            const id = await db.result( `
                DELETE
                FROM    guitars
                WHERE   user_id = $[userId]
                AND     id = $[id]`,
                { userId, id: req.params.id  }, ( r ) => r.rowCount );
            return res.json( { id } );
        } catch ( err ) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json( { error: err.message || err } );
        }
    } );
};
```

Update `src/routes/index.ts` to include the new `api` module.

```typescript
import * as express from "express";
import * as api from "./api";

export const register = ( app: express.Application ) => {
    const oidc = app.locals.oidc;

    // define a route handler for the default home page
    app.get( "/", ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        res.render( "index", { isAuthenticated: req.isAuthenticated(), user } );
    } );

    // define a secure route handler for the login page that redirects to /guitars
    app.get( "/login", oidc.ensureAuthenticated(), ( req, res ) => {
        res.redirect( "/guitars" );
    } );

    // define a route to handle logout
    app.get( "/logout", ( req: any, res ) => {
        req.logout();
        res.redirect( "/" );
    } );

    // define a secure route handler for the guitars page
    app.get( "/guitars", oidc.ensureAuthenticated(), ( req: any, res ) => {
        const user = req.userContext ? req.userContext.userinfo : null;
        res.render( "guitars", { isAuthenticated: req.isAuthenticated(), user } );
    } );

    api.register( app );
};
```

Finally, update `src/index.ts` to add a new configuration option immediately following the line to create the Express application. This code enables Express to parse incoming JSON data.

```typescript
const app = express();

// Configure Express to parse incoming JSON data
app.use( express.json() );
```

## Update the User Interface with Vue, Axios, and Parcel 

The API is ready. To complete the application, you need to add some code to the frontend to consume the API. You can take advantage of TypeScript with frontend code, as well.

This final step of the project uses [Vue](https://vuejs.org/) for frontend rendering, [Axios](https://www.npmjs.com/package/axios) for making HTTP calls to the backend API, and [Parcel](https://www.npmjs.com/package/parcel) to both transpile TypeScript and bundle all the dependencies together into a single JavaScript file.

First, install new dependencies at the console using the following commands.

```bash
npm install axios vue materialize-css
npm install --save-dev parcel-bundler @types/axios @types/materialize-css @types/vue
```

Make a new folder under `src` named `public`. Make a new folder under `src/public` named `js`. Create a file under `src/public/js` named `main.ts` and add the following code.

```typescript
import axios from "axios";
import * as M from "materialize-css";
import Vue from "vue";

// tslint:disable-next-line no-unused-expression
new Vue( {
    computed: {
        hazGuitars(): boolean {
            return this.isLoading === false && this.guitars.length > 0;
        },
        noGuitars(): boolean {
            return this.isLoading === false && this.guitars.length === 0;
        }
    },
    data() {
        return {
            brand: "",
            color: "",
            guitars: [],
            isLoading: true,
            model: "",
            selectedGuitar: "",
            selectedGuitarId: 0,
            year: ""
        };
    },
    el: "#app",
    methods: {
        addGuitar() {
            const guitar = {
                brand: this.brand,
                color: this.color,
                model: this.model,
                year: this.year
            };
            axios
                .post( "/api/guitars/add", guitar )
                .then( () => {
                    this.$refs.year.focus();
                    this.brand = "";
                    this.color = "";
                    this.model = "";
                    this.year = "";
                    this.loadGuitars();
                } )
                .catch( ( err: any ) => {
                    // tslint:disable-next-line:no-console
                    console.log( err );
                } );
        },
        confirmDeleteGuitar( id: string ) {
            const guitar = this.guitars.find( ( g ) => g.id === id );
            this.selectedGuitar = `${ guitar.year } ${ guitar.brand } ${ guitar.model }`;
            this.selectedGuitarId = guitar.id;
            const dc = this.$refs.deleteConfirm;
            const modal = M.Modal.init( dc );
            modal.open();
        },
        deleteGuitar( id: string ) {
            axios
                .delete( `/api/guitars/remove/${ id }` )
                .then( this.loadGuitars )
                .catch( ( err: any ) => {
                    // tslint:disable-next-line:no-console
                    console.log( err );
                } );
        },
        loadGuitars() {
            axios
                .get( "/api/guitars/all" )
                .then( ( res: any ) => {
                    this.isLoading = false;
                    this.guitars = res.data;
                } )
                .catch( ( err: any ) => {
                    // tslint:disable-next-line:no-console
                    console.log( err );
                } );
        }
    },
    mounted() {
        return this.loadGuitars();
    }
} );
```

Update `tsconfig.json` to exclude the `src/public` folder from the backend Node.js build process.

```javascript
{
    "compilerOptions": {
        "module": "commonjs",
        "esModuleInterop": true,
        "target": "es6",
        "noImplicitAny": true,
        "moduleResolution": "node",
        "sourceMap": true,
        "outDir": "dist",
        "baseUrl": ".",
        "paths": {
            "*": [
                "node_modules/*"
            ]
        }
    },
    "include": [
        "src/**/*"
    ],
    "exclude": [
        "src/public"
    ]
}
```

Create a new `tsconfig.json` file under `src/public/js` and add the following code. This TypeScript configuration is to compile `main.ts` for use in the browser.

```javascript
{
    "compilerOptions": {
        "lib": [
            "es6",
            "dom"
        ],
        "noImplicitAny": true,
        "allowJs": true,
        "target": "es5",
        "strict": true,
        "module": "es6",
        "moduleResolution": "node",
        "outDir": "../../../dist/public/js",
        "sourceMap": true
    }
}
```

Next, update `src/index.ts` to configure Express to serve static files from the `public` folder. Add this line after the code that configures Express to use `EJS`.

```typescript
...
// Configure Express to use EJS
app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );

// Configure Express to serve static files in the public folder
app.use( express.static( path.join( __dirname, "public" ) ) );
```

Update `src/views/guitars.ejs` to add the Vue application template and a reference to the `js/main.js` file.

{% raw %}

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Guitar Inventory</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
<body>
    <% include partials/nav %>
    <div class="container">
        <div id="app">
            <div class="row" id="guitarList">
                <h3>Guitar list</h3>
                <table v-if="hazGuitars">
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>Brand</th>
                            <th>Model</th>
                            <th>Color</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="guitar in guitars">
                            <td>{{ guitar.year }}</td>
                            <td>{{ guitar.brand }}</td>
                            <td>{{ guitar.model }}</td>
                            <td>{{ guitar.color }}</td>
                            <td>
                                <button id="guitarDelete" @click="confirmDeleteGuitar(guitar.id)" class="btn-small"><i class="material-icons right">delete</i>Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="noGuitars">No guitars yet!</p>
            </div>
            <div class="row" id="guitarEdit">
                <h3>Add a guitar</h3>
                <form class="col s12" @submit.prevent="addGuitar">
                    <div class="row">
                        <div class="input-field col s6">
                            <input v-model="year" ref="year" placeholder="2005" id="year" type="text" class="validate">
                            <label for="brand">Year</label>
                        </div>
                        <div class="input-field col s6">
                            <input v-model="brand" ref="brand" placeholder="Paul Reed Smith" id="brand" type="text" class="validate">
                            <label for="brand">Brand</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s6">
                            <input v-model="model" ref="model" placeholder="Custom 24" id="model" type="text" class="validate">
                            <label for="model">Model</label>
                        </div>
                        <div class="input-field col s6">
                            <input v-model="color" ref="color" placeholder="Whale Blue" id="color" type="text" class="validate">
                            <label for="model">Color</label>
                        </div>
                    </div>
                    <button id="guitarEditSubmit" class="btn" type="submit"><i class="material-icons right">send</i>Submit</button>
                </form>
            </div>
            <div id="deleteConfirm" ref="deleteConfirm" class="modal">
                <div class="modal-content">
                    <h4>Confirm delete</h4>
                    <p>Delete {{ selectedGuitar }}?</p>
                </div>
                <div class="modal-footer">
                    <button @click="deleteGuitar(selectedGuitarId)" class="modal-close btn-flat">Ok</button>
                    <button class="modal-close btn-flat">Cancel</button>
                </div>
            </div>
        </div>
    </div>
    <script src="js/main.js"></script></body>
</html>
```

{% endraw %}

Finally, update `package.json` to add a new `parcel` script, update the `build` script, and add a new `alias` section for Vue. The `alias` section points Parcel to the correct Vue file to bundle with `src/public/js/main.ts`. 

```javascript
  "scripts": {
    "clean": "rimraf dist/*",
    "copy-assets": "ts-node tools/copyAssets",
    "lint": "tslint -c tslint.json -p tsconfig.json --fix",
    "tsc": "tsc",
    "parcel": "parcel build src/public/js/main.ts -d dist/public/js",
    "build": "npm-run-all clean lint tsc copy-assets parcel",
    "dev:start": "npm-run-all build start",
    "dev": "nodemon --watch src -e ts,ejs --exec npm run dev:start",
    "start": "node .",
    "initdb": "ts-node tools/initdb",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "alias": {
    "vue": "./node_modules/vue/dist/vue.common.js"
  },
```

Now, restart the build and take your new web application for a spin!

```bash
npm run dev
```

{% img blog/node-express-typescript/guitar-inventory-empty.jpg alt:"Guitar Inventory" width:"800" %}{: .center-image }

## Learn More About Node and TypeScript

This tutorial only scratches the surface of what you can do with Node.js and TypeScript. Below are more resources to explore.

* [TypeScript Learning Resources](https://medium.com/@jcreamer898/typescript-learning-resources-b1205a98c47c) by [Jonathan Creamer](https://twitter.com/jcreamer898)
* [TypeScript Node Starter](https://github.com/Microsoft/TypeScript-Node-Starter) - an open-source project by Microsoft
* [TypeScript Deep Dive](https://basarat.gitbooks.io/typescript/) - Free online book by [Basarat Ali Syed](https://twitter.com/basarat)
* [TypeScript Documentation](http://www.typescriptlang.org/docs/home.html)
* [Vue TypeScript Support](https://vuejs.org/v2/guide/typescript.html)
* [Simple Node Authentication](https://developer.okta.com/blog/2018/04/24/simple-node-authentication)

You can find the completed [Guitar Inventory](https://github.com/oktadeveloper/okta-node-express-typescript-vue-example) project on GitHub.

Follow us for more great content and updates from our team! You can find us on [Twitter](https://twitter.com/OktaDev), [Facebook](https://www.facebook.com/oktadevelopers/), and [LinkedIn](https://www.linkedin.com/company/oktadev/). Questions? Hit us up in the comments below.
