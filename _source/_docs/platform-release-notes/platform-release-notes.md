---
layout: docs_page
title: Platform Release Notes
excerpt: Summary of changes to the Okta Platform since Release 2017.27
---

## Release 2017.28

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

You can export data before Okta deletes it. We recommend using Security Information and Event Management (SIEM) technology or Okta's API.

 <!-- OKTA-125424 -->

### Platform Enhancements and New Features

The following changes are available Wednesday, July 12 in preview orgs.
Availability in production orgs follows either by approximately one week or one month.
 
#### Generally Available (GA) Features

These features are GA in preview orgs, and expected in production orgs during the week of August 8, 2017.

* [OpenID Connect](#openid-connect)

* [Key Rollover](#key-rollover)

These feature enhancements are GA in preview orgs, and expected in production orgs during the week of July 17, 2017.

* [Allow Unsuspended During Inbound SAML Login](#unsuspended-suspended-users-during-inbound-saml-ogin)

* [Block Insecure Cross-Org Requests to GA](#block-insecure-cross-org-requests)

* [Limit Age of Events to GA](#limit-age-of-events)


##### OpenID Connect
[OpenID Connect API](https://developer.okta.com/docs/api/resources/oidc.html) 

  <!-- OKTA-132049  -->


##### Key Rollover
Key rollover 
 
 For more information, see [Validating ID Tokens](https://developer.okta.com/docs/api/resources/oidc.html#validating-id-tokens)

  <!-- OKTA-132045  -->


#### Allow Suspended Users During Inbound SAML Login

You can configure the JIT settings for a SAML identity provider (IdP) to enable inbound SAML login for users who are suspended in Okta.

{% img release_notes/JIT_settings.png alt:"JIT settings for SAML IdP" %}
  <!-- OKTA-128384  -->


#### Block Insecure Cross-Org Requests
Okta blocks cross-org requests that do not meet our security requirements. This feature moves from EA to GA.

  <!-- OKTA-132490  -->


#### Limit Age of Events
The events API (`/api/v1/events`) no longer accepts queries for events greater than 180 days old. This feature moves from early access (EA) to generally available (GA).

  <!-- OKTA-125424, 120605  -->




### Platform Bugs Fixed

These platform bug fixes are available in preview orgs and expected in production orgs the week of July 17, 2017.

* `/api/v1/apps/:appId/groups` didn't return groups if the specified app is inactive. (OKTA-123695)

* Just-in-time reactivation of users failed in some circumstances. (OKTA-131784)

* Okta didn't capture `externalId` from Microsoft social identity providers.  (OKTA-132207)



### Does Your Org Have This Change Yet?

To verify the current release for an org, click the **Admin** button and check the footer of the Dashboard page.

{% img release_notes/version_footer.png alt:"Release Number in Footer" %}


### Looking for Something Else?

* [Platform Release Note Index](platform-release-notes2016-index.html)
* For changes outside the Okta platform, see the [Product Release Notes](https://help.okta.com/en/prev/Content/Topics/ReleaseNotes/preview.htm).

