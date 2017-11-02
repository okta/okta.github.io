---
layout: software
title: Validate Okta JWTs with PHP
language: PHP
excerpt: How to validate Okta JWTs with PHP.
support_email: developers@okta.com
---

# Overview
As a result of a successful authentication by [obtaining an authorization grant from a user](/docs/api/resources/oauth2.html#obtain-an-authorization-grant-from-a-user) 
or using the Okta API, you will be provided with a signed JWT (`id_token` and/or `access_token`). A common use case for 
these access tokens is to use it inside of the Bearer authentication header to let your application know who the user
is that is making the request. In order for you to know this use is valid, you will need to know how to validate the
token against Okta. This guide gives you an example of how to do this using common libraries in PHP for working 
with JWTs. These steps can be adapted for most JWT libraries that you may want to use.
 
## Things you will need
For validating a JWT, you will need a few different items:

1. Your issuer URL
2. The JWT string you want to verify
3. A JWT library, this guide will use [firebase/php-jwt](https://packagist.org/packages/firebase/php-jwt)
4. A package to convert a JWK to a public key.

## Working with Authorization Server Keys
The first thing you will need to do is make a request to get your current keys for your authorization server. The URL for the keys can be discovered by visiting the .well-known endpoint of your authorization server. The .well-known 
endpoint is listed in your authorization server dashboard and looks like 
`https://{yourOktaDomain}.com/oauth2/{authorizationServerId}/.well-known/oauth-authorization-server`

Once you have your .well-known URL, have your application make a request to this endpoint and `json_decode` the results.

```php
$keys = json_decode(file_get_contents('https://{yourOktaDomain}.com/oauth2/{authorizationServerId}/v1/keys'));
```

This will return a JSON object of any keys. Typically, this will return a single key entry, but can return a set of keys. 

### Caching Keys
To avoid any future requests to the keys endpoint, you should cache the keys you receive in response to this 
request. As a guideline, store each key that is returned with the a combination of your Authorization Server id and the `kid`, or just the `kid` as the lookup key in your cache.

```php
foreach($keys as $key) {
$item = $this->cache->getItem($serverId . '-' . $kid);

if(!$item->isHit()) {
    $item->set($key);
    $this->cache->save($item);
} 
```

> Note: If you are not setting TTL for the cache entry, you should make sure to empty out old keys when new ones are added to the cache.

This will allow you to look up the key for a later step. You could also update this to include a TTL if you wanted to make sure you request a fresh set of keys after a set amount of time, but this is not required.

## Validating a JWT
After you have your `access_token` from a successful login, or from the `Bearer token` in the authorization header, you will need to make sure that this is still valid. There are a few steps here to fully validate it.

### Parsing Keys
The keys you have stored in cache, or retrieved from the Authorization Server, need to be converted to an OpenSSL key resource that you can use. This can be done in any way you would like. There are some great libraries [on packagist](https://packagist.org/search/?q=jwk) that can be used for this. Once you have the public key set, you are ready to continue validating the JWT.

```php
$keys = JWK::parseKeySet($authorizationServer->getKeys());
```

> `$authorizationServer` would be a class that gives you access to a method that gets the keys either from cache if they exist already, or makes a request to the keys server. `parseKeySet` is a function that can turn each key from the authorization server into a public key resource.

### Decode a JWT
The JWT will then need to be decoded. In the [Firebase PHP-JWT](https://packagist.org/packages/firebase/php-jwt) library, this is a method that accepts the `jwt`, `key`, and `allowed_algorithms`.

```php
$decoded = \Firebase\JWT\JWT::decode($jwt, $keys, ['RS256']);
```

If the key does not exist in the set of keys you pass, an exception will be thrown letting you know this. At this point, you can:
 - Call the token invalid
 - Go check for any new keys first, then validate again
 - Fail validation

#### Alternate decode to get kid
You can also decode the JWT without key validation to get the headers of the JWT itself. The value of doing this allows you to get the `kid` out of the JWT header. This will allow you to see if the key was cached based on the `kid` from the header, and then decode fully with only passing the single key.


 
### Verifying JWT Claims
There are two different types of JWTs that you may need to verify, and each has its own set of claims to look at as well as some common ones. Use the table below as a guide of what element in the `access_token` or `idToken` corresponds to what you should verify it against.

|            | access_token | id_token | Compare With | Description                                                                                                               |
|------------|--------------|----------|--------------|---------------------------------------------------------------------------------------------------------------------------|
| Issuer     | `iss`        | `iss`    | Issuer URI   | Who issued this token. This will be your Authorization Server URI                                                         |
| Client ID  | `cid`        | `aud`    | ClientID     | The Client ID of the Application                                                                                          |
| Issued At  | `iat`        | `iat`    | time()+300   | Verify that this claim is valid by checking that the token was not issued in the future, with some leeway for clock skew. |
| Expired At | `exp`        | `exp`    | time()-300   | Verify that this claim is valid by checking that the token has not expired, with some leeway for clock skew.              |

> To make sure all machines are able to test this, we set the leeway to 5 minutes. In our research, 5 minutes was 
enough time to prevent most issues in regards to expire time and issued at time.


#### Verify nonce (only when verifying id_token)
To mitigate replay attacks, verify that the `nonce` value in the `id_token` matches the `nonce` that was used when doing the code exchange. This verification is optional, but is highly suggested to verify after the initial code exchange.

```php
if($decoded->claims['nonce'] != $request->getCookieParam('okta-oauth-nonce')) {
    throw new \Exception('Invalid Token: Nonce does not match.')
}
```
 
## Conclusion
The above are the basic steps for verifying an access token locally. The steps are not tied directly to a library, and can be applied to any JWT library you decide to use. We suggest you use either [firebase/php-jwt](https://packagist.org/packages/firebase/php-jwt) or [spomky-labs/jose](https://packagist.org/packages/spomky-labs/jose) as they have great support for this validation.