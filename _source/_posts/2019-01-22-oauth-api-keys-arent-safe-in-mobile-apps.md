---
layout: blog_post
title: "Why OAuth API Keys and Secrets Aren't Safe in Mobile Apps"
author: aaronpk
description: "Let's take a look at two ways it's possible to hack secret API keys out of mobile apps."
tags: [oauth, api, secret, keys, mobile, apps]
tweets:
- "Keep API keys out of mobile apps! #oauth #api #security"
- "Here are two ways to hack API keys out of mobile apps #security"
image: blog/oauth-api-keys-mobile-apps/no-mobile-api-keys.jpg
---

It's pretty common for mobile apps to access backend API services to fetch data. It's also pretty common for APIs to require secret keys in order to access them. So how do you securely include API keys in a mobile app? Well, the short answer is you don't. The long answer is the rest of this blog post.

Let's take a look at two ways it's possible to hack secret API keys out of mobile apps. 

{% img blog/oauth-api-keys-mobile-apps/no-mobile-api-keys.jpg %}{: .center-image }

## Keys can be extracted from native and mobile apps

It's fairly straightforward to extract API keys from a JavaScript app. As soon as you load the web page hosting the JavaScript app, your browser downloads the entire source code so it can run it. All you have to do is click "view source" and start poking around, and the whole source code, including any API keys inside, will be visible. JavaScript code is often compressed or minified, so it may not be easy to actually understand the source code, but ultimately any strings defined in the app will be visible to anyone looking.

It's less obvious that the same thing is true for native and mobile apps. These apps are also downloaded entirely to the device before they are run, but in this case you're downloading a binary file instead of uncompiled source code. 

Just for fun, let's demonstrate this quickly. If you're on a Mac, and you have 1Password installed, run this command. (You can run this on any binary file on your Mac, but the 1Password app happens to have some very readable data inside it.)

```bash
strings /Applications/1Password\ 7.app/Contents/MacOS/1Password\ 7 | grep 1Password
```

The `strings` command will display any embedded strings in the binary file, and then we use `grep` to find any strings matching `1Password`, and the result is a bunch of text that is displayed in the application!

```
...
Restarting 1Password...
1Password failed to connect to 1Password
Please quit 1Password and start it again.
Add Account to 1Password
An update to Safari is required in order to use the 1Password extension.
Welcome to 1Password!
...
```

If there were any API keys embedded in the application, they would also have been displayed by the `strings` command.

Let's demonstrate this by writing a simple program from scratch. We'll write a C program that outputs "hello world". First, create a file called `hello.c` with the following contents:

```c
#include <stdio.h>

char hello[] = "hello";
char world[] = "world";

int main()
{
  printf("%s %s", hello, world);
  return 0;
}
```

In this code, we're declaring a string named `example` with the value "hello world", and then printing it when the program is run. You can compile this with any C compiler such as `gcc`:

```bash
$ gcc hello.c
```

The result will be a binary file called `a.out` which you can then run:

```bash
$ ./a.out
hello world
```

Let's see what `strings` thinks of the file:

```
$ strings a.out
%s %s
hello
world
```

Look at that! It found our text no problem.

Now you might be thinking, "what if I obfuscate the API key by splitting it into a few parts and combining it in code?" That might buy you a bit of time, but someone who's really determined will probably still figure it out.

Even Twitter couldn't stop this from happening! In 2013, the [API keys for the official Twitter apps were leaked this way](https://threatpost.com/twitter-oauth-api-keys-leaked-030713/77597/), allowing attackers to impersonate the legitimate Twitter apps.

The point is, once you've shipped something down to a user that contains a string that needs to be used by the app, it's always possible for someone to extract it. The only real way around this is to use a "hardware security module" where the secret is stored in a microprocessor that has no ability for anything to programmatically extract it, where that microprocessor can cryptographically sign data instead of sending the secret itself.

At the end of the day, if you've shipped code to the user, in either uncompiled or binary form, it will be possible for them to see what's inside.

## HTTPS requests can be intercepted from mobile apps

Even if you think you've got the most clever obfuscation technique and are sure that nobody could ever extract the secret from your app's binary file, there's another way someone can find out the secret.

Unlike an application running on a server in a datacenter, mobile apps run in the device in the user's hand, on a wide variety of networks. The user might install the app while on their home network, then open it again from a coffee shop, then they may open it from a hotel before they've authenticated to the captive portal. None of these networks can be trusted, and there are a lot of opportunities for things to go wrong, or for attackers to try to intercept data!

