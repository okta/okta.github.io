---
layout: blog_post
title: "Tutorial: Build Your First CRUD App with Symfony and Angular"
author: krasimir
description: "This tutorial shows you how to set up a 'quick and dirty' modern application using a backend API written in Symfony 4 and a frontend in Angular, with a minimal dependencies and no hassle."
tags: [php, angular, symfony, crud]
tweets:
- "Learn how to use @Symfony and @Angular to create a simple CRUD application →"
- "Create a CRUD application with @Symfony and @Angular, and add authentication with Okta! #symfony4"
- "Look how easy it is to add authentication to a @Symfony app with Okta! #symfony4 #php"
---

Building a web application isn't supposed to be drudgery. No developer has ever said "I'd really like to spend two hours configuring webpack and TypeScript this weekend." You'd rather build cool stuff NOW and spend time thinking about your applications, not the tools you're forced to use. In a lot of cases the "cool stuff" is a dynamic, fast, secure single-page app. To achieve that, in this tutorial I'll show you how to get a basic app running with a Symfony 4 API and an Angular 6 frontend in less than an hour.

On the surface, Symfony and Angular might seem like a peculiar combination. Angular is a product of Google and the rumor that Google developers are allowed to use any language at work, except PHP, is not entirely fake news. PHP is a dynamic language. It's also probably the biggest reason why dynamic languages sometimes get a bad reputation. Angular uses TypeScript, which was developed by people who spent vast amounts of effort just because they thought JavaScript should not be a dynamic language.

However, if you look closer, Symfony and Angular share a lot of similarities:

* They are both fully featured, opinionated frameworks that know better than you how your application should be structured
* Both frameworks rely heavily on dependency injection and event-driven communication to achieve reusable, loosely-coupled components
* Both frameworks have excellent command line tools for seamless installation, configuration, and code scaffolding

So that covers fast and dynamic, but what about secure? For that you''ll use Okta for user authentication and authorization. You'll need to set up a development environment with PHP 7 and Node.js 8+/npm. You will also need an [Okta developer account](https://developer.okta.com/).

## Why Okta?

