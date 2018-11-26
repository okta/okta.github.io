---
layout: blog_post
title: 'Identity, Claims, & Tokens – An OpenID Connect Primer, Part 1 of 3'
author: dogeared
tags: [oauth, oauth2, oauth2.0, oauth 2.0, OpenID, OpenID Connect, oidc]
redirect_from:
  - "/blog/2017/08/01/oidc-primer-part-1"
---

In the beginning, there were proprietary approaches to working with external identity providers for authentication and authorization. Then came SAML (Security Assertion Markup Language) – an open standard using XML as its message exchange type. Then, there was OAuth and OAuth 2.0 – also open as well as being a modern, RESTful approach to authorization using JSON as its medium. And now, the holy grail of "secure delegated access" OpenID Connect (henceforth OIDC), which runs on top of OAuth 2.0.

But wait. What was wrong with OAuth 2.0? To understand better, let's first dispense with the term, secure delegated access. It's too vague and has led to confusion between authentication (authn) and authorization (authz).

Without secure, external authentication and authorization, you'd have to trust that every application, and every developer not only had your best interests and privacy in mind, but also *knew how to protect your identity* and was willing to keep up with security best practices. That's a pretty tall order, right? With OIDC, you can use a trusted external provider to prove to a given application that you are who you say you are, without ever having to grant that application access to your credentials.

OAuth 2.0 leaves a lot of details up to implementers. For instance, it supports scopes, but scope names are not specified. It supports access tokens, but the format of those tokens are not specified. With OIDC, a number of specific scope names are defined that each produce different results. OIDC has both access tokens and ID tokens. An ID token must be JSON web token (JWT). Since the specification dictates the token format, it makes it easier to work with tokens across implementations.

In this blog series, I share a primer on OIDC. In the first post, we'll review some key concepts around OIDC and tokens, explained in human terms. Then, we'll look at OIDC in action with some specific code examples to highlight its value in the authentication and authorization ecosystem. Finally, we'll dig into the guts of the different token types and how to control what goes into them.

