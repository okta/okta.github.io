---
layout: docs_page
title: Validating Access Tokens
excerpt: How to validate access tokens in your server-side application
---

## Overview

If you are building a modern app or API, you likely want to know if your end-user is authenticated. This is important to give context or to protect APIs from unauthenticated users. You can use Okta to authenticate your end-users and issue them signed access and ID tokens, which your application can then use. It is important that your application only uses the access token to grant access, and not the ID token. For more information about this, see the (jakub.todo) section below.

> For more information on issuing access tokens, see here (jakub.todo). 

Once the signed tokens are issued to the end-users they can be passed to your application, which must validate them. There are two ways to verify a token: locally, or remotely with Okta. The token has been signed with a JSON Web Key (JWK) using the RS256 algorithm. To validate the signature, Okta provides your application with a public key that can be used. 

We will now cover the terms used in this document, and an explanation of why you should use access tokens instead of ID tokens for this use case. 

- If you'd like to jump straight to the local validation steps, click here: (jakub.todo) 
- If you'd like to see how to validate a token directly with Okta, click here: (jakub.todo)
- If you want to see specifically how to accomplish this using an Okta SDK, click here: (jakub.todo)

### Terms 

In the OAuth 2.0 flows under discussion here, we have four important roles:

- The authorization server, which is the server that issues the access token. In this case Okta is the authorization server. For more information about setting-up Okta as your authorization server, go here: [Set Up Authorization Server](https://developer.okta.com/docs/how-to/set-up-auth-server.html).
- The resource owner, normally your application's end-user, that grants permission to access the resource server with an access token. 
- The client, which is the application that requests the access token from Okta and then passes it to the resource server.
- The resource server, which accepts the access token and therefore also must verify that it is valid. In this case this is your application.

More information about all of these can be found in our high-level discussion of OAuth 2.0, which you can find here: (jakub.todo).

The access tokens are in JSON Web Token (JWT) format, the specification for which can be found here: <https://tools.ietf.org/html/rfc7519>. They are signed using private JSON Web Keys (JWK), the specification for which you can find here: <https://tools.ietf.org/html/rfc7517>.

## Access Tokens vs ID Tokens

As mentioned above, it is important that the resource server (your server-side application) only take the access token from a client. This is because access tokens are intended for authorizing access to a resource, which is exactly the use case you have here. 

ID Tokens, on the other hand, are intended for authentication. They provide information about the resource owner, to allow you verify that they are who they say they are. Authentication is the concern of the clients. Because of this, when a client makes an authentication request, the ID Token that is returned contains the `client_id` in the ID Token's `aud` claim. 

More information about ID tokens can be found here: (jakub.todo).

## What to Check When Validating an Access Token 

The high-level overview of validating an access token looks like this:

(jakub.todo link to sections below)

- Retrieve and parse your Okta JSON Web Keys (JWK), which should be checked periodically and cached by your application.
- Decode the access token, which is in JSON Web Token format.
- Verify the signature used to sign the access token
- Verify the claims found inside the access token

### Retrieve The JSON Web Keys

The JSON Web Keys (JWK) need to be retrieved from your [Okta Authorization Server](https://developer.okta.com/docs/how-to/set-up-auth-server.html), though your application should have them cached. Specifically, your Authorization Server's Metadata endpoint contains the `jwks_uri`, which you can use to get the JWK. 

> For more information about retrieving this metadata, see [Retrieve Authorization Server Metadata](https://developer.okta.com/docs/api/resources/oauth2.html#retrieve-authorization-server-metadata).
 
### Decode the Access Token

You will have to decode the access token, which is in JWT format. Here are a few examples of how to do this:

(jakub.todo. Link to code section below)

### Verify the Token's Signature

You verify the access token's signature by matching the key that was used to sign in with one of the key's you retrieved from your Okta Authorization Server's JWK endpoint. Specifically, each public key is identified by a `kid` attribute, which corresponds with the `kid` claim in the access token header.

If the `kid` claim does not match, it is possible that the signing keys have changed. Check the `jwks_uri` value in the Authorization Server metadata and try retrieving the keys again from Okta.

Please note the following:

- For security purposes, Okta automatically rotates keys used to sign the token.
- The current key rotation schedule is four times a year. This schedule can change without notice.
- In case of an emergency, Okta can rotate keys as needed.
- Okta always publishes keys to the `jwks_uri`.
- To save the network round trip, your app should cache the `jwks_uri` response locally. The [standard HTTP caching headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) are used and should be respected.
- The administrator can switch the Authorization Server key rotation mode by updating the Authorization Server's `rotationMode` property. For more information see the API Reference: [Authorization Server Credentials Signing Object](https://developer.okta.com/docs/api/resources/oauth2.html#authorization-server-credentials-signing-object).

### Verify the Claims

You should verify the following:

- The `iss` (issuer) claim matches the identifier of your Okta Authorization Server.
- The `client_id` claim is your Okta application's Client ID.
- The `exp` (Expiry Time) claim is the time at which this token will expire, expressed in Unix time. You should make sure that this has not already passed.

## Validating A Token Remotely With Okta

Alternatively, you can also validate an access or refresh Token using the Token Introspection endpoint: [Introspection Request](https://developer.okta.com/docs/api/resources/oauth2.html#introspection-request). This endpoint takes your token as a URL query and returns back a simple JSON response with a boolean `active` property. 

This incurs a network request which is slower to do verification, but can be used when you want to guarantee that the access token hasn't been revoked. 

## Okta Libraries to Help You Verify Access Tokens

Link out to SDK-specific info on how to validate tokens here.

- <https://okta.github.io/code/php/jwt-validation.html>

Don't see the language you're working in? Get in touch: <developers@okta.com>
