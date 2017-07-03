---
layout: docs_page
title: Platform Release Notes
excerpt: Summary of changes to the Okta Platform since Release 2017.26
---

## Release 2017.27

### Advance Notice: Data Retention Changes

Okta is changing system log data retention windows. System log data is available from `/api/v1/events` or
Okta SDK `EventsAPIClient`.

* For orgs created before July 17th, data older than six months will be removed.
* For orgs created on or after July 17th, data older than three months will be removed.

The new data retention policy starts:

* June 7, 2017 for existing preview orgs
* July 17, 2017 for existing production orgs

Preview and production orgs created on or after July 17, 2017, will retain log data for three months.

For the full data retention policy, see our [Data Retention Policy](https://support.okta.com/help/Documentation/Knowledge_Article/Okta-Data-Retention-Policy).

You can export data before Okta deletes it. We recommend using Security Information and Event Management (SIEM) technology or Okta's API. <!-- OKTA-125424 -->

 <!-- OKTA-125424 -->

### Platform Enhancement: Mysti will provide title

Mysti will provide description of enhancement based on OKTA-117521.
<!-- (OKTA-117521) -->

### Platform Bugs Fixed

* Description of corrected behavior  (OKTA-117352)

* Description of corrected behavior  (OKTA-129094)

* Description of corrected behavior  (OKTA-130764)

* Description of corrected behavior  (OKTA-131294)

* Description of corrected behavior  (OKTA-131608)

* Description of corrected behavior  (OKTA-131647)

* Description of corrected behavior  (OKTA-131885)

### Looking for Something Else?

* [Platform Release Note Index](platform-release-notes2016-index.html)
* For changes outside the Okta platform, see the [Product Release Notes](https://help.okta.com/en/prev/Content/Topics/ReleaseNotes/preview.htm).

