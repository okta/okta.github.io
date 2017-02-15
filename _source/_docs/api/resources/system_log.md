---
layout: docs_page
title: System Log (Beta)
---

# System Log API

This API is a {% api_lifecycle beta %} feature.

The Okta System Log API provides read access to your organization's system log. This API provides more functionality than the Events API:

* The System Log API supports more query parameters than the Events API.
* The System Log API returns more objects than the Events API.

Use this API to export event data as a batch job from your organization to another system for reporting or analysis.

## Event Operations

### List Events
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /api/v1/logs</span>

Fetch a list of events from your Okta organization system log.

##### Request Parameters
{:.api .api-request .api-request-params}

|---------- + ------------------------------------------------------------------------------------+------------+----------+----------+----------+---------|
| Parameter | Description                                                                         | Param Type | DataType | Required | Minimum  | Maximum |
| --------- | ----------------------------------------------------------------------------------- | ---------- | -------- | -------- | -------- | --------|
| limit     | Specifies the number of results to page                                             | Query      | Number   | FALSE    |       0  |     100 |
| since     | Specifies the last date before the oldest result is returned                        | Query      | DateTime | TRUE     |       0  |    1000 |
| filter    | [Filter expression](/docs/api/getting_started/design_principles.html#filtering) for events | Query | String | FALSE    |          |          |
| q         | Finds a user that matches firstName, lastName, and email properties                 | Query      | String   | FALSE    |          |          |
| until     | Specifies the first date after which results aren't returned, can be empty which denotes no end date | Query      | DateTime | FALSE    |          |          |
| after     | An opaque identifier used for pagination                                            | Query      | String   | FALSE    |          |          |
|-----------+-------------------------------------------------------------------------------------+------------+----------+----------+----------+----------|

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

|-----------+-----------------------------------------------------------------------+----------------------------------------------------------------+----------+--------+----------+-----------+-----------|
| Property  | Description                                                           | DataType                                                       | Nullable | Unique | Readonly | MinLength | MaxLength |
| -------   | --------------------------------------------------------------------- | ---------------------------------------------------------------| -------- | ------ | -------- | --------- | --------- |
| eventId   | Unique key for an event                                               | String                                                         | FALSE    | TRUE   | TRUE     |           |           |
| published | Timestamp when event was published                                    | Date                                                           | FALSE    | FALSE  | TRUE     | 1         | 255       |
| eventType | Type of event that was published                                      | String                                                         | FALSE    | FALSE  | TRUE     | 1         | 255       |
| version   | Versioning indicator                                                  | String                                                         | FALSE    | FALSE  | TRUE     | 1         | 255       |
| severity  | Indicates how severe the event is: `DEBUG`, `INFO`, `WARN`, `ERROR`   | String                                                         | FALSE    | FALSE  | TRUE     | 1         | 255       |
| legacyEventType | Legacy event type                                               | String                                                         | TRUE     | FALSE  | TRUE     | 1         | 255       |
| displayMessage | The display message for an event                                 | String                                                         | TRUE     | FALSE  | TRUE     | 1         | 255       |
| actor     | Describes zero or more entities that performed an action              | Array of [Actor Object](#actor-object)                         | TRUE     | FALSE  | TRUE     |           |           |
| client    | Identifies the client that requested an action                        | [Client Object](#client-object)                                | TRUE     | FALSE  | TRUE     |           |           |
| outcome   | Identifies the outcome of an action                                   | [Outcome Object](#outcome-object)                              | TRUE     | FALSE  | TRUE     |           |           |
| target    | Identifies the targets of an action                                   | [Target Object](#target-object)                                | TRUE     | FALSE  | TRUE     |           |           |
| transaction   |  Identifies the transaction details of an action                  | [Transaction Object](#transaction-object)                      | TRUE     | FALSE  | TRUE     |           |           |
| debugContext   | Identifies the debug request data of sn action                   | [DebugContext Object](#debugcontext-object)                    | TRUE     | FALSE  | TRUE     |           |           |
| authenticationContext | Identifies the authentication data of an action           | [AuthenticationContext Object](#authenticationcontext-object)  | TRUE     | FALSE  | TRUE     |           |           |
| securityContext | Identifies the security data of an action                       | [SecurityContext Object](#securitycontext-object)              | TRUE     | FALSE  | TRUE     |           |           |
| request   | Identifies the request data of an action                              | [Request Object](#request-object)                              | TRUE     | FALSE  | TRUE     |           |           |
|-----------+-----------------------------------------------------------------------+----------------------------------------------------------------+----------+--------+----------+-----------+-----------|

> The actor and/or target of an event is dependent on the action performed. All events have actors. Not all events have targets.

> The `sessionId` can identify multiple requests.  A single `requestId` can identify multiple events.  Use the `sessionId` to link events and requests that occurred in the same session.

### Actor Object

Describes the user, app, client, or other entity (actor) who performed an action on a target

|-------------+-----------------------------------------------+-------------------+----------|
| Property    | Description                                   | DataType          | Nullable |
| ----------- | ----------------------------------------------| ----------------- | -------- |
| id          | ID of an actor                                | String            | FALSE    |
| type        | Type of an actor                              | String            | FALSE    |
| alternateId | Alternative ID of an actor                    | String            | TRUE     |
| displayName | Display name of an actor                      | String            | TRUE     |
| detail      | Details about an actor                        | Map[String->Object| TRUE     |
|-------------+-----------------------------------------------+-------------------+----------|

### Target Object

The entity upon which an actor performs an action. Targets may be anything: an app user, a login token or anything else.

|-------------+--------------------------------------------------------------+-----------------+----------|
| Property    | Description                                                  | DataType        | Nullable |
| ----------- | ------------------------------------------------------------ | --------------- | -------- |
| id          | ID of a target                                               | String          | FALSE    |
| type        | Type of a target                                             | String          | FALSE    |
| alternateId | alternative id of a target                                   | String          | TRUE     |
| displayName | Display name of a target                                     | String          | TRUE     |
| detail      | Details about the target                                     | Map[String->Object | TRUE  |
|-------------+--------------------------------------------------------------+-----------------+----------|

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

Describes the browser or other client the actor used to perform an action on a target

|------------+--------------------------------------------------------------+-----------------+----------|
| Property   | Description                                                  | DataType        | Nullable |
| ---------- | ------------------------------------------------------------ | --------------- | -------- |
| userAgent  | ID of the client used by an actor to perform an action       | String          | TRUE     |
| geographicalContext | Geographical context data of the event              | [GeographicalContext Object](#geographicalcontext-object) | TRUE |
| zone       | Zone where the client is located                             | String          | TRUE     |
| ipAddress  | Ip address of the client                                     | String          | TRUE     |
| device     | Device that the client operated from                         | String          | TRUE     |
| id         | ID of the client                                             | String          | TRUE     |
|------------+--------------------------------------------------------------+-----------------+----------|

### GeographicalContext Object

Describes the location of the target that the action was performed on

|------------+----------------------------------------------------------------+-----------------+----------|
| Property   | Description                                                    | DataType        | Nullable |
| ---------- | -------------------------------------------------------------- | --------------- | -------- |
| geolocation | Geolocation of the target                                     | [Geolocation Object](#geolocation-object) | TRUE |
| city       | City of the event                                              | String          | TRUE     |
| state      | Zone client is in                                              | String          | TRUE     |
| country    | Country of the client                                          | String          | TRUE     |
| postalCode | Device that the client was using                               | String          | TRUE     |
|------------+----------------------------------------------------------------+-----------------+----------|

### Geolocation Object

The latitude and longitude of the geolocation where an action was performed

|------------+----------------------------------------------------------------+-----------------+----------|
| Property   | Description                                                    | DataType        | Nullable |
| ---------- | -------------------------------------------------------------- | --------------- | -------- |
| lat        | Latitude                                                       | Double          | FALSE    |
| lon        | Longitude                                                      | Double          | FALSE    |
|------------+----------------------------------------------------------------+-----------------+----------|


### Outcome Object

Describes the result of an action and the reason for that result

|------------+------------------------------------------------------------------------+-----------------+----------+---------+-----------+-----------|
| Property   | Description                                                            | DataType        | Nullable | Default | MinLength | MaxLength |
| ---------- | ---------------------------------------------------------------------- | --------------- | -------- | ------- | --------- | --------- |
| result     | Result of the action: `SUCCESS`, `FAILURE`, `SKIPPED`, `UNKNOWN`       | String          | FALSE    |         |           |           |
| reason     | Reason for the result, for example `INVALID_CREDENTIALS`               | String          | TRUE     |         | 1         | 255       |
|------------+------------------------------------------------------------------------+-----------------+----------+---------+-----------+-----------|

### Transaction Object

Describes the transaction data for an event

|------------+----------------------------------------------------------------+-----------------+----------|
| Property   | Description                                                    | DataType        | Nullable |
| ---------- | -------------------------------------------------------------- | --------------- | -------- |
| id         | Id of the transaction Object                                   | String          | TRUE     |
| type       | Type of transaction: `WEB` or `JOB`                            | String          | TRUE     |
| detail     | Details about the transaction                                  | Map[String->Object | TRUE  |
|------------+----------------------------------------------------------------+-----------------+----------|

### DebugContext Object

Describes additional context regarding an event

|------------+----------------------------------------------------------------+-----------------+----------|
| Property   | Description                                                    | DataType        | Nullable |
| ---------- | -------------------------------------------------------------- | --------------- | -------- |
| debugData  | A map that goes from a String key to a value                   | Map[String->Object | TRUE  |
|------------+----------------------------------------------------------------+-----------------+----------|

This object provides a way to store additional text about an event for debugging. For example, when you create an API token, 
`debugData` shows the `RequestUri` used to obtain the token, for example `/api/internal/tokens`.

### AuthenticationContext Object

Describes authentication data for an event

|------------+----------------------------------------------------------------+-----------------+----------+-----------+-----------|
| Property   | Description                                                    | DataType        | Nullable | MinLength | MaxLength |
| ---------- | -------------------------------------------------------------- | --------------- | -------- | --------- | --------- |
| authenticationProvider | Type of authentication provider: `OKTA_AUTHENTICATION_PROVIDER`, `ACTIVE_DIRECTORY`, `LDAP`, `FEDERATION`, `SOCIAL`, `FACTOR_PROVIDER` | String | TRUE  | | |
| credentialProvider | Type of credential provider: OKTA_CREDENTIAL_PROVIDER, RSA, SYMANTEC, GOOGLE, DUO, YUBIKEY | Array of String | TRUE  |           |           |
| credentialType | Type of credential: `OTP`, `SMS`, `PASSWORD`, `ASSERTION`, `IWA`, `EMAIL` | String        | TRUE     |           |           |
| issuer     | URI of the request that generated the event.                   | [Issuer Object](#issuer-object) | TRUE     |           |           |
| externalSessionId | Uri of the request that generated the event.            | String          | TRUE     | 1         | 255       |
| interface  | URI of the request that generated the event.                   | String          | TRUE     | 1         | 255       |
|------------+----------------------------------------------------------------+-----------------+----------+-----------+-----------|

### Issuer Object

Describes an issuer in the authentication context

|------------+----------------------------------------------------------------+-----------------+----------|
| Property   | Description                                                    | DataType        | Nullable |
| ---------- | -------------------------------------------------------------- | --------------- | -------- |
| id         | An ID for the issuer                                           | String          | TRUE     |
| type       | The type of the issuer                                         | Array of String | TRUE     |
|------------+----------------------------------------------------------------+-----------------+----------|

### SecurityContext Object

Describes security data related to an event

|------------+----------------------------------------------------------------+-----------------+----------|
| Property   | Description                                                    | DataType        | Nullable |
| ---------- | -------------------------------------------------------------- | --------------- | -------- |
| asNumber   | AS Number                                                      | Integer         | TRUE     |
| asOrg      | AS Organization                                                | String          | TRUE     |
| isp        | Internet Service Provider                                      | String          | TRUE     |
| domain     | Domain                                                         | String          | TRUE     |
| isProxy    | Specifies whether an event is from a known proxy               | Bool            | TRUE     |
|------------+----------------------------------------------------------------+-----------------+----------|

### Request Object

Describes request data regarding an event

|------------+----------------------------------------------------------------+-----------------+----------|
| Property   | Description                                                    | DataType        | Nullable |
| ---------- | -------------------------------------------------------------- | --------------- | -------- |
| ipChain    | Describes the IP addresses used to perform an action           | Array of [IpAddress](#ipaddress-object) | TRUE  |
|------------+----------------------------------------------------------------+-----------------+----------|

### IpAddress Object

Describes an IP address used in a request.

|------------+----------------------------------------------------------------+-----------------+----------|
| Property   | Description                                                    | DataType        | Nullable |
| ---------- | -------------------------------------------------------------- | --------------- | -------- |
| ip         | IP address                                                     | String          | TRUE     |
| geographicalContext | Geographical context of the IP address                | [GeographicalContext Object](#geographicalcontext-object)          | TRUE     |
| version    | IP address version                                             | V4 or V6        | TRUE     |
| source     | Details regarding the source                                   | String          | TRUE     |
|------------+----------------------------------------------------------------+-----------------+----------|
