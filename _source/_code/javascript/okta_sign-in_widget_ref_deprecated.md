---
layout: docs_page
title: Okta Sign-In Widget Reference
weight: 100
hide_from_layout: 1
excerpt: Reference information for customizing the Okta Sign-In Widget.

---

# Overview

This page contains detailed reference information you can use to customize your Okta sign-in widget.
Basic instructions for creating a sign-in widget are available in [Okta Sign-In Widget](./okta_sign-in_widget.html).

Prerequisites from the basic guide include:

* Use [a supported browser](https://support.okta.com/help/articles/Knowledge_Article/24532952-Platforms---Browser-and-OS-Support).
* [Create an Okta Developer Edition org](https://developer.okta.com/signup/) if you don't already have one.
* [Configure your Okta org to support CORS](/docs/api/getting_started/enabling_cors.html) before testing the Okta Sign-In Widget.

### Example of a Customized Sign-In Widget

> The Okta Sign-In Widget documentation uses the `acme.com` domain name. Other Okta developer content may use `your-domain.com`.

~~~ javascript
// Initialize
var oktaSignIn = new OktaSignIn({
  baseUrl: 'https://acme.okta.com',
  features: {
    rememberMe: true,
    smsRecovery: true,
    multiOptionalFactorEnroll: true
  },
  labels: {
    'primaryauth.title': 'Partner Sign-In',
    'help': 'Click here for more help'
  },
  transformUsername: function(username) {
    var suffix = '@acme.com';
    return (username.indexOf(suffix) !== -1) ? username : (username + suffix);
  }
});

// Render the widget if there is no active session
oktaSignIn.session.exists(function (exists) {
  if (exists) {
    // showHomePage();
    return;
  }

  // Show the sign-in widget
  oktaSignIn.renderEl(
    { el: '#okta-login-container' },
    // Success callback (invoked on successful authentication)
    function (res) {
      if (res.status === 'SUCCESS') {
        // showHomePageForUser(res.user);
      }
    },
    // Failure callback (invoked if the authentication is unsuccessful
    // or if there is a failure on authentication)
    function (err) {
      // handleErrors(err);
    }
  );
});
~~~

## Configuration Options

 Property       | Description                              |  Type    |  Required    | Default
--------------  | ---------------------------------------  | ------   | -----------  | -------
`baseUrl`       | The base URL for your Okta organization. (e.g., `https://acme.okta.com`, `https://acme.oktapreview.com` or `https://acme.okta-emea.com`).  |String    | Yes          | None
`recoveryToken` | Bootstraps the widget in the recovery flow (e.g., Unlock Account or Forgot Password). | String    | No           | None
`logo`          | Url of the logo image that shows up at the top of the widget (e.g. `https://acme.com/assets/logo/acme-logo.png`). | String    | No           | `Okta logo`
`helpSupportNumber`          | Support phone number that shows up in the Password Reset flow (if the user clicks on `Can't access email`) and in the Unlock Account flow. | String    | No           | `Okta logo`
`username`      | Bootstraps the widget with a username i.e., pre-fill the username in the widget. | String    | No           | None
`transformUsername` | Transforms the username before sending the request. The function is passed the username and the operation as parameters. [Example](#transformusername-example) | Function   | No           | None
`features`      | Options to enable or disable a feature in the widget. [Option list](#features-options) [Example](#features-example) | Object | No           | None
`helpLinks`     | Options to configure alternate help links in the widget. [Option list](#helplinks-options) [Example](#helplinks-example)   | Object | No           | None
`labels`        | Options to localize labels in the widget. [Option list](#labels-options) | Object | No           | None

### Configuration Examples and Option Details

The following sections provide examples and option details for the last four configuration options.

#### transformUsername Example

~~~ javascript
    transformUsername: function (username, op) {
      var suffix = '@acme.com';

      // op can be PRIMARY_AUTH, FORGOT_PASSWORD or UNLOCK_ACCOUNT
      if (_.contains(['FORGOT_PASSWORD', 'UNLOCK_ACCOUNT'], op)) {
        return (username.indexOf(suffix) !== -1) ? username : (username + suffix);
      }
    }
~~~

The code above ensures that in case the current user clicked on the 'Forgot Password' or 'Unlock account' link, the Sign-In Widget only proceeds with the requested operation if the user provided a username that ends with `@acme.com`. Otherwise, the Sign-In Widget automatically appends `@acme.com` to the provided user name.

#### features Example

~~~ javascript
    features: {
      rememberMe: true,
      selfServiceUnlock: true,
      multiOptionalFactorEnroll: true
    }
~~~

#### features Options

Enable or disable widget functionality with the following options for `features`:

-   `rememberMe` `(default: true)`
    Display a checkbox to enable "Remember me" functionality at login.

 -   `autoPush` `(default: false)`
    Display a checkbox to enable "Send push automatically" functionality in the MFA required flow.

-   `smsRecovery` `(default: false)`
    Allow users with a configured mobile phone number to recover their password using an SMS message.

-   `callRecovery` `(default: false)`
    Allow users with a configured mobile phone number to recover their password using a voice call.
    Note: This option is only available with version 1.6.0 and later of the Sign-In Widget.

-   `selfServiceUnlock` `(default: false)`
    Display the "Unlock Account" link to allow users to unlock their accounts.

-   `multiOptionalFactorEnroll` `(default: false)`
    Allow users the option to enroll in multiple optional factors.

-   `router` `(default: false)`
    Update the browser location bar with a route on navigation.

-   `windowsVerify` `(default: false)`
    When enrolling Okta Verify and if set to `true`, this option specifies whether the Sign-In Widget shows the Windows phone icon and instructions.


#### helpLinks Example

~~~ javascript
    helpLinks: {
      help: 'https://acme.com/custom/help',
      forgotPassword: 'https://acme.com/custom/forgotpassword',
      unlock: 'https://acme.com/custom/unlock',
      custom: [{
        text: 'Acme IT Support Page',
        href: 'https://acme.com/custom/itsupport'
      },
      {
        text: 'About Acme',
        href: 'https://acme.com/custom/about'
      }]
    }
~~~

#### helpLinks Options

Enable help links with the following options:

- `help`
   Custom link `href` for the 'Help' link.

- `forgotPassword`
   Custom link `href` for the 'Forgot Password' link.

- `unlock`
   Custom link `href` for the 'Unlock Account' link.

- `custom`
   Array of custom link objects. Each custom link object must have `text` and `href` properties.

#### labels Options

The full list of labels are in these two files:

 * [Login Properties](https://github.com/okta/okta-signin-widget/blob/master/node_modules/%40okta/i18n/dist/properties/login.properties)
 * [Country Properties](https://github.com/okta/okta-signin-widget/blob/master/node_modules/%40okta/i18n/dist/properties/country.properties)

The following labels are among the most frequently used:

- `primaryauth.title`
   Title for your widget page.

- `primaryauth.username`
   Label for the username box.

- `primaryauth.username.tooltip`
   The tooltip that appears when the user hovers over the username box.

- `primaryauth.password`
   Label for the password box.

- `primaryauth.password.tooltip`
   The tooltip that appears when the user hovers over the password box.

Some labels contain "Okta." You may want to supply a different value for those labels.

## OpenID Connect, OAuth 2.0 and Social Integrations

The Okta Sign-In Widget provides built-in support for [OpenID Connect](http://openid.net/specs/openid-connect-core-1_0.html) and [OAuth 2.0](https://tools.ietf.org/html/rfc6749), particularly with the [Implicit Flow](http://openid.net/specs/openid-connect-core-1_0.html#ImplicitFlowAuth) for single-page web applications and the [Authorization Code Flow](http://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth) for  traditional server web applications.

More information is available for Okta support of [OpenID Connect](/docs/api/resources/oidc.html#request-parameters) and [OAuth 2.0](/docs/api/resources/oauth2.html).

For OpenID Connect and OAuth setup instructions, please take a look at these [setup instructions](https://github.com/oktadeveloper/okta-oauth-spa-authjs-osw/blob/master/Okta-OIDC_SPA_JS-OSW_DevSetupGuide.pdf).

A working [OpenID Connect sample with the Okta Sign-In Widget](https://github.com/oktadeveloper/okta-oauth-spa-authjs-osw) can also be found on GitHub.

The Okta Sign-In Widget also provides support for social authentication, which is built on top of OpenID Connect and OAuth 2.0. For social authentication setup instructions, please refer to [Social Authentication](/docs/api/resources/social_authentication.html). Please see below for configuration details for social authentication.

#### Example OpenID Connect configuration

~~~ javascript
var oktaSignIn = new OktaSignIn({
  baseUrl: 'https://acme.okta.com',
  // OpenID Connect options
  clientId: 'GHtf9iJdr60A9IYrR0jw',
  redirectUri: 'https://acme.com/oauth2/callback/home',
  authParams: {
    responseType: 'id_token',
    responseMode: 'okta_post_message',
    scope: [
      'openid',
      'email',
      'profile',
      'address',
      'phone',
      'groups'
    ]
  }
  });

oktaSignIn.renderEl({
    el: '#sign-in-container'
  },
  function (res) {
    // res.idToken - id_token generated
    // res.claims - decoded id_token information
  },
  function (err) {
    // handleErrors(err);
  });
~~~



#### OpenID Connect Parameters

 Property       | Description                              |  Type    |  Required    | Default
--------------  | ---------------------------------------  | ------   | -----------  | -------
 `clientId`     | [Client Id](/docs/api/resources/oauth-clients.html#client-application-properties) pre-registered with Okta for OIDC authentication flow. | String | Yes | None
 `redirectUri`  | Callback location to send the authorization code to. This must be pre-registered as part of client registration. | String | Yes | `window.location.href`
 `oAuthTimeout` | Timeout for OIDC authentication flow requests. | Number | No | `120000`
 `authParams`   | Authentication parameters for OIDC. [List](#authParams-parameters) |See [List](#authParams-parameters) |See [List](#authParams-parameters) | See [List](#authParams-parameters)

Reminder: You can find the client ID and redirect URI for an app in the Okta Admin user interface:

1. From the top navigation bar, select **Applications** > **Applications**:
2. Select an application and choose **General**.
3. The client ID is listed in the **Client Credentials** pane; the redirect URI is listed in the **General Settings** pane.

##### authParams parameters

You can use any of the following parameters for `authParams`.

 authParams Parameter       | Description                              |  Type    |  Required    | Default   | Valid Values
--------------------------  | ---------------------------------------  | ------   | -----------  | -------   | ----------------
`display`                   | Specify how to display the authentication UI. | String  | No           | `none` (for Okta) and `popup` (External IdP such as social) | `none`, `popup`, `page`
`responseMode`              | Specify how the authorization response should be returned. | String | Yes | `okta_post_message` | `query`, `fragment`, `form_post`, `okta_post_message`
`responseType`              | Specify the response type for OpenID Connect authentication. The authorization code returned can later be exchanged for Access token or Refresh token. | String | Yes | `id_token` | `id_token`, `code` (starting from v1.7.0)
`scope`                     | Specify what information to make available in the `id_token`. `openid` is required. | Array | Yes | `['openid', 'email']` | `openid`, `email`, `profile`, `address`, `phone`, `groups` (maps to groups claim configured in the Authorization Server tab)

### Social Authentication Providers Options

Social authentication with social identity providers (such as Facebook, Linked and Google) is supported by Okta and requires OpenID Connect and OAuth configuration parameters as specified in the previous section. For Social Authentication setup instructions, please refer to [Social Authentication](/docs/api/resources/social_authentication.html).


#### Example Social Authentication configuration

~~~ javascript
var oktaSignIn = new OktaSignIn({
  baseUrl: 'https://acme.okta.com',
  // OpenID Connect options
  clientId: 'GHtf9iJdr60A9IYrR0jw',
  redirectUri: 'https://acme.com/oauth2/callback/home',
  authParams: {
    responseType: 'id_token',
    responseMode: 'okta_post_message',
    scope: [
      'openid',
      'email',
      'profile',
      'address',
      'phone'
    ]
  },
  idpDisplay: 'PRIMARY',
  idps: [{
    'type': 'GOOGLE',
    'id': '0oaaix1twko0jyKik0g4'
  }, {
    'type': 'FACEBOOK',
    'id': '0oar25ZnMM5LrpY1O0g3'
  }, {
    'type': 'LINKEDIN',
    'id': '0oaaix1twko0jyKik0g4'
  }]
});

oktaSignIn.renderEl({
    el: '#sign-in-container'
  },
  function (res) {
    // res.idToken - id_token generated
    // res.claims - decoded id_token information
  },
  function (err) {
    // handleErrors(err);
  });
~~~

#### Social Authentication Parameters

In addition to the [OpenID Connect/OAuth parameters](#openid-connect-parameters), additional parameters are necessary for social authentication:

 Property       | Description                              |  Type    |  Required    | Default
--------------  | ---------------------------------------  | ------   | -----------  | -------
 `idps`         | External Identity Providers to use in OIDC authentication. Supported Identity providers - `GOOGLE`, `FACEBOOK` and `LINKEDIN`. Each IdP needs to be passed an object with `id` and `type`. | Array | No | `[]`
 `idpDisplay`   | Display order for External Identity providers. `PRIMARY` to display external IdPs as primary, and `SECONDARY` to display Okta as the primary IdP. | String | No | `SECONDARY`

## Public functions

### Render the widget

`.renderEl()`

Render function for the sign-in widget. The function must be called with an `options` object containing any of the configuration options, a `success` callback function and a `failure` callback function.
The options object must have an `el` property, usually an HTML DOM element `id` or `selector`, which becomes the container element for the widget DOM.

#### Example
~~~ javascript
var oktaSignIn = new OktaSignIn({
  baseUrl: 'https://acme.okta.com'
});

oktaSignIn.renderEl({
    el: '#sign-in-container',
    labels: {
      'primaryauth.title': 'Partner login',
      'help': 'Click here for more help'
    },
    helpLinks: {
      'help': 'https://acme.com/custom/help'
    }
  },

  function success(res) {
    // The properties in the response object depend on two factors:
    // 1. The type of authentication flow that has just completed, determined by res.status
    // 2. What type of token the widget is returning

    // The user has started the password recovery flow, and is on the confirmation
    // screen letting them know that an email is on the way.
    if (res.status === 'FORGOT_PASSWORD_EMAIL_SENT') {
      // Any followup action you want to take
      return;
    }

    // The user has started the unlock account flow, and is on the confirmation
    // screen letting them know that an email is on the way.
    if (res.status === 'UNLOCK_ACCOUNT_EMAIL_SENT') {
      // Any followup action you want to take
      return;
    }

    // The user has successfully completed the authentication flow
    if (res.status === 'SUCCESS') {

      // If the widget is not configured for OIDC, the response will contain
      // user metadata and a sessionToken that can be converted to an Okta
      // session cookie:
      console.log(res.user);
      res.session.setCookieAndRedirect('https://acme.com/app');

      // If the widget is configured for OIDC with a single responseType, the
      // response will be the token.
      // i.e. authParams.responseType = 'id_token':
      console.log(res.claims);
      oktaSignIn.tokenManager.add('my_id_token', res);

      // If the widget is configured for OIDC with multiple responseTypes, the
      // response will be an array of tokens:
      // i.e. authParams.responseType = ['id_token', 'token']
      oktaSignIn.tokenManager.add('my_id_token', res[0]);
      oktaSignIn.tokenManager.add('my_access_token', res[1]);

      return;
    }

  },

  function error(err) {
    // The widget will handle most types of errors - for example, if the user
    // enters an invalid password or there are issues authenticating.
    //
    // This function is invoked with errors the widget cannot recover from:
    // 1. Known errors: CONFIG_ERROR, UNSUPPORTED_BROWSER_ERROR, OAUTH_ERROR
    // 2. Uncaught exceptions
    alert(err.message);
  });
~~~

##### Parameters

Name                  |   Type    |   Required    | Description
--------------------- | --------  | ------------  | -----------
options               | Object    | Yes           | Configuration options for the widget. `el` is required.
successCallback       | Function  | Yes           | Success callback to invoke on successful authentication.
failureCallback       | Function  | Yes           | Failure callback to invoke on unsuccessful authentication.

## Session Management

Manage your Okta session with session functions in the Sign-in widget SDK.

### Check for an existing session

`.session.exists()`

Check if there is an active session.

##### Example
~~~ javascript
oktaSignIn.session.exists(function (exists) {
  if (exists) {
    // There is an active session
  } else {
    // No active session found
  }
});
~~~

##### Parameters

Name                  |   Type    |   Required    | Description
--------------------- | --------  | ------------  | -----------
callback              | Function  | Yes           | Callback function. The function is passed a boolean value.

### Get the current session

`.session.get()`

Get the active session information.

##### Example
~~~ javascript
oktaSignIn.session.get(function (res) {
  if (res.status !== 'INACTIVE') {
    /**
     * res.status - 'ACTIVE'
     * res.session - session object
     * res.user - user object
     */
  } else {
    // There is no active session. Show the login flow.
    oktaSignIn.renderEl(options, successFn, errorFn);
  }
});
~~~

##### Parameters

Name                  |   Type    |   Required    | Description
--------------------- | --------  | ------------  | -----------
callback              | Function  | Yes           | Callback function. The function is passed an object with status, session, user information if there is an active session and `{status: 'INACTIVE'}` if there is none.

### Refresh the current session

`.session.refresh()`

Refresh the current session by extending its lifetime. This can be used as a keep-alive operation.

##### Example
~~~ javascript
oktaSignIn.session.refresh(function (res) {
  if (res.status === 'INACTIVE') {
    // There is no active session to refresh
  } else {
    // The session now has an extended lifetime

    /**
     * res.status - 'ACTIVE'
     * res.session - session object
     * res.user - user object
     */
  }
});
~~~

##### Parameters

Name                  |   Type    |   Required    | Description
--------------------- | --------  | ------------  | -----------
callback              | Function  | Yes           | Callback function. The function is passed an object with status, session, user information if there is an active session and `{status: 'INACTIVE'}` if there is none.

### Close the current session

`.session.close()`

Close the active session. Same as `.signOut()`

##### Example
~~~ javascript
oktaSignIn.session.close(function () {
  // User is now logged out
});
~~~

##### Parameters

Name                  |   Type    |   Required    | Description
--------------------- | --------  | ------------  | -----------
callback              | Function  | Yes           | Callback function to invoke after closing the session. The function is invoked with an error message if the operation was not successful.

### Sign out the user

`.signOut()`

Sign-out the current signed-in user. Shorthand for `.session.close()`

##### Example
~~~ javascript
oktaSignIn.signOut(function () {
  // User is now logged out
});
~~~

##### Parameters

Name                  |   Type    |   Required    | Description
--------------------- | --------  | ------------  | -----------
callback              | Function  | Yes           | Callback function to invoke after signing out the user. The function is invoked with an error message if the operation was not successful.

## Token Management

Manage your OpenID Connect ID token with the Sign-in Widget SDK.

### Renew an ID token

`.idToken.refresh()`

Renews the `id_token` by requesting a new one from Okta (and thus extending its default lifetime of one hour).

##### Example
~~~ javascript
oktaSignIn.idToken.refresh(token, function (newToken) {
  // New id_token with extended lifetime
});
~~~

##### Parameters

Name                  |   Type    |   Required    | Description
--------------------- | --------  | ------------  | -----------
token                 | String    | Yes           | `id_token` to refresh
callback              | Function  | Yes           | Callback function. The function is passed a new `id_token` if the operation was successful and an error message if it was not.
options               | Object    | No            | OIDC options
