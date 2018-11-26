---
layout: blog_post
title: "Use Ionic for JHipster to Create Mobile Apps with OIDC Authentication"
author: mraible
description: "This article shows you how to use Ionic for JHipster to create a hybrid mobile app that runs on your phone. It supports JWT authentication, as well as OAuth 2.0 / OIDC. It even works with JHipster microservices!"
tags: [ionic, ionicframework, jhipster, oidc, oauth, cordova, opencollective, ios, android]
tweets:
- "Learn how to use Ionic for JHipster to create a mobile app that works with Okta for authentication → "
- "Did you know that the team behind @oktadev developed and maintains an Ionic Module for JHipster? It's pretty sweet. This blog post shows you how to use it to generate a mobile app. "
- "Just when you thought @java_hipster couldn't get any better, we released an @ionicframework module that allows generating a hybrid mobile app! You should try it; it'll be fun! 😋 "
---

We 💙 Ionic, JHipster, and Java here at Okta. Ionic is a framework for building native mobile apps using web technologies. Technically, this is called a "hybrid" app because it's not using native SDKs. Hybrid mobile apps are distributed just like native apps: they can be installed on mobile devices, and they're listed in app stores. As an end user, there's a good chance you can't tell the difference between a hybrid mobile app and a native mobile app.

JHipster is an application generator for modern web apps. It generates a Spring Boot backend, with an Angular UI. It even supports progressive web apps! In addition to being able to create standalone apps, it can also generate a microservices architecture based on Spring Boot and Spring Cloud. The apps it generates have authentication, monitoring, and management built-in. You can also use its entity generator to build CRUD apps quickly and easily.

In this post, you're going to try out [Ionic for JHipster](https://github.com/oktadeveloper/generator-jhipster-ionic), a JHipster module you can use to generate a hybrid mobile app that runs on your phone. It starts by creating a project with `ionic start` and leveraging the [Ionic JHipster Starter](https://github.com/oktadeveloper/ionic-jhipster-starter) for its files. It supports JWT authentication by default. If you have OAuth 2.0 / OIDC as your authentication mechanism, it installs OIDC support. It even works with a JHipster-generated [microservices architecture](http://www.jhipster.tech/microservices-architecture/)!

As a project, JHipster's goal is to generate an app that unifies:

* A high performance and robust Java stack on the server side with Spring Boot
* A sleek, modern, mobile-first front-end with Angular and Bootstrap
* A robust microservice architecture with JHipster Register, Netflix OSS, Elastic Stack, and Docker
* A powerful workflow to build your application with Yeoman, Webpack/Gulp, and Maven/Gradle

