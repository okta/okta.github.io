---
layout: blog_post
title: "Securing REST APIs"
author: les-hazlewood
description: "A short discussion about REST API security best practices."
tags: [rest, security, apis]
tweets:
- "Securing a REST API? Here are some best practices!"
- "Check out these REST API security tips from @lhazlewood -- our resident REST API security expert:"
- "Just published a REST API security article. Be sure to check it out >:D #security #apis"
image: blog/featured/okta-java-skew.jpg
---

When machines ask each other for information online, they don't need elaborate browser interfaces or clickable buttons. They just need raw data in a machine-readable format. Today, many applications get the data they need via a REST API--a powerful way of serving up information online that underpins many modern online services.

Like any technology, REST APIs bring their own unique security challenges. The question that remains is how to reduce those vulnerabilities.

## What is a REST API?

REST stands for Representational State Transfer, and it's more of an approach to design and communication than a single tool or programming library. RESTful programming is stateless and provides a uniform interface, commonly using HTTP-based URLs with query parameters that mask the back-end infrastructure from the user. Responses typically come back as simple JSON-based key/value pairs, but APIs can support any type of content, including XML, test documents, or even images. Front-end software can then serve that data up in a format appropriate for the user.

REST APIs are the glue that holds the modern cloud-based software economy together. They can serve straightforward information, even from a large data set. Your software can query Amazon's API to get product pricing, for example, or get a geographic location from Google Maps. Alternatively, it can query a complex back-end service requiring lots of computing power. You want a service to tag a photograph with descriptive words or recognize someone's face? Microsoft's REST-based API does that.

All those examples have something in common: they provide access to information that would be impossible or prohibitively expensive for an individual company to build on its own. Companies can take that third-party information and use it to create new applications that would have been out of reach before. Of course, many of those third-parties charge for the privilege, pricing their API by query volume or by the feature set that a customer uses.

That data needs to be secure, though. A poorly protected API can be a major point of vulnerability for an organization, particularly those handling sensitive data. Making public pricing data available to anyone via an API call for convenience is fine. Letting everyone query patient records at your medical clinic? Not so much.

## How do you secure a REST API?

The first step in securing an API is to ensure that you only accept queries sent over a secure channel, like TLS (formerly known as SSL). Communicating with a TLS certificate protects all access credentials and API data in transit using end-to-end encryption.

API keys are another step toward securing a REST API. You can use them for authentication. You can also use them to track an account's usage of an API, enabling you to charge by volume and features. An API key is a unique string that serves as the access credential for the API, and you'll often create it manually using a web interface to the service that you're querying.

The problem with API keys is that they're supposed to be secret, but often aren't. Once someone else sees it, you have to revoke it (assuming you know it's compromised). Just ask GitHub, which [saw users leaking thousands of new API keys every day](https://nakedsecurity.sophos.com/2019/03/25/thousands-of-coders-are-leaving-their-crown-jewels-exposed-on-github/) through exposed repositories.

An alternative form of authentication for REST APIs are tokens. Tokens are typically used by client-side apps and issued by the server. Token authentication differs from cookie-based session management in that it's typically stateless, allowing you to avoid the need to store session details on the server. This makes it easier to scale out back-end systems using cloud infrastructure, which is exactly what REST APIs are suitable for.

OAuth 2 is a secure token-based authentication mechanism that you can use in an API for secure user authentication and authorization. After initially authorizing a requesting party with passwords or API keys, it then issues an access token. A common token architecture you can use along with OAuth 2 is the JSON Web Token (JWT). JWTs are digitally-signed authentication tokens containing JSON-formatted data about the user.

JWTs can hold more data than traditional API keys thanks to a feature called claims, which is a set of key/value pairs. These key/value pairs hold information such as the token's expiry date (`exp`), the issuer (`iss`), the audience for the token (`aud`), and the earliest time and date to use it (`nbf', or not before time). The claims feature is extensible, so you can create custom claims that you agree with other parties.

That's useful when federating identity with JWTs. If another online service trusts yours, it can accept a JWT that you already issued for one of your users without ID verification. Given the propensity for developers to mash up multiple REST APIs in a single application, federation is a neat use case for this token-based system.

## What are some best practices for developing and testing a REST API?

Rock-solid authentication mechanisms are the beginning for REST API security, but not the end. There are other security best practices to consider during development.

Always use TLS and a security framework that's well-established and has a large community behind it.

Validate parameter-based inputs for queries. Attackers can change URL parameters, JSON request data, and XML input. Fuzzers can pummel REST APIs with subtle input changes, so be diligent here.

Provide another layer of defence by whitelisting permitted HTTP methods (for example GET, POST, and PUT), and blocking by default those that you might never want someone to access via a public API (like DELETE). Similarly, authenticate individual users for specific actions. You might allow external users a single query, but not the ability to export all data, for example.  

Log all failed requests and look for patterns to identify sustained attacks. Also, send relevant error messages with appropriate HTTP status codes to help developers connecting to your service.

Perhaps one of the most important best practices is not to roll your own REST API security. Use an established security framework that applies policies to decide whether the querying party can see the data.

You can create your own REST API using existing SDKs specific to the application framework you're using. Pythonistas can use Flask or Django, while Java folks can use Spring. These have some security features built-in.

## How does Okta use or implement REST APIs?

Okta's core authentication service is a REST API, which serves a variety of client types. Our mobile applications access it, and we have also created user interfaces that consume API responses and display them in a browser. The Okta API provides functions including multi-factor enrollment and verification, password recovery, and account unlocking. 

You can use [our REST API](/signup/) to provide identity services for your own applications. If you have an API of your own that you want to protect, you can use our API Access Management service to authenticate access to your own APIs.

## Conclusion

REST APIs have lowered the friction that developers used to face when building applications that used remote services. As a de facto approach to sharing and consuming services, they've opened up a world of opportunities for startups to build powerful new online services with minimal upfront cost. But whenever you reduce friction, you introduce security dangers. Use APIs to their fullest extent--just be sure you tick all the security boxes along the way.

**Learn More**

Has this article piqued your interest in REST APIs and authentication? Here is some related content from the Okta developer blog.

- [Build a REST API Using Java, MicroProfile, and JWT Authentication ](https://developer.okta.com/blog/2019/07/10/java-microprofile-jwt-auth)
- [Create a Secure Spring REST API ](https://developer.okta.com/blog/2018/12/18/secure-spring-rest-api)
- [Why JWTs Suck as Session Tokens ](https://developer.okta.com/blog/2017/08/17/why-jwts-suck-as-session-tokens)
