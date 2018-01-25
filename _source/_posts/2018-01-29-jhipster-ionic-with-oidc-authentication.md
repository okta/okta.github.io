---
layout: blog_post
title: "Use Ionic for JHipster to Create Mobile Apps with OIDC Authentication"
author: mraible
tags: [ionic, ionicframework, jhipster, oidc, oauth, cordova, opencollective, ios, android]
tweets:
 - "Learn how to use Ionic for JHipster to create a mobile app that works with Okta for authenticatino → "
 - "Did you know that the @oktadev developed and maintains an Ionic Module for JHipster? It's pretty sweet. This blog post shows you how to use it to generate a mobile app. "
 - "Just when you thought @java_hipster couldn't get any better, we released an @ionicframework module that allows to generate a hybrid mobile app! You should try it, it'll be fun! 😋 "
---

We 💙 JHipster and Java here at Okta. JHipster is an an application generator for modern web apps. It generates a Spring Boot backend, with an Angular frontend. It even supports progressive web apps! In addition to being able to generate standalone apps, it can also generate a microservices architecture based on Spring Boot and Spring Cloud. The apps it generates have authentication, monitoring, and management built in. You can also use its entity generator to build CRUD apps quickly and easil. 

As a project, JHipster's goal is to generate an app that unifies:

* A high performance and robust Java stack on the server side with Spring Boot
* A sleek, modern, mobile-first front-end with Angular and Bootstrap
* A robust microservice architecture with JHipster Register, Netflix OSS, Elastic Stack, and Docker
* A powerful workflow to build your application with Yeoman, Webpack/Gulp, and Maven/Gradle

Since I wrote the first version (in 2015) of the [JHipster Mini-Book](https://www.infoq.com/minibooks/jhipster-4-mini-book), I've always wanted to add support for generating an Ionic client. I'm happy to report that my dreams have finally come true!

## Introducing the Ionic Module for JHipster! 🎉

[Ionic for JHipster](https://github.com/oktadeveloper/generator-jhipster-ionic) is a JHipster module you can use to generate a hybrid mobile app that runs on your phone. It starts by creating a project with `ionic start` and leveraging the [Ionic JHipster Starter](https://github.com/oktadeveloper/ionic-jhipster-starter) for its files. It supports JWT authentication by default. If you have OAuth 2.0 / OIDC as your authentication mechanism, it installs OIDC support. It even works with a JHipster-generated [microservices architecture](http://www.jhipster.tech/microservices-architecture/)!

Ionic is a framework that allows you to create mobile applications using the web technologies you know and love. It currently has Angular support, but its development team has been working on adding support for React and Vue as well. They're doing this via their [Stencil](https://stenciljs.com) project. Stencil allows you to build web components rather than framework-specific components. Since web components are standards-compliant, they can be used in a plain vanilla JavaScript application, or with many popular framework out-of-the-box.

Ionic's mobile support is powered by [Apache Cordova](https://cordova.apache.org/). Cordova is the underlying technology that makes it possible to build and run mobile apps created with HTML, CSS, and JavaScript. It allows you to target multiple platforms (e.g., Android, iOS, Windows, Blackberry, and Ubuntu) with one code base. Pretty slick, eh?

The Ionic team has also recently released an [Ionic PWA Toolkit](https://blog.ionicframework.com/announcing-the-ionic-pwa-toolkit-beta/). This is a beta project that has everything you need to build a high performance PWA (for example: Ionic, routing, Stencil, push notifications, lazy loading, code splitting, lazy image loading, etc.). This seems to demonstrate that Ionic has had good success outside of the phone, when apps are deployed as PWAs on the web.

## Get Started with Ionic for JHipster 

Getting started with Ionic for JHipster requires that you install [Node.js](https://nodejs.org). Once you have Node installed, you can run the following command to generate an Ionic app that'll talk to your JHipster backend.

```bash
npm i -g generator-jhipster ionic
```

JHipster requires that you have Node and Java installed. You can install it via [Homebrew](http://brewformulas.org/Jhipster) (`brew install jhipster`), [Chocolatey](https://chocolatey.org/packages/jhipster) (`choco install jhipster`), or with npm.

```bash
npm i -g generator-jhipster
```

## Develop a Blog App with OIDC Authentication

To develop a blog application with JHipster, open a terminal window, create a directory, and run `jhipster`.

```
mkdir blog
cd blog
jhipster
```

 You’ll be asked a number of questions about the type of application you want to create and what features you’d like to include. The screenshot below shows the choices I made to create a blog application with Angular and OAuth 2.0 / OIDC authentication.
 
{% img blog/jhipster-ionic/jhipster-questions.png alt:"JHipster Questions" width:"800" %}{: .center-image }

The project generation process will take a couple minutes to run, depending on your internet connection speed. When it’s finished, you should see output like the following.

```
output
```

### OIDC with Keycloak and Okta

JHipster supports [OAuth 2.0 and OIDC](http://www.jhipster.tech/security/#oauth2) for authentication. [Keycloak](https://keycloak.org/) is the default Identity Provider (IdP)  configured with JHipster. This is because you can use it without having an internet connection.
 
To switch to Okta by default, you'll need to create an OIDC app. If you don't have an Okta Developer To switch to Okta by default, you'll need to create an OIDC app. If you don't have an Okta Developer account, get one today!
                                                                                                 To log into your application, you’ll need to have Keycloak up and running. The JHipster Team has created a Docker container for you that has the default users and roles. Start Keycloak using the following command.
                                                                                                        
                                                                                                        docker-compose -f src/main/docker/keycloak.yml up

## Why Ionic instead of PWA?

