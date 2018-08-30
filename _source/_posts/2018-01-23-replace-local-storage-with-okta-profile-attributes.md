---
layout: blog_post
title: "Use Okta (Instead of Local Storage) to Store Your User's Data Securely"
author: mraible
description: "Using an Okta Developer account will allow you to store your cryptocurrency holdings as custom profile attributes instead of using local storage. While LocalStorage is great for demos, using custom profile attributes will allow you to access your data across different devices."
tags: [localstorage, cryptocurrency, spring-boot, java, okta-java-sdk]
tweets:
 - "Learn how to use the @okta Java SDK to store custom profile attributes to manage your cryptocurrency portfolio  →"
 - "Did you know that we provide a @java SDK for talking to our REST API? It's pretty slick. This blog post shows you how to use it to manage custom profile attributes."
---

Local Storage is a JavaScript API technically known as `localStorage` that arrived with HTML5. It allows you to store information on a user's browser quickly and easily. There are many debates on the web as to whether it's better than cookies. Some say it's faster (because it doesn't send data with every request like cookies do) and more secure.
Whether it's more secure or not is debatable, especially when compared with secure cookies that have an [HttpOnly flag](https://www.owasp.org/index.php/HttpOnly). It does, however, offer the ability to store a lot more data than cookies. Cookies [can hold up to 4KB](http://browsercookielimits.squawky.net/), while local storage [can hold 5MB or more](https://www.html5rocks.com/en/tutorials/offline/quota-research/), depending on your browser.

## The Local Storage API

The local storage API is simple in that it only has a couple of methods to set and get data. In a [previous article](/blog/2018/01/18/cryptocurrency-pwa-secured-by-okta), I showed you how to build a PWA that stores your cryptocurrency holdings. In its `src/providers/holdings/holdings.ts` service, you can see how the local storage API works.

```typescript
saveHoldings(): void {
  this.storage.set('cryptoHoldings', this.holdings);
}

loadHoldings(): void {
  this.storage.get('cryptoHoldings').then(holdings => {

    if (holdings !== null) {
      this.holdings = holdings;
      this.fetchPrices();
    }
  });
}
```

## Switch from Local Storage to Okta Custom Profile Attributes

In [a previous article](/blog/2018/01/18/cryptocurrency-pwa-secured-by-okta), I showed you how to add Okta to an Ionic PWA for authentication. To complete this tutorial, you'll need to [sign up for a free Okta Developer account](https://developer.okta.com/signup/).

Once you have an Okta Developer account, you can leverage our API to store your holdings as custom profile attributes instead of local storage. While LocalStorage is great for demos, using custom profile attributes will allow you to access your holdings across different devices.

> To learn more about Okta's Universal Directory and its Profile Editor features, see our [manage user profiles](https://help.okta.com/en/prod/Content/Topics/Directory/Directory_Profile_Editor.htm) documentation.

### Add a Holdings Attribute to your User Profiles

The first thing you'll need to do is add a `holdings` attribute to your organization's user profiles. Log in to the Okta Developer Console, then navigate to **Users** > **Profile Editor**. Click on **Profile** button for the first profile in the table. You can identify it by its Okta logo. Click **Add Attribute** and use the following values:

* Display name: `Holdings`
* Variable name: `holdings`
* Description: `Cryptocurrency Holdings`

{% img blog/cryptocurrency-pwa-java-sdk/holdings-attribute.png alt:"Holdings Attribute" width:"800" %}{: .center-image }

Use the default values for everything else and click **Save**.

## Create a Spring Boot App

