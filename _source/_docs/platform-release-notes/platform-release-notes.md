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
Availability in production orgs follows by approximately either one week or one month.

These features are GA in preview orgs, and expected in production orgs during the week of August 8, 2017.

* [OpenID Connect](#openid-connect)

* [Key Rollover](#key-rollover)

These feature enhancements are GA in preview orgs, and expected in production orgs during the week of July 17, 2017.

* [Allow Unsuspending Users During Inbound SAML Login](#allow-unsuspending-users-during-inbound-saml-login)

* [Improved Plugin Security to GA](#improved-plugin-security)

* [Limit Age of Events to GA](#limit-age-of-events)

#### OpenID Connect
[OpenID Connect API](https://developer.okta.com/docs/api/resources/oidc.html) is a simple identity layer on top of the OAuth 2.0 protocol, which allows computing clients to verify the identity of an end user based on the authentication performed by an authorization server, as well as to obtain basic profile information about the end user in an interoperable and REST-like manner. In technical terms, OpenID Connect specifies a RESTful HTTP API, using JSON as a data format.

 OpenID Connect allows a range of clients, including Web-based, mobile, and JavaScript clients, to request and receive information about authenticated sessions and end users. The specification suite is extensible, supporting optional features such as encryption of identity data, discovery of OpenID Providers, and session management.

 Okta is [certified for OpenID Connect](http://openid.net/certification/). For more information, see [OpenID Connect and Okta](https://developer.okta.com/standards/OIDC/).

  <!-- OKTA-132049  -->


#### Key Rollover
The ability to generate a certificate with specified validity period (see the [Apps API](https://developer.okta.com/docs/api/resources/apps.html) and [Identity Providers API](https://developer.okta.com/docs/api/resources/idps.html)) moves from early access (EA) to generally available (GA). We build OpenID Connect and API Access Management on this feature.
 
   <!-- OKTA-132045  -->

#### Allow Unsuspending Users During Inbound SAML Login

You can configure the JIT settings for a SAML identity provider (IdP) to enable unsuspending suspended Okta users during inbound SAML login.

{% img release_notes/JIT_settings.png alt:"JIT settings for SAML IdP" %}

See the [Identity Providers API](https://developer.okta.com/docs/api/resources/idps.html) for more information.

  <!-- OKTA-128384  -->

#### Improved Plugin Security
Template Plugin Apps you create from the admin portal (Admin > Applications > Add Application > Template Plugin App) have improved security. This feature moves from EA to GA.

  <!-- OKTA-132490  -->

#### Limit Age of Events
The events API (`/api/v1/events`) no longer accepts queries for events greater than 180 days old. This feature moves from EA to GA.

  <!-- OKTA-125424, 120605  -->

### Platform Bugs Fixed

These platform bug fixes are available in preview orgs and expected in production orgs the week of July 17, 2017.

* `/api/v1/apps/:appId/groups` didn't return groups if the specified app is inactive. (OKTA-123695)

* Identity provider JIT reactivation of users sometimes failed when there were configured group assignments. (OKTA-131784)

* In some circumstances, the link between the external Microsoft user and the Okta user was inaccurate.  (OKTA-132207)

### Does Your Org Have This Change Yet?

To verify the current release for an org, click the **Admin** button and check the footer of the Dashboard page.

{% img release_notes/version_footer.png alt:"Release Number in Footer" %}

### Looking for Something Else?

* [Platform Release Note Index](platform-release-notes2016-index.html)
* For changes outside the Okta platform, see the [Product Release Notes](https://help.okta.com/en/prev/Content/Topics/ReleaseNotes/preview.htm).

