---
layout: docs_page
title: Platform Release Notes July 20, 2016
---

# Release 2016.29

## Feature Enhancements

### New Response Parameter For Access Token Expiration

<!-- OKTA-94115 -->
The `expires_in` response parameter tells you the number of seconds before a `token` (Access Token) expires. If your
response from the `/oauth2/v1/authorize` endpoint includes an Access Token, `expires_in` is included in the response.

For more information, see the `/oauth2/v1/authorize` [Response Parameters](/docs/api/resources/oauth2#response-parameters).

### SHA256 Certificate for New SAML IdP Instances

<!-- OKTA-91496 -->
The default certificate used by new SAML IdP instances to sign assertions is a SHA256 certificate.
Existing SAML IdP instances will continue to use the certificate they currently have.

## Bug Fixed

The following issue is fixed:

* Requiring `okta-auth-js` didn't work unless you also defined global variables in the build flow. (OKTA-94206)

### Does Your Org Have These Changes Yet?

Check the footer of any Admin page in an org, for example the **Dashboard** or **Directory** tab, to verify the current release for that org.

### Looking for Product Release Notes?

For changes outside the Okta platform, see the [Release Notes Knowledge Hub](https://support.okta.com/help/articles/Knowledge_Article/Release-Notes-Knowledge-Hub).
