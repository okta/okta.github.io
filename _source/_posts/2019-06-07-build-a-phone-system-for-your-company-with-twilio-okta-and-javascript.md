---
layout: blog_post
title: "Build a Phone System for Your Company With Twilio, Okta, and JavaScript"
author: rdegges
description: "Learn how to build a modern phone system for your business using Twilio, Okta, and JavaScript!"
tags: [ twilio, telephony, phone, javascript, security ]
tweets:
- "Let's build a modern phone systme using @twilio, @okta, and #javascript <3"
- "Interested in telephony? Check out our fun guide that walks you through building a simple business phone system using @twilio and #javascript"
image: blog/twilio-phone-system/okta-twilio-love.png
---

If you've ever worked for a company with more than a few employees, you've probably seen some interesting phone systems.

When I used to work at Cisco, everyone was given a dedicated Cisco desk phone that hooked up to a server somewhere in the company and each employee was assigned a unique phone number and extension.

I never really liked that setup. It annoyed me that I had this big, clunky desk phone taking up space, collecting dust, and generally not being useful.

The one time I *did* actually want to use my desk phone I couldn't figure out how to dial a number to the outside world and spent a frustrating half-hour accidentally calling other departments before I gave up and used my cell.

Not too long after my Cisco experience I joined a smaller company. They didn't have desk phones -- they paid for a fancy Software-as-a-Service solution that gave each employee a dedicated company phone number when they joined and would just forward all of the calls you got to your cell phone.

I liked this a lot -- I used my cell phone for everything but could still share my company number in my email signature, give it to clients, put it on a business card, etc. The learning curve was low and it was simple.

The only problem with that system is that it cost a ton of money. I asked one of the IT guys how much they paid for the service and it was $50/mo/employee -- yikes.

If you're at all interested in learning how to build your own simple phone system for employees, read on! Today I'm going to show you step-by-step how I built mine using two simple (*and cheap!*) API services and a little bit of JavaScript.

## What We're Building

The phone system we're going to design today will be simple. The requirements are basic:

- Each employee who joins the company should get a dedicated company phone number
- That company phone number should forward all calls and text messages it receives to the employee's cell phone. This way, an employee gets a company number for business use but won't need any special hardware or software to use it.
- The system should also be dirt cheap. We should pay for phone numbers but not much else.

Make sense? Great!

## Get Started

The first thing you'll need to do is sign up for both [Twilio](https://www.twilio.com/try-twilio) and [Okta](/signup/).

Twilio is an API service that allows you to do everything communications related:

- Send and receive text messages
- Send and receive phone calls
- Send and receive faxes
- Purchase phone numbers
- Etc.

Okta is an API service that allows you to store user accounts for the applications you build. Okta allows you to do anything authentication related:

- Store user accounts (for both internal employees and external users)
- Log users into web apps, mobile apps, and API services
- Handle things like password reset, multi-factor authentication, social login, etc.
- Synchronize with Active Directory, HR systems, and other "corporate" tools to handle single sign-on and centralize your users in one secure location

## Create a Twilio Account

