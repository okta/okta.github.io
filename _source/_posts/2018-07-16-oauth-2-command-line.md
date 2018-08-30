---
layout: blog_post
title: "OAuth 2.0 from the Command Line"
author: aaronpk
description: "In this tutorial, I'll show you how to write a command line script which is able to complete the OAuth exchange all without any copying and pasting long strings! Why? Because it's mildly useful, but most importantly, because it's fun!"
tags: [oauth, php]
Tweets:
- "Who knew @OAuth_2 from the command line could work so well! 👾"
- "Why yes, @aaronpk *did* just embed an HTTP server in a PHP command line tool. #oauth2"
---

So you've found yourself writing a command line script and needing to talk to an API that uses OAuth 2.0? The typical approaches to getting an OAuth access token from a command line script usually involve copying and pasting the authorization code into the terminal. But we can do better!

In this tutorial, I'll show you how to write a command line script which is able to complete the OAuth exchange all without any copying and pasting long strings! Why? Because it's mildly useful, but most importantly, because it's fun!

## Get Started with Okta

We're going to write this sample app to talk to the Okta API, but it should be easily adapted to any OAuth 2.0 service you're using. To get started, [sign up for a free developer account](https://developer.okta.com/signup/), and come back here when you've made your account.

Why Okta? Well, because Okta is a free-to-use API service that stores user accounts, and makes handling user authentication, authorization, social login, password reset, etc. — simple. Okta utilizes open standards like OAuth 2.0 to make integration seamless.

We first need to create an OAuth application in the Okta Developer dashboard. In the Applications section of your account, click **Add Application**, and choose **Web**. (Yes I realize this is counterintuitive, but choosing **Web** is what tells Okta that we want to do that OAuth [Authorization Code flow](https://developer.okta.com/blog/2018/04/10/oauth-authorization-code-grant-type).) You can accept all the defaults in the application settings.

{% img blog/oauth-2-command-line/create-app.png alt:"Create an application on Okta" width:"600" %}{: .center-image }

Click **Done** and you'll be taken to the next screen where you can get your new client ID and secret. Copy those two values and enter them in the code below, adding this to a new PHP file called `login.php`.

```php
<?php
$client_id = '{clientId}';
$client_secret = '{clientSecret}';
```

We also need to find the authorization server metadata URL. From the top menu, choose **API** -> **Authorization Servers**. You should see one authorization server in the list, `default`. Click that and fill in the Metadata URI into your PHP file like the below:

```php
$metadata = http('https://{yourOktaDomain}/oauth2/default/.well-known/oauth-authorization-server');
```

## The Trick to OAuth 2.0 on the Command Line

The way we're going to avoid the need to copy and paste anything during the login flow is by having our PHP command line script start a mini HTTP server just when we need it, and shut down when we're done.

The script will launch the browser to the authorization URL, and when Okta redirects the user back to the mini built-in server, we'll catch that response, extract the authorization code, shut down the server, and continue with whatever the script was doing.

To begin, we need to define a few variables that we'll use when setting up this server, as well as define a function that will help us make HTTP requests. Copy the following code into your PHP file.

```php
$ip = '127.0.0.1';
$port = '8080';

$redirect_uri = 'http://'.$ip.':'.$port.'/authorization-code/callback';
$socket_str = 'tcp://'.$ip.':'.$port;

function http($url, $params=false) {
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  if($params)
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
  return json_decode(curl_exec($ch));
}
```

## Start the OAuth 2.0 Flow

We're ready to start the OAuth flow now. First we generate a random "state" value for added security. Since we're building this in a command line script, we don't need to worry about storing it in a session or anything, since we'll generate it and then use it and then be done with it.

```php
$state = bin2hex(random_bytes(5));
```

Next we can build the authorization URL that we'll open to start the flow, using the `authorization_endpoint` from the server's metadata.

```php
$authorize_url = $metadata->authorization_endpoint.'?'.http_build_query([
  'response_type' => 'code',
  'client_id' => $client_id,
  'redirect_uri' => $redirect_uri,
  'state' => $state,
]);
```

So far this is a typical OAuth request, nothing particularly unique happening here yet.

Since we'll be running this from the command line, we obviously can't use the normal technique of sending an HTTP redirect to the browser, since we aren't in a browser! Instead, we need to use a shell command to launch a new browser to the URL.

```php
echo "Open the following URL in a browser to continue\n";
echo $authorize_url."\n";
shell_exec("open '".$authorize_url."'");
```

On a Mac, `open` will try to open whatever argument is passed to it using the system default handler. Since we give it a URL, it will open a browser window to that URL. If you're not on a mac, then you'll have to click the URL that is displayed in the terminal instead.

Now here comes the trick. The script just launched a browser window to the authorization server, and the user now has to log in. After they do, that browser window will be redirected back to `http://127.0.0.1:8080/authorization-code/callback` with an authorization code in the query string. This means we need to have an  HTTP server ready to handle that request so that we can extract the authorization code from the URL.

So we're going to create a mini HTTP server in our command line script. It will open a socket on port 8080, wait for a complete HTTP request, send back a simple response, and return the authorization code that was in the query string. Here's a bit of code that will do this, adapted from a real command line tool that does this written by [Christian Weiske](http://cweiske.de/shpub.htm). Add the function below into your PHP file.

```php
function startHttpServer($socketStr) {
  // Adapted from http://cweiske.de/shpub.htm

  $responseOk = "HTTP/1.0 200 OK\r\n"
    . "Content-Type: text/plain\r\n"
    . "\r\n"
    . "Ok. You may close this tab and return to the shell.\r\n";
  $responseErr = "HTTP/1.0 400 Bad Request\r\n"
    . "Content-Type: text/plain\r\n"
    . "\r\n"
    . "Bad Request\r\n";

  ini_set('default_socket_timeout', 60 * 5);

  $server = stream_socket_server($socketStr, $errno, $errstr);

  if(!$server) {
    Log::err('Error starting HTTP server');
    return false;
  }

  do {
    $sock = stream_socket_accept($server);
    if(!$sock) {
      Log::err('Error accepting socket connection');
      exit(1);
    }
    $headers = [];
    $body    = null;
    $content_length = 0;
    //read request headers
    while(false !== ($line = trim(fgets($sock)))) {
      if('' === $line) {
        break;
      }
      $regex = '#^Content-Length:\s*([[:digit:]]+)\s*$#i';
      if(preg_match($regex, $line, $matches)) {
        $content_length = (int)$matches[1];
      }
      $headers[] = $line;
    }
    // read content/body
    if($content_length > 0) {
      $body = fread($sock, $content_length);
    }
    // send response
    list($method, $url, $httpver) = explode(' ', $headers[0]);
    if($method == 'GET') {
      #echo "Redirected to $url\n";
      $parts = parse_url($url);
      #print_r($parts);
      if(isset($parts['path']) && $parts['path'] == '/authorization-code/callback'
        && isset($parts['query'])
      ) {
        parse_str($parts['query'], $query);
        if(isset($query['code']) && isset($query['state'])) {
          fwrite($sock, $responseOk);
          fclose($sock);
          return $query;
        }
      }
    }
    fwrite($sock, $responseErr);
    fclose($sock);
  } while (true);
}
```

Now we can use this function to start a server and wait for the browser to hit it.

```php
// Start the mini HTTP server and wait for their browser to hit the redirect URL
// Store the query string parameters in a variable
$auth = startHttpServer($socket_str);
```

{% img blog/oauth-2-command-line/start-login.png alt:"Start the login from the command line" width:"800" %}{: .center-image }


## Handle the Authorization Response

At this point, after the user logs in, their browser will be redirected to `http://127.0.0.1:8080/authorization-code/callback?code=XXXX&state=YYYY`. Our built-in web server will look at the URL of the request and extract the code and state parameters. We need to double check that the state parameter matches the one we set at the beginning, and then we can use the code.

{% img blog/oauth-2-command-line/browser-redirect.png alt:"Handling the browser redirect" width:"800" %}{: .center-image }

```php
if($auth['state'] != $state) {
  echo "Wrong 'state' parameter returned\n";
  exit(2);
}

$code = $auth['code'];
```

From here out, we're proceeding with the normal OAuth Authorization Code request just like any other app. We make a POST request to the token endpoint to exchange the authorization code for an access token.

```php
echo "Getting an access token...\n";
$response = http($metadata->token_endpoint, [
  'grant_type' => 'authorization_code',
  'code' => $code,
  'redirect_uri' => $redirect_uri,
  'client_id' => $client_id,
  'client_secret' => $client_secret,
]);

if(!isset($response->access_token)) {
  echo "Error fetching access token\n";
  exit(2);
}

$access_token = $response->access_token;
```

Now we have an access token in `$access_token`! If this were a real tool, you'd probably want to store that somewhere your script can find it next time it's run. But for the purposes of this demo, we won't store it anywhere. Instead, we'll make a request to find out the username of who just logged in.

```php
echo "Getting the username...\n";
$token = http($metadata->introspection_endpoint, [
  'token' => $access_token,
  'client_id' => $client_id,
  'client_secret' => $client_secret,
]);

if($token->active == 1) {
  echo "Logged in as ".$token->username."\n";
  die();
}
```

This makes a request to the token introspection endpoint to find the username of the person who logged in, prints it to the terminal, and quits.

{% img blog/oauth-2-command-line/logged-in.png alt:"Logged in on the command line" width:"800" %}{: .center-image }

That's it! You can open a terminal and run this code with the command below:

```bash
php login.php
```

You can see the full source code for this application on GitHub at [https://github.com/aaronpk/command-line-oauth](https://github.com/aaronpk/command-line-oauth).

## Learn More About OAuth 2.0 and Secure User Management with Okta

For more information and tutorials about OAuth 2.0, check out some of our other blog posts!

* [Add Authentication to your PHP App in 5 Minutes](/blog/2018/07/09/five-minute-php-app-auth)
* [What is the OAuth 2.0 Authorization Code Grant Type?](/blog/2018/04/10/oauth-authorization-code-grant-type)
* [What is the OAuth 2.0 Implicit Grant Type?](/blog/2018/05/24/what-is-the-oauth2-implicit-grant-type)
* [Build a Basic CRUD App with Symfony 4 and Vue](/blog/2018/06/14/php-crud-app-symfony-vue)

As always, we'd love to hear from you about this post, or really anything else! Hit us up in the comments, or on Twitter [@oktadev](https://twitter.com/OktaDev)!
