---
layout: docs_page
title: OpenID Connect and Okta
excerpt: This simple identity layer on top of the OAuth 2.0 protocol makes identity management easier.
icon: /assets/img/icons/openid.svg
---

# OpenID Connect and Okta

OpenID Connect is a simple identity layer on top of the OAuth 2.0 protocol, which allows computing clients to verify the identity of an end-user based on the authentication performed by an authorization server, as well as to obtain basic profile information about the end-user in an interoperable and REST-like manner.
In technical terms, OpenID Connect specifies a RESTful HTTP API, using JSON as a data format.

OpenID Connect allows a range of clients to request and receive information about authenticated sessions and end-users, including
web-based clients, mobile apps, and JavaScript clients.
The [specification suite](http://openid.net/connect/) is extensible, supporting optional features such as encryption of identity data, discovery of OpenID Providers, and session management.

Okta is [certified for OpenID Connect](http://openid.net/certification/) for Basic, Implicit, Hybrid, and Configuration Publishing.

## Authorization Servers

Okta provides two types of authorization servers:

* Okta Authorization Server requires no configuration, and supports SSO use cases. 
* Custom Authorization Server is configurable. It supports the use of OpenID Connect with Okta's API Access Management,
an Okta feature that helps you secure access to your API.

## Dynamic Client Registration

Okta provides [dynamic client registration](/docs/api/resources/oauth-clients.html), operations to register and manage
client applications for use with Okta's OAuth 2.0 and OpenID Connect endpoints.
You can also perform these operations in the [Apps API](/docs/api/resources/apps.html).

## More Information
 
For more information about Okta and OpenID Connect, see:

* [Okta's API Access Management Introduction](/use_cases/api_security/)
* [API for OpenID Connect](/docs/api/resources/oidc.html)
