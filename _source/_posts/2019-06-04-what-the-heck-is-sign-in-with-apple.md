---
layout: blog_post
title: "What the Heck is Sign In with Apple?"
author: aaronpk
description: "Sign In with Apple is based on OAuth 2.0 and OpenID Connect, and provides a privacy-friendly way for users to sign in to websites and apps"
tags: [ oauth, appleid, oidc ]
tweets:
- "A look behind the scenes at how Sign In with Apple works 👀"
image: blog/sign-in-with-apple/sign-in-with-apple.jpg
---

This week at Apple's developer conference WWDC, Apple announced a new feature, "Sign In with Apple" enabling users to sign in to apps using their Apple ID. This new feature is positioned as a secure and privacy-friendly way for users to create an account in apps. Most iOS and Mac users already have an Apple ID, and this new feature lets them use that Apple ID to sign in to other apps and websites.

If this sounds a lot like "Sign in with Facebook" or "Sign in with Twitter", that's because it is! This is Apple's way of providing a way for users to sign in to apps without having to rely on an external identity provider like Facebook or Twitter.

Apple is taking a firm stance to protect user's privacy with this new feature. Rather than letting apps see the user's real email address, they will provide the app with a proxy email address unique to each app. App developers will still be able to send emails to the proxy addresses, it just means developers won't be able to use the email addresses to correlate users between apps, and it also means users can shut off email forwarding per app.

## The Sign In with Apple Flow

Let's take a look at how this new flow works using your Apple ID to sign in to a website.

It starts with a button in the app or website labeled "Sign In with Apple".

{% img blog/sign-in-with-apple/1-sign-in-with-apple-button.png alt:"Sign In with Apple Button" width:"500" %}{: .center-image }

Clicking on this button will take the user to the Apple sign-in screen.

{% img blog/sign-in-with-apple/2-sign-in-screen.png alt:"Sign In with Apple Screen" width:"800" %}{: .center-image }

If the user has two-factor authentication enabled then they will have to confirm this login from another device.

{% img blog/sign-in-with-apple/3-2fa-prompt.jpg alt:"Apple's prompt for confirming the login from another device" width:"400" %}{: .center-image }
 
And enter the two-factor auth code.

{% img blog/sign-in-with-apple/4-2fa-code.jpg alt:"Get the two-factor auth code from an iOS device" width:"400" %}{: .center-image }

{% img blog/sign-in-with-apple/5-2fa-entry.png alt:"Enter the two-factor auth code" width:"800" %}{: .center-image }

Finally, the user will see a prompt confirming that they want to sign in to this application using their Apple ID.

{% img blog/sign-in-with-apple/apple-permission-prompt.png alt:"Dialog asking the user to confirm signing in to this app" width:"800" %}{: .center-image }

Clicking "Continue" will take the user back to the app where they will be signed in!

## How Sign In with Apple Works (Hint: it uses OAuth and OIDC)

Thankfully, Apple adopted the existing open standards OAuth 2.0 and OpenID Connect to use as the foundation for their new API. While they don't explicitly call out OAuth or OIDC in their documentation, they use all the same terminology and API calls. This means if you're familiar with these technologies, you should have no trouble using Sign in with Apple right away!

Let's walk through building a short sample application that can leverage Apple's new API to sign users in. You should be able to translate this code to your language of choice relatively easily once you see the requests being made.

The hardest part of this whole process is registering an application in the Apple Developer Portal. Typically, OAuth providers have a relatively straightforward process to register a new application which will give you a client ID and secret. But since Apple's API is tied to their whole iOS app ecosystem, it's a bit more complicated. They've also opted to use a public/private key client authentication method rather than a traditional client secret. But don't worry, we'll go through this step by step.

At the end of this process, you'll end up with a registered `client_id` (which they call a Service ID), a private key downloaded as a file, and you'll verify a domain and set up a redirect URL for the app.

First, sign in to the Apple Developer Portal and click on **Certificates, Identifiers and Profiles**.

{% img blog/sign-in-with-apple/7-apple-developer-account.png alt:"Apple developer account dashboard" width:"800" %}{: .center-image }

### Create an App ID

From the sidebar, choose **Identifiers** then click the blue plus icon.

{% img blog/sign-in-with-apple/8-create-identifier-button.png alt:"Choose Identifiers" width:"500" %}{: .center-image }

