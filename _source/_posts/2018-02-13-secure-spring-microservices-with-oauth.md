---
layout: blog_post
title: "Secure a Spring Microservices Architecture with OAuth"
author: mraible
tags: [spring, spring boot, microservices, oauth, spring security, java]
tweets:
- "Did you know you can secure your @springboot microservices using OAuth and Okta? → "
- "Feel the heat? A lot of the 🔥 in the #Java ecoysystem is coming from Spring Boot. Learn how to 🔒 it down with @SpringSecurity, OAuth and Okta! "
- "Spring Boot Microservices + @SpringSecurity + @oauth_2 + @okta = 😀! "
---

Building a microservices architecture with Spring Boot and Spring Cloud can allow your team to scale and develop software faster. It can provide resiliency and elasticity to your architecture that allows it to fail gracefully and scale infinitely. All this is great, but you really need continuous deployment and excellent security to ensure your system stays up-to-date, healthy, and safe for years to come.

Did you know that Spring Security and its OAuth support provide everything you need to lock down your API gateway, as well as your backend servers? You can set it up to automatically propogate your access tokens from one app to the other, ensuring that everything stays secure and encrypted along the way.

This tutorial shows you how to use Spring Security with OAuth and Okta to lock down your microservices architecture. You might remember a similar post I wrote back in August: [Secure a Spring Microservices Architecture with Spring Security, JWTs, Juiser, and Okta](/blog/2017/08/08/secure-spring-microservices). The difference in this post is you won't be using any Okta SDKs, Spring Security OAuth has everything you need!

This tutorial shows you how to add security to a previous tutorial I wrote, [Build a Microservices Architecture for Microbrews with Spring Boot](/blog/2017/06/15/build-microservices-architecture-spring-boot). A basic microservices architecture with Spring Boot and Spring Cloud looks like the graphic below. 

{% img blog/microservices-spring-oauth/spring-microservices-diagram.png alt:"Spring Boot + Cloud Microservices Architecture" width:"700" %}{: .center-image }

Once you've completed this tutorial, you'll have Spring Security locking things down, and Okta providing authorization with OAuth. Your Edge Service (a.k.a., API Gateway) will have a Feign client that passes along your access token, and Hystrix that handles graceful failover.

{% img blog/microservices-spring-oauth/spring-oauth-microservices-diagram.png alt:"Spring Microservices with OAuth" width:"800" %}{: .center-image }

To begin, you’ll need to clone the aforementioned article’s completed project.

```
git clone https://github.com/oktadeveloper/spring-boot-microservices-example.git
```

