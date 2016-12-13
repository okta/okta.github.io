---
layout: docs_page
title: Admin Roles
---

# Admin Roles API

The Okta Administrator Roles API provides operations to manage administrative role assignments for a user.

## Getting Started with Admin Roles

Explore the Administrator Roles API:  [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/5f91aaea133fe6c9cb8b) 

## Role Assignment Operations

### List Roles Assigned to User
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /users/:uid/roles</span>

Lists all roles assigned to a user.

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
uid          | `id` of user                                        | URL        | String   | TRUE     |

#### Response Parameters
{:.api .api-response .api-response-params}

Array of [Role](#role-model)

#### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/roles"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[
  {
    "id": "ra1b8aahBZuGJRRa30g4",
    "label": "Organization Administrator",
    "type": "ORG_ADMIN",
    "status": "ACTIVE",
    "created": "2015-09-06T14:55:11.000Z",
    "lastUpdated": "2015-09-06T14:55:11.000Z"
  },
  {
    "id": "IFIFAX2BIRGUSTQ",
    "label": "Application Administrator",
    "type": "APP_ADMIN",
    "status": "ACTIVE",
    "created": "2015-09-06T14:55:11.000Z",
    "lastUpdated": "2015-09-06T14:55:11.000Z"
  }
]
~~~

### Assign Role to User
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /users/*:uid*/roles</span>

Assigns a role to a user.

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description            | Param Type | DataType                 | Required | Default
------------ | ---------------------- | ---------- | ------------------------ | -------- | -------
uid          | `id` of user           | URL        | String                   | TRUE     |
type         | type of role to assign | Body       | [Role Type](#Role Types) | TRUE     |

#### Response Parameters
{:.api .api-response .api-response-params}

Assigned [Role](#role-model)

#### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  {
      "type": "SUPER_ADMIN"
  }
}' "https://${org}.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/roles"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "ra1b8anIk7rx7em7L0g4",
  "label": "Super Organization Administrator",
  "type": "SUPER_ADMIN",
  "status": "ACTIVE",
  "created": "2015-09-06T15:28:47.000Z",
  "lastUpdated": "2015-09-06T15:28:47.000Z"
}
~~~

### Unassign Role from User
{:.api .api-operation}

<span class="api-uri-template api-uri-delete"><span class="api-label">DELETE</span> /users/*:uid*/roles/*:rid*</span>

Unassigns a role from a user.

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description            | Param Type | DataType                 | Required | Default
------------ | ---------------------- | ---------- | ------------------------ | -------- | -------
uid          | `id` of user           | URL        | String                   | TRUE     |
rid          | `id` of role           | URL        | String                   | TRUE     |

#### Response Parameters
{:.api .api-response .api-response-params}

~~~ http
HTTP/1.1 204 No Content
~~~

#### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/roles/ra1b8anIk7rx7em7L0g4"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ http
HTTP/1.1 204 No Content
~~~

## Role Target Operations

### User Admin Role Group Targets

#### List Group Targets for User Admin Role
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /users/*:uid*/roles/*:rid*/targets/groups</span>

Lists all group targets for a `USER_ADMIN` role assignment.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                                  | Param Type | DataType                 | Required | Default
------------ | ------------------------------------------------------------ | ---------- | ------------------------ | -------- | -------
uid          | `id` of user                                                 | URL        | String                   | TRUE     |
rid          | `id` of role                                                 | URL        | String                   | TRUE     |
limit        | Specifies the number of results for a page                   | Query      | Number                   | FALSE    | 20
after        | Specifies the pagination cursor for the next page of targets | Query      | String                   | FALSE    |

> The page cursor should treated as an opaque value and obtained through the next link relation. See [Pagination](/docs/getting_started/design_principles.html#pagination)

##### Response Parameters
{:.api .api-response .api-response-params}

Array of [Groups](./groups.html)

> If the role is not scoped to specific group targets, an empty array `[]` is returned.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/roles/KVJUKUS7IFCE2SKO/targets/groups"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[
  {
    "id": "00g1emaKYZTWRYYRRTSK",
    "objectClass": [
      "okta:user_group"
    ],
    "profile": {
      "name": "West Coast Users",
      "description": "Straight Outta Compton"
    },
    "_links": {
      "logo": [
        {
          "href": "https://example.okta.com/img/logos/groups/okta-medium.png",
          "name": "medium",
          "type": "image/png"
        },
        {
          "href": "https://example.okta.com/img/logos/groups/okta-large.png",
          "name": "large",
          "type": "image/png"
        }
      ],
      "users": {
        "href": "https://example.okta.com/api/v1/groups/00g1emaKYZTWRYYRRTSK/users"
      },
      "apps": {
        "href": "https://example.okta.com/api/v1/groups/00g1emaKYZTWRYYRRTSK/apps"
      }
    }
  }
]
~~~

#### Add Group Target to User Admin Role
{:.api .api-operation}

