---
layout: blog_post
title: "How the EU Cookie Law Affects Authentication"
author: rdegges
tags: [law, programming, security]
tweets: 
  - "Wondering if the EU Cookie Law affects you? Read the synopsis by @rdegges here:"
  - "Are you trying to work around the EU Cookie Law? Be smart! Read our in-depth article on the topic→"
---

**NOTE**: *This blog post is provided for informational purposes only and is provided as-is, without any warranty (even though we had one of our lawyers take a quick look).  While it touches on certain legal concepts, it does not constitute legal advice.  If you or your organization requires legal advice, please be sure to contact an attorney.*

Over the last few years you might have noticed banners like this one popping up on a lot of web pages:

{% img blog/how-the-eu-cookie-law-affects-authentication/cookie-banner.png alt:"EU Cookie Banner Example" %}{: .center-image }

These banners are a direct result of the passage of the EU directive, sometimes
known as the Cookie Law, back in 2011. The EU passed this directive to improve
consumer awareness about how their data are being used by websites and give
consumers the option not to participate in the data collection and tracking
practices that many websites utilize.  The Cookie Law got its name because at the time a majority of the data websites
collected about users was stored in cookies.

Unfortunately, there’s a lot of confusion and misinformation in the developer
community around the EU Cookie Law and how it applies to *web authentication*, a
topic that we here at [Okta](https://developer.okta.com/) care deeply about. =) 

After all: if you need to log users into and out of your web application, you
*have* to store session information someplace. Does this mean if you’re storing
authentication information inside a cookie you need to display the EU Cookie Law
banner on your website?

Today I’m going to clear up any misconceptions you might have about the law and
explain exactly what you need to know to be in compliance.


## The Cookie Law Isn’t About Cookies

{% img blog/how-the-eu-cookie-law-affects-authentication/cookie-monster.gif alt:"Cookie Monster" width:"500" %}{: .center-image }

The first thing we need to talk about is cookies.

As crazy as it may seem, **the EU Cookie Law has absolutely nothing to do with
cookies**. Shocking, right?

The EU Cookie Law is about storing any data about a user that isn’t strictly
necessary for the operation of your website, regardless of where that data is
stored.

For instance: let’s say you’re building an online store like Amazon. Before a
user can purchase goods, they are required to create an account. When a user
creates their account with you, you log them in with a session cookie.

In this scenario, your website is using a cookie to do something that’s required
for your website to operate, so no cookie banner is needed.

If you then decided to add a marketing tool for analytics tracking such as
Google Analytics, Kissmetrics, Optimizely, etc., you would now be collecting and
storing user information in a non-essential way, so you would then need to
implement a cookie banner on your site to remain compliant with the EU Cookie
Law.

## Who Does the EU Cookie Law Apply To?

{% img blog/how-the-eu-cookie-law-affects-authentication/big-bird.jpg alt:"Big Bird" width:"300" %}{: .center-image }

Legally speaking, the EU Cookie Law only applies to companies and websites owned
by a person or entity who resides in an EU country. 

However, if your company is based in the EU or has an EU subsidiary then you are
required to comply with the EU Cookie Law if your website is primarily targeted
at an EU audience. This means that if you’re an EU company running a website
that only serves US customers, you are exempt.

To sum it up: the EU Cookie Law only applies to you if you have a presence in
the EU and your website targets EU visitors.


## Is Local Storage Exempt from the EU Cookie Law?

{% img blog/how-the-eu-cookie-law-affects-authentication/elmo.png alt:"Elmo" width:"300" %}{: .center-image }

The biggest myth floating around the developer world right now regarding the EU
Cookie Law is that if you decide to store non-essential user information in HTML
local storage as opposed to cookies, then you are compliant with the EU law and
don’t need to worry.

This is, of course, completely false.

If you are storing user information for tracking or marketing purposes, you must
show a banner on your website regardless of where you store that information.
Just because the EU Cookie Law has “cookie” in the name, it doesn’t mean that
using an alternate place to store information will make you compliant!


## The Biggest Problem with EU Cookie Law Myths

{% img blog/how-the-eu-cookie-law-affects-authentication/bart.jpg alt:"Bart" width:"300" %}{: .center-image }

The biggest problem I see as a developer entrenched in the security world is
that many web developers are compromising their website security in massive ways
through their misunderstanding of the legislation. Let me explain.

A majority of the developers I’ve spoken with over the last few years mistakenly
believe that:

- User authentication data (session information) falls under the EU Cookie Law
  for regulation
- If they store session information in HTML local storage instead of cookies,
  they can get around the law entirely

Mixing these two pieces of misinformation together creates a dangerous recipe
that has the potential to dramatically affect the security of many websites in
the EU.

Here’s where the root of the problem lies: developers trying to outsmart the EU
Cookie Law by storing their user’s session information in HTML local storage
instead of cookies.

**NOTE**: My worry here is not unfounded. There are many, many websites in the
EU *right now* that are following this pattern and are not only
out-of-compliance, but are also risking major security breaches of their user’s
personal information.

The problem is that **HTML local storage is not a safe place to store sensitive
information like a user’s session data**. HTML local storage is designed to be
accessible to client-side JavaScript code, which puts you at risk for
[cross-site scripting
attacks](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)) (XSS) which
just so happen to be one of the most common attacks
([pdf](https://www.owasp.org/images/7/72/OWASP_Top_10-2017_%28en%29.pdf.pdf))
and one of the hardest to prevent across the entire internet!

In short: when handling sensitive information like user session info, you must
always store that data in cookies (with the [httpOnly flag
set](https://www.owasp.org/index.php/HttpOnly)). If you don’t, you’re opening
yourself up to a massive surface area of potential attacks, all of which have
the capacity to allow attackers access to your most sensitive information: user
details.


## EU Cookie Law Summary

It’s unfortunate that the EU Cookie Law is named like it is. The name of the law
has confused tons of developers across the EU and is responsible for a lot of
misinformation about compliance.

Please make sure that you do the following things if you’re an EU website owner
running a service targeted at EU visitors:

1. Only store session information for your users in cookies (not local storage!)
   with the [httpOnly flag](https://www.owasp.org/index.php/HttpOnly) set.
2. If you have any services on your website that collect non-essential user
   information (usually marketing and advertising tools) in any way (via local
   storage, an API, cookies, etc.) *then* you are required to display a cookie
   banner on your site

If you follow the two rules above, you’ll be OK.

Please leave a comment below if you’ve got any questions or [email
me](mailto:randall.degges@okta.com).
