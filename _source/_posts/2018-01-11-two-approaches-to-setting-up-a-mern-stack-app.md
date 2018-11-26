---
layout: blog_post
title: "Two Approaches to Setting Up a MERN Stack Application"
author: leebrandt
tags: [mongo, express, node, react, mern]
tweets:
  - "Check out two approaches to setting up a MERN stack app"
  - "Two ways to get a MERN stack app set up"
---

The trend I've seen in web applications is a backend API written in a server-side technology like Node, with a front-end single-page application written in something like React. The problem with these stacks is that it can be hard to run and deploy them as a single unit. The API and UI will need to be started, stopped and deployed separately. That can be a bit of a pain when developing, and if you are writing the API to only be consumed by that single front end, the extra steps can be unnecessary. If this sounds like you, I'll show you the two main paths I found for setting up a MERN (Mongo, Express, React, and Node) stack application to run and deploy as a single code base.

## 1. Roll Your Own

I found a great [couple](https://daveceddia.com/create-react-app-express-backend/) of [articles](https://daveceddia.com/create-react-app-express-production/) on setting up React and Node to run together by [Dave Ceddia](https://daveceddia.com/) who writes a **lot** about React.
The first tutorial is fine for setting up the development environment, but it doesn't talk much about how to get things ready to deploy. I deploy most of my personal stuff on [Heroku](https://heroku.com), so the second article was just what the doctor ordered for me.
The tl;dr is to start with `create-react-app` to generate the base React application, then add the Express application around it. The biggest trick is in the `scripts` section of the server's `package.json` file. Here's what I did by following David's tutorial and then adding a little magic of my own.
```js
  "scripts": {
    "start": "forever -m 5 bin/www",
    "heroku-postbuild": "cd client && yarn --production=false && yarn run build",
    "dev": "concurrently \"forever -m 5 -w bin/www\" \"cd client && yarn start\""
  },
```
The `heroku-postbuild` script is straight from David's article, and it tells Heroku to make a production build of the React app. The fact that it says `--production=false` just means that Heroku will install the React scripts that the package needs to compile the React app and put it into the `client/build` folder for the Node application to access it.
My own piece was adding the `dev` script. It uses [concurrently](https://www.npmjs.com/package/concurrently) to run the Node API and the React client app all at once. This way, I can just run `yarn dev` to run my development version of the application with one command, instead of having to do them manually from the command line.

### The Good Parts

I have more control of what goes into my application. If I use [Jest](https://facebook.github.io/jest) for testing or [CircleCI](https://circleci.com) for my builds, I don't have to modify or remove someone else's code to make my app work the way I do. This also means I can add only those things I understand. I can lean on `create-react-app` to make the webpack configurations for me and I won't have utilities I don't understand how to use.

### The Downside

This is really meant for a Heroku-deployed application. Assuming you're pretty familiar with your hosting provider, you should be able to modify it for your needs. This approach also leaves you with the job of adding your own tools for testing, continuous integration/deployment, containerization, and everything else.

### The Verdict

For those that suffer from the Not Invented Here (NIH) problem, this will likely be your approach. You will however, not save yourself a ton of time in boilerplate as you set up the configs for everything not included in the `create-react-app` template.

## 2. Try the MERN Tools

The [MERN site](http://mern.io/) has two different ways to kick off your MERN project: a [MERN Starter project on GitHub](https://github.com/Hashnode/mern-starter), and the [MERN CLI](https://github.com/Hashnode/mern-cli). The CLI simply uses the starter project to generate the base application, so it really depends on whether or not you want to install the CLI npm package.

### The Good Parts

Not only is it a fully-fleshed MERN stack application, it's created by [Hashnode](https://hashnode.com/), a JavaScript community forum with lots of knowledgeable folks. It has Docker containers already set up with Dockerfiles and compose files for development and production. It is MIT-licensed, which is a permissive, flexible open source license. The project also generates standard dot files (e.g., `.gitignore`, `.eslintrc`, etc) so you'll end up following best practices for MERN stack development (or it will be easy for you to change them to meet your development style). It includes a `.travis.yml` file ready to use with [Travis CI](https://travis-ci.org) for continuous integration/deployment. The starter even has a couple of embedded JavaScript templates for creating React components and Express modules once you start working on your project. Finally, it is very well organized and follows the community's standards for project organization.

### The Tricky Parts

I'm a big believer in not using generated code unless I understand how that code works. For me, the point of generating code is not to skip parts I don't understand, it's to keep me from having to do all that typing.
That said, there is a lot of semi-advanced stuff in the starter project. If you don't know Docker, it might be confusing. It also has several webpack configs that can be hard to follow if you're not super familiar with webpack. There are `util` folders in the client and server of the application that can be hard to understand for those new to React, Node, or testing with JavaScript. There may also be things in the application template that you don't need or want if you use a different testing framework, mocking library, or build service.

### The Verdict

This is probably the best solution for those who are creating an enterprise-level application with the MERN stack. Despite being somewhat advanced, the documentation is stellar. The fact that it's made by Hashnode means you have a direct line to a community of people who can answer questions about it if you run into problems or something you simply don't understand.

## Which One Is For Me?

As with all things software, it depends. I recommend generating a project with MERN.io and checking out what dependencies and practices are included. Then decide for yourself if it's right for you. Also, read through the generated project and make sure you understand what's going on in the code. Make sure you can follow how the packages that are included are being used. It can be a great way to learn how to do things the conventional way.
If you want to learn how to set up these different pieces manually, I'd suggest rolling your own. Or, if you know you don't need all the things that come in the MERN.io generated application, you might consider rolling your own. If you *do* roll your own, I suggest referring to the [MERN.io style and organization](http://mern.io/documentation.html) of the project for guidance on the "proper" way to do things.

## Learn More

To learn more about the `create-react-app` (CRA) npm package, see the [GitHub repo](https://github.com/facebookincubator/create-react-app).
For more awesome React resources, check out:
* Matt Raible's post on [React with Spring Boot](https://developer.okta.com/blog/2017/12/06/bootiful-development-with-spring-boot-and-react)
* My post on [React Authentication with Okta](https://developer.okta.com/blog/2017/03/30/react-okta-sign-in-widget)
* Matt Raible's post on [Progressive Web Apps](https://developer.okta.com/blog/2017/07/20/the-ultimate-guide-to-progressive-web-applications)
As always, feel free to contact me via [Twitter](https://twitter.com/leebrandt) or via the comments below, and be sure to check out [Okta's Free-Forever Developer Account](https://developer.okta.com/signup/).
