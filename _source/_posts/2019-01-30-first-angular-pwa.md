---
layout: blog_post
title: "Build Your First PWA with Angular"
author: holgerschmitz
description: "This post shows you how to build a PWA (Progressive Web Application) with Angular, Angular CLI, and Angular Material."
tags: [angular, angular cli, angular material, pwa, angular pwa]
tweets:
- "Want to learn how to build an @angular PWA? This tutorial has you covered!"
- "Get started building your first Angular PWA today. It's pretty darn easy thanks to @angularcli!"
- "TypeScript + Angular + PWA == a web developers dream. Start living your dream today!"
image: blog/featured/okta-angular-headphones.jpg
---

During the last two years, everybody started talking about Progressive Web Applications, or PWAs for short. But what is this new type of application, and how can it make your life as an Angular developer better? To understand what PWAs are all about, and how you can build them in Angular, let's consider the following scenario. You are out and about in an area with little or no network reception. You are using a cool web app to search for a good book to read. Traditional web applications only work while you are online. Every time you lose the network the application will stall. What's more, a typical app will load all of its scripts before starting up. This means that you might have to wait a minute or more for the first page to load. In conditions like this, you will quickly give up and abandon the application altogether.

This is where progressive web applications come into play. PWA leverage a number of current browser technologies in order to provide a smooth user experience even in situations with little or no network connection. They use service workers which act a little like a proxy to intercept network requests and cache the responses. They allow the complete application to be installed in the client's browser. This means that the user can experience the web application.

