---
layout: docs_page
title: OAuth 2.0
---

## Overview

Okta is a fully standards-compliant [OAuth 2.0](http://oauth.net/documentation) authorization server and a certified [OpenID Provider](http://openid.net/certification). 
The OAuth 2.0 APIs provide API security via scoped access tokens, and OpenID Connect provides user authentication and an SSO layer which is lighter and easier to use than SAML.

There are several use cases and Okta product features built on top of the OAuth 2.0 APIs:

* Social Authentication -- {% api_lifecycle ea %}
* OpenID Connect -- {% api_lifecycle ea %}
* API Access Management -- {% api_lifecycle beta %}

It's important to understand which use case you are targeting and build your application according to the correct patterns for that use case. 
The OAuth 2.0 APIs each have several different [query params](#authentication-request) which dictate which type of flow you are using and the mechanics of that flow.

At the very basic level, the main API endpoints are:

* [/oauth2/v1/authorize](#authentication-request) initiates an OAuth or OpenID Connect request.
* [/oauth2/v1/token](#token-request) redeems an authorization grant (returned by the `/oauth2/v1/authorize` endpoint) for an access token.

### Basic Flows

1. Browser/Single-Page Application

    * Optimized for browser-only [Public Clients](https://tools.ietf.org/html/rfc6749#section-2.1)
    * Uses [Implicit Flow](https://tools.ietf.org/html/rfc6749#section-4.2)
    * Access token returned directly from authorization request (Front-channel only)
    * Does not support refresh tokens
    * Assumes Resource Owner and Public Client are on the same device

    ![Broswer/Single-Page Application](/assets/img/browser_spa_implicit_flow.png)
    
2. Native Application

    * Installed on a device or computer, such as mobile applications or installed desktop applications
    * Uses [Authorization Code Grant Flow](https://tools.ietf.org/html/rfc6749#section-4.1)
    * Can use custom redirect URIs like `myApp://oauth:2.0:native`
    
    ![Native Application Flow](/assets/img/native_auth_flow.png)

    > Note: For native applications, the client_id and client_secret are embedded in the source code of the application; in this context, the client secret isn't treated as a secret. 
        Therefore native apps should make use of Proof Key for Code Exchange (PKCE) to mitigate authorization code interception.
        For more information, see the PKCE note in [Parameter Details](#parameter-details).

3. Web Application

    * Server-side app with an end-user
    * Uses [Authorization Code Grant Flow](https://tools.ietf.org/html/rfc6749#section-4.1)
    * Assumes Resource Owner and Client are on separate devices
    * Most secure flow as tokens never pass through user-agent
    
    ![Web Application Flow](/assets/img/web_app_flow.png)

4. Service Application

    * Server-side app with no end-user, such as an on-prem agent
    * Uses [Client Credentials Flow](https://tools.ietf.org/html/rfc6749#section-4.4)
    * Optimized for [Confidential Clients](https://tools.ietf.org/html/rfc6749#section-2.1) acting on behalf of itself or a user
    * Back-channel only flow to obtain an access token using the Client’s credentials
    
    ![Service Application Flow](/assets/img/service_app_flow.png).


    > Note: The OAuth 2.0 specification mandates that clients implement CSRF protection for their redirection URI endpoints. 
    This is what the `state` parameter is used for in the flows described above; the client should send a state value in on the authorization request, 
    and it must validate that returned "state" parameter from the authorization server matches the original value.

### Custom User Experience

By default, the Authorization Endpoint displays the Okta login page and authenticates users if they don't have an existing session. 
If you prefer to use a fully customized user experience, you can instead authenticate the user via the [Authentication API](http://developer.okta.com/docs/api/resources/authn.html). 
This authentication method produces a `sessionToken` which can be passed into the Authorize Endpoint, and the user won't see an Okta login page.

### Access Token

An Access Token is a [JSON web token (JWT)](https://tools.ietf.org/html/rfc7519) encoded in base64URL format that contains [a header](#header), [payload](#payload), and [signature](#signature). A resource server can authorize the client to access particular resources based on the [scopes and claims](#scopes-and-claims) in the Access Token.


### JWT Header


~~~json
{
  "alg": "RS256",
  "kid": "45js03w0djwedsw"
}
~~~


### JWT Payload


~~~json
{
  "ver": 1,
  "jti": "AT.0mP4JKAZX1iACIT4vbEDF7LpvDVjxypPMf0D7uX39RE",
  "iss": "https://your-org.okta.com/oauth2/0oacqf8qaJw56czJi0g4",
  "aud": "nmdP1fcyvdVO11AL7ECm",
  "sub": "00ujmkLgagxeRrAg20g3",
  "iat": 1467145094,
  "exp": 1467148694,
  "cid": "nmdP1fcyvdVO11AL7ECm",
  "uid": "00ujmkLgagxeRrAg20g3",
  "scp": [
    "openid",
    "email",
    "flights",
    "custom"
  ],
  "flight_number": "AX102",
  "custom_claim": "CustomValue"
}
~~~


### JWT Signature

This is a digital signature Okta generates using the public key identified by the `kid` property in the header section.

### Scopes and claims

Access Tokens include reserved scopes and claims.

{% beta %}

Access Tokens can optionally include custom scopes and claims.

{% endbeta %}

#### Reserved scopes and claims

The Okta Authorization Server defines a number of reserved scopes which can't be overridden.
Scopes are defined in the request parameter, and claims are in the Access Token returned from the request.

* [Reserved scopes](#reserved-scopes)
* [Reserved claims in the header section](#reserved-claims-in-the-header-section)
* [Reserved claims in the payload section](#reserved-claims-in-the-payload-section)

##### Reserved scopes

Reserved scopes include [OIDC scopes](oidc.html#scope-dependent-claims-not-always-returned).

##### Reserved claims in the header section

The header only includes the following reserved claims:

|--------------+-----------------------------------------------------------------------------------------------------+--------------|--------------------------|
| Property     | Description                                                                      | DataType     | Example                  |
|--------------+---------+--------------------------------------------------------------------------------------------+--------------|--------------------------|
| alg          | Identifies the digital signature algorithm used. This is always be RS256.      | String       | "RS256"                  |
| kid          | Identifies the `public-key` used to sign the `access_token`. The corresponding `public-key` can be found as a part of the [well-known configuration's](oidc.html#openid-connect-discovery-document) `jwks_uri` value.                                  | String       | "a5dfwef1a-0ead3f5223_w1e" |

##### Reserved claims in the payload section

The payload includes the following reserved claims:

|--------------+-------------------+----------------------------------------------------------------------------------+--------------|--------------------------|
| Property     |  Description                                                                      | DataType     | Example                  |
|--------------+---------+----------+----------------------------------------------------------------------------------+--------------|--------------------------|
| ver     | The semantic version of the Access Token.   |  Integer   |  1    |
| jti     | A unique identifier for this Access Token for debugging and revocation purposes.   | String    |  "AT.0mP4JKAZX1iACIT4vbEDF7LpvDVjxypPMf0D7uX39RE"  |
| iss     | The Issuer Identifier of the response. This value will be the unique identifier for the Authorization Server instance.   | String    | "https://your-org.okta.com/oauth2/0oacqf8qaJw56czJi0g4"     |
| aud     | Identifies the audience that this Access Token is intended for. It will be the client id of your application that requests the Access Token.   | String    | "6joRGIzNCaJfdCPzRjlh"     |
| sub     | The subject. A name for the user or a unique identifier for the client.  | String    | 	"john.doe@example.com"     |
| iat     | The time the Access Token was issued, represented in Unix time (seconds).   | Integer    | 1311280970     |
| exp     | The time the Access Token expires, represented in Unix time (seconds).   | Integer    | 1311280970     |
| cid     | Client ID of your application that requests the Access Token.  | String    | "6joRGIzNCaJfdCPzRjlh"     |
| uid     | A unique identifier for the user. It will not be included in the Access Token if there is no user bound to it.  | String    | 	"00uk1u7AsAk6dZL3z0g3"     |
| scp     | Array of scopes that are granted to this Access Token.   | Array    | [ "openid", "custom" ]     |
| groups  | The groups that the user is a member of that also match the Access Token group filter of the client app. | Array    | [ "Group1", "Group2", "Group3" ]    |

>*Note:* The groups claim will only be returned in the Access Token if the <b>groups</b> scope was included in the authorization request. To protect against arbitrarily large numbers of groups matching the group filter, the groups claim has a limit of 100. If more than 100 groups match the filter, then the request fails. Expect that this limit may change in the future.

{% beta %}
#### Custom scopes and claims

The admin can configure custom scopes and claims via the Authorization Server tab for the Application. Access Tokens are minted with all the configured custom claims and all the configured custom scopes that are included in the authorization request.

##### Custom scopes

If the request that generates the access token contains any custom scopes, those scopes will be part of the *scp* claim together with the scopes provided from the [OIDC specification](http://openid.net/specs/openid-connect-core-1_0.html). The form of these custom scopes must conform to the [OAuth2 specification](https://tools.ietf.org/html/rfc6749#section-3.3).

>*Note:* Scope names can contain the characters < (less than) or > (greater than), but not both characters.

##### Custom claims

All configured custom claims will be included in the access token. They will be evaluated for the user if the grant type is not *client_credentials*.

{% endbeta %}

### Validating Access Tokens

Okta uses public key cryptography to sign tokens and verify that they are valid. 

The resource server must validate the Access Token before allowing the client to access protected resources.

Access Tokens are sensitive and can be misused if intercepted. Transmit them only over HTTPS and only via POST data or within request headers. If you store them on your application, you must store them securely.

Access Token must be validated in the following manner:

1. Verify that the `iss` (issuer) claim matches the identifier of your authorization server.
2. Verify that the `aud` (audience) and `cid` (client id) claim are your client id.
3. Verify the signature according to [JWS](https://tools.ietf.org/html/rfc7515) using the algorithm specified in the JWT `alg` header parameter. Use the public keys provided by Okta via the [Discovery Document](oidc.html#openid-connect-discovery-document).
4. Verify that the expiry time (from the `exp` claim) has not already passed.

Step 3 uses the same signature verification method as the [ID token](oidc.html#validating-id-tokens).

The signing keys for the Access Token are rotated in the same was as the [ID token](oidc.html#validating-id-tokens).

#### Alternative Validation

You can use an [introspection endpoint](#introspection-request) for validation.

### Refresh Token

A Refresh Token is an opaque string. It is a long-lived token that the client can use to obtain a new Access Token without re-obtaining authorization from the resource owner. The new Access Token must have the same or subset of the scopes associated with the Refresh Token.
To get a Refresh Token, the Authentication or Token requests must contain the `offline_access` scope.

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
response_type     | Can be a combination of *code*, *token*, and *id_token*. The chosen combination determines which flow is used; see this reference from the [OIDC specification](http://openid.net/specs/openid-connect-core-1_0.html#Authentication). The code response type returns an authorization code which can be later exchanged for an Access Token or a Refresh Token. | Query        | String   |   TRUE   |  |
client_id         | Obtained during either [UI client registration](../../guides/social_authentication.html) or [API client registration](oauth-clients.html). It is the identifier for the client and it must match what is preregistered in Okta. | Query        | String   | TRUE     | 
redirect_uri      | Specifies the callback location where the authorization code should be sent and it must match what is preregistered in Okta as a part of client registration. | Query        | String   |  TRUE    | 
display           | Specifies how to display the authentication and consent UI. Valid values: *page* or *popup*.  | Query        | String   | FALSE     |  |
max_age           | Specifies the allowable elapsed time, in seconds, since the last time the end user was actively authenticated by Okta. | Query      | String    | FALSE    | |
response_mode     | Specifies how the authorization response should be returned. [Valid values: *fragment*, *form_post*, *query* or *okta_post_message*](#parameter-details). If *id_token* or *token* is specified as the response type, then *query* isn't allowed as a response mode. Defaults to *fragment* in implicit and hybrid flow. Defaults to *query* in authorization code flow and cannot be set as *okta_post_message*. | Query        | String   | FALSE      | See Description.
scope          | Can be a combination of *openid*, *profile*, *email*, *address* and *phone*. The combination determines the claims that are returned in the id_token. The openid scope has to be specified to get back an id_token. | Query        | String   | TRUE     | 
state          | A client application provided state string that might be useful to the application upon receipt of the response. It can contain alphanumeric, comma, period, underscore and hyphen characters.   | Query        | String   |  TRUE    | 
prompt         | Can be either *none* or *login*. The value determines if Okta should not prompt for authentication (if needed), or force a prompt (even if the user had an existing session). Default: The default behavior is based on whether there's an existing Okta session. | Query        | String   | FALSE     | See Description. 
nonce          | Specifies a nonce that is reflected back in the ID Token. It is used to mitigate replay attacks. | Query        | String   | TRUE     | 
code_challenge | Specifies a challenge of [PKCE](#parameter-details). The challenge is verified in the Access Token request.  | Query        | String   | FALSE    | 
code_challenge_method | Specifies the method that was used to derive the code challenge. Only S256 is supported.  | Query        | String   | FALSE    | 

#### Parameter Details
 
 * *idp* and *sessionToken* are Okta extensions to the [OIDC specification](http://openid.net/specs/openid-connect-core-1_0.html#Authentication). 
    All other parameters comply with the [OAuth 2.0 specification](https://tools.ietf.org/html/rfc6749) and their behavior is consistent with the specification.
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

<span class="api-uri-template api-uri-get"><span class="api-label">POST</span> /oauth2/v1/token</span>

The API takes a grant type of either *authorization_code*, *password*, or *refresh_token* and the corresponding credentials and returns back an Access Token. A Refresh Token will be returned if the client supports refresh tokens and the offline_access scope is requested. Additionally, using the authorization code grant type will return an ID Token if the *openid* scope is requested.

> Note:  No errors occur if you use this endpoint, but it isn’t useful until custom scopes or resource servers are available. We recommend you wait until custom scopes and resource servers are available.

#### Request Parameters

The following parameters can be posted as a part of the URL-encoded form values to the API.

Parameter          | Description                                                                                         | Type       |
-------------------+-----------------------------------------------------------------------------------------------------+------------|
grant_type         | Can be one of the following: *authorization_code*, *password*, *refresh_token*, or *client_credentials* {% api_lifecycle beta %}. Determines the mechanism Okta will use to authorize the creation of the tokens. | String |  
code               | Expected if grant_type specified *authorization_code*. The value is what was returned from the /oauth2/v1/authorize endpoint. | String
refresh_token      | Expected if the grant_type specified *refresh_token*. The value is what was returned from this endpoint via a previous invocation. | String |
username           | Expected if the grant_type specified *password*. | String |
password           | Expected if the grant_type specified *password*. | String |
scope              | Optional if *refresh_token*, or *password* is specified as the grant type. This is a list of scopes that the client wants to be included in the Access Token. For the *refresh_token* grant type, these scopes have to be subset of the scopes used to generate the Refresh Token in the first place. | String |
redirect_uri       | Expected if grant_type is *authorization_code*. Specifies the callback location where the authorization was sent; must match what is preregistered in Okta for this client. | String |
code_verifier      | The code verifier of [PKCE](#parameter-details). Okta uses it to recompute the code_challenge and verify if it matches the original code_challenge in the authorization request. | String |

> The [Client Credentials](https://tools.ietf.org/html/rfc6749#section-4.4) flow (if `grant_types` is `client_credentials`) is currently **Beta**.


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

1. Use the Okta Administration UI and check the <b>Refresh Token</b> checkbox under <b>Allowed Grant Types</b> on the client application page.
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

### Introspection Request
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">POST</span> /oauth2/v1/introspect</span>

The API takes an Access Token or Refresh Token, and returns a boolean indicating whether it is active or not. 
If the token is active, additional data about the token is also returned. If the token is invalid, expired, or revoked, it is considered inactive. 
An implicit client can only introspect its own tokens, while a confidential client may inspect all access tokens.

> Note; [ID Tokens](oidc.html#id-token) are also valid, however, they are usually validated on the service provider or app side of a flow.

#### Request Parameters

The following parameters can be posted as a part of the URL-encoded form values to the API.

Parameter       | Description                                                                                         | Type       |
----------------+-----------------------------------------------------------------------------------------------------+------------|
token           | An access token or refresh token.                                                                   | String     |  
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
    "aud" : "ciSZgrA9ROeHkfPCaXsa",
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

<span class="api-uri-template api-uri-get"><span class="api-label">POST</span> /oauth2/v1/revoke</span>

The API takes an Access Token or Refresh Token and revokes it. Revoked tokens are considered inactive at the introspection endpoint. A client may only revoke its own tokens.

> Note: No errors occur if you use this endpoint, but it isn’t useful until custom scopes or resource servers are available. We recommend you wait until custom scopes and resource servers are available.

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