Choose **App IDs** in this first step.

{% img blog/sign-in-with-apple/9-choose-app-ids.png alt:"Choose App IDs" width:"800" %}{: .center-image }

In the next screen, you'll choose a description and Bundle ID for the App ID. The description isn't too important, but type something descriptive. The Bundle ID is best when it's a reverse-dns style string. 

{% img blog/sign-in-with-apple/10-enter-app-id-information.png alt:"Enter your App ID information" width:"800" %}{: .center-image }

In this example, I'm using `lol.avocado` since the domain this app will be running on is `avocado.lol`.

You'll also want to scroll down through the list of capabilities and check the box next to **Sign In with Apple**. 

{% img blog/sign-in-with-apple/11-enable-sign-in-with-apple.png alt:"Click the checkbox to enable Sign In with Apple" width:"800" %}{: .center-image }

Go ahead and confirm this step.

### Create a Services ID

The App ID in the previous step is a sort of way to collect things about this app. It seems redundant when you're only making a simple web app login experience like this example, but it makes more sense once you have a native app and web app that you want to tie together under a single login experience.

The Services ID will identify the particular instance of your app, and is used as the OAuth `client_id`. 

Go ahead and create a new identifier and choose **Services IDs**.

{% img blog/sign-in-with-apple/12-create-services-id.png alt:"Create a new Services ID" width:"800" %}{: .center-image }

In the next step, you'll define the name of the app that the user will see during the login flow, as well as define the identifier which becomes the OAuth `client_id`. Make sure to also check the **Sign In with Apple** checkbox.

{% img blog/sign-in-with-apple/13-enter-services-id-information.png alt:"Enter Services ID information" width:"800" %}{: .center-image }

You'll also need to click the **Configure** button next to **Sign In with Apple** in this step. This is where you'll define the domain your app is running on, as well as define the redirect URLs used during the OAuth flow.

{% img blog/sign-in-with-apple/14-web-authentication-configuration.png alt:"Web Authentication Configuration, enter example-app.com/redirect for the redirect URL" width:"800" %}{: .center-image }

