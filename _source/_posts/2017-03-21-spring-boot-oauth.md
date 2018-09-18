---
layout: blog_post
title: Get Started with Spring Boot, OAuth 2.0, and Okta
author: mraible
description: "In this tutorial you'll learn how to integrate Spring Security into a Spring Boot application, plus add authentication with OAuth using the Okta API."
tags: [spring-boot, oauth, okta]
---

If you're building a Spring Boot application, you'll eventually need to add user authentication. You can do this with OAuth 2.0 (henceforth: OAuth). OAuth is a standard that applications can use to provide client applications with "secure delegated access". It works over HTTP and authorizes devices, APIs, servers, and applications with access tokens rather than credentials.

Very simply, OAuth is a protocol that supports authorization workflows. It gives you a way to ensure that a specific user has specific permission.

OAuth doesn't validate a user's identity — that's taken care of by an authentication service like Okta. Authentication is when you validate a user's identity (like asking for a username / password to log in), whereas authorization is when you check to see what permissions an existing user already has.

In this tutorial you'll build an OAuth client for a Spring Boot application, plus add authentication with the Okta API. You can sign up for a [forever-free Okta developer account here](https://developer.okta.com/signup/).

If you don't want to code along, feel free to grab the [source code from GitHub](https://github.com/oktadeveloper/okta-spring-boot-oauth-example)! You can also watch a video of this tutorial below.

<div style="text-align: center">
<iframe width="600" height="338" style="max-width: 100%" src="https://www.youtube.com/embed/TaZqDrwBWwA" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>

## Get Started with Spring Cloud

