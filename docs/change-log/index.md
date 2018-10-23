---
title: Okta API Products Change Log | Okta Developer
layout: WithSidebar
meta:
  - name: description
    content: List of changes to the Okta API and related API...
---

# Okta API Products Change Log

This change log lists customer-visible changes to API Products by release number. Okta releases every week except a few times a year we skip
a release, usually due to holiday schedules or other special events. We release first to preview orgs and then production orgs.

Dates for preview and production release are the earliest possible release date. Always check your org to verify the release for your org. 

To verify the current release for an org, check the footer of the administrator UI. If necessary, click the **Admin** button to navigate to your administrator UI.
{% img release_notes/version_footer.png alt:"Release Number in Footer" %}

> Note: Changes to Okta unrelated to API Products are published in the [Okta Release Notes](https://help.okta.com/en/prod/Content/Topics/ReleaseNotes/okta-relnotes.htm).



## 2018.41

| Change                                                                                                               | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------------------- |
| [Rate Limit Notifications for One App and Enterprise](#rate-limit-notifications-for-one-app-and-enterprise)                            | October 10, 2018       | October 15, 2018                             |
| [OIDC Clients Can Initiate Logout with Expired Token](#oidc-clients-can-initiate-logout-with-expired-token)                            | October 10, 2018       | October 15, 2018                             |
| [Change to User Link Editing Permissions](#change-to-user-link-editing-permissions)                            | October 10, 2018       | October 15, 2018                             |
| [Bugs Fixed in 2018.41](#bugs-fixed-in-201841)                                                                       | October 10, 2018         | October 15, 2018                             |
| [Previously Released Early Access Features 2018.41 Update](#previously-released-early-access-features-201841-update) | Available Now            | Available Now                                |

### Rate Limit Notifications for One App and Enterprise

When an org reaches its [rate limit](/docs/api/getting_started/rate-limits), the admin console will display a banner and the admin(s) will receive an email notification. These notifications will only appear on One App and Enterprise organizations. <!--OKTA-185719-->

### OIDC Clients Can Initiate Logout with Expired Token

Client-initiated [logout](/docs/api/resources/oidc#logout) now succeeds even when the ID token is no longer valid. <!--OKTA-131652-->

### Change to User Link Editing Permissions

Editing the [link](/docs/api/resources/users#links-object) between users now requires edit permissions for all users involved. <!--OKTA-186702-->

### Bugs Fixed in 2018.41

* Queries to the `/logs` [endpoint](/docs/api/resources/system_log#list-events) with values for `since` and `until` that did not specify the time to milliseconds would sometimes return events outside of the specified time range. (OKTA-191533)
* Responses from the `/events` [endpoint](/docs/api/resources/events#list-events) would sometimes omit milliseconds from the `published` field. (OKTA-192568)

### Previously Released Early Access Features 2018.41 Update

The following features have already been released as Early Access. To enable them, {{site.contact_support_lc}}.

| Early Access Features Available Now
| :------------------------------------------------- |
| [Custom URL Domains](#custom-url-domains-are-in-early-access)|
| [Custom Okta-hosted Sign-In Page](#custom-okta-hosted-sign-in-page-is-in-early-access)|
| [Custom Error Page](#custom-error-page-is-in-early-access)|
| [Linked Objects API](#linked-objects-api-in-early-access-ea) |
| [Token Management API](#token-management-api-is-in-early-access-ea) |
| [User Consent for OAuth 2.0 and OpenID Connect Flows](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) |


## 2018.40

| Change                                                                                                               | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------------------- |
| [Bugs Fixed in 2018.40](#bugs-fixed-in-201840)                                                                       | October 3, 2018       | October 8, 2018                           |
| [Previously Released Early Access Features 2018.40 Update](#previously-released-early-access-features-201840-update) | Available Now            | Available Now                                |

### Bugs Fixed in 2018.40

* Responses from the `/api/v1/zones` [endpoint](/docs/api/resources/zones#zones-api) included a duplicate of the `type` field. (OKTA-188605)
* The `/api/v1/idps/credentials/keys` [endpoint](/docs/api/resources/idps#add-x509-certificate-public-key) was requiring requests to include extra parameters. (OKTA-189780)

### Previously Released Early Access Features 2018.40 Update

The following features have already been released as Early Access. To enable them, {{site.contact_support_lc}}.

| Early Access Features Available Now
| :------------------------------------------------- |
| [Custom URL Domains](#custom-url-domains-are-in-early-access)|
| [Custom Okta-hosted Sign-In Page](#custom-okta-hosted-sign-in-page-is-in-early-access)|
| [Custom Error Page](#custom-error-page-is-in-early-access)|
| [Linked Objects API](#linked-objects-api-in-early-access-ea) |
| [Token Management API](#token-management-api-is-in-early-access-ea) |
| [User Consent for OAuth 2.0 and OpenID Connect Flows](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) |


## 2018.39

| Change                                                                                                               | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------------------- |
| [Bugs Fixed in 2018.39](#bugs-fixed-in-201839)                                                                       | September 26, 2018       | October 1, 2018                           |
| [Previously Released Early Access Features 2018.39 Update](#previously-released-early-access-features-201839-update) | Available Now            | Available Now                                |

### Bugs Fixed in 2018.39

* Requests to the `/authorize` endpoint would incorrectly prioritize values from the URI query parameter, rather than the request JWT. For more information, see the [documentation for that endpoint](/docs/api/resources/oidc#authorize). (OKTA-187642)
* When multiple attempts were simultaneously made to update a user's phone number for the [SMS](/docs/api/resources/factors#enroll-okta-sms-factor) or [Call](/docs/api/resources/factors#enroll-okta-call-factor) Factor, an HTTP 500 error was sometimes returned. (OKTA-188112)
* In some situations SHA-256 [password imports](/docs/api/resources/users#hashed-password-object) would not work. SHA-256 password import now requires the salt to be base64-encoded.

### Previously Released Early Access Features 2018.39 Update

The following features have already been released as Early Access. To enable them, {{site.contact_support_lc}}.

| Early Access Features Available Now
| :------------------------------------------------- |
| [Custom URL Domains](#custom-url-domains-are-in-early-access)|
| [Custom Okta-hosted Sign-In Page](#custom-okta-hosted-sign-in-page-is-in-early-access)|
| [Custom Error Page](#custom-error-page-is-in-early-access)|
| [Linked Objects API](#linked-objects-api-in-early-access-ea) |
| [Token Management API](#token-management-api-is-in-early-access-ea) |
| [User Consent for OAuth 2.0 and OpenID Connect Flows](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) |


## 2018.38

| Change                                                                                                               | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------------------- |
| [User Sessions Deleted after Password Reset](#user-sessions-deleted-after-password-reset)                            | September 19, 2018       | October 15, 2018                             |
| [Bugs Fixed in 2018.38](#bugs-fixed-in-201838)                                                                       | September 19, 2018       | September 24, 2018                           |
| [Previously Released Early Access Features 2018.38 Update](#previously-released-early-access-features-201838-update) | Available Now            | Available Now                                |

### User Sessions Deleted after Password Reset

We now delete all sessions for a user after a successful password reset as part of the [forgot password](/docs/api/resources/authn#forgot-password) flow. <!--OKTA-187076-->

### Bugs Fixed in 2018.38

* An HTTP 500 error would occur if the JSON body sent to create a user contained a non-string value for the following [user profile](/docs/api/resources/users#profile-object) properties: `firstName`, `lastName`, `email`, `login`, `mobilePhone`, and `secondEmail`. Any non-string values for these properties will now be converted into strings after they are sent. (OKTA-170711)

### Previously Released Early Access Features 2018.38 Update

The following features have already been released as Early Access. To enable them, {{site.contact_support_lc}}.

| Early Access Features Available Now
| :------------------------------------------------- |
| [Custom URL Domains](#custom-url-domains-are-in-early-access)|
| [Custom Okta-hosted Sign-In Page](#custom-okta-hosted-sign-in-page-is-in-early-access)|
| [Custom Error Page](#custom-error-page-is-in-early-access)|
| [Linked Objects API](#linked-objects-api-in-early-access-ea) |
| [Token Management API](#token-management-api-is-in-early-access-ea) |
| [User Consent for OAuth 2.0 and OpenID Connect Flows](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) |


## 2018.36

| Change                                                                                                               | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------------------- |
| [New Device Notification Emails are Generally Available](#new-device-notification-emails-are-generally-available-ga)       | September 5, 2018           | September 10, 2018                               |
| [Email Rate Limiting](#email-rate-limiting)                          | September 5, 2018           | September 10, 2018                              |
| [New sendEmail Parameter for User Deletion and Deactivation](#new-sendemail-parameter-for-user-deletion-and-deactivation)                          | September 5, 2018           | October 15, 2018                              |
| [Support for JWTs Signed with Private Keys](#support-for-jwts-signed-with-private-keys)                          | September 5, 2018           | September 10, 2018                              |
| [System Log Event for Rate Limit Override Expiration](#system-log-event-for-rate-limit-override-expiration)                          | September 5, 2018           | September 10, 2018                              |
| [Required Properties in App User Schema](#required-properties-in-app-user-schema)                          | September 5, 2018           | September 10, 2018                              |
| [Previously Released Early Access Features 2018.36 Update](#previously-released-early-access-features-201836-update) | Available now            | Available now                                |

### New Device Notification Emails are Generally Available (GA)

When enabled, end users will receive a new device notification email when signing in to Okta from a new or unrecognized device. This feature is now generally available to all orgs. For more information about email notifications, refer to the New or Unknown Device Notification Emails section on [this page](https://help.okta.com/en/prod/Content/Topics/Security/Security_General.htm). <!--OKTA-186366-->

### Email Rate Limiting

Okta is introducing new rate limits for emails that are sent to users. This will help with service protection. <!--OKTA-186424-->

### New sendEmail Parameter for User Deletion and Deactivation

User deletion and deactivation requests now have an optional `sendEmail` parameter. For more information see the documentation for those endpoints:

* [DELETE /api/v1/apps/${applicationId}/users/${userId}](/docs/api/resources/apps#remove-user-from-application)
* [DELETE /api/v1/users/${userId}](/docs/api/resources/users#delete-user)
* [POST /api/v1/users/${userId}/lifecycle/deactivate](/docs/api/resources/users#deactivate-user)

<!--OKTA-185729-->

### Support for JWTs Signed with Private Keys

Requests to the `/token` and `/authorize` endpoints will now accept JWTs signed with a private key. For more information see the OIDC documentation for the [token endpoint](/docs/api/resources/oidc#token) and the [authorize endpoint](/docs/api/resources/oidc#authorize). <!--OKTA-181514 + OKTA-186410-->

### System Log Event for Rate Limit Override Expiration

A System Log event will be generated exactly two days before a temporary API rate limit override is set to expire. The limit's expiration is set by customer support based on a window agreed upon when the override was requested. Once a limit has expired, it will no longer take effect and the customer will be subject to the [default limit for that API endpoint](/docs/api/getting_started/rate-limits). <!--OKTA-173997-->

### Required Properties in App User Schema

API calls to [modify an app user schema](/docs/api/resources/schemas#update-app-user-profile-schema-property) can no longer change the nullability (`required` field) of a property if that property is shown as required in the default predefined schema for that app. <!--OKTA-177449-->

### Previously Released Early Access Features 2018.36 Update

The following features have already been released as Early Access. To enable them, {{site.contact_support_lc}}.

| Early Access Features Available Now
| :------------------------------------------------- |
| [Custom URL Domains](#custom-url-domains-are-in-early-access)|
| [Custom Okta-hosted Sign-In Page](#custom-okta-hosted-sign-in-page-is-in-early-access)|
| [Custom Error Page](#custom-error-page-is-in-early-access)|
| [Linked Objects API](#linked-objects-api-in-early-access-ea) |
| [Token Management API](#token-management-api-is-in-early-access-ea) |
| [User Consent for OAuth 2.0 and OpenID Connect Flows](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) |


## 2018.35

| Change                                                                                                               | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------------------- |
| [Bugs Fixed in 2018.35](#bugs-fixed-in-201835)                                                                       | August 29, 2018          | September 4, 2018                            |
| [Previously Released Early Access Features 2018.35 Update](#previously-released-early-access-features-201835-update) | Available now            | Available now                                |

### Bugs Fixed in 2018.35

* Search queries to the [/user endpoint](https://developer.okta.com/docs/api/resources/users#list-users-with-search) with an invalid `after` parameter would return an HTTP 500 error. (OKTA-185186)

### Previously Released Early Access Features 2018.35 Update

The following features have already been released as Early Access. To enable them, {{site.contact_support_lc}}.

| Early Access Features Available Now
| :------------------------------------------------- |
| [Custom URL Domains](#custom-url-domains-are-in-early-access)|
| [Custom Okta-hosted Sign-In Page](#custom-okta-hosted-sign-in-page-is-in-early-access)|
| [Custom Error Page](#custom-error-page-is-in-early-access)|
| [Linked Objects API](#linked-objects-api-in-early-access-ea) |
| [Token Management API](#token-management-api-is-in-early-access-ea) |
| [User Consent for OAuth 2.0 and OpenID Connect Flows](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) |


## 2018.33

| Change                                                                                                               | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------------------- |
| [Bugs Fixed in 2018.33](#bugs-fixed-in-201833)                                                                       | August 15, 2018           | August 20, 2018                              |
| [Previously Released Early Access Features 2018.33 Update](#previously-released-early-access-features-201833-update) | Available now            | Available now                                |

### Bugs Fixed in 2018.33

* If an SMS factor was used within 30 seconds of the factor being auto-activated, verification would fail. (OKTA-178568)
* In some instances, Org administrators would not be allowed to create new users, despite having the proper permissions. Additionally, the system log erroneously showed successful user creation. (OKTA-169709)

### Previously Released Early Access Features 2018.33 Update

The following features have already been released as Early Access. To enable them, {{site.contact_support_lc}}.

| Early Access Features Available Now
| :------------------------------------------------- |
| [Custom URL Domains](#custom-url-domains-are-in-early-access)|
| [Custom Okta-hosted Sign-In Page](#custom-okta-hosted-sign-in-page-is-in-early-access)|
| [Custom Error Page](#custom-error-page-is-in-early-access)|
| [Linked Objects API](#linked-objects-api-in-early-access-ea) |
| [Token Management API](#token-management-api-is-in-early-access-ea) |
| [User Consent for OAuth 2.0 and OpenID Connect Flows](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) |


## 2018.32

| Change                                                                                                               | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------------------- |
| [Interstitial Page Settings are Generally Available (GA)](#interstitial-page-settings-are-generally-available)       | August 8, 2018           | September 2018                               |
| [New System Log Event Type for Denied Events](#new-system-log-event-type-for-denied-events)                          | August 8, 2018           | August 13, 2018                              |
| [Bugs Fixed in 2018.32](#bugs-fixed-in-201832)                                                                       | August 8, 2018           | August 13, 2018                              |
| [Previously Released Early Access Features 2018.32 Update](#previously-released-early-access-features-201832-update) | Available now            | Available now                                |


### Interstitial Page Settings are Generally Available

You can now disable the Okta loading animation that appears during a login redirect to your application. For more information, see [Manage the Okta interstitial page](https://help.okta.com/en/prod/Content/Topics/Settings/Settings_Customization.htm#CustomInterStitialPage).

### New System Log Event Type for Denied Events

The [System Log](/docs/api/resources/system_log) now reports when requests are denied due to a blacklist rule (such as a IP network zone or location rule). These events are logged with the event type `security.request.blocked`. (OKTA-178982)

### Bugs Fixed in 2018.32

* Fixed a bug that affected delegated authentication users: in rare cases, the user appeared to be active when locked out, or vice versa. (OKTA-180932)
* The Apps API now [returns an error](/docs/api/resources/apps#response-example-self-service-application-assignment-not-available) if changing the Application's self-service assignment settings could result in an insecure state. (OKTA-182497)

### Previously Released Early Access Features 2018.32 Update

The following features have already been released as Early Access. To enable them, {{site.contact_support_lc}}.

| Early Access Features Available Now
| :------------------------------------------------- |
| [Custom URL Domains](#custom-url-domains-are-in-early-access)|
| [Custom Okta-hosted Sign-In Page](#custom-okta-hosted-sign-in-page-is-in-early-access)|
| [Custom Error Page](#custom-error-page-is-in-early-access)|
| [Linked Objects API](#linked-objects-api-in-early-access-ea) |
| [Token Management API](#token-management-api-is-in-early-access-ea) |
| [User Consent for OAuth 2.0 and OpenID Connect Flows](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) |


## 2018.31

| Change                                                                                                               | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------------------- |
| [Bugs Fixed in 2018.31](#bugs-fixed-in-201831)                                                                       | August 1, 2018           | August 6, 2018                               |
| [Previously Released Early Access Features 2018.31 Update](#previously-released-early-access-features-201831-update) | Available now            | Available now                                |


### Bugs Fixed in 2018.31

* Fixed an issue in the OpenID Connect [logout endpoint](/docs/api/resources/oidc#logout) where performing logout with an expired session resulted in an error instead of following the `post_logout_redirect_uri`. (OKTA-180521)

* Removed System Logs entries for [granting refresh tokens](https://developer.okta.com/authentication-guide/tokens/refreshing-tokens#how-to-use-a-refresh-token) in token requests with the `refresh_token` grant type (since this grant type simply returns the original refresh token). This fix applies to both [custom Authorization Servers](https://developer.okta.com/docs/api/resources/oidc#composing-your-base-url) and the Okta Org Authorization Server. (OKTA-178335)

* Fixed issues with the [User-Consent Grant Management API](/docs/api/resources/users#user-consent-grant-operations): added missing value to `issuer`, removed `issuerId`, removed HAL links for issuer and revoke, and added hints for self GET and DELETE.  (OKTA-175296)

* Fixed a bug where SAML apps [created using the API](/docs/api/resources/apps#add-custom-saml-application) could not enable `honorForceAuthn`. (OKTA-166146)

* Fixed an issue where `login_hint` was ignored when using OAuth consent with a custom Authorization Server. (OKTA-164836)


### Previously Released Early Access Features 2018.31 Update

The following features have already been released as Early Access. To enable them, {{site.contact_support_lc}}.

| Early Access Features Available Now
| :------------------------------------------------- |
| [Custom URL Domains](#custom-url-domains-are-in-early-access)|
| [Custom Okta-hosted Sign-In Page](#custom-okta-hosted-sign-in-page-is-in-early-access)|
| [Custom Error Page](#custom-error-page-is-in-early-access)|
| [Linked Objects API](#linked-objects-api-in-early-access-ea) |
| [Token Management API](#token-management-api-is-in-early-access-ea) |
| [User Consent for OAuth 2.0 and OpenID Connect Flows](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) |


## 2018.29

| Change                                                                                                               | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------------------- |
| [Bugs Fixed in 2018.29](#bugs-fixed-in-201829)                                                                       | July 18, 2018            | July 23, 2018                                |
| [Previously Released Early Access Features 2018.29 Update](#previously-released-early-access-features-201829-update) | Available now            | Available now                                


### Bugs Fixed in 2018.29

* Using the [Zones API](/docs/api/resources/zones) to modify an existing zone that is blacklisted removed the blacklisting and coverted it to a normal IP Zone. (OKTA-176610)
* Using the [Applications API](/docs/api/resources/apps) to create an OAuth client caused an error if the `credentials.oauthClient` property was not provided, even though it is not required. (OKTA-179275)
* The System Log CSV report did not contain a value for `AuthenticationContext.issuer` for the event type `user.authentication.authenticate`. (OKTA-147165)


### Previously Released Early Access Features 2018.29 Update

The following features have already been released as Early Access. To enable them, {{site.contact_support_lc}}.

| Early Access Features Available Now
| :------------------------------------------------- |
| [Custom URL Domains](#custom-url-domains-are-in-early-access)|
| [Custom Okta-hosted Sign-In Page](#custom-okta-hosted-sign-in-page-is-in-early-access)|
| [Custom Error Page](#custom-error-page-is-in-early-access)|
| [Linked Objects API](#linked-objects-api-in-early-access-ea) |
| [Token Management API](#token-management-api-is-in-early-access-ea) |
| [User Consent for OAuth 2.0 and OpenID Connect Flows](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) |


## 2018.28

| Change                                                                                                               | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------------------- |
| [MFA Call Factor is Generally Available (GA)](#mfa-call-factor-is-generally-available-ga)   | July 11, 2018            | July 16, 2018                                |
| [Bugs Fixed in 2018.28](#bugs-fixed-in-201828)                                                                       | July 11, 2018            | July 16, 2018                                |
| [Previously Released Early Access Features 2018.28 Update](#previously-released-early-access-features-201828-update) | Available now            | Available now                                

### MFA Call Factor is Generally Available (GA)

The MFA [call factor](/docs/api/resources/factors#factor-type) is now Generally Available (GA).

### Bugs Fixed in 2018.28

* Users received an incorrect error message when using the [System Log API](/docs/api/resources/system_log) and specifying a sort order with an unbounded `until` statement. (OKTA-175411)

 * Under certain circumstances, the [System Log API](/docs/api/resources/system_log) did not return events on the first query, but did on subsequent queries. (OKTA-174660)

### Previously Released Early Access Features 2018.28 Update

The following features have already been released as Early Access. To enable them, {{site.contact_support_lc}}.

| Early Access Features Available Now
| :------------------------------------------------- |
| [Custom URL Domains](#custom-url-domains-are-in-early-access)|
| [Custom Okta-hosted Sign-In Page](#custom-okta-hosted-sign-in-page-is-in-early-access)|
| [Custom Error Page](#custom-error-page-is-in-early-access)|
| [Linked Objects API](#linked-objects-api-in-early-access-ea) |
| [Token Management API](#token-management-api-is-in-early-access-ea) |
| [User Consent for OAuth 2.0 and OpenID Connect Flows](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) |


## 2018.27

| Change                                                                                                               | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------------------- |
| [System Log API is Generally Available (GA)](#system-log-api-is-generally-available-ga)                              | July 5, 2018            | July 9, 2018                                |
| [Bugs Fixed in 2018.27](#bugs-fixed-in-201827)                                                                       | July 5, 2018            | July 9, 2018                                |
| [Previously Released Early Access Features 2018.27 Update](#previously-released-early-access-features-201827-update) | Available now            | Available now                                |

### System Log API is Generally Available (GA)

The [System Log API](/docs/api/resources/system_log) is now Generally Available. Developers of new projects are strongly recommended to use this in lieu of the Events API.

### Bugs Fixed in 2018.27

* Users who clicked an Activation Link for an [Okta Verify factor](/docs/api/resources/factors#activate-push-factor) that had already been activated would get back an HTTP 500 error. (OKTA-146511)
* Attempting to add more than the maximum number of zones via the [Zones API](/docs/api/resources/zones) would result in an HTTP 500 error. (OKTA-175991)

### Previously Released Early Access Features 2018.27 Update

The following features have already been released as Early Access. To enable them, {{site.contact_support_lc}}.

| Early Access Features Available Now
| :------------------------------------------------- |
| [Custom URL Domains](#custom-url-domains-are-in-early-access)|
| [Custom Okta-hosted Sign-In Page](#custom-okta-hosted-sign-in-page-is-in-early-access)|
| [Custom Error Page](#custom-error-page-is-in-early-access)|
| [Linked Objects API](#linked-objects-api-in-early-access-ea) |
| [Token Management API](#token-management-api-is-in-early-access-ea) |
| [User Consent for OAuth 2.0 and OpenID Connect Flows](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) |


## 2018.25

| Change                                                                                                               | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------------------- |
| [Better /userinfo Errors](#better-userinfo-errors)                                                                  | June 20, 2018            | June 25, 2018                                |
| [Bugs Fixed in 2018.25](#bugs-fixed-in-201825)                                                                       | June 20, 2018            | June 25, 2018                                |
| [Previously Released Early Access Features 2018.25 Update](#previously-released-early-access-features-201825-update) | Available now            | Available now                                |

### Better /userinfo Errors

The following information has been added to the `userinfo` endpoint's error response:

* `authorization_uri`
* `realm`
* `resource`
* a list of required scopes in the `scope` parameter <!-- OKTA-170686 -->

### Bugs Fixed in 2018.25

* In certain situations, if a call was made to the OAuth 2.0/OIDC [/authorize endpoint](/docs/api/resources/oidc#authorize) with `response_mode` set to  `okta_post_message`, an `HTTP 500` error would return. (OKTA-175326)
* Removing all permissions on a schema attribute would return a `READ_ONLY` permission. The response now correctly contains a `READ_WRITE` permission. (OKTA-173030)
* If an [Authorization Server's](/docs/api/resources/authorization-servers) `redirect_uri` was too long, an `HTTP 500` error would return. (OKTA-171950)
* The `phoneExtension` property would not be returned in `GET` requests to the Factors API's `catalog` endpoint. (OKTA-108859)

### Previously Released Early Access Features 2018.25 Update

The following features have already been released as Early Access. To enable them, {{site.contact_support_lc}}.

| Early Access Features Available Now
| :------------------------------------------------- |
| [Custom URL Domains](#custom-url-domains-are-in-early-access)|
| [Custom Okta-hosted Sign-In Page](#custom-okta-hosted-sign-in-page-is-in-early-access)|
| [Custom Error Page](#custom-error-page-is-in-early-access)|
| [Linked Objects API](#linked-objects-api-in-early-access-ea) |
| [Token Management API](#token-management-api-is-in-early-access-ea) |
| [System Log API](#system-log-api-is-in-early-access-ea) |
| [User Consent for OAuth 2.0 and OpenID Connect Flows](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) |


## 2018.24

| Change                                                                                                               | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------------------- |
| [User Login Pattern Validation](#user-login-pattern-validation)                                                      | June 13, 2018            | June 18, 2018                                |
| [Bugs Fixed in 2018.24](#bugs-fixed-in-201824)                                                                       | June 13, 2018            | June 18, 2018                                |
| [Previously Released Early Access Features 2018.24 Update](#previously-released-early-access-features-201824-update) | Available now            | Available now                                |

### User Login Pattern Validation

A user's `login` no longer needs to be in the form of an email address.  Instead the login is validated against a `pattern` property stored in the User Schema, which can be set to certain Regular Expressions.  If no pattern is set, the default validation requires email addresses. More information can be found in the [User](/docs/api/resources/users) and [Schema](/docs/api/resources/schemas) API references. <!-- OKTA-166157 -->

### Bugs Fixed in 2018.24

* Queries to the `/logs` endpoint with a `since` parameter value of less than 1 minute ago would return a `500` error. (OKTA-174239)
* It was possible to set an access policy rule with a `refreshTokenWindowMinutes` value of `0` (infinite). (OKTA-171891)
* The System Log would not display OpenID Connect App assignment and un-assignment events. (OKTA-168223)

### Previously Released Early Access Features 2018.24 Update

The following features have already been released as Early Access. To enable them, {{site.contact_support_lc}}.

| Early Access Features Available Now
| :------------------------------------------------- |
| [Custom URL Domains](#custom-url-domains-are-in-early-access)|
| [Custom Okta-hosted Sign-In Page](#custom-okta-hosted-sign-in-page-is-in-early-access)|
| [Custom Error Page](#custom-error-page-is-in-early-access)|
| [Linked Objects API](#linked-objects-api-in-early-access-ea) |
| [Token Management API](#token-management-api-is-in-early-access-ea) |
| [System Log API](#system-log-api-is-in-early-access-ea) |
| [User Consent for OAuth 2.0 and OpenID Connect Flows](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) |


## 2018.23

| Change                                                                                                               | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------------------- |
| [Factors API Now Supports U2F](#factors-api-now-supports-u2f)                      | June 6, 2018             | June 11, 2018                                 |
| [Network Selection Modes Deprecated](#network-selection-modes-deprecated)        | June 6, 2018             | June 11, 2018                                 |
| [Better Signing Key Errors](#better-signing-key-errors)        | June 6, 2018             | June 11, 2018                                 |
| [Previously Released Early Access Features 2018.23 Update](#previously-released-early-access-features-201823-update) | Available now            | Available now                                |

### Factors API Now Supports U2F

Enrollment, activation, and verification of U2F factors are now supported in the [Factors API](/docs/api/resources/factors). <!-- OKTA-112705 -->

### Network Selection Modes Deprecated

Two deprecated network selection modes (`ON_NETWORK `and `OFF_NETWORK`) have been removed from the [Network Condition Object](/docs/api/resources/policy#NetworkConditionObject). They have been replaced by the `ZONE` type. <!-- OKTA-172947 -->

### Better Signing Key Errors

If signing keys cannot be generated for a new Authorization Server, a more descriptive error will be returned. <!-- OKTA-170357 -->

### Previously Released Early Access Features 2018.23 Update

The following features have already been released as Early Access. To enable them, {{site.contact_support_lc}}.

| Early Access Features Available Now
| :------------------------------------------------- |
| [Custom URL Domains](#custom-url-domains-are-in-early-access)|
| [Custom Okta-hosted Sign-In Page](#custom-okta-hosted-sign-in-page-is-in-early-access)|
| [Custom Error Page](#custom-error-page-is-in-early-access)|
| [Linked Objects API](#linked-objects-api-in-early-access-ea) |
| [Token Management API](#token-management-api-is-in-early-access-ea) |
| [System Log API](#system-log-api-is-in-early-access-ea) |
| [User Consent for OAuth 2.0 and OpenID Connect Flows](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) |


## 2018.22

| Change                                                                                                               | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------------------- |
| [New Session Token Behavior is in Early Access](#new-session-token-behavior-is-in-early-access)                      | May 30, 2018             | June 4, 2018                                 |
| [System Log Events for New Device Notification Emails](#system-log-events-for-new-device-notification-emails)        | May 30, 2018             | June 4, 2018                                 |
| [Bugs Fixed in 2018.22](#bugs-fixed-in-201822)                                                                       | May 30, 2018             | June 4, 2018                                 |
| [Previously Released Early Access Features 2018.22 Update](#previously-released-early-access-features-201822-update) | Available now            | Available now                                |

### New Session Token Behavior is in Early Access

If a user has a valid session and passes a `sessionToken`, this `sessionToken` will override any existing session cookie. If the user has a valid session but passes an invalid `sessionToken`, then their existing session will be invalidated. Currently, if a user has a valid session and passes a `sessionToken`, the `sessionToken` will be ignored. If this feature is not enabled, the current behavior will continue. <!-- OKTA-152261 -->

### System Log Events for New Device Notification Emails

New device notification email events will now appear in the System Log. <!-- OKTA-170405 -->

### Bugs Fixed in 2018.22

* Default password policy settings were sometimes incorrectly applied when creating a user with a password. (OKTA-127830)
* The `/userinfo` [endpoint](/docs/api/resources/oidc#userinfo) would return an empty JSON object in the response body when using an invalid access token. (OKTA-169553)
* Some OAuth 2.0/OIDC refresh tokens would expire early. (OKTA-171056)

### Previously Released Early Access Features 2018.22 Update

The following features have already been released as Early Access. To enable them, {{site.contact_support_lc}}.

| Early Access Features Available Now
| :------------------------------------------------- |
| [Custom URL Domains](#custom-url-domains-are-in-early-access)|
| [Custom Okta-hosted Sign-In Page](#custom-okta-hosted-sign-in-page-is-in-early-access)|
| [Custom Error Page](#custom-error-page-is-in-early-access)|
| [Linked Objects API](#linked-objects-api-in-early-access-ea) |
| [Token Management API](#token-management-api-is-in-early-access-ea) |
| [System Log API](#system-log-api-is-in-early-access-ea) |
| [User Consent for OAuth 2.0 and OpenID Connect Flows](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) |


## 2018.20

| Change | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| :---------- | :--------------------------------- | :----------------------------------------------------------- |
| [System Log Entry Delay Change](#system-log-entry-delay-change)| May 15, 2018 | May 29, 2018 |
| [Previously Released Early Access Features 2018.20 Update](#previously-released-early-access-features-201820-update) | Available now | Available now |

### System Log Entry Delay Change

Events returned from the `/logs` endpoint when using the `until` parameter were previously delayed by up to 1 second. To improve the performance of our System Log, queries to the `/logs` endpoint that include an `until` parameter may now return results that are delayed up to 10 seconds. When making requests with an `until` value that is near real-time, ensure that you allow enough of a buffer as to not miss events (e.g. 20s).

### Bug Fixed in 2018.20

* Group search queries with underscores returned incorrect results. (OKTA-164390)

### Previously Released Early Access Features 2018.20 Update

The following features have already been released as Early Access. To enable them, {{site.contact_support_lc}}.

| Early Access Features Available Now
| :------------------------------------------------- |
| [Custom URL Domains](#custom-url-domains-are-in-early-access)|
| [Custom Okta-hosted Sign-In Page](#custom-okta-hosted-sign-in-page-is-in-early-access)|
| [Custom Error Page](#custom-error-page-is-in-early-access)|
| [Linked Objects API](#linked-objects-api-in-early-access-ea) |
| [Token Management API](#token-management-api-is-in-early-access-ea) |
| [System Log API](#system-log-api-is-in-early-access-ea) |
| [User Consent for OAuth 2.0 and OpenID Connect Flows](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) |


## 2018.19

| Change | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| :---------- | :--------------------------------- | :----------------------------------------------------------- |
| [ID Tokens Can Be Refreshed](#id-tokens-can-be-refreshed)| May 9, 2018 | May 14, 2018 |
| [Custom URL Domains are in Early Access](#custom-url-domains-are-in-early-access)| May 9, 2018 | May 14, 2018 |
| [Custom Okta-hosted Sign-In Page is in Early Access](#custom-okta-hosted-sign-in-page-is-in-early-access)| May 9, 2018 | May 14, 2018 |
| [Custom Error Page is in Early Access](#custom-error-page-is-in-early-access)| May 9, 2018 | May 14, 2018 |
| [Bugs Fixed in 2018.19](#bugs-fixed-in-201819) | May 9, 2018 | May 14, 2018 |
| [Previously Released Early Access Features 2018.19 Update](#previously-released-early-access-features-201819-update) | Available now | Available now |

### ID Tokens Can Be Refreshed

OpenID Connect ID tokens can now be retrieved using a refresh token. For more information, see our [Open ID Connect Reference](/docs/api/resources/oidc).

### Custom URL Domains are in Early Access

You can customize your Okta org by replacing the Okta domain name with a custom URL domain name that you specify. For example, if the URL of your Okta org is `https://{yourOktaDomain}`, you can configure a custom URL for the org such as `https://id.example.com`. For details, see the [Configure a custom URL domain](https://help.okta.com/en/prod/Content/Topics/Settings/custom-url-domain.htm).

### Custom Okta-hosted Sign-In Page is in Early Access

You can customize the text and the look and feel of the Okta-hosted sign-in page using form controls and an embedded HTML editor. When used together with [custom URL domain](https://help.okta.com/en/prod/Content/Topics/Settings/custom-url-domain.htm) (required) and [custom Okta-hosted error page](https://help.okta.com/en/prod/Content/Topics/Settings/custom-error-pages.htm), this feature offers a fully customized end-user sign-in experience hosted by Okta. For details, see [Configure a custom Okta-hosted sign-in page](https://help.okta.com/en/prod/Content/Topics/Settings/custom-okta-hosted-sign-in-page.htm).

### Custom Error Page is in Early Access

You can customize the text and the look and feel of error pages using an embedded HTML editor. When used together with [custom URL domain](https://help.okta.com/en/prod/Content/Topics/Settings/custom-url-domain.htm) (required) and [custom Okta-hosted sign-in page](https://help.okta.com/en/prod/Content/Topics/Settings/custom-okta-hosted-sign-in-page.htm), this feature offers a fully customized error page. For details, see [Configure a custom error page](https://help.okta.com/en/prod/Content/Topics/Settings/custom-error-pages.htm).

### Bugs Fixed in 2018.19

* Delays were experienced when deleting users. As a result of the fix, one will notice a period of time between when the deletion was initiated and when it completes.  During the period, the user will still be visible, but the deletion cannot be reversed. (OKTA-157884)

* OAuth 2.0 and OIDC requests made with redirect URLs that contained underscores in the domain name would result in an error. (OKTA-167483)

### Previously Released Early Access Features 2018.19 Update

The following features have already been released as Early Access. To enable them, {{site.contact_support_lc}}.

| Early Access Features Available Now
| :------------------------------------------------- |
| [Linked Objects API Is in Early Access (EA)](#linked-objects-api-in-early-access-ea) |
| [Token Management API Is in Early Access (EA)](#token-management-api-is-in-early-access-ea) |
| [System Log API Is in Early Access (EA)](#system-log-api-is-in-early-access-ea) |
| [User Consent for OAuth 2.0 and OpenID Connect Flows Is in Early Access (EA)](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) |


## 2018.18

| Change | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| :---------- | :--------------------------------- | :----------------------------------------------------------- |
| [Authentication Object for Step-up Authentication Is in Early Access](#authentication-object-for-step-up-authentication-is-in-early-access) | May 2, 2018 | May 7, 2018 |
| [New Version of the Okta Sign-In Widget](#new-version-of-the-okta-sign-in-widget) | Available Now | Available Now |
| [Bug Fixed in 2018.18](#bug-fixed-in-201818) | May 2, 2018 | May 7, 2018 |
| [Previously Released Early Access Features 2018.18 Update](#previously-released-early-access-features-201818-update) | Available now | Available now |

### Authentication Object for Step-up Authentication Is in Early Access

During [SP-initiated](/docs/api/resources/authn#sp-initiated-step-up-authentication) or [IdP-initiated](/docs/api/resources/authn#idp-initiated-step-up-authentication) authentication, use the [Authentication Object](/docs/api/resources/authn#authentication-object) to represent details that the target resource is using.

The Authentication Object is an [Early Access feature](/docs/api/getting_started/releases-at-okta).

### New Version of the Okta Sign-In Widget

[Version 2.8.0 of the Okta Sign-In Widget](https://www.npmjs.com/package/@okta/okta-signin-widget) provides new features, notable changes, and bug fixes. For details, visit the [okta-signin-widget repository](https://github.com/okta/okta-signin-widget/releases/tag/okta-signin-widget-2.8.0).


### Bug Fixed in 2018.18

If the configured default IdP was set to inactive, Okta still used the inactive IdP as the primary endpoint for user authentications, causing authentications to fail. (OKTA-137758)

### Previously Released Early Access Features 2018.18 Update

The following features have already been released as Early Access. To enable them, {{site.contact_support_lc}}.

| Early Access Features Available Now
| :------------------------------------------------- |
| [Linked Objects API Is in Early Access (EA)](#linked-objects-api-in-early-access-ea) |
| [Token Management API Is in Early Access (EA)](#token-management-api-is-in-early-access-ea) |
| [System Log API Is in Early Access (EA)](#system-log-api-is-in-early-access-ea) |
| [User Consent for OAuth 2.0 and OpenID Connect Flows Is in Early Access (EA)](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) |


## 2018.17

| Change | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| :---------- | :--------------------------------- | :----------------------------------------------------------- |
| [Bugs Fixed in 2018.17](#bugs-fixed-in-201817) | April 24, 2018 | May 1, 2018 |
| [Previously Released Early Access Features 2018.17 Update](#previously-released-early-access-features-201817-update) | Available now | Available now |

### Bugs Fixed in 2018.17

* If an incorrect `appInstanceId` was supplied as the IdP parameter in a request to the `/authorize` [endpoint](/docs/api/resources/oidc#authorize), an `HTTP 500` error was thrown. (OKTA-166417)

* When Okta parsed login names it failed to support addresses enclosed in double quotes as described in [RFC 3696](https://tools.ietf.org/html/rfc3696). (OKTA-164092)

### Previously Released Early Access Features 2018.17 Update

The following features have already been released as Early Access. To enable them, {{site.contact_support_lc}}.

| Early Access Features Available Now
| :------------------------------------------------- |
| [Linked Objects API Is in Early Access (EA)](#linked-objects-api-in-early-access-ea) |
| [Token Management API Is in Early Access (EA)](#token-management-api-is-in-early-access-ea) |
| [System Log API Is in Early Access (EA)](#system-log-api-is-in-early-access-ea) |
| [User Consent for OAuth 2.0 and OpenID Connect Flows is in Early Access (EA)](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) |


## 2018.15

| Change | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| :---------- | :--------------------------------- | :----------------------------------------------------------- |
| [Enhanced Feature: API Support for Assigning App Instance to App Admins](#enhanced-feature-api-support-for-assigning-app-instance-to-app-admins) | April 11, 2018 | April 15, 2018 |
| [Bug Fixed in 2018.15](#bug-fixed-in-201815) | April 11, 2018 | April 16, 2018 |
| [Previously Released Early Access Features 2018.15 Update](#previously-released-early-access-features-201815-update) | Available now | Available now |

### Enhanced Feature: API Support for Assigning App Instance to App Admins

You can add an app instance target to an `APP_ADMIN` role assignment via the API. Previously an app instance target could be added to the role assignment using the Okta administrators UI only.

When you assign an app instance target to this role assignment, the scope of the role assignment changes from all app targets to just the specified target. Thus you can use this feature to create different `APP_ADMIN` role assignments for different apps in your org.

For details, visit the [Roles API documentation](/docs/api/resources/roles#add-app-target-to-app-administrator-role). <!-- OKTA-164900 -->

### Bug Fixed in 2018.15

This fix applies if the MFA soft lock for delegated authentication feature is enabled. When a user made multiple failed MFA attempts and was locked out, the user `status` was updated to `ACTIVE` instead of the correct value, `LOCKED_OUT`. (OKTA-164900)

### Previously Released Early Access Features 2018.15 Update

The following features have already been released as Early Access. To enable them, {{site.contact_support_lc}}.

| Early Access Features Available Now
| :------------------------------------------------- |
| [Linked Objects API Is in Early Access (EA)](#linked-objects-api-in-early-access-ea) |
| [Token Management API Is in Early Access (EA)](#token-management-api-is-in-early-access-ea) |
| [System Log API Is in Early Access (EA)](#system-log-api-is-in-early-access-ea) |
| [User Consent for OAuth 2.0 and OpenID Connect Flows is in Early Access (EA)](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) |


## 2018.14

| Change | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| :---------- | :--------------------------------- | :----------------------------------------------------------- |
| [Linked Objects API in Early Access (EA)](#linked-objects-api-in-early-access-ea) | April 4, 2018 | April 9, 2018 |
| [Client SDKs Version 1.0](#client-sdks-version-10) | Available Now | Available Now |
| [Bug Fixed for 2018.14](#bug-fixed-for-201814) | April 4, 2018 | April 9, 2018 |
| [Previously Released Early Access Features](#previously-released-early-access-features) | Available now | Available now |

### Linked Objects API in Early Access (EA)

Users have relationships to each other, like manager and subordinate or customer and sales representative. You can create users with relationships by using the [Linked Objects API](/docs/api/resources/linked-objects).

Okta allows you to create up to 200 linked object definitions. These definitions are one-to-many:

* A manager has many subordinates
* A sales representative has many customers
* A case worker has many clients

Of course, most organizations have more than one manager or sales representative. You can create the linked object definition once, then assign the `primary` relationship to as many users as you have people in that relationship.

You can assign the `associated` relationship for a single `primary` user to as many users as needed. The `associated` user can be related to only one `primary` per linked object definition. But a user can be assigned to more than one linked object definition.

For more details:

* [Relationships use case](/use_cases/relationships/)
* [Linked Objects API documentation](/docs/api/resources/linked-objects) <!-- OKTA-161674 -->

### Client SDKs Version 1.0

We published the 1.0 version of the following client SDKs:

* [React SDK](https://github.com/okta/okta-oidc-js/releases/tag/%40okta%2Fokta-react%401.0.0)
* [Angular SDK](https://github.com/okta/okta-oidc-js/releases/tag/%40okta%2Fokta-angular%401.0.0)
* [Vue SDK](https://github.com/okta/okta-oidc-js/releases/tag/%40okta%2Fokta-vue%401.0.0)
* [iOS SDK](https://github.com/okta/okta-sdk-appauth-ios/releases/tag/1.0.0)

Visit each SDK for a complete list of new features, enhancements, and bug fixes. <!-- OKTA-164979 -->

### Bug Fixed for 2018.14

* If someone was able to obtain a user's activation email or password reset email and attempt to log in before the real user completed logging in, that person could access the account at the same time as the real user. (OKTA-85691)

### Previously Released Early Access Features

The following features have already been released as Early Access. To enable them, {{site.contact_support_lc}}.

| Early Access Features Available Now
| :------------------------------------------------- |
| [Token Management API Is in Early Access (EA)](#token-management-api-is-in-early-access-ea) |
| [System Log API Is in Early Access (EA)](#system-log-api-is-in-early-access-ea) |
| [User Consent for OAuth 2.0 and OpenID Connect Flows is in Early Access (EA)](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) |


## 2018.12

| Change | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| :---------- | :--------------------------------- | :----------------------------------------------------------- |
| [Change to App Variable Name Incrementing](#change-to-app-variable-name-incrementing) | March 21, 2018 | March 26, 2018 |
| [Token Management API Is in Early Access (EA)](#token-management-api-is-in-early-access-ea) | March 21, 2018 | March 26, 2018 |
| [System Log API Is in Early Access (EA)](#system-log-api-is-in-early-access-ea) | Available Now | Available Now |
| [Password Imports with Salted SHA-256 Algorithm is in Early Access (EA)](#password-imports-with-salted-sha-256-algorithm-is-in-early-access-ea) | Available Now | Available Now |
| [Bug Fixed for 2018.12](#bug-fixed-for-201812) | March 21, 2018 | March 26, 2018 |

### Change to App Variable Name Incrementing

When creating multiple instances of the same app, each instance of the app has a unique Variable Name. This Variable Name is used as part of the Okta Expression Language. Previously each instance was incrementally numbered (`salesforce_1`, `salesforce_2`, etc), but going forward each instance will instead have a 7-character alphanumeric string appended to its Variable Name. To find your app's Variable Name, go into the Profile Editor for that app. This change only affects newly created apps. <!-- OKTA-158282 -->

### Token Management API Is in Early Access (EA)

Use the Token Management API to view and revoke OAuth 2.0 and OpenID Connect refresh tokens by [end user](/docs/api/resources/users#user-oauth-20-token-management-operations), [Custom Authorization Server](/docs/api/resources/authorization-servers#oauth-20-token-management-operations), or [client app](/docs/api/resources/apps#application-oauth-20-token-operations). <!-- OKTA-145525 -->

### Bug Fixed for 2018.12

* `GET` requests to the `/authorize` [endpoint](/docs/api/resources/oidc#authorize) with `response_mode=form_post` would return an HTML page with a title `<span>`. (OKTA-162709)


## 2018.11

| Change | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| :---------- | :--------------------------------- | :----------------------------------------------------------- |
| [API Support for IdP-initiated Authentication](#api-support-for-idp-initiated-authentication) | March 14 | March 19 |
| [New Powershell Module for TLS 1.2 Compatibility](#new-powershell-module-for-tls-12-compatibility) | Available Now | Available Now |
| [Rate Limit for System Log Increased](#rate-limit-for-system-log-increased) | Available Now | Available Now |
| [New Version of Okta Sign-in Widget](#new-version-of-okta-sign-in-widget) | Available Now | Available Now |
| [System Log API Is in Early Access (EA)](#system-log-api-is-in-early-access-ea) | Available Now | Available Now |
| [Password Imports with Salted SHA-256 Algorithm is in Early Access (EA)](#password-imports-with-salted-sha-256-algorithm-is-in-early-access-ea) | Available Now | Available Now |
| [Bugs Fixed for 2018.11](#bugs-fixed-for-201811) | March 14, 2018 | March 19, 2018 |

### API Support for IdP-initiated Authentication

Use this feature to allow a client to specify the application right away during an authentication request, instead of taking the user through "step-up" authentication in a separate request. [Documentation](/docs/api/resources/authn#sp-initiated-step-up-authentication) <!-- OKTA-160275 -->

### New Powershell Module for TLS 1.2 Compatibility

The new version of Okta's Powershell module is compatible with TLS 1.2. [Documentation](https://www.powershellgallery.com/packages/Okta.Core.Automation/1.0.1)<!-- OKTA-161239 -->

### Rate Limit for System Log Increased

The rate limit for GET requests to `/api/v1/logs` has been increased from 60 per minute to 120. [Documentation](/docs/api/getting_started/rate-limits#okta-api-endpoints-and-per-minute-limits)

### New Version of Okta Sign-in Widget

Version 2.7.0 of the Okta Sign-in Widget provides new features, notable changes, and bug fixes. For details, visit [the `okta-signin-widget` repository](https://github.com/okta/okta-signin-widget/releases).

### Bugs Fixed for 2018.11

* An incorrect error message was returned when a blank password was specified in a password reset request. (OKTA-144982)
* If administrators in an org with the Developer Console enabled used the Classic user interface instead, and had no apps assigned, they couldn't access their own user home page. (OKTA-152324)
* For [the System Log API](/docs/api/resources/system_log), the `displayName` in the Target object was set to `Unknown` if the `eventType` was `user.authentication.sso` and if the value didn't exist in the profile editor.
This behavior matches the behavior in `/events`. (OKTA-156484)

## 2018.10

| Change | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| :---------- | :--------------------------------- | :----------------------------------------------------------- |
| [API Access Management is Generally Available (GA) in Production](#api-access-management-is-generally-available-ga-in-production) | Available now   | March 12, 2018  |
| [System Log API Is in Early Access (EA)](#system-log-api-is-in-early-access-ea) | March 7, 2018 | March 12, 2018 |
| [Password Imports with Salted SHA-256 Algorithm is in Early Access (EA)](#password-imports-with-salted-sha-256-algorithm-is-in-early-access-ea) | March 7, 2018 | March 12, 2018 |
| [New Parameter for Authentication with Okta Verify with Auto-Push](#new-parameter-for-authentication-with-okta-verify-with-auto-push)   | March 7, 2018 | March 12, 2018 |
| [System Log Changes for 2018.10](#system-log-changes-for-201810) | March 7, 2018 | March 12, 2018 |
| [Bugs Fixed for 2018.10](#bugs-fixed-for-201810) | March 7, 2018 | March 12, 2018 |

### API Access Management is Generally Available (GA) in Production

Secure your APIs with API Access Management, Okta's implementation of the OAuth 2.0 authorization framework. API Access Management uses the Okta Identity platform to enable powerful control over access to your APIs. API Access Management can be controlled through the administrator UI as well as a rich set of APIs for client, user, and policy management.

Generally Available (GA) in preview orgs since February 7, 2018, API Access Management is scheduled to be GA in production orgs starting March 12, 2018.

For more information, see [OAuth 2.0 and Okta](/docs/api/resources/oidc). <!--OKTA-153127-->

### System Log API is in Early Access (EA)

The Okta System Log records system events related to your organization in order to provide an audit trail that can be used to understand platform activity and to diagnose problems.

The Okta System Log API provides near real-time read-only access to your organization's system log and is the programmatic counterpart of the [System Log UI](https://help.okta.com/en/prod/Content/Topics/Reports/Reports_SysLog.htm).

Often the terms "event" and "log event" are used interchangeably. In the context of this API, an "event" is an occurrence of interest within the system and "log" or "log event" is the recorded fact.

Notes:

* The System Log API contains much more [structured data](/docs/api/resources/system_log#logevent-object) than [the Events API](/docs/api/resources/events#event-model).
* The System Log API supports [additional SCIM filters](/docs/api/resources/system_log#request-parameters) and the `q` query parameter, because of the presence of more structured data than [the Events API](/docs/api/resources/events#event-model). <!-- OKTA-160902 OKTA-160880 -->

### Password Imports with Salted SHA-256 Algorithm is in Early Access (EA)

You can use the salted SHA-256 hash type when [importing passwords](/docs/api/resources/users#create-user-with-imported-hashed-password). <!-- OKTA-160288 -->

### New Parameter for Authentication with Okta Verify with Auto-Push

We have added [an optional URL parameter, `autoPush` ](/docs/api/resources/authn#request-parameters-for-verify-push-factor) that allows Okta to store the user's Auto-Push preference when verifying Okta Verify with Auto-Push. This parameter is only necessary when implementing custom login flows that do not use the Okta Sign-In Widget. <!-- OKTA-155563 -->

### System Log Changes for 2018.10

* If a query to `/logs` timed out, an HTTP 504 error was returned. Now an HTTP 500 error will be returned. This aligns `/logs` error responses with other Okta APIs, and ensures implementation details are not leaked to API consumers. (OKTA-159642)
* The following changes to error codes related to the system log were made to make them consistent with [Okta error codes](/reference/error_codes/):
    * `MEDIA_TYPE_NOT_ACCEPTED_EXCEPTION` replaced by `UNSUPPORTED_MEDIA_TYPE`
    * `OPP_INVALID_PAGINATION_PROPERTIES` replaced by `INVALID_PAGING_EXCEPTION`
    * `OPP_INVALID_SCIM_FILTER` replaced by `INVALID_SEARCH_CRITERIA_EXCEPTION` <!-- OKTA-149847 -->

### Bugs Fixed for 2018.10

* GET requests to list 200 or more apps were taking a long time to complete. (OKTA-158391)
* Invalid IP addresses in the `X-Forwarded-For` header caused a null pointer exception (HTTP 500 `NullPointerException`) during primary authentication. (OKTA-159414)
* [List User with Search requests](/docs/api/resources/users#list-users-with-search) in preview orgs failed to return pagination links. (OKTA-160424)


## 2018.09

| Change | Expected in Preview Orgs | Rollout to Production Orgs Expected to Start |
| [API Access Management is Generally Available in Preview](#api-access-management-is-generally-available-in-preview) | February 7, 2018               | March 12, 2018  |
| [User Consent for OAuth 2.0 and OpenID Connect Flows in Early Availability (EA)](#user-consent-for-oauth-20-and-openid-connect-flows-in-early-availability-ea) | February 28, 2018               | March 5, 2018 |
| [Sessions API Supports HTTP Header Prefer](#sessions-api-supports-http-header-prefer)  | February 28, 2018               | March 5, 2018 |
| [User Schema API Allows Nullable `firstName`, `lastName`](#user-schema-api-allows-nullable-firstname-lastname) | February 28, 2018 | March 5, 2018 |
| [Improved Response Mode for OAuth 2.0 and OpenID Connect Requests](#improved-response-mode-for-oauth-20-and-openid-connect-requests)  | February 28, 2018               | March 5, 2018 |
| [Change to `/authorize` Response for `prompt` for OAuth 2.0 and OpenID Connect Requests](#change-to-authorize-response-for-prompt-for-oauth-20-and-openid-connect-requests)  | February 28, 2018               | March 5, 2018 |
| [Improved System Log Behavior for Date Queries](#improved-system-log-behavior-for-date-queries)  | February 28, 2018               | March 5, 2018 |
| [System Log Message Changes Related to Authorization Servers](#system-log-message-changes-related-to-authorization-servers)  | February 28, 2018               | March 5, 2018 |
| [Bugs Fixed for 2018.09](#bugs-fixed-for-201809)  | February 28, 2018               | March 5, 2018 |

### User Consent for OAuth 2.0 and OpenID Connect Flows in Early Availability (EA)

A consent represents a user's explicit permission to allow an application to access resources protected by scopes. As part of an OAuth 2.0 or OpenID Connect authentication flow, you can prompt the user with a page to approve your app's access to specified resources.

Consent grants are different from tokens because a consent can outlast a token, and there can be multiple tokens with varying sets of scopes derived from a single consent. When an application comes back and needs to get a new access token, it may not need to prompt the user for consent if they have already consented to the specified scopes. Consent grants remain valid until the user manually revokes them, or until the user, application, authorization server or scope is deactivated or deleted.

To configure an authorization or authentication flow to include a user consent page:

1. Verify that you have the API Access Management feature enabled, and request that User Consent also be enabled.
2. Create an app via the Apps API with the appropriate values for `tos_uri`, `policy_uri`, and `consent_method`. ([Details](/docs/api/resources/apps#settings-7))

    Note: You can also configure an existing app in the administrator UI: **Applications > [Application Name] > General > User Consent**.

3. Ensure that your authentication or authorization flow is configured properly. The combination of `prompt` in the `/authorize` request, `consent_method` set on the app in the previous step, and `consent`, a property set on scopes, controls whether a user consent window is displayed during the authentication flow. [Details](/docs/api/resources/apps#settings-7)

<!-- OKTA-158107 -->

### Sessions API Supports HTTP Header Prefer

Okta now supports [the HTTP Header `Prefer`](https://tools.ietf.org/html/rfc7240#section-4.2) in [the Sessions API for refreshing sessions](/docs/api/resources/sessions#refresh-current-session). You can extend the session lifetime, but skip any processing work related to building the response body.

#### Example Request

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}/api/v1/sessions/me/refresh"
~~~
Note: `me` can also be an ID.

#### Example Response

~~~http
HTTP/1.1 204 No Content
Preference-Applied: return=minimal
~~~
<!-- OKTA-152559 -->


### User Schema API Allows Nullable `firstName`, `lastName`

You can set `firstName` or `lastName` to be nullable in [the User Profile Base sub-schema](/docs/api/resources/schemas#user-profile-base-subschema). These properties are defined in a profile sub-schema with the resolution scope `#base`.

### Improved Response Mode for OAuth 2.0 and OpenID Connect Requests

For [the `form_post` response mode](/docs/api/resources/oidc#parameter-details), we have reduced the HTML content returned in an OpenID Connect or OAuth 2.0 request. Now the response is only a form containing the requested tokens (access token, ID token, or both) and JavaScript to post the form. <!-- OKTA-96521 -->

### Change to `/authorize` Response for `prompt` for OAuth 2.0 and OpenID Connect Requests

If you set `prompt=none` for a request on `/authorize` and the maximum age before sign-in is required (`max_age`) is exceeded, an error is returned. This ensures the safest possible result when [these two settings contradict each other](/docs/api/resources/oidc#parameter-details).

This applies to `/authorize` with either the Okta Org Authorization Server or a Custom Authorization Server (which requires API Access Management).

#### Example: Old Message Format

~~~xml
{
    "errorCode": "E0000001",
    "errorSummary": "Api validation failed: com.saasure.core.services.user.InvalidUserProfileException: Could not create user due to invalid profile: com.saasure.framework.validation.util.SimpleErrors: 1 errors\nError in object 'newUser': codes [password.passwordRequirementsNotMet.newUser,password.passwordRequirementsNotMet]; arguments [Password requirements: at least 8 characters, a lowercase letter, an uppercase letter, a number, no parts of your username.]; default message [Password requirements were not met. Password requirements: at least 8 characters, a lowercase letter, an uppercase letter, a number, no parts of your username.]",
    "errorLink": "E0000001",
    "errorId": "oaecNfS38enQ8KtWDvNfusWRw",
    "errorCauses": [
        {
            "errorSummary": "Password requirements were not met. Password requirements: at least 8 characters, a lowercase letter, an uppercase letter, a number, no parts of your username."
        }
    ]
}
~~~

#### Example: New Message Format

~~~xml
{
    "errorCode": "E0000001",
    "errorSummary": "Api validation failed: com.saasure.core.services.user.InvalidUserProfileException: Could not create user due to invalid profile: com.saasure.framework.validation.util.SimpleErrors: 3 errors\nField error in object 'newUser' on field 'password': rejected value [aaaa]; codes [password.minlength.newUser.password,password.minlength.password,password.minlength.java.lang.String,password.minlength]; arguments [8]; default message [Password requirements: at least 8 characters.]\nField error in object 'newUser' on field 'password': rejected value [aaaa]; codes [password.uppercase.newUser.password,password.uppercase.password,password.uppercase.java.lang.String,password.uppercase]; arguments [Password requirements: at least 0 characters, an uppercase letter.]; default message [Password requirements: at least 0 characters, an uppercase letter.]\nField error in object 'newUser' on field 'password': rejected value [aaaa]; codes [password.number.newUser.password,password.number.password,password.number.java.lang.String,password.number]; arguments [Password requirements: at least 0 characters, a number.]; default message [Password requirements: at least 0 characters, a number.]",
    "errorLink": "E0000001",
    "errorId": "oaeGZUg95w6SK2GbA44cXgtvA",
    "errorCauses": [
        {
            "errorSummary": "password: Passwords must be at least 8 characters in length",
            "reason": "LENGTH_MINIMUM",
            "location": "credentials.password.value",
            "locationType": "body",
            "domain": "user"
        },
        {
            "errorSummary": "password: Password requirements: at least 0 characters, an uppercase letter.",
            "reason": "UPPER_CASE_REQUIRED",
            "location": "credentials.password.value",
            "locationType": "body",
            "domain": "user"
        },
        {
            "errorSummary": "password: Password requirements: at least 0 characters, a number.",
            "reason": "NUMBER_REQUIRED",
            "location": "credentials.password.value",
            "locationType": "body",
            "domain": "user"
        }
    ]
}
~~~

If you don't want these changes, {{site.contact_support_lc}} to opt out.

### Improved System Log Behavior for Date Queries

1. For `/logs`, the request parameters [`since` and `until`](/docs/api/resources/system_log#request-parameters) require [the RFC 3339 Internet Date/Time Format profile of ISO 8601](https://tools.ietf.org/html/rfc3339#page-8). This allows queries to more accurately target date ranges. <!-- OKTA-149837 -->

2. For /`logs`, [the maximum page size](/docs/api/resources/system_log#request-parameters) is 1,000 messages (`limit=1000`). The default remains at 100. <!-- OKTA-154711, OKTA-157865 -->

### System Log Message Changes Related to Authorization Servers

The following message changes apply to either the Okta Org Authorization Server or a Custom Authorization Server including `default` (which requires API Access Management), or both, as indicated in each section.

#### Simplified Failure Messages from [`/authorize`](/docs/api/resources/oidc#authorize) Requests for `/events` System Log

The existing messages `app.oauth2.authorize_failure`, `app.oauth2.as.authorize_failure` and `app.oauth2.as.authorize.scope_denied_failure` replace these messages:

* `app.oauth2.authorize.access_denied`
* `app.oauth2.authorize.invalid_client_id`
* `app.oauth2.authorize.invalid_cache_key`
* `app.oauth2.authorize.no_existing_session`
* `app.oauth2.authorize.login_failed`
* `app.oauth2.authorize.mismatched_user_in_cache_and_session`
* `app.oauth2.authorize.user_not_assigned`
* `app.oauth2.authorize.scope_denied`
* `app.oauth2.as.authorize.warn_failure`
* `app.oauth2.as.authorize.scope_denied`

Details about the nature of the failure are included, so no information has been lost with this simplification.

These system log changes affect responses from requests that involve either the Okta Org Authorization Server or a Custom Authorization Server including `default`.

#### Simplified Failure Messages from [`/token`](/docs/api/resources/oidc#token) Requests for `/events` System Log

Instead of supplying two different messages for token grant failures on `/token`, the existing message `app.oauth2.as.authorize.token.grant_failure` replaces
these messages:

* `app.oauth2.as.token.grant.warn_failure`
* `app.oauth2.as.token.grant.scope_denied_failure`

This system log change affects responses from requests that involve a Custom Authorization Server including `default`.

#### Simplified Success Messages from  [`/token`](/docs/api/resources/oidc#token) Requests for `/events` System Log

Instead of supplying a different message for ID token and access token generation, there's just one message for each. The ID token or access token minted is included in the message as it was previously.

1. The existing message `app.oauth2.authorize.implicit_success` replaces:

    * `app.oauth2.authorize.implicit.id_token_success`
    * `app.oauth2.authorize.implicit.access_token_success`

2. The existing message `app.oauth2.as.authorize.implicit_success` replaces:

    * `app.oauth2.as.authorize.implicit.id_token_success`
    * `app.oauth2.as.authorize.implicit.access_token_success`

The `_success` messages weren't being written to the System Log previously, but are now. <!-- OKTA-157235 -->

These system log changes affect responses from requests that involve either the Okta Org Authorization Server or a Custom Authorization Server including `default`.

#### Simplified Messages from  [`/token`](/docs/api/resources/oidc#token) Requests for `/logs` System Log

Instead of supplying a different message for ID token and access token generation, there's just one message for each. The ID token or access token minted is included in the message as it was previously.

1. The existing message `app.oauth2.authorize.implicit` replaces:

    * `app.oauth2.authorize.implicit.id_token`
    * `app.oauth2.authorize.implicit.access_token`

2. The existing message `app.oauth2.as.authorize.implicit` replaces:

    * `app.oauth2.as.authorize.implicit.id_token`
    * `app.oauth2.as.authorize.implicit.access_token` <!-- OKTA-155402 -->

These system log changes affect responses from requests that involve either the Okta Org Authorization Server or a Custom Authorization Server, including `default`.

### Bugs Fixed for 2018.09

The following bugs have been fixed and are expected in preview orgs February 28, 2018 and production orgs starting March 5, 2018.

* If a user had a status of `ACTIVE` and had never signed in, and an API call reset the user's password, the user's status was incorrectly changed from `ACTIVE` to `PROVISIONED`, instead of the expected `RECOVERY`. (OKTA-154024)
* If `-admin` was incorrectly included in the domain name during initialization of [an OktaAuth object](https://github.com/okta/okta-auth-js), no error was returned. (OKTA-156927)
* If a user was created with a password, that password wasn't considered as part of their password history. (OKTA-158966)



## 2018.07

### Feature Enhancement

The following feature enhancement is expected in preview orgs February 14, 2018, and in production orgs on February 27, 2018.

#### Keystore Rollover Events Now Logged

OAuth key store rollover events are now included in both the [Events](/docs/api/resources/events) and [System Log](/docs/api/resources/system_log) APIs.<!-- OKTA-129535 -->

### Bug Fixed

The following bug has been fixed and is expected in preview orgs February 14, 2018 and production orgs starting February 27, 2018.

* The error message "Exception while persisting IdpAppUser" wasn't available in the [System Log API](/docs/api/resources/system_log). (OKTA-153604)



## 2018.06

### Feature Enhancements

| Feature Enhancement        | Expected in Preview Orgs | Expected in Production Orgs |
|:------------------------------------|:------------------------------------|:---------------------------------------|
| [API Access Management is Generally Available in Preview](#api-access-management-is-generally-available-in-preview) | February 7, 2018               | starting March 12, 2018                  |
| [New Administrator Role for API Access Management](#new-administrator-role-for-api-access-management) | February 7, 2018 | starting February 12, 2018 |
| [New and Changed Messages for the System Log](#new-and-changed-messages-for-the-system-log) | February 7, 2018 | starting February 12, 2018 |

#### API Access Management is Generally Available in Preview

Secure your APIs with API Access Management, Okta's implementation of the OAuth 2.0 authorization framework. API Access Management uses the Okta Identity platform to enable powerful control over access to your APIs. API Access Management can be controlled through the administrator UI as well as a rich set of APIs for client, user, and policy management.

For more information, see [OAuth 2.0 and Okta](/docs/api/resources/oidc). <!--OKTA-153127-->

#### New Administrator Role for API Access Management

If you have API Access Management enabled, you can use a dedicated administrator's role for API Access Management: the **API Access Management Admin** role. Use this role to manage custom authorization servers and related tasks:

* Create and edit authorization servers, scopes, custom claims, and access policies
* Create and edit  OAuth 2.0 and OpenID Connect client apps
* Assign users and groups to OAuth 2.0 and OpenID Connect client apps

To change the role assigned to a user, use [the Administrator Roles API](/docs/api/resources/roles) or visit **Security > Administrators** in the administrator UI. <!--OKTA-107617-->

#### New and Changed Messages for the System Log

We've added a new message and improved an existing one in the System Log (`/api/v1/logs`):

* A message is now written to the System Log when password credentials fail. Previously this message was written only to `/api/v1/events`. <!--OKTA-153603-->
* The System Log message `policy.rule.deactivated` specifies in the Debug Context when the cause of a rule being disabled is that all the network zones for that rule have been deleted. <!-- OKTA-156445 -->

### Bug Fixed

The following bug has been fixed and is expected in preview orgs February 7, 2018 and production orgs starting February 12, 2018.

* A spurious `next` link from the response headers was returned by a policy get operation (`GET {url}
/api/v1/policies`). (OKTA-152522)


## 2018.05

### Feature Enhancements

| Feature Enhancement                          | Expected in Preview Orgs | Expected in Production Orgs |
|:---------------------------------------------------|:------------------------------------|:---------------------------------------|
| [App User Schema API is Generally Available](#generally-available-app-user-schema-api)   | Available Now          | Available Now  |
| [Special HTML Characters in `state` for `okta_post_message`](#special-html-characters-in-state-for-okta_post_message) | January 31, 2018        | February 7, 2018                |
| [Custom Scopes in Metadata Endpoints](#custom-scopes-in-metadata-endpoints) | January 31, 2018        | February 7, 2018                |
| [Improved Enforcement of Authorization Server Policies](#improved-enforcement-of-authorization-server-policies) | January 31, 2018        | February 7, 2018                |
| [Functions for Including Groups in Tokens](#functions-for-including-groups-in-tokens) | January 31, 2018        | February 7, 2018        |
| [New System Log Messages](#new-system-log-messages) | January 31, 2018        | February 7, 2018                |
| [New Version of the Sign-In Widget](#new-version-of-the-sign-in-widget) | Available Now | Available Now |

#### Generally Available: App User Schema API
Use the [App User Schema API](/docs/api/resources/schemas#app-user-schema-operations) to work with App User profiles, typically for apps that have features for provisioning users. <!--OKTA-154105-->

#### Special HTML Characters in `state` for `okta_post_message`

You can include HTML special characters in the `state` parameter for `okta_post_message`.
Note that [`state` in the main request body](/docs/api/resources/oidc#request-parameters-1) already allows these characters. <!-- OKTA-91165 -->

#### Custom Scopes in Metadata Endpoints

You can specify whether or not to include custom scopes in the metadata endpoints for [OAuth 2.0](/docs/api/resources/oidc#well-knownoauth-authorization-server) and [OpenID Connect](/docs/api/resources/oidc#well-knownopenid-configuration).
Existing custom scopes are not exposed by default. Set the [`metadataPublish` attribute to `ALL_CLIENTS`](/docs/api/resources/authorization-servers#scope-properties) to change the behavior. <!-- OKTA-106548 -->

#### Improved Enforcement of Authorization Server Policies

When a client application tries to redeem an authorization token from a refresh token issued by a custom authorization server, policies are evaluated again. This ensures any changes since the time the refresh token was issued are checked. <!-- OKTA-117622 -->

#### Functions for Including Groups in Tokens

Use [the new EL functions `Group.contains`, `Group.startsWith`, and `Group.endsWith`](/reference/okta_expression_language/#group-functions) to define a set of dynamic groups to be included in tokens minted from Okta's authorization servers. <!-- OKTA-142824 -->

These functions complement [the existing EL function `getFilteredGroups`](/docs/how-to/creating-token-with-groups-claim) which helps you create a static list of groups for inclusion in a token.

#### New System Log Messages

User account updates have two new events written to the system log ( `/api/v1/events` and `/api/v1/logs`): 

* The `user.account.unlock_by_admin` event complements the existing `user.account.unlock` event which is triggered only by self-service unlock or automatic unlock. The `user.account.unlock_by_admin` event is triggered when an administrator unlocks an account.
* The `user.account.update_primary_email` event is triggered only when a primary email is updated. It's not triggered by profile sync or other automated processes. <!-- OKTA-154452 -->

#### New Version of the Sign-In Widget
Version 2.6.0 of [the Okta Sign-In Widget](https://www.npmjs.com/package/@okta/okta-signin-widget) is available. Check out the new features and bug fixes!

### Bugs Fixed

The following bugs have been fixed and are expected in preview orgs January 31, 2018 and production orgs starting February 7, 2018.

* Client applications could redeem an access token from a refresh token if it contained a deleted scope. (OKTA-154738)
* The exception thrown when creating a zone without the correct features enabled was incorrect `501: unsupported operation`.
    Now the correct exception is thrown: `401: You do not have permission to access the feature you are requesting.` (OKTA-154940)
* Requests to `/api/v1/authn` with `deviceToken` in the body of the request incorrectly prompted the user for MFA, even after successfully verifying the factor the first time, if:
    * The org had MFA enabled ( **Sign On Policy > Prompt for Factor > Per Device** ).
    * The user was assigned to an app that had password sync enabled. (OKTA-156826)

## 2018.03

### Feature Enhancements

| Feature Enhancement                          | Expected in Preview Orgs | Expected in Production Orgs |
|:---------------------------------------------------|:------------------------------------|:---------------------------------------|
| [App User Schema API is Generally Available](#generally-available-app-user-schema-api)   | Available Now          | February 13, 2017  |
| [User Email Operations](#beta-user-email-operations) | Available Now        | January 23, 2018                |

#### Generally Available: App User Schema API
Use the [App User Schema API](/docs/api/resources/schemas#app-user-schema-operations) to work with App User profiles, typically for apps that have features for provisioning users. <!--OKTA-154105-->

#### Beta: User Email Operations

Okta provides endpoints in the Users API for managing a user's email. See [the Users API documentation](/docs/api/resources/users#user-email-operations) for more information. <!--OKTA-153777-->

## 2018.02

### Feature Enhancements

| Feature Enhancement                          | Expected in Preview Orgs | Expected in Production Orgs |
|:---------------------------------------------------|:------------------------------------|:---------------------------------------|
| [App User Schema API is Generally Available](#generally-available-app-user-schema-api)   | January 10, 2018          | February 13, 2017  |
| [SHA-256 Certificates for New SAML 2.0 Apps is Generally Available](#generally-available-sha-256-certificates-for-saml-20-apps) | Available  Now        | January 10, 2018                |

#### Generally Available: App User Schema API
Use the [App User Schema API](/docs/api/resources/schemas#app-user-schema-operations) to work with App User profiles, typically for apps that have features for provisioning users. <!--OKTA-154105-->

#### Generally Available: SHA-256 Certificates for SAML 2.0 Apps

When you create a SAML 2.0 app in Okta, the app is created with SHA-256 signed public certificates. Certificates for existing SAML 2.0 apps aren't changed. To update an existing app, use [these instructions](/docs/how-to/updating_saml_cert#existing-saml-20-app-integrations).<!--OKTA-132058-->

### Bug Fixes

The following bugs have been fixed, and are expected in preview orgs starting January 10, 2018, and in production orgs starting January 16, 2018.

* Network zones couldn't be deleted if they were associated with a sign-on policy, even after the policy has been deleted. (OKTA-150747)
* Results returned from the Users API incorrectly reported the status of some users who were mastered by Active Directory. The statuses `PASSWORD_RESET` or `LOCKED_OUT` were reported as `ACTIVE`. (OKTA-153214, OKTA-151861)

## 2017.52

### Feature Enhancements

| Feature Enhancement                          | Expected in Preview Orgs | Expected in Production Orgs |
|:---------------------------------------------------|:------------------------------------|:---------------------------------------|
| [Token Preview](#token-preview)          | December 28, 2017          | January 8, 2017                     |
| [New values for `amr` base claim](#new-values-for-amr-base-claim) | December 28, 2017          | January 8, 2017                |

#### Token Preview

Configuring an application or integration to use OpenID Connect  ID tokens or OAuth 2.0 access tokens can take a lot of trial-and-error.
Okta has made it easier to choose configuration settings and see the resulting tokens in the **Token Preview** tab of the Authorization Server page:

{% img release_notes/token_preview.png alt:"Screen shot of token preview tab" %}

Add values on the left side to see how they would affect the token on the right. All the fields are selection boxes except User.
For User, type in the first few letters to see a choice of user names.

You can try out different combinations of values, and see the resulting tokens (or error messages).
Once you've got the right combination, it's easy to configure your authorization server and other components. <!-- OKTA-149604 -->

#### New Values for `amr` Base Claim

We improved some behaviors related for base claim `amr`:

* When [MFA factors `sms` or `call`](/docs/api/resources/factors#factor-type) are used, the `amr` claim returns [`mca`](/docs/api/resources/sessions#amr-object).
* When [MFA factor `token:hardware`](/docs/api/resources/factors#factor-type) is used, the `amr` claim returns `hwk`.
* When [MFA factor `web`](/docs/api/resources/factors#factor-type) is used, the `amr` claim returns `swk`. <!-- OKTA-152175 -->

### Bug Fix: Legacy Events Available in System Log

This bug fix is expected in preview orgs starting December 28, 2017 and expected in production orgs starting January 8, 2017.

The following legacy events, already present in the `/api/v1/events` endpoint, are also available in the `/api/v1/logs` endpoint (System Log API):

* `app.auth.slo.with_reason`
* `app.auth.slo.saml.malformed_request.invalid_type`
* `app.keys.clone_legacy`
* `app.keys.generate_legacy`
* `app.keys.rotate_legacy`

<!-- OKTA-150052 OKTA-150082 OKTA-150157 OKTA-150177 OKTA-150194 -->


## 2017.50

### Enhanced Feature

#### Strict Policy Enforcement for Password Changes

Added `strict` optional parameter to the following operations:

* [Update User](https://developer.okta.com/docs/api/resources/users#update-user)
* [Change Password](https://developer.okta.com/docs/api/resources/users#change-password)

This parameter allows you to force the validation of the password policy's `minAge` and `passwordHistory` requirements when an updated password is sent. This will be Generally Available in preview orgs starting on Dec 13, 2017 and in production orgs starting on Dec 19, 2017.
<!-- OKTA-148151 -->

### API Bug Fix

The following bug fixes will be available on preview orgs starting Dec 13, 2017, and will be available on production orgs starting December 19, 2017:

* When using the [Zones API](https://developer.okta.com/docs/api/resources/zones#update-an-ip-zone), erasing all IP addresses in the Default IP Blacklist zone caused an error. (OKTA-145602)

## 2017.49

### New and Enhanced Features

| Feature | Available in Preview Orgs | Available in Production Orgs |
| :------------------------------------ | :------------------------ | :------------------- |
| [App User Schema API in EA](#early-access-feature-in-preview-app-user-schema-api)  | December 6, 2017 | January 10, 2017 |
| [HAL Link Rollout](#completing-rollout-of-simple-hal-links)                     | December 6, 2017 | December 12, 2017 |
| [JWT as a Request Parameter](#jwt-as-a-request-parameter) | December 6, 2017 | December 12, 2017 |

#### Early Access Feature in Preview: App User Schema API

The [App User Schema API](/docs/api/resources/schemas#app-user-schema-operations) is an [Early Access (EA)](/docs/api/getting_started/releases-at-okta#early-access-ea) release. Use this API to work with App User profiles, typically for apps that have features for provisioning users.
<!-- OKTA-148782 -->

#### Completing Rollout of Simple HAL Links

In previous releases, Okta enabled functionality which modifies the set of links returned with user collection elements. In the new functionality, when a collection of Users is returned, the Links object returned with each element contains only the `_self` link, which can be used to obtain the individual User object. The User object contains the full set of links. We made this change to ensure you always have up-to-date and complete links.

Most orgs already have this functionality and should see no change in behavior.
Some orgs did not receive this functionality because they were identified as possible users of the .NET SDK. These customers have received a communication from Okta outlining the changes and any actions they might need to take.

Some preview orgs created with the Developer Paid edition will receive the new functionality on preview orgs starting December 6, 2017, and on production orgs starting December 12, 2017. 

See [the User Model documentation](/docs/api/resources/users#user-model) for more information. <!-- OKTA-150507 -->

#### JWT as a Request Parameter

A new parameter, `request` is available for all `/authorize` endpoints. The parameter contains a JWT created by the client, enabling requests to be passed in a single, self-contained parameter. This JWT must be signed. 

For details about using `request`, see [Oauth 2.0](/docs/api/resources/oidc#request-parameters-1) or [OpenID Connect](/docs/api/resources/oidc#request-parameters-3) documentation. <!-- OKTA-78476 -->

### API Bug Fixes

The following bug fixes will be available on preview orgs starting Dec 6, 2017, and will be available on production orgs starting December 11, 2017:

* Password requirements were incorrectly evaluated on passwords longer than 72 characters. (OKTA-144636)

* If the number of results in a page was divisible by the `limit` parameter value, an additional empty page was incorrectly returned. (OKTA-146006)

* If an app embed link with a session token was used to access an app, the user was incorrectly prompted to authenticate again, instead of using the token to launch the application. (OKTA-149823)

## 2017.47

### API Bug Fix

The following bug fix will be available on preview orgs starting November 21, and will be available on production orgs starting November 28, 2017:

* A partial profile update (POST `/api/v1/users/ {userId}`) incorrectly required that `login` be specified in the `profile`. (OKTA-145770)

## 2017.46

### API Bug Fix

The following bug fix is available now on preview orgs, and will be available on production orgs starting November 28, 2017:

* After updating a user with a POST to `/user/{userId}`, HAL links would not be included in the response body. (OKTA-145195)

## 2017.45

### API Feature Enhancements

| Feature Enhancement                                                                   | Expected in Preview Orgs | Expected in Production Orgs |
|:--------------------------------------------------------------------------------------|:-------------------------|:----------------------------|
| [App Label Length Increase](#app-label-length-increase)                                     | November 8, 2017          | November 14, 2017             |
| [GET Users by ID Rate Limit Increased](#get-users-by-id-rate-limit-increased)               | November 8, 2017          | November 14, 2017             |
| [User ID Now Included in Token Log Events](#user-id-now-included-in-token-log-events) | November 8, 2017          | November 14, 2017             |
| [IdP Provisioning Policy Conditions in GA](#idp-provisioning-policy-conditions-in-ga)                                                             | November 8, 2017        | November 14, 2017             |

#### App Label Length Increase

App `label` maximum length has been increased from 50 to 100 characters. <!--OKTA 146865-->

#### GET Users by ID Rate Limit Increased

The default rate limit for GET requests to `/api/v1/users/${userId}` has been increased from 600 to 2000. <!--OKTA 144705-->

#### User ID Now Included in Token Log Events

The System Log and Events APIs now report the `userId` in API Access Management and OpenID Connect access token and refresh token events. This `userId` appears as a `Subject` field in the event. For the `client_credentials` grant type, `userId` will not be included since there is no user context. <!--OKTA 143854-->

#### IdP Provisioning Policy Conditions in GA

Identity Provider Provisioning Policy [Conditions](/docs/api/resources/idps#provisioning-policy-object) are now Generally Available. <!--OKTA 123811-->

### API Bug Fixes

The following bug fixes are available now on preview orgs, and will be available on production orgs starting November 14, 2017:

* System log messages for refresh token events failed to include the `displayName`. In this context, the display name reports that the event was for a refresh token. (OKTA-146743)
* Using `nextLogin` to create a user with an expired password was successful but incorrectly reported the status as `ACTIVE` in the response. (OKTA-136663)
* When importing users into an app group, the System Log event would display `unknown` for the target user's  `AlternateId` and `DisplayName` properties. (OKTA-145115)
* In some instances, the `enum` property could not be used in conjunction with JSON Schema validations for `minLength`/`maxLength` (for strings)  or `minimum`/`maximum` (for integers/numbers). (OKTA-142732)

## 2017.44

### API Feature Enhancements: New Query Parameter for Create User

Use [the new query parameter `nextLogin`](/docs/api/resources/users#request-parameters) with a create user API request to create and activate a user with an expired password.
The user has to change his or her password the next time they log in. This new query parameter eliminates the need to use two API calls to achieve the same result. <!-- OKTA-142029 -->

This feature enhancement is expected in preview orgs starting November 1, 2017, and in production orgs starting November 6, 2017.

### API Bug Fixes

Three bug fixes are available now on preview orgs, and will be available on production orgs starting November 6, 2017:

* The default ports in the App Wizard in the Developer Console have been changed from `3000` to `8080`. (OKTA-144916)
* An error string was unclear. The string is returned when a session times out while waiting for a user to enter MFA credentials during an OpenID Connect `/oauth2/v1/authorize` or OAuth 2.0 `/oauth2/${authServerId}/v1/authorize` request. (OKTA-143916)
* An error, `User not assigned to app` was incorrectly returned from a `GET /oauth2/v1/authorize` request for Oauth 2.0 clients with a custom client ID. (OKTA-146566)

Two bug fixes are expected on preview orgs starting Nov 1, 2017, and will be available on production orgs starting November 6, 2017:

* System log entries for API Access Management and OpenID Connect now correctly report client IDs and the number of tokens which were revoked in a refresh token. (OKTA-145486)
* The OpenID Connect claim `phone_number_verified` was returned from some authorization servers. The claim has been removed because Okta doesn't support this claim yet. (OKTA-146470)

## 2017.43

### API Bug Fixes

These bug fixes are expected on preview orgs starting October 25, 2017, and on production orgs starting November 8, 2017.

* The default ports in the App Wizard in the Developer Console have been changed from `3000` to `8080`. (OKTA-144916)
* An error string was unclear. The string is returned when a session times out while waiting for a user to enter MFA credentials during an OpenID Connect `/authorize` call. (OKTA-143916)

##  2017.42

### API Feature Enhancements

#### Group Rule Evaluations Included in System Log

Group Rule evaluation failures are now exposed via the System Log API.<!-- OKTA-140086 -->

### API Bug Fixes

These bug fixes are expected on preview orgs starting October 18, 2017, and on production orgs starting October 24, 2017.

* ID tokens requested alongside access tokens or authorization codes from custom authorization servers did not include OpenID Connect claims. This caused client applications, including the Okta Sign-In Widget, to not pre-populate the username. (OKTA-143857, 2017.40 Preview Fix)

## 2017.41

### API Feature Enhancements

#### API Access Management Logs in Events API

<!-- OKTA-129243 -->

API Access Management now generates System Log events available via the Events API. This will be Generally Available in preview orgs starting on October 11, 2017 and in production orgs starting on October 17, 2017.

#### New Version of Sign-In Widget 

<!-- OKTA-144563-->

Version 2.3 of the [Okta Sign-In Widget](https://github.com/okta/okta-signin-widget/releases/tag/okta-signin-widget-2.3.0) is available. Check out the new features and bug fixes!

### API Bug Fixes

These bug fixes are expected on preview orgs starting October 11, 2017, and on production orgs starting October 17, 2017.

* Active Directory Password Policies now always return a `maxAgeDays` value of `0`, since this setting is unsupported by Active Directory. (OKTA-142874)
* Deleting a user failed if the user's primary and secondary emails were the same. (OKTA-142765)
* Deleting a user failed if the domain portion of the username string was too long. (OKTA-141876)
* Radius authentication flows would erroneously trigger `user.session.end` events in the log. (OKTA-138775)
* When a user signed in to Okta via IWA and without an MFA prompt, there was no sign on policy evaluation entry present in the system log. (OKTA-136545)
* User authentication attempts blocked by geographic restrictions in Adaptive MFA were logged as a successful login followed by a `Login Denied` event in the system log. (OKTA-112077)

## 2017.40

### API Feature Enhancements

| Feature Enhancement                                                                   | Expected in Preview Orgs | Expected in Production Orgs |
|:--------------------------------------------------------------------------------------|:-------------------------|:----------------------------|
|[Concurrent Rate Limits](#concurrent-rate-limits)                                     | October 4, 2017          | October 9, 2017             |
|[OpenID Connect Scope Change](#openid-connect-scope-change)               | October 4, 2017          | October 9, 2017             |
|[Help Desk Administrator Role Generally Available](#help-desk-administrator-role-generally-available) | October 4, 2017          | October 9, 2017             |
|[Policy API](#policy-api)                                                             | September 7, 2017        | October 9, 2017             |
|[Password Policy API](#password-policy-api)                                           | September 7, 2017        | October 9, 2017             |


#### Concurrent Rate Limits
In order to protect the service for all customers, Okta enforces concurrent rate limits starting with this release.
Concurrent limits are distinct from [the org-wide, per-minute API rate limits](/docs/api/getting_started/rate-limits#org-wide-rate-limits).

For concurrent rate limits, traffic is measured in three different areas. Counts in one area aren't included in counts for the other two:

* For agent traffic, Okta measured each org's traffic and set the limit above the highest usage in the last four weeks.
* For Office365 traffic, the limit is 75 concurrent transactions per org.
* For all other traffic including API requests, the limit is 75 concurrent transactions per org.

Okta has verified that these limits are sufficient based on current usage. As a result of verification, we increased the limit for some orgs to 150.

The first request to exceed the concurrent limit returns an HTTP 429 error, and the first error every sixty seconds is written to the log.
Reporting concurrent rate limits once a minute keeps log volume manageable.

##### Example Error Response Events

~~~json
{
    "eventId": "tevEVgTHo-aQjOhd1OZ7QS3uQ1506395956000",
    "sessionId": "102oMlafQxwTUGJMLL8FhVNZA",
    "requestId": "reqIUuPHG7ZSEuHGUXBZxUXEw",
    "published": "2017-09-26T03:19:16.000Z",
    "action": {
      "message": "Too many concurrent requests in flight",
      "categories": [],
      "objectType": "core.concurrency.org.limit.violation",
      "requestUri": "/report/system_log"
    },
    "actors": [
      {
        "id": "00uo7fD8dXTeWU3g70g3",
        "displayName": "Test User",
        "login": "test-user@test.net",
        "objectType": "User"
      },
      {
        "id": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36",
        "displayName": "CHROME",
        "ipAddress": "127.0.0.1",
        "objectType": "Client"
      }
    ],
    "targets": []
  }
~~~

##### Example Error Response for System Log API (Beta)

~~~json
{
        "actor": {
            "alternateId": "test.user@test.com",
            "detailEntry": null,
            "displayName": "Test User",
            "id": "00u1qqxig80SMWArY0g7",
            "type": "User"
        },
        "authenticationContext": {
            "authenticationProvider": null,
            "authenticationStep": 0,
            "credentialProvider": null,
            "credentialType": null,
            "externalSessionId": "trs2TSSLkgWR5iDuebwuH9Vsw",
            "interface": null,
            "issuer": null
        },
        "client": {
            "device": "Unknown",
            "geographicalContext": null,
            "id": null,
            "ipAddress": "4.15.16.10",
            "userAgent": {
                "browser": "UNKNOWN",
                "os": "Unknown",
                "rawUserAgent": "Apache-HttpClient/4.5.2 (Java/1.7.0_76)"
            },
            "zone": "null"
        },
        "debugContext": {
            "debugData": {
                "requestUri": "/api/v1/users"
            }
        },
        "displayMessage": "Too many requests in flight",
        "eventType": "core.concurrency.org.limit.violation",
        "legacyEventType": "core.concurrency.org.limit.violation",
        "outcome": null,
        "published": "2017-09-26T20:21:32.783Z",
        "request": {
            "ipChain": [
                {
                    "geographicalContext": null,
                    "ip": "4.15.16.10",
                    "source": null,
                    "version": "V4"
                },
                {
                    "geographicalContext": null,
                    "ip": "52.22.142.162",
                    "source": null,
                    "version": "V4"
                }
            ]
        },
        "securityContext": {
            "asNumber": null,
            "asOrg": null,
            "domain": null,
            "isProxy": null,
            "isp": null
        },
        "severity": "INFO",
        "target": null,
        "transaction": {
            "detail": {},
            "id": "Wcq2zDtj7xjvEu-gRMigPwAACYM",
            "type": "WEB"
        },
        "uuid": "dc7e2385-74ba-4b77-827f-fb84b37a4b3b",
        "version": "0"
    }
~~~

##### Example Rate Limit Header with Concurrent Rate Limit Error

This example shows the relevant portion of a rate limit header being returned with the error for a request that exceeded the concurrent rate limit.
~~~http

HTTP/1.1 429
Date: Tue, 26 Sep 2017 21:33:25 GMT
X-Rate-Limit-Limit: 0
X-Rate-Limit-Remaining: 0
X-Rate-Limit-Reset: 1506461721

~~~

Notice that instead of the typical counts for time-based rate limits, when a request exceeds the limit for concurrent requests,
`X-Rate-Limit-Limit`, `X-Rate-Limit-Remaining`, and `X-Rate-Limit-Reset` report the concurrent values instead.
When the number of unfinished requests is below the concurrent rate limit, request headers will switch back to reporting the time-based rate limits.

The `X-Rate-Limit-Reset` time for concurrent rate limits is only a suggestion. There's no guarantee that enough requests will complete to stop exceeding the concurrent rate limit at the time indicated.

For more information, see developer documentation about [rate limit headers](/docs/api/getting_started/rate-limits). <!-- OKTA-140976, OKTA-142995 -->

#### OpenID Connect Scope Change

We've changed the behavior of OpenID Connect scopes:

* OpenID Connect scopes are returned from requests to `/api/v1/authorizationServers/${authServerId}/scopes`.
* You can edit scope descriptions in the Okta user interface or via the API. <!--OKTA-136527 -->

#### Help Desk Administrator Role Generally Available

The Help Desk Administrator Role (`HELP_DESK_ADMIN`) is generally available via the [Roles API](/docs/api/resources/roles#role-properties).
For information about this role, see the [in-app help](https://help.okta.com/en/prod/Content/Topics/Security/The_Help_Desk_Admin_Role.htm). <!-- OKTA-141867 -->

#### Policy API

The Policy API enables an Administrator to perform policy and policy rule operations. The policy framework is used by Okta to control rules and settings that govern, among other things, user session lifetime, whether multi-factor authentication is required when logging in, what MFA factors may be employed, password complexity requirements, and what types of self-service operations are permitted under various circumstances. For more information, see Okta's [API Reference](/docs/api/resources/policy).

#### Password Policy API

The Password Policy type controls settings that determine a user's password length and complexity, as well as the frequency with which a password can be changed. This policy also governs the recovery operations that may be performed by the user, including change password, reset (forgot) password and self-service password unlock. For more information, see Okta's [API Reference](/docs/api/resources/policy#GroupPasswordPolicy).

## 2017.38

The following API feature enhancements and bug fixes are available in the 2017.38 release.
Dates for preview and production release are the earliest possible release date. Always check your org to verify the release version.

### API Feature Enhancements

| Feature Enhancement                                                           | Expected in Preview Orgs            | Expected in Production Orgs |
|:------------------------------------------------------------------------------|:------------------------------------|:----------------------------|
|         Key Rotation for OpenID and OAuth Apps | September 20, 2017                     | September 25, 2017           |
|         Policy API | September 7, 2017                     | October 9, 2017           |
|         Password Policy API | September 7, 2017                     | October 9, 2017           |

#### Policy API

The Policy API enables an Administrator to perform policy and policy rule operations. The policy framework is used by Okta to control rules and settings that govern, among other things, user session lifetime, whether multi-factor authentication is required when logging in, what MFA factors may be employed, password complexity requirements, and what types of self-service operations are permitted under various circumstances. For more information, see Okta's [API Reference](/docs/api/resources/policy).

#### Password Policy API

The Password Policy type controls settings that determine a user's password length and complexity, as well as the frequency with which a password can be changed. This policy also governs the recovery operations that may be performed by the user, including change password, reset (forgot) password and self-service password unlock. For more information, see Okta's [API Reference](/docs/api/resources/policy#GroupPasswordPolicy),

#### Key Rotation for OpenID Connect and OAuth Apps

You can now specify the key rotation mode for OpenID Connect and OAuth apps in the Apps API with `autoKeyRollover`. More information can be found in the [API Reference](/docs/api/resources/apps#oauth-credential-object).

### API Bug Fixes

Bug fixes are expected on preview orgs starting September 20, 2017, and on production orgs starting September 25, 2017.

* Using a refresh token for a client application with a client ID longer than 20 characters caused an error. (OKTA-139722)

## 2017.36

The [Policy API](/docs/api/resources/policy) and [Password Policy API](/docs/api/resources/policy#GroupPasswordPolicy) are Generally Available in preview orgs starting on September 7, 2017 and in production orgs starting on October 9, 2017.

The Policy API enables an Administrator to perform policy and policy rule operations. The policy framework is used by Okta to control rules and settings that govern, among other things, user session lifetime, whether multi-factor authentication is required when logging in, what MFA factors may be employed, password complexity requirements, and what types of self-service operations are permitted under various circumstances.

The Password Policy type controls settings that determine a user's password length and complexity, as well as the frequency with which a password can be changed. This policy also governs the recovery operations that may be performed by the user, including change password, reset (forgot) password and self-service password unlock.

## 2017.34

The following platform feature enhancements and bug fixes are available in the 2017.35 release.
Dates for preview and production release are the earliest possible release date. Always check your org to verify the release version.

### API Feature Enhancements

| Feature Enhancement                                                           | Expected in Preview Orgs            | Expected in Production Orgs |
|:------------------------------------------------------------------------------|:------------------------------------|:----------------------------|
|        [Zones API is an Early Access Release](#zones-api-is-an-early-access-release) | August 22, 2017                     | September 5, 2017           |

#### Zones API is an Early Access Release
<!-- OKTA-129115 -->

Zones are used to group IP Address ranges so that policy decisions can be made based on the client's IP location.

[The Zones API](/docs/api/resources/zones) is an {% api_lifecycle ea %} release. {{site.contact_support_uc}} to enable it.
This API can be enabled beginning August 22, 2017 for preview orgs, and beginning September 5, 2017 for production orgs.

### API Bug Fix

This bug fix is expected on preview orgs starting August 31, 2017, and on production orgs starting Sept 5, 2017.

* Some requests to update a user via [`/api/v1/users/${userId}`](/docs/api/resources/users#update-user) failed with a 500 Internal Server Error. (OKTA-138214)

## 2017.34

The following API feature enhancements and bug fixes are available in the 2017.34 release.
Dates for preview and production release are the earliest possible release date. Always check your org to verify the release version.

### API Feature Enhancements

| Feature Enhancement                                                           | Expected in Preview Orgs            | Expected in Production Orgs |
|:------------------------------------------------------------------------------|:------------------------------------|:----------------------------|
|         [New Developer Dashboard](#new-developer-dashboard)                           | Available now in new developer orgs | N/A                         |
|        [Zones API is an Early Access Release](#zones-api-is-an-early-access-release) | August 22, 2017                     | September 5, 2017           |

#### New Developer Dashboard

The new developer dashboard is available in all new developer orgs in preview:

{% img release_notes/dev-dashboard.png alt:"New Developer Dashboard" %}

Use the developer dashboard to access quick-start guides for your favorite language and view recent system log events.
You can also create an OpenID Connect app more easily with this simplified flow:

{% img release_notes/new-oidc-app-dashboard.png alt:"New Developer Dashboard" %}

#### Zones API is an Early Access Release
<!-- OKTA-129115 -->

Zones are used to group IP Address ranges so that policy decisions can be made based on the client's IP location.

[The Zones API](/docs/api/resources/zones) is an {% api_lifecycle ea %} release. {{site.contact_support_uc}} to enable it.
This API can be enabled beginning August 22, 2017 for preview orgs, and beginning September 5, 2017 for production orgs.

### API Bug Fixes

Bug fixes are expected on preview orgs starting August 22, 2017, and on production orgs starting Sept 5, 2017.

* OpenID Connect and OAuth 2.0 client apps with an `application_type` of `native` or `browser` incorrectly allowed the `client_credentials` grant type. This fix adheres to the [OAuth 2.0 spec](https://tools.ietf.org/html/rfc6749#section-1.3.4). (OKTA-135853)
* Requests to `GET /api/v1/apps/${applicationId}/groups?expand=group%2Cmetadata` caused an error in orgs with the Application Entitlements Policy enabled. (OKTA-135969)
* The `AssertionConsumerServiceURL` attribute in a SAML authentication requests matched one of the configured SSO URLs but an error was returned. (OKTA-137555)

## 2017.32

### Platform Feature Enhancements

| Feature Enhancement                                                                                                 | Expected in Preview Orgs | Expected in Production Orgs             |
|:--------------------------------------------------------------------------------------------------------------------|:-------------------------|:----------------------------------------|
| [Default Custom Authorization Server](#default-custom-authorization-server)                                         | August 9, 2017           | August 14, 2017                         |
| [Web App Supports Client Credential Grant Type](#web-app-supports-client-credential-grant-type)                     | August 9, 2017           | August 14, 2017                         |
| [OpenID Connect Group Claim Retrieves Application Groups](#openid-connect-group-claim-retrieves-application-groups) | August 9, 2017           | August 14, 2017                         |
| [SHA-256 Signed Certificates for New SAML 2.0 Apps](#sha-256-signed-certificates-for-new-saml-20-apps)              | Generally Available now  | Generally Available beginning 9/11/2017 |

#### Default Custom Authorization Server
<!-- OKTA-133786 -->

Okta provides a pre-configured Custom Authorization Server named `default`.
This default authorization server includes a basic access policy and rule, which you can edit to control access.
It allows you to specify `default` instead of the `authServerId` in requests to it:

* `https://{yourOktaDomain}/api/v1/authorizationServers/default` vs
* `https://{yourOktaDomain}/api/v1/authorizationServers/${authServerId}` for other Custom Authorization Servers

#### Web App Supports Client Credential Grant Type
<!-- OKTA-102062 -->

OAuth 2.0 clients now support [configuration of the `web` application type to use a `client_credential` grant type](/docs/api/resources/oauth-clients#client-application-properties).
This allows you to use one `client_id` for an application that needs to make user-specific calls and back-end calls for data.

#### OpenID Connect Group Claim Retrieves Application Groups
<!-- OKTA_132193 -->

OpenID Connect, which uses the Okta Authorization Server, can retrieve [application groups](/docs/api/resources/apps#application-group-model) for use in tokens.
Previously, application groups could only be retrieved with the Custom Authorization Server.

You can use the Okta Expression Language [`getFilteredGroups` function](/reference/okta_expression_language/#group-functions) to retrieve application groups.

#### SHA-256 Signed Certificates for New SAML 2.0 Apps

All new SAML 2.0 apps are bootstrapped with SHA-256 signed public certificates. Existing SAML 2.0 apps are unchanged.

### Platform Bug Fixes

Bug fixes are expected on preview orgs starting August 9, 2017, and on production orgs starting August 14, 2017.

* The **Add policy** button wasn't disabled for Org Admins, who don't have permission to create authorization server policies. (OKTA-127450)
* Some requests to `/oauth2/v1/authorize` with the `state` parameter incorrectly returned an error. (OKTA-130916)
* When an ID token was minted for a custom authorization server, an app sign-on event wasn't generated. (OKTA-134554)

## 2017.31

### Platform Feature Enhancements

| Feature Enhancement                                                               | Expected in Preview Orgs        | Expected in Production Orgs             |
|:----------------------------------------------------------------------------------|:--------------------------------|:----------------------------------------|
| [OpenID Connect](#openid-connect)                                                 | Generally Available now         | Generally Available beginning 8/7/2017  |
| [Key Rollover](#key-rollover)                                                     | Generally Available now         | Generally Available beginning 8/7/2017  |
| [Email for Two-Factor Authentication](#email-for-two-factor-authentication)       | Early Access by 8/3/2017        | Early Access beginning 8/7/2017         |
| [SHA-256 Signed Certificates for New SAML 2.0 Apps](#sha-256-signed-certificates-for-new-saml-20-apps) | Generally Available by 8/3/2017 | Generally Available beginning 9/11/2017 |

To enable an Early Availability (EA) feature, {{site.contact_support_lc}}. For more information, see [Okta Release Lifecycle](/docs/api/getting_started/releases-at-okta).

> A [new version of the Sign-In Widget](#new-version-of-the-sign-in-widget) is available now for all orgs.

#### OpenID Connect
<!-- OKTA-132049  -->

[OpenID Connect](/docs/api/resources/oidc) is a simple identity layer on top of the OAuth 2.0 protocol, which allows computing clients to verify the identity of an end user based on the authentication performed by an authorization server, as well as to obtain basic profile information about the end user in an interoperable and REST-like manner. In technical terms, OpenID Connect specifies a RESTful HTTP API, using JSON as a data format.

OpenID Connect allows a range of clients, including Web-based, mobile, and JavaScript clients, to request and receive information about authenticated sessions and end users. The specification suite is extensible, supporting optional features such as encryption of identity data, discovery of OpenID Providers, and session management.

Okta is [certified for OpenID Connect](http://openid.net/certification/). For more information, see [OpenID Connect and Okta](/docs/api/resources/oidc).

#### Key Rollover
<!-- OKTA-132045  -->

We provide the ability to generate a certificate with a specified validity period for the [Apps API](/docs/api/resources/apps) and [Identity Providers API](/docs/api/resources/idps).

#### SHA-256 Signed Certificates for New SAML 2.0 Apps

All new SAML 2.0 apps are bootstrapped with SHA-256 signed public certificates. Existing SAML 2.0 apps are unchanged.

#### Email for Two-Factor Authentication
<!-- OKTA-134593  -->

You can enroll a user with an email factor. See [Enroll Okta Email Factor](/docs/api/resources/factors#enroll-okta-email-factor) for details.

### New Version of the Sign-In Widget
<!-- (OKTA-132800) -->

Version 2.1.0 of the Okta Sign-In Widget is available on [GitHub](https://github.com/okta/okta-signin-widget/releases/tag/okta-signin-widget-2.1.0) or [NPM](https://www.npmjs.com/package/@okta/okta-signin-widget). Check out the new features and bug fixes!


## 2017.30

### Platform Features

These platform features are GA in preview orgs (as of Release 2017.28), and expected to roll out as GA to production orgs during the week of August 7, 2017:

* [OpenID Connect](#openid-connect)
* [Key Rollover](#key-rollover)

This platform feature enhancement is EA in preview orgs with this release and expected in production orgs the week of July 31, 2017. To enable an EA feature, {{site.contact_support_lc}}.

* [Email for Two-Factor Authentication](#email-for-two-factor-authentication)

For information about Early Access (EA) and General Availability (GA), see [Okta Release Lifecycle](/docs/api/getting_started/releases-at-okta).

#### OpenID Connect

[OpenID Connect](/docs/api/resources/oidc) is a simple identity layer on top of the OAuth 2.0 protocol, which allows computing clients to verify the identity of an end user based on the authentication performed by an authorization server, as well as to obtain basic profile information about the end user in an interoperable and REST-like manner. In technical terms, OpenID Connect specifies a RESTful HTTP API, using JSON as a data format.

 OpenID Connect allows a range of clients, including Web-based, mobile, and JavaScript clients, to request and receive information about authenticated sessions and end users. The specification suite is extensible, supporting optional features such as encryption of identity data, discovery of OpenID Providers, and session management.

 Okta is [certified for OpenID Connect](http://openid.net/certification/). For more information, see [OpenID Connect and Okta](/docs/api/resources/oidc).<!-- OKTA-132049  -->



#### Key Rollover

We provide the ability to generate a certificate with specified validity period (see the [Apps API](/docs/api/resources/apps) and [Identity Providers API](/docs/api/resources/idps)). We build OpenID Connect and API Access Management on this feature. <!-- OKTA-132045  -->

#### Email for Two-Factor Authentication  <!-- OKTA-134593  -->

You can enroll a user with an email factor. See [Enroll Okta Email Factor](/docs/api/resources/factors#enroll-okta-email-factor) for details.

### Platform Bugs Fixed

These platform bug fixes are in preview orgs with this release and expected in production orgs the week of July 31, 2017.

* Under some circumstances users who did not have a secondary email address could not perform a self-service password reset operation.   (OKTA-128340)

* "When the `expand` parameter was set in GET requests to [`/api/v1/groups`](/docs/api/resources/groups#list-groups), the second and subsequent pages of the response did not have the same `expand` setting.  (OKTA-132503)

* [`/oauth2/v1/clients`](/docs/api/resources/oauth-clients#register-new-client) returned HTTP status code 200 rather than 201 when creating a client successfully.  (OKTA-128839)

* [`/api/v1/authorizationServers`](/docs/api/resources/authorization-servers#create-authorization-server) returned HTTP status code 200 rather than 201 when creating an Authorization Server successfully.  (OKTA-128839)

* [`/oauth2/v1/clients/{clientId}`](/docs/api/resources/oauth-clients#get-oauth-client) returned HTTP status code 404 rather than 401 when it did not find the specified client.  (OKTA-130804, OKTA-130848)


## 2017.29

### Platform Features

The following platform features are Generally Available (GA) in preview orgs (as of Release 2017.28), and expected to roll out as GA to production orgs during the week of August 7, 2017:

* [OpenID Connect](#openid-connect)
* [Key Rollover](#key-rollover)

#### OpenID Connect

[OpenID Connect](/docs/api/resources/oidc) is a simple identity layer on top of the OAuth 2.0 protocol, which allows computing clients to verify the identity of an end user based on the authentication performed by an authorization server, as well as to obtain basic profile information about the end user in an interoperable and REST-like manner. In technical terms, OpenID Connect specifies a RESTful HTTP API, using JSON as a data format.

 OpenID Connect allows a range of clients, including Web-based, mobile, and JavaScript clients, to request and receive information about authenticated sessions and end users. The specification suite is extensible, supporting optional features such as encryption of identity data, discovery of OpenID Providers, and session management.

 Okta is [certified for OpenID Connect](http://openid.net/certification/). For more information, see [OpenID Connect and Okta](/docs/api/resources/oidc).<!-- OKTA-132049  -->

#### Key Rollover

We provide the ability to generate a certificate with specified validity period (see the [Apps API](/docs/api/resources/apps) and [Identity Providers API](/docs/api/resources/idps)). We build OpenID Connect and API Access Management on this feature.<!-- OKTA-132045  -->

### Platform Bugs Fixed

These platform bug fixes are available in preview orgs and expected in production orgs the week of July 24, 2017.

* When answering a security question to recover a forgotten password, users who gave too many incorrect responses didn't receive the "locked out" message. (OKTA-126117)

* Custom SMS templates allowed messages greater than 160 characters after substituting the org name and code. The new behavior is to use a default template instead of the custom template when that happens. To ensure use of your custom template, update it to stay within the 160-character limit. (OKTA-128721)

* [`/oauth2/v1/clients`](/docs/api/resources/oauth-clients#register-new-client) error responses didn't conform to the format in the [OAuth 2.0 Dynamic Client Registration spec](https://tools.ietf.org/html/rfc7591#section-3.2.2). (OKTA-130375)

* [`/oauth2/v1/clients`](/docs/api/resources/oauth-clients#register-new-client) didn't allow default values for optional parameters. (OKTA-130910)

* Neither [`/oauth2/v1/clients`](/docs/api/resources/oauth-clients#register-new-client) nor [`/api/v1/apps`](/docs/api/resources/apps#add-application) required client secrets to be unique. (OKTA-131259)

* [`/oauth2/v1/clients`](/docs/api/resources/oauth-clients#register-new-client) returned an incorrect resource URI in the response header.  (OKTA-131891)


## 2017.28

### Platform Enhancements and New Features

The following changes are available in preview orgs on Wednesday, July 12. Availability in production orgs is expected either one week or one month later. For information about Early Availability (EA) and Generally Available (GA), see [Okta Release Lifecycle](https://developer.okta.com/docs/api/getting_started/releases-at-okta).

The following features are GA in preview orgs, and expected to be GA in production orgs during the week of August 7, 2017:

* [OpenID Connect](#openid-connect)
* [Key Rollover](#key-rollover)

The following feature enhancements are GA in preview orgs, and expected to be GA in production orgs during the week of July 17, 2017:

* [Limit Age of Events](#limit-age-of-events)
* [Improved Plugin Security](#improved-plugin-security)

The following EA feature enhancements are in preview orgs and expected in production orgs during the week of July 17, 2017.
To enable an EA feature, {{site.contact_support_lc}}.

* [Allow Unsuspending Users During Inbound SAML Login](#allow-unsuspending-users-during-inbound-saml-login)
* [Email Factor](#email-factor)

The following feature enhancement is available on GitHub:

* [New Version of Sign-In Widget](#new-version-of-sign-in-widget)

#### OpenID Connect

[OpenID Connect](https://developer.okta.com/docs/api/resources/oidc) is a simple identity layer on top of the OAuth 2.0 protocol, which allows computing clients to verify the identity of an end user based on the authentication performed by an authorization server, as well as to obtain basic profile information about the end user in an interoperable and REST-like manner. In technical terms, OpenID Connect specifies a RESTful HTTP API, using JSON as a data format.

 OpenID Connect allows a range of clients, including Web-based, mobile, and JavaScript clients, to request and receive information about authenticated sessions and end users. The specification suite is extensible, supporting optional features such as encryption of identity data, discovery of OpenID Providers, and session management.

 Okta is [certified for OpenID Connect](http://openid.net/certification/). For more information, see [OpenID Connect and Okta](/docs/api/resources/oidc).<!-- OKTA-132049  -->


#### Key Rollover

We provide the ability to generate a certificate with specified validity period (see the [Apps API](https://developer.okta.com/docs/api/resources/apps) and [Identity Providers API](https://developer.okta.com/docs/api/resources/idps)). We build OpenID Connect and API Access Management on this feature.<!-- OKTA-132045  -->

#### Limit Age of Events

In keeping with the [Okta Data Retention Policy](https://support.okta.com/help/Documentation/Knowledge_Article/Okta-Data-Retention-Policy), the events API (`/api/v1/events`) no longer accepts queries for events greater than 180 days old.<!-- OKTA-125424, 120605  -->

#### Improved Plugin Security
Template Plugin Apps you create from the administrator UI (**Admin > Applications > Add Application > Template Plugin App**) have improved security.<!-- OKTA-132490  -->

#### New Version of Sign-In Widget

Version 1.13.0 of the [Okta Sign-In Widget](https://github.com/okta/okta-signin-widget/releases) is available. Check out the new features and bug fixes!<!-- (OKTA-131661) -->

#### Allow Unsuspending Users During Inbound SAML Login

You can configure the JIT settings for a SAML identity provider (IdP) to enable unsuspending users during inbound SAML login. See the [Identity Providers API](https://developer.okta.com/docs/api/resources/idps) for more information.<!-- OKTA-128384 -->

{% img release_notes/JIT_settings.png alt:"JIT settings for SAML IdP" %}

#### Email Factor

 You can send a one-time password (OTP) and an activation link to an email address as part of enrolling a user.<!-- OKTA-132297  -->

### Platform Bugs Fixed

These platform bug fixes are available in preview orgs and expected in production orgs the week of July 17, 2017.

* `/api/v1/apps/${applicationId}/groups` didn't return groups if the specified app is inactive. (OKTA-123695)
* Identity provider JIT reactivation of users sometimes failed when there were configured group assignments. (OKTA-131784)
* In some circumstances, the link between the external Microsoft user and the Okta user was inaccurate.  (OKTA-132207)


## 2017.27

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

### Platform Enhancements

* [Additional Scopes Available for Social Authentication](#additional-scopes-available-for-social-authentication)

* [New Versions of Sign-In Widget and Auth SDK for JS](#new-versions-of-sign-in-widget-and-auth-sdk-for-js)

#### Additional Scopes Available for Social Authentication

When using a Social Identity Provider, you can request information in stages. The initial request to `/oauth2/v1/authorize` can ask for a minimal set of scopes, and you can add scopes to collect additional user data in a subsequent request to the Social Identity Provider. This reduces friction during sign-in when users don't yet trust your app. For more information, see the descriptions of `idp_scope` in the [OAuth 2.0 API](https://developer.okta.com/docs/api/resources/oidc#request-parameters-1 ) and [OpenID Connect API](https://developer.okta.com/docs/api/resources/oidc#request-parameters-3) parameter tables.<!-- (OKTA-117521) -->

#### New Versions of Sign-In Widget and Auth SDK for JS

Version 1.11 of the [Okta Sign-In Widget](https://github.com/okta/okta-signin-widget/releases/tag/okta-signin-widget-1.11.0) and version 1.8 of the [Okta Auth SDK for Javascript](https://github.com/okta/okta-auth-js) are available. Check out the new features and bug fixes!<!-- (OKTA-131642) -->

### Platform Bugs Fixed

* If any sign-in policy using MFA existed for an application, the Open ID Connect reauthentication flow redirected to multi-factor authentication (MFA) by default.  (OKTA-129094)
* Clients with `token_endpoint_auth_method` set to `client_secret_post` did not have a selected radio button on the Client Credentials UI (**Applications > _application name_ > General**).  (OKTA-130764)
* If you created a SAML 2.0 Identity Provider but omitted some fields, Okta reported an error.  (OKTA-131294)
* Okta Sign-In Widget failed to run when installed with `npm`.  (OKTA-131608)
* Updates to clients sometimes received an error response if they contained values for `client_id_issued_at` or `client_secret_expires_at`.  (OKTA-131647)
* API Access Management customers can no longer self-validate the Okta Access Token.  (OKTA-131885)

## 2017.26

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

### Platform Enhancement: New Authentication Method for OpenID Connect and API Access Management
For OpenID Connect and API Access Management, Okta supports the `client_secret_jwt` method for token endpoint authentication (`token_endpoint_auth_method`).
This method is specified in the [OpenID Connect specification](http://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication)
and allows you to use JWT and HMAC to authenticate a client for [OAuth 2.0 and OpenID Connect](https://developer.okta.com/docs/api/resources/oidc#token-authentication-methods) requests.<!-- (OKTA-101074) -->

### Platform Bugs Fixed

* When suspicious activity was logged for OAuth 2.0 clients the invalid secret was not masked. (OKTA-129694)
* When validating the names of scopes for social identity providers, Okta didn't enforce the restrictions
specified in the [OAuth 2.0 spec](https://tools.ietf.org/html/rfc6749#section-3.3). (OKTA-117352)
* When the same user was created multiple times simultaneously and added to a group, the HTTP error
response code was 500 rather than 400. (OKTA-126223)
* `/api/v1/apps/${applicationId}/groups` didn't return groups if the specified app is inactive. (OKTA-123695)

## 2017.25

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

### Platform Enhancements

* [System Logs Track Key Rotation and Generation](#system-logs-track-key-rotation-and-generation)
* [Client Registration API Is an Early Access Feature](#client-registration-api-is-an-early-access-feature)
* [Create OAuth 2.0 and OpenID Connect Clients with the Apps API](#create-oauth-20-and-openid-connect-clients-with-apps-api)
* [OAuth 2.0 and OpenID Connect Client App Updates Available in System Log](#oauth-20-and-openid-connect-client-app-updates-available-in-system-log)
* [Support for RP-Initiated Logout](#support-for-rp-initiated-logout)
* [OAuth 2.0 and OpenID Connect .well-known Response Includes Registration Endpoint](#oauth-20-and-openid-connect-well-known-response-includes-registration-endpoint)


#### System Logs Track Key Rotation and Generation
Logged information about key rotation and generation for apps and identity providers is available by using GET requests to either of the following endpoints: `/api/v1/events` or `/api/v1/logs`.
For more information, see [Identity Provider Signing Key Store Operations](/docs/api/resources/idps#identity-provider-signing-key-store-operations)
or [Update Key Credential for Application](/docs/api/resources/apps#update-key-credential-for-application).

Here is a response from `/api/v1/logs`
{% img release_notes/KeyRotateLog.png alt:"Logged Key Rotation Event" %}
<!-- (OKTA-76607) -->

#### Client Registration API Is an Early Access Feature
The [Auth Clients API](/docs/api/resources/oauth-clients) provides operations to register and manage client applications for use with Okta's
OAuth 2.0 and OpenID Connect endpoints.

#### Create OAuth 2.0 and OpenID Connect Clients with Apps API
The [Apps API](https://developer.okta.com/docs/api/resources/apps) supports creating and configuring
OAuth 2.0 or OpenID Connect clients. Alternatively, you can use
[Client Registration API](https://developer.okta.com/docs/api/resources/oauth-clients) (RFC 7591 and RFC 7592)
to create and manage clients.
<!-- (OKTA-78223) -->

#### OAuth 2.0 and OpenID Connect Client App Updates Available in System Log
Logged information about OAuth 2.0 client updates is now available by using GET requests to
either log endpoint: `/api/v1/events` or `/api/v1/logs`.

{% img release_notes/DeactClientLog.png alt:"Logged Key Rotation Event" %}
<!-- (OKTA-86738, OKTA-127445) -->

#### Support for RP-Initiated Logout
Okta supports [RP-intiated logout](http://openid.net/specs/openid-connect-session-1_0.html#RPLogout)
from OpenID Connect client apps in both the administrator UI and Okta API. You can specify a logout redirect URI,
or accept the default behavior of returning to the Okta Login page. You can access this feature on the
Create OpenID Connect Integration page (under Applications) in the UI.
<!-- (OKTA-94106) -->

#### OAuth 2.0 and OpenID Connect .well-known Response Includes Registration Endpoint
Okta returns the `registration_endpoint` in OAuth 2.0 and OpenID Connect `.well-known` responses.
<!-- (OKTA-127457) -->

### Platform Bugs Fixed

* [Invalid Availability of credentials.signing.kid](#invalid-availability-of-credentialssigningkid)
* [WWW-Authenticate Header in HTTP 401 Response](#www-authenticate-header-in-http-401-response)

#### Invalid Availability of credentials.signing.kid
The `credentials.signing.kid` property of an app was available even if its sign-on mode does not support
certificates. Only apps using the following sign-on mode types support certificates: SAML 2.0, SAML 1.1,
WS-Fed, or OpenID Connect. For more information,
see: [Application Key Store Operations](https://developer.okta.com/docs/api/resources/apps#application-key-store-operations) (OKTA-76439)

#### WWW-Authenticate Header in HTTP 401 Response
When a call to the token, introspect, or revocation endpoint of OpenID Connect or API Access Management
encountered an invalid_client error, the response did not include the WWW­Authenticate header. (OKTA-127653)

## 2017.24

### Advance Notices

* [Key Rollover Change](#key-rollover-change)
* [Data Retention Policy Changes](#data-retention-changes)

#### Key Rollover Change

Beginning in Release 2017.25, the `credentials.signing.kid` property of an app won't be available if the app doesn't support the key rollover feature.
An app supports key rollover if the app uses one of the following signing mode types: SAML 2.0, SAML 1.1, WS-Fed, or OpenID Connect.

Before this change takes effect, verify that your integration doesn't expect the `credentials.signing.kid` property
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

### Platform Enhancements

* [Default Scopes for OAuth 2.0](#default-scopes-for-oauth-20)
* [Improved UI for Creating OpenID Connect Apps](#improved-ui-for-creating-openid-connect-apps)
* [Event Notifications for OpenID Connect Apps](#event-notifications-for-openid-connect-apps)
* [Query String Support in IdP Redirect URLs](#query-string-support-in-idp-redirect-urls)
* [API Rate Limit Improvements](#api-rate-limit-improvements)


#### Default Scopes for OAuth 2.0

Using either the administrator UI or API, you can configure default scopes for an OAuth 2.0 client.
If the client omits the scope parameter in an authorization request,
Okta returns all default scopes in the Access Token that are permitted by the access policy rule.

{% img release_notes/default-scope.png alt:"Default Scope Configuration UI" %}

For more information about setting default scopes in the API, see [OAuth 2.0 API](/docs/api/resources/authorization-servers#scope-properties).
<!-- OKTA-122185 OKTA-122072 -->

#### Improved UI for Creating OpenID Connect Apps

The wizard for creating an OpenID Connect app has been improved and consolidated onto a single screen.

{% img release_notes/single-oidc-screen.png alt:"New OpenID Connect Create Wizard" %}

<!-- OKTA-129127 -->

#### Event Notifications for OpenID Connect Apps

Notifications are entered in the System Log via the Events API (`/api/v1/events`) when OpenID Connect apps are created, modified, deactivated, or deleted.
Previously these notifications appeared only in the System Log (`/api/v1/logs`).

#### Query String Support in IdP Redirect URLs

Query strings are now supported in the definition of IdP Login URLs:

* The **IDP Login URL** field in the Add/Edit Endpoint wizard.
* The **IdP Single Sign-On URL** field for Inbound SAML. Reserved SAML parameters (SAMLRequest, RelayState, SigAlg, Signature) in a query string are ignored.<!-- OKTA-127771 -->

#### API Rate Limit Improvements

We are making org-wide rate limits more granular, and treating authenticated end-user interactions separately. More granular rate limits lessen the likelihood of calls to one URI impacting another. Treating authenticated end-user interactions separately lessens the chances of one user's request impacting another. We're also providing a transition period so you can see what these changes look like in your Okta system log before enforcing them:

##### Preview Orgs

We enforce new rate limits for all preview orgs. API calls exceeding the new rate limits return an HTTP 429 error.

##### Production Orgs

1. As of May 8, we enabled a System Log alert which lets you know if you have exceeded any of the new API rate limits:

    ```
    Warning: requests for url pattern <url-pattern> have reached
    a threshold of <number> requests per <time-duration>. Please
    be warned these rate limits will be enforced in the near future.
    ```

2. As of mid-May, we started enforcing these new rate limits for all newly created orgs. For these new orgs, instead of alerts in your System log, the API calls exceeding the new rate limits return an HTTP 429 error.

3. We are rolling out the enforcement of these new rate limits to all orgs this week. Once your org has the new limits, you'll see HTTP 429 errors instead of rate-limit warnings in the System Log if the new limits are exceeded.

For a full description of the new rate limits, see [API Rate Limits](/docs/api/getting_started/rate-limits).<!-- OKTA-110472 -->

### Platform Bug Fixed

* The dropdown that controls Authorization Server lifecycle operations failed to display properly if you navigated directly to a tab or refreshed a tab other than Settings. (OKTA-129014)

## 2017.23

### Advance Notices

* [Data Retention Policy Changes](#data-retention-changes)
* [API Rate Limit Improvements](#api-rate-limit-improvements)
* [Simple HAL Links in Production Soon](#simple-hal-links-generally-available-in-preview-for-may-2017)

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

We are making org-wide rate limits more granular, and treating authenticated end-user interactions separately. More granular rate limits lessen the likelihood of calls to one URI impacting another. Treating authenticated end-user interactions separately lessens the chances of one user's request impacting another. We're also providing a transition period so you can see what these changes look like in your Okta system log before enforcing them:

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

For a full description of the new rate limits, see [API Rate Limits](/docs/api/getting_started/rate-limits).<!-- OKTA-110472 -->

### Platform Enhancements

* [Authorization Server API Enhancements](#authorization-server-api-enhancements)
* [Additional Logging for Invalid Use by OAuth 2.0 Client](#additional-logging-for-invalid-use-by-oauth-20-client)
* [Restrictions on Set Recovery and Set Password Operations](#restrictions-on-set-recovery-question-answer-and-set-password)
* [Step-up Authentication for SAML Apps in Early Access](#step-up-authentication-for-saml-apps-is-an-early-access-feature)
* [Simple HAL Links](#simple-hal-links-generally-available-in-preview-for-may-2017)

#### Authorization Server API Enhancements

You can now use the Authorization Server API to configure components of an Authorization Server.
With the following enhancements, the API Access Management Authorization Servers API is an {% api_lifecycle ea %} Release:

* Manage Authorization Server policies, policy rules, claims, and scopes with the API.
* Activate or deactivate Authorization Servers, or delete them.
* Scopes were actions previously, but are now conditions in a policy rule.
* Control which claims are returned in ID tokens with the `alwaysIncludeInToken` property. You can also configure this in the [administrator UI](https://help.okta.com/en/prev/Content/Topics/Security/API_Access.htm#create_claims).

For more information see the [Authorization Server API documentation](/docs/api/resources/authorization-servers#authorization-server-operations).
<!-- OKTA-127511, OKTA-123638 -->

#### Additional Logging for Invalid Use by OAuth 2.0 Client

If Okta detects five or more consecutive request attempts with the wrong client secret, we log the events as suspicious:

* The requests may be to any OAuth 2.0 endpoint that accepts client credentials.
* The counter resets after 14 days of no invalid authentication attempts, or after a successful authentication.

We log an event when an invalid `client_id` is provided, and when an invalid `client_secret` is provided for a given `client_id`.<!-- OKTA-122503 -->

#### Restrictions on Set Recovery Question Answer and Set Password

The API operations Set Recovery Question Answer and Set Password must be requested with an API token, not a session token.
Additionally, the Set Recovery Question Answer operation doesn't validate complexity policies or credential policies. <!-- OKTA-126826, OKTA-126824 -->

#### Step-up Authentication for SAML Apps is an Early Access Feature

Every step-up transaction starts with a user accessing an application. If step-up authentication is required, Okta redirects the user to the custom login page with state token as a request parameter.
For more information, see the [SP initiated Step-up Authentication documentation](/docs/api/resources/authn#sp-initiated-step-up-authentication).

#### Simple HAL Links Generally Available in Preview for May, 2017

Okta has enabled the Simple HAL Links on User Collections feature for most preview organizations.
This feature removes the HAL links that reflect state from user objects returned in collections.

>Important: Okta expects to deliver this feature to production orgs (with the same Okta .NET SDK caveats described below) starting June 12, 2017.

Before release 2017.19, a user object returned in a collection contains some or all of the following links:

```
"_links": {
    "suspend": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/suspend",
      "method": "POST"
    },
    "resetPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/reset_password",
      "method": "POST"
    },
    "expirePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/expire_password",
      "method": "POST"
    },
    "forgotPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/forgot_password",
      "method": "POST"
    },
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3"
    },
    "changeRecoveryQuestion": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/change_recovery_question",
      "method": "POST"
    },
    "deactivate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/deactivate",
      "method": "POST"
    },
    "changePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/change_password",
      "method": "POST"
    }
}
```

Unfortunately, these links are not guaranteed to accurately reflect the state of the specified user.
As outlined in [Design Principles](/docs/api/getting_started/design_principles#links-in-collections):

"Search and list operations are intended to find matching resources and their identifiers. If you intend to search for a resource and then modify its state or make a lifecycle change, the correct pattern is to first retrieve the resource by ID using the `self` link provided for that resource in the collection. This will provide the full set of lifecycle links for that resource based on its most up-to-date state."

The Simple HAL Links on User Collections feature ensures that possibly invalid state links are not returned.  Instead only the `self` link is returned:

```
"_links": {
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3"
    }
}
```

As noted above, to change user state, the `self` link should be called to retrieve a user object with up-to-date links.

>Important: Not all preview organizations will receive this feature. Okta has identified preview organizations that depend on the Okta .NET SDK, which requires the old functionality. Okta won't enable the feature for these orgs. Instead, when the SDK issue is resolved, Okta will send a customer communication explaining the migration path to enable the feature for those orgs.

### Platform Bugs Fixed

* When completing enrollment for SMS and call factors, the API forced end users to verify the factor that was just enrolled. (OKTA-125923)
* When using a refresh token, default scope requests sometimes failed. (OKTA-127671)

## 2017.22

### Advance Notice: API Rate Limit Improvements

We are making org-wide rate limits more granular, and treating authenticated end-user interactions separately. More granular rate limits lessen the likelihood of calls to one URI impacting another. Treating authenticated end-user interactions separately lessens the chances of one user's request impacting another. We're also providing a transition period so you can see what these changes look like in your Okta system log before enforcing them:

#### Preview Orgs

1. We enforce new rate limits for new preview orgs. For these new orgs, the API calls exceeding the new rate limits return an HTTP 429 error.

2. At the end of May, we'll enforce these new rate limits for all preview orgs. Instead of alerts in your System Log, the API calls exceeding the new rate limits will return an HTTP 429 error.

#### Production Orgs

1. As of May 8, we have enabled a System Log alert which lets you know if you have exceeded any of the new API rate limits:

    ```
    Warning: requests for url pattern <url-pattern> have reached
    a threshold of <number> requests per <time-duration>. Please
    be warned these rate limits will be enforced in the near future.
    ```

2. As of mid-May, we started enforcing these new rate limits for all newly created orgs. For these new orgs, instead of alerts in your System log, the API calls exceeding the new rate limits return an HTTP 429 error.

3. In early June, we'll enforce these new rate limits for all orgs, and instead of alerts in your System Log, the API calls exceeding the new rate limits will return an HTTP 429 error.

For a full description of the new rate limits, see [API Rate Limits](/docs/api/getting_started/rate-limits).<!-- OKTA-110472 -->

### Platform Bugs Fixed

* OpenID Connect and OAuth 2.0 requests failed to respect default SAML IdP configuration. (OKTA-127155)
* Using the resource owner password credentials flow for an Active Directory user sometimes resulted in a malformed response instead of an Access Token. (OKTA-121082)

### Simple HAL Links Generally Available in Preview for May, 2017

Okta has enabled the Simple HAL Links on User Collections feature for most preview organizations.
This feature removes the HAL links that reflect state from user objects returned in collections.

Before release 2017.19, a user object returned in a collection contains some or all of the following links:

```
"_links": {
    "suspend": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/suspend",
      "method": "POST"
    },
    "resetPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/reset_password",
      "method": "POST"
    },
    "expirePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/expire_password",
      "method": "POST"
    },
    "forgotPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/forgot_password",
      "method": "POST"
    },
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3"
    },
    "changeRecoveryQuestion": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/change_recovery_question",
      "method": "POST"
    },
    "deactivate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/deactivate",
      "method": "POST"
    },
    "changePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/change_password",
      "method": "POST"
    }
}
```

Unfortunately, these links are not guaranteed to accurately reflect the state of the specified user.
As outlined in [Design Principles](/docs/api/getting_started/design_principles#links-in-collections):

"Search and list operations are intended to find matching resources and their identifiers. If you intend to search for a resource and then modify its state or make a lifecycle change, the correct pattern is to first retrieve the resource by ID using the `self` link provided for that resource in the collection. This will provide the full set of lifecycle links for that resource based on its most up-to-date state."

The Simple HAL Links on User Collections feature ensures that possibly invalid state links are not returned.  Instead only the `self` link is returned:

```
"_links": {
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3"
    }
}
```

As noted above, to change user state, the `self` link should be called to retrieve a user object with up-to-date links.

>Important: Not all preview organizations will receive this feature. Okta has identified preview organizations that depend on the Okta .NET SDK, which requires the old functionality. Okta won't enable the feature for these orgs. Instead, when the SDK issue is resolved, Okta will send a customer communication explaining the migration path to enable the feature for those orgs.
Okta expects to deliver this feature in production orgs (with the same Okta .NET SDK caveats) starting June 12, 2017.

## 2017.21

### Advance Notice: API Rate Limit Improvements

We are making org-wide rate limits more granular, and treating authenticated end-user interactions separately. More granular rate limits lessen the likelihood of calls to one URI impacting another. Treating authenticated end-user interactions separately lessens the chances of one user's request impacting another. We're also providing a transition period so you can see what these changes look like in your Okta system log before enforcing them:

#### Preview Orgs

1. We enforce new rate limits for new preview orgs. For these new orgs, the API calls exceeding the new rate limits return an HTTP 429 error.

2. In mid-May, we'll enforce these new rate limits for all preview orgs. Instead of alerts in your System Log, the API calls exceeding the new rate limits will return an HTTP 429 error.

#### Production Orgs

1. As of May 8, we have enabled a System Log alert which lets you know if you have exceeded any of the new API rate limits:

    `Warning: requests for url pattern <url-pattern> have reached
    a threshold of <number> requests per <time-duration>. Please
    be warned these rate limits will be enforced in the near future.`

2. In mid-May, we'll enforce these new rate limits for all newly created orgs. For these new orgs, instead of alerts in your System log, the API calls exceeding the new rate limits return an HTTP 429 error.

3. In early June, we'll enforce these new rate limits for all orgs, and instead of alerts in your System Log, the API calls exceeding the new rate limits will return an HTTP 429 error.

For a full description of the new rate limits, see [API Rate Limits](/docs/api/getting_started/rate-limits).<!-- OKTA-110472 -->

### Platform Feature Improvement: System Log Notifications for OpenID Connect Apps

Notifications are entered in the [System Log](/docs/api/resources/system_log) when OpenID Connect apps are created or updated.

### Platform Bugs Fixed

* SAML Apps containing more than one SAML attribute caused pagination issues on `/api/v1/apps`. (OKTA-123220, OKTA-122423, OKTA-115762)
* Native clients that are OpenID Connect apps require the `authorization_code` grant type. This requirement was not enforced correctly. (OKTA-123471)
* Requests to configure inbound SAML IdPs (`/api/v1/idps`) that included duplicated group IDs failed. (OKTA-124853)

#### Simple HAL Links Generally Available in Preview for May, 2017

Okta has enabled the Simple HAL Links on User Collections feature for most preview organizations.
This feature removes the HAL links that reflect state from user objects returned in collections.

Before release 2017.19, a user object returned in a collection contains some or all of the following links:

```
"_links": {
    "suspend": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/suspend",
      "method": "POST"
    },
    "resetPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/reset_password",
      "method": "POST"
    },
    "expirePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/expire_password",
      "method": "POST"
    },
    "forgotPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/forgot_password",
      "method": "POST"
    },
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3"
    },
    "changeRecoveryQuestion": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/change_recovery_question",
      "method": "POST"
    },
    "deactivate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/deactivate",
      "method": "POST"
    },
    "changePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/change_password",
      "method": "POST"
    }
}
```

Unfortunately, these links are not guaranteed to accurately reflect the state of the specified user.
As outlined in [Design Principles](/docs/api/getting_started/design_principles#links-in-collections):

"Search and list operations are intended to find matching resources and their identifiers. If you intend to search for a resource and then modify its state or make a lifecycle change, the correct pattern is to first retrieve the resource by ID using the `self` link provided for that resource in the collection. This will provide the full set of lifecycle links for that resource based on its most up-to-date state."

The Simple HAL Links on User Collections feature ensures that possibly invalid state links are not returned.  Instead only the `self` link is returned:

```
"_links": {
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3"
    }
}
```

As noted above, to change user state, the `self` link should be called to retrieve a user object with up-to-date links.

>Important: Not all preview organizations will receive this feature. Okta has identified preview organizations that depend on the Okta .NET SDK, which requires the old functionality. Okta won't enable the feature for these orgs. Instead, when the SDK issue is resolved, Okta will send a customer communication explaining the migration path to enable the feature for those orgs.

## 2017.20

### Advance Notice: API Rate Limit Improvements

We are making org-wide rate limits more granular, and treating authenticated end-user interactions separately. More granular rate limits lessen the likelihood of calls to one URI impacting another. Treating authenticated end-user interactions separately lessens the chances of one user's request impacting another. We're also providing a transition period so you can see what these changes look like in your Okta system log before enforcing them:

#### Preview Orgs

1. We enforce new rate limits for new preview orgs. For these new orgs, the API calls exceeding the new rate limits return an HTTP 429 error.

2. In mid-May, we'll enforce these new rate limits for all preview orgs. Instead of alerts in your System Log, the API calls exceeding the new rate limits will return an HTTP 429 error.

#### Production Orgs

1. As of May 8, we have enabled a System Log alert which lets you know if you have exceeded any of the new API rate limits:

    `Warning: requests for url pattern <url-pattern> have reached
    a threshold of <number> requests per <time-duration>. Please
    be warned these rate limits will be enforced in the near future.`

2. In mid-May, we'll enforce these new rate limits for all newly created orgs. For these new orgs, instead of alerts in your System log, the API calls exceeding the new rate limits return an HTTP 429 error.

3. In early June, we'll enforce these new rate limits for all orgs, and instead of alerts in your System Log, the API calls exceeding the new rate limits will return an HTTP 429 error.

For a full description of the new rate limits, see [API Rate Limits](/docs/api/getting_started/rate-limits).<!-- OKTA-110472 -->

### Platform Feature Improvements

#### Okta Expression Language Function for Filtering Groups

Use the Okta Expression Language function `getFilteredGroups` to create a list of groups that the current user belongs to.
With such a list you can, for example, create claims in Access Tokens and ID Tokens based on the groups.
For more information, see [Group Functions](/reference/okta_expression_language/#group-functions). <!--OKTA-123127-->

#### New Profile Property for Apps

The `profile` property in the Apps API accepts any well-formed JSON schema. You can specify properties in the profile and then access them in API requests.
For example:

* Add an app manager contact email address.
* Use the profile to define a whitelist of groups that you can then reference and pass as claims using the [Okta Expression Language function `getFilteredGroups`](/reference/okta_expression_language/#group-functions).

For more information, see the [Apps API](/docs/api/resources/apps#profile-object).

Note that the status code for service claims errors has changed from 500 to 400 as part of this feature. <!--OKTA-123128-->

#### Added Login Hint to OAuth 2.0 and OpenID Connect API

Use the `login_hint` property on `/oauth2/${authServerId}/v1/authorize` or `/oauth2/v1/authorize` to populate a username when prompting for authentication. <!-- OKTA-87073-->

### Platform Bugs Fixed

* Updating the OpenID Connect property `max_age` incorrectly caused a new session to be created, which updated the `createdAt` timestamp. (OKTA-99850)
* The property `application_type` in the [OAuth 2.0 Clients API](/docs/api/resources/oauth-clients) could be edited. (OKTA-120223)
* User profile attributes could be fetched via the API even though attributes were marked hidden, if the user sending the request was the user being fetched. (OKTA-123882)
* Reordering Authorization Server policies failed. (OKTA-125156)
* (Preview fix) Fixed issue involving OpenID Connect and OAuth 2.0 requests within SAML IdP configuration. (OKTA-127155)
* The Zones API documentation was incorrectly announced as Generally Available in 2017.19. It is [a Beta release](/docs/api/getting_started/releases-at-okta).

#### Simple HAL Links Generally Available in Preview for May, 2017

Okta has enabled the Simple HAL Links on User Collections feature for most preview organizations.
This feature removes the HAL links that reflect state from user objects returned in collections.

Before release 2017.19, a user object returned in a collection contains some or all of the following links:

```
"_links": {
    "suspend": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/suspend",
      "method": "POST"
    },
    "resetPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/reset_password",
      "method": "POST"
    },
    "expirePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/expire_password",
      "method": "POST"
    },
    "forgotPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/forgot_password",
      "method": "POST"
    },
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3"
    },
    "changeRecoveryQuestion": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/change_recovery_question",
      "method": "POST"
    },
    "deactivate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/deactivate",
      "method": "POST"
    },
    "changePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/change_password",
      "method": "POST"
    }
}
```

Unfortunately, these links are not guaranteed to accurately reflect the state of the specified user.
As outlined in [Design Principles](/docs/api/getting_started/design_principles#links-in-collections):

"Search and list operations are intended to find matching resources and their identifiers. If you intend to search for a resource and then modify its state or make a lifecycle change, the correct pattern is to first retrieve the resource by 'id' using the "self" link provided for that resource in the collection. This will provide the full set of lifecycle links for that resource based on its most up-to-date state."

The Simple HAL Links on User Collections feature ensures that possibly invalid state links are not returned.  Instead only the `self` link is returned:

```
"_links": {
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3"
    }
}
```

As noted above, to change user state, the `self` link should be called to retrieve a user object with up-to-date links.

>Important: Not all preview organizations will receive this feature. Okta has identified preview organizations that depend on the Okta .NET SDK, which requires the old functionality. Okta won't enable the feature for these orgs. Instead, when the SDK issue is resolved, Okta will send a customer communication explaining the migration path to enable the feature for those orgs.

## 2017.19

### Advance Notice: API Rate Limit Improvements

We are making org-wide rate limits more granular, and treating authenticated end-user interactions separately. More granular rate limits lessen the likelihood of calls to one URI impacting another. Treating authenticated end-user interactions separately lessens the chances of one user's request impacting another. We're also providing a transition period so you can see what these changes look like in your Okta system log before enforcing them:

#### Preview Orgs

1. We enforce new rate limits for new preview orgs. For these new orgs, the API calls exceeding the new rate limits return an HTTP 429 error.

2. In mid-May, we'll enforce these new rate limits for all preview orgs. Instead of alerts in your System Log, the API calls exceeding the new rate limits will return an HTTP 429 error.

#### Production Orgs

1. As of May 8, we have enabled a System Log alert which lets you know if you have exceeded any of the new API rate limits:

    `Warning: requests for url pattern <url-pattern> have reached
    a threshold of <number> requests per <time-duration>. Please
    be warned these rate limits will be enforced in the near future.`

2. In mid-May, we'll enforce these new rate limits for all newly created orgs. For these new orgs, instead of alerts in your System log, the API calls exceeding the new rate limits return an HTTP 429 error.

3. In early June, we'll enforce these new rate limits for all orgs, and instead of alerts in your System Log, the API calls exceeding the new rate limits will return an HTTP 429 error.

For a full description of the new rate limits, see [API Rate Limits](/docs/api/getting_started/rate-limits).<!-- OKTA-110472 -->

### Platform Feature Improvements

* [Zones API Generally Available in Preview](#zones-api-is-now-generally-available)
* [Simple HAL Links Generally Available in Preview](#simple-hal-links-generally-available-in-preview)

#### Zones API is Now Generally Available

The Zones API is now Generally Available in preview orgs. It will be at least one month before the Zones API is available in production.

Zones are used to group IP Address ranges so that policy decisions can be made based on the zone a client's IP belongs to.

For more information, see [the Zones API developer documentation](/docs/api/resources/zones).

> Update: Zones API is [a Beta release](/docs/api/getting_started/releases-at-okta). This release note is in error.

#### Simple HAL Links Generally Available in Preview

Okta has enabled the Simple HAL Links on User Collections feature for most preview organizations.
This feature will remain in preview for at least one month.

This feature removes the HAL links that reflect state from user objects returned in collections.

Before release 2017.19, a user object returned in a collection contains some or all of the following links:

```
"_links": {
    "suspend": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/suspend",
      "method": "POST"
    },
    "resetPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/reset_password",
      "method": "POST"
    },
    "expirePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/expire_password",
      "method": "POST"
    },
    "forgotPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/forgot_password",
      "method": "POST"
    },
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3"
    },
    "changeRecoveryQuestion": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/change_recovery_question",
      "method": "POST"
    },
    "deactivate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/deactivate",
      "method": "POST"
    },
    "changePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/change_password",
      "method": "POST"
    }
}
```

Unfortunately, these links are not guaranteed to accurately reflect the state of the specified user.
As outlined in [Design Principles](/docs/api/getting_started/design_principles#links-in-collections):

"Search and list operations are intended to find matching resources and their identifiers. If you intend to search for a resource and then modify its state or make a lifecycle change, the correct pattern is to first retrieve the resource by 'id' using the "self" link provided for that resource in the collection. This will provide the full set of lifecycle links for that resource based on its most up-to-date state."

The Simple HAL Links on User Collections feature ensures that possibly invalid state links are not returned.  Instead only the `self` link is returned:

```
"_links": {
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3"
    }
}
```

As noted above, to change user state, the `self` link should be called to retrieve a user object with up-to-date links.

>Important: Not all preview organizations will receive this feature. Okta has identified preview organizations that depend on the Okta .NET SDK, which requires the old functionality. Okta won't enable the feature for these orgs. Instead, when the SDK issue is resolved, Okta will send a customer communication explaining the migration path to enable the feature for those orgs.

### Platform Bugs Fixed

* Some queries on `/api/v1/apps` with incorrect filter parameters returned an empty `_embedded node` in the response instead of the correct error message. (OKTA-124544)
* Multifactor authentication with RSA failed for some orgs. (OKTA-125862)

## 2017.18

### Advance Notices

The items in this section are scheduled for future releases. Although we share our expected release dates, these dates are subject to change.

* [API Rate Limit Improvements](#api-rate-limit-improvements)
* [Simple HAL Links](#simple-hal-links)

#### API Rate Limit Improvements

We are making org-wide rate limits more granular, and treating authenticated end-user interactions separately. More granular rate limits lessen the likelihood of calls to one URI impacting another. Treating authenticated end-user interactions separately lessens the chances of one user's request impacting another. We're also providing a transition period so you can see what these changes look like in your Okta system log before enforcing them:

##### Preview Orgs

1. As of last week, we enabled a System Log alert which lets you know if you have exceeded any of the new API rate limits:

    `Warning: requests for url pattern <url-pattern> have reached
    a threshold of <number> requests per <time-duration>. Please
    be warned these rate limits will be enforced in the near future.`

2. As of May 2, 2017, we enforce these new rate limits for all new preview orgs. For these new orgs, instead of alerts in your System Log, the API calls exceeding the new rate-limits return an HTTP 429 error.

3. In mid-May, we'll enforce these new rate limits for all preview orgs. Instead of alerts in your System Log, the API calls exceeding the new rate-limits return an HTTP 429 error.

##### Production Orgs

1. In early May, we'll enable a System Log alert which lets you know if you have exceeded any of the new API rate limits:

    `Warning: requests for url pattern <url-pattern> have reached
    a threshold of <number> requests per <time-duration>. Please
    be warned these rate limits will be enforced in the near future.`

2. In mid-May, we'll enforce these new rate limits for all newly created orgs. For these new orgs, instead of alerts in your System log, the API calls exceeding the new rate-limits return an HTTP 429 error.

3. In early June, we'll enforce these new rate limits for all orgs, and instead of alerts in your System Log, the API calls exceeding the new rate-limits return an HTTP 429 error.

For a full description of the new rate limits, see [API Rate Limits](/docs/api/getting_started/rate-limits).<!-- OKTA-110472 -->

#### Simple HAL Links

Okta will enable the Simple HAL Links on User Collections feature for most preview organizations.
This change is currently scheduled for the 2017.19 release on 5/10/17, to remain in preview for at least one month.

This feature will remove the HAL links that reflect state from user objects returned in collections.

Currently, a user object returned in a collection contains some or all of the following links:

```
"_links": {
    "suspend": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/suspend",
      "method": "POST"
    },
    "resetPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/reset_password",
      "method": "POST"
    },
    "expirePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/expire_password",
      "method": "POST"
    },
    "forgotPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/forgot_password",
      "method": "POST"
    },
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3"
    },
    "changeRecoveryQuestion": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/change_recovery_question",
      "method": "POST"
    },
    "deactivate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/deactivate",
      "method": "POST"
    },
    "changePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/change_password",
      "method": "POST"
    }
}
```

Unfortunately, these links are not guaranteed to accurately reflect the state of the specified user.
As outlined in [Design Principles](/docs/api/getting_started/design_principles#links-in-collections):

"Search and list operations are intended to find matching resources and their identifiers. If you intend to search for a resource and then modify its state or make a lifecycle change, the correct pattern is to first retrieve the resource by 'id' using the "self" link provided for that resource in the collection. This will provide the full set of lifecycle links for that resource based on its most up-to-date state."

The Simple HAL Links on User Collections feature ensures that possibly invalid state links are not returned.  Instead only the `self` link is returned:

```
"_links": {
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3"
    }
}
```

As noted above, to change user state, the `self` link should be called to retrieve a user object with up-to-date links.

>Important: Not all preview organizations will receive this feature. Okta has identified preview organizations that depend on the Okta .NET SDK, which requires the old functionality. Okta won't enable the feature for these orgs. Instead, when the SDK issue is resolved, Okta will send a customer communication explaining the migration path to enable the feature for those orgs.

### Platform Feature Improvement: View Access Tokens from Social Authentication

Using `GET /api/v1/idps/${idpId}/users/${userId}/credentials/tokens`, you can fetch the Access Tokens minted by a social authentication provider.
When a user authenticates to Okta via a Social IdP, this request returns the tokens and metadata provided by the Social IdP.
Clients can use the Access Token against the social provider's endpoints in order to fetch additional profile attributes that Okta doesn't support in Universal Directory, for example, nested attributes.
For more information, see the [Identity Providers API](/docs/api/resources/idps#social-authentication-token-operation). <!-- OKTA-118687 -->

### Platform Bugs Fixed

 * Searches on [User](/docs/api/resources/users#list-users-with-search) incorrectly returned deleted users or out-of-date user status in some cases. (OKTA-116928)
 * Some orgs were unable to add OpenID Connect or OAuth 2.0 clients to an access policy in a custom Authorization Server. (OKTA-117630)
 * When deleting a claim from a custom Authorization Server, the Delete dialog didn't close after clicking **OK** or **Cancel**. (OKTA-124271)
 * Read-only Administrator UI didn't exactly match that role's access rights. (OKTA-123116)

## 2017.17

### Advance Notices

The items in this section are scheduled for future releases. Although we share our expected release dates, these dates are subject to change.

* [API Rate Limit Improvements](#api-rate-limit-improvements)
* [Simple HAL Links](#simple-hal-links)

#### API Rate Limit Improvements

We are making org-wide rate limits more granular, and treating authenticated end-user interactions separately. More granular rate limits lessen the likelihood of calls to one URI impacting another. Treating authenticated end-user interactions separately lessens the chances of one user's request impacting another. We're also providing a transition period so you can see what these changes look like in your Okta system log before enforcing them:

##### Preview Orgs

1. As of last week, we enabled a System Log alert which lets you know if you have exceeded any of the new API rate limits:

    `Warning: requests for url pattern <url-pattern> have reached
    a threshold of <number> requests per <time-duration>. Please
    be warned these rate limits will be enforced in the near future.`

2. In early May, we'll enforce these new rate limits for all new preview orgs. For these new orgs, instead of alerts in your System Log, the API calls exceeding the new rate-limits return an HTTP 429 error.

3. In mid-May, we'll enforce these new rate limits for all preview orgs. Instead of alerts in your System Log, the API calls exceeding the new rate-limits return an HTTP 429 error.

##### Production Orgs

1. In early May, we'll enable a System Log alert which lets you know if you have exceeded any of the new API rate limits:

    `Warning: requests for url pattern <url-pattern> have reached
    a threshold of <number> requests per <time-duration>. Please
    be warned these rate limits will be enforced in the near future.`

2. In mid-May, we'll enforce these new rate limits for all newly created orgs. For these new orgs, instead of alerts in your System log, the API calls exceeding the new rate-limits return an HTTP 429 error.

3. In early June, we'll enforce these new rate limits for all orgs, and instead of alerts in your System Log, the API calls exceeding the new rate-limits return an HTTP 429 error.

For a full description of the new rate limits, see [API Rate Limits]((/docs/api/getting_started/rate-limits).<!-- OKTA-110472 -->

#### Simple HAL Links

Okta will enable the Simple HAL Links on User Collections feature for most preview organizations.
This change is currently scheduled for the 2017.19 release on 5/10/17, to remain in preview for at least one month.

This feature will remove the HAL links that reflect state from user objects returned in collections.

Currently, a user object returned in a collection contains some or all of the following links:

```
"_links": {
    "suspend": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/suspend",
      "method": "POST"
    },
    "resetPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/reset_password",
      "method": "POST"
    },
    "expirePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/expire_password",
      "method": "POST"
    },
    "forgotPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/forgot_password",
      "method": "POST"
    },
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3"
    },
    "changeRecoveryQuestion": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/change_recovery_question",
      "method": "POST"
    },
    "deactivate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/deactivate",
      "method": "POST"
    },
    "changePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/change_password",
      "method": "POST"
    }
}
```

Unfortunately, these links are not guaranteed to accurately reflect the state of the specified user.
As outlined in [Design Principles](/docs/api/getting_started/design_principles#links-in-collections):

"Search and list operations are intended to find matching resources and their identifiers. If you intend to search for a resource and then modify its state or make a lifecycle change, the correct pattern is to first retrieve the resource by 'id' using the "self" link provided for that resource in the collection. This will provide the full set of lifecycle links for that resource based on its most up-to-date state."

The Simple HAL Links on User Collections feature ensures that possibly invalid state links are not returned.  Instead only the `self` link is returned:

```
"_links": {
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3"
    }
}
```

As noted above, to change user state, the `self` link should be called to retrieve a user object with up-to-date links.

>Important: Not all preview organizations will receive this feature. Okta has identified preview organizations that depend on the Okta .NET SDK, which requires the old functionality. Okta won't enable the feature for these orgs. Instead, when the SDK issue is resolved, Okta will send a customer communication explaining the migration path to enable the feature for those orgs.

### Platform Feature Improvement: New Default for startDate

A new default value for `startDate` ensures better performance. If the following criteria are met, the default value for `startDate` is one hour before the request was sent:

* `startDate` is omitted AND
* The filter expression contains no time window AND
* `after` is omitted

If your org or integrations depend on the previous behavior, you can request the previous behavior be enabled.

### Platform Bugs Fixed

 * Removing the last app target from an `APP_ADMIN` role assignment changed the scope of the role assignment to all app targets. Now an exception is thrown.
    To target all apps, delete the APP_ADMIN role assignment and recreate it. (OKTA-115122)
 * Adding the first app target failed to change the scope of the role assignment from applying to all app targets to only applying to the specified target.
    See [Administrator Roles API](/docs/api/resources/roles#add-app-target-to-app-administrator-role) for details. (OKTA-115122)
 * Application Administrators were incorrectly able to create an OpenID Connect service client even though they weren't assigned an OpenID Connect client app. (OKTA-115168)
 * Some orgs weren't able to deprovision a user, receiving an incorrect 403 error: "Operation failed because user profile is mastered under another system." (OKTA-119549)
<!-- * Read-only Administrators were incorrectly able to view the administrator UI for deleting authorization servers. (OKTA-123116) hold for production -->

## 2017.16

### Advance Notices

The items in this section are scheduled for future releases. Although we share our expected release dates, these dates are subject to change.

#### API Rate Limit Improvements

We are making org-wide rate limits more granular, and treating authenticated end-user interactions separately. More granular rate limits will further lessen the likelihood of calls to one URI impacting another. Treating authenticated end-user interactions separately will lessen the chances of one user's impacting another. We're also providing a transition period so you can see what these changes will look like in your Okta system log before enforcing them:

1. After Monday, 2017-04-17, you'll see system log alerts that let you know if you would have exceeded any of the new API rate limits. We're making this feature available to all preview orgs, and the feature will remain in preview for at least two weeks.

2. Starting later in April, 2017, we'll treat authenticated end-user interactions on a per-user basis. Interactions like SSO after login won't apply to your org-wide API rate limits.

3. Early in May, 2017, we will enforce the new, more granular rate limits. At that point, the warnings in the System Log will change to error notifications.

Of course, as each change is released, we'll announce the change here.

For a full description of the rate limit changes, see [API Rate Limits](/docs/api/getting_started/rate-limits).<!-- OKTA-110472 -->

#### Simple HAL Links

Okta will enable the Simple HAL Links on User Collections feature for most preview organizations.
This change is currently scheduled for the 2017.19 release on 5/10/17, to remain in preview for at least one month.

This feature will remove the HAL links that reflect state from user objects returned in collections.

Currently, a user object returned in a collection contains some or all of the following links:

```
"_links": {
    "suspend": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/suspend",
      "method": "POST"
    },
    "resetPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/reset_password",
      "method": "POST"
    },
    "expirePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/expire_password",
      "method": "POST"
    },
    "forgotPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/forgot_password",
      "method": "POST"
    },
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3"
    },
    "changeRecoveryQuestion": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/change_recovery_question",
      "method": "POST"
    },
    "deactivate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/deactivate",
      "method": "POST"
    },
    "changePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/change_password",
      "method": "POST"
    }
}
```

Unfortunately, these links are not guaranteed to accurately reflect the state of the specified user.
As outlined in [Design Principles](/docs/api/getting_started/design_principles#links-in-collections):

"Search and list operations are intended to find matching resources and their identifiers. If you intend to search for a resource and then modify its state or make a lifecycle change, the correct pattern is to first retrieve the resource by 'id' using the "self" link provided for that resource in the collection. This will provide the full set of lifecycle links for that resource based on its most up-to-date state."

The Simple HAL Links on User Collections feature ensures that possibly invalid state links are not returned.  Instead only the `self` link is returned:

```
"_links": {
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ulxgGOjrKcnmDHT0g3"
    }
}
```

As noted above, to change user state, the `self` link should be called to retrieve a user object with up-to-date links.

>Important: Not all preview organizations will receive this feature. Okta has identified preview organizations that depend on the Okta .NET SDK, which requires the old functionality.
Okta won't enable the feature for these orgs.
Instead, Okta will send a customer communication explaining the migration path to enable the feature.

### Platform Feature Improvement: Zones API Generally Available in Preview

Access policies can now be defined based on an IP address range using [the Zones API](/docs/api/resources/zones).
This feature is Generally Available in preview orgs for at least one month before being Generally Available in production. <!-- OKTA-121280 -->

### Platform Bugs Fixed

 * When a group was deleted, if that group was referenced by a social or SAML IdP, the reference wasn't removed.
    These references caused errors when trying to configure the social or SAML IdP. (OKTA-116909)
 * If the SAML IdP parameter `idp` was specified in the query string for a request to the `oauth2/v1/authorize` endpoint, the request failed in some orgs. (OKTA-120122)
 * Creating or saving access policies for an authorization server failed for some client IDs. (OKTA-121230)

## 2017.14

### Advance Notice: API Rate Limit Improvements

We are making org-wide rate limits more granular, and treating authenticated end-user interactions separately. More granular rate limits will further lessen the likelihood of calls to one URI impacting another. Treating authenticated end-user interactions separately will lessen the chances of one user's impacting another. We're also providing a transition period so you can see what these changes will look like in your Okta system log before enforcing them:

1. After Monday, 2017-04-17, you'll see system log alerts that let you know if you would have exceeded any of the new API rate limits. We're making this feature available to all preview orgs, and the feature will remain in preview for at least two weeks.

2. Starting later in April, 2017, we'll treat authenticated end-user interactions on a per-user basis. Interactions like SSO after login won't apply to your org-wide API rate limits.

3. Early in May, 2017, we will enforce the new, more granular rate limits. At that point, the warnings in the System Log will change to error notifications.

Of course, as each change is released, we'll announce the change here.

For a full description of the rate limit changes, see [API Rate Limits](/docs/api/getting_started/rate-limits).<!-- OKTA-110472 -->

### Platform Feature Improvements

#### Revoke Access Tokens and Refresh Tokens

Use the `oauthTokens` parameter when clearing user sessions to revoke all OpenID Connect and OAuth Access Tokens and Refresh Tokens
issued to the user. For more information, see [the Users API](/docs/api/resources/users#clear-user-sessions).<!-- OKTA-116904 -->

#### Token Requests with Grant Type password

Token requests with `password` grant type (`grant_type`) and `openid` scope now return an ID Token.
Previously only the appropriate Access Token or Refresh Token was returned. <!-- OKTA-117288 -->

#### Authentication That Overrides Client Request Context

The API now authenticates a user via a trusted application or proxy that uses the activation token.
For more information, see [Authentication API](/docs/api/resources/authn#primary-authentication-with-activation-token). <!-- OKTA-119692 -->

#### HAL Link for User in Provisioned State

A [HAL link](https://tools.ietf.org/html/draft-kelly-json-hal-06) to `/api/v1/users/${userId}/lifecycle/reactivate` is now provided
for requests when the user is in a PROVISIONED state but doesn't have a password.  <!-- OKTA-119221 -->

#### New Developer Org Banner

A new banner displays when you log into your developer org. It provides links to common onboarding tasks. Once you dismiss the banner, it can't be displayed again. <!-- OKTA-121055 -->

#### Access Policy by IP Range

Access Policies can now be defined based on an IP address range. <!-- OKTA-121280 -->

#### Bring Your Own SAML Certificates

Okta Admins can now upload their own SAML certificates to sign the assertion for Outbound SAML apps. These certificates can also be used to sign the AuthNRequest, as well as to decrypt the assertion for Inbound SAML. For more information, see [Bring Your Own SAML App Certificate](/docs/how-to/byo_saml).<!-- OKTA-119158 -->

#### Universal Directory for User Locale

When determining the user locale via the API, Okta uses the locale setting in the Universal Directory. If one isn't found, then Okta uses the org-wide display language instead. If the settings in Universal Directory and org are different for an end user, then Okta will prioritize the locale indicated in Universal Directory settings. This priority may change in future releases. <!-- OKTA-117789 -->

#### Lifecycle Reactivation Endpoint

Added `lifecycle/reactivate` endpoint.

This endpoint enables the API user to recover from failure in the authentication workflow, specifically when the user password is not set. In those cases this endpoint can be used to restart the activation by getting a new token and proceeding to set the user credentials. For more information, see the [API Reference](/docs/api/resources/users#reactivate-user). <!-- OKTA-119096 -->

#### Linking Users to Social Identity Providers

Added a number of APIs that allow you to link an existing Okta user to a Social Identity Provider via an `externalId`. For more information, see [Identity Provider User Operations](/docs/api/resources/idps#identity-provider-user-operations) <!-- OKTA-97257 -->

### Platform Bugs Fixed

 * Request to `/api/v1/users` while the user was still activating failed to return an HTTP 409 error. (OKTA-120458)
 * REACT samples contained errors. (OKTA-120530)
 * IdP key thumbprints were generated using SHA1. They are now generated using SHA-256, and the returned IdP key property has changed from `x5t` to `x5t#S256`. (OKTA-121442)
 * As part of the System Log API, if an invalid value was specified for `after`, we would return 0 results. Now you will get a validation error. (OKTA-119726)

## 2017.12

### Advance Notice: API Rate Limit Improvements

We are making org-wide rate limits more granular, and treating authenticated end-user interactions
separately. More granular rate limits will further lessen the likelihood of calls to one URI impacting
another. Treating authenticated end-user interactions separately will lessen the chances of one user's
impacting another. We're also providing a transition period so you can see what these changes will
look like in your Okta system log before enforcing them:

1. Starting in early April, 2017, we'll provide system log alerts to let you know that you
would have exceeded any of these new API rate limits.
2. Starting in early April, 2017, we'll treat authenticated end-user interactions on a per-user basis.
Interactions like SSO after login won't apply to your org-wide API rate limits.
3. Early in May, 2017, we will enforce the new, more granular rate limits. At that
point, the warnings in the System Log will change to error notifications.

Of course, as each change is released, we'll announce the change here.

For a full description of the rate limit changes, see [API Rate Limits](/docs/api/getting_started/rate-limits).<!-- OKTA-110472 -->

### Platform Bugs Fixed
 * The `/api/v1/apps` API sometimes incorrectly returned `null` for the `realm` or `groupName`
 attribute for a Template WS-Fed application. (OKTA-117274)
 * PUT to the `/api/v1/idps/{idpId}` API sometimes incorrectly returned an HTTP response code of 500
 rather than 400. (OKTA-117691)
 * The `/api/v1/idps` API improperly allowed social identity providers to be created
 when the administrator did not have sufficient permissions. Those providers could not be used. (OKTA-118067)
 * The `/api/v1/apps` API returned an incorrect number of app instances when pagination and permissions
 filtering were both in effect. (OKTA-113411)

## 2017.11

### Advance Notice: API Rate Limit Improvements

We are making org-wide rate limits more granular, and treating authenticated end-user interactions
separately. More granular rate limits will further lessen the likelihood of calls to one URI impacting
another. Treating authenticated end-user interactions separately will lessen the chances of one user's
impacting another. We're also providing a transition period so you can see what these changes will
look like in your Okta system log before enforcing them:

1. Starting in early April, 2017, we'll provide system log alerts to let you know that you
would have exceeded any of these new API rate limits.
2. Starting in early April, 2017, we'll treat authenticated end-user interactions on a per-user basis.
Interactions like SSO after login won't apply to your org-wide API rate limits.
3. Early in May, 2017, we will enforce the new, more granular rate limits. At that
point, the warnings in the System Log will change to error notifications.

Of course, as each change is released, we'll announce the change here.

For a full description of the rate limit changes, see [API Rate Limits](/docs/api/getting_started/rate-limits).<!-- OKTA-110472 -->

### Feature Improvements

 * Sample code to demonstrate OIDC authorization flows is available from the following locations:
   * [https://github.com/okta/samples-js-angular-1](https://github.com/okta/samples-js-angular-1)
   * [https://github.com/okta/samples-nodejs-express-4](https://github.com/okta/samples-nodejs-express-4)
   * [https://github.com/okta/samples-js-react](https://github.com/okta/samples-js-react)
   * [https://github.com/okta/samples-java-spring-mvc](https://github.com/okta/samples-java-spring-mvc)
<!-- (OKTA-118575) -->

 * System log now records the result of applying the Okta sign-on policy to determine whether
 to use multi-factor authentication for a user trying to log in. This log entry includes
 the user's zone.

{% img graphics/SysLogMFA.png alt:"Log screen" %}
<!-- (OKTA-114417) -->

### Platform Bug Fixed

For a user mastered from Active Directory and in password reset mode, the /api/v1/users API
returned the user's status as ACTIVE rather than RECOVERY. (OKTA-109772)


## 2017.10

### Advance Notice: API Rate Limit Improvements

We are making org-wide rate limits more granular, and treating authenticated end-user interactions
separately. More granular rate limits will further lessen the likelihood of calls to one URI impacting
another. Treating authenticated end-user interactions separately will lessen the chances of one user's
impacting another. We're also providing a transition period so you can see what these changes will
look like in your Okta system log before enforcing them:

1. Starting in early April, 2017, we'll provide system log alerts to let you know that you
would have exceeded any of these new API rate limits.
2. Starting in mid-April, 2017, we'll treat authenticated end-user interactions on a per-user basis.
Interactions like SSO after login won't apply to your org-wide API rate limits.
3. Early in May, 2017, we will enforce the new, more granular rate limits. At that
point, the warnings in the System Log will change to error notifications.

Of course, as each change is released, we'll announce the change here.

For a full description of the rate limit changes, see [API Rate Limits](/docs/api/getting_started/rate-limits).<!-- OKTA-110472 -->

### Platform Bugs Fixed

 * Request to [`/api/v1/authn/factors/<factorId>/verify`](/docs/api/resources/authn#enroll-factor) responded with a valid `stateToken` after user status
 became `LOCKED_OUT`, causing user interface errors. (OKTA-115153)
 * The AuthSJ SDK produced a debug log message with some browsers. (OKTA-115460)

## 2017.09

### Advance Notice: API Rate Limit Improvements

We are making org-wide rate limits more granular, and treating authenticated end-user interactions
separately. More granular rate limits will further lessen the likelihood of calls to one URI impacting
another. Treating authenticated end-user interactions separately will lessen the chances of one user's
impacting another. We're also providing a transition period so you can see what these changes will
look like in your Okta system log before enforcing them:

1. Shortly after February 28, 2017, we'll provide system log alerts to let you know that you
would have exceeded any of these new API rate limits.
2. Sometime in March, 2017, we'll treat authenticated end-user interactions on a per-user basis.
Interactions like SSO after login won't apply to your org-wide API rate limits.
3. Shortly after March 31, 2017, we will enforce the new, more granular rate limits. At that
point, the warnings in the System Log will change to error notifications.

Of course, as each change is released, we'll announce the change here.

For a full description of the rate limit changes, see [API Rate Limits](/docs/api/getting_started/rate-limits).<!-- OKTA-110472 -->

### Feature Improvement

For a collection of Users, the Links object contains only the self
link. This feature will be in preview for at least a month.
<!-- (OKTA-115269) -->

### Platform Bugs Fixed

 * The OpenID Connect and API Access Management ID Tokens contained an extraneous attribute. (OKTA-95042)
 * Some users created with the API were not activated automatically. (OKTA-112833)

## 2017.05

### Advance Notice: API Rate Limit Improvements

We are making rate limits more granular and will roll the changes out over the next few months:

1. Shortly after February 28, 2017, we'll provide system log alerts to let you know that you would have exceeded any of these new API rate limits.
2. Sometime in March, 2017, we'll treat authenticated end-user interactions on a per-user basis. Interactions like SSO after login won't apply to your org-wide API rate limits.
3. Shortly after March 31, 2017, the new, more granular rate limits will be enforced. At that point, the warnings in the System Log will change to error notifications.

Of course, as each change is released, we'll announce the change here.

For a full description of the rate limit changes, see [API Rate Limits](/docs/api/getting_started/rate-limits).<!-- OKTA-110472 -->

### Feature Improvements

* For OpenID Connect Client apps, when selecting `General settings > Implicit grant type`, you can now use checkboxes to
include `ID Tokens`, `Access Tokens`, or both.
<!-- (OKTA-94252) -->

### Platform Bugs Fixed

 * In API Access Management, where an `Access Token` contains claims that evaluate to an
 array, we did not send the claims as a JSON array and did not ensure that the values were of
 the correct types. (OKTA-113034)

## 2017.04

### Advance Notice: API Rate Limit Improvements

We are making rate limits more granular and will roll the changes out over the next few months:

1. Shortly after February 8, 2017, we'll provide system log alerts to let you know that you would have exceeded any of these new API rate limits.
2. Sometime in February, 2017, we'll treat authenticated end-user interactions on a per-user basis. Interactions like SSO after login won't apply to your org-wide API rate limits.
3. Shortly after March 8, 2017, the new, more granular rate limits will be enforced. At that point, the warnings in the System Log will change to error notifications.

Of course, as each change is released, we'll announce the change here.

For a full description of the rate limit changes, see [API Rate Limits](/docs/api/getting_started/rate-limits).<!-- OKTA-110472 -->

### Feature Improvements

* In the Add Rule dialog box (**Security > API > _authorization server name_ > Access Policies > Add Rule**),
the pre-filled default values include all grant types and the `All scopes` radio button.
<!-- (OKTA-110748, OKTA-110751) -->

## 2017.03

### Advance Notice: API Rate Limit Improvements

We are making rate limits more granular and will roll the changes out over the next few months:

1. Shortly after February 8, 2017, we'll provide system log alerts to let you know that you would have exceeded any of these new API rate limits.
2. Sometime in February, 2017, we'll treat authenticated end-user interactions on a per-user basis. Interactions like SSO after login won't apply to your org-wide API rate limits.
3. Shortly after March 8, 2017, the new, more granular rate limits will be enforced. At that point, the warnings in the System Log will change to error notifications.

Of course, as each change is released, we'll announced the change here.

For a full description of the rate limit changes, see [API Rate Limits](/docs/api/getting_started/rate-limits).<!-- OKTA-110472 -->

### Feature Improvements

#### Search for Authorization Servers by Name or Resource URI

You can now search (exact match) for an authorization server name or resource URI:
To see the new search box, log into your Okta org, click the **Admin** button, and visit **Security > API > Authorization Servers**.
<!-- OKTA-97833 -->

{% img release_notes/rn-search-as.png alt:"Search box for authorization servers" %}

#### Manual Key Rotation (Key Pinning)

In the administrator UI, you can set an authorization server to manually rotate keys.
Keys are rotated automatically by default.

>Important: Automatic key rotation is more secure than manual key rotation. Use manual key rotation only if you can't use automatic key rotation.

To change an authorization server configuration to use manual key rotation:

1. Log into the Okta org.
2. Choose **Admin**.
3. Choose **Security** > **API**.
4. Open an authorization server for editing.
5. Change the value of **Signing Key Rotation** to Manual and save.
6. In the authorization server Settings tab, click the **Rotate Signing Keys** button to rotate the keys manually. This button doesn't display when **Signing Key Rotation** is set to Automatic.
<!-- OKTA-110682 -->

### Platform Bugs Fixed

* Requesting an authorization code with `response_mode` set to `okta_post_message` failed to return
the error message ("The authorization server does not support the requested response mode") in the
response. Instead it redirected the error response to the URI specified in `redirect_uri`. (OKTA-103437)
* The one-time `sessionToken` in the response from the POST `/api/v1/authn` request with username
and password was valid for two hours after issuance. It is now valid for 5 minutes for added security. (OKTA-109907)
* Modifying the rule conditions (attributes) of a default rule that affects policy
evaluation didn't return a read-only attribute error.
If you modified one of these read-only attributes previously, and need to change the attribute back to its initial value,
{{site.contact_support_lc}}. (OKTA-110155)
* Using the `search` parameter with GET `/api/v1/users` when the user is federated returned an incorrect
value for `provider`. (OKTA-110929)
* When authentication fails because of the user's sign-on policy, the HTTP code returned was 403
but is now 401. (OKTA-111888)

## 2017.02

### Feature Improvements: New Expression Language Function

The new [expression language](/reference/okta_expression_language/) function `Arrays.toCsvString(array)` converts an array to a comma-delimited string. For example:

`Arrays.toCsvString({"This", "is", " a ", "test"})` returns `This,is, a ,test` <!-- OKTA-51976 -->

### Platform Bugs Fixed

* Introspection behavior for OpenID Connect and API Access Management was inconsistent across all token types when users were not in the ACTIVE state. (OKTA-110445)
* Incorrect text in the administrator UI, related to authorization (OpenID Connect and API Access Management), was corrected:
    * **Password** became **Resource Owner Password** in **Apps** > **General Settings** > **Allowed Grant Types**.
    * **Resource Owner Credential** became **Resource Owner Password** in the Edit Rule page of the authorization server configuration dialog
        (**Security** > **API** > **Authorization Servers**). (OKTA-110749)
* In some orgs, the links for `self` and `next` were returned with incorrect values. (OKTA-111350)

## 2016.52

### Platform Bugs Fixed

* When voice call MFA was used for an MFA challenge, the resend link wasn't populated. (OKTA-109683)
* Callouts failed when using Microsoft for social authentication. (OKTA-103080)

## 2016.51

### Platform Bugs Fixed

* When editing scopes in the General Settings tab for a single-page app (SPA) for OpenID Connect, switching to another tab deselected all scopes. (OKTA-108562)

* Instead of returning an error, invalid fields and names were added to user profiles in some cases. (OKTA-109719)

* The HAL links for the self-service actions `forgot_password`, `reset_password`, and `unlock` were returned for every user whether the action was allowed by policy or not.
This behavior applied to new orgs as of 2016.45 and is being reversed.
As of 2016.51, HAL links for these three operations are returned only if the policy for that user indicates the action is available. (OKTA-110739)

## 2016.50

### New Feature: API Access Management in EA Release

Okta's API Access Management helps enterprises protect their APIs using OAuth 2.0 as a Service.
By defining flexible security domains, scopes, claims, and access policies, you can control access as narrowly or as widely as needed for your enterprise.
With this solution, you can create one or more authorization servers, configure scopes, set access policies and have a fully operational OAuth Authorization Service in minutes.
We support the full set of core OAuth and OIDC flows (code, implicit, password, client credential, hybrid, and refresh) and are fully spec compliant.

{% img auth_server2.png alt:"Authorization Server page" %}

To get started with API Access Management, visit [API Access Management](/use_cases/api_security/).

### Feature Enhancement: Delete User Endpoint

The endpoint to delete users changed from the Beta endpoint `POST /api/v1/users/{id}/lifecycle/delete`
to the more intuitive [`DELETE /api/v1/users/{id}`](/docs/api/resources/users#delete-user) for EA.
The Beta endpoint has been removed. <!-- (OKTA-108195) -->

### Platform Bugs Fixed

* Tokens for a suspended user didn't fail introspection. (OKTA-1090006)

## 2016.49

### Feature Enhancements

#### Delete User API in EA

API access to [delete users](/docs/api/resources/users#delete-user) is now in EA. To request the feature, {{site.contact_support_lc}}.
<!-- OKTA-109291 -->

#### System Query Log Change

System logs are truncated after six months. You may want to revise any system log queries for the new limit.
This change allows us to provide faster, more consistent responses to a wider range of system-log API requests.
Because the system keeps less data in memory, it responds faster.
<!-- OKTA-105346 -->

### Platform Bugs Fixed

* Two users created simultaneously with the same login returned an HTTP 500 error. Now, a validation error is returned. (OKTA-105484)
* If an administrator was reassigned to a User Administrator role that was scoped to a group, requests to the Users API returned fewer records than indicated by the limit parameter. (OKTA-107410)
* Creating users with the Users API failed if a bookmark app was assigned to a group. (OKTA-108185)
* User profiles weren't always updated with social profile changes. (OKTA-108602)

## 2016.47

### Platform Bugs Fixed

* Read-Only Admins were unable to evaluate an MFA action, resulting in a failure to create a session. (OKTA-105659)
* Configuring a SAML 2.0 IdP with **Assign to Specific Groups** or **Full sync of groups** incorrectly limited the **Group Filter** to 25 groups. (OKTA-106787)
* Creating users with the Users API failed if a bookmark app was assigned to a group. (OKTA-108185)

## 2016.46

### Platform Bug Fixed

* When creating a user via the API, the user was created even though an exception was thrown because a word from the question was in the answer. (OKTA-106668)

## 2016.45

### Feature Enhancements

#### New Version of Okta Sign-In Widget

The new version of Okta Sign-In Widget, 1.8.0, is available:

* Localized security questions
* Added Microsoft as a Social Provider
* Added an option to provide your own dependencies

Learn about these and other improvements in [the GitHub repository](https://github.com/okta/okta-signin-widget/releases/tag/okta-signin-widget-1.8.0).

#### Improved Error Message for OpenID Connect

OpenID Connect error messages related to invalid scopes now return more information.
<!-- OKTA-94798 -->

#### User API Response Always Contains HAL Links

Previously, HAL links for self-service operations (reset password, change password and self-service unlock) were only returned if a policy evaluation indicated they should be present. As of this release we always return these links, except we don't return the self-service unlock link if the user is not locked.

This enhancement applies to all new preview and productions orgs. Existing orgs receive the enhancement at a later date.
<!-- OKTA-104084 -->

### Platform Bugs Fixed

* Blank or empty passwords were allowed when users reset their passwords via the API following a reset password action.
Following the login with a temporary password the user would be prompted to enter their new password.
At that time, the user could enter an empty password without generating an error. (OKTA-100802)
* Validation of the security answer length in accordance with password policy wasn't performed
when creating a user via the API with the group password policy feature enabled.
Before the fix, the minimum security answer length was assumed to always be 4, regardless of the policy settings. (OKTA-103407)
* Improved the error message returned by an HTTP 429 error to remind the user to wait 30 seconds before re-issuing the request for an SMS message. (OKTA-104738)
* Removed some app metadata that was incorrectly returned from a `GET /api/v1/apps/{app-ID}` request for an OpenID Connect app. (OKTA-104767)
* After resetting an SMS factor for a user, that factor was incorrectly included in a subsequent API call for that user. (OKTA-105672)
* Changed validation of OpenID Connect client apps to disallow fragment components in configured redirect URIs. (OKTA-106049)

## 2016.43

### Enhanced Well-Known Endpoint for OpenID Connect

The [OpenID Connect discovery endpoint](/docs/api/resources/oidc#well-knownopenid-configuration) `.well-known` includes the introspection and revocation endpoints.

Request Example:

~~~sh
GET https://{yourOktaDomain}/.well-known/openid-configuration
~~~

Response Example:

~~~sh
{
    "issuer": "https://{yourOktaDomain}",
    "authorization_endpoint": "https://{yourOktaDomain}/oauth2/v1/authorize",
    "token_endpoint": "https://{yourOktaDomain}/oauth2/v1/token",
    "userinfo_endpoint": "https://{yourOktaDomain}/oauth2/v1/userinfo",
    "jwks_uri": "https://{yourOktaDomain}/oauth2/v1/keys",
    "response_types_supported": [
        "code",
        "code id_token",
        "code id_token token",
        "id_token",
        "id_token token",
        "token"
    ],
    ...
    "introspection_endpoint": "https://{yourOktaDomain}/oauth2/v1/introspect",
    "introspection_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "none"
    ],
    "revocation_endpoint": "https://{yourOktaDomain}/oauth2/v1/revoke",
    "revocation_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "none"
    ]
}
~~~

### New Function for Replacing Strings

Use the [Expression Language](/reference/okta_expression_language/) function `String.replaceFirst` to replace the first occurrence of a string.

Example:

`String.replaceFirst("This list includes chores", "is", "at") = "That list includes chores"`

In release 2016.41 we introduced the string replacement function `String.replace`, which replaces all instances of a specified string.

### Platform Bug Fixed

POST requests to `/api/v1/sessions` failed with an InvalidSessionException if the request specified a
`sessionToken` but no API token was included. (OKTA-104965)

## 2016.41

### Feature Enhancements

* [New Version of Okta Sign-In Widget](#new-version-of-okta-sign-in-widget)
* [New Version of Okta Auth JS](#new-version-of-okta-auth-js)
* [Key Store Operations for Identity Providers API](#key-store-operations-are-available-for-identity-providers-api)
* [New Function for Replacing Strings](#new-function-for-replacing-strings)

#### New Version of Okta Sign-In Widget

The new version of Okta Sign-In Widget, 1.7.0, is available:

* The Widget can create access tokens and authorization codes.
* `tokenManager` manages OAuth 2.0 and OpenID Connect tokens.
* Voice Call is supported in the forgot password flow.
* Localization is available for Hungarian and Romanian.
* Added the language option to set the displayed language.

Learn about these and other improvements in [the GitHub repository](http://github.com/okta/okta-signin-widget/releases/latest).

#### New Version of Okta Auth JS

The new version of Okta Auth JS, 1.5.0, is available:

* Perform manual token refreshes with the `token.refresh` method.
* Create authorization codes in Okta Auth JS.
* Access updated user information with `token.getUserInfo`.
* Performance has improved when refreshing multiple tokens.

Learn about these and other improvements in [the GitHub repository](http://github.com/okta/okta-auth-js/releases/latest).

#### Key Store Operations are Available for Identity Providers API

Just as you can in the Apps API, you can perform key store operations in the Identity Providers API:

* Generate an X.509 certificate public key
* Retrieve and list public keys

For more information, see [Identity Provider Signing Key Store Operations](/docs/api/resources/idps#identity-provider-signing-key-store-operations).
<!-- OKTA-91498 -->

#### New Function for Replacing Strings

Use the Expression Language function `String.replace` to replace strings.

Example:

`String.replace("This list includes chores", "is", "at") = "That last includes chores"`
<!-- * `String.replaceOnce("This list includes chores", "is", "at") = "That list includes chores"` -->

For more information, see [Expression Language: String Functions](/reference/okta_expression_language/#string-functions).

<!-- OKTA-103057, OKTA-103966 -->

### Platform Bug Fixed

* Reauthorization using app sign-on policy wasn't always enforced for OpenID Connect flows.(OKTA-99897) <!-- OKTA-99900 -->

## 2016.40

### Feature Enhancement: Listing Apps that Share an Application Key Credential

Once you have shared a credential between apps, you can list all the applications that are using
the same application key credential. <!-- OKTA-100925 -->

For more information, see the [Apps API reference](/docs/api/resources/apps#list-applications-using-a-key).

## 2016.39

### Feature Enhancement: Sharing Certificates Between App Instances

By cloning an app key credential with the Apps API, you can share the same certificate between two or more apps:

<pre>/apps/<em>:aid</em>/credentials/keys/<em>:kid</em>/clone?targetAid=<em>:targetAid</em></pre>

To share a certificate among app instances:

1. Generate a new app key credential for an app (the source app).
2. Use the new credential in the source app.
3. Share the credential (`kid`) with one or more target apps.
4. Use the new credential in the target app.

For more detailed instructions, see ["Clone Key Credential for Application"](/docs/api/resources/apps#clone-application-key-credential)
and ["Update Key Credential for Application"](/docs/api/resources/apps#update-key-credential-for-application).

### Bug Fixed

The WWW-Authenticate header couldn't be read when the `/oauth2/v1/userinfo` endpoint returned errors in a browser. (OKTA-101943)

## 2016.37

### Bug Fixed

* In some cases, a `GET /api/v1/users` request incorrectly returned a 403 error. <!-- OKTA-75861 -->

## 2016.36

### System Log Enhancement

The names of [AppUser properties](/docs/api/resources/apps#application-user-properties)
that have changed during an import are included in the system log. <!-- (OKTA-96525) -->

## 2016.35

### Feature Enhancements
 
#### Improvements to Endpoint sessions/me
<!-- OKTA-95047 -->
* The parameter `createdAt` is returned in results.
* If authentication is done using a social IdP or SAML, `lastPasswordVerification` isn't updated.
* The parameter `lastPasswordVerification` is only updated when the password is verified.

#### New Version of Okta Sign-In Widget 

The new version of Okta Sign-In Widget, 1.6.0, is available:

* Okta Sign-In Widget supports two new factors: Windows Hello and U2F.
* The Widget is localized for Czech.
* Translations are shipped with the `npm` module.

Learn about these and other improvements at [the Git site](https://github.com/okta/okta-signin-widget/releases/tag/okta-signin-widget-1.6.0).

## 2016.34

### Feature Enhancement: HAL Links For Sessions API Are CORS-Enabled

Two Session API endpoints, `GET /api/v1/sessions/me` and `POST /sessions/me/lifecycle/refresh`, return `/me` instead of `/${userId}` in response links.
These links are CORS-enabled, consistent with the original API calls which are also CORS-enabled.

For more information, see [Get Session](/docs/api/resources/sessions#get-session) or [Refresh Session](/docs/api/resources/sessions#refresh-session).<!-- OKTA-98961 -->

### Bugs Fixed

* IdP keys could be deleted even when referenced by an active or inactive app instance. (OKTA-96139)
* Properties could be deleted from the [User Profile schema](/docs/api/resources/schemas#remove-property-from-user-profile-schema)
while still referenced as a `matchAttribute` in inbound SAML IdPs. (OKTA-96281)
* Identity Providers for social authentication configured to look up usernames by Okta username or email failed to return a valid match.
This failure occurred if the username was in both the username and email and a second user existed with the same email but different username. (OKTA-96335)

## 2016.33

### Bugs Fixed

* Custom SAML apps couldn't update their signing key credentials via API. (OKTA-93959)
* When configuring OpenID Connect client apps, the App Embed Links dialog displayed custom login and error page sections that weren't applicable. (OKTA-95526)
* Using an API token created by a Read-Only Administrator caused a permission error when GET requests were sent to `/api/v1/users/${userId}/factors` or `/api/v1/users/${userId}/factors/catalog`. (OKTA-95569)
* GET requests to `oauth2/v1/authorize` that specified the Form Post Response Mode sometimes failed to receive `expires_in` and `scope` in the response. (OKTA-98245)

## 2016.31

### Feature Enhancements

#### Version 1.4.0 of okta-auth-js Available

<!-- OKTA-97056 -->
We've added support for Access Tokens and two new namespaces, token and tokenManager,
to handle both ID Tokens and Access Tokens.
The token namespace makes it easier to specify how to retrieve your tokens:
getWithoutPrompt, getWithPopup, and getWithRedirect.
The tokenManager namespace allows tracking tokens and automatically refreshes them for you.

For more details including feature and bug-fix commits,
see [the okta-auth-js Git repository](https://github.com/okta/okta-auth-js/releases/tag/okta-auth-js-1.4.0).

#### Rules Included in Policy API requests

<!-- OKTA-40548 -->
Use the `expand` query parameter to include up to twenty rules in a Policy API query:

`GET https://my-org.okta.com/api/v1/policies/{id}?expand=rules`

The embedded rules option returns up to 20 rules for a given policy. If the policy has more than 20 rules, this request returns an error.

### Bug Fixed

* The ampersand (&) character in a username caused Forgot Password API requests (`/api/v1/authn/recovery/password` to fail. (OKTA-93994)

## 2016.30

### New Features

#### Create Custom Apps with the API

<!-- OKTA-83462 -->
You can now create SAML and SWA custom apps using the Apps API. Previously you had to create a custom app
using the [**App Integration Wizard**](https://help.okta.com/en/prod/Content/Topics/Apps/Apps_App_Integration_Wizard.htm)
in the administrator UI.

For more information about creating custom apps with the API, see [Apps API: Add Custom SAML Application](/docs/api/resources/apps#add-custom-saml-application).

### Feature Enhancements

#### User-Matching Improvement for SAML Identity Providers (IdPs)

<!-- OKTA-93061 -->
For SAML IdPs, you can now match transformed IdP usernames using more attributes.
To match on an attribute other than username, email, or either, specify the attribute name in the property `matchAttribute`,
and specify the value `CUSTOM_ATTRIBUTE` in `matchType`.

For more information, see [Identity Providers](/docs/api/resources/idps#subject-policy-object).

> {{site.contact_support_uc}} to enable this Early Access feature.

#### Okta Sign-In Widget Release 1.5.0

<!-- OKTA-96356 -->
The Okta Sign-In Widget release 1.5.0 contains the following enhancements:

* Passcodes for RSA and On-Prem MFA are masked.
* The dependencies `@okta/i18n` and `@okta/courage` are optional, to allow `npm install` to work properly.
* The **Show Answer** checkbox has been replaced with a simpler **Show/Hide** toggle button in the **Answer** field. The **Show Answer** checkbox displays when a security question is a factor.

### Bugs Fixed

* When configuring an app with OpenID Connect, some redirect URIs weren't saved correctly. (OKTA-90445)
* Problems occurred in some orgs when deleting a very large group using the API. (OKTA-91383)

## 2016.29

### Feature Enhancements

#### New Response Parameter For Access Token Expiration

<!-- OKTA-94115 -->
The `expires_in` response parameter tells you the number of seconds before a `token` (Access Token) expires. If your
response from the `/oauth2/v1/authorize` endpoint includes an Access Token, `expires_in` is included in the response.

For more information, see the `/oauth2/v1/authorize` [Response Properties](/docs/api/resources/oidc#response-properties).

#### SHA256 Certificate for New SAML IdP Instances

<!-- OKTA-91496 -->
The default certificate used by new SAML IdP instances to sign assertions is a SHA256 certificate.
Existing SAML IdP instances will continue to use the certificate they currently have.

### Bug Fixed

* Requiring `okta-auth-js` didn't work unless you also defined global variables in the build flow. (OKTA-94206)

## 2016.28

### Feature Enhancement: Password Complexity Requirements

<!-- OKTA-88905 -->
To enable a platform client to display password
complexity requirements to the user, we've enhanced the PasswordComplexity object to include those requirements: `excludeUsername`, `age:minAgeMinutes`, and `age:historyCount`.

~~~json
{
  "expiration":{
    "passwordExpireDays": 0
  },
  "complexity": {
    "minLength": 8,
    "minLowerCase": 1,
    "minUpperCase": 1,
    "minNumber": 1,
    "minSymbol": 0,
    "excludeUsername": "true"
    },
   "age":{
     "minAgeMinutes":0,
     "historyCount":0
    }
}
~~~

Also, the response to an answer recovery question (`/api/v1/authn/recovery/answer`) includes the PasswordPolicy object, which contains the PasswordComplexity object:

~~~json
{
  "stateToken": "00lMJySRYNz3u_rKQrsLvLrzxiARgivP8FB_1gpmVb",
  "expiresAt": "2015-11-03T10:15:57.000Z",
  "status": "PASSWORD_RESET",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "passwordChanged": "2015-09-08T20:14:45.000Z",
      "profile": {
        "login": "dade.murphy@example.com",
        "firstName": "Dade",
        "lastName": "Murphy",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      }
    },
    "policy": {
     "expiration":{
       "passwordExpireDays": 0
       },
       "complexity": {
         "minLength": 8,
         "minLowerCase": 1,
         "minUpperCase": 1,
         "minNumber": 1,
         "minSymbol": 0,
         "excludeUsername": "true"
       },
       "age":{
         "minAgeMinutes":0,
         "historyCount":0
       }
    }
  },
  "_links": {
        ...
  }
}
~~~

When performing a self-service password reset (forgot password), the request for an answer recovery question is made in response to the security question challenge.
For more information, see [Password Complexity Object](/docs/api/resources/authn#password-complexity-object)
and [Answer Recovery Question](/docs/api/resources/authn#answer-recovery-question).

## 2016.27

### Feature Enhancements

#### Improvements for OAuth Panels in the Administrator Console

<!-- OKTA-93256 -->
To improve usability, we've moved some of the panels in the administrator UI related to OAuth:

* The **OAuth** tab has been renamed **Authorization Server**.
* The **Signing credentials rotation** option was on the **Client Registration** panel, but since it helps you configure tokens, we've
 moved it to the **Authorization Server** tab.

{% img changed_tabs.png alt:"New Tab for Managing OAuth-Related Configuration" %}

#### Okta Sign-In Widget Updated

<!-- OKTA-91831, OKTA-93759 -->
The Okta Sign-In Widget will be updated to version 1.4.0 for Production orgs.

See [Okta Sign-In Widget](/docs/guides/okta_sign-in_widget) for updated sample code.

The new release includes several enhancements:

* The new version is an npm module and is availabe on the [npm registry](https://www.npmjs.com/package/@okta/okta-signin-widget).
* Changes to the "Trust this Device" checkbox and other minor bug fixes have been made.

#### Improved User Lookup for Password Recovery

<!-- OKTA-92001 -->
To ensure a successful password recovery lookup if an email address is associated with multiple users, we improved the lookup behavior:

* Okta no longer includes deactivated users in the lookup.
* The lookup searches login IDs first, then primary email addresses, and then secondary email addresses.

### Bugs Fixed

* The OIDC Access Token was incorrectly available to Okta endpoints other than `/oauth2/v1/userinfo`. (OKTA-91099)
* The format of the issuer (`iss`) in the Access Token has changed: it was the client ID. It now takes the form: `https://<your-org>.okta.com/as/<authorization-server-ID>. (OKTA-93628)


## 2016.26

### New Feature: API for Custom SMS Template

You can send custom text as part of an SMS message request:

1. Use the `/api/v1/templates/sms` endpoint to create a custom SMS text template.
2. Send a request to the Factors API specifying the template for verification. There is no change in the response.

For more information, see [Templates API](/docs/api/resources/templates) and [Factors API](/docs/api/resources/factors).

### Feature Enhancement: Resource Owner Password Credential Flow for OpenID Connect Supports Refresh Tokens

The `/oauth2/v1/token` endpoint includes a Refresh Token if:

* The request contains a `grant_type` with the value `password` and your client supports the `grant_type` value `refresh_token`. For more information, see [Token Request](/docs/api/resources/oidc#request-parameters-1).
* You request the `offline_access` scope. For more information, see [Refresh Tokens](/authentication-guide/tokens/refreshing-tokens).

### Bugs Fixed

* For some customers, an API request for users that match a value for `last_name` didn't return all the matches. (OKTA-91367)

## 2016.25

### New Platform Feature: Limit on Size of Groups Claim
    
To protect against arbitrarily large numbers of groups matching the group filter, the group claim has a limit of 100. 
If more than 100 groups match the filter, then the request fails.

* For more information about configuring an app for OpenID Connect, including group claims, see [Using OpenID Connect](/docs/api/resources/oidc). 
* For more information about group claims in the API, see Scope-dependent claims.

### Bugs Fixed

The following issues are fixed:

* OKTA-89624 – Base schema attributes for OpenID Connect without default mappings weren't included in ID token claims.
* OKTA-89867 – Creating a new user and adding that user to a group with the same create request via the API failed, which was a problem for group-scoped User Admins creating users.
* OKTA-90593 – The Group property <em>lastMembershipUpdated</em> wasn't updated when adding or removing users from an Active Directory group using scheduled import.
* OKTA-90898 – Updating credentials failed when using the Apps API for custom apps.
* OKTA-91066 – System log messages related to OpenID Connect didn't contain scopes.

Added on June 29: 

* OKTA-90514 – When adding a group target to a User Administrator role via the API, that user still had the ability to administer all groups. Also, removing the last group target from a role after one has been added was incorrectly allowed.


## 2016.24

### New Platform Feature

#### New Version of Okta Sign-In Widget
Version 1.3.3 of the Okta Sign-In Widget, and version 1.0.2 of okta-auth-js are available for Preview orgs. For more information, see Okta Sign-In Widget.

#### Policy API
The Links object, `_links`, is available in the Policy object. For more information, see [Links Object](/docs/api/resources/users#links-object).

#### Improved Error Descriptions
The error descriptions related to OAuth provide more helpful information about invalid clients for OpenID Connect flows.

#### Disable Automatic Key Rotation
If you need to disable automatic key rotation for an OpenID Connect flow, you can do so in General Settings section under the General tab for an app, and then use the `/oauth2/v1/keys` endpoint to fetch public keys for your app. For more information, see [OpenID Connect](/docs/api/resources/oidc).

### Bugs Fixed

* OKTA-69173 – The `helpURL` for `vpn` wasn't returned even though it had been set previously in a request to `/api/v1/apps`.

## 2016.23

### Bugs Fixed

* OKTA-73691 – HTML tags were incorrectly allowed in POST and PUT requests to `/api/v1/idps/`.
* OKTA-90218 – Requests to `/oauth2/v1/authorize` failed if they included a state value with special characters.
* OKTA-91074 – Requests to `/oauth2/v1/introspect` incorrectly included scopesList.
* OKTA-91441 – The Users API incorrectly returned an error when updating login. 
