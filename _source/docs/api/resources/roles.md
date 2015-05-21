---
layout: docs_page
title: Roles
---

* Will be replaced with the ToC
{:toc .list-unstyled .toc}

## Overview

The Okta Roles API provides operations to assign roles to users, apps, and groups to manage administrative access rights. 

## Roles Model

### Example

~~~json
{
  "id": "ra1fh0JWDDWIHIZYPGOB",
  "label": "Super Administrator",
  "desciptiodn": "optional role description",
  "type": "SUPER_ADMIN" | "ORG_ADMIN" | "APP_ADMIN" | "USER_ADMIN" | "READ_ONLY_ADMIN",
  "status":"ACTIVE",
  "created":"2014-08-15T08:02:17.000Z",
  "lastUpdated":"2014-09-04T17:54:03.000Z",
  "_embedded": {
      "targets": {
          "groups": [

          ],
          
          "apps": [

          ]       
      }
  }
}
~~~

### Metadata Attributes

The User model defines several **read-only** attributes:

Attribute             | Description                                                   | DataType                                                                                            | Nullable
--------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -----
id                    | unique key for role                                           | String   
label                 | the label for the role                                        | String | FALSE
description           | an optional role description                                  | String | TRUE
type                  | the role type | `SUPER_ADMIN`, `ORG_ADMIN`, `APP_ADMIN`, `USER_ADMIN`, `READ_ONLY_ADMIN`  | FALSE
status                | current status of role                                        |  | FALSE
created               | timestamp when role was created                               | Date   | TRUE
lastUpdated           | timestamp when status last changed   |Date  | TRUE


> Metadata attributes are READ ONLY.

## User Operations

### List Assigned Roles
{:.api .api-operation}

Fetches all roles for the specified resource.

