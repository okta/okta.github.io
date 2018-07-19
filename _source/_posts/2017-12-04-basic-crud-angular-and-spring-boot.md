---
layout: blog_post
title: 'Build a Basic CRUD App with Angular 5.0 and Spring Boot 2.0'
author: mraible
description: "Angular and Spring Boot are arguably the two most popular frameworks in all of web development. Matt Raible shows you how to use them together in the same app, and how to secure it all with Okta."
tags: [authentication, spring boot, spring boot 2.0, angular, angular 5, okta, oidc]
tweets:
  - "Angular + Spring Boot makes for a nice development experience. Learn how to make them work together with OIDC authentication →"
  - "Spring Boot with @java + Angular with @typescriptlang = ❤️. Learn how to build a @springboot + @angular CRUD app today!"
---

Technology moves fast these days. It can be challenging to keep up with the latest trends as well as new releases of your favorite projects. I'm here to help! Spring Boot and Angular are two of my favorite projects, so I figured I'd write y'all a guide to show you how to build and secure a basic app using their latest and greatest releases.

In Spring Boot, the most significant change in 2.0 is its new web framework: Spring WebFlux. In Angular 5.0, we get a new `HttpClient` on the table. This class replaces `Http`, and is a bit easier to use, with less boilerplate code. Today, I'm not going to explore Spring WebFlux, because we still [have some work to do](https://github.com/okta/okta-spring-boot/issues/24) before we can support in with the [Okta Spring Boot Starter](https://github.com/okta/okta-spring-boot).

