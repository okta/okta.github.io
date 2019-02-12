---
layout: blog_post
title: "If It Ain't TypeScript It Ain't Sexy"
author: reverentgeek
description: "TypeScript is taking the web by storm. Here's what you should know."
tags: [typescript, javascript, web, programming, developer, software]
tweets:
- "If it ain't TypeScript, it ain't sexy. @reverentgeek talks about @typescriptlang's momentum in web development. #typescript"
- "TypeScript is taking the web by storm. Here's what you should know. #typescript"
- "Ask your doctor if @typescriptlang is for you. @reverentgeek is the #TypeScript doctor."
image: blog/if-it-aint-typescript/typescript-is-sexy.jpg
---

A few years ago I got "Jeep fever." I began daydreaming about owning a Jeep, driving around with the top down, and going on trips into the mountains.

That's when it happened.

Everywhere I went, I saw Jeeps. I passed countless Jeeps on the road. There were Jeeps in every parking lot. Practically everyone had a Jeep but me. Where did all these Jeeps come from?!

Logically, I had to assume there was relatively the same number of Jeeps on the road before I got "Jeep fever." I just hadn't noticed until then.

That's kind of how I feel about TypeScript.

{% img blog/if-it-aint-typescript/jeep-front.jpg alt:"Jeep Fever!" width:"600" %}{: .center-image }

Now, I wouldn't call it "TypeScript fever" just yet. I'm still on the fence on using it as a daily driver (more on that later). However, I can no longer ignore TypeScript's momentum. Now that I've started to pay attention, holy type safety Batman, it's everywhere!

## TypeScript is So Hot Right Now

Everywhere I turn it seems TypeScript is getting more attention. More teams are switching to TypeScript. More open source projects are moving to TypeScript or at least supporting TypeScript. Here are just a few of the more recent announcements that caught my attention.

{% img blog/if-it-aint-typescript/typescript-is-so-hot-right-now.jpg alt:"TypeScript is so hot right now" width:"600" %}{: .center-image }

* [Yarn 2.0](https://github.com/yarnpkg/yarn/issues/6953) will be written in TypeScript.
* [Vue.js 3.0](https://medium.com/the-vue-point/plans-for-the-next-iteration-of-vue-js-777ffea6fabf) will be written in TypeScript.
* [Kent C. Dodds](https://kentcdodds.com/) says [every new web app at PayPal starts with TypeScript](https://medium.com/paypal-engineering/why-every-new-web-app-at-paypal-starts-with-typescript-9d1acc07c839).
* [Ryan Dahl](https://github.com/ry), the creator of Node.js, is now working on [deno](https://github.com/denoland/deno), a new server platform that uses TypeScript.

Where is TypeScript on the technology adoption curve? I think it's somewhere around "OMG TYPESCRIPT ALL THE THINGS!"

{% img blog/if-it-aint-typescript/ts-adoption-curve.jpg alt:"TypeScript adoption curve" width:"800" %}{: .center-image }

## TypeScript: The Good

I recently [ran a poll on Twitter](https://twitter.com/reverentgeek/status/1086342643565645825) to get people's opinion of TypeScript. The results are certainly not scientific, but I was surprised at the amount of positive sentiment towards TypeScript. Of the 188 people who responded, 64% currently use it and feel good about it.

The comments were even more interesting. Here are some highlights:

* Higher velocity
* Reduced defects
* Faster on-boarding
* Easier refactoring

> "...a worthwhile investment."

> "Best thing we ever did..."

> "I would not work somewhere that didn't use TypeScript."

For years, developers have argued that test coverage increases confidence in the code we write. TypeScript _also_ increases confidence. That's a good thing.

Due to the current industry buzz, it might be advantageous from a recruiting standpoint to advertise that your team is using TypeScript. A potential candidate might think, "Oooo! An opportunity to use TypeScript!"

## TypeScript: The Bad

TypeScript requires a build step. That might be enough reason for a JavaScript developer to say, "No, thank you." But, maybe you're already using Babel, and you're okay with a build step. Babel has a great ecosystem of plugins, so you'll probably want to hang on to it. Babel 7 supports TypeScript, but coordinating TypeScript's type-checking with Babel can still be tricky.

Adding types is not a trivial task. There's a learning curve to effectively using TypeScript. I've read that TypeScript has helped some teams with on-boarding developers, but I've also read the opposite.

One of the reasons I loved moving from .NET to Node.js was how much less friction there was in writing and maintaining tests. Personally, TypeScript seems to take away some of the freedom of pure JavaScript.

## TypeScript: The Ugly

TypeScript is a leaky abstraction. TypeScript doesn't absolve you from learning JavaScript. When things go awry, you've still got to be able to spelunk the JavaScript code it produces.

{% img blog/if-it-aint-typescript/good-bad-ugly.jpg alt:"The good, the bad, and the ugly" width:"500" %}{: .center-image }

TypeScript doesn't eliminate any of the practices you should be doing with a JavaScript codebase: linting, tests, code reviews. Naively, someone might think you'd write fewer tests with TypeScript. That someone would be wrong.

Type-checking only helps with one class of bugs that can occur in a codebase. [Some would argue](https://medium.com/javascript-scene/the-typescript-tax-132ff4cb175b) the classes of bugs where TypeScript _does not_ help is much, much larger.

[Type definitions](http://definitelytyped.org/) are great... except when they're not. When type definitions are maintained outside of projects, these definitions can get out of sync with the latest versions of packages, leading to unexpected behavior and a lot of frustration tracking down the issue.

## Always Bet On JavaScript
Some years ago, I went through a phase when I used CoffeeScript. Don't worry. I've long since repented. During that time, a very wise person said, "It all comes back to JavaScript. Just be really good at JavaScript."

Today, TypeScript is the hot new thing in web technology. For some teams, it appears to be making a positive impact on their productivity. Is it right for you? That's for you and your team to decide.

I will continue to cautiously dip my toes in the TypeScript waters. I plan to keep experimenting and hope to hit that inflection point where I realize its value. I know it's important. At least in the near future.

Perhaps the popularity of TypeScript will influence the ECMAScript specification, and JavaScript will evolve to include the best of TypeScript. Who knows? One day we may all go back to writing JavaScript again.

{% img blog/if-it-aint-typescript/jeep-back.jpg alt:"I Love JavaScript" width:"500" %}{: .center-image }

## Learn More About TypeScript

Want to learn more about TypeScript? Check out some of these useful resources.

* [Use TypeScript to Build a Node API with Express](/blog/2018/11/15/node-express-typescript)
* [Build and Test a React Native App with TypeScript and OAuth 2.0](/blog/2018/11/29/build-test-react-native-typescript-oauth2)
* [Build a Basic CRUD App with Angular and Node](/blog/2018/10/30/basic-crud-angular-and-node)

Follow us for more great content and updates from our team! You can find us on [Twitter](https://twitter.com/OktaDev), [Facebook](https://www.facebook.com/oktadevelopers/), and [LinkedIn](https://www.linkedin.com/company/oktadev/). Questions? Hit us up in the comments below.
