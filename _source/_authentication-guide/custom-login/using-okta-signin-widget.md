---
layout: docs_page
title: Using the Okta Sign-In Widget
excerpt: How to customize login with the Okta Sign-In Widget
---

# Using the Okta Sign-In Widget

## Overview

The Okta Sign-In Widget is a JavaScript library that gives
you a fully-featured and customizable login experience which
can be used to authenticate users on any website. This guide will introduce you to the Widget and show you how to create a simple page that uses it. 

{% img okta-signin.png alt:"Screenshot of basic Okta Sign-In Widget" %}

If you'd like to jump right into the Widget's code, you can find it on GitHub here: <https://github.com/okta/okta-signin-widget>.

If you'd like to read the Widget's reference page, you will find it here: [Okta Sign-In Widget Reference Page](/code/javascript/okta_sign-in_widget_ref).

### Features

The Sign-in Widget supports the following use cases:

- **Authentication:** In addition to standard credential validation, the Okta Sign-In Widget also handles validation of password complexity requirements and will display common error messages for things like invalid passwords or blank fields.

- **Multi-Factor Authentication:** The Widget also handles enrollment and verification of multiple authentication factors. It comes with built-in support for SMS authentication, security questions, and Google Authenticator, among others.

- **Self-Service Password Reset:** Support for sending reset notifications as well as prompting users to verify themselves by prompting them to answer a security question. 

- **Password Expiration:** The Widget can notify users when their password has expired and prompt them to update their password before allowing them to sign in.

- **Validation and Error Handling:** Extensive support for validating user input as well as handling every imaginable error condition which might occur in a user login flow.

## Try the Widget for yourself

If you want to see the Sign-in Widget in action for yourself, you will need three things before you start:

- An Okta Developer org, which you can sign-up for here: <https://developer.okta.com/signup/>
- A client Application in Okta: for more information, you can read about [the OpenID Connect Application Wizard](https://help.okta.com/en/prev/Content/Topics/Apps/Apps_App_Integration_Wizard.htm)
- At least one [User assigned to it](https://support.okta.com/help/Documentation/Knowledge_Article/27418177-Using-the-Okta-Applications-Page#Assigning)

Once you have these prerequisites, getting the Sign-in Widget working has four steps:

1.  Create an HTML file with the widget code
2.  Modify the HTML to use your Okta organization
3.  Serve the HTML file with a web server
4.  Configure a Trusted Origin in your Okta organization

#### 1. Create an HTML file

The below code will render a login page using the Okta Sign-in Widget. You can copy and paste it into an HTML file called, for example, `login-to-okta.html`:

~~~ html
<!doctype html>
<html lang="en-us">
<head>

  <title>Example Okta Sign-In Widget</title>

  <!-- Core widget js and css -->

  <script src="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.13.0/js/okta-sign-in.min.js" type="text/javascript"></script>
  <link href="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.13.0/css/okta-sign-in.min.css" type="text/css" rel="stylesheet">
  <!-- Optional, customizable css theme options. Link your own customized copy of this file or override styles in-line -->
  <link href="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.13.0/css/okta-theme.css" type="text/css" rel="stylesheet">
</head>
<body>
  <!-- Render the login widget here -->
  <div id="okta-login-container"></div>

  <!-- Script to init the widget -->
  <script>
    var orgUrl = 'https://{yourOktaDomain}.com';
    var oktaSignIn = new OktaSignIn({baseUrl: orgUrl});

    oktaSignIn.renderEl(
      { el: '#okta-login-container' },
      function (res) {
        if (res.status === 'SUCCESS') { res.session.setCookieAndRedirect(orgUrl); }
      }
    );
  </script>
</body>
</html>
~~~

#### 2. Modify the HTML

Change the `orgUrl` variable to your Okta org's URL (for example: `https://{yourOktaDomain}.com`), then save the file.

#### 3. Serve the File

If you aren’t sure which web server to use or don’t have one set up already, an easy web server to set up on Mac OS X or GNU/Linux is the SimpleHTTPServer that is included with Python.

If you have Python 2 installed on your system, you can start the SimpleHTTPServer by running the following command from the same directory that the `login-to-okta.html` file is located in:

~~~
$ python -m SimpleHTTPServer
~~~

In Python 3 this command is:

~~~
python3 -m http.server
~~~

#### 4. Configure a Trusted Origin

This step is necessary for Okta to accept authentication requests from an application through the Sign-In Widget.

You can enable your Sign-in Widget page as a "Trusted Origin" in Okta, which enables Cross-Origin Resource Sharing (CORS). To do this, follow the steps found under **API** > **Trusted Origins**. Configure your Origin using the same base URL as the web server you are using to host the HTML for the Okta Sign-In Widget. For example, if you're serving the page using the Python SimpleHTTPServer, the origin would be `http://0.0.0.0:8000`.

If you now open the page with the Widget code on it, you can enter in the credentials for a user in your Okta org and you will be logged in. And that's it!

## Adding a Redirect

In the simple example above, you already performed the following steps:

1.  Created an HTML file with the widget code
2.  Modified the HTML to use your Okta organization
3.  Served the HTML file with a web server
4.  Configured a Trusted Origin in your Okta organization

In that example, you redirect the user to their Okta dashboard (as defined in the `orgUrl` variable). Now you will configure a redirect to a custom authentication landing page hosted on your server. 

To do this, you will now perform the following steps:

1. Create a landing page
2. Add a redirect URL variable to the widget
3. Update the post-authentication behavior of the widget
4. Configure redirects in your Okta organization

#### Create the landing page

The first step will be to create the landing page that the user will be redirected to after authentication. For this example, you should create the file in the same directory as your existing sign-in page, and name it something like `signed-in.html`. You can add any content you might like to your landing page.

#### Add a Redirect URL

There are just two lines you will need to modify in your widget code to get the sample working in your own environment. Under the line where you specify the fully-qualified domain name for your Okta org, add the following line:

~~~ javascript
  var redirectUrl = 'http://localhost:3333/signed-in.html';
~~~

Replace `http://localhost:3333/signed-in.html` in the `redirectUrl` variable with the URL of the landing page in your own web application where you would like to redirect the user after a successful login.

#### Update the post-authentication behavior

The other change you should make to your widget code is to change the success behavior, found on this line:

~~~ javascript
  if (res.status === 'SUCCESS') { res.session.setCookieAndRedirect(orgUrl); }
~~~

Replacing `orgUrl` with `redirectUrl` will send the user to our new landing page.

The updated section of your sign-in widget will now look something like this:

~~~ html
<script>
  var orgUrl = 'https://{yourOktaDomain}.com';
  var redirectUrl = 'http://localhost:3333/signed-in.html';
  var oktaSignIn = new OktaSignIn({baseUrl: orgUrl});

  oktaSignIn.renderEl(
    { el: '#okta-login-container' },
    function (res) {
      if (res.status === 'SUCCESS') { res.session.setCookieAndRedirect(redirectUrl); }
    }
  );
</script>
~~~

Once you are done, save the updated file.

#### Configure redirects

To allow redirects, go back to the Trusted Origins section where you allowed CORS and edit the Origin that you entered. In addition to enabling CORS, also enable Redirect. If you need any help doing this, you can refer to [the Security API help page](https://help.okta.com/en/prev/Content/Topics/Security/API.htm?cshid=Security_API#Security_API).

### Testing the Okta Sign-In Widget

At this point, you are ready to test the Okta Sign-In Widget.

Test the Widget by starting up your web server again, then loading the URL for the Widget file in your favorite web browser.

Once you've successfully loaded the Okta Sign-In Widget, it is time to start exploring the capabilities of the widget.

Here are two things for you to try:

1.  Log in using credentials that you know are invalid.
    For example: Try using "invalid@example.com" as the username and "invalid" as the password. You should see an error.
2.  Try using a valid username and password. If everything works, you will be redirected to `signed-in.html`.

If you are redirected when you sign in successfully, then it works! Your next step is to configure the Okta Sign-In Widget for your specific requirements. For example, you can [configure Multi-factor Authentication](https://help.okta.com/en/prod/Content/Topics/Security/MFA.htm) for your Okta org and try logging in using the Okta Sign-In Widget.


## Customization

In the example above, you set up a very basic version of
the Okta Sign-In Widget. Now that you've seen it in action, it's time to
start configuring the widget for your specific needs.

The Okta Sign-In Widget is fully customizable via CSS and JavaScript.
Change how the widget looks with CSS, and change how the widget works, including modifying text labels, with JavaScript.

The sections below go into detail on how to customize
the Okta Sign-In Widget using CSS and JavaScript.

### Customizing style with CSS

You will need to write CSS style overloads to customize the "look
and feel" of the Okta Sign-In Widget.

Before you get started, it is useful to know how the widget works.
Most important is understanding how the widget is created. The
Okta Sign-In Widget is created when the `renderEl()` JavaScript
method is called. When the `renderEl()` method is called, the
Okta Sign-In Widget will be created as a `<div>` tag with an
`id` of `okta-sign-in` which will be inserted inside of the tag that
you specified in the `el` option of the `renderEl` method.

Here is what the opening tag for the Okta Sign-In Widget looks like:

    <div id="okta-sign-in" class="auth-container main-container no-beacon">

Customization of the HTML *surrounding* the Okta Sign-In Widget
is up to you. Customization of the widget itself will be done on
the `#okta-login-container` selector and its child elements.

A full list of the CSS selectors that you can use to style the
Okta Sign-In Widget are in the [okta-theme.css](https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.13.0/css/okta-theme.css) file. We strongly
urge you to style your widget using only the selectors that are
present in the [okta-theme.css](https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.13.0/css/okta-theme.css) file as other stylistic elements in the widget may be subject to change and may cause your styling to break in
future versions of the Okta Sign-In Widget.

#### Example CSS styling for the Okta Sign-In Widget

Below is an in-line CSS example, which gives you an idea of how you
can style the Okta Sign-In Widget. Try the following style below
by copying the `<style>` tag below into the `<head>` section of
the `login-to-okta.html` file that you created above. It will change the background image for the sign-in page, as well as the color of the "Sign In" button.

~~~ html
<style>
    body {
      background-image: url('https://farm9.staticflickr.com/8332/8451032652_b2bf0bdadc_h.jpg');
      background-repeat: no-repeat;
      background-position: center center fixed;
      -webkit-background-size: cover;
      -moz-background-size: cover;
      -o-background-size: cover;
      background-size: cover;
    }

    #okta-login-container .button {
      color: #ffffff;
      background-color: #3a3f44;
      border-color: #3a3f44;
      background-image: linear-gradient(#484e55, #3a3f44 60%, #313539);
      background-repeat: no-repeat;
      filter: none;
    }
</style>
~~~

#### Advice for hosting your own CSS

While the example above demonstrates how to use an in-page style
tag, we strongly encourage you to create your own style sheet by
copying the `okta-theme.css` file onto your own website, and
update that file as needed. Here is what that might look like in
your HTML:

    <link href="https://your-website.example.com/static/css/custom-okta-theme.css" type="text/css" rel="stylesheet">

### Customizing widget features and text labels with JavaScript

The configuration options that are passed to the `OktaSignIn()`
constructor are used to configure the functionality and text labels
of the Okta Sign-In Widget. An example of how to configure
`OktaSignIn()` is below. If you'd like to see the full list of configuration options, see the [Sign-in Widget Reference page](/code/javascript/okta_sign-in_widget_ref.html#configuration).

#### A Walkthrough of the Widget Code

If you are a developer, the best way to understand the Okta
Sign-In Widget is to look at a simple example of the HTML
needed to get it working. The HTML below is the same as the HTML you added above:

~~~ html
<!doctype html>
<html lang="en-us">
<head>

  <title>Example Okta Sign-In Widget</title>

  <!-- Core widget js and css -->

  <script src="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.13.0/js/okta-sign-in.min.js" type="text/javascript"></script>
  <link href="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.13.0/css/okta-sign-in.min.css" type="text/css" rel="stylesheet">
  <!-- Optional, customizable css theme options. Link your own customized copy of this file or override styles in-line -->
  <link href="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.13.0/css/okta-theme.css" type="text/css" rel="stylesheet">
</head>
<body>
  <!-- Render the login widget here -->
  <div id="okta-login-container"></div>

  <!-- Script to init the widget -->
  <script>
    var orgUrl = 'https://{yourOktaDomain}.com';
    var redirectUrl = 'http://localhost:3333/signed-in.html';
    var oktaSignIn = new OktaSignIn({baseUrl: orgUrl});

    oktaSignIn.renderEl(
      { el: '#okta-login-container' },
      function (res) {
        if (res.status === 'SUCCESS') { res.session.setCookieAndRedirect(redirectUrl); }
      }
    );
  </script>
</body>
</html>
~~~

Here is what is happening in the HTML above:

#### Head

First, in the `<head>` tag, we include the  `okta-sign-in.min.js` and
`okta-sign-in.min.css` files. These files have all of the
logic and default style sheets used by the Okta Sign-In Widget.

We also include the `okta-theme.css` file, which adds Okta's own custom theme. This is the same theme you see on the login page of your Okta organization, assuming you have enabled the New Sign-In Page setting in `Admin -> Settings -> Appearance` in the `Sign-In Configuration` section. You can choose not to include this `okta-theme.css` style sheet if you so wish.

#### Body

In the `<body>`, we add a `<div>` tag with an `id` value of
`okta-login-container`. 

>Note: You can use any `id` value in this tag, we are just using `okta-login-container` here for the sake of clarity.

Next, we add some JavaScript code to insert the Okta Sign-In Widget
into the `okta-login-container` tag. In this short example, this
JavaScript is included at the end of the file. However, when you use
this code on your own site, you will need to run these functions
in the parts of your code that are run when the DOM is ready.

Here is what that JavaScript code is doing: first, the line below
initializes the Okta Sign-In Widget object. 

> The `baseUrl` value must be the domain for your Okta
organization. 

For example, if your Okta organization is `acme.okta.com` you
would replace the string `example.okta.com` below with
`acme.okta.com`.

Finally, the lines below actually render the Okta Sign-In
Widget. Note that the value for `el` can be any selector of your choice - "#okta-login-container" is a selector for an element in the HTML code that has an `id` attribute of "okta-login-container".

Also, note that we only define a "SUCCESS" callback in which we create an Okta session and redirect the browser to the Okta organization. This logs the user directly into the Okta dashboard. In a production environment, you should handle statuses beyond "SUCCESS" and define an "ERROR" callback as well.

~~~ javascript
oktaSignIn.renderEl(
  { el: '#okta-login-container' },
  function (res) {
    if (res.status === 'SUCCESS') { res.session.setCookieAndRedirect(orgUrl); }
  }
);
~~~

#### Customized Example

Below is a working example of a customized version of the Okta Sign-In Widget. You can see what these customizations do by copying this code into your
`login-to-okta.html` example file and reloading the page in your
web browser. 

~~~ javascript
var oktaSignIn = new OktaSignIn({
  baseUrl: orgUrl,
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Oldacmelogo.png/200px-Oldacmelogo.png',

  features: {
    rememberMe: true,
    smsRecovery: true,
    selfServiceUnlock: true
  },

  helpLinks: {
    help: 'http://acme.example.com/custom/help/page',
    forgotPassword: 'http://acme.example.com/custom/forgot/pass/page',
    unlock: 'http://acme.example.com/custom/unlock/page',
    custom: [
      { text: 'Dehydrated Boulders Support', href: 'http://acme.example.com/support/dehydrated-boulders' },
      { text: 'Rocket Sled Questions', href: 'http://acme.example.com/questions/rocket-sled' }
    ]
  },

  // See the contents of the 'okta-theme.css' file for a full list of labels.
  labels: {
    'primaryauth.title': 'Acme Partner Login',
    'primaryauth.username': 'Partner ID',
    'primaryauth.username.tooltip': 'Enter your @ partner.com ID',
    'primaryauth.password': 'Password',
    'primaryauth.password.tooltip': 'Super secret password'
  }
});
~~~

For more information about these configuration options, see the [Sign-in Widget Reference page](/code/javascript/okta_sign-in_widget_ref.html#configuration). 

## Troubleshooting

If you are working with a single-page app using the Sign-In Widget and your Okta cookie isn't set, try enabling third-party cookies in the browser.

For other questions, please get in touch with <developers@okta.com>.

## Next Steps

You can find more information about the Widget on the [Okta Sign-In Widget Reference Page](/code/javascript/okta_sign-in_widget_ref).

## GitHub Project

If you'd like to see the code that powers the Widget, you can [find it on GitHub](https://github.com/okta/okta-signin-widget).
