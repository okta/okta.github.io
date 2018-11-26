---
layout: blog_post
title: "Everything You Need to Know About the Twelve-Factor App"
author: rdegges
description: "A breakdown of the twelve-factor app pattern and how you can use it to build more secure web services."
tags: [twelve-factor, best practices, patterns]
tweets:
- "Want to build more secure web services? Read @rdegges' article on the twelve-factor app and learn how:"
- "Familiar with the twelve-factor app? If not, you'll want to read this:"
---

{% img blog/twelve-factor/twelve-factor.png alt:"the twelve-factor app" width:"800" %}{: .center-image }

Ever heard of the [twelve-factor app](https://12factor.net/)? Earlier this week I was scrolling through one of my favorite websites, [Hacker News](https://news.ycombinator.com/), and stumbled across the twelve-factor app for the first time.

While I didn't have time to read the official twelve-factor website, I wanted to take some time to share my thoughts about building twelve-factor apps, why they're important, and what you need to know about them.

Writing secure web applications can be really difficult!

My hope is that this guide shows you how you can make any web app far more secure by following the principles laid out in the twelve-factor app. Thanks [@hirodusk](https://twitter.com/hirodusk) for creating the twelve-factor app and teaching new developers like me more about web security! &lt;3


## Why You Need Twelve Factor

{% img blog/twelve-factor/stick-figure-teacher.png alt:"stick figure teacher" width:"200" %}{: .center-image }

The idea behind the [twelve-factor app](https://12factor.net/) app is simple: logging users into websites and mobile apps is insecure. No matter how much time you spend securing your websites and mobile apps, it still isn't enough.

Think I'm exaggerating? Just take a look at some of the largest [website hacks](http://lmgtfy.com/?q=famous+website+hacks) over the last few years. Tons of massive companies with large engineering teams and amazing security prowess have all become the victims of relatively simple exploits.

The twelve-factor app is an excellent security pattern designed to dramatically improve the security of any website or mobile app that users log into, making them almost completely impenetrable.


## The Problem with Current Login Technology

{% img blog/twelve-factor/rage-face.png alt:"rage face" width:"200" %}{: .center-image }

Time for a quick history lesson.

Back in the day, when programmers would build a login page for a website or mobile app, they'd typically craft something simple that accepted a username *or* email address and password.

When the user would enter this information correctly, they'd be immediately logged into the website or app.

While this was simple and straightforward, it ended up being a huge security issue as attackers could simply guess a user's username/password over and over again until they got lucky and were able to access their account.

Because modern computers are so fast (*thanks a lot, [Gordon Moore](https://en.wikipedia.org/wiki/Moore%27s_law)!*) attackers can now guess many username/password combinations quickly, meaning that a skilled attacker can compromise your account even if you have a long, random password. Boo.

Once developers began realizing that username/password login was insecure, they started to experiment with multiple factors.

The way two-factor authentication worked was a little more complicated, but far more secure:

- A user would visit a login page and enter their username/password just like before
- If the username/password entered were valid, then the user would receive an SMS message containing a number
- The user would then be required to enter that number into the website to *prove* that they had access to their cell phone, and that the user was therefore who they claimed to be

This was a great advancement for web security at the time because even if a hacker was able to steal your username and password, they'd also have to steal your phone to be able to actually log in.

But... Not long after two-factor became a popular method of authentication, problems appeared. Hackers found ways to [compromise SMS](https://www.theverge.com/2017/9/18/16328172/sms-two-factor-authentication-hack-password-bitcoin) as a protocol and gain access to text messaging capabilities without ever stealing your phone.

And with that the entire security industry was back to square one.

As SMS codes faded into a distant memory, multi-factor authentication was becoming popular. Multi-factor authentication is a pattern that allows a user to register different *factors*, for example:

- SMS
- Google Authenticator
- Authy
- Okta Verify
- Yubikey
- etc.

This way, a user can choose which type of factor to use after entering their username and password on a website. By allowing users to use different types of factors other than SMS, a hacker's job becomes much more difficult.

If a hacker wanted to break through multi-factor authentication, they'd need to learn to exploit whatever factors a user had configured. And that is hard work.

Which brings us to today. Today, multi-factor authentication is quickly becoming a standard, but still suffers *severe* security limitations: it's only as secure as the amount of factors you use.

While multi-factor is awesome in that it allows a user to pick and choose what type of factor they log in with (outside of their username/password), it simply doesn't go far enough.

If an attacker is able to successfully guess your username/password, they'll also be able to see what factor you've configured to log in with. Let's say you've configured your [Github account](https://github.com/), for instance, to support Google Authenticator.

All an attacker needs to do at this point is hack your Google Authenticator and then *bam*: you're right back to where you started — completely insecure.

Which brings us to the new official security recommendation of 2018: the twelve-factor app.


## What is the Twelve-Factor App?

{% img blog/twelve-factor/confused-stick-figure.jpg alt:"confused stick figure" width:"100" %}{: .center-image }

The twelve-factor app is a new best practice for building secure login systems that picks up where multi-factor left off.

Instead of allowing a user to configure different factors they can choose from to log in — a twelve-factor compliant app *requires* each user to have twelve different authentication factors and to use them *each time* they log into a website or mobile app.

Here's an example of a twelve-factor compliant app:

1. A user visits a website and enters their username/password (factor 1)
2. The user then receives an SMS message and types in a code
3. The user then opens their Google Authenticator app on their phone and enters the code from there
4. The user then opens their Authy app on their phone and enters the code from there
5. The user then opens their Okta Verify app on their phone and enters the code from there
6. The user then uses FaceID to have their face detected
7. The user then presses their finger up against the fingerprint scanner on their phone and uses that to confirm their fingerprint
8. The user then says their "voice password" out loud when their phone prompts them (this does voice recognition)
9. The user then enters their preferred credit card number into the app when requested to confirm that their billing details are known
10. The user then enters their social security number which helps verify their identity
11. The user then enters their birthday
12. Finally, the user enters private genome data about themselves that is cross-referenced against the [23andMe API](https://api.23andme.com/)

While this process is slightly inconvenient for a user to repeat each time they log in, in provides superior protection against attackers and makes you virtually hacker-proof.

Let's say an attacker is able to get a hold of your username/password and your phone: they'd still have to compromise a TON of other things about you (your face, your fingerprint, your credit card numbers, your social, a sample of your blood, etc.) before they could ever log into your account!


## How to Adopt Twelve-Factor in Your Apps

{% img blog/twelve-factor/stick-figure-beard.jpg alt:"stick figure beard" width:"150" %}{: .center-image }

The twelve-factor app takes the concept of multi-factor authentication to the next level and is the minimum needed to keep mainstream websites and mobile apps secure.

While it does take a little bit of extra time to build out a twelve-factor compliant app, it can certainly be done. Here are some steps I'd recommend taking immediately:

- Write down a list of twelve separate factors you intend to support (including username/password)
- Look up API services that can easily offload some of this work:
  - [23andMe](https://api.23andme.com/)
  - [Twilio](https://www.twilio.com/)
  - [Okta Verify](https://developer.okta.com/)
  - etc.
- The next time your users log into your application, require them to connect twelve separate authentication factors to their account so that the next time they log they will be used

One side effect of implementing a twelve-factor app is that you'll definitely receive a lot of user support calls, but in my experience, offloading that to your support team will generally be fine. Since twelve-factor apps are increasingly common, your support team is most likely already familiar with helping users configure their twelve factors, sign in, etc.

With that said, I hope you enjoyed this brief breakdown of the twelve-factor app and some in-depth information about how you can use it to make your sites more secure.

Please [tweet at me](https://twitter.com/rdegges) if you have any security questions! Now go out there and make your applications more secure!


## Gotcha!

{% img blog/twelve-factor/stick-figure-happy.gif alt:"stick figure happy" width:"200" %}{: .center-image }

Congratulations on making it this far: happy April Fools' Day!

I'm not insane (*despite what my friends and co-workers might tell you*), and I'm also not advocating that you use *twelve-factor* authentication for your apps.


## What is Twelve-Factor, Really?

{% img blog/twelve-factor/stick-figure-eyeroll.gif alt:"stick figure eyeroll" width:"200" %}{: .center-image }

The [twelve-factor app](https://12factor.net/) is a collection of best practices for building modern web applications. It's called twelve-factor because there are twelve separate guidelines that it recommends every developer follow to build simple and scalable applications:

1. Use one codebase with version control to track many deploys
2. Explicitly declare and isolate dependencies
3. Store your configuration in environment variables
4. Treat backing services as attached resources (databases, file servers, etc.)
5. Strictly separate the build and run stages of your deployment pipeline
6. Execute your app as one or more stateless processes
7. Export your services via port binding
8. Scale out via the process model
9. Maximize robustness with fast startup and graceful shutdown
10. Keep development, staging, and production as similar as possible
11. Treat logs as event streams
12. Run admin/management tasks as one-off processes

One of my programmer heroes, [Adam Wiggins](http://about.adamwiggins.com/) (co-founder of one of my favorite services: [Heroku](https://www.heroku.com/)), is the creator of the twelve-factor app pattern.

With that said, it should be obvious that the twelve-factor app has nothing to do with multi-factor authentication.


## Why is Twelve-Factor Authentication Bad?

{% img blog/twelve-factor/stick-figure-thinking.jpg alt:"stick figure thinking" width:"250" %}{: .center-image }

While it's true that more factors provides more security, twelve-factor authentication is bad for a few primary reasons.

First of all, the more factors you require a user to enter each time they log in, the less they'll log in. If you had to enter twelve separate proofs about yourself upon each login you'd go crazy.

Second, what a lot of people don't realize is that each factor your application supports places a really high burden on your development team.

Maintaining all sorts of connectors and verification methods to do things like verify SMS codes, Google Authenticator codes, Yubikey key presses, etc. can take a ton of time and effort to build and maintain.

Finally, twelve-factor authentication as I laid it out above would also create an insane burden on your support team (if you have one). Imagine the amount of customer support phone calls and emails Netflix would receive if one day they require you to go through twelve factors of authentication to login; there'd be riots in the streets of San Francisco!


## Multi-Factor is Good, but Adaptive Multi-Factor is Better

{% img blog/twelve-factor/nerdy-stick-figure.png alt:"nerdy stick figure" width:"200" %}{: .center-image }

Multi-factor authentication is awesome:

- It allows your users to prove themselves with only a little bit of inconvenience.
- It allows your users to add multiple "factors" to select from when logging in — this way, if you add both an SMS factor *and* a Yubikey factor you can still log into your account even if you forget your Yubikey device..

The problem with multi-factor authentication, however, is the same exact problem you'd have implementing twelve-factor authentication as well: it's annoying.

I'll give you an example: when I log into my bank account, I'm *always* prompted to enter an SMS code from my phone. It doesn't matter if I've just been away from my computer for 30 minutes, I've always got to re-authenticate using my second factor each and every time.

This gets annoying really quick.

To help solve this problem, some really smart people got together and decided to coin the term "adaptive multi-factor authentication", which refers to the strategy of only prompting users for multi-factor authentication *when needed* (eg: being adaptive about it).

For example: let's say I log into my bank website from my house and authenticate with a second factor (like an SMS code).

The website I'm visiting can remember my public IP, my browser, and some other facts about me so that the next time I log in, if these details are the same, the bank website can still trust me and not require me to enter an SMS code again.

By combining modern techniques like machine learning with simple user context it is possible to relax multi-factor requirements while still retaining a high level of security and a maximum amount of usability.

Once you've gotten used to adaptive multi-factor, there's no going back. At Okta, our [adaptive multi-factor authentication solutions](https://www.okta.com/products/adaptive-multi-factor-authentication/) are incredibly popular.


## Best Practices for Secure Login

{% img blog/twelve-factor/stick-figure-officer.gif alt:"stick figure officer" width:"100" %}{: .center-image }

Thanks for reading this far, I hope you had as much fun reading this as I had writing it!

To sum things up, here's what I'd recommend you do when trying to build applications that are not only secure, but also convenient:

- Allow users to register one or more factors when they sign up for your service (SMS, Yubikey, Google Authenticator, Okta Verify, Authy, etc.)
- Try to discourage users from using insecure factors (like SMS)
- Use adaptive multi-factor when possible so that your users won't be bombarded with authentication proof requirements upon every login

If you do the above you're getting the best of both worlds: security and convenience.

That's all for now, please [hit us up](https://twitter.com/oktadev) if you have any questions or leave a comment below.
