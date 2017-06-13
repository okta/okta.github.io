---
layout: docs_page
title: Platform Release Notes
excerpt: Summary of changes to the Okta Platform since Release 2017.23
---

## Release 2017.24

### Advance Notices

* [Key Rollover Change](#key-rollover-changes)
* [Data Retention Policy Changes](#data-retention-changes)
* [API Rate Limit Improvements](#api-rate-limit-improvements)
 
#### Key Rollover Change

Beginning in Release 2017.25, the `kid` property of an app won't be available if the app doesn't support the key rollover feature.
An app supports key rollover if the app uses one of the following signing mode types: SAML 2.0, SAML 1.1, WS-Fed, or OpenID Connect.

Before this change takes effect, verify that your integration doesn't expect the `kid` property
if your app doesn't have one of the listed signing mode types. This change is expected in Release 2017.25,
which is scheduled for preview orgs on June 21, 2017 and in production orgs on June 26, 2017. <!-- OKTA-76439 -->

#### Data Retention Changes

Okta is changing system log data retention. System log data is available from `/api/v1/events` or Okta SDK `EventsAPIClient`.

* For orgs created before July 17th, data will be retained for 6 months.
* For orgs created on and after July 17th, data will be retained for 3 months.

The new data retention policy starts:

* June 7, 2017 for existing preview orgs
* July 17, 2017 for existing production orgs

Preview and production orgs created on July 17,2017 and later will retain this log data for three months. 

For the full data retention policy, see our [Data Retention Policy](https://support.okta.com/help/Documentation/Knowledge_Article/Okta-Data-Retention-Policy).

You can export data before Okta deletes it. We recommend using Security Information and Event Management (SIEM) technology or Okta's API. <!-- OKTA-125424 -->

#### API Rate Limit Improvements

We are making org-wide rate limits more granular, and treating authenticated end-user interactions separately. More granular rate limits lessen the likelihood of calls to one URI impacting another. Treating authenticated end-user interactions separately lessens the chances of one user's request impacting another. We’re also providing a transition period so you can see what these changes look like in your Okta system log before enforcing them:

##### Preview Orgs

We enforce new rate limits for all preview orgs. API calls exceeding the new rate limits return an HTTP 429 error.

##### Production Orgs

1. As of May 8, we have enabled a System Log alert which lets you know if you have exceeded any of the new API rate limits:

    ```
    Warning: requests for url pattern <url-pattern> have reached 
    a threshold of <number> requests per <time-duration>. Please 
    be warned these rate limits will be enforced in the near future.
    ```

2. As of mid-May, we started enforcing these new rate limits for all newly created orgs. For these new orgs, instead of alerts in your System log, the API calls exceeding the new rate limits return an HTTP 429 error.

3. In early June, we'll enforce these new rate limits for all orgs, and instead of alerts in your System Log, the API calls exceeding the new rate limits will return an HTTP 429 error.

For a full description of the new rate limits, see [API Rate Limit Improvements](https://support.okta.com/help/articles/Knowledge_Article/API-Rate-Limit-Improvements).<!-- OKTA-110472 --> 

### Platform Enhancements

* [Key Blinding Parameters Added to Apps API](#key-blinding-parameters-added-to-apps-api)
* [Default Scopes for OAuth 2.0](#default-scopes-for-oauth-20)
* [Improved UI for Creating OpenID Connect Apps](#improved-ui-for-creating-openid-connect-apps)
* [Event Notifications for OpenID Connect Apps](#event-notifications-for-openid-connect-apps)

#### Key Blinding Parameters Added to Apps API

The key-blinding parameters `e` and `n` from the [JSON Web Key (JWK) spec](https://tools.ietf.org/html/rfc7517#section-4) are now available in the Apps API.
For more information, see the [Okta Apps API documentation](https://developer.okta.com/docs/api/resources/apps.html#application-key-credential-certificate-properties) <!-- OKTA-77488 -->

#### Default Scopes for OAuth 2.0

Using either the Okta UI or API, you can configure default scopes for an OAuth 2.0 client.
If the client omits the scope parameter in an authorization request,
Okta returns all default scopes in the Access Token that are permitted by the access policy rule. 

{% img release_notes/default-scope.png alt:"Default Scope Configuration UI" %}

For more information about setting default scopes in the API, see [OAuth 2.0 API](/docs/api/resources/oauth2.html#scopes-properties).
<!-- OKTA-122185 OKTA-122072 -->

#### Improved UI for Creating OpenID Connect Apps

The wizard for creating an OpenID Connect app has been improved and consolidated onto a single screen.

{% img release_notes/single-oidc-screen.png alt:"New OpenID Connect Create Wizard" %}

<!-- OKTA-129127 -->

#### Event Notifications for OpenID Connect Apps

Notifications are entered in the System Log via the Events API (`/api/v1/events`) when OpenID Connect apps are created, modified, deactivated, or deleted.
Previously these notifications appeared only in the System Log (`/api/v1/logs`).

### Platform Bugs Fixed

* If a query parameter was included in the definition of a Redirect URL (the IDP Login URL field in the Add/Edit Endpoint wizard or the IdP Single Sing-On URL for Inbound SAML), the query parameter was ignored. (OKTA-127771)
* The dropdown that controls Authorization Server lifecycles failed to display properly if you navigated directly to a tab or refreshed a tab other than Settings. (OKTA-129014)

### Does Your Org Have This Change Yet?

To verify the current release for an org, click the **Admin** button and check the footer of the Dashboard page.

{% img release_notes/version_footer.png alt:"Release Number in Footer" %}

### Looking for Something Else?

* [Platform Release Note Index](platform-release-notes2016-index.html)
* For changes outside the Okta platform, see the [Product Release Notes](https://help.okta.com/en/prev/Content/Topics/ReleaseNotes/preview.htm).

