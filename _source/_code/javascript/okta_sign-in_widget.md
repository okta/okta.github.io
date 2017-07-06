---
layout: docs_page
title: Okta Sign-In Widget
excerpt: A drop-in widget with custom UI capabilities to power sign-in with Okta. An <a href="/code/javascript/okta_sign-in_widget_ref.html">in-depth reference</a> is also available.
weight: 1
redirect_from:
    - "/docs/guides/okta_sign-in_widget.html"
---

# Overview

The Okta Sign-In Widget is a JavaScript widget from Okta that gives
you a fully featured and customizable login experience which
can be used to authenticate users on any web site.

{% img okta-signin.png alt:"Screenshot of basic Okta Sign-In Widget" %}

### Authentication

The primary, and most visible, use case for the Okta Sign-In Widget is
validating a user using a username and password. In addition to
credential validation, the Okta Sign-In Widget also handles validation of
password complexity requirements and will display common error messages
for things like invalid passwords or blank fields.

### Multi-Factor Authentication

The Okta Sign-In Widget also comes with full support for Multi-Factor
Authentication user flows. It handles enrollment and verification
of factors and comes with built-in support for all of the factors listed below:

-   Okta Verify
-   Google Authenticator
-   RSA SecureID
-   Symantec VIP
-   Duo Security
-   SMS Authentication
-   Security Question

{% img okta-signin-mfa-select.png alt:"Screenshot of Okta Sign-In Widget Multi-Factor Authentication selector" %}

### Self service password reset

The Okta Sign-In Widget has everything you need to give your users the
ability to reset their forgotten passwords, it comes with support
for sending reset notifications as well as prompting users to verify
themselves by prompting them to answer a security question.

{% img okta-signin-reset-password.png alt:"Screenshot of Okta Sign-In Widget reset password dialog" %}

### Password Expiration

Another feature of the Okta Sign-In Widget is notifying users when their password has expired
and prompting them to update their password before allowing them to
log in.

{% img okta-signin-password-expired.png alt:"Screenshot of Okta Sign-In Widget password expired dialog" %}

### Validation and error handling

Finally, the Okta Sign-In Widget comes with extensive support for validating user
input as well as handling every imaginable error condition which
might occur in a user login flow.

{% img okta-signin-validation-failure.png alt:"Screenshot of Okta Sign-In Widget displaying validation error" %}

## A simple example

If you are a developer, the best way to understand the Okta
Sign-In Widget is to look at a simple example of the HTML
needed to get it working. The HTML below shows you how to quickly
and easily set up a fully featured login experience:

~~~ html
<head>
	<!-- Core widget js and css -->
	<script src="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.11.0/js/okta-sign-in.min.js" type="text/javascript"></script>
	<link href="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.11.0/css/okta-sign-in.min.css" type="text/css" rel="stylesheet">
	<!-- Customizable css theme options. Link your own customized copy of this file or override styles in-line -->
	<link href="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.11.0/css/okta-theme.css" type="text/css" rel="stylesheet">
</head>
<body>
	<div id="okta-login-container"></div>
	<script type="text/javascript">
		var orgUrl = 'https://example.okta.com';
		var oktaSignIn = new OktaSignIn({baseUrl: orgUrl});

		oktaSignIn.renderEl(
		  { el: '#okta-login-container' },
		  function (res) {
		    if (res.status === 'SUCCESS') { res.session.setCookieAndRedirect(orgUrl); }
		  }
		);
	</script>
</body>
~~~

Here is what is happening in the HTML above:

First, in the `<head>`
tag, we include the  `okta-sign-in.min.js` and
`okta-sign-in.min.css` files. These files have all of the
logic and default stylesheets used by the Okta Sign-In Widget.

We also include the `okta-theme.css` file, which adds Okta's own custom theme you get in the login page of your Okta organization if you have enabled the New Sign-In Page setting in `Admin -> Settings -> Appearance` in the `Sign-In Configuration` section. You can choose not to include this okta-theme.css stylesheet if you so wish.

In the `<body>`, we add a `<div>` tag with an "`id`" of
`okta-login-container`  &#x2013; you can use any "`id`" value in this tag,
we are just using `okta-login-container` here for the sake of clarity.

