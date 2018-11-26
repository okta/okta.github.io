---
layout: blog_post
title: "Get Started with Spring Security 5.0 and OIDC"
author: mraible
description: "Learn how to use Spring Security 5.0 and its OAuth 2.0 Login and OIDC support. Spring Security makes authentication with OAuth 2.0 pretty darn easy. It also provides the ability to fetch a user's information via OIDC. Follow this tutorial to learn more!"
tags: [java, spring-security, spring-boot, springframework, oidc, spring-webflux]
tweets:
  - "Did you know that Spring Security 5 supports OpenID Connect out-of-the-box? It's pretty sweet!"
  - "Spring Security 5 supports OAuth 2.0 Login: https://docs.spring.io/spring-security/site/docs/5.0.0.RELEASE/reference/htmlsingle/#jc-oauth2login.\n\nSee how it works with Okta →"
---

Spring Security is a powerful and highly customizable authentication and access-control framework. It is the de-facto standard for securing Spring-based applications.

I first encountered Spring Security when it was called Acegi Security in 2005. I had implemented standard Java EE in my open source project, AppFuse. Acegi Security offered a lot more, including remember me and password encryption as standard features. I had managed to get "remember me" working with Java EE, but it wasn't very clean. I first wrote about [migrating to Acegi Security](https://raibledesigns.com/rd/entry/using_acegi_security_with_appfuse) in January 2005.

I have to admit; it seemed awful at first. Even though it provided more functionality than Java EE authentication, it required reams of XML to configure everything.

