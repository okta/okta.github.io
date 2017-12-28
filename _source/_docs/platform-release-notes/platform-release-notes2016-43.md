---
layout: docs_page
title: Platform Release Notes
excerpt: Summary of changes to the Okta Platform since Release 2016.41
---

# Release 2016.43

<!-- Feature Enhancement: New Version of Okta Sign-In Widget

The new version of Okta Sign-In Widget, 1.8.0, is available:

* Localized security questions
* Added Microsoft as a Social Provider
* Added an option to provide your own dependencies

Learn about these and other improvements in [the GitHub repository](https://github.com/okta/okta-signin-widget/releases/tag/okta-signin-widget-1.8.0).
-->

### Enhanced Well-Known Endpoint for OpenID Connect

The [OpenID Connect discovery endpoint](/docs/api/resources/oidc.html#openid-connect-discovery-document) `.well-known` includes the introspection and revocation endpoints.

Request Example:

~~~sh
GET https://${org}.example.com/.well-known/openid-configuration
~~~

Response Example:

~~~sh
{
    "issuer": "https://{yourOktaDomain}.com",
    "authorization_endpoint": "https://{yourOktaDomain}.com/oauth2/v1/authorize",
    "token_endpoint": "https://{yourOktaDomain}.com/oauth2/v1/token",
    "userinfo_endpoint": "https://{yourOktaDomain}.com/oauth2/v1/userinfo",
    "jwks_uri": "https://{yourOktaDomain}.com/oauth2/v1/keys",
    "response_types_supported": [
        "code",
        "code id_token",
        "code id_token token",
        "id_token",
        "id_token token",
        "token"
    ],
    ...
    "introspection_endpoint": "https://{yourOktaDomain}.com/oauth2/v1/introspect",
    "introspection_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "none"
    ],
    "revocation_endpoint": "https://{yourOktaDomain}.com/oauth2/v1/revoke",
    "revocation_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "none"
    ]
}
~~~

### New Function for Replacing Strings

Use the [Expression Language](/reference/okta_expression_language/index.html) function `String.replaceFirst` to replace the first occurrence of a string.

Example:

`String.replaceFirst("This list includes chores", "is", "at") = "That list includes chores"`

In release 2016.41 we introduced the string replacement function `String.replace`, which replaces all instances of a specified string.

### Platform Bug Fixed

POST requests to `/api/v1/sessions` failed with an InvalidSessionException if the request specified a
`sessionToken` but no API token was included. (OKTA-104965)

### Does Your Org Have These Changes Yet?

Check the footer of any Admin page in an org to verify the current release for that org. For example,
scroll to the bottom of the Admin <b>Dashboard</b> page to see the version number:

{% img release_notes/version_footer.png alt:"Release Number in Footer" %}
