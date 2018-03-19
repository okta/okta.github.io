---
layout: docs_page
title: Linked Objects
excerpt: The Linked Objects API helps you create or import users with relationships, like Manager and Direct Report.
---

# Linked Objects API

{% api_lifecycle ea %}

Users have relationships to each other, like manager and direct report or customer and sales representative. You can create or import users with relationships by using the Linked Objects API to represent the relationship:

1. Create a linked object definition such as Manager:Direct Report or Case Worker:Client. These pairs are represented by a `primary` attribute and an `associated` attribute.
2. Assign the linked object definition to a pair of users to create the relationship between the two. For example, Jack is assigned Direct Report and Javier is assigned Manager.

For each relationship, a user has at most one `primary` link (a user has a single manager) but can have many associated links (a user can have many direct reports). Further, a user can be the `primary` in one relationship and the `associated` in another. A user can't be both the `primary` and `associated` in the same relationship. For details, see the [Linked Object Model](#linked-object-model).

The Expression Language functions for [linked objects](/reference/okta_expression_language/#linked-object-functions) provide access to the details about a linked user.

## Getting Started

Explore the Linked Objects API: [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/create-collection-from-jira) (link doesn't work yet)

## Link Definition Operations

Link definition operations allow you to manage the creation and removal of the link definitions.
If you remove a link definition, [what happens to the users assigned to that definition?].

Each org can create up to 200 definitions, and assign them to an unlimited number of users.

### Add Linked Object Property to User Profile Schema
{:.api .api-operation}

{% api_operation get /api/v1/meta/schemas/user/default/linkedObjects %}

Adds a linked object property to the user profile schema

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter   | Description    | DataType          | Required |
| :--------------- | :----------------- | :-------------------- |:------------ |
| name | API name of the `primary` or `associated` link | String  | TRUE   |
| title    | Display name of the `primary` or `associated` link | String | TRUE |
| description | Brief description of the `primary` or `associated` role | String | FALSE |
| type | The object type for this linked object definition | Enum of USER | TRUE |

##### Response Parameters
{:.api .api-response .api-response-params}

[Linked Object Model](#linked-object-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -X POST \
  -H 'Accept: application/json' \
  -H 'Authorization: SSWS ${api_token}' \
  -H 'Content-Type: application/json' \
  -d '{
  "primary": {
        "name": "Manager",
        "title": "Manager",
        "description": "Manager link property",
        "type": "USER"
    },
    "associated": {
        "name": "CastMember",
        "title": "Cast Member",
        "description": "Cast Member link property",
        "type": "USER"
    },
    "cardinality": "MANY_TO_ONE"
}' "https://{yourOktaDomain}.com/api/v1/meta/schemas/user/default/linkedObjects"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~sh
HTTP/1.1 201 Created
{
    "primary": {
        "name": "Manager",
        "title": "Manager",
        "description": "Manager link property",
        "type": "USER"
    },
    "associated": {
        "name": "CastMember",
        "title": "Cast Member",
        "description": "Cast Member link property",
        "type": "USER"
    },
    "_links": {
        "self": {
            "href": "https://{yourOktaDomain}.com/api/v1/meta/schemas/user/default/linkedObjects/Manager"
        }
    }
~~~

### Get a Linked Object Definition by Name
{:.api .api-operation}

{% api_operation GET /api/v1/meta/schemas/user/default/linkedObjects/${name} %}

Gets a single linked object definition

You can specify either the `primary` name or the `associated` name.

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter | Description    | DataType     | Required |
| :------------- | :---------------- | :---------------- |:------------- |
| name | Case-sensitive API name of the definition you want returned | String | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[Linked Object Model](#linked-object-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -X POST \
  -H 'Accept: application/json' \
  -H 'Authorization: SSWS ${api_token}' \
  -H 'Content-Type: application/json' \
  -d "https://{yourOktaDomain}.com/api/v1/meta/schemas/user/default/linkedObjects/Manager"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
HTTP/1.1 200 OK

{
    "primary": {
        "name": "Manager",
        "title": "Manager",
        "description": "Manager link property",
        "type": "USER"
    },
    "associated": {
        "name": "CastMember",
        "title": "Cast Member",
        "description": "Cast Member link property",
        "type": "USER"
    },
    "_links": {
        "self": {
            "href": "https://${yourOktaDomain}.com/api/v1/meta/schemas/user/default/linkedObjects/Manager"
        }
    }
}
~~~

### Get All Linked Object Definitions
{:.api .api-operation}

{% api_operation get /api/v1/meta/schemas/user/default/linkedObjects %}

Gets all the linked object definitions for an org

##### Request Parameters
{:.api .api-request .api-request-params}

None

##### Response Parameters
{:.api .api-response .api-response-params}

Array of [Linked Object Model](#linked-object-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}.com/api/v1/meta/schemas/user/default/linkedObjects"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[
    {
        "primary": {
            "name": "Manager",
            "title": "Manager",
            "description": "Manager link property",
            "type": "USER"
        },
        "associated": {
            "name": "CastMember",
            "title": "Cast Member",
            "description": "Cast Member link property",
            "type": "USER"
        },
        "_links": {
            "self": {
                "href": "https://{yourOktaDomain}.com/api/v1/meta/schemas/user/default/linkedObjects/Manager"
            }
        }
    },
    {
        "primary": {
            "name": "Choreographer",
            "title": "Choreographer",
            "description": "Dance choreographer",
            "type": "USER"
        },
        "associated": {
            "name": "Dancer",
            "title": "Company Dancer",
            "description": "Dancer for the Company",
            "type": "USER"
        },
        "_links": {
            "self": {
                "href": "https://{yourOktaDomain}.com/api/v1/meta/schemas/user/default/linkedObjects/Choreographer"
            }
        }
    }
]
~~~

### Remove Linked Object Definition
{:.api .api-operation}

{% api_operation get /api/v1/meta/schemas/user/default/linkedObjects/${name} %}

Removes the linked object definition specified by either `primary` or `associated` name. The entire definition is removed, regardless of which name you specify

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter   | Description    | DataType   | Required |
| :--------------- | :----------------- | :------------- |:------------ |
| name | Primary or associated name | String | TRUE  |

##### Response Parameters
{:.api .api-response .api-response-params}

None

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}.com/api/v1/meta/schemas/user/default/linkedObjects/Choreographer"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~sh
HTTP/1.1 204 No Content
~~~

## Link Value Operations

Use link value operations to assign users to a relationship (pair of `primary` and `associated` links).

For the following operations, the examples use consistent IDs so you can follow the operations more easily:

* Manager is the `primary` role, and is assigned to `00u5t60iloOHN9pBi0h7`
* Cast Member is the `associated` role, and is assigned to `00u5zex6ztMbOZhF50h7`

### Set Linked Object Value for Primary
{:.api .api-operation}

{% api_operation put /api/v1/users/${associated-userId}/linkedObjects/${primaryName}/{primary-userId} %}

Sets the first user as the `associated` and the second user as the `primary` for the specified relationship.

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter   | Description    | DataType     | Required |
| :--------------- | :----------------- |:---------------- |:------------ |
| associated-userId | User ID or `login` value of user to be assigned the `associated` role in a relationship | String | TRUE     |
| primaryName | Name of the `primary` role in the relationship being assigned | String | TRUE  |
| primary-userId | User ID to be assigned the `primary` role in the specified relationship | String | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

None

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}.com//api/v1/users/${associated-userId}/linkedObjects/${Manager}/{primary-userId}"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~sh
HTTP/1.1 204 No Content
~~~

### Get Primary Linked Object Value
{:.api .api-operation}

{% api_operation get /api/v1/users/${id}/linkedObjects/${primary-name} %}

For a user, return the ID of the `primary` user. If the user specified is the primary for the specified relationship, nothing is returned.

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter   | Description    | DataType     | Required |
| :--------------- | :----------------- |:---------------- |:------------ |
| id | ID of the user for whom you want to get the `primary` user ID. Can be `me` to represent the current session user. | String | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

Link to the primary user.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}.com//api/v1/users/00u5zex6ztMbOZhF50h7/linkedObjects/Manager"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~sh
[
    {
        "_links": {
            "self": {
                "href": "https://mysticorp.oktapreview.com/api/v1/users/00u5t60iloOHN9pBi0h7"
            }
        }
    }
]
~~~

### Get Associated Linked Object Values
{:.api .api-operation}

{% api_operation get /api/v1/users/00u5t60iloOHN9pBi0h7/linkedObjects/CastMember %}

For the specified user, gets an array of users who are `associated` for the specified role. If the specified user is not a `primary`, no results are returned.

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter   | Description    | DataType     | Required |
| :--------------- | :----------------- |:---------------- |:------------ |
| id | ID of the user for whom you want to get the `associated` user IDs. Can be `me` to represent the current session user. | String | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

Links to all users associated to the specified `primary` user for the specified `associated` role.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}.com//api/v1/users/00u5t60iloOHN9pBi0h7/linkedObjects/CastMember"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~sh
[
    {
        "_links": {
            "self": {
                "href": "https://mysticorp.oktapreview.com/api/v1/users/00u5zex6ztMbOZhF50h7"
            }
        }
    }
]
~~~

