---
layout: docs_page
---

# Release 2017.46

These release notes summarize the changes since 2017.45. Dates for preview and production release are the earliest possible release date. Always check your org to verify the release version.

### API Bug Fix

The following bug fix is available now on preview orgs, and will be available on production orgs starting November 28, 2017:

* After updating a user with a POST to `/user/{userId}`, HAL links would not be included in the response body. (OKTA-145195)