---
layout: docs_page
title: Create a Token with a Groups Claim Using the App Profile
excerpt: How to use the app profile to create an ID token or access token that contains a groups claim
---

## How to Create a Token with a Groups Claim Using the App Profile

You can add a groups claim for any combination of application groups and user groups into ID tokens or access tokens for API Access Management.
This process optionally uses Okta's flexible app profile, which accepts any JSON-compliant content, to create a whitelist of groups
that can then easily be referenced. This is especially useful if you have a large number of groups to whitelist or otherwise
need to set group whitelists on a per-application basis.

### Before You Start

* Create an OAuth 2.0 or OpenID Connect client with the [Apps API](/docs/api/resources/apps.html#request-example-8). In the instruction examples, the client ID is `0oabskvc6442nkvQO0h7`.
* Create the groups that you wish to configure in the groups claim. In the instruction examples, we're configuring the `WestCoastDivision` group, and the group ID is `00gbso71miOMjxHRW0h7`.

To create a groups claim, assign a group whitelist to your client app, and configure a groups claim that references the whitelist.

> Note: You can perform Step One and Step Three in the user interface if you prefer. 

### Step One: Get the Group IDs

Send a request to `https://{yourOktaDomain}.com/api/v1/groups` and collect the IDs for all the groups you'll want to whitelist.

> Note that this example uses one `groupId` for simplicity's sake.

#### Request Example

~~~http
curl -X GET \
  -H 'Accept: application/json' \
  -H 'Authorization: SSWS ${api_token}' \
  -H 'Content-Type: application/json' \
  "https://{yourOktaDomain}.com/api/v1/groups"
~~~

#### Response Example
    
~~~json
[
    {
        "id": "00gbso71miOMjxHRW0h7",
        "created": "2017-08-25T21:15:48.000Z",
        "lastUpdated": "2017-08-25T21:15:48.000Z",
        "lastMembershipUpdated": "2017-08-25T21:16:07.000Z",
        "objectClass": [
            "okta:user_group"
        ],
        "type": "OKTA_GROUP",
        "profile": {
            "name": "WestCoastDivision",
            "description": "Employees West of the Rockies"
        },
        "_links": {
            "logo": [
                {
                    "name": "medium",
                    "href": "https://op1static.oktacdn.com/assets/img/logos/groups/okta-medium.d7fb831bc4e7e1a5d8bd35dfaf405d9e.png",
                    "type": "image/png"
                },
                {
                    "name": "large",
                    "href": "https://op1static.oktacdn.com/assets/img/logos/groups/okta-large.511fcb0de9da185b52589cb14d581c2c.png",
                    "type": "image/png"
                }
            ],
            "users": {
                "href": "https://{yourOktaDomain}.com/api/v1/groups/00gbso71miOMjxHRW0h7/users"
            },
            "apps": {
                "href": "https://{yourOktaDomain}.com/api/v1/groups/00gbso71miOMjxHRW0h7/apps"
            }
        }
    }
]
~~~

### Step Two:  Add List of Groups to Profile of Client App
 
If you only have one or two groups to specify, simply add the group IDs to the first parameter of the `getFilteredGroups` function described in the next step.
However, if you have a lot of groups to whitelist, you can put the group IDs in the client app's profile property bag: `https://{yourOktaDomain}.com/api/v1/apps/:aid`.
This example names the group whitelist `groupwhitelist`, but you can name it anything.

#### Request Example
    

~~~curl
curl -X POST \
  https://{yourOktaDomain}.com/api/v1/apps/0oabskvc6442nkvQO0h7 \
  -H 'accept: application/json' \
  -H 'authorization: SSWS ${api_token}' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
    "name": "oidc_client",
    "label": "Sample Client",
    "status": "ACTIVE",
    "signOnMode": "OPENID_CONNECT",
    "credentials": {
      "oauthClient": {
        "token_endpoint_auth_method": "client_secret_post"
      }
    },
    "settings": {
      "oauthClient": {
        "client_uri": "http://localhost:8080",
        "logo_uri": "http://developer.okta.com/assets/images/logo-new.png",
        "redirect_uris": [
          "https://example.com/oauth2/callback",
          "myapp://callback"
        ],
        "response_types": [
          "token",
          "id_token",
          "code"
        ],
        "grant_types": [
          "implicit",
          "authorization_code"
        ],
        "application_type": "native"
      }
    },
    "profile": {
        "groupwhitelist": [
            "00gbso71miOMjxHRW0h7"
            ]
    }
  }
~~~
    
You can add application groups, user groups or both to the group whitelist, specified as an array of IDs. 

To use the group whitelist for every client that gets this claim in a token, put the attribute name of the whitelist in the first parameter of the `getFilteredGroups` function described below. 
 
### Step Three: Configure a Custom Claim for Your Groups

