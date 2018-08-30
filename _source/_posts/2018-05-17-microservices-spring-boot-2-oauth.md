---
layout: blog_post
title: "Build and Secure Microservices with Spring Boot 2.0 and OAuth 2.0"
author: mraible
description: "This shows how to create a secure microservices architecture with Spring Boot 2.0 and OAuth. It contains YouTube tutorials so you can learn how to do it all in 30 minutes!"
tags: [microservices, spring-boot, spring-security, oauth, youtube, screencast]
tweets:
 - "Wanna get up to speed on building a @java microservices architecture? 🎥 Watch @mraible build secure microservices with @springboot 2.0 and #oauth."
 - "You've built your microservices architecture with @springboot, but now you want to use an identity provider like @okta? @SpringSecurity does the hard work for you!"
---

Spring Boot has experienced massive adoption over the last several years. For Spring users, it offers a breath of fresh air, where they don't have to worry about how things are configured if they're comfortable with defaults. The Spring Boot ecosystem is filled with a wealth of what they call _starters_. Starters are bundles of dependencies that autoconfigure themselves to work as a developer might expect.

Spring Boot allows you to create standalone web apps, CLIs, batch processes, and microservices. When you get into microservices, you'll find that Spring Cloud helps autoconfigure the tools you want in your microservices architecture.

As we all know by now, pretty much every application depends upon a secure identity management system. For most developers who are getting started with new Spring Boot 2.0 apps, there's a decision to be made between rolling your own authentication and authorization system or plugging in a service like Okta. Before we dive into our Spring Boot 2.0 application, I want to tell you a bit about Okta, and why I think it's an excellent solution for all Java developers.

## What is Okta?

