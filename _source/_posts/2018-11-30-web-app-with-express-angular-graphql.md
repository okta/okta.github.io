---
layout: blog_post
title: 'Build a Simple Web App with Express, Angular, and GraphQL'
author: holgerschmitz
description: 'A tutorial to build a simple web application using Express, Angular, and GraphQL.'
tags: [express, expressjs, node, angular, graphql, web application, web]
tweets:
  - "Get started with @expressjs, @angular, and @graphql in this handy tutorial!"
  - "Like @nodejs and @typescriptlang? Then you're goind to love this tutorial! Express + Angular + GraphQL = 💜"
  - "@expressjs + @angular + @graphql = 😍! Get started using this in-depth tutorial that includes authentication."
image: blog/featured/okta-angular-skew.jpg
---

During the past 10 years or so, the concept of REST APIs for web services has become the bread and butter for most web developers. Recently a new concept has emerged, GraphQL. GraphQL is a query language that was invented by Facebook and released to the public in 2015. During the last three years, it has created quite a stir. Some regard it as a new revolutionary way of creating web APIs. The main difference between traditional REST and GraphQL is the way queries are sent to the server. In REST APIs you will have a different endpoint for each type of resource and the response to the request is determined by the server. Using GraphQL you will typically have only a single endpoint, and the client can explicitly state which data should be returned. A single request in GraphQL can contain multiple queries to the underlying model.

In this tutorial, I will be showing you how to develop a simple GraphQL web application. The server will run using Node and Express and the client will be based on Angular 7. You will see how easy it is to prepare the server for responding to different queries. This removes much of the work needed compared to implementing REST-style APIs. To provide an example I will create a service in which users can browse through the ATP Tennis players and rankings.

## Build Your Express Server using GraphQL

I will start by implementing the server. I will assume that you have **Node** installed on your system and that the `npm` command is available. I will also be using SQLite to store the data. In order to create the database tables and import the data, I will be making use of the `sqlite3` command line tool. If you haven't got `sqlite3` installed, head over to the [SQLite download page](https://www.sqlite.org/download.html) and install the package that contains the _command-line shell_.

To start off, create a directory that will contain the server code. I have simply called mine `server/`. Inside the directory run

```bash
npm init -y
```

Next, you will have to initialize the project with all the packages that we will be needing for the basic server.

```bash
npm install --save express@4.16.4 cors@2.8.4 express-graphql@0.6.12 graphql@14.0.2 sqlite3@4.0.2
```

### Import Data to Your Express Server

Next, let's create the database tables and import some data into them. I will be making use of the freely available ATP Tennis Rankings by Jeff Sackmann. In some directory on your system clone the GitHub repository.

```bash
git clone https://github.com/JeffSackmann/tennis_atp.git
```

In this tutorial, I will only be using two of the files from this repository, `atp_players.csv` and `atp_rankings_current.csv`. In your `server/` directory start SQLite.

```bash
sqlite3 tennis.db
```

This will create a file `tennis.db` that will contain the data and will give you a command line prompt in which you can type SQL commands. Let's create our database tables. Paste and run the following in the SQLite3 shell.

```sql
CREATE TABLE players(
  "id" INTEGER,
  "first_name" TEXT,
  "last_name" TEXT,
  "hand" TEXT,
  "birthday" INTEGER,
  "country" TEXT
);

CREATE TABLE rankings(
  "date" INTEGER,
  "rank" INTEGER,
  "player" INTEGER,
  "points" INTEGER
);
```

SQLite allows you to quickly import CSV data into your tables. Simply run the following command in the SQLite3 shell.

```sql
.mode csv
.import {PATH_TO_TENNIS_DATA}/atp_players.csv players
.import {PATH_TO_TENNIS_DATA}/atp_rankings_current.csv rankings
```

In the above, replace `{PATH_TO_TENNIS_DATA}` with the path in which you have downloaded the tennis data repository. You have now created a database that contains all ATP ranked tennis players ever, and the rankings of all active players during the current year. You are ready to leave SQLite3.

```sql
.quit
```

### Implement the Express Server

