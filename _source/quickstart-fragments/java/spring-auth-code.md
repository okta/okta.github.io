---
layout: quickstart_partial
exampleDescription: Spring Auth Code Example
---

## Okta Java/Spring Quickstart

Now that your users can sign in, let's add authentication to your server.

### Include the dependencies

For Apache Maven:
```xml
<dependency>
    <groupId>com.okta.spring</groupId>
    <artifactId>okta-spring-boot-starter</artifactId>
    <version>{{ site.versions.spring_boot_starter }}</version>
</dependency>
```
For Gradle:
```groovy
compile 'com.okta.spring:okta-spring-boot-starter:{{ site.versions.spring_boot_starter }}'
```

### Configure your properties

You can configure your applications properties with environment variables, system properties, or configuration files. Take a look at the [Spring Boot documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html) for more details.

An example `application.properties` file would look like:
{% include domain-admin-warning.html %}

```properties
okta.oauth2.issuer=https://{yourOktaDomain}/oauth2/default
okta.oauth2.clientId={yourClientId}
okta.oauth2.clientSecret={yourClientSecret}
# Configure the callback URL to match the previous section
security.oauth2.sso.loginPath=/authorization-code/callback
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

That's it! Open an incognito window (to ensure clean browser cache) and browse to `http://localhost:8080/login` you will be  automatically redirected to the Okta login page.

You can read more about [Spring's OAuth 2 support](http://projects.spring.io/spring-security-oauth/docs/oauth2.html) or take a look at this [blog post](https://developer.okta.com/blog/2017/03/21/spring-boot-oauth) that describes the steps and configuration in detail.
