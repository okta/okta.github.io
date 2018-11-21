---
layout: blog_post
title: "Create and Verify JWTs with Node"
author: bkelley
description: "This article explains how to create and verify JWTs in Node apps."
tags: [jwt, token auth, token authentication, node]
tweets:
- "JWTs + @Nodejs = 🎂"
- "Tutorial - Create and Verify JSON Web Tokens with @Nodejs"
- "Learn how to create and verify JWTs with @Nodejs"
image: blog/featured/okta-node-tile-books-mouse.jpg
---

Authentication on the internet has evolved quite a bit over the years. There are many ways to do it, but what worked well enough in the 90s doesn't quite cut it today. In this tutorial, I'll briefly cover some older, simpler forms of authentication, then show you how a more modern and more secure approach. By the end of this post, you'll be able to create and verify JWTs yourself in Node. I'll also show you how you can leverage Okta to do it all for you behind the scenes.

Traditionally, the simplest way to do authorization is with a username and password. This is called Basic Authorization and is done by just sending `username:password` as an encoded string that can be decoded by anybody looking. You could think of that string as a "token". The problem is, you're sending your password with every request. You could also send your username and password a single time, and let the server create a session ID for you. The client would then send that ID along with every request instead of a username and password. This method works as well, but it can be a hassle for the client to store and maintain sessions, especially for large sets of users.

The third method for managing authorization is via JSON Web Tokens, or JWTs. JWTs have become the de facto standard over the last few years. A JWT makes a set of claims, (e.g. "I'm Abe Froman, the Sausage King of Chicago") that can be verified. Like Basic Authorization, the claims can be read by anybody. Unlike Basic Auth, however, you wouldn't be sharing your password with anyone listening in. Instead, it's all about trust.

## Trust, but Verify... Your JWTs
{% img blog/node-jwt/it-must-be-true.jpg alt:"it must be true" width:"600" %}{: .center-image }

OK, maybe don't believe everything you read on the internet. You might be wondering how someone can just make some claims and expect the server to believe them. When you make a claim using a JWT, it's signed off by a server that has a secret key. The server reading the key can easily verify that the claim is valid, even without knowing the secret that was used. However, it would be nearly impossible for someone to modify the claims and make sure the signature was valid without having access to that secret key.

## Why Use a JWT?
Using a JWT allows a server to offload authentication to a 3rd party they trust. As long as you trust the 3rd party, you can let them ensure that the user is who they say they are. That 3rd party will then create a JWT to be passed to your server, with whatever information is necessary. Typically this includes at least the user's user id (standardly referred to as `sub` for "subject"), the "issuer" (`iss`) of the token, and the "expiration time" (`exp`). There are [quite a few](https://tools.ietf.org/html/rfc7519#section-4.1) standardized claims, but you can really put any JSON you want in a claim. Just remember the more info you include, the longer the token will be.

## Build a Simple Node App
To create and verify your own JWTs, you'll first need to set up a Node server (well, you don't _have_ to, but that's what I'll be teaching you today). To get started, run the following commands to set up a new project:

```bash
mkdir fun-with-jwts
cd fun-with-jwts
npm init -y
npm install express@4.16.4
npm install -D nodemon@1.18.6
```

Next, create a new file `index.js` that will contain a super simple node server. There are three endpoints in here, that are just stubbed with `TODO`s as notes for what to implement.

The `/create` endpoint will require basic authorization to log you in. If you were writing a real OAuth server, you would probably use something other than Basic Auth. You would also need to look up the user in a database and make sure they provided the right password. To keep things simple for the demo, I've just hard-coded a single username and password here, so we can focus on the JWT functionality.

The `/verify` endpoint takes a JWT as a parameter to be decoded.

```javascript
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/create', (req, res) => {
  if (req.headers.authorization !== 'Basic QXp1cmVEaWFtb25kOmh1bnRlcjI=') {
    res.set('WWW-Authenticate', 'Basic realm="401"')
    res.status(401).send('Try user: AzureDiamond, password: hunter2')
    return
  }

  res.send('TODO: create a JWT')
})

app.get('/verify/:token', (req, res) => {
  res.send(`TODO: verify this JWT: ${req.params.token}`)
})

app.get('/', (req, res) => res.send('TODO: use Okta for auth'))

app.listen(port, () => console.log(`JWT server listening on port ${port}!`))
```

You can now run the server by typing `node_modules/.bin/nodemon .`. This will start a server on port 3000 and will restart automatically as you make changes to your source code. You can access it by going to `http://localhost:3000` in your browser. To hit the different endpoints, you'll need to change the URL to `http://localhost:3000/create` or `http://localhost:3000/verify/asdf`. If you prefer to work in the command line, you can use `curl` to hit all those endpoints:

```bash
$ curl localhost:3000
TODO: use Okta for auth

$ curl localhost:3000/create
Try user: AzureDiamond, password: hunter2

$ curl AzureDiamond:hunter2@localhost:3000/create
TODO: create a JWT

$ curl localhost:3000/verify/asdf
TODO: verify this JWT: asdf
```

## Create JSON Web Tokens in Your Node App
A JSON Web Token has three parts. The **header**, the **payload**, and the **signature**, separated by `.`s.

The **header** is a base64 encoded JSON object specifying which algorithm to use and the type of the token.

The **payload** is also a base64 encoded JSON object containing pretty much anything you want. Typically it will at least contain an expiration timestamp and some identifying information.

The **signature** hashes the header, the payload, and a secret key together using the algorithm specified in the header.

There are a number of tools out there to create JWTs for various languages. For Node, one simple one is `njwt`. To add it to your project, run

```bash
npm install njwt@0.4.0
```

Now replace the `res.send('TODO: create a JWT')` line in `index.js` with the following:

```javascript
  const jwt = require('njwt')
  const claims = { iss: 'fun-with-jwts', sub: 'AzureDiamond' }
  const token = jwt.create(claims, 'top-secret-phrase')
  token.setExpiration(new Date().getTime() + 60*1000)
  res.send(token.compact())
```

Feel free to mess around with the payload. With the `setExpiration()` function above, the token will expire in one minute, which will let you see what happens when it expires, without having to wait too long.

To test this out and get a token, log in via the `/create` endpoint. Again, you can go to your browser at `http://localhost:3000/create`, or use curl:

```bash
$ curl AzureDiamond:hunter2@localhost:3000/create
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoZWxsbyI6IndvcmxkISIsIm51bWJlciI6MC41MzgyNzE0MTk3Nzg5NDc4LCJpYXQiOjE1NDIxMDQ0NDgsImV4cCI6MTU0MjEwNDUwOCwiaXNzIjoiZnVuLXdpdGgtand0cyIsInN1YiI6IkF6dXJlRGlhbW9uZCJ9.LRVmeIzAYk5WbDoKfSTYwPx5iW0omuB76Qud-xR8We4
```

## Verify JSON Web Tokens in Your Node App
Well, that looks a bit like gibberish. You can see there are two `.`s in the JWT, separating the header, payload, and signature, but it's not human readable. The next step is to write something to decode that string into something that makes a little more legible.

Replace the line containing `TODO: verify this JWT` with the following:

```javascript
  const jwt = require('njwt')
  const { token } = req.params
  jwt.verify(token, 'top-secret-phrase', (err, verifiedJwt) => {
    if(err){
      res.send(err.message)
    }else{
      res.send(verifiedJwt)
    }
  })
```

In the route `/verify/:token`, the `:token` part tells express that you want to read that section of the URL in as a param, so you can get it on `req.params.token`. You can then use `njwt` to try to verify the token. If it fails, that could mean a number of things, like the token was malformed or it has expired.

Back on your website, or in curl, create another token using `http://localhost:3000/create`. Then copy and paste that into the URL so you have `http://localhost:3000/verify/eyJhb...R8We4`. You should get something like the following:

```json
{
  "header": { "typ": "JWT", "alg": "HS256" },
  "body": {
    "iss": "fun-with-jwts",
    "sub": "AzureDiamond",
    "jti": "3668a38b-d25d-47ee-8da2-19a36d51e3da",
    "iat": 1542146783,
    "exp": 1542146843
  }
}
```

If you wait a minute and try again, you'll instead get `jwt expired`.

## Add OIDC Middleware to Your Node App to Handle JWT Functionality
Well, that wasn't so bad. But I sure glossed over a lot of details. That `top-secret-phrase` isn't really very top secret. How do you make sure you have a secure one and it's not easy to find? What about all the other JWT options? How do you actually store that in a browser? What's the optimal expiration time for a token?

This is where Okta comes in to play. Rather than dealing with all this yourself, you can leverage Okta's cloud service to handle it all for you. After a couple minutes of setup, you can stop thinking about how to make your app secure and just focus on what makes it unique.

### Why Auth with Okta?
Okta is a cloud service that allows developers to create, edit, and securely store user accounts and user account data, and connect them with one or multiple applications. Our API enables you to:

