---
layout: docs_page
title: OpenId Connect
---

# Overview

The OpenID Connect API endpoints enable clients to use [OIDC workflows](http://openid.net/specs/openid-connect-core-1_0.html) with Okta.

These APIs also allow using Okta as a broker for social-login scenarios where the user authenticates against identity providers like Google, Facebook and LinkedIn and gets back an Okta session.


> This API is currently in **Beta** status and provides no guarantees for backwards-compatibility.  Okta may make breaking changes this API until it is released.

## OpenId Connect Model

OpenID Connect introduces an [id_token](http://openid.net/specs/openid-connect-core-1_0.html#IDToken) which is [JWT](https://tools.ietf.org/html/rfc7519) that contains information about an authentication event as well as claims about the authenticated user.

The id_token JWT consists of three period seperated base64 encoded JSON segments. 

#####Header -

~~~json
{
  "alg": "RS256",
  "kid": "45js03w0djwedsw"
}
~~~

#####Payload - 

~~~json
{
  "ver": 1,
  "sub": "00uid4BxXw6I6TV4m0g3",
  "iss": "http://rain.okta1.com:1802",
  "login": "administrator1@clouditude.net",
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
  "given_name":"John",
  "middle_name":"James",
  "family_name":"Doe",
  "profile":"http://profile.wordpress.com/john.doe",
  "zoneinfo":"America/Los_Angeles",
  "locale":"en-US",
  "email":"john.doe@example.com",
  "address" : { "street_address": "123 Hollywood Blvd.", 
  		"locality": "Los Angeles", 
  		"region": "CA", 
  		"postal_code": "90210", 
  		"country": "US" 
  	},
  "phone_number":"+1 (425) 555-1212"
}
~~~

#####Signature - 

This is the digital signature signed by Okta using the public key identified by a public-key identified by the <em>kid</em> item in the header section.

### Id Token claims

####Claims in the header section (always returned)

|--------------+-----------------------------------------------------------------------------------------------------+--------------|--------------------------|
| Property     | Description                                                                      | DataType     | Example                  |
|--------------+---------+--------------------------------------------------------------------------------------------+--------------|--------------------------|
| alg          | Identifies the digital signature algorithm used. This will always be RS256.      | String       | "RS256"                  |
| kid          | Identifies the public-key used to sign the id_token. The corresponding public-key can be found as a part of the [well-known configuration's](#openid-connect-metadata) jwks_uri value.                                  | String       | "a5dfwef1a-0ead3f5223_w1e" |

####Claims in the payload section

#####Scope independent claims (always returned)

|--------------+-------------------+----------------------------------------------------------------------------------+--------------|--------------------------|
| Property     |  Description                                                                      | DataType     | Example                  |
|--------------+---------+----------+----------------------------------------------------------------------------------+--------------|--------------------------|
| ver     | The semantic version of the ID token.   |  Integer   |  1    |
| jti     | A unique identifier for this ID token for debugging and revocation purposes.   | String    |  "Tlenfse93dgkaksginv"  |
| iss     | The Issuer Identifier of the response.    | String    | "https://your-org.okta.com"     |
| sub     | The subject. A unique identifier for the user.   | String    | 	"00uk1u7AsAk6dZL3z0g3"     |
| login   | The Okta login (username) for the end-user.   | String    | 	"john.doe@example.com"     |
| aud     | Identifies the audience that this ID token is intended for. It must be one of the OAuth 2.0 client IDs of your application.   | String    | "6joRGIzNCaJfdCPzRjlh"     |
| iat     | The time the ID token was issued, represented in Unix time (seconds).   | Integer    | 1311280970     |
| exp     | The time the ID token expires, represented in Unix time (seconds).   | Integer    | 1311280970     |
| auth_time | The time the end-user was authenticated, represented in Unix time (seconds).   | Integer    | 1311280970     |
| amr     | JSON array of strings that are identifiers for [authentication methods](http://self-issued.info/docs/draft-jones-oauth-amr-values-00.html) used in the authentication.   | Array    | [ "pwd", "otp", "mfa" ]     |
| idp     | The id of the Identity Provider that the user authenticated to Okta with. (Used for Social Auth and Inbound SAML). If it was Okta, the value would be the OrgId.  | String    | "00ok1u7AsAkrwdZL3z0g3"    |
| nonce     |  Value used to associate a Client session with an ID token, and to mitigate replay attacks. This is only returned if <em>nonce</em> was present in the request that generated the Id token.    |  String   | "n-0S6_WzA2Mj"  |
| at_hash     | The base64 encoded first 128-bits of the SHA-256 value of the access-token. This is only returned if an access token is also returned with id_token.  | String    | "MTIzNDU2Nzg5MDEyMzQ1Ng"     |

##### Scope dependendent claims

|--------------+-------------------+----------------------------------------------------------------------------------+--------------|--------------------------|
| Property     | Required Scope | Description                                                                      | DataType     | Example                  |
|--------------+---------+----------+----------------------------------------------------------------------------------+--------------|--------------------------|
| name     |  profile  | User's full name in displayable form including all name parts, possibly including titles and suffixes, ordered according to the user's locale and preferences.   | String    | "John Doe"     |
| nickname     |  profile   | Casual name of the user that may or may not be the same as the given_name.   | String    | "Jimmy"    |
| given_name     |  profile   | Given name(s) or first name(s) of the user. Note that in some cultures, people can have multiple given names; all can be present, with the names being separated by space characters.   | String    | "John"     |
| middle_name     |  profile    | Middle name(s) of the user. Note that in some cultures, people can have multiple middle names; all can be present, with the names being separated by space characters. Also note that in some cultures, middle names are not used.   | String    | "James"   |
| family_name     |  profile   | Surname(s) or last name(s) of the user. Note that in some cultures, people can have multiple family names or no family name; all can be present, with the names being separated by space characters.   | String    |  "Doe"    |
| profile     |  profile   | URL of the user's profile page.   | String    | "http://profile.wordpress.com/john.doe"     |
| zoneinfo     |  profile  | String representing the user's time zone.   |  String   |  	"America/Los_Angeles"    |
| locale     |  profile   | Language and [ISO3166‑1](http://www.iso.org/iso/country_codes) country code in uppercase, separated by a dash.   | String    | "en-US"     |
| email     |  email   | User's preferred e-mail address. The resource provider must <em>not</em> rely upon this value being unique.   | String    | "john.doe@example.com"     |
| address     | address    | User's preferred postal address. The value of the address member is a JSON structure containing <em>street_address</em>, <em>locality</em>, <em>region</em>, <em>postal_code</em>, and <em>country</em>.   | JSON structure    | { "street_address": "123 Hollywood Blvd.", "locality": "Los Angeles", "region": "CA", "postal_code": "90210", "country": "US" }     |
| phone_number     |  phone   | User's preferred telephone number in E.164 format.   | String    | 	"+1 (425) 555-1212"     |

##OIDC Operations

### Authenticate and authorize a user
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /oauth2/v1/authorize</span>

Starting point for the OpenId Connect flow. It authenticates user and returns an ID token along with an authorization grant to the client application as a part of the response the client might have requested.

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter         | Description                                                                                        | Param Type | DataType  | Required | Default         |
----------------- | -------------------------------------------------------------------------------------------------- | ---------- | --------- | -------- | --------------- |
idp               | The Identity provider used to do the authentication. If omitted, use Okta as the identity provider. | Query      | String    | FALSE    | Okta is the IDP |
sessionToken      | An Okta one-time sessionToken. This allows an API-based user login flow (rather than Okta login UI). Session tokens can be obtained via the [Authentication API](authn.html).	| Query | String    | FALSE | |				
response_type     | Can be a combination of - code, token and id_token. The chosen combination determines which flow is used; see this reference from the [OIDC specification](http://openid.net/specs/openid-connect-core-1_0.html#Authentication). The code response type returns an authorization code which can be later exchanged for an access token or a refresh token. | Query        | String   |   TRUE   |  |
client_id         | Obtained during client registration. It is the identifier for the client and it must match what is preregistered in Okta. | Query        | String   | TRUE     | 
redirect_uri      | It is the callback location where the authorization code should be sent and it must match what is preregistered in Okta as a part of client registration. | Query        | String   |  TRUE    | 
display           | Can be one of - <em>page</em> or <em>popup</em>. Specifies how to display the authentication and consent UI. This is a pass-through value that applies only when the "idp" param is also specified. | Query        | String   | FALSE     |  |
response_mode     | Can be one of - <em>fragment</em>, <em>form_post</em>, <em>query</em> or <em>okta_post_message</em>. If <em>id_token</em> is specified as the response type, then <em>query</em> can't be used as the response mode.  | Query        | String   | FALSE      | Defaults to and is required to be fragment in implicit and hybrid flow, defaults to query in authorization code flow.
scope          | Can be a combination of - <em>openid</em>, <em>profile</em>, <em>email</em>, <em>address</em> and <em>phone</em>. The combination determines the claims that are returned in the id_token. The openid scope has to be specified to get back an id_token. | Query        | String   | TRUE     | 
state          | A client application provided optional state string that might be useful to the application upon receipt of the response. It can contain alphanumeric, comma, period, underscore and hyphen characters.   | Query        | String   |  FALSE    | 
prompt         | Can be one of - <em>none</em> or <em>login</em>. The value determines if Okta should not prompt for authentication (if needed), or force a prompt (even if the user had an existing session). | Query        | String   | FALSE     | The default behavior is based on whether there's an existing Okta session. 
nonce          | Specifies a nonce that will be reflected back in the ID token. Can be used for CSRF protection. | Query        | String   | FALSE     | 

#### Response Parameters
{:.api .api-response .api-response-example}

The response depends on the response type passed to the API, e.g. <em>fragment</em> response mode would return values in the fragment portion of a redirect to the specified <em>redirect_uri</em> while a <em>form_post</em> response mode will POST the return values to the redirect URI. Irrespective of the response type, the contents of the response will always be the following -

Parameter         | Description                                                                                        | DataType  | 
----------------- | -------------------------------------------------------------------------------------------------- | ----------| 
id_token          | The ID token JWT contains the details of the authentication event and the claims corresponding to the requested scopes. This will be returned if the <em>response_type</em> includes <em>id_token</em> .| String    | 
access_token      | The access_token that be used to access the userinfo endpoint. This will be returned if the <em>response_type</em>  included token. Unlike the ID token JWT, the access_token structure is Okta internal only and is subject to change.| String  |
token_type        | This will always be <em>Bearer</em> and would only be returned if <em>token</em> was specified as a response_type.
state             | If the request contained a <em>state</em> parameter, then the same unmodified value will be returned back in the response. | String |
error             | The error-code string providing information if anything went wrong. | String |
error_description | Further description of the error. | String |


#### Response Example (Success)

When the request was made with a <em>fragment</em> response mode -

http://www.example.com/#
<em>id_token</em>=eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwMHVpZDRCeFh3Nkk2VFY0bTBnMyIsImVtYWlsIjoid2VibWFzdGVyQGNsb3VkaXR1ZGUubmV0IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInZlciI6MSwiaXNzIjoiaHR0cDovL3JhaW4ub2t0YTEuY29tOjE4MDIiLCJsb2dpbiI6ImFkbWluaXN0cmF0b3IxQGNsb3VkaXR1ZGUubmV0IiwiYXVkIjoidUFhdW5vZldrYURKeHVrQ0ZlQngiLCJpYXQiOjE0NDk2MjQwMjYsImV4cCI6MTQ0OTYyNzYyNiwiYW1yIjpbInB3ZCJdLCJqdGkiOiI0ZUFXSk9DTUIzU1g4WGV3RGZWUiIsImF1dGhfdGltZSI6MTQ0OTYyNDAyNiwiYXRfaGFzaCI6ImNwcUtmZFFBNWVIODkxRmY1b0pyX1EifQ.Btw6bUbZhRa89DsBb8KmL9rfhku--_mbNC2pgC8yu8obJnwO12nFBepui9KzbpJhGM91PqJwi_AylE6rp-ehamfnUAO4JL14PkemF45Pn3u_6KKwxJnxcWxLvMuuisnvIs7NScKpOAab6ayZU0VL8W6XAijQmnYTtMWQfSuaaR8rYOaWHrffh3OypvDdrQuYacbkT0csxdrayXfBG3UF5-ZAlhfch1fhFT3yZFdWwzkSDc0BGygfiFyNhCezfyT454wbciSZgrA9ROeHkfPCaX7KCFO8GgQEkGRoQntFBNjluFhNLJIUkEFovEDlfuB4tv_M8BM75celdy3jkpOurg
&<em>access_token</em>=eyJhbGciOiJSUzI1NiJ9.eyJ2ZXIiOjEsImlzcyI6Imh0dHA6Ly9yYWluLm9rdGExLmNvbToxODAyIiwiaWF0IjoxNDQ5NjI0MDI2LCJleHAiOjE0NDk2Mjc2MjYsImp0aSI6IlVmU0lURzZCVVNfdHA3N21BTjJxIiwic2NvcGVzIjpbIm9wZW5pZCIsImVtYWlsIl0sImNsaWVudF9pZCI6InVBYXVub2ZXa2FESnh1a0NGZUJ4IiwidXNlcl9pZCI6IjAwdWlkNEJ4WHc2STZUVjRtMGczIn0.HaBu5oQxdVCIvea88HPgr2O5evqZlCT4UXH4UKhJnZ5px-ArNRqwhxXWhHJisslswjPpMkx1IgrudQIjzGYbtLFjrrg2ueiU5-YfmKuJuD6O2yPWGTsV7X6i7ABT6P-t8PRz_RNbk-U1GXWIEkNnEWbPqYDAm_Ofh7iW0Y8WDA5ez1jbtMvd-oXMvJLctRiACrTMLJQ2e5HkbUFxgXQ_rFPNHJbNSUBDLqdi2rg_ND64DLRlXRY7hupNsvWGo0gF4WEUk8IZeaLjKw8UoIs-ETEwJlAMcvkhoVVOsN5dPAaEKvbyvPC1hUGXb4uuThlwdD3ECJrtwgKqLqcWonNtiw&<em>token_type</em>=Bearer<em>state</em>=waojafoawjgvbf

#### Response Example (Error)

When the requested scope was invalid -

http://www.example.com/#error=invalid_scope&error_description=The+requested+scope+is+invalid%2C+unknown%2C+or+malformed

##### Possible errors

The Okta OpenID Connect APIs are compliant with the OpenId Connect and OAuth2 spec with some Okta specific extensions. 

[OAuth 2 Spec error codes](https://tools.ietf.org/html/rfc6749#section-4.1.2.1)

Error Id         | Details                                                                | 
-----------------| -----------------------------------------------------------------------| 
unsupported_response_type  | The specified response type is invalid or unsupported.   | 
unsupported_response_mode  | The specified response mode is invalid or unsupported. This error is also thrown for disallowed response modes. E.g. if query response mode was specified for a response type that included id_token.    | 
invalid_scope  | The scopes list contains an invalid or unsupported value.    | 
server_error  | The server encountered an internal error.    | 
temporarily_unavailable  | The server is temporarily unavailable, but should be able to process the request at a later time.    |

[Open-ID Spec error codes](http://openid.net/specs/openid-connect-core-1_0.html#AuthError)

Error Id         | Details                                                                | 
-----------------| -----------------------------------------------------------------------| 
login_required  | The request specified that no prompt should be shown but the user is currently not authenticated.    |
invalid_token  |  The access_token passed is invalid or corrupted.   |


### Get user information
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET, POST</span> /oauth2/v1/userinfo</span>

This API requires the access_token returned from the [/oauth2/v1/authorize](#authenticate-and-authorize-a-user) endpoint as an authorization header parameter.

This endpoint complies with the [OIDC userinfo spec](http://openid.net/specs/openid-connect-core-1_0.html#UserInfo)

#### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Authorization: Bearer <access_token>" \
"https://${org}.okta.com/oauth2/v1/userinfo"
~~~

#### Response Parameters
{:.api .api-response .api-response-example}

Returns a JSON document with information corresponding to the data requested in the scopes list of the token.

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
  "email":"john.doe@example.com",
  "address" : { "street_address": "123 Hollywood Blvd.", "locality": "Los Angeles", "region": "CA", "postal_code": "90210", "country": "US" },
  "phone_number":"+1 (425) 555-1212"
}
~~~

The claims in the response are identical to what are returned for the requested scopes in the id_token JWT, except for the 'sub' claim which is always present. Details of the individual claims is [documented above](#scope-dependendent-claims)

#### Response Example (Error)

~~~http
HTTP/1.1 401 Unauthorized​
Cache-Control: no-cache, no-store​
Pragma: no-cache​
Expires: 0​
WWW-Authenticate: Bearer error="invalid_token", error_description="The access token is invalid"​
~~~

#### Response Example (Error)

~~~http
HTTP/1.1 403 Forbidden​
Cache-Control: no-cache, no-store​
Pragma: no-cache​
Expires: 0​
WWW-Authenticate: Bearer error="insufficient_scope", error_description="The access token must provide access to at least one of these scopes - profile, email, address or phone"
~~~

### Create token
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">POST</span> /oauth2/v1/token</span>

The API takes an authorization code or a refresh token as the grant type and returns back an access token, id token and a refresh token.

####Request parameters

The following parameters can be posted as a part of the url encoded form values to the API.

Parameter          | Description                                                                                         | Type       |
-------------------+-----------------------------------------------------------------------------------------------------+------------|
grant_type         | Can be either <em>authorization_code</em> or <em>refresh_token</em>. Determines the mechanism Okta will use to authorize the creation of the tokens. | String |  
code               | Expected if grant_type specified <em>code</em>. The value is what was returned from the /oauth2/v1/authorize endpoint. | String
refresh_token      | Expected if the grant_type specified <em>refresh_token</em>. The value is what was returned from this endpoint via a previous invocation. | String |
scope              | Expected only if <em>refresh_token</em> is specified as the grant type. This is a list of scopes that the client wants to be included in the access token. These scopes have to be subset of the scopes used to generate the refresh token in the first place. | String |
redirect_uri       | Expected if grant_type is <em>authorization_code</em>. Specifies the callback location where the authorization was sent; must match what is preregistered in Okta for this client. | String |
client_id          | The client id generated as a part of client registration. This is used in conjunction with the <em>client_secret</em> parameter to authenticate the client application. | String |
client_secret      | The client secret generated as a part of client registration. This is used in conjunction with the <em>client_id</em> parameter to authenticate the client application. | String |


#####Authentication mechanisms

The client can authenticate by providing client_id and client_secret as a part of the url encoded form parameters (as described in table above), or it can use basic authentication by providing the client_id and client_secret as a header. Only one authentication mechanism should be used with a given request and using both simultaneously will return an error.

For authentication via basic-auth, an HTTP header with the following format must be provided with the POST request.

~~~sh
Authorization: Basic ${Base64(<client_id>:<client_secret>)} 
~~~

####Response parameters

Based on the grant type, the returned JSON contains different set of tokens

Input grant type   | Output token types                    |
-------------------|---------------------------------------|
code               | id token, access token, refresh token |
refresh token      | access token, refresh token           |

####Response example (Success)

~~~json
{
    "access_token" : "eyJhbGciOiJSUzI1NiJ9.eyJ2ZXIiOjEsImlzcyI6Imh0dHA6Ly9yYWluLm9rdGExLmNvbToxODAyIiwiaWF0IjoxNDQ5NjI0MDI2LCJleHAiOjE0NDk2Mjc2MjYsImp0aSI6IlVmU0lURzZCVVNfdHA3N21BTjJxIiwic2NvcGVzIjpbIm9wZW5pZCIsImVtYWlsIl0sImNsaWVudF9pZCI6InVBYXVub2ZXa2FESnh1a0NGZUJ4IiwidXNlcl9pZCI6IjAwdWlkNEJ4WHc2STZUVjRtMGczIn0.HaBu5oQxdVCIvea88HPgr2O5evqZlCT4UXH4UKhJnZ5px-ArNRqwhxXWhHJisslswjPpMkx1IgrudQIjzGYbtLFjrrg2ueiU5-YfmKuJuD6O2yPWGTsV7X6i7ABT6P-t8PRz_RNbk-U1GXWIEkNnEWbPqYDAm_Ofh7iW0Y8WDA5ez1jbtMvd-oXMvJLctRiACrTMLJQ2e5HkbUFxgXQ_rFPNHJbNSUBDLqdi2rg_ND64DLRlXRY7hupNsvWGo0gF4WEUk8IZeaLjKw8UoIs-ETEwJlAMcvkhoVVOsN5dPAaEKvbyvPC1hUGXb4uuThlwdD3ECJrtwgKqLqcWonNtiw",
    "token_type" : "Bearer",
    "expires_in" : 3600,
    "refresh_token" : "a9VpZDRCeFh3Nkk2VdY",
    "id_token" : "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwMHVpZDRCeFh3Nkk2VFY0bTBnMyIsImVtYWlsIjoid2VibWFzdGVyQGNsb3VkaXR1ZGUubmV0IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInZlciI6MSwiaXNzIjoiaHR0cDovL3JhaW4ub2t0YTEuY29tOjE4MDIiLCJsb2dpbiI6ImFkbWluaXN0cmF0b3IxQGNsb3VkaXR1ZGUubmV0IiwiYXVkIjoidUFhdW5vZldrYURKeHVrQ0ZlQngiLCJpYXQiOjE0NDk2MjQwMjYsImV4cCI6MTQ0OTYyNzYyNiwiYW1yIjpbInB3ZCJdLCJqdGkiOiI0ZUFXSk9DTUIzU1g4WGV3RGZWUiIsImF1dGhfdGltZSI6MTQ0OTYyNDAyNiwiYXRfaGFzaCI6ImNwcUtmZFFBNWVIODkxRmY1b0pyX1EifQ.Btw6bUbZhRa89DsBb8KmL9rfhku--_mbNC2pgC8yu8obJnwO12nFBepui9KzbpJhGM91PqJwi_AylE6rp-ehamfnUAO4JL14PkemF45Pn3u_6KKwxJnxcWxLvMuuisnvIs7NScKpOAab6ayZU0VL8W6XAijQmnYTtMWQfSuaaR8rYOaWHrffh3OypvDdrQuYacbkT0csxdrayXfBG3UF5-ZAlhfch1fhFT3yZFdWwzkSDc0BGygfiFyNhCezfyT454wbciSZgrA9ROeHkfPCaX7KCFO8GgQEkGRoQntFBNjluFhNLJIUkEFovEDlfuB4tv_M8BM75celdy3jkpOurg"
}
~~~

#### Response Example (Error)

~~~http
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
	"error" : "invalid_grant"
}
~~~

####List of errors 

Error Id                |  Details                                                                                                     |
------------------------+--------------------------------------------------------------------------------------------------------------|
invalid_client          | The specified client id wasn't found. |
invalid_request         | The request structure was invalid. E.g. the basic authentication header was malformed, or both header and form parameters were used for authentication or no authentication information was provided. |
invalid_grant			| The <em>code</em> or <em>refresh_token</em> value was invalid. |
unsupported_grant_type  | The grant_type was not <em>authorization_code</em> or <em>refresh_token</em>. |


### Get OpenID Connect metadata
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /.well-known/openid-configuration</span>

This API endpoint returns the OpenID Connect related metadata that can be used by clients to programmatically configure their interactions with Okta. This API doesn't require any authentication and returns a JSON object with the following structure.

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
        "implicit"
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
        "client_secret_post"
    ],
    "claims_supported": [
        "iss",
        "sub",
        "aud",
        "login",
        "iat",
        "exp",
        "auth_time",
        "amr",
        "idp",
        "idp_type",
        "nonce",
        "name",
        "nickname",
        "given_name",
        "middle_name",
        "family_name",
        "email",
        "profile",
        "zoneinfo",
        "locale",
        "address",
        "phone_number"
    ]
}

~~~~