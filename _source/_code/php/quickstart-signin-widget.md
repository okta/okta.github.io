---
layout: software
title: PHP
excerpt: Quickstart guide for using the Okta Sign-In Widget with PHP.
support_email: developers@okta.com
weight: 1
---

# Overview
The Okta Sign-In Widget is a JavaScript widget from Okta that gives you a fully featured and customizable login experience which can be used to authenticate users on any web site.

{% img okta-signin.png alt:"Screenshot of basic Okta Sign-In Widget" %}

# Configuring your Organization
To see the Sign-in Widget in action, you will need:
  - An Okta Developer org, which you can sign-up for here: <https://developer.okta.com/signup/>
  - A client application
  - An authorization server

## Create your application
1. Create a new **Web** application by selecting **Create New Application** from the *Applications* page.
2. Update the **Login Redirect URIs** to include `http://localhost:3000/oauth2-callback.php`.
3. Select **Implicit** under **Grant type allowed**.
4. Press **Done** to redirect back to the *General Settings* of your application.
5. Finally, copy the **Client ID** and **Client Secret**, as it will be needed for the client configuration.

> **Note:** CORS is automatically enabled for the granted login redirect URIs.

## Create an Authorization Server
An authorization server defines your security boundary, for example "staging" or "production". Within each authorization server you can define your own OAuth scopes, claims, and access policies. This allows your apps and APIs to anchor to a central authorization point and leverage the rich identity features of Okta, such as Universal Directory for transforming attributes, adaptive MFA for end-users, analytics, and system log.

Navigate to `https://{yourOktaDomain}.com/oauth2/default` to see if your default authorization server is setup. If not, [follow this setup guide](/docs/how-to/set-up-auth-server.html).

> **Note:** Remember to set the `audience` of the authorization server to point to your app's host. For example, if you are running your PHP application on `http://localhost:3000`, set the `audience` to `http://localhost:3000`.

# PHP Application Set-up
Now that we have all the configuration at Okta done, we can begin setting up our PHP application. There are a couple of different ways to include the sign-in widget in your application. You can use the NPM module by installing `@okta/okta-signin-widget` in your project, or by using the Okta CDN, which is what we'll be using. Once you have the sign-in widget, there's a little bit of configuration you have to do to talk with your new authorization server.

## Installing and Configuring the Sign In Widget
There are 2 files we will require for the sign in widget to work, a JS file and a CSS file. You will also be able to supply a 3rd file from our CDN or supply your own for the theme of the signin widget.

```html
<!-- Latest CDN production Javascript and CSS: 1.13.0 -->
<script
  src="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.13.0/js/okta-sign-in.min.js"
  type="text/javascript"></script>
<link
  href="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.13.0/css/okta-sign-in.min.css"
  type="text/css"
  rel="stylesheet"/>

<!-- Theme file: Customize or replace this file if you want to override our default styles -->
<link
  href="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.13.0/css/okta-theme.css"
  type="text/css"
  rel="stylesheet"/>
```
Add the above to your login page. For our example, we will be using `login.php` as our login page. Also on the login page, we need to add a little bit of configuration for the sign-in widget to work. The first thing is to create an area on the page to give us a target for the widget to be placed.

```html
<div id="okta-login"></div>
```

> This element, a div in our example, should remain empty and can be placed where you would like the sign-in widget to be rendered..

We also need to add a script block to initialize and configure the widget.

```html
<script>
    var orgUrl = 'https://{yourOktaDomain}.com';
    var signIn = new OktaSignIn({
        baseUrl: orgUrl,
        clientId: 'sRmBpCfR3xKyf4goHZhM',
        redirectUri: 'http://localhost:3000/oauth2-callback.php',
        authParams: {
            responseType: 'code',
            issuer: 'https://{yourOktaDomain}.com/oauth2/{authorizationServerId}',
            display: 'page'
        }
    });
    signIn.renderEl(
        {el: '#okta-login'},
        function success(res) {},
        function error(err) {}
    );
</script>
```

| Key                     | Description                                                                                                                                          |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| baseUrl                 | This is your Organization URL in Okta. It will be the URL of the admin pages without the **-admin** for example `https://{yourOktaDomain}.com`   |
| clientId                | The client ID of the Okta application.                                                                                                               |
| redirectUri             | Where we will send the user to once they attempt a login.                                                                                            |
| authParams.responseType | What we want back from a successful login                                                                                                            |
| authParams.issuer       | The issuer of the authorization server. Can be retrieved from **Admin -> Security -> API -> Authorization Servers**                                           |
| authParams.display      | Redirect to the authorization server when an External Identity Provider button is clicked                                                            |

