---
layout: blog_post
title: "Build a Simple API Service with Express and GraphQL"
author: bkelley
description: "In this tutorial you'll use Express.js to build a simple API with GraphQL and secure it using Okta."
tags: [authentication, graphql, api, express, node]
tweets:
- "Curious about @graphql? We just published an interesting article which shows you how to build #graphql APIs using #expressjs"
- "New article out! It walks you through building APIs with @graphql in Node. Stop scrolling through Twitter and learn something fun!"
- "G... GRAPH... GRAPHQLLLLLLL. It's an awesome technology and makes building efficient APIs simple. Checkout our latest article on the subject:"
image: blog/graphql-express/okta-node-skew.jpg
---

GraphQL has become an immensely popular alternative to REST APIs. The flexibility you get from using GraphQL makes it easier for developers to get any information they need for an app, and _just_ the information they need for that portion of the app. That gives you the feel of a very customized API and can help cut down on bandwidth.

In this tutorial, I'll show you how to write a custom GraphQL API using Node and Express. I'll also show you how to secure parts of the API while making other parts open to the public.

## Create the GraphQL API with Express

To create the API, start by creating a new folder and creating a `package.json` file to manage your dependencies. You'll also need to install a few dependencies to get GraphQL with Express up and running:

```bash
mkdir graphql-express
cd graphql-express
npm init -y
npm install express@2.8.4 express-graphql@0.6.12 graphql@14.0.2 graphql-tag@2.9.2 cors@2.8.4
```

Now create a file named `index.js`. This will be your main entry point:

```javascript
const express = require('express')
const cors = require('cors')
const graphqlHTTP = require('express-graphql')
const gql = require('graphql-tag')
const { buildASTSchema } = require('graphql')

const app = express()
app.use(cors())

const schema = buildASTSchema(gql`
  type Query {
    hello: String
  }
`)

const rootValue = {
  hello: () => 'Hello, world'
}

app.use('/graphql', graphqlHTTP({ schema, rootValue }))

const port = process.env.PORT || 4000
app.listen(port)
console.log(`Running a GraphQL API server at localhost:${port}/graphql`)
```

This is about as simple as a GraphQL server gets. All this does is return "Hello, world" when you query "hello", but it's a start. To take it for a test spin, run `node .`, then in another tab open your browser to the [GraphQL Playground](https://graphqlbin.com). Once there, enter `http://localhost:4000/graphql` to access your GraphQL server.

{% img blog/graphql-express/enter-endpoint.png alt:"graphql playground - enter endpoint url" width:"600" %}{: .center-image }

The GraphQL Playground will help explore your schema and test out queries. It even automatically creates some documentation for you.

{% img blog/graphql-express/hello-world-schema.png alt:"graphql playground - hello world schema" width:"600" %}{: .center-image }

Try querying for `hello` using the following query:

```graphql
query {
  hello
}
```

{% img blog/graphql-express/hello-world.png alt:"hello world" width:"600" %}{: .center-image }

## Improve Your GraphQL Developer Experience

Here are a couple quick tips to help make your development experience a little better:

