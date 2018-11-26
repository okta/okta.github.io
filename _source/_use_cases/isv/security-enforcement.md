---
layout: docs_page
title: Security Enforcement Integrations
weight: 2
excerpt: Close the Loop with the power of identity context to resolve or mitgate detected threats
---
{::options parse_block_html="true" /}

# {{page.title}}

## Write back to enforce policy in Okta

Building from the foundation laid in our [Security Analytics] guide

To resolve an incident or mitigate a perceived threat, an external system may want to affect a user's state, modify authentication policies or reduce application availability. This document will describe how and when a system might take these actions.

### Information About Examples

<div style="border: 1px solid #626b6d; background-color: #ddf8ff; padding-left: 15px; padding-right: 15px; padding-bottom: 15px; padding-top: 15px">

#### Simplified Examples

For readability simplified versions of the API transactions are illustrated below. We use the following modifications:

+ Repetitive details like content-type and authorization headers will be excluded
+ Request and response objects will be truncated to focus on the most relevant information
  + Truncated sections will be denoted by an ellipsis ("...")
+ In syntax statements introducing each endpoint, the base URL is omitted.
+ Replacement values will be noted in italicized braces _{}_
+ Examples:
  + `{yourOktaDomain}` = Base URL of the Okta org (e.g. _`https://acme.okta.com`_ )
        If you are logged in, your Okta domain name appears instead of the placeholder.
  + `{user_id}` = Opaque and Immutable Okta ID for a user (e.g. _`00u1ae58uup0y5Qkg1d8`_)
  + `{group_id}` = Opaque and Immutable Okta ID for a group (e.g. _`00g1at1k0dzmV839P1d8`_)

#### Resolving Okta identifiers

When using logs from Okta to write back to Okta, the values for `user_id`, `group_id` and others will be present in the log.  They will be found in the `actor` or `target` object, along with other references suitable for distinction.

When using logs from outside of Okta to trigger to coorelate or trigger events, use the lookup and search functions described in the [Users](security-analytics#users) and [Groups](security-analytics#groups) sections above to retrieve the Okta identifier for those objects.

</div>

## Examples

### Users

{% include_relative includes/enforcement-users.md %}

### Groups

{% include_relative includes/enforcement-groups.md %}

## Related articles

{% include_relative includes/related.md %}