> We love JHipster so much; we recently became a [Gold Sponsor on Open Collective](https://opencollective.com/generator-jhipster)! 🥇

Since I wrote the first version (in 2015) of the [JHipster Mini-Book](https://www.infoq.com/minibooks/jhipster-4-mini-book), I've always wanted to add support for generating an Ionic client. I'm happy to report that my dreams have finally come true!

## Introducing the Ionic Module for JHipster! 🎉

Ionic is a framework that allows you to create mobile applications using the web technologies you know and love. It currently has Angular support, but its development team has been working on adding support for React and Vue as well. They're doing this via their [Stencil](https://stenciljs.com) project. Stencil allows you to build web components rather than framework-specific components. Since web components are standards-compliant, they can be used in a vanilla JavaScript application, or with many popular framework out-of-the-box.

[Apache Cordova](https://cordova.apache.org/) powers Ionic's mobile support. Cordova is the underlying technology that makes it possible to build and run mobile apps created with HTML, CSS, and JavaScript. It allows you to target multiple platforms (e.g., Android, iOS, Windows, Blackberry, and Ubuntu) with one code base. Pretty slick, eh?

The Ionic team has also recently released an [Ionic PWA Toolkit](https://blog.ionicframework.com/announcing-the-ionic-pwa-toolkit-beta/). The PWA Toolkit is a beta project that has everything you need to build a high-performance PWA (for example, Ionic, routing, Stencil, push notifications, lazy loading, code splitting, lazy image loading, etc.). All of Ionic's projects outside of hybrid development seem to demonstrate that Ionic has had success outside of the phone with PWA apps on the web.

## Get Started with Ionic for JHipster

JHipster requires that you have [Node.js](https://nodejs.org) and [Java 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) installed. You can install it via [Homebrew](http://brewformulas.org/Jhipster) (`brew install jhipster`), [Chocolatey](https://chocolatey.org/packages/jhipster) (`choco install jhipster`), or with npm.

```bash
npm i -g generator-jhipster
```

## Develop a Blog App with OIDC Authentication

To develop a blog application with JHipster, open a terminal window, create a directory, and run `jhipster`.

```
mkdir blog && cd blog && jhipster
```

JHipster asks many questions about the type of application you want to create and what features you'd like to include. The table below shows the choices I made to create a blog application with Angular, OAuth 2.0 / OIDC authentication, and Gradle.

| Question | Answer |
|---|---|
| Type of application? | `Monolith` |
| Name? | `blog` |
| Java package name? | `com.okta.developer`  |
| Use the JHipster Registry? | `No` |
| Type of authentication? | `OAuth 2.0 / OIDC` |
| Production database? | `PostgreSQL` |
| Development database? | `H2 with disk-based persistence` |
| Use Spring cache? | `Yes, with Ehcache` |
| Use Hibernate 2nd level cache? | `Yes` |
| Maven or Gradle? | `Gradle` |
| Other technologies? | `<blank>` |
| Client framework? | `Angular 5` |
| Enable SASS support? | `No` |
| Enable i18n? | `Yes` |
| Native language of application? | `English` |
| Additional languages? | `<blank>` |
| Additional testing frameworks? | `<blank>` |
| Install other generators? | `No` |

The project generation process will take a couple of minutes to run, depending on your internet connection speed. When it's finished, you should see output like the following.

```
Server application generated successfully.

Run your Spring Boot application:
 ./gradlew

Client application generated successfully.

Start your Webpack development server with:
 yarn start

Congratulations, JHipster execution is complete!
Application successfully committed to Git.
```

### OIDC with Keycloak and Okta

JHipster supports [OAuth 2.0 and OIDC](http://www.jhipster.tech/security/#oauth2) for authentication. [Keycloak](https://keycloak.org/) is the default Identity Provider (IdP)  configured with JHipster. Having Keycloak set by default is nice because you can use it without having an internet connection.

To log into your application, you'll need to have Keycloak up and running. The JHipster Team has created a Docker container for you that has the default users and roles. Start Keycloak using the following command.

```bash
docker-compose -f src/main/docker/keycloak.yml up
```

Start your application with `./gradlew` (or `./mvnw` if you chose Maven) and you should be able to log in using "admin/admin" for your credentials.

To switch to Okta by default, you'll first need to create an OIDC app. If you don't have an Okta Developer account, [get one today](https://developer.okta.com/signup/)!

Log in to your Okta Developer account and navigate to **Applications** > **Add Application**. Click **Web** and click the **Next** button. Give the app a name you'll remember, specify `http://localhost:8080` as a Base URI, and the following as a **Login redirect URI** and **Logout redirect URI**.

* `http://localhost:8080/login`
* `http://localhost:8100`

Click **Done** and you should see a client ID and client secret on the next screen. Edit the **General Settings** of your application and enable "Implicit (Hybrid)" grant type, and check the two boxes below it. Implicit flow needs to be allowed for your Ionic to authenticate.

Copy the client ID and secret into `src/main/resources/config/application.yml`, replacing the default `security.oauth2.*` property values.

```yaml
security:
    basic:
        enabled: false
    oauth2:
        client:
            access-token-uri: https://{yourOktaDomain}/oauth2/default/v1/token
            user-authorization-uri: https://{yourOktaDomain}/oauth2/default/v1/authorize
            client-id: {clientId}
            client-secret: {clientSecret}
            client-authentication-scheme: form
            scope: openid profile email
        resource:
            filter-order: 3
            user-info-uri: https://{yourOktaDomain}/oauth2/default/v1/userinfo
            token-info-uri: https://{yourOktaDomain}/oauth2/default/v1/introspect
            prefer-token-info: false
```

On Okta, navigate to **Users** > **Groups**. Create `ROLE_ADMIN` and `ROLE_USER` groups and add your account to them.

**TIP:** If you've installed e2e tests with Protractor, you'll need to modify them to use an Okta account when running integration tests. Change the default credentials in `src/test/javascript/e2e/account/account.spec.ts` and `src/test/javascript/e2e/admin/administration.spec.ts`. Even better, set your credentials as environment variables and read them in your Protractor tests.

Navigate to **API** > **Authorization Servers**, click the **Authorization Servers** tab and edit the default one. Click the **Claims** tab and **Add Claim**. Name it "groups" or "roles", and include it in the ID Token. Set the value type to "Groups" and set the filter to be a Regex of `.*`.

Restart your app, and you should be redirected to Okta when you try to log in.

{% img blog/jhipster-ionic/okta-login.png alt:"Okta Login" width:"800" %}{: .center-image }

Enter the credentials you used to signup for your account, and you should be redirected back to your JHipster app.

{% img blog/jhipster-ionic/jhipster-authenticated.png alt:"JHipster Authenticated" width:"800" %}{: .center-image }

### Generate Entities

To generate entities for your blog application, create a `blog.jh` file. In it, use JHipster's JHipster Domain Language (JDL) to define your data model.

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
    Blog{user(login)} to User,
    Entry{blog(name)} to Blog
}

relationship ManyToMany {
    Entry{tag(name)} to Tag{entry}
}

paginate Entry, Tag with infinite-scroll
```

Run `jhipster import-jdl blog.jh` to create all the code you'll need to manage your blog's data. Run `yarn start` and confirm that all your entities exist (and work) under the **Entities** menu.

## Develop a Mobile App with Ionic

Getting started with Ionic for JHipster is similar to JHipster. You can have to install the Ionic CLI, Yeoman, the module itself, run a command, then profit!

```bash
npm i -g generator-jhipster-ionic ionic yo
yo jhipster-ionic
```

If you have your `blog` application at `~/blog`, you should run this command from your home directory (`~`). Ionic for JHipster will prompt you for the location of your backend application. Use the default name, `ionic4j` for your app's name and choose "Yes" when asked to integrate with Cordova.

Once the installation process completes, you'll need to restart your blog app for the Java code changes made by Ionic for JHipster. It adds an `/api/auth-info` endpoint to retrieve OIDC information from the server and installs a [`ResourceServerConfiguration`](https://github.com/oktadeveloper/generator-jhipster-ionic/blob/master/generators/app/templates/src/main/java/package/config/ResourceServerConfiguration.java) class for Spring Security.

Run the following commands to start your Ionic app.

```
cd ionic4j
ionic serve
```

You'll see a screen with a sign-in button. Click on it, and you'll be redirected to Okta to authenticate.

{% img blog/jhipster-ionic/ionic-welcome.png alt:"Ionic Welcome" width:"400" %}
{% img blog/jhipster-ionic/ionic-okta-login.png alt:"Ionic Authenticated" width:"400" %}

Now that you know authentication works, you can use the entity generator to generate Ionic pages for your data model. Run the following commands (in your `~/ionic4j` directory) to generate screens for your entities.

```bash
yo jhipster-ionic:entity blog
yo jhipster-ionic:entity entry
yo jhipster-ionic:entity tag
```

Enter `../blog` as the path to your existing application. When prompted to regenerate entities and overwrite files, type "Y".

The iOS emulator runs on port 8080, so you will need to change your backend to run on a different port when running in an emulator. Change port `8080` to `8888` in the following files:

* `backend/src/main/resources/config/application-dev.yml`
* `ionic4j/src/providers/api/api.ts`

**NOTE:** You'll also need to add `http://localhost:8888/login` as a valid redirect URI in the Okta Developer Console.

Restart the blog app, then run the Ionic app with `ionic cordova emulate ios`. You should be able to log in to your Ionic app, tap **Entities** and view the list of blogs.

| {% img blog/jhipster-ionic/emulator-welcome.png alt:"Emulator Welcome" width:"300" %} | {% img blog/jhipster-ionic/emulator-entities.png alt:"Emulator Entities" width:"300" %} | {% img blog/jhipster-ionic/emulator-no-blogs.png alt:"Emulator No Blogs" width:"300" %} |

Add a blog in the JHipster app at http://localhost:8888.

{% img blog/jhipster-ionic/first-blog.png alt:"First Blog" width:"800" %}{: .center-image }

To see this new entry in your Ionic app, pull down with your mouse to simulate the pull-to-refresh gesture on a phone. Looky there - it works!

{% img blog/jhipster-ionic/emulator-first-blog.png alt:"Emulator First Blog" width:"500" %}{: .center-image }

You can try adding a second entry by clicking the + sign in the top right corner. If the keyboard doesn't show when you click on a field, navigate to **Hardware** > **Keyboard** > **Toggle Software Keyboard**.

## Why Ionic instead of a PWA?

I hope you've enjoyed this tour of Ionic for JHipster. Since JHipster supports progressive web apps (PWAs), you might be asking yourself, why Ionic instead of a PWA?

The first version of [21-Points Health](https://github.com/mraible/21-points) I wrote with JHipster 2.x was painful to use on a mobile device, mostly because it didn't have remember me support. The 4.x version of 21-Points Health is better, but it's still not great. If PWA support was better on the iPhone (and it [will be soon](https://twitter.com/rmondello/status/956256845311590400)!), I might think differently. In the meantime, I like that Ionic provides a UI that looks like a native app, and its animations and things like pull-to-refresh are hard to beat.

I want to develop the **best user experience**. Native apps are painful to distribute, but they still seem to work better than PWAs (on iOS). The beauty of the way that Ionic integrates with JHipster is you can have both! You can turn your JHipster app into a PWA (instructions are in your app's README) *and* distribute a mobile app in the app store. If you slap on some analytics, you can see which one gets more usage, and determine the best client for yourself.

## Learn More About Ionic and JHipster

I've written a thing or two about JHipster and Ionic on this blog. If you'd like to see how to deploy your Ionic app to a mobile device, I recommend reading the [deploy to a mobile device](/blog/2017/05/17/develop-a-mobile-app-with-ionic-and-spring-boot#deploy-to-a-mobile-device) section of [Tutorial: Develop a Mobile App With Ionic and Spring Boot](/blog/2017/05/17/develop-a-mobile-app-with-ionic-and-spring-boot). I showed how to add OIDC authentication to an Ionic app in [Build an Ionic App with User Authentication](https://developer.okta.com/blog/2017/08/22/build-an-ionic-app-with-user-authentication).

You can find the source code for the application developed in this post at <https://github.com/oktadeveloper/okta-ionic-jhipster-example>.

See the following posts for information on building microservices with JHipster and to learn more about its OIDC support.

* [Develop and Deploy Microservices with JHipster](/blog/2017/06/20/develop-microservices-with-jhipster)
* [Use OpenID Connect Support with JHipster](/blog/2017/10/20/oidc-with-jhipster)

Give [@oktadev](https://twitter.com/mraible) a follow on Twitter if you liked this tutorial. If you have any questions, please leave a comment or post your question to [Stack Overflow](https://www.stackoverflow.com) with a `jhipster` tag.
