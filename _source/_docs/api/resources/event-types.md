---
# To update the data in this table, please see https://bit.ly/2xsgk47
 
layout: docs_page
weight: 2
title: Event Types
toc: false
css: event-types
js: event-types
excerpt: Catalogs the Okta event type system for System Log API.
---

# Event Types

Event types are the primary method of categorization within the Okta eventing platform. They allow consumers to easily group notable system occurrences based on behavior. This resource contains the complete event type catalog of this platform.

## Catalog

The following is a full listing of event types used in the [System Log API](/docs/api/resources/system_log) with associated description and related metadata. For migration purposes it also includes a mapping to the equivalent event type in the legacy [Events API](/docs/api/resources/events). 
The relationship between System Log API and Events API event types is generally one-to-many. Note that there are currently some System Log API event types which do not have an Events API equivalent.

> **Important:** In the future the Events API will not be tracking new event types added to the System Log API. For this reason we highly recommend migrating to the System Log API.

<br>
{%- assign eventTypes = site.data.event-types.versions[1].eventTypes | sort: "id" -%}
<input type="text" id="event-type-search" name="filter" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Search event types for...">
<div id="event-type-count">Found <b>{{ eventTypes.size }}</b> matches</div>
{% for eventType in eventTypes %}
<div class="event-type" markdown="block">
{%- assign parts = eventType.id | split: '.' -%}
{%- capture id -%}{%- for part in parts -%}{%- if forloop.first == true -%}<b>{{ part }}</b>{%- else -%}.{{ part }}{%- endif -%}{%- endfor -%}{%- endcapture -%}
#### {{ id }}
  {% if eventType.mappings.size > 0 %}
  <div class="event-type-mappings">
    <b>Legacy event types: </b> {{ eventType.mappings | join: ', ' }}
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
  <div class="event-type-release">
  Since: <a href="/docs/change-log/">{{ eventType.info.release }}</a>
  </div>
</div>
{% endfor %}
