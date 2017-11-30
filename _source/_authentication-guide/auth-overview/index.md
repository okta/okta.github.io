---
layout: docs_page
weight: 1
title: Authentication Overview
---

# Authentication Overview

This page will give you an overview of OAuth 2.0 and OpenID Connect and their Okta implementations. It will explain the different flows, and help you decide which flow is best for you based on the type of application that you are building. If you already know what kind of flow you want, you can jump directly to:

- [Implementing OAuth 2.0 Authentication](/authentication-guide/implementing-authentication/)
- [SAML Authentication with OIDC](/authentication-guide/saml-login/)
- [Social Login](/authentication-guide/social-login/)
- [Working With OAuth 2.0 Tokens](/authentication-guide/tokens/)

## Authentication API vs OAuth 2.0 vs OpenID Connect

There are three major kinds of authentication that you can perform with Okta:

- The [Authentication API](/docs/api/resources/authn.html) controls access to your Okta org and applications. It provides operations to authenticate users, perform multi-factor enrollment and verification, recover forgotten passwords, and unlock accounts. It is the underlying API that the Okta Sign-in Widget and Auth JS use under the hood.
- The [OAuth 2.0](/docs/api/resources/oauth2.html) protocol controls authorization to access a protected resource, like your web app, native app, or API service.
- The [OpenID Connect](/docs/api/resources/oidc.html) protocol is built on the OAuth 2.0 protocol and helps authenticate users and convey information about them. It is also more opinionated than plain OAuth 2.0, for example in its scope definitions.

If you would like to work with the Okta API and control user access to Okta, then you should use [the Authentication API](/docs/api/resources/authn.html).

If you are interested in controlling access to your own application, then use the OAuth 2.0 and OpenID Connect (OIDC) protocols. The OAuth 2.0 protocol will allow you to delegate authorization, while the OIDC protocol will allow you retrieve and store authentication information about your end-users. The Okta Authentication Guide is intended to help you figure out how to implement and use OAuth 2.0 and OIDC with Okta. 

### Authentication API

The Okta Authentication API controls access to your Okta org and applications by creating and controlling Okta session tokens. Okta session tokens are one-time tokens issued when the authentication transaction completes successfully. Session tokens may be redeemed for a session in Okta's Session API or converted to a session cookie. 

Session tokens are for use within Okta, while ID tokens, access tokens, and refresh tokens are usually for accessing third party resources, such as your application.

The Authentication API is used by the Okta Sign-In Widget as well as the AuthJS library. Both AuthJS and the Authentication API are intended for advanced use cases.

You can find out more about the Authentication API in our [API Reference](/docs/api/resources/authn.html).

### OAuth 2.0

OAuth 2.0 is a standard that apps use to provide client applications with access. If you would like to grant access to your application data in a secure way, then you want to use the OAuth 2.0 protocol. 

The OAuth 2.0 spec has four important roles:

- The "authorization server", which is the server that issues the access token. In this case Okta is the authorization server. 
- The "resource owner", normally your application's end-user, that grants permission to access the resource server with an access token. 
- The "client", which is the application that requests the access token from Okta and then passes it to the resource server.
- The "resource server", which accepts the access token and must verify that it is valid. In this case this is your application.

Other important terms: 

- An OAuth 2.0 "grant" is the authorization given (or "granted") to the client by the user. Examples of grants are "authorization code" and "client credentials".
- The "access token" is issued by the authorization server (Okta) in exchange for the grant.
- The "refresh token" is an optional token that is exchanged for a new access token if the access token has expired.

The usual OAuth 2.0 grant flow looks like this:

1. Client requests authorization from the resource owner (usually the user). 
2. If the user gives authorization, the client passes the authorization grant to the authorization server (in this case Okta).
3. If the grant is valid, the authorization server returns an access token, possibly alongside a refresh and/or ID token.
4. The client now uses that access token to access the resource server.

> For a deeper dive into OAuth 2.0, see [What the Heck is OAuth?](/blog/2017/06/21/what-the-heck-is-oauth.html) over on the Okta Developer blog.
> 
> If you'd like to see the OAuth 2.0 spec, you can find it here: <https://tools.ietf.org/html/rfc6749>

At the core of both OAuth 2.0 and its OpenID Connect extension is the authorization server. An authorization server is simply an OAuth 2.0 token minting engine. Each authorization server has a unique issuer URI
and its own signing key for tokens in order to keep proper boundary between security domains. In the context of this guide, Okta is your authorization server.

