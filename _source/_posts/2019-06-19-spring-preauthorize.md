---
layout: blog_post
title: "Spring Method Security with Spring PreAuthorize"
author: moksamedia
description: "In this tutorial, you'll secure a Spring Boot app with Spring Security and the PreAuthorize annotation."
tags: [java, spring, spring boot, spring security, security]
tweets:
- "Learn how to use method-based security with @SpringSecurity in this tutorial."
- "Confused on when to use HttpSecurity vs PreAuthorize with @SpringSecurity, check out this post!"
- "Andrew explains how to secure a SpringBoot app with a couple lines of code."
image: blog/featured/okta-java-bottle-headphones.jpg
---

This tutorial will explore two ways to configure authentication and authorization in Spring Boot using Spring Security. One method is to create a `WebSecurityConfigurerAdapter` and use the fluent API to override the default settings on the `HttpSecurity` object. Another is to use the `@PreAuthorize` annotation on controller methods, known as method-level security or expression-based security. The latter will be the main focus of this tutorial. However, I will present some `HttpSecurity` code and ideas by way of contrast.

The first authentication method is `HttpSecurity`, which is global and is by default applied to all requests. Finer-grained control is possible, however, using pattern matching for endpoints, and the fluent API exposed by the `HttpSecurity` is quite powerful. This is where configuration options such as OAuth 2.0, Form Login, and HTTP Basic are exposed. It is a great place to set global authentication policies. 

Method-level security is implemented by placing the `@PreAuthorize` annotation on controller methods (actually one of a set of annotations available, but the most commonly used). This annotation contains a [Spring Expression Language (SpEL)](https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html#expressions) snippet that is assessed to determine if the request should be authenticated. If access is not granted, the method is not executed and an HTTP Unauthorized is returned. In practice, using the `@PreAuthorize` annotation on a controller method is very similar to using `HttpSecurity` pattern matchers on a specific endpoint. There are some differences, however.

## Differentiate Between Spring Security's @PreAuthorize and HttpSecurity

The first difference is subtle, but worth mentioning. `HttpSecurity` method rejects the request earlier, in a web request filter, before controller mapping has occurred. In contrast, the `@PreAuthorize` assessment happens later, directly before the execution of the controller method. This means that configuration in `HttpSecurity` is appied **before** `@PreAuthorize`.

Second, `HttpSecurity` is tied to URL endpoints while `@PreAuthorize` is tied to controller methods **and is actually located within the code adjacent to the controller definitions**. Having all of your security in one place and defined by web endpoints has a certain neatness to it, especially in smaller projects, or for more global settings; however, as projects get larger, it may make more sense to keep the authorization policies near the code being protected, which is what the annotation-based method allows. 

Another advantage that `@PreAuthorize` presents over `HttpSecurity` is the use of SpEL. Spring Expression Language allows you to make authorization decisions based on complex expressions that can access built-in authentication objects (such as `authentication` and `principal`), dependency-injected method parameters, and query parameters. In this tutorial you will mostly look at two expressions: `hasAuthority()` and `hasRole()`. [The Spring docs](https://docs.spring.io/spring-security/site/docs/5.1.x/reference/htmlsingle/#el-pre-post-annotations) are again a great place to dig deeper.

Before we dive into the project, I want to also mention that Spring also provides a `@PostAuthorize` annotation. Not surprisingly, this is a method-level authorization annotation that is assessed **after** the method executes. Why would we want to do that? It allows the method to perform its own authorization checks based on whatever controller logic it likes before the annotation is assessed. The downside is that because the controller method is executed before the annotation is assessed, this could result is inefficiency, depending on the implementation.

## Dependencies

The dependencies for this tutorial are pretty simple. You need: 1.) Java 1.8+ installed, and 2.) an Okta developer account. 

