---
layout: blog_post
title: 'Protect your Cryptocurrency Wealth Tracking PWA with Okta'
author: mraible
tags: [cryptocurrency, ionic, authentication, oidc, angular, okta]
tweets: 
    - "Want to learn how to build an @ionicframework app to manage your cryptocurrencies? @joshuamorony has the 🎟! See how lock it down with @okta →"
    - "Leverage OIDC and @okta to add authentication to your cryptocurrencies wealth tracking Ionic app →"
---

Cryptocurrencies are all the rage. Over the last year the value of Bitcoin alone has risen 1,603%, driving more and more people to wonder if they're missing out on the "next big thing". Because of the huge influx of money into cryptocurrencies like Bitcoin, Ethereum, Monero, and Ripple &mdash; blockchain technology (which is the foundation of all cryptocurrency) has become an area of intense technical study. At its core, blockchain technology does nothing more that maintain a decentralized log of transactions that can be easily shared across many nodes (miners).

{% img https://i.imgflip.com/22lbwx.jpg alt:"So Hot Right Now" width:"620" %}{: .center-image }

[Josh Morony](https://twitter.com/joshuamorony) is someone I've followed ever since I got into developing with Ionic. After developing my first app using [Ionic](https://ionicframework.com), I bought and read his book on [Building Mobile Apps with Ionic](https://www.joshmorony.com/building-mobile-apps-with-ionic-2/). He's a good marketer, so I've been receiving his newsletter ever since. As a developer, I get a lot of emails and I usually delete the newsletter emails because they don't provide value. I've never deleted Josh's, and I started receiving it years ago. He does a great job in providing valuable information to developers!

About a month ago, I received an email from Josh advertising his Crypto PWA series of articles:

* Part 1: [Building a Cryptocurrency Price Tracker PWA in Ionic](https://www.joshmorony.com/building-a-cryptocurrency-price-tracker-pwa-in-ionic/)
* Part 2: [Preparing a Progressive Web Application for Production](https://www.joshmorony.com/preparing-a-progressive-web-application-for-production/)
* Part 3: [Hosting an Ionic PWA with Firebase Hosting](https://www.joshmorony.com/hosting-an-ionic-pwa-with-firebase-hosting/)

You can see his finished app at <https://cryptopwa.com/> and find it [on GitHub](https://github.com/joshuamorony/ionic-crypto-pwa).

<p><img src="https://www.joshmorony.com/wp-content/uploads/2017/12/cryptopwapreview.png" alt="cryptoPWA Preview" width="1000" height="877" class="aligncenter size-full wp-image-8519" srcset="https://www.joshmorony.com/wp-content/uploads/2017/12/cryptopwapreview.png 1000w, https://www.joshmorony.com/wp-content/uploads/2017/12/cryptopwapreview-300x263.png 300w, https://www.joshmorony.com/wp-content/uploads/2017/12/cryptopwapreview-768x674.png 768w, https://www.joshmorony.com/wp-content/uploads/2017/12/cryptopwapreview-640x561.png 640w" sizes="(max-width: 1000px) 100vw, 1000px"></p>

I thought it'd be fun to add authentication to Josh's app and show you how I did it. It wasn't too hard thanks to the fact that Ionic uses Angular and it has excellent OIDC support &mdash; thanks to [Manfred Steyer's](https://twitter.com/manfredsteyer) awesome [angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc) library.

## Setup the Crypto PWA 

## Add Okta for Authentication

The hardest part of using Okta is [creating a developer account](https://developer.okta.com/signup/), so you'll need to start there. Within 2-3 minutes, you should be able to login to our developer console and create new applications. Follow the steps below to create an OpenID Connect (OIDC) application that allows you to authenticate with your Okta accounts.

* Log in to your Okta account and navigate to **Applications** > **Add Application** 
* Select **SPA** and click **Next**
* Give your application a name (e.g. "Crypto PWA")
* Add the following values for **Base URI** and **Login redirect URI**:
    * `http://localhost:8100` (for development)
    * `https://<name-of-your-choosing>.firebaseapp.com` (for production)
* Click **Done** to continue. You should see settings like the following:

{% img blog/cryptocurrency-pwa/oidc-settings.png alt:"Okta OIDC Settings" width:"700" %}{: .center-image }

### Create a Login Page


### Add a Logout Button


## Learn more about Ionic and PWAs

I hope you’ve enjoyed this brief look at Ionic, PWAs, and Okta. PWAs are easier to distribute than mobile apps and cloud services like Okta and Firebase make things even easier. 

You can see the complete source code for this project [on GitHub](https://github.com/oktadeveloper/okta-ionic-crypto-pwa). Please contact me on Twitter [@mraible](https://twitter.com/mraible) or on [Okta's Developer Forums](https://devforum.okta.com/) if you have any questions.

To learn more about Ionic and PWAs, please see the following resources:

* [Tutorial: Develop a Mobile App With Ionic and Spring Boot](/blog/2017/05/17/develop-a-mobile-app-with-ionic-and-spring-boot)
* [Build an Ionic App with User Authentication](/blog/2017/08/22/build-an-ionic-app-with-user-authentication)
* [The Ultimate Guide to Progressive Web Applications](/blog/2017/07/20/the-ultimate-guide-to-progressive-web-applications)
