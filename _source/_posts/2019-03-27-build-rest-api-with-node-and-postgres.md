---
layout: blog_post
title: "Build a REST API with Node and Postgres"
author: bkelley
description: "A tutorial on building RESTful APIs with Node and Postgres."
tags: [node, nodejs, postgres, postgresql, api, rest api]
tweets:
- "Learn to build a RESTful API with @NodeJS and @PostgreSQL!"
- "Want to build a RESTful API with @NodeJS and @PostgreSQL? Check this out!"
- "Need to learn how to build a RESTful API with @NodeJS and @PostgreSQL? We've got you covered!"
image: blog/featured/okta-node-tile-books-mouse.jpg
---

If you haven't heard of PostgreSQL (often called Postgres), today's your lucky day. It's a robust, open source relational database that powers some of the world's largest applications. In this post, I'll show you how to create a REST API in Node that uses Postgres as a data store. I'll walk you through setting everything up, so if you're not familiar with Postgres, *don't worry*.

Specifically, I'm going to walk you through building an API that will keep track of movies you own (or have access to) via various sources (such as DVDs and Netflix). You'll then be able to query this API to see what app (or cupboard?) you need to open to access the movie you feel like watching. By the end of this post, you'll learn how to build this API using Node and Postgres, and how to secure your API using OAuth 2.

## Set Up Your Node + Postgres Dependencies

For this tutorial, I'm using Node 10.5.3. You'll probably be fine if you're on a later version, or even on Node 8, but if you're running 0.12 you might run into some issues. If you don't have Node installed yet, the easiest way is to use [NVM](https://github.com/creationix/nvm), which lets you install multiple versions simultaneously, and makes upgrading to the latest version as simple as `nvm install node`. If you don't have Node or NVM installed, use the following command to install NVM:

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
```

If that doesn't work for some reason, depending on your system, you can find more troubleshooting information [here](https://github.com/creationix/nvm#install--update-script).

### Install PostgreSQL

I'm using PostgreSQL version 10.4. I won't be using any complex queries in this tutorial, so if you have a different version installed, that shouldn't be an issue. Postgres comes pre-installed on some systems. To check if you have Postgres installed already, run the following command:

```bash
postgres --version
```

You should get something back like: `postgres (PostgreSQL) 10.4`. If you instead get an error like `bash: postgres: command not found` then you don't have it installed yet. To install Postgres, you'll ideally want to use a package manager. If you're using a Debian-based Linux distribution, you can simply run:

```bash
sudo apt-get install postgresql-10
```

If you're running MacOS and have Homebrew installed, you can simply run:

```bash
brew install postgresql
```

For any other operating systems, visit [PostgreSQL's Downloads page](https://www.postgresql.org/download/) for help getting up and running.

### Create a Postgres Database

Once you have Postgres installed, you'll need to create a database for this app to connect to. Type `psql` to connect to your Postgres server, then type `create database movie_catalog`.

## Build a Basic Node App

To get started, create a new directory to store your app (e.g. `movie-catalog`). Then enter the directory from the command line (`cd movie-catalog`), and type `npm init` to initialize your Node project (and create a `package.json` file):

```bash
$ npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (movie-catalog)
version: (1.0.0) 0.1.0
description: Movie Catalog API
entry point: (index.js) src/index.js
test command:
git repository:
keywords:
author:
license: (ISC) Apache-2.0
About to write to /Users/bmk/code/okta/apps/movie-catalog/package.json:

{
  "name": "movie-catalog",
  "version": "0.1.0",
  "description": "Movie Catalog API",
  "main": "src/index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "Apache-2.0"
}


Is this OK? (yes)
```

Typically, your app's configuration files will live in the root of your project folder and source code will live in a separate folder. Create a new folder `src` to hold your code:

```bash
mkdir src
```

If you plan to use `git` for source control, you should also create a `.gitignore` file to make sure you don't end up committing the *monstrous* `node_modules` directory. You'll also use a `.env` file later that you won't want to commit. Go ahead and create a file called `.gitignore` in the root of your project folder and copy in the following contents:

```bash
node_modules
.env
```

What you need to do next is get the database schema sorted. One way you can do this is with an ORM called [Sequelize](http://docs.sequelizejs.com/). You'll need to install the dependencies required for Sequelize as well as the libraries it needs to connect to Postgres.

```bash
npm install sequelize@4.43.0 pg@7.8.1
```

Create a new file `src/database.js`. In here you'll set up the Sequelize database and models that will be needed to run the movie catalog. You'll be receiving title information from a third party, which you can store in JSON (using the Postgres JSONB type) and access or query directly. You'll also create a table to store information about which services a user has (e.g. Netflix, Hulu, DVD, etc.). You'll then need a table to connect the two; you can use this table to provide extra information such as the location, in the case of a DVD or Blu-ray movie.

```javascript
const Sequelize = require('sequelize')

