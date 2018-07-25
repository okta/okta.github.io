---
layout: docs_page
title: ISV Syslog References
weight: 2
excerpt: References for ISV consideration when integrating with our Syslog (`/logs`) API
---
# {{page.title}}

{{page.excerpt}}

## eventType Namespace

The log eventType property is a hierarchical string representing a consistent parent.sublevel.action structure that allows for flexible queries and human readability.

Examples of this in action

+ Using SCIM filter syntax Searching for `eventType co ".create"`
  + return creation events for all object types
+ Using SCIM filter syntax Searching for `eventType sw "user.authentication."`
  + return all activities relating to user authentication.

Similar or more powerful queries can be performed when ingesting date into external systems.

Learn more about [filtering here](/docs/api/getting_started/design_principles#filtering)

## Event Stitching

Use the following to track events over time and across activities.

Throughout a session many requests can occur, and within a given request many events may be logged.

To illustrate this principle, the table below shows

+ 18 events
  + reduced to
+ 13 transactions
  + tied back to
+ 6 different sessions
  + pinned to 1 user

{% img eventStitchingConcept.png alt:"Event Stitching Concept" %}

With the log object the following mappings apply

| | Log Data Model Location | Description |
|:----|:----|:----|
| session | authenticationContext.externalSessionId| External Session identifier of the request |
| transaction | transaction.id | ID of the transaction object |
| event | uuid | Randomly Generated Unique Identifier for event |

## Event API to System Log API

Use the following table for reference when moving from the Events API to the System Log API

| Event Property | Log Property |
|:----|:----|
| `event.eventId` | `log.uuid` |
| `event.sessionId` | `log.authenticationContext.externalSessionId` |
| `event.requestId` | `log.transaction.id` |
| `event.published` | `log.published` |
| `event.action.message` | `log.displayMessage` |
| `event.action.categories[0]` | n/a, `log.severity` and `log.outcome` contain similar |
| `event.action.categories[1]` | n/a, `log.severity` and `log.outcome` contain similar |
| `event.action.objectType` | `log.legacyEventType` |
| `event.action.requestUri` | `log.debugContext.debugData.requestUri` |
| `event.actors[0].id` | `log.client.userAgent.rawUserAgent` |
| `event.actors[0].displayName` | `log.client.userAgent.browser` |
| `event.actors[0].ipAddress` | `log.client.ipAddress` |
| `event.actors[0].objectType` | `log.client.device` |
| `event.targets[0].id` | `log.actor.id` |
| `event.targets[0].displayName` | `log.actor.displayName` |
| `event.targets[0].login` | `log.actor.alternateId` |
| `event.targets[0].objectType` | `log.actor.type` |

## Common Successful Events

This table contains the eventType, message and Percentage times the event appeared in our corpus of data.  Use this table as a starting point to get to understand Okta's events better.

| eventType | displayMessage |
|:----|:----|
| application.user_membership.add | Add user to application membership |
| user.authentication.sso | User single sign on to app |
| application.user_membership.remove | Remove users application membership |
| user.session.start | User login to Okta |
| application.provision.user.push_profile | Push users profile to external application |
| app.user_management | Successfully imported new member to an app group |
| application.provision.user.sync | Sync user in external application |
| application.user_membership.update | Updated user application property |
| system.agent.ad.realtimesync | Perform RealTimeSync by AD agent |
| user.authentication.auth_via_AD_agent | Authenticate user with AD agent |
| user.session.access_admin_app | User accessing Okta administrator app |
| group.user_membership.add | Add user to group membership |
| application.provision.user.push | Push new user to external application |
| user.account.update_profile | Update user profile for Okta |
| user.session.end | User logout from Okta |
| application.lifecycle.update | Update application |
| application.provision.user.verify_exists | Verify user exists in external application |
| user.authentication.auth_via_mfa | Authentication of user via MFA |

## Common Failure Events

This table contains the eventType, message and Percentage times the event appeared in our corpus of data.  Use this table as a starting point to get to understand Okta's events better.

| eventType | displayMessage |
|:----|:----|
| user.session.start | User login to Okta |
| system.agent.ad.realtimesync | Perform RealTimeSync by AD agent |
| user.authentication.auth_via_AD_agent | Authenticate user with AD agent |
| user.authentication.auth_via_radius | Authentication of user via Radius |
| user.account.reset_password | User reset password for Okta (by admin) |
| app.generic.unauth_app_access_attempt | User attempted unauthorized access to app |
| system.agent.ad.connect | Connect AD agent to Okta |
| user.authentication.auth_via_mfa | Authentication of user via MFA |
| system.agent.ad.reset_user_password | Perform user password reset by AD agent |
| application.provision.user.push_profile | Push users profile to external application |
| system.agent.ad.invoke_dir | Perform directory invoke command by AD agent |
| application.provision.user.sync | Sync user in external application |
| app.oauth2.as.authorize | OAuth2 authorization request |
| app.oauth2.authorize | OIDC authorization request |
| user.lifecycle.create | Create okta user |
| user.authentication.auth_via_IDP | Authenticate user via IDP |
| application.provision.integration.call_api | Application integration API called |
| system.agent.ad.write_ldap | Perform LDAP write by AD agent |
| app.oauth2.authorize.invalid_client_id | OIDC authorization request |
| app.oauth2.authorize.user_not_assigned | OIDC authorization request |
| system.agent.ad.read_ldap | Perform LDAP read by AD agent |
| system.agent.ad.read_toplogy | (blank) |
| user.account.lock | Max sign in attempts exceeded |
| user.account.update_password | User update password for Okta |

## Other notable events

Events for failed authentication attempts and failed multifactor verification attempts are potential indicators of abuse. Additional context provided in the log will allow for pivoting this information based on things like Target User, Client IP address, Geography, User-Agent and more.

Below are truncated examples of specific logs to illustrate the log object structure and the data it contains.\\
In these examples, we will use the following semantics:

+ An Okta compatible filter that would return the example event will be included
+ An ellipsis ("...") is used to signify truncated data
+ Object properties will be referenced using Dot notation

### Authentication Failure

Request
{:.api .api-request .api-request-example}

```sh
POST https://{yourOktaDomain}/api/v1/logs?filter=(eventType eq "user.session.start" AND outcome.result eq "FAILURE")
```

Response
{:.api .api-response .api-response-example}

~~~json
{
 "uuid": "91c25327-2d83-46d8-8e25-5ef7d9c615db",
 "published": "2017-04-12T18:56:31.884Z",
 "eventType": "user.session.start",
 "displayMessage": "User login to Okta",
 "severity": "WARN",
 "version": "0",
 "outcome": {"result": "FAILURE", "reason": "INVALID_CREDENTIALS"},
 "actor": {"id": "00u1785fc892YN6Tb1d8", "type": "User",
           "alternateId": "some.user@oktaprise.com",
           "displayName": "Some User", "detailEntry": null
          },
 "client": {"userAgent": {"rawUserAgent": "Mozilla/5.0 ...", "...": "..."},
            "ipAddress": "208.223.254.2", "geographicalContext": {"...": "..."},
            "...": "..."
           },
 "authenticationContext": {"externalSessionId": "unknown", "...": "..."},
 "securityContext": {"...": "..."},
 "debugContext": {"debugData": {"requestUri": "/auth/saml20/0oazgLZgct51d8"}},
 "transaction": {"type": "WEB", "id": "WO54X5uSLmaaPH7DtL7wAAzY", "detail": null},
 "request": {"ipChain": [{"...": "..."}]},
 "target": null
}
~~~

>`authenticationContext.externalSessionId` is only populated on a successful login

From here you can easily start to pivot off the various pieces of information contained.

+ Is this an isolated event for the user (`actor.id`)?
+ Are we seeing this same client (`client.ipAddress`) fail for many users?
+ Are we seeing morphing client details (`client.*`) for a single user?

### Application Sign on

Request
{:.api .api-request .api-request-example}

```sh
POST https://{yourOktaDomain}/api/v1/logs?filter=(eventType eq "user.authentication.sso" AND outcome.result eq "SUCCESS")
```

Response
{:.api .api-response .api-response-example}

~~~json
{
 "uuid": "fdbfe325-dcbb-4380-a778-eb85d0a2c182",
 "published": "2017-04-12T20:55:53.515Z",
 "eventType": "user.authentication.sso",
 "displayMessage": "User single sign on to app",
 "severity": "INFO",
 "version": "0",
 "outcome": {"result": "SUCCESS", "reason": null},
 "actor": {"id": "00u1ae58uup0y5Qkg1d8", "type": "User", 
 "alternateId": "some.user@oktaprise.com", "displayName": "Some User",
 "detailEntry": null},
 "client": {"...": "...", "ipAddress": "208.223.254.3"},
 "authenticationContext": {"...": "...", "externalSessionId": "102-EXKTC7eQGeB2NoV7pdHmw"},
 "securityContext": {"...": "..."},
 "debugContext": {"debugData": {"initiationType": "IDP_INITIATED", "...": "..."}},
 "transaction": {"type": "WEB", "id": "WO6UWSeI@4LKXKr0eDMlWQAAA84", "detail": {}},
 "request": {"ipChain": [{"...": "..."}]},
 "target": [
   {"id": "0oa1a35nndfI7w1yp1d8", "type": "AppInstance",
    "alternateId": "Workplace by Facebook", "...": "...", "detailEntry": {"signOnModeType": "SAML_2_0"}
   },
   {"id": "0ua1ae5gw9d37jzgJ1d8", "type": "AppUser", "alternateId": "suser@newoktaprise.com",
    "displayName": "Some User", "detailEntry": null
   }
  ]
}
~~~

> A successful IdP-initiated Sign On into an app called "Workplace by Facebook":

Note the `target[1].alternateId` is different than the `actor.alternateId`

+ Is the username in the downstream system
+ Is this privilege abuse

Pivoting and linking other logs with the same `authenticationContext.externalSessionId` can provide:

+ Context about how and when the user was initially authenticated
+ Insight into potential client roaming
+ Insight into other applications used during the same session

Over time you can paint a rich picture of user and endpoint behavior on and off your network.

### Notable and less obvious events

Some less obvious events to utilize are listed here:

+ User state changes (`eventType sw "user.lifecycle."`)
+ Group membership changes (`eventType sw "group.user_membership."`)
+ Directory agent events (`eventType sw "system.agent."`)
+ Application provisioning events (`eventType sw "application.provision."`)
+ Application username changes (`eventType eq "application.user_membership.change_username"`)
+ Password Reset events (`eventType eq "user.account.reset_password"`)
  + An eventType of
    + `system.email.password_reset.sent_message` or
    + `system.sms.send_password_reset_message`
  + Without a subsequent
    + `user.account.reset_password` for that user is an indicator of an abandoned password reset attempt and potential abuse
+ MFA lifecycle events (`eventType sw "user.mfa.factor."`)

Tracking activities like these and others can identify both operational and security risks.

## All events

Coming soon

## Related articles

{% include_relative includes/related.md %}
