---
layout: docs_page
title: Platform Release Notes
excerpt: Summary of changes to the Okta Platform since Release 2017.26
---

## Release 2017.28

### Advance Notice: Data Retention Changes

Okta is changing system log data retention windows. System log data is available from `/api/v1/events` or
Okta SDK `EventsAPIClient`.

* For orgs created before July 17th, data older than six months will be removed.
* For orgs created on or after July 17th, data older than three months will be removed.

The new data retention policy starts:

* June 7, 2017 for existing preview orgs
* July 17, 2017 for existing production org

Preview and production orgs created on or after July 17, 2017, will retain log data for three months.

For the full data retention policy, see our [Data Retention Policy](https://support.okta.com/help/Documentation/Knowledge_Article/Okta-Data-Retention-Policy).

You can export data before Okta deletes it. We recommend using Security Information and Event Management (SIEM) technology or Okta's API.

 <!-- OKTA-125424 -->

### Platform Enhancements in Preview and Expected in Production during Week 2017.29 (July 19, 2017)

*[Reactivate Suspended](#reactivate-suspended)

*[PLUGIN_BLOCK](#plugin_block)

*[Limit Events](limit-events)


#### Reactivate Suspended
zzzz
  <!-- OKTA-128384  -->


#### PLUGIN_BLOCK
wwww
  <!-- OKTA-132490  -->


#### Limit Events
vvvv
  <!-- OKTA-125424, 120605  -->


### Platform Enhancements in Preview and Expected in Production during Week 2017.31 (August 2, 2017)

* [OPENID_CONNECT](#openid_connect)

* [KEY_ROLLOVER](#key_rollover)


#### OPENID_CONNECT
xxxx
  <!-- OKTA-132049  -->


#### KEY_ROLLOVER
yyyy
  <!-- OKTA-132045  -->


### Platform Bugs Fixed

* (OKTA-123695)

* (OKTA-131784)

* (OKTA-132207)

### Looking for Something Else?

* [Platform Release Note Index](platform-release-notes2016-index.html)
* For changes outside the Okta platform, see the [Product Release Notes](https://help.okta.com/en/prev/Content/Topics/ReleaseNotes/preview.htm).