const database = new Sequelize({
  database: 'movie_catalog',
  dialect: 'postgres',
  operatorsAliases: Sequelize.Op
})

const Title = database.define('title', {
  id: { type: Sequelize.STRING, primaryKey: true },
  title: { type: Sequelize.JSONB, allowNull: false }
})

const Service = database.define('service', {
  userId: { type: Sequelize.STRING, unique: 'user-name', allowNull: false },
  name: { type: Sequelize.STRING, unique: 'user-name', allowNull: false }
})

const TitleService = database.define('title_service', {
  location: Sequelize.STRING
})

TitleService.belongsTo(Title, {
  foreignKey: { allowNull: false, unique: 'title-service' },
  onDelete: 'cascade'
})

TitleService.belongsTo(Service, {
  foreignKey: { allowNull: false, unique: 'title-service' },
  onDelete: 'cascade'
})

module.exports = {
  Title,
  Service,
  TitleService,
  database
}
```

Next, set up the Express server, which will serve up the content. You'll need to install a couple more dependencies:

```bash
npm install express@4.16.4 cors@2.8.5 body-parser@1.18.3
```

Now edit `src/index.js`:

```javascript
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const { database } = require('./database')

const port = process.env.SERVER_PORT || 3000

const app = express()
app.use(cors())
app.use(bodyParser.json())

// TODO: Remove this function and actually implement authentication
app.use('/', (req, res, next) => {
  req.userId = 'TODO'
  next()
})

// TODO: Add routes

database.sync().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
})
```

So far, this doesn't really do anything. You can start it up by running `node .`, but it really just hosts a server with no routes. You'll need to add those next. This code also stubs in a `userId` of `TODO`, which you'll fix later. Until then, your API will just assume a single user.

## Fetch Movie Titles with Node

In order to be able to get metadata about a movie or TV show, you need to use a third party API. An easy one to get started with is [The Open Movie Database](https://www.omdbapi.com/). You'll need to [sign up for a free API key](https://www.omdbapi.com/apikey.aspx) and confirm your email address. Once you have an API key, create a new file called `.env` in your root directory, and add the API key:

```bash
OMDB_API_KEY=abcd1234
```

You also need to add a couple of new dependencies. In order to read the `.env` file and add the values as environment variables you can access in the code, you'll need to install `dotenv`. To fetch the movies, you will need `node-fetch`, which provides the same API that browsers have by default and is easier to use than Node's built-in API:

```bash
npm install dotenv@6.2.0 node-fetch@2.3.0
```

For `dotenv` to do its magic, you'll need to add the following line to the very top of `src/index.js`. It should be the first piece of code run:

```javascript
require('dotenv').config()
```

In order to find movie titles, you'll essentially write a simple wrapper over OMDb's API. That will allow you to keep everything you need in one place. To keep things even simpler, let's create a utility file at `src/omdb.js` that gives your code an easy way to look up titles:

```javascript
const fetch = require('node-fetch')

const { OMDB_API_KEY } = process.env
const API_URL = 'https://www.omdbapi.com'

const search = async query => {
  const url = new URL(API_URL)
  url.searchParams.set('apikey', OMDB_API_KEY)
  url.searchParams.set('v', 1)
  url.searchParams.set('s', query)

  const response = await fetch(url)
  const {
    Response: success,
    Search: searchResults
  } = await response.json()

  return success === 'True' ? searchResults : []
}

const getTitle = async id => {
  const url = new URL(API_URL)
  url.searchParams.set('apikey', OMDB_API_KEY)
  url.searchParams.set('v', 1)
  url.searchParams.set('i', id)

  const response = await fetch(url)
  const {
    Response: success,
    Error: error,
    ...title
  } = await response.json()

  if (success === 'True') {
    return title
  }

  throw new Error(error)
}

