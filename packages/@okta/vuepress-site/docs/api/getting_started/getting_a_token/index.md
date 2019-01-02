---
title: Getting a Token
redirect_from: /docs/getting_started/getting_a_token.html
---

# Create an API token

1.  Log in to your Okta organization as a user with [administrator
    privileges](https://help.okta.com/en/prod/Content/Topics/Security/Administrators.htm?cshid=Security_Administrators#Security_Administrators). API tokens have the same permissions as the user who creates them,
    and if the user permissions change, the API token permissions also change.
	
	If you don't have an Okta organization, you can create a free Okta
    Developer Edition organization [at this link](https://developer.okta.com/signup/){:target="_blank"}.

2.  Click the blue **Admin** button.
![Admin"](/assets/img/okta-admin-ui-button-admin.png "Admin"")

3.  Choose **Tokens** in the API menu.
	{%imgokta-admin-api-token-dev.pngalt:"API"%}![](/assets/img/ "")

4.  Click **Create Token**.
	{%imgokta-create-api-token-button.pngalt:"CreateToken"%}![](/assets/img/ "")

5.  Name your token and click **Create Token**.

6.  Make note of your API token, as you will only see it one time.

![Okta Administrator Token UI](/assets/img/okta-admin-ui-token.png "Okta Administrator Token UI")

## Token Expiration

Okta uses a bearer token for API authentication with a sliding scale expiration. Tokens are valid for 30 days and automatically refresh with each API call.  Tokens that are not used for 30 days expire. The token lifetime is currently fixed and can't be changed for your organization.

## Token Deactivation

If a user account is deactivated in Okta, the API Token is deprovisioned at the same time.

## Token Best Practice: Service Account

API tokens inherit the API access of the user who creates them, so we recommend you create a "service account"
user with only the permission levels you need for the token to perform the API tasks you require.
