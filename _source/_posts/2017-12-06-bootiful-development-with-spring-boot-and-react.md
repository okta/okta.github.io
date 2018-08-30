---
layout: blog_post
title: 'Bootiful Development with Spring Boot and React'
author: mraible
description: "This post shows how you can build a UI and an API as separate apps. You'll learn how to create REST endpoints with Spring MVC, configure Spring Boot to allow CORS, and create a React app to display its data. Finally, you'll lock it down with Okta."
tags: [authentication, spring boot, react, okta, oidc]
tweets:
  - "Learn how to integrate @springboot and @reactjs in this tutorial from @mraible."
  - "Want to develop an application with @java on the backend and @reactjs on the front-end? This article is for you!"
---

React has been getting a lot of positive press in the last couple years, making it an appealing frontend option for Java developers! Once you learn how it works, it makes a lot of sense and can be fun to develop with. Not only that, but it's *wicked fast!* If you've been following me, or if you've read this blog for a bit, you might remember my [Bootiful Development with Spring Boot and Angular](/blog/2017/04/26/bootiful-development-with-spring-boot-and-angular) tutorial. Today, I'll show you how to build the same application, except with React this time. Before we dive into that, let's talk some more about what React is great for, and why I chose to explore it in this post.

First of all, React isn't a full-fledged web framework. It's more of a toolkit for developing UIs, a la GWT. If you want to make an HTTP request to fetch data from a server, React doesn't provide any utilities for that. However, it does have a *huge* ecosystem that offers many libraries and components. What do I mean by huge? Put it this way: According to npmjs.com, [Angular has 17,938 packages](https://www.npmjs.com/search?q=angular). React has almost [three times as many](https://www.npmjs.com/search?q=react) at 42,428!

Angular is a good friend of mine and has been for a long time. I'm not abandoning my old friend to adopt React. I'm just making new friends. It's good for a human's perspective to have lots of friends with different backgrounds and opinions!

This post shows how you can build a UI and an API as separate apps. You'll learn how to create REST endpoints with Spring MVC, configure Spring Boot to allow CORS, and create a React app to display its data. This app will show a list of beers from the API, then fetch a GIF from [GIPHY](https://giphy.com/) that matches the beer's name. I'll also show you how to integrate Okta and its OpenID Connect (OIDC) support to lock down your API and add authentication to your UI.

Let's get started!

## Build an API with Spring Boot

**NOTE:** The instructions below for building a Spring Boot API are the same as the ones in [Bootiful Development with Spring Boot and Angular](/blog/2017/04/26/bootiful-development-with-spring-boot-and-angular). I've copied them below for your convenience.

