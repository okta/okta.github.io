---
layout: quickstart_partial
libraryName: Okta Sign-In Page
---

##### Overview

The Okta Sign-In Page provides the easiest, most secure way to allow users to authenticate into your application.  The Sign-In Page is hosted by Okta on the domain of your Okta Org, as such it is the fastest way to get authentication working in your application.  If you need more customization you can host the Sign-In experience within your own application by using the Okta Sign-In Widget (see tab above).

<center>{% img okta-sign-in-page.png alt:"Okta Sign-In Page" width:"500" %}</center>

##### Using The Sign-In Page

When you application needs to authenticate the user, it will need to redirect the user to the Sign-In Page by making an Authorization Code request to an authorization server in your Okta org. Once the user completes the login form, they will be redirected back to your server with an Authorization Code that can be used to get more information about the user. We have created server-side libraries that do most of this work for you with just a few lines of configuration. Please select your server technology below to get instructions for your server.

To learn more about how this flow works under the hood, please see [OAuth 2.0 and Okta](https://developer.okta.com/standards/OAuth/).