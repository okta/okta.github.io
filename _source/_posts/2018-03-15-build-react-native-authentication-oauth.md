---
layout: blog_post
title: 'Build a React Native Application and Authenticate with OAuth'
author: mraible
tags: [react-native, authentication, oauth, oidc, react, okta]
tweets:
  - "React Native is 🔥! Learn how to add Authentication with OAuth and AppAuth in this 😎 tutorial → "
  - "React Native provides a way for you to develop native apps with web technologies. See how to add authentication to your React Native apps with this handy tutorial. "
  - "The React Native + OAuth Tutorial you've been looking is live on the @okta developer blog! "
---

React Native is a pretty slick framework. Unlike Ionic and other hybrid mobile frameworks, it allows you to use web technologies (React and JavaScript) to build native mobile apps. There is no no browser or WebView involved, so developing a mobile app with React Native is similar to using the native SDK in that you'll do all your testing on an emulator or device. There is no way to test it in your browser like there is with Ionic. This can be a benefit in that you don't have to write that works in-browser and on-device separately. 

If you look at Google Trends, you can see that React Native is even more popular than Android and iOS for native development!

<script type="text/javascript" src="https://ssl.gstatic.com/trends_nrtr/1294_RC01/embed_loader.js"></script> <script type="text/javascript"> trends.embed.renderExploreWidget("TIMESERIES", {"comparisonItem":[{"keyword":"ios development","geo":"","time":"today 12-m"},{"keyword":"android development","geo":"","time":"today 12-m"},{"keyword":"react native","geo":"","time":"today 12-m"}],"category":0,"property":""}, {"exploreQuery":"q=ios%20development,android%20development,react%20native&date=today 12-m,today 12-m,today 12-m","guestPath":"https://trends.google.com:443/trends/embed/"}); </script> 

![Google Trends: React Native vs iOS and Android](/assets/img/blog/react-native-app-auth/google-trends.png)

{% img blog/react-native-app-auth/google-trends.png alt:"Google Trends: React Native vs iOS and Android" width:"800" %}{: .center-image }

// todo: It'd be cool if we could turn this graphic into something that looks better. Like this post does: https://medium.com/react-native-development/a-brief-history-of-react-native-aae11f4ca39

Today I'm going to show you how to develop a React Native app with the latest and greatest releases. At the time of this writing, that's React 16.2.0 and React Native 0.52.2. You'll create a new app, add [AppAuth](https://appauth.io/) for authentication, authenticate with Okta, and see it running on both iOS and Android.

> AppAuth is a client SDK for native apps to authenticate and authorize end-users using OAuth 2.0 and OpenID Connect. Available for iOS, macOS, Android and Native JS environments, it implements modern security and usability [best practices](https://tools.ietf.org/html/rfc8252) for native app authentication and authorization.

## Create Your React Native Application

React has a `create-react-app` command-line tool (CLI) that you can use to create new React apps. React Native has a similar tool called [Create React Native App](https://github.com/react-community/create-react-native-app). Before you install it, make sure you have [Node](https://nodejs.org/) v6 or later installed.

Install `create-react-native-app` and create a new project called `okta-react-native-app-auth`:

```bash
npm install -g create-react-native-app
create-react-native-app okta-react-native-app-auth
cd okta-react-native-app-auth
npm start
```

**TIP:** You can use TypeScript instead of JavaScript in your React Native app using Microsoft's [TypeScript React Native Starter](https://github.com/Microsoft/TypeScript-React-Native-Starter). If you decide to go this route, I'd recommend following the steps to convert your app after you've completed this tutorial.

## React Native and OAuth

In this tutorial, I'll use [React Native App Auth](https://github.com/FormidableLabs/react-native-app-auth), a library created by [Formidable](http://formidable.com/)

### Add React Native App Auth for Authentication

### Create Native Application in Okta

### Call an API with Your Access Token

## Learn More about React Native and React

[React Native](https://facebook.github.io/react-native/).
 [React Native on GitHub](https://github.com/facebook/react-native) has ~60K stars.