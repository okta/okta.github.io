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

If you're on a Mac, press **i** to open iOS emulator. You will be prompted to install/open with Expo, then presented with the rendered `App.js`.

{% img blog/react-native-app-auth/open-in-expo.png alt:"Open in Expo" width:"450" %}
{% img blog/react-native-app-auth/default-page.png alt:"Rendered App.js" width:"450" %}

If you're on Windows or Linux, I'd suggest trying the Android emulator or your Android device (if you have one). If it doesn't work, don't worry, I'll show you how to make that work later on.

**TIP:** You can use TypeScript instead of JavaScript in your React Native app using Microsoft's [TypeScript React Native Starter](https://github.com/Microsoft/TypeScript-React-Native-Starter). If you decide to go this route, I'd recommend following the steps to convert your app after you've completed this tutorial.

## React Native and OAuth

In this example, I'll use [React Native App Auth](https://github.com/FormidableLabs/react-native-app-auth), a library created by [Formidable](http://formidable.com/). The reason I'm using this library is three-fold: 1) they provide a nice [example](https://github.com/FormidableLabs/react-native-app-auth/tree/master/Example) that I was able to make work in just a few minutes, 2) it uses AppAuth (a mature OAuth client implementation), and 3) I was unable to get anything else working.

* I tried [react-native-oauth](https://github.com/fullstackreact/react-native-oauth), but discovered it required using an existing provider before adding a new one. I only wanted to have Okta as a provider. Also, it's high number of issues and pull requests served as a warning sign.
* I tried [react-native-simple-auth](https://github.com/adamjmcgrath/react-native-simple-auth), but had issues with Safari redirecting back to my app successfully. // todo: double check this
* I tried doing [this OAuth 2 with React Native tutorial](https://medium.com/@jtremback/oauth-2-with-react-native-c3c7c64cbb6d), but also had problems redirecting back to my app.

### Create Native Application in Okta

Before you add App Auth to your React Native application, you'll need an application to authorize against. If you don't have an Okta Developer account, [get one today](https://developer.okta.com/signup/)!

Log in to your Okta Developer account and navigate to **Applications** > **Add Application**. Click **Native** and click the **Next** button. Give the app a name you’ll remember (e.g., `React Native`), select `Refresh Token` as a grant type, in addition to the default `Authorization Code`. Copy the **Login redirect URI** (e.g., `com.oktapreview.dev-158606:/callback`) and save it somewhere. You'll need this value when configuring your app.

Click **Done** and you should see a client ID next screen. Copy and save this value as well. 

### Add React Native App Auth for Authentication

You'll need to "eject" the native configuration for your app, which is normally hidden by create-react-native-app.

```
npm run eject
```

You should see output similar to the following:

```
We didn't find any uses of the Expo SDK in your project, so you should be fine to eject to
"Plain" React Native. (This check isn't very sophisticated, though.)

We strongly recommend that you read this document before you proceed:
  https://github.com/react-community/create-react-native-app/blob/master/EJECTING.md

Ejecting is permanent! Please be careful with your selection.

? How would you like to eject from create-react-native-app? React Native: I'd like a regular React Native project.
We have a couple of questions to ask you about how you'd like to name your app:
? What should your app appear as on a user's home screen? Okta RN
? What should your Android Studio and Xcode projects be called? OktaRN
Writing your selections to app.json...
Wrote to app.json, please update it manually in the future.
Scanning folders for symlinks in /Users/mraible/okta-react-native-app-auth/node_modules (11ms)
Generating the iOS folder.
Generating the Android folder.
Successfully copied template native code.
Babel preset changed to `babel-preset-react-native-stage-0/decorator-support`.
Updating your yarn scripts in package.json...
Your package.json is up to date!
Adding entry point...
Added new entry points!

Note that using `yarn start` will now require you to run Xcode and/or
Android Studio to build the native code for your project.
Removing node_modules...
Installing packages with yarn...
```

To install App Auth for React Native, run the following commands:

```bash
npm install react-native-app-auth --save
react-native link react-native-app-auth
```

After running these commands, you have to [configure the native iOS and Android projects](https://github.com/FormidableLabs/react-native-app-auth#setup). I've copied the steps below for your convenience. 

#### iOS Setup

React Native App Auth depends on [AppAuth-ios](https://github.com/openid/AppAuth-iOS), so you have to configure it as a dependency. The easiest way to do that is to use [CocoaPods](https://guides.cocoapods.org/using/getting-started.html). To install CocoaPods, run the following command:

```bash
sudo gem install cocoapods
```

Create a `Podfile` in the `ios` directory of your project that specifies AppAuth-ios as a dependency. Make sure that `OktaRN` matches the app name you specified when running `npm run eject`.

```
platform :ios, '11.0'

target 'OktaRN' do
  pod 'AppAuth', '>= 0.91'
end
```

Then run `pod install`. This can take a while, even on a fast connection. Now is a good time to grab a coffee, or a scotch! 🥃

Open your project in Xcode by running `open OktaRN.xcworkspace` from the `ios` directory.

If you intend to support iOS 10 and older, you need to define the supported redirect URL schemes in your [`ios/OktaRN/Info.plist`] as follows:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>{yourAppIdentifier}</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>{yourReversedOktaDomain}</string>
    </array>
  </dict>
</array>
```

Below is what mine looks like after I changed my app identifier and added this key.

```xml
<key>CFBundleIdentifier</key>
<string>com.okta.developer.reactnative.$(PRODUCT_NAME:rfc1034identifier)</string>
<key>CFBundleURLTypes</key>
<array>
		<dict>
			 <key>CFBundleURLName</key>
			 <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
			 <key>CFBundleURLSchemes</key>
			 <array>
				  <string>com.oktapreview.dev-158606</string>
		  </array>
	 </dict>
</array>
```

Open `AppDelegate.h` in your project and add the following lines.

```diff
+ @protocol OIDAuthorizationFlowSession;

  @interface AppDelegate : UIResponder <UIApplicationDelegate>
+ @property(nonatomic, strong, nullable) id<OIDAuthorizationFlowSession> currentAuthorizationFlow;
  @property (nonatomic, strong) UIWindow *window;
  @end
```

This holds the authorization flow information that started before you redirect to Okta. After Okta authorizes you, it redirects to the `redirect_uri` that's passed in.

The authorization flow starts from an `openURL()` app delegate method. To add it, open `AppDelegate.m` and import `AppAuth.h`.

```c
#import "AppAuth.h"
```

Then at the bottom of the class (before `@end`), add the `openURL()` method.

```c
- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<NSString *, id> *)options {
  if ([_currentAuthorizationFlow resumeAuthorizationFlowWithURL:url]) {
    _currentAuthorizationFlow = nil;
    return YES;
  }
  return NO;
}
```

#### Android Setup

Setting up Android is quite a bit easier. React Native App Auth for Android depends on [AppAuth-android](https://github.com/openid/AppAuth-android), but you need to add the correct Android Support library version to your project. 

Add the Google Maven repository to your `android/build.gradle` and upgrade the Android Tools dependency:

```groovy
buildscript {
    repositories {
        jcenter()
        google()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:3.0.1'
    }
}
```

Upgrade the `appcompat` dependency in `android/app/build.gradle` to `25.3.1` to match the one expected by AppAuth.

```groovy
dependencies {
  compile "com.android.support:appcompat-v7:25.3.1"
}
```

Remove `buildToolsVersion "23.0.1"` as its no longer necessary. 

Update the `compileSdkVersion`:

```groovy
android {
  compileSdkVersion 25
}
```

Finally, add the `appAuthRedirectScheme` property the `defaultConfig` in `android/app/build.gradle`:

```groovy
android {
  defaultConfig {
    ...
    manifestPlaceholders = [
      appAuthRedirectScheme: '{yourReversedOktaDomain}'
    ]
  }
}
```

After making this change, my `defaultConfig` looks as follows.

```groovy
defaultConfig {
    applicationId "com.oktarn"
    minSdkVersion 16
    targetSdkVersion 22
    versionCode 1
    versionName "1.0"
    ndk {
        abiFilters "armeabi-v7a", "x86"
    }
    manifestPlaceholders = [
        appAuthRedirectScheme: 'com.oktapreview.dev-158606'
    ]
}
```

## Build Your App

Modify `App.js` to have the following code that allows you to authorize, refresh your access token, and revoke it.

```js
import React, { Component } from 'react';
import { UIManager, LayoutAnimation } from 'react-native';
import AppAuth from 'react-native-app-auth';
import { Page, Button, ButtonContainer, Form, Heading } from './components';

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

const scopes = ['openid', 'profile', 'email', 'offline_access'];

type State = {
  hasLoggedInOnce: boolean,
  accessToken: ?string,
  accessTokenExpirationDate: ?string,
  refreshToken: ?string
};

export default class App extends Component<{}, State> {
  auth = new AppAuth({
    issuer: 'https://{yourOktaDomain}.com/oauth2/default',
    clientId: '{clientId}',
    redirectUrl: 'com.{yourReversedOktaDomain}:/callback'
  });

  state = {
    hasLoggedInOnce: false,
    accessToken: '',
    accessTokenExpirationDate: '',
    refreshToken: ''
  };

  animateState(nextState: $Shape<State>, delay: number = 0) {
    setTimeout(() => {
      this.setState(() => {
        LayoutAnimation.easeInEaseOut();
        return nextState;
      });
    }, delay);
  }

  authorize = async () => {
    try {
      const authState = await this.auth.authorize(scopes);
      this.animateState(
        {
          hasLoggedInOnce: true,
          accessToken: authState.accessToken,
          accessTokenExpirationDate: authState.accessTokenExpirationDate,
          refreshToken: authState.refreshToken
        },
        500
      );
    } catch (error) {
      console.error(error);
    }
  };

  refresh = async () => {
    try {
      const authState = await this.auth.refresh(this.state.refreshToken, scopes);
      this.animateState({
        accessToken: authState.accessToken || this.state.accessToken,
        accessTokenExpirationDate:
        authState.accessTokenExpirationDate || this.state.accessTokenExpirationDate,
        refreshToken: authState.refreshToken || this.state.refreshToken
      });
    } catch (error) {
      console.error(error);
    }
  };

  revoke = async () => {
    try {
      await this.auth.revokeToken(this.state.accessToken, true);
      this.animateState({
        accessToken: '',
        accessTokenExpirationDate: '',
        refreshToken: ''
      });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const {state} = this;
    return (
      <Page>
        {!!state.accessToken ? (
          <Form>
            <Form.Label>accessToken</Form.Label>
            <Form.Value>{state.accessToken}</Form.Value>
            <Form.Label>accessTokenExpirationDate</Form.Label>
            <Form.Value>{state.accessTokenExpirationDate}</Form.Value>
            <Form.Label>refreshToken</Form.Label>
            <Form.Value>{state.refreshToken}</Form.Value>
          </Form>
        ) : (
          <Heading>{state.hasLoggedInOnce ? 'Goodbye.' : 'Hello, stranger.'}</Heading>
        )}

        <ButtonContainer>
          {!state.accessToken && (
            <Button onPress={this.authorize} text="Authorize" color="#017CC0"/>
          )}
          {!!state.refreshToken && <Button onPress={this.refresh} text="Refresh" color="#24C2CB"/>}
          {!!state.accessToken && <Button onPress={this.revoke} text="Revoke" color="#EF525B"/>}
        </ButtonContainer>
      </Page>
    );
  }
}
```

Make sure to adjust the initialization of `AppAuth` with your settings.

```
auth = new AppAuth({
    issuer: 'https://{yourOktaDomain}.com/oauth2/default',
    clientId: '{clientId}',
    redirectUrl: 'com.{yourReversedOktaDomain}:/callback	'
});
```

Change `index.js` to use `OktaRN` as the name of your app.

```js
AppRegistry.registerComponent('OktaRN', () => App);
```

This code uses [styled-components], so you'll need to install that as a dependency.

```bash
npm i styled-components --save
```

Then copy the `components` directory into your project's root directory from Formidable's example.

```bash
svn export https://github.com/FormidableLabs/react-native-app-auth/trunk/Example/components
```

Grab the background image that's referenced in the `Page.js` component too.

```bash
svn export https://github.com/FormidableLabs/react-native-app-auth/trunk/Example/assets
```

### Run on iOS Simulator

Run your app with `npm run ios`.

You'll likely get an error similar to the following:

```
error: bundling failed: Error: Couldn't find preset "babel-preset-react-native-stage-0/decorator-support" relative to directory "/Users/mraible/okta-react-native-app-auth"
```

To fix this, modify your `package.json` to remove `babel-preset-react-native-stage-0` and add `babel-preset-react-native`.

```json
"devDependencies": {
  "babel-preset-react-native": "^4.0.0",
  "jest-react-native": "^18.0.0",
  "react-test-renderer": "16.2.0"
},
```

You'll also need to change `.babelrc` to have the following for `presets`:

```json
"presets": ["react-native"],
```

Run `npm i`, followed by `npm run ios`. 

You should see a screen that says "Hello, stranger." Click on **Authorize** and you'll be prompted to continue or cancel.

| ![Hello, stranger](/assets/img/blog/react-native-app-auth/hello.png) | ![Cancel | Continue](/assets/img/blog/react-native-app-auth/continue.png) |

Click **Continue** and you should see an Okta sign-in form. Enter your credentials and you'll be redirected back to the application. 

| ![Okta Sign-In](/assets/img/blog/react-native-app-auth/okta-login.png) | ![Access Token Info](/assets/img/blog/react-native-app-auth/access-token.png) |

You can click **Refresh** to watch the access token and expire date change.

**TIP:** If animations happen slowly in iOS Simulator, toggle **Debug** > **Slow Animations**.

### Run on Android

To try it on an Android emulator, run `npm run android`. If you don't have a phone plugged in or an Android Virtual Device (AVD) created, you'll see an error:

```bash
* What went wrong:
Execution failed for task ':app:installDebug'.
> com.android.builder.testing.api.DeviceException: No connected devices!
```

To fix this, open Android Studio, select open existing project, and select the `android` directory in your project. If you're prompted to update anything, approve it.

To create a new AVD, navigate to **Tools** > **Android** > **AVD Manager**. Create a new Virtual Device and click Play. I chose a Pixel 2 as you can see from my settings below.

![AVD Pixel 2](/assets/img/blog/react-native-app-auth/avd-pixel-2.png)

Run `npm run android` again. You should see a welcome screen and be able to authorize sucessfully.

| ![Hello, stranger](/assets/img/blog/react-native-app-auth/android-hello.png) | ![Okta Sign-In](/assets/img/blog/react-native-app-auth/android-sign-in.png) | ![Access Token on Android](/assets/img/blog/react-native-app-auth/android-access-token.png) |

### Get and View an ID Token

If you'd like to get an ID Token in addition to an access token, add `idToken` as a property of type `State` and the `state` variable in `App.js`.

```js
type State = {
  ...
  idToken: ?string
};

export default class App extends Component<{}, State> {
  ...
  state = {
    ...
    idToken: ''
  };
```

Then update the `authorize()` method to set the property from `authState`. You'll want to do add similar logic in the `refresh()` and `revoke()` methods.

```js
authorize = async () => {
  try {
    const authState = await this.auth.authorize(scopes);
    this.animateState(
      {
        hasLoggedInOnce: true,
        accessToken: authState.accessToken,
        idToken: authState.idToken,
        accessTokenExpirationDate: authState.accessTokenExpirationDate,
        refreshToken: authState.refreshToken
      },
      500
    );
  } catch (error) {
    console.error(error);
  }
};
```

To see what's in your ID token, install [buffer](https://www.npmjs.com/package/buffer).

```js
npm i buffer --save
```

Import it at the top of `App.js`.

```js
import { Buffer } from 'buffer';
```

Then change the `render()` method to decode it.

```js
render() {
  const {state} = this;
  if (state.idToken) {
    const jwtBody = state.idToken.split('.')[1];
    const base64 = jwtBody.replace('-', '+').replace('_', '/');
    const decodedJwt = Buffer.from(base64, 'base64');
    state.idTokenJSON = JSON.parse(decodedJwt);
  }
  ...
```

Finally, add a `<Form.Label>` and `<Form.Value>` row after the one that displays the access token.

```html
<Form.Label>ID Token</Form.Label>
<Form.Value>{JSON.stringify(state.idTokenJSON)}</Form.Value>
```

Unfortunately, there's a [bug in react-native-app-auth](https://github.com/FormidableLabs/react-native-app-auth/issues/17) that prevents this from working on Android. It works great on iOS though!

![ID Token on iOS](/assets/img/blog/react-native-app-auth/ios-id-token.png)

### Call an API with Your Access Token

Now that you have an access token, what can you do with it? You can call an Okta-protected API with it in an `Authorization` header!

I wrote about how to create a "Good Beers" API in [Bootiful Development with Spring Boot and React](https://developer.okta.com/blog/2017/12/06/bootiful-development-with-spring-boot-and-react). You can use the backend of that application to prove it works.

Clone the project from GitHub and checkout the `okta` branch.

```bash
git clone git@github.com:oktadeveloper/spring-boot-react-example.git
git checkout okta
```

Modify `spring-boot-react-example/server/src/main/resources/application.properties` to set the `issuer` and `clientId`.

```properties
okta.oauth2.issuer=https://{yourOktaDomain}.com/oauth2/default
okta.oauth2.clientId={clientId}
```

**NOTE:** You'll need to have [Java 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) installed to run this Spring Boot application.

Start the app by running `./mvnw` from the `server` directory.

Back to the React Native client. In `App.js`, add `beers` as a property of `state`.

```js
state = {
  ...
  beers: []
};
```

Set it to this same value in the `revoke()` method.

Add a `fetchGoodBeers()` method that uses the access token to call the backend.

```js
fetchGoodBeers = async () => {
  if (this.state.beers.length) {
    // reset to id token if beers is already populated
    this.animateState({beers: []})
  } else {
    fetch('http://localhost:8080/good-beers', {
      headers: {
        'Authorization': `Bearer ${this.state.accessToken}`
      }
    }).then(response => response.json())
      .then(data => {
        this.animateState({beers: data})
      })
      .catch(error => console.error(error));
  }
};
```

**TIP:** For this to work in the Android emulator (and on a real phone), you'll need to change `localhost` to your IP address.

In the `<ButtonContainer>` at the bottom, add a "Good Beers" button that allows you to call the API, as well as press it again to view the ID Token.

```js
{!!state.accessToken && <Button onPress={this.fetchGoodBeers} text={!this.state.beers.length ? 'Good Beers' : 'ID Token'} color="#008000" />}
```

Modify the row where you display the ID token to show the JSON from the API.

```html
<Form.Label>{state.beers.length ? 'Good Beers' : 'ID Token'}</Form.Label>
<Form.Value>{JSON.stringify(state.beers.length ? state.beers : state.idTokenJSON)}</Form.Value>
```

In iOS Simulator, press **Command + R** (on Mac, **CTRL + R** on others)to reload everything and you should see the JSON when you click on the **Good Beers** button. You can reload in Android using **Command + M** (on Mac, **CTRL + M** on other operating systems).

| ![Good Beers on iOS](/assets/img/blog/react-native-app-auth/good-beers-ios.png) | ![Good Beers Android](/assets/img/blog/react-native-app-auth/good-beers-android.png) | 

## Learn More about React Native and React

I hope you've enjoyed this whirlwind tour of how to do authentication with Okta and React Native. You can learn more about React Native on [its official site](https://facebook.github.io/react-native/). You can also add to its ~60K stars
 [on GitHub](https://github.com/facebook/react-native).
 
 You can find the source code for this application at <https://github.com/oktadeveloper/okta-react-native-app-auth>.
 
 If you're interested in seeing how to do regular React development with Okta, I encourage you to check out the following resources.
 
 * [Build a React Application with User Authentication in 15 Minutes](https://developer.okta.com/blog/2017/03/30/react-okta-sign-in-widget)
 * [Build a Preact App with Authentication]()https://developer.okta.com/blog/2017/10/19/build-a-preact-app-with-authentication)
 * [Bootiful Development with Spring Boot and React](https://developer.okta.com/blog/2017/12/06/bootiful-development-with-spring-boot-and-react)