---
layout: blog_post
title: Build an Angular App with Okta's Sign-In Widget in 15 Minutes
author: mraible
tags: [angular, sign-in widget, okta, typescript, angular-cli]
---

AngularJS reigned as king of JavaScript MVC frameworks for several years. However, when the Angular team announced they would not provide backwards compatibility for their next version, there was a bit of a stir in its community, giving opportunities for frameworks like React and Vue.js to flourish. Fast forward a few years and both Angular 2 and Angular 4 have been released. Many developers are trying its TypeScript and finding the experience a pleasant one. [According to JAXenter](https://jaxenter.com/technology-trends-2017-top-frameworks-131993.html), it’s doing a pretty good job, and holding strong as the third most popular UI framework, behind React and HTML5.

In this article, I’ll show you a quick way to get started with Angular, and add user authentication with [Okta's Sign-In Widget](/code/javascript/okta_sign-in_widget). If you’re just getting started with Angular, you might want to read my [Angular tutorial](http://gist.asciidoctor.org/?github-mraible/ng-demo//README.adoc). If you’d like to get the source code used in this article, you can [find it on GitHub](https://github.com/oktadeveloper/okta-angular-sign-in-widget-example).

## Why User Authentication with Okta?

Okta provides an API service that allows developers to create, edit, and securely store user accounts and user account data, and connect them with one or multiple applications. We make user account management easier, more secure, and scalable so you can get to production sooner.

The [Okta Sign-in Widget][widget-reference] provides an embeddable JavaScript sign-in implementation that can be easily customized. The Sign-in Widget carries the same feature set in the standard Okta sign-in page of every tenant – with the added flexibility to change the look-and-feel. Included in the widget is support for password reset, forgotten password and strong authentication – all of which are driven by policies configured in Okta. Developers don’t have to write a single line of code to trigger these functions from within the widget. For consumer facing sites, social providers are also supported in the widget.

## Create an Angular Application

Angular 4 was [recently released](http://angularjs.blogspot.com/2017/03/angular-400-now-available.html), as well as [Angular CLI 1.4.4](https://github.com/angular/angular-cli/releases/tag/v1.4.4). To see how you might use Okta's Sign-In Widget in a simple Angular application, create a new application with Angular CLI. First, you’ll need to install Angular CLI.

```bash
npm install -g @angular/cli
```

After this command completes, you can create a new application.

``` bash
[mraible:~] $ ng new angular-okta-example
  create angular-okta-example/README.md (1034 bytes)
  create angular-okta-example/.angular-cli.json (1255 bytes)
  create angular-okta-example/.editorconfig (245 bytes)
  create angular-okta-example/.gitignore (516 bytes)
  create angular-okta-example/src/assets/.gitkeep (0 bytes)
  create angular-okta-example/src/environments/environment.prod.ts (51 bytes)
  create angular-okta-example/src/environments/environment.ts (387 bytes)
  create angular-okta-example/src/favicon.ico (5430 bytes)
  create angular-okta-example/src/index.html (305 bytes)
  create angular-okta-example/src/main.ts (370 bytes)
  create angular-okta-example/src/polyfills.ts (2498 bytes)
  create angular-okta-example/src/styles.css (80 bytes)
  create angular-okta-example/src/test.ts (1085 bytes)
  create angular-okta-example/src/tsconfig.app.json (211 bytes)
  create angular-okta-example/src/tsconfig.spec.json (304 bytes)
  create angular-okta-example/src/typings.d.ts (104 bytes)
  create angular-okta-example/e2e/app.e2e-spec.ts (302 bytes)
  create angular-okta-example/e2e/app.po.ts (208 bytes)
  create angular-okta-example/e2e/tsconfig.e2e.json (235 bytes)
  create angular-okta-example/karma.conf.js (923 bytes)
  create angular-okta-example/package.json (1325 bytes)
  create angular-okta-example/protractor.conf.js (722 bytes)
  create angular-okta-example/tsconfig.json (363 bytes)
  create angular-okta-example/tslint.json (2968 bytes)
  create angular-okta-example/src/app/app.module.ts (314 bytes)
  create angular-okta-example/src/app/app.component.css (0 bytes)
  create angular-okta-example/src/app/app.component.html (1120 bytes)
  create angular-okta-example/src/app/app.component.spec.ts (986 bytes)
  create angular-okta-example/src/app/app.component.ts (207 bytes)
You can `ng set --global packageManager=yarn`.
Installing packages for tooling via npm.
Installed packages for tooling via npm.
Successfully initialized git.
Project 'angular-okta-example' successfully created.
[mraible:~] 2m6s $
```

This will create a new `angular-okta-example` directory and install all the necessary dependencies. To verify everything works, run `ng e2e` in a terminal window. All tests should pass and you should see results like the following.

{% img blog/angular-sign-in-widget/e2e-success.png alt:"Running e2e" width:"800" %}{: .center-image }

## Integrate Okta’s Sign-In Widget in Angular

Now we’re going to leverage Okta’s Sign-In Widget for an easily customizable login view. To start, install the [Okta Sign-In Widget](https://github.com/okta/okta-signin-widget) using npm.

```bash
npm install --save @okta/okta-signin-widget
```

Add the widget's CSS to `src/styles.css`:

```css
@import '~https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/2.1.0/css/okta-sign-in.min.css';
@import '~https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/2.1.0/css/okta-theme.css';
```

Create `src/app/shared/okta/okta.service.ts` and use it to wrap the widget's configuration and make it an injectable service.

```ts
import { Injectable } from '@angular/core';
import * as OktaSignIn from '@okta/okta-signin-widget/dist/js/okta-sign-in.min.js';

@Injectable()
export class Okta {
  widget;

  constructor() {
    this.widget = new OktaSignIn({
      baseUrl: 'https://{yourOktaDomain}.com',
      clientId: '{clientId}',
      redirectUri: 'http://localhost:4200'
    });
  }

  getWidget() {
    return this.widget;
  }
}
```

To make this service available to all components in the application, modify `app.module.ts` and list `Okta` as a provider.

```ts
import { Okta } from './shared/okta/okta.service';

@NgModule({
  ...
  providers: [Okta],
  bootstrap: [AppComponent]
})
```

Before this will work, you'll need to create an OpenID Connect (OIDC) application in Okta so you can replace the `{yourOktaDomain}` and `{clientId}` references when initializing the widget.

## Create an OpenID Connect App in Okta

OpenID Connect is built on top of the OAuth 2.0 protocol. It allows clients to verify the identity of the user and, as well as to obtain their basic profile information. To learn more, see [http://openid.net/connect](http://openid.net/connect/).

Login to your Okta account, or [create one](https://developer.okta.com/signup/) if you don't have one. Navigate to **Applications** and click on the **Add Application** button. Select **SPA** and click **Next**. On the next page, specify `http://localhost:4200` as a Base URI, Login redirect URI, and Logout redirect URI. Click **Done** and you should see settings like the following.

{% img blog/angular-sign-in-widget/oidc-settings.png alt:"OIDC App Settings" width:"700" %}{: .center-image }

## Show the Sign-In Widget

After making these changes, copy the your Client ID and Platform ID into `okta.service.ts`. Then modify `app.component.ts` to use the `Okta` service and the widget to login/logout.

```ts
import { Component, OnInit } from '@angular/core';
import { Okta } from './shared/okta/okta.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  user;
  oktaSignIn;

  constructor(private okta: Okta) {
    this.oktaSignIn = okta.getWidget();
  }

  showLogin() {
    this.oktaSignIn.renderEl({el: '#okta-login-container'}, (response) => {
      if (response.status === 'SUCCESS') {
        this.user = response.claims.email;
      }
    });
  }

  ngOnInit() {
    this.oktaSignIn.session.get((response) => {
      if (response.status !== 'INACTIVE') {
        this.user = response.login
      } else {
        this.showLogin();
      }
    });
  }

  logout() {
    this.oktaSignIn.signOut(() => {
      this.showLogin();
      this.user = undefined;
    });
  }
}
```

And modify `app.component.html` to have a `<div>` with `id="okta-login-container"` and a place to show the logged in user's email.

{% raw %}
```html
<div *ngIf="!user" id="okta-login-container"></div>

<div *ngIf="user">
  Hello {{user}}

  <button (click)="logout()">Logout</button>
</div>
```
{% endraw %}

Run `ng serve`, and open your browser to [http://localhost:4200](http://localhost:4200). You should see the sign-in widget. Enter one of
your user's credentials to login. You should see a "Hello {email}" message with a logout button.

{% img blog/angular-sign-in-widget/login-success.png alt:"Login Success" width:"800" %}{: .center-image }

**NOTE:** You may experience an issue where the sign-in process seems to hang. Clicking anywhere in the browser window seems to solve this problem. I’m not sure why this happens. You can track this issue [here](https://github.com/okta/okta-signin-widget/issues/268).

If it works - congrats! If it doesn't, please post a question to Stack Overflow with an [okta tag](http://stackoverflow.com/questions/tagged/okta), or hit me up [on Twitter](https://twitter.com/mraible).

#### Customize the Widget CSS

If you'd like to customize the widget's CSS, the easiest way is you write your own CSS. Remove the CSS `@import` statements you added to `src/styles.css`. Add an `@import` for [Bootstrap 4](https://getbootstrap.com/) and a few style rules to position elements. Copy the following code into `src/styles.css`.

```css
@import url(https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css);

#okta-login-container {
  margin: 0 auto;
  max-width: 400px;
  border: 1px solid silver;
  padding: 20px;
  box-shadow: 5px 5px 5px 0 silver;
}

#okta-login-container input {
  margin-bottom: 5px;
  width: 100%;
  padding: 5px;
}

#okta-login-container input[type=checkbox] {
  width: 25px;
}
```

After making these changes, the sign-in widget will look like the following screenshot.

{% img blog/angular-sign-in-widget/custom-css.png alt:"Custom CSS" width:"800" %}{: .center-image }

## Fix Your Tests
If you try to run `npm test` or `ng test`, tests will fail:

```bash
Chrome 61.0.3163 (Mac OS X 10.12.6): Executed 3 of 3 (3 FAILED) (0 secs / 0.157 secs)
Chrome 61.0.3163 (Mac OS X 10.12.6) AppComponent should render title in a h1 tag FAILED
	Failed: No provider for Okta!
```

To fix this, specify `Okta` as a provider in `src/app/app.component.spec.ts`.

```ts
import { Okta } from './shared/okta/okta.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [Okta]
    }).compileComponents();
  }));

```

After making this changes, you should see the sweet smell of success.

```bash
Chrome 61.0.3163 (Mac OS X 10.12.6): Executed 3 of 3 SUCCESS (0.77 secs / 0.759 secs)
```

Protractor tests should still work as well. You can prove this by running `ng e2e` in a terminal window.

## Angular + Okta

You can find a completed version of the application created in this blog post [on GitHub](https://github.com/oktadeveloper/okta-angular-sign-in-widget-example). In a future post, I’ll show you how to create a more Angular-native experience, where you control the HTML for the login form.

Building authentication in an application is hard. It’s even less fun to build it over and over again in each application you build. Okta does the hard part for you and makes it a lot more fun to be a developer! [Sign up for a forever-free developer account and try Okta today!](https://developer.okta.com/signup/).

I hope you’ve enjoyed this quick tour of our Angular support. If you have questions about Okta’s features, or what we’re building next, please hit me up [on Twitter](https://twitter.com/mraible), [post a question to Stack Overflow with an “okta” tag](http://stackoverflow.com/questions/tagged/okta), or [open a new issue on GitHub](https://github.com/oktadeveloper/okta-angular-sign-in-widget-example/issues/new).

**Changelog:**

* Sep 30, 2017: Updated to use Angular CLI 1.4.4 and Okta Sign-In Widget 2.1.0. See the code changes in the [example app on GitHub](https://github.com/oktadeveloper/okta-angular-sign-in-widget-example/pull/8). Updated "create an OIDC app" instructions for the [Okta Developer Console](/blog/2017/09/25/all-new-developer-console).

[widget-reference]: https://github.com/okta/okta-signin-widget