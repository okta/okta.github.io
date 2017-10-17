---
layout: docs_page
title: Choose an OAuth 2.0 Flow
excerpt: How to choose an OAuth 2.0 flow, including OpenID Connect
---

# Choosing a Flow

OAuth 2.0 is a delegated authorization framework, and OpenID Connect
is a high assurance, modern identity protocol layer over OAuth 2.0.

Authentication and authorization transactions are composed of many individual requests and responses.
Each set of transactions from end user to desired resource and back is called a flow. 

The flows defined in OAuth 2.0 and OpenID Connect overlap and present many options, so you may not be sure which flow to use.
This topic explain the options we've implemented in Okta in accordance with the specs, and provides guidance around when to use which flow.

## Grant Types and Flows

A grant type is the method a client app or service uses to obtain a token, and maps to a particular flow.
The overall goal of a flow is to obtain a token with information about the user or service requesting authentication, and the secure permission to access the app or service being queried.

To choose the best flow for what you want to achieve, you must know a few things:

* Are you authorizing a **user** and authenticating them, or do you have a **service-to-service** application?
* Are you requesting access within **a protected environment** (confidential client)?
* Is your app a mobile app, or in a browser?

Here's a quick-reference table to help you choose a flow:

| Factors                                     | Authorization Code    | Implicit        | Hybrid      | Resource Owner Password | Client Credentials |
|:--------------------------------------------|:----------------------|:----------------|:------------|:------------------------|:-------------------|
| Trusted environment                         | Not recommended       | Not recommended |             | Required                | Required           |
| Service account (no user)                   | Not recommended       | Not recommended |             | Not recommended         | Required           |
| Single-Page app                             | Not recommended       | Recommended     |             | Not recommended         | Not recommended    |
| Web app on a server                         | Recommended           |                 |             |                         |                    |
| Mobile (native app)                         | Recommended with PKCE |                 |             |                         |                    |
| Different tokens for front end and back end |                       |                 | Recommended |                         |                    |

Okta supports the following flows and their corresponding `grant_type` values:

* **Authorization code** (`authorization_code`): the flow uses a code passed to it from the authorization endpoint to complete delegated authentication to an app or service.
  The authorization code flow is best used by server-side apps where the source code is not publicly exposed. The apps should be server-side because the request that exchanges the authorization code for a token requires a client secret, which will have to be stored in your client. 
  The server-side app requires an end-user, however, because it relies on interaction with the end-user's web browser which will redirect the user and then receive the authorization code.

* **Authorization code** with PKCE: 
  For native/mobile applications, the client secret cannot be stored in the application because it could easily be exposed. Additionally, mobile callbacks use `app://` protocols, which are prone to interception.
  A rogue application can intercept the authorization code as it is being passed through the mobile/native operating system. Therefore native apps should make use of Proof Key for Code Exchange (PKCE), which acts like a secret but isn't hard coded, to keep the authorization code flow secure.
  
  PKCE is an extension to the regular authorization code flow: PKCE elements are included in some steps of the flow. 
  The PKCE-enhanced flow requires your application to generate a cryptographically random key called a code verifier. A code challenge is then created from the verifier, and this challenge is passed along with the request for the authorization code.
  
  When the authorization code is sent in the access token request, the code verifier is sent as part of the request. The authorization server recomputes the challenge from the verifier using an agreed-upon hash algorithm and then compares that. If the two code challenges and verifier match, then it knows that both requests were sent by the same client. 
  A rogue app could only intercept the authorization code, but it would not have access to the code challenge or verifier, since they are both sent over HTTPS.
  
* **Implicit**: Like the authorization code flow, implicit works well for applications where the confidentiality of the client secret cannot be guaranteed.
  Because the client does not have the client secret, it can't request a token directly, and instead receives the access token from the authorization response. 
  Use it with Single Page Applications (SPA), since the the client must interact with the resource owner's user-agent and receive incoming requests (via redirection) from the authorization server.

  No grant type is specified, and no `response_mode` is specified (or is specified as `fragment`, the default) for implicit flows.

* **Hybrid** (no grant type value): Use this flow if you need a separate token for the front end and back end. 
  It's recommended if your client wants to make as few calls as possible, but you need more functionality than the implicit flow provides.

