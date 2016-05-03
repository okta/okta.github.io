---
layout: docs_page
title: Social Authentication
excerpt: Setting up an Okta Social Authentication provider
---

# Overview

Okta Social Authentication allows Okta to integrate with a Social Identity Provider such as Facebook, Google, LinkedIn, and Microsoft. These integrations support the following features:

*User Registration leveraging the user profile from a Social Provider*

  - Onboarding new users through a Social Provider.
  - Capturing the Social Profile attributes from a Social Provider user and storing those attributes in Okta's Universal Directory.

*User Authentication delegated to a Social Provider*

  - Leveraging Social Identity provider for user authentication, thus eliminating the need to store an additional username and password for that user

*Ongoing profile update from the Social Provider*

  - Enable user profile updates from the linked Social Provider when user profile changes on the Social Provider
  
*Linking of existing Okta account to a Social Provider identity*

  - Provide a flow for users with an existing local account to 

*Call-out during registration/linking for custom logic*

  - Support common use cases where additional logic is required during registration or linking. For example: prompting a user for additional attributes before linking their account, or enabling a customized validation or confirmation flow
  - OAuth scope configuration to control which Social Provider profile attributes are linked to Okta

The following diagram shows a high-level architecture of Okta Social Authentication for your application:

<img src="/assets/img/social_authentication_flow.png" alt="Social Authentication Flow" width="800px" />

Advantages of using Okta Social Authentication include:

- Easy configuration of providers in the Okta Admin UI.
- Simplified integration with Social Providers through Okta, no need to register your own application directly with the provider.
- Consistent user management, users from social providers reside in same Okta Universal Directory as all of your other users.

# Setting up a Social Authentication provider in Okta

1.  Click the blue "Admin" button to get into the Okta Administrator view.

2.  From the "Security" menu, select "Identity Providers".

3.  Use the "Add Identity Provider" drop-down menu to select the
    Identity Provider that you want to configure.
    
    The options for social authentication providers are:
    -   [Facebook](http://saml-doc.okta.com/IdentityProvider_Docs/Facebook_Identity_Provider_Setup.html)
    -   [Google](http://saml-doc.okta.com/IdentityProvider_Docs/Google_Identity_Provider_Setup.html)
    -   [LinkedIn](http://saml-doc.okta.com/IdentityProvider_Docs/LinkedIn_Identity_Provider_Setup.html)
    -   [Microsoft](http://saml-doc.okta.com/IdentityProvider_Docs/Microsoft_Identity_Provider_Setup.html)
4.  Configure your Social Authentication provider:
    -   **Name**: We suggest using the name you would
        expect to see on a button, something like "Log in to Facebook".
    -   **Transform username**: Set to to "`email`".
    -   **Authenticate if username matches**: Leave set to the default.
    -   **Account Link Policy**: Leave set to "Automatic" for now.
    -   **Auto-Link Restrictions**: Leave set to the default.
    -   **Provisioning Policy**: Leave set to "Automatic" for now.
    -   **Profile Master**: Leave unchecked.
    -   **Group Assignments**: Leave set to the default.
    -   **Client Id**: Set this to appropriate value for the Social
        Authentication provider that you are configuring.
    -   **Client Secret**: Set this to appropriate value for the Social
        Authentication provider that you are configuring.
    -   **Scopes**: Leave set to the default.
    
5.  Make note of the "Login URL" from the "Identity Providers" page.
    
    Copy this URL somewhere you can refer to it later. You will be
    using this URL to create an HTTP link that will allow users to
    log in to your Okta org or custom application using their social credentials.
    
    **Note:** This URL will look similar to this one:
    `https://example.okta.com/oauth2/v1/authorize?idp=0oa0bcde12fghiJkl3m4`
    
6.  Register an OAuth client using the App Integration Wizard.
    
    1. Navigate to the Administrator Dashboard.
    
    2. Select *Applications*.
    
    3. Select *Add Application*.
    
    4. Select *Create New App* to launch the App Integration Wizard. It guides you through the necessary configuration
    steps and give you back a `client_id` which you use in Step 7.
    
7.  Create a Social Auth Login URL.
    1.  Append the `client_id` you copied above into the Social Auth
        "Login URL" as the value of a GET parameter name `client_id`.
        
        For example, your Social Auth "Login URL" should now look something like this:
        `https://example.okta.com/oauth2/v1/authorize?idp=0oa0bcde12fghiJkl3m4&client_id=AbcDE0fGHI1jk2LM34no`
    2.  Add the `scope` and `response_type` GET parameters to the Social Auth Login URL in the step above.
        
        To do this, simply append this string to the end of your
        Social Auth "Login URL": `&scope=openid%20email%20profile&response_type=id_token`
        
        After adding the `scope` and `response_type` parameters to
        your URL, it should look something like this:
        `https://example.okta.com/oauth2/v1/authorize?idp=0oa0bcde12fghiJkl3m4&client_id=AbcDE0fGHI1jk2LM34no&scope=openid%20email%20profile&response_type=id_token`

    3.  Add the requiered `state` GET parameter to the Social Auth "Login
        URL":
        `https://example.okta.com/oauth2/v1/authorize?idp=0oa0bcde12fghiJkl3m4&client_id=AbcDE0fGHI1jk2LM34no&scope=openid%20email%20profile&response_type=id_token&state=staterandom`
        
        Ideally, the state parameter should be a random generated string value for each request performed this way and must be validated after retreiving an id_token back from Okta in your app.
    
    4.  Add a `redirect_url` GET parameter to the Social Auth "Login
        URL".
        
        The last required GET parameter you need to add to your URL is
        the `redirect_url` parameter. The value of this GET parameter is
        where Okta will return a user to after the user
        has finished authenticating against their Social
        Authentication provider. Note that this URL **must** start with "https" and **must** match one of the URLs in the `redirect_uris` array that you configured previously. 
        
        After adding the `redirect_url` GET parameter to 
        your URL, it should look something like this:
        `https://example.okta.com/oauth2/v1/authorize?idp=0oa0bcde12fghiJkl3m4&client_id=AbcDE0fGHI1jk2LM34no&scope=openid%20email%20profile&response_type=id_token&state=staterandom&redirect_uri=https://app.example.com/social_auth`
        or, if you are logging your user into Okta, might look
        something like this:
        `https://example.okta.com/oauth2/v1/authorize?idp=0oa0bcde12fghiJkl3m4&client_id=AbcDE0fGHI1jk2LM34no&scope=openid%20email%20profile&response_type=id_token&state=staterandom&redirect_uri=https://example.okta.com`
    
8.  Add the Social Auth Login URL to the page where you want to
    enable Social Auth.
    Using the example URL from above, here is what that might look
    like:
    
        <a href="https://example.okta.com/oauth2/v1/authorize?idp=0oa0bcde12fghiJkl3m4&client_id=AbcDE0fGHI1jk2LM34no&scope=openid%20email%20profile&response_type=id_token&redirect_uri=https://app.example.com/social_auth">Log in</a>

# Error Codes

See the [OpenID Connect and Okta Social Authentication](/docs/api/getting_started/error_codes.html#openid-connect-and-okta-social-authentication) section of the [Error Codes](/docs/api/getting_started/error_codes.html) API documentation.
