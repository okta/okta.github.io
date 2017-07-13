layout: docs_page
title: OAuth 2.0 and OIDC Flows
weight: 4
---
# OAuth 2.0 and OIDC Flows

You're writing software that needs to access a protected resource by making a request to the API of the server that houses the resource. The resource owner might have a username and password for that server but is understandably reluctant to give them to you because

 * Hackers might get their hands on them.
 * The resource owner has no control of what you can do with those credentials.

This is the situation that the [OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749) standard was developed to address. In that standard your software is called a client. The approximate story is that the Authorization Server (AS) acts as an intermediary between your client and the resource owner (RO). The AS authenticates the RO and asks for the RO's permission for your client to access the specific resources your client has told the AS that it needs. The AS gives your client an opaque Access Token to present to the Resource Server (RS). The RS can tell by interpreting the Access Token that your client has permission to access those specific resources, so it returns them to your client. The Access Token is intended for the RS. It means nothing to the client.

Your software may need a variety of information about the RO in order to support the services it's designed to provide. Rather than asking the RO a lot of questions, you can often obtain this information from the AS, which typically knows a lot about the RO. The AS sends this to your client in the form of an ID Token, which contains a variety of assertions (called claims) about the RO. The format and handling of ID Tokens is defined by the [Open ID Connect (OIDC) standard](https://openid.net/specs/openid-connect-core-1_0.html). The ID Token is intended for the client. It means nothing to the RS.

The description so far omits details and variations. The main source of variation is the environment your client runs in, which affects the degree of trust the AS and RS have in your client.

## Basic OAuth 2.0 Authorization Flows

All authorization flows begin with requests to the [/authorize endpoint](https://developer.okta.com/docs/api/resources/oauth2.html#obtain-an-authorization-grant-from-a-user). The `response_type` request parameter determines which of the basic flows your client will use.

| `response type`                    | Flow                               |
| -----------------------------------| ---------------------------------- |
| `code`                             | Fill this in later                 |
| `token`                            |                                    |
| `id_token`                         |                                    |
| `code` `code id_token`             |                                    |
| `code` `code id_token` `token`     |                                    |
| `id_token` `token`                 |                                    |






