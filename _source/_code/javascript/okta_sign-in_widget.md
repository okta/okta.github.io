---
layout: software
title: Okta Sign-In Widget Guide
language: JavaScript
excerpt: A drop-in widget with custom UI capabilities to power sign-in with Okta.
weight: 1
redirect_from:
    - "/docs/guides/okta_sign-in_widget.html"
---

# Okta Sign-In Widget Guide

The Okta Sign-In Widget is a JavaScript library that gives you a fully-featured and customizable login experience which can be used to authenticate users on any website.

This guide will walk you through a few common use cases for the Widget and how to implement them. The full Widget reference can be found [on GitHub](https://github.com/okta/okta-signin-widget#okta-sign-in-widget).

{% img okta-signin.png alt:"Screenshot of basic Okta Sign-In Widget" %}{: .center-image }


## Installation

The first step is to install the Widget. For this, you have two options: local installation via NPM, or linking out to the Okta CDN instead.

#### npm

```
# Run this command in your project root folder.
npm install @okta/okta-signin-widget --save
```

More info, including the latest published version, can be found in the [Widget Documentation](https://github.com/okta/okta-signin-widget#using-the-npm-module).

#### CDN

To use the CDN, include this in your HTML:

~~~html
<!-- Latest CDN production Javascript and CSS: {{ site.versions.okta_signin_widget }} -->
<script
  src="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/2.6.0/js/okta-sign-in.min.js"
  type="text/javascript"></script>
<link
  href="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/2.6.0/css/okta-sign-in.min.css"
  type="text/css"
  rel="stylesheet"/>

<!-- Theme file: Customize or replace this file if you want to override our default styles -->
<link
  href="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/2.6.0/css/okta-theme.css"
  type="text/css"
  rel="stylesheet"/>
~~~

More info, including the latest published version, can be found in the [Widget Documentation](https://github.com/okta/okta-signin-widget#using-the-okta-cdn).

### Bundling the Widget

If you choose to bundle your assets, the import statements may have a different format. For example, using [webpack](https://webpack.js.org/):

> Ensure you have the [`css-loader`](https://github.com/webpack-contrib/css-loader) enabled.

~~~javascript
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import '@okta/okta-signin-widget/dist/css/okta-theme.css';
~~~

### Enabling Cross-Origin Access

After you have installed the Widget, you need to enable Cross Origin Access (CORS) by adding your application's URL to your Okta org's Trusted Origins. More information about this can be found on the [Enabling CORS](/docs/api/getting_started/enabling_cors#granting-cross-origin-access-to-websites) page.

## Usage

Once you have installed the widget and enabled CORS, you can start using the Widget.

### Initializing the Widget

The code that initializes the Widget looks like this:

~~~javascript
var signIn = new OktaSignIn({baseUrl: 'https://{yourOktaDomain}.okta.com'});
signIn.renderEl({
  el: '#element'
}, function success(res) {
  if (res.status === 'SUCCESS') {
    console.log('Do something with this sessionToken', res.session.token);
  }
}, function error(err) {
  console.log('Handle error:', err);
})
~~~

#### Mobile Consideration

To ensure that the Widget renders properly on mobile, include the `viewport` metatag in your `head`:

~~~html
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
~~~

### Use Cases

The Widget can handle a number of different authentication scenarios. Here are a few common cases.

#### Get an Okta Session Token to Sign In to Okta

In this case, you would like to use the Widget to sign in to the Okta chiclet page. This requires taking the Widget initialization code, and modifying the success behavior.

~~~javascript
function success(res) {
  if (res.status === 'SUCCESS') {
    res.session.setCookieAndRedirect('https://{yourOktaDomain}.okta.com/app/UserHome');
  }
}
~~~

Replace `https://{yourOktaDomain}.okta.com/app/UserHome` with your own User Home landing page.

If you'd like to sign the user directly into an application within Okta, you just redirect to the specific URL for that application. To find that URL, go to that application's page in your Okta org and find [the embed link](https://support.okta.com/help/Documentation/Knowledge_Article/The-Applications-Page-1093995619#Show).


##### ID token for a Custom SSO Portal

It is also possible to use the Widget to retrieve an ID token for your user, and to then use that ID token to sign into a custom portal that you have created.

In this scenario, you are using your Okta org's authorization server to mint the ID token. You will need to have an OIDC application configured in your Okta org.

~~~javascript
var signIn = new OktaSignIn({
  baseUrl: 'https://{yourOktaDomain}.okta.com',
  clientId: '${myClientId}',
  redirectUri: '${redirectUri configured in OIDC app}',
  authParams: {
    responseType: 'id_token',
    display: 'page'
  }
});

if (!signIn.token.hasTokensInUrl()) {
  signIn.renderEl({el: '#osw-container'});
}

else {
  signIn.token.parseTokensFromUrl(
    function success(idToken) {
      // get claims from id_token
      console.log('id_token claims', idToken.claims);
    },
    function error(err) {
      console.log('handle error', err);
    }
  );
}
~~~

Your application will then need to parse the ID token that is passed by Okta.

#### ID Token for Your Application

If you'd like to use the Widget to log users into your own application instead of Okta, you will have to set-up a custom Authorization Server in Okta.

After that, you will need to decide whether to use the Implicit or the Code flow. We recommend the Implicit flow for Single-Page Applications (SPAs) and the Authorization Code flow for server-side applications.

##### Implicit Flow

The Implicit flow does not require a server-side component, and simply involves prompting the user to sign in and then extracting the ID token.

~~~javascript
var signIn = new OktaSignIn({
  baseUrl: 'https://{yourOktaDomain}.okta.com/oauth/default/v1', // The only difference between this and SSO
  clientId: '${myClientId}',
  redirectUri: '${redirectUri configured in OIDC app}',
  authParams: {
    responseType: 'token',
    display: 'page'
  }
});

if (!signIn.token.hasTokensInUrl()) {
  signIn.renderEl({el: '#osw-container'});
}

else {
  signIn.token.parseTokensFromUrl(
    function success(res) {
      // Add the token to tokenManager to automatically renew the token when needed
      signIn.tokenManager.add('accessToken', res);
    },
    function error(err) {
      console.log('handle error', err);
    }
  );
}
~~~

Here is an example of some front-end code that could handle this token after redirect:

~~~javascript
function callMessagesApi() {
  var accessToken = oktaSignIn.tokenManager.get('accessToken');

  if (!accessToken) {
    return;
  }

  // Make the request using jQuery
  $.ajax({
    url: 'http://localhost:{serverPort}/api/messages',
    headers: {
      Authorization: 'Bearer ' + accessToken.accessToken
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
~~~

### Handling Errors

The Widget render function either results in a success or error. The error function is called when the widget has been initialized with invalid config options, or has entered a state it cannot recover from.

The Widget is designed to internally handle any user and API errors. This means that the custom error handler should primarily be used for debugging any configuration errors.

There are three kinds of errors that aren't handled by the Widget, and so can be handled by custom code:

- ConfigError
- UnsupportedBrowserError
- OAuthError

Here is an example of an error handler that adds an error message to the top of the page:

~~~javascript
function error(err) {
  var errorEl = document.createElement('div');
  errorEl.innerHTML = 'Error! ' + err.message;
  document.body.insertBefore(
    errorEl,
    document.body.firstChild
  );
}
~~~

## Customization

The Okta Sign-In Widget is fully customizable via CSS and JavaScript.

### Initial Login Screen

You can modify the look of the initial login screen using parameters in the `config` section of the main Widget initialization block.

{% img widget_theming.png alt:"Screenshot of basic Okta Sign-In Widget" %}{: .center-image }

**Logo**

~~~javascript
var config = {
  ...
  logo: '/path/to/logo.png',
...
};

var signIn = new OktaSignIn(config);
~~~

**Custom Buttons**

You can add buttons below the "Sign In" button.

~~~javascript
var config = {
  ...
  customButtons: [
    {
      title: 'Click Me 1',
      className: 'btn-customAuth',
      click: function() {
          // clicking on the button navigates to another page
          window.location.href = 'http://www.example1.com';
        }
    },
    {
      title: 'Click Me 2',
      className: 'btn-customAuth',
      click: function() {
          // clicking on the button navigates to another page
          window.location.href = 'http://www.example2.com';
      }
    }
  ];
};
~~~

**Links**

You can also change the "Help", "Forgot Password", and "Unlock" links, including both their text and URLs.

~~~javascript
var config = {
    ...
  helpLinks: {
    help: 'https://acme.com/help',
    forgotPassword: 'https://acme.com/forgot-password',
    unlock: 'https://acme.com/unlock-account',
    custom: [
      {
        text: 'What is Okta?',
        href: 'https://acme.com/what-is-okta'
      },
      {
        text: 'Acme Portal',
        href: 'https://acme.com'
      }
    ]
  }
};
~~~

#### Modifying CSS

In addition to the parameters in the Widget's `config`, you can also modify the CSS.

**Modify the existing theme**

If you want to add on top of the Okta theme, just edit [okta-theme.scss](https://github.com/okta/okta-signin-widget/blob/master/assets/sass/okta-theme.scss) and add any CSS to the bottom of the file.
If you want to add on top of the base theme, edit [okta-sign-in.scss](https://github.com/okta/okta-signin-widget/blob/master/assets/sass/okta-sign-in.scss) and add any CSS to the bottom of the file.

**Create a new theme**

If you'd like to create an entirely new theme:

1. Add a new SCSS file to [assets/sass](https://github.com/okta/okta-signin-widget/tree/master/assets/sass) folder.

2. If your SCSS file is called, for example, `custom-theme.scss`, add

`<link href="css/custom-theme.css" type="text/css" rel="stylesheet"/>`

as the last CSS to [index.tpl](https://github.com/okta/okta-signin-widget/blob/master/buildtools/templates/index.tpl).

3. Finally, modify all occurrences of `okta-theme` to `custom-theme` in [Gruntfile.js](https://github.com/okta/okta-signin-widget/blob/master/Gruntfile.js).

##### CSS customization examples

**Background**

~~~css
#okta-sign-in.auth-container.main-container {
   background-color: red;
}

#okta-sign-in .beacon-blank {
   background-color: red;
}
~~~

**Border color**

~~~css
#okta-sign-in.auth-container.main-container {
 	border-color: red;
}

#okta-sign-in.auth-container .okta-sign-in-header {
border-bottom-color: red;
}
~~~

**Text color**

All text:

~~~css
#okta-sign-in {
	color: red;
}
~~~

"Sign In" text:

~~~css
#okta-sign-in .o-form-head {
	color: red;
}
~~~

Link text:

~~~css
#okta-sign-in a:link {
	color: red;
}
~~~

**Widget positioning + width**

Width:

~~~css
#okta-sign-in {
	width: 600px;
}
~~~

Position:

~~~css
#okta-sign-in {
  margin: 100px auto 8px;
}
~~~


### Modifying Strings

To modify strings in the widget, you can override any of the properties set in [login.properties](https://github.com/okta/okta-signin-widget/blob/master/packages/@okta/i18n/dist/properties/login.properties). You override these properties by specifying new values for them inside an `i18n` object in the Widget's `config` section.

#### Examples

You can modify any of the labels found in the Widget by providing new values for them.

~~~javascript
var oktaSignIn = new OktaSignIn({
...
  i18n: {
      en: {
        // Labels
        'primaryauth.title': 'Acme Partner Login',
        'primaryauth.username': 'Partner ID',
        'primaryauth.username.tooltip': 'Enter your @ partner.com ID',
        'primaryauth.password': 'Password',
        'primaryauth.password.tooltip': 'Super secret password',
        // Errors
        'error.username.required': 'Please enter a username',
        'error.password.required': 'Please enter a password',
        'errors.E0000004': 'Sign in failed!'
      }
  }
});
~~~

For more information about these configuration options, see the [Okta Sign-In Widget Reference page][https://github.com/okta/okta-signin-widget#okta-sign-in-widget].

#### Internationalization

If you'd like to display different strings depending on the user's language, you can specify this using the following structure:

```javascript
lang: {
  'key': 'value'
}
```

- `lang`: one of the [i18n country abbreviations](https://github.com/okta/okta-signin-widget/blob/master/packages/@okta/i18n/dist/properties/country.properties)
- `key`: a string specified in [login.properties](https://github.com/okta/okta-signin-widget/blob/master/packages/@okta/i18n/dist/properties/login.properties)
- `value`: A new value for that string

**Example**

~~~javascript
var config = {
  baseUrl: 'https://{yourOktaDomain}.okta.com',
...
  i18n: {
    en: {
      'primaryauth.title': 'Sign in to Acme'
    },
    es: {
      'primaryauth.title': 'Ingresar a Acme'
    },
    cn: {
      'primaryauth.title': '登錄入 Acme'
    }
  },
...
};
~~~
