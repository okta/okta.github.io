---
layout: blog_post
title: "Tutorial: Build a Basic CRUD App with Symfony 4 and Vue"
author: krasimir
description: "This tutorial shows you how to set up a 'quick and dirty' modern application using a backend API written in Symfony 4 and a frontend in Vue.js, with a minimal dependencies and no hassle."
tags: [php, vue, symfony, crud]
tweets:
- "Learn how to use @Symfony and @VueJS to create a simple CRUD application →"
- "Create a CRUD application with @Symfony and @VueJS, and add authentication with Okta! #symfony4"
- "Look how easy it is to add authentication to a @Symfony app with Okta! #symfony4 #php"
---

If you're a web developer in 2018, then you already know that the expectations are high and the tools are many. Users want progressive web applications and seamless experiences across every device. The focus is shifting from monolithic code to APIs built as microservices and consumed by multiple frontends, and finding our way through the ecosystem of ever-changing tools can be a daunting task even for the most experienced of us.

If you're looking for evidence, go no further than the most popular option for putting a site on the web in the past 15 years: [PHP runs 83.5% of the websites whose server-side programming language we know](https://w3techs.com/technologies/details/pl-php/all/all), and JavaScript is practically everywhere on the frontend. But PHP is not your dad's templating system anymore - it's a modern general-purpose scripting language, and people use it to craft beautiful, fast and optimized code. JavaScript, on the other hand, is changing so dramatically that by the time I finish writing this article a new framework will probably emerge, become fashionable and fade away.

I would like to show you how to set up a 'quick and dirty' modern application using a backend API written in Symfony 4 and a frontend in Vue.js, with a minimal set of dependencies and no hassle.

