---
layout: docs_page
title: Okta API Release Notes
excerpt: Summary of changes to the Okta API since Release 2017.38
---

## Okta API Release Notes for Release 2017.38

The following API feature enhancements and bug fixes are available in the 2017.38 release.
Dates for preview and production release are the earliest possible release date. Always check your org to verify the release version.

### API Feature Enhancements

| Feature Enhancement                                                           | Expected in Preview Orgs            | Expected in Production Orgs |
|:------------------------------------------------------------------------------|:------------------------------------|:----------------------------|
|         Key Rotation for OpenID and OAuth Apps | September 20, 2017                     | September 25, 2017           |

#### Key Rotation for OpenID Connect and OAuth Apps

You can now specify manual key rotation for OpenID Connect and OAuth apps in the Apps API with `autoKeyRollover`. More information can be found in the [API Reference](docs/api/resources/apps.html#oauth-credential-object).

### API Bug Fixes

Bug fixes are expected on preview orgs starting September 20, 2017, and on production orgs starting September 25, 2017.

* Using a refresh token for a client application with a client ID longer than 20 characters would result in an error. (OKTA-139722)

### Does Your Org Have This Change Yet?

To verify the current release for an org, click the **Admin** button and check the footer of the Dashboard page.

{% img release_notes/version_footer.png alt:"Release Number in Footer" %}

### Looking for Something Else?

* [Platform Release Note Index for 2016](platform-release-notes2016-index.html) 
* [Platform Release Note Index for 2017](platform-release-notes2017-index.html)
* For changes outside the Okta platform, see the [Product Release Notes](https://help.okta.com/en/prev/Content/Topics/ReleaseNotes/preview.htm).