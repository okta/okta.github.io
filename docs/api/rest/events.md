---
layout: docs_page
title: Events
---

* Will be replaced with the ToC
{:toc .list-unstyled .toc}

## Overview

The Okta Event API provides read access to your organization's system log. The API is intended to export event data as a batch job from your organization to another system for reporting or analysis.

## Event Model

Every organization has a system log that maintains a history of actions performed by users.  The Event model describes a single action that was performed by a set of actors for a set of targets.

### Example

~~~ json
{
   "eventId":"tevGr2BhQTMR72OiBGvKXTp2Q1399593071000",
   "published":"2014-05-08T23:51:11.000Z",
   "requestId":"req8U_MHmEbSai_0I4RopTnfA",
   "sessionId":"000cWiYg47QSFyk1YjE6cDcEg",
   "action":{
      "message":"Okta user created",
      "categories":[
         "User Creation"
      ],
      "objectType":"core.user.config.user_creation.success",
      "requestUri":"Background"
   },
   "actors":[
      {
         "id":"00ue1aWYUCUFFKXLXELW",
         "displayName":"Add-Min O'Cloudy Tud",
         "login":"administrator1@clouditude.net",
         "objectType":"User"
      },
      {
         "id":"Jakarta Commons-HttpClient/3.1",
         "displayName":"UNKNOWN",
         "ipAddress":"",
         "objectType":"Client"
      }
   ],
   "targets":[
      {
         "id":"00ue1gAKBMCSWHRZYDJS",
         "displayName":"Inca-Louise O'Rain Dum",
         "login":"inca@clouditude.net",
         "objectType":"User"
      }
   ]
   
}
~~~

### Attributes

The Event model is a ***read-only*** object and has a fixed set of attributes:

Attribute | Description | DataType | Nullable
---- | --- | --- | ---
eventId | Unique key for event | String | FALSE
published | Timestamp when event was published | Date | TRUE
requestId | Identifies the request | String | TRUE
sessionId | Session in which the event occurred | String | TRUE
action | Identifies the action that the event describes | [Action Object](#action-object) | FALSE
actors | Describes zero or more entities that performed the action | Array of [Actor Object](#actor-object) | TRUE
targets | Describes zero or more entities that the action was performed against | Array of [Target Object](#target-object) | TRUE

> The actor and/or target of an event is dependent on the action performed. Not all events have an actor or target.

> A single requestID can identify multiple events.

> The sessionID can identify multiple requests. Use the sessionID to link events and requests that occurred in the same session.


### Action Object

Describes an activity that published an event

Attribute | Description | DataType | Nullable
--- | --- | --- | ---
message | Description of an action | String | FALSE
categories | [Categories](#action-categories) for an action | Array of String | FALSE
objectType | Identifies the [unique type](#action-objecttypes) of an action | String | FALSE
requestUri | Uri of the request that generated the event. | String | TRUE

> Actions that do not define any categories will have an zero element array value.

~~~  json
{
    "message": "User performed single sign on to app",
    "categories": [
        "Application Access"
    ],
    "objectType": "app.auth.sso",
    "requestUri": "/app/salesforce/kdx9PWYBPEOBAUNVRBHK/sso/saml"
}
~~~

#### Action Categories

Categories for an action:

* Application Assignment
* Application Access
* Active Directory Agent
* User Creation
* User Activation
* User Deactivation
* User Locked Out
* Sign-in Failure
* Sign-in Success
* Suspicious Activity
* Application Imports (Summary)
* Application Imports (Detailed)
* SMS Messages

> Additional categories may be added in the future without versioning

### Actor Object

Actor of an event

Attribute | Description | DataType | Nullable
--- | --- | --- | ---
id | Unique key for actor| String | FALSE
displayName | Name of actor used for display purposes | String | FALSE
objectType | [User](#user-objecttype) or [Client](#client-objecttype)  | String | FALSE

> The schema of an actor is dependent on the actor's `objectType`

### Target Object

Target of an event

Attribute | Description | DataType | Nullable
--- | --- | --- | ---
id | Unique key for target| String | FALSE
displayName | Name of target used for display purposes | String | FALSE
objectType | [User](#user-objecttype) or [AppInstance](#appinstance-objecttype) | String | FALSE

> The schema of a target is dependent on the actor's `objectType`

### Actor/Target ObjectTypes

#### User ObjectType

A denormalized reference to a [User](users.html#user-model).

Attribute | Description | DataType | Nullable
--- | --- | --- | ---
id | Unique key for [user](users.html#user-model) | String | FALSE
objectType | User | String | FALSE
displayName | [User's](users.html#profile-object) first and last name | String | FALSE
login | Unique login for [user](users.html#user-model) | String | FALSE

~~~ json
{
    "id": "00u3gjksoiRGRAZHLSYV",
    "displayName": "Jon Stewart",
    "login": "user@example.org",
    "objectType": "User"
}
~~~

> The user can be retrieved by `id` with the [User API](users.html#get-user-with-id).

#### AppInstance ObjectType

A denormalized reference to an application

Attribute | Description | DataType | Nullable
--- | --- | --- | ---
id | Unique key for application | String | FALSE
objectType | AppInstance | String | FALSE
displayName | Label of application | String | FALSE

~~~ json
{
    "id": "0oab5cZEHFHXHGRNRRNL",
    "displayName": "Zendesk",
    "objectType": "AppInstance"
}
~~~

> The app can be retrieved by `id` with the [Apps API](apps.html#get-application).

#### Client ObjectType

A denormalized reference to a client such as a browser

Attribute | Description | DataType | Nullable
--- | --- | --- | ---
id | User agent of client | String | FALSE
objectType | Client | String | FALSE
displayName | Name of client | String | FALSE
ipAddress | IP Address of client | String | TRUE


~~~ json
{
    "id": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.65 Safari/537.36",
    "displayName": "CHROME",
    "ipAddress": "127.0.0.1",
    "objectType": "Client"
}
~~~

## Event Operations

### List Events
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /events</span>

Fetch a list of events from your Okta organization system log

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                                                         | Param Type | DataType | Required | Default
--------- | ----------------------------------------------------------------------------------- | ---------- | -------- | -------- | -------
limit     | Specifies the number of results to page                                             | Query      | Number   | FALSE    | 1000
startDate | Specifies the timestamp to list events after                                        | Query      | Date     | FALSE    |
filter    | [Filter expression](/docs/getting_started/design_principles.html#filtering) for events | Query      | String   | FALSE    |
after     | Specifies the pagination cursor for the next page of events                         | Query      | String   | FALSE    |

> The `after` cursor should treated as an opaque value and obtained through the next link relation. See [Pagination](/docs/getting_started/design_principles.html#pagination)

> `startDate` and `filter` query parameters are mutually exclusive and cannot be used together in the same request

###### Filters

The following expressions are supported for events with the `filter` query parameter:

Filter                                       | Description
-------------------------------------------- | ------------------------------------------------------------------------------
`action.objectType eq ":actionType"`         | Events that have a specific [action objectType](#action-objectypes)
`target.objectType eq ":objectType"`         | Events published with a specific [target objectType](#actortarget-objecttypes)
`target.id eq ":id"`                         | Events published with a specific target id
`published lt "yyyy-MM-dd'T'HH:mm:ss.SSSZZ"` | Events published before a specific datetime
`published eq "yyyy-MM-dd'T'HH:mm:ss.SSSZZ"` | Events published updated at a specific datetime
`published gt "yyyy-MM-dd'T'HH:mm:ss.SSSZZ"` | Events published updated after a specific datetime

See [Filtering](/docs/getting_started/design_principles.html#filtering) for more information on expressions

> All filters must be [URL encoded](http://en.wikipedia.org/wiki/Percent-encoding) where `filter=published gt "2013-06-01T00:00:00.000Z"` is encoded as `filter=published%20gt%20%222013-06-01T00:00:00.000Z%22`

**Filter Examples**

Events published after 06/01/2013

    filter=published gt "2013-06-01T00:00:00.000Z"

Events published for a target user

    filter=target.id eq "00uxc78lMKUMVIHLTAXY"

Failed login events published after 06/01/2013

    filter=published gt "2013-06-01T00:00:00.000Z" and action.objectType eq "core.user_auth.login_failed"

Events published after 06/01/2013 for a target user and application

    filter=published gt "2013-06-01T00:00:00.000Z" and target.id eq "00uxc78lMKUMVIHLTAXY" and target.id eq "0oabe82gnXOFVCDUMVAK"

App SSO events for a target user and application

    filter=action.objectType eq "app.auth.sso" and target.id eq "00uxc78lMKUMVIHLTAXY" and target.id eq "0oabe82gnXOFVCDUMVAK"


##### Response Parameters
{:.api .api-response .api-response-params}

Array of [Events](#event-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization:SSWS yourtoken" \
-H "Accept:application/json" \
-H "Content-type:application/json" \
-X GET https://your-domain.okta.com/api/v1/events?startDate=2013-07-15T16%3A00%3A00.000Z\&limit=3
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ ruby
HTTP/1.1 200 OK
Content-Type: application/json
Link: <https://your-domain.okta.com/api/v1/events?startDate=2013-07-15T16%3A00%3A00.000Z&limit=3>; rel="self"
Link: <https://your-domain.okta.com/api/v1/events?after=tevZxTo4IyHR9yUHIFdU0-f0w1373905100000&limit=3>; rel="next"

[
    {
        "eventId": "tev8hc_KK9NRzKe2WtdvVQIOg1384845263000",
        "published": "2013-11-19T07:14:23.000Z",
        "action": {
            "message": "App activated",
            "categories": [],
            "objectType": "app.generic.config.app_activated",
            "requestUri": "/api/v1/apps/0oadxaKUTKAXSXUZYJHC/lifecycle/activate"
        },
        "actors": [
            {
                "id": "00upgyMVOKIYORVNYUUM",
                "displayName": "Adam Malkovich",
                "login": "adam.malkovich@example.com",
                "objectType": "User"
            },
            {
                "id": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.57 Safari/537.36",
                "displayName": "CHROME",
                "ipAddress": "192.168.1.100",
                "objectType": "Client"
            }
        ],
        "targets": [
            {
                "id": "0oadxaKUTKAXSXUZYJHC",
                "displayName": "Salesforce.com",
                "objectType": "AppInstance"
            }
        ]
    },
    {
        "eventId": "tevaEByjeq-QZW-utKgDVVvng1384847185000",
        "published": "2013-11-19T07:46:25.000Z",
        "action": {
            "message": "Sign-in successful",
            "categories": [
                "Sign-in Success"
            ],
            "objectType": "core.user_auth.login_success",
            "requestUri": "/login/do-login"
        },
        "actors": [
            {
                "id": "00ubgaSARVOQDIOXMORI",
                "displayName": "Samus Aran",
                "login": "samus.aran@example.com",
                "objectType": "User"
            },
            {
                "id": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.57 Safari/537.36",
                "displayName": "CHROME",
                "ipAddress": "10.10.10.10",
                "objectType": "Client"
            }
        ],
        "targets": [
            {
                "id": "00ubgaSARVOQDIOXMORI",
                "displayName": "Samus Aran",
                "login": "samus.aran@example.com",
                "objectType": "User"
            }
        ]
    },
    {
        "eventId": "tevR26HuMJMSkWsKBUcQ65Raw1384847190000",
        "published": "2013-11-19T07:46:30.000Z",
        "action": {
            "message": "User performed single sign on to app",
            "categories": [
                "Application Access"
            ],
            "objectType": "app.auth.sso",
            "requestUri": "/app/salesforce/kdx9PWYBPEOBAUNVRBHK/sso/saml"
        },
        "actors": [
            {
                "id": "00ubgaSARVOQDIOXMORI",
                "displayName": "Samus Aran",
                "login": "samus.aran@example.com",
                "objectType": "User"
            },
            {
                "id": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.57 Safari/537.36",
                "displayName": "CHROME",
                "ipAddress": "10.10.10.10",
                "objectType": "Client"
            }
        ],
        "targets": [
            {
                "id": "00ubgaSARVOQDIOXMORI",
                "displayName": "Samus Aran",
                "login": "samus.aran@example.com",
                "objectType": "User"
            },
            {
                "id": "0oadxaKUTKAXSXUZYJHC",
                "displayName": "Salesforce.com",
                "objectType": "AppInstance"
            }
        ]
    }
]
~~~

## Event ObjectTypes

An event `objectType` identifies the unique action performed.

{% include event_list.md %}