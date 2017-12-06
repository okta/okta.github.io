---
layout: docs_page
---

# Release 2016.33

## Bugs Fixed

The following issues are fixed:

* Custom SAML apps couldn't update their signing key credentials via API. (OKTA-93959)
* When configuring OpenID Connect client apps, the App Embed Links dialog displayed custom login and error page sections that weren’t applicable. (OKTA-95526)
* Using an API token created by a ReadOnly Admin caused a permission error when GET requests were sent to `/api/v1/users/:uid/factors` or `/api/v1/users/:uid/factors/catalog`. (OKTA-95569)
* GET requests to `oauth2/v1/authorize` that specified the Form Post Response Mode sometimes 
failed to receive `expires_in` and `scope` in the response. (OKTA-98245)