Make sure your associated App ID is chosen as the **Primary App ID**. (If this is the first App ID you've made that uses Sign In with Apple, then it will probably already be selected.)

Enter the domain name your app will eventually be running at, and enter the redirect URL for your app as well. If you want to follow along with this blog post, then you can use the placeholder redirect URL `https://example-app.com/redirect` which will catch the redirect so you can see the authorization code returned.

It's worth noting that Apple doesn't allow `localhost` URLs in this step, and if you enter an IP address like `127.0.0.1` it will fail later in the flow. You have to use a real domain here.

Go ahead and click **Save** and then **Continue** and **Register** until this step is all confirmed.

Ok! At this point, you now have an App ID container to hold everything, and you've created a Services ID which you'll use as your OAuth `client_id`. The **Identifier** you entered for your Services ID is your OAuth `client_id`. In my example, that is `lol.avocado.client`. 

### Create a Private Key for Client Authentication

Rather than using simple strings as OAuth client secrets, Apple has decided to use a public/private key pair, where the client secret is actually a signed JWT. This next step involves registering a new private key with Apple.

Back in the main **Certificates, Identifiers & Profiles** screen, choose **Keys** from the side navigation.

{% img blog/sign-in-with-apple/15-keys.png alt:"Side menu" width:"300" %}{: .center-image }

Click the blue plus icon to register a new key. Give your key a name, and check the **Sign In with Apple** checkbox.

{% img blog/sign-in-with-apple/16-register-a-new-key.png alt:"Register a new key" width:"800" %}{: .center-image }

Click the **Configure** button and select your primary App ID you created earlier.

{% img blog/sign-in-with-apple/17-select-app-id.png alt:"Select the primary App ID" width:"800" %}{: .center-image }

Apple will generate a new private key for you and let you download it only once. Make sure you save this file, because you won't be able to get it back again later! The file you download will end in `.p8`, but it's just text inside, so rename it to `key.txt` so that it's easier to use in the next steps.

{% img blog/sign-in-with-apple/18-download-your-key.png alt:"Download your key" width:"800" %}{: .center-image }

Lastly, go back and view the key information to find your Key ID which you'll need in the next step.

{% img blog/sign-in-with-apple/find-your-key-id.png alt:"Find your key ID" width:"800" %}{: .center-image }

Alright, that was a lot, but we are now ready to start writing some code! If you ran into any trouble, try checking out [Apple's documentation](https://developer.apple.com/sign-in-with-apple/get-started/) in case anything has changed since the publication of this blog post.

## Generate the Client Secret

Rather than static client secrets, Apple requires that you derive a client secret yourself from your private key. They use the JWT standard for this, using an elliptic curve algorithm with a P-256 curve and SHA256 hash. In other words, they use the ES256 JWT algorithm. Some JWT libraries don't support elliptic curve methods, so make sure yours does before you start trying this out.

The Ruby JWT library supports this algorithm, so we'll use that to generate the secret.

First, make sure you've got Ruby installed, and then install the JWT gem by running this from the command line:

```bash
gem install jwt
```

Now the `jwt` gem should be available for use. Fill in the missing values at the top of this file, and save it as `client_secret.rb`. You should already have the `client_id` value from the previous step. You'll also need your Apple Team ID. This is displayed in a few places, but the most convenient is in the top right corner of the screen. Use the Key ID you found in the previous step.

{% img blog/sign-in-with-apple/19-find-team-id.png alt:"Find your team ID in the top right corner" width:"300" %}{: .center-image }

**client_secret.rb**

```ruby
require 'jwt'

key_file = 'key.txt'
team_id = ''
client_id = ''
key_id = ''

ecdsa_key = OpenSSL::PKey::EC.new IO.read key_file

headers = {
  'kid' => key_id
}

claims = {
	'iss' => team_id,
	'iat' => Time.now.to_i,
	'exp' => Time.now.to_i + 86400*180,
	'aud' => 'https://appleid.apple.com',
	'sub' => client_id,
}

token = JWT.encode claims, ecdsa_key, 'ES256', headers

puts token
```

This code generates a JWT using the ES256 algorithm which includes a handful of claims. This JWT expires in 6 months, which is the maximum lifetime Apple will allow. If you're generating a new client secret JWT every time a user authenticates, then you should use a much shorter expiration date, but this allows us to generate the secret once and use it in our sample apps easily.

Now you can run this from the command line and it will output a JWT.

```bash
ruby client_secret.rb
eyJraWQiOiJGUVVBN0RYUkJGIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiI3TUM2VVpSMlVWIiwiaWF0IjoxNTU5NjE0MjU2LCJleHAiOjE1NzUxNjYyNTYsImF1ZCI6Imh0dHBzOi8vYXBwbGVpZC5hcHBsZS5jb20iLCJzdWIiOiJsb2wuYXZvY2Fkby5jbGllbnQifQ.t6wIFrSKwuCZsJ9I1TWWBCdxmUMG3g0kNyNnxhkpG3oZAKY2UdXqL5CyRGTa21OYHa6ir1JFWkdBDjTNvt8hYC
```

This is described in Apple's documentation [Generate and validate tokens](https://developer.apple.com/documentation/signinwithapplerestapi/generate_and_validate_tokens).

## Begin the OAuth 2.0 Flow

Now that we've got a client secret, we can actually begin the OAuth flow! For this step, we'll create a simple PHP file that will handle both the beginning of the flow as well as the redirect step. 

Go ahead and create a file called `index.php` with the following contents, filling in the values for your own application.

**index.php**

```php
<?php
session_start();

$client_id = '';
$client_secret = '';
$redirect_uri = 'https://example-app.com/redirect';
```

Now you can start building the URL that the user will go visit to start the flow. First, you'll generate a random `state` value and save it in the session. Then you'll use your app's configured values to create a URL that the user can visit. These parameters should all look familiar to you if you've used OAuth or OpenID Connect before.

I couldn't find any documentation on which URL to use as the authorization endpoint, or even whether these were the right parameters, but thankfully the rest of the API looked like OAuth so I was able to figure it out despite the missing docs.

```php
$_SESSION['state'] = bin2hex(random_bytes(5));

$authorize_url = 'https://appleid.apple.com/auth/authorize'.'?'.http_build_query([
  'response_type' => 'code',
  'response_mode' => 'form_post',
  'client_id' => $client_id,
  'redirect_uri' => $redirect_uri,
  'state' => $_SESSION['state'],
  'scope' => 'name email',
]);
```

Now you can create a link the user can click to log in.

```php
echo '<a href="'.$authorize_url.'">Sign In with Apple</a>';
```

Of course, you should probably use the [recommended button](https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple/overview/) provided by Apple so that it looks a bit nicer than this text link, but this is good enough for now.

You can run this app now using the built-in PHP web server!

```bash
php -S 127.0.0.1:8080
```

Once that's running, you can visit `http://127.0.0.1:8080` in your browser and you should see your sign-in link!

{% img blog/sign-in-with-apple/1-sign-in-with-apple-button.png alt:"Sign In with Apple Button" width:"500" %}{: .center-image }

## Handle the OAuth Redirect

Before you click Sign In, you should set up the mechanism for handling the redirect back from Apple. 

Add the following code to `index.php` above the line `$_SESSION['state'] = bin2hex(random_bytes(5));`.

```php
if(isset($_POST['code'])) {

  if($_SESSION['state'] != $_POST['state']) {
    die('Authorization server returned an invalid state parameter');
  }

  // Token endpoint docs: 
  // https://developer.apple.com/documentation/signinwithapplerestapi/generate_and_validate_tokens

  $response = http('https://appleid.apple.com/auth/token', [
    'grant_type' => 'authorization_code',
    'code' => $_POST['code'],
    'redirect_uri' => $redirect_uri,
    'client_id' => $client_id,
    'client_secret' => $client_secret,
  ]);

  if(!isset($response->access_token)) {
    echo '<p>Error getting an access token:</p>';
    echo '<pre>'; print_r($response); echo '</pre>';
    echo '<p><a href="/">Start Over</a></p>';
    die();
  }

  echo '<h3>Access Token Response</h3>';
  echo '<pre>'; print_r($response); echo '</pre>';


  $claims = explode('.', $response->id_token)[1];
  $claims = json_decode(base64_decode($claims));

  echo '<h3>Parsed ID Token</h3>';
  echo '<pre>';
  print_r($claims);
  echo '</pre>';

  die();
}
```

This is a handful of code, so let's walk through it.

`if(isset($_POST['code']))`

First, we check for the presence of the authorization code in the query string which indicates that Apple has completed the initial step and sent the user back to the app.

Next, we verify the `state` parameter matches the one we set at the beginning. This is to protect your app against CSRF attacks.

Then we're ready to exchange the authorization code for an access token. Again this will look familiar if you've written OAuth code before.

This request is actually documented on Apple's website, although as of this writing, their docs have a couple of typos. The typos make it look like Apple has done something non-standard with the parameter names, but in reality, the OAuth parameters work properly.

```php
  $response = http('https://appleid.apple.com/auth/token', [
    'grant_type' => 'authorization_code',
    'code' => $_POST['code'],
    'redirect_uri' => $redirect_uri,
    'client_id' => $client_id,
    'client_secret' => $client_secret,
  ]);
```

This uses a helper function `http()` that we need to define, so go ahead and add the following to the bottom of your `index.php` file.

```php
function http($url, $params=false) {
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  if($params)
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'User-Agent: curl', # Apple requires a user agent header at the token endpoint
  ]);
  $response = curl_exec($ch);
  return json_decode($response);
}
```

One particularly tricky thing I noticed while testing this is that Apple requires the presence of a `User-Agent` header in the HTTP request, otherwise, it returns a `403` error and an HTML web page. This is not documented in their API, because I'm guessing this check happens at their API gateways before the request hits the real backend server.

At this point, assuming everything worked, you can output the response from this and see what Apple has returned! 

Let's try this out for reals now.

## Try Sign In with Apple Now!

Click the "Sign In with Apple" button, and you'll be taken to the Apple sign-in screen.

{% img blog/sign-in-with-apple/1-sign-in-with-apple-button.png alt:"Sign In with Apple Button" width:"500" %}{: .center-image }

You should see the name of your app and a placeholder icon. Enter your Apple ID and password.

{% img blog/sign-in-with-apple/2-sign-in-screen.png alt:"The Apple sign-in screen" width:"800" %}{: .center-image }

If your Apple ID has two-factor auth enabled, you'll be prompted for that as well.

{% img blog/sign-in-with-apple/5-2fa-entry.png alt:"Apple two-factor auth entry" width:"800" %}{: .center-image }

It does seem to prompt for two-factor auth every time you log in to an app, which is definitely secure, but can be a little frustrating especially while testing.

Once you confirm that, you'll see a screen asking if you would like to continue signing in to the app.

{% img blog/sign-in-with-apple/apple-permission-prompt.png alt:"Prompt: Would you like to sign in?" width:"800" %}{: .center-image }

Note: You will only see this permissions screen the very first time you log in with this App ID. In subsequent logins, you'll see a confirmation prompt like the below. 

{% img blog/sign-in-with-apple/6-sign-in-confirmation.png alt:"Dialog asking the user to confirm signing in to this app" width:"800" %}{: .center-image }

If you want to reset this so that you see the permissions screen and get the name and email back from Apple, visit your [Apple ID App Security page](https://appleid.apple.com/account/manage) and revoke your application.

{% img blog/sign-in-with-apple/apple-revoke-application.png alt:"Dialog to revoke an application from the app security settings" width:"500" %}{: .center-image }

Now click **Continue** and you'll be redirected to your redirect URL! If you entered the placeholder `https://example-app.com/redirect` URL then you'll see a message like this.

{% img blog/sign-in-with-apple/apple-oauth-redirect.png alt:"The sample redirect handler at example-app.com/redirect" width:"800" %}{: .center-image }

Since Apple sends a POST request to the redirect URL, you'll have to actually set up a redirect handler yourself to catch the values, since the authorization code will likely expire before you can copy it out of this debug screen.

Once you've set up the sample code above and registered your own redirect URL, your app will exchange the authorization code for an access token and ID token, and will show the output on the screen!

{% img blog/sign-in-with-apple/apple-sign-in-tokens.png alt:"Tokens retrieved from Apple" width:"600" %}{: .center-image }

The last step to getting the user's info is to decode the ID token. Since in this example we used `response_type=code` to get the ID token, the ID token was obtained via the back channel, which means we don't need to worry about validating the JWT signature of the ID token. We can just parse out the middle claims section and read the data directly.

The `sub` value in the claims is the unique identifier for the user. It's notable that this value doesn't mean anything in particular, which is Apple's way of preserving user privacy. You can store this value in your own database now, and use it to determine whether the same user logged back in a second time.

You can also find the user's email or proxy email in the claims as well.

Note: Apple will send the user's name and email in the form post response back to your redirect URL. You should not treat these values as authoritative, because like the [OAuth Implicit flow](/blog/2019/05/01/is-the-oauth-implicit-flow-dead), the data cannot be safely trusted at this point. Unfortunately Apple does not return the user's name in the ID token where it would be safe to trust. Thankfully they do return the user's email address that way, so that's where you should get it from.

You can find the [complete code from this tutorial](https://github.com/aaronpk/sign-in-with-apple-example) on GitHub!

### Changelog

* August 23, 2019: Updates to the sample code and blog post to adapt to Apple's new requirement of using the `response_mode=form_post` parameter, as well as details on getting the user's name and email address. [okta.github.io#3022](https://github.com/oktadeveloper/okta.github.io/pull/3022).
* Jun 7, 2019: Updates to the sample code based on some new implementation experience. Added screenshot of the permissions screen asking to hide the email address. You can see the changes to this article in [okta.github.io#2924](https://github.com/oktadeveloper/okta.github.io/pull/2924).
* Jun 10, 2019: Fixed typo in `client_secret.rb`

## Learn More about OAuth 2.0 and OpenID Connect

If you'd like to learn more about OAuth, check out the links below!

* [What is the OAuth 2.0 Authorization Code Grant Type?](https://developer.okta.com/blog/2018/04/10/oauth-authorization-code-grant-type)
* [Why OAuth API Keys and Secrets Aren't Safe in Mobile Apps](https://developer.okta.com/blog/2019/01/22/oauth-api-keys-arent-safe-in-mobile-apps)
* [Is the OAuth 2.0 Implicit Flow Dead?](https://developer.okta.com/blog/2019/05/01/is-the-oauth-implicit-flow-dead)
* [OAuth 2.0 for Native and Mobile Apps](https://developer.okta.com/blog/2018/12/13/oauth-2-for-native-and-mobile-apps)

If you have any questions about this post, please add a comment below. For more awesome content, follow [@oktadev](https://twitter.com/oktadev) or subscribe to [our YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q).

