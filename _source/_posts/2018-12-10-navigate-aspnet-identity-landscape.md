---
layout: blog_post
title: "Navigating the ASP.NET Core Identity Landscape"
author: leebrandt
description: "A quick look over the three most common scenarios for Identity Management in ASP.NET Core"
tags: [aspnet, aspnetcore, identity, authentication]
tweets:
  - "A quick look over the three most common scenarios for handling identity in #aspnetcore"
  - "Interested in the most common ways to handle identity in #aspnetcore? Check it out!"
image: blog/featured/okta-dotnet-books-quarter.jpg
---


These days, users of web application expect a personalized, secure experience. They want to make sure that they can easily get to their own information, and that no one else can access it. Developers of these web applications want a simple way to manage users and be assured that they have secured their users' information from prying eyes. For developers of web applications written in ASP.NET Core, there are several choices for managing user identities. In this post, I'll show you three common strategies for identity management in ASP.NET Core.

## ASP.NET Core Identity
Microsoft has a built-in strategy for identity management. When starting a new ASP.NET Core project in Visual Studio, it's as easy as checking a checkbox to set it up. The project templates will then scaffold the project with the proper classes, a database context, and the database tables needed for storing user information. You can customize the user information by customizing a few classes and running a database migration to update the tables in the database.

The major benefit to this using ASP.NET Core Identity is it's easy to get set up. There's not a lot of knowledge of identity management, authentication, or authorization to get this strategy set up. The other main benefit is the fact that it's free. It comes out of the box with the built-in project templates for ASP.NET Core. The classes, tables, and plumbing needed for it to work take almost no development time, and the strategy has been created by the super-smart folks at Microsoft.

This is also one of the downsides to this approach. As with any generated code, sooner or later you will need to maintain it, update it, and possibly debug it. So even though it costs almost nothing to get started, you still have to pay the maintenance costs of all the code and the database. Even though it is very well documented it can also be a bit more involved to customize it. You'll need to dig in to the classes and interfaces to change the way passwords are hashed or to change or add fields to the user's information, claims, or roles.

## Identity Server
[Identity Server](https://github.com/IdentityServer) is an open source OpenID Connect and OAuth 2.0 framework for .NET developed by [Dominick Baier](https://twitter.com/leastprivilege) and [Brock Allen](https://twitter.com/brocklallen). Dominick and Brock have forgotten more about identity management that most developers will ever know, so you can expect the security and implementation of those security standards to be top-notch. The framework provides you with an Authentication Server to authenticate against. Identity Server is also free of charge, and you host the server yourself. This can be a major plus for organizations that are concerned about hosting services outside their own data center. Like ASP.NET Identity, quite a few of these advantages come with their own problems.

There is a whole business around consulting services to set up and integrate Identity Server into your ASP.NET Core application. There is a bit steeper learning curve as it requires some basic knowledge of OpenID Connect and OAuth 2/0 to get it set up properly. The fact that the code is free is also misleading. You'll still be paying developers and network engineers to set up and maintain a secure server. Keeping the server secure is also left to your security engineers. Not that it's a show-stopper, it's just a cost that most people fail to consider. 

## Identity as a Service Provider
The third, most commonly used approach is to use a service provider like Okta, of course. This has some of the same benefits of using Identity Server in that the provider's solution would be developed by super-smart security folks. You can usually get these solutions set up without much knowledge OpenID Connect or OAuth. You can simply follow the provider's documentation and use their SDKs for interacting with the server. You also won't need to maintain the server or the code that actually performs the authentication. You can also lean on the provider to keep the server secure and the security standards (like password hashing) up to the latest in the industry. This includes advanced security features like social login, multi-factor authentication, and adaptive MFA.  No need to develop or manage this yourself!

As you can imagine, these providers are not generally free services. Another downside for organizations that like to have everything "in-house" is that most service providers don't work this way. It's really the best way to ensure the security of the service, by having in maintained and constantly tested by industry experts. But if your organization doesn't allow services to be hosted elsewhere, this may not be the solution for you. 

Another common problem I hear with providers is being "married" to the provider. This usually means that to implement the provider's solution, you have to write code that only works with that provider. This can make it very hard to switch providers if it becomes necessary. The easiest way to mitigate this downside is to find a provider that uses the current industry standards and to write your code using the principles of good software. You can build your code based on abstractions that make it easier to swap out one implementation for another.

## Final Thoughts on Identity in ASP.NET Core
There is no one solution that fits every organization. ASP.NET Identity might be a good, quick solution for a small startup, with the idea that as the organization and user's needs grow, changing that solution might be in the organizations best interest. Using Identity Server might be a good way to go if your organization is unable (or unwilling) to have services and data stored outside of their own data centers. A service provider can be an excellent choice for those organizations who want to lean on experts in the security field and concentrate their own efforts on developing and maintaining features that add value to their customers. I hate to give the age-old, "It depends." answer to the question of "Which solution is best?", but in the end, you have to choose the solution that's right for your organization.

## Learn More About User Management
Learn more about secureidentity management by reading some of our amazing content:

* [What the Heck is OAuth?](/blog/2017/06/21/what-the-heck-is-oauth)
* [User Authorization in ASP.NET Core with Okta](https://developer.okta.com/blog/2017/10/04/aspnet-authorization)
* [Add Authentication to Any Web Page in 10 Minutes](https://developer.okta.com/blog/2018/06/08/add-authentication-to-any-web-page-in-10-minutes)
* [What Happens If Your JWT is Stolen?](/blog/2018/06/20/what-happens-if-your-jwt-is-stolen)

As usual, if you have any questions or comments about this post, leave them in the comments below. Also don't forget to follow us on [Twitter](https://twitter.com/oktadev), [Facebook](https://www.facebook.com/oktadevelopers/), [LinkedIn](https://www.linkedin.com/company/oktadev/), and [YouTube](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q/)!