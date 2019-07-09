---
layout: blog_post
title: "The Top 5 DevOps Automation Tools .NET Developers Should Know"
author: quorralyne
description: "CI/CD automation, code analysis, and database versioning. Check out the top 5 tools for DevOps automation that every .NET developer should know."
tags: [ aspnet, csharp, dotnet, dotnetcore, entityframework, SQL, webapi, okta, devops, automation, devopsautomation]
tweets:
- "Discover the top 5 #DevOps automation tools that every #ASPNET and #csharp developer should know →"
- "Shouldn't there be more #devops #automation in the life of a #DOTNET dev? You bet! Check it out! →"
- "Hey .NET devs! Check out the Top 5 #DevOps #Automation tools you absolutely need to know! →"
image: blog/aspnet-devops-top-5-automation-tools/devops-automation.png
---

Not too long ago, deployments were done by hand - manually pushed to a physical server somewhere in a building your company owned. The software engineering world has come a long way since then, and we have more options than ever get our code and data live, automatically. Here are a few tools every C#/.NET developer should know that can help with that process, vetted by some of the best software leaders in the business. Be sure to check each one out if you aren't already using their awesome power.

{% img blog/aspnet-devops-top-5-automation-tools/devops-automation.png alt:"Top 5 DevOps Automation Tools for C#" width:"800" %}{: .center-image }

## Why ASP.NET Developers Should Invest in DevOps Automation Tooling

It's not enough to code and build a project - it's important to do it *continuously*. **Continuous Integration** or **Continous Deployment** (CI/CD) is usually done in cooperation with the system that your project code repository exists on and the host server where your application lives. If you are working cloud-based, this could be Microsoft Azure or Amazon Web Service (AWS) or example. Of course, you could still be self-hosting on a server or data center within your building or company's control. In either scenario, setting up an automated way to handle new features, bug fixes or even database changes is beneficial for quality control and speed to market. The addition of automating your **Code Quality Analysis** checks and **Database Versioning** and **Data Comparison** scripts can have just as big of an impact on your day-to-day workload as CI/CD.

If you are still manually doing things, take a look at the tools below that every ASP.NET / C# developer should know! They might make your life better.

## Code Deployment + CI/CD Pipeline Automation

Here you'll find a few excellent tools to assist with deploying your code, and getting it integrated with your repository, to read any commits you have done and automatically push the changes.

### 1. Azure DevOps

The latest option from Microsoft is the fully integrated Azure DevOps offering, Azure Pipelines. Lots of team options to use here, and it plugs in nicely to existing projects. Azure Pipelines works pretty seamlessly with containerization like Kubernetes, Azure Functions for a serverless option, quick-deployed Azure Web Apps and more complex VMs. It is the all-in-one option to make a .NET developer's life streamlined. Azure DevOps Services allows you one free CI/CD target using an Azure Repo or GitHub repo, and [pricing](https://azure.microsoft.com/en-us/pricing/details/devops/azure-devops-services/) scales from there depending on how many pipelines or user licenses you need.

[Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/) 

Azure Pipelines is the traffic-cop backbone of the Azure DevOps offerings. It is platform and language agnostic, providing orchestration between any cloud provider, whether that's AWS or Azure itself. The pipeline itself is cloud-hosted, so there is no need to download and install anything. Lots of extensibility here, with a good built-in option for integrated testing and reporting. If you are just getting started with doing CI/CD in the .NET cloud-hosted world, the documentation is excellent and the workflows guide you the entire way.

