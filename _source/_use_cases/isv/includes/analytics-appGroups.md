
You can gain a better understanding of the meaning of groups in Okta by looking at the appGroups endpoint. For example, you can infer risk scores based on the access granted to a user from a given group.

#### Best Practices appGroups

<div style="border: 1px solid #626b6d; background-color: #ddf8ff; padding-left: 15px; padding-right: 15px; padding-bottom: 15px; padding-top: 15px">

The page size (`limit` _parameter_) should be a configurable value with a range between 10 and 100, the default value should be 20.

Like the guidance given for polling applications, the volatility of groups used to assign applications is low. Daily intervals should suffice in most cases.

</div>

#### appGroups Data

Refer to the [appGroup Object] data model for an elaboration of the appGroup data structure.

##### appGroup - Retrieve appGroup objects for a given app

Using [this method](/docs/api/resources/apps#list-groups-assigned-to-application) you can list the groups used to assign the specified app along with any application properties defined as a function of being assigned through that group.

Request
{:.api .api-request .api-request-example}

```sh
#Retrieve all Apps with Embedded appUser objects for given user
GET https://{yourOktaDomain}/api/v1/apps/{app_id}/groups
```

Response
{:.api .api-response .api-response-example}

```json
[
  {
    "id": "00gbo36oc0GUPcc020h7",
    "lastUpdated": "2017-08-16T23:06:52Z",
    "priority": 0,
    "profile": {
      "time_zone": "US/Pacific",
      "cost_center": "Cost Center X",
      "department": "Department Y",
      "company": "Company Z"
    },
    "...": "..."
  },
  {
    "id": "00gc96o9g6CY9M7N00h7",
    "lastUpdated": "2017-10-02T20:06:02Z",
    "priority": 1,
    "profile": {
      "time_zone": "US/Pacific",
      "cost_center": "Cost Center A",
      "department": "Department B",
      "company": "Company C"
    },
    "...": "..."
  }
]
```

#### appGroups More

More details and complete examples are available in our [appGroup Object] documentation.
