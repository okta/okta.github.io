---
layout: docs_page
title: Okta API Products Change Log
redirect_from:
- /docs/platform-release-notes/platform-release-notes2016-23.html
excerpt: List of changes to the Okta API and related API Products including bug fixes and new features
---

<div>

{% assign sorted = site.change-log-source | sort: 'date' | reverse %}
{% for file in sorted %}
  {% if file.id contains "/index" %}{% continue %}{% endif %}
  {{ file.content }}
{% endfor %}
</div>