1. Install a linter to help catch bugs in your editor. This will help keep your styling consistent and catch any easily-avoidable bugs.

    * To install [StandardJS](https://standardjs.com/), type `npm install --save-dev standard@12.0.1`. Most editors will be able to show you warnings and errors as you type.
    * You can also edit the `scripts` object of your `package.json` so that you can run the linter at any time with `npm test`:
      ```
      "scripts": {
        "test": "standard"
      },
      ```
2. Automatically restart the server when you make changes.
    * Install `nodemon` with `npm install --save-dev nodemon@1.18.4`
    * Add another script to `package.json`, so you can run the server with `npm start`. Combined with the above, your `scripts` object should look like this:
      ```
      "scripts": {
        "test": "standard",
        "start": "nodemon ."
      },
      ```

Go ahead and close the server you had run with `node .` and now type `npm start` to restart the development server. From now on, any changes you make will automatically restart the server.

## Create the GraphQL Queries

To get something a little more useful, let's make a post editor. GraphQL is strongly typed, allowing you to create a type for each object and connect them. A common scenario might be to have a post with some text, that was written by a person. Update your schema to include these types. You can also update your `Query` type to utilize these new types.

```graphql
  type Query {
    posts: [Post]
    post(id: ID): Post
    authors: [Person]
    author(id: ID): Person
  }

  type Post {
    id: ID
    author: Person
    body: String
  }

  type Person {
    id: ID
    posts: [Post]
    firstName: String
    lastName: String
  }
```

Even though the resolvers aren't set up, you can already go back to GraphQL Playground and refresh the schema by clicking the circular arrow icon next to the `localhost` URL.

{% img blog/graphql-express/refresh-button.png alt:"url and refresh button" width:"600" %}{: .center-image }

The schema explorer is really useful for figuring out how to create your query. Click the green `SCHEMA` button to check out your new schema.

{% img blog/graphql-express/query-schema.png alt:"full query schema" width:"800" %}{: .center-image }

You'll need some way to store the data. To keep it simple, use JavaScript's [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) object for in-memory storage. You can also create some classes that will help connect the data from one object to another.

```javascript
const PEOPLE = new Map()
const POSTS = new Map()

class Post {
  constructor (data) { Object.assign(this, data) }
  get author () {
    return PEOPLE.get(this.authorId)
  }
}

class Person {
  constructor (data) { Object.assign(this, data) }
  get posts () {
    return [...POSTS.values()].filter(post => post.authorId === this.id)
  }
}
```

Now if you have an instance of a `Person`, you can find all of their posts by simply asking for `person.posts`. Since GraphQL lets you only ask for the data you want, the `posts` getter will never get called unless you ask for it, which could speed up the query if that's an expensive operation.

You'll also need to update your resolvers (the functions in `rootValue`) in order to accommodate these new types.

```javascript
const rootValue = {
  posts: () => POSTS.values(),
  post: ({ id }) => POSTS.get(id),
  authors: () => PEOPLE.values(),
  author: ({ id }) => PEOPLE.get(id)
}
```

This is great, but there's no data yet. For now, stub in some fake data. You can add this function and the call to it right after the assignment to `rootValue`.

```javascript
const initializeData = () => {
  const fakePeople = [
    { id: '1', firstName: 'John', lastName: 'Doe' },
    { id: '2', firstName: 'Jane', lastName: 'Doe' }
  ]

  fakePeople.forEach(person => PEOPLE.set(person.id, new Person(person)))

  const fakePosts = [
    { id: '1', authorId: '1', body: 'Hello world' },
    { id: '2', authorId: '2', body: 'Hi, planet!' }
  ]

  fakePosts.forEach(post => POSTS.set(post.id, new Post(post)))
}

initializeData()
```

Now that you have your queries all set up and some data stubbed in, go back to GraphQL Playground and play around a bit. Try getting all the posts, or get all the authors and posts associated with each one.

{% img blog/graphql-express/query-all-posts.png alt:"query all posts" width:"600" %}{: .center-image }

Or get weird and get a single post by id, then the author for that post, and all of that author's posts (including the one you just queried).

{% img blog/graphql-express/get-weird.png alt:"get weird" width:"600" %}{: .center-image }

## Add User Authentication to Your Express + GraphQL API

One simple way to add authentication to your project is with Okta. Okta is a cloud service that allows developers to create, edit, and securely store user accounts and user account data, and connect them with one or multiple applications. If you don't already have one, [sign up for a forever-free developer account](https://developer.okta.com/signup/).

You're going to need to save some information to use in the app. Create a new file named `.env`. In it, enter in your organization URL.

```bash
HOST_URL=http://localhost:4000
OKTA_ORG_URL=https://{yourOktaOrgUrl}
```

You will also need a random string to use as an App Secret for sessions. You can generate this with the following command:

```bash
echo "APP_SECRET=`openssl rand -base64 32`" >> .env
```

Next, log in to your developer console, navigate to **Applications**, then click **Add Application**. Select **Web**, then click **Next**.

{% img blog/graphql-express/create-new-application-settings.png alt:"create new application settings" width:"600" %}{: .center-image }

The page you come to after creating an application has some more information you need to save to your `.env` file. Copy in the client ID and client secret.

```bash
OKTA_CLIENT_ID={yourClientId}
OKTA_CLIENT_SECRET={yourClientSecret}
```

The last piece of information you need from Okta is an API token. In your developer console, navigate to **API** -> **Tokens**, then click on **Create Token**. You can have many tokens, so just give this one a name that reminds you what it's for, like "GraphQL Express". You'll be given a token that you can only see right now. If you lose the token, you'll have to create another one. Add this to `.env` also.

```bash
OKTA_TOKEN={yourOktaAPIToken}
```

Create a new file named `okta.js`. This is where you'll create some utility functions, as well as get the app initialized for Okta. When authenticated through Okta, your app will authenticate through an access token using JWT. You can use this to determine who a user is. To avoid dealing directly with authentication in your app, a user would sign in on Okta's servers, then send you a JWT that you can verify.

**okta.js**
```javascript
const session = require('express-session')

const OktaJwtVerifier = require('@okta/jwt-verifier')
const verifier = new OktaJwtVerifier({
  clientId: process.env.OKTA_CLIENT_ID,
  issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`
})

