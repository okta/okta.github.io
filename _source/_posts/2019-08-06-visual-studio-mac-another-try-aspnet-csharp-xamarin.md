---
layout: blog_post
title: "5 Reasons Why You Should Give Visual Studio for Mac Another Try"
author: quorralyne
description: "The newly released version of Visual Studio for Mac deserves the attention of any .NET, JS or mobile developer. Check out the features Microsoft has worked hard to bring to the community that uses Macs."
tags: [ aspnet, csharp, dotnet, dotnetcore, mac, apple, visualstudio, vsformac, visualstudioformac ]
tweets:
- "Tried Visual studio for Mac? Try it again, you might be surprised →"
- "Develop .NET on a Mac? Check out the improvements to Visual Studio for Mac! →"
- "Hey .NET devs! Learn what is new in Visual Studio for Mac and why you should try it →"
image: blog/vs-mac-another-try/vsmaclove.png
---
Visual Studio has not always been as user-friendly on the Mac as it is on a Windows machine. Lately, however, the stable release of VS for Mac is really starting to feel like a simple, but luxurious cousin to Visual Studio 2019. Different, but related. Installation on a Mac is quick, simple, and allows you to get into coding right away - whether you are already familiar or an Apple-only dev getting into something new like Xamarin. 

[Visual Studio for Mac](https://visualstudio.microsoft.com/vs/mac/) bears a striking similarity to xCode's solution navigation feel, but brings the power of VS intellisense and an ability to focus on your code in a much cleaner looking environment. In my opinion, this brings the best of both worlds together. But don't take my word for it: here are five reasons to give Visual Studio for Mac another go!

## 1. The C# Editor in Visual Studio for Mac is Completely New

Roslyn, the .NET compiler platform, is now in the Visual Studio for Mac editor - making your intellisense as powerful as its big brother on Windows. Marrying the functionality ported over from the Roslyn compiler with the (frankly, beautiful looking) simplicity of a native-feeling Mac UI editing experience gives this girl all the feels. It has full support for third-party Nuget packages for .NET Core (utilizing .NET Standard) along with Unity, Xamarin and Cocoa apps. 

I didn't notice a big difference gating my progress of a .NET Core app. At this point, I don't know why I would switch over to a windows VM in order to build a microservice API in .NET Core at all! 

Finally, I'm loving that VS for Mac now includes "Go to implementation" as an option in the latest release. Exciting! The C# experience is pretty great now.

## 2. CLI Developers Can Open .NET Core Projects in Terminal

Ah, the command line. Many developers love using it for .NET Core instead of the "visual" click and drag aspect of the Visual Studio IDE. At first, the use of command line programming with ASP.NET Core was the only way you could build those apps. Over time, and especially with the release of Visual Studio 2019, the **File > New Project** templates for ASP.NET Core apps have been baked into the install bringing a truly visual experience to that build. 

For a while, it was unclear if the same command line *net new project* CLI functionality would be available on Mac, but I am happy to report that it is and it works beautifully! The use of the Terminal app brings that experience to you harcore command line devs.

## 3. Improved Build Time for Xamarin

Remember those build and deploy coffee breaks? Well say goodbye (unless you don't want to of course). On one of my Xamarin projects I saw a super impressive 30% faster incremental build time. That's not an insignificant improvement. 

This metric is also supported by the April 2019 [press release](https://devblogs.microsoft.com/visualstudio/visual-studio-2019-for-mac-is-now-available/) from the VS for Mac team. I used to design my development process in such a way that I could multitask to stay efficient and productive. I'm happy to report those days are gone with much improved build speeds, making the Xamarin app building process something I can say I truly enjoy.

## 4. .NET Core 3 Support Available Right Out of the Gate

Does Visual Studio 2019 have .NET Core 3 support? Yes, but that's no reason to jump over to your Windows machine! You can use all the same, wonderful new stuff on your Apple machine, too. 

In fact, I'd argue that Visual Studio for Mac is an excellent place to *start* learning how to build apps for .NET Core 3. With fewer small windows everywhere like it's Windows-based cousin, VS for Mac allows for a more-focused process.
## 5. Robust Source Control Options

This is where some "same but different" comes into play. I find that developers coming over from Swift or Objective C development enjoy the experience of source control within Visual Studio for Mac. While there IS a difference in the process for Windows users, I don't find it particularly difficult. Visual Studio for Mac supports Git and Subversion built into the IDE, as well as TFS with a little more effort.

I have used the Github Desktop app for source control of my folders without much issue. This is also my source control workflow for VS Code, and while it is not integrated into the IDE of VS for Mac, it's also not a bad option. For the hardcore command line peeps, you can alternatively use Git inside the CLI tool Terminal, which is native to Apple OS. There is no learning curve here at all for developers who use command line.

## Who Should Use Visual Studio for Mac?

Visual Studio for Mac is a strong choice for many developers and many use cases. Here are a few that come to mind:

1. .NET users building Xamarin mobile apps that require IOS builds will benefit tremendously from having all their development on a single machine. 

2. Developers working with .NET Core, who love working on a Mac, and currently use a virtual machine or Bootcamp to run Visual Studio in a windows environment will benefit from not having to switch over from the Apple operating system constantly. 

3. Unity game developers will find VS for Mac be very intuitive option.

The last group to come over will be .NET Framework developers who have worked with Visual Studio on Windows as their only option for .NET 4.7.2 for example. Sadly no, .NET Framework cannot run on VS for Mac. However, once you are ready to start building your apps or microservices in .NET Core - check it out! 

New functionality, extensions and templates are all coming this next year to [Visual Studio for Mac](https://visualstudio.microsoft.com/vs/mac/) that make living in harmony with Apple + Microsoft a real joy.

## Learn More About .NET Core, Xamarin, Apple & OAuth

If you'd like to learn more about ASP.NET, Xamarin, or Apple, we've also published a number of posts that might interest you:

* [Build login in Xamarin with Xamarin Forms](https://developer.okta.com/blog/2019/06/11/build-login-in-xamarin-with-xamarin-forms)
* [Add Login to your ASP.NET Core MVC App](https://developer.okta.com/blog/2018/10/29/add-login-to-you-aspnetcore-app)
* [What the Heck is Sign-in with Apple?](https://developer.okta.com/blog/2019/06/04/what-the-heck-is-sign-in-with-apple)
* [Build a REST API with ASP.NET Core 2.2](https://developer.okta.com/blog/2019/04/10/build-rest-api-with-aspnetcore)

For other great content from the Okta Dev Team, follow us on [Twitter](https://twitter.com/oktadev) and [Facebook](https://www.facebook.com/oktadevelopers)!