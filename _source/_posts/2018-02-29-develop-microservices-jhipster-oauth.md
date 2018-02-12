---
layout: blog_post
title: "Develop a Microservices Architecture with JHipster and OAuth"
author: mraible
description: "This article shows you how to use JHipster to create a microservices architecture based on Spring Boot, Spring Security, and OAuth."
tags: [jhipster, microservices, spring-boot, spring-security, oidc, oauth]
tweets:
- "Learn how to use JHipster to create a microservices architecture based on Spring Boot, Spring Security, and OAuth → "
- "Did you know @java_hipster makes it easy to build microservice applications with @springboot and @angular? You can even use its @oauth_2 support to add SSO! "
- "Wanna get started with @java_hipster and a microservices architecture based on @springboot and @springsecurity? We have just the 🎫! We'll even show you how to deploy it to @heroku! "
---

JHipster is an application generator that allows you to generate applications with a Spring Boot backend and an Angular UI. In its 5.0 release, it'll also add React as a UI option. The 5.0 release is under active development and will likely be released in the next few months.

{% img blog/microservices-jhipster-oauth/what-is-jhipster.png alt:"Spring Boot + Angular = JHipster" width:"800" %}{: .center-image }

In addition to having two very popular UI frameworks, JHipster also has modules that support generating mobile applications. If you like Ionic, which currently leverages Angular, you can use [Ionic for JHipster](/blog/2018/01/30/jhipster-ionic-with-oidc-authentication). If you're more of a React aficionado, you can use [Ignite JHipster](https://github.com/ruddell/ignite-jhipster).

JHipster is 🔥, and so are microservices! Follow the instructions in this tutorial to create an API gateway, a blog microservice, and a companion store microservice.

## Install JHipster