* **Resource Owner Password** (`password`): Use only in a trusted environment. A login page collects a user's credentials, then passes them to the security token service.
  Use this flow if you control both the client application and the resource that it is interacting with. 
  Since this flow requires that the client can be trusted with the resource owner's credentials, it's most often used for online services, like the Facebook client applications that interact with the Facebook service. 
  It doesn't require redirects like the authorization code or implicit flows, and involves a single authenticated call to the token endpoint.

* **Client Credentials** (`client_credentials`): Use only in a trusted environment for service-to-service access. This flow is OAuth 2.0 only, because OpenID Connect is an identity protocol. With no user context, no ID token is needed.
  The client credentials flow is intended for confidential (server-side) client applications with no end user. The application must be server-side because it must be trusted with the client secret.
  Since the credentials are hard coded, this flow can't be used by an actual end user. A single, authenticated request to the token endpoint returns an access token.

* **Refresh Token** (`refresh_token`): You may need a refresh token for long-running flows.
  Refresh tokens aren't a flow. If a previous authorization has been initiated by a flow and a refresh token was returned, another can be requested, except for single-page apps which can't use them.

These (flows) represent an OpenID Connect context if you are requesting the `openid` scope. Otherwise, it's an OAuth 2.0 flow (or combination of the two).

### Response Types and Tokens

The problem with username/password credentials is that they are not scoped to time limits, resources, or any other limitation.
A token replaces the user (resource owner) credentials, and typically contains information about time limits, scoping (which resources
can be accessed with the token), and other information. These tokens are opaque, and thus thwart many man-in-the-middle attacks.

Think of the token as a hotel-room key: once you've authenticated yourself (like you do at the front desk), the token contains
the information you need to access the resources an app is requesting on your behalf.

The response type indicates what will be returned in the response: an ID token, an access token, a refresh token, an authorization code, or some combination of the four. 
If the information needed is only about the user, an ID token is sufficient. If additional information is needed, an access token may be required.

* ID token, for flows where the user needs to be identified, such as logging in to Okta. Don't send an ID token to an API.
* Access token, for flows where the user's access to a particular resource needs to be evaluated, such as when a user needs access to a third-party API. Don't send an access token to identify a user.
* Refresh token, needed when the original token will expire before the flow is complete.
* An authorization code can be obtained during user authentication, then exchanged for an access token or refresh token in a subsequent request in the flow.

Once you know the flow you want, you can specify the correction response type or combination of types:

| Response Type | ID Token | Access Token | Refresh Token | Authorization Code |
|:--------------|:---------|:-------------|:--------------|:-------------------|
| `code`        |          | &#10004;     | &#10004;      | &#10004;           |
| `id_token`    | &#10004; |              |               |                    |
| `token`       |          | &#10004;     |               |                    |

> Note: You can request ID tokens with no additional features enabled. You can request access tokens or ID tokens or both when Okta's API Access Management feature is enabled.
Remember that developer orgs have most features enabled, but production orgs require that API Access Management be purchased and enabled.

### Tokens and Related Properties

Properties serve as the model or stand-in for the various actors in an identity or delegated authentication flow.
At Okta, tokens are defined according to the OAuth 2.0 and OpenID Connect specs, and the actors involved are modeled by these properties:

* Applications or services are represented by the `application_type` property.
* The `grant_type` tells the Okta API endpoint what kind of flow to expect. For example, if `grant_type` is `authorization_code` (named after the flow), then the Okta API expects an authorization code to be included in the request.
* Which token you receive, also part of a flow definition, is represented by the value of `response_type`.

<!-- Need an image showing the different properties mapped to the actors. Or maybe we don't need this section or the next one? -->

Let's look at each of these properties in more detail, and explain how they map to the different flows.

### More About Application Types

In Okta, all apps and services are represented by a client application defined in Okta.

We support the following [app types](https://developer.okta.com/docs/api/resources/oauth-clients.html#client-application-model) for OAuth 2.0 and OpenID Connect:

* **Native** (iOS, Android): an app on a smart phone or other mobile device.
* **Single-Page App** (SPA): an app on the web that updates a single page as the user interacts with it, like GMail or (most of) Twitter.
* **Web App**: an app on the web with more than one page. It may be simple or complex.
* **Service App**: Common for IoT applications or whenever one service needs to talk to another without a user context.

When you create an app in Okta, you'll choose one of these types, represented by [the `application_type` property](/docs/api/resources/oauth-clients.html#client-application-properties).
Some apps, like a service app, require specific flows, while other app types may use a range of flows.