### Delete Linked Object Value
{:.api .api-operation}

{% api_operation delete  /api/v1/users/${id}/linkedObjects/${primary-name}
 %}

For the specified primary name and primary user, deletes the relationship between primary and all associated users.

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter   | Description    | DataType     | Required |
| :--------------- | :----------------- |:---------------- |:------------ |
| id | ID of the user in the `associated` role for the specified primary name. Can be `me` to represent the current session user. | String | TRUE     |

If the specified user is in the `primary` role for the specified relationship, nothing is deleted.

##### Response Parameters
{:.api .api-response .api-response-params}

None

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}.com//api/v1/users/00u5t60iloOHN9pBi0h7/linkedObjects/Manager"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~sh
HTTP/1.1 204 No Content
~~~

## Linked Object Model

The following model contains example values for each attribute. 

~~~sh
{
    "primary": {
        "name": "Manager",
        "title": "Manager",
        "description": "Manager link property",
        "type": "USER"
    },
    "associated": {
        "name": "CastMember",
        "title": "Cast Member",
        "description": "Cast Member link property",
        "type": "USER"
    },
    "_links": {
        "self": {
            "href": "https://{yourOktaDomain}.com/api/v1/meta/schemas/user/default/linkedObjects/Manager"
        }
    }
~~~