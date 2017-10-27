---
layout: docs_page
weight: 3
title: Refreshing Access Tokens
excerpt: How to refresh access tokens with Okta.
---

# Refreshing Access Tokens

## What Is a Refresh Token?

A refresh token is a special token that is used to generate additional access tokens. This allows you to have short-lived access tokens without having to collect credentials every single time one expires. You request this token alongside the access and/or ID tokens as part of a user's initial authentication flow.

## Setting Up Your Application

Refresh tokens are available for a subset of Okta OAuth 2.0 Client Applications, specifically web or native applications. For more about creating an OpenID Connect application see [Implementing Authentication](/authentication-guide/implementing-authentication/).

Once you have an application, you need to make sure that the "Allowed grant types" include "Refresh Token".

## How to Get a Refresh Token

To get a refresh token, you send a request to your Okta Authorization Server.

### Get a Refresh Token with the Code Flow

In the case of the Authorization Code flow, you use the Authorization Server's `/authorize` endpoint to get an authorization code, specifying an `offline_access` scope. You then send this code to the `/token` endpoint to get an access token and a refresh token. For more information about this endpoint, see [Obtain an Authorization Grant from a User](/docs/api/resources/oauth2.html#obtain-an-authorization-grant-from-a-user). For more information about the Authorization Code flow, see [Implementing the Authorization Code Flow](/authentication-guide/implementing-authentication/auth-code.html).

### Get a Refresh Token with the Authorization Code or Password Flow

For the Authorization Code and Resource Owner Password flows, you use the Authorization Server's `/token` endpoint directly. For more information about this endpoint, see [Request a Token](/docs/api/resources/oauth2.html#request-a-token). For more information about the Client Credentials and Resource Owner Password flows, see:

- [Implementing the Authorization Code Flow](/authentication-guide/implementing-authentication/auth-code)
- [Implementing the Resource Owner Password Flow](/authentication-guide/implementing-authentication/password.html)

The following combinations of grant type and scope, when sent to `/token` endpoint, will return a refresh token:

|Grant Type  | Scope |
|-------------|-------|
| `authorization_code`  | `offline_access` (see Note)  |
| `refresh_token`  | `offline_access` |
| `password`  | `offline_access`  |

> NOTE: The authorization code flow is unique, in that the `offline_access` scope has to be requested as part of the code request to the `/authorize` endpoint, and not the request sent to the `/token` endpoint.

This table only shows the minimum requirements. For example, with the `password` grant type you can also include an `openid` scope alongside the `offline_scope`:

```
'grant_type=password&redirect_uri=http%3A%2F%2Flocalhost%3A8080&username=example%40mailinator.com&password=a.gReAt.pasSword&scope=openid%20offline_access'
```

You would then get back an ID token alongside your access and refresh tokens.

> NOTE: Although you requested access, refresh, and ID tokens, the refresh token can only be used to get a new access token. An ID token cannot be refreshed.

For more information see the [Okta OAuth 2.0 reference page](/docs/api/resources/oauth2.html#response-parameters-1).

## Get a Refresh Token Silently for Your SPA

In a normal Single-Page Application (SPA) it is usually undesirable to redirect the user to a login page during normal navigation. For example, a user could request access to a resource, prompting your SPA to send a request to the Okta `/authorize` endpoint. Normally, if a user does not have a valid session, this request will result in a redirection to a login page. To avoid this disruptive redirection, the endpoint allows for a request parameter called `prompt`. If the value of the `prompt` parameter is `none`, this guarantees that the user will not be prompted to login, regardless of whether they have an active session or not. Instead, your application will either silently obtain the requested tokens or an OAuth error response. How to act on the error is up to you. 

For more information on the `/authorize` endpoint, see the [Authentication Request section of the OIDC Reference](/docs/api/resources/oidc.html#authentication-request).

## How to Use a Refresh Token

To refresh your access token, you send a token request with a `grant_type` of `refresh_token`.

```
http --form POST https://{yourOktaDomain}.com/oauth2/default/v1/token \
  accept:application/json \
  authorization:'Basic MG9hYmg3M...' \
  cache-control:no-cache \
  content-type:application/x-www-form-urlencoded \
  grant_type=refresh_token \
  redirect_uri=http://localhost:8080 \
  scope=offline_access \
  refresh_token=MIOf-U1zQbyfa3MUfJHhvnUqIut9ClH0xjlDXGJAyqo
```

If the refresh token is valid, then you get back a new access/refresh token combination:

```
{
    "access_token": "eyJhbGciOiJ[...]K1Sun9bA",
    "token_type": "Bearer",
    "expires_in": 3600,
    "scope": "offline_access",
    "refresh_token": "MIOf-U1zQbyfa3MUfJHhvnUqIut9ClH0xjlDXGJAyqo"
}
```
