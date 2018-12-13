---
layout: blog_post
title: 'Build a Basic App with Spring Boot and JPA using Postgres'
author: andrewcarterhughes
date: 2018-12-12T00:00:00Z
description: "Build a resource server using Spring Boot and Spring Data JPA and implement Group-based authorization using Okta OAuth."
tags: [security, jwt, token, authentication, sessions, jpa, spring, spring data]
---

# Build a Basic App with Spring Boot and JPA using Postgres

Every non-trivial application needs a way to save and update data: a resource server that is accessible via HTTP. Generally, this data must be secured. Java is a great language with decades of history in professional, enterprise development, and is a great choice for any application’s server stack. Within the Java ecosystem, Spring makes building secure resource servers for your data simple. When coupled with Okta, you get professionally maintained OAuth and JWT technologies easily integrated into Spring Boot using Spring Security.

In this post, you're going to build a resource server using Spring Boot and Spring Data JPA. On top of that, you're going to implement a group-based authentication and authorization layer using OAuth 2.0. If this sounds complicated - don't worry! It's not. 

Before we dig in, let’s cover some background:

A **resource server** is a programmatic access point for your server's functions and data (basically the same as an API server and/or possibly REST server). 

 **JPA** is the Java Persistence API, a specification for managing relational databases using Java. It describes an abstraction layer between Java classes and a relational database. 

[**Spring Data JPA**](https://spring.io/projects/spring-data-jpa) is a wrapper around JPA providers such as Hibernate. As you'll see, it makes persisting your Java classes as simple as adding some annotations and creating a simple repository interface. No need to actually write persistence or retrieval methods! Another great benefit is that you can change the underlying database implementation transparently without having to change any code. For example, in this tutorial, you'll be using Postgres, but later if you decided you'd rather use MySQL, all you'd have to do is change out some dependencies.

## Install PostgreSQL for JPA Persistence

You'll need to have PostgreSQL installed for this tutorial. If you don't already have it installed, go to [their downloads page](https://www.postgresql.org/download/) and install it.

The next thing you'll need to do is create a Postgres user and database for the project. For this, you can use the Postgres CLI, `psql`.

You should be able to run the following command: `psql -V` and get a response like: 

```bash
psql (PostgreSQL) 11.12
```

## Create a PostgreSQL Database for Your JPA Entities

Before you can use your database, you need to do a few things. You need to:

1. Create a user for the app
2. Set a password for that user
3. Create a database for the app
4. Grant privileges on the database for the user

This tutorial uses *jpatutorial* for the username and *springbootjpa* for the database name. Feel free to change these if you like, but you'll have to remember to use your custom values throughout the tutorial.

Type `psql` from the terminal to enter the Postgres shell. Then enter the following command.

**Create a user**

```bash
create user jpatutorial;
```

The shell should respond with: `CREATE ROLE`

**Don't forget the semicolon!** I would never, ever do this. I am definitely not speaking from experience. But if you don't type in the semicolon `psql` doesn't process the command and you can lose 20-30 minutes in frustrated confusion wondering what is happening until you *do* enter a semicolon, at which point it tries to process all of your commands.

**Give the user a password**

```bash
alter user jpatutorial with encrypted password '<your really secure password>';
```

The shell should respond with:  `ALTER ROLE`.

**Create the database**

```bash
create database springbootjpa;
```

The shell should respond with:  `CREATE DATABASE`.

**Grant privileges**

```bash
grant all privileges on database springbootjpa to jpatutorial;
```

The shell should respond with `GRANT`.

Finally, type `\q` to quit the shell, if you want.

If you want to read more about `psql` you can take a look at [Postgres' docs](https://www.postgresql.org/docs/9.2/app-psql.html).

## Build a Spring Boot Resource Server

Clone the starter project from the GitHub repository and check out the **start** branch:

```bash
git clone -b start https://github.com/oktadeveloper/okta-spring-boot-jpa-example.git
```

The starter project is a clean slate Spring Boot project with just a little bit of Postgres-specific configuration already in place. If you look in the `build.gradle` file you'll see a PostgreSQL JPA connector dependency. You'll also notice the file `src/main/resources/hibernate.properties` whose sole purpose is to get rid of an annoying warning/error that doesn't really matter to us. The `src/main/resources/application.yml` file also has some properties pre-filled for you.

Go ahead and open the `application.yml` file and fill in the password you created for your database user. You should also update the username, database name, and port (if they are different).

```yml
spring:  
  jpa:  
    hibernate:  
      ddl-auto: create  
    database-platform: org.hibernate.dialect.PostgreSQLDialect  
  datasource:  
    url: "jdbc:postgresql://localhost:5432/springbootjpa"  
    username: jpatutorial  
    password: < your password >
```

The `ddl-auto` property specifies hibernate's behavior upon loading. The options are:

 - validate: *validates the schema but makes no changes*
 - update: *updates the schema*
 - create: *creates the schema, destroying any previous data*
 - create-drop: *like create, but also drops the schema when the session closes (useful for testing)*

You're using `create`. Each time the program is run, a new database is created, starting with fresh tables and data.

`database-platform` is actually unnecessary. Spring Data/Hibernate can autodetect the platform. However, without this property, if you run the app without having started your Postgres server, what you'll get is a rather unhelpful error about not having added this config property instead of being told to start your server. This happens because Hibernate cannot autodetect the database platform, so complains about that before complaining about there not actually being a running server.

Run the app with `./gradlew bootRun`.  You should see something like this:

```bash
2018-11-21 09:27:50.233  INFO 31888 --- [           main] o.s.j.e.a.AnnotationMBeanExporter        : Located MBean 'dataSource': registering with JMX server as MBean [com.zaxxer.hikari:name=dataSource,type=HikariDataSource]
2018-11-21 09:27:50.302  INFO 31888 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
2018-11-21 09:27:50.308  INFO 31888 --- [           main] c.o.s.SpringBootJpaApplication           : Started SpringBootJpaApplication in 21.361 seconds (JVM running for 21.848)
<=========----> 75% EXECUTING [4m 26s]
> :bootRun
```

It doesn't do much just yet, though. There are no domain models, resource repositories, or controller classes.

## Add a Domain Class with Spring Data and JPA

A domain or model is the programmatic representation of the data you will be storing. The magic of Spring Data and JPA is that Spring can take a Java class and turn it into a database table for you. It will even autogenerate the necessary load and save methods. The best part is that this is (more or less) database independent. 

You're using PostgreSQL in this tutorial, and you could pretty easily switch it to MySQL if you wanted, just by changing a dependency in the `build.gradle` file. And, of course, creating a MySQL database and updating the necessary properties in the `application.yml` file. This is super useful for testing, development, and long-term maintenance.

Keep reading to learn how to develop a simple server to store types of kayaks.

Create a Java file in the `com.okta.springbootjpa` package called `Kayak.java`.  Your kayak model will have a name, an owner, a value, and a make/model.

```java
package com.okta.springbootjpa;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity // This tells Hibernate to make a table out of this class
@Data // Lombok: adds getters and setters
public class Kayak {

    public Kayak(String name, String owner, Number value, String makeModel) {
        this.name = name;
        this.owner = owner;
        this.value = value;
        this.makeModel = makeModel;
    }

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer id;

    private final String name;

    private String owner;

    private Number value;

    private String makeModel;
}
``` 

This project uses **Lombok** to avoid having to code a bunch of ceremony getters and setters and whatnots. You can check out [their docs](https://projectlombok.org/), or more specifically for [the `@Data` annotation you're using](https://projectlombok.org/features/Data).

The `@Entity` annotation is what tells Spring that this class is a model class and should be transformed into a database table.

Most properties can be mapped automatically. The `id` property, however, is decorated with a couple annotations because we need to tell JPA that this is the ID field and that it should be auto-generated.

## Implement a CRUD Repository with Spring Data JPA

With the domain class defined, Spring knows enough to build the database table, but it doesn't have any controller methods defined. There's no output or input for the data. Spring makes adding a resource server trivial. In fact, it's so trivial, you probably won't believe it.

In the package `com.okta.springbootjpa`, create an interface called `KayakRepository.java`. 

```java
package com.okta.springbootjpa;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface KayakRepository extends CrudRepository<Kayak, Integer> { 
}
```

That's it!

You can now create, read, update, and delete kayaks from the resource server. In just a sec you're going to do exactly that, but before you do, make one more change.

Add the following `init()` method to the `SpringBootJpaApplication` class:

```java
package com.okta.springbootjpa;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.text.NumberFormat;
import java.text.ParseException;
import java.util.stream.Stream;


@SpringBootApplication

public class SpringBootJpaApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootJpaApplication.class, args);
    }

  @Bean
  ApplicationRunner init(KayakRepository repository) {

    String[][] data = {
        {"sea", "Andrew", "300.12", "NDK"},
        {"creek", "Andrew", "100.75", "Piranha"},
        {"loaner", "Andrew", "75", "Necky"}
    };

    return args -> {
      Stream.of(data).forEach(array -> {
        try {
          Kayak kayak = new Kayak(
              array[0],
              array[1],
                  NumberFormat.getInstance().parse(array[2]),
              array[3]
          );
          repository.save(kayak);
        }
        catch (ParseException e) {
          e.printStackTrace();
        }
      });
      repository.findAll().forEach(System.out::println);
    };
  }
  
}
```

This method will be run when the application starts. It loads some sample data into the resource server just to give you something to look at in the next section.

## Test Your Spring Boot Resource Server

HTTPie is a great command line utility that makes it easy to run requests against the resource server. If you don’t have HTTPie installed, install it using `brew install httpie`. Or head over to [their website](https://httpie.org/) and make it happen. Or just follow along.

Make sure your Spring Boot app is running. If it isn't, start it using `./gradlew bootRun`.

Run a GET request against your resource server: `http :8080/kayaks`, which is shorthand for `http GET http://localhost:8080/kayaks`.

You'll see this:

```bash
HTTP/1.1 200
Content-Type: application/hal+json;charset=UTF-8
Date: Wed, 21 Nov 2018 20:39:11 GMT
Transfer-Encoding: chunked
```
```json
{
    "_embedded": {
        "kayaks": [
            {
                "_links": {
                    "kayak": {
                        "href": "http://localhost:8080/kayaks/1"
                    },
                    "self": {
                        "href": "http://localhost:8080/kayaks/1"
                    }
                },
                "makeModel": "NDK",
                "name": "sea",
                "owner": "Andrew",
                "value": 300.12
            },
            {
                "_links": {
                    "kayak": {
                        "href": "http://localhost:8080/kayaks/2"
                    },
                    "self": {
                        "href": "http://localhost:8080/kayaks/2"
                    }
                },
                "makeModel": "Piranha",
                "name": "creek",
                "owner": "Andrew",
                "value": 100.75
            },
            {
                "_links": {
                    "kayak": {
                        "href": "http://localhost:8080/kayaks/3"
                    },
                    "self": {
                        "href": "http://localhost:8080/kayaks/3"
                    }
                },
                "makeModel": "Necky",
                "name": "loaner",
                "owner": "Andrew",
                "value": 75
            }
        ]
    },
    "_links": {
        "profile": {
            "href": "http://localhost:8080/profile/kayaks"
        },
        "self": {
            "href": "http://localhost:8080/kayaks"
        }
    }
}
```

This output gives you a pretty solid idea of the format of data that the Spring Boot resource returns. You can also add a new kayak using a POST.

Command:

```bash
http POST :8080/kayaks name="sea2" owner="Andrew" value="500" makeModel="P&H"
```

Reply:

```bash
HTTP/1.1 201
Content-Type: application/json;charset=UTF-8
Date: Wed, 21 Nov 2018 20:42:14 GMT
Location: http://localhost:8080/kayaks/4
Transfer-Encoding: chunked

{
    "_links": {
        "kayak": {
            "href": "http://localhost:8080/kayaks/4"
        },
        "self": {
            "href": "http://localhost:8080/kayaks/4"
        }
    },
    "makeModel": "P&H",
    "name": "sea2",
    "owner": "Andrew",
    "value": 500
}
```

If you list the kayaks again (`http :8080/kayaks`) you'll see the new kayak among the listed items.

```bash
HTTP/1.1 200
Content-Type: application/hal+json;charset=UTF-8
Date: Wed, 21 Nov 2018 20:44:22 GMT
Transfer-Encoding: chunked
```
```json
{
    "_embedded": {
        "kayaks": [
            ...
            {
                "_links": {
                    "kayak": {
                        "href": "http://localhost:8080/kayaks/4"
                    },
                    "self": {
                        "href": "http://localhost:8080/kayaks/4"
                    }
                },
                "makeModel": "P&H",
                "name": "sea2",
                "owner": "Andrew",
                "value": 500
            }
        ]
    },
	...
}
```

You can also delete the kayak. Run this command: `http DELETE :8080/kayaks/4` This deletes the kayak with ID = 4, or the kayak we just created. GET the list of kayaks a third time and you'll see that it's gone.

With very minimal code, using Spring Boot you can create a fully functioning resource server. This data is being persisted to your Postgres database. 

You can verify this by using the Postgres command shell. At the terminal, type `psql` to enter the shell, then type the following commands.

Connect to the database:

```psql
\connect springbootjpa
```

```psql
psql (9.6.2, server 9.6.6)
You are now connected to database "springbootjpa" as user "cantgetnosleep".
```

Show the table contents:

```psql
SELECT * FROM kayak;
```

```psql
 id | make_model |  name  | owner  |                                                                                   value
----+------------+--------+--------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  1 | NDK        | sea    | Andrew | \xaced0005737200106a6176612e6c616e67...8704072c1eb851eb852
  2 | Piranha    | creek  | Andrew | \xaced0005737200106a6176612e6c616e672e...078704059300000000000
  3 | Necky      | loaner | Andrew | \xaced00057372000e6a6176612e6c616e67...7870000000000000004b
  5 | P&H        | sea2   | Andrew | \xaced0005737200116a6176612e6...08b0200007870000001f4
(4 rows)
```

A couple things to note. First, notice that *value* is being stored as a binary object because it was defined as a `Number` type instead of a primitive (double, float, or int). Second, remember that this data is being erased and the entire table is being recreated on every boot of the app because of the `ddl-auto: create` line in the `application.yml` file.

## Set Up Authentication

Okta is a software-as-service identity, authentication, and authorization provider. While I have definitely worked on projects where outsourcing everything to SaaS providers created more problems than it promised to solve, authentication and authorization is a place where this model makes total sense. Online security is hard. Vulnerabilities are found and servers must be updated quickly. Standards change and code needs modification. All of these changes have the potential to create new vulnerabilities. Letting Okta handle security means that you can worry about the things that make your application unique.

To show you how easy it is to set up, you’re going integrate Okta OAuth and add token-based authentication to the resource server. If you haven't already, head over to [developer.okta.com](http://developer.okta.com) and sign up for a free account. Once you have an account, open the developer dashboard and create an OpenID Connect (OIDC) application by clicking on the **Application** top-menu item, and then on the **Add Application** button.

{% img blog/basic-app-spring-boot-jpa/create-app.png alt:"Select OIDC app type" width:"800" %}{: .center-image }

Select **Single-Page App**.

{% img blog/basic-app-spring-boot-jpa/app-settings.png alt:"Configure OIDC application settings" width:"800" %}{: .center-image }

The default application settings are great, except that you need to add a **Login Redirect URI**: `a`. You're going to use this in a moment to retrieve a test token. 

Also, note your **Client ID**, as you’ll need that in a moment.

{% img blog/basic-app-spring-boot-jpa/general-settings.png alt:"Note your Client ID" width:"800" %}{: .center-image }

## Configure Your Spring Boot Resource Server for Token Authentication

Okta has made adding token authentication to Spring Boot super easy. They have a project called Okta Spring Boot Starter ([check out the GitHub project](https://github.com/okta/okta-spring-boot)) that simplifies the whole process to a few simple steps.

Add a couple dependencies to your `build.gradle` file.

```groovy
compile('org.springframework.security.oauth.boot:spring-security-oauth2-autoconfigure:2.1.0.RELEASE')  
compile('com.okta.spring:okta-spring-boot-starter:0.6.1') 
```

Add the following to the bottom of the `build.gradle` file (this resolves a logback logging dependency conflict).

```groovy
configurations.all {  
  exclude group: 'org.springframework.boot', module: 'spring-boot-starter-logging'  
  exclude group: 'org.springframework.boot', module: 'logback-classic'  
}
```

Next, you need to add some configuration to your `application.yml` file, replacing `{yourClientId}` with the Client ID from your Okta OIDC application and `{yourOktaDomain}` with your Okta URL. Something like `https://dev-123456.oktapreview.com`.

```yml
okta:  
  oauth2:  
    issuer: https://{yourOktaDomain}/oauth2/default  
    client-id: {yourClientId}  
    scopes: openid profile email
```

Finally, you need to add the `@EnableResourceServer` annotation to your `SpringBootVueApplication` class.

```java
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;

@EnableResourceServer  // <- add me
@SpringBootApplication  
public class SpringBootJpaApplication {  
  
  public static void main(String[] args) {  
     SpringApplication.run(SpringBootJpaApplication.class, args);  
  }
   ...
}
```

## Test the Protected Spring Boot Server

Stop your Spring Boot server and restart it using: `./gradlew bootRun`

From the command line, run a simple GET request.

```bash
http :8080/kayaks
```

You'll get a 401/unauthorized.

```bash
HTTP/1.1 401
Cache-Control: no-store
Content-Type: application/json;charset=UTF-8
...
{
    "error": "unauthorized",
    "error_description": "Full authentication is required to access this resource"
}
```

## Generate an Access Token

To access the server now, you need a valid access token. You can use **OpenID Connect Debugger** to help you do this. In another window, open [oidcdebugger.com](https://oidcdebugger.com/).

**Authorize URI**: `https://{yourOktaUrl}/oauth2/default/v1/authorize`, with `{yourOktaUrl}` replaced with your actual Okta preview URL.

**Redirect URI**: do not change. This is the value you added to your OIDC application above.

**Client ID**: from the OIDC application you just created.

**Scope**: `openid profile email`.

**State**: any value you want to pass through the OAuth redirect process. I set it to `{}`.

**Nonce**: can be left alone. Nonce means "number used once" and is a simple security measure used to prevent the same request being used multiple times.

**Response Type**: `token`.

**Response mode**: `form_post`.

{% img blog/basic-app-spring-boot-jpa/oidc-debugger.png alt:"Generate an Access Token" width:"699" %}{: .center-image }

Click **Send Request**. If you are not logged into developer.okta.com, then you'll be required to log in. If you are (as is likely) already logged in, then the token will be generated for your signed-in identity.

{% img blog/basic-app-spring-boot-jpa/access-token-success.png alt:"Access Token success" width:"604" %}{: .center-image }

## Use the Access Token

You use the token by including in an **Authorization** request header of type **Bearer**.

```bash
Authorization: Bearer eyJraWQiOiJldjFpay1DS3UzYjJXS3QzSVl1MlJZc3VJSzBBYUl3NkU4SDJfNVJr...
```

To make the request with HTTPie:

```bash
http :8080/kayaks 'Authorization: Bearer eyJraWQiOiJldjFpay1DS3UzYjJXS3QzSVl1...'
```

## Add Group-based Authorization

Up until now, the authorization scheme has been pretty binary. Does the request carry a valid token or not. Now you're going to add Group-based authentication. Note that despite being used interchangeably sometimes on websites of ill repute, roles and groups are not the same thing, and are different ways of implementing authorization. 

A **role** is a collection of collection of permissions that a user can inherit. A **group** is a collection of users to which a set of standard permissions are assigned. However, in the scope of tokens and how you're using Spring Security with JPA, the implementation is exactly the same; they're both passed from the OAuth OIDC application as a string "authority" to Spring, so for the moment they're essentially interchangeable. The difference would be in what is protected and how they are defined.

To use group-based authorization with Okta, you need to add a "groups" claim to your access token. Create an `Admin` group (**Users** > **Groups** > **Add Group**) and add your user to it. You can use the account you signed up with, or create a new user (**Users** > **Add Person**). Navigate to **API** > **Authorization Servers**, click the **Authorization Servers** tab and edit the default one. Click the **Claims** tab and **Add Claim**. Name it "groups", and include it in the access token. Set the value type to "Groups" and set the filter to be a Regex of `.*`.

Create a new access token using [OIDC Debugger](https://oidcdebugger.com/). Take a look at your decoded token by going to [jsonwebtoken.io](https://www.jsonwebtoken.io/) and entering in your generated access token.

The payload will look a bit like this:

```json
{
 "ver": 1,
 "jti": "AT.Hk8lHezJNw4wxey1czypDiNXJUxIlKmdT16MrnLGp9E",
 "iss": "https://dev-533919.oktapreview.com/oauth2/default",
 "aud": "api://default",
 "iat": 1542862245,
 "exp": 1542866683,
 "cid": "0oahpnkb44pcaOIBG0h7",
 "uid": "00ue9mlzk7eW24e8Y0h7",
 "scp": [
  "email",
  "profile",
  "openid"
 ],
 "sub": "andrew.hughes@mail.com",
 "groups": [
  "Everyone",
  "Admin"
 ]
}
```

The **groups** claim carries the groups to which the user is assigned. The user you're using to sign into the developer.okta.com website will also be a member of both the "Everyone" group and the "Admin" group.

To get Spring Boot and the resource server to play nicely with group-based authorization, you need to make a few changes to the code.

First, add a new Java class in the `com.okta.springbootjpa` package called `SecurityConfiguration`.

```java
package com.okta.springbootjpa;

import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
}
```

This configuration class is required to enable the `@PreAuthorize` annotation that you're going to use to protect the resource server based on group membership.

Next, add the `@PreAuthorize` annotation to the `KayakRepository`, like so:

```java
...
import org.springframework.security.access.prepost.PreAuthorize;
...

@RepositoryRestResource  
@PreAuthorize("hasAuthority('Admin')")  
public interface KayakRepository extends CrudRepository<Kayak, Long> {  
}
```

Finally, in the `SpringBootJpaApplication`, **delete** the `ApplicationRunner init(KayakRepository repository)` method (or just comment out the `@Bean` annotation). If you skip this step, the build will fail with the following error: 

```bash
 AuthenticationCredentialsNotFoundException: An Authentication object was not found in the SecurityContext
```

The `@PreAuthorize` annotation actually blocks the `init()` method from creating the bootstrapped data programmatically because no user is logged in. Thus with the method runs, it throws an error.

Notice that you're using `hasAuthority()` in the `@PreAuthorize` annotation and **not** `hasRole()`. The difference is that `hasRole()` expects groups or roles to be in ALL CAPS and to have a `ROLE_` prefix. This can be configured, of course, but `hasAuthority()` comes without this baggage and simply checks whatever claim you've defined as the `okta.oauth2.roles-claim` in your `application.yml`.

## Test the Admin User in Your Spring Boot App

Restart your Spring Boot app (start with `./gradlew bootRun`).

Try an unauthenticated GET request: `http :8080/kayaks`.

```bash
HTTP/1.1 401
Cache-Control: no-store
Content-Type: application/json;charset=UTF-8
```
```json
{
    "error": "unauthorized",
    "error_description": "Full authentication is required to access this resource"
}
```

Try it using your token:

```bash
http :8080/kayaks 'Authorization: Bearer eyJraWQiOiJldjFpay1DS3UzYjJXS3QzSVl1MlJZc3VJSzBBYUl3NkU4SDJf...'
```

```bash
HTTP/1.1 200
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Content-Type: application/hal+json;charset=UTF-8
```
```json
{
    "_embedded": {
        "kayaks": []
    },
    "_links": {
        "profile": {
            "href": "http://localhost:8080/profile/kayaks"
        },
        "self": {
            "href": "http://localhost:8080/kayaks"
        }
    }
}
```

It worked! We don't have any kayaks because we had to remove the `init()` method above, so the `_embedded.kayaks` array is empty.

**TIP:** going forward, if you don’t want to copy and paste the whole enormous token string, you can store it to a shell variable and reuse it like so:

```bash
TOKEN=eyJraWQiOiJldjFpay1DS3UzYjJXS3QzSVl1MlJZc3VJSzBBYUl3NkU4SDJf...
http :8080/kayaks 'Authorization: Bearer $TOKEN'
```

## Create a Non-Admin User

To demonstrate group-based authorization, you need to create a new user on Okta that isn't an admin. Go to the [developer.okta.com](https://developer.okta.com) dashboard.

From the top-menu, select **Users** and **People**.

Click the **Add Person** button.

Give the user a **First Name**, **Last Name**, and **Username** (which will also be the **Primary Email**). The values do not matter, and you won't need to be able to check the email. You simply need to know the email address/username and password so you can log in to  Okta in a minute.

**Password**: change the drop down to **Set by admin**.

Assign the user a password.

Click **Save**.

You've just created a user that is NOT a member of the *Admin* group but is a member of the default group *Everyone*.

## Test Group-based Authorization in Your Spring Boot App

Log out of your Okta developer dashboard.

Return to the [OIDC Debugger](https://oidcdebugger.com) and generate a new token.

This time, log in as your new non-admin user. You'll be asked to choose a security question, after which you'll be redirected to the https://oidcdebugger.com/debug page where your token can be copied.

If you like, you can go to [jsonwebtoken.io](https://www.jsonwebtoken.io/) and decode your new token. In the payload, the *sub* claim will show the email/username of the user, and the *groups* claim will show only the *Everyone* group.

```json
{
 ...
 "sub": "test@gmail.com",
 "groups": [
  "Everyone"
 ]
}
```

If you use the new token to make a request on the `/kayaks` endpoint, you'll get a 403/Access Denied.

```bash
http :8080/kayaks 'Authorization: Bearer eyJraWQiOiJldjFpay1DS3UzYjJX...'
```

```bash
HTTP/1.1 403
...
```
```json
{
    "error": "access_denied",
    "error_description": "Access is denied"
}
```

To demonstrate the real power of the `@PreAuthorize` annotation, create a method-level security constraint. Change the `KayakRepository` class to the following:

```java
@RepositoryRestResource  
public interface KayakRepository extends CrudRepository<Kayak, Long> {  
  
    @PreAuthorize("hasAuthority('Admin')")  
    <S extends Kayak> S save(S entity);  
  
}
```

This restricts only the `save()` method to members of the Admin group. The rest of the repository will be restricted simply requiring authentication, but no specific group membership.

Restart your Spring Boot server. Run the same request again.

```bash
http :8080/kayaks 'Authorization: Bearer eyJraWQiOiJldjFpay1DS3UzYjJX...'
```

```bash
HTTP/1.1 200
...
```
```json
{
    "_embedded": {
        "kayaks": []
    },
    "_links": {
        "profile": {
            "href": "http://localhost:8080/profile/kayaks"
        },
        "self": {
            "href": "http://localhost:8080/kayaks"
        }
    }
}
```

The kayaks repository is empty, so `_.embedded.kayaks` is an empty array.

Try and create a new kayak.

```bash
http POST :8080/kayaks name="sea2" owner="Andrew" value="500" makeModel="P&H" "Authorization: Bearer eyJraWQiOiJldjFpay1DS3UzYjJX..."
```

You'll get another 403. "Saving" is going to equal an HTML POST here.

However, if you use a token generated from your original, admin account, it'll work. 

**NOTE:** It's possible your token will be expired and you'll have to log out of developer.okta.com again and re-generate the token on the [OIDC Debugger](https://oidcdebugger.com/).

POST a new kayak with the token generated from your admin account.

This time you'll get a 201.

```bash
HTTP/1.1 201
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Content-Type: application/json;charset=UTF-8
...
```
```json
{
    "_links": {
        "kayak": {
            "href": "http://localhost:8080/kayaks/1"
        },
        "self": {
            "href": "http://localhost:8080/kayaks/1"
        }
    },
    "makeModel": "P&H",
    "name": "sea2",
    "owner": "Andrew",
    "value": 500
}
```

Success!

Take a look at [Spring Data's `CrudRepository` interface](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html) to get an idea of the methods that can be overridden and assigned method-level security. The `@PreAuthorize` annotation can be used with a lot more than just groups, as well. The entire power of Spring's expression language (SpEL) can be leveraged.

```java
public interface CrudRepository<T, ID> extends Repository<T, ID> {
  <S extends T> S save(S entity);
  <S extends T> Iterable<S> saveAll(Iterable<S> entities);
  Optional<T> findById(ID id);
  boolean existsById(ID id);
  Iterable<T> findAll();
  Iterable<T> findAllById(Iterable<ID> ids);
  long count();
  void deleteById(ID id);
  void delete(T entity);
  void deleteAll(Iterable<? extends T> entities);
  void deleteAll();
}
``` 
And that’s it! Pretty cool right? In this tutorial, you set up a PostgreSQL database, created a Spring Boot resource server that used Spring Data and JPA to persist a data model, and then turned this data model into a REST API with shockingly little code. Further, you used Okta to add OIDC authentication and OAuth 2.0 authorization to your server application. And finally, you implemented a simple group-based authorization scheme.  

If you’d like to check out this complete project, you can find the repo on GitHub at: [https://github.com/oktadeveloper/okta-spring-boot-jpa-example](https://github.com/oktadeveloper/okta-spring-boot-jpa-example).

Watch out for our next post in this series that will cover using a NoSQL database (MongoDB) with Spring WebFlux.

## Learn More about Spring Boot, Spring Security, and Secure Authentication

If you’d like to learn more about Spring Boot, Spring Security, or modern application security, check out any of these great tutorials:

-   [Get Started with Spring Boot, OAuth 2.0, and Okta](/blog/2017/03/21/spring-boot-oauth)
-   [Add Single Sign-On to Your Spring Boot Web App in 15 Minutes](/blog/2017/11/20/add-sso-spring-boot-15-min)
-   [Secure Your Spring Boot Application with Multi-Factor Authentication](/blog/2018/06/12/mfa-in-spring-boot)
-   [Build a Secure API with Spring Boot and GraphQL](/blog/2018/08/16/secure-api-spring-boot-graphql)

If you want to dive deeper, take a look at the [Okta Spring Boot Starter GitHub project](https://github.com/okta/okta-spring-boot).

This is a great reference for Spring Data and securing Spring Boot projects: [https://docs.spring.io/spring-data/rest/docs/current/reference/html/](https://docs.spring.io/spring-data/rest/docs/current/reference/html/)

Vlad Mihalcea has a great tutorial titled [9 High-Performance Tips when using PostgreSQL with JPA and Hibernate](https://vladmihalcea.com/9-postgresql-high-performance-performance-tips/).

Baeldung has a helpful tutorial on securing methods in Spring Data / Spring Boot projects: [https://www.baeldung.com/spring-security-method-security](https://www.baeldung.com/spring-security-method-security)

Lastly, if you need some more help with PostgreSQL on Mac OS X, see  [this codementor.io tutorial](https://www.codementor.io/engineerapart/getting-started-with-postgresql-on-mac-osx-are8jcopb).

If you have any questions about this post, please add a comment below. For more awesome content, follow [@oktadev](https://twitter.com/oktadev) on Twitter, like us [on Facebook](https://www.facebook.com/oktadevelopers/), or subscribe to [our YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q).
