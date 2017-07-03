---
layout: docs_page
title: Set Up Authorization Service
excerpt: Set Up an Authorization Service
---

# Overview

{% api_lifecycle ea %}

API Access Management is an **Early Access** (EA) feature; contact Okta support to enable it.

API Access Management allows you to build custom authorization servers in Okta which can be used to protect your own API endpoints.
An authorization server defines your security boundary, for example "staging" or "production."
Within each authorization server you can define your own OAuth scopes, claims, and access policies.
This allows your apps and your APIs to anchor to a central authorization point and leverage the rich identity features of Okta,
such as Universal Directory for transforming attributes, adaptive MFA for end-users, analytics, and system log, and extend it out to the API economy.

At its core, an authorization server is simply an OAuth 2.0 token minting engine.
Each authorization server has a unique [issuer URI](https://tools.ietf.org/html/rfc7519#section-4.1.1)
and its own signing key for tokens in order to keep proper boundary between security domains.
The authorization server also acts as an [OpenID Connect Provider](http://openid.net/connect/),
which means you can request [ID tokens](http://openid.net/specs/openid-connect-core-1_0.html#IDToken)
in addition to [access tokens](https://tools.ietf.org/html/rfc6749#section-1.4) from the authorization server endpoints.

How do you know if you need to use Okta's Authorization Server instead of the authorization service that is
built in to your Okta app?

* You need to protect non-Okta resources.
* You need different authorization policies depending on whether the person is an employee, partner, or end user, or
other similar specializations.

> Note: If your employees, partners, and users can all use the same authentication policies for single sign-on,
try [Okta's built in authorization service](https://support.okta.com/help/articles/Knowledge_Article/Single-Sign-On-Knowledge-Hub).


## Set Up an Authorization Server

Create and configure an Okta Authorization Server to manage authorization between clients and Okta:

* Identify the scopes and claims needed by your client app and register it with Okta.
* Create one or more Authorization Servers and (optionally) define the scopes and claims to match those expected by your app.

It doesn't matter which of these two you do first, but the client app must recognize the scope names and be expecting the claims as defined in the Authorization Server.

This document provides step-by-step instructions for creating and configuring the Authorization Server:

1. [Create an Authorization Server](#create-an-authorization-server)
2. [Create access policies and rules](#create-access-policies)
3. (Optional) [Create scopes](#create-scopes-optional)
4. (Optional) [Create claims](#create-claims-optional)
5. [Test the Authorization Server](#test-your-authorization-server-configuration)

### Create an Authorization Server

1. In the Okta user interface, navigate to **Security > API**.
{% img auth_server_image.png alt:"Authorization Server" width:"640px" %}

2. Choose **Add Authorization Server** and supply the requested information.

    * **Name**
    * **Audience:** URI for the OAuth resource that consumes the Access Tokens. Use an absolute path such as `http://api.example.com/pets`.
      This value is used as the default [audience](https://tools.ietf.org/html/rfc7519#section-4.1.3) for Access Tokens.
    * **Description**

When complete, your Authorization Server's **Settings** tab displays the information that you provided and allows you to edit it.
{% img auth_server2.png alt:"Add Authorization Server" width:"640px" %}

### Create Access Policies

Create access policies and rules for a client or set of clients.

1. In the Okta user interface, navigate to **Security > API**.
2. Choose the name of an Authorization Server.
3. Choose **Access Policies > Add New Access Policy**
    {% img access_policy1.png alt:"Add Access Policy" width:"640px" %}
4. Provide the requested information:
    * **Name**
    * **Description**
    * Assign to **All clients**, or select **The following clients:** and enter the name of the clients covered by this access policy.
    {% img access_policy2.png alt:"Access Policy Configuration" width:"640px" %}

While in the Access Policy list, you can:
* Set access policies to be active or deactivate them for testing or debugging purposes.
* Reorder any policies you create using drag-n-drop.
    {% img access_policy3.png alt:"Access Policy List" width:"640px" %}

Polices are evaluated in priority order, as are the rules in a policy.
The first policy and rule that matches the client request is applied and no further rule or policy processing occurs. If a client matches no policies, the authentication attempt will fail and an error will be returned.

### Create Rules for Each Access Policy

Rules control the mapping of client, user, and custom scope. For example, you can specify a rule for an access policy so that if the user is assigned to a client, then custom scope `scope1` is valid.

1. In the Okta user interface, navigate to **Security > API**.
2. Choose the name of an authorization server, and select **Access Policies**.
3. Choose the name of an access policy, and select **Add Rule**
    {% img rule1.png alt:"Add Rule" width:"640px" %}
4. Enter the requested information:
    * **Rule Name**
    * **IF Grant type is:** Select one or more OAuth 2.0 grant types.
    * **AND User is:** Select whether there's no user (client credentials flow), or a user assigned to a client that's assigned to this rule's policy, or a user assigned to one or more groups that you specify or a list of users that you specify.
    * **AND Requested these scopes:** Choose the scopes (any scopes, or a list that you specify) that can be requested by the user as part of the rule conditions.
    * **THEN Access token lifetime is:** Choose the length of time before an access token expires.
    * **THEN Refresh token lifetime is:** Choose the length of time before a refresh token expires.
5. Choose **Create Rule** to save the rule.
    {% img rule2.png alt:"Rules List" width:"640px" %}

While in the Rules list for an access policy, you can:

* Set a rule to be inactive for testing or debugging.
* Reorder rules. Rules are evaluated in priority order, so the first rule in the first policy that matches the client request is applied and no further processing occurs.

>Note: Service applications (client credentials flow) have no user. If you use this flow, make sure you have at least one rule that specifies the condition **No user**.

At this point you can keep reading to find out how to create custom scopes and claims, or proceed immediately to [Testing your Authorization Server](#test-your-authorization-server-configuration).

### Create Scopes (Optional)

Scopes represent high-level operations that can be performed on your API endpoints.
These are coded into applications, which then ask for them from the authorization server,
and the access policy decides which ones to grant and which ones to deny.

If you need scopes in addition to the reserved scopes provided, create them now.

1. In the Okta user interface, navigate to **Security > API**.
2. Choose the name of the Authorization Server to display, and then select **Scopes**.
{% img scope1.png alt:"Add Scopes" width:"800px" %}

3. Choose **Scopes > Add Scope**, and provide a name and description, then choose **Create** to save the scope.
{% img scope2.png alt:"View Scopes" width:"800px" %}

These scopes are referenced by the **Claims** dialog.

### Create Claims (Optional)

Tokens contain claims that are statements about the subject or another subject, for example name, role, or email address.

Create ID Token claims for OpenID Connect, or Access Tokens for OAuth 2.0:

1. In the Okta user interface, navigate to **Security > API**.
2. Choose the name of the Authorization Server to display, and choose **Claims**.
{% img claims1.png alt:"Choose Claims" width:"800px" %}
 Okta provides a default subject claim. You can edit the mapping, or create your own claims.
3. Choose **Add Claim** and provide the requested information.
{% img claim.png alt:"Edit Claims" width:"800px" %}

    * **Name**
    * **Claim type**: Choose Access Token (Oauth 2.0) or ID Token (OpenID Connect).
    * **Value type**: Choose whether you'll define the claim by a group filter or by an **Expression** written in Okta Expression Language.
        * **Mapping**: This option displays if you chose **Expression** in the previous field. Add the mapping here using [Okta's Expression Language](/reference/okta_expression_language/), for example `appuser.username`.
          Be sure to check that your expression returns the results expected--the expression isn't validated here.
        * **Filter**: This option displays if you chose **Groups** in the previous field. Use it to add a group filter. If you leave it blank, all users are specified for this claim.
    * **Disable claim**: Check this option if you want to temporarily disable the claim for testing or debugging.
    * **Include in**: Specify whether the claim is valid for any scope, or select the scopes for which it is valid.

While in the Claims list, you can:

* Sort claims by type.
* Delete claims you've created, or disable claims for testing or debugging purposes.

    {% img claims2.png alt:"Claims List" width:"640px" %}


## Test Your Authorization Server Configuration

Once you have followed the above instructions to set-up an Authorization Server, you can test it by sending any one of the API calls that returns OAuth 2.0 and/or OpenID Connect tokens. A full description of Okta's relevant APIs can be found here: [OAuth 2.0 Authorization Operations](/docs/api/resources/oauth2.html#authorization-operations). 

We have included here a few things that you can try to ensure that your Authorization Server is functioning as expected. 

> Note: This is not meant to be an exhaustive testing reference, but only to show some examples. 

### OpenID Connect Configuration

To verify that your server was created and has the expected configuration values, you can send an API request to the Server's OpenID Connect Metadata URI: `/oauth2/:authorizationServerId/.well-known/openid-configuration` using an HTTP client or by typing the URI inside of a browser. This will return information about the OpenID configuration of your Authorization Server, though it does not currently return any custom scopes or claims that you might have created.

For more information on this endpoint, see here: [Retrieve Authorization Server OpenID Connect Metadata](/docs/api/resources/oauth2.html#retrieve-authorization-server-openid-connect-metadata).

### Custom Scopes and Claims

You can retrieve a list of all scopes for your Authorization Server, including custom ones, using this endpoint: 

`/api/v1/authorizationServers/:authorizationServerId/scopes` 

For more information on this endpoint, see here: [Get all scopes](/docs/api/resources/oauth2.html#get-all-scopes).

If you created any custom claims, the easiest way to confirm that they have been successfully added is to use this endpoint:

`/api/v1/authorizationServers/:authorizationServerId/claims` 

For more information on this endpoint, see here: [Get all claims](/docs/api/resources/oauth2.html#get-all-claims).

### Testing an OpenID Connect Flow

To test your Authorization Server more thoroughly, you can try a full authentication flow which returns an ID Token. To do this, you will need a client Application in Okta with at least one User assigned to it.

For more information you can read about: 
- [The OpenID Connect Application Wizard](https://help.okta.com/en/prev/Content/Topics/Apps/Apps_App_Integration_Wizard.htm)
- [How to assign a User to an Application](https://support.okta.com/help/Documentation/Knowledge_Article/27418177-Using-the-Okta-Applications-Page#Assigning)

You will need the following values from your Application:

- Client ID
- A valid Redirect URI

Once you have an OpenID Connect Application set-up, and a User assigned to it you can try the authentication flow.

First, you will need your Authorization Server's Authorization Endpoint, which you can retrieve using the Server's Metadata URI: `/oauth2/:authorizationServerId/.well-known/openid-configuration`. It will look like this:

`https://example.okta.com/oauth2/:authorizationServerId/v1/authorize`

To this you will need to add the following URL query parameters:

- Your OpenID Connect Application's `client_id` and `redirect_uri`
- A `scope`, which for the purposes of this test will be `openid` and `profile`
- A `response_mode` which you can set to `fragment`
- (Optionally) `state` and `nonce` values

All of the values are fully documented here: [Obtain an Authorization Grant from a User](/docs/api/resources/oauth2.html#obtain-an-authorization-grant-from-a-user).

The resulting URL would look like this:

`https://example.okta.com/oauth2/:authorizationServerId/v1/authorize?client_id=examplefa39J4jXdcCwWA&response_type=id_token&response_mode=fragment&scope=openid%20profile&redirect_uri=https%3A%2F%2FyourRedirectUriHere.com&state=WM6D&nonce=YsG76jo`

If you paste this into your browser you are redirected to the sign-in page for your Okta org, with a URL that looks like this:

`https://example.okta.com/login/login.htm?fromURI=%2Foauth2%2Fv1%2Fauthorize%2Fredirect%3Fokta_key%aKeyValueWillBeHere`

Here you enter in the credentials for a user who is mapped to your Open ID Connect Application and you will be directed to the `redirect_uri` that you specified along with an ID Token, and any state that you included as well:

`https://yourRedirectUriHere.com/#id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImluZUdjZVQ4SzB1SnZyWGVUX082WnZLQlB2RFowO[...]z7UvPoMEIjuBTH-zNkTS5T8mGbY8y7532VeWKA&state=WM6D`

To check the returned ID Token you can copy the value and paste it into your JWT decoder of choice (for example <https://jsonwebtoken.io>). There you can check the payload to confirm that it contains all of the claims that you are expecting, including custom ones. If you specified a `nonce` you will also find it there:

```json
{
 "sub": "00uawpa4r4Zybz9On0h7",
 "name": "Jakub Vulcan",
 "locale": "en-US",
 "ver": 1,
 "iss": "https://example.okta.com/oauth2/:authorizationServerId",
 "aud": "fa39J40exampleXdcCwWA",
 "iat": 1498328175,
 "exp": 1498331912,
 "jti": "ID.fL39TTtvfBQoyHVkrbaqy9hWooqGOOgWau1W_y-KNyY",
 "amr": [
  "pwd"
 ],
 "idp": "examplefz3q4Yd3Zk70h7",
 "nonce": "YsG76jo",
 "preferred_username": "example@mailinator.com",
 "given_name": "John",
 "family_name": "Smith",
 "zoneinfo": "America/Los_Angeles",
 "updated_at": 1498155598,
 "auth_time": 1498328174,
 "preferred_honorific": "Commodore"
}
```

In this example we see the `nonce` with value `YsG76jo` and the custom claim `preferred_honorific` with value `Commodore`.

At this point you have set-up your Authorization Server and confirmed that it is working!