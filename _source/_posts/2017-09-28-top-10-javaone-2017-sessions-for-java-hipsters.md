---
layout: blog_post
title: "The Top 10 JavaOne 2017 Sessions for the Java Hipster"
author: mraible
description: "This article contains a list of the top 10 JavaOne 2017 sessions for the Java Hipster. If you're using JHipster, chances are you're already aware of and using the latest trends and techniques in Java development."
tags: [jhipster, java, javaone, javaone2017, springboot, angular, javascript]
---

A "hipster" is defined as a person who is exceptionally aware of or interested in the latest trends and tastes. JHipster is an open source project whose name stands for "Java Hipster." If you're using JHipster, chances are you're aware of and *using* the latest trends and techniques in Java development. Trendy things in server-side Java development include microservices, embedded app servers, deployment with containers, auto-configuration, and monitoring. JHipster supports all of these trends, embracing Spring Boot as a platform. It allows you to generate microservice architectures, it encourages deployment with Docker/Kubernetes, and supports monitoring with the Elastic Stack.

On the client-side, many hip developers are using JavaScript frameworks that talk to REST APIs. They're adding progressive web app (PWA) features that allow their apps to work offline and they're optimizing the hell out of them, so they're fast and efficient. [JHipster](http://www.jhipster.tech) provides support for AngularJS and Angular as JavaScript frameworks and will support React before the end of the year. JHipster supports PWAs, and it does all the right things for web performance like gzipping, code splitting, and setting expires headers.