The good news is our [Angular SDK](https://www.npmjs.com/package/@okta%2Fokta-angular) works well with Angular 5, so I'll be showing how to use it in this blog post. Speaking of Angular, did you know that Angular has [one of the most dramatic increases in questions on Stack Overflow](https://stackoverflow.blog/2017/11/13/cliffs-insanity-dramatic-shifts-technologies-stack-overflow/)? You might think this means a lot of people have issues with Angular. I like to think that there's a lot of people using it, and developers often have questions when using a new technology. It's a definite sign of a healthy community. You rarely see a lot of questions on Stack Overflow for a dying technology.

{% img blog/spring-boot-2-angular-5/increase-in-stack-overflow-technologies-2017.png alt:"Year over year change in questions asked for tags in Stack Overflow" width:"800" %}{: .center-image }

This article describes how to build a simple CRUD application that displays a list of cool cars. It'll allow you to edit the list, and it'll show an animated gif from [GIPHY](http://giphy.com) that matches the car's name. You'll also learn how to secure your application using Okta's Spring Boot starter and Angular SDK.

You will need [Java 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) and [Node.js 8](https://nodejs.org/) installed to complete this tutorial.

## Build an API with Spring Boot 2.0

To get started with [Spring Boot](https://projects.spring.io/spring-boot/) 2.0, head on over to [start.spring.io](https://start.spring.io) and create a new project that uses Java, Spring Boot version 2.0.1, and options to create a simple API: JPA, H2, Rest Repositories, Lombok, and Web. In this example, I've added Actuator as well, since it's a [very cool feature](https://dzone.com/articles/spring-boot-actuator-a-complete-guide) of Spring Boot.

{% img blog/spring-boot-2-angular-5/start.spring.io.png alt:"Spring Initializr" width:"800" %}{: .center-image }

Create a directory to hold your server and client applications. I called mine `okta-spring-boot-2-angular-5-example`, but you can call yours whatever you like. If you'd rather just see the app running than write code, you can [see the example on GitHub](https://github.com/oktadeveloper/okta-spring-boot-2-angular-5-example), or clone and run locally using the commands below.

```bash
git clone https://github.com/oktadeveloper/okta-spring-boot-2-angular-5-example.git
cd okta-spring-boot-2-angular-5-example/client && npm install && ng serve &
cd ../server && ./mvnw spring-boot:run
```

After downloading `demo.zip` from start.spring.io, expand it and copy the `demo` directory to your app-holder directory. Rename `demo` to `server`. Open the project in your favorite IDE and create a `Car.java` file in the `src/main/java/com/okta/developer/demo` directory. You can use Lombok's annotations to reduce boilerplate code.

```java
package com.okta.developer.demo;

import lombok.*;

import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.Entity;

@Entity
@Getter @Setter
@NoArgsConstructor
@ToString @EqualsAndHashCode
public class Car {
    @Id @GeneratedValue
    private Long id;
    private @NonNull String name;
}
```

Create a `CarRepository` class to perform CRUD (create, read, update, and delete) on the `Car` entity.

```java
package com.okta.developer.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
interface CarRepository extends JpaRepository<Car, Long> {
}
```

Add an `ApplicationRunner` bean to the `DemoApplication` class (in `src/main/java/com/okta/developer/demo/DemoApplication.java`) and use it to add some default data to the database.

```java
package com.okta.developer.demo;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import java.util.stream.Stream;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Bean
    ApplicationRunner init(CarRepository repository) {
        return args -> {
            Stream.of("Ferrari", "Jaguar", "Porsche", "Lamborghini", "Bugatti",
                      "AMC Gremlin", "Triumph Stag", "Ford Pinto", "Yugo GV").forEach(name -> {
                Car car = new Car();
                car.setName(name);
                repository.save(car);
            });
            repository.findAll().forEach(System.out::println);
        };
    }
}
```

If you start your app (using `./mvnw spring-boot:run`) after adding this code, you'll see the list of cars displayed in your console on startup.

```
Car(id=1, name=Ferrari)
Car(id=2, name=Jaguar)
Car(id=3, name=Porsche)
Car(id=4, name=Lamborghini)
Car(id=5, name=Bugatti)
Car(id=6, name=AMC Gremlin)
Car(id=7, name=Triumph Stag)
Car(id=8, name=Ford Pinto)
Car(id=9, name=Yugo GV)
```

Add a `CoolCarController` class (in `src/main/java/com/okta/developer/demo/CoolCarController.java`) that returns a list of cool cars to display in the Angular client.

```java
package com.okta.developer.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Collection;
import java.util.stream.Collectors;

@RestController
class CoolCarController {
    private CarRepository repository;

    public CoolCarController(CarRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/cool-cars")
    public Collection<Car> coolCars() {
        return repository.findAll().stream()
                .filter(this::isCool)
                .collect(Collectors.toList());
    }

    private boolean isCool(Car car) {
        return !car.getName().equals("AMC Gremlin") &&
                !car.getName().equals("Triumph Stag") &&
                !car.getName().equals("Ford Pinto") &&
                !car.getName().equals("Yugo GV");
    }
}
```

If you restart your server app and hit `localhost:8080/cool-cars` with your browser, or a command-line client, you should see the filtered list of cars.

```bash
http localhost:8080/cool-cars
HTTP/1.1 200
Content-Type: application/json;charset=UTF-8
Date: Mon, 05 Mar 2018 12:31:32 GMT
Transfer-Encoding: chunked
```
```json
[
    {
        "id": 1,
        "name": "Ferrari"
    },
    {
        "id": 2,
        "name": "Jaguar"
    },
    {
        "id": 3,
        "name": "Porsche"
    },
    {
        "id": 4,
        "name": "Lamborghini"
    },
    {
        "id": 5,
        "name": "Bugatti"
    }
]
```

## Create a Client with Angular CLI

Angular CLI is a command-line utility that can generate an Angular project for you. Not only can it create new projects, but it can also generate code. It's a convenient tool because it also offers commands that will build and optimize your project for production. It uses webpack under the covers for building. If you want to learn more about webpack, I recommend [webpack.academy](https://webpack.academy).

You can learn the basics of Angular CLI at <https://cli.angular.io>.

{% img blog/spring-boot-2-angular-5/cli.angular.io.png alt:"Angular CLI Homepage" width:"800" %}{: .center-image }

Install the latest version of Angular CLI, which is version 1.7.4.

```bash
npm install -g @angular/cli@1.7.4
```

Create a new project in the umbrella directory you created. Again, mine is named `okta-spring-boot-2-angular-5-example`.

```bash
ng new client
```

After the client is created, navigate into its directory and install Angular Material.

```bash
cd client
npm install --save-exact @angular/material@5.2.4 @angular/cdk@5.2.4
```

You'll use Angular Material's components to make the UI look better, especially on mobile phones. If you'd like to learn more about Angular Material, see <https://material.angular.io>. It has extensive documentation on its various components and how to use them.

{% img blog/spring-boot-2-angular-5/material.angular.io.png alt:"Angular Material Homepage" width:"800" %}{: .center-image }

## Build a Car List Page

Use Angular CLI to generate a car service that can talk to the Cool Cars API.

```bash
ng g s car
```

Move the generated files into the `client/src/app/shared/car` directory.

```bash
mkdir -p src/app/shared/car
mv src/app/car.service.* src/app/shared/car/.
```

Update the code in `car.service.ts` to fetch the list of cars from the server.

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CarService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<any> {
    return this.http.get('//localhost:8080/cool-cars');
  }
}
```

Add this service as a provider in `src/app/app.module.ts`. While you're in there, import `HttpClientModule` too.

```typescript
import { CarService } from './shared/car/car.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [CarService],
  bootstrap: [AppComponent]
})
```

Generate a `car-list` component to display the list of cars.

```bash
ng g c car-list
```

Update `client/src/app/car-list/car-list.component.ts` to use the `CarService` to fetch the list and set the values in a local `cars` variable.

```typescript
import { CarService } from '../shared/car/car.service';

export class CarListComponent implements OnInit {
  cars: Array<any>;

  constructor(private carService: CarService) { }

  ngOnInit() {
    this.carService.getAll().subscribe(data => {
      this.cars = data;
    });
  }
}
```

Update `client/src/app/car-list/car-list.component.html` to show the list of cars.

{% raw %}
```html
<h2>Car List</h2>

<div *ngFor="let car of cars">
  {{car.name}}
</div>
```
{% endraw %}

Update `client/src/app/app.component.html` to have the `app-car-list` element.

{% raw %}
```html
<div style="text-align:center">
  <h1>Welcome to {{title}}!</h1>
</div>

<app-car-list></app-car-list>
```
{% endraw %}

Start the client application using `ng serve`. Open your favorite browser to http://localhost:4200. You won't see the
car list just yet, and if you open your developer console, you'll see why.

{% img blog/spring-boot-2-angular-5/cors-error.png alt:"CORS Error" width:"800" %}{: .center-image }

This error happens because you haven't enabled CORS (Cross-Origin Resource Sharing) on the server.

### Enable CORS on the Server

To enable CORS on the server, add a `@CrossOrigin` annotation to the `CoolCarController` (in `server/src/main/java/com/okta/developer/demo/CoolCarController.java`).

```java
import org.springframework.web.bind.annotation.CrossOrigin;
...
@GetMapping("/cool-cars")
@CrossOrigin(origins = "http://localhost:4200")
public Collection<Car> coolCars() {
    return repository.findAll().stream()
            .filter(this::isCool)
            .collect(Collectors.toList());
}
```

Also, add it to `CarRepository` so you can communicate with its endpoints when adding/deleting/editing.

```java
@RepositoryRestResource
@CrossOrigin(origins = "http://localhost:4200")
interface CarRepository extends JpaRepository<Car, Long> {
}
```

Restart the server, refresh the client, and you should see the list of cars in your browser.

## Add Angular Material

You've already installed Angular Material, to use its components, you simply need to import them. Open `client/src/app/app.module.ts` and add imports for animations, and Material's toolbar, buttons, inputs, lists, and card layout.

```typescript
import { MatButtonModule, MatCardModule, MatInputModule, MatListModule, MatToolbarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  ...
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule
  ],
  ...
})
```

Update `client/src/app/app.component.html` to use the toolbar component.

{% raw %}
```html
<mat-toolbar color="primary">
  <span>Welcome to {{title}}!</span>
