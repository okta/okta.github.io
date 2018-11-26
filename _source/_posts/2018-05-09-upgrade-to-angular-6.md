---
layout: blog_post
title: "Angular 6: What's New, and Why Upgrade"
author: mraible
description: "This post explains what's new in Angular 6 and how to upgrade your Angular 5 apps."
tags: [angular, angular5, angular6, rxjs, typescript]
tweets:
  - "Want to see what's new in Angular 6 and how to upgrade? We've got you covered!"
  - "Like what you see in #Angular 6 and want to upgrade? This article explains steps to upgrade your apps."
---

Angular 6 is now available and it's not a drop-in replacement for Angular 5. If you've been developing with Angular since Angular 2, you likely remember that it wasn't too difficult to upgrade to Angular 4 or Angular 5. In most projects, you could change the version numbers in your `package.json` and you were on your way.

In fact, the most significant change I remember in the last couple of years was the introduction of `HttpClient`, which happened in Angular 4.3. And it wasn't removed in Angular 5; it was merely deprecated. There was also the move from `<template>` to `<ng-template>`. There were some APIs removed in Angular 5, but I wasn't using them in any of my projects.

This brings us to Angular 6, where there are breaking changes. The most prominent difference that I've found is not in Angular itself but in [RxJS](http://reactivex.io/rxjs/). In this post, I'll walk you through these breaking changes so you can stay on the happy path while upgrading.

## Upgrading to RxJS 6

In RxJS v6, many of the class locations changed (affecting your imports) as did the syntax you use to manipulate data from an `HttpClient` request.

With RxJS v5.x, your imports look as follows:

```ts
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
```

With RxJS v6.x, they've changed a bit:

```ts
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
```

Another breaking change is the introduction of `pipe()`. With v5.x, you could map directly from an HTTP call to manipulate data.

```ts
search(q: string): Observable<any> {
  return this.getAll().map(data => data
    .filter(item => JSON.stringify(item).toLowerCase().includes(q)));
}
```

With v6.x, you have to *pipe* the results into `map()`:

```ts
search(q: string): Observable<any> {
  return this.getAll().pipe(
    map((data: any) => data
      .filter(item => JSON.stringify(item).toLowerCase().includes(q)))
  );
}
```

