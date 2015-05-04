---
layout: docs_page
title: Sessions
---

* Will be replaced with the ToC
{:toc .list-unstyled .toc}

## Overview

Okta uses a cookie-based authentication mechanism to maintain a [user's](users.html) authentication session across web requests.  The Okta Session API provides operations to create and manage authentication sessions with your Okta organization.

> The Session API currently does not support multi-factor authentication (MFA).  Sessions created for users with an assigned MFA policy will have a significantly constrained session and will not be able to access their applications.

### Session Cookie

Okta utilizes a non-persistent HTTP session cookie to provide access to your Okta organization and applications across web requests for an interactive user-agents such as a browser.  Session cookies have an  expiration configurable by an administrator for the organization and are valid until the cookie expires or the user closes the session (logout) or browser application.

### One-Time Token

Okta provides a mechanism to validate a [user's](users.html) credentials via the Session API and obtain a one-time token that can be later exchanged for a session cookie using flows detailed [here](/docs/examples/session_cookie.html) for specific deployment scenarios.

A one-time token may only be used **once** to establish a session for a [user](users.html).  If the session expires or the [user](users.html) logs out of Okta after using the token, they will not be able to reuse the same one-time token to get a new session cookie.

> One-time tokens are secrets and should be protected at rest as well as during transit. A one-time token for a user is equivalent to having the user's actual credentials

## Session Model

### Example

~~~ json
{
    "id": "000najcYVnjRS2aZG50MpHL4Q",
    "userId": "00ubgaSARVOQDIOXMORI",
    "mfaActive": false
}
~~~

### Session Attributes

Sessions have the following attributes:

Attribute | Description                                                                  | DataType | Nullable | Unique | Readonly
--------- | ---------------------------------------------------------------------------- | -------- | -------- | ------ | --------
id        | unique key for the session                                                   | String   | FALSE    | TRUE   | TRUE
userId    | unique key for the [user](users.html#get-user-with-id)                       | String   | FALSE    | FALSE  | TRUE
mfaActive | indicates whether the [user](users.html) has enrolled a valid MFA credential | Boolean  | FALSE    | FALSE  | TRUE

#### Conditional Token Attributes

The [Create Session](#create-session) operation can optionally return the following values when requested.

Field          | Description
-------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
cookieToken    | One-time token which can be used to obtain a session cookie for your organization by visiting either an application's embed link or a session redirect URL.<br><br>See [retrieving a session cookie by visiting a session redirect link](/docs/examples/session_cookie.html#retrieving-a-session-cookie-by-visiting-a-session-redirect-link) or [retrieving a session cookie by visiting an application embed link](/docs/examples/session_cookie.html#retrieving-a-session-cookie-by-visiting-an-application-embed-link) for more info.
cookieTokenUrl | URL for a a transparent 1x1 pixel image which contains a one-time token which when visited  sets the session cookie in your browser for your organization.<br><br>See [retrieving a session cookie by visiting a session redirect link](/docs/examples/session_cookie.html#retrieving-a-session-cookie-with-a-hidden-image) for more info.

## Session Operations

### Create Session
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /sessions</span>

Creates a new session for a [user](users.html).

- [Create Session with One-Time Token](#create-session-with-one-time-token)
- [Create Session with Session Token](#create-session-with-session-token)
- [Create Session with Embed Image URL](#create-session-with-embed-image-url)

##### Request Parameters
{:.api .request-parameters}

Parameter        | Description                                                         | Param Type | DataType                              | Required | Default
---------------- | ------------------------------------------------------------------- | ---------- | ------------------------------------- | -------- | -------
additionalFields | Requests specific [token attributes](#conditional-token-attributes) | Query      | comma separated list of String values | FALSE    |
username         | `login` for an `ACTIVE` [user](users.html)                          | Body       | String                                | TRUE     |
password         | password for an `ACTIVE` [user](users.html)                         | Body       | String                                | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

The new [Session](#session-model) for the [user](users.html).

#### Create Session with One-Time Token
{:.api .api-operation}

Validates a [user's](users.html) credentials and returns a one-time token that can be used to set a session cookie in the user's browser.

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-subdomain.okta.com/api/v1/sessions?additionalFields=cookieToken" \
-d \
'{
  "username": "art.vandelay@example.com",
  "password": "correct horse battery staple"
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
  "id": "000rWcxHV-lQUOzBhLJLYTl0Q",
  "userId": "00uld5QRRGEMJSSQJCUB",
  "mfaActive": false,
  "cookieToken": "00hbM-dbQNhKUtQY2lAl34Y0O9sHicFECHiTg3Ccv4"
}
~~~

Invalid credentials will return a `401 Unauthorized` status code.

~~~ ruby
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

#### Create Session with Session Token
{:.api .api-operation}

Uses a [`sessionToken`](authn.html#session-token) created by the Auth API to set a session cookie in the user's browser.

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-subdomain.okta.com/api/v1/sessions?additionalFields=cookieToken" \
-d \
'{
  "sessionToken": "00Fpzf4en68pCXTsMjcX8JPMctzN2Wiw4LDOBL_9pz"
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
  "id": "000rWcxHV-lQUOzBhLJLYTl0Q",
  "userId": "00uld5QRRGEMJSSQJCUB",
  "mfaActive": false,
  "cookieToken": "00hbM-dbQNhKUtQY2lAl34Y0O9sHicFECHiTg3Ccv4"
}
~~~

Invalid session tokens will return a `401 Unauthorized` status code.

~~~ ruby
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

#### Create Session with Embed Image URL
{:.api .api-operation}

Validates a [user's](users.html) credentials and returns a URL with a one-time token for 1x1 transparent image that can be used to set a session cookie in the [user's](users.html) browser

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-subdomain.okta.com/api/v1/sessions?additionalFields=cookieTokenUrl" \
-d \
'{
  "username": "art.vandelay@example.com",
  "password": "correct horse battery staple"
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
  "id": "000rWcxHV-lQUOzBhLJLYTl0Q",
  "userId": "00uld5QRRGEMJSSQJCUB",
  "mfaActive": false,
  "cookieTokenUrl": "https://your-subdomain.okta.com/login/sessionCookie?token=00hbM-dbQNhKUtQY2lAl34Y0O9sHicFECHiTg3Ccv4"
}
~~~

Invalid credentials will return a `401 Unauthorized` status code.

~~~ ruby
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

### Validate Session
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">GET</span> /sessions/*:id*</span>

Validate a [user's](users.html) session.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                          | Param Type | DataType | Required | Default
--------- | ------------------------------------ | ---------- | -------- | -------- | -------
id        | `id` of [user's](users.html) session | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[Session](#session-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-subdomain.okta.com/api/v1/sessions/000rWcxHV-lQUOzBhLJLYTl0Q"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
  "id": "000rWcxHV-lQUOzBhLJLYTl0Q",
  "userId": "00uld5QRRGEMJSSQJCUB",
  "mfaActive": false
}
~~~

Invalid sessions will return a `404 Not Found` status code.

~~~ ruby
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

### Extend Session
{:.api .api-operation}

<span class="api-uri-template api-uri-put"><span class="api-label">PUT</span> /sessions/*:id*</span>

Extends the lifetime of a session for a [user](users.html).

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                            | Param Type | DataType | Required | Default
--------- | -------------------------------------- | ---------- | -------- | -------- | -------
id        | `id` of [user's](users.html) session   | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[Session](#session-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X PUT "https://your-subdomain.okta.com/api/v1/sessions/000rWcxHV-lQUOzBhLJLYTl0Q"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
  "id": "000rWcxHV-lQUOzBhLJLYTl0Q",
  "userId": "00uld5QRRGEMJSSQJCUB",
  "mfaActive": false
}
~~~

Invalid sessions will return a `404 Not Found` status code.

~~~ ruby
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

### Close Session
{:.api .api-operation}

<span class="api-uri-template api-uri-delete"><span class="api-label">DELETE</span> /sessions/*:id*</span>

Closes a session for a [user](users.html) (logout).

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                          | Param Type | DataType | Required | Default
--------- | ------------------------------------ | ---------- | -------- | -------- | -------
id        | `id` of [user's](users.html) session | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

N/A

##### Request Example
{:.api .api-request .api-request-example}

~~~ ruby
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X DELETE "https://your-subdomain.okta.com/api/v1/sessions/000rWcxHV-lQUOzBhLJLYTl0Q"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ ruby
HTTP/1.1 204 No Content
~~~

Invalid sessions will return a `404 Not Found` status code.

~~~ ruby
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
