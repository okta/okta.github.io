---
layout: blog_post
title: "Simple Token Authentication for Java Apps"
author: moksamedia
description: "This article explores the benefits of token authentication with JWTs for Java apps."
tags: [jwt, token auth, token authentication, client credentials, java, spring boot]
tweets:
- "Curious about token authentication in Java? We just published an interesting post which shows you how to use it with JWT!"
- "Want to learn more about OAuth 2.0, JWTs, and how they can work for token authentication? This post shows you how to do it in @java."
- "Java + JWT = token auth. Get started today!"
image: blog/featured/okta-java-short-skew.jpg
---

JSON Web Tokens have quickly become the standard for securing web applications, superseding older technologies like cookies and sessions. Used properly, they address a range of security concerns, including cross-site scripting attacks (XSS), man-in-the-middle attacks (MITM), and cross-site request forgery (CSRF). They also give us the benefit of inspectable metadata and strong cryptographic signatures. In this post, I'll take a deep dive into JWTs. First, I'll cover some theoretical ground explaining how they work. After that, I'll show you how to configure a Spring Boot app with Okta to use JWT authentication.

JSON Web Tokens are an open standard, and there are various libraries available that allow the creation, verification, and inspection of JWTs. You're going to be using [Java JWT](https://github.com/jwtk/jjwt) (a.k.a., JJWT), a Java library that provides end-to-end JWT creation and verification. JJWT was created by [Les Hazlewood](https://twitter.com/lhazlewood), lead committer to Apache Shiro, former co-founder, and CTO at Stormpath, and currently Okta's very own Senior Architect. It's open source under the Apache 2.0 License.

## Understand JWTs and their Role in Authentication

Let's first examine what `authentication` and `token` mean in this context.

**Authentication** is proving that a user is who they say they are.

A **token** is a self-contained singular chunk of information. It could have intrinsic value or not. I'll show you a particular type of token that *does* have intrinsic value and addresses a number of the concerns with session IDs.

