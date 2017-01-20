---
layout: docs_page
weight: 3
title: API Access Management
excerpt: Secure your APIs with Okta's implementation of the OAuth 2.0 standard.
---

# Overview

Okta provides an OpenID Connect certified implementation for authentication as well as OAuth 2.0 Authorization Server(s)
that apps can use to implement delegated authorization with app-specific scopes and claims using industry standard OAuth flows.

[OAuth 2.0](https://www.oauth.com) is an open standard that defines how to perform authentication securely. It decouples
authentication policy decisions from enforcement; like hotel key cards, but for apps. API Access Management is Okta's implementation of an authorization service which leverages Okta's
Universal Directory, groups, policies, multifactor authentication (MFA) and other features.

If you are new to OAuth 2.0, you can read a step-by-step exploration of the spec in [OAuth.com](https://www.oauth.com/oauth2-servers/background/).

## OAuth 2.0 and OpenID Connect
 
When do you use API Access Management and when do you use OpenID Connect?
 
### Simple Use Cases

Use OpenID Connect to authenticate a user and create or manage sessions. Use OAuth 2.0 for [delegated authorization](https://tools.ietf.org/id/draft-barnes-oauth-model-01.html) to a API resource. You don't need a session to access an API resource but often need a session to sign into an app.

### Complex Use Cases

You can also specify authorization servers in your OpenID Connect or OAuth 2.0 API calls. 
Every OpenID resource is also available in a version that lets you specify an authorization server that you created in Okta.
See [OpenID Connect and Authorization Servers](/docs/api/resources/oauth2.html#openid-connect-and-authorization-servers) for details.
 
## Benefits of API Access Management

Centralizing the management of your APIs makes it easier for others to consume your API resources.
Using Okta's OAuth-as-a-Service feature, API Access Management, provides many benefits:

* Create one or more hosted authorization servers, which makes it easier to manage sets of API access for multiple client apps across many customer types.
* Create custom scopes and claims. Map your claims to the profiles in your user directory. 
* Tokens are passed instead of credentials. In addition, the JWT tokens carry payloads for user context.
* Stay protected with security standards compliance.
* Manage API access with rules. Specifying the conditions under which actions are taken gives you precise and confident control over your APIs. 
* Control complex business requirements with polices and rules. You control the ordering and relationships.
* Let Okta do the work of consuming standards changes to provide more or better services.

> Note: In some places we have implemented stricter requirements or behaviors for additional security. 
 
## Customizing Login Flows with Okta and OAuth 2.0

Okta provides two open-source features that work with OAuth 2.0:
 
* [The Okta Sign-In Widget](/code/javascript/okta_sign-in_widget.html) gives you a customizable login experience
with the drop-in convenience of a JavaScript widget.

* [The Okta Auth SDK](/code/javascript/okta_auth_sdk.html) is a wrapper around the Sign-In Widget, and allows you
to own the user experience and build your own login flow.

### Okta Sign-in Widget

[The Sign-in Widget](https://github.com/okta/okta-signin-widget) is Okta's embeddable widget for end-to-end sign-in flow with MFA and account recovery:

* Returns an ID Token for an authenticated user 
* Supports [social authentication providers](/docs/api/resources/social_authentication.html) 
* Is built on the [Okta Auth SDK](/code/javascript/okta_auth_sdk.html)

### Okta Auth SDK

[The Okta Auth SDK](https://github.com/okta/okta-auth-js) wraps Okta authentication and session management APIs in JavaScript callbacks for custom user experiences that require functionality
beyond the Sign-in Widget.
This SDK implements custom web messaging with OAuth 2.0 response mode (``okta-post-message``) for single-page applications with a hidden iframe.

## Specifications Implemented by Okta
 
* [OpenID Connect Core 1.0](http://openid.net/specs/openid-connect-core-1_0.html) (spec) for Basic, Implicit and Hybrid flows
* [OpenID Provider Metadata](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata) (spec)
* [OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749) (RFC 6749) for Authorization Code flow, Implicit flow, and Resource Owner Password Credentials flow
* [OAuth 2.0 Bearer Token Usage](https://tools.ietf.org/html/rfc6750) (RFC 6750)
* [OAuth 2.0 Multiple Response Types](https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html) (spec) 
* [OAuth 2.0 Form Post Response Mode](http://openid.net/specs/oauth-v2-form-post-response-mode-1_0.html) (spec)
* [OAuth 2.0 Token Revocation](https://tools.ietf.org/html/rfc7009) (RFC 7009) 
* [OAuth 2.0 Token Introspection](https://tools.ietf.org/html/rfc7662) (RFC 7662) 
* [Proof Key for Code Exchange by OAuth Public Clients](https://tools.ietf.org/html/rfc7636) (RFC 7636)

## Putting the Pieces Together

The following is a high-level look at the basic components of API Access Management. 
We use the same terms as the OpenID Connect and OAuth 2.0 spec. For complete explanations, read those specs.

### Resource Servers and Okta Authorization Servers

The [OAuth 2.0 spec](https://tools.ietf.org/html/rfc6749#section-1.1) defines a resource server, owned
and operated by the API owner, which consumes access tokens. 
The spec also defines an authorization server, which Okta hosts as part of the API Access Management feature.
Authorization servers mint Access Tokens and ID Tokens.

Okta provides two types of authorization servers:

* [Org Authorization Server](#org-authorization-server): built-in with no configuration and simple behaviors
* [Resource-Domain Authorization Server](resource-domain-authorization-server): configurable and rich resource access policy

#### Org Authorization Server

Okta's Org Authorization Server requires no set up or configuration to mint ID Tokens and Access Tokens. 
This authorization server supports use cases that need OpenID Connect but not OAuth 2.0.

* Access policies are assignment based. Access is granted based on whether the user is assigned to the client app in Okta (directly or via groups).
* Scopes in a request are either all granted, or none are. 
* Audience (`aud`) for Access Tokens is always the Okta org:
    * If an Access Token is requested, it's only good for Okta APIs. The token can't be used for custom or internal APIs.
    * The Access Token format is opaque and shouldn't be parsed by the client. 
* [API requests](/docs/api/resources/oauth2.html#endpoints) include the Org Authorization Server: `/oauth2/:authorizationServerId/v1/[authorize|token|introspect|revoke]`.

#### Resource-Domain Authorization Server

You can create many Resource-Domain Authorization Servers. Create and configure them using the Okta user interface.
Use this authorization server if your use cases require OAuth 2.0 (alone or in addition to OpenID Connect).

* Access policies can reference many different resources, and support conditions on users, groups, and grant types. You can also
  configure token lifetimes.
* Scopes in a request can be evaluated according to rules that you configure.
* Audience (`aud`) for Access Tokens is a configurable identifier for your custom resources. 
    * If an Access Token is requested, it can be used for your custom or internal API: micro-services, API servers, or API resources.
    * The Access Token format is [JWT](https://tools.ietf.org/html/rfc7519).
* The Resource-Domain Authorization Server is referenced via an OAuth namespace specific to the authorization server: `/oauth2/{authServerId}/v1/[authorize|token|introspect|revoke]`

> Note: Okta documentation for the Resource-Domain Authorization Server uses the term "authorization server" unless otherwise specified.

[More information about resource servers](https://www.oauth.com/oauth2-servers/the-resource-server/)

### Tokens and Scopes

The two biggest security benefits of OAuth are using tokens instead of passing credentials and restricting the scope of tokens. 
Both of these measures go a long way toward mitigating the impact of a security compromise. 

* Sending usernames and passwords around is like putting all of your eggs in one basket. By using credentials to obtain a token, 
    if someone gains access to the token, they may be able to use it for a short time, but they haven't compromised the user's identity.
* Controlling what a token is entitled to access further limits damage in case of compromise. For example, scoping a token for shoppers 
    on a web site, and not allowing them access to change prices, provides significant mitigation.

Okta helps you manage ID Tokens (OpenID Connect) and Access Tokens (OAuth 2.0).

[More information about scopes](https://www.oauth.com/oauth2-servers/scope/) | 
[More information about Access Tokens](https://www.oauth.com/oauth2-servers/access-tokens/)

### Custom Claims

The JWT extension to the OAuth Framework lets you include custom claims in ID Tokens and Access Tokens. 
You can design tokens to disclose the information you want to share depending on the client and the scope of the tokens.
For example, a shopping site might have one set of claims for customers while they browse, but another claim for admin functions
like changing their personal information.

Custom claims also help you by reducing the number of lookup calls required to retrieve user information from the identity provider (IdP).
This benefit depends, of course, on the level of security your apps require. 

## Getting Started with API Access Management

* [Set up an authorization server](https://help.okta.com/en/prev/Content/Topics/Security/API_Access.htm) and use the power of Okta's API Access Management.
* Visit [the API Access Management endpoint documentation](/docs/api/resources/oauth2.html) and start building your integration today.
* For simpler use cases focused on single-sign on, visit [the OpenID Connect documentation](/docs/api/resources/oidc.html).