<span class="api-uri-template api-uri-put"><span class="api-label">PUT</span> /users/*:uid*/roles/*:rid*/targets/groups/*:gid*</span>

Adds a group target for a `USER_ADMIN` role assignment.

> Adding the first group target changes the scope of the role assignment from applying to all targets to only applying to the specified target.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                                  | Param Type | DataType                 | Required | Default
------------ | ------------------------------------------------------------ | ---------- | ------------------------ | -------- | -------
uid          | `id` of user                                                 | URL        | String                   | TRUE     |
rid          | `id` of role                                                 | URL        | String                   | TRUE     |
gid          | `id` of group target to scope role assignment                | URL        | String                   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

~~~ http
HTTP/1.1 204 No Content
~~~

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X PUT \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/roles/KVJUKUS7IFCE2SKO/targets/groups/00garkxjAHDYPFcsP0g4"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ http
HTTP/1.1 204 No Content
~~~

#### Remove Group Target from User Admin Role
{:.api .api-operation}

<span class="api-uri-template api-uri-delete"><span class="api-label">DELETE</span> /users/*:uid*/roles/*:rid*/targets/groups/*:gid*</span>

Removes a group target from a `USER_ADMIN` role assignment.

> Don't remove the last group target from a role assignment, as this causes an exception.  If you need a role assignment that applies to all groups, the API consumer should delete the `USER_ADMIN` role assignment and recreate it.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                                  | Param Type | DataType                 | Required | Default
------------ | ------------------------------------------------------------ | ---------- | ------------------------ | -------- | -------
uid          | `id` of user                                                 | URL        | String                   | TRUE     |
rid          | `id` of role                                                 | URL        | String                   | TRUE     |
gid          | `id` of group target for role assignment                     | URL        | String                   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

~~~ http
HTTP/1.1 204 No Content
~~~

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/roles/KVJUKUS7IFCE2SKO/targets/groups/00garkxjAHDYPFcsP0g4"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ http
HTTP/1.1 204 No Content
~~~

### App Admin Role App Targets

#### List App Targets for App Admin Role
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /users/*:uid*/roles/*:rid*/targets/catalog/apps</span>

Lists all app targets for an `APP_ADMIN` role assignment.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                                  | Param Type | DataType                 | Required | Default
------------ | ------------------------------------------------------------ | ---------- | ------------------------ | -------- | -------
uid          | `id` of user                                                 | URL        | String                   | TRUE     |
rid          | `id` of role                                                 | URL        | String                   | TRUE     |
limit        | Specifies the number of results for a page                   | Query      | Number                   | FALSE    | 20
after        | Specifies the pagination cursor for the next page of targets | Query      | String                   | FALSE    |

> The page cursor should treated as an opaque value and obtained through the next link relation. See [Pagination](/docs/getting_started/design_principles.html#pagination)

##### Response Parameters
{:.api .api-response .api-response-params}

Array of Catalog Apps

> If the role is not scoped to specific apps in the catalog, an empty array `[]` is returned.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/roles/KVJUKUS7IFCE2SKO/targets/catalog/apps"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[
  {
    "name": "salesforce",
    "displayName": "Salesforce.com",
    "description": "Salesforce",
    "status": "ACTIVE",
    "lastUpdated": "2014-06-03T16:17:13.000Z",
    "category": "CRM",
    "verificationStatus": "OKTA_VERIFIED",
    "website": "http://www.salesforce.com",
    "signOnModes": [
      "SAML_2_0"
    ],
    "features": [
      "IMPORT_NEW_USERS",
      "IMPORT_PROFILE_UPDATES",
      "IMPORT_USER_SCHEMA",
      "PROFILE_MASTERING",
      "PUSH_NEW_USERS",
      "PUSH_PASSWORD_UPDATES",
      "PUSH_PROFILE_UPDATES",
      "PUSH_USER_DEACTIVATION",
      "REACTIVATE_USERS"
    ],
    "_links": {
      "logo": [
        {
          "name": "medium",
          "href": "http://rain.okta1.com:1802/img/logos/salesforce_logo.png",
          "type": "image/png"
        }
      ]
    }
  },
  {
    "name": "boxnet",
    "displayName": "Box",
    "description": "Cloud storage.",
    "status": "ACTIVE",
    "lastUpdated": "2014-06-03T16:17:13.000Z",
    "category": "CM",
    "verificationStatus": "OKTA_VERIFIED",
    "website": "http://www.box.net",
    "signOnModes": [
      "SAML_2_0"
    ],
    "features": [
      "GROUP_PUSH",
      "IMPORT_NEW_USERS",
      "IMPORT_PROFILE_UPDATES",
      "PUSH_NEW_USERS",
      "PUSH_PROFILE_UPDATES",
      "PUSH_USER_DEACTIVATION",
      "REACTIVATE_USERS"
    ],
    "_links": {
      "logo": [
        {
          "name": "medium",
          "href": "http://rain.okta1.com:1802/img/logos/box.png",
          "type": "image/png"
        }
      ]
    }
  }
]
~~~

#### Add App Target to App Admin Role
{:.api .api-operation}

