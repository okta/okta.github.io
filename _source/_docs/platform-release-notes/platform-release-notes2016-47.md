---
layout: docs_page
title: Platform Release Notes
excerpt: Summary of changes to the Okta Platform since Release 2016.46
---

# Release 2016.47

<!-- ## Feature Enhancements -->

## Platform Bugs Fixed

* Read-Only Admins were unable to evaluate an MFA action, resulting in a failure to create a session. (OKTA-105659)
* Configuring a SAML 2.0 IdP with **Assign to Specific Groups** or **Full sync of groups** incorrectly limited the **Group Filter** to 25 groups. (OKTA-106787)
* Creating users with the Users API failed if a bookmark app was assigned to a group. (OKTA-108185)

## Does Your Org Have This Change Yet?

Check the footer of any Admin page in an org to verify the current release for that org. For example,
scroll to the bottom of the Admin **Dashboard** page to see the version number:

![Release Number in Footer](/assets/img/release_notes/version_footer.png)
