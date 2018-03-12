---
layout: docs_page
weight: 2
title: Getting a Token
redirect_from: "/docs/getting_started/getting_a_token.html"
---

# Create an API token

1.  Log in to your Okta organization as a user with [administrator
    privileges](https://help.okta.com/en/prod/Content/Topics/Security/Administrators.htm?cshid=Security_Administrators#Security_Administrators). API tokens have the same permissions as the user who creates them,
    and if the user permissions change, the API token permissions will also change.
	
	If you don't have an Okta organization, you can create a free Okta
    Developer Edition organization [at this link](https://developer.okta.com/signup/){:target="_blank"}.

2.  Click on the blue **Admin** button.
    {% img okta-admin-ui-button-admin.png alt:"Admin" %}

3.  Click on **Tokens** in the API menu.
	{% img okta-admin-api-token-dev.png alt:"API" %}

4.  Click on the **Create token** button.
	{% img okta-create-api-token-button.png alt:"Create Token" %}

5.  Name your token and click **Create token**.

6.  Make note of your API token, as you will only see it one time.

{% img okta-admin-ui-token.png "Okta Administrator Token UI" alt:"Okta Administrator Token UI" %}

## Token Expiration

Okta uses a bearer token for API authentication with a sliding scale expiration. Tokens are valid for 30 days and automatically refresh with each API call.  Tokens that are not used for 30 days will expire. The token lifetime is currently fixed and cannot be changed for your organization.

## Token Deactivation

If a user account is deactivated in Okta, the API Token is deprovisioned at the same time.

## Token Best Practice: Service Account

API tokens inherit the API access of the user who creates them, so we recommend you create a "service account"
user with only the permission levels you need for the token to perform the API tasks you require.