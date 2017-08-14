---
layout: quickstart_partial
exampleDescription: Java Implicit Example
---

### Include the dependency

For Apache Maven:
```xml
<dependency>
    <groupId>com.okta.jwt</groupId>
    <artifactId>okta-jwt-verifier</artifactId>
    <version>0.1.0</version>
</dependency>
```

For Gradle:
```groovy
compile 'com.okta.jwt:okta-jwt-verifier:0.1.0'
```

### Use the API

```java
// 1. build the parser
JwtVerifier jwtVerifier = new JwtHelper()
                            .setIssuerUrl("https://{yourOktaDomain}.com/oauth2/default")
                            .setClientOrAudience("api://default")
                            .build();

// 2. Process the token (includes validation)
Jwt jwt = jwtVerifier.decodeAccessToken(jwtString);

// 3. Do something with the token
println(jwt.getTokenValue()); // print the token
println(jwt.getClaims().get("invalidKey")); // an invalid key just returns null
println((Collection) jwt.getClaims().get("groups")); // handle an array value
println(jwt.getExpiresAt()); // expiration time
```