You're probably thinking "but HTTPS will protect the data in transit!" And that's totally right, under normal circumstances. As long as the app is properly validating the HTTPS certificate when it makes the request, it's virtually impossible for an attacker between the phone and the server to see the traffic.

But, that's not the threat we're worried about here. If someone wanted to, they can intentionally intercept their own HTTPS connection right as it leaves their phone, by providing their own HTTPS certificate for the URL of your API. There are plenty of tutorials online for how to do exactly this! It's actually a great technique you can use to test your own applications as you're developing them, and is a common way people have reverse engineered otherwise private APIs like Instagram. 

If you're interested in trying this out, check out tools like [Charles Proxy](https://www.charlesproxy.com/) or the free [mitmproxy](https://mitmproxy.org/). It takes a few steps to set these up, so we'll leave that as an exercise for the reader.

Once you've got your own certificate authority installed on your phone, your new fake certificate authority can issue an HTTPS certificate for any domain, and as far as your phone is concerned, everything looks normal. It's just that your phone is actually making an HTTPS request to software running on your laptop, and your laptop starts a new HTTPS request to the real API. This way your laptop can see everything that the phone is sending to the API.

Of course this is not something that an attacker is going to realistically do to intercept a random user's data in transit, but if someone wanted to find out the secret used by an app, they could do this to their own phone and easily see all the data the app sends over the wire. This means that despite your best efforts of hiding your app secret in the source code, it's still going to be sent over the wire where it can be intercepted.

## How does this relate to OAuth?

Alright, so we've seen two ways that API keys and secrets can be extracted from a mobile app. But how does this relate to OAuth?

Well, traditionally, OAuth 2.0 apps are issued a `client_id` and `client_secret` when the developer registers an app. This works fine when the app is running on a web server as the users of the app never have access to the source code and therefore don't have the opportunity to see the secret. However, this obviously causes problems when we try to use OAuth 2.0 from a JavaScript or native app, since as we've seen, they don't have the ability to keep secrets.

In OAuth 1, a secret was required in order to make every API request, which is one of its major shortcomings, and largely why it was replaced with OAuth 2.0. OAuth 1 was developed before mobile apps were as prevalent as they are today, so it wasn't developed with these constraints in mind.

That changed with OAuth 2.0, especially once the PKCE (proof key code exchange) extension was introduced. I like to think of PKCE as an "on the fly" client secret. Instead of shipping a `client_secret` in a mobile app, the way PKCE works is the app creates a new random secret every time it starts the OAuth flow. This way there are no secrets shipped ahead of time, and there is nothing useful for an attacker to steal. You can read more details about how PKCE works in our blog post "[OAuth 2.0 for Native and Mobile Apps](https://developer.okta.com/blog/2018/12/13/oauth-2-for-native-and-mobile-apps)" or on [oauth.com](https://www.oauth.com/oauth2-servers/pkce/).

OAuth still sends access tokens over the wire where they may be visible to you if you're using something like `mitmproxy`, but the difference is that this token is issued on the fly and is specific to the user who is using it! This way, there are no secrets shipped in the source code, and if someone wants to intercept the traffic from their own device, all they will see is an access token that was issued just to them! They won't get access to anything their app can't already access.

## How to protect secrets in mobile apps

Hopefully you now have an understanding of why it's not safe to ship API keys or other secrets in mobile apps. So what do you do instead? 

OAuth solves this problem by not shipping any secrets in mobile apps, and instead involving the user in the process of getting an access token into the app. These access tokens are unique per user and every time they log in. The [PKCE extension](https://www.oauth.com/oauth2-servers/pkce/) provides a solution for securely doing the OAuth flow on a mobile app even when there is no pre-provisioned secret.

If you need to access an API from a mobile app, hopefully it supports OAuth and PKCE! Thankfully most of the hard work of PKCE is handled by SDKs like [AppAuth](https://appauth.io) so you don't have to write all that code yourself. If you're working with an API like Okta, then Okta's own SDKs do PKCE automatically so you don't have to worry about it at all.

## Learn more about OAuth and API security

If you'd like to dig deeper into these topics, here are a few resources:

* [PKCE on oauth.com](https://www.oauth.com/oauth2-servers/pkce/)
* [OAuth 2.0 for Native and Mobile Apps](https://developer.okta.com/blog/2018/12/13/oauth-2-for-native-and-mobile-apps)
* [What is the OAuth 2.0 Authorization Code Grant Type?](https://developer.okta.com/blog/2018/04/10/oauth-authorization-code-grant-type)
 
If you liked this post, you should [follow us on Twitter](https://twitter.com/oktadev)! We also have a [YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q) where we publish screencasts and other videos.
