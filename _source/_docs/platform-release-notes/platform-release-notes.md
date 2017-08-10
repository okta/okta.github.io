---
layout: docs_page
title: Platform Release Notes
excerpt: Summary of changes to the Okta Platform since Release 2017.32
---

## Platform Release Notes for Release 2017.33

The following platform feature enhancements and bug fixes are available in the 2017.33 release.
Dates for preview and production release are the earliest possible release date. Always check your org to verify the release version.

### Platform Feature Enhancements

| Feature Enhancement                                                                                                  | Expected in Preview Orgs | Expected in Production Orgs             |
|:---------------------------------------------------------------------------------------------------------------------|:-------------------------|:----------------------------------------|
|       [Password Policy API is an Early Access Release](#password-policy-api-is-an-early-access-release)                    | August 16, 2017          | August 21, 2017                         |
|      [Referrer Policy Header for OAuth 2.0 and OpenID Connect](#referrer-policy-header-for-oauth-20-and-openid-connect)   | August 16, 2017          | August 21, 2017                         |

#### Password Policy API is an Early Access Release
<!-- REQ-10227 -->

The Password Policy API is an {% api_lifecycle ea %} release. Contact Support to enable it.

Use the [Password Policy API](/docs/api/resources/policy.html#GroupPasswordPolicy) to dynamically configure group-based password policies, including self-service recovery and unlock options.

#### Referrer Policy Header for OAuth 2.0 and OpenID Connect
<!-- OKTA-96522 -->

For enhanced security, Okta automatically adds the `Referrer-Policy` header with `Referrer-Policy: no-referrer` to any OpenID Connect or API Access Management request that has the `response_mode` set to `fragment` or `query`.

### Platform Bug Fixes

Bug fixes are expected on preview orgs starting August 16, 2017, and on production orgs starting August 21, 2017.

* A PUT request to [update a user](/docs/api/resources/users.html#update-user) didn't delete all unspecified properties. (OKTA-133499)
* The [Dynamic Client Registration API](/docs/api/resources/oauth-clients.html) didn't display the complete error message for requests to update a client. (OKTA-134440)
* We improved the messages returned with some error codes for OpenID Connect and OAuth 2.0 client apps using the [`/oauth2/v1/clients`](/docs/api/resources/oauth-clients.html) and [`/api/v1/apps`](/docs/api/resources/apps.html) endpoints. (OKTA-135294)

### Does Your Org Have This Change Yet?

To verify the current release for an org, click the **Admin** button and check the footer of the Dashboard page.

{% img release_notes/version_footer.png alt:"Release Number in Footer" %}

### Looking for Something Else?

* [Platform Release Note Index for 2016](platform-release-notes2016-index.html) 
* [Platform Release Note Index for 2017](platform-release-notes2017-index.html)
* For changes outside the Okta platform, see the [Product Release Notes](https://help.okta.com/en/prev/Content/Topics/ReleaseNotes/preview.htm).