To get started with Twilio, go [create an account](https://www.twilio.com/try-twilio) now.

Once you've created an account, log into the [Twilio Dashboard](https://www.twilio.com/console) and you'll see your API keys listed there. Your Twilio keys are called an **Account SID** and an **Auth Token**. Take note of these two values and store them someplace, you will need them later when we work with the Twilio APIs.

{% img blog/twilio-phone-system/twilio-auth-tokens.png alt:"Twilio Auth Tokens" width:"600" %}{: .center-image }

We'll be using Twilio to handle all of the telephony related functionality for our phone system. I'm not affiliated with them at all, but love their service. It's incredibly cheap, easy to use, and fun.

Twilio typically charges $1/mo for most phone numbers, < 1 cent per minute for most phone calls, and < 1 cent per SMS message sent. It's a very cheap service, and seeing that most employees won't be using their dedicated company number to make calls (just to receive them), the cost to run our phone system will be very low.

For more info about Twilio's pricing, [visit their website](https://www.twilio.com/pricing).

## Create an Okta Account

[Okta](/) is what we'll be using to store all of our employee data for this example application.

The reason I'm showcasing Okta here is because Okta is probably the largest and most well-known identity company. They've been around for a long time, many companies use Okta to store employee (and user) accounts, and their APIs are simple to use.

Okta is also very cheap. The Okta free tier allows you to have up to **1,000 active monthly users** for no cost, which makes the service 100% free for most smaller businesses. If you want to learn more about Okta's pricing you can visit their [pricing page](/pricing/).

To get started with Okta, go [create an account now](/signup/) and log into your dashboard. Once you're logged into the Okta dashboard, copy down the Org URL from the top-right corner of the page (as pictured below).

{% img blog/twilio-phone-system/okta-org-url.png alt:"Okta Org URL" width:"600" %}{: .center-image }

You'll need this value later.

You'll also want to hover over the **API** dropdown menu and select the **Tokens** option from the dropdown -- this will take you to the token management page (pictured below).

{% img blog/twilio-phone-system/okta-tokens.png alt:"Okta Tokens" width:"600" %}{: .center-image }

Click the **Create Token** button to create a new token and name it whatever you want. Tokens allow you to access Okta and keep track of which application is making what types of requests. I typically like to name my tokens the same name as my project.

In this case, I've named my token "simple-phone-system" (pictured below).

{% img blog/twilio-phone-system/okta-create-token.png alt:"Okta Create Token" width:"600" %}{: .center-image }

Once your token has been created, it will be displayed to you. **COPY THIS VALUE DOWN AND STORE IT SOMEPLACE SAFE!** This is the *only* chance you'll ever have to see what your token is, so be sure to write it down somewhere. You'll need this token later.

This token is essentially your API key for interacting with the Okta service. If you lose your API key, you won't be able to use the API!

Next, you'll want to click on the **Users** tab at the top of the page. This will take you to the user dashboard (pictured below).

{% img blog/twilio-phone-system/okta-users.png alt:"Okta Users" width:"600" %}{: .center-image }

Now, because I don't want this tutorial to stretch on and on, I'm not going to walk you through building a website to store your employee data or sync it with Active Directory or anything like that. Because everyone's requirements are so different that would probably not be very useful.

If you're interesting in seeing how to use Okta to easily store user data, I highly recommend you go read some of Okta's [prior articles](/blog/) on the topic or glance through the [Okta documentation](/documentation/).

Anyhow -- now that you're in the Okta user dashboard page, click the **Add Person** button and create a few users manually. This way you'll have some test accounts to experiment on.

{% img blog/twilio-phone-system/okta-add-person.png alt:"Okta Add Person" width:"600" %}{: .center-image }

There are lots of options when creating a user, feel free to play around with them.

Once you've created a few users, go back and click on each user from the user dashboard page. Then click the **Profile** tab towards the top of the page to view the user's profile information (pictured below).

{% img blog/twilio-phone-system/okta-user-profile.png alt:"Okta User Profile" width:"600" %}{: .center-image }

Each Okta user can have up to 1MB of custom profile data. This is the area you'll want to use to store extra data about a user: their address, their phone number, their avatar, etc.

In this case, the only thing we need is each user's cell phone number -- this way, when we later assign this employee a company number, we'll know which phone number to forward their calls to.

To specify a user's cell phone number, click the **Edit** button on the user's profile and scroll down until you see the **Mobile phone** input box listed (pictured below). Fill in the user's cell phone number (or use your own as a test) and then click **Save** to persist your changes.

{% img blog/twilio-phone-system/okta-phone-number.png alt:"Okta Phone Number" width:"600" %}{: .center-image }

Once you've added in a cell phone number for each of your users, you're ready to roll!

## Install okta-twilify

Now that your services are configured, let's install [twilify](https://github.com/oktadeveloper/okta-twilify). twilify is a command-line program that is meant to be run on a cron-like schedule (every minue, every hour, every day -- whatever time interval works for you).

What twilify does is quite simple:

- It looks through all the user accounts you have stored in Okta
- If a user doesn't have a company number assigned to them yet, twilify knows this must be a new employee, so it will purchase and set up a new company number for the new employee
- twilify will then save the new phone number into the user's profile as the `primaryPhone` field. This way, the user's dedicated work number will always be accessible in their user profile.

By acting as a middleman between Okta and Twilio, twilify is able to automatically transform your company userbase into a cheap, scalable, and simple phone system for every single employee!

To install twilify you'll first need to install Node.js. If you haven't installed Node yet, read through the [official installation guide](https://nodejs.org/en/download/package-manager/) for help.

Once you've got Node installed, you can run the following command to download and install twilify :

```console
$ npm install -g okta-twilify
```

You can make sure twilify is installed correctly by running the command `twilify --help`. If you see the output pictured below, you have it installed properly.

```console
$ twilify --help
Usage: twilify [options]

Options:
  -v, --version                                           output the version number
  -i, --init                                              Initialize the CLI
  -o, --okta-token <oktaToken>                            Okta SSWS token
  -u, --okta-org-url <oktaOrgUrl>                         Okta Org URL
  -s, --twilio-account-sid <accountSid>                   Twilio Account SID
  -t, --twilio-auth-token <authToken>                     Twilio Auth Token
  -p, --prefix <areaCode>                                 Your company's phone number prefix, e.g. 415
  -f, --twilio-function-base-url <twilioFunctionBaseUrl>  Your Twilio Functions Base URL, e.g. https://toolbox-bobcat-xxxx.twil.io
  -h, --help
```

If you'd like to view the source code for twilify you can do so on GitHub here: [https://github.com/oktadeveloper/okta-twilify](https://github.com/oktadeveloper/okta-twilify). Be sure to star the project if you like it!

Before you can actually run twilify and see the magic happen, there's a few small things you need to take care of first on the Twilio side, so let's get right into it.

## Set Up Call Forwarding and SMS Forwarding with Twilio

Before you can get twilify running, you first need to tell Twilio what to do when the new company phone numbers you set up are called or texted.

Because Twilio is an API service and built for developers: all of that is 100% up to you. You can write code in several different ways to instruct Twilio on what it should do with your incoming messages and calls:

- You can use Twilio webhooks. This is the oldest and most common way of handling communication logic with Twilio. The idea here is that you can build a web server, host it somewhere, and every time a person calls one of your company phone numbers (or texts one) Twilio will make an API request from their service to your web server and ask for instructions. You will then be responsible for maintaining your web server, defining logic, etc.
- You can use TwiML bins. These are some pre-built pieces of logic that allow you to perform very simplistic tasks with Twilio *without* the need of a web server. The problem with TwiML bins is that they're XML only (you can't write code in them), so custom logic is pretty limited.
- The final (and newest) option is to use Twilio's new serverless functions. These are all the rage because you (as a developer) can write some JavaScript code in Node, upload it to Twilio, and Twilio will run your code and use that to determine how to handle all inbound calls and messages. This means you don't need to worry about running a web server or anything else!

To keep things simple and showcase the power of Twilio's new functions, I'm going to show you how to build your Twilio logic using their latest and greatest stuff.

### Create a Call Forwarding Function

The first Twilio function you'll need to create is one that will be ran each time someone calls one of your company phone numbers. This code will need to:

- Figure out what employee is being called (based on the phone number)
- Lookup that employee's cell phone number
- Call the employee's cell phone (and also play a nice message)
- Bridge the two calls together so the caller can talk to the employee

To get started, visit the [Twilio functions dashboard](https://www.twilio.com/console/runtime/functions/manage) and click the big red plus sign to create a new function (pictured below).

{% img blog/twilio-phone-system/twilio-functions-dashboard.png alt:"Twilio Functions Dashboard" width:"600" %}{: .center-image }

When you're prompted to create a new function you'll see the screen pictured below. There are a lot of options, but to keep things simple just choose the **Blank** option and start with a clean slate. If you want to experiment with the othre pre-built templates, I'd encourage you to do so later! They're quite fun to play around with! :D

{% img blog/twilio-phone-system/twilio-create-function.png alt:"Twilio Create Function" width:"600" %}{: .center-image }

Once you click **Create** you'll find yourself on a function creation page. For the **Function Name** option, use "Call Forward" as the value. For the **Path** value, use "/call-forward".

Make sure the **Check for valid Twilio signature** box is checked (this is a great security feature that prevents bad actors from attempting to run up your phone bill).

For the **Event** dropdown option, select **Incoming Voice Calls** (because this funtion will only be ran when voice calls are made).

Finally, copy the code below into the **Code** box then click **Save**.

```javascript
const okta = require("@okta/okta-sdk-nodejs");
const MemoryStore = require("@okta/okta-sdk-nodejs/src/memory-store");

exports.handler = function(context, event, callback) {
  const oktaClient = new okta.Client({
    orgUrl: process.env.OKTA_ORG_URL,
    token: process.env.OKTA_TOKEN,
    requestExecutor: new okta.DefaultRequestExecutor(),
    cacheStore: new MemoryStore({ keyLimit: 100000, expirationPoll: null })
  });
  let user;

  oktaClient.listUsers({
    search: 'profile.primaryPhone eq "' + event.To + '"'
  }).each(u => {
    user = u;
  }).then(() => {
    let twiml = new Twilio.twiml.VoiceResponse();

    twiml.say("Please wait. You are being connected to " + user.profile.firstName + ".");
    twiml.dial({
      callerId: event.From ? event.From : undefined,
      answerOnBridge: true
    }, user.profile.mobilePhone);
    twiml.say("Goodbye.");

    callback(null, twiml);
  });
};
```

The `handler` function will be ran by Twilio every single time a new voice call comes in for one of your company numbers. This function will be passed some event data by Twilio (which provides information about the incoming call), and you can respond by returning some Twilio XML (TwiML) in a callback.

The first thing that happens when a new phone call comes in is that Okta's Node library will be initialized. You'll notice that the code is referring to the [Okta Node SDK](https://github.com/okta/okta-sdk-nodejs) as well as some Okta environment variables. We'll get to those later.

The next thing that happens above is that we're going to make a request to Okta and search for any user who's company number (`primaryPhone`) is equal to the Twilio number currently being called. By finding this user we're able to then grab that user's corresponding cell phone number which we'll use to make a call down below.

The final thing that happens is after a user has been matched, we're going to generate some TwiML code using the Twilio JavaScript library that instructs Twilio to:

- Play a message to the caller telling them they are going to be connected and to please wait
- Call the employee's cell phone and bridge the calls together
- Say "Goodbye." to the caller if the employee hangs up first.

And bam! Just like that, with only a few lines of code, you've now configured call forwarding! No web server required.

### Create an SMS Forwarding Function

Now that you've created your call forwarding function, let's do the same for forwarding SMS messages from callers to employees.

Go back to the [Twilio functions dashboard](https://www.twilio.com/console/runtime/functions/) and create another blank function.

This time, the function should be named **SMS Forward**, the path should be "/sms-forward", the **Event** type should be **Incoming Messages**, the **Check for valid Twilio signature** box should be checked, and you should paste in the code below before clicking **Save**.

```javascript
const okta = require("@okta/okta-sdk-nodejs");
const MemoryStore = require("@okta/okta-sdk-nodejs/src/memory-store");

exports.handler = function(context, event, callback) {
  const twilioClient = context.getTwilioClient();
  const oktaClient = new okta.Client({
    orgUrl: process.env.OKTA_ORG_URL,
    token: process.env.OKTA_TOKEN,
    requestExecutor: new okta.DefaultRequestExecutor(),
    cacheStore: new MemoryStore({ keyLimit: 100000, expirationPoll: null })
  });
  let user;

  oktaClient.listUsers({
    search: 'profile.primaryPhone eq "' + event.To + '"'
  }).each(u => {
    user = u;
  }).then(() => {
    twilioClient.messages.create({
      to: user.profile.mobilePhone,
      from: event.To,
      body: "From: " + event.From + "\n\n" + event.Body
    }, (err, message) => {
      callback();
    });
  });
};
```

Look familiar? It should! Most of this code is identical to the call forwarding code from the previous section.

The differences can be found towards the bottom.

Instead of returning some TwiML code to Twilio which instructs it to play a message and connect a call, this time we're going to be firing off an API request to Twilio, telling it to shoot a text message to the employee containing the text message received.

Each time someone texts an employee number the employee will see a text message from their work number that says something along the lines of:

```
From: +15554443333

Hi Randall! I hope you are doing well. I was just texting you
to see if you had some time to teach me about JSON Web Tokens
and why I shouldn't use them this weekend? Over coffee, maybe?
```

Pretty neat, right? You now have SMS forwarding capabilities in just a few lines of code!

### Install the Required Dependencies for Your Twilio Functions

Now that you've had a chance to look at the code that powers your telephony functionality, there are only a few missing pieces, one of which is dependencies.

In the severless functions we created earlier we used the Okta Node developer library. But this is a problem, right? Since Twilio is running this code for us, there is no obvious way to install a Node package, that means this code simply won't run, right?

*Nope!*  It's actually pretty simple. You can tell Twilio what Node libraries you want installed and it will install them for you automatically. =)

Simply head over to the [function configuration page](https://www.twilio.com/console/runtime/functions/configure), scroll down to the **Dependencies** section, then click the big red plus sign to specify any new dependencies you might want to use.

In this case, you'll want to add a dependency called `@okta/okta-sdk-nodejs` and define its version as `1.2.0` (pictured below).

{% img blog/twilio-phone-system/twilio-dependencies.png alt:"Twilio Dependencies" width:"600" %}{: .center-image }

### Specify Secret Environment Variables for Your Twilio Functions

Another problem we had earlier when writing our functions is that we needed some sensitive data in our code, namely the Okta API credentials.

Hardcoding sensitive data like API keys into your code is never a good idea, so what should you do?

Twilio thought of this early on made it easy to solve this problem using environment variables. All you need to do is go back to the [function configuration page](https://www.twilio.com/console/runtime/functions/configure), scroll down to the **Environmental Variables** section, and create two new keys: `OKTA_ORG_URL` and `OKTA_TOKEN`. The values for those settings can be found in your Okta dashboard.

**PS**: You still have the `OKTA_TOKEN` value written down from the setup section, right? If not, you'll need to create a new Okta token because you can only view it once!

{% img blog/twilio-phone-system/twilio-environment-variables.png alt:"Twilio Environment Variables" width:"600" %}{: .center-image }

Finally, you'll want to check the box next to **Enable ACCOUNT_SID and AUTH_TOKEN**. This setting is necessary for sending text messages to Twilio in our SMS forwarding function. This setting will make your Twilio API keys available as environment variables automatically.

And... That's the last bit of setup on the Twilio side! You've now got your business phone system almost ready to go, all you need now is a way to purchase numbers, set them up to run the code you just wrote, and start running things in production!

## Use twilify to Provision Your Company Phone System

Now that all the hard stuff is out of the way, all you need to is configure twilify and run it on a recurring schedule.

You can run twilify by either passing it a list of command line options (which you can read more about by running `twilify --help` on the command line), or by configuring twilify once and saving your configuration data so you don't need to think about it anymore.

To configure twilify interactively run the `twilify --init` command. It will prompt you for a few values:

- Your Okta API token that you created in the setup section
- Your Okta Org URL that can be found on your Okta dashboard page
- Your Twilio Account SID value that can be found on your Twilio dashboard page
- Your Twilio Auth Token value that can be found on your Twilio dashboard page
- A prefix value (the area code that you'd like all your company numbers to share). For example, if you are a San Francisco-based company you might want to set your company prefix to `415`, this way all of your employee numbers look like they are in San Francisco.
- Your Twilio Functions Base URL. This value can be found on the [Twilio runtime page](https://www.twilio.com/console/runtime/overview). Copy this value (pictured below) and add `https://` to the front of it. Mine, for example, is `https://toolbox-bobcat-2584.twil.io`.

{% img blog/twilio-phone-system/twilio-runtime.png alt:"Twilio Runtime" width:"600" %}{: .center-image }

Once you've finished supplying those variables, twilify will store a configuration file for you as `~/.config/twilify/config.json` and read from that file each time you run the command to make things easier.

## Run twilify and Dynamically Provision User Phone Numbers

Now that everything is 100% ready to go, simply run the `twilify` command and watch as it purchases new Twilio phone numbers for you and sets them up.

If everything goes well you should see output similar to the following:

```console
$ twilify
Cleaned up the formatting of a phone number (+18182179229) for Randall Degges.
Purchased a new company number (+19253294108) for Randall Degges.
```

In this case, my user had a phone number that was 818-217-9229. twilify reformatted the number into international format for consistency, then purchased a new office number: 925-329-4108.

If you call that number you'll hear an automated voice say "Please wait. You are being connected to Randall." followed by ringing as the call is connected.

If you text that number I'll receive an SMS message from the office number relaying your message to me.

The system is now live! If you wanted to run something like this in production, all you would need to do is run the twilify program on a server once a day (or something similar). This way, as new employees join your company every day, the program will run and provision a new office number for each new person.

If you wanted to reduce the delay between an employee starting and them getting an office number, you can just increase the frequency at which the twilify program runs. Not bad!

## Build More Amazing Stuff with Twilio and Okta

twilify is a simple tool but showcases some of the fun and valuable things you can build with just a few lines of JavaScript and two simple API services.

If you're looking for a fun way to add communications capabilities to your next app, check out [Twilio](https://www.twilio.com/). If you're bulding a web app, mobile app, or API service that requires user registration, login, password reset, or anything related to user identity, check out [Okta](/)!

Finally, if you enjoyed this article please shoot us a [tweet](https://twitter.com/oktadev), follow us on [twitter](https://twitter.com/oktadev), or maybe even check out some of our other interesting articles:

- [Build a Simple Web App with Express, React, and GraphQL](/blog/2018/10/11/build-simple-web-app-with-express-react-graphql)
- [Build a Desktop App with Electron and Authentication](/blog/2018/09/17/desktop-app-electron-authentication)
- [Build and Understand Express Middleware Through Examples](/blog/2018/09/13/build-and-understand-express-middleware-through-examples)
- [Build a Simple REST API with Node and OAuth 2.0](/blog/2018/08/21/build-secure-rest-api-with-node)
- [Create a Basic Android App Without an IDE](/blog/2018/08/10/basic-android-without-an-ide)

Happy hacking!