We'll use Okta for user authentication and authorization. You'll need a development environment with PHP 7 and Node.js/npm/Yarn. You will also need an [Okta developer account](https://developer.okta.com/).

## Why Okta?
Well, we might be biased, but we think Okta makes [identity management](https://developer.okta.com/product/user-management/) easier, more secure, and more scalable than what you're used to. Okta is an API service that allows you to create, edit, and securely store user accounts and user account data, and connect them with one or more applications. Our API enables you to:

* [Authenticate](https://developer.okta.com/product/authentication/) and [authorize](https://developer.okta.com/product/authorization/) your users
* Store data about your users
* Perform password-based and [social login](https://developer.okta.com/authentication-guide/social-login/)
* Secure your application with [multi-factor authentication](https://developer.okta.com/use_cases/mfa/)
* And much more! Check out our [product documentation](https://developer.okta.com/documentation/) for more information

[Register for a forever-free developer account](https://developer.okta.com/signup/), and when you're done, come back to learn more about building a secure CRUD app with Symfony.

## Get Started with Symfony 4
Specifically, in this post we'll build a simple tool for keeping track of the 'bad puns' count while watching movies. Here's what our finished application will look like:

{% img blog/php-crud-app-symfony-vue/pun-counter.png alt:"Screenshot of list of movies in the pun counter app" width:"600" %}{: .center-image }

You can add a new movie and increase the bad puns count of movies while watching them. You can track something other than bad puns of course if that's your preference. For example, you can count the number of times the word 'inconceivable' is used in The Princess Bride (spoiler: the answer is 5).

Let's get started by inspecting our tools. Symfony 4 is the latest release of the Symfony project which started as a collection of general purpose components for PHP. These components are widely used on their own, and the most popular PHP framework today (Laravel) is largely built upon them. Symfony 2.x/3.x (known as Symfony Standard Edition) was a comprehensive full-stack framework, but Symfony 4 introduces a new way to build web applications and follows the current trend of separating a backend API from the frontend. It provides a new method of creating and evolving applications (Symfony Flex) which starts with a minimum set of dependencies and automates the bundle management. You can start with a skeleton project with a greatly simplified directory structure and add just what you need, when you need it.

## Create a new Symfony 4 Project

Let's create a new skeleton Symfony 4 project and run the server:

```
composer create-project symfony/skeleton bad-puns-tracker-server
cd bad-puns-tracker-server
php -S 127.0.0.1:8000 -t public
```

Let's also create a new Vue.js project using vue-cli (using the default presets):

```
npm install -g @vue/cli
vue create bad-puns-tracker-client
cd bad-puns-tracker-client
yarn serve
```

Loading `http://localhost:8080/` now shows the default VueJS app and `http://localhost:8000/` shows the default Symfony 4 page.

## Create the Symfony Skeleton API

The modern way to build an API in Symfony 4 would be to use [API Platform](https://api-platform.com/) which includes an API skeleton with the Symfony 4 framework, Doctrine ORM, code-generation tools for admins and Progressive web apps, a Docker-based setup, and other useful features out-of-the-box. However, I will show you the basics of setting up an API without any dependencies apart from the micro framework we already installed.

Let's create a new `MovieController` and a basic GET route. We'll add support for annotated routes:

```
composer require sensio/framework-extra-bundle
```

and create our controller in `src/Controller/MovieController.php`:

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

Now loading [`http://localhost:8000/movies`]() returns a status code of 200 OK and a JSON response. Building our response in every controller action can become tiresome, so let's create an API controller with some useful methods and make our `MovieController` extend from it:


`src/Controller/ApiController.php`

```php
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
```

`src/Controller/MovieController.php`

```php
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

This looks better. Now we can use the `respond()` method to return a JSON response with the default status code of 200, and a `respondUnauthorized()` method to return a 401 Unauthorized response with an appropriate error message.

## Create the Movie Database

Let's quickly create a MySQL database and user to use for our project (you can of course use a different database engine like PostgreSQL or Sqlite if you prefer):

```
mysql -uroot -p
CREATE DATABASE bad_puns_counter CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL on bad_puns_counter.* to bpcuser@127.0.0.1 identified by 'temppass123';
quit
```

Enter the database connection string using the credentials you just created in the `DATABASE_URL` variable in the `.env` file:

```
DATABASE_URL=mysql://bpcuser:temppass123@127.0.0.1:3306/bad_puns_counter
```

Now we can set up our entity. We need the Doctrine ORM pack and the maker-bundle which can help us generate some code.

```
 composer require symfony/orm-pack
 composer require symfony/maker-bundle --dev

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

Now we have an entity, a migration, and the database schema has been migrated. We can create our API endpoints and test them via Postman or a similar client. In a real project, we'd need proper validation, CSRF protection, pagination of the results, etc., but for this demo we'll use a quick and dirty solution.

Let's add API transformers for an individual movie and a movie collection to the `MovieRepository.php` file:

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

We'll also add some additional methods to our `ApiController`:

```php
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
```

Here's our simplified and not entirely clean API controller (in `src/Controllers/MovieController.php` in the server code repository):

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

## Create a Frontend in Vue

We are ready to set up the client app, but first, we'll add a CORS bundle so our API will be available to our client app, and we'll install Vue Router and axios in the client app (so we can perform HTTP requests to our API).

```
(server app directory)
composer require nelmio/cors-bundle

(client app directory)
npm install vue-router
npm i --save axios
```

Let's clean up the default content and show the list of movies on our home page (we're working on the client application now). Delete src/components/HelloWorld.vue and App.vue. Now we have a nice blank page. Let's create a Dashboard component which will simply display a table of the movies data.

`main.js`

```js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.config.productionTip = false

Vue.use(VueRouter)

import Dashboard from './components/Dashboard.vue';

const routes = [
  { path: '/', component: Dashboard },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  router,
  render: h => h(Dashboard)
}).$mount('#app')
```

`components/Dashboard.vue`

{% raw %}
```html
<template>
    <table>
        <tbody>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Count</th>
            </tr>
            <template v-for="movie in movies">
                <tr v-bind:key="movie.id">
                    <td>{{ movie.id }}</td>
                    <td>{{ movie.title }}</td>
                    <td>{{ movie.count }}</td>
                </tr>
            </template>
        </tbody>
    </table>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            movies: {}
        }
    },
    async created () {
        const response = await axios.get('http://localhost:8000/movies')
        this.movies = response.data
    }
}
</script>
```
{% endraw %}

It doesn't look very nice, and we should probably extract the MovieList and MovieItem into separate components, but it displays our data. Let's make it look a bit better: we'll load the Bulma CSS framework from a CDN and update our table.

`public/index.html`

```html
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css">
```

`components/Dashboard.vue`

{% raw %}
```html
<template>
    <div class="container">
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="movie in movies">
                    <tr v-bind:key="movie.id">
                        <td>{{ movie.id }}</td>
                        <td>{{ movie.title }}</td>
                        <td>{{ movie.count }}</td>
                    </tr>
                </template>
            </tbody>
        </table>
        <a class="button is-primary">Add Movie</a>
    </div>
</template>
```
{% endraw %}

Much better! We won't link the button yet (we'll replace it with a MovieForm component soon, and we'll also extract the table with the movies into a MoviesList component on the next step).

## Add Authentication to Your Symfony + Vue App with Okta

Let's add some authentication to our app now and make sure that only logged in users can access our movies. We'll use Okta so you will need to [create a developer account here](https://developer.okta.com/signup/) and create an Application. Use the [QuickStart guide](https://developer.okta.com/quickstart/#/okta-sign-in-page/php/generic) and take note of the Client ID, Client Secret, and Org URL - you will need these for the integration.

When done with the prerequisites, we can install the Okta Vue SDK and modify our Dashboard to include a Login or Logout link depending on the authentication state. Don't forget to replace the Okta parameters with your own data!

```
npm install @okta/okta-vue --save
```

`main.js`

```javascript
import Dashboard from './components/Dashboard.vue';
import MoviesList from './components/MoviesList.vue';

import Auth from '@okta/okta-vue'

Vue.use(Auth, {
  issuer: 'https://{yourOktaDomain}/oauth2/default',
  client_id: '{YOUR_CLIENT_ID}',
  redirect_uri: 'http://localhost:8080/implicit/callback',
  scope: 'openid profile email'
})

const routes = [
  { path: '/implicit/callback', component: Auth.handleCallback() },
  { path: '/', component: MoviesList },
]
```

`components/Dashboard.vue`

```html
<template>
    <div class="container">
        <button v-if='authenticated' v-on:click='logout' id='logout-button'> Logout </button>
        <button v-else v-on:click='login' id='login-button'> Login </button>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            authenticated: false
        }
    },
    created () {
        this.isAuthenticated()
    },
    watch: {
        // Everytime the route changes, check for auth status
        '$route': 'isAuthenticated'
    },
    methods: {
        async isAuthenticated () {
            this.authenticated = await this.$auth.isAuthenticated()
        },
        login () {
            this.$auth.loginRedirect('/')
        },
        async logout () {
            await this.$auth.logout()
            await this.isAuthenticated()

            // Navigate back to home
            this.$router.push({ path: '/' })
        }
    }
}
</script>
```

`components/MoviesList.vue`

{% raw %}
```html
<template>
    <div>
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="movie in movies">
                    <tr v-bind:key="movie.id">
                        <td>{{ movie.id }}</td>
                        <td>{{ movie.title }}</td>
                        <td>{{ movie.count }}</td>
                    </tr>
                </template>
            </tbody>
        </table>
        <a class="button is-primary">Add Movie</a>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            movies: {}
        }
    },
    async created () {
        axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
        try {
            const response = await axios.get('http://localhost:8000/movies')
            this.movies = response.data
        } catch (e) {
            // handle the authentication error here
        }
    }
}
</script>
```
{% endraw %}

The next step is to secure the backend API. We'll install the dependencies and then modify our API Controller by adding a method to perform the authorization and return 401 Unauthorized if it fails. Don't forget to replace the Okta parameters with your own data!

```
composer require okta/jwt-verifier spomky-labs/jose guzzlehttp/psr7
```

`ApiController.php`

```php
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
                        ->setClientId('{YOUR_CLIENT_ID}')
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

Now we need to secure our controller methods. Usually, we'd use Symfony's security firewall and extract our authorization method into a custom provider, or we can use 'before' filters to perform the token authentication. However, for now, we'll simply add a check to all `MovieController` methods that require authorization:

```php
if (! $this->isAuthorized()) {
    return $this->respondUnauthorized();
}
```

This isn't very DRY (obviously) but it's OK for our demo. Now we'll fix our dashboard so it has a separate Home Page and Movies Page (only showing if we're authorized), and we'll use a navbar for the top menu.

Add to routes in `main.js`:

```js
{ path: '/movies', component: MoviesList },
```

`components/Dashboard.vue`

```html
<template>
    <section class="section">
        <div class="container">
            <nav class="navbar" role="navigation" aria-label="main navigation">
                <div class="navbar-menu is-active buttons">
                    <router-link to="/" tag="button" id='home-button' class="button is-link"> Home </router-link>
                    <router-link to="/movies" v-if='authenticated' tag="button" id='home-button' class="button is-link"> Movies </router-link>
                    <button class="button is-link" v-if='authenticated' v-on:click='logout' id='logout-button'> Logout </button>
                    <button v-else v-on:click='login' id='login-button' class="button is-link"> Login </button>
                </div>
            </nav>
            <router-view></router-view>
        </div>
    </section>
</template>
```

## Create a Form in Vue to Add New Movies

We are ready to proceed with the form to add a new movie and the button to update the pun count.

`components/MoviesList.vue`

{% raw %}
```html
<template>
    <div>
        <span class="help is-info"  v-if="isLoading">Loading...</span>
        <table class="table" v-else>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Pun Count</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="movie in movies">
                    <tr v-bind:key="movie.id">
                        <td>{{ movie.id }}</td>
                        <td>{{ movie.title }}</td>
                        <td>{{ movie.count }}</td>
                        <td>
                            <form @submit.prevent="onSubmit(movie)">
                                <button class="button is-primary" v-bind:class="{ 'is-loading' : isCountUpdating(movie.id) }">Increase Count</button>
                            </form>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
        <movie-form @completed="addMovie"></movie-form>
    </div>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import MovieForm from './MovieForm.vue'

export default {
    components: {
        MovieForm
    },
    data() {
        return {
            movies: {},
            isLoading: true,
            countUpdatingTable: []
        }
    },
    async created () {
        axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
        try {
            const response = await axios.get('http://localhost:8000/movies')
            this.movies = response.data
            this.isLoading = false
        } catch(e) {
            // handle authentication error here
        }
    },
    methods: {
        onSubmit(movie) {
            Vue.set(this.countUpdatingTable, movie.id, true)
            this.increaseCount(movie)
        },
        async increaseCount(movie) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
            axios.post('http://localhost:8000/movies/' + movie.id + '/count')
                .then(response => {
                    movie.count = response.data.count
                    this.countUpdatingTable[movie.id] = false
                })
                .catch(() => {
                    // handle authentication and validation errors here
                    this.countUpdatingTable[movie.id] = false
                })
        },
        isCountUpdating(id) {
            return this.countUpdatingTable[id]
        },
        addMovie(movie) {
            this.movies.push(movie)
        }
    }
}
</script>
```
{% endraw %}

`components/MovieForm.vue`

```html
<template>
    <form @submit.prevent="onSubmit">
        <span class="help is-danger" v-text="errors"></span>

        <div class="field">
            <div class="control">
                <input class="input" type="title" placeholder="enter movie title..." v-model="title" @keydown="errors = ''">
            </div>
        </div>

        <button class="button is-primary" v-bind:class="{ 'is-loading' : isLoading }">Add Movie</button>
    </form>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            title: '',
            errors: '',
            isLoading: false
        }
    },
    methods: {
        onSubmit() {
            this.isLoading = true
            this.postMovie()
        },
        async postMovie() {
            axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
            axios.post('http://localhost:8000/movies', this.$data)
                .then(response => {
                    this.title = ''
                    this.isLoading = false
                    this.$emit('completed', response.data)
                })
                .catch(error => {
                    // handle authentication and validation errors here
                    this.errors = error.response.data.errors
                    this.isLoading = false
                })
        }
    }
}
</script>
```

The application is fully functional at this stage. As a next step, we need to clean up the code as there is a lot of repetition (especially in the handling of AJAX requests at the frontend). However, I'll leave that for another article.

You can see the full source code on GitHub at [https://github.com/oktadeveloper/okta-php-symfony-vue-crud-example](https://github.com/oktadeveloper/okta-php-symfony-vue-crud-example).

## Learn More About Secure Authentication in Vue
* [Our Vue Samples and Quickstarts](https://developer.okta.com/code/vue/)
* [The Lazy Developer's Guide to Authentication with Vue.js](/blog/2017/09/14/lazy-developers-guide-to-auth-with-vue)
* [Build a Cryptocurrency Comparison Site with Vue.js](/blog/2017/09/06/build-a-cryptocurrency-comparison-site-with-vuejs)
* [Build a Basic CRUD App with Vue.js and Node](/blog/2018/02/15/build-crud-app-vuejs-node)
* [Build a Secure To-Do App with Vue, ASP.NET Core, and Okta](/blog/2018/01/31/build-secure-todo-app-vuejs-aspnetcore)

As always, we'd love to hear from you about this post, or really anything else! Hit us up in the comments, or on Twitter [@oktadev](https://twitter.com/OktaDev)!
