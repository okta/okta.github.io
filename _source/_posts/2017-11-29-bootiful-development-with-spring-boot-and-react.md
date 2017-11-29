---
layout: blog_post
title: 'Bootiful Development with Spring Boot and React'
author: mraible
tags: [authentication, spring boot, react, okta, oidc]
---

Are you a Java Developer that's eager to try out React? React has been getting a lot of positive press in the last couple
years, and for good reason! Once you learn how it works, it makes a lot of sense, and can be fun to develop with. Not only
that, but it's *wicked fast!*

First of all, React isn't a full-fledged web framework. It's more of a toolkit for developing
UIs, ala GWT. If you want to make an HTTP request to fetch data from a server, React doesn't provide any utilities for that.
However, it does have a *huge* ecosystem that offers many libraries and components. What do I mean by huge? Put it this way:
According to npmjs.com, [Angular has 17,938 packages](https://www.npmjs.com/search?q=angular). React has almost
[three times as many](https://www.npmjs.com/search?q=react) at 42,428!

Angular is a good friend of mine, and I'm not abandoning my old friend to adopt React. I'm just making new friends. It's good for a human's perspective to have lots of friends with different backgrounds and opinions! 

If you've read this blog for a bit, you might remember my [Bootiful Development with Spring Boot and Angular](/blog/2017/04/26/bootiful-development-with-spring-boot-and-angular) tutorial. Today, I'll show you how to build
the same application, except with React this time.

This post shows how you can build a UI and an API as separate apps. You’ll learn how to create REST endpoints with Spring MVC, configure Spring Boot to allow CORS, and create an React app to display its data. This app will display a list of beers from the API, then fetch a GIF from [GIPHY](https://giphy.com/) that matches the beer’s name. I'll also show you to to integrate Okta and its OpenID Connect (OIDC) support to lock down your API and add authentication to your UI.

Let's get started!

## Build an API with Spring Boot

**NOTE:** The instructions below for building a Spring Boot API are the same as the ones in [Bootiful Development with Spring Boot and Angular](/blog/2017/04/26/bootiful-development-with-spring-boot-and-angular). I've copied them below for your convenience.

To get started with Spring Boot, navigate to [start.spring.io](https://start.spring.io). In the “Search for dependencies" field, select the following:

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

Open the “server" project in your favorite IDE and run `DemoApplication` or start it from the command line using `./mvnw spring-boot:run`.

Create a `com.example.demo.beer` package and a `Beer.java` file in it. This will be the entity that holds your data.

```java
package com.example.demo.beer;

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
package com.example.demo.beer;

import org.springframework.data.jpa.repository.JpaRepository;

interface BeerRepository extends JpaRepository<Beer, Long> {
}
```

Add a `BeerCommandLineRunner` that uses this repository and creates a default set of data.

```java
package com.example.demo.beer;

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

Rebuild your project and you should see a list of beers printed in your terminal.

{% img blog/react-spring-boot/beers-in-terminal.png alt:"Beers printed in terminal" width:"800" %}{: .center-image }

Add a [`@RepositoryRestResource`](http://docs.spring.io/spring-data/rest/docs/current/api/org/springframework/data/rest/core/annotation/RepositoryRestResource.html) annotation to `BeerRepository` to expose all its CRUD operations as REST endpoints.

```java
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
interface BeerRepository extends JpaRepository<Beer, Long> {
}
```

Add a `BeerController` class to create an endpoint that filters out less-than-great beers.

```java
package com.example.demo.beer;

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

{% img blog/react-spring-boot/good-beers-json.png alt:"Good Beers JSON" width:"600" %}{: .center-image }

You should also see this same result in your terminal window when using HTTPie.

```bash
http localhost:8080/good-beers
```

## Create a Project with Create React App

Creating an API seems to be the easy part these days, thanks in large part to Spring Boot. In this section, I hope to show
you that creating a UI with React is pretty easy too. If you follow the steps below, you'll create a new React app, fetch
beer names and images from APIs, and create components to display the data.

To create a React project, make sure you have [Node.js](https://nodejs.org/), [Create React App](https://github.com/facebookincubator/create-react-app), and [Yarn](https://yarnpkg.com/) installed.

```bash
npm install -g create-react-app@1.4.3
```

From a terminal window, cd into the root of the `spring-boot-react-example` directory and run the following command. This will create a new React application with TypeScript support.

```bash
create-react-app client --scripts-version=react-scripts-ts
```

This will create a new `client` directory and run `yarn` to install all the necessary dependencies. To verify everything works, cd into the `client` directory and run `yarn start`. If everything works, you should see the following in your browser.

{% img blog/react-spring-boot/react-welcome.png alt:"Welcome to React" width:"800" %}{: .center-image }

Thus far, you’ve created a `good-beers` API and a React app, but you haven’t created the UI to display the list of beers from your API. To do this, open `client/src/App.tsx` and add a `componentDidMount()` method.

```typescript
componentDidMount() {
  this.setState({isLoading: true});

  fetch('http://localhost:8080/good-beers')
    .then(response => response.json())
    .then(data => this.setState({beers: data, isLoading: false}));
}
```

This method is invoked as part of [React's component lifecycle](https://reactjs.org/docs/react-component.html#the-component-lifecycle). The code above uses [`fetch`](https://fetch.spec.whatwg.org/),
a modern replacement for `XMLHttpRequest`. It's [supported in most browsers according to caniuse.com](https://caniuse.com/#search=fetch).

You can see that it sets the `beers` state with the response data. In order to initialize the state for this component, you need to override the constructor.

```typescript
constructor(props: any) {
  super(props);

  this.state = {
    beers: [],
    isLoading: false
  };
}
```

For this to work, you need to add parameter types to the class signature. The code below shows what the top of your `App` class should look like at this point.

```typescript
class App extends React.Component<{}, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      beers: [],
      isLoading: false
    };
  }
  // componentDidMount() and render()
}
```

Change the `render()` method to have the following JSX. [JSX](https://facebook.github.io/jsx/) is Facebook's XML-like syntax that renders HTML via JavaScript.

```typescript jsx
render() {
  const {beers, isLoading} = this.state;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to React</h2>
      </div>
      <div>
        <h2>Beer List</h2>
        {beers.map((beer: any) =>
          <div key={beer.id}>
            {beer.name}
          </div>
        )}
      </div>
    </div>
  );
}
```

If you look at `http://localhost:3000` in your browser, you'll see a "Loading..." message. If you look in your browser's console, you'll likely see an issue about CORS.

<pre style="color: red">
Failed to load http://localhost:8080/good-beers: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:4200' is therefore not allowed access.
</pre>

To fix this issue, you’ll need to configure Spring Boot to allow cross-domain access from `http://localhost:3000`.

### Configure CORS for Spring Boot

In the server project, open `server/src/main/java/com/example/demo/beer/BeerController.java` and add a `@CrossOrigin` annotation to enable cross-origin resource sharing (CORS) from the client (`http://localhost:4200`).

```java
import org.springframework.web.bind.annotation.CrossOrigin;
...
    @GetMapping("/good-beers")
    @CrossOrigin(origins = "http://localhost:3000")
    public Collection<Beer> goodBeers() {
```

After making these changes, restart the server, refresh your browser, and you should be able to see a list of beers from your Spring Boot API.

{% img blog/react-spring-boot/react-beer-list.png alt:"Beer List in Angular" width:"800" %}{: .center-image } 

### Create a BeerList Component

To make this application easier to maintain, move the beer list fetching and rendering from `App.tsx` to its own `BeerList` component. Create `src/BeerList.tsx` and populate it with the code from `App.tsx`.

```typescript tsx
import * as React from 'react';

class BeerList extends React.Component<{}, any> {
  constructor(props: any) {
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
        {beers.map((beer: any) =>
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

```typescript jsx
import * as React from 'react';
import './App.css';
import BeerList from './BeerList';

const logo = require('./logo.svg');

class App extends React.Component<{}, any> {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h2>Welcome to React</h2>
        </div>
        <BeerList/>
      </div>
    );
  }
}

export default App;
```

### Create a GiphyImage Component

To make it look a little better, add a [GIPHY](http://giphy.com) component to fetch images based on the beer’s name. Create `client/src/GiphyImage.tsx` and place the following code inside it.

```typescript jsx
import * as React from 'react';

interface GiphyImageProps {
  name: string;
}

class GiphyImage extends React.Component<GiphyImageProps, any> {
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

```typescript jsx
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
      {beers.map((beer: any) =>
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

You’ve just created a React app that talks to a Spring Boot API using cross-domain requests. Congratulations!

## Add PWA Support

Create React App has support for progressive web applications (PWAs) out-of-the-box. To learn how its integrated, open `client/README.md` and search for "Making a Progressive Web App".

To see how it works, run `yarn build` in the `client` directory. After this command completes,
you'll see a message like the following.

```
The build folder is ready to be deployed.
You may serve it with a static server:

  yarn global add serve
  serve -s build
```

Run the suggested commands and you should be able to open your browser to view `http://localhost:5000`. This will result in a CORS error, so crack open `BeerController.java` again and adjust it's allowed origins to allow port 5000.

```typescript jsx
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5000"})
```

Restart your server and `http://localhost:5000` should load with beer names and images.

I ran a [Lighthouse](https://developers.google.com/web/tools/lighthouse/) audit in Chrome and found that this app only scores a 73/100 at this point.

{% img blog/react-spring-boot/lighthouse-first.png alt:"Lighthouse Score from first audit" width:"800" %}{: .center-image } 

You'll notice in the screenshot above that "Manifest does not have icons at least 512px". This one sounds easy enough to fix. Download the 512 pixel free beer icon from [this page](https://www.flaticon.com/free-icon/beer_168557#term=beer&page=1&position=29). 

**NOTE:** This icon is made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>. It's licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>

Copy the downloaded `beer.png` to `client/public`. Modify `client/public/manifest.json` to have a name specific to this app, and to add a 512 pixel icon.

```json
{
  "short_name": "Beer",
  "name": "Good Beer",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "192x192",
      "type": "image/png"
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

After making this change, I was able to achieve an 82 Lighthouse score for PWA. The biggest complaint from this report was that I wasn't using HTTPS. To see how the app would score when it used HTTPS, I deployed it to [Pivotal Cloud Foundry](https://pivotal.io/platform) and [Heroku](https://www.heroku.com/). I was pumped to discover it scored 💯 on both platforms.

{% img blog/react-spring-boot/lighthouse-cloudfoundry.png alt:"Lighthouse on Cloud Foundry" width:"800" %}{: .center-image } 

{% img blog/react-spring-boot/lighthouse-heroku.png alt:"Lighthouse on Heroku" width:"800" %}{: .center-image } 

To read the scripts I used to deploy everything, see [`cloudfoundry.sh`]() and [`heroku.sh`]() in this article's companion GitHub repository. I owe a big thanks to [@starbuxman](https://twitter.com/starbuxman) and [@codefinger](https://twitter.com/codefinger) for their help creating them!

## Add Authentication with Okta

You might be thinking, "this is pretty cool". I agree, it's easy to see why people fall in love with React. There's another tool you might fall in love with after you've tried it: Authentication with Okta! Why Okta? Because you can get [7,000 active monthly users for free](https://developer.okta.com/pricing/)! It's a worth a try, especially when you see how easy it is to add Okta Auth to Spring Boot and React.

### Okta Spring Boot Starter

To lock down the backend, you can use [Okta's Spring Boot Starter](https://github.com/okta/okta-spring-boot). To integrate this starter, add the following dependency to `server/pom.xml`:

```xml
<dependency>
	<groupId>com.okta.spring</groupId>
	<artifactId>okta-spring-boot-starter</artifactId>
	<version>0.2.0</version>
</dependency>
```

You'll also need to add a `<dependencyManagement>` section to upgrade Spring Security's OAuth support.

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.security.oauth</groupId>
            <artifactId>spring-security-oauth2</artifactId>
            <version>2.2.0.RELEASE</version>
        </dependency>
    </dependencies>
</dependencyManagement>

```

**NOTE:** The Okta Spring Boot Starter 0.2.0 [doesn't work with Spring Boot's DevTools](https://github.com/okta/okta-spring-boot/issues/22). This tutorial doesn't use DevTools, but I think it's important to make you aware in case you try to add it.


### Clean Up Those TypeScript Warnings

## Learn More About Spring Boot and React

Angular vs React from Devoxx + YouTube

Fave Learning Video

https://www.robinwieruch.de/react-fetching-data/

https://developer.okta.com/blog/2017/03/30/react-okta-sign-in-widget

https://developer.okta.com/blog/2017/10/19/build-a-preact-app-with-authentication

https://developer.okta.com/code/react/okta_react.html