const { Client } = require('@okta/okta-sdk-nodejs')
const client = new Client({
  orgUrl: process.env.OKTA_ORG_URL,
  token: process.env.OKTA_TOKEN
})

const { ExpressOIDC } = require('@okta/oidc-middleware')
const oidc = new ExpressOIDC({
  issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
  client_id: process.env.OKTA_CLIENT_ID,
  client_secret: process.env.OKTA_CLIENT_SECRET,
  redirect_uri: `${process.env.HOST_URL}/authorization-code/callback`,
  scope: 'openid profile'
})

const initializeApp = (app) => {
  app.use(session({
    secret: process.env.APP_SECRET,
    resave: true,
    saveUninitialized: false
  }))
  app.use(oidc.router)
  app.use('/access-token', oidc.ensureAuthenticated(), async (req, res, next) => {
    res.send(req.userContext.tokens.access_token)
  })
}

module.exports = { client, verifier, initializeApp }
```

The `initializeApp` function adds some middleware to allow you to log in with Okta. Whenever you go to the `http://localhost:4000/access-token`, it will first check that you're logged in. If you aren't, it will first send you to Okta's servers to authenticate. Once authentication is successful, it returns you to the `/access-token` route and will print out your current access token, which will be valid for about an hour.

The `client` that you're exporting allows you to run some administrative calls on your server. You'll be using it later to get more information about a user based on their ID.

the `verifier` is what you use to verify that a JWT is valid, and it gives you some basic information about a user, like their user ID and email address.

Now, in `index.js`, you'll need to import this file and call the `initializeApp` function. You also need to use a tool called `dotenv` that will read your `.env` file and add the variables to `process.env`. At the very top of the file, add the following line:


```javascript
require('dotenv').config({ path: '.env' })
```

Just after the `app.use(cors())` line, add the following:

```javascript
const okta = require('./okta')
okta.initializeApp(app)
```

To make this all work, you'll also need to install a few new dependencies:

```bash
npm i @okta/jwt-verifier@0.0.12 @okta/oidc-middleware@1.0.0 @okta/oidc-sdk-nodejs@1.2.0 dotenv@6.0.0 express-session@1.15.6
```

You should now be able to go to `http://localhost:4000/access-token` to log in and get an access token. If you were just at your developer console, you'll probably find you're already logged in. You can log out of your developer console to ensure the flow works properly.

## Create GraphQL Mutations

Now it's time to use real data. There may be some real John and Jane Does out there, but chances are they don't have an account on your application yet. Next, I'll show you how to add some mutations that will use your current user to create, edit, or delete a post.

To generate IDs for a post, you can use `uuid`. Install it with `npm install uuid@3.3.2`, then add it to `index.js` with:

```javascript
const uuid = require('uuid/v4')
```

That should go near the top of the file, next to the other `require` statements.

While still in `index.js`, add the following types to your schema:

```graphql
  type Mutation {
    submitPost(input: PostInput!): Post
    deletePost(id: ID!): Boolean
  }

  input PostInput {
    id: ID
    body: String!
  }
```

To verify the user and save them as a new person, you'll need two new utility functions. Add these just before `const rootValue`:

```javascript
const getUserId = async ({ authorization }) => {
  try {
    const accessToken = authorization.trim().split(' ')[1]
    const { claims: { uid } } = await okta.verifier.verifyAccessToken(accessToken)

    return uid
  } catch (error) {
    return null
  }
}

const saveUser = async (id) => {
  try {
    if (!PEOPLE.has(id)) {
      const { profile: { firstName, lastName } } = await okta.client.getUser(id)

      PEOPLE.set(id, new Person({ id, firstName, lastName }))
    }
  } catch (ignore) { }

  return PEOPLE.get(id)
}
```

The `getUserId` function will check that the `authorization` request header has a valid token. On success, it will return the user's ID.

The `saveUser` function checks that the user isn't already saved. If they are, it simply returns the cached value. Otherwise, it will fetch the first and last name of the user and store that in the `PEOPLE` object.

Now add the following resolvers to `rootValue`:

```javascript
  submitPost: async ({ input }, { headers }) => {
    const authorId = await getUserId(headers)
    if (!authorId) return null

    const { id = uuid(), body } = input

    if (POSTS.has(id) && POSTS.get(id).authorId !== authorId) return null
    await saveUser(authorId)

    POSTS.set(id, new Post({ id, authorId, body }))

    return POSTS.get(id)
  },
  deletePost: async ({ id }, { headers }) => {
    if (!POSTS.has(id)) return false

    const userId = await getUserId(headers)
    if (POSTS.get(id).authorId !== userId) return false

    POSTS.delete(id)

    if (PEOPLE.get(userId).posts.length === 0) {
      PEOPLE.delete(userId)
    }

    return true
  }
```

The `submitPost` mutation first checks the user ID and returns `null` if there's no user. This means no operation will be done unless you're authenticated. It then gets the `id` and `body` off the input from the user. If there's no `id`, it will generate a new one. If there's already a post with the provided ID, it checks that it's owned by the user trying to edit it. If not, it again returns `null`.

Once `submitPost` has determined that the user is able to add or edit this post, it makes a call to `saveUser`. The `saveUser` function won't do anything if the user already exists but will add the user if they don't. Next, `submitPost` adds the post to the `POSTS` object, and returns the value in case the client wants to query the added post (to get the ID, for example).

The `deletePost` mutation will only let you delete a post if you're the user who created it. After successfully deleting a post, it checks to see if the user has any other posts. If that was their only post, `deletePost` will also remove that user from the dataset to clear up some (a rather small amount of) memory.

You can also get rid of the `initializeData` function now that you have the ability to add real data.

## Test the New GraphQL Mutations

Try to make a call to the new mutation and create a post. Since you're not authenticated, you should get `null` in response.

{% img blog/graphql-express/cannot-create-post.png alt:"cannot create post" width:"600" %}{: .center-image }

Typically an app of some sort, whether a web app or a native app, will handle the UI for authentication and then seamlessly pass along the `Authorization` header to the API. In this case, since we're just focusing on the API, I had you implement an endpoint for grabbing the auth token manually.

Head to [http://localhost:4000/access-token](http://localhost:4000/access-token) to sign in with Okta and get an access token. Copy the access token, then head back to the GraphQL Playground. At the bottom of the page, there's a link that says `HTTP HEADERS`. When you click that, a section will open up that allows you to add some headers as JSON. Add the following, making sure to add `Bearer` to the front of the token, so it should look something like `Bearer eyJraWQ...xHUOjj_A` (although the real token will be much longer):

```json
{
  "authorization": "Bearer {yourAccessToken}"
}
```

You should now be authenticated, and the same post will return a valid post:

{% img blog/graphql-express/can-create-post.png alt:"authenticated - can create post" width:"600" %}{: .center-image }

If you want to mess around with other users, you can add people from the developer console by navigating to **Users** -> **People**, then clicking on **Add Person**. You could then visit the `/access-token` endpoint from an incognito window, or after logging out of the developer console.

{% img blog/graphql-express/add-person.png alt:"add a person" width:"600" %}{: .center-image }

## Learn more about GraphQL, Express, and Okta

Try playing around with the API a bit and see what fun stuff you can do with it. I think you'll quickly see what can make GraphQL so much more powerful than a traditional REST API, and how it can be fun to work with even if you're just using the Playground. See if you can come up data points to connect, or get data from external sources. Since resolvers are simply `async` functions, you could just as easily fetch data from an external API or from a database. Your imagination is the limit.

If you want to see the final sample code, you can find it [on github](https://github.com/oktadeveloper/okta-express-graphql-example).

If you'd like to learn more about GraphQL or Express, check out some of these other posts on the Okta developer blog:

* [Build a Secure API with Spring Boot and GraphQL](/blog/2018/08/16/secure-api-spring-boot-graphql)
* [Build a Health Tracking App with React, GraphQL, and User Authentication](/blog/2018/07/11/build-react-graphql-api-user-authentication)
* [Build and Understand Express Middleware through Examples](/blog/2018/09/13/build-and-understand-express-middleware-through-examples)
* [Build and Understand a Simple Node.js Website with User Authentication](/blog/2018/08/17/build-and-understand-user-authentication-in-node)
* [Tutorial: Build a Basic CRUD App with Node.js](/blog/2018/06/28/tutorial-build-a-basic-crud-app-with-node)

If you have any questions about this post, please add a comment below. For more awesome content, follow [@oktadev](https://twitter.com/oktadev) on Twitter, like us [on Facebook](https://www.facebook.com/oktadevelopers/), and subscribe to [our YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q).

