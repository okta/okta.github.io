---
layout: docs_page
title: Sessions
redirect_from: "/docs/api/rest/sessions.html"
---

# Sessions API

Okta uses a cookie-based authentication mechanism to maintain a user's authentication session across web requests. The Okta Sessions API provides operations to create and manage authentication sessions for users in your Okta organization.

### Session Cookie

Okta utilizes a HTTP session cookie to provide access to your Okta organization and applications across web requests for an interactive user agent such as a web browser. Session cookies have an expiration configurable by an administrator for the organization and are valid until the cookie expires or the user closes the session (logout) or browser application.

### Session Token

A [session token](./authn.html#session-token) is a one-time bearer token that provides proof of authentication and may be redeemed for an interactive SSO session in Okta in a user agent. Session tokens can only be used **once** to establish a session for a user and are revoked when the token expires.

Okta provides a very rich [Authentication API](./authn.html) to validate a [user's primary credentials](./authn.html#primary-authentication) and secondary [MFA factor](./authn.html#verify-factor). A session token is returned after successful authentication which can be later exchanged for a session cookie using one of the following flows:

- [Retrieving a session cookie by visiting the OpenID Connect Authorization Endpoint](/use_cases/authentication/session_cookie#retrieving-a-session-cookie-via-openid-connect-authorization-endpoint)
- [Retrieving a session cookie by visiting a session redirect link](/use_cases/authentication/session_cookie#retrieving-a-session-cookie-by-visiting-a-session-redirect-link)
- [Retrieving a session cookie by visiting an application embed link](/use_cases/authentication/session_cookie#retrieving-a-session-cookie-by-visiting-an-application-embed-link)

> **Session Tokens** are secrets and should be protected at rest as well as during transit. A session token for a user is equivalent to having the user's actual credentials.

## Getting Started

Explore the Sessions API: [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/b2e06a22c396bcc94530)

## Session Operations

### Create Session with Session Token
{:.api .api-operation}

{% api_operation post /api/v1/sessions %}

Creates a new session for a user with a valid session token. Use this API if, for example, you want to set the session cookie yourself instead of allowing Okta to set it, or want to hold the session ID in order to delete a session via the API instead of visiting the logout URL.

> Don't use this API unless you need a session `id`. Instead, use one of the following flows to obtain a SSO session with a `sessionToken`:

- [Retrieving a session cookie by visiting the OpenID Connect Authorization Endpoint](/use_cases/authentication/session_cookie#retrieving-a-session-cookie-via-openid-connect-authorization-endpoint)
- [Retrieving a session cookie by visiting a session redirect link](/use_cases/authentication/session_cookie#retrieving-a-session-cookie-by-visiting-a-session-redirect-link)
- [Retrieving a session cookie by visiting an application embed link](/use_cases/authentication/session_cookie#retrieving-a-session-cookie-by-visiting-an-application-embed-link)

> This operation can be performed anonymously without an API Token.

##### Request Parameters
{:.api .request-parameters}

Parameter        | Description                                                   | Param Type | DataType                        | Required | Default
---------------- | ------------------------------------------------------------- | ---------- | ------------------------------- | -------- | -------
additionalFields | Optional [session properties](#optional-session-properties)   | Query      | String (comma separated values) | FALSE    |
sessionToken     | Session token obtained via [Authentication API](./authn.html) | Body       | String                          | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

The response will contain the new [Session](#session-model) for the user if the `sessionToken` was valid.

If an invalid `sessionToken` is provided, a `401 Unauthorized` status code will be returned.


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
  "id": "101W_juydrDRByB7fUdRyE2JQ",
  "login": "user@example.com",
  "userId": "00ubgaSARVOQDIOXMORI",
  "expiresAt": "2015-08-30T18:41:35.818Z",
  "status": "ACTIVE",
  "lastPasswordVerification": "2015-08-30T18:41:35.818Z",
  "lastFactorVerification": null,
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
      "href": "https://your-domain.okta.com/api/v1/sessions/101W_juydrDRByB7fUdRyE2JQ",
      "hints": {
        "allow": [
          "GET",
          "DELETE"
        ]
      }
    },
    "refresh": {
      "href": "https://your-domain.okta.com/api/v1/sessions/101W_juydrDRByB7fUdRyE2JQ/lifecycle/refresh",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "user": {
      "name": "Isaac Brock",
      "href": "https://your-domain.okta.com/api/v1/users/00uit00ZK6ELuzPoD0g3",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    }
  }
}
~~~

#### Get Session
{:.api .api-operation}

{% api_operation get /api/v1/sessions/*:id* %}

Get session information for a given session id.

> Note this is an admin operation and requires an API token.

##### Request Example
{:.api .api-request .api-request-example}

~~~ sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/sessions/101W_juydrDRByB7fUdRyE2JQ"
~~~

##### Response Examples
{:.api .api-response .api-response-example}

If the session is valid, a [Session Object](#session-model) is returned.

If the session is invalid, a `404 Not Found` response will be returned.

~~~ json
{
  "id": "101W_juydrDRByB7fUdRyE2JQ",
  "login": "user@example.com",
  "userId": "00u0abcdefGHIJKLMNOP",
  "status": "ACTIVE",
  "expiresAt": "2016-01-03T09:13:17.000Z",
  "lastPasswordVerification": "2016-01-03T07:02:00.000Z",
  "lastFactorVerification": null,
  "amr": [
    "pwd"
  ],
  "idp": {
    "id": "01a2bcdef3GHIJKLMNOP",
    "type": "OKTA"
  },
  "mfaActive": true,
  "_links": {
    "refresh": {
      "href": "https://example.okta.com/api/v1/sessions/101W_juydrDRByB7fUdRyE2JQ/lifecycle/refresh",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "self": {
      "href": "https://example.okta.com/api/v1/sessions/101W_juydrDRByB7fUdRyE2JQ",
      "hints": {
        "allow": [
           "GET",
           "DELETE"
        ]
      }
    },
    "user": {
      "name": "Isaac Brock",
      "href": "https://example.okta.com/api/v1/users/00uit00ZK6ELuzPoD0g3",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    }
  }
}
~~~


### Extend Session
{:.api .api-operation}

{% api_operation put /api/v1/sessions/*:id* %} {% api_lifecycle deprecated %}

Extends the lifetime of a user's session.

> This endpoint is deprecated. Use the [Refresh Session](#refresh-session) API instead.

> Note this is an admin operation and requires an API token.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                            | Param Type | DataType | Required | Default
--------- | -------------------------------------- | ---------- | -------- | -------- | -------
id        | `id` of a valid session                | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

The response will contain the extended [Session](#session-model) with an updated `expiresAt` timestamp for the user if the `id` was valid.

If the session is invalid, a `404 Not Found` response will be returned.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X PUT \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/sessions/101W_juydrDRByB7fUdRyE2JQ"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
  "id": "101W_juydrDRByB7fUdRyE2JQ",
  "login": "user@example.com",
  "userId": "00ubgaSARVOQDIOXMORI",
  "expiresAt": "2015-08-30T18:41:35.818Z",
  "status": "ACTIVE",
  "lastPasswordVerification": "2015-08-30T18:41:35.818Z",
  "lastFactorVerification": null,
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
      "href": "https://your-domain.okta.com/api/v1/sessions/101W_juydrDRByB7fUdRyE2JQ",
      "hints": {
        "allow": [
          "GET",
          "DELETE"
        ]
      }
    },
    "refresh": {
      "href": "https://your-domain.okta.com/api/v1/sessions/101W_juydrDRByB7fUdRyE2JQ/lifecycle/refresh",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "user": {
      "name": "Isaac Brock",
      "href": "https://your-domain.okta.com/api/v1/users/00uit00ZK6ELuzPoD0g3",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    }
  }
}
~~~

### Refresh Session
{:.api .api-request}

Refresh an existing session using the `id` for that session. (This is equivalent to the deprecated [Extend Session](#extend-session) operation).

> Note this is an admin operation and requires an API token.

{% api_operation post /api/v1/sessions/*:id*/lifecycle/refresh %}

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description             | Param Type | DataType | Required | Default
--------- | ----------------------- | ---------- | -------- | -------- | -------
id        | `id` of a valid session | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

The response will contain the refreshed [Session](#session-model) with an updated `expiresAt` timestamp for the user if the `id` was valid.

If the session is invalid, a `404 Not Found` response will be returned.

##### Request Example
{:.api .api-request .api-request-example}

~~~ sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/sessions/101W_juydrDRByB7fUdRyE2JQ/lifecycle/refresh"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
  "id": "101W_juydrDRByB7fUdRyE2JQ",
  "login": "user@example.com",
  "userId": "00ubgaSARVOQDIOXMORI",
  "expiresAt": "2015-08-30T18:41:35.818Z",
  "status": "ACTIVE",
  "lastPasswordVerification": "2015-08-30T18:41:35.818Z",
  "lastFactorVerification": null,
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
      "href": "https://your-domain.okta.com/api/v1/sessions/101W_juydrDRByB7fUdRyE2JQ",
      "hints": {
        "allow": [
          "GET",
          "DELETE"
        ]
      }
    },
    "refresh": {
      "href": "https://your-domain.okta.com/api/v1/sessions/101W_juydrDRByB7fUdRyE2JQ/lifecycle/refresh",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "user": {
      "name": "Isaac Brock",
      "href": "https://your-domain.okta.com/api/v1/users/00uit00ZK6ELuzPoD0g3",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    }
  }
}
~~~

### Close Session
{:.api .api-operation}

{% api_operation delete /api/v1/sessions/*:id* %}

Closes a user's session (logout).

> Note this is an admin operation and requires an API token.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description             | Param Type | DataType | Required | Default
--------- | ----------------------- | ---------- | -------- | -------- | -------
id        | `id` of a valid session | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

If the session was successfully closed, a `204 No Content` response will be returned.

If the session is invalid, a `404 Not Found` response will be returned.

##### Request Example
{:.api .api-request .api-request-example}

~~~ sh
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/sessions/101W_juydrDRByB7fUdRyE2JQ"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ http
HTTP/1.1 204 No Content
~~~

### Get Current Session
{:.api .api-operation}

{% api_operation get /api/v1/sessions/me %} {% api_cors %}

Get session information for the current user. Use this method in a browser based application to determine if the user is logged in.

> This operation requires a session cookie for the user. API token is not allowed for this operation.

##### Request Example
{:.api .api-request .api-request-example}

~~~ sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Cookie: ${okta_session_cookie}"
"https://${org}.okta.com/api/v1/sessions/me"
~~~

##### Response Examples
{:.api .api-response .api-response-example}

If the session is valid, a [Session Object](#session-model) is returned.

If the session is invalid, a `404 Not Found` response will be returned.

~~~ json
{
    "id": "101W_juydrDRByB7fUdRyE2JQ",
    "login": "user@example.com",
    "userId": "00u0abcdefGHIJKLMNOP",
    "status": "ACTIVE",
    "createdAt": "2016-01-03T07:02:00.000Z",
    "expiresAt": "2016-01-03T09:13:17.000Z",
    "lastPasswordVerification": "2016-01-03T07:02:00.000Z",
    "lastFactorVerification": null,
    "amr": [
        "pwd"
    ],
    "idp": {
        "id": "01a2bcdef3GHIJKLMNOP",
        "type": "OKTA"
    },
    "mfaActive": true,
    "_links": {
        "refresh": {
            "href": "https://example.okta.com/api/v1/sessions/me/lifecycle/refresh",
            "hints": {
                "allow": [
                    "POST"
                ]
            }
        },
        "self": {
            "href": "https://example.okta.com/api/v1/sessions/me",
            "hints": {
                "allow": [
                    "GET",
                    "DELETE"
                ]
            }
        },
        "user": {
            "name": "Isaac Brock",
            "href": "https://example.okta.com/api/v1/users/me",
            "hints": {
                "allow": [
                    "GET"
                ]
            }
        }
    }
}
~~~

### Refresh Current Session
{:.api .api-request}

Refresh the session for the current user.

> This operation requires a session cookie for the user. API token is not allowed for this operation.

{% api_operation post /api/v1/sessions/me/lifecycle/refresh %} {% api_cors %}

##### Request Example
{:.api .api-request .api-request-example}

~~~ sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Cookie: ${okta_session_cookie}" \
"https://${org}.okta.com/api/v1/sessions/me/lifecycle/refresh"
~~~

##### Response Example
{:.api .api-response .api-response-example}

If the session is valid, a [Session Object](#session-model) is returned.

If the session is invalid, a `404 Not Found` response will be returned.

~~~ json
{
    "id": "101W_juydrDRByB7fUdRyE2JQ",
    "login": "user@example.com",
    "userId": "00u0abcdefGHIJKLMNOP",
    "status": "ACTIVE",
    "createdAt": "2016-01-03T07:02:00.000Z",
    "expiresAt": "2016-01-03T09:13:17.000Z",
    "lastPasswordVerification": "2016-01-03T07:02:00.000Z",
    "lastFactorVerification": null,
    "amr": [
        "pwd"
    ],
    "idp": {
        "id": "01a2bcdef3GHIJKLMNOP",
        "type": "OKTA"
    },
    "mfaActive": true,
    "_links": {
        "refresh": {
            "href": "https://example.okta.com/api/v1/sessions/me/lifecycle/refresh",
            "hints": {
                "allow": [
                    "POST"
                ]
            }
        },
        "self": {
            "href": "https://example.okta.com/api/v1/sessions/me",
            "hints": {
                "allow": [
                    "GET",
                    "DELETE"
                ]
            }
        },
        "user": {
            "name": "Isaac Brock",
            "href": "https://example.okta.com/api/v1/users/me",
            "hints": {
                "allow": [
                    "GET"
                ]
            }
        }
    }
}
~~~

### Close Current Session
{:.api .api-request}

Close the session for the currently logged in user. Use this method in a browser-based application to log a user out.

> This operation requires a session cookie for the user. API token is not allowed for this operation.

{% api_operation delete /api/v1/sessions/me %} {% api_cors %}

##### Response Example
{:.api .api-response .api-response-example}

~~~ sh
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Cookie: ${okta_session_cookie}" \
"https://${org}.okta.com/api/v1/sessions/me"
~~~

##### Response Example
{:.api .api-response .api-response-example}

If the session was successfully closed, a `204 No Content` response will be returned.

If the session is invalid, a `404 Not Found` response will be returned.

~~~ http
HTTP/1.1 204 No Content
~~~

## Session Model

### Example

~~~ json
{
  "id": "101W_juydrDRByB7fUdRyE2JQ",
  "login": "user@example.com",
  "userId": "00ubgaSARVOQDIOXMORI",
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
      "href": "https://your-domain.okta.com/api/v1/sessions/101W_juydrDRByB7fUdRyE2JQ",
      "hints": {
        "allow": [
          "GET",
          "DELETE"
        ]
      }
    },
    "refresh": {
      "href": "https://your-domain.okta.com/api/v1/sessions/101W_juydrDRByB7fUdRyE2JQ/lifecycle/refresh",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "user": {
      "name": "Isaac Brock",
      "href": "https://your-domain.okta.com/api/v1/users/00uit00ZK6ELuzPoD0g3",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    }
  }
}
~~~

### Session Properties

Sessions have the following properties:

|-------------------------------------------+-----------------------------------------------------------------------------------------------+-------------------------------------------+----------+--------+----------|
| Property                                  | Description                                                                                   | DataType                                  | Nullable | Unique | Readonly |
| ----------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------- | -------- | ------ | -------- |
| id                                        | unique key for the session                                                                    | String                                    | FALSE    | TRUE   | TRUE     |
| login                                     | unique identifier for the user (username)                                                     | String                                    | FALSE    | TRUE   | TRUE     |
| userId                                    | unique key for the [user](users.html#get-user-with-id)                                        | String                                    | FALSE    | TRUE   | TRUE     |
| expiresAt                                 | timestamp when session expires                                                                | Date                                      | FALSE    | TRUE   | TRUE     |
| status                                    | current [status](#session-status) of the session                                              | `ACTIVE`, `MFA_REQUIRED`, or `MFA_ENROLL` | FALSE    | TRUE   | TRUE     |
| lastPasswordVerification                  | timestamp when user last performed primary or step-up authentication with password            | Date                                      | TRUE     | TRUE   | TRUE     |
| lastFactorVerification                    | timestamp when user last performed multi-factor authentication                                | Date                                      | TRUE     | TRUE   | TRUE     |
| amr                                       | authentication method reference                                                               | [AMR Object](#amr-object)                 | FALSE    | FALSE  | TRUE     |
| idp                                       | identity provider used to authenticate the user                                               | [IDP Object](#idp-object)                 | FALSE    | FALSE  | TRUE     |
| mfaActive                                 | indicates whether the user has [enrolled an MFA factor](./factors.html#list-enrolled-factors) | Boolean                                   | FALSE    | FALSE  | TRUE     |
|-------------------------------------------+-----------------------------------------------------------------------------------------------+-------------------------------------------+----------+--------+----------|

> The `mfaActive` parameter is a {% api_lifecycle deprecated %} feature. Use the `lastFactorVerification` attribute in conjunction with `amr` to understand if the user has performed MFA for the current session. Use the [Factors API](./factors.html#list-enrolled-factors) to query the factor enrollment status for a given user.

#### Optional Session Properties

The [Create Session](#create-session-with-session-token) operation can optionally return the following properties when requested.

|-----------------------------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Property                                      | Description                                                                                                                                                                        |
| --------------------------------------------- | -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| cookieToken                                   | Another one-time token which can be used to obtain a session cookie by visiting either an application's embed link or a session redirect URL.                                      |
| cookieTokenUrl                                | URL for a a transparent 1x1 pixel image which contains a one-time session token which when visited sets the session cookie in your browser for your organization.                  |
|-----------------------------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

> The `cookieToken` is a {% api_lifecycle deprecated %} property. Instead, use the [Authentication API](./authn.html), which supports the full user authentication pipeline and produces a `sessionToken` which can be used in this API.

> The `cookieTokenUrl` is a {% api_lifecycle deprecated %} property. because modern browsers block cookies set via embedding images from another origin (cross-domain).

### Session Status

The following values are defined for the status of a session:

- `ACTIVE`: the session is established and fully validated
- `MFA_REQUIRED`: the session is established but requires second factor verification
- `MFA_ENROLL`: the session is established but the user needs to enroll in a second factor

### AMR Object

The [authentication methods reference](https://tools.ietf.org/html/draft-ietf-oauth-amr-values-01) ("AMR") specifies which authentication methods were used to establish the session. The value is a JSON array with one or more of the following values:

|----------+-------------------------------------------------------+---------------------------------------------------------------------------|
| Value    | Description                                           | Example                                                                   |
| -------- | ------------------------------------------------------|---------------------------------------------------------------------------|
| `pwd`    | Password authentication                               | Standard password-based login                                             |
| `swk`    | Proof-of-possession (PoP) of a software key           | Okta Verify with Push                                                     |
| `hwk`    | Proof-of-possession (PoP) of a hardware key           | Yubikey factor                                                            |
| `otp`    | One-time password                                     | Okta Verify, Google Authenticator                                         |
| `sms`    | SMS text message to the user at a registered number   | SMS factor                                                                |
| `tel`    | Telephone call to the user at a registered number     | Phone call factor                                                         |
| `geo`    | Use of geo-location information                       | IP Trust and Network Zone policy conditions                               |
| `fpt`    | Fingerprint biometric authentication                  | Okta Verify with Touch ID                                                 |
| `kba`    | Knowledge-based authentication                        | Security Question factor                                                  |
| `mfa`    | Multiple factor authentication                        | (This value is present whenever any MFA factor verification is performed) |
|----------+-------------------------------------------------------+---------------------------------------------------------------------------|

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
