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

// note: p1 similar to https://developer.okta.com/blog/2017/08/22/build-an-ionic-app-with-user-authentication

With Okta and OpenID Connect (OIDC) you can easily integrate authentication into a React Native application, and never have to build it yourself again. OIDC allows you to authenticate directly against the [Okta API](https://developer.okta.com/product/), and this article shows you how to do just that in a React Native application. I’ll show you how to log in with OIDC redirect, using AppAuth; user registration is omitted as the feature is still under active development.

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

This will result your terminal prompting you with some options:

```bash
To view your app with live reloading, point the Expo app to this QR code.
You'll find the QR scanner on the Projects tab of the app.

[QR Code]

Or enter this address in the Expo app's search bar:

  exp://172.31.98.12:19000

Your phone will need to be on the same local network as this computer.
For links to install the Expo app, please visit https://expo.io.

Logs from serving your app will appear here. Press Ctrl+C at any time to stop.

 › Press a to open Android device or emulator, or i to open iOS emulator.
 › Press q to display QR code.
 › Press r to restart packager, or R to restart packager and clear cache.
 › Press d to toggle development mode. (current mode: development)
```

If you're on a Mac, press **i** to open iOS emulator. If you're on Windows or Linux, I'd suggest trying the Android emulator or your Android device (if you have one). If it doesn't work, don't worry, I'll show you how to make that work later on.

**TIP:** You can use TypeScript instead of JavaScript in your React Native app using Microsoft's [TypeScript React Native Starter](https://github.com/Microsoft/TypeScript-React-Native-Starter). If you decide to go this route, I'd recommend following the steps to convert your app after you've completed this tutorial.

## React Native and OAuth

In this example, I'll use [React Native App Auth](https://github.com/FormidableLabs/react-native-app-auth), a library created by [Formidable](http://formidable.com/). The reason I'm using this library is three-fold: 1) they provide a nice [example](https://github.com/FormidableLabs/react-native-app-auth/tree/master/Example) that I was able to make work in just a few minutes, 2) it uses AppAuth (a mature OAuth client implementation), and 3) I was unable to get anything else working.

* I tried [react-native-oauth](https://github.com/fullstackreact/react-native-oauth), but discovered it required using an existing provider before adding a new one. I only wanted to have Okta as a provider. Also, it's high number of issues and pull requests served as a warning sign.
* I tried [react-native-simple-auth](https://github.com/adamjmcgrath/react-native-simple-auth), but had issues with Safari redirecting back to my app successfully.
* I tried doing [this OAuth 2 with React Native tutorial](https://medium.com/@jtremback/oauth-2-with-react-native-c3c7c64cbb6d), but also had problems redirecting back to my app.

### Add React Native App Auth for Authentication



### Create Native Application in Okta

### Call an API with Your Access Token

## Learn More about React Native and React

[React Native](https://facebook.github.io/react-native/).
 [React Native on GitHub](https://github.com/facebook/react-native) has ~60K stars.