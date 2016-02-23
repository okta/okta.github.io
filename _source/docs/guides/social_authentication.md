---
layout: docs_page
title: Social Authentication
excerpt: Setting up an Okta Social Authentication provider
---

> Social Authentication is currently in ****Early Access (EA)**** status.

You will need to contact Okta if you want to try Social Authentication
on your Okta org.

# Overview

Okta Social Authentication allows Okta to integrate with a Social
Identity Provider such as Facebook or LinkedIn.  These integrations
support the following features:

*User Registration leveraging the user profile from a Social
Provider*

-   Onboarding new users through a Social Provider.
-   Capturing the Social Profile attributes from a Social Provider
    user and storing those attributes in Okta's Universal Directory.

*User Authentication delegated to a Social Provider*

-   Leveraging Social Identity provider for user authentication, thus
    eliminating the need to store an additional username and password
    for that user

*Ongoing profile update from the Social Provider*

-   Enable user profile updates from the linked Social Provider when
    user profile changes on the Social Provider

*Linking of existing Okta account to a Social Provider identity*

-   Provide a flow for users with an existing local account to

*Call-out during registration/linking for custom logic*

-   Support common use cases where additional logic is required during
    registration or linking. For example: prompting a user for
    additional attributes before linking their account, or enabling a
    customized validation or confirmation flow
-   OAuth scope configuration to control which Social Provider profile
    attributes are linked to Okta

The following diagram shows a high-level architecture of Okta Social
Authentication for your application:

<img src="/assets/img/social_authentication_flow.png" alt="Social Authentication Flow" width="800px" />

Advantages of using Okta Social Authentication include:

-   Easy configuration of providers in the Okta Admin UI.
-   Simplieified integration with Social Providers through Okta, no
    need to register your own application directly with the provider
-   Consistent user management, users from social providers reside in
    same Okta Universal Directory as all of your other users.

# Setting up a Social Authentication provider in Okta

1.  Click the blue "Admin" button to get into the Okta Administrator
    view.
