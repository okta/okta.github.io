---
layout: docs_page
title: Okta API Release Notes
excerpt: 2017.46 Release Note: HAL link bug fixed
---

## Okta API Release Notes for Release 2017.46

These release notes summarize the changes since 2017.45. Dates for preview and production release are the earliest possible release date. Always check your org to verify the release version.

### API Bug Fix

The following bug fix is available now on preview orgs, and will be available on production orgs starting November 28, 2017:

* After updating a user with a POST to `/user/{userId}`, HAL links would not be included in the response body. (OKTA-145195)

### Does Your Org Have This Change Yet?

To verify the current release for an org, click the **Admin** button and check the footer of the Dashboard page.

{% img release_notes/version_footer.png alt:"Release Number in Footer" %}

### Looking for Something Else?

* [Platform Release Note Index for 2016](platform-release-notes2016-index.html)
* [Platform Release Note Index for 2017](platform-release-notes2017-index.html)
* For changes outside the Okta platform, see the [Product Release Notes](https://help.okta.com/en/prev/Content/Topics/ReleaseNotes/preview.htm).
