---
layout: blog_post
title: 'Build a Java EE REST API; Secure it with JWT and OIDC'
author: mraible
description: "Java EE allows you to build REST APIs quickly and easily with JAX-RS and JPA. This article shows you how to build a simple API with Java EE, run it on Apache TomEE, and secure it with JWT and OIDC."
tags: [java, java ee, rest api, jax-rs, jpa, ejb, jwt, oidc, spring security, pac4j]
tweets:
  - "Building a Java EE REST API is pretty easy with JPA, JAX-RS, and @ApacheTomEE. Learn how to 💻 code it 🔒 lock it down with JWT and OIDC →"
  - "We ❤ @java here @oktadev️. This tutorial shows you how to build a Java EE REST API and secure it with many different options: JWTs, @springsecurity, and Pac4J! #jwt #oidc #rest"
<!-- todo: image -->
---

Java EE is an umbrella standards specification that describes a number of Java technologies, including EJB, JPA, JAX-RS, and many others. It was originally designed to allow portability between Java application servers, and flourished in the early 2000s. Back then, application servers were all the rage and provided by many well-known companies such as IBM, BEA, and Sun. JBoss was a startup that disrupted the status quo and showed it was possible to develop a Java EE application server as an open source project, and give it away for free. JBoss was bought by RedHat in 2006. 

In the early 2000s, Java developers used servlets and EJBs to develop their server applications. Hibernate and Spring came along in 2002 and 2004, respectively. Both technologies had a huge impact on Java developers everywhere, showing them it was possible to write distributed, robust applications without EJBs. Hibernate's POJO model was eventually adopted as the JPA standard and heavily influenced EJB as well. 

Fast forward to 2018, and Java EE certainly doesn't look like it used to! Now, it's mostly POJOs and annotations and far simpler to use.

## Why Not Spring Boot?

Spring Boot is one of my favorite technologies in the Java ecosystem. It's drastically reduced the configuration necessary in a Spring application and made it possible to whip up REST APIs in just a few lines of code. However, I've had a lot of API security questions lately from developers that *aren't* using Spring Boot. Some of them aren't even using Spring! 

For this reason, I thought it'd be fun to build a Java EE REST API that's the same as a Spring Boot REST API I developed in the past. Namely, the "good-beers" API from my [Bootiful Angular](/blog/2017/04/26/bootiful-development-with-spring-boot-and-angular) and [Bootiful React](/blog/2017/12/06/bootiful-development-with-spring-boot-and-react) posts. 

## Get Started with Java EE 