module.exports = { search, getTitle }
```

You now have two functions that let you either search for a title by name or select more details about a title by a specific ID. Now create a new file `src/titles.js` that will handle all the title-related activity:

```javascript
const express = require('express')
const omdb = require('./omdb')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    if (!req.query.s) throw new Error('Search param (`s`) required')

    res.json(await omdb.search(req.query.s))
  } catch (error) {
    res.json({ error: error.message })
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    res.json(await omdb.getTitle(req.params.id))
  } catch (error) {
    res.json({ error: error.message })
  }
})

module.exports = router
```

When using routers in Express, your paths are relative to the path you give it when you use the router. In `src/index.js`, add the following after the `TODO` comment you left earlier:

```javascript
app.use('/titles', require('./titles'))
```

When using routers in Express, routes are relative to where you add them. In `src/titles.js`, you specified that the `/` route should allow you to search for titles. But in `src/index.js` you specified that route should be relative to `/titles`. Therefore, if you go to `/titles` you'll be able to search, and you can get info for a specific title using `/titles/:id`.

Restart your server (you can hit `ctrl-c` to stop it, then `node .` to start it again). To test it out now, you can use `curl` in the command line.

```bash
curl -s http://localhost:3000/titles?s=Fight+Club
```

You should get back a big block of JSON. To make it easier to read, you can install a useful command line tool:

```bash
npm install --global json@9.0.6
```

Try again by piping the results into `json`. Without any options, it will show everything in an easier-to-read format. Here are a couple of examples with some options that pull out some relevant information:

```
$ curl -s http://localhost:3000/titles?s=Harry+Potter | json -a Year Title imdbID | sort
2001 Harry Potter and the Sorcerer's Stone tt0241527
2002 Harry Potter and the Chamber of Secrets tt0295297
2002 Harry Potter and the Chamber of Secrets tt0304140
2004 Harry Potter and the Prisoner of Azkaban tt0304141
2005 Harry Potter and the Goblet of Fire tt0330373
2007 Harry Potter and the Order of the Phoenix tt0373889
2009 Harry Potter and the Half-Blood Prince tt0417741
2010 Harry Potter and the Deathly Hallows: Part 1 tt0926084
2010 Harry Potter and the Forbidden Journey tt1756545
2011 Harry Potter and the Deathly Hallows: Part 2 tt1201607

$ curl -s http://localhost:3000/titles/tt0137523 | json Title Year Director Writer Actors
Fight Club
1999
David Fincher
Chuck Palahniuk (novel), Jim Uhls (screenplay)
Edward Norton, Brad Pitt, Meat Loaf, Zach Grenier
```

## Interact with Postgres Using Node

At this point you should have a simple API that can get information about movie titles. It's now time to integrate Postgres into your app so that you can keep track of these movies.

### Create Node Service Routes

Before you can ask the API which titles you own (or have access to), you'll need to create a service to specify *how* you can watch a given movie. Create a new file `src/services.js` and copy in the following code:

```javascript
const express = require('express')

const { Service } = require('./database')

const router = express.Router()

router.get('/', async (req, res, next) => {
  const { userId } = req
  res.json(await Service.findAll({
    attributes: ['id', 'name'],
    where: { userId }
  }))
})

router.post('/', async (req, res, next) => {
  try {
    const { userId } = req
    const { name } = req.body
    const { id } = await Service.create({ userId, name })
    res.json({ success: true, id })
  } catch (error) {
    res.json({ success: false, error: error.message })
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { userId } = req
    const { id } = req.params
    if (await Service.destroy({ where: { userId, id } })) {
      res.json({ success: true })
    }
  } catch (error) { }

  res.json({ success: false, error: 'Invalid ID' })
})

module.exports = router
```

You'll also need to add a route in `src/index.js`, just after the `/titles` route you added above:

```javascript
app.use('/services', require('./services'))
```

This gives you three different flavors of the `/services` route. You can send a `GET` request to see all of your services, a `POST` request to add a new one, or a `DELETE` request to remove one. Give it a try:

```bash
$ curl -sH 'Content-Type: application/json' http://localhost:3000/services
[]