Let's now implement the server. Open up a new file `index.js`, the main entry point of your server application. Start with the Express and CORS basics.

```js
const express = require('express');
const cors = require('cors');

const app = express().use(cors());
```

Now import SQLite and open up the tennis database in `tennis.db`.

```js
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('tennis.db');
```

This creates a variable `db` on which you can issue SQL queries and obtain results.

Now you are ready to dive into the magic of GraphQL. Add the following code to your `index.js` file.

```js
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    players(offset:Int = 0, limit:Int = 10): [Player]
    player(id:ID!): Player
    rankings(rank:Int!): [Ranking]
  }

  type Player {
    id: ID
    first_name: String
    last_name: String
    hand: String
    birthday: Int
    country: String
  }

  type Ranking {
    date: Int
    rank: Int
    player: Player
    points: Int
  }
`);
```

The first two lines import `graphqlHTTP` and `buildSchema`. The function `graphqlHTTP` plugs into Express and is able to understand and respond to GraphQL requests. The `buildSchema` is used to create a GraphQL schema from a string. Let's look at the schema definition in a little more detail.

The two types `Player` and `Ranking` reflect the contents of the database tables. These will be used as the return types to the GraphQL queries. If you look closely, you can see that the definition of `Ranking` contains a `player` field that has the `Player` type. At this point, the database only has an `INTEGER` that refers to a row in the `players` table. The GraphQL data structure should replace this integer with the player it refers to.

The `type Query` defines the queries a client is allowed to make. In this example, there are three queries. `players` returns an array of `Player` structures. The list can be restricted by an `offset` and a `limit`. This will allow paging through the table of players. The `player` query returns a single player by its `ID`. The `rankings` query will return an array of `Ranking` objects for a given player rank.

To make your life a little easier, create a utility function that issues an SQL query and returns a `Promise` that resolves when the query returns. This is helpful because the `sqlite3` interface is based on callbacks but GraphQL works better with Promises. In `index.js` add the following function.

```js
function query(sql, single) {
  return new Promise((resolve, reject) => {
    var callback = (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    };

    if (single) db.get(sql, callback);
    else db.all(sql, callback);
  });
}
```

Now it's time to implement the database queries that power the GraphQL queries. GraphQL uses something called `rootValue` to define the functions corresponding to the GraphQL queries.

```js
const root = {
  players: args => {
    return query(
      `SELECT * FROM players LIMIT ${args.offset}, ${args.limit}`,
      false
    );
  },
  player: args => {
    return query(`SELECT * FROM players WHERE id='${args.id}'`, true);
  },
  rankings: args => {
    return query(
      `SELECT r.date, r.rank, r.points,
              p.id, p.first_name, p.last_name, p.hand, p.birthday, p.country
      FROM players AS p
      LEFT JOIN rankings AS r
      ON p.id=r.player
      WHERE r.rank=${args.rank}`,
      false
    ).then(rows =>
      rows.map(result => {
        return {
          date: result.date,
          points: result.points,
          rank: result.rank,
          player: {
            id: result.id,
            first_name: result.first_name,
            last_name: result.last_name,
            hand: result.hand,
            birthday: result.birthday,
            country: result.country
          }
        };
      })
    );
  }
};
```

The first two queries are pretty straightforward. They consist of simple `SELECT` statements. The result is passed straight back. The `rankings` query is a little more complicated because a `LEFT JOIN` statement is needed to combine the two database tables. Afterward, the result is cast into the correct data structure for the GraphQL query. Note in all these queries how `args` contains the arguments passed in from the client. You do not need to worry in any way about checking missing values, assigning defaults, or checking the correct type. This is all done for you by the GraphQL server.

All that is left to do is create a route and link the `graphqlHTTP` function into it.

```js
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen(4201, err => {
  if (err) {
    return console.log(err);
  }
  return console.log('My Express App listening on port 4201');
});
```

The `graphiql` provides you with a nice user interface on which you can test queries to the server.

To start the server run:

```bash
node index.js
```

Then open your browser and navigate to `http://localhost:4201/graphql`. You will see an interactive test-bed for GraphQL queries.

