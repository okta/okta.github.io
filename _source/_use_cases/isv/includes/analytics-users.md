
At the heart of the Okta Identity Cloud is the User object. This object exhaustively describes the user including:

+ Dates related to various updates
+ Credential information
+ Current state
+ An extensible user schema

This information can provide value to any integration seeking to provide user context.

#### Best Practices Users

<div style="border: 1px solid #626b6d; background-color: #ddf8ff; padding-left: 15px; padding-right: 15px; padding-bottom: 15px; padding-top: 15px">

In addition to the [Common Guidance] offered above the Users API carries these unique guidelines.

The page size (`limit` _parameter_) should be a configurable value with a range between 10 and 200, the default value should be 200.

The interval of ongoing polling should be configurable. Frequent polling of user objects is generally discouraged and only warranted with strict stipulations described below. While user objects and associated profiles are volatile they are not fluid.  Consider the cost/benefit associated with queries you perform.

If your goal is to populate and synchronize an external system with Okta identities a SCIM integration might be warranted. Please review our [SCIM Standards] documentation resource for more information.

When using the API to sync user data with an external system keep in mind the desired outcome of the integration and perform delta queries using the most appropriate date filter, or query the Logs API to watch for user authentication, lifecycle and profile events.

</div>

##### Drive user updates from events

| field | associated eventType | Note |
|:---|:---|:---|
| created | user.lifecyle.create | When the user was created |
| activated | user.lifecycle.activate | When the user was last activated |
| statusChanged | user.lifecycle.* | the timestamp of the most recent state change |
| passwordChanged | user.account.update_password | the timestamp of the most recent password |
| lastUpdated | user.account.update_profile or any from above | the timestamp of the most recent profile, password or state change |
| lastLogin | user.authentication.auth* | the timestamp of the most recent |

When polling for users, queries should be date driven using the search and filter capabilities:

`?filter=lastUpdated gt {startDate}`

+ `startDate` being the time of the last polling interval
+ `lastUpdated` can be replaced with the most granular date attribute from the list above to suite your specific needs.

With proper filtering the interval used becomes less of an issue, as an integration only interested in credential changes or login activity should filter accordingly and ignore irrelevant churn.

Synchronization jobs should, **at a minimum**, introduce filters on `lastUpdated` to ongoing queries to minimize needless sifting.

#### Users Data

##### Users State

In addition to the attributes discussed in the filtering guidelines above the User object has a status attribute. Refer to the online documentation describing the controlling [state machine](/docs/api/resources/users#user-status).

##### Users Profile

A Universal Directory enabled Okta Org features an extensible schema with the ability to source and master data from many sources including Applications and Directories.  Information related to the user's organizational role, hierarchy, geographic location and more can be found in the user profile.  The schema is extensible and the level of detail contained is based entirely on the customer's implementation.

The default attributes of a user are aligned with core SCIM attributes and [listed here](/docs/api/resources/users#default-profile-properties).

##### Users - Ambiguous Search

Use the `q` (query) parameter to search across multiple attributes to [find users](/docs/api/resources/users#find-users)

Request
{:.api .api-request .api-request-example}

```sh
GET https://{yourOktaDomain}/api/v1/users/?q=John
```

Response
{:.api .api-response .api-response-example}

```json
[
  {
    "id": "00u1aq5mpenI88ZEn1d8",
    "status": "ACTIVE",
    "lastUpdated": "2017-04-17T23:16:50.000Z",
    "...":"...",
    "profile":
    {
      "firstName": "John",
      "lastName": "Doe",
      "login": "jdoe@domain.tld",
      "email": "Joh.Doe@company.tld",
      "...": "..."
    },
  "...": "..."
  },
  {},
]
```

##### Users - Targeted Search

Use the `q` (query) parameter to search across multiple attributes to [find users](/docs/api/resources/users#find-users)
Use our [filter](/docs/api/resources/users#list-users-with-a-filter) and [search](/docs/api/resources/users#list-users-with-search) capabilities to locate users with greater accuracy and flexibility.

Request
{:.api .api-request .api-request-example}

```sh
GET https://{yourOktaDomain}/api/v1/users/?filter=(profile.firstName eq "John" AND profile.lastName eq "Doe")
```

Response
{:.api .api-response .api-response-example}

```json
[
  {
    "id": "00u1aq5mpenI88ZEn1d8",
    "status": "ACTIVE",
    "lastUpdated": "2017-04-17T23:16:50.000Z",
    "...":"...",
    "profile":
    {
      "firstName": "John",
      "lastName": "Doe",
      "login": "jdoe@domain.tld",
      "email": "Joh.Doe@company.tld",
      "...": "..."
    },
  "...": "..."
  }
]
```

##### Users - Get Single User

Retrieve a single user based on the user's:

+ username (short) _jdoe_
+ username (full) _jdoe@domain.tld_
+ Okta id (uid) _00u1aq5mpenI88ZEn1d8_

Using [Get User](/docs/api/resources/users#get-user)

Request(s)
{:.api .api-request .api-request-example}

```sh
#by Short userName
GET https://{yourOktaDomain}/api/v1/users/jdoe
#by Full userName
GET https://{yourOktaDomain}/api/v1/users/jdoe@domain.tld
#by Okta id (uid)
GET https://{yourOktaDomain}/api/v1/users/00u1aq5mpenI88ZEn1d8
```

Response
{:.api .api-response .api-response-example}

```json
{
  "id": "00u1aq5mpenI88ZEn1d8",
  "status": "ACTIVE",
  "lastUpdated": "2017-04-17T23:16:50.000Z",
  "...":"...",
  "profile":
  {
    "firstName": "John",
    "lastName": "Doe",
    "login": "jdoe@domain.tld",
    "email": "Joh.Doe@company.tld",
    "...": "..."
  },
"...": "..."
}
```

#### Users More

More details and complete examples are available in our [Users API] documentation.