In this tutorial, I will show you how to create a complete progressive web app in Angular 7. The application will allow the user to search for book titles using the [OpenLibrary](http://openlibrary.org) service. I will be using a Material Design library, Angular Material, to give the application layout a professional appearance and make it responsive.

## Create Your Single Page Application with Angular

Start by creating a single page application with Angular 7. I will assume that you have Node installed on your system. To begin you will need to install the Angular command line tool. Open a shell and enter the following command.

```bash
npm install -g @angular/cli@7.1.3
```

This will install the `ng` command on your system. Depending on your system settings you might need to run this command using `sudo`. Once `npm` has finished installing, you'll be ready to create a new Angular project. In the shell, navigate to the directory in which you want to create your application and type the following command.

```bash
ng new AngularBooksPWA
```

This will create a new directory called `AngularBooksPWA` and create an Angular application in it. The script will ask you two questions. When you are asked if you want to use the Router in your project, answer **Yes**. The router will allow you to navigate between different application components using the browser's URL. Next, you are going to be prompted for the CSS technology that you wish to use. In this simple project, I will be using plain CSS. For larger projects, you should switch this to one of the other technologies. Once you have answered the questions `ng` will install all the necessary packages into the newly created application directory and create a number of files to help you get started quickly.

## Add Angular Material

Next, navigate into your project's directory and run the following command.

```bash
npm install @angular/material@7.1.0 @angular/cdk@7.1.0 @angular/animations@7.1.0 @angular/flex-layout@7.0.0-beta.19
```

This command will install all the necessary packages for using Material Design. Material design uses an icon font to display icons. This font is hosted on Google's CDN. To include the icon font, open the `src/index.html` file and add the following line inside the `<head>` tags.

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

The `src/app/app.module.ts` contains the imports for the modules which will be available throughout the application. In order to import the Angular Material modules that you will be using, open the file and update it to match the following.

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout";

import { MatToolbarModule,
         MatMenuModule,
         MatIconModule,
         MatCardModule,
         MatButtonModule,
         MatTableModule,
         MatDividerModule,
         MatProgressSpinnerModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

The template for the main component of the application lives in the `src/app/app.component.html` file. Open this file and replace the contents with the following code.

{% raw %}
```html
<mat-toolbar color="primary" class="expanded-toolbar">
    <span>
      <button mat-button routerLink="/">{{title}}</button>
      <button mat-button routerLink="/"><mat-icon>home</mat-icon></button>
    </span>
    <div fxLayout="row" fxShow="false" fxShow.gt-sm>
        <form [formGroup]="searchForm" (ngSubmit)="onSearch()">
          <div class="input-group">
            <input class="input-group-field" type="search" value="" placeholder="Search" formControlName="search">
            <div class="input-group-button"><button mat-flat-button color="accent"><mat-icon>search</mat-icon></button></div>
          </div>
        </form>
    </div>
    <button mat-button [mat-menu-trigger-for]="menu" fxHide="false" fxHide.gt-sm>
     <mat-icon>menu</mat-icon>
    </button>
</mat-toolbar>
<mat-menu x-position="before" #menu="matMenu">
    <button mat-menu-item routerLink="/"><mat-icon>home</mat-icon> Home</button>

    <form [formGroup]="searchForm" (ngSubmit)="onSearch()">
      <div class="input-group">
        <input class="input-group-field" type="search" value="" placeholder="Search" formControlName="search">
        <div class="input-group-button"><button mat-button routerLink="/"><mat-icon>magnify</mat-icon></button></div>
      </div>
    </form>
</mat-menu>
<router-outlet></router-outlet>
```
{% endraw %}

You might notice the `routerLink` attributes used in various places. These refer to components that will be added later in this tutorial. Also, note the HTML `<form>` tag and the `formGroup` attribute. This is the search form that will allow you to search for book titles. I will be referring to this when implementing the application component.

Next, I will add a bit of styling. Angular separates the style sheets into a single global style sheet and local style sheets for each component. First, open the global style sheet in `src/style.css` and paste the following content into it.

```css
@import "~@angular/material/prebuilt-themes/deeppurple-amber.css";

body {
  margin: 0;
  font-family: sans-serif;
}

h1, h2 {
  text-align: center;
}

.input-group {
  display: flex;
  align-items: stretch;
}

.input-group-field {
  margin-right: 0;
}

.input-group .input-group-button {
  margin-left: 0;
  border: none;
}

.input-group .mat-flat-button {
  border-radius: 0;
}
```

The first line in this style sheet in necessary to apply the correct styles to any Angular Material components. The local style for the main application component is found in `src/app/app.component.css`. Add the toolbar styling here.

```css
.expanded-toolbar {
  justify-content: space-between;
  align-items: center;
}
```

## Add a Search Feature with Angular

Now, you are finally ready to implement the main application component. Open `src/app/app.component.ts` and replace its content with the following.

```ts
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";

import { BooksService } from './books/books.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularBooksPWA';
  searchForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private router: Router) {
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      search: ['', Validators.required],
    });
  }

  onSearch() {
    if (!this.searchForm.valid) return;
    this.router.navigate(['search'], { queryParams: {query: this.searchForm.get('search').value}});
  }
}
```

There are two things to note about this code. The `searchForm` attribute is a `FormGroup` which is created using the `FormBuilder`. The builder allows the creation of form elements that can be associated with validators to allow easy validation of any user input. When the user submits the form, the `onSearch()` function is called. This checks for valid user input and then simply forwards the call to the router. Note how the query string is passed to the router. This will append the query to the URL and make it available to the `search` route.  The router will pick the appropriate component and the book search is handled within that component. This means that the responsibility for performing the search request is encapsulated in the local scope of a single component. When building larger applications, this separation of responsibilities is an important technique to keep the code simple and maintainable.

## Create a BookService to talk to the OpenLibrary API

Next, create a service that will provide a high-level interface to the OpenLibrary API. To have Angular create the service, open the shell again in the application root directory and run the following command.

```bash
ng generate service books/books
```

This will create two files in the `src/app/books` directory. Open the `books.service.ts` file and replace its contents with the following.

```ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

const baseUrl = 'http://openlibrary.org';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http: HttpClient) { }

  async get(route: string, data?: any) {
    const url = baseUrl+route;
    let params = new HttpParams();

    if (data!==undefined) {
      Object.getOwnPropertyNames(data).forEach(key => {
        params = params.set(key, data[key]);
      });
    }

    const result = this.http.get(url, {
      responseType: 'json',
      params: params
    });

    return new Promise<any>((resolve, reject) => {
      result.subscribe(resolve as any, reject as any);
    });
  }

  searchBooks(query: string) {
    return this.get('/search.json', {title: query});
  }
}
```

To keep things simple, you can use a single route into the OpenLibrary API. The `search.json` route takes a search request and returns a list of books together with some information about them. Note how the functions return a `Promise` object. This will make it easier to use them later on in using the `async/await` technique.

## Generate Angular Components for Your PWA using Angular CLI

Now it's time to turn your attention to the components that make up the books search application. There will be three components in total. The `Home` component displays the splash screen, `Search` lists the book search results and `Details` displays detailed information about a single book. To create these components, open the shell and execute the following commands.

```bash
ng generate component home
ng generate component search
ng generate component details
```

After having created these three components, you have to link them to specific routes using the `Router`. Open `src/app/app-routing.module.ts` and add routes for the components you just created.

```ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'details', component: DetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

Start with the `Home` component. This component will consist only of two simple headings. Open `src/app/home/home.component.html` and enter the lines below.

```html
<h1>Angular Books PWA</h1>
<h2>A simple progressive web application</h2>
```

Next, implement the search component by  changing the code in `src/app/search/search.component.ts` to look like the following.

```ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { BooksService } from '../books/books.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private subscription: Subscription;

  displayedColumns: string[] = ['title', 'author', 'publication', 'details'];
  books = new MatTableDataSource<any>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private bookService: BooksService) { }

  ngOnInit() {
    this.subscription = this.route.queryParams.subscribe(params => {
      this.searchBooks(params['query']);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async searchBooks(query: string) {
    const results = await this.bookService.searchBooks(query);

    this.books.data = results.docs;
  }

  viewDetails(book) {
    console.log(book);
    this.router.navigate(['details'], { queryParams: {
      title: book.title,
      authors: book.author_name && book.author_name.join(', '),
      year: book.first_publish_year,
      cover_id: book.cover_edition_key
    }});
  }
}
```

There are a few things going on here. During initialization of the component, the search query is obtained by subscribing to the `ActivatedRoute.queryParams` Observable. Whenever the value changes, this will call the `searchBooks` method. Inside this method, the `BooksService`, which you implemented earlier, is used to obtain a list of books. The result is passed to a `MatTableDataSource` object that allows displaying beautiful tables with the Angular Material library.

Take a look at the `src/app/search/search.component.html` and update its HTML to match the template below.

{% raw %}
```html
<h1 class="h1">Search Results</h1>
<div fxLayout="row" fxLayout.xs="column" fxLayoutAlign="center" class="products">
  <table mat-table fxFlex="100%" fxFlex.gt-sm="66%" [dataSource]="books" class="mat-elevation-z1">
    <ng-container matColumnDef="title">
      <th mat-header-cell *matHeaderCellDef>Title</th>
      <td mat-cell *matCellDef="let book"> {{book.title}} </td>
    </ng-container>
    <ng-container matColumnDef="author">
      <th mat-header-cell *matHeaderCellDef>Author</th>
      <td mat-cell *matCellDef="let book"> {{book.author_name && book.author_name.join(', ')}} </td>
    </ng-container>
    <ng-container matColumnDef="publication">
      <th mat-header-cell *matHeaderCellDef>Pub. Year</th>
      <td mat-cell *matCellDef="let book"> {{book.first_publish_year}} </td>
    </ng-container>
    <ng-container matColumnDef="details">
      <th mat-header-cell *matHeaderCellDef></th>
      <td mat-cell *matCellDef="let book">
        <button mat-icon-button (click)="viewDetails(book)"><mat-icon>visibility</mat-icon></button>
      </td>
    </ng-container>
    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>
</div>
```
{% endraw %}

This table uses the data source to display the search results. The last component displays the details of the book, including its cover image. Just like the `Search` component, the data is obtained through subscribing to the route parameters. Open `src/app/details/details.component.ts` and update the content to the following.

```ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  private subscription: Subscription;
  book: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.subscription = this.route.queryParams.subscribe(params => {
      this.updateDetails(params);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  updateDetails(book) {
    this.book = book;
  }
}
```

The template simply shows some of the fields in the book's data structure. Copy the following into `src/app/details/details.component.html`.

{% raw %}
```html
<h1 class="h1">Book Details</h1>
<div fxLayout="row" fxLayout.xs="column" fxLayoutAlign="center" class="products">
  <mat-card fxFlex="100%" fxFlex.gt-sm="66%" class="mat-elevation-z1">
    <h3>{{book.title}}</h3>
    <img src="http://covers.openlibrary.org/b/OLID/{{book.cover_id}}-M.jpg" />
    <h4>Authors</h4>
    <p>
      {{book.authors}}
    </p>
    <h4>Published</h4>
    <p>
      {{book.year}}
    </p>
  </mat-card>
</div>
```
{% endraw %}

## Run Your Angular PWA

The application is now complete. You can now start up and test the application. When building a PWA, you should not use the `ng serve` command to run your application. This is OK during development but it will disable a number of features that are necessary for the performance of PWAs. Instead, you need to build the application in production mode and the serve it using the `http-server-spa` command. Run the following commands.

```bash
npm install -g http-server-spa@1.3.0
ng build --prod --source-map
http-server-spa dist/AngularBooksPWA/ index.html 8080
```

You need to run the first command only once to install the `http-server-spa` command. The second line builds your Angular app. With the `--source-map` option you will generate source maps that help you debugging in the browser. The last command starts the HTTP server. Open your browser, navigate to `http://localhost:8080`, and enter a book title in the search bar. You should see a list of books, somewhat like this.

{% img blog/first-angular-pwa/search-results.png alt:"search results" width:"800" %}{: .center-image }

## Add Authentication to your Angular PWA

A complete application will have to have some user authentication to restrict access to some of the information contained within the application. Okta allows you to implement authentication in a quick, easy, and safe way. In this section I will show you how to implement authentication using the Okta libraries for Angular. If you haven't done so already, register a developer account with Okta.

{% img blog/first-angular-pwa/developer.okta.com.png alt:"developer.okta.com" width:"800" %}{: .center-image }

Open your browser and navigate to [developer.okta.com](https://developer.okta.com/). Click on **Create Free Account**.  On the next screen enter your details and click **Get Started**. You will be taken to your Okta developer dashboard. Each application that uses the Okta authentication service needs to be registered in the dashboard. Click on **Add Application** to create a new application.

{% img blog/first-angular-pwa/okta-applications.png alt:"Okta Applications" width:"800" %}{: .center-image }

The PWA that you are creating falls under the single page application category. Choose **Single Page App** and click **Next**.

{% img blog/first-angular-pwa/new-app.png alt:"New Okta Application" width:"800" %}{: .center-image }

On the next page, you will be shown the settings for the application. You can leave the default settings untouched and click on **Done**. On the following screen you will be presented with a **Client ID**. This is needed in your application.

To add authentication to your PWA, first install the Okta library for Angular.

```bash
npm install @okta/okta-angular@1.0.7 --save-exact
```

Open `app.module.ts` and import the `OktaAuthModule`.

```ts
import { OktaAuthModule } from '@okta/okta-angular';
```

Add the `OktaAuthModule` to the list of `imports` of the `app`.

```ts
OktaAuthModule.initAuth({
  issuer: 'https://{yourOktaDomain}/oauth2/default',
  redirectUri: 'http://localhost:8080/implicit/callback',
  clientId: '{yourClientId}'
})
```

The `{yourClientId}` has to be replaced by the client ID that you obtained when registering your application. Next, open `app.component.ts`, and import the service.

```ts
import { OktaAuthService } from '@okta/okta-angular';
```
Create an `isAuthenticated` field as a property of the `AppComponent`.

```ts
isAuthenticated: boolean;
```

Then, modify the constructor to inject the service and subscribe to it.

```ts
constructor(private formBuilder: FormBuilder,
            private router: Router,
            public oktaAuth: OktaAuthService) {
  this.oktaAuth.$authenticationState.subscribe(
    (isAuthenticated: boolean)  => this.isAuthenticated = isAuthenticated
  );
}
```

Whenever the authentication status changes this will be reflected in the `isAuthenticated` property. You will still need to initialize it when the component is loaded. In the `ngOnInit()` method add the line

```ts
this.oktaAuth.isAuthenticated().then((auth) => {this.isAuthenticated = auth});
```

You want the application to be able to react to login and logout requests. To do this, implement the `login()` and `logout()` methods as follows.

```ts
login() {
  this.oktaAuth.loginRedirect();
}

logout() {
  this.oktaAuth.logout('/');
}
```

Open `app.component.html` and add the following lines to the top bar before `<div fxLayout="row" fxShow="false" fxShow.gt-sm>`.

```html
<button mat-button *ngIf="!isAuthenticated" (click)="login()"> Login </button>
<button mat-button *ngIf="isAuthenticated" (click)="logout()"> Logout </button>
```

Finally, you need to register the route that will be used for the login request. Open `app-routing.module.ts` and add the following imports.

```ts
import { OktaCallbackComponent, OktaAuthGuard } from '@okta/okta-angular';
```

Add the `implicit/callback` route to the `routes` array.

```ts
{ path: 'implicit/callback', component: OktaCallbackComponent }
```

This is the route that the Okta authorization service will return to, once authentication is completed. The next step is to protect the `search` and the `details` routes from unauthorized access, add the following setting to both routes.

```ts
canActivate: [OktaAuthGuard]
```

Your routes array should look as follows after these changes.

```ts
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: SearchComponent, canActivate: [OktaAuthGuard] },
  { path: 'details', component: DetailsComponent, canActivate: [OktaAuthGuard] },
  { path: 'implicit/callback', component: OktaCallbackComponent }
];
```

This is it. Whenever a user tries to access the Search or Details view of the application, they will be redirected to the Okta login page. Once logged on, the user will be redirected back to the view that they wanted to see in the first place. As before, you can build and start your application by running the commands:

```bash
ng build --prod --source-map
http-server-spa dist/AngularBooksPWA/ index.html 8080
```

## Create a Progressive Web App with Angular

The application runs and works, but it is not a Progressive Web Application. To see how your application performs, I will be using the Lighthouse extension. If you don't want to install Lighthouse, you can also use the audit tool built into Google Chrome. This is a slightly less up-to-date version of Lighthouse accessible through *Developer Tools > Audits*. Install the [Lighthouse extension](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk) for the Chrome browser. This extension allows you to analyze the performance and compatibility of web pages and applications. 

After installation, open your application, click on the small Lighthouse logo and run the test. At the moment, your Books application likely rates poorly on the PWA scale, achieving only 46%.

{% img blog/first-angular-pwa/lighthouse-46.png alt:"Lighthouse PWA Score: 46%" width:"800" %}{: .center-image }

Over the last year, the folks developing Angular have made it very easy to turn your regular application into a PWA. Shut down the server and run the following command.

```bash
ng add @angular/pwa --project AngularBooksPWA
```

Rebuild your application, start the server, and run Lighthouse again. I tried and I got a score of 92%. The only reason that the application is not achieving 100% is due to the fact that it is not served via `https` protocol. 

What did adding PWA support do? The most important improvement is the addition of a service worker. A service worker can intercept requests to the server and returns cached results wherever possible. This means that the application should work when you're offline. To test this, open the developer console, open the network tab, and tick the offline check box. When you now click the reload button, the page should still work and show some content.

Adding PWA support also created application icons of various sizes (in the `src/assets/icons/` directory). Naturally, you will want to replace them with your own icons. Use any regular image manipulation software to create some cool logos. Finally, a web app manifest was added to the file `src/manifest.json`. The manifest provides the browser with information that it needs to install the application locally on the user's device.

Does that mean that you are done turning your application into a PWA? Not at all! There are numerous other features that are not tested by Lighthouse, but still make for a good Progressive Web Application. Check Google's [Progressive Web App Checklist](https://developers.google.com/web/progressive-web-apps/checklist) for a list of features that make a good PWA.

### Cache Recent Requests and Responses 

Start the Books application in your browser and search for a book. Now click on the eye icon of one of the books to view its details. After the details page has loaded, open the developer console and switch to offline mode (Network tab > check Offline). In this mode click the back button in your browser. You will notice that the content has disappeared. The application is trying to request resources from the OpenLibrary API again. Ideally, you would like to keep some search results in the cache. Also, it would be nice for the user to know that they are using the application in offline mode.

I will start with the cache. The following code is adapted from [Tamas Piros' great article about caching HTTP requests](https://fullstack-developer.academy/caching-http-requests-with-angular/). Start by creating two new services.

```bash
ng generate service cache/request-cache
ng generate service cache/caching-interceptor
```

Now change the content of the `src/app/cache/request-cache.service.ts` file to mirror the code below.

```ts
import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

const maxAge = 30000;
@Injectable({
  providedIn: 'root'
})
export class RequestCache  {

  cache = new Map();

  get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    const url = req.urlWithParams;
    const cached = this.cache.get(url);

    if (!cached) return undefined;

    const isExpired = cached.lastRead < (Date.now() - maxAge);
    const expired = isExpired ? 'expired ' : '';
    return cached.response;
  }

  put(req: HttpRequest<any>, response: HttpResponse<any>): void {
    const url = req.urlWithParams;
    const entry = { url, response, lastRead: Date.now() };
    this.cache.set(url, entry);

    const expired = Date.now() - maxAge;
    this.cache.forEach(expiredEntry => {
      if (expiredEntry.lastRead < expired) {
        this.cache.delete(expiredEntry.url);
      }
    });
  }
}
```

The `RequestCache` service acts as a cache in memory. The `put` and `get` methods will store and retrieve `HttpResponse`s based on the request data. Now replace the contents of `src/app/cache/caching-interceptor.service.ts` with the following.

```ts
import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpResponse, HttpInterceptor, HttpHandler } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RequestCache } from './request-cache.service';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: RequestCache) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const cachedResponse = this.cache.get(req);
    return cachedResponse ? of(cachedResponse) : this.sendRequest(req, next, this.cache);
  }

  sendRequest(req: HttpRequest<any>, next: HttpHandler,
    cache: RequestCache): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          cache.put(req, event);
        }
      })
    );
  }
}
```

The `CachingInterceptor` can intercept any `HttpRequest`. It uses the `RequestCache` service to look for already stored data and returns it if possible. To set up the interceptor, open `src/app/app.module.ts` and add the following imports.

```ts
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestCache } from './cache/request-cache.service';
import { CachingInterceptor } from './cache/caching-interceptor.service';
```

Update the `providers` section to include the services

```ts
providers: [{ provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true }],
```

With these changes, the application will cache the most recent requests and their responses. This means that you can navigate back from the details page and still see the search results in offline mode. 

**NOTE:** In this version, I am keeping the cache in memory and not persisting it in the browsers `localStorage`. This means that you will lose the search results when you force a reload on the application. If you wanted to store the responses persistently, you would have to modify the `RequestCache` accordingly. 

Remember not to use the `ng serve` command to test your PWA. Always build your project first, then start the server with:

```bash
ng build --prod --source-map
http-server-spa dist/AngularBooksPWA/ index.html 8080
```

### Monitor Your Network's Status

Open `src/app/app.component.ts` and add the following property and method.

```ts
offline: boolean;

onNetworkStatusChange() {
  this.offline = !navigator.onLine;
  console.log('offline ' + this.offline);
}
```

Then edit the `ngOnInit` method and add the following lines.

```ts
window.addEventListener('online',  this.onNetworkStatusChange.bind(this));
window.addEventListener('offline', this.onNetworkStatusChange.bind(this));
```

Finally, add a notice to the top-bar in `src/app/app.component.html`, before the `div` containing the search form.

```html
<div *ngIf="offline">offline</div>
```

The application will now show an *offline* message in the top bar when the network is not available.

{% img blog/first-angular-pwa/offline.png alt:"Offline indicator" width:"800" %}{: .center-image }

Pretty cool, don't you think?!

## Learn More About PWAs and Angular

In this tutorial, I've shown you how to create a progressive web app using Angular 7. Due to the effort put in by the Angular developers, it is easier than ever to achieve a perfect score for your PWA. With just a single command all the necessary resources and infrastructure is put into place to make your app offline-ready. In order to create a really outstanding PWA, there are many more improvements you can apply to your application. I have shown you how to implement a cache for HTTP requests as well as an indicator telling the users when they are offline.

The complete code for this project can be found at <https://github.com/oktadeveloper/okta-angular-pwa-example>.

In order to further improve the application, you might consider the following. You could add placeholder images for the book covers when the user is in offline mode. You should also make sure that delayed loading of images does not make the page jump around. Because PWAs are mainly useful for mobile devices, it is important to check that you can always scroll form inputs into view, even if the on-screen keyboard is open.

To learn more about Angular 7, check out other recent tutorials:

* [Build a Basic CRUD App with Angular and Node](/blog/2018/10/30/basic-crud-angular-and-node)
* [Build a Simple Web App with Express, Angular, and GraphQL](/blog/2018/11/30/web-app-with-express-angular-graphql)
* [Angular 7: What's New and Noteworthy + OIDC Goodness](/blog/2018/12/04/angular-7-oidc-oauth2-pkce)
* [Build a Basic CRUD App with Angular 7.0 and Spring Boot 2.1](/blog/2018/08/22/basic-crud-angular-7-and-spring-boot-2)
* [Build a Basic Website with ASP.NET MVC and Angular](/blog/2018/12/21/build-basic-web-app-with-mvc-angular)

You might also find these links helpful:

* [Google's checklist for PWAs](https://developers.google.com/web/progressive-web-apps/checklist)
* [Angular's tutorial on Service Workers](https://angular.io/guide/service-worker-getting-started)
* [Tamas Piros' article on Caching HttpRequests in Angular](https://fullstack-developer.academy/caching-http-requests-with-angular/)
* [Advanced Caching with RxJS by Dominic Elm](https://blog.thoughtram.io/angular/2018/03/05/advanced-caching-with-rxjs.html#motivation)

For more awesome content, follow [@oktadev](https://twitter.com/oktadev) and [subscribe to our YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q).