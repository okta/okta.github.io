---
layout: blog_post
title: 'Build a React Native Application and Authenticate with OAuth 2.0'
author: mraible
description: "Learn how to add authentication to your React Native applications with AppAuth and Okta."
tags: [react-native, authentication, oauth, oidc, react, okta]
tweets:
  - "React Native is 🔥! Learn how to add Authentication with OAuth 2.0 and AppAuth in this 😎 tutorial →"
  - "React Native provides a way for you to develop native apps with web technologies. See how to add authentication to your React Native apps with this handy tutorial."
  - "The React Native + OAuth 2.0 Tutorial you've been looking is live on the @okta developer blog!"
redirect_from:
  - "/blog/2018/03/16/build-react-native-authentication-oauth-2.0"
---

With Okta and OpenID Connect (OIDC) you can easily integrate authentication into a React Native application and never have to build it yourself again. OIDC allows you to authenticate directly against the [Okta API](https://developer.okta.com/product/), and this article shows you how to do just that in a React Native application. Today you'll see how to log a user into your React Native application using an OIDC redirect via the AppAuth library.

React Native is a pretty slick framework. Unlike Ionic and other hybrid mobile frameworks, it allows you to use web technologies (React and JavaScript) to build native mobile apps. There is no browser or WebView involved, so developing a mobile app with React Native is similar to using the native SDK in that you'll do all your testing on an emulator or device. There is no way to test it in your browser like there is with Ionic. This can be a benefit in that you don't have to write code that works in-browser and on-device separately.

If you look at Google Trends, you can see that React Native is even more popular than Android and iOS for native development!

<script type="text/javascript" src="https://ssl.gstatic.com/trends_nrtr/1294_RC01/embed_loader.js"></script> <script type="text/javascript"> trends.embed.renderExploreWidget("TIMESERIES", {"comparisonItem":[{"keyword":"ios development","geo":"","time":"today 12-m"},{"keyword":"android development","geo":"","time":"today 12-m"},{"keyword":"react native","geo":"","time":"today 12-m"}],"category":0,"property":""}, {"exploreQuery":"q=ios%20development,android%20development,react%20native&date=today 12-m,today 12-m,today 12-m","guestPath":"https://trends.google.com:443/trends/embed/"}); </script>

Today I'm going to show you how to develop a React Native app with the latest and greatest releases. At the time of this writing, that's React 16.2.0 and React Native 0.54.0. You'll create a new app, add [AppAuth](https://appauth.io/) for authentication, authenticate with Okta, and see it running on both iOS and Android.

> AppAuth is a client SDK for native apps to authenticate and authorize end-users using OAuth 2.0 and OpenID Connect. Available for iOS, macOS, Android and Native JS environments, it implements modern security and usability [best practices](https://tools.ietf.org/html/rfc8252) for native app authentication and authorization.

## Create Your React Native Application

React has a `create-react-app` command-line tool (CLI) that you can use to create new React apps. React Native has a similar tool called [Create React Native App](https://github.com/react-community/create-react-native-app). Before you install it, make sure you have [Node](https://nodejs.org/) v6 or later installed.

Install `create-react-native-app` and create a new project called `okta-rn`:

```bash
npm install -g create-react-native-app
create-react-native-app okta-rn
cd okta-rn
npm start
```

Running these commands will result in your terminal prompting you with some options:

```
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

| {% img blog/react-native-app-auth/open-in-expo.png alt:"Open in Expo" width:"400" %} | {% img blog/react-native-app-auth/default-page.png alt:"Rendered App.js" width:"400" %} |

If you're on Windows or Linux, I'd suggest trying the Android emulator or your Android device (if you have one). If it doesn't work, don't worry, I'll show you how to make that work later on.

**TIP:** You can use TypeScript instead of JavaScript in your React Native app using Microsoft's [TypeScript React Native Starter](https://github.com/Microsoft/TypeScript-React-Native-Starter). If you decide to go this route, I'd recommend following the steps to convert your app after you've completed this tutorial.

## React Native and OAuth 2.0

In this example, I'll use [React Native App Auth](https://github.com/FormidableLabs/react-native-app-auth), a library created by [Formidable](http://formidable.com/). The reason I'm using this library is three-fold: 1) they provide an excellent [example](https://github.com/FormidableLabs/react-native-app-auth/tree/master/Example) that I was able to make work in just a few minutes, 2) it uses AppAuth (a mature OAuth client implementation), and 3) I was unable to get anything else working.

* I tried [react-native-oauth](https://github.com/fullstackreact/react-native-oauth) but discovered it required using an existing provider before adding a new one. I only wanted to have Okta as a provider. Also, it's high number of issues and pull requests served as a warning sign.
* I tried [react-native-simple-auth](https://github.com/adamjmcgrath/react-native-simple-auth) but had problems getting the deprecated Navigator component to work with the latest React Native release.
* I tried doing [this OAuth 2 with React Native tutorial](https://medium.com/@jtremback/oauth-2-with-react-native-c3c7c64cbb6d), but also had problems redirecting back to my app.

### Create Native Application in Okta

Before you add AppAuth to your React Native application, you'll need an app to authorize against. If you don't have a free-forever Okta Developer account, [get one today](https://developer.okta.com/signup/)!

Log in to your Okta Developer account and navigate to **Applications** > **Add Application**. Click **Native** and click **Next**. Give the app a name you'll remember (e.g., `React Native`), select `Refresh Token` as a grant type, in addition to the default `Authorization Code`. Copy the **Login redirect URI** (e.g., `{yourOktaScheme}:/callback`) and save it somewhere. You'll need this value when configuring your app.

Click **Done** and you should see a client ID on the next screen. Copy and save this value as well.

### Add React Native AppAuth for Authentication

You'll need to "eject" the native configuration for your app, which is normally hidden by create-react-native-app.

```
npm run eject
```

When prompted to answer questions, use the following answers:

| Question | Answer |
|---|---|
| How would you like to eject from create-react-native-app? | `React Native` |
| What should your app appear as on a user's home screen? | `Okta RN` |
| What should your Android Studio and Xcode projects be called? | `OktaRN` |

To install App Auth for React Native, run the following commands:

```bash
npm i react-native-app-auth@2.2.0
npm i
react-native link
```

After running these commands, you have to [configure the native iOS projects](https://github.com/FormidableLabs/react-native-app-auth#setup). I've copied the steps below for your convenience.

### iOS Setup

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

Then run `pod install` from the `ios` directory. This can take a while the first time, even on a fast connection. Now is a good time to grab a coffee or a scotch! 🥃

Open your project in Xcode by running `open OktaRN.xcworkspace` from the `ios` directory.

If you intend to support iOS 10 and older, you need to define the supported redirect URL schemes in `ios/OktaRN/Info.plist` as follows:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>{yourOktaScheme}</string>
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
      <string>{yourOktaScheme}</string>
    </array>
  </dict>
</array>
```

Open `AppDelegate.h` in your Xcode project (OktaRN > OktaRN > `AppDelegate.h`) and add the lines with the `+` next to them below.

```diff
+ @protocol OIDAuthorizationFlowSession;

  @interface AppDelegate : UIResponder <UIApplicationDelegate>
+ @property(nonatomic, strong, nullable) id<OIDAuthorizationFlowSession> currentAuthorizationFlow;
  @property (nonatomic, strong) UIWindow *window;
  @end
```

This property holds the authorization flow information that started before you redirect to Okta. After Okta authorizes you, it redirects to the `redirect_uri` that's passed in.

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

## Build Your React Native App

Replace the code in `App.js` with the following JavaScript. This code allows you to authorize, refresh your access token, and revoke it.

```js
import React, { Component } from 'react';
import { UIManager, LayoutAnimation } from 'react-native';
import { authorize, refresh, revoke } from 'react-native-app-auth';
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

const config = {
  issuer: 'https://{yourOktaDomain}/oauth2/default',
  clientId: '{clientId}',
  redirectUrl: '{yourOktaScheme}:/callback',
  additionalParameters: {},
  scopes: ['openid', 'profile', 'email', 'offline_access']
};

export default class App extends Component<{}, State> {
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
      const authState = await authorize(config);
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
      Alert.alert('Failed to log in', error.message);
    }
  };

  refresh = async () => {
    try {
      const authState = await refresh(config, {
        refreshToken: this.state.refreshToken
      });

      this.animateState({
        accessToken: authState.accessToken || this.state.accessToken,
        accessTokenExpirationDate:
          authState.accessTokenExpirationDate || this.state.accessTokenExpirationDate,
        refreshToken: authState.refreshToken || this.state.refreshToken
      });
    } catch (error) {
      Alert.alert('Failed to refresh token', error.message);
    }
  };

  revoke = async () => {
    try {
      await revoke(config, {
        tokenToRevoke: this.state.accessToken,
        sendClientId: true
      });
      this.animateState({
        accessToken: '',
        accessTokenExpirationDate: '',
        refreshToken: ''
      });
    } catch (error) {
      Alert.alert('Failed to revoke token', error.message);
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

Make sure to adjust `config` with your settings.

```
const config = {
  issuer: 'https://{yourOktaDomain}/oauth2/default',
  clientId: '{clientId}',
  redirectUrl: '{yourOktaScheme}:/callback',
  ...
};
```

Change `index.js` to use `OktaRN` as the name of your app.

```js
AppRegistry.registerComponent('OktaRN', () => App);
```

This code uses [styled-components](https://github.com/styled-components/styled-components), so you'll need to install that as a dependency.

**NOTE:** Make sure to navigate into the root directory of your project before running the commands below.

```bash
npm i styled-components
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

You should see a screen that says "Hello, stranger." Click on **Authorize**, and you'll be prompted to continue or cancel.

| {% img blog/react-native-app-auth/hello.png alt:"Hello, stranger" width:"400" %} | {% img blog/react-native-app-auth/continue.png alt:"Cancel or Continue" width:"400" %} |

Click **Continue** and you should see an Okta sign-in form. Enter your credentials, and you'll be redirected back to the application.

| {% img blog/react-native-app-auth/okta-login.png alt:"Okta Sign-In" width:"400" %} | {% img blog/react-native-app-auth/access-token.png alt:"Access Token Info" width:"400" %} |

You can click **Refresh** to watch the values for the access token and expire date change.

**TIP:** If animations happen slowly in iOS Simulator, toggle **Debug** > **Slow Animations**.

### Android Setup

To configure the native Android project, start by upgrading the version of Gradle it uses.

```bash
cd android
./gradlew wrapper --gradle-version 4.6
```

React Native App Auth for Android depends on [AppAuth-android](https://github.com/openid/AppAuth-android), but you need to add the correct Android Support library version to your project.

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

Add the `appAuthRedirectScheme` property the `defaultConfig` in `android/app/build.gradle`:

```groovy
android {
  defaultConfig {
    ...
    manifestPlaceholders = [
      appAuthRedirectScheme: '{yourOktaScheme}'
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
        appAuthRedirectScheme: '{yourOktaScheme}'
    ]
}
```

### Run on Android

To try it on an Android emulator, run `npm run android`. If you don't have a phone plugged in or an Android Virtual Device (AVD) running, you'll see an error:

```bash
* What went wrong:
Execution failed for task ':app:installDebug'.
> com.android.builder.testing.api.DeviceException: No connected devices!
```

To fix this, open Android Studio, choose **open existing project**, and select the `android` directory in your project. If you're prompted to update anything, approve it.

To create a new AVD, navigate to **Tools** > **Android** > **AVD Manager**. Create a new Virtual Device and click Play. I chose a Pixel 2 as you can see from my settings below.

{% img blog/react-native-app-auth/avd-pixel-2.png alt:"AVD Pixel 2" width:"800" %}{: .center-image }

Run `npm run android` again. You should see a welcome screen and be able to authorize successfully.

| {% img blog/react-native-app-auth/android-hello.png alt:"Hello, stranger" width:"280" %} | {% img blog/react-native-app-auth/android-sign-in.png alt:"Okta Sign-In" width:"280" %} | {% img blog/react-native-app-auth/android-access-token.png alt:"Access Token on Android" width:"280" %} |

**TIP:** To fix `Configuration 'compile' in project ':app' is deprecated. Use 'implementation' instead.`, change `compile` under `dependencies` to `implementation`. More information can be found in [Migrate to Android Plugin for Gradle 3.0.0](https://developer.android.com/studio/build/gradle-plugin-3-0-0-migration.html).

### Upgrade to the Latest Release of React Native

The [react-native-git-upgrade](https://www.npmjs.com/package/react-native-git-upgrade) tool is a handy way to upgrade your project to use the latest versions. Install it and run it.

```bash
npm i -g react-native-git-upgrade
react-native-git-upgrade
npm i
```

Or, you can just change your `package.json` to have `"react-native": "0.54.2"` and then run `npm i`.

### Get and View an ID Token

If you'd like to get an ID token in addition to an access token, add `idToken` as a property of type `State` and the `state` variable in `App.js`.

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

Then update the `authorize()` method to set the property from `authState`. You'll want to add similar logic in the `refresh()` and `revoke()` methods.

```js
authorize = async () => {
  try {
    const authState = await authorize(config);
    this.animateState(
      {
        hasLoggedInOnce: true,
        accessToken: authState.accessToken,
        accessTokenExpirationDate: authState.accessTokenExpirationDate,
        refreshToken: authState.refreshToken,
        idToken: authState.idToken
      },
      500
    );
  } catch (error) {
    Alert.alert('Failed to log in', error.message);
  }
};
```

To see what's in your ID token, install [buffer](https://www.npmjs.com/package/buffer).

```bash
npm i buffer
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

Run `npm run ios` (or `npm run android`) and you should see the claims in the ID token after authorizing with Okta. Below is a screenshot proving it works in iOS Simulator.

{% img blog/react-native-app-auth/ios-id-token.png alt:"ID Token on iOS" width:"500" %}{: .center-image }

### Call an API with Your Access Token

Now that you have an access token, what can you do with it? You can call an Okta-protected API with it in an `Authorization` header!

I wrote about how to create a "Good Beers" API in [Bootiful Development with Spring Boot and React](/blog/2017/12/06/bootiful-development-with-spring-boot-and-react). You can use the backend of that application to prove it works.

Clone the project from GitHub and check out the `okta` branch.

```bash
git clone https://github.com/oktadeveloper/spring-boot-react-example.git
git checkout okta
```

Modify `spring-boot-react-example/server/src/main/resources/application.properties` to set the `issuer` and `clientId`.

```properties
okta.oauth2.issuer=https://{yourOktaDomain}/oauth2/default
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

Set it to this same value in the `revoke()` method. Add a `fetchGoodBeers()` method that uses the access token to call the backend.

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

In iOS Simulator, press **Command + R** to reload everything and you should see the JSON when you click on the **Good Beers** button. You can reload in Android using **Command + M** (on Mac, **CTRL + M** on other operating systems).

| {% img blog/react-native-app-auth/good-beers-ios.png alt:"Good Beers on iOS" width:"400" %} | {% img blog/react-native-app-auth/good-beers-android.png alt:"Good Beers on Android" width:"350" %} |

**NOTE:** There is an [open issue in react-native-app-auth](https://github.com/FormidableLabs/react-native-app-auth/issues/70) about revoke not working with Okta because an `Authorization` header is not sent.

## Learn More about React Native and React

I hope you've enjoyed this whirlwind tour of how to do authentication with Okta and React Native. You can learn more about React Native on [its official site](https://facebook.github.io/react-native/). You can also add to its ~60K stars [on GitHub](https://github.com/facebook/react-native).

You can find the source code for this application at <https://github.com/oktadeveloper/okta-react-native-app-auth-example>.

If you're interested in seeing how to do regular React development with Okta, I encourage you to check out the following resources:

* [Build a React Application with User Authentication in 15 Minutes](/blog/2017/03/30/react-okta-sign-in-widget)
* [Build a Preact App with Authentication](/blog/2017/10/19/build-a-preact-app-with-authentication)
* [Bootiful Development with Spring Boot and React](/blog/2017/12/06/bootiful-development-with-spring-boot-and-react)

If you have any questions about this article, please hit me up on Twitter [@mraible](https://twitter.com/mraible).
