---
layout: blog_post
title: ""
author: dogeared
description: ""
tags: [ oauth, security, oidc, spring boot, spring security, webhooks, hooks ]
tweets:
- ""
- ""
- ""
image: blog/featured/okta-java-short-skew.jpg
---

-- openid connect & oauth, Okta, hooks --

## Three Minute Overview of OpenID Connect and OAuth 2.0

In the beginning there were siloed web sites that didn't talk to each other, and it was sad.

Sites like Yelp started wanting access to the contact information you had in your Google Contacts. So, Yelp naturally collected your Google username and password so that it could access your contacts. You gave Yelp your permission, so this was all good, Yes? No! With your username and password, Yelp could access your email, your docs - everything you had in Google - not just your contacts. And, worse, Yelp had to store your password in a way that it could use it in plaintext and there was no standard way to revoke your consent to Yelp to access your Google account.

We needed an authorization framework that would allow you to grant access to certain information without you giving up your password. Cue OAuth.

Three revisions later, we're at OAuth 2.0 (there was 1.0 and 1.0a before it) and all's right with the world. Now, an application like Yelp (a `Client Application`) can request an `Access Token` from a service like Google (an `Authorization Server`). You (the `Resource Owner`) log into Google with your credentials and give your `Consent` to Yelp to access your contacts (and only your contacts). `Access Token` in hand, Yelp makes a request of the Google Contacts API (the `Resource Server`) and gets your contacts. Yelp never sees your password and never has access to anything more than you've consented to. And, you can withdraw your consent at any time.

In this new world of consent and authorization, only one thing was missing: identity. Cue OpenID Connect. OIDC is a thin layer on top of OAuth 2.0 that introduces a new type of token: the Identity Token. Encoded within these cryptographically signed tokens in [JWT](https://developer.okta.com/docs/api/resources/oidc#access-token) format, is information about the authenticated user. This opened the door to a new level of interoperability and Single SignOn.

OAuth (and by extension OIDC) use a number of defined `Flows` to manage the interactions between the `Client App`, the `Authorization Server` and the `Resource Server`. In this post, you'll focus on the `Authorization Code Flow`. This flow is meant to be kicked off from your browser and goes like this:

1. Yelp wants access to your contacts. It presents a button to link your Google Contacts.
2. When you click the button, you're redirected to Google where you login with your username and password (if you're not already logged in).
3. Google shows you a screen telling you that Yelp would like read-only access to your contacts.
4. Once you give your consent, Google redirects back to Yelp, via your browser, with a temporary code (called an authorization code)
5. Using this code, Yelp contacts Google to trade it for an Access Token
6. Google validates the code and if all checks out, issues an Access Token with limited capabilities (read-only access to your contacts) to Yelp
7. Yelp then presents the Access Token to the Google Contacts API
8. Google Contacts API validates the token and, if the request matches the capabilities identified by the token, returns your contact list to Yelp

## Set Up Your Okta Org for OIDC & OAuth 2.0

## Set Up Inline Token Hooks

## Get Your Favorite Beers Patched into Your ID Token

## Learn More About Secure Single Sign-on, OAuth 2.0, and Spring Boot

The Okta Spring Boot Starter enables you to integrate your Spring Boot apps with Okta with just a few lines of code and three configuration properties.

Along with our Spring Boot Starter, Okta's OpenID Connect service not only conforms to the standard, but gives you a sophisticated Single Sign-On experience where the same user can access many different OIDC applications, each with their own set of requirements and configuration. Remember: OIDC rides on top of OAuth 2.0 - it's not standalone. Whereas OAuth focuses exclusively on authorization, OIDC explicitly adds identity and authentication concerns.

If you'd like to learn more about OAuth and Spring Boot you might be interested in these other posts:

* [Secure Server-to-Server Communication with Spring Boot and OAuth 2.0](https://developer.okta.com/blog/2018/04/02/client-creds-with-spring-boot)
* [OAuth 2.0 for Native and Mobile Apps ](https://developer.okta.com/blog/2018/12/13/oauth-2-for-native-and-mobile-apps)
* [Is the OAuth 2.0 Implicit Flow Dead?](https://developer.okta.com/blog/2019/05/01/is-the-oauth-implicit-flow-dead)


Like what you learned today? Follow us on [Twitter](https://twitter.com/oktadev), and subscribe to our [YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q) for more awesome content!