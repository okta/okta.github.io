---
# To update the data in this table, please see https://bit.ly/2xsgk47
 
layout: docs_page
weight: 2
title: Event Types
excerpt: Catalogs the event type system for Events API and System Log API
css: page-event-types
---

# Event Types

Event types are the primary method of organization within the Okta event system. This resource describes the event type system used by the Okta eventing platform.

## Catalog

The following includes the full listing of the event types used in [System Log API](/docs/api/resources/system_log) with an associated description. It also includes a mapping to the equivalent event types in the legacy [Events API](/docs/api/resources/events). 
This relationship is generally many-to-one, but there are a few exceptions. Note that there are currently some System Log event types which do not have an Events API equivalent.

> **Important:** Going forward the Events API will not be tracking new event types added to the System Log API. For this reason we highly recommend migrating to the System Log API.

<section id="event-type-catalog">
  <table>
    <thead>
      <tr>
        <th width="50%">ID</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      {%- assign catalog = site.data.event-types.versions[1] -%}
      {%- for eventType in catalog.eventTypes -%}
      <tr>
        <td markdown="span">`{{ eventType.id }}`</td>
        <td markdown="span">
        {{ eventType.description }}
        <br>
        {%- for mapping in eventType.mappings -%}<span>`{{ mapping }}`</span>{%- endfor -%}
        </td>
      </tr>
      {%- endfor -%}
    </tbody>
  </table>
</section>

