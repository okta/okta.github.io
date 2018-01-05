---
layout: docs_page
title: Okta API Products Change Log
redirect_from: /change-log/
excerpt: List of changes to the Okta API and related API Products including bug fixes and new features
---

<div>
{% assign sorted = site.change-log | sort: 'date' | reverse %}
{% for file in sorted %}
  {% if file.id contains "/index" %}{% continue %}{% endif %}
  {{ file.content }}
{% endfor %}
</div>
