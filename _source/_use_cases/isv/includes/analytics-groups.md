
Groups are a first-class citizen in the Okta environment.  All the standard uses of Groups are leveraged within Okta and subsequently extended to orbiting applications and directories.  They serve purposes including but not limited to:

+ Application Assignment
+ Application Role/License/Entitlement
+ Policy Assignment

#### Best Practices Groups

<div style="border: 1px solid #626b6d; background-color: #ddf8ff; padding-left: 15px; padding-right: 15px; padding-bottom: 15px; padding-top: 15px">

In addition to the [Common Guidance] offered above the Groups API carries these unique guidelines.

The page size (`limit` _parameter_) should be a configurable value with a range between 100 and 10000, the default value should be 10000.

The interval of ongoing polling should be configurable. Frequent polling of group objects is generally discouraged and only warranted with strict stipulations described below.

When using the API to sync group data and group membership information with an external system keep in mind the desired outcome of the integration.

Tightly tied to the interval used is the idea of doing date bound queries to retrieve delta datasets.  There are two Date fields available to determine changes to a group.

+ `lastUpdated` is the timestamp when a group's profile was last updated
+ `lastMembershipUpdated` is the timestamp when a user was last added to or removed from that group

These values change independently. Membership changes will not modify the lastUpdated timestamp.

When polling for groups and group changes, queries should be date driven using the search and filter capabilities:

`?filter=lastMembershipUpdated gt {startDate}`

+ `startDate` being the time of the last polling interval
+ `lastMembershipUpdated` can be replaced with the the most granular date attribute from the list above that suites your specific need.

With proper filtering the interval used becomes less of an issue, as an integration only interested in group membership changes would filter accordingly and ignore irrelevant churn.

Synchronization jobs should, *at a minimum*, introduce filters on `lastMembershipUpdated`.

</div>

#### Groups Data

In addition to hosting native groups, Okta can source and replicate group membership between directories and apps.  Every group object in Okta will contain a Type property that describes the source of the group.  The profile of a group will vary based on the source of the group. Different app groups have different profiles.

Groups will always have a name, description and sufficient context to identify and associate back to their source.  _For example:_ An Active Directory group has an externalId attribute that is the AD groups Object-Guid.

Group membership manipulation is the de facto standard for affecting user entitlements and restrictions including but not limited to:

+ Application Assignment
+ Application Role
+ Application License
+ Authentication Policy
+ Password Policy

##### Groups - Retrieve with stats and app details