Now we can visit the `login.php` page and see the Sign-In Widget. You should be able to log into your main account. If you have a successful login, you will be redirected to our `oauth2-callback.php` page which is where we will go through the [Authorization Code Flow](https://tools.ietf.org/html/rfc6749#section-1.3.1) to get our `access_token`.

## Responding to a Successful Login.
Next, we exchange the returned authorization code for an `access_token`. In this sample, we will use curl to do the exchange.

```php
$authHeaderSecret = base64_encode($clientId . ':' . $clientSecret);

$query = http_build_query([
    'grant_type' => 'authorization_code',
    'code' => $_GET['code'],
    'redirect_uri' => 'http://localhost:3000/oauth2-callback.php'
]);

$headers = [
    'Authorization: Basic ' . $authHeaderSecret,
    'Accept: application/json',
    'Content-Type: application/x-www-form-urlencoded',
    'Connection: close',
    'Content-Length: 0'
];
$url = 'https://{yourOktaDomain}.com/oauth2/{authorizationServerId}/v1/token?' . $query;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POST, 1);


$output = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if(curl_error($ch))
{
	$httpcode = 500;
}
$decodedOutput = json_decode($output);
```

Now we have the `access_token` which we can use in our cookie to validate the user on future requests.

```php
setcookie('access_token', $decodedOutput->access_token, time() + $decodedOutput->expires_in, '/', "", false, true);
```

## Validating Access Tokens

Okta uses public key cryptography to sign tokens and verify that they are valid.

The resource server must validate the access token before allowing the client to access protected resources.

Access tokens are sensitive and can be misused if intercepted. Transmit them only over HTTPS and only via POST data or within request headers. If you store them on your application, you must store them securely.

An access token must be validated in the following manner:

1. Verify that the `iss` (issuer) claim matches the identifier of your authorization server.
2. Verify that the `aud` (audience) claim is the requested URL.
3. Verify `cid` (client id) claim is your client id.
4. Verify the signature of the access token according to [JWS](https://tools.ietf.org/html/rfc7515) using the algorithm specified in the JWT `alg` header property. Use the public keys provided by Okta via the [Get Keys endpoint](/docs/api/resources/oauth2.html#get-keys).
5. Verify that the expiry time (from the `exp` claim) has not already passed.

```php
if($res->claims['iss'] != 'https://{yourOktaDomain}.com/oauth2/{authorizationServerId}') {
    return $response->withStatus(401);
}

if($res->claims['aud'] != $oidcClientId) {
    return $response->withStatus(401);
}

if($res->claims['exp'] < time()-300) {
    return $response->withStatus(401);
}

```

Step 4 involves downloading the public JWKS from Okta (specified by the `jwks_uri` property in the [authorization server metadata](/docs/api/resources/oauth2.html#retrieve-authorization-server-metadata). The result of this call is a [JSON Web Key](https://tools.ietf.org/html/rfc7517) set.

An `id_token` contains a [public key id](https://tools.ietf.org/html/rfc7517#section-4.5) (`kid`). To verify the signature, we use the [Discovery Document](/docs/api/resources/oidc.html#openid-connect-discovery-document) to find the `jwks_uri`, which will return a list of public keys. It is safe to cache or persist these keys for performance, but Okta rotates them periodically. We strongly recommend dynamically retrieving these keys.

```php
$jwk = null;

 if($kidInCache) {
    $jwk = getKidFromCache($kid);
 }
else {

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://{yourOktaDomain}.com/oauth2/{authorizationServerId}/v1/keys');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);

    $output = curl_exec($ch);

    curl_close($ch);

    $output = json_decode($output);

    foreach ($output->keys as $key) {
        // poormans cache
        storeKidInCache($key->kid, $key);

        $cachedJwks[$key->kid] = $key;
        if ($key->kid == $kid) {
            $jwk = $key;
        }
    }
}
```

Once you have the `JWK` you can now verify the access token. Our example is using the [gree/jose](https://packagist.org/packages/gree/jose) library.

```php
$jwt_string = 'eyJ...';
$jws = JOSE_JWT::decode($jwt_string);
$jws->verify($jwk, 'RS256');
```

Each public key is identified by a `kid` attribute, which corresponds with the `kid` claim in the [Access Token header](/docs/api/resources/oauth2.html#token-authentication-methods).

The access token is signed by an RSA private key, and we publish the future signing key well in advance. However, in an emergency situation you can still stay in sync with Okta's key rotation. Have your application check the `kid`, and if it has changed and the key is missing from the local cache, check the `jwks_uri` value in the [authorization server metadata](/docs/api/resources/oauth2.html#retrieve-authorization-server-metadata) and you can go back to the [jwks uri](/docs/api/resources/oauth2.html#get-keys) to get keys again from Okta

Please note the following:

* For security purposes, Okta automatically rotates keys used to sign the token.
* The current key rotation schedule is four times a year. This schedule can change without notice.
* In case of an emergency, Okta can rotate keys as needed.
* Okta always publishes keys to the JWKS.
* To save the network round trip, your app can cache the JWKS response locally. The standard HTTP caching headers are used and should be respected.
{% beta %}
* The administrator can switch the authorization server key rotation mode to **MANUAL** by [updating the authorization server](/docs/api/resources/oauth2.html#update-authorization-server) and then control when to rotate the keys.
{% endbeta %}

Keys used to sign tokens automatically rotate and should always be resolved dynamically against the published JWKS. Your app can fail if you hardcode public keys in your applications. Be sure to include key rollover in your implementation.

### References

 - [Sign Up For Okta](https://www.okta.com/developer/signup/)
 - [Setting Up Authorization Server](/docs/how-to/set-up-auth-server.html)
 - [Gree/Jose JWK Library](https://github.com/nov/jose-php)
 - [JWS Spec](https://tools.ietf.org/html/rfc7515)
 - [JWT Spec](https://tools.ietf.org/html/rfc7519)
 - [Authorization Code Flow](https://tools.ietf.org/html/rfc6749#section-1.3.1)