$ curl -sH 'Content-Type: application/json' http://localhost:3000/services -XPOST -d '{"name":"Netflix"}'
{"success":true,"id":1}

$ curl -sH 'Content-Type: application/json' http://localhost:3000/services -XPOST -d '{"name":"asdf"}'
{"success":true,"id":2}

$ curl -sH 'Content-Type: application/json' http://localhost:3000/services -XPOST -d '{"name":"Blu-ray"}'
{"success":true,"id":3}

$ curl -sH 'Content-Type: application/json' http://localhost:3000/services
[{"id":3,"name":"Blu-ray"},{"id":2,"name":"asdf"},{"id":1,"name":"Netflix"}]

$ curl -sH 'Content-Type: application/json' http://localhost:3000/services/2 -XDELETE
{"success":true}

$ curl -sH 'Content-Type: application/json' http://localhost:3000/services
[{"id":3,"name":"Blu-ray"},{"id":1,"name":"Netflix"}]
```

### Create Node Title Routes

Now you'll need a way to associate a service with a title. Create a new router at `src/my-titles.js`. This one will be a little more lengthy since it will combine a `Title` with a `Service` and allow you to update a location with a `PUT` request:

```javascript
const express = require('express')
const { getTitle } = require('./omdb')
const { Title, TitleService, Service } = require('./database')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const full = 'full' in req.query
    const { userId } = req

    const data = await TitleService.findAll({
      attributes: ['id', 'location'],
      where: { '$service.userId$': userId },
      include: [{
        model: Title,
        attributes: ['title']
      }, {
        model: Service,
        attributes: ['id', 'name']
      }]
    })

    res.json(
      data.map(({ id, location, title: { title }, service }) => ({
        id,
        location,
        title: full
          ? title
          : { id: title.imdbID, name: `${title.Title} (${title.Year})` },
        service: { id: service.id, name: service.name }
      }))
    )
  } catch (error) {
    res.json({ error: error.message })
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { titleId, serviceId, location } = req.body

    await Title.upsert({ id: titleId, title: await getTitle(titleId) })

    const { userId } = await Service.findByPk(serviceId)
    if (userId === req.userId) {
      const { id } = await TitleService.create({ titleId, serviceId, location })

      return res.json({ id })
    }
  } catch (error) {
    console.log(error)
  }

  res.json({ error: 'Error adding title' })
})

router.put('/:id', async (req, res, next) => {
  try {
    const { location } = req.body
    const { id } = req.params
    const { userId } = req

    const titleService = await TitleService.findByPk(id, { include: [{ model: Service }] })
    if (titleService && titleService.service.userId === userId) {
      await titleService.update({ location })
      return res.json({ id })
    }
  } catch (error) {
    console.log(error)
  }

  res.json({ error: 'Invalid ID' })
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { userId } = req

    const titleService = await TitleService.findByPk(id, { include: [{ model: Service }] })
    if (titleService && titleService.service.userId === userId) {
      await titleService.destroy()
      res.json({ success: true })
    }
  } catch (error) {
    console.log(error)
  }

  res.json({ error: 'Invalid ID' })
})

module.exports = router
```

Again, you'll need to add the router to `src/index.js`, after the other routes you added earlier:

```javascript
app.use('/my-titles', require('./my-titles'))
```

The `DELETE` and `POST` requests end up being fairly similar to the `/services` route. The main difference with the `POST` request is it will also verify that the title exists on OMDb, and it will insert the value into the `titles` table for faster lookup later. The `PUT` request is new, which allows you to modify an existing "my-title". The `GET` request is a bit longer just because it needs to stitch together all the information. It also will allow you to add a `full` param to get more information but returns just a couple fields without it. Test it out:

```bash
$ curl -sH 'Content-Type: application/json' http://localhost:3000/my-titles
[]

$ curl -sH 'Content-Type: application/json' http://localhost:3000/my-titles -XPOST -d '{"serviceId":3,"titleId":"tt0241527","location":"Bookshelf"}'
{"id":1}

$ curl -sH 'Content-Type: application/json' http://localhost:3000/my-titles -XPOST -d '{"serviceId":1,"titleId":"tt4574334"}'
{"id":2}

