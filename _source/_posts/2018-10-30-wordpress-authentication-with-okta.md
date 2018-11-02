---
layout: blog_post
title: "Add Secure Authentication to your WordPress Site in 15 Minutes"
author: aaronpk
description: "This post will show you how to secure your WordPress login with two-factor authentication by using Okta's Sign-In Widget."
tags: [wordpress,authentication,login,plugin]
tweets:
- "Secure your WordPress with two-factor authentication 🔐 #wordpress #2fa"
- "Add secure authentication to your WordPress site with Okta! 🔑 #wordpress"
image: blog/okta-wordpress-sign-in/wordpress-mfa.jpg
---

Do you run a WordPress site and want to avoid managing a separate list of user accounts? Have you ever wanted to add two-factor authentication to WordPress? Typically WordPress keeps its own database of usernames and passwords, but if you run multiple websites, I'm sure you're familiar with the pain of keeping lists of users in sync. Wouldn't it be great if you could manage all your users in one place, letting them log in to all your websites using the same password?

This is where Okta can help out! Okta is an API service that allows you to create, edit, and securely store user accounts and user account data, and connect them with one or more applications. It also provides a sign-in widget which you can embed into your own applications to avoid creating your own login form for every application.

We've created a proof of concept WordPress plugin that replaces the WordPress login form with the Okta Sign-In Widget! Once you install and activate this plugin, the next time you try to log in to WordPress, you'll instead see the Okta sign-in page.

{% img blog/okta-wordpress-sign-in/wordpress-authentication.png alt:"WordPress Authentication" width:"800" %}{: .center-image }

Any users that exist in your Okta account will be able to log in, and a WordPress user will be created for them automatically. If your users have multi-factor authentication enabled, they'll be prompted for that too when they log in!


## Get Started with Okta's WordPress Login Plugin

To get started, [sign up for a free Okta Developer account](https://developer.okta.com/signup/).

Download the [Okta WordPress plugin](https://github.com/oktadeveloper/okta-wordpress-sign-in-widget) into your plugins folder, and copy the `env.example.php` to `env.php`. This is where you'll configure your Okta API credentials.

Go into your Dashboard and create a new web application.

{% img blog/okta-wordpress-sign-in/okta-create-web-application.png alt:"Create a new web application" width:"800" %}{: .center-image }

Make sure to set your **Base URI** and **Login redirect URI** to the location of your WordPress installation. The Login redirect URI should include `/wp-login.php` as well.

{% img blog/okta-wordpress-sign-in/okta-app-config.png alt:"Configure your application settings" width:"800" %}{: .center-image }

Copy the Client ID and Secret and paste them into your `env.php` file. You'll also need to set the base URL to `https://{yourOktaDomain}`, and you can leave the authorization server ID set to "default".

{% img blog/okta-wordpress-sign-in/okta-client-credentials.png alt:"Client Credentials" width:"800" %}{: .center-image }

Make sure the email address on your Okta account matches the email address of your WordPress admin user, as that's what will be used to match up Okta accounts to WordPress accounts.

## Activate the WordPress Authentication Plugin

In your WordPress admin page, you'll see the Okta plugin listed. Click "activate" to enable the plugin! If you've configured everything right, you'll see the plugin listed as activated.

{% img blog/okta-wordpress-sign-in/wordpress-plugin-activated.png alt:"WordPress plugin activated" width:"800" %}{: .center-image }

Now log out of WordPress and try to log back in! When you visit the WordPress login page, instead of the default WordPress username and password fields, you'll see your Okta Sign-In Widget! Enter your Okta account credentials and you will be logged in to WordPress!

<iframe width="800" height="500" src="https://www.youtube.com/embed/l8fWJTSDlWo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Enable Multi-Factor Authentication for WordPress

You now have an easy way to enable multi-factor authentication for your WordPress site as well! You can choose to require the MFA challenge on every login, or you can require it after a certain number of days.

From your Okta Developer dashboard, first switch into the Classic UI.

{% img blog/okta-wordpress-sign-in/okta-switch-classic-ui.png alt:"Switch to the classic UI" width:"400" %}{: .center-image }

Next you'll need to create what's called a "Sign-On Policy" for your Okta application. Click on the **Applications** menu, then select your application from the list. Click the **Sign On** tab to navigate to the place you can create the policy.

{% img blog/okta-wordpress-sign-in/okta-sign-on-settings.png alt:"Sign-on Settings" width:"800" %}{: .center-image }

Scroll to the bottom of this page to the "Sign On Policy" section, and click **Add Rule**.

Give your rule a name like "Always require MFA challenge", and check the **Prompt for factor** and **Every sign on** options.

{% img blog/okta-wordpress-sign-in/okta-mfa-rule.png alt:"Configure an MFA rule" width:"600" %}{: .center-image }

Lastly, navigate to the **Security** -> **Multifactor** menu to configure which types of multifactor authentication you want to support.

{% img blog/okta-wordpress-sign-in/okta-mfa-settings.png alt:"MFA Settings" width:"800" %}{: .center-image }

From here, you can enable the Okta Verify app, Google Authenticator, a U2F security key, or others!

You can find the source code for the application at [github.com/oktadeveloper/okta-wordpress-sign-in-widget](https://github.com/oktadeveloper/okta-wordpress-sign-in-widget).

## Learn More About Authentication in PHP

If you want to read more about app security in PHP or Angular, we'd love to have you follow the [Okta Developer Blog](/blog/). Here are some great posts to get you started:

* [Add Authentication to Any Web Page in 10 Minutes](/blog/2018/06/08/add-authentication-to-any-web-page-in-10-minutes)
* [Build an Angular App with Okta's Sign-In Widget in 15 Minutes](/blog/2017/03/27/angular-okta-sign-in-widget)

As always, we'd love to hear from you. Hit us up with questions or feedback in the comments, or find us on Twitter [@oktadev](https://twitter.com/oktadev), [Facebook](https://www.facebook.com/oktadevelopers/), and [LinkedIn](https://www.linkedin.com/company/oktadev)!