2.  From the "Security" menu, select "Identity Providers".
3.  Use the "Add Identity Provider" drop-down menu to select the
    Identity Provider that you want to configure.
    The options for social authentication providers are:
    -   [Facebook](http://saml-doc.okta.com/IdentityProvider_Docs/Facebook_Identity_Provider_Setup.html)
    -   [Google](http://saml-doc.okta.com/IdentityProvider_Docs/Google_Identity_Provider_Setup.html)
    -   [LinkedIn](http://saml-doc.okta.com/IdentityProvider_Docs/LinkedIn_Identity_Provider_Setup.html)
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
    log in to your Okta org or custom application using their social
    credentials.
    
    **Note:** This URL will look similar to this one:
    `https://example.okta.com/oauth2/v1/authorize?idp=0oa0bcde12fghiJkl3m4`
6.  Add an OAuth client via the Okta API
    
    For now, you will need to do this by making HTTP requests
    directly against the Okta API. We suggest using Postman to do
    this. 
    
    If you haven't used Postman before, see our [instructions for
    using Postman with Okta](http://developer.okta.com/docs/api/getting_started/api_test_client.html) before proceeding. Load our [Client
    Registration Postman Collection](https://beta.getpostman.com/collections/2bece1641e75a7d4a222) into Postman and then use the
    "Create OAuth Client" request to create a new OAuth client on
    Okta, this will make a POST request to the `/oauth2/v1/clients`
    URL of your Okta org.
    
    **Note:** You will need use an Okta API key when making this
    request against the Okta API.
    
    When making the HTTP POST to the `/oauth2/v1/clients` URL, you
    should use the default request body, replacing the contents of
    the `redirect_uris` with the URLs that your Social
    Authentication provider will be allowed to redirect users to.
    
    These URLs can be any URL of your choosing. The URLs that you
    will likely want to use would be either the URL for your Okta
    dashboard (so that your employees can log in to Okta using their
    social credentials) or a URL to one of your custom applications
    (so that your users can log in using their social credentials)
    
    The example below shows what a POST request would look like if
    you configured to redirect users to one of the following three
    URLS:
    
    1.  `https://example.okta.com`
        
        An example of a link to the Okta user dashboard.
    2.  `https://www.example.com/User/SocialAuthSuccess.aspx`
        
        An example link to an ASP.NET program.
    3.  `https://payroll.example.com/socialAuth`
        
        An example link to a modified payroll application.
    
    Here is what the body of your POST request should look like:
    
        {
          "client_name": "Example",
          "client_uri": "https://example.com",
          "logo_uri": "https://example.com/logo.png",
          "application_type": "web",
          "redirect_uris": [
            "https://www.example.com/User/SocialAuthSuccess.aspx",
            "https://payroll.example.com/socialAuth",
            "https://example.okta.com"
          ],
          "response_types": [
            "token",
            "id_token"
          ],
          "grant_types": [
            "implicit"
          ],
          "token_endpoint_auth_method": "client_secret_post"
        }
    
    > The contents of the `redirect_uris` array **MUST** be an SSL
    > ("https") URL. Instructions for enabling SSL on your web server
    > is outside of the scope of this document, however an easy way to
    > do this is to use [CloudFlare to add SSL](https://support.cloudflare.com/hc/en-us/articles/200170516-How-do-I-add-SSL-to-my-site-) to your server. If you
    > are developing a service on your own computer that is running on
    > "`http://localhost`", you can use the wonderful [ngrok](https://ngrok.com/) service to
    > create an SSL enabled tunnel for your "`http://localhost`" URL.
    
    After you click the "Send" button in Postman, you will see a JSON
    response from Okta, which will look like the response below. Find
    the `client_id` and copy that for use in the next step.
    
        {
          "id": "ida0bcd12efGhIjK34l5",
          "created": "2015-10-23T22:13:45.000Z",
          "lastUpdated": "2015-10-23T22:13:45.000Z",
          "client_name": "Example",
          "client_uri": "https://example.com",
          "logo_uri": "https://example.com/logo.png",
          "application_type": "web",
          "redirect_uris": [
            "https://www.example.com/User/SocialAuthSuccess.aspx",
            "https://payroll.example.com/socialAuth",
            "https://employees.example.com/directory"
          ],
          "response_types": [
            "token",
            "id_token"
          ],
          "grant_types": [
            "implicit"
          ],
          "token_endpoint_auth_method": "client_secret_post",
          "client_id": "ABCd0efgHi1J2KlMnOP3",
          "client_id_issued_at": 1445638425
        }
    
    In the example result above, the `client_id` is `ABCd0efgHi1J2KlMnOP3`.
    Take note of the `client_id` in your result since you will be using it
    in the next step.
7.  Create a Social Auth Login URL
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
    
    3.  Add a `redirect_url` GET parameter to the Social Auth "Login
        URL".
        
        The last required GET parameter you need to add to your URL
        is the `redirect_url` parameter. The value of this GET
        parameter is where Okta will return a user to after the user
        has finished authenticating against their Social
        Authentication provider. Note that this URL **must** start
        with "https" and **must** match one of the URLs in the
        `redirect_uris` array that you configured previously.
        
        After adding the `redirect_url` GET parameter to 
        your URL, it should look something like this:
        `https://example.okta.com/oauth2/v1/authorize?idp=0oa0bcde12fghiJkl3m4&client_id=AbcDE0fGHI1jk2LM34no&scope=openid%20email%20profile&response_type=id_token&redirect_uri=https://app.example.com/social_auth`
        or, if you are logging your user into Okta, might look
        something like this:
        `https://example.okta.com/oauth2/v1/authorize?idp=0oa0bcde12fghiJkl3m4&client_id=AbcDE0fGHI1jk2LM34no&scope=openid%20email%20profile&response_type=id_token&redirect_uri=https://example.okta.com`

8.  Add the Social Auth Login URL to the page where you want to
    enable Social Auth.  Using the example URL from above, here is
    what that might look like:
    
    <a href="<https://example.okta.com/oauth2/v1/authorize?idp=0oa0bcde12fghiJkl3m4&client_id=AbcDE0fGHI1jk2LM34no&scope=openid%20email%20profile&response_type=id_token&redirect_uri=https://app.example.com/social_auth>">Log in</a>

# Error Codes

See the [OpenID Connect and Okta Social Authentication](file:///docs/api/getting_started/error_codes.html#openid-connect-and-okta-social-authentication)
section of the [Error Codes](file:///docs/api/getting_started/error_codes.html) API documentation.