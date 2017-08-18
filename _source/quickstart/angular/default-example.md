---
layout: quickstart_partial
exampleDescription: Angular Implicit
---

This guide will walk you through integrating authentication into an Angular app with Okta by performing these steps:

1. Add an OpenID Connect Client in Okta
2. Create an Angular App
3. Create an Authentication Service
4. Create an Authentication Guard
5. Create Routes
6. Connect the Routes
7. Start Your App

At the end of the Angular instructions you can choose your server type to learn more about post-authentication workflows, such as verifying tokens that your Angular application can send to your server.
## Prerequisites
If you do not already have a **Developer Edition Account**, you can create one at [https://developer.okta.com/signup/](https://developer.okta.com/signup/).
## Add an OpenID Connect Client in Okta
In Okta, applications are OpenID Connect clients that can use Okta Authorization servers to authenticate users.  Your Okta Org already has a default authorization server, so you just need to create an OIDC client that will use it.
* Log into the Okta Developer Dashboard, click **Applications** then **Add Application**.
* Choose **Single Page App (SPA)** as the platform, then submit the form the default values, which should look like this:

| Setting             | Value                                       |
| ------------------- | ------------------------------------------- |
| App Name            | My SPA App                                  |
| Base URIs           | http://localhost:3000/                      |
| Login redirect URIs | http://localhost:3000/implicit/callback     |
| Grant Types Allowed | Implicit                                    |

After you have created the application there are two more values you will need to gather:

| Setting       | Where to Find                                                                  |
| ------------- | ------------------------------------------------------------------------------ |
| Client ID     | In the applications list, or on the "General" tab of a specific application.    |
| Org URL       | On the home screen of the developer dashboard, in the upper right.             |


These values will be used in your Angular application to setup the OIDC flow with Okta.

## Create an Angular App

To quickly create an Angular app, install the Angular CLI:

```bash
npm install -g @angular/cli
```

Now, create a new app:

```bash
ng new okta-angular-app
```

This creates a new project named `okta-angular-app` and installs all required dependencies.  Now change directories into this folder:

```bash
cd okta-angular-app
```

Your Angular app will use the [Okta Auth JS](/code/javascript/okta_auth_sdk) library to redirect the user to the authorization endpoint on your Okta Org. You can install it via npm:

```bash
npm install @okta/okta-auth-js --save
```

Update your `.angular-cli.json` file to use the port `3000`:
```
"defaults": {
    "serve": {
      "port": 3000
    },
    ...
}
```

## Create an Authentication Service

You will create a class that encapsulates the interaction with the [Okta Auth JS](/code/javascript/okta_auth_sdk) library.

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
    redirectUri: 'http://localhost:3000/callback',
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

  async logout() {
    this.oktaAuth.tokenManager.clear();
    await this.oktaAuth.signOut();
  }
}
```

## Create an Authorization Guard
You will want to restrict access to routes in your application and require the user to be authenticated. You will leverage our `OktaAuthService` to ask Okta if the user is authenticated, and you'll wrap this again in a proper guard, called `OktaAuthGuard`, so that you can use it elsewhere.  Place this code into a new `src/arpp/app.guard.ts` file:
{% raw %}
```typescript
// app.guard.ts

import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OktaAuthService } from './app.service';

@Injectable()
export class OktaAuthGuard implements CanActivate {
  oktaAuth;
  authenticated;
  constructor(private okta: OktaAuthService) {
    this.authenticated = okta.isAuthenticated();
    this.oktaAuth = okta;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authenticated) { return true; }
    
    localStorage.setItem('route', state.url);
    // Redirect to login flow.
    this.oktaAuth.login();
    return false;
  }
}
```
{% endraw %}

## Create Routes

You'll want to create these routes in your sample application:

- `/`: A default home page to handle basic control of the app.
- `/protected`: A route protected by `OktaAuthGuard`.
- `/implicit/callback`: Handle the response from Okta and store the returned tokens.
- `/login`: Redirect to the Okta Org login page.

Follow the next sections to create these routes in your React application.

### `/`
Place the following code in a new file, `src/app/app.component.html`.  This will render a home page and show links to navigate within app:

```typescript
// src/Home.js