To get started with Spring Boot, navigate to [start.spring.io](https://start.spring.io) and choose version 2.0.3+. In the "Search for dependencies" field, select the following:

* [H2](http://www.h2database.com/html/main.html): An in-memory database
* [JPA](http://www.oracle.com/technetwork/java/javaee/tech/persistence-jsp-140049.html): Standard ORM for Java
* [Rest Repositories](http://projects.spring.io/spring-data-rest/): Allows you to expose your JPA repositories as REST endpoints
* [Web](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot-starters/spring-boot-starter-web/pom.xml): Spring MVC with Jackson (for JSON), Hibernate Validator, and embedded Tomcat

{% img blog/react-spring-boot/start.spring.io.png alt:"start.spring.io" width:"800" %}{: .center-image }

If you like the command-line better, you can use the following command to download a `demo.zip` file with [HTTPie](https://httpie.org/).

```
http https://start.spring.io/starter.zip \
dependencies==h2,data-jpa,data-rest,web -d
```

Create a directory called `spring-boot-react-example`, with a `server` directory inside it. Expand the contents of `demo.zip` into the `server` directory.

Open the "server" project in your favorite IDE and run `DemoApplication` or start it from the command line using `./mvnw spring-boot:run`.

Create a `com.okta.developer.demo.beer` package and a `Beer.java` file in it. This class will be the entity that holds your data.

```java
package com.okta.developer.demo.beer;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Beer {

    @Id
    @GeneratedValue
    private Long id;
    private String name;

    public Beer() {}

    public Beer(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Beer{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
```

Add a `BeerRepository` class that leverages Spring Data to do CRUD on this entity.

```java
package com.okta.developer.demo.beer;

import org.springframework.data.jpa.repository.JpaRepository;

interface BeerRepository extends JpaRepository<Beer, Long> {
}
```

Add a `BeerCommandLineRunner` that uses this repository and creates a default set of data.

```java
package com.okta.developer.demo.beer;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.stream.Stream;

@Component
public class BeerCommandLineRunner implements CommandLineRunner {

    private final BeerRepository repository;

    public BeerCommandLineRunner(BeerRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... strings) throws Exception {
        // Top beers from https://www.beeradvocate.com/lists/top/
        Stream.of("Kentucky Brunch Brand Stout", "Good Morning", "Very Hazy", "King Julius",
                "Budweiser", "Coors Light", "PBR").forEach(name ->
                repository.save(new Beer(name))
        );
        repository.findAll().forEach(System.out::println);
    }
}
```

Rebuild your project, and you should see a list of beers printed in your terminal.

{% img blog/react-spring-boot/beers-in-terminal.png alt:"Beers printed in terminal" width:"800" %}{: .center-image }

Add a [`@RepositoryRestResource`](http://docs.spring.io/spring-data/rest/docs/2.6.x/api/org/springframework/data/rest/core/annotation/RepositoryRestResource.html) annotation to `BeerRepository` to expose all its CRUD operations as REST endpoints.

```java
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
interface BeerRepository extends JpaRepository<Beer, Long> {
}
```

Add a `BeerController` class to create an endpoint that filters out less-than-great beers.

```java
package com.okta.developer.demo.beer;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class BeerController {
    private BeerRepository repository;

    public BeerController(BeerRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/good-beers")
    public Collection<Beer> goodBeers() {
        return repository.findAll().stream()
                .filter(this::isGreat)
                .collect(Collectors.toList());
    }

    private boolean isGreat(Beer beer) {
        return !beer.getName().equals("Budweiser") &&
                !beer.getName().equals("Coors Light") &&
                !beer.getName().equals("PBR");
    }
}
```

Re-build your application and navigate to `http://localhost:8080/good-beers`. You should see the list of good beers in your browser.

{% img blog/react-spring-boot/good-beers-json.png alt:"Good Beers JSON" width:"800" %}{: .center-image }

You should also see this same result in your terminal window when using HTTPie.

```bash
http localhost:8080/good-beers
```

## Create a Project with Create React App

Creating an API seems to be the easy part these days, thanks in large part to Spring Boot. In this section, I hope to show you that creating a UI with React is pretty easy too. If you follow the steps below, you'll create a new React app, fetch beer names and images from APIs, and create components to display the data.

To create a React project, make sure you have [Node.js](https://nodejs.org/), [Create React App](https://github.com/facebookincubator/create-react-app), and [Yarn](https://yarnpkg.com/) installed.

```bash
npm install -g create-react-app@1.5.2
```

From a terminal window, cd into the root of the `spring-boot-react-example` directory and run the following command. This command will create a new React application with TypeScript support.

```bash
create-react-app client --scripts-version=react-scripts-ts
```

After this process runs, you will have a new `client` directory with all the necessary dependencies installed. To verify everything works, cd into the `client` directory and run `yarn start`. If everything works, you should see the following in your browser.

{% img blog/react-spring-boot/react-welcome.png alt:"Welcome to React" width:"800" %}{: .center-image }

Thus far, you've created a `good-beers` API and a React app, but you haven't created the UI to display the list of beers from your API. To do this, open `client/src/App.tsx` and add a `componentDidMount()` method.

```typescript
componentDidMount() {
  this.setState({isLoading: true});

  fetch('http://localhost:8080/good-beers')
    .then(response => response.json())
    .then(data => this.setState({beers: data, isLoading: false}));
}
```

[React's component lifecycle](https://reactjs.org/docs/react-component.html#the-component-lifecycle) will call the `componentDidMount()` method. The code above uses [`fetch`](https://fetch.spec.whatwg.org/),
a modern replacement for `XMLHttpRequest`. It's [supported in most browsers according to caniuse.com](https://caniuse.com/#search=fetch).

You can see that it sets the `beers` state with the response data. To initialize the state for this component, you need create a few interfaces and override the constructor.

```typescript
interface Beer {
  id: string;
  name: string;
}

interface AppProps {
}

interface AppState {
  beers: Array<Beer>;
  isLoading: boolean;
}

class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);

    this.state = {
      beers: [],
      isLoading: false
    };
  }
  // componentDidMount() and render()
  ...
}
```

Change the `render()` method to have the following JSX. [JSX](https://facebook.github.io/jsx/) is Facebook's XML-like syntax that renders HTML via JavaScript.

```typescript
render() {
  const {beers, isLoading} = this.state;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to React</h1>
      </header>
      <div>
        <h2>Beer List</h2>
        {beers.map((beer: Beer) =>
          <div key={beer.id}>
            {beer.name}
          </div>
        )}
      </div>
    </div>
  );
}
```

At this point, you'll likely get a message in your browser that says something like the following:

```
/Users/mraible/spring-boot-react-example/client/src/App.tsx
(6,11): interface name must start with a capitalized I
```

As a Java developer, I'm not a fan of prefixing interfaces with "I". There's also a few other tslint warnings I don't agree with. To complete this tutorial with a set of sensible rules, modify `client/tslint.json` to have the following rules:

```json
"rules": {
  "interface-name": [true, "never-prefix"],
  "no-empty-interface": false,
  "array-type": [true, "generic"],
  "member-access": [true, "no-public"]
}
```

If you look at `http://localhost:3000` in your browser, you'll see a "Loading..." message. If you look in your browser's console, you'll likely see an issue about CORS.

<pre style="color: red">
Failed to load http://localhost:8080/good-beers: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:3000' is therefore not allowed access.
</pre>

To fix this issue, you'll need to configure Spring Boot to allow cross-domain access from `http://localhost:3000`.

### Configure CORS for Spring Boot

In the server project, open `server/src/main/java/.../demo/beer/BeerController.java` and add a `@CrossOrigin` annotation to enable cross-origin resource sharing (CORS) from the client (`http://localhost:3000`).

```java
import org.springframework.web.bind.annotation.CrossOrigin;
...
    @GetMapping("/good-beers")
    @CrossOrigin(origins = "http://localhost:3000")
    public Collection<Beer> goodBeers() {
```

After making these changes, restart the server, refresh your browser, and you should be able to see a list of beers from your Spring Boot API.

{% img blog/react-spring-boot/react-beer-list.png alt:"Beer List in React" width:"800" %}{: .center-image }

### Create a BeerList Component

To make this application easier to maintain, move the beer list fetching and rendering from `App.tsx` to its own `BeerList` component. Create `src/BeerList.tsx` and populate it with the code from `App.tsx`. Change all code references from `App` to `BeerList`, except in the JSX code (where `App*` CSS classes are specified).

```typescript
import * as React from 'react';

interface Beer {
  id: string;
  name: string;
}

interface BeerListProps {
}

interface BeerListState {
  beers: Array<Beer>;
  isLoading: boolean;
}

class BeerList extends React.Component<BeerListProps, BeerListState> {

  constructor(props: BeerListProps) {
    super(props);

    this.state = {
      beers: [],
      isLoading: false
    };
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch('http://localhost:8080/good-beers')
      .then(response => response.json())
      .then(data => this.setState({beers: data, isLoading: false}));
  }

  render() {
    const {beers, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    return (
      <div>
        <h2>Beer List</h2>
        {beers.map((beer: Beer) =>
          <div key={beer.id}>
            {beer.name}
          </div>
        )}
      </div>
    );
  }
}

export default BeerList;
```

Then change `client/src/App.tsx` so it only contains a shell and a reference to `<BeerList/>`.

```typescript
import * as React from 'react';
import './App.css';
import BeerList from './BeerList';

import logo from './logo.svg';

class App extends React.Component<{}, any> {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <BeerList/>
      </div>
    );
  }
}

export default App;
```

### Create a GiphyImage Component

To make it look a little better, add a [GIPHY](http://giphy.com) component to fetch images based on the beer's name. Create `client/src/GiphyImage.tsx` and place the following code inside it.

```typescript
import * as React from 'react';

interface GiphyImageProps {
  name: string;
}

interface GiphyImageState {
  giphyUrl: string;
  isLoading: boolean;
}

class GiphyImage extends React.Component<GiphyImageProps, GiphyImageState> {
  constructor(props: GiphyImageProps) {
    super(props);

    this.state = {
      giphyUrl: '',
      isLoading: false
    };
  }

  componentDidMount() {
    const giphyApi = '//api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=1&q=';

    fetch(giphyApi + this.props.name)
      .then(response => response.json())
      .then(response => {
        if (response.data.length > 0) {
          this.setState({giphyUrl: response.data[0].images.original.url});
        } else {
          // dancing cat for no images found
          this.setState({giphyUrl: '//media.giphy.com/media/YaOxRsmrv9IeA/giphy.gif'});
        }
        this.setState({isLoading: false});
      });
  }

  render() {
    const {giphyUrl, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading image...</p>;
    }

    return (
      <img src={giphyUrl} alt={this.props.name} width="200"/>
    );
  }
}

export default GiphyImage;
```

Change the `render()` method in `BeerList.tsx` to use this component.

```typescript
import GiphyImage from './GiphyImage';
...
render() {
  const {beers, isLoading} = this.state;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Beer List</h2>
      {beers.map((beer: Beer) =>
        <div key={beer.id}>
          {beer.name}<br/>
          <GiphyImage name={beer.name}/>
        </div>
      )}
    </div>
  );
}
```

The result should look something like the following list of beer names with images.

{% img blog/react-spring-boot/react-beer-list-giphy.png alt:"Beer list with Giphy images" width:"800" %}{: .center-image }

You've just created a React app that talks to a Spring Boot API using cross-domain requests. Congratulations!

## Add PWA Support

Create React App has support for progressive web applications (PWAs) out-of-the-box. To learn how it's integrated, open `client/README.md` and search for "Making a Progressive Web App".

To see how it works, run `yarn build` in the `client` directory. After this command completes,
you'll see a message like the following.

```
The build folder is ready to be deployed.
You may serve it with a static server:

  yarn global add serve
  serve -s build
```

Install serve and run `serve -s build -p 3000`. You should be able to open your browser to view `http://localhost:3000`.

I ran a [Lighthouse](https://developers.google.com/web/tools/lighthouse/) audit in Chrome and found that this app only scores a 64/100 at this point.

{% img blog/react-spring-boot/lighthouse-first.png alt:"Lighthouse Score from first audit" width:"800" %}{: .center-image }

In the PWA section of the report, it'll tell you that you need at least 192px and 512px icons.

{% img blog/react-spring-boot/pwa-64.png alt:"Progressive Web App Score: 64" width:"800" %}{: .center-image }

You can download a 512-pixel free beer icon from [this page](https://www.flaticon.com/free-icon/beer_168557#term=beer&page=1&position=29).

**NOTE:** This icon is made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>. It's licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>.

Copy the downloaded `beer.png` to `client/public`. Modify `client/public/manifest.json` to have a name specific to this app, and to add the 512-pixel icon.

```json
{
  "short_name": "Beer",
  "name": "Good Beer",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "beer.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "start_url": "./index.html",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

After making this change, I was able to achieve an 82 Lighthouse score for PWA. The most prominent complaint from this report was that I wasn't using HTTPS. To see how the app would score when it used HTTPS, I deployed it to [Pivotal Cloud Foundry](https://pivotal.io/platform) and [Heroku](https://www.heroku.com/). I was pumped to discover it scored 💯 on both platforms.

{% img blog/react-spring-boot/lighthouse-cloudfoundry.png alt:"Lighthouse on Cloud Foundry" width:"800" %}{: .center-image }

{% img blog/react-spring-boot/lighthouse-heroku.png alt:"Lighthouse on Heroku" width:"800" %}{: .center-image }

To read the scripts I used to deploy everything, see [`cloudfoundry.sh`](https://github.com/oktadeveloper/spring-boot-react-example/blob/master/cloudfoundry.sh) and [`heroku.sh`](https://github.com/oktadeveloper/spring-boot-react-example/blob/master/heroku.sh) in this article's companion GitHub repository. I owe a big thanks to [@starbuxman](https://twitter.com/starbuxman) and [@codefinger](https://twitter.com/codefinger) for their help creating them!

## Add Authentication with Okta

You might be thinking, "this is pretty cool, it's easy to see why people fall in love with React." There's another tool you might fall in love with after you've tried it: Authentication with Okta! Why Okta? Because you can get [1,000 active monthly users for free](https://developer.okta.com/pricing/)! It's worth a try, especially when you see how easy it is to add auth to Spring Boot and React with Okta.

### Okta Spring Boot Starter

To lock down the backend, you can use [Okta's Spring Boot Starter](https://github.com/okta/okta-spring-boot). To integrate this starter, add the following dependencies to `server/pom.xml`:

```xml
<dependency>
    <groupId>com.okta.spring</groupId>
    <artifactId>okta-spring-boot-starter</artifactId>
    <version>0.6.0</version>
</dependency>
<dependency>
    <groupId>org.springframework.security.oauth.boot</groupId>
    <artifactId>spring-security-oauth2-autoconfigure</artifactId>
    <version>2.0.1.RELEASE</version>
</dependency>
```

Now you need to configure the server to use Okta for authentication. You'll need to create an OIDC app in Okta for that.

### Create an OIDC App in Okta

Log in to your Okta Developer account (or [sign up](https://developer.okta.com/signup/) if you don't have an account) and navigate to **Applications** > **Add Application**. Click **Single-Page App**, click **Next**, and give the app a name you'll remember. Change all instances of `localhost:8080` to `localhost:3000` and click **Done**.

Copy the client ID into your `server/src/main/resources/application.properties` file. While you're in there, add a `okta.oauth2.issuer` property that matches your Okta domain. For example:

```properties
okta.oauth2.issuer=https://{yourOktaDomain}/oauth2/default
okta.oauth2.clientId={clientId}
```

Replace `{yourOktaDomain}` with your org URL, which you can find on the Dashboard of the Developer Console. Make sure you don't include `-admin` in the value!

Update `server/src/main/java/.../demo/DemoApplication.java` to enable it as a resource server.

```java
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;

@EnableResourceServer
@SpringBootApplication
```

After making these changes, you should be able to restart the server and see access denied when you try to navigate to http://localhost:8080.

{% img blog/react-spring-boot/server-access-denied.png alt:"Access Denied by Okta Spring Boot Starter" width:"800" %}{: .center-image }

### Okta's React Support

Okta's React SDK allows you to integrate OIDC into a React application. You can learn more about Okta's React SDK can be [found on npmjs.com](https://www.npmjs.com/package/@okta/okta-react). To install, run the following commands:

```
yarn add @okta/okta-react@1.0.2 react-router-dom@4.3.1
yarn add -D @types/react-router-dom@4.2.7
```

Okta's React SDK depends on [react-router](https://www.npmjs.com/package/react-router), hence the reason for installing `react-router-dom`. Configuring routing in `client/src/App.tsx` is a common practice, so replace its code with the TypeScript below that sets up authentication with Okta.

```typescript
import * as React from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Security, ImplicitCallback } from '@okta/okta-react';

const config = {
  issuer: 'https://{yourOktaDomain}/oauth2/default',
  redirectUri: window.location.origin + '/implicit/callback',
  clientId: '{clientId}'
};

export interface Auth {
  login(path: string): {};
  logout(): {};
  isAuthenticated(): boolean;
  getAccessToken(): string;
}

class App extends React.Component {

  render() {
    return (
      <Router>
        <Security
          issuer={config.issuer}
          client_id={config.clientId}
          redirect_uri={config.redirectUri}>
          <Route path="/" exact={true} component={Home}/>
          <Route path="/implicit/callback" component={ImplicitCallback}/>
        </Security>
      </Router>
    );
  }
}

export default App;
```

Create `client/src/Home.tsx` to contain the application shell that `App.tsx` formerly contained. This class renders the app shell, as well as login/logout buttons, and the `<BeerList/>` if you're authenticated.

```typescript
import * as React from 'react';
import './App.css';
import BeerList from './BeerList';
import { withAuth } from '@okta/okta-react';
import { Auth } from './App';

import logo from './logo.svg';

interface HomeProps {
  auth: Auth;
}

interface HomeState {
  authenticated: boolean;
}

export default withAuth(class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {authenticated: false};
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  async checkAuthentication() {
    const isAuthenticated = await this.props.auth.isAuthenticated();
    const {authenticated} = this.state;
    if (isAuthenticated !== authenticated) {
      this.setState({authenticated: isAuthenticated});
    }
  }

  async componentDidMount() {
    await this.checkAuthentication();
  }

  async componentDidUpdate() {
    await this.checkAuthentication();
  }

  async login() {
    this.props.auth.login('/');
  }

  async logout() {
    this.props.auth.logout();
  }

  render() {
    const {authenticated} = this.state;
    let body = null;
    if (authenticated) {
      body = (
        <div className="Buttons">
          <button onClick={this.logout}>Logout</button>
          <BeerList auth={this.props.auth}/>
        </div>
      );
    } else {
      body = (
        <div className="Buttons">
          <button onClick={this.login}>Login</button>
        </div>
      );
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {body}
      </div>
    );
  }
});
```

If you look at your React app in your browser, you'll likely see an error like the following:

<pre>
(5,44): Could not find a declaration file for module '@okta/okta-react'. '/Users/mraible/spring-boot-react-example/client/node_modules/@okta/okta-react/dist/index.js' implicitly has an 'any' type.
  Try `npm install @types/okta__okta-react` if it exists or add a new declaration (.d.ts) file containing `declare module 'okta__okta-react';`
</pre>

Create `client/src/okta.d.ts` with the following declaration to solve this problem.

```typescript
declare module '@okta/okta-react';
```

Restart the client, and you'll see there's some work to do on the `BeerList` component.

<pre>
(39,21): Property 'auth' does not exist on type 'IntrinsicAttributes &amp; IntrinsicClassAttributes&lt;BeerList&gt; &amp; Readonly&lt;{ children?: ReactNode; }&gt; &amp; ...'.
</pre>

In `client/src/BeerList.tsx`, add the `auth` property to the `BeerListProps` interface.

```typescript
import { Auth } from './App';

interface Beer {
  id: string;
  name: string;
}

interface BeerListProps {
  auth: Auth;
}

interface BeerListState {
  beers: Array<Beer>;
  isLoading: boolean;
}

class BeerList extends React.Component<BeerListProps, BeerListState> {
  ...
}
```

You'll encounter a couple more TSLint rules I don't agree with at this point.

```bash
(4,1): Import sources within a group must be alphabetized.
(10,3): The key 'clientId' is not sorted alphabetically
```

To turn allow any order for your imports and keys, modify `tslint.json` and disabled ordered-imports.

```json
"rules": {
  ...
  "ordered-imports": false,
  "object-literal-sort-keys": false
}
```

Add the following CSS rules to `client/src/App.css` to make the Login/Logout buttons a little more visible.

```css
.Buttons {
  margin-top: 10px;
}

.Buttons button {
  font-size: 1em;
}
```

Your browser should now show a Login button.

{% img blog/react-spring-boot/login-button.png alt:"Login Button" width:"800" %}{: .center-image }

When you click the button to log in, enter the email and password you used to create your Okta Developer account. When it redirects you back to your application, you'll likely see "Loading..." and a CORS error in your browser's console.

{% img blog/react-spring-boot/cors-error.png alt:"CORS Error after login" width:"800" %}{: .center-image }

This error happens because Spring's `@CrossOrigin` doesn't play well with Spring Security. To solve this problem, add a `simpleCorsFilter` bean to the body of `DemoApplication.java`.

```java
package com.okta.developer.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;

@EnableResourceServer
@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Bean
    public FilterRegistrationBean<CorsFilter> simpleCorsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        config.setAllowedMethods(Collections.singletonList("*"));
        config.setAllowedHeaders(Collections.singletonList("*"));
        source.registerCorsConfiguration("/**", config);
        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }
}
```

Restart your server after making this change. To make it all work on the client, modify the `componentDidMount()` method in `client/src/BeerList.tsx` to set an authorization header.

```typescript
async componentDidMount() {
  this.setState({isLoading: true});

  try {
    const response = await fetch('http://localhost:8080/good-beers', {
      headers: {
        Authorization: 'Bearer ' + await this.props.auth.getAccessToken()
    }
  });
    const data = await response.json();
    this.setState({beers: data, isLoading: false});
  } catch (err) {
    this.setState({error: err});
  }
}
```

You'll also need to add `error` in the `BeerListState` interface.

```typescript
interface BeerListState {
  beers: Array<Beer>;
  isLoading: boolean;
  error: string;
}
```

Change the constructor, so it initializes `error` to an empty string.

```typescript
this.state = {
  beers: [],
  isLoading: false,
  error: ''
};
```

Then change the `render()` method to show an error when it happens.

```typescript
render() {
  const {beers, isLoading, error} = this.state;

  if (isLoading) {
    return <p>Loading ...</p>;
  }

  if (error.length > 0) {
    return <p>Error: {error}</p>;
  }

  return (...)
}
```

Now you should be able to see the beer list as an authenticated user.

{% img blog/react-spring-boot/success.png alt:"Wahoo!" width:"800" %}{: .center-image }

If it works, congratulations!

## Learn More About Spring Boot and React

To learn more about React, Spring Boot, or Okta, check out the following resources:

* [Intro to React Workshop by Eric Vicenti](https://github.com/ericvicenti/intro-to-react) - highly recommended for learning React!
* My [Angular vs React Smackdown Talk at Devoxx Belgium](https://www.youtube.com/watch?v=qYEEuiI4l10) with [Deepu K Sasidharan](https://twitter.com/deepu105)
* [How to fetch data in React](https://www.robinwieruch.de/react-fetching-data/) by [Robin Wieruch](https://twitter.com/rwieruch)
* [Build a React Application with User Authentication in 15 Minutes](/blog/2017/03/30/react-okta-sign-in-widget)
* [Build a Preact App with Authentication ](/blog/2017/10/19/build-a-preact-app-with-authentication)
* [Create a Custom Login Form with Okta's React SDK](/code/react/okta_react#create-a-custom-login-form)

You can find the source code associated with this article [on GitHub](https://github.com/oktadeveloper/spring-boot-react-example). The primary example (without authentication) is in the `master` branch, while the Okta integration is in the `okta` branch. To check out the Okta branch on your local machine, run the following commands.

```bash
git clone -b okta https://github.com/oktadeveloper/spring-boot-react-example.git
```

If you find any issues, please add a comment below, and I'll do my best to help. If you liked this tutorial, I'd love to have you [follow me on Twitter](https://twitter.com/mraible). To be notified of more articles like this one, follow [@oktadev](https://twitter.com/oktadev).

**Changelog:**

* Jul 12, 2018: Updated to use Spring Boot 2.0.3, Okta Spring Boot Starter 0.6.0, and Okta React 1.0.2. You can see the code changes in the example app via pull requests on GitHub: [master-branch#4](https://github.com/oktadeveloper/spring-boot-react-example/pull/4), [okta-branch#5](https://github.com/oktadeveloper/spring-boot-react-example/pull/5). Changes to this article can be viewed in [okta/okta.github.io#2189](https://github.com/okta/okta.github.io/pull/2189).
* Apr 10, 2018: Updated to use Spring Boot 1.5.12, Okta Spring Boot Starter 0.4.0, and Okta React 1.0.0. You can see the code changes in the example app via pull requests on GitHub: [master#3](https://github.com/oktadeveloper/spring-boot-react-example/pull/3), [okta#2](https://github.com/oktadeveloper/spring-boot-react-example/pull/2). Changes to this article can be viewed in [okta/okta.github.io#1942](https://github.com/okta/okta.github.io/pull/1942).
