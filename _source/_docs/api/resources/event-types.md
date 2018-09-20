---
# To update the data in this table, please see https://bit.ly/2xsgk47
 
layout: docs_page
weight: 2
title: Event Types
toc: false
css: event-types
js: event-types
excerpt: Catalogs the event type system for Events API and System Log API
---

# Event Types

Event types are the primary method of organization within the Okta event system. This resource describes the event type system used by the Okta eventing platform.

## Catalog

The following is a full listing of event types used in the [System Log API](/docs/api/resources/system_log) with an associated description. It also includes a mapping to the equivalent event types in the legacy [Events API](/docs/api/resources/events). 
This relationship is generally many-to-one, but there are a few exceptions. Note that there are currently some System Log event types which do not have an Events API equivalent.

> **Important:** Going forward the Events API will not be tracking new event types added to the System Log API. For this reason we highly recommend migrating to the System Log API.

<br>
{%- assign eventTypes = site.data.event-types.versions[1].eventTypes | sort: "id" -%}
<input type="text" id="event-type-search" name="filter" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Search event types for...">
<div id="event-type-count">Found <b>{{ eventTypes.size }}</b> matches</div>
{% for eventType in eventTypes %}
<div class="event-type" markdown="block">
#### {{ eventType.id }}
{% if eventType.mappings.size > 0 %}
<div class="event-type-mappings">
  <b>Legacy event type(s): </b> {{ eventType.mappings | join: ', ' }}
</div>
{% endif %}
{: .event-type-description }
{% if eventType.description != "" %}
{{ eventType.description}}
{% else %}
_No description_
{% endif %}
<div class="event-type-tags">
{% for tag in eventType.tags%}<code class="event-type-tag">{{ tag }}</code>{% endfor %}
</div>
</div>
{% endfor %}

