---
layout: docs_page
title: Okta API Release Notes
excerpt: Summary of changes to the Okta API since Release 2017.42
---

## Okta API Release Notes for Release 2017.42

The following API feature enhancements are available in the 2017.42 release.
Dates for preview and production release are the earliest possible release date. Always check your org to verify the release version.

### API Feature Enhancements

#### Group Rule Evaluations Included in System Log

Group Rule evaluation failures during user authentication are now exposed via the System Log API.

<!-- OKTA-140086 -->

### API Bug Fixes

These bug fixes are expected on preview orgs starting October 18, 2017, and on production orgs starting October 24, 2017.

* Claim evaluation didn't always respect the Universal Directory schema. (OKTA-137462)
* Slim ID tokens from custom authorization servers did not include OpenID Connect claims, causing client applications including the Okta Sign-In Widget to not pre-populate the username. (OKTA-143857)

### Does Your Org Have This Change Yet?

To verify the current release for an org, click the **Admin** button and check the footer of the Dashboard page.

{% img release_notes/version_footer.png alt:"Release Number in Footer" %}

### Looking for Something Else?

* [Platform Release Note Index for 2016](platform-release-notes2016-index.html)
* [Platform Release Note Index for 2017](platform-release-notes2017-index.html)
* For changes outside the Okta platform, see the [Product Release Notes](https://help.okta.com/en/prev/Content/Topics/ReleaseNotes/preview.htm).
