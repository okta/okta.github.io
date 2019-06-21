---
layout: blog_post
title: "5 Essential Tips for Building Developer Libraries"
author: laura-rodriguez
description: "Tips on how to build developer tools with a great developer experience based on the work we've done at Okta!"
tags: [devex, Developer Experience, sdk, api, documentation]
tweets:
- "Here are five essentials tips on building developer libraries from @rod_laura's experience at @okta! #devex"
- "Want to build better libraries for developers? Here are five essentials tips from @rod_laura's based on her experience at @okta! #devex"
image: blog/featured/okta-vue-tile-books-mouse.jpg
---

As a software developer, it's your job to know your customers and their use cases well enough to create an elegant and functional solution. This understanding will help you succeed and ultimately enjoy watching them love and use your applications.

When building libraries, your clients are other developers just like you, and in addition to providing a functional library that meets their needs, you need to deliver a great experience when using your product.

In this post, I walk you through a list of best practices I've learned from my time on the Okta Developer Experience (DevEx) Team ❤️.

## Open Source + Open Mind = Win!

The benefits of open source are so many that they deserve their own blog post. However, I would like to mention a few reasons I believe open source is important in terms of personal development, community, and developer relations.

### Feedback

Open source development can be really rewarding, not only for the developers that own the repository but also for external contributors. Especially if you have an open mind, and you are willing to learn from others.

By creating a public repository for your library, you are allowing transparency, everything you do is right there, accessible to anyone.

More than that, you are giving others the opportunity to understand your library better, to provide feedback, to find and fix bugs, to add their code to your repository, and perhaps, to improve their coding skills by learning from you. In the meantime, they are getting better at reviewing code written by others. This is one of the most rewarding parts of being an external contributor.

On the other hand, as the owner of the repository, you are also exposing your code to external review and improvement. If you have an open mind you can learn a lot from this feedback. You just have to be willing to take constructive criticism and use it to make the library better. 

Sounds like a win-win right?

### Contribution

As I already mentioned, the advantages of open-source software are enormous. So make your projects open source if you can and also make them easy to contribute to.

What is a better way to engage developers with your library than make them feel part of it?

Provide a contributing guide with clear guidelines you'd like them to follow when reporting bugs, submitting pull requests and how the commit messages should look, among others.

Also, enforce a healthy and constructive community by creating and sharing a code of conduct and make it accessible from the contributing guide. 

Finally, be respectful and give developers the recognition they deserve. Take the time to review their pull requests or issues, and give them feedback, even if the issues are not a priority at the moment. Give them kudos when they are doing great so they can feel appreciated. Help them to grow. Keep in mind that contributing to open source might involve a considerable amount of time, and they're not getting paid!

Okta's Developer Experience Team loves open source. We host [all our SDK's code, samples, and API's documentation on GitHub](https://github.com/okta/). So help us to make them better! All contributions are welcome <3

## Communicate Clearly, Especially in Your Documentation

Imagine yourself using a library for the first time. What are the steps you would follow to get started? How much time would you expect to spend?

Now, imagine you know the basics of the library very well, but you need to implement an advanced use case, where would you look for information?

You need to identify all the cases that motivate developers to find something in your documentation, and you need to make sure you have the proper documentation and communication channels for all of them.

Make a list to identify all the possible actors and scenarios:

**First Timers**

* Want to install the library for the first time
* Want to run a "Hello World" example to make sure everything is working 
* Want to know the compatibility with their favorite frameworks

**All Devs**

* Need help with unknown issues / get stuck
* Want to implement common use cases
* Want to troubleshoot well-known issues
* Want to know when a new feature will be available
* Want to know what they can do and how 

**Advanced Devs**

* Want to implement a custom/complex use case

Once you have a list, you need to think about what is the best way to provide information for each case. For example, if you have a public repository, you can put all the installation steps in the README file. You can also add a "Usage Guide" to show how to implement the most common scenarios but make sure your README isn't too long. You can find other ways to give further information.

For step-by-step instructions, you can provide guides in your documentation site and for complex/custom use cases make sure your code is well documented and provide API references.

Even with all these resources, developers might not find all the answers they are looking for in the documentation. That's why ideally you should provide a space to communicate with developers directly. You can use tools like GitHub, Slack, or a Developer Forum to give them the opportunity to reach out and ask for help or request new features.

Make sure to include all the available communication channels in the README. This is going to be super helpful for developers looking for information.

At Okta, documentation is as important as the libraries we build. We have recently published new [step-by-step guides](https://developer.okta.com/guides/) with code samples written in the most popular programming languages for the most common use cases. We wanted to improve our existing [quickstarts](https://developer.okta.com/quickstart). Check it out and let us know what you think! We would love to hear your feedback.

## Build a Wide Variety of Samples

In addition to those resources mentioned above in the documentation section, you need to provide sample applications.

Developers love to have things working quickly, and they appreciate working applications that are easy to configure, build, and run. This is an effective way for new users to learn quickly, and also for everyone to experiment with things faster. I usually use sample projects to test new features or reproduce bugs; it helps me save time.

We have a lot of positive feedback from [our samples](https://github.com/okta?q=samples), that's why we work hard to provide different samples in the most popular languages and frameworks and keep them up to date.

## Share Your Library via Your Blog

Blogging is an effective way to help developers to learn about your libraries and what they can do. Your blog a good opportunity to have a more informal communication and to show how your library works with other well-known frameworks.

Also, you can talk about best practices or share anything you think will be interesting or useful for your community. Blog comments can engender excellent discussions and even help surface bugs in your code or missing notes in your docs.

I personally find it really interesting to read blog posts about my favorite developer tools to keep myself up to date, and I believe lots of other devs agree. Not for nothing, blogging is very popular these days.

## Think Holistically About Your Community

In case you hadn't noticed, all these tips really boil down to one key theme. In building a functional and useful developer library, you're also creating a community of developers who are using that tool. Building that community requires much more work than just writing code. What else do those developers need to allow them to use your library and enable their apps? Good documentation, samples, blog tutorials, and support and great first steps, but once you've achieved them you need to think about going beyond. Are there related tools that provide even greater utility?  Have you created a space for your community to reach out when they need help? Let others learn from you and be open to learning from others.

In my time at Okta I've worked on our open source .NET SDKs. I love the .NET community that I get to work with, and I'd love to have you explore the ecosystem of code and content we've created to support that community. Here are some resources you can check out:

* [Build a REST API with ASP.NET Core](/blog/2019/04/10/build-rest-api-with-aspnetcore)
* [Build a CRUD App with ASP.NET Core and SQL Server](/blog/2019/04/24/crud-app-aspnet-core-sql-server)
* [Build a GraphQL API with ASP.NET Core](/blog/2019/04/16/graphql-api-with-aspnetcore)
* [Our ASP.NET Product Documentation](/code/dotnet/aspnetcore/)
* [Okta ASP.NET Samples](https://github.com/okta/samples-aspnet)

If you're interested in more of our .NET or application security content, please check out our [YouTube channel](https://www.youtube.com/c/oktadev), or follow [@oktadev](https://twitter.com/oktadev) on Twitter!