Head on over to [start.spring.io](https://start.spring.io) and create a new Spring Boot (1.5.x) project with a dependency on **Web**. You can use whatever group and artifact coordinates you like, but the code in this tutorial will match the following:

* Group: `com.okta.developer`
* Artifact: `holdings-api`

{% img blog/cryptocurrency-pwa-java-sdk/start-holdings-api.png alt:"Holdings API App" width:"800" %}{: .center-image }

Click **Generate Project** and expand `holdings-api.zip` after it finishes downloading.

Create a directory to hold your Spring Boot project and the Cryptocurrency PWA from the [previous tutorial](/blog/2018/01/18/cryptocurrency-pwa-secured-by-okta).

```bash
mkdir okta-ionic-crypto-java-sdk
mv ~/Downloads/holdings-api okta-ionic-crypto-java-sdk
git clone https://github.com/oktadeveloper/okta-ionic-crypto-pwa.git crypto-pwa
rm -rf crypto-pwa/.git
mv crypto-pwa okta-ionic-crypto-java-sdk
```

When finished, you should have a directory structure like the following:

```
okta-ionic-crypto-java-sdk
  - holdings-api
  - crypto-pwa
```

Open the project in your favorite IDE or text editor.

### Add the Okta Spring Boot Starter and Okta's Java SDK

Open `holdings-api/pom.xml` and add dependencies for the [Okta Spring Boot Starter](https://github.com/okta/okta-spring-boot) and the [Okta Java SDK](https://github.com/okta/okta-sdk-java).

```xml
<properties>
   ...
   <okta.version>0.4.0</okta.version>
</properties>

<dependencies>
   ...
   <dependency>
       <groupId>com.okta.spring</groupId>
       <artifactId>okta-spring-boot-starter</artifactId>
       <version>${okta.version}</version>
   </dependency>
   <dependency>
       <groupId>com.okta.spring</groupId>
       <artifactId>okta-spring-sdk</artifactId>
       <version>${okta.version}</version>
   </dependency>
   ...
</dependencies>

<dependencyManagement>
   <dependencies>
       <dependency>
           <groupId>org.springframework.security.oauth</groupId>
           <artifactId>spring-security-oauth2</artifactId>
           <version>2.3.0.RELEASE</version>
       </dependency>
   </dependencies>
</dependencyManagement>

<build>
   <defaultGoal>spring-boot:run</defaultGoal>
   ...
</build>
```

**NOTE:** The `defaultGoal` is optional, but it allows you to run `./mvnw` instead of `./mvnw spring-boot:run`. If you choose not to add it, please use `./mvnw spring-boot:run` wherever I use `./mvnw`.

### Create an API Token

For the Okta Java SDK to talk to Okta's API, you'll need to [create an API token](https://developer.okta.com/docs/api/getting_started/getting_a_token). The abbreviated steps are as follows:
1. Log in to your Developer Console
2. Navigate to **API** > **Tokens** and click **Create Token**
3. Give your token a name, then copy its value

Open `holdings-api/src/main/resources/application.properties` and add your API token as a property.

```properties
okta.client.token=XXX
```

I'd recommend leaving `XXX` as the value in your properties file. The token's value is not something you want to check into source control, but you want to make other developers aware of it. You can override this property on your machine by setting an `OKTA_CLIENT_TOKEN` environment variables. For example:

```bash
export OKTA_CLIENT_TOKEN=<real value you copied>
```

While you're editing `application.properties`, add properties for the issuer and client ID. You should have these from the last tutorial. If you didn't complete it, you can create a new OIDC app in Okta using the step below.

* Log in to your Okta account and navigate to **Applications** > **Add Application**
* Select **SPA** and click **Next**
* Give your application a name (e.g. "Crypto PWA")
* Add the following values for **Base URI** and **Login redirect URI**:
  * `http://localhost:8100` (for development)
  * `https://<name-of-your-choosing>.firebaseapp.com` (for production)
* Click **Done**.

Copy the app's `clientId` into `application.properties` and change `{yourOktaDomain}` to match your account. These properties will allow the client to pass an access token to the server and validate it.

```properties
okta.oauth2.issuer=https://{yourOktaDomain}/oauth2/default
okta.oauth2.clientId={clientId}
```

**NOTE:** The values for `issuer` and `clientId` in `crypto-pwa/src/pages/login/login.ts` should match these values.

### Enable Your Spring Boot App as a Resource Server

Configure your Spring Boot app to be a resource server and allow CORS requests by modifying its `HoldingsApiApplication.java` class.

```java
package com.okta.developer.holdingsapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Collections;

@EnableResourceServer
@SpringBootApplication
public class HoldingsApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(HoldingsApiApplication.class, args);
    }

    @Bean
    public FilterRegistrationBean simpleCorsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Collections.singletonList("*"));
        config.setAllowedMethods(Collections.singletonList("*"));
        config.setAllowedHeaders(Collections.singletonList("*"));
        source.registerCorsConfiguration("/**", config);
        FilterRegistrationBean bean = new FilterRegistrationBean(new CorsFilter(source));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }
}
```

### Create a HoldingsController to Communicate with Okta's API

Create a `HoldingsController.java` class in the same package as `HoldingsApiApplication`.

```java
package com.okta.developer.holdingsapi;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.okta.sdk.client.Client;
import com.okta.sdk.resource.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api/holdings")
public class HoldingsController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final ObjectMapper mapper = new ObjectMapper();
    private final Client client;
    private final String HOLDINGS_ATTRIBUTE_NAME = "holdings";

    public HoldingsController(Client client) {
        this.client = client;
    }

    @GetMapping
    public List<Holding> getHoldings(Principal principal) {
        User user = client.getUser(principal.getName());

        String holdingsFromOkta = (String) user.getProfile().get(HOLDINGS_ATTRIBUTE_NAME);
        List<Holding> holdings = new LinkedList<>();

        if (holdingsFromOkta != null) {
            try {
                holdings = mapper.readValue(holdingsFromOkta, new TypeReference<List<Holding>>() {});
            } catch (IOException io) {
                logger.error("Error marshalling Okta custom data: " + io.getMessage());
                io.printStackTrace();
            }
        }

        return holdings;
    }

    @PostMapping
    public Holding[] saveHoldings(@RequestBody Holding[] holdings, Principal principal) {
        User user = client.getUser(principal.getName());
        try {
            String json = mapper.writeValueAsString(holdings);
            user.getProfile().put(HOLDINGS_ATTRIBUTE_NAME, json);
            user.update();
        } catch (JsonProcessingException e) {
            logger.error("Error saving Okta custom data: " + e.getMessage());
            e.printStackTrace();
        }
        return holdings;
    }
}
```

This class has a few things I'd like to point out:

* `com.okta.sdk.client.Client` is injected into the constructor by Spring and auto-configured with the API token
* `client.getUser(principal.getName())` provides an easy way to get the `User` object
* Jackson's `ObjectMapper` makes it easy to marshall the `Holding` object to and from JSON
* Retrieving user profile attributes is done with `user.getProfile().get(ATTRIBUTE_NAME)`
* Saving user profile attributes is done with `user.getProfile().put(ATTRIBUTE_NAME)`

**NOTE:** The call to `user.getProfile()` returns a [`UserProfile`](https://developer.okta.com/okta-sdk-java/apidocs/com/okta/sdk/resource/user/UserProfile.html). This implements `java.util.Map` and [`PropertyRetriever`](https://developer.okta.com/okta-sdk-java/apidocs/com/okta/sdk/resource/PropertyRetriever.html), which allows for more type-safe operations (`getString()`, `getBoolean()`, etc.).

Speaking of `Holding`, you'll need to create a `com.okta.developer.holdingsapi.Holding` class to handle the values coming from (and sending to) the client.

```java
package com.okta.developer.holdingsapi;

public class Holding {
    private String crypto;
    private String currency;
    private String amount;

    public String getCrypto() {
        return crypto;
    }

    public void setCrypto(String crypto) {
        this.crypto = crypto;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    @Override
    public String toString() {
        return "Holding{" +
                "crypto='" + crypto + '\'' +
                ", currency='" + currency + '\'' +
                ", amount='" + amount + '\'' +
                '}';
    }
}
```

Congrats, you've done the hard work to create a Holdings API with Spring Boot! Now, modify the client to talk to this API instead of local storage.

## Modify the Crypto PWA Client to Store Holdings in Okta

Below are the abbreviated changes you'll need to make to `crypto-pwa/src/providers/holdings/holdings.ts` to talk to the API.

```typescript
import { HttpClient, HttpHeaders } from '@angular/common/http';
...
import { OAuthService } from 'angular-oauth2-oidc';

...
@Injectable()
export class HoldingsProvider {

  public HOLDINGS_API = 'http://localhost:8080/api/holdings';
  ...

  constructor(private http: HttpClient, private oauthService: OAuthService) {
  }

  ...

  onError(error): void {
    console.error('ERROR: ', error);
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', this.oauthService.authorizationHeader())
  }

  saveHoldings(): void {
    this.http.post(this.HOLDINGS_API, this.holdings,{headers: this.getHeaders()}).subscribe(data => {
      console.log('holdings', data);
    }, this.onError);
  }

  loadHoldings(): void {
    this.http.get(this.HOLDINGS_API,{headers: this.getHeaders()}).subscribe((holdings: Holding[]) => {
      if (holdings !== null) {
        this.holdings = holdings;
        this.fetchPrices();
      }
    }, this.onError);
  }
  ...
}
```

You'll also want to remove the following line from the `fetchPrices()` method:

```typescript
this.saveHoldings();
```

After making these changes, use a terminal to run `npm install && ionic serve` in the `crypto-pwa` directory. Then open another terminal window and run `./mvnw` from the `holdings-api` directory.

Log in to the application at http://localhost:8100 and add a couple of holdings. For example, here's what the Crypto PWA looks like after I added data:

{% img blog/cryptocurrency-pwa-java-sdk/holdings-in-okta.png alt:"Holdings in Okta" width:"800" %}{: .center-image }

Local storage can be handy because the data is cached locally and it'll work offline. However, service workers cache network requests, so this application will work offline too. To prove it, toggle offline mode in Chrome's Developer Tools > Network > Offline. Your holdings should still render when you refresh your browser.

{% img blog/cryptocurrency-pwa-java-sdk/holdings-in-okta-offline.png alt:"Holdings in Okta - Offline" width:"800" %}{: .center-image }

Even better, you can open another browser, e.g., Firefox, and retrieve your holdings by logging in. You can't do that when using local storage!

{% img blog/cryptocurrency-pwa-java-sdk/crypto-pwa-in-firefox.png alt:"Works in Firefox!" width:"800" %}{: .center-image }

## Source Code

You can find the source code for the application shown in this tutorial at https://github.com/oktadeveloper/okta-ionic-crypto-java-sdk-example.

## Okta + Java = ❤️

Okta loves Java and has a team of experts working on its Java SDK. The lead developer of the Java SDK is [Brian Demers](https://twitter.com/briandemers). Not only has he helped create the Spring Boot Starter and the Okta Java SDK, but he did most of the work to port the [Stormpath Java SDK](https://github.com/stormpath/stormpath-sdk-java) to work with Okta.

You might remember the Stormpath Java SDK from my [Secure a Spring Microservices Architecture with Spring Security, JWTs, Juiser, and Okta](/blog/2017/08/08/secure-spring-microservices). I recently updated it to work with the latest releases of its libraries, so check it out if you get a chance!

To learn more about Okta's Java support, you can review the following documentation:

* [Okta Java SDK Javadocs](https://developer.okta.com/okta-sdk-java/apidocs/)
* [Okta Java SDK on GitHub](https://github.com/okta/okta-sdk-java)
* [Okta Spring Boot Starter](https://github.com/okta/okta-spring-boot)

I think you'll find the following blog posts useful too!

* [Add Single Sign-On to Your Spring Boot Web App in 15 Minutes](/blog/2017/11/20/add-sso-spring-boot-15-min)
* [Secure your SPA with Spring Boot and OAuth](/blog/2017/10/27/secure-spa-spring-boot-oauth)
* [Add Role-Based Access Control to Your App with Spring Security and Thymeleaf](/blog/2017/10/13/okta-groups-spring-security)

If you love Java too, [follow @oktadev](https://twitter.com/oktadev) on Twitter and let us know if you have any issues with this tutorial. You can also post your questions to the [Okta Developer Forums](https://devforum.okta.com/) or simply leave a comment on this post.

**Update:** To learn how to test this application, see [The Hitchhiker's Guide to Testing Spring Boot APIs and Angular Components with WireMock, Jest, Protractor, and Travis CI](/blog/2018/05/02/testing-spring-boot-angular-components).

**Changelog:**

* Apr 10, 2018: Updated dependencies in the example app to use Okta Spring Boot Starter and Java SDK version 0.4.0. See the code changes in the [example app on GitHub](https://github.com/oktadeveloper/okta-ionic-crypto-java-sdk/pull/2). Changes to this article can be viewed in [okta/okta.github.io#1941](https://github.com/okta/okta.github.io/pull/1941).
