---
layout: blog_post
title: "What is the OAuth 2.0 Implicit Grant Type?"
author: aaronpk
description: "The Implicit Grant Type is a way for a single-page JavaScript app to get an access token without an intermediate code exchange step. It was originally created for use by JavaScript apps (which don't have a way to safely store secrets) but is only recommended in specific situations."
tags: [oauth]
tweets:
- "What is the #oauth2 Implicit Grant Type? Read @aaronpk's article here:"
- "Ever wondered when you should use the #oauth2 Implicit Grant Type?"
- "What the heck is the OAuth Implicit Grant Type?"
- "Thinking about using the OAuth Implicit Grant Type? Read this first:"
---

The Implicit Grant Type is a way for a single-page JavaScript app to get an access token without an intermediate code exchange step. It was originally created for use by JavaScript apps (which don't have a way to safely store secrets) but is only recommended in specific situations.

This post is the second in a series where we explore frequently used OAuth 2.0 grant types. Previously we covered the [Authorization Code](/blog/2018/04/10/oauth-authorization-code-grant-type) grant type. If you want to back up a bit and learn more about OAuth 2.0 before we get started, check out [What the Heck is OAuth?](/blog/2017/06/21/what-the-heck-is-oauth), also on the Okta developer blog.

## What is an OAuth 2.0 Grant Type?

In OAuth 2.0, the term "grant type" refers to the way an application gets an access token. OAuth 2.0 defines several grant types, including the authorization code flow. OAuth 2.0 extensions can also define new grant types.

Each grant type is optimized for a particular use case, whether that's a web app, a native app, a device without the ability to launch a web browser, or server-to-server applications.

## The Implicit Grant

Like the [Authorization Code Grant Type](/blog/2018/04/10/oauth-authorization-code-grant-type), the Implicit Grant starts out by building a link and directing the user's browser to that URL. At a high level, the flow has the following steps:

* The application opens a browser to send the user to the OAuth server
* The user sees the authorization prompt and approves the app's request
* The user is redirected back to the application with an access token in the URL fragment

### Get the User's Permission

OAuth is all about enabling users to grant limited access to applications. The application first needs to decide which permissions it is requesting, then send the user to a browser to get their permission. To begin the Implicit flow, the application constructs a URL like the following and directs the browser to that URL.

```
https://authorization-server.com/auth
 ?response_type=token
 &client_id=29352910282374239857
 &redirect_uri=https%3A%2F%2Fexample-app.com%2Fcallback
 &scope=create+delete
 &state=xcoiv98y3md22vwsuye3kch
```

Here's each query parameter explained:

* **`response_type=token`** - This tells the authorization server that the application is initiating the Implicit flow. Note the difference from the Authorization Code flow where this value is set to `code`.
* `client_id` - The public identifier for the application, obtained when the developer first registered the application.
* `redirect_uri` - Tells the authorization server where to send the user back to after they approve the request.
* `scope` - One or more space-separated strings indicating which permissions the application is requesting. The specific OAuth API you're using will define the scopes that it supports.
* `state` - The application generates a random string and includes it in the request. It should then check that the same value is returned after the user authorizes the app. This is used to prevent CSRF attacks.

When the user visits this URL, the authorization server will present them with a prompt asking if they would like to authorize this application's request.

{% img blog/oauth-authorization-code-grant-type/oauth-prompt.png alt:"OAuth Prompt" width:"500" %}{: .center-image }

## Redirect Back to the Application

If the user approves the request, the authorization server will redirect the browser back to the `redirect_uri` specified by the application, adding a `token` and `state` to the fragment part of the URL.

For example, the user will be redirected back to a URL such as

```
https://example-app.com/redirect
  #access_token=g0ZGZmNj4mOWIjNTk2Pw1Tk4ZTYyZGI3
  &token_type=Bearer
  &expires_in=600
  &state=xcoVv98y2kd44vuqwye3kcq
```

Note the two major differences between this and the Authorization Code flow: the access token is returned instead of the temporary code, and both values are returned in the URL fragment (after the `#`) instead of in the query string. By doing this, the server ensures that the app will be able to access the value from the URL, but the browser won't send the access token in the HTTP request back to the server.

The state value will be the same value that the application initially set in the request. The application is expected to check that the state in the redirect matches the state it originally set. This protects against CSRF and other related attacks.

The server will also indicate the lifetime of the access token before it expires. This is usually a very short amount of time, along the lines of 5 to 10 minutes, because of the additional risk in returning the token in the URL itself.

This token is ready to go! There is no additional step before the app can start using it!

## When to use the Implicit Grant Type

In general, there are extremely limited circumstances in which it makes sense to use the Implicit grant type. The Implicit grant type was created for JavaScript apps while trying to also be easier to use than the Authorization Code grant. In practice, any benefit gained from the initial simplicity is lost in the other factors required to make this flow secure. When possible, JavaScript apps should use the Authorization Code grant without the client secret. However, the Okta Authorization Code grant requires the client secret, so we've taken a different approach noted below.

The main downside to the Implicit grant type is that the access token is returned in the URL directly, rather than being returned via a trusted back channel like in the [Authorization Code](/blog/2018/04/10/oauth-authorization-code-grant-type) flow. The access token itself will be logged in the browser's history, so most servers issue short-lived access tokens to mitigate the risk of the access token being leaked. Because there is no backchannel, the Implicit flow also does not return a refresh token. In order for the application to get a new access token when the short-lived one expires, the application has to either send the user back through the OAuth flow again, or use tricks such as hidden iframes, adding back complexity that the flow was originally created to avoid. On a positive note, the Okta JavaScript SDK handles this seamlessly by essentially providing a "heartbeat" to keep your access token alive.

One of the historical reasons that the Implicit flow used the URL fragment is that browsers could manipulate the fragment part of the URL without triggering a page reload. However, the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) now means that browsers can update the full path and query string of the URL without a page reload, so this is no longer an advantage of the Implicit flow.

