---
layout: blog_post
title: 'Tutorial: User Login and Registration in Ionic 4'
author: mraible
description: "Ionic helps developers build hybrid mobile apps & PWAs. This tutorial shows you how to add user authentication and registration to an Ionic 4 app."
tags: [ionic, typescript, angular, authentication, oidc, cordova, capacitor, android, ios]
tweets:
 - "Ionic 4 is 🔥! Learn how to build an @ionicframework v4 app with user authentication and registration."
 - "Do you ❤️ Ionic? We do too! This tutorial shows you how you can create an @ionicframework 4 app and add user authentication in just a few commands."
 - "We recommend using @ionicframework 4 with OIDC to add SSO to your mobile apps. Learn how today!"
image: blog/ionic-4-login/ionic-ios-okta.png
---

Ionic allows you to develop <abbr title="Progressive Web Applications">PWAs</abbr> and hybrid mobile apps. PWAs are web applications that run in a browser and allow for offline capabilities via service workers. They can be installed on desktops and mobile devices, just like you install apps on your smartphone. Hybrid mobile apps are like native mobile apps, except they're built using web technologies.

Ionic 2 was based on AngularJS. Ionic 3 was based on Angular. Ionic 4 allows you to use the most popular JavaScript frameworks available today: Angular, React, or Vue. This article focuses on the Angular version of Ionic 4. I'll show you how to create an Ionic 4 app, add user authentication, and configure things to allow user registration.

If you don't want to code along, feel free to grab the [source code from GitHub](https://github.com/oktadeveloper/okta-ionic-4-login-example)! You can also watch a video of this tutorial below.

<div style="text-align: center">
<iframe width="600" height="338" style="max-width: 100%" src="https://www.youtube.com/embed/MBAUKQGNx5Y" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>

## Get Started with Ionic 4

To set up your environment to develop with Ionic, complete the following steps:

