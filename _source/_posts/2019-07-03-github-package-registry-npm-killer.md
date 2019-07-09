---
layout: blog_post
title: "Is GitHub Package Registry the npm Killer?"
author: reverentgeek
description: "GitHub has announced GitHub Package Registry. Does this spell the death for npm?"
tags: [ npm, github, devops, package registry, private packages ]
tweets:
- "Is GitHub Package Registry the npm killer??"
- "GitHub has announced GitHub Package Registry. Does this spell the death for npm?"
- "GitHub Package Registry -- what does this mean for npm?"
image: blog/github-package-registry-npm-killer/github-package-registry-npm-killer.jpg
---

GitHub recently announced a new feature, GitHub Package Registry, currently in beta. It's designed to allow GitHub users to publish and distribute packages of their software directly on GitHub instead of relying on an external system.

At a glance, GitHub Package Registry has the following features and benefits.

* Supports multiple package clients: npm, Maven, NuGet, RubyGems, and Docker images
* Supports public and private packages
* Supports pre-release packages
* Can use webhooks and GitHub Actions to customize publishing and workflows
* Is free for public packages and Docker images
* Identity and permissions inherited from your repository, no need to maintain separate credentials
* Is not evil*

_* Fairly confident this is true._

{% img blog/github-package-registry-npm-killer/github-package-registry-npm-killer.jpg alt:"Is GitHub Package Registry the npm Killer?" width:"800" %}{: .center-image }

## GitHub Package Registry: The Good Parts

GitHub Package Registry will be a great alternative for larger teams with private repositories and the need to secure private packages for internal consumption. No more having to host and configure your own npm proxy service or paying for a third-party solution!

GitHub Package Registry will most likely evolve into a better set of application lifecycle tools for GitHub users, and a better DevOps story for teams that use GitHub. It totally makes sense to store your application's artifacts alongside the source code, and have a single place to manage access. This is especially true for applications composed of multiple technologies, such as a mixture of Node.js, .NET, Java, and Docker.

One of the most compelling advantages of GitHub Package Registry will be leveraging the identity and authorization of repositories to apply the same level of security to packages and artifacts.

## GitHub Package Registry: The Ugly Parts

Installing packages from GitHub won't be supported by the `npm` command-line interface (CLI) by default. You will first need to authenticate with GitHub using `npm login` or store your user token in your local `.npmrc` configuration file.

All packages served by GitHub are scoped. That means when you install a package, you'll always have to use the organization or owner name as part of the command, such as `npm install @oktadev/super-cool-package`. You won't be able to simply type `npm install super-cool-package`.

## Is GitHub Package Registry Really the npm Killer?

I don't think so. At least, not in its current form. There's still too much friction in setting up the npm CLI tool and configuring projects. I don't think we're going to see any shift in libraries hosted on npm today moving to host their packages only on GitHub.

However, GitHub Package Registry could pose a threat to npm's subscription product offerings targeted at teams and enterprises. On the surface, the private package and workflow features of GitHub Package Registry seem to directly compete with npm's products. Teams and enterprises using GitHub Package Registry would have the added benefit of managing identity and permissions for repositories _and_ packages in one place.

What are your thoughts on GitHub Package Registry and the future of npm? Share in the comments below!

## Learn More About Secure App Development in Node.js

Want to learn more about Node.js and software development in general? Check out these killer posts!

* [Top 10 Visual Studio Code Extensions for Node.js](https://developer.okta.com/blog/2019/05/08/top-vs-code-extensions-for-nodejs-developers)
* [Build a Command Line Application with Node.js](https://developer.okta.com/blog/2019/06/18/command-line-app-with-nodejs)
* [Build Simple Authentication in Express in 15 Minutes](https://developer.okta.com/blog/2019/05/31/simple-auth-express-fifteen-minutes)

As always if you have comments, leave them below. If you don't want to miss out on any of our super cool content, follow us on [Twitter](https://twitter.com/oktadev) and [YouTube](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q).
