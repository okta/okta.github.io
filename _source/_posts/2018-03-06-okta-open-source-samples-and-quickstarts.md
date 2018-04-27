---
layout: blog_post
title: "Open Source Framework Samples and Quickstarts for Okta's Developer APIs"
author: mraible
description: "The Okta Developer Experience Team not only creates Okta's open source SDKs, but they create samples and documentation too! This blog post shows how to use our sample apps for Angular, React, Vue.js, Express, Django, Flask, and Spring."
tags: [java, spring, angular, angularjs, react, node, express, python, django, flask, vue]
tweets: 
  - "Okta's DevEx Team believes in developing great documentation and easy to configure SDKs. Learn more about the awesome samples they've created →"
  - "Developers love sample applications. Open source is awesome! See how we combine the two to make a better developer experience."
---

Developers love sample applications. It's one thing to see the steps to create an application or feature; but when someone provides a working app you can just build and run it's simply fantastic. Open source is near and dear to many developers today. Many of the frameworks we use to build applications are open source. It's a great way to develop widely-used software and get contributions from your users.

Okta's Developer Experience (DevEx) team believes in developing great documentation and easy to configure SDKs. We 💙 open source and [host all our SDK's code, samples, and API's documentation on GitHub](https://github.com/okta).  This makes it easy for developers like you to change code and docs if you find a better way. 

In this post, I'll show you how to use our samples, which leverage our SDKs, and we'll have a chat with Robert Damphousse, Senior Developer on the DevEx team and open source strategist.

Our open source projects include a number of sample applications and they've recently been updated to use the latest and greatest frameworks.

