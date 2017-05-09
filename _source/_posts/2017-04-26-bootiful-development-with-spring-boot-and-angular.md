---
layout: blog_post
title: Bootiful Development with Spring Boot and Angular
author: mraible
tags: [spring-boot, start.spring.io, java, angular, typescript, angular-cli]
---

To simplify development and deployment, you want everything in the same artifact, so you put your Angular app "inside" your Spring Boot app, right? But what if you could create your Angular app as a standalone app and make cross-origin requests to your API? Hey guess what, you can do both!

I believe that most frontend developers are used to having their apps standalone and making cross-origin requests to APIs. The beauty of having a client app that can point to a server app is you can point it to *any* server and it makes it easy to test your current client code against other servers (e.g. test, staging, production).

This post shows how you can have the best of both worlds where the UI and the API are separate apps. You’ll learn how to create REST endpoints with Spring Data REST, configure Spring Boot to allow CORS, and create an Angular app to display its data. This app will display a list of beers from the API, then fetch a GIF from [https://giphy.com/](http://giphy.com) that matches the beer’s name.

If you don’t want to code along, feel free to grab the [source code from GitHub](https://github.com/oktadeveloper/spring-boot-angular-example)! You can also watch a video of this tutorial below.

<div style="text-align: center">
<iframe width="560" height="315" style="max-width: 100%" src="https://www.youtube.com/embed/bUq83Rz4BHA" frameborder="0" allowfullscreen></iframe>
</div>

## Build an API with Spring Boot

To get started with Spring Boot, navigate to [start.spring.io](https://start.spring.io). In the “Search for dependencies" field, select the following:

* [DevTools](http://docs.spring.io/spring-boot/docs/current/reference/html/using-boot-devtools.html): Provides auto-reloading of your application when files change
* [H2](http://www.h2database.com/html/main.html): An in-memory database
* [JPA](http://www.oracle.com/technetwork/java/javaee/tech/persistence-jsp-140049.html): Standard ORM for Java
* [Rest Repositories](http://projects.spring.io/spring-data-rest/): Allows you to expose your JPA repositories as REST endpoints
* [Web](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-starters/spring-boot-starter-web/pom.xml): Spring MVC with Jackson (for JSON), Hibernate Validator, and embedded Tomcat

{% img blog/angular-spring-boot/start.spring.png alt:"start.spring.io" style:"width: 800px" %}

If you like the command-line better, you can use the following command to download a `demo.zip` file with [HTTPie](https://httpie.org/).

<pre>
http https://start.spring.io/starter.zip \
dependencies==devtools,h2,data-jpa,data-rest,web -d
</pre>

Create a directory called `spring-boot-angular-example`, with a `server` directory inside it. Expand the contents of `demo.zip` into the `server` directory.

Open the “server" project in your favorite IDE and run `DemoApplication` or start it from the command line using `./mvnw spring-boot:run`.

Create a `com.example.beer` package and a `Beer.java` file in it. This will be the entity that holds your data.

```java
package com.example.beer;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Beer {

    @Id
    @GeneratedValue
    private Long id;
    private String name;

    public Beer() {}

    public Beer(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

Add a `BeerRepository` class that leverages Spring Data to do CRUD on this entity.

```java
package com.example.beer;

import org.springframework.data.jpa.repository.JpaRepository;

interface BeerRepository extends JpaRepository<Beer, Long> {
}
```

Add a `BeerCommandLineRunner` that uses this repository and creates a default set of data.

```java
package com.example.beer;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.stream.Stream;

@Component
public class BeerCommandLineRunner implements CommandLineRunner {

    private final BeerRepository repository;

    public BeerCommandLineRunner(BeerRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... strings) throws Exception {
        // Top beers from https://www.beeradvocate.com/lists/top/
        Stream.of("Kentucky Brunch Brand Stout", "Good Morning", "Very Hazy", "King Julius",
                "Budweiser", "Coors Light", "PBR").forEach(name ->
                repository.save(new Beer(name))
        );
        repository.findAll().forEach(System.out::println);
    }
}
```

Rebuild your project and you should see a list of beers printed in your terminal.

{% img blog/angular-spring-boot/beers-in-terminal.png alt:"Beers printed in terminal" style:"width: 800px" %}

Add a [`@RepositoryRestResource`](http://docs.spring.io/spring-data/rest/docs/current/api/org/springframework/data/rest/core/annotation/RepositoryRestResource.html) annotation to `BeerRepository` to expose all its CRUD operations as REST endpoints.

```java
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
interface BeerRepository extends JpaRepository<Beer, Long> {
}
```

Add a `BeerController` class to create an endpoint that filters out less-than-great beers.

```java
package com.example.beer;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class BeerController {
    private BeerRepository repository;

    public BeerController(BeerRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/good-beers")
    public Collection<Map<String, String>> goodBeers() {

        return repository.findAll().stream()
                .filter(this::isGreat)
                .map(b -> {
                    Map<String, String> m = new HashMap<>();
                    m.put("id", b.getId().toString());
                    m.put("name", b.getName());
                    return m;
                }).collect(Collectors.toList());
    }

    private boolean isGreat(Beer beer) {
        return !beer.getName().equals("Budweiser") &&
                !beer.getName().equals("Coors Light") &&
                !beer.getName().equals("PBR");
    }
}
```

Re-build your application and navigate to http://localhost:8080/good-beers. You should see the list of good beers in your browser.

{% img blog/angular-spring-boot/good-beers-json.png alt:"Good Beers JSON" style:"width: 800px" %}

You should also see this same result in your terminal window when using HTTPie.

```bash
http localhost:8080/good-beers
```

## Create a Project with Angular CLI

It’s cool that you created an API to display a list of beers, but APIs aren’t _that_ cool without a UI. In this section, you’ll create a new Angular app, build services to fetch beers/images, and create components to display this data.

To create an Angular project, make sure you have [Node.js](https://nodejs.org/) and the latest [Angular CLI installed](https://github.com/angular/angular-cli#updating-angular-cli).

```bash
npm install -g @angular/cli@latest
```

Run `ng --version` to confirm you’re using version 1.0.0 (or later). From a terminal window, cd into the root of the `spring-boot-angular-example` directory and run the following command.

```bash
ng new client
```

This will create a new `client` directory and run `npm install` to install all the necessary dependencies. To verify everything works, run `ng e2e` in a terminal window. If everything works, you should see output like the following in your terminal.

```bash
[09:02:35] I/direct - Using ChromeDriver directly...
[09:02:35] I/launcher - Running 1 instances of WebDriver
Spec started

  client App
    ✓ should display message saying app works

Executed 1 of 1 spec SUCCESS in 0.77 sec.
[09:02:38] I/launcher - 0 instance(s) of WebDriver still running
[09:02:38] I/launcher - chrome #01 passed
```

**TIP:** If you’re just getting started with Angular, you might want to [watch this video of my recent Getting Started with Angular webinar](https://www.youtube.com/watch?v=Jq3szz2KOOs).

If you’d rather not use the command line and have [IntelliJ IDEA](https://www.jetbrains.com/idea/) (or [WebStorm](https://www.jetbrains.com/webstorm/)) installed, you can create a new Static Web Project and select Angular CLI.

{% img blog/angular-spring-boot/intellij-new-static-web-project.png alt:"IntelliJ new Static Web project" style:"width: 800px" %}

### Create a BeerListComponent and BeerService

Thus far, you’ve created a `good-beers` API and an Angular app, but you haven’t created the UI to display the list of beers from your API. To do this, create a `<beer-list>` component by running Angular CLI’s `generate component` command.

```bash
$ ng generate component beer-list
installing component
  create src/app/beer-list/beer-list.component.css
  create src/app/beer-list/beer-list.component.html
  create src/app/beer-list/beer-list.component.spec.ts
  create src/app/beer-list/beer-list.component.ts
  update src/app/app.module.ts
```

**TIP:** There is a `g` alias for `generate` and a `c` alias for `component`, so you can type `ng g c beer-list` too.

Create a `beer` service:

```bash
$ ng g s beer
installing service
  create src/app/beer.service.spec.ts
  create src/app/beer.service.ts
  WARNING Service is generated but not provided, it must be provided to be used
```

Create a `src/app/shared/beer` directory and move `beer.service.*` into it.

```bash
mkdir -p src/app/shared/beer
mv src/app/beer.service.* src/app/shared/beer/.
```

Create a `src/app/shared/index.ts` file and export the `BeerService`. The reason for this file is so you can export multiple classes and import them in one line rather than multiple.

```typescript
export * from './beer/beer.service';
```

Modify `beer.service.ts` to call the “good-beers" API service.

```typescript
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class BeerService {

  constructor(private http: Http) {}

  getAll(): Observable<any> {
    return this.http.get('http://localhost:8080/good-beers')
      .map((response: Response) => response.json());
  }
}
```

Modify `beer-list.component.ts` to use the `BeerService` and store the results in a local variable. Notice that you need to add the service as a provider in the `@Component` definition or you will see an error.

```typescript
import { Component, OnInit } from '@angular/core';
import { BeerService } from '../shared';

@Component({
  selector: 'app-beer-list',
  templateUrl: './beer-list.component.html',
  styleUrls: ['./beer-list.component.css'],
  providers: [BeerService]
})
export class BeerListComponent implements OnInit {
  beers: Array<any>;

  constructor(private beerService: BeerService) { }

  ngOnInit() {
    this.beerService.getAll().subscribe(
      data => {
        this.beers = data;
      },
      error => console.log(error)
    )
  }
}
```

Modify `beer-list.component.html` so it renders the list of beers.

{% raw %}
```html
<h2>Beer List</h2>

<div *ngFor="let b of beers">
  {{b.name}}
</div>
```
{% endraw %}

Update `app.component.html` to have the `BeerListComponent` rendered when you’re logged in.

```html
<app-beer-list></app-beer-list>
```

Make sure both apps are started (with `mvn spring-boot:run` in the server directory, and `ng serve` in the client directory) and navigate to <http://localhost:4200>. You should see an error in your console that you means you have to configure cross-origin resource sharing (CORS) on the server.

<pre style="color: red">
XMLHttpRequest cannot load http://localhost:8080/good-beers. No 'Access-Control-Allow-Origin' header
is present on the requested resource. Origin 'http://localhost:4200' is therefore not allowed access.
</pre>

To fix this issue, you’ll need to configure Spring Boot to allow cross-domain access from `http://localhost:4200`.

### Configure CORS for Spring Boot

In the server project, open `BeerController.java` and add a `@CrossOrigin` annotation to enable cross-origin resource sharing (CORS) from the client (http://localhost:4200).

```java
import org.springframework.web.bind.annotation.CrossOrigin;
...
    @GetMapping("/good-beers")
    @CrossOrigin(origins = "http://localhost:4200")
    public Collection<Map<String, String>> goodBeers() {
```

After making these changes, you should be able to see a list of beers from your Spring Boot API.

{% img blog/angular-spring-boot/angular-beer-list.png alt:"Beer List in Angular" style:"width: 800px" %}

To make it look a little better, add a [Giphy](http://giphy.com) service to fetch images based on the beer’s name. Create `src/app/shared/giphy/giphy.service.ts` and place the following code inside it.

```typescript
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
// http://tutorials.pluralsight.com/front-end-javascript/getting-started-with-angular-2-by-building-a-giphy-search-application
export class GiphyService {


  // Public beta key: https://github.com/Giphy/GiphyAPI#public-beta-key
  giphyApi = '//api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=';

  constructor(public http: Http) {}

  get(searchTerm): Observable<any> {
    let apiLink = this.giphyApi + searchTerm;
    return this.http.request(apiLink).map((res: Response) => {
      let giphies = res.json().data;
      return giphies[0].images.original.url;
    });
  }
}
```

Add an export for this class in `src/app/shared/index.ts`.

```typescript
export * from './beer/beer.service';
export * from './giphy/giphy.service';
```

Then add it to `BeerListComponent` to set a `giphyUrl` on each `beer` object.

```typescript
import { Component, OnInit } from '@angular/core';
import { BeerService, GiphyService } from '../shared';

@Component({
  selector: 'app-beer-list',
  templateUrl: './beer-list.component.html',
  styleUrls: ['./beer-list.component.css'],
  providers: [BeerService, GiphyService]
})
export class BeerListComponent implements OnInit {
  beers: Array<any>;

  constructor(private beerService: BeerService,
              private giphyService: GiphyService) { }

  ngOnInit() {
    this.beerService.getAll().subscribe(
      data => {
        this.beers = data;
        for (let beer of this.beers) {
          this.giphyService.get(beer.name).subscribe(url => beer.giphyUrl = url);
        }
      },
      error => console.log(error)
    )
  }
}
```

Then update `beer-list.component.html` to include a reference to this image.

{% raw %}
```html
<div *ngFor="let b of beers">
  {{b.name}}<br>
  <img width="200" src="{{b.giphyUrl}}" alt="{{b.name}}">
</div>
```
{% endraw %}

The result should look something like the following list of beer names with images.

{% img blog/angular-spring-boot/angular-beer-list-giphy.png alt:"Beer list with Giphy images" style:"width: 800px" %}

You’ve just created an Angular app that talks to a Spring Boot API using cross-domain requests. Congratulations!

## Learn More About Spring Boot and Angular

To learn more about Angular, Spring Boot, or Okta, check out the following resources:

* [Angular with OpenID Connect](http://developer.okta.com/blog/2017/04/17/angular-authentication-with-oidc)
* [Get Started with Spring Boot, OAuth 2.0, and Okta](http://developer.okta.com/blog/2017/03/21/spring-boot-oauth)
* [Getting Started with Spring Boot by Josh Long](https://youtu.be/sbPSjI4tt10) (SF JUG 2015)
* [Angular Best Practices by Stephen Fluin](https://youtu.be/hHNUohOPCCo) (ng-conf 2017)

You can find the source code associated with this article [on GitHub](https://github.com/oktadeveloper/spring-boot-angular-example). If you find any bugs, please file an issue on GitHub, or ask your question on Stack Overflow with an [okta tag](http://stackoverflow.com/questions/tagged/okta). Of course, you can always [ping me on Twitter](https://twitter.com/mraible) too.
