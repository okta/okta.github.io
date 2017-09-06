---
layout: docs_page
title: Okta API Release Notes
excerpt: Summary of changes to the Okta API since Release 2017.34
---

# Okta API Release Notes

The following platform feature enhancements and bug fixes are available in the 2017.35 release.
Dates for preview and production release are the earliest possible release date. Always check your org to verify the release version.

### API Feature Enhancements

| Feature Enhancement                                                           | Expected in Preview Orgs            | Expected in Production Orgs |
|:------------------------------------------------------------------------------|:------------------------------------|:----------------------------|
|        [Zones API is an Early Access Release](#zones-api-is-an-early-access-release) | August 22, 2017                     | September 5, 2017           |

#### Zones API is an Early Access Release
<!-- OKTA-129115 -->

Zones are used to group IP Address ranges so that policy decisions can be made based on the client’s IP location.

[The Zones API](/docs/api/resources/zones.html) is an {% api_lifecycle ea %} release. Contact Support to enable it.
This API can be enabled beginning August 22, 2017 for preview orgs, and beginning September 5, 2017 for production orgs.

### API Bug Fix

This bug fix is expected on preview orgs starting August 31, 2017, and on production orgs starting Sept 5, 2017.

* Some requests to update a user via [`/api/v1/users/:uid`](/docs/api/resources/users.html#update-user) failed with a 500 Internal Server Error. (OKTA-138214)

### Does Your Org Have This Change Yet?

To verify the current release for an org, scroll to the bottom of the developer console, or click the **Admin** button and check the footer of the Dashboard page.

{% img release_notes/version_footer.png alt:"Release Number in Footer" %}

### Looking for Something Else?

* [Okta API Release Note Index for 2016](platform-release-notes2016-index.html) 
* [Okta API Release Note Index for 2017](platform-release-notes2017-index.html)
* For changes outside the Okta API, see the [Product Release Notes](https://help.okta.com/en/prev/Content/Topics/ReleaseNotes/preview.htm).

