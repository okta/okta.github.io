---
layout: docs_page
title: Users
---



## Overview

The User API provides operations for user management.

## User Model

<!--
Content Type: application/json

- [Metadata Attributes](#metadata-attributes)
- [Profile Object](#profile-object)
- [Credentials Object](#credentials-object)
- [Links Object](#links-object)
-->

### Example

```json
{
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-06-27T16:35:28.000Z",
    "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        }
    },
    "_links": {
        "resetPassword": {
            "href": "https://example.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
        },
        "expirePassword": {
            "href": "https://example.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password"
        },
        "forgotPassword": {
            "href": "https://example.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password"
        },
        "changeRecoveryQuestion": {
            "href": "https://example.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_recovery_question"
        },
        "deactivate": {
            "href": "https://example.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate"
        },
        "changePassword": {
            "href": "https://example.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_password"
        }
    }
}
```

### Metadata Attributes

The User model defines several ***read-only*** attributes:

Attribute | Description | DataType | Nullable
--- | --- | ---	| ---
id | unique key for user | String | FALSE
status | current status | Enum: STAGED, PROVISIONED, ACTIVE, RECOVERY, LOCKED_OUT, PASSWORD_EXPIRED, DEPROVISIONED | FALSE
created | timestamp when user was created | Date | FALSE
activated | timestamp when transition to **ACTIVE** status *completed* | Date | TRUE
statusChanged | timestamp when status last changed | Date | TRUE
lastLogin | timestamp of last login | Date | TRUE
lastUpdated | timestamp when user was last updated | Date | FALSE
transitioningToStatus | target status of an inprogress asynchronous status transition | Enum: PROVISIONED, ACTIVE, DEPROVISIONED | TRUE

> These attributes are only available after a user is created

> `activated` timestamp will only be available to users activated after *06/30/2013*.

> `statusChanged` and `lastLogin` timestamps will be missing for users created before *06/30/2013*.  They will be updated on next status change or login.

### Profile Object

Specifies standard and custom profile attributes for a user.

```json
{
   "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337",
        "customAttribute": true,
        "moreCustomAttribs": "Yes we can!"
    }
}
```

#### Standard Attributes

All profiles have the following attributes:

Attribute | DataType | MinLength | MaxLength | Nullable | Unique | Validation
--- | --- | ---	| --- | --- | --- | ---
login | String | 5 | 100 | FALSE | TRUE | [RFC 6531 section 3.3](http://tools.ietf.org/html/rfc6531#section-3.3)
email |	String | 5 | 100 |	FALSE | TRUE |	[RFC 5322 section 3.2.3](http://tools.ietf.org/html/rfc5322#section-3.2.3)
firstName | String | 1 | 50	| FALSE	| FALSE	|
lastName | String | 1 | 50	| FALSE	| FALSE	|
mobilePhone | String |	0 |	100	| TRUE | FALSE	|

> Avoid using a `login` with a `/` character.  Although `/` is a valid character according to [RFC 6531 section 3.3](http://tools.ietf.org/html/rfc6531#section-3.3), a user with this character in their `login` cannot be fetched by `login` ([see Get User with id](#get-user-with-id)) due to security risks with escaping this character.

#### Custom Attributes

Custom attributes may be added to a user profile.  Custom attributes must be single-value (non-array) and have a data type of `Number`, `String`, `Boolean`, or `null`.

### Credentials Object

Specifies credentials for a user.  Credential types and requirements vary depending on the operation and security policy of the organization.

Attribute | DataType | MinLength | MaxLength | Nullable | Unique | Validation
--- | --- | ---	| --- | --- | --- | ---
password | [Password Object](#password-object) | | | TRUE | FALSE |
recovery_question | [Recovery Question Object](#recovery-question-object) | | | TRUE | FALSE |

> Some credential values are __write-only__

```json
{
    "credentials": {
      "password" : { "value": "GoAw@y123" },
      "recovery_question": {
          "question": "Who's a major player in the cowboy scene?",
          "answer": "Cowboy Dan"
    }
  }
}
```

#### Password Object

Specifies a password for a user.  A password value is a **write-only** property.  When a user has a valid password and a response object contains a password credential, then the Password Object will be a bare object without the ```value``` property defined (e.g. ```password: {}```) to indicate that a password value exists.

Attribute | DataType | MinLength | MaxLength | Nullable | Unique | Validation
--- | --- | ---	| --- | --- | --- | ---
value | String | *Password Policy* | 40 | TRUE | FALSE | *Password Policy* 

##### Default Password Policy

- Must be a minimum of 8 characters
- Must have a character that meets 3 of the 4 following groups:
	- Upper case
	- Lower case
	- Digit
	- Non-Alpha or Digit
- Must not contain the user's login or parts of the the login when split on the following characters: `,` `.` `_` `#` `@`
	- *For example, a user with login i.brock@example.org will not be able set password brockR0cks! as the password contains the login part brock*

#### Recovery Question Object

Specifies a secret question and answer that is validated when a user forgets their password.  The answer property is **write-only**.

Attribute | DataType | MinLength | MaxLength | Nullable | Unique | Validation
--- | --- | ---	| --- | --- | --- | ---
question | String | 1 | 100 | TRUE | FALSE |
answer | String | 1 | 100 | TRUE | FALSE |

### Links Object

Specifies link relations (See [Web Linking](http://tools.ietf.org/html/rfc5988)) available for the current status of a user.  The Links Object is used for dynamic discovery of related resources and lifecycle or credential operations.  The Links Object is **read-only**.

Relation Name | Description
--- | ---
self | The actual user
activate | [Lifecycle action](#activate-user) to transition user to **ACTIVE** status
deactivate | [Lifecycle action](#deactivate-user) to transition user to **DEPROVISIONED** status
resetPassword | [Lifecycle action](#reset-password) to transition user to **RECOVERY** status
expirePassword | [Lifecycle action](#expire-password) to transition user to **PASSWORD_EXPIRED** status
forgotPassword | [Resets a user's password](#forgot-password) by validating the user's recovery credential.
changePassword | [Changes a user's password](#change-password) validating the user's current password
changeRecoveryQuestion | [Changes a user's recovery credential](#change-recovery-question) by validating the user's current password
unlock | [Lifecycle operation](#unlock-user) to returns a user to **ACTIVE** status when their current status is **LOCKED_OUT** due to exceeding failed login attempts

# User Operations

### Create User

Creates a new user in your Okta organization.

#### POST /users

##### Request Parameters

Parameter | Description | Param Type | DataType | Required | Default
--- | --- | --- | --- | --- | ---
activate | Trigger activation lifecycle operation when creating the user | Query | Boolean | FALSE | TRUE
profile | Profile attributes for user | Body | [Profile Object](#profile-object) | TRUE |
credentials | Credentials for user | Body | [Credentials Object](#credentials-object) | FALSE | |

Users can be created with or without credentials:

- [Create User without Credentials](#create-user-without-credentials)
- [Create User with Recovery Question](#create-user-with-recovery-question)
- [Create User with Password](#create-user-with-password)
- [Create User with Password & Recovery Question](#create-user-with-password--recovery-question)

##### Response Parameters

All responses return the created [User](#user-model).  Activation of a user is an asynchronous operation.  The user will have the `transitioningToStatus` property with a value of **ACTIVE** during activation to indicate that the user hasn't completed the asynchronous operation.  The user will have a `status` of **ACTIVE** when the activation process is complete.

> The user will be emailed a one-time activation token if activated without a password

Security Q & A | Password | Activate Query Parameter | User Status | Login Credential | Welcome Screen
--- | --- | --- | --- | --- | ---
 | |FALSE|STAGED| |
 | |TRUE|PROVISIONED|One-Time Token (Email)|X
X| |FALSE|STAGED| |
X| |TRUE|PROVISIONED|One-Time Token (Email)|X
 |X|FALSE|STAGED| |
 |X|TRUE|ACTIVE|Password|X
X|X|FALSE|STAGED| |
X|X|TRUE|ACTIVE|Password|

#### Create User without Credentials ###

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users?activate=false" \
-d \
'{
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac@example.org",
    "login": "isaac@example.org",
    "mobilePhone": "555-415-1337"
  }
}'
```

##### Response

```json
{
    "id": "00u1ero7vZFVEIYLWPBN",
    "status": "STAGED",
    "created": "2013-07-02T21:36:25.344Z",
    "activated": null,
    "statusChanged": null,
    "lastLogin": null,
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "profile": {
	    "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {},
    "_links": {
        "activate": {
            "href": "https://your-domain.okta.com/api/v1/users/00u1ero7vZFVEIYLWPBN/lifecycle/activate"
        }
    }
}
```

#### Create User with Recovery Question

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users?activate=false" \
-d \
'{
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac@example.org",
    "login": "isaac@example.org",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "recovery_question": {
      "question": "Who\'s a major player in the cowboy scene?",
      "answer": "Cowboy Dan"
    }
  }
}'
```

##### Response

```json
{
    "id": "00u1ero7vZFVEIYLWPBN",
    "status": "STAGED",
    "created": "2013-07-02T21:36:25.344Z",
    "activated": null,
    "statusChanged": null,
    "lastLogin": null,
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "profile": {
	    "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        }
    },
    "_links": {
        "activate": {
            "href": "https://your-domain.okta.com/api/v1/users/00u1ero7vZFVEIYLWPBN/lifecycle/activate"
        }
    }
}
```

#### Create User with Password

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users?activate=false" \
-d \
'{
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac@example.org",
    "login": "isaac@example.org",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "password" : { "value": "GoAw@y123" }
  }
}'
```

##### Response

```json
{
    "id": "00u1ero7vZFVEIYLWPBN",
    "status": "STAGED",
    "created": "2013-07-02T21:36:25.344Z",
    "activated": null,
    "statusChanged": null,
    "lastLogin": null,
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "profile": {
	    "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "password": {}
    },
    "_links": {
        "activate": {
            "href": "https://your-domain.okta.com/api/v1/users/00u1ero7vZFVEIYLWPBN/lifecycle/activate"
        }
    }
}
```

#### Create User with Password & Recovery Question

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users?activate=false" \
-d \
'{
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac@example.org",
    "login": "isaac@example.org",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "password" : { "value": "GoAw@y123" },
    "recovery_question": {
      "question": "Who\'s a major player in the cowboy scene?",
      "answer": "Cowboy Dan"
    }
  }
}'
```

##### Response

```json
{
    "id": "00u1ero7vZFVEIYLWPBN",
    "status": "STAGED",
    "created": "2013-07-02T21:36:25.344Z",
    "activated": null,
    "statusChanged": null,
    "lastLogin": null,
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "profile": {
	    "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "password" : {},
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
    },
    "_links": {
        "activate": {
            "href": "https://your-domain.okta.com/api/v1/users/00u1ero7vZFVEIYLWPBN/lifecycle/activate"
        }
    }
}
```

### Get User

Fetches a user from your Okta organization

#### GET /users/:id

##### Request Parameters

Fetch a specific user by id, login, or login shortname (as long as it is unambiguous).

Parameter | Description | Param Type | DataType | Required | Default
--- | --- | --- | --- | --- | ---
id | `id`, `login`, or *login shortname* (as long as it is unambiguous) | URL | String | TRUE |

> When fetching a user by `login` or `login shortname`, you should [URL encode](http://en.wikipedia.org/wiki/Percent-encoding) the request parameter to ensure reserved characters at escaped properly.  Logins with a `/` character can only be fetched by 'id' due to security issues with escaping the `/` character.

>You can substitute *me* for the id to fetch the current user.

##### Response Parameters

Fetched [User](#user-model)

#### Get Current User

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users/me"
```

##### Response

```json
{
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        }
    },
    "_links": {
        "resetPassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
        },
        "expirePassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password"
        },
        "forgotPassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password"
        },
        "changeRecoveryQuestion": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_recovery_question"
        },
        "deactivate": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate"
        },
        "changePassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_password"
        }
    }
}
```


#### Get User with id

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR"
```

##### Response

```json
{
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        }
    },
    "_links": {
        "resetPassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
        },
        "expirePassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password"
        },
        "forgotPassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password"
        },
        "changeRecoveryQuestion": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_recovery_question"
        },
        "deactivate": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate"
        },
        "changePassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_password"
        }
    }
}
```

#### Get User with login

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users/isaac@example.org"
```

##### Response

```json
{
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        }
    },
    "_links": {
        "resetPassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
        },
        "expirePassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password"
        },
        "forgotPassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password"
        },
        "changeRecoveryQuestion": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_recovery_question"
        },
        "deactivate": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate"
        },
        "changePassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_password"
        }
    }
}
```

#### Get User with login shortname

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users/isaac"
```

##### Response

```json
{
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        }
    },
    "_links": {
        "resetPassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
        },
        "expirePassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password"
        },
        "forgotPassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password"
        },
        "changeRecoveryQuestion": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_recovery_question"
        },
        "deactivate": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate"
        },
        "changePassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_password"
        }
    }
}
```

### List Users

#### GET /users

Fetch a list of users from your Okta organization.

##### Request Parameters

Parameter | Description | Param Type | DataType | Required | Default
--- | --- | --- | --- | --- | ---
q | Searches `firstName`, `lastName`, and `email` attributes of users for matching value | Query | String | FALSE |
limit | Specified the number of results | Query | Number | FALSE | 10000
filter | [Filter expression](../getting_started/design_principles.md#filtering) for users | Query | String | FALSE |
after | Specifies the pagination cursor for the next page of users | Query | String | FALSE |

> The `after` cursor should treated as an opaque value and obtained through the next link relation. See [Pagination](../getting_started/design_principles.md#pagination)

> Search currently performs a startsWith match but it should be considered an implementation detail and may change without notice in the future

###### Filters

The following expressions are supported for users with the `filter` query parameter:

Filter | Description
------ | ----------- 
`status eq "STAGED"` | Users that have a `status` of `STAGED`
`status eq "PROVISIONED"` | Users that have a `status` of `PROVISIONED`
`status eq "ACTIVE"` | Users that have a `status` of `ACTIVE`
`status eq "RECOVERY"` | Users that have a `status` of `RECOVERY`
`status eq "PASSWORD_EXPIRED"` | Users that have a `status` of `PASSWORD_EXPIRED`
`status eq "LOCKED_OUT"` | Users that have a `status` of `LOCKED_OUT`
`status eq "DEPROVISIONED"` | Users that have a `status` of `DEPROVISIONED`
`lastUpdated lt "yyyy-MM-dd'T'HH:mm:ss.SSSZZ"` | Users last updated before a specific datetime
`lastUpdated eq "yyyy-MM-dd'T'HH:mm:ss.SSSZZ"` | Users last updated at a specific datetime
`lastUpdated gt "yyyy-MM-dd'T'HH:mm:ss.SSSZZ"` | Users last updated after a specific datetime

See [Filtering](../getting_started/design_principles.md#filtering) for more information on expressions

> All filters must be [URL encoded](http://en.wikipedia.org/wiki/Percent-encoding) where `filter=lastUpdated gt "2013-06-01T00:00:00.000Z"` is encoded as `filter=lastUpdated%20gt%20%222013-06-01T00:00:00.000Z%22`

**Filter Examples**

Users with status of `LOCKED_OUT`

    filter=status eq "LOCKED_OUT"

Users updated after 06/01/2013 but before 01/01/2014

    filter=lastUpdated gt "2013-06-01T00:00:00.000Z" and lastUpdated lt "2014-01-01T00:00:00.000Z"

Users updated after 06/01/2013 but before 01/01/2014 with a status of `ACTIVE`

    filter=lastUpdated gt "2013-06-27T16:35:28.000Z" and lastUpdated lt "2013-07-04T16:35:28.000Z" and status eq "ACTIVE"
    
Users updated after 06/01/2013 but with a status of `LOCKED_OUT` or `RECOVERY`

    filter=lastUpdated gt "2013-06-27T16:35:28.000Z" and (status eq "LOCKED_OUT" or status eq "RECOVERY")

##### Response Parameters

Array of [User](#user-model)

#### List Users with Defaults

The default user limit is set to a very high number due to historical reasons which is no longer valid for most organizations.  This will change in a future version of this API.  The recommended page limit is now `limit=200`.

> If you receive a HTTP 500 status code, you more than likely have exceeded the request timeout.  Retry your request with a smaller `limit` and page the results (See [Pagination](../getting_started/design_principles.md#pagination))

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users?limit=200"
```

##### Response

```http
HTTP/1.1 200 OK
Content-Type: application/json
Link: <https://your-domain.okta.com/api/v1/users?limit=200>; rel="self"
Link: <https://your-domain.okta.com/api/v1/users?after=00ud4tVDDXYVKPXKVLCO&limit=200>; rel="next"

[
    {
        "id": "00u1ero7vZFVEIYLWPBN",
        "status": "STAGED",
        "created": "2013-07-02T21:36:25.344Z",
        "activated": null,
        "statusChanged": null,
        "lastLogin": null,
        "lastUpdated": "2013-07-02T21:36:25.344Z",
        "profile": {
    	    "firstName": "Isaac",
            "lastName": "Brock",
            "email": "isaac@example.org",
            "login": "isaac@example.org",
            "mobilePhone": "555-415-1337"
        },
        "credentials": {},
        "_links": {
            "activate": {
                "href": "https://your-domain.okta.com/api/v1/users/00u1ero7vZFVEIYLWPBN/lifecycle/activate"
            }
        }
    },
    {
        "id": "00uar9CIHZHPTVFRSEYZ",
        "status": "ACTIVE",
        "created": "2013-06-24T16:39:18.000Z",
        "activated": "2013-06-24T16:39:19.000Z",
        "statusChanged": "2013-06-24T16:39:19.000Z",
        "lastLogin": "2013-06-24T17:39:19.000Z",
        "lastUpdated": "2013-07-02T21:36:25.344Z",
        "profile": {
            "firstName": "Eric",
            "lastName": "Judy",
            "email": "eric@example.org",
            "login": "eric@example.org",
            "mobilePhone": "555-415-2011"
        },
        "credentials": {
            "password": {},
            "recovery_question": {
                "question": "The stars are projectors?"
            }
        },
        "_links": {
            "resetPassword": {
                "href": "https://your-domain.okta.com/api/v1/users/00uar9CIHZHPTVFRSEYZ/lifecycle/reset_password"
            },
            "expirePassword": {
                "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password"
            },
            "forgotPassword": {
                "href": "https://your-domain.okta.com/api/v1/users/00uar9CIHZHPTVFRSEYZ/credentials/forgot_password"
            },
            "changeRecoveryQuestion": {
                "href": "https://your-domain.okta.com/api/v1/users/00uar9CIHZHPTVFRSEYZ/credentials/change_recovery_question"
            },
            "deactivate": {
                "href": "https://your-domain.okta.com/api/v1/users/00uar9CIHZHPTVFRSEYZ/lifecycle/deactivate"
            },
            "changePassword": {
                "href": "https://your-domain.okta.com/api/v1/users/00uar9CIHZHPTVFRSEYZ/credentials/change_password"
            }
        }
    }    
]
```

#### List Users with Search

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users?q=er&limit=1"
```

##### Response

```json
[
    {
        "id": "00uar9CIHZHPTVFRSEYZ",
        "status": "ACTIVE",
        "created": "2013-06-24T16:39:18.000Z",
        "activated": "2013-06-24T16:39:19.000Z",
        "statusChanged": "2013-06-24T16:39:19.000Z",
        "lastLogin": "2013-06-24T17:39:19.000Z",
        "lastUpdated": "2013-07-02T21:36:25.344Z",
        "profile": {
            "firstName": "Eric",
            "lastName": "Judy",
            "email": "eric@example.org",
            "login": "eric@example.org",
            "mobilePhone": "555-415-2011"
        },
        "credentials": {
            "password": {},
            "recovery_question": {
                "question": "The stars are projectors?"
            }
        },
        "_links": {
            "resetPassword": {
                "href": "https://your-domain.okta.com/api/v1/users/00uar9CIHZHPTVFRSEYZ/lifecycle/reset_password"
            },
            "expirePassword": {
                "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password"
            },
            "forgotPassword": {
                "href": "https://your-domain.okta.com/api/v1/users/00uar9CIHZHPTVFRSEYZ/credentials/forgot_password"
            },
            "changeRecoveryQuestion": {
                "href": "https://your-domain.okta.com/api/v1/users/00uar9CIHZHPTVFRSEYZ/credentials/change_recovery_question"
            },
            "deactivate": {
                "href": "https://your-domain.okta.com/api/v1/users/00uar9CIHZHPTVFRSEYZ/lifecycle/deactivate"
            },
            "changePassword": {
                "href": "https://your-domain.okta.com/api/v1/users/00uar9CIHZHPTVFRSEYZ/credentials/change_password"
            }
        }
    }    
]
```

#### List Users Updated after Timestamp

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users?filter=lastUpdated+gt+\"2013-07-01T00:00:00.000Z\""
```

##### Response

```json
[
    {
        "id": "00uar9CIHZHPTVFRSEYZ",
        "status": "ACTIVE",
        "created": "2013-06-24T16:39:18.000Z",
        "activated": "2013-06-24T16:39:19.000Z",
        "statusChanged": "2013-06-24T16:39:19.000Z",
        "lastLogin": "2013-06-24T17:39:19.000Z",
        "lastUpdated": "2013-07-02T21:36:25.344Z",
        "profile": {
            "firstName": "Eric",
            "lastName": "Judy",
            "email": "eric@example.org",
            "login": "eric@example.org",
            "mobilePhone": "555-415-2011"
        },
        "credentials": {
            "password": {},
            "recovery_question": {
                "question": "The stars are projectors?"
            }
        },
        "_links": {
            "resetPassword": {
                "href": "https://your-domain.okta.com/api/v1/users/00uar9CIHZHPTVFRSEYZ/lifecycle/reset_password"
            },
            "expirePassword": {
                "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password"
            },
            "forgotPassword": {
                "href": "https://your-domain.okta.com/api/v1/users/00uar9CIHZHPTVFRSEYZ/credentials/forgot_password"
            },
            "changeRecoveryQuestion": {
                "href": "https://your-domain.okta.com/api/v1/users/00uar9CIHZHPTVFRSEYZ/credentials/change_recovery_question"
            },
            "deactivate": {
                "href": "https://your-domain.okta.com/api/v1/users/00uar9CIHZHPTVFRSEYZ/lifecycle/deactivate"
            },
            "changePassword": {
                "href": "https://your-domain.okta.com/api/v1/users/00uar9CIHZHPTVFRSEYZ/credentials/change_password"
            }
        }
    }    
]
```

#### List Users with Status

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users?filter=status+eq+\"ACTIVE\"+or+status+eq+\"RECOVERY\""
```

##### Response

```json
[
    {
        "id": "00uar9CIHZHPTVFRSEYZ",
        "status": "ACTIVE",
        "created": "2013-06-24T16:39:18.000Z",
        "activated": "2013-06-24T16:39:19.000Z",
        "statusChanged": "2013-06-24T16:39:19.000Z",
        "lastLogin": "2013-06-24T17:39:19.000Z",
        "lastUpdated": "2013-07-02T21:36:25.344Z",
        "profile": {
            "firstName": "Eric",
            "lastName": "Judy",
            "email": "eric@example.org",
            "login": "eric@example.org",
            "mobilePhone": "555-415-2011"
        },
        "credentials": {
            "password": {},
            "recovery_question": {
                "question": "The stars are projectors?"
            }
        },
        "_links": {
            "resetPassword": {
                "href": "https://your-domain.okta.com/api/v1/users/00uar9CIHZHPTVFRSEYZ/lifecycle/reset_password"
            },
            "expirePassword": {
                "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password"
            },
            "forgotPassword": {
                "href": "https://your-domain.okta.com/api/v1/users/00uar9CIHZHPTVFRSEYZ/credentials/forgot_password"
            },
            "changeRecoveryQuestion": {
                "href": "https://your-domain.okta.com/api/v1/users/00uar9CIHZHPTVFRSEYZ/credentials/change_recovery_question"
            },
            "deactivate": {
                "href": "https://your-domain.okta.com/api/v1/users/00uar9CIHZHPTVFRSEYZ/lifecycle/deactivate"
            },
            "changePassword": {
                "href": "https://your-domain.okta.com/api/v1/users/00uar9CIHZHPTVFRSEYZ/credentials/change_password"
            }
        }
    }    
]
```

### Update User

#### PUT /users/:id

Update a user's profile and/or credentials.

##### Request Parameters

Parameter | Description | Param Type | DataType | Required | Default
--- | --- | --- | --- | --- | ---
id | id of user to update | URL | String | TRUE |
profile | Updated profile for user | Body | [Profile Object](#profile-object) | FALSE |
credentials | Update credentials for user | Body | [Credentials Object](#credentials-object) | FALSE | |

`profile` and `credentials` can be updated independently or with a single request. 

> All profile attributes must be specified when updating a user's profile.  __Partial updates are not supported!__

##### Response Parameters

Updated [User](#user-model)

#### Update Profile

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X PUT "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR" \
-d \
'{
    "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "login": "isaac.brock@example.org",
        "mobilePhone": "555-415-1337",
        "isManager": false
    }
}'
```

##### Response

```json
{
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "login": "isaac.brock@example.org",
        "mobilePhone": "555-415-1337",
        "isManager": false
    },
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        }
    },
    "_links": {
        "resetPassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
        },
        "expirePassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password"
        },
        "forgotPassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password"
        },
        "changeRecoveryQuestion": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_recovery_question"
        },
        "deactivate": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate"
        },
        "changePassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_password"
        }
    }
}
```   

#### Set Password

This is an administrative operation and does not validate existing user credentials.  For operations that validate credentials refer to:

- [Reset Password](#reset-password)
- [Forgot Password](#forgot-password)
- [Change Password](#change-password)

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X PUT "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR" \
-d \
'{
  "credentials": {
    "password" : { "value": "UpdatedP@55w0rd" }
  }
}'
```

##### Response

```json
{
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        }
    },
    "_links": {
        "resetPassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
        },
        "expirePassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password"
        },
        "forgotPassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password"
        },
        "changeRecoveryQuestion": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_recovery_question"
        },
        "deactivate": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate"
        },
        "changePassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_password"
        }
    }
}
```    

#### Set Recovery Question & Answer

This is an administrative operation and does not validate existing user credentials.  See [Change Recovery Question](#change-recovery-question) for an operation that requires validation

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X PUT "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR" \
-d \
'{
  "credentials": {
        "recovery_question": {
            "question": "I have a new recovery question?",
            "answer": "Yes, I do!"
        }
  }
}'
```

##### Response

```json
{
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "I have a new recovery question?"
        }
    },
    "_links": {
        "resetPassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
        },
        "expirePassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password"
        },
        "forgotPassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password"
        },
        "changeRecoveryQuestion": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_recovery_question"
        },
        "deactivate": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate"
        },
        "changePassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_password"
        }
    }
}
```
## Related Resources    

### Get Assigned App Links

#### GET /users/:id/appLinks

Fetches appLinks for all direct or indirect (via group membership) assigned applications

##### Request Parameters

Parameter | Description | Param Type | DataType | Required | Default
--- | --- | --- | --- | --- | ---
id | `id` of user | URL | String | TRUE |

##### Response Type

Array of App Links

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/appLinks"
```

