---
layout: blog_post
title: Seven Awesome New Features In Visual Studio 2017
author: leebrandt
tags: [visual studio, xamarin, javascript, jsx, editor config]
---

Microsoft developers have been using Visual Studio for their IDE since before .NET was even a thing. Visual Studio is twenty years old this year, and on March 7th, 2017 Microsoft released the latest version of it's flagship developer product, Visual Studio. With this release are a bunch of new features, improvements, and exciting changes for the beloved Microsoft developer environment. Here are seven features in the new IDE that will excite developers using the development environment.

{% img blog/seven-new-vs-features/vs-then-and-now.png alt:"Visual Studio Then And Now" %}

## 1. EditorConfig Built In
The [EditorConfig project](http://editorconfig.org/) has been available for Visual Studio 2015, but it required you to install a plugin to take advantage of the code-style configuration tool. With the release of 2017, EditorConfig is now built into the IDE. This means you can simply create an `.editorconfig` file in the root of your solution and check it into your source control. This will get your whole team using the same code format rules (once you can all agree on what they should be).

## 2. New Visual Studio Installer
Visual Studio 2017 also comes with a new installer. The new installer lets you put together an install of Visual Studio customized to the type of development you're doing. You can install only the features you will need every day and leave out things that you might never need. This is a great way to keep the IDE small and snappy.

{% img blog/seven-new-vs-features/vs-installer.png alt:"New Visual Studio Installer" %}

## 3. Manage Visual Studio Performance
The Manage Visual Studio Performance (under the `Help` menu) allows you to view the performance of your Visual Studio IDE and can even give you suggestions about extensions that might be impacting the performance of your environment! This includes turning on Lightweight Solution Load, which doesn't load all the projects in a solution when you open the solution, only when you begin to work in that project. You can still navigate through the code, but the project won't be loaded until you actually start to work with that project. Awesome!

{% img blog/seven-new-vs-features/vs-perfromance.png alt:"Manage Visual Studio Performance" %}

## 4. Mobile Development
With Microsoft's acquisition of Xamarin a few years ago, .NET developers have been enjoying the [Xamarin](https://www.xamarin.com/) for free as [a plugin to Visual Studio 2015](https://marketplace.visualstudio.com/items?itemName=Xamarin.Xamarin). In Visual Studio 2017, it's now one of the install options when installing Visual Studio! This is a signal that cross-platform, mobile development is now a first-class citizen in your Microsoft development toolbelt!

## 5. Live Unit Testing
Unit testing has been permeating every development stack over the last decade and Microsoft has followed the trend by making Live Unit Testing available. This means as you change your code, Visual Studio will let you know if your changes will break unit tests, or if they will not be covered by unit tests; in real time.

Running unit tests has almost always been an extra step of your development workflow, but with the Live Unit Testing indicators in your editor popping up as you edit code, it just happens. You can also click on an indicator in the editor and it will show you which tests are exercising that line of code. Unit testing for the win, anyone?

## 6. Better Javascript Support
With the proliferation of Javascript and Javascript frameworks like Angular, React, Ember, and Vue, it's no surprise that VSCode has really gleaned a lot of support from the developer community. VSCode has excellent support for Javascript (ES5 and ES6) as well as framework support for Angular and React, including JSX.

{% img blog/seven-new-vs-features/vs-javascript-support.png alt:"Visual Studio Javascript Support" %}

Building on that win, Microsoft used the Javascript engine built into VSCode in Visual Studio 2017. This means that all the great support in VSCode is now available without switching out of your Visual Studio editor!


## 7. Docker Support Built-In
With the adoption of containerization, microservices, and [Microsoft's own work with Docker](https://www.docker.com/microsoft) to help support [Windows Containers](https://hub.docker.com/search/?isAutomated=0&isOfficial=0&page=1&pullCount=0&q=Microsoft+Windows&starCount=0), it's no surprise that developers are looking for tighter integration with Docker for their development environments. In Visual Studio 2015 (Update 3), you could install the [Visual Studio Tools For Docker](https://marketplace.visualstudio.com/items?itemName=MicrosoftCloudExplorer.VisualStudioToolsforDocker-Preview) and get integrated support for [Docker](https://www.docker.com/) containers. Visual Studio 2017, builds this feature in and when choosing the application template from the `File -> New` menu, you can choose to turn on Docker support, giving you all the goodness of the plug-in, built in to Visual Studio!

{% img blog/seven-new-vs-features/vs-docker-support.png alt:"Visual Studio Docker Support" %}

Visual Studio has always been the editor of choice for those writing .NET applications and tapping into the Microsoft ecosystem. It has always had all the tools developers need to be their best, most productive selves. Now Microsoft has done some outstanding work to include and integrate with non-Microsoft tools that developers love to use, as well as help developers discover problems in their code, and improve the performance of their IDE. With the new additions and improvements in Visual Studio 2017, developers should love it even more!



