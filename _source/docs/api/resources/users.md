---
layout: docs_page
title: Users
redirect_from: "docs/api/rest/users.html"
---

## Overview

The Okta User API provides operations to manage users in your organization.

## User Model

### Example

~~~json
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
    "login": "isaac.brock@example.com",
    "firstName": "Isaac",
    "lastName": "Brock",
    "nickName": "issac",
    "displayName": "Isaac Brock",
    "email": "isaac.brock@example.com",
    "secondEmail": "isaac@example.org",
    "profileUrl": "http://www.example.com/profile",
    "preferredLanguage": "en-US",
    "userType": "Employee",
    "organization": "Okta",
    "title": "Director",
    "division": "R&D",
    "department": "Engineering",
    "costCenter": "10",
    "employeeNumber": "187",
    "mobilePhone": "+1-555-415-1337",
    "primaryPhone": "+1-555-514-1337",
    "streetAddress": "301 Brannan St.",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94107",
    "countryCode": "US"
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

### User Properties

The User model defines several **read-only** properties:

|-----------------------+-----------------------------------------------------------------+-----------------------------------------------------------------------------------------------------+----------+--------+----------+-----------+-----------+------------|
| Property              | Description                                                     | DataType                                                                                            | Nullable | Unique | Readonly | MinLength | MaxLength | Validation |
| --------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------| -------- | ------ | -------- | --------- | --------- | ---------- |
| id                    | unique key for user                                             | String                                                                                              | FALSE    | TRUE   | TRUE     |           |           |            |
| status                | current [status](#user-status) of user                          | `STAGED`, `PROVISIONED`, `ACTIVE`, `RECOVERY`, `LOCKED_OUT`, `PASSWORD_EXPIRED`, or `DEPROVISIONED` | FALSE    | FALSE  | TRUE     |           |           |            |
| created               | timestamp when user was created                                 | Date                                                                                                | FALSE    | FALSE  | TRUE     |           |           |            |
| activated             | timestamp when transition to `ACTIVE` status completed          | Date                                                                                                | FALSE    | FALSE  | TRUE     |           |           |            |
| statusChanged         | timestamp when status last changed                              | Date                                                                                                | TRUE     | FALSE  | TRUE     |           |           |            |
| lastLogin             | timestamp of last login                                         | Date                                                                                                | TRUE     | FALSE  | TRUE     |           |           |            |
| lastUpdated           | timestamp when user was last updated                            | Date                                                                                                | FALSE    | FALSE  | TRUE     |           |           |            |
| passwordChanged       | timestamp when password last changed                            | Date                                                                                                | TRUE     | FALSE  | TRUE     |           |           |            |
| transitioningToStatus | target status of an in-progress asynchronous status transition  | `PROVISIONED`, `ACTIVE`, or `DEPROVISIONED`                                                         | TRUE     | FALSE  | TRUE     |           |           |            |
| profile               | user profile properties                                         | [Profile Object](#profile-object)                                                                   | FALSE    | FALSE  | FALSE    |           |           |            |
| credentials           | user's primary authentication and recovery credentials          | [Credentials Object](#credentials-object)                                                           | FALSE    | FALSE  | FALSE    |           |           |            |
| _embedded             | embedded resources related to the user                          | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06)                                      | TRUE     | FALSE  | TRUE     |           |           |            |
| _links                | [link relations](#links-object) for the user's current `status` | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06)                                      | TRUE     | FALSE  | TRUE     |           |           |            |
|-----------------------+-----------------------------------------------------------------+-----------------------------------------------------------------------------------------------------+----------+--------+----------+-----------+-----------+------------|

> Metadata properties such as `id`, `status`, timestamps, `_links`, and `_embedded` are only available after a user is created.

> `activated` timestamp will only be available for users activated after *06/30/2013*.<br>
> `statusChanged` and `lastLogin` timestamps will be missing for users created before *06/30/2013* and updated on next status change or login.

### User Status

The following diagram shows the state model for a user:

![STAGED, PROVISIONED, ACTIVE, RECOVERY, LOCKED_OUT, PASSWORD_EXPIRED, or DEPROVISIONED](/assets/img/okta-user-status.png "Okta User Status Diagram")

### Profile Object

Specifies [standard](#standard-profile-properties) and [custom](#custom-profile-properties) profile properties for a user.

~~~json
{
  "profile": {
    "login": "isaac.brock@example.com",
    "firstName": "Isaac",
    "lastName": "Brock",
    "nickName": "issac",
    "displayName": "Isaac Brock",
    "email": "isaac.brock@example.com",
    "secondEmail": "isaac@example.org",
    "profileUrl": "http://www.example.com/profile",
    "preferredLanguage": "en-US",
    "userType": "Employee",
    "organization": "Okta",
    "title": "Director",
    "division": "R&D",
    "department": "Engineering",
    "costCenter": "10",
    "employeeNumber": "187",
    "mobilePhone": "+1-555-415-1337",
    "primaryPhone": "+1-555-514-1337",
    "streetAddress": "301 Brannan St.",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94107",
    "countryCode": "US"
  }
}
~~~

#### Default Profile Properties

The default user profile is based on the [System for Cross-Domain Identity Management: Core Schema](https://tools.ietf.org/html/draft-ietf-scim-core-schema-22#section-4.1.1) and has following standard properties:

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
| locale            | user's default location for purposes of localizing items such as currency, date time format, numerical representations, etc. | String   | TRUE     | FALSE  | FALSE    |           |           | [RFC 5646](https://tools.ietf.org/html/rfc5646)                                                                   |
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

##### Okta Login

Every user within your Okta organization must have a unique identifier for a login.  This constraint applies to all users you import from other systems or applications such as Active Directory.  Your organization is the top-level namespace to mix and match logins from all your connected applications or directories.  Careful consideration of naming conventions for your login identifier will make it easier to onboard new applications in the future.

Okta has a default ambiguous name resolution policy for logins.  Users can login with their non-qualified shortname (e.g. `isaac.brock` with login *isaac.brock@example.com*) as long as the shortname is still unique within the organization.

> Avoid using a `login` with a `/` character.  Although `/` is a valid character according to [RFC 6531 section 3.3](http://tools.ietf.org/html/rfc6531#section-3.3), a user with this character in their `login` cannot be fetched by `login` ([see Get User by ID](#get-user-with-id)) due to security risks with escaping this character in URI paths.

#### Custom Profile Properties

User profiles may be extended with custom properties but the attribute must first be added to the user profile schema before it can be referenced.  You can use the Profile Editor in the Admin UI or the [Schemas API](./schemas.html) to manage schema extensions.

### Credentials Object

Specifies primary authentication and recovery credentials for a user.  Credential types and requirements vary depending on the provider and security policy of the organization.

|-------------------+-------------------------------------------------------+----------+--------+----------+-----------+-----------+------------|
| Property          | DataType                                              | Nullable | Unique | Readonly | MinLength | MaxLength | Validation |
| ----------------- | ----------------------------------------------------- | -------- | -------| -------- | --------- | --------- | ---------- |
| password          | [Password Object](#password-object)                   | TRUE     | FALSE  | FALSE    |           |           |            |
| recovery_question | [Recovery Question Object](#recovery-question-object) | TRUE     | FALSE  | FALSE    |           |           |            |
| provider          | [Provider Object](#provider-object)                   | FALSE    | FALSE  | TRUE     |           |           |            |
|-------------------+-------------------------------------------------------+----------+--------+----------+-----------+-----------+------------|

~~~json
{
  "credentials": {
    "password": {
      "value": "tlpWENT2m"
    },
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

|-----------+----------+----------+--------+----------+-------------------+-----------+-------------------|
| Property  | DataType | Nullable | Unique | Readonly | MinLength         | MaxLength | Validation        |
| --------- | -------- | -------- | ------ | -------- | ----------------- | --------- | ----------------- |
| value     | String   | TRUE     | FALSE  | FALSE    | *Password Policy* | 40        | *Password Policy* |
|-----------+----------+----------+--------+----------+-------------------+-----------+-------------------|

##### Default Password Policy

- Must be a minimum of 8 characters
- Must have a character from the following groups:
  - Upper case
  - Lower case
  - Digit
- Must not contain the user's login or parts of the the login when split on the following characters: `,` `.` `_` `#` `@`
  - *For example, a user with login isaac.brock@example.com will not be able set password brockR0cks! as the password contains the login part brock*

> Password policy requirements can be modified in the Okta Admin UI *(Security -> Policies)*

#### Recovery Question Object

Specifies a secret question and answer that is validated when a user forgets their password or unlocks their account.  The answer property is **write-only**.

|-----------+----------+----------+--------+----------+-----------+-----------+------------|
| Property  | DataType | Nullable | Unique | Readonly | MinLength | MaxLength | Validation |
| --------- | -------- | -------- | ------ | -------- | --------- | --------- | ---------- |
| question  | String   | TRUE     | FALSE  | FALSE    | 1         | 100       |            |
| answer    | String   | TRUE     | FALSE  | FALSE    | 1         | 100       |            |
|-----------+----------+----------+--------+----------+-----------+-----------+------------|

#### Provider Object

Specifies the authentication provider that validates the user's password credential. The user's current provider is managed by the Delegated Authentication settings for your organization. The provider object is **read-only**.

|-----------+--------------------------------------------------------------+----------+--------+----------+-----------+-----------+------------|
| Property  | DataType                                                     | Nullable | Unique | Readonly | MinLength | MaxLength | Validation |
| --------- | ------------------------------------------------------------ | -------- | ------ | -------- | --------- | --------- | ---------- |
| type      | `OKTA`, `ACTIVE_DIRECTORY`,`LDAP`, `FEDERATION`, or `SOCIAL` | FALSE    | FALSE  | TRUE     |           |           |            |
| name      | String                                                       | TRUE     | FALSE  | TRUE     |           |           |            |
|-----------+--------------------------------------------------------------+----------+--------+----------+-----------+-----------+------------|

> `ACTIVE_DIRECTORY` or `LDAP` providers specify the directory instance name as the `name` property.

> Users with a `FEDERATION` or `SOCIAL` authentication provider do not support a `password` or `recovery_question` credential and must authenticate via a trusted Identity Provider.

### Links Object

Specifies link relations (See [Web Linking](http://tools.ietf.org/html/rfc5988)) available for the current status of a user.  The Links Object is used for dynamic discovery of related resources and lifecycle or credential operations.  The Links Object is **read-only**.

|------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Link Relation Type     | Description                                                                                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------|
| self                   | The actual user                                                                                                                                           |
| activate               | [Lifecycle action](#activate-user) to transition user to `ACTIVE` status                                                                                  |
| deactivate             | [Lifecycle action](#deactivate-user) to transition user to `DEPROVISIONED` status                                                                         |
| resetPassword          | [Lifecycle action](#reset-password) to transition user to `RECOVERY` status                                                                               |
| expirePassword         | [Lifecycle action](#expire-password) to transition user to `PASSWORD_EXPIRED` status                                                                      |
| resetFactors           | [Lifecycle action](#reset-factors) to reset all the MFA factors for the user                                                                              |
| unlock                 | [Lifecycle action](#unlock-user) to returns a user to `ACTIVE` status when their current status is `LOCKED_OUT` due to exceeding failed login attempts    |
| forgotPassword         | [Resets a user's password](#forgot-password) by validating the user's recovery credential.                                                                |
| changePassword         | [Changes a user's password](#change-password) validating the user's current password                                                                      |
| changeRecoveryQuestion | [Changes a user's recovery credential](#change-recovery-question) by validating the user's current password                                               |
|------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------|

## User Operations

### Create User
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /users</span>

Creates a new user in your Okta organization with or without credentials:

- [Create User without Credentials](#create-user-without-credentials)
- [Create User with Recovery Question](#create-user-with-recovery-question)
- [Create User with Password](#create-user-with-password)
- [Create User with Password & Recovery Question](#create-user-with-password--recovery-question)
- [Create User with Authentication Provider](#create-user-with-authentication-provider)

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter   | Description                                                                      | Param Type | DataType                                  | Required | Default
----------- | -------------------------------------------------------------------------------- | ---------- | ----------------------------------------- | -------- | -------
activate    | Executes [activation lifecycle](#activate-user) operation when creating the user | Query      | Boolean                                   | FALSE    | TRUE
provider    | Indicates whether to create a user with a specified authentication provider      | Query      | Boolean                                   | FALSE    | FALSE
profile     | Profile properties for user                                                      | Body       | [Profile Object](#profile-object)         | TRUE     |
credentials | Credentials for user                                                             | Body       | [Credentials Object](#credentials-object) | FALSE    |

##### Response Parameters
{:.api .api-response .api-response-params}

All responses return the created [User](#user-model).  Activation of a user is an asynchronous operation.  The system will perform group reconcilation during activation and assign the user to all applications via direct or inderect relationships (group memberships).  The user will have the `transitioningToStatus` property with a value of `ACTIVE` during activation to indicate that the user hasn't completed the asynchronous operation.  The user will have a `status` of `ACTIVE` when the activation process is complete.

> The user will be emailed a one-time activation token if activated without a password

> If the user is assigned to an application that is also configured for provisioning, the activation process will also trigger downstream provisioning to the application.  It is possible for a user to login before these applications have been successfully provisioned for the user

|----------------+----------+--------------------------+---------------+------------------------+----------------|
| Security Q & A | Password | Activate Query Parameter | User Status   | Login Credential       | Welcome Screen |
| :------------: | :------: | :----------------------: | :-----------: | :--------------------: | :------------: |
|                |          | FALSE                    | `STAGED`      |                        |                |
|                |          | TRUE                     | `PROVISIONED` | One-Time Token (Email) | X              |
| X              |          | FALSE                    | `STAGED`      |                        |                |
| X              |          | TRUE                     | `PROVISIONED` | One-Time Token (Email) | X              |
|                | X        | FALSE                    | `STAGED`      |                        |                |
|                | X        | TRUE                     | `ACTIVE`      | Password               | X              |
| X              | X        | FALSE                    | `STAGED`      |                        |                |
| X              | X        | TRUE                     | `ACTIVE`      | Password               |                |
|----------------+----------+--------------------------+---------------+------------------------+----------------|

> Creating users with `FEDERATION` or `SOCIAL` provider will be either `ACTIVE` or `STAGED` based on the `activate` query parameter since they do not support a `password` or `recovery_question` credential.

#### Create User without Credentials
{:.api .api-operation}

Creates a user without a [password](#password-object) or [recovery question & answer](#recovery-question-object).  When the user is activated, an email is sent to the user with an activation token that the can be used to complete the activation process.  This is the default flow for new user registration with the Okta Admin UI

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  }
}' "https://${org}.okta.com/api/v1/users?activate=false"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
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
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
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

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "recovery_question": {
      "question": "Who'\''s a major player in the cowboy scene?",
      "answer": "Cowboy Dan"
    }
  }
}' "https://${org}.okta.com/api/v1/users?activate=false"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
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
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
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

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "password" : { "value": "tlpWENT2m" }
  }
}' "https://${org}.okta.com/api/v1/users?activate=false"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
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
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
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

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "password" : { "value": "tlpWENT2m" },
    "recovery_question": {
      "question": "Who'\''s a major player in the cowboy scene?",
      "answer": "Cowboy Dan"
    }
  }
}' "https://${org}.okta.com/api/v1/users?activate=false"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
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
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
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
    "activate": {
      "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/activate"
    }
  }
}
~~~

#### Create User with Authentication Provider
{:.api .api-operation}

Creates a new passwordless user with a `SOCIAL` or `FEDERATION` [authentication provider](#provider-object) that must be authenticated via a trusted Identity Provider.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "provider": {
      "type": "FEDERATION",
      "name": "FEDERATION"
    }
  }
}' "https://${org}.okta.com/api/v1/users?provider=true"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "00uijntSwJjSHtDY70g3",
  "status": "ACTIVE",
  "created": "2016-01-19T22:02:08.000Z",
  "activated": "2016-01-19T22:02:08.000Z",
  "statusChanged": "2016-01-19T22:02:08.000Z",
  "lastLogin": null,
  "lastUpdated": "2016-01-19T22:02:08.000Z",
  "passwordChanged": null,
  "profile": {
    "login": "isaac.brock@example.com",
    "firstName": "Isaac",
    "lastName": "Brock",
    "mobilePhone": "555-415-1337",
    "email": "isaac.brock@example.com",
    "secondEmail": null
  },
  "credentials": {
    "provider": {
      "type": "FEDERATION",
      "name": "FEDERATION"
    }
  },
  "_links": {
    "resetPassword": {
      "href": "https://your-domain.okta.com/api/v1/users/00uijntSwJjSHtDY70g3/lifecycle/reset_password",
      "method": "POST"
    },
    "changeRecoveryQuestion": {
      "href": "https://your-domain.okta.com/api/v1/users/00uijntSwJjSHtDY70g3/credentials/change_recovery_question",
      "method": "POST"
    },
    "deactivate": {
      "href": "https://your-domain.okta.com/api/v1/users/00uijntSwJjSHtDY70g3/lifecycle/deactivate",
      "method": "POST"
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

~~~http
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

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users/me"
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
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
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

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR"
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
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
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

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users/isaac.brock@example.com"
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
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
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

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users/isaac.brock"
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
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
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

Enumerates users in your organization with pagination.  A subset of users can be returned that match a supported filter expression, query or advanced search.

- [List Users with Defaults](#list-users-with-defaults)
- [List Users with Search](#list-users-with-search)
- [List Users Updated after Timestamp](#list-users-updated-after-timestamp)
- [List Users with Status](#list-users-with-status)
- [List Users with Advanced Search](#list-users-with-advanced-search)

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                                                                              | Param Type | DataType | Required | Default
--------- | -------------------------------------------------------------------------------------------------------- | ---------- | -------- | -------- | -------
q         | Searches `firstName`, `lastName`, and `email` properties of users for matching value                     | Query      | String   | FALSE    |
limit     | Specified the number of results                                                                          | Query      | Number   | FALSE    | 200
filter    | [Filter expression](/docs/api/getting_started/design_principles.html#filtering) for users                | Query      | String   | FALSE    |
after     | Specifies the pagination cursor for the next page of users                                               | Query      | String   | FALSE    |
search    | [Filter expression](/docs/api/getting_started/design_principles.html#filtering) for advanced user search | Query      | String   | FALSE    |

> The `after` cursor should treated as an opaque value and obtained through the next link relation. See [Pagination](/docs/getting_started/design_principles.html#pagination)

> Search using `q` currently performs a startsWith match but it should be considered an implementation detail and may change without notice in the future

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
`lastUpdated lt "yyyy-MM-dd'T'HH:mm:ss.SSSZ"`  | Users last updated before a specific timestamp
`lastUpdated eq "yyyy-MM-dd'T'HH:mm:ss.SSSZ"`  | Users last updated at a specific timestamp
`lastUpdated gt "yyyy-MM-dd'T'HH:mm:ss.SSSZ"`  | Users last updated after a specific timestamp
`id eq "00u1ero7vZFVEIYLWPBN"`                 | Users with a specified `id`
`profile.login eq "login@example.com"`         | Users with a specified `login`
`profile.email eq "email@example.com"`         | Users with a specified `email`*
`profile.firstName eq "John"`                  | Users with a specified `firstName`*
`profile.lastName eq "Smith" `                 | Users with a specified `lastName`*

\* If filtering by `email`, `lastName`, or `firstName`, Okta recommends the [User query API](#list-users-with-search). These profile filters are here for your convenience.

See [Filtering](/docs/api/getting_started/design_principles.html#filtering) for more information on expressions

> All filters must be [URL encoded](http://en.wikipedia.org/wiki/Percent-encoding) where `filter=lastUpdated gt "2013-06-01T00:00:00.000Z"` is encoded as `filter=lastUpdated%20gt%20%222013-06-01T00:00:00.000Z%22`

**Filter Examples**

Users with status of `LOCKED_OUT`

    filter=status eq "LOCKED_OUT"

Users updated after 06/01/2013 but before 01/01/2014

    filter=lastUpdated gt "2013-06-01T00:00:00.000Z" and lastUpdated lt "2014-01-01T00:00:00.000Z"

Users updated after 06/01/2013 but before 01/01/2014 with a status of `ACTIVE`

    filter=lastUpdated gt "2013-06-01T00:00:00.000Z" and lastUpdated lt "2014-01-01T00:00:00.000Z" and status eq "ACTIVE"

Users updated after 06/01/2013 but with a status of `LOCKED_OUT` or `RECOVERY`

    filter=lastUpdated gt "2013-06-01T00:00:00.000Z" and (status eq "LOCKED_OUT" or status eq "RECOVERY")

###### Advanced Search

> The `advanced search` feature is [Beta](/docs/api/resources/users.html#list-users-with-advanced-search)

Advanced search provides the option to filter on any user profile attribute, any custom defined profile attribute, as well as the following top-level attributes: `id`, `status`, `created`, `activated`, `statusChanged` and `lastUpdated`. The advanced search performs a case insensitive filter against all fields specified in the search parameter.
Note that the results might not yet be up to date, as the most up to date data can be delayed up to a few seconds, so use for convenience.

Filter                                         | Description
---------------------------------------------- | ------------------------------------------------
`profile.department eq "Engineering"`          | Users that have a `department` of `Engineering`
`profile.occupation eq "Leader"`               | Users that have a `occupation` of `Leader`

See [Filtering](/docs/api/getting_started/design_principles.html#filtering) for more information on expressions

> All advanced search must be [URL encoded](http://en.wikipedia.org/wiki/Percent-encoding) where `search=profile.department eq "Engineering"` is encoded as `search=profile.department%20eq%20%22Engineering%22`

**Advanced Search Examples**

Users with occupation of `Leader`

    search=profile.occupation eq "Leader"

Users with department of `Engineering` and either was created before `01/01/2014` or has a status of `ACTIVE`

    search=profile.department eq "Engineering" and (created lt "2014-01-01T00:00:00.000Z" or status eq "ACTIVE")
    
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

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users?limit=200"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~http
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
      "email": "isaac.brock@example.com",
      "login": "isaac.brock@example.com",
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
      "email": "eric.judy@example.com",
      "secondEmail": "eric@example.org",
      "login": "eric.judy@example.com",
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

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users?q=eric&limit=1"
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
      "email": "eric.judy@example.com",
      "secondEmail": "eric@example.org",
      "login": "eric.judy@example.com",
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

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users?filter=lastUpdated+gt+\"2013-07-01T00:00:00.000Z\""
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
      "email": "eric.judy@example.com",
      "secondEmail": "eric@example.org",
      "login": "eric.judy@example.com",
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

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users?filter=status+eq+\"ACTIVE\"+or+status+eq+\"RECOVERY\""
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
      "email": "eric.judy@example.com",
      "secondEmail": "eric@example.org",
      "login": "eric.judy@example.com",
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

#### List Users with Advanced Search
{:.api .api-operation}

Enable search for all user profile attribute as well as id, status, created, activated, statusChanged and lastUpdated.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users?search=profile.mobilePhone+sw+\"555\"+and+status+eq+\"ACTIVE\""
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
      "firstName": "Isaac",
      "lastName": "Brock",
      "email": "isaac.brock@example.com",
      "login": "isaac.brock@example.com",
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
]
~~~

### Update User
{:.api .api-operation}

> Use the `POST` method to make a partial update and the `PUT` method to delete unspecified properties.

<span class="api-uri-template api-uri-put"><span class="api-label">PUT</span> /users/*:id*</span>

Update a user's profile and/or credentials using strict-update semantics

> All profile properties must be specified when updating a user's profile with a `PUT` method. Any attribute not specified
in the request will be deleted. **Do not use `PUT` method for partial updates.**

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter   | Description                 | Param Type | DataType                                  | Required | Default
----------- | --------------------------- | ---------- | ----------------------------------------- | -------- | -------
id          | `id` of user to update      | URL        | String                                    | TRUE     |
profile     | Updated profile for user    | Body       | [Profile Object](#profile-object)         | FALSE    |
credentials | Update credentials for user | Body       | [Credentials Object](#credentials-object) | FALSE    |

`profile` and `credentials` can be updated independently or together with a single request.

##### Response Parameters
{:.api .api-response .api-response-params}

Updated [User](#user-model)

#### Update Profile
{:.api .api-operation}

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X PUT \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@update.example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  }
}' "https://${org}.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR"
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
  "lastUpdated": "2015-07-02T21:36:25.344Z",
  "passwordChanged": "2013-07-02T21:36:25.344Z",
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@update.example.com",
    "login": "isaac.brock@example.com",
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

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /users/*:id*</span>

Update a user's profile and/or credentials with partial update semantics.

> Only the profile properties specified in the request will be modified when using the `POST` method. Any attribute not specified
in the request will not be modified or deleted. **Use `POST` method for partial updates.**

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

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "email": "isaac.brock@update.example.com"
  }
}' "https://${org}.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR"
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
  "lastUpdated": "2015-07-02T21:36:25.344Z",
  "passwordChanged": "2013-07-02T21:36:25.344Z",
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@update.example.com",
    "login": "isaac.brock@example.com",
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


#### Set Password
{:.api .api-operation}

This is an administrative operation and does not validate existing user credentials.  For operations that validate credentials refer to:

- [Reset Password](#reset-password)
- [Forgot Password](#forgot-password)
- [Change Password](#change-password)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "credentials": {
    "password" : { "value": "uTVM,TPw55" }
  }
}' "https://${org}.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR"
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
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
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

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "credentials": {
    "recovery_question": {
      "question": "How many roads must a man walk down?",
      "answer": "forty two"
    }
  }
}' "https://${org}.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR"
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
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
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

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/appLinks"
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

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/groups"
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
  "activationUrl": "https://your-domain.okta.com/welcome/XE6wE17zmphl3KqAPFxO"
}
~~~

> If a password was set before the user was activated, then user must login with with their password and not the activation link

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/activate?sendEmail=false"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
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

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~http
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
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/unlock"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~http
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

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password?sendEmail=false"
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

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password?provider=FEDERATION&sendEmail=false"
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

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password?tempPassword=false"
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
  "lastUpdated": "2013-06-27T16:35:28.000Z",
  "passwordChanged": "2013-06-24T16:39:19.000Z",
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
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

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 200 OK
Content-Type: application/json
~~~

## Credential Operations

### Forgot Password
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /users/*:id*/credentials/forgot_password</span>

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

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password?sendEmail=false"
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

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "password": { "value": "uTVM,TPw55" },
  "recovery_question": { "answer": "Cowboy Dan" }
}' "https://${org}.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password"
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

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "oldPassword": { "value": "tlpWENT2m" },
  "newPassword": { "value": "uTVM,TPw55" }
}' "https://${org}.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_password"
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

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "password": { "value": "tlpWENT2m" },
  "recovery_question": {
    "question": "How many roads must a man walk down?",
    "answer": "forty two"
  }
}' "https://${org}.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_recovery_question"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "credentials": {
    "password": {},
    "recovery_question": {
      "question": "How many roads must a man walk down?"
    },
    "provider": {
      "type": "OKTA",
      "name": "OKTA"
    }
  }
}
~~~
