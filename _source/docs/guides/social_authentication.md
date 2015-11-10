---
layout: docs_page
title: Social Authentication
excerpt: Setting up an Okta Social Authentication provider
---

> Social Authentication is currently in **Early Access (EA)** status.

1.  Click the blue "Admin" button to get into the Okta Administrator view.
2.  From the "Security" menu, select "Identity Providers".
3.  Use the "Add Identity Provider" drop-down menu to select the
    Identity Provider that you want to configure.
    The options for social authentication providers are:
    -   Facebook
    -   Google
    -   LinkedIn
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
6.  Add an OAuth client via the Okta API
    
    For now, you will need to do this by making HTTP requests
    directly against the Okta API. We suggest using Postman to do
    this. If you haven't used Postman before, see our [instructions
    for using Postman with Okta](http://developer.okta.com/docs/api/getting_started/api_test_client.html) before proceeding. Load our [Client
    Registration Postman Collection](http://beta.getpostman.com/collections/29494567e8da63a0d5e3) into Postman and then use the
    "Create OAuth Client" request to create a new OAuth client on
    Okta, this will make a POST request to the `/api/v1/clients` URL
    of your Okta org.
    
    When making the HTTP POST to the `/api/v1/clients` URL, you
    should use the default request body, replacing the contents of
    the `redirect_uris` with the URLs that your Social Authentication
    provider will be allowed to redirect users to.
    
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
            "code",
            "token",
            "id_token"
        ],
        "grant_types": [
            "authorization_code",
            "implicit"
        ],
        "token_endpoint_auth_method": "private_key_jwt",
        "jwks_uri": "https://static.example.com/certs/public.jwks"
        }
    
    > The contents of the `redirect_uris` array **MUST** be an SSL ("https") URL. Instructions for enabling SSL on your web server is outside of the scope of this document, however an easy way to do this is to use [CloudFlare to add SSL](https://support.cloudflare.com/hc/en-us/articles/200170516-How-do-I-add-SSL-to-my-site-) to your server. If you are developing a service on your own computer that is running on "`http://localhost`", you can use the wonderful [ngrok](https://ngrok.com/) service to create an SSL enabled tunnel for your "`http://localhost`" URL.
    
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
            "code",
            "token",
            "id_token"
          ],
          "grant_types": [
            "authorization_code",
            "implicit"
          ],
          "jwks_uri": "https://static.example.com/certs/public.jwks",
          "token_endpoint_auth_method": "private_key_jwt",
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
        
        The last required GET parameter you need to add to your URL is
        the `redirect_url` parameter. The value of this GET parameter is
        where Okta will return a user to after the user
        has finished authenticating against their Social
        Authentication provider. Note that this URL **must** start with "https" and **must** match one of the URLs in the `redirect_uris` array that you configured previously. 
        
        After adding the `redirect_url` GET parameter to 
        your URL, it should look something like this:
        `https://example.okta.com/oauth2/v1/authorize?idp=0oa0bcde12fghiJkl3m4&client_id=AbcDE0fGHI1jk2LM34no&scope=openid%20email%20profile&response_type=id_token&redirect_uri=https://app.example.com/social_auth`
        or, if you are logging your user into Okta, might look
        something like this:
        `https://example.okta.com/oauth2/v1/authorize?idp=0oa0bcde12fghiJkl3m4&client_id=AbcDE0fGHI1jk2LM34no&scope=openid%20email%20profile&response_type=id_token&redirect_uri=https://example.okta.com`
    
    4.  *Optional*: Add a `response_type` GET parameter to configure
        how the `id_token` is returned to your application.
        
        By default the `id_token` is passed in a URL fragment, if you
        want the `id_token` to be passed in a GET parameter, then
        append `&response_type=query` to your URL.
8.  Add the Social Auth Login URL to the page where you want to
    enable Social Auth.
    Using the example URL from above, here is what that might look
    like:
    
        <a href="https://example.okta.com/oauth2/v1/authorize?idp=0oa0bcde12fghiJkl3m4&client_id=AbcDE0fGHI1jk2LM34no&scope=openid%20email%20profile&response_type=id_token&redirect_uri=https://app.example.com/social_auth">Log in</a>

# Error Codes

