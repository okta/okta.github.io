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

### Platform Enhancements in Preview and Expected in Production during Week 2017.31 (August 2, 2017)

* [OpenID Connect to GA](#openid-connect-to-ga)

* [Key Rollover to GA](#key-rollover-to-ga)


#### OpenID Connect to GA
Okta's [OpenID Connect API](https://developer.okta.com/docs/api/resources/oidc.html) moves from early access (EA) to generally available (GA).

  <!-- OKTA-132049  -->


#### Key Rollover to GA
Key rollover is a feature available with OpenID Connect and moves from early access (EA) to generally available (GA) with it. For more information, see [Validating ID Tokens](https://developer.okta.com/docs/api/resources/oidc.html#validating-id-tokens)

  <!-- OKTA-132045  -->


### Platform Enhancements in Preview and Expected in Production during Week 2017.29 (July 19, 2017)

* [Unsuspended Suspended Users During Inbound SAML Login](#unsuspended-suspended-users-during-inbound-saml-ogin)

* [Block Insecure Cross-Org Requests to GA](#block-insecure-cross-org-requests-to-ga)

* [Limit Age of Events to GA](#limit-age-of-events-to-ga)


#### Unsuspended Suspended Users During Inbound SAML Login

You can configure the JIT settings for a SAML identity provider (IdP) to enable inbound SAML login for users who are suspended in Okta.

{% img release_notes/JIT_settings.png alt:"JIT settings for SAML IdP" %}
  <!-- OKTA-128384  -->


#### Block Insecure Cross-Org Requests to GA
Okta blocks cross-org requests that do not meet our security requirements. This feature moves from early access (EA) to generally available (GA).

  <!-- OKTA-132490  -->


#### Limit Age of Events to GA
The events API (`/api/v1/events`) no longer accepts queries for events greater than 180 days old. This feature moves from early access (EA) to generally available (GA).

  <!-- OKTA-125424, 120605  -->




### Platform Bugs Fixed

* `/api/v1/apps/:appId/groups` didn't return groups if the specified app is inactive. (OKTA-123695)

* Just-in-time reactivation of users failed in some circumstances. (OKTA-131784)

* Okta didn't capture `externalId` from Microsoft social identity providers.  (OKTA-132207)



### Does Your Org Have This Change Yet?

To verify the current release for an org, click the **Admin** button and check the footer of the Dashboard page.

{% img release_notes/version_footer.png alt:"Release Number in Footer" %}


### Looking for Something Else?

* [Platform Release Note Index](platform-release-notes2016-index.html)
* For changes outside the Okta platform, see the [Product Release Notes](https://help.okta.com/en/prev/Content/Topics/ReleaseNotes/preview.htm).

