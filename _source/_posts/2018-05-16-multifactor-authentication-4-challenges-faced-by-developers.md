---
layout: blog_post
title: "Multi-Factor Authentication: 4 Challenges Faced by Developers"
author: dogeared
description: "This post explains multi-factor authentication and some challenges that developers face with it."
tags: [multi-factor, authentication, developer]
---

Multi-factor authentication (MFA) is the most reliable way to ensure the security of your users' PII (personally identifiable information), and with Okta it's easier than ever to implement in your application! Why is MFA super-secure? It's simple: While a user may have a terrible password, many additional factors are inherently immutable. Some common second factors of authentication include a text message with a one-time use code, called SMS verification, a code that refreshes regularly in an app like Google Authenticator a push notification app like Okta Verify, or a USB hardware device that must be plugged into the user's computer, like a Yubikey.

MFA is rapidly gaining in adoption, and more and more organizations are interested in deploying it to protect their applications and users. That widespread adoption doesn't mean MFA has gotten any easier to build or implement. You have to consider how secure your approach is, how you'll test it, and how you will support it. In this post we'll walk through four reasons building MFA remains tough for modern developers, and how Okta can help! But first, what is Okta?

## What is Okta?

Okta is a cloud service that allows developers to create, edit, and securely store user accounts and user account data, and connect them with one or multiple applications. Our API enables you to:

* [Authenticate](https://developer.okta.com/product/authentication/) and [authorize](https://developer.okta.com/product/authorization/) your users
* Store data about your users
* Perform password-based and [social login](https://developer.okta.com/authentication-guide/social-login/)
* Secure your application with [multi-factor authentication](https://developer.okta.com/use_cases/mfa/)
* And much more! Check out our [product documentation](https://developer.okta.com/documentation/)

In short: we make [user account management](https://developer.okta.com/product/user-management/) a lot easier, more secure, and more scalable than what you're probably used to.

Sound amazing? [Register for a free developer account](https://developer.okta.com/signup/), and when you're done, come on back so we can learn more about the struggles of building MFA. Starting with:

## 1. Multi-Factor Authentication is Hard to Secure

Let's assume we're stuck with passwords as our first factor (for now anyway!), let's examine the possibilities for additional factors when authenticating. The most popular and consumer-accessible types of MFA fall into three categories (listed least secure to most secure):

1. SMS (text messages) one-time use tokens
2. Time-based tokens
3. Hardware token devices

{% img blog/multifactor/multifactor-approach.png alt:"MFA Approaches" width:"800" %}{: .center-image }

### SMS-Based Multi-Factor Authentication

Perhaps the most common today, and also the easiest to implement is text message-based MFA.

The flow works like this:

1. You log in to an application with your username and password
2. You see is a text field asking you to input a code sent via SMS
3. You receive an SMS with a one-time use code
4. You enter the code in the text field and proceed on to the application

Easy, right? Unfortunately, this isn't very secure, and security is what you're going for if you're implementing MFA, right? The National Institutes of Standards and Technologies (NIST) has gone so far as to say it should no longer be used at all ([section 5.1.3.2](https://pages.nist.gov/800-63-3/sp800-63b.html#sec5)). Yikes!

Why is it insecure? Here's one scenario: Imagine you use iOS and the Messages app, which allows your text messages to come to your desktop. Now, imagine an attacker has compromised your Apple ID and password. The attacker will now be able to intercept incoming text messages, including those that are one-time codes for multi-factor authentication.

NOTE: Whenever a user logs into the Messages app for the first time, an email notification is sent letting the owner know that Messages has been used from a new device. This could tip off the real owner to their account being used by an attacker.

In that example, we assume an attacker has already gained access to your desktop, but that's not always the case. Cell phone communications can be monitored, and probably are more than any of us would like to think about. [This monitoring makes SMS-as-a-factor inherently insecure](https://iicybersecurity.wordpress.com/2015/05/11/how-to-intercept-mobile-communications-calls-and-messages-easily-without-hacking/).

### Time-Based Token Multi-Factor Authentication

Another common, more secure, but more challenging to implement approach is called Time-Based One-Time Password algorithm or [TOTP](https://tools.ietf.org/html/rfc6238). This approach uses a secret shared between the server and the client (typically a mobile app) in conjunction with the current time to generate a one-time use code. The client knows the code by running the shared secret through the algorithm and the server can verify the posted code by running the same secret through the algorithm. The code is only valid for a set amount of time, usually 30 seconds.

The flow looks like this:

1. You log into an application with your username and password
2. You see is a text field asking you to input the latest code
3. You launch your TOTP client on your mobile phone and see the current code
4. You enter the code in the text field and proceed on to the application.

It's more secure than the SMS approach because there is no medium of transmission for the code. It is generated by the algorithm. The shared secret must be kept a secret for this approach to remain secure.

One of the most popular implementations is [Google Authenticator](https://www.tomsguide.com/us/google-authenticator-how-to-use,news-26819.html). It makes the TOTP approach easier to use by showing the secret as a QR code that most mobile apps can read. This is much more reliable and easier to use than manual input of a shared secret.

### Hardware Token Devices

This is the most sophisticated, secure and hardest to implement approach. This approach used to be the domain of companies building MFA for the enterprise (read: expensive).
Then, along came the Fast IDentity Online Alliance ([FIDO](https://fidoalliance.org/)). It has produced a device-centric standard making the ability of companies to implement hardware-based multi-factor authentication much more accessible.

The flow can work in a variety of ways, but here are two examples:

**Passwordless**

1. You launch an application on your smartphone
2. You see a screen waiting for your fingerprint
3. You touch your finger to the fingerprint reader
4. You are authenticated and enter the app

Note: This mode has a good separation of concerns in that the app has no access to your fingerprint data. The hardware in the phone responds to the app with success or failure.

**Second Factor**

1. You log in to an application with your username and password
2. You see an indicator, such as a spinner, waiting for input from your hardware device
3. You touch the thumb-pad on your hardware device connected to your computer
4. You proceed on to the application

[Yubikeys](https://www.yubico.com/products/yubikey-hardware/fido-u2f-security-key/) are a good example of this mode. It's a physical device that connects to your computer's USB port and has a touch sensitive area to respond to an authentication request.

## 2. Multi-Factor Authentication is Hard to Develop

At Okta, we support all three approaches described above and more. Each approach has a uniform interface broken into two parts: enrollment and enforcement, and each part is driven by policy definitions. For enrollment, you define the factors you want to support and a policy that drives when your users must enroll in MFA, which factors are required and which are optional. For enforcement, you define a policy that drives when a user will have to use a second factor. As an example, you could require a second factor every time your users log in. Or, you could require them to use a second factor only when they are away from your corporate network.

There are a number of considerations when adding MFA to your application. For instance, will a user be required to set up MFA during registration? Will a user have to provide a token code at every login or only under certain circumstances? Each of these considerations adds considerable complexity, and when you're building these systems yourself complexity always = time.

## 3. Multi-Factor Authentication is Hard to Test

Integration testing of MFA presents a few not-insignificant challenges. In the case of SMS, user interaction is required. That is, a device is going to receive a real SMS message containing a code that needs to be entered on the challenge for validation.

Google Authenticator integration tests are run for every build and release. How is this possible given that Google Authenticator also requires entering in a code that changes every 30 seconds? The answer lies in the underpinnings and strength of TOTP: its codes are algorithmically generated.

All that's required is a shared key and an accurate clock (the one built into your computer will do just fine). So, to be able to test Google Authenticator MFA against the real backend, we built TOTP into our test suite.

We can create a `GoogleAuthenticator` factor on the backend, use its secret to determine that latest valid code, and create and verify the challenge against the backend in an integration test.

Sounds complex? That's why we built this at Okta: so you don't have to deal with building this testing!

## 4. Multi-Factor Authentication is Tough to Support

If you're going to implement multi-factor authentication, you'll need to give your admins the ability to manage certain aspects of it. For instance, if a user loses their phone, an admin may need to act quickly to remove registered factors.

This could be a self-service part of your application, but you need to take extra care to perform these sorts of actions in a secure way. This is often accomplished by requiring users to receive an email or to put in additional security information (best friend's name growing up, first city you lived in, etc.). These can all be considered additional (although pretty weak) factors.

In the Okta Admin Console, we have an interface to manage factors:

{% img blog/multifactor/factor-types.png alt:"Okta Multi-factor Types" width:"800" %}{: .center-image }

{% img blog/multifactor/factor-policy.png alt:"Okta Multi-factor Policy" width:"800" %}{: .center-image }

## MFA the Easy Way

In this post, we've covered some of the approaches to multi-factor authentication, the merits of each, and the challenges involved in building it yourself.

{% img blog/multifactor/good-news-everyone.jpg alt:"Good News Everyone" width:"800" %}{: .center-image }

Happily, multi-factor authentication is at the very core of Okta's business: providing the identity layer for companies, applications, and people. With just a few lines of code, you can add support for SMS, Google Authenticator, Okta Verify and many others to your application today. If you use the [Okta Sign-In Widget](https://github.com/okta/okta-signin-widget), no additional coding for MFA support is needed!

To learn more about MFA with Okta, check out these resources:
* [Our MFA product documentation](https://developer.okta.com/use_cases/mfa/)
* [Set Up and Enforce Multi-Factor Authentication with the Okta API](https://developer.okta.com/blog/2018/02/08/set-up-and-enforce-multi-factor-auth-with-okta)
* [Biometrics for Authentication: The Risks and Potential Rewards](https://www.okta.com/security-blog/2018/05/biometrics-for-authentication-the-risks-and-potential-rewards/)
