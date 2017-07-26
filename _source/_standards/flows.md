---
layout: docs_page
title: OAuth 2.0 and OIDC Flows
weight: 3
---
# Okta OAuth 2.0 and OIDC Flows

You're writing software to create an app or service that needs to access a protected resource. An API endpoint guards the resource. The resource owner (typically the end user of your app) might have a username and password for accessing the resource but is understandably reluctant to give them to you because

 * Malicious actors might get their hands on them.
 * The user can't place limits on what you can do with them.

## OAuth 2.0 and OIDC

 OAuth 2.0 was developed to enable users to allow apps like yours to access their protected resources without giving out their passwords. It relies on an independent Authorization Server to do the following:

* Authenticate the user.
* Determine what the user is willing to allow your app to do with the protected resource.
* Provide an Access Token that your app can present to the API that guards the resource.

In addition, because the Authorization Server probably stores a lot of information about each user, your app can also ask it for an ID Token, an encoded list of information (for example, name, email address) about the end user. The framework also provides for Refresh Tokens, a means of obtaining new access tokens without reauthenticating the user. For simplicity, this discussion mentions Refresh Tokens only where it's important to do so.

The [OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749) specifies different ways to request and transmit Access Tokens. [OpenID Connect](http://openid.net/connect/) is an extensible identity layer on top of OAuth 2.0. It defines the ways to request and transmit ID Tokens. API Access Management is Okta's implementation of OAuth 2.0. This document focuses on the ways your application can use API Access Management and OIDC Connect to securely authenticate users, authorize access to protected resources, and handle users' personal information.

## Security

The justification for using OAuth 2.0 and OIDC is the increased security they provide against unauthorized access to resources and personal information.

In the most common case, your app is running somewhere on the web, and your end user uses a browser to communicate with you. The Okta Authorization Server is running somewhere else on the web. Your app has registered itself with Okta, making it possible for the Authorization Server to ensure that attempts to impersonate your app fail.

When your app needs to access one of the user's protected resources (for example, to tweet in the user's name), the following steps happen:

1. Your app arranges for the user to interact directly with the Authorization Server. Your app redirects the user's browser to a specified endpoint on the Authorization Server and includes information (parameters) in the URL about what your app wants to do. At this point your app cannot see what goes on between the user and the Authorization Server, so there is no danger that your app will see the user's username and password while the Authorization Server is authenticating the user.

2. The Authorization Server redirects the user's browser to a URL that you provided when you registered your app with Okta. The Authorization Server appends an access code to the URL. The access code contains encoded information, so even if someone manages to see it, they can't use it.

3. Your app connects to an Authorization Server endpoint to exchange the access code for an Access Token. This is a direct interaction that the user's browser has no access to.  The Authorization Server recognizes the access code that it just issued, and it recognizes your app as the one that initiated the request, ensuring that it does not issue an Access Token to software trying to impersonate your app.

4. Your app presents the Access Token to the API guarding the resource. This API may know nothing about your app, but it trusts the Authorization Server that issued the Access Token. It can understand the Access Token, which is opaque to anyone else who sees it. It can decide how much of the requested access to provide.

When your App needs personal information about the user, it can also ask for an ID Token when it asks for the Access Token. This is a direct connection between your app and the Authorization Server. The ID Token is encoded, so it is opaque to others. Your app can decode it and must validate its contents before extracting personal information from it. Once your app has extracted the personal information from the ID Token it must protect it as it would protect personal information gathered any other way.

## Authorization Flows

The preceding sequence of steps describes the most common way of obtaining tokens. The framework provides other possible sequences, called flows. The choice of flow depends on your execution environment and security needs. The basic OAuth 2.0 flows are:

  * Authorization Code -- your app receives an authorization code that it can exchange for an Access Token.
  * Implicit -- the user authorizes the Authorization Server to send an Access Token directly to your app.
  * Resource Owner Password -- Your app submits the user's credentials to the Authorization Server to obtain an Access Token.
  * Client Credentials -- Your app submits its own credentials to the Authorization Server to obtain an Access Token.

 The OpenID Connect flows use the OAuth 2.0 flows to enable your app to receive ID Tokens as well as Access Tokens and Refresh Tokens. In addition, OpenID Connect specifies a Hybrid flow. It combines aspects of the Authorization Code and Implicit flows.

