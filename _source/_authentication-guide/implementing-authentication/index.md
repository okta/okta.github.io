---
layout: docs_page
weight: 1
title: Implementing OAuth 2.0 Authentication
excerpt: How to implement an OAuth 2.0 flow in Okta
---

# Implementing Authentication

This section covers the steps required to set-up an OAuth 2.0 authentication flow for your application in Okta. 

Before you can use OAuth 2.0 flows with Okta, you will need an Authorization Server. If you have an Okta Developer Account, you already have a default Authorization Server created for you. 

If you don't have an existing authorizations server, or would like to create a new one, then you can find out how to do that in the [Setting up an Authorization Server](set-up-authz-server) section.

Once you have an authorization server, you can then implement an OAuth 2.0 flow. 

> NOTE: For more information on which flow to use, see [Which OAuth 2.0 flow to use?](/authentication-guide/auth-overview/#which-oauth-20-flow-to-use).

| Type of Application     | OAuth 2.0 Flow|
|-----------------------------|----------------------------------------|
| Server-side (AKA Web)    | [Authorization Code Flow](auth-code)|
| Single-Page Application   | [Implicit Flow](implicit)|
| Native Mobile          | [Authorization Code Flow with PKCE](auth-code-pkce)|
| Trusted               | [Resource Owner Password Flow](password)|
| Service               | [Client Credentials](client-creds)|