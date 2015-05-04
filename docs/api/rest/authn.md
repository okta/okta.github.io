---
layout: docs_page
title: Authentication
---

* Will be replaced with the ToC
{:toc .list-unstyled .toc}

## Overview

The Okta Authentication API provides operations to authenticate users, perform multi-factor enrollment and verification, recover forgotten passwords, and unlock accounts. It can be used as a standalone API to provide the identity layer on top of your existing application, or it can be integrated with the Okta [Sessions API](sessions.html) to obtain an Okta [session cookie](#/docs/examples/session_cookie.html) and access apps within Okta.  

The API is targeted for developers who want to build their own end-to-end login experience to replace the built-in Okta login experience and addresses the following key scenarios:

- **Primary authentication** allows you to verify username and password credentials for a user.

- **Multifactor authentication** (MFA) strengthens the security of password-based authentication by requiring additional verification of another factor such as a temporary one-time password or an SMS passcode. The Auth API supports user enrollment with MFA factors enabled by the administrator, as well as MFA challenges based on your Sign-On security policy.

- **Recovery** allows users to securely reset their password if they've forgotten it, or unlock their account if it has been locked out due to excessive failed login attempts. This functionality is subject to the security policy set by the administrator.

> This API is currently in **Early Access (EA)** status.

## Authentication Model

The Authentication API is a *stateful* API that implements a finite state machine with defined states and required transitions between those states.  State is transferred with a `stateToken` that is issued for each authentication or recovery transaction and must be passed with each request.  The Authentication API leverages the [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06) format to publish `next` and `prev` links for the current transaction state which should be used to transition the state machine.  


Attribute     | Description                                                                                           | DataType                                                       | MinLength | MaxLength | Nullable | Unique | Readonly
------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------- | --------- | -------- | ------ | --------
stateToken    | ephemeral token that encodes the current state of an authentication or recovery transaction           | String                                                         |           |           | TRUE     | FALSE  | TRUE
expiresAt     | lifetime of the `stateToken`, `recoveryToken`, or `sessionToken` (See [Tokens](#tokens))              | Date                                                           |           |           | TRUE     | FALSE  | TRUE
status        | current state of the  transaction                                                                     | [Authentication Status](#authentication-status)                |           |           | FALSE    | FALSE  | TRUE
relayState    | Optional state value that is persisted for the lifetime of the authentication or recovery transaction | String                                                         |           | 2048      | TRUE     | FALSE  | TRUE
_embedded     | [embedded resources](#embedded-resources) for the current `status`                                    | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06) |           |           | TRUE     | FALSE  | TRUE
_links        | [link relations](#links-object) for the current `status`                                              | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06) |           |           | TRUE     | FALSE  | TRUE
 

### Authentication Status

![Authentication State Model Diagram](/assets/img/auth-state-model.png "Authentication State Model Diagram")

An authentication or recovery transaction has one of the following statuses:

Value               | Description                                                                              | Next Action
------------------- | ---------------------------------------------------------------------------------------- |
PASSWORD_EXPIRED    | The user's password was successfully validated but is expired.                           | POST to the `next` link relation to [change the user's expired password](#change-expired-password).
RECOVERY            | The user has requested a recovery token to reset their password or unlock their account. | POST to the `next` link relation to [answer the user's recovery question](#answer-recovery-question).
PASSWORD_RESET      | The user successfully answered their recovery question and must to set a new password.   | POST to the `next` link relation to [reset the user's password](#reset-password).
LOCKED_OUT          | The user account is locked; self-service unlock or admin unlock is required.             | POST to the `unlock` link relation to perform a [self-service unlock](#unlock-account).
MFA_ENROLL          | The user must select and enroll an available factor for additional verification.         | POST to the `enroll` link relation for a specific factor to [enroll the factor](#enroll-factor).
MFA_ENROLL_ACTIVATE | The user must activate the factor to complete enrollment.                                | POST to the `next` link relation to [activate the factor](#activate-factor).
MFA_REQUIRED        | The user must provide additional verification with a previously enrolled factor.         | POST to the `verify` link relation for a specific factor to [provide additional verification](#verify-factor).
MFA_CHALLENGE       | The user must verify the factor-specific challenge.                                      | POST to the `verify` link relation to [verify the factor](#verify-factor).
SUCCESS             | The transaction has completed successfully                                               |

You can advance the authentication or recovery transaction to the next status by posting a **status-specific** request to the the `next` link relation published in the [JSON HAL links object](#links-object) for the response.  [Enrolling a factor](#enroll-factor) and [verifying a factor](#verify-factor) do not have `next` link relationships as the end-user must make a selection of which factor to enroll or verify.

> You should never assume a specific state transition or URL when navigating the [state model](#authentication-status).  Always inspect the response for `status` and dynamically follow the [published link relations](#links-object).

~~~json
{
  "_links": {
    "next": {
      "name": "activate",
      "href": "https://your-domain.okta.com/api/v1/authn/factors/ostf2xjtDKWFPZIKYDZV/lifecycle/activate",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "cancel": {
      "href": "https://your-domain.okta.com/api/v1/authn/cancel",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "prev": {
      "href": "https://your-domain.okta.com/api/v1/authn/previous",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    }
  }
}
~~~


### Tokens

Authentication API operations will return different token types depending on the [status](#authentication-status) of the authentication or recovery transaction.

#### State Token

Ephemeral token that encodes the current state of an authentication or recovery transaction.

- The `stateToken` must be passed with every request except when verifying a `recoveryToken` that was distributed out-of-band
- The `stateToken` is only intended to be used between the web application performing end-user authentication and the Okta API. It should never distributed to the end-user via email or other out-of-band mechanism.
- The lifetime of the `stateToken` is currently fixed and not customizable.

> All Authentication API operations will return `401 Unauthorized` status code when you attempt to use an expired state token.

~~~http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
    "errorCode": "E0000011",
    "errorSummary": "Invalid token provided",
    "errorLink": "E0000011",
    "errorId": "oaeY-4G_TBUTBSZAn9n7oZCfw",
    "errorCauses": []
}
~~~

> State transitions are strictly enforced for state tokens.  You will receive a `403 Forbidden` status code if you attempt to use a state token for given [status](#authentication-status) with invalid Authentication API operation for the status.

~~~http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "errorCode": "E0000079",
  "errorSummary": "This operation is not allowed in the current authentication state.",
  "errorLink": "E0000079",
  "errorId": "oaen9Ly_ivHQJ-STb8KiADh9w",
  "errorCauses": [
    {
      "errorSummary": "This operation is not allowed in the current authentication state."
    }
  ]
}
~~~

#### Recovery Token

One-time token issued as `recoveryToken` response parameter when a recovery transaction transitions to the `RECOVERY` status.

- The token can be exchanged for a `stateToken` to recover a user's password or unlock their account.
- Unlike the `statusToken` the `recoveryToken` should be distributed out-of-band to a user such as via email.
- The lifetime of the `recoveryToken` is managed by the organization's security policy.

> The `recoveryToken` is usually sent directly to the end-user via email or SMS.  Obtaining a `recoveryToken` is a highly privileged operation and should be restricted to trusted web applications.  Anyone that obtains a `recoveryToken` for a user and knows the answer to a user's recovery question can reset their password or unlock their account.

#### Session Token

One-time token issued as `sessionToken` response parameter when an authentication transaction completes with the `SUCCESS` status.

- The token can be exchanged for a session with the [Session API](sessions.html#create-session) or converted to a [session cookie](/docs/examples/session_cookie.html).
- The lifetime of the `sessionToken` is the same as the lifetime of a user's session and managed by the organization's security policy.

### Factor Result 

The `MFA_CHALLENGE` state can return an additional attribute **factorResult** that provides additional context for the last factor verification attempt. The following table shows the possible values for this attribute.

factorResult           | Description
---------------------- | -------------------------------------------------------------------------------------------------------------------------------
`WAITING`              | Factor verification has started but not yet completed (e.g user hasn't answered phone call yet)
`CANCELLED`            | Factor verification was canceled by user
`TIMEOUT`              | Unable to verify factor within the allowed time window
`TIME_WINDOW_EXCEEDED` | Factor was successfully verified but outside of the computed time window.  Another verification is required in current time window.
`PASSCODE_REPLAYED`    | Factor was previously verified within the same time window.  User must wait another time window and retry with a new verification.
`ERROR`                | Unexpected server error occurred verifying factor.


### Links Object

Specifies link relations (See [Web Linking](http://tools.ietf.org/html/rfc5988)) available for the current authentication status using the [JSON Hypertext Application Language](http://tools.ietf.org/html/draft-kelly-json-hal-06) specification.  These links are used to transition the [authentication status](#authentication-status) of the [state token](#state-token).

Link Relation Type | Description
------------------ | -----------------------------------------------------------------------------------------------------------
next               | Transitions the authentication state machine to the next state.  **Note: The `name` of the link relationship will provide a hint of the next operation required**
prev               | Transitions the authentication state machine to the previous state.
cancel             | Cancels the current authentication transaction and revokes the [state token](#state-token).
resend             | Resends a challenge or OTP to a device

> The Links Object is **read-only**

## Embedded Resources

### User Object

A subset of attributes of a [User](users.html#user-model) is available after successful primary authentication or during recovery.

Attribute         | Description              | DataType                                              | MinLength | MaxLength | Nullable | Unique | Readonly
----------------- | ------------------------ | ----------------------------------------------------- | --------- | --------- | -------- | ------ | --------
id                | unique key for user      | String                                                |           |           | FALSE    | TRUE   | TRUE
profile           | user's profile           | [User Profile Object](#user-profile-object)           |           |           | FALSE    | FALSE  | TRUE
recovery_question | user's recovery question | [Recovery Question Object](#recovery-question-object) |           |           | TRUE     | FALSE  | TRUE

~~~json
{
 "id": "00udnlQDVLVRIVXESCMZ",
 "profile": {
      "username": "isaac@example.org",
      "firstName":"Isaac",
      "lastName": "Brock",
      "locale": "en_US",
      "timeZone": "America/Los_Angeles"
 },
 "recovery_question": {
    "question": "Who's a major player in the cowboy scene?"
  }
}
~~~

#### User Profile Object

Subset of [profile attributes](users.html#profile-object) for a user

Attribute | Description                                                                                                                 | DataType                                                                                            | MinLength | MaxLength | Nullable | Unique | Readonly
--------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------- | --------- | -------- | ------ | --------
username  | unique username for user                                                                                                    | String                                                                                              | 5         | 100       | FALSE    | TRUE   | TRUE
firstName | first name of user                                                                                                          | String                                                                                              | 1         | 50        | FALSE    | FALSE  | TRUE
lastName  | last name of user                                                                                                           | String                                                                                              | 1         | 50        | FALSE    | FALSE  | TRUE
locale    | user's preferred display formatting for localizing items such as currency, date time format, numerical representations, etc | ISO 639-1 two letter language code, an underscore, and the ISO 3166-1 two letter country code (en_US) | 5         | 5         | FALSE    | FALSE  | TRUE
timeZone  | user's time zone in the "[Olson](https://en.wikipedia.org/wiki/Tz_database)" timezone database format                                                                    | "Area/Location" of "Olson" timezone                                                                 |           |           | FALSE    | FALSE  | TRUE

#### Recovery Question Object

User's recovery question used for verification of a recovery transaction

Attribute         | Description              | DataType | MinLength | MaxLength | Nullable | Unique | Readonly
----------------- | ------------------------ | -------- | --------- | --------- | -------- | ------ | --------
question          | user's recovery question | String   |           |           | FALSE    | TRUE   | TRUE


### Factor Object

A subset of attributes of a supported [Factor](factors.html#factor-model)

Attribute     | Description                                                            | DataType                                                       | MinLength | MaxLength | Nullable | Unique | Readonly
------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------- | --------- | --------- | -------- | ------ | --------
id            | unique key for factor                                                  | String                                                         |           |           | TRUE     | TRUE   | TRUE
factorType    | type of factor                                                         | [Factor Type](factors.html#factor-type)                        |           |           | FALSE    | TRUE   | TRUE
provider      | factor provider                                                        | [Provider Type](factors.html#provider-type)                    |           |           | FALSE    | TRUE   | TRUE
profile       | profile of a [supported factor](factors.html#supported-factors)        | [Factor Profile Object](factors.html#factor-profile-object)    |           |           | TRUE     | FALSE  | TRUE
_embedded     | [embedded resources](#factor-embedded-resources) related to the factor | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06) |           |           | TRUE     | FALSE  | TRUE
_links        | [discoverable resources](#factor-links-object) for the factor          | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06) |           |           | TRUE     | FALSE  | TRUE

~~~json
{
  "id": "ostfm3hPNYSOIOIVTQWY",
  "factorType": "token:software:totp",
  "provider": "OKTA",
  "profile": {
      "credentialId": "isaac@example.org"
  },
  "_links": {
      "verify": {
          "href": "https://your-domain.okta.com/api/v1/authn/factors/ostfm3hPNYSOIOIVTQWY/verify",
          "hints": {
              "allow": [
                  "POST"
              ]
          }
      }
  }
}
~~~

#### Factor Embedded Resources

##### TOTP Factor Activation Object

TOTP factors when activated have an embedded verification object which describes the [TOTP](http://tools.ietf.org/html/rfc6238) algorithm parameters.

Attribute     | Description                                       | DataType                                                       | MinLength | MaxLength | Nullable | Unique | Readonly
------------- | ------------------------------------------------- | -------------------------------------------------------------- | --------- | --------- | -------- | ------ | --------
timeStep      | time-step size for TOTP                           | String                                                         |           |           | FALSE    | FALSE  | TRUE
sharedSecret  | unique secret key for prover                      | String                                                         |           |           | FALSE    | FALSE  | TRUE
encoding      | encoding of `sharedSecret`                        | `base32` or `base64`                                           |           |           | FALSE    | FALSE  | TRUE
keyLength     | number of digits in an HOTP value                 | Number                                                         |           |           | FALSE    | FALSE  | TRUE
_links        | discoverable resources related to the activation  | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06) |           |           | TRUE     | FALSE  | TRUE
 
~~~ json
 "activation": {
    "timeStep": 30,
    "sharedSecret": "HE64TMLL2IUZW2ZLB",
    "encoding": "base32",
    "keyLength": 6
} 
~~~

###### TOTP Activation Links Object

Specifies link relations (See [Web Linking](http://tools.ietf.org/html/rfc5988)) available for the TOTP activation object using the [JSON Hypertext Application Language](http://tools.ietf.org/html/draft-kelly-json-hal-06) specification.  This object is used for dynamic discovery of related resources and operations.

Link Relation Type | Description
------------------ | -----------------------------------------------------------------------------------------------------------
qrcode             | QR code that encodes the TOTP parameters that can be used for enrollment


##### Phone Object

The phone object describes previously enrolled phone numbers for the `sms` factor or for account recovery.

Attribute     | Description          | DataType                                      | MinLength | MaxLength | Nullable | Unique | Readonly
------------- | -------------------- | --------------------------------------------- | --------- | --------- | -------- | ------ | --------
id            | unique key for phone | String                                        |           |           | FALSE    | TRUE   | TRUE
profile       | profile of phone     | [Phone Profile Object](#phone-profile-object) |           |           | FALSE    | FALSE  | TRUE
status        | status of phone      | `ACTIVE` or `INACTIVE`                        |           |           | FALSE    | FALSE  | TRUE

~~~json
{
    "id": "mbl198rKSEWOSKRIVIFT",
    "profile": {
        "phoneNumber": "+1 XXX-XXX-1337"
    },
    "status": "ACTIVE"
}
~~~

###### Phone Profile Object

Attribute     | Description          | DataType | MinLength | MaxLength | Nullable | Unique | Readonly
------------- | -------------------- | ---------| --------- | --------- | -------- | ------ | --------
phoneNumber   | masked phone number  | String   |           |           | FALSE    | FALSE  | TRUE

##### Factor Links Object

Specifies link relations (See [Web Linking](http://tools.ietf.org/html/rfc5988)) available for the factor using the [JSON Hypertext Application Language](http://tools.ietf.org/html/draft-kelly-json-hal-06) specification.  This object is used for dynamic discovery of related resources and operations.

Link Relation Type | Description
------------------ | -----------------------------------------------------------------------------------------------------------
enroll             | [Enrolls a factor](#enroll-factor)
verify             | [Verifies a factor](#verify-factor)
questions          | Lists all possible questions for the `question` factor type
resend             | Resends a challenge or OTP to a device

> The Links Object is **read-only**

## Authentication Operations


### Primary Authentication
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /authn

Every authentication transaction starts with primary authentication which validates a user's username/password credential.  The [authentication status](#authentication-status) of the response will depend on the user's group memberships and assigned policies.  Password Policy and Sign-On Policy is evaluated during primary authentication to determine if the user's password is expired or if additional verification is required.

- [Primary Authentication with Invalid Credentials](#primary-authentication-with-invalid-credentials)
- [Primary Authentication with Expired Password](#primary-authentication-with-expired-password)
- [Primary Authentication without Additional Verification](#primary-authentication-without-additional-verification)
- [Primary Authentication with Additional Verification for Enrolled Factors](#primary-authentication-with-additional-verification-for-enrolled-factors)
- [Primary Authentication with Factor Enrollment](#primary-authentication-with-factor-enrollment)

> You must first enable MFA factors for your organization and assign a MFA Sign-On Policy to a group to enroll and/or verify an additional factor during authentication

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter   | Description                                                                                            | Param Type | DataType                          | MaxLength | Required | Default
----------- | ------------------------------------------------------------------------------------------------------ | ---------- | --------------------------------- | --------- | -------- |
username    | User's non-qualified short-name (e.g. isaac) or unique fully-qualified login (e.g issac@example.org)   | Body       | String                            |           | TRUE     |
password    | User's password credential                                                                             | Body       | String                            |           | TRUE     |
relayState  | Optional state value that is persisted for the lifetime of the authentication transaction              | Body       | String                            | 2048      | FALSE    |
context     | Provides additional context for the authentication transaction                                         | Body       | [Context Object](#context-object) |           | FALSE    |

##### Context Object

The Authentication API derives default context from the HTTP request and client socket.  The context object allows trusted web applications to override the default context by forwarding the originating context in the primary authentication request.

Parameter   | Description                                                         | Param Type | DataType                          | Required | Default
----------- | ------------------------------------------------------------------- | ---------- | --------------------------------- | -------- | -------
ipAddress   | IP Address of the user                                              | Body       | String                            | FALSE    |
userAgent   | User Agent of the user                                              | Body       | String                            | FALSE    |
deviceToken | A globally unique ID identifying the device of the user             | Body       | String                            | FALSE    |

> Sign-On Security Policy may optionally require MFA based on network location.  Overriding HTTP request context is a highly privileged operation that should be limited to trusted web applications.  

###### Device Token

You must always pass the same `deviceToken` for a user's device with every authentication request for **per-device** or **per-session** Sign-On Policy factor challenges.  If the `deviceToken` is absent or does not match the previous `deviceToken`, the user will still be challenged everytime instead of **per-device** or **per-session**.  It is recommend that you generate a UUID or GUID for each client and persist the `deviceToken` as a persistent cookie or HTML5 localStorage item scoped to your web application's origin.  The max length for `deviceToken` is 32 characters.

> If you pass a device token, the factor verification is remembered to avoid additional MFA prompts when using the same device, unless the the organizational MFA policy requires an MFA challenge every time. The policy ultimately determines whether a user is challenged or not.

#### Response Parameters
{:.api .api-response .api-response-params}

[Authentication Object](#authentication-model) for the next [authentication status](#authentication-status).

If the username or password is invalid you will receive a `401 Unauthorized` status code with the following error: 

~~~http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "errorCode": "E0000004",
  "errorSummary": "Authentication failed",
  "errorLink": "E0000004",
  "errorId": "oaeuHRrvMnuRga5UzpKIOhKpQ",
  "errorCauses": []
}
~~~

#### Primary Authentication with Invalid Credentials
{:.api .api-operation}

Authenticates a user with an invalid username or password.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn
-d \
'{
  "username": "isaac@example.org",
  "password" : "GoAw@y123",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "context": {
    "ipAddress": "192.168.12.11",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3)",
    "deviceToken": "26q43Ak9Eh04p7H6Nnx0m69JqYOrfVBY"
  }
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "errorCode": "E0000004",
  "errorSummary": "Authentication failed",
  "errorLink": "E0000004",
  "errorId": "oaeuHRrvMnuRga5UzpKIOhKpQ",
  "errorCauses": []
}
~~~

#### Primary Authentication with Expired Password

Authenticates a user with an expired password.  The user must [change their expired password](#change-expired-password) to complete the authentication transaction.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn
-d \
'{
  "username": "isaac@example.org",
  "password" : "GoAw@y123",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "context": {
    "ipAddress": "192.168.12.11",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3)",
    "deviceToken": "26q43Ak9Eh04p7H6Nnx0m69JqYOrfVBY"
  }
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "stateToken": "00s1pd3bZuOv-meJE13hz1B7SZl5EGc14Ii_CTBIYd",
  "expiresAt": "2014-11-02T23:39:03.319Z",
  "status": "PASSWORD_EXPIRED",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "profile": {
        "login": "isaac@example.org",
        "firstName": "Isaac",
        "lastName": "Brock",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      }
    }
  },
  "_links": {
    "next": {
      "name": "password",
      "href": "https://your-domain.okta.com/api/v1/authn/credentials/change_password",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "cancel": {
      "href": "https://your-domain.okta.com/api/v1/authn/cancel",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    }
  }
}
~~~

#### Primary Authentication without Additional Verification

Authenticates a user that is not assigned to a Sign-On Policy with a MFA challenge requirement.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn
-d \
'{
  "username": "isaac@example.org",
  "password": "GoAw@y123",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "context": {
    "ipAddress": "192.168.12.11",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3)",
    "deviceToken": "26q43Ak9Eh04p7H6Nnx0m69JqYOrfVBY"
  }
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "expiresAt": "2014-11-03T10:15:57.000Z",
  "status": "SUCCESS",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "sessionToken": "00Fpzf4en68pCXTsMjcX8JPMctzN2Wiw4LDOBL_9pe",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "profile": {
        "login": "isaac@example.org",
        "firstName": "Isaac",
        "lastName": "Brock",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      }
    }
  }
}
~~~

#### Primary Authentication with Additional Verification for Enrolled Factors

Authenticates a user that has previously enrolled a factor for additional verification and assigned to a Sign-On Policy with a MFA challenge requirement.  The user must select and [verify](#verify-factor) a [factor](#factor-object) by `id` to complete the authentication transaction.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn
-d \
'{
  "username": "isaac@example.org",
  "password": "GoAw@y123",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "context": {
    "ipAddress": "192.168.12.11",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3)",
    "deviceToken": "26q43Ak9Eh04p7H6Nnx0m69JqYOrfVBY"
  }
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "stateToken": "00FpGOgqHfl-6KZxh1bLXJDz35ENsShIY-lc5XHPzc",
  "expiresAt": "2014-11-02T23:35:28.269Z",
  "status": "MFA_REQUIRED",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "profile": {
        "login": "isaac@example.org",
        "firstName": "Isaac",
        "lastName": "Brock",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      }
    },
    "factors": [
      {
        "id": "ufsm3jZGDQXPJDEIXZMP",
        "factorType": "question",
        "provider": "OKTA",
        "profile": {
          "question": "disliked_food",
          "questionText": "What is the food you least liked as a child?"
        },
        "_links": {
          "verify": {
            "href": "https://your-domain.okta.com/api/v1/authn/factors/ufsm3jZGDQXPJDEIXZMP/verify",
            "hints": {
              "allow": [
                "POST"
              ]
            }
          }
        }
      },
      {
        "id": "rsalhpMQVYKHZKXZJQEW",
        "factorType": "token",
        "provider": "RSA",
        "profile": {
          "credentialId": "isaac@example.org"
        },
        "_links": {
          "verify": {
            "href": "https://your-domain.okta.com/api/v1/authn/factors/rsalhpMQVYKHZKXZJQEW/verify",
            "hints": {
              "allow": [
                "POST"
              ]
            }
          }
        }
      },
      {
        "id": "uftm3iHSGFQXHCUSDAND",
        "factorType": "token:software:totp",
        "provider": "GOOGLE",
        "profile": {
          "credentialId": "isaac@example.org"
        },
        "_links": {
          "verify": {
            "href": "https://your-domain.okta.com/api/v1/authn/factors/uftm3iHSGFQXHCUSDAND/verify",
            "hints": {
              "allow": [
                "POST"
              ]
            }
          }
        }
      },
      {
        "id": "ostfm3hPNYSOIOIVTQWY",
        "factorType": "token:software:totp",
        "provider": "OKTA",
        "profile": {
          "credentialId": "isaac@example.org"
        },
        "_links": {
          "verify": {
            "href": "https://your-domain.okta.com/api/v1/authn/factors/ostfm3hPNYSOIOIVTQWY/verify",
            "hints": {
              "allow": [
                "POST"
              ]
            }
          }
        }
      },
      {
        "id": "sms193zUBEROPBNZKPPE",
        "factorType": "sms",
        "provider": "OKTA",
        "profile": {
          "phoneNumber": "+1 XXX-XXX-1337"
        },
        "_links": {
          "verify": {
            "href": "https://your-domain.okta.com/api/v1/authn/factors/sms193zUBEROPBNZKPPE/verify",
            "hints": {
              "allow": [
                "POST"
              ]
            }
          }
        }
      }
    ]
  },
  "_links": {
    "cancel": {
      "href": "https://your-domain.okta.com/api/v1/authn/cancel",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    }
  }
}
~~~

#### Primary Authentication with Factor Enrollment

Authenticates a user assigned to a Sign-On Policy with a MFA challenge requirement who has not previously enrolled a factor for additional verification.  The user must select a [factor](#factor-object) to [enroll](#enroll-factor) to complete the authentication transaction.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn
-d \
'{
  "username": "isaac@example.org",
  "password": "GoAw@y123",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "context": {
    "ipAddress": "192.168.12.11",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3)",
    "deviceToken": "26q43Ak9Eh04p7H6Nnx0m69JqYOrfVBY"
  }
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "stateToken": "00Z20ZhXVrmyR3z8R-m77BvknHyckWCy5vNwEA6huD",
  "expiresAt": "2014-11-02T23:44:41.736Z",
  "status": "MFA_ENROLL",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "profile": {
        "login": "isaac@example.org",
        "firstName": "Isaac",
        "lastName": "Brock",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      }
    },
    "factors": [
      {
        "factorType": "question",
        "provider": "OKTA",
        "_links": {
          "questions": {
            "href": "https://your-domain.okta.com/api/v1/users/00uoy3CXZHSMMJPHYXXP/factors/questions",
            "hints": {
              "allow": [
                "GET"
              ]
            }
          },
          "enroll": {
            "href": "https://your-domain.okta.com/api/v1/authn/factors",
            "hints": {
              "allow": [
                "POST"
              ]
            }
          }
        }
      },
      {
        "factorType": "token",
        "provider": "RSA",
        "_links": {
          "enroll": {
            "href": "https://your-domain.okta.com/api/v1/authn/factors",
            "hints": {
              "allow": [
                "POST"
              ]
            }
          }
        }
      },
      {
        "factorType": "token:software:totp",
        "provider": "GOOGLE",
        "_links": {
          "enroll": {
            "href": "https://your-domain.okta.com/api/v1/authn/factors",
            "hints": {
              "allow": [
                "POST"
              ]
            }
          }
        }
      },
      {
        "factorType": "token:software:totp",
        "provider": "OKTA",
        "_links": {
          "enroll": {
            "href": "https://your-domain.okta.com/api/v1/authn/factors",
            "hints": {
              "allow": [
                "POST"
              ]
            }
          }
        }
      },
      {
        "factorType": "sms",
        "provider": "OKTA",
        "_links": {
          "enroll": {
            "href": "https://your-domain.okta.com/api/v1/authn/factors",
            "hints": {
              "allow": [
                "POST"
              ]
            }
          }
        }
      }
    ]
  },
  "_links": {
    "cancel": {
      "href": "https://your-domain.okta.com/api/v1/authn/cancel",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    }
  }
}
~~~

### Change Expired Password
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /authn/credentials/change_password

Okta enforces changing expired passwords during authentication when primary authentication returns the `PASSWORD_EXPIRED` status.  The user must change their existing password by posting a new password to the `next` link relation to successfully complete authentication.  

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter   | Description                                         | Param Type | DataType  | Required | Default
----------- | --------------------------------------------------- | ---------- | --------- | -------- |
stateToken  | [state token](#state-token) for current transaction | Body       | String    | TRUE     |
oldPassword | User's current password that is expired             | Body       | String    | TRUE     |
newPassword | New password for user                               | Body       | String    | TRUE     |

#### Response Parameters
{:.api .api-response .api-response-params}

[Authentication Object](#authentication-model) for the next [authentication status](#authentication-status).

If the `oldPassword` is invalid you will receive a `403 Forbidden` status code with the following error: 

~~~http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "errorCode": "E0000014",
  "errorSummary": "Update of credentials failed",
  "errorLink": "E0000014",
  "errorId": "oaeYx8fd_-VQdONMI5OYcqoqw",
  "errorCauses": [
    {
      "errorSummary": "oldPassword: The credentials provided were incorrect."
    }
  ]
}
~~~

If the `newPassword` does not meet password policy requirements, you will receive a `403 Forbidden` status code with the following error: 

~~~http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "errorCode": "E0000080",
  "errorSummary": "The password does meet the complexity requirements of the current password policy.",
  "errorLink": "E0000080",
  "errorId": "oaeuNNAquYEQkWFnUVG86Abbw",
  "errorCauses": [
    {
      "errorSummary": "Passwords must have at least 8 characters, a lowercase letter, an uppercase letter, a number, no parts of your username"
    }
  ]
}
~~~

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn/credentials/change_password
-d \
'{
  "stateToken": "00s1pd3bZuOv-meJE13hz1B7SZl5EGc14Ii_CTBIYd",
  "oldPassword": "GoAw@y123",
  "newPassword": "Ch-ch-ch-ch-Changes!"
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "expiresAt": "2014-11-03T10:15:57.000Z",
  "status": "SUCCESS",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "sessionToken": "00Fpzf4en68pCXTsMjcX8JPMctzN2Wiw4LDOBL_9pe",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "profile": {
        "login": "isaac@example.org",
        "firstName": "Isaac",
        "lastName": "Brock",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      }
    }
  }
}
~~~


### Enroll Factor
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /authn/factors

Enrolls a user with a [factor](factors.html#supported-factors) assigned by their administrator.  The operation is only available for users that have not previously enrolled a factor and have transitioned to the `MFA_ENROLL` [authentication status](#authentication-status). 

- [Enroll User with Security Question](#enroll-user-with-security-question)
- [Enroll User with Okta SMS Factor](#enroll-user-with-okta-sms-factor)
- [Enroll User with Okta Verify Factor](#enroll-user-with-okta-verify-factor)
- [Enroll User with Google Authenticator Factor](#enroll-user-with-google-authenticator-factor)

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter   | Description                                                      | Param Type  | DataType                                                     | Required | Default
----------- | ---------------------------------------------------------------- | ----------- | -------------------------------------------------------------| -------- | -------
stateToken  | [state token](#state-token) for current transaction              | Body        | String                                                       | TRUE     |
factorType  | type of factor                                                   | Body        | [Factor Type](factors.html#factor-type)                      | TRUE     |          
provider    | factor provider                                                  | Body        | [Provider Type](factors.html#provider-type)                  | TRUE     |          
profile     | profile of a [supported factor](factors.html#supported-factors)  | Body        | [Factor Profile Object](factors.html#factor-profile-object)  | TRUE     |          
  
#### Response Parameters
{:.api .api-response .api-response-params}

[Authentication Object](#authentication-model) for the next [authentication status](#authentication-status).

> Some [factor types](factors.html#factor-types) require [activation](#activate-factor) to complete the enrollment process.  The [authentication status](#authentication-status) will transition to `MFA_ENROLL_ACTIVATE` if a factor requires activation.

#### Enroll User with Security Question
{:.api .api-operation}

Enrolls a user with the Okta `question` factor and [question profile](factors.html#question-profile).

> Security Question factor does not require activation and is `ACTIVE` after enrollment

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn/factors
-d \
'{
  "stateToken": "00Z20ZhXVrmyR3z8R-m77BvknHyckWCy5vNwEA6huD",
  "factorType": "question",
  "provider": "OKTA",
  "profile": {
    "question": "name_of_first_plush_toy",
    "answer": "blah"
  }
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "expiresAt": "2014-11-03T12:36:40.000Z",
  "status": "SUCCESS",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "sessionToken": "00OhZsSfoCtbJTrU2XkwntfEl-jCj6ck6qcU_kA049",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "profile": {
        "login": "isaac@example.org",
        "firstName": "Isaac",
        "lastName": "Brock",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      }
    }
  }
}
~~~


#### Enroll User with Okta SMS Factor
{:.api .api-operation}

Enrolls a user with the Okta `sms` factor and a [SMS profile](factors.html#sms-profile).  A text message with an OTP is sent to the device during enrollment and must be [activated](#activate-sms-factor) by following the `next` link relation to complete the enrollment process.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn/factors
-d \
'{
  "stateToken": "00Z20ZhXVrmyR3z8R-m77BvknHyckWCy5vNwEA6huD",
  "factorType": "sms",
  "provider": "OKTA",
  "profile": {
    "phoneNumber": "+1-555-415-1337"
  }
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "stateToken": "00lT7DEzQaeP6mv1_y3pdXjNEONzk83mXX-yhgEdVQ",
  "expiresAt": "2014-11-03T00:46:09.700Z",
  "status": "MFA_ENROLL_ACTIVATE",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "profile": {
        "login": "isaac@example.org",
        "firstName": "Isaac",
        "lastName": "Brock",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      }
    },
    "factor": {
      "id": "mbl198rKSEWOSKRIVIFT",
      "factorType": "sms",
      "provider": "OKTA",
      "profile": {
        "phoneNumber": "+1 XXX-XXX-1337"
      }
    }
  },
  "_links": {
    "next": {
      "name": "activate",
      "href": "https://your-domain.okta.com/api/v1/authn/factors/mbl198rKSEWOSKRIVIFT/lifecycle/activate",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "cancel": {
      "href": "https://your-domain.okta.com/api/v1/authn/cancel",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "prev": {
      "href": "https://your-domain.okta.com/api/v1/authn/previous",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "resend": [
      {
        "name": "sms",
        "href": "https://your-domain.okta.com/api/v1/authn/factors/mbl198rKSEWOSKRIVIFT/lifecycle/resend",
        "hints": {
          "allow": [
            "POST"
          ]
        }
      }
    ]
  }
}
~~~

#### Enroll User with Okta Verify Factor
{:.api .api-operation}

Enrolls a user with the Okta `token:software:totp` factor.  The factor must be [activated](#activate-totp-factor) after enrollment by following the `next` link relation to complete the enrollment process.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn/factors
-d \
'{
  "stateToken": "00Z20ZhXVrmyR3z8R-m77BvknHyckWCy5vNwEA6huD",
  "factorType": "token:software:totp",
  "provider": "OKTA"
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "stateToken": "00wlafXU2GV9I3tNvDNkOA1thqM5gDwCOgHID_-Iej",
  "expiresAt": "2014-11-03T00:50:49.912Z",
  "status": "MFA_ENROLL_ACTIVATE",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "profile": {
        "login": "isaac@example.org",
        "firstName": "Isaac",
        "lastName": "Brock",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      }
    },
    "factor": {
      "id": "ostf2xjtDKWFPZIKYDZV",
      "factorType": "token:software:totp",
      "provider": "OKTA",
      "profile": {
        "credentialId": "isaac@example.org"
      },
      "_embedded": {
        "activation": {
          "timeStep": 30,
          "sharedSecret": "KBMTM32UJZSXQ2DW",
          "encoding": "base32",
          "keyLength": 6,
          "_links": {
            "qrcode": {
              "href": "https://your-domain.okta.com/api/v1/users/00uoy3CXZHSMMJPHYXXP/factors/ostf2xjtDKWFPZIKYDZV/qr/00Mb0zqhJQohwCDkB2wOifajAsAosEAXvDwuCmsAZs",
              "type": "image/png"
            }
          }
        }
      }
    }
  },
  "_links": {
    "next": {
      "name": "activate",
      "href": "https://your-domain.okta.com/api/v1/authn/factors/ostf2xjtDKWFPZIKYDZV/lifecycle/activate",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "cancel": {
      "href": "https://your-domain.okta.com/api/v1/authn/cancel",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "prev": {
      "href": "https://your-domain.okta.com/api/v1/authn/previous",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    }
  }
}
~~~

#### Enroll User with Google Authenticator Factor
{:.api .api-operation}

Enrolls a user with the Google `token:software:totp` factor.  The factor must be [activated](#activate-totp-factor) after enrollment by following the `next` link relation to complete the enrollment process.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn/factors
-d \
'{
  "stateToken": "00Z20ZhXVrmyR3z8R-m77BvknHyckWCy5vNwEA6huD",
  "factorType": "token:software:totp",
  "provider": "OKTA"
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "stateToken": "00wlafXU2GV9I3tNvDNkOA1thqM5gDwCOgHID_-Iej",
  "expiresAt": "2014-11-03T00:50:49.912Z",
  "status": "MFA_ENROLL_ACTIVATE",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "profile": {
        "login": "isaac@example.org",
        "firstName": "Isaac",
        "lastName": "Brock",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      }
    },
    "factor": {
      "id": "ostf2xjtDKWFPZIKYDZV",
      "factorType": "token:software:totp",
      "provider": "GOOGLE",
      "profile": {
        "credentialId": "isaac@example.org"
      },
      "_embedded": {
        "activation": {
          "timeStep": 30,
          "sharedSecret": "KYCRM33UJZSXQ2DW",
          "encoding": "base32",
          "keyLength": 6,
          "_links": {
            "qrcode": {
              "href": "https://your-domain.okta.com/api/v1/users/00ub0oNGTSWTBKOLGLNR/factors/uftm3iHSGFQXHCUSDAND/qr/00Mb0zqhJQohwCDkB2wOifajAsAosEAXvDwuCmsAZs",
              "type": "image/png"
            }
          }
        }
      }
    }
  },
  "_links": {
    "next": {
      "name": "activate",
      "href": "https://your-domain.okta.com/api/v1/authn/factors/uftm3iHSGFQXHCUSDAND/lifecycle/activate",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "cancel": {
      "href": "https://your-domain.okta.com/api/v1/authn/cancel",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "prev": {
      "href": "https://your-domain.okta.com/api/v1/authn/previous",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    }
  }
}
~~~


### Activate Factor
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /authn/factors/*:fid*/lifecycle/activate</span>

The `sms` and `token:software:totp` [factor types](factors.html#factor-types) require activation to complete the enrollment process.

- [Activate TOTP Factor](#activate-totp-factor)
- [Activate SMS Factor](#activate-sms-factor)

#### Activate TOTP Factor
{:.api .api-operation}

Activates a `token:software:totp` factor by verifying the OTP.

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                          | Param Type | DataType | Required | Default
------------ | ---------------------------------------------------- | ---------- | -------- | -------- | -------
fid          | `id` of factor returned from enrollment              | URL        | String   | TRUE     |
stateToken   | [state token](#state-token)  for current transaction | Body       | String   | TRUE     |
passCode     | OTP generated by device                              | Body       | String   | TRUE     |

#### Response Parameters
{:.api .api-response .api-response-params}

[Authentication Object](#authentication-model) for the next [authentication status](#authentication-status).

If the passcode is invalid you will receive a `403 Forbidden` status code with the following error: 

~~~http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "errorCode": "E0000068",
  "errorSummary": "Invalid Passcode/Answer",
  "errorLink": "E0000068",
  "errorId": "oaei_IfXcpnTHit_YEKGInpFw",
  "errorCauses": [
    {
      "errorSummary": "Your passcode doesn't match our records. Please try again."
    }
  ]
}
~~~

#### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn/factors/ostf1fmaMGJLMNGNLIVG/lifecycle/activate
-d \
'{
  "stateToken": "00wlafXU2GV9I3tNvDNkOA1thqM5gDwCOgHID_-Iej",
  "passCode": "123456"
}'
~~~

#### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "expiresAt": "2014-11-03T10:15:57.000Z",
  "status": "SUCCESS",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "sessionToken": "00Fpzf4en68pCXTsMjcX8JPMctzN2Wiw4LDOBL_9pe",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "profile": {
        "login": "isaac@example.org",
        "firstName": "Isaac",
        "lastName": "Brock",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      }
    }
  }
}
~~~

#### Activate SMS Factor
{:.api .api-operation}

Activates a `sms` factor by verifying the OTP.  The request/response is identical to [activating a TOTP factor](#activate-totp-factor)

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
fid          | `id` of factor returned from enrollment             | URL        | String   | TRUE     |
stateToken   | [state token](#state-token) for current transaction | Body       | String   | TRUE     |
passCode     | OTP sent to mobile device                           | Body       | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[Authentication Object](#authentication-model) for the next [authentication status](#authentication-status).

If the passcode is invalid you will receive a `403 Forbidden` status code with the following error: 

~~~http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "errorCode": "E0000068",
  "errorSummary": "Invalid Passcode/Answer",
  "errorLink": "E0000068",
  "errorId": "oaei_IfXcpnTHit_YEKGInpFw",
  "errorCauses": [
    {
      "errorSummary": "Your passcode doesn't match our records. Please try again."
    }
  ]
}
~~~

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn/factors/sms1o51EADOTFXHHBXBP/lifecycle/activate
-d \
'{
  "stateToken": "00wlafXU2GV9I3tNvDNkOA1thqM5gDwCOgHID_-Iej",
  "passCode": "123456"
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "expiresAt": "2014-11-03T10:15:57.000Z",
  "status": "SUCCESS",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "sessionToken": "00Fpzf4en68pCXTsMjcX8JPMctzN2Wiw4LDOBL_9pe",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "profile": {
        "login": "isaac@example.org",
        "firstName": "Isaac",
        "lastName": "Brock",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      }
    }
  }
}
~~~

### Verify Factor

Verifies an enrolled factor for an authentication transaction with the `MFA_REQUIRED` or `MFA_CHALLENGE` [status](#authentication-status)

- [Verify Security Question Factor](#verify-security-question-factor)
- [Verify SMS Factor](#verify-sms-factor)
- [Verify TOTP Factor](#verify-totp-factor)

#### Verify Security Question Factor
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /authn/factors/*:fid*/verify</span>

Verifies an answer to a `question` factor.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
fid          | `id` of factor returned from enrollment             | URL        | String   | TRUE     |
stateToken   | [state token](#state-token) for current transaction | Body       | String   | TRUE     |
answer       | answer to security question                         | Body       | String   | TRUE     |

> The factor verification is remembered to avoid additional MFA prompts when using the same [device token](#device-token). Even if the device is remembered, the organizational MFA policy can require an MFA challenge every time. The policy ultimately determines whether a user is challenged or not.

##### Response Parameters
{:.api .api-response .api-response-params}

[Authentication Object](#authentication-model) for the next [authentication status](#authentication-status).

If the `answer` is invalid you will receive a `403 Forbidden` status code with the following error: 

~~~json
{
  "errorCode": "E0000068",
  "errorSummary": "Invalid Passcode/Answer",
  "errorLink": "E0000068",
  "errorId": "oaei_IfXcpnTHit_YEKGInpFw",
  "errorCauses": [
    {
      "errorSummary": "Your answer doesn't match our records. Please try again."
    }
  ]
}
~~~

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn/factors/ufs1pe3ISGKGPYKXRBKK/verify
-d \
'{
  "stateToken": "00wlafXU2GV9I3tNvDNkOA1thqM5gDwCOgHID_-Iej",
  "answer": "mayonnaise"
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "expiresAt": "2014-11-03T13:50:17.000Z",
  "status": "SUCCESS",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "sessionToken": "00ZD3Z7ixppspFljXV2t_Z6GfrYzqG7cDJ8reWo2hy",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "profile": {
        "login": "isaac@example.org",
        "firstName": "Isaac",
        "lastName": "Brock",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      }
    }
  }
}
~~~

#### Verify SMS Factor
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /authn/factors/*:fid*/verify</span>

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
fid          | `id` of factor                                      | URL        | String   | TRUE     |
stateToken   | [state token](#state-token) for current transaction | Body       | String   | TRUE     |
passCode     | OTP sent to device                                  | Body       | String   | FALSE    |

> If you omit `passCode` in the request a new OTP will be sent to the device, otherwise the request will attempt to verify the `passCode`

#### Response Parameters
{:.api .api-response .api-response-params}

[Authentication Object](#authentication-model) for the next [authentication status](#authentication-status).

If the `passCode` is invalid you will receive a `403 Forbidden` status code with the following error: 

~~~json
{
  "errorCode": "E0000068",
  "errorSummary": "Invalid Passcode/Answer",
  "errorLink": "E0000068",
  "errorId": "oaei_IfXcpnTHit_YEKGInpFw",
  "errorCauses": [
    {
      "errorSummary": "Your answer doesn't match our records. Please try again."
    }
  ]
}
~~~


##### Send SMS OTP

Omit `passCode` in the request to sent an OTP to the device

###### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn/factors/sms193zUBEROPBNZKPPE/verify
-d \
'{
  "stateToken": "00wlafXU2GV9I3tNvDNkOA1thqM5gDwCOgHID_-Iej"
}'
~~~

###### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "stateToken": "00_7ekoccZn32i1u1hD_02dI54yW_cCXk2jniDYnMD",
  "expiresAt": "2014-11-03T01:58:09.097Z",
  "status": "MFA_CHALLENGE",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "profile": {
        "login": "isaac@example.org",
        "firstName": "Isaac",
        "lastName": "Brock",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      }
    },
    "factor": {
      "id": "sms193zUBEROPBNZKPPE",
      "factorType": "sms",
      "provider": "OKTA",
      "profile": {
        "phoneNumber": "+1 XXX-XXX-1337"
      }
    }
  },
  "_links": {
    "next": {
      "name": "verify",
      "href": "https://your-domain.okta.com/api/v1/authn/factors/sms193zUBEROPBNZKPPE/verify",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "cancel": {
      "href": "https://your-domain.okta.com/api/v1/authn/cancel",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "prev": {
      "href": "https://your-domain.okta.com/api/v1/authn/previous",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "resend": [
      {
        "name": "sms",
        "href": "https://your-domain.okta.com/api/v1/authn/factors/sms193zUBEROPBNZKPPE/verify/resend",
        "hints": {
          "allow": [
            "POST"
          ]
        }
      }
    ]
  }
}
~~~

##### Verify SMS OTP

Specify `passCode` in the request to verify the factor.

###### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn/factors/sms193zUBEROPBNZKPPE/verify
-d \
'{
  "stateToken": "00wlafXU2GV9I3tNvDNkOA1thqM5gDwCOgHID_-Iej",
  "passCode": "657866"
}'
~~~

###### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "expiresAt": "2014-11-03T14:02:27.000Z",
  "status": "SUCCESS",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "sessionToken": "00t6IUQiVbWpMLgtmwSjMFzqykb5QcaBNtveiWlGeM",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "profile": {
        "login": "isaac@example.org",
        "firstName": "Isaac",
        "lastName": "Brock",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      }
    }
  }
}
~~~

#### Verify TOTP Factor
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /authn/factors/*:fid*/verify</span>

Verifies an OTP for a `token:software:totp` factor.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
fid          | `id` of factor                                      | URL        | String   | TRUE     |
stateToken   | [state token](#state-token) for current transaction | Body       | String   | TRUE     |
passCode     | OTP sent to device                                  | Body       | String   | FALSE    |

##### Response Parameters
{:.api .api-response .api-response-params}

[Authentication Object](#authentication-model) for the next [authentication status](#authentication-status).

If the passcode is invalid you will receive a `403 Forbidden` status code with the following error: 

~~~json
{
  "errorCode": "E0000068",
  "errorSummary": "Invalid Passcode/Answer",
  "errorLink": "E0000068",
  "errorId": "oaei_IfXcpnTHit_YEKGInpFw",
  "errorCauses": [
    {
      "errorSummary": "Your passcode doesn't match our records. Please try again."
    }
  ]
}
~~~

###### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn/factors/ostfm3hPNYSOIOIVTQWY/verify
-d \
'{
  "stateToken": "00wlafXU2GV9I3tNvDNkOA1thqM5gDwCOgHID_-Iej",
  "passCode": "657866"
}'
~~~

###### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "expiresAt": "2014-11-03T14:02:27.000Z",
  "status": "SUCCESS",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "sessionToken": "00t6IUQiVbWpMLgtmwSjMFzqykb5QcaBNtveiWlGeM",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "profile": {
        "login": "isaac@example.org",
        "firstName": "Isaac",
        "lastName": "Brock",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      }
    }
  }
}
~~~

## Recovery Operations

### Forgot Password
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /authn/recovery/password</span>

Issues a [recovery token](#recovery-token) for a given user that can be used to reset a user's password.

> The `recoveryToken` is usually sent directly to the end-user via email or SMS.  Obtaining a `recoveryToken` is a highly privileged operation and should be restricted to trusted web applications.  Anyone that obtains a `recoveryToken` for a user and knows the answer to user's recovery question can reset their password or unlock their account.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter   | Description                                                                                            | Param Type | DataType                          | MaxLength | Required | Default
----------- | ------------------------------------------------------------------------------------------------------ | ---------- | --------------------------------- | --------- | -------- |
username    | User's non-qualified short-name (e.g. isaac) or unique fully-qualified login (e.g issac@example.org)   | Body       | String                            |           | TRUE     |
relayState  | Optional state value that is persisted for the lifetime of the recovery transaction                    | Body       | String                            | 2048      | FALSE    |

##### Response Parameters
{:.api .api-response .api-response-params}

[Authentication Object](#authentication-model) with a `RECOVERY` status and an issued `recoveryToken` that can be distributed to the end-user.

You will receive a `404 Not Found` status code if the `username` requested is not valid

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn/recovery/password
-d \
'{
  "username": "isaac@example.org",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to"
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "expiresAt": "2014-11-10T04:06:58.000Z",
  "status": "RECOVERY",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "recoveryToken": "VBQ0gwBp5LyJJFdbmWCM",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "profile": {
        "login": "isaac@example.org",
        "firstName": "Isaac",
        "lastName": "Brock",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      }
    }
  },
  "_links": {
    "next": {
      "name": "recovery",
      "href": "https://your-domain.okta.com/api/v1/authn/recovery/token",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "cancel": {
      "href": "https://your-domain.okta.com/api/v1/authn/cancel",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    }
  }
}
~~~

### Unlock Account
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /authn/recovery/unlock</span>

Issues a [recovery token](#recovery-token) for a user that can be used to unlock their account.

> Self-service unlock must be enabled in your organization's password policy.

> The `recoveryToken` is usually sent directly to the end-user via email or SMS.  Obtaining a `recoveryToken` is a highly privileged operation and should be restricted to trusted web applications.  Anyone that obtains a `recoveryToken` for a user and knows the answer to user's recovery question can reset their password or unlock their account.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter   | Description                                                                                            | Param Type | DataType                          | MaxLength | Required | Default
----------- | ------------------------------------------------------------------------------------------------------ | ---------- | --------------------------------- | --------- | -------- |
username    | User's non-qualified short-name (e.g. isaac) or unique fully-qualified login (e.g issac@example.org)   | Body       | String                            |           | TRUE     |
relayState  | Optional state value that is persisted for the lifetime of the recovery transaction                    | Body       | String                            | 2048      | FALSE    |

##### Response Parameters
{:.api .api-response .api-response-params}

[Authentication Object](#authentication-model) with a `RECOVERY` status and an issued `recoveryToken` that can be distributed to the end-user.

You will receive a `404 Not Found` status code if the `username` requested is not valid

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn/recovery/unlock
-d \
'{
  "username": "isaac@example.org",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to"
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "expiresAt": "2014-11-10T04:06:58.000Z",
  "status": "RECOVERY",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "recoveryToken": "VBQ0gwBp5LyJJFdbmWCM",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "profile": {
        "login": "isaac@example.org",
        "firstName": "Isaac",
        "lastName": "Brock",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      }
    }
  },
  "_links": {
    "next": {
      "name": "recovery",
      "href": "https://your-domain.okta.com/api/v1/authn/recovery/token",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "cancel": {
      "href": "https://your-domain.okta.com/api/v1/authn/cancel",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    }
  }
}
~~~

### Verify Recovery Token
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /authn/recovery/token</span>

Validates a [recovery token](#recovery-token) that was distributed to the end-user to continue the recovery transaction. 

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter     | Description                                                                                                | Param Type | DataType | Required | Default
------------- | ---------------------------------------------------------------------------------------------------------- | ---------- | -------- | -------- |
recoveryToken | [Recovery token](#recovery-token) that was distributed to end-user via out-of-band mechanism such as email | Body       | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[Authentication Object](#authentication-model) with a `RECOVERY` status and an issued `stateToken` that must be used to complete the recovery transaction.

You will receive a `401 Unauthorized` status code if you attempt to use an expired or invalid [recovery token](#recovery-token).

~~~http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
    "errorCode": "E0000011",
    "errorSummary": "Invalid token provided",
    "errorLink": "E0000011",
    "errorId": "oaeY-4G_TBUTBSZAn9n7oZCfw",
    "errorCauses": []
}
~~~

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn/recovery/token
-d \
'{
  "recoveryToken": "/myapp/some/deep/link/i/want/to/return/to"
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "stateToken": "00lMJySRYNz3u_rKQrsLvLrzxiARgivP8FB_1gpmVb",
  "expiresAt": "2014-11-03T04:35:20.748Z",
  "status": "RECOVERY",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "profile": {
        "login": "isaac@example.org",
        "firstName": "Isaac",
        "lastName": "Brock",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      },
      "recovery_question": {
        "question": "Who's a major player in the cowboy scene?"
      }
    }
  },
  "_links": {
    "next": {
      "name": "answer",
      "href": "https://your-domain.okta.com/api/v1/authn/recovery/answer",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "cancel": {
      "href": "https://your-domain.okta.com/api/v1/authn/cancel",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    }
  }
}
~~~

### Answer Recovery Question 
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /authn/recovery/answer</span>

Answers the user's recovery question to ensure only the end-user reclaimed the [recovery token](#recovery-token) for recovery transaction with a `RECOVERY` [status](#authentication-status).

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
stateToken   | [state token](#state-token) for current transaction | Body       | String   | TRUE     |
answer       | answer to user's recovery question                  | Body       | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[Authentication Object](#authentication-model) for the next [authentication status](#authentication-status).

You will receive a `403 Forbidden` status code if the `answer` to the user's [recovery question](#recovery-question-object) is invalid

~~~http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
    "errorCode": "E0000087",
    "errorSummary": "The recovery question answer did not match our records.",
    "errorLink": "E0000087",
    "errorId": "oaeGEiIPFfeR3a_XxpezUH9ug",
    "errorCauses": []
}
~~~

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn/recovery/answer
-d \
'{
  "stateToken": "00lMJySRYNz3u_rKQrsLvLrzxiARgivP8FB_1gpmVb",
  "answer": "Cowboy Dan"
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "stateToken": "00Ehr_AX8eU6E0LTLaa1uCWUmM2cMUa-2WVNxfnyyg",
  "expiresAt": "2014-11-03T04:57:56.038Z",
  "status": "PASSWORD_RESET",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "profile": {
        "login": "isaac@example.org",
        "firstName": "Isaac",
        "lastName": "Brock",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      }
    }
  },
  "_links": {
    "next": {
      "name": "password",
      "href": "https://your-domain.okta.com/api/v1/authn/credentials/reset_password",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "cancel": {
      "href": "https://your-domain.okta.com/api/v1/authn/cancel",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    }
  }
}
~~~

### Reset Password 
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /authn/credentials/reset_password</span>

Resets a user's password to complete a recovery transaction with a `PASSWORD_RESET` [status](#authentication-status).

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
stateToken   | [state token](#state-token) for current transaction | Body       | String   | TRUE     |
newPassword  | user's new password                                 | Body       | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[Authentication Object](#authentication-model) for the next [authentication status](#authentication-status).

You will receive a `403 Forbidden` status code if the `answer` to the user's [recovery question](#recovery-question-object) is invalid.

~~~http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
    "errorCode": "E0000087",
    "errorSummary": "The recovery question answer did not match our records.",
    "errorLink": "E0000087",
    "errorId": "oaeGEiIPFfeR3a_XxpezUH9ug",
    "errorCauses": []
}
~~~

You will also receive a `403 Forbidden` status code if the `newPassword` does not meet password policy requirements for the user.

~~~http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
    "errorCode": "E0000080",
    "errorSummary": "The password does meet the complexity requirements of the current password policy.",
    "errorLink": "E0000080",
    "errorId": "oaeS4O7BUp5Roefkk_y4Z2u8Q",
    "errorCauses": [
        {
            "errorSummary": "Passwords must have at least 8 characters, a lowercase letter, an uppercase letter, a number, no parts of your username"
        }
    ]
}
~~~

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn/credentials/reset_password
-d \
'{
  "stateToken": "00lMJySRYNz3u_rKQrsLvLrzxiARgivP8FB_1gpmVb",
  "newPassword": "Ch-ch-ch-ch-Changes!"
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "expiresAt": "2014-11-03T04:57:56.038Z",
  "status": "SUCCESS",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "sessionToken": "00t6IUQiVbWpMLgtmwSjMFzqykb5QcaBNtveiWlGeM",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "profile": {
        "login": "isaac@example.org",
        "firstName": "Isaac",
        "lastName": "Brock",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      }
    }
  }
}
~~~

## State Management Operations

### Get Authentication Status for Transaction
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /authn</span>

Retrieves the current [authentication status](#authentication-status) for a [state token](#state-token).

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
stateToken   | [state token](#state-token) for a transaction       | Body       | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[Authentication Object](#authentication-model) for the current [authentication status](#authentication-status).

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn
-d \
'{
  "stateToken": "00lMJySRYNz3u_rKQrsLvLrzxiARgivP8FB_1gpmVb"
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "stateToken": "00OxquNRT_jR-Vy1KoVLYcGvb-0Swj6NN6rWL0krV5",
  "expiresAt": "2014-11-03T05:28:30.000Z",
  "status": "MFA_CHALLENGE",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to",
  "_embedded": {
    "user": {
      "id": "00ub0oNGTSWTBKOLGLNR",
      "profile": {
        "login": "isaac@example.org",
        "firstName": "Isaac",
        "lastName": "Brock",
        "locale": "en_US",
        "timeZone": "America/Los_Angeles"
      }
    },
    "factor": {
      "id": "sms193zUBEROPBNZKPPE",
      "factorType": "sms",
      "provider": "OKTA",
      "profile": {
        "phoneNumber": "+1 XXX-XXX-1337"
      }
    }
  },
  "_links": {
    "next": {
      "name": "verify",
      "href": "https://your-domain.okta.com/api/v1/authn/factors/sms193zUBEROPBNZKPPE/verify",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "cancel": {
      "href": "https://your-domain.okta.com/api/v1/authn/cancel",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "prev": {
      "href": "https://your-domain.okta.com/api/v1/authn/previous",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    }
  }
}
~~~

### Cancel Transaction
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /authn/cancel</span>

Cancels the current authentication transaction and revokes the [state token](#state-token).

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
stateToken   | [state token](#state-token) for a transaction       | Body       | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

Parameter    | Description                                                                            | Param Type | DataType | Required | Default
------------ | -------------------------------------------------------------------------------------- | ---------- | -------- | -------- | -------
relayState   | Optional state value that was persisted for the authentication or recovery transaction | Body       | String   | TRUE     |

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/authn/cancel
-d \
'{
  "stateToken": "00lMJySRYNz3u_rKQrsLvLrzxiARgivP8FB_1gpmVb"
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "relayState": "/myapp/some/deep/link/i/want/to/return/to"
}
~~~
