---
layout: docs_page
title: Okta API Release Notes
---
<div>
{% assign sorted = site.change-log | sort: 'date' | reverse %}
{% for file in sorted %}
  {% if file.id contains "/index" %}{% continue %}{% endif %}
  {{ file.content }}
{% endfor %}
</div>
