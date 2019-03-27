---
layout: blog_post
title: "Test Your Spring Boot Applications with JUnit 5"
author: joyannefoster
description: "Learn how to use JUnit 5 to write Java-based unit and integration tests for your Spring Boot apps."
tags: [java, testing, junit, junit5]
tweets:
- "Learn how to use #JUnit 5 to testing your secure Spring Boot applications in this handy tutorial!"
- "JUnit 5 is the same JUnit you know and love. Learn how to use it with @springboot today!"
- "Spring Boot + Spring Security + JUnit 5 = 💚! Learn more about this awesome testing framework from the @junitteam."
image: blog/featured/okta-java-headphones.jpg
---

In this post, you'll walk through how to build a simple Spring Boot application and test it with Junit 5. An application without testing is the proverbial Pandora's Box.  What good is your application if you don't know that it will work under any condition?  Adding a suite of tests builds confidence that your application can handle anything thrown at it.  When building your tests, it is important to use a modern and comprehensive suite of tools.  Using a modern framework ensures that you can keep up with the changes within your language and libraries.  A comprehensive suite of tools ensures that you can adequately test all areas of your application without the burden of writing your own test utilities.  JUnit 5 handles both requirements well.

The application used for this post will be a basic REST API with endpoints to calculate a few things about a person's birthday! There are three POST endpoints you will be able to use to determine either the day of the week, the astrological sign, or the Chinese Zodiac sign for a passed in birthday. This REST API will be secured with OAuth 2.0 and Okta. Once we have built the API, we will walk through unit testing the code with JUnit 5 and review the coverage of our JUnit tests.

The main advantage of using the Spring Framework is the ability to inject your dependencies, which makes it much easier to swap out implementations for various purposes, but not least of all for unit testing.  Spring Boot makes it even easier by allowing you to do much of the dependency injection with annotations instead of having to bother with a complicated `applicationContext.xml` file!

> NOTE: For this post, I will be using Eclipse, as it is my preferred IDE.  If you are using Eclipse as well,  you will need a version of Oxygen or beyond in order to have JUnit 5 (Jupiter) test support included: https://www.eclipse.org/downloads/packages/installer. 
 
## Create a Spring Boot App for Testing with JUnit 5

For this tutorial, the structure of the project is as shown below.  I will only discuss the file names, but you can find their path using the below structure, looking through the full source, or paying attention to the package.

To get going, you'll create a Spring Boot project from scratch.
 
**NOTE:** The following steps are for Eclipse.  If you use a different IDE, there are likely equivalent steps. Optionally, you can create your own project directory structure and write the final `pom.xml` file in any text editor you like.

Create a new Maven Project from **File** > **New** menu.  Select the location of your new project and click next twice and then fill out the group id, artifact id, and version for your application.  For this example, I used the following options:

- Group Id: `com.example.joy`
- Artifact Id: `myFirstSpringBoot`
- Version: `0.0.1-SNAPSHOT`

{% img blog/junit5-spring-boot/new-maven-project.png alt:"New Maven Project" width:"600" %}{: .center-image }

> HINT: If Maven is new to you and it is unclear how to choose your group id, artifact id, or version, please review these conventions: https://maven.apache.org/guides/mini/guide-naming-conventions.html

When done, this will produce a `pom.xml` file that looks like the following:

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.3.RELEASE</version>
    </parent>
    <groupId>com.example.joy</groupId>
    <artifactId>myFirstSpringBoot</artifactId>
    <version>0.0.1-SNAPSHOT</version>
