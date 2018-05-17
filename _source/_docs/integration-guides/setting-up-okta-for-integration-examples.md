---
layout: docs_page
title: Setting Up for Okta API Integration Examples
excerpt: Set up an Okta org to use the API integration examples in the Okta API Center
---
# Setting Up for Okta API Integration Examples

Okta provides a set of API integration examples in the [Okta API Center](http://okta-api-am.herokuapp.com/). Use the following instructions to set up an Okta org to use any of the examples in the Okta API Center.

## Prerequisites

Before you can set up an Okta org, ensure the following prerequisites are met:

* You have access to a Super Admin account in an Okta org with API Access Management enabled.
To enable this feature, {{site.contact_support_lc}}.

* You have access to a web application that can accept inbound requests such as `localhost`.

## Set Up Your Okta Org

For all the example integrations in the Okta API center, users try to access a resource on a target resource server.
Users must have a scope of `http://myapp.com/scp/silver` to access the endpoint `/planets` on the target server,
and the scope `http://myapp.com/scp/gold` to access the endpoint `/moons` on the target server.

These instructions help you set up the `planets` path. You can add the `/moons` path using the same instructions.

1. Create a group called `silverSubscribers`. Users in this group will have access to the `/planets` endpoint.
2. Add at least one user to the group.
3. Set up a Custom Authorization Server:
    a. Follow the instructions in Okta's [Authetication Guide](/authentication-guide/implementing-authentication/set-up-authz-server)
    to set up a Custom Authorization Server if don't have one already.
    b. Create a custom scope called `http://myapp.com/scp/silver`.
    c. Create an Access Policy with a rule that includes the `silver` scope for members of the `silverSubscribers` group.
    You can leave the rule assigned to all clients, however, in production the recommended practice is to include
    only the relevant clients. Select the `authorization code` and `implicit` grant types.

    {% img rule-api-center.png alt:"Values for authentication server rule for access policy" width:"600px" %}

4. Set up an OpenID Connect client.

    a. Follow the [help instructions](https://help.okta.com/en/prev/Content/Topics/Apps/Apps_App_Integration_Wizard.htm) to set up an OpenID Connect client. For **Allowed grant types**, select **Authorization Code** and **Implicit (Hybrid)**. Under **Implicit (Hybrid)**, select **Allow the ID token with implicit grant type** and **Allow Access Token with implicit grant type**.

    b. You can add your web app’s URL in **Login redirect URIs** or you can put in a placeholder like `https://example.com` and add a useful value later.

    **Note:** Remember to whitelist the redirect URI for your app (**Security->API->Trusted Origins**).

    c. In the Assignments tab, assign the OpenID Connect client to the **silverSubscribers** group Or give access to the **Everyone** group.
    {% img int-guide-assign-group.png %}

    > Important: In a production environment, use the authorization code flow wherever possible instead of the implicit flow. Also, use real values for the `nonce` and `state` values. For more information, see [OpenID Connect and OAuth 2.0 API](/docs/api/resources/oidc#request-parameters).

5. Test your client and authorization server. Use the URL in the following examples to test your OIDC client and authorization server. 


### Example with Actual Values

```
https://{yourOktaDomain}.com/oauth2/ausce8ii5wBzd0zvQ0h7/v1/authorize?
    response_type=token id_token&
    client_id=0oackbggxnLe1jjl00h7&
    redirect_uri=http://localhost:3090/apigee&
    state=someState&
    nonce=someNonce&
    prompt=login&
    scope=openid http://myapp.com/scp/silver
```

### Example with Variables

```
https://{yourOktaDomain}.com/oauth2/${authz_server_id}/v1/authorize?
    response_type=token id_token&
    client_id=${client_id}&
    redirect_uri=${web_app_url}&
    state=someState&
    nonce=someNonce&
    prompt=login&
    scope=${space-separated_list_of_scopes}
```
This authentication process sends an ID token and an access token as parameters back to the redirect URI (your web app).


