---
layout: blog_post
title: 'Set Up and Enforce Multi-Factor Authentication with the Okta API'
author: dogeared
tags: [security, mfa, multi-factor authentication, authentication, api]
tweets:
  - "Love APIs & MFA? Watch as @afitnerd walks you through MFA setup with the @Okta API."
  - "@OktaDev <3 APIs. Watch as @afitnerd walks you through MFA setup with the @Okta API."
---

So, you're building a custom app and you need to include support for multi-factor authentication (MFA). Did you know that [Okta's API](https://developer.okta.com/) can support multi-step MFA workflows?

The diagram below shows the primary authentication flows with MFA enrollment and enforcement enabled. 

{% img blog/use-okta-api-for-mfa/mfa_enroll_enforce.png alt:"With API" width:"700" %}{: .center-image }

Okta has a push-based verification app called Okta Verify. It's available on the [Google Play](https://play.google.com/store/apps/details?id=com.okta.android.auth&hl=en) and [Apple App](https://itunes.apple.com/us/app/okta-verify/id490179405?mt=8) stores. Okta Verify is similar to Google Authenticator, except it adds the additional feature of supporting push notifications. We think this strikes a really great balance between additional security and user experience.

I created a screencast to demonstrate how you can manage the whole MFA enrollment and enforcement process using the Okta API [here](https://www.youtube.com/embed/EVL3gnt7BYo) or you can watch below:

<div style="width: 800px; margin: 0 auto">
  <iframe width="800" height="450" src="https://www.youtube.com/embed/EVL3gnt7BYo" frameborder="0" allowfullscreen></iframe>
</div>

Interested in learning more about secure authentication with Okta? Check out our [Product Documentation](https://developer.okta.com/documentation/), our hands-on [Platform for Developers](https://www.okta.com/services/training/) course, or any of these great posts from our developer blog:
* [Build an App for iOS and Android with Xamarin](/blog/2018/01/10/build-app-for-ios-android-with-xamarin)
* [Get Started with Spring Security 5.0 and OIDC](/blog/2017/12/18/spring-security-5-oidc)
* [Use Kong Gateway to Centralize Authentication](/blog/2017/12/04/use-kong-gateway-to-centralize-authentication)
* [Add Auth to Play Framework with OIDC and Okta](/blog/2017/10/31/add-authentication-to-play-framework-with-oidc)
* [Use OpenID Connect to Build a Simple Node.js Website](/blog/2017/10/19/use-openid-connect-to-build-a-simple-node-website)