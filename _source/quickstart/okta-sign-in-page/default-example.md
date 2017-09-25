---
layout: quickstart_partial
libraryName: Okta Sign-In Page
---

##### Overview

The Okta Sign-In Page provides the easiest, most secure way to allow users to authenticate into your application.  The Sign-In Page is hosted by Okta on the domain of your Okta Org, as such it is the fastest way to get authentication working in your application.  If you need more customization you can host the Sign-In experience within your own application by using the Okta Sign-In Widget (see tab above).

{% img okta-sign-in-page.png alt:"Okta Sign-In Page" width:"800" %}

##### Sign-In Page

By default, the Sign-In page is accessible through the `/authorize` OAuth 2.0 and OpenID Connect endpoint. If a user **does not** have an existing Okta session, they will be prompted to login via the [Okta Sign-In Widget](/code/javascript/okta_sign-in_widget.html). Once a user is authenticated, Okta will redirect back to your application, based on the `redirect_uri` specified in your `/authorize` request.

Please continue down to the next section, Server Setup, to learn about how the `/authorization` request is constructed.
