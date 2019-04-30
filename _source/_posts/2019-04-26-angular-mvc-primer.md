---
layout: blog_post
title: "Angular MVC - A Primer"
author: holgerschmitz
description: "This tutorial shows how the Model-View-Controller pattern is achieved (in an MVVM way) in Angular."
tags: [javascript, angular, MVC, MVVM]
tweets:
- "Learn how to implement MVVM/MVC with @Angular! →"
- "Take a look at common architectural patterns MVC/MVVM in @Angular!"
- "Get the lowdown on the basics of MVC and MVVM and how @Angular implements these patterns! →"
image: blog/featured/okta-angular-headphones.jpg
---

When designing software with a user interface, it is important to structure the code in a way that makes it easy to extend and maintain. Over time, there have been a few approaches in separating out responsibilities of the different components of an application. Although there is plenty of literature on these design patterns around, it can be very confusing for a beginner to understand the features of limitations of the different patterns and the differences between them.

In this tutorial, I want to talk about the major two approaches, the Model-View-Controller (MVC) pattern and the Model-View-ViewModel (MVVM) pattern. In the MVVM pattern, the controller is replaced by a ViewModel. The main differences between these two components are the direction of dependency between the View on one side, and the Controller or ViewModel on the other side.

I will be developing the ideas and explaining the patterns by example using a browser application written in TypeScript and Angular. TypeScript is an extension of JavaScript that adds type information to the code. The application will mimic the popular Notes application on MacOS/iOS. Angular enforces the MVVM pattern. Let's dive in and see the main differences between the MVC and the MVVM patterns.

## Set Up Your Application with Angular CLI

To start off you will need to install Angular CLI. Make sure you have Node and `npm` installed first. If you haven't done so, visit [node.js.org](https://nodejs.org/) and follow the instructions to download and install Node. Then, open a terminal on your computer and run the `npm` command to install Angular CLI.

```bash
npm install -g @angular/cli@7.2.1
```

Depending on your system configuration, you may have to run this command as the system administrator using `sudo`. This will install the `ng` command globally on your system. `ng` is used to create, manipulate, test, and build Angular applications. You can create a new Angular application by running `ng new` in a directory of your choice.

```bash
ng new AngularNotes
```

This will start a wizard that takes you through a couple of questions about the new application and then creates the directory layout and some files with skeleton code. The first question regards the inclusion of the routing module. Routing lets you navigate to different components in the application by changing the browser path. You will need to answer **yes** to this question. The second question lets you choose the CSS technology which you want to use. Because I will only include some very simple style sheets, the plain **CSS** format will be sufficient. When you have answered the questions, the wizard will start downloading and installing all the necessary components.

You can use Material Design and its components to make the application look nice. These can be installed by using the `npm` command inside the application directory. The `ng new` command should have created a directory called `AngularNotes`. Navigate into that and run the following command.

```bash
npm install --save @angular/material@7.2.1 @angular/cdk@7.2.1 @angular/animations@7.2.0 @angular/flex-layout@7.0.0-beta.23
```

The `src` directory contains the application source code. Here, `src/index.html` is the main entry point for the browser. Open this file in a text editor of your choice and paste the following line into the `<head>` section. This will load the font needed for the Material Icons.

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

The `src/style.css` style sheet contains global styles. Open this file and paste the following styles into it.

```css
@import "~@angular/material/prebuilt-themes/deeppurple-amber.css";

body {
  margin: 0;
  font-family: sans-serif;
}

h1, h2 {
  text-align: center;
}
```

Next, open `src/app/app.module.ts`. This file contains the imports for all the modules that you want to be globally available. Replace to contents of this file with the following code.

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout";