The one remaining reason to use the Implicit flow is if the authorization server doesn't or can't support cross-origin requests (CORS). The Authorization Code grant requires that the JavaScript app make a POST request to the authorization server, so the authorization server will need to support the appropriate CORS headers in order to allow the browser to make that request. This is a relatively easy change to make if you're building your own authorization server, but if you are using an existing server then you may be stuck using the Implicit grant to get around the CORS limitation.

For more details and links to additional research and documentation of these limitations, check out the [Implicit Grant Type](https://oauth.net/2/grant-types/implicit/) on oauth.net.

### The Implicit Grant Type and OpenID Connect

While we haven't discussed OpenID Connect in this series yet, it's worth pointing out one important point with regards to how the Implicit grant relates to OpenID Connect. (For some more background on OpenID Connect, see [An OpenID Connect Primer](/blog/2017/07/25/oidc-primer-part-1) also on the Okta Developer blog.)

In OpenID Connect, the server returns an `id_token` in addition to the `access_token` in the URL fragment. This is considered an insecure channel to transmit this data, as it can easily be tampered with. Since OpenID Connect ID tokens contain claims such as user identity, this token's signature **must** be verified before it can be trusted. Otherwise, the user could change the data in the token and potentially impersonate other users in the JavaScript app. In contrast, when the app uses the Authorization Code grant to obtain the `id_token`, the token is sent over a secure HTTPS connection which provides a baseline level of security even if the token signature isn't validated.


## Learn More About OAuth and Okta

Try out a live demo of the Implicit grant type on the [OAuth Playground](https://www.oauth.com/playground/implicit.html)

You can learn more about OAuth 2.0 on [OAuth.net](https://oauth.net/2/grant-types/implicit/), or check out any of these resources to get started building!

* [Get Started with Spring Boot, OAuth 2.0, and Okta](/blog/2017/03/21/spring-boot-oauth)
* [Token Authentication in ASP.NET Core 2.0 - A Complete Guide](/blog/2018/03/23/token-authentication-aspnetcore-complete-guide)
* [Secure your SPA with Spring Boot and OAuth](/blog/2017/10/27/secure-spa-spring-boot-oauth)

Or hit up [Okta's OIDC/OAuth 2.0 API](/docs/api/resources/oidc) for specific information on how we support OAuth. And as always, follow us on Twitter [@oktadev](https://twitter.com/oktadev) for more great content.
