---
layout: quickstart_partial
libraryName: Sign-In Widget
---

This guide will walk you through integrating the [Okta Sign-In Widget](https://github.com/okta/okta-signin-widget) into a front-end application by performing these steps:

1. Add an OpenID Connect Client in Okta
2. Add Sign-In Widget assets to your project
3. Implement Okta Sign-In
4. Using the Access Token

At the end of this section can choose your server type to learn more about post-authentication workflows, such as using the access tokens (obtained by the Sign-in Widget) to authenticate requests to your server.

## Prerequisites
If you do not already have a **Developer Edition Account**, you can create one at [https://developer.okta.com/signup/](https://developer.okta.com/signup/).

> Note: The rest of these instructions assume you are using the new Developer Dashboard.  If you already have an Okta Org, you can find the new Developer Dashboard by using the drop-down menu in the upper-left of the current Okta Admin Console.

## Add an OpenID Connect Client
* Log into the Okta Developer Dashboard, click **Applications** then **Add Application**.
* Choose **Single Page App (SPA)** as the platform, then populate your new OpenID Connect application with these default values:

| Setting             | Value                                                 |
| ------------------- | ----------------------------------------------------- |
| Application Name    | My Web App                                            |
| Base URIs           | http://localhost:{port}                               |
| Login redirect URIs | http://localhost:{port}/implicit/callback             |
| Grant Types Allowed | Implicit                                              |

After you have created the application there are two more values you will need to gather:

| Setting       | Where to Find                                                                  |
| ------------- | ------------------------------------------------------------------------------ |
| Client ID     | In the applications list, or on the "General" tab of a specific application.    |
| Org URL       | On the home screen of the developer dashboard, in the upper right.             |


These values will be used in your application to setup the OpenID Connect flow with Okta.

## Add Sign-In Widget assets to your project

The easiest way to get started with the [Okta Sign-In Widget](https://github.com/okta/okta-signin-widget) is to load the JS and CSS files directly from the CDN.

To use our CDN, include the following links to your HTML:
```html
<script
src="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/2.1.0/js/okta-sign-in.min.js"
type="text/javascript"></script>
<link
href="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/2.1.0/css/okta-sign-in.min.css"
type="text/css"
rel="stylesheet"/>
<link
href="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/2.1.0/css/okta-theme.css"
type="text/css"
rel="stylesheet"/>
```

<i class="fa fa-files-o" aria-hidden="true"></i>

> The `okta-sign-in.min.js` file will expose a global `OktaSignIn` object that can bootstrap the widget.

## Configure the Sign-In Widget

You can render the widget anywhere on the page by creating a `<div>` with a unique `id`.  You can also control the visual look of the widget by adding your own CSS.

First, create a `<div>` inside of your HTML file:

```html
<body>
    <div id="okta-login-container"></div>
    ...
</body>
```

Next, add the following JavaScript to configure the Sign-In Widget.  There are many ways to configure the Sign-In Widget, and the following code will instruct the widget to do the following:

* Authenticate the user.
* Redirect to Okta to create an SSO session.
* Redirect the user back to your application.
* Get an access token and ID Token that we can use later.

Copy this example code into your front-end application:

```html
<script type="text/javascript">
  var oktaSignIn = new OktaSignIn({
    baseUrl: "https://{yourOktaDomain}",
    clientId: "{yourClientId}",
    authParams: {
      issuer: "https://{yourOktaDomain}/oauth2/default",
      responseType: ['token', 'id_token'],
      display: 'page'
    }
  });

  if (oktaSignIn.token.hasTokensInUrl()) {
    oktaSignIn.token.parseTokensFromUrl(
      function success(res) {
        // Store the tokens in the token manager in the order requested
        oktaSignIn.tokenManager.add('accessToken', res[0]);
        oktaSignIn.tokenManager.add('idToken', res[1]);
      },
      function error(err) {
        // handle errors as needed
        console.error(err);
      }
    );
  } else {

    oktaSignIn.session.get(function (res) {
      // Session exists, show logged in state.
      if (res.status === 'ACTIVE') {
        console.log('Hello, ' + res.login);
        return;
      }

      oktaSignIn.renderEl(
        { el: '#okta-login-container' },
        function success(res) {
          // Nothing to do here, the widget will automatically redirect
          // the user to Okta for session creation
        },
        function error(err) {
          // handle errors as needed
          console.error(err);
        }
      );
    });
  }
</script>
```

### Authenticate (Sign In)

With the above code in your front-end application, you should see the Sign In Widget when you load your application.  At this point you should be able to login, and be redirected back to your application with an access token and ID Token.  Once this is working you can move on to the next section, where we will make use of the access token to make an authenticated request against your server.


### Using the Access Token

Your application now has an access token in local storage that was issued by your Okta Authorization server. You can use this token to authenticate requests for resources on your server or API. As a hypothetical example, let's say that you have an API that gives us messages for our user.  You could create a `callMessagesApi` function that gets the access token from local storage, and use it to make an authenticated request to your server.

Please continue down to the next section, Server Setup, to learn about access token validation on the server.  Here is what the front-end code could look like for this hypothetical example:

```javascript
function callMessagesApi() {
  var accessToken = oktaSignIn.tokenManager.get("accessToken");

  if (!accessToken) {
    return;
  }

  // Make the request using jQuery
  $.ajax({
    url: 'http://localhost:{serverPort}/api/messages',
    headers: {
      Authorization : 'Bearer ' + accessToken.accessToken
    },
    success: function(response) {
      // Received messages!
      console.log('Messages', response);
    },
    error: function(response) {
      console.error(response);
    }
  });
}
```