In short, we make [identity management](https://developer.okta.com/product/user-management/) a lot easier, more secure, and more scalable than what you're probably used to. Okta is a cloud service that allows developers to create, edit, and securely store user accounts and user account data, and connect them with one or multiple applications. Our API enables you to:

* [Authenticate](https://developer.okta.com/product/authentication/) and [authorize](https://developer.okta.com/product/authorization/) your users
* Store data about your users
* Perform password-based and [social login](https://developer.okta.com/authentication-guide/social-login/)
* Secure your application with [multi-factor authentication](https://developer.okta.com/use_cases/mfa/)
* And much more! Check out our [product documentation](https://developer.okta.com/documentation/)

Are you sold? [Register for a forever-free developer account](https://developer.okta.com/signup/), and when you're done, come on back so we can learn more about building secure microservices in Spring Boot 2.0!

## Get Started with Spring Boot 2.0 for Your Microservices Architecture

To help celebrate this new release, I took the time to update a few of our blog posts to use 2.0. The first one I updated was [Build a Basic CRUD App with Angular 5.0 and Spring Boot 2.0](/blog/2017/12/04/basic-crud-angular-and-spring-boot).

The other two I updated show you how to build and secure microservices with OAuth 2.0.

* [Build a Microservices Architecture for Microbrews with Spring Boot](/blog/2017/06/15/build-microservices-architecture-spring-boot)
* [Secure a Spring Microservices Architecture with Spring Security and OAuth 2.0](/blog/2018/02/13/secure-spring-microservices-with-oauth)

If you're using Spring Boot 1.x, I encourage you to try Spring Boot 2.x. The three posts I mentioned above show you it's possible to use with our [Angular SDK](https://www.npmjs.com/package/@okta%2Fokta-angular), and our [Sign-In Widget](https://developer.okta.com/code/javascript/okta_sign-in_widget). In fact, each blog post has a link to its GitHub repo, which has a README that explains what you need to do to get started.

It's not too hard, so I'll break it down for you:

1. Create a `Web` application in Okta with your [developer account](https://developer.okta.com/signup/).
2. Update a file or two to use your client ID/secret instead of mine, or set environment variables that match Spring Security's property names.
3. Run the apps and rejoice!

If a picture is worth a thousand words, [a video is worth 1.8 million words](https://idearocketanimation.com/4293-video-worth-1-million-words/). For this reason, I created a screencast showing how to build a microservices architecture for microbrews with Spring Boot.

<div style="text-align: center">
<iframe width="700" height="394" style="max-width: 100%" src="https://www.youtube.com/embed/IsVgIuUcMQQ" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>

I also created a screencast that shows how to secure this architecture with OAuth 2.0 and Okta.

<div style="text-align: center">
<iframe width="700" height="394" style="max-width: 100%" src="https://www.youtube.com/embed/MY5m_s_U2H4" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>

## What About Spring WebFlux?

One of the most significant additions in Spring Boot 2.0 is a new reactive web framework called Spring WebFlux. WebFlux allows you to create non-blocking web apps that perform better with high load. For proof, see [Reactive vs. Synchronous Performance Test with Spring Boot 2.0](https://dzone.com/articles/spring-boot-20-webflux-reactive-performance-test).

All of the examples above are written with Spring MVC, not WebFlux. This was primarily because I believe Spring MVC is the right choice for most developers that are just starting out. It's also because Spring Security's OAuth support didn't work with Spring WebFlux. That is, until last week!

<div style="max-width: 500px; margin: 0 auto">
<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Stayed up a little too late tonight, but I think <a href="https://twitter.com/starbuxman?ref_src=twsrc%5Etfw">@starbuxman</a> and <a href="https://twitter.com/mraible?ref_src=twsrc%5Etfw">@mraible</a> will approve. Spring Security now has WebFlux + OAuth2 log in <a href="https://t.co/42f11y979n">https://t.co/42f11y979n</a></p>&mdash; Rob Winch (@rob_winch) <a href="https://twitter.com/rob_winch/status/994871039669792768?ref_src=twsrc%5Etfw">May 11, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

Josh Long and I had a fun time demoing this functionality at the SpringOne Tour in Denver just a few days ago.

<div style="max-width: 500px; margin: 0 auto">
<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Wahoo! <a href="https://twitter.com/starbuxman?ref_src=twsrc%5Etfw">@starbuxman</a> and I demo&#39;d it yesterday and today it&#39;s released! <a href="https://twitter.com/SpringSecurity?ref_src=twsrc%5Etfw">@SpringSecurity</a> + Spring WebFlux + OAuth = awesome-sauce 🎉😃 <a href="https://t.co/UqUNC0pRHx">https://t.co/UqUNC0pRHx</a><br><br>Example app: <a href="https://t.co/PG3VN36VkS">https://t.co/PG3VN36VkS</a><a href="https://twitter.com/hashtag/springsecurity?src=hash&amp;ref_src=twsrc%5Etfw">#springsecurity</a> <a href="https://twitter.com/hashtag/springframework?src=hash&amp;ref_src=twsrc%5Etfw">#springframework</a> <a href="https://twitter.com/hashtag/spring?src=hash&amp;ref_src=twsrc%5Etfw">#spring</a> <a href="https://twitter.com/hashtag/java?src=hash&amp;ref_src=twsrc%5Etfw">#java</a> <a href="https://twitter.com/hashtag/oauth?src=hash&amp;ref_src=twsrc%5Etfw">#oauth</a> <a href="https://twitter.com/hashtag/oidc?src=hash&amp;ref_src=twsrc%5Etfw">#oidc</a> <a href="https://twitter.com/hashtag/security?src=hash&amp;ref_src=twsrc%5Etfw">#security</a> <a href="https://t.co/pbtS2EYn6O">https://t.co/pbtS2EYn6O</a></p>&mdash; Matt Raible (@mraible) <a href="https://twitter.com/mraible/status/996393640829255680?ref_src=twsrc%5Etfw">May 15, 2018</a></blockquote>
</div>

## Spring WebFlux + OAuth 2.0 + Okta

I did some experimenting with the latest bits from Spring Security's GitHub repo and was able to make an example work with Okta. I found that the configuration for WebFlux + OAuth 2.0 largely resembles [Spring Security's OIDC support](/blog/2017/12/18/spring-security-5-oidc). In fact, the configuration properties names are the same.

You can read more about the [Spring Security 5.1.0.M1 release](https://spring.io/blog/2018/05/15/spring-security-5-1-0-m1-released), or follow the steps below to use it in your Spring WebFlux application.

Here's what you need in your `application.yml`:

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          okta:
            client-id: {clientId}
            client-secret: {clientSecret}
        provider:
          okta:
            authorization-uri: https://{yourOktaDomain}/oauth2/v1/authorize
            token-uri: https://{yourOktaDomain}/oauth2/v1/token
            user-info-uri: https://{yourOktaDomain}/oauth2/v1/userinfo
            jwk-set-uri: https://{yourOktaDomain}/oauth2/v1/keys
```

You'll need to modify your `pom.xml` to add dependencies and upgrade Spring Security.

```xml
<properties>
    ...
    <spring-security.version>5.1.0.M1</spring-security.version>
</properties>

<dependencies>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-config</artifactId>
        <version>${spring-security.version}</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-oauth2-client</artifactId>
        <version>${spring-security.version}</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-oauth2-jose</artifactId>
        <version>${spring-security.version}</version>
    </dependency>
    ...
</dependencies>

<repositories>
    <repository>
        <id>spring-milestone</id>
        <name>Spring Milestone Repository</name>
        <url>http://repo.spring.io/milestone</url>
    </repository>
</repositories>
```

You'll also need to copy the auto-configuration classes into your project, along with the `spring.factories` file that configures them. GitHub's SVN support makes this possible with the following commands.

```bash
svn export https://github.com/spring-projects/spring-security/trunk/samples/boot/oauth2login-webflux/src/main/java/org src/main/java/org
svn export https://github.com/spring-projects/spring-security/trunk/samples/boot/oauth2login-webflux/src/main/resources/META-INF src/main/resources/META-INF
```

This step will not be necessary once Spring Security 5.1.0 is GA.

## Learn More About Spring Boot and Microservices

We have several tutorials on this blog about how to develop applications with Spring Boot, and how to secure microservices. Not much has changed if you're using Spring MVC. I encourage you to check out the following posts to learn how to use OAuth 2.0's client credentials flow, as well as how to test your Spring Boot apps.

* [Secure Server-to-Server Communication with Spring Boot and OAuth 2.0](/blog/2018/04/02/client-creds-with-spring-boot)
* [The Hitchhiker's Guide to Testing Spring Boot APIs and Angular Components with WireMock, Jest, Protractor, and Travis CI](/blog/2018/05/02/testing-spring-boot-angular-components)
* [Build a Microservices Architecture for Microbrews with Spring Boot](/blog/2017/06/15/build-microservices-architecture-spring-boot)

I hope you have a bootiful experience with Spring Boot 2.0. If you have any questions, please [hit me up on Twitter](https://twitter.com/mraible) or leave a comment below. If you want to get notified when new blog posts are published here, please follow [@oktadev](https://twitter.com/oktadev).
