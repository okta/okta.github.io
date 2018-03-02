---
layout: blog_post
title: "Develop a Microservices Architecture with OAuth 2.0 and JHipster"
author: mraible
description: "This post shows you how to use JHipster to create a microservices architecture based on Spring Boot, Spring Security, and OAuth."
tags: [jhipster, microservices, spring-boot, spring-security, oidc, oauth]
tweets:
- "Learn how to use JHipster to create a microservices architecture based on Spring Boot, Spring Security, and OAuth → "
- "Did you know @java_hipster makes it easy to build microservice applications with @springboot and @angular? You can even use its @oauth_2 support to add SSO! "
- "Wanna get started with @java_hipster and a microservices architecture based on @springboot and @springsecurity? We have just the 🎫! We'll even show you how to deploy it to @heroku! "
---

JHipster is a development platform to generate, develop, and deploy Spring Boot + Angular web applications and Spring microservices. It supports using many types of authentication: JWT, session-based, and OAuth 2.0. In its 5.0 release, it'll also add React as a UI option. The 5.0 version is under active development and will likely be released in the next few months.

{% img blog/microservices-jhipster-oauth/what-is-jhipster.png alt:"Spring Boot + Angular = JHipster" width:"800" %}{: .center-image }

In addition to having two popular UI frameworks, JHipster also has modules that support generating mobile applications. If you like Ionic, which currently leverages Angular, you can use [Ionic for JHipster](/blog/2018/01/30/jhipster-ionic-with-oidc-authentication). If you're a React aficionado, you can use [Ignite JHipster](https://github.com/ruddell/ignite-jhipster).

