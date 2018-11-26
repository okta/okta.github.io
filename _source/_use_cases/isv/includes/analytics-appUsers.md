
Like the [User object](#users) discussed previously the appUser object is an extensible and information rich data source.  The appUser object is a representation of a user's profile specific to the associated application or directory and can include profile data, role, license information and more depending on the containing application.

#### Best Practices appUsers

<div style="border: 1px solid #626b6d; background-color: #ddf8ff; padding-left: 15px; padding-right: 15px; padding-bottom: 15px; padding-top: 15px">

In addition to the [Common Guidance] offered above, the [appUser object] carries these unique guidelines.

The page size (`limit` _parameter_) should be a configurable value with a range between 10 and 100, the default value should be 20.

A specific need should be present before polling the information present.  The data models of appUser objects vary by application and implementation.

If full profile data isn't required make use of the "skinny_user" variant.  This endpoint operates in the same manner as the "users" endpoint but is optimized for speed and efficiency returning a minimized response object.

</div>

#### appUsers Data

Refer to the [appUser Object] data model for an elaboration of the appUser data structure.

##### appUsers - Retrieve list of appUsers for an App

Using [this method](/docs/api/resources/apps#list-users-assigned-to-application) you can list the user assigned to an app which will include their appUser profile.

Request
{:.api .api-request .api-request-example}

```sh
# ALL users using skinny_users endpoint
GET https://{yourOktaDomain}/api/v1/apps/{app_id}/skinny_users
# ALL users using the users endpoint
GET https://{yourOktaDomain}/api/v1/apps/{app_id}/users
# Specific User using their Okta User ID (uid)
GET https://{yourOktaDomain}/api/v1/apps/{app_id}/users/{user_id}
```

Response
{:.api .api-response .api-response-example}

```json
[
  {
    "id": "00u8tvvbi3eihn3Ur0h7",
    "externalId": "15467658348",
    "created": "2016-11-20T04:04:42.000Z",
    "lastUpdated": "2016-11-20T23:09:40.000Z",
    "scope": "GROUP",
    "status": "PROVISIONED",
    "statusChanged": "2016-11-20T04:04:44.000Z",
    "syncState": "SYNCHRONIZED",
    "lastSync": "2016-11-20T23:09:40.000Z",
    "credentials": {
      "userName": "nick@mytest.oktapreview.com"
    },
    "profile": {
      "Role": "agent",
      "phone": "555-789-1231",
      "Groups": [
        "Support"
      ],
      "alias": "Nick",
      "Organization": "mattegantest",
      "locale": "English",
      "RestrictionId": "all",
      "timeZone": "Pacific Time (US & Canada)",
      "firstName": "Joeseph"
    }
  },
  {}
]
```

##### appUsers - Retrieve App and appUser objects for a given user

Using [this Method](/docs/api/resources/apps#list-applications-assigned-to-user), you can make a single call to retrieve a collection of all application objects with an appUser object -- as shown [above](#appusers---retrieve-list-of-appusers-for-an-app) -- nested within each Application in the _embedded object. This approach will reduce the need to make iterative calls to fully elaborate a user's application footprint.

Request
{:.api .api-request .api-request-example}

```sh
#Retrieve all Apps with Embedded appUser objects for given user
GET https://{yourOktaDomain}/api/v1/apps?filter=user.id eq "00u1a7q3KgTkZE1d8"&expand=user/00u1a7q3KgTkZE1d8
```

Response
{:.api .api-response .api-response-example}

```json
[
  {
    "id": "0oa8tvgiuh93NlQ0W0h7",
    "name": "zendesk",
    "label": "Zendesk",
    "status": "ACTIVE",
    "..": "...",
    "_embedded": {
      "user": {
        "id": "00u1a7q3KgTkZE1d8",
        "externalId": "Matt.Egan@oktaprise.com",
        "...": "...",
        "profile": {
          "appProperty": "Value",
          "appRole": [ "role1","role2" ]
        }
      }
    }
  },
  {}
]
```

#### appUsers More

More details and complete examples are available in our [appUser Object] documentation.
