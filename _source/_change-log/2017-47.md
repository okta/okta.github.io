---
layout: docs_page
title: Okta API Release Notes
excerpt: Release Note for 2017.47 Bug fix to partial profile update
---

## Okta API Release Notes for Release 2017.47

These release notes summarize the changes since 2017.46. Dates for preview and production release are the earliest possible release date. Always check your org to verify the release version.

### API Bug Fix

The following bug fix will be available on preview orgs starting November 21, and will be available on production orgs starting November 28, 2017:

* A partial profile update (POST `/api/v1/users/ {userId}`) incorrectly required that `login` be specified in the `profile`. (OKTA-145770)

### Does Your Org Have This Change Yet?

To verify the current release for an org, check the footer of the Dashboard page. If necessary, click the **Admin** button to navigate to your dashboard.

{% img release_notes/version_footer.png alt:"Release Number in Footer" %}

### Looking for Something Else?

* [Platform Release Note Index for 2016](platform-release-notes2016-index.html)
* [Platform Release Note Index for 2017](platform-release-notes2017-index.html)
* For changes outside the Okta platform, see the [Product Release Notes](https://help.okta.com/en/prev/Content/Topics/ReleaseNotes/preview.htm).
