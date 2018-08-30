---
layout: blog_post
title: "Build a Health Tracking App with React, GraphQL, and User Authentication"
author: mraible
description: "This article shows you how to build a health tracking app with React, GraphQL, TypeORM, and User Authentication."
tags: [health, react, graphql, typeorm, javascript, typescript, authentication]
tweets:
- "Want to see how to integrate @reactjs with @graphql? This tutorial is for you!"
- "In this tutorial, you'll learn how to integrate @reactjs with @graphql and #TypeORM. Learn a bunch today!"
---

I think you'll like the story I'm about to tell you. I'm going to show you how to build a GraphQL API with Vesper framework, TypeORM, and MySQL. These are Node frameworks, and I'll use TypeScript for the language. For the client, I'll use React, reactstrap, and Apollo Client to talk to the API. Once you have this environment working, and you add secure user authentication, I believe you'll love the experience!

Why focus on secure authentication? Well, aside from the fact that I work for Okta, I think we can all agree that pretty much every application depends upon a secure identity management system. For most developers who are building React apps, there's a decision to be made between rolling your own authentication/authorization or plugging in a service like Okta. Before I dive into building a React app, I want to tell you a bit about Okta, and why I think it's an excellent solution for all JavaScript developers.

## What is Okta?

In short, we make [identity management](https://developer.okta.com/product/user-management/) a lot easier, more secure, and more scalable than what you're used to. Okta is a cloud service that allows developers to create, edit, and securely store user accounts and user account data, and connect them with one or multiple applications. Our API enables you to:

* [Authenticate](https://developer.okta.com/product/authentication/) and [authorize](https://developer.okta.com/product/authorization/) your users
* Store data about your users
* Perform password-based and [social login](https://developer.okta.com/authentication-guide/social-login/)
* Secure your application with [multi-factor authentication](https://developer.okta.com/use_cases/mfa/)
* And much more! Check out our [product documentation](https://developer.okta.com/documentation/)

Are you sold? [Register for a forever-free developer account](https://developer.okta.com/signup/), and when you're done, come on back so we can learn more about building secure apps in React!

## Why a Health Tracking App?

In late September through mid-October 2014, I'd done a 21-Day Sugar Detox during which I stopped eating sugar, started exercising regularly, and stopped drinking alcohol. I'd had high blood pressure for over ten years and was on blood-pressure medication at the time. During the first week of the detox, I ran out of blood-pressure medication. Since a new prescription required a doctor visit, I decided I'd wait until after the detox to get it. After three weeks, not only did I lose 15 pounds, but my blood pressure was at normal levels!

Before I started the detox, I came up with a 21-point system to see how healthy I was each week. Its rules were simple: you can earn up to three points per day for the following reasons:

1. If you eat healthy, you get a point. Otherwise, zero.
2. If you exercise, you get a point.
3. If you don't drink alcohol, you get a point.

I was surprised to find I got eight points the first week I used this system. During the detox, I got 16 points the first week, 20 the second, and 21 the third. Before the detox, I thought eating healthy meant eating anything except fast food. After the detox, I realized that eating healthy for me meant eating no sugar. I'm also a big lover of craft beer, so I modified the alcohol rule to allow two healthier alcohol drinks (like a greyhound or red wine) per day.

My goal is to earn 15 points per week. I find that if I get more, I'll likely lose weight and have good blood pressure. If I get fewer than 15, I risk getting sick. I've been tracking my health like this since September 2014. I've lost weight, and my blood pressure has returned to and maintained normal levels. I haven't had good blood pressure since my early 20s, so this has been a life changer for me.

I built [21-Points Health](https://www.21-points.com/#/about) to track my health. I figured it'd be fun to recreate a small slice of that app, just tracking daily points.

## Building an API with TypeORM, GraphQL, and Vesper

[TypeORM](http://typeorm.io/) is a nifty ORM (object-relational mapper) framework that can run in most JavaScript platforms, including Node, a browser, Cordova, React Native, and Electron. It's heavily influenced by Hibernate, Doctrine, and Entity Framework. Install TypeORM globally to begin creating your API.

```bash
npm i -g typeorm@0.2.7
```

Create a directory to hold the React client and GraphQL API.

```bash
mkdir health-tracker
cd health-tracker
```

Create a new project with MySQL using the following command:

```bash
typeorm init --name graphql-api --database mysql
```

Edit `graphql-api/ormconfig.json` to customize the username, password, and database.

```json
{
    ...
    "username": "health",
    "password": "pointstest",
    "database": "healthpoints",
    ...
}
```

**TIP:** To see the queries being executed against MySQL, change the "logging" value in this file to be "all". Many [other logging options](https://github.com/typeorm/typeorm/blob/master/docs/logging.md) are available too.

### Install MySQL

Install MySQL if you don't already have it installed. On Ubuntu, you can use `sudo apt-get install mysql-server`. On macOS, you can use Homebrew and `brew install mysql`. For Windows, you can use the [MySQL Installer](https://dev.mysql.com/downloads/installer/).

Once you've got MySQL installed and configured with a root password, login and create a `healthpoints` database.

```bash
mysql -u root -p
create database healthpoints;
use healthpoints;
grant all privileges on *.* to 'health'@'localhost' identified by 'points';
```

Navigate to your `graphql-api` project in a terminal window, install the project's dependencies, then start it to ensure you can connect to MySQL.

```bash
cd graphql-api
npm i
npm start
```

You should see the following output:

```bash
Inserting a new user into the database...
Saved a new user with id: 1
Loading users from the database...
Loaded users:  [ User { id: 1, firstName: 'Timber', lastName: 'Saw', age: 25 } ]
Here you can setup and run express/koa/any other framework.
```

### Install Vesper to Integrate TypeORM and GraphQL

[Vesper](http://vesper-framework.com/) is a Node framework that integrates TypeORM and GraphQL. To install it, use good ol' npm.

```bash
npm i vesper@0.1.9
```

Now it's time to create some GraphQL models (that define what your data looks like) and some controllers (that explain how to interact with your data).

Create `graphql-api/src/schema/model/Points.graphql`:

```graphql
type Points {
  id: Int
  date: Date
  exercise: Int
  diet: Int
  alcohol: Int
  notes: String
  user: User
}
```

Create `graphql-api/src/schema/model/User.graphql`:

```graphql
type User {
  id: String
  firstName: String
  lastName: String
  points: [Points]
}
```

Next, create a `graphql-api/src/schema/controller/PointsController.graphql` with queries and mutations:

```graphql
type Query {
  points: [Points]
  pointsGet(id: Int): Points
  users: [User]
}

type Mutation {
  pointsSave(id: Int, date: Date, exercise: Int, diet: Int, alcohol: Int, notes: String): Points
  pointsDelete(id: Int): Boolean
}
```

Now that your data has GraphQL metadata create entities that will be managed by TypeORM. Change `src/entity/User.ts` to have the following code that allows points to be associated with a user.

```ts
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Points } from './Points';

@Entity()
export class User {

  @PrimaryColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => Points, points => points.user)
  points: Points[];
}
```

In the same `src/entity` directory, create a `Points.ts` class with the following code.

```ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Points {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  date: Date;

  @Column()
  exercise: number;

  @Column()
  diet: number;

  @Column()
  alcohol: number;

  @Column()
  notes: string;

  @ManyToOne(() => User, user => user.points, { cascade: ["insert"] })
  user: User|null;
}
```

Note the `cascade: ["insert"]` option on the `@ManyToOne` annotation above. This option will automatically insert a user if it's present on the entity. Create `src/controller/PointsController.ts` to handle converting the data from your GraphQL queries and mutations.

```ts
import { Controller, Mutation, Query } from 'vesper';
import { EntityManager } from 'typeorm';
import { Points } from '../entity/Points';

@Controller()
export class PointsController {

  constructor(private entityManager: EntityManager) {
  }

  // serves "points: [Points]" requests
  @Query()
  points() {
    return this.entityManager.find(Points);
  }

  // serves "pointsGet(id: Int): Points" requests
  @Query()
  pointsGet({id}) {
    return this.entityManager.findOne(Points, id);
  }

  // serves "pointsSave(id: Int, date: Date, exercise: Int, diet: Int, alcohol: Int, notes: String): Points" requests
  @Mutation()
  pointsSave(args) {
    const points = this.entityManager.create(Points, args);
    return this.entityManager.save(Points, points);
  }

  // serves "pointsDelete(id: Int): Boolean" requests
  @Mutation()
  async pointsDelete({id}) {
    await this.entityManager.remove(Points, {id: id});
    return true;
  }
}
```

Change `src/index.ts` to use Vesper's `bootstrap()` to configure everything.

```ts
import { bootstrap } from 'vesper';
import { PointsController } from './controller/PointsController';
import { Points } from './entity/Points';
import { User } from './entity/User';

bootstrap({
  port: 4000,
  controllers: [
    PointsController
  ],
  entities: [
    Points,
    User
  ],
  schemas: [
    __dirname + '/schema/**/*.graphql'
  ],
  cors: true
}).then(() => {
  console.log('Your app is up and running on http://localhost:4000. ' +
    'You can use playground in development mode on http://localhost:4000/playground');
}).catch(error => {
  console.error(error.stack ? error.stack : error);
});
```

This code tells Vesper to register controllers, entities, GraphQL schemas, to run on port 4000, and to enable CORS (cross-origin resource sharing).

Start your API using `npm start` and navigate to http://localhost:4000/playground. In the left pane, enter the following mutation and press the play button. You might try typing the code below so you can experience the code completion that GraphQL provides you.

```graphql
mutation {
  pointsSave(exercise:1, diet:1, alcohol:1, notes:"Hello World") {
    id
    date
    exercise
    diet
    alcohol
    notes
  }
}
```

Your result should look similar to mine.

{% img blog/react-graphql-api/graphql-playground.png alt:"GraphQL Playground" width:"800" %}{: .center-image }

You can click the "SCHEMA" tab on the right to see the available queries and mutations. Pretty slick, eh?!

You can use the following `points` query to verify that data is in your database.

```graphql
query {
  points {id date exercise diet notes}
}
```

### Fix Dates

You might notice that the date returned from `pointsSave` and the `points` query is in a format the might be difficult for a JavaScript client to understand. You can fix that, install [graphql-iso-date](https://www.npmjs.com/package/graphql-iso-date).

```bash
npm i graphql-iso-date@3.5.0
```

Then, add an import in `src/index.ts` and configure custom resolvers for the various date types. This example only uses `Date`, but it's helpful to know the other options.

```ts
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

bootstrap({
  ...
  // https://github.com/vesper-framework/vesper/issues/4
  customResolvers: {
    Date: GraphQLDate,
    Time: GraphQLTime,
    DateTime: GraphQLDateTime
  },
  ...
});
```

Now running the `points` query will return a more client-friendly result.

```json
{
  "data": {
    "points": [
      {
        "id": 1,
        "date": "2018-06-04",
        "exercise": 1,
        "diet": 1,
        "notes": "Hello World"
      }
    ]
  }
}
```

You've written an API with GraphQL and TypeScript in about 20 minutes. How cool is that?! There's still work to do though. In the next sections, you'll create a React client for this API and add authentication with OIDC. Adding authentication will give you the ability to get the user's information and associate a user with their points.

## Get Started with React

One of the quickest ways to get started with React is to use [Create React App](https://github.com/facebook/create-react-app). Install the latest release using the command below.

```bash
npm i -g create-react-app@1.1.4
```

Navigate to the directory where you created your GraphQL API and create a React client.

```bash
cd health-tracker
create-react-app react-client
```

Install the dependencies you'll need to talk to integrate [Apollo Client](https://www.apollographql.com/docs/react/essentials/get-started.html) with React, as well as Bootstrap and [reactstrap](https://reactstrap.github.io/).

```bash
npm i apollo-boost@0.1.7 react-apollo@2.1.4 graphql-tag@2.9.2 graphql@0.13.2
```

### Configure Apollo Client for Your API

Open `react-client/src/App.js` and import `ApolloClient` from `apollo-boost` and add the endpoint to your GraphQL API.

```js
import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
});
```

That's it! With only three lines of code, your app is ready to start fetching data. You can prove it by importing the `gql` function from `graphql-tag`. This will parse your query string and turn it into a query document.

```js
import gql from 'graphql-tag';

class App extends Component {

  componentDidMount() {
    client.query({
      query: gql`
        {
          points {
            id date exercise diet alcohol notes
          }
        }
      `
    })
    .then(result => console.log(result));
  }
...
}
```

Make sure to open your browser's developer tools so you can see the data after making this change. You could modify the `console.log()` to use `this.setState({points: results.data.points})`, but then you'd have to initialize the default state in the constructor. But there's an easier way: you can use `ApolloProvider` and `Query` components from `react-apollo`!

Below is a modified version of `react-client/src/App.js` that uses these components.

```jsx
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import { ApolloProvider, Query } from 'react-apollo';
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
});

class App extends Component {

  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          <Query query={gql`
            {
              points {id date exercise diet alcohol notes}
            }
          `}>
            {({loading, error, data}) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error: {error}</p>;
              return data.points.map(p => {
                return <div key={p.id}>
                  <p>Date: {p.date}</p>
                  <p>Points: {p.exercise + p.diet + p.alcohol}</p>
                  <p>Notes: {p.notes}</p>
                </div>
              })
            }}
          </Query>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
```

You've built a GraphQL API and a React UI that talks to it - excellent work! However, there's still more to do. In the next sections, I'll show you how to add authentication to React, verify JWTs with Vesper, and add CRUD functionality to the UI. CRUD functionality already exists in the API thanks to the mutations you wrote earlier.

## Add Authentication for React with OpenID Connect

You'll need to configure React to use Okta for authentication. You'll need to create an OIDC app in Okta for that.

Log in to your Okta Developer account (or [sign up](https://developer.okta.com/signup/) if you don't have an account) and navigate to **Applications** > **Add Application**. Click **Single-Page App**, click **Next**, and give the app a name you'll remember. Change all instances of `localhost:8080` to `localhost:3000` and click **Done**. Your settings should be similar to the screenshot below.

{% img blog/react-graphql-api/oidc-app-settings.png alt:"OIDC App Settings" width:"700" %}{: .center-image }

Okta's React SDK allows you to integrate OIDC into a React application. To install, run the following commands:

```bash
npm i @okta/okta-react@1.0.2 react-router-dom@4.2.2
```

Okta's React SDK depends on [react-router](https://www.npmjs.com/package/react-router), hence the reason for installing `react-router-dom`. Configuring routing in `client/src/App.tsx` is a common practice, so replace its code with the JavaScript below that sets up authentication with Okta.

```jsx
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ImplicitCallback, SecureRoute, Security } from '@okta/okta-react';
import Home from './Home';
import Login from './Login';
import Points from './Points';

function onAuthRequired({history}) {
  history.push('/login');
}

class App extends Component {
  render() {
    return (
      <Router>
        <Security issuer='https://{yourOktaDomain}/oauth2/default'
                  client_id='{clientId}'
                  redirect_uri={window.location.origin + '/implicit/callback'}
                  onAuthRequired={onAuthRequired}>
          <Route path='/' exact={true} component={Home}/>
          <SecureRoute path='/points' component={Points}/>
          <Route path='/login' render={() => <Login baseUrl='https://{yourOktaDomain}'/>}/>
          <Route path='/implicit/callback' component={ImplicitCallback}/>
        </Security>
      </Router>
    );
  }
}

export default App;
```

Make sure to replace `{yourOktaDomain}` and `{clientId}` in the code above. You can find both values in the Okta Developer Console.

The code in `App.js` references two components that don't exist yet: `Home`, `Login`, and `Points`. Create `src/Home.js` with the following code. This component renders the default route, provides a Login button, and links to your points and logout after you've logged in.

```jsx
import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import { Button, Container } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

export default withAuth(class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {authenticated: null, userinfo: null, isOpen: false};
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.checkAuthentication();
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      if (authenticated && !this.state.userinfo) {
        const userinfo = await this.props.auth.getUser();
        this.setState({authenticated, userinfo});
      } else {
        this.setState({authenticated});
      }
    }
  }

  async componentDidMount() {
    this.checkAuthentication();
  }

  async componentDidUpdate() {
    this.checkAuthentication();
  }

  async login() {
    this.props.auth.login('/');
  }

  async logout() {
    this.props.auth.logout('/');
    this.setState({authenticated: null, userinfo: null});
  }

  render() {
    if (this.state.authenticated === null) return null;
    const button = this.state.authenticated ?
        <div>
          <Button color="link"><Link to="/points">Manage Points</Link></Button><br/>
          <Button color="link" onClick={this.logout}>Logout</Button>
        </div>:
      <Button color="primary" onClick={this.login}>Login</Button>;

    const message = this.state.userinfo ?
      <p>Hello, {this.state.userinfo.given_name}!</p> :
      <p>Please log in to manage your points.</p>;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          {message}
          {button}
        </Container>
      </div>
    );
  }
});
```

This component uses `<Container/>` and `<Button/>` from reactstrap. Install reactstrap, so everything compiles. It depends on Bootstrap, so include it too.

```bash
npm i reactstrap@6.1.0 bootstrap@4.1.1
```

Add Bootstrap's CSS file as an import in `src/index.js`.

```js
import 'bootstrap/dist/css/bootstrap.min.css';
```

You might notice there's a `<AppNavbar/>` in the `Home` component's `render()` method. Create `src/AppNavbar.js` so you can use a common header between components.

```jsx
import React, { Component } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

export default class AppNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {isOpen: false};
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return <Navbar color="success" dark expand="md">
      <NavbarBrand tag={Link} to="/">Home</NavbarBrand>
      <NavbarToggler onClick={this.toggle}/>
      <Collapse isOpen={this.state.isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink
              href="https://twitter.com/oktadev">@oktadev</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="https://github.com/oktadeveloper/okta-react-graphql-example/">GitHub</NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>;
  }
}
```

In this example, I'm going to embed [Okta's Sign-In Widget](https://github.com/okta/okta-signin-widget). Another option is to redirect to Okta and use a hosted login page. Install the Sign-In Widget using npm.

```bash
npm i @okta/okta-signin-widget@2.9.0
```

Create `src/Login.js` and add the following code to it.

{% raw %}
```jsx
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import OktaSignInWidget from './OktaSignInWidget';
import { withAuth } from '@okta/okta-react';

export default withAuth(class Login extends Component {
  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.state = {
      authenticated: null
    };
    this.checkAuthentication();
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({authenticated});
    }
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  onSuccess(res) {
    return this.props.auth.redirect({
      sessionToken: res.session.token
    });
  }

  onError(err) {
    console.log('error logging in', err);
  }

  render() {
    if (this.state.authenticated === null) return null;
    return this.state.authenticated ?
      <Redirect to={{pathname: '/'}}/> :
      <OktaSignInWidget
        baseUrl={this.props.baseUrl}
        onSuccess={this.onSuccess}
        onError={this.onError}/>;
  }
});
```
{% endraw %}

The `Login` component has a reference to `OktaSignInWidget`. Create `src/OktaSignInWidget.js`:

```jsx
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import '@okta/okta-signin-widget/dist/css/okta-theme.css';
import './App.css';

export default class OktaSignInWidget extends Component {
  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    this.widget = new OktaSignIn({
      baseUrl: this.props.baseUrl
    });
    this.widget.renderEl({el}, this.props.onSuccess, this.props.onError);
  }

  componentWillUnmount() {
    this.widget.remove();
  }

  render() {
    return <div/>;
  }
};
```

Create `src/Points.js` to render the list of points from your API.

{% raw %}
```jsx
import React, { Component } from 'react';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { withAuth } from '@okta/okta-react';
import AppNavbar from './AppNavbar';
import { Alert, Button, Container, Table } from 'reactstrap';
import PointsModal from './PointsModal';

export const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql'
});

export default withAuth(class Points extends Component {
  client;

  constructor(props) {
    super(props);
    this.state = {points: [], error: null};

    this.refresh = this.refresh.bind(this);
    this.remove = this.remove.bind(this);
  }

  refresh(item) {
    let existing = this.state.points.filter(p => p.id === item.id);
    let points = [...this.state.points];
    if (existing.length === 0) {
      points.push(item);
      this.setState({points});
    } else {
      this.state.points.forEach((p, idx) => {
        if (p.id === item.id) {
          points[idx] = item;
          this.setState({points});
        }
      })
    }
  }

  remove(item, index) {
    const deletePoints = gql`mutation pointsDelete($id: Int) { pointsDelete(id: $id) }`;

    this.client.mutate({
      mutation: deletePoints,
      variables: {id: item.id}
    }).then(result => {
      if (result.data.pointsDelete) {
        let updatedPoints = [...this.state.points].filter(i => i.id !== item.id);
        this.setState({points: updatedPoints});
      }
    });
  }

  componentDidMount() {
    const authLink = setContext(async (_, {headers}) => {
      const token = await this.props.auth.getAccessToken();
      const user = await this.props.auth.getUser();

      // return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
          'x-forwarded-user': user ? JSON.stringify(user) : ''
        }
      }
    });

    this.client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
      connectToDevTools: true
    });

    this.client.query({
      query: gql`
        {
          points {
              id,
              user {
                  id,
                  lastName
              }
              date,
              alcohol,
              exercise,
              diet,
              notes
          }
        }`
    }).then(result => {
      this.setState({points: result.data.points});
    }).catch(error => {
      this.setState({error: <Alert color="danger">Failure to communicate with API.</Alert>});
    });
  }

  render() {
    const {points, error} = this.state;
    const pointsList = points.map(p => {
      const total = p.exercise + p.diet + p.alcohol;
      return <tr key={p.id}>
        <td style={{whiteSpace: 'nowrap'}}><PointsModal item={p} callback={this.refresh}/></td>
        <td className={total <= 1 ? 'text-danger' : 'text-success'}>{total}</td>
        <td>{p.notes}</td>
        <td><Button size="sm" color="danger" onClick={() => this.remove(p)}>Delete</Button></td>
      </tr>
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          {error}
          <h3>Your Points</h3>
          <Table>
            <thead>
            <tr>
              <th width="10%">Date</th>
              <th width="10%">Points</th>
              <th>Notes</th>
              <th width="10%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {pointsList}
            </tbody>
          </Table>
          <PointsModal callback={this.refresh}/>
        </Container>
      </div>
    );
  }
})
```
{% endraw %}

This code starts with `refresh()` and `remove()` methods, which I'll get to in a moment. The important part happens in `componentDidMount()`, where the access token is added in an `Authorization` header, and the user's information is stuffed in an `x-forwarded-user` header. An `ApolloClient` is created with this information, a cache is added, and the `connectToDevTools` flag is turned on. This can be useful for debugging with [Apollo Client Developer Tools](https://github.com/apollographql/apollo-client-devtools).

```js
componentDidMount() {
  const authLink = setContext(async (_, {headers}) => {
    const token = await this.props.auth.getAccessToken();

    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
        'x-forwarded-user': user ? JSON.stringify(user) : ''
      }
    }
  });

  this.client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    connectToDevTools: true
  });

  // this.client.query(...);
}
```

[Authentication with Apollo Client](https://www.apollographql.com/docs/react/recipes/authentication.html) requires a few new dependencies. Install these now.

```bash
npm apollo-link-context@1.0.8 apollo-link-http@1.5.4
```

In the JSX of the page, there is a delete button that calls the `remove()` method in `Points`. There's also a `<PointsModal/>` component. This is referenced for each item, as well as at the bottom. You'll notice both of these reference the `refresh()` method, which updates the list.

```html
<PointsModal item={p} callback={this.refresh}/>
<PointsModal callback={this.refresh}/>
```

This component renders a link to edit a component, or an Add button when no `item` is set.

Create `src/PointsModal.js` and add the following code to it.

```jsx
import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { withAuth } from '@okta/okta-react';
import { httpLink } from './Points';
import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';

export default withAuth(class PointsModal extends Component {
  client;
  emptyItem = {
    date: (new Date()).toISOString().split('T')[0],
    exercise: 1,
    diet: 1,
    alcohol: 1,
    notes: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      item: this.emptyItem
    };

    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.item) {
      this.setState({item: this.props.item})
    }

    const authLink = setContext(async (_, {headers}) => {
      const token = await this.props.auth.getAccessToken();
      const user = await this.props.auth.getUser();

      // return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
          'x-forwarded-user': JSON.stringify(user)
        }
      }
    });

    this.client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache()
    });
  }

  toggle() {
    if (this.state.modal && !this.state.item.id) {
      this.setState({item: this.emptyItem});
    }
    this.setState({modal: !this.state.modal});
  }

  render() {
    const {item} = this.state;
    const opener = item.id ? <Link onClick={this.toggle} to="#">{this.props.item.date}</Link> :
      <Button color="primary" onClick={this.toggle}>Add Points</Button>;

    return (
      <div>
        {opener}
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>{(item.id ? 'Edit' : 'Add')} Points</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Label for="date">Date</Label>
                <Input type="date" name="date" id="date" value={item.date}
                       onChange={this.handleChange}/>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input type="checkbox" name="exercise" id="exercise" checked={item.exercise}
                         onChange={this.handleChange}/>{' '}
                  Did you exercise?
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input type="checkbox" name="diet" id="diet" checked={item.diet}
                         onChange={this.handleChange}/>{' '}
                  Did you eat well?
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input type="checkbox" name="alcohol" id="alcohol" checked={item.alcohol}
                         onChange={this.handleChange}/>{' '}
                  Did you drink responsibly?
                </Label>
              </FormGroup>
              <FormGroup>
                <Label for="notes">Notes</Label>
                <Input type="textarea" name="notes" id="notes" value={item.notes}
                       onChange={this.handleChange}/>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleSubmit}>Save</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  };

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? (target.checked ? 1 : 0) : target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});
  }

  handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    const updatePoints = gql`
      mutation pointsSave($id: Int, $date: Date, $exercise: Int, $diet: Int, $alcohol: Int, $notes: String) {
        pointsSave(id: $id, date: $date, exercise: $exercise, diet: $diet, alcohol: $alcohol, notes: $notes) {
          id date
        }
      }`;

    this.client.mutate({
      mutation: updatePoints,
      variables: {
        id: item.id,
        date: item.date,
        exercise: item.exercise,
        diet: item.diet,
        alcohol: item.alcohol,
        notes: item.notes
      }
    }).then(result => {
      let newItem = {...item};
      newItem.id = result.data.pointsSave.id;
      this.props.callback(newItem);
      this.toggle();
    });
  }
});
```

Make sure your GraphQL backend is started, then start the React frontend with `npm start`. The text squishes up against the top navbar, so add some padding by adding a rule in `src/index.css`.

```css
.container-fluid {
  padding-top: 10px;
}
```

You should see the `Home` component and a button to log in.

{% img blog/react-graphql-api/home.png alt:"Home Screen" width:"800" %}{: .center-image }

Click **Login** and you'll be prompted to enter your Okta credentials.

{% img blog/react-graphql-api/login.png alt:"Login Screen" width:"800" %}{: .center-image }

And then you'll be logged in!

{% img blog/react-graphql-api/home-authenticated.png alt:"Home Screen with Authenticated User" width:"800" %}{: .center-image }

Click **Manage Points** to see the points list.

{% img blog/react-graphql-api/points-list.png alt:"Your Points Screen" width:"800" %}{: .center-image }

It's cool to see everything working, isn't it?! :D

Your React frontend is secured, but your API is still wide open. Let's fix that.

### Get User Information from JWTs

Navigate to your `graphql-api` project in a terminal window and install Okta's JWT Verifier.

```bash
npm i @okta/jwt-verifier@0.0.12
```

Create `graphql-api/src/CurrentUser.ts` to hold the current user's information.

```ts
export class CurrentUser {
  constructor(public id: string, public firstName: string, public lastName: string) {}
}
```

Import `OktaJwtVerifier` and `CurrentUser` in `graphql-api/src/index.ts` and configure the JWT verifier to use your OIDC app's settings.

```ts
import * as OktaJwtVerifier from '@okta/jwt-verifier';
import { CurrentUser } from './CurrentUser';

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: '{clientId}',
  issuer: 'https://{yourOktaDomain}/oauth2/default'
});
```

In the bootstrap configuration, define `setupContainer` to require an `authorization` header and set the current user from the `x-forwarded-user` header.

```ts
bootstrap({
  ...
  cors: true,
  setupContainer: async (container, action) => {
    const request = action.request;
    // require every request to have an authorization header
    if (!request.headers.authorization) {
      throw Error('Authorization header is required!');
    }
    let parts = request.headers.authorization.trim().split(' ');
    let accessToken = parts.pop();
    await oktaJwtVerifier.verifyAccessToken(accessToken)
      .then(async jwt => {
        const user = JSON.parse(request.headers['x-forwarded-user'].toString());
        const currentUser = new CurrentUser(jwt.claims.uid, user.given_name, user.family_name);
        container.set(CurrentUser, currentUser);
      })
      .catch(error => {
        throw Error('JWT Validation failed!');
      })
  }
  ...
});
```

Modify `graphql-api/src/controller/PointsController.ts` to inject the `CurrentUser` as a dependency. While you're in there, adjust the `points()` method to filter by user ID and modify `pointsSave()` to set the user when saving.

```ts
import { Controller, Mutation, Query } from 'vesper';
import { EntityManager } from 'typeorm';
import { Points } from '../entity/Points';
import { User } from '../entity/User';
import { CurrentUser } from '../CurrentUser';

@Controller()
export class PointsController {

  constructor(private entityManager: EntityManager, private currentUser: CurrentUser) {
  }

  // serves "points: [Points]" requests
  @Query()
  points() {
    return this.entityManager.getRepository(Points).createQueryBuilder("points")
      .innerJoin("points.user", "user", "user.id = :id", { id: this.currentUser.id })
      .getMany();
  }

  // serves "pointsGet(id: Int): Points" requests
  @Query()
  pointsGet({id}) {
    return this.entityManager.findOne(Points, id);
  }

  // serves "pointsSave(id: Int, date: Date, exercise: Int, diet: Int, alcohol: Int, notes: String): Points" requests
  @Mutation()
  pointsSave(args) {
    // add current user to points saved
    if (this.currentUser) {
      const user = new User();
      user.id = this.currentUser.id;
      user.firstName = this.currentUser.firstName;
      user.lastName = this.currentUser.lastName;
      args.user = user;
    }

    const points = this.entityManager.create(Points, args);
    return this.entityManager.save(Points, points);
  }

  // serves "pointsDelete(id: Int): Boolean" requests
  @Mutation()
  async pointsDelete({id}) {
    await this.entityManager.remove(Points, {id: id});
    return true;
  }
}
```

Restart the API, and you should be off to the races!

{% img blog/react-graphql-api/modal-add.png alt:"Add Points Modal" width:"800" %}{: .center-image }

{% img blog/react-graphql-api/modal-edit.png alt:"Edit Points Modal" width:"800" %}{: .center-image }

### Source Code

You can find the source code for this article at https://github.com/oktadeveloper/okta-react-graphql-example.

## Learn More About React, Node, and User Authentication

This article showed you how to build a secure React app with GraphQL, TypeORM, and Node/Vesper. I hope you enjoyed the experience!

At Okta, we care about making authentication with React and Node easy to implement. We have several blog posts on the topic, and documentation too! I encourage you to check out the following links:

* [Build User Registration with Node, React, and Okta](https://scotch.io/tutorials/add-user-registration-to-your-site-with-node-react-and-okta)
* [Build a React Application with User Authentication in 15 Minutes](https://developer.okta.com/blog/2017/03/30/react-okta-sign-in-widget)
* [Build a React Native App and Authenticate with OAuth 2.0](https://scotch.io/tutorials/build-a-react-native-app-and-authenticate-with-oauth-20)
* [Add Okta Authentication to Your React app](https://developer.okta.com/code/react/okta_react)
* [Build a Basic CRUD App with Vue.js and Node](https://developer.okta.com/blog/2018/02/15/build-crud-app-vuejs-node)

I hope you have an excellent experience building apps with React and GraphQL. If you have any questions, please [hit me up on Twitter](https://twitter.com/mraible) or my whole kick-ass team on [@oktadev](https://twitter.com/oktadev). Our DMs are wide open! :)
