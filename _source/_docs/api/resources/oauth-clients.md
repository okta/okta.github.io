---
layout: docs_page
title: OAuth 2.0 Clients
redirect_from: "/docs/api/rest/oauth-clients.html"
---

# OAuth 2.0 Clients API

The OAuth Clients API provides operations to register and manage client applications for use with Okta's
OAuth 2.0 and OpenID Connect endpoints. This API largely follows the contract defined in [RFC7591](https://tools.ietf.org/html/rfc7591).

Note that clients managed via this API are modeled as applications in Okta and will show in the Applications section of the
Administrator dashboard. Changes made via the API will reflect in the UI and vice versa.

> This API is currently in **Beta** status.

## Client Application Model

### Example

~~~json
{
  "client_id": "0jrabyQWm4B9zVJPbotY",
  "client_id_issued_at": 1453913425,
  "client_name": "Example OAuth Client",
  "client_uri": "http://www.example-application.com",
  "logo_uri": "http://www.example-application.com/logo.png",
  "application_type": "web",
  "redirect_uris": [
    "https://www.example-application.com/oauth2/redirectUri"
  ],
  "response_types": [
    "id_token",
    "code"
  ],
  "grant_types": [
    "authorization_code"
  ],
  "token_endpoint_auth_method": "client_secret_post",
  "initiate_login_uri": "https://www.example-application.com/oauth2/login",
  "_links": {
    "newSecret": {
      "href": "https://example.okta.com/oauth2/v1/clients/0jrabyQWm4B9zVJPbotY/lifecycle/newSecret",
      "hints": {
        "allow": [
          "POST"
         ]
      }
    }
  }
}
~~~

### Client Application Properties

Client applications have the following properties:

|----------------------------+-------------------------------------------------------------------+------------------------------------------------------------------------+----------+--------+----------|
| Property                   | Description                                                       | DataType                                                               | Nullable | Unique | Readonly | 
| -------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------- | -------- | ------ | -------- | 
| client_id                  | unique key for the client application                             | String                                                                 | FALSE    | TRUE   | TRUE     |
| client_id_issued_at        | time at which the client_id was issued (measured in unix seconds) | Number                                                                 | FALSE    | FALSE  | TRUE     |
| client_name                | human-readable string name of the client application              | String                                                                 | FALSE    | FALSE  | FALSE    |
| client_secret              | OAuth 2.0 client secret string (used for confidential clients)    | String                                                                 | TRUE     | TRUE   | TRUE     |
| logo_uri                   | URL string that references a logo for the client                  | String                                                                 | TRUE     | FALSE  | FALSE    | 
| application_type           | The type of client application                                    | `web`, `native`, `browser`, or `service`                               | TRUE     | TRUE   | TRUE     |
| redirect_uris              | array of redirection URI strings for use in redirect-based flows  | Array                                                                  | TRUE     | FALSE  | FALSE    |
| response_types             | array of OAuth 2.0 response type strings                          | Array of `code`, `token`, `id_token`                                   | TRUE     | FALSE  | FALSE    |
| grant_types                | array of OAuth 2.0 grant type strings                             | Array of `authorization_code`, `implicit`, `password`, `refresh_token`, `client_credentials` | FALSE    | FALSE  | FALSE    | 
| token_endpoint_auth_method | requested authentication method for the token endpoint            | `none`, `client_secret_post`, or `client_secret_basic`                 | FALSE    | FALSE  | FALSE    |
| initiate_login_uri         | URL that a third party can use to initiate a login by the client  | String                                                                 | TRUE     | FALSE  | FALSE    |
| _links                     | discoverable resources related to the app                         | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06)         | TRUE     | FALSE  | TRUE     | 
|----------------------------+-------------------------------------------------------------------+------------------------------------------------------------------------+----------+--------+----------|

> The `client_id`, `client_id_issued_at`, and `client_secret` attributes are only available after a client is created.

> Client secret is only shown on the initial creation of a client application (and only if the token_endpoint_auth_method is one that requires a client secret).
  It is never returned in a GET call.

> The `service` application type and `client_credentials` grant type are currently in **Beta** status.

