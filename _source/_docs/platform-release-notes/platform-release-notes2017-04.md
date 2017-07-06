---
layout: docs_page
title: Platform Release Notes
excerpt: Summary of changes to the Okta Platform since Release 2017.03
---

## Release 2017.04

### Advance Notice: API Rate Limit Improvements

We are making rate limits more granular and will roll the changes out over the next few months:

1. Shortly after February 8, 2017, we'll provide system log alerts to let you know that you would have exceeded any of these new API rate limits.
2. Sometime in February, 2017, we’ll treat authenticated end-user interactions on a per-user basis. Interactions like SSO after login won't apply to your org-wide API rate limits.
3. Shortly after March 8, 2017, the new, more granular rate limits will be enforced. At that point, the warnings in the System Log will change to error notifications.

Of course, as each change is released, we'll announce the change here.

For a full description of the rate limit changes, see [API Rate Limit Improvements](https://support.okta.com/help/articles/Knowledge_Article/API-Rate-Limit-Improvements).<!-- OKTA-110472 -->

### Feature Improvements

* In the Add Rule dialog box (**Security > API > _authorization server name_ > Access Policies > Add Rule**),
the pre-filled default values include all grant types and the `All scopes` radio button.
<!-- (OKTA-110748, OKTA-110751) -->

<!-- ### Platform Bugs Fixed -->

### Does Your Org Have This Change Yet?

To verify the current release for an org, click the **Admin** button and check the footer of the Dashboard page.

{% img release_notes/version_footer.png alt:"Release Number in Footer" %}

### Looking for Something Else?

* [Platform Release Note Index](platform-release-notes2016-index.html)
* For changes outside the Okta platform, see the [Release Notes Knowledge Hub](https://support.okta.com/help/articles/Knowledge_Article/Release-Notes-Knowledge-Hub).