You can see the various concepts and OIDC interactions covered at: [https://okta-oidc-fun.herokuapp.com](https://okta-oidc-fun.herokuapp.com)

The code that backs this is at: [https://github.com/oktadeveloper/okta-oidc-flows-example](https://github.com/oktadeveloper/okta-oidc-flows-example)

## Key Concepts: Scopes, Claims, and Response Types

Before we dive into the minutiae of OIDC, let's take a step back and talk about how we interact with it.

There are two primary actors involved in all OIDC interactions: the OpenID Provider (OP) and the Relying Party (RP). The OP is an [OAuth 2.0](https://tools.ietf.org/html/rfc6749) server that is capable of authenticating the end-user and providing information about the result of the authentication and the end-user to the Relying Party. The Relying Party is an OAuth 2.0 application that "relies" on the OP to handle authentication requests.

Typically, you kick off an OIDC interaction by hitting an `/authorization` endpoint with an HTTP GET. A number of query parameters indicate what you can expect to get back after authenticating and what you'll have access to (authorization).

Often, you'll need to hit a `/token` endpoint with an HTTP POST to get tokens which are used for further interactions.

OIDC also has an `/introspect` endpoint for verifying a token, a `/userinfo` endpoint for getting identity information about the user.

All of the above endpoints are the convention, but can be defined by the OP to be anything. One of the great improvements in OIDC is a [metadata](http://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata) mechanism to discover endpoints from the provider. For instance, if you navigate to: [https://micah.okta.com/oauth2/aus2yrcz7aMrmDAKZ1t7/.well-known/openid-configuration](https://micah.okta.com/oauth2/aus2yrcz7aMrmDAKZ1t7/.well-known/openid-configuration), you'll get back a JSON formatted document with the metadata that identifies all the available endpoints from the OP (Okta, in this case).

### What's a Scope?

Scopes are space-separated lists of identifiers used to specify what access privileges are being requested. Valid scope identifiers are specified in [RFC 6749](https://tools.ietf.org/html/rfc6749).

OIDC has a number of built in scope identifiers. `openid` is a required scope. All others – including custom scopes – are optional. The built-in scopes are:

| scope        | purpose                                                         |
| -------------|-----------------------------------------------------------------|
| profile      | requests access to default profile claims                       |
| email        | requests access to email and email_verified claims              |
| address      | requests access to address claim                                |
| phone        | requests access to phone_number and phone_number_verified claims|

The default profile claims are:
* `name`
* `family_name`
* `given_name`
* `middle_name`
* `nickname`
* `preferred_username`
* `profile`
* `picture`
* `website`
* `gender`
* `birthdate`
* `zoneinfo`
* `locale`
* `updated_at`

Notice how the scopes are tied to claims. You may be asking, what the heck are claims?

### What's a Claim?

Simply put, claims are name/value pairs that contain information about a user, as well meta-information about the OIDC service. The official definition from the spec is a ["piece of information asserted about an Entity."](http://openid.net/specs/openid-connect-core-1_0.html#Terminology)

Here's typical set of claims:

```
{
    "family_name": "Silverman",
    "given_name": "Micah",
    "locale": "en-US",
    "name": "Micah Silverman",
    "preferred_username": "micah.silverman@okta.com",
    "sub": "00u9vme99nxudvxZA0h7",
    "updated_at": 1490198843,
    "zoneinfo": "America/Los_Angeles"
}
```

A number of the `profile` claims are included above. That's because the request for the user's info was made using a token that was obtained with the `profile` scope. In other words, a request is made that results in the issuance of a token. That token contains certain information based on the scopes specified in the original request.

### What's a Response Type?

When working with OIDC, you'll hear talk of various "flows". These flows are used to describe different common authentication and authorization scenarios. Considerations include the type of application (like web-based or native mobile app), how you want to validate tokens (in the app or in the backend), and how you want to access additional identity information (make another API call or have it encoded right into a token).

There are three primary flows: *Authorization Code*, *Implicit*, and *Hybrid*. These flows are controlled by the `response_type` query parameter in the `/authorization` request. When thinking of which flow to use, consider front-channel vs. back-channel requirements. Front-channel refers to a user-agent (such as a SPA or mobile app) interacting directly with the OpenID provider (OP).  The implicit flow is a good choice when front-channel communication is required. Back-channel refers to a middle-tier client (such as Spring Boot or Express) interacting with the OP. The authorization code flow is a good choice when back-channel communication is required.

*Authorization Code* flow uses `response_type=code`. After successful authentication, the response will contain a `code` value. This code can later be exchanged for an `access_token` and an `id_token` (Hang in for now, we'll talk about tokens in more depth later on.) This flow is useful where you have "middleware" as part of the architecture. The middleware has a `client id` and `client secret`, which is required to exchange the `code` for tokens by hitting the `/token` endpoint. These tokens can then be returned to the end-user application, such as a browser, without the browser ever having to know the `client secret`. This flow allows for long-lived sessions through the use of `refresh tokens`. The only purpose of `refresh tokens` is to obtain new `access tokens` to extend a user session.

*Implicit* flow uses `response_type=id_token token` or `response_type=id_token`. After successful authentication, the response will contain an `id_token` and an `access_token` in the first case or just an `id_token` in the second case. This flow is useful when you have an app speaking directly to a backend to obtain tokens with no middleware. It does not support long-lived sessions.

*Hybrid* flow combines the above two in different combinations – whatever make sense for the use case. An example would be `response_type=code id_token`. This approach enables a scenario whereby you can have a long lived session in an app and get tokens back immediately from the `/authorization` endpoint.

## All About Tokens

With the foundation of scopes, claims, and response types, we can now talk about tokens! There are three types of tokens in OIDC: `id_token`, `access_token` and `refresh_token`.

### ID Tokens

An `id_token` is a [JWT](https://tools.ietf.org/html/rfc7519), per the [OIDC Specification](http://openid.net/specs/openid-connect-core-1_0.html#TokenResponse). This means that:

 * identity information about the user is encoded right into the token and
 * the token can be definitively verified to prove that it hasn't been tampered with.

 There's a set of [rules](http://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation) in the specification for validating an `id_token`. Among the claims encoded in the `id_token` is an expiration (`exp`), which must be honored as part of the validation process. Additionally, the signature section of JWT is used in concert with a key to validate that the entire JWT has not been tampered with in any way.

#### A Brief History of JWTs

In the beginning tokens were opaque – they carried no intrinsic information. This was fine as the server knew the token and could look up any data related to it, such as identity information.

When the [OAuth 2.0 spec](https://tools.ietf.org/html/rfc6749) was released in 2012, it defined token types (such as access and refresh tokens), but it purposely avoided dictating the format of these tokens.

In 2015, the [JWT spec](https://tools.ietf.org/html/rfc7519) was released. It proposed the creation of tokens which encoded other information. This token could be used as an opaque identifier and could also be inspected for additional information – such as identity attributes. It called these attributes `claims`. The spec also includes provisions for cryptographically signed JWTs (called JWSs) and encrypted JWTs (called JWEs). A signed JWT is particularly useful in application development because you can have a high degree of confidence that the information encoded into the JWT has not been tampered with. By verifying the JWT within the application, you can avoid another round trip to an API service. It also allows to enforce behavior, like expiration, because you know the `exp` claim has not been altered.

There's no direct relationship between JWT and OAuth 2.0. However, many OAuth 2.0 implementers saw the benefits of JWTs and began using them as either (or both) access and refresh tokens.

OIDC formalizes the role of JWT in mandating that ID Tokens be JWTs. Many OIDC implementers will also use JWTs for access and refresh tokens, but it is not dictated by the spec.

### Access Tokens

Access tokens are used as bearer tokens. A bearer token means that the bearer can access authorized resources without further identification. Because of this, it's important that bearer tokens are protected. If I can somehow get ahold of and "bear" *your* access token, I can masquerade as you.

These tokens usually have a short lifespan (dictated by its expiration) for improved security. That is, when the access token expires, the user must authenticate again to get a new access token limiting the exposure of the fact that it's a bearer token.

Although not mandated by the OIDC spec, Okta uses JWTs for access tokens as (among other things) the expiration is built right into the token.

OIDC specifies a `/userinfo` endpoint that returns identity information and must be protected. Presenting the access token makes the endpoint accessible.

Here's an example using [HTTPie](https://httpie.org):

```
http https://micah.oktapreview.com/oauth2/.../v1/userinfo

HTTP/1.1 400 Bad Request
...
WWW-Authenticate: Bearer error="invalid_request", error_description="The access token is missing."
...
```

Let's try again with an expired access token:

```
http https://micah.oktapreview.com/oauth2/.../v1/userinfo \
Authorization:"Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ik93bFNJS3p3Mmt1Wk8zSmpnMW5Dc2RNelJhOEV1elY5emgyREl6X3RVRUkifQ..."

HTTP/1.1 401 Unauthorized
...
WWW-Authenticate: Bearer error="invalid_token", error_description="The token has expired."
...
```

Finally, let's try with a valid access token:

```
http https://micah.oktapreview.com/oauth2/.../v1/userinfo \
Authorization:"Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ik93bFNJS3p3Mmt1Wk8zSmpnMW5Dc2RNelJhOEV1elY5emgyREl6X3RVRUkifQ..."

HTTP/1.1 200 OK
...
{
    "family_name": "Silverman",
    "given_name": "Micah",
    "groups": [
        "ABC123",
        "Everyone"
    ],
    "locale": "en-US",
    "name": "Micah Silverman",
    "preferred_username": "micah+okta@afitnerd.com",
    "sub": "...",
    "updated_at": 1490198843,
    "zoneinfo": "America/Los_Angeles"
}
```
### Refresh Tokens

Refresh tokens are used to obtain new access tokens. Typically, refresh tokens will be long-lived while access tokens are short-lived. This allows for long-lived sessions that can be killed if necessary. Here's a typical scenario:

1. User logs in and gets back an access token and a refresh token
2. The application detects that the access token is expired
3. The application uses the refresh token to obtain a new access token
4. Repeat 2 and 3 until the refresh token expires
5. After the refresh token expires, the user must authenticate again

You may be asking: Why do this dance? This approach strikes a balance between user experience and security. Imagine if the user is compromised in some way. Or, their subscription expires. Or, they are fired. At any point, the refresh token can be revoked by an admin. Then, step three above will fail and the user will be forced to (attempt to) establish a new session by authenticating. If their account has been suspended, they will not be able to authenticate.

### Identifying Token Types

It can be confusing sometimes to distinguish between the different token types. Here's a quick reference:

1. ID tokens carry identity information encoded in the token itself, which must be a JWT
2. Access tokens are used to gain access to resources by using them as bearer tokens
3. Refresh tokens exist solely to get more access tokens

## Continue the OpenID Connect Journey

In this post, we learned some basics about OpenID Connect, its history, and a bit about the various flow types, scopes, and tokens involved. In the [next installment](/blog/2017/07/25/oidc-primer-part-2), we see OIDC in action!

If you want to jump ahead, check out the example at: [https://okta-oidc-fun.herokuapp.com](https://okta-oidc-fun.herokuapp.com)

And, the source code is at: [https://github.com/oktadeveloper/okta-oidc-flows-example](https://github.com/oktadeveloper/okta-oidc-flows-example)

The whole series is live now. Part 2 is [here](/blog/2017/07/25/oidc-primer-part-2). Part 3 is [here](/blog/2017/08/01/oidc-primer-part-3).
