---
layout: blog_post
title: 'OIDC in Action – An OpenID Connect Primer, Part 2 of 3'
author: dogeared
tags: [oauth, oauth2, oauth2.0, oauth 2.0, OpenID, OpenID Connect, oidc]
redirect_from:
  - "/blog/2017-08-01-oidc-primer-part-2"
---

In the [first installment of this OpenID Connect (OIDC) series](https://developer.okta.com/blog/2017/07/25/oidc-primer-part-1), we looked at some OIDC basics, its history, and the various flow types, scopes, and tokens involved. In this post, we'll dive into the mechanics of OIDC and see the various flows in action.

The token(s) you get back from an OIDC flow and the contents of the `/userinfo` endpoint are a function of the flow type and scopes requested. You can see this live on the [OIDC flow test site](https://okta-oidc-fun.herokuapp.com). Here, you can set different toggles for `scope` and `response_type`, which determines the type of flow for your app.

Your use case will determine which flow to use. Are you building a SPA or mobile app that needs to interact directly with the OpenID Provider (OP)? Do you have middleware, such as Spring Boot or Node.js Express that will interact with the OP? Below, we dig into some of the available flows and when it's appropriate to use them.

## Authorization Code Flow

The Authorization Code flow is covered in [Section 3.1 of the OIDC spec](http://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth). The TL;DR is: a code is returned from the `/authorization` endpoint which can be exchanged for ID and access tokens using the `/token` endpoint.

This is a suitable approach when you have a middleware client connected to an OIDC OP and don't (necessarily) want tokens to ever come back to an end-user application, such as a browser. It also means the end-user application never needs to know a secret key.

Here's an example of how this flow gets started using Okta:

```
https://micah.okta.com/oauth2/aus2yrcz7aMrmDAKZ1t7/v1/authorize?client_id=0oa2yrbf35Vcbom491t7&response_type=code&scope=openid&state=little-room-greasy-pie&nonce=b1e7b75d-6248-4fc7-bad0-ac5ae0f2e581&redirect_uri=https%3A%2F%2Fokta-oidc-fun.herokuapp.com%2Fflow_result
```
Let's break that down:

| Key               | Value                                                   | Description                                                   |
|-------------------|---------------------------------------------------------|---------------------------------------------------------------|
| Organization URL  | `https://micah.okta.com`                                | Okta Tenant                                                   |
| Authorization URL | /oauth2/aus2yrcz7aMrmDAKZ1t7/v1/authorize               | Default authorization endpoint for your org                   |
| client_id         | 0oa2yrbf35Vcbom491t7                                    | Client ID of the OIDC Application defined in Okta             |
| response_type     | code                                                    | The response type indicating code flow                        |
| scope             | openid                                                  | openid scope is required                                      |
| state             | little-room-greasy-pie                                  | Randon value is returned back at the end of the flow          |
| nonce             | b1e7b75d-6248-4fc7-bad0-ac5ae0f2e581                    | Random value to encode into the id_token for later validation |
| redirect_uri      | https%3A%2F%2Fokta-oidc-fun.herokuapp.com%2Fflow_result | url-encoded url that the OP redirects to                      |

Here it is in the browser:

{% img blog/oidc_primer/code_flow_1.png alt:"code flow 1" width:"800" %}

Notice that on the new screen, you are redirected back to the `redirect_uri` originally specified:

{% img blog/oidc_primer/code_flow_2.png alt:"code flow 2" width:"800" %}

Behind the scenes, a session is established with a fixed username and password. If you deploy this app on your own (which you can easily do from [here](https://github.com/oktadeveloper/okta-oidc-flows-example#okta-openid-connect-fun)), when you click the link you would be redirected to login and then redirected back to this same page.

On the above screenshot, you see the returned code and original `state`.

That code can now be exchanged for an `id_token` and an `access_token` by the middle tier - a Spring Boot application, in this case. This middle tier will validate the state we sent in the authorize request earlier and make a `/token` request using the Client Secret to mint an `access_token` and `id_token` for the user.


## Implicit Flow

The Implicit flow is covered in [Section 3.2 of the OIDC spec](http://openid.net/specs/openid-connect-core-1_0.html#ImplicitFlowAuth). Essentially, access and ID tokens are returned directly from the `/authorization` endpoint. The `/token` endpoint is not used.

This is a suitable approach when working with a client (such as a Single Page Application or mobile application) that you want to interact with the OIDC OP directly.

Here's an example of how this flow gets started using Okta:

```
https://micah.okta.com/oauth2/aus2yrcz7aMrmDAKZ1t7/v1/authorize?client_id=0oa2yrbf35Vcbom491t7&response_type=id_token+token&scope=openid&state=shrill-word-accessible-iron&nonce=f8c658f0-1eb9-4f8d-8692-5da4e2f24cf0&redirect_uri=https%3A%2F%2Fokta-oidc-fun.herokuapp.com%2Fflow_result
```

It's almost identical to the authorization code flow, except that the `response_type` is either `id_token`, `token` or `id_token+token`. Below, we cover exactly what's in these tokens and how it's driven, but remember: an `id_token` encodes identity information and an `access_token` (returned if `token` is specified) is a bearer token used to access resources. Okta also uses JWT for an `access_token`, which enables additional information to be encoded into it.

Here's this flow in the browser:

{% img blog/oidc_primer/implicit_flow_1.png alt:"implicit flow 1" width:"800" %}

You are redirected back to the `redirect_uri` originally specified (with the returned tokens and original `state`):

{% img blog/oidc_primer/implicit_flow_2.png alt:"implicit flow 2" width:"800" %}

The application can now verify the `id_token` locally. Use the `/introspect` endpoint to verify the `access_token`. It can also use the `access_token` as a bearer token to hit protected resources, such as the `/userinfo` endpoint.

## Hybrid Flow

The Hybrid flow is covered in [Section 3.3 of the OIDC spec](http://openid.net/specs/openid-connect-core-1_0.html#HybridFlowAuth). In this flow, some tokens are returned from the authorization endpoint (`/authorize`) and others are returned from the token endpoint (`/token`).

This is a suitable approach when you want your end-user application to have immediate access to short-lived tokens – such as the `id_token` for identity information, and also want to use a backend service to exchange the authorization code for longer-lived tokens using refresh tokens.

It's a combination of the authorization code and implicit code flows. You can spot it by looking at the `response_type` it *must* contain `code` and one or both of `id_token` and `token`:

```
https://micah.okta.com/oauth2/aus2yrcz7aMrmDAKZ1t7/v1/authorize?client_id=0oa2yrbf35Vcbom491t7&response_type=code+id_token+token&scope=openid&state=shrill-word-accessible-iron&nonce=f8c658f0-1eb9-4f8d-8692-5da4e2f24cf0&redirect_uri=https%3A%2F%2Fokta-oidc-fun.herokuapp.com%2Fflow_result
```

Here it is in the browser:

{% img blog/oidc_primer/hybrid_flow_1.png alt:"hybrid flow 1" width:"800" %}

You are redirected back to the `redirect_uri` originally specified (with the returned code, tokens and original `state`):

{% img blog/oidc_primer/hybrid_flow_2.png alt:"hybrid flow 2" width:"800" %}

In the next installment, we dig into how to control what's in these tokens, but here's a little taste now:

{% img blog/oidc_primer/action.gif alt:"token in action" width:"800" %}

These tokens were produced as a result of hybrid flow with all default scopes enabled.

Here's the response from the `/userinfo` endpoint using the `access_token` as a bearer token:

```
{
	"sub": "00u2yulup4eWbOttd1t7",
	"name": "Okta OIDC Fun",
	"locale": "en-US",
	"email": "okta_oidc_fun@okta.com",
	"preferred_username": "okta_oidc_fun@okta.com",
	"given_name": "Okta OIDC",
	"family_name": "Fun",
	"zoneinfo": "America/Los_Angeles",
	"updated_at": 1499922371,
	"email_verified": true
}
```

## Other OIDC Flows

There are two other flows not covered in this post: [Client Credentials Flow](https://tools.ietf.org/html/rfc6749#section-4.4) and [Resource Owner Password Credentials](https://tools.ietf.org/html/rfc6749#section-4.3). These are both defined in the OAuth 2.0 spec and, as such, are supported by OIDC. Here, we're focusing on flows that require an external authentication provider, such as Okta or Google, and not the alternative methods that these flows support.

What information is encoded in the `id_token`, the `access_token` and what information is returned when hitting the protected `/userinfo` endpoint are a function of the flow type and the scopes requested. In the next post, we dig deeper into this.

## Token Teardowns

In this installment, we looked at OIDC in action. You can experiment with OIDC at: [https://okta-oidc-fun.herokuapp.com](https://okta-oidc-fun.herokuapp.com/)

You can easily create your own instance of the OIDC tool if you have an Okta tenant. Check mine out at: [https://github.com/dogeared/okta-oidc-flows](https://github.com/dogeared/okta-oidc-flows)

You can explore the code or just click the friendly purple button to deploy your own instance.

In the [final installment](/blog/2017/08/01/oidc-primer-part-3), we dig into the various types of tokens and how to validate them.

The whole series is live now. Part 1 is [here](/blog/2017/07/25/oidc-primer-part-1). Part 3 is [here](/blog/2017/08/01/oidc-primer-part-3).