import { MatToolbarModule,
         MatMenuModule,
         MatIconModule,
         MatInputModule,
         MatFormFieldModule,
         MatButtonModule,
         MatListModule,
         MatDividerModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    AppRoutingModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

At this point, I could start showing you how to create the application layout in the file `src/app/app.component.html`. But this would already have me dive into the discussion of the application architecture. Instead, in the next section, I want to first guide you through the implementation of the Model. I will be discussing the View and its relation to the ViewModel in the following section.

## The Model

The model contains the business end of your application. For simple CRUD (Create Read Update Delete) applications, the model is usually a simple data model. For more complex applications, the model will naturally reflect that increase in complexity. In the application you see here, the model will hold a simple array of text notes. Each note has an *ID*, a *title*, and a *text*. In Angular, the model is coded up in so-called *services*. The `ng` command lets you create a new service.

```bash
ng generate service Notes
```

This will create two new files, `src/app/notes.service.ts` and `src/app/notes.service.spec.ts`. You can ignore the second of these files in this tutorial, just as the other `.spec.ts` files. These files are used for unit testing the code. In an application that you want to release for production, you would write your tests there. Open `src/app/notes.service.ts` and replace its contents with the following code.

```ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observer } from 'rxjs';

export class NoteInfo {
  id: number;
  title: string;
}

export class Note {
  id: number;
  title: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private notes: Note[];
  private nextId = 0;
  private notesSubject = new BehaviorSubject<NoteInfo[]>([]);

  constructor() {
    this.notes = JSON.parse(localStorage.getItem('notes')) || [];
    for (const note of this.notes) {
      if (note.id >= this.nextId) this.nextId = note.id+1;
    }
    this.update();
  }

  subscribe(observer: Observer<NoteInfo[]>) {
    this.notesSubject.subscribe(observer);
  }

  addNote(title: string, text: string): Note {
    const note = {id: this.nextId++, title, text};
    this.notes.push(note);
    this.update();
    return note;
  }

  getNote(id: number): Note {
    const index = this.findIndex(id);
    return this.notes[index];
  }

  updateNote(id: number, title: string, text: string) {
    const index = this.findIndex(id);
    this.notes[index] = {id, title, text};
    this.update();
  }

  deleteNote(id: number) {
    const index = this.findIndex(id);
    this.notes.splice(index, 1);
    this.update();
  }

  private update() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
    this.notesSubject.next(this.notes.map(
      note => ({id: note.id, title: note.title})
    ));
  }

  private findIndex(id: number): number {
    for (let i=0; i<this.notes.length; i++) {
      if (this.notes[i].id === id) return i;
    }
    throw new Error(`Note with id ${id} was not found!`);
  }
}
```

Near the top of the file you can see two class definitions, `NoteInfo` and `Note`. The `Note` class contains the full information on a note, while `NoteInfo` only contains the `id` and the `title`. The idea is that `NoteInfo` is much lighter and can be used in a list, displaying all note titles. Both `Note` and `NoteInfo` are simple data classes, containing no business logic. The logic is contained in `NotesService`, which acts as the Model of the application. It contains a number of properties. The `notes` property is an array of `Notes` objects. This array acts as the source of truth for the model. The functions `addNote`, `getNote`, `updateNote`, and `deleteNote` define the CRUD operations on the model. They all directly act on the `notes` array, creating, reading, updating, and deleting elements in the array. The `nextId` property is used as a unique ID by which a note can be referenced.

You will notice that, whenever the `notes` array is modified, the private `update` method is called. This method does two things. First, it saves the notes in the local storage. As long as the browser's local storage has not been deleted, this will persist the data locally. This allows users to close the application and open it later on and still have access to their notes. In a real-world application, the CRUD operations would access a REST API on a different server, instead of saving the data locally.

The second action performed by `update` is to emit a new value on the `notesSubject` property. `notesSubject` is a `BehaviorSubject` from RxJS which contains an array of the condensed `NoteInfo` objects. The `BehaviorSubject` act as an observable to which any observer can subscribe. This subscription is made possible through the `subscribe` method of `NotesService`. Any observer that has subscribed will be notified whenever `update` is called.

The main thing to take away from the implementation of the Model is, that the Model is a standalone service that has no knowledge of any View or Controller. This is important in both, the MVC and the MVVM architecture. The Model must not have any dependency on the other components.

## The View

Next, I'd like to turn your attention to the View. In Angular applications, the View lives inside the `.html` templates and the `.css` style sheets. I have already mentioned one of these templates in the file `src/app/app.component.html`. Open the file and paste the following content into it.

{% raw %}
```html
<mat-toolbar color="primary" class="expanded-toolbar">
    <span>
      <button mat-button routerLink="/">{{title}}</button>
      <button mat-button routerLink="/"><mat-icon>home</mat-icon></button>
    </span>
    <button mat-button routerLink="/notes"><mat-icon>note</mat-icon></button>
</mat-toolbar>
<router-outlet></router-outlet>
```
{% endraw %}

Why not add a bit of styling too? Open `src/app/app.component.css` and add the following style.

```css
.expanded-toolbar {
  justify-content: space-between;
  align-items: center;
}
```

The `app.component` contains the main page layout, but not any meaningful content. You will have to add some components that will render any content. Use the `ng generate` command again like this.

```bash
ng generate component Home
ng generate component Notes
```

This generates two components. Each component is made up of a `.html`, `.css`, and a `.ts` file. For now, don't worry about the `.ts` file. I'll get to that in the next section. (Remember, there is also a `.spec.ts` file that I am ignoring completely in this tutorial.)

Open `src/app/home/home.component.html` and change the content to the following.

```html
<h1>Angular Notes</h1>
<h2>A simple app showcasing the MVVM pattern.</h2>
```

Next, open `src/app/notes/notes.component.html` and replace the content with the code below.

{% raw %}
```html
<div fxLayout="row" fxLayout.xs="column" fxLayoutAlign="center" class="notes">
  <mat-list fxFlex="100%" fxFlex.gt-sm="20%">
    <mat-list-item *ngFor='let note of notes'>
      <a>
        {{note.title}}
      </a>
    </mat-list-item>
  </mat-list>
  <mat-divider fxShow="false" fxShow.gt-sm [vertical]="true"></mat-divider>
  <mat-divider fxShow="true" fxShow.gt-sm="false" [vertical]="false"></mat-divider>
  <div fxFlex="100%" fxFlex.gt-sm="70%" *ngIf="!editNote" class="note-container">
    <h3>{{currentNote.title}}</h3>
    <p>
      {{currentNote.text}}
    </p>
    <div fxLayout="row" fxLayoutAlign="space-between center" >
      <button mat-raised-button color="primary">Edit</button>
      <button mat-raised-button color="warn">Delete</button>
      <button mat-raised-button color="primary">New Note</button>
    </div>
  </div>
  <div fxFlex="100%" fxFlex.gt-sm="70%" *ngIf="editNote" class="form-container">
    <form [formGroup]="editNoteForm">
      <mat-form-field class="full-width">
        <input matInput placeholder="Title" formControlName="title">
      </mat-form-field>

      <mat-form-field class="full-width">
        <textarea matInput placeholder="Note text" formControlName="text"></textarea>
      </mat-form-field>
      <button mat-raised-button color="primary">Update</button>
    </form>
  </div>
</div>
```
{% endraw %}

The accompanying `src/app/notes/notes.component.css` should look like this.

```css
.notes {
  padding: 1rem;
}

.notes a {
  cursor: pointer;
}

.form-container, .note-container {
  padding-left: 2rem;
  padding-right: 2rem;
}

.full-width {
  width: 80%;
  display: block;
}
```

So far, so good!

Have a look at `src/app/notes/notes.component.html` which represents the main View of the application. You will notice placeholders such as `{{note.title}}` which look like they can be filled with values. In the version shown above, the View does not seem to refer to any piece of code in the application.

If you were to follow the MVC pattern, the View would define slots into which the data could be inserted. It would also provide methods for registering a callback whenever a button is clicked. In this respect, the View would remain completely ignorant of the Controller. The Controller would actively fill the values and register callback methods with the View. Only the Controller would know about both the View and the Model and link the two together.

As you will see below, Angular takes a different approach, called the MVVM pattern. Here the Controller is replaced by a ViewModel. This will be the topic of the next section.

## The ViewModel

The ViewModel lives in the `.ts` files of the components. Open `src/app/notes/notes.component.ts` and fill it with the code below.

```ts
import { Component, OnInit } from '@angular/core';
import { Note, NoteInfo, NotesService } from '../notes.service';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  notes = new BehaviorSubject<NoteInfo[]>([]);
  currentNote: Note = {id:-1, title: '', text:''};
  createNote = false;
  editNote = false;
  editNoteForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private notesModel: NotesService) { }

  ngOnInit() {
    this.notesModel.subscribe(this.notes);
    this.editNoteForm = this.formBuilder.group({
      title: ['', Validators.required],
      text: ['', Validators.required]
    });
  }

  onSelectNote(id: number) {
    this.currentNote = this.notesModel.getNote(id);
  }

  noteSelected(): boolean {
    return this.currentNote.id >= 0;
  }

  onNewNote() {
    this.editNoteForm.reset();
    this.createNote = true;
    this.editNote = true;
  }

  onEditNote() {
    if (this.currentNote.id < 0) return;
    this.editNoteForm.get('title').setValue(this.currentNote.title);
    this.editNoteForm.get('text').setValue(this.currentNote.text);
    this.createNote = false;
    this.editNote = true;
  }

  onDeleteNote() {
    if (this.currentNote.id < 0) return;
    this.notesModel.deleteNote(this.currentNote.id);
    this.currentNote = {id:-1, title: '', text:''};
    this.editNote = false;
  }

  updateNote() {
    if (!this.editNoteForm.valid) return;
    const title = this.editNoteForm.get('title').value;
    const text = this.editNoteForm.get('text').value;
    if (this.createNote) {
      this.currentNote = this.notesModel.addNote(title, text);
    } else {
      const id = this.currentNote.id;
      this.notesModel.updateNote(id, title, text);
      this.currentNote = {id, title, text};
    }
    this.editNote = false;
  }
}
```

In the `@Component` decorator of the class, you can see the reference to the View `.html` and `.css` files. In the rest of the class, on the other hand, there is no reference to the View whatsoever. Instead, the ViewModel, contained in the `NotesComponent` class, exposes properties and methods that can be accessed by the View. This means that, compared to the MVC architecture, the dependency is reversed. The ViewModel has no knowledge of the View but provides a Model-like API that can be used by the View. If you take another look at `src/app/notes/notes.component.html` you can see that the template interpolation, such as `{{currentNote.text}}` directly accesses the properties of the `NotesComponent`.

The last step to make your application work is to tell the router which components are responsible for the different routes. Open `src/app/app-routing.module.ts` and edit the content to match the code below.

```ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotesComponent } from './notes/notes.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'notes', component: NotesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

This will link the `HomeComponent` to the default route and the `NotesComponent` to the `notes` route.

For the main application component, I will define a few methods which will be implemented later on. Open `src/app/app.component.ts` and update the content to look like the following.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'Angular Notes';
  public isAuthenticated: boolean;

  ngOnInit() {
    this.isAuthenticated = false;
  }

  login() {
  }

  logout() {
  }
}
```

The component contains two properties `title` and `isAuthenticated`. The second one of these is a flag that indicates whether the user has logged into the application. Right now, it is simply set to `false`. Two empty methods act as callbacks to trigger logging in or logging out. For now, I have left them empty, but you will be filling them in later on.

### Complete the View

With this knowledge about the direction of dependency, you can update the View so that the buttons and forms perform actions on the ViewModel. Open `src/app/notes/notes.component.html` again and change the code to look like this.

{% raw %}
```html
<div fxLayout="row" fxLayout.xs="column" fxLayoutAlign="center" class="notes">
  <mat-list fxFlex="100%" fxFlex.gt-sm="20%">
    <mat-list-item *ngFor='let note of notes | async'>
      <a (click)="onSelectNote(note.id)">
        {{note.title}}
      </a>
    </mat-list-item>
  </mat-list>
  <mat-divider fxShow="false" fxShow.gt-sm [vertical]="true"></mat-divider>
  <mat-divider fxShow="true" fxShow.gt-sm="false" [vertical]="false"></mat-divider>
  <div fxFlex="100%" fxFlex.gt-sm="70%" *ngIf="!editNote" class="note-container">
    <h3>{{currentNote.title}}</h3>
    <p>
      {{currentNote.text}}
    </p>
    <div fxLayout="row" fxLayoutAlign="space-between center" >
      <button mat-raised-button color="primary" (click)="onEditNote()" *ngIf="noteSelected()">Edit</button>
      <button mat-raised-button color="warn" (click)="onDeleteNote()" *ngIf="noteSelected()">Delete</button>
      <button mat-raised-button color="primary" (click)="onNewNote()">New Note</button>
    </div>
  </div>
  <div fxFlex="100%" fxFlex.gt-sm="70%" *ngIf="editNote" class="form-container">
    <form [formGroup]="editNoteForm" (ngSubmit)="updateNote()">
      <mat-form-field class="full-width">
        <input matInput placeholder="Title" formControlName="title">
      </mat-form-field>

      <mat-form-field class="full-width">
        <textarea matInput placeholder="Note text" formControlName="text"></textarea>
      </mat-form-field>
      <button mat-raised-button color="primary">Update</button>
    </form>
  </div>
</div>
```
{% endraw %}

You can see `(click)` handlers in various places directly referring to the methods of the `NotesComponent` class. This means that the View needs to know about the ViewModel and its methods. The reason for reversing the dependency is the reduction of boilerplate code. There is a two-way data binding between the View and the ViewModel. The data in the View is always in sync with the data in the ViewModel.

## Add Authentication to Your Angular App

A good application is not complete without proper user authentication. In this section, you will learn how to quickly add authentication to your existing Angular application. Okta provides single sign-on authentication which can be plugged into the app with just a few lines of code.

To start off, you will need a free developer account with Okta. In your favorite browser, open https://developer.okta.com, locate **Create Free Account** in the center of the page and click it. Simply fill in the form that appears with your details, accept the terms & conditions, and submit it by pressing **Get Started**. Once you have completed the registration you will be taken to the Okta dashboard. Here you can see an overview of all the applications registered with the Okta service.

{% img blog/angular-mvvm-pattern/applications-developer.okta.com.png alt:"Okta Applications" width:"800" %}{: .center-image }

Click on **Add Application** to register a new application. On the next screen that appears you will be given a choice of the type of application. The **Single-Page Application** is the right choice for your Angular app. On the page that follows, you will be shown the application settings. You will need to change the port number to 4200 when you are testing your application with `ng serve`.

{% img blog/angular-mvvm-pattern/new-app-developer.okta.com.png alt:"New Okta Application" width:"800" %}{: .center-image }

That's it. Now you should be seeing a Client ID which you will need later on. Now you are ready to include the authentication service into your code. Okta provides a convenient library for Angular. You can install it by running the following command in your application root directory.

```bash
npm install @okta/okta-angular@1.0.7 --save
```

Open `app.module.ts` and import the `OktaAuthModule`.

```ts
import { OktaAuthModule } from '@okta/okta-angular';
```

Further down, in the same file add the following in the list of `imports`.

```ts
    OktaAuthModule.initAuth({
      issuer: 'https://{yourOktaDomain}/oauth2/default',
      redirectUri: 'http://localhost:4200/implicit/callback',
      clientId: '{clientId}'
    })
```

In this snippet, `{clientId}` needs to be replaced with the client ID that you just obtained in the Okta developer dashboard. 

To protect specific routes from being accessed without a password you need to modify `src/app/app-routing.module.ts`. Add an import for `OktaCallbackComponent` and `OktaAuthGuard`.

```ts
import { OktaCallbackComponent, OktaAuthGuard } from '@okta/okta-angular';
```

Next, add another route to the array of routes.

```ts
{ path: 'implicit/callback', component: OktaCallbackComponent }
```

The `implicit/callback` route will be called by Okta when the user has completed the login process. The `OktaCallbackComponent` handles the result and redirects the user to the page that requested the authentication process. To guard individual routes, you can now simply add `OktaAuthGuard` to that route, like this.

```ts
{ path: 'notes', component: NotesComponent, canActivate: [OktaAuthGuard] }
```

Remember that you have left the main application ViewModel un-implemented. Open `src/app/app.component.ts` again and add the following import to the top of the file.

```ts
import { OktaAuthService } from '@okta/okta-angular';
```

Next, implement all the methods of the `AppComponent` class.

```ts
constructor(public oktaAuth: OktaAuthService) {}

async ngOnInit() {
  this.isAuthenticated = await this.oktaAuth.isAuthenticated();
}

login() {
  this.oktaAuth.loginRedirect();
}

logout() {
  this.oktaAuth.logout('/');
}
```

There is only one thing left to do. You can now add the Login and Logout buttons to the top bar. Open `src/app/app.component.html` and add these two lines inside the `<mat-toolbar>` element, after the closing `</span>`.

```html
<button mat-button *ngIf="!isAuthenticated" (click)="login()"> Login </button>
<button mat-button *ngIf="isAuthenticated" (click)="logout()"> Logout </button>
```

The Login and Logout buttons are linked to the `login()` and `logout()` methods in the `app.component.ts` ViewModel. The visibility of these two buttons is determined by the `isAuthenticated` flag in the ViewModel.

That's all there is to it! Now you have a complete application based on the MVVM architecture, complete with authentication. You can test it out by firing up the Angular test server in the application root directory.

```bash
ng serve
```

Open your browser and navigate to `http://localhost:4200`. You should see something like this.

{% img blog/angular-mvvm-pattern/angular-notes-application.png alt:"Notes Application" width:"800" %}{: .center-image }

## Learn More About Angular and Secure Application Development

In this tutorial, I have shown you how Angular is based on the MVVM design pattern and how this pattern is different from the better known MVC pattern. In the MVC pattern, the Controller simply links up the View with the Model by using Observers and Observables provided by the other two components. Once the Controller has set up the connection, the View and the Model communicate directly, but without knowing who they are communicating with. Specifically, the Controller holds no application state of its own. It is simply a facilitator to make the connection between the View and the Model. In the MVVM pattern, the Controller is replaced by the ViewModel. The View and the ViewModel are linked via a two-way data-binding. They share the same state.

To learn more about the MVC and MVVM design patterns, you might be interested in the following links.

* [Building an MVC app with ASP.NET](/blog/2018/12/21/build-basic-web-app-with-mvc-angular)
* [Adding an Express back-end to your Angular app](/blog/2018/10/30/basic-crud-angular-and-node)
* [Check out how to add authentication to any web page](/blog/2018/06/08/add-authentication-to-any-web-page-in-10-minutes)
* [Learn more about what's new in Angular 7](/blog/2018/12/04/angular-7-oidc-oauth2-pkce)

The code for this tutorial is available at [oktadeveloper/okta-angular-notes-app-example](https://github.com/oktadeveloper/okta-angular-notes-app-example).

If you liked this post, chances are you'll like others we publish. Follow [@oktadev](https://twitter.com/oktadev) on Twitter and subscribe to [our YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q) for more excellent tutorials.