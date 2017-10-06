---
layout: docs_page
title: Using the Okta Auth SDK
excerpt: How to customize login with the Okta Auth SDK
---

# Using the Okta Auth SDK

## Overview

The Okta Auth SDK builds on top of our [Authentication API](/docs/api/resources/authn.html) and [OAuth 2.0 API](/docs/api/resources/oidc.html) to enable you to create a fully branded sign-in experience using JavaScript.

The Auth SDK is used by Okta's [Sign-in Widget](/code/javascript/okta_auth_sdk) which powers the default Okta sign-in page. If you are building a JavaScript front end or Single Page App (SPA), the Auth SDK gives you added control and customization beyond what is possible with the Widget.

In this Quickstart you will learn how to use the Auth SDK on a simple static page to:

- Retrieve and store an OpenID Connect (OIDC) token
- Get an Okta session 

If you'd like to jump right into the Auth SDK's code, you can find it on GitHub here: <https://github.com/okta/okta-auth-js>.

If you'd like to read the Auth SDK's reference page, you will find it here: [Okta Auth SDK Reference Page](/code/javascript/okta_auth_sdk_ref).

## Prerequisites

You will need the following things for this quickstart:

- An Okta org - If you don't have an existing org, register for [Okta Developer Edition](https://developer.okta.com/signup/).
- An OpenID Connect Application. Instructions for creating one can be found on [this page](https://help.okta.com/en/prev/Content/Topics/Apps/Apps_App_Integration_Wizard.htm), under the "OpenID Connect Wizard" section.
- At least one User [assigned to the Application](https://support.okta.com/help/Documentation/Knowledge_Article/27418177-Using-the-Okta-Applications-Page#Assigning).
- An entry in your Org's "Trusted Origins" for your application. To do this, follow the steps found under the "Trusted Origins tab" section in our [API Security help page](https://help.okta.com/en/prev/Content/Topics/Security/API.htm).

## Installation

Include the following script tag in your target web page:

~~~ html
<script src="https://ok1static.oktacdn.com/assets/js/sdk/okta-auth-js/1.8.0/okta-auth-js.min.js" type="text/javascript"></script>
~~~

## Part 1: Retrieve and Store an OpenID Connect Token

In this first section you will learn how to:

- [Configure your Okta Auth SDK Client](#client-configuration)
- Retrieve an ID Token using a redirect to your Okta org's sign-in page
- Parse a token from the URL that results from the redirect
- Store the parsed token inside the SDK's Token Manager
- Retrieve the stored token from the Token Manager

If you'd like to see the complete code example, you can find it [below](#complete-openid-connect-token-example).

### Client Configuration

To initialize the SDK, create a new instance of the `OktaAuth` object:

~~~ js
var authClient = new OktaAuth({
  url: 'https://{yourOktaDomain}.com', 
  clientId: '0oab4exampleR4Jbi0h7',
  redirectUri: 'http://localhost:3333' 
});
~~~

Replace each of these property values with ones from your Okta org and application. For more information about these properties, see the [Client Configuration section of the Auth SDK reference](/code/javascript/okta_auth_sdk_ref#client-configuration).

### Retrieve ID Token from Okta

To retrieve an ID Token from Okta, you will use the `token.getWithRedirect` method, specifying that you want an `id_token` included in the response:

~~~ js
authClient.token.getWithRedirect({
  responseType: 'id_token'
});
~~~

[Read more about getWithRedirect in the Auth SDK Reference](/code/javascript/okta_auth_sdk_ref#tokengetwithredirect).

### Parse the Token

After the redirect, the URL will contain an ID Token in the form of a JWT. The `token.parseFromUrl` method can be used to parse that token from the URL:

~~~ js
authClient.token.parseFromUrl()
~~~

You can also display a specific part of the parsed token:

~~~ js
console.log(`hi ${idToken.claims.email}!`);
~~~

[Read more about parseFromUrl in the Auth SDK Reference](/code/javascript/okta_auth_sdk_ref#tokenparsefromurl). 

### Store the Parsed Token

Once the token has been parsed out of the URL, you can add it to the Token Manager using the `tokenManager.add` method.

~~~ js
authClient.tokenManager.add('idToken', idToken);
~~~

[Read more about tokenManager.add in the Auth SDK Reference](/code/javascript/okta_auth_sdk_ref#tokenmanageradd)

The full code to parse the token, display the email from it, and then add it to the SDK's Token Manager looks like this:

~~~ js
authClient.token.parseFromUrl()
  .then(idToken => {
    console.log(`hi ${idToken.claims.email}!`);
    authClient.tokenManager.add('idToken', idToken);
  })
~~~

### Retrieve the Stored Token 

A token that is stored in the Token Manager can be retrieved using the `tokenManager.get` method.

~~~ js
var idToken = authClient.tokenManager.get('idToken');
~~~

[Read more about tokenManager.get in the Auth SDK Reference](/code/javascript/okta_auth_sdk_ref#tokenmanagerget)

### Complete OpenID Connect Token Example

Putting it all together, the final example looks like this:

~~~ html

<script src="https://ok1static.oktacdn.com/assets/js/sdk/okta-auth-js/1.8.0/okta-auth-js.min.js" type="text/javascript"></script>

<body>
  <script>
    // Bootstrap the AuthJS Client
    var authClient = new OktaAuth({
      // Org URL
      url: 'https://{yourOktaDomain}.com', 
      // OpenID Connect APP Client ID
      clientId: '0oab4qpkhz1UR4Jbi0h7', 
      // Trusted Origin Redirect URI
      redirectUri: 'http://localhost:3333'
    });
    // Attempt to retrieve ID Token from Token Manager
    var idToken = authClient.tokenManager.get('idToken');
    // If ID Token exists, return it in console.log
    if (idToken) {
      console.log(`hi ${idToken.claims.email}!`);
    // If ID Token isn't found, try to parse it from the current URL
    } 
    else if (location.hash) {
      authClient.token.parseFromUrl()
      .then(idToken => {
        console.log(`hi ${idToken.claims.email}!`);
        // Store parsed token in Token Manager
        authClient.tokenManager.add('idToken', idToken);
        console.log(idToken);
      });
    } 
    else {
 // You're not logged in, you need a sessionToken
      authClient.token.getWithRedirect({
        responseType: 'id_token'
      });
    }
  </script>
</body>

~~~

## Part 2: Get an Okta Session Cookie

In the code example above, the ID Token is retrieved using a redirect to the Okta sign-in page. It is also possible to take a user-inputted `username` and `password` pair and pass them to the `signIn` method. This method then initiates an authentication process which returns an [Okta session cookie](/use_cases/authentication/session_cookie#retrieving-a-session-cookie-by-visiting-a-session-redirect-link). This Okta session cookie can then be used, along with the `getWithRedirect` method, to get back the ID Token. This means that there is no need to redirect the user to the Okta sign-in page. 

[Read more about signIn in the Auth SDK Reference](/code/javascript/okta_auth_sdk_ref#signin).

~~~ js
else {
  // You're not logged in, you need a sessionToken
  var username = prompt('What is your username?');
  var password = prompt('What is your password?');
  return authClient.signIn({username, password})
  .then(res => {
    if (res.status === 'SUCCESS') {
      authClient.token.getWithRedirect({
        sessionToken: res.sessionToken,
        responseType: 'id_token'
      });
    }
  });
});
~~~

> This example, like everything else on this page, is for illustrative purposes only. The `prompt()` method is not considered a secure way of asking for user authentication credentials.

#### Complete Okta Session and OIDC Token Example 

~~~ html

<script src="https://ok1static.oktacdn.com/assets/js/sdk/okta-auth-js/1.8.0/okta-auth-js.min.js" type="text/javascript"></script>

<body>
  <script>
    // Bootstrap the AuthJS Client
    var authClient = new OktaAuth({
      // Org URL
      url: 'https://{yourOktaDomain}.com', 
      // OpenID Connect APP Client ID
      clientId: '0oab4example4Jbi0h7', 
      // Trusted Origin Redirect URI
      redirectUri: 'http://localhost:3333'
    });
    // Attempt to retrieve ID Token from Token Manager
    var idToken = authClient.tokenManager.get('idToken');
    // If ID Token exists, return it in console.log
    if (idToken) {
      console.log(`hi ${idToken.claims.email}!`);
    // If ID Token isn't found, try to parse it from the current URL
    } else if (location.hash) {
      authClient.token.parseFromUrl()
      .then(idToken => {
        console.log(`hi ${idToken.claims.email}!`);
        // Store parsed token in Token Manager
        authClient.tokenManager.add('idToken', idToken);
        console.log(idToken);
      });
    } else {
      // You're not logged in, you need a sessionToken
      var username = prompt('What is your username?');
      var password = prompt('What is your password?');
      return authClient.signIn({username, password})
      .then(res => {
        if (res.status === 'SUCCESS') {
          authClient.token.getWithRedirect({
            sessionToken: res.sessionToken,
            responseType: 'id_token'
          });
        }
      });
    }
  </script>
</body>
~~~
