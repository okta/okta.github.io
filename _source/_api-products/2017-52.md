---
layout: docs_page
title: Okta API Release Notes
excerpt: Additional events in log, token preview UI,  and API bug fix
---

## Okta API Release Notes for Release 2017.52

These release notes summarize the changes since 2017.50. Dates for preview and production release are the earliest possible release date. Always check your org to verify the release version.

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

We improved some behaviors related for [base claim `amr`](/standards/OIDC/index.html#base-claims-always-present):

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

### Does Your Org Have This Change Yet?

To verify the current release for an org, check the footer of the Dashboard page. If necessary, click the **Admin** button to navigate to your dashboard.

{% img release_notes/version_footer.png alt:"Release Number in Footer" %}

### Looking for Something Else?

* [Platform Release Note Index for 2016](platform-release-notes2016-index.html)
* [Platform Release Note Index for 2017](platform-release-notes2017-index.html)
* For changes outside the Okta platform, see the [Product Release Notes](https://help.okta.com/en/prev/Content/Topics/ReleaseNotes/okta-relnotes.htm).