To begin, I [asked my network on Twitter](https://twitter.com/mraible/status/1032688466025435137) if any quickstarts existed for Java EE like start.spring.io. I received a few suggestions and started doing some research. [David Blevins](https://twitter.com/dblevins) recommended I look at [tomee-jaxrs-starter-project](https://github.com/tomitribe/), so I started there. I also looked into the [TomEE Maven Archetype](http://tomee.apache.org/tomee-mp-getting-started.html), as recommended by [Roberto Cortez](http://twitter.com/radcortez).

I liked the jaxrs-starter project because it showed how to create a REST API with JAX-RS. The TomEE Maven archetype was helpful too, especially since it showed how to use JPA, H2, and JSF. I combined the two to create my own minimal starter that you can use to implement secure Java EE APIs on TomEE. You don't have to use TomEE for these examples, but I haven't tested them on other implementations. 

*If you get these examples working on other app servers, please let me know and I'll update this blog post.*

In these examples, I'll be using Java 8 and Java EE 7.0 with TomEE 7.0.5. TomEE 7.x is the EE7 compatible version; a TomEE 8.x branch exists for EE8 compatibility work, but there are no releases yet. I expect you to have [Apache Maven](https://maven.apache.org) installed too.

To begin, clone our Java EE REST API repository to your hard drive, and run it:

```
git clone https://github.com/oktadeveloper/okta-java-ee-rest-api-example.git javaee-rest-api
cd javaee-rest-api
mvn package tomee:run
```

Navigate to `http://localhost:8080` and add a new beer.

{% img blog/javaee-rest-api/add-beer.png alt:"Add beer" width:"800" %}{: .center-image }

Click **Add* and you should see a success message.

{% img blog/javaee-rest-api/add-success.png alt:"Add beer success" width:"800" %}{: .center-image }

Click **View beers present** to see the full list of beers.

{% img blog/javaee-rest-api/beers-present.png alt:"Beer list" width:"800" %}{: .center-image }

You can also view the list of good beers in the system at `http://localhost:8080/good-beers`. Below is the output when using [HTTPie](https://httpie.org/).

```bash
http :8080/good-beers
HTTP/1.1 200
Content-Type: application/json
Date: Wed, 29 Aug 2018 21:58:23 GMT
Server: Apache TomEE
Transfer-Encoding: chunked
```
```json
[
    {
        "id": 101,
        "name": "Kentucky Brunch Brand Stout"
    },
    {
        "id": 102,
        "name": "Marshmallow Handjee"
    },
    {
        "id": 103,
        "name": "Barrel-Aged Abraxas"
    },
    {
        "id": 104,
        "name": "Heady Topper"
    },
    {
        "id": 108,
        "name": "White Rascal"
    }
]
```

## Build a REST API with Java EE

I showed you what this application can do, but I haven't talked about how it's built. It has a few XML configuration files, but I'm going to skip over most of those. The most important XML files is the `pom.xml` that defines dependencies and allows you to run the TomEE Maven Plugin. It's pretty short and sweet, with only one dependency and one plugin.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.okta.developer</groupId>
    <artifactId>java-ee-rest-api</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>
    <name>Java EE Webapp with JAX-RS API</name>
    <url>http://developer.okta.com</url>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <maven.compiler.target>1.8</maven.compiler.target>
        <maven.compiler.source>1.8</maven.compiler.source>
        <failOnMissingWebXml>false</failOnMissingWebXml>
        <javaee-api.version>7.0</javaee-api.version>
        <tomee.version>7.0.5</tomee.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>javax</groupId>
            <artifactId>javaee-api</artifactId>
            <version>${javaee-api.version}</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.tomee.maven</groupId>
                <artifactId>tomee-maven-plugin</artifactId>
                <version>${tomee.version}</version>
                <configuration>
                    <context>ROOT</context>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

The main entity is `Beer.java` and the database (a.k.a., datasource) is configured in `src/main/resources/META-INF/persistence.xml`. 

```java
package com.okta.developer;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Beer {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String name;

    public Beer() {}

    public Beer(String name) {
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String beerName) {
        this.name = beerName;
    }

    @Override
    public String toString() {
        return "Beer{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
```

The `BeerService.java` class handles reading and saving this entity to the database using JPA's `EntityManager`. 

```java
package com.okta.developer;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.criteria.CriteriaQuery;
import java.util.List;

@Stateless
public class BeerService {

    @PersistenceContext(unitName = "beer-pu")
    private EntityManager entityManager;

    public void addBeer(Beer beer) {
        entityManager.persist(beer);
    }

    public List<Beer> getAllBeers() {
        CriteriaQuery<Beer> cq = entityManager.getCriteriaBuilder().createQuery(Beer.class);
        cq.select(cq.from(Beer.class));
        return entityManager.createQuery(cq).getResultList();
    }

    public void clear() {
        Query removeAll = entityManager.createQuery("delete from Beer");
        removeAll.executeUpdate();
    }
}
```

There's a `StartupBean.java` that handles populating the database on startup, and clearing it on shutdown.

```java
package com.okta.developer;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import java.util.stream.Stream;

@Singleton
@Startup
public class StartupBean {
    private final BeerService beerService;

    @Inject
    public StartupBean(BeerService beerService) {
        this.beerService = beerService;
    }

    @PostConstruct
    private void startup() {
        // Top beers from https://www.beeradvocate.com/lists/top/
        Stream.of("Kentucky Brunch Brand Stout", "Marshmallow Handjee", 
                "Barrel-Aged Abraxas", "Heady Topper",
                "Budweiser", "Coors Light", "PBR").forEach(name ->
                beerService.addBeer(new Beer(name))
        );
        beerService.getAllBeers().forEach(System.out::println);
    }

    @PreDestroy
    private void shutdown() {
        beerService.clear();
    }
}
```

These three classes make up the foundation of the app, plus there's a `BeerResource.java` class that uses JAX-RS to expose the `/good-beers` endpoint.

```java
package com.okta.developer;

import javax.ejb.Lock;
import javax.ejb.Singleton;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import java.util.List;
import java.util.stream.Collectors;

import static javax.ejb.LockType.READ;
import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

@Lock(READ)
@Singleton
@Path("/good-beers")
public class BeerResource {
    private final BeerService beerService;

    @Inject
    public BeerResource(BeerService beerService) {
        this.beerService = beerService;
    }

    @GET
    @Produces({APPLICATION_JSON})
    public List<Beer> getGoodBeers() {
        return beerService.getAllBeers().stream()
                .filter(this::isGreat)
                .collect(Collectors.toList());
    }

    private boolean isGreat(Beer beer) {
        return !beer.getName().equals("Budweiser") &&
                !beer.getName().equals("Coors Light") &&
                !beer.getName().equals("PBR");
    }
}

```

Lastly, there's a `BeerBean.java` class is used as a managed bean for JSF.

```java
package com.okta.developer;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.List;

@Named
@RequestScoped
public class BeerBean {

    @Inject
    private BeerService beerService;
    private List<Beer> beersAvailable;
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Beer> getBeersAvailable() {
        return beersAvailable;
    }

    public void setBeersAvailable(List<Beer> beersAvailable) {
        this.beersAvailable = beersAvailable;
    }

    public String fetchBeers() {
        beersAvailable = beerService.getAllBeers();
        return "success";
    }

    public String add() {
        Beer beer = new Beer();
        beer.setName(name);
        beerService.addBeer(beer);
        return "success";
    }
}
```

## Protect Your Java EE REST API with JWT Verifier for Java

## Secure Your Java EE REST API with Spring Security

## Secure Your Java EE REST API with Pac4j

## What About Jakarta EE?

## Learn More about Java EE, Jakarta EE, and OIDC

