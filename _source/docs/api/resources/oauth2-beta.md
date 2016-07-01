---
layout: docs_page
title: OAuth 2.0
---

# Overview

The OAuth 2.0 API endpoints enable clients to use [OAuth 2.0 workflows](https://tools.ietf.org/html/rfc6749) with Okta.
This authorization layer separates the role of client from that of resource owner by providing the client with an access token
that can define scope, lifetime, and other attributes. 

Additionally, these endpoints support the use of [OpenID Connect](/docs/api/resources/oidc.html) for OpenID Connect workflows such as social authentication.

> This API is currently in **Early Access** status.  It has been tested as thoroughly as a Generally Available feature. Contact Support to enable this feature.

## Endpoints

### Authentication Request
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /oauth2/v1/authorize</span>

Starting point for all OAuth 2.0 flows. This request authenticates the user and returns an ID Token along with an authorization grant to the client application as a part of the response the client might have requested.

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter         | Description                                                                                        | Param Type | DataType  | Required | Default         |
----------------- | -------------------------------------------------------------------------------------------------- | ---------- | --------- | -------- | --------------- |
[idp](idps.html)               | The Identity provider used to do the authentication. If omitted, use Okta as the identity provider. | Query      | String    | FALSE    | Okta is the IDP. |
sessionToken      | An Okta one-time sessionToken. This allows an API-based user login flow (rather than Okta login UI). Session tokens can be obtained via the [Authentication API](authn.html).   | Query | String    | FALSE | |             
response_type     | Can be a combination of <em>code</em>, <em>token</em>, and <em>id_token</em>. The chosen combination determines which flow is used; see this reference from the [OIDC specification](http://openid.net/specs/openid-connect-core-1_0.html#Authentication). The code response type returns an authorization code which can be later exchanged for an Access Token or a Refresh Token. | Query        | String   |   TRUE   |  |
client_id         | Obtained during either [UI client registration](../../guides/social_authentication.html) or [API client registration](oauth-clients.html). It is the identifier for the client and it must match what is preregistered in Okta. | Query        | String   | TRUE     | 
redirect_uri      | Specifies the callback location where the authorization code should be sent and it must match what is preregistered in Okta as a part of client registration. | Query        | String   |  TRUE    | 
display           | Specifies how to display the authentication and consent UI. Valid values: <em>page</em> or <em>popup</em>.  | Query        | String   | FALSE     |  |
max_age           | Specifies the allowable elapsed time, in seconds, since the last time the end user was actively authenticated by Okta. | Query      | String    | FALSE    | |
response_mode     | Specifies how the authorization response should be returned. [Valid values: <em>fragment</em>, <em>form_post</em>, <em>query</em> or <em>okta_post_message</em>](#parameter-details). If <em>id_token</em> is specified as the response type, then <em>query</em> can't be used as the response mode. Default: Defaults to and is required to be <em>fragment</em> in implicit and hybrid flow. Defaults to <em>query</em> in authorization code flow. | Query        | String   | FALSE      | See Description.
scope          | Can be a combination of <em>openid</em>, <em>profile</em>, <em>email</em>, <em>address</em> and <em>phone</em> and other user defined scopes. The combination determines the claims that are returned in the id_token. The openid scope has to be specified to get back an id_token. | Query        | String   | TRUE     |
state          | A client application provided state string that might be useful to the application upon receipt of the response. It can contain alphanumeric, comma, period, underscore and hyphen characters.   | Query        | String   |  TRUE    | 
prompt         | Can be either <em>none</em> or <em>login</em>. The value determines if Okta should not prompt for authentication (if needed), or force a prompt (even if the user had an existing session). Default: The default behavior is based on whether there's an existing Okta session. | Query        | String   | FALSE     | See Description. 
nonce          | Specifies a nonce that is reflected back in the ID Token. It is used to mitigate replay attacks. | Query        | String   | TRUE     | 
code_challenge | Specifies a challenge of [PKCE](#parameter-details). The challenge is verified in the Access Token request.  | Query        | String   | FALSE    | 
code_challenge_method | Specifies the method that was used to derive the code challenge. Only S256 is supported.  | Query        | String   | FALSE    | 

#### Parameter Details
 
 * <em>idp</em> and <em>sessionToken</em> are Okta extensions to the [OIDC specification](http://openid.net/specs/openid-connect-core-1_0.html#Authentication). 
    All other parameters comply with the [OAuth 2.0 specification](https://tools.ietf.org/html/rfc6749) and their behavior is consistent with the specification.
 * Each value for <em>response_mode</em> delivers different behavior:
    * <em>fragment</em> -- Parameters are encoded in the URL fragment added to the <em>redirect_uri</em> when redirecting back to the client.
    * <em>query</em> -- Parameters are encoded in the query string added to the <em>redirect_uri</em> when redirecting back to the client.
    * <em>form_post</em> -- Parameters are encoded as HTML form values that are auto-submitted in the User Agent.Thus, the values are transmitted via the HTTP POST method to the client
      and the result parameters are encoded in the body using the application/x-www-form-urlencoded format.
    * <em>okta_post_message</em> -- Uses [HTML5 Web Messaging](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) (for example, window.postMessage()) instead of the redirect for the authorization response from the authorization endpoint.
      <em>okta_post_message</em> is an adaptation of the [Web Message Response Mode](https://tools.ietf.org/html/draft-sakimura-oauth-wmrm-00#section-4.1). 
      This value provides a secure way for a single-page application to perform a sign-in flow 
      in a popup window or an iFrame and receive the ID token and/or access token back in the parent page without leaving the context of that page.
      The data model for the [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) call is in the next section.
      
 * Okta requires the OAuth 2.0 <em>state</em> parameter on all requests to the authorization endpoint in order to prevent cross-site request forgery (CSRF). 
 The OAuth 2.0 specification [requires](https://tools.ietf.org/html/rfc6749#section-10.12) that clients protect their redirect URIs against CSRF by sending a value in the authorize request which binds the request to the user-agent's authenticated state. 
 Using the <em>state</em> parameter is also a countermeasure to several other known attacks as outlined in [OAuth 2.0 Threat Model and Security Considerations](https://tools.ietf.org/html/rfc6819).

 * [Proof Key for Code Exchange](https://tools.ietf.org/html/rfc7636) (PKCE) is a stronger mechanism for binding the authorization code to the client than just a client secret, and prevents [a code interception attack](https://tools.ietf.org/html/rfc7636#section-1) if both the code and the client credentials are intercepted (which can happen on mobile/native devices). The PKCE-enabled client creates a large random string as code_verifier and derives code_challenge from it using code_challenge_method. It passes the code_challenge and code_challenge_method in the authorization request for code flow. When a client tries to redeem the code, it must pass the code_verifer. Okta recomputes the challenge and returns the requested token only if it matches the code_challenge in the original authorization request. When a client, whose token_endpoint_auth_method is 'none', makes a code flow authorization request, the code_challenge parameter is required.
      
#### postMessage() Data Model

Use the postMessage() data model to help you when working with the <em>okta_post_message</em> value of the <em>response_mode</em> request parameter.

<em>message</em>:

Parameter         | Description                                                                                        | DataType  | 
----------------- | -------------------------------------------------------------------------------------------------- | ----------| 
id_token          | The ID Token JWT contains the details of the authentication event and the claims corresponding to the requested scopes. This is returned if the `response_type` includes `id_token`. | String   |
access_token      | The <em>access_token</em> used to access the [`/oauth2/v1/userinfo`](/docs/api/resources/oidc.html#get-user-information) endpoint. This is returned if the <em>response_type</em> included a token. <b>Important</b>: Unlike the ID Token JWT, the <em>access_token</em> structure is specific to Okta, and is subject to change. | String    |
state             | If the request contained a `state` parameter, then the same unmodified value is returned back in the response. | String    |
error             | The error-code string providing information if anything goes wrong.                                | String    |
error_description | Additional description of the error.                                                               | String    |

<em>targetOrigin</em>: 

Specifies what the origin of <em>parentWindow</em> must be in order for the postMessage() event to be dispatched
(this is enforced by the browser). The <em>okta-post-message</em> response mode always uses the origin from the <em>redirect_uri</em> 
specified by the client. This is crucial to prevent the sensitive token data from being exposed to a malicious site.

#### Response Parameters

The response depends on the response type passed to the API. For example, a <em>fragment</em> response mode returns values in the fragment portion of a redirect to the specified <em>redirect_uri</em> while a <em>form_post</em> response mode POSTs the return values to the redirect URI. 
Irrespective of the response type, the contents of the response is always one of the following.

Parameter         | Description                                                                                        | DataType  | 
----------------- | -------------------------------------------------------------------------------------------------- | ----------| 
id_token          | The ID Token JWT contains the details of the authentication event and the claims corresponding to the requested scopes. This is returned if the <em>response_type</em> includes <em>id_token</em> .| String    | 
access_token      | The <em>access_token</em> that is used to access the [`/oauth2/v1/userinfo`](/docs/api/resources/oidc.html#get-user-information) endpoint. This is returned if the <em>response_type</em>  included a token. Unlike the ID Token JWT, the <em>access_token</em> structure is specific to Okta, and is subject to change.| String  |
token_type        | The token type is always `Bearer` and is returned only when <em>token</em> is specified as a <em>response_type</em>. | String |
state             | The same unmodified value from the request is returned back in the response. | String |
error             | The error-code string providing information if anything went wrong. | String |
error_description | Further description of the error. | String |

##### Possible Errors

These APIs are compliant with the OpenID Connect and OAuth2 spec with some Okta specific extensions. 

[OAuth 2 Spec error codes](https://tools.ietf.org/html/rfc6749#section-4.1.2.1)

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

The request is made with a <em>fragment</em> response mode.

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
&token_type=Bearer&state=waojafoawjgvbf
~~~

#### Response Example (Error)

The requested scope is invalid:

~~~
http://www.example.com/#error=invalid_scope&error_description=The+requested+scope+is+invalid%2C+unknown%2C+or+malformed
~~~

### Token Request
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">POST</span> /oauth2/v1/token</span>

The API takes an authorization code or a Refresh Token as the grant type and returns back an Access Token, ID Token and a Refresh Token.

#### Request Parameters

The following parameters can be posted as a part of the URL-encoded form values to the API.

Parameter          | Description                                                                                         | Type       |
-------------------+-----------------------------------------------------------------------------------------------------+------------|
grant_type         | Can be one of the following: <em>authorization_code</em>, <em>password</em>, <em>refresh_token</em> or <em>client_credentials</em>. Determines the mechanism Okta will use to authorize the creation of the tokens. | String |
code               | Expected if grant_type specified <em>authorization_code</em>. The value is what was returned from the /oauth2/v1/authorize endpoint. | String
refresh_token      | Expected if the grant_type specified <em>refresh_token</em>. The value is what was returned from this endpoint via a previous invocation. | String |
scope              | Expected if <em>refresh_token</em> or <em>client_credentials</em> is specified as the grant type. This is a list of scopes that the client wants to be included in the Access Token. These scopes have to be subset of the scopes used to generate the Refresh Token in the first place if grant type is <em>refresh_token</em>. | String |
redirect_uri       | Expected if grant_type is <em>authorization_code</em>. Specifies the callback location where the authorization was sent; must match what is preregistered in Okta for this client. | String |
client_id          | The client ID generated as a part of client registration. This is used in conjunction with the <em>client_secret</em> parameter to authenticate the client application. | String |
client_secret      | The client secret generated as a part of client registration. This is used in conjunction with the <em>client_id</em> parameter to authenticate the client application. | String |
code_verifier      | The code verifier of [PKCE](#parameter-details). Okta uses it to recompute the code_challenge and verify if it matches the original code_challenge in the authorization request. | String |


> The [Client Credentials](https://tools.ietf.org/html/rfc6749#section-4.4) flow (if `grant_types` is `client_credentials`) is currently in **Beta** status.

##### Token Authentication Methods

The client can authenticate by providing <em>client_id</em> and <em>client_secret</em> as a part of the URL-encoded form parameters (as described in table above),
or it can use basic authentication by providing the <em>client_id</em> and <em>client_secret</em> as an Authorization header using the Basic auth scheme.
Use one authentication mechanism with a given request. Using both returns an error.

For authentication with Basic auth, an HTTP header with the following format must be provided with the POST request.

~~~sh
Authorization: Basic ${Base64(<client_id>:<client_secret>)} 
~~~

#### Response Parameters

Based on the grant type, the returned JSON contains a different set of tokens.

Input grant type   | Output token types                    |
-------------------|---------------------------------------|
authorization_code | ID Token, Access Token, Refresh Token |
password           | Access Token                          |
refresh_token      | Access Token, Refresh Token           |
client_credentials | Access Token                          |

##### Refresh Tokens for Web and Native Applications

For web and native application types, an additional process is required:

1. Use the Okta Administration UI and check the <b>Allow Offline Access</b> checkbox on the client application page.
2. Pass the <em>offline_access</em> scope to your authorize request.

#### List of Errors 

Error Id                |  Details                                                                                                     |
------------------------+--------------------------------------------------------------------------------------------------------------|
invalid_client          | The specified client id wasn't found. |
invalid_request         | The request structure was invalid. E.g. the basic authentication header was malformed, or both header and form parameters were used for authentication or no authentication information was provided. |
invalid_grant           | The <em>code</em> or <em>refresh_token</em> value was invalid, or the <em>redirect_uri</em> does not match the one used in the authorization request. |
unsupported_grant_type  | The grant_type was not <em>authorization_code</em> or <em>refresh_token</em>. |
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

### Custom scopes and claims
{:.api .api-operation}

> This feature is currently in **Beta** status.

The admin can configure custom scopes and claims via the UI <a href="...link to setup guide">here</a>. When custom scopes and claims are configured for a client, the access tokens that are minted will include the custom claims. It will also include custom scopes if they were part of the request.

#### Custom scopes
If the request that generates the access token contains any custom scopes, those scopes will be part of the <b>scp</b> claim together with the scopes provided from the [OIDC specification](http://openid.net/specs/openid-connect-core-1_0.html).

#### Custom claims
All configured custom claims will be part of the access token. They will be evaluated for the user if the grant type is not <em>client_credentials</em>.

#### Response Example (Access Token)
~~~json
{
  "ver": 1,
  "iss": "https://your-org.okta.com",
  "iat": 1449624026,
  "exp": 1449627626,
  "jti": "UfSITG6BUS_tp77mAN2q",
  "scp": [
    "openid",
    "email",
    "flights",
    "custom"
  ],
  "client_id": "uAaunofWkaDJxukCFeBx",
  "user_id": "00uid4BxXw6I6TV4m0g3",
  "flight_number": "AX102",
  "custom_claim": "CustomValue"
}
~~~

### Introspection Request
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">POST</span> /oauth2/v1/introspect</span>

The API takes an Access Token, Refresh Token, or [ID Token](oidc.html#id-token) and returns whether it is active or not. 
If the token is active, additional data about the token is also returned. If the token is invalid, expired, or revoked, it is considered inactive. 
An implicit client can only introspect its own tokens, while a confidential client may inspect all access tokens.

#### Request Parameters

The following parameters can be posted as a part of the URL-encoded form values to the API.

Parameter       | Description                                                                                         | Type       |
----------------+-----------------------------------------------------------------------------------------------------+------------|
token           | An access token or refresh token.                                                                   | String     |  
token_type_hint | A hint of the type of <em>token</em>.                                                               | String     |
client_id       | The client ID generated as a part of client registration. This is used in conjunction with the <em>client_secret</em> parameter to authenticate the client application. | String |
client_secret   | The client secret generated as a part of client registration. This is used in conjunction with the <em>client_id</em> parameter to authenticate the client application. | String |

##### Token Authentication Methods

The client can authenticate by providing <em>client_id</em> and <em>client_secret</em> as a part of the URL-encoded form parameters (as described in table above),
or it can use basic authentication by providing the <em>client_id</em> and <em>client_secret</em> as an Authorization header using the Basic auth scheme.
Use one authentication mechanism with a given request. Using both returns an error.

For authentication with Basic auth, an HTTP header with the following format must be provided with the POST request.

~~~sh
Authorization: Basic ${Base64(<client_id>:<client_secret>)} 
~~~

#### Response Parameters

Based on the type of token and whether it is active or not, the returned JSON contains a different set of tokens. These are the possible values:

Parameter   | Description                                                                                         | Type       |
------------+-----------------------------------------------------------------------------------------------------+------------|
active      | An access token or refresh token.                                                                   | boolean    |  
token_type  | The type of the token, either <em>access_token</em>, <em>refresh_token</em>, or <em>id_token</em>.  | String     |
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

Custom scopes are added to the list of scopes. Note that this feature is in Beta status.

#### List of Errors 

Error Id                |  Details                                                                                                     |
------------------------+--------------------------------------------------------------------------------------------------------------|
invalid_client          | The specified client id wasn't found. |
invalid_request         | The request structure was invalid. E.g. the basic authentication header was malformed, or both header and form parameters were used for authentication or no authentication information was provided. |

#### Response Example (Success, Access Token)

~~~json
{
    "active" : true,
    "token_type" : "access_token",
    "scope" : "openid profile",
    "client_id" : "a9VpZDRCeFh3Nkk2VdYa",
    "username" : "john.doe@example.com",
    "exp" : 1451606400,
    "iat" : 1451602800,
    "sub" : "00uid4BxXw6I6TV4m0g3",
    "aud" : "ciSZgrA9ROeHkfPCaXsa",
    "iss" : "https://your-org.okta.com",
    "jti" : "4eAWJOCMB3SX8XewDfVR"
}
~~~

#### Response Example (Success, Refresh Token)

~~~json
{
    "active" : true,
    "token_type" : "refresh token",
    "scope" : "openid profile email",
    "client_id" : "a9VpZDRCeFh3Nkk2VdYa",
    "username" : "john.doe@example.com",
    "exp" : 1451606400,
    "sub" : "00uid4BxXw6I6TV4m0g3",
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

<span class="api-uri-template api-uri-get"><span class="api-label">POST</span> /oauth2/v1/revoke</span>

The API takes an Access Token or Refresh Token and revokes it. Revoked tokens are considered inactive at the introspection endpoint. A client may only revoke its own tokens.

#### Request Parameters

The following parameters can be posted as a part of the URL-encoded form values to the API.

Parameter       | Description                                                                                         | Type       |
----------------+-----------------------------------------------------------------------------------------------------+------------|
token           | An access token or refresh token.                                                                   | String     |  
token_type_hint | A hint of the type of <em>token</em>.                                                               | String     |
client_id       | The client ID generated as a part of client registration. This is used in conjunction with the <em>client_secret</em> parameter to authenticate the client application. | String |
client_secret   | The client secret generated as a part of client registration. This is used in conjunction with the <em>client_id</em> parameter to authenticate the client application. | String |

##### Token Authentication Methods

A client may only revoke a token generated for that client.

The client can authenticate by providing <em>client_id</em> and <em>client_secret</em> as a part of the URL-encoded form parameters (as described in table above),
or it can use basic authentication by providing the <em>client_id</em> and <em>client_secret</em> as an Authorization header using the Basic auth scheme.
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
