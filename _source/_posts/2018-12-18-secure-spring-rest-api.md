---
layout: blog_post
title: 'Create a Secure Spring REST API'
author: raphaeldovale
description: "This article explains how to build a Spring REST API, a resource server, and how to connect it into your security environment."
tweets:
- "Want to build a Spring REST API with OAuth 2.0 with @java? Learn how to build a Resource Server in this handy tutorial!"
- "Avoid boilerplate! Create a Spring REST API and Resource Server with almost no code!"
tags: [spring rest, spring rest api, jwt, token auth, token authentication, java, spring boot, oauth2, resource server]
image: blog/featured/okta-java-short-tile-books-mouse.jpg
---

_"If it is useful, it will be modified."_ Those words of wisdom came from a QA teacher of mine, to explain that all software evolves when it becomes useful to someone, and for as long as it is useful. We all know this. Users ask us for new features, bug fixes and changes in domain logic every day. As any project (especially a monolith) grows it can begin to become difficult to maintain, and the barrier to entry for anyone new just gets higher and higher. In this tutorial, I'm excited to walk you through building a secure Spring REST API that tries to solve for some of these pain points using a microservices architecture.

In a microservices architecture, you logically divide your application into several apps that can be more easily maintained and scaled, use different stacks, and support more teams working in parallel. But microservices are the simple solution to every scaling and maintenance problem.

Microservices also present a number of architectural challenges that must be addressed: 

* How those services communicate? 
* How should communication failures and availability be handled? 
* How can a user's requests be traced between services? 
* And, how should you handle user authorization to access a single service?

Let's dig in and find out how to address these challenges when building a Spring REST API.

## Secure Your Spring REST API with OAuth 2.0

