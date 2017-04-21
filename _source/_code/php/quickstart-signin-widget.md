---
layout: docs_page
title: Sign In Widget
excerpt: Quickstart guide for using the sign in widget with PHP.
support_email: developers@okta.com
---

# Overview
The Okta Sign-In Widget is a JavaScript widget from Okta that gives you a fully featured and customizable login experience which can be used to authenticate users on any web site.

![Screenshot of basic Okta Sign-In Widget](/assets/img/okta-signin.png)

# Configuring your Organization

## Sign-up for Okta
1. Go to [https://www.okta.com/developer/signup/]() and complete the form.
2. After submitting the form, you will be presented with your Okta URL. Make note of this url, you will need it later. You will also receive an confirmation email.
3. Once you click on the sign-in link in your email, Okta will finish provisioning your account for you. Sign in with the password provided in the email.
4. Follow the remaining steps for account creation on the form provided after logging in and then click `Create My Account`

After your are finished creating your account, you will be logged into your new organization. In the top right of the screen, there is an `Admin` button. Clicking on that button is where we'll be spending most of our time during this guide.  For the remainder of this quickstart, we're going to
 assume the domain for your organization will be `dev-123456.oktapreview.com`. For your application, you'll want to
  change this url to match your own organizations url. 

## Enable CORS for your Domain
This step is necessary for Okta to accept authentication requests from an application through the Sign-In Widget.

You can enable CORS by following the steps in our guide for [guide for Enabling CORS](http://developer.okta
.com/docs/api/getting_started/enabling_cors.html). Configure CORS using the same base url of the web server you are 
using to host the HTML for the Okta Sign-In Widget (see below for instructions). For our example, we'll be setting 
our example to be hosted on `http://localhost:8000`. We'll need to add `http://localhost:8000` as a trusted CORS 
endpoint in Okta.

To do so, follow the steps below:
1. Navigate to `Admin -> Security -> API` page of your Okta dashboard.
2. In the `Trusted Origins` tab, click on `Add Origin`. This will open a model window with a form to fill out.
3. Give your new origin a name, we will use `PHP Sign-In Widget Example` as ours.
4. In the Origin URL field, fill in your web server that you are hosting on, we'll use `http://localhost:8000`.
5. Check `CORS` in the `Type` section and then click `Save`

## Create an Authorization Server
An authorization server defines your security boundary, for example "staging" or "production". Within each 
authorization server you can define your own OAuth scopes, claims, and access policies. This allows your apps and 
your APIs to anchor to a central authorization point and leverage the rich identity features of Okta, such as 
Universal Directory for transforming attributes, adaptive MFA for end-users, analytics, and system log, and extend it
 out to the API economy.
 
We will need to set up our own authorization server for our example. This is what the Sign-In Widget will communicate 
with to handle the user authentication services. To set this up, follow the steps below:
1. Navigate to `Admin -> Security -> API` page of your Okta dashboard.
2. Select the Authorization Servers tab if not already selected.
3. Click on `Add Authorization Server`. This will open a model window with a form to fill out.
4. Fill in the form with your informtaion. For our example, we will be using the following:
   - Name: PHP Sign-In Widget Example - Develop
   - Resource URI: http://localhost:8000 
     - This is the URI for the OAuth resource that consumes the Access Tokens. 
     - This value is used as the default 
    audience for Access Tokens
   - Description: This is the development site for our Sign-In widget example in PHP.
5. Click `Save`

## Create an Access Policy
Our new authorization server will need to have an access policy created so it knows how to handle its users. To 
create a new policy, follow the steps below:
 
1. Navigate to `Admin -> Security -> API` page of your Okta dashboard.
2. Select the Authorization Servers tab if not already selected.
3. Choose the name of the authorization server we created, or the one you want to add a policy to.
4. Click on `Access Policies > Add Policy`. If you already have a policy, you may see `` instead of `Add Policy`. This 
will open a model window with a form to fill out.
5. Provide the requested information. For our example, we will be using the following:
   - Name: Policy 1
   - Description: Primary Policy for the PHP Sign-In Widget Example
   - Assign To: All Clients
   
### Add a Rule to New Policy
For your new policy that we just created, we'll need to add a rule to tell the policy how to function.
 
1. Navigate to `Admin -> Security -> API -> Access Policies` page of your Okta dashboard.
2. Select the policy we just created `Policy 1`.
3. Click on `Add Rule`. This will open a model window with a form to fill out.
4. Provide the requested information. For our example, we will be using the following:
   - Rule Name: Primary Rule
   - Grant type is: 
     - Client credentials
     - Authorization code
     - Implicit
     - Resource Owner Password
   - User is: Any user assigned to app
   - Grant these scopes: ALl Scopes
   - Access token lifetime is: 1 Hour
   - Refresh token lifetime is: Unlimited
     - but will expire: 7 days

## Create your application
Now that we have our access policy set up, we need an application to communicate with. This is the application that 
will be the core of your project. To create an application, follow the steps below:

1. Navigate to `Admin -> Applications` page of your Okta dashboard.
2. Click `Add Application`. This will take you to the add application page, we will select the button `Create New 
App` instead of selecting a pre-defined one. This will open a model window and give you a few options. We'll be using
 the following:
   - Platform: Web
   - Sign on method: OpenID Connect
3. For the general settings page, we'll be using the following:
   - Application Name: PHP Sign-In Widget
   - Application Logo: none
4. Click `Next` and then we will be configuring OpenID connect:
   - Redirect URIs: http://localhost:8000/oauth2-callback.php
5. Click `Finish`
6. In the `General` tab of the application you just created, we need to add a few `Allowed grant types`. Click `Edit`
 of the `General Settings` area and make sure you select `Implicit (Hybrid)` which will give you the option to select
  `Allow Access Token with implicit grant type`.  Select that and then click `Save`. 

Make note of the Client ID from the `Client Credentials` section as we will need this when we set up the widget in 
our application.

### Assigning Groups to the Application
The last part of the application setup is setting up group access.  

1. Navigate to `Admin -> Applications` page of your Okta dashboard and select the application we just created.
2. Select the `Groups` tab.
3. Click on `Assign to Groups`. This will open a model window with all groups associated with your organization.
4. Find `Everyone` in this list and click `Assign`.  You can limit this to only certain groups by selecting on those 
groups instead of `Everyone`.
5. Click `Done`