If you do not have Java installed, go to [the Java homepage on the Oracle website](https://www.java.com/en/download/). On a Mac, you can also use [SDKMAN](https://sdkman.io/).  

If you do not already have a free Okta developer account, go to [our website and sign up](https://developer.okta.com/signup/).

## Start a Sample Project Using Spring Initializr

To get the project started, you can use the [Spring Initializr](https://start.spring.io/). However, while it's worth taking a gander at the page, you don't even have to bother going there to create the project. You can use the REST API and `curl`. 

Open a terminal and `cd` to wherever you want the project file .zip to end up. Run the command below, which will download the zipped Spring Boot project. 

```bash
curl https://start.spring.io/starter.zip \
  -d dependencies=web,security \
  -d type=gradle-project \
  -d bootVersion=2.1.5.RELEASE \
  -d groupId=com.okta.preauthorize \
  -d artifactId=application \
  -o PreAuthorizeProject.zip
unzip PreAuthorizeProject.zip
```

There isn't much to the project to begin with except the `build.gradle` file and the `DemoApplication.java` class file. However, the whole project structure is there already set up for you. 

The `build.gradle` file also has the two Spring dependencies you need for this example:

```groovy
dependencies {
  implementation 'org.springframework.boot:spring-boot-starter-security'
  implementation 'org.springframework.boot:spring-boot-starter-web'
}
``` 

## Add a WebController

The sample app in its current state doesn't do much. You need to add a controller to define some endpoints and responses.

Add a new file `src/main/java/com/okta/preauthorize/Application/WebController.java`:

```java
package com.okta.preauthorize.application;  
  
import org.springframework.stereotype.Controller;  
import org.springframework.web.bind.annotation.RequestMapping;  
import org.springframework.web.bind.annotation.ResponseBody;  
  
@Controller  
public class WebController {  
  
    @RequestMapping("/")  
    @ResponseBody  
    public String home() {  
        return "Welcome home!";  
    }  
  
    @RequestMapping("/restricted")  
    @ResponseBody  
    public String restricted() {  
        return "You found the secret lair!";  
    }
}
```

This controller defines two endpoints: `/` and `/restricted`. You will be adding method-level security to the `/restricted` endpoint in a bit. Right now, however, no security has been configured.

Go ahead and run the application. From the root project directory, run:

```bash
./gradlew bootRun
```

Once Spring Boot has finished launching, navigate to: `http://localhost:8080`

You'll notice a login form appears. Whoa! Where did that come from?!

That form automatically generated by Spring Boot. Take a look at the Spring class `WebSecurityConfigurerAdapter` and the method [`configure(HttpSecurity http)`](https://github.com/spring-projects/spring-security/blob/5.1.5.RELEASE/config/src/main/java/org/springframework/security/config/annotation/web/configuration/WebSecurityConfigurerAdapter.java#L355-L360). This is where the default authentication settings are configured.

```java
/**  
 * Override this method to configure the {@link HttpSecurity}. Typically subclasses  
 * should not invoke this method by calling super as it may override their * configuration. The default configuration is: 
* 
* <pre>  
* http.authorizeRequests().anyRequest().authenticated().and().formLogin().and().httpBasic(); 
* </pre>  
 *
 * @param http the {@link HttpSecurity} to modify  
 * @throws Exception if an error occurs  
 */
protected void configure(HttpSecurity http) throws Exception {  
    ...
    http  
        .authorizeRequests()  
            .anyRequest().authenticated()  
            .and()  
        .formLogin().and()  
        .httpBasic();  
}
```

By default, all requests require authentication. Form-based authentication and HTTP Basic auth are enabled for all requests. 

If you want to log in, look for a line in your console output like the following that tells you the generated password:

```bash
Using generated security password: 9c299bb9-f561-4c12-9810-c9a2bc1dca08
``` 

The username is simply "user." This password is re-generated each time Spring Boot is run.

## Authentication Versus Authorization

Before we go any further, I want to just quickly make sure two terms are clear: authentication and authorization. Authentication answers the question: who is making the request? Authorization answers the question: what are they allowed to do?

Authentication happens first, generally, unless there are specific permissions set for anonymous users (this is an implicit authentication in some ways). Authorization is based on the value of the authenticated user. The authenticated entity can be a human user or an automated service, or a service acting on behalf of a human user. 

Two common authorization schemes are based on groups and roles. These two terms are often conflated and used interchangeably in less reputable places on the web, but there is an official difference. Groups define sets of users and assigns permissions to those sets of users. Users can be members of multiple groups. Roles define sets of permissions (allowed actions or resources) that can be assigned to users. In practice groups tends to be a more static, less flexible way of controller access while roles is often finely grained and can be dynamic even within a session, assigning roles for specific task and revoking them when they are no longer needed. Anybody that's used Amazon AWS has seen this in action, often to bewildering effect.

## Enable Method-level Security for Spring @PreAuthorize

What you want to do now is configure Spring Boot to allow requests on the home endpoint while restricting requests to the `/restricted` endpoint.

You might initially think you could add `@PreAuthorize("permitAll()")` to the home endpoint and this would allow all requests. However, if you try it, you'll discover that it does nothing. That's because the default `HttpBuilder` implementation is still active, and because it's assessed during the web request filter chain, it takes precedence. **You also have to explicitly enable the method-level security annotations, otherwise, they're ignored.**

Add the following `SecurityConfig` class, that will achieve both of the above goals.

`src/main/java/com/okta/preauthorize/Application/SecurityConfig.java`

```java
package com.okta.preauthorize.application;  
  
import org.springframework.context.annotation.Configuration;  
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;  
import org.springframework.security.config.annotation.web.builders.HttpSecurity;  
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;  
  
@Configuration  
@EnableGlobalMethodSecurity(prePostEnabled = true)  
public class SecurityConfig extends WebSecurityConfigurerAdapter {  
    protected void configure(final HttpSecurity http) throws Exception {}  
}
```

The `@EnableGlobalMethodSecurity(prePostEnabled = true)` annotation is what enables our `@PreAuthorize` annotation. This can be added to any class with the `@Configuration` annotation. I won't go into any depth about them here, but you can also enable `@Secured`, an older Spring Security annotation, and JSR-250 annotations.

The `configure(final HttpSecurity http)` method overrides the default `HttpBuilder` configuration. Because it's empty, it leaves the application without authorization or authentication.

Run the app again using `./gradlew bootRun`, and you'll discover that both endpoints are now wide open.

## Implement A Global Security Policy

Apps generally have to choose which global security policy they are going to structure their security around: "default to allowed" or "default to authenticated". Is the app by-default open? Or by-default restricted? I generally default to restricted and explicitly allow any public endpoints. This scheme makes sense for the types of proprietary web applications that I work on that tend not to be public or have a relatively small public face. However, if you are working on something that is largely public with a discrete access-controlled backed, like a website with an admin panel, a more permissive scheme might make sense. You'll look at both here.

Since the app is already wide-open, I'll show you how to restrict a specific method first. After that, you'll look at a couple of ways to implement more globally restrictive access policies.

In the `WebController` class, add the `@PreAuthorize` annotation to the `/restricted` endpoint, like this:

```java
@PreAuthorize("isAuthenticated()")  
@RequestMapping("/restricted")  
@ResponseBody  
public String restricted() {  
    return "You found the secret lair!";  
}
```

Run the app (`./gradlew bootRun`).

This time you will be able to navigate to the home page but going to the `/restricted` endpoint gives you an (admittedly ugly) whitelabel error page.

{% img blog/spring-preauthorize/whitelabel-403.png alt:"Ugly Whitelabel Error" width:"600" %}{: .center-image }

In a production app, you'd need to override this to return a better, custom error page or otherwise handle the error (if you want to create a custom error page, take a look at [the Spring docs on the subject](https://docs.spring.io/spring-boot/docs/2.1.x/reference/html/boot-features-developing-web-applications.html#boot-features-error-handling-custom-error-pages)). But you can see that the app is returning a **403 / Unauthorized**, which is what you want.

Great. Now, instead, change your WebController class to match the following:

```java
@Controller
@PreAuthorize("isAuthenticated()")    
public class WebController {  
  
    @PreAuthorize("permitAll()")  
    @RequestMapping("/")  
    @ResponseBody  
    public String home() {  
        return "Welcome home!";  
    }  

    @RequestMapping("/restricted")  
    @ResponseBody  
    public String restricted() {  
        return "You found the secret lair!";  
    }  
      
}
```

Here you've used the `@PreAuthorize` annotation to restrict the entire controller class to authenticated users and to explicitly allow all requests (regardless of authentication status) to the home endpoint.

I know we've been calling it "method-level" security, but, in fact, these `@PreAuthorize` annotation can also be added to controller classes to set a default for the entire class. This is also where the `@PreAuthorize("permitAll()")` comes in handy because it can override the class-level annotation.

If you run the app (`./gradlew bootRun`) and try the endpoints, you'll find that the home endpoint is open but the `/restricted` endpoint is closed.

Note that if you added a second, separate web controller, all of its methods would still by-default be open and not require authentication.

A third option (my favorite on most small to medium-sized apps) is to use `HttpBuilder` to require authentication for all requests by default and to explicitly allow any public endpoints. This allows me to use `@PreAuthorize` to refine access control for specific methods based on users or roles or groups but makes it clear that all paths **unless explicitly allowed** will have some basic security applied. It also means that public paths are defined in a central place. Again this works for a certain type of project, but may not be the best structure for all projects. 

To implement this, change the `WebController` class to this (removing all the `@PreAuthorize` annotations):

```java
@Controller  
public class WebController {  
  
    @RequestMapping("/")  
    @ResponseBody  
    public String home() {  
        return "Welcome home!";  
    }  
  
    @RequestMapping("/restricted")  
    @ResponseBody  
    public String restricted() {  
        return "You found the secret lair!";  
    }  
  
}
```

And change the `WebSecurity` class to this:

```java
@Configuration  
@EnableGlobalMethodSecurity(prePostEnabled = true)  
public class SecurityConfig extends WebSecurityConfigurerAdapter {  
    protected void configure(final HttpSecurity http) throws Exception {  
        http.antMatcher("/**")  
            .authorizeRequests()  
            .antMatchers("/").permitAll()  
            .anyRequest().authenticated()
            .and().formLogin();  
    }  
}
```

What you've done is use `SecurityConfig` class to explicitly permit all requests on the home endpoint while requiring authentication on all other endpoints. This sets a blanket minimum authentication requirement for your app. You also re-enabled form-based authentication.

Try it! 

Run the app using: `./gradlew bootRun`

Navigate to the home endpoint, which is open: `http://localhost:8080`

And the restricted endpoint, which requires authentication: `http://localhost:8080/restricted`.

When Spring's login form appears, don't forget you can use the default credentials. User is "user", and the password is found in the console output (look for `Using generated security password:`).

## Advance to OAuth 2.0 Login

Form-based authentication feels pretty creaky and old these days. More and more, users expect to be able to log in using third party sites, and due to increased security threats, there's less motivation to manage user credentials on your own server. Okta is a software-as-service identity and access management company that provides a whole host of services. In this tutorial, you're going to use them to quickly implement a login form using OAuth 2.0 and OIDC (OpenID Connect). 

Very, very briefly: OAuth 2.0 is an industry-standard authorization protocol and OIDC is another open standard on top of OAuth that adds an identity layer (authentication). Together they provide a structured way for programs to manage authentication and authorization and to communicate across networks and the internet. Neither OAuth nor OIDC, however, provide an implementation. They are just specs or protocols. That's where Okta comes in. Okta has an implementation of the OAuth 2.0 and OIDC specs that allows for programs to use their services to quickly provide login, registration, and single sign-on (or social login) services. In this tutorial, you're just going to be implementing a login function, but at the end of the tutorial, you can find links to other resources to show you how to implement social login and registration.

First, sign up for a free Okta Developer account: [https://developer.okta.com/](https://developer.okta.com/)

If this is the first time you've logged in or just registered, you may need to click the **Admin** button to get to the developer console.

Next, you need to configure an OIDC application.

From your Okta developer dashboard, in the top menu, click on **Applications**.

{% img blog/spring-preauthorize/add-app.png alt:"Okta Dashboard" width:"800" %}{: .center-image }

Click green **Add Application** button
Click **Web** application type, and **Next**
Give the app a Name. Any name.
Set **Login Redirect URIs** to `http://localhost:8080/login/oauth2/code/okta`
Click **Done**.

{% img blog/spring-preauthorize/new-oidc-app.png alt:"OIDC Application" width:"600" %}{: .center-image }

Take note of the **Client ID** and **Client Secret** at the bottom of the page. You'll need these in the next section.

And that's it on the Okta side. 

Now you need to configure Spring Boot to use Okta as an OAuth 2.0 provider.

## Configure Your Spring Boot App For OAuth 2.0

Making Spring Boot work with OAuth 2.0 and Okta is remarkably easy. The first step is to add the Okta Spring Boot Starter dependency. It's totally possible to use Okta OAuth 2.0 / OIDC without using their starter; however, the starter simplifies the configuration. It also handles extracting the groups claim from the JSON Web Token and turning it into a Spring Security authority (which will look at in a bit). Take a look at the [Okta Spring Boot Starter GitHub page](https://github.com/okta/okta-spring-boot) for more info.

Update the dependencies section of your `build.gradle` file:

```groovy
dependencies {  
  implementation 'com.okta.spring:okta-spring-boot-starter:1.2.1'  // <-- ADDED
  implementation 'org.springframework.boot:spring-boot-starter-security'  
  implementation 'org.springframework.boot:spring-boot-starter-web'  
  testImplementation 'org.springframework.boot:spring-boot-starter-test'  
  testImplementation 'org.springframework.security:spring-security-test'  
}
```

In the `src/main/resources` directory there is an `application.properties` file. Rename it to `application.yml`. Add the following content:

```yaml
okta:
  oauth2:  
    issuer: https://{yourOktaDomain}/oauth2/default  
    client-id: {yourClientId}
    client-secret: {yourClientSecret}
```

Don't forget to update the **client-id**, **client-secret**, and **issuer** values to match the values from your Okta developer account and OIDC app. Your Okta domainURL will look something like this: `https://dev-123456.okta.com`

Finally, update the `SecurityConfiguration.java` file:

```java
@Configuration  
@EnableGlobalMethodSecurity(prePostEnabled = true)  
public class SecurityConfig extends WebSecurityConfigurerAdapter {  
    protected void configure(final HttpSecurity http) throws Exception {  
        http.antMatcher("/**")  
            .authorizeRequests()  
            .antMatchers("/").permitAll()  
            .anyRequest().authenticated()  
            .and().oauth2Login();  // <-- THIS WAS CHANGED
    }  
}
```

Notice that all you really changed here was `formLogin()` to `oauth2Login()`.

Run the app: `./gradlew bootRun` (you may either need to sign out of the Okta developer dashboard or use an incognito window to see the login screen).

The `/` endpoint is still open, but when you go to the restricted endpoint: `http://localhost:8080/restricted`.

You'll see the Okta login screen.

{% img blog/spring-preauthorize/okta-login.png alt:"Okta Login Screen" width:"600" %}{: .center-image }

Log in with your Okta credentials and you're authenticated!

## Inspect the OAuth 2.0 User Attributes

When developing OAuth applications, I have found it helpful to be able to inspect the information Spring Boot has about the client and the authenticated user. To this end, add a new controller named `UserInfoController.java`.

`src/main/java/com/okta/preauthorize/Application/UserInfoController.java`

```java
package com.okta.preauthorize.application;  
  
import org.springframework.security.core.annotation.AuthenticationPrincipal;  
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;  
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;  
import org.springframework.security.oauth2.core.user.OAuth2User;  
import org.springframework.stereotype.Controller;  
import org.springframework.web.bind.annotation.RequestMapping;  
import org.springframework.web.bind.annotation.ResponseBody;  
  
import java.util.Map;  
  
@RequestMapping("/user")  
@Controller  
public class UserInfoController {  
      
    @RequestMapping("/oauthinfo")  
    @ResponseBody  
    public String oauthUserInfo(@RegisteredOAuth2AuthorizedClient OAuth2AuthorizedClient authorizedClient,  
                              @AuthenticationPrincipal OAuth2User oauth2User) {  
        return  
            "User Name: " + oauth2User.getName() + "<br/>" +  
            "User Authorities: " + oauth2User.getAuthorities() + "<br/>" +  
            "Client Name: " + authorizedClient.getClientRegistration().getClientName() + "<br/>" +  
            this.prettyPrintAttributes(oauth2User.getAttributes());  
    }  
  
    private String prettyPrintAttributes(Map<String, Object> attributes) {  
        String acc = "User Attributes: <br/><div style=padding-left:20px;>";  
        for (String key : attributes.keySet()){  
            Object value = attributes.get(key);  
            acc += "<div>"+key + ":&nbsp" + value.toString() + "</div>";  
        }  
        return acc + "</div>";  
    }  
}
```

Notice that this class defines a class-wide request mapping path `/user`, making the actual `oauthUserInfo()` endpoint `/user/oauthinfo`.  

The second method, `prettyPrintAttributes()`, is just some sugar to format the user attributes so that they're more readable.

Run the app: `./gradlew bootRun`. 

Navigate to `http://localhost:8080/user/oauthinfo`.

You'll see something like this:

```
User Name: 00ab834zk7eJ18e8Y0h7  
User Authorities: [ROLE_USER, SCOPE_email, SCOPE_openid, SCOPE_profile]  
Client Name: Okta  
User Attributes:  
  at_hash: 1yq0lbHDupcb8AhBNShkeQ
  sub: 00ue9mlzk7eW24e8Y0h7
  zoneinfo: America/Los_Angeles
  ver: 1
  email_verified: true
  amr: ["pwd"]
  iss: https://dev-123456.oktapreview.com/oauth2/default
  preferred_username: andrew.hughes@mail.com
  locale: en-US
  given_name: Andrew
  aud: [0oakz4teswoV7sDZI0h7]
  updated_at: 1558380884
  idp: 00oe9mlzh0xuqOT5z0h7
  auth_time: 1558454889
  name: Andrew Hughes
  exp: 2019-05-21T17:46:28Z
  family_name: Hughes
  iat: 2019-05-21T16:46:28Z
  email: andrew.hughes@mail.com
  jti: ID.CnwVJ_h1Dq5unqkwherWyf8ZFTETX_X4TP39ythQ-ZE
```

I want to point out a few things. First, notice that the **User Name** is actually the Client ID of your OIDC application from Okta. That's because, from the point of view of Spring Boot OAuth, the client app is the "user." To find the actual user name and info, you have to look under the **User Attributes**. Keep in mind that the actual contents of these attributes vary between OAuth providers, so if you're supporting Okta, GitHub, and Twitter, for example, so you will need to inspect these attributes for each OAuth provider to see what they're returning.

The other important point is the **User Authorities**. Authorities, as used by Spring here, is a meta term for authorization information. They're just strings. Their values are extracted from the OAuth/OIDC information. It's up to the client app to use them properly. They may be roles, scopes, groups, etc... As far as OAuth/OIDC is concerned their usage is basically arbitrary.

To see how this works, in the next few sections you'll add an **Admin** group in Okta, assign a user to that group, and restrict a method to the **Admin** group using the `@PreAuthorize` annotation.

**ROLE_USER**: You'll notice that all authenticated users are assigned `ROLE_USER` by Spring. This is the default, lowest-level role that is automatically assigned.

**SCOPE_**: Also be aware that the OAuth scopes are mapped to Spring authorities and can be used for authorization, for example in the `@PreAuthorize` and `@PostAuthorize` annotations, as you'll see in a sec.

## Activate Groups Claim on Okta

Okta doesn't by default include the groups claim in the JSON Web Token (JWT). The JWT is what Okta uses to communicate authentication and authorization information to the client app. A deeper dive into that is available in some other blog posts linked to at the end of this one.

To configure Okta to add the groups claim, go to your Okta developer dashboard.

From the top menu, go to **API** and select **Authorization Servers**.

Select the **default** authorization server.

Click on the **Claims** tab.

{% img blog/spring-preauthorize/auth-server-claims.png alt:"Auth Server Claims" width:"800" %}{: .center-image }

You are going to create two claim mappings. You're not creating two claims, per se, but instructing Okta to add the groups claim to both the Access Token and the ID Token. You need to do this because depending on the OAuth flow, the groups claim may be extracted from either. In our case, with the OIDC flow, it's actually the ID Token that matters, but it's best to just add them to both so as to avoid frustration in the future. The resource server flow requires the groups claim to be in the access token.

First, add a claim mapping for token type **Access Token**. 

Click **Add Claim**.

Update the following values (the other default values are fine):

 - **Name:** groups
 - **Include in token type**: Access Token
 - **Value type:** Groups
 - **Filter:** Matches regex, `.*`

{% img blog/spring-preauthorize/edit-claim.png alt:"Configure Claim" width:"800" %}{: .center-image }

Second, add a second claim mapping for token type **ID Token**. 

Click **Add Claim**.

Update the following values (just the same as above except token type):

 - **Name:** groups
 - **Include in token type**: ID Token
 - **Value type:** Groups
 - **Filter:** Matches regex, `.*`

Great! So now Okta will map all of its groups to a `groups` claim on the access token and the ID token.

What happens to this groups claim on the Spring side is not necessarily obvious nor automatic. One of the benefits of the Spring Boot starter is that it automatically extracts the groups claim from the JWT and maps it to a Spring authority. Otherwise you would need to implement your own `GrantedAuthoritiesExtractor`. 

FYI: the name of the groups claim can be configured using the `okta.oauth2.groupsClaim` field in the `application.yml` file. It defaults to `groups`.

## Inspect The User Attributes With Groups

Run the app: `./gradlew bootRun`. 

Navigate to `http://localhost:8080/user/oauthinfo`.

You'll see something like this (a bunch of redundant lines omitted for clarity):

```
User Name: 00ab834zk7eJ18e8Y0h7  
User Authorities: [Everyone, ROLE_USER, SCOPE_email, SCOPE_openid, SCOPE_profile]
Client Name: Okta  
User Attributes:  
  ...
  groups: ["Everyone"]
  ...
```

Notice a new **groups** user attribute (the mapped groups claim). The value, `Everyone`, is the default group mapped to, well, everyone. This gets mapped to the user authority `Everyone`. 

That's the basic idea. It'll get a little more exciting in the next step when we add an Admin group.

## Create An Admin Group in Okta

Now you want to add an **Admin** group on Okta. Log into your Okta developer dashboard.

From the top menu, go to **Users** and select **Groups**.

Click **Add Group**.

In the popup:
- **Name** the group "Admin".
- **Description** can be whatever you like.
- Click **Add Group**.

At this point, you've created the Admin group, **but you haven't actually assigned anybody to it!**

## Use Method-level Authorization To Restrict An Endpoint

In the `WebController` class, update the `/restricted` endpoint method. You're adding the following annotation to the method:

```java
@PreAuthorize("hasAuthority('Admin')")  
```

Like so:

```java
@PreAuthorize("hasAuthority('Admin')")  
@RequestMapping("/restricted")  
@ResponseBody  
public String restricted() {  
    return "You found the secret lair!";  
}
```

This tells Spring to check that the authenticated user has the `Admin` authority, and if not, deny the request.

Run the app: `./gradlew bootRun`. 

Navigate to `http://localhost:8080/restricted`.

You'll get a **403 / Unauthorized** whitepage error.

## Add Your User To the Admin Group

Now you need to add your Okta user to the Admin group. From the top menu, select **Users** and click **Groups**. Click on the **Admin** group. Click **Add Members**. Search for your user in the popup and click **Add**.

## Test the Admin Group Membership

Done! Let's see what that did. Once, again, run the Spring Boot app: `./gradlew bootRun`. 

Navigate to `http://localhost/user/oauthinfo`.

This time you'll see the `Admin` group and authority. (You may need a new browser session to see the change, or use incognito.)

```
User Name: 00ab834zk7eJ18e8Y0h7  
User Authorities: [Admin, Everyone, ROLE_USER, SCOPE_email, SCOPE_openid, SCOPE_profile]
Client Name: Okta  
User Attributes:  
  ...
  groups: ["Everyone", "Admin"]
  ...
```

And if you navigate to http://localhost:8080/restricted, you'll be allowed access.

## Compare Spring Security Roles and Authorities

One thing that confused me initially was `hasRole()` versus `hasAuthority()`. 

Roles in Spring are authorities that have the `ROLE_` prefix (like all things in Spring, the prefix is configurable). One way to think about this is that roles are intended for large sets of permissions while authorities can be used for finer-grained control. However, that's just a possible use. The actual implementation is up to the developer. In this tutorial, you're actually using authorities to map to authorization groups.

The important point to remember is that if you want to user `hasRole()`, you need the authority name in the claim to start with `ROLE_`. For example, if you added a `ROLE_ADMIN` group, and added your user to it, and the group to the OIDC app, you could use `hasRole('ADMIN')`. 

## Authorization Based On OAuth 2.0 Scopes with Spring PreAuthorize

You can also use the `@PreAuthorize` annotation to limit access based on OAuth scopes. From [
the OAuth 2.0 docs page](https://oauth.net/2/scope/): 

>Scope is a mechanism in OAuth 2.0 to limit an application's access to a user's account. An application can request one or more scopes, this information is then presented to the user in the consent screen, and the access token issued to the application will be limited to the scopes granted.

If you look at the inspected `User Authorities` returned from the `/user/oauthinfo` endpoint, you'll see three authorities that begin with `SCOPE_`: 
- SCOPE_email
- SCOPE_openid
- SCOPE_profile

These correspond to the email, openid, and profile scopes. To restrict a method to a user that has a specific scope, you would use an annotation such as: `@PreAuthorize("hasAuthority('SCOPE_email')")`.

I will also point out that you can accomplish exactly the same thing (more or less exactly) using `HttpSecurity` in the `SecurityConfig` class doing something like this:

```java
protected void configure(final HttpSecurity http) throws Exception {  
    http.antMatcher("/**")  
        .authorizeRequests()  
        .antMatchers("/").permitAll()  
        .antMatchers("/restricted").hasAuthority("SCOPE_custom") // <- LOOK AT ME!  
        .anyRequest().authenticated()  
        .and().oauth2Login();  
}
```

You can customize the scopes that the client app requests from the Okta authorization server by adding a `scopes` property to the `application.yml` file. For example, below, I have set the `application.yml` file to request only the `openid` scope, which is required for OAuth.

```yml
okta:  
  oauth2:  
	... 
    scopes: openid
    ...
``` 

If you ran this request on the `/user/oauthinfo` endpoint, you'd get something like this:

```
User Name: 00ab834zk7eJ18e8Y0h7  
User Authorities: [Admin, Everyone, ROLE_USER, SCOPE_openid]  
Client Name: Okta  
...
```

Notice that only one scope has been assigned to the user authorities.

Try adding a custom scope. Change `okta.oauth2.scopes` property in the `application.yml` file to match:

```yml
okta:  
  oauth2:  
	... 
    scopes: openid email profile custom
    ...
```

Before you run the app and try this out, you need to add the custom scope to the Okta authorization server (if you run it now you'll get an error).

Open your Okta developer dashboard.

From the top menu, go to **API** and select **Authorization Servers**.

Select the **default** authorization server.

Click on the **Scopes** tab.

{% img blog/spring-preauthorize/add-scope.png alt:"Add New Scope" width:"800" %}{: .center-image }

Click the **Add Scope** button.
 - **Name**: `custom`
 -  **Description**: `Custom test scope`
 
 Click **Create**.

You just added a custom scope (cunningly named `custom`) to the default Okta authorization server.

One last time, run the Spring Boot app: `./gradlew bootRun`.

Navigate to `http://localhost:8080/user/oauthinfo`.

```
User Name: 00ab834zk7eJ18e8Y0h7  
User Authorities: [Admin, Everyone, ROLE_USER, SCOPE_custom, SCOPE_email, SCOPE_openid, SCOPE_profile]  
Client Name: Okta  
...
```

Success! You should see the new `SCOPE_custom` in the user authorities.

## Spring PreAuthorize, HttpSecurity, and Security in Spring Boot

You covered a ton of ground! You got a good look at Spring method-level security using `@PreAuthorize` and saw how it relates to `HttpSecurity`. You used some basic SpEL (Spring Expression Language) statements to configure authorization. You reviewed the difference between authorization and authentication. You configured Spring Boot to use Okta as an OAuth 2.0 / OIDC single sign-on provider and added a groups claim to the authentication server and the client app. You even a new **Admin** group and saw how to use the groups claim, mapped to a Spring authority, to restrict access.  Finally, you took a look at how OAuth 2.0 scopes can be used to define authorization schemes and implement them in the app.

Next stop: rocket science!

If you'd like to check out this complete project, you can [find the repo on Github](https://github.com/oktadeveloper/okta-spring-preauthorize-example).

If you'd like to learn more about Spring Boot, Spring Security, or secure user management, check out any of these great tutorials:

-   [Get Started with Spring Boot, OAuth 2.0, and Okta](/blog/2017/03/21/spring-boot-oauth)
-   [Add Single Sign-On to Your Spring Boot Web App in 15 Minutes](/blog/2017/11/20/add-sso-spring-boot-15-min)
-   [Secure Your Spring Boot Application with Multi-Factor Authentication](/blog/2018/06/12/mfa-in-spring-boot)
-   [Build a Secure API with Spring Boot and GraphQL](/blog/2018/08/16/secure-api-spring-boot-graphql)

If you want to dive deeper, take a look at the [Okta Spring Boot Starter GitHub Project](https://github.com/okta/okta-spring-boot).

If you have any questions about this post, please add a comment below. For more awesome content, follow  [@oktadev](https://twitter.com/oktadev)  on Twitter, like us  [on Facebook](https://www.facebook.com/oktadevelopers/), or subscribe to  [our YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q).