{% img blog/express-angular-graphql/graphql-rankings-query.png alt:"GraphQL rankings query" width:"800" %}{: .center-image }

## Add Your Angular 7 Client

What is a web application without a client? In this section, I will walk you through the implementation of a single page application using Angular 7. To start off, create a new Angular application. If you haven't already done so, install the newest version of the angular command line tool on your system.

```bash
npm install -g @angular/cli@7.1.0
```

You might have to run this command using `sudo`, depending on your operating system. Now you can create a new angular application. In a new directory run:

```bash
ng new AngularGraphQLClient
```

This will create a new directory and install all the necessary packages for an Angular application into it. You will be prompted with two questions. Answer _yes_ to include routing in the application. The style sheets I will be using in this tutorial will be simple CSS.

The application will contain three component associated with the main `app` module. You can generate them by navigating into the directory that was just created and running the following three commands.

```bash
ng generate component Home
ng generate component Players
ng generate component Ranking
```

This will create three directories in `src/app` and add the component `.ts` code file, the `.html` template and the `.css` stylesheet for each component. In order to use GraphQL in Angular, I will be making use of the _Apollo_ library. Setting up Apollo in angular is a simple command.

```bash
ng add apollo-angular
```

This command will install a number of Node modules. It will also create an Angular module in a file `graphql.module.ts` in the `/src/app/` folder and import it into the main `app` module. Inside this file, you will see the line

```ts
const uri = ''; // <-- add the URL of the GraphQL server here
```

Change it to

```ts
const uri = 'http://localhost:4201/graphql';
```

This specifies the URI at which the GraphQL service can be found.

**Note:** If you want to generate any components after installing Apollo Angular, you will need to specify the module to which the component belongs. So generating the _Home_ component above would change to

```bash
ng generate component Home --module app
```

I will be using the Forms Module in order to bind values to input elements in the HTML. Open up `src/app/app.module.ts` and add

```ts
import { FormsModule } from '@angular/forms';
```

to the top of the file. Then add `FormsModule` to the `imports` array in the `@NgModule` declaration.

### Create Your Layout and Routing in Angular

Now open `src/index.html`. This file contains the HTML container in which your Angular app will live. You will need some external CSS and JavaScript resources to spruce up the design of your application. Add the following lines inside the `<head>` tag. This will include some minimal Material Design styling.

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
<link
  rel="stylesheet"
  href="https://code.getmdl.io/1.3.0/material.indigo-pink.min.css"
/>
<script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
```

Next, open `src/app.component.html` and replace the content with the following.

```html
<div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
  <div class="mdl-layout__header mdl-layout__header--waterfall">
    <div class="mdl-layout__header-row">
      <span class="mdl-layout-title" routerLink="/">
        <i class="material-icons">home</i> Angular with GraphQL
      </span>
      <!-- Add spacer, to align navigation to the right in desktop -->
      <div class="mdl-layout-spacer"></div>
      <!-- Navigation -->
      <ul class="mdl-navigation">
        <li class="mdl-navigation__link" routerLink="/">Home</li>
        <li class="mdl-navigation__link" routerLink="/players">Players</li>
        <li class="mdl-navigation__link" routerLink="/ranking">Rankings</li>
        <li
          class="mdl-navigation__link"
          *ngIf="!isAuthenticated"
          (click)="login()"
        >
          Login
        </li>
        <li
          class="mdl-navigation__link"
          *ngIf="isAuthenticated"
          (click)="logout()"
        >
          Logout
        </li>
      </ul>
    </div>
  </div>

  <div class="mdl-layout__drawer">
    <ul class="mdl-navigation">
      <li class="mdl-navigation__link" routerLink="/">Home</li>
      <li class="mdl-navigation__link" routerLink="/players">Players</li>
      <li class="mdl-navigation__link" routerLink="/ranking">Rankings</li>
      <li
        class="mdl-navigation__link"
        *ngIf="!isAuthenticated"
        (click)="login()"
      >
        Login
      </li>
      <li
        class="mdl-navigation__link"
        *ngIf="isAuthenticated"
        (click)="logout()"
      >
        Logout
      </li>
    </ul>
  </div>

  <div class="mdl-layout__content content"><router-outlet></router-outlet></div>