1. Install [Node.js](https://nodejs.org)
2. Install Ionic CLI using npm

```shell
npm install -g ionic@4.12.0
```

## Create an Ionic 4 Application

From a terminal window, create a new application using the following command:

```shell
ionic start ionic-login tabs
```

When prompted to install the Ionic Pro SDK, answer **no**.

It may take a minute or two to create your project, depending on the speed of your internet connection. The video below shows what this process looks like.

<div style="text-align: center">
<script id="asciicast-yhbhzG6USxvMxKPLoZcNrdKg8" src="https://asciinema.org/a/yhbhzG6USxvMxKPLoZcNrdKg8.js" async></script>
</div>

Once the process completes, start your Ionic 4 application.

```shell
cd ionic-login
ionic serve
```

This command will open your default browser and navigate to `http://localhost:8100`.

{% img blog/ionic-4-login/welcome-to-ionic.png alt:"Welcome to Ionic" width:"800" %}{: .center-image }

You can use Chrome's device toolbar to see what the application will look like on an iPhone X.

{% img blog/ionic-4-login/welcome-iphone-x.png alt:"Welcome to Ionic on iPhone X" width:"800" %}{: .center-image }

Now let's add a user login feature! Stop the `ionic serve` process using `Ctrl+C` before proceeding to the next step.

## Add User Login

Schematics is a library from the Angular CLI project that allows you to manipulate projects with code. You can create/update files and add dependencies to any project that has a `package.json` file. I created an [OktaDev Schematics](https://github.com/oktadeveloper/schematics) project that makes it possible to add authentication to an Ionic 4 app using one command.

```shell
ng add @oktadev/schematics
```

Before you run this command, you'll need to create an OpenID Connect (OIDC) app in Okta. OIDC builds on top of the OAuth 2.0 authorization framework. It allows clients to verify the identity of the user and get their details. If you're not familiar with OAuth 2.0 or OIDC, I recommend you read [What the Heck is OAuth?](/blog/2017/06/21/what-the-heck-is-oauth)

### Create an OpenID Connect App in Okta

To integrate Okta's Identity Cloud for user authentication, you'll need to [signup](https://developer.okta.com/signup/) for a developer account.

Log in to your Okta developer account and navigate to **Applications > Add Application**.

{% img blog/ionic-4-login/add-application.png alt:"Applications > Add Application" width:"575" %}{: .center-image }

Select **Native** and click **Next**.

{% img blog/ionic-4-login/new-native-app.png alt:"New Native Application" width:"700" %}{: .center-image }

Enter a name for your application, such as `Ionic 4 App`. Add `http://localhost:8100/implicit/callback` as a Login redirect URI. Click **Done** to finish creating the application.

{% img blog/ionic-4-login/ionic-4-login-redirect-uris.png alt:"Add name and Login redirect URI" width:"700" %}{: .center-image }

Click **Edit** and add Logout redirect URIs, where the first should be your reversed Okta domain name, followed by `:/logout` and the second is `http://localhost:8100/implicit/logout`. Click **Save**.

{% img blog/ionic-4-login/ionic-4-logout-redirect-uris.png alt:"Add Logout redirect URIs" width:"700" %}{: .center-image }

Near the bottom of your application's settings, you will find a section titled **Client Credentials**. Copy the Client ID and paste it somewhere handy. You will need this soon.

{% img blog/ionic-4-login/ionic-4-client-credentials.png alt:"Copy the client ID" width:"700" %}{: .center-image }

Navigate to **API** > **Authorization Servers** and copy your issuer URI.

{% img blog/ionic-4-login/issuer-uri.png alt:"Issuer URI" width:"600" %}{: .center-image }

### Use OktaDev Schematics to Add User Login

Now that you have a client ID and issuer URI, you can install Angular CLI, and add a user login feature using `ng add`.

```shell
npm i -g @angular/cli@7.3.9
ng add @oktadev/schematics --issuer=$issuer --clientId=$clientId
```

The video below shows how this command performs the following steps:

1. Adds and installs `@oktadev/schematics` as a dev dependency
2. Adds [Ionic AppAuth](https://www.npmjs.com/package/ionic-appauth) as a dependency
3. Adds [@ionic/storage](https://ionicframework.com/docs/building/storage) as a dependency
4. Adds services, modules, and pages to `src/app/auth`
5. Adds a login page and related files to `src/app/login`
5. Adds a `cordova` section to `package.json` that defines plugins and a custom URL scheme
6. Updates existing files to handle authentication logic

<div style="text-align: center">
<script id="asciicast-245246" src="https://asciinema.org/a/245246.js" async></script>
</div>

If you'd like to see the source code for the templates that are installed, you can [find them on GitHub](https://github.com/oktadeveloper/schematics/tree/master/src/add-auth/ionic/angular/src/app).

_It's pretty sweet that OktaDev Schematics automates all of this for you, don't you think?!_

### Test User Login

Start your Ionic 4 application using `ionic serve`. Your app now has a login button. Click on it to authenticate with Okta using OIDC.

{% img blog/ionic-4-login/ionic-4-login.png alt:"Ionic 4 App with Login button" width:"800" %}{: .center-image }

It's likely that you're already logged into your Okta account, so you'll be redirected back to your app and see a screen like the following.

{% img blog/ionic-4-login/ionic-4-login-success.png alt:"Ionic 4 App Login success" width:"800" %}{: .center-image }

If you click **Sign Out** and **Sign In** again, you'll be prompted for your credentials.

{% img blog/ionic-4-login/okta-login.png alt:"Okta Login" width:"800" %}{: .center-image }

After you're redirected back to your app, you can click the **User Info** button to retrieve your user details from Okta.

{% img blog/ionic-4-login/ionic-4-userinfo.png alt:"User Info" width:"800" %}{: .center-image }

## Add User Registration

Next, enable user registration. This will allow new users to create their own account. Click on the **Users** menu and select **Registration**.

{% img blog/ionic-4-login/user-registration.png alt:"User Registration" width:"600" %}{: .center-image }

Click **Enable Registration**.

{% img blog/ionic-4-login/enable-registration.png alt:"Enable Registration" width:"800" %}{: .center-image }

On the subsequent page, click **Save** to complete the process of enabling user registration.

{% img blog/ionic-4-login/registration-settings.png alt:"Save Registration Settings" width:"800" %}{: .center-image }

Now if you go back to your app, sign out, then sign in again, you'll see a signup link at the bottom of the login form.

{% img blog/ionic-4-login/okta-login-with-signup.png alt:"Signup Link" width:"800" %}{: .center-image }

Click on the link and you'll see a user registration form. Fill it out and click **Register**.

{% img blog/ionic-4-login/okta-registration-form.png alt:"Registration Form" width:"800" %}{: .center-image }

You'll receive an email to verify you're real. Click on the **Activate Account** once you receive it, and you should be good to go!

## Run Your Ionic 4 App on iOS

To generate an iOS project for your Ionic application, run the following command:

```shell
ionic cordova prepare ios
```

When prompted to install the `ios` platform, answer **yes**. When the process completes, open your project in Xcode:

```shell
open platforms/ios/MyApp.xcworkspace
```

**NOTE:** If you don't have Xcode installed, you can [download it from Apple](https://developer.apple.com/xcode/).

You'll need to configure code signing in the **General** tab, then you should be able to run in Simulator. Below are screenshots of it running on an emulated iPhone X.

{% img blog/ionic-4-login/ios-emulator.png alt:"Running on iOS" width:"800" %}{: .center-image }


## Run Your Ionic 4 App on Android

The most important thing to know when running your Ionic app on Android is that you need Java 8 installed. Anything above Java 8 will not work. If you need to switch between Java SDK versions -- like I often do -- I recommend installing [SDKMAN!](https://sdkman.io/) I ran the command below to downgrade from Java 11 to Java 8 in my terminal window:

```shell
sdk use java 8.0.202-amzn
```

You can then generate an Android project.

```shell
ionic cordova prepare android
```

When prompted to install the `android` platform, answer **yes**. After this process completes, open your `platforms/android` directory as a project in [Android Studio](https://developer.android.com/studio).

```
studio platforms/android
```

**NOTE:** You will need to have Android Studio 3.3+ installed and have run **Tools** > **Create Command-line Launcher** for the command above to work.

### Running with Android Studio 3.3.2

When I first tried this in Android Studio, I received a Gradle Sync error:

```
The minSdk version should be declared in the android manifest file.
```

In the right pane, it offered a link for me to click on to fix the issue. I clicked on it, then clicked **Do Refactor**.

{% img blog/ionic-4-login/android-studio-sync-error.png alt:"Android Studio Sync error" width:"800" %}{: .center-image }

I was prompted to update Gradle and clicked **Update**.

{% img blog/ionic-4-login/android-studio-gradle-upgrade-3.3.png alt:"Upgrade Gradle" width:"600" %}{: .center-image }

After these changes, my app showed up in the top toolbar.

{% img blog/ionic-4-login/android-studio-app.png alt:"App in toolbar" width:"500" %}{: .center-image }

### Running with Android Studio 3.4

When I tried opening the project in Android Studio 3.4, I was prompted to update Gradle again.

{% img blog/ionic-4-login/android-studio-gradle-upgrade-3.4.png alt:"Upgrade Gradle" width:"600" %}{: .center-image }

After doing so, I received the following error:

```
WARNING: The following project options are deprecated and have been removed:
android.useDeprecatedNdk
NdkCompile is no longer supported
```

I found an [open issue](https://github.com/apache/cordova-android/issues/718) in the Cordova Android project that shows how to fix it. Open `android/gradle.properties` and turn off `useDeprecatedNdk`.

```properties
android.useDeprecatedNdk=false
```

### Set LaunchMode to `singleTask`

You need to make one additional change for everything to work properly on Android. You need to set the `launchMode` from `singleTop` to `singleTask` so the URL does not trigger a new instance of the app. Edit `platforms/android/app/src/main/AndroidManifest.xml` to make this change:

```xml
<activity android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale"
   android:label="@string/activity_name"
   android:launchMode="singleTask"
   android:name="MainActivity"
   android:theme="@android:style/Theme.DeviceDefault.NoActionBar"
   android:windowSoftInputMode="adjustResize">
```
    
Now you should be able to click the **play** button in Android Studio to start your app.

You will be prompted to select an existing AVD (Android Virtual Device) or you can plug in your Android phone and use that. If you have neither, click the **Create New Virtual Device Button**.

Below are screenshots of the app running on a Pixel 2 AVD.

{% img blog/ionic-4-login/android-emulator.png alt:"Running on Android" width:"800" %}{: .center-image }

## What About Capacitor?

[Capacitor](https://capacitor.ionicframework.com/) is a project from the Ionic folks that offers an alternative to Cordova. Capacitor 1.0 was [released last month](https://ionicframework.com/blog/announcing-capacitor-1-0/). The OktaDev Schematics project provides support for Capacitor with a `--platform=capacitor` flag. For example:

```shell
ng add @oktadev/schematics --platform=capacitor
```

**NOTE:** This integration uses Ionic's [native HTTP plugin for Cordova](https://ionicframework.com/docs/native/http) because the default HTTP from Capacitor uses a `capacitor://localhost` origin header and Okta only supports `http` origins.

## Bonus: You're Using PKCE in the Browser and on Mobile!

The Ionic 4 AppAuth integration in this example uses PKCE (Proof Key for Code Exchange). PKCE (pronounced "pixy") is a security extension for OAuth 2.0 for public clients on mobile (and desktop) clients. It's designed to prevent interception of the authorization code by a malicious application that runs on the same device. You can read about why it's awesome in Aaron Parecki's [Is the OAuth 2.0 Implicit Flow Dead?](/blog/2019/05/01/is-the-oauth-implicit-flow-dead)

## Learn More About Ionic, Schematics, and Angular

This tutorial showed you how to create an Ionic 4 application and add user login and registration with a handful of commands. If you'd like to see the completed application, you can [find it on GitHub](https://github.com/oktadeveloper/okta-ionic-4-login-example).

Ionic's support for React and Vue are in beta at the time of this writing. To read more about them, I recommend the following blog posts:

* [Announcing the Ionic React Beta](https://blog.ionicframework.com/announcing-the-ionic-react-beta/)
* [Announcing the Ionic React Beta](https://blog.ionicframework.com/announcing-the-ionic-vue-beta/)

I could have shown you how to create 19 files and update 8 to integrate OIDC login in Ionic 4. However, that seems like a long and cruel tutorial. Instead, I streamlined everything by using OktaDev Schematics. The code that OktaDev Schematics uses is from the Ionic AppAuth project's
[Cordova](https://github.com/wi3land/ionic-appauth-ng-demo) and [Capacitor](https://github.com/wi3land/ionic-appauth-capacitor-demo) examples.

I've written a few other tutorials on Schematics that might interest you:

* [Use Angular Schematics to Simplify Your Life](/blog/2019/02/13/angular-schematics)
* [Use Schematics with React and Add OpenID Connect Authentication in 5 Minutes](/blog/2019/03/05/react-schematics)
* [Schematics: A Plug-in System for JavaScript Projects](https://scotch.io/bar-talk/schematics-a-plug-in-system-for-javascript-projects)

If you're interested in learning more about Angular, the Okta developer blog has some great posts.

* [Angular 8 + Spring Boot 2.2](/blog/2019/05/13/angular-8-spring-boot-2): Build a CRUD App Today!
* [Build Secure Login for Your Angular App](/blog/2019/02/12/secure-angular-login)
* [Build a Simple Web App with Express, Angular, and GraphQL](/blog/2018/11/30/web-app-with-express-angular-graphql)

Enjoyed this tutorial? Follow us on Twitter [@oktadev](https://twitter.com/oktadev) for more like it!
