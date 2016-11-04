---
layout: docs_page
title: Configuration Changes Required for API Access Management Beta Update
---

## Configuration Changes Required for API Access Management Beta Update

Okta provides a private authorization server for OAuth 2.0 (Beta).
However, with release 2016.45, you can use a shared authorization server instead, which provides several benefits:

* You created a separate private authorization server for each client, which required you to set scopes and claims 
  and group filters for each client on a separate server, but keeping many configurations in sync is challenging.
  With the shared authorization server, you can create a single configuration of scopes, claims, and Group filters, and
  assign multiple clients. 
* With the shared authorization server, you can create one server per API or other service that you need to secure.
  When you bring a new client online, you can choose which combination of services it can use by choosing the
  appropriate combination of authorization servers. This ensures that access is being granted with the same permissions
  (scopes) each time.

Since a shared authorization server meets the same needs as the current private authorization server,
we are deprecating the private authorization server. All orgs using the private authorization server must create 
a shared authorization server and manually transfer their OAuth 2.0 configuration information
using the instructions provided. 

> Do this within two weeks after preview release 2016.45 is available, currently scheduled for early November. 
After that date, the private authorization server and all configuration information for it (scopes, claims, and groups claims)
will be removed, so be sure to recreate your configurations in the shared authorization server before this date. 

## Prerequisites

* You are an OAuth 2.0 Beta program participant or and OpenID Connect Early Access program participant, and you have existing scope, 
  claim, or group claim configurations set up for either OpenID Connect ID Token or OAuth 2.0 Access Token, and want to keep these configurations.
* You have Admin access to the org where the private authorization server is set up. You need this access
  to collect the existing information and manually transfer it to the new shared authorization server that you will create.

## Instructions

To move from the private authorization server to the shared authorization server:

1. [Create a new Authorization Server](#step-one-create-a-new-authorization-server).
2. [Copy your scopes, claims, and group claims configurations to the new authorization server](#step-two-copy-your-configuration).
3. [Test your shared authorization server configuration](#step-three-test-your-configuration).
4. [Change your clients to use the new endpoints](#step-four-change-your-clients-to-consume-the-new-endpoints).

> You can create more than one shared authorization server. However, to ensure the move is made correctly,
we recommend you only create one shared authorization server, complete these steps, and test it before making any other changes.

### Step One: Create a New Authorization Server

In the Okta user interface, create a new authorization server:

1. In the Okta Admin user interface, go to **Security > API**.
2. Click **Add Authorization Server**.
3. Enter a unique name that indicates the purpose of this authorization server.
4. Enter the **Resource URI**, your base URL for the resources you are storing in the authorization server.
   For example, if your resource is `mycorp.mydomain.com/api/cats`, the resource URI is `mycorp.mydomain.com/api`.
   This value becomes the `audience` in the Access Token.
5. Select **Save**.

### Step Two: Copy Your Configuration

Copy the custom scopes, custom claims, and group claims configuration from the private authorization server 
to the shared authorization server:

For ID Tokens:

1. Navigate to **Applications > Applications** and select an app.
2. Select **Sign On**.
3. Collect all information about the **OpenID Connect ID Token**: `Claims` and `Groups claim`. 
    * The `issuer` and `audience` will change, so you don't need to record them.
    * If you have a Groups claim, collect the information for step 8.
4. Select **Security > API**. 
5. Select your authorization server name.
6. Select **Scopes** and add any of the scopes you collected. Create a scope for groups if you had a groups claim in the private authorization server.
7. Select **Claims** and add any of the claims you collected.
8. If you had a Groups claim (see step 3), create a claim in the shared authorization server with a group filter, then link it
         with a scope. The `groups` scope is not a reserved scope in the shared authorization server.

> The shared authorization server only supports automatic token credentials, so you can ignore the **Token Credentials** field.

For Access Tokens:

1. Navigate to **Applications > Applications** and select an app.
2. Select **Authorization Server**.
3. Collect all the information about **OAuth 2.0 Access Token**: custom `Scopes`, `Claims`, and `Groups claim`.
    * The `issuer` and `audience` will change, so you don't need to record them.
    * If you have a Groups claim, collect the information for step 8.
4. Select **Security > API** 
5. Select your authorization server name.
6. Select **Scopes** and add any of the scopes you copied in step 2.
7. Select **Claims** and add any of the claims you copied in step 2.
8. If you use `groups` to get the claim for group information (see step 3), create it in the shared authorization server.

>Hint: Instead of copying strings from the UI to a text document, you can take screenshots, or open two browsers, one accessing
 the old configuration (steps 1-4), and one showing the new configuration (steps 5-8).

The final configuration step is to create access policies for your new authorization server. 
The private authorization server provided a single default access policy that allows all users to receive all claims.
The shared authorization server allows you to control which users receive which claims, so you must set the access policy
to ensure behavior is the same between private and shared authorization server.

To copy the default access policy from the private authorization server:

1. In **Security > API**, select the name of the authorization server you are configuring.
2. Select **Access Policies > Add Rule**.
3. Enter a name for the rule.
4. Select **User is assigned this client**
5. Enter every custom scope name.
4. Select **Create Rule**.

### Step Three: Test Your Configuration

Send an API request for a token to the old private authorization server and the new shared authorization server.
Both tokens should contain the same scope and claim information. 

<Link to the api doc for the correct operations to use.>

### Step Four: Change Your Clients to Consume the New Endpoints

Change the endpoints in your clients to the new well-known endpoint for the authorization server you created.

To change the well-known endpoint:

1. Find the authorization server ID for your new authorization server. It's displayed in the **Metadata URI** field of the
settings tab ( **Security > API > Authorization Server** ).
1. Use the Discovery Document for [OpenID Connect clients](http://developer.okta.com/docs/api/resources/oidc.html#openid-connect-discovery-document) 
or [OAuth 2.0 clients](http://developer.okta.com/docs/api/resources/oauth2.md#authorization-server-metadata) to identify all endpoints that must be changed, as shown in the example below.
You'll also see the JWKs, introspect and revoke endpoints.

2. Find all the code you've written that references the authorization server in the endpoints returned by the discovery document. For example,
in the previous step, the following endpoints were identified: `/oauth2/v1/authorize`, `/oauth2/v1/token`, and `/oauth2/v1/userinfo`.

3. For every instance in your code that references these endpoints, change them to match the endpoints in the well-known document. 
change the common base URL for the OAuth endpoints described in the previous step. The URL formatting should stay the same (query parameters, client IDs, scopes, and other qualifiers),
just the base URL changes. 

>Hint: If you haven't already, structure your code to make the ID of the authorization server a variable. 
If you have different authorization servers for the app lifecycle (dev, test, prod) or want to move authorization servers
in the future, you can adjust a few variables. 

If you perform validation, change the validation to
check for the issuer, because the issuer is now a different authorization server.

Discovery Document Example for OpenID Connect clients:

Request:
    
~~~sh 
https://${org}.{subdomain}.com/.well-known/openid-configuration
~~~
        
Response:       
    
~~~sh
{
  "issuer": "https://myOrg.example.com",
  "authorization_endpoint": "https://myOrg.example.com/oauth2/v1/authorize",
  "token_endpoint": "https://myOrg.example.com/oauth2/v1/token",
  "userinfo_endpoint": "https://myOrg.example.com/oauth2/v1/userinfo",
  "jwks_uri": "https://myOrg.example.com/oauth2/v1/keys",
  "response_types_supported": [
  "code",
  "id_token",
  "token",
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
    "groups"
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
  ],
  "code_challenge_methods_supported": [
    "S256"
  ],
  "introspection_endpoint": "https://myOrg.example.com/oauth2/aus8nsuk51LdfcfZM0h7/v1/introspect",
  "introspection_endpoint_auth_methods_supported": [
    "client_secret_basic",
    "client_secret_post",
    "none"
  ],
  "revocation_endpoint": "https://myOrg.example.com/oauth2/aus8nsuk51LdfcfZM0h7/v1/revoke",
  "revocation_endpoint_auth_methods_supported": [
    "client_secret_basic",
    "client_secret_post",
    "none"
  ]
}

~~~

Discovery Document Example for OAuth 2.0 clients:

Request:
    
~~~sh 
https://${org}.{subdomain}.com/oauth2/{asId}/.well-known/oauth-authorization-server
~~~
        
Response:      

~~~sh
{
  "issuer": "https://myOrg.example.com/oauth2/aus8nsuk51LdfcfZM0h7",
  "authorization_endpoint": "https://myOrg.example.com/oauth2/aus8nsuk51LdfcfZM0h7/v1/authorize",
  "token_endpoint": "https://myOrg.example.com/oauth2/aus8nsuk51LdfcfZM0h7/v1/token",
  "jwks_uri": "https://myOrg.example.com/oauth2/aus8nsuk51LdfcfZM0h7/v1/keys",
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
  ],
  "subject_types_supported": [
    "public"
  ],
  "scopes_supported": [
    "offline_access",
    "Scope2",
    "Scope1"
  ],
  "token_endpoint_auth_methods_supported": [
    "client_secret_basic",
    "client_secret_post",
    "none"
  ],
  "code_challenge_methods_supported": [
    "S256"
  ],
  "introspection_endpoint": "https://myOrg.example.com/oauth2/aus8nsuk51LdfcfZM0h7/v1/introspect",
  "introspection_endpoint_auth_methods_supported": [
    "client_secret_basic",
    "client_secret_post",
    "none"
  ],
  "revocation_endpoint": "https://myOrg.example.com/oauth2/aus8nsuk51LdfcfZM0h7/v1/revoke",
  "revocation_endpoint_auth_methods_supported": [
    "client_secret_basic",
    "client_secret_post",
    "none"
  ]
}
~~~


##Troubleshooting

If you don't get a successful test in [Step Three](#step-three-test-your-configuration), 
check for the following symptoms and try the resolutions.

### Symptom 1: Some requests still using the old base URL

Did you hard-code the base URL anywhere? If so, remove the hard-coding.

### Symptom 2: Some requests don't return the results expected in a token
 
* Check that the client and shared authorization server configuration match.
* Check the system log for additional details about any errors.