*Hat tip to funkizer on Stack Overflow [for their help](https://stackoverflow.com/questions/50180017/how-can-i-process-results-from-http-get-in-angular-6-rxjs-6/50181533#50181533) in figuring out how to convert from `map()` to `pipe()`.*

The [RxJS v5.x to v6 Update Guide](https://github.com/ReactiveX/rxjs/blob/master/MIGRATION.md) has many more tips for upgrading, including:

1. If you depend on a library that uses RxJS v5.x or don't want to modify your code, you can install [rxjs-compat](https://www.npmjs.com/package/rxjs-compat):

    ```
    npm install rxjs@6 rxjs-compat@6 --save
    ```

    Note that this will increase the bundle size of your application, so you should try to remove it as soon as you can.

2. To convert your imports from the old locations to the new ones, you can use [rxjs-tslint](https://github.com/ReactiveX/rxjs-tslint):

    ```
    npm i -g rxjs-tslint
    rxjs-5-to-6-migrate -p [path/to/tsconfig.json]
    ```

## Dependency Injection Simplified in Angular 6

One of the changes I like in Angular 6 is your services can now register themselves. In previous versions, when you annotated a class with `@Injectable()`, you had to register it as a provider in a module or component to use it. In Angular 6, you can specify `providedIn` and it will auto-register itself when the app bootstraps.

```ts
@Injectable({
  providedIn: 'root'
})
```

You can still use the old way, and things will work. You can also target a specific module for your service.

```
@Injectable({
  providedIn: AdminModule
})
```

I like the new auto-registration capability because it allows you to test your components and services easier. No need to register services in your modules *and* your tests anymore!

See Angular's [Dependency Injection Guide](https://angular.io/guide/dependency-injection) for more information.

## Angular CLI Changes

Angular CLI has updated its version number to match Angular's, going from 1.7.4 to 6.0.0. The two most significant changes I noticed are:

1. Running `ng test` no longer watches files for changes. It executes each test, then exits. If you want to watch your files for changes, you can run `ng test --watch=true`
2. Running `ng build` no longer produces a production build by default. To do a production build, you can run `ng build --prod`. In Angular 5 and below, the flag was `-prod`, with a single dash.

There are [many more](https://github.com/angular/angular-cli/releases) changes, but these were the ones that had the biggest impact on my workflow.

## What Else is New in Angular 6?

Stephen Fluin announced that [Angular 6 is available](https://blog.angular.io/version-6-of-angular-now-available-cc56b0efa7a4) last week. He notes the significant changes:

* `ng update`: this is a new CLI command that can upgrade components of your application. For example, `ng update @angular/core` will update all of the Angular packages, as well as RxJS and TypeScript. To see how you can use it on your project, see the [Angular Update Guide](https://update.angular.io/).
* `ng add`: this command makes it easier to add popular libraries and capabilities to your project. For example:
  * `ng add @angular/pwa`: turn your app into a progressive web application (PWA)
  * `ng add @ng-bootstrap/schematics`: adds Bootstrap and ng-bootstrap to your project
  * `ng add @angular/material`: installs and configures Angular Material (note: it does not import individual modules)
* Angular Elements: allows dynamic bootstrapping of components in embedded HTML
* Angular Material Starters: allows you to add flags to `ng generate` to generate Material components like side navigation, dashboards, and data tables
* CLI workspaces: you can now have multiple Angular projects
* Library support: component libraries can be generated with `ng generate library {name}`

## Tutorials Updated for Angular 6

I updated a number of tutorials from Angular 5 to 6 since the release last Friday. I started with my [Angular and Angular CLI Tutorial](http://gist.asciidoctor.org/?github-mraible/ng-demo//README.adoc).

<div style="max-width: 500px; margin: 0 auto">
<blockquote class="twitter-tweet" data-cards="hidden" data-lang="en"><p lang="en" dir="ltr">I spent a couple hours today upgrading my <a href="https://twitter.com/angular?ref_src=twsrc%5Etfw">@angular</a> tutorial to use Angular 6. It wasn't too difficult, but not that straightforward either. The good news is I learned a lot! <br><br>💻 PR at <a href="https://t.co/jjHTQwP8Li">https://t.co/jjHTQwP8Li</a><br>📘 Updated tutorial at <a href="https://t.co/d08RMTQf8F">https://t.co/d08RMTQf8F</a><a href="https://twitter.com/hashtag/angular?src=hash&amp;ref_src=twsrc%5Etfw">#angular</a> <a href="https://twitter.com/hashtag/bleedingedge?src=hash&amp;ref_src=twsrc%5Etfw">#bleedingedge</a></p>&mdash; Matt Raible (@mraible) <a href="https://twitter.com/mraible/status/992532563917918209?ref_src=twsrc%5Etfw">May 4, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

This tutorial has branches for Angular Material, Bootstrap, and OIDC authentication with Okta. Angular's CLI has an [include Angular Material story](https://github.com/angular/angular-cli/wiki/stories-include-angular-material) and an [include Bootstrap story](https://github.com/angular/angular-cli/wiki/stories-include-bootstrap) that helped me upgrade.

Upgrading the `okta` branch to use Angular 6 wasn't too difficult. That branch uses Manfred Steyer's [angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc) v3.1.4, which depends on RxJS v5.x, so I did have to install rxjs-compat to make things work.

I also upgraded two of the very first Angular tutorials I wrote for Okta last year:

* [Build an Angular App with Okta's Sign-In Widget in 15 Minutes](/blog/2017/03/27/angular-okta-sign-in-widget)
* [Angular Authentication with OpenID Connect and Okta in 20 Minutes](/blog/2017/04/17/angular-authentication-with-oidc)

We all know authentication is an important component of most apps, so I thought it would be helpful to get these posts updated, in case you are ready to make the switch to Angular 6. You can see the changelog at the bottom of each post to review exactly what changed. There are links to both the post changes and the code changes.

For each project I updated, I performed the following steps:

1. Created a new project from scratch using `ng new`
2. Went through the tutorial steps, adjusting the code as necessary
3. In the existing project, created a branch, ran `rm -rf *`, then copied the code from the completed tutorial
4. Copied/deleted dot files that didn't get deleted or moved

For the many other Angular tutorials on this blog, I believe it's possible to upgrade them, but also very time-consuming. For that reason, I've changed all tutorials to specify the version of Angular CLI to install, as well as the version of Angular Material.

If you want to try upgrading any of them and succeed, please send a pull request! I'll be happy to update its matching blog post.

## Learn More about Upgrading to Angular 6

I hope this post has helped you learn how to upgrade to Angular 6. All the applications I updated in the last several days were small and didn't contain a whole lot of functionality. I imagine upgrading a more substantial project might be more difficult.

An excellent example of a large-project-by-default is one created by [JHipster](https://www.jhipster.tech). [William Marques](https://twitter.com/wylmarq) recently created a [pull request for upgrading to Angular 6](https://github.com/jhipster/generator-jhipster/pull/7582), which might serve as a guide for those not using Angular CLI.

If you have any questions about Angular 6 or related projects, please leave a comment. I'm always happy to try and help!