The annual [JavaOne conference](https://www.oracle.com/javaone/index.html) is next week in San Francisco. For the Java hipsters that want to learn about the technologies used in JHipster, I decided to make a list of the top 10 JavaOne sessions to attend. This list is based my opinions after scanning all 491 sessions included in the [session catalog](https://events.rainfocus.com/catalog/oracle/oow17/catalogjavaone17). I admit that my rankings are a bit biased toward speakers I know and trust.

## 1: Get Hip with JHipster

Let's get my ultimate bias out of the way first... In [this session](https://events.rainfocus.com/catalog/oracle/oow17/catalogjavaone17?search=%22Get%20Hip%20with%20JHipster%22&showEnrolled=false), *I'll* show you what JHipster is, the different options it has when generating a project, and how to use it. Over half of this session will be live-coding, so it's sure to be exciting when trying to use `npm install` over conference wi-fi! Bonus: this session is part of Oracle Code, which hosts a plethora of free sessions during JavaOne. For more information, see [7 reasons why you should attend](https://blogs.oracle.com/developers/7-reasons-developers-wont-believe-that-will-make-them-attend-code-san-francisco).

**When:** Tuesday, Oct 03, 9:30 a.m. - 10:15 a.m.
**Where:** Moscone West - Room 2001

## 2: Going Reactive with Spring 5 and Project Reactor

[This session](https://events.rainfocus.com/catalog/oracle/oow17/catalogjavaone17?search=%22Going%20Reactive%20with%20Spring%205%20and%20Project%20Reactor%22&showEnrolled=false) is by [Josh Long](https://twitter.com/starbuxman) and [Mark Heckler](https://twitter.com/MkHeck), need I say more? Seriously, these guys are great speakers, and their talk is sure to be packed full of technical content and some good laughs.

Spring 5 will be released any day now. One of the most exciting introductions in this release is support for reactive programming. Spring 5 adds a new MVC-like component model adapted to support reactive processing and a new type of web endpoint: functional reactive endpoints. This session dives into the net-new Netty-based web runtime and shows how to integrate it with existing Spring-stack technologies and leverage new testing mechanisms to make code better and life easier, and it ties it all together with a live coding demo.

The JHipster team is currently working on adding support for [reacting programming with Spring 5](https://github.com/jhipster/generator-jhipster/issues/5970).

**When:** Tuesday, Oct 03, 8:30 a.m. - 9:15 a.m.
**Where:** Moscone West - Room 2006

## 3. Docker Tips and Tricks for Java Developers

[Ray Tsang](https://twitter.com/saturnism) is quite the showman, which makes him an engaging teacher to learn about new technology from in [this session](https://events.rainfocus.com/catalog/oracle/oow17/catalogjavaone17?search=%22Docker%20Tips%20and%20Tricks%20for%20Java%20Developers%22&showEnrolled=false). Everyone is talking about containers – but be aware! It takes discipline to use container technology. It may not be as secure nor as optimal as you assume. Attend this session to learn how to best address these issues when building your Java container images.

JHipster leverages [Docker and Docker Compose](http://www.jhipster.tech/docker-compose/) to allow you to package your application(s). It also generates Docker Compose files for your application so you can easily run databases, Sonar, and other services that you might not have installed locally.

**When:** Wednesday, Oct 04, 2:45 p.m. - 3:30 p.m.
**Where:** Moscone West - Room 2024

## 4. Eight Steps to Becoming Awesome with Kubernetes

[Burr Sutter](https://twitter.com/burrsutter) is another great speaker, and in [this session](https://events.rainfocus.com/catalog/oracle/oow17/catalogjavaone17?search=%22Eight%20Steps%20to%20Becoming%20Awesome%20with%20Kubernetes%22&showEnrolled=false) he's covering one of the most talked about technologies on the web today: Kubernetes! Everybody seems to be rocking with Kubernetes. Even your favorite open source repositories at GitHub are running on top of it. Don't be the last developer to board this bullet train. Come to this session to learn eight simple and practical steps that will take you from Kubernetes novice to expert.

JHipster has [support for deploying to Kubernetes](http://www.jhipster.tech/kubernetes/). You can learn more about how this works (and see a screencast of deploying to Google Cloud) in an article on this blog: [Develop and Deploy Microservices with JHipster](https://developer.okta.com/blog/2017/06/20/develop-microservices-with-jhipster).

**When:** Wednesday, Oct 04, 9:30 a.m. - 10:15 a.m.
**Where:** Moscone West - Room 2004

## 5. High-Performance JavaScript Web Apps Architecture

[Pratik Pratel](https://twitter.com/prpatel) is a popular speaker on the [No Fluff Just Stuff](https://www.nofluffjuststuff.com) tour and all-around fun guy to be around. [This session](https://events.rainfocus.com/catalog/oracle/oow17/catalogjavaone17?search=%22High-Performance%20JavaScript%20Web%20Apps%20Architecture%22&showEnrolled=false) digs deep into the performance aspects of JavaScript and the web browser. Single-page web applications are becoming popular very quickly, and understanding the low- and high-level aspects of the browser platform and JavaScript runtimes embedded in them is important.

JHipster generates single-page web applications. You want to know how to make them as high-performing as possible, don't you?!

**When:** Wednesday, Oct 04, 11:45 a.m. - 12:30 p.m.
**Where:** Moscone West - Room 2005

## 6.Five Killer Tricks to Make Your Java Web App Look Awesome

[Andres Galante](https://twitter.com/andresgalante) and Scott Wierschem lead [this session](https://events.rainfocus.com/catalog/oracle/oow17/catalogjavaone17?search=%22Five%20Killer%20Tricks%20to%20Make%20Your%20Java%20Web%20App%20Look%20Awesome%22&showEnrolled=false). I haven't seen these guys speak before, but the session's description mentions Bootstrap, which is the CSS framework used in JHipster. Also, Andres' Twitter profile says he loves CSS, which is a rare (and awesome) trait in a developer. The session covers how to use Bootstrap, and explores Patternfly, a Bootstrap-based UI framework for enterprise web applications. This session will provide you the tools you need to give your web app an instant facelift that your customers will love.

**When:** Sunday, Oct 01, 10:00 a.m. - 10:45 a.m.
**Where:** Moscone West - Room 2005

## 7. The Diabolical Developer's Guide to Surviving Java 9

[Martijn Verburg](https://twitter.com/karianna) is always fun and entertaining to listen to. In [this session](https://events.rainfocus.com/catalog/oracle/oow17/catalogjavaone17?search=%22Guide%20to%20Surviving%20Java%209%22&showEnrolled=false) on surviving Java 9, Martijn will talk about the new modularity system (Jigsaw), restrictions on the use of internal libraries such as sun.misc.Unsafe, a new REPL (JShell), a change of the default garbage collector to G1, and much more. All of this combined means that Java 9 is potentially the most groundbreaking release since Java 5 introduced generics. In this session, the Diabolical Developer presents a pragmatic guide to migrating your apps to Java 9 and how to avoid the common pitfalls.

While JHipster [doesn't support Java 9](https://github.com/jhipster/generator-jhipster/issues/6391) (yet), it will soon!

**When:** Tuesday, Oct 03, 8:30 a.m. - 9:15 a.m.
**Where:** Moscone West - Room 2004

## 8. Effective Design of RESTful APIs

[Mohamed Taman](https://twitter.com/_tamanm) is a world-renowned conference speaker and Java expert. I haven't seen him speak before but the topic of [this session](https://events.rainfocus.com/catalog/oracle/oow17/catalogjavaone17?search=%22Effective%20Design%20of%20RESTful%20APIs%22&showEnrolled=false), RESTful API design, is a cornerstone of JHipster. If you're going to design APIs effectively, this session seems like it will offer lots of useful advice. Developers creating websites, especially back-end developers, need to know how to build RESTful APIs correctly because nowadays those APIs are serving many channels: mobile, microservices components, IoT, or integration – or all of these. This session will help you plan and model your APIs and understand the six REST design constraints that help guide your architecture.

**When:** Monday, Oct 02, 11:00 a.m. - 11:45 a.m.
**Where:** Moscone West - Room 2005

## 9. Need-to-Know Patterns for Building Microservices

[Vincent Kok](https://www.linkedin.com/in/vincent-kok/) has built a [cool-sounding session](https://events.rainfocus.com/catalog/oracle/oow17/catalogjavaone17?search=%22Need-to-Know%20Patterns%20for%20Building%20Microservices%20%22&showEnrolled=false), but doesn't seem to have a Twitter handle, so I don't know if you can trust him. ;-) Microservices are still the rage – and for good reason. However, they're not a silver bullet, and anyone who adopts this architecture will need to learn and identify new patterns, patterns you didn't need to know about in a monolithic world. This session discusses when to make the switch to a microservice architecture and the patterns Atlassian has identified in building microservices. They include patterns in code organization, configuration management, deployment, resilience, and decomposition.

JHipster supports generating a microservices architecture, but a monolith might work better for your team. Attend this session to discover lessons learned while scaling Atlassian.

**When:** Thursday, Oct 05, 11:45 a.m. - 12:30 p.m.
**Where:** Marriott Marquis (Golden Gate Level) - Golden Gate B

## 10. NoSQL? Have It Your Way!

[Gunnar Morling](https://twitter.com/gunnarmorling) is the spec lead of Bean Validation 2.0 and founder of MapStruct – both of which are used in JHipster! The future of data persistence is polyglot, and this future is now. Although SQL used to be the lingua franca of database access, newer NoSQL data stores each come with their own API and query language. [This session](https://events.rainfocus.com/catalog/oracle/oow17/catalogjavaone17?search=%22NoSQL?%20Have%20It%20Your%20Way!%22&showEnrolled=false) explores the approaches Java developers have for accessing NoSQL stores, from native APIs over lightweight abstractions to object mapping libraries.

JHipster supports a few NoSQL options: [MongoDB](http://www.jhipster.tech/using-mongodb/), [Cassandra](http://www.jhipster.tech/using-cassandra/), and (soon) [Couchbase](https://github.com/jhipster/generator-jhipster/issues/6086).

**When:** Tuesday, Oct 03, 12:15 p.m. - 1:00 p.m.
**Where:** Moscone West - Room 2006

## Even More Sessions!

Did I mention that many of these speakers are [Java Champions](https://community.oracle.com/community/java/java-champions)? That means they've been around the block in the Java world for quite some time and likely have a vast amount of experience with Java technologies.

They may not have made my top 10 list, but I'd also like to recognize a few sessions that pertain to the UI developer. Even though these technologies might not be in JHipster, I think they're hip, and you should be aware of them.

* [JavaScript Libraries: Which Ones for Your Project?](https://events.rainfocus.com/catalog/oracle/oow17/catalogjavaone17?search=%22JavaScript%20Libraries:%20Which%20Ones%20for%20Your%20Project?%22&showEnrolled=false)
* [Modern Web Apps with HTML5 Web Components, Polymer, Java EE MVC 1.0, and JAX-RS](https://events.rainfocus.com/catalog/oracle/oow17/catalogjavaone17?search=%22Modern%20Web%20Apps%20with%20HTML5%20Web%20Components,%20Polymer,%20Java%20EE%20MVC%201.0,%20and%20JAX-RS%22&showEnrolled=false)
* [Build Web, Mobile, and Desktop Applications with Oracle JET, Oracle Cloud, and Electron](https://events.rainfocus.com/catalog/oracle/oow17/catalogjavaone17?search=%22Build%20Web,%20Mobile,%20and%20Desktop%20Applications%20with%20Oracle%20JET,%20Oracle%20Cloud,%20and%20Electron%22&showEnrolled=false)

## Have Fun at JavaOne!

There you have it, my list of the top 10 sessions (plus a few more!) to attend as a Java Hipster at JavaOne. I'm sure there are many other excellent talks, but these are the ones that stood out to me. Of course, you should probably attend the [Developer Keynote](https://events.rainfocus.com/catalog/oracle/oow17/catalogjavaone17?search=%22Developer%20Keynote%22&showEnrolled=false) too.

Since this post is on the Okta Developer blog, and Okta is a security company, I'd be remiss if I didn't include some security sessions that caught my eye. Check these out if security is on the top of your mind!

* [An Introduction to OAuth 2.0 and OpenID Connect](https://events.rainfocus.com/catalog/oracle/oow17/catalogjavaone17?search=%22An%20Introduction%20to%20OAuth%202.0%20and%20OpenID%20Connect%22&showEnrolled=false)
* [Deconstructing and Evolving REST Security](https://events.rainfocus.com/catalog/oracle/oow17/catalogjavaone17?search=%22Deconstructing%20and%20Evolving%20REST%20Security%22&showEnrolled=false)
* [Easily Secure Your Front- and Back-End Applications with KeyCloak](https://events.rainfocus.com/catalog/oracle/oow17/catalogjavaone17?search=%22Easily%20Secure%20Your%20Front-%20and%20Back-End%20Applications%20with%20KeyCloak%22&showEnrolled=false)
* [Java LangSec: New Security Enhancements in Java 9](https://events.rainfocus.com/catalog/oracle/oow17/catalogjavaone17?search=%22Java%20LangSec:%20New%20Security%20Enhancements%20in%20Java%209%22&showEnrolled=false)
* [JSR 375: New Security APIs for Java EE](https://events.rainfocus.com/catalog/oracle/oow17/catalogjavaone17?search=%22JSR%20375:%20New%20Security%20APIs%20for%20Java%20EE%22&showEnrolled=false)
* [Web Application Security for Developers: Tooling and Best Practices](https://events.rainfocus.com/catalog/oracle/oow17/catalogjavaone17?search=%22Web%20Application%20Security%20for%20Developers:%20Tooling%20and%20Best%20Practices%22&showEnrolled=false)
