---
layout: docs_page
---

# Release 2016.26

# Releases are rolled out to organizations in a staggered fashion: first to preview orgs, then to production orgs.
Check the [Current Release Status](https://support.okta.com/help/articles/Knowledge_Article/Current-Release-Status) to verify whether the changes in this document have rolled out to your org yet.

## New Feature: API for Custom SMS Template

You can send custom text as part of an SMS message request:

1. Use the `/api/v1/templates/sms` endpoint to create a custom SMS text template. 
2. Send a request to the Factors API specifying the template for verification. There is no change in the response.

For more information, see [Templates API](/docs/api/resources/templates.html) and [Factors API](/docs/api/resources/factors.html).

## Feature Enhancement: Resource Owner Password Credential Flow for OpenID Connect Supports Refresh Tokens

The `/oauth2/v1/token` endpoint includes a Refresh Token if:

* The request contains a `grant_type` with the value `password` and your client supports the `grant_type` value `refresh_token`. For more information, see [Token Request](/docs/api/resources/oauth2.html#request-parameters-1).
* You request the `offline_access` scope. For more information, see [Refresh Tokens for Web and Native Applications](/docs/api/resources/oauth2.html#refresh-tokens-for-web-and-native-applications).

## Bugs Fixed

The following issue is fixed:

* For some customers, an API request for users that match a value for `last_name` didn't return all the matches. (OKTA-91367)