Next, we add some JavaScript code to insert the Okta Sign-In Widget
into the `okta-login-container` tag. In this short example, this
JavaScript is included at the end of the file. However, when you use
this code on your own site, you will need to run these functions
in the parts of your code that are run when the DOM is ready.

Here is what that JavaScript code is doing: first, the line below
initializes the Okta Sign-In Widget object, note that
the `baseUrl` value **MUST** be the domain for *your* Okta
organization. If you don't already have an Okta organization, please read the "Creation an Okta organization" section below.

For example, if your Okta organization is "`acme.okta.com`" you
would replace the string "`example.okta.com`" below with
"`acme.okta.com`":

~~~ javascript
var baseUrl = 'https://example.okta.com';
var oktaSignIn = new OktaSignIn({baseUrl: orgUrl});
~~~

Finally, the lines below actually render the Okta Sign-In
Widget. Note that the value for `el` can be any selector of your choice - "#okta-login-container" is a selector for an element in the HTML code that has an `id` attribute of "okta-login-container".

Also note that we only define a "SUCCESS" callback in which we create an Okta session and redirect the browser to the Okta organization. This logs the user directly into the Okta dashboard. In a production environment, you should  handle statuses beyond "SUCCESS" and define an "ERROR" callback as well.

~~~ javascript
oktaSignIn.renderEl(
  { el: '#okta-login-container' },
  function (res) {
    if (res.status === 'SUCCESS') { res.session.setCookieAndRedirect(orgUrl); }
  }
);
~~~

## An in-depth example

Now that you have a basic idea of how the Okta Sign-In widget works,
your next step is to see these capabilities in action for
yourself. The best way to do this is to set up a version of the
Okta Sign-In Widget that is configured to point at your own Okta
organization.

Setting up the Okta Sign-In Widget for your Okta organization requires the
following steps:

1.  Creating an Okta organization
2.  Creating an HTML file with the widget code
3.  Modifying the HTML to use your Okta organization
4.  Copying the HTML file to a web server
5.  Configuring CORS support on your Okta organization

### Creating an Okta organization

You can skip this step if you already have an Okta organization and
have the ability to configure CORS on that Okta organization.

