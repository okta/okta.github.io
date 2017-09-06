---
layout: quickstart_partial
exampleDescription: Spring Auth Code Example
---


### Include the dependencies

For Apache Maven:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
    <version>1.5.6.RELEASE</version>
</dependency>
<dependency>
    <groupId>org.springframework.security.oauth</groupId>
    <artifactId>spring-security-oauth2</artifactId>
    <version>2.0.14.RELEASE</version>
</dependency>
```
For Gradle:
```groovy
compile 'org.springframework.boot:spring-boot-starter-security:1.5.6.RELEASE'
compile 'org.springframework.security.oauth:spring-security-oauth2:2.0.14.RELEASE'
```

### Configuration
Configure your [Spring properties](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html) via environment variables, system properties, your application.yaml:

```yml
security:
  oauth2:
    client:
      # From OIDC app
      clientId: # clientId
      clientSecret: # clientSecret
      # From Authorization Server's metadata
      accessTokenUri: # token_endpoint
      userAuthorizationUri: # authorization_endpoint 
      clientAuthenticationScheme: form
    resource:
      # from your Auth Server's metadata, check .well-known/openid-configuration 
      # if not in .well-known/oauth-authorization-server
      userInfoUri: # userinfo_endpoint
      preferTokenInfo: false
```

### Annotate your Application

Just add a `@EnableOAuth2Sso` annotation to your application, for example:

```java
@EnableOAuth2Sso
@SpringBootApplication
public class ExampleApplication {
    public static void main(String[] args) {
        SpringApplication.run(ExampleApplication.class, args);
    }
    
    ...
}
```

That's it! Open an incognito window (to ensure clean browser cache) and browse to [http://localhost:8080/login](http://localhost:8080/login) you will be  automatically redirected to the Okta login page.

You can read more about [Spring's OAuth 2 support](http://projects.spring.io/spring-security-oauth/docs/oauth2.html) or take a look at this [blog post](https://developer.okta.com/blog/2017/03/21/spring-boot-oauth) that describes the steps and configuration in detail.