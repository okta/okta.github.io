---
layout: blog_post
title: 'Build Simple Login in PHP'
author: krasimir
description: "In this tutorial, you'll learn how to build a React app using a Laravel API to store its data."
tags: [crud, react, php, laravel]
tweets:
  - "Are you looking to get started with React and Laravel? If so, this tutorial is for you!"
  - "This tutorial shows you how to build an React app with a Laravel backend, complete with authentication!"
image: blog/featured/okta-php-headphones.jpg
---

Building a user authentication system for your Web application from scratch can be a deceptively tricky job. It seems easy at first, but there are so many details you have to consider - hashing the passwords properly, securing the user sessions, providing a way to reset forgotten passwords. Most modern frameworks offer boilerplate code for dealing with all of these issues but even if you're not using a framework, do not despair. In this article, I'll show you how to build a PHP application from scratch (with just a single dependence on an external library - DotEnv, so we can store our secrets in a .env file outside the code repository). The application will provide user login/logout, new user registration, and a 'Forgot Password' form by taking advantage of Okta's simple OAuth 2.0 API.

All you'll need to follow the tutorial is an Okta developer account ([you can create one for free](https://developer.okta.com/signup/)), PHP and Composer.

## Why Use Okta for Authentication?

Okta makes [identity management](https://developer.okta.com/product/user-management/) easier, more secure, and more scalable than what you're used to. Okta is an API service that allows you to create, edit, and securely store user accounts and user account data, and connect them with one or more applications. Our API enables you to:

* [Authenticate](https://developer.okta.com/product/authentication/) and [authorize](https://developer.okta.com/product/authorization/) your users
* Store data about your users
* Perform password-based and [social login](https://developer.okta.com/authentication-guide/social-login/)
* Secure your application with [multi-factor authentication](https://developer.okta.com/use_cases/mfa/)
* And much more! Check out our [product documentation](https://developer.okta.com/documentation/) for more information

[Register for a forever-free developer account](https://developer.okta.com/signup/), and when you're done, come back to learn more about building a PHP application with user authentication from scratch.

## Create a Free Okta Developer Account
Before you proceed, you need to log into your Okta account (or [create a new one for free](https://developer.okta.com/signup/)) and create an OAuth application. You'll need to get a client ID and a client secret for your application, and you'll also need an API token so the application can register users remotely.

Here are the step-by-step instructions:

1. Go to the Applications menu item and click the 'Add Application' button:

{% img blog/php-simple-login/add-application.png width:"200" alt:"Click Add Application" %}{: .center-image }

2. Select **Web** and click **Next**.

{% img blog/php-simple-login/create-new-application.png alt:"Create a new Web application" %}{: .center-image }

3. Enter a title, and set http://localhost:8080/ as both the Base URI and Login Redirect URI, then click Done. You can leave the rest of the settings as they are:

{% img blog/php-simple-login/application-settings.png width:"800" alt:"Application Settings" %}{: .center-image }

4. Copy the Client ID and Client Secret from the application settings.

5. Go to **API** > **Tokens**, and click **Create Token**:

{% img blog/php-simple-login/create-token.png width:"800" alt:"Create a Token" %}{: .center-image }

Enter a title for your token and make sure to copy the value of the token and store it safely. You will only be able to see it once - if you lose it, you'll need to create a new token.

Take note of your main organization URL (it looks like https://{yourOktaDomain}) - you will need this as well.

## Create the Project Skeleton

Start by creating a /src directory and a simple `composer.json` file in the top directory with just one dependency: the DotEnv library which will allow us to keep our Okta authentication details in a `.env` file outside our code repository:

`composer.json`

```json
{
    "require": {
        "vlucas/phpdotenv": "^2.4"
    },
    "autoload": {
        "psr-4": {
            "Src\\": "src/"
        }
    }
}
```

We've also configured a PSR-4 autoloader which will automatically look for PHP classes in the `/src` directory.

We can install our dependencies now:

```bash
composer install
```

We have a `/vendor` directory, and the DotEnv dependency is installed (we can also use our autoloader to load our classes from `/src` with no `include()` calls).

Let's create a `.gitignore` file for our project with two lines in it, so the `/vendor` directory and our local `.env` file will be ignored:

```
/vendor
.env
```

Next we'll create a `.env.example` file for our Okta authentication variables:

```
CLIENT_ID=
CLIENT_SECRET=
REDIRECT_URI=http://localhost:8080/
METADATA_URL=https://{yourOktaDomain}/oauth2/default/.well-known/oauth-authorization-server
API_URL_BASE=https://{yourOktaDomain}/api/v1/
API_TOKEN=
```

and a `.env` file where we'll fill in our actual details from our Okta account (it will be ignored by Git so it won't end up in our repository).

The project will have the following directory structure (you can create the rest of the files now):

```
/public/index.php 
/src
    /controllers
    /services
    /views
bootstrap.php
.env
.env.example
```

The `/public/index.php` file is our simple front controller. It loads the `bootstrap.php` script and then handles the incoming HTTP request, delegating it to a controller. Here's the initial version:

`/public/index.php`

```php
<?php
require('../bootstrap.php');

// view data
$data = null;

view('home', $data);
```

Right now, it simply loads the 'home' view with no data.

The `bootstrap.php` script starts the autoloading, initializes our dependencies (only DotEnv in this case), starts a session and provides the helper function `view()` used to load view files (we already used it in `/public/index.php`). Here's the full version of the `bootstrap.php` file:

`bootstrap.php`

```php
<?php
require 'vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = new DotEnv(__DIR__);
$dotenv->load();

session_start();

function view($title, $data = null)
{
    $filename = __DIR__ . '/src/views/' . $title . '.php';
    if (file_exists($filename)) {
        include($filename);
    } else {
        throw new Exception('View ' . $title . ' not found!');
    }
}
```

The `/src/controllers` directory holds our controller classes. The `/src/services` directory holds the classes of our service layer. The `/src/views` directory holds our views (we use simple PHP views in this project, without a templating system).

Let's start building the views:

`/src/views/home.php`

```php
<?php view('header', $data); ?>
<section class="hero">
    <div class="hero-body">
        <div class="container">

<?php
    if (isset($data['thank_you'])) {
?>
<div class="notification is-info">
<?php
    echo $data['thank_you'];
?>  
</div>
<?php
    }
?>

<?php
    if (isset($data['loginError'])) {
?>
<div class="notification is-danger">
<?php
    echo $data['loginError'];
?>
</div>
<?php
    }
?>

<?php
    if (isset($_SESSION['username'])) {
?>
            <p class="subtitle is-4">
            This is some great content for logged in users
            <p>
<?php 
    } else {
?>
            <p class="subtitle is-4">
            You need to login to access the content!
            </p>
<?php
    }
?>
        </div>
    </div>
</section>
<?php view('footer'); ?>
```

The Home page view loads a header and a footer, and it has the capability to display notification messages and error messages. It also shows different content depending on if the user is logged in (determined by checking `$_SESSION['username']`) or not.

Here are the full version of the header and the footer views:

`/src/views/header.php`

```php
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="PHP Login App bd-index-custom-example">
        <title>Core PHP + Okta Login Example </title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.2/css/bulma.min.css">
    </head>
    <body class="layout-default">
        <nav id="navbar" class="navbar has-shadow is-spaced">
            <div class="container">
            <div class="content">
                <h1>Core PHP + Okta Login Example</h1>
                <?php
                    if (isset($_SESSION['username'])) {
                ?>
                        <p>
                            Logged in as <?php echo $_SESSION['username'] ?>
                        </p>
                        <p><a href="/?logout">Log Out</a></p>
                <?php 
                    } else {
                ?>
                        <p>Not logged in</p>
                        <p><a href="/?login">Log In</a> | <a href="/?forgot">Forgot Password</a> | <a href="/?register">Register</a></p>
                <?php
                    }
                ?>
            </div>
            </div>
        </nav>
```

```
/src/views/footer.php

   </body>
</html>
```

The header loads the Bulma CSS framework and shows the username plus a logout link if there is a logged in user, or Login/Forgot Password/Register links if there is no logged in user.

Start the built-in PHP server:

```bash
php -S 127.0.0.1:8080 -t public
```

When you load http://localhost:8080, you should see the app:

{% img blog/php-simple-login/app.png width:"800" alt:"The application running" %}{: .center-image }

## Implement Okta Login / Logout

The Okta login happens in several stages:

1. Build a login URL
2. Redirect to the URL
3. Okta authentication happens remotely and then redirects back to our Redirect URI
4. Handle the response and authorize the user in our app.

We'll modify `public/index.php` to handling steps 1 and 2 above, adding this above the line `view('home');`:

```php
// build login URL and redirect the user
if (isset($_REQUEST['login']) && (! isset($_SESSION['username']))) {
    $_SESSION['state'] = bin2hex(random_bytes(5));
    $authorizeUrl = $oktaApi->buildAuthorizeUrl($_SESSION['state']);
    header('Location: ' . $authorizeUrl);
    die();
}
```

and also to handle step 4 when it receives the redirect back (which includes a code from Okta):

```php
if (isset($_GET['code'])) {
    $result = $oktaApi->authorizeUser();
    if (isset($result['error'])) {
        $data['loginError'] = $result['errorMessage'];
    }
}
```

We'll also add a very simple Logout handler which just unsets the session variable `username`. 

Here's the new version:

`/public/index.php`

```php
<?php
require('../bootstrap.php');

use Src\Services\OktaApiService;

$oktaApi = new OktaApiService;

// view data
$data = null;

// build login URL and redirect the user
if (isset($_REQUEST['login']) && (! isset($_SESSION['username']))) {
    $_SESSION['state'] = bin2hex(random_bytes(5));
    $authorizeUrl = $oktaApi->buildAuthorizeUrl($_SESSION['state']);
    header('Location: ' . $authorizeUrl);
    die();
}

// handle the redirect back
if (isset($_GET['code'])) {
    $result = $oktaApi->authorizeUser();
    if (isset($result['error'])) {
        $data['loginError'] = $result['errorMessage'];
    }
}

if (isset($_REQUEST['logout'])) {
    unset($_SESSION['username']);
    header('Location: /');
    die();
}

view('home', $data);
```

Let's also build the `OktaApiService` and add the methods we need (`buildAuthorizeUrl()` and `authorizeUser()`):

`/src/services/OktaApiService.php`

```php
<?php
namespace Src\Services;

class OktaApiService
{
    private $clientId;
    private $clientSecret;
    private $redirectUri;
    private $metadataUrl;
    private $apiToken;
    private $apiUrlBase;

    public function __construct()
    {
        $this->clientId     = getenv('CLIENT_ID');
        $this->clientSecret = getenv('CLIENT_SECRET');
        $this->redirectUri  = getenv('REDIRECT_URI');
        $this->metadataUrl  = getenv('METADATA_URL');
        $this->apiToken     = getenv('API_TOKEN');
        $this->apiUrlBase   = getenv('API_URL_BASE');
    }

    public function buildAuthorizeUrl($state)
    {
        $metadata = $this->httpRequest($this->metadataUrl);
        $url = $metadata->authorization_endpoint . '?' . http_build_query([
            'response_type' => 'code',
            'client_id' => $this->clientId,
            'redirect_uri' => $this->redirectUri,
            'state' => $state,
        ]);
        return $url;
    }

    public function authorizeUser()
    {
        if ($_SESSION['state'] != $_GET['state']) {
            $result['error'] = true;
            $result['errorMessage'] = 'Authorization server returned an invalid state parameter';
            return $result;
        }

        if (isset($_GET['error'])) {
            $result['error'] = true;
            $result['errorMessage'] = 'Authorization server returned an error: '.htmlspecialchars($_GET['error']);
            return $result;
        }

        $metadata = $this->httpRequest($this->metadataUrl);

        $response = $this->httpRequest($metadata->token_endpoint, [
            'grant_type' => 'authorization_code',
            'code' => $_GET['code'],
            'redirect_uri' => $this->redirectUri,
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret
        ]);

        if (! isset($response->access_token)) {
            $result['error'] = true;
            $result['errorMessage'] = 'Error fetching access token!';
            return $result;
        }
        $_SESSION['access_token'] = $response->access_token;

        $token = $this->httpRequest($metadata->introspection_endpoint, [
            'token' => $response->access_token,
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret
        ]);

        if ($token->active == 1) {
            $_SESSION['username'] = $token->username;
            $result['success'] = true;
            return $result;
        }
    }

    private function httpRequest($url, $params = null)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        if ($params) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
        }
        return json_decode(curl_exec($ch));
    }
}
```

Quite a few things happen in the `OktaApiService` class, so let me explain the process:

Before building the authorization URL, we generate a random `state` value which we use to verify the response:

```php
$_SESSION['state'] = bin2hex(random_bytes(5));
$authorizeUrl = $oktaApi->buildAuthorizeUrl($_SESSION['state']);
```

The method `buildAuthorizeUrl()` uses a call to the metadata URL to get the authorization endpoint for our server, and then it builds a query for that endpoint:

```php
       $metadata = $this->httpRequest($this->metadataUrl);
        $url = $metadata->authorization_endpoint . '?' . http_build_query([
            'response_type' => 'code',
            'client_id' => $this->clientId,
            'redirect_uri' => $this->redirectUri,
            'state' => $state,
        ]);
```

When we get the redirect back, we receive the state variable that we sent with the authorization redirect and a code from Okta. When we get a code, we call the `authorizeUser()` method where we first verify that the state value matches and there's no error code in the response:

```php
       if ($_SESSION['state'] != $_GET['state']) {
            $result['error'] = true;
            $result['errorMessage'] = 'Authorization server returned an invalid state parameter';
            return $result;
        }

        if (isset($_GET['error'])) {
            $result['error'] = true;
            $result['errorMessage'] = 'Authorization server returned an error: '.htmlspecialchars($_GET['error']);
            return $result;
        }
```

Then we use the `token_endpoint` (from the metadata call) to exchange the code for an access token:

```php
       $metadata = $this->httpRequest($this->metadataUrl);

        $response = $this->httpRequest($metadata->token_endpoint, [
            'grant_type' => 'authorization_code',
            'code' => $_GET['code'],
            'redirect_uri' => $this->redirectUri,
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret
        ]);

        if (! isset($response->access_token)) {
            $result['error'] = true;
            $result['errorMessage'] = 'Error fetching access token!';
            return $result;
        }
        $_SESSION['access_token'] = $response->access_token;
```

After that, we use the introspection endpoint to confirm the token is valid and active, and to get the username of the newly authorized user:

```php
       $token = $this->httpRequest($metadata->introspection_endpoint, [
            'token' => $response->access_token,
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret
        ]);

        if ($token->active == 1) {
            $_SESSION['username'] = $token->username;
            $result['success'] = true;
            return $result;
        }
```

## New User Registration Through the Okta API

The new user registration will be handled in a `UserController` class. We'll need three handlers in the front controller:

`public/index.php`

```php
...
use Src\Controllers\UserController;
...
$userController = new UserController($oktaApi);
...
if (isset($_REQUEST['register'])) {
    view('register');
    die();
}

if (isset($_REQUEST['command']) && ($_REQUEST['command'] == 'register')) {
    $userController->handleRegistrationPost();
    die();
}

if (isset($_REQUEST['thankyou'])) {
    $data['thank_you'] = 'Thank you for your registration!';
}
...
```

The first handler simply loads the `register` view when the **Register** link is clicked:

`/src/views/register.php`

```
<?php view('header', $data); ?>
<section class="hero">
    <div class="hero-body">
        <div class="container">
            <form method="post" action="/">

<?php
    if ($data && $data['errors']) {
?>
<div class="notification is-danger">
<?php
    echo "Errors:";
    echo $data['errorMessage'];
?>  
</div>
<?php
    }
?>

<div class="field">
    <label class="label">First Name</label>
    <div class="control">
        <input class="input" name="first_name" type="text" value="<?php if ($data) { echo $data['input']['first_name']; } ?>">
    </div>
</div>

<div class="field">
    <label class="label">Last Name</label>
    <div class="control">
        <input class="input" name="last_name" type="text" value="<?php if ($data) { echo $data['input']['last_name']; } ?>">
    </div>
</div>

<div class="field">
    <label class="label">Email</label>
    <div class="control">
        <input class="input" name="email" type="email" value="<?php if ($data) { echo $data['input']['email']; } ?>">
    </div>
</div>

<div class="field">
    <label class="label">Password</label>
    <div class="control">
        <input class="input" name="password" type="password" value="">
    </div>
</div>

<div class="field">
    <label class="label">Repeat Password</label>
    <div class="control">
        <input class="input" name="repeat_password" type="password" value="">
    </div>
</div>

<input type="hidden" name="command" value="register">

<div class="control">
    <button class="button is-link">Register</button>
    <a class="button is-link" href="/">Cancel</a>
</div>

            </form>
        </div>
    </div>
</section>
<?php view('footer'); ?>
```

The second handler delegates to the user controller when the form is submitted:

`/src/controllers/UserController.php`

```php
<?php
namespace Src\Controllers;

use Src\Services\OktaApiService;

class UserController
{

    private $errors = null;
    private $errorMessage = null;

    public function __construct(OktaApiService $oktaApi)
    {
        $this->oktaApi = $oktaApi;
    }

    public function handleRegistrationPost()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $input = [
                'first_name'      => $_POST['first_name'],
                'last_name'       => $_POST['last_name'],
                'email'           => $_POST['email'],
                'password'        => $_POST['password'],
                'repeat_password' => $_POST['repeat_password'],
            ];

            // local form validation
            $this->validateRegistrationForm($input);
            if ($this->errors) {
                $viewData = [
                    'input' => $input,
                    'errors' => $this->errors,
                    'errorMessage' => $this->errorMessage
                ];
                view('register', $viewData);
                return true;
            }

            // if local validation passes, attempt to register the user
            // via the Okta API
            $result = $this->oktaApi->registerUser($input);
            $result = json_decode($result, true);
            if (isset($result['errorCode'])) {
                $viewData = [
                    'input' => $input,
                    'errors' => true,
                    'errorMessage' => '<br>(Okta) ' . $result['errorCauses'][0]['errorSummary']
                ];
                view('register', $viewData);
                return true;
            }

            header('Location: /?thankyou');
            return true;
        }
        
        header('HTTP/1.0 405 Method Not Allowed');
        die();
    }

    private function validateRegistrationForm($input)
    {
        $errorMessage = '';
        $errors = false;

        // validate field lengths
        if (strlen($input['first_name']) > 50) {
            $errorMessage .= "<br>'First Name' is too long (50 characters max)!";
            $errors = true;            
        }
        if (strlen($input['last_name']) > 50) {
            $errorMessage .= "<br>'Last Name' is too long (50 characters max)!";
            $errors = true;            
        }
        if (strlen($input['email']) > 100) {
            $errorMessage .= "<br>'Email' is too long (100 characters max)!";
            $errors = true;            
        }
        if (strlen($input['password']) > 72) {
            $errorMessage .= "<br>'Password' is too long (72 characters max)!";
            $errors = true;            
        }
        if (strlen($input['password']) < 8) {
            $errorMessage .= "<br>'Password' is too short (8 characters min)!";
            $errors = true;            
        }

        // validate field contents
        if (empty($input['first_name'])) {
            $errorMessage .= "<br>'First Name' is required!";
            $errors = true;
        }
        if (empty($input['last_name'])) {
            $errorMessage .= "<br>'Last Name' is required!";
            $errors = true;
        }
        if (empty($input['email'])) {
            $errorMessage .= "<br>'Email' is required!";
            $errors = true;
        } else if (! filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            $errorMessage .= "<br>Invalid email!";
            $errors = true;
        }
        if (empty($input['password'])) {
            $errorMessage .= "<br>'Password' is required!";
            $errors = true;
        }
        if (empty($input['repeat_password'])) {
            $errorMessage .= "<br>'Repeat Password' is required!";
            $errors = true;
        }
        if ($input['password'] !== $input['repeat_password']) {
            $errorMessage .= "<br>Passwords do not match!";
            $errors = true;
        }

        $this->errors = $errors;
        $this->errorMessage = $errorMessage;
    }
}
```

We also need to add a new method `registerUser()` to the `OktaApiService` class:

`/src/services/OktaApiService.php`

```php
...
   public function registerUser($input)
    {
        $data['profile'] = [
            'firstName' => $input['first_name'],
            'lastName'  => $input['last_name'],
            'email'     => $input['email'],
            'login'     => $input['email']
        ];
        $data['credentials'] = [
            'password'  => [
                'value' => $input['password']
            ]
        ];
        $data = json_encode($data);

        $ch = curl_init($this->apiUrlBase . 'users');
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Accept: application/json',
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data),
            'Authorization: SSWS ' . $this->apiToken
        ]);

        return curl_exec($ch);
    }
...
```

The third handler simply shows a message 'Thank you for your registration' on the dashboard after a successful registration.

The form looks like this and the code includes validation and error handling (the screenshot shows the output after submitting an empty form):

{% img blog/php-simple-login/app-validation.png width:"800" alt:"Validation and error handling" %}{: .center-image }

You can see the new users in your Okta admin panel, if you go to **Users** > **People**.

## Forgot Password Through the Okta API

The 'Forgot Password' feature will follow the same pattern:

New handlers in `/public/index.php`:

```php
...

if (isset($_REQUEST['forgot'])) {
    view('forgot');
    die();
}

if (isset($_REQUEST['command']) && ($_REQUEST['command'] == 'forgot_password')) {
    $userController->handleForgotPasswordPost();
    die();
}

if (isset($_REQUEST['password_reset'])) {
    $data['thank_you'] = 'You should receive an email with password reset instructions';
}
...
```

The first handler loads the `forgot` view when the Forgot Password link is clicked:

`/src/views/forgot.php`

```php
<?php view('header', $data); ?>
<section class="hero">
    <div class="hero-body">
        <div class="container">
            <form method="post" action="/">

<?php
    if ($data && $data['errors']) {
?>
<div class="notification is-danger">
<?php
    echo "Errors:";
    echo $data['errorMessage'];
?>
</div>
<?php
    }
?>

<div class="field">
    <label class="label">Email</label>
    <div class="control">
        <input class="input" name="email" type="email" value="<?php if ($data) { echo $data['input']['email']; } ?>">
    </div>
</div>

<input type="hidden" name="command" value="forgot_password">

<div class="control">
    <button class="button is-link">Reset Password</button>
    <a class="button is-link" href="/">Cancel</a>
</div>

            </form>
        </div>
    </div>
</section>
<?php view('footer'); ?>
```

The second handler delegates to the user controller when the form is submitted:

`/src/controllers/UserController.php`

```php
...
   public function handleForgotPasswordPost()
    {
       if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $input = [
                'email' => $_POST['email']
            ];

            // validate the email address
            if (empty($input['email']) ||
                strlen($input['email']) > 100 ||
                (! filter_var($input['email'], FILTER_VALIDATE_EMAIL))) {
                $viewData = [
                    'input' => $input,
                    'errors' => true,
                    'errorMessage' => '<br>Invalid email!'
                ];
                view('forgot', $viewData);
                return true;
            }

            // search for this user via the OktaApi
            $result = $this->oktaApi->findUser($input);
            $result = json_decode($result, true);
            if (! isset($result[0]['id'])) {
                $viewData = [
                    'input' => $input,
                    'errors' => true,
                    'errorMessage' => '<br>User not found!'
                ];
                view('forgot', $viewData);
                return true;
            }

            // attempt to send a reset link to this user
            $userId = $result[0]['id'];
            $result = $this->oktaApi->resetPassword($userId);

            header('Location: /?password_reset');
            return true;
        }

        header('HTTP/1.0 405 Method Not Allowed');
        die();
    }
...
```

The controller users two new methods from the `OktaApiService`: `findUser()` and `resetPassword()`:

`/src/services/OktaApiService.php`

```php
...
   public function findUser($input)
    {
        $url = $this->apiUrlBase . 'users?q=' . urlencode($input['email']) . '&limit=1';
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Accept: application/json',
            'Content-Type: application/json',
            'Authorization: SSWS ' . $this->apiToken
        ]);

        return curl_exec($ch);
    }

    public function resetPassword($userId)
    {
        $url = $this->apiUrlBase . 'users/' . $userId . '/lifecycle/reset_password';

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, []);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Accept: application/json',
            'Content-Type: application/json',
            'Authorization: SSWS ' . $this->apiToken
        ]);

        return curl_exec($ch);
    }
...
```

The third handler shows a message on the dashboard after triggering the reset process.

The application is complete now. You can register new users in your Okta authorization server, authorize them in your Web application, and trigger the 'Reset Password' routine remotely.

## Learn More About PHP and Okta OAuth 2.0

You can find the whole code example here: 
[GitHub link](https://github.com/oktadeveloper/okta-php-core-login-example)

If you would like to dig deeper into the topics covered in this article, the following resources are a great starting point:

* [OAuth 2.0 and OpenID Connect](https://developer.okta.com/authentication-guide/auth-overview/)
* [Okta Users API](https://developer.okta.com/docs/api/resources/users)
* [Build a Basic CRUD App with Laravel and React](/blog/2018/12/06/crud-app-laravel-react)
* [Wordpress Authentication with Okta](/blog/2018/10/30/wordpress-authentication-with-okta)

As always if you have any questions, comments, or concerns about this post feel free to leave a comment below. For other great content from the Okta Dev Team, follow us on Twitter [@OktaDev](https://twitter.com/oktadev), [Facebook](https://www.facebook.com/oktadevelopers), [LinkedIn](https://www.linkedin.com/company/oktadev/) and [YouTube](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q)!
