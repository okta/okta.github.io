---
layout: docs_page
title: Users
redirect_from: "docs/api/rest/users.html"
---

* Will be replaced with the ToC
{:toc .list-unstyled .toc}

## Overview

The Okta User API provides operations to manage users in your organization.

## User Model

### Example

~~~ json
{
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-06-27T16:35:28.000Z",
    "passwordChanged": "2013-06-24T16:39:19.000Z",
    "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "secondEmail": "isaac2@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        },
        "provider": {
            "type": "OKTA",
            "name": "OKTA"
        }
    },
    "_links": {
        "resetPassword": {
            "href": "https://your-domain.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
        },
        "resetFactors": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
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
~~~

### Metadata Attributes

The User model defines several **read-only** attributes:

Attribute             | Description                                                   | DataType                                                                                            | Nullable
--------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -----
id                    | unique key for user                                           | String                                                                                              | FALSE
status                | current status of user                                        | `STAGED`, `PROVISIONED`, `ACTIVE`, `RECOVERY`, `LOCKED_OUT`, `PASSWORD_EXPIRED`, or `DEPROVISIONED` | FALSE
created               | timestamp when user was created                               | Date                                                                                                | FALSE
activated             | timestamp when transition to `ACTIVE` status completed        | Date                                                                                                | TRUE
statusChanged         | timestamp when status last changed                            | Date                                                                                                | TRUE
lastLogin             | timestamp of last login                                       | Date                                                                                                | TRUE
lastUpdated           | timestamp when user was last updated                          | Date                                                                                                | FALSE
passwordChanged       | timestamp when password last changed                          | Date                                                                                                | TRUE
transitioningToStatus | target status of an inprogress asynchronous status transition | `PROVISIONED`, `ACTIVE`, or `DEPROVISIONED`                                                         | TRUE

> Metadata attributes are only available after a user is created

> `activated` timestamp will only be available for users activated after *06/30/2013*.

> `statusChanged` and `lastLogin` timestamps will be missing for users created before *06/30/2013*.  They will be updated on next status change or login.

### User Status

![STAGED, PROVISIONED, ACTIVE, RECOVERY, LOCKED_OUT, PASSWORD_EXPIRED, or DEPROVISIONED](/assets/img/okta-user-status.png "Okta User Status Diagram")

### Profile Object

Specifies [standard](#standard-attributes) and [custom](#custom-attributes) profile attributes for a user.

~~~ json
{
   "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "secondEmail": "isaac2@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337",
        "customAttribute": true,
        "moreCustomAttribs": "Yes we can!"
    }
}
~~~

#### Standard Attributes

All profiles have the following attributes:

Attribute   | DataType | MinLength | MaxLength | Nullable | Unique | Validation
----------- | -------- | --------- | --------- | -------- | ------ | ----------
login       | String   | 5         | 100       | FALSE    | TRUE   | [RFC 6531 section 3.3](http://tools.ietf.org/html/rfc6531#section-3.3)
email       | String   | 5         | 100       | FALSE    | TRUE   | [RFC 5322 section 3.2.3](http://tools.ietf.org/html/rfc5322#section-3.2.3)
secondEmail | String   | 5         | 100       | TRUE    | TRUE   | [RFC 5322 section 3.2.3](http://tools.ietf.org/html/rfc5322#section-3.2.3)
firstName   | String   | 1         | 50        | FALSE    | FALSE  |
lastName    | String   | 1         | 50        | FALSE    | FALSE  |
mobilePhone | String   | 0         | 100       | TRUE     | FALSE  |

##### Okta Login

Every user within your Okta organization must have a unique identifier for a login.  This constraint applies to all users you import from other systems or applications such as Active Directory.  Your organization is the top-level namespace to mix and match logins from all your connected applications or directories.  Careful consideration of naming conventions for your login identifier will make it easier to onboard new applications in the future.

Okta has a default ambiguous name resolution policy for logins.  Users can login with their non-qualified short-name (e.g. `isaac` with login *isaac@example.org*) as long as the short-name is still unique within the organization.

> Avoid using a `login` with a `/` character.  Although `/` is a valid character according to [RFC 6531 section 3.3](http://tools.ietf.org/html/rfc6531#section-3.3), a user with this character in their `login` cannot be fetched by `login` ([see Get User by ID](#get-user-with-id)) due to security risks with escaping this character.

#### Custom Attributes

Custom attributes may be added to a user profile.  Custom attributes must be single-value (non-array) and have a data type of `Number`, `String`, `Boolean`, or `null`.

### Credentials Object

Specifies credentials for a user.  Credential types and requirements vary depending on the operation and security policy of the organization.

Attribute         | DataType                                              | MinLength | MaxLength | Nullable | Unique | Validation
----------------- | ----------------------------------------------------- | --------- | --------- | -------- | -------| ----------
password          | [Password Object](#password-object)                   |           |           | TRUE     | FALSE  |
recovery_question | [Recovery Question Object](#recovery-question-object) |           |           | TRUE     | FALSE  |
provider          | [Provider Object](#provider-object)                   |           |           | TRUE     | FALSE  |


> Some credential values are **write-only**

~~~ json
{
    "credentials": {
        "password" : { "value": "GoAw@y123" },
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?",
            "answer": "Cowboy Dan"
        },
        "provider": {
            "type": "OKTA",
            "name": "OKTA"
        }
    }
}
~~~

#### Password Object

Specifies a password for a user.  A password value is a **write-only** property.  When a user has a valid password and a response object contains a password credential, then the Password Object will be a bare object without the `value` property defined (e.g. `password: {}`) to indicate that a password value exists.

Attribute | DataType | MinLength         | MaxLength | Nullable | Unique | Validation
--------- | -------- | ----------------- | --------- | -------- | ------ | -----------------
value     | String   | *Password Policy* | 40        | TRUE     | FALSE  | *Password Policy*

##### Default Password Policy

- Must be a minimum of 8 characters
- Must have a character from the following groups:
  - Upper case
  - Lower case
  - Digit
- Must not contain the user's login or parts of the the login when split on the following characters: `,` `.` `_` `#` `@`
  - *For example, a user with login i.brock@example.org will not be able set password brockR0cks! as the password contains the login part brock*

> Password policy requirements can be modified in the Okta Admin UI *(Security -> Policies)*

#### Recovery Question Object

Specifies a secret question and answer that is validated when a user forgets their password.  The answer property is **write-only**.

Attribute | DataType | MinLength | MaxLength | Nullable | Unique | Validation
--------- | -------- | --------- | --------- | -------- | ------ | ----------
question  | String   | 1         | 100       | TRUE     | FALSE  |
answer    | String   | 1         | 100       | TRUE     | FALSE  |

#### Provider Object

Specifies the authentication provider that validates the user's password credential. The user's current provider is managed by the Delegated Authentication settings for your organization. The provider object is **read-only**.

Attribute | DataType | MinLength | MaxLength | Nullable | Unique | Validation
--------- | -------- | --------- | --------- | -------- | ------ | ----------
type      | `OKTA`, `ACTIVE_DIRECTORY`,`LDAP`, or `FEDERATION`     | 1         | 100       | FALSE    | FALSE  |
name      | String   | 1         | 100       | TRUE     | FALSE  |

> `ACTIVE_DIRECTORY` or `LDAP` providers specify the directory instance name as the `name` property.

### Links Object

Specifies link relations (See [Web Linking](http://tools.ietf.org/html/rfc5988)) available for the current status of a user.  The Links Object is used for dynamic discovery of related resources and lifecycle or credential operations.  The Links Object is **read-only**.

Link Relation Type     | Description
---------------------- | -----------
self                   | The actual user
activate               | [Lifecycle action](#activate-user) to transition user to `ACTIVE` status
deactivate             | [Lifecycle action](#deactivate-user) to transition user to `DEPROVISIONED` status
resetPassword          | [Lifecycle action](#reset-password) to transition user to `RECOVERY` status
expirePassword         | [Lifecycle action](#expire-password) to transition user to `PASSWORD_EXPIRED` status
resetFactors           | [Lifecycle action](#reset-factors) to reset all the MFA factors for the user
unlock                 | [Lifecycle action](#unlock-user) to returns a user to `ACTIVE` status when their current status is `LOCKED_OUT` due to exceeding failed login attempts
forgotPassword         | [Resets a user's password](#forgot-password) by validating the user's recovery credential.
changePassword         | [Changes a user's password](#change-password) validating the user's current password
changeRecoveryQuestion | [Changes a user's recovery credential](#change-recovery-question) by validating the user's current password

## User Operations

### Create User
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /users</span>

Creates a new user in your Okta organization with or without credentials:

- [Create User without Credentials](#create-user-without-credentials)
- [Create User with Recovery Question](#create-user-with-recovery-question)
- [Create User with Password](#create-user-with-password)
- [Create User with Password & Recovery Question](#create-user-with-password--recovery-question)

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter   | Description                                                                      | Param Type | DataType                                  | Required | Default
----------- | -------------------------------------------------------------------------------- | ---------- | ----------------------------------------- | -------- | -------
activate    | Executes [activation lifecycle](#activate-user) operation when creating the user | Query      | Boolean                                   | FALSE    | TRUE
profile     | Profile attributes for user                                                      | Body       | [Profile Object](#profile-object)         | TRUE     |
credentials | Credentials for user                                                             | Body       | [Credentials Object](#credentials-object) | FALSE    |

##### Response Parameters
{:.api .api-response .api-response-params}

All responses return the created [User](#user-model).  Activation of a user is an asynchronous operation.  The system will perform group reconcilation during activation and assign the user to all applications via direct or inderect relationships (group memberships).  The user will have the `transitioningToStatus` property with a value of `ACTIVE` during activation to indicate that the user hasn't completed the asynchronous operation.  The user will have a `status` of `ACTIVE` when the activation process is complete.

> The user will be emailed a one-time activation token if activated without a password

> If the user is assigned to an application that is also configured for provisioning, the activation process will also trigger downstream provisioning to the application.  It is possible for a user to login before these applications have been successfully provisioned for the user

Security Q & A | Password | Activate Query Parameter | User Status | Login Credential | Welcome Screen
:-: | :-: | :-: | :-------: | :------------------: | :-:
    |     |FALSE|STAGED     |                      |
    |     |TRUE |PROVISIONED|One-Time Token (Email)|X
X   |     |FALSE|STAGED     |                      |
X   |     |TRUE |PROVISIONED|One-Time Token (Email)|X
    |X    |FALSE|STAGED     |                      |
    |X    |TRUE |ACTIVE     |Password              |X
X   |X    |FALSE|STAGED     |                      |
X   |X    |TRUE |ACTIVE     |Password              |

#### Create User without Credentials
{:.api .api-operation}

Creates a user without a [password](#password-object) or [recovery question & answer](#recovery-question-object).  When the user is activated, an email is sent to the user with an activation token that the can be used to complete the activation process.  This is the default flow for new user registration with the Okta Admin UI

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
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
        "secondEmail": "isaac2@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    }
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "STAGED",
    "created": "2013-07-02T21:36:25.344Z",
    "activated": null,
    "statusChanged": null,
    "lastLogin": null,
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "passwordChanged": null,
    "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "secondEmail": "isaac2@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "provider": {
            "type": "OKTA",
            "name": "OKTA"
        }
    },
    "_links": {
        "activate": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/activate"
        }
    }
}
~~~

#### Create User with Recovery Question
{:.api .api-operation}

Creates a user without a [password](#password-object).  When the user is activated, an email is sent to the user with an activation token that the can be used to complete the activation process.  This flow is not common but might be useful if migrating users from an existing user store.

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
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
        "secondEmail": "isaac2@example.org",
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
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "STAGED",
    "created": "2013-07-02T21:36:25.344Z",
    "activated": null,
    "statusChanged": null,
    "lastLogin": null,
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "passwordChanged": null,
    "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "secondEmail": "isaac2@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        },
        "provider": {
            "type": "OKTA",
            "name": "OKTA"
        }
    },
    "_links": {
        "activate": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/activate"
        }
    }
}
~~~

#### Create User with Password
{:.api .api-operation}

Creates a user without a [recovery question & answer](#recovery-question-object).  The new user will immediately be able to login after activation with the assigned password.  This flow is common when developing a custom user registration experience.

> Do not generate or send a one-time activation token when activating users with an assigned password.  Users should login with their assigned password.

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
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
        "secondEmail": "isaac2@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "password" : { "value": "GoAw@y123" }
    }
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "STAGED",
    "created": "2013-07-02T21:36:25.344Z",
    "activated": null,
    "statusChanged": null,
    "lastLogin": null,
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "passwordChanged": "2013-07-02T21:36:25.344Z",
    "profile": {
      "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "secondEmail": "isaac2@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "password": {},
        "provider": {
           "type": "OKTA",
           "name": "OKTA"
        }
    },
    "_links": {
        "activate": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/activate"
        }
    }
}
~~~

#### Create User with Password & Recovery Question
{:.api .api-operation}

Creates a new user with a [password](#password-object) and [recovery question & answer](#recovery-question-object).  The new user will immediately be able to login after activation with the assigned password.  This flow is common when developing a custom user registration experience.

> Do not generate or send a one-time activation token when activating users with an assigned password.  Users should login with their assigned password.

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
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
        "secondEmail": "isaac2@example.org",
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
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "STAGED",
    "created": "2013-07-02T21:36:25.344Z",
    "activated": null,
    "statusChanged": null,
    "lastLogin": null,
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "passwordChanged": "2013-07-02T21:36:25.344Z",
    "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "secondEmail": "isaac2@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "password" : {},
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        },
        "provider": {
            "type": "OKTA",
            "name": "OKTA"
       }
    },
    "_links": {
        "activate": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/activate"
        }
    }
}
~~~

### Get User
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /users/*:id*</span><span class="api-label api-label-cors api-uri-template-cors pull-right"><i class="fa fa-cloud-download"></i> CORS</span>

Fetches a user from your Okta organization

##### Request Parameters
{:.api .api-request .api-request-params}

Fetch a specific user by `id`, `login`, or login shortname *(as long as it is unambiguous)*.

Parameter | Description                                                        | Param Type | DataType | Required | Default
--------- | ------------------------------------------------------------------ | ---------- | -------- | -------- | -------
id        | `id`, `login`, or *login shortname* (as long as it is unambiguous) | URL        | String   | TRUE     |

> When fetching a user by `login` or `login shortname`, you should [URL encode](http://en.wikipedia.org/wiki/Percent-encoding) the request parameter to ensure special characters are escaped properly.  Logins with a `/` character can only be fetched by 'id' due to URL issues with escaping the `/` character.

>You can substitute *me* for the id to fetch the current user linked to API token or session cookie.

##### Response Parameters
{:.api .api-response .api-response-params}

Fetched [User](#user-model)

Invalid `id` will return a `404 Not Found` status code.

~~~ ruby
HTTP/1.1 404 Not Found
Content-Type: application/json

{
    "errorCode": "E0000007",
    "errorSummary": "Not found: Resource not found: missing@example.com (User)",
    "errorLink": "E0000007",
    "errorId": "oaewgzWY_IaSs6G8Cf2TzzIsA",
    "errorCauses": []
}
~~~

#### Get Current User
{:.api .api-operation}

Fetches the current user linked to API token or session cookie

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users/me"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "passwordChanged": "2013-07-02T21:36:25.344Z",
    "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "secondEmail": "isaac2@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        },
        "provider": {
            "type": "OKTA",
            "name": "OKTA"
        }
    },
    "_links": {
        "resetPassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
        },
        "resetFactors": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
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
~~~

#### Get User with ID
{:.api .api-operation}

Fetches a specific user when you know the user's `id`. See the filters section below for an example of fetching multiple ids.

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "passwordChanged": "2013-07-02T21:36:25.344Z",
    "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "secondEmail": "isaac2@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        },
        "provider": {
            "type": "OKTA",
            "name": "OKTA"
        }
    },
    "_links": {
        "resetPassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
        },
        "resetFactors": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
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
~~~

#### Get User with Login
{:.api .api-operation}

Fetches a specific user when you know the user's `login`

> When fetching a user by `login`, you should [URL encode](http://en.wikipedia.org/wiki/Percent-encoding) the request parameter to ensure special characters are escaped properly.  Logins with a `/` character can only be fetched by 'id' due to URL issues with escaping the `/` character.

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users/isaac%40example.org"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "passwordChanged": "2013-07-02T21:36:25.344Z",
    "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "secondEmail": "isaac2@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        },
        "provider": {
          "type": "OKTA",
          "name": "OKTA"
        }
    },
    "_links": {
        "resetPassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
        },
        "resetFactors": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
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
~~~

#### Get User with Login Shortname
{:.api .api-operation}

Fetches a specific user when you know the user's `login shortname` and the shortname is unique within the organization

> When fetching a user by `login shortname`, you should [URL encode](http://en.wikipedia.org/wiki/Percent-encoding) the request parameter to ensure special characters are escaped properly.  Logins with a `/` character can only be fetched by 'id' due to URL issues with escaping the `/` character.

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users/isaac"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "passwordChanged": "2013-07-02T21:36:25.344Z",
    "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "secondEmail": "isaac2@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        },
        "provider": {
            "type": "OKTA",
            "name": "OKTA"
        }
    },
    "_links": {
        "resetPassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
        },
        "resetFactors": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
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
~~~

### List Users
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /users</span>

Enumerates users in your organization with pagination.  A subset of users can be returned that match a supported filter expression or query.

- [List Users with Defaults](#list-users-with-defaults)
- [List Users with Search](#list-users-with-search)
- [List Users Updated after Timestamp](#list-users-updated-after-timestamp)
- [List Users with Status](#list-users-with-status)

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                                                          | Param Type | DataType | Required | Default
--------- | ------------------------------------------------------------------------------------ | ---------- | -------- | -------- | -------
q         | Searches `firstName`, `lastName`, and `email` attributes of users for matching value | Query      | String   | FALSE    |
limit     | Specified the number of results                                                      | Query      | Number   | FALSE    | 200
filter    | [Filter expression](/docs/getting_started/design_principles.html#filtering) for users   | Query      | String   | FALSE    |
after     | Specifies the pagination cursor for the next page of users                           | Query      | String   | FALSE    |

> The `after` cursor should treated as an opaque value and obtained through the next link relation. See [Pagination](/docs/getting_started/design_principles.html#pagination)

> Search currently performs a startsWith match but it should be considered an implementation detail and may change without notice in the future

> The limit of 200 applies to new organizations and will be rolled out to existing organizations over time.

###### Filters

The following expressions are supported for users with the `filter` query parameter:

Filter                                         | Description
---------------------------------------------- | ------------------------------------------------
`status eq "STAGED"`                           | Users that have a `status` of `STAGED`
`status eq "PROVISIONED"`                      | Users that have a `status` of `PROVISIONED`
`status eq "ACTIVE"`                           | Users that have a `status` of `ACTIVE`
`status eq "RECOVERY"`                         | Users that have a `status` of `RECOVERY`
`status eq "PASSWORD_EXPIRED"`                 | Users that have a `status` of `PASSWORD_EXPIRED`
`status eq "LOCKED_OUT"`                       | Users that have a `status` of `LOCKED_OUT`
`status eq "DEPROVISIONED"`                    | Users that have a `status` of `DEPROVISIONED`
`lastUpdated lt "yyyy-MM-dd'T'HH:mm:ss.SSSZZ"` | Users last updated before a specific datetime
`lastUpdated eq "yyyy-MM-dd'T'HH:mm:ss.SSSZZ"` | Users last updated at a specific datetime
`lastUpdated gt "yyyy-MM-dd'T'HH:mm:ss.SSSZZ"` | Users last updated after a specific datetime
`id eq "00u1ero7vZFVEIYLWPBN"`                 | Users with a specified `id`
`profile.login eq "login@example.com"`         | Users with a specified `login`
`profile.email eq "email@example.com"`         | Users with a specified `email`*
`profile.firstName eq "John"`                  | Users with a specified `firstName`*
`profile.lastName eq "Smith" `                 | Users with a specified `lastName`*

\* If filtering by `email`, `lastName`, or `firstName`, Okta recommends the [User query API](#list-users-with-search). These profile filters are here for your convenience.

See [Filtering](/docs/getting_started/design_principles.html#filtering) for more information on expressions

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
{:.api .api-response .api-response-params}

Array of [User](#user-model)

#### List Users with Defaults
{:.api .api-operation}

Enumerates all users that do not have a status of `DEPROVISIONED`

The default user limit is set to a very high number due to historical reasons which is no longer valid for most organizations.  This will change in a future version of this API.  The recommended page limit is now `limit=200`.

> If you receive a HTTP 500 status code, you more than likely have exceeded the request timeout.  Retry your request with a smaller `limit` and page the results (See [Pagination](/docs/getting_started/design_principles.html#pagination))

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users?limit=200"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ ruby
HTTP/1.1 200 OK
Content-Type: application/json
Link: <https://your-domain.okta.com/api/v1/users?limit=200>; rel="self"
Link: <https://your-domain.okta.com/api/v1/users?after=00ud4tVDDXYVKPXKVLCO&limit=200>; rel="next"

[
    {
        "id": "00ub0oNGTSWTBKOLGLNR",
        "status": "STAGED",
        "created": "2013-07-02T21:36:25.344Z",
        "activated": null,
        "statusChanged": null,
        "lastLogin": null,
        "lastUpdated": "2013-07-02T21:36:25.344Z",
        "passwordChanged": "2013-07-02T21:36:25.344Z",
        "profile": {
            "firstName": "Isaac",
            "lastName": "Brock",
            "email": "isaac@example.org",
            "secondEmail": "isaac2@example.org",
            "login": "isaac@example.org",
            "mobilePhone": "555-415-1337"
        },
        "credentials": {
            "provider": {
               "type": "OKTA",
               "name": "OKTA"
            }
        },
        "_links": {
            "activate": {
                "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/activate"
            }
        }
    },
    {
        "id": "00ub0oNGTSWTBKOLGLNR",
        "status": "ACTIVE",
        "created": "2013-06-24T16:39:18.000Z",
        "activated": "2013-06-24T16:39:19.000Z",
        "statusChanged": "2013-06-24T16:39:19.000Z",
        "lastLogin": "2013-06-24T17:39:19.000Z",
        "lastUpdated": "2013-07-02T21:36:25.344Z",
        "passwordChanged": "2013-07-02T21:36:25.344Z",
        "profile": {
            "firstName": "Eric",
            "lastName": "Judy",
            "email": "eric@example.org",
            "secondEmail": "isaac2@example.org",
            "login": "eric@example.org",
            "mobilePhone": "555-415-2011"
        },
        "credentials": {
            "password": {},
            "recovery_question": {
                "question": "The stars are projectors?"
            },
            "provider": {
                "type": "OKTA",
                "name": "OKTA"
            }
        },
        "_links": {
            "resetPassword": {
                "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
            },
            "resetFactors": {
                "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
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
]
~~~

#### List Users with Search
{:.api .api-operation}

Searches for user by `firstName`, `lastName`, or `email` value.  This operation is ideal for implementing a people picker. This operation does not support pagination.

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users?q=er&limit=1"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[
    {
        "id": "00ub0oNGTSWTBKOLGLNR",
        "status": "ACTIVE",
        "created": "2013-06-24T16:39:18.000Z",
        "activated": "2013-06-24T16:39:19.000Z",
        "statusChanged": "2013-06-24T16:39:19.000Z",
        "lastLogin": "2013-06-24T17:39:19.000Z",
        "lastUpdated": "2013-07-02T21:36:25.344Z",
        "passwordChanged": "2013-07-02T21:36:25.344Z",
        "profile": {
            "firstName": "Eric",
            "lastName": "Judy",
            "email": "eric@example.org",
            "secondEmail": "eric2@example.org",
            "login": "eric@example.org",
            "mobilePhone": "555-415-2011"
        },
        "credentials": {
            "password": {},
            "recovery_question": {
                "question": "The stars are projectors?"
            },
            "provider": {
                "type": "OKTA",
                "name": "OKTA"
            }
        },
        "_links": {
            "resetPassword": {
                "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
            },
            "resetFactors": {
                "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
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
]
~~~

#### List Users Updated after Timestamp
{:.api .api-operation}

Enumerates all users that have been updated since a specific timestamp.  Use this operation when implementing a background synchronization job and you want to poll for changes.

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users?filter=lastUpdated+gt+\"2013-07-01T00:00:00.000Z\""
~~~

##### Response Example

~~~json
[
    {
        "id": "00ub0oNGTSWTBKOLGLNR",
        "status": "ACTIVE",
        "created": "2013-06-24T16:39:18.000Z",
        "activated": "2013-06-24T16:39:19.000Z",
        "statusChanged": "2013-06-24T16:39:19.000Z",
        "lastLogin": "2013-06-24T17:39:19.000Z",
        "lastUpdated": "2013-07-02T21:36:25.344Z",
        "passwordChanged": "2013-07-02T21:36:25.344Z",
        "profile": {
            "firstName": "Eric",
            "lastName": "Judy",
            "email": "eric@example.org",
            "secondEmail": "eric2@example.org",
            "login": "eric@example.org",
            "mobilePhone": "555-415-2011"
        },
        "credentials": {
            "password": {},
            "recovery_question": {
                "question": "The stars are projectors?"
            },
            "provider": {
                "type": "OKTA",
                "name": "OKTA"
            }
        },
        "_links": {
            "resetPassword": {
                "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
            },
            "resetFactors": {
                "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
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
]
~~~

#### List Users with Status
{:.api .api-operation}

Enumerates all users that have a specific status.

> Users with a status of `DEPROVISIONED` are not enumerated by default and must be explicitly requested with a status filter.

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users?filter=status+eq+\"ACTIVE\"+or+status+eq+\"RECOVERY\""
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[
    {
        "id": "00ub0oNGTSWTBKOLGLNR",
        "status": "ACTIVE",
        "created": "2013-06-24T16:39:18.000Z",
        "activated": "2013-06-24T16:39:19.000Z",
        "statusChanged": "2013-06-24T16:39:19.000Z",
        "lastLogin": "2013-06-24T17:39:19.000Z",
        "lastUpdated": "2013-07-02T21:36:25.344Z",
        "passwordChanged": "2013-07-02T21:36:25.344Z",
        "profile": {
            "firstName": "Eric",
            "lastName": "Judy",
            "email": "eric@example.org",
            "secondEmail": "eric2@example.org",
            "login": "eric@example.org",
            "mobilePhone": "555-415-2011"
        },
        "credentials": {
            "password": {},
            "recovery_question": {
                "question": "The stars are projectors?"
            },
            "provider": {
                "type": "OKTA",
                "name": "OKTA"
            }
        },
        "_links": {
            "resetPassword": {
                "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
            },
            "resetFactors": {
                "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
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
                "href": "https://your-domain.okta.com/api/v1/users/000ub0oNGTSWTBKOLGLNR/credentials/change_password"
            }
        }
    }
]
~~~

### Update User
{:.api .api-operation}

> Use the POST method to make a partial update. Use the PUT method to delete unspecified attributes.

<span class="api-uri-template api-uri-put"><span class="api-label">PUT</span> /users/*:id*</span>

Update a user's profile and/or credentials.

> All profile attributes must be specified when updating a user's profile with this method. Any attribute not specified
is deleted. Do not use this method for partial updates.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter   | Description                 | Param Type | DataType                                  | Required | Default
----------- | --------------------------- | ---------- | ----------------------------------------- | -------- | -------
id          | `id` of user to update      | URL        | String                                    | TRUE     |
profile     | Updated profile for user    | Body       | [Profile Object](#profile-object)         | FALSE    |
credentials | Update credentials for user | Body       | [Credentials Object](#credentials-object) | FALSE    |

`profile` and `credentials` can be updated independently or with a single request.

> All profile attributes must be specified when updating a user's profile.  **Partial updates are not supported**!

##### Response Parameters
{:.api .api-response .api-response-params}

Updated [User](#user-model)

#### Update Profile
{:.api .api-operation}

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
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
        "secondEmail": "isaac2@example.org",
        "login": "isaac.brock@example.org",
        "mobilePhone": "555-415-1337",
        "isManager": false
    }
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "passwordChanged": "2013-07-02T21:36:25.344Z",
    "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "secondEmail": "isaac2@example.org",
        "login": "isaac.brock@example.org",
        "mobilePhone": "555-415-1337",
        "isManager": false
    },
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        },
        "provider": {
            "type": "OKTA",
            "name": "OKTA"
        }
    },
    "_links": {
        "resetPassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
        },
        "resetFactors": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
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
~~~

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /users/*:id*</span>

Update a user's profile and/or credentials. Use this method for a partial update.

> Only the profile attributes to change must be specified when updating a user's profile with this method. Any attribute not specified
is unchanged. Use this method for partial updates.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter   | Description                 | Param Type | DataType                                  | Required | Default
----------- | --------------------------- | ---------- | ----------------------------------------- | -------- | -------
id          | `id` of user to update      | URL        | String                                    | TRUE     |
profile     | Updated profile for user    | Body       | [Profile Object](#profile-object)         | FALSE    |
credentials | Update credentials for user | Body       | [Credentials Object](#credentials-object) | FALSE    |

`profile` and `credentials` can be updated independently or with a single request.

##### Response Parameters
{:.api .api-response .api-response-params}

Updated [User](#user-model)

#### Update Profile
{:.api .api-operation}

##### Request Example
{:.api .api-request .api-request-example}

This example updates the second email field only.

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR" \
-d \
'{
    "profile": {
        "secondEmail": "isaacDirect@example.org"
    }
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "passwordChanged": "2013-07-02T21:36:25.344Z",
    "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "secondEmail": "isaacDirect@example.org",
        "login": "isaac.brock@example.org",
        "mobilePhone": "555-415-1337",
        "isManager": false
    },
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        },
        "provider": {
            "type": "OKTA",
            "name": "OKTA"
        }
    },
    "_links": {
        "resetPassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
        },
        "resetFactors": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
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
~~~


#### Set Password
{:.api .api-operation}

This is an administrative operation and does not validate existing user credentials.  For operations that validate credentials refer to:

- [Reset Password](#reset-password)
- [Forgot Password](#forgot-password)
- [Change Password](#change-password)

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
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
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "passwordChanged": "2013-07-02T21:36:25.344Z",
    "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "secondEmail": "isaac2@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        },
        "provider": {
             "type": "OKTA",
             "name": "OKTA"
        }
    },
    "_links": {
        "resetPassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
        },
        "resetFactors": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
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
~~~

#### Set Recovery Question & Answer
{:.api .api-operation}

This is an administrative operation and does not validate existing user credentials.  See [Change Recovery Question](#change-recovery-question) for an operation that requires validation

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
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
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "passwordChanged": "2013-07-02T21:36:25.344Z",
    "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "secondEmail": "isaac2@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "I have a new recovery question?"
        },
        "provider": {
            "type": "OKTA",
            "name": "OKTA"
        }
    },
    "_links": {
        "resetPassword": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
        },
        "resetFactors": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
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
~~~

## Related Resources

### Get Assigned App Links
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /users/*:id*/appLinks</span><span class="api-label api-label-cors pull-right"><i class="fa fa-cloud-download"></i> CORS</span>

Fetches appLinks for all direct or indirect (via group membership) assigned applications

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description  | Param Type | DataType | Required | Default
--------- | ------------ | ---------- | -------- | -------- | -------
id        | `id` of user | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

Array of App Links

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/appLinks"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[
    {
        "id": "00ub0oNGTSWTBKOLGLNR",
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
        "id": "00ub0oNGTSWTBKOLGLNR",
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
        "id": "00ub0oNGTSWTBKOLGLNR",
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
        "id": "00ub0oNGTSWTBKOLGLNR",
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
~~~

### Get Member Groups
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /users/*:id*/groups</span><span class="api-label api-label-cors pull-right"><i class="fa fa-cloud-download"></i> CORS</span>

Fetches the groups of which the user is a member.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description  | Param Type | DataType | Required | Default
--------- | ------------ | ---------- | -------- | -------- | -------
id        | `id` of user | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

Array of [Groups](groups.html)

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/groups"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
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
~~~

## Lifecycle Operations

Lifecycle operations are non-idempotent operations that initiate a state transition for a user's status.  Some operations are asynchronous while others are synchronous.  The user's current status limits what operations are allowed.  For example, you can't unlock a user that is `ACTIVE`.

### Activate User
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /users/*:id*/lifecycle/activate</span>

Activates a user.  This operation can only be performed on users with a `STAGED` status.  Activation of a user is an asynchronous operation.  The user will have the `transitioningToStatus` property with a value of `ACTIVE` during activation to indicate that the user hasn't completed the asynchronous operation.  The user will have a status of `ACTIVE` when the activation process is complete.

> Users that do not have a password must complete the welcome flow by visiting the activation link to complete the transition to `ACTIVE` status.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                     | Param Type | DataType | Required | Default
--------- | ----------------------------------------------- | ---------- | -------- | -------- | -------
id        | `id` of user                                    | URL        | String   | TRUE     |
sendEmail | Sends an activation email to the user if `true` | Query      | Boolean  | FALSE    | TRUE

##### Response Parameters
{:.api .api-response .api-response-params}

Returns empty object by default. When `sendEmail` is `false`, returns an activation link for the user to set up their account.

~~~json
{
  "activationUrl": "https://your-domain.okta.com/welcome/XE6wE17zmphl3KqAPFxO""
}
~~~

> If a password was set before the user was activated, then user must login with with their password and not the activation link

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/activate?sendEmail=false"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
  "activationUrl": "https://your-domain.okta.com/welcome/XE6wE17zmphl3KqAPFxO"
}
~~~

### Deactivate User
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /users/*:id*/lifecycle/deactivate</span>

Deactivates a user.  This operation can only be performed on users that do not have a `DEPROVISIONED` status.  Deactivation of a user is an asynchronous operation.  The user will have the `transitioningToStatus` property with a value of `DEPROVISIONED` during deactivation to indicate that the user hasn't completed the asynchronous operation.  The user will have a status of `DEPROVISIONED` when the deactivation process is complete.

> Deactivating a user is a **destructive** operation.  The user will be deprovisioned from all assigned applications which may destroy their data such as email or files.  **This action cannot be recovered!**

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description  | Param Type | DataType | Required | Default
--------- | ------------ | ---------- | -------- | -------- | -------
id        | `id` of user | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

Returns an empty object.

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ ruby
HTTP/1.1 200 OK
Content-Type: application/json
~~~

### Tombstone User
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /users/*:id*/lifecycle/tombstone_login</span>

When a user is deactivated, the user name is reserved and is not available for another user. If you "tombstone" a deprovisioned user, the login
name is replaced with the user's id, so you can reuse the name. 

Best Practice: Do not tombstone a user if there is a chance you will reactivate the user in the future.


> Only tombstone a user that is in `DEPROVISIONED` status.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description  | Param Type | DataType | Required | Default
--------- | ------------ | ---------- | -------- | -------- | -------
id        | `id` of user | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

Returns an empty object.

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/tombstone_login"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ ruby
HTTP/1.1 200 OK
Content-Type: application/json
~~~


### Unlock User
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /users/*:id*/lifecycle/unlock</span>

Unlocks a user with a `LOCKED_OUT` status and returns them to `ACTIVE` status.  Users will be able to login with their current password.

> This operation currently only works with Okta-mastered users and does not support directory-mastered accounts such as Active Directory.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description  | Param Type | DataType | Required | Default
--------- | ------------ | ---------- | -------- | -------- | -------
id        | `id` of user | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

Returns an empty object

##### Request Example
~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/unlock"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ ruby
HTTP/1.1 200 OK
Content-Type: application/json
~~~

### Reset Password
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /users/*:id*/lifecycle/reset_password</span>

Generates a one-time token (OTT) that can be used to reset a user's password.  The OTT link can be automatically emailed to the user or returned to the API caller and distributed using a custom flow.

This operation will transition the user to the status of `RECOVERY` and the user will not be able to login or initiate a forgot password flow until they complete the reset flow.

**Note:** You can also use this API to convert a user with the Okta Credential Provider to a use a Federated Provider. After this conversion, the user cannot directly sign in with password. The second example demonstrate this usage.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                      | Param Type | DataType | Required | Default
--------- | ------------------------------------------------ | ---------- | -------- | -------- | -------
id        | `id` of user                                     | URL        | String   | TRUE     |
sendEmail | Sends reset password email to the user if `true` | Query      | Boolean  | FALSE    | TRUE

##### Response Parameters
{:.api .api-response .api-response-params}

Returns an empty object by default. When `sendEmail` is `false`, returns a link for the user to reset their password.

~~~json
{
  "resetPasswordUrl": "https://your-domain.okta.com/reset_password/XE6wE17zmphl3KqAPFxO"
}
~~~

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password?sendEmail=false"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "resetPasswordUrl": "https://your-domain.okta.com/reset_password/XE6wE17zmphl3KqAPFxO"
}
~~~

##### Request Example (Convert a User to a Federated User)
{:.api .api-request .api-request-example}

To convert a user to a federated user, pass `FEDERATED` as the ***provider*** in the [Provider Object](#provider-object). The `sendEmail`
parameter must be false or omitted for this type of conversion.

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/user/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password?provider=FEDERATION&sendEmail=false"

~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "resetPasswordUrl": "https://your-domain.okta.com/reset_password/XE6wE17zmphl3KqAPFxO"
}
~~~



### Expire Password
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /users/*:id*/lifecycle/expire_password</span>

This operation will transition the user to the status of `PASSWORD_EXPIRED` and the user will be required to change their password at their next login. If `tempPassword` is passed, the user's password is reset to a temporary password that is returned, and then the temporary password is expired.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                                  | Param Type | DataType | Required | Default
------------ | ------------------------------------------------------------ | ---------- | -------- | -------- | -------
id           | `id` of user                                                 | URL        | String   | TRUE     |
tempPassword | Sets the user's password to a temporary password,  if `true` | Query      | Boolean  | FALSE    | FALSE

##### Response Parameters
{:.api .api-response .api-response-params}

Returns an the complete user object by default. When `tempPassword` is `true`, returns the temporary password.

~~~json
{
    "tempPassword": "HR076gb6"
}
~~~

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password?tempPassword=false"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-06-27T16:35:28.000Z",
    "passwordChanged": "2013-06-24T16:39:19.000Z",
    "profile": {
        "firstName": "Isaac",
        "lastName": "Brock",
        "email": "isaac@example.org",
        "secondEmail": "isaac2@example.org",
        "login": "isaac@example.org",
        "mobilePhone": "555-415-1337"
    },
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        },
        "provider": {
            "type": "OKTA",
            "name": "OKTA"
        }
    },
    "_links": {
        "resetPassword": {
            "href": "https://your-domain.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
        },
        "resetFactors": {
            "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
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
~~~

### Reset Factors
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /users/*:id*/lifecycle/reset_factors</span>

This operation resets all factors for the specified user. All MFA factor enrollments returned to the unenrolled state. The user's status remains ACTIVE. This link is present only if the user is currently enrolled in one or more MFA factors.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                                  | Param Type | DataType | Required | Default
------------ | ------------------------------------------------------------ | ---------- | -------- | -------- | -------
id           | `id` of user                                                 | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

Returns an empty object by default.

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors”
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ ruby
HTTP/1.1 200 OK
Content-Type: application/json
~~~



## Credential Operations

### Forgot Password
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /users/*:id*/lifecycle/forgot_password</span>

Generates a one-time token (OTT) that can be used to reset a user's password.  The user will be required to validate their security question's answer when visiting the reset link.  This operation can only be performed on users with a valid [recovery question credential](#recovery-question-object) and have an `ACTIVE` status.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
id           | `id` of user                                        | URL        | String   | TRUE     |
sendEmail    | Sends a forgot password email to the user if `true` | Query      | Boolean  | FALSE    | TRUE

##### Response Parameters
{:.api .api-response .api-response-params}

Returns an empty object by default. When `sendEmail` is `false`, returns a link for the user to reset their password.

~~~json
{
  "resetPasswordUrl": "https://your-domain.okta.com/reset_password/XE6wE17zmphl3KqAPFxO"
}
~~~
> This operation does not affect the status of the user.

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/forgot_password?sendEmail=false"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "resetPasswordUrl": "https://your-domain.okta.com/reset_password/XE6wE17zmphl3KqAPFxO"
}
~~~

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /users/*:id*/credentials/forgot_password</span>

Sets a new password for a user by validating the user's answer to their current recovery question.  This operation can only be performed on users with a valid [recovery question credential](#recovery-question-object) and have an `ACTIVE` status.

> This operation is intended for applications that need to implement their own forgot password flow.  You are responsible for mitigation of all security risks such as phishing and replay attacks.  Best-practice is to generate a short-lived one-time token (OTT) that is sent to a verified email account.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter         | Description                                | Param Type | DataType                                              | Required | Default
----------------- | ------------------------------------------ | ---------- | ----------------------------------------------------- | -------- | -------
id                | `id` of user                               | URL        | String                                                | TRUE     |
password          | New password for user                      | Body       | [Password Object](#password-object)                   | TRUE     |
recovery_question | Answer to user's current recovery question | Body       | [Recovery Question Object](#recovery-question-object) | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[Credentials](#credentials-object) of the user

> This operation does not affect the status of the user.

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password" \
-d \
'{
    "password": { "value": "MyN3wP@55w0rd" },
    "recovery_question": { "answer": "Cowboy Dan" }
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        },
        "provider": {
           "type": "OKTA",
           "name": "OKTA"
        }
    }
}
~~~

### Change Password
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /users/*:id*/credentials/change_password</span>

Changes a user's password by validating the user's current password.  This operation can only be performed on users in `STAGED`, `ACTIVE`, `PASSWORD_EXPIRED`, or `RECOVERY` status that have a valid [password credential](#password-object)

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter   | Description               | Param Type | DataType                            | Required | Default
------------| --------------------------| ---------- | ------------------------------------| -------- | -------
id          | `id` of user              | URL        | String                              | TRUE     |
oldPassword | Current password for user | Body       | [Password Object](#password-object) | TRUE     |
newPassword | New password for user     | Body       | [Password Object](#password-object) | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[Credentials](#credentials-object) of the user

> The user will transition to `ACTIVE` status when successfully invoked in `RECOVERY` status

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_password" \
-d \
'{
    "oldPassword": { "value": "GoAw@y123" },
    "newPassword": { "value": "MyN3wP@55w0rd" }
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "Who's a major player in the cowboy scene?"
        },
        "provider": {
           "type": "OKTA",
           "name": "OKTA"
        }
    }
}
~~~

### Change Recovery Question
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /users/*:id*/credentials/change_recovery_question</span>

Changes a user's recovery question & answer credential by validating the user's current password.  This operation can only be performed on users in **STAGED**, **ACTIVE** or **RECOVERY** `status` that have a valid [password credential](#password-object)

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter         | Description                             | Param Type | DataType                                              | Required | Default
----------------- | --------------------------------------- | ---------- | ----------------------------------------------------- | -------- | -------
id                | `id` of user                            | URL        | String                                                | TRUE     |
password          | Current password for user               | Body       | [Password Object](#password-object)                   | TRUE     |
recovery_question | New recovery question & answer for user | Body       | [Recovery Question Object](#recovery-question-object) | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[Credentials](#credentials-object) of the user

> This operation does not affect the status of the user.

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
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
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
    "credentials": {
        "password": {},
        "recovery_question": {
            "question": "What happens when I update my question?"
        },
        "provider": {
           "type": "OKTA",
           "name": "OKTA"
        }
    }
}
~~~