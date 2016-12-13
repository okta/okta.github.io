---
layout: docs_page
title: System Log (Beta)
---

# System Log API

> Note: This API is in Beta status. 

The Okta System Log API provides read access to your organization's system log. This API provides more functionality than the Events API.

Use this API to export event data as a batch job from your organization to another system for reporting or analysis.


## Event Operations

### List Events
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /api/v1/logs</span>

Fetch a list of events from your Okta organization system log.

##### Request Parameters
{:.api .api-request .api-request-params}


Parameter | Description                                                                         | Param Type | DataType | Required | Minimum  | Maximum | Default
--------- | ----------------------------------------------------------------------------------- | ---------- | -------- | -------- | -------    -------   -------
limit     | Specifies the number of results to page                                             | Query      | Number   | FALSE     |       0  |     100 |  
since     | Specifies the last date before the oldest result is returned                        | Query      | DateTime | TRUE     |       0  |    1000 | 
filter    | [Filter expression](/docs/api/getting_started/design_principles.html#filtering) for events | Query | String | FALSE    |
q         | Finds a user that matches firstName, lastName, and email properties                 | Query      | String   | FALSE    |
until     | Specifies the first date after which results aren't returned, can be empty which denotes no end date | Query      | DateTime | FALSE    |
after     | An opaque identifier used for pagination                                            | Query      | String   | FALSE    |

The `after` cursor should treated as an opaque value and obtained through the next link relation. See [Pagination](/docs/api/getting_started/design_principles.html#pagination).


###### Filter

The following expressions are supported for events with the `filter` query parameter (see [Filtering](http://developer.okta.com/docs/api/getting_started/design_principles.html#filtering):

Filter                                       | Description
-------------------------------------------- | ------------------------------------------------------------------------------
`eventType eq ":eventType"`                  | Events that have a specific action [eventType](#attributes)
`target.id eq ":id"`                         | Events published with a specific target id
`actor.id eq ":id"`                          | Events published with a specific target id


See [Filtering](/docs/getting_started/design_principles.html#filtering) for more information about expressions.

**Filter Examples**
Events published for a target user

    filter=target.id eq "00uxc78lMKUMVIHLTAXY"

Failed login events

    filter=action.eventType eq "core.user_auth.login_failed"

Events published for a target user and application

    filter=target.id eq "00uxc78lMKUMVIHLTAXY" and target.id eq "0oabe82gnXOFVCDUMVAK"

App SSO events for a target user and application

    filter=action.eventType eq "app.auth.sso" and target.id eq "00uxc78lMKUMVIHLTAXY" and target.id eq "0oabe82gnXOFVCDUMVAK"

Events published for a given ip address

    filter=client.ipAddress eq "184.73.186.14"

##### Query with q

> Important: The query parameter `q` behaves differently than described in  [Filtering](/docs/getting_started/design_principles.html).

The query parameter `q` searches string fields.

**Query Examples**

* Events that mention a specific city: `q=San Francisco`

* Events that mention a specific url: `q=interestingURI.com`

* Events that mention a specific person: `q=firstName lastName`

##### Response Parameters
{:.api .api-response .api-response-params}

Array of [Log objects](#log-model)

##### Request Example
{:.api .api-request .api-request-example}

> This operation requires [URL encoding](http://en.wikipedia.org/wiki/Percent-encoding). For example, `since=2016-05-25T00:00:00+00:00` is encoded as `since=2016-06-02T00%3A00%3A00%2B00%3A00`.


~~~sh
http://MyOrg.okta.com/api/v1/logs?since=2016-05-25T00:00:00+00:00&until=2016-06-01T23:59:59+00:00&limit=20&q=FAILURE
http://MyOrg.okta.com/api/v1/logs?since=2016-05-25T00:00:00+00:00&until=2016-06-01T23:59:59+00:00&limit=20&q=
http://MyOrg.okta.com/api/v1/logs?since=2016-05-25T00:00:00+00:00&until=2016-06-01T23:59:59+00:00&limit=20&filter=eventType eq "user.session.start"
http://MyOrg.okta.com/api/v1/logs?since=2016-05-25T00:00:00+00:00&until=&limit=20&filter=eventType eq "user.session.end"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[
  {
    "version": "0",
    "severity": "INFO",
    "client": {
      "zone": "OFF_NETWORK",
      "device": "Unknown",
      "userAgent": {
        "os": "Unknown",
        "browser": "UNKNOWN",
        "rawUserAgent": "UNKNOWN-DOWNLOAD"
      },
      "ipAddress": "12.97.85.90"
    },
    "actor": {
      "id": "00u1qw1mqitPHM8AJ0g7",
      "type": "User",
      "alternateId": "admin@tc1-trexcloud.com",
      "displayName": "John Fung"
    },
    "outcome": {
      "result": "SUCCESS"
    },
    "uuid": "f790999f-fe87-467a-9880-6982a583986c",
    "published": "2016-05-31T22:23:07.777Z",
    "eventType": "user.session.start",
    "displayMessage": "User login to Okta",
    "transaction": {
      "type": "WEB",
      "id": "V04Oy4ubUOc5UuG6s9DyNQAABtc"
    },
    "debugContext": {
      "debugData": {
        "requestUri": "/login/do-login"
      }
    },
    "legacyEventType": "core.user_auth.login_success",
    "authentication_context": {
      "authenticationStep": 0,
      "externalSessionId": "1013FfF-DKQSvCI4RVXChzX-w"
    }
  },
  {
    "version":"0",
    "severity":"INFO",
    "client": {
      "zone":"OFF_NETWORK",
      "device":"Unknown",
      "id":null,
      "userAgent": {
        "os":"Unknown",
        "browser":"UNKNOWN",
        "rawUserAgent":"UNKNOWN-UNKNOWN"
      },
      "ipAddress":"127.0.0.1",
      "geographicalContext":{
        "city":null,
        "state":null,
        "country":null,
        "geolocation":{
          "lat":36.12,
          "lon":-114.17
        },
        "postalCode":null
      }
    },
    "actor": {
      "id":"00ujkqmCDIS4dRtaY0g3",
      "type":"User",
      "alternateId":"administrator1@clouditude.net",
      "displayName":"Add-Min O'Cloudy Tud",
      "detailEntry":null
    },
    "outcome": {
      "result":"SUCCESS",
      "reason":null
    },"target": [
      {
        "id":"00T1pkSJOMoElZWVY0g3",
        "type":"Token",
        "alternateId":"unknown",
        "displayName":"unknown",
        "detailEntry":null
      }
    ],
    "uuid":"af4736fb-ef84-4cfb-bcfa-8f541ca99abf",
    "published":"2016-05-27T19:38:59.031Z",
    "eventType":"system.api_token.create",
    "displayMessage":"Create API token",
    "transaction": {
      "type":"WEB",
      "id":"reqz_ADxMMoTSOd7TgdnbjUXw",
      "detail":null
    },
    "debugContext": {
      "debugData": {
        "originalPrincipal": {
          "alternateId":"admin@saasure.com",
          "displayName":"Piras Add-min",
          "id":"00ujjjNmP7E3U2Rq50g3",
          "type":"User"
        },
        "requestUri":"/api/1/devtools/global/test/orgs/specific"
      }
    },
    "legacyEventType":"api.token.create",
    "authentication_context": {
      "issuer":null,
      "authenticationProvider":null,
      "credentialProvider":null,
      "credentialType":null,
      "interface":null,
      "authenticationStep":0,
      "externalSessionId":"101NN7VYcLqQ5u2Mi1lbmnEmg"
    }
  }
]
~~~

## Log Model

Every organization has a system log that maintains a history of actions performed by users.  The Log model describes a single action performed by a set of actors for a set of targets.

### Annotated Example

Use the following example by replacing the explanatory text with valid values.

~~~ html
{
"eventId": Randomly generated String, Required //note, not uuid as in underlying
"published": ISO8601 string for timestamp, Required //note, published, not timestamp as in underlying
"eventType": String, Required
"version": String, Required
"severity": String, one of DEBUG, INFO, WARN, ERROR, Required
"legacyEventType": String, Optional
"displayMessage": String, Optional
"actor": { Object, Required
     "id": String, Required
     "type": String, Required
     "alternateId": String, Optional
     "displayName": String, Optional
     "detailEntry" = {
     String -> String/Resource Map
     }
},
"client": { Object, Optional
     "userAgent": { Object, Optional
          "rawUserAgent": String, Optional
          "os": String, Optional
          "browser": String, Optional
     },
     "geographicalContext": { Object, Optional
          "geolocation": { Object, Optional
               "lat":Double, Optional
               "lon": Double, Optional
          }
          "city": String, Optional
          "state": String, Optional
          "country": String, Optional
          "postalCode": String, Optional
     },
     "zone": String, Optional
     "ipAddress": String, Optional
     "device": String, Optional
     "id": String, Optional
},
"outcome": { Object, Optional
     "result": String, one of: SUCCESS, FAILURE, SKIPPED, UNKNOWN, Required
     "reason": String, Optional
},
"target": [ List of Objects of the form:
          {
               "id": String, Required
               "type": String, Required
               "alternateId": String, Optional
               "displayName": String, Optional
               "detailEntry" = {
                    String -> String/Resource Map
               }
     }
],
"transaction": { Object, Optional
     "id": String, Optional
     "type": String one of "WEB", "JOB", Optional
     "detail" = {
          String -> String/Resource Map
     }
},
"debugContext": { Object, Optional
     "debugData": {
          String -> String/Resource Map
          "requestUri": "/api/1/devtools/global/test/orgs/specific"
          "originalPrincipal": {
               "id": "00ujchcbjpltartYI0g3",
               "type": "User",
               "alternateId": "admin@saasure.com",
               "displayName": "Piras Add-min"
          },
     }
},
"authenticationContext": { Object, Optional
     "authenticationProvider": String one of OKTA_AUTHENTICATION_PROVIDER, ACTIVE_DIRECTORY, LDAP, FEDERATION,
            SOCIAL, FACTOR_PROVIDER, Optional
          "credentialProvider": String one of OKTA_CREDENTIAL_PROVIDER, RSA, SYMANTEC, GOOGLE, DUO, YUBIKEY, Optional
          "credentialType": String one of OTP, SMS, PASSWORD, ASSERTION, IWA, EMAIL, OAUTH2, JWT, Optional
          "issuer": Object, Optional {
               "id": String, Optional
               "type": String Optional
          }
          "externalSessionId": String, Optional
          "interface": String, Optional i.e. Outlook, Office365, wsTrust
},
"securityContext": { Object, Optional
          "asNumber": Integer, Optional
          "asOrg": String, Optional
          "isp": String, Optional
          "domain": String, Optional
          "isProxy": Boolean, Optional
},
"request": { Object, Optional
          "ipChain": List of objects of the form [
              "ip": String, Optional
              "geographicalContext": { Object, Optional
                        "geolocation": { Object, Optional
                             "lat":Double, Optional
                             "lon": Double, Optional
                        }
                        "city": String, Optional
                        "state": String, Optional
                        "country": String, Optional
                        "postalCode": String, Optional
                   },
              "version": String, one of V4, V6 Optional
              "source": String, Optional
          ], Optional
}

~~~

### Attributes

The Log model is read-only. The following properties are available:

|-----------+-----------------------------------------------------------------------+----------------------------------------------------------------+----------+--------+----------+-----------+-----------+------------|
| Property  | Description                                                           | DataType                                                       | Nullable | Unique | Readonly | MinLength | MaxLength | Validation |
| -------   | --------------------------------------------------------------------- | ---------------------------------------------------------------| -------- | ------ | -------- | --------- | --------- | ---------- |
| eventId   | Unique key for event                                                  | String                                                         | FALSE    | TRUE   | TRUE     |           |           |            |
| published | Timestamp when event was published                                    | Date                                                           | FALSE    | FALSE  | TRUE     | 1         | 255       |            |
| eventType | Type of event that was published                                      | String                                                         | FALSE    | FALSE  | TRUE     | 1         | 255       |            |
| version   | versioning indicator                                                  | String                                                         | FALSE    | FALSE  | TRUE     | 1         | 255       |            |
| severity  | Indicates how severe the event is. DEBUG, INFO, WARN, ERROR           | String                                                         | FALSE    | FALSE  | TRUE     | 1         | 255       |            |
| legacyEventType | legacy event type                                               | String                                                         | TRUE     | FALSE  | TRUE     | 1         | 255       |            |
| displayMessage | display message regarding the event                              | String                                                         | TRUE     | FALSE  | TRUE     | 1         | 255       |            |
| actor     | Describes zero or more entities that performed the action             | Array of [Actor Object](#actor-object)                         | TRUE     | FALSE  | TRUE     |           |           |            |
| client    | Identifies the client that requested the action                       | [Client Object](#client-object)                                | TRUE     | FALSE  | TRUE     |           |           |            |
| outcome   | Identifies the outcome of the action                                  | [Outcome Object](#outcome-object)                              | TRUE     | FALSE  | TRUE     |           |           |            |
| target    | Identifies the targets of the action                                  | [Target Object](#target-object)                                | TRUE     | FALSE  | TRUE     |           |           |            |
| transaction   |  Identifies the transaction details of the action                 | [Transaction Object](#transaction-object)                      | TRUE     | FALSE  | TRUE     |           |           |            |
| debugContext   | Identifies the debug request data of the action                  | [DebugContext Object](#debugcontext-object)                    | TRUE     | FALSE  | TRUE     |           |           |            |
| authenticationContext | Identifies the authentication data of the action          | [AuthenticationContext Object](#authenticationcontext-object)  | TRUE     | FALSE  | TRUE     |           |           |            |
| securityContext | Identifies the security data of the action                      | [SecurityContext Object](#securitycontext-object)              | TRUE     | FALSE  | TRUE     |           |           |            |
| request   | Identifies the request data of the action                             | [Request Object](#request-object)                              | TRUE     | FALSE  | TRUE     |           |           |            |
|-----------+-----------------------------------------------------------------------+----------------------------------------------------------------+----------+--------+----------+-----------+-----------+------------|

> The actor and/or target of an event is dependent on the action performed. All events have actors. Not all events have targets.

> The `sessionId` can identify multiple requests.  A single `requestId` can identify multiple events.  Use the `sessionId` to link events and requests that occurred in the same session.

### Actor Object

Describes the actor which performs the action

|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|
| Property   | Description                                                    | DataType        | Nullable | Default | MinLength | MaxLength | Validation |
| ---------- | -------------------------------------------------------------- | --------------- | -------- | ------- | --------- | --------- | ---------- |
| id         | Id of the target                                               | String          | FALSE    |         |           |           |            |
| type       | type of the target                                             | String          | FALSE    |         |           |           |            |
| alternateId | alternative id of the target                                  | String          | TRUE     |         |           |           |            |
| displayName | Display name of the target                                    | String          | TRUE     |         |           |           |            |
| detail     | A map that goes from a String key to a value                   | Map[String->Object | TRUE  |         |           |           |            |
|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|

### Target Object

Describes the target of the action

|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|
| Property   | Description                                                    | DataType        | Nullable | Default | MinLength | MaxLength | Validation |
| ---------- | -------------------------------------------------------------- | --------------- | -------- | ------- | --------- | --------- | ---------- |
| id         | Id of the target                                               | String          | FALSE    |         |           |           |            |
| type       | type of the target                                             | String          | FALSE    |         |           |           |            |
| alternateId | alternative id of the target                                  | String          | TRUE     |         |           |           |            |
| displayName | Display name of the target                                    | String          | TRUE     |         |           |           |            |
| detail     | A map that goes from a String key to a value                   | Map[String->Object | TRUE  |         |           |           |            |
|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|

~~~ json
{
    "id": "00u3gjksoiRGRAZHLSYV",
    "displayName": "Jon Stewart",
    "alternateId": "00uKrs9rsRSAXN",
    "login": "jon@example.com",
    "type": "User"
}
~~~


### Client Object

Describes the client performing the action

|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|
| Property   | Description                                                    | DataType        | Nullable | Default | MinLength | MaxLength | Validation |
| ---------- | -------------------------------------------------------------- | --------------- | -------- | ------- | --------- | --------- | ---------- |
| userAgent  | Id of the target                                               | String          | TRUE     |         |           |           |            |
| geographicalContext | Geographical context data of the event                | [GeographicalContext Object](#geographicalcontext-object) | TRUE | |           |           |            |
| zone       | zone client is in                                              | String          | TRUE     |         |           |           |            |
| ipAddress  | Ip address of the client                                       | String          | TRUE     |         |           |           |            |
| device     | Device that the client was using                               | String          | TRUE     |         |           |           |            |
| id         | id of the client                                               | String          | TRUE     |         |           |           |            |
|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|

### GeographicalContext Object

Describes the location data regarding where the action was performed

|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|
| Property   | Description                                                    | DataType        | Nullable | Default | MinLength | MaxLength | Validation |
| ---------- | -------------------------------------------------------------- | --------------- | -------- | ------- | --------- | --------- | ---------- |
| geolocation | geolocation of the target                                     | [Geolocation Object](#geolocation-object) | TRUE |        |           |           |            |
| city       | city of the event                                              | String          | TRUE     |         |           |           |            |
| state      | zone client is in                                              | String          | TRUE     |         |           |           |            |
| country    | country of the client                                          | String          | TRUE     |         |           |           |            |
| postalCode | Device that the client was using                               | String          | TRUE     |         |           |           |            |
|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|

### Geolocation Object

Describes transaction data an event

|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|
| Property   | Description                                                    | DataType        | Nullable | Default | MinLength | MaxLength | Validation |
| ---------- | -------------------------------------------------------------- | --------------- | -------- | ------- | --------- | --------- | ---------- |
| lat        | latitude                                                       | Double          | FALSE    |         |           |           |            |
| lon        | longitude                                                      | Double          | FALSE    |         |           |           |            |
|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|


### Outcome Object

Describes transaction data an event

|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|
| Property   | Description                                                    | DataType        | Nullable | Default | MinLength | MaxLength | Validation |
| ---------- | -------------------------------------------------------------- | --------------- | -------- | ------- | --------- | --------- | ---------- |
| result     | Result of the action. SUCCESS, FAILURE, SKIPPED, UNKNOWN       | String          | FALSE    |         |           |           |            |
| reason     | Type of transaction, "WEB" or "JOB"                            | String          | TRUE     |         | 1         | 255       |            |
|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|

### Transaction Object

Describes transaction data an event

|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|
| Property   | Description                                                    | DataType        | Nullable | Default | MinLength | MaxLength | Validation |
| ---------- | -------------------------------------------------------------- | --------------- | -------- | ------- | --------- | --------- | ---------- |
| id         | Id of the transaction Object                                   | String          | TRUE     |         |           |           |            |
| type       | Type of transaction, "WEB" or "JOB"                            | String          | TRUE     |         |           |           |            |
| detail     | A map that goes from a String key to a value                   | Map[String->Object | TRUE  |         |           |           |            |
|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|

### DebugContext Object

Describes additional context regarding the event

|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|
| Property   | Description                                                    | DataType        | Nullable | Default | MinLength | MaxLength | Validation |
| ---------- | -------------------------------------------------------------- | --------------- | -------- | ------- | --------- | --------- | ---------- |
| debugData  | A map that goes from a String key to a value                   | Map[String->Object | TRUE  |         |           |           |            |
|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|

### AuthenticationContext Object

Describes authentication data regarding an event

|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|
| Property   | Description                                                    | DataType        | Nullable | Default | MinLength | MaxLength | Validation |
| ---------- | -------------------------------------------------------------- | --------------- | -------- | ------- | --------- | --------- | ---------- |
| authenticationProvider | OKTA_AUTHENTICATION_PROVIDER, ACTIVE_DIRECTORY, LDAP, FEDERATION, SOCIAL, FACTOR_PROVIDER | String | TRUE  | | | |            |
| credentialProvider | OKTA_CREDENTIAL_PROVIDER, RSA, SYMANTEC, GOOGLE, DUO, YUBIKEY | Array of String | TRUE  |     |           |           |            |
| credentialType | type of credential OTP, SMS, PASSWORD, ASSERTION, IWA, EMAIL | String        | TRUE     |         |           |           |            |
| issuer     | Uri of the request that generated the event.                   | [Issuer Object](#issuer-object) | TRUE     |         |           |           |            |
| externalSessionId | Uri of the request that generated the event.            | String          | TRUE     |         | 1         | 255       |            |
| interface  | Uri of the request that generated the event.                   | String          | TRUE     |         | 1         | 255       |            |
|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|

### Issuer Object

Describes an issuer in the authentication context

|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|
| Property   | Description                                                    | DataType        | Nullable | Default | MinLength | MaxLength | Validation |
| ---------- | -------------------------------------------------------------- | --------------- | -------- | ------- | --------- | --------- | ---------- |
| id         | An id for the issuer                                           | String          | TRUE     |         |           |           |            |
| type       | The type of the issuer                                         | Array of String | TRUE     |         |           |           |            |
|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|

### SecurityContext Object

Describes security data regarding an event

|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|
| Property   | Description                                                    | DataType        | Nullable | Default | MinLength | MaxLength | Validation |
| ---------- | -------------------------------------------------------------- | --------------- | -------- | ------- | --------- | --------- | ---------- |
| asNumber   | AS Number                                                      | Integer         | TRUE     |         |           |           |            |
| asOrg      | AS Organization                                                | String          | TRUE     |         |           |           |            |
| isp        | Internet Service Provider                                      | String          | TRUE     |         |           |           |            |
| domain     | domain                                                         | String          | TRUE     |         |           |           |            |
| isProxy    | if event is from a known proxy                                 | Bool            | TRUE     |         |           |           |            |
|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|

### Request Object

Describes request data regarding an event

|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|
| Property   | Description                                                    | DataType        | Nullable | Default | MinLength | MaxLength | Validation |
| ---------- | -------------------------------------------------------------- | --------------- | -------- | ------- | --------- | --------- | ---------- |
| ipChain    | chain of ip data                                               | Array of IpAddress | TRUE  |         |           |           |            |
|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|

### SecurityContext Object

Describes security data regarding an event

|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|
| Property   | Description                                                    | DataType        | Nullable | Default | MinLength | MaxLength | Validation |
| ---------- | -------------------------------------------------------------- | --------------- | -------- | ------- | --------- | --------- | ---------- |
| ip         | ip address                                                     | String          | TRUE     |         |           |           |            |
| geographicalContext | Geographical context of the ip address                | [GeographicalContext Object](#geographicalcontext-object)          | TRUE     |         |           |           |            |
| version    | ip address version                                             | V4 or V6        | TRUE     |         |           |           |            |
| source     | details regarding the source                                   | String          | TRUE     |         |           |           |            |
|------------+----------------------------------------------------------------+-----------------+----------+---------+-----------+-----------+------------|
