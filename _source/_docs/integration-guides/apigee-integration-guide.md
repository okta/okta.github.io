---
layout: docs_page
title: Apigee Integration Guide
excerpt: Integrate Okta's API Access Management with Apigee.
---
# Apigee Integration Guide

This guide describes the process of integrating Okta’s API Access Management with Apigee. Okta serves as an authorization server and mints access tokens for users. Amazon API Gateway proxies an API and checks for a valid token with appropriate scopes before allowing access to a resource.

## Example Integration

A [complete integration example](https://okta-api-am.herokuapp.com/apigee) on Heroku illustrates authentication and shows decoded access tokens for two different users.

## Prerequisites

To build your own integration you need:

* An API. You can complete this integration without an actual target API, but the integration assumes that you are using Apigee to proxy the endpoints: `/planets` and `/moons`, which are available in the public Okta solar system API:
    * [https://okta-solar-system.herokuapp.com/planets](https://okta-solar-system.herokuapp.com/planets)
    * [https://okta-solar-system.herokuapp.com/moons](https://okta-solar-system.herokuapp.com/moons)

* An Okta org with API Access Management enabled. ([Sign up for an Okta developer account](https://developer.okta.com/signup/))
* An [Apigee instance](https://login.apigee.com/sign__up)
* Web server and an application. Your application needs at least a simple page to accept access tokens coming back from Okta: `localhost` is sufficient.

## Set Up Your Scenario

The scenario:

* Users try to access a resource on a target resource server. We are going to set it up so that users must have a scope of `http://myapp.com/scp/silver` to access the endpoint `/planets` on the target server.
* Apigee bounces users who don't have a valid access token, including the required scope.

### Set Up an Okta Org

Set up your Okta groups and authorization server using [these instructions](/docs/integration-guides/setting-up-okta-for-integration-examples).

### Set Up an Apigee Instance

Use the [Apigee instructions](https://github.com/tom-smith-okta/okta-apigee) to download the proxy server definition and deploy it to your Apigee instance.
