---
layout: docs_page
title: OpenID Connect
redirect_from: "docs/api/rest/oidc.html"
---

# Overview

The OpenID Connect API endpoints enable clients to use [OIDC workflows](http://openid.net/specs/openid-connect-core-1_0.html) with Okta.

This API also enables you to use Okta as a broker for social-login scenarios where the user authenticates against identity providers like Google, Facebook, LinkedIn, and Microsoft,
and returns an Okta session.

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
           
#####Scope-dependent claims

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
Instead, the id token contains the `name` and `preferred_username` claims if the `profile` scope was requested and `email` claim if the `email` scope was requested.

>The full set of claims for the requested scopes is available via the [/oauth2/v1/userinfo](#get-user-information) endpoint. Call this endpoint using the Access Token.

##OAuth 2.0 Endpoints

###Authentication Request
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /oauth2/v1/authorize</span>

Starting point for the OpenID Connect flow. This request authenticates the user and returns an ID Token along with an authorization grant to the client application as a part of the response the client might have requested.

####Request Parameters
{:.api .api-request .api-request-params}

Parameter         | Description                                                                                        | Param Type | DataType  | Required | Default         |
----------------- | -------------------------------------------------------------------------------------------------- | ---------- | --------- | -------- | --------------- |
[idp](idps.html)               | The Identity provider used to do the authentication. If omitted, use Okta as the identity provider. | Query      | String    | FALSE    | Okta is the IDP. |
sessionToken      | An Okta one-time sessionToken. This allows an API-based user login flow (rather than Okta login UI). Session tokens can be obtained via the [Authentication API](authn.html).	| Query | String    | FALSE | |				
response_type     | Can be a combination of <em>code</em>, <em>token</em>, and <em>id_token</em>. The chosen combination determines which flow is used; see this reference from the [OIDC specification](http://openid.net/specs/openid-connect-core-1_0.html#Authentication). The code response type returns an authorization code which can be later exchanged for an Access Token or a Refresh Token. | Query        | String   |   TRUE   |  |
client_id         | Obtained during either [UI client registration](../../guides/social_authentication.html) or [API client registration](oauth-clients.html). It is the identifier for the client and it must match what is preregistered in Okta. | Query        | String   | TRUE     | 
redirect_uri      | Specifies the callback location where the authorization code should be sent and it must match what is preregistered in Okta as a part of client registration. | Query        | String   |  TRUE    | 
display           | Specifies how to display the authentication and consent UI. Valid values: <em>page</em> or <em>popup</em>.  | Query        | String   | FALSE     |  |
max_age           | Specifies the allowable elapsed time, in seconds, since the last time the end user was actively authenticated by Okta. | Query      | String    | FALSE    | |
response_mode     | Specifies how the authorization response should be returned. [Valid values: <em>fragment</em>, <em>form_post</em>, <em>query</em> or <em>okta_post_message</em>](#parameter-details). If <em>id_token</em> is specified as the response type, then <em>query</em> can't be used as the response mode. Default: Defaults to and is required to be <em>fragment</em> in implicit and hybrid flow. Defaults to <em>query</em> in authorization code flow. | Query        | String   | FALSE      | See Description.
scope          | Can be a combination of <em>openid</em>, <em>profile</em>, <em>email</em>, <em>address</em> and <em>phone</em>. The combination determines the claims that are returned in the id_token. The openid scope has to be specified to get back an id_token. | Query        | String   | TRUE     | 
state          | A client application provided state string that might be useful to the application upon receipt of the response. It can contain alphanumeric, comma, period, underscore and hyphen characters.   | Query        | String   |  TRUE    | 
prompt         | Can be either <em>none</em> or <em>login</em>. The value determines if Okta should not prompt for authentication (if needed), or force a prompt (even if the user had an existing session). Default: The default behavior is based on whether there's an existing Okta session. | Query        | String   | FALSE     | See Description. 
nonce          | Specifies a nonce that is reflected back in the ID Token. It is used to mitigate replay attacks. | Query        | String   | TRUE     | 
code_challenge | Specifies a challenge of [PKCE](#parameter-details). The challenge is verified in the Access Token request.  | Query        | String   | FALSE    | 
code_challenge_method | Specifies the method that was used to derive the code challenge. Only S256 is supported.  | Query        | String   | FALSE    | 

####Parameter Details
 
 * `idp` and `sessionToken` are Okta extensions to the [OIDC specification](http://openid.net/specs/openid-connect-core-1_0.html#Authentication). 
    All other parameters are specification-compliant and their behavior is consistent with the specification.
 * Each value for `response_mode` delivers different behavior:
    * <em>fragment</em> -- Parameters are encoded in the URL fragment added to the `redirect_uri` when redirecting back to the client.
    * <em>query</em> -- Parameters are encoded in the query string added to the `redirect_uri` when redirecting back to the client.
    * <em>form_post</em> -- Parameters are encoded as HTML form values that are auto-submitted in the User Agent.Thus, the values are transmitted via the HTTP POST method to the client
      and the result parameters are encoded in the body using the application/x-www-form-urlencoded format.
    * <em>okta_post_message</em> -- Uses [HTML5 Web Messaging](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) (for example, window.postMessage()) instead of the redirect for the authorization response from the authorization endpoint.
      <em>okta_post_message</em> is an adaptation of the [Web Message Response Mode](https://tools.ietf.org/html/draft-sakimura-oauth-wmrm-00#section-4.1). 
      This value provides a secure way for a single-page application to perform a sign-in flow 
      in a popup window or an iFrame and receive the ID token and/or access token back in the parent page without leaving the context of that page.
      The data model for the [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) call is in the next section.
      
 * Okta requires the OAuth 2.0 `state` parameter on all requests to the authorization endpoint in order to prevent cross-site request forgery (CSRF). 
 The OAuth 2.0 specification [requires](https://tools.ietf.org/html/rfc6749#section-10.12) that clients protect their redirect URIs against CSRF by sending a value in the authorize request which binds the request to the user-agent's authenticated state. 
 Using the `state` parameter is also a countermeasure to several other known attacks as outlined in [OAuth 2.0 Threat Model and Security Considerations](https://tools.ietf.org/html/rfc6819).

 * [Proof Key for Code Exchange](https://tools.ietf.org/html/rfc7636) (PKCE) is a stronger mechanism for binding the authorization code to the client than just a client secret, and prevents [a code interception attack](https://tools.ietf.org/html/rfc7636#section-1) if both the code and the client credentials are intercepted (which can happen on mobile/native devices). The PKCE-enabled client creates a large random string as code_verifier and derives code_challenge from it using code_challenge_method. It passes the code_challenge and code_challenge_method in the authorization request for code flow. When a client tries to redeem the code, it must pass the code_verifer. Okta recomputes the challenge and returns the requested token only if it matches the code_challenge in the original authorization request. When a client, whose token_endpoint_auth_method is 'none', makes a code flow authorization request, the code_challenge parameter is required.
      
####postMessage() Data Model

Use the postMessage() data model to help you when working with the <em>okta_post_message</em> value of the `response_mode` request parameter.

`message`:

Parameter         | Description                                                                                        | DataType  | 
----------------- | -------------------------------------------------------------------------------------------------- | ----------| 
id_token          | The ID Token JWT contains the details of the authentication event and the claims corresponding to the requested scopes. This is returned if the `response_type` includes `id_token`. | String   |
access_token      | The `access_token` used to access the /userinfo endpoint. This is returned if the `response_type` included a token. <b>Important</b>: Unlike the ID Token JWT, the `access_toekn` structure is specific to Okta, and is subject to change. | String    |
state             | If the request contained a `state` parameter, then the same unmodified value is returned back in the response. | String    |
error             | The error-code string providing information if anything goes wrong.                                | String    |
error_description | Additional description of the error.                                                               | String    |

`targetOrigin`: 

Specifies what the origin of `parentWindow` must be in order for the postMessage() event to be dispatched
(this is enforced by the browser). The <em>okta-post-message</em> response mode always uses the origin from the `redirect_uri` 
specified by the client. This is crucial to prevent the sensitive token data from being exposed to a malicious site.

####Response Parameters

{:.api .api-response .api-response-example}

The response depends on the response type passed to the API. For example, a <em>fragment</em> response mode returns values in the fragment portion of a redirect to the specified <em>redirect_uri</em> while a <em>form_post</em> response mode POSTs the return values to the redirect URI. 
Irrespective of the response type, the contents of the response is always one of the following.

Parameter         | Description                                                                                        | DataType  | 
----------------- | -------------------------------------------------------------------------------------------------- | ----------| 
id_token          | The ID Token JWT contains the details of the authentication event and the claims corresponding to the requested scopes. This is returned if the <em>response_type</em> includes <em>id_token</em> .| String    | 
access_token      | The access_token that be used to access the userinfo endpoint. This is returned if the <em>response_type</em>  included token. Unlike the ID Token JWT, the access_token structure is Okta internal only and is subject to change.| String  |
token_type        | This is always <em>Bearer</em> and is returned only when <em>token</em> is specified as a `response_type`. | String |
state             | The same unmodified value from the request is returned back in the response. | String |
error             | The error-code string providing information if anything went wrong. | String |
error_description | Further description of the error. | String |

#####Possible Errors

The Okta OpenID Connect APIs are compliant with the OpenID Connect and OAuth2 spec with some Okta specific extensions. 

[OAuth 2 Spec error codes](https://tools.ietf.org/html/rfc6749#section-4.1.2.1)

Error Id         | Details                                                                | 
-----------------| -----------------------------------------------------------------------| 
unsupported_response_type  | The specified response type is invalid or unsupported.   | 
unsupported_response_mode  | The specified response mode is invalid or unsupported. This error is also thrown for disallowed response modes. For example, if the query response mode is specified for a response type that includes id_token.    | 
invalid_scope   | The scopes list contains an invalid or unsupported value.    | 
server_error    | The server encountered an internal error.    | 
temporarily_unavailable    | The server is temporarily unavailable, but should be able to process the request at a later time.    |
invalid_request | The request is missing a necessary parameter or the parameter has an invalid value. |
invalid_client  | The specified client id is invalid.
access_denied   | The server denied the request. 

[Open-ID Spec error codes](http://openid.net/specs/openid-connect-core-1_0.html#AuthError)

Error Id           | Details                                                                | 
-------------------| -----------------------------------------------------------------------| 
login_required     | The request specified that no prompt should be shown but the user is currently not authenticated.    |
insufficient_scope | The access token provided does not contain the necessary scopes to access the resource.              |

####Response Example (Success)

The request is made with a <em>fragment</em> response mode.

~~~
http://www.example.com/#
<em>id_token</em>=eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwMHVpZDRCeFh3Nkk2VFY0bTBnMyIsImVtYWlsIjoid2VibWFzdGVyQGNsb3VkaXR1ZG
UubmV0IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInZlciI6MSwiaXNzIjoiaHR0cDovL3JhaW4ub2t0YTEuY29tOjE4MDIiLCJsb2dpbiI6ImFkbWluaXN
0cmF0b3IxQGNsb3VkaXR1ZGUubmV0IiwiYXVkIjoidUFhdW5vZldrYURKeHVrQ0ZlQngiLCJpYXQiOjE0NDk2MjQwMjYsImV4cCI6MTQ0OTYyNzYyNiwi
YW1yIjpbInB3ZCJdLCJqdGkiOiI0ZUFXSk9DTUIzU1g4WGV3RGZWUiIsImF1dGhfdGltZSI6MTQ0OTYyNDAyNiwiYXRfaGFzaCI6ImNwcUtmZFFBNWVIO
DkxRmY1b0pyX1EifQ.Btw6bUbZhRa89DsBb8KmL9rfhku--_mbNC2pgC8yu8obJnwO12nFBepui9KzbpJhGM91PqJwi_AylE6rp-ehamfnUAO4JL14Pke
mF45Pn3u_6KKwxJnxcWxLvMuuisnvIs7NScKpOAab6ayZU0VL8W6XAijQmnYTtMWQfSuaaR8rYOaWHrffh3OypvDdrQuYacbkT0csxdrayXfBG3UF5-ZA
lhfch1fhFT3yZFdWwzkSDc0BGygfiFyNhCezfyT454wbciSZgrA9ROeHkfPCaX7KCFO8GgQEkGRoQntFBNjluFhNLJIUkEFovEDlfuB4tv_M8BM75celd
y3jkpOurg
&<em>access_token</em>=eyJhbGciOiJSUzI1NiJ9.eyJ2ZXIiOjEsImlzcyI6Imh0dHA6Ly9yYWluLm9rdGExLmNvbToxODAyIiwiaWF0
IjoxNDQ5NjI0MDI2LCJleHAiOjE0NDk2Mjc2MjYsImp0aSI6IlVmU0lURzZCVVNfdHA3N21BTjJxIiwic2NvcGVzIjpbIm9wZW5pZCIsImVtYWlsIl0sI
mNsaWVudF9pZCI6InVBYXVub2ZXa2FESnh1a0NGZUJ4IiwidXNlcl9pZCI6IjAwdWlkNEJ4WHc2STZUVjRtMGczIn0.HaBu5oQxdVCIvea88HPgr2O5ev
qZlCT4UXH4UKhJnZ5px-ArNRqwhxXWhHJisslswjPpMkx1IgrudQIjzGYbtLFjrrg2ueiU5-YfmKuJuD6O2yPWGTsV7X6i7ABT6P-t8PRz_RNbk-U1GXW
IEkNnEWbPqYDAm_Ofh7iW0Y8WDA5ez1jbtMvd-oXMvJLctRiACrTMLJQ2e5HkbUFxgXQ_rFPNHJbNSUBDLqdi2rg_ND64DLRlXRY7hupNsvWGo0gF4WEU
k8IZeaLjKw8UoIs-ETEwJlAMcvkhoVVOsN5dPAaEKvbyvPC1hUGXb4uuThlwdD3ECJrtwgKqLqcWonNtiw
&<em>token_type</em>=Bearer<em>state</em>=waojafoawjgvbf
~~~

####Response Example (Error)

The requested scope is invalid:

~~~
http://www.example.com/#error=invalid_scope&error_description=The+requested+scope+is+invalid%2C+unknown%2C+or+malformed
~~~

###Get User Information
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET, POST</span> /oauth2/v1/userinfo</span>

This API requires the `access_token` returned from the [/oauth2/v1/authorize](#authenticate-and-authorize-a-user) endpoint as an authorization header parameter.

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

Returns a JSON document with information corresponding to the data requested in the scopes list of the token.

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

###Get Access Token
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">POST</span> /oauth2/v1/token</span>

The API takes an authorization code or a Refresh Token as the grant type and returns back an Access Token, ID Token and a Refresh Token.

####Request Parameters

The following parameters can be posted as a part of the URL-encoded form values to the API.

Parameter          | Description                                                                                         | Type       |
-------------------+-----------------------------------------------------------------------------------------------------+------------|
grant_type         | Can be one of the following: <em>authorization_code</em>, <em>password</em>, or <em>refresh_token</em>. Determines the mechanism Okta will use to authorize the creation of the tokens. | String |  
code               | Expected if grant_type specified <em>authorization_code</em>. The value is what was returned from the /oauth2/v1/authorize endpoint. | String
refresh_token      | Expected if the grant_type specified <em>refresh_token</em>. The value is what was returned from this endpoint via a previous invocation. | String |
scope              | Expected only if <em>refresh_token</em> is specified as the grant type. This is a list of scopes that the client wants to be included in the Access Token. These scopes have to be subset of the scopes used to generate the Refresh Token in the first place. | String |
redirect_uri       | Expected if grant_type is <em>authorization_code</em>. Specifies the callback location where the authorization was sent; must match what is preregistered in Okta for this client. | String |
code_verifier      | The code verifier of [PKCE](#parameter-details). Okta uses it to recompute the code_challenge and verify if it matches the original code_challenge in the authorization request. | String |


#####Token Authentication Method

The client can authenticate by providing the [`client_id`](oidc.html#request-parameters) and [`client_secret`](https://support.okta.com/help/articles/Knowledge_Article/Using-OpenID-Connect) as an Authorization header in the Basic auth scheme (basic authentication).

For authentication with Basic auth, an HTTP header with the following format must be provided with the POST request.

~~~sh
Authorization: Basic ${Base64(<client_id>:<client_secret>)} 
~~~

####Response Parameters

Based on the grant type, the returned JSON contains a different set of tokens.

Input grant type   | Output token types                    |
-------------------|---------------------------------------|
code               | ID Token, Access Token, Refresh Token |
refresh Token      | Access Token, Refresh Token           |

####List of Errors 

Error Id                |  Details                                                                                                     |
------------------------+--------------------------------------------------------------------------------------------------------------|
invalid_client          | The specified client id wasn't found. |
invalid_request         | The request structure was invalid. E.g. the basic authentication header was malformed, or both header and form parameters were used for authentication or no authentication information was provided. |
invalid_grant			| The <em>code</em> or <em>refresh_token</em> value was invalid, or the <em>redirect_uri</em> does not match the one used in the authorization request. |
unsupported_grant_type  | The grant_type was not <em>authorization_code</em> or <em>refresh_token</em>. |

####Response Example (Success)

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

####Response Example (Error)

~~~http
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
    "error" : "invalid_client",
    "error_description" : "No client credentials found."
}
~~~

###Validating ID Tokens

You can pass ID tokens around different components of your app, and these components can use it as a lightweight authentication mechanism identifying the app and the user.
But before you can use the information in the ID token or rely on it as an assertion that the user has authenticated, you must validate it to prove its integrity.

ID tokens are sensitive and can be misused if intercepted. You must ensure that these tokens are handled securely by transmitting them only over HTTPS
and only via POST data or within request headers. If you store them on your server, you must also store them securely.

Clients MUST validate the ID token in the Token Response in the following manner:

1. Verify that the `iss` (issuer) claim in the ID token exactly matches the issuer identifier for your Okta organization (which is typically obtained during [Discovery](#openid-discovery-document)). 
2. Verify that the `aud` (audience) claim contains the `client_id` of your application.
3. Verify the signature of the ID token according to [JWS](https://tools.ietf.org/html/rfc7515) using the algorithm specified in the JWT `alg` header parameter. Use the public keys provided by Okta via the [Discovery Document](#openid-discovery-document).
4. Verify that the expiry time (from the `exp` claim) has not already passed.
5. A `nonce` claim MUST be present and its value checked to verify that it is the same value as the one that was sent in the Authentication Request. The client should check the nonce value for replay attacks.
6. The client SHOULD check the `auth_time` claim value and request re-authentication using the `prompt=login` parameter if it determines too much time has elapsed since the last End-User authentication.

Step 3 involves downloading the public JWKS from Okta (specified by the `jwks_uri` attribute in the [discovery document](#opendid-discovery-document)). The result of this call is a [JSON Web Key](https://tools.ietf.org/html/rfc7517) set.

Each public key is identified by a `kid` attribute, which corresponds with the `kid` claim in the [ID token header](#claims-in-the-header-section).

The ID token and the access token are signed by an RSA private key. Okta publishes the corresponding public key and adds a public-key identifier `kid` in the ID token header. To minimize the effects of key rotation, your application should check the `kid`, and if it has changed, check the `jwks_uri` value in the [well-known configuration](#openid-connect-metadata) for a new public key and `kid`. 

All applications must roll over keys for adequate security. Please note the following:

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