Well, we might be biased, but we think Okta makes [identity management](https://developer.okta.com/product/user-management/) easier, more secure, and more scalable than what you're used to. Okta is an API service that allows you to create, edit, and securely store user accounts and user account data, and connect them with one or more applications. Our API enables you to:

* [Authenticate](https://developer.okta.com/product/authentication/) and [authorize](https://developer.okta.com/product/authorization/) your users
* Store data about your users
* Perform password-based and [social login](/authentication-guide/social-login/)
* Secure your application with [multi-factor authentication](/use_cases/mfa/)
* And much more! Check out our [product documentation](/documentation/) for more information

[Register for a forever-free developer account](https://developer.okta.com/signup/), and when you're done, come back to learn more about building a secure CRUD app with Symfony and Angular.

## What Will We Build?

We'll build a small application that allows you to keep track of the 'bad puns' count while watching movies (you can track anything else you'd like of course). Here's what the finished tool will look like:

{% img blog/php-crud-app-symfony-angular/pun-counter.png alt:"Screenshot of list of movies in the pun counter app" width:"571" %}{: .center-image }

You can add a new movie when you start watching it, and you can increase the bad puns count of the movie. If you're not interested in bad puns in movies, you can track something else. For example, you can count the number of times the word 'Sectumsempra' is used in all Harry Potter novels (spoiler: the answer is 11).

## Set Up Symfony 4

Let's create a new skeleton Symfony 4 project and run the server:

```bash
composer create-project symfony/skeleton bad-puns-tracker-server
cd bad-puns-tracker-server
php -S 127.0.0.1:8000 -t public
```

Loading `http://localhost:8000/` now shows the default Symfony 4 page.

## Create the Symfony Skeleton API

We would probably use [API Platform](https://api-platform.com/) if we're building a new enterprise application. It would include a REST API skeleton with the Symfony 4 framework, Doctrine ORM, code-generation tools for admins and Progressive web apps, a Docker-based setup, and other useful features out-of-the-box. However, in this tutorial we'll go old school and build our own API without any dependencies outside the micro framework.

Let's add support for annotated routes to our app and create a new MovieController with a basic GET route:

```bash
composer require sensio/framework-extra-bundle
```

and create our controller in src/Controller/MovieController.php:

```php
<?php
namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class MovieController
{
    /**
    * @Route("/movies")
    */
    public function moviesAction()
    {
        return new JsonResponse([
            [
                'title' => 'The Princess Bride',
                'count' => 0
            ]
        ]);
    }
}
```

Now loading [http://localhost:8000/movies]() returns a status code of 200 OK and a JSON response. Next, we will extract an API controller with some useful methods and make our MovieController extend from it:

```php
src/Controller/ApiController.php

<?php
namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;

class ApiController
{

    /**
     * @var integer HTTP status code - 200 (OK) by default
     */
    protected $statusCode = 200;

    /**
     * Gets the value of statusCode.
     *
     * @return integer
     */
    public function getStatusCode()
    {
        return $this->statusCode;
    }

    /**
     * Sets the value of statusCode.
     *
     * @param integer $statusCode the status code
     *
     * @return self
     */
    protected function setStatusCode($statusCode)
    {
        $this->statusCode = $statusCode;

        return $this;
    }

    /**
     * Returns a JSON response
     *
     * @param array $data
     * @param array $headers
     *
     * @return Symfony\Component\HttpFoundation\JsonResponse
     */
    public function respond($data, $headers = [])
    {
        return new JsonResponse($data, $this->getStatusCode(), $headers);
    }

    /**
     * Sets an error message and returns a JSON response
     *
     * @param string $errors
     *
     * @return Symfony\Component\HttpFoundation\JsonResponse
     */
    public function respondWithErrors($errors, $headers = [])
    {
        $data = [
            'errors' => $errors,
        ];

        return new JsonResponse($data, $this->getStatusCode(), $headers);
    }

    /**
     * Returns a 401 Unauthorized http response
     *
     * @param string $message
     *
     * @return Symfony\Component\HttpFoundation\JsonResponse
     */
    public function respondUnauthorized($message = 'Not authorized!')
    {
        return $this->setStatusCode(401)->respondWithErrors($message);
    }
}

src/Controller/MovieController.php

<?php
namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;

class MovieController extends ApiController
{
    /**
    * @Route("/movies")
    */
    public function moviesAction()
    {
        return $this->respond([
            [
                'title' => 'The Princess Bride',
                'count' => 0
            ]
        ]);
    }
}
```

Now we can use the `respond()` method to return a JSON response with the default status code of 200, and a `respondUnauthorized()` method to return a 401 Unauthorized response with an error message.

## Create the Movie Database for our Symfony API

Let's set up a MySQL database and user for our project (you are free to choose a different database engine like PostgreSQL or Sqlite if it's your preference):

```
mysql -uroot -p
CREATE DATABASE bad_puns_counter CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL on bad_puns_counter.* to bpcuser@localhost identified by 'temppass123';
quit
```

We will install the Doctrine ORM pack and the maker-bundle first which can help us generate some code. 

```bash
composer require symfony/orm-pack
composer require symfony/maker-bundle --dev
```

Enter the database connection string using the credentials you previous created in the `DATABASE_URL` variable in the `.env` file:

```bash
DATABASE_URL=mysql://bpcuser:temppass123@127.0.0.1:3306/bad_puns_counter
```

Now we can create our Movie entity. 

```bash
php bin/console make:entity
 Class name of the entity to create or update (e.g. VictoriousElephant):
 > Movie

 created: src/Entity/Movie.php
 created: src/Repository/MovieRepository.php

 Entity generated! Now let's add some fields!
 You can always add more fields later manually or by re-running this command.

 New property name (press <return> to stop adding fields):
 > title

 Field type (enter ? to see all types) [string]:
 >

 Field length [255]:
 >

 Can this field be null in the database (nullable) (yes/no) [no]:
 >

 updated: src/Entity/Movie.php

 Add another property? Enter the property name (or press <return> to stop adding fields):
 > count

 Field type (enter ? to see all types) [string]:
 > integer

 Can this field be null in the database (nullable) (yes/no) [no]:
 >

 updated: src/Entity/Movie.php

 Add another property? Enter the property name (or press <return> to stop adding fields):
 >

Success!
Next: When you're ready, create a migration with make:migration

php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

## Implement the API Endpoints in Symfony

We are almost ready. We have the database schema, the entity and the necessary SQL migrations. Let's create our API endpoints and test them via Postman. We'll skip the proper validation, pagination, rate limiting, advanced security, etc. We'll leave these concerns to more advanced APIs.

Let's add API transformers for an individual movie and a movie collection to `src/Repository/MovieRepository.php`:

```php
public function transform(Movie $movie)
{
    return [
            'id'    => (int) $movie->getId(),
            'title' => (string) $movie->getTitle(),
            'count' => (int) $movie->getCount()
    ];
}

public function transformAll()
{
    $movies = $this->findAll();
    $moviesArray = [];

    foreach ($movies as $movie) {
        $moviesArray[] = $this->transform($movie);
    }

    return $moviesArray;
}
```

We'll also add some additional methods to our ApiController:

```php
use Symfony\Component\HttpFoundation\Request;

...

/**
 * Returns a 422 Unprocessable Entity
 *
 * @param string $message
 *
 * @return Symfony\Component\HttpFoundation\JsonResponse
 */
public function respondValidationError($message = 'Validation errors')
{
    return $this->setStatusCode(422)->respondWithErrors($message);
}

/**
 * Returns a 404 Not Found
 *
 * @param string $message
 *
 * @return Symfony\Component\HttpFoundation\JsonResponse
 */
public function respondNotFound($message = 'Not found!')
{
    return $this->setStatusCode(404)->respondWithErrors($message);
}

/**
 * Returns a 201 Created
 *
 * @param array $data
 *
 * @return Symfony\Component\HttpFoundation\JsonResponse
 */
public function respondCreated($data = [])
{
    return $this->setStatusCode(201)->respond($data);
}

// this method allows us to accept JSON payloads in POST requests 
// since Symfony 4 doesn't handle that automatically:

protected function transformJsonBody(\Symfony\Component\HttpFoundation\Request $request)
{
    $data = json_decode($request->getContent(), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        return null;
    }

    if ($data === null) {
        return $request;
    }

    $request->request->replace($data);

    return $request;
}

```

Here's the full version of our simple and dirty API controller (in `src/Controllers/MovieController.php` in the server code repository):

```php
<?php
namespace App\Controller;

use App\Entity\Movie;
use App\Repository\MovieRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

class MovieController extends ApiController
{
    /**
    * @Route("/movies")
    * @Method("GET")
    */
    public function index(MovieRepository $movieRepository)
    {
        $movies = $movieRepository->transformAll();

        return $this->respond($movies);
    }

    /**
     * @Route("/movies/{id}")
     * @Method("GET")
     */
    public function show($id, MovieRepository $movieRepository)
    {
        $movie = $movieRepository->find($id);

        if (! $movie) {
            return $this->respondNotFound();
        }

        $movie = $movieRepository->transform($movie);

        return $this->respond($movie);
    }

    /**
    * @Route("/movies")
    * @Method("POST")
    */
    public function create(Request $request, MovieRepository $movieRepository, EntityManagerInterface $em)
    {
        $request = $this->transformJsonBody($request);

        if (! $request) {
            return $this->respondValidationError('Please provide a valid request!');
        }

        // validate the title
        if (! $request->get('title')) {
            return $this->respondValidationError('Please provide a title!');
        }

        // persist the new movie
        $movie = new Movie;
        $movie->setTitle($request->get('title'));
        $movie->setCount(0);
        $em->persist($movie);
        $em->flush();

        return $this->respondCreated($movieRepository->transform($movie));
    }

    /**
    * @Route("/movies/{id}/count")
    * @Method("POST")
    */
    public function increaseCount($id, EntityManagerInterface $em, MovieRepository $movieRepository)
    {
        $movie = $movieRepository->find($id);

        if (! $movie) {
            return $this->respondNotFound();
        }

        $movie->setCount($movie->getCount() + 1);
        $em->persist($movie);
        $em->flush();

        return $this->respond([
            'count' => $movie->getCount()
        ]);
    }

}

```

## Secure the Symfony API with Okta

The next step is to secure the API. We'll install the Okta dependencies and then add a method to our API Controller to perform the authorization and return 401 Unauthorized if it fails. Don't forget to replace the Okta parameters with your own values!

```bash
composer require okta/jwt-verifier spomky-labs/jose guzzlehttp/psr7
```

```php
ApiController.php

/**
 * Attempt authorization using jwt-verifier
 *
 * @return bool
 */
public function isAuthorized(): bool
{
    if (! isset( $_SERVER['HTTP_AUTHORIZATION'])) {
        return false;
    }

    $authType = null;
    $authData = null;

    // Extract the auth type and the data from the Authorization header.
    @list($authType, $authData) = explode(" ", $_SERVER['HTTP_AUTHORIZATION'], 2);

    // If the Authorization Header is not a bearer type, return a 401.
    if ($authType != 'Bearer') {
        return false;
    }

    // Attempt authorization with the provided token
    try {

        // Setup the JWT Verifier
        $jwtVerifier = (new \Okta\JwtVerifier\JwtVerifierBuilder())
                        ->setAdaptor(new \Okta\JwtVerifier\Adaptors\SpomkyLabsJose())
                        ->setAudience('api://default')
                        ->setClientId('{yourClientId}')
                        ->setIssuer('https://{yourOktaDomain}/oauth2/default')
                        ->build();

        // Verify the JWT from the Authorization Header.
        $jwt = $jwtVerifier->verify($authData);
    } catch (\Exception $e) {

        // We encountered an error, return a 401.
        return false;
    }

    return true;
}
```

We need to secure our controller methods now. Instead of using the security firewall of Symfony and extracting our authorization code into a custom provider, or using 'before' filters for token authentication, we'll simply add a check to all `MoviesController` methods that require authorization (we only have a few of them after all):

```php
if (! $this->isAuthorized()) {
    return $this->respondUnauthorized();
}
```

This isn't very DRY (seriously) but it's OK for our quick application. 

## Set Up Angular 6 

The backend is ready, secured and tested, so we can proceed with the frontend. We'll add a CORS bundle so our API will be available to our client app:

```bash
# (server app directory)
composer require nelmio/cors-bundle
```

Let's do a global installation of the latest angular CLI and create our project:

```bash
sudo npm install -g @angular/cli
ng new bad-puns-tracker-client-ng
cd bad-puns-tracker-client-ng
ng --version
# Angular CLI: 6.1.2
# Angular: 6.1.1
ng serve --open
```

Loading `http://localhost:4200/` should show the default Angular app.

Let's add the Bulma CSS framework to our project and replace the placeholder content from the homepage:

```bash
npm install --save bulma
```

Add to `.angular.json`:

```css
"styles": [
  ...,
  "node_modules/bulma/css/bulma.min.css"
]
```

You'll have to recompile the application manually after this, as changes to the configuration files are not picked up automatically (just run `ng serve --open` again).

Open `src/app/app.component.html` and replace the contents with:

```html
<div style="text-align:center">
    <section class="section">
        <div class="container">
            <nav class="navbar" role="navigation" aria-label="main navigation">
                <div class="navbar-menu is-active buttons">
                    <button class="button is-link">Home</button>
                    <button class="button is-link">Movies</button>
                </div>
            </nav>
        </div>
    </section>
</div>
```

Let's create our two main components:

```bash
ng generate component Home
ng generate component MovieList
```

## Adding Routing to the Angular Frontend

Now we can add the routing module and set up some basic templates for Home and Movies.

```ts
src/app/app.module.ts

import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'movies', component: MovieListComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

In the imports section:

imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
],
```

We are ready to update `src/app/app.component.html` so we can include the routing links and router outlet:

```html
src/app/app.component.html

Replace the <nav class="navbar"> section with:

<nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-menu is-active buttons">
        <button class="button is-link" [routerLink]="['']">Home</button>
        <button class="button is-link" [routerLink]="['/movies']">Movies</button>
    </div>
</nav>
<router-outlet></router-outlet>
```

## Add Okta to the Symfony API

Now we can move on to the Okta integration so we can setup our Login/Logout links, and hide the Movies link if the user is not logged in.

We'll start by setting up the dependencies:

```bash
npm install @okta/okta-angular rxjs-compat@6 --save
```

```ts
src/app/app.module.ts
import { OktaAuthModule, OktaCallbackComponent } from '@okta/okta-angular';

const oktaConfig = {
  issuer: '{YourIssuerURL}',
  redirectUri: 'http://localhost:4200/implicit/callback',
  clientId: '{yourClientId}'
};
```

Don't forget to replace your URL and Client ID!

```ts
src/app/app.module.ts

imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    OktaAuthModule.initAuth(oktaConfig)
],

Also update the routes:

const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'movies', component: MovieListComponent },
    { path: 'implicit/callback', component: OktaCallbackComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
```

We will add the login and logout functionality next:

```ts
src/app/app.component.ts

import { Component } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

    isAuthenticated: boolean;

    constructor(public oktaAuth: OktaAuthService) {
        this.oktaAuth.$authenticationState.subscribe(
            (isAuthenticated: boolean) => (this.isAuthenticated = isAuthenticated)
        );
    }

    async ngOnInit() {
        this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    }

    login() {
        this.oktaAuth.loginRedirect('/');
    }

    logout() {
        this.oktaAuth.logout('/');
    }
}
```

We can now add the Login/Logout buttons to the navigation template, and hide the Movies button when not logged in:

```html
src/app/app.component.html

<button class="button is-link" *ngIf="isAuthenticated" [routerLink]="['/movies']">Movies</button>
<button class="button is-link" *ngIf="!isAuthenticated" (click)="login()"> Login </button>
<button class="button is-link" *ngIf="isAuthenticated" (click)="logout()"> Logout </button>
```

## Create the Movie Service in Symfony

It's time to connect our backend API. We'll implement a Movie service that will allow us to retrieve the list of movies, add a new movie and increase the bad pun count of a movie.

We need to import the HttpModule:

```ts
src/app/app.module.ts

import { HttpModule } from '@angular/http';
...
imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(routes),
    OktaAuthModule.initAuth(oktaConfig)
],
```

We can use the auto-generator to create the service:

```bash
ng generate service movie
```

Let's edit the service class and start adding the functionality we need (we'll just create a method that returns all movies from our API for now). Since we only have one service, we'll keep the common API code (URL, adding the Authorization header etc) inside it, and we will also define our Movie interface within the same file (for brevity). We would of course extract these items in a larger application.

```ts
src/app/movie.service.ts

import { Injectable } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

export interface Movie {
    id: Number,
    title: String,
    count: Number
}

const API_URL: string = 'http://localhost:8000';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

    private accessToken;
    private headers;

    constructor(private oktaAuth: OktaAuthService, private http: Http) {
        this.init();
    }

    async init() {
        this.accessToken = await this.oktaAuth.getAccessToken();
        this.headers = new Headers({
            Authorization: 'Bearer ' + this.accessToken
        });
    }

    getMovies(): Observable<Movie[]> {
        return this.http.get(API_URL + '/movies',
            new RequestOptions({ headers: this.headers })
        )
        .map(res => res.json());
    }
}
```

Now we can add the code for fetching the Movies data to the OnInit lifecycle hook of the MovieListComponent:

```ts
src/app/movie-list/movie-list.component.ts

import { Component, OnInit } from '@angular/core';
import { Movie, MovieService } from '../movie.service';
import 'rxjs/Rx';

@Component({
    selector: 'app-movie-list',
    templateUrl: './movie-list.component.html',
    styleUrls: ['./movie-list.component.css']
})

export class MovieListComponent implements OnInit {

    movies: Movie[];
    errorMessage: string;

    constructor(private movieService: MovieService) {}

    ngOnInit() {
        this.getMovies();
    }

    getMovies() {
        this.movieService
            .getMovies()
            .subscribe(
                movies => this.movies = movies,
                error => this.errorMessage = <any>error
            );
    }

}
```

## Show the Movies List in Angular

We have the data and we can show it in the MovieListComponent:

{% raw %}
```html
src/app/movie-list/movie-list.component.html

<div>
    <span class="help is-info"  *ngIf="isLoading">Loading...</span>
    <table class="table" *ngIf="!isLoading">
        <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Bad Puns Count</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr *ngFor="let movie of movies">
                <td>{{ movie.id }}</td>
                <td>{{ movie.title }}</td>
                <td>{{ movie.count }}</td>
                <td>
                    <form>
                        <button class="button is-primary">Increase Count</button>
                    </form>
                </td>
            </tr>
        </tbody>
    </table>
</div>
```
{% endraw %}

We'll also modify our `MovieListComponent` class to include the `isLoading` property (initialized to `true` and set to `false` after the list of movies is retrieved from the server), and our `Movie` model and service to include an `isUpdating` flag for every movie (initialized to `false`):

```ts
src/app/movie-list/movie-list.component.ts

export class MovieListComponent implements OnInit {

    ...
    isLoading: boolean = true;

    ...
    getMovies() {
        this.movieService
            .getMovies()
            .subscribe(
                movies => {
                    this.movies = movies;
                    this.isLoading = false;
                },
                error => this.errorMessage = <any>error
            );
    }
    ...
}

src/app/movie.service.ts

export interface Movie {
    id: Number,
    title: String,
    count: Number,
    isUpdating: boolean
}
...
getMovies(): Observable<Movie[]> {
    return this.http.get(API_URL + '/movies',
        new RequestOptions({ headers: this.headers })
    )
    .map(res => {
        let modifiedResult = res.json();
        modifiedResult = modifiedResult.map(function(movie) {
            movie.isUpdating = false;
            return movie;
        });
        return modifiedResult;
    });
}

src/app/movie-list/movie-list.component.ts

findMovie(id): Movie {
    return this.movies.find(movie => movie.id === id);
}

isUpdating(id): boolean {
    return this.findMovie(id).isUpdating;
}
```

## Increase the Count in Angular

We can now implement the button to increase the bad pun count. We'll import FormsModule and put a click handler on the 'Update Count' button on each movie row:

```ts
src/app/app.module.ts
...
import { FormsModule }   from '@angular/forms';
...

src/app/movie-list/movie-list.component.html
...
<button type="button" class="button is-primary" [class.is-loading]="isUpdating(movie.id)" (click)="increaseCount(movie.id)">Increase Count</button>
...

src/app/movie.service.ts
...
increaseCount(id): Observable<Movie> {
    return this.http.post(API_URL + '/movies/' + id + '/count', {},
        new RequestOptions({ headers: this.headers })
    ).map(res => res.json());
}
...

src/app/movie-list/movie-list.component.ts
...
increaseCount(id) {
    let movie = this.findMovie(id);
    movie.isUpdating = true;
    this.movieService
        .increaseCount(id)
        .subscribe(
            response => {
                movie.count = response.count;
                movie.isUpdating = false;
            },
            error => {
                this.errorMessage = <any>error;
                movie.isUpdating = false;
            }
        );
}
...
```

Great! Now we can increase the pun counts of our movies while we watch them. Let's make sure we can also create a new movie though, or this game will become boring very soon. I mean, how many times can you really watch Guardians of the Galaxy and count its bad puns?

## Create a Form to Add New Movies to the Angular App

We'll create a new component (`MovieForm`) and display it within the `MovieList`, below the table of movies.

```bash
ng generate component MovieForm
```

{% raw %}
```html
src/app/movie-list/movie-list.component.html
...
<app-movie-form (movieAdded)="appendMovie($event)"></app-movie-form>

src/app/movie.service.ts
...
addMovie(movie): Observable<Movie> {
    return this.http.post(API_URL + '/movies', movie, 
        new RequestOptions({ headers: this.headers })
    ).map(res => res.json());
}

src/app/movie-form/movie-form.component.html

<span class="help is-danger">{{ errors }}</span>
<div class="field">
    <div class="control">
        <input class="input" #movieTitle (keydown)="errors = ''">
    </div>
</div>
<button type="button" class="button is-primary" [class.is-loading]="isLoading" (click)="addMovie(movieTitle.value)">Add Movie</button>

src/app/movie-form/movie-form.component.ts

import { Component, OnInit, EventEmitter, Output  } from '@angular/core';
import { Movie, MovieService } from '../movie.service';
import 'rxjs/Rx';

@Component({
    selector: 'app-movie-form',
    templateUrl: './movie-form.component.html',
    styleUrls: ['./movie-form.component.css']
})

export class MovieFormComponent implements OnInit {

    errors: string = '';
    isLoading: boolean = false;

    constructor(private movieService: MovieService) { }

    @Output()
    movieAdded: EventEmitter<Movie> = new EventEmitter<Movie>();

    ngOnInit() {
    }

    addMovie(title) {
        this.isLoading = true;
        this.movieService
            .addMovie({
                title: title
            })
            .subscribe(
                movie => {
                    this.isLoading = false;
                    movie.isUpdating = false;
                    this.movieAdded.emit(movie);
                },
                error => {
                    this.errors = error.json().errors;
                    this.isLoading = false;
                }
            );
    }

}

src/app/movie-list/movie-list.component.ts
...
appendMovie(movie: Movie) {
    this.movies.push(movie);
}
```
{% endraw %}

Congratulations, your application is now complete! 

You can see the full source code on GitHub at [https://github.com/oktadeveloper/okta-php-symfony-angular-crud-example](https://github.com/oktadeveloper/okta-php-symfony-angular-crud-example).


## Learn More About Symfony and Angular

Interested in digging in deeper with Symfony, Angular, or Okta? We've got you covered. Check out the following resources for more cool projects:

* [Add Authentication to Your Angular PWA](/blog/2017/06/13/add-authentication-angular-pwa)
* [Build a Basic CRUD App with Symfony 4 and Vue](/blog/2018/06/14/php-crud-app-symfony-vue)
* [Angular 6: What's New and Why Upgrade?](/blog/2018/05/09/upgrade-to-angular-6)
* And as always, we'd love to connect! Leave us a comment below, check out our [developer forum](https://devforum.okta.com/), or hit us up on Twitter [@oktadev](https://twitter.com/OktaDev)!

