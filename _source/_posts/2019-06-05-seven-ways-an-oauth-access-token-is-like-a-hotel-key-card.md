---
layout: blog_post
title: "7 Ways an OAuth Access Token is like a Hotel Key Card"
author: aaronpk
description: "Learn 7 things OAuth 2.0 access tokens have in common with a hotel key card."
tags: [ oauth, accesstoken ]
tweets:
- "Here's 7 ways an #oauth access token is like a hotel key card"
- "Learn 7 things OAuth access tokens have in common with a hotel key card"
image: blog/hotel-key-card/hotel-clerk.jpg
---

What do OAuth 2.0 access tokens and hotel key cards have in common? It turns out quite a lot! A hotel key card is essentially a physical counterpart to an OAuth access token.

## You get a hotel key card by authenticating at the front desk

At a hotel, you check in at the front desk, show your ID card, and then you get a key card that you can use to get into your hotel room. In OAuth, the application sends the user over to the OAuth server where they authenticate (analogous to showing the ID card at the front desk), and the OAuth server will then issue an access token to the application.

{% img blog/hotel-key-card/hotel-clerk.jpg alt:"Photo of a hotel desk clerk handing a hotel key to the viewer" width:"800" %}{: .center-image }

## A hotel key can be used by anyone who can get a hold of it

If you give your hotel key to a friend, they can use your hotel key to get into your room. An OAuth access token works the same way, anyone who has the access token can use it to make API requests. That's the reason they're called "Bearer Tokens," since the bearer of the token can use it at the API.

When the hotel gives you the key card, it's your responsibility to keep it safe and not lose it. When an access token is given to an application, the OAuth server expects the app to keep it safe. This is typically done by storing the access token in some sort of secure storage available to the application.

The security around using these kinds of tokens relies on always making API requests over an HTTPS connection, ensuring that the token can't be intercepted in transit.

## A hotel key can be revoked by the hotel at any time

If you lose your key card, or if you get kicked out of the hotel for partying too hard, the hotel can revoke your key card immediately, and it will no longer open your hotel room door. If you suddenly find that your hotel key no longer works, your only course of action is to go back to the front desk, authenticate by showing your ID, and asking them to give you a new key card.

In OAuth, an authorization server can revoke an access token at any time for many different reasons. Many OAuth servers will provide a way for users to review and revoke applications that have access to their account. (Have you checked which apps have [access to your Twitter account](https://twitter.com/settings/sessions) lately?) Access tokens may also be revoked if the organization administrator decides to disable an application or disable a user account. 

## A hotel key has no meaning to the application using it

When you get a key card from the front desk clerk at the hotel, you don't need to worry about what data the magnetic stripe contains, or whether the key is RFID or NFC. All you care about is whether the door will open when you swipe the card.

An access token is similar from the point of view of the application using it. Access tokens come in many different flavors, such as random strings, JWTs, or proprietary self-encoded serializations, but none of that matters to the app. From the point of view of the app, the access token is just a string. It's a string that it can stick in the HTTP `Authorization` header and use to make API requests.

At the end of the day, the access token is being read by the API, not by the application using it, so it's only the API that needs to know how to find out information about the access token.

## A hotel key doesn't need to include your name or personal info

Most hotel key cards only include information about the door they can open and the times they can open the door. The simplest way to implement a hotel key is to securely encode the list of doors that the card can open and the date the access should expire. There is no need for the card to include any information about you, the guest.

OAuth access tokens are similar in that it's entirely possible to have a system where the access tokens don't actually include any information about the user that they are issued to. While access tokens can include arbitrary information like user IDs, email addresses, names, or other info, it's actually better if they include as little information as possible, to avoid this information getting out of sync or being accidentally leaked to applications.

## You can use a hotel key to access multiple doors

In addition to opening your hotel room, your hotel key may also open the front door of the hotel after hours, the hotel pool room, or the gym. Which doors the key can open will depend on the type of access you're granted within the hotel. If you're a Platinum Medallion Elite Pro status at your hotel, your key may also get you access to the executive lounge.

An OAuth access token may be able to be used at multiple different APIs depending on the scope granted to the application. For example, an app can request access to the Google Gmail API as well as the Contacts API, and the access token can be used at those two APIs but not on the Google Adwords API.

When you're developing your own API, keep this in mind. Try to find places that make sense to define scopes so that access tokens can be created that have only the bare minimum permissions required for the app to work. You can read more about [defining scopes on oauth.com](https://www.oauth.com/oauth2-servers/scope/defining-scopes/).

## A hotel key card expires at the end of your visit

When you get a hotel key, it's not like a regular physical key that will always open a certain door. Hotel keys will stop working at the end of your stay because the expiration of the access is encoded into the card.

An OAuth access token will expire after some amount of time defined by the authorization server. Access tokens can have a short lifetime, and applications will have to go back to the authorization server to get a new access token after their initial one expires. Using short-lived access tokens with long-lived refresh tokens provides a good balance between performance and security. You can read more about [access token lifetimes at oauth.com](https://www.oauth.com/oauth2-servers/access-tokens/access-token-lifetime/).

## Learn More about OAuth 2.0 and API Security

If you'd like to learn more about OAuth, check out the links below!

* [Why OAuth API Keys and Secrets Aren't Safe in Mobile Apps](/blog/2019/01/22/oauth-api-keys-arent-safe-in-mobile-apps)
* [Is the OAuth 2.0 Implicit Flow Dead?](/blog/2019/05/01/is-the-oauth-implicit-flow-dead)
* [What is the OAuth 2.0 Authorization Code Grant Type?](/blog/2018/04/10/oauth-authorization-code-grant-type)
* [OAuth 2.0 for Native and Mobile Apps](/blog/2018/12/13/oauth-2-for-native-and-mobile-apps)

If you have any questions about this post, please add a comment below. For more awesome content, follow [@oktadev](https://twitter.com/oktadev) or subscribe to [our YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q).