If you get an error, you will be redirected to the specified `redirect_uri` with the encoded error code and description as the query parameters `error` and `error_description`.

<table border="2" cellspacing="0" cellpadding="6" rules="groups" frame="hsides">


<colgroup>
<col  class="left" />

<col  class="left" />
</colgroup>
<thead>
<tr>
<th scope="col" class="left">error</th>
<th scope="col" class="left">error_description</th>
</tr>
</thead>

<tbody>
<tr>
<td class="left">UNKNOWN_ENDPOINT</td>
<td class="left">Unknown social endpoint.</td>
</tr>


<tr>
<td class="left">UNAUTHORIZED_CLIENT</td>
<td class="left">The client is not authorized to request an authorization code using this method.</td>
</tr>


<tr>
<td class="left">ACCESS_DENIED</td>
<td class="left">The resource owner or authorization server denied the request.</td>
</tr>


<tr>
<td class="left">INVALID_SCOPE</td>
<td class="left">The requested scope is invalid, unknown, or malformed.</td>
</tr>


<tr>
<td class="left">INVALID_STATE</td>
<td class="left">The authentication request does not have the correct 'state' parameter.</td>
</tr>


<tr>
<td class="left">SERVER_ERROR</td>
<td class="left">The authorization server encountered an unexpected condition that prevented it from fulfilling the request.</td>
</tr>


<tr>
<td class="left">TEMPORARILY_UNAVAILABLE</td>
<td class="left">The authorization server is currently unable to handle the request due to a temporary overloading or maintenance of the server.</td>
</tr>


<tr>
<td class="left">UNSUPPORTED_RESPONSE_TYPE</td>
<td class="left">The authorization server does not support obtaining an authorization code using this method.</td>
</tr>


<tr>
<td class="left">INTERACTION_REQUIRED</td>
<td class="left">Illegal value for 'prompt' parameter.</td>
</tr>


<tr>
<td class="left">ILLEGAL_REDIRECT_URI</td>
<td class="left">Illegal value for redirect_uri parameter.</td>
</tr>


<tr>
<td class="left">NO_EXISTING_SESSION</td>
<td class="left">Client specified prompt=none but had no existing session.</td>
</tr>


<tr>
<td class="left">USER_CANCELED_REQUEST</td>
<td class="left">User canceled the social login request.</td>
</tr>


<tr>
<td class="left">SOCIAL_TRANSACTION_EXPIRED</td>
<td class="left">Social transaction expired.</td>
</tr>


<tr>
<td class="left">INVALID_TOKEN</td>
<td class="left">Could not acquire access token from authorization code.</td>
</tr>


<tr>
<td class="left">GET_SOCIAL_PROFILE_ERROR</td>
<td class="left">Could not fetch social profile.</td>
</tr>


<tr>
<td class="left">FAILED_USERNAME_TRANSFORM</td>
<td class="left">Unable to process the username transform.</td>
</tr>


<tr>
<td class="left">USER_MATCH_ERROR</td>
<td class="left">Could not match social profile to an Okta user.</td>
</tr>


<tr>
<td class="left">USER_LINK_ERROR</td>
<td class="left">Error in linking or finding a linked user.</td>
</tr>


<tr>
<td class="left">INVALID_USER_STATUS_ERROR</td>
<td class="left">User status is invalid.</td>
</tr>


<tr>
<td class="left">LOGIN_FAILED</td>
<td class="left">Login failed.</td>
</tr>


<tr>
<td class="left">PRE_REQ_FEATURE_NOT_ENABLED</td>
<td class="left">Required features are not enabled for this functionality.</td>
</tr>


<tr>
<td class="left">JIT_DISABLED</td>
<td class="left">User creation was disabled.</td>
</tr>


<tr>
<td class="left">JIT_DENIED</td>
<td class="left">User creation was denied by the callout service.</td>
</tr>


<tr>
<td class="left">LINK_DENIED_CALLOUT</td>
<td class="left">User linking was denied by the callout service.</td>
</tr>


<tr>
<td class="left">LINK_DENIED_GROUP</td>
<td class="left">User linking was denied because the user is not in any of the specified groups.</td>
</tr>


<tr>
<td class="left">INVALID_CALLOUT_RESPONSE</td>
<td class="left">The callout service returned an invalid response.</td>
</tr>
</tbody>
</table>