---
layout: blog_post
title: "Tutorial: Build a Secure CRUD App with Symfony and React"
author: krasimir
description: "This tutorial teaches you how to build a simple CRUD single-page application with a Symfony 4 backend API and a React/Semantic UI frontend."
tags: [php, react, symfony, crud, semanticui]
tweets:
- "Learn how to use @Symfony and @ReactJS to create a simple CRUD application →"
- "Create a CRUD application with @Symfony and @ReactJS, and add authentication with Okta! #symfony4"
- "Look how easy it is to add authentication to a @Symfony app with Okta! #symfony4 #php"
image: "blog/symfony-react-php-crud-app/movie-list.png"
---

Building a modern single-page application can be a daunting task for a sole developer because of the sheer amount of different components you need to get in place – you need a backend API, a dynamic frontend, a decent user interface, and everything has to be secure and scalable. However, with the right tools in place, you can get started quickly without compromising quality or performance. Today I'll show you how to create an app using Symfony 4 as the backend API with a React frontend (and the [React version of Semantic UI](https://react.semantic-ui.com/)) for a hassle-free user interface – I promise you we will write only the bare minimum of HTML, and not a single line of CSS.

Getting security right is extremely important when building a web application. When it comes to such a critical part of your product, the best approach is to rely on tested and well-documented solutions. We'll go with Okta for user authentication and authorization in our app, which will also save us a considerable amount of development time.

Before you start, you'll need to set up a development environment with PHP 7 and Node.js 8+/npm. You will also need an [Okta developer account](https://developer.okta.com/).

## Why Okta?

