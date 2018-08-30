---
layout: blog_post
title: "Deploy Your Secure Vue.js App to AWS"
author: bparise
description: "This article shows you how to create a secure Vue.js app and deploy it to AWS."
tags: [vue.js, vue, aws, serverless]
tweets:
- "Want to learn how to deploy a secure @vuejs to AWS? This article is for you!"
- "In this tutorial, you'll learn how to build a @vuejs app that you can easily deploy to AWS and CloudFront. As an added bonus, it leverages a serverless API for its backend."
---

Writing a Vue app is intuitive, straightforward, and fast.  With low barriers to entry, a component-based approach, and built-in features like hot reloading and webpack, Vue allows you to focus on developing your application rather than worrying about your dev environment and build processes.  But, what happens when you are ready to deploy your app into production?  The choices can be endless and sometimes unintuitive.

As an AWS Certified Solutions Architect, I am frequently asked how to deploy Vue apps to AWS.  In this tutorial, I will walk you through building a small, secure Vue app and deploying it to Amazon Web Services (AWS).  If you've never used AWS, don't worry!  I'll walk you through each step of the way starting with creating an AWS account.

## About AWS

Amazon Web Services (AWS) is a cloud platform that provides numerous [on-demand cloud services](https://aws.amazon.com/products/).  These services include cloud computing, file storage, relational databases, a content distribution network, and many, many more.   AWS came into existence not as a retail offering, but rather Amazon's internal answer to the growing complexity of the infrastructure that was responsible for powering Amazon.com and their e-commerce operations.  Amazon quickly realized their cloud-based infrastructure was a compelling, cost-effective solution and opened it to the public in 2006.

At the time of writing this article, AWS is worth an estimated <a href="https://seekingalpha.com/article/4140036-much-amazon-web-services-worth-now" data-proofer-ignore>$250B</a> (yes, that's a B for BILLION) and used by thousands of companies and developers worldwide.

{% img blog/vue-aws/aws-vue-aws-services.png alt:"AWS Products" width:"800" %}{: .center-image }

## What You Will Build

I feel the best way to learn is by doing.  I'll walk you through building a small, Vue app with an Express REST server.  You will secure your app using [Okta's OpenID Connect (OIDC)](https://developer.okta.com/docs/api/resources/oidc) which enables user authentication and authorization with just a few lines of code.

You will begin by building the Vue frontend and deploy it to Amazon S3.  Then you will leverage Amazon CloudFront to distribute your Vue frontend to edge servers all around the world.  Lastly, you will create an Express API server and deploy it with [Serverless](https://serverless.com/).  This API server will contain a method to fetch "secure data" (just some dummy data) which requires a valid access token from the client to retrieve.

The goal of this article is to show you how to leverage multiple AWS services rather than just spinning up a single EC2 instance to serve your app.  With this services-based approach, you have a limitless scale, zero maintenance, and a cost-effective way to deploy apps in the cloud.

## What is Okta?

Okta is a cloud service that allows developers to manage user authentication and connect them with one or multiple applications. The Okta API enables you to:

- [Authenticate](https://developer.okta.com/product/authentication/) and [authorize](https://developer.okta.com/product/authorization/) your users
- Store data about your users
- Perform password-based and [social login](https://developer.okta.com/authentication-guide/social-login/)
- Secure your application with [multi-factor authentication](https://developer.okta.com/use_cases/mfa/)
- And much more! Check out our [product documentation](https://developer.okta.com/documentation/)

[Register for a free developer account](https://developer.okta.com/signup/), and when you're done, come on back so we can learn more deploying a Vue app to AWS.

## Bootstrap Frontend

You are going to build the Vue frontend to your secure app first and deploy it to Amazon S3 and Amazon CloudFront.  Amazon S3 (Simple Storage Service) is a highly redundant, object-based file store that is both powerful and [featureful](https://docs.aws.amazon.com/AmazonS3/latest/dev/Introduction.html#S3Features).   In the scope of this article, we will focus on one of the best features S3 provides: Static website hosting.

To get started quickly, you can use the scaffolding functionality from [vue-cli](https://github.com/vuejs/vue-cli) to get your app up and running quickly.  For this article, you can use the [webpack template](https://github.com/vuejs-templates/webpack) that includes hot reloading, CSS extraction, linting, and integrated build tools.

To install `vue-cli` run:

```bash
npm install -g vue-cli@2.9.6
```

Next up is to initialize your project.  When you run the following `vue init` command, accept all the default values.

```bash
vue init webpack secure-app-client
cd ./secure-app-client
npm run dev
```

The init method should also install your app's dependencies.  If for some reason it doesn't, you can install them via `npm install`.  Finally, open your favorite browser and navigate to `http://localhost:8080`.  You should see the frontend come alive!

{% img blog/vue-aws/aws-vue-2.png alt:"Welcome to Your Vue.js App" width:"800" %}{: .center-image }

## About Single Page Applications

When you create an application with Vue, you are developing a Single Page Application (or "SPA").  SPAs have numerous advantages over traditional multi-page, server-rendered apps.  It's important to understand the difference between SPAs and multi-page web applications — especially when it comes to deploying.

A SPA app is often referred as a "static app" or "static website."  Static, in this context, means that your application compiles all its code to static assets (HTML, JS, and CSS).  With these static assets, there is no specialized web server required to serve the application to your users.

Traditional web applications require a specialized web server to render every request to a client.  For each of these requests, the entire payload of a page (including static assets) is transferred.

Conversely, within an SPA there is only an initial request for the static files, and then JavaScript dynamically rewrites the current page.  As your users are navigating your app, requests to subsequent pages are resolved locally and don't require an HTTP call to a server.

{% img blog/vue-aws/aws-vue-3.png alt:"SPA versus Traditional Web Server" width:"800" %}{: .center-image }

## Vue-router and Creating Additional Routes

The component of an SPA that is required to rewrite the current page dynamically is commonly referred to as a "router".  The router programmatically calculates which parts of the page should mutate based off the path in the URL.

Vue has an official router that is aptly named [vue-router](https://router.vuejs.org/).   Since you used the vue-cli bootstrap, your app has this dependency and a router file defined (`./src/router/index.js`).  Before we can define additional routes, we need to create the pages (or components) that you want the router to render.  Create the following files in your project:

Homepage:  `./src/components/home.vue`

```html
<template>
  <div>
    <h1>Home</h1>
    <div>
      <router-link to="/secure">Go to secure page</router-link>
    </div>
  </div>
</template>
```

Secure Page (not secured... yet!)  `./src/components/secure.vue`

```html
<template>
  <div>
    <h1>Secure Page</h1>
    <div>
      <router-link to="/">Go back</router-link>
    </div>
  </div>
</template>
```

Using [vue-router](https://router.vuejs.org/), you can inform the application to render each page based on the path.

Modify  `./src/router/index.js`  to match the following code snippet:

```js
import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import Secure from '@/components/secure'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/secure',
      name: 'Secure',
      component: Secure
    }
  ]
})

export default router
```

Try it out!  Tab back to your browser, and you should see the new home screen.  If you click on the "Go to secure page" link you will notice the page (and URL) change, but no request was sent to a server!

## Understand Hash History

As you navigated between the two pages above, you might have seen that the URL looks different than expected (do you noticed the "#/" at the beginning of the path?)

`http://localhost:8080/#/` and `http://localhost:8080/#/secure`

The reason the URL looks like is because vue-router's default mode is _hash mode_. Hash mode simulates a new URL change without instructing the browser to reload the page.  This behavior is what allows SPA's to navigate pages without forcing your browser to make any additional HTTP requests.  Vue-router listens for changes in the hash portion of the URL (everything after the "#") and responds accordingly based on the routes configured.

You can change the mode of vue-router to leverage _history mode_ which will give your app "pretty URLs" like:

`http://localhost:8080/secure`

But, this comes with a significant drawback — especially when you are deploying.  Since your SPA compiles to a static assets, there is just one single entry point `index.html`.  If you try to access a page direction that is not `index.html` page (i.e.;  `http://localhost:8080/secure`) the web server will return a 404 error.  _Why_? The browser is sending a GET `/secure` request to the server and trying to resolve to the filesystem "/secure" (and the file doesn't exist).  It does work when you navigate to `/secure` from the homepage because vue-router prevents the default behavior of the browsers and instructs the router instance to fire in any mode.

By using history mode, you have to take additional steps to make sure page refreshes work correctly.  You can read more about [HTML5 History Mode](https://router.vuejs.org/guide/essentials/history-mode.html#html5-history-mode). To keep things easy, I will show you a simple trick to ensure your refreshing works with AWS CloudFront.

Enable history mode by modifying `./router/index.js` with the following setting.

```js
let router = new Router({
  mode: 'history',
})
```

**Note:**  The dev server (`npm run dev`) automatically rewrites the URL to `index.html` for you.  So the behavior you see locally is how it should work in production.

## Building Your Single Page Application

Now that you have a simple, two-page frontend working locally, it's time to build your app and get it deployed to AWS!

Because you used vue-cli scaffolding, a single call to the included build script is all you need.  From your project root, run `npm run build` and webpack will build your application into the target `./dist` directory. If the dev server is still running in your console, you can press CTRL+C.

If you open the `./dist` folder and you should see the results of the build process:

- `./index.html` - This is the entry point of your SPA.  It's a minified HTML document with links to the apps CSS and JS.
- `./static` - This folder contains all your compiled static assets (JS and CSS)

During the build, you might have noticed the following notification: **Tip: built files are meant to be served over an HTTP server. Opening index.html over file:// won't work**.  If you want to test your newly compiled application locally, you can use `serve` (install via `npm install -g serve`).  Run `serve ./dist` and it will output a URL for you to load into your browser.

This also gives you to have a hands-on experience with the major caveat of history mode with vue-router.  After running `serve ./dist`, click on the "Go to secure page". You should see a 404 error.

{% img blog/vue-aws/aws-vue-4.png alt:"404 Error" width:"800" %}{: .center-image }

## Getting Started with AWS

You will need an AWS account to continue beyond this point.  If you already have an AWS account, you can skip ahead.  If you don't, it's a simple process that only takes a few minutes.

- Navigate to the [Amazon Web Services home page](https://aws.amazon.com)
- Click **Sign Up** (or if you have signed into AWS recently choose **Sign In to the Console**)
- If prompted, you can select "Personal" for account type
- Complete the required information, add a payment method, and verify your phone number
- After your account is created, you should receive a confirmation email
- Log in!

*Note:* Amazon requires you to enter a payment method before you can create your account.  All the services discussed in this article are covered under  [AWS Free Tier](https://aws.amazon.com/free/) which gives you 12 months FREE.

## Host Your App on Amazon S3

Since your SPA is comprised of only static assets, we can leverage Amazon S3 (Simple Storage Service) to store and serve your files.

To get started, you will need to create a bucket.  Buckets are a logical unit of storage within S3, and you can have up to 100 buckets per AWS account by default (if you are studying for the AWS Certified Solutions Architect exam, you should know this!).  Each bucket can have its own configuration and contain unlimited files and nested folders.

After you log in to your AWS Console, navigate to the S3 console (you can do this under AWS services search for "S3").

- Click "Create Bucket" and enter a Bucket name.  **_Important_**: Bucket names are unique across the entire AWS platform.  I chose `bparise-secure-app-client` for this article, but you might need to be creative with your naming!
- Click "Create" in the bottom left.

{% img blog/vue-aws/aws-vue-create-bucket.png alt:"Create S3 Bucket" width:"800" %}{: .center-image }

You should now see your bucket listed.  Next, let's configure it for static website hosting.

- Click your Bucket name and then choose the "Properties" tab.
- Click on "Static website hosting" box
- Choose "Use this bucket to host a website" and add "index.html" as the index document.  Click "Save".

{% img blog/vue-aws/aws-vue-5.png alt:"Static website hosting" width:"800" %}{: .center-image }

At the top of the Static website hosting box, you should see a URL for "Endpoint".  This is the publicly accessible URL to view your static website.  Open the link into a new browser window, and you should see this:

{% img blog/vue-aws/aws-vue-6.png alt:"403 Forbidden" width:"800" %}{: .center-image }

#### Access Denied and S3 Bucket Policies

Yes, you should see a 403 Forbidden error!  By default, S3 bucket permissions are _deny all_.  To access your bucket's contents, you must explicitly define who can access your bucket.  These bucket permissions are called a Bucket Policy.

To add a Bucket Policy, click on the "Permissions" tab and click "Bucket Policy" button at the top.  The following policy allows anyone to read any file in your bucket.  Make sure to replace "YOUR-BUCKET-NAME" with your actual bucket name.

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "PublicReadAccess",
			"Effect": "Allow",
			"Principal": "*",
			"Action": "s3:GetObject",
			"Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
		}
	]
}
```

Bucket Policies can be quite complex and powerful.  But, the main parts of the policy that you should be aware of are:

- `"Effect": "Allow"`
- `"Principal": "*"` - Who the policy covers ("\*" implies everyone)
- `"Action": "s3:GetObject"` - The action allowed (s3:GetObject allows  read-only access to all objects in your bucket)
- `"Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"` - Which bucket and objects the policy is about.

Click "Save" on the Bucket Policy editor.  You should notice a new error is displayed if you set up the policy correctly:

{% img blog/vue-aws/aws-vue-8.png alt:"This bucket has public access" width:"800" %}{: .center-image }

This warning is good advice and a rule of thumb for all S3 buckets.  But, since our bucket is exclusively used to host a static website, we don't have to worry about anyone accessing a file within the bucket they shouldn't.

Tab back to your browser and refresh the endpoint.  You should now see a 404 Not Found error.  This error is much easier to resolve because you don't have any files in your bucket yet.

{% img blog/vue-aws/aws-vue-9.png alt:"404 index.html not found" width:"800" %}{: .center-image }

## Deploy to AWS with aws-cli

Now that you have a bucket created and permissions correctly set, it's time to upload your static assets.  Although you can do this manually through the interface by using the "Upload" button, I feel using the [aws-cli](https://aws.amazon.com/cli/) is more efficient.

Installing  `asw-cli` is different based on your OS.  Choose one:

- Windows: https://aws.amazon.com/cli/
- Mac/linux run `pip install awscli`

After you've installed `aws-cli`, you will need to generate keys within AWS so you can perform actions via the CLI.

- Choose your account name in the navigation bar, and then choose My Security Credentials. (If you see a warning about accessing the security credentials for your AWS account, choose Continue to Security Credentials.)
- Expand the Access keys (access key ID and secret access key) section.
- Choose Create New Access Key. A warning explains that you have only this one opportunity to view or download the secret access key. It cannot be retrieved later.
- If you choose Show Access Key, you can copy the access key ID and secret key from your browser window and paste it somewhere else.
- If you choose Download Key File, you receive a file named `rootkey.csv` that contains the access key ID and the secret key. Save the file somewhere safe.

Note: If you had an existing AWS account or are not using root credentials.  You can view and generate your keys in IAM.

Now that you have your Access Key and Secret Access Key, you need to configure the cli.   In your console run  `aws configure` and paste in your keys.

```
$ aws configure
AWS Access Key ID [None]: YOUR KEY
AWS Secret Access Key [None]: YOUR SECRET
Default region name [None]: us-east-1
Default output format [None]: ENTER
```

Now, you can use the `aws-cli` to sync your `./dist` folder to your new bucket.  Syncing will diff what's in your `./dist` folder with what's in the bucket and only upload the required changes.

```
aws s3 sync ./dist s3://your-bucket-name
```

Tab back to your S3 bucket endpoint, and you should see your site hosted on S3!

{% img blog/vue-aws/aws-vue-10.png alt:"Vue.js on S3" width:"800" %}{: .center-image }

For convenience, add the following script entry to `package.json` so you can run `npm run deploy` when you want to sync your files.

```
"scripts": {
  "deploy": "aws s3 sync ./dist s3://your-bucket-name"
}
```


## Distribute your App with Amazon CloudFront CDN

Amazon S3 static web hosting has ultra-low latency if you are geographically near the region your bucket is hosted in.  But, you want to make sure all users can access your site quickly regardless of where they are located.  To speed up delivery of your site, you can AWS CloudFront CDN.

CloudFront is a global content delivery network (CDN) that securely delivers content (websites, files, videos, etc) to users around the globe.  At the time of writing this article, CloudFront supports over 50 edge locations:

{% img blog/vue-aws/aws-vue-11.png alt:"CloudFront Locations" width:"800" %}{: .center-image }

Setting up a CloudFront Distribution takes just a few minutes now that your files are stored in S3.

- Go to [CloudFront Home](https://console.aws.amazon.com/cloudfront/home)
- Click **Create Distribution**, and select **Get Started** under Web settings
- In the "Origin Domain Name" you should see your bucket name in the drop-down.  Select that bucket and make the following changes:
- Viewer Protocol Policy: "Redirect HTTP to HTTPS".  (This is a secure app, right!?)
- Object Caching: "Customize". And set Minimum TTL and Default TTL both to "0".  You can adjust this later to maximize caching.  But, having it at "0" allows us to deploy changes and quickly see them.
- Default Root Object: "index.html"
- Click **Create Distribution**

The process can take anywhere from 5-15 minutes to fully provision your distribution.

While you wait, you need to configure your distribution to handle vue-router's history mode.  Click on the ID of your new distribution and click the "Error Page" tab.  Add the following error pages.

{% img blog/vue-aws/aws-vue-1.png alt:"CloudFront Error Redirects" width:"800" %}{: .center-image }

These error page configurations will instruct CloudFront to respond to any 404/403 with `./index.html`.  Voila!

Click on the "General" tab, and you should see an entry for "Domain Name".  The Domain Name is the publicly accessible URL for your distribution.  After the status of your new distribution is Deployed, paste the URL into your browser.

Test to make sure the history mode works by navigating to the secure page and refreshing your browser.

## Add Authentication with Okta

To use Okta, you must first have an Okta developer account. If you don't have one you can [create a free account](https://developer.okta.com/signup/). After you are logged in, click "Applications" in the navbar and then "Add Application" button. Make sure to select "Single-Page App" as the platform and click Next.

You will need to add your CloudFront URL to both Base URIs and also as a Login redirect URIs, otherwise Okta will not allow you to authenticate. Your application settings should look similar to this (except for your CloudFront URL).

**Note:** Make sure to use HTTPS when entering your CloudFront URL.

{% img blog/vue-aws/aws-vue-13.png alt:"Okta Application Settings" width:"710" %}{: .center-image }

Take note of your "Client ID" at the bottom of the "General" tab as you will need it to configure your app.

## Add Secure Authentication to Your App

Okta has a handy Vue component to handle all the heavy lifting of integrating with their services. To install the Okta Vue SDK, run the following command:

```bash
npm i @okta/okta-vue@1.0.1
```

Open `src/router/index.js` and modify it to look like the following code.  Also, make sure to change `{clientId}` and `{yourOktaDomain}` to yours!

```js
import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import Secure from '@/components/secure'
import Auth from '@okta/okta-vue'

Vue.use(Auth, {
  issuer: 'https://{yourOktaDomain}/oauth2/default',
  client_id: '{clientId}',
  redirect_uri: window.location.origin + '/implicit/callback',
  scope: 'openid profile email'
})

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/implicit/callback',
      component: Auth.handleCallback()
    },
    {
      path: '/secure',
      name: 'Secure',
      component: Secure,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach(Vue.prototype.$auth.authRedirectGuard())

export default router
```

Next is to lock down the `/secure` route to only authenticated users.  Okta's Vue SDK comes with the method `auth.authRedirectGuard()` that inspects your routes metadata for the key `requiresAuth` and redirects unauthenticated users to Okta's authentication flow.

Finally, make some style changes to `App.vue`

{% raw %}
```html
<template>
  <div id="app">
	<div>
	  <a href="#" v-if="!activeUser" @click.prevent="login">Login</a>
	  <div v-else>
		Welcome {{ activeUser.email }} - <a href="#" @click.prevent="logout">Logout</a>
	  </div>
	</div>
	<router-view/>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        activeUser: null
      }
    },
    async created () {
      await this.refreshActiveUser()
    },
    watch: {
      // everytime a route is changed refresh the activeUser
      '$route': 'refreshActiveUser'
    },
    methods: {
      login () {
        this.$auth.loginRedirect()
      },
      async refreshActiveUser () {
        this.activeUser = await this.$auth.getUser()
      },
      async logout () {
        await this.$auth.logout()
        await this.refreshActiveUser()
        this.$router.push('/')
      }
    }
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```
{% endraw %}

In your terminal, restart the dev server via `npm run dev`. Tab to your browser and open `http://localhost:8080`.  If you click "Login" or "Go to secure page" (the protected `/secure` route), you should get Okta's authentication flow.

{% img blog/vue-aws/aws-vue-14.png alt:"Okta Sign-In" width:"800" %}{: .center-image }

Clicking either of these should show you as logged in and you should be able to access the Secure Page.

## Build a Secure Express REST Server

Finally, we are going to build an [Express](https://expressjs.com/) server to respond to `/hello` and `/secure-data` requests.  The `/secure-data` will be protected and require an authentication token from the frontend.  This token is available via `$auth.getUser()` thanks to Okta's Vue SDK.

To get started, create a new directory for your server.

```bash
mkdir secure-app-server
cd secure-app-server
npm init -y
```

Then install the required dependencies.

```bash
npm install -s express cors body-parser @okta/jwt-verifier aws-serverless-express
```

Next is to create a file that will define the application.  Copy the following code into `app.js` and change  `{clientId}` and `{yourOktaDomain}` to yours.

```js
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const OktaJwtVerifier = require('@okta/jwt-verifier')

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: '{clientId}',
  issuer: 'https://{yourOktaDomain}/oauth2/default'
})

let app = express()
app.use(cors())
app.use(bodyParser.json())

// verify JWT token middleware
const authRequired = () => {
  return (req, res, next) => {
    // require request to have an authorization header
    if (!req.headers.authorization) {
      return next(new Error('Authorization header is required'))
    }
    let parts = req.headers.authorization.trim().split(' ')
    let accessToken = parts.pop()
    oktaJwtVerifier.verifyAccessToken(accessToken)
      .then(jwt => {
        req.user = {
          uid: jwt.claims.uid,
          email: jwt.claims.sub
        }
        next()
      })
      .catch(next) // jwt did not verify!
  }
}

// public route that anyone can access
app.get('/hello', (req, res) => {
  return res.json({
    message: 'Hello world!'
  })
})

// route uses authRequired middleware to secure it
app.get('/secure-data', authRequired(), (req, res) => {
  return res.json({
    secret: 'The answer is always "A"!'
  })
})

module.exports = app
```

Create one last file that loads up the app and listens on port 8081. Create `./index.js` and copy the following code.

```js
const app = require('./app')

app.listen(8081, () => {
  console.log('listening on 8081')
})
```

Start the server by running `node ./` in your console.  Tab to your browser and open `http://localhost:8081/hello`.  You should see our JSON payload.  But, loading `http://localhost:8081/secure-data` should result in an error.

### Call the Secure API Endpoint from Your Vue.js Frontend

With your secure Express REST server still running, navigate back to your client and install axios so you can call the `/secure-data` endpoint.

```bash
npm i axios
```

Modify `./src/components/secure.vue` so that it will get the access token from the Okta Vue SDK and send the request to the API.

{% raw %}
```html
<template>
  <div>
    <h1>Secure Page</h1>
    <h5>Data from GET /secure-data:</h5>
    <div class="results">
      <pre>{{ data }}</pre>
    </div>
    <div>
      <router-link to="/">Go back</router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      data: null
    }
  },
  async mounted () {
    let accessToken = await this.$auth.getAccessToken()
    const client = axios.create({
      baseURL: 'http://localhost:8081',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    let { data } = await client.get('/secure-data')
    this.data = data
  }
}
</script>

<style>
  .results {
    width: 300px;
    margin: 0 auto;
    text-align: left;
    background: #eee;
    padding: 10px;
  }
</style>
```
{% endraw %}

Tab back to your browser and reload your web app.  Navigate to the `http://localhost:8080/secure`, and you should see the results from the API call.

{% img blog/vue-aws/aws-vue-15.png alt:"Results of API call" width:"800" %}{: .center-image }

## Configure Serverless and Deploy the Express API

[Serverless](https://serverless.com/) is an open-source AWS Lambda and API Gateway automation framework that allows you to deploy your app into a serverless infrastructure on AWS.  The term "serverless" (not to be confused with the software Serverless) is used to describe an app running in the cloud that doesn't require the developer to provision dedicated servers to run the code.

Serverless uses [AWS Lambda](https://aws.amazon.com/lambda/) and [AWS API Gateway](https://aws.amazon.com/api-gateway/) to run your express API 100% in the cloud using only managed services.  AWS Lambda is a service that lets you run code in the cloud without provisioning or managing servers.  And, AWS API Gateway is a service that makes it easy for developers to create, publish, update, monitor, and secure API's at scale.  Combining both of these services give you a robust platform to host a secure API.

To get started with Serverless, install it globally.

```bash
npm install -g serverless
```

Next, you need to create a Serverless configuration in your server app.  Use the following command from within your `./secure-app-server` project.

```bash
serverless create --template aws-nodejs --name secure-app-server
```

Open up `serverless.yml` and modify it to look like the file below.  When you create a Serverless configuration, it contains a lot of boilerplate code and comments.  The following structure is all you need to get the app deployed.

```yaml
service: secure-app-server

provider:
  name: aws
  runtime: nodejs8.10
  stage: dev

functions:
  api:
    handler: handler.handler
    events:
      - http:
          path: "{proxy+}"
          method: ANY
          cors: true
```

The `provider` spec informs Serverless that your app runs NodeJS and targets deployment on AWS.  The `functions` outlines a single handler that should handle ANY HTTP requests and forward them your app.

To finish up Serverless configuration, modify `handler.js` to the following code.  It uses [aws-serverless-express](https://github.com/awslabs/aws-serverless-express) which is a neat little package that proxies ALL API requests to a local express app.

```js
'use strict';

const awsServerlessExpress = require('aws-serverless-express')
const app = require('./app')
const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => { awsServerlessExpress.proxy(server, event, context) }
```

Finally, you should be ready to deploy your app via Serverless.  Run the following command.

```bash
serverless deploy
```

This process will take a few minutes to provision the stack initially.,  Once completed, you should see an `endpoints` entry under "Service Information" (your URL will be slightly different than mine).

```
endpoints:
  ANY - https://YOUR_END_POINT.amazonaws.com/dev/{proxy+}
```

To test it out, navigate to `https://YOUR_END_POINT.amazonaws.com/dev/hello` and you should see our hello world message.  Attempting to go to `https://YOUR_END_POINT.amazonaws.com/dev/secure` should result in an error.

### Change Frontend Vue to Use Production API

Up until this point, your frontend app has been configured to call the API hosted locally on `http://localhost:8081`.  For production, you need this to be your Serverless Endpoint.   Open `./src/components/secure.vue` and replace `baseURL` with your endpoint within `mounted()`.

```js
baseURL: 'https://YOUR_END_POINT.amazonaws.com/dev',
```

Finally, build your app and deploy it to CloudFront.

```bash
npm run build
npm run deploy
```

Navigate to your CloudFront URL, and you should have a working app!  Congratulations on a job well done!

If your CloudFront URL failed to pull the latest version of your web app, you might need to invalidate the CDN cache.  Go to your distribution, click on the **Invalidations** tab.  Click **Create Invalidation** and invalidate paths "/\*".  It will take a few minutes, but once it's complete, you should be able to pull in the latest version.

## Final Thoughts

Amazon Web Services is a robust platform that can pretty much do anything.  But, it has a relatively steep learning curve and might not be right for all cloud beginners.  Nonetheless, I encourage you to dig more into what AWS provides and find the right balance for your development needs.

You can find the full source code for this tutorial at: [https://github.com/oktadeveloper/okta-secure-vue-aws-client-example](https://github.com/oktadeveloper/okta-secure-vue-aws-client-example) and [https://github.com/oktadeveloper/okta-secure-vue-aws-server-example](https://github.com/oktadeveloper/okta-secure-vue-aws-server-example).

Here are a few other articles I'd recommend to learn more about user authentication with common SPA frameworks.

- [Build a Basic CRUD App with Vue.js and Node](/blog/2018/02/15/build-crud-app-vuejs-node)
- [Add Authentication to Your Vanilla JavaScript App in 20 Minutes](/blog/2018/06/05/authentication-vanilla-js)
- [Build a React Application with User Authentication in 15 Minutes](/blog/2017/03/30/react-okta-sign-in-widget)
- [Build an Angular App with Okta's Sign-in Widget in 15 Minutes](/blog/2017/03/27/angular-okta-sign-in-widget)

Please be sure to [follow @oktadev on Twitter](https://twitter.com/oktadev) to get notified when more articles like this are published.