Add a custom claim for the ID token on a Custom Authorization Server with the following function: `getFilteredGroups({app.profile.whitelist`}, "{value-to-represent-the-group-in-the-token}", {maximum number of groups to include in token. Must be less than 100.})`.

#### Request Example

In this example, the `name` for the claim is `groups`, but you can name it whatever you wish.

~~~curl
curl -X POST \
  https://{yourOktaDomain}.com/api/v1/authorizationServers/ausain6z9zIedDCxB0h7/claims \
  -H 'accept: application/json' \
  -H 'authorization: SSWS ${api_token}' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
	"name": "groups",
	"status": "ACTIVE",
	"claimType": "RESOURCE",
	"valueType": "EXPRESSION",
	"value": "\"getFilteredGroups(app.profile.groupwhitelist, \"group.name\", 40)\"",
	"conditions": {
        "scopes": []
    }
}'
~~~
  
Hints:

* You can also configure this value in the Okta user interface for editing claims, in **Mapping**: `getFilteredGroups(app.profile.groupwhitelist, "group.name", 40)`.
* Be sure that you have a policy and rule set up in your Custom Authorization Server or the request in the next step won't work.

See [group function documentation](/reference/okta_expression_language/#group-functions) for more information about specifying groups with `getFilteredGroups`.

Now when you mint a token, groups in the `groupwhitelist` that also have the user as a member are included in the `groups` claim. Test your configuration in the next step.

### Step Four: Test that the Claim Is Delivered in the Token

Send a request for an ID token to `https://{yourOktaDomain}.com/oauth2/:authorizationServerId/v1/authorize` to obtain a token with the right groups claim.

#### Request Example

~~~curl
curl -X GET \
  'https://{yourOktaDomain}.com/oauth2/ausain6z9zIedDCxB0h7/v1/authorize?client_id=0oabskvc6442nkvQO0h7
    &response_type=id_token&response_mode=fragment
    &scope=openid&redirect_uri=https%3A%2F%2myRedirectUri.com
    &state=myState&nonce=da2b39ed-b116-4dc5-8393-5d1da350e24b' \
~~~

Decode the JWT in the response to see that the groups are in the token. For example, this JWK contains the group claim:

~~~JSON
eyJhbGciOiJSUzI1NiIsImtpZCI6IlhqNUNEQTkxRGZZc1gyOHBLUzZFbjdLMmlRel9wTUQwNHZ5bXBUQU1wMXcifQ.eyJzdWIiOiI
wMHU1dDYwaWxvT0hOOXBCaTBoNyIsInZlciI6MSwiaXNzIjoiaHR0cHM6Ly9teXN0aWNvcnAub2t0YXByZXZpZXcuY29tL29hdXRoM
i9hdXNhaW42ejl6SWVkREN4QjBoNyIsImF1ZCI6IjBvYWJza3ZjNjQ0Mm5rdlFPMGg3IiwiaWF0IjoxNTA1MjQ2NDkwLCJleHAiOjE
1MDUyNTAwOTAsImp0aSI6IklELlpnWE0zUkVMd3hGOGRUWERhS2EtRGw5TXBzMWZCMUZ4eHpFZkI2RXRrcGsiLCJhbXIiOlsicHdkI
l0sImlkcCI6IjAwbzV0NjBpbDNVenlJZTV2MGg3Iiwibm9uY2UiOiIyMTg1ZWRmNC04NGE4LTQ5MWUtYmE3Mi0yMGI3NjU0MDI1NDM
iLCJhdXRoX3RpbWUiOjE1MDUyMzM0ODksIm15Z3JvdXBXaGl0ZWxpc3QiOlsiV2VzdENvYXN0RGl2aXNpb24iXSwiZmlyc3ROYW1lI
joiTXlzdGkifQ.ZO5mGmjXxE9XUD17hn4NNQtxYZjRK_4dCaXRgpDRajUyzyDW5qmyjZbtv5qbd5JVe3WnT7TVT4qD7UTuVWH6maL-
nS0aE0_F61ftS0xADdacLiGpGuIh-c62AaE7_tdkZBwUagqz3XebhAwZ3SicLUCIpc9ySWyyKf96eIRD2xps3TDZVDS9e5r20r0GWu
EhoW9LksrmAdT63GbGMMt0iH_kWY1ePgG2T-UKWDmdoJZqAthPlCkTWzSyN8oRuebcRQQUA5CIzcWGAuGhiDiOw8sp6utPD0u2pm79
fST36rCGaDHmcm3L60JHlEeIbRArkp_793BB8OKRLdh9weNtcA
~~~

#### Payload Data Decoded

~~~JSON
{
  "sub": "00u5t60iloOHN9pBi0h7",
  "ver": 1,
  "iss": "https://{yourOktaDomain}.com/oauth2/ausain6z9zIedDCxB0h7",
  "aud": "0oabskvc6442nkvQO0h7",
  "iat": 1505323527,
  "exp": 1505327127,
  "jti": "ID.T1lKS9a167PIUUl5vxSsAssIUKpr3TRgqbVbi5U_Ono",
  "amr": [
    "pwd"
  ],
  "idp": "00o5t60il3UzyIe5v0h7",
  "nonce": "2185edf4-84a8-491e-ba72-20b765402543",
  "auth_time": 1505320024,
  "groups": [
    "WestCoastDivision"
  ],
  "firstName": "Annie"
}
~~~

The token contains the group WestCoastDivision so the audience (`aud`) has access to the group information about the user.

> Reminder: For flows other than implicit, post to the token endpoint `https://{yourOktaDomain}.com/oauth2/:authorizationServerId/v1/token` with the user or client you want. Make sure the user is assigned to the app and to one of the groups from your whitelist.