If you do have the ability to [configure CORS](/docs/api/getting_started/enabling_cors.html) for your Okta
organization, or do not have an Okta organization, you will need to
create an [Okta Developer Edition](https://www.okta.com/developer/signup/) account for yourself before
continuing on the steps below.

### Configuring CORS support for your Okta organization

This step is necessary for Okta to accept authentication requests from an application through the Sign-In Widget.

You can enable CORS by following the steps in our guide for
[guide for Enabling CORS](/docs/api/getting_started/enabling_cors.html). Configure CORS using the same base url of the
web server you are using to host the HTML for the Okta Sign-In Widget (see below for instructions). For example, if you plan to host your Sign-In Widget in a page accessible under `http://localhost:8000`, you need to add `http://localhost:8000` as a trusted CORS endpoint in Okta.

To do so, follow the steps below:

1. Navigate to the `Admin -> Security -> API` page of your Okta dashboard.
2. In the `CORS` tab, add the url of the site that will host the Okta Sign-In Widget. For instance, if you want to test it on a development machine on a web site hosted at `http://localhost:8081`, add `http://localhost:8081` in the CORS multi-line text box.
3. Click `Enable CORS for the following base URLs`.
4. Press `Save`.

If you see the `Trusted Origins` tab instead of the `CORS` tab, follow the steps below:

1. Press the `Add Origin` button.
2. Fill out the Name field, add add the url of the site that will host the Okta Sign-In Widget to the `Origin URL` field.
3. Check the `CORS` check box in the `Type` section.
4. Press `Save`.


### Creating an HTML file with the widget code

The first step of getting the Okta Sign-In Widget set up for your Okta
organization is to copy the HTML below to a file named
`login-to-okta.html` - note that the HTML below is the *absolute minimum* that
you need to get the Okta Sign-In Widget working, it is not a complete
example by any means. A production deployment of the Okta Sign-In Widget
will have a lot more in-depth configuration.

Copy this to a file named `login-to-okta.html`:

    <!doctype html>
    <html lang="en-us">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Example Okta Sign-In Widget</title>

      <!--[if lt IE 9]>
          <script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.2/html5shiv.min.js"></script>
      <![endif]-->

      <script src="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.11.0/js/okta-sign-in.min.js" type="text/javascript"></script>
      <link href="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.11.0/css/okta-sign-in.min.css" type="text/css" rel="stylesheet">
      <!-- Optional, customizable css theme options. Link your own customized copy of this file or override styles in-line -->
      <link href="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.11.0/css/okta-theme.css" type="text/css" rel="stylesheet">
    </head>
    <body>
      <!-- Render the login widget here -->
      <div id="okta-login-container"></div>

      <!-- Script to init the widget -->
      <script>
        var orgUrl = 'https://example.okta.com';
        var redirectUrl = 'http://localhost:8000/signed-in.html';
        var oktaSignIn = new OktaSignIn({baseUrl: orgUrl});

        oktaSignIn.renderEl(
          { el: '#okta-login-container' },
          function (res) {
            if (res.status === 'SUCCESS') {
              console.log('User %s successfully authenticated %o', res.user.profile.login, res.user);
              res.session.setCookieAndRedirect(redirectUrl);
            }
          }
        );
      </script>
    </body>
    </html>

Note that in this code snippet, we redirect the user to a custom page we host locally at `http://localhost:8081/signed-in.html` instead of redirecting the user to the Okta dashboard (as was done in the simple example section above).

### Modify the HTML for your Okta organization

Once you've copied the HTML above into a file named
`login-to-okta.html`, the next step is for you to use your favorite
text editor to modify `login-to-okta.html`. You will need to
replace all instances of the string `example.okta.com` with the
[fully qualified domain name](https://en.wikipedia.org/wiki/Fully_qualified_domain_name) for your Okta organization.

**NOTE:** If you aren't sure what the "fully qualified domain name" for your
Okta organization is, it is simply the "[domain](https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax)" part of the URL
that you use to log in to Okta. For example, if your company name
is "Acme" and you log in to Okta using the
`https://acme.okta.com` then your fully qualified domain name
would be "`acme.okta.com`". Likewise, if you are using an Okta
Developer Edition organization, your domain will be something like
"`dev-12345.oktapreview.com`".

There is just one line you will need to modify in
`login-to-okta.html` to get the sample working in your own environment. Simply  update the two lines below to match your environment with your fully qualified domain name in the following line:

		var orgUrl = 'https://example.okta.com';
       var redirectUrl = 'http://localhost:8000/signed-in.html';

Replace `example.okta.com` in the `orgUrl` variable with the fully qualified domain name of your organization.
Replace `http://localhost:8000/signed-in.html` in the `redirectUrl` variable with the url of the page in your own web application where you would like to redirect the user after a successful login.

### Copy the HTML to a web server

Once you've created a `login-to-okta.html` file, your next step is
get this file hosted on a web server. The web server you use will
depend on your development environment and what you are comfortable
with using.

If you aren't sure which web server to use, or don't have one set up
already, an easy web server to set up on Mac OS X or GNU/Linux
is the `SimpleHTTPServer` that is included with `python`.

If you have Python installed on your system, you can start the
`SimpleHTTPServer` by running the following command from the same
directory that the `login-to-okta.html` file is located in:

    $ python -m SimpleHTTPServer

If you are a Node.js developer, you might be more comfortable
running a simple HTTP server in Node.js, which you can do as follows:

    $ npm install -g http-server

    $ http-server

### Testing the Okta Sign-In Widget

At this point, you are ready to test the Okta Sign-In Widget.

Test the Okta Sign-In Widget by loading the URL for the
`login-to-okta.html` file in your favorite web browser.

If you used `python -m SimpleHTTPServer` command above, this URL will be
`http://localhost:8000/login-to-okta.html`

Once you've successfully loaded the Okta Sign-In Widget, it is
time to start exploring the capabilities of the
widget.

Here are two things for you to try:

1.  Log in using credentials that you know are invalid.
    For example: Try using "invalid@example.com" as the user name and
    "invalid" as the password. You should see an error.
2.  Try using a valid user name and password. If everything works,
    you will be redirected to `http://localhost:8000/signed-in.html`.
3.  [Configure Multifactor Authentication](https://support.okta.com/help/articles/Knowledge_Article/27315047-Configuring-Multifactor-Authentication)
    for your Okta org and try logging in using the Okta Sign-In Widget.

    If you are redirected when you log in successfully, then it works!
    Your next step is to configure the Okta Sign-In Widget for your specific requirements.

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
Okta Sign-In Widget are in the [okta-theme.css](https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.11.0/css/okta-theme.css) file. We strongly
urge you to style your widget using only the selectors that are
present in the [okta-theme.css](https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.11.0/css/okta-theme.css) file as other stylistic elements in the widget may be subject to change and may cause your styling to break in
future versions of the Okta Sign-In Widget.

#### Example CSS styling for the Okta Sign-In Widget

Below is an in-line CSS example, which gives you an idea of how you
can style the Okta Sign-In Widget. Try the following style below
by copying the `<style>` tag below into the `<head>` section of
the `login-to-okta.html` file that you created above.

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
tag, we strongly encourage you to create your own stylesheet by
copying the `okta-theme.css` file onto your own website, and
update that file as needed. Here is what that might look like in
your HTML:

    <link href="https://your-website.example.com/static/css/custom-okta-theme.css" type="text/css" rel="stylesheet">

### Customizing widget features and text labels with JavaScript

The configuration options that are passed to the `OktaSignIn()`
constructor are used to configure the functionality and text labels
of the Okta Sign-In Widget. An example of how to configure
`OktaSignIn()` is below, followed by a full list of all of the
features and text labels that you can use to configure the Okta Sign-In Widget.

#### Example

Below is a working example of a customized version of the Okta Sign-In Widget. You can
see what these customizations do by copying this code into your
`login-to-okta.html` example file and reloading the page in your
web browser. A full list of the supported customization options
are below.

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

#### Configurable features

-   `baseUrl`

    The base URL for your Okta organization. Examples base URLs include:
    `https://example.okta.com` and `https://dev-12345.oktapreview.com`.
-   `recoveryToken`

    If starting in recovery flow (unlock or forgot pass), pass in the `recoveryToken`.
-   `logo`

    Company logo to use in the widget.
-   `features`

    The options in the `features` object enable or disable widget
    features via a Boolean `true` or `false`. Features are enabled
    by defining them with `true`, and disabled with `false`. For
    example, to disable display of the "Remember Me" checkbox, you would
    update your `features` object to look like below:

        features: {
            rememberMe: false
        }

    Here is the full list of features that you can configure:

    -   `rememberMe`

        When set to **true**, this will display a checkbox allowing a
        user to enable "Remember me" functionality at login.

        Defaults to **true**
    -   `smsRecovery`

        When set to **true**, this will allow a users with a configured
        mobile phone number to recover their password using an SMS.

        Defaults to **false**
    -   `selfServiceUnlock`

        When set to **true**, this will give users the option to perform a self-service password reset.

        Defaults to **false**
-   `helpLinks`

    The options in the `helpLinks` object set alternate links to be
    used for the help links on the Okta Sign-In Widget.

    Here is an example of configuring an alternate help link for the
    link labeled "Help", as well as configuring a custom link with a
    label of "Dehydrated Boulders Support":

        helpLinks: {
          help: 'http://acme.example.com/custom/help/page',
          custom: [
            { text: 'Dehydrated Boulders Support', href: 'http://acme.example.com/support/dehydrated-boulders' },
          ]
        }

    -   `help`

        When set to a *string containing a URL*, the value of this
        option will be used as the `href` for the help text labeled
        "Help" by default.
    -   `forgotPassword`

        When set to a *string containing a URL*, the value of this
        option will be used as the `href` for the help text labeled
        "Forgot password?" by default.
    -   `unlock`

        When set to a *string containing a URL*, the value of this
        option will be used as the `href` for the help text labeled
        "Unlock account?" by default.
    -   `custom`

        When set to an *array containing objects* with `text` and
        `href` keys, new links will be added to the help text for
        the Okta Sign-In Widget where the value of the `text` key will be
        used as the text label and the value of the `href` key will be
        used as the `href` link that label points to. For example:

            custom: [
              { text: 'Dehydrated Boulders Support', href: 'http://acme.example.com/support/dehydrated-boulders' },
              { text: 'Rocket Sled Questions', href: 'http://acme.example.com/questions/rocket-sled' }
            ]

## Troubleshooting

If you are working with a single-page app using the Sign-In Widget and your Okta cookie isn't set, try enabling third-party cookies in the browser.

## Reference Documentation
You can find more reference information in the [Okta Sign-In Widget reference](/code/javascript/okta_sign-in_widget_ref) page.