</div>
```

This creates a basic layout with a top-bar and a few links which will load different components into the `router-outlet`. In order to load make the routes available to the application you should modify the `app-routing.module.ts`. At the top you will see the declaration of the `routes` array.

```ts
const routes: Routes = [];
```

Replace this line with the following.

```ts
import { PlayersComponent } from './players/players.component';
import { HomeComponent } from './home/home.component';
import { RankingComponent } from './ranking/ranking.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'players',
    component: PlayersComponent
  },
  {
    path: 'ranking',
    component: RankingComponent
  }
];
```

Now the router knows which components to place into the outlet when a specific route is selected. At this point, your application already shows the three pages and the links in the top-bar will load them into the content area of your application.

Finally, let's give the page some styling. In `app.component.css` paste the following content.

```css
.content {
  padding: 1rem;
  display: flex;
  justify-content: center;
}
```

### Add Components in Angular

You are ready to implement the components. Let's start with the component that lets the user page through all the tennis players in the database. Copy the following into the file `src/app/players/players.component.ts`. I will walk you through the meaning of each part of this file next.

```ts
import { Component, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';

const PLAYERS_QUERY = gql`
  query players($offset: Int) {
    players(offset: $offset, limit: 10) {
      id
      first_name
      last_name
      hand
      birthday
      country
    }
  }
`;

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {
  page = 1;
  players: any[] = [];

  private query: QueryRef<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.query = this.apollo.watchQuery({
      query: PLAYERS_QUERY,
      variables: { offset: 10 * this.page }
    });

    this.query.valueChanges.subscribe(result => {
      this.players = result.data && result.data.players;
    });
  }

  update() {
    this.query.refetch({ offset: 10 * this.page });
  }

  nextPage() {
    this.page++;
    this.update();
  }

  prevPage() {
    if (this.page > 0) this.page--;
    this.update();
  }
}
```

The top three lines of this file contain the imports needed to drive the component.

```ts
import { Component, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
```

Apart from the core Angular imports, this makes available `Apollo` and `QueryRef` from `apollo-angular`, and `gql` from `graphql-tag`. The latter of these to is used straight away to create a GraphQL query.

```ts
const PLAYERS_QUERY = gql`
  query players($offset: Int) {
    players(offset: $offset, limit: 10) {
      id
      first_name
      last_name
      hand
      birthday
      country
    }
  }
`;
```

The `gql` tag takes the template string and turns it into a query object. The query defined here will ask the server to return an array of players, populated with all the player's fields. The `limit` parameter will cause the server to return at most 10 records. The offset parameter can be specified as a parameter to the query. This will allow paging through the players.

```ts
@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {
  page = 0;
  players: any[] = [];

  private query: QueryRef<any>;

  constructor(private apollo: Apollo) {}
}
```

The properties of `PlayersComponent` specify the state of the component. The property `page` stores the current page in the list of players. `players` will contain the array of players that will be displayed in a table. There is also a `query` variable which stores the query. This is needed to be able to re-fetch data, whenever the user navigates to another page. The constructor will inject the `apollo` property so that you can access the GraphQL interface.

```ts
ngOnInit() {
  this.query = this.apollo
    .watchQuery({
      query: PLAYERS_QUERY,
      variables: {offset : 10*this.page}
    });

    this.query.valueChanges.subscribe(result => {
      this.players = result.data && result.data.players;
    });
  }
```

During the initialization phase of the component's life-cycle the `ngOnInit` method will be called. This is the place where the Players Component will initiate the loading of the data. This is achieved by `this.apollo.watchQuery`. By passing the `PLAYERS_QUERY` together with a value for the `offset` parameter. You can now subscribe to any data changes using `valueChanges.subscribe`. This method takes a callback which will set the `players` array with the data obtained from the server.

```ts
update() {
  this.query.refetch({offset : 10*this.page});
}

nextPage() {
  this.page++;
  this.update();
}

prevPage() {
  if (this.page>0) this.page--;
  this.update();
}
```

To round things off, `nextPage` and `prevPage` will increment or decrement the `page` property. By calling `refetch` on `query` with the new parameters a server request is issued. When the data is received the subscription callback will be called automatically.

The HTML template that goes with this component is stored in `players.component.html`. Paste the following content into it.

{% raw %}
```html
<table
  class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp"
>
  <tr>
    <th class="mdl-data-table__cell--non-numeric">First Name</th>
    <th class="mdl-data-table__cell--non-numeric">Last Name</th>
    <th class="mdl-data-table__cell--non-numeric">Hand</th>
    <th>Birthday</th>
    <th class="mdl-data-table__cell--non-numeric">Country</th>
  </tr>
  <tr *ngFor="let player of players">
    <td class="mdl-data-table__cell--non-numeric">{{player.first_name}}</td>
    <td class="mdl-data-table__cell--non-numeric">{{player.last_name}}</td>
    <td class="mdl-data-table__cell--non-numeric">{{player.hand}}</td>
    <td>{{player.birthday}}</td>
    <td class="mdl-data-table__cell--non-numeric">{{player.country}}</td>
  </tr>
</table>

<div class="paging">
  <button
    class="mdl-button mdl-js-button mdl-button--colored"
    (click)="prevPage()"
  >
    <i class="material-icons">arrow_back</i>
  </button>
  Page {{page+1}}
  <button
    class="mdl-button mdl-js-button mdl-button--colored"
    (click)="nextPage()"
  >
    <i class="material-icons">arrow_forward</i>
  </button>
</div>
```
{% endraw %}

This displays a list of players in a table. Below the table, I have added paging links.

The Ranking component pretty much follows the same pattern. The `src/app/ranking.component.ts` looks like this.

```ts
import { Component, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';

const RANKINGS_QUERY = gql`
  query rankings($rank: Int!) {
    rankings(rank: $rank) {
      date
      rank
      points
      player {
        first_name
        last_name
      }
    }
  }
`;

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  rank: number = 1;
  rankings: any[];
  private query: QueryRef<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.query = this.apollo.watchQuery({
      query: RANKINGS_QUERY,
      variables: { rank: Math.round(this.rank) }
    });

    this.query.valueChanges.subscribe(result => {
      this.rankings = result.data && result.data.rankings;
    });
  }

  update() {
    return this.query.refetch({ rank: Math.round(this.rank) });
  }
}
```

As you can see, most of the code is very similar to that in `players.component.ts`. The definition of `RANKINGS_QUERY` queries the players over time which held a particular rank. Note that the query is only requesting the `first_name` and `last_name` of the player. This means that the server will not be sending any additional player data back which the client hasn't asked for.

The template for the rankings component contains a text field and button in which the user can enter a rank and reload the page. Below that is the table of players. This is the content of `ranking.component.html`.

{% raw %}
```html
<h1>Rankings</h1>
<input class="mdl-textfield__input" type="text" id="rank" [(ngModel)]="rank" />

