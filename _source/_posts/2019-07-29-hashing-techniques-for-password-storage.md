---
layout: blog_post
title: "Hashing Techniques for Password Storage"
author: william_dawson
description: "A brief look at password hashing functions and some practical recommendations."
tags: [security, hashing, passwords]
tweets:
- "Password hashing techniques, a guide by @wilsdawson"
- "Interested in #password hashing? Read @wilsdawson's breakdown:"
- "Password hashing techniques explained!"
image: blog/featured/okta-dotnet-bottle-headphones.jpg
---

Picture yourself a year from now. Someone just put your entire password database on Pastebin. User accounts are being hacked by the thousands and your local privacy regulator just called to have a chat. Depending on the hashing algorithm you were using to store your user passwords, you could be in a lot of trouble. As they say, an ounce of prevention is worth a pound of cure, so how does hashing work and what are the best hashing techniques for password storage?

Below, we'll go over the dos and dont's of password hashing and shed some light on the differences between some of the better-known algorithms.

## Hashing Techniques Explained

At its core, a hash function takes a string input and turns it into a garbled string called a hash (or digest). And while that may sound simplistic, password hashing functions have several key properties.

**There are one-way functions.** While a hash function can generate a digest from a given input, it is computationally prohibitive to reverse the function and produce the input given only a digest.
**They are deterministic.** Hashing functions will produce the same digest given the same input, every time.
**They are also unique.** No two inputs will ever produce the same digest.

By hashing a password according to best practices and storing the digest, a web site can prevent leaking a user's raw (plain text) password in the event that its password database is breached. If an attacker breaches a database of password hashes, they wouldn't have access to users' plain text passwords, which could be used to compromise their identities.

## Evaluating Hashing Algorithms

There are many hashing algorithms that people have used to hash passwords. Two of the most common hashing algorithms you may have come across are MD5 and the SHA-* family of algorithms (SHA-1, SHA-2, SHA-3), but there are several reasons **not to use these**. 

For starters, they are extremely fast. In most areas of computing, you want fast algorithms, but for password hashing, the opposite is true. A slow hashing function makes brute-forcing passwords an expensive, time-consuming process thereby protecting organizations from such attacks.

Cryptographic hashing algorithms like MD5 and the SHA family of algorithms make it easier for attackers to brute force passwords as attackers can use a lot of compute resources (CPUs, GPUs, etc.) to make a lot of password "guesses" in a short period of time.

Another problem with these algorithms is that they don't natively use a salt, which is a useful tool in protecting hashed passwords. Unless coerced, users often take the path of least resistance by using passwords that are easily guessed. An attacker can hash lots of common passwords then search a database of stolen password digests to find a match.

A salt can fix that problem. Salts are random, unique strings that are either appended or prepended to the user's password before hashing. Because the salt changes the input, it produces a unique hash that won't match with any stolen digests. [Last.fm](https://techcrunch.com/2016/09/01/43-million-passwords-hacked-in-last-fm-breach/) and [Lifeboat](https://www.vice.com/en_us/article/bmvj9m/another-day-another-hack-7-million-emails-and-hashed-passwords-for-minecraft) both used unsalted MD5 hashes for their password storage, which made it extremely easy for attackers to find all of their users' plain text passwords.

## Password Hashing Functions

In stark contrast to cryptographic hashing functions which are built for speed, password hashing functions are designed to be slow to compute and to use as many resources as possible to make brute force attacks slower and more expensive. There are three primary password hashing functions you should know about when storing passwords.

The first is bcrypt. Not only does bcrypt include salts, it also makes brute force attacks substantially more difficult. bcrypt is considered "CPU-hardened", which means that computing a hash requires many CPU cycles. You can also set the number of iterations using a work factor which makes it exponentially harder to brute force. As computers get faster and compute resources become less expensive, you can simply increase the bcrypt work factor to increase resource consumption.

Another option is scrypt. Like bcrypt, scrypt is a CPU-hardened function, but it also has the advantage of being memory-hard. That means it deliberately consumes more memory resources. In addition to specifying how much compute resources are required to compute an scrypt hash, you can also control how much memory is required. This means you can make computing scrypt hashes expensive by forcing attackers to acquire a large amount of both compute and memory resources.

Another less-established but promising hashing mechanism, Argon2, seems to offer the most flexibility yet. Argon2 adds a third dimension of complexity/cost: the number of threads used to compute the hash. This means that attackers need to have not only a large amount of compute and memory resources available but also more physical CPU cores. This makes brute force attacks substantially more expensive to execute.

As you look for the right hashing approach, the main thing to remember is that you shouldn't try and roll your own hashing functions. It's an incredibly complex space with some rarified math. Instead, use established libraries (the more established the better) and accepted algorithms. A little due diligence and extra care now will save your organization considerable embarrassment in the future, not to mention potential regulatory fines.

## Further Security Reading

Interested in more developer-focused security content? Check out some of our other web security articles:

- [Add Authentication to Any Web Page in 10 Minutes](https://developer.okta.com/blog/2018/06/08/add-authentication-to-any-web-page-in-10-minutes)
- [Simple Node Authentication](https://developer.okta.com/blog/2018/04/24/simple-node-authentication)
- [How to Prevent Your Users from Using Breached Passwords](https://developer.okta.com/blog/2018/06/11/how-to-prevent-your-users-from-using-breached-passwords)
- [Announcing PassProtect - Proactive Web Security ](https://developer.okta.com/blog/2018/05/23/announcing-passprotect-proactive-web-security)
