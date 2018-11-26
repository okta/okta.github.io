---
layout: blog_post
title: REST Service Authorization with JWTs
author:
- jon_todd
- william_dawson
tags: [rest, oauth, identity, security, jwt]
---

Many companies are adopting micro-services based architectures to promote
decoupling and separation of concerns in their applications. One inherent
challenge with breaking applications up into small services is that now each
service needs to deal with authenticating and authorizing requests made to it.
[Json Web Tokens (JWTs)](https://tools.ietf.org/html/rfc7519) offer a clean
solution to this problem along with
[TLS client authentication]({% post_url 2015-12-02-tls-client-authentication-for-services %})
lower down in the stack.

Wils Dawson and I presented these topics to the [Java User Group](http://www.meetup.com/sfjava/)
at Okta's HQ in December and are thrilled to offer the
[slides](http://www.slideshare.net/JonTodd1/rest-service-authetication-with-tls-jwts),
[code](https://github.com/wdawson/dropwizard-auth-example), and the following
recording of the presentation. In the talk, we cover authentication and
authorization both at a server level with TLS and a user level with OAuth 2.0.
In addition, we explain claims based auth and federation while walking through
demos for these concepts using Java and Dropwizard. We purposely skipped over
client (e.g. browser) side authentication as it's enough material for a future
talk and focused on solutions for authentication and authorization between
services within an application.

<iframe src="https://player.vimeo.com/video/150714428" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
