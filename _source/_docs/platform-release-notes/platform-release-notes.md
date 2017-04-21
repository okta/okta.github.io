---
layout: docs_page
title: Platform Release Notes
excerpt: Summary of changes to the Okta Platform since Release 2017.15
---

## Release 2017.16

### Advance Notices
 
#### API Rate Limit Improvements

We are making org-wide rate limits more granular, and treating authenticated end-user interactions separately. More granular rate limits will further lessen the likelihood of calls to one URI impacting another. Treating authenticated end-user interactions separately will lessen the chances of one user's impacting another. We’re also providing a transition period so you can see what these changes will look like in your Okta system log before enforcing them:

1. After Monday, 2017-04-17, you'll see system log alerts that let you know if you would have exceeded any of the new API rate limits. We're making this feature available to all preview orgs, and the feature will remain in preview for at least two weeks.

2. Starting later in April, 2017, we’ll treat authenticated end-user interactions on a per-user basis. Interactions like SSO after login won't apply to your org-wide API rate limits.

3. Early in May, 2017, we will enforce the new, more granular rate limits. At that point, the warnings in the System Log will change to error notifications.

Of course, as each change is released, we'll announce the change here.

For a full description of the rate limit changes, see [API Rate Limit Improvements](https://support.okta.com/help/articles/Knowledge_Article/API-Rate-Limit-Improvements).<!-- OKTA-110472 -->

#### HAL Link Changes

In a few weeks, we will enable a Simple HAL Links feature in most preview organizations that removes HAL links from user objects returned in collections.
Deployment of this change is currently scheduled for 5/10/17 in release 2017.19 (subject to change).

Currently, a user object returned in a collection contains some or all of the following HAL links:

```
"_links": {
    "suspend": {
      "href": "https://your-domain.okta.com/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/suspend",
      "method": "POST"
    },
    "resetPassword": {
      "href": "https://your-domain.okta.com/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/reset_password",
      "method": "POST"
    },
    "expirePassword": {
      "href": "https://your-domain.okta.com/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/expire_password",
      "method": "POST"
    },
    "forgotPassword": {
      "href": "https://your-domain.okta.com/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/forgot_password",
      "method": "POST"
    },
    "self": {
      "href": "https://your-domain.okta.com/api/v1/users/00ulxgGOjrKcnmDHT0g3"
    },
    "changeRecoveryQuestion": {
      "href": "https://your-domain.okta.com/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/change_recovery_question",
      "method": "POST"
    },
    "deactivate": {
      "href": "https://your-domain.okta.com/api/v1/users/00ulxgGOjrKcnmDHT0g3/lifecycle/deactivate",
      "method": "POST"
    },
    "changePassword": {
      "href": "https://your-domain.okta.com/api/v1/users/00ulxgGOjrKcnmDHT0g3/credentials/change_password",
      "method": "POST"
    }
}

 ```
Once the new Simple HAL Links feature is enabled, only the "self" link will be returned:

```
"_links": {
    "self": {
      "href": "https://your-domain.okta.com/api/v1/users/00ulxgGOjrKcnmDHT0g3"
    }
}
 ```
Okta is making this change for two reasons:

* The set of links returned with collection elements doesn't always reflect the actual state of the user, because of elastic search latency.
* When Group Password Policy is enabled, performance issues associated with generating the HAL links can make some APIs unusable for orgs with large numbers of users.
 
>Note: The Okta .NET SDK currently contains code that depends on the links in the user collections. 
Okta won't enable this feature if your org is affected, and Okta Support will contact you to create a plan once the .NET SDK has been updated.
If we failed to detect your org's dependence on the old behavior, please contact Okta Support and request that the old behavior be restored.
 
This feature should remain in preview for approximately one month.

### Platform Feature Improvement: Zones API Generally Available in Preview

Access policies can now be defined based on an IP address range using [the Zones API](/docs/api/resources/zones.html).
This feature is Generally Available in preview orgs for at least one month before being Generally Available in production. <!-- OKTA-121280 -->

### Platform Bugs Fixed

 * When a group was deleted, if that group was referenced by a social or SAML IdP, the reference wasn't removed.
    These references caused errors when trying to configure the social or SAML IdP. (OKTA-116909)
 * If the SAML IdP parameter `idp` was specified in the query string for a request to the `oauth2/v1/authorize` endpoint, the request failed in some orgs. (OKTA-120122)
 * Creating or saving access policies for an authorization server failed for some client IDs. (OKTA-121230)
 
### Does Your Org Have This Change Yet?

To verify the current release for an org, click the **Admin** button and check the footer of the Dashboard page.

![Release Number in Footer](/assets/img/release_notes/version_footer.png)

### Looking for Something Else?

* [Platform Release Note Index](platform-release-notes2016-index.html)
* For changes outside the Okta platform, see the [Product Release Notes](https://help.okta.com/en/prev/Content/Topics/ReleaseNotes/preview.htm).