<button
  class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
  (click)="update()"
>
  Update
</button>
<table
  class="mdl-data-table mdl-js-data-table mdl-shadow--2dp"
  *ngIf="rankings"
>
  <tr>
    <th>Rank</th>
    <th>Date</th>
    <th>Points</th>
    <th class="mdl-data-table__cell--non-numeric">First Name</th>
    <th class="mdl-data-table__cell--non-numeric">Last Name</th>
  </tr>
  <tr *ngFor="let ranking of rankings">
    <td>{{ranking.rank}}</td>
    <td>{{ranking.date}}</td>
    <td>{{ranking.points}}</td>
    <td class="mdl-data-table__cell--non-numeric">
      {{ranking.player.first_name}}
    </td>
    <td class="mdl-data-table__cell--non-numeric">
      {{ranking.player.last_name}}
    </td>
  </tr>
</table>
```
{% endraw %}

To start the client, run:

```bash
ng serve
```

Make sure that the server is also running, so that the client can successfully request data.

{% img blog/express-angular-graphql/rankings-webpage.png alt:"Angular rankings page" width:"800" %}{: .center-image }

## Add Access Control to your Express + Angular GraphQL App

One of the most important features of every web application is user authentication and access control. In this section, I will guide you through the steps needed to add authentication to both the server and the client part of your Angular application. This is often the most daunting part of writing an application. Using Okta greatly simplifies this task and makes secure authentication available to every developer. If you haven't already done so, create a developer account with Okta. Visit https://developer.okta.com/ and select **Create Free Account**.

{% img blog/express-angular-graphql/okta-signup.png alt:"Okta signup page" width:"800" %}{: .center-image }

Fill out the form and register yourself. After your registration is complete you can see your developer dashboard.

{% img blog/express-angular-graphql/okta-dashboard.png alt:"Okta dashboard" width:"800" %}{: .center-image }

From the top menu of your dashboard, select **Applications** and then add an application by clicking the green **Add Application** button.

{% img blog/express-angular-graphql/okta-spa-wizard.png alt:"Okta SPA wizard" width:"800" %}{: .center-image }

You will see a choice of different types of application. You are registering a **Single Page App**. On the next page, you will see the settings for your application. Here the port number is pre-filled to 8080. Angular uses the port 4200 by default. So you will have to change the port number to 4200.

{% img blog/express-angular-graphql/okta-app-settings.png alt:"GraphQL rankings query" width:"800" %}{: .center-image }

Once completed, you will be given a **ClientId**. You will need this in both your client and server applications. You will also need your Okta developer domain. This is the URL that you see at the top of the page when you are logged in to your Okta developer dashboard.

### Secure Your Angular Client

In order to use Okta authentication with the Angular client, you will have to install the `okta-angular` library. In the base directory of your client application run the following command.

```bash
npm install @okta/okta-angular@1.0.7 apollo-link-context@1.0.10 --save
```

Now open `src/app/app.module.ts`. At the top of the file add the import statement.

```ts
import { OktaAuthModule } from '@okta/okta-angular';
```

Now add the module to the list of `imports` of the `app` module.

```ts
OktaAuthModule.initAuth({
  issuer: 'https://{yourOktaDomain}/oauth2/default',
  redirectUri: 'http://localhost:4200/implicit/callback',
  clientId: '{yourClientId}'
});
```

You will need to replace `yourOktaDomain` development domain you see in your browser when you navigate to your Okta dashboard. Also, replace `yourClientId` with the client ID that you obtained when registering your application. Now you are ready to use Okta authentication throughout your application. Next, you will implement logging in and logging out from the application. Open `app.component.ts` and import `OktaAuthService` from `okta-angular`. Paste the following code into the file.

```ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'My Angular App';
  public isAuthenticated: boolean;

  constructor(public oktaAuth: OktaAuthService) {
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean) => (this.isAuthenticated = isAuthenticated)
    );
  }

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
  }

  login() {
    this.oktaAuth.loginRedirect();
  }

  logout() {
    this.oktaAuth.logout('/');
  }
}
```

The `OktaAuthService` service is injected through the constructor. It is then used to set the `isAuthenticated` flag. The `subscribe` method subscribes a callback function that is triggered whenever the log-in status changes. The `isAuthenticated` is initialized during the `ngOnInit` phase to reflect the log-in status when the application is first loaded. `login` and `logout` handle the process of logging in and out. In order to make authentication work, `okta-angular` uses a special route called `implicit/callback`. In the file `app-routing.module.ts` add the following import.

```ts
import { OktaCallbackComponent, OktaAuthGuard } from '@okta/okta-angular';
```

The `implicit/callback` route is now linked to the `OktaCallbackComponent` by adding the following to the `routes` array.

```ts
{
  path: 'implicit/callback',
  component: OktaCallbackComponent
}
```

This is all that is needed to log in and out. But the application is not protected yet. For any route that you want to access-control, you will have to add an Authorization Guard. Luckily this is easy. In each of the routes that you want to protect add the `canActivate` property. Add the following to the `players` and the `ranking` routes.

```ts
canActivate: [OktaAuthGuard];
```

That's all there is to it. Now, when a user tries to access the Players view, he will be redirected to the Okta login page. Once logged on, the user will be redirected back to the Products view.

You have secured the client pages, but before you can move on to securing the back end let's take a moment and think about how the server will authenticate the user. Okta uses a bearer token that identifies the user. The bearer token must be sent to the server with every request. To achieve this, the client has to make sure that the bearer token is added to the HTTP headers. All you need to do is add a few lines of code to the `graphql.module.ts`. At the top of the file import the following.

```ts
import { OktaAuthService } from '@okta/okta-angular';
import { setContext } from 'apollo-link-context';
```

Then modify the `createApollo` function to add the bearer token.

```ts
export function createApollo(httpLink: HttpLink, oktaAuth: OktaAuthService) {
  const http = httpLink.create({ uri });

  const auth = setContext((_, { headers }) => {
    return oktaAuth.getAccessToken().then(token => {
      return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    });
  });

  return {
    link: auth.concat(http),
    cache: new InMemoryCache()
  };
}
```

### Secure Your Express GraphQL Server

Securing the server is done by adding an express middleware function to the server application. To do this you will need a few additional libraries. Change into your server directory and run the command

```bash
npm install @okta/jwt-verifier@0.0.13 body-parser@1.18.3 express-bearer-token@2.2.0
```

Next, let's create that function in a separate file called `auth.js` in the root folder of the server.

```js
const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: '{yourClientId}',
  issuer: 'https://{yourOktaDomain}/oauth2/default'
});

