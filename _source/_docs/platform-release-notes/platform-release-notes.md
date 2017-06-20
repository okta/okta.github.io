---
layout: docs_page
title: Platform Release Notes
excerpt: Summary of changes to the Okta Platform since Release 2017.24
---

## Release 2017.25

### Advance Notice: Data Retention Changes

Okta is changing system log data retention. System log data is available from `/api/v1/events` or
Okta SDK `EventsAPIClient`.

* For orgs created before July 17th, data will be retained for 6 months.
* For orgs created on and after July 17th, data will be retained for 3 months.

The new data retention policy starts:

* June 7, 2017 for existing preview orgs
* July 17, 2017 for existing production orgs

Preview and production orgs created on July 17, 2017 and later will retain this log data for three months.

For the full data retention policy, see our [Data Retention Policy](https://support.okta.com/help/Documentation/Knowledge_Article/Okta-Data-Retention-Policy).

You can export data before Okta deletes it. We recommend using Security Information and Event Management (SIEM) technology or Okta's API. <!-- OKTA-125424 -->

 <!-- OKTA-125424 -->

### Platform Enhancements

* [Key rollover](#key-rollover)
* [System logs track key rotation and generation](#system-logs-track-key-rotation-and-generation)
* [Client app updates available in system log](#client-app-updates-available-in-system-log)
* [Support for RP-initiated logout](#support-for-rp-initiated-logout)
* [Create OAuth 2.0 and OpenID Connect clients with the Apps API](#create-oauth-20-and-openid-connect-clients-with-apps-api)
* [HTTP 401 response includes scheme in WWW-Authenticate header](#http-401-response-includes-scheme-in-www-authenticate-header)
* [Return registration endpoint in response to .well-known request](#return-registration-endpoint-in-response-to-well-known-request)

#### Key rollover
The `credentials.signing.kid` property of an app is available only if the app supports the key rollover feature,
that is, if it uses one of the following signing mode types: SAML 2.0, SAML 1.1, WS-Fed, or OpenID Connect.
<!-- OKTA-76439 -->

#### System logs track key rotation and generation
Logged information about key rotation and generation for identity provider and application instances
is available by using GET requests to either of the following endpoints: `/api/v1/events` or `/api/v1/logs`.
<!-- (OKTA-76607) -->

#### Client app updates available in system log
Logged information about OAuth 2.0 client updates is now available by using GET requests to
either log endpoint: `/api/v1/events` or `/api/v1/logs` {% api_lifecycle beta %}.
<!-- (OKTA-86738, OKTA-127445) -->

#### Support for RP-initiated logout
Okta supports [RP-intiated logout](http://openid.net/specs/openid-connect-session-1_0.html#RPLogout)
from OpenID Connect client apps in both the Okta UI and Okta API. You can specify a logout redirect URI,
or accept the default behavior of returning to the Okta Login page. You can access this feature on the
Create OpenID Connect Integration page (under Applications) in the UI.
<!-- (OKTA-94106) -->

#### Create OAuth 2.0 and OpenID Connect clients with Apps API
You can use the [Apps API](https://developer.okta.com/docs/api/resources/apps.html) to create and configure
OAuth 2.0 or OpenID Connect clients.
Previously this was available only in the
[Client Registration API] (https://developer.okta.com/docs/api/resources/oauth-clients.html) {% api_lifecycle beta %}.
<!-- (OKTA-78223) -->

#### HTTP 401 response includes scheme in WWW-Authenticate header
When Okta returns an invalid_client error it returns the WWW-Authenticate header with the value of
the supported authentication scheme in the HTTP 401 response.
<!-- (OKTA-127653) -->

#### Return registration endpoint in response to .well-known request
Okta returns the `registration_endpoint` in OAuth 2.0 and OpenID Connect `.well-known` responses.
<!-- (OKTA-127457) -->



<!--
### Platform Bugs Fixed
-->


### Does Your Org Have This Change Yet?

To verify the current release for an org, click the **Admin** button and check the footer of the Dashboard page.

{% img release_notes/version_footer.png alt:"Release Number in Footer" %}

### Looking for Something Else?

* [Platform Release Note Index](platform-release-notes2016-index.html)
* For changes outside the Okta platform, see the [Product Release Notes](https://help.okta.com/en/prev/Content/Topics/ReleaseNotes/preview.htm).