##### Response

```json
[
    {
        "id": "auc01100002754172417",
        "label": "Google Apps Mail",
        "linkUrl": "https://your-domain.okta.com/home/google/0oa3omz2i9XRNSRIHBZO/50",
        "logoUrl": "https://your-domain.okta.com/img/logos/google-mail.png",
        "appName": "google",
        "appInstanceId": "0oa3omz2i9XRNSRIHBZO",
        "appAssignmentId": "0ua3omz7weMMMQJERBKY",
        "credentialsSetup": false,
        "hidden": false,
        "sortOrder": 0
    },
    {
        "id": "auc01100002754172415",
        "label": "Google Apps Calendar",
        "linkUrl": "https://your-domain.okta.com/home/google/0oa3omz2i9XRNSRIHBZO/54",
        "logoUrl": "https://your-domain.okta.com/img/logos/google-calendar.png",
        "appName": "google",
        "appInstanceId": "0oa3omz2i9XRNSRIHBZO",
        "appAssignmentId": "0ua3omz7weMMMQJERBKY",
        "credentialsSetup": false,
        "hidden": false,
        "sortOrder": 1
    },
    {
        "id": "auc01100002754172416",
        "label": "Box",
        "linkUrl": "https://your-domain.okta.com/home/boxnet/0oa3ompioiQCSTOYXVBK/72",
        "logoUrl": "https://your-domain.okta.com/img/logos/box.png",
        "appName": "boxnet",
        "appInstanceId": "0oa3ompioiQCSTOYXVBK",
        "appAssignmentId": "0ua3omx46lYEZLPPRWBO",
        "credentialsSetup": false,
        "hidden": false,
        "sortOrder": 3
    },
    {
        "id": "auc01100002754172417",
        "label": "Salesforce.com",
        "linkUrl": "https://your-domain.okta.com/home/salesforce/0oa12ecnxtBQMKOXJSMF/46",
        "logoUrl": "https://your-domain.okta.com/img/logos/salesforce_logo.png",
        "appName": "salesforce",
        "appInstanceId": "0oa12ecnxtBQMKOXJSMF",
        "appAssignmentId": "0ua173qgj5VAVOBQMCVB",
        "credentialsSetup": true,
        "hidden": false,
        "sortOrder": 2
    }
]
```