There are six different ways to [install JHipster](http://www.jhipster.tech/installation/). The first way, [JHipster Online](https://start.jhipster.tech/), doesn't even require you to install anything. It'll generate the application and push it to a GitHub repository for you. While this works nicely, I like to have my example apps in a single repository for easier discoverability. 

Local installation with Yarn or npm are other options, as is using a package manager (Homebrew on Mac, Chocalatey on Windows), using a Vagrant-based developer box, or using a Docker container. Since I'm on a Mac, I like to use Homebrew because it allows me to use JHipster with multiple Node versions without installing JHipster again. You can install JHipster on a Mac using the following command:

```bash
brew install jhipster
```

On Windows, it's as simple as:

```bash
choco install jhipster
```

Or you can use the classic npm installation:

```bash
npm install -g yo generator-jhipster
```

Create an `okta-jhipster-microservices-oauth-example` directory on your hard drive, or simply `apps` if you don't want to spell it all out. 

## Generate an API Gateway

To generate an API Gateway with JHipster, open a terminal window, navigate to `okta-jhipster-microservices-oauth-example`, create a `gateway` directory, and run `jhipster`.

```
mkdir gateway && cd gateway && jhipster
```

JHipster asks a multitude of questions about the application you want to create and what features you’d like to include. Use the following answers to generate a gateway with OAuth 2.0 support.

| Question | Answer |
|---|---|---|
| Type of application? | `Microservice gateway` |
| Name? | `gateway` |
| Port? | `8080` |
| Java package name? | `com.okta.developer.gateway`  |
| Which service discovery server? | `JHipster Registry` |
| Type of authentication? | `OAuth 2.0 / OIDC` |
| Type of database? | `SQL` |
| Production database? | `PostgreSQL` | 
| Development database? | `H2 with disk-based persistence` |
| Use Hibernate 2nd level cache? | `Yes` |
| Maven or Gradle? | `Maven` |
| Other technologies? | `<blank>` |
| Client framework? | `Angular 5` |
| Enable SASS support? | `No` |
| Enable i18n? | `Yes` |
| Native language of application? | `English` |
| Additional languages? | `<blank>` |
| Additional testing frameworks? | `Protractor` |
| Install other generators? | `No` |

The project generation process will take several minutes to run, depending on your internet connection speed.

While you're waiting, you can get started with setting up OAuth with Okta.

### What is OAuth?

The OAuth implementation in JHipster leverages Spring Boot and its OAuth 2.0 support (an `@EnableOAuthSso` annotation). If you're not sure what OAuth and OpenID Connect (OIDC) are, please see [What the Heck is OAuth?](/blog/2017/06/21/what-the-heck-is-oauth). Basically, it provides single sign-on (SSO) to JHipster applications. [Securing Microservices with Spring Security OAuth] shows a bare-bones Spring microservices architecture using OAuth. JHipster uses the same setup internally.

JHipster ships with [Keycloak](https://keycloak.org) configured for OAuth by default. To configure your apps to work with Okta, you'll first need to [create a free developer account](https://developer.okta.com/signup/). After doing so, you'll get your own Okta domain, that has a name like `https://dev-123456.oktapreview.com`. 

### Create an OIDC Application on Okta

Create an OIDC App in Okta to get a client ID and secret. This basically means you're "registering" your application with Okta. Log in to your Okta Developer account and navigate to **Applications** > **Add Application**. Click **Web** and click the **Next** button. Give the app a name you’ll remember (e.g., `JHipster Microservices`), and specify `http://localhost:8080` as a Base URI and `http://localhost:8080/login` as a Login Redirect URI. Click **Done** and make note of your client ID and client secret values.

In order for the roles coming from Okta to match the default roles in JHipster, you'll need to create them. Create a `ROLE_ADMIN` and `ROLE_USER` group (**Users** > **Groups** > **Add Group**) and add users to them. You can use the account you signed up with, or create a new user (**Users** > **Add Person**). Navigate to **API** > **Authorization Servers**, click the **Authorization Servers** tab and edit the default one. Click the **Claims** tab and **Add Claim**. Name it `roles`, and include it in the ID Token. Set the value type to `Groups` and set the filter to be a Regex of `.*`.

Modify `gateway/src/main/resources/config/application.yml` to have the following values:

```yaml
security:
    basic:
        enabled: false
    oauth2:
        client:
            accessTokenUri: https://{yourOktaDomain}.com/oauth2/default/v1/token
            userAuthorizationUri: https://{yourOktaDomain}.com/oauth2/default/v1/authorize
            clientId: {clientId}
            clientSecret: {clientSecret}
            clientAuthenticationScheme: form
            scope: openid profile email
        resource:
            userInfoUri: https://{yourOktaDomain}.com/oauth2/default/v1/userinfo
            tokenInfoUri: https://{yourOktaDomain}.com/oauth2/default/v1/introspect
            preferTokenInfo: false
```

You can also use environment variables to override the default values. Using this technique is recommend because 1) You don't need to modify the values in each microservice application and 2) it prevents you from leaking your client secret in a source code repository.

```bash
export SECURITY_OAUTH2_CLIENT_ACCESS_TOKEN_URI="https://{yourOktaDomain}.com/oauth2/default/v1/token"
export SECURITY_OAUTH2_CLIENT_USER_AUTHORIZATION_URI="https://{yourOktaDomain}.com/oauth2/default/v1/authorize"
export SECURITY_OAUTH2_RESOURCE_USER_INFO_URI="https://{yourOktaDomain}.com/oauth2/default/v1/userinfo"
export SECURITY_OAUTH2_RESOURCE_TOKEN_INFO_URI="https://{yourOktaDomain}.com/oauth2/default/v1/introspect"
export SECURITY_OAUTH2_CLIENT_CLIENT_ID="{clientId}"
export SECURITY_OAUTH2_CLIENT_CLIENT_SECRET="{clientSecret}"
```

**TIP:** If you're using JHipster’s Protractor support, you'll want to add a user to the `ROLE_ADMIN` group on Okta and change the credentials in `src/test/javascript/e2e/account/account.spec.ts` and `src/test/javascript/e2e/admin/administration.spec.ts`.

## Install the JHipster Registry

You'll need a service discovery server installed before you can start the gateway. In a browser, go to the [JHipster Registry release page](https://github.com/jhipster/jhipster-registry/releases) and download the latest release. At the time of this writing, it was v3.2.4.

Download the WAR and put it alongside your `gateway` application. Start it so your apps can register with it.

```java
java -jar jhipster-registry-3.2.4.war
```

Start the `gateway` app by navigating to its directory in a terminal and running:

```java
./mvnw
```

**TIP:** If you already have Maven installed, you can simply use `mvn`.

## Generate a Blog Microservice Application

## Generate a Store Microservice Application

## Run Your Microservices Architecture

## Use Docker Compose to Run Everything

## Deploy to Heroku

## Learn More about 