Well, we might be biased, but we think Okta makes [identity management](https://developer.okta.com/product/user-management/) easier, more secure, and more scalable than what you're used to. Okta is an API service that allows you to create, edit, and securely store user accounts and user account data, and connect them with one or more applications. Our API enables you to:

* [Authenticate](https://developer.okta.com/product/authentication/) and [authorize](https://developer.okta.com/product/authorization/) your users
* Store data about your users
* Perform password-based and [social login](/authentication-guide/social-login/)
* Secure your application with [multi-factor authentication](/use_cases/mfa/)
* And much more! Check out our [product documentation](/documentation/) for more information

[Register for a forever-free developer account](https://developer.okta.com/signup/), and when you're done, come back to learn more about building a secure CRUD app with Symfony.

## What Will We Build?

The application we'll build is a "bad puns" tracker for movies. You can add a new movie when you start watching it, and you can hit a button to increase the count whenever you hear a bad pun. 

Here's what the completed app will look like:

{% img blog/symfony-react-php-crud-app/movie-list.png alt:"List of movies" width:"800" %}{: .center-image }

## Bootstrap the Symfony 4 Backend

Symfony 4 introduced Flex which is a new way to build Web applications – instead of starting with a full-stack framework, Flex allows you to pick just the components you need and gradually evolve your installation so you can build a quick console app, a lightweight API, or a complete Web application using the same starting point. We will initialize a skeleton project with a much simplified directory structure:

```bash
composer create-project symfony/skeleton bad-puns-tracker-server
cd bad-puns-tracker-server
php -S 127.0.0.1:8000 -t public
```

Loading `http://localhost:8000/` now shows the default Symfony 4 page.

## Create the Symfony API Skeleton
I do not recommend you to build your Symfony APIs from scratch when working on commercial applications - instead, give [API Platform](https://api-platform.com/) or the `FOSRestBundle` a try. However, in this tutorial we'll go old school and build our own API without any dependencies outside the micro framework we've already installed (for the learning experience and fun).

Let's add support for annotated routes to our app: 

```bash
composer require sensio/framework-extra-bundle
```

We can now create a new `MovieController` with a basic GET route:

```php
src/Controller/MovieController.php:

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

Load `http://localhost:8000/movies` and you should see a status code of 200 OK and a JSON response.

Let's extract a base API controller with some useful methods and make our `MovieController` extend from it:

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
```

```php
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

## Set Up the MySQL Database for Your Symfony App

We'll use a MySQL database for our project (of course, if you prefer PostgreSQL, Sqlite or something else, you can replace it):

```
mysql -uroot -p
CREATE DATABASE bad_puns_counter CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'bpcuser'@'localhost' identified by 'temppass123';
GRANT ALL on bad_puns_counter.* to 'bpcuser'@'localhost';
quit
```

We will install the Doctrine ORM pack and the maker-bundle which can help us generate some code. 

```bash
composer require symfony/orm-pack
composer require symfony/maker-bundle --dev
```

Enter the database connection string using the credentials you just created in the `DATABASE_URL` variable in the `.env` file:

```bash
DATABASE_URL=mysql://bpcuser:temppass123@127.0.0.1:3306/bad_puns_counter
```

Now we can create our `Movie` entity. 

```
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
```

```bash
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

## Implementing the Symfony API

We are ready to create our API endpoints and test them with Postman or a similar tool. We'll skip the proper validation, pagination, rate limiting, advanced security, etc. We'll leave these concerns to more advanced APIs.

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

We'll also add some additional methods to our `ApiController`:

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

Here's the full version of our simple and dirty API controller (in `src/Controllers/MovieController.php` in the server code repository). Make sure your `MovieController.php` matches this now.

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
    * @Route("/movies", methods="GET")
    */
    public function index(MovieRepository $movieRepository)
    {
        $movies = $movieRepository->transformAll();

        return $this->respond($movies);
    }

    /**
    * @Route("/movies", methods="POST")
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
    * @Route("/movies/{id}/count", methods="POST")
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

## Add API Security to Symfony with Okta

Before you proceed, you need to log into your Okta account (or [create a new one for free](https://developer.okta.com/signup/)) and set up a new OIDC app. You'll mostly use the default settings. Make sure to take note of your Okta domain and the Client ID generated for the app.

Here are the step-by-step instructions:

Go to the Applications menu item and click **Add Application**:

{% img blog/symfony-react-php-crud-app/okta-add-app-btn.png alt:"Add Application button" width:"232" %}{: .center-image }

Select **Single Page Application** and click **Next**.

{% img blog/symfony-react-php-crud-app/okta-create-app.png alt:"Create a new Single-Page application" width:"800" %}{: .center-image }

Set a descriptive application name, add `http://localhost:3000/login` as a Login redirect URI, and click **Done**. You can leave the rest of the settings as they are.

Now we'll install the Okta dependencies and add an authorization method to our API Controller. Don't forget to replace the Okta parameters with your own values!

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

We also need to secure our controller methods. Instead of using the security firewall of Symfony and extracting our authorization code into a custom provider, or using `before` filters for token authentication, we'll simply add a check to the start of all `MoviesController` methods that require authorization (we only have a few of them after all - `index()`, `create()`, `increaseCount()`):

```php
if (! $this->isAuthorized()) {
    return $this->respondUnauthorized();
}
```

Make sure you've replaced the placeholder client ID and Okta URL with your own above!

This isn't very DRY of course but it's OK for our application. 

## Set Up the React Frontend

We can now proceed with the frontend. We'll add a CORS bundle so our API will be available to our client app:

```bash
# (server app directory)
composer require nelmio/cors-bundle
```

We'll install `react-create-app` globally and bootstrap our application:

```bash
npm install --global create-react-app
npx create-react-app bad-puns-tracker-client-react
```

We will also install the dependencies we will need (React Router, Semantic UI React, Okta React):

```bash
cd bad-puns-tracker-client-react
npm install react-router-dom semantic-ui-react
npm install @okta/okta-react --save
```

We will run our app now and should see the default React application when we load `http://localhost:3000`:

```bash
npm start
```

## Add Routing and Okta Authentication to the React Frontend

We will start with a bare-bones React application. We will delete everything from the `/src` folder except `index.js` and `App.js`, and we will modify them like this:

```jsx
// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

```jsx
// src/App.js

import React, { Component } from 'react';

class App extends Component {
    render() {
        return (
            <div>
                App
            </div>
        );
    }
}

export default App;
```

React doesn't get more basic than that. Next we'll add a Navbar using Semantic UI, a Router with two simple routes: Home (not secure) and Movies (secure), we'll integrate Okta authentication and we'll implement Login/Logout buttons. We'll use the [Okta Authentication Quick Start Guide for React](/quickstart/#/react/nodejs/generic).

```html
public/index.html

Add:
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css">
```

```jsx
// src/Home.js

import React, { Component } from 'react';

class Home extends Component {
    render() {
        return <div>Home page</div>
    }
}

export default Home
```

```jsx
// src/Movies.js

import React, { Component } from 'react';

class Movies extends Component {
    render() {
        return <div>Movies page</div>
    }
}

export default Movies
```

```jsx
// src/Navbar.js

import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';

import { Container, Menu } from 'semantic-ui-react';

export default withAuth(class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = { authenticated: null };
        this.checkAuthentication = this.checkAuthentication.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    async componentDidMount() {
        this.checkAuthentication();
    }

    async componentDidUpdate() {
        this.checkAuthentication();
    }

    async login() {
        this.props.auth.login('/');
    }

    async logout() {
        this.props.auth.logout('/');
    }

    async checkAuthentication() {
        const authenticated = await this.props.auth.isAuthenticated();
        if (authenticated !== this.state.authenticated) {
            this.setState({ authenticated });
        }
    }

    render() {
        return (
            <div>
                <Menu fixed="top" inverted>
                    <Container>
                        <Menu.Item as="a" header href="/">
                            Okta-React Sample Project
                        </Menu.Item>
                        {this.state.authenticated === true && <Menu.Item id="movies-button" as="a" href="/movies">Movies</Menu.Item>}
                        {this.state.authenticated === true && <Menu.Item id="logout-button" as="a" onClick={this.logout}>Logout</Menu.Item>}
                        {this.state.authenticated === false && <Menu.Item as="a" onClick={this.login}>Login</Menu.Item>}
                    </Container>
                </Menu>
            </div>
        );
    }
});
```

{% raw %}
```jsx
// src/App.js

import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';

import Navbar from './Navbar';
import Home from './Home'
import Movies from './Movies'

const config = {
    issuer: 'https://{yourOktaDomain}/oauth2/default',
    redirect_uri: window.location.origin + '/implicit/callback',
    client_id: {yourClientId}
}

class App extends Component {
  render() {
    return (
        <Router>
            <Security issuer={config.issuer}
                   client_id={config.client_id}
                redirect_uri={config.redirect_uri}
            >
            <Navbar />
            <Container text style={{ marginTop: '7em' }}>
                <Route path="/" exact component={Home} />
                <Route path="/implicit/callback" component={ImplicitCallback} />
                <SecureRoute path="/movies" component={Movies} />
            </Container>
        </Security>
      </Router>
    );
  }
}

export default App
```
{% endraw %}

Don't forget to replace the config values for `issuer` and `client_id` with your own!

Now we have a nice navbar with placeholder pages for Home, Movies (only available when logged in), Login or Logout button (depending on the login state) and the login/logout actions work through Okta. Great! Let's add some real features to the app using our backend API.

## Display the List of Movies

We need to get our list of movies from the API and display it as a table on the Movies page. Of course, we also want a "Loading..." message until the API request completes.

We'll define our base API URL in a new `config.js` file:

```js
// src/config.js

export const API_BASE_URL = 'http://localhost:8000';
```

We can now modify our `Movies.js` component so that it looks like the below:

{% raw %}
```jsx
import React, { Component } from 'react';
import { Header, Message, Table } from 'semantic-ui-react';
import { withAuth } from '@okta/okta-react';

import { API_BASE_URL } from './config'

export default withAuth(class Movies extends Component {

    constructor(props) {
        super(props);
        this.state = {
            movies: null,
            isLoading: null
        };
    }

    componentDidMount() {
        this.getMovies();
    }

    async getMovies() {
        if (!this.state.movies) {
            try {
                this.setState({ isLoading: true });
                const accessToken = await this.props.auth.getAccessToken();
                const response = await fetch(API_BASE_URL + '/movies', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const data = await response.json();
                this.setState({ movies: data, isLoading: false});
            } catch (err) {
                this.setState({ isLoading: false });
                console.error(err);
            }
        }
    }

    render() {
        return (
            <div>
                <Header as="h1">My Movies</Header>
                {this.state.isLoading && <Message info header="Loading movies..." />}
                {this.state.movies &&
                    <div>
                        <Table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Bad Puns Count</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.movies.map(
                                    movie => 
                                        <tr id={movie.id} key={movie.id}>
                                            <td>{movie.id}</td>
                                            <td>{movie.title}</td>
                                            <td>{movie.count}</td>
                                            <td>
                                                Increase Count button
                                            </td>
                                        </tr>
                            )}
                            </tbody>
                        </Table>
                    </div>
                }
            </div>
        );
    }
});
```
{% endraw %}

## Add a New Movie Component to Your Symfony + React App

Let's create a new component for the Add Movie form and add it below the table on the Movies page. First, we will modify `Movies.js` to include the form and add a new method which updates the list of movies when a new movie is created:

```jsx
// src/Movies.js

import MovieForm from './MovieForm';

// replace the constructor method
    constructor(props) {
        super(props);
        this.state = {
            movies: null,
            isLoading: null
        };
        this.onAddition = this.onAddition.bind(this);
    }

// add a new method
    onAddition(movie) {
        this.setState({
            movies: [...this.state.movies, movie]
        })
    }

// below the closing </Table> tag in the render() method:
                        <MovieForm onAddition={this.onAddition} />
```

We also need to create a new `MovieForm` component:

```jsx
// src/MovieForm.js

import React, { Component } from 'react';
import { Button, Form, Message } from 'semantic-ui-react'
import { withAuth } from '@okta/okta-react';

import { API_BASE_URL } from './config'

export default withAuth(class MovieForm extends Component {

    constructor (props) {
        super(props);
        this.state = {
            title: '',
            errorMessage: '',
            error: false,
            isLoading: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            title: e.target.value
        })
    }

    async onSubmit(e) {
        e.preventDefault();
        this.setState({
            isLoading: true,
            error: false,
            errorMessage: ''
        });

        const accessToken = await this.props.auth.getAccessToken();
        const response = await fetch(API_BASE_URL + '/movies', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                "title": this.state.title
            })
        });
        const data = await response.json();

        if (data.errors) {
            this.setState({
                isLoading: false,
                error: true,
                errorMessage: data.errors
            });
        } else {
            this.setState({
                title: '',
                isLoading: false,
                error: false,
                errorMessage: ''
            });
            this.props.onAddition(data);
        }
    }

    render() {
        return (
            <Form error={this.state.error} onSubmit={this.onSubmit}>
                <Form.Field error={this.state.error}>
                    <label>Title</label>
                    <input placeholder='enter movie title' value={this.state.title} onChange={this.handleChange}/>
                { this.state.error &&
                <Message
                    error
                    header='Error creating movie'
                    content={this.state.errorMessage}
                />
                }
                </Form.Field>
                <Button type='submit' loading={this.state.isLoading}>Add Movie</Button>
            </Form>
        )
    }
});
```

Great, we can use the form to add some new movies to our collection!

## Increase the Bad Puns Count

The final step is to implement the "Increase Count" button. We'll create a new component for the button and pass the movie id as a prop.

```jsx
// src/Movies.js

