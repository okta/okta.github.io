---
layout: docs_page
title: OpenID Connect
---

# Overview

The OpenID Connect API endpoints enable clients to use [OIDC workflows](http://openid.net/specs/openid-connect-core-1_0.html) with Okta.

With OpenID Connect and Okta, a client can use Okta as a broker when the user authenticates against identity providers like Google, Facebook, LinkedIn, and Microsoft,
and the client returns an Okta session.

> This API is currently in **Early Access** status.  It has been tested as thoroughly as a Generally Available feature. Contact Support to enable this feature.

## ID Token

OpenID Connect introduces an [ID Token](http://openid.net/specs/openid-connect-core-1_0.html#IDToken) 
which is a [JSON web token (JWT)](https://tools.ietf.org/html/rfc7519) that contains information about an authentication event 
as well as claims about the authenticated user.

ID Tokens should always be [validated](#validating-id-tokens) by the client to ensure their integrity.

The ID Token (`id_token`) consists of three period-separated, base64URL-encoded JSON segments: [a header](#header), [the payload](#payload), and [the signature](#signature). 

###Header

~~~json
{
  "alg": "RS256",
  "kid": "45js03w0djwedsw"
}
~~~

###Payload

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

###Signature

This is the digital signature that Okta signs, using the public key identified by the `kid` property in the header section.

###ID Token Claims

The header and payload sections contain claims.

####Claims in the header section

Claims in the header are always returned.

|--------------+-----------------------------------------------------------------------------------------------------+--------------|--------------------------|
| Property     | Description                                                                      | DataType     | Example                  |
|--------------+---------+--------------------------------------------------------------------------------------------+--------------|--------------------------|
| alg          | Identifies the digital signature algorithm used. This is always be RS256.      | String       | "RS256"                  |
| kid          | Identifies the `public-key` used to sign the `id_token`. The corresponding `public-key` can be found as a part of the [well-known configuration's](#openid-connect-metadata) `jwks_uri` value.                                  | String       | "a5dfwef1a-0ead3f5223_w1e" |

####Claims in the payload section

Claims in the payload are independent of scope (always returned) or dependent on scope (not always returned).

#####Scope-independent claims (always returned)
 
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
| c_hash  | The base64URL-encoded first 128-bits of the SHA-256 hash of the authorization code. This is only returned if an authorization code is also returned with the id_token. | String |    |
           
#####Scope-dependent claims (not always returned)

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
| email     |  email   | User's preferred e-mail address. The resource provider must <em>not</em> rely upon this value being unique.   | String    | "john.doe@example.com"     |
| email_verified     |  email   | True if the user's e-mail address has been verified; otherwise false.   | boolean    | true     |
| address     | address    | User's preferred postal address. The value of the address member is a JSON structure containing <em>street_address</em>, <em>locality</em>, <em>region</em>, <em>postal_code</em>, and <em>country</em>.   | JSON structure    | { "street_address": "123 Hollywood Blvd.", "locality": "Los Angeles", "region": "CA", "postal_code": "90210", "country": "US" }     |
| phone_number     |  phone   | User's preferred telephone number in E.164 format.   | String    | 	"+1 (425) 555-1212"     |

>The client can also optionally request an Access Token along with the ID Token. In this case, in order to keep the size of the ID Token small, the ID Token body does not contain all the scope dependent claims. 
Instead, the ID token contains the `name` and `preferred_username` claims if the `profile` scope was requested and `email` claim if the `email` scope was requested.

>The full set of claims for the requested scopes is available via the [/oauth2/v1/userinfo](#get-user-information) endpoint. Call this endpoint using the Access Token.

##Endpoints

Both the Access Token and the ID Token are acquired via [OAuth 2.0](oauth2.html) endpoints.

###Get User Information
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET, POST</span> /oauth2/v1/userinfo</span>

You must include the `access_token` returned from the [/oauth2/v1/authorize](oauth2.html#authentication-request) endpoint as an authorization header parameter.

This endpoint complies with the [OIDC userinfo spec](http://openid.net/specs/openid-connect-core-1_0.html#UserInfo).

####Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Authorization: Bearer <access_token>" \
"https://${org}.okta.com/oauth2/v1/userinfo"
~~~

####Response Parameters
{:.api .api-response .api-response-example}

Returns a JSON document with information requested in the scopes list of the token.

####Response Example (Success)
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

The claims in the response are identical to those returned for the requested scopes in the `id_token` JWT, except for the sub-claim which is always present. 
See [Scope-Dependent Claims](#scope-dependent-claims) for more information about individual claims.

####Response Example (Error)

~~~http
HTTP/1.1 401 Unauthorized​
Cache-Control: no-cache, no-store​
Pragma: no-cache​
Expires: 0​
WWW-Authenticate: Bearer error="invalid_token", error_description="The access token is invalid"​
~~~

####Response Example (Error)

~~~http
HTTP/1.1 403 Forbidden​
Cache-Control: no-cache, no-store​
Pragma: no-cache​
Expires: 0​
WWW-Authenticate: Bearer error="insufficient_scope", error_description="The access token must provide access to at least one of these scopes - profile, email, address or phone"
~~~

###Validating ID Tokens

You can pass ID Tokens around different components of your app, and these components can use it as a lightweight authentication mechanism identifying the app and the user.
But before you can use the information in the ID Token or rely on it as an assertion that the user has authenticated, you must validate it to prove its integrity.

ID Tokens are sensitive and can be misused if intercepted. Transmit them only over HTTPS
and only via POST data or within request headers. If you store them on your server, you must store them securely.

Clients MUST validate the ID Token in the Token Response in the following manner:

1. Verify that the `iss` (issuer) claim in the ID Token exactly matches the issuer identifier for your Okta org (which is typically obtained during [Discovery](#openid-discovery-document)). 
2. Verify that the `aud` (audience) claim contains the `client_id` of your app.
3. Verify the signature of the ID Token according to [JWS](https://tools.ietf.org/html/rfc7515) using the algorithm specified in the JWT `alg` header parameter. Use the public keys provided by Okta via the [Discovery Document](#openid-discovery-document).
4. Verify that the expiry time (from the `exp` claim) has not already passed.
5. A `nonce` claim must be present and its value checked to verify that it is the same value as the one that was sent in the Authentication Request. The client should check the nonce value for replay attacks.
6. The client should check the `auth_time` claim value and request re-authentication using the `prompt=login` parameter if it determines too much time has elapsed since the last end-user authentication.

Step 3 involves downloading the public JWKS from Okta (specified by the `jwks_uri` attribute in the [discovery document](#opendid-discovery-document)). The result of this call is a [JSON Web Key](https://tools.ietf.org/html/rfc7517) set.

Each public key is identified by a `kid` attribute, which corresponds with the `kid` claim in the [ID Token header](#claims-in-the-header-section).

The ID Token and the access token are signed by an RSA private key. Okta publishes the corresponding public key and adds a public-key identifier `kid` in the ID Token header. To minimize the effects of key rotation, your application should check the `kid`, and if it has changed, check the `jwks_uri` value in the [well-known configuration](#openid-connect-metadata) for a new public key and `kid`. 

All apps must roll over keys for adequate security. Please note the following:

* For security purposes, Okta automatically rotates keys used to sign the token.
* The current key rotation schedule is at least twice a year. This schedule can change without notice.
* In case of an emergency, Okta can rotate keys as needed.
* Okta always publishes keys to the JWKS.
* If your app follows the best practice to always resolve the `kid`, key rotations will not cause problems.
* If you download the key and store it locally, **you are responsible for updates**.

>Keys used to sign tokens automatically rotate and should always be resolved dynamically against the published JWKS. Your app might break if you hardcode public keys in your applications! Be sure to include key rollover in your implementation.



<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /oauth2/v1/keys</span>

~~~json
{
  "keys": [
    {
      "kid": "DS7gC_ljzzhv2cP1adQ7F26kvVRi3IGeo3PP9PPxoo"
      "alg": "RS256",
      "e": "AQAB",
      "n": "paDgqMZdppjqc2-Q1jvcJmUPvQ6Uwz1IofmuyTxh2C4OBXsAF0Szk_Y0jOa6pTWJAgbHF5bxkFbH11isA9WpNbuPa-CprC6gTfmpb
            AbwYDYi1awsVdpiLeGKYMcw14LXO2NojGENFE4N8O3kIwrhVk6b2d5RLNYvEQKVix6APZkK_flLFY-AOmWdf24BLksLlikzbyDm_r
            6tSiNQdxqfGejZHLtsZ9ZcDwOQDp-zr8l5QvSdLFtkiu6AQxALUvtC05kpkQogI3hHsMN7QMFqMw55EVSWOhCK774Mov_gsh34YCl
            o64Qn_2GV4GGXuEAKfvCAYVBOyN-RWBHQV0qyIw",
      "kty": "RSA",
      "use": "sig",
      "x5c": [
        "MIIDnDCCAoSgAwIBAgIGAUsU5Y67MA0GCSqGSIb3DQEBBQUAMIGOMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA
         1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxDzANBgNVBAMMBnRyZXZvcjEcMBoGCS
         qGSIb3DQEJARYNaW5mb0Bva3RhLmNvbTAeFw0xNTAxMjMwMzQ1MDNaFw00NTAxMjMwMzQ2MDNaMIGOMQswCQYDVQQGEwJVUzETMBEGA1U
         ECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxDzAN
         BgNVBAMMBnRyZXZvcjEcMBoGCSqGSIb3DQEJARYNaW5mb0Bva3RhLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKWg4
         KjGXaaY6nNvkNY73CZlD70OlMM9SKH5rsk8YdguDgV7ABdEs5P2NIzmuqU1iQIGxxeW8ZBWx9dYrAPVqTW7j2vgqawuoE35qWwG8GA2It
         WsLFXaYi3himDHMNeC1ztjaIxhDRRODfDt5CMK4VZOm9neUSzWLxEClYsegD2ZCv35SxWPgDplnX9uAS5LC5YpM28g5v6+rUojUHcanxn
         o2Ry7bGfWXA8DkA6fs6/JeUL0nSxbZIrugEMQC1L7QtOZKZEKICN4R7DDe0DBajMOeRFUljoQiu++DKL/4LId+GApaOuEJ/9hleBhl7hA
         Cn7wgGFQTsjfkVgR0FdKsiMCAwEAATANBgkqhkiG9w0BAQUFAAOCAQEAF99tKM4+djEcF4hvQkFuNmILMzuqBFOBvqcZStR1IheHJ69es
         Nkw/QGFyhfVNgTvPf8BfY5A+sheFUDlDAXjWBeabaX1aUh1/Q6ac1izS2DzGT5O9Srs/c35ZGrsp4vwGeSfNzsMDhRV462ZMmKAmaIcjF
         5MiplHizNH/K1x+3uHuU6DPlIWsMDvjuGwTArM45hGRZlnxFCVSaGToNF0ppgOFjRkeng7Fm2sJkd8P1jezUGHFemuaBWv9wxIe5GlgH4
         00dEPsobfcjTc4AisxsHyUJwoxlmg9gZgjvUaSCpUMsPTOBhDIYaMKjTTY9Y68YMSg3+2tQ7hOVdiDk76rA=="
      ],
      "x5t": "3ov_aKYnBnqVGsC06S1KFV6OUl8"
    }
  ]
}
~~~

>Okta strongly recommends retrieving keys dynamically with the JWKS published in the discovery document. It is safe to cache or persist downloaded keys for performance, but if your application is pinned to a signing key, you must check the keys as Okta automatically rotates signing keys.

There are standard open-source libraries available for every major language to perform [JWS](https://tools.ietf.org/html/rfc7515) signature validation.

##OpenID Connect Discovery Document
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /.well-known/openid-configuration</span>

This API endpoint returns the OpenID Connect related metadata that can be used by clients to programmatically configure their interactions with Okta. 
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
        "code id_token token",
        "id_token",
        "id_token token",
        "token"
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
        "refresh_token"
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
        "phone"
    ],
    "token_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "none"
    ],
    "claims_supported": [
        "iss",
        "sub",
        "aud",
        "iat",
        "exp",
        "auth_time",
        "amr",
        "idp",
        "idp_type",
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
        "updated_at"
    ]
}
~~~

See the OAuth 2.0 reference topic for more information about `authorization_endpoint` and `token_endpoint`:

* [/oauth2/v1/authorize](oauth2.html#authentication-request)
* [/oauth2/v1/token](oauth2.html#token-request)