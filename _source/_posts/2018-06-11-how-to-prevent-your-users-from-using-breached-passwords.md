---
layout: blog_post
title: "How to Prevent Your Users from Using Breached Passwords"
author: rdegges
description: "This article walks you though using PassProtect.js, a new developer library that ensures your user's won't use breached passwords. It is powered by haveibeenpwned."
tags: [javascript, authentication, security]
tweets:
 - "NIST recently started recommending that you don't let users use breached passwords in your web apps. In this short article @rdegges will show you how to easily implement this pattern:"
 - "Don't let your users use breached passwords when registering. PassProtect is a new JS library we've developed to help make this easy:"
 - "Use PassProtect to help prevent your users from using breached passwords.  PassProtect relies on @haveibeenpwned and helps improve web security in one line of code :)"
---

Not too long ago, the National Institute of Standards and Technology (NIST) [officially recommended](https://www.nist.gov/itl/tig/projects/special-publication-800-63) that user-provided passwords be checked against existing data breaches. Today I'm going to show you how you can easily add this functionality to any website you run using [PassProtect](https://github.com/OktaSecurityLabs/passprotect-js), an open-source developer library we created specifically for this purpose.

## Why Check User Passwords?

The new [NIST recommendations](https://www.nist.gov/itl/tig/projects/special-publication-800-63) 
mean that every time a user gives you a password, it's your responsibility as a developer to check their password against a list of breached passwords and prevent the user from using a previously breached password.

This is a big deal in the security community because for many years now, as more and more websites have been breached, attackers have started downloading the breached user credentials and using them to attempt to compromise accounts elsewhere.

For instance, let's say that your password, "fdsah35245!~!3", was breached in the well-known [Sony data breach](https://www.forbes.com/sites/josephsteinberg/2014/12/11/massive-security-breach-at-sony-heres-what-you-need-to-know/) back in 2014. Once those passwords were leaked, attackers would download the compromised passwords and use them to try to log into other user's accounts.

An attacker might, for example, try to log into user accounts using your leaked password because they know that this was a real password that someone was using, and the likelihood of other people using it is (you included) is high.

To combat this, the officially recommended NIST solution is that you check each user-provided password to ensure it isn't one of these leaked credentials — thereby reducing the odds that an attacker will be able to easily guess user credentials on your site.

## How to Get Access to Breached Passwords

The only problem with the NIST recommendation is that it is *hard to implement*. In order to check a user's password against a list of breached passwords you need to have a massive database of every set of leaked credentials. This is not only impractical, but a risk on many levels (security, legal, compliance).

To help developers adopt this new NIST recommendation, [Troy Hunt](https://www.troyhunt.com/) created the free service [Have I Been Pwned](https://haveibeenpwned.com/) which aggregates all data breaches into a massive database.

Have I Been Pwned allows you to access breached data by either:

- Downloading the breached data hashes directly: [https://haveibeenpwned.com/Passwords](https://haveibeenpwned.com/Passwords) (scroll down on the page to find the download links), or
- Using the free and anonymous API: [https://haveibeenpwned.com/API/v2](https://haveibeenpwned.com/API/v2)

The Have I Been Pwned API allows you to make as many requests as you want, which makes it particularly useful for checking to see if your users' passwords have been breached.

## How to Easily Check Your Users' Passwords

In order to make it easy for you to check your users' passwords against the Have I Been Pwned database, we recently created the [passprotect-js](https://github.com/OktaSecurityLabs/passprotect-js) developer library.

It's designed as a simple JavaScript library that can be dropped into any web page (anywhere on the page), that will check your users' passwords against the Have I Been Pwned API service and inform the user if the password they're using has been involved in a breach:

{% img blog/how-to-prevent-your-users-from-using-breached-passwords/passprotect.gif alt:"PassProtect Demo" %}{: .center-image }

PassProtect is:

- **Fast**: the entire library is 16k (gzipped).
- **Mobile friendly**: it renders great on devices of all sizes.
- **Informative**: it will explain to users that the password they're attempting to use has been breached.
- **Not annoying**: it won't repeatedly annoy the user about the same password over and over again in the current session.
- **Secure**: no passwords are ever stored or shared over the network. PassProtect uses k-Anonymity which means that the only thing that is sent over the network are the first 5 characters of the password hash.

To use PassProtect, all you need to do is drop the following `script` tag somewhere into the pages on your site:

```html
<script src="https://cdn.passprotect.io/passprotect.min.js"></script>
```

We hope that by providing some simple tooling we can help developers adopt the new NIST recommendations and promote better overall web security.

Please [hit us up](https://twitter.com/oktadev) if you have any questions or comments!

**PS**: If you'd like to enable PassProtect's functionality on every single website you use, you can always go install the [PassProtect Chrome extension](https://chrome.google.com/webstore/detail/passprotect/cpimldclklpfifolmdnicjnfbjdepjnf).

And... If you like PassProtect, you might also like [our API service](https://developer.okta.com/). The Okta API stores user accounts for the websites, mobile apps, and API services you're building and makes it easy to handle things like authentication, authorization, etc. It has an awesome free plan for developers (like you), and you can create a new Okta account and give it a try here: [https://developer.okta.com/signup/](https://developer.okta.com/signup/).