</mat-toolbar>

<app-car-list></app-car-list>
```
{% endraw %}

Update `client/src/app/car-list/car-list.component.html` to use the card layout and list component.

{% raw %}
```html
<mat-card>
  <mat-card-header>Car List</mat-card-header>
  <mat-card-content>
    <mat-list>
      <mat-list-item *ngFor="let car of cars">
        <img mat-list-avatar src="{{car.giphyUrl}}" alt="{{car.name}}">
        <h3 mat-line>{{car.name}}</h3>
      </mat-list-item>
    </mat-list>
  </mat-card-content>
</mat-card>
```
{% endraw %}

Modify `client/src/styles.css` to specify the theme and icons.

```css
@import "~@angular/material/prebuilt-themes/pink-bluegrey.css";
@import 'https://fonts.googleapis.com/icon?family=Material+Icons';

body {
 margin: 0;
 font-family: Roboto, sans-serif;
}
```

If you run your client with `ng serve` and navigate to http://localhost:4200, you'll see the list of cars, but no images associated with them.

{% img blog/spring-boot-2-angular-5/car-list-no-images.png alt:"Car List without images" width:"800" %}{: .center-image }

## Add Animated GIFs with Giphy

To add a `giphyUrl` property to cars, create `client/src/app/shared/giphy/giphy.service.ts` and populate it with the code below.

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GiphyService {

  // Public beta key: https://github.com/Giphy/GiphyAPI#public-beta-key
  giphyApi = '//api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=1&q=';

  constructor(public http: HttpClient) {
  }

  get(searchTerm) {
    const apiLink = this.giphyApi + searchTerm;
    return this.http.get(apiLink).map((response: any) => {
      if (response.data.length > 0) {
        return response.data[0].images.original.url;
      } else {
        return 'https://media.giphy.com/media/YaOxRsmrv9IeA/giphy.gif'; // dancing cat for 404
      }
    });
  }
}
```