### Get Member Groups

#### GET /users/:id/groups

Fetches the groups of which the user is a member.

##### Request Parameters

Parameter | Description | Param Type | DataType | Required | Default
--- | --- | --- | --- | --- | ---
id | `id` of user | URL | String | TRUE |

##### Response Type

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/groups" 
```

##### Response

```json
[
  {
    "id": "0gabcd1234", 
    "profile": {
      "name": "Cloud App Users",
      "description": "Users can access cloud apps" 
    }
  }, 
  {
    "id": "0gefgh5678", 
    "profile": {
      "name": "Internal App Users",
      "description": "Users can access internal apps"
    }
  }
]
```

## Lifecycle Operations

Lifecycle operations are non-idempotent operations that initiate a state transition for a user's status.  Some operations are asynchronous while others are synchronous.  The user's current status limits what operations are allowed.  For example, you can't unlock a user that is `ACTIVE`.

### Activate User

##### POST /users/:id/lifecycle/activate

Activates a user.  This operation can only be performed on users with a **STAGED** `status`.  Activation of a user is an asynchronous operation.  The user will have the `transitioningToStatus` property with a value of **ACTIVE** during activation to indicate that the user hasn't completed the asynchronous operation.  The user will have a `status` of **ACTIVE** when the activation process is complete.

> Users that do not have a password must complete the welcome flow by visiting the activation link to complete the transition to __ACTIVE__ status.

##### Request Parameters

Parameter | Description | Param Type | DataType | Required | Default
--- | --- | --- | --- | --- | ---
id | `id` of user | URL | String | TRUE |
sendEmail | Sends an activation email to the user if `true` | Query | Boolean | FALSE | TRUE

##### Response Parameters

Returns empty object by default. When `sendEmail` is `false`, returns an activation link for the user to set up their account.

```json
{
  "activationUrl": "https://your-domain.okta.com/welcome/XE6wE17zmphl3KqAPFxO""
}
```

> If a password was set before the user was activated, then user must login with with their password and not the activation link

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/activate?sendEmail=false"
```