[JHipster](http://www.jhipster.tech) is 🔥, and so are microservices! Follow the instructions in this tutorial to create an API gateway, a blog microservice, and a companion store microservice.

## Install JHipster

There are six different ways to [install JHipster](http://www.jhipster.tech/installation/). The first way, [JHipster Online](https://start.jhipster.tech/), doesn't even require you to install anything. It'll generate the application and push it to a GitHub repository for you. While this works nicely, I like to have my example apps in a single repository for easier discoverability.

A local installation with Yarn or npm are other options, as is using a package manager (Homebrew on Mac, Chocalatey on Windows), using a Vagrant-based developer box, or using a Docker container. Since I'm on a Mac, I like to use Homebrew because it allows me to use JHipster with multiple Node versions without installing JHipster again. You can install JHipster on a Mac using the following command:

```bash
brew install jhipster
```

On Windows, it's as simple as:

```bash
choco install jhipster
```

Or you can use the standard npm installation:

```bash
npm install -g yo generator-jhipster
```

Create an `okta-jhipster-microservices-oauth-example` directory on your hard drive, or simply `apps` if you don't want to spell it all out.

> One of the most common things to happen with JHipster 4.x app is you'll start it, and there will be a blank page when you navigate to it in your browser. If that happens to you, you need to rebuild the front end. You can do this by running `npm run webpack:build` and restarting your server, or by running `yarn start` (which will start an auto-reloading webpack dev server on port 9000).

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

### What is OAuth 2.0?

The OAuth implementation in JHipster leverages Spring Boot and its OAuth 2.0 support (an `@EnableOAuthSso` annotation). If you're not sure what OAuth and OpenID Connect (OIDC) are, please see [What the Heck is OAuth?](/blog/2017/06/21/what-the-heck-is-oauth). It provides single sign-on (SSO) to JHipster applications. [Secure a Spring Microservices Architecture with Spring Security and OAuth 2.0](/blog/2018/02/13/secure-spring-microservices-with-oauth) shows a bare-bones Spring microservices architecture using OAuth. JHipster uses the same setup internally.

JHipster ships with [Keycloak](https://keycloak.org) configured for OAuth by default. To configure your apps to work with Okta, you'll first need to [create a free developer account](https://developer.okta.com/signup/). After doing so, you'll get your own Okta domain, which has a name like `https://dev-123456.oktapreview.com`.

### Create an OpenID Connect Application on Okta

Create an OpenID Connect (OIDC) app in Okta to get a client ID and secret. This basically means you're "registering" your application with Okta. Log in to your Okta Developer account and navigate to **Applications** > **Add Application**. Click **Web** and click the **Next** . Give the app a name you’ll remember (e.g., `JHipster Microservices`), and specify `http://localhost:8080` as a Base URI and `http://localhost:8080/login` as a Login Redirect URI. Click **Done** and make a note of your client ID and client secret values.

For the roles coming from Okta to match the default roles in JHipster, you'll need to create them. Create a `ROLE_ADMIN` and `ROLE_USER` group (**Users** > **Groups** > **Add Group**) and add users to them. You can use the account you signed up with, or create a new user (**Users** > **Add Person**). Navigate to **API** > **Authorization Servers**, click the **Authorization Servers** tab and edit the default one. Click the **Claims** tab and **Add Claim**. Name it `roles`, and include it in the ID Token. Set the value type to `Groups` and set the filter to be a Regex of `.*`.

Modify `gateway/src/main/resources/config/application.yml` to have the following values:

```yaml
security:
    basic:
        enabled: false
    oauth2:
        client:
            access-token-uri: https://{yourOktaDomain}.com/oauth2/default/v1/token
            user-authorization-uri: https://{yourOktaDomain}.com/oauth2/default/v1/authorize
            client-id: {clientId}
            client-secret: {clientSecret}
            client-authentication-scheme: form
            scope: openid profile email
        resource:
            filter-order: 3
            user-info-uri: https://{yourOktaDomain}.com/oauth2/default/v1/userinfo
            token-info-uri: https://{yourOktaDomain}.com/oauth2/default/v1/introspect
            prefer-token-info: false
```

**NOTE:** Make sure to remove the `security.oauth2.resource.jwt.key-uri` key and value. This property causes Spring Security to retrieve a public key from Keycloak, and Okta doesn't have this same functionality. I [entered an issue](https://github.com/jhipster/generator-jhipster/issues/7116) to fix this in JHipster.

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

**TIP:** If you already have Maven installed, you can just use `mvn`.

Open your browser and go to `http://localhost:8761`. Log in with `admin/admin`, and you should see a welcome page that shows the gateway has registered.

{% img blog/microservices-jhipster-oauth/jhipster-registry-with-gateway.png alt:"JHipster Registry with Gateway registered" width:"800" %}{: .center-image }

## Generate a Blog Microservice Application

In `okta-jhipster-microservices-oauth-example`, create a `blog` directory, and run `jhipster`.

```
mkdir blog && cd blog && jhipster
```

Use the following answers to generate a blog microservice with OAuth 2.0 support.

| Question | Answer |
|---|---|---|
| Type of application? | `Microservice application` |
| Name? | `blog` |
| Port? | `8081` |
| Java package name? | `com.okta.developer.blog`  |
| Which service discovery server? | `JHipster Registry` |
| Type of authentication? | `OAuth 2.0 / OIDC` |
| Type of database? | `SQL` |
| Production database? | `PostgreSQL` |
| Development database? | `H2 with disk-based persistence` |
| Spring cache? | `Yes, with Hazelcast` |
| Use Hibernate 2nd level cache? | `Yes` |
| Maven or Gradle? | `Maven` |
| Other technologies? | `Search engine using Elasticsearch` |
| Enable i18n? | `Yes` |
| Native language of application? | `English` |
| Additional languages? | `<blank>` |
| Additional testing frameworks? | `<blank>` |
| Install other generators? | `No` |


Create a `blog/blog.jh` file and fill it with the following JDL (JHipster Domain Language).

```
entity Blog {
    name String required minlength(3),
    handle String required minlength(2)
}

entity Entry {
    title String required,
    content TextBlob required,
    date ZonedDateTime required
}

entity Tag {
    name String required minlength(2)
}

relationship ManyToOne {
    Entry{blog(name)} to Blog
}

relationship ManyToMany {
    Entry{tag(name)} to Tag{entry}
}
```

**NOTE:** This schema does not have a many-to-one relationship from `Blog` to `User` because JHipster's microservices support for OAuth doesn't currently have a `User` entity. I'm [currently working to improve that](https://github.com/jhipster/generator-jhipster/issues/7065).

Run `jhipster import-jdl blog.jh` to create the backend API to power this schema. Answer `a` when prompted to overwrite `src/main/resources/config/liquibase/master.xml`.

Change directories into the `gateway` application and run `jhipster entity blog`. Specify `Y` when prompted to generate from an existing microservice. Enter `../blog` as the path to the root directory. Select `Yes, re-generate the entity` and type `a` when prompted to overwrite `src/main/webapp/app/entities/entity.module.ts`.

Run the following commands to generate the UI for `entry` and `tag`.

```bash
jhipster entity entry
jhipster entity tag
```

## Generate a Store Microservice Application

In `okta-jhipster-microservices-oauth-example`, create a `store` directory, then run `jhipster`.

```
mkdir store && cd store && jhipster
```

Use the following answers to generate a store microservice with OAuth 2.0 and MongoDB.

| Question | Answer |
|---|---|---|
| Type of application? | `Microservice application` |
| Name? | `store` |
| Port? | `8082` |
| Java package name? | `com.okta.developer.store`  |
| Which service discovery server? | `JHipster Registry` |
| Type of authentication? | `OAuth 2.0 / OIDC` |
| Type of database? | `MongoDB` |
| Spring cache? | `Yes, with Hazelcast` |
| Use Hibernate 2nd level cache? | `Yes` |
| Maven or Gradle? | `Maven` |
| Other technologies? | `Search engine using Elasticsearch` |
| Enable i18n? | `Yes` |
| Native language of application? | `English` |
| Additional languages? | `<blank>` |
| Additional testing frameworks? | `<blank>` |
| Install other generators? | `No` |

You have an empty microservice, but it needs some entities to manage! Run `jhipster entity product` to create a product entity.

| Question | Answer |
|---|---|---|
| Add a field? | `Y` |
| Field name? | `name` |
| Field type? | `String` |
| Field validation rules? | `Y`  |
| Which validation rules? | `Required` |
| Add a field? | `Y` |
| Field name? | `price` |
| Field type? | `Double` |
| Field validation rules? | `Y`  |
| Which validation rules? | `Required` and `Minimum` |
| Field minimum? | `0` |
| Add a field? | `Y` |
| Field name? | `image` |
| Field type? | `[BETA] Blob` |
| What is the content of the blob field? | `An image`  |
| Field validation rules? | `N` |
| Add a field? | `N` |
| Separate service class? | `No` |
| Pagination on entity? | `Yes, with pagination links` |

Change directories into the `gateway` application and run `jhipster entity product`. Specify `Y` when prompted to generate from an existing microservice. Enter `../store` as the path to the root directory. Select `Yes, re-generate the entity` and type `a` when prompted to overwrite `src/main/webapp/app/entities/entity.module.ts`.

## Run Your Microservices Architecture

There's a lot of services to start if you want to see all your applications running. The blog application depends on Elasticsearch and PostgreSQL, but only when running in production mode. The store app, however, needs MongoDB running. Luckily, JHipster creates Docker Compose files you can use to start MongoDB.

**NOTE:** Make sure to remove the `security.oauth2.resource.jwt.key-uri` key and value from `src/main/resources/config/application.yml` in the gateway, blog, and store apps before you try to run them.

1. Restart the gateway app since you added new entity management pages to it.
2. Start the blog app from the `blog` directory by running `mvn`.
3. Start a Docker container for MongoDB from the `store` directory by running:

    ```
    docker-compose -f src/main/docker/mongodb.yml up
    ```
  
4. Start the store app from the `store` directory by running `mvn`.

Once everything finishes starting, open a browser to `http://localhost:8080` and click **sign in**. You should be redirected to your Okta org to sign-in, then back to the gateway once you've entered valid credentials.

{% img blog/microservices-jhipster-oauth/welcome-jhipster.png alt:"Welcome, JHipster" width:"800" %}{: .center-image }

{% img blog/microservices-jhipster-oauth/okta-sign-in.png alt:"Okta Sign-In" width:"800" %}{: .center-image }

{% img blog/microservices-jhipster-oauth/jhipster-logged-in.png alt:"JHipster after Okta SSO" width:"800" %}{: .center-image }

You should be able to navigate to **Entities** > **Blog** and add a new blog record to your blog microservice.

{% img blog/microservices-jhipster-oauth/new-blog.png alt:"New Blog" width:"800" %}{: .center-image }

Navigate to **Entities** > **Product** to prove your product microservice is working. Since you added an image as a property, you'll be prompted to upload one when creating a new record.

{% img blog/microservices-jhipster-oauth/add-product-dialog.png alt:"Add Product Dialog" width:"800" %}{: .center-image }

Click **Save** and you'll know it's correctly using MongoDB based on the generated ID.

{% img blog/microservices-jhipster-oauth/new-product.png alt:"New Product" width:"800" %}{: .center-image }

### Use Docker Compose to Run Everything

Rather than starting all your services individually, you can also start them all using [Docker Compose](https://docs.docker.com/compose/).

> If you'd like to learn more about Docker Compose, see [A Developer's Guide To Docker - Docker Compose](/blog/2017/10/11/developers-guide-to-docker-part-3).

Create a `docker-compose` directory in the root directory (`okta-jhipster-microservices-oauth-example`) of your applications and run JHipster's Docker Compose sub-generator.

```
mkdir docker-compose && cd docker-compose && jhipster docker-compose
```

Answer as follows when prompted:

| Question | Answer |
|---|---|---|
| Type of application? | `Microservice application` |
| Type of gateway? | `JHipster gateway` |
| Directory location? | `../` |
| Applications to include? | `<select all>`  |
| Applications with clustered databases? | `<blank>` |
| Setup monitoring? | `Yes, with JHipster Console` |
| Additional technologies? | `Zipkin` |
| Admin password | `<choose your own>` |

You'll get a warning saying you need to generate Docker images by running the following command in the `blog`, `gateway`, and `store` directories. Stop all your running processes and build your Docker images before proceeding.

```
./mvnw verify -Pprod dockerfile:build
```

**NOTE:** Building the gateway will likely fail because of [an issue with JavaScript tests](https://github.com/jhipster/generator-jhipster/issues/7114). To workaround this issue, skip the tests with `mvn package -Pprod -DskipTests dockerfile:build`.

While you're waiting for things to build, edit `docker-compose/docker-compose.yml` and change the Spring Security settings from being hard-coded to being environment variables. Make this change for all applications and make sure to add the client ID and secret default settings don’t include those.

```yaml
- SECURITY_OAUTH2_CLIENT_ACCESS_TOKEN_URI=${SECURITY_OAUTH2_CLIENT_ACCESS_TOKEN_URI}
- SECURITY_OAUTH2_CLIENT_CLIENT_ID=${SECURITY_OAUTH2_CLIENT_CLIENT_ID}
- SECURITY_OAUTH2_CLIENT_CLIENT_SECRET=${SECURITY_OAUTH2_CLIENT_CLIENT_SECRET}
- SECURITY_OAUTH2_CLIENT_USER_AUTHORIZATION_URI=${SECURITY_OAUTH2_CLIENT_USER_AUTHORIZATION_URI}
- SECURITY_OAUTH2_RESOURCE_USER_INFO_URI=${SECURITY_OAUTH2_RESOURCE_USER_INFO_URI}
- SECURITY_OAUTH2_RESOURCE_TOKEN_INFO_URI=${SECURITY_OAUTH2_RESOURCE_TOKEN_INFO_URI}
```

**TIP:** You can run `docker-compose config` to verify the environment variables are correctly substituted.

When everything has finished building, run `docker-compose up -d` from the `docker-compose` directory. It can take a while to start all 14 containers, so now might be a good time to take a break, or go on a run. You can use Docker's Kitematic to watch the status of your images as they start.

**TIP:** Before you start everything, make sure you’ve provided adequate CPUs and Memory to Docker. It defaults to one CPU and 2 GB of memory. Not quite enough for 14 containers!

{% img blog/microservices-jhipster-oauth/kitematic.png alt:"Kitematic" width:"800" %}{: .center-image }

After you've verified everything works, you can stop all your Docker containers using the following command:

```bash
docker stop $(docker ps -a -q)
```

If you'd like to remove the images too, you can run:

```bash
docker rm $(docker ps -a -q)
```

## Deploy to Heroku

The founder of JHipster, [Julien Dubois](https://twitter.com/juliendubois), wrote a blog post on the Heroku blog titled [Bootstrapping Your Microservices Architecture with JHipster and Spring](https://blog.heroku.com/bootstrapping_your_microservices_architecture_with_jhipster_and_spring). Here's an abbreviated set of steps to deploy all your apps to Heroku.

### Deploy the JHipster Registry

Heroku and JHipster have configured a JHipster Registry for you, so you just need to click on the button below to start your own JHipster Registry:

<a href="https://dashboard.heroku.com/new?&amp;template=https%3A%2F%2Fgithub.com%2Fjhipster%2Fjhipster-registry"><img src="https://heroku-blog-files.s3.amazonaws.com/posts/1473343846-68747470733a2f2f7777772e6865726f6b7563646e2e636f6d2f6465706c6f792f627574746f6e2e706e67" alt="Deploy to Heroku"></a>

### Deploy Your Gateway and Apps

Edit `src/main/resources/config/application-prod.yml` in your gateway and apps. Remove `appname` and `instanceId` and add the following `eureka.instance` properties:
                                                                              
```yaml
eureka:
    instance:
        hostname: <unique-prefix>-<app-name>.herokuapp.com
        non-secure-port: 80
        prefer-ip-address: false
```

In the gateway, you'll also need to specify the registry's password in `src/main/resources/config/bootstrap-prod.yml`.

In each project, run `jhipster heroku` and answer the questions as follows:

| Question | Answer |
|---|---|---|
| Name to deploy as? | `<unique-prefix>-<app-name>` (e.g., okta-gateway) |
| Which region? | `us` |
| Type of deployment? | `Git` |
| JHipster Registry URL? | `https://user:pass@app.herokuapp.com/` |

After each has deployed, you'll want to run the following so they use Okta for authentication.

```bash
heroku config:set \
  SECURITY_OAUTH2_CLIENT_ACCESS_TOKEN_URI="$SECURITY_OAUTH2_CLIENT_ACCESS_TOKEN_URI" \
  SECURITY_OAUTH2_CLIENT_USER_AUTHORIZATION_URI="$SECURITY_OAUTH2_CLIENT_USER_AUTHORIZATION_URI" \
  SECURITY_OAUTH2_RESOURCE_USER_INFO_URI="$SECURITY_OAUTH2_RESOURCE_USER_INFO_URI" \
  SECURITY_OAUTH2_RESOURCE_TOKEN_INFO_URI="$SECURITY_OAUTH2_RESOURCE_TOKEN_INFO_URI" \
  SECURITY_OAUTH2_CLIENT_CLIENT_ID="$SECURITY_OAUTH2_CLIENT_CLIENT_ID" \
  SECURITY_OAUTH2_CLIENT_CLIENT_SECRET="$SECURITY_OAUTH2_CLIENT_CLIENT_SECRET"
```

To set the JHipster Registry password on your gateway app, run:

```bash
heroku config:set JHIPSTER_REGISTRY_PASSWORD="$JHIPSTER_REGISTRY_PASSWORD"
```

Then update your Okta app to have a **Login redirect URI** that matches your Heroku app (e.g., `https://okta-gateway.herokuapp.com/`). To do this, log in to your Okta account, go to **Applications** > **JHipster Microservices** > **General** > **Edit**. You'll also need to add this as a trusted origin in **API** > **Trusted Origins** > **Add Origin**.

If you chose Elasticsearch like I did, you'll need to configure it to be in-memory and use [Heroku's ephemeral filesystem](http://stackoverflow.com/questions/12416738/how-to-use-herokus-ephemeral-filesystem). Add the following Elasticsearch properties to `src/main/resources/config/application-heroku.yml` and redeploy your apps using `jhipster heroku`. You could also try adding and configuring Heroku's [Searchbox Elasticsearch add-on](https://elements.heroku.com/addons/searchbox).

```
spring:
    data:
        elasticsearch:
            cluster-name:
            cluster-nodes:
            properties:
                path:
                    logs: target/elasticsearch/log
                    data: target/elasticsearch/data
```

To see if your apps have started correctly, you can run `heroku logs --tail` in each app's directory. You may see a timeout error:

```
Error R10 (Boot timeout) -> Web process failed to bind to $PORT within 90 seconds of launch
```

If this happens, go to <https://help.heroku.com/> and click **Create a ticket** at the top. Click **Running Applications** > **Java**, scroll to the bottom, and click **Create a ticket**. Enter something like the following for the subject and description, select one of your apps, then submit it.

```
Subject: JHipster Apps Startup Timeout

Description: Hello, I have three JHipster apps that have the following error on startup:

Error R10 (Boot timeout) -> Web process failed to bind to $PORT within 90 seconds of launch

Their URLs are as follows:

* https://<your-prefix>-gateway.herokuapp.com/
* https://<your-prefix>-blog.herokuapp.com/
* https://<your-prefix>-store.herokuapp.com/

Can you please increase the timeouts on these apps?

Thanks!
```

Below are screenshots to prove everything worked after I got my timeouts increased. 😊

| {% img blog/microservices-jhipster-oauth/heroku-welcome.png alt:"Gateway on Heroku" width:"400" %} | {% img blog/microservices-jhipster-oauth/heroku-gateway-routes.png alt:"Heroku Gateway Routes" width:"400" %} |

| {% img blog/microservices-jhipster-oauth/heroku-blog.png alt:"Blog on Heroku" width:"400" %} | {% img blog/microservices-jhipster-oauth/heroku-store.png alt:"Store on Heroku" width:"400" %} |

You can find the source code for this example at https://github.com/oktadeveloper/okta-jhipster-microservices-oauth-example.

## Learn More about Microservices, OAuth 2.0, and JHipster

I hope you've enjoyed this whirlwind tour of how to create a microservices architecture with JHipster. Just because JHipster makes microservices easy doesn't mean you should use them. In the wise words of [Martin Fowler](https://martinfowler.com/articles/microservices.html) (March 2014):

> “You shouldn't start with a microservices architecture. Instead begin with a monolith, keep it modular, and split it into microservices once the monolith becomes a problem.”

Using a microservices architecture is a great way to scale development teams. However, if you don't have a large team, a [Majestic Monolith](https://m.signalvnoise.com/the-majestic-monolith-29166d022228) might work better.

To learn more about microservices, authentication, and JHipster, see the following resources.

* [Build a Microservices Architecture for Microbrews with Spring Boot](/blog/2017/06/15/build-microservices-architecture-spring-boot)
* [Secure a Spring Microservices Architecture with Spring Security, JWTs, Juiser, and Okta](/blog/2017/06/15/build-microservices-architecture-spring-boot)
* [Secure a Spring Microservices Architecture with Spring Security and OAuth 2.0](/blog/2018/02/13/secure-spring-microservices-with-oauth)
* [Use OpenID Connect Support with JHipster](/blog/2017/10/20/oidc-with-jhipster)
* [JHipster Security Documentation](http://www.jhipster.tech/security/)

If you have any feedback, I'd love to hear it! Please leave a comment below, hit me up on Twitter [@mraible](https://twitter.com/mraible), or post a question in our [Developer Forums](https://devforum.okta.com/).

