---
layout: docs_page
title: Schemas API
---

# Schemas API

Okta's [Universal Directory](https://support.okta.com/articles/Knowledge_Article/About-Universal-Directory) allows administrators to define custom user profiles for Okta users and applications.  Okta has adopted a subset [JSON Schema Draft 4](https://tools.ietf.org/html/draft-zyp-json-schema-04) as the schema language to describe and validate extensible user profiles. [JSON Schema](http://json-schema.org/) is a lightweight declarative format for describing the structure, constraints, and validation of JSON documents.

> Okta has only implemented a subset of [JSON Schema Draft 4](https://tools.ietf.org/html/draft-zyp-json-schema-04).  This document should describe which parts are applicable to Okta and any extensions Okta has made to [JSON Schema Draft 4](https://tools.ietf.org/html/draft-zyp-json-schema-04)

> This API is currently in **Early Access (EA)** status.

## Getting Started

Explore the Schemas API: [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/443242e60287fb4b8d6d)

## User Schema Operations

### Get User Schema
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /api/v1/meta/schemas/user/default</span>

Fetches the default schema for a User

##### Request Parameters
{:.api .api-request .api-request-params}

N/A

##### Response Parameters
{:.api .api-response .api-response-params}

[User Schema](#user-schema-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/meta/schemas/user/default"
~~~

##### Response Example
{:.api .api-response .api-response-example}

*The following response is only a subset of properties for brevity*

~~~json
{
    "id": "https://example.okta.com/meta/schemas/user/default",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "name": "user",
    "title": "Default Okta User",
    "lastUpdated": "2015-09-05T10:40:45.000Z",
    "created": "2015-02-02T10:27:36.000Z",
    "definitions": {
        "base": {
            "id": "#base",
            "type": "object",
            "properties": {
                "login": {
                    "title": "Username",
                    "type": "string",
                    "required": true,
                    "minLength": 5,
                    "maxLength": 100,
                    "permissions": [
                        {
                            "principal": "SELF",
                            "action": "READ_WRITE"
                        }
                    ]
                },
                "firstName": {
                    "title": "First name",
                    "type": "string",
                    "required": true,
                    "minLength": 1,
                    "maxLength": 50,
                    "permissions": [
                        {
                            "principal": "SELF",
                            "action": "READ_WRITE"
                        }
                    ]
                },
                "lastName": {
                    "title": "Last name",
                    "type": "string",
                    "required": true,
                    "minLength": 1,
                    "maxLength": 50,
                    "permissions": [
                        {
                            "principal": "SELF",
                            "action": "READ_WRITE"
                        }
                    ]
                },
                "email": {
                    "title": "Primary email",
                    "type": "string",
                    "required": true,
                    "format": "email",
                    "permissions": [
                        {
                            "principal": "SELF",
                            "action": "READ_WRITE"
                        }
                    ]
                }
            },
            "required": [
                "login",
                "firstName",
                "lastName",
                "email"
            ]
        },
        "custom": {
            "id": "#custom",
            "type": "object",
            "properties": {
            },
            "required": []
        }
    },
    "type": "object",
    "properties": {
        "profile": {
            "allOf": [
                {
                    "$ref": "#/definitions/base"
                },
                {
                    "$ref": "#/definitions/custom"
                }
            ]
        }
    }
}
~~~

### Add Property to User Profile Schema
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">POST</span> /api/v1/meta/schemas/user/default</span>

Adds one or more [custom user profile properties](#user-profile-schema-property-object) to the user schema

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter   | Description                                          | Param Type | DataType                                                       | Required | Default
----------- | ---------------------------------------------------- | ---------- | -------------------------------------------------------------- | -------- | -------
definitions | Subschema with one or more custom profile properties | Body       | [User Profile Custom Subschema](#user-profile-custom-subschema) | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[User Schema](#user-schema-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  {
    "definitions": {
      "custom": {
        "id": "#custom",
        "type": "object",
        "properties": {
          "twitterUserName": {
            "title": "Twitter username",
            "description": "User'\''s username for twitter.com",
            "type": "string",
            "required": false,
            "minLength": 1,
            "maxLength": 20,
            "permissions": [
              {
                "principal": "SELF",
                "action": "READ_WRITE"
              }
            ]
          }
        },
        "required": []
      }
    }
  }
}' "https://${org}.okta.com/api/v1/meta/schemas/user/default"
~~~

##### Response Example
{:.api .api-response .api-response-example}

*The following response is only a subset of properties for brevity*

~~~json
{
    "id": "https://example.okta.com/meta/schemas/user/default",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "name": "user",
    "title": "Default Okta User",
    "lastUpdated": "2015-09-05T10:40:45.000Z",
    "created": "2015-02-02T10:27:36.000Z",
    "definitions": {
        "base": {
            "id": "#base",
            "type": "object",
            "properties": {
                "login": {
                    "title": "Username",
                    "type": "string",
                    "required": true,
                    "minLength": 5,
                    "maxLength": 100,
                    "permissions": [
                        {
                            "principal": "SELF",
                            "action": "READ_WRITE"
                        }
                    ]
                },
                "firstName": {
                    "title": "First name",
                    "type": "string",
                    "required": true,
                    "minLength": 1,
                    "maxLength": 50,
                    "permissions": [
                        {
                            "principal": "SELF",
                            "action": "READ_WRITE"
                        }
                    ]
                },
                "lastName": {
                    "title": "Last name",
                    "type": "string",
                    "required": true,
                    "minLength": 1,
                    "maxLength": 50,
                    "permissions": [
                        {
                            "principal": "SELF",
                            "action": "READ_WRITE"
                        }
                    ]
                },
                "email": {
                    "title": "Primary email",
                    "type": "string",
                    "required": true,
                    "format": "email",
                    "permissions": [
                        {
                            "principal": "SELF",
                            "action": "READ_WRITE"
                        }
                    ]
                }
            },
            "required": [
                "login",
                "firstName",
                "lastName",
                "email"
            ]
        },
        "custom": {
            "id": "#custom",
            "type": "object",
            "properties": {
              "twitterUserName": {
                  "title": "Twitter username",
                  "description": "User's username for twitter.com",
                  "type": "string",
                  "required": false,
                  "minLength": 1,
                  "maxLength": 20,
                  "permissions": [
                      {
                          "principal": "SELF",
                          "action": "READ_WRITE"
                      }
                  ]
              }
            },
            "required": []
        }
    },
    "type": "object",
    "properties": {
        "profile": {
            "allOf": [
                {
                    "$ref": "#/definitions/base"
                },
                {
                    "$ref": "#/definitions/custom"
                }
            ]
        }
    }
}
~~~

### Update User Profile Schema Property
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">POST</span> /api/v1/meta/schemas/user/default</span>

Updates one or more [custom user profile properties](#user-profile-schema-property-object) in the schema or a [permission](#schema-property-permission-object) for a [user profile base property](#user-profile-base-subschema).

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter   | Description                                          | Param Type | DataType                                                       | Required | Default
----------- | ---------------------------------------------------- | ---------- | -------------------------------------------------------------- | -------- | -------
definitions | Subschema with one or more custom profile properties | Body       | [User Profile Custom Subschema](#user-profile-custom-subschema) | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[User Schema](#user-schema-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  {
    "definitions": {
      "custom": {
        "id": "#custom",
        "type": "object",
        "properties": {
          "twitterUserName": {
            "title": "Twitter username",
            "description": "User'\''s username for twitter.com",
            "type": "string",
            "required": false,
            "minLength": 1,
            "maxLength": 10,
            "permissions": [
              {
                "principal": "SELF",
                "action": "READ_ONLY"
              }
            ]
          }
        },
        "required": []
      }
    }
  }
}' "https://${org}.okta.com/api/v1/meta/schemas/user/default"
~~~

##### Response Example
{:.api .api-response .api-response-example}

*The following response is only a subset of properties for brevity*

~~~json
{
    "id": "https://example.okta.com/meta/schemas/user/default",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "name": "user",
    "title": "Default Okta User",
    "lastUpdated": "2015-09-05T10:40:45.000Z",
    "created": "2015-02-02T10:27:36.000Z",
    "definitions": {
        "base": {
            "id": "#base",
            "type": "object",
            "properties": {
                "login": {
                    "title": "Username",
                    "type": "string",
                    "required": true,
                    "minLength": 5,
                    "maxLength": 100,
                    "permissions": [
                        {
                            "principal": "SELF",
                            "action": "READ_WRITE"
                        }
                    ]
                },
                "firstName": {
                    "title": "First name",
                    "type": "string",
                    "required": true,
                    "minLength": 1,
                    "maxLength": 50,
                    "permissions": [
                        {
                            "principal": "SELF",
                            "action": "READ_WRITE"
                        }
                    ]
                },
                "lastName": {
                    "title": "Last name",
                    "type": "string",
                    "required": true,
                    "minLength": 1,
                    "maxLength": 50,
                    "permissions": [
                        {
                            "principal": "SELF",
                            "action": "READ_WRITE"
                        }
                    ]
                },
                "email": {
                    "title": "Primary email",
                    "type": "string",
                    "required": true,
                    "format": "email",
                    "permissions": [
                        {
                            "principal": "SELF",
                            "action": "READ_WRITE"
                        }
                    ]
                }
            },
            "required": [
                "login",
                "firstName",
                "lastName",
                "email"
            ]
        },
        "custom": {
            "id": "#custom",
            "type": "object",
            "properties": {
              "twitterUserName": {
                  "title": "Twitter username",
                  "description": "User's username for twitter.com",
                  "type": "string",
                  "required": false,
                  "minLength": 1,
                  "maxLength": 10,
                  "permissions": [
                      {
                          "principal": "SELF",
                          "action": "READ_ONLY"
                      }
                  ]
              }
            },
            "required": []
        }
    },
    "type": "object",
    "properties": {
        "profile": {
            "allOf": [
                {
                    "$ref": "#/definitions/base"
                },
                {
                    "$ref": "#/definitions/custom"
                }
            ]
        }
    }
}
~~~

### Remove Property from User Profile Schema
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">POST</span> /api/v1/meta/schemas/user/default</span>

Removes one or more [custom user profile properties](#user-profile-schema-property-object) from the user schema.
A property cannot be removed if it is being referenced as a [matchAttribute](./idps.html#subject-policy-object) in SAML2 IdPs.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter   | Description                                                    | Param Type | DataType                                                       | Required | Default
----------- | -------------------------------------------------------------- | ---------- | -------------------------------------------------------------- | -------- | -------
definitions | Subschema with one or more custom profile properties to remove | Body       | [User Profile Custom Subschema](#user-profile-custom-subschema) | TRUE     |

> Properties must be explicitly set to `null` to be removed from schema, otherwise the `POST` will be interpreted as a partial update.

##### Response Parameters
{:.api .api-response .api-response-params}

[User Schema](#user-schema-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  {
    "definitions": {
      "custom": {
        "id": "#custom",
        "type": "object",
        "properties": {
          "twitterUserName": null
        },
        "required": []
      }
    }
  }
}' "https://${org}.okta.com/api/v1/meta/schemas/user/default"
~~~

##### Response Example
{:.api .api-response .api-response-example}

*The following response is only a subset of properties for brevity*

~~~json
{
    "id": "https://example.okta.com/meta/schemas/user/default",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "name": "user",
    "title": "Default Okta User",
    "lastUpdated": "2015-09-05T10:40:45.000Z",
    "created": "2015-02-02T10:27:36.000Z",
    "definitions": {
        "base": {
            "id": "#base",
            "type": "object",
            "properties": {
                "login": {
                    "title": "Username",
                    "type": "string",
                    "required": true,
                    "minLength": 5,
                    "maxLength": 100,
                    "permissions": [
                        {
                            "principal": "SELF",
                            "action": "READ_WRITE"
                        }
                    ]
                },
                "firstName": {
                    "title": "First name",
                    "type": "string",
                    "required": true,
                    "minLength": 1,
                    "maxLength": 50,
                    "permissions": [
                        {
                            "principal": "SELF",
                            "action": "READ_WRITE"
                        }
                    ]
                },
                "lastName": {
                    "title": "Last name",
                    "type": "string",
                    "required": true,
                    "minLength": 1,
                    "maxLength": 50,
                    "permissions": [
                        {
                            "principal": "SELF",
                            "action": "READ_WRITE"
                        }
                    ]
                },
                "email": {
                    "title": "Primary email",
                    "type": "string",
                    "required": true,
                    "format": "email",
                    "permissions": [
                        {
                            "principal": "SELF",
                            "action": "READ_WRITE"
                        }
                    ]
                }
            },
            "required": [
                "login",
                "firstName",
                "lastName",
                "email"
            ]
        },
        "custom": {
            "id": "#custom",
            "type": "object",
            "properties": {
            },
            "required": []
        }
    },
    "type": "object",
    "properties": {
        "profile": {
            "allOf": [
                {
                    "$ref": "#/definitions/base"
                },
                {
                    "$ref": "#/definitions/custom"
                }
            ]
        }
    }
}
~~~

## User Schema Model

The [User Model](./users.html#user-model) schema is defined using [JSON Schema Draft 4](https://tools.ietf.org/html/draft-zyp-json-schema-04).

> The schema currently only defines the [profile object](./users.html#profile-object).

### Example

~~~json
{
    "id": "https://example.okta.com/meta/schemas/user/default",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "name": "user",
    "title": "Default Okta User",
    "lastUpdated": "2015-09-05T10:40:45.000Z",
    "created": "2015-02-02T10:27:36.000Z",
    "definitions": {
        "base": {
            "id": "#base",
            "type": "object",
            "properties": {
                "login": {
                    "title": "Username",
                    "type": "string",
                    "required": true,
                    "minLength": 5,
                    "maxLength": 100,
                    "permissions": [
                        {
                            "principal": "SELF",
                            "action": "READ_WRITE"
                        }
                    ]
                },
                "firstName": {
                    "title": "First name",
                    "type": "string",
                    "required": true,
                    "minLength": 1,
                    "maxLength": 50,
                    "permissions": [
                        {
                            "principal": "SELF",
                            "action": "READ_WRITE"
                        }
                    ]
                },
                "lastName": {
                    "title": "Last name",
                    "type": "string",
                    "required": true,
                    "minLength": 1,
                    "maxLength": 50,
                    "permissions": [
                        {
                            "principal": "SELF",
                            "action": "READ_WRITE"
                        }
                    ]
                },
                "email": {
                    "title": "Primary email",
                    "type": "string",
                    "required": true,
                    "format": "email",
                    "permissions": [
                        {
                            "principal": "SELF",
                            "action": "READ_WRITE"
                        }
                    ]
                }
            },
            "required": [
                "login",
                "firstName",
                "lastName",
                "email"
            ]
        },
        "custom": {
            "id": "#custom",
            "type": "object",
            "properties": {
              "twitterUserName": {
                  "title": "Twitter username",
                  "description": "User's username for twitter.com",
                  "type": "string",
                  "required": false,
                  "minLength": 1,
                  "maxLength": 20,
                  "permissions": [
                      {
                          "principal": "SELF",
                          "action": "READ_WRITE"
                      }
                  ]
              }
            },
            "required": []
        }
    },
    "type": "object",
    "properties": {
        "profile": {
            "allOf": [
                {
                    "$ref": "#/definitions/base"
                },
                {
                    "$ref": "#/definitions/custom"
                }
            ]
        }
    }
}
~~~

### Schema Properties

The user schema is a valid [JSON Schema Draft 4](https://tools.ietf.org/html/draft-zyp-json-schema-04) document with the following properties :

|---------------+------------------------------------------+-----------------------------------------------------+-----------+-------+----------+-----------+-----------+------------ |
| Property      | Description                              | DataType                                            | Nullable | Unique | Readonly | MinLength | MaxLength | Validation  |
| ------------- | ---------------------------------------- | --------------------------------------------------- |--------- | ------ | -------- | --------- | --------- | ----------  |
| id            | URI of user schema                       | String                                              | FALSE    | TRUE   | TRUE     |           |           |             |
| $schema       | JSON Schema version identifier           | String                                              | FALSE    | FALSE  | TRUE     |           |           |             |
| name          | name for the schema                      | `user`                                              | FALSE    | TRUE   | TRUE     |           |           |             |
| title         | user-defined display name for the schema | String                                              | FALSE    | FALSE  | FALSE    |           |           |             |
| created       | timestamp when schema was created        | Date                                                | FALSE    | FALSE  | TRUE     |           |           |             |
| lastUpdated   | timestamp when schema was last updated   | Date                                                | FALSE    | FALSE  | TRUE     |           |           |             |
| definitions   | user profile subschemas                  | [User Profile Subschemas](#user-profile-subschemas) | FALSE    | FALSE  | FALSE    |           |           | JSON Schema |
| type          | type of root schema                      | `object`                                            | FALSE    | FALSE  | TRUE     |           |           |             |
| properties    | user model properties                    | [User Model](./users.html#user-model) property set  | FALSE    | FALSE  | TRUE     |           |           |             |
|---------------+------------------------------------------+-----------------------------------------------------+-----------+-------+----------+-----------+-----------+-------------|

### User Profile Subschemas

The [profile object](./users.html#profile-object) for a user is defined by a composite schema of base and custom properties using JSON Path to reference subschemas.  The `#base` properties are defined and versioned by Okta while `#custom` properties are extensible.

- [User Profile Base Subschema](#user-profile-base-subschema)
- [User Profile Custom Subschema](#user-profile-custom-subschema)

Custom property names for the [profile object](./users.html#profile-object) must be unique and cannot conflict with a property name defined in the `#base` subschema.

~~~json
{
  "definitions": {
    "base": {
      "id": "#base",
      "type": "object",
      "properties": {},
      "required": []
    },
    "custom": {
      "id": "#custom",
      "type": "object",
      "properties": {},
      "required": []
    }
  },
  "type": "object",
  "properties": {
    "profile": {
      "allOf": [
        {
          "$ref": "#/definitions/base"
        },
        {
          "$ref": "#/definitions/custom"
        }
      ]
    }
  }
}
~~~

#### User Profile Base Subschema

All Okta defined profile properties are defined in a profile sub-schema with the resolution scope `#base`.  These properties cannot be removed or edited (except for permission).

The base user profile is based on the [System for Cross-Domain Identity Management: Core Schema](https://tools.ietf.org/html/draft-ietf-scim-core-schema-22#section-4.1.1) and has following standard properties:

|-------------------+------------------------------------------------------------------------------------------------------------------------------+----------+----------+--------+----------+-----------+-----------+-------------------------------------------------------------------------------------------------------------------|
| Property          | Description                                                                                                                  | DataType | Nullable | Unique | Readonly | MinLength | MaxLength | Validation                                                                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------- | -------- | ------ | -------- | --------- | --------- | ----------------------------------------------------------------------------------------------------------------- |
| login             | unique identifier for the user (`username`)                                                                                  | String   | FALSE    | TRUE   | FALSE    | 5         | 100       | [RFC 6531 Section 3.3](http://tools.ietf.org/html/rfc6531#section-3.3)                                            |
| email             | primary email address of user                                                                                                | String   | FALSE    | TRUE   | FALSE    | 5         | 100       | [RFC 5322 Section 3.2.3](http://tools.ietf.org/html/rfc5322#section-3.2.3)                                        |
| secondEmail       | secondary email address of user typically used for account recovery                                                          | String   | TRUE     | TRUE   | FALSE    | 5         | 100       | [RFC 5322 Section 3.2.3](http://tools.ietf.org/html/rfc5322#section-3.2.3)                                        |
| firstName         | given name of the user (`givenName`)                                                                                         | String   | FALSE    | FALSE  | FALSE    | 1         | 50        |                                                                                                                   |
| lastName          | family name of the user (`familyName`)                                                                                       | String   | FALSE    | FALSE  | FALSE    | 1         | 50        |                                                                                                                   |
| middleName        | middle name(s) of the user                                                                                                   | String   | FALSE    | FALSE  | FALSE    |           |           |                                                                                                                   |
| honorificPrefix   | honorific prefix(es) of the user, or title in most Western languages                                                         | String   | TRUE     | FALSE  | FALSE    |           |           |                                                                                                                   |
| honorificSuffix   | honorific suffix(es) of the user                                                                                             | String   | TRUE     | FALSE  | FALSE    |           |           |                                                                                                                   |
| title             | user's title, such as "Vice President"                                                                                       | String   | TRUE     | FALSE  | FALSE    |           |           |                                                                                                                   |
| displayName       | name of the user, suitable for display to end-users                                                                          | String   | TRUE     | FALSE  | FALSE    |           |           |                                                                                                                   |
| nickName          | casual way to address the user in real life                                                                                  | String   | TRUE     | FALSE  | FALSE    |           |           |                                                                                                                   |
| profileUrl        | url of user's online profile (e.g. a web page)                                                                               | String   | TRUE     | FALSE  | FALSE    |           |           | [URL](https://tools.ietf.org/html/rfc1808)                                                                        |
| primaryPhone      | primary phone number of user such as home number                                                                             | String   | TRUE     | FALSE  | FALSE    | 0         | 100       |                                                                                                                   |
| mobilePhone       | mobile phone number of user                                                                                                  | String   | TRUE     | FALSE  | FALSE    | 0         | 100       |                                                                                                                   |
| streetAddress     | full street address component of user's address                                                                              | String   | TRUE     | FALSE  | FALSE    |           |           |                                                                                                                   |
| city              | city or locality component of user's address (`locality`)                                                                    | String   | TRUE     | FALSE  | FALSE    |           |           |                                                                                                                   |
| state             | state or region component of user's address (`region`)                                                                       | String   | TRUE     | FALSE  | FALSE    |           |           |                                                                                                                   |
| zipCode           | zipcode or postal code component of user's address (`postalCode`)                                                            | String   | TRUE     | FALSE  | FALSE    |           |           |                                                                                                                   |
| countryCode       | country name component of user's address (`country`)                                                                         | String   | TRUE     | FALSE  | FALSE    |           |           | [ISO 3166-1 alpha 2 "short" code format](https://tools.ietf.org/html/draft-ietf-scim-core-schema-22#ref-ISO3166)  |
| postalAddress     | mailing address component of user's address                                                                                  | String   | TRUE     | FALSE  | FALSE    |           |           |                                                                                                                   |
| preferredLanguage | user's preferred written or spoken languages                                                                                 | String   | TRUE     | FALSE  | FALSE    |           |           | [RFC 7231 Section 5.3.5](https://tools.ietf.org/html/rfc7231#section-5.3.5)                                       |
| locale            | user's default location for purposes of localizing items such as currency, date time format, numerical representations, etc. | String   | TRUE     | FALSE  | FALSE    |           |           | See Note for more details.                                                                                        |
| timezone          | user's time zone                                                                                                             | String   | TRUE     | FALSE  | FALSE    |           |           | [IANA Time Zone database format](https://tools.ietf.org/html/rfc6557)                                             |
| userType          | used to identify the organization to user relationship such as "Employee" or "Contractor"                                    | String   | TRUE     | FALSE  | FALSE    |           |           |                                                                                                                   |
| employeeNumber    | organization or company assigned unique identifier for the user                                                              | String   | TRUE     | FALSE  | FALSE    |           |           |                                                                                                                   |
| costCenter        | name of a cost center assigned to user                                                                                       | String   | TRUE     | FALSE  | FALSE    |           |           |                                                                                                                   |
| organization      | name of user's organization                                                                                                  | String   | TRUE     | FALSE  | FALSE    |           |           |                                                                                                                   |
| division          | name of user's division                                                                                                      | String   | TRUE     | FALSE  | FALSE    |           |           |                                                                                                                   |
| department        | name of user's department                                                                                                    | String   | TRUE     | FALSE  | FALSE    |           |           |                                                                                                                   |
| managerId         | `id` of a user's manager                                                                                                     | String   | TRUE     | FALSE  | FALSE    |           |           |                                                                                                                   |
| manager           | displayName of the user's manager                                                                                            | String   | TRUE     | FALSE  | FALSE    |           |           |                                                                                                                   |
|-------------------+------------------------------------------------------------------------------------------------------------------------------+----------+----------+--------+----------+-----------+-----------+-------------------------------------------------------------------------------------------------------------------|

> Note: A locale value is a concatenation of the ISO 639-1 two letter language code, an underscore, and the ISO 3166-1 2 letter country code; e.g., 'en_US' specifies the language English and country US. [Okta Support Doc for ISO compliant Locale values](https://support.okta.com/help/articles/Knowledge_Article/Universal-Directory-enforcement-of-ISO-compliant-Locale-values)

#### User Profile Custom Subschema

All custom profile properties are defined in a profile sub-schema with the resolution scope `#custom`.

~~~json
{
  "definitions": {
    "custom": {
        "id": "#custom",
        "type": "object",
        "properties": {
            "customPropertyName": {
                "title": "Title of custom property",
                "description": "Description of custom property",
                "type": "string",
                "permissions": [
                    {
                        "principal": "SELF",
                        "action": "READ_ONLY"
                    }
                ]
            }
        },
        "required": []
    }
  }
}
~~~

#### User Profile Schema Property Object

User profile schema properties have the following standard [JSON Schema Draft 4](https://tools.ietf.org/html/draft-zyp-json-schema-04) keywords:

|---------------+-------------------------------------------------+--------------------------------------------------------------------+-----------+-------+----------+-----------+-----------+------------ |
| Property      | Description                                     | DataType                                                           | Nullable | Unique | Readonly | MinLength | MaxLength | Validation  |
| ------------- | ----------------------------------------------- | ------------------------------------------------------------------ |--------- | ------ | -------- | --------- | --------- | ----------  |
| title         | user-defined display name for the property      | String                                                             | FALSE    | FALSE  | FALSE    |           |           |             |
| description   | description of the property                     | String                                                             | TRUE     | FALSE  | FALSE    |           |           |             |
| type          | type of property                                | `string`, `boolean`, `date`, `number`, `integer`, `array`          | FALSE    | FALSE  | FALSE    |           |           |             |
|---------------+-------------------------------------------------+--------------------------------------------------------------------+-----------+-------+----------+-----------+-----------+-------------|

Okta has also extended [JSON Schema Draft 4](https://tools.ietf.org/html/draft-zyp-json-schema-04) with the following keywords:

|---------------+-------------------------------------------------+---------------------------------------------------------------------------+-----------+-------+----------+-----------+-----------+------------ |
| Property      | Description                                     | DataType                                                                  | Nullable | Unique | Readonly | MinLength | MaxLength | Validation  |
| ------------- | ----------------------------------------------- | ------------------------------------------------------------------------- |--------- | ------ | -------- | --------- | --------- | ----------  |
| required      | determines whether the property is required     | Boolean                                                                   | FALSE    | FALSE  | FALSE    |           |           |             |
| permissions   | access control permissions for the property     | Array of [Schema Property Permission](#schema-property-permission-object) | FALSE    | FALSE  | FALSE    |           |           |             |
|---------------+-------------------------------------------------+---------------------------------------------------------------------------+-----------+-------+----------+-----------+-----------+-----------

> A read-only [JSON Schema Draft 4](https://tools.ietf.org/html/draft-zyp-json-schema-04) compliant `required` property is also available on the [User Profile Subschemas](#user-profile-subschemas)

~~~json
{
  "definitions": {
    "custom": {
      "id": "#custom",
      "type": "object",
      "properties": {
        "twitterUserName": {
          "title": "Twitter username",
          "description": "User's username for twitter.com",
          "type": "string",
          "required": false,
          "minLength": 1,
          "maxLength": 20,
          "permissions": [
            {
              "principal": "SELF",
              "action": "READ_WRITE"
            }
          ]
        }
      },
      "required": []
    }
  }
}
~~~

##### User Schema Property Types and Validation

Specific property types support a **subset** of [JSON Schema validations](https://tools.ietf.org/html/draft-fge-json-schema-validation-00)

|---------------+-------------------------------------------------------------------------------------------------------------------------------------+-----------------------------|
| Property Type | Description                                                                                                                         | Validation Keywords         |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `string`      | [JSON String](https://tools.ietf.org/html/rfc7159#section-7)                                                                        | `minLength` and `maxLength` |
| `boolean`     | `false`, `true`, or `null`                                                                                                          |                             |
| `date`        | [ISO 8601 String](https://tools.ietf.org/html/rfc3339)                                                                              |                             |
| `number`      | [JSON Number](https://tools.ietf.org/html/rfc7159#section-6) with double-precision 64-bit IEEE 754 floating point number constraint | `minimum` and `maximum`     |
| `integer`     | [JSON Number](https://tools.ietf.org/html/rfc7159#section-6) with 32-bit signed two's complement integer constraint                 | `minimum` and `maximum`     |
| `array`       | [JSON Array](https://tools.ietf.org/html/rfc7159#section-5)                                                                         |                             |
|---------------+-------------------------------------------------------------------------------------------------------------------------------------+-----------------------------|

#### Schema Property Permission Object

A given schema property can be assigned a permission for a principal that restricts access to the property.

|-----------+------------------------------------------------------------------+--------------------------------------------------------------------+-----------+-------+----------+-----------+-----------+------------ |
| Property  | Description                                                      | DataType                                                           | Nullable | Unique | Readonly | MinLength | MaxLength | Validation  |
| ----------| ---------------------------------------------------------------- | ------------------------------------------------------------------ |--------- | ------ | -------- | --------- | --------- | ----------  |
| principal | security principal                                               | `SELF` (end-user)                                                  | FALSE    | TRUE   | FALSE    |           |           |             |
| action    | determines whether the principal can view or modify the property | `HIDE`, `READ_ONLY`, `READ_WRITE`                                  | FALSE    | FALSE  | FALSE    |           |           |             |
|-----------+------------------------------------------------------------------+--------------------------------------------------------------------+----------+--------+----------+-----------+-----------+-------------|