</project>
```

Next, you'll want to update the `pom.xml` with some basic settings and dependencies to look like the following (add everything after version):

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.3.RELEASE</version>
    </parent>
    <groupId>com.example.joy</groupId>
    <artifactId>myFirstSpringBoot</artifactId>
    <version>0.0.1-SNAPSHOT</version>

    <properties>
        <java.version>1.8</java.version>
        <spring.boot.version>2.1.3.RELEASE</spring.boot.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
           <exclusions>
                <exclusion>
                    <groupId>junit</groupId>
                    <artifactId>junit</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
        <dependency>
             <groupId>org.junit.jupiter</groupId>
             <artifactId>junit-jupiter-engine</artifactId>
             <scope>test</scope>
         </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

Take note that you need to exclude the default JUnit from the spring-boot-starter-test dependency. The `junit-jupiter-engine` dependency is for JUnit 5.

## Create a Java REST API with Spring Boot for Your JUnit 5 Testing

Let's start with the main application file, which is the entry point for starting the Java API.  This is a file called `SpringBootRestApiApplication.java` that looks like this:

```java
package com.example.joy.myFirstSpringBoot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.example.joy"})
public class SpringBootRestApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootRestApiApplication.class, args);
    }
}
```

The `SpringBootApplication` annotation tells the application that it should support auto-configuration, component scanning (of `com.example.joy` package and everything under it), and bean registration.
    
```java
@SpringBootApplication(scanBasePackages = {"com.example.joy"})
```

This line launches the REST API application:

```java
SpringApplication.run(SpringBootRestApiApplication.class, args);
```

`BirthdayService.java` is the interface for the birthday service.  It is pretty straight forward, defining that there are four helper functions available.  

```java
package com.example.joy.myFirstSpringBoot.services;

import java.time.LocalDate;

public interface BirthdayService {
    LocalDate getValidBirthday(String birthdayString) ;
    
    String getBirthDOW(LocalDate birthday);
    
    String getChineseZodiac(LocalDate birthday);

    String getStarSign(LocalDate birthday) ;
}
```

`BirthdayInfoController.java` handles the three post requests to get birthday information.  It looks like this:

```java
package com.example.joy.myFirstSpringBoot.controllers;

import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.joy.myFirstSpringBoot.services.BirthdayService;

@RestController
@RequestMapping("/birthday")
public class BirthdayInfoController {
    private final BirthdayService birthdayService;

    public BirthdayInfoController(BirthdayService birthdayService){
        this.birthdayService = birthdayService;
    }
    
    @PostMapping("/dayOfWeek")
    public String getDayOfWeek(@RequestBody String birthdayString) {
        LocalDate birthday = birthdayService.getValidBirthday(birthdayString);

        String dow = birthdayService.getBirthDOW(birthday);
        
        return dow;
    }

    @PostMapping("/chineseZodiac")
    public String getChineseZodiac(@RequestBody String birthdayString) {
        LocalDate birthday = birthdayService.getValidBirthday(birthdayString);
        String sign = birthdayService.getChineseZodiac(birthday);
        
        return sign;
    }

    @PostMapping("/starSign")
    public String getStarSign(@RequestBody String birthdayString) {
        LocalDate birthday = birthdayService.getValidBirthday(birthdayString);
        String sign = birthdayService.getStarSign(birthday);
        
        return sign;
    }
    
