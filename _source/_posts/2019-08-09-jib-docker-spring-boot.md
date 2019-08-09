---
layout: blog_post
title: "Get Jibby With Java, Docker, and Spring Boot"
author: moksamedia
description: "A quick guide to using Docker and Jib to containerize Spring Boot applications."
tags: [docker, spring-boot, jib, java]
tweets:
- "Docker is a very popular system for containerizing applications. Learn how to use it with @springboot in this quick guide."
- "Writing Spring Boot apps? Need to deploy them? This guide on using Docker and Jib should help!"
- "Spring Boot + Jib are like peanut butter and jelly. Learn how how use them together with this timely tutorial."
image: blog/featured/okta-java-headphones.jpg
---

Docker is a very popular system for containerizing applications. Containerization packages the executable code along with the runtime environment in deployable virtual images using a repeatable, automatable process. 

In the world of cloud-based development and microservices, where a single application can be spread across hundreds of servers in various networks with complex port configurations, the ability to automate the deployment of "units" of code is super helpful. The ability to control the execution environment also offers advantages: managing variables like OS version, disk size, available memory, port configuration, etc... Containerization helps avoid unexpected conflicts when OS libraries create unexpected conflicts or bugs on update.

All of this control often comes at the cost of complexity, however. Creating and maintaining dockerfiles can be time-consuming. Jib to the rescue! Jib allows you to easily Dockerize Spring Boot projects, using plugins for Maven and Gradle. Beyond just ease of containerization, Jib also takes advantage of image layering and registry caching to speed up builds by only re-building the parts of an application that have changed.

In this tutorial, you will build a simple Spring Boot REST API and use Jib to dockerize it. You will use OAuth 2.0 and Okta to protect the resource server.

Let's get started!

## Install Dependencies

For this tutorial, you need to install a few dependencies. First, you'll need **Java**. I've written the tutorial for Java 11, but it should be backward compatible with Java 8. If you don't have Java installed, go to [the AdoptOpenJDK website](https://adoptopenjdk.net/) and install it. On a Mac, you can also use [Homebrew](https://brew.sh/). 

The next tool you'll need is **HTTPie**, a simple command-line HTTP client. Please follow instructions on [their website](https://httpie.org/) to install it.

You'll also need a free **developer account with Okta**. Okta is a SaaS (software-as-service) identity management provider. We make it easy to add features like single sign-on, social login, and OAuth 2.0 to your application. Sign up for an account on [our website](https://developer.okta.com/signup/) if you haven't already.