##### Response

```json    
{
  "activationUrl": "https://your-domain.okta.com/welcome/XE6wE17zmphl3KqAPFxO"
}
```

### Deactivate User

##### POST /users/:id/lifecycle/deactivate

Deactivates a user.  This operation can only be performed on users that do not have a **DEPROVISIONED** `status`.  Deactivation of a user is an asynchronous operation.  The user will have the `transitioningToStatus` property with a value of **DEPROVISIONED** during deactivation to indicate that the user hasn't completed the asynchronous operation.  The user will have a `status` of **DEPROVISIONED** when the deactivation process is complete.

> Deactivating a user is a __destructive__ operation.  The user will be deprovisioned from all assigned applications which may destroy their data such as email or files.  __This action cannot be recovered!__

##### Request Parameters

Parameter | Description | Param Type | DataType | Required | Default
--- | --- | --- | --- | --- | ---
id | `id` of user | URL | String | TRUE |

##### Response Parameters

Returns an empty object

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate"
```

### Unlock User

##### POST /users/:id/lifecycle/unlock

Unlocks a user with a **LOCKED_OUT** status and returns them to **ACTIVE** `status`.  Users will be able to login with their current password.

> This operation currently only works with Okta-mastered users and does not support directory-mastered accounts such as Active Directory.

##### Request Parameters

Parameter | Description | Param Type | DataType | Required | Default
--- | --- | --- | --- | --- | ---
id | `id` of user | URL | String | TRUE |

##### Response Parameters

Returns an empty object

##### Request
```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/unlock"
```

### Reset Password

#### POST /users/:id/lifecycle/reset_password

Generates a one-time token (OTT) that can be used to reset a user's password.  The OTT link can be automatically emailed to the user or returned to the API caller and distributed using a custom flow.

This operation will transition the user to the `status` of **RECOVERY** and the user will not be able to login or initiate a forgot password flow until they complete the reset flow.

##### Request Parameters

Parameter | Description | Param Type | DataType | Required | Default
--- | --- | --- | --- | --- | ---
id | `id` of user | URL | String | TRUE |
sendEmail | Sends reset password email to the user if `true` | Query | Boolean | FALSE | TRUE

##### Response Parameters

Returns an empty object by default. When `sendEmail` is `false`, returns a link for the user to reset their password.

```json
{
  "resetPasswordUrl": "https://your-domain.okta.com/reset_password/XE6wE17zmphl3KqAPFxO"
}
```

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password?sendEmail=false"
```

