---
layout: docs_page
title: OpenID Connect and Okta
excerpt: This simple identity layer on top of the OAuth 2.0 protocol makes identity management easier.
icon: /assets/img/icons/openid.svg
redirect_from: /standards/
---

# OpenID Connect and Okta

OpenID Connect is a simple identity layer on top of the OAuth 2.0 protocol, which allows computing clients to verify the identity of an end user based on the authentication performed by an authorization server, as well as to obtain basic profile information about the end user in an interoperable manner.
In technical terms, OpenID Connect specifies a RESTful HTTP API, using JSON as a data format.

OpenID Connect allows a range of clients to request and receive information about authenticated sessions and end users, including
web-based clients, mobile apps, and JavaScript clients.
The [specification suite](http://openid.net/connect/) is extensible, supporting optional features such as encryption of identity data, discovery of OpenID Providers, and session management.

Okta is [certified for OpenID Connect](http://openid.net/certification/) for Basic, Implicit, Hybrid, and Publishing Configuration Information (Config OP).

## Authentication Basics with OAuth 2.0 and OpenID Connect

OAuth 2.0 is an authorization framework for delegated access to APIs, and OpenID Connect is an SSO protocol for authenticating end users and asserting their identity.
OpenID Connect extends OAuth 2.0:

* Provides a signed [*id_token*](#id-token) for the client and [a UserInfo endpoint](/docs/api/resources/oidc#openid-connect-discovery-document) from which you can retrieve user attributes.
* Provides access to the [Okta Authorization Server](#authorization-servers).
* Provides a standard set of scopes and claims for identities including profile, email, address, and phone.

{% img openID_overview.png alt:"OpenID Architecture Diagram" %}

Okta is the identity provider responsible for verifying the identity of users and applications that exist in an organization’s directory,
and issuing ID Tokens upon successful authentication of those users and applications.

The basic authentication flow with Okta as your identity provider:

1. The application sends a request to Okta.
2. Okta authenticates the client.
3. Okta authenticates the user.
4. Okta approves or denies the requested scopes.
5. Okta mints a token and sends it in the response.
6. The application validates the ID Token’s integrity. For more information, see [Validating ID Tokens](/docs/api/resources/oidc#validating-id-tokens).

> Important: Okta uses public key cryptography to sign tokens and verify that they are valid.
See the last section of [Validating ID Tokens](/docs/api/resources/oidc#validating-id-tokens) for more information on the necessary logic
you must have in your application to ensure it’s always updated with the latest keys.

## Authorization Servers

Okta provides two types of authorization servers:

* The Okta Authorization Server requires no configuration, and supports SSO use cases. 
* The Custom Authorization Server is configurable. It supports the use of OpenID Connect with Okta&#8217;s API Access Management,
an Okta feature that helps you secure access to your API.

## Dynamic Client Registration

Okta provides [dynamic client registration](/docs/api/resources/oauth-clients), operations to register and manage
client applications for use with Okta&#8217;s OAuth 2.0 and OpenID Connect endpoints.
You can also perform these operations in the [Apps API](/docs/api/resources/apps).

## Claims

Tokens issued by Okta contain claims, which are statements about a subject (user).
For example, the claim can be about a name, identity, key, group, or privilege.
The claims in a security token are dependent upon the type of token, the type of credential used to authenticate the user, and the application configuration.

The claims requested by the `profile`, `email`, `address`, and `phone` scope values are returned from the UserInfo Endpoint, as described in [the OpenID spec Section 5.3.2](http://openid.net/specs/openid-connect-core-1_0.html#UserInfoResponse), when a `response_type` value is used that results in an Access Token being issued. However, when no Access Token is issued (which is the case for the `response_type` value `id_token`), the resulting Claims are returned in the ID Token.

## Scopes

OpenID Connect uses scope values to specify what access privileges are being requested for Access Tokens.
The scopes associated with Access Tokens determine which claims are available when they are used
to access [the OIDC `userinfo` endpoint](/docs/api/resources/oidc#get-user-information). The following scopes are supported:

| -------------  | -------------------------------------------------------------------------------                               | -------------- |
| Property       | Description                                                                                                   | Required       |
|:---------------|:--------------------------------------------------------------------------------------------------------------|:---------------|
| openid         | Identifies the request as an OpenID Connect request.                                                          | Yes            |
| profile        | Requests access to the end user&#8217;s default profile claims.                                               | No             |
| email          | Requests access to the `email` and `email_verified` claims.                                                   | No             |
| phone          | Requests access to the `phone_number` and `phone_number_verified` claims.                                     | No             |
| address        | Requests access to the `address` claim.                                                                       | No             |
| groups         | Requests access to the `groups` claim.                                                                        | No             |
| offline_access | Requests a Refresh Token, used to obtain more access tokens without re-prompting the user for authentication. | No             |

### Scope Values

* `openid` is required for any OpenID request connect flow. If no openid scope value is present, the request may
  be a valid OAuth 2.0 request, but it&#8217;s not an OpenID Connect request.
* `profile` requests access to these default profile claims: `name`, `family_name`, `given_name`, `middle_name`, `nickname`, `preferred_username`, `profile`,  
`picture`, `website`, `gender`, `birthdate`, `zoneinfo`,`locale`, and `updated_at`.
* `offline_access` can only be requested in combination with a `response_type` containing `code`. If the `response_type` does not contain `code`, `offline_access` will be ignored.
* For more information about `offline_access`, see the [OIDC spec](http://openid.net/specs/openid-connect-core-1_0.html#OfflineAccess).

## ID Token

OpenID Connect introduces an [ID Token](http://openid.net/specs/openid-connect-core-1_0.html#IDToken)
which is a [JSON web token (JWT)](https://tools.ietf.org/html/rfc7519) that contains information about an authentication event
and claims about the authenticated user that clients can rely on.

Clients can use any of the following sequences of operations to obtain an ID Token:
* Basic, or [Authorization code flow](http://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth) -- the client obtains
an authorization code from the authorization server&#8217;s authentication endpoint and uses it to obtain an ID token and an access
token from the authorization server&#8217;s Token endpoint.
* [Implicit flow](http://openid.net/specs/openid-connect-core-1_0.html#ImplicitFlowAuth) -- the client obtains an ID
token and optionally an Access Token directly from the authorization server&#8217;s authentication endpoint.
* [Hybrid flow](http://openid.net/specs/openid-connect-core-1_0.html#HybridFlowAuth) -- a combination of the other
two flows.

Clients should always [validate ID Tokens](/docs/api/resources/oidc#validating-id-tokens) to ensure their integrity.

The ID Tokens returned by the authentication endpoint (implicit flow) or the Token endpoint (authorization code flow)
are identical, except that in the implicit flow, the *nonce* parameter is required (and hence must have been included
in the request), and the *at_hash* parameter is required if the response includes [an Access Token](/standards/OAuth/#access-token) but prohibited if the
response does not include an Access Token.

The ID Token (*id_token*) consists of three period-separated, base64URL-encoded JSON segments: [a header](#id-token-header), [the payload](#id-token-payload), and [the signature](#id-token-signature).

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
  "iss": "https:{myOktaDomain.com}",
  "aud": "uAaunofWkaDJxukCFeBx",
  "iat": 1449624026,
  "exp": 1449627626,
  "amr": [
    "pwd"
  ],
  "jti": "ID.4eAWJOCMB3SX8XewDfVR",
  "auth_time": 1449624026,
  "at_hash": "cpqKfdQA5eH891Ff5oJr_Q",
  "name" :"John Doe",
  "nickname":"Jimmy",
  "preferred_username": "john.doe@example.com",
  "given_name":"John",
  "middle_name":"James",
  "family_name":"Doe",
  "profile":"https://profile.wordpress.com/john.doe",
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

| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| ------------- | -------------------------- |
| Property      | Description                                                                                                                                                                                                  | DataType      | Example                    |
|:--------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------------|:---------------------------|
| alg           | Identifies the digital signature algorithm used. This is always be RS256.                                                                                                                                    | String        | "RS256"                    |
| kid           | Identifies the *public-key* used to verify the *id_token*. The corresponding *public-key* can be found as a part of the   [well-known configuration&#8217;s](/docs/api/resources/oidc#openid-connect-discovery-document) *jwks_uri* value.   | String        | "a5dfwef1a-0ead3f5223_w1e" |

#### Claims in the payload section

Claims in the payload are either base claims, independent of scope (always returned), or dependent on scope (not always returned).

##### Base claims (always present)

| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------   | --------- | --------------------------------------------------- |
| Property      | Description                                                                                                                                                                | DataType  | Example                                             |
|:--------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----------|:----------------------------------------------------|
| ver           | The semantic version of the ID Token.                                                                                                                                      | Integer   | 1                                                   |
| jti           | A unique identifier for this ID Token for debugging and revocation purposes.                                                                                               | String    | "Tlenfse93dgkaksginv"                               |
| iss           | The Issuer Identifier of the response.                                                                                                                                     | String    | "https://{yourOktaDomain}.com"                         |
| sub           | The subject. A unique identifier for the user.                                                                                                                             | String    | "00uk1u7AsAk6dZL3z0g3"                              |
| aud           | Identifies the audience that this ID Token is intended for. It must be one of the OAuth 2.0 client IDs of your application.                                                | String    | "6joRGIzNCaJfdCPzRjlh"                              |
| iat           | The time the ID Token was issued, represented in Unix time (seconds).                                                                                                      | Integer   | 1311280970                                          |
| exp           | The time the ID Token expires, represented in Unix time (seconds).                                                                                                         | Integer   | 1311280970                                          |
| auth_time     | The time the end user was authenticated, represented in Unix time (seconds).                                                                                               | Integer   | 1311280970                                          |
| amr           | JSON array of strings that are identifiers for     [authentication methods](http://self-issued.info/docs/draft-jones-oauth-amr-values-00.html) used in the authentication.     | Array     | [ "pwd", "mfa", "otp", "kba", "sms", "swk", "hwk", "mca" ] |
| idp           | The id of the Identity Provider that the user authenticated to Okta with. (Used for Social Auth and Inbound SAML). If the IdP is an Okta org, the value is the Okta OrgId.           | String    | "00ok1u7AsAkrwdZL3z0g3"                             |
| nonce         | Value used to associate a Client session with an ID Token, and to mitigate replay attacks.                                                                                 | String    | "n-0S6_WzA2Mj"                                      |
| at_hash       | The base64URL-encoded first 128-bits of the SHA-256 hash of the Access Token. This is only returned if an Access Token is also returned with an ID Token.                  | String    | "MTIzNDU2Nzg5MDEyMzQ1Ng"                            |
| c_hash        | The base64URL-encoded first 128-bits of the SHA-256 hash of the authorization code. This is only returned if an authorization code is also returned with the ID Token.     | String    | "DE5MzQ1TIzlr30gokT2UDN"                            |

##### Scope-dependent claims (not always returned)

| ------------------ | ----------------- | --------------------------------------------------------------------------------                                                                                                                                                   | -------------  | --------------------------                                                                                                      |
| Property           | Required Scope    | Description                                                                                                                                                                                                                        | DataType       | Example                                                                                                                         |
|:-------------------|:------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------|:--------------------------------------------------------------------------------------------------------------------------------|:--|
| name               | profile           | User&#8217;s full name in displayable form including all name parts, possibly including titles and suffixes, ordered according to the user&#8217;s locale and preferences.                                                         | String         | "John Doe"                                                                                                                      |
| preferred_username | profile           | The Okta login (username) for the end user.                                                                                                                                                                                        | String         | "john.doe@example.com"                                                                                                          |
| nickname           | profile           | Casual name of the user that may or may not be the same as the given_name.                                                                                                                                                         | String         | "Jimmy"                                                                                                                         |
| preferred_username | profile           | The chosen login (username) for the end user. By default this is the Okta username.                                                                                                                                                | String         | "john.doe@example.com"                                                                                                          |
| given_name         | profile           | Given name(s) or first name(s) of the user. Note that in some cultures, people can have multiple given names; all can be present, with the names being separated by space characters.                                              | String         | "John"                                                                                                                          |
| middle_name        | profile           | Middle name(s) of the user. Note that in some cultures, people can have multiple middle names; all can be present, with the names being separated by space characters. Also note that in some cultures, middle names are not used. | String         | "James"                                                                                                                         |
| family_name        | profile           | Surname(s) or last name(s) of the user. Note that in some cultures, people can have multiple family names or no family name; all can be present, with the names being separated by space characters.                               | String         | "Doe"                                                                                                                           |
| profile            | profile           | URL of the user&#8217;s profile page.                                                                                                                                                                                              | String         | "https://profile.wordpress.com/john.doe"                                                                                         |
| zoneinfo           | profile           | String representing the user&#8217;s time zone.                                                                                                                                                                                    | String         | "America/Los_Angeles"                                                                                                           |
| locale             | profile           | Language and   [ISO3166‑1](http://www.iso.org/iso/country_codes) country code in uppercase, separated by a dash.                                                                                                                     | String         | "en-US"                                                                                                                         |
| updated_at         | profile           | Time the user&#8217;s information was last updated, represented in Unix time (seconds).                                                                                                                                            | Integer        | 1311280970                                                                                                                      |
| email              | email             | User&#8217;s preferred email address. The resource provider must not rely upon this value being unique.                                                                                                                            | String         | "john.doe@example.com"                                                                                                          |
| email_verified     | email             | True if the user&#8217;s email address (Okta primary email) has been verified; otherwise false.                                                                                                                                    | boolean        | true                                                                                                                            |
| address            | address           | User&#8217;s preferred postal address. The value of the address member is a JSON structure containing *street_address*, *locality*, *region*, *postal_code*, and *country*.                                                        | JSON structure | { "street_address": "123 Hollywood Blvd.", "locality": "Los Angeles", "region": "CA", "postal_code": "90210", "country": "US" } |
| phone_number       | phone             | User&#8217;s preferred telephone number in E.164 format.                                                                                                                                                                           | String         | "+1 (425) 555-1212"                                                                                                             |
| groups             | groups            | The groups that the user is a member of that also match the ID Token group filter of the client app.                                                                                                                               | List           | ["MyGroup1", "MyGroup2", "MyGroup3"]                                                                                            |

Be aware of the following before you work with scope-dependent claims:

* To protect against arbitrarily large numbers of groups matching the group filter, the groups claim has a limit of 100.
If more than 100 groups match the filter, then the request fails. Expect that this limit may change in the future.
For more information about configuring an app for OpenID Connect, including group claims, see [OpenID Connect Wizard](https://help.okta.com/en/prod/Content/Topics/Apps/Apps_App_Integration_Wizard.htm).
* **Important:** Scope-dependent claims are returned differently depending on the values in `response_type` and the scopes requested:

    | Response Type             | Claims Returned in ID Token                                                                        | Claims Returned from the Userinfo Endpoint  |
    |:--------------------------|:---------------------------------------------------------------------------------------------------|:--------------------------------------------|
    | `code `                   | N/A                                                                                                | N/A                                         |
    | `token`                   | N/A                                                                                                | N/A                                         |
    | `id_token`                | Claims associated with requested scopes.                                                           | N/A                                         |
    | `id_token` `code `        | Claims associated with requested scopes.                                                           | N/A                                         |
    | `id_token` `token`        | `email` if email scope is requested; `name` and `preferred_username` if profile scope is requested | Claims associated with the requested scopes |
    | `code` `id_token` `token` | `email` if email scope is requested; `name` and `preferred_username` if profile scope is requested | Claims associated with the requested scopes |

* The full set of claims for the requested scopes is available via the [/oauth2/v1/userinfo](/docs/api/resources/oidc#get-user-information) endpoint. Call this endpoint using the Access Token.


## More Information
 
For more information about Okta and OpenID Connect, see:

* [Okta&#8217;s API Access Management Introduction](/use_cases/api_security/)
* [API for OpenID Connect](/docs/api/resources/oidc)
