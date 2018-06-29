---
layout: blog_post
title: "Tutorial: Build a Basic CRUD App with Node.js"
author: rdegges
description: "Learn how to securely store, update, and display user data in a simple Node.js / Express.js app."
tags: [node, express, openidconnect, oidc, user management]
tweets:
 - "Learning #nodejs? Check out our new article which walks you through building a full #expressjs application."
 - "We just published a new #nodejs article that shows you how to build a full website with database support. Go check it out!"
 - "Want to learn #nodejs? Read through our new tutorial where we'll show you how to build your own blog with user registration, login, etc."
 - "Come check out our latest article where we show you how to build a blog using #nodejs"
---

Node.js is eating the world. Many of the largest companies are building more and more of their websites and API services with Node.js, and there's no sign of a slowdown. I've been working with Node.js since 2012 and have been excited to see the community and tooling grow and evolve — there's no better time to get started with Node.js development than right now.

This tutorial will take you step-by-step through building a fully functional Node.js website. Along the way you'll learn about Express.js, the most popular web framework, user authentication with [OpenID Connect](https://developer.okta.com/blog/2017/07/25/oidc-primer-part-1), locking down routes to enforce login restrictions, and performing CRUD operations with a database (creating, reading, updating, and deleting data). This tutorial uses the following technologies but doesn't require any prior experience:

- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/) and [Pug](https://pugjs.org/api/getting-started.html)
- Okta's [OIDC-middleware](https://github.com/okta/okta-oidc-js/tree/master/packages/oidc-middleware) and [Node SDK](https://github.com/okta/okta-sdk-nodejs)
- [Sequelize.js](http://docs.sequelizejs.com/), a popular ORM for working with databases in Node.js

If you'd like to skip the tutorial and just check out the fully built project, you can go [view it on GitHub](https://github.com/rdegges/okta-express-blog).

## About Express.js

Express.js is the most popular web framework in the Node.js ecosystem. It's incredibly simple and minimalistic. Furthermore, there are thousands of developer libraries that work with Express, making developing with it fun and flexible.

{% img blog/tutorial-build-a-basic-crud-app-with-node/express-website-screenshot.png alt:"express website screenshot" width:"700" %}{: .center-image }

Regardless of whether you're trying to build a website or an API, Express.js provides tons of features and a nice developer experience.

Through this tutorial, you'll be building a simple blog. The blog you build will have a homepage that lists the most recent posts, a login page where users can authenticate, a dashboard page where users can create and edit posts, and logout functionality.

The blog will be built using Express.js, the user interface will be built using Pug, the authentication component will be handled by [Okta](https://developer.okta.com/), and the blog post storage and database management will be handled by Sequelize.js.

## Create Your Express.js App

Before we begin, make sure you have a recent version of Node.js installed. If you don't already have Node.js installed, please [visit this page](https://nodejs.org/en/download/package-manager/) and install it for your operating system before continuing.

To get your project started quickly you can leverage [express-generator](https://github.com/expressjs/generator). This is an officially maintained program that allows you to easily scaffold an Express.js website with minimal effort.

To install `express-generator` run:

```bash
npm install -g express-generator
```

Next, you need to initialize your project. To do this, use the newly installed express-generator program to bootstrap your application:

```bash
express --view pug blog
cd blog
npm install
npm start
```

The above command will initialize a new project called **blog**, move you into the new project folder, install all project dependencies, and start up a web server.

Once you've finished running the commands above, point your favorite browser to `http://localhost:3000` and you should see your application running:

{% img blog/tutorial-build-a-basic-crud-app-with-node/express-generator-page.png alt:"express generator page" width:"700" %}{: .center-image }


## Initialize Authentication

Dealing with user authentication in web apps is a huge pain for every developer. This is where Okta shines: it helps you secure your web applications with minimal effort. To get started, you'll need to create an OpenID Connect application in Okta. [Sign up for a forever-free developer account](https://developer.okta.com/signup/) (or log in if you already have one).

{% img blog/tutorial-build-a-basic-crud-app-with-node/okta-signup.png alt:"Okta signup page" width:"700" %}{: .center-image }

Once you've logged in and land on the dashboard page, copy down the **Org URL** pictured below. You will need this later.

{% img blog/tutorial-build-a-basic-crud-app-with-node/okta-org-url.png alt:"Okta Org URL" width:"700" %}{: .center-image }

Then create a new application by browsing to the **Applications** tab and clicking **Add Application**.

{% img blog/tutorial-build-a-basic-crud-app-with-node/okta-app-dashboard.png alt:"Okta app dashboard" width:"700" %}{: .center-image }

Next, click the **Web** platform option (since our blog project is a  web app).

{% img blog/tutorial-build-a-basic-crud-app-with-node/okta-create-app-platform.png alt:"Okta create app platform" width:"700" %}{: .center-image }

On the settings page, enter the following values:

- **Name**: Blog
- **Base URIs**: `http://localhost:3000`
- **Login redirect URIs**: `http://localhost:3000/users/callback`

You can leave all the other values unchanged.

{% img blog/tutorial-build-a-basic-crud-app-with-node/okta-create-app-settings.png alt:"Okta create app settings" width:"700" %}{: .center-image }

Now that your application has been created, copy down the **Client ID** and **Client secret** values on the following page, you'll need them soon.

{% img blog/tutorial-build-a-basic-crud-app-with-node/okta-app-secrets.png alt:"Okta app secrets" width:"700" %}{: .center-image }

Finally, create a new authentication token. This will allow your app to talk to Okta to retrieve user information, among other things. To do this, click the **API** tab at the top of the page followed by the **Create Token** button. Give your token a name, preferably the same name as your application, then click **Create Token**. Copy down this token value as you will need it soon.

{% img blog/tutorial-build-a-basic-crud-app-with-node/okta-create-token.png alt:"Okta create token" width:"700" %}{: .center-image }


## Install Dependencies

The first thing you need to do in order to initialize your Express.js app is install all of the required dependencies.

```bash
npm install express@4.16.3
npm install @okta/oidc-middleware@0.1.2
npm install @okta/okta-sdk-nodejs@1.1.0
npm install sqlite3@4.0.1
npm install sequelize@4.38.0
npm install async@2.6.1
npm install slugify@1.3.0
npm install express-session@1.15.6
```

## Define Database Models with Sequelize

The first thing I like to do when starting a new project is define what data my application needs to store, so I can model out exactly what data I'm handling.

Create a new file named `./models.js` and copy the following code inside of it.

```javascript
const Sequelize = require("sequelize");

const db = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite"
});

const Post = db.define("post", {
  title: { type: Sequelize.STRING },
  body: { type: Sequelize.TEXT },
  authorId: { type: Sequelize.STRING },
  slug: { type: Sequelize.STRING }
});

db.sync();

module.exports = { Post };
```

This code initializes a new SQLite database that will be used to store the blog data and also defines a model called `Post` which stores blog posts in the database. Each post has a title, a body, an author ID, and a slug field.

- The `title` field will hold the title of a post, eg: "A Great Article"
- The `body` field will hold the body of the article as HTML, eg: "<p>My first post!</p>"
- The `authorId` field will store the author's unique ID. This is a common pattern in relational databases: store just the identifier of a linked resource so you can look up the author's most up-to-date information later.
- The `slug` field will store the URL-friendly version of the post's title, eg: "a-great-article"

**NOTE**: If you've never used SQLite before, it's amazing. It's a database that stores your data in a single file. It's great for building applications that don't require a large amount of concurrency, like this simple blog.

The call to `db.sync();` at the bottom of the file will automatically create the database and all of the necessary tables once this JavaScript code runs.

## Initialize Your Express.js App

The next thing I like to do after defining my database models is to initialize my application code. This typically involves:

- Configuring application settings
- Installing middlewares that provide functionality to the application
- Handling errors
- Etc.

Open the `./app.js` file and replace its contents with the following code.

```javascript
const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const path = require("path");
const okta = require("@okta/okta-sdk-nodejs");
const session = require("express-session");
const ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;

const blogRouter = require("./routes/blog");
const usersRouter = require("./routes/users");

const app = express();
const client = new okta.Client({
  orgUrl: "{yourOktaOrgUrl}",
  token: "{yourOktaToken}"
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const oidc = new ExpressOIDC({
  issuer: "{yourOktaOrgUrl}/oauth2/default",
  client_id: "{yourOktaClientId}",
  client_secret: "{yourOktaClientSecret}",
  redirect_uri: "http://localhost:3000/users/callback",
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

app.use(session({
  secret: "{aLongRandomString}",
  resave: true,
  saveUninitialized: false
}));

app.use(oidc.router);

app.use((req, res, next) => {
  if (!req.userinfo) {
    return next();
  }

  client.getUser(req.userinfo.sub)
    .then(user => {
      req.user = user;
      res.locals.user = user;
      next();
    });
});

// Routes
app.use("/", blogRouter);
app.use("/users", usersRouter);

// Error handlers
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});


module.exports = app;
```

Be sure to replace the placeholder variables with your actual Okta information.

- Replace `{yourOktaOrgUrl}` with the Org URL on your dashboard page
- Replace `{yourOktaClientId}` with the Client ID on your application page
- Replace `{yourOktaClientSecret}` with the Client secret on your application page
- Replace `{aLongRandomString}` with a long random string (just mash your fingers on the keyboard for a second)

Let's take a look at what this code does.

### Initialize Node.js Middlewares

Middlewares in Express.js are functions that run on every request. There are many open source middlewares you can install and use to add functionality to your Express.js applications. The code below uses several popular Express.js middlewares, as well as defines some new ones.

```javascript
// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const oidc = new ExpressOIDC({
  issuer: "{yourOktaOrgUrl}/oauth2/default",
  client_id: "yourOktaClientId}",
  client_secret: "{yourOktaClientSecret}",
  redirect_uri: "http://localhost:3000/users/callback",
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

app.use(session({
  secret: "{aLongRandomString}",
  resave: true,
  saveUninitialized: false
}));

app.use(oidc.router);

app.use((req, res, next) => {
  if (!req.userinfo) {
    return next();
  }

  client.getUser(req.userinfo.sub)
    .then(user => {
      req.user = user;
      res.locals.user = user;

      next();
    });
});
```

The first few middlewares are all standard stuff: they enable logging, parse form data, and serve static files. The interesting thing to take note of is the use of the `ExpressOIDC` middleware.

This middleware handles the OpenID Connect authentication logic of the application which supports login, logout, etc.  The settings being passed into the `ExpressOIDC` middleware are configuration options which dictate what URLs are used to log the user into the application, and where the user will be redirected once they've been logged in.

The next middleware is the `session` middleware. This middleware is responsible for managing user cookies and remembering who a user is. The `secret` it takes must be a long random string you define and keep private. This secret makes it impossible for attackers to tamper with cookies.

The `oidc.router` middleware uses the settings you defined when creating `ExpressOIDC` to create routes for handling user authentication. Whenever a user visits `/users/login`, for instance, they'll be taken to a login page. This line of code is what makes that possible.

Finally, there's a custom middleware. This middleware creates a `req.user` object that you will be able to use later on to more easily access a currently logged in user's personal information.

### Initialize Node.js Routes

The route code tells Express.js what code to run when a user visits a particular URL. Here is the route code from the `./app.js`.

```javascript
// Routes
app.use("/", blogRouter);
app.use("/users", usersRouter);
```

This code tells Express.js that in our (yet to be created) blog and user route files there are functions that should be executed when certain URLs are hit. If a user visits a URL starting with `/users`, Express.js will look for other matching URLs in the user routes file. If a user visits any URLs starting with the `/` URL, Express.js will look in the blog routes file to see what to do.

### Initialize Error Handlers

The last bit of code in our app above is the error-handling middlewares.

```javascript
// Error handlers
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});
```

These middlewares will run if any 4XX or 5XX type errors occur. In both cases, they will render a simple web page to the user showing them the error.

## Create Express.js Views

Views in Express.js are the equivalent of HTML templates—they're the place you store front-end code and logic. The views you'll use in this project will use the [Pug](https://pugjs.org/api/getting-started.html) templating language which is one of the most popular.

Remove your existing views by running the following command.

```bash
rm views/*
```

Next, create a `./views/layout.pug` file. This is a base "layout" template that all other templates will inherit from. It defines common HTML, includes the [Bootstrap](https://getbootstrap.com/) CSS library, and also defines a simple navigation menu.

```html
block variables
  - var selected = 'Home'

doctype html
html(lang='en')
  head
    meta(charset='utf-8')
    meta(name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no')
    link(rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css' integrity='sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm' crossorigin='anonymous')
    link(rel='stylesheet', href='/stylesheets/style.css')
    title Blog: #{title}
  body
    div.d-flex.flex-column.flex-md-row.align-items-center.p-3.px-md-4.mb-3.bg-white.border-bottom.box-shadow
      h5.my-0.mr-md-auto.font-weight-normal Blog
      nav.my-2.my-md-0.mr-md-3
        a.p-2.text-dark(href="/", title="Home") Home

        if user == undefined
          a.p-2.text-dark(href="/users/login") Log In
        else
          a.p-2.text-dark(href="/dashboard") Dashboard
          a.p-2.text-dark(href="/users/logout") Logout
    .container
      block content

    hr.bottom
    footer.
      Built with #[a(href='https://expressjs.com/') Express.js], login powered by #[a(href='https://developer.okta.com/') Okta].
```

Next, create the `./views/error.pug` file. This page will be shown when an error occurs.

```html
extends layout

block content
  h1= message
  h2= error.status
  pre #{error.stack}
```

Next, create the `./views/unauthenticated.pug` file. This page will be shown when a user tries to visit a page but they aren't logged in.

```html
extends layout

block variables
  - var title = "Unauthenticated"

block content
  .unauthenticated
    h2.text-center Whoops!
    p.
      You must be signed in to view this page. Please #[a(href="/users/login", title="Login") login] to view this page.
```

Now define the `./views/index.pug` template. This is the homepage of the website and lists all the current blog posts ordered by date.

```html
extends layout

block variables
  - var title = "Home"

block content
  h2.text-center Recent Posts

  if posts == null
    p.empty.text-center Uh oh. There are no posts to view!

  .posts
    ul
      each post in posts
        .row
          .offset-sm-2.col-sm-8
            li
              a(href="/" + post.slug, title=post.title)= post.title
              span &nbsp; by #{post.authorName}
```

The next view to define is `./views/post.pug` which displays a single blog post.

```html
extends layout

block variables
  - var title = post.title

block content
  h2.text-center= title

  .row
    .offset-sm-2.col-sm-8
      .body !{post.body}
      p.author Written by #{post.authorName}
```

Now create the file `./views/edit.pug` which contains the blog post editing page markup.

```html
extends layout

block variables
  - var title = post.title

block content
  h2.text-center Edit Post

  .row
    .offset-sm-2.col-sm-8
      form(method="post")
        .form-group
          label(for="title") Post Title
          input.form-control#title(type="text", name="title", value=post.title, required)
        .form-group
          label(for="body") Post Body
          textarea.form-control#post(name="body", rows="6", required)= post.body
        button.btn.btn-primary.submit-btn(type="submit") Update

  .row
    .offset-sm-2.col-sm-8
      .body !{post.body}
      p.author Written by #{post.authorName}
```

Finally, create `./views/dashboard.pug` which will render the dashboard page that users will see once they've logged in. This page allows a user to create a new post as well as edit and delete their existing posts.

```html
extends layout

block variables
  - var title = "Dashboard"

block content
  .row
    .offset-sm-2.col-sm-8
      h2 Create a Post

  if post != undefined
    .row
      .offset-sm-2.col-sm-8
        .alert.alert-success(role="alert").text-center
          p Your new post was created successfully! #[a(href="/" + post.slug) View it?]

  .row
    .offset-sm-2.col-sm-8
      form(method="post")
        .form-group
          label(for="title") Post Title
          input.form-control#title(type="text", name="title", placeholder="Title", required)
        .form-group
          label(for="body") Post Body
          textarea.form-control#post(name="body", rows="6", required)
        button.btn.btn-primary.submit-btn(type="submit") Submit

  .row
    .offset-sm-2.col-sm-8
      h2.your-posts Your Posts
      ul.edit
        each post in posts
          li
            a(href="/" + post.slug, title=post.title)= post.title
            form.hidden(method="post", action="/" + post.slug + "/delete")
              button.btn.btn-outline-danger.delete Delete
            a(href="/" + post.slug + "/edit", title=post.title)
              button.btn.btn-outline-secondary Edit
```

## Create Styles

I'm not much of a web designer (that's why I like using Bootstrap), but every project needs a bit of visual flair. I've done my best to create some simple CSS styling.

Since CSS is straightforward and not the focus of this tutorial, you can simply copy the CSS below into the `./public/stylesheets/style.css` file.

```css
footer {
  text-align: center;
  font-style: italic;
  margin-top: 1em;
}

.nav {
  float: right;
}

h2 {
  margin-bottom: 2em;
}

.posts ul {
  list-style-type: none;
}

.posts a {
  font-size: 1.3em;
  text-decoration: underline;
  color: #212529;
}

.posts span {
  font-size: 1.1em;
  float: right;
}

.empty {
  font-size: 2em;
  margin-bottom: 5em;
}

.container {
  padding-top: 2em;
}

.unauthenticated p {
  font-size: 1.3em;
  text-align: center;
}

hr.bottom {
  margin-top: 4em;
}

.submit-btn {
  float: right;
}

.alert p {
  font-size: 1.1em;
}

.author {
  font-size: 1.2em;
  margin-top: 2em;
}

.body {
  margin-top: 2em;
  font-size: 1.2em;
}

.edit {
  padding-left: 0;
}

.edit a {
  text-decoration: underline;
  color: #212529;
  font-size: 1.5em;
}

.edit li {
  list-style-type: none;
  line-height: 2.5em;
}

.edit button {
  float: right;
}

.delete {
  margin-left: 1em;
}

.your-posts {
  margin-top: 2em;
}

.hidden {
  display: inline;
}
```

## Create Routes

Routes are where the real action happens in any Express.js application. They dictate what happens when a user visits a particular URL.

To get started, remove the existing routes that the express-generator application created.

```bash
rm routes/*
```

Next, create the two route files that you'll need.

```bash
touch routes/{blog.js,users.js}
```

The `./routes/blog.js` file will contain all of the routes related to blog functionality. The `./routes/users.js` file will contain the routes related to user functionality. While you could always put all your logic in the main `./app.js` file, keeping your routes in separate purpose-based files is a good idea.

### Create User Routes

Since Okta's [oidc-middleware library](https://github.com/okta/okta-oidc-js/tree/master/packages/oidc-middleware) is already handling user authentication for the application, there isn't a lot of user-facing functionality we need to create.

The only route you need to define that relates to user management is a logout route — this route will log the user out of their account and redirect them to the homepage of the site. While the oidc-middleware library provides a logout helper, it doesn't create an actual route.

Open up the `./routes/users.js` file and copy in the following code.

```javascript
const express = require("express");


const router = express.Router();

// Log a user out
router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});


module.exports = router;
```

The way to understand this route is simple. When a user visits the `/logout` URL, a function will run that:

Uses the oidc-middleware library to log the user out of their account
Redirects the now logged-out user to the homepage of the site

### Create Blog Routes

Since the application you're building is a blog, the last big piece of functionality you need add is the actual blog route code. This is what will dictate how the blog actually works: how to create posts, edit posts, delete posts, etc.

Open up the `./routes/blog.js` file and copy in the following code. Don't worry if it looks like a lot all at once - I'll walk you through each route in detail below.


```javascript
const async = require("async");
const express = require("express");
const okta = require("@okta/okta-sdk-nodejs");
const sequelize = require("sequelize");
const slugify = require("slugify");

const models = require("../models");

const client = new okta.Client({
  orgUrl: "{yourOktaOrgUrl}",
  token: "{yourOktaToken}"
});
const router = express.Router();

// Only let the user access the route if they are authenticated.
function ensureAuthenticated(req, res, next) {
  if (!req.user) {
    return res.status(401).render("unauthenticated");
  }

  next();
}

// Render the home page and list all blog posts
router.get("/", (req, res) => {
  models.Post.findAll({
    order: sequelize.literal("createdAt DESC")
  }).then(posts => {
    let postData = [];

    async.eachSeries(posts, (post, callback) => {
      post = post.get({ plain: true });
      client.getUser(post.authorId).then(user => {
        postData.push({
          title: post.title,
          body: post.body,
          createdAt: post.createdAt,
          authorName: user.profile.firstName + " " + user.profile.lastName,
          slug: post.slug
        });
        callback();
      }).catch(err => {
        postData.push({
          title: post.title,
          body: post.body,
          createdAt: post.createdAt,
          slug: post.slug
        });
        callback();
      });
    }, err => {
      return res.render("index", { posts: postData });
    });
  });
});

// Render the user dashboard
router.get("/dashboard", ensureAuthenticated, (req, res, next) => {
  models.Post.findAll({
    where: {
      authorId: req.user.id
    },
    order: sequelize.literal("createdAt DESC")
  }).then(posts => {
    let postData = [];

    posts.forEach(post => {
      postData.push(post.get({ plain: true }));
    });

    return res.render("dashboard", { posts: postData });
  });
});

// Create a new post
router.post("/dashboard", ensureAuthenticated, (req, res, next) => {
  models.Post.create({
    title: req.body.title,
    body: req.body.body,
    authorId: req.user.id,
    slug: slugify(req.body.title).toLowerCase()
  }).then(newPost => {
    models.Post.findAll({
      where: {
        authorId: req.user.id
      },
      order: sequelize.literal("createdAt DESC")
    }).then(posts => {
      let postData = [];

      posts.forEach(post => {
        postData.push(post.get({ plain: true }));
      });

      res.render("dashboard", { post: newPost, posts: postData });
    });
  });
});

// Render the edit post page
router.get("/:slug/edit", ensureAuthenticated, (req, res, next) => {
  models.Post.findOne({
    where: {
      slug: req.params.slug,
      authorId: req.user.id
    }
  }).then(post => {
    if (!post) {
      return res.render("error", {
        message: "Page not found.",
        error: {
          status: 404,
        }
      });
    }

    post = post.get({ plain: true });
    client.getUser(post.authorId).then(user => {
      post.authorName = user.profile.firstName + " " + user.profile.lastName;
      res.render("edit", { post });
    });
  });
});

// Update a post
router.post("/:slug/edit", ensureAuthenticated, (req, res, next) => {
  models.Post.findOne({
    where: {
      slug: req.params.slug,
      authorId: req.user.id
    }
  }).then(post => {
    if (!post) {
      return res.render("error", {
        message: "Page not found.",
        error: {
          status: 404,
        }
      });
    }

    post.update({
      title: req.body.title,
      body: req.body.body,
      slug: slugify(req.body.title).toLowerCase()
    }).then(() => {
      post = post.get({ plain: true });
      client.getUser(post.authorId).then(user => {
        post.authorName = user.profile.firstName + " " + user.profile.lastName;
        res.redirect("/" + slugify(req.body.title).toLowerCase());
      });
    });
  });
});

// Delete a post
router.post("/:slug/delete", (req, res, next) => {
  models.Post.findOne({
    where: {
      slug: req.params.slug,
      authorId: req.user.id
    }
  }).then(post => {
    if (!post) {
      return res.render("error", {
        message: "Page not found.",
        error: {
          status: 404,
        }
      });
    }

    post.destroy();
    res.redirect("/dashboard");
  });
});

// View a post
router.get("/:slug", (req, res, next) => {
  models.Post.findOne({
    where: {
      slug: req.params.slug
    }
  }).then(post => {
    if (!post) {
      return res.render("error", {
        message: "Page not found.",
        error: {
          status: 404,
        }
      });
    }

    post = post.get({ plain: true });
    client.getUser(post.authorId).then(user => {
      post.authorName = user.profile.firstName + " " + user.profile.lastName;
      res.render("post", { post });
    });
  });
});


module.exports = router;
```

**NOTE**: Make sure you substitute in your values for the placeholder variables towards the top of this file. You need to replace `{yourOktaOrgUrl}` and `{yourOktaToken}` with the appropriate values.

This is a lot of code, so let's take a look at each route and how it works.

#### Create an Authentication Helper

The first function you'll notice in the blog routes is the `ensureAuthenticated` function.

```javascript
// Only let the user access the route if they are authenticated.
function ensureAuthenticated(req, res, next) {
  if (!req.user) {
    return res.status(401).render("unauthenticated");
  }

  next();
}
```

This function is a special middleware you'll use later on that will render the `unauthenticated.pug` view you created earlier to tell the user they don't have access to view the page unless they log in.

This middleware works by looking for the `req.user` variable which, if it doesn't exist, means that the user is not currently logged in. This will be helpful later on to make sure that only logged in users can access certain pages of the site (for instance, the page that allows a user to create a new blog post).


#### Create the Homepage

The index route (aka: "homepage route") is what will run when the user visits the root of the site. It will display all blog posts ordered by date and not much else. Here's the route code.

```javascript
// Render the home page and list all blog posts
router.get("/", (req, res) => {
  models.Post.findAll({
    order: sequelize.literal("createdAt DESC")
  }).then(posts => {
    let postData = [];

    async.eachSeries(posts, (post, callback) => {
      post = post.get({ plain: true });
      client.getUser(post.authorId).then(user => {
        postData.push({
          title: post.title,
          body: post.body,
          createdAt: post.createdAt,
          authorName: user.profile.firstName + " " + user.profile.lastName,
          slug: post.slug
        });
        callback();
      }).catch(err => {
        postData.push({
          title: post.title,
          body: post.body,
          createdAt: post.createdAt,
          slug: post.slug
        });
        callback();
      });
    }, err => {
      return res.render("index", { posts: postData });
    });
  });
});
```

The way this works is by first using [Sequelize.js](http://docs.sequelizejs.com/) to retrieve a list of all blog posts from the database ordered by the `createdAt` field. Whenever a new blog post is stored in the database, Sequelize.js automatically assigns it both a `createdAt` and `updatedAt` time field.

Once a list of posts have been returned from the database you will iterate over each post retrieving it in JSON format, then use [Okta's Node SDK](https://github.com/okta/okta-sdk-nodejs) to retrieve the author's information via the authorId field.

Finally, you'll build an array consisting of all the blog posts alongside the author's name, and will render the `index.pug` template which then takes that data and displays the full web page.

#### Create the Dashboard Routes

The dashboard page is the first page users will see after logging in. It will:

- Allow users to create a new blog post
- Show users a list of their previously created blog posts
- Provide buttons that allow a user to edit or delete previously created blog posts

Here's the code that powers the dashboard route.

```javascript
// Render the user dashboard
router.get("/dashboard", ensureAuthenticated, (req, res, next) => {
  models.Post.findAll({
    where: {
      authorId: req.user.id
    },
    order: sequelize.literal("createdAt DESC")
  }).then(posts => {
    let postData = [];

    posts.forEach(post => {
      postData.push(post.get({ plain: true }));
    });

    return res.render("dashboard", { posts: postData });
  });
});

// Create a new post
router.post("/dashboard", ensureAuthenticated, (req, res, next) => {
  models.Post.create({
    title: req.body.title,
    body: req.body.body,
    authorId: req.user.id,
    slug: slugify(req.body.title).toLowerCase()
  }).then(newPost => {
    models.Post.findAll({
      where: {
        authorId: req.user.id
      },
      order: sequelize.literal("createdAt DESC")
    }).then(posts => {
      let postData = [];

      posts.forEach(post => {
        postData.push(post.get({ plain: true }));
      });

      res.render("dashboard", { post: newPost, posts: postData });
    });
  });
});
```

Note that there are technically two routes here. The first route function is run when a user issues a GET request for the `/dashboard` page, while the second route is run when a user issues a `POST` request for the `/dashboard` page.

The first route retrieves a list of all blog posts this user has created, then renders the dashboard page. Note how it uses the `ensureAuthenticated` middleware we created earlier. By inserting the `ensureAuthenticated` middleware into the route, this guarantees that this route code will only execute if a currently logged in user is visiting this page.

If a user chooses to create a new blog post, that will trigger a POST request to the `/dashboard` URL, which is what will eventually run the second dashboard route shown above.

This route uses Sequelize.js to create a new database entry storing the blog posts and author details, then renders the dashboard page once more.

#### Create the Edit Routes

The edit routes control the pages that allow a user to edit one of their existing blog posts. The code that makes this work is shown below.

```javascript
// Render the edit post page
router.get("/:slug/edit", ensureAuthenticated, (req, res, next) => {
  models.Post.findOne({
    where: {
      slug: req.params.slug,
      authorId: req.user.id
    }
  }).then(post => {
    if (!post) {
      return res.render("error", {
        message: "Page not found.",
        error: {
          status: 404,
        }
      });
    }

    post = post.get({ plain: true });
    client.getUser(post.authorId).then(user => {
      post.authorName = user.profile.firstName + " " + user.profile.lastName;
      res.render("edit", { post });
    });
  });
});

// Update a post
router.post("/:slug/edit", ensureAuthenticated, (req, res, next) => {
  models.Post.findOne({
    where: {
      slug: req.params.slug,
      authorId: req.user.id
    }
  }).then(post => {
    if (!post) {
      return res.render("error", {
        message: "Page not found.",
        error: {
          status: 404,
        }
      });
    }

    post.update({
      title: req.body.title,
      body: req.body.body,
      slug: slugify(req.body.title).toLowerCase()
    }).then(() => {
      post = post.get({ plain: true });
      client.getUser(post.authorId).then(user => {
        post.authorName = user.profile.firstName + " " + user.profile.lastName;
        res.redirect("/" + slugify(req.body.title).toLowerCase());
      });
    });
  });
});
```

These routes by matching a variable pattern URL. If the user visits a URL that looks like `/<something>/edit`, then the edit route will run. Because the URL pattern in the route is defined as `/:slug/edit`, Express.js will pass along the URL route in the `req.params.slug` variable so you can use it.

These routes handle rendering the edit page as well as updating existing posts when needed.

#### Create the Delete Route

The delete route is simple: if a user sends a POST request to the URL `/<post-url>/delete`, then Sequelize.js will destroy the post from the database.

Here's the code that makes this work.

```javascript
// Delete a post
router.post("/:slug/delete", (req, res, next) => {
  models.Post.findOne({
    where: {
      slug: req.params.slug,
      authorId: req.user.id
    }
  }).then(post => {
    if (!post) {
      return res.render("error", {
        message: "Page not found.",
        error: {
          status: 404,
        }
      });
    }

    post.destroy();
    res.redirect("/dashboard");
  });
});
```

#### Create the Display Route

The display route is the simplest of them all: it renders a specific blog post on a page. It works much like the other routes above by using variable URL patterns.

When a user visits a URL like `/my-great-article`, this route will run, query the database for any blog posts whose slug is `my-great-article`, then display that post on a page.

```javascript
// View a post
router.get("/:slug", (req, res, next) => {
  models.Post.findOne({
    where: {
      slug: req.params.slug
    }
  }).then(post => {
    if (!post) {
      return res.render("error", {
        message: "Page not found.",
        error: {
          status: 404,
        }
      });
    }

    post = post.get({ plain: true });
    client.getUser(post.authorId).then(user => {
      post.authorName = user.profile.firstName + " " + user.profile.lastName;
      res.render("post", { post });
    });
  });
});
```

## Test Your New CRUD App!

By this point, you've built a fully functional Node.js website using Express.js and Okta. To test it out, run the following command to start up your web server then visit `http://localhost:3000` in the browser.

```bash
npm start
```

If you were able to copy the code properly, you should be able to log in, create posts, edit posts, and delete posts.

{% img blog/tutorial-build-a-basic-crud-app-with-node/using-the-blog.gif alt:"using the blog" width:"700" %}{: .center-image }


## Do More With Node!

I hope you enjoyed building a simple CRUD app with Node.js and Express.js. I've found that Express.js has a rich ecosystem of libraries and tools to make web development simple and fun. You can find the source code for the example created in this tutorial [on GitHub](https://github.com/rdegges/okta-express-blog).

If you'd like to learn more about building web apps in Node, you might want to check out these other great posts:

- [Build Secure Node Authentication with Passport.js and OpenID Connect](https://developer.okta.com/blog/2018/05/18/node-authentication-with-passport-and-oidc)
- [Build User Registration with Node, React, and Okta](https://developer.okta.com/blog/2018/02/06/build-user-registration-with-node-react-and-okta)
- [Simple Node Authentication](https://developer.okta.com/blog/2018/04/24/simple-node-authentication)
- [Build a Basic CRUD App with Vue.js and Node](https://developer.okta.com/blog/2018/02/15/build-crud-app-vuejs-node)

If you're interested in learning more about how the underlying authentication components work (OpenID Connect), you may be interested in our [OpenID Connect primer series](https://developer.okta.com/blog/2017/07/25/oidc-primer-part-1) which explains everything you need to know about OpenID Connect as a developer.

Finally, please [follow us on Twitter](https://twitter.com/OktaDev) to find more great resources like this, request other topics for us to write about, and follow along with our new open source libraries and projects!

And... If you have any questions, please leave a comment below!
