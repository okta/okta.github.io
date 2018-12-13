---
layout: blog_post
title: "OAuth 2.0 for Native and Mobile Apps"
author: dogeared
description: "Native and Mobile apps have special requirements for using OAuth 2.0"
tags: [oauth, oauth2, learning, programming, programming languages, education]
tweets:
- "Every wonder what the special sauce for auth with native and mobile apps is? (It's OAuth and PKCE)"
- "Dig into OAuth 2.0 for Native and Mobile Apps."
- "Ever hear of PKCE? You'll want to if you need to secure the native or mobile app your building!"
image: blog/featured/okta-node-tile-books-mouse.jpg
---
:page-liquid:


# OAuth 2.0 for Native and Mobile Apps
These days, when you hear someone talking about OAuth, it is likely they mean OAuth 2.0. Previous versions of the standard are deprecated.

OAuth is an authorization framework that enables you to work with external systems in a secure way using digital identifiers called tokens. One type of token is called an `access_token`. Its function is to allow you to exercise APIs securely. The API service can use the `access_token` to determine if you’re allowed to do what you are trying to do.

Obtaining a token is accomplished by working through a process called a flow. That refers to simply the steps taken to obtain a token. The [OAuth 2.0](https://oauth.net/2/) specification formalizes a number of these flows. Different flows are used in different contexts.

At this point, we need to talk about trusted and untrusted applications. A trusted app is one that runs in an environment that you have complete control over. An example of this is an application server running in your data center. You have a firewall in place. You can update the OS version of the machine (virtual or physical). An untrusted app is everything else. This includes web apps, native desktop apps and mobile apps.

For more information on OAuth and its history, check out this video on [OAuth and OpenID Connect in Plain English](https://youtu.be/996OiexHze0).

### OAuth Glossary

| OAuth Term           | Definition                                                                                                                                              |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| Authorization Server | The entity responsible for issuing tokens (like Okta)                                                                                                   |
| Client Application   | The application that will (a) obtain an access token from the authorization server and (b) use the access token to call an API from the Resource Server |
| Resource Owner       | The end user interacting with the Client Application (like you, sitting in front of your browser)                                                       |
| Resource Server      | The entity that has an API and can validate incoming access tokens                                                                                      |

| OAuth Flow                   | Good for                                                                   |
|------------------------------|----------------------------------------------------------------------------|
| Implicit                     | Untrusted SPA apps (like Angular or Vue.js)                                |
| Authorization Code with PKCE | Untrusted Native or Mobile apps. PKCE = proof key code exchange            |
| Authorization Code           | Trusted apps (like Spring Boot or .NET)                                    |
| Client Credentials           | Trusted batch or automated apps without a Resource Owner (like a cron job) |
| Resource Owner Password      | Trusted web apps with custom login page                                    |

The Resource Owner Password flow has fallen out of favor due to the fact that the app (like Spring Boot or .NET) has to collect the user’s password. With the Authorization Code flow, only the Authorization Server (like Okta) sees the password. 

While the Client Credentials flow is perfectly valid and often used, it’s outside the scope of this post. It’s used for automated processes where there is no user interaction.

The Authorization Code flow is meant for applications that have a browser component and a middleware component, like a Spring Boot application. This flow takes advantage of the redirect features built into the HTTP protocol that are automatically acted upon by your browser. When you first start the flow, you are redirected to an Authorization Server to authenticate. This is typically an external service provider, like Okta, that you trust to handle credentials securely. Assuming that authentication is successful, the authorization server  will redirect back to your app (via the browser) with an `authorization code` in the URL. Your middleware application can use that code in conjunction with configuration information it’s stored called a client ID and a client secret to request tokens. We’ll see this in more detail below when we examine the variation of this flow: Authorization Code with PKCE.

For rest of this post, we are going to focus on the Implicit and Authorization Code with PKCE flows.

The Implicit flow is typically used with SPA apps (untrusted) and returns a token directly to the browser. The Authorization Code with PKCE flow is typically used with native and mobile apps and returns tokens to this apps in a two part request flow.

## Why Not Implicit Flow?

Take a look at this sequence diagram representing the Implicit Flow:

![implicit](https://github.com/oktadeveloper/pkce-cli/raw/master/implicit.png)

For now, we are leaving off doing anything with the token that we get. We’ll get to that later.

For the purpose of demonstration, the above diagram has a vue.js app as the Client App. The Authorization Server is Okta. Let’s take a look at what’s going on in this flow.

1. You access the app in your browser and click it’s login button
2. The app responds with a redirect to the browser
3. The browser follows the redirect to Okta
4. Okta returns a hosted login form
5. You submit your username and password directly to Okta
6. Okta authenticates you and sends a redirect with a token in the URL
7. The browser follows the redirect to your vue.js, which parses the token out of the URL

This has been a solid approach for SPA apps. It’s a flow that gets your app a token in an untrusted environment without revealing any secrets. But it’s always had a dirty little secret (from a security perspective). Notice steps 6 and 7 above involve a redirect back to the vue.js app in the browser. Redirects are HTTP GETs. **As such, your only opportunity to get a token back to the app is to include it in the URL.** This is problematic from a security standpoint since the token is now sitting there in the browser history. It’s especially problematic if the token is long lived. A security professional would tell you that you’ve just increased the attack surface area. An example of why this is a problem is that many people sync their browser history across multiple devices further expanding the attack surface.

You can see the beginning of a token in the browser history pictured below:

{% img blog/oauth-2-for-native-and-mobile-apps/browser_history.png alt:"browser history" width:"800" %}{: .center-image }

## Authorization Code with PKCE Flow

Take a look at this sequence diagram representing the Authorization Code with PKCE flow:

![pkce](https://github.com/oktadeveloper/pkce-cli/raw/master/pkce.png)

1. You access the app in your browser and click it’s login button. The app creates a random value we’ll call: `v`. It hashes this value to get a result we’ll call: `$`
2. The app responds with a redirect to the browser including the hashed value `$`
3. The browser follows the redirect to Okta
4. Okta stores the hashed value `$` for later and returns a hosted login form
5. You submit your username and password directly to Okta.
6. Okta authenticates you and sends a redirect with a short lived code we’ll call: `α`
7. The browser follows the redirect to your vue.js, which extracts the code `α` from the url
8. The vue.js app makes a POST request to Okta with: a Client ID, the original random value is generated at the beginning of the flow `v`, and the temporary code `α`. Okta validates the client ID, generates a hash of the value `v` and compares that hash to the `$` hash it stored earlier in the flow and validates the value `α`.
9. Okta responds to the POST request with a token directly to the vue.js app

There’s a lot to unpack here, so let’s get to it!

The most important difference here is that the only value being stored in browser history is the one-time use temporary authorization code: `α`. The tokens themselves are never passed through a URL. That’s because the last leg of the flow (steps 8 & 9) is a POST request and response.

As for the random value `v` and its hash `$`: it’s all about guarding against a rogue app trying to “listen” for the authorization code response and attempt to use it to get a token. This is more of an issue in the mobile app world (which is where this flow is primarily used). On a mobile platform like iOS or Android, you could have a malicious app listening for a response from the first part of the flow (steps 6 & 7). Only the legitimate app will be able to pass the proper value for `v` to Okta (since it created it) and Okta can verify that it’s correct based on the hashed value `$` it stored earlier. This is the heart of the Proof Key Code Exchange.

The authorization code flow with PKCE has traditionally been used for native and mobile apps. Both of these kinds of apps are untrusted apps that can operate both within the context of a browser (often embedded) and can make back channel HTTP calls directly.

There’s an emerging recommendation in the OAuth community to favor this flow over the Implicit flow as it’s inherently more secure. The [OAuth 2.0 Security Best Practice](https://tools.ietf.org/html/draft-ietf-oauth-security-topics#section-2.1.2) document recommends against using the Implicit flow. There’s a good post called [Why you should stop using the OAuth implicit grant!](https://medium.com/oauth-2/why-you-should-stop-using-the-oauth-implicit-grant-2436ced1c926) as well.
## Demo Time: Authorization Code with PKCE Flow in Action
Okta supports the Auth Code with PKCE Flow for native and mobile apps. You can find the code example for this post here: [https://github.com/oktadeveloper/pkce-cli](https://github.com/oktadeveloper/pkce-cli).

This is a [Node.js](https://nodejs.org) native app that runs from the command line. I wanted to keep this example as lean as possible so we could really see the mechanism of the flow in action. As such, it only has 4 dependencies: `commander` for parsing command line switches, `opn` for a platform-independent way to launch a browser from the command line, `request` to make HTTP requests and `restify` to provide a RESTful API endpoint to listen on.

The [AppAuthJS](https://github.com/openid/AppAuth-JS) library is a high quality Javascript library that supports the Auth Code with PKCE Flow and hides away a lot of the details of what’s happening during the flow.

### Add Okta for User Management

Head on over to [https://developer.okta.com](https://developer.okta.com) and create yourself a developer account.

Once you log in to your admin console, it’s time to create an app in Okta. Browse to `Applications`. Click `Add Application`. Choose `Native`:

{% img blog/oauth-2-for-native-and-mobile-apps/create_native_app.png alt:"native app" width:"800" %}{: .center-image }

Click `Next`.

Update the value for `Login redirect URIs` to: `http://localhost:8080/redirect`

{% img blog/oauth-2-for-native-and-mobile-apps/create_native_app_2.png alt:"native app 2" width:"800" %}{: .center-image }

Click `Done`.

Copy the `Client ID` value from the `Client Credentials` section (toward the bottom) of the app summary page.

{% img blog/oauth-2-for-native-and-mobile-apps/client_credentials.png alt:"native app 2" width:"800" %}{: .center-image }

### Watch PKCE Go

To run the app, do the following:

```
cd pkce-cli
npm install
./pkce-cli \
  --okta_org https://{yourOktaOrg}.oktapreview.com \
  --client_id {yourClientId}
```

(You substitute in the values for your Okta org that you captured above)

Note: Since there’s an async part of the flow - that is, waiting for you to authenticate to Okta, the app pauses its processing until you close the browser tab that you authenticated on.

Here’s an example of the output you’ll see:

```
Created Code Verifier (v): 0abb_599e_abd9_861b_4528_de1e_9b7a_91ad_5e20_a78b_06fd

Created Code Challenge ($): vryNjQB0ewud6-XDnp8W8XQM3EvARHsFrgiKp-ywRXg

Calling Authorize URL: https://micah.oktapreview.com/oauth2/v1/authorize?client_id=0oahdifc72URh7rUV0h7&response_type=code&scope=openid profile email&redirect_uri=http://localhost:8080/redirect&state=5202_59c2_a6a3_4d43_d880_edff_70b3_d5b3_21d5_0688_b9cd&code_challenge_method=S256&code_challenge=vryNjQB0ewud6-XDnp8W8XQM3EvARHsFrgiKp-ywRXg

Got code (α): 7hJ0VfKvqzLbl3Ar1-fW

Calling /token endpoint with:
client_id: 0oahdifc72URh7rUV0h7
code_verifier (v): 0abb_599e_abd9_861b_4528_de1e_9b7a_91ad_5e20_a78b_06fd
code (α): 7hJ0VfKvqzLbl3Ar1-fW

Here is the complete form post that will be sent to the /token endpoint:
{ grant_type: 'authorization_code',
  redirect_uri: 'http://localhost:8080/redirect',
  client_id: '0oahdifc72URh7rUV0h7',
  code: '7hJ0VfKvqzLbl3Ar1-fW',
  code_verifier: '0abb_599e_abd9_861b_4528_de1e_9b7a_91ad_5e20_a78b_06fd' }

Got token response:
{ access_token: 'eyJraWQiOiItVV92MHBJVGx5X0V3MTJfTzZuT1lWb081ZVBucm1Iek9wbkxfS2FHN0lzIiwiYWxnIjoiUlMyNTYifQ...',
  token_type: 'Bearer',
  expires_in: 3600,
  scope: 'openid profile email',
  id_token: 'eyJraWQiOiJUcGwtaVowcHhtQWpZb05ISlVSLUtjWkdCMGdUTWFUYkd1clQwd19GMXgwIiwiYWxnIjoiUlMyNTYifQ...' }

Calling /userinfo endpoint with access token

{ sub: '00udo3balxNhwKdSL0h7',
  name: 'Micah Silverman',
  profile: 'https://www.facebook.com/app_scoped_user_id/10156159259014459/',
  locale: 'en-US',
  email: 'micah@afitnerd.com',
  preferred_username: 'micah@afitnerd.com',
  given_name: 'Micah',
  family_name: 'Silverman',
  zoneinfo: 'America/Los_Angeles',
  updated_at: 1541796005,
  email_verified: true }
```

The random value `v` is called the `code verifier`. The hashed value `$` is called the `code challenge`.

The app constructs a call to the `/authorize` endpoint with a query string that includes the `client id`, `code challenge` and `redirect uri`. It then launches a browser tab to the `/authorize` endpoint. It’s here that you will authenticate to Okta. Okta then redirects to the supplied value (http://localhost:8080/redirect) and includes the temporary code `α` in the url.

The Node.js listens for the response from Okta, extracts the code `α` and then prepares a POST to the `/token` endpoint including the `code` and the `code verifier`. Okta validate the `client id` and the `code` as well as hashing the `code verifier` so it can compare it to the `code challenge` it saved earlier.

Okta responds with tokens including an `access token`.

Finally, the app uses the `access token` to make a call to the protected `/userinfo` endpoint. Okta validates the `access token` and returns the identity information for the user the token represents.
## OAuth, SPA Apps, and What’s Next
Hockey legend Wayne Gretzky famously attributed his success to focusing not on where the puck has been, but where it is going.

The Auth Code with PKCE Flow will replace the Implicit Flow over time. This will strengthen SPA apps by reducing the surface area of attack.

There are considerations for SPA apps that aren’t there for native and mobile apps. Mobile apps, for instance, will initiate the flow using an embedded browser to the `/authorization` endpoint. The app will complete the flow using a direct back-channel connection to the `/token` endpoint. In a SPA app, both parts of the flow need to happen from the browser. Dealing with XSS (cross site scripting) and CSRF (cross site request forgery) attacks is an important browser consideration for the `/token` endpoint.

For now, you can see PKCE in action using the [pkce-clie](https://github.com/oktadeveloper/pkce-cli) app.

Here are some other blog posts you might like on the topic of SPAs, native and mobile apps:

* [Build a CRUD-y SPA with Node and Angular](https://developer.okta.com/blog/2018/08/07/node-angular-crud)
* [Secure your SPA with Spring Boot and OAuth](https://developer.okta.com/blog/2017/10/27/secure-spa-spring-boot-oauth)
* [Build a React Native Application and Authenticate with OAuth 2.0](https://developer.okta.com/blog/2018/03/16/build-react-native-authentication-oauth-2)
* [Build a Mobile App with React Native and Spring Boot](https://developer.okta.com/blog/2018/10/10/react-native-spring-boot-mobile-app)
* [Add Authentication to Your Xamarin App with OpenID Connect](https://developer.okta.com/blog/2018/05/01/add-authentication-xamarin-openid-connect)

For more developer advice, follow [@oktadev](https://twitter.com/oktadev) on Twitter, like us [on Facebook](https://www.facebook.com/oktadevelopers/), or subscribe to [our YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q).
