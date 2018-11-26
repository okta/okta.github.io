---
layout: blog_post
title: 'The Ultimate Guide to Progressive Web Applications'
author: mraible
description: "In this guide, you'll learn about the essential ingredients in a PWA, how to install one, why you should build one, and how they stack up against hybrid and native applications."
tags: [pwa, progressive web applications, offline, service workers, http2, angular, ionic, react, vue.js]
---

Progressive Web Apps, aka PWAs, are the best way for developers to make their webapps load faster and more performant. In a nutshell, PWAs are websites that use recent web standards to allow for installation on a user's computer or device, and deliver an app-like experience to those users.

Twitter recently launched [mobile.twitter.com](https://mobile.twitter.com) as a PWA [built with React and Node.js](https://blog.twitter.com/2017/how-we-built-twitter-lite). They've had a good experience with PWAs, showing that the technology is finally ready for the masses.

<div style="max-width: 500px; margin: 0 auto">
<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Twitter Lite sees 75% increase in tweets with new PWA and reduces Data usage. Read all about it 👉 <a href="https://t.co/ihi3N0cIAN">https://t.co/ihi3N0cIAN</a></p>&mdash; Chrome Developers (@ChromiumDev) <a href="https://twitter.com/ChromiumDev/status/864894136129691648">May 17, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

In this guide, you'll learn about the essential ingredients in a PWA, how to install one, why you should build one, and how they stack up against hybrid and native applications.

## A Deeper Dive – What is a PWA?

A PWA is a web application that can be "installed" on your system. It works offline when you don't have an internet connection, leveraging data cached during your last interactions with the app. If you're on a desktop, using Chrome, and have the appropriate flags turned on, you will be prompted to install the app when you visit the site.

For example, enable the following flags in Chrome by copying and pasting the following URLs into Chrome.

```
chrome://flags/#enable-add-to-shelf
chrome://flags/#bypass-app-banner-engagement-checks
```

Click the blue "Relaunch Now" button at the bottom of your browser after enabling these flags. Now if you visit a site like <https://hnpwa.com>, you'll see an installation prompt at the top of the page.

{% img blog/ultimate-pwa-guide/hnpwa.png alt:"Hacker News PWA" width:"800" %}

Click the "Add" button and you'll see a dialog to name the app, populated with information from the app's manifest.

{% img blog/ultimate-pwa-guide/hnpwa-add-application.png alt:"Add to Applications" width:"500" %}

This adds the application to a "~/Applications/Chrome Apps" directory on a Mac. If you launch the apps, they will run in Chrome rather than having their own icon. On an Android phone, their icon and launch behavior will resemble that of a native application.

You can use Chrome's Developer Tools > Network tab to toggle "Offline" and reload the application. You'll notice it still loads the data rather than saying it can't reach the server.

{% img blog/ultimate-pwa-guide/hnpwa-offline.png alt:"Hacker News PWA Offline" width:"800" %}

## Why Should You Build a PWA?

You should make your webapp into a PWA because it'll reduce the time it takes for your app to load and it'll give your users a better experience. Having it load over HTTPS is a good security practice and adding icons (using a web app manifest) is something you'd do anyway. Having a cache-first service worker strategy will allow your app to work offline (if the user has already loaded data), alleviating one of the biggest issues with webapps.

There are a number of other performance recommendations you can implement in your webapp. While the following list is not required for PWAs, many PWAs employ these elements:

* Implement the [PRPL pattern](https://developers.google.com/web/fundamentals/performance/prpl-pattern/):
  * **Push** critical resources for the initial URL route.
  * **Render** initial route.
  * **Pre-cache** remaining routes.
  * **Lazy-load** and create remaining routes on demand.
* Use `<link rel="preload">` to tell your browser to load a resource you know you'll eventually need. This is a [W3C Standard specification](https://w3c.github.io/preload/).
* Use HTTP/2 and server push to "push" assets to the browser without the user having to ask for them.
* Use code-splitting and lazy-loading for granular loading of application pages/features.

[Mariko Kosaka](https://twitter.com/kosamari) created [some drawings](https://twitter.com/kosamari/status/859958929484337152) to show the difference between HTTP/1 and HTTP/2. I think it illustrates the performance gains provided by HTTP/2 nicely. Note that HTTP/2 requires HTTPS, just like PWAs do.

{% img blog/ultimate-pwa-guide/http2-kosamari.png alt:"Mariko Kosaka's Awesome HTTP/2 Drawing" width:"800" %}

### Dynamic Caching and Your PWA

If you're going to build a PWA and leverage service workers, you should become familiar with Chrome Developer Tools' Application tab. This tab provides the ability to manipulate service workers so they update on reload.

{% img blog/ultimate-pwa-guide/chrome-devtools-application-tab.png alt:"Chrome DevTools Application Tab" width:"800" %}

If you don't check this box, developing a PWA will be a frustrating experience. The reason is because everything will be cached in your browser and when you update files in your editor, they won't be reloaded in your browser.

For a great resource on Chrome's Developer Tools, I recommend Umaar Hunsa's [Dev Tips](https://umaar.com/dev-tips/).

Developing PWAs can be painful because it will cause your application to do aggressive caching in your browser. Web developers have been fighting for ages to get the browser to *not* cache assets, so PWAs kinda go against the grain for web developers. One workaround is to comment out your service worker registration until you package for production. This can be done by simply commenting out registration of a service worker in your `index.html`. For example:

```html
<!-- un-comment this code to enable service worker in production
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('service worker installed'))
      .catch(err => console.error('Error', err));
  }
</script>-->
```

If your app is so dynamic that you don't want anything cached, a PWA might not be right for you. However, you should still look into serving it over HTTPS and using HTTP/2 for better security and faster performance.

## PWAs and Hybrid Apps vs. Mobile Apps

Adding PWA support is important so people with slow connections and affordable smart phones can use your webapp more easily. If your app is large and you can't load parts of it lazily (meaning loading it on-demand rather than at the beginning), bundling it all up in a hybrid app with [Cordova](https://www.google.com/url?q=http://cordova.apache.org/docs/en/latest/guide/cli/index.html&sa=D&ust=1496180358261000&usg=AFQjCNEg15ndTpZMXoO0pJX4AyRs-zdXjg) might make sense. If your app does intense tasks or is highly interactive (like a game), coding it with native SDKs is likely a good option.

**If you're interested in learning more about [using Cordova with Ionic and Spring Boot, you can check out my recent tutorial](https://developer.okta.com/blog/2017/05/17/develop-a-mobile-app-with-ionic-and-spring-boot).**

PWAs are useful for apps like Twitter and news sites because they have a lot of text that you'll read, but not necessarily interact with. Having it as a PWA allows you to open the app, load its data, then read its contents later when you're offline. This should work in a normal web application, but I've noticed that some browsers will try to reload the page when you open them, resulting in a dreaded "server not found" error.

However, neither of these techniques will help your users with slow connections and less powerful smartphones. Even if you choose to create a native app, it's still wise to create a lightweight PWA app that can load in seconds and give your users something to work with.

PWAs are the way of the future, and the now. Most browsers support it, with notably absent support in Safari. It's funny to see that Apple is blocking PWA support on iOS when they only supported web apps on the first iPhone. However, they do list service workers as "[under consideration](https://webkit.org/status/#specification-service-workers)" in WebKit. Meanwhile, Google is championing the effort, with vast amounts of documentation on PWAs, dedicated developer advocates for PWAs, and many conference sessions on the subject at [Google I/O 2017](https://www.youtube.com/playlist?list=PLOU2XLYxmsIKC8eODk_RNCWv3fBcLvMMy).

[Sam Delgado believes](https://hackernoon.com/if-it-werent-for-apple-hybrid-app-development-would-be-the-clear-winner-over-native-ae64fa37ad48) "If it weren't for Apple, hybrid app development would be the clear winner over native". In this article, he laments that there's one major disadvantage to the hybrid approach for iOS: you still have to go through Apple's complicated setup for Xcode, provisioning profiles, needing a Mac to compile, using TestFlight for betas, and the app review process. The iOS WebView is another reason the experience isn't great. WKWebView offers a better experience, but requires some hacky workarounds. He ends the article noting that the "Hybrid vs Native" debate will likely continue until Apple provides a pleasant development experience for hybrid applications.

Matt Asay thinks that Apple has many reasons to say no to PWAs, but they [won't allow Android to offer a better web experience](http://www.techrepublic.com/article/apple-could-lose-billions-on-progressive-web-apps-but-it-has-no-choice/).

[Jason Grigsby writes](https://cloudfour.com/thinks/ios-doesnt-support-progressive-web-apps-so-what/), "Despite the fact that iOS doesn't support the full feature set of Progressive Web Apps, early evidence indicates that Progressive Web Apps perform better on iOS than the sites they replace."

Not only that, but PWAs offer a [lower cost mobile presence](https://dzone.com/articles/progressive-web-app-better-low-cost-mobile-presenc).

Yes, there are some additional cons like some native APIs not being available and that you can't find PWAs in the App Store or Google Play. The native API issues might be around for awhile, but the ability to locate an app by URL (versus searching a store) seems easier to me.

Chrome and Android have [deep integration for PWAs](https://blog.chromium.org/2017/02/integrating-progressive-web-apps-deeply.html). According to the Chromium Blog:

> When installed, PWAs appear in the app drawer section of the launcher and in Android Settings, and can receive incoming intents from other apps. Long presses on their notifications will also reveal the normal Android notification management controls rather than the notification management controls for Chrome.

Developers have pondered if [PWAs should be findable in Google Play](http://www.androidpolice.com/2017/04/24/progressive-web-apps-allowed-play-store/). So far, Google has not released any plans to do so.

Another thing to consider is how much WebStorage on the device your application will need. Eiji Kitamura conducted [research on quotas for mobile browsers](https://www.html5rocks.com/en/tutorials/offline/quota-research/) in 2014 and found that most browsers support up to 10MB of LocalStorage. More storage is typically available in Application Cache, IndexedDB, and WebSQL, but only on desktop browsers. For example, Firefox on Android allows the Application Cache to use up to 500MB on desktop, but only 5MB on mobile. Users can change this quota on their device, but the application developer cannot control this setting. You can see the quotas for your browser by visiting [Browser Storage Abuser](https://demo.agektmr.com/storage/).

So, what do you need to know to start building?

## PWA Requirements: HTTPS, Service Workers, and Web App Manifest

The requirements for a PWA can be quickly added to almost any web application. All you need to do is the following:

1. Deploy it to a public web server and force HTTPS.
2. Create and include a JavaScript file with code to cache network requests.
3. Create and include a web app manifest.

To see how to add these features to an Angular application, see my [Build Your First Progressive Web Application with Angular and Spring Boot](/blog/2017/05/09/progressive-web-applications-with-angular-and-spring-boot) blog post on Okta's developer blog. This article shows you how to add a service worker, a manifest with icons, and deploy it to CloudFoundry with HTTPS. Not only that, but it scores a 98/100 using the Lighthouse Chrome Extension.

{% img blog/angular-spring-boot-pwa/lighthouse-prod-report.png alt:"Lighthouse Report" width:"800" %}

[Scott Domes](https://medium.com/@scottdomes) has a [similar tutorial that will walk you through the basics of building a PWA in React](https://engineering.musefind.com/build-your-first-progressive-web-app-with-react-8e1449c575cd).

Angular will soon have [built-in service worker support](https://github.com/angular/mobile-toolkit/issues/138#issuecomment-302129378). Create React App (a popular starter tool for React) now has [PWAs by default](https://facebook.github.io/react/blog/2017/05/18/whats-new-in-create-react-app.html#progressive-web-apps-by-default) as one of its features.

### PWA Reference Apps and Stats

[HN PWA](https://hnpwa.com/) is a reference for how to build efficient PWAs with different frameworks. It's similar to [TodoMVC](http://todomvc.com/), but for progressive web apps. For each framework, it includes its Lighthouse score and time to interactive over a slow connection, as well as a faster 3G connection.

[PWA Stats](https://www.pwastats.com/) is a website with statistics about the cost savings and improved performance gained by implementing progressive web apps. Some examples:

* Google found that Progressive Web App install banners convert **5-6x more often** than native install banners.
* The Forbes Progressive Web App's homepage completely loads in just **0.8 seconds**.
* The Weather Channel saw a **80% improvement** in load time after shipping Progressive Web Apps in 62 languages to 178 countries.

CSS Tricks [notes](https://twitter.com/real_css_tricks/status/857383799822229504) that two other PWA galleries exist:

* [pwa-directory.appspot.com](https://pwa-directory.appspot.com/)
* [pwa.rocks](https://pwa.rocks/)

## Framework Support in React, Angular, and Vue.js

Support for PWA features already exist in some of the more popular JavaScript framework application generators. However, you don't need to have these features created for you, you can also add them to an existing application.

HTTPS has gotten much easier with free certificates from [Let's Encrypt](https://letsencrypt.org/) and [AWS Certificate Manager](https://aws.amazon.com/certificate-manager/). Deploying static web apps that access dynamic data has been vastly simplified by CDNs, [AWS](https://stormpath.com/blog/ultimate-guide-deploying-static-site-aws), CloudFoundry, and Heroku. Heroku also has support for [automated certificate management using Let's Encrypt](https://devcenter.heroku.com/articles/automated-certificate-management).

You can generate a manifest.json file and icons for your PWA using <http://realfavicongenerator.net> and <http://preview.pwabuilder.com>.

For online/offline data syncing, you can use solutions like [IndexedDB](https://developers.google.com/web/fundamentals/instant-and-offline/web-storage/offline-for-pwa), [PouchDB](https://pouchdb.com/), or roll your own with the [Background Sync API](https://developers.google.com/web/updates/2015/12/background-sync). This feature is [available in Chrome desktop and Android since version 49](https://www.chromestatus.com/feature/6170807885627392).

### Angular

You can add service worker support and app shell for offline Angular 2+ applications. With native service worker support headed to Angular soon, you can tell the Angular team is taking the PWA challenge to heart.

Maxim Salnikov's [Progressive Web Apps using the Angular Mobile Toolkit](https://bit.ly/pwa-angularsummit-2017) workshop from Angular Summit 2017 shows how this new support will look using Angular CLI. You will need to run a command:

```
ng set apps.0.serviceWorker=true
```

If you don't have @angular/service-worker installed, you will see a message:

```
Your project is configured with serviceWorker = true, but @angular/service-worker is not installed.
Run `npm install --save-dev @angular/service-worker`
and try again, or run `ng set apps.0.serviceWorker=false` in your .angular-cli.json.
```

Ionic is a framework that leverages Angular to create native apps with web technologies. It leverages Cordova to run the app on phones but also has built-in service worker and manifest support if you want to deploy your app to the web.

See my [tutorial about developing mobile applications with Ionic and Spring Boot](/blog/2017/05/17/develop-a-mobile-app-with-ionic-and-spring-boot) to learn more. Below is a screenshot of the completed application in the tutorial.

{% img blog/ionic-spring-boot/beer-modal.png alt:"Mmmmm, Guinness" width:"800" %}


[NativeScript](https://www.nativescript.org/) is another option for developing mobile apps with Angular. The big difference between it and Ionic is that it uses the native platform's rendering engine instead of WebViews. NativeScript does not support building PWAs.

### React

When you create a React application using Create React App (version 1.0+), a manifest is generated, and an [offline-first caching strategy](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-falling-back-to-network) service worker. If you already have a React application, [Create React App's 1.0 release notes](https://github.com/facebookincubator/create-react-app/releases/tag/v1.0.0) tell you how to turn your app into a PWA.

[Preact](https://preactjs.com/) is an alternative implementation of React that's built for speed. It's a much smaller library (~3KB) that implements the same ES6 API, components, and Virtual DOM support as React. Using it instead of React means your application will have less JavaScript to download, parse, and execute.

### Vue.js

Vue.js has a command line tool called Vue-CLI. Addy Osmani recently [added](https://github.com/vuejs/vue-cli/issues/381) a [PWA template](https://github.com/vuejs-templates/pwa), so you can generate a new Vue.js PWA app with the following commands:

```
npm install -g vue-cli
vue init pwa my-pwa-project
```

If you already have a Vue.js application, see Charles Bochet's [article on creating a PWA with Vue.js](https://blog.sicara.com/a-progressive-web-application-with-vue-js-webpack-material-design-part-1-c243e2e6e402).

## Learn More

I love apps that work when I'm offline, especially when flying and traveling. Internet connectivity can be spotty when you're moving and apps that don't require connectivity are great. For instance, I wrote the first draft of this article on my phone using Google Docs, without service. Although Google Docs isn't a PWA, it demonstrates the allure of making your web app work offline. Native apps have been caching data and providing offline access for years. Now that web apps have similar features, we should embrace them and use them! It's a great time to be a web developer; we can make the web better together.

If you're interested in staying up to date on what's happening in the PWA world, I recommend following Alex Russell ([@slightlylate](https://twitter.com/slightlylate)), Addy Osmani ([@addyosmani](https://twitter.com/addyosmani)), and Sean Larkin ([@thelarkinn](https://twitter.com/thelarkinn)) on Twitter.

Or, you can check out any of these great resources:

* Addy Osmani at Google I/O '17: [Production Progressive Web Apps With JavaScript Frameworks](https://youtu.be/aCMbSyngXB4)
* Google's [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/) homepage, [step-by-step code lab](https://codelabs.developers.google.com/codelabs/your-first-pwapp/), and [instructor-led PWA training](https://developers.google.com/web/ilt/pwa/).
* Pluralsight's [Getting Started with Progressive Web Apps](https://www.pluralsight.com/courses/web-apps-progressive-getting-started)
* [Why "Progressive Web Apps vs. native" is the wrong question to ask](https://medium.com/dev-channel/why-progressive-web-apps-vs-native-is-the-wrong-question-to-ask-fb8555addcbb)

### Example Applications

Ready to get your feet wet building an app? You can find some interesting PWA tutorials here:

* [Build Your First Progressive Web Application with Angular and Spring Boot](/blog/2017/05/09/progressive-web-applications-with-angular-and-spring-boot)
* [Tutorial: Develop a Mobile App With Ionic and Spring Boot](/blog/2017/05/17/develop-a-mobile-app-with-ionic-and-spring-boot)
* [A Beginner's Guide To Progressive Web Apps](https://www.smashingmagazine.com/2016/08/a-beginners-guide-to-progressive-web-apps/)