---
layout: docs_page
title: Authentication Overview
excerpt: Okta helps you authenticate users to the apps or other resources they need.
---

# Overview

Okta provides many ways to authenticate users or services so that they can access the resources they need. 
We've implemented both OAuth 2.0 and OpenID Connect, and provide a protocol-agnostic authentication API as well:
  
* [OAuth 2.0](https://tools.ietf.org/html/rfc6749#section-1.3) is a delegated authentication framework, and [Okta's implementation](/docs/api/resources/oauth2.html) complies with the standard.
    Use it to provide API security via scoped access tokens. You can also use it for ID tokens, especially helpful for complex authentication scenarios.
* [OpenID Connect](https://openid.net/specs/openid-connect-core-1_0.html#Authentication) is a high assurance, modern identity protocol layer over OAuth 2.0. [Okta's implementation](/docs/api/resources/oidc.html) is certified.
    Use it to provide user identity authentication. 
* If your authentication doesn't follow the OAuth 2.0 or OpenID Connect model, use [Okta's Authentication API](/docs/api/resources/authn.html) to
    perform primary authentication of username and password credentials.

All three APIs integrate with Okta's MFA, recovery, and other user management APIs.

## Choosing a Flow

Authentication and authorization transactions are composed of many individual requests and responses.
Each set of transactions from end user to desired resource and back is called a flow. 

The flows defined in OAuth 2.0 and OpenID Connect overlap and present many options, so you may not be sure which flow to use.

Each flow serves a different basic scenario:

* Is the goal is to identify a user, or delegate authentication of a user to an app or other service (client)?
* Is a user even involved in the transaction? Is there a user context?
* Is the authenticated user being given access to resources from a third party?
* Are all parties inside a trusted barrier?
* Do you have complex goals or complicated environments? 

After answering these basic questions, you can narrow down the choice of flows:

1. Are you working in a trusted environment, for example all clients and resources are behind the same firewall? If no, go to next step. If Yes, choose password or client credentials flow. 
    a. Is there any human interaction? If yes, use **password** flow which passes username and password as credentials. If no, use **client credentials** flow, which passes a client ID and client secret.
    
2. Do you want to validate the user's credentials before authenticating them to access a resource? If No, go to next step. If Yes, choose one:
    a. **Authorization code** flow: In this commonly used flow, user credentials are exchanged for a code that is then passed to access a resource or get a refresh token. This flow provides protection against common attacks against mobile apps.
    b. **Implicit** flow: For browser-based apps (JavaScript) with no back-end component. The user credentials are exchanged for an ID token and redirection response that are sent together.
    c. **Hybrid** flow: Seldom used, this flow supports the front-end app and back-end component receiving tokens independent of each other. It is only defined in the OpenID Connect spec. <!-- Why is this only defined in OIDC? -->

3. Do you simply want to refresh an existing token due to time limit or other barrier? Use the refresh token flow. <!-- Need link to relevant section somewhere? -->

You may need to choose between OpenID Connect or Oauth 2.0 (some flows are defined in both specs). A flow is an OpenID Connect flow if the authentication request contains the `oidc` scope.
A flow may include the `openid` scope and still request an access token as well as an ID token (more about that later).

| Difference                  | OAuth 2.0                                     | OpenID Connect                                |
|:----------------------------|:----------------------------------------------|:----------------------------------------------|
| `openid` scope is requested |                                               | &#10004;                                      |
| Access Token Contents       | May refer to any resource                     | Can only contain information from `/userinfo` |
| ID Token Contents           | Can only contain information from `/userinfo` | Can only contain information from `/userinfo` |

Think of the difference between an OAuth 2.0 flow and an OpenID Connect as the difference between seeking authorization to access a resource (OAuth 2.0),
and seeking authentication of a user (OpenID Connect). In practice, you may be combining both of these goals in a single flow. 

Now that you've narrowed down the choices of which flow to use, you can learn about the different elements Okta has implemented to refine your choice.

## Refine Your Choice

Choosing between authorization code, implicit, or hybrid flows depends on what you wish to do. Use the following details to ensure the flow(s) you choose fit your specific scenario.

The OAuth 2.0 spec and OpenID Connect spec have defined a set of flows and the behaviors they should exhibit.
Okta models the key actors (users, apps or services, resources to be accessed) with properties, and then specifies the behavior of each property for each flow.

These properties work together to create a token that is encoded with identity or access information. The token is passed on to identify the user (ID token), or access the resource (access token) that an app or service
is trying to access on behalf of the user (or workflow in the case of service-to-service flows).

### Authorization Code Flow and Proof Key for Code Exchange (PKCE)

(PKCE) is a stronger mechanism for binding the authorization code to the client than just a client secret,
and prevents a code interception attack if both the code and the client credentials are intercepted (which can happen on mobile/native devices).le
The PKCE-enabled client creates a large random string as a code verifier and derives a code challenge from it, using a code challenge method.
Then the client passes the code challenge and code challenge method in the authorization request for code flow. 
When a client tries to redeem the code, it must pass the code verifier. Okta recomputes the challenge and returns the requested token
only if it matches the code challenge in the original authorization request.

[More about PKCE in authorization requests](/docs/api/resources/oauth2.html#request-parameter-details)

### Tokens

The problem with username/password credentials is that they are not scoped to time limits, resources, or any other limitation.
A token replaces the user (resource owner) credentials, and typically contains information about time limits, scoping (which resources
can be accessed with the token), and other information. These tokens are opaque, and thus thwart many man-in-the-middle attacks.

Think of the token as a hotel-room key: once you've authenticated yourself (like you do at the front desk), the token contains
the information you need to access the resources an app is requesting on your behalf. 

#### Token Types

Our authentication APIs mint tokens for applications or services to consume, in order to deliver the resources requested by a user or service.
There are three basic types of tokens:

* Access tokens
* ID tokens
* Refresh tokens

For more about the differences between these token types, see [Response Types and Tokens](#response-types-and-tokens).

#### Authentication Tokens vs. Okta Session Tokens

Distinct from the ID tokens and access tokens minted in response to an authentication query,
Okta' Authentication API uses session tokens: a one-time bearer token issued when the authentication transaction completes with a `SUCCESS` status.
Session tokens may be redeemed for a session in Okta's Session API or converted to a session cookie. 

Session tokens are for use within Okta, while ID tokens, access tokens, and refresh tokens are for use when accessing third party resources.

* [More about session tokens](/docs/api/resources/sessions.html#session-token)
* [More about authentication tokens](link to section 4 in authN guide)

### Tokens and Related Properties in Okta
<!-- TMI? Anything worth keeping? -->

Properties serve as the model or stand-in for the various actors in an identity or delegated authentication flow.
At Okta, tokens are defined according to the OAuth 2.0 and OpenID Connect specs, and the actors involved are modeled by these properties:

* Applications or services are represented by the `application_type` property.
* The `grant_type` tells the Okta API endpoint what kind of flow to expect. For example, if `grant_type` is `authorization_code` (named after the flow), then the Okta API expects an authorization code to be included in the request.
* Which token you receive, also part of a flow definition, is represented by the value of `response_type`.

<!-- Need an image showing the different properties mapped to the actors. -->

Let's look at each of these properties in more detail, and explain how they map to the different flows.

#### App Types

In Okta, all apps and services are represented by a client application defined in Okta.

We support the following [app types](https://developer.okta.com/docs/api/resources/oauth-clients.html#client-application-model) for OAuth 2.0 and OpenID Connect:

* **Native** (iOS, Android): an app on a smart phone or other mobile device.
* **Single-Page App** (SPA): an app on the web that updates a single page as the user interacts with it, like GMail or (most of) Twitter.
* **Web App**: an app on the web with more than one page. It may be simple or complex.
* **Service App**: Common for IoT applications or whenever one service needs to talk to another without a user context.

When you create an app in Okta, you'll choose one of these types, represented by [the `application_type` property](/docs/api/resources/oauth-clients.html#client-application-properties).
Some apps, like a service app, require specific flows, while other app types may use a range of flows.

<!-- When Mysti executed some postman sample requests, she had trouble because app_type didn't match (?) something. Should mention this somewhere -->

#### Grant Types and Flows

A grant type is the method a client app or service uses to obtain a token.
Okta supports the following `grant_type` values, most named after the flows defined in the OAuth 2.0 and OpenID Connect specs:

* **Authorization code** (`authorization_code`): the flow will use a code passed to it from the authorization endpoint to complete delegated authentication to the app or service.
* **Implicit**: If no grant type is specified, and no `response_mode` is specified (or is specified as `fragment`, the default), the flow is implicit and <!-- I'm confused. Our docs indicate only OpenID Connect supports implicit, but the spec says it doesn't use it. Que? -->
* **Hybrid** (no grant type value): Hybrid grant types are a combination of the other grant types in a single flow. For example, ______________.
* **Password** (`password`): Use only in a trusted environment. A login page collects a user's credentials, then passes them to the security token service.
* **Client credentials** (`client_credentials`): Use only in a trusted environment. For machine-to-machine access. This flow is OAuth 2.0 only, because OpenID Connect is an identity protocol. With no user context, no ID token is needed.
* **Refresh token** (`refresh_token`): You may need a refresh token for long-running flows. 

So how do you know if these grant types (flows) represent an OAuth 2.0 or OpenID Connect context? As mentioned earlier, if you are requesting the `openid` scope, that's an OpenID Connect flow.
In Okta production orgs, you must have the API Access Management feature enabled to use custom authorization servers (regardless of the kind of token being requested). <!-- What else to say here to prevent problems? -->

#### Response Types and Tokens

The response type indicates what will be returned in the response: an ID token, an access token, a refresh token, an authorization code, or some combination of the four. 
If the information needed is only about the user, an ID token is sufficient. If additional information is needed, an access token may be required.

* ID token, for flows where the user needs to be identified. Don't send an ID token to an API.
* Access token, for flows where the user's access to a particular resource needs to be evaluated. Don't send an access token to identify a user.
* Refresh token, needed when the original token will expire before the flow is complete.
* An authorization code can be exchanged for an access token or refresh token in a subsequent request in the flow.

Why is the authorization code included in this list with the tokens? Because some flows have the user enter their username and password, 
which you don't want to share with other entities, so the authorization code is used for the duration of the flow.

Once you know the flow you want, you can specify the correction response type or combination of types:

| Response Type | ID Token | Access Token | Refresh Token | Authorization Code |
|:--------------|:---------|:-------------|:--------------|:-------------------|
| `code`        |          | &#10004;     | &#10004;      | &#10004;           |
| `id_token`    | &#10004; |              |               |                    |
| `token`       |          | &#10004;     |               |                    |


> Note: You can request ID tokens with no additional features enabled. You can request access tokens or ID tokens or both when Okta's API Access Management feature is enabled.
Remember that developer orgs have most features enabled, but production orgs require that API Access Management be purchased and enabled.

#### Okta API Endpoints

Okta provides two endpoints for OAuth 2.0 and OpenID Connect authentication: `/oauth2/:authorizationServerId/authorize` (`/oauth2/v1/authorize` for the Okta Org authorization server) and `/oauth2/:authorizationServerId/token` (`/oauth2/v1/token` for the Okta Org authorization server).
The authorize endpoint returns tokens and an authorization grant (`authorization_code`), while the `/token` endpoint consumes the `authorization_code`, and returns the requested tokens.

For authentication within Okta, you can use the Authentication API `/api/v1/authn`.

### Putting It All Together

Let's run through a few examples to help you put it all together.

#### Scenario One: Simple Identity

You need your app to authorize a user and know their email and full name. You aren't trying to access an API or other third-party resource.

* Flow: Implicit
<!-- Do we want examples in the overview? Can someone help Mysti craft them? -->