The authorization server also acts as an OpenID Connect Provider,
which means you can request [ID tokens](/standards/OIDC/index.html#id-token)
in addition to [access tokens](/standards/OAuth/#access-token) from the authorization server endpoints.

### OpenID Connect

OpenID Connect is an authentication standard built on top of OAuth 2.0. It adds an additional token called an ID token. OpenID Connect also standardizes areas that OAuth 2.0 leaves up to choice, such as scopes, endpoint discovery, and dynamic registration of clients. Okta is [OpenID Certified](https://openid.net/certification/).

Although OpenID Connect (OIDC) is built on top of OAuth 2.0, the specification uses slightly different terms for the roles in the flows:

- The "OpenID provider", which is the authorization server that issues the ID token. In this case Okta is the OpenID provider. 
- The "end-user" whose information is contained in the ID token.
- The "relying party", which is the client application that requests the ID token from Okta.

- The "ID token" is issued by the OpenID Provider and contains information about the End-User in the form of claims.
- A "claim" is a piece of information about the End-User.

The high-level flow looks the same for both OIDC and regular OAuth 2.0 flows, the primary difference being simply that an OIDC flow results in an ID token, in addition to any access or refresh tokens.

> Note: If you would like to see the OpenID Connect specification, you can find it here: <https://openid.net/connect/>

## Choosing an OAuth 2.0 Flow

Depending on what kind of client you are building, you will want to use a different OAuth 2.0 flow. The flowchart below can quickly help you decide which flow to use. Further explanation about each flow is included below.

{% img oauth_grant_flowchart.png alt:"OAuth Flow Diagram" width:"800px" %}

<!-- Source for image. Generated using http://www.plantuml.com/plantuml/uml/

@startuml

skinparam monochrome true

start

if (Is your client public?) then (yes)
    if (Is your client a SPA or native app?) then (SPA)
    :Implicit Flow;
    end      
    else (native)
    :Auth Code w PKCE;
    end
    endif
else(no)

if (Does the client have \nan end-user?) then (no)
  :Client Credentials Flow;
  end
else (yes)

if (Is the client highly trusted \nand other flows are not \nviable?) then (yes)
  :Resource Owner Flow;
  end
else (no)
  :Authorization Code Flow;
  end

@enduml

-->

##### Is your client public? 

A client application is considered "public" when an end-user could possibly view and modify the code. This includes Single Page Apps (SPAs) or any mobile or native applications. In both cases, the application cannot keep secrets from malicious users. 

###### Is your client a SPA or native?

If your client application is a Single Page Application (SPA), you should use the [Implicit flow](#implicit-flow).

If your client application is a native application, you should use the [Authorization code flow with PKCE](#authorization-code-with-pkce).

##### Does the client have an end-user?

If your client application is running on a server with no direct end-user, then it can be trusted to store credentials and use them responsibly. If your client application will only be doing machine-to-machine interaction, then you should use the [Client Credentials flow](#client-credentials-flow). 

##### Does the resource owner own the client?

If you own both the client application and the resource that it is accessing, then your application can be trusted to store your end-user's login and password. Because of the high degree of trust required here, you should only use this flow if other flows are not viable. In this case, you can use the [Resource Owner Password flow](#resource-owner-password-flow).

### Authorization Code Flow

The Authorization Code flow is best used by server-side apps where the source code is not publicly exposed. The apps should be server-side because the request that exchanges the authorization code for a token requires a client secret, which will have to be stored in your client. The server-side app requires an end-user, however, because it relies on interaction with the end-user's web browser which will redirect the user and then receive the authorization code.

{% img oauth_auth_code_flow.png alt:"Auth Code Flow" width:"800px" %}

<!-- Source for image. Generated using http://www.plantuml.com/plantuml/uml/

@startuml

skinparam monochrome true

actor "Resource Owner (User)" as user
participant "Client" as client
participant "Authorization Server (Okta)" as okta
participant "Resource Server (Your App)" as app

client -> okta: Authorization Code Request to /authorize
okta -> user: 302 redirect to authentication prompt
user -> okta: Authentication & consent
okta -> client: Authorization Code Response
client -> okta: Send authorization code + client secret to /token
okta -> client: Access token (and optionally Refresh Token)
client -> app: Request with access token
app -> client: Response

-->

For information how to set up your application to use this flow, see [Implement the Authorization Code Flow](/authentication-guide/implementing-authentication/auth-code.html).

### Authorization Code with PKCE

For native/mobile applications, the client secret cannot be stored in the application because it could easily be exposed. Additionally, mobile redirects use `app://` protocols, which are prone to interception. Basically, a rogue application could intercept the authorization code as it is being passed through the mobile/native operating system. Therefore native apps should make use of Proof Key for Code Exchange (PKCE), which acts like a secret but isn't hard-coded, to keep the Authorization Code flow secure.

PKCE is an extension to the regular Authorization Code flow, so the flow is very similar, except that PKCE elements are included at various steps in the flow. 

The PKCE-enhanced Authorization Code flow requires your application to generate a cryptographically random key called a "code verifier". A "code challenge" is then created from the verifier, and this challenge is passed along with the request for the authorization code.

When the authorization code is sent in the access token request, the code verifier is sent as part of the request. The authorization server recomputes the challenge from the verifier using an agreed-upon hash algorithm and then compares that. If the two code challenges and verifier match, then it knows that both requests were sent by the same client. 

A rogue app could only intercept the authorization code, but it would not have access to the code challenge or verifier, since they are both sent over HTTPS.

{% img oauth_auth_code_flow_pkce.png alt:"Auth Code Flow with PKCE" width:"800px" %}

<!-- Source for image. Generated using http://www.plantuml.com/plantuml/uml/

@startuml

skinparam monochrome true

actor "Resource Owner (User)" as user
participant "Client" as client
participant "Authorization Server (Okta)" as okta
participant "Resource Server (Your App)" as app

client -> client: Generate PKCE code verifier & challenge
client -> okta: Authorization Code Request + code_challenge to /authorize
okta -> user: 302 redirect to authentication prompt
user -> okta: Authentication & consent
okta -> client: Authorization Code Response
client -> okta: Send authorization code + code_verifier to /token
okta -> okta: Evaluates PKCE code
okta -> client: Access token (and optionally Refresh Token)
client -> app: Request with access token
app -> client: Response

-->

For information how to set up your application to use this flow, see [Implement the Authorization Code Flow with PKCE](/authentication-guide/implementing-authentication/auth-code-pkce.html).

### Implicit Flow

The Implicit Flow is intended for applications where the confidentiality of the client secret cannot be guaranteed. Because the client does not have the client secret, it cannot make a request to the `/token` endpoint, and instead receives the access token directly from the `/authorize` endpoint. We recommend it for use with Single Page Applications (SPA), since the the client must be capable of interacting with the resource owner's user-agent and capable of receiving incoming requests (via redirection) from the authorization server.

> NOTE: Because it is intended for less-trusted clients, the Implicit Flow does not support refresh tokens.

{% img oauth_implicit_flow.png alt:"Implicit Flow" width:"800px" %}

<!-- Source for image. Generated using http://www.plantuml.com/plantuml/uml/

skinparam monochrome true

actor "Resource Owner (User)" as user
participant "Client" as client
participant "Authorization Server (Okta)" as okta
participant "Resource Server (Your App)" as app

client -> okta: Access token request to /authorize
okta -> user: 302 redirect to authentication prompt
user -> okta: Authentication & consent
okta -> client: Access token response
client -> app: Request with access token
app -> client: Response
-->

For information how to set up your application to use this flow, see [Implement the Implicit Flow](/authentication-guide/implementing-authentication/implicit.html).

### Resource Owner Password Flow 

The Resource Owner Password Flow is intended for use cases where you control both the client application and the resource that it is interacting with. It requires that the client can store a client secret and can be trusted with the resource owner's credentials, and so is most commonly found in clients made for online services, like the Facebook client applications that interact with the Facebook service. It doesn't require redirects like the Authorization Code or Implicit flows, and involves a single authenticated call to the `/token` endpoint.

{% img oauth_password_flow.png alt:"Resource Owner Password Flow" width:"800px" %}

<!-- Source for image. Generated using http://www.plantuml.com/plantuml/uml/

skinparam monochrome true

actor "Resource Owner (User)" as user
participant "Client" as client
participant "Authorization Server (Okta)" as okta
participant "Resource Server (Your App)" as app

user -> client: Authenticates
client -> okta: Access token request to /token
okta -> client: Access token (+optional Refresh Token) response
client -> app: Request with access token
app -> client: Response

-->

For information how to set up your application to use this flow, see [Implement the Resource Owner Password Flow](/authentication-guide/implementing-authentication/password.html).

### Client Credentials Flow

The Client Credentials flow is intended for server-side (AKA "confidential") client applications with no end user, which normally describes machine-to-machine communication. The application must be server-side because it must be trusted with the client secret, and since the credentials are hard-coded, it cannot be used by an actual end-user. It involves a single, authenticated request to the `/token` endpoint, which returns an access token.

> NOTE: The Client Credentials Flow does not support refresh tokens.

{% img oauth_client_creds_flow.png alt:"Resource Owner Password Flow" width:"800px" %}

<!-- Source for image. Generated using http://www.plantuml.com/plantuml/uml/

skinparam monochrome true

participant "Client + Resource Owner" as client
participant "Authorization Server (Okta)" as okta
participant "Resource Server (Your App)" as app

client -> okta: Access token request to /token
okta -> client: Access token response
client -> app: Request with access token
app -> client: Response

-->

For information how to set up your application to use this flow, see [Implement the Client Credentials Flow](/authentication-guide/implementing-authentication/client-creds.html).