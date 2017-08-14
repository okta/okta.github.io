---
layout: quickstart_partial
exampleDescription: Spring Implicit Example
---

### Include the dependency

For Apache Maven:
```xml
<dependency>
    <groupId>com.okta.spring</groupId>
    <artifactId>okta-spring-security-starter</artifactId>
    <version>0.1.0</version>
</dependency>
```

For Gradle:
```groovy
compile 'com.okta.spring:okta-spring-security-starter:0.1.0'
```

### Configure your properties

You can configure your applications propertis with Environment variables, System properties, or config files.  Take a look at the [Spring Boot documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html) for more details.

| Property | Default | Details |
|----------|---------|---------|
| okta.oauth.issuer     | N/A | [Authorization Server](/docs/how-to/set-up-auth-server.html) issuer URL, i.e.: https://{yourOktaDomain}.com/oauth2/default |
| okta.oauth.clientId   | N/A | The Client Id of your Okta OIDC application |
| okta.oauth.audience   | api://default | The audience of your [Authorization Server](/docs/how-to/set-up-auth-server.html) |
| okta.oauth.scopeClaim | scp | The scope claim key in the Access Token's JWT |
| okta.oauth.rolesClaim | groups | The claim key in the Access Token's JWT that corresponds to an array of the users groups. |

### That's it!

Okta's Spring Security integration will [parse the JWT access token](/blog/2017/06/21/what-the-heck-is-oauth#oauth-flows) from the Request's `Authentication` header

Check out a [Spring Boot example](https://github.com/okta/okta-spring-security/tree/master/examples) or this [blog post](https://scotch.io/@mraible/build-a-secure-notes-application-with-kotlin-typescript-and-okta). 