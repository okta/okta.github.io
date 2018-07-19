---
layout: blog_post
title: "What is the OAuth 2.0 Password Grant Type?"
author: aaronpk
description: "The Password Grant Type is a way to get an OAuth access token given a username and password."
tags: [oauth]
tweets:
- "What is the #oauth2 Password Grant Type? Read @aaronpk's article here:"
- "Ever wondered what the #oauth2 Password Grant Type is for? We've got you covered."
- "What the heck is the OAuth Password Grant Type?"
- "Thinking about using the OAuth Password Grant Type? Read this first:"
---

The OAuth 2.0 Password Grant Type is a way to get an access token given a username and password. It's typically used only by a service's own mobile apps and is not usually made available to third party developers.

This post is the third in a series where we explore frequently used OAuth 2.0 grant types. Previously we covered the [Authorization Code](/blog/2018/04/10/oauth-authorization-code-grant-type) and [Implicit](/blog/2018/05/24/what-is-the-oauth2-implicit-grant-type) grant type. If you want to back up a bit and learn more about OAuth 2.0 before we get started, check out [What the Heck is OAuth?](/blog/2017/06/21/what-the-heck-is-oauth).

## What is an OAuth 2.0 Grant Type?

In OAuth 2.0, the term "grant type" refers to the way an application gets an access token. OAuth 2.0 defines several grant types, including the Password grant. OAuth 2.0 extensions can also define new grant types.

Each grant type is designed for a particular use case, whether that's a web app, a mobile or desktop app, or server-to-server applications.

## The OAuth 2.0 Password Grant

The Password grant is one of the simplest OAuth grants and involves only one step: the application presents a traditional username and password login form to collect the user's credentials and makes a POST request to the server to exchange the password for an access token. The POST request that the application makes looks like the example below.

```http
POST /oauth/token HTTP/1.1
Host: authorization-server.com
Content-type: application/x-www-form-urlencoded

grant_type=password
&username=exampleuser
&password=1234luggage
&client_id=xxxxxxxxxx
```

The POST parameters in this request are explained below.

* `grant_type=password` - This tells the server we're using the Password grant type
* `username=` - The user's username that they entered in the application
* `password=` - The user's password that they entered in the application
* `client_id=` - The public identifier of the application that the developer obtained during registration
* `client_secret=` - (optional) - If the application is a "confidential client" (not a mobile or JavaScript app), then the secret is included as well.
* `scope=` - (optional) - If the application is requesting a token with limited scope, it should provide the requested scopes here.

The server replies with an access token in the same format as the other grant types.

```json
{
  "access_token": "MTQ0NjOkZmQ5OTM5NDE9ZTZjNGZmZjI3",
  "token_type": "bearer",
  "expires_in": 3600,
  "scope": "create"
}
```

## When to use the Password Grant Type?

The Password grant requires that the application collect the user's password. This is of course the exact problem that OAuth was created to avoid in the first place. So why is the Password grant included as part of OAuth?

While a service should never let a third party developer use the Password grant, it is quite reasonable for a service's own application to ask the user to enter their password. For example, if you download Twitter's mobile app, you wouldn't be surprised if the first thing it does when you launch is ask for your Twitter password. In contrast, if you download a third-party Gmail app, it should use Google's OAuth server rather than ask you to enter your Gmail password.

The benefit of this grant type is that it lets the application take advantage of the rest of the benefits that OAuth provides around access tokens and token lifetimes. Instead of storing the user's password on the device, the application only has to touch the user's password for as long as it takes to get the access token, then it can store and use the access token instead.

## Learn More About OAuth and Okta

You can learn more about OAuth 2.0 on [OAuth.com](https://www.oauth.com/oauth2-servers/access-tokens/password-grant/), or check out any of these resources to get started building!

* [What is the OAuth 2.0 Authorization Code Grant Type?](/blog/2018/04/10/oauth-authorization-code-grant-type)
* [Token Authentication in ASP.NET Core 2.0 - A Complete Guide](/blog/2018/03/23/token-authentication-aspnetcore-complete-guide)
* [Secure your SPA with Spring Boot and OAuth](/blog/2017/10/27/secure-spa-spring-boot-oauth)
* [Build Secure Node Authentication with Passport.js and OpenID Connect](/blog/2018/05/18/node-authentication-with-passport-and-oidc)

Check out [Okta's OIDC/OAuth 2.0 API](/docs/api/resources/oidc) for specific information on how we support OAuth. And as always, follow us on Twitter [@oktadev](https://twitter.com/oktadev) for more great content.