- [Get Assigned Roles for a User](#get-assigned-roles-for-a-user)
- [Get Roles for Groups and Apps for a User](#get-roles-for-groups-and-apps-for-a-user)

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /user/:id/roles</span>

#### Get Assigned Roles for a User

##### Request Example
{:.api .api-request .api-request-example}

~~~http
curl -v -H "Authorization: SSWS {{ "{{apikey" }}}}" \ 
  -H "Accept: application/json" \ 
  -H "Content-Type: application/json" \ 
  -H "Cache-Control: no-cache" \
  -X GET https://{{ "{{subDomain" }}}}.okta.com/api/v1/users/{{ "{{userId" }}}}/roles
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[
  {
    "id": "ra1fh0JWDDWIHIZYPGOB",
    "label": "Super Administrator",
    "type": "ORG_ADMIN",
    "status": "ACTIVE",
    "created": "2014-08-15T08:02:17.000Z",
    "lastUpdated": "2014-09-04T17:54:03.000Z"
  },
  {
    "id": "ra1fh0JWDDWIHIZYPGOB",
    "label": "Super Administrator",
    "type": "APP_ADMIN",
    "status": "ACTIVE",
    "created": "2014-08-15T08:02:17.000Z",
    "lastUpdated": "2014-09-04T17:54:03.000Z"
  }
]
~~~


#### Get Roles for Groups and Apps for a User

In this example the requestor specifies the target resources for the role to include in the response.

##### Request Example
{:.api .api-request .api-request-example}

~~~http
curl -v -H "Authorization: SSWS {{ "{{apikey" }}}}" \ 
  -H "Accept: application/json" \ 
  -H "Content-Type: application/json" \ 
  -H "Cache-Control: no-cache" \
  -X GET https://{{ "{{subDomain" }}}}.okta.com/api/v1/users/{{userId}}/roles?expand=targets/groups,targets/apps
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[
  {
    "id": "ra1fh0JWDDWIHIZYPGOB",
    "label": "Organization Administrator",
    "type": "ORG_ADMIN",
    "status": "ACTIVE",
    "created": "2014-08-15T08:02:17.000Z",
    "lastUpdated": "2014-09-04T17:54:03.000Z",
    "_embedded": {
      "targets": {
        "groups": [
          {
            "id": "00gg9mNOTHEWJYPVNVIX",
            "objectClass": [
              ""
            ],
            "type": "APP_GROUP",
            "profile": {
              "name": "AD_EMEA",
              "description": "Create AD account for new users under ou=EMEA"
            }
          }
        ]
      }
    }
  },
  {
    "id": "ra1fh0JWDDWIHIZYPGOB",
    "label": "App Administrator",
    "type": "APP_ADMIN",
    "status": "ACTIVE",
    "created": "2014-08-15T08:02:17.000Z",
    "lastUpdated": "2014-09-04T17:54:03.000Z",
    "_embedded": {
      "targets": {
        "apps": [
          {
            "id": "0oag8wHJYBOVOCFFPOXO",
            "name": "workday",
            "label": "Workday",
            "status": "ACTIVE",
            "lastUpdated": "2014-08-22T12:22:43.000Z",
            "created": "2014-08-15T04:50:24.000Z",
            "accessibility": {
              "selfService": false,
              "errorRedirectUrl": null
            },
            "visibility": {
              "autoSubmitToolbar": true,
              "hide": {
                "iOS": false,
                "web": false
              },
              "appLinks": {
                "login": true
              }
            },
            "features": [
              "IMPORT_PROFILE_UPDATES",
              "PROFILE_MASTERING",
              "IMPORT_NEW_USERS"
            ],
            "signOnMode": "SECURE_PASSWORD_STORE",
            "credentials": {
              "scheme": "EDIT_USERNAME_AND_PASSWORD",
              "userNameTemplate": {
                "template": "${source.login}",
                "type": "BUILT_IN"
              }
            },
            "settings": {
              "app": {
                "siteURL": "https://impl.workday.com/okta_dpt1/login.flex"
              }
            }
          }
        ]
      }
    }
  }
]
~~~


### Assign Role to User
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /user/:id/roles</span>

Assigns a specified role to a specified user.

##### Request Example
{:.api .api-request .api-request-example}

~~~http
curl -v -H "Authorization: SSWS "{{ "{{apikey" }}}}" \ 
  -H "Accept: application/json" \ 
  -H "Content-Type: application/json" \ 
  -H "Cache-Control: no-cache" \
  -X POST https://{{ "{{subDomain" }}}}.okta.com/api/v1/users/{{ "{{userId" }}}}/roles \
  -d \
  '{
    "type": "{{ "{{roleType" }}}}"
  }'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "ra1fh0JWDDWIHIZYPGOB",
  "label": "Super Administrator",
  "desciption": "optional role description",
  "type": "SUPER_ADMIN",
  "status": "ACTIVE",
  "created": "2014-08-15T08:02:17.000Z",
  "lastUpdated": "2014-09-04T17:54:03.000Z"
}
~~~

> `HTTP/1.1 409 Conflict` status is returned if the role is already assigned to the user.


### Unassign Role from User
{:.api .api-operation}

<span class="api-uri-template api-uri-delete"><span class="api-label">DELETE</span> /user/:id/roles/:rid</span>

Removes a role from a specified user.

##### Request Example
{:.api .api-request .api-request-example}

~~~http
curl -v -i -H "Authorization: SSWS {{ "{{apikey" }}}}" \ 
  -H "Accept: application/json" \ 
  -H "Content-Type: application/json" \ 
  -H "Cache-Control: no-cache" \
  -X DELETE https://{{ "{{subDomain" }}}}.okta.com/api/v1/users/{{ "{{userId" }}}}/roles/{{ "{{roleId" }}}}
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~http
`HTTP/1.1 204 No Content`
~~~

> `HTTP/1.1 404 Not Found` status is returned if role is not found

~~~json
{
  "errorCode":"E0000007",
  "errorSummary":"Not found: Resource not found: IFIFAX2BIRGUSTQ (RoleAssignment)",
  "errorLink":"E0000007",
  "errorId":"oaeQ4VKa-AoSJODmiIGVtmljg",
  "errorCauses":[]
}
~~~

### Add Group Target to Role
{:.api .api-operation}

Adds a specified group to a role.

<span class="api-uri-template api-uri-put"><span class="api-label">PUT</span> /user/:uid/roles/:rid/targets/groups/:gid</span>

##### Request Example
{:.api .api-request .api-request-example}

~~~http
curl -v -H "Authorization: SSWS {{ "{{apikey" }}}}" \ 
  -H "Accept: application/json" \ 
  -H "Content-Type: application/json" \ 
  -H "Cache-Control: no-cache" \
  -X PUT https://{{ "{{subDomain" }}}}.okta.com/api/v1/roles/{{roleId}}/targets/groups/{{groupId}}
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 204 No Content
~~~

> Currently only supported by `USER_ADMIN`.  Returns `HTTP/1.1 405 Method Not Allowed` if the role does not support the target resource constraint.

~~~json
{
  "errorCode": "E0000091",
  "errorSummary": "The provided role type was not the same as required role type.",
  "errorLink": "E0000091",
  "errorId": "oaesASHFAzISfOao4MyCCtqpQ",
  "errorCauses": [ ]
}
~~~

> A `HTTP/1.1 405 Method Not Allowed` message is also returned if the app target is invalid.

~~~json
{
  "errorCode": "E0000022",
  "errorSummary": "The endpoint does not support the provided HTTP method",
  "errorLink": "E0000022",
  "errorId": "oaeBTnlOBB2SQuiLICp_EPO9Q",
  "errorCauses": [ ]
}
~~~

## Remove Group Target from Role
{:.api .api-operation}

<span class="api-uri-template api-uri-delete"><span class="api-label">DELETE</span> /user/:uid/roles/:rid/targets/groups/:gid</span>


##### Request Example
{:.api .api-request .api-request-example}

##### Response Example
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 204 No Content
~~~


### List Group Targets for Role
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /user/:uid/roles/:rid/targets/groups</span>

Fetches all groups targets for a role. Standard paging and limits are supported.

##### Request Example
{:.api .api-request .api-request-example}

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[
  {
    "id": "00gg9oZUHKTGCQNKJLUJ",
    "objectClass": [
      ""
    ],
    "type": "APP_GROUP",
    "profile": {
      "name": "AD_AMER",
      "description": "Create AD account for new users under ou=AMER"
    },
    "_links": {
      "logo": [
        {
          "name": "medium",
          "href": "https:/{{ "{{subDomain" }}}}.okta.com/img/logos/groups/workday-medium.png",
          "type": "image/png"
        },
        {
          "name": "large",
          "href": "https:/{{ "{{subDomain" }}}}.okta.com/img/logos/groups/workday-large.png",
          "type": "image/png"
        }
      ],
      "users": {
        "href": "https:/{{ "{{subDomain" }}}}.okta.com/api/v1/groups/00gg9oZUHKTGCQNKJLUJ/users"
      },
      "apps": {
        "href": "https:/{{ "{{subDomain" }}}}.okta.com/api/v1/groups/00gg9oZUHKTGCQNKJLUJ/apps"
      }
    }
  },
    {
    "id": "00gg9kSDGSJOWIBDIWRF",
    "objectClass": [
      ""
    ],
    "type": "APP_GROUP",
    "profile": {
      "name": "AD_APAC",
      "description": "Create AD account for new users under ou=APAC"
    },
    "_links": {
      "logo": [
        {
          "name": "medium",
          "href": "https:/{{ "{{subDomain" }}}}.okta.com/img/logos/groups/workday-medium.png",
          "type": "image/png"
        },
        {
          "name": "large",
          "href": "https:/{{ "{{subDomain" }}}}.okta.com/img/logos/groups/workday-large.png",
          "type": "image/png"
        }
      ],
      "users": {
        "href": "https:/{{ "{{subDomain" }}}}.okta.com/api/v1/groups/00gg9kSDGSJOWIBDIWRF/users"
      },
      "apps": {
        "href": "https:/{{ "{{subDomain" }}}}.okta.com/api/v1/groups/00gg9kSDGSJOWIBDIWRF/apps"
      }
    }
  },
  {
    "id": "00gg9mNOTHEWJYPVNVIX",
    "objectClass": [
      ""
    ],
    "type": "APP_GROUP",
    "profile": {
      "name": "AD_EMEA",
      "description": "Create AD account for new users under ou=EMEA"
    },
    "_links": {
      "logo": [
        {
          "name": "medium",
          "href": "https:/{{ "{{subDomain" }}}}.okta.com/img/logos/groups/workday-medium.png",
          "type": "image/png"
        },
        {
          "name": "large",
          "href": "https:/{{ "{{subDomain" }}}}.okta.com/img/logos/groups/workday-large.png",
          "type": "image/png"
        }
      ],
      "users": {
        "href": "https:/{{ "{{subDomain" }}}}.okta.com/api/v1/groups/00gg9mNOTHEWJYPVNVIX/users"
      },
      "apps": {
        "href": "https:/{{ "{{subDomain" }}}}.okta.com/api/v1/groups/00gg9mNOTHEWJYPVNVIX/apps"
      }
    }
  }
]
~~~


### Add App Target to Role
{:.api .api-operation}

<span class="api-uri-template api-uri-put"><span class="api-label">PUT</span> /user/:uid/roles/:rid/targets/apps/:app_name</span>

Adds a specified app to a role.

> Currently, only the `APP_ADMIN` role is supported.   `HTTP/1.1 405 Method Not Allowed` is returned if the role doesn't support the target resource constraint.

> Important:  If no app targets are specified, the app admin role is targeted to <b>all</b> apps!

##### Request Example
{:.api .api-request .api-request-example}

##### Response Example
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 204 No Content
~~~

> Currently only supported by `APP_ADMIN` type.  Returns `HTTP/1.1 405 Method Not Allowed` if the role doesn't support the target resource constraint

~~~json
{
  "errorCode": "E0000091",
  "errorSummary": "The provided role type was not the same as required role type.",
  "errorLink": "E0000091",
  "errorId": "oaesASHFAzISfOao4MyCCtqpQ",
  "errorCauses": [ ]
}
~~~

> Note:  If no app targets are specified the app admin role is targeted to all apps!

### Remove App Target from Role
{:.api .api-operation}

<span class="api-uri-template api-uri-delete"><span class="api-label">DELETE</span> /user/:uid/roles/:rid/targets/apps/:app_name</span>

Removes an app target from a role.

##### Request Example
{:.api .api-request .api-request-example}

##### Response Example
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 204 No Content
~~~

### List App Targets for Role
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /user/:uid/roles/:rid/targets/apps</span>

Fetches all app targets for a role. Standard paging and limits are supported.

##### Request Example
{:.api .api-request .api-request-example}

~~~http
curl -X GET \
  -H "Authorization: SSWS {{ "{{apikey" }}}}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Cache-Control: no-cache" \
  -X GET https://{{ "{{subDomain" }}}}.oktapreview.com/api/v1/users/{{userId}}/roles/{{roleId}}/targets/catalog/apps
~~~

##### Response Example
{:.api .api-response .api-response-example}


~~~json
[
	{
		"name": "salesforce",
		"displayName": "Salesforce.com"
		"description": "Salesforce.com",
		"status": "ACTIVE",
		"lastUpdated": "2014-10-06T22:56:48.000Z",
		"created": "2014-10-06T22:56:43.000Z",
		"category": "CRM",
		"verificationStatus": "OKTA_VERIFIED",
		"website": "http://www.salesforce.com",
		"signOnModes": [
			"BOOKMARK",
			"BASIC_AUTH",
			"BROWSER_PLUGIN",
			"SECURE_PASSWORD_STORE",
			"SAML_2_0",
			"WS_FEDERATION",
			"CUSTOM"
		],
		"features": [
			"PUSH_NEW_USERS",
			"PUSH_USER_DEACTIVATION",
			"REACTIVATE_USERS",
			"PUSH_PROFILE_UPDATES",
			"IMPORT_NEW_USERS"
		],
		"_links": {
			"logo": [
				{
					"name": "medium",
					"href": "https:/{{ "{{subDomain" }}}}.okta.com/img/logos/salesforce_logo.png",
					"type": "image/png"
				}
			]
		}
	}
]
~~~