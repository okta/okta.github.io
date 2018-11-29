---
layout: blog_post
title: 'Build and Test a React Native App with TypeScript and OAuth 2.0'
author: kpenzhorn
description: "Use TypeScript to build and test a React Native app with authentication."
tags: [typescript, react native, oauth, testing, android]
tweets:
- "You've heard about React Native, but haven't tried it yet? Now's your chance! As a bonus, this tutorial also shows you how to test it. "
- "Get started with React Native today! This post shows you how to build a simple app, add authentication, and test it with @fbjest. "
- "Wanna learn how to build an app with @reactnative? You're in luck! We have just the tutorial for you."
image: blog/featured/okta-react-skew.jpg
---

React Native is one of the most popular ways of creating mobile apps. Building on the success of React, it ties together native components for both Android and iOS using a shared JavaScript code-base. However, JavaScript has come under fire recently for not being type safe which can lead to a loss of developer trust. Enter TypeScript, which allows type annotations to be added to existing JavaScript code.

One requirement of many mobile apps is authentication (aka authn - confirming user identity) and authorization (authz - confirming access rights). Implementing this through the OAuth 2.0 standard allows integration with all the major third-party authn / authz services. It’s also imperative to create automated tests to check that core functionality has not been broken.

In this tutorial you’ll create an empty React Native project, add OAuth capabilities with [React Native App Auth](https://github.com/FormidableLabs/react-native-app-auth), port the project over to TypeScript, and finally add testing using the [React Test Renderer](https://reactjs.org/docs/test-renderer.html).

## Create a React Native Project

The latest version of the [official getting started guide](https://facebook.github.io/react-native/docs/getting-started.html) recommends using [Expo](https://expo.io/) to create initial projects, but I found Expo to be quirky to setup. The old way is using the command-line tool (CLI). Check out the **Building Projects with Native Code** tab in the aforementioned guide to get details of setting this up.

Once you have [installed Node](https://nodejs.org/en/download/) (at least 8.3 - and I recommend using the LTS version) you should be able to install the React Native CLI with `npm`.

```bash
npm install -g react-native-cli@2.0.1
```

Once done you should have a command `react-native` available to create a new project.

```bash
react-native init ReactNativeTypeScript
```

This will install the latest version of React Native ([currently 0.57.4](https://github.com/facebook/react-native/releases)) into the `ReactNativeTypeScript` folder. Change into that folder and run `react-native run-android`.

```bash
cd ReactNativeTypeScript
react-native run-android
```

If you don't have a phone plugged in or an Android Virtual Device (AVD) running, you'll see an error:

```bash
com.android.builder.testing.api.DeviceException: No connected devices!
```

To fix this, open Android Studio, and create a new AVD. You can do this by navigating to **Tools** > **Android** > **AVD Manager**. Create a new Virtual Device and click the play button. 

This will build and install the skeleton app on either a connected Android device or an emulator if it is connected. Similarly for `react-native run-ios`. If you get stuck here, check out the getting started guide I mentioned above (specifically the **Building Projects with Native Code** tab).

{% img blog/react-native-testing/welcome-to-react-native.png alt:"Welcome to React Native!" width:"232" %}{: .center-image }

## Create a Native Application in Okta

To make adding authentication and authorization simple, we’ll use Okta in this tutorial. You can sign-up for a [free Okta developer account here](https://developer.okta.com/signup/). When that’s done, log in and navigate to **Applications** > **Add Application**. Select **Native** and click **Next**. Choose a name, select **Refresh Token** and click **Done**.

Note your **Login redirect URI** and the **Client ID** since you’ll be adding them to your app.

## Add AppAuth to Your Project

For authentication we’re going to use the [react-native-app-auth](https://github.com/FormidableLabs/react-native-app-auth) library, using their example project as a basis. First clone the repository to a local directory.

```bash
git clone https://github.com/FormidableLabs/react-native-app-auth
```

Then inside of your project folder (`ReactNativeTypeScript`) install the required extra libraries.

```bash
npm install react-native-app-auth@4.0.0
react-native link react-native-app-auth
```

The last command links native code into your project.

```bash
npm install styled-components@4.1.1
```

This library is used in the example code. Now modify your `App.js` to what is inside of the example code at `Example/AndroidExample/App.js`, and copy the `assets` and `component` folders from the example into your project.

```bash
cp ../react-native-app-auth/Example/AndroidExample/App.js .
cp -r ../react-native-app-auth/Example/AndroidExample/assets .
cp -r ../react-native-app-auth/Example/AndroidExample/components .
```

Now add the following to the `defaultConfig` section of the `android` config in `android/app/build.gradle`, using the base of your **Redirect URL**, e.g. `com.oktapreview.dev-628819`.

```gradle
manifestPlaceholders = [
      appAuthRedirectScheme: '{redirectBase}'
]
```

Lastly, modify the `config` section of your `App.js` to include your Okta app information.

```javascript
const config = {
  issuer: 'https://{yourOktaDomain}'/oauth2/default,
  clientId: '{clientId}',
  redirectUrl: '{redirectUrl}’,
  additionalParameters: {prompt: 'login'},
  scopes: ['openid', 'profile', 'email', 'offline_access']
};
```

If you see `{yourOktaDomain}` as the issuer above, you can find this value on the Okta dashboard. If you don't see this variable, it's because this site is smart enough to fill it in for you. The values for **clientId** and **redirectUrl** you can get from your Okta app.

After running `react-native run-android` you should get the following.

{% img blog/react-native-testing/hello-stranger.png alt:"Hello, stranger" width:"232" %}{: .center-image }

Note: I got several errors about `unable to delete` on the console which I fixed by cleaning the android project:

```bash
cd android
gradlew clean
```

When you click on `Authorize` you should see a page detailing about the tokens being used for authentication.

{% img blog/react-native-testing/authorize-page.png alt:"Screen with access token and refresh token" width:"232" %}{: .center-image }

**TIP:** You can reload your app's code in the Android Emulator using **CTRL + M** (**Command + M** on Mac)..

## Port Your React Native App to TypeScript

One common way of using TypeScript in React Native is by using a tool like [react-native-typescript-transformer](https://github.com/ds300/react-native-typescript-transformer)
But in September of this year, Facebook released React Native 0.57 which includes Babel 7 that has TypeScript support, so you can use it out of the box. All you have to do is rename your `App.js` to `App.tsx` and React Native will pick up the changes.

```bash
mv App.js App.tsx
```

You also need to modify `App.tsx` and change the `State` variable to the following:

```ts
type State = {
  hasLoggedInOnce: boolean,
  accessToken?: string,
  accessTokenExpirationDate?: string,
  refreshToken?: string
};
```

The question marks were moved back to before the colon. This is how TypeScript identifies optional parameters (as opposed to Flow, which is what the `react-native init` command uses to set up a skeleton project).

Running the project again should start and operate as before.

```bash
react-native run-android
```

**NOTE:** If you get an error like `Module not registered in graph`, close down the packager window before re-running `run-android`.

## Test your React Native Application

The standard way of testing React Native is [using Jest](https://jestjs.io/docs/en/tutorial-react-native) and the [React Test Renderer](https://reactjs.org/docs/test-renderer.html), both of which come included in projects created with `react-native init`. However, you need to set things up to work with TypeScript.

First, move the contents of `.babelrc` into `babel.config.js` and then delete `.babelrc`.

```javascript
module.exports = {
  "presets": ["module:metro-react-native-babel-preset"]
};
```

Next, put the following into `jest.config.js`:

```javascript
const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  ...tsjPreset,
  preset: 'react-native',
  transform: {
    ...tsjPreset.transform,
    '\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
  },
  globals: {
    'ts-jest': {
      babelConfig: true,
    }
  },
  // This is the only part which you can keep
  // from the above linked tutorial's config:
  cacheDirectory: '.jest/cache',
};
```

Next, create a folder called `__tests__` and inside create a file called `Component-tests.js`:

```javascript
import Page from '../components/Page';
import Form from '../components/Form';
import Heading from '../components/Heading';

import React from 'react';
import renderer from 'react-test-renderer';

test('Page renders correctly', () => {
  const tree = renderer.create(<Page />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('Form renders correctly', () => {
  const tree = renderer.create(<Form />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('Heading renders correctly', () => {
  const tree = renderer.create(<Heading />).toJSON();
  expect(tree).toMatchSnapshot();
});
```

Here you are pulling in various components and checking that they render correctly. Now install `ts-jest` and `typescript`:

```bash
npm install -D ts-jest typescript
```

Create a folder called `src` and move `App.tsx` into it, modifying the components import so that it finds it correctly

```ts
import { Page, Button, ButtonContainer, Form, Heading } from '../components';
```

Also, change `index.js` in the root folder to import `./src/App`:

```javascript
/** @format */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

Now running `npm test` should check that the `Page`, `Form` and `Heading` components render correctly.

{% img blog/react-native-testing/console-test.png alt:"Output from running npm test" width:"590" %}{: .center-image }

In these tests, you are just checking whether certain components render correctly. Ideally, you’d want to check that authentication works using something like the [Detox end-to-end testing framework](https://github.com/wix/Detox). However, there is currently [an issue with the latest Android](https://github.com/wix/detox/issues/608). Hopefully, this will be fixed soon.

## React Native + TypeScript = Win!

Congrats! You’ve created a React Native app with TypeScript from scratch, with authentication and authorization (through Okta), and automated tests!

You can find the source code for this tutorial at <https://github.com/oktadeveloper/okta-react-native-typescript-example>.

If you’re interested to know more about TypeScript, React Native or secure user management with Okta, check out the following resources:

* [Use TypeScript to Build a Node API with Express](/blog/2018/11/15/node-express-typescript)
* [Build a Secure Notes App with Kotlin, Typescript, and Okta](/blog/2017/09/19/build-a-secure-notes-application-with-kotlin-typescript-and-okta)
* [Build a React Native App and Authentication with OAuth 2.0](/blog/2018/03/16/build-react-native-authentication-oauth-2)

Like what you learned today? Follow us [on Twitter](https://twitter.com/oktadev), like us [on Facebook](https://www.facebook.com/oktadevelopers/), check us out [on LinkedIn](https://www.linkedin.com/company/oktadev/), and [subscribe to our YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q). 
