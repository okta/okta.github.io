---
layout: blog_post
title: "Build a Basic CRUD App with React and Spring Boot 2.0"
author: mraible
description: "React is one of the most popular JavaScript frameworks, and Spring Boot is wildly popular in the Java ecosystem. This article shows you how to use them in the same app, and secure it all with Okta."
tags: [authentication, spring boot, spring boot 2.0, react, reactjs, oidc]
tweets:
- "React + Spring Boot makes for a nice development experience. Learn how to make them work together with OIDC authentication →"
- "Spring Boot with @java + React with @javascript == 💙. Learn how to build a @springboot + @reactjs CRUD app today!"
---

React was designed to make it painless to create interactive UIs. It's state management is efficient and only updates components when your data changes. Component logic is written in JavaScript, which means you can keep state out of the DOM and create components that are encapsulated.

Developers like CRUD (create, read, update, and delete) apps because they show a lot of the base functionality that you need when creating an app. Once you have the basics of CRUD figured out, most of the client-server plumbing is finished, and you can move on to implementing the necessary business logic.

Today, I'll show you how to create a basic CRUD app with Spring Boot in React. You might remember a similar article I wrote for Angular last year: [Build a Basic CRUD App with Angular 5.0 and Spring Boot 2.0](/blog/2017/12/04/basic-crud-angular-and-spring-boot). That tutorial uses OAuth 2.0's implicit flow and our [Okta Angular SDK](https://www.npmjs.com/package/@okta/okta-angular). In this tutorial, I'll be using OAuth's Authorization Code flow and packaging the React app in the Spring Boot app for production. At the same time, I'll show you how to keep React's productive workflow for developing locally.

You will need [Java 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html), [Node.js 8](https://nodejs.org/), and [Yarn](https://yarnpkg.com/en/docs/install) installed to complete this tutorial. You can use npm instead of Yarn, but you'll need to translate the Yarn syntax to npm.

## Create an API App with Spring Boot 2.0
 
I'm a frequent speaker at conferences and user groups around the world. My favorite user groups to speak at are Java User Groups (JUGs). I've been a Java developer for almost 20 years, and I love the Java community. One of my good friends, James Ward, said doing a JUG Tour was one of his favorite developer advocate activities back in the day. I recently took his advice and traded overseas conferences for JUG meetups in the US. 
 
Why am I telling you this? Because I thought it'd be fun to create a "JUG Tours" app today that allows you to create/edit/delete JUGs, as well as view upcoming events.
 
To begin, navigate to [start.spring.io](https://start.spring.io) and make the following selections:
 
 * **Group:** `com.okta.developer`
 * **Artifact:** `jugtours`
 * **Dependencies**: `JPA`, `H2`, `Web`, `Lombok`
 
{% img blog/spring-boot-2-react/spring-initializr.png alt:"Spring Initializr" width:"800" %}{: .center-image }
 
Click **Generate Project**, expand `jugtours.zip` after downloading, and open the project in your favorite IDE. 
 
### Add a JPA Domain Model
 
The first thing you'll need to do is to create a domain model that'll hold your data. At a high level, there's a `Group` that represents the JUG, an `Event` that has a many-to-one relationship with `Group`, and a `User` that has a one-to-many relationship with `Group`.
 
Create a `src/main/java/com/okta/developer/jugtours/model` directory and a `Group.java` class in it.
 
```java
package com.okta.developer.jugtours.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import javax.persistence.*;
import java.util.Set;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "user_group")
public class Group {

    @Id
    @GeneratedValue
    private Long id;
    @NonNull
    private String name;
    private String address;
    private String city;
    private String stateOrProvince;
    private String country;
    private String postalCode;
    @ManyToOne(cascade=CascadeType.PERSIST)
    private User user;

    @OneToMany(fetch = FetchType.EAGER, cascade=CascadeType.ALL)
    private Set<Event> events;
}
```

Create an `Event.java` class in the same package.

```java
package com.okta.developer.jugtours.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import java.time.Instant;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Event {

    @Id
    @GeneratedValue
    private Long id;
    private Instant date;
    private String title;
    private String description;
    @ManyToMany
    private Set<User> attendees;
}
```

And, a `User.java` class.

```java
package com.okta.developer.jugtours.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class User {

    @Id
    private String id;
    private String name;
    private String email;
}
```
 
Create a `GroupRepository.java` to manage the group entity.

```java
package com.okta.developer.jugtours.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupRepository extends JpaRepository<Group, Long> {
    Group findByName(String name);
    List<Group> findAllByUserId(String id);
}
```

To load some default data, create an `Initializer.java` class in the `com.okta.developer.jugtours` package.

```java
package com.okta.developer.jugtours;

import com.okta.developer.jugtours.model.Event;
import com.okta.developer.jugtours.model.Group;
import com.okta.developer.jugtours.model.GroupRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Collections;
import java.util.stream.Stream;

@Component
class Initializer implements CommandLineRunner {

    private final GroupRepository repository;

    public Initializer(GroupRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... strings) {
        Stream.of("Denver JUG", "Utah JUG", "Seattle JUG",
                "Richmond JUG").forEach(name ->
                repository.save(new Group(name))
        );

        Group djug = repository.findByName("Denver JUG");
        Event e = Event.builder().title("Full Stack Reactive")
                .description("Reactive with Spring Boot + React")
                .date(Instant.parse("2018-12-12T18:00:00.000Z"))
                .build();
        djug.setEvents(Collections.singleton(e));
        repository.save(djug);

        repository.findAll().forEach(System.out::println);
    }
}
```

If you start your app (using `./mvnw spring-boot:run`) after adding this code, you'll see the list of groups and events displayed in your console.

```
Group(id=1, name=Denver JUG, address=null, city=null, stateOrProvince=null, country=null, postalCode=null, user=null, events=[Event(id=5, date=2018-12-12T18:00:00Z, title=Full Stack Reactive, description=Reactive with Spring Boot + React, attendees=[])])
Group(id=2, name=Utah JUG, address=null, city=null, stateOrProvince=null, country=null, postalCode=null, user=null, events=[])
Group(id=3, name=Seattle JUG, address=null, city=null, stateOrProvince=null, country=null, postalCode=null, user=null, events=[])
Group(id=4, name=Richmond JUG, address=null, city=null, stateOrProvince=null, country=null, postalCode=null, user=null, events=[])
```

Add a `GroupController.java` class (in `src/main/java/.../jugtours/web/GroupController.java`) that allows you to CRUD groups.

```java
package com.okta.developer.jugtours.web;

import com.okta.developer.jugtours.model.Group;
import com.okta.developer.jugtours.model.GroupRepository;
import com.okta.developer.jugtours.model.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collection;
import java.util.Optional;

@RestController
@RequestMapping("/api")
class GroupController {

    private final Logger log = LoggerFactory.getLogger(GroupController.class);
    private GroupRepository groupRepository;

    public GroupController(GroupRepository groupRepository, UserRepository userRepository) {
        this.groupRepository = groupRepository;
    }

    @GetMapping("/groups")
    Collection<Group> groups() {
        return groupRepository.findAll();
    }

    @GetMapping("/group/{id}")
    ResponseEntity<?> getGroup(@PathVariable Long id) {
        Optional<Group> group = groupRepository.findById(id);
        return group.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/group")
    ResponseEntity<Group> createGroup(@Valid @RequestBody Group group) throws URISyntaxException {
        log.info("Request to create group: {}", group);
        Group result = groupRepository.save(group);
        return ResponseEntity.created(new URI("/api/group/" + result.getId()))
                .body(result);
    }

    @PutMapping("/group/{id}")
    ResponseEntity<Group> updateGroup(@PathVariable Long id, @Valid @RequestBody Group group) {
        group.setId(id);
        log.info("Request to update group: {}", group);
        Group result = groupRepository.save(group);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/group/{id}")
    public ResponseEntity<?> deleteGroup(@PathVariable Long id) {
        log.info("Request to delete group: {}", id);
        groupRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
```

If you restart your server app and hit `localhost:8080/api/groups` with your browser, or a command-line client, you should see the list of groups.

You can create, read, update, and delete groups with the following [HTTPie](https://httpie.org) commands.

```bash
http POST :8080/api/group name='Dublin JUG' city=Dublin country=Ireland
http :8080/api/group/6
http PUT :8080/api/group/6 name='Dublin JUG' city=Dublin country=Ireland address=Downtown
http DELETE :8080/api/group/6
```

## Create a React UI with Create React App

Create React App is a command-line utility that generates React projects for you. It's a convenient tool because it also offers commands that will build and optimize your project for production. It uses webpack under the covers for building. If you want to learn more about webpack, I recommend [webpack.academy](https://webpack.academy).

Install the latest version of Create React App, which is version 1.5.2.

```bash
yarn add global create-react-app@1.5.2
```

Create a new project in the `jugtours` directory you created.

```bash
create-react-app app
```

After the app is created, navigate into its directory and install [Bootstrap](https://getbootstrap.com/), cookie support for React, React Router, and [Reactstrap](https://reactstrap.github.io/).

```bash
cd app
yarn add bootstrap@4.1.2 react-cookie@2.2.0 react-router-dom@4.3.1 reactstrap@6.3.0
```

You'll use Bootstrap's CSS and Reactstrap's components to make the UI look better, especially on mobile phones. If you'd like to learn more about Reactstrap, see <https://reactstrap.github.io/>. It has extensive documentation on its various components and how to use them.
 
## Call Your Spring Boot API and Display the Results

Modify `app/src/App.js` to use the following code that calls `/api/groups` and display the list in the UI.

```jsx
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    isLoading: true,
    groups: []
  };

  async componentDidMount() {
    const response = await fetch('/api/groups');
    const body = await response.json();
    this.setState({ groups: body, isLoading: false });
  }

  render() {
    const {groups, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-intro">
          <h2>JUG List</h2>
          {groups.map(group =>
            <div key={group.id}>
              {group.name}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
```

Run `yarn start` in your `app` directory and you should see the list of default groups.

{% img blog/spring-boot-2-react/jug-list.png alt:"JUG List" width:"800" %}{: .center-image }

## Build a React GroupList Component

React is all about components, and you don't want to render everything in your main `App`, so create `app/src/GroupList.js` and populate it with the following JavaScript.

{% raw %}
```jsx
import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class GroupList extends Component {

  constructor(props) {
    super(props);
    this.state = {groups: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch('api/groups')
      .then(response => response.json())
      .then(data => this.setState({groups: data, isLoading: false}));
  }

  async remove(id) {
    await fetch(`/api/group/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedGroups = [...this.state.groups].filter(i => i.id !== id);
      this.setState({groups: updatedGroups});
    });
  }

  render() {
    const {groups, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const groupList = groups.map(group => {
      const address = `${group.address || ''} ${group.city || ''} ${group.stateOrProvince || ''}`;
      return <tr key={group.id}>
        <td style={{whiteSpace: 'nowrap'}}>{group.name}</td>
        <td>{address}</td>
        <td>{group.events.map(event => {
          return <div key={event.id}>{new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: '2-digit'
          }).format(new Date(event.date))}: {event.title}</div>
        })}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/groups/" + group.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(group.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/groups/new">Add Group</Button>
          </div>
          <h3>My JUG Tour</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="20%">Name</th>
              <th width="20%">Location</th>
              <th>Events</th>
              <th width="10%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {groupList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default GroupList;
```
{% endraw %}

Create `AppNavbar.js` in the same directory to establish a common UI feature between components.

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
    return <Navbar color="dark" dark expand="md">
      <NavbarBrand tag={Link} to="/">Home</NavbarBrand>
      <NavbarToggler onClick={this.toggle}/>
      <Collapse isOpen={this.state.isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink
              href="https://twitter.com/oktadev">@oktadev</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="https://github.com/oktadeveloper/okta-spring-boot-react-crud-example">GitHub</NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>;
  }
}
```

Create `app/src/Home.js` to serve as the landing page for your app.

```jsx
import React, { Component } from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';

class Home extends Component {
  render() {
    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <Button color="link"><Link to="/groups">Manage JUG Tour</Link></Button>
        </Container>
      </div>
    );
  }
}

export default Home;
```

And, change `app/src/App.js` to use React Router to navigate between components.

```jsx
import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import GroupList from './GroupList';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' exact={true} component={Home}/>
          <Route path='/groups' exact={true} component={GroupList}/>
        </Switch>
      </Router>
    )
  }
}

export default App;
```

Your React app should update itself as you make changes and you should see a screen like the following at `http://localhost:3000`.

{% img blog/spring-boot-2-react/home-with-link.png alt:"Home screen with Manage JUG Tour link" width:"800" %}{: .center-image }

Click on **Manage JUG Tour** and you should see a list of the default groups.

{% img blog/spring-boot-2-react/group-list.png alt:"Group List screen" width:"800" %}{: .center-image }

It's great that you can see your Spring Boot's data in your React app, but it's no fun if you can't edit it!
 
## Add a React GroupEdit Component

Create `app/src/GroupEdit.js` and use its `componentDidMount()` to fetch the group record with the id from the URL.

```jsx
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';

class GroupEdit extends Component {

  emptyItem = {
    name: '',
    address: '',
    city: '',
    stateOrProvince: '',
    country: '',
    postalCode: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      const group = await (await fetch(`/api/group/${this.props.match.params.id}`)).json();
      this.setState({item: group});
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    await fetch('/api/group', {
      method: (item.id) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });
    this.props.history.push('/groups');
  }

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Group' : 'Add Group'}</h2>;

    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="text" name="name" id="name" value={item.name || ''}
                   onChange={this.handleChange} autoComplete="name"/>
          </FormGroup>
          <FormGroup>
            <Label for="address">Address</Label>
            <Input type="text" name="address" id="address" value={item.address || ''}
                   onChange={this.handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label for="city">City</Label>
            <Input type="text" name="city" id="city" value={item.city || ''}
                   onChange={this.handleChange} autoComplete="address-level1"/>
          </FormGroup>
          <div className="row">
            <FormGroup className="col-md-4 mb-3">
              <Label for="stateOrProvince">State/Province</Label>
              <Input type="text" name="stateOrProvince" id="stateOrProvince" value={item.stateOrProvince || ''}
                     onChange={this.handleChange} autoComplete="address-level1"/>
            </FormGroup>
            <FormGroup className="col-md-5 mb-3">
              <Label for="country">Country</Label>
              <Input type="text" name="country" id="country" value={item.country || ''}
                     onChange={this.handleChange} autoComplete="address-level1"/>
            </FormGroup>
            <FormGroup className="col-md-3 mb-3">
              <Label for="country">Postal Code</Label>
              <Input type="text" name="postalCode" id="postalCode" value={item.postalCode || ''}
                     onChange={this.handleChange} autoComplete="address-level1"/>
            </FormGroup>
          </div>
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to="/groups">Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(GroupEdit);
```

The `withRouter()` higher-order component is needed at the bottom to expose `this.props.history` so you can navigate back to the `GroupList` after adding or saving a group.

Modify `app/src/App.js` to import `GroupEdit` and specify a path to it.

```jsx
import GroupEdit from './GroupEdit';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          ...
          <Route path='/groups/:id' component={GroupEdit}/>
        </Switch>
      </Router>
    )
  }
}
```

Now you should be able to add and edit groups!

{% img blog/spring-boot-2-react/add-group.png alt:"Add Group screen" width:"800" %}{: .center-image }

{% img blog/spring-boot-2-react/edit-group.png alt:"Edit Group screen" width:"800" %}{: .center-image }
 
## Add Authentication with Okta
 
### Spring Security + OIDC
 
### Create an OIDC App in Okta

## Spring Security's OAuth vs. OIDC Support

While working on this post, I collaborated with [Rob Winch](https://twitter.com/rob_winch) (Spring Security Lead) to make sure I used Spring Security efficiently. I started out using Spring Security's OAuth 2.0 support and its `@EnableOAuth2Sso` annotation. Rob encouraged me to use Spring Security's OIDC support instead and was instrumental in making everything work. I thought it might be useful to include a short Q&A with Rob about Spring Security.

**1. Why is it better to use Spring Security's OIDC support, rather than `@EnableOAuth2Sso`?** 

**2. You're moving SAML and OAuth support back into Spring Security's core, rather than having them as separate projects. Why?**

**3. What is the most challenging thing about maintaining an open source project like Spring Security?**

**4. What makes you smile about open source?**
 
## Learn More about Spring Boot and React

I hope you've enjoyed this tutorial on how to do CRUD with React, Spring Boot, and Spring Security. You can see that Spring Security's OIDC support is pretty powerful, and doesn't require a whole lot of configuration. Adding CSRF protection and packaging your Spring Boot + React app as a single artifact is pretty cool too!

You can find the example created in this tutorial on GitHub at https://github.com/oktadeveloper/okta-spring-boot-react-crud-example. 

We've written a number of Spring Boot and React tutorials in the past, check them out if you're interested!

* [Bootiful Development with Spring Boot and React](/blog/2017/12/06/bootiful-development-with-spring-boot-and-react)
* [Build a React Native Application and Authenticate with OAuth 2.0](/blog/2018/03/16/build-react-native-authentication-oauth-2)
* [Add CI/CD to Your Spring Boot App with Jenkins X and Kubernetes](/blog/2018/07/11/ci-cd-spring-boot-jenkins-x-kubernetes)
* [Build a React Application with User Authentication in 15 Minutes](/blog/2017/03/30/react-okta-sign-in-widget)

If you have any questions, please don't hesitate to leave a comment below, or ask us on our [Okta Developer Forums](https://devforum.okta.com/). Follow us [on Twitter](https://twitter.com/oktadev) if you want to see more tutorials like this one.