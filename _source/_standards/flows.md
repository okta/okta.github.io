---
layout: docs_page
title: OAuth 2.0 and OIDC Flows
weight: 3
---
# OAuth 2.0 and OIDC Flows

You're writing software to create an app or service that needs to access a protected resource by making a request to an API endpoint. The resource owner (typically the end user of your app) might have a username and password for accessing the protected resource but is understandably reluctant to give them to you because

 * Malicious actors might get their hands on them.
 * The user has no control of what you can do with those credentials.

## OAuth 2.0 and OIDC

The [OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749) standard was developed to enable users to give apps like yours access to their protected resources without giving out their passwords. The Authorization Server is an intermediary between your app and the user. When you use API Access Management, Okta is the Authorization Server.

The Authorization Server authenticates the user, probably by asking for a username and password. Then it asks for the user's permission for your app to access the specific resources your app  says it needs. The Authorization Server gives your app an opaque Access Token to present to the API endpoint (the Resource Server) that controls the resource. The Resource Server can tell by interpreting the Access Token that your app has permission to access those specific resources, so it returns the resources to your app.

The Access Token is intended for the Resource Server. It means nothing to your app.

Your software may need a variety of information about the user in order to support the services it's designed to provide. Rather than asking the user a lot of questions, you can often obtain this information from the Authorization Server, which typically knows a lot about the user. The Authorization Server sends this information to your app in the form of an ID Token, which contains a variety of assertions (called claims) about the user. The format and handling of ID Tokens is in accord with the [Open ID Connect (OIDC) standard](https://openid.net/specs/openid-connect-core-1_0.html).

The ID Token is intended for your app. It means nothing to the Resource Server.

## Authorization Flows

All authorization flows begin with requests to the [`/authorize` endpoint](https://developer.okta.com/docs/api/resources/oauth2.html#obtain-an-authorization-grant-from-a-user). The `response_type` request parameter determines which of the basic flows your app will use.

The basic OAuth 2.0 flows are:

 * Authorization Code -- the user receives an authorization code to give to your app, so your app can exchange it for an Access Token.
 * Implicit -- the user authorizes the Authorization Server to send an Access Token directly to your app.
 * Resource Owner Password -- Your app submits the user's credentials to the Authorization Server to obtain an Access Token.
 * Client Credentials -- Your app submits its own credentials to the Authorization Server to obtain an Access Token.

The OIDC flows use the first two OAuth 2.0 flows to enable your app to receive ID Tokens as well as Access Tokens and Refresh Tokens. You cannot obtain ID Tokens using the Resource Owner Password or Client Credentials flow.

Your app can request Access Tokens, ID Tokens, and Refresh Tokens. Except for the implicit flow, your app obtains all tokens from the Authorization Server's [`/token` endpoint](https://developer.okta.com/docs/api/resources/oauth2.html#request-a-token). The `grant_type` request parameter determines how the Authorization Server processes token requests.


## Authorization Code Flow

Your app sends the resource owner to the Authorization Server, which authenticates the resource owner, determines which permissions the resource owner wishes to grant to your app, and sends the resource owner, with an authorization code, to an endpoint that you provided to the Authorization Server when you first registered your app with the Authorization Server. Your app presents the authorization code at the Authorization Server's `/token` endpoint to request some combination of Access Token, ID Token, and Refresh Token. Most apps use this code flow because of its security advantages:

 * Your app never sees the user's credentials.
 * The Authorization Server authenticates your app before issuing it an Access Token.
 * The Access Token comes directly to your app, so it's not as likely to be exposed.

Using the Authorization Code flow whenever possible is a best practice.

## Implicit Flow

If your app is implemented in a browser using a language like JavaScript, you can increase efficiency by eliminating round trips using an implicit flow. You send a request to the Authorization Server `/authorize` endpoint and receive the requested combination of Access Token, ID Token, and Refresh Token in the response. The Authorization Server authenticates the resource owner and obtains the necessary permissions from the resource owner but does not necessarily authenticate your app. The resource owner and others with access to the machine your app runs on may be able to capture the returned tokens. Carefully consider the security implications of using this flow.


## Resource Owner Password Flow

You can obtain the user's login credentials for the Resource Server and present them directly to the Authorization Server's `/token` endpoint. This is not a good practice because of the danger of exposing those credentials.



## Client Credentials Flow

If there is no end user in the picture, your app can present its own credentials (already registered with the Authorization Server) to the Authorization Server's `/token` endpoint to obtain the desired tokens.