Spring Cloud Security is a project from the good folks at Pivotal that "offers a set of primitives for building secure applications and services with minimum fuss". Not only is it easy to use in platforms like Cloud Foundry, but it builds on Spring Boot, Spring Security, and [OAuth](https://www.oauth.com/). Because it builds on OAuth, it's easy to integrate it with an authentication API like Okta's.

The Spring Cloud Security project includes a [great quickstart](https://github.com/spring-cloud/spring-cloud-security/blob/master/docs/src/main/asciidoc/quickstart.adoc) that will help you get started with very few lines of code.

## Create a Secure Spring Boot App

Creating a Spring Boot application is dirt simple if you use the Spring CLI. It allows you to write Groovy scripts that get rid of the boilerplate Java and build file configuration. This allows you, the developer, to focus on the necessary code. Refer to the project's [official documentation for installation instructions](https://docs.spring.io/spring-boot/docs/current/reference/html/getting-started-installing-spring-boot.html#getting-started-installing-the-cli). To install Spring CLI, I recommend using [SDKMAN!](https://docs.spring.io/spring-boot/docs/current/reference/html/getting-started-installing-spring-boot.html#getting-started-sdkman-cli-installation):

```bash
sdk install springboot
```

Or [Homebrew](https://docs.spring.io/spring-boot/docs/current/reference/html/getting-started-installing-spring-boot.html#getting-started-homebrew-cli-installation) if you're on a Mac.

```bash
brew tap pivotal/tap
brew install springboot
```

Create a `helloWorld.groovy` file that has a Controller in it.

```groovy
@Grab('spring-boot-starter-security')
@RestController
class Application {

  @RequestMapping('/')
  String home() {
    'Hello World'
  }
}
```

The `@Grab` annotation invokes [Grape](http://docs.groovy-lang.org/latest/html/documentation/grape.html) to download dependencies and having Spring Security in the classpath causes its default security rules to be used. That is, protect everything, allow a user with the username `user`, and generate a random password on startup for said user.

Run this app with the following command:

```bash
spring run helloWorld.groovy
```

Navigate to `http://localhost:8080` and you'll be prompted to login with your browser's basic authentication dialog. Enter `user` for the username and copy/paste the generated password from your console. If you copied and pasted the password successfully, you'll see `Hello World` in your browser.

{% img blog/spring-boot-oauth/hello-world.png alt:"Hello World" width:"800" %}{: .center-image }

### Get Your Authorization Server Settings

Log in to your Okta account and navigate to **API** > **Authorization Servers** in the top menu. There should be a "default" server listed with an audience and issuer URI specified.

{% img blog/spring-boot-oauth/default-as-server.png alt:"Default AS" width:"700" %}{: .center-image }

The Metadata URI you see in this screenshot will come in handy later when you need to specify `accessTokenUri` and `userAuthorizationUri` values.

## Create an OpenID Connect App in Okta

To get a client id and secret, you need to create a new OpenID Connect (OIDC) app. Navigate to **Applications** and click on **Add Application**. Select **Web** and click **Next**. Give the application a name (e.g. "My OIDC App") and specify `http://localhost:8080/login` as a Login redirect URI. Click **Done** and admire your handiwork!

{% img blog/spring-boot-oauth/oidc-settings.png alt:"My OIDC App" width:"700" %}{: .center-image }

Your `clientId` and `clientSecret` values for this app will be just below the fold.

## Create a Spring Boot OAuth Client

Create a `helloOAuth.groovy` file that uses Spring Security and its [OAuth 2.0 support](https://spring.io/guides/tutorials/spring-boot-oauth2/).

```groovy
@Grab('spring-boot-starter-security')
@Grab('org.springframework.security.oauth.boot:spring-security-oauth2-autoconfigure:2.0.1.RELEASE')

import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso

@RestController
@EnableOAuth2Sso
class Application {

  @GetMapping('/')
  String home() {
    'Hello World'
  }
}
```

Adding the `@EnableOAuth2Sso` annotation causes Spring Security to look for a number of properties. Create `application.yml` in the same directory and specify the following key/value pairs.

```yaml
security:
  oauth2:
    client:
      # From OIDC app
      clientId: {clientId}
      clientSecret: {clientSecret}
      # From Authorization Server's metadata
      accessTokenUri: https://{yourOktaDomain}/oauth2/default/v1/token
      userAuthorizationUri: https://{yourOktaDomain}/oauth2/default/v1/authorize
      clientAuthenticationScheme: form
      scope: openid profile email
    resource:
      # from your Auth Server's metadata, check .well-known/openid-configuration if not in .well-known/oauth-authorization-server
      userInfoUri: https://{yourOktaDomain}/oauth2/default/v1/userinfo
```

Start your app with `spring run helloOAuth.groovy` and navigate to `http://localhost:8080`. You'll be redirected to Okta to login.

{% img blog/spring-boot-oauth/okta-login.png alt:"Okta Login" width:"800" %}{: .center-image }

If you're already logged in, you should be redirected back to your app. If it works - congrats!

You can make one additional change to the `helloOAuth.groovy` file to prove it's really working: change the `home()` method to return `Hello $name` where `$name` is from `javax.security.Principal`.

```groovy
@GetMapping('/')
String home(java.security.Principal user) {
  'Hello ' + user.name
}
```

This should result in your app showing a result like the following.

{% img blog/spring-boot-oauth/login-success.png alt:"Success" width:"800" %}{: .center-image }

## Get the Source Code

The source code for this tutorial and the examples in it are available [on GitHub](https://github.com/oktadeveloper/okta-spring-boot-oauth-example).

## Summary

This tutorial showed you how to use Spring CLI, Groovy, Spring Boot, Spring Security, and Okta to quickly prototype an OAuth client. This information is useful for those that are developing a Spring MVC application with traditional server-rendered pages. However, these days, lots of developers are using JavaScript frameworks and mobile applications to build their UIs.

In a [future tutorial](/blog/2017/09/19/build-a-secure-notes-application-with-kotlin-typescript-and-okta), I'll show you how to develop one of these fancy UIs in Angular and use the access token retrieved to talk to a Spring Boot API that's secured by Spring Security and does JWT validation.

**Changelog:**

* May 24, 2018: Added `spring-security-oauth2-autoconfigure` as a dependency, which is necessary for Spring Boot 2.0. You can see the changes in this article in [this pull request](https://github.com/okta/okta.github.io/pull/2074), and changes in the example app in [okta-spring-boot-oauth-example#4](https://github.com/oktadeveloper/okta-spring-boot-oauth-example/pull/4).
* Feb 2, 2018: Added more information to `application.yml` so it's easier to copy and paste.
* Oct 20, 2017: Added missing `scope: openid profile email` to `application.yaml`.
* Oct 11, 2017: Updated instructions for the [Okta Developer Console](/blog/2017/09/25/all-new-developer-console).



