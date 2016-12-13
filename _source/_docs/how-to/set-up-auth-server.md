---
layout: docs_page
title: Set Up Authorization Service
excerpt: Set Up an Authorization Service
---

## Overview

> API Access Management is EA.

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

How do you know if you need to use Okta's authorization server instead of the authorization service that is
built in to your Okta app?

* You need to protect non-Okta resources.
* You need different authorization policies depending on whether the person is an employee, partner, or end user, or
other similar specializations.

> Note: If your employees, partners, and users can all use the same authentication policies for single sign-on, 
try [Okta's built in authorization service](https://support.okta.com/help/articles/Knowledge_Article/Single-Sign-On-Knowledge-Hub). 


## Set Up an Authorization Server

Create and configure an authorization server to manage authorization between clients and Okta:

* Identify the scopes and claims in your client app and register it with Okta.
* Create one or more authorization servers and define the scopes and claims to match those expected by your app.

It doesn't matter which task you do first, but the client app must recognize the scope names and be expecting the
claims as defined in the authorization server.

This document provides step-by-step instructions for creating and configuring the authorization server:

1. [Create the Authorization Server](#create-the-authorization-server).
2. [Create scopes](#create-scopes).
3. [Create claims](#create-claims).
4. [Create access policies and rules](#create-access-policies).
5. [Test the ID Tokens or Access Tokens](#test-your-authorization-server-configuration).

### Create the Authorization Server

1. In the Okta user interface, navigate to **Security > API**.
<img src="/assets/img/auth_server_image.png" alt="Authorization Server" width="640px" />

2. Choose **Add Authorization Server** and supply the requested information.

    * **Name**
    * **Resource URI**&mdash;URI for the OAuth resource that consumes the Access Tokens. Use an absolute path such as `http://api.example.com/pets`.
      This value is used as the default [audience](https://tools.ietf.org/html/rfc7519#section-4.1.3) for Access Tokens.
    * **Description** 

When complete, your authorization server **Settings** tab displays the information that you provided and allows you to edit it.
<img src="/assets/img/auth_server2.png" alt="Add Authorization Server" width="640px" />

### Create Scopes

Scopes represent high-level operations that can be performed on your API endpoints. 
These are coded into applications, which then ask for them from the authorization server, 
and the access policy decides which ones to grant and which ones to deny.

If you need scopes in addition to the reserved scopes provided, create them now. 

1. In the Okta user interface, navigate to **Security > API**.
2. Choose the name of the authorization server to display it, and then select **Scopes**.
<img src="/assets/img/scope1.png" alt="Add Scopes" width="800px" />

3. Choose **Scopes > Add Scope**, and provide a name and description, then choose **Create** to save the scope.
<img src="/assets/img/scope2.png" alt="View Scopes" width="800px" />

These scopes are referenced by the **Claims** dialog.

### Create Claims
 
Tokens contain claims that are statements about the subject or another subject, for example name, role, or email address.

Create ID Token claims for OpenID Connect, or Access Tokens for OAuth 2.0:

1. In the Okta user interface, navigate to **Security > API**.
2. Choose the name of the authorization server to display it, and choose **Claims**.
<img src="/assets/img/claims1.png" alt="Choose Claims" width="800px" />
 Okta provides a default subject claim. You can edit the mapping, or create your own claims.
3. Choose **Add Claim** and provide the requested information.
<img src="/assets/img/claim.png" alt="Edit Claims" width="800px" />

    * **Name**
    * **Claim type**: Choose Access Token (Oauth 2.0) or ID Token (OpenID Connect).
    * **Value type**: Choose whether you'll define the claim by a group filter or by an **Expression** written in Okta Expression Language.
        * **Mapping**: This option displays if you chose **Expression** in the previous field. Add the mapping here using [Okta's Expression Language](/reference/expressionlanguage/), for example `appuser.username`.
          Be sure to check that your expression returns the results expected--the expression isn't validated here.
        * **Filter**: This option displays if you chose **Groups** in the previous field. Use it to add a group filter. If you leave it blank, all users are specified for this claim.
    * **Disable claim**: Check this option if you want to temporarily disable the claim for testing or debugging.
    * **Include in**: Specify whether the claim is valid for any scope, or select the scopes for which it is valid.

While in the Claims list, you can:

* Sort claims by type.
* Delete claims you've created, or disable claims for testing or debugging purposes.

    <img src="/assets/img/claims2.png" alt="Claims List" width="640px" />
    
### Create Access Policies

Create access policies and rules for a client or set of clients.

1. In the Okta user interface, navigate to **Security > API**.
2. Choose the name of an authorization server. 
3. Choose **Access Policies > Add New Access Policy** 
    <img src="/assets/img/access_policy1.png" alt="Add Access Policy" width="640px" />
4. Provide the requested information:
    * **Name**
    * **Description**
    * Assign to **All clients**, or select **The following clients:** and enter the name of the clients covered by this access policy.
    <img src="/assets/img/access_policy2.png" alt="Access Policy Configuration" width="640px" />

While in the Access Policy list, you can:
* Set access policies to be active or deactivate them for testing or debugging purposes.
* Reorder any policies you create using drag-n-drop.  
    <img src="/assets/img/access_policy3.png" alt="Access Policy List" width="640px" />

Polices are evaluated in priority order, as are the rules in a policy. 
The first policy and rule that matches the client request is applied and no further rule or policy processing occurs.

### Create Rules for Each Access Policy

Rules control the mapping of client, user, and custom scope. For example, you can specify
a rule for an access policy so that if the user is assigned to a client, then custom scope `Scope1`
is valid.

1. In the Okta user interface, navigate to **Security > API**.
2. Choose the name of an authorization server, and select **Access Policies**.
3. Choose the name of an access policy, and select **Add Rule**
    <img src="/assets/img/rule1.png" alt="Add Rule" width="640px" />
4. Enter the requested information:
    * **Rule Name**
    * **IF User is**&mdash;Select whether there's no user (client credentials flow), or a user assigned to a client that's assigned to this rule's policy,
      or a user assigned to one or more groups that you specify or a list of users that you specify.
    * **THEN Grant these scopes**&mdash;Choose the scopes (all scopes, or a list that you specify) that are granted if the user meets any of the conditions.
    * **AND Access token lifetime is**&mdash;Choose the length of time before an access token expires.
    * **AND Refresh token lifetime is**&mdash;Choose the length of time before a refresh token expires.
5. Choose **Create Rule** to save the rule.
    <img src="/assets/img/rule2.png" alt="Rules List" width="640px" />

While in the Rules list for an access policy, you can:

* Set a rule to be inactive for testing or debugging.
* Reorder rules, except for the default rule in the default policy. Rules are evaluated in priority order,
so the first rule in the first policy that matches the client request is applied and no further processing occurs.

>Note: Service applications (client credentials flow) have no user. If you use this flow, make sure you have at least one rule
that specifies the condition **No user**.

### Test Your Authorization Server Configuration

For each combination of authorization server and scopes and claims, issue an API call and check that the contents
of the ID Token or Access Token are as expected.
 
