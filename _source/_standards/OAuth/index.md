---
layout: docs_page
title: OAuth 2.0 and Okta
excerpt: The next evolution of the OAuth protocol focuses on client developer simplicity.
icon: /assets/img/icons/oauth.svg
---
# OAuth 2.0 and Okta

OAuth 2.0 is the next evolution of the OAuth protocol and is not backwards compatible with OAuth 1.0.
OAuth 2.0 focuses on client developer simplicity while providing specific authorization flows for web applications, desktop applications, mobile phones, and living room devices.

The specification and associated RFCs are developed by [the IETF OAuth WG](https://tools.ietf.org/wg/oauth/).
[The main framework](https://tools.ietf.org/html/rfc6749) and [Bearer Token Usage](https://tools.ietf.org/html/rfc6750) were published in 2012.
Other documents are still being worked on within the OAuth working group.

In addition to the information in this introduction, you can find detailed information about Okta's implementation of OAuth 2.0:

* [Okta's API Access Management Introduction](/use_cases/api_security/)
* [OAuth 2.0 API](/docs/api/resources/oauth2.html)
* [Help for configuring API Access Management in the Okta UI](https://help.okta.com/en/prod/Content/Topics/Security/API_Access.htm?Highlight=api%20access%20management)

# Introduction

Okta is a fully standards-compliant [OAuth 2.0](http://oauth.net/documentation) Authorization Server and a certified [OpenID Provider](http://openid.net/certification).
The OAuth 2.0 APIs provide API security via scoped access tokens, and OpenID Connect provides user authentication and an SSO layer which is lighter and easier to use than SAML.

There are several use cases and Okta product features built on top of the OAuth 2.0 APIs:

* Social Authentication -- {% api_lifecycle ea %}
* OpenID Connect -- {% api_lifecycle ea %}
* API Access Management -- {% api_lifecycle ea %}

It's important to understand which use case you are targeting and build your application according to the correct patterns for that use case.
The OAuth 2.0 APIs each have several different [query params](/docs/api/resources/oauth2.html#obtain-an-authorization-grant-from-a-user) which dictate which type of flow you are using and the mechanics of that flow.

At the very basic level, the main API endpoints are:

* [Authorize](/docs/api/resources/oauth2.html#obtain-an-authorization-grant-from-a-user) endpoint initiates an OAuth 2.0 request.
* [Token](/docs/api/resources/oauth2.html#revoke-a-token) endpoint redeems an authorization grant (returned by the [Authorize](/docs/api/resources/oauth2.html#obtain-an-authorization-grant-from-a-user) endpoint) for an access token.

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
        For more information, see the PKCE note in [Parameter Details](/docs/api/resources/oauth2.html#request-parameter-details).

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
    and it must validate that returned "state" parameter from the Authorization Server matches the original value.

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

Scopes are requested in the request parameter, and the Authorization Server uses the [Access Policies](#access-policies) to decide if they can be granted or not. If any of the requested scopes are rejected by the Access Policies, the request will be rejected.

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
| kid          | Identifies the `public-key` used to sign the `access_token`. The corresponding `public-key` can be found as a part of the [metadata](/docs/api/resources/oauth2.html#retrieve-authorization-server-metadata) `jwks_uri` value.                                  | String       | "a5dfwef1a-0ead3f5223_w1e" |

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

1. Verify that the `iss` (issuer) claim matches the identifier of your Authorization Server.
2. Verify that the `aud` (audience) claim is the value configured in the Authorization Server.
3. Verify `cid` (client id) claim is your client id.
4. Verify the signature of the Access Token according to [JWS](https://tools.ietf.org/html/rfc7515) using the algorithm specified in the JWT *alg* header property. Use the public keys provided by Okta via the [Get Keys endpoint](/docs/api/resources/oauth2.html#get-keys).
5. Verify that the expiry time (from the `exp` claim) has not already passed.

Step 4 involves downloading the public JWKS from Okta (specified by the *jwks_uri* property in the [Authorization Server metadata](/docs/api/resources/oauth2.html#retrieve-authorization-server-metadata). The result of this call is a [JSON Web Key](https://tools.ietf.org/html/rfc7517) set.

Each public key is identified by a *kid* attribute, which corresponds with the *kid* claim in the [Access Token header](/docs/api/resources/oauth2.html#token-authentication-methods).

The Access Token is signed by an RSA private key, and we publish the future signing key well in advance.
However, in an emergency situation you can still stay in sync with Okta's key rotation. Have your application check the `kid`, and if it has changed and the key is missing from the local cache, check the `jwks_uri` value in the [Authorization Server metadata](/docs/api/resources/oauth2.html#retrieve-authorization-server-metadata) and you can go back to the [jwks uri](/docs/api/resources/oauth2.html#get-keys) to get keys again from Okta

Please note the following:

* For security purposes, Okta automatically rotates keys used to sign the token.
* The current key rotation schedule is four times a year. This schedule can change without notice.
* In case of an emergency, Okta can rotate keys as needed.
* Okta always publishes keys to the JWKS.
* To save the network round trip, your app can cache the JWKS response locally. The standard HTTP caching headers are used and should be respected.
* The administrator can switch the Authorization Server key rotation mode to `MANUAL` by [updating the Authorization Server](/docs/api/resources/oauth2.html#update-authorization-server) and then control when to [rotate the keys](/docs/api/resources/oauth2.html#rotate-authorization-server-keys).

Keys used to sign tokens automatically rotate and should always be resolved dynamically against the published JWKS. Your app can fail if you hardcode public keys in your applications. Be sure to include key rollover in your implementation.

### Alternative Validation

You can use an [introspection endpoint](/docs/api/resources/oauth2.html#introspection-request) for validation.

## Refresh Token

A Refresh Token is an opaque string. It is a long-lived token that the client can use to obtain a new Access Token without re-obtaining authorization from the resource owner. The new Access Token must have the same or subset of the scopes associated with the Refresh Token.
A Refresh Token will be returned if 'offline_access' scope is requested using authorization_code, password, or refresh_token grant type.


The lifetime of a Refresh Token is configured in [Access Policies](#access-policies), the minimum value is 24 hours. The refresh token can also expire after a period if no clients redeem it for an Access Token. The period should be equal to or larger than 10 minutes. If the token's lifetime is set to unlimited, the Authorization Server will not check if clients use it or not.

### Refresh Token Revocation

Refresh Tokens can be revoked explicitly by making a [Revocation Request](/docs/api/resources/oauth2.html#revoke-a-token). Additionally, all Refresh Tokens associated with an entity are revoked when the entity is deactivated, deleted, or otherwise modified in a way that invalidates the associated Refresh Tokens. Such ways includes:

* The User is Suspended or Deactivated
* The Client App is Deactivated or Deleted
* The Authorization Server's Resource URI is modified, or the Authorization Server is deleted.

No other modifications affect existing tokens.

## ID Token
An Authorization Server can also issue an ID Token to the client, as in OpenID Connect, but with the following differences:

* The ID Token cannot contain a reserved scope or claim called 'groups'. To obtain a claim with group information, administrators must define a custom claim with a group filter and associate it with a scope.
* The custom properties in the app user profile are not included in the Id Token by default, even if profile scope is granted. To obtain a claim for a custom property, administrators must define a custom claim with an Okta Expression Language expression and associate it with a scope.

The lifetime of an Id Token is 1 hour. If the client that issued the token is deactivated, the token is
immediately and permanently invalidated. Reactivating the client does not make the token valid again.

The same validation steps for [OpenID Connect](/docs/api/resources/oidc.html#validating-id-tokens) can also be applied to ID Token for
OAuth2, except the public keys should be retrieved via the [Get Keys endpoint](/docs/api/resources/oauth2.html#get-keys).

## Access Policies

Access policies define which scopes and claims can be granted to a request and the lifetime of the granted tokens.

### Policies

The admin defines Policies for the OAuth 2.0 clients which are ordered numerically by priority. This priority determines the order in which they are searched for a client match. The highest priority policy has a priorityOrder of 1.

For example, assume the following conditions are in effect.

- Policy A has priority 1 and applies to client C;
- Policy B has priority 2 and applies to all the clients;

Because Policy A has a higher priority, the requests coming from client C are evaluted by Policy A first. Policy B will not be evaluated if one of Rules in policy A matches the requests.

### Rules

In a policy the administrators can define several rules with people, scope, and grant type conditions. 

#### Scope Condition

The scope condition identifies scopes that are included or excluded to match the claims the token will contain.
Scopes are not ordered. 

#### Grant Type Condition

The grant type condition identifies how the authorization grant is presented to Okta: 
via an authorization code, password credentials, refresh token, or client credentials.

#### People Condition
 
The people condition identifies users and groups that are included or excluded to match the user the token is requested for.
Rules are ordered numerically by priority. This priority determines the order in which they are searched for a user/group match.
The highest priority rule has a priorityOrder of 1.

For example, assume the following conditions are in effect:

- Rule A has priority 1 and one people condition to include user U;
- Rule B has priority 2 and one people condition to include all the users assigned to the client;

Because Rule A has a higher priority, the requests for user U are evaluated in Rule A, and Rule B is not evaluated.

The actions in a rule define the lifetime of the Access Token and Refresh Token.

## Authorization Servers

At its core, an authorization server is simply an engine for minting OpenID Connect or OAuth 2.0 tokens.

Okta provides two types of authorization servers:

* Okta Authorization Server:
Use the Okta Authorization Server to perform SSO with Okta or sign in users for apps displayed on the Okta home page.
Okta hosts and manages the Okta Authorization Server. It can't be configured,
though you can add a [groups claim](/docs/api/resources/oidc.html#scope-dependent-claims-not-always-returned)
and [app-user profile attributes](/docs/api/resources/apps.html#application-user-properties) to a client.
The Access Token minted by the Okta Authorization Server is consumed by Okta APIs. The Access Token audience is always Okta specific, so the token can't be validated by your applications.

    >Note: The Okta Authorization Server doesn't require that the API Access Management feature be enabled.

* Custom Authorization Server:
Use a Custom Authorization Server to secure your APIs.
Custom Authorization Servers are hosted on Okta, and created and configured by an org administrator.
You can create and configure Custom Authorization Servers using the Okta Admin UI or the [Custom Authorization Server API](/docs/api/resources/oauth2.html#authorization-server-operations).
The Access Token minted by a Custom Authorization Server is consumed by your APIs. 
You can specify the audience to make sure that the Access Token is for your APIs.
Also, custom scopes can be configured to support the authorization for your APIs. 

     >Note: Custom Authorization Servers are available as part of the [API Access Management](/use_cases/api_access_management/index.html) feature.

| Feature                                  | Okta Authorization Server | Custom Authorization Server |
|:-----------------------------------------|:--------------------------|:----------------------------|
| Hosted by Okta                           | &#10004;                  | &#10004;                    |
| Add groups claim                         | &#10004;                  | &#10004;                    |
| Add user-profile attributes              | &#10004;                  | &#10004;                    |
| Manage resources outside Okta            |                           | &#10004;                    |
| Requires API Access Management           |                           | &#10004;                    |
| Org Admin creates one or more            |                           | &#10004;                    |
| Validate the Access Token in custom code |                           | &#10004;                    |
| Custom Scopes                            |                           | &#10004;                    |
| Custom Claims                            |                           | &#10004;                    |
| Custom Access Policies and Rules         |                           | &#10004;                    |

To configure a Custom Authorization Server, sign in to your org and navigate to **Security** > **API** > **Add Authorization Server** or use the [Custom Authorization Server API](/docs/api/resources/oauth2.html#authorization-server-operations).

If you use a Custom Authorization Server, we recommend that you use it instead of the Okta Authorization Server for 
any platform use cases (perform SSO or secure your API access).
Doing so will make it easier to consume enhancements to the API Access Management product and features.  

## OpenID Connect and Authorization Servers

You can use [OpenID Connect API](/docs/api/resources/oidc.html) without the API Access Management feature.
However, you can also use OpenID Connect with a Custom Authorization Server:

* `/oauth2/v1/userinfo` for OpenID Connect without API Access Management
* `/oauth2/:authorizationServerId/v1/userinfo` for OpenID Connect with API Access Management

You can't mix tokens between different authorization servers. By design, authorization servers don't have trust relationships with each other.
