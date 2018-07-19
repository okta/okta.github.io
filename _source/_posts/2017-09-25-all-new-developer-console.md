---
layout: blog_post
title: "The Okta Developer Console: All New, All You"
author: robert
tags: [okta]
---

Hello Okta Blogosphere! Another [Stormpath transplant](https://www.okta.com/blog/2017/03/stormpath-welcome-to-Okta/) here! As you know, the Okta developer experience team has been working hard to make it easier for YOU to work hard... on integrating your applications with Okta. We recently launched an update to our Developer Console, an all-new Okta experience that is catered to your needs as an application developer.  In this post we'll discuss the new features, and why we built it the way we did.

### An Ode To Consoles

I love consoles. Whenever I think of them, I think about mission control for the Apollo missions.  What a true console that was! Real-time, analog data streaming into an organized interface for a person to grok, sooo cool! <3 <3 Well, I don't exactly work at NASA (as I thought I would when I was in 6th grade), but I can still capture this love of data and control for you! Over the last few months my team has built an entirely new Developer Console, and we're really excited to share it with you!

{% img blog/new-dev-console/nasa-console-1.jpg alt:"Default AS" width:"500" %}{: .center-image }

<center><small>Image courtesy of Nasa <a href="https://images.nasa.gov/#/details-S68-55742.html">https://images.nasa.gov/#/details-S68-55742.html</a></small></center>

### Built For You

Our goal for this new Developer Console was simple: make it easier for application developers to integrate their applications with Okta. As you probably know, Okta is a powerful platform, with a range of features from Active Directory syncing to SAML integrations. To date, our Admin Console has been focused on click-to-configure interfaces that make it easy for your IT organization to get things done.

As much as I just LOVE SAML, the world is thankfully moving forward. OAuth 2.0 and OpenID Connect is where everyone is going, and Okta supports these protocols with some [awesome features to boot](https://developer.okta.com/use_cases/api_access_management/). Why is this so great? Because it makes it much easier to integrate your new and existing applications into the Okta ecosystem, enabling you to build richer, more deeply integrated experiences that go beyond the traditional Okta SSO experience that your customers already love.

The new Developer Console is all about bringing you a new experience that is focused on your application development.

### A Picture Is Worth a Thousand Words

But the real thing is even better!  If you'd like to see the new Developer Console IRL, simply create a free Developer Edition account by visiting <a href="https://developer.okta.com/signup/">https://developer.okta.com/signup/</a>.

As an Okta developer, your thousand foot view now looks like this:

{% img blog/new-dev-console/new-dev-console.png alt:"Default AS" width:"700" %}{: .center-image }

There's a lot of new stuff here!  Read on to learn more about each area, and why we're so excited to have this ready for you.

### New Look & Feel

What is a re-vamp without a re-style?  At first glance you'll notice the new color scheme, which is a general change you'll see across the entire developer experience at Okta, including the developer site and documentation pages.

{% img blog/new-dev-console/new-console-nav.png alt:"Default AS" %}{: .center-image }

### Organized Navigation

As an application developer, you need quick access to your application configuration and API Access Management features.  We've moved these to the top-level navigation for quick access.  Looking for something that seems to be missing?  You can always switch over to the Classic UI, using the drop-down in the upper left.  If you do this often, please let us know!  We'll be iterating this new menu over time to ensure we've captured all the common use cases.

### Data You Need

When you first sign in to your Developer Console, you'll be presented with the new Developer Dashboard.  In this view you see metrics that tell you about the number of users and their authentications.  Below that you'll find the system log for your Organization, which can tell you a lot about the health of your Organization, as well as help with debugging integration issues.

Interested in some data that you don't see here?  Reach out and let us know!

{% img blog/new-dev-console/metrics-tiles.png alt:"Default AS" width:"700" %}{: .center-image }

### New Application Creation Wizard

Okta is powerful, and with that power comes a lot of options :) If you've tried to build a custom application against Okta, you likely ran into some questions about which application type to create.  The new developer experience is focused around our [Open ID Connect solutions](https://developer.okta.com/docs/api/resources/oidc), and we've built a new application creation wizard that helps you navigate this.  Simply select the type of application you're building and we'll help you on your way!  Need multiple types of applications?  Not a problem!  Okta is built for that.

{% img blog/new-dev-console/app-wizard.png alt:"Default AS" %}{: .center-image }

### Sane Defaults

In the new application wizard you'll notice that we pre-fill a lot of the values for you.  These defaults are designed to work with our example applications, so that you don't have to do a lot of extra configuration to get a proof-of-concept running.  Of course you'll change these settings as you near production, but the defaults should get you running locally with little effort.

{% img blog/new-dev-console/app-settings.png alt:"Default AS" %}{: .center-image }

### Contextual Help and Examples

Creating and configuring your Okta application is just the first step, from there you need to integrate it into your actual application or service.  As you know, this is best done by example.  When you are creating or editing your application in Okta, there is a new sidebar on the right that will link you to our new [Quickstart Documentation](https://developer.okta.com/quickstart/), tailored to the type of application you are working on.

{% img blog/new-dev-console/quickstarts.png alt:"Default AS" %}{: .center-image }

### Keep Building Great Apps!

Modern development means integrating a lot of SaaS products, including Okta, and none of us have time to waste.  T-minus-zero for your project was technically last week, right? I hope that our new Developer Console helps you get there faster.  So go on, keep building your spaceship!

{% img blog/new-dev-console/nasa-console-2.jpg alt:"Default AS" width:"500" %}{: .center-image }

<center><small>Image courtesy of Nasa <a href="https://images.nasa.gov/#/details-KSC-03pd2450.html">https://images.nasa.gov/#/details-KSC-03pd2450.html</a></small></center>

As always, we're always on and want to hear from you!  If you have any feedback, please hit us up!

-Robert out

P.S. Have you been to [Oktane](https://www.okta.com/oktane) yet?  It's really the best place to see all our new features in action.  My team demo'd the Developer Console there this year and it was a blast!  I hope to see you there next year!
