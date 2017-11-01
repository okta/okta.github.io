---
layout: docs_page
weight: 1
title: SAML Authentication with OIDC
---

# Authenticating Against an External SAML IdP

## Overview

Okta supports authentication with an external SAML Identity Provider (IdP) that then redirects you to Okta and/or your application, which we call Inbound SAML. Additionally, it is possible to include an OpenID Connect (OIDC) ID token along with this redirect. This means that you can use Okta to proxy between SAML-only Identity Providers and OIDC-only applications that would normally be incompatible.

The SAML flow is initiated with the Service Provider (SP), in this case Okta, who then redirects you to the IdP for authentication. On successful authentication, a user is created inside Okta, and you are redirected back to the URL you specified along with an ID token. 

For more high-level information, you can read about [Understanding SP-initiated Login Flow](/standards/SAML/index.html#understanding-sp-initiated-login-flow).

## Set-up

In addition to a SAML IdP that supports SP-initiated SAML, and an Okta org, this flow requires:

- Your SAML IdP to be configured in Okta
- An Okta OIDC Client Application

> Note: The actual order in which you create these is up to you.

### 1. Configure your SAML Identity Provider inside Okta

The configuration information for your external Identity Provider is stored within an Identity Provider entity inside Okta. You can create a SAML Identity Provider from your Developer Console:

1. Hover over Users in the top navigation bar, then select **Social & Identity Providers**.
2. Click on **Add Identity Provider** > **Add SAML 2.0 IdP**.
3. Fill in your SAML Identity Provider's settings here. If you need more information about these values, you can find it in the [Okta Knowledge base](https://support.okta.com/help/Documentation/Knowledge_Article/40561903-Configuring-Inbound-SAML#Part1).

> If you need a quick and easy SAML Identity Provider to use for testing purposes, you can try using this one: <https://github.com/mcguinness/saml-idp>

Once you are done with the configuration, take note of the value at the end of your Assertion Consumer Service (ACS) URL, this is your Okta SAML IdP's `id` value. For example: If your ACS URL is `https://{yourOktaDomain}.com/sso/saml2/0oab8rlfooi5Atqv60h7`, then your Okta IdP's `id` is `0oab8rlfooi5Atqv60h7`.

### 2. Configure an OpenID Connect Client Application

You will also need to add an OIDC Client Application inside Okta. Users that are signing in for the first time will have [user entities](/docs/api/resources/users.html) created for them and associated with this application. You can add an OIDC App using [the OpenID Connect Application Wizard](https://help.okta.com/en/prev/Content/Topics/Apps/Apps_App_Integration_Wizard.htm). You will also need to assign the application to either "Everyone" or a particular Group that you'd like your new SAML users to be associated with. For more information, see [How to assign a User to an Application](https://support.okta.com/help/Documentation/Knowledge_Article/27418177-Using-the-Okta-Applications-Page#Assigning).

Once you are done setting this up, be sure to copy the Client ID for your new application.

### 3. Create an Authorize URL

At this point you should have:

- Your Okta SAML IdP `id` from your ACS URL
- Your OIDC Client Application's Client ID

You will now input these into an Authorize URL in order to kick off the authentication flow.

The authorize URL looks like this:

`https://{yourOktaDomain}.com/oauth2/v1/authorize?idp=0oab8rlwfoo5Atqv60h7&client_id=0oab8om4bars6Y80Z0h7&response_type=id_token&response_mode=fragment&scope=openid&redirect_uri=http%3A%2F%2Flocalhost%3A8080&state=WM6D&nonce=YsG76j`

In this URL, replace `{yourOktaDomain}.com` with your org's base URL, and then input the following:

- `idp` is the value of your SAML IdP's `id`
- `client_id` is your OIDC Client Application's Client ID
- `redirect_uri` needs to be URL encoded and to match a redirect URI that you configured in your OIDC application
- `state` and `nonce` can have any value you want for the purposes of this example

For a full explanation of all these parameters, see here: [OAuth 2.0 Request parameters](/docs/api/resources/oauth2.html#request-parameters).

### Testing the flow

To test the flow, you can enter the completed authorize URL into your browser. For testing purposes, make sure you do this in your browser's privacy or incognito mode. If everything has been configured properly, you will see the following:

1. A redirect to your Identity Provider's sign-in page
2. On successful authentication, you are redirected back to the redirect URI that you specified, along with an `#id_token=` fragment in the URL. The value of this parameter will be your Okta OpenID Connect ID Token.
