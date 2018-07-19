---
layout: blog_post
title: '5 Tips for Building your Java API'
author: bdemers
tags: [spring, jaxrs, java, rest, tips, dropwizard]
---

Developers use APIs to for everything! You build APIs for your own apps to consume, or as a part of a microservices architecture. Bottom line, you're building and using APIs to make your life easier. The ongoing effort to simplify development and work more efficiently, sometimes this also means looking for new libraries or processes (or more often less process). For many teams managing authentication and access control for their apps and APIs is more work than it's worth, or simply not an efficient use of time, so we want to share a few tips that will save you time and code, along with making your applications more secure and easier to maintain.

For a bit of context: Okta at its core, is a Java-based REST+JSON API, built on the Spring Framework. We store user credentials and data on behalf of other companies, so for us security is paramount. Thus, my first requirement for these tips is that they help manage access to your Java API securely.

These tips should be universal to any type of Java application. They will help you move faster, write less code, and at the same time be more secure: a trifecta!

## 1. Don't roll your own security

Seriously, just don't, it's hard.

Almost everyone knows to avoid implementing their own cryptography. The rest of your security stack is no different, and the risk/reward just isn't worth it. There's a high chance you'll make some sort of mistake. Since 1999 there have been 89373 CVEs ([Common Vulnerabilities and Exposures](https://cve.mitre.org/)). And that's just what's been made public, many of those by very smart people.

You may think that dealing with a simple use case like validating a user's password is trivial, all you're doing is just comparing a couple strings after all. You would be wrong. You need to validate the password's hash, audit the attempt, mitigate against dictionary attacks, and that's just the tip of the iceberg. Your best bet is to use an existing library or a framework like [Apache Shiro](https://shiro.apache.org) or [Spring Security](https://projects.spring.io/spring-security/) and let the framework handle the complexities!

## 2. Use TLS, always!

It's 2017, everything should be HTTPS now, even the sites on your company's intranet. [Let's encrypt](https://letsencrypt.org/) makes this free and easy, which means you can stop using insecure self-signed keys too! You can even set up a local [Tomcat](https://community.letsencrypt.org/t/configuring-lets-encrypt-with-tomcat-6-x-and-7-x/32416) or [Nginx](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04) instance with a certificate.

Making your application require TLS (HTTPS/SSL) is usually a one liner, so everybody should be doing it!

For Apache Shiro, it is just property:
```ini
[urls]
/** = ssl
```

And Spring Security, a single method call when configuring an HttpSecurity:
```java
http.requiresChannel()
    .anyRequest().requiresSecure();
```

Or just use a [few properties](https://docs.spring.io/spring-boot/docs/1.5.10.RELEASE/reference/html/howto-embedded-servlet-containers.html#howto-configure-ssl) with Spring Boot:

```properties
server.port=8443
server.ssl.key-store=classpath:keystore.jks
server.ssl.key-store-password=secret
server.ssl.key-password=another-secret
```

## 3. Build your Java web service with Spring Boot

Spring Boot is an opinionated view of the Spring platform which makes it dead simple to write [twelve-factor apps](https://12factor.net/) in [very few lines](https://www.youtube.com/watch?v=yHtSwGn7doc). If you're still building WAR files you owe it to yourself to check this out. You can create complicated, application wide functions like setting up an OAuth resource server by using a single annotation (`@EnableResourceServer`) or change the server's port with a single property:
```ini
server.port = 8090
```

If Spring is not your bag, take a look at [Dropwizard](http://www.dropwizard.io/1.1.2/docs/) for an opinionated JAX-RS stack.

## 4. Use monitoring and metrics to watch your back

It's pretty difficult to pinpoint errors without any data. Spring Boot makes gathering metrics easy with [Actuator](https://spring.io/blog/2017/08/22/introducing-actuator-endpoints-in-spring-boot-2-0), just add a single dependency to your application.

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Then browse to `/health` or `/metrics` to view health checks or application metrics respectively. Dropwizard does the same thing with `/healthcheck` and `/metrics`.

Here's an output from a Spring Boot application's `/metrics` endpoint, out of the box:

```json
{
    "classes": 7704,
    "classes.loaded": 7704,
    "classes.unloaded": 0,
    "counter.status.200.metrics": 1,
    "gauge.response.metrics": 99.0,
    "gc.ps_marksweep.count": 2,
    "gc.ps_marksweep.time": 272,
    "gc.ps_scavenge.count": 8,
    "gc.ps_scavenge.time": 136,
    "heap": 3728384,
    "heap.committed": 470016,
    "heap.init": 262144,
    "heap.used": 207793,
    "httpsessions.active": 0,
    "httpsessions.max": -1,
    "instance.uptime": 25020,
    "mem": 529086,
    "mem.free": 262222,
    "nonheap": 0,
    "nonheap.committed": 60608,
    "nonheap.init": 2496,
    "nonheap.used": 59067,
    "processors": 8,
    "systemload.average": 5.56103515625,
    "threads": 24,
    "threads.daemon": 22,
    "threads.peak": 28,
    "threads.totalStarted": 32,
    "uptime": 37182
}

```

## 5. Protect your sensitive bits

People treat API keys insecurely, it's a fact of life. Keys get emailed around or checked into source control. Maybe this is because they seem more opaque than a password, I don't know, but they're just as sensitive, if not more so. If you need to store your API keys in a file, make sure there is limited access to that file. For example, we recommend storing our Okta yaml file in private directory `~/.okta/okta.yaml` and setting the file permissions to allow only the owner to read:

```bash
$ chmod u=r,go-rwx ~/.okta/okta.yaml
```

If you are creating API keys for users of your applications, plan to warn them. SSH ignores files in your `~/.ssh` directory if the permissions are not set correctly. Github does a great job of warning users by marking items in the UI with 'Danger Zone' marking.

<a href="https://www.youtube.com/watch?v=yK0P1Bk8Cx4" target="_blank">
{% img blog/five-java-tips/danger-zone.png alt:"Danger Zone" width:"640" %}
</a>

## Bonus: Write less code, give Okta a try!

Java has a bit of a reputation (and rightly so) for being verbose. All of the examples above show you how to write less code and when possible take advantage of existing libraries so you can focus on the code that will drive your business.

Shameless plug time: You can also write less code by [integrating Okta for fully featured user management](https://developer.okta.com/signup/). Just connect your apps, choose an IdP (or use ours), add users, configure rules, customize your login page, and then gain insights from our built-in reports. Want to see Okta in action? Check out these tutorials:

* [Build a Secure Notes Application with Kotlin, TypeScript, and Okta](https://scotch.io/tutorials/build-a-secure-notes-application-with-kotlin-typescript-and-okta)
* [Secure a Spring Microservices Architecture with Spring Security, JWTs, Juiser, and Okta](https://developer.okta.com/blog/2017/08/08/secure-spring-microservices)
* [What is OpenId Connect](https://developer.okta.com/blog/2017/07/25/oidc-primer-part-1)

And, as always, if you have any questions or comments you can hit me up on Twitter [@briandemers](https://twitter.com/briandemers), or follow our whole team [@oktadev](https://twitter.com/OktaDev).