If you [search for "-sample"](https://github.com/okta?utf8=%E2%9C%93&q=-sample&type=&language=), you'll see there's nine repositories. In alphabetical order, they are:

* [samples-java-spring](https://github.com/okta/samples-java-spring)
* [samples-js-angular](https://github.com/okta/samples-js-angular)
* [samples-js-angular-1](https://github.com/okta/samples-js-angular-1)
* [samples-js-react](https://github.com/okta/samples-js-react)
* [samples-nodejs-express-4](https://github.com/okta/samples-nodejs-express-4)
* [samples-js-vue](https://github.com/okta/samples-js-vue)

## Try the Okta Framework Samples

As a Java Champion, it's my duty to promote Java whenever I can, so let's look at `samples-java-spring` first. The first thing you'll discover is it has several examples in it.

| Sample | Description | Use-Case |
|--------|-------------|----------|
| [Okta-Hosted Login](https://github.com/okta/samples-java-spring/tree/master/okta-hosted-login) | An application server that uses the hosted login page on your Okta org, then creates a cookie session for the user in the Spring application. | Traditional web applications with server-side rendered pages. |
| [Custom Login Page](https://github.com/okta/samples-java-spring/tree/master/custom-login) | An application server that uses the Okta Sign-In Widget on a custom login page within the application, then creates a cookie session for the user in the Spring application. | Traditional web applications with a custom login page and server-side rendered pages. |
| [Resource Server](https://github.com/okta/samples-java-spring/tree/master/resource-server) | This is a sample API resource server that shows you how to authenticate requests with access tokens that have been issued by Okta. | Single-Page applications. |
| [Front End](https://github.com/okta/samples-java-spring/tree/master/front-end) (bonus) | A simple static Single-Page application that can be used with the resource-server | Test the above resource server |

Wow, that's a lot of options! If you click on the first one, its [README](https://github.com/okta/samples-java-spring/blob/master/okta-hosted-login/README.md) provides some pretty thorough instructions. It does skip the part about cloning the repository, so you'll need to do that to begin.

``` bash
git clone https://github.com/okta/samples-java-spring.git
```

I particularly like that it links to documentation that shows you [how to create an Okta application, for web mode](/authentication-guide/implementing-authentication/auth-code#1-setting-up-your-application).  

What if you're a front-end developer? The [React Sample Applications](https://github.com/okta/samples-js-react) profile is a good starting point.

| Sample | Description |
|--------|-------------|
| [Okta-Hosted Login](https://github.com/okta/samples-js-react/tree/master/okta-hosted-login) | A React application that will redirect the user to the Okta-hosted login page of your org for authentication. The user is redirected back to the React application after authenticating. |
| [Custom Login Page](https://github.com/okta/samples-js-react/tree/master/custom-login) | A React application that uses the Okta Sign-In Widget within the React application to authenticate the user. |

In addition to showing you both of these applications, they can be [integrated with a resource server](https://github.com/okta/samples-js-react/tree/master/okta-hosted-login#integrating-the-resource-server) too. [Node/Express](https://github.com/okta/samples-nodejs-express-4/tree/master/resource-server) and [Java/Spring](https://github.com/okta/samples-java-spring-mvc/tree/master/resource-server) examples are provided.

You can set up the React + Okta-hosted login sample quite easily if you already have Git installed:

```bash
git clone git@github.com:okta/samples-js-react.git
cd samples-js-react/okta-hosted-login
npm install
```

Then modify `src/.samples.config.js` to have your domain and client ID in it. Run it with `npm start`, and you'll see screenshots like the ones below.

{% img blog/samples-and-quickstarts/react-sample-login-button.png alt:"React Sample - Login Button" width:"800" %}{: .center-image }

{% img blog/samples-and-quickstarts/okta-sign-in-page.png alt:"Okta Sign-In Page" width:"800" %}{: .center-image }

{% img blog/samples-and-quickstarts/react-sample-authenticated.png alt:"React Sample - Authenticated" width:"800" %}{: .center-image }

To set up the Spring Boot resource server, clone that sample's repository and run it with your issuer:

```bash
git clone https://github.com/okta/samples-java-spring.git
cd samples-java-spring/resource-server
./mvnw -Dokta.oauth2.issuer=https://{yourOktaDomain}/oauth2/default
```

{% img blog/samples-and-quickstarts/react-sample-messages.png alt:"React Sample - Messages" width:"800" %}{: .center-image }

The Express resource server requires little configuration to configure it too.

```bash
git clone git@github.com:okta/samples-nodejs-express-4.git
cd samples-nodejs-express-4/
npm install
```

Modify `.samples.config.json` for your app, then run `npm run resource-server`. You should see the same result as you did with the Java resource server.

## Okta Authentication Quickstart Guides

To see how many of the frameworks were built, you can read the plethora of [quickstart instructions](/quickstart/) the Developer Experience team has created. When you log in to your Developer Console, you'll see links to them all on your dashboard. 

{% img blog/samples-and-quickstarts/quickstart-guides.png alt:"React Sample - Authenticated" width:"700" %}{: .center-image }

The instructions themselves are broken up into two categories: client setup and server setup. 

For client, there's instructions for our [hosted sign-in page](/quickstart/#/okta-sign-in-page), as well as how to use our [sign-in widget](/quickstart/#/widget), which you embed in your application. There are instructions for [iOS](/quickstart/#/ios) and [Android](/quickstart/#/android), as well as for the most popular JavaScript frameworks: [Angular](/quickstart/#/angular), [React](/quickstart/#/react), and [Vue.js](/quickstart/#/vue). 

For server, there are Node instructions, both for [Express](/quickstart/#/vue/nodejs/express) and [generic Node](/quickstart/#/okta-sign-in-page/nodejs/generic). For Java, there are [Spring Boot](/quickstart/#/okta-sign-in-page/java/spring) and a link to [generic Java](/quickstart/#/okta-sign-in-page/java/generic), but nothing there yet. There are no frameworks for PHP, just [generic support](/quickstart/#/okta-sign-in-page/php/generic) and .NET has both [ASP.NET Core](/quickstart/#/okta-sign-in-page/dotnet/aspnetcore) and [ASP.NET 4.x](/quickstart/#/okta-sign-in-page/dotnet/aspnet4). 

## Developer Experience at Okta

I thought it'd be fun to ask some questions of [Robert Damphousse](https://twitter.com/robertjd_), who played a large part in creating these examples, along with the rest of our Developer Experience team.

**It's been a little over a year since you joined Okta from Stormpath? How's it going? What have you been able to accomplish?**

> **Robert:** Quite a lot! Our first big task was to create the [new Developer Console](/blog/2017/09/25/all-new-developer-console), which is an alternate version of the Okta Admin Console, tailored for developer use cases – OIDC specifically. We've also been building out SDKs for the Okta APIs and creating authentication libraries for popular frameworks.

**You showed me a demo of some sample applications you've been working on for Developer Experience at Okta. How can I find out more about the which frameworks you have samples for and how to use them?**

> **Robert:** At the moment you can jump to sample projects from our existing quickstarts, not all quickstarts have them yet but when they do you should see a link at the top. You can also search for "sample" in the Okta org on GitHub.

**How do these samples relate to the [Okta Quickstart Guides](/quickstart/)?**
 
> **Robert:** The sample projects are complete applications that you can easily run and use as a reference for common Okta use cases. The Quickstarts are more like a walkthrough guide that walks you through the needed code and explains where the code should go in your existing application.
 
**The Developer Relations Team publishes [quite a few blog posts with examples](https://github.com/oktadeveloper?utf8=%E2%9C%93&q=-example&type=&language=). What's the difference between Okta sample applications and the examples on the blog?**
 
> **Robert:** Our blog is where we stay on the leading edge by showing you cool integrations with the [latest technologies](/blog/2017/09/19/build-a-secure-notes-application-with-kotlin-typescript-and-okta).  Our sample applications tend to be more general and show typical use cases with more established libraries.
 
**What other things are you working on to make developer's experiences better with Okta?**
 
> **Robert:** We're making our SDKs smarter by adding a caching layer, and soon a retry layer.  We'll also be adding server-side support for the Authentication API (what you use when using the Sign-in Widget)

## Learn More

The Developer Experience team at Okta is developing a plethora of framework-specific SDKs, [documentation](/documentation/), and sample applications. They're doing really great work to make your development life simpler. 

However, there's always room for improvement! If you have ideas for improvement, please create pull requests in our SDKs or samples, or ask your questions on our [DevForums](https://devforum.okta.com/). Of course, we'd be happy to have a [quick chat on Twitter too](https://twitter.com/oktadev)!
