---
layout: software
title: Library Versions
---

# Library Versions

Okta publishes a number of officially-supported libraries and SDKs on [GitHub](https://github.com/okta). These libraries follow a consistent versioning and release pattern, described here. Note that this is separate from how Okta's HTTP APIs are [versioned and released](https://developer.okta.com/docs/api/getting_started/releases-at-okta).

You can see a list of all our library versions and their support status at the [bottom of this page](#current-versions).

## Semantic Versioning

All of our libraries and SDKs follow [semantic versioning](https://semver.org/). Library versions will always be `major.minor.patch` - for example, `0.1.2` or `2.1.33`.

We will:

* Increase the **patch** version for bug fixes, security fixes, and code documentation. Backwards compatible; no breaking changes.
* Increase the **minor** version for new features and additions to the library's interface. Backwards compatible; no breaking changes.
* Increase the **major** version for breaking changes to the library's interface or breaking changes to behavior.

## Version Lifecycle

Semantic versioning means that within a **major** version, you can safely apply minor and patch updates without your code breaking. The status of each major version series (for example, `1.x` or `2.x`) follows this lifecycle:

### Beta

Beta versions are currently in development and are not ready for production use. While a library version is in beta, the code interface is not final and breaking changes could occur without warning.

New libraries (or new major versions of existing libraries) typically stay in beta for a period of time while we iterate on the design and get feedback from the community. When the library is ready for production, it will be marked as stable.

### Stable

Stable version series are supported by Okta for use in production code. Semantic versioning means that a stable major version may get new features (minor updates) or bug fixes (patch updates), but no breaking changes.

### Retiring

When a new major version of a library is released, the old major version series will be marked as **retiring**. Retiring libraries are supported by Okta for at least nine months. After this period of time, the version series will be officially retired (below).

For example, if version 2.0.0 of `okta-sdk-foobar` is published in January, the 1.x series of `okta-sdk-foobar` (any version starting 1) will be officially supported until _at least_ September. The retirement dates will be posted in the library's readme or documentation.

### Retired

Retired version series are no longer supported by Okta, and are no longer recommended for production use. Okta will not publish new features or bug fixes for retired versions, except for critical security fixes (at our discretion).

For example, after `okta-sdk-foobar` version 1.x has a retiring period (of at least nine months), it is no longer supported. Customers and developers are encouraged to upgrade to 2.0.0 or later.

When in doubt, check GitHub! The library's readme will clearly state any versions that are retiring or have been retired.

## Current Versions

This table lists the current (and historical) major versions of our open-source libraries and tools. The most up-to-date information is always available from the GitHub readme of a particular project.

| Library                                                         | Version                                                    | Status                |
| --------------------------------------------------------------- | ---------------------------------------------------------- | --------------------- |
| [Sign-In Widget][signin-widget]                                 | 1.13.0<br>[**2.9.0+**][signin-widget-latest]               | Retired<br>**Stable** |
| [Auth.js][authjs]                                               | [**1.17.0+**][authjs-latest]                               | **Stable**            |
| [Android AppAuth SDK][appauth-android]                          | [0.1.0][appauth-android-latest]                            | Beta                  |
| [Angular SDK][sdk-angular]                                      | 0.1.0<br>**1.0.1+**                                        | Retired<br>**Stable** |
| [JWT verifier for Go][go-jwt-verifier]                          | [0.x][go-jwt-verifier-latest]                              | Beta                  |
| [iOS AppAuth SDK][appauth-ios]                                  | 0.3.0<br>[**1.0.0+**][appauth-ios-latest]                  | Retired<br>**Stable** |
| [iOS OktaJWT][ios-oktajwt]                                      | 0.1.0<br>[**1.0.0+**][ios-oktajwt-latest]                  | Retired<br>**Stable** |
| [Java management SDK][sdk-java]                                 | **0.0.5**<br>[1.0.0+][sdk-java-latest]                     | **Stable**<br>Beta    |
| [Java authentication SDK][authsdk-java]                         | [**0.1.0+**][authsdk-java-latest]                          | **Stable**            |
| [JWT verifier for Java][java-jwt-verifier]                      | [**0.3.0+**][java-jwt-verifier-latest]                     | **Stable**            |
| [Spring Boot Starter][spring-boot-starter]                      | [**0.5.0+**][spring-boot-starter-latest]                   | **Stable**            |
| [.NET management SDK][sdk-dotnet]                               | [**0.3.3**][sdk-dotnet-033]<br>[1.0.0+][sdk-dotnet-latest] | **Stable**<br>Beta    |
| [Node.js management SDK][sdk-nodejs]                            | 0.4.0<br>[**1.0.0+**][sdk-nodejs-latest]                   | Retired<br>**Stable** |
| [JWT verifier for Node.js][nodejs-jwt-verifier]                 | **0.0.12+**                                                | **Stable**            |
| [OpenID Connect middleware for Node.js][nodejs-oidc-middleware] | 0.1.2                                                      | Beta                  |
| [PHP management SDK][sdk-php]                                   | 0.2.0<br>[**1.0.0+**][sdk-php-latest]                      | Retired<br>**Stable** |
| [JWT verifier for PHP][php-jwt-verifier]                        | [**0.2.1+**][php-jwt-verifier-latest]                      | **Stable**            |
| [React SDK][sdk-react]                                          | 0.0.13<br>**1.0.2+**                                       | Retired<br>**Stable** |
| [React Native SDK][sdk-react]                                   | 0.1.0                                                      | Beta                  |
| [Vue SDK][sdk-vue]                                              | 0.1.0<br>**1.0.1**                                         | Retired<br>**Stable** |


[sdk-angular]: https://github.com/okta/okta-oidc-js/tree/master/packages/okta-angular
[sdk-dotnet]: https://github.com/okta/okta-sdk-dotnet
[sdk-dotnet-033]: https://github.com/okta/okta-sdk-dotnet/releases/tag/0.3.3.0
[sdk-dotnet-latest]: https://github.com/okta/okta-sdk-dotnet/releases
[sdk-java]: https://github.com/okta/okta-sdk-java
[sdk-java-latest]: https://github.com/okta/okta-sdk-java/releases
[java-jwt-verifier]: https://github.com/okta/okta-jwt-verifier-java
[java-jwt-verifier-latest]: https://github.com/okta/okta-jwt-verifier-java/releases
[authsdk-java]: https://github.com/okta/okta-auth-java
[authsdk-java-latest]: https://github.com/okta/okta-auth-java/releases
[sdk-nodejs]: https://github.com/okta/okta-sdk-nodejs
[sdk-nodejs-latest]: https://github.com/okta/okta-sdk-nodejs/releases
[nodejs-jwt-verifier]: https://github.com/okta/okta-oidc-js/tree/master/packages/jwt-verifier
[nodejs-oidc-middleware]: https://github.com/okta/okta-oidc-js/blob/master/packages/oidc-middleware
[sdk-react]: https://github.com/okta/okta-oidc-js/blob/master/packages/okta-react
[sdk-react-native]: https://github.com/okta/okta-oidc-js/blob/master/packages/okta-react-native
[sdk-vue]: https://github.com/okta/okta-oidc-js/blob/master/packages/okta-vue
[sdk-php]: https://github.com/okta/okta-sdk-php
[sdk-php-latest]: https://github.com/okta/okta-sdk-php/releases
[php-jwt-verifier]: https://github.com/okta/okta-jwt-verifier-php
[php-jwt-verifier-latest]: https://github.com/okta/okta-jwt-verifier-php/releases
[go-jwt-verifier]: https://github.com/okta/okta-jwt-verifier-golang
[go-jwt-verifier-latest]: https://github.com/okta/okta-jwt-verifier-golang/releases
[appauth-android]: https://github.com/okta/okta-sdk-appauth-android
[appauth-android-latest]: https://github.com/okta/okta-sdk-appauth-android/releases
[appauth-ios]: https://github.com/okta/okta-sdk-appauth-ios
[appauth-ios-latest]: https://github.com/okta/okta-sdk-appauth-ios/releases
[ios-oktajwt]: https://github.com/okta/okta-ios-jwt
[ios-oktajwt-latest]: https://github.com/okta/okta-ios-jwt/releases
[spring-boot-starter]: https://github.com/okta/okta-spring-boot
[spring-boot-starter-latest]: https://github.com/okta/okta-spring-boot/releases
[signin-widget]: https://github.com/okta/okta-signin-widget
[signin-widget-latest]: https://github.com/okta/okta-signin-widget/releases
[authjs]: https://github.com/okta/okta-auth-js
[authjs-latest]: https://github.com/okta/okta-auth-js/releases
