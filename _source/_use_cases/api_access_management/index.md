---
layout: docs_page
weight: 3
title: API Access Management
excerpt: Secure your APIs with Okta's implementation of the OAuth 2.0 standard.
---

# Overview

Use API Access Management, Okta's implementation of the OAuth 2.0 standard, to secure your APIs.
API Access Management is integrated with Okta's implementation of OpenID Connect for authentication;
OpenID Connect is also available separately. Similarly, Okta provides a client management API
for onboarding, monitoring, and deprovisioning client apps.

## OAuth 2.0 and OpenID Connect
 
When do you use API Access Management and when do you use OpenID Connect?
 
### Simple Use Cases

In general, use OpenID Connect to sign users into apps, and use API Access Management to secure your APIs: 
create one or more authentication servers, define scopes and claims, and create policies and rules to determine who can access your API resources.

For example:

* Use Case 1 (API Access Management): You need to control API access for a variety of consumers: vendors, employees, and customers, for example.
* Use Case 2 (OpenID Connect): You want users to sign into your custom web application to access their account. 

### Complex Use Cases

You can also specify authorization servers in your OpenID Connect API calls. 
Every OpenID resource is also available in a version that lets you specify an authorization server that you created in Okta.
See [OpenID Connect and Authorization Servers](/docs/api/resources/oauth2.html#openid-connect-and-authorization-servers) for details.
 
## Benefits of API Access Management

Centralizing the management of your APIs makes it easier for others to consume your API resources.
Using Okta's OAuth-as-a-Service feature, API Access Management, provides many benefits:

* Create one or more hosted authentication servers, which makes it easier to manage sets of API access for multiple client apps across many customer types.
* Create custom scopes and claims. Map your claims to the profiles in your user directory. 
* Tokens are passed instead of credentials. In addition, the JWT tokens carry payloads for user context.
* Stay protected with security standards compliance.
* Manage API access with rules. Specifying the conditions under which actions are taken gives you precise and confident control over your APIs. 
* Control complex business requirements with polices and rules. You control the ordering and relationships.
* Enjoy the highest quality, always-available API Access Management. 
* Let Okta do the work of consuming standards changes to provide more or better services.

> Note: In some places we have implemented stricter requirements or behaviors for additional security.  

## Putting the Pieces Together

The following is a high-level look at the basic components of API Access Management. 
We use the same terms as the OpenID Connect and OAuth 2.0 spec. For complete explanations, read those specs.

### Tokens and Scopes

The two biggest security benefits of OAuth are using tokens instead of passing credentials and restricting the scope of tokens. 
Both of these measures go a long way toward mitigating the impact of a security compromise. 

* Sending usernames and passwords around is like putting all of your eggs in one basket. By using credentials to obtain a token, 
    if someone gains access to the token, they may be able to use it for a short time, but they haven't compromised the user's identity.
* Controlling what a token is entitled to access further limits damage in case of compromise. For example, scoping a token for shoppers 
    on a web site, and not allowing them access to change prices, provides significant mitigation.

Okta helps you manage ID Tokens (OpenID Connect) and Access Tokens (OAuth 2.0).

### Custom Claims

The JWT extension to the OAuth Framework lets you include custom claims in ID and Access Tokens. 
You can design tokens to disclose the information you want to share depending on the client and the scope of the tokens.
For example, a shopping site might have one set of claims for customers while they browse, but another claim for admin functions
like changing their personal information.

Custom claims also help you by reducing the number of lookup calls required to retrieve user information from the identity provider (IdP).
This benefit depends, of course, on the level of security your apps require. 

## Getting Started with API Access Management

* [Set up an authorization server](https://help.okta.com/en/prev/Content/Topics/Security/API_Access.htm) and use the power of Okta's API Access Management.
* Visit [the API Access Management endpoint documentation](/docs/api/resources/oauth2.html) and start building your integration today.
* For simpler use cases focused on single-sign on, visit [the OpenID Connect documentation](/docs/api/resources/oidc.html).