##### Response

```json
{
  "resetPasswordUrl": "https://your-domain.okta.com/reset_password/XE6wE17zmphl3KqAPFxO"
}
```

### Expire Password

#### POST /users/:id/lifecycle/expire_password

This operation will transition the user to the `status` of **PASSWORD_EXPIRED** and the user will be required to change their password at their next login. If `tempPassword` is passed, the user's password is reset to a temporary password that is returned, and then the temporary password is expired.

##### Request Parameters

Parameter | Description | Param Type | DataType | Required | Default
--- | --- | --- | --- | --- | ---
id | `id` of user | URL | String | TRUE |
tempPassword | Sets the user's password to a temporary password,  if `true` | Query | Boolean | FALSE | FALSE

##### Response Parameters

Returns an the complete user object by default. When `tempPassword` is `true`, returns the temporary password.

```json
{
    "tempPassword": "HR076gb6"
}
```

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password?tempPassword=false"
```

##### Response

```json
{
    "id": "00udp9BOIVEWHAAGSXRJ",
    "status": "ACTIVE",
    "created": "2014-03-04T06:14:07.000Z",
    "activated": null,
    "statusChanged": null,
    "lastLogin": "2014-03-04T17:46:59.000Z",
    "lastUpdated": "2014-03-04T17:54:48.000Z",
    "profile": {
        "firstName": "Add-Min",
        "lastName": "O'Cloudy Tud",
        "email": "webmaster@clouditude.net",
        "login": "administrator1@clouditude.net",
        "mobilePhone": null
    },
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "Last 4 digits of your social security number?"
        }
    },
    "_links": {
        "resetPassword": {
            "href": "http://rain.okta1.com:1802/api/v1/users/00udp9BOIVEWHAAGSXRJ/lifecycle/reset_password",
            "method": "POST"
        },
        "expirePassword": {
            "href": "http://rain.okta1.com:1802/api/v1/users/00udp9BOIVEWHAAGSXRJ/lifecycle/expire_password",
            "method": "POST"
        },
        "forgotPassword": {
            "href": "http://rain.okta1.com:1802/api/v1/users/00udp9BOIVEWHAAGSXRJ/credentials/forgot_password",
            "method": "POST"
        },
        "changeRecoveryQuestion": {
            "href": "http://rain.okta1.com:1802/api/v1/users/00udp9BOIVEWHAAGSXRJ/credentials/change_recovery_question",
            "method": "POST"
        },
        "deactivate": {
            "href": "http://rain.okta1.com:1802/api/v1/users/00udp9BOIVEWHAAGSXRJ/lifecycle/deactivate",
            "method": "POST"
        },
        "changePassword": {
            "href": "http://rain.okta1.com:1802/api/v1/users/00udp9BOIVEWHAAGSXRJ/credentials/change_password",
            "method": "POST"
        }
    }
}
```

## Credential Operations
	
### Forgot Password

#### POST /users/:id/lifecycle/forgot_password

Generates a one-time token (OTT) that can be used to reset a user's password.  The user will be required to validate their security question's answer when visiting the reset link.  This operation can only be performed on users with a valid [recovery question credential](#recovery-question-object) and have an **ACTIVE** `status`.

##### Request Parameters

Parameter | Description | Param Type | DataType | Required | Default
--- | --- | --- | --- | --- | ---
id | `id` of user | URL | String | TRUE |
sendEmail | Sends a forgot password email to the user if `true` | Query | Boolean | FALSE | TRUE

##### Response Parameters

Returns an empty object by default. When `sendEmail` is `false`, returns a link for the user to reset their password. 

```json
{
  "resetPasswordUrl": "https://your-domain.okta.com/reset_password/XE6wE17zmphl3KqAPFxO"
}
```
> This operation does not affect the status of the user.

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/forgot_password?sendEmail=false"
```

