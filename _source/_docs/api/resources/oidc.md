---
layout: docs_page
title: OpenID Connect
---

# OpenID Connect API

The OpenID Connect API endpoints enable clients to use [OIDC workflows](http://openid.net/specs/openid-connect-core-1_0.html) with Okta.
With OpenID Connect, a client can use Okta as a broker. The user authenticates against identity providers like Google, Facebook, LinkedIn, or Microsoft,
and the client obtains an Okta session.

## Getting Started

If you are new to OpenID Connect, read [the standards topic](/standards/OIDC/index.html) before experimenting with the Postman collection. If you are familiar with
[the OpenID Connect spec](http://openid.net/specs/openid-connect-core-1_0.html), you may want to experiment with the Postman collection now:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/fd92d7c1ab0fbfdecab2)

You can also view the video [Getting Started with the Okta API and OpenID Connect](https://www.youtube.com/watch?v=fPW66abobMI).

## Endpoints

Explore the OpenID Connect API: [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/fd92d7c1ab0fbfdecab2){:target="_blank"}

>The OIDC Access Token is applicable only for the Okta `/oauth2/v1/userinfo` endpoint and thus should be treated as opaque by the application. The application does not need to validate it since it should not be used against other resource servers. The format of it and the key used to sign it are subject to change without prior notice.

### Get User Information
{:.api .api-operation}

{% api_operation get /oauth2/v1/userinfo %}
{% api_operation post /oauth2/v1/userinfo %}

You must include the `access_token` returned from the [/oauth2/v1/authorize](oidc.html#authentication-request) endpoint as an authorization header parameter.

This endpoint complies with the [OIDC userinfo spec](http://openid.net/specs/openid-connect-core-1_0.html#UserInfo).

#### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Authorization: Bearer <access_token>" \
"https://{yourOktaDomain}.com/oauth2/v1/userinfo"
~~~

#### Response Parameters
{:.api .api-response .api-response-example}

Returns a JSON document with information requested in the scopes list of the token.

#### Response Example (Success)
{:.api .api-response .api-response-example}
~~~json
{
  "sub": "00uid4BxXw6I6TV4m0g3",
  "name" :"John Doe",
  "nickname":"Jimmy",
  "given_name":"John",
  "middle_name":"James",
  "family_name":"Doe",
  "profile":"https://profile.wordpress.com/john.doe",
  "zoneinfo":"America/Los_Angeles",
  "locale":"en-US",
  "updated_at":1311280970,
  "email":"john.doe@example.com",
  "email_verified":true,
  "address" : { "street_address": "123 Hollywood Blvd.", "locality": "Los Angeles", "region": "CA", "postal_code": "90210", "country": "US" },
  "phone_number":"+1 (425) 555-1212"
}
~~~

The claims in the response are identical to those returned for the requested scopes in the `id_token` JWT, except for the `sub` claim which is always present.
See [Scope-Dependent Claims](/standards/OIDC/index.html#scope-dependent-claims-not-always-returned) for more information about individual claims.

#### Response Example (Error)
{:.api .api-response .api-response-example}
~~~http
HTTP/1.1 401 Unauthorized​
Cache-Control: no-cache, no-store​
Pragma: no-cache​
Expires: 0​
WWW-Authenticate: Bearer error="invalid_token", error_description="The access token is invalid"​
~~~

#### Response Example (Error)
{:.api .api-response .api-response-example}
~~~http
HTTP/1.1 403 Forbidden​
Cache-Control: no-cache, no-store​
Pragma: no-cache​
Expires: 0​
WWW-Authenticate: Bearer error="insufficient_scope", error_description="The access token must provide access to at least one of these scopes - profile, email, address or phone"
~~~

#### Validating ID Tokens

For more information on validating ID tokens, see our [Authentication Guide](/authentication-guide/tokens/validating-id-tokens).

### Introspection Request
{:.api .api-operation}

{% api_operation post /oauth2/v1/introspect %}

The API takes an Access Token or Refresh Token, and returns a boolean indicating whether it is active or not.
If the token is active, additional data about the token is also returned. If the token is invalid, expired, or revoked, it is considered inactive.
An implicit client can only introspect its own tokens, while a confidential client can inspect all Access Tokens.

> Note; [ID Tokens](/standards/OIDC/index.html#id-token) are also valid, however, they are usually validated on the service provider or app side of a flow.

#### Request Parameters

The following parameters can be posted as a part of the URL-encoded form values to the API.

| Parameter             | Description                                                                                                                                                                                                                                                       | Type   |
|:----------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-------|
| token                 | An Access Token, ID Token, or Refresh Token.                                                                                                                                                                                                                      | String |
| token_type_hint       | A hint of the type of `token`. Valid values are `access_token`, `id_token` and `refresh_token`.                                                                                                                                                                   | Enum   |
| client_id             | Required if client has a secret and client credentials are not provided in the Authorization header. This is used in conjunction with `client_secret`  to authenticate the client application.                                                                    | String |
| client_secret         | Required if the client has a secret and client credentials are not provided in the Authorization header, and if `client_assertion_type` isn&#8217;t specified. This client secret is used in conjunction with `client_id` to authenticate the client application. | String |
| client_assertion      | Required if the `client_assertion_type` is specified. Contains the JWT signed with the `client_secret`.     [JWT Details](#token-authentication-methods)                                                                                                              | String |
| client_assertion_type | Indicates a JWT is being used to authenticate the client. Per the     [Client Authentication spec](http://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication), the valid value is `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`.           | String |

##### Token Authentication Methods

<!--If you change this section, change the section in oauth2.md as well -->

If you authenticate a client with client credentials, provide the [`client_id` and `client_secret`](#request-parameters-1)
using either of the following methods:

* Provide `client_id` and `client_secret`
  in an Authorization header in the Basic auth scheme (`client_secret_basic`). For authentication with Basic auth, an HTTP header with the following format must be provided with the POST request:
  ~~~sh
  Authorization: Basic ${Base64(<client_id>:<client_secret>)}
  ~~~
* Provide the `client_id` and `client_secret`
  as additional parameters to the POST body (`client_secret_post`)
* Provide `client_id` in a JWT that you sign with the `client_secret`
  using HMAC algorithms HS256, HS384, or HS512. Specify the JWT in `client_assertion` and the type, `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`, in `client_assertion_type` in the request.

Use only one of these methods in a single request or an error will occur.

##### Token Claims for Client Authentication with Client Secret JWT

If you use a JWT for client authentication (`client_secret_jwt`), use the following token claims:

| Token Claims | Description                                                                           | Type   |
|:-------------|:--------------------------------------------------------------------------------------|:-------|
| exp          | Required. The expiration time of the token in seconds since January 1, 1970 UTC.      | Long   |
| iat          | Optional. The issuing time of the token in seconds since January 1, 1970 UTC.         | Long   |
| sub          | Required. The subject of the token. This value must be the same as the `client_id`.   | String |
| aud          | Required. The full URL of the resource you&#8217;re using the JWT to authenticate to. | String |
| iss          | Required. The issuer of the token. This value must be the same as the `client_id`.    | String |
| jti          | Optional. The identifier of the token.                                                | String |

Parameter Details

* If `jti` is specified, the token can only be used once. So, for example, subsequent token requests won&#8217;t succeed.
* The `exp` claim will fail the request if the expiration time is more than one hour in the future or has already expired.
* If `iat` is specified, then it must be a time before the request is received.

#### Response Parameters

Based on the type of token and whether it is active or not, the returned JSON contains a different set of information. Besides the claims in the token, the possible top-level members include:

| Parameter  | Description                                                                                                  | Type    |
|:-----------|:-------------------------------------------------------------------------------------------------------------|:--------|
| active     | An Access Token or Refresh Token.                                                                            | boolean |
| token_type | The type of the token. The value is always `Bearer`.                                                         | String  |
| scope      | A space-delimited list of scopes.                                                                            | String  |
| client_id  | The ID of the client associated with the token.                                                              | String  |
| username   | The username associated with the token.                                                                      | String  |
| exp        | The expiration time of the token in seconds since January 1, 1970 UTC.                                       | Long    |
| iat        | The issuing time of the token in seconds since January 1, 1970 UTC.                                          | Long    |
| nbf        | A timestamp in seconds since January 1, 1970 UTC when this token is not be used before.                      | Long    |
| sub        | The subject of the token.                                                                                    | String  |
| aud        | The audience of the token.                                                                                   | String  |
| iss        | The issuer of the token.                                                                                     | String  |
| jti        | The identifier of the token.                                                                                 | String  |
| device_id  | The ID of the device associated with the token                                                               | String  |
| uid        | The user ID. This parameter is returned only if the token is an access token and the subject is an end user. | String  |

#### List of Errors

| Error Id        | Details                                                                                                                                                                                                       |
|:----------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| invalid_client  | The specified `client_id` wasn&#8217;t found.                                                                                                                                                                 |
| invalid_request | The request structure was invalid. For example, the basic authentication header was malformed, or both header and form parameters were used for authentication or no authentication information was provided. |

#### Response Example (Success, Access Token)

~~~json
{
    "active" : true,
    "token_type" : "Bearer",
    "scope" : "openid profile",
    "client_id" : "a9VpZDRCeFh3Nkk2VdYa",
    "username" : "john.doe@example.com",
    "exp" : 1451606400,
    "iat" : 1451602800,
    "sub" : "john.doe@example.com",
    "aud" : "https://{yourOktaDomain}.com",
    "iss" : "https://{yourOktaDomain}.com/oauth2/orsmsg0aWLdnF3spV0g3",
    "jti" : "AT.7P4KlczBYVcWLkxduEuKeZfeiNYkZIC9uGJ28Cc-YaI",
    "uid" : "00uid4BxXw6I6TV4m0g3"
}
~~~

#### Response Example (Success, Refresh Token)

~~~json
{
    "active" : true,
    "token_type" : "Bearer",
    "scope" : "openid profile email",
    "client_id" : "a9VpZDRCeFh3Nkk2VdYa",
    "username" : "john.doe@example.com",
    "exp" : 1451606400,
    "sub" : "john.doe@example.com",
    "device_id" : "q4SZgrA9sOeHkfst5uaa"
}
~~~

#### Response Example (Success, Inactive Token)

~~~json
{
    "active" : false
}
~~~

#### Response Example (Error)

~~~http
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
    "error" : "invalid_client",
    "error_description" : "No client credentials found."
}
~~~

### Revocation Request
{:.api .api-operation}


{% api_operation post /oauth2/v1/revoke %}

The API takes an Access Token or Refresh Token and revokes it. Revoked tokens are considered inactive at the introspection endpoint. A client may only revoke its own tokens.

> Because this endpoint works with the [Okta Authorization Server](/standards/OAuth/index.html#authorization-servers), you don&#8217;t need an authorization server ID.

#### Request Parameters

The following parameters can be posted as a part of the URL-encoded form values to the API.

| Parameter             | Description                                                                                                                                                                                                                                                                     | Type   |
|:----------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-------|
| token                 | An Access Token or Refresh Token.                                                                                                                                                                                                                                               | String |
| token_type_hint       | A hint of the type of `token`. Valid values are `access_token` and `refresh_token`.                                                                                                                                                                                             | Enum   |
| client_id             | The client ID generated as a part of client registration. This is used in conjunction with the `client_secret` parameter to authenticate the client application.                                                                                                                | String |
| client_secret         | Required if the client has a secret and client credentials are not provided in the Authorization header, and if `client_assertion_type` isn&#8217;t specified. This client secret is used in conjunction with the `client_id` parameter to authenticate the client application. | String |
| client_assertion      | Required if the `client_assertion_type` is specified. Contains the JWT signed with the `client_secret`.          [JWT Details](#token-authentication-methods)                                                                                                                           | String |
| client_assertion_type | Indicates a JWT is being used to authenticate the client. Per the           [Client Authentication spec](http://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication), the valid value is `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`.                         | String |

A client may only revoke a token generated for that client.

For more information about token authentication, see [Token Authentication Methods](#token-authentication-methods).

#### Response Parameters

A successful revocation is denoted by an empty response with an HTTP 200. Note that revoking an invalid, expired, or revoked token will still be considered a success as to not leak information

#### List of Errors

| Error Id        | Details                                                                                                                                                                                               |
|:----------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| invalid_client  | The specified `client_id` wasn&#8217;t found.                                                                                                                                                         |
| invalid_request | The request structure was invalid. E.g. the basic authentication header was malformed, or both header and form parameters were used for authentication or no authentication information was provided. |

#### Response Example (Success)

~~~http
HTTP/1.1 200 OK
~~~

#### Response Example (Error)

~~~http
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
    "error" : "invalid_client",
    "error_description" : "No client credentials found."
}
~~~

### Get Keys
{:.api .api-operation}

{% api_operation get /oauth2/v1/keys %}

If automatic key rotation is disabled, provide the `client_id` to fetch public keys for your app. Otherwise, this endpoint returns the public keys automatically rotated.

#### Request Parameters
{:.api .api-request .api-request-params}

| Parameter | Description                 | Param Type | DataType | Required | Default |
|:----------|:----------------------------|:-----------|:---------|:---------|:--------|
| client_id | Your app&#8217;s client ID. | Query      | String   | FALSE    | null    |

#### Response Example
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 200 OK
Cache-Control → max-age=3832304, must-revalidate
Content-Type: application/json;charset=UTF-8
~~~
~~~json
{
  "keys": [
    {
      "alg": "RS256",
      "e": "AQAB",
      "n": "iKqiD4cr7FZKm6f05K4r-GQOvjRqjOeFmOho9V7SAXYwCyJluaGBLVvDWO1XlduPLOrsG_Wgs67SOG5qeLPR8T1zDK4bfJAo1Tvbw
            YeTwVSfd_0mzRq8WaVc_2JtEK7J-4Z0MdVm_dJmcMHVfDziCRohSZthN__WM2NwGnbewWnla0wpEsU3QMZ05_OxvbBdQZaDUsNSx4
            6is29eCdYwhkAfFd_cFRq3DixLEYUsRwmOqwABwwDjBTNvgZOomrtD8BRFWSTlwsbrNZtJMYU33wuLO9ynFkZnY6qRKVHr3YToIrq
            NBXw0RWCheTouQ-snfAB6wcE2WDN3N5z760ejqQ",
      "kid": "U5R8cHbGw445Qbq8zVO1PcCpXL8yG6IcovVa3laCoxM",
      "kty": "RSA",
      "use": "sig"
    },
    {
      "alg": "RS256",
      "e": "AQAB",
      "n": "l1hZ_g2sgBE3oHvu34T-5XP18FYJWgtul_nRNg-5xra5ySkaXEOJUDRERUG0HrR42uqf9jYrUTwg9fp-SqqNIdHRaN8EwRSDRsKAwK
            3HIJ2NJfgmrrO2ABkeyUq6rzHxAumiKv1iLFpSawSIiTEBJERtUCDcjbbqyHVFuivIFgH8L37-XDIDb0XG-R8DOoOHLJPTpsgH-rJe
            M5w96VIRZInsGC5OGWkFdtgk6OkbvVd7_TXcxLCpWeg1vlbmX-0TmG5yjSj7ek05txcpxIqYu-7FIGT0KKvXge_BOSEUlJpBhLKU28
            OtsOnmc3NLIGXB-GeDiUZiBYQdPR-myB4ZoQ",
      "kid": "Y3vBOdYT-l-I0j-gRQ26XjutSX00TeWiSguuDhW3ngo",
      "kty": "RSA",
      "use": "sig"
    },
    {
      "alg": "RS256",
      "e": "AQAB",
      "n": "lC4ehVB6W0OCtNPnz8udYH9Ao83B6EKnHA5eTcMOap_lQZ-nKtS1lZwBj4wXRVc1XmS0d2OQFA1VMQ-dHLDE3CiGfsGqWbaiZFdW7U
            GLO1nAwfDdH6xp3xwpKOMewDXbAHJlXdYYAe2ap-CE9c5WLTUBU6JROuWcorHCNJisj1aExyiY5t3JQQVGpBz2oUIHo7NRzQoKimvp
            dMvMzcYnTlk1dhlG11b1GTkBclprm1BmOP7Ltjd7aEumOJWS67nKcAZzl48Zyg5KtV11V9F9dkGt25qHauqFKL7w3wu-DYhT0hmyFc
            wn-tXS6e6HQbfHhR_MQxysLtDGOk2ViWv8AQ",
      "kid": "h5Sr3LXcpQiQlAUVPdhrdLFoIvkhRTAVs_h39bQnxlU",
      "kty": "RSA",
      "use": "sig"
    }
  ]
}
~~~

>Okta strongly recommends retrieving keys dynamically with the JWKS published in the discovery document.

>Okta also recommends caching or persisting downloaded keys to improve performance by eliminating multiple API requests. If the client application is pinned to a signing key, the verification fails when Okta rotates the key automatically. Pinned client applications must periodically check the cached Okta signing keys.

Any of the two or three keys listed are used to sign tokens. The order of keys in the result doesn&#8217;t indicate which keys are used.

Standard open-source libraries are available for every major language to perform [JWS](https://tools.ietf.org/html/rfc7515) signature validation.

#### Alternative Validation

You can use an [introspection request](#introspection-request) for validation.

### OpenID Connect Discovery Document
{:.api .api-operation}

{% api_operation get /.well-known/openid-configuration %}

This API endpoint returns metadata related to OpenID Connect that can be used by clients to programmatically configure their interactions with Okta.
This API doesn&#8217;t require any authentication and returns a JSON object with the following structure.

~~~json
{
    "issuer": "https://{yourOktaDomain}.com",
    "authorization_endpoint": "https://{yourOktaDomain}.com/oauth2/v1/authorize",
    "token_endpoint": "https://{yourOktaDomain}.com/oauth2/v1/token",
    "userinfo_endpoint": "https://{yourOktaDomain}.com/oauth2/v1/userinfo",
    "registration_endpoint": "https://{yourOktaDomain}.com/oauth2/v1/clients",
    "jwks_uri": "https://{yourOktaDomain}.com/oauth2/v1/keys",
    "response_types_supported": [
        "code",
        "code id_token",
        "code token",
        "code id_token token",
        "id_token",
        "id_token token"
    ],
    "response_modes_supported": [
        "query",
        "fragment",
        "form_post",
        "okta_post_message"
    ],
    "grant_types_supported": [
        "authorization_code",
        "implicit",
        "refresh_token",
        "password"
    ],
    "subject_types_supported": [
        "public"
    ],
    "id_token_signing_alg_values_supported": [
        "RS256"
    ],
    "scopes_supported": [
        "openid",
        "email",
        "profile",
        "address",
        "phone",
        "offline_access",
        "groups"
    ],
    "token_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "client_secret_jwt",
        "none"
    ],
    "claims_supported": [
        "iss",
        "ver",
        "sub",
        "aud",
        "iat",
        "exp",
        "jti",
        "auth_time",
        "amr",
        "idp",
        "nonce",
        "name",
        "nickname",
        "preferred_username",
        "given_name",
        "middle_name",
        "family_name",
        "email",
        "email_verified",
        "profile",
        "zoneinfo",
        "locale",
        "address",
        "phone_number",
        "picture",
        "website",
        "gender",
        "birthdate",
        "updated_at",
        "at_hash",
        "c_hash"
    ],
    "introspection_endpoint": "https://{yourOktaDomain}.com/oauth2/v1/introspect",
    "introspection_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "client_secret_jwt",
        "none"
    ],
    "revocation_endpoint": "https://{yourOktaDomain}.com/oauth2/v1/revoke",
    "revocation_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "client_secret_jwt",
        "none"
    ],
    "end_session_endpoint": "https://{yourOktaDomain}.com/oauth2/v1/logout"
}
~~~

### Authentication Request
{:.api .api-operation}

{% api_operation get /oauth2/v1/authorize %}

This is a starting point for OpenID Connect flows such as implicit and authorization code flows. This request
authenticates the user and returns tokens along with an authorization grant to the client application as a part
of the response.

> Because this endpoint works with the [Okta Authorization Server](/standards/OAuth/index.html#authorization-servers), you don&#8217;t need an authorization server ID.

#### Request Parameters
{:.api .api-request .api-request-params}

| Parameter             | Description                                                                                                                                                                                                                                                                                                                                                                                             | Param Type | DataType | Required | Default          |
|:----------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-----------|:---------|:---------|:-----------------|
|     [idp](idps.html)      | Identity provider (default is Okta)                                                                                                                                                                                                                                                                                                                                                                     | Query      | String   | FALSE    | Okta is the IDP. |
| sessionToken          | Okta one-time sessionToken. This allows an API-based user login flow (rather than Okta login UI). Session tokens can be obtained via the     [Authentication API](authn.html).                                                                                                                                                                                                                              | Query      | String   | FALSE    |                  |
| response_type         | Any combination of `code`, `token`, and `id_token`. The combination determines the     [flow](http://openid.net/specs/openid-connect-core-1_0.html#Authentication). The `code` response type returns an authorization code, which the client can use to obtain an Access Token or a Refresh Token.                                                                                                          | Query      | String   | TRUE     |                  |
| client_id             | Obtained during either   UI client registration or     [Dynamic Client Registration API](oauth-clients.html). It identifies the client and must match the value preregistered in Okta.                                                                                                                                                                                                                        | Query      | String   | TRUE     |
| redirect_uri          | Callback location where the authorization code should be sent. It must match the value preregistered in Okta during client registration.                                                                                                                                                                                                                                                                | Query      | String   | TRUE     |
| display               | How to display the authentication and consent UI. Valid values: `page` or `popup`.                                                                                                                                                                                                                                                                                                                      | Query      | String   | FALSE    |                  |
| max_age               | Allowable elapsed time, in seconds, since the last time the end user was actively authenticated by Okta.                                                                                                                                                                                                                                                                                                | Query      | String   | FALSE    |                  |
| response_mode         | How the authorization response should be returned.     [Valid values: `fragment`, `form_post`, `query` or `okta_post_message`](#parameter-details). If `id_token` or `token` is specified as the response type, then `query` isn&#8217;t allowed as a response mode. Defaults to `fragment` in implicit and hybrid flow. Defaults to `query` in authorization code flow and cannot be set as `okta_post_message`. | Query      | String   | FALSE    | See Parameter Details. |
| scope                 | `openid` is required. Other   [scopes](/standards/OIDC/index.html#scopes) may also be included.                                                                                                                                                                                                                                                                                                         | Query      | String   | TRUE     |
| state                 | A value to be returned in the token. The client application can use it to remember the state of its interaction with the end user at the time of the authentication call. It can contain alphanumeric, comma, period, underscore and hyphen characters.                                                                                                                                                 | Query      | String   | TRUE     |
| prompt                | Either *none* or `login`. If `none`,  do not prompt for authentication, and return an error if the end user is not already authenticated. If `login`, force a prompt (even if the user had an existing session). Default: depends on whether an Okta session exists.                                                                                                                                     | Query      | String   | FALSE    | See Parameter Details. |
| nonce                 | A value that must be returned in the ID Token. It is used to mitigate replay attacks.                                                                                                                                                                                                                                                                                                                   | Query      | String   | TRUE     |
| code_challenge        | A challenge of     [PKCE](#parameter-details). The challenge is verified in the Access Token request.                                                                                                                                                                                                                                                                                                       | Query      | String   | FALSE    |
| code_challenge_method | Method used to derive the code challenge. Must be `S256`.                                                                                                                                                                                                                                                                                                                                               | Query      | String   | FALSE    |
| login_hint            | A username to prepopulate if prompting for authentication.                                                                                                                                                                                                                                                                                                                                              | Query      | String   | FALSE    |
| idp_scope             | A space delimited list of scopes to be provided to the Social Identity Provider when performing   [Social Login](social_authentication.html). These scopes are used in addition to the scopes already configured on the Identity Provider.                                                                                                                                                                | Query      | String   | FALSE    |
| request | A JWT created by the client that enables requests to be passed as a single, self-contained parameter. | Query | JWT | FALSE    | See Description. |

#### Parameter Details

 * `idp`, `sessionToken` and `idp_scope` are Okta extensions to [the OpenID specification](http://openid.net/specs/openid-connect-core-1_0.html#Authentication).
    All other parameters comply with the OpenID Connect specification and their behavior is consistent with the specification.
 * Each value for `response_mode` delivers different behavior:
    * `fragment` -- Parameters are encoded in the URL fragment added to the *redirect_uri* when redirecting back to the client.
    * `query` -- Parameters are encoded in the query string added to the *redirect_uri* when redirecting back to the client.
    * `form_post` -- Parameters are encoded as HTML form values that are auto-submitted in the User Agent. Thus, the values are transmitted via the HTTP POST method to the client
      and the result parameters are encoded in the body using the application/x-www-form-urlencoded format.
    * `okta_post_message` -- Uses [HTML5 Web Messaging](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) (for example, window.postMessage()) instead of the redirect for the authorization response from the authentication endpoint.
      `okta_post_message` is an adaptation of the [Web Message Response Mode](https://tools.ietf.org/html/draft-sakimura-oauth-wmrm-00#section-4.1).
      This value provides a secure way for a single-page application to perform a sign-in flow
      in a popup window or an iFrame and receive the ID Token and/or access token back in the parent page without leaving the context of that page.
      The data model for the [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) call is in the next section.
    * The `Referrer-Policy` header is automatically included in the request for `fragment` or `query`, and is set to `Referrer-Policy: no-referrer`. However, a browser is not obligated to respect the `Referrer-Policy` header from a redirect. If the `response_mode` is `query`, the location specified in `redirect_uri` must set this header to prevent leaking authorization codes.

 * Okta requires the OAuth 2.0 `state` parameter on all requests to the authentication endpoint in order to prevent cross-site request forgery (CSRF).
 The OAuth 2.0 specification [requires](https://tools.ietf.org/html/rfc6749#section-10.12) that clients protect their redirect URIs against CSRF by sending a value in the authorize request which binds the request to the user-agent&#8217;s authenticated state.
 Using the `state` parameter is also a countermeasure to several other known attacks as outlined in [OAuth 2.0 Threat Model and Security Considerations](https://tools.ietf.org/html/rfc6819).

 * [Proof Key for Code Exchange](https://tools.ietf.org/html/rfc7636) (PKCE) is a stronger mechanism for binding the authorization code to the client than just a client secret, and prevents [a code interception attack](https://tools.ietf.org/html/rfc7636#section-1) if both the code and the client credentials are intercepted (which can happen on mobile/native devices). The PKCE-enabled client creates a large random string as code_verifier and derives code_challenge from it using code_challenge_method. It passes the code_challenge and code_challenge_method in the authorization request for code flow. When a client tries to redeem the code, it must pass the code_verifer. Okta recomputes the challenge and returns the requested token only if it matches the code_challenge in the original authorization request. When a client, whose `token_endpoint_auth_method` is `none`, makes a code flow authorization request, the `code_challenge` parameter is required.

* About the `request` parameter:
  * You must sign the JWT using the app's client secret.
  * The JWT can't be encrypted.
  * Okta supports these signing algorithms: [HS256](https://tools.ietf.org/html/rfc7518#section-5.2.3), [HS384](https://tools.ietf.org/html/rfc7518#section-5.2.4), and [HS512](https://tools.ietf.org/html/rfc7518#section-5.2.5).
  * We recommend you don't duplicate any request parameters in both the JWT and the query URI itself. However, you can do so with `state`, `nonce`, `code_challenge`, and `code_challenge_method`.
  * Okta validates the `request` parameter in the following ways:
    1. `iss` is required and must  be the `client_id`.
    2. `aud` is required and must be same value as the authorization server issuer that mints the ID token or access token. This value is published in metadata for Okta Authorization Server and Custom Authorization Server.
    3. JWT lifetime is evaluated using the `iat` and `exp` claims if present. If the JWT is expired or not yet valid, Okta returns an `invalid_request_object`  error.
    4. Okta rejects the JWT if the `jti` claim is present and it has already been processed.

#### postMessage() Data Model

Use the postMessage() data model to help you when working with the `okta_post_message` value of the `response_mode` request parameter.

`message`:

| Parameter         | Description                                                                                                                                                                                                                                                                                                   | DataType |
|:------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------|
| id_token          | The ID Token JWT contains the details of the authentication event and the claims corresponding to the requested scopes. This is returned if the `response_type` includes `id_token`.                                                                                                                          | String   |
| access_token      | The `access_token` used to access the   [`/oauth2/v1/userinfo`](/docs/api/resources/oidc.html#get-user-information) endpoint. This is returned if the `response_type` included a token. <b>Important</b>: Unlike the ID Token JWT, the `access_token` structure is specific to Okta, and is subject to change. | String   |
| state             | If the request contained a `state` parameter, then the same unmodified value is returned back in the response.                                                                                                                                                                                                | String   |
| error             | The error-code string providing information if anything goes wrong.                                                                                                                                                                                                                                           | String   |
| error_description | Additional description of the error.                                                                                                                                                                                                                                                                          | String   |

`targetOrigin`:

Specifies what the origin of `parentWindow` must be in order for the postMessage() event to be dispatched
(this is enforced by the browser). The `okta-post-message` response mode always uses the origin from the `redirect_uri`
specified by the client. This is crucial to prevent the sensitive token data from being exposed to a malicious site.

#### Response Parameters

The method of returning the response depends on the response type passed to the API. For example, a `fragment` response mode returns values in the fragment portion of a redirect to the specified `redirect_uri` while a `form_post` response mode POSTs the return values to the redirect URI.
Irrespective of the response type, the contents of the response are as described in the table.

| Parameter         | Description                                                                                                                                                                                                                                                          | DataType |
|:------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------|
| id_token          | JWT that contains the details of the authentication event and the claims corresponding to the requested scopes. This is returned if the `response_type` includes `id_token`.                                                                                         | String   |
| access_token      | Used to access the   [`/oauth2/v1/userinfo`](/docs/api/resources/oidc.html#get-user-information) endpoint. This is returned if `response_type` includes `token`. Unlike the ID Token JWT, the `access_token` structure is specific to Okta, and is subject to change.  | String   |
| token_type        | The token type is always `Bearer` and is returned only when `token` is specified as a `response_type`.                                                                                                                                                               | String   |
| code              | An opaque value that can be used to redeem tokens from   the [token endpoint](#token-request). `code` is returned if the `response_type` includes `code`. The code has a lifetime of 60 seconds.                                                                                                                                                                             | String   |
| expires_in        | Number of seconds until the `access_token` expires. This is only returned if the response included an `access_token`.                                                                                                                                                | String   |
| scope             | Scopes specified in the `access_token`. Returned only if the response includes an `access_token`.                                                                                                                                                                    | String   |
| state             | The unmodified `state` value from the request.                                                                                                                                                                                                                       | String   |
| error             | Error-code (if something went wrong).                                                                                                                                                                                                                                | String   |
| error_description | Description of the error.                                                                                                                                                                                                                                            | String   |

##### Possible Errors

These APIs are compliant with the OpenID Connect and OAuth 2.0 spec with some Okta specific extensions.

[OAuth 2.0 Spec error codes](https://tools.ietf.org/html/rfc6749#section-4.1.2.1)

| Error Id                  | Details                                                                                                                                                                                                          |
|:--------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| unsupported_response_type | The specified response type is invalid or unsupported.                                                                                                                                                           |
| unsupported_response_mode | The specified response mode is invalid or unsupported. This error is also thrown for disallowed response modes. For example, if the query response mode is specified for a response type that includes `id_token`. |
| invalid_scope             | The scopes list contains an invalid or unsupported value.                                                                                                                                                        |
| server_error              | The server encountered an internal error.                                                                                                                                                                        |
| temporarily_unavailable   | The server is temporarily unavailable, but should be able to process the request at a later time.                                                                                                                |
| invalid_request           | The request is missing a necessary parameter or the parameter has an invalid value.                                                                                                                              |
| invalid_grant             | The specified grant is invalid, expired, revoked, or does not match the redirect URI used in the authorization request.                                                                                          |
| invalid_token             | The provided Access Token is invalid.                                                                                                                                                                            |
| invalid_client            | The specified client id is invalid.                                                                                                                                                                              |
| access_denied             | The server denied the request.                                                                                                                                                                                   |

[Open-ID Spec error codes](http://openid.net/specs/openid-connect-core-1_0.html#AuthError)

| Error Id           | Details                                                                                           |
|:-------------------|:--------------------------------------------------------------------------------------------------|
| login_required     | The request specified that no prompt should be shown but the user is currently not authenticated. |
| insufficient_scope | The Access Token provided does not contain the necessary scopes to access the resource.           |

#### Request Examples

This request initiates the authorization code flow, as signaled by `response_type=code`. The request returns an authorization code that you can use as the `code` parameter in a token request.

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
"https://{yourOktaDomain}.com/oauth2/v1/authorize?
  client_id=${client_id}&
  response_type=code&
  response_mode=form_post&
  scope=openid offline_access&
  redirect_uri=${redirect_uri}&
  state=${state}&
  nonce=${nonce}"
~~~
This request does the same thing, but uses the `request` parameter to deliver a signed (HS256) JWT that contains all the query parameters:

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
"https://{yourOktaDomain}.com/oauth2/v1/authorize?
  request=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPa3RhIiwiaWF0IjoxNTEyNTE2MjIxLCJleHAiOjE1NDQwNTIyMjEsImF1ZCI6Ind3dy5leGFtcGxlLmNvbSIsInN1YiI6InNqYWNrc29uQGV4YW1wbGUuY29tIiwiRW1haWwiOiJzamFja3NvbkBleGFtcGxlLmNvbSIsInJlc3BvbnNlX3R5cGUiOiJjb2RlIiwicmVzcG9uc2VfbW9kZSI6ImZvcm1fcG9zdCIsInJlZGlyZWN0X3VyaSI6Im15UmVkaXJlY3RVUkkuY29tIiwic3RhdGUiOiJteVN0YXRlIiwibm9uY2UiOiJteU5vbmNlIiwic2NvcGUiOiJvcGVuaWQgb2ZmbGluZV9hY2Nlc3MifQ.TjPy2_nUerULClavBNHcpnO_Pd1DxNEjQCeSW45ALJg"
  ~~~

This request initiates the implicit flow, that is, it obtains an ID Token and optionally an Access Token directly from the authorization server. We use the same request as the first example, but with `response_type=id_token` or `response_type=id_token token`:

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
"https://{yourOktaDomain}.com/oauth2/v1/authorize?
  client_id=${client_id}&
  response_type=id_token token&
  response_mode=form_post&
  scope=openid offline_access&
  redirect_uri=${redirect_uri}&
  state=${state}&
  nonce=${nonce}"
~~~

#### Response Example (Success)

~~~json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXIiOjEsImp0aSI6IkFULm43cUkyS2hnbjFSZkUwbllQbFJod0N6UmU5eElIOUQ1cXFQYzNBNTQzbDQiLCJpc3MiOiJodHRwczovL21pbG  xpd2F5cy5va3RhLmNvbS9vYXV0aDIvYXVzOXVnbGRjbTJ0SFpqdjQwaDciLCJhdWQiOiJodHRwczovL21pbGxpd2F5cy5va3RhLmNvbSIsImlhdCI6MTQ4OTY5Nzk0NSwiZXhwIjoxNDk1MjIxMTQ1LCJjaWQiOiJBeD  VYclI0YU5Ea2pDYWNhSzdobiIsInVpZCI6IjAwdTljcDFqY3R3Ymp0a2tiMGg3Iiwic2NwIjpbIm9wZW5pZCIsIm9mZmxpbmVfYWNjZXNzIl0sInN1YiI6ImZvcmQucHJlZmVjdEBtaWxsaXdheXMuY29tIn0.hb3oS9  2Nb7QmLz2R99SfB_qqTP9GsMCtc2umA2sJwe4",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "openid offline_access",
  "refresh_token": "IJFLydLpLZ7-9spMSePkqgBSTnjBluJIJi6HESG84cE",
  "id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMHU5Y3AxamN0d2JqdGtrYjBoNyIsInZlciI6MSwiaXNzIjoiaHR0cHM6Ly9taWxsaXdheXMub2t0YS5jb20vb2F1dGgyL2F1czl1Z2  xkY20ydEhaanY0MGg3IiwiYXVkIjoiQXg1WHJSNGFORGtqQ2FjYUs3aG4iLCJpYXQiOjE0ODk2OTc5NDUsImV4cCI6MTQ5NTIyMTE3NSwianRpIjoiSUQuNEVvdWx5WnM4MU9aaVdqQWNHQWdadmg0eUFScUdacjIwWF  RLdW1WRDRNMCIsImFtciI6WyJwd2QiXSwiaWRwIjoiMDBvOWNwMWpjNmhjc0dWN2kwaDciLCJub25jZSI6ImNjYmJmNDNkLTc5MTUtNDMwMC05NTZkLWQxYjc1ODk1YWNiNyIsImF1dGhfdGltZSI6MTQ4OTY5NjAzNy  wiYXRfaGFzaCI6IlRoaHNhUFd6bVlKMVlmcm1kNDM1Q0EifQ._uLqItzLzKb6m6G2-Jqs6OmrG_iWMg0P6UKQqzVggPc"
}
~~~

#### Response Example (Error)

The requested scope is invalid:

~~~
https://www.example.com/#error=invalid_scope&error_description=The+requested+scope+is+invalid%2C+unknown%2C+or+malformed
~~~

### Token Request
{:.api .api-operation}

{% api_operation post /oauth2/v1/token %}

The API returns Access Tokens, ID Tokens, and Refresh Tokens, depending on the request parameters.

>Because this endpoint works with the [Okta Authorization Server](/standards/OAuth/index.html#authorization-servers), you don&#8217;t need an authorization server ID.

#### Request Parameters

The following parameters can be posted as a part of the URL-encoded form values to the API.

| Parameter             | Description                                                                                                                                                                                                                                                                                                                      | Type   |
|:----------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-------|
| grant_type            | Can be one of the following: `authorization_code`, `password`, or `refresh_token`. Determines the mechanism Okta uses to authorize the creation of the tokens.                                                                                                                                                                   | String |
| code                  | Required if `grant_type` is `authorization_code`. The value is what was returned from the           [authentication endpoint](#authentication-request). The code has a lifetime of 60 seconds.                                                                                                                                                                                 | String |
| refresh_token         | Required if `grant_type` is `refresh_token`. The value is what was returned from this endpoint via a previous invocation.                                                                                                                                                                                                        | String |
| username              | Required if the grant_type is `password`.                                                                                                                                                                                                                                                                                        | String |
| password              | Required if the grant_type is `password`.                                                                                                                                                                                                                                                                                        | String |
| scope                 | Required if `password` is the `grant_type`. This is a list of scopes that the client wants to be included in the Access Token. For the `refresh_token` grant type, these scopes have to be subset of the scopes used to generate the Refresh Token in the first place.                                                           | String |
| redirect_uri          | Required if `grant_type` is `authorization_code`. Specifies the callback location where the authorization was sent. This value must match the `redirect_uri` used to generate the original `authorization_code`.                                                                                                                 | String |
| code_verifier         | Required if `grant_type` is `authorization_code`  and `code_challenge` was specified in the original `/authorize` request. This value is the code verifier for                         [PKCE](#parameter-details). Okta uses it to recompute the `code_challenge` and verify if it matches the original `code_challenge` in the authorization request.   | String |
| client_id             | Required if client has a secret and client credentials are not provided in the Authorization header. This is used in conjunction with `client_secret`  to authenticate the client application.                                                                                                                                   | String |
| client_secret         | Required if the client has a secret and client credentials are not provided in the Authorization header, and if `client_assertion_type` isn&#8217;t specified. This client secret is used in conjunction with `client_id` to authenticate the client application.                                                                | String |
| client_assertion      | Required if the `client_assertion_type` is specified. Contains the JWT signed with the `client_secret`.    [JWT Details](#token-authentication-methods)                                                                                                                                                                            | String |
| client_assertion_type | Indicates a JWT is being used to authenticate the client. Per the   [Client Authentication spec](http://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication), the valid value is `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`.                                                                          | String |

##### Refresh Tokens for Web and Native Applications

For web and native application types, an additional process is required:

1. Use the Okta Administration UI and check the **Refresh Token** checkbox under **Allowed Grant Types** on the client application page.
2. Pass the `offline_access` scope to your `/authorize` or `/token` request if you&#8217;re using the `password` grant type.

For more information about token authentication, see [Token Authentication Methods](#token-authentication-methods).


#### Response Parameters

Based on the `grant_type` and sometimes `scope`, the response contains different token sets.
Generally speaking, the scopes specified in a request are included in the Access Tokens in the response.

| Requested grant type | Requested scope                                     | Response tokens                                                   |
|:---------------------|:----------------------------------------------------|:------------------------------------------------------------------|
| authorization_code   | None                                                | Access Token. Contains scopes requested in `/authorize` endpoint. |
| authorization_code   | Any scopes except `offline_access` or `openid`      | Access Token                                                      |
| authorization_code   | Any or no scopes plus `offline_access`              | Access Token, Refresh Token                                       |
| authorization_code   | Any or no scopes plus `openid`                      | Access Token, ID Token                                            |
| authorization_code   | Any or no scopes plus `offline_access` and `openid` | Access Token, Refresh Token, ID Token                             |
| refresh_token        | None                                                | Access Token, Refresh Token. Contains scopes used to generate the Refresh Token.     |
| refresh_token        | Any scopes except `offline_access`                  | Access Token                                                      |
| refresh_token        | Any or no scopes plus `offline_access`              | Access Token, Refresh Token                                       |
| password             | Any or no scopes except `offline_access`            | Access Token                                                      |
| password             | Any or no scopes plus `offline_access`              | Access Token, Refresh Token                                       |
| password             | Any or no scopes plus `openid`                      | Access Token, ID Token                                            |
| password             | Any or no scopes plus `offline_access` and `openid` | Access Token, Refresh Token, ID Token                             |

#### List of Errors

| Error Id               | Details                                                                                                                                                                                                    |
|:-----------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| invalid_client         | The specified client id wasn&#8217;t found.                                                                                                                                                                |
| invalid_request        | The request structure was invalid. For example: the basic authentication header is malformed; both header and form parameters were used for authentication; or no authentication information was provided. |
| invalid_grant          | The `code`, `refresh_token`, or `username` and `password` combination is invalid, or the `redirect_uri` does not match the one used in the authorization request.                                          |
| unsupported_grant_type | The `grant_type` isn&#8217;t `authorization_code`, `refresh_token`, or `password`.                                                                                                                         |
| invalid_scope          | The scopes list contains an invalid or unsupported value.                                                                                                                                                  |

#### Response Example (Success)

~~~json
{
    "access_token" : "eyJhbGciOiJSUzI1NiJ9.eyJ2ZXIiOjEsImlzcyI6Imh0dHA6Ly9yYWluLm9rdGExLmNvbToxODAyIiwiaWF0IjoxNDQ5Nj
                      I0MDI2LCJleHAiOjE0NDk2Mjc2MjYsImp0aSI6IlVmU0lURzZCVVNfdHA3N21BTjJxIiwic2NvcGVzIjpbIm9wZW5pZCIsI
                      mVtYWlsIl0sImNsaWVudF9pZCI6InVBYXVub2ZXa2FESnh1a0NGZUJ4IiwidXNlcl9pZCI6IjAwdWlkNEJ4WHc2STZUVjRt
                      MGczIn0.HaBu5oQxdVCIvea88HPgr2O5evqZlCT4UXH4UKhJnZ5px-ArNRqwhxXWhHJisslswjPpMkx1IgrudQIjzGYbtLF
                      jrrg2ueiU5-YfmKuJuD6O2yPWGTsV7X6i7ABT6P-t8PRz_RNbk-U1GXWIEkNnEWbPqYDAm_Ofh7iW0Y8WDA5ez1jbtMvd-o
                      XMvJLctRiACrTMLJQ2e5HkbUFxgXQ_rFPNHJbNSUBDLqdi2rg_ND64DLRlXRY7hupNsvWGo0gF4WEUk8IZeaLjKw8UoIs-E
                      TEwJlAMcvkhoVVOsN5dPAaEKvbyvPC1hUGXb4uuThlwdD3ECJrtwgKqLqcWonNtiw",
    "token_type" : "Bearer",
    "expires_in" : 3600,
    "scope"      : "openid email",
    "refresh_token" : "a9VpZDRCeFh3Nkk2VdY",
    "id_token" : "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwMHVpZDRCeFh3Nkk2VFY0bTBnMyIsImVtYWlsIjoid2VibWFzdGVyQGNsb3VkaXR1ZG
                  UubmV0IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInZlciI6MSwiaXNzIjoiaHR0cDovL3JhaW4ub2t0YTEuY29tOjE4MDIiLCJsb
                  2dpbiI6ImFkbWluaXN0cmF0b3IxQGNsb3VkaXR1ZGUubmV0IiwiYXVkIjoidUFhdW5vZldrYURKeHVrQ0ZlQngiLCJpYXQiOjE0
                  NDk2MjQwMjYsImV4cCI6MTQ0OTYyNzYyNiwiYW1yIjpbInB3ZCJdLCJqdGkiOiI0ZUFXSk9DTUIzU1g4WGV3RGZWUiIsImF1dGh
                  fdGltZSI6MTQ0OTYyNDAyNiwiYXRfaGFzaCI6ImNwcUtmZFFBNWVIODkxRmY1b0pyX1EifQ.Btw6bUbZhRa89DsBb8KmL9rfhku
                  --_mbNC2pgC8yu8obJnwO12nFBepui9KzbpJhGM91PqJwi_AylE6rp-ehamfnUAO4JL14PkemF45Pn3u_6KKwxJnxcWxLvMuuis
                  nvIs7NScKpOAab6ayZU0VL8W6XAijQmnYTtMWQfSuaaR8rYOaWHrffh3OypvDdrQuYacbkT0csxdrayXfBG3UF5-ZAlhfch1fhF
                  T3yZFdWwzkSDc0BGygfiFyNhCezfyT454wbciSZgrA9ROeHkfPCaX7KCFO8GgQEkGRoQntFBNjluFhNLJIUkEFovEDlfuB4tv_M
                  8BM75celdy3jkpOurg"
}
~~~

#### Response Example (Error)

~~~http
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
    "error" : "invalid_client",
    "error_description" : "No client credentials found."
}
~~~

### Logout Request
{:.api .api-operation}

{% api_operation get /oauth2/v1/logout %}

This redirect endpoint takes an ID Token and logs the user out of Okta if the subject matches the current Okta session. A `post_logout_redirect_uri` may be specified to redirect the User after the logout has been performed. Otherwise, the user is redirected to the Okta login page.

Note: This is not a server-side API call.

#### Request Parameters

The following parameters can be posted as a part of the URL-encoded form values to the API.

| Parameter                | Description                                                                                                                                     | Type   | Required |
|:-------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------|:-------|:---------|
| id_token_hint            | A valid ID token with a subject matching the current session.                                                                                   | String | TRUE     |
| post_logout_redirect_uri | Callback location to redirect to after the logout has been performed. It must match the value preregistered in Okta during client registration. | String | FALSE    |
| state                    | If the request contained a `state` parameter, then the same unmodified value is returned back in the response.                                  | String | FALSE    |

#### Request Examples

This request initiates a logout and will redirect to the Okta login page on success.

~~~sh
curl -v -X GET \
"https://{yourOktaDomain}.com/oauth2/v1/logout?
  id_token_hint=${id_token_hint}
~~~

This request initiates a logout and will redirect to the `post_logout_redirect_uri` on success.

~~~sh
curl -v -X GET \
"https://{yourOktaDomain}.com/oauth2/v1/logout?
  id_token_hint=${id_token_hint}&
  post_logout_redirect_uri=${post_logout_redirect_uri}&
  state=${state}
~~~
