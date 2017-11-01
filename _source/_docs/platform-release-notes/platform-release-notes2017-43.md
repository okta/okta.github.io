---
layout: docs_page
title: Okta API Release Notes
excerpt: Changes to Developer Console and an improved error string
---

# Okta API Release Notes for Release 2017.43

This release note summarizes the changes since 2017.42.

Dates for preview and production release are the earliest possible release date. Always check your org to verify the release version.

### API Bug Fixes

These bug fixes are expected on preview orgs starting October 25, 2017, and on production orgs starting November 8, 2017.

* The default ports in the App Wizard in the Developer Console have been changed from `3000` to `8080`. (OKTA-144916)
* An error string was unclear. The string is returned when a session times out while waiting for a user to enter MFA credentials during an OpenID Connect `/authorize` call. (OKTA-143916)

### Does Your Org Have This Change Yet?

To verify the current release for an org, click the **Admin** button and check the footer of the Dashboard page.

{% img release_notes/version_footer.png alt:"Release Number in Footer" %}

### Looking for Something Else?

* [Platform Release Note Index for 2016](platform-release-notes2016-index.html)
* [Platform Release Note Index for 2017](platform-release-notes2017-index.html)
* For changes outside the Okta platform, see the [Product Release Notes](https://help.okta.com/en/prev/Content/Topics/ReleaseNotes/preview.htm).