What is a JSON Web Token? A JWT is an open standard ([RFC 7519](https://tools.ietf.org/html/rfc7519)) for using JSON to transmit information between parties as digitally signed string tokens. They can be signed with the **HMAC** algorithm or using a public/private key pair using **RSA** or **ECDSA**.

To say this another way: JWTs are a JSON token that is a URL-safe, compact, and self-contained string. Typically they carry information about a user's verified identity. They are generally encoded and encrypted. They're quickly becoming a de facto standard for token implementations across the web. URL-safe means that the token string can be used in a URL because all special characters have been encoded as simple alphanumeric characters. JWTs are also considered *opaque* because the string by itself provides no information without decoding or decryption.

Tokens are often thought of as an authorization mechanism, but they can also be used as a way to securely store and transmit information between a web application and a server, much the same way that session IDs are used.

## Use JWTs with OAuth 2.0

Many OAuth 2.0 implementations are using JWTs for their access tokens. It should be stated that the OAuth 2.0 and JWT specifications are completely separate from each other and don't have any dependencies on each other. Using JWTs as the token mechanism for OAuth 2.0 affords a lot of benefits as you'll see below.

Whatever JWT implementation you use, you'll have to store your nifty web token somewhere. Two popular options are cookies and HTML5 web storage. Both options have benefits and potential risks; a discussion of this is beyond the scope of this article, but it's worth reading up on the typical attacks mentioned above: cross-site scripting attacks (XSS), man-in-the-middle attacks (MITM), and cross-site request forgery (CSRF). Okta uses HTML5 web storage. 

Regardless of where you store the JWT, you can also entirely replace your session ID with the JWT and gain the additional benefit of accessing the meta-information directly from the session ID/JWT.

## Look at a JWT's Structure

That was a lot of acronyms. Let's look at a JWT. In the wild, JWTs are shy. Some might even say they're downright ugly or boring (depending on how you feel about 206 character strings).

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vdHJ1c3R5YXBwLmNvbS8iLCJleHAiOjEzMDA4MTkzODAsInN1YiI6InVzZXJzLzg5ODM0NjIiLCJzY29wZSI6InNlbGYgYXBpL2J1eSJ9.43DXvhrwMGeLLlP4P4izjgsBB2yrpo82oiUPhADakLs
```

Like most things in life, don't judge a JWT by its cover (remember, they're opaque). If you look carefully, you'll see that there are two periods in the string. These delimit different sections of the JWT: 

 1. the header
 2. the payload/body (or claims)
 3. the cryptographic signature.

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9
.
eyJpc3MiOiJodHRwOi8vdHJ1c3R5YXBwLmNvbS8iLCJleHAiOjEzMDA4MTkzODAsInN1YiI6InVzZXJzLzg5ODM0NjIiLCJzY29wZSI6InNlbGYgYXBpL2J1eSJ9
.
43DXvhrwMGeLLlP4P4izjgsBB2yrpo82oiUPhADakLs
```

## Peek at the Token Header

I know I said some people think JWTs are boring. Opaque, even. But if you know how to talk to them, JWTs are pretty interesting. Let's decode the example JWT and see what's inside. 

The header is simply Base64Url encoded. It tells us the type of token and the hashing algorithms used, typically HMAC SHA256 or RSA.

```json
{
  "typ": "JWT",
  "alg": "HS256"
}
```

By the way, [jsonwebtoken.io](https://www.jsonwebtoken.io/) is a great online tool for encoding and decoding JWTs. 

## Check out the Payload

The second part of the token is the **payload** or **claims**. 

```json
{
  "iss": "http://trustyapp.com/",
  "exp": 1300819380,
  "sub": "users/8983462",
  "scope": "self api/buy"
}
```

The payload contains the **claims**. Claims are statements about the entity, which is typically a user, and any additional data. There are three types of claims:

 1. Registered claims: a set of recommended claims defined in the [RFC 7519 spec](https://tools.ietf.org/html/rfc7519#section-4.1). Some examples are **iss**, **exp**, and **aud**.
 2. Public claims: user-defined claims that can be defined by the token users, but should conform to naming conventions to avoid collision (should be defined in the [IANA JSON Web Token Registry](https://www.iana.org/assignments/jwt/jwt.xhtml) or be defined as a URI that contains a collision resistant namespace) because they are in the public namespace.
 3. Private claims: arbitrary custom claims that are used to share information between parties that agree on them (and don't have to worry about name collision because they're private).

In our example above:

 - **iss** is who issued the token. This is a registered claim.
 - **exp** is when the token expired. Also a registered claim.
 - **sub** is the subject. This is usually a user identifier. Also a registered claim.
 - **scope** is a custom, private claim that is commonly used with OAuth 2.0.

The **scope** claim is commonly used to provide authorization information. For example, letting the application know what part of the application the user is authorized to access. This, of course, does not relieve the server of its duty to perform its own authorization checks. A general principle of web application security is redundancy. The client app provides one checkpoint, the server another.

The JSON data is Base64URL encoded to create the encoded payload. The encoded header and payload are used to create the **signature.**

## Inspect the Token Signature

The **signature** is the final part of the JWT structure. It takes the header, and the payload adds a secret to the hashing algorithm and spits out a hash that corresponds to the unaltered data in the rest of the JWT. Using the signature the client app and the server can verify that the token they are receiving is the original, unaltered token.

```text
HMACSHA256( 
    base64UrlEncode(header) + "." + 
    base64UrlEncode(payload), 
    secret
)
```

It's super important to understand that this the signature does not provide confidentiality. **This information is publicly visible.** The signature guarantees that the token hasn't been tampered with, but it doesn't hide the data (a small child can decode Base64 on their uncle's iPhone 4). **A JWT must be encrypted if you want to send sensitive information.**

It is generally accepted practice to store a user identifier in the form of a sub-claim. When a JWT is signed, it's referred to as a JWS. When it's encrypted, it's referred to as a JWE.

**Statelessness** is one of the big benefits of JWTs. The server does not need to store any session data. It can all be stored in the token and is passed back and forth between the app and the server. This may seem like a strange game of e-frisbee, but this model scales really well (so long as the session state is relatively small, which it should be, really). It's far faster and more performant to decode the sessions state from the JWT than it is to have to hit the database on every request just to retrieve some basic user state information from session storage.

## Use Java to Create and Verify JWTs

Did I already mention our JJWT project? Check out its [GitHub page](https://github.com/jwtk/jjwt). It's a fully open-source JWT solution for Java.

Let's look at an example of using JJWT to create a JWT.

```java
import io.jsonwebtoken.Jwts;  
import io.jsonwebtoken.SignatureAlgorithm;  
  
byte[] key = getSignatureKey();  
  
String jwt = Jwts.builder().setIssuer("http://trustyapp.com/")  
    .setSubject("users/1300819380")  
    .setExpiration(expirationDate)  
    .put("scope", "self api/buy")  
    .signWith(SignatureAlgorithm.HS256,key)  
    .compact();
```

The library uses a fluent builder API. Notice the setters used for setting claims. Standard claims have predefined setters, such as `setSubject("users/1300819380")`, while custom claims use a key value `put()` method. For example the **scope** claim, `put("scope", "self api/buy")`.

It's just as easy to verify a JWT.

```java
String subject = "HACKER";  
  
try {  
    Jws jwtClaims = Jwts.parser().setSigningKey(key).parseClaimsJws(jwt);  
    subject = claims.getBody().getSubject();  
    // OK, you can trust this JWT  
} 
catch (SignatureException e) {  
    // don't trust this JWT!  
}
```

If the JWT has been tampered with in any way, parsing the claims will throw a `SignatureException` and the value of the `subject` variable will stay `HACKER`. If it's a valid JWT, then `subject` will be extracted from it: `claims.getBody().getSubject()`.

## Understand OAuth 2.0 for Token Authentication in Java

In just a moment you'll use Okta's OAuth 2.0 implementation to create a Spring Boot application. But first, you should make sure you understand what OAuth is, and what it is not.

In short, OAuth 2.0 is "the industry-standard protocol for authorization" (from the [OAuth.net website](https://oauth.net/2/)). **Authorization** means that it provides a way for applications to ensure that a user has permission to perform an action or access a resource. OAuth 2.0 **does not provide tools to validate a user's identity.** 

That's authentication. 

There is another protocol layer called OpenID Connect, or OIDC, that is often paired with OAuth 2.0 that provides authentication. OIDC is built on top of OAuth 2.0 and provides a way to verify a user's identity, usually by having them log in using a username and password, or by using one of the many social login options.  Because OIDC _does_ verify a user's identity, in partnership with OAuth 2.0, together they provide a complete authentication and authorization protocol for web applications and servers.

Remember: 
 - OIDC is authentication, or who am I?
 - OAuth is authorization, or what can I do?

## Configure Your Okta OIDC Application for Token Authentication in Java

Soon you'll be generating and validating JWTs like a pro. But first, you need to head over to [developer.okta.com](https://developer.okta.com) and create an OpenID Connect (OIDC) application. If you haven't already, register for a free developer account. Did I mention it's totally free?

Log into your Okta developer dashboard. Go to **Applications** and then click the **Add Application** button.

Select the **Web** application type and click **Next**.

{% img blog/java-token-auth/create-new-app.png alt:"Create Okta App" width:"700" %}{: .center-image }

On the next page, you'll need to give your new application a catchy name. You can name it whatever you like. You'll also need to check the **Client Credentials** checkbox. This activates the `client_credentials` grant type that you're going to use in a bit.

{% img blog/java-token-auth/client-credentials.png alt:"App with Client Credentials" width:"600" %}{: .center-image }

Click **Done**.

Take note of the **Client ID** and **Client Secret** at the bottom of the following page. You'll need these later.

{% img blog/java-token-auth/client-id+secret.png alt:"Client ID and Client Secret" width:"700" %}{: .center-image }

## Install HTTPie

We're going to use a great command line utility to run a few examples: HTTPie. If you don't already have it installed, head over to [their website](https://httpie.org/) and get it installed.

## Request a JWT

The time has come. I know you're excited. You're finally going to meet your JWT. 

I know you're raring to go, but there's one more preliminary step you need to take care of. You need to encode your Client ID and Client Secret from your Okta OIDC application above for use in an HTTP basic authorization header.

The general format is:

`Authorization: Basic Base64Encode(< your client id >:< your client secret >)`

Notice the `:` in the middle. Take your Client ID and join it to your Client Secret with a colon. Base64 encode the resultant string (tip: use [base64encode.org](https://www.base64encode.org)). Then include it in your request. It will look something like this:

`Authorization: Basic ABChZzU4NDg5YW1aTDCBCB4waDc6TUp3YWN4RU5WNzQ1bEdQNWJPdlFETV9iaDE5NGp1eHQ3SXJfdWEzQQ==`

There are various utilities available on the internet that will do this for you. While these can be helpful for tutorials and scratch development, for hopefully obvious reasons, it's not a great idea to use these for encoding production credentials.

The next thing you're going to want is the token request URL for your Okta OIDC app. This will be your Okta authorization server base URL plus `/v1/token`. Go to **API** from the top menu and select **Authorization Servers**. Look at the **Issuer URI** for the default server.  Add `/v1/token`.

For example, something like:
`https://{yourOktaDomain}/oauth2/default/v1/token`

Using HTTPie, your terminal command will look like this:

```bash
http -f POST https://{yourOktaDomain}/oauth2/default/v1/token \
'Authorization: Basic MG9hZzU4NDg5YW1aTDBNRU4wa...' \
grant_type=client_credentials
```
What's going on here?

`-f` is the forms flag. `Content-Type` is set to `application/x-www-form-urlencoded; charset=utf-8` and the command line is parsed for form data using `key=value` notation.

`POST` is the HTTP request type.

`https://{yourOktaDomain}/oauth2/default/v1/token` is the token request URL.

`'Authorization: Basic ...'` sets the basic auth header.

`grant_type=client_credentials` is a form value that tells Okta the grant type we're requesting. More on this in a second.

If you run this command - go ahead! - you're going to get an `invalid scope` error.

```bash
HTTP/1.1 400 Bad Request
Cache-Control: no-cache, no-store
Connection: close
Content-Type: application/json;charset=UTF-8
...

{
    "error": "invalid_scope",
    "error_description": "The authorization server resource does not have any configured default scopes, 'scope' must be provided."
}
```

Using the `client_credentials` grant type is really just a convenience. It's a type of grant that allows us to request a JWT without having to follow a browser redirect. `client_credentials` is typically used for API interactions.

According to the [OAuth specs](https://oauth.net/2/grant-types/client-credentials/), "The Client Credentials grant type is used by clients to obtain an access token outside of the context of a user. This is typically used by clients to access resources about themselves rather than to access a user's resources."

When using Okta as a Single Sign-On provider - a more common use case - you can use the [Authorization Code Grant](https://oauth.net/2/grant-types/authorization-code/). This grant type, in which the application allows the user to log in and exchanges an authorization code for an access token, however, requires a series of redirects that would be difficult to manage from a command line client such as HTTPie. As such, this tutorial uses the Client Credentials grant type as a convenience to demonstrate some basic OAuth/JWT features.

"Great," you're hopefully thinking, "but what about the scope error?"

Glad you asked!

Scopes provide a way of defining and limiting the access granted by the token. Quite often when authorizing and authenticating a user, you would use a series of scopes like `openid email profile`. These scopes tell the server that the application would like access to the user's profile, email address, and would like to make an OpenID authentication request.

The Client Credentials grant type requires us to define a custom scope. That's what the `invalid scope` error is complaining about.

Let's fix it!

## Add a Custom Scope

Head back over to [developer.okta.com](https://developer.okta.com). From the top menu, go to **API** and **Authorization Servers**. 

Click on the **default** server from the list of servers.

Click on the **Scopes** tab, and click the **Add Scope** button.

Name the scope "customScope", give it a description, and click **Create**. You'll need the name to match, but the description is arbitrary.

{% img blog/java-token-auth/add-scope.png alt:"Add Custom Scope" width:"700" %}{: .center-image }

## Run the Token Request Again

Rerun the request, this time with the custom scope.

```bash
http -f POST https://{yourOktaDomain}/oauth2/default/v1/token \
'Authorization: Basic MG9hZzU4NDg5YW1aTDBN...' \
grant_type=client_credentials \
scope=customScope
```

This time you'll get a token!

```bash
HTTP/1.1 200 OK
Cache-Control: no-cache, no-store
Connection: Keep-Alive
Content-Type: application/json;charset=UTF-8
Pragma: no-cache
...
```
```json
{
    "access_token": "eyJraWQiOiJldjFpay1DS3UzYjJXS3QzSVl1MlJZc3...",
    "expires_in": 3600,
    "scope": "customScope",
    "token_type": "Bearer"
}
```

Notice the `Cache-Control` and `Pragma` headers. You don't want this response being cached anywhere. The `access_token` is what will be used by the browser in subsequent requests. Remember that there is no requirement to use JWTs as OAuth 2.0 access tokens. They're just super handy because you can encode tamper-proof (and potentially confidential) metadata inside them.

## Use Your Access Token

To include an access token in a request, use the `Authorization` header, with a type `Bearer`. Below is an example GET request.

```bash
GET /admin HTTP/1.1
Authorization: Bearer eyJraWQiOiJldjFpay1DS3UzYjJXS3QzSVl1MlJZc3...
```

## Enter Spring Boot for Token Authentication in Java

Are you ready for some Java? I'm ready for some Java.

The first thing you're going to want to do is clone [our example app from the GitHub repository](https://github.com/oktadeveloper/okta-spring-boot-token-auth-example.git).

Now check out the `start` branch with the following terminal command:

```bash
git clone -b start https://github.com/oktadeveloper/okta-spring-boot-token-auth-example.git
```

This application is super simple. At least, it appears super simple. In fact, behind the scenes, Spring Boot and Okta are doing some pretty heavy hitting to provide you with a fully functional REST resource server complete with JWT token authentication using OAuth 2.0 and your Okta OIDC application. BAM!

The only configuration that needs to happen is in the `src/main/resources/application.yml` file. You need to fill in your **Client ID** and **Client Secret** from the Okta OIDC application you created a few steps above. You used these to generate your token. They roughly (kinda sorta, if you squint) correspond to a username and password for your OIDC application.

```yml
server:  
  port: 8080  
                                         
okta:  
  oauth2: 
    issuer: https://{yourOktaDomain}/oauth2/default  
    clientId: {yourClientId}
    clientSecret: {yourClientSecret}
```

That's all you need to do! At this point, you have a fully functioning (if not super exciting) Spring Boot resource server. 

The entry point to the application is in the `Application.java` file:

```java
@EnableResourceServer  
@SpringBootApplication  
public class Application {  
    public static void main(String[] args) {  
        SpringApplication.run(Application.class, args);  
    }
}
```

You'll notice this is where the good-old-fashioned `main()` method lives. Feels a bit like a relic these days, but that's where all the magic starts. Behind every silly cat video and heated Facebook political argument somewhere there's a `main()` method that started it all.

You're using the `SpringApplication.run()` method to bootstrap the Spring framework, which loads the `Application` class. This picks up the `@EnableResourceServer` and `@SpringBootApplication` annotations. The `@SpringBootApplication` tells Spring to load Spring Boot. The `@EnableResourceServer` configures the Spring Boot app to authenticate requests via an OAuth token (as opposed to, perhaps, OAuth 2.0 Single Sign-On). 

The `@EnableResourceServer` has a couple of implications that are worth pointing out. If you take a look at the [documentation for the annotation](https://docs.spring.io/spring-security/oauth/apidocs/org/springframework/security/oauth2/config/annotation/web/configuration/EnableResourceServer.html), you'll see a couple of important points: if you want to configure the resource server, you need to define a `ResourceServerConfigurerAdapter` bean; and a `WebSecurityConfigurerAdapter` bean is added with a hard-coded order of 3.

Why should you care? Because in a more complex web application, you're gonna want to configure the permissions using both a `ResourceServerConfigurerAdapter` and a `WebSecurityConfigurerAdapter`.  This is a change from simply using the `WebSecurityConfigurerAdapter`, as you do when you use the `@EnableOAuth2Sso` annotation, so I thought I'd warn you about it. Typically the resource server endpoints would start with `/api` or something and would be configured and protected by the `ResourceServerConfigurerAdapter` while any other plain HTML endpoints would be configured by the `WebSecurityConfigurerAdapter`. However, you'll need to add `@Order(Ordered.HIGHEST_PRECEDENCE)` to the `WebSecurityConfigurerAdapter`  to have it take precedence over the default one with the hard-coded order.

Take a look at [the `full-config` branch](https://github.com/oktadeveloper/okta-spring-boot-token-auth-example/tree/full-config) if you want to see a more concrete example of how this is done. You can also take a peek at the Siva Tech article in the links at the end.

All that aside, let's take a look at the `HelloController` class.

```java
@RestController
public class HelloController {  
  
    @RequestMapping("/")  
    public String home(java.security.Principal user) {  
        return "Hello " + user.getName();  
    }
}
```

The `@RestController` annotation is a combination of the `@Controller` and `@ResponseBody` annotations. 

`@Controller` tells Spring Boot that this class is a controller class and to look for URL request mappings to methods inside.

`@ResponseBody` indicates that the controller methods return raw response data and do not map to template names. This is how it returns simple strings instead of using Spring's model and view template system.

`@RequestMapping("/")` indicates mapping the `home()` method to the base URL.

Notice the use of dependency injection to get the `java.security.Principal`. A lot of auto-magicking goes into making this work. Spring and Okta work together to verify the token and communicate back and forth according to the OAuth 2.0 and OpenID Connect specs, authenticating the user and providing the JWT authorization token that contains the metadata that has the user's "name." 

## Run the Spring Boot App 

Alright. Let's make it happen!

Run the Spring Boot app with the following command: `./gradlew bootRun`.

You should see a whole lot of text that ends in something like this:

```bash
...
[main] INFO org.springframework.jmx.export.annotation.AnnotationMBeanExporter - Registering beans for JMX exposure on startup
[main] INFO org.springframework.boot.web.embedded.tomcat.TomcatWebServer - Tomcat started on port(s): 8080 (http) with context path ''
[main] INFO com.okta.springboottokenauth.Application - Started Application in 21.209 seconds (JVM running for 21.709)
[2018-10-11 10:31:58.646] - 22235 INFO [http-nio-8080-exec-1] --- org.apache.catalina.core.ContainerBase.[Tomcat].[localhost].[/]: Initializing Spring FrameworkServlet 'dispatcherServlet'
[http-nio-8080-exec-1] INFO org.springframework.web.servlet.DispatcherServlet - FrameworkServlet 'dispatcherServlet': initialization started
[http-nio-8080-exec-1] INFO org.springframework.web.servlet.DispatcherServlet - FrameworkServlet 'dispatcherServlet': initialization completed in 13 ms
```

## Use the JWT for Authentication

With the Spring Boot app now running, use HTTPie to run a GET request **without** the token:

```bash
http GET http://localhost:8080
```

You'll get a 401 / Unauthorized:

```bash
HTTP/1.1 401
Cache-Control: no-store
Content-Type: application/json;charset=UTF-8
...
{
    "error": "unauthorized",
    "error_description": "Full authentication is required to access this resource"
}
```

Rerun it, this time including your token (depending on how much time has passed, you may need to request a fresh token):

```bash
http GET :8080 'Authorization: Bearer eyJraWQiOiJldjFpay1DS3UzYjJXS3QzSVl1...'
```

**TIP:** If you get an `invalid_token` error that says "Invalid JOSE Header kid", there's a good chance you updated `application.yml` with incorrect values.

Assuming your token is still valid, you'll get a HTTP 200:

```bash
HTTP/1.1 200
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Content-Length: 26
Content-Type: text/plain;charset=UTF-8
...

Hello 0oag58489amZL0MEN0h7
```

`0oag58489amZL0MEN0h7` will be your Client ID. 

Remember that you're using the `client_credentials` grant type, and you sent the server your **Client ID** and **Client Secret** as your credentials. Thus the authorization server is sending back your Client ID as your "name". In a different scenario, say using an Authorization Code Grant, this would be the user's name (or perhaps their email address or username). 

## Learn More about Token Authentication and Building Secure Apps in Java

Understanding token authentication is central to building modern web applications. There are two main methods used to sign and encrypt tokens: hashing and public/private keys. Both methods are fundamental to security on the internet. Check out the [wikipedia page](https://en.wikipedia.org/wiki/HMAC) on HMACs to continue learning about the hash-based message authentication code (HMAC) used in JWTs. To learn about public/private key encryption, [Red Hat has an excellent introduction](https://access.redhat.com/documentation/en-US/Red_Hat_Certificate_System/8.1/html/Deploy_and_Install_Guide/Introduction_to_Public_Key_Cryptography.html).

Once you feel really solid about those two technologies, you can take a look at [this great tutorial on Medium](https://medium.com/vandium-software/5-easy-steps-to-understanding-json-web-tokens-jwt-1164c0adfcec) about JWTs.
  
You may also want to check out the [RFC Spec](https://tools.ietf.org/html/rfc7519).

More on the Spring end, I found [this tutorial by Siva Tech Lab](http://sivatechlab.com/secure-rest-api-using-spring-security-oauth2-part-3/) to be helpful demonstrating how to implement a Spring Boot app using OAuth 2.0.
 
 Here are some more links from the Okta blog to keep you going:
 
- [Get Started with Spring Boot, OAuth 2.0, and Okta](/blog/2017/03/21/spring-boot-oauth)
- [10 Excellent Ways to Secure Your Spring Boot Application](/blog/2018/07/30/10-ways-to-secure-spring-boot)
- [What Happens If Your JWT Is Stolen?](/blog/2018/06/20/what-happens-if-your-jwt-is-stolen)
- [Build and Secure Microservices with Spring Boot 2.0 and OAuth 2.0](/blog/2018/05/17/microservices-spring-boot-2-oauth)

If you have any questions about this post, please add a comment below. For more awesome content, follow  [@oktadev](https://twitter.com/oktadev)  on Twitter, like us  [on Facebook](https://www.facebook.com/oktadevelopers/), or subscribe to  [our YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q).