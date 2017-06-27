---
layout: docs_page
title: Platform Release Notes
excerpt: Summary of changes to the Okta Platform since Release 2017.25
---

## Release 2017.26

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

* [Client Secret Masking](#client-secret-masking)
* [Support for client_secret_jwt](#support-for-client_secret_jwt)
<!--  * [New Release of Sign-In Widget](#new-release-of-sign-in-widget)  -->


#### Client Secret Masking
When an Oauth 2.0 client fails to log in after multiple tries within a specified period,
the system log contains a masked representation of the client secret. The representation is always ten
characters in length and accurately represents up to five initial characters of the secret. The remaining characters are asterisks.
{% img release_notes/MaskedClientSecret.png alt:"Masked Client Secret Event" %}
<!-- (OKTA-129694) -->

#### Support for client_secret_jwt
Okta supports the `client_secret_jwt` method for token endpoint authentication (`token_endpoint_auth_method`).
This method is specified in the [OpenID Connect specification](http://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication)
and allows you to use JWT and HMAC to authenticate a client for OAuth 2.0 or OpenID Connect requests.
<!-- (OKTA-101074) -->

<!--
#### New Release of Sign-In Widget
Version 1.12.0 of the Okta Sign-In Widget is now available. This release includes new features,
enhanced support for 408/WCAG accessibility, and bug fixes. In addition, the Okta Auth SDK release is now 1.8.0.

For details, see the
[release documentation](https://github.com/okta/okta-signin-widget/releases/tag/okta-signin-widget-1.12.0).
-->
<!-- (OKTA-131204) -->


### Platform Bugs Fixed

* When validating the names of scopes for social identity providers, Okta didn't enforce the restrictions
specified in the [OAuth 2.0 spec](https://tools.ietf.org/html/rfc6749#section-3.3). (OKTA-117352)

* When the same user was created multiple times simultaneously and added to a group, the HTTP error
response code was 500 rather than 400. (OKTA-126223)

* `/api/v1/apps/:appId/groups` didn't return groups if the specified app is inactive. (OKTA-123695)

### Does Your Org Have This Change Yet?

To verify the current release for an org, click the **Admin** button and check the footer of the Dashboard page.

{% img release_notes/version_footer.png alt:"Release Number in Footer" %}

### Looking for Something Else?

* [Platform Release Note Index](platform-release-notes2016-index.html)
* For changes outside the Okta platform, see the [Product Release Notes](https://help.okta.com/en/prev/Content/Topics/ReleaseNotes/preview.htm).

