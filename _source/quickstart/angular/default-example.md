---
layout: quickstart_partial
exampleDescription: Angular Implicit
---

This guide will walk you through integrating authentication into an Angular app with Okta by performing these steps:

1. Add an OpenID Connect Client in Okta
2. Install the Okta Angular SDK
3. Attach Components to Routes
4. Use the Access Token

At the end of the Angular instructions you can choose your server type to learn more about post-authentication workflows, such as verifying tokens that your Angular application can send to your server.

## Prerequisites
* If you do not already have a **Developer Edition Account**, you can create one at [https://developer.okta.com/signup/](https://developer.okta.com/signup/).
* If you don't have an Angular app, or are new to Angular, please start with the [Angular Quickstart](https://angular.io/guide/quickstart) guide. It will walk you through the creation of an Angular app, creating routes, and other application development essentials.

## Add an OpenID Connect Client in Okta
In Okta, applications are OpenID Connect clients that can use Okta Authorization servers to authenticate users.  Your Okta Org already has a default authorization server, so you just need to create an OIDC client that will use it.
* Log into the Okta Developer Dashboard, click **Applications** then **Add Application**.
* Choose **Single Page App (SPA)** as the platform, then populate your new OpenID Connect application with values suitable for your app. If you are running this locally and using the defaults from the [Angular Quickstart](https://angular.io/guide/quickstart), your `port` will be `4200`:

| Setting             | Value                                          |
| ------------------- | ---------------------------------------------- |
| App Name            | My SPA App                                     |
| Base URIs           | http://localhost:{port}                        |
| Login redirect URIs | http://localhost:{port}/implicit/callback      |
| Grant Types Allowed | Implicit                                       |

After you have created the application there are two more values you will need to gather:

| Setting       | Where to Find                                                                  |
| ------------- | ------------------------------------------------------------------------------ |
| Client ID     | In the applications list, or on the "General" tab of a specific application.   |
| Org URL       | On the home screen of the developer dashboard, in the upper right.             |


These values will be used in your Angular application to setup the OpenID Connect flow with Okta.

## Install the Okta Angular SDK

You will need to use the [Okta Angular SDK](https://github.com/okta/okta-oidc-js/packages/okta-angular) library to sign in the user by redirecting to the authorization endpoint on your Okta Org. You can install it via npm:

```bash
npm install @okta/okta-angular --save
```

### Configuration
You will need the values from the OIDC client that you created in the previous step to instantiate the middleware. You will also need to know your Okta Org URL, which you can see on the home page of the Okta Developer console.

In your application's `module.ts` file, import the following objects and create a configuration object:

```typescript
// myApp.module.ts

import {
  OktaAuthModule,
  OktaCallbackComponent,
} from '@okta/okta-angular';

const config = {
  issuer: 'https://{yourOktaDomain}.com/oauth2/default',
  redirectUri: 'http://localhost:{port}/implicit/callback',
  clientId: '{clientId}'
}
```

## Attach Components to Routes

You'll need to provide these routes in your sample application, so that we can sign the user in and handle the callback from Okta. We will show you how to set these up below using [Angular Router](https://angular.io/guide/router):

- `/`: A default home page to handle basic control of the app.
- `/implicit/callback`: Handle the response from Okta and store the returned tokens.

### Provide the Login and Logout Buttons
In the relevant location in your application, you will want to provide `Login` and `Logout` buttons for the user. You can show/hide the correct button by using the `oktaAuth.isAuthenticated()` method. For example:

```typescript
import { Component } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-root',
  template: `
    <button *ngIf="!oktaAuth.isAuthenticated()" (click)="oktaAuth.loginRedirect()"> Login </button>
    <button *ngIf="oktaAuth.isAuthenticated()" (click)="oktaAuth.logout()"> Logout </button>
  `,
})
export class AppComponent {
  constructor(public oktaAuth: OktaAuthService) {}
}
```

### Create the Callback Handler
In order to handle the redirect back from Okta, you need to capture the token values from the URL. You'll use `/implicit/callback` as the callback URL, and specify the default `OktaCallbackComponent` and declare it in your `NgModule`.

```typescript
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  {
    path: 'implicit/callback',
    component: OktaCallbackComponent
  },
  ...
]
```

### Update your `NgModule`
Finally, import the `OktaAuthModule` into your `NgModule`, and instantiate it by passing in your configuration object:

```typescript
@NgModule({
  imports: [
    ...
    RouterModule.forRoot(appRoutes),
    OktaAuthModule.initAuth(config)
  ],
})
export class MyAppModule { }
```

## Use the Access Token

Your Angular application now has an access token in local storage that was issued by your Okta Authorization server. You can use this token to authenticate requests for resources on your server or API. As a hypothetical example, let's say that you have an API that gives us messages for our user.  You could create a `MessageList` component that gets the access token from local storage, and use it to make an authenticated request to your server.

Here is what the Angular component could look like for this hypothetical example:

```typescript
// messagelist.component.ts

import { Component } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { OktaAuthService } from '@okta/okta-angular';
import 'rxjs/Rx';

@Component({
  template: `
    <div *ngIf="messages.length">
      <li *ngFor="let message of messages">{{message.message}}</li>
    </div>
  `
})
export class MessageListComponent {
  messages = [];
  constructor(private oktaAuth: OktaAuthService, private http: Http) {
    const headers = new Headers({ Authorization: 'Bearer ' + oktaAuth.getAccessToken().accessToken });
    // Make request
    this.http.get(
      'http://localhost:{serverPort}/api/messages',
      new RequestOptions({ headers: headers })
    )
    .map(res => res.json())
    .subscribe((messages: Array<Object>) => messages.forEach(message => this.messages.push(message)));
  }
}
```

In the next section you can select your server technology to see how your server can read this incoming token and validate it.