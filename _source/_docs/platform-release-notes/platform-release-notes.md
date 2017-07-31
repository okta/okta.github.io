---
layout: docs_page
title: Platform Release Notes
excerpt: Summary of changes to the Okta Platform since Release 2017.30
---

## Release 2017.31

### Platform Features

These platform features are generally available in preview orgs (as of Release 2017.28), and expected to be generally available in production orgs during the week of August 7, 2017:

* [OpenID Connect](#openid-connect---)

* [Key Rollover](#key-rollover----)

This platform feature enhancement is EA in preview orgs (as of release 2017.30) and expected to be EA in production orgs during the week of August 7, 2017:

* [Email for Two-Factor Authentication](#email-for-two-factor-authentication--)

To enable an EA feature, contact Okta Support. For information about Early Access (EA), see [Okta Release Lifecycle](https://developer.okta.com/docs/api/getting_started/releases-at-okta.html).

This platform feature enhancement is generally available in preview orgs with this release and expected to be generally available in production orgs the week of September 11, 2017:

* [Sign SAML Assertions with SHA256 Certs](#sign-saml-assertions-with-sha256-certs)

This feature enhancement is available on GitHub:

* [New Version of Sign-In Widget](#new-version-of-sign-in-widget--)

#### OpenID Connect   <!-- OKTA-132049  -->

[OpenID Connect](/docs/api/resources/oidc.html) is a simple identity layer on top of the OAuth 2.0 protocol, which allows computing clients to verify the identity of an end user based on the authentication performed by an authorization server, as well as to obtain basic profile information about the end user in an interoperable and REST-like manner. In technical terms, OpenID Connect specifies a RESTful HTTP API, using JSON as a data format.

 OpenID Connect allows a range of clients, including Web-based, mobile, and JavaScript clients, to request and receive information about authenticated sessions and end users. The specification suite is extensible, supporting optional features such as encryption of identity data, discovery of OpenID Providers, and session management.

 Okta is [certified for OpenID Connect](http://openid.net/certification/). For more information, see [OpenID Connect and Okta](/standards/OIDC/).

#### Key Rollover    <!-- OKTA-132045  -->

We provide the ability to generate a certificate with specified validity period (see the [Apps API](/docs/api/resources/apps.html) and [Identity Providers API](/docs/api/resources/idps.html)). We build OpenID Connect and API Access Management on this feature.

#### Email for Two-Factor Authentication  <!-- OKTA-134593  -->

You can enroll a user with an email factor. See [Enroll Okta Email Factor](/docs/api/resources/factors.html#enroll-okta-email-factor) for details.

#### Sign SAML Assertions with SHA256 Certs

You can use SHA256 certificates to sign outbound SAML assertions. See [SAML Apps and SHA256 Certificates](/docs/how-to/updating_saml_cert.html) for details.

#### New Version of Sign-In Widget  <!-- (OKTA-132800) -->

Version 2.1.0 of the [Okta Sign-In Widget](https://github.com/okta/okta-signin-widget/releases/tag/okta-signin-widget-2.1.0) is available. Check out the new features and bug fixes!

<!--
### Platform Bugs Fixed

This platform bug fix is in preview orgs with this release and expected in production orgs the week of {next Monday date}.
-->

### Does Your Org Have This Change Yet?

To verify the current release for an org, click the **Admin** button and check the footer of the Dashboard page.

{% img release_notes/version_footer.png alt:"Release Number in Footer" %}

### Looking for Something Else?

* [Platform Release Note Index](platform-release-notes2016-index.html)
* For changes outside the Okta platform, see the [Product Release Notes](https://help.okta.com/en/prev/Content/Topics/ReleaseNotes/preview.htm).

