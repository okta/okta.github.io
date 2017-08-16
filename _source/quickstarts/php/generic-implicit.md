---
layout: quickstart_partial
exampleDescription: PHP Implicit Example
---

## Verifier Library
We have created a JWT verifier library for you to use to help you decode and verify JWT's from OKTA. 

### Install the library

```bash
composer require okta/jwt-verifier
```

## Usage
Using the API for the library is built to only require a few options to be set. Use the following to validate your 
JWT using the SpomkyLabs Jose JWT library
```php
<?php
$jwt = 'eyJhbGciOiJSUzI1Nqd0FfRzh6X0ZsOGlJRnNoUlRuQUkweVUifQ.eyJ2ZXIiOjEsiOiJwaHBAb2t0YS5jb20ifQ.ZGrn4fvIoCq0QdSyA';

$jwtVerifier = (new \Okta\JwtVerifier\JwtVerifierBuilder())
    ->setDiscovery(new \Okta\JwtVerifier\Discovery\Oauth) // This is not needed if using oauth.  The other option is OIDC
    ->setAdaptor(new \Okta\JwtVerifier\Adaptors\SpomkyLabsJose)
    ->setIssuer('https://php.oktapreview.com/oauth2/ausb5jqasde774i490h7')
    ->build();

$jwt = $jwtVerifier->verify($jwt);

dump($jwt); //Returns instance of \Okta\JwtVerifier\JWT

dump($jwt->toJson()); // Returns Claims as JSON Object

dump($jwt->getClaims()); // Returns Claims as they come from the JWT Package used

dump($jwt->getIssuedAt()); // returns Carbon instance of issued at time
dump($jwt->getIssuedAt(false)); // returns timestamp of issued at time

dump($jwt->getExpirationTime()); //returns Carbon instance of Expiration Time
dump($jwt->getExpirationTime(false)); //returns timestamp of Expiration Time
```

### Extra Notes
The library currently validates only the signature based on the issuer and discovery method. We go out and get the 
keys from the meta-data uri. You will need to validate manually the nonce and audience on your own after receiving 
the claims. An example of this is provided.

```php
<?php

$claims = $jwt->getClaims();

if($claims['aud'] != $audience) {
    throw new /Exception('The audience does not match.');
}
```