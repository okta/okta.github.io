---
layout: docs_page
title: Security Analytics Integrations
weight: 2
excerpt: Ingest identity context from Okta to enhance your Security ecosystem
---
{::options parse_block_html="true" /}

# {{page.title}}

In this guide we will discuss the various types of data that can be retrieved from Okta, the potential business value of this data and how to effectively interact with this data.

## What is Okta

Okta is the secure foundation for connections between people and technology. With offerings like Single Sign-on (SSO), Lifecycle Management (LCM), Adaptive Multi-Factor Authentication (MFA), Universal Directory (UD) and API Access Management, Okta is a cloud enabling platform that is paving the way for fast and wide adoption of cloud services in the enterprise. The power of Okta's core identity services are also available to software developers and integrators through our [developer platform product](http://developer.okta.com/)

## Common use cases

Using our logs, you can ingest activities flowing through Okta for the purposes of:

+ Displaying within your dashboards
  + Understanding user behavior in the cloud
  + Creating incidents or alerts based on observations

+ Using our other endpoints, you can discover additional information about users to:
  + Cross reference different identity expressions
    + Different applications referring to user with different identifiers:
      + `John Doe`
      + `Jonathan Doe`
      + `Jdoe`
      + `john.doe`
  + Identify relationships between users
  + Discover any number of user profile attributes

## What do I do now?

### Build

Build an integration using these guidelines and following the requirements below

### Get Approved

Submit a request to [Okta's partner team](mailto:bd-isv@okta.com?subject=Review my integration) to have your integration reviewed

+ Please provide the following:
  + Configuration guide
  + Datasheet
  + Technical and business contact information
  + Support escalation plan

### Market

Engage in joint go-to-market opportunities

+ potentially including:
  + Being listed on okta.com
  + Field and channel enablement
  + Referral fees
  + Joint webinars
  + Joint events

## The Solution

### How do I interact with Okta

Okta has well documented public [API endpoints], In this document, we will discuss partner integration guidance that builds on that documentation.

### Common Guidance and Requirements

<div style="border: 1px solid #626b6d; background-color: #ddf8ff; padding-left: 15px; padding-right: 15px; padding-bottom: 15px; padding-top: 15px">

#### Environment Setup

All configurations will need to provide a customer the ability to define their base URL and API key. The base URL will be used as the basis for building organization specific RESTful URLs and the API key is included in the Authorization header of requests to authenticate the interaction. The API key is to be considered extremely sensitive and controls should be put in place to protect it in the same manner that a password would be protected.

##### More on getting setup

Learn more in the following links:

+ [API Test Client]
+ [Auth Principles]

#### User-Agent

To provide for visibility into usage patterns and adoption of integrations we __require__ partners to use a distinct and agreed upon User-Agent string. Generally, this would look something like:

Example 1

>`{company}/{version}` _Example:_ **Acme/1.1**

Example 2

>`{product}/{version}` _Example:_ **SuperSIEMNexGen/2.0**

Please [work with us](mailto:bd-isv@okta.com?subject=test) to register and track the integration.

##### More on User-Agents

Learn more in the following links:

+ [User Agent]

#### Pagination

Most queries to endpoints that returns lists will require support for pagination. Support for pagination __must__ be incorporated into all development. Different endpoints will have different suggested page sizes. Please refer to the endpoint specific documentation below for that guidance.

##### More on Pagination

Learn more in the following links:

+ [Pagination]

#### Rate Limiting

+ Variable rate limits are applied to **all** requests
+ Care should be taken in all development to ensure that rate limits are observed and handled
+ Rate limits are applied at an Okta Org level
  + Queries coming from clients outside of your integration _can_ affect your integration
+ Self throttling and Error handling should be incorporated
  + Errors (`429`) are returned to calling clients when rate limits are exhausted

##### More on Rate Limiting

Learn more in the following links:

+ [Rate Limiting]

#### Intervals and Filters

To protect both parties from wasting resources we have recommended guidelines for polling intervals and default filters to apply. Please refer to the _Best Practices_ sections for each endpoint to review the guidance specific to that endpoint.

##### More on Intervals and Filters

| Endpoint | User Agent | Page Size | Interval | Delta Polling | Rate Limited | More Resources |
|:----|:----:|:----:|:----:|:----:|:----:|:----|
| [Logs](#logs) | Required | 100 | 300 | Yes | Yes *(60/Minute)* | [System Log API] |
| [Users](#users) | Required | 200 | 86400 | Yes | Yes | [Users API] |
| [Groups](#groups) | Required | 1000 | 86400 | Yes | Yes | [Groups API] |
| [Apps](#apps) | Required | 20 | 86400 | No | Yes | [Apps API] |
| [appUsers](#appusers) | Required | 20 | - | No | Yes | [appUser Object] |
| [appGroups](#appgroups) | Required | 20 | - | No | Yes | [appGroup Object] |

</div>

## Endpoint Specific Details

When interacting with Okta there are a variety of different types of data you can retrieve and interact with. This document is structured in such a way that each different data type is described individually by the endpoint (URI) that is used to interact with it.

### Logs

{% include_relative includes/analytics-logs.md %}

### Users

{% include_relative includes/analytics-users.md %}

### Groups

{% include_relative includes/analytics-groups.md %}

### Apps

{% include_relative includes/analytics-apps.md %}

### appUsers

{% include_relative includes/analytics-appUsers.md %}

### appGroups

{% include_relative includes/analytics-appGroups.md %}

## Close the Loop

### Write back to enforce policy in Okta

Building from the foundation laid in this guide

To resolve an incident or mitigate a perceived threat, an external system may want to affect a user's state, modify authentication policies or reduce application availability. This [Security Enforcement] guide will describe how and when a system might take these actions.

## Related articles

{% include_relative includes/related.md %}
