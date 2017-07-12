---
layout: docs_page
title: Okta Sign-In Widget
excerpt: Quickstart guide for using the Okta Sign-In Widget with PHP.
support_email: developers@okta.com
weight: 1
---

# Overview
The Okta Sign-In Widget is a JavaScript widget from Okta that gives you a fully featured and customizable login experience which can be used to authenticate users on any web site.

{% img okta-signin.png alt:"Screenshot of basic Okta Sign-In Widget" %}

# Configuring your Organization
There are some steps to prepare for the use of the Okta Sign-In Widget. We need to sign up for Okta, set up CORS
and create an authorization server. Use this guide to get up and running with our customizable Okta Sign-In Widget.

## Sign-up for Okta
1. Go to [https://www.okta.com/developer/signup/]() and complete the form.
2. After submitting the form, you are presented with your Okta URL. Make note of this URL, you will need it later. You
will also receive an confirmation email.
3. Once you click on the sign-in link in your email, Okta finishes provisioning your account for you. Sign in with the
 password provided in the email.
4. Follow the remaining steps for account creation on the form provided after logging in and then click **Create My
Account**

After your are finished creating your account, you will be logged into your new organization. In the top right of the
 screen, there is an **Admin** button.
Clicking on the **Admin** button will take you to your Okta Administration Dashboard and this is where we'll be
spending
most of our time during this guide. For the remainder of this quickstart, we're going to assume the domain for your
organization will be `dev-123456.oktapreview.com`. For your application, you'll want to change this url to match your own organizations url.

## Enable CORS for your Domain
This step is necessary for Okta to accept authentication requests from an application through the Sign-In Widget.

You can enable CORS by following the steps in our [guide for Enabling CORS](/docs/api/getting_started/enabling_cors.html). Configure CORS using the same base URL as the web server you are
using to host the HTML for the Okta Sign-In Widget (see below for instructions). For our example, we'll be setting
our example to be hosted on `http://localhost:8000`. We'll need to add `http://localhost:8000` as a trusted CORS
endpoint in Okta.

To do so, follow the steps below:
1. Navigate to **Admin -> Security -> API** on your Okta dashboard.
2. In the **Trusted Origins** tab, click on **Add Origin**. This will open a modal window with a form to fill out.
3. Give your new origin a name, we will use **PHP Sign-In Widget Example** as ours.
4. In the Origin URL field, fill in your web server that you are hosting on, we'll use `http://localhost:8000`.
5. Check **CORS** in the **Type** section and then click **Save**

## Create an Authorization Server
An authorization server defines your security boundary, for example "staging" or "production". Within each
authorization server you can define your own OAuth scopes, claims, and access policies. This allows your apps and APIs to anchor to a central authorization point and leverage the rich identity features of Okta, such as
Universal Directory for transforming attributes, adaptive MFA for end-users, analytics, and system log.

We will need to set up our own authorization server for our example. This is what the Sign-In Widget will communicate
with to handle the user authentication services. To set this up, follow the steps below:
1. Navigate to **Admin -> Security -> API** page of your Okta dashboard.
2. Select the Authorization Servers tab if not already selected.
3. Click on **Add Authorization Server**. This will open a modal window with a form to fill out.
4. Fill in the form with your information. For our example, we will be using the following:
   - Name: PHP Sign-In Widget Example - Develop
   - Resource URI: http://localhost:8000
     - This is the URI for the OAuth resource that consumes the Access Tokens.
     - This value is used as the default
    audience for Access Tokens
   - Description: This is the development site for our Sign-In Widget example in PHP.
5. Click **Save**

## Create an Access Policy
Our new authorization server needs to have an access policy, so it knows how to handle its users. To
create a new policy, follow the steps below:

1. Navigate to **Admin -> Security -> API** page of your Okta dashboard.
2. Select the Authorization Servers tab if not already selected.
3. Choose the name of the authorization server we created, or the one you want to add a policy to.
4. Click on **Access Policies > Add Policy**. If you already have a policy, you may see **Add New Access Policy**
instead of **Add Policy**. This
will open a model window with a form to fill out.
5. Provide the requested information. For our example, we will be using the following:
   - Name: Policy 1
   - Description: Primary Policy for the PHP Sign-In Widget Example
   - Assign To: All Clients

### Add a Rule to New Policy
For your new policy that we just created, we'll need to add a rule to tell the policy how to function.

1. Navigate to **Admin -> Security -> API -> Access Policies** page of your Okta dashboard.
2. Select the policy we just created **Policy 1**.
3. Click on **Add Rule**. This will open a modal window with a form to fill out.
4. Provide the requested information. For our example, we will be using the following:
   - Rule Name: Primary Rule
   - Grant type is:
     - Client credentials
     - Authorization code
     - Implicit
     - Resource Owner Password
   - User is: Any user assigned to app
   - Grant these scopes: ALl Scopes
   - Access token lifetime is: 1 Hour
   - Refresh token lifetime is: Unlimited
     - but will expire: 7 days

## Create your application
Now that we have our access policy set up, we need an application to communicate with. This is the application that
will represent the application the Widget signs users into. To create an application, follow the steps below:

1. Navigate to **Admin -> Applications** page of your Okta dashboard.
2. Click **Add Application**. This will take you to the add application page, we will select the button **Create New
App** instead of selecting a pre-defined one. This will open a modal window and give you a few options. We'll be using
 the following:
   - Platform: Web
   - Sign on method: OpenID Connect
3. For the general settings page, we'll be using the following:
   - Application Name: PHP Sign-In Widget
   - Application Logo: none
4. Click **Next** and then we will be configuring OpenID connect:
   - Redirect URIs: `http://localhost:8000/oauth2-callback.php`
5. Click **Finish**
6. In the **General** tab of the application you just created, we need to add a few **Allowed grant types**. Click **Edit**
 of the **General Settings** area and make sure you select **Implicit (Hybrid)** which will give you the option to select
  **Allow Access Token with implicit grant type**. Select that and then click **Save**.

Make note of the Client ID from the **Client Credentials** section as we will need this when we set up the widget in
our application.

### Assigning Groups to the Application
The last part of the application setup is setting up group access.

1. Navigate to **Admin -> Applications** page of your Okta dashboard and select the application we just created.
2. Select the **Groups** tab.
3. Click on **Assign to Groups**. This will open a model window with all groups associated with your organization.
4. Find **Everyone** in this list and click **Assign**.  You can limit this to only certain groups by selecting on those
groups instead of **Everyone**.
5. Click **Done**

# PHP Application Set-up
Now that we have all the configuration at Okta done, we can begin setting up our PHP application. There are a
couple of different ways to include the sign-in widget in your application. You can use the NPM module by installing
`@okta/okta-signin-widget` in your project, or by using the Okta CDN, which is what we'll be using. Once you have the
 sign-in widget, there's a little bit of configuration you have to do to talk with your new authorization server.

## Installing and Configuring the Sign In Widget
There are 2 files we will require for the sign in widget to work, a JS file and a CSS file. You will also be able to
supply a 3rd file from our CDN or supply your own for the theme of the signin widget.

```html
<!-- Latest CDN production Javascript and CSS: 1.11.0 -->
<script
  src="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.11.0/js/okta-sign-in.min.js"
  type="text/javascript"></script>
<link
  href="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.11.0/css/okta-sign-in.min.css"
  type="text/css"
  rel="stylesheet"/>

<!-- Theme file: Customize or replace this file if you want to override our default styles -->
<link
  href="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/1.11.0/css/okta-theme.css"
  type="text/css"
  rel="stylesheet"/>
```
Add the above to your login page. For our example, we will be using `login.php` as our login page. Also on the login
page, we need to add a little bit of configuration for the sign-in widget to work. The first thing is to create an
area on the page to give us a target for the widget to be placed.

```html
<div id="okta-login"></div>
```

> This element, a div in our example, should remain empty and can be placed where you would like the sign-in widget
to be rendered..

We also need to add a script block to initialize and configure the widget.

```html
<script>
    var orgUrl = 'https://dev-123456.oktapreview.com';
    var signIn = new OktaSignIn({
        baseUrl: orgUrl,
        clientId: 'sRmBpCfR3xKyf4goHZhM',
        redirectUri: 'http://localhost:8000/oauth2-callback.php',
        authParams: {
            responseType: 'access_token',
            issuer: 'https://dev-123456.oktapreview.com/oauth2/ausa87h9g2misxHVS0h7',
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
| baseUrl                 | This is your Organization URL in Okta. It will be the URL of the admin pages without the **-admin** for example `https://dev-123456.oktapreview.com`   |
| clientId                | The client ID of the Okta application.                                                                                                               |
| redirectUri             | Where we will send the user to once they attempt a login.                                                                                            |
| authParams.responseType | What we want back from a successful login                                                                                                            |
| authParams.issuer       | The issuer of the authorization server. Can be retrieved from **Admin -> Security -> API -> Authorization Servers**                                           |
| authParams.display      | Redirect to the authorization server when an External Identity Provider button is clicked                                                            |

Now we can visit the `login.php` page and see the Sign-In Widget. You should be able to log into your main account.
If you have a successful login, you will be redirected to our `oauth2-callback.php` page which is where we will go
through the [Authorization Code Flow](https://tools.ietf.org/html/rfc6749#section-1.3.1) to get our `access_token`.

## Responding to a Successful Login.
Next, we exchange the returned authorization code for an `access_token`. In this sample, we will use curl to do the
exchange.

```php
$authHeaderSecret = base64_encode($clientId . ':' . $clientSecret);

$query = http_build_query([
    'grant_type' => 'authorization_code',
    'code' => $_GET['code'],
    'redirect_uri' => 'http://localhost:8000/oauth2-callback.php'
]);

$headers = [
    'Authorization: Basic ' . $authHeaderSecret,
    'Accept: application/json',
    'Content-Type: application/x-www-form-urlencoded',
    'Connection: close',
    'Content-Length: 0'
];
$url = 'https://dev-123456.oktapreview.com/oauth2/ausa87h9g2misxHVS0h7/v1/token?' . $query;

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
4. Verify the signature of the access token according to [JWS](https://tools.ietf.org/html/rfc7515) using the
algorithm specified in the JWT `alg` header property. Use the public keys provided by Okta via the [Get Keys endpoint](/docs/api/resources/oauth2.html#get-keys).
5. Verify that the expiry time (from the `exp` claim) has not already passed.

```php
if($res->claims['iss'] != 'https://dev-123456.oktapreview.com/') {
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
    curl_setopt($ch, CURLOPT_URL, 'https://dev-123456.oktapreview.com/oauth2/ausa87h9g2misxHVS0h7/v1/keys');
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

The access token is signed by an RSA private key, and we publish the future signing key well in advance.
However, in an emergency situation you can still stay in sync with Okta's key rotation. Have your application check the `kid`, and if it has changed and the key is missing from the local cache, check the `jwks_uri` value in the [authorization server metadata](/docs/api/resources/oauth2.html#retrieve-authorization-server-metadata) and you can go back to the [jwks uri](/docs/api/resources/oauth2.html#get-keys) to get keys again from Okta

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
