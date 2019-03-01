---
layout: blog_post
title: "Build Spring Microservices and Dockerize Them for Production"
author: raphaeldovale
description: "Learn how to build and package a microservices architecture with Spring Boot and Spring Cloud in this tutorial."
tags: [java, spring security, spring boot, spring framework, spring cloud, docker, microservices, eureka]
tweets:
  - "Learn how to use Spring Boot with OAuth 2.0, Cloud Config, Eureka and Docker!"
  - "Modern microservice architecture, learn how to create a complete project!"
image: blog/featured/okta-java-tile-books-mouse.jpg
---

In this post, you'll learn about microservices architecture and how to implement it using Spring Boot. After creating some projects with the technique, you will deploy the artifacts as Docker containers and will simulate a _container orchestrator_ (such as Kubernetes) using _Docker Compose_ for simplification. The icing on the cake will be authentication integration using Spring Profiles; you will see how to enable it with a production profile.

But first, let's talk about microservices.

## Understand a Modern Microservice Architecture

Microservices, as opposed to a monolith architecture, dictates you have to divide your application into small, logically related, pieces. These pieces are independent software that communicates with other pieces using HTTP or messages, for example. 

There is some discussion of what size _micro_ is. Some say a microservice is software that can be created in a single sprint; others say microservices can have bigger size if it is logically related (you can't mix apples and oranges, for example). I agree with [Martin Fowler](https://martinfowler.com/articles/microservices.html) and think size doesn't matter that much, and it's more related to the style.

There are many advantages to microservices:

* **No high coupling risk** - Since each app lives in a different process, it is impossible to create classes that talk to each other. 
* **Easy scaling** - As you already know, every service is an independent piece of software. As such, it can be scaled up or down on demand. Moreover, since the code is _smaller_ than a monolith, it probably will start up faster.
* **Multiple stacks** - You can use the best software stack for every service. No more need to use Java when, say, Python is better for what you're building.
* **Fewer merges and code conflicts** - As every service is a different repository, it is easier to handle and review commits.

However, there are some drawbacks:

* You have a new enemy - **network issues**. Is the service up? What can you do if the service is down?
* **Complex deployment process** - OK CI/CD is here, but you now have one workflow for each service. If they use different stacks, it's possible you can't even replicate a workflow for each.
* **More complex and hard-to-understand architecture** - it depends on how you design it, but consider this: if you don't know what a method is doing, you can read its code. In a microservice architecture, this method may be in another project, and you may not even have the code.

Nowadays, it's commonly accepted that you should [avoid a microservice architecture at first](https://martinfowler.com/bliki/MonolithFirst.html). After some iterations, the code division will become clearer as will the demands of your project. It is often too expensive to handle microservices until your development team starts into small projects.

## Build Microservices in Spring with Docker

You'll build two projects in this tutorial: a service (school-service) and a UI (school_ui). The service provides the persistent layer and business logic, and the UI provides the graphical user interface. Connecting them is possible with minimal configuration.

After the initial setup, I'll talk about discovery and configuration services. Both services are an essential part of any massively distributed architecture. To prove this point, you will integrate it with OAuth 2.0 and use the configuration project to set the OAuth 2.0 keys.

Finally, each project will be transformed into a Docker image. Docker Compose will be used to simulate a _container orchestrator_ as Compose will manage every container with an internal network between the services.

Lastly, Spring profiles will be introduced to change configuration based on the environment currently appropriately assigned. That way, you will have two OAuth 2.0 environments: one for development, and other for production.

Fewer words, more code! Clone this tutorial's repository and check out the `start` branch.

```bash
git clone -b start https://github.com/oktadeveloper/okta-spring-microservices-docker-example.git 
```

The root `pom.xml` file is not a requirement. However, it can be helpful to manage multiple projects at once. Let's look inside:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.okta.developer.docker_microservices</groupId>
    <artifactId>parent-pom</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>pom</packaging>
    <name>parent-project</name>
    <modules>
        <module>school-service</module>
        <module>school-ui</module>    
    </modules>
</project>
```

This is called an _aggregate project_ because it aggregates child projects. It is useful for running the same Maven task on all declared modules. The modules do not need to use the root module as a parent.

There are two modules available: a school service, and a school UI. 

## The School Service Microservice

The `school-service` directory contains a Spring Boot project that acts as the project's persistence layer and business rules. In a more complex scenario, you would have more services like this. The project was created using the always excellent [Spring Initializr](https://start.spring.io/) with the following configuration:

{% img "blog/spring-microservices-docker/initializr-service.png" alt:"Spring Initializr" width:"800" %}{: .center-image }

* Group - `com.okta.developer.docker_microservices`
* Artifact - `school-service`
* Dependencies - JPA, Web, Lombok, H2

You can get more details about this project by reading [Spring Boot with PostgreSQL, Flyway, and JSONB](/blog/2019/02/20/spring-boot-with-postgresql-flyway-jsonb). To summarize, it has the entities `TeachingClass`, `Course,` `Student` and uses `TeachingClassServiceDB` and `TeachingClassController` to expose some data through a REST API. To test it, open a terminal, navigate to the `school-service` directory, and run the command below:

```bash
./mvnw spring-boot:run
```

The application will start on port `8081` (as defined in file `school-service/src/main/resources/application.properties`), so you should be able to navigate to `http://localhost:8081` and see the returned data.

```bash
> curl http://localhost:8081
[
   {
      "classId":13,
      "teacherName":"Profesor Jirafales",
      "teacherId":1,
      "courseName":"Mathematics",
      "courseId":3,
      "numberOfStudents":2,
      "year":1988
   },
   {
      "classId":14,
      "teacherName":"Profesor Jirafales",
      "teacherId":1,
      "courseName":"Spanish",
      "courseId":4,
      "numberOfStudents":2,
      "year":1988
   },
   {
      "classId":15,
      "teacherName":"Professor X",
      "teacherId":2,
      "courseName":"Dealing with unknown",
      "courseId":5,
      "numberOfStudents":2,
      "year":1995
   },
   {
      "classId":16,
      "teacherName":"Professor X",
      "teacherId":2,
      "courseName":"Dealing with unknown",
      "courseId":5,
      "numberOfStudents":1,
      "year":1996
   }
]
```

## The Spring-Based School UI Microservice 
 
The school UI is, as the name says, the user interface that utilizes School Service. It was created using Spring Initializr with the following options:

* Group - `com.okta.developer.docker_microservices`
* Artifact - `school-ui`
* Dependencies - Web, Hateoas, Thymeleaf, Lombok

The UI is a single web page that lists the classes available on the database. To get the information, it connects with the `school-service` through a configuration in file `school-ui/src/main/resources/application.properties`. 

```properties
service.host=localhost:8081
```

The class `SchoolController` class has all the logic to query the service:

```java
package com.okta.developer.docker_microservices.ui.controller;

import com.okta.developer.docker_microservices.ui.dto.TeachingClassDto;
import org.springframework.beans.factory.annotation.*;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;
import java.util.List;

@Controller
@RequestMapping("/")
public class SchoolController {
    private final RestTemplate restTemplate;
    private final String serviceHost;

    public SchoolController(RestTemplate restTemplate, @Value("${service.host}") String serviceHost) {
        this.restTemplate = restTemplate;
        this.serviceHost = serviceHost;
    }

    @RequestMapping("")
    public ModelAndView index() {
        return new ModelAndView("index");
    }

    @GetMapping("/classes")
    public ResponseEntity<List<TeachingClassDto>> listClasses(){
        return restTemplate
                .exchange("http://"+ serviceHost +"/class", HttpMethod.GET, null,
                        new ParameterizedTypeReference<List<TeachingClassDto>>() {});
    }
}
```

As you can see, there is a hard-coded location for the service. You can change the property setting with an environment variable like this `-Dservice.host=localhost:9090`. Still, it has to be manually defined. How about having many instances of _school-service_ application? Impossible at the current stage.

With _school-service_ turned on, start `school-ui`, and navigate to it in a browser at `http://localhost:8080`:

```bash
./mvnw spring-boot:run
```

You should see a page like the following:

{% img "blog/spring-microservices-docker/school-ui.png" alt:"School UI" width:"400" %}{: .center-image }

## Build a Discovery Server with Spring Cloud and Eureka

Now you have a working application that uses two services to provide the information to end-user. What is wrong with it? In modern applications, developers (or operations) usually don't know where or what port an application might be deployed on. The deployment should be automated so that no one _cares_ about server names and physical location. (Unless you work inside a data center. If you do, I hope you care!)

Nonetheless, it is essential to have a tool that helps the services to discover their counterparts. There are many solutions available, and for this tutorial, we are going to use _Eureka_ from Netflix as it has outstanding Spring support.

Go back to [start.spring.io](http://start.spring.io) and create a new project as follows:

* Group: `com.okta.developer.docker_microservices`
* Artifact: `discovery`
* Dependencies: Eureka Server

Edit the main `DiscoveryApplication.java` class to add an `@EnableEurekaServer` annotation:

```java
package com.okta.developer.docker_microservices.discovery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class DiscoveryApplication {
    public static void main(String[] args) {
        SpringApplication.run(DiscoveryApplication.class, args);
    }
}
```

And, you'll need to update its `application.properties` file so it runs on port 8761 and doesn't try to register with itself.

```properties
spring.application.name=discovery-server
server.port=8761
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
```

Let's define each property:

* `spring.application.name` - The name of the application, also used by the discovery service to _discover_ a service. You'll see that every other application has an application name too.
* `server.port` - The port the server is running. `8761` is the default port for Eureka server.
* `eureka.client.register-with-eureka` - Tells Spring not to register itself into the discovery service.
* `eureka.client .fetch-registry` - Indicates this instance should not fetch discovery information from the server.

Now, run and access `http://localhost:8761`.

```bash
./mvnw spring-boot:run
```

{% img "blog/spring-microservices-docker/eureka-empty.png" alt:"Empty Eureka Service" width:"800" %}{: .center-image }

The screen above shows the Eureka server ready to register new services. Now, it is time to change _school-service_ and _school-ui_ to use it.

**NOTE:** If you receive a `ClassNotFoundException: javax.xml.bind.JAXBContext` error on startup, it's because you're running on Java 11. You can add JAXB dependencies to your `pom.xml` to fix this.

```xml
<dependency>
  <groupId>javax.xml.bind</groupId>
  <artifactId>jaxb-api</artifactId>
  <version>2.3.1</version>
</dependency>
<dependency>
  <groupId>org.glassfish.jaxb</groupId>
  <artifactId>jaxb-runtime</artifactId>
  <version>2.3.2</version>
</dependency>
```

### Use Service Discovery to Communicate Between Microservices

First, it is important to add the required dependencies. Add the following to both `pom.xml` file (in the _school-service_ and _school-ui_ projects):

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

This module is part of the Spring Cloud initiative and, as such, needs a new dependency management node as follows (don't forget to add to both projects):

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${spring-cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

Now you need to configure both applications to register with Eureka.

In the `application.properties` file of both projects, add the following lines:

```properties
eureka.client.serviceUrl.defaultZone=${EUREKA_SERVER:http://localhost:8761/eureka}
spring.application.name=school-service
```

Don't forget to change the application name from `school-service` to `school-ui` in the _school-ui_ project. Notice there is a new kind of parameter in the first line: `{EUREKA_SERVER:http://localhost:8761/eureka}`. It means "if environment variable EUREKA_SERVER exists, use its value, if not, here's a default value." This will be useful in future steps. ;)

You know what? Both applications are ready to register themselves into the discovery service. You don't need to do anything more. Our primary objective is that _school-ui_ project does not need to know _where_ school-service is. As such, you need to change `SchoolController` (in the `school-ui` project) to use `school-service` in its REST endpoint. You can also remove the `serviceHost` variable in this class. 

```java
package com.okta.developer.docker_microservices.ui.controller;

import com.okta.developer.docker_microservices.ui.dto.TeachingClassDto;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
@RequestMapping("/")
public class SchoolController {
    private final RestTemplate restTemplate;

    public SchoolController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @RequestMapping("")
    public ModelAndView index() {
        return new ModelAndView("index");
    }

    @GetMapping("/classes")
    public ResponseEntity<List<TeachingClassDto>> listClasses() {
        return restTemplate
                .exchange("http://school-service/classes", HttpMethod.GET, null,
                        new ParameterizedTypeReference<List<TeachingClassDto>>() {});
    }
}
```

Before integrating Eureka, you had a configuration pointing out where _school-service_ was. Now, you've changed the service calls to use the name used by the other service: no ports, no hostname. The service you need is somewhere, and you don't need to know where. 

The _school-service_ may have multiple instances of and it would be a good idea to load balance the calls between the instances. Thankfully, Spring has a simple solution: on the `RestTemplate` bean creation, add `@LoadBalanced` annotation as follows. Spring will manage multiple instance calls each time you ask something to the server.

```java
package com.okta.developer.docker_microservices.ui;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.*;

@SpringBootApplication
public class UIWebApplication implements WebMvcConfigurer {

    public static void main(String[] args) {
        SpringApplication.run(UIWebApplication.class, args);
    }

    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        if(!registry.hasMappingForPattern("/static/**")) {
            registry.addResourceHandler("/static/**")
                    .addResourceLocations("classpath:/static/", "classpath:/static/js/");
        }
    }
}
```

Now, start restart _school-service_ and _school-ui_ (and keep the Discovery service up). Have a quick look at `http://localhost:8761` again:

{% img "blog/spring-microservices-docker/eureka-filled.png" alt:"Populated Eureka Service" width:"800" %}{: .center-image }

Now your services are sharing info with the Discovery server. You can test the application again and see that it work as always. Just go to `http://localhost:8080` in your favorite browser. 

## Add a Configuration Server to Your Microservices Architecture

While this configuration works, it's even better to remove any trace of configuration values in the project's source code. First, the configuration URL was removed from the project and became managed by a service. Now, you can do a similar thing for every configuration on the project using [Spring Cloud Config](https://spring.io/projects/spring-cloud-config).

First, create the configuration project using [Spring Initializr](http://start.spring.io) and the following parameters:

* Group: `com.okta.developer.docker_microservices`
* Artifact: `config`
* Dependencies: Config Server, Eureka Discovery

In the main class, add `@EnableConfigServer`:

```java
package com.okta.developer.docker_microservices.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

@SpringBootApplication
@EnableConfigServer
public class ConfigApplication {
    ...
}
```

Add the following properties and values  in the project's `application.properties`:

```properties
spring.application.name=CONFIGSERVER
server.port=8888
spring.profiles.active=native
spring.cloud.config.server.native.searchLocations=.
eureka.client.serviceUrl.defaultZone=${EUREKA_SERVER:http://localhost:8761/eureka}
```

Some explanation about the properties:

* `spring.profiles.active=native` - Indicates Spring Cloud Config must use the native file system to obtain the configuration. Normally Git repositories are used, but we are going to stick with native filesystem for simplicity sake.
* `spring.cloud.config.server.native.searchLocations` - The path containing the configuration files. If you change this to a specific folder on your hard drive, make sure and create the `school-ui.properties` file in it.

Now, you need something to configure and apply to this example. How about Okta's configuration? Let's put our _school-ui_ behind an authorization layer and use the property values provided by the configuration project.

You can register for a [free-forever developer account](https://developer.okta.com/signup/) that will enable you to create as many user and applications you need to use! After creating your account, create a new Web Application in Okta's dashboard (**Applications** > **Add Application**):

{% img "blog/spring-microservices-docker/okta-new-web-application.png" alt:"New web application" width:"800" %}{: .center-image }

And fill the next form with the following values:

{% img "blog/spring-microservices-docker/okta-new-web-application-step2.png" alt:"New web application, Step 2" width:"800" %}{: .center-image }

The page will return you an application ID and an secret key. Keep then safe and create a file called `school-ui.properties` in the root folder of the `config` project with the following contents. Do not forget to populate the variable values:

```properties
okta.oauth2.issuer=https://{yourOktaDomain}/oauth2/default
okta.oauth2.clientId={yourClientId}
okta.oauth2.clientSecret={yourClientSecret}
```

Now, run the `config` project and check if its getting the configuration data properly:

```bash
./mvnw spring-boot:run
> curl http://localhost:8888/school-ui.properties
okta.oauth2.clientId: YOUR_CLIENT_ID
okta.oauth2.clientSecret: YOUR_CLIENT_SECRET
okta.oauth2.issuer: https://YOUR_DOMAIN/oauth2/default
```

### Change School UI to Use Spring Cloud Config and OAuth 2.0

Now you need to change the Spring UI project a little bit.

First, you need to change `school-ui/pom.xml` and add some new dependencies:

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-config</artifactId>
</dependency>
<dependency>
    <groupId>com.okta.spring</groupId>
    <artifactId>okta-spring-boot-starter</artifactId>
    <version>1.1.0</version>
</dependency>
<dependency>
    <groupId>org.thymeleaf.extras</groupId>
    <artifactId>thymeleaf-extras-springsecurity5</artifactId>
</dependency>
```

Create a new `SecurityConfiguration` class in the `com.okta...ui.config` package:

```java
package com.okta.developer.docker_microservices.ui;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SpringSecurityConfiguration extends WebSecurityConfigurerAdapter {

   @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers("/").permitAll()
                .anyRequest().authenticated()
            .and()
                .logout().logoutSuccessUrl("/")
            .and()
                .oauth2Login();
    }
}
```

Change your `SchoolController` so only users with scope `profile` will be allowed (every authenticated user will have it).

```java
import org.springframework.security.access.prepost.PreAuthorize;

....

@GetMapping("/classes")
@PreAuthorize("hasAuthority('SCOPE_profile')")
public ResponseEntity<List<TeachingClassDto>> listClasses(){
    return restTemplate
        .exchange("http://school-service/class", HttpMethod.GET, null,
                new ParameterizedTypeReference<List<TeachingClassDto>>() {});
}
```

Some configurations need to be defined at project boot time. Spring had a clever solution to locate properly and extract configuration data _before_ context startup. You need to create a file `src/main/resources/bootstrap.yml` like this:

```yml
eureka:
  client:
    serviceUrl:
      defaultZone: ${EUREKA_SERVER:http://localhost:8761/eureka}
spring:
  application:
    name: school-ui
  cloud:
    config:
      discovery:
        enabled: true
        service-id: CONFIGSERVER
```

The bootstrap file creates a pre-boot Spring Application Context responsible for extracting configuration before the real application starts. You need to move all properties from `application.properties` to this file as Spring needs to know where your Eureka Server is located and how it should search for configuration. In the example above, you enabled configuration over discovery service (`spring.cloud.config.discovery.enabled`) and specified the Configuration `service-id`.

Change your `application.properties` file so it only has one OAuth 2.0 property: 

```properties
okta.oauth2.redirect-uri=/authorization-code/callback
```

The last file to modify is `src/main/resources/templates/index.hml`. Adjust it to show a login button if the user is not authenticated, and a logout button if the user is logged in.

```html
<!doctype html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">

    <title>Hello, world!</title>
</head>
<body>
<nav class="navbar navbar-default">
    <form method="post" th:action="@{/logout}" th:if="${#authorization.expression('isAuthenticated()')}" class="navbar-form navbar-right">
        <input type="hidden" th:name="${_csrf.parameterName}" th:value="${_csrf.token}" />
        <button id="logout-button" type="submit" class="btn btn-danger">Logout</button>
    </form>
    <form method="get" th:action="@{/oauth2/authorization/okta}" th:unless="${#authorization.expression('isAuthenticated()')}">
        <button id="login-button" class="btn btn-primary" type="submit">Login</button>
    </form>
</nav>

<div id="content" th:if="${#authorization.expression('isAuthenticated()')}">
    <h1>School classes</h1>

    <table id="classes">
        <thead>
        <tr>
            <th>Course</th>
            <th>Teacher</th>
            <th>Year</th>
            <th>Number of students</th>
        </tr>
        </thead>
        <tbody>

        </tbody>
    </table>

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->

    <script src="http://code.jquery.com/jquery-3.3.1.min.js" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
    <script src="static/js/school_classes.js"></script>
</div>

</body>
</html>
```

There are some Thymeleaf properties you should know about in this HTML:

* `@{/logout}` - returns the logout URL defined on the backend
* `th:if="${#authorization.expression('isAuthenticated()')}"` - only print the HTML if the user is **logged in**
* `@{//oauth2/authorization/okta}` - this is the URL that Spring Security redirects to for Okta. You could link to `/login` as well, but that just renders the same link and you have to click on it. 
* `th:unless="${#authorization.expression('isAuthenticated()')}"` - only print the HTML inside the node if the user is **logged off**

Now restart the configuration project and school-ui again. If you navigate to typing `http://localhost:8080`, you should see the following screen:

{% img "blog/spring-microservices-docker/school-ui-loggedin.png" alt:"Log in" width:"400" %}{: .center-image }

After logged in, the screen should appear like this one:

{% img "blog/spring-microservices-docker/school-ui-loggedoff.png" alt:"Log off" width:"400" %}{: .center-image }

Congratulations, you created a microservices architecture using Spring Cloud config and Eureka for service discovery! Now, let's go one step further and Dockerize every service.

## Use Docker to Package Your Spring Apps

[Docker](https://www.docker.com/) is a marvelous technology that allows creating system images similar to _Virtual Machines_ but that shares the same Kernel of the host operating system. This feature increases system performance and startup time. Also, Docker provided an ingenious built system that guarantees once an image is created; it won't be changed, ever. In other words: no more "it works on my machine!"

**TIP:** Need a deeper Docker background? Have a look at our [Developer's Guide To Docker](/blog/2017/05/10/developers-guide-to-docker-part-1).

You'll need to create one Docker image for each project. Each image should have the same Maven configuration and `Dockerfile` content in the root folder of each project (e.g., `school-ui/Dockerfile`).

In each project's pom, add the `dockerfile-maven-plugin`:

```xml
<plugins>
    ...
    <plugin>
        <groupId>com.spotify</groupId>
        <artifactId>dockerfile-maven-plugin</artifactId>
        <version>1.4.9</version>
        <executions>
            <execution>
                <id>default</id>
                <goals>
                    <goal>build</goal>
                    <goal>push</goal>
                </goals>
            </execution>
        </executions>
        <configuration>
            <repository>developer.okta.com/microservice-docker-${project.artifactId}</repository>
            <tag>${project.version}</tag>
            <buildArgs>
                <JAR_FILE>${project.build.finalName}.jar</JAR_FILE>
            </buildArgs>
        </configuration>
    </plugin>
</plugins>
```

This XML configures the [Dockerfile Maven](https://github.com/spotify/dockerfile-maven) plugin to build a Docker image every time you run `./mvnw install`. Each image will be created with the name `developer.okta.com/microservice-docker-${project.artifactId}` where `project.artifactId` varies by project. 

Create a `Dockerfile` file in the root directory of each project.

```Dockerfile
FROM openjdk:8-jdk-alpine
VOLUME /tmp
ADD target/*.jar app.jar
ENV JAVA_OPTS="
ENTRYPOINT [ "sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar /app.jar" ]
```

The `Dockerfile` follows what is recommended by [Spring Boot with Docker](https://spring.io/guides/gs/spring-boot-docker/).

Now, change `school-ui/src/main/resources/bootstrap.yml` to add a new `failFast` setting:

```yml
eureka:
  client:
    serviceUrl:
      defaultZone: ${EUREKA_SERVER:http://localhost:8761/eureka}
spring:
  application:
    name: school-ui
  cloud:
    config:
      discovery:
        enabled: true
        serviceId: CONFIGSERVER
      failFast: true
```

The `spring.cloud.failFast: true` setting tells Spring Cloud Config to terminate the application as soon as it can't find the configuration server. This will be useful for the next step.

### Add Docker Compose to Run Everything

Create a new file called `docker-compose.yml` that defines how each project starts:

```yaml
version: '3'
services:
  discovery:
    image: developer.okta.com/microservice-docker-discovery:0.0.1-SNAPSHOT
    ports:
      - 8761:8761
  config:
    image: developer.okta.com/microservice-docker-config:0.0.1-SNAPSHOT
    volumes:
      - ./config-data:/var/config-data
    environment:
      - JAVA_OPTS=
         -DEUREKA_SERVER=http://discovery:8761/eureka
         -Dspring.cloud.config.server.native.searchLocations=/var/config-data
    depends_on:
      - discovery
    ports:
      - 8888:8888
  school-service:
    image: developer.okta.com/microservice-docker-school-service:0.0.1-SNAPSHOT
    environment:
      - JAVA_OPTS=
        -DEUREKA_SERVER=http://discovery:8761/eureka
    depends_on:
      - discovery
      - config
  school-ui:
    image: developer.okta.com/microservice-docker-school-ui:0.0.1-SNAPSHOT
    environment:
      - JAVA_OPTS=
        -DEUREKA_SERVER=http://discovery:8761/eureka
    restart: on-failure
    depends_on:
      - discovery
      - config
    ports:
      - 8080:8080
```

As you can see, each project is now a declared service in Docker compose the file. It'll have its ports exposed and some other properties.

* All projects besides _discovery_ will have a variable value `-DEUREKA_SERVER=http://discovery:8761/eureka`. This will tell where to find the Discovery server. Docker Compose creates a virtual network between the services and the DNS name used for each service is its name: that's why it's possible to use `discovery` as the hostname.
* The Config service will have a volume going to configuration files. This volume will be mapped to `/var/config-data` inside the docker container. Also, the property `spring.cloud.config.server.native.searchLocations` will be overwritten to the same value. You must store the file `school-ui.properties` in the same folder specified on the volume mapping (in the example above, the _relative_ folder `./config-data`).
* The _school-ui_ project will have the property `restart: on-failure`. This set Docker Compose to restart the application as soon as it fails. Using together with `failFast` property allows the application to keep trying to start until the _Discovery_ and _Config_ projects are completely ready.

And that's it! Now, build the images:

```bash
cd config && ./mvnw clean install
cd ../discovery && ./mvnw clean install
cd .. && ./mvnw clean install
```

The last command will likely fail with the following error in the `school-ui` project:

```
java.lang.IllegalStateException: Failed to load ApplicationContext
Caused by: java.lang.IllegalStateException: No instances found of configserver (CONFIGSERVER)
```

To fix this, create a `school-ui/src/test/resources/test.properties` file and add properties so Okta's config passes, and it doesn't use discovery or the config server when testing.

```properties
okta.oauth2.issuer=https://{yourOktaDomain}/oauth2/default
okta.oauth2.clientId=TEST
spring.cloud.discovery.enabled=false
spring.cloud.config.discovery.enabled = false
spring.cloud.config.enabled = false
```

Then modify `UIWebApplicationTests.java` to load this file for test properties:

```java
import org.springframework.test.context.TestPropertySource;

...
@TestPropertySource(locations="classpath:test.properties")
public class UIWebApplicationTests {
    ...
}
```

Now you should be able to run `./mvnw clean install` in the `school-ui` project. 

Once that completes, run Docker Compose to start all your containers (in the same directory where `docker-compose.yml` is).

```bash
docker-compose up -d
Starting okta-microservice-docker-post-final_discovery_1 ... done
Starting okta-microservice-docker-post-final_config_1    ... done
Starting okta-microservice-docker-post-final_school-ui_1      ... done
Starting okta-microservice-docker-post-final_school-service_1 ... done
```

Now you should be able to browse the application as you did previously.


## Use Spring Profiles to Modify Your Microservices' Configuration

Now you've reached the last stage of today's journey through microservices. [Spring Profiles](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-profiles.html) is a powerful tool. Using profiles, it is possible to modify program behavior by injecting different dependencies or configurations completely.

Imagine you have a well-architected software that has its persistence layer separated from business logic. You also provide support for MySQL and PostgreSQL, for example. It is possible to have different data access classes for each database that will be only loaded by the defined profile.

Another use case is for configuration: different profiles might have different configurations. Take authentication, for instance. Will your test environment have authentication? If it does, it shouldn't use the same user directory as production.

Change your configuration project to have two apps in Okta: one default (for development) and another for production. Create a new Web application on Okta website and name it "okta-docker-production." 

Now, in your `config` project, create a new file called `school-ui-production.properties`. You already have `school-ui.properties`, which will be used by every School UI instance. When adding the environment at the end of the file, Spring will merge both files and take precedence over the most specific file. Save the file with your production app's client ID and secret, like this:

**school-ui-production.properties**

```properties
okta.oauth2.clientId={YOUR_PRODUCTION_CLIENT_ID}
okta.oauth2.clientSecret={YOUR_PRODUCTION_CLIENT_SECRET}
```

Now, run the configuration project using Maven, then run the following two `curl` commands:

```bash
./mvnw spring-boot:run

> curl http://localhost:8888/school-ui.properties

okta.oauth2.issuer: https://{yourOktaDomain}/oauth2/default
okta.oauth2.clientId: ==YOUR DEV CLIENT ID HERE==
okta.oauth2.clientSecret: ==YOUR DEV CLIENT SECRET HERE==

> curl http://localhost:8888/school-ui-production.properties
okta.oauth2.issuer: https://{yourOktaDomain}/oauth2/default
okta.oauth2.clientId: ==YOUR PROD CLIENT ID HERE==
okta.oauth2.clientSecret: ==YOUR PROD CLIENT SECRET HERE==
```

As you can see, even though the file `school-ui-production` has two properties, the `config` project displays three (since the configurations are merged).

Now, you can change the `school-ui` service in the `docker-compose.yml` to use the `production` profile:

```yaml
school-ui:
  image: developer.okta.com/microservice-docker-school-ui:0.0.1-SNAPSHOT
  environment:
    - JAVA_OPTS=
      -DEUREKA_SERVER=http://discovery:8761/eureka
      -Dspring.profiles.active=production
  restart: on-failure
  depends_on:
    - discovery
    - config
  ports:
    - 8080:8080
```

You'll also need to copy `school-ui-production.properties` to your `config-data` directory. Then shut down all your Docker containers and restart them.

```shell
docker-compose down
docker-compose up -d
```

You should see the following printed in the logs of the `school-ui` container:

```
The following profiles are active: production
```

That's it! Now you have your microservices architecture running with a production profile. Huzzah!

**TIP:** If you want to prove your `okta-docker-production` app is used and not `okta-docker`, you can deactivate the `okta-docker` app in Okta and confirm you can still log in at `http://localhost:8080`.

## Learn More About Microservices, Spring, Docker, and Modern Application Security

In this post, you learned more about microservices and how to deploy them, along with:

* What is a microservice?
* How services should discover its dependencies without previously knowing where they are located.
* How to maintain distributed configuration with a central point of information. The configuration can manage one or more applications and environments.
* How to configure OAuth 2.0 using Spring Cloud Config.
* How to deploy microservices using Docker and Docker Compose.
* How to use Spring Profiles to deploy in a production environment.

You can find the completed source code for this tutorial on GitHub at [oktadeveloper/okta-spring-microservices-docker-example](https://github.com/oktadeveloper/okta-spring-microservices-docker-example).

If you're interested in learning more about microservices, or modern application development in Spring, I encourage you to check out these resources:

* [Build and Secure Microservices with Spring Boot 2.0 and OAuth 2.0](https://developer.okta.com/blog/2018/05/17/microservices-spring-boot-2-oauth)
* [Developer a Microservices Architecture with JHipster and OAuth 2.0](https://developer.okta.com/blog/2018/03/01/develop-microservices-jhipster-oauth)
* [Build a Microservices Architecture for Microbrews with Spring Boot ](https://developer.okta.com/blog/2017/06/15/build-microservices-architecture-spring-boot)
* [Spring Boot 2.1: Outstanding OIDC, OAuth 2.0, and Reactive API Support](/blog/2018/11/26/spring-boot-2-dot-1-oidc-oauth2-reactive-apis)
* [Build a Reactive App with Spring Boot and MongoDB](/blog/2019/02/21/reactive-with-spring-boot-mongodb)

If you have any questions about this post, please leave a comment below. 
You can [follow @oktadev on Twitter](https://twitter.com/oktadev) for more awesome content!