##### Response

```json
{
  "resetPasswordUrl": "https://your-domain.okta.com/reset_password/XE6wE17zmphl3KqAPFxO"
}
```

#### POST /users/:id/credentials/forgot_password
  
Sets a new password for a user by validating the user's answer to their current recovery question.  This operation can only be performed on users with a valid [recovery question credential](#recovery-question-object) and have an **ACTIVE** `status`.

> This operation is intended for applications that need to implement their own forgot password flow.  You are responsible for mitigation of all security risks such as phishing and replay attacks.  Best-practice is to generate a short-lived one-time token (OTT) that is sent to a verified email account.


##### Request Parameters

Parameter | Description | Param Type | DataType | Required | Default
--- | --- | --- | --- | --- | ---
id | `id` of user | URL | String | TRUE |
password | New password for user | Body | [Password Object](#password-object) | TRUE |
recovery_question | Answer to user's current recovery question | Body | [Recovery Question Object](#recovery-question-object) | TRUE |

##### Response Parameters

[Credentials](#credentials-object) of the user

> This operation does not affect the status of the user.

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password" \
-d \
'{
    "password": { "value": "MyN3wP@55w0rd" }, 
    "recovery_question": { "answer": "Cowboy Dan" } 
}'
```

##### Response

```json
{
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        }
    }
}
```

### Change Password

#### POST /users/:id/credentials/change_password

Changes a user's password by validating the user's current password.  This operation can only be performed on users in **STAGED**, **ACTIVE** or **RECOVERY** `status` that have a valid [password credential](#password-object)

##### Request Parameters

Parameter | Description | Param Type | DataType | Required | Default
--- | --- | --- | --- | --- | ---
id | `id` of user | URL | String | TRUE |
oldPassword | Current password for user | Body | [Password Object](#password-object) | TRUE |
newPassword | New password for user | Body | [Password Object](#password-object) | TRUE |

##### Response Parameters

[Credentials](#credentials-object) of the user

> The user will transition to __ACTIVE__ status when successfully invoked in __RECOVERY__ status

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_password" \
-d \
'{
    "oldPassword": { "value": "GoAw@y123" },
    "newPassword": { "value": "MyN3wP@55w0rd" } 
}'
```

##### Response

```json
{
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        }
    }
}
```

### Change Recovery Question

#### POST /users/:id/credentials/change_recovery_question

Changes a user's recovery question & answer credential by validating the user's current password.  This operation can only be performed on users in **STAGED**, **ACTIVE** or **RECOVERY** `status` that have a valid [password credential](#password-object)

##### Request Parameters

Parameter | Description | Param Type | DataType | Required | Default
--- | --- | --- | --- | --- | ---
id | `id` of user | URL | String | TRUE |
password | Current password for user | Body | [Password Object](#password-object) | TRUE |
recovery_question | New recovery question & answer for user| Body | [Recovery Question Object](#recovery-question-object) | TRUE |

##### Response Parameters

[Credentials](#credentials-object) of the user

> This operation does not affect the status of the user.

##### Request

```sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_recovery_question" \
-d \
'{
    "password": { "value": "GoAw@y123" }, 
    "recovery_question": {
      "question" : "What happens when I update my question?",
      "answer": "My recovery credentials are updated" 
    } 
}'
```

##### Response

```json
{
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "What happens when I update my question?""
        }
    }
}
```
