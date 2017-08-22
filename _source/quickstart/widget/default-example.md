---
layout: quickstart_partial
libraryName: Sign-In Widget
---

This guide will walk you through integrating the [Okta Sign-In Widget](https://github.com/okta/okta-signin-widget) into an app by performing these steps:

1. Add an OpenID Connect Client in Okta
2. Add Sign-In Widget assets to your project
3. Implement Okta Sign-In
4. Handle the Authorization Code Flow

At the end of the Sign-In Widget instructions you can choose your server type to learn more about post-authentication workflows, such as exchanging the `authorization code` for tokens that your server can use to communicate with other servers.

## Prerequisites
If you do not already have a **Developer Edition Account**, you can create one at [https://developer.okta.com/signup/](https://developer.okta.com/signup/).

## Add an OpenID Connect Client
* Log into the Okta Developer Dashboard, and **Create New App**
* Choose **Single Page App (SPA)** as the platform, then populate your new OpenID Connect application with values similar to:

| Setting             | Value                                                 |
| ------------------- | ----------------------------------------------------- |
| Application Name    | My Web App                                            |
| Base URIs           | http://localhost:{port}                               |
| Login redirect URIs | http://localhost:{port}/callback                      |
| Grant Types Allowed | Implicit                                              |

After you have created the application there are two more values you will need to gather:

| Setting       | Where to Find                                                                  |
| ------------- | ------------------------------------------------------------------------------ |
| Client ID     | In the applications list, or on the "General" tab of a specific application.    |
| Org URL       | On the home screen of the developer dashboard, in the upper right.             |


These values will be used in your application to setup the OIDC flow with Okta.

## Add Sign-In Widget assets to your project

The easiest way to get started with the [Okta Sign-In Widget](https://github.com/okta/okta-signin-widget) is to load the JS and CSS files directly from the CDN.

To use the CDN, include the following links to your HTML:
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

> The `okta-sign-in.min.js` file will expose a global `OktaSignIn` object that can bootstrap the widget.

## Implement Okta Sign-In

The widget is rendered directly to the DOM by a unique `id` attribute value. Your application can control the widget by first rendering the widget, and handling user success/errors accordingly:

First, create a `<div>` inside of your HTML file:

```html
<body>
    <div id="okta-login-container"></div>
    ...
</body>
```

Next, create a `script` to configure the widget based on to your organization:
```html
<script type="text/javascript">

    var oktaSignIn = new OktaSignIn({
        baseUrl: "https://{yourOktaDomain}.com",
        clientId: "{clientId}",
        authParams: {
            issuer: "https://{yourOktaDomain}.com/oauth2/default",
            responseType: 'token id_token',
            responseMode: 'query',
            scopes: ['openid', 'profile', 'email']
        }
        });
        oktaSignIn.renderEl(
            { el: '#okta-login-container' },
            function (res) {
                if (res.status !== 'SUCCESS') {
                   return;
                }
                // Store the tokens in the TokenManager in the order requestsed
                oktaSignIn.tokenManager.add('accessToken', res[0])
                oktaSignIn.tokenManager.add('idToken', res[1])
                
                return;
            }
        );
</script>
```

### Using the Access Token

Your application now has an access token in local storage that was issued by your Okta Authorization server.  You can read this token and present it to your own server to authenticate requests for resources on your server.  As a hypothetical example, let's say that you have an API that gives us messages for our user.  You could create a `callMessagesApi` function that requires authentication, retrieves the access token from local storage, and attach it to our resource request.

Please continue down to the next section, Server Setup, to learn about access token validation on the server.  Here is what the function could look like for this hypothetical example:

```javascript
function callMessagesApi() {
    const accessToken = oktaSignIn.tokenManager.get("accessToken");
    
    if (!accessToken) {
        return;
    }

    // Make the request using jQuery
    $.ajax({
        url: '/api/messages',
        headers: {
        Authorization : 'Bearer ' + accessToken
        },
        success: function(response) {
        // Received messages!
        },
    });
    }
}
```