[Kudu](https://github.com/projectkudu/kudu/wiki)

Sometimes you don't need a fancy set-up for your project. For the quick projects where I wanted continuous integration for an Azure Web Apps (formerly Azure Websites) hosted application, I used the App Service Kudu build server connected to my GitHub hosted repository. Azure makes this fairly trivial to set up directly in the Azure UI from the Deployment Center menu on any App Service you create. Kudu monitors your GitHub check-ins and rebuilds your code and deploys it to Azure anytime there is a change. One of the most painless ways to set-up CI/CD quickly, when you just want MSBuild to compile your app and get your updated service deployed. The bonus is it works for free - the only paid portion is the cost of your Azure App Service. It comes along for the ride and does not require a separate Azure DevOps subscription.

### 2. Jenkins

[Jenkins](https://jenkins.io) is the most popular open-source CI/CD tool currently available, supporting many programming languages and applications. With it's MSBuild plugin, using Jenkins as your build server is one of the easiest things I've ever personally used for deployment orchestration. It's easy to see when the build triggered deployments fail and will run any scripts you need. When working on a project with many moving pieces in different ecosystems, Jenkins is an easy-to-understand way to tie them all together. It plays nice with everything, from hosts like Azure and AWS to repositories like Bitbucket and GitHub. Best of all - it's FREE.

[MSBuild Plugin](https://plugins.jenkins.io/msbuild)

Your Jenkins instance will need to be hosted. It requires you to download and install it on a server that can run the Java runtime (it's a Java app that can run on any OS). The MSBuild plugin will be added to the Jenkins installation on a server that you control (which can be cloud-based). You set the rules - when MSBuild executes, the repository trigger that monitors when a PR has been approved, etc. This allows a huge amount of flexibility, but nothing is set up by default.

### 3. Octopus Deploy

[Octopus Deploy](https://octopus.com/dotnet) is a finely-tuned orchestrator for your pipeline. It works in tandem with your build server, taking care of deploying and promoting releases between environments. 

[Octopus Server](https://octopus.com/downloads)

This product excels for many reasons in the deployment and continuous integration cycle. They have plugins for TeamCity, Jenkins, Azure DevOps and TFS. I've included it here because it works with *self-hosted applications* on your own server. It has a monthly charge for their cloud-hosted integration or a yearly cost for the self-hosted option.

## SQL Database Versioning Automation

Code isn't the only thing that could use some automation. Often developers are also keepers of the database for a project. It's possible to not only automate the deployment of database schema changes but also compare any data inside of it and script the differences with the tools below.

### 4. Redgate SQL Toolbelt

With some of the best headache-reducing products on the market for SQL databases, Redgate has created tools that assist developers with data scenarios that come up during software projects. I have personally reduced my SQL database troubleshooting down to a matter of hours instead of days by using their suite of products. The options below allow you get back to your code quicker with the helpfulness of database automation and analysis tooling. Redgate's products work with PowerShell, and have add-on extensions for Visual Studio and VS Code.

[SQL Change Automation](https://www.red-gate.com/products/sql-development/sql-change-automation/)

This is the tool that gets your database scheduled updates live, quickly, without manually pushing.

[SQL Compare](https://www.red-gate.com/products/sql-development/sql-compare/)

For the times where you need to update the database schema itself, running it through this comparison tool helps. It allows you to generate a database change script, not unlike the options in Entity Framework - for any SQL database, local or cloud-hosted. Then it deploys the changes automatically.

[SQL Data Compare](https://www.red-gate.com/products/sql-development/sql-data-compare/)

Many configurations are stored in a database, and this tool examines the data values of any SQL instance with another one. It has saved a breaking data change more than once in my career, and something that is absolutely worth the money to have around.

## Code Analysis: Gated Deployment Automation

While we are at it, why not ensure that the code you deploy fits within your team's standards? There are ways to run automatic analysis within your local IDE, yes. Tools like the ones below will gate the commit itself, and allow fixes before a pull request is even created.

### 5. SonarSource

It can be difficult to quantify what "good" or "bad" code can be on a team project, so [SonarSource](https://www.sonarsource.com) developed a suite of products that allows you to set the rules of what your team's code *should* look like. [SonarCube](https://www.sonarsource.com/products/sonarqube/) is the one I used first, which can be run on a self-hosted server for code quality analysis and provides a score of risk for the existing repository. The next level of action was to gate the ability for a developer to merge their pull request if it does not meet the code rules you set up. Locally, you can use [SonarLint](https://www.sonarsource.com/products/sonarlint) to run against MSBuild in your Visual Studio instance. In conjunction with your CI/CD pipeline, cloud-hosted [SonarCloud](https://sonarcloud.io/about) can run as a trigger for code quality before allowing your build to compile.

[SonarC#](https://www.sonarsource.com/products/codeanalyzers/sonarcsharp.html)

This is SonarSource's C# specific analyzer and works with Roslyn to create custom rule sets for your team project, including automating running tests. Prices vary depending on which of their tools you choose to use, but it is completely worth it. If you are looking for a quick way to level-up your developers and ensure code quality is always present, this is a great option. SonarC# lets your focus code reviews on important topics and eliminates the low-hanging fruit.

## DevOps Automation is a Key Skill for All .NET Developers

These are just 5 of the top tools that many successful ASP.NET and .NET Core developers use to manage the growing needs for shipping code faster and more accurately. Now more than ever, developers should add DevOps experience to their resume, as it will become a natural requirement for jobs in the not-too-distant future.

Do you have other DevOps automation tools that you love using? Share in the comments below!

## Learn More About ASP.NET and Secure User Management

If you'd like to learn more about using secure OAuth 2.0 and user management in ASP.NET, we've also published a number of posts that might interest you:

* [How to Secure Your .NET Web API with Token Authentication](/blog/2018/02/01/secure-aspnetcore-webapi-token-auth)
* [Build a CRUD App with ASP.NET Framework 4.x Web API and Angular](/blog/2018/07/27/build-crud-app-in-aspnet-framework-webapi-and-angular)
* [Secure Your ASP.NET Web Forms Application with OpenID Connect and Okta](/blog/2018/08/29/secure-webforms-with-openidconnect-okta)
* [Use OpenID Connect for Authorization in Your ASP.NET MVC Framework 4.x App](/blog/2018/04/18/authorization-in-your-aspnet-mvc-4-application)

As always if you have any questions or comments about this post feel free to leave a comment below. For other great content from the Okta Dev Team, follow us on [Twitter](https://twitter.com/oktadev) and [Facebook](https://www.facebook.com/oktadevelopers)!