Finally, you'll need **Docker Desktop**. This allows you to quickly and easily run local Docker images on your computer. It's great for testing, development, and tutorials like this. Check out [the Docker Desktop website](https://www.docker.com/products/docker-desktop) for installation instructions.

This tutorial uses **Gradle** as a build system, which you can install locally from their website, **but it's not required to install since the project starter will include a Gradle wrapper**. But if you want to install Gradle locally, or just want to learn more about the project, [check out the Gradle website](https://gradle.org/).

You'll also need some sort of **code editor or IDE**. I like [Intellij IDEA Community Edition](https://www.jetbrains.com/idea/) for Java development. It's free and awesome. But there are tons of other options as well. 

## Use Spring Initializr to Download Initial Project

You installed HTTPie, right? In this section, you're going to use it to command Spring Initializr to create and download your initial project.

From a command line:

```bash
http https://start.spring.io/starter.zip \
 dependencies==web,okta \
 groupId==com.okta.spring-docker.demo \
 packageName==com.okta.spring-docker.demo \
 type==gradle-project \
 -d
```

You can read about all of the parameters available on Spring Initializr's REST API on the [Spring Initializr GitHub page](https://github.com/spring-io/initializr). The important points are that you specified a Gradle project, included a couple of dependencies, and specified your group and package information. 

The two dependencies are `web` and `okta`. `web` is short for `spring-boot-starter-web`, which allows Spring Boot to serve HTTP requests. `okta` is short for Okta's Spring Boot Starter, which simplifies adding Okta OAuth to Spring applications. If you'd like to learn more about this project, check out [the Okta Spring Boot GitHub page](https://github.com/okta/okta-spring-boot).  

The command above downloads a file named `demo.zip`. Unzip it somewhere and open it in the editor or IDE of your choice:

```
unzip demo.zip -d spring-boot-docker
```

This fully functioning Spring Boot app defines an empty Spring Boot application without any controllers, so it doesn't do much. Before you fix that, you need to add one more dependency to the `build.gradle` file.

## Just Jib it!

To add Jib to the Gradle project, simply add the plugin to the `build.gradle` file. If you want to dig in deeper, take a look at [the Introducing Jib blog post](https://cloudplatform.googleblog.com/2018/07/introducing-jib-build-java-docker-images-better.html) or [Jib's GitHub page](https://github.com/GoogleContainerTools/jib).

Add `id 'com.google.cloud.tools.jib' version '1.3.0'` to the `plugins` closure at the top of the `build.gradle` file, like so:

```groovy
plugins {  
    id 'org.springframework.boot' version '2.1.5.RELEASE'  
    id 'java'  
    id 'com.google.cloud.tools.jib' version '1.3.0'  // <-- ADD ME
}
```

If you open a shell and navigate to the project root, you can now run `./gradlew tasks` and see the tasks that the new plugin has added to the project.

```bash
Jib tasks
---------
jib - Builds a container image to a registry.
jibBuildTar - Builds a container image to a tarball.
jibDockerBuild - Builds a container image to a Docker daemon.
```

In this example, you will be using the `jibDockerBuild` tasks. This pushes the image to the Docker daemon run by Docker Desktop. This is great for local development and testing. 

More often in a larger production environment, you would push to a container registry using `jib`. Jib can easily push to a variety of container registries, such as Google Container Registry, Amazon Elastic Container Registry, Docker Hub Registry, and Azure Container Registry.

Note that Docker Desktop has to be running in order for the `jibDockerBuild` task to work. **Go ahead and start Docker Desktop** if it isn't already running.

## Add a Web Controller and Configure Security

In order for your application to respond to HTTP requests, you need to add a controller. Add a new file called `WebController.java` in the directory `src/main/java/com/okta/springdocker/demo`.

```java
package com.okta.springdocker.demo;  
  
import org.springframework.web.bind.annotation.RequestMapping;  
import org.springframework.web.bind.annotation.ResponseBody;  
import org.springframework.web.bind.annotation.RestController;  
  
@RestController  
public class WebController {  
  
    @RequestMapping("/")    
    public String home() {  
        return "Welcome!";  
    }  
      
}
```

You also need to configure the security settings for this project. For the moment, you'll want to allow all requests, so update your `DemoApplication.java` file to the following:

```java
package com.okta.springdocker.demo;  
  
import org.springframework.boot.SpringApplication;  
import org.springframework.boot.autoconfigure.SpringBootApplication;  
import org.springframework.context.annotation.Configuration;  
import org.springframework.security.config.annotation.web.builders.HttpSecurity;  
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;  
  
@SpringBootApplication  
public class DemoApplication {  
  
   public static void main(String[] args) {  
      SpringApplication.run(DemoApplication.class, args);  
   }  
  
   @Configuration  
   static class OktaOAuth2WebSecurityConfigurerAdapter extends WebSecurityConfigurerAdapter {  
  
      @Override  
      protected void configure(HttpSecurity http) throws Exception {  
         http  
            .authorizeRequests().anyRequest().permitAll();  
      }  
   }  
}
```

## Try it Out!

Build the project and push the Docker image to the local registry using the following command (from the project root dir):

```bash
./gradlew build jibDockerBuild
```

After this completes,  you should be able to list the Docker images:

```bash
docker images
```

And see your application image in the local Docker registry:

```bash
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
demo                0.0.1-SNAPSHOT      490d12302a6d        49 years ago        146MB
```

To run your Spring Boot app, use the following command:

```bash
docker run --publish=8080:8080 demo:0.0.1-SNAPSHOT
```

This command specifies the image repository and tag as well as instructing Docker to map port 8080 in the image to local port 8080.

Now you can use HTTPie to run a simple request:

```bash
http :8080
```

And you should see:

```bash
HTTP/1.1 200
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Content-Length: 8
Content-Type: text/plain;charset=UTF-8
...

Welcome!
```

Sweet! So, at this point, you've created a simple Spring Boot application with a basic web controller and overridden the default security settings to allow all requests. You've also created a Docker image, pushed it to your local Docker registry, and run the image - all without a Docker file!

The next step is to add JSON Web Token (JWT) authentication using OAuth 2.0 and OpenID Connect (OIDC). The provider you're going to use for this tutorial is Okta.

## Create an OIDC Application

Create an OIDC application on Okta using your developer account. If you don't have one, [signup](https://developer.okta.com/signup) and return to this tutorial after activating your account.

Sign in to the Okta developer console. If this is your first time to log in, you may need to click the **Admin** button in the upper right-hand corner to get to the developer console.

Next, you will create an OpenID Connect (OIDC) application. OAuth 2.0 along with OpenID Connect is the protocol spec Okta implements to allow your application to handle authentication and authorization securely with the Okta servers.

Click on the **Application** top menu. Click the **Add Application** button.

Select application type **Web**. 

Click **Next**.

Give the app a name. I named mine `Spring Boot Docker`. The [OIDC Debugger website](https://oidcdebugger.com/debug) allows you to create access tokens you can use to access your app with HTTPie. You need to add a login redirect URI and allow implicit flow for this website to work.

Under **Login redirect URIs**, add a new URI: `https://oidcdebugger.com/debug`.

Under **Grant type allowed**, check the box next to **Implicit (Hybrid)**.

The rest of the default values will work.

Click **Done**.

Leave the page open and take note of the **Client ID**. You'll need it in a moment.

You'll also want to know the **Issuer URI** from Okta. If you go to **API** in the top menu and click on **Authorization Servers**, you'll see the **default** auth server. By default, all your OIDC apps are added to this auth server. The Issuer URI will be something like this: `https://dev-123456.okta.com/oauth2/default`. 

You won't need to do anything with it since this tutorial uses the Okta Spring Boot Starter and default values. The **audience** value, `api://default`, can be customized for more complex or custom applications.

## Configure Spring Boot App for OAuth

First, rename the `src/main/resources/application.properties` file to `application.yml`. Then add in the following values (filling in your **Client ID** and **Okta URL**):

```yaml
okta:  
  oauth2:  
    issuer: https://{yourOktaDomain}/oauth2/default  
    client-id: {yourClientID}
```

If you were not using the Okta Spring Boot Starter, this configuration would be a little more extensive, but because you're using the starter, it sets many defaults for you and simplifies setup.

Next, update the security configuration to use OAuth 2.0 and JWT authentication. In the `DemoApplication.java` file, update the `configure(HttpSecurity http)` method in the `OktaOAuth2WebSecurityConfigurerAdapter` static class to match the following:

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        .authorizeRequests().anyRequest().authenticated()
        .and()
        .oauth2ResourceServer().jwt();
}
```

Finally, change your `WebController.java` file to match the following:

```java
package com.okta.springdocker.demo;  
  
import org.springframework.security.core.annotation.AuthenticationPrincipal;  
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;  
import org.springframework.web.bind.annotation.RequestMapping;  
import org.springframework.web.bind.annotation.ResponseBody;  
import org.springframework.web.bind.annotation.RestController;  
  
import java.security.Principal;  
  
@RestController  
public class WebController {  
  
    @RequestMapping("/")
    public String home(@AuthenticationPrincipal JwtAuthenticationToken jwtAuthenticationToken) {  
        return "Welcome " + jwtAuthenticationToken.getName() + "!";  
    }  
  
    @RequestMapping("/info")
    public String info(@AuthenticationPrincipal JwtAuthenticationToken jwtAuthenticationToken) {  
        return jwtAuthenticationToken.toString();  
    }  
  
}
``` 

You could have left the `WebController` the same. This doesn't affect authentication. The changes demonstrate how to get a little information about the authenticated party from Spring Security.

## Run the App Again, with OAuth 2.0!

Stop the previous process if it's still running. You should be able to **Control-C** from the shell where you ran the `docker run` command. If that doesn't work, you can use the following command to stop all running docker containers:

```bash
docker stop $(docker ps -a -q)
```

From a terminal at the project root, run the following command to rebuild the project and the docker image:

```bash
./gradlew build jibDockerBuild
```

Once this process completes, run the image:

```bash
docker run --publish=8080:8080 demo:0.0.1-SNAPSHOT
```

Use HTTPie to make a request:

```bash
http :8080
```

You'll get:

```bash
HTTP/1.1 401
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Content-Length: 0
...
```

Success! Of sorts. You still need to get a valid token. Fortunately, OpenID Connect debugger allows you to do that easily (remember when you added this URL to the list of authorized redirect URLs in your OIDC app on Okta?).

In a browser, go to [https://oidcdebugger.com](https://oidcdebugger.com/).

Update the following values:

* **Authorize URI**: https://{yourOktaDomain}/oauth2/default/v1/authorize
* **Client ID**: {yourClientID}
* **State**: Any value really, I used `This is the state`

Scroll down and click **Send Request**.

Copy the token from the success screen and save it in a shell variable:

```bash
TOKEN=eyJraWQiOiJxMm5rZmtwUDR...
```

Now you can use the JWT in your request:

```bash
http :8080 "Authorization: Bearer $TOKEN"
```

And see something like:

```bash
HTTP/1.1 200
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Content-Length: 33
...

Welcome andrew.hughes@gmail.com!
```

If you look back in the `WebController` class, you can see where we used dependency injection to get the `JwtAuthenticationToken`, which got the authenticated name:

```java
"Welcome " + jwtAuthenticationToken.getName() + "!";
```

You can also try the `/info` endpoint (in the `JwtAuthenticationToken` class) for more detailed information.

## Learn More about Docker and Spring Boot

In this tutorial, you learned how to use Jib to easily Dockerize Spring Boot applications. You also used Okta and OAuth 2.0 / OIDC to protect this application. You generated a JWT using the OIDC Debugger and tested the authentication using the command line. 

You can find the source code for this example [on GitHub](https://github.com/oktadeveloper/okta-spring-boot-docker-example).

Going forward, you could explore how to deploy Spring Boot apps to microservices, how to add Role-based authentication, or how to integrate a Spring Boot REST API with a JavaScript frontend like Vue or Angular. 

* [Build Spring Microservices and Dockerize Them for Production](/blog/2019/02/28/spring-microservices-docker)
* [Java Microservices with Spring Boot and Spring Cloud](/blog/2019/05/22/java-microservices-spring-boot-spring-cloud)
* [Spring Method Security with PreAuthorize](/blog/2019/06/20/spring-preauthorize)
* [Build a Simple CRUD App with Spring Boot and Vue.js](/blog/2018/11/20/build-crud-spring-and-vue)
* [A Quick Guide to Spring Boot Login Options](/blog/2019/05/15/spring-boot-login-options)

If you have any questions about this post, please add a comment below. For more awesome content, follow  [@oktadev](https://twitter.com/oktadev) on Twitter, like us [on Facebook](https://www.facebook.com/oktadevelopers/), or subscribe to [our YouTube channel](https://www.youtube.com/c/oktadev).