    @ExceptionHandler(RuntimeException.class)
    public final ResponseEntity<Exception> handleAllExceptions(RuntimeException ex) {

        return new ResponseEntity<Exception>(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

### Spring MVC Annotations

First, you will notice the following annotations near the top. The `@RestController` annotation tells the system that this file is a "Rest API Controller" which simply means that it contains a collection of API endpoints.  You could also use the `@Controller` annotation, but it means that you would have to add more boilerplate code to convert the responses to an HTTP OK response instead of simply returning the values.  The second line tells it that all of the endpoints have the "/birthday" prefix in the path. I will show a full path for an endpoint later.
    
```java
@RestController
@RequestMapping("/birthday")
```

### Constructor Injection with Spring

Next, you will see a class variable for `birthdayService` (of type `BirthdayService`). This variable is initialized in the constructor of the class. Since Spring Framework 4.3, you no longer need to specify `@Autowired` when using constructor injection. This will have the effect of loading an instance of the `BasicBirthdayService` class, which we will look at shortly.

```java
private final BirthdayService birthdayService;

BirthdayInfoController(BirthdayService birthdayService){
    this.birthdayService = birthdayService;
}
```

### Handling POSTs to Your API

The next few methods (`getDayOfWeek`, `getChineseZodiac`, and `getStarSign`) are where it gets juicy. They are the handlers for the three different endpoints. Each one starts with a `@PostMapping` annotation which tells the system the path of the endpoint. In this case, the path would be `/birthday/dayOfWeek` (the `/birthday` prefix came from the `@RequestMapping` annotation above).

```java
@PostMapping("/dayOfWeek")
```

Each endpoint method does the following:

* Accepts a `birthdayString` string.
* Uses the `birthdayService` to check if `birthdayString` string can be converted into a `LocalDate` object. If so, returns the `LocalDate` object to use in the later code. If not, throws an error (see Error Handling below).
* Gets the value to be returned (day of the week, Chinese zodiac sign, or astrological sign) from the `birthdayService`.
* Returns the string (which will make it respond with an HTTP OK under the hood).

### Error Handling in a RestController

Lastly, there is a method for error handling:

```java
@ExceptionHandler(RuntimeException.class)
public final ResponseEntity<Exception> handleAllExceptions(RuntimeException ex) {

    return new ResponseEntity<Exception>(ex, HttpStatus.INTERNAL_SERVER_ERROR);
}
```

Here, the `@ExceptionHandler` annotation tells it to catch any instance of RuntimeException within the endpoint functions and return a 500 response.

`BasicBirthdayService.java` handles the bulk of the actual business logic in this application. It is the class that has a function to check if a birthday string is valid as well as functions that calculate the day of the week, Chinese Zodiac, and astrological sign from a birthday.

```java
package com.example.joy.myFirstSpringBoot.services;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class BasicBirthdayService implements BirthdayService {
    private static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    public LocalDate getValidBirthday(String birthdayString) {
        if (birthdayString == null) {
            throw new RuntimeException("Must include birthday");
        }
        try {
            LocalDate birthdate = LocalDate.parse(birthdayString, formatter);
            return birthdate;
        } catch (Exception e) {
            throw new RuntimeException("Must include valid birthday in yyyy-MM-dd format");
        }

    }

    @Override
    public String getBirthDOW(LocalDate birthday) {
        return birthday.getDayOfWeek().toString();
    }

    @Override
    public String getChineseZodiac(LocalDate birthday) {
        int year = birthday.getYear();
        switch (year % 12) {
            case 0:
                return "Monkey";
            case 1:
                return "Rooster";
            case 2:
                return "Dog";
            case 3:
                return "Pig";
            case 4:
                return "Rat";
            case 5:
                return "Ox";
            case 6:
                return "Tiger";
            case 7:
                return "Rabbit";
            case 8:
                return "Dragon";
            case 9:
                return "Snake";
            case 10:
                return "Horse";
            case 11:
                return "Sheep";
        }

        return "";
    }

    @Override
    public String getStarSign(LocalDate birthday) {
        int day = birthday.getDayOfMonth();
        int month = birthday.getMonthValue();

        if (month == 12 && day >= 22 || month == 1 && day < 20) {
            return "Capricorn";
        } else if (month == 1 && day >= 20 || month == 2 && day < 19) {
            return "Aquarius";
        } else if (month == 2 && day >= 19 || month == 3 && day < 21) {
            return "Pisces";
        } else if (month == 3 && day >= 21 || month == 4 && day < 20) {
            return "Aries";
        } else if (month == 4 && day >= 20 || month == 5 && day < 21) {
            return "taurus";
        } else if (month == 5 && day >= 21 || month == 6 && day < 21) {
            return "Gemini";
        } else if (month == 6 && day >= 21 || month == 7 && day < 23) {
            return "Cancer";
        } else if (month == 7 && day >= 23 || month == 8 && day < 23) {
            return "Leo";
        } else if (month == 8 && day >= 23 || month == 9 && day < 23) {
            return "Virgo";
        } else if (month == 9 && day >= 23 || month == 10 && day < 23) {
            return "Libra";
        } else if (month == 10 && day >= 23 || month == 11 && day < 22) {
            return "Scorpio";
        } else if (month == 11 && day >= 22 || month == 12 && day < 22) {
            return "Sagittarius";
        }
        return "";
    }
}
```

The `@Service` annotation is what it uses to inject this into the `BirthdayInfoController` constructor. Since this class implements the `BirthdayService` interface, and it is within the scan path for the application, Spring will find it, initialize it, and inject it into the constructor in `BirthdayInfoController`.

The rest of the class is simply a set of functions that specify the business logic called from the `BirthdayInfoController`.

## Run Your Basic Spring HTTP REST API

At this point, you should have a working API. In Eclipse, just right click on the `SpringBootRestApiApplication` file, and click **run as** > **Java application** and it will kick it off. To hit the endpoints, you can use curl to execute these commands:

**Day of Week:**

Request:

```shell
curl -X POST \
  http://localhost:8080/birthday/dayOfWeek \
  -H 'Content-Type: text/plain' \
  -H 'accept: text/plain' \
  -d 2005-03-09
```

Response:

```shell
WEDNESDAY
```

**Chinese Zodiac:**

Request:

```shell
curl -X POST \
  http://localhost:8080/birthday/chineseZodiac \
  -H 'Content-Type: text/plain' \
  -H 'accept: text/plain' \
  -d 2005-03-09
```

Response:

```shell
Rooster
```

**Astrological Sign:**

Request:

```shell
curl -X POST \
  http://localhost:8080/birthday/starSign \
  -H 'Content-Type: text/plain' \
  -H 'accept: text/plain' \
  -d 2005-03-09
```

Response:

```shell
Pisces
```

## Secure Your JUnit 5 Java App with OAuth 2.0

Now that we have the basic API created, let's make it secure! You can do this quickly by using Okta's OAuth 2.0 token verification. Why Okta? Okta is an identity provider that makes it easy to add authentication and authorization into your apps. It's always on and friends don't let friends write authentication. 

After integrating Okta, the API will require the user to pass in an OAuth 2.0 access token. This token will be checked by Okta for validity and authenticity.

To do this, you will need to have a "Service Application" set up with Okta, add the Okta Spring Boot starter to the Java code, and have a way to generate tokens for this application. Let's get started!

### Create an OpenID Connect Application

You will need to create an OpenID Connect Application in Okta to get your unique values to perform authentication.

To do this, you must first log in to your Okta Developer account (or [sign up](https://developer.okta.com/signup/) if you don't have an account).

Once in your Okta Developer dashboard, click on the **Applications** tab at the top of the screen and then click on the **Add Application** button.

{% img blog/junit5-spring-boot/applications.png alt:"Applications Listing" width:"800" %}{: .center-image }

You will see the following screen. Click on the **Service** tile and then click **Next**.

{% img blog/junit5-spring-boot/new-application.png alt:"Create New Application" width:"800" %}{: .center-image }

The next screen will prompt you for a name for your application. Select something that makes sense and click **Done**.

The application will be created and you will be shown a screen that shows your client credentials including a Client ID and a Client secret. You can get back to this screen anytime by going to the **Applications** tab and then clicking on the name of the application you just created.

### Integrate Secure Authentication into Your Code

There are just a few steps to add authentication to your application.

Create a file called `src/main/resources/application.properties` with the following contents:

```properties
okta.oauth2.issuer=https://{yourOktaDomain}/oauth2/default
okta.oauth2.clientId={clientId}
okta.oauth2.clientSecret={clientSecret}
okta.oauth2.scope=openid
```

Replace the items inside `{...}` with your values. The `{clientId}` and `{clientSecret}` values will come from the application you just created. 
Once you have the application context configured, all you need to do is add a single dependency to your `pom.xml` file and make one more Java file.

For the dependencies, add the Okta Spring Boot starter to the `pom.xml` file in the dependencies section:

```xml
<!-- security - begin -->
<dependency>
    <groupId>com.okta.spring</groupId>
    <artifactId>okta-spring-boot-starter</artifactId>
    <version>1.1.0</version>
</dependency>
<!-- security - end -->
```

And the last step is to update the `SpringBootRestApiApplication` to include a static configuration subclass called `OktaOAuth2WebSecurityConfigurerAdapter`. Your `SpringBootRestApiApplication.java` file should be updated to look like this:

```java
package com.example.joy.myFirstSpringBoot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@SpringBootApplication(scanBasePackages = { "com.example.joy" })
public class SpringBootRestApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootRestApiApplication.class, args);
    }

    @Configuration
    static class OktaOAuth2WebSecurityConfigurerAdapter extends WebSecurityConfigurerAdapter {

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http.authorizeRequests()
                .anyRequest().authenticated().and()
            .oauth2ResourceServer().jwt();
        }
    }
}
```

### Generate a Token to Test Your Spring Boot Application with JUnit 5

In order to test, you will need to be able to generate a valid token. Typically, the client application would be responsible for generating the tokens that it would use for authentication in the API. However, since you have no client application, you need a way to generate tokens in order to test the application.

An easy way to achieve a token is to generate one using [OpenID Connect Debugger](https://oidcdebugger.com/). First, however, you must have a client **Web** application setup in Okta to use with OpenID Connect's implicit flow. 

To do this, go back to the Okta developer console and select **Applications** > **Add Application**, but this time, select the **Web** tile.

On the next screen, you will need to fill out some information. Set the name to something you will remember as your web application. Set the **Login redirect URIs** field to `https://oidcdebugger.com/debug` and **Grant Type Allowed** to **Hybrid**. Click **Done** and copy the client ID for the next step.

{% img blog/junit5-spring-boot/oidc-app-settings.png alt:"OIDC Application Settings" width:"700" %}{: .center-image }

Now, navigate to the [OpenID Connect debugger](https://oidcdebugger.com/) website, fill the form in like the picture below (do not forget to fill in the client ID for your recently created Okta **web** application). The `state` field must be filled but can contain any characters. The Authorize URI should begin with your domain URL (found on your Okta dashboard):

{% img blog/junit5-spring-boot/oidc-debugger.png alt:"OIDC Debugger" width:"475" %}{: .center-image }

Submit the form to start the authentication process. You'll receive an Okta login form if you are not logged in or you'll see the screen below with your custom token.

{% img blog/junit5-spring-boot/access-token.png alt:"OAuth 2.0 Access Token" width:"700" %}{: .center-image }

**NOTE:** The token will be valid for one hour, so you may have to repeat the process if you are testing for a long time.

## Test Your Secured Spring Boot Application with JUnit 5

You should now have a working **secure** API. Let's see it in action! In Eclipse, just right click on the `SpringBootRestApiApplication` file, click **run as** > **Java application**, and it will kick it off. To hit the endpoints, you can use curl to execute these commands, but be sure to include the new header that contains your token. Replace `{token goes here}` with the actual token from OpenID Connect:

**Day of Week:**

Request:

```shell
curl -X POST \
  http://localhost:8080/birthday/dayOfWeek \
  -H 'Authorization: Bearer {token goes here}' \
  -H 'Content-Type: text/plain' \
  -H 'accept: text/plain' \
  -d 2005-03-09
```

Response:

```shell
WEDNESDAY
```

**Chinese Zodiac:**

Request:

```shell
curl -X POST \
  http://localhost:8080/birthday/chineseZodiac \
  -H 'Authorization: Bearer {token goes here}' \
  -H 'Content-Type: text/plain' \
  -H 'accept: text/plain' \
  -d 2005-03-09
```

Response:

```shell
Rooster
```

**Astrological Sign:**

Request:

```shell
curl -X POST \
  http://localhost:8080/birthday/starSign \
  -H 'Authorization: Bearer {token goes here}' \
  -H 'Content-Type: text/plain' \
  -H 'accept: text/plain' \
  -d 2005-03-09
```

Response:

```shell
Pisces
```

## Add Unit and Integration Test to Your Java App with JUnit 5

Congratulations! You now have a secure API that gives you handy information about any birthdate you can imagine! What's left? Well, you should add some unit tests to ensure that it works well.

Many people make the mistake of mixing Unit tests and Integration tests (also called end-to-end or E2E tests). I will describe the difference between the two types below.

Before getting started on the unit tests, add one more dependency to the `pom.xml` file  (in the `<dependencies>` section). 

```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-test</artifactId>
    <scope>test</scope>
</dependency>
```

### Unit Tests 

For the most part, unit tests are intended to test a small chunk (or unit) of code. That is usually limited to the code within a function or sometimes extends to some helper functions called from that function. If a unit test is testing code that is dependent on another service or resource, like a database or a network resource, the unit test should "mock" and inject that dependency as to have no actual impact on that external resource. It also limits the focus to just that unit being tested. To mock a dependency, you can either use a mock library like "Mockito" or simply pass in a different implementation of the dependency that you want to replace. Mocking is outside of the scope of this article and I will simply show examples of unit tests for the `BasicBirthdayService`.

The `BasicBirthdayServiceTest.java` file contains the unit tests of the `BasicBirthdayService` class.

```java
package com.example.joy.myFirstSpringBoot.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class BasicBirthdayServiceTest {
    BasicBirthdayService birthdayService = new BasicBirthdayService();
    
    @Test
    void testGetBirthdayDOW() {
        String dow = birthdayService.getBirthDOW(LocalDate.of(1979,7,14));
        assertEquals("SATURDAY",dow);
        dow = birthdayService.getBirthDOW(LocalDate.of(2018,1,23));
        assertEquals("TUESDAY",dow);
        dow = birthdayService.getBirthDOW(LocalDate.of(1972,3,17));
        assertEquals("FRIDAY",dow);
        dow = birthdayService.getBirthDOW(LocalDate.of(1945,12,2));
        assertEquals("SUNDAY",dow);
        dow = birthdayService.getBirthDOW(LocalDate.of(2003,8,4));
        assertEquals("MONDAY",dow);
    }
    
    @Test
    void testGetBirthdayChineseSign() {
        String dow = birthdayService.getChineseZodiac(LocalDate.of(1979,7,14));
        assertEquals("Sheep",dow);
        dow = birthdayService.getChineseZodiac(LocalDate.of(2018,1,23));
        assertEquals("Dog",dow);
        dow = birthdayService.getChineseZodiac(LocalDate.of(1972,3,17));
        assertEquals("Rat",dow);
        dow = birthdayService.getChineseZodiac(LocalDate.of(1945,12,2));
        assertEquals("Rooster",dow);
        dow = birthdayService.getChineseZodiac(LocalDate.of(2003,8,4));
        assertEquals("Sheep",dow);
    }
    
    @Test
    void testGetBirthdayStarSign() {
        String dow = birthdayService.getStarSign(LocalDate.of(1979,7,14));
        assertEquals("Cancer",dow);
        dow = birthdayService.getStarSign(LocalDate.of(2018,1,23));
        assertEquals("Aquarius",dow);
        dow = birthdayService.getStarSign(LocalDate.of(1972,3,17));
        assertEquals("Pisces",dow);
        dow = birthdayService.getStarSign(LocalDate.of(1945,12,2));
        assertEquals("Sagittarius",dow);
        dow = birthdayService.getStarSign(LocalDate.of(2003,8,4));
        assertEquals("Leo",dow);
    }
}
```

This test class is one of the most basic sets of unit tests you can make. It creates an instance of the `BasicBirthdayService` class and then tests the responses of the three endpoints with various birthdates being passed in. This is a great example of a small unit being tested as it only tests a single service and doesn't even require any configuration or applicationContext to be loaded for this test. Because it is only testing the service, it doesn't touch on security or the HTTP rest interface.

You can run this test from your IDE or using Maven:

```shell
mvn test -Dtest=BasicBirthdayServiceTest
```

### Integration Tests with JUnit 5

Integration tests are intended to test the entire integrated code path (from end-to-end) for a specific use-case. For example, an integration test of the Birthday application would be one that makes an HTTP POST call to the `dayOfWeek` endpoint and then tests that the results are as expected. This call will ultimately hit both the `BirthdayControllerInfo` code as well as the `BasicBirthdayService` code. It will also require interacting with the security layer in order to make these calls. In a more complex system, an integration test might hit a database, read or write from a network resource, or send an email. 

Because of the use of actual dependencies/resources, integration tests should typically be considered as possibly destructive and fragile (as backing data could be changed). For those reasons, integration tests should be "handled-with-care" and isolated from and run independently of normal unit tests. I personally like to use a separate system, particularly for REST API testing, rather than JUnit 5 as it keeps them completely separate from the unit tests. 

If you do plan to write unit tests with JUnit 5, they should be named with a unique suffix like "IT". Below is an example of the same tests you ran against `BasicBirthdayService`, except written as an integration test. This example mocks the web security for this particular test as the scope is not to test OAuth 2.0, although an integration test may be used to test everything, including security.

The `BirthdayInfoControllerIT.java` file contains the integration tests of the three API endpoints to get birthday information.

```java
package com.example.joy.myFirstSpringBoot.controllers;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.example.joy.myFirstSpringBoot.services.BasicBirthdayService;

@AutoConfigureMockMvc
@ContextConfiguration(classes = {BirthdayInfoController.class, BasicBirthdayService.class})
@WebMvcTest
class BirthdayInfoControllerIT {
    private final static String TEST_USER_ID = "user-id-123";
    String bd1 = LocalDate.of(1979,7,14).format(DateTimeFormatter.ISO_DATE);
    String bd2 = LocalDate.of(2018,1,23).format(DateTimeFormatter.ISO_DATE);
    String bd3 = LocalDate.of(1972, 3, 17).format(DateTimeFormatter.ISO_DATE);
    String bd4 = LocalDate.of(1945, 12, 2).format(DateTimeFormatter.ISO_DATE);
    String bd5 = LocalDate.of(2003, 8, 4).format(DateTimeFormatter.ISO_DATE);

    @Autowired
    private  MockMvc mockMvc;

    @Test
    public void testGetBirthdayDOW() throws Exception {
        testDOW(bd1,"SATURDAY");
        testDOW(bd2,"TUESDAY");
        testDOW(bd3,"FRIDAY");
        testDOW(bd4,"SUNDAY");
        testDOW(bd5,"MONDAY");
    }

    @Test
    public void testGetBirthdayChineseSign() throws Exception {
        testZodiak(bd1,"Sheep");
        testZodiak(bd2,"Dog");
        testZodiak(bd3,"Rat");
        testZodiak(bd4,"Rooster");
        testZodiak(bd5,"Sheep");
    }

    @Test
    public void testGetBirthdaytestStarSign() throws Exception {
        testStarSign(bd1,"Cancer");
        testStarSign(bd2,"Aquarius");
        testStarSign(bd3,"Pisces");
        testStarSign(bd4,"Sagittarius");
        testStarSign(bd5,"Leo");
    }
    
    private void testDOW(String birthday, String dow) throws Exception {
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/birthday/dayOfWeek")
                    .with(user(TEST_USER_ID))
                    .with(csrf())
                    .content(birthday)
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                     .andReturn();

        String resultDOW = result.getResponse().getContentAsString();
        assertNotNull(resultDOW);
        assertEquals(dow, resultDOW);
    }

    private void testZodiak(String birthday, String czs) throws Exception {
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/birthday/chineseZodiac")
                    .with(user(TEST_USER_ID))
                    .with(csrf())
                    .content(birthday)
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                     .andReturn();

        String resultCZ =result.getResponse().getContentAsString();
        assertNotNull(resultCZ);
        assertEquals(czs, resultCZ);
    }

    private void testStarSign(String birthday, String ss) throws Exception {
        MvcResult result  = mockMvc.perform(MockMvcRequestBuilders.post("/birthday/starSign")
                    .with(user(TEST_USER_ID))
                    .with(csrf())
                    .content(birthday)
                    .contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                     .andReturn();

        String resultSS = result.getResponse().getContentAsString();
        assertNotNull(resultSS);
        assertEquals(ss, resultSS);
    }
}
```

This test class has quite a bit to it; let's go over a few key items.

There are a few lines of code that tells the system to mock security so you don't need to generate a token before running this integration test. The following lines tell the system to pretend we have a valid user and token already: 

```java
.with(user(TEST_USER_ID))
.with(csrf())
```

*MockMvc* is simply a handy system built into the Spring Framework to allow us to make calls to a REST API. The `@AutoConfigureMockMvc` class annotation and the `@Autowired` for the MockMvc member variable tell the system to automatically configure and initialize the `MockMvc` object (and in the background, an application context ) for this application. It will load the `SpringBootRestApiApplication` and allow the tests to make HTTP calls to it.

If you read about *test slicing*, you might find yourself down a rabbit hole and feel like pulling your hair out. However, if you back out of the rabbit hole, you could see that test slicing is simply the act of trimming down what is loaded within your app for a particular unit test or integration test class. For example, if you have 15 controllers in your web application, with autowired services for each, but your test is only testing one of them, why bother loading the other 14 and their autowired services?  Instead, just load the controller your testing and the supporting classes needed for that controller! So, let's see how test slices are used in this integration test!

```java
@ContextConfiguration(classes = {BirthdayInfoController.class, BasicBirthdayService.class})
@WebMvcTest
```

The `WebMvcTest` annotation is the core of slicing a WebMvc application. It tells the system that you are slicing and the `@ContextConfiguration` tells it precisely which controllers and dependencies to load. I have included the `BirthdayInfoController` service because that is the controller I am testing. If I left that out, these tests would fail. I have also included the `BasicBirthdayService` since this is an integration test and I want it to go ahead and autowire that service as a dependency to the controller. If this weren't an integration test, I might mock that dependency instead of loading it in with the controller.

And that is it!  Slicing doesn't have to be over-complicated!

You can run this test from your IDE or using Maven:

```shell
mvn test -Dtest=BirthdayInfoControllerIT
```

### Isolate Unit and Integration Tests

In Eclipse, if you right-click on a folder and select **run as** > **JUnit Test**, it will run all unit tests and integration tests with no prejudice. However, it is often desired, particularly if run as part of an automated process to either just run the unit tests, or to run both. This way, there can be a quick sanity check of the units, without running the sometimes destructive Integration tests. There are many approaches to do this, but one easy way is to add the **Maven Failsafe Plugin** to your project. This is done by updating the `<build>` section of the `pom.xml` file as follows:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-failsafe-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

The Failsafe Plugin will differentiate the types of tests by the names. By default, it will consider any test that begins or ends with `IT` as an integration test. It also considers tests that end in `ITCase` an integration test.

Once the `pom.xml`  is setup, you can run the  `test` or `verify` goals to test either unit tests or unit and integration tests respectively. From Eclipse, this is done by going to the project and right-clicking and selecting **run as** > **Maven test** for the `test` goal. For the `verify` goal, you must click on **run as** > **Maven build...** and then enter "verify" in the goals textbox and click run. From the command line, this can be done with `mvn test` and `mvn verify`.

## Add Code Coverage to Your Java App with JUnit 5

The idea of "code coverage" is the question of how much of your code is tested with your unit and/or integration tests. There are a lot of tools a developer can use to do that, but since I like Eclipse, I generally use a tool called [EclEmma](https://www.eclemma.org/). In older versions of Eclipse, we used to have to install this plugin separately, but it appears to be currently installed by default when installing Eclipse EE versions. If it can't be found, you can always go to the Eclipse Marketplace (from the Eclipse Help Menu) and install it yourself. 

From within Eclipse, running EclEmma is very simple. Just right click on a single test class or a folder and select **coverage as** > **JUnit Test**. This will execute your unit test or tests but also provide you with a coverage report (see the bottom of the image below). In addition, it will highlight any code in your application that is covered in green, and anything not in red. (It will cover partial coverage, like an if statement that is tested as true, but not as false with yellow).

**TIP:** If you notice that it is evaluating the coverage of your test cases and want that removed, go to **Preferences** > **Java** > **Code Coverage** and set the "Only path entries matching" option to `src/main/java`.

{% img blog/junit5-spring-boot/code-coverage.png alt:"Code Coverage" width:"800" %}{: .center-image }

## Learn More about Java and Spring Boot, Secure REST APIs, and OIDC

I hope you've made it this far and have enjoyed this walkthrough on how to build and test a secure REST API with Spring Boot and JUnit 5.

Full source-code is available [on GitHub](https://github.com/oktadeveloper/okta-spring-boot-junit5-example).

For some further reading on Spring Boot or OpenID Connect, check out these tutorials:

* [Get Started with Spring Boot, OAuth 2.0, and Okta](/blog/2017/03/21/spring-boot-oauth)
* [Build a Basic CRUD App with Angular 7.0 and Spring Boot 2.1](/blog/2018/08/22/basic-crud-angular-7-and-spring-boot-2)
* [Get Started with Spring Security 5.0 and OIDC](/blog/2017/12/18/spring-security-5-oidc)
* [Identity, Claims, & Tokens – An OpenID Connect Primer, Part 1 of 3](/blog/2017/07/25/oidc-primer-part-1)

For more about JUnit 5 and Test Slices, take a look at these sources:

* [Sergio Martin - Take Unit Testing to the Next Level With JUnit 5](https://dzone.com/articles/take-unit-testing-to-the-next-level-with-junit-5)
* [Biju Kunjummen - Spring Boot Web Test Slicing](https://dzone.com/articles/spring-boot-web-slice-test)

If you've made it this far, you might be interested in seeing future blog posts. Follow my team, [@oktadev](https://twitter.com/oktadev) on Twitter, or check out [our YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q). For questions, please leave a comment below.


