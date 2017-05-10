---
layout: docs_page
title: Platform Release Notes
excerpt: Summary of changes to the Okta Platform since Release 2016.47
---

# Release 2016.49

## Feature Enhancements

### Delete User API in EA

API access to [delete users](/docs/api/resources/users.html#delete-user) is now in EA. To request the feature, contact Support. 
<!-- OKTA-109291 -->

### System Query Log Change

System logs are truncated after six months. You may want to revise any system log queries for the new limit.
This change allows us to provide faster, more consistent responses to a wider range of system-log API requests.
Because the system keeps less data in memory, it responds faster.
<!-- OKTA-105346 -->

## Platform Bugs Fixed

* Two users created simultaneously with the same login returned an HTTP 500 error. 
    Now, a validation error is returned. (OKTA-105484)
* If an Admin was reassigned to a UserAdmin role that was scoped to a group, requests to the Users API returned fewer records than indicated by the limit parameter. (OKTA-107410)
* Creating users with the Users API failed if a bookmark app was assigned to a group. (OKTA-108185)
* User profiles weren't always updated with social profile changes. (OKTA-108602)

## Does Your Org Have This Change Yet?

Check the footer of any Admin page in an org to verify the current release for that org. For example,
scroll to the bottom of the Admin **Dashboard** page to see the version number:

{% img release_notes/version_footer.png alt:"Release Number in Footer" %}

## Looking for Product Release Notes?

For changes outside the Okta platform, see the [Release Notes Knowledge Hub](http://support.okta.com/help/articles/Knowledge_Article/Release-Notes-Knowledge-Hub).