Add `GiphyService` as a provider in `client/src/app/app.module.ts`.

```typescript
import { GiphyService } from './shared/giphy/giphy.service';

@NgModule({
  ...
  providers: [CarService, GiphyService],
  bootstrap: [AppComponent]
})
```

Update the code in `client/src/app/car-list/car-list.component.ts` to set the `giphyUrl` property on each car.

```typescript
import { GiphyService } from '../shared/giphy/giphy.service';

export class CarListComponent implements OnInit {
  cars: Array<any>;

  constructor(private carService: CarService, private giphyService: GiphyService) { }

  ngOnInit() {
    this.carService.getAll().subscribe(data => {
      this.cars = data;
      for (const car of this.cars) {
        this.giphyService.get(car.name).subscribe(url => car.giphyUrl = url);
      }
    });
  }
}
```

Now your browser should show you the list of car names, along with an avatar image beside them.

{% img blog/spring-boot-2-angular-5/car-list-giphy-images.png alt:"Car List with Giphy avatars" width:"800" %}{: .center-image }

## Add an Edit Feature

Having a list of car names and images is cool, but it's a lot more fun when you can interact with it! To add an edit feature, start by generating a `car-edit` component.

```bash
ng g c car-edit
```

Update `client/src/app/shared/car/car.service.ts` to have methods for adding, removing, and updating cars. These methods
talk to the endpoints provided by the `CarRepository` and the `@RepositoryRestResource` annotation.

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CarService {
  public API = '//localhost:8080';
  public CAR_API = this.API + '/cars';

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<any> {
    return this.http.get(this.API + '/cool-cars');
  }

  get(id: string) {
    return this.http.get(this.CAR_API + '/' + id);
  }

  save(car: any): Observable<any> {
    let result: Observable<Object>;
    if (car['href']) {
      result = this.http.put(car.href, car);
    } else {
      result = this.http.post(this.CAR_API, car);
    }
    return result;
  }

  remove(href: string) {
    return this.http.delete(href);
  }
}
```

In `client/src/app/car-list/car-list.component.html`, add a link to the edit component. Also, add a button at the bottom
to add a new car.

{% raw %}
```html
<mat-card>
  <mat-card-header>Car List</mat-card-header>
  <mat-card-content>
    <mat-list>
      <mat-list-item *ngFor="let car of cars">
        <img mat-list-avatar src="{{car.giphyUrl}}" alt="{{car.name}}">
        <h3 mat-line>
          <a mat-button [routerLink]="['/car-edit', car.id]">{{car.name}}</a>
        </h3>
      </mat-list-item>
    </mat-list>
  </mat-card-content>

  <button mat-fab color="primary" [routerLink]="['/car-add']">Add</button>