With API Access Management and Okta's implementation of OIDC Connect, the Authorization Code, Implicit, and Hybrid flows begin with requests to the [`/authorize` endpoint](/docs/api/resources/oauth2.html#obtain-an-authorization-grant-from-a-user). The `response_type` request parameter determines which flow your app uses.

The Resource Owner Password and Client Credentials flows begin and end with requests to the [`/token` endpoint](/docs/api/resources/oauth2.html#request-a-token). The Authorization Code and Hybrid flows end with a request to the `/token` endpoint. The `grant_type` request parameter determines how the Authorization Server processes token requests.

<!--  Table of grant types -->
`grant_type` | Flow |
| --- | --- |
| `authorization_code` |  xx |
| `password` |  xx |
| `refresh_token` |  xx |
| `client_credentials` |  xx |


## Authorization Code Flow

Your app redirects the user's browser to the Authorization Server's [`/authorize` endpoint](/docs/api/resources/oauth2.html#obtain-an-authorization-grant-from-a-user) with the `response_type` set to `code` in the URL. The Authorization Server (Okta in this case) authenticates the user, determines which permissions the user wishes to grant to your app, and redirects the browser, with an authorization code, to an endpoint that you provided  when you first registered your app with Okta. Your app presents the authorization code at the Authorization Server's `/token` endpoint with `grant_type` set to `authorization_code` and `scope` set to request some combination of Access Token, ID Token, and Refresh Token. The Authorization Server issues the requested tokens with the requested scopes.

Most apps use this flow because of the security advantages described earlier. Using the Authorization Code flow whenever possible is a best practice.

## Implicit Flow

The implicit flow is designed for situations in which your app is not on a separate website but instead is written in a language like JavaScript and runs within the user's browser. This presents the following security problems:

* You cannot exclude the client from communications between the user and the Authorization server, so your app might be able to steal the user's username and password.

* You cannot exclude the browser from communication between your app and the Authorization Server, so any means of authenticating your app to the Authorization Server might be stolen by the user or anyone with access to the user's browser.

On the bright side, this flow entails fewer HTTP transactions than the Authorization Code flow, so its performance might be a little better.

Your app redirects the user's browser to the Authorization Server's [`/authorize` endpoint](/docs/api/resources/oauth2.html#obtain-an-authorization-grant-from-a-user) with the `response_type` set to `token` or `token id_token` in the URL. It receives the requested combination of Access Token and ID Token in the response. The scopes in the returned tokens match those in the `scope` parameter of the request. In order for your app to receive an ID Token, `scope` must include `openid`.

The Authorization Server authenticates the user and obtains the necessary permissions from the user but does not directly authenticate your app.

The user and others with access to the machine your app runs on may be able to capture the returned tokens.

Carefully consider the security implications of using this flow.

## Resource Owner Password Flow

Your app makes a request directly (with no prior requests) to the Authorization Server's [`/token` endpoint](/docs/api/resources/oauth2.html#request-a-token) with `grant_type` set to `password`. The request includes the `username` and `password` parameters. By setting `scope` appropriately your app can receive an Access Token and any combination of ID Token and Refresh Token.

This connection is directly between your app and the Authorization Server, so it's not likely to be intercepted. However, it requires your app to know the user's username and password.

Using this flow is not considered a good practice.


## Client Credentials Flow

If there is no end user in the picture, your app can use its own credentials (already registered with the Authorization Server). For example, if your app connects to an app that provides services to other apps, that app might accept tokens you obtain using the Client Credentials flow.

Your app makes a request directly (with no prior requests) to the Authorization Server's `/token` endpoint to obtain the desired tokens. The request has `grant_type` set to `client_credentials` and includes `client_id`, `client_secret`, and `scope`. This flow returns only an access token. It contains the scopes specified in the request.


## OpenID Connect Hybrid Flow



## Refresh Tokens



