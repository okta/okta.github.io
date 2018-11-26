---
layout: blog_post
title: '7 Essential .NET Developer Tools for 2017'
author: leebrandt
tags: [net, tools]
---

Every good dev knows that time spent setting up the perfect environment and searching out the latest tools is time well spent. Little things make a huge difference — upgrade your IDE plugins, automate a task or two, or look for new tools and libraries that can increase your efficiency. We've taken a crack at an updated list of our favorite .NET developer tools, that can simplify your life and amplify your work.
## 1. JSON.NET
Chances are that for any given project these days, you'll be consuming a RESTful JSON API, producing one, or both. And even if you're not, you may still be using JSON to serialize data or configuration on disk. Sure, you could get it done using System.Runtime.Serialization.Json, but [JSON.NET](http://json.net/) is faster and has tons of nice features to make your life easier. Built-in [LINQ-to-JSON](http://www.newtonsoft.com/json/help/html/LINQtoJSON.htm) support, plus the ability to query JSON using [XPath-like syntax](http://www.newtonsoft.com/json/help/html/QueryJsonSelectTokenJsonPath.htm) has earned this library the reputation as the de facto JSON implementation for .NET.
## 2. .NET API Browser (and Reverse Package Search)
Here's a two-for-one for our second tool suggestion: the .NET API Browser and Reverse Package Search. As classes get moved around when their packages are refactored and reshuffled between versions, these two services are invaluable for tracking everything down.

Microsoft's [.NET API Browser](https://docs.microsoft.com/en-us/dotnet/api) is a comprehensive reference for all classes and methods in the .NET API. The best part is that it autocompletes while you type, making it easy to locate APIs even when you can't remember exactly where they exist in the package hierarchy.

Similarly, the [Reverse Package Search](https://packagesearch.azurewebsites.net) lets you quickly search a vast collection of third party libraries, tagged with their respective supported versions of .NET Framework or .NET Core. It's a little less curated than Microsoft's official API browser, but the breadth makes up for it.

## 3. StyleCop.Analyzers
If there's one thing that can really get a team of developers fussed up, it's adhering to a consistent code formatting style. The only real solution is to adopt a formatting tool like StyleCop, and then share the configuration throughout the team. StyleCop can detect and fix a broad range of style offences, and can even be set up in some IDEs to work real-time as you type.

[StyleCop.Analyzers](https://github.com/DotNetAnalyzers/StyleCopAnalyzers) is the latest incarnation of this project. Okta's very own .NET evangelist [Nate](https://github.com/nbarbettini) is a dedicated contributor.

## 4. Visual Studio Code
[Visual Studio Code](https://code.visualstudio.com) is Microsoft's open source text editor and IDE. It's beautiful and featureful and a joy to use. Not just for .NET, it works well with lots of language ecosystems and runs on Mac, Linux, and Windows. It's got some similarities to Atom, but comes with IntelliSense, debugger, git integration, and can be extended even further with plugins.

## 5. Posh-git
Been working for days on a major feature branch when a critical issue pops up in production? No worries: just commit to your feature branch, switch to the stable branch to push a fix, and switch back. Git (and modern version control in general) has really enabled this sort of multitasking on a codebase—but it can get confusing quickly.

[Posh-git](https://github.com/dahlbyk/posh-git) (and its equivalent for [Subversion](https://github.com/JeremySkinner/posh-svn), [Mercurial](https://github.com/JeremySkinner/posh-hg), and [Perforce](https://github.com/Zougi/posh-p4)) modifies your shell prompt to include the current branch and other status information. It also provides tab-completion for your SCM commands and branch names, which results in a very nice git experience.

## 6. ReSharper
[ReSharper](https://www.jetbrains.com/resharper/) is the premier code analysis tool for Visual Studio. It provides analysis, linting, and refactoring assistance. From on-the-fly "quick fixes" to project-wide symbol renaming, this tool is like having your own co-pilot. It costs a few hundred bucks per year, but it should quickly pay for itself in increased productivity, and it comes with a 30-day trial so you can take it for a test drive. Combine it with the [StyleCop plugin](https://github.com/StyleCop/StyleCop.ReSharper) and get the benefits of code format evaluation as you type.

## 7. xUnit.net
If you've invested in good unit test coverage, then you're undoubtedly pretty committed to a testing framework already. But if you're starting a new project, or just haven't got around to writing any tests yet (we won't judge) then look no further than [xUnit.net](https://xunit.github.io). It is the successor to NUnit, and builds on the long lineage of similarly-named testing frameworks in other languages such as JUnit, CPPUnit, PHPUnit, and dozens more. However, xUnit has made some opinionated deviations to promote clearer more isolated tests that are easier to maintain, and a focus on data-driven testing using theories.

xUnit.net makes writing unit tests more approachable by providing the scaffolding to put them on. It supplies the infrastructure for basic fixturing and test running (including in parallel), and combines nicely with [AutoFixture](https://github.com/AutoFixture/AutoFixture) and [Moq](https://github.com/moq/moq) for writing concise and effective unit tests.

## Bonus – FluentAssertions
On the topic of writing concise and effective unit tests, [Fluent Assertions](http://www.fluentassertions.com) is a library that enables expressive assertions. When a test fails, it's important to be able to know why without reaching for the debugger.

The possibilities for tweaking and refining your development workflow go on and on. While shiny new tools have the potential to dramatically increase productivity, it's easy to go down the rabbit hole of research and not actually get any work done. So now that you've got some new tricks, you can stop reading and go put them to work.