> The "grant_types" and "response_types" values described above are partially orthogonal, as they refer to arguments passed to different
  endpoints in the [OAuth 2.0 protocol](https://tools.ietf.org/html/rfc6749). However, they are related in that the "grant_types"
  available to a client influence the "response_types" that the client is allowed to use, and vice versa. For instance, a "grant_types"
  value that includes "authorization_code" implies a "response_types" value that includes "code", as both values are defined as part of
  the OAuth 2.0 authorization code grant.

> At least one redirect URI and response type is required for all client types, with exceptions: if the client uses the
  [Resource Owner Password](https://tools.ietf.org/html/rfc6749#section-4.3) flow (if `grant_types` contains the value `password`) 
  or [Client Credentials](https://tools.ietf.org/html/rfc6749#section-4.4) flow (if `grant_types` contains the value `client_credentials`)
  then no redirect URI or response type is necessary. In these cases you can pass either null or an empty array for these attributes.

> All redirect URIs must be absolute URIs and must not include a fragment compontent.

## Client Application Operations

### Register New Client
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /oauth2/v1/clients</span>

Adds a new client application to your organization.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                               | ParamType | DataType                               | Required | Default
--------- | ----------------------------------------- | --------- | -------------------------------------- | -------- | ---
settings  | OAuth client registration settings        | Body      | [Client Settings](#oauth-client-model) | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

The created [OAuth Client](#oauth-client-model).

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
      "client_name": "Example OAuth Client",
      "client_uri": "http://www.example-application.com",
      "logo_uri": "http://www.example-application.com/logo.png",
      "application_type": "web",
      "redirect_uris": [
         "https://www.example-application.com/oauth2/redirectUri"
      ],
      "response_types": [
         "code",
         "id_token"
      ],
      "grant_types": [
         "authorization_code",
         "refresh_token"
      ],
      "token_endpoint_auth_method": "client_secret_post",
      "initiate_login_uri": "https://www.example-application.com/oauth2/login"
    }' "https://${org}.okta.com/oauth2/v1/clients"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "client_id": "0jrabyQWm4B9zVJPbotY",
  "client_id_issued_at": 1453913425,
  "client_name": "Example OAuth Client",
  "client_uri": "http://www.example-application.com",
  "logo_uri": "http://www.example-application.com/logo.png",
  "application_type": "web",
  "redirect_uris": [
    "https://www.example-application.com/oauth2/redirectUri"
  ],
  "response_types": [
    "id_token",
    "code"
  ],
  "grant_types": [
    "authorization_code"
  ],
  "token_endpoint_auth_method": "client_secret_post",
  "initiate_login_uri": "https://www.example-application.com/oauth2/login",
  "_links": {
    "newSecret": {
      "href": "https://example.okta.com/oauth2/v1/clients/0jrabyQWm4B9zVJPbotY/lifecycle/newSecret",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    }
  }
}
~~~

### Get OAuth Client
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /oauth2/v1/clients/*:clientId*</span>

Fetches a specific client by `clientId` from your organization

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                     | ParamType | DataType | Required | Default
--------- | ------------------------------- | --------- | -------- | -------- | -------
clientId  | `clientId` of a specific client | URL       | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

Fetched [OAuth Client](#oauth-client-model).

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/oauth2/v1/clients/0jrabyQWm4B9zVJPbotY"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "client_id": "0jrabyQWm4B9zVJPbotY",
  "client_id_issued_at": 1453913425,
  "client_name": "Example OAuth Client",
  "client_uri": "http://www.example-application.com",
  "logo_uri": "http://www.example-application.com/logo.png",
  "application_type": "web",
  "redirect_uris": [
    "https://www.example-application.com/oauth2/redirectUri"
  ],
  "response_types": [
    "id_token",
    "code"
  ],
  "grant_types": [
    "authorization_code"
  ],
  "token_endpoint_auth_method": "client_secret_post",
  "initiate_login_uri": "https://www.example-application.com/oauth2/login",
  "_links": {
    "newSecret": {
      "href": "https://example.okta.com/oauth2/v1/clients/0jrabyQWm4B9zVJPbotY/lifecycle/newSecret",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    }
  }
}
~~~

### List Client Applications
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /oauth2/v1/clients</span>

Enumerates client applications in your organization (with pagination).

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                                                                | ParamType | DataType | Required | Default
--------- | ------------------------------------------------------------------------------------------ | --------- | -------- | -------- | -------
q         | Searches the `client_name` property of clients for matching value                          | Query     | String   | FALSE    |
limit     | Specifies the number of client results in a page                                           | Query     | Number   | FALSE    | 200
after     | Specifies the pagination cursor for the next page of clients                               | Query     | String   | FALSE    |

> The `after` cursor should treated as an opaque value and obtained through the next link relation. See [Pagination](/docs/api/getting_started/design_principles.html#pagination)

> Search currently performs a startsWith match but it should be considered an implementation detail and may change without notice in the future.

##### Response Parameters
{:.api .api-response .api-response-params}

Array of [OAuth Clients](#oauth-client-model)

#### List Client Apps with Defaults
{:.api .api-operation}

Enumerates all client applications in your organization.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/oauth2/v1/clients"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 200 OK
Content-Type: application/json
Link: <https://your-domain.okta.com/oauth2/v1/clients>; rel="self"
Link: <https://your-domain.okta.com/oauth2/v1/clients?after=F10CaazJPQ5Zpyu1Ojko>; rel="next"

[
  {
    "client_id": "0jrabyQWm4B9zVJPbotY",
    "client_id_issued_at": 1453913425,
    "client_name": "Example OAuth Client",
    "client_uri": "http://www.example-application.com",
    "logo_uri": "http://www.example-application.com/logo.png",
    "application_type": "web",
    "redirect_uris": [
      "https://www.example-application.com/oauth2/redirectUri"
    ],
    "response_types": [
      "id_token",
      "code"
    ],
    "grant_types": [
      "authorization_code"
    ],
    "token_endpoint_auth_method": "client_secret_post",
    "initiate_login_uri": "https://www.example-application.com/oauth2/login",
    "_links": {
      "newSecret": {
        "href": "https://example.okta.com/oauth2/v1/clients/0jrabyQWm4B9zVJPbotY/lifecycle/newSecret",
        "hints": {
          "allow": [
            "POST"
          ]
        }
      }
    }
  },
  {
    "client_id": "F10CaazJPQ5Zpyu1Ojko",
    "client_id_issued_at": 1453913425,
    "client_name": "Another OAuth Client",
    "client_uri": "http://www.another-application.com",
    "logo_uri": "http://www.another-application.com/logo.png",
    "application_type": "browser",
    "redirect_uris": [
      "https://www.another-application.com/oauth2/redirectUri"
    ],
    "response_types": [
      "id_token",
      "token"
    ],
    "grant_types": [
      "implicit"
    ],
    "token_endpoint_auth_method": "none",
    "initiate_login_uri": null,
  }
]
~~~

#### Search Client Applications
{:.api .api-operation}

Searches for clients by `client_name` in your organization.

> Search currently performs a startsWith match but it should be considered an implementation detail and may change without notice in the future. Exact matches will always be returned before partial matches.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/oauth2/v1/clients?q=Payroll&limit=10"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[
  {
    "client_id": "JoLxQvMz6u0kEkHFSnC8",
    "client_id_issued_at": 1453913425,
    "client_name": "Payroll Application",
    "client_uri": "http://www.payroll-application.com",
    "logo_uri": "http://www.payroll-application.com/logo.png",
    "application_type": "web",
    "redirect_uris": [
      "https://www.payroll-application.com/oauth2/redirectUri"
    ],
    "response_types": [
      "id_token",
      "code"
    ],
    "grant_types": [
      "authorization_code"
    ],
    "token_endpoint_auth_method": "client_secret_post",
    "initiate_login_uri": "https://www.example-application.com/oauth2/login",
    "_links": {
      "newSecret": {
        "href": "https://payroll.okta.com/oauth2/v1/clients/0jrabyQWm4B9zVJPbotY/lifecycle/newSecret",
        "hints": {
          "allow": [
            "POST"
          ]
        }
      }
    }
  }
]
~~~

### Update Client Application
{:.api .api-operation}

<span class="api-uri-template api-uri-put"><span class="api-label">PUT</span> /oauth2/v1/clients/*:clientId*</span>

Updates the settings for a client application from your organization.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                        | ParamType | DataType                               | Required | 
--------- | ---------------------------------- | --------- | -------------------------------------- | -------- |
clientId  | `clientId` of a specific client    | URL       | String                                 | TRUE     |
settings  | OAuth client registration settings | Body      | [Client Settings](#oauth-client-model) | TRUE     |

> All settings must be specified when updating a client application, **partial updates are not supported!**

##### Response Parameters
{:.api .api-response .api-response-params}

Updated [OAuth Client](#oauth-client-model).

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X PUT \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
      "client_name": "Updated OAuth Client",
      "client_uri": "http://www.example-application.com",
      "logo_uri": "http://www.example-application.com/logo.png",
      "application_type": "web",
      "redirect_uris": [
        "https://www.example-application.com/oauth2/redirectUri"
      ],
      "response_types": [
        "id_token",
        "code"
      ],
      "grant_types": [
        "authorization_code"
      ],
      "token_endpoint_auth_method": "client_secret_post",
      "initiate_login_uri": "https://www.example-application.com/oauth2/login"
    }' "https://${org}.okta.com/oauth2/v1/clients/0jrabyQWm4B9zVJPbotY"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json

{
  "client_id": "0jrabyQWm4B9zVJPbotY",
  "client_id_issued_at": 1453913425,
  "client_name": "Updated OAuth Client",
  "client_uri": "http://www.example-application.com",
  "logo_uri": "http://www.example-application.com/logo.png",
  "application_type": "web",
  "redirect_uris": [
    "https://www.example-application.com/oauth2/redirectUri"
  ],
  "response_types": [
    "id_token",
    "code"
  ],
  "grant_types": [
    "authorization_code"
  ],
  "token_endpoint_auth_method": "client_secret_post",
  "initiate_login_uri": "https://www.example-application.com/oauth2/login",
  "_links": {
    "newSecret": {
      "href": "https://example.okta.com/oauth2/v1/clients/0jrabyQWm4B9zVJPbotY/lifecycle/newSecret",
      "hints": {
        "allow": [
          "POST"
         ]
      }
    }
  }
}
~~~

### Generate new client secret
{:.api .api-operation}

<span class="api-uri-template api-uri-put"><span class="api-label">PUT</span> /oauth2/v1/clients/*:clientId*/lifecycle/newSecret</span>

Generates a new client secret for the specified client application.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                        | ParamType | DataType                               | Required | 
--------- | ---------------------------------- | --------- | -------------------------------------- | -------- |
clientId  | `clientId` of a specific client    | URL       | String                                 | TRUE     |

> This operation only applies to client applications which use the `client_secret_post` or `client_secret_basic` method for token endpoint authorization.

##### Response Parameters
{:.api .api-response .api-response-params}

Updated [OAuth Client](#oauth-client-model) with client_secret shown.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
 "https://${org}.okta.com/oauth2/v1/clients/0jrabyQWm4B9zVJPbotY/lifecycle/newSecret"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json

{
  "client_id": "0jrabyQWm4B9zVJPbotY",
  "client_id_issued_at": 1453913425,
  "client_name": "Updated OAuth Client",
  "client_uri": "http://www.example-application.com",
  "client_secret": "cdUQIFvE61wGI5P51H33ORC4SRB1RXfX",
  "logo_uri": "http://www.example-application.com/logo.png",
  "application_type": "web",
  "redirect_uris": [
    "https://www.example-application.com/oauth2/redirectUri"
  ],
  "response_types": [
    "id_token",
    "code"
  ],
  "grant_types": [
    "authorization_code"
  ],
  "token_endpoint_auth_method": "client_secret_post",
  "initiate_login_uri": "https://www.example-application.com/oauth2/login",
  "_links": {
    "newSecret": {
      "href": "https://example.okta.com/oauth2/v1/clients/0jrabyQWm4B9zVJPbotY/lifecycle/newSecret",
      "hints": {
        "allow": [
          "POST"
         ]
      }
    }
  }
}
~~~

### Remove Client Application
{:.api .api-operation}

<span class="api-uri-template api-uri-delete"><span class="api-label">DELETE</span> /oauth2/v1/clients/*:clientId*</span>

Removes a client application from your organization.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                        | ParamType | DataType | Required | 
--------- | ---------------------------------- | --------- | -------- | -------- |
clientId  | `clientId` of a specific client    | URL       | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

N/A

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/oauth2/v1/clients/0jrabyQWm4B9zVJPbotY"
~~~


##### Response Example
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 204 No Content
~~~