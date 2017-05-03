---
layout: docs_page
weight: 1
title: Authentication
excerpt: Overview of the various ways Okta can be used to authenticate users depending on your needs.
---

# Introduction

Authentication is a crucial part of any application development.  Whether you are developing an internal IT app for your employees – or building a portal for your partners – or exposing a set of APIs for developers building apps around your resources, Okta Platform can provide the right support for your projects.

## Building apps supporting Single Sign-On

For IT or ISVs looking to use Okta as an identity provider, Okta
provides several options for secure single sign-on.  SAML has been
widely used as the single sign-on protocol by many ISVs and is
supported by many identity management solutions.  Okta provides
comprehensive guidance for developers to implement a proper
[SAML service provider](/docs/guides/saml_guidance.html).
For IT building internal apps and would like to support SSO, SAML is
also a good option.

OpenID Connect is the emerging technology providing an alternative
implementation of single sign-on.
Okta is a [Certified OpenID Connect provider](http://openid.net/certification/).
Building on top of OAuth 2.0 framework, OpenID Connect is a modern
implementation to support authentication and single sign-on.  If you
are an Okta customer, our [OpenID Connect endpoints](/docs/api/resources/oidc.html) are a great way to support SSO and
is a simpler alternative to SAML.

For ISVs that are looking at providing SSO for their customers, both
SAML and OpenID Connect are worth considering both to cover the
wide variety of identity providers that you may encounter.

## Building custom login experience for your application

The login experience is perhaps the single most important user
experience any app developer will need to consider.  To provide a
seamless, attractive, yet secure authentication experience is not a
trivial task.  And typically, the login logic goes hand in hand with
other features such as password reset and registration.  More
importantly, enhanced security in the form of strong and adaptive
authentication during login is often critical to many implementations.

Okta provides many options for developers around the authentication
experience.  Again, the core foundation is built on top of the
underlying feature set in the Okta platform.  Password policies,
Strong and Adaptive Authentication policies, Password Reset Workflow –
can all be configured easily in the Okta administration console in the Okta dashboard.
 Many of these policies can also be controlled through Okta's API.

## Sign-in Widget

The [Okta Sign-in Widget](/code/javascript/okta_sign-in_widget.html)
provides an embeddable Javascript sign-in implementation that can
easily be embedded into your customized login page.  The Sign-in
widget carries the same feature set in the standard Okta sign-in page
of every tenant – with the added flexibility to change the
look-and-feel.  Included in the widget is support for password reset,
forgotten password and strong authentication – all of which are  driven
by policies configured in Okta.  Developers don't have to write a
single line of code to trigger these functions from within the widget.
For consumer facing sites, social providers are also supported in the
widget.

## Auth SDK – a lightweight Javascript-based SDK

For those who are building a Javascript front end or Single Page App
(SPA), the [Okta Auth SDK](/code/javascript/okta_auth_sdk)
gives you the added control beyond our sign-in widget to cater to your
needs.  This Javascript SDK provides all the standard login support
including password management, strong authentication.  In addition,
social providers and OpenID Connect are also supported through the SDK where
the appropriate ID tokens are returned for downstream authentication
and authorization needs.

## Authentication APIs – REST APIs for any client

The underlying foundation for the sign-in widget and Auth SDK is a
comprehensive set of [authentication APIs](/docs/api/resources/authn.html) covering all aspects of
authentication exposed through the Okta Platform.  It can be used as a
standalone API to provide the identity layer on top of your existing
application and authentication logic, or it can be integrated with the
Okta [Sessions API](/docs/api/resources/sessions.html) to obtain an Okta [session cookie](/use_cases/authentication/session_cookie) and access apps within Okta to provide a single sign-on experience across custom and Okta-managed apps.

## Social Authentication

For many consumer-facing applications, authentication and registration
are increasingly relying on social identity providers such as
Facebook, LinkedIn and Google. Okta has [built-in support](/docs/api/resources/social_authentication.html) for these
social identity providers to support new user registration,
authentication and profile updates based on OAuth scopes from the
social providers.  For applications that have existing accounts, Okta
also provides support for account linking existing Okta accounts to
accounts on social identity providers.
