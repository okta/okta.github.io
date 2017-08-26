---
layout: quickstart_partial
exampleDescription: Angular Implicit
---

This guide will walk you through integrating authentication into an Angular app with Okta by performing these steps:

1. Add an OpenID Connect Client in Okta
2. Create an Authentication Service
3. Create Routes
4. Use the Access Token

At the end of the Angular instructions you can choose your server type to learn more about post-authentication workflows, such as verifying tokens that your Angular application can send to your server.

## Prerequisites
* If you do not already have a **Developer Edition Account**, you can create one at [https://developer.okta.com/signup/](https://developer.okta.com/signup/).
* If you don't have an Angular app, or are new to Angular, please start with the [Angular Quickstart](https://angular.io/guide/quickstart) guide. It will walk you through the creation of an Angular app, creating routes, and other application development essentials.

## Add an OpenID Connect Client in Okta
In Okta, applications are OpenID Connect clients that can use Okta Authorization servers to authenticate users.  Your Okta Org already has a default authorization server, so you just need to create an OIDC client that will use it.
* Log into the Okta Developer Dashboard, click **Applications** then **Add Application**.
* Choose **Single Page App (SPA)** as the platform, then submit the form the default values, which should look like this:

| Setting             | Value                                          |
| ------------------- | ---------------------------------------------- |
| App Name            | My SPA App                                     |
| Base URIs           | http://localhost:{port}                        |
| Login redirect URIs | http://localhost:{port}/implicit/callback      |
| Grant Types Allowed | Implicit                                       |

After you have created the application there are two more values you will need to gather:

| Setting       | Where to Find                                                                  |
| ------------- | ------------------------------------------------------------------------------ |
| Client ID     | In the applications list, or on the "General" tab of a specific application.    |
| Org URL       | On the home screen of the developer dashboard, in the upper right.             |


These values will be used in your Angular application to setup the OpenID Connect flow with Okta.

## Create an Authentication Service

You will need to use the [Okta Auth JS](/code/javascript/okta_auth_sdk.html) library to sign in the user by redirecting to the authorization endpoint on your Okta Org. You can install it via npm:

```bash
npm install @okta/okta-auth-js --save
```

You will need to create a class that encapsulates the interaction with the [Okta Auth JS](/code/javascript/okta_auth_sdk.html) library.

To create this file, you will need the values from the OIDC client that you created in the previous step.  You will also need to know your Okta Org URL, which you can see on the home page of the Okta Developer console.

Create a new file `src/app/app.service.ts` and add the following code to it, replacing the `{yourOktaDomain}` with your Org URL, and `{clientId}` with the Client ID of the application that you created:

```typescript
// app.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as OktaAuth from '@okta/okta-auth-js/dist/okta-auth-js.min.js';

@Injectable()
export class OktaAuthService {

  oktaAuth = new OktaAuth({
    url: 'https://{yourOktaDomain}.com/',
    clientId: '{clientId}',
    issuer: 'https://{yourOktaDomain}.com/oauth2/default',
    redirectUri: 'http://localhost:{port}/implicit/callback',
  });

  constructor(private router: Router) {}

  isAuthenticated() {
    // Checks if there is a current accessToken in the TokenManger.
    return !!this.oktaAuth.tokenManager.get('accessToken');
  }

  login() {
    // Launches the login redirect.
    this.oktaAuth.token.getWithRedirect({ 
      responseType: ['id_token', 'token'],
      scopes: ['openid', 'email', 'profile']
    });
  }

  async handleAuthentication() {
    const tokens = await this.oktaAuth.token.parseFromUrl();
    tokens.forEach(token => {
      if (token.idToken) {
        this.oktaAuth.tokenManager.add('idToken', token);
      }
      if (token.accessToken) {
        this.oktaAuth.tokenManager.add('accessToken', token);
      }
    });
  }

  getAccessToken() {
    // Return the token from the accessToken object.
    return this.oktaAuth.tokenManager.get("accessToken").accessToken;
  }

  async logout() {
    this.oktaAuth.tokenManager.clear();
    await this.oktaAuth.signOut();
  }
}
```

## Create Routes

You'll need to provide these routes in your sample application, so that we can sign the user in and handle the callback from Okta:

- `/`: A default home page to handle basic control of the app.
- `/implicit/callback`: Handle the response from Okta and store the returned tokens.

### Provide the Login and Logout Buttons
In the relevant location in your application, you will want to provide `Login` and `Logout` buttons for the user. You can show/hide the correct button by using the `oktaAuth.isAuthenticated()` method. For example:

```typescript
import { Component } from '@angular/core';
import { OktaAuthService } from './app.service';

@Component({
  template: `
    <button *ngIf="!oktaAuth.isAuthenticated()" (click)="oktaAuth.login()"> Login </button>
    <button *ngIf="oktaAuth.isAuthenticated()" (click)="oktaAuth.logout()"> Logout </button>
  `,
})
export class AppComponent {
  constructor(public oktaAuth: OktaAuthService) {}
}
```

### Create the Callback Handler
In order to handle the redirect back from Okta, you need to capture the token values from the URL. You'll use `/implicit/callback` as the callback URL, and again you'll use our `OktaAuthService` to delegate the callback details to the [Okta Auth JS](/code/javascript/okta_auth_sdk) library.

Create a new component `callback.component.ts`, and have it handle the `/implicit/callback` route:

```typescript

import { Component } from '@angular/core';
import { OktaAuthService } from './app.service';

@Component({ template: `` })
export class CallbackComponent {

  constructor(private okta: OktaAuthService) {
    // Handles the response from Okta and parses tokens
    okta.handleAuthentication();
  }
}
```

## Use the Access Token

Your Angular application now has an access token in local storage that was issued by your Okta Authorization server. You can use this token to authenticate requests for resources on your server or API. As a hypothetical example, let's say that you have an API that gives us messages for our user.  You could create a `MessageList` component that gets the access token from local storage, and use it to make an authenticated request to your server.

Please continue down to the next section, Server Setup, to learn about access token validation on the server.  Here is what the Angular component could look like for this hypothetical example:

```typescript
// messagelist.component.ts

import { Component } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { OktaAuthService } from './app.service';
import 'rxjs/Rx';

@Component({ template: `{{messages}}` })
export class MessageListComponent {
  accessToken;
  message;

  constructor(private okta: OktaAuthService, private http: Http) {
      this.accessToken = okta.getAccessToken();
      const headers = new Headers({ Authorization: 'Bearer ' + this.accessToken });
      
      // Make request
      this.http.get('http://localhost:{serverPort}/api/messages', new RequestOptions({ headers: headers }))
      .map(res => res.json())
      .subscribe(message => this.message = message);
    }
}
```