$ curl -sH 'Content-Type: application/json' http://localhost:3000/my-titles | json -o inspect
[ { id: 1,
    location: 'Bookshelf',
    title:
     { id: 'tt0241527',
       name: 'Harry Potter and the Sorcerer\'s Stone (2001)' },
    service: { id: 3, name: 'Blu-ray' } },
  { id: 2,
    location: null,
    title: { id: 'tt4574334', name: 'Stranger Things (2016–)' },
    service: { id: 1, name: 'Netflix' } } ]

$ curl -sH 'Content-Type: application/json' http://localhost:3000/my-titles/2 -XPUT -d '{"location":"Internet"}'
{"id":"2"}

$ curl -sH 'Content-Type: application/json' http://localhost:3000/my-titles/1 -XDELETE
{"success":true}

$ curl -sH 'Content-Type: application/json' http://localhost:3000/my-titles | json -o inspect
[ { id: 2,
    location: 'Internet',
    title: { id: 'tt4574334', name: 'Stranger Things (2016–)' },
    service: { id: 1, name: 'Netflix' } } ]
```

## Add User Authentication to Your Node API

You now have a simple API you can use to keep track of your movies and TV shows. Unfortunately, only one person can use it unless you want everyone to share the same library. This is where you can use [Okta](https://developer.okta.com/) to add in authentication and make it easy to give each user their own movie catalog. Okta is a cloud service that allows developers to create, edit, and securely store user accounts and user account data, and connect them with one or multiple applications. The Okta API enables you to:

* [Authenticate](https://developer.okta.com/product/authentication/) and [authorize](https://developer.okta.com/product/authorization/) your users
* Store data about your users
* Perform password-based and [social login](https://developer.okta.com/authentication-guide/social-login/)
* Secure your application with [multi-factor authentication](https://developer.okta.com/use_cases/mfa/)
* And much more! Check out the [product documentation](https://developer.okta.com/documentation/)

If you don't already have one, [sign up for a forever-free developer account](https://developer.okta.com/signup/). Log into your developer console, navigate to **Applications**, then click **Add Application**. Select **Web**, then click **Next**.

You'll want to change the default ports from `8080` to `3000` to match your server. Your settings should then look something like this:

{% img blog/node-postgres/okta-application-settings.png alt:"New Application Settings" width:"800" %}{: .center-image }

Click **Done** to save your app, then copy your **Client ID** and **Client Secret** and paste them as variables into your `.env` file in the root of your project. You'll also need to add your organization URL (without the `-admin` suffix). Add these three variables to your existing `.env` file:

```bash
OKTA_ORG_URL=https://{yourOktaDomain}
OKTA_CLIENT_ID={yourClientId}
OKTA_CLIENT_SECRET={yourClientSecret}
```

You also need an app secret. One way to get a random `APP_SECRET` is to use the following commands, which will generate a random value and add it to your `.env` file.

```bash
npm install -g uuid-cli
echo "APP_SECRET=`uuid`" >> .env
```

Now that your environment variables are ready, you'll need to install a few new dependencies for Okta to work:

```bash
npm install @okta/jwt-verifier@0.0.14 @okta/oidc-middleware@2.0.0 express-session@1.15.6
```

Create a new file `src/okta.js`. Here you'll create an `initialize` function that requires the Express app and the port number to initialize. You'll pass that info in from `src/index.js`. You'll also export a custom `requireUser` middleware that will check to make sure the user is authenticated and add the proper `userId` to the request, instead of the `TODO`. If the user isn't authenticated, they'll get an error message.

```javascript
const session = require('express-session')
const { ExpressOIDC } = require('@okta/oidc-middleware')
const OktaJwtVerifier = require('@okta/jwt-verifier')

const issuer = `${process.env.OKTA_ORG_URL}/oauth2/default`

const initialize = (app, port) => {
  const oidc = new ExpressOIDC({
    issuer,
    client_id: process.env.OKTA_CLIENT_ID,
    client_secret: process.env.OKTA_CLIENT_SECRET,
    appBaseUrl: process.env.APP_BASE_URL || `http://localhost:${port}`,
    scope: 'openid profile'
  })

  app.use(session({
    secret: process.env.APP_SECRET,
    resave: true,
    saveUninitialized: false
  }))
  app.use(oidc.router)

  app.get('/', oidc.ensureAuthenticated(), (req, res) => {
    res.send(req.userContext.tokens.access_token)
  })

  return oidc
}

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer,
  clientId: process.env.OKTA_CLIENT_ID
})

const requireUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers
    if (!authorization) throw new Error('You must send an Authorization header')

    const [authType, token] = authorization.split(' ')
    if (authType !== 'Bearer') throw new Error('Expected a Bearer token')

    const { claims: { sub } } = await oktaJwtVerifier.verifyAccessToken(token)
    req.userId = sub
    next()
  } catch (error) {
    res.json({ error: error.message })
  }
}

module.exports = { initialize, requireUser }
```

Now go back into `src/index.js` and make a few changes. Replace the fake authentication function with the following:

```javascript
const okta = require('./okta')
okta.initialize(app, port)
```

You'll also want to add `okta.requireUser` as middleware to your `/services` and `/my-titles` routes. It's up to you if you also want to require a user in order to query titles, but it's not strictly necessary since you're just querying the OMDb API from that route. Your `src/index.js` file should now look like this:

```javascript
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const { database } = require('./database')
const okta = require('./okta')

const port = process.env.SERVER_PORT || 3000

const app = express()
app.use(cors())
app.use(bodyParser.json())
okta.initialize(app, port)

app.use('/titles', require('./titles'))
app.use('/services', okta.requireUser, require('./services'))
app.use('/my-titles', okta.requireUser, require('./my-titles'))

database.sync().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
})
```

Time to put everything to the test. In order to authenticate with this API, you'll need to go to [http://localhost:3000](http://localhost:3000) in a web browser. This will prompt you to log in and, once authenticated, print out an authentication token. Copy that and add it as a header in your curl requests. The easiest way to do this is to make a new file with your headers in them. It should look something like this:

```properties
Content-Type: application/json
Authorization: Bearer eyJraW...NysQChA
```

The actual token is much longer, but that's the idea. In `curl`, instead of `-H 'Content-Type: application/json'`, you can now do `-H "$(cat headers.txt)"`, assuming a filename of `headers.txt` in the same directory. Try out a few things once you've logged in (remember, anything you entered before won't be available since it was under the `userId` of `TODO`).

```bash
$ curl -sH "$(cat headers.txt)" http://localhost:3000/my-titles | json -o inspect
[]

$ curl -sH "$(cat headers.txt)" http://localhost:3000/services -XPOST -d '{"name":"HBO Go"}'
{"success":true,"id":4}

$ curl -sH "$(cat headers.txt)" http://localhost:3000/titles?s=game+of+thrones | json 0.Title 0.imdbID
Game of Thrones
tt0944947

$ curl -sH "$(cat headers.txt)" http://localhost:3000/my-titles -XPOST -d '{"titleId":"tt0944947","serviceId":4}'
{"id":3}

$ curl -sH "$(cat headers.txt)" http://localhost:3000/my-titles | json -o inspect
[ { id: 3,
    location: null,
    title: { id: 'tt0944947', name: 'Game of Thrones (2011–)' },
    service: { id: 4, name: 'HBO Go' } } ]
```

## Node + Postgres API Takeaways

That's it! You should now have a fully authenticated API to keep track of your movies and TV shows that uses Postgres to store data and Okta + OAuth2 for API authentication. I hope you enjoyed working on this little project with Node and Postgres. If you want to see the final code sample for reference, you can find it [on GitHub](https://github.com/oktadeveloper/okta-node-postgres-example).

For more examples using Okta with Node, check out some of these other posts, or browse the [Okta Developer Blog](/blog/).

* [Use TypeScript to Build a Node API with Express](/blog/2018/11/15/node-express-typescript)
* [Modern Token Authentication in Node with Express](/blog/2019/02/14/modern-token-authentication-in-node-with-express)
* [Build Secure Node Authentication with Passport.js and OpenID Connect](/blog/2018/05/18/node-authentication-with-passport-and-oidc)
* [Build a Simple REST API with Node and OAuth 2.0](/blog/2018/08/21/build-secure-rest-api-with-node)

If you have any questions about this post, please add a comment below. For more awesome content, follow [@oktadev](https://twitter.com/oktadev) on Twitter, like us [on Facebook](https://www.facebook.com/oktadevelopers/), or subscribe to [our YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q).