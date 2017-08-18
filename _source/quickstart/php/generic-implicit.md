---
layout: quickstart_partial
exampleDescription: PHP Implicit Example
---

## Verifier Library
We have created a JWT verifier library to help you decode and verify JWTs from Okta.

### Install the library

```bash
composer require okta/jwt-verifier
```

### Extra libraries to install
You will need to install a couple extra libraries for this to work.  

#### PSR7 Compliant Library
This package will auto-discover most PSR7 compliant libraries to go out and get the keys. The most common library to 
use is the `guzzlehttp/psr7` package.

```bash
composer require guzzlehttp/psr7
```

#### JWT Library
The JWT Verifier has 2 adaptors that are built in. One for `firebase/php-jwt` and one for `spomky-labs/jose`. The 
example assumes that you have installed `firebase/php-jwt`

```bash
composer require firebase/php-jwt
```


## Usage
The library only requires a few options to be set. Use the following to validate your 
JWT using the SpomkyLabs Jose JWT library:
```php
<?php

require __DIR__ . '/vendor/autoload.php';  // This should be adjusted to be the autoload file from your vendor folder.

$jwt = 'eyJhbGciOiJSUzI1Nqd0FfRzh6X0ZsOGlJRnNoUlRuQUkweVUifQ.eyJ2ZXIiOjEsiOiJwaHBAb2t0YS5jb20ifQ.ZGrn4fvIoCq0QdSyA';

try {
    $jwtVerifier = (new \Okta\JwtVerifier\JwtVerifierBuilder())
        ->setDiscovery(new \Okta\JwtVerifier\Discovery\Oauth) // This is not needed if using OAuth 2.0.  The other option is OIDC
        ->setAdaptor(new \Okta\JwtVerifier\Adaptors\FirebasePhpJwt)
        ->setIssuer('https://{yourOktaDomain}.com/oauth2/default')
        ->build();
    
    $jwt = $jwtVerifier->verify($jwt);
    
    var_dump($jwt); // Returns instance of \Okta\JwtVerifier\JWT
    
    var_dump($jwt->toJson()); // Returns Claims as JSON Object
    
    var_dump($jwt->getClaims()); // Returns Claims as they come from the JWT Package used
    
    var_dump($jwt->getIssuedAt()); // Returns Carbon instance of issued at time
    var_dump($jwt->getIssuedAt(false)); // Returns timestamp of issued at time
    
    var_dump($jwt->getExpirationTime()); // Returns Carbon instance of Expiration Time
    var_dump($jwt->getExpirationTime(false)); // Returns timestamp of Expiration Time
} catch(\Exception $e) {
    var_dump($e->getMessage());
}
```

### Extra Notes
The library currently validates the JWT signature based on the issuer and discovery method, based on the keys from the meta-data URI. An exception will be thrown if the JWT contains an invalid signature, is expired, or was issued in the future. You will need to validate manually the nonce and audience on your own after receiving the claims. An example of this is provided below:

```php
<?php

$claims = $jwt->getClaims();

if($claims['nonce'] != $nonce) {
    throw new /Exception('The nonce does not match.');
}

if($claims['aud'] != $audience) {
    throw new /Exception('The audience does not match.');
}
```