import IncreaseCountButton from './IncreaseCountButton';

    constructor(props) {
        super(props);
        this.state = {
            movies: null,
            isLoading: null
        };
        this.onAddition = this.onAddition.bind(this);
        this.onIncrease = this.onIncrease.bind(this);
    }

    onIncrease(data, id) {
        let movies = this.state.movies;
        let movie = movies.find(movie => movie.id === id);
        movie.count = data.count;
        this.setState({
            movies: movies
        })
    }
```

(replacing the "Increase Count button" placeholder text in the table inside the render() method):

```jsx
<IncreaseCountButton onIncrease={this.onIncrease} movieId={movie.id} />
```

```jsx
// src/IncreaseCountButton.js

import React, { Component } from 'react';
import { Form, Button } from 'semantic-ui-react'
import { withAuth } from '@okta/okta-react';

import { API_BASE_URL } from './config'

export default withAuth(class IncreaseCountButton extends Component {

    constructor (props) {
        super(props);
        this.state = {
            id: props.movieId,
            isUpdating: false
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

    async onSubmit(e) {
        e.preventDefault();
        this.setState({
            isUpdating: true
        });

        const accessToken = await this.props.auth.getAccessToken();
        const response = await fetch(API_BASE_URL + '/movies/' + this.state.id + '/count', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        const data = await response.json();

        this.setState({
            isUpdating: false
        });

        if (! data.errors) {
            this.props.onIncrease(data, this.state.id);
        }
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit}>
                <Button type='submit' loading={this.state.isUpdating}>Increase Count</Button>
            </Form>
        )
    }
});
```

The app is fully functional and you can enjoy your bad puns counting now! 

As a next step, you can clean up the React code by extracting the common API-related boilerplate code (retrieving the auth token, sending the Authorization header, sending a request and receiving a response) into a service class. React does not provide dependency injection out of the box (like Angular does, for example) but you can use higher-order component functions to wrap your components and decorate them with the API-related functionality (the approach would be similar to the `withAuth()` decoration applied to `Movies.js`, `MovieForm.js` and `IncreaseCountButton.js`).

You can find the full code here: [https://github.com/oktadeveloper/okta-php-symfony-react-crud-example](https://github.com/oktadeveloper/okta-php-symfony-react-crud-example).

## Learn More About Symfony, React and Okta

If you would like to dig deeper into the topics covered in this article, the following resources are a great starting point:
* [Our React/PHP Quickstart Guide](/quickstart/#/react/php/generic)
* [Build this app with a Vue.js frontend](/blog/2018/06/14/php-crud-app-symfony-vue)
* [Build this app with an Angular 6 frontend](/blog/2018/08/14/php-crud-app-symfony-angular)

If you have any comments or questions, you can leave a message below, visit our [developer forum](https://devforum.okta.com/), or check our Twitter account [@oktadev](https://twitter.com/OktaDev)!
