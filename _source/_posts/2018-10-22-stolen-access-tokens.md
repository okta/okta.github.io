---
layout: blog_post
title: "Stolen Access Tokens and You"
author: keith_casey
description: "In recent weeks, we've seen a number of hacks around OAuth access tokens. As much as we'd like to blame the underlying technology, it's more out of misuse and misunderstanding than anything else."
tags: [oauth, security]
Tweets:
- "Our own @caseysoftware walks us through how to handle stolen access tokens 🔓 #oauth #security"
- "How should stolen access tokens be dealt with? @caseysoftware walks us through it ➡"
image: blog/stolen-access-tokens/server-rack.jpg
---

What never dies, spreads rampantly, and is guaranteed to bite you? You guessed it: Stolen access tokens!

In recent weeks, we've seen a number of hacks around OAuth access tokens. As much as we'd like to blame the underlying technology, it's more out of misuse and misunderstanding than anything else.

No matter who it is, the outbreak is the same:

* A website uses OAuth with little to no granularity in scopes
* The website issues an access token with no expiration
* The website is compromised and tokens are leaked
* Those tokens are used to gain access to other systems

*This is not the kind of "going viral" we wanted.*

Even worse, when we investigate and try to clean up this mess, we discover three things:

First, the tokens don't have an expiration time, so they never die. A token compromised today is compromised for all time. Even if we've implemented OAuth Token Revocation ([RFC 7009](https://tools.ietf.org/html/rfc7009)), the downstream systems probably don't [validate the access tokens as we'd like](https://developer.okta.com/authentication-guide/tokens/validating-access-tokens) so it lives on forever.

Further, those downstream systems probably accept that access token to [generate their own sessions](https://www.wired.com/story/facebook-hack-single-sign-on-data-exposed/) and issue their own access tokens. Each of those sessions and tokens have their own lifetimes which are completely disconnected from the original token. One vulnerability spreads across every system in a matter of moments.

Finally, remember those original tokens were unscoped or overscoped. We lost the skeleton key so our attacker can open any door, download any data, and potentially even modify the user's account. If they change their email address, no matter how many warning notifications we send, it's already too late. No one is listening.

At this point, our options are limited. We can freeze accounts, revoke tokens, and notify downstream applications, but ultimately we have to hope for the best. Unfortunately, that's not sufficient. Like most people in security, I'm paranoid and need to know we've locked every window, secured every route, and hardened every link. Therefore, we have to consider both how to stop it and how to prevent this in the first place.

## Stop the Spread

From the downstream application's point of view, we have to be careful what we accept. Instead of using an access or ID token to create and activate a user's account, we can insert a break into that process. Between creation and activation, we should insist on an additional factor to create a quarantine zone between this user and our system. This could be as simple as an activation email to the email provided in a validated token. This break protects our system and is a well understood pattern for users.

Unfortunately, expecting every developer of every downstream application to adhere to best practices in every scenario is wildly optimistic in the best of times. How do we prevent the outbreak in the first place?

## Prevention is the Cure

First, we should implement OAuth 2.0 Token Revocation ([RFC 7009](https://tools.ietf.org/html/rfc7009)) and OAuth 2.0 Token Introspection ([RFC 7662](https://tools.ietf.org/html/rfc7662)). The two specifications are a powerful combination. They give us both the ability to kill a token and a way to safely confirm it's dead. The sooner we can teach developers to determine if a token is active, the safer all of our systems are.

Next, we should use finely grained scopes (aka permissions). In our [Recommended Practices for API Access Management](https://developer.okta.com/use_cases/api_access_management/#authorization-server), we note that a generic "admin" scope is rarely appropriate. Your scopes should be specific to your use case. If your use case is downloading today's data for reporting, your scope should be read only and restricted to that specific data. If your use case involves moving money or reading health information, the scopes should be unique and more fine-grained. Now a compromised token is less valuable to an attacker and less devastating for you.

Finally, we need to expire our tokens frequently. At first glance, this seems wrong. After all, a long-lived token allows a user to accomplish everything they need. But remember, we have a solution for that: the refresh token! The refresh token allows an application to return to the OAuth server and get a new access token. More importantly, it can be revoked just like an access token. If your tokens are compromised, you revoke them and the refresh token exchange fails. The attacker is locked out.

The only open question is "what's a good access token lifetime?" My general rule is that a use case involving spending or moving money; modifying health, insurance, or financial data; or updating contact information or credentials should have an extremely short lifetime on the order of minutes. And even within that, we may need flexibility. For example, sending $10 to a friend for lunch is not the same as transferring $10,000 to purchase a car. For more mundane or read-only use cases, a longer lifetime is acceptable.

## It's not OAuth's Fault

As much as we'd like to blame our tools or the technology, it's not their fault. Odds are, we skimmed the spec or read a great howto without really understanding the incantations precautions required.

***We only decided that we could. We never asked if we should.***

To protect ourselves, our systems, and our customers, we need to prepare for the worst and hope for the best.

{% img blog/stolen-access-tokens/looking-good.jpg alt:"looking good" width:"800" %}{: .center-image }
