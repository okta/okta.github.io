---
layout: docs_page
title: Okta API Release Notes
excerpt: Summary of changes to the Okta API since Release 2017.42
---

## Okta API Release Notes for Release 2017.43

<!-- The following API feature enhancements are available in the 2017.43 release. -->
Dates for preview and production release are the earliest possible release date. Always check your org to verify the release version.

<!-- ### API Feature Enhancements

#### Title

Description
-->
<!-- OKTA-xxxxx -->

### API Bug Fixes

These bug fixes are expected on preview orgs starting October 25, 2017, and on production orgs starting November 8, 2017.

* When [setting a password via the API](/docs/api/resources/users.html#set-password), spaces in the password were incorrectly allowed.(OKTA-140668)
*  An error for invalid `okta_key` was incorrectly returned in this sequence:
    1. A request to `/authorize` is made for a user with two-factor authentication.
    2. Too much time elapsed before the second factor was supplied, so the session timed out and displayed another login page.
    3. A second attempt to log is completed correctly with the second factor supplied before session expiration.
    4. Instead of returning the expected code string, the response was an error message for invalid `okay_key`.

### Does Your Org Have This Change Yet?

To verify the current release for an org, click the **Admin** button and check the footer of the Dashboard page.

{% img release_notes/version_footer.png alt:"Release Number in Footer" %}

### Looking for Something Else?

* [Platform Release Note Index for 2016](platform-release-notes2016-index.html)
* [Platform Release Note Index for 2017](platform-release-notes2017-index.html)
* For changes outside the Okta platform, see the [Product Release Notes](https://help.okta.com/en/prev/Content/Topics/ReleaseNotes/preview.htm).
