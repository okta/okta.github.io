---
layout: blog_post
title: 'Bootiful Development with Spring Boot and React'
author: mraible
tags: [authentication, spring boot, react, okta, oidc]
---

Are you a Java Developer that's eager to try out React? React has been getting a lot of positive press in the last couple
years, and for good reason! Once you learn how it works, it makes a lot of sense, and can be fun to develop with. Not only
that, but it's *wicked fast*!

First of all, React isn't a full-fledged web framework. It's more of a toolkit for developing
UIs, ala GWT. If you want to make an HTTP request to fetch data from a server, React doesn't provide any utilities for that.
However, it does have a *huge* ecosystem that offers many libraries and components. What do I mean by huge? Put it this way:
According to npmjs.com, [Angular has 17,938 packages](https://www.npmjs.com/search?q=angular). React has almost
[three times as many](https://www.npmjs.com/search?q=react) at 42,428!

Angular is a good friend of mine, and I'm not abandoning my old friend to play with React. I'm just making new friends.
If you've read this blog for a bit, you might remember my [Bootiful Development with Spring Boot and Angular](/blog/2017/04/26/bootiful-development-with-spring-boot-and-angular) tutorial. Today, I'll show you how to build
the same application, except with React this time.

This post shows how you can build a UI and an API as separate apps. You’ll learn how to create REST endpoints with Spring MVC, configure Spring Boot to allow CORS, and create an React app to display its data. This app will display a list of beers from the API, then fetch a GIF from [GIPHY](https://giphy.com/) that matches the beer’s name. I'll also show you to to integrate Okta and its OpenID Connect (OIDC) support to lock down your API and add authentication to your UI.

Let's get started!

## Build an API with Spring Boot

## Create a Project with Create React App

### Create a BeerList Component

### Configure CORS for Spring Boot

### Create a GiphyImage Component

## Add PWA Support

## Add Authentication with Okta

### Clean Up Those TypeScript Warnings

## Learn More About Spring Boot and React

Angular vs React from Devoxx + YouTube

Fave Learning Video

https://www.robinwieruch.de/react-fetching-data/

https://developer.okta.com/blog/2017/03/30/react-okta-sign-in-widget

https://developer.okta.com/code/react/okta_react.html

