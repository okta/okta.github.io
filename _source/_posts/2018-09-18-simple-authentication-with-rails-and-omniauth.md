---
layout: blog_post
title: 'Simple Authentication with Rails and OmniAuth'
author: avanbeek
description: "Learn how to easily add user authentication into Rails apps using OmniAuth, devise, and Okta."
tags: [ruby, rails, devise, omniauth, security]
tweets:
- "Easily add authentication to your @rails apps using #omniauth and @oktadev <3"
- "Need a simpler way to manage users for your @rails applications? Try @oktadev! We just published an article showcasing how to make things work with #omniauth"
- "Wire your @rails apps up to use #openidconnect with #omniauth and @oktadev"
image: blog/omniauth/app.png
---

Today I'm going to show you how to authenticate users into your Rails applications using the latest best-practices and a hosted authentication/authorization provider which makes managing users simple. Specifically, you'll learn how to integrate Rails and [Okta](https://developer.okta.com/) to create, manage, and secure users with [OpenID Connect](https://developer.okta.com/blog/2017/07/25/oidc-primer-part-1).

To make this all work, we'll be using one of the most popular gems in the Rails world: [OmniAuth](https://github.com/omniauth/omniauth). Additionally, we'll be using the fabulous [devise](https://github.com/plataformatec/devise) gem to make plugging user authentication into our app simple.

{% img blog/omniauth/omniauth-diagram.png alt:"OmniAuth diagram" width:"600" %}{: .center-image }

The core of what we're building is powered by [OmniAuth Gem](https://github.com/omniauth/omniauth), which will help our Rails app handle [OAuth](https://developer.okta.com/blog/2017/06/21/what-the-heck-is-oauth) and OpenID Connect flows. What OmniAuth does is ask an identity provider (Okta, in this case) for access to user information in the form [JSON Web Tokens](https://developer.okta.com/authentication-guide/tokens/validating-access-tokens). OmniAuth then provides a very simple hash in the form of `request.env[‘omniauth.auth’]` which contains all the logged-in user's information which we can then easily pass to [Active Record](https://guides.rubyonrails.org/active_record_basics.html) to store in a database. **Cool, right?!**
## Jump Into the Project

```bash
git clone https://github.com/andrewvanbeek-okta/oktaOmniAuthDeviseSample.git
cd oktaOmniAuthDeviseSample
 ```

Now install all of the project's dependencies using [Bundler](https://bundler.io/).

```bash
bundle install
 ```

Next, create a database using the `rake` command.

```bash
rake db:create
```

Next, create an `application.yaml` file to populate all necessary environment variables.

```
bundle exec figaro install
 ```

If you don't already have an Okta account, go create one now: <https://developer.okta.com/signup/>. Okta is a free-to-use API service that stores user accounts and handles user authentication and authorization.

Once your Okta account has been created, you'll need to copy some Okta values into environment variables for Rails to use. Edit the newly generated `config/application.yml` and add the following values from your Okta tenant.
```
OKTA_CLIENT_ID: "YOUR-CLIENT-ID"
OKTA_CLIENT_SECRET: "YOUR-CLIENT-SECRET"
OKTA_ORG: "YOUR-OKTA-ORG"
OKTA_DOMAIN: "okta"
OKTA_URL: "YOUR-OKTA-ORG-URL"
OKTA_ISSUER: "YOUR-OKTA-ISSUER-URL"
OKTA_AUTH_SERVER_ID: "YOUR-AUTH-SERVER-ID"
OKTA_REDIRECT_URI: "http://localhost:5000/users/auth/oktaoauth/callback"
 ```

Now you might be wondering: where do these values come from? These values can all be retrieved from the Okta dashboard. Go to Okta and log in, then follow the steps below to retrieve these values. These values are standard OAuth configs which OmniAuth uses to communicate with Okta -- the setup will be similar for other OAuth providers.

### Create an App with Okta

From the dashboard, click the **Applications** menu item, then click the **Add Application** button. From there, select the **Web** option and click **Next**.

Next, fill in the following values for your new Okta application.

- **Name**: `Rails App`
- **Base URIs**: `http://localhost:5000`
- **Login Redirect URIs**: `http://localhost:5000/users/auth/oktaoauth/callback`

Then click **Done**. You can now copy the **Client ID** and **Client secret** values into your environment variable file as mentioned above.

### Get Your Okta Configuration Information

To get your `OKTA_URL` value, visit the Okta dashboard main page and copy the **Org URL** value from the top-right of the screen.

To get the `OKTA_ISSUER` value, use `OKTA_ISSUER/oauth2/default`, substituting your issuer URL in.

Finally, for `OKTA_AUTH_SERVER_ID`, use the value `default`. 

## Test Out Your Rails App

Now that you've configured the necessary environment variables, let's test it out!

Run the following commands to start a local web server to test against.

 ```bash
rake db:migrate
rails s
```

{% img blog/omniauth/app.png alt:"Rails app" width:"600" %}{: .center-image }

Be sure to click around, sign up, sign in, and see how OmniAuth + [Okta](https://developer.okta.com/signup/) make the authentication process painless.

Interested in learning more? I recorded a screencast which walks through adding Okta to existing devise-based applications. Give it a watch or leave a comment below.

<div style="margin: 0 auth; text-align: center;"><iframe width="560" height="315" src="https://www.youtube.com/embed/8_Yt4U2lJJM" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>