Using [Get Group](/docs/api/resources/groups#get-group) you can also add a query parameter expand with a value of app and or stats.  The result is a single call with additional details about the group. This method works when getting a singular group by id and when listing groups with or without a filter or query applied.

Request
{:.api .api-request .api-request-example}

```sh
# ALL groups
GET https://{yourOktaDomain}/api/v1/groups?limit=100&expand=app,stats
# Groups matching filter criteria
GET https://{yourOktaDomain}/api/v1/groups?filter=lastMembershipUpdated gt 2017-04-17T23:16:50.000Z &expand=app,stats
# Specific group based on Group ID (gid)
GET https://{yourOktaDomain}/api/v1/groups/00gwy337uaRYJVHTHACG?expand=app,stats
```

Response
{:.api .api-response .api-response-example}

```json
[
 {
  "id": "00gwy337uaRYJVHTHACG",
  "lastUpdated": "2017-03-31T23:16:50.000Z",
  "lastMembershipUpdated": "2017-04-17T23:16:50.000Z",
"...": "...",
  "type": "APP_GROUP",
  "...": "...",
  "profile": {
    "name": "Domain Group 1",
    "...": "...",
    "externalId": "nYGCoOeiW0uRVHW3MQcB1Q=="
  },
  "_embedded": {
  "app": {
    "id": "0oarja7d8gWSEGZBPZVB",
    "name": "active_directory",
    "...": "..."
  },
  "stats": {
    "usersCount": 301,
    "appCount": 0,
    "groupPushMappingsCount": 0,
    "...": "..."
  }
},
  "...": "..."
 },
 {}
]
```

##### Groups - Retrieve Group Members

Using the same logic described online in [List Group Members](/docs/api/resources/groups#list-group-members) you can retrieve a list of users in each group. *Hint*: _use the `group._embedded.stats.usersCount` value to know if *ANY* users are assigned_

If your integration doesn't need credential and credential provider related details when listing group members use the "skinny_users" endpoint, it operates in the same manner as the "users" endpoint with the following differences in the resulting data object

+ `credentials.provider` object missing
+ `_links` object only contains `.self` reference

Request
{:.api .api-request .api-request-example}

```sh
# ALL groups
# Get members using Skinny Users endpoint
GET https://{yourOktaDomain}/groups/00gwy337uaRYJVHTHACG/skinny_users
# Get members using the regular Users endpoint
GET https://{yourOktaDomain}/api/v1/groups/00gwy337uaRYJVHTHACG/users
```

Response
{:.api .api-response .api-response-example}

```json
[
  {
    "id": "00u10eqzrjiGORRUNTBM",
    "status": "ACTIVE",
    "created": "2015-01-07T01:52:51.000Z",
    "...": "...",
    "profile": {
      "login": "jsmith@oktaprise.com",
      "email": "jane.smith@oktaprise.com",
      "...": "..."
    },
    "credentials": {
      "recovery_question": {
        "question": "What is the name of your first stuffed animal?"
      }
    },
    "_links": {
      "self": {
        "href": "https://oktaprise.okta.com/api/v1/users/00u10eqzrjiGORRUNTBM"
      }
    }
  },
  {
    "id": "00u10h0t5suAYARMBTGF",
    "status": "ACTIVE",
    "created": "2015-01-09T05:28:55.000Z",
    "...": "...",
    "profile": {
      "login": "jdoe@oktaprise.com",
      "email": "joshua.kroeze@oktaprise.com",
      "...": "..."
    },
    "credentials": {
      "recovery_question": {
        "question": "What was the first thing you learned to cook?"
      }
    },
    "_links": {
      "self": {
        "href": "https://oktaprise.okta.com/api/v1/users/00u10h0t5suAYARMBTGF"
      }
    }
  }
]
```

##### Groups - Retrieve Apps assigned by a group

Using the logic described online with [List Assigned Applications](/docs/api/resources/groups#list-assigned-applications) you can retrieve a collection of applications that are assigned based on membership of that group. *Hint*: _Use the `group._embedded.stats.appsCount` value discussed [above](#groups---retrieve-with-stats-and-app-details) to know if *ANY* apps are assigned_

Request
{:.api .api-request .api-request-example}

```sh
GET https://{yourOktaDomain}/api/v1/groups/00gwy337uaRYJVHTHACG/apps
```

Response
{:.api .api-response .api-response-example}

```json
[
  {
    "id": "0oa9lv1b0tRF7p34K0h7",
    "name": "scim2headerauth",
    "label": "SCIM 2.0 Test App (Header Auth)",
    "status": "ACTIVE",
    "...": "...",
  },
  {
    "id": "0oa9sieay0Tju66dM0h7",
    "name": "github_enterprise",
    "label": "GitHub Business2",
    "status": "ACTIVE",
    "...": "...",
  },
  {
    "id": "0oaa097p4wlH2q8To0h7",
    "name": "servicenow_ud",
    "label": "ServiceNow UD",
    "status": "ACTIVE",
    "...": "...",
  }
]
```

##### Groups - Change Membership

Methods of, and reasons to, manipulate Groups and Group membership are discussed in our "Write back to enforce policy in Okta" [Groups](security-enforcement#groups) section below.

#### Groups More

More details and complete examples are available in our [Groups API] documentation.
