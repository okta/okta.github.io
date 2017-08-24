---
layout: quickstart_partial
libraryName: Okta Sign-In Page
---

##### Overview

The Okta Sign-In Page provides the easiest, most secure way to allow users to authenticate into your application.

{% img okta-sign-in-page.png alt:"Okta Sign-In Page" width:"800" %}

##### Sign-In Page

By default, the Sign-In page is accessible through the `/authorize` OAuth 2.0 and OpenID Connect endpoint. If a user **does not** have an existing Okta session, they will be prompted to login via the [Okta Sign-In Widget](/code/javascript/okta_sign-in_widget.html). Once a user is authenticated, Okta will redirect back to your application, based on the `redirect_uri` specified in your `/authorize` request.

Click here for more information on the [OAuth 2.0 Authorization Grant](/docs/api/resources/oauth2.html#obtain-an-authorization-grant-from-a-user).
