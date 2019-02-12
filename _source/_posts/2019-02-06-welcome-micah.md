---
layout: blog_post
title: 'Welcome Micah Silverman'
author: dogeared
description: "We welcome not exactly newcomer Micah to the team."
tags: [security, authentication, api]
tweets: 
- "@afitnerd <3 @OktaDev! Psyched to join the DevRel team! Want to play a game?"
- "I'm psyched to bring my love of APIs, OAuth & OIDC to the @OktaDev DevRel team!"
image: blog/featured/okta-java-short-bottle-headphones.jpg
---

<style type="text/css">
  [data-tooltip] {
      display: inline-block;
      position: relative;
      cursor: help;
      padding: 4px;
  }
  [data-tooltip]:before {
      content: attr(data-tooltip);
      display: none;
      position: absolute;
      background: #000;
      color: #fff;
      padding: 4px 8px;
      font-size: 18px;
      line-height: 1.4;
      min-width: 300px;
      text-align: center;
      border-radius: 4px;
  }
  [data-tooltip-position="left"]:before {
      top: 50%;
      -ms-transform: translateY(-50%);
      -moz-transform: translateY(-50%);
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
  }
  [data-tooltip-position="left"]:before {
      right: 100%;
      margin-right: 6px;
  }
  [data-tooltip]:after {
      content: '';
      display: none;
      position: absolute;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
  }
  [data-tooltip-position="left"]:after {
      top: 50%;
      margin-top: -6px;
  }
  [data-tooltip-position="left"]:after {
      right: 100%;
      border-width: 6px 0 6px 6px;
      border-left-color: #000;
  }
  [data-tooltip]:hover:before,
  [data-tooltip]:hover:after {
      display: block;
      z-index: 50;
  }
</style>

My name is <span data-tooltip="(1) neat-advertisement-immune-sign" data-tooltip-position="left">Micah Silverman</span> and I just joined the Developer Advocacy team at Okta. TL;DR - There are some easter eggs in this post. If you want to know what they're all about - jump to the bottom.

{% img blog/micah_intro/micah_hair.jpg alt:"Micah Hair" width:"800" %}{: .center-image }

Funny thing is, I've been working for Okta for 2 years now, just on different teams.

It was in the Sales Engineering and Education Services teams that I learned all the ins and outs of the Okta Developer API, including our support for standards like SAML, OpenID Connect and <span data-tooltip="(2) exciting-mark-probable-rate" data-tooltip-position="left">OAuth 2.0</span>. And, I went on to teach our developer courses. Check out our [course catalog](https://www.okta.com/services/training/) when you're ready to dig deep into all that Okta has to offer.

I've also been a casual contributor to the Developer Blog as a guest poster. I am very excited now to be an official member of the team. I'll be primarily leading workshops around the country (and the world) to talk about OAuth and OpenID Connect. I will also be contributing more code and posts.

## About Me

I developed an interest in <span data-tooltip="(3) hulking-page-adroit-chance" data-tooltip-position="left">computers</span> right at the beginning of the personal computer revolution when I was in 6th grade. I first played with CBM PETs in school. My first home computer was a Commodore Vic-20. Then a Commodore 64 and even the rare SX-64 (```LOAD "*",8,1 – anyone?```).

{% img blog/micah_intro/micah_computers.jpg alt:"Micah Computers" width:"800" %}{: .center-image }

After learning of what I was doing with my 300 baud modem and phreaking tools, my parents sought a more wholesome outlet for my interests (one that would keep me out of jail, preferably). My father, a dentist, purchased an Osbourne 1 (CP/M for the win!) and had me help him automate his office.

Since then, my love affair with technology has continued to develop and evolve.

I've had a wide-ranging career working at the Syfy Channel for its first online presence, large banks and insurance companies including JP Morgan Chase and Metlife, and startups.

The primary themes have been my love of APIs, information security and teaching others all about them.

I'm a maker at heart, whether it's refurbishing a [Dark Tower](http://afitnerd.com/2011/10/16/weekend-project-fix-dark-tower/) game or building out a MAME arcade cabinet.

{% img blog/micah_intro/micah_mame.png alt:"Micah Mame" width:"400" %}{: .center-image }

## The Love of All Things API

I love connecting systems and functionality via APIs. Especially, things that were not necessarily intended to ever go together.

I wrote a blog post on efficiently working with the [Twilio and Slack APIs](https://www.twilio.com/blog/2017/11/solid-principles-slack-twilio.html) to
accomplish the same thing: showing a random <span data-tooltip="(4) serious-dress-smelly-quilt" data-tooltip-position="left">Magic the Gathering</span> game card.

Maybe not very practical, but it demonstrated some key software development patterns (SOLID) using very different APIs.

## Gamification

I also love <span data-tooltip="(5) gentle-wax-plucky-metal" data-tooltip-position="left">gamifying</span> everything! It's one of the reasons an [early blog post](https://developer.okta.com/blog/2017/10/27/okta-oauth-zork) of mine include playing the text based adventure Zork as a way to learn some of how OAuth 2.0 works.

I'll even make impractical devices or API mashups just to better understand concepts and standards and make it fun along the way.

In fact, this post is an example of that (and the sort of thing you can expect from me).

You see, there are <span data-tooltip="(6) mere-pizzas-calm-grade" data-tooltip-position="left">easter eggs</span> embedded right in this post! Here's the game:

* Text any message to 702-766-4224 (only US and Canada)
    * As a bonus, format your message like: `-<icon id> <msg>` where icon ids can be found at: [https://developer.lametric.com/icons](https://developer.lametric.com/icons) 
* You'll get a response referencing an easter egg in this post
* Text the proper reply to the same number, and your message will be sent to my [LaMetric Digital](https://lametric.com/) message board.
* You can tune into this [twitch](https://www.twitch.tv/afitnerd) stream to see your message display as well as that of other people

My dear friends in Education Services gave me the LaMetric as a parting gift. I wanted to discover how it worked, so I made a mashup of the Twilio and LaMetric
APIs.

My focus on the DevRel team at Okta will be OAuth and OIDC and you can count on me to bring the fun with the learning.

Happy Hunting!

## Spring Boot + Twilio + LaMetric FTW

The app that drives this ridiculous mashup is written in [Spring Boot](https://start.spring.io). It uses the [Apache Fluent](https://hc.apache.org/httpcomponents-client-ga/tutorial/html/fluent.html) HTTP library to interact with the [LaMetric API](https://lametric-documentation.readthedocs.io/en/latest/reference-docs/lametric-time-reference.html). It also uses the [Twilio API](https://developer.lametric.com/) to handle the interaction via SMS.

The source code for this app [can be found on GitHub](https://github.com/dogeared/twilio-lametric).