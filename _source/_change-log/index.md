---
layout: docs_page
title: Okta API Products Change Log
redirect_from: /change-log/
excerpt: List of changes to the Okta API and related API Products including bug fixes and new features
---

# Okta API Products Change Log

This change log lists customer-visible changes to API Products by release number. Okta releases every week except a few times a year we skip
a release, usually due to holiday schedules or other special events. We release first to preview orgs and then production orgs.

Dates for preview and production release are the earliest possible release date. Always check your org to verify the release for your org. 

To verify the current release for an org, check the footer of the Dashboard page. If necessary, click the **Admin** button to navigate to your dashboard.
{% img release_notes/version_footer.png alt:"Release Number in Footer" %}

> Note: Changes to Okta unrelated to API Products are published in the [Okta Release Notes](https://help.okta.com/en/prod/Content/Topics/ReleaseNotes/okta-relnotes.htm).

<div>
{% assign sorted = site.change-log | sort: 'date' | reverse %}
{% for file in sorted %}
  {% if file.id contains "/index" %}{% continue %}{% endif %}
  {{ file.content }}
{% endfor %}
</div>
