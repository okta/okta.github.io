---
layout: docs_page
title: Amazon API Gateway Integration Guide
excerpt: Integrate Okta's API Access Management with Amazon API Gateway.
---
# Amazon API Gateway Integration Guide

This guide describes the process of integrating Okta’s API Access Management with Amazon API Gateway. Okta serves as an authorization server and mints access tokens for users. Amazon API Gateway proxies an API and checks for a valid token with appropriate scopes before allowing access to a resource.

## Example Integration

A [complete integration example](https://okta-api-am.herokuapp.com/aws) on Heroku illustrates authentication and shows decoded access tokens for two different users.

## Prerequisites

To build your own integration you need:

* An Okta org with API Access Management enabled. ([Sign up for an Okta developer account](https://developer.okta.com/signup/))
* An Amazon Web Services account. ([Sign up for an AWS account](https://portal.aws.amazon.com/billing/signup?redirect_url=https%3A%2F%2Faws.amazon.com%2Fregistration-confirmation#/start))
* Web server and an application. Your application needs at least a simple page to accept access tokens coming back from Okta: `localhost` is sufficient.

## Set Up For Example Integration

For this example integration, assume:

* Users try to access a resource on a target resource server. We are going to set it up so that users must have a scope of `http://myapp.com/scp/silver` to access the endpoint `/planets` on the target server.
* Amazon API Gateway bounces users who don't have a valid access token, including the required scope.

### Set Up an Okta Org

Set up your Okta groups and authorization server using [these instructions](/docs/integration-guides/setting-up-okta-for-integration-examples).

### Set Up an Amazon API Gateway

If you don't already have an API set up in Amazon API Gateway, use the [Amazon Getting Started with API Gateway Guide](https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started.html) to set up a pet store API.

Then set up a lambda authorizer function - which parses Okta jwts - and add it to your API Gateway, using [these instructions](https://github.com/mcguinness/node-lambda-oauth2-jwt-authorizer).
