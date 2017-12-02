---
layout: blog_post
title: "Get Started with OIDC and Spring Security 5.0"
author: mraible
tags: [java, spring-security, spring-boot, springframework, oidc, spring-webflux]
---

Spring Security is a powerful and highly customizable authentication and access-control framework. It is the de-facto standard for securing Spring-based applications. 

I first encountered Spring Security when it was called Acegi Security in 2005. I had implemented standard Java EE in my open source project, AppFuse. Acegi Security offered a lot more, including remember me and password encryption as standard features. I had managed to get remember me working with Java EE, but it wasn't very clean. I first wrote about [migrating to Acegi Security](https://raibledesigns.com/rd/entry/using_acegi_security_with_appfuse) in January 2005. 
 
I have to admit, it seemed awful at first. Even though it provided more functionality than Java EE authentication, it required reams of XML to configure everything. 

In 2012, I was still using XML when I [upgraded to Spring Security 3.1](http://raibledesigns.com/rd/entry/upgrading_appfuse_to_spring_security). Then Spring Boot came along in 2014 and changed everything. 

These days, Spring Security offers *much* simpler configuration via Spring's JavaConfig. If you look at the [`SecurityConfiguration.java`](https://github.com/mraible/jhipster-oidc-example/blob/master/src/main/java/com/okta/developer/config/SecurityConfiguration.java) class from the [JHipster OIDC example](https://github.com/mraible/jhipster-oidc-example) I [wrote about](/blog/2017/10/20/oidc-with-jhipster) recently, you'll see it's less than 100 lines of code! 

This [release](https://spring.io/blog/2017/11/28/spring-security-5-0-0-release-released) resolves 400+ tickets, and has a [plethora of new features](https://docs.spring.io/spring-security/site/docs/5.0.0.RELEASE/reference/htmlsingle/#new):

* [OAuth 2.0 Login](https://docs.spring.io/spring-security/site/docs/5.0.0.RELEASE/reference/htmlsingle/#jc-oauth2login)
* Reactive Support
** [@EnableWebFluxSecurity](https://docs.spring.io/spring-security/site/docs/5.0.0.RELEASE/reference/htmlsingle/#jc-webflux)
** [@EnableReactiveMethodSecurity](https://docs.spring.io/spring-security/site/docs/5.0.0.RELEASE/reference/htmlsingle/#jc-erms)
** [WebFlux Testing Support](https://docs.spring.io/spring-security/site/docs/5.0.0.RELEASE/reference/htmlsingle/#test-webflux)
* Modernized [Password Encoding](https://docs.spring.io/spring-security/site/docs/5.0.0.RELEASE/reference/htmlsingle/#core-services-password-encoding)

Today, I'll be showing you how to utilize the OAuth 2.0 Login support with Okta.

You know that Okta offers [free developer accounts](https://developer.okta.com/pricing/) with up to 7,000 active monthly users, right? That should be enough to get your killer app of the ground. 

Spring Security makes authentication with OAuth 2.0 pretty darn easy. It also provides the ability to fetch a user's information via OIDC. Follow the steps below to learn more!