In [OAuth 2.0](https://www.oauth.com/oauth2-servers/the-resource-server/), a resource server is a service designed to handle _domain-logic_ requests and does not have any kind of login workflow or complex authentication mechanism: it receives a pre-obtained access token that guarantees a user have grant permission to access the server and delivers the expected response.

In this post, you are going to build a simple _Resource Server_ with Spring Boot and Okta to demonstrate how easy it is. You will to implement a simple _Resource Server_ that will receive and validate a _JWT Token_.

## Add a Resource Server Your Spring REST API

This example uses Okta to handle all authentication process. You can register for a [free-forever developer account](https://developer.okta.com/signup/) that will enable you to create as many users and applications you need.

I have set up some things so we can get started easily. Please clone the following resource repository and go to `startup` tag, as follows:

```bash
git clone -b startup https://github.com/oktadeveloper/okta-secure-secure-spring-rest-api-example secure-spring-rest-api
cd secure-spring-rest-api
```

This project has the following structure:

```bash
$ tree .
.
├── README.md
├── mvnw
├── mvnw.cmd
├── pom.xml
└── src
    ├── main
    │   ├── java
    │   │   └── net
    │   │       └── dovale
    │   │           └── okta
    │   │               └── secure_rest_api
    │   │                   ├── HelloWorldController.java
    │   │                   ├── SecureRestApiApplication.java
    │   │                   └── SecurityConfig.java
    │   └── resources
    │       └── application.properties
    └── test
        └── java
            └── net
                └── dovale
                    └── okta
                        └── secure_rest_api
                            └── SecureRestApiApplicationTests.java

14 directories, 9 files
```

I created it using the excellent [Spring Initializr](https://start.spring.io/) and adding `Web` and `Security` dependencies. Spring Initializr provides an easy way to create a new [Spring Boot](https://spring.io/projects/spring-boot) service with some common _auto-discovered_ dependencies. It also adds the [Maven Wrapper](https://github.com/takari/maven-wrapper): so you use the command `mvnw` instead of `mvn`, the tool will detect if you have the designated Maven version and, if not, it will download and run the specified command.

> **Fun fact**: Did you know the Maven wrapper was originally created by Okta's own [Brian Demers](https://twitter.com/briandemers)?! 

The file `HelloWorldController` is a simple `@RestController` that outputs "Hello World".

In a terminal, you can run the following command and see Spring Boot start:

```bash
mvnw spring-boot:run
```

**TIP:** If this command doesn't work for you, try `./mvnw spring-boot:run` instead.

Once it finishes loading, you'll have a REST API ready and set to deliver to you a glorious _Hello World_ message!

```bash
> curl http://localhost:8080/
Hello World
```

**TIP:** The `curl` command is not available by default for Windows users. You can download it from  [here](https://curl.haxx.se/windows/).

Now, you need to properly create a protected _Resource Server_.

## Set Up an OAuth 2.0 Resource Server

In the Okta dashboard, create an application of type **Service** it indicates a resource server that does not have a login page or any way to obtain new tokens. 

{% img blog/secure-spring-rest-api/create-new-service.png alt:"Create new Service" width:"800" %}{: .center-image }

Click **Next**, type the name of your service, then click **Done**. You will be presented with a screen similar to the one below. Copy and paste your  _Client ID_ and _Client Secret_ for later. They will be useful when you are configuring your application.

{% img blog/secure-spring-rest-api/service-created.png alt:"Service Created" width:"800" %}{: .center-image }

Now, let's code something!

Edit the `pom.xml` file and add dependencies for Spring Security and Okta. They will enable all the Spring AND Okta OAuth 2.0 goodness you need:

```xml
<!-- security - begin -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-oauth2</artifactId>
</dependency>
<dependency>
    <groupId>com.okta.spring</groupId>
    <artifactId>okta-spring-boot-starter</artifactId>
    <version>0.6.1</version>
</dependency>
<!-- security - end -->
```

By simply adding this dependency, your code is going to be like a locked house without a key. No one can access your API until you provide a key to your users. Run the command below again.

```bash
mvnw spring-boot:run
```

Now, try to access the Hello World resource:

```bash
> curl http://localhost:8080/
{"timestamp":"2018-11-30T01:35:30.038+0000","status":401,"error":"Unauthorized","message":"Unauthorized","path":"/"}
```

## Add Spring Security to Your REST API

Spring Boot has a lot of classpath magic and is able to discover _and_ automatically configure dependencies. Since you have added Spring Security, it automatically secured your resources. Now, you need to configure Spring Security so you can properly authenticate the requests.

> **NOTE:** If you are struggling, you can check the modifications in Git branch `step-1-security-dependencies`.

For that, you need to modify `application.properties` as follows (use _client_id_ and _client_secret_ provided by Okta dashboard to your application):

```properties
okta.oauth2.issuer=https://{yourOktaDomain}/oauth2/default
okta.oauth2.clientId={clientId}
okta.oauth2.clientSecret={clientSecret}
okta.oauth2.scopes=openid
```

Spring Boot uses annotations and code for configuring your application so you do not need to edit super boring XML files. This means you can use the Java compiler to validate your configuration!

I usually create configuration in different classes, each one have its own purpose. Create the class `net.dovale.okta.secure_rest_api.SecurityConfig` as follows:

```java
package net.dovale.okta.secure_rest_api;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;

@EnableWebSecurity
@EnableResourceServer
public class SecurityConfig  {}
````

Allow me to explain what the annotations here do:

* `@EnableWebSecurity` - tells spring we are going to use Spring Security to provide web security mechanisms
* `@EnableResourceServer` - convenient annotation that enables request authentication through OAuth 2.0 tokens. Normally, you would provide a `ResourceServerConfigurer` bean, but Okta's Spring Boot starter conveniently provides one for you.

That's it! Now you have a completely configured and secured Spring REST API without any boilerplate!

Run Spring Boot again and check it with cURL.

```bash
mvnw spring-boot:run
# in another shell
curl http://localhost:8080/
{"error":"unauthorized","error_description":"Full authentication is required to access this resource"}
```

The message changed, but you still without access... why? Because now the server is waiting for an `authorization` _header_ with a valid token. In the next step, you'll create an access token and use it to access your API.

> **NOTE:** Check the Git branch`step-2-security-configuration` if you have any doubt.

## Generate Tokens in Your Spring REST API

So... how do you obtain a token? A resource server has no responsibility to obtain valid credentials: it will only check if the token is valid and proceed with the method execution.

An easy way to achieve a token to generate one using [OpenID Connect \<debugger/>](https://oidcdebugger.com/).

First, you'll need to create a new **Web** application in Okta:

{% img blog/secure-spring-rest-api/create-new-web-application.png alt:"New web application" width:"800" %}{: .center-image }

Set the _Login redirect URIs_ field to `https://oidcdebugger.com/debug` and _Grant Type Allowed_ to `Hybrid`. Click **Done** and copy the client ID for the next step.

Now, on the OpenID Connect <debugger/> website, fill the form in like the picture below (do not forget to fill in the client ID for your recently created Okta web application):

{% img blog/secure-spring-rest-api/openid-connect.png alt:"OpenID connect" width:"700" %}{: .center-image }

Submit the form to start the authentication process. You'll receive an Okta login form if you are not logged in or you'll see the screen below with your custom token.

{% img blog/secure-spring-rest-api/openid-connect-token.png alt:"OpenID connect - getting token" width:"800" %}{: .center-image }

The token will be valid for one hour so you can do a lot of testing with your API. It's simple to use the token, just copy it and modify the curl command to use it as follows:

```bash
> export TOKEN=${YOUR_TOKEN}
> curl http://localhost:8080 -H "Authorization: Bearer $TOKEN"
Hello World
```

## Add OAuth 2.0 Scopes

OAuth 2.0 scopes is a feature that let users decide if the application will be authorized to make something restricted. For example, you could have "read" and "write" scopes. If an application needs the _write_ scope, it should ask the user this specific scope. These can be automatically handled by Okta's authorization server.

As a resource server, it can have different endpoints with different scope for each one. Next, you are going to learn how to set different scopes and how to test them.

Add a new annotation to your `SecurityConfig` class:

```java
@EnableWebSecurity
@EnableResourceServer
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {}
```

The new `@EnableGlobalMethodSecurity(prePostEnabled = true)` annotation tells Spring to use [AOP](https://en.wikipedia.org/wiki/Aspect-oriented_programming)-like method security and `prePostEnabled = true` will enable _pre_ and _post_ annotations. Those annotations will enable us to define security programmatically for each endpoint.

Now, make changes to `HelloWorldController.java` to create a _scope-protected_ endpoint:

```java
import org.springframework.security.access.prepost.PreAuthorize;
import java.security.Principal;
...
@PreAuthorize("#oauth2.hasScope('profile')")
@GetMapping("/protected/")
public String helloWorldProtected(Principal principal) {
    return "Hello VIP " + principal.getName();
}
```

Pay attention to `@PreAuthorize("#oauth2.hasScope('profile')")`. It says: before running this method, verify the request has authorization for the specified Scope. The `#oauth2` bit is added by [OAuth2SecurityExpressionMethods](https://docs.spring.io/spring-security/oauth/apidocs/org/springframework/security/oauth2/provider/expression/OAuth2SecurityExpressionMethods.html) (check the other methods available) Spring class and is added to your classpath through the `spring-cloud-starter-oauth2` dependency.

OK! After a restart, your server will be ready! Make a new request to the endpoint using your current token:

```bash
> curl http://localhost:8080/protected/ -H "Authorization: Bearer $TOKEN"
{"error":"access_denied","error_description":"Access is denied"}
```

Since your token does not have the desired scope, you'll receive an `access is denied` message. To fix this, head back over to [OIDC Debugger](https://oidcdebugger.com/debug) and add the new scope.

{% img blog/secure-spring-rest-api/openid-connect-profile-scope.png alt:"Profile scope" width:"700" %}{: .center-image }

Try again using the newly obtained token:

```bash
> curl http://localhost:8080/protected/ -H "Authorization: Bearer $TOKEN"
Hello VIP raphael@dovale.net
```

That's it! If you are in doubt of anything, check the latest repository branch `finished_sample`.

> **TIP:** Since `profile` is a common OAuth 2.0 scope, you don't need to change anything in your authorization server. Need to create a custom scope? See this [Simple Token Authentication for Java Apps](/blog/2018/10/16/token-auth-for-java#add-a-custom-scope).

## Learn More about Spring and REST APIs

In this tutorial, you learned how to use Spring (Boot) to create a resource server and seamlessly integrate it with OAuth 2.0. Both Spring and REST API's are huge topics, with lots to discuss and learn. 

The source code for this tutorial is [available on GitHub](https://github.com/oktadeveloper/okta-secure-secure-spring-rest-api-example). 

Here are some other posts that will help you further your understanding of both Spring and REST API security:

* [What the Heck is OAuth?](/blog/2017/06/21/what-the-heck-is-oauth)
* [Secure Server-to-Server Communication with Spring Boot and OAuth 2.0](/blog/2018/04/02/client-creds-with-spring-boot)
* [Spring Boot 2.1: Outstanding OIDC, OAuth 2.0, and Reactive API Support](/blog/2018/11/26/spring-boot-2-dot-1-oidc-oauth2-reactive-apis)
* [Add User Authentication to Your Spring Boot App in 15 Minutes](/blog/2018/10/05/build-a-spring-boot-app-with-user-authentication)

Like what you learned today? Follow us on [Twitter](https://twitter.com/oktadev), like us on [Facebook](https://www.facebook.com/oktadevelopers), check us out on [LinkedIn](https://www.linkedin.com/company/oktadev/), and subscribe to our [YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q).