<span class="api-uri-template api-uri-put"><span class="api-label">PUT</span> /users/*:uid*/roles/*:rid*/targets/catalog/apps/*:appName*</span>

Adds an app target for an `APP_ADMIN` role assignment.

> Adding the first app target changes the scope of the role assignment from applying to all app targets to only applying to the specified target.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                                  | Param Type | DataType                 | Required | Default
------------ | ------------------------------------------------------------ | ---------- | ------------------------ | -------- | -------
uid          | `id` of user                                                 | URL        | String                   | TRUE     |
rid          | `id` of role                                                 | URL        | String                   | TRUE     |
appName      | `name` of app target from catalog to scope role assignment   | URL        | String                   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

~~~ http
HTTP/1.1 204 No Content
~~~

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X PUT \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/roles/KVJUKUS7IFCE2SKO/targets/catalog/apps/amazon_aws"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ http
HTTP/1.1 204 No Content
~~~

#### Remove App Target from App Admin Role
{:.api .api-operation}

<span class="api-uri-template api-uri-delete"><span class="api-label">DELETE</span> /users/*:uid*/roles/*:rid*/targets/catalog/apps/*:appName*</span>

Removes an app target from an `APP_ADMIN` role assignment.

> Removing the last app target changes the scope of the role assignment from only applying to specific app targets to applying to **all** app targets.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                              | Param Type | DataType                 | Required | Default
------------ | ---------------------------------------- | ---------- | ------------------------ | -------- | -------
uid          | `id` of user                             | URL        | String                   | TRUE     |
rid          | `id` of role                             | URL        | String                   | TRUE     |
appName      | `name` of app target for role assignment | URL        | String                   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

~~~ http
HTTP/1.1 204 No Content
~~~

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/roles/KVJUKUS7IFCE2SKO/targets/catalog/apps/amazon_aws"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ http
HTTP/1.1 204 No Content
~~~

## Role Model

### Example

~~~json
{
  "id": "ra1b7aguRQ7e5iKYb0g4",
  "label": "Read-only Administrator",
  "type": "READ_ONLY_ADMIN",
  "status": "ACTIVE",
  "created": "2015-09-04T03:27:16.000Z",
  "lastUpdated": "2015-09-04T03:27:16.000Z"
}
~~~

### Role Properties

The role model defines several **read-only** properties:

|--------------+-------------------------------------------------------+-------------------------------------------------------------------------------------------+----------+--------+----------+-----------+-----------+------------|
| Property     | Description                                           | DataType                                                                                  | Nullable | Unique | Readonly | MinLength | MaxLength | Validation |
| ---------    | ----------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------- | ------ | -------- | --------- | --------- | ---------- |
| id           | unique key for the role assignment                    | String                                                                                    | FALSE    | TRUE   | TRUE     |           |           |            |
| label        | display name of role                                  | String                                                                                    | FALSE    | FALSE  | TRUE     |           |           |            |
| type         | type of role                                          | `SUPER_ADMIN`, `ORG_ADMIN`, `APP_ADMIN`, `USER_ADMIN`, `MOBILE_ADMIN`, `READ_ONLY_ADMIN`  | FALSE    | FALSE  | TRUE     |           |           |            |
| status       | status of role assignment                             | `ACTIVE`                                                                                  | FALSE    | FALSE  | TRUE     |           |           |            |
| created      | timestamp when app user was created                   | Date                                                                                      | FALSE    | FALSE  | TRUE     |           |           |            |
| lastUpdated  | timestamp when app user was last updated              | Date                                                                                      | FALSE    | FALSE  | TRUE     |           |           |            |
| _embedded    | embedded resources related to the role assignment     | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06)                            | TRUE     | FALSE  | TRUE     |           |           |            |
| _links       | discoverable resources related to the role assignment | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06)                            | TRUE     | FALSE  | TRUE     |           |           |            |
|--------------+-------------------------------------------------------+-------------------------------------------------------------------------------------------+----------+--------+----------+-----------+-----------+------------|

#### Role Types

Some roles support optional targets that constrain the role to a specific set of groups or apps.  If an optional target is not specified, then the role assignment is unbounded (e.g applies to all groups or apps).

Refer to the [product documentation](https://support.okta.com/articles/Knowledge_Article/99850906-Administrator-Roles) for a complete definition of permissions granted to each role.

|-------------------+------------------------------|-------------------------+
| Role Type         | Label                        | Optional Targets        |
| ----------------- | -----------------------------| ------------------------|
| `SUPER_ADMIN`     | Super Administrator          |                         |
| `ORG_ADMIN`       | Organizational Administrator |                         |
| `APP_ADMIN`       | Application Administrator    | Apps                    |
| `USER_ADMIN`      | User Administrator           | [Groups](./groups.html) |
| `MOBILE_ADMIN`    | Mobile Administrator         |                         |
| `READ_ONLY_ADMIN` | Read-only Administrator      |                         |
|-------------------+------------------------------|-------------------------+

> The `USER_ADMIN` role is [Early Access](https://support.okta.com/articles/Knowledge_Article/The-User-Admin-Role)
