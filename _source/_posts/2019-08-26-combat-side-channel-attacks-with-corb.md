---
layout: blog_post
title: "Combat Side-Channel Attacks with Cross-Origin Read Blocking"
author: tom-abbott
description: "Find out what those CORB errors mean and how CORB protects your application from hardware-layer vulnerabilities."
tags: [CORB, appsec, spectre, vulnerabilities, security, meltdown]
tweets:
  - "Have you ever wondered why you started seeing CORB errors? Find out all about Cross-Origin Read Blocking!"
  - "Check out how CORB protects against side-channel attacks. Because software-layer attacks weren't enough to think about!"
  - "Take 10 minutes to learn what CORB is and how it helps protect your applications and users."
image: blog/corb/corb.png
---

As if developers didn't have a big enough task securing web applications from software-layer attacks, they now have to contend with another threat: hardware-layer vulnerabilities. 

These complex cybersecurity flaws were introduced long before many modern developers began coding and extend from the inner workings of a computer's silicon to a web application's code. If exploited, hardware-layer vulnerabilities can result in leaked information from the web browser to an attacker.

Luckily, Cross-Origin Read Blocking (CORB) is here to save the day. 

## What is Cross-Origin Read Blocking (CORB)?

CORB is a way of protecting sensitive information delivered to a web page by identifying and blocking malicious cross-origin resource loads. In other words, CORB could save your web application from being the nexus for a security leak.

CORB is a direct response to a cybersecurity threat that gained significant mindshare in the last 18 months: the side-channel attack.

A side-channel attack is a trick used by attackers to extract critical information from a system that doesn't allow direct access to it. It works by looking at the effects of that information rather than the information itself—sort of like guessing the contents of a Christmas present. Its wrapping prevents you from seeing the gift, but its shape and the hard, clunking sound it makes when you rap it with your finger tells you Grandma relented this year and gifted you a nice drink rather than another set of reindeer socks.

## Why Does CORB Exist?

In late 2017, hackers got the best Christmas present of all, courtesy of  modern architectures. This time, though, the gift wasn't a bottle of wine; it was a way to sniff users' sensitive data. Enter Spectre and Meltdown, two side-channel attacks exploiting the same basic vulnerability present in the majority of computer chips manufactured for the last two decades.

The vulnerability revolved around speculative execution, which is a technique that pre-calculates the next set of likely instructions in a program while waiting for a computing thread to process existing ones. 

Speculative execution deals with sensitive data and stores it in the CPU cache. Attackers can tell whether there is data in the CPU cache by querying it, and because of the way computer memory works, they can use the addresses storing the data to deduce what it is. This means they can gain access to protected data that a program has stored in memory—that program could be a web browser, and the data could be something sensitive that it is processing.

Vendors patched Meltdown, but Spectre is far harder to exorcise and will plague users until chip designers vanquish it in future hardware releases.

## Why Do I See CORB Errors? 

Web browsers can request two types of resources from a server: data (e.g. HTML, XML, or JSON) and media (e.g. images, JavaScript, or CSS). A browser can request media resources from any origin (that is, any domain, enabling developers to include cross-origin requests in tags like `<img>` and load a website's images from another origin. You can also do the same with `<script>` to load JavaScript from another origin.

The problem is these calls aren't always safe. What happens if we make a cross-origin call to an image or a script that turns out not to be an image or a script at all but a JSON file containing customer credit card information or a medical record?

Under normal circumstances, the browser will access the file and display a rendering error when it realizes it isn't the image it expected. It will also put the file's data in memory while it processes it, making it vulnerable to a side-channel attack. At that point, a successful Spectre attack can leak it.

That's bad enough, but there's also another kind of attack that could cause the data to leak. This is a Cross-Site Script Inclusion (XSSI) attack, and it exploits JavaScript.

The attack uses a `<script>` tag to reference something that isn't a script. Then one of many attacks, such as an array construction attack, is used to read what's in the target file using JavaScript, enabling an attacker to see the data.

Fortunately, most modern browsers already have a mechanism to protect themselves from inappropriate cross-origin requests, called Cross-Origin Resource Sharing (CORS).

CORS is actually a way of relaxing security measures in a controlled way, rather than tightening them. It moderates the Same-Origin Policy (SOP) embedded into most modern browsers. SOP stops a script in one origin from accessing resources in another. It's there to stop one origin from doing something malicious with another's resource. If origin good.com provides a URL that returns your account info when logged in, for example, you don't want origin evil.com making a GET request to that URL and stealing your data.

That blanket approach is too restrictive for most modern websites, which regularly need to access resources from other origins in their scripts. CORS allows selective cross-origin access to data (HTML, XML, and JSON) based on a trusted origin framework.

However, CORS deals mostly with `fetch()` and `XMLHTTPRequest` requests for data. What if your request comes from an `<img>` or `<script>` tag? Or what if there's no use for a file outside of `fetch()` and `XMLHTTPRequest`?

That's where CORB comes in. It prevents the browser from putting this inappropriate data into memory in the first place. It tells the server, "If what I'm requesting isn't the right data type for the request, then don't give it to me, because I have no use for it. That way, I don't have to handle it."

## How Does Okta Use CORB?

At Okta, we use CORB to ensure inappropriate data isn't read into memory. When making a cross-origin call, it uses an `X-Content-Type-Options header` set on something called `nosniff`. As long as the targeted content type has an HTML MIME, XML MIME, or JSON MIME type text/plain header, this tells the server that the browser need not examine (sniff) the file.

In response, the server removes the response headers and replaces the response body with an empty body. This returns an empty resource, meaning the browser can't possibly load it into memory, and so an attacker can't steal it. The only exception here is with XML files that use the `image/svg+xml` type, which is CORB-exempt.

Even if you don't include a `nosniff` command, CORB will still do its best to weed out inappropriate files. It does this by sniffing the response to work out its content type. This is a backup, though, to help with incorrectly labeled cross-origin responses, based on a best-effort heuristic approach. Using `nosniff` should still be your primary means of protection.

## Use CORB to Address Side-Channel Vulnerabilities

CORB is a thoughtful response to Spectre and Meltdown, which changed the security requirements for web developers. Before these persistent side-channel vulnerabilities came to light, most web developers only needed to focus on application-level security. Afterward, they had to consider how the browser managed its memory in the request lifecycle—that represented a new and daunting task for many developers.

CORB enables the browser to do the heavy lifting for the developer. Okta is glad to support it and protect its customers and partners.

## Read More About Security

For more information about browser development and security, check out these other posts from the Okta Developer blog:

* [Bootiful Development with Spring Boot and React](/blog/2017/12/06/bootiful-development-with-spring-boot-and-react)
* [10 Excellent Ways to Secure Your Spring Boot Application](/blog/2018/07/30/10-ways-to-secure-spring-boot)
* [Build a Web App with Spring Boot and Spring Security in 15 Minutes](/blog/2018/09/26/build-a-spring-boot-webapp)

Leave a comment below, find more from the Okta team on [Twitter](https://twitter.com/oktadev), and watch us on [YouTube](https://www.youtube.com/c/oktadev)!

