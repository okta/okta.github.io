---
layout: docs_page
title: OpenID Connect
---

# OpenID Connect API

The OpenID Connect API endpoints enable clients to use [OIDC workflows](http://openid.net/specs/openid-connect-core-1_0.html) with Okta.
With OpenID Connect, a client can use Okta as a broker. The user authenticates against identity providers like Google, Facebook, LinkedIn, or Microsoft,
and the client obtains an Okta session.

> This API is currently in **Early Access** status.  It has been tested as thoroughly as a Generally Available feature. Contact Support to enable this feature.

## Authentication Basics with OAuth 2.0 and OpenID Connect

OAuth 2.0 is an authorization framework for delegated access to APIs, and OpenID Connect is an SSO protocol for authenticating end-users and asserting their identity.
OpenID Connect extends OAuth 2.0:

* Provides a signed *id_token* for the client and a UserInfo endpoint from which you can fetch user attributes.
* Provides a standard set of scopes and claims for identities including profile, email, address, and phone.

![OpenID Architecture Diagram](/assets/img/openID_overview.png)

Okta is the identity provider responsible for verifying the identity of users and applications that exist in an organization’s directory,
and issuing identity tokens upon successful authentication of those users and applications.

The basic authentication flow with Okta as your identity provider:

1. The application sends a request to Okta.
2. Okta authenticates the client.
3. Okta authenticates the user.
4. Okta approves or denies the requested scopes.
5. Okta mints a token and sends it in the response.
6. The application validates the identity token’s integrity. For more information, see [Validating ID Tokens](#validating-id-tokens).

> Important: Okta uses public key cryptography to sign tokens and verify that they are valid.
See the last section of [Validating ID Tokens](#validating-id-tokens) for more information on the necessary logic
you must have in your application to ensure it’s always updated with the latest keys.

The flow of requests and responses for the authentication process is based on OAuth 2.0 and OpenID Connect protocols.
The properties you need depend on which client profile and use case you are targeting.

## Claims

Tokens issued by Okta contain claims, which are statements about a subject (user).
For example, the claim can be about a name, identity, key, group, or privilege.
The claims in a security token are dependent upon the type of token, the type of credential used to authenticate the user, and the application configuration.

The claims requested by the `profile`, `email`, `address`, and `phone` scope values are returned from the UserInfo Endpoint, as described in [the OpenID spec Section 5.3.2](http://openid.net/specs/openid-connect-core-1_0.html#UserInfoResponse), when a `response_type` value is used that results in an Access Token being issued. However, when no Access Token is issued (which is the case for the `response_type` value `id_token`), the resulting Claims are returned in the ID Token.

## Scopes

OpenID Connect uses scope values to specify what access privileges are being requested for Access Tokens.
The scopes associated with Access Tokens determine which claims are available when they are used
to access [the OIDC `userinfo` endpoint](http://developer.okta.com/docs/api/resources/oidc.html#get-user-information). The following scopes are supported:

|--------------+--------------------------------------------------------------------------------|--------------|
| Property     | Description                                                                    | Required     |
|--------------+---------+----------------------------------------------------------------------|--------------|
| openid       | Identifies the request as an OpenID Connect request.                           | Yes          |
| profile      | Requests access to the end-user's default profile claims.                      | No           |
| email        | Requests access to the `email` and `email_verified` claims.                    | No           |
| phone        | Requests access to the `phone_number` and `phone_number_verified` claims.      | No           |
| address      | Requests access to the `address` claim.                                        | No           |
| groups       | Requests access to the `groups` claim.                                         | No           |
| offline_access | Requests a refresh token, used to obtain more access tokens without re-prompting the user for authentication. | No           |

### Scope Values

* `openid` is required for any OpenID request connect flow. If no openid scope value is present, the request may
  be a valid OAuth 2.0 request, but it's not an OpenID Connect request.
* `profile` requests access to these default profile claims: `name`, `family_name`, `given_name`, `middle_name`, `nickname`, `preferred_username`, `profile`,  
`picture`, `website`, `gender`, `birthdate`, `zoneinfo`,`locale`, and `updated_at`.
* `offline_access` can only be requested in combination with a `response_type` containing `code`. If the `response_type` does not contain `code`, `offline_access` will be ignored.
* For more information about `offline_access`, see the [OIDC spec](http://openid.net/specs/openid-connect-core-1_0.html#OfflineAccess).

## ID Token

OpenID Connect introduces an [ID Token](http://openid.net/specs/openid-connect-core-1_0.html#IDToken)
which is a [JSON web token (JWT)](https://tools.ietf.org/html/rfc7519) that contains information about an authentication event
as well as claims about the authenticated user.

ID Tokens should always be [validated](#validating-id-tokens) by the client to ensure their integrity.

The ID Token (*id_token*) consists of three period-separated, base64URL-encoded JSON segments: [a header](#header), [the payload](#payload), and [the signature](#signature).

### ID Token Header

~~~json
{
  "alg": "RS256",
  "kid": "45js03w0djwedsw"
}
~~~

### ID Token Payload

~~~json
{
  "ver": 1,
  "sub": "00uid4BxXw6I6TV4m0g3",
  "iss": "http://rain.okta1.com:1802",
  "aud": "uAaunofWkaDJxukCFeBx",
  "iat": 1449624026,
  "exp": 1449627626,
  "amr": [
    "pwd"
  ],
  "jti": "4eAWJOCMB3SX8XewDfVR",
  "auth_time": 1449624026,
  "at_hash": "cpqKfdQA5eH891Ff5oJr_Q",
  "name" :"John Doe",
  "nickname":"Jimmy",
  "preferred_username": "administrator1@clouditude.net",
  "given_name":"John",
  "middle_name":"James",
  "family_name":"Doe",
  "profile":"http://profile.wordpress.com/john.doe",
  "zoneinfo":"America/Los_Angeles",
  "locale":"en-US",
  "updated_at":1311280970,
  "email":"john.doe@example.com",
  "email_verified":true,
  "address" : { "street_address": "123 Hollywood Blvd.",
  		"locality": "Los Angeles",
  		"region": "CA",
  		"postal_code": "90210",
  		"country": "US"
  	},
  "phone_number":"+1 (425) 555-1212"
}
~~~

### ID Token Signature

This is the digital signature that Okta signs, using the public key identified by the *kid* property in the header section.

### ID Token Claims

The header and payload sections contain claims.

#### Claims in the header section

Claims in the header are always returned.

|--------------+-----------------------------------------------------------------------------------------------------+--------------|--------------------------|
| Property     | Description                                                                      | DataType     | Example                  |
|--------------+---------+--------------------------------------------------------------------------------------------+--------------|--------------------------|
| alg          | Identifies the digital signature algorithm used. This is always be RS256.      | String       | "RS256"                  |
| kid          | Identifies the *public-key* used to verify the *id_token*. The corresponding *public-key* can be found as a part of the [well-known configuration's](#openid-connect-discovery-document) *jwks_uri* value.                                  | String       | "a5dfwef1a-0ead3f5223_w1e" |

#### Claims in the payload section

Claims in the payload are either base claims, independent of scope (always returned), or dependent on scope (not always returned).

##### Base claims (always present)

|--------------+-------------------+----------------------------------------------------------------------------------+--------------|--------------------------|
| Property     |  Description                                                                      | DataType     | Example                  |
|--------------+---------+----------+----------------------------------------------------------------------------------+--------------|--------------------------|
| ver     | The semantic version of the ID Token.   |  Integer   |  1    |
| jti     | A unique identifier for this ID Token for debugging and revocation purposes.   | String    |  "Tlenfse93dgkaksginv"  |
| iss     | The Issuer Identifier of the response.    | String    | "https://your-org.okta.com"     |
| sub     | The subject. A unique identifier for the user.   | String    | 	"00uk1u7AsAk6dZL3z0g3"     |
| aud     | Identifies the audience that this ID Token is intended for. It must be one of the OAuth 2.0 client IDs of your application.   | String    | "6joRGIzNCaJfdCPzRjlh"     |
| iat     | The time the ID Token was issued, represented in Unix time (seconds).   | Integer    | 1311280970     |
| exp     | The time the ID Token expires, represented in Unix time (seconds).   | Integer    | 1311280970     |
| auth_time | The time the end-user was authenticated, represented in Unix time (seconds).   | Integer    | 1311280970     |
| amr     | JSON array of strings that are identifiers for [authentication methods](http://self-issued.info/docs/draft-jones-oauth-amr-values-00.html) used in the authentication.   | Array    | [ "pwd", "mfa", "otp", "kba", "sms", "swk", "hwk" ]     |
| idp     | The id of the Identity Provider that the user authenticated to Okta with. (Used for Social Auth and Inbound SAML). If it was Okta, the value would be the OrgId.  | String    | "00ok1u7AsAkrwdZL3z0g3"    |
| nonce     |  Value used to associate a Client session with an ID Token, and to mitigate replay attacks. |  String   | "n-0S6_WzA2Mj"  |
| at_hash     | The base64URL-encoded first 128-bits of the SHA-256 hash of the Access Token. This is only returned if an Access Token is also returned with an ID Token.  | String    | "MTIzNDU2Nzg5MDEyMzQ1Ng"     |
| c_hash  | The base64URL-encoded first 128-bits of the SHA-256 hash of the authorization code. This is only returned if an authorization code is also returned with the ID Token. | String | "DE5MzQ1TIzlr30gokT2UDN"   |

##### Scope-dependent claims (not always returned)

|--------------+-------------------+----------------------------------------------------------------------------------+--------------|--------------------------|
| Property     | Required Scope | Description                                                                      | DataType     | Example                  |
|--------------+---------+----------+----------------------------------------------------------------------------------+--------------|--------------------------|
| name     |  profile  | User's full name in displayable form including all name parts, possibly including titles and suffixes, ordered according to the user's locale and preferences.   | String    | "John Doe"     |
| preferred_username | profile | The Okta login (username) for the end-user. | String | "john.doe@example.com" |
| nickname     |  profile   | Casual name of the user that may or may not be the same as the given_name.   | String    | "Jimmy"    |
| preferred_username  |  profile  |  The chosen login (username) for the end-user. By default this is the Okta username.  | String    | 	"john.doe@example.com"     |
| given_name     |  profile   | Given name(s) or first name(s) of the user. Note that in some cultures, people can have multiple given names; all can be present, with the names being separated by space characters.   | String    | "John"     |
| middle_name     |  profile    | Middle name(s) of the user. Note that in some cultures, people can have multiple middle names; all can be present, with the names being separated by space characters. Also note that in some cultures, middle names are not used.   | String    | "James"   |
| family_name     |  profile   | Surname(s) or last name(s) of the user. Note that in some cultures, people can have multiple family names or no family name; all can be present, with the names being separated by space characters.   | String    |  "Doe"    |
| profile     |  profile   | URL of the user's profile page.   | String    | "http://profile.wordpress.com/john.doe"     |
| zoneinfo     |  profile  | String representing the user's time zone.   |  String   |  	"America/Los_Angeles"    |
| locale     |  profile   | Language and [ISO3166‑1](http://www.iso.org/iso/country_codes) country code in uppercase, separated by a dash.   | String    | "en-US"     |
| updated_at     | profile    | Time the user's information was last updated, represented in Unix time (seconds).   | Integer    | 1311280970     |
| email     |  email   | User's preferred e-mail address. The resource provider must not rely upon this value being unique.   | String    | "john.doe@example.com"     |
| email_verified     |  email   | True if the user's e-mail address (Okta primary email) has been verified; otherwise false.   | boolean    | true     |
| address     | address    | User's preferred postal address. The value of the address member is a JSON structure containing *street_address*, *locality*, *region*, *postal_code*, and *country*.   | JSON structure    | { "street_address": "123 Hollywood Blvd.", "locality": "Los Angeles", "region": "CA", "postal_code": "90210", "country": "US" }     |
| phone_number     |  phone   | User's preferred telephone number in E.164 format.   | String    | 	"+1 (425) 555-1212"     |
| groups    | groups    | The groups that the user is a member of that also match the ID token group filter of the client app. | List | ["MyGroup1", "MyGroup2", "MyGroup3"] |

Be aware of the following before you work with scope-dependent claims:

* To protect against arbitrarily large numbers of groups matching the group filter, the groups claim has a limit of 100.
If more than 100 groups match the filter, then the request fails. Expect that this limit may change in the future.
For more information about configuring an app for OpenID Connect, including group claims, see [Using OpenID Connect](https://support.okta.com/help/articles/Knowledge_Article/Using-OpenID-Connect).
* **Important:** Scope-dependent claims are returned differently depending on the values in `response_type` and the scopes requested:

    | Response Type      | Claims Returned in ID Token    | Claims Returned from the Userinfo Endpoint |
    |:-------------------|:-------------------|:-------------------------------------------------|
    | `code `            |  N/A               | N/A                                              |
    | `token`            |  N/A               | N/A                                              |
    | `id_token`         |  Claims associated with requested scopes. | N/A                       |
    | `id_token` `code ` |  Claims associated with requested scopes. | N/A                       |
    | `id_token` `token` | `email` if email scope is requested; `name` and `preferred_username` if profile scope is requested | Claims associated with the requested scopes |
    | `code` `id_token` `token` | `email` if email scope is requested; `name` and `preferred_username` if profile scope is requested | Claims associated with the requested scopes |

* The full set of claims for the requested scopes is available via the [/oauth2/v1/userinfo](#get-user-information) endpoint. Call this endpoint using the Access Token.

## Endpoints

Both the Access Token and the ID Token are acquired via [OAuth 2.0](oauth2.html) endpoints.

>The OIDC Access Token is applicable only for the Okta `/oauth2/v1/userinfo` endpoint and thus should be treated as opaque by the application. The application does not need to validate it since it should not be used against other resource servers. The format of it and the key used to sign it are subject to change without prior notice.

### Get User Information
{:.api .api-operation}

{% api_operation get /oauth2/v1/userinfo %}
{% api_operation post /oauth2/v1/userinfo %}

You must include the `access_token` returned from the [/oauth2/v1/authorize](oauth2.html#authentication-request) endpoint as an authorization header parameter.

This endpoint complies with the [OIDC userinfo spec](http://openid.net/specs/openid-connect-core-1_0.html#UserInfo).

#### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Authorization: Bearer <access_token>" \
"https://${org}.okta.com/oauth2/v1/userinfo"
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
  "profile":"http://profile.wordpress.com/john.doe",
  "zoneinfo":"America/Los_Angeles",
  "locale":"en-US",
  "updated_at":1311280970,
  "email":"john.doe@example.com",
  "email_verified":true,
  "address" : { "street_address": "123 Hollywood Blvd.", "locality": "Los Angeles", "region": "CA", "postal_code": "90210", "country": "US" },
  "phone_number":"+1 (425) 555-1212"
}
~~~

The claims in the response are identical to those returned for the requested scopes in the *id_token* JWT, except for the sub-claim which is always present.
See [Scope-Dependent Claims](#scope-dependent-claims-not-always-returned) for more information about individual claims.

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

You can pass ID Tokens around different components of your app, and these components can use ID Tokens as a lightweight authentication mechanism identifying the app and the user.
But before you can use the information in the ID Token or rely on it as an assertion that the user has authenticated, you must validate it to prove its integrity.

ID Tokens are sensitive and can be misused if intercepted. Transmit them only over HTTPS
and only via POST data or within request headers. If you store them on your server, you must store them securely.

Clients must validate the ID Token in the Token Response in the following manner:

1. Verify that the *iss* (issuer) claim in the ID Token exactly matches the issuer identifier for your Okta org (which is typically obtained during [Discovery](#openid-connect-discovery-document).
2. Verify that the *aud* (audience) claim contains the *client_id* of your app.
3. Verify the signature of the ID Token according to [JWS](https://tools.ietf.org/html/rfc7515) using the algorithm specified in the JWT *alg* header property. Use the public keys provided by Okta via the [Discovery Document](#openid-connect-discovery-document).
4. Verify that the expiry time (from the *exp* claim) has not already passed.
5. A *nonce* claim must be present and its value checked to verify that it is the same value as the one that was sent in the Authentication Request. The client should check the nonce value for replay attacks.
6. The client should check the *auth_time* claim value and request re-authentication using the *prompt=login* parameter if it determines too much time has elapsed since the last end-user authentication.

Step 3 involves downloading the public JWKS from Okta (specified by the *jwks_uri* property in the [discovery document](#openid-connect-discovery-document). The result of this call is a [JSON Web Key](https://tools.ietf.org/html/rfc7517) set.

Each public key is identified by a *kid* attribute, which corresponds with the *kid* claim in the [ID Token header](#claims-in-the-header-section).

Please note the following:

* For security purposes, Okta automatically rotates keys used to sign the token.
* The current key rotation schedule is four times a year. This schedule can change without notice.
* In case of an emergency, Okta can rotate keys as needed.
* Okta always publishes keys to the JWKS.
* If your app follows the best practice to always resolve the *kid*, key rotations won't cause problems.
* If you download the key and store it locally, **you are responsible for updates**.

>Keys used to sign tokens automatically rotate and should always be resolved dynamically against the published JWKS. Your app might fail if you hardcode public keys in your applications. Be sure to include key rollover in your implementation.

>If your application cannot retrieve keys dynamically, the administrator can disable the automatic key rotation in the administration UI, [generate a key credential](apps.html#generate-new-application-key-credential) and [update the application](apps.html#update-key-credential-for-application) to use it for signing.

### Introspection Request
{:.api .api-operation}

{% api_operation post /oauth2/v1/introspect %}

The API takes an Access Token or Refresh Token, and returns a boolean indicating whether it is active or not.
If the token is active, additional data about the token is also returned. If the token is invalid, expired, or revoked, it is considered inactive.
An implicit client can only introspect its own tokens, while a confidential client may inspect all access tokens.

> Note; [ID Tokens](oidc.html#id-token) are also valid, however, they are usually validated on the service provider or app side of a flow.

#### Request Parameters

The following parameters can be posted as a part of the URL-encoded form values to the API.

Parameter       | Description                                                                                         | Type       |
----------------+-----------------------------------------------------------------------------------------------------+------------|
token           | An access token, ID token, or refresh token.                                                                   | String     |
token_type_hint | A hint of the type of *token*.                                                               | String     |
client_id       | The client ID generated as a part of client registration. This is used in conjunction with the *client_secret* parameter to authenticate the client application. | String |
client_secret   | The client secret generated as a part of client registration. This is used in conjunction with the *client_id* parameter to authenticate the client application. | String |

##### Token Authentication Methods

The client can authenticate by providing *client_id* and *client_secret* as a part of the URL-encoded form parameters (as described in table above),
or it can use basic authentication by providing the *client_id* and *client_secret* as an Authorization header using the Basic auth scheme.
Use one authentication mechanism with a given request. Using both returns an error.

For authentication with Basic auth, an HTTP header with the following format must be provided with the POST request.

~~~sh
Authorization: Basic ${Base64(<client_id>:<client_secret>)}
~~~

#### Response Parameters

Based on the type of token and whether it is active or not, the returned JSON contains a different set of information. Besides the claims in the token, the possible top-level members include:

Parameter   | Description                                                                                         | Type       |
------------+-----------------------------------------------------------------------------------------------------+------------|
active      | An access token or refresh token.                                                                   | boolean    |
token_type  | The type of the token. The value is always `Bearer`.                                                | String     |
scope       | A space-delimited list of scopes.                                                                   | String     |
client_id   | The ID of the client associated with the token.                                                     | String     |
username    | The username associated with the token.                                                             | String     |
exp         | The expiration time of the token in seconds since January 1, 1970 UTC.                              | long       |
iat         | The issuing time of the token in seconds since January 1, 1970 UTC.                                 | long       |
nbf         | A timestamp in seconds since January 1, 1970 UTC when this token is not be used before.             | long       |
sub         | The subject of the token.                                                                           | String     |
aud         | The audience of the token.                                                                          | String     |
iss         | The issuer of the token.                                                                            | String     |
jti         | The identifier of the token.                                                                        | String     |
device_id   | The ID of the device associated with the token                                                      | String     |
uid         | The user ID. This parameter is returned only if the token is an access token and the subject is an end user.     | String     |

#### List of Errors

Error Id                |  Details                                                                                                     |
------------------------+--------------------------------------------------------------------------------------------------------------|
invalid_client          | The specified client id wasn't found. |
invalid_request         | The request structure was invalid. E.g. the basic authentication header was malformed, or both header and form parameters were used for authentication or no authentication information was provided. |

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
    "aud" : "http://api.example.com",
    "iss" : "https://your-org.okta.com/oauth2/orsmsg0aWLdnF3spV0g3",
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

#### Request Parameters

The following parameters can be posted as a part of the URL-encoded form values to the API.

Parameter       | Description                                                                                         | Type       |
----------------+-----------------------------------------------------------------------------------------------------+------------|
token           | An access token or refresh token.                                                                   | String     |
token_type_hint | A hint of the type of *token*.                                                               | String     |
client_id       | The client ID generated as a part of client registration. This is used in conjunction with the *client_secret* parameter to authenticate the client application. | String |
client_secret   | The client secret generated as a part of client registration. This is used in conjunction with the *client_id* parameter to authenticate the client application. | String |

##### Token Authentication Methods

A client may only revoke a token generated for that client.

The client can authenticate by providing *client_id* and *client_secret* as a part of the URL-encoded form parameters (as described in table above),
or it can use basic authentication by providing the *client_id* and *client_secret* as an Authorization header using the Basic auth scheme.
Use one authentication mechanism with a given request. Using both returns an error.

For authentication with Basic auth, an HTTP header with the following format must be provided with the POST request.

~~~sh
Authorization: Basic ${Base64(<client_id>:<client_secret>)}
~~~

#### Response Parameters

A successful revocation is denoted by an empty response with an HTTP 200. Note that revoking an invalid, expired, or revoked token will still be considered a success as to not leak information

#### List of Errors

Error Id                |  Details                                                                                                     |
------------------------+--------------------------------------------------------------------------------------------------------------|
invalid_client          | The specified client id wasn't found. |
invalid_request         | The request structure was invalid. E.g. the basic authentication header was malformed, or both header and form parameters were used for authentication or no authentication information was provided. |

#### Response Example (Success)

~~~http
HTTP/1.1 204 No Content
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

If automatic key rotation is disabled, provide the *client_id* to fetch public keys for your app. Otherwise, this endpoint returns the public keys automatically rotated.

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter         | Description                                                                                        | Param Type | DataType  | Required | Default         |
----------------- | -------------------------------------------------------------------------------------------------- | ---------- | --------- | -------- | --------------- |
client_id         | Your app's client ID. | Query      | String    | FALSE    | null |

#### Response Example
{:.api .api-response .api-response-example}

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
It is safe to cache or persist downloaded keys for performance.
However, if the client application is pinned to a signing key, the verification might fail since Okta rotates the key automatically.
Pinned client applications must periodically check the Okta signing keys.

Any of the two or three keys listed are used to sign tokens.The order of keys in the result doesn't indicate which keys are used.

Standard open-source libraries are available for every major language to perform [JWS](https://tools.ietf.org/html/rfc7515) signature validation.

#### Alternative Validation

You can use an [introspection request](#introspection-request) for validation.

### OpenID Connect Discovery Document
{:.api .api-operation}

{% api_operation get /.well-known/openid-configuration %}

This API endpoint returns metadata related to OpenID Connect that can be used by clients to programmatically configure their interactions with Okta.
This API doesn't require any authentication and returns a JSON object with the following structure.

~~~json
{
    "issuer": "https://${org}.okta.com",
    "authorization_endpoint": "https://${org}.okta.com/oauth2/v1/authorize",
    "token_endpoint": "https://${org}.okta.com/oauth2/v1/token",
    "userinfo_endpoint": "https://${org}.okta.com/oauth2/v1/userinfo",
    "jwks_uri": "https://${org}.okta.com/oauth2/v1/keys",
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
    "introspection_endpoint": "https://${org}.okta.com/oauth2/v1/introspect",
    "introspection_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "none"
    ],
    "revocation_endpoint": "https://${org}.okta.com/oauth2/v1/revoke",
    "revocation_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "none"
    ]
}
~~~

### Authentication Request
{:.api .api-operation}

{% api_operation get /oauth2/v1/authorize %}

This is a starting point for OpenID Connect flows such as implicit and authorization code flows. This request authenticates the user and returns tokens along with an authorization grant to the client application as a part of the response the client might have requested.

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter         | Description                                                                                        | Param Type | DataType  | Required | Default         |
----------------- | -------------------------------------------------------------------------------------------------- | ---------- | --------- | -------- | --------------- |
[idp](idps.html)  | The Identity provider used to do the authentication. If omitted, use Okta as the identity provider. | Query      | String    | FALSE    | Okta is the IDP. |
sessionToken      | An Okta one-time sessionToken. This allows an API-based user login flow (rather than Okta login UI). Session tokens can be obtained via the [Authentication API](authn.html).   | Query | String    | FALSE | |
response_type     | Can be a combination of *code*, *token*, and *id_token*. The chosen combination determines which flow is used; see this reference from the [OIDC specification](http://openid.net/specs/openid-connect-core-1_0.html#Authentication). The code response type returns an authorization code which can be later exchanged for an Access Token or a Refresh Token. | Query        | String   |   TRUE   |  |
client_id         | Obtained during either [UI client registration](../../guides/social_authentication.html) or [API client registration](oauth-clients.html). It is the identifier for the client and it must match what is preregistered in Okta. | Query        | String   | TRUE     |
redirect_uri      | Specifies the callback location where the authorization code should be sent and it must match what is preregistered in Okta as a part of client registration. | Query        | String   |  TRUE    |
display           | Specifies how to display the authentication and consent UI. Valid values: *page* or *popup*.  | Query        | String   | FALSE     |  |
max_age           | Specifies the allowable elapsed time, in seconds, since the last time the end user was actively authenticated by Okta. | Query      | String    | FALSE    | |
response_mode     | Specifies how the authorization response should be returned. [Valid values: *fragment*, *form_post*, *query* or *okta_post_message*](#parameter-details). If *id_token* or *token* is specified as the response type, then *query* isn't allowed as a response mode. Defaults to *fragment* in implicit and hybrid flow. Defaults to *query* in authorization code flow and cannot be set as *okta_post_message*. | Query        | String   | FALSE      | See Description.
scope          | **Required.** Can be a combination of reserved scopes and custom scopes. The combination determines the claims that are returned in the access_token and id_token. The openid scope has to be specified to get back an id_token. | Query        | String   | TRUE     |
state          | A client application provided state string that might be useful to the application upon receipt of the response. It can contain alphanumeric, comma, period, underscore and hyphen characters.   | Query        | String   |  TRUE    |
prompt         | Can be either *none* or *login*. The value determines if Okta should not prompt for authentication (if needed), or force a prompt (even if the user had an existing session). Default: The default behavior is based on whether there's an existing Okta session. | Query        | String   | FALSE     | See Description.
nonce          | Specifies a nonce that is reflected back in the ID Token. It is used to mitigate replay attacks. | Query        | String   | TRUE     |
code_challenge | Specifies a challenge of [PKCE](#parameter-details). The challenge is verified in the Access Token request.  | Query        | String   | FALSE    |
code_challenge_method | Specifies the method that was used to derive the code challenge. Only S256 is supported.  | Query        | String   | FALSE    |

#### Parameter Details

 * *idp* and *sessionToken* are Okta extensions to [the OpenID specification](http://openid.net/specs/openid-connect-core-1_0.html#Authentication).
    All other parameters comply with the OpenID Connect specification and their behavior is consistent with the specification.
 * Each value for *response_mode* delivers different behavior:
    * *fragment* -- Parameters are encoded in the URL fragment added to the *redirect_uri* when redirecting back to the client.
    * *query* -- Parameters are encoded in the query string added to the *redirect_uri* when redirecting back to the client.
    * *form_post* -- Parameters are encoded as HTML form values that are auto-submitted in the User Agent.Thus, the values are transmitted via the HTTP POST method to the client
      and the result parameters are encoded in the body using the application/x-www-form-urlencoded format.
    * *okta_post_message* -- Uses [HTML5 Web Messaging](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) (for example, window.postMessage()) instead of the redirect for the authorization response from the authorization endpoint.
      *okta_post_message* is an adaptation of the [Web Message Response Mode](https://tools.ietf.org/html/draft-sakimura-oauth-wmrm-00#section-4.1).
      This value provides a secure way for a single-page application to perform a sign-in flow
      in a popup window or an iFrame and receive the ID token and/or access token back in the parent page without leaving the context of that page.
      The data model for the [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) call is in the next section.

 * Okta requires the OAuth 2.0 *state* parameter on all requests to the authorization endpoint in order to prevent cross-site request forgery (CSRF).
 The OAuth 2.0 specification [requires](https://tools.ietf.org/html/rfc6749#section-10.12) that clients protect their redirect URIs against CSRF by sending a value in the authorize request which binds the request to the user-agent's authenticated state.
 Using the *state* parameter is also a countermeasure to several other known attacks as outlined in [OAuth 2.0 Threat Model and Security Considerations](https://tools.ietf.org/html/rfc6819).

 * [Proof Key for Code Exchange](https://tools.ietf.org/html/rfc7636) (PKCE) is a stronger mechanism for binding the authorization code to the client than just a client secret, and prevents [a code interception attack](https://tools.ietf.org/html/rfc7636#section-1) if both the code and the client credentials are intercepted (which can happen on mobile/native devices). The PKCE-enabled client creates a large random string as code_verifier and derives code_challenge from it using code_challenge_method. It passes the code_challenge and code_challenge_method in the authorization request for code flow. When a client tries to redeem the code, it must pass the code_verifer. Okta recomputes the challenge and returns the requested token only if it matches the code_challenge in the original authorization request. When a client, whose token_endpoint_auth_method is 'none', makes a code flow authorization request, the code_challenge parameter is required.

#### postMessage() Data Model

Use the postMessage() data model to help you when working with the *okta_post_message* value of the *response_mode* request parameter.

*message*:

Parameter         | Description                                                                                        | DataType  |
----------------- | -------------------------------------------------------------------------------------------------- | ----------|
id_token          | The ID Token JWT contains the details of the authentication event and the claims corresponding to the requested scopes. This is returned if the `response_type` includes `id_token`. | String   |
access_token      | The *access_token* used to access the [`/oauth2/v1/userinfo`](/docs/api/resources/oidc.html#get-user-information) endpoint. This is returned if the *response_type* included a token. <b>Important</b>: Unlike the ID Token JWT, the *access_token* structure is specific to Okta, and is subject to change. | String    |
state             | If the request contained a `state` parameter, then the same unmodified value is returned back in the response. | String    |
error             | The error-code string providing information if anything goes wrong.                                | String    |
error_description | Additional description of the error.                                                               | String    |

*targetOrigin*:

Specifies what the origin of *parentWindow* must be in order for the postMessage() event to be dispatched
(this is enforced by the browser). The *okta-post-message* response mode always uses the origin from the *redirect_uri*
specified by the client. This is crucial to prevent the sensitive token data from being exposed to a malicious site.

#### Response Parameters

The response depends on the response type passed to the API. For example, a *fragment* response mode returns values in the fragment portion of a redirect to the specified *redirect_uri* while a *form_post* response mode POSTs the return values to the redirect URI.
Irrespective of the response type, the contents of the response is always one of the following.

Parameter         | Description                                                                                        | DataType  |
----------------- | -------------------------------------------------------------------------------------------------- | ----------|
id_token          | The ID Token JWT contains the details of the authentication event and the claims corresponding to the requested scopes. This is returned if the *response_type* includes *id_token*.| String    |
access_token      | The *access_token* that is used to access the [`/oauth2/v1/userinfo`](/docs/api/resources/oidc.html#get-user-information) endpoint. This is returned if the *response_type* included a token. Unlike the ID Token JWT, the *access_token* structure is specific to Okta, and is subject to change.| String  |
token_type        | The token type is always `Bearer` and is returned only when *token* is specified as a *response_type*. | String |
code              | An opaque value that can be used to redeem tokens from [token endpoint](#token-request).| String    |
expires_in        | The number of seconds until the *access_token* expires. This is only returned if the response included an *access_token*. | String |
scope             | The scopes of the *access_token*. This is only returned if the response included an *access_token*. | String |
state             | The same unmodified value from the request is returned back in the response. | String |
error             | The error-code string providing information if anything went wrong. | String |
error_description | Further description of the error. | String |

##### Possible Errors

These APIs are compliant with the OpenID Connect and OAuth 2.0 spec with some Okta specific extensions.

[OAuth 2.0 Spec error codes](https://tools.ietf.org/html/rfc6749#section-4.1.2.1)

Error Id         | Details                                                                |
-----------------| -----------------------------------------------------------------------|
unsupported_response_type  | The specified response type is invalid or unsupported.   |
unsupported_response_mode  | The specified response mode is invalid or unsupported. This error is also thrown for disallowed response modes. For example, if the query response mode is specified for a response type that includes id_token.    |
invalid_scope   | The scopes list contains an invalid or unsupported value.    |
server_error    | The server encountered an internal error.    |
temporarily_unavailable    | The server is temporarily unavailable, but should be able to process the request at a later time.    |
invalid_request | The request is missing a necessary parameter or the parameter has an invalid value. |
invalid_grant   | The specified grant is invalid, expired, revoked, or does not match the redirect URI used in the authorization request.
invalid_token   | The provided access token is invalid.
invalid_client  | The specified client id is invalid.
access_denied   | The server denied the request.

[Open-ID Spec error codes](http://openid.net/specs/openid-connect-core-1_0.html#AuthError)

Error Id           | Details                                                                |
-------------------| -----------------------------------------------------------------------|
login_required     | The request specified that no prompt should be shown but the user is currently not authenticated.    |
insufficient_scope | The access token provided does not contain the necessary scopes to access the resource.              |

#### Response Example (Success)

The request is made with a *fragment* response mode.

~~~
http://www.example.com/#
id_token=eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwMHVpZDRCeFh3Nkk2VFY0bTBnMyIsImVtYWlsIjoid2VibWFzdGVyQGNsb3VkaXR1ZG
UubmV0IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInZlciI6MSwiaXNzIjoiaHR0cDovL3JhaW4ub2t0YTEuY29tOjE4MDIiLCJsb2dpbiI6ImFkbWluaXN
0cmF0b3IxQGNsb3VkaXR1ZGUubmV0IiwiYXVkIjoidUFhdW5vZldrYURKeHVrQ0ZlQngiLCJpYXQiOjE0NDk2MjQwMjYsImV4cCI6MTQ0OTYyNzYyNiwi
YW1yIjpbInB3ZCJdLCJqdGkiOiI0ZUFXSk9DTUIzU1g4WGV3RGZWUiIsImF1dGhfdGltZSI6MTQ0OTYyNDAyNiwiYXRfaGFzaCI6ImNwcUtmZFFBNWVIO
DkxRmY1b0pyX1EifQ.Btw6bUbZhRa89DsBb8KmL9rfhku--_mbNC2pgC8yu8obJnwO12nFBepui9KzbpJhGM91PqJwi_AylE6rp-ehamfnUAO4JL14Pke
mF45Pn3u_6KKwxJnxcWxLvMuuisnvIs7NScKpOAab6ayZU0VL8W6XAijQmnYTtMWQfSuaaR8rYOaWHrffh3OypvDdrQuYacbkT0csxdrayXfBG3UF5-ZA
lhfch1fhFT3yZFdWwzkSDc0BGygfiFyNhCezfyT454wbciSZgrA9ROeHkfPCaX7KCFO8GgQEkGRoQntFBNjluFhNLJIUkEFovEDlfuB4tv_M8BM75celd
y3jkpOurg
&access_token=eyJhbGciOiJSUzI1NiJ9.eyJ2ZXIiOjEsImlzcyI6Imh0dHA6Ly9yYWluLm9rdGExLmNvbToxODAyIiwiaWF0
IjoxNDQ5NjI0MDI2LCJleHAiOjE0NDk2Mjc2MjYsImp0aSI6IlVmU0lURzZCVVNfdHA3N21BTjJxIiwic2NvcGVzIjpbIm9wZW5pZCIsImVtYWlsIl0sI
mNsaWVudF9pZCI6InVBYXVub2ZXa2FESnh1a0NGZUJ4IiwidXNlcl9pZCI6IjAwdWlkNEJ4WHc2STZUVjRtMGczIn0.HaBu5oQxdVCIvea88HPgr2O5ev
qZlCT4UXH4UKhJnZ5px-ArNRqwhxXWhHJisslswjPpMkx1IgrudQIjzGYbtLFjrrg2ueiU5-YfmKuJuD6O2yPWGTsV7X6i7ABT6P-t8PRz_RNbk-U1GXW
IEkNnEWbPqYDAm_Ofh7iW0Y8WDA5ez1jbtMvd-oXMvJLctRiACrTMLJQ2e5HkbUFxgXQ_rFPNHJbNSUBDLqdi2rg_ND64DLRlXRY7hupNsvWGo0gF4WEU
k8IZeaLjKw8UoIs-ETEwJlAMcvkhoVVOsN5dPAaEKvbyvPC1hUGXb4uuThlwdD3ECJrtwgKqLqcWonNtiw
&token_type=Bearer&expires_in=3600&scope=openid+email&state=waojafoawjgvbf
~~~

#### Response Example (Error)

The requested scope is invalid:

~~~
http://www.example.com/#error=invalid_scope&error_description=The+requested+scope+is+invalid%2C+unknown%2C+or+malformed
~~~

### Token Request
{:.api .api-operation}

{% api_operation post /oauth2/v1/token %}

The API takes a grant type of either *authorization_code*, *password*, *refresh_token*, or *client_credentials* {% api_lifecycle beta %} and the corresponding credentials and returns back an Access Token. A Refresh Token will be returned if *offline_access* scope is requested using authorization_code, password, or refresh_token grant type. Additionally, using the authorization_code grant type will return an ID Token if the *openid* scope is requested.

> Note:  No errors occur if you use this endpoint, but it isn’t useful until custom scopes or resource servers are available. We recommend you wait until custom scopes and resource servers are available.

#### Request Parameters

The following parameters can be posted as a part of the URL-encoded form values to the API.

Parameter          | Description                                                                                         | Type       |
-------------------|-----------------------------------------------------------------------------------------------------|------------|
grant_type         | Can be one of the following: *authorization_code*, *password*, *refresh_token*, or [*client_credentials* {% api_lifecycle beta %}](/docs/api/getting_started/releases-at-okta.html). Determines the mechanism Okta will use to authorize the creation of the tokens. | String |
code               | Expected if grant_type specified *authorization_code*. The value is what was returned from the [authorization endpoint](#authentication-request). | String
refresh_token      | Expected if the grant_type specified *refresh_token*. The value is what was returned from this endpoint via a previous invocation. | String |
username           | Expected if the grant_type specified *password*. | String |
password           | Expected if the grant_type specified *password*. | String |
scope              | Optional if *refresh_token*, or *password* is specified as the grant type. This is a list of scopes that the client wants to be included in the Access Token. For the *refresh_token* grant type, these scopes have to be subset of the scopes used to generate the Refresh Token in the first place. | String |
redirect_uri       | Expected if grant_type is *authorization_code*. Specifies the callback location where the authorization was sent; must match what is preregistered in Okta for this client. | String |
code_verifier      | The code verifier of [PKCE](#parameter-details). Okta uses it to recompute the code_challenge and verify if it matches the original code_challenge in the authorization request. | String |

> The [Client Credentials](https://tools.ietf.org/html/rfc6749#section-4.4) flow (if `grant_types` is `client_credentials`) is a {% api_lifecycle beta %} feature.


##### Token Authentication Method

The client can authenticate by providing the [`client_id`](oidc.html#request-parameters)
and [`client_secret`](https://support.okta.com/help/articles/Knowledge_Article/Using-OpenID-Connect) as an Authorization header in the Basic auth scheme (basic authentication).

For authentication with Basic auth, an HTTP header with the following format must be provided with the POST request.

~~~sh
Authorization: Basic ${Base64(<client_id>:<client_secret>)}
~~~

#### Response Parameters

Based on the grant type, the returned JSON can contain a different set of tokens.

Input grant type   | Output token types                    |
-------------------|---------------------------------------|
authorization_code | Access Token, Refresh Token, ID Token |
refresh_token      | Access Token, Refresh Token           |
password           | Access Token, Refresh Token           |
client_credentials | Access Token                          |


##### Refresh Tokens for Web and Native Applications

For web and native application types, an additional process is required:

1. Use the Okta Administration UI and check the **Refresh Token** checkbox under **Allowed Grant Types** on the client application page.
2. Pass the *offline_access* scope to your authorize request.

#### List of Errors

Error Id                |  Details                                                                                                     |
------------------------+--------------------------------------------------------------------------------------------------------------|
invalid_client          | The specified client id wasn't found. |
invalid_request         | The request structure was invalid. E.g. the basic authentication header was malformed, or both header and form parameters were used for authentication or no authentication information was provided. |
invalid_grant           | The *code* or *refresh_token* value was invalid, or the *redirect_uri* does not match the one used in the authorization request. |
unsupported_grant_type  | The grant_type was not *authorization_code* or *refresh_token*. |
invalid_scope           | The scopes list contains an invalid or unsupported value.    |

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