</mat-card>
```
{% endraw %}

In `client/src/app/app.module.ts`, add routes and import the `FormsModule`.

```typescript
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: '', redirectTo: '/car-list', pathMatch: 'full' },
  {
    path: 'car-list',
    component: CarListComponent
  },
  {
    path: 'car-add',
    component: CarEditComponent
  },
  {
    path: 'car-edit/:id',
    component: CarEditComponent
  }
];

@NgModule({
  ...
  imports: [
    ...
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  ...
})
```

Modify `client/src/app/car-edit/car-edit.component.ts` to fetch a car's information from the id passed on the URL, and to add
methods for saving and deleting.

```typescript
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../shared/car/car.service';
import { GiphyService } from '../shared/giphy/giphy.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-car-edit',
  templateUrl: './car-edit.component.html',
  styleUrls: ['./car-edit.component.css']
})
export class CarEditComponent implements OnInit, OnDestroy {
  car: any = {};

  sub: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private carService: CarService,
              private giphyService: GiphyService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.carService.get(id).subscribe((car: any) => {
          if (car) {
            this.car = car;
            this.car.href = car._links.self.href;
            this.giphyService.get(car.name).subscribe(url => car.giphyUrl = url);
          } else {
            console.log(`Car with id '${id}' not found, returning to list`);
            this.gotoList();
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  gotoList() {
    this.router.navigate(['/car-list']);
  }

  save(form: NgForm) {
    this.carService.save(form).subscribe(result => {
      this.gotoList();
    }, error => console.error(error));
  }

  remove(href) {
    this.carService.remove(href).subscribe(result => {
      this.gotoList();
    }, error => console.error(error));
  }
}
```

Update the HTML in `client/src/app/car-edit/car-edit.component.html` to have a form with the car's name, as well as to display the image from Giphy.

{% raw %}
```html
<mat-card>
  <form #carForm="ngForm" (ngSubmit)="save(carForm.value)">
    <mat-card-header>
      <mat-card-title><h2>{{car.name ? 'Edit' : 'Add'}} Car</h2></mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <input type="hidden" name="href" [(ngModel)]="car.href">
      <mat-form-field>
        <input matInput placeholder="Car Name" [(ngModel)]="car.name"
               required name="name" #name>
      </mat-form-field>
    </mat-card-content>
    <mat-card-actions>
      <button mat-raised-button color="primary" type="submit"
              [disabled]="!carForm.form.valid">Save</button>
      <button mat-raised-button color="secondary" (click)="remove(car.href)"
              *ngIf="car.href" type="button">Delete</button>
      <a mat-button routerLink="/car-list">Cancel</a>
    </mat-card-actions>
    <mat-card-footer>
      <div class="giphy">
        <img src="{{car.giphyUrl}}" alt="{{car.name}}">
      </div>
    </mat-card-footer>
  </form>
</mat-card>
```
{% endraw %}

Put a little padding around the image by adding the following CSS to `client/src/app/car-edit/car-edit.component.css`.

```css
.giphy {
  margin: 10px;
}
```

Modify `client/src/app/app.component.html` and replace `<app-car-list></app-car-list>` with `<router-outlet></router-outlet>`. This change is necessary or routing between components won't work.

{% raw %}
```html
<mat-toolbar color="primary">
  <span>Welcome to {{title}}!</span>
</mat-toolbar>

<router-outlet></router-outlet>
```
{% endraw %}

After you make all these changes, you should be able to add, edit, or delete any cars. Below is a screenshot that shows the list with the add button.

{% img blog/spring-boot-2-angular-5/car-list-add-btn.png alt:"Car List with Add button" width:"800" %}{: .center-image }

The following screenshot shows what it looks like to edit a car that you've added.

{% img blog/spring-boot-2-angular-5/car-edit.png alt:"Car Edit Component" width:"800" %}{: .center-image }

## Add Authentication with Okta

Add authentication with Okta is a nifty feature you can add to this application. Knowing who the person is can come in handy if you want to add auditing, or personalize your application (with a rating feature for example).

### Spring Security + OAuth 2.0

On the server side, you can lock things down with Spring Security and its OAuth 2.0 support. Open `server/pom.xml` and add the following dependencies.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.security.oauth.boot</groupId>
    <artifactId>spring-security-oauth2-autoconfigure</artifactId>
    <version>2.0.0.RELEASE</version>
</dependency>
```

Now you need to configure the server to use Okta for authentication. You'll need to create an OIDC app in Okta for that.

### Create an OIDC App in Okta

Log in to your Okta Developer account (or [sign up](https://developer.okta.com/signup/) if you don't have an account) and navigate to **Applications** > **Add Application**. Click **Single-Page App**, click **Next**, and give the app a name you'll remember. Change all instances of `localhost:8080` to `localhost:4200` and click **Done**.

Create `server/src/main/resources/application.yml` and copy the client ID into it. While you're in there, fill in the rest of the necessary values to match your Okta domain.

```yaml
security:
    oauth2:
        client:
            access-token-uri: https://{yourOktaDomain}/oauth2/default/v1/token
            user-authorization-uri: https://{yourOktaDomain}/oauth2/default/v1/authorize
            client-id: {clientId}
            scope: openid profile email
        resource:
            user-info-uri: https://{yourOktaDomain}/oauth2/default/v1/userinfo
            token-info-uri: https://{yourOktaDomain}/oauth2/default/v1/introspect
            prefer-token-info: false
```

Update `server/src/main/java/com/okta/developer/demo/DemoApplication.java` to enable it as a resource server.

```java
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;

@EnableResourceServer
@SpringBootApplication
```

After making these changes, you should be able to restart your app and see access denied when you try to navigate to http://localhost:8080.

{% img blog/spring-boot-2-angular-5/access-denied.png alt:"Access Denied" width:"800" %}{: .center-image }

It's nice that your server is locked down, but now you need to configure your client to talk to it. This is where Okta's Angular support comes in handy.

### Okta's Angular Support

The Okta Angular SDK is a wrapper around [Okta Auth JS](https://github.com/okta/okta-auth-js), which builds on top of OIDC. More information about Okta's Angular library can be [found on npmjs.com](https://www.npmjs.com/package/@okta/okta-angular).

{% img blog/spring-boot-2-angular-5/okta-angular.png alt:"Okta Angular" width:"800" %}{: .center-image }

To install it, run the following command in the `client` directory:

```
npm install @okta/okta-angular@1.0.0
```

In `client/src/app/app.module.ts`, add a `config` variable with the settings for your OIDC app.

```typescript
const config = {
  issuer: 'https://{yourOktaDomain}/oauth2/default',
  redirectUri: 'http://localhost:4200/implicit/callback',
  clientId: '{clientId}'
};
```

In this same file, you'll also need to add a new route for the `redirectUri` that points to the `OktaCallbackComponent`.

```typescript
import { OktaCallbackComponent, OktaAuthModule } from '@okta/okta-angular';

const appRoutes: Routes = [
  ...
  {
    path: 'implicit/callback',
    component: OktaCallbackComponent
  }
];
```

Next, initialize and import the `OktaAuthModule`.

```typescript
@NgModule({
  ...
  imports: [
    ...
    OktaAuthModule.initAuth(config)
  ],
  ...
})
```

These are the three steps you need to set up an Angular app to use Okta. To make it easy to add a bearer token to HTTP
requests, you can use an [`HttpInterceptor`](https://angular.io/api/common/http/HttpInterceptor).

Create `client/src/app/shared/okta/auth.interceptor.ts` and add the following code to it.

```typescript
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { OktaAuthService } from '@okta/okta-angular';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private oktaAuth: OktaAuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return Observable.fromPromise(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    // Only add to known domains since we don't want to send our tokens to just anyone.
    // Also, Giphy's API fails when the request includes a token.
    if (request.urlWithParams.indexOf('localhost') > -1) {
      const accessToken = await this.oktaAuth.getAccessToken();
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    }
    return next.handle(request).toPromise();
  }
}
```

To register this interceptor, add it as a provider in `client/src/app/app.module.ts`.

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/okta/auth.interceptor';

@NgModule({
  ...
  providers: [CarService, GiphyService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  ...
})
```

Modify `client/src/app/app.component.html` to have login and logout buttons.

{% raw %}
```html
<mat-toolbar color="primary">
  <span>Welcome to {{title}}!</span>
  <span class="toolbar-spacer"></span>
  <button mat-raised-button color="accent" *ngIf="isAuthenticated"
          (click)="oktaAuth.logout()">Logout
  </button>
</mat-toolbar>

<mat-card *ngIf="!isAuthenticated">
  <mat-card-content>
    <button mat-raised-button color="accent"
            (click)="oktaAuth.loginRedirect()">Login
    </button>
  </mat-card-content>
</mat-card>

<router-outlet></router-outlet>
```
{% endraw %}

You might notice there's a span with a `toolbar-spacer` class. To make that work as expected, update `client/src/app/app.component.css` to have the following class.

```css
.toolbar-spacer {
  flex: 1 1 auto;
}
```

There's also a reference to `isAuthenticated` for checking authenticated status. To make this work, add it as a dependency to the constructor in `client/src/app/app.component.ts` and add an initializer method that sets the variable.

```typescript
import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  isAuthenticated: boolean;

  constructor(private oktaAuth: OktaAuthService) {
  }

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    // Subscribe to authentication state changes
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean)  => this.isAuthenticated = isAuthenticated
    );
  }
}
```

Now if you restart your client, you should see a login button.

{% img blog/spring-boot-2-angular-5/login-button.png alt:"Login Button" width:"800" %}{: .center-image }

Notice that this shows elements from the car-list component. To fix this, you can create a home component and make it the default route.

```bash
ng g c home
```

Modify `client/src/app/app.module.ts` to update the routes.

```typescript
const appRoutes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {
    path: 'home',
    component: HomeComponent
  },
  ...
}
```

Move the HTML for the Login button from `app.component.html` to `client/src/app/home/home.component.html`.

{% raw %}
```html
<mat-card>
  <mat-card-content>
    <button mat-raised-button color="accent" *ngIf="!isAuthenticated"
            (click)="oktaAuth.loginRedirect()">Login
    </button>
    <button mat-raised-button color="accent" *ngIf="isAuthenticated"
            [routerLink]="['/car-list']">Car List
    </button>
  </mat-card-content>
</mat-card>
```
{% endraw %}

Add `oktaAuth` as a dependency in `client/src/app/home/home.component.ts` and set it up to initialize/change the `isAuthenticated` variable.

```typescript
import { OktaAuthService } from '@okta/okta-angular';

export class HomeComponent implements OnInit {
  isAuthenticated: boolean;

  constructor(private oktaAuth: OktaAuthService) {
  }

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    // Subscribe to authentication state changes
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean)  => this.isAuthenticated = isAuthenticated
    );
  }
}
```

Update `client/src/app/app.component.html`, so the Logout button redirects back to home when it's clicked.

{% raw %}
```html
<mat-toolbar color="primary">
  <span>Welcome to {{title}}!</span>
  <span class="toolbar-spacer"></span>
  <button mat-raised-button color="accent" *ngIf="isAuthenticated"
          (click)="oktaAuth.logout()" [routerLink]="['/home']">Logout
  </button>
