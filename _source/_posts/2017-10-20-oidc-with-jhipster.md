---
layout: blog_post
title: 'Use OpenID Connect Support with JHipster'
author: mraible
description: "JHipster is one of the hippest things to happen to Java developers in the last few years. This article shows you how to add single sign-on to your JHipster app with OpenID Connect (OIDC). You can even use Keycloak or Okta as your Identity Provider!"
tags: [spring boot, angular, bootstrap, jhipster, java, typescript, oidc, oauth]
---

Single sign-on (SSO) is a feature that most developers don't care about when building one-off applications for clients or themselves. However, when developing apps for their company, which will be used by employees of their business, they often need to hook into an existing identity provider. It might be Active Directory (AD), LDAP, or a myriad of other systems. Okta provides SSO for many companies around the world and allows them to configure AD and LDAP as *masters* that sync their users to the cloud.

When you use Okta as an employee, you log in once to your dashboard, then log in to the rest of your apps by clicking on bookmarks (or as we like to call them *chiclets*). If you couple this SSO system with our [API Products](https://developer.okta.com/) – which allows developers to integrate SSO into their apps – you have a compelling solution.

Speaking of compelling, have you heard of [JHipster](http://www.jhipster.tech)? JHipster is one of the hippest things to happen to Java developers in the last few years. JHipster is an application generator, and a developer platform, that allows you to build applications quickly and easily. By default, it generates a [Spring Boot](https://projects.spring.io/spring-boot/) backend and an [Angular](https://angular.io/) front-end.

You can generate boilerplate code (often called CRUD, for Create, Read, Update, and Delete) for domain objects for the application you're developing. JHipster's [JDL Studio](http://www.jhipster.tech/jdl-studio/) makes modeling domain objects as easy as creating a file that describes your entities and their relationships to one another. For example, here's what a bug tracker's JDL looks like.

{% img blog/oidc-with-jhipster/jdl-studio-example.png alt:"JDL Studio Example" width:"800" %}{: .center-image }

**NOTE:** You can find other examples at <https://github.com/jhipster/jdl-samples>.

JHipster is so hip it recently won a [Duke's Choice Award at JavaOne 2017](https://blogs.oracle.com/java/announcing-2017-dukes-choice-award-nominations). The Duke's Choice Award celebrates extreme innovation using Java technology.

{% img blog/oidc-with-jhipster/dukes-choice-award-jhipster.jpg alt:"JHipster wins a Duke's Choice Award!" width:"600" %}{: .center-image }

A week later, it won an honorable bronze at the [JAX Innovation Awards 2017](https://jaxenter.com/winners-jax-innovation-awards-2017-137993.html) for most innovative contribution to the Java ecosystem. With over 360 contributors, it's got a great community too!

<div style="max-width: 500px; margin: 0 auto">
<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">2 awards in a row for <a href="https://twitter.com/java_hipster?ref_src=twsrc%5Etfw">@java_hipster</a>, <a href="https://twitter.com/hashtag/DukesChoiceAward?src=hash&amp;ref_src=twsrc%5Etfw">#DukesChoiceAward</a> &amp; <a href="https://twitter.com/hashtag/JAXenter?src=hash&amp;ref_src=twsrc%5Etfw">#JAXenter</a> award. Feeling proud. Thanks to all our contributors &amp; amazing core team</p>&mdash; Deepu K Sasidharan (@deepu105) <a href="https://twitter.com/deepu105/status/917844704707923969?ref_src=twsrc%5Etfw">October 10, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

I've been a committer on the JHipster project ever since I [started writing the JHipster Mini-Book for InfoQ in June of 2015](http://www.jhipster-book.com/#!/news/entry/welcome-to-the-jhipster-mini-book). After developing a couple of apps with it, finding and fixing bugs along the way, I was invited to be a part of the project. Fast forward two years later, and version 4.0 of the book is [available for download](https://www.infoq.com/minibooks/jhipster-4-mini-book), and I've spoken about JHipster around the world at several conferences including Devoxx Belgium, Devoxx France, Angular Summit, and JavaOne.

## Enter OAuth 2.0

I'm a fan of [OAuth 2.0](https://oauth.net/) and [OpenID Connect](http://openid.net/connect/) (OIDC). It helps that I work for Okta, where we implement both options in our API and allow developers to use our libraries &mdash; or third party libraries &mdash; to connect. I like how OAuth will enable me to use my existing credentials at an Identity Provider (e.g., Google, Facebook, or even Okta) to log in to applications without creating a new account.

> If you want to know more about how OAuth and OIDC work, check out my article [What the Heck is OAuth](https://developer.okta.com/blog/2017/06/21/what-the-heck-is-oauth) or watch Karl McGuinness's [What the Heck is OpenID Connect talk from Oktane 17](https://www.youtube.com/watch?v=6ypYXxRPKgk).

About a month ago, I started looking into creating a JHipster Module that'd work with Okta, much like [the one I created at Stormpath](https://stormpath.com/blog/stormpath-jhipster-application). I knew that JHipster had OAuth as one of its authentication options, but I was unfamiliar with how it worked. I discovered when you chose OAuth as your authentication mechanism; it created an OAuth server and an Angular client with the client ID and client secret embedded in the code.

Embedding a client secret in a SPA (single-page app) is a no-no in OAuth-land, and should only be done for confidential clients that can hide the secret. I spoke to the team about the current OAuth implementation and since no-one was proud of it, and hardly anyone was using it, I decided to refactor the existing implementation rather than create a module.

## Add Keycloak Support

Over the last couple years, JHipster has [had](https://github.com/jhipster/generator-jhipster/issues/2465) a [few](https://github.com/jhipster/generator-jhipster/issues/6139) [requests](https://issues.jboss.org/browse/KEYCLOAK-2243?) for Keycloak integration. [Keycloak](http://www.keycloak.org/) is an open source identity and access management solution. It has an Apache 2.0 license and is run by Red Hat. It supports standard protocols like OIDC, OAuth 2.0, and SAML 2.0. You can find its [source code on GitHub](https://github.com/keycloak/keycloak).

JHipster uses [Spring Security](https://github.com/spring-projects/spring-security) and [I knew that it integrated with OAuth very easily](/blog/2017/03/21/spring-boot-oauth). After [a lengthy discussion with the JHipster community](https://github.com/gmarziou/jhipster-keycloak/issues/2#issuecomment-327007722), I decided to implement OAuth / OIDC support for JHipster using Spring Security, and nothing else. We thought about making it so the Angular client embedded a login form that was OIDC-aware, but realized we might have to have different libraries for different UI frameworks and it'd get complicated. By leveraging Spring Security and OAuth's *[authorization code flow](https://tools.ietf.org/html/rfc6749#section-4.1)*, Spring Security would handle the redirect to the Identity Provider (aka IdP) for sign in, manage the code-for-token exchange, and redirect back to the UI.

This turned out to be awesome because all we had to do was define properties for Spring Security (in `src/main/resources/config/application.yml`).

```yaml
security:
    basic:
        enabled: false
    oauth2:
        client:
            accessTokenUri: http://localhost:9080/auth/realms/jhipster/protocol/openid-connect/token
            userAuthorizationUri: http://localhost:9080/auth/realms/jhipster/protocol/openid-connect/auth
            clientId: web_app
            clientSecret: web_app
            clientAuthenticationScheme: form
            scope: openid profile email
        resource:
            userInfoUri: http://localhost:9080/auth/realms/jhipster/protocol/openid-connect/userinfo
            tokenInfoUri: http://localhost:9080/auth/realms/jhipster/protocol/openid-connect/token/introspect
            preferTokenInfo: false
```

To make Keycloak work out-of-the-box, JHipster automatically creates a `src/main/docker/keycloak.yml` file for Docker Compose that has a realm and users configured. This file uses Keycloak's image, imports the default data, and exposes the default port at `9080`.

```yml
version: '2'
services:
  keycloak:
    image: jboss/keycloak:3.3.0.CR1
    command: ["-b", "0.0.0.0", "-Dkeycloak.migration.action=import", "-Dkeycloak.migration.provider=dir", "-Dkeycloak.migration.dir=/opt/jboss/keycloak/realm-config", "-Dkeycloak.migration.strategy=OVERWRITE_EXISTING", "-Djboss.socket.binding.port-offset=1000"]
    volumes:
      - ./realm-config:/opt/jboss/keycloak/realm-config
    environment:
      - KEYCLOAK_USER=admin
      - KEYCLOAK_PASSWORD=admin
    ports:
      - 9080:9080
      - 9443:9443
      - 10990:10990
```

If you're unfamiliar with how Docker Compose works, check out Lee Brandt's [Developer's Guide to Docker Compose](/blog/2017/10/11/developers-guide-to-docker-part-3).

This means you can start Keycloak in your JHipster app's root directory using the following command.

```bash
docker-compose -f src/main/docker/keycloak.yml up
```

Once you have it up and running, you can start your app (in another terminal window or your IDE), and you'll be able to log in as you normally would with session or JWT authentication.

## Switch to Okta

The **really** cool part is you only need to override Spring Security's OAuth properties to switch from Keycloak to Okta (or likely any other IdP)!  For example, you can create a `~/.okta.env` file with the following properties:

```bash
export SECURITY_OAUTH2_CLIENT_ACCESS_TOKEN_URI="https://{yourOktaDomain}/oauth2/default/v1/token"
export SECURITY_OAUTH2_CLIENT_USER_AUTHORIZATION_URI="https://{yourOktaDomain}/oauth2/default/v1/authorize"
export SECURITY_OAUTH2_RESOURCE_USER_INFO_URI="https://{yourOktaDomain}/oauth2/default/v1/userinfo"
export SECURITY_OAUTH2_RESOURCE_TOKEN_INFO_URI="https://{yourOktaDomain}/oauth2/default/v1/introspect"
export SECURITY_OAUTH2_CLIENT_CLIENT_ID="{clientId}"
export SECURITY_OAUTH2_CLIENT_CLIENT_SECRET="{clientSecret}"
```

Of course, you'll need to create a new OIDC client in Okta and fill in the variables before this works. Once you've done that, you can run the following command to set these environment variables.

```bash
source ~/.okta.env
```

Restart your app and *voila* - you're now using Okta!

In case you don't know how to set up an OIDC app on Okta, here's a quick tutorial.

## Set Up an OIDC App on Okta

Log in to your Okta Developer account (or [sign up](https://developer.okta.com/signup/) if you don't have an account) and navigate to **Applications** > **Add Application**. Click **Web** and click **Next**. Give the app a name you'll remember, and specify `http://localhost:8080` as a Base URI and Login Redirect URI. Click **Done** and copy the client ID and secret into your `application.yml` file.

Create a `ROLE_ADMIN` and `ROLE_USER` group (**Users** > **Groups** > **Add Group**) and add users to them. You can use the account you signed up with, or create a new user (**Users** > **Add Person**). Navigate to **API** > **Authorization Servers**, click the **Authorization Servers** tab and edit the default one. Click the **Claims** tab and **Add Claim**. Name it "groups" or "roles", and include it in the ID Token. Set the value type to "Groups" and set the filter to be a Regex of `.*`.

**NOTE:** If you want to use Okta all the time (instead of Keycloak), modify JHipster's Protractor tests to use this account when running. Do this by changing the credentials in `src/test/javascript/e2e/account/account.spec.ts` and `src/test/javascript/e2e/admin/administration.spec.ts`.

## Watch a Screencast on JHipster's Refactored OAuth Support

To make things easier to understand, I created a screencast that shows you how to create a JHipster app with the new OAuth support. After building it and explaining how it works with Keycloak, I deploy it to Cloud Foundry, set its configuration to point to Okta, and demonstrate how that works. Easy peasy!

<div style="max-width: 560px; margin: 0 auto">
<iframe width="560" height="315" src="https://www.youtube.com/embed/MaqIsQB1yeQ" frameborder="0" allowfullscreen></iframe>
</div>

The source code for the project created in this screencast can be [found on GitHub](https://github.com/mraible/jhipster-oidc-example).

## PWAs with JHipster

Did you know that JHipster supports creating progressive web apps (PWAs) too? When you generate a JHipster project, it tells you how to make it a PWA in its `README.md` under the *Service Workers* heading.

Service workers are disabled by default. To enable them uncomment the service worker registering script in `src/main/webapp/index.html`:

```html
<script>
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
        .register('./sw.js')
        .then(function() { console.log('Service Worker Registered'); });
    }
</script>
```

And uncomment the copy file option in `webpack/webpack.common.js`:

```js
{ from: './src/main/webapp/sw.js', to: 'sw.js' },
```

I made my [JavaOne demo](https://github.com/mraible/javaone2017-jhipster-demo) into a PWA and deployed it to Cloud Foundry and Heroku. You can see the app received a 💯 Lighthouse score on both platforms!

<div style="max-width: 500px; margin: 0 auto">
<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">I added PWA support to my <a href="https://twitter.com/hashtag/JavaOne?src=hash&amp;ref_src=twsrc%5Etfw">#JavaOne</a> <a href="https://twitter.com/java_hipster?ref_src=twsrc%5Etfw">@java_hipster</a> demo and ran Lighthouse. <a href="https://twitter.com/heroku?ref_src=twsrc%5Etfw">@heroku</a> vs. <a href="https://twitter.com/cloudfoundry?ref_src=twsrc%5Etfw">@cloudfoundry</a>, fight! <br><br>...Heroku wins by 160ms. <a href="https://twitter.com/hashtag/pwa?src=hash&amp;ref_src=twsrc%5Etfw">#pwa</a> 💯 <a href="https://t.co/AkvwxsgeLC">pic.twitter.com/AkvwxsgeLC</a></p>&mdash; Matt Raible (@mraible) <a href="https://twitter.com/mraible/status/915378742075076608?ref_src=twsrc%5Etfw">October 4, 2017</a></blockquote>
</div>

## Learn More about JHipster

Even if you don't create your next application with JHipster, it's a great way to learn how to integrate technologies. It has NoSQL database support (MongoDB, Cassandra, and soon Couchbase), load testing support with Gatling, and i18n up the wazoo! Can you believe it currently supports 37 different languages, including right-to-left languages?!

I hope you get a chance to get hip with JHipster soon! In the meantime, here are a few related articles about the technologies mentioned in this post:

* [NoSQL Options for Java Developers](/blog/2017/09/08/nosql-options-for-java-developers), and [Part II that includes Q & A with NoSQL Experts](/blog/2017/10/10/nosql-options-for-java-developers-part-ii)
* [Develop and Deploy Microservices with JHipster](/blog/2017/06/20/develop-microservices-with-jhipster)
* [The Ultimate Guide to Progressive Web Applications](/blog/2017/07/20/the-ultimate-guide-to-progressive-web-applications)

Don't forget to check out the [JHipster Mini-Book](http://www.jhipster-book.com/) too. It's free after all! 🤓

You can follow the [@java_hipster project on Twitter](https://twitter.com/java_hipster). If you enjoyed this article, please follow us [@OktaDev](https://twitter.com/oktadev) for many more like it!