In 2012, I was still using XML when I [upgraded to Spring Security 3.1](http://raibledesigns.com/rd/entry/upgrading_appfuse_to_spring_security). Then Spring Boot came along in 2014 and changed everything.

These days, Spring Security offers *much* simpler configuration via Spring's JavaConfig. If you look at the [`SecurityConfiguration.java`](https://github.com/mraible/jhipster-oidc-example/blob/master/src/main/java/com/okta/developer/config/SecurityConfiguration.java) class from the [JHipster OIDC example](https://github.com/mraible/jhipster-oidc-example) I [wrote about](/blog/2017/10/20/oidc-with-jhipster) recently, you'll see it's less than 100 lines of code!

[Spring Security 5.0](https://spring.io/blog/2017/11/28/spring-security-5-0-0-release-released) resolves 400+ tickets, and has a [plethora of new features](https://docs.spring.io/spring-security/site/docs/5.0.0.RELEASE/reference/htmlsingle/#new):

* [OAuth 2.0 Login](https://docs.spring.io/spring-security/site/docs/5.0.0.RELEASE/reference/htmlsingle/#jc-oauth2login)
* Reactive Support: [@EnableWebFluxSecurity](https://docs.spring.io/spring-security/site/docs/5.0.0.RELEASE/reference/htmlsingle/#jc-webflux), [@EnableReactiveMethodSecurity](https://docs.spring.io/spring-security/site/docs/5.0.0.RELEASE/reference/htmlsingle/#jc-erms), and [WebFlux Testing Support](https://docs.spring.io/spring-security/site/docs/5.0.0.RELEASE/reference/htmlsingle/#test-webflux)
* Modernized [Password Encoding](https://docs.spring.io/spring-security/site/docs/5.0.0.RELEASE/reference/htmlsingle/#core-services-password-encoding)

Today, I'll be showing you how to utilize the OAuth 2.0 Login support with Okta. I'll also show you to retrieve a user's information via OpenID Connect (OIDC).

You know that Okta offers [free developer accounts](https://developer.okta.com/pricing/) with up to 7,000 active monthly users, right? That should be enough to get your killer app off the ground.

Spring Security makes authentication with OAuth 2.0 pretty darn easy. It also provides the ability to fetch a user's information via OIDC. Follow the steps below to learn more!

> **What is OIDC?**
> If you're not familiar with OAuth or OIDC, I recommend you read [What the Heck is OAuth](/blog/2017/06/21/what-the-heck-is-oauth). An Open ID Connect flow involves the following steps:
>
> 1. Discover OIDC metadata
> 2. Perform OAuth flow to obtain ID token and access tokens
> 3. Get JWT signature keys and optionally dynamically register the Client application
> 4. Validate JWT ID token locally based on built-in dates and signature
> 5. Get additional user attributes as needed with access token
>
> {% img blog/oauth/oidc-flow.png alt:"OIDC Flow" width:"800" %}{: .center-image }

## Create a Spring Boot App

Open [start.spring.io](https://start.spring.io) in your browser. Spring Initialzr is a site that allows you to create new Spring Boot applications quickly and easily. Set the Spring Boot version (in the top right corner) to `2.0.0.M7`. Type in a group and artifact name. As you can see from the screenshot below, I chose `com.okta.developer` and `oidc`. For dependencies, select **Web**, **Reactive Web**, **Security**, and **Thymeleaf**.

{% img blog/spring-security-5/start.spring.io.png alt:"start.spring.io" width:"800" %}{: .center-image }

Click **Generate Project**, download the zip, expand it on your hard drive, and open the project in your favorite IDE. Run the app with `./mvnw spring-boot:run`, and you'll be prompted to log in.

{% img blog/spring-security-5/default-login.png alt:"Default Login" width:"700" %}{: .center-image }

Spring Security 4.x prompts you with basic authentication rather than with a login form, so this is one thing that's different with Spring Security 5.

The Spring Security starter creates a default user with username "user" and a password that changes every time you start the application. You can find this password in your terminal, similar to the one below.

```
Using default security password: 103c55b4-2760-4830-9bca-a06a87d384f9
```

In the form, enter "user" for the User and the generated password for Password. The next screen will be a 404 since your app doesn't have a default route configured for the `/` path.

{% img blog/spring-security-5/post-login.png alt:"Post Login" width:"700" %}{: .center-image }

In Spring Boot 1.x, you could change the user's password, so it's the same every time by adding the following to `src/main/resources/application.properties`.

```
security.user.password=spring security is ph@!
```

However, this is a deprecated feature in Spring Boot 2.0. The good news is this change will [likely be reverted before a GA release](https://github.com/spring-projects/spring-boot/issues/10963).

In the meantime, you can copy the password that's printed to your console and use it with [HTTPie](https://httpie.org/).

```bash
$ http --auth user:'bf91316f-f894-453a-9268-4826cdd7e151' localhost:8080
HTTP/1.1 404
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Content-Type: application/json;charset=UTF-8
Date: Sun, 03 Dec 2017 19:11:50 GMT
Expires: 0
Pragma: no-cache
Set-Cookie: JSESSIONID=65283FCBDB9E6EF1C0679290AA994B0D; Path=/; HttpOnly
Transfer-Encoding: chunked
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

The response will be a 404 as well.

```json
{
   "error": "Not Found",
   "message": "No message available",
   "path": "/",
   "status": 404,
   "timestamp": "2017-12-03T19:11:50.846+0000"
}
```

You can get rid of the 404 by creating a `MainController.java` in the same directory as `OidcApplication.java` (`src/main/java/com/okta/developer/oidc`). Create a `home()` method that maps to `/` and returns the user's name.

```java
package com.okta.developer.oidc;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
public class MainController {

   @GetMapping("/")
   String home(Principal user) {
       return "Hello " + user.getName();
   }
}
```

Restart your server, log in with `user` and the generated password and you should see `Hello user`.

```bash
$ http --auth user:'d7c4138d-a1cc-4cc9-8975-97f37567594a' localhost:8080
HTTP/1.1 200
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Content-Length: 10
Content-Type: text/plain;charset=UTF-8
Date: Sun, 03 Dec 2017 19:26:54 GMT
Expires: 0
Pragma: no-cache
Set-Cookie: JSESSIONID=22A5A91051B7AFBA1DC8BD30C0B53365; Path=/; HttpOnly
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block

Hello user
```

## Add Authentication with Okta

In a [previous tutorial](/blog/2017/03/21/spring-boot-oauth), I showed you how to use Spring Security OAuth to provide SSO to your apps. You can do the same thing in Spring Security 5, but you can also specify multiple providers now, which you couldn't do previously. Spring Security 5 has a [OAuth 2.0 Login sample](https://github.com/spring-projects/spring-security/tree/5.0.0.RELEASE/samples/boot/oauth2login), and [documentation](https://docs.spring.io/spring-security/site/docs/5.0.0.RELEASE/reference/htmlsingle/#jc-oauth2login) on how everything works.

### Create an OpenID Connect App

To integrate with Okta, you'll need to [sign up for an account on developer.okta.com](https://developer.okta.com/). After confirming your email and logging in, navigate to **Applications** > **Add Application**. Click **Web** and then click **Next**. Give the app a name you'll remember, specify `http://localhost:8080` as a Base URI, as well as `http://localhost:8080/login/oauth2/code/okta` for a Login redirect URI.

Rename `src/main/resources/application.properties` to `src/main/resources/application.yml` and populate it with the following.

```yaml
spring:
 thymeleaf:
   cache: false
 security:
   oauth2:
     client:
       registration:
         okta:
           client-id: {clientId}
           client-secret: {clientSecret}
       provider:
         okta:
           authorization-uri: https://{yourOktaDomain}/oauth2/default/v1/authorize
           token-uri: https://{yourOktaDomain}/oauth2/default/v1/token
           user-info-uri: https://{yourOktaDomain}/oauth2/default/v1/userinfo
           jwk-set-uri: https://{yourOktaDomain}/oauth2/default/v1/keys
```

Copy the client ID and secret from your OIDC app into your `application.yml` file. Replace `{yourOktaDomain}` with your Okta org URL, which you can find on the Dashboard of the Developer Console. Make sure it does *not* include `-admin` in it.

You'll need to add some dependencies to your `pom.xml` for Spring Security 5's OAuth configuration to initialize correctly.

```xml
<dependency>
   <groupId>org.springframework.security</groupId>
   <artifactId>spring-security-config</artifactId>
</dependency>
<dependency>
   <groupId>org.springframework.security</groupId>
   <artifactId>spring-security-oauth2-client</artifactId>
</dependency>
<dependency>
   <groupId>org.springframework.security</groupId>
   <artifactId>spring-security-oauth2-jose</artifactId>
</dependency>
<dependency>
   <groupId>org.thymeleaf.extras</groupId>
   <artifactId>thymeleaf-extras-springsecurity4</artifactId>
</dependency>
```

Restart your app and navigate to `http://localhost:8080` again. You'll see a link to click on to log in with Okta.

{% img blog/spring-security-5/login-with-oauth2.png alt:"Login with OAuth 2.0" width:"700" %}{: .center-image }

**NOTE:** If you'd like to learn how to customize the login screen that Spring Security displays, see its [OAuth 2.0 Login Page documentation](https://docs.spring.io/spring-security/site/docs/5.0.0.RELEASE/reference/htmlsingle/#oauth2login-advanced-login-page).

After clicking on the link, you should see a login screen.

{% img blog/spring-security-5/okta-login.png alt:"Okta Login" width:"800" %}{: .center-image }

Enter the credentials you used to create your account, and you should see a screen like the following after logging in.

{% img blog/spring-security-5/post-login-oauth2.png alt:"Okta Login" width:"700" %}{: .center-image }

**NOTE:** It's possible to change things so `Principal#getName()` returns a different value. However, there is a [bug in Spring Boot 2.0.0.M7](https://github.com/spring-projects/spring-boot/pull/10672) that prevents the configuration property from working.

### Get User Information with OIDC

Change your `MainController.java` to have the code below. This code adds a `/userinfo` mapping that uses Spring WebFlux's `WebClient` to get the user's information from the user info endpoint. I copied the code below from Spring Security 5's [OAuth 2.0 Login sample](https://github.com/spring-projects/spring-security/tree/5.0.0.RELEASE/samples/boot/oauth2login).

```java
/*
* Copyright 2002-2017 the original author or authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
package com.okta.developer.oidc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.Map;

/**
* @author Joe Grandja
*/
@Controller
public class MainController {

   private final OAuth2AuthorizedClientService authorizedClientService;

   public MainController(OAuth2AuthorizedClientService authorizedClientService) {
       this.authorizedClientService = authorizedClientService;
   }

   @RequestMapping("/")
   public String index(Model model, OAuth2AuthenticationToken authentication) {
       OAuth2AuthorizedClient authorizedClient = this.getAuthorizedClient(authentication);
       model.addAttribute("userName", authentication.getName());
       model.addAttribute("clientName", authorizedClient.getClientRegistration().getClientName());
       return "index";
   }

   @RequestMapping("/userinfo")
   public String userinfo(Model model, OAuth2AuthenticationToken authentication) {
       OAuth2AuthorizedClient authorizedClient = this.getAuthorizedClient(authentication);
       Map userAttributes = Collections.emptyMap();
       String userInfoEndpointUri = authorizedClient.getClientRegistration()
               .getProviderDetails().getUserInfoEndpoint().getUri();
       if (!StringUtils.isEmpty(userInfoEndpointUri)) {    // userInfoEndpointUri is optional for OIDC Clients
           userAttributes = WebClient.builder()
                   .filter(oauth2Credentials(authorizedClient)).build()
                   .get().uri(userInfoEndpointUri)
                   .retrieve()
                   .bodyToMono(Map.class).block();
       }
       model.addAttribute("userAttributes", userAttributes);
       return "userinfo";
   }

   private OAuth2AuthorizedClient getAuthorizedClient(OAuth2AuthenticationToken authentication) {
       return this.authorizedClientService.loadAuthorizedClient(
               authentication.getAuthorizedClientRegistrationId(), authentication.getName());
   }

   private ExchangeFilterFunction oauth2Credentials(OAuth2AuthorizedClient authorizedClient) {
       return ExchangeFilterFunction.ofRequestProcessor(
               clientRequest -> {
                   ClientRequest authorizedRequest = ClientRequest.from(clientRequest)
                           .header(HttpHeaders.AUTHORIZATION,
                                   "Bearer " + authorizedClient.getAccessToken().getTokenValue())
                           .build();
                   return Mono.just(authorizedRequest);
               });
   }
}
```

Create a Thymeleaf index page at `src/main/resources/templates/index.html`. You can use Thymeleaf's support for Spring Security to show/hide different parts of the page based on the user's authenticated status.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org"
     xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity4">
<head>
   <title>Spring Security - OAuth 2.0 Login</title>
   <meta charset="utf-8" />
</head>
<body>
<div style="float: right" th:fragment="logout" sec:authorize="isAuthenticated()">
   <div style="float:left">
       <span style="font-weight:bold">User: </span><span sec:authentication="name"></span>
   </div>
   <div style="float:none">&nbsp;</div>
   <div style="float:right">
       <form action="#" th:action="@{/logout}" method="post">
           <input type="submit" value="Logout" />
       </form>
   </div>
</div>
<h1>OAuth 2.0 Login with Spring Security</h1>
<div>
   You are successfully logged in <span style="font-weight:bold" th:text="${userName}"></span>
   via the OAuth 2.0 Client <span style="font-weight:bold" th:text="${clientName}"></span>
</div>
<div>&nbsp;</div>
<div>
   <a href="/userinfo" th:href="@{/userinfo}">Display User Info</a>
</div>
</body>
</html>
```

Create another template at `src/main/resources/templates/userinfo.html` to display the user's attributes.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
<head>
   <title>Spring Security - OAuth 2.0 User Info</title>
   <meta charset="utf-8" />
</head>
<body>
<div th:replace="index::logout"></div>
<h1>OAuth 2.0 User Info</h1>
<div>
   <span style="font-weight:bold">User Attributes:</span>
   <ul>
       <li th:each="userAttribute : ${userAttributes}">
           <span style="font-weight:bold" th:text="${userAttribute.key}"></span>: <span th:text="${userAttribute.value}"></span>
       </li>
   </ul>
</div>
</body>
</html>
```

Now, when you're logged in, you'll see a link to display user info.

{% img blog/spring-security-5/index-page.png alt:"Index Page" width:"800" %}{: .center-image }

Click on the link, and you'll see the contents of the ID Token that's retrieved from the user info endpoint.

{% img blog/spring-security-5/userinfo-page.png alt:"UserInfo Page" width:"800" %}{: .center-image }

## Learn More about Spring Security and OIDC

This article showed you how to implement login with OAuth 2.0 and Spring Security 5. I also showed you how to use OIDC to retrieve a user's information. The source code for the application developed in this article can be [found on GitHub](https://github.com/oktadeveloper/okta-spring-security-5-example).

These resources provide additional information about Okta and OIDC:

* [Okta Developer Documentation](/documentation/) and its [OpenID Connect API](/docs/api/resources/oidc)
* [Identity, Claims, & Tokens – An OpenID Connect Primer, Part 1 of 3](/blog/2017/07/25/oidc-primer-part-1)
* [OIDC in Action – An OpenID Connect Primer, Part 2 of 3](/blog/2017/07/25/oidc-primer-part-2)
* [What's in a Token? – An OpenID Connect Primer, Part 3 of 3](/blog/2017/08/01/oidc-primer-part-3)
* [Add Role-Based Access Control to Your App with Spring Security and Thymeleaf](/blog/2017/10/13/okta-groups-spring-security)

If you have any questions about this post, please leave a comment below. You can also post to [Stack Overflow with the okta tag](https://stackoverflow.com/questions/tagged/okta) or use our [developer forums](https://devforum.okta.com/).

[Follow @OktaDev on Twitter](https://twitter.com/oktadev) for more awesome content!
