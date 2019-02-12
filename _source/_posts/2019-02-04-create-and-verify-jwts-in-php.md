---
layout: blog_post
title: 'Create and Verify JWTs in PHP with OAuth 2.0'
author: krasimir
description: "Learn how to create and verify JWTs in PHP and how to use them with OAuth 2.0"
tags: [jwt, oauth, php]
tweets:
  - "JWTs + PHP = 🎂"
  - "Learn how to create JWTs in PHP!"
image: blog/featured/okta-php-headphones.jpg
---

JSON Web Tokens (JWTs) allow you to implement stateless authentication (without the use of server-side sessions). JWTs are digitally signed with a secret key and can contain various information about the user: identity, role, permissions, etc in JSON format. This information is simply encoded and not encrypted. However, because of the digital signature, the payload cannot be modified without access to the secret key.

JWTs are a relatively hot topic as they are widely used (especially in single-page applications and REST APIs) but many developers do not understand them very well. In this post, I'll discuss what JWTs are, what problems they solve, how they work, and how to use them securely. Then I'll walk you through the process of creating and verifying JWTs from scratch with PHP (and without any external libraries). Finally, I'll show you how to use Okta's JWT library to handle validation of Okta JWTs automatically. Okta is an API service that allows you to create, edit, and securely store user accounts and user account data, and connect them with one or more applications. [Register for a forever-free developer account](https://developer.okta.com/signup/), and when you're done, come back to learn more about JWTs.

## The Big Secret about User Authentication

In the dark old days of the Internet, there was session-based authentication. Users would log in and if the server accepted their credentials, it would create a session for them (in a file, in the database, or in an in-memory key-value datastore like Memcached or Redis). Then the server would send back a cookie containing a `SESSION_ID`. The user's browser would provide the cookie with each subsequent request, and the server would know the user's identity without constantly asking for a username and a password. 

This approach has some drawbacks: for example, if you want to scale horizontally you would need a central storage system for the sessions, which is a single point of failure. However, let me tell you a big secret: sessions worked in the past, and they still work just fine for the majority of use cases. If all you have is a simple website, where users register, then log in, then click around and do some stuff, server-side sessions are perfect. All modern Web frameworks still operate this way by default. You can even have all the cryptographic benefits of JWTs with simple sessions if you're interested in that.

However, JWTs make a lot of sense if you're building API services that support machine-to-machine or client-server communication (like single-page applications, or mobile applications). They also make sense if more than two parties are involved in a request, or if you're implementing single sign-on/federated login systems.

## How JWTs Work

The authentication system must provide a login endpoint. Users send their credentials to the login system (which can be a third-party sign on). After a successful login, the server creates a JWT and sends it to the client. The client application must store this JWT and pass it with each subsequent API call. The server can use the JWT to verify that the API call is coming from an authorized user. The authentication system is able to verify the integrity of the JWT and its payload with the secret key only (without any calls to a database or network operations).

JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA or ECDSA.

It is extremely important to understand that JWTs do not hide or obscure the data they hold. The payload is trivially encoded and not encrypted, and the user can read it (so do not store anything sensitive there). Only the signature is encrypted and can be used by the authentication server to verify that the information in the token has not been modified.

## Store and Use JWTs Securely

The client application should store the JWT and send it with every request to the API. If the token is stolen, a malicious third party can impersonate the legitimate user for as long as the token is valid. Therefore, it's crucial to take all possible measures to keep the token secure.

There are two standard ways to store the token: in the local/session storage of the browser, or in a cookie. Here are the main risks and considerations when deciding which option to choose:

Man in the middle attacks – you need to make sure that the application only works over https so it's not possible to sniff the token by intercepting the traffic (e.g. in a public wi-fi network).

Cross-Site Scripting (injecting of JavaScript, XSS) attacks – the local/session storage is accessible through a JavaScript API which makes it vulnerable to XSS attacks (if a hacker can perform a successful XSS attack which allows them to run their own JavaScript inside the target's browser when visiting your website, the local/session storage is compromised along with all tokens in it). It's not always trivial to secure a site completely against XSS attacks, especially if the site is based on user-generated content. Therefore it's usually preferable to store the token in a cookie.

Cross-Site Request Forgery (CSRF) attacks – setting a https-only flag for the cookie eliminates the risk of XSS attacks or man-in-the-middle attacks (because these cookies are not available to JavaScript, or over non-secure connections). You still need to handle the risk of CSRF though. There are different ways to do it – one particularly effective option is to use the `SameSite=Strict` cookie attribute. Most modern Web application frameworks also include some default way to deal with CSRF.

There is one last topic I'd like to discuss about JWTs security – how to revoke a user's access (for example, a user notifies you that their token is compromised, so you want to force them to login again, or a user is banned from your website and you want to restrict their access immediately). 

There is no easy answer because of the stateless nature of JWTs – they are self-sufficient and (theoretically) should include all necessary information about a user's permissions without consulting external resources. This means that you cannot force them to expire, so you must keep their expiration time short (15 to 60 minutes usually, and use refresh tokens which are tracked on the server side and verified for validity before re-issuing an access token). If you absolutely must be able to kick users immediately, then you have to track each access token at the backend and verify it's not blacklisted on every request – but this approach loses the main benefit of JWTs (stateless authentication) and you're back to a solution that's dangerously close to server-side sessions.

To summarize, here's the secure way to handle JWTs:

* Sign your tokens with a strong key, and keep their expiration times low.
* Store them in https-only cookies.
* Use the `SameSite=strict` cookie attribute if it doesn't affect your application's functionality.
* Use your Web application framework's default way of dealing with CSRF if `SameSite=strict` is not an option for you.
* Build your own CSRF token and backend code to verify each form request if you're unlucky enough to use a framework that doesn't handle CSRF out of the box.
* Always verify the signature on the server side before you trust any information in the JWT.

## The Structure of a JWT

Let's get down to the nitty-gritty details of handling JWTs now. The definition:

"A JSON Web Token (JWT) is a JSON object that is defined in RFC 7519 as a safe way to represent a set of information between two parties. The token is composed of a header, a payload, and a signature."

So a JWT is just a string in this format:

```
header.payload.signature
```

The header component of the JWT contains information about how the JWT signature should be computed.

The payload component of the JWT is the information about the user that's stored inside the JWT (also referred to as 'claims' of the JWT).

The signature is computed like this:

```
data = base64urlEncode(header) + "." + base64urlEncode(payload)
hashedData = hash(data, secret)
signature = base64urlEncode(hashedData)
```

The secret must only be known by the authentication server (and the application server that provides the API, if it's different from the authentication server).

## Create and Validate JWTs From Scratch with PHP

We'll start a new PHP project by creating a `/src` directory and a simple `composer.json` file with just one dependency (for now): the DotEnv library which will allow us to keep our secret key in a `.env` file outside our code repository:

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

`.gitignore`

```
/vendor
.env
```

Next, we'll create a `.env.example` file with one variable: `SECRET` to hold our secret key (used when generating and verifying JWTs):

`.env.example`

```
SECRET=
```

and we'll copy `.env.example` to `.env` where we'll fill in our actual secret key (it will be ignored by Git so it won't end up in our repository).

We'll need a `bootstrap.php` file which loads our environment variables (later it will also do some additional bootstrapping for our project).

`bootstrap.php`

```php
<?php
require 'vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = new DotEnv(__DIR__);
$dotenv->load();
```

Let's create a simple tool `generate_key.php` which will generate a secret key for us, so we can put it in the `.env` file:

`generate_key.php`

```php
<?php

$secret = bin2hex(random_bytes(32));
echo "Secret:\n";
echo $secret;
echo "\nCopy this key to the .env file like this:\n";
echo "SECRET=" . $secret . "\n";
```

If you run it in the command line, you should get an output like this:

```php
$ php generate_key.php


Secret:
7c32d31dbdd39f2111da0b1dea59e94f3ed715fd8cdf0ca3ecf354ca1a2e3e30
Copy this key to the .env file like this:
SECRET=7c32d31dbdd39f2111da0b1dea59e94f3ed715fd8cdf0ca3ecf354ca1a2e3e30
```

Follow the instructions and add your secret key to the `.env` file (don't worry, the key in the example above is not used anywhere).

Next we'll build a tool to generate example JWTs (with a hardcoded payload that you can modify as you wish). First we'll add a `base64UrlEncode()` function to our `bootstrap.php` file:

`bootstrap.php`

```php
<?php
require 'vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = new DotEnv(__DIR__);
$dotenv->load();

// PHP has no base64UrlEncode function, so let's define one that
// does some magic by replacing + with -, / with _ and = with ''.
// This way we can pass the string within URLs without
// any URL encoding.
function base64UrlEncode($text)
{
    return str_replace(
        ['+', '/', '='],
        ['-', '_', ''],
        base64_encode($text)
    );
}
```

Here's the `generate_jwt.php` tool:

`generate_jwt.php`

```php
<?php
require 'bootstrap.php';

// get the local secret key
$secret = getenv('SECRET');

// Create the token header
$header = json_encode([
    'typ' => 'JWT',
    'alg' => 'HS256'
]);

// Create the token payload
$payload = json_encode([
    'user_id' => 1,
    'role' => 'admin',
    'exp' => 1593828222
]);

// Encode Header
$base64UrlHeader = base64UrlEncode($header);

// Encode Payload
$base64UrlPayload = base64UrlEncode($payload);

// Create Signature Hash
$signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);

// Encode Signature to Base64Url String
$base64UrlSignature = base64UrlEncode($signature);

// Create JWT
$jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;

echo "Your token:\n" . $jwt . "\n";
?>
```

You can run the tool from the command line to get an output like this:

```
$ php generate_jwt.php
Your token:
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE1OTM4MjgyMjJ9.XDGnRBphMkjjAEjw0fF7_w2oRODEI3rUhzwd2GqmE7I
```

You can then inspect the token at https://jsonwebtoken.io to see the header and payload and confirm they match the example.

The next tool we'll build will allow you to validate JWTs created by the `generate_jwt` tool (by verifying the expiration time and the signature). We'll use Carbon to help us with the expiration time calculations so let's add the library:

```bash
composer require nesbot/carbon
```

Here's the validation script:

`validate_jwt.php`

```php
<?php
require 'bootstrap.php';
use Carbon\Carbon;

// get the local secret key
$secret = getenv('SECRET');

if (! isset($argv[1])) {
    exit('Please provide a key to verify');
}

$jwt = $argv[1];

// split the token
$tokenParts = explode('.', $jwt);
$header = base64_decode($tokenParts[0]);
$payload = base64_decode($tokenParts[1]);
$signatureProvided = $tokenParts[2];

// check the expiration time - note this will cause an error if there is no 'exp' claim in the token
$expiration = Carbon::createFromTimestamp(json_decode($payload)->exp);
$tokenExpired = (Carbon::now()->diffInSeconds($expiration, false) < 0);

// build a signature based on the header and payload using the secret
$base64UrlHeader = base64UrlEncode($header);
$base64UrlPayload = base64UrlEncode($payload);
$signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
$base64UrlSignature = base64UrlEncode($signature);

// verify it matches the signature provided in the token
$signatureValid = ($base64UrlSignature === $signatureProvided);

echo "Header:\n" . $header . "\n";
echo "Payload:\n" . $payload . "\n";

if ($tokenExpired) {
    echo "Token has expired.\n";
} else {
    echo "Token has not expired yet.\n";
}

if ($signatureValid) {
    echo "The signature is valid.\n";
} else {
    echo "The signature is NOT valid\n";
}
?>
```

If you want to validate a JWT, you can supply it through the command line:

```
$ php validate_jwt.php eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE1OTM4MjgyMjJ9.XDGnRBphMkjjAEjw0fF7_w2oRODEI3rUhzwd2GqmE7I
```

You should get an output like this:

```
Header:
{"typ":"JWT","alg":"HS256"}
Payload:
{"user_id":1,"role":"admin","exp":1593828222}
Token has not expired yet.
The signature is valid.
```

You can experiment by changing the expiration time of the token, changing the secret key between generating and validating the token, modifying the payload without re-generating the signature, etc.

That's all there is to building and validating JWTs. Of course, you'll rarely have to do it on your own as there are many libraries for this purpose.

## Use JWTs for Access Tokens in PHP

Okta uses JWT access tokens for its implementation of Oauth 2.0. They are signed using private JSON Web Keys (JWK).

The high-level overview of validating an access token looks like this:

* Retrieve and parse your Okta JSON Web Keys (JWK), which should be checked periodically and cached by your application
* Decode the access token, which is in JSON Web Token format
* Verify the signature used to sign the access token
* Verify the claims found inside the access token

Okta provides a library (Okta JWT Verifier) for PHP which can be integrated into any PHP project to provide seamless verification of Okta access tokens.

## How JWT Verifier Works

The Okta JWT Verifier can be installed through composer:

```
composer require okta/jwt-verifier
```

The library requires a JWT library and a PSR-7 compliant library. You can install an existing one like this:

```
composer require spomky-labs/jose guzzlehttp/psr7
```

Alternatively, you can also provide your own implementation. To create your own adaptor, just implement the `Okta/JwtVerifier/Adaptors/Adaptor` in your own class.

## Learn More About PHP, JWTs, and Secure Authentication

You can find the whole code example here: [GitHub link](https://github.com/oktadeveloper/okta-php-core-jwt-example)

If you would like to dig deeper into the topics covered in this article, the following resources are a great starting point:

* [Validating Access Tokens](https://developer.okta.com/authentication-guide/tokens/validating-access-tokens)
* [Get Started with PHP + Okta](https://developer.okta.com/code/php/)
* [Okta JWT Verifier library](https://github.com/okta/okta-jwt-verifier-php)
* [What Happens if your JWT is Stolen?](https://developer.okta.com/blog/2018/06/20/what-happens-if-your-jwt-is-stolen)
* [Add Authentication to your PHP App in 5 Minutes](https://developer.okta.com/blog/2018/07/09/five-minute-php-app-auth)

Like what you learned today? Follow us on [Twitter](https://twitter.com/oktadev), like us on [Facebook](https://www.facebook.com/oktadevelopers), check us out on [LinkedIn](https://www.linkedin.com/company/oktadev/), and subscribe to our [YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q) for more awesome content!
