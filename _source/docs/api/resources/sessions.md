---
layout: docs_page
title: Sessions
redirect_from: "/docs/api/rest/sessions.html"
---

## Overview

Okta uses a cookie-based authentication mechanism to maintain a user's authentication session across web requests.  The Okta Sessions API provides operations to create and manage authentication sessions for users in your Okta organization.

### Session Cookie

Okta utilizes a HTTP session cookie to provide access to your Okta organization and applications across web requests for an interactive user agent such as a web browser.  Session cookies have an expiration configurable by an administrator for the organization and are valid until the cookie expires or the user closes the session (logout) or browser application.

### Session Token

A [session token](./authn.html#session-token) is a bearer token that provides proof of authentication and may be redeemed for an interactive SSO session in Okta in a user agent.  Session tokens can only be used **once** to establish a session for a user and are revoked when the token expires.

Okta provides a very rich [Authentication API](./authn.html) to validate a [user's primary credentials](./authn.html#primary-authentication) and secondary [MFA factor](./authn.html#verify-factor). A one-time [session token](./authn.html#session-token) is returned after successful authentication which can be later exchanged for a session cookie using one of the following flows:

- [Retrieving a session cookie by visiting a session redirect link](/docs/examples/session_cookie.html#retrieving-a-session-cookie-by-visiting-a-session-redirect-link)
- [Retrieving a session cookie by visiting an application embed link](/docs/examples/session_cookie.html#retrieving-a-session-cookie-by-visiting-an-application-embed-link)
- [Retrieving a session cookie embedding a hidden image](/docs/examples/session_cookie.html#retrieving-a-session-cookie-with-a-hidden-image)

> **Session Tokens** are secrets and should be protected at rest as well as during transit. A session token for a user is equivalent to having the user's actual credentials.

## Session Model

### Example

~~~ json
{
  "id": "000najcYVnjRS2aZG50MpHL4Q",
  "login": "user@example.com",
  "userId": "00ubgaSARVOQDIOXMORI",
  "login": "user@example.com",
  "expiresAt": "2015-08-30T18:41:35.818Z",
  "status": "ACTIVE",
  "lastPasswordVerification": "2015-08-30T18:41:35.818Z",
  "lastFactorVerification": "2015-08-30T18:41:35.818Z",
  "amr": [
    "pwd",
    "otp",
    "mfa"
  ],
  "idp": {
    "id": "00oi5cpnylv792IcF0g3",
    "type": "OKTA"
  },
  "mfaActive": true,
  "_links": {
    "self": {
      "href": "https://your-domain.okta.com/api/v1/sessions/trsAua5UueNQ-queLdV4KAhog",
      "hints": {
        "allow": [
          "GET",
          "DELETE"
        ]
      }
    },
    "refresh": {
      "href": "https://your-domain.okta.com/api/v1/sessions/trsAua5UueNQ-queLdV4KAhog/lifecycle/refresh",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "user": {
      "name": "Isaac Brock",
      "href": "https://your-domain.okta.com/api/v1/users/me",
      "hints": {
        "allow": [
          "GET",
          "POST"
        ]
      }
    }
  }
}
~~~

### Session Properties

Sessions have the following properties:

|--------------------------+-----------------------------------------------------------------------------------------------+-------------------------------------------+----------+--------+----------+-----------+-----------+------------|
| Property                 | Description                                                                                   | DataType                                  | Nullable | Unique | Readonly | MinLength | MaxLength | Validation |
| ------------------------ | --------------------------------------------------------------------------------------------- | ----------------------------------------- | -------- | ------ | -------- | --------- | --------- | ---------- |
| id                       | unique key for the session                                                                    | String                                    | FALSE    | TRUE   | TRUE     |           |           |            |
| login                    | unique identifier for the user (username)                                                     | String                                    | FALSE    | TRUE   | TRUE     |           |           |            |
| userId                   | unique key for the [user](users.html#get-user-with-id)                                        | String                                    | FALSE    | TRUE   | TRUE     |           |           |            |
| login                    | unique identifier for the [user](users.html#get-user-with-id)                                 | String                                    | FALSE    | TRUE   | TRUE     |           |           |            |
| expiresAt                | timestamp when session expires                                                                | Date                                      | FALSE    | TRUE   | TRUE     |           |           |            |
| status                   | current [status](#session-status) of the session                                              | `ACTIVE`, `MFA_REQUIRED`, or `MFA_ENROLL` | FALSE    | TRUE   | TRUE     |           |           |            |
| lastPasswordVerification | timestamp when user last performed primary authentication (with password)                     | Date                                      | FALSE    | TRUE   | TRUE     |           |           |            |
| lastFactorVerification   | timestamp when user last performed multi-factor authentication                                | Date                                      | TRUE     | TRUE   | TRUE     |           |           |            |
| amr                      | authentication method reference                                                               | [AMR Object](#amr-object)                 | FALSE    | FALSE  | TRUE     |           |           |            |
| idp                      | identity provider used to authenticate the user                                               | [IDP Object](#idp-object)                 | FALSE    | FALSE  | TRUE     |           |           |            |
| mfaActive                | indicates whether the user has [enrolled an MFA factor](./factors.html#list-enrolled-factors)  | Boolean                                   | FALSE    | FALSE  | TRUE     |           |           |            |
|--------------------------+-----------------------------------------------------------------------------------------------+-------------------------------------------+----------+--------+----------+-----------+-----------+------------|

#### Optional Session Properties

The [Create Session](#create-session) operation can optionally return the following properties when requested.

|----------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Property       | Description                                                                                                                                                                        |
| -------------- | -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| cookieToken    | Another one-time token which can be used to obtain a session cookie by visiting either an application's embed link or a session redirect URL.                                      |
| cookieTokenUrl | URL for a a transparent 1x1 pixel image which contains a one-time session token which when visited sets the session cookie in your browser for your organization.                  |
|----------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

> The `cookieTokenUrl` is deprecated as modern browsers block cookies set via embedding images from another origin (cross-domain).

### Session Status

The following values are defined for the status of a session:

- `ACTIVE`: the session is established and fully validated
- `MFA_REQUIRED`: the session is established but requires second factor verification
- `MFA_ENROLL`: the session is established but the user needs to enroll in a second factor

### AMR Object

The authentication methods reference ("AMR") specifies which authentication methods were used to establish the session. The value is a JSON array with one or more of the following values:

|----------+------------------------------------------------------+---------------------------------------------------------------------------|
| Value    | Description                                          | Example                                                                   |
| -------- | -----------------------------------------------------|---------------------------------------------------------------------------|
| `pwd`    | Password authentication                              | Standard password-based login                                             |
| `swk`    | Proof-of-possession (PoP) of a software-secured key. | Okta Verify with Push                                                     |
| `hwk`    | Proof-of-possession (PoP) of a hardware-secured key. | Yubikey factor                                                            |
| `otp`    | One-time password                                    | Okta Verify, Google Authenticator                                         |
| `sms`    | SMS text message                                     | SMS factor                                                                |
| `kba`    | Knowlege-based authentication                        | Security Question factor                                                  |
| `mfa`    | Multiple factor authentication                       | (This value is present whenever any MFA factor verification is performed) |
|--------- +------------------------------------------------------+---------------------------------------------------------------------------|

### IDP Object

Specifies the identity provider used to authentication the user.

|-------------+---------------------------------------------------------------+-----------+--------+----------+-----------+-----------+------------|
| Property    | DataType                                                      | Nullable  | Unique | Readonly | MinLength | MaxLength | Validation |
| ------------| ------------------------------------------------------------- | --------- | -------| -------- | --------- | --------- | ---------- |
| id          | String                                                        | FALSE     | FALSE  | TRUE     |           |           |            |
| type        | `OKTA`, `ACTIVE_DIRECTORY`, `LDAP`, `FEDERATION`, or `SOCIAL` | FALSE     | FALSE  | TRUE     |           |           |            |
|-------------+---------------------------------------------------------------+-----------+--------+----------+-----------+-----------+------------|

> The `id` will be the org id if the type is `OKTA`; otherwise it will be the IDP instance id.

~~~json
{
  "idp": {
    "id": "0oabhnUQFYHMBNVSVXMV",
    "type": "ACTIVE_DIRECTORY"
  }
}
~~~

## Session Operations

### Create Session with Session Token
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /sessions</span>

Creates a new session for a user with a valid session token.  Only use this operation if you need the session `id`, otherwise you should use one of the following flows to obtain a SSO session with a `sessionToken`:

- [Retrieving a session cookie by visiting a session redirect link](/docs/examples/session_cookie.html#retrieving-a-session-cookie-by-visiting-a-session-redirect-link)
- [Retrieving a session cookie by visiting an application embed link](/docs/examples/session_cookie.html#retrieving-a-session-cookie-by-visiting-an-application-embed-link)

> This operation can be performed anonymously without an API Token.

##### Request Parameters
{:.api .request-parameters}

Parameter        | Description                                                   | Param Type | DataType                        | Required | Default
---------------- | ------------------------------------------------------------- | ---------- | ------------------------------- | -------- | -------
additionalFields | Optional [session properties](#optional-session-properties)   | Query      | String (comma separated values) | FALSE    |
sessionToken     | Session token obtained via [Authentication API](./authn.html) | Body       | String                          | TRUE     |

> Creating a session with `username` and `password` has been deprecated.  Use the [Authentication API](./authn.html) to obtain a `sessionToken`.

##### Response Parameters
{:.api .api-response .api-response-params}

The new [Session](#session-model) for the user if the `sessionToken` was valid.

Invalid `sessionToken` will return a `401 Unauthorized` status code.

~~~ http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
    "errorCode": "E0000004",
    "errorSummary": "Authentication failed",
    "errorLink": "E0000004",
    "errorId": "oaeVCVElsluRpii8PP4GeLYxA",
    "errorCauses": []
}
~~~

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-d '{
  "sessionToken": "00HiohZYpJgMSHwmL9TQy7RRzuY-q9soKp1SPmYYow"
}' "https://${org}.okta.com/api/v1/sessions"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
  "id": "000najcYVnjRS2aZG50MpHL4Q",
  "login": "user@example.com",
  "userId": "00ubgaSARVOQDIOXMORI",
  "login": "user@example.com",
  "expiresAt": "2015-08-30T18:41:35.818Z",
  "status": "ACTIVE",
  "lastPasswordVerification": "2015-08-30T18:41:35.818Z",
  "lastFactorVerification": "2015-08-30T18:41:35.818Z",
  "amr": [
    "pwd"
  ],
  "idp": {
    "id": "00oi5cpnylv792IcF0g3",
    "type": "OKTA"
  },
  "mfaActive": false,
  "_links": {
    "self": {
      "href": "https://your-domain.okta.com/api/v1/sessions/trsAua5UueNQ-queLdV4KAhog",
      "hints": {
        "allow": [
          "GET",
          "DELETE"
        ]
      }
    },
    "refresh": {
      "href": "https://your-domain.okta.com/api/v1/sessions/trsAua5UueNQ-queLdV4KAhog/lifecycle/refresh",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "user": {
      "name": "Isaac Brock",
      "href": "https://your-domain.okta.com/api/v1/users/me",
      "hints": {
        "allow": [
          "GET",
          "POST"
        ]
      }
    }
  }
}
~~~

### Extend Session
{:.api .api-operation}

<span class="api-uri-template api-uri-put"><span class="api-label">PUT</span> /sessions/*:id*</span>

Extends the lifetime of a user's session.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                            | Param Type | DataType | Required | Default
--------- | -------------------------------------- | ---------- | -------- | -------- | -------
id        | `id` of a valid session                | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[Session](#session-model)

Invalid sessions will return a `404 Not Found` status code.

~~~ http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
    "errorCode": "E0000007",
    "errorSummary": "Not found: Resource not found: 000rWcxHV-lQUOzBhLJLYTl0Q (AppSession)",
    "errorLink": "E0000007",
    "errorId": "oaeAu0LCZaeRMaJqzQ3OzFuow",
    "errorCauses": []
}
~~~

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X PUT \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/sessions/000NyyOduusQ2ibzaJUTPUqhQ"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
  "id": "000najcYVnjRS2aZG50MpHL4Q",
  "login": "user@example.com",
  "userId": "00ubgaSARVOQDIOXMORI",
  "login": "user@example.com",
  "expiresAt": "2015-08-30T18:41:35.818Z",
  "status": "ACTIVE",
  "lastPasswordVerification": "2015-08-30T18:41:35.818Z",
  "lastFactorVerification": "2015-08-30T18:41:35.818Z",
  "amr": [
    "pwd"
  ],
  "idp": {
    "id": "00oi5cpnylv792IcF0g3",
    "type": "OKTA"
  },
  "mfaActive": false,
  "_links": {
    "self": {
      "href": "https://your-domain.okta.com/api/v1/sessions/trsAua5UueNQ-queLdV4KAhog",
      "hints": {
        "allow": [
          "GET",
          "DELETE"
        ]
      }
    },
    "refresh": {
      "href": "https://your-domain.okta.com/api/v1/sessions/trsAua5UueNQ-queLdV4KAhog/lifecycle/refresh",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "user": {
      "name": "Isaac Brock",
      "href": "https://your-domain.okta.com/api/v1/users/me",
      "hints": {
        "allow": [
          "GET",
          "POST"
        ]
      }
    }
  }
}
~~~

### Close Session
{:.api .api-operation}

<span class="api-uri-template api-uri-delete"><span class="api-label">DELETE</span> /sessions/*:id*</span>

Closes a user's session (logout).

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description             | Param Type | DataType | Required | Default
--------- | ----------------------- | ---------- | -------- | -------- | -------
id        | `id` of a valid session | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

~~~ http
HTTP/1.1 204 No Content
~~~

Invalid sessions will return a `404 Not Found` status code.

~~~ http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
    "errorCode": "E0000007",
    "errorSummary": "Not found: Resource not found: 000rWcxHV-lQUOzBhLJLYTl0Q (AppSession)",
    "errorLink": "E0000007",
    "errorId": "oaeAu0LCZaeRMaJqzQ3OzFuow",
    "errorCauses": []
}
~~~

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/sessions/000NyyOduusQ2ibzaJUTPUqhQ"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ http
HTTP/1.1 204 No Content
~~~


#### Get Current Session
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /sessions/me</span>
<span class="api-label api-label-cors pull-right"><i class="fa fa-cloud-download"></i> CORS</span>


Get session information for the current user. Use this method in a browser based application to determine if the user is logged in.

> The session `id` returned from `/sessions/me` is an `externalId` and can only be used with the [Refresh Session](#refresh-session) endpoint.

##### Request Example
{:.api .api-request .api-request-example}

~~~ sh
curl -v -X GET \
-H "Cookie: sid=${okta_session_id}"
"https://${org}.okta.com/api/v1/sessions/me"
~~~

##### Response Examples
{:.api .api-response .api-response-example}

`404 Not Found` status code is returned when a current session can not be found.

~~~http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "errorCode": "E0000007",
  "errorSummary": "Not found: Resource not found: me (Session)",
  "errorLink": "E0000007",
  "errorId": "abcDeFghiJKLMNOPQRSTUvWXy",
  "errorCauses": []
}
~~~

A [Session Object](#session-model) is returned when a current session can be found.

As noted above, `id` in the example below can only be used with the [Refresh Session](#refresh-session) endpoint.

~~~ json
{
    "amr": [
        "pwd"
    ],
    "expiresAt": "2016-01-03T09:13:17.000Z",
    "id": "012a34BCDeFGhi56jklMNO_pQ",
    "login": "user@example.com",
    "idp": {
        "id": "01a2bcdef3GHIJKLMNOP",
        "type": "OKTA"
    },
    "lastFactorVerification": "2015-10-28T23:40:53.000Z",
    "lastPasswordVerification": "2016-01-03T07:02:00.000Z",
    "mfaActive": true,
    "status": "ACTIVE",
    "userId": "00u0abcdefGHIJKLMNOP",
    "_links": {
        "refresh": {
            "hints": {
                "allow": [
                    "POST"
                ]
            },
            "href": "https://example.okta.com/api/v1/sessions/012a34BCDeFGhi56jklMNO_pQ/lifecycle/refresh"
        },
        "self": {
            "hints": {
                "allow": [
                    "GET",
                    "DELETE"
                ]
            },
            "href": "https://example.okta.com/api/v1/sessions/012a34BCDeFGhi56jklMNO_pQ"
        },
        "user": {
            "hints": {
                "allow": [
                    "GET",
                    "POST"
                ]
            },
            "href": "https://example.okta.com/api/v1/users/me",
            "name": "Isaac Brock"
        }
    }
}
~~~

### Close Current Session
{:.api .api-request .api-request-example}

<span class="api-uri-template api-uri-delete"><span class="api-label">DELETE</span> /sessions/me</span>
<span class="api-label api-label-cors pull-right"><i class="fa fa-cloud-download"></i> CORS</span>

Close the session for the currently logged in user. Use this method in a browser based application to "log out" a user.

~~~ sh
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Cookie: sid=${okta_session_id}" \
"https://${org}.okta.com/api/v1/sessions/me"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ http
HTTP/1.1 204 No Content
~~~

### Refresh Session
{:.api .api-request .api-request-example}

Refresh a session using the `externalId` for that session.

The `externalId` for a session is the `id` as returned by the [/sessions/me](#get-current-session) endpoint.

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /sessions/*:externalId*/lifecycle/refresh</span>
<span class="api-label api-label-cors pull-right"><i class="fa fa-cloud-download"></i> CORS</span>

~~~ sh
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Cookie: sid=${okta_session_id}" \
"https://${org}.okta.com/api/v1/sessions/me"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ http
HTTP/1.1 204 No Content
~~~