* [Authenticate](https://developer.okta.com/product/authentication/) and [authorize](https://developer.okta.com/product/authorization/) your users
* Store data about your users
* Perform password-based and [social login](https://developer.okta.com/authentication-guide/social-login/)
* Secure your application with [multi-factor authentication](https://developer.okta.com/use_cases/mfa/)
* And much more! Check out our [product documentation](https://developer.okta.com/documentation/)

If you don't already have one, [sign up for a forever-free developer account](https://developer.okta.com/signup/).

### Create an Okta Server
You're going to need to save some information to use in your app. Create a new file named `.env`. In it, enter your Okta organization URL.

```bash
HOST_URL=http://localhost:3000
OKTA_ORG_URL=https://{yourOktaOrgUrl}
```

You will also need a random string to use as an App Secret for sessions. You can generate this with the following commands:

```bash
npm install -g uuid-cli
echo "APP_SECRET=`uuid`" >> .env
```

Next, log in to your developer console, navigate to **Applications**, then click **Add Application**. Select **Web**, then click **Next**. Give your application a name, like "Fun with JWTs". Change the **Base URI** to `http://localhost:3000/` and the **Login redirect URI** to `http://localhost:3000/implicit/callback`, then click **Done**

Click **Edit** and add a **Logout redirect URI** of `http://localhost:3000/`, then click **Save**.

{% img blog/node-jwt/okta-app-settings.png alt:"okta app settings" width:"600" %}{: .center-image }

The page you come to after creating an application has some more information you need to save to your `.env` file. Copy in the client ID and client secret.

```bash
OKTA_CLIENT_ID={yourClientId}
OKTA_CLIENT_SECRET={yourClientSecret}
```

Now back to the code. You'll need to add Okta's OIDC middleware to control authentication. It also relies on using sessions. You'll need to use `dotenv` to read in variables from the `.env` file. To install the dependencies you'll need, run this command:

```bash
npm install @okta/oidc-middleware@1.0.2 dotenv@6.1.0 express-session@1.15.6
```

At the very top of your `index.js` file, you'll need to include `dotenv`. This will make it so that the secrets in your `.env` file can be read by your program. Add this line before anything else:

```javascript
require('dotenv').config()
```

To get Okta set up securely, you'll need to tell Express to use Okta's OIDC middleware, which also requires sessions. Look for the line containing `TODO: use Okta for auth` in your `index.js` file, then enter the following just above it to initialize Okta with all your environment variables:

```javascript
const session = require('express-session')
const { ExpressOIDC } = require('@okta/oidc-middleware')

app.use(session({
  secret: process.env.APP_SECRET,
  resave: true,
  saveUninitialized: false
}))

const oidc = new ExpressOIDC({
  issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
  client_id: process.env.OKTA_CLIENT_ID,
  client_secret: process.env.OKTA_CLIENT_SECRET,
  redirect_uri: `${process.env.HOST_URL}/authorization-code/callback`,
  scope: 'openid profile'
})

app.use(oidc.router)
```

Now that you're all set up, creating secure routes will be a breeze! To test it out, replace the remaining `TODO: use Okta for auth` line, with a route like this:

```javascript
app.get('/', oidc.ensureAuthenticated(), (req, res) => res.send('Peekaboo!'))
```

Now when you go to `http://localhost:3000`, you'll be redirected to a secure sign-in page. Since you're probably still logged in to Okta from the admin panel, you may need to use a different browser or an incognito window to see the login screen as other visitors to your site would.

{% img blog/node-jwt/okta-sign-in.png alt:"okta sign in page" width:"400" %}{: .center-image }


Once you sign in, you'll get your hidden message!

## Learn More about Node, JWTs, and Secure User Management
You can certainly do a lot more meaningful things than just printing `Peekaboo!`, but the key takeaway here is that after a quick setup, you can add authentication to any route in your Express server by adding a simple `oidc.ensureAuthenticated()`. Okta takes care of managing users, storing sessions, creating and verifying JWTs, so you don't have to!

If you'd like to learn more about JWTs or Node, check out some of these other posts on the Okta developer blog:

* [What Happens If Your JWT Is Stolen?](/blog/2018/06/20/what-happens-if-your-jwt-is-stolen)
* [Secure a Node API with OAuth 2.0 Client Credentials](/blog/2018/04/24/simple-node-authentication)
* [Tutorial: Create and Verify JWTs in Java](/blog/2018/10/31/jwts-with-java)
* [Simple Node Authentication](/blog/2018/04/24/simple-node-authentication)
* [Why JWTs Suck as Session Tokens](/blog/2017/08/17/why-jwts-suck-as-session-tokens)

If you have any questions about this post, please add a comment below. For more awesome content, follow [@oktadev](https://twitter.com/oktadev) on Twitter, like us [on Facebook](https://www.facebook.com/oktadevelopers/), or subscribe to [our YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q).
