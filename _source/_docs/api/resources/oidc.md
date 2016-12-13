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

<span class="api-uri-template api-uri-get"><span class="api-label">GET, POST</span> /oauth2/v1/userinfo</span>

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

You can pass ID Tokens around different components of your app, and these components can use it as a lightweight authentication mechanism identifying the app and the user.
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

The ID Token is signed by an RSA private key, and we publish the future signing key well in advance.
However, in an emergency situation you can still stay in sync with Okta's key rotation. Have your application check the `kid`, and if it has changed, 
check the `jwks_uri` value in the [well-known configuration](#openid-connect-discovery-document) for a new public key and `kid`.

Please note the following:

* For security purposes, Okta automatically rotates keys used to sign the token.
* The current key rotation schedule is four times a year. This schedule can change without notice.
* In case of an emergency, Okta can rotate keys as needed.
* Okta always publishes keys to the JWKS.
* If your app follows the best practice to always resolve the *kid*, key rotations won't cause problems.
* If you download the key and store it locally, **you are responsible for updates**.

>Keys used to sign tokens automatically rotate and should always be resolved dynamically against the published JWKS. Your app might fail if you hardcode public keys in your applications. Be sure to include key rollover in your implementation.

>If your application cannot retrieve keys dynamically, the administrator can disable the automatic key rotation in the administration UI, [generate a key credential](apps.html#generate-new-application-key-credential) and [update the application](apps.html#update-key-credential-for-application) to use it for signing.

### Get Keys
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /oauth2/v1/keys</span>

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

You can use an [OAuth 2.0 introspection request](/docs/api/resources/oauth2.html#introspection-request) for validation.

### OpenID Connect Discovery Document
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /.well-known/openid-configuration</span>

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

For more information about *authorization_endpoint* and *token_endpoint*:

* [/oauth2/v1/authorize](oauth2.html#authentication-request)
* [/oauth2/v1/token](oauth2.html#token-request)
