---
layout: docs_page
title: OAuth 2.0
weight: 4
---
# OAuth 2.0 API

{% api_lifecycle ea %}

Okta is a standards-compliant [OAuth 2.0](http://oauth.net/documentation) authorization server and a certified [OpenID Provider](http://openid.net/certification).

The OAuth 2.0 API provides API security via scoped access tokens, and OpenID Connect provides user authentication and an SSO layer which is lighter and easier to use than SAML.

To understand more about OAuth 2.0 and Okta:

* [Learn about how Okta implemented the OAuth 2.0 standards](/standards/OAuth/index.html)
* Explore the OAuth 2.0 API: [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/e4d286b1af2294bb14a0)
* [Custom OAuth 2.0 Access Tokens video](https://www.youtube.com/watch?v=4aOJm6SF8Ww)

## Endpoints

You can perform authorization and token operations, as well as create, update, and delete Custom Authorization Servers, policies, rules, scopes, or claims.

* [Authorization Operations](#authorization-operations)
* [Authorization Server Operations](#authorization-server-operations)
* [Policy Operations](#policy-operations)
* [Scope Operations](#scope-operations)
* [Claim Operations](#claim-operations)
* [Authorization Server Key Store Operations](#authorization-server-key-store-operations)

### Authorization Operations

Retrieve the information you need to obtain an authorization grant; obtain, validate, and revoke a token; or manage keys.

* [Obtain an Authorization Grant from a User](#obtain-an-authorization-grant-from-a-user)
* [Request a Token](#request-a-token)
* [Introspection Request](#introspection-request)
* [Revoke a Token](#revoke-a-token)
* [Get Keys](#get-keys)
* [Retrieve Authorization Server Metadata](#retrieve-authorization-server-metadata)
* [Retrieve OpenID Connect Metadata](#retrieve-authorization-server-openid-connect-metadata)

#### Obtain an Authorization Grant from a User
{:.api .api-operation}

{% api_operation get /oauth2/:authorizationServerId/v1/authorize %}

This is a starting point for OAuth 2.0 flows such as implicit and authorization code flows. This request authenticates the user and returns tokens along with an authorization grant to the client application as part of the response.

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                              | Type  | DataType | Required | Default          |
|:----------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:------|:---------|:---------|:-----------------|
|     [idp](idps.html)      | The Identity provider used to do the authentication. If omitted, use Okta as the identity provider.                                                                                                                                                                                                                                                                                                                                                      | Query | String   | FALSE    | Okta is the IDP. |
| sessionToken          | An Okta one-time session token. This allows an API-based user login flow (rather than Okta login UI). Session tokens can be obtained via the     [Authentication API](authn.html).                                                                                                                                                                                                                                                                           | Query | String   | FALSE    |                  |
| response_type         | Can be a combination of ``code``, ``token``, and ``id_token``. The chosen combination determines which flow is used; see this reference from the     [OAuth 2.0 specification](https://tools.ietf.org/html/rfc6749#section-3.1.1). The code response type returns an authorization code which can be later exchanged for an Access Token or a Refresh Token.                                                                                                 | Query | String   | TRUE     |                  |
| client_id             | Obtained during either     UI client registration or     [API client registration](oauth-clients.html). It is the identifier for the client and it must match what has been registered in Okta during client registration.                                                                                                                                                                                                                                       | Query | String   | TRUE     |                  |
| redirect_uri          | Specifies the callback location where the authorization code should be sent and it must match what has been registered in Okta during client registration.                                                                                                                                                                                                                                                                                               | Query | String   | TRUE     |                  |
| display               | Specifies how to display the authentication and consent UI. Valid values: ``page`` or ``popup``.                                                                                                                                                                                                                                                                                                                                                         | Query | String   | FALSE    |                  |
| max_age               | Specifies the allowable elapsed time, in seconds, since the last time the end user was actively authenticated by Okta.                                                                                                                                                                                                                                                                                                                                   | Query | String   | FALSE    |                  |
| response_mode         | Specifies how the authorization response should be returned.     [Valid values: ``fragment``, ``form_post``, ``query`` or ``okta_post_message``](#request-parameter-details). If ``id_token`` or ``token`` is specified as the *response_type*, then ``query`` isn&#8217;t allowed as a *response_mode*. Defaults to ``fragment`` in implicit and hybrid flows. Defaults to ``query`` in authorization code flow and cannot be set as ``okta_post_message``. | Query | String   | FALSE    | See Description. |
| scope                 | Can be a combination of reserved scopes and custom scopes. The combination determines the claims that are returned in the Access Token and ID Token. The ``openid`` scope has to be specified to get back an ID Token. If omitted, the default scopes configured in the Custom Authorization Server are used.                                                                                                                                            | Query | String   | TRUE     |                  |
| state                 | A client application provided state string that might be useful to the application upon receipt of the response. It can contain alphanumeric, comma, period, underscore and hyphen characters.                                                                                                                                                                                                                                                           | Query | String   | TRUE     |                  |
| prompt                | Can be either `none` or `login`. The value determines if Okta should not prompt for authentication (if needed), or force a prompt (even if the user had an existing session). Default: The default behavior is based on whether there&#8217;s an existing Okta session.                                                                                                                                                                              | Query | String   | FALSE    | See Description. |
| nonce                 | Specifies a nonce that is reflected back in the ID Token. It is used to mitigate replay attacks.                                                                                                                                                                                                                                                                                                                                                         | Query | String   | TRUE     |                  |
| code_challenge        | Specifies a challenge of     [PKCE](#request-parameter-details). The challenge is verified in the Token request.                                                                                                                                                                                                                                                                                                                                             | Query | String   | FALSE    |                  |
| code_challenge_method | Specifies the method that was used to derive the code challenge. Only S256 is supported.                                                                                                                                                                                                                                                                                                                                                                 | Query | String   | FALSE    |                  |
| login_hint            | A username to prepopulate if prompting for authentication.                                                                                                                                                                                                                                                                                                                                                                                               | Query | String   | FALSE    |                  |
| idp_scope             | A space delimited list of scopes to be provided to the Social Identity Provider when performing [Social Login](social_authentication.html). These scopes are used in addition to the scopes already configured on the Identity Provider.                                                                                                                                                                                                                 | Query | String   | FALSE    |                  |
| request | A JWT created by the client that enables requests to be passed as a single, self-contained parameter. | Query | JWT | FALSE    | See Description. |

##### Request Parameter Details

 * *idp*, *sessionToken* and *idp_scope* are Okta extensions to the [OIDC specification](http://openid.net/specs/openid-connect-core-1_0.html#Authentication).
    All other parameters comply with the [OIDC specification](http://openid.net/specs/openid-connect-core-1_0.html#Authentication) or [OAuth 2.0 specification](https://tools.ietf.org/html/rfc6749) and their behavior is consistent with the specification.
 * Each value for *response_mode* delivers different behavior:
    * ``fragment`` -- Parameters are encoded in the URL fragment added to the *redirect_uri* when redirecting back to the client.
    * ``query`` -- Parameters are encoded in the query string added to the *redirect_uri* when redirecting back to the client.
    * ``form_post`` -- Parameters are encoded as HTML form values that are auto-submitted in the User Agent.Thus, the values are transmitted via the HTTP POST method to the client
      and the result parameters are encoded in the body using the application/x-www-form-urlencoded format.
    * ``okta_post_message`` -- Uses [HTML5 Web Messaging](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) (for example, window.postMessage()) instead of the redirect for the authorization response from the authorization endpoint.
      ``okta_post_message`` is an adaptation of the [Web Message Response Mode](https://tools.ietf.org/html/draft-sakimura-oauth-wmrm-00#section-4.1).
      This value provides a secure way for a single-page application to perform a sign-in flow
      in a popup window or an iFrame and receive the ID token and/or access token back in the parent page without leaving the context of that page.
      The data model for the [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) call is in the next section.
    * The `Referrer-Policy` header is automatically included in the request for `fragment` or `query`, and is set to `Referrer-Policy: no-referrer`. However, a browser is not obligated to respect the `Referrer-Policy` header from a redirect. If the `response_mode` is `query`, the location specified in `redirect_uri` must set this header to prevent leaking authorization codes.
 * Okta requires the OAuth 2.0 *state* parameter on all requests to the authorization endpoint in order to prevent cross-site request forgery (CSRF).
    The OAuth 2.0 specification [requires](https://tools.ietf.org/html/rfc6749#section-10.12) that clients protect their redirect URIs against CSRF by sending a value in the authorize request which binds the request to the user-agent&#8217;s authenticated state.
    Using the *state* parameter is also a countermeasure to several other known attacks as outlined in [OAuth 2.0 Threat Model and Security Considerations](https://tools.ietf.org/html/rfc6819).
 * [Proof Key for Code Exchange](https://tools.ietf.org/html/rfc7636) (PKCE) is a stronger mechanism for binding the authorization code to the client than just a client secret, and prevents [a code interception attack](https://tools.ietf.org/html/rfc7636#section-1) if both the code and the client credentials are intercepted (which can happen on mobile/native devices). The PKCE-enabled client creates a large random string as *code_verifier* and derives *code_challenge* from it using the method specified in *code_challenge_method*.
    Then the client passes the *code_challenge* and *code_challenge_method* in the authorization request for code flow. When a client tries to redeem the code, it must pass the *code_verifier*. Okta recomputes the challenge and returns the requested token only if it matches the *code_challenge* in the original authorization request. When a client, whose *token_endpoint_auth_method* is ``none``, makes a code flow authorization request, *code_challenge* is required.
    Since *code_challenge_method* only supports S256, this means that the value for *code_challenge* must be: `BASE64URL-ENCODE(SHA256(ASCII(*code_verifier*)))`. According to the [PKCE spec](https://tools.ietf.org/html/rfc7636), the *code_verifier* must be at least 43 characters and no more than 128 characters.
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

 * {% api_lifecycle beta %} A consent dialog is displayed depending on the values of three elements:
     * `prompt`, a query parameter used in requests to [`/oauth2/:authorizationServerId/v1/authorize`](/docs/api/resources/oauth2.html#obtain-an-authorization-grant-from-a-user)(Custom Authorization Server) or [`/oauth2/v1/authorize`](/docs/api/resources/oidc.html#authentication-request) (Okta Authorization Server)
     * `consent_method`, a property on [apps](/docs/api/resources/apps.html#settings-7)
     * `consent`, a property on [scopes](/docs/api/resources/oauth2.html#scopes-properties)
 
     | `prompt` Value    | `consent_method`                 | `consent`                   | Result       |
     |:------------------|:---------------------------------|:----------------------------|:-------------|
     | `CONSENT`         | `TRUSTED` or `REQUIRED`          | `REQUIRED`                  | Prompted     |
     | `CONSENT`         | `TRUSTED`                        | `IMPLICIT`                  | Not prompted |
     | `NONE`            | `TRUSTED`                        | `REQUIRED` or `IMPLICIT`    | Not prompted |
     | `NONE`            | `REQUIRED`                       | `REQUIRED`                  | Prompted     |
     | `NONE`            | `REQUIRED`                       | `IMPLICIT`                  | Not prompted | <!--If you change this, change the table in /oauth2.md too. Add 'LOGIN' to first three rows when supported -->
 
 > {% api_lifecycle beta %} Note: Apps created on `/api/v1/apps` default to `consent_method=TRUSTED`, while those created on `/api/v1/clients` default to `consent_method=REQUIRED`.

##### postMessage() Data Model

Use the postMessage() data model to help you when working with the *okta_post_message* value of the *response_mode* request parameter.

*message*:

Parameter         | Description                                                                                        | DataType  |
----------------- | -------------------------------------------------------------------------------------------------- | ----------|
id_token          | The ID Token JWT contains the details of the authentication event and the claims corresponding to the requested scopes. This is returned if the `response_type` includes `id_token`. | String   |
access_token      | The *access_token* used to access `/oauth2/:authorizationServerId/v1/userinfo`. This is returned if the *response_type* included a token. <b>Important</b>: Unlike the ID Token JWT, the *access_token* structure is specific to Okta, and is subject to change. | String    |
state             | If the request contained a `state` parameter, then the same unmodified value is returned back in the response. | String    |
error             | The error-code string providing information if anything goes wrong.                                | String    |
error_description | Additional description of the error.                                                               | String    |

*targetOrigin*:

Specifies what the origin of *parentWindow* must be in order for the postMessage() event to be dispatched
(this is enforced by the browser). The *okta-post-message* response mode always uses the origin from the *redirect_uri*
specified by the client. This is crucial to prevent the sensitive token data from being exposed to a malicious site.

##### Response Parameters
{:.api .api-response .api-response-params}

The response depends on the response mode passed to the API. For example, a *fragment* response mode returns values in the fragment portion of a redirect to the specified *redirect_uri* while a *form_post* response mode POSTs the return values to the redirect URI.
Irrespective of the response mode, the contents of the response contains some of the following.

Parameter         | Description                                                                                        | DataType  |
----------------- | -------------------------------------------------------------------------------------------------- | ----------|
id_token          | The ID Token JWT contains the details of the authentication event and the claims corresponding to the requested scopes. This is returned if the *response_type* includes *id_token*.| String    |
access_token      | The *access_token* that is used to access the resource. This is returned if the *response_type* included a token. | String  |
token_type        | The token type is always `Bearer` and is returned only when *token* is specified as a *response_type*. | String |
code              | An opaque value that can be used to redeem tokens from [token endpoint](#request-a-token). The code has a lifetime of 60 seconds.| String    |
expires_in        | The number of seconds until the *access_token* expires. This is only returned if the response included an *access_token*. | String |
scope             | The scopes of the *access_token*. This is only returned if the response included an *access_token*. | String |
state             | The same unmodified value from the request is returned back in the response. | String |
error             | The error-code string providing information if anything went wrong. | String |
error_description | Further description of the error. | String |

##### Errors

These APIs are compliant with the OpenID Connect and OAuth 2.0 spec with some Okta specific extensions.

[OAuth 2.0 Spec error codes](https://tools.ietf.org/html/rfc6749#section-4.1.2.1)

| Error Id                  | Details                                                                                                                                                                                                          |
|:--------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| unsupported_response_type | The specified response type is invalid or unsupported.                                                                                                                                                           |
| unsupported_response_mode | The specified response mode is invalid or unsupported. This error is also thrown for disallowed response modes. For example, if the query response mode is specified for a response type that includes id_token. |
| invalid_scope             | The scopes list contains an invalid or unsupported value.                                                                                                                                                        |
| server_error              | The server encountered an internal error.                                                                                                                                                                        |
| temporarily_unavailable   | The server is temporarily unavailable, but should be able to process the request at a later time.                                                                                                                |
| invalid_request           | The request is missing a necessary parameter or the parameter has an invalid value.                                                                                                                              |
| invalid_grant             | The specified grant is invalid, expired, revoked, or does not match the redirect URI used in the authorization request.                                                                                          |
| invalid_token             | The provided access token is invalid.                                                                                                                                                                            |
| invalid_client            | The specified client id is invalid.                                                                                                                                                                              |
| access_denied             | The server denied the request.                                                                                                                                                                                   |

[Open-ID Spec error codes](http://openid.net/specs/openid-connect-core-1_0.html#AuthError)

| Error Id           | Details                                                                                           |
|:-------------------|:--------------------------------------------------------------------------------------------------|
| login_required     | The request specified that no prompt should be shown but the user is currently not authenticated. |
| insufficient_scope | The access token provided does not contain the necessary scopes to access the resource.           |

##### Response Example (Success)
{:.api .api-response .api-response-example}

The request is made with a *fragment* response mode.

~~~
https://www.example.com/#
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
&token_type=Bearer&expires_in=3600&scope=openid+email&state=myState
~~~

#### Response Example (Error)
{:.api .api-response .api-response-example}

The requested scope is invalid:

~~~
https://www.example.com/#error=invalid_scope&error_description=The+requested+scope+is+invalid%2C+unknown%2C+or+malformed
~~~

#### Request a Token
{:.api .api-operation}

{% api_operation post /oauth2/:authorizationServerId/v1/token %}

This API returns Access Tokens, ID Tokens, and Refresh Tokens, depending on the request parameters.

##### Request Parameters
{:.api .api-request .api-request-params}

The following parameters can be posted as a part of the URL-encoded form values to the API.

| Parameter             | Description                                                                                                                                                                                                                                                                                                                              | Type   |
|:----------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-------|
| grant_type            | Can be one of the following: `authorization_code`, `password`, `refresh_token`, or `client_credentials`. Determines the mechanism Okta uses to authorize the creation of the tokens.                                                                                                                                                     | String |
| code                  | Required if *grant_type* is `authorization_code`. The value is what was returned from the                       [authorization endpoint](#obtain-an-authorization-grant-from-a-user). The code has a lifetime of 60 seconds.                                                                                                                                                                         | String |
| refresh_token         | Required if the *grant_type* is `refresh_token`. The value is what was returned from this endpoint via a previous invocation.                                                                                                                                                                                                            | String |
| username              | Required if the *grant_type* is `password`.                                                                                                                                                                                                                                                                                              | String |
| password              | Required if the *grant_type* is `password`.                                                                                                                                                                                                                                                                                              | String |
| scope                 | Optional.                  [ Different scopes and tokens](#response-parameters) are returned depending on the values of `scope` and `grant_type`.                                                                                                                                                                                                          | String |
| redirect_uri          | Required if *grant_type* is `authorization_code`. Specifies the callback location where the authorization was sent. This value must match the `redirect_uri` used to generate the original `authorization_code`.                                                                                                                         | String |
| code_verifier         | Required if *grant_type* is `authorization_code`  and `code_challenge` was specified in the original `/authorize` request. This value is the `code_verifier` for                       [PKCE](#request-parameter-details). Okta uses it to recompute the `code_challenge` and verify if it matches the original `code_challenge` in the authorization request. | String |
| client_id             | Required if client has a secret and client credentials are not provided in the Authorization header. This is used in conjunction with `client_secret` to authenticate the client application.                                                                                                                                            | String |
| client_secret         | Required if the client has a secret and client credentials are not provided in the Authorization header, and if `client_assertion_type` isn&#8217;t specified. This client secret is used in conjunction with `client_id` to authenticate the client application.                                                                        | String |
| client_assertion      | Required if the `client_assertion_type` is specified. Contains the JWT signed with the `client_secret`.     [JWT Details](#token-authentication-methods)                                                                                                                                                                                     | String |
| client_assertion_type | Indicates a JWT is being used to authenticate the client. Per the     [Client Authentication spec](http://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication), the valid value is `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`.                                                                                  | String |

{% api_lifecycle beta %} Note: Use the grant type `password` with scopes that require consent only if [the `consent_method`](/docs/api/resources/apps.html#settings-7) for the client is `TRUSTED`. 
Requests for scopes that require consent using the `password` grant type receive a `consent_required` error response if `consent_method` is `REQUIRED`.

##### Refresh Tokens for Web and Native Applications

For web and native application types, an additional process is required:

1. Use the Okta Administration UI and check the **Refresh Token** checkbox under **Allowed Grant Types** on the client application page.
2. Pass the `offline_access` scope to your `/authorize` or `/token` request if you&#8217;re using the `password` grant type.

##### Token Authentication Methods
<!--If you change this section, change the section in oidc.md as well -->

If you authenticate a client with client credentials, provide the [`client_id` and `client_secret`](#request-parameters-1)
using either of the following methods:

* Provide  the `client_id` and `client_secret` in an Authorization header in the Basic auth scheme (`client_secret_basic`). For authentication with Basic auth, an HTTP header with the following format must be provided with the POST request:
  ~~~sh
  Authorization: Basic ${Base64(<client_id>:<client_secret>)}
  ~~~
* Provide `client_id` and `client_secret` as additional parameters to the POST body (`client_secret_post`)
* Provide `client_id` in a JWT that you sign with the `client_secret` using HMAC algorithms HS256, HS384, or HS512. Specify the JWT in `client_assertion` and the type, `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`, in `client_assertion_type` in the request. 

Use only one of these methods in a single request or an error will occur.

>If the value returned by `token_endpoint_auth_method` in the [Dynamic Client Registration API](/docs/api/resources/oauth-clients.html#update-client-application) is not what you wish to use, you can change the value of a client app&#8217;s `token_endpoint_auth_method` with any of the values returned by `token_endpoint_auth_methods_support` (`client_secret_post`, `client_secret_basic`, or `client_secret_jwt`).

You can&#8217;t change this value in the Okta user interface.

##### Token Claims for Client Authentication with Client Secret JWT

If you use a JWT for client authentication (`client_secret_jwt`), use the following token claims:

| Token Claim | Description                                                                          | Type   |
|:------------|:-------------------------------------------------------------------------------------|:-------|
| exp         | Required. The expiration time of the token in seconds since January 1, 1970 UTC.     | Long   |
| iat         | Optional. The issuing time of the token in seconds since January 1, 1970 UTC.        | Long   |
| sub         | Required. The subject of the token. This value must be the same as the `client_id`.  | String |
| aud         | Required. The full URL of the endpoint you&#8217;re using the JWT to authenticate to.| String |
| iss         | Required. The issuer of the token. This value must be the same as the `client_id`.   | String |
| jti         | Optional. The identifier of the token.                                               | String |

Parameter Details

* If `jti` is specified, the token can only be used once. So, for example, subsequent token requests won&#8217;t succeed.
* The `exp` claim will fail the request if the expiration time is more than one hour in the future or has already expired.
* If `iat` is specified, then it must be a time before the request is received.


##### Response Parameters
{:.api .api-response .api-response-params}

Based on the grant type and in some cases scope specified in the request, the response contains different token sets.
Generally speaking, the scopes specified in a request are included in the Access Tokens in the response. 

| Requested grant type | Requested scope                                                            | Tokens in the response                                                                   |
|:---------------------|:---------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------|
| authorization_code   | None                                                                       | Access Token. Contains scopes requested in the `/authorize` endpoint.                    |
| authorization_code   | Any or no scopes plus `offline_access`                                     | Access Token, Refresh Token                                                              |
| authorization_code   | Any or no scopes plus `openid`                                             | Access Token, ID Token                                                                   |
| authorization_code   | Any or no scopes plus `openid` and `offline_access`                        | Access Token, ID Token, Refresh Token                                                    |
| refresh_token        | None                                                                       | Access Token, Refresh Token. Contains scopes used to generate the Refresh Token.         |
| refresh_token        | Subset of scopes used to generate Refresh Token excluding `offline_access` | Access Token. Contains specified scopes.                                                 |
| refresh_token        | Subset of scopes used to generate Refresh Token including `offline_access` | Access Token, Refresh Token                                                              |
| password             | None                                                                       | Access Token. Contains default scopes granted by policy.                                 |
| password             | Any or no scopes plus `offline_access`                                     | Access Token, Refresh Token. Contains specified scopes.                                  |
| password             | Any or no scopes plus `openid`                                             | Access Token, ID Token                                                                   |
| password             | Any or no scopes plus `openid` and `offline_access`                        | Access Token, ID Token, Refresh Token                                                    |
| client_credentials   | Any or no scope                                                            | Access Token. Contains default scopes granted by policy in addition to requested scopes. |

##### List of Errors

| Error Id               | Details                                                                                                                                                                                                    |
|:-----------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| invalid_client         | The specified client ID wasn&#8217;t found or authentication failed.                                                                                                                                       |
| invalid_request        | The request structure was invalid. E.g. the basic authentication header was malformed, or both header and form parameters were used for authentication or no authentication information was provided.      |
| invalid_grant          | The `code`, `refresh_token`, or `username` and `password` combination is invalid, or the `redirect_uri` does not match the one used in the authorization request, or the resource owner password is wrong. |
| unsupported_grant_type | The grant_type is not supported.                                                                                                                                                                           |
| invalid_scope          | The scopes list contains an invalid value.                                                                                                                                                                 |


##### Request Example: Resource Owner Password Credentials Flow
{:.api .api-request .api-request-example}

~~~sh
curl -X POST \
  "https://{yourOktaDomain}.com/oauth2/aus9s3ami4MRoqQR90h7/v1/token" \
  -H "Accept: application/json" \
  -H "Cache-Control: no-cache" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&username=dolores.abernathy%40${org}.com&
      password=<password>&scope=openid&client_id=<client_id>
      & client_secret=<client_secret>"
~~~

##### Response Example: Resource Owner Password Flow
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
~~~
~~~json
{
    "access_token" : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXIiOjEsImp0aSI6IkFULkpfUVlIMlJEckI5R
                      mxDd0hYVVI1WTIzcDg4U1JPS29jajJkd2kwZkhvTVEiLCJpc3MiOiJodHRwczovL3dlc3R3b3JsZC5
                      va3RhLmNvbS9vYXV0aDIvYXVzOXMzYW1pNE1Sb3FRUjkwaDciLCJhdWQiOiJodHRwczovL2hvc3Qud
                      2VzdHdvcmxkLmNvbSIsImlhdCI6MTQ5NDAyNjM1MywiZXhwIjoxNDk0MDMwMzM5LCJjaWQiOiJSMWt
                      yV1NobGZmdUhCbURPZHdZWiIsInVpZCI6IjAwdWFlM3VicDlBSVBTd0JSMGg3Iiwic2NwIjpbIm9wZ
                      W5pZCJdLCJzdWIiOiJkb2xvcmVzLmFiZXJuYXRoeUB3ZXN0d29ybGQuY29tIn0._tLmV0I4MIXCRaL
                      2D_M-TQuNM34GoIz1MeKJL_YPqXk",
    "token_type" : "Bearer",
    "expires_in" : 1800,
    "scope" : "openid",
    "id_token" : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMHVhZTN1YnA5QUlQU3dCUjBoNyIsInZlc
                  iI6MSwiaXNzIjoiaHR0cHM6Ly93ZXN0d29ybGQub2t0YS5jb20vb2F1dGgyL2F1czlzM2FtaTRNUm9xUVI
                  5MGg3IiwiYXVkIjoiUjFrcldTaGxmZnVIQm1ET2R3WVoiLCJpYXQiOjE0OTQwMjYzNTMsImV4cCI6MTQ5N
                  DAzMDI0OSwianRpIjoiSUQuZXVsblJSXzFCWWJQRlZpaWEtYVQtUG4yMVM4R3VqeDJqc21xbGZwTVdvbyI
                  sImFtciI6WyJwd2QiXSwiaWRwIjoiMDBvODc0MGJzcGhNcEtEWGIwaDciLCJhdXRoX3RpbWUiOjE0OTQwM
                  jYzNTMsImF0X2hhc2giOiJmZnJRX25OeEpzME9oRDk3aF9XM0F3In0.dg9qhUlGO-1Gg5nnSAaZlBzYSgu
                  xuEHquhMP9oz8dHQ"
}
~~~

#### Response Example (Success)
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
~~~
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

##### Response Example (Error)
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
~~~
~~~json
{
    "error" : "invalid_client",
    "error_description" : "No client credentials found."
}
~~~

#### Introspection Request
{:.api .api-operation}

{% api_operation post /oauth2/*:authorizationServerId*/v1/introspect %}

The API takes an Access Token or Refresh Token, and returns a boolean indicating whether it is active or not.
If the token is active, additional data about the token is also returned. If the token is invalid, expired, or revoked, it is considered inactive.
An implicit client can only introspect its own tokens, while a confidential client may inspect all tokens.

>Note: ID Tokens are also valid, however, they are usually validated on the service provider or app side of a flow.

##### Request Parameters
{:.api .api-request .api-request-params}

The following parameters can be posted as a part of the URL-encoded form values to the API.

| Parameter             | Description                                                                                                                                                                                                                                                       | Type   |
|:----------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-------|
| token                 | An Access Token or Refresh Token.                                                                                                                                                                                                                                 | String |
| token_type_hint       | A hint of the type of `token`. Valid values are `access_token`, `id_token` and `refresh_token`.                                                                                                                                                                   | Enum   |
| client_id             | Required if client has a secret and client credentials are not provided in the Authorization header. This is used in conjunction with `client_secret`  to authenticate the client application.                                                                    | String |
| client_secret         | Required if the client has a secret and client credentials are not provided in the Authorization header, and if `client_assertion_type` isn&#8217;t specified. This client secret is used in conjunction with `client_id` to authenticate the client application. | String |
| client_assertion      | Required if the `client_assertion_type` is specified. Contains the JWT signed with the `client_secret`.     [JWT Details](#token-authentication-methods)                                                                                                              | String |
| client_assertion_type | Indicates a JWT is being used to authenticate the client. Per the     [Client Authentication spec](http://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication), the valid value is `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`.           | String |

##### Response Parameters
{:.api .api-response .api-response-params}

Based on the type of token and whether it is active or not, the returned JSON contains a different set of information. Besides the claims in the token, the possible top-level members include:

| Parameter  | Description                                                                                                  | Type    |
|:-----------|:-------------------------------------------------------------------------------------------------------------|:--------|
| active     | Indicates whether the presented token is currently active.                                                   | Boolean |
| token_type | The type of the token. The value is always `Bearer`.                                                         | String  |
| scope      | A space-delimited list of scopes.                                                                            | String  |
| client_id  | The ID of the client associated with the token.                                                              | String  |
| username   | The username associated with the token.                                                                      | String  |
| exp        | The expiration time of the token in seconds since January 1, 1970 UTC.                                       | long    |
| iat        | The issuing time of the token in seconds since January 1, 1970 UTC.                                          | long    |
| nbf        | A timestamp in seconds since January 1, 1970 UTC when this token is not to be used before.                   | long    |
| sub        | The subject of the token.                                                                                    | String  |
| aud        | The audience of the token.                                                                                   | String  |
| iss        | The issuer of the token.                                                                                     | String  |
| jti        | The identifier of the token.                                                                                 | String  |
| device_id  | The ID of the device associated with the token                                                               | String  |
| uid        | The user ID. This parameter is returned only if the token is an access token and the subject is an end user. | String  |

For more information about token authentication, see [Token Authentication Methods](#token-authentication-methods).

##### List of Errors

| Error Id        | Details                                                                                                                                                                                               |
|:----------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| invalid_client  | The specified client ID wasn&#8217;t found, or client authentication failed.                                                                                                                          |
| invalid_request | The request structure was invalid. E.g. the basic authentication header was malformed, or both header and form parameters were used for authentication or no authentication information was provided. |

##### Response Example (Success, Access Token)
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
~~~
~~~json
{
    "active" : true,
    "token_type" : "Bearer",
    "scope" : "openid email flights custom",
    "client_id" : "a9VpZDRCeFh3Nkk2VdYa",
    "username" : "john.doe@example.com",
    "exp" : 1451606400,
    "iat" : 1451602800,
    "sub" : "john.doe@example.com",
    "aud" : "https://api.example.com",
    "iss" : "https://{yourOktaDomain}.com/oauth2/orsmsg0aWLdnF3spV0g3",
    "jti" : "AT.7P4KlczBYVcWLkxduEuKeZfeiNYkZIC9uGJ28Cc-YaI",
    "uid" : "00uid4BxXw6I6TV4m0g3",
    "number_of_flights": 2,
    "flight_number": [
      "AX102",
      "CT508"
    ],
    "custom_claim": "CustomValue"
}
~~~

#### Response Example (Success, Refresh Token)
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
~~~
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
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
~~~
~~~json
{
    "active" : false
}
~~~

#### Response Example (Error)
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
~~~
~~~json
{
    "error" : "invalid_client",
    "error_description" : "No client credentials found."
}
~~~

#### Revoke a Token
{:.api .api-operation}

{% api_operation post /oauth2/:authorizationServerId/v1/revoke %}

This API takes an Access Token or Refresh Token and revokes it. Revoked tokens are considered inactive at the introspection endpoint. A client can revoke only its own tokens.

##### Request Parameters
{:.api .api-request .api-request-params}

The following parameters can be posted as a part of the URL-encoded form values to the API.

| Parameter             | Description                                                                                                                                                                                                                                                       | Type   |
|:----------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-------|
| token                 | An access token or refresh token.                                                                                                                                                                                                                                 | String |
| token_type_hint       | A hint of the type of `token`. Valid values are `access_token` and `refresh_token`.                                                                                                                                                                               | Enum   |
| client_id             | The client ID generated as a part of client registration. This is used in conjunction with the *client_secret* parameter to authenticate the client application.                                                                                                  | String |
| client_secret         | Required if the client has a secret and client credentials are not provided in the Authorization header, and if `client_assertion_type` isn&#8217;t specified. This client secret is used in conjunction with `client_id` to authenticate the client application. | String |
| client_assertion      | Required if the `client_assertion_type` is specified. Contains the JWT signed with the `client_secret`.     [JWT Details](#token-authentication-methods)                                                                                                              | String |
| client_assertion_type | Indicates a JWT is being used to authenticate the client. Per the     [Client Authentication spec](http://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication), the valid value is `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`.           | String |

> Native applications should not provide -- and by default do not store -- `client_secret`
(see [Section 5.3.1 of the OAuth 2.0 spec](https://tools.ietf.org/html/rfc6819#section-5.3.1)).
They can omit `client_secret` from the above request parameters when revoking a token.

##### Response Parameters
{:.api .api-response .api-response-params}

A successful revocation is denoted by an empty response with an HTTP 200. Note that revoking an invalid expired, or revoked token is a success so information isn&#8217;t leaked.

A client may only revoke a token generated for that client.

For more information about token authentication, see [Token Authentication Methods](#token-authentication-methods).

##### List of Errors

| Error Id        | Details                                                                                                                                                                                               |
|:----------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| invalid_client  | The specified client id wasn&#8217;t found or client authentication failed.                                                                                                                           |
| invalid_request | The request structure was invalid. E.g. the basic authentication header was malformed, or both header and form parameters were used for authentication or no authentication information was provided. |


##### Response Example (Success)
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 200 OK
~~~

##### Response Example (Error)
{:.api .api-response .api-response-example}
~~~http
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
~~~
~~~json
{
    "error" : "invalid_client",
    "error_description" : "No client credentials found."
}
~~~

#### Logout Request
{:.api .api-operation}

{% api_operation get /oauth2/*:authorizationServerId*/v1/logout %}

This redirect endpoint takes an ID Token and logs the user out of Okta if the subject matches the current Okta session. A `post_logout_redirect_uri` may be specified to redirect the User after the logout has been performed. Otherwise, the user is redirected to the Okta login page.

Note: This is not a server-side API call.

##### Request Parameters

The following parameters can be posted as a part of the URL-encoded form values to the API.

Parameter                | Description                                                                            | Type    | Required  |
-------------------------+----------------------------------------------------------------------------------------+---------+-----------|
id_token_hint            | A valid ID token with a subject matching the current session. | String | TRUE |
post_logout_redirect_uri | Callback location to redirect to after the logout has been performed. It must match the value preregistered in Okta during client registration. | String | FALSE |
state      | If the request contained a `state` parameter, then the same unmodified value is returned back in the response. | String | FALSE |

##### Request Examples

This request initiates a logout and will redirect to the Okta login page on success.

~~~sh
curl -v -X GET \
"https://{yourOktaDomain}.com/oauth2/*:authorizationServerId*/v1/logout?
  id_token_hint=${id_token_hint}
~~~

This request initiates a logout; it redirects to the `post_logout_redirect_uri` on success.

~~~sh
curl -v -X GET \
"https://{yourOktaDomain}.com/oauth2/:authorizationServerId/v1/logout?
  id_token_hint=${id_token_hint}&
  post_logout_redirect_uri=${post_logout_redirect_uri}&
  state=${state}
~~~

#### Get Keys
{:.api .api-operation}

{% api_operation get /oauth2/:authorizationServerId/v1/keys %}

Retrieve the public keys Okta uses to sign the tokens.

##### Response Example
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 200 OK
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
It is safe to cache keys for performance.


Any of the keys listed are used to sign tokens. The order of keys in the result doesn&#8217;t indicate which keys are used.

Standard open-source libraries are available for every major language to perform [JWS](https://tools.ietf.org/html/rfc7515) signature validation.

#### Retrieve Authorization Server Metadata
{:.api .api-operation}

{% api_operation get /oauth2/*:authorizationServerId*/.well-known/oauth-authorization-server %}

This API endpoint returns metadata related to a Custom Authorization Server that can be used by clients to programmatically configure their interactions with Okta.
Custom scopes and custom claims aren&#8217;t returned.

This API doesn&#8217;t require any authentication and returns a JSON object with the following structure.

~~~json
{
    "issuer": "https://{yourOktaDomain}.com",
    "authorization_endpoint": "https://{yourOktaDomain}.com/oauth2/{authorizationServerId}/v1/authorize",
    "token_endpoint": "https://{yourOktaDomain}.com/oauth2/{authorizationServerId}/v1/token",
    "registration_endpoint": "https://{yourOktaDomain}.com/oauth2/v1/clients",
    "jwks_uri": "https://{yourOktaDomain}.com/oauth2/{authorizationServerId}/v1/keys",
    "response_types_supported": [
        "code",
        "token",
        "code token"
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
        "client_credentials"
    ],
    "subject_types_supported": [
        "public"
    ],
    "scopes_supported": [
        "offline_access",
    ],
    "token_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "client_secret_jwt",
        "none"
    ],
    "claims_supported": [
       "ver",
       "jti",
       "iss",
       "aud",
       "iat",
       "exp",
       "cid",
       "uid",
       "scp",
       "sub"
  ],
    "code_challenge_methods_supported": [
        "S256"
    ],
    "introspection_endpoint": "https://{yourOktaDomain}.com/oauth2/{authorizationServerId}/v1/introspect",
    "introspection_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "client_secret_jwt",
        "none"
    ],
    "revocation_endpoint": "https://{yourOktaDomain}.com/oauth2/{authorizationServerId}/v1/revoke",
    "revocation_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "client_secret_jwt",
        "none"
    ]
}
~~~

#### Retrieve Authorization Server OpenID Connect Metadata
{:.api .api-operation}

{% api_operation get /oauth2/*:authorizationServerId*/.well-known/openid-configuration %}

This API endpoint returns OpenID Connect metadata that can be used by clients to programmatically configure their interactions with Okta.

> Note: Custom scopes and claims aren&#8217;t returned. To see your Custom Authorization Server&#8217;s custom scopes, use the [Get All Scopes API](#get-all-scopes), and to see its custom claims use [Get All Claims API](#get-all-claims).

This API doesn&#8217;t require any authentication and returns a JSON object with the following structure.

~~~json
{
    "issuer": "https://{yourOktaDomain}.com",
    "authorization_endpoint": "https://{yourOktaDomain}.com/oauth2/{authorizationServerId}/v1/authorize",
    "token_endpoint": "https://{yourOktaDomain}.com/oauth2/{authorizationServerId}/v1/token",
    "userinfo_endpoint": "https://{yourOktaDomain}.com/oauth2/{authorizationServerId}/v1/userinfo",
    "registration_endpoint": "https://{yourOktaDomain}.com/oauth2/v1/clients",
    "jwks_uri": "https://{yourOktaDomain}.com/oauth2/{authorizationServerId}/v1/keys",
    "response_types_supported": [
        "code",
        "id_token",
        "code id_token",
        "code token",
        "id_token token",
        "code id_token token"
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
    "code_challenge_methods_supported": [
        "S256"
    ],
    "introspection_endpoint": "https://{yourOktaDomain}.com/oauth2/{authorizationServerId}/v1/introspect",
    "introspection_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "none"
    ],
    "revocation_endpoint": "https://{yourOktaDomain}.com/oauth2/{authorizationServerId}/v1/revoke",
    "revocation_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "client_secret_jwt",
        "none"
    ]
}
~~~

### Authorization Server Operations

Use the following operations for Custom Authorization Servers:

* [Create Authorization Server](#create-authorization-server)
* [List Authorization Servers](#list-authorization-servers)
* [Get Authorization Server](#get-authorization-server)
* [Update Authorization Server](#update-authorization-server)
* [Delete Authorization Server](#delete-authorization-server)
* [Activate Authorization Server](#activate-authorization-server)
* [Deactivate Authorization Server](#deactivate-authorization-server)

#### Using the Default Authorization Server

Okta provides a pre-configured Custom Authorization Server with the name `default`.
This default authorization server includes a basic access policy and rule, which you can edit to control access. 
It allows you to specify `default` instead of the `authorizationServerId` in requests to it:

* `https://{yourOktaDomain}.com/api/v1/authorizationServers/default`  vs 
* `https://{yourOktaDomain}.com/api/v1/authorizationServers/:authorizationServerId` for other Customer Authorization Servers

#### Create Authorization Server
{:.api .api-operation}

{% api_operation post /api/v1/authorizationServers %} 

Creates a new Custom Authorization Server with key rotation mode as `AUTO`

##### Request Parameters
{:.api .api-request .api-request-params}

[Authorization Server Properties](#authorization-server-properties)

##### Response Parameters
{:.api .api-request .api-response-params}

The [Custom Authorization Server](#authorization-server-object) you just created.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{ "name": "Sample Authorization Server",
      "description": "Sample Authorization Server description",
      "audiences": [
        "https://test.com"
      ]
}' "https://{yourOktaDomain}.com/api/v1/authorizationServers"
~~~

##### Response Example
{:.api .api-response .api-response-example}

The [Custom Authorization Server](#authorization-server-object) you just created.

#### List Authorization Servers
{:.api .api-operation}

{% api_operation GET /api/v1/authorizationServers %}

Lists all Custom Authorization Servers in this org

##### Request Parameters
{:.api .api-request .api-request-params}

None

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}.com/api/v1/authorizationServers"
~~~

##### Response Example
{:.api .api-response .api-response-example}

The [Custom Authorization Server](#authorization-server-object) in this org.

#### Get Authorization Server
{:.api .api-operation}

{% api_operation get /api/v1/authorizationServers/:authorizationServerId %}

Returns the Custom Authorization Server identified by *authorizationServerId*.

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter             | Description                                                              | Type   | Required |
|:----------------------|:-------------------------------------------------------------------------|:-------|:---------|
| authorizationServerId | Custom Authorization Server ID. You can find the ID in the Okta user interface. | String | True     |

##### Response Parameters
{:.api .api-request .api-response-params}

The [Custom Authorization Server](#authorization-server-object) you requested.

#### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}.com/api/v1/authorizationServers/aus5m9r1o4AsDJLe50g4"
~~~

##### Response Example
{:.api .api-response .api-response-example}

The [Custom Authorization Server](#authorization-server-object) you requested by *:authorizationServerId*.

#### Update Authorization Server
{:.api .api-operation}

{% api_operation put /api/v1/authorizationServers/:authorizationServerId %}

Updates authorization server identified by *authorizationServerId*.

>Switching between rotation modes won&#8217;t change the active signing key.

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter   | Description                                                                                                     | Type                                                                                                    | Required |
|:------------|:----------------------------------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------------|:---------|
| name        | The name of the authorization server                                                                            | String                                                                                                  | TRUE     |
| description | The description of the authorization server                                                                     | String                                                                                                  | FALSE    |
| audiences   | The list of audiences this Custom Authorization Server can issue tokens to, currently Okta only supports one audience. | Array                                                                                                   | TRUE     |
| credentials | The credentials signing object with the `rotationMode` of the authorization server                              |     [Authorization server credentials object](oauth2.html#authorization-server-credentials-signing-object)  | FALSE    |

##### Response Parameters
{:.api .api-request .api-response-params}

The [Custom Authorization Server](#authorization-server-object) you updated

#### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -X PUT \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H "Authorization: SSWS ${api_token}" \
  -d '{
    "name": "New Authorization Server",
    "description": "Authorization Server New Description",
    "audiences": [
      "https://api.new-resource.com"
    ]
}'   "https://${org}/api/v1/authorizationServers/aus1rqsshhhRoat780g7" \
~~~

##### Response Example
{:.api .api-response .api-response-example}

The [Custom Authorization Server](#authorization-server-object) you updated

#### Delete Authorization Server
{:.api .api-operation}

{% api_operation delete /api/v1/authorizationServers/:authorizationServerId %}

Deletes the Custom Authorization Server identified by *authorizationServerId*.

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter             | Description                                  | Type   | Required |
|:----------------------|:---------------------------------------------|:-------|:---------|
| authorizationServerId | The ID of a Custom Authorization Server to delete | String | TRUE     |

##### Response Parameters
{:.api .api-request .api-response-params}

None

#### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -X DELETE \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H "Authorization: SSWS ${api_token}" \
"https://${org}/api/v1/authorizationServers/aus1rqsshhhRoat780g7" \
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~http 
HTTP/1.1 204: No content
~~~

#### Activate Authorization Server
{:.api .api-operation}

{% api_operation post /api/v1/authorizationServers/:authorizationServerId/lifecycle/activate %} 

Make a Custom Authorization Server available for clients

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter             | Description                                    | Type   | Required |
|:----------------------|:-----------------------------------------------|:-------|:---------|
| authorizationServerId | The ID of a Custom Authorization Server to activate | String | TRUE     |

##### Response Parameters
{:.api .api-request .api-response-params}

None.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}.com/api/v1/authorizationServers/aus1sb3dl8L5WoTOO0g7/lifecycle/activate"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~http 
HTTP/1.1 204: No content
~~~

#### Deactivate Authorization Server
{:.api .api-operation}

{% api_operation post /api/v1/authorizationServers/:authorizationServerId/lifecycle/deactivate %} 

Make a Custom Authorization Server unavailable to clients. An inactive Custom Authorization Server can be returned to `ACTIVE` status.

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter             | Description                                      | Type   | Required |
|:----------------------|:-------------------------------------------------|:-------|:---------|
| authorizationServerId | The ID of a Custom Authorization Server to deactivate | String | TRUE     |

##### Response Parameters
{:.api .api-request .api-response-params}

None.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}.com/api/v1/authorizationServers/aus1sb3dl8L5WoTOO0g7/lifecycle/deactivate"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~http 
HTTP/1.1 204: No content
~~~

### Policy Operations

* [Get All Policies](#get-all-policies)
* [Get a Policy](#get-a-policy)
* [Create a Policy](#create-a-policy)
* [Update a Policy](#update-a-policy)
* [Delete a Policy](#delete-a-policy)

#### Get All Policies
{:.api .api-operation}

{% api_operation get /api/v1/authorizationServers/:authorizationServerId/policies %}

Returns all the policies for a specified Custom Authorization Server

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter             | Description                   | Type   | Required |
|:----------------------|:------------------------------|:-------|:---------|
| authorizationServerId | ID of a Custom Authorization Server | String | True     |

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/policies"
~~~

##### Response Example
{:.api .api-response .api-response-example}

Returns [the policies](#policies-object) defined in the specified Custom Authorization Server

#### Get a Policy

{% api_operation get /api/v1/authorizationServers/:authorizationServerId/policies/:policyId %}

Returns the policies defined in the specified Custom Authorization Server ID

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter             | Description                   | Type   | Required |
|:----------------------|:------------------------------|:-------|:---------|
| authorizationServerId | ID of a Custom Authorization Server | String | True     |
| policyId              | ID of a policy                | String | True     |

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/policies/00p5m9xrrBffPd9ah0g4"
~~~

##### Response Example
{:.api .api-response .api-response-example}

Returns [the policy](#policies-object) you requested

#### Create a Policy

{% api_operation post /api/v1/authorizationServers/:authorizationServerId/policies %}

Create a policy for a Custom Authorization Server

##### Request Parameters
{:.api .api-request .api-request-params}

[Policy Object](#policies-object)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
  -d '{
	"type": "OAUTH_AUTHORIZATION_POLICY",
	"status": "ACTIVE",
	"name": "Default Policy",
	"description": "Default policy description",
	"priority": 1,
	"conditions": {
		"clients": {
			"include": [
				"ALL_CLIENTS"
			]
		}
	}
}' "https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/policies"
~~~

##### Response Example
{:.api .api-response .api-response-example}

Returns [the policy](#policies-object) you created

#### Update a Policy

{% api_operation put /api/v1/authorizationServers/:authorizationServerId/policies/:policyId %}

Change the configuration of a policy specified by the *policyId*

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter             | Description                   | Type   | Required |
|:----------------------|:------------------------------|:-------|:---------|
| authorizationServerId | ID of a Custom Authorization Server | String | True     |
| policyId              | ID of a policy                | String | True     |


##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X PUT \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d `{
  "type": "OAUTH_AUTHORIZATION_POLICY",
  "id": "00p5m9xrrBffPd9ah0g4",
  "status": "ACTIVE",
  "name": "default",
  "description": "default policy",
  "priority": 1,
  "system": false,
  "conditions": {
     "clients": {
       "include": [
          "ALL_CLIENTS"
          ]
       }
   }
}' "https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/policies/00p5m9xrrBffPd9ah0g4"
~~~

##### Response Example
{:.api .api-response .api-response-example}

Returns [the policy](#policies-object) you updated

#### Delete a Policy

{% api_operation DELETE /api/v1/authorizationServers/:authorizationServerId/policies/:policyId %}

Delete a policy specified by the *policyId*


##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter             | Description                   | Type   | Required |
|:----------------------|:------------------------------|:-------|:---------|
| authorizationServerId | ID of a Custom Authorization Server | String | True     |
| policyId              | ID of a policy                | String | True     |

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/policies/00p5m9xrrBffPd9ah0g4"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json 
Status 204: No content
~~~

### Scope Operations

* [Get All Scopes](#get-all-scopes)
* [Get a Scope](#get-a-scope)
* [Create a Scope](#create-a-scope)
* [Update a Scope](#update-a-scope)
* [Delete a Scope](#delete-a-scope)

#### Get All Scopes
{:.api .api-operation}

{% api_operation get /api/v1/authorizationServers/:authorizationServerId/scopes %}

Get the scopes defined for a specified Custom Authorization Server

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter             | Description                   | Type   | Required |
|:----------------------|:------------------------------|:-------|:---------|
| authorizationServerId | ID of a Custom Authorization Server | String | True     |

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/scopes"
~~~

##### Response Example
{:.api .api-response .api-response-example}

Returns [the scopes](#scopes-object) defined in the specified Custom Authorization Server


#### Get a Scope

{% api_operation get /api/v1/authorizationServers/:authorizationServerId/scopes/:scopeId %}

Get a scope specified by the *scopeId*

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter             | Description                   | Type   | Required |
|:----------------------|:------------------------------|:-------|:---------|
| authorizationServerId | ID of a Custom Authorization Server | String | True     |
| scopeId               | ID of a scope                 | String | True     |

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/scopes/scpanemfdtktNn7w10h7"
~~~

##### Response Example
{:.api .api-response .api-response-example}

Returns [the scope](#scopes-object) you requested

#### Create a Scope

{% api_operation post /api/v1/authorizationServers/:authorizationServerId/scopes %}

Create a scope for a Custom Authorization Server

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter             | Description                   | Type   | Required |
|:----------------------|:------------------------------|:-------|:---------|
| authorizationServerId | ID of a Custom Authorization Server | String | True     |

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d `{
  "description": "Drive car",
  "name": "car:drive"
}' "https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/scopes"
~~~

##### Response Example
{:.api .api-response .api-response-example}

Returns [the scope](#scopes-object) you created

#### Update a Scope

{% api_operation put /api/v1/authorizationServers/:authorizationServerId/scopes/:scopeId %}

Change the configuration of a scope specified by the *scopeId*

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter             | Description                   | Type   | Required |
|:----------------------|:------------------------------|:-------|:---------|
| authorizationServerId | ID of a Custom Authorization Server | String | True     |
| scopeId               | ID of a scope                 | String | True     |


##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X PUT \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d `{
  "description": "Order car",
  "name": "car:order"
     }'
}' "https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/scopes/scpanemfdtktNn7w10h7"
~~~

##### Response Example
{:.api .api-response .api-response-example}

Returns [the scope](#scopes-object) you updated

#### Delete a Scope

{% api_operation DELETE /api/v1/authorizationServers/:authorizationServerId/scopes/:scopeId %}

Delete a scope specified by the *scopeId*


##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter             | Description                   | Type   | Required |
|:----------------------|:------------------------------|:-------|:---------|
| authorizationServerId | ID of a Custom Authorization Server | String | True     |
| scopeId               | ID of a scope                 | String | True     |

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/scopes/00p5m9xrrBffPd9ah0g4"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~http 
HTTP/1.1 204: No content
~~~

### Claim Operations

* [Get All Claims](#get-all-claims)
* [Get a Claims](#get-a-claim)
* [Create a Claims](#create-a-claim)
* [Update a Claims](#update-a-claim)
* [Delete a Claims](#delete-a-claim)

#### Get All Claims
{:.api .api-operation}

{% api_operation get /api/v1/authorizationServers/:authorizationServerId/claims %}

Get the claims defined for a specified a Custom Authorization Server

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter             | Description                   | Type   | Required |
|:----------------------|:------------------------------|:-------|:---------|
| authorizationServerId | ID of a Custom Authorization Server | String | True     |

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/claims"
~~~

##### Response Example
{:.api .api-response .api-response-example}

Returns [the claims](#claims-object) defined in the specified Custom Authorization Server


#### Get a Claim

{% api_operation get /api/v1/authorizationServers/:authorizationServerId/claims/:claimId %}

Returns the claim specified by the *claimId*

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter             | Description                   | Type   | Required |
|:----------------------|:------------------------------|:-------|:---------|
| authorizationServerId | ID of a Custom Authorization Server | String | True     |
| claimId               | ID of a claim                 | String | True     |

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/claims/scpanemfdtktNn7w10h7"
~~~

##### Response Example
{:.api .api-response .api-response-example}

Returns [the claim](#claims-object) you requested

#### Create a Claim

{% api_operation post /api/v1/authorizationServers/:authorizationServerId/claims %}

Creates a claim for a Custom Authorization Server

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter             | Description                   | Type   | Required |
|:----------------------|:------------------------------|:-------|:---------|
| authorizationServerId | ID of a Custom Authorization Server | String | True     |

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d `{
     "name": "carDriving",
     "status": "ACTIVE",
     "claimType": "RESOURCE",
     "valueType": "EXPRESSION",
     "value": "\"driving!\"",
     "conditions": {
       "scopes": [
         "car:drive"
         ]
       }
    }' "https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/claims"
~~~

##### Response Example
{:.api .api-response .api-response-example}

Returns [the claim](#claims-object) you created

#### Update a Claim

{% api_operation put /api/v1/authorizationServers/:authorizationServerId/claims/:claimId %}

Change the configuration of a claim specified by the *claimId*

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter             | Description                   | Type   | Required |
|:----------------------|:------------------------------|:-------|:---------|
| authorizationServerId | ID of an Authorization server | String | True     |
| claimId               | ID of a claim                 | String | True     |


##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X PUT \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d `{
     "name": "carDriving",
     status": "ACTIVE",
     "claimType": "RESOURCE",
     "valueType": "EXPRESSION",
     "value": "\"driving!\"",
     "alwaysIncludeInToken": "true",
     "system": "false",
     "conditions": {
       "scopes": [
         "car:drive"
         ]
       }
    }'
}' "https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/claims/oclain6za1HQ0noop0h7"
~~~

##### Response Example
{:.api .api-response .api-response-example}

Returns [the claim](#claims-object) you updated

#### Delete a Claim

{% api_operation DELETE /api/v1/authorizationServers/:authorizationServerId/claims/:claimId %}

Delete a claim specified by the *claimId*


##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter             | Description                   | Type   | Required |
|:----------------------|:------------------------------|:-------|:---------|
| authorizationServerId | ID of an Authorization server | String | True     |
| claimId               | ID of a claim                 | String | True     |

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/claims/oclain6za1HQ0noop0h7"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~http 
HTTP/1.1 204: No content
~~~

### Authorization Server Key Store Operations

* [Get Authorization Server Keys](#get-authorization-server-keys)
* [Rotate Authorization Server Keys](#rotate-authorization-server-keys)

#### Get Authorization Server Keys
{:.api .api-operation}

{% api_operation get /api/v1/authorizationServers/:authorizationServerId/credentials/keys %}

Returns the current keys in rotation for a Custom Authorization Server.

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter             | Description | Type | Required |
|:----------------------|:------------|:-----|:---------|
| authorizationServerId | description | type | True     |

##### Response Parameters
{:.api .api-response .api-res-params}

Returns the [keys](#authorization-server-certificate-key-object) defined for a Custom Authorization Server

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/credentials/keys"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
~~~
~~~json
{
  "keys": [
   {
      "status": "ACTIVE",
      "alg": "RS256",
      "e": "AQAB",
      "n": "g0MirhrysJMPm_wK45jvMbbyanfhl-jmTBv0o69GeifPaISaXGv8LKn3-CyJvUJcjjeHE17KtumJWVxUDRzFqtIMZ1ctCZyIAuWO0nLKilg7_EIDXJrS8k14biqkPO1lXGFwtjo3zLHeFSLw6sWf-CEN9zv6Ff3IAXb-RMYpfh-bVrWHH2PJr5HLJuIJIOLWxIgWsWCxjLW-UKI3la-gsahqTnm_r1LSCSYr6N4C-fh--w2_BW8DzTHalBYe76bNr0d7AqtR4tGazmrvc79Wa2bjyxmhhN1u9jSaZQqq-3VZEod8q35v1LoXniJQ4a2W8nDVqb6h4E8MUKYOpljTfQ",
      "kid": "RQ8DuhdxCczyMvy7GNJb4Ka3lQ99vrSo3oFBUiZjzzc",
      "kty": "RSA",
      "use": "sig",
      "_links": {
        "self": {
          "href": "https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/credentials/keys/RQ8DuhdxCczyMvy7GNJb4Ka3lQ99vrSo3oFBUiZjzzc",
          "hints": {
            "allow": [
              "GET"
            ]
          }
        }
      }
    },
    {
      "status": "NEXT",
      "alg": "RS256",
      "e": "AQAB",
      "n": "l1hZ_g2sgBE3oHvu34T-5XP18FYJWgtul_nRNg-5xra5ySkaXEOJUDRERUG0HrR42uqf9jYrUTwg9fp-SqqNIdHRaN8EwRSDRsKAwK
            3HIJ2NJfgmrrO2ABkeyUq6rzHxAumiKv1iLFpSawSIiTEBJERtUCDcjbbqyHVFuivIFgH8L37-XDIDb0XG-R8DOoOHLJPTpsgH-rJe
            M5w96VIRZInsGC5OGWkFdtgk6OkbvVd7_TXcxLCpWeg1vlbmX-0TmG5yjSj7ek05txcpxIqYu-7FIGT0KKvXge_BOSEUlJpBhLKU28
                               OtsOnmc3NLIGXB-GeDiUZiBYQdPR-myB4ZoQ",
      "kid": "Y3vBOdYT-l-I0j-gRQ26XjutSX00TeWiSguuDhW3ngo",
      "kty": "RSA",
      "use": "sig",
      "_links": {
        "self": {
          "href": "https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/credentials/keys/Y3vBOdYT-l-I0j-gRQ26XjutSX00TeWiSguuDhW3ngo",
          "hints": {
            "allow": [
              "GET"
            ]
          }
        }
      }    
    },
    {
      "status": "EXPIRED",
      "alg": "RS256",
      "e": "AQAB",
      "n": "lC4ehVB6W0OCtNPnz8udYH9Ao83B6EKnHA5eTcMOap_lQZ-nKtS1lZwBj4wXRVc1XmS0d2OQFA1VMQ-dHLDE3CiGfsGqWbaiZFdW7U
            GLO1nAwfDdH6xp3xwpKOMewDXbAHJlXdYYAe2ap-CE9c5WLTUBU6JROuWcorHCNJisj1aExyiY5t3JQQVGpBz2oUIHo7NRzQoKimvp
            dMvMzcYnTlk1dhlG11b1GTkBclprm1BmOP7Ltjd7aEumOJWS67nKcAZzl48Zyg5KtV11V9F9dkGt25qHauqFKL7w3wu-DYhT0hmyFc
            wn-tXS6e6HQbfHhR_MQxysLtDGOk2ViWv8AQ",
      "kid": "h5Sr3LXcpQiQlAUVPdhrdLFoIvkhRTAVs_h39bQnxlU",
      "kty": "RSA",
      "use": "sig",
      "_links": {
        "self": {
          "href": "https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/credentials/keys/h5Sr3LXcpQiQlAUVPdhrdLFoIvkhRTAVs_h39bQnxlU",
          "hints": {
            "allow": [
              "GET"
            ]
          }
        }
      }
    },
  ]
}
~~~

* The listed `ACTIVE` key is used to sign tokens issued by the authorization server.
* The listed `NEXT` key is the next key that the authorization server will use to sign tokens when keys are rotated. The NEXT key might not be listed if it has not been generated yet.
* The listed `EXPIRED` key is the previous key that the authorization server used to sign tokens. The EXPIRED key might not be listed if no key has expired or the expired key has been deleted.

#### Rotate Authorization Server Keys
{:.api .api-operation}

{% api_operation post /api/v1/authorizationServers/:authorizationServerId/credentials/lifecycle/keyRotate %}

Rotates the current keys for a Custom Authorization Server. If you rotate keys, the `ACTIVE` key becomes the `EXPIRED` key, the `NEXT` key becomes the `ACTIVE` key, and the Custom Authorization Server immediately issues tokens signed with the new active key.

>Authorization server keys can be rotated in both *MANUAL* and *AUTO* mode, however, it is recommended to rotate keys manually only when the authorization server is in *MANUAL* mode.
>If keys are rotated manually, any intermediate cache should be invalidated and keys should be fetched again using the [get keys](oauth2.html#get-keys) endpoint.

##### Request Parameters
{:.api .api-request .api-request-params}

| Parameter | Description                                             | Type   | Required |
|:----------|:--------------------------------------------------------|:-------|:---------|
| use       | Acceptable usage of the certificate. Can be only `sig`. | String | False    |

##### Response Parameters
{:.api .api-response .api-res-params}

Returns the [keys](#authorization-server-certificate-key-object) defined for a Custom Authorization Server

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "use": "sig"
}' "https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/credentials/lifecycle/keyRotate"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
~~~
~~~json
{
  "keys": [
             {
               "status": "ACTIVE",
               "alg": "RS256",
               "e": "AQAB",
               "n": "g0MirhrysJMPm_wK45jvMbbyanfhl-jmTBv0o69GeifPaISaXGv8LKn3-CyJvUJcjjeHE17KtumJWVxUDRzFqtIMZ1ctCZyIAuWO0nLKilg7_EIDXJrS8k14biqkPO1lXGFwtjo3zLHeFSLw6sWf-CEN9zv6Ff3IAXb-RMYpfh-bVrWHH2PJr5HLJuIJIOLWxIgWsWCxjLW-UKI3la-gsahqTnm_r1LSCSYr6N4C-fh--w2_BW8DzTHalBYe76bNr0d7AqtR4tGazmrvc79Wa2bjyxmhhN1u9jSaZQqq-3VZEod8q35v1LoXniJQ4a2W8nDVqb6h4E8MUKYOpljTfQ",
               "kid": "Y3vBOdYT-l-I0j-gRQ26XjutSX00TeWiSguuDhW3ngo",
               "kty": "RSA",
               "use": "sig",
               "_links": {
                 "self": {
                   "href": "https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/credentials/keys/Y3vBOdYT-l-I0j-gRQ26XjutSX00TeWiSguuDhW3ngo",
                   "hints": {
                     "allow": [
                       "GET"
                     ]
                   }
                 }
               }
    },
             {
               "status": "NEXT",
               "alg": "RS256",
               "e": "AQAB",
               "n": "l1hZ_g2sgBE3oHvu34T-5XP18FYJWgtul_nRNg-5xra5ySkaXEOJUDRERUG0HrR42uqf9jYrUTwg9fp-SqqNIdHRaN8EwRSDRsKAwK
                     3HIJ2NJfgmrrO2ABkeyUq6rzHxAumiKv1iLFpSawSIiTEBJERtUCDcjbbqyHVFuivIFgH8L37-XDIDb0XG-R8DOoOHLJPTpsgH-rJe
                     M5w96VIRZInsGC5OGWkFdtgk6OkbvVd7_TXcxLCpWeg1vlbmX-0TmG5yjSj7ek05txcpxIqYu-7FIGT0KKvXge_BOSEUlJpBhLKU28
                     OtsOnmc3NLIGXB-GeDiUZiBYQdPR-myB4ZoQ",
               "kid": "T5dZ1dYT-l-I0j-gRQ82XjutSX00TeWiSguuDhW3zdf",
               "kty": "RSA",
               "use": "sig",
               "_links": {
                 "self": {
                 "href": "https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/credentials/keys/T5dZ1dYT-l-I0j-gRQ82XjutSX00TeWiSguuDhW3zdf",
                 "hints": {
                   "allow": [
                     "GET"
                   ]
                 }
               }
             }      
    },
    {
      "status": "EXPIRED",
      "alg": "RS256",
      "e": "AQAB",
      "n": "lC4ehVB6W0OCtNPnz8udYH9Ao83B6EKnHA5eTcMOap_lQZ-nKtS1lZwBj4wXRVc1XmS0d2OQFA1VMQ-dHLDE3CiGfsGqWbaiZFdW7U
            GLO1nAwfDdH6xp3xwpKOMewDXbAHJlXdYYAe2ap-CE9c5WLTUBU6JROuWcorHCNJisj1aExyiY5t3JQQVGpBz2oUIHo7NRzQoKimvp
            dMvMzcYnTlk1dhlG11b1GTkBclprm1BmOP7Ltjd7aEumOJWS67nKcAZzl48Zyg5KtV11V9F9dkGt25qHauqFKL7w3wu-DYhT0hmyFc
            wn-tXS6e6HQbfHhR_MQxysLtDGOk2ViWv8AQ",
      "kid": "RQ8DuhdxCczyMvy7GNJb4Ka3lQ99vrSo3oFBUiZjzzc",
      "kty": "RSA",
               "use": "sig",
               "_links": {
                 "self": {
                 "href": "https://{yourOktaDomain}.com/api/v1/authorizationServers/ausnsopoM6vBRB3PD0g3/credentials/keys/RQ8DuhdxCczyMvy7GNJb4Ka3lQ99vrSo3oFBUiZjzzc",
                 "hints": {
                   "allow": [
                     "GET"
                   ]
                 }
               }
             }      
    }
  ]
}
~~~

#### Response Example (Error)
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
~~~
~~~json
{
  "errorCode": "E0000001",
  "errorSummary": "Api validation failed: rotateKeys",
  "errorLink": "E0000001",
  "errorId": "oaeprak9qKHRlaWiclJ4oPJRQ",
  "errorCauses": [
    {
      "errorSummary": "Invalid value specified for key 'use' parameter."
    }
  ]
}
~~~

## Troubleshooting for API Access Management

If you run into trouble setting up an authorization server or performing
other tasks for API Access Management, use the following suggestions to resolve your issues.

### Start with the System Log

The system log contains detailed information about why a request was denied and other useful information.

### Limits

* Scopes are unique per authorization server.

* The `audiences` value you specify is an array of String. If the string contains ":" it must be a valid URI.

* Tokens can expire, be explicitly revoked at the endpoint, or implicitly revoked by a change in configuration.

* Token revocation can be implicit in two ways: token expiration or a change to the source.
    * Expiration happens at different times:
        * ID Token expires after one hour.
        * Access Token expiration is configured in a policy, but is always between five minutes and one day.
        * Refresh Token expiration depends on two factors: 1) Expiration is configured in an Access Policy, no limits,
          but must be greater than or equal to the Access Token lifetime, and 2) Revocation if the Refresh Token
          isn&#8217;t exercised within a specified time. Configure the specified time in an Access Policy, with a minimum of ten minutes.

    * Revocation happens when a configuration is changed or deleted:
        * User deactivation or deletion.
        * Configuration in the authorization server is changed or deleted.
        * The [client app](https://help.okta.com/en/prev/Content/Topics/Apps/Apps_App_Integration_Wizard.htm#OIDCWizard) is deactivated, changed, unassigned, or deleted.

### Subtle Behavior

Some behaviors aren&#8217;t obvious:

* A user must be assigned to the client in Okta for the client to get Access Tokens from that client.
You can assign the client directly (direct user assignment) or indirectly (group assignment).

* If you haven&#8217;t created a rule in a policy in the authorization server to allow the client, user, and
scope combination that you want, the request fails.
To resolve, create at least one rule in a policy in the authorization server for the relevant resource
that specifies client, user, and scope.

* OpenID Connect scopes are granted by default, so if you are requesting only those scopes ( `openid`, `profile`, `email`, `address`, `phone`, or `offline_access` ), you don&#8217;t need to define any scopes for them, but you need a policy and rule
in a Custom Authorization Server. The rule grants the OpenID Connect scopes by default, so they don&#8217;t need to be configured in the rule.
Token expiration times depend on how they are defined in the rules, and which policies and rules match the request.

* OpenID scopes can be requested with custom scopes. For example, a request can include `openid` and a custom scope.

* The evaluation of a policy always takes place during the initial authentication of the user (or of the client in case of client credentials flow). If the flow is not immediately finished, such as when a token is requested using `authorization_code` grant type, the policy is not evaluated again, and a change in the policy after the user or client is initially authenticated won&#8217;t affect the continued flow.

## OAuth 2.0 Data Model

* [Authorization Server Object](#authorization-server-object)
* [Policies Object](#policies-object)
* [Rules Object](#rules-object)
* [Scopes Object](#scopes-object)
* [Claims Object](#claims-object)
* [Conditions Object](#conditions-object)
* [Authorization Server Credential Signing Object](#authorization-server-credentials-signing-object)

### Authorization Server Object

~~~json
{
  "id": "ausain6z9zIedDCxB0h7",
  "name": "Sample Authorization Server",
  "description": "Authorization Server Description",
  "audiences": "https://api.resource.com",
  "issuer": "https://{yourOktaDomain}.com/oauth2/ausain6z9zIedDCxB0h7",
  "status": "ACTIVE",
  "created": "2017-05-17T22:25:57.000Z",
  "lastUpdated": "2017-05-17T22:25:57.000Z",
  "credentials": {
    "signing": {
      "rotationMode": "AUTO",
      "lastRotated": "2017-05-17T22:25:57.000Z",
      "nextRotation": "2017-08-15T22:25:57.000Z",
      "kid": "WYQxoK4XAwGFn5Zw5AzLxFvqEKLP79BbsKmWeuc5TB4"
    }
  },
  "_links": {
      "scopes": {
        "href": "https://{yourOktaDomain}.com/api/v1/authorizationServers/ausain6z9zIedDCxB0h7/scopes",
        "hints": {
          "allow": [
            "GET"
          ]
        }
      },
      "claims": {
        "href": "https://{yourOktaDomain}.com/api/v1/authorizationServers/ausain6z9zIedDCxB0h7/claims",
        "hints": {
          "allow": [
            "GET"
          ]
        }
      },
      "policies": {
        "href": "https://{yourOktaDomain}.com/api/v1/authorizationServers/ausain6z9zIedDCxB0h7/policies",
        "hints": {
          "allow": [
            "GET"
          ]
        }
      }
    },   
    "self": {
      "href": "https:{yourOktaDomain}.com/api/v1/authorizationServers/ausain6z9zIedDCxB0h7",
      "hints": {
        "allow": [
          "GET",
          "DELETE",
          "PUT"
        ]
      }
    },
    "metadata": [
      {
        "name": "oauth-authorization-server",
        "href": "https:{yourOktaDomain}.com/oauth2/ausain6z9zIedDCxB0h7/.well-known/oauth-authorization-server",
        "hints": {
          "allow": [
            "GET"
          ]
        }
      },
      {
        "name": "openid-configuration",
        "href": "{yourOktaDomain}.com/oauth2/ausain6z9zIedDCxB0h7/.well-known/openid-configuration",
        "hints": {
          "allow": [
            "GET"
          ]
        }
      }
    ],
    "rotateKey": {
      "href": "https://{yourOktaDomain}.com/api/v1/authorizationServers/ausain6z9zIedDCxB0h7/credentials/lifecycle/keyRotate",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "deactivate": {
          "href": "https://{yourOktaDomain}.com/api/v1/authorizationServers/ausain6z9zIedDCxB0h7/lifecycle/deactivate",
          "hints": {
            "allow": [
              "POST"
        ]
      }
    }
  }
}
~~~

##### Authorization Server Properties

| Parameter   | Description                                                                                                          | Type                                                                    | Required for create or update |
|:------------|:---------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------|:------------------------------|
| name        | The name of a Custom Authorization Server                                                                                 | String                                                                  | True                          |
| description | The description of a Custom Authorization Server                                                                          | String                                                                  | True                          |
| audiences   | The recipients that the tokens are intended for. This becomes the `aud` claim in an Access Token.                    | Array                                                                   | True                          |
| issuer      | The complete URL for a Custom Authorization Server. This becomes the `iss` claim in an Access Token.                      | String                                                                  | False                         |
| status      | Indicates whether a Custom Authorization Server is `ACTIVE` or `INACTIVE`.                                                | Enum                                                                    | False                         |
| credentials | Keys used to sign tokens.                                                                                            |               [Credentials Object](#authorization-server-credentials-signing-object) | False                         |
| _links      | List of discoverable resources related to a Custom Authorization Server                                                   |       Links                                                                  | False                         |

#### Policies Object

~~~json
{
    "type": "OAUTH_AUTHORIZATION_POLICY",
    "id": "00palyaappA22DPkj0h7",
    "status": "ACTIVE",
    "name": "Vendor2 Policy",
    "description": "Vendor2 policy description",
    "priority": 1,
    "system": false,
    "conditions": {
      "clients": {
        "include": [
          "ALL_CLIENTS"
        ]
      }
    },
    "created": "2017-05-26T19:43:53.000Z",
    "lastUpdated": "2017-06-07T15:28:17.000Z",
    "_links": {
      "self": {
        "href": "{yourOktaDomain}.com/api/v1/authorizationServers/ausain6z9zIedDCxB0h7/policies/00palyaappA22DPkj0h7",
        "hints": {
          "allow": [
            "GET",
            "PUT",
            "DELETE"
          ]
        }
      },
      "deactivate": {
        "href": "{yourOktaDomain}.com/api/v1/authorizationServers/ausain6z9zIedDCxB0h7/policies/00palyaappA22DPkj0h7/lifecycle/deactivate",
        "hints": {
          "allow": [
            "POST"
          ]
        }
      },
      "rules": {
        "href": "https://{yourOktaDomain}.com/api/v1/authorizationServers/ausain6z9zIedDCxB0h7/policies/00palyaappA22DPkj0h7/rules",
        "hints": {
          "allow": [
            "GET"
          ]
        }
      }
    }
  }
~~~

##### Policies Properties

| Parameter   | Description                                                                                                         | Type                                      | Required for create or update            |
|:------------|:--------------------------------------------------------------------------------------------------------------------|:------------------------------------------|:-----------------------------------------|
| type        | Indicates that the policy is an authorization server policy (`OAUTH_AUTHORIZATION_POLICY`)                          | String                                    | False                                    |
| id          | ID of the policy                                                                                                    | String                                    | True except for create or get all claims |
| name        | Name of the policy                                                                                                  | String                                    | True                                     |
| status      | Specifies whether requests have access to this policy. Valid values: `ACTIVE` or `INACTIVE`                         | Enum                                    | True                                     |
| description | Description of the policy                                                                                           | String                                    | True                                     |
| priority    | Specifies the order in which this policy is evaluated in relation to the other policies in a Custom Authorization Server              | Integer                                   | True                                     |
| system      | Specifies whether Okta created this policy (`true`) or not (`false`).                                               | Boolean                                   | True                                     |
| conditions  | Specifies the clients that the policy will be applied to.                                                           |                    [Conditions Object](#conditions-object) | False                                    |
| created     | Timestamp when the policy was created                                                                               | DateTime                                  | System                                   |
| lastUpdated | Timestamp when the policy was last updated                                                                          | DateTime                                  | System                                   |
| _links      | List of discoverable resources related to the policy                                                                | Links                                     | System                                   |

#### Rules Object

~~~json
{
  "type": "RESOURCE_ACCESS",
  "status": "ACTIVE",
  "name": "Default rule",
  "system": false,
  "conditions": {
    "people": {
      "users": {
        "include": [],
        "exclude": []
      },
      "groups": {
        "include": [
          "EVERYONE"
        ],
          "exclude": []
    }
    "scopes": {
      "include": [{
        "name": "*",
        "access": "ALLOW"
      }]
    },
  "token": {
    "accessTokenLifetimeMinutes": 60,
    "refreshTokenLifetimeMinutes": 0,
    "refreshTokenWindowMinutes": 10080
  }
}
~~~

##### Rules Properties

| Parameter  | Description                                                                                   | Type                                     | Required for create or update            |
|:-----------|:----------------------------------------------------------------------------------------------|:-----------------------------------------|:-----------------------------------------|
| id         | ID of the rule                                                                                | String                                   | True except for create or get all claims |
| name       | Name of the rule                                                                              | String                                   | True                                     |
| status     | Specifies whether requests have access to this claim. Valid values: `ACTIVE` or `INACTIVE`    | Enum                                     | True                                     |
| system     | Specifies whether the rule was created by Okta or not                                         | Boolean                                  | True                                     |
| conditions | Specifies the people, groups, grant types and scopes the rule will be applied to              |      [Conditions Object](#conditions-object)  | False                                    |
| token      | Specifies lifetime durations for the token minted                                             | Integer                                  | System generated                         |

Token limits:

* accessTokenLifetimeMinutes: minimum 5 minutes, maximum 1 day 
* refreshTokenLifetimeMinutes: minimum Access Token lifetime
* refreshTokenWindowMinutes: minimum 10 minutes, maximum 90 days

#### Scopes Object

~~~json
[
  {
    "id": "scpainazg3Ekay92V0h7",
    "name": "car:drive",
    "description": "Drive car",
    "system": false,
    "default": false,
    "displayName": "Saml Jackson",
    "consent": "REQUIRED"
  }
]
~~~

##### Scopes Properties

| Parameter                            | Description                                                                                       | Type    | Default    | Required for create or update |
|:-------------------------------------|:--------------------------------------------------------------------------------------------------|:--------|:-----------|:------------------------------|
| id                                   | ID of the scope                                                                                   | String  |            | FALSE                         |
| name                                 | Name of the scope                                                                                 | String  |            | TRUE                          |
| description                          | Description of the scope                                                                          | String  |            | FALSE                         |
| system                               | Whether Okta created the scope                                                                    | Boolean |            | FALSE                         |
| default                              | Whether the scope is a default scope                                                              | Boolean |            | FALSE                         |
| displayName {% api_lifecycle beta %} | Name of the end user displayed in a consent dialog                                                | String  |            | FALSE                         |
| consent {% api_lifecycle beta %}     | Indicates whether a consent dialog is needed for the scope. Valid values: `REQUIRED`, `IMPLICIT`. | Enum    | `IMPLICIT` | FALSE                         |

* {% api_lifecycle beta %} A consent dialog is displayed depending on the values of three elements:
    * `prompt`, a query parameter used in requests to [`/oauth2/:authorizationServerId/v1/authorize`](/docs/api/resources/oauth2.html#obtain-an-authorization-grant-from-a-user)(custom authorization server) or [`/oauth2/v1/authorize`](/docs/api/resources/oidc.html#authentication-request) (Org authorization server)
    * `consent_method`, a property on [apps](/docs/api/resources/apps.html#settings-7)
    * `consent`, a property on scopes as listed in the table above

    | `prompt` Value    | `consent_method`                 | `consent`                   | Result       |
    |:------------------|:---------------------------------|:----------------------------|:-------------|
    | `CONSENT`         | `TRUSTED` or `REQUIRED`          | `REQUIRED`                  | Prompted     |
    | `CONSENT`         | `TRUSTED`                        | `IMPLICIT`                  | Not prompted |
    | `NONE`            | `TRUSTED`                        | `REQUIRED` or `IMPLICIT`    | Not prompted |
    | `NONE`            | `REQUIRED`                       | `REQUIRED`                  | Prompted     |
    | `NONE`            | `REQUIRED`                       | `IMPLICIT`                  | Not prompted | <!--If you change this, change the table in /oauth2.md too. Add 'LOGIN' to first three rows when supported -->

> {% api_lifecycle beta %} Note: Apps created on `/api/v1/apps` default to `consent_method=TRUSTED`, while those created on `/api/v1/clients` default to `consent_method=REQUIRED`.

#### Claims Object

~~~json
[
  {
    "id": "oclain6za1HQ0noop0h7",
    "name": "sub",
    "status": "ACTIVE",
    "claimType": "RESOURCE",
    "valueType": "EXPRESSION",
    "value": "(appuser != null) ? appuser.userName : app.clientId",
    "alwaysIncludeInToken": "TRUE" 
    "conditions": {
      "scopes": []
    },
    "system": true
  },
  {
    "id": "oclain9m7hFik68qr0h7",
    "name": "carDriving",
    "status": "ACTIVE",
    "claimType": "IDENTITY",
    "valueType": "EXPRESSION",
    "value": "\"drivePlease\"",
    "alwaysIncludeInToken": "TRUE" 
    "conditions": {
      "scopes": [
        "car:drive"
      ]
    },
    "system": false
  }
]
~~~

##### Claims Properties

| Parameter            | Description                                                                                                                                                                                                                                      | Type                                                 | Required for create or update            |
|:---------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-----------------------------------------------------|:-----------------------------------------|
| id                   | ID of the claim                                                                                                                                                                                                                                  | String                                               | True except for create or get all claims |
| name                 | Name of the claim                                                                                                                                                                                                                                | String                                               | True                                     |
| status               | Specifies whether requests have access to this claim. Valid values: `ACTIVE` or `INACTIVE`                                                                                                                                                       | Enum                                                 | True                                     |
| claimType            | Specifies whether the claim is for an Access Token (`RESOURCE`) or ID Token (`IDENTITY`)                                                                                                                                                         | Enum                                                 | True                                     |
| valueType            | Specifies whether the claim is an Okta EL expression (`EXPRESSION`), a set of groups (`GROUPS`), or a system claim (`SYSTEM`)                                                                                                                    | Enum                                                 | True                                     |
| value                | Specifies the value of the claim. This value must be a string literal if `valueType` is `GROUPS`, and the string literal is matched with the selected `groupFilterType`. The value must be an Okta EL expression if `valueType` is `EXPRESSION`. | String                                               | True                                     |
| groupFilterType      | Specifies the type of group filter if `valueType` is `GROUPS`.   [Details](#details-for-groupfiltertype)                                                                                                                                           | Enum                                                 | False                                    |
| conditions           | Specifies the scopes for this claim                                                                                                                                                                                                              |                           [Conditions Object](#conditions-object)              | False                                    |
| alwaysIncludeInToken | Specifies whether to include claims in tokens    [Details](#details-for-alwaysincludeintoken)                                                                                                                                                      | Boolean                                              | False                                    |
| system               | Specifies whether Okta created this claim                                                                                                                                                                                                        | Boolean                                              | System                                   |

##### Details for `groupFilterType`

If `valueType` is `GROUPS`, then the groups returned are filtered according to the value of `groupFilterType`:

* `STARTS_WITH`: Group names start with `value` (not case sensitive). For example, if `value` is `group1`, then `group123` and `Group123` are included.
* `EQUALS`: Group name is the same as `value` (not case sensitive). For example, if `value` is `group1`, then `group1` and `Group1` are included, but `group123` isn&#8217;t.
* `CONTAINS`: Group names contain `value` (not case sensitive). For example, if `value` is `group1`, then `MyGroup123` and `group1` are included.
* `REGEX`: Group names match the REGEX expression in `value` (case sensitive). For example if `value` is `/^[a-z0-9_-]{3,16}$/`, then any group name that has at least 3 letters, no more than 16, and contains lower case letters, a hyphen, or numbers. 

If you have complex filters for groups, you can [create a groups whitelist](/docs/how-to/creating-token-with-groups-claim.html) to put them all in a claim.

##### Details for `alwaysIncludeInToken`

* Always `TRUE` for Access Token
* If `FALSE` for an ID Token claim, the claim won&#8217;t be included in the ID Token if ID token is requested with Access Token or `authorization_code`, instead the client has to use Access Token to get the claims from the UserInfo endpoint.

#### Conditions Object

Example from a Rules Object
~~~json
  "conditions": {
    "people": {
      "users": {
        "include": [],
        "exclude": []
      },
      "groups": {
        "include": [
          "EVERYONE"
        ],
        "exclude": []
      }
    "scopes": {
      "include": [{
        "name": "*",
        "access": "ALLOW"
      }]
  }
~~~

Example from a Policy Object
~~~json
"conditions": {
  "clients": {
    "include": [
      "ALL_CLIENTS"
    ]
  }
}
~~~

##### Conditions Properties

| Parameter  | Description                                                                                                                                                                          | Type                          | Required for create or update |
|:-----------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:------------------------------|:------------------------------|
| scopes     | Array of scopes this condition includes or excludes                                                                                                                                  | `include` and `exclude` lists | True                          |
| clients    | For policies, specifies which clients are included or excluded in the policy                                                                                                         | `include` and `exclude` lists | True                          |
| people     | For rules, specifies which users and groups are included or excluded in the rule                                                                                                     | `include` and `exclude` lists | True                          |
| grant_type | Can be one of the following: `authorization_code`, `password`, `refresh_token`, or `client_credentials`. Determines the mechanism Okta uses to authorize the creation of the tokens. | Enum                          | True                          |

#### Authorization Server Credentials Signing Object

~~~json
{
    "credentials": {
      "signing": {
        "rotationMode": "AUTO",
        "lastRotated": "2017-05-17T22:25:57.000Z",
        "nextRotation": "2017-08-15T22:25:57.000Z",
        "kid": "WYQxoK4XAwGFn5Zw5AzLxFvqEKLP79BbsKmWeuc5TB4"
        "use": "sig"
      }
    }
}
~~~

| ------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------- | ---------- | ---------- |
| Property      | Description                                                                                                              | DataType   | Required   | Updatable  |
|:--------------|:-------------------------------------------------------------------------------------------------------------------------|:-----------|:-----------|:-----------|
| kid           | The ID of the key used for signing tokens issued by the authorization server                                             | String     | FALSE      | FALSE      |
| lastRotated   | The timestamp when the authorization server started to use the `kid` for signing tokens                                  | String     | FALSE      | FALSE      |
| nextRotation  | The timestamp when authorization server will change key for signing tokens. Only returned when `rotationMode` is `AUTO`  | String     | FALSE      | FALSE      |
| rotationMode  | The key rotation mode for the authorization server. Can be `AUTO` or `MANUAL`                                            | Enum       | FALSE      | TRUE       |

#### Authorization Server Certificate Key Object

This object defines a [JSON Web Key](https://tools.ietf.org/html/rfc7517) for a signature or encryption credential for an application.

| Parameter | Description                                                                            | Type   |
|:----------|:---------------------------------------------------------------------------------------|:-------|
| alg       | The algorithm used with the key. Valid value: `RS256`                                  | String |
| status    | `ACTIVE`, `NEXT`, or `EXPIRED`                                                         | Enum   |
| e         | RSA key value (exponent) for key blinding                                              | String |
| n         | RSA key value (modulus) for key blinding                                               | String |
| kid       | Unique identifier for the certificate.                                                 | String |
| kty       | Cryptographic algorithm family for the certificate&#8217;s key pair Valid value: `RSA` | String |
| use       | How the key is used. Valid value: `sig`                                                | String |