<button routerLink="/"> Home </button>
<button *ngIf="!oktaAuth.isAuthenticated()" (click)="oktaAuth.login()"> Login </button>
<button *ngIf="oktaAuth.isAuthenticated()" (click)="oktaAuth.logout()"> Logout </button>
<button routerLink="/protected"> Protected </button>

<router-outlet></router-outlet>
```

Then, update `src/app/app.compnent.ts` to handle the `login()` and `logout` calls:
```typescript
// app.component.ts

import { Component } from '@angular/core';
import { OktaAuthService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public oktaAuth: OktaAuthService) {}
}
```

### `/protected`
Create a new component `src/app/protected.component.ts`, this route will only be visible to users with a valid `accessToken`:

```typescript
// protected.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-secure',
  template: ``
})
export class ProtectedComponent {
  constructor() { console.log("Protected endpont!"); }
}
```

### `/implicit/callback`
In order to handle the redirect back from Okta, you need to capture the token values from the URL. You'll use `/implicit/callback` as the callback URL, and again you'll use our `OktaAuthService` to delegate the callback details to the [Okta Auth JS](/code/javascript/okta_auth_sdk) library.

Create a new component `src/app/callback.component.ts`:

```typescript
// callback.component.ts

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

### `/login`
This route redirects to the Okta Authorization URL if the user is not authenticated. If the user is coming from a protected page, they'll be redirected back to the page after authentication.

Create a new component `src/app/login.component.ts`:

```typescript

// login.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { OktaAuthService } from './app.service';

@Component({ template: `` })
export class LoginComponent {

  constructor(private okta: OktaAuthService, private router: Router) {
    if (okta.isAuthenticated()) {
        // Redirect to protected path
        const route = localStorage.getItem('route') || '/';
        localStorage.removeItem('route');

        router.navigateByUrl(route);
    } else {
        okta.login();
    }
  }
}
```

### Connect the Routes
Open `src/app/app.module.ts` (this was created by the generator) and replace its contents with this code, this will create your final application with the routes that you've created:

```typescript
// app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

// Okta Guard and Service
import { OktaAuthGuard } from './app.guard';
import { OktaAuthService } from './app.service';
import { CallbackComponent } from './callback.component';
import { ProtectedComponent } from './protected.component';
import { LoginComponent } from './login.component';

const appRoutes: Routes = [
  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [ OktaAuthGuard ]
  },
  {
    path: 'login',
    component: LoginComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    CallbackComponent,
    ProtectedComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    OktaAuthGuard,
    OktaAuthService,
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }

```

## Start your app
Finally, start your app:

```bash
npm start
```

If all is well, the development server should start and your application will be visible at [http://localhost:3000](http://localhost:3000)! At this point you should be able to sign in and view the protected route.

## Using the Access Token

Your Angular application now has an access token in local storage that was issued by your Okta Authorization server.  You can read this token and present it to your own server to authenticate requests for resources on your server.  As a hypothetical example, let's say that you have an API that gives us messages for our user.  You could create a `MessageList` component that requires authentication, and uses a new `okta.getAccessToken()` method to get the access token from local storage, and attach it to our resource request.

Please continue down to the next section, Server Setup, to learn about access token validation on the server.  Here is what the Angular component could look like for this hypothetical example:

First, update the `@NgModule` imports with the `HttpModule`:

```typescript
  ...
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
 ]
```
'
```typescript
// messagelist.component.ts

import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { OktaAuthService } from './app.service';
import 'rxjs/Rx';

@Injectable()
export class MessageListComponent {
  accessToken;
  message;

  constructor(private okta: OktaAuthService, private http: Http) {
      this.accessToken = okta.getAccessToken();
      const headers = new Headers({ Authorization: 'Bearer ' + this.accessToken });
      
      // Make request
      this.http.get('http://localhost:3000/api/messages', new RequestOptions({ headers: headers }))
      .map(res => res.json())
      .subscribe(message => this.message = message);
    }
}
```