</mat-toolbar>

<router-outlet></router-outlet>
```
{% endraw %}

Now you should be able to open your browser to http://localhost:4200 and click on the Login button. If you've configured everything correctly, you'll be redirected to Okta to log in.

{% img blog/spring-boot-2-angular-5/okta-login.png alt:"Okta Login" width:"800" %}{: .center-image }

Enter the credentials you used to sign up for an account, and you should be redirected back to your app. However, your
list of cars won't load because of a CORS error. This happens because Spring's `@CrossOrigin` doesn't work well with
Spring Security.

To fix this, add a bean to `DemoApplication.java` that handles CORS.

```java
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import java.util.Collections;

...

@Bean
@SuppressWarnings("unchecked")
public FilterRegistrationBean simpleCorsFilter() {
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(true);
    config.setAllowedOrigins(Collections.singletonList("http://localhost:4200"));
    config.setAllowedMethods(Collections.singletonList("*"));
    config.setAllowedHeaders(Collections.singletonList("*"));
    source.registerCorsConfiguration("/**", config);
    FilterRegistrationBean bean = new FilterRegistrationBean(new CorsFilter(source));
    bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
    return bean;
}
```

Restart your server and celebrate when it all works! 🎉

{% img blog/spring-boot-2-angular-5/success-at-last.png alt:"Success!" width:"800" %}{: .center-image }

You can see the full source code for the application developed in this tutorial on GitHub at [https://github.com/oktadeveloper/okta-spring-boot-2-angular-5-example](https://github.com/oktadeveloper/okta-spring-boot-2-angular-5-example).

## Learn More about Spring Boot and Angular

This article uses Okta's Angular SDK, which is something we haven't written about on this blog before. To learn more about this project, see [https://www.npmjs.com/package/@okta/okta-angular](https://www.npmjs.com/package/@okta/okta-angular) or [check it out on GitHub](https://github.com/okta/okta-oidc-js/tree/master/packages/okta-angular).

I've written a number of Spring Boot and Angular tutorials in the past, and I've recently updated them for Angular 5.

* [Bootiful Development with Spring Boot and Angular](/blog/2017/04/26/bootiful-development-with-spring-boot-and-angular)
* [Build a Secure Notes Application with Kotlin, TypeScript, and Okta](/blog/2017/09/19/build-a-secure-notes-application-with-kotlin-typescript-and-okta)
* [Angular Authentication with OpenID Connect and Okta in 20 Minutes](/blog/2017/04/17/angular-authentication-with-oidc)
* [Build an Angular App with Okta's Sign-In Widget in 15 Minutes](/blog/2017/03/27/angular-okta-sign-in-widget)

If you have any questions, please don't hesitate to leave a comment below, or ask us on our [Okta Developer Forums](https://devforum.okta.com/). Follow us [on Twitter](https://twitter.com/oktadev) if you want to be notified when we publish new blog posts.

**Changelog:**

* Apr 9, 2018: Updated to use Okta Angular 1.0.0, Spring Boot 2.0.1, and Angular CLI 1.7.4 (with Angular 5.2.9). See the code changes in the [example app on GitHub](https://github.com/oktadeveloper/okta-spring-boot-2-angular-5-example/pull/5). Changes to this article can be viewed in [okta/okta.github.io#1938](https://github.com/okta/okta.github.io/pull/1938).
* Mar 5, 2018: Updated to use Spring Boot 2.0 and Angular CLI 1.7.2 (with Angular 5.2.7). See the code changes in the [example app on GitHub](https://github.com/oktadeveloper/okta-spring-boot-2-angular-5-example/pull/2). Changes to this article can be viewed in [okta/okta.github.io#1806](https://github.com/okta/okta.github.io/pull/1806).