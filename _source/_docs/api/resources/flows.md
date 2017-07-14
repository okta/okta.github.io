layout: docs_page
title: OAuth 2.0 and OIDC Flows
weight: 4
---
# OAuth 2.0 and OIDC Flows

You're writing software that needs to access a protected resource by making a request to the API of the server that houses the resource. The resource owner might have a username and password for that server but is understandably reluctant to give them to you because

 * Hackers might get their hands on them.
 * The resource owner has no control of what you can do with those credentials.

This is the situation that the [OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749) standard was developed to address. In that standard your software is called a client. The approximate story is that the Authorization Server (AS) acts as an intermediary between your client and the resource owner (RO). When you develop your software to use API Access Management, Okta is the AS.

The AS authenticates the RO and asks for the RO's permission for your client to access the specific resources your client has told the AS that it needs. The AS gives your client an opaque Access Token to present to the Resource Server (RS). The RS can tell by interpreting the Access Token that your client has permission to access those specific resources, so it returns them to your client.

The Access Token is intended for the RS. It means nothing to the client.

Your software may need a variety of information about the RO in order to support the services it's designed to provide. Rather than asking the RO a lot of questions, you can often obtain this information from the AS, which typically knows a lot about the RO. The AS sends this information to your client in the form of an ID Token, which contains a variety of assertions (called claims) about the RO. The format and handling of ID Tokens is in accord with the [Open ID Connect (OIDC) standard](https://openid.net/specs/openid-connect-core-1_0.html).

The ID Token is intended for the client. It means nothing to the RS.

The description so far omits details and variations. The main source of variation is the environment your client runs in, which affects the degree of trust the AS and RS have in your client.

All authorization flows begin with requests to the [`/authorize` endpoint](https://developer.okta.com/docs/api/resources/oauth2.html#obtain-an-authorization-grant-from-a-user). The `response_type` request parameter determines which of the basic flows your client will use.

The basic OAuth 2.0 flows are:

 * Authorization Code -- RO receives an authorization code to give the client to exchange for an Access Token.
 * Implicit -- RO authorizes client to receive an Access Token directly.
 * Resource Owner Password -- Client submits the RO's credentials to the AS to obtain an Access Token.
 * Client Credentials -- Client owns the resource and submits its own credentials to the AS to obtain an Access Token.

The AS optionally issues Refresh Tokens whenever it issues Access Tokens.

The OIDC flows use the first two OAuth 2.0 flows to enable your client to receive ID Tokens as well as Access Tokens. You cannot obtain ID Tokens using the Resource Owner Password or Client Credentials flow.

Except for the implicit flow, your client obtains all tokens from the [`/token` endpoint](https://developer.okta.com/docs/api/resources/oauth2.html#request-a-token). The `grant_type` request parameter determines how the AS processes token requests.

Now for some details.


## Authorization Code Flow

Your client sends the RO to the AS, which authenticates the RO, determines which permissions the RO wishes to grant to your client, and sends the RO, with an authorization code, to an endpoint that you provided to the AS when you first registered your client with the AS. Your client presents the code at the AS `/token` endpoint to request some combination of Access Token, ID Token, and Refresh Token. Use this flow unless you have a good reason not to.


## Implicit Flow

If your client is implemented in a browser using a language like JavaScript, you can increase efficiency by eliminating round trips using an implicit flow. You send a request to the AS `/authorize` endpoint and receive the requested combination of Access Token, ID Token, and Refresh Token in the response. The AS authenticates the RO and obtains the necessary permissions from the RO but does not necessarily authenticate your client. The RO and others with access to the machine your client runs on may be able to capture the returned tokens. Carefully consider the security implications of using this flow.


## Resource Owner Password Flow

You can obtain the RO's login credentials for the RS and present them directly to the AS `/token` endpoint. It's a bad idea. Don't do it.



## Client Credentials Flow

If there is no end user in the picture, your client can present its own credentials (already registered with the AS) to the AS `/token` endpoint to obtain the desired tokens.




