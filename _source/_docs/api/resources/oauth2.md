---
layout: docs_page
title: OAuth 2.0
---

# OAuth 2.0 API

Okta is a fully standards-compliant [OAuth 2.0](http://oauth.net/documentation) authorization server and a certified [OpenID Provider](http://openid.net/certification).
The OAuth 2.0 APIs provide API security via scoped access tokens, and OpenID Connect provides user authentication and an SSO layer which is lighter and easier to use than SAML.

There are several use cases and Okta product features built on top of the OAuth 2.0 APIs:

* Social Authentication -- {% api_lifecycle ea %}
* OpenID Connect -- {% api_lifecycle ea %}
* API Access Management -- {% api_lifecycle ea %}

It's important to understand which use case you are targeting and build your application according to the correct patterns for that use case.
The OAuth 2.0 APIs each have several different [query params](#authentication-request) which dictate which type of flow you are using and the mechanics of that flow.

At the very basic level, the main API endpoints are:

* [Authorize](#authentication-request) endpoint initiates an OAuth 2.0 request.
* [Token](#token-request) endpoint redeems an authorization grant (returned by the [Authorize](#authentication-request) endpoint) for an access token.

## Getting Started

If you are new to OAuth 2.0, read this topic before experimenting with the Postman collection. If you are familiar with the
flows defined by [the OAuth 2.0 spec](http://oauth.net/documentation), you may want to experiment with the Postman collection first:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/4adca9a35eab5716d9f6)

## Basic Flows

1. Browser/Single-Page Application

    * Optimized for browser-only [Public Clients](https://tools.ietf.org/html/rfc6749#section-2.1)
    * Uses [Implicit Flow](https://tools.ietf.org/html/rfc6749#section-4.2)
    * Access token returned directly from authorization request (Front-channel only)
    * Does not support refresh tokens
    * Assumes Resource Owner and Public Client are on the same device

    {% img browser_spa_implicit_flow.png alt:"Browser/Single-Page Application" %}

2. Native Application

    * Installed on a device or computer, such as mobile applications or installed desktop applications
    * Uses [Authorization Code Grant Flow](https://tools.ietf.org/html/rfc6749#section-4.1)
    * Can use custom redirect URIs like `myApp://oauth:2.0:native`

    {% img native_auth_flow.png alt:"Native Application Flow" %}

    > Note: For native applications, the client_id and client_secret are embedded in the source code of the application; in this context, the client secret isn't treated as a secret.
        Therefore native apps should make use of Proof Key for Code Exchange (PKCE) to mitigate authorization code interception.
        For more information, see the PKCE note in [Parameter Details](#parameter-details).

3. Web Application

    * Server-side app with an end-user
    * Uses [Authorization Code Grant Flow](https://tools.ietf.org/html/rfc6749#section-4.1)
    * Assumes Resource Owner and Client are on separate devices
    * Most secure flow as tokens never pass through user-agent

    {% img web_app_flow.png alt:"Web Application Flow" %}

4. Service Application

    * Server-side app with no end-user, such as an on-prem agent
    * Uses [Client Credentials Flow](https://tools.ietf.org/html/rfc6749#section-4.4)
    * Optimized for [Confidential Clients](https://tools.ietf.org/html/rfc6749#section-2.1) acting on behalf of itself or a user
    * Back-channel only flow to obtain an access token using the Client’s credentials

    {% img service_app_flow.png alt:"Service Application Flow" %}.


    > Note: The OAuth 2.0 specification mandates that clients implement CSRF protection for their redirection URI endpoints.
    This is what the `state` parameter is used for in the flows described above; the client should send a state value in on the authorization request,
    and it must validate that returned "state" parameter from the authorization server matches the original value.

## Custom User Experience

By default, the Authorization Endpoint displays the Okta login page and authenticates users if they don't have an existing session.
If you prefer to use a fully customized user experience, you can instead authenticate the user via the [Authentication API](/docs/api/resources/authn.html).
This authentication method produces a `sessionToken` which can be passed into the Authorize Endpoint, and the user won't see an Okta login page.

## Access Token

An Access Token is a [JSON web token (JWT)](https://tools.ietf.org/html/rfc7519) encoded in base64URL format that contains [a header](#jwt-header), [payload](#jwt-payload), and [signature](#jwt-signature). A resource server can authorize the client to access particular resources based on the [scopes and claims](#scopes-and-claims) in the Access Token.

The lifetime of Access Token can be configured in the [Access Policies](#access-policies). If the client that
issued the token is deactivated, the token is immediately and permanently invalidated. Reactivating the
client does not make the token valid again.

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
  "aud": "https://api.you-company.com",
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
  "number_of_flights": 2,
  "flight_number": [
    "AX102",
    "CT508"
  ],
  "custom_claim": "CustomValue"
}
~~~


### JWT Signature

This is a digital signature Okta generates using the public key identified by the `kid` property in the header section.

## Scopes and claims

Access Tokens include reserved scopes and claims, and can optionally include custom scopes and claims.

Scopes are requested in the request parameter, and the authorization server uses the [Access Policies](#access-policies) to decide if they can be granted or not. If any of the requested scopes are rejected by the [Access Policies](#access-policies), the request will be rejected.

Based on the granted scopes, claims are added into the Access Token returned from the request.

### Reserved scopes and claims

The Okta Authorization Server defines a number of reserved scopes and claims which can't be overridden.

* [Reserved scopes](#reserved-scopes)
* [Reserved claims in the header section](#reserved-claims-in-the-header-section)
* [Reserved claims in the payload section](#reserved-claims-in-the-payload-section)

#### Reserved scopes

Reserved scopes include 'openid', 'profile', 'email', 'address', 'phone', 'offline_access', all defined in OpenID Connect.

#### Reserved claims in the header section

The header only includes the following reserved claims:

|--------------+-----------------------------------------------------------------------------------------------------+--------------|--------------------------|
| Property     | Description                                                                      | DataType     | Example                  |
|--------------+---------+--------------------------------------------------------------------------------------------+--------------|--------------------------|
| alg          | Identifies the digital signature algorithm used. This is always be RS256.      | String       | "RS256"                  |
| kid          | Identifies the `public-key` used to sign the `access_token`. The corresponding `public-key` can be found as a part of the [metadata](#authorization-server-metadata) `jwks_uri` value.                                  | String       | "a5dfwef1a-0ead3f5223_w1e" |

#### Reserved claims in the payload section

The payload includes the following reserved claims:

|--------------+-------------------+----------------------------------------------------------------------------------+--------------|--------------------------|
| Property     |  Description                                                                      | DataType     | Example                  |
|--------------+---------+----------+----------------------------------------------------------------------------------+--------------|--------------------------|
| ver     | The semantic version of the Access Token.   |  Integer   |  1    |
| jti     | A unique identifier for this Access Token for debugging and revocation purposes.   | String    |  "AT.0mP4JKAZX1iACIT4vbEDF7LpvDVjxypPMf0D7uX39RE"  |
| iss     | The Issuer Identifier of the response. This value will be the unique identifier for the Authorization Server instance.   | String    | "https://your-org.okta.com/oauth2/0oacqf8qaJw56czJi0g4"     |
| aud     | Identifies the audience(resource URI) that this Access Token is intended for. | String    | "http://api.example.com/api"     |
| sub     | The subject. A name for the user or a unique identifier for the client.  | String    | 	"john.doe@example.com"     |
| iat     | The time the Access Token was issued, represented in Unix time (seconds).   | Integer    | 1311280970     |
| exp     | The time the Access Token expires, represented in Unix time (seconds).   | Integer    | 1311280970     |
| cid     | Client ID of your application that requests the Access Token.  | String    | "6joRGIzNCaJfdCPzRjlh"     |
| uid     | A unique identifier for the user. It will not be included in the Access Token if there is no user bound to it.  | String    | 	"00uk1u7AsAk6dZL3z0g3"     |
| scp     | Array of scopes that are granted to this Access Token.   | Array    | [ "openid", "custom" ]     |


### Custom scopes and claims

The admin can configure custom scopes and claims for the Authorization Server.

#### Custom scopes

If the request that generates the access token contains any custom scopes, those scopes will be part of the *scp* claim together with the scopes provided from the [OIDC specification](http://openid.net/specs/openid-connect-core-1_0.html). The form of these custom scopes must conform to the [OAuth2 specification](https://tools.ietf.org/html/rfc6749#section-3.3).

>*Note:* Scope names can contain the characters < (less than) or > (greater than), but not both characters.

#### Custom claims

Custom claims are associated with scopes. If one of the associated scopes is granted to the Access Token, the custom claim is added into it. The value of a custom claim can be either an [expression](/reference/okta_expression_language/) or a group filter. The expression is evaluated at runtime, and if the evaluated result is null, that custom claim isn't added into the Access Token. The datatype of a claim is Array if its value is a group filter, or the same datatype as the evaluated result if its value is an expression.

>*Note:* For the custom claim with group filter, its value has a limit of 100. If more than 100 groups match the filter, then the request fails. Expect that this limit may change in the future.

## Validating Access Tokens

Okta uses public key cryptography to sign tokens and verify that they are valid.

The resource server must validate the Access Token before allowing the client to access protected resources.

Access Tokens are sensitive and can be misused if intercepted. Transmit them only over HTTPS and only via POST data or within request headers. If you store them on your application, you must store them securely.

An Access Token must be validated in the following manner:

1. Verify that the `iss` (issuer) claim matches the identifier of your authorization server.
2. Verify that the `aud` (audience) claim is the requested URL.
3. Verify `cid` (client id) claim is your client id.
4. Verify the signature of the Access Token according to [JWS](https://tools.ietf.org/html/rfc7515) using the algorithm specified in the JWT *alg* header property. Use the public keys provided by Okta via the [Get Keys endpoint](#get-keys).
5. Verify that the expiry time (from the `exp` claim) has not already passed.

Step 4 involves downloading the public JWKS from Okta (specified by the *jwks_uri* property in the [authorization server metadata](#authorization-server-metadata). The result of this call is a [JSON Web Key](https://tools.ietf.org/html/rfc7517) set.

Each public key is identified by a *kid* attribute, which corresponds with the *kid* claim in the [Access Token header](#token-authentication-method).

The Access Token is signed by an RSA private key, and we publish the future signing key well in advance.
However, in an emergency situation you can still stay in sync with Okta's key rotation. Have your application check the `kid`, and if it has changed and the key is missing from the local cache, check the `jwks_uri` value in the [authorization server metadata](#authorization-server-metadata) and you can go back to the [jwks uri](#get-keys) to get keys again from Okta

Please note the following:

* For security purposes, Okta automatically rotates keys used to sign the token.
* The current key rotation schedule is four times a year. This schedule can change without notice.
* In case of an emergency, Okta can rotate keys as needed.
* Okta always publishes keys to the JWKS.
* To save the network round trip, your app can cache the JWKS response locally. The standard HTTP caching headers are used and should be respected.
{% beta %}
* The administrator can switch the authorization server key rotation mode to `MANUAL` by [updating the authorization server](#update-authorization-server) and then control when to [rotate the keys](#rotate-authorization-server-keys).
{% endbeta %}

Keys used to sign tokens automatically rotate and should always be resolved dynamically against the published JWKS. Your app can fail if you hardcode public keys in your applications. Be sure to include key rollover in your implementation.

### Alternative Validation

You can use an [introspection endpoint](#introspection-request) for validation.

## Refresh Token

A Refresh Token is an opaque string. It is a long-lived token that the client can use to obtain a new Access Token without re-obtaining authorization from the resource owner. The new Access Token must have the same or subset of the scopes associated with the Refresh Token.
A Refresh Token will be returned if 'offline_access' scope is requested using authorization_code, password, or refresh_token grant type.


The lifetime of a Refresh Token is configured in [Access Policies](#access-policies), the minimum value is 24 hours. The refresh token can also expire after a period if no clients redeem it for an Access Token. The period should be equal to or larger than 10 minutes. If the token's lifetime is set to unlimited, the Authorization Server will not check if clients use it or not.

### Refresh Token Revocation

Refresh Tokens can be revoked explicitly by making a [Revocation Request](#revocation-request). Additionally, all Refresh Tokens associated with an entity are revoked when the entity is deactivated, deleted, or otherwise modified in a way that invalidates the associated Refresh Tokens. Such ways includes:

* The User is Suspended or Deactivated
* The Client App is Deactivated or Deleted
* The Authorization Server's Resource URI is modified, or the Authorization Server is deleted.

No other modifications affect existing tokens.

## ID Token
An Authorization Server can also issue an ID Token to the client, as in [OIDC](oidc#id-token), but with the following differences:

* The ID Token cannot contain a reserved scope or claim called 'groups'. To obtain a claim with group information, administrators must define a custom claim with a group filter and associate it with a scope.
* The custom properties in the app user profile are not included in the Id Token by default, even if profile scope is granted. To obtain a claim for a custom property, administrators must define a custom claim with an Okta Expression Language expression and associate it with a scope.

The lifetime of an Id Token is 1 hour. If the client that issued the token is deactivated, the token is
immediately and permanently invalidated. Reactivating the client does not make the token valid again.

The same validation steps for [OIDC](oidc.html#validating-id-tokens) can also be applied to Id Token for
OAuth2, except the public keys should be retrieved via the [Get Keys endpoint](#get-keys).

## Access Policies

Access policies define which scopes and claims can be granted to a request and the lifetime of the granted tokens.

### Policies

The admin defines Policies for the OAuth 2.0 clients which are ordered numerically by priority. This priority determines the order in which they are searched for a client match. The highest priority policy has a priorityOrder of 1.

For example, assume the following conditions are in effect.

- Policy A has priority 1 and applies to client C;
- Policy B has priority 2 and applies to all the clients;

Because Policy A has a higher priority, the requests coming from client C are evaluted by Policy A first. Policy B will not be evaluated if one of Rules in policy A matches the requests.

### Rules

In a policy the administrators can define several rules with people conditions. The people condition identifies users and groups that are included or exclueded to match the user the token is requested for. Rules are ordered numerically by priority. This priority determines the order in which they are searched for a user/group match. The highest priority rule has a priorityOrder of 1.

For example, assume the following conditions are in effect:

- Rule A has priority 1 and one people condition to include user U;
- Rule B has priority 2 and one people condition to include all the users assigned to the client;

Because Rule A has a higher priority, the requests for user U are evaluated in Rule A, and Rule B is not evaluated.

The requests with `client_credentials` grant type match "no user" condition, which excludes everyone, because there is no user session for the request.

The actions in a Rule define which scopes can be granted to the requests, thus determines which claims will be added into the tokens. They also define the lifetime of the Access Token and Refresh Token.

## Authorization Servers

API Access Management allows you to build custom authorization servers in Okta which can be used to protect your own API endpoints. An authorization server defines your security boundary, for example “staging” or “production.” Within each authorization server you can define your own OAuth scopes, claims, and access policies. This allows your apps and your APIs to anchor to a central authorization point and leverage the rich identity features of Okta, such as Universal Directory for transforming attributes, adaptive MFA for end-users, analytics, and system log, and extend it out to the API economy.

At its core, an authorization server is simply an OAuth 2.0 token minting engine.
Each authorization server has a unique issuer URI and its own signing key for tokens in order to keep proper boundary between security domains.
The authorization server also acts as an OpenID Connect Provider, which means you can request ID tokens in addition to access tokens from the authorization server endpoints.
To configure an authorization server, log into your org and navigate to **Security** > **API** > **Add Authorization Server**.

## OpenID Connect and Authorization Servers

You can use OpenID Connect without the API Access Management feature, using the [OpenID Connect API](/docs/api/resources/oidc.html).
However, you can also use OpenID Connect with an authorization server specified:

* `/oauth2/v1/userinfo` for OpenID Connect without API Access Management
* `/oauth2/:authorizationServerId/v1/userinfo` for OpenID Connect with API Access Management

You can't mix tokens between different authorization servers. By design, authorization servers don't have trust relationships with each other.

## Endpoints

Explore the OAuth 2.0 API: [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/4adca9a35eab5716d9f6)

### Authentication Request
{:.api .api-operation}

{% api_operation get /oauth2/*:authorizationServerId*/v1/authorize %}

This is a starting point for OAuth 2.0 flows such as implicit and authorization code flows. This request authenticates the user and returns tokens along with an authorization grant to the client application as a part of the response the client might have requested.

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter         | Description                                                                                        | Param Type | DataType  | Required | Default         |
----------------- | -------------------------------------------------------------------------------------------------- | ---------- | --------- | -------- | --------------- |
[idp](idps.html)  | The Identity provider used to do the authentication. If omitted, use Okta as the identity provider. | Query      | String    | FALSE    | Okta is the IDP. |
sessionToken      | An Okta one-time session token. This allows an API-based user login flow (rather than Okta login UI). Session tokens can be obtained via the [Authentication API](authn.html).   | Query | String    | FALSE | |
response_type     | Can be a combination of ``code``, ``token``, and ``id_token``. The chosen combination determines which flow is used; see this reference from the [OAuth 2.0 specification](https://tools.ietf.org/html/rfc6749#section-3.1.1). The code response type returns an authorization code which can be later exchanged for an Access Token or a Refresh Token. | Query        | String   |   TRUE   |  |
client_id         | Obtained during either [UI client registration](/docs/api/resources/social_authentication.html) or [API client registration](oauth-clients.html). It is the identifier for the client and it must match what has been registered in Okta during client registration. | Query        | String   | TRUE     |
redirect_uri      | Specifies the callback location where the authorization code should be sent and it must match what has been registered in Okta during client registration. | Query        | String   |  TRUE    |
display           | Specifies how to display the authentication and consent UI. Valid values: ``page`` or ``popup``.  | Query        | String   | FALSE     |  |
max_age           | Specifies the allowable elapsed time, in seconds, since the last time the end user was actively authenticated by Okta. | Query      | String    | FALSE    | |
response_mode     | Specifies how the authorization response should be returned. [Valid values: ``fragment``, ``form_post``, ``query`` or ``okta_post_message``](#parameter-details). If ``id_token`` or ``token`` is specified as the *response_type*, then ``query`` isn't allowed as a *response_mode*. Defaults to ``fragment`` in implicit and hybrid flows. Defaults to ``query`` in authorization code flow and cannot be set as ``okta_post_message``. | Query        | String   | FALSE      | See Description.
scope          | **Required.** Can be a combination of reserved scopes and custom scopes. The combination determines the claims that are returned in the Access Token and ID Token. The ``openid`` scope has to be specified to get back an ID Token. | Query        | String   | TRUE     |
state          | A client application provided state string that might be useful to the application upon receipt of the response. It can contain alphanumeric, comma, period, underscore and hyphen characters.   | Query        | String   |  TRUE    |
prompt         | Can be either ``none`` or ``login``. The value determines if Okta should not prompt for authentication (if needed), or force a prompt (even if the user had an existing session). Default: The default behavior is based on whether there's an existing Okta session. | Query        | String   | FALSE     | See Description.
nonce          | Specifies a nonce that is reflected back in the ID Token. It is used to mitigate replay attacks. | Query        | String   | TRUE     |
code_challenge | Specifies a challenge of [PKCE](#parameter-details). The challenge is verified in the Access Token request.  | Query        | String   | FALSE    |
code_challenge_method | Specifies the method that was used to derive the code challenge. Only S256 is supported.  | Query        | String   | FALSE    |
login_hint | A username to prepopulate if prompting for authentication.  | Query        | String   | FALSE    |

#### Parameter Details

 * *idp* and *sessionToken* are Okta extensions to the [OIDC specification](http://openid.net/specs/openid-connect-core-1_0.html#Authentication).
    All other parameters comply with the [OAuth 2.0 specification](https://tools.ietf.org/html/rfc6749) and their behavior is consistent with the specification.
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
 * Okta requires the OAuth 2.0 *state* parameter on all requests to the authorization endpoint in order to prevent cross-site request forgery (CSRF).
 The OAuth 2.0 specification [requires](https://tools.ietf.org/html/rfc6749#section-10.12) that clients protect their redirect URIs against CSRF by sending a value in the authorize request which binds the request to the user-agent's authenticated state.
 Using the *state* parameter is also a countermeasure to several other known attacks as outlined in [OAuth 2.0 Threat Model and Security Considerations](https://tools.ietf.org/html/rfc6819).

 * [Proof Key for Code Exchange](https://tools.ietf.org/html/rfc7636) (PKCE) is a stronger mechanism for binding the authorization code to the client than just a client secret, and prevents [a code interception attack](https://tools.ietf.org/html/rfc7636#section-1) if both the code and the client credentials are intercepted (which can happen on mobile/native devices). The PKCE-enabled client creates a large random string as *code_verifier* and derives *code_challenge* from it using the method specified in *code_challenge_method*.
    Then the client passes the *code_challenge* and *code_challenge_method* in the authorization request for code flow. When a client tries to redeem the code, it must pass the *code_verifer*. Okta recomputes the challenge and returns the requested token only if it matches the *code_challenge* in the original authorization request. When a client, whose *token_endpoint_auth_method* is ``none``, makes a code flow authorization request, *code_challenge* is required.
    Since *code_challenge_method* only supports S256, this means that the value for *code_challenge* must be: `BASE64URL-ENCODE(SHA256(ASCII(*code_verifier*)))`. According to the [PKCE spec](https://tools.ietf.org/html/rfc7636), the *code_verifier* must be at least 43 characters and no more than 128 characters.

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
access_token      | The *access_token* that is used to access the resource. This is returned if the *response_type* included a token. | String  |
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

{% api_operation post /oauth2/*:authorizationServerId*/v1/token %}


The API takes a grant type of either *authorization_code*, *password*, *refresh_token*, or *client_credentials* and the corresponding credentials and returns back an Access Token. A Refresh Token is returned if *offline_access* scope is requested using authorization_code, password, or refresh_token grant type. Additionally, using the authorization_code grant type returns an ID Token if the *openid* scope is requested.

#### Request Parameters

The following parameters can be posted as a part of the URL-encoded form values to the API.

Parameter          | Description                                                                                         | Type       |
-------------------+-----------------------------------------------------------------------------------------------------+------------|
grant_type         | Can be one of the following: *authorization_code*, *password*, *refresh_token*, or *client_credentials*. Determines the mechanism Okta uses to authorize the creation of the tokens. | String |
code               | Expected if grant_type specified *authorization_code*. The value is what was returned from the [authorization endpoint](#authentication-request). | String
refresh_token      | Expected if the grant_type specified *refresh_token*. The value is what was returned from this endpoint via a previous invocation. | String |
username           | Expected if the grant_type specified *password*. | String |
password           | Expected if the grant_type specified *password*. | String |
scope              | Optional if *refresh_token*, or *password* is specified as the grant type. This is a list of scopes that the client wants to be included in the Access Token. For the *refresh_token* grant type, these scopes have to be subset of the scopes used to generate the Refresh Token in the first place. | String |
redirect_uri       | Expected if grant_type specified *authorization_code*. Specifies the callback location where the authorization was sent; must match what is preregistered in Okta for this client. | String |
code_verifier      | Expected if grant_type specified *authorization_code* for native applications. The code verifier of [PKCE](#parameter-details). Okta uses it to recompute the code_challenge and verify if it matches the original code_challenge in the authorization request. | String |
client_id          | Expected if *code_verifier* is included or client credentials are not provided in the Authorization header. This is used in conjunction with the client_secret parameter to authenticate the client application. | String |
client_secret      | Expected if *code_verifier* is not included and client credentials are not provided in the Authorization header. This is used in conjunction with the client_id parameter to authenticate the client application. | String |

##### Token Authentication Method

For clients authenticating by client credentials, provide the [`client_id`](oidc.html#request-parameters)
and [`client_secret`](https://support.okta.com/help/articles/Knowledge_Article/Using-OpenID-Connect) either as an Authorization header in the Basic auth scheme (basic authentication) or as additional parameters to the POST body. Including credentials in both the headers and the POST body is not allowed.

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

#### Request Example: Resource Owner Password Flow

~~~sh
curl -X POST \
  "https://westworld.okta.com/oauth2/aus9s3ami4MRoqQR90h7/v1/token" \
  -H "Accept: application/json" \
  -H "Cache-Control: no-cache" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&username=dolores.abernathy%40westworld.com&
      password=<password>&scope=openid&client_id=<client_id>
      & client_secret=<client_secret>"
~~~

#### Response Example: Resource Owner Password Flow

~~~
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

<!-- publish when we have the corresponding request
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
~~~ -->

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


{% api_operation post /oauth2/*:authorizationServerId*/v1/introspect %}

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
    "scope" : "openid email flights custom",
    "client_id" : "a9VpZDRCeFh3Nkk2VdYa",
    "username" : "john.doe@example.com",
    "exp" : 1451606400,
    "iat" : 1451602800,
    "sub" : "john.doe@example.com",
    "aud" : "http://api.example.com",
    "iss" : "https://your-org.okta.com/oauth2/orsmsg0aWLdnF3spV0g3",
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

{% api_operation post /oauth2/*:authorizationServerId*/v1/revoke %}

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

{% api_operation get /oauth2/*:authorizationServerId*/v1/keys %}

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
It is safe to cache keys for performance.


Any of the keys listed are used to sign tokens. The order of keys in the result doesn't indicate which keys are used.

Standard open-source libraries are available for every major language to perform [JWS](https://tools.ietf.org/html/rfc7515) signature validation.

### Authorization Server Metadata
{:.api .api-operation}

{% api_operation get /oauth2/*:authorizationServerId*/.well-known/oauth-authorization-server %}

This API endpoint returns metadata related to an Authorization Server that can be used by clients to programmatically configure their interactions with Okta.
This API doesn't require any authentication and returns a JSON object with the following structure.

~~~json
{
    "issuer": "https://${org}.okta.com",
    "authorization_endpoint": "https://${org}.okta.com/oauth2/{authorizationServerId}/v1/authorize",
    "token_endpoint": "https://${org}.okta.com/oauth2/{authorizationServerId}/v1/token",
    "jwks_uri": "https://${org}.okta.com/oauth2/{authorizationServerId}/v1/keys",
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
    "introspection_endpoint": "https://${org}.okta.com/oauth2/{authorizationServerId}/v1/introspect",
    "introspection_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "none"
    ],
    "revocation_endpoint": "https://${org}.okta.com/oauth2/{authorizationServerId}/v1/revoke",
    "revocation_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "none"
    ]
}
~~~

### Authorization Server OpenID Connect Metadata
{:.api .api-operation}

{% api_operation get /oauth2/*:authorizationServerId*/.well-known/openid-configuration %}

This API endpoint returns OpenID Connect metadata related to an Authorization Server that can be used by clients to programmatically configure their interactions with Okta.
This API doesn't require any authentication and returns a JSON object with the following structure.

~~~json
{
    "issuer": "https://${org}.okta.com",
    "authorization_endpoint": "https://${org}.okta.com/oauth2/{authorizationServerId}/v1/authorize",
    "token_endpoint": "https://${org}.okta.com/oauth2/{authorizationServerId}/v1/token",
    "userinfo_endpoint": "https://${org}.okta.com/oauth2/{authorizationServerId}/v1/userinfo",
    "jwks_uri": "https://${org}.okta.com/oauth2/{authorizationServerId}/v1/keys",
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
    "introspection_endpoint": "https://${org}.okta.com/oauth2/{authorizationServerId}/v1/introspect",
    "introspection_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "none"
    ],
    "revocation_endpoint": "https://${org}.okta.com/oauth2/{authorizationServerId}/v1/revoke",
    "revocation_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "none"
    ]
}
~~~


## Authorization Server Operations


### Create Authorization Server

Creates a new Authorization server with key rotation mode as `AUTO`.

#### Request Parameters

Parameter          | Description                                                                                         | Type       | Required       |
-------------------+-----------------------------------------------------------------------------------------------------+------------+----------------|
name        | The name of the authorization server | String   | true
description        | The description of the authorization server | String   | false
defaultResourceUri        | The url of the resource being secured by this authorization server | String   | true

{:.api .api-operation}

{% api_operation post /api/v1/as %} {% api_lifecycle beta %}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{ "name": "Test AuthServer",
  "description": "Test description",
  "defaultResourceUri": "http://test.com"
}' "https://${org}.okta.com/api/v1/as"
~~~

#### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "ausnsopoM6vBRB3PD0g3",
  "name": "Test AuthServer",
  "description": "Test description",
  "defaultResourceUri": "http://test.com",
  "issuer": "{org}/oauth2/ausnsopoM6vBRB3PD0g3",
  "status": "ACTIVE",
  "created": "2016-12-20T03:26:07.000Z",
  "lastUpdated": "2016-12-20T03:26:07.000Z",
  "credentials": {
    "signing": {
      "rotationMode": "AUTO",
      "lastRotated": "2016-12-20T03:26:07.000Z",
      "nextRotation": "2017-03-20T03:26:07.000Z",
      "kid": "U2aAKIGrlGWffBKMwuED1XHNwQm_kTaPecJY6PB8io8"
    }
  },
  "_links": {
    "resources": {
      "href": "${org}/api/v1/as/ausnsopoM6vBRB3PD0g3/resources",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    },
    "keys": {
      "href": "${org}/api/v1/as/ausnsopoM6vBRB3PD0g3/credentials/keys",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    },
    "self": {
      "href": "${org}/api/v1/as/ausnsopoM6vBRB3PD0g3",
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
        "href": "${org}/oauth2/ausnsopoM6vBRB3PD0g3/.well-known/oauth-authorization-server",
        "hints": {
          "allow": [
            "GET"
          ]
        }
      },
      {
        "name": "openid-configuration",
        "href": "${org}/oauth2/ausnsopoM6vBRB3PD0g3/.well-known/openid-configuration",
        "hints": {
          "allow": [
            "GET"
          ]
        }
      },
    ],
    "rotateKey": {
      "href": "${org}/api/v1/as/ausnsopoM6vBRB3PD0g3/credentials/lifecycle/keyRotate",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    }
  }
}
~~~

### Update Authorization Server

Updates authorization server identified by authorizationServerId.

>Switching between rotation modes will not change the active signing key.

#### Request Parameters

Parameter          | Description                                                                                         | Type       | Required       |
-------------------+-----------------------------------------------------------------------------------------------------+------------+----------------|
name        | The name of the authorization server | String   | true
description        | The description of the authorization server | String   | false
defaultResourceUri        | The url of the resource being secured by this authorization server | String   | true
credentials |  The credentials signing object with the `rotationMode` of the authorization server |  [Authorization server credentials object](oauth2.html#authorization-server-credentials-signing-object) | FALSE

{:.api .api-operation}

{% api_operation post /api/v1/as/:authorizationServerId %} {% api_lifecycle beta %}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{ "name": "Test AuthServer",
  "description": "Test description",
  "defaultResourceUri": "http://test.com",
  "credentials" : {
   "signing" : {
	"rotationMode" : "MANUAL"
	}
   }
}' "https://${org}.okta.com/api/v1/as/ausnsopoM6vBRB3PD0g3"
~~~

#### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "ausnsopoM6vBRB3PD0g3",
  "name": "Test AuthServer",
  "description": "Test description",
  "defaultResourceUri": "http://test.com",
  "issuer": "{org}/oauth2/ausnsopoM6vBRB3PD0g3",
  "status": "ACTIVE",
  "created": "2016-12-20T03:26:07.000Z",
  "lastUpdated": "2016-12-31T01:20:27.000Z",
  "credentials": {
    "signing": {
      "rotationMode": "MANUAL",
      "lastRotated": "2017-01-04T18:30:46.000Z",
      "kid": "U2aAKIGrlGWffBKMwuED1XHNwQm_kTaPecJY6PB8io8"
    }
  },
  "_links": {
    "resources": {
      "href": "${org}/api/v1/as/ausnsopoM6vBRB3PD0g3/resources",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    },
    "keys": {
      "href": "${org}/api/v1/as/ausnsopoM6vBRB3PD0g3/credentials/keys",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    },
    "self": {
      "href": "${org}/api/v1/as/ausnsopoM6vBRB3PD0g3",
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
        "href": "${org}/oauth2/ausnsopoM6vBRB3PD0g3/.well-known/oauth-authorization-server",
        "hints": {
          "allow": [
            "GET"
          ]
        }
      },
      {
        "name": "openid-configuration",
        "href": "${org}/oauth2/ausnsopoM6vBRB3PD0g3/.well-known/openid-configuration",
        "hints": {
          "allow": [
            "GET"
          ]
        }
      },
    ],
    "rotateKey": {
      "href": "${org}/api/v1/as/ausnsopoM6vBRB3PD0g3/credentials/lifecycle/keyRotate",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    }
  }
}
~~~

### Get Authorization Server

Returns authorization server identified by authorizationServerId.

{:.api .api-operation}

{% api_operation get /api/v1/as/:authorizationServerId %} {% api_lifecycle beta %}

#### Request Example

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/as/ausnsopoM6vBRB3PD0g3"
~~~

#### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "ausnsopoM6vBRB3PD0g3",
  "name": "Test AS",
  "description": "Test description",
  "defaultResourceUri": "http://test.com",
  "issuer": "{org}/oauth2/ausnsopoM6vBRB3PD0g3",
  "status": "ACTIVE",
  "created": "2016-12-20T03:26:07.000Z",
  "lastUpdated": "2016-12-31T01:20:27.000Z",
  "credentials": {
    "signing": {
      "rotationMode": "MANUAL",
      "lastRotated": "2016-12-30T23:02:43.000Z",
      "kid": "medybdhzSyo16NqF2tcnZbduaetquXPi6ZQNgEbpmHM"
    }
  },
  "_links": {
    "resources": {
      "href": "${org}/api/v1/as/ausnsopoM6vBRB3PD0g3/resources",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    },
    "keys": {
      "href": "${org}/api/v1/as/ausnsopoM6vBRB3PD0g3/credentials/keys",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    },
    "self": {
      "href": "${org}/api/v1/as/ausnsopoM6vBRB3PD0g3",
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
        "href": "${org}/oauth2/ausnsopoM6vBRB3PD0g3/.well-known/oauth-authorization-server",
        "hints": {
          "allow": [
            "GET"
          ]
        }
      },
      {
        "name": "openid-configuration",
        "href": "${org}/oauth2/ausnsopoM6vBRB3PD0g3/.well-known/openid-configuration",
        "hints": {
          "allow": [
            "GET"
          ]
        }
      },
    ],
    "rotateKey": {
      "href": "${org}/api/v1/as/ausnsopoM6vBRB3PD0g3/credentials/lifecycle/keyRotate",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    }
  }
}
~~~

### Authorization Server Credentials Signing Object

|------------+---------------------------------------------------------------------------------------------+----------------------------------+----------+----------|
| Property   | Description                                                                                 | DataType                         | Required | Updatable|
| ---------- | ------------------------------------------------------------------------------------------- | -------------------------------- | -------- | -------- |
| kid        | The kid of the key used for signing tokens issued by the authorization server   | String                           | FALSE    |       FALSE
| lastRotated        | The timestamp when the authorization server started to use the `kid` for signing tokens.  | String                           | FALSE    |   FALSE
| nextRotation        |  The timestamp when authorization server will change key for signing tokens. Only returned when `rotationMode` is `AUTO`  | String                           | FALSE    |   FALSE
| rotationMode        | The key rotation mode for the authorization server. Can be `AUTO` or `MANUAL`    | String                           | FALSE    |       TRUE
|------------+---------------------------------------------------------------------------------------------+----------------------------------+----------|

~~~json

"credentials":  {
    "signing": {
      "rotationMode": "AUTO",
      "lastRotated": "2017-01-04T18:33:11.000Z",
      "nextRotation": "2017-04-04T18:33:11.000Z",
      "kid": "8akSvL3DHDHxQJSAHOJbyFk1qMedE5Dcn2pXWabuZ4Y"
    }
  }
~~~


## Authorization Server Key Store Operations


### Get Authorization Server Keys

Returns the current keys in rotation for the authorization server.

{:.api .api-operation}

{% api_operation get /api/v1/as/:authorizationServerId/credentials/keys %} {% api_lifecycle beta %}

#### Request Example

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/as/ausnsopoM6vBRB3PD0g3/credentials/keys"
~~~

#### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "keys": [
    {
      "alg": "RS256",
      "status": "ACTIVE",
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
      "status": "NEXT",
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
      "status": "EXPIRED",
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



* The listed ACTIVE key is used to sign tokens issued by the authorization server.
* The listed NEXT key is the next key that the authorization server will use to sign tokens when keys are rotated. The NEXT key might not be listed if it has not been generated yet.
* The listed EXPIRED key is the previous key that the authorization server used to sign tokens. The EXPIRED key might not be listed if no key has expired or the expired key has been deleted.

### Rotate Authorization Server Keys

Rotates the current keys for the authorization server. If you rotate keys, the "ACTIVE" key will become the "EXPIRED" key, the "NEXT" key will become the "ACTIVE" key, and this authorization server will immediately begin issuing tokens signed with the new "ACTIVE" key.

>Authorization server keys can be rotated in both *MANUAL* and *AUTO* mode, however, it is recommended to rotate keys manually only when the authorization server is in *MANUAL* mode.
>If keys are rotated manually, any intermediate cache should be invalidated and keys should be fetched again using the [get keys](oauth2.html#get-keys) endpoint.


#### Request Parameters

Parameter          | Description                                                                                         | Type       | Required       |
-------------------+-----------------------------------------------------------------------------------------------------+------------+----------------|
use        | Can be only *sig*. Determines the type of keys being rotated for this authorization server. | String   | true


{:.api .api-operation}

{% api_operation post /api/v1/as/:authorizationServerId/credentials/lifecycle/keyRotate %} {% api_lifecycle beta %}


##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "use": "sig"
}' "https://${org}.okta.com/api/v1/as/ausnsopoM6vBRB3PD0g3/credentials/lifecycle/keyRotate"
~~~


#### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "keys": [
    {
      "alg": "RS256",
      "status": "ACTIVE",
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
      "status": "NEXT",
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
      "status": "EXPIRED",
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


#### Response Example (Error)
{:.api .api-response .api-response-example}

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

> API Access Management is {% api_lifecycle ea %}.

If you run into trouble setting up an authorization server or performing
other tasks for API Access Management, use the following suggestions to resolve your issues.

### Always Start with the System Log

The system log contains detailed information about why a request was denied and other useful information.

### Limits

* Each authorization server can have only one resource. If you have resources that share a common path,
you can control access to the common path with one authorization server.

* Scopes are unique per authorization server.

* The resource URI you specify in an authorization server must be an absolute path.

* Tokens can expire, be explicitly revoked at the endpoint, or implicitly revoked by a change in configuration.

* Token revocation can be implicit in two ways: token expiration or a change to the source.
    * Expiration happens at different times:
        * ID Token expires after one hour.
        * Access Token expiration is configured in a policy, but is always between five minutes and one day.
        * Refresh Token expiration depends on two factors: 1) Expiration is configured in an Access Policy, no limits,
          but must be greater than or equal to the Access Token lifetime, and 2) Revocation if the Refresh Token
          isn't exercised within a specified time. Configure the specified time in an Access Policy, with a minimum of ten minutes.

    * Revocation happens when a configuration is changed or deleted:
        * User deactivation or deletion.
        * Configuration in the authorization server is changed or deleted.
        * The [client app](https://help.okta.com/en/prev/Content/Topics/Apps/Apps_App_Integration_Wizard.htm#OIDCWizard) is deactivated, changed, unassigned, or deleted.

* If a client requests multiple scopes, but the policy for that client only allows for a subset of the scopes,
then the token isn't minted and an error is returned. The system log contains the details about the error.

### Subtle Behavior

Some behaviors aren't obvious:

* A user must be assigned to the client in Okta for the client to get Access Tokens from that client.
You can assign the client directly (direct user assignment) or indirectly (group assignment).

* If you haven't created a rule in a policy in the authorization server to allow the client, user, and
scope combination that you want, the request fails.
To resolve, create at least one rule in a policy in the authorization server for the relevant resource
that specifies client, user, and scope.

* OpenID Connect scopes are granted by default, so if you are requesting only those scopes ( `openid`, `profile`, `email`, `address`, `phone`, or `offline_access` ), you don't need to define any scopes for them, but you still need a policy and rule
in the authorization server. The rule grants the OpenID Connect scopes by default, so they don't need to be configured in the rule.
Token expiration times depend on how they are defined in the rules, and which policies and rules match the request.

* OpenID scopes can be requested with custom scopes. For example, a request can include `openid` and a custom scope.

* The evaluation of a policy always takes place during the initial authentication of the user (or of the client in case of client credentials flow). If the flow is not immediately finished, such as when a token is requested using `authorization_code` grant type, the policy is not evaluated again, and a change in the policy after the user or client is initially authenticated won't affect the continued flow.


