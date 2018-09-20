---
layout: blog_post
title: 'Build a Desktop App with Electron and Authentication'
author: mraible
description: "Learn how to build a desktop application using Electron and React, then add authentication with OIDC."
tags: [desktop, electron, javascript, appauth, appauthjs, authentication, oidc, oauth]
tweets:
- "Learn how to add user authentication to your desktop app (built with @electronjs) →"
- "Build a simple desktop app with Electron and use OIDC for authentication #electronjs #oidc #typescript"
- "Leverage OIDC and @okta to add authentication to your kick-ass desktop/@electronjs app!"
image: blog/electron-react-appauth-js/polished-matt.png
---

Electron is a framework for building cross-platform desktop applications with web technologies like JavaScript, HTML, and CSS. It was created for GitHub's Atom editor and has achieved widespread adoption since. Electron powers several apps that I use on a daily basis: Slack, Kitematic, and Visual Studio Code to name a few.

Electron 2.0 was released in early May 2018, along with changes to the project to adhere to strict semantic versioning. This is good news for developers because it means patch releases will be more stable and new features will come in major versions only. When open source projects use semantic versioning correctly, end users don't see breaking changes as often and tend to be productive.

Electron 3.0 was released on September 18, 2018 and contains major version bumps and some new features. See the [Electron blog](https://electronjs.org/blog/electron-3-0) for more information.

Developing desktop applications with web technologies is an appealing notion. [This tweet](https://twitter.com/gerardsans/status/1026040566868529152) from Gerard Sans nails it in my opinion:

<div style="max-width: 500px; margin: 0 auto">
<blockquote class="twitter-tweet" data-cards="hidden" data-lang="en"><p lang="en" dir="ltr">People always ask what&#39;s the best framework. What they should be asking is what skills they need to be productive using framework X? The issue is usually their lack of skills not which framework they use <a href="https://twitter.com/hashtag/angular?src=hash&amp;ref_src=twsrc%5Etfw">#angular</a> <a href="https://twitter.com/hashtag/reactjs?src=hash&amp;ref_src=twsrc%5Etfw">#reactjs</a> <a href="https://twitter.com/hashtag/vuejs?src=hash&amp;ref_src=twsrc%5Etfw">#vuejs</a> <a href="https://twitter.com/hashtag/javascript?src=hash&amp;ref_src=twsrc%5Etfw">#javascript</a> ✨🚀 <a href="https://t.co/8DWwM4PJoT">pic.twitter.com/8DWwM4PJoT</a></p>&mdash; ᐸGerardSans/ᐳ😉🇬🇧 (@gerardsans) <a href="https://twitter.com/gerardsans/status/1026040566868529152?ref_src=twsrc%5Etfw">August 5, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

Do you have web development skills? Great! You have what's needed to build a desktop app with Electron!

In this article, I'll show you how to create an [Electron](https://electronjs.org/) app with TypeScript, AppAuth-JS, and OpenID Connect (OIDC). You'll learn how to add authentication and secure an Electron app for your users.

## What is AppAuth?

[AppAuth](https://appauth.io/) is a project that aims to create client SDKs for native apps. It makes it possible to implement authentication and authorization in your apps using OIDC and OAuth 2.0. It has SDKs available for iOS, macOS, Android, and JavaScript environments. AppAuth-JS is the SDK for JavaScript clients. AppAuth also supports the [PKCE extension](https://developer.okta.com/authentication-guide/auth-overview/#authorization-code-with-pkce-flow) to OAuth to make public clients more secure.

Pretty much every application depends upon a secure identity management system. For most developers who are building Electron apps, there's a decision to be made between rolling your own authentication/authorization or plugging in a hosted identity service like Okta. 

## Build Desktop Apps with Electron

I'm going to make things easy for you. Rather than building an app from scratch, you'll use a pre-existing example. The AppAuth-JS project has two examples, a server-side example with Node at [src/node_app/index.ts](https://github.com/openid/AppAuth-JS/blob/master/src/node_app/index.ts), and an [appauth-js-electron-sample](https://github.com/googlesamples/appauth-js-electron-sample). Clone the Electron example to begin.

```bash
git clone https://github.com/googlesamples/appauth-js-electron-sample.git okta-electron-example
```

Open the `package.json` in this project and make the following changes.

```diff
@@ -6,8 +6,8 @@
   "scripts": {
     "compile": "tsc",
     "watch": "tsc --watch",
-    "start": "npm run-script compile && node_modules/.bin/electron .",
-    "dev": "npm run-script watch & node_modules/.bin/electron ."
+    "start": "npm run compile && npx electron .",
+    "dev": "npm run compile && npm run watch & npx electron ."
   },
   "files": [
     "built/**"
@@ -19,13 +19,13 @@
   "author": "rahulrav",
   "license": "MIT",
   "dependencies": {
-    "@openid/appauth": "^0.3.5",
+    "@openid/appauth": "^1.1.1",
     "@types/react": "^16.3.17",
     "@types/react-dom": "^16.0.6",
-    "electron": "^2.0.2",
     "material-design-lite": "^1.3.0"
   },
   "devDependencies": {
+    "electron": "^3.0.0",
     "typescript": "^2.9.1"
   }
 }
```

These changes are not necessary, but they will make things easier. The changes in "scripts" make it so compilation will happen before you run `npm run dev` or `npm start`. You're also moving the `electron` dependencies to be a `devDependency` and upgrading TypeScript to the latest version.

Navigate to the cloned directory, install dependencies with npm, and run the app.

```bash
cd okta-electron-example
npm i
npm run dev
```

It should start the app and show a Sign-In link.

{% img blog/electron-react-appauth-js/initial-load.png alt:"Electron App: initial load" width:"800" %}{: .center-image }


If you have a Google account, click **Sign-In**, log in, and you'll be redirected back to your app. You should see your avatar and name displayed.

{% img blog/electron-react-appauth-js/after-sign-in.png alt:"After Google Sign-In" width:"800" %}{: .center-image }


The diagram below shows how this authorization flow happens using OpenID Connect.

{% img blog/electron-react-appauth-js/oidc-flow.png alt:"OIDC Flow" width:"800" %}{: .center-image }

At this point, you can see that authentication with Google is working. In the next sections, I'll show you how to add PKCE support to make this app more secure, and how to use Okta instead of Google.

## Why Use Okta for Authentication?

You might be asking: why should I use Okta when authentication with Google works? The reason is simple; if you want to manage the users of your app (and you inevitably will), Okta makes it possible. With Google, anyone with a Google Account can log in, but you have no way of revoking access or updating user's permissions because you can't manage your users through Google. Okta lets you manage your users, as well as modify their attributes and permissions. Better yet, you can still use Google as a social login mechanism with Okta!

## Use Okta for Authentication with OIDC in Your Desktop App

Okta's goal is to make identity management a lot easier, more secure, and more scalable than what you're used to. Okta is a cloud service that allows developers to create, edit, and securely store user accounts and user account data, and connect them with one or multiple applications. Our API enables you to:

* [Authenticate](https://developer.okta.com/product/authentication/) and [authorize](https://developer.okta.com/product/authorization/) your users
* Store data about your users
* Perform password-based and [social login](https://developer.okta.com/authentication-guide/social-login/)
* Secure your application with [multi-factor authentication](https://developer.okta.com/use_cases/mfa/)
* And much more! Check out our [product documentation](https://developer.okta.com/documentation/)

Are you ready? [Register for a forever-free developer account](https://developer.okta.com/signup/) today! When you're finished, complete the steps below to create a Native OIDC app.

1. Log in to your developer account on [developer.okta.com](https://developer.okta.com).
2. Navigate to **Applications** and click on **Add Application**.
3. Select **Native** and click **Next**.
4. Give the application a name (e.g., `My Electron App`) and add `http://localhost:8000` as a Login redirect URI.
5. For Grant type allowed, select **Refresh Token** in addition to **Authorization Code**.
6. Click **Done**.

Now you can use your app settings to change from using Google to Okta. Modify `flow.ts` to use your Okta app's settings.

```ts
const openIdConnectUrl = 'https://{yourOktaDomain}/oauth2/default';
const clientId = '{yourClientId}';
const redirectUri = 'http://localhost:8000';
```

You'll also want to update `app.ts` to use your app's `/userinfo` endpoint.

```ts
let request =
    new Request('https://{yourOktaDomain}/oauth2/default/v1/userinfo', {
      headers: new Headers({'Authorization': `Bearer ${accessToken}`}),
      method: 'GET',
      cache: 'no-cache'
    });
```

If you restart your app and try to log in, it will fail because you're not using PKCE. You'll see an error like the following in your launched browser's address bar.

```
error=invalid_request&error_description=PKCE+code+challenge+is+required+when+the+token+endpoint+authentication+method+is+%27NONE%27.
```

## Add PKCE Support to Your Desktop App

PKCE (pronounced "pixy") is a security extension for OAuth 2.0 for public clients on mobile (and desktop) clients. It's designed to prevent interception of the authorization code by a malicious application that runs on the same device. 

```
    +~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~+
    | End Device (e.g., Smartphone)  |
    |                                |
    | +-------------+   +----------+ | (6) Access Token  +----------+
    | |Legitimate   |   | Malicious|<--------------------|          |
    | |OAuth 2.0 App|   | App      |-------------------->|          |
    | +-------------+   +----------+ | (5) Authorization |          |
    |        |    ^          ^       |        Grant      |          |
    |        |     \         |       |                   |          |
    |        |      \   (4)  |       |                   |          |
    |    (1) |       \  Authz|       |                   |          |
    |   Authz|        \ Code |       |                   |  Authz   |
    | Request|         \     |       |                   |  Server  |
    |        |          \    |       |                   |          |
    |        |           \   |       |                   |          |
    |        v            \  |       |                   |          |
    | +----------------------------+ |                   |          |
    | |                            | | (3) Authz Code    |          |
    | |     Operating System/      |<--------------------|          |
    | |         Browser            |-------------------->|          |
    | |                            | | (2) Authz Request |          |
    | +----------------------------+ |                   +----------+
    +~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~+
```

The PKCE working group provides an excellent explanation I've included below. You can read more in [the official RFC](https://tools.ietf.org/html/rfc7636).

"To mitigate this attack, PKCE uses a dynamically created cryptographically random key called a "code verifier". A unique code verifier is created for every authorization request, and its transformed value, called "code challenge", is sent to the authorization server to obtain the authorization code.  The authorization code obtained is then sent to the token endpoint with the "code verifier", and the server compares it with the previously received request code so that it can perform the proof of possession of the "code verifier" by the client.  This works as the mitigation since the attacker would not know this one-time key since it is sent over TLS and cannot be intercepted."

The diagram below shows how PKCE works with your app and Okta.

{% img oauth_auth_code_flow_pkce.png alt:"Auth Code Flow with PKCE" width:"800px" %}{: .center-image }

<!-- copied from _source/_authentication-guide/auth-overview/index.md -->

Now you'll add PKCE to your Electron app! In `flow.ts`, add a `challengePair` variable for PKCE as a member variable of the `AuthFlow` class.

```ts
private challengePair: { verifier: string, challenge: string };
```

Add a line at the end of the constructor to initialize this variable.

```ts
this.challengePair = AuthService.getPKCEChallengePair();
```

Create `pkce.ts` to define the `AuthService` class.

```ts
const crypto = require('crypto');

export class AuthService {

  static getPKCEChallengePair() {
    let verifier = AuthService.base64URLEncode(crypto.randomBytes(32));
    let challenge = AuthService.base64URLEncode(AuthService.sha256(verifier));
    return {verifier, challenge};
  }

  static base64URLEncode(str: Buffer) {
    return str.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  static sha256(buffer: string) : Buffer {
    return crypto.createHash('sha256').update(buffer).digest();
  }
}
```

Add an import for this class to `flow.ts`:

```ts
import { AuthService } from './pkce';
```

In the `makeAuthorizationRequest()` method, right after the `if (username) {}` logic, add the code challenge and method to the `extras` map.

```ts
// PKCE
extras['code_challenge'] = this.challengePair.challenge;
extras['code_challenge_method'] = 'S256';
```

In `makeRequestTokenRequest()`, add a `tokenRequestExtras` variable and send it in the request.

```ts
let tokenRequestExtras = { code_verifier: this.challengePair.verifier };

// use the code to make the token request.
let request = new TokenRequest(
  clientId,
  redirectUri,
  GRANT_TYPE_AUTHORIZATION_CODE,
  code,
  undefined,
  tokenRequestExtras
);
```

After making these changes, you should be able to log in. However, when you click on **USER INFO**, you won't see your user's name or avatar. Open Chrome Developer Tools with **View** > **Toggle Developer Tools** to see why.

{% img blog/electron-react-appauth-js/developer-tools.png alt:"Electron's Developer Tools" width:"800" %}{: .center-image }

To fix this issue, change the `scope` variable in `flow.ts` to include `profile`. While you're at it, add `offline_access` so your app can work without an internet connection.

```
const scope = 'openid profile offline_access';
```

Refresh your app (Command+R on Mac, Ctrl+R on Windows/Linux), and now you should see the name when clicking on **USER INFO**.

{% img blog/electron-react-appauth-js/userinfo-name.png alt:"Name from User Info Endpoint" width:"800" %}{: .center-image }

**NOTE:** I leveraged [these PKCE code samples](https://github.com/openid/AppAuth-JS/issues/28) to make all this work.

### Add an Avatar in Okta

You might notice that the user info endpoint doesn't return an avatar. The code in `app.ts` sets the avatar based on a `picture` attribute.

```ts
private updateUi() {
  this.handleSignIn.textContent = SIGN_OUT;
  this.fetchUserInfo.style.display = '';
  if (this.userInfo) {
    this.userProfileImage.src = `${this.userInfo.picture}?sz=96`;
    this.userName.textContent = this.userInfo.name;
    this.showSnackBar(
        {message: `Welcome ${this.userInfo.name}`, timeout: 4000});
    this.userCard.style.display = '';
  }
}
```

*You can delete `?sz=96` in the above code since this example doesn't use it.*

To add a `picture` attribute to your user, log in to your Okta dashboard and navigate to **Users** > **Profile Editor**. Click on the first "user" and add a `picture` attribute. Click **Save**.

{% img blog/electron-react-appauth-js/add-attribute.png alt:"Add Picture Attribute" width:"650" %}{: .center-image }

Navigate back to the Profile Editor and click on **Mappings** for your Electron App. Create a mapping from `user.picture` to `picture` and select to apply the mapping on user create and update. Click **Save Mapping** and **Apply Updates Now**.

{% img blog/electron-react-appauth-js/add-mapping.png alt:"Add Picture Mapping" width:"800" %}{: .center-image }

Now go to **Users** > **People**, select a user, navigate to the **Profile** tab, and click **Edit**. Add a value for `picture` at the bottom. For example, you can use the URL of our Okta Developer logo.

```
https://www.okta.com/sites/all/themes/Okta/images/logos/developer/Dev_Logo-02_Large.png
```

Now if you click on the user info link, you should see an avatar associated with your user.

{% img blog/electron-react-appauth-js/userinfo-picture.png alt:"User Info Picture" width:"800" %}{: .center-image }

**TIP:** If you're going to use this in production, I'd recommend you use a smaller image for the picture (e.g., with 150x150 dimensions). You can also [base64 encode](https://www.base64-image.de/) an image and use its value for your picture.

Below is a screenshot that shows this app with some additional polish and a base64 image value for my account.

{% img blog/electron-react-appauth-js/polished-matt.png alt:"Polished Matt" width:"800" %}{: .center-image }

## Package Your Desktop App For Production

To package this app for production distribution, you can use [electron-builder](https://www.electron.build/). Install electron-builder with npm.

```bash
npm i -D electron-builder@20.28.4
```

Add a `build` section to your `package.json`:

```json
"build": {
  "appId": "com.okta.developer.electron",
  "productName": "Electron Awesomeness",
  "mac": {
    "category": "public.app-category.developer-tools"
  }
}
```

Then add `pack`, `dist`, and `postinstall` scripts.

```json
"scripts": {
  ...
  "pack": "npm run compile && electron-builder --dir",
  "dist": "npm run compile && electron-builder",
  "postinstall": "electron-builder install-app-deps"
}
```

To package your app for production, use the following commands:

* `npm run pack` will generate the package directory without really packaging it. This is useful for testing purposes.
* `npm run dist` will package in a distributable format (e.g., dmg, Windows installer, deb package).

**NOTE:** If the app doesn't start after packaging, it's likely because you don't have [code signing](https://www.electron.build/code-signing) configured. To disable Code Signing when building for macOS, run `export CSC_IDENTITY_AUTO_DISCOVERY=false`. If you have an Apple Developer Account, open Xcode, go to **Preferences** > **Accounts** and make sure you're logged in, and your development certificates are downloaded.

## Electron Example App Source Code

You can find the source code for this article at [https://github.com/oktadeveloper/okta-appauth-js-electron-example](https://github.com/oktadeveloper/okta-appauth-js-electron-example).

I made some minor adjustments (e.g., optimizing imports, changing double quotes to single quotes), but nothing major. To see a diff between this project and the original, [click here](https://github.com/googlesamples/appauth-js-electron-sample/compare/master...oktadeveloper:master).

## Learn More About Electron, AppAuth, and OIDC

There you have it! Go forth and use your web skills to create amazing desktop applications!

To learn more about Electron, AppAuth, React, and OIDC, check out the following resources:

* [Writing Your First Electron App](https://electronjs.org/docs/tutorial/first-app)
* [Build a Basic CRUD App in Android with Kotlin](/blog/2018/09/11/android-kotlin-crud)
* [Build a Health Tracking App with React, GraphQL, and User Authentication](/blog/2018/07/11/build-react-graphql-api-user-authentication)
* [Identity, Claims, & Tokens – An OpenID Connect Primer, Part 1 of 3](/blog/2017/07/25/oidc-primer-part-1)

Got questions? Please leave a comment below, [ping me on Twitter](https://twitter.com/mraible), or ask it on our [Developer Forums](https://devforum.okta.com/).

Like what you learned here? Follow [@oktadev](https://twitter.com/oktadev), like us [on Facebook](https://www.facebook.com/oktadevelopers/), follow us [on LinkedIn](https://www.linkedin.com/company/oktadev/), or [watch our videos on YouTube](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q).

**Changelog:**

* Sep 19, 2018: Updated to use Electron 3.0.0 and AppAuth 1.1.1. See the example app changes in [okta-appauth-js-electron-example#1](https://github.com/oktadeveloper/okta-appauth-js-electron-example/pull/1); changes to this post can be viewed in [okta.github.io#2327](https://github.com/okta/okta.github.io/pull/2327).