module.exports = async function oktaAuth(req, res, next) {
  try {
    const token = req.token;
    if (!token) {
      return res.status(401).send('Not Authorized');
    }
    const jwt = await oktaJwtVerifier.verifyAccessToken(token);
    req.user = {
      uid: jwt.claims.uid,
      email: jwt.claims.sub
    };
    next();
  } catch (err) {
    return res.status(401).send(err.message);
  }
};
```

Again, you have to replace `yourOktaDomain` and `yourClientId` with the development domain and the client id. The purpose of this function is simple. It checks the presence of a token field in the request. If present, `oktaJwtVerifier` checks the validity of the token. If everything is in order, calling `next()` signals success. Otherwise, a `401` error is returned. All you have to do now is to make sure that the function is used in the application. Add the following require statements to the `index.js` file.

```js
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');
const oktaAuth = require('./auth');
```

Then modify the declaration of `app` in the following way.

```js
const app = express()
  .use(cors())
  .use(bodyParser.json())
  .use(bearerToken())
  .use(oktaAuth);
```

The `bearerToken` middleware will look for a bearer token and add it to the request for `oktaAuth` to find it. With this simple addition, your server will only allow requests that provide a valid authentication.

## Learn More about Express, Angular, and GraphQL

In this simple tutorial, I have shown you how to create a single page application with Angular using GraphQL. User authentication was implemented with minimal effort using the Okta service.

I have not talked about how to use GraphQL to add or modify the data in the database. In GraphQL language this is called _mutations_. To learn more about mutations using Apollo, check out [the manual pages](https://www.apollographql.com/docs/angular/basics/mutations.html).

The complete code for this project can be found at <https://github.com/oktadeveloper/okta-graphql-angular-example>.

If you're interested in learning more about Express, Angular, GraphQL, or secure user management, I'd encourage you to check out any of these resources:

- [Build a Simple API Service with Express and GraphQL](/blog/2018/09/27/build-a-simple-api-service-with-express-and-graphql)
- [Build a Secure API with Spring Boot and GraphQL](/blog/2018/08/16/secure-api-spring-boot-graphql)
- [Build and Understand Express Middleware](/blog/2018/09/13/build-and-understand-express-middleware-through-examples)
- [Angular 6: What's New and Why Upgrade?](/blog/2018/05/09/upgrade-to-angular-6)
- [Build a Basic CRUD App with Angular and Node](/blog/2018/10/30/basic-crud-angular-and-node)

Like what you learned today? We'd love to have you follow us [on Twitter](https://twitter.com/oktadev) and [subscribe to our YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q)!
