---
layout: docs_page
title: Using Social Login 
excerpt: How to implement social authentication 
---

# Using Social Login 

## Overview

### Features

Integrating social login with Okta allows you to use the following features:

- **User Registration:** Capture the Profile attributes from a Social Identity Provider user and store those attributes in Okta's Universal Directory.

- **User Authentication:** After a user is registered, continue to use that Social Identity Provider for user authentication, thus eliminating the need to store an additional username and password for that user.

- **Social Profile Sync:** If a user updates their Social Profile, those changes can be reflected inside Okta the next time they use social login.

- **Support for Multiple Social Profiles** Multiple Social Profiles can all be linked to one master Okta user.

- **Support for Webhooks:** Make callouts to your application during user registration and/or account linking. For example: prompt a user for additional attributes before linking their account, or enable a customized validation or confirmation flow.

- **OAuth Scope Configuration:** Specify OAuth2 scopes to fully control which Social Profile attributes are linked to Okta. 

### How it Works

#### Set-up

To set-up social login, you configure the following: 

1. An OAuth client in your social provider
2. An Identity Provider in Okta
3. An OAuth Application in Okta

Every Identity Provider in Okta is linked to an Application. Every time a user signs in with a Social Identity Provider for the first time, an Application User is created for them. This means that, for example, if a user signed in with Facebook and Google, they would have three Users in Okta: a Facebook User, a Google User, and a master Okta User that links these two. For more information about how to configure this behavior see [Identity Provider Settings](#idp-settings).

#### The Social Login Process

In general, the social login process works as follows:

1. The user who wishes to authenticate will click a “Log in with x” link.
2. The user authenticates and is asked by the Provider to accept the permissions required by your app.
3. Once the user accepts the permissions, Okta handles the login and redirects the user back to your specified redirect URI with a OpenID Connect ID Token.


## Facebook

##### 1. Set Up a Facebook App 

1.1. Go to <https://developers.facebook.com> and register for a developer account if you haven't already done so.

1.2. Head over to the Facebook App Dashboard: <https://developers.facebook.com/apps>

1.3. Create a Facebook app. Instructions for creating a Facebook application can be found here: <https://developers.facebook.com/docs/apps/register>

1.4. On the “Product Setup” page, click the **Dashboard** link on the left-hand side. 

1.5. Save the App ID and App Secret values so you can add them to the Okta configuration in the next section.

##### 2. Configure Facebook as an Identity Provider in Okta

2.1. Sign in to your Okta org.

2.2. On the main page, click on your name in the upper right and then click on **Admin**. 

2.3. Hover your cursor over **Security** until the menu opens, then click on **Identity Providers**.

2.4. On the Identity Providers page, click on **Add Identity Provider** > **Add Facebook**

- **Name:** We suggest using the name you would expect to see on a button, something like “Log in to Facebook”.
- **IdP Username:** Set to “idpuser.email”.
- **Match against:** Leave set to the default.
- **Account Link Policy:** Leave set to “Automatic” for now.
- **Auto-Link Restrictions:** Leave set to the default.
- **Provisioning Policy:** Leave set to “Automatic” for now.
- **Profile Master:** Leave unchecked if you want to be able to edit your user information in Okta, rather than having Facebook be the only source for all user updates. 
- **Group Assignments:** Leave set to the default, or specify a Group that you would like Facebook users to be added to.
- **Client Id:** Paste in the App ID that you got from Facebook in step 1.5 above.
- **Client Secret:** Paste in the App Secret that you got from Facebook in step 1.5 above.
- **Scopes:** Leave set to the default.

> For more information about these settings [Identity Provider Settings](#idp-settings)

2.5. Once you have completed all the fields, click on **Add Identity Provider**. You will be returned to the main “Identity Providers” page. 

2.6. Find the Facebook Identity Provider that you just added. Once you have found the entry, copy both the “Authorize URL” and “Redirect URI” (ending in `/authorize/callback`).

##### 3. Add the Okta Redirect URI to Facebook

3.1. In your Facebook app configuration, select **Settings** in the left pane.

3.2. Choose **Add Platform**.

3.3. Choose **Website**.

3.4. In the Site URL field, enter the Okta "Redirect URI" that you copied in step 2.6.

3.5. Click **Save Changes**.

##### 4. Register an OAuth Application in Okta

4.1. Back on the Okta Admin site, click on **Applications**

4.2. Click **Add Application**

4.3. On the “Add Application” page, click **Create New App**

4.4. In the modal that pops up, select the appropriate platform for your use case and choose OpenID Connect as your sign-on method. 

4.5. Add a name of your choosing, and optionally a logo, then click **Next**. 

4.6. Add one or more Redirect URIs. This is where the user will be directed to after they have authenticated with Facebook.

4.7. Click **Finish** and you will arrive on the page for your new Facebook application. 

4.8. Beside "General Settings", click on **Edit**

4.9. Enable the "Implicit (Hybrid)" grant type and click **Save**.

4.10. In the "Client Credentials" section, copy your "Client ID", which you will use to complete your Authorize URL in the next step.

4.11. Click on the **Assignments** tab.

4.12. Click **Assign** > **Assign to Groups** 

4.13. Assign the group "Everyone", then click **Done**. 

##### 5. Complete Your Authorize URL

The Okta Identity Provider that you created in section 2 above generated an Authorize URL with a number of blank parameters that you must now fill-in:

- **client_id:** use the client_id value you copied in step 4.10.
- **scope:** Determines the claims that are returned in the ID token. This should have at least `openid`.
- **response_type:** Determines which flow is used. This should be `id_token`.
- **response_mode:** Determines how the authorization response should be returned.
- **state:** Protects against cross-site request forgery (CSRF).
- **nonce:** A string included in the returned ID Token. Use it to associate a client session with an ID Token, and to mitigate replay attacks.
- **redirect_url:** The location where Okta returns a user after the user has finished authenticating against their Social Authentication provider. This URL must start with “https” and must match one of the Redirect URIs  that you configured previously.

For a full explanation of all these parameters, see here: [OAuth 2.0 Request parameters](https://developer.okta.com/docs/api/resources/oauth2.html#request-parameters).

An example of a complete URL looks like this: `https://dev-263012.oktapreview.com/oauth2/v1/authorize?idp=0oaaq9pjc2ujmFZexample&client_id=GkGw4K49N4UEE1example&response_type=id_token&response_mode=fragment&scope=openid&redirect_uri=http://yourAppUrlHere.com/social_auth&state=foo&nonce=bar`

#### Invoking Facebook for Login

There are three primary ways to kick off the sign-in with Facebook flow.

**HTML Link**

One option is to create a link that the user clicks in order to log in. The HREF for that link would be the Authorize URL that you created previously:

`<a href=“https://dev-263012.oktapreview.com/oauth2/v1/authorize?idp=0oaaq9pjc2ujmFZexample&client_id=GkGw4K49N4UEE1example&response_type=id_token&response_mode=fragment&scope=openid&redirect_uri=http://yourAppUrlHere.com/social_auth&state=foo&nonce=bar”>Login With Facebook</a>`

After clicking this link, the user will be prompted to sign in with the social provider. After they succeed they will be returned to the specified `redirect_uri` along with an ID Token in JWT format.

**Okta Sign-in Widget**

Okta also offers an easily embeddable JavaScript widget that reproduces the look and behavior of the standard Okta sign-in page. Adding a "Login with Facebook" button is as simple as adding the following code to your configuration:

```
idps: [
  {type: 'FACEBOOK', id: '$Your_FB_IDP_ID_Here'}
]
```

You can find out more about it [on GitHub](https://github.com/okta/okta-auth-js#introduction). Implementing login with Facebook would use the Widget's [OpenID Connect authentication flow](https://github.com/okta/okta-signin-widget#openid-connect).

**Auth.js**

If you don't want pre-built views, or need deeper levels of customization, then you can use the same AuthJS SDK that the Sign-in Widget is built with. For further information see [the AuthJS GitHub repo](https://github.com/okta/okta-auth-js#install). Implementing login with Facebook would use the SDK's [OpenID Connect authentication flow](https://github.com/okta/okta-auth-js#openid-connect-options).

## Google

##### 1. Set Up a Google App 

1.1. Go to <https://console.developers.google.com/> and register for a developer account if you haven't already done so.

1.2. Create a Google API Console project. Instructions for creating a project can be found here: <https://developers.google.com/identity/sign-in/web/devconsole-project>. You can leave the "Authorized redirect URIs" section blank for now, you will return to it later.

1.3. Save the OAuth client ID and secret values so you can add them to the Okta configuration in the next section.

1.4. Click on "Dashboard" on the left-hand side and click **Enable API**.

1.5. Search for "Google+" and then click on **Google+ API**.

1.6. On the "Google+ API" page, click **Enable** at the top.

##### 2. Configure Google as an Identity Provider in Okta

2.1. Sign in to your Okta org.

2.2. On the main page, click on your name in the upper right and then click on **Admin**. 

2.3. Hover your cursor over **Security** until the menu opens, then click on **Identity Providers**.

2.4. On the Identity Providers page, click on **Add Identity Provider** > **Add Google**

- **Name:** We suggest using the name you would expect to see on a button, something like “Log in to Google”.
- **IdP Username:** Set to “idpuser.email”.
- **Match against:** Leave set to the default.
- **Account Link Policy:** Leave set to “Automatic” for now.
- **Auto-Link Restrictions:** Leave set to the default.
- **Provisioning Policy:** Leave set to “Automatic” for now.
- **Profile Master:** Leave unchecked if you want to be able to edit your user information in Okta, rather than having Google be the only source for all user updates. 
- **Group Assignments:** Leave set to the default, or specify a Group that you would like Google users to be added to.
- **Client Id:** Paste in the App ID that you got from Google in step 1.3 above.
- **Client Secret:** Paste in the App Secret that you got from Google in step 1.3 above.
- **Scopes:** Leave set to the default.

> For more information about these settings see [Identity Provider Settings](#idp-settings)

2.5. Once you have completed all the fields, click on **Add Identity Provider**. You will be returned to the main “Identity Providers” page. 

2.6. On the "Identity Providers" page, you should find the Google Identity Provider that you just added. Once you have found the entry, copy both the “Authorize URL” and “Redirect URI” (ending in `/authorize/callback`).

##### 3. Add the Okta Redirect URI to Google

3.1. In your Google API Manager Credentials page, select the OAuth client you just created.

3.2. In the "Restrictions" section, find the "Authorized redirect URIs"

3.3. Paste in the Redirect URI from step 2.6 above.

3.5. Click **Save**.

##### 4. Register an OAuth Application in Okta

4.1. Back on the Okta Admin site, click on **Applications**

4.2. Click **Add Application**

4.3. On the “Add Application” page, click **Create New App**

4.4. In the modal that pops up, select the appropriate platform for your use case and choose OpenID Connect as your sign-on method. 

4.5. Add a name of your choosing, and optionally a logo, then click **Next**. 

4.6. Add one or more Redirect URIs. This is where the user will be directed to after they have authenticated with Google.

4.7. Click **Finish** and you will arrive on the page for your new Google application. 

4.8. Beside "General Settings", click on **Edit**

4.9. Enable the "Implicit (Hybrid)" grant type and click **Save**.

4.10. In the "Client Credentials" section, copy your "Client ID", which you will use to complete your Authorize URL in the next step.

4.11. Click on the **Assignments** tab.

4.12. Click **Assign** > **Assign to Groups** 

4.13. Assign the group "Everyone", then click **Done**. 

##### 5. Complete Your Authorize URL

The Okta Identity Provider that you created in section 2 above generated an Authorize URL with a number of blank parameters that you must now fill-in:

- **client_id:** use the client_id value you copied in step 4.10.
- **scope:** Determines the claims that are returned in the ID token.
- **response_type:** Determines which flow is used.
- **response_mode:** Determines how the authorization response should be returned.
- **state:** Protects against cross-site request forgery (CSRF).
- **nonce:** A string included in the returned ID Token. Use it to associate a client session with an ID Token, and to mitigate replay attacks.
- **redirect_url:** The location where Okta returns a user after the user has finished authenticating against their Social Authentication provider. This URL must start with “https” and must match one of the Redirect URIs that you configured previously.

For a full explanation of all these parameters, see here: [OAuth 2.0 Request parameters](https://developer.okta.com/docs/api/resources/oauth2.html#request-parameters).

An example of a complete URL looks like this: `https://dev-263012.oktapreview.com/oauth2/v1/authorize?idp=0oaaq9pjc2ujmFZexample&client_id=GkGw4K49N4UEE1example&response_type=id_token&response_mode=fragment&scope=openid&redirect_uri=http://yourAppUrlHere.com/social_auth&state=foo&nonce=bar`

#### Invoking Google for Login

There are three primary ways to kick off the sign-in with Google flow.

**HTML Link**

One option is to create a link that the user clicks in order to log in. The HREF for that link would be the Authorize URL that you created previously:

`<a href=“https://dev-263012.oktapreview.com/oauth2/v1/authorize?idp=0oaaq9pjc2ujmFZexample&client_id=GkGw4K49N4UEE1example&response_type=id_token&response_mode=fragment&scope=openid&redirect_uri=http://yourAppUrlHere.com/social_auth&state=foo&nonce=bar”>Login With Google</a>`

After clicking this link, the user will be prompted to sign in with the social provider. After they succeed they will be returned to the specified `redirect_uri` along with an ID Token in JWT format.

**Okta Sign-in Widget**

Okta also offers an easily embeddable JavaScript widget that reproduces the look and behavior of the standard Okta sign-in page. You can find out more about it [on GitHub](https://github.com/okta/okta-auth-js#introduction). Implementing login with Google would use the Widget's [OpenID Connect authentication flow](https://github.com/okta/okta-signin-widget#openid-connect).

**Auth.js**

If you don't want pre-built views, or need deeper levels of customization, then you can use the same AuthJS SDK that the Sign-in Widget is built with. For further information see [the AuthJS GitHub repo](https://github.com/okta/okta-auth-js#install). Implementing login with Google would use the SDK's [OpenID Connect authentication flow](https://github.com/okta/okta-auth-js#openid-connect-options).

## LinkedIn

##### 1. Set Up a LinkedIn App 

1.1. Go to <https://developer.linkedin.com/> and register for a developer account if you haven't already done so.

1.2. Create a LinkedIn app here: <https://www.linkedin.com/developer/apps>.  

1.3. Save the OAuth client ID and secret values so you can add them to the Okta configuration in the next section. 

1.4. Select `r_basicprofile` and `r_emailaddress` as the "Default Application Permissions". You can leave the "Authorized redirect URLs" section blank for now, you will return to it later.

##### 2. Configure LinkedIn as an Identity Provider in Okta

2.1. Sign in to your Okta org.

2.2. On the main page, click on your name in the upper right and then click on **Admin**. 

2.3. Hover your cursor over **Security** until the menu opens, then click on **Identity Providers**.

2.4. On the Identity Providers page, click on **Add Identity Provider** > **Add LinkedIn**

- **Name:** We suggest using the name you would expect to see on a button, something like “Log in to LinkedIn”.
- **IdP Username:** Set to “idpuser.email”.
- **Match against:** Leave set to the default.
- **Account Link Policy:** Leave set to “Automatic” for now.
- **Auto-Link Restrictions:** Leave set to the default.
- **Provisioning Policy:** Leave set to “Automatic” for now.
- **Profile Master:** Leave unchecked if you want to be able to edit your user information in Okta, rather than having LinkedIn be the only source for all user updates. 
- **Group Assignments:** Leave set to the default, or specify a Group that you would like Facebook users to be added to.
- **Client Id:** Paste in the App ID that you got from LinkedIn in step 1.3 above.
- **Client Secret:** Paste in the App Secret that you got from LinkedIn in step 1.3 above.
- **Scopes:** Leave set to the default.

> For more information about these settings see [Identity Provider Settings](#idp-settings)

2.5. Once you have completed all the fields, click on **Add Identity Provider**. You will be returned to the main “Identity Providers” page. 

2.6. On the "Identity Providers" page, you should find the LinkedIn Identity Provider that you just added. Once you have found the entry, copy both the “Authorize URL” and “Redirect URI” (ending in `/authorize/callback`).

##### 3. Add the Okta Redirect URI to LinkedIn

3.1. In your LinkedIn app's page, find the "OAuth 2.0" section under "Authorized Redirect URLs" paste in the Redirect URI from step 2.6 above.

3.2. Click **Update**.

##### 4. Register an OAuth Application in Okta

4.1. Back on the Okta Admin site, click on **Applications**

4.2. Click **Add Application**

4.3. On the “Add Application” page, click **Create New App**

4.4. In the modal that pops up, select the appropriate platform for your use case and choose OpenID Connect as your sign-on method. 

4.5. Add a name of your choosing, and optionally a logo, then click **Next**. 

4.6. Add one or more Redirect URIs. This is where the user will be directed to after they have authenticated with LinkedIn.

4.7. Click **Finish** and you will arrive on the page for your new LinkedIn application. 

4.8. Beside "General Settings", click on **Edit**

4.9. Enable the "Implicit (Hybrid)" grant type and click **Save**.

4.10. In the "Client Credentials" section, copy your "Client ID", which you will use to complete your Authorize URL in the next step.

4.11. Click on the **Assignments** tab.

4.12. Click **Assign** > **Assign to Groups** 

4.13. Assign the group "Everyone", then click **Done**. 

##### 5. Complete Your Authorize URL

The Okta Identity Provider that you created in section 2 above generated an Authorize URL with a number of blank parameters that you must now fill-in:

- **client_id:** use the client_id value you copied in step 4.10.
- **scope:** Determines the claims that are returned in the ID token.
- **response_type:** Determines which flow is used.
- **response_mode:** Determines how the authorization response should be returned.
- **state:** Protects against cross-site request forgery (CSRF).
- **nonce:** A string included in the returned ID Token. Use it to associate a client session with an ID Token, and to mitigate replay attacks.
- **redirect_url:** The location where Okta returns a user after the user has finished authenticating against their Social Authentication provider. This URL must start with “https” and must match one of the Redirect URIs that you configured previously.

For a full explanation of all these parameters, see here: [OAuth 2.0 Request parameters](https://developer.okta.com/docs/api/resources/oauth2.html#request-parameters).

An example of a complete URL looks like this: `https://dev-263012.oktapreview.com/oauth2/v1/authorize?idp=0oaaq9pjc2ujmFZexample&client_id=GkGw4K49N4UEE1example&response_type=id_token&response_mode=fragment&scope=openid&redirect_uri=http://yourAppUrlHere.com/social_auth&state=foo&nonce=bar`

#### Invoking LinkedIn for Login

There are three primary ways to kick off the flow to sign-in with LinkedIn.

**HTML Link**

One option is to create a link that the user clicks in order to log in. The HREF for that link would be the Authorize URL that you created previously:

`<a href=“https://dev-263012.oktapreview.com/oauth2/v1/authorize?idp=0oaaq9pjc2ujmFZexample&client_id=GkGw4K49N4UEE1example&response_type=id_token&response_mode=fragment&scope=openid&redirect_uri=http://yourAppUrlHere.com/social_auth&state=foo&nonce=bar”>Login With LinkedIn</a>`

After clicking this link, the user will be prompted to sign in with the social provider. After they succeed they will be returned to the specified `redirect_uri` along with an ID Token in JWT format.

**Okta Sign-in Widget**

Okta also offers an easily embeddable JavaScript widget that reproduces the look and behavior of the standard Okta sign-in page. You can find out more about it [on GitHub](https://github.com/okta/okta-auth-js#introduction). Implementing login with LinkedIn would use the Widget's [OpenID Connect authentication flow](https://github.com/okta/okta-signin-widget#openid-connect).

**Auth.js**

If you don't want pre-built views, or need deeper levels of customization, then you can use the same AuthJS SDK that the Sign-in Widget is built with. For further information see [the AuthJS GitHub repo](https://github.com/okta/okta-auth-js#install). Implementing login with LinkedIn would use the SDK's [OpenID Connect authentication flow](https://github.com/okta/okta-auth-js#openid-connect-options).


## Microsoft

##### 1. Set Up a Microsoft App 

1.1. Create a Microsoft app here: <https://apps.dev.microsoft.com/#/appList>. Instructions can be found here: https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-app-registration. You can pause once you get to the Redirect URI section, we will come back to this.

1.3. Save the Application ID for later.

1.4. Under "Application Secrets", click on **Generate New Password** and save the value that comes up. This is the Secret that corresponds to your Application ID.


##### 2. Configure Microsoft as an Identity Provider in Okta

2.1. Sign in to your Okta org.

2.2. On the main page, click on your name in the upper right and then click on **Admin**. 

2.3. Hover your cursor over **Security** until the menu opens, then click on **Identity Providers**.

2.4. On the Identity Providers page, click on **Add Identity Provider** > **Add Microsoft**

- **Name:** We suggest using the name you would expect to see on a button, something like “Log in to Microsoft”.
- **IdP Username:** Set to “idpuser.email”.
- **Match against:** Leave set to the default.
- **Account Link Policy:** Leave set to “Automatic” for now.
- **Auto-Link Restrictions:** Leave set to the default.
- **Provisioning Policy:** Leave set to “Automatic” for now.
- **Profile Master:** Leave unchecked if you want to be able to edit your user information in Okta, rather than having Microsoft be the only source for all user updates. 
- **Group Assignments:** Leave set to the default, or specify a Group that you would like Microsoft users to be added to.
- **Client Id:** Paste in the App ID that you got from Microsoft in step 1.3 above.
- **Client Secret:** Paste in the App Secret that you got from Microsoft in step 1.4 above.
- **Scopes:** Leave set to the default.

> For more information about these settings see [Identity Provider Settings](#idp-settings)

2.5. Once you have completed all the fields, click on **Add Identity Provider**. You will be returned to the main “Identity Providers” page. 

2.6. On the "Identity Providers" page, you should find the Microsoft Identity Provider that you just added. Once you have found the entry, copy both the “Authorize URL” and “Redirect URI” (ending in `/authorize/callback`).

##### 3. Add the Okta Redirect URI to Microsoft

3.1. Back on your Microsoft app's registration page, if you haven't already, click **Add Platform**.

3.2. Select **Web**

3.3. Paste in the Redirect URI from step 2.6. into the "Redirect URLs" box then click **Add URL**

3.2. Click **Save**.

##### 4. Register an OAuth Application in Okta

4.1. Back on the Okta Admin site, click on **Applications**

4.2. Click **Add Application**

4.3. On the “Add Application” page, click **Create New App**

4.4. In the modal that pops up, select the appropriate platform for your use case and choose OpenID Connect as your sign-on method. 

4.5. Add a name of your choosing, and optionally a logo, then click **Next**. 

4.6. Add one or more Redirect URIs. This is where the user will be directed to after they have authenticated with Microsoft.

4.7. Click **Finish** and you will arrive on the page for your new Microsoft application. 

4.8. Beside "General Settings", click on **Edit**

4.9. Enable the "Implicit (Hybrid)" grant type and click **Save**.

4.10. In the "Client Credentials" section, copy your "Client ID", which you will use to complete your Authorize URL in the next step.

4.11. Click on the **Assignments** tab.

4.12. Click **Assign** > **Assign to Groups** 

4.13. Assign the group "Everyone", then click **Done**. 

##### 5. Complete Your Authorize URL

The Okta Identity Provider that you created in section 2 above generated an Authorize URL with a number of blank parameters that you must now fill-in:

- **client_id:** use the client_id value you copied in step 4.10.
- **scope:** Determines the claims that are returned in the ID token.
- **response_type:** Determines which flow is used.
- **response_mode:** Determines how the authorization response should be returned.
- **state:** Protects against cross-site request forgery (CSRF).
- **nonce:** A string included in the returned ID Token. Use it to associate a client session with an ID Token, and to mitigate replay attacks.
- **redirect_url:** The location where Okta returns a user after the user has finished authenticating against their Social Authentication provider. This URL must start with “https” and must match one of the Redirect URIs that you configured previously.

For a full explanation of all these parameters, see here: [OAuth 2.0 Request parameters](https://developer.okta.com/docs/api/resources/oauth2.html#request-parameters).

An example of a complete URL looks like this: `https://dev-263012.oktapreview.com/oauth2/v1/authorize?idp=0oaaq9pjc2ujmFZexample&client_id=GkGw4K49N4UEE1example&response_type=id_token&response_mode=fragment&scope=openid&redirect_uri=http://yourAppUrlHere.com/social_auth&state=foo&nonce=bar`

#### Invoking Microsoft for Login

There are two primary ways to actually kick off the sign-in with Microsoft flow.

**HTML Link**

One option is to create a link that the user clicks in order to log in. The HREF for that link would be the Authorize URL that you created previously:

`<a href=“https://dev-263012.oktapreview.com/oauth2/v1/authorize?idp=0oaaq9pjc2ujmFZexample&client_id=GkGw4K49N4UEE1example&response_type=id_token&response_mode=fragment&scope=openid&redirect_uri=http://yourAppUrlHere.com/social_auth&state=foo&nonce=bar”>Login With Microsoft</a>`

After clicking this link, the user will be prompted to sign in with the social provider. After they succeed they will be returned to the specified `redirect_uri` along with an ID Token in JWT format.

**Okta Sign-in Widget**

The Okta Sign-in Widget does not currently support signing in with Microsoft.

**Auth.js**

If you don't want pre-built views, or need deeper levels of customization, then you can use the same AuthJS SDK that the Sign-in Widget is built with. For further information see [the AuthJS GitHub repo](https://github.com/okta/okta-auth-js#install). Implementing login with Microsoft would use the SDK's [OpenID Connect authentication flow](https://github.com/okta/okta-auth-js#openid-connect-options).


# Identity Provider Settings <a name="idp-settings"></a>

When you are setting up your Identity Provider (IdP) in Okta, there are a number of settings that allow you to finely control the social login behavior. 

### Authentication Settings

**IdP username:** The IdP attribute that should map to the Okta username. The dropdown list contains the default value, `idpuser.email`.

You can enter an expression to reformat the value, if desired. For example, if the username in the SAML assertion is `john.doe@mycompany.okta.com`, you could specify the replacement of `mycompany.okta` with `endpointA.mycompany` to make the transformed username `john.doe@endpointA.mycompany.com`. If you want to enter an expression, follow the [Okta Expression Language link](http://developer.okta.com/docs/getting_started/okta_expression_lang.html) for syntax requirements.

**Match against:** The Okta user property against which the IdP username is compared. 

More user profile attributes are available for matching as an Early Access feature. To enable more choices, contact Support.

**Account Link Policy:** Determines whether your Application User should be linked to an Okta user

- Automatic: Link user accounts automatically according to the "Auto-Link" and "Match against" settings. 
- Callout: Account linking decisions should be delegated to an external application.
- Disabled: Do not link existing User accounts. Unless User is already linked, login will fail.

**Auto-Link Restrictions:** Allows you to restrict auto-linking to members of specified groups.

**Provisioning Policy:** Determines whether just-in-time provisioning of users should be automatic, disabled, or delegated to an external application via a callout.

### JIT Settings

**Profile Master:** If an authenticated user exists, the user is updated with the information in this SAML assertion when this box is selected. If this box is not selected, the flow continues without updating information. 

**Group Assignments:** Allows you to assign new users to one ore more existing Groups. For example, new Facebook users could be added to a "Facebook" Group.