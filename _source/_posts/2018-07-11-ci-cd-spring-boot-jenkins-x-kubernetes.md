---
layout: blog_post
title: "Add CI/CD to Your Spring Boot App with Jenkins X and Kubernetes"
author: mraible
description: "This post shows you how to implement continuous integration and deployment (CI/CD) with Jenkins X and Kubernetes on Google Cloud."
tags: [spring-boot, jenkins x, kubernetes, angular, pwa, ionic, okta java sdk]
tweets:
- ""
- ""
---

A lot has happened in the last five years of software development. What it means to build, deploy, and orchestrate software has changed drastically. There's been a move from hosting software on premise to public cloud, and shift from VMs to containers. Containers are cheaper to run than VMs because they require less resources and is just a process. Moving to containers has reduced costs, but created a problem of how to run containers at scale.

On June 6th, 2014, [Kubernetes](https://kubernetes.io/) was released. Google had been using containers for years and used a tool called Borg to manage containers at scale. Kubernetes is the open source version of Borg and has become the de facto standard in the last four years. 

It's journey to becoming a standard was largely facilitated by all the big players jumping on board. Red Hat, IBM, Amazon, Microsoft, Oracle, and Pivotal -- every major public cloud provider has Kubernetes support. 

This is great for developers because it provides a single way to package applications (in a Docker container) and deploy it on any Kubernetes cluster.

## High Performance Development with CI/CD

High performing teams are all the rage. Continuous integration, continuous deployment (CI/CD), small iterations, and fast feedback are the building blocks. CI/CD can be difficult to setup for your cloud native app. You need to automate everything so developers can spend their precious time delivering actual business value.

How do you become a high performing team using containers, continuous delivery, and Kubernetes? This is where [Jenkins X](https://jenkins-x.io) comes in.

> "The idea of Jenkins X is to give all developers their own nevil seafaring butler than can help you sail the seas of continuous delivery." 
> &mdash; [James Strachan](https://twitter.com/jstrachan)

{% img blog/spring-boot-jenkins-x/jenkins-x.svg alt:"Jenkins X Logo" width:"300" %}{: .center-image }

Jenkins X helps you automate your CI/CD in Kubernetes -- and you don't even have to learn Docker or Kubernetes!

## What Does Jenkins X Do?

Jenkins X automates the installation, configuration, and upgrading of Jenkins and other apps (Helm, Skaffold, Nexus, among others) on Kubernetes. It automates CI/CD of your applications using Docker images, Helm charts, and pipelines. It uses [GitOps](https://www.weave.works/blog/gitops-operations-by-pull-request) to manage promotion between environments, and provides lots of feedback by commenting on pull requests as they hit staging and production.

## Get Started with Jenkins X

To get installed with Jenkins X, you first need to install the `jx` binary on your machine, or cloud provider. You can get $300 in credits for Google Cloud, so I decided to start there. 

### Install on Google Cloud and Create Cluster

Navigate to [cloud.google.com](https://cloud.google.com) and log in. If you don't have an account, sign up for a free trial. Go to the console (there's a link in the top right corner) and activate Google Cloud shell. Copy and paste the following command into the shell.

```bash
curl -L https://github.com/jenkins-x/jx/releases/download/v1.3.78/jx-linux-amd64.tar.gz | tar xzv 
sudo mv jx /usr/local/bin
```

**NOTE:** Google Cloud shell [terminates any changes made outside your home directory after an hour](https://cloud.google.com/shell/docs/limitations#custom_installed_software_packages_and_persistence), so you might have to run the commands again. The good news is they'll be in your history, so you just need to hit the up arrow and enter. You can also eliminate the `sudo mv` command above and add the following to your `.bashrc` instead.

```bash
export PATH=$PATH:.
```

Create a cluster on GKE (Google Kubernetes Engine) using the following command. You may have to [enable GKE](https://console.cloud.google.com/projectselector/kubernetes) for your account.

```bash
jx create cluster gke --skip-login
```

Select `helm` if you're prompted to download it. You will be prompted to select a Google Cloud Zone. I'd suggest picking one close to your location. I chose `us-west1-a` since I live near Denver, Colorado. For Google Cloud Machine Type, I selected `n1-standard-4`, but the default `n-standard1-2` should work just fine. Use the defaults for the min (3) and max (5) number of nodes.

For the GitHub username, select your own (e.g. `mraible`). I tried to use `oktadeveloper` (a GitHub organization) and I was unable to make it work. **NOTE:** GitHub integration will fail if you have two-factor authentication enabled on your account.

When prompted to install an ingress controller, hit **Enter** for **Yes**. Hit **Enter** again to select the default domain. 

You'll be prompted to create a GitHub API Token. Click on the [provided URL](https://github.com/settings/tokens/new?scopes=repo,read:user,read:org,user:email,write:repo_hook,delete_repo) and name it "Jenkins X". Copy it paste it back into your console.

Grab a coffee, an adult beverage, or do some pushups while your install finishes. It can take several minutes.

The last step will be to copy the API token from Jenkins to your console. Follow the provided instructions in your console.

### Create a Spring Boot App

When I first started using Jenkins X, I tried to import an existing project. Even though my app used Spring Boot, it didn't have a `pom.xml` in the root directory, so Jenkins X thought it was a Node.js app. For this reason, I suggest creating a blank Spring Boot app first to confirm Jenkins X is set up correctly.

Run the following command from Cloud Shell:

```bash
jx create spring -d web -d actuator
```

This command uses [Spring Initializr](https://start.spring.io), so you'll be prompted with a few choices. Below are the answers I used:

| Language | `java` |
| Group | `com.okta.developer` |
| Artifact | `okta-spring-boot-jenkinsx-example` |

Select all the defaults for the git user name, initializing git, and the commit message. You can select an organization to use if you don't want to use your personal account. Run the following command to watch the CI/CD pipeline of your app.

```
jx get activity -f okta-spring-boot-jenkinsx-example -w
```

{% img blog/spring-boot-jenkins-x/jx-get-activity.png alt:"jx get activity" width:"800" %}{: .center-image }

Run `jx console`, click the resulting link, and navigate to you project if you'd like a more visually rich view.

{% img blog/spring-boot-jenkins-x/jx-console.png alt:"jx console" width:"800" %}{: .center-image }

This process will perform a number of tasks:
 
1. Create a [release](https://github.com/oktadeveloper/okta-spring-boot-jenkinsx-example/releases/tag/v0.0.1) for your project.
2. Create a [pull request](https://github.com/mraible/environment-scorpionthunder-staging/pull/1) for your staging environment project.
3. Auto-deploy it to staging environment so you can see it in action.

```bash
Merge status checks all passed so the promotion worked!
Application is available at: http://okta-spring-boot-jenkinsx-example.jx-staging.35.230.111.241.nip.io
```

**NOTE:** Since Spring Boot doesn't provide a welcome page by default, you will get a 404 when you open your staging URL.

### Deploy to Production

By default, Jenkins X will only auto-deploy to staging. You can manually [promote from staging to production](http://jenkins-x.io/developing/promote/) using:

```bash
jx promote okta-spring-boot-jenkinsx-example --version 0.0.1 --env production
```

You can change your production environment to use auto-deploy using [`jx edit environnment`](https://jenkins-x.io/commands/jx_edit_environment/).

Now that you know how to use Jenkins X with a bare-bones Spring Boot app, let's see how to make it work with a more real-world example.

## Secure Your Spring Boot App and Add an Angular PWA

Over the last several months, I've written a series of blog posts about building a PWA (progressive web app) with Ionic/Angular and Spring Boot. 

1. [Protect Your Cryptocurrency Wealth Tracking PWA with Okta](/blog/2018/01/18/cryptocurrency-pwa-secured-by-okta)
2. [Use Okta (Instead of Local Storage) to Store Your User’s Data Securely](/blog/2018/01/23/replace-local-storage-with-okta-profile-attributes)
3. [The Hitchhiker's Guide to Testing Spring Boot APIs and Angular Components with WireMock, Jest, Protractor, and Travis CI](/blog/2018/05/02/testing-spring-boot-angular-components)
// todo: update ^^ to point to #4
4. [Deploy Your Secure Spring Boot + Angular PWA as a Single Artifact](blog/2018/06/18/spring-boot-angular-auth-code-flow)

This is the final blog post in the series. Let's see how to automate its path to production with Jenkins X and Kubernetes!

I believe this is a good example of a real-world app because it has numerous unit and integration tests, including end-to-end tests with Protractor.

Clone the Spring Boot project you just created from GitHub:

```bash
git clone https://github.com/oktadeveloper/okta-spring-boot-jenkinsx-example.git okta-jenkinsx
```

In an adjacent directory, clone the project created that has Spring Boot + Angular as a single artifact:

```bash
git clone https://github.com/oktadeveloper/okta-spring-boot-angular-auth-code-flow-example.git spring-boot-angular
```

In a terminal, navigate to `okta-jenkinx` and remove the files that are no longer necessary:

```bash
cd okta-jenkinsx
rm -rf .mvn src mvnw* pom.xml
```

The result should be a directory structure with the following files:

```bash
$ tree .
.
├── charts
│   ├── okta-spring-boot-jenkinsx-example
│   │   ├── Chart.yaml
│   │   ├── Makefile
│   │   ├── README.md
│   │   ├── templates
│   │   │   ├── deployment.yaml
│   │   │   ├── _helpers.tpl
│   │   │   ├── NOTES.txt
│   │   │   └── service.yaml
│   │   └── values.yaml
│   └── preview
│       ├── Chart.yaml
│       ├── Makefile
│       ├── requirements.yaml
│       └── values.yaml
├── Dockerfile
├── Jenkinsfile
└── skaffold.yaml

4 directories, 15 files
```

Copy all the files from `spring-boot-angular` into `okta-jenkinsx`.

```bash
cp -r spring-boot-angular/* okta-jenkinsx/.
```

When using Travis CI to test this app, I ran `npm install` as part of the process. With Jenkins X, it's easier to everything with one container (e.g. `maven` or `nodejs`), so add an execution to the frontend-maven-plugin (in `holdings-api/pom.xml`)to run `npm install`.

```xml
<plugin>
    <groupId>com.github.eirslett</groupId>
    <artifactId>frontend-maven-plugin</artifactId>
    <version>${frontend-maven-plugin.version}</version>
    <configuration>
        <workingDirectory>../crypto-pwa</workingDirectory>
    </configuration>
    <executions>
        <execution>
            <id>install node and npm</id>
            <goals>
                <goal>install-node-and-npm</goal>
            </goals>
            <configuration>
                <nodeVersion>${node.version}</nodeVersion>
            </configuration>
        </execution>
        <execution>
            <id>npm install</id>
            <goals>
                <goal>npm</goal>
            </goals>
            <phase>generate-resources</phase>
            <configuration>
                <arguments>install --unsafe-perm</arguments>
            </configuration>
        </execution>
        ...
    </executions>
</plugin>
```

**NOTE:** The `--unsafe-perm` flag is necessary because Jenkins X [runs the build as a root user](https://github.com/sass/node-sass/issues/941). I figured out this workaround from [node-sass's troubleshooting instructions](https://github.com/sass/node-sass/blob/master/TROUBLESHOOTING.md#cannot-find-module-rootinstalljs).

### Add Actuator and Turn Off HTTPS

Jenkins X relies on Spring Boot's Actuator for health checks. This means if you don't include it in your project (or have `/actuator/health` protected), Jenkins X will report your app has failed to startup.

Add the Actuator starter as a dependency to `holdings-api/pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

You'll also need to allow access to its health check endpoint. Jenkins X will deploy your app behind an Nginx server, so you'll want to turn off forcing HTTPS as well, or you won't be able to reach your app. Modify `holdings-api/src/main/java/com/okta/developer/holdingsapi/SecurityConfiguration.java` to have these changes.

```java
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/**/*.{js,html,css}");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            .and()
                .authorizeRequests()
                .antMatchers("/", "/home", "/api/user", "/actuator/health").permitAll()
                .anyRequest().authenticated();
    }
}
```

### Adjust Paths in Dockerfile and Jenkinsfile

Since this project builds in a sub-directory rather than the root directory, update `./Dockerfile` to look in `holdings-api` for files.

```
FROM openjdk:8-jdk-slim
ENV PORT 8080
ENV CLASSPATH /opt/lib
EXPOSE 8080

# copy pom.xml and wildcards to avoid this command failing if there's no target/lib directory
COPY holdings-api/pom.xml holdings-api/target/lib* /opt/lib/

# NOTE we assume there's only 1 jar in the target dir
# but at least this means we don't have to guess the name
# we could do with a better way to know the name - or to always create an app.jar or something
COPY holdings-api/target/*.jar /opt/app.jar
WORKDIR /opt
CMD ["java", "-jar", "app.jar"]
```

You'll also need to update `Jenkinsfile` so it runs any `mvn` commands in the `holdings-api` directory. For example:

```groovy
// in the 'CI Build and push snapshot' stage
steps {
  container('maven') {
    dir ('./holdings-api') {
      sh "mvn versions:set -DnewVersion=$PREVIEW_VERSION"
      sh "mvn install -Pprod"
    }
  }
  ...
}
// in the 'Build Release' stage
dir ('./holdings-api') {
  sh "mvn versions:set -DnewVersion=\$(cat ../VERSION)"
}
...
dir ('./holdings-api') {
  sh "mvn clean deploy -Pprod"
}
```

This should be enough to make this app work with Jenkins X. However, you won't be able to log into it unless you have an Okta account, and configure it accordingly.

### What is Okta?

In short, we make [identity management](https://developer.okta.com/product/user-management/) a lot easier, more secure, and more scalable than what you’re probably used to. Okta is a cloud service that allows developers to create, edit, and securely store user accounts and user account data, and connect them with one or multiple applications. Our API enables you to:

* [Authenticate](https://developer.okta.com/product/authentication/) and [authorize](https://developer.okta.com/product/authorization/) your users
* Store data about your users
* Perform password-based and [social login](https://developer.okta.com/authentication-guide/social-login/)
* Secure your application with [multi-factor authentication](https://developer.okta.com/use_cases/mfa/)
* And much more! Check out our [product documentation](https://developer.okta.com/documentation/)

Are you sold? [Register for a forever-free developer account](https://developer.okta.com/signup/), and when you’re done, come on back so we can learn more about CI/CD with Spring Boot and Jenkins X!

## Create a Web Application in Okta for Your Spring Boot + Angular PWA

After you've completed the setup process, log in to your account and navigate to **Applications** > **Add Application**. Click **Web** and **Next**. On the next page, enter the following values and click **Done**.

* Application Name: `Jenkins X`
* Base URIs: `http://localhost:8080`
* Login redirect URIs: `http://localhost:8080/login`

Open `holdings-api/src/main/resources/application.yml` and paste the values from your org/app into it.

```yaml
okta:
  client:
    orgUrl: https://{yourOktaDomain}
    token: XXX
security:
    oauth2:
      client:
        access-token-uri: https://{yourOktaDomain}/oauth2/default/v1/token
        user-authorization-uri: https://{yourOktaDomain}/oauth2/default/v1/authorize
        client-id: {yourClientId}
        client-secret: {yourClientSecret}
      resource:
        user-info-uri: https://{yourOktaDomain}/oauth2/default/v1/userinfo
```

You'll notice I haven't defined a `token` value. This is because I prefer to read it from an environment variable rather than being checked into source control. You'll likely want to do this for your client secret as well, but I'm only doing one property for brevity.

You’ll need to add a `holdings` attribute to your organization's user profiles to store your cryptocurrency holdings in Okta. Navigate to **Users** > **Profile Editor**. Click on **Profile** for the first profile in the table. You can identify it by its Okta logo. Click **Add Attribute** and use the following values:

* Display name: `Holdings`
* Variable name: `holdings`
* Description: `Cryptocurrency Holdings`

For the Okta Java SDK to talk to Okta's API (to store your cryptocurrency holdings), you'll need to create an API token. 

2. Navigate to **API** > **Tokens** and click **Create Token**
3. Give your token a name (e.g. "Jenkins X"), then set its value as an `OKTA_CLIENT_TOKEN` environment variable.

After performing these steps, you should be able to run `holdings-api/mvnw -Pprod` and log in.

### Storing Secrets in Jenkins X

Storing environment variables locally is pretty straightforward. But how do you do it in Jenkins X? Look no further than its [credentials feature](https://jenkins.io/doc/book/using/using-credentials/). Here's how to use it:

1. Run `jx console` on Google Cloud to get your Jenkins X URL
2. Click on the link and click **Administration** at the top
3. Click on **Credentials** > **(global)** > **Add Credentials** (on the left)
4. Select **Secret text** from the dropdown and enter `OKTA_CLIENT_TOKEN` for the ID
5. Copy/paste your Okta API token into the **Secret** field

While you're in there, add a few more secrets: `OKTA_APP_ID`, `E2E_USERNAME`, and `E2E_PASSWORD`. The first is the ID of the `Jenkins X` app you created. You can get its value from navigating to your app on Okta and copying the value from the URL. The `E2E-*` secrets should be credentials you want to use to run end-to-end (Protractor) tests. You might want to create a new user for this. 

You can access these values in your `Jenkinsfile` by adding them in the `environment` section near the top.

```groovy
environment {
  ORG               = 'mraible'
  APP_NAME          = 'okta-spring-boot-jenkinsx-example'
  CHARTMUSEUM_CREDS = credentials('jenkins-x-chartmuseum')
  OKTA_CLIENT_TOKEN = credentials('OKTA_CLIENT_TOKEN')
  OKTA_APP_ID       = credentials('OKTA_APP_ID')
  E2E_USERNAME      = credentials('E2E_USERNAME')
  E2E_PASSWORD      = credentials('E2E_PASSWORD')
}
```

### Transferring Environment Variables to Docker Containers

To transfer the `OKTA_CLIENT_TOKEN` environment variable to the Docker container when it's built, look for:

```groovy
sh "make preview"
```

And change it to:

```groovy
sh "make $OKTA_CLIENT_TOKEN=\$OKTA_CLIENT_TOKEN preview"
```

Add more environment variables as you need them.

### Automate Adding Redirect URIs in Okta

### Running Protractor Tests in Jenkins X

## Learn More About Jenkins X and Kubernetes

<div style="text-align: center">
<iframe width="700" height="400" style="max-width: 100%" src="https://www.youtube.com/embed/53AtxQGXnMk" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>

* Resources

Kubernetes the Hard Way

[Introducing Jenkins X: a CI/CD solution for modern cloud applications on Kubernetes](https://jenkins.io/blog/2018/03/19/introducing-jenkins-x/)
