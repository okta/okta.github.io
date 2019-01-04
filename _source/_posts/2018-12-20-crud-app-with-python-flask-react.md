---
layout: blog_post
title: "Build a Simple CRUD App with Python, Flask, and React"
author: kcorreia
description: "Create a CRUD (create, read, update, and delete) application using Python, Flask, and React."
tags: [python, flask, react, crud, tutorial]
tweets:
- "Build a Python + Flask + React app!"
- "Tutorial - #Python & @ReactJS example application"
- "Full stack CRUD application tutorial with #Python and @ReactJS"
image: blog/featured/okta-react-skew.jpg
---

Today's modern web applications are often built with a server-side language serving data via an API and a front-end javascript framework that presents the data in an easy to use manner to the end user. Python is a dynamic language widely adopted by companies and developers. The language states on its core values that software should simple, readable making developers more productive and happier. You'll also use Flask to help you to quickly put together a ReST API. React is a declarative, efficient, and flexible JavaScript library developed at Facebook for building user interfaces. It facilitates the creation of complex, interactive, and stateful UIs from small and isolated pieces of code called components.

In this tutorial you are going to build a JavaScript application using React in the front-end and we are also going to build a ReST API written in Python which is going to persist. Our app will be a Github open source bookmark project (a.k.a `kudo`).

To complete this tutorial, there are few things you will need:

* macOS or Linux operating system
* Python 3 installed
* MongoDB or the Docker toolbox installed
* A free-forever Okta account

You will start by creating the back-end.

## Create a ReST API with Python
Make sure you have Python 3 installed. Check the version of Python installed by running the following command:

```bash
python --version
```

To install Python 3 you can use `pyenv`. 

If you are using macOS, you can install it using Homebrew:

```bash
brew update
brew install pyenv
```

On a Linux system using the bash shell:

```bash
curl -L https://github.com/pyenv/pyenv-installer/raw/master/bin/pyenv-installer | bash
```

Once installed, you can run the following commands to install Python 3.

```bash
pyenv install 3.6.3
pyenv global 3.6.3
```

Your ReST API will use some third-party code (libraries) to help you (e.g. to connect to a database, to create schemas for your models, and validate whether the incoming requests are authenticated or not). Python has a powerful tool to manage dependencies called `pipenv`. To install `pipenv` on your machine follow these steps:

On macOS:

```bash
brew install pipenv
```


```bash
pip install --user pipenv
```

With `pipenv` installed, create a directory for your backend code:

```bash
mkdir kudos_oss && cd kudos_oss
```

The command above will create a Python 3 virtual environment. Now you can install Flask by running the following command:

```bash
pipenv install flask==1.0.2
```

Python 3 provides some cool features like `absolute_import` and  `print_function` that you will use in this tutorial. To import them run the following commands:

```bash
touch __init__.py
touch __main__.py
```

And copy and paste the following content into the `__main__.py` file:

```python
from __future__ import absolute_import, print_function
```

Your backend will need to implement the following user stories:

- As an authenticated user I want to favorite an github open source project
- As an authenticated user I want to unfavorite an github open source project
- As an authenticated user I want to list all bookmarked github open source projects I've previously favorited

A normal ReST API will expose endpoints so clients can `create`, `update`, `delete`, `read` and `list all` resources. By end of this section your back-end application will be capable to handle the following HTTP calls:

```
# For the authenticated user, fetches all favorited github open source projects
GET /kudos

# Favorite a github open source project for the authenticated user
POST /kudos

# Unfavorite a favorited github open source project
DELETE /kudos/:id
```

### Define the Python Model Schemas
Your ReST API will have two core schemas, they are `GithubRepoSchema` and `KudoSchema`. `GithubRepoSchema` will represent a Github repository sent by the clients whereas `KudoSchema` will represent the data you are going to persist in the database. 

Go ahead and run the following commands:

```bash
mkdir -p app/kudo
touch app/kudo/schema.py
touch app/kudo/service.py
touch app/kudo/__init__.py
```

The above commands will create the `app` directory with another directory within it called `kudo`  then, the second command will create three files: `schema.py`, `service.py`,  and `__init__.py`. 

Copy and paste the content below within the `schema.py` file.

```python
from marshmallow import Schema, fields

class GithubRepoSchema(Schema):
  id = fields.Int(required=True)
  repo_name = fields.Str()
  full_name = fields.Str()
  language = fields.Str()
  description = fields.Str()
  repo_url = fields.URL()

class KudoSchema(GithubRepoSchema):
  user_id = fields.Email(required=True)
```

As you may have noticed, the schemas are inheriting from `Schema` a package from the [marshmallow  library] (https://marshmallow.readthedocs.io/en/3.0/), marshmallow is an ORM/ODM/framework-agnostic library for serializing/deserializing complex data types, such as objects, to and from native Python data types.

Install the `marshmallow` library running the following commands:

```bash
pipenv install marshmallow==2.16.3
```

### Python ReST API Persistence with MongoDB
Great! You have now your first files in place. The schemas were created to represent the incoming request data as well as the data your application persists in the MongoDB. In order to connect and to execute queries against the database, you are going to use a library created and maintained by MongoDB itself called [pymongo](https://api.mongodb.com/python/current/).

Install the `pymongo` library running the following commands:

```bash
pipenv install pymongo==3.7.2
```

You can either use MongoDB installed on your machine or you can use docker to spin up a MongoDB container. This tutorial assumes you have Docker and docker-compose installed.

`docker-compose` will manage the MongoDB container for you. 

Create `docker-compose.yml` 

```
touch docker-compose.yml
```

Paste the following content into it:

```yaml
version: '3'
services:
  mongo:
    image: mongo
    restart: always
    ports:
     - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: mongo_user
      MONGO_INITDB_ROOT_PASSWORD: mongo_secret
```

All you have to do now to spin up a MongoDB container is:

```bash
docker-compose up
```

With MongoDB up and running you are ready to work the `MongoRepository` class, it is always a good idea to have class with just a single responsibility, so the only point in your back-end application MongoDB is going to be explicitly dealt with is in the `MongoRepository`. 

Start by creating a directory where all persistence related files should sit, a suggestion would be: `repository`.

```bash
mkdir -p app/repository
```

Then, create the file that will hold the MongoRepository class:

```bash
touch app/repository/mongo.py
touch app/repository/__init__.py
```

With `pymongo` properly installed and MongoDB up and running, paste the following content into the `app/repository/mongo.py` file.

```python
import os
from pymongo import MongoClient

COLLECTION_NAME = 'kudos'

class MongoRepository(object):
 def __init__(self):
   mongo_url = os.environ.get('MONGO_URL')
   self.db = MongoClient(mongo_url).kudos

 def find_all(self, selector):
   return self.db.kudos.find(selector)
 
 def find(self, selector):
   return self.db.kudos.find_one(selector)
 
 def create(self, kudo):
   return self.db.kudos.insert_one(kudo)

 def update(self, selector, kudo):
   return self.db.kudos.replace_one(selector, kudo).modified_count
 
 def delete(self, selector):
   return self.db.kudos.delete_one(selector).deleted_count
```

As you can see the `MongoRepository` class is straightforward, it creates a database connection on its initialization then saves it to a instance variable to be use later by the methods: `find_all`, `find`, `create`, `update`,  and `delete`. Notice that all methods explicitly use the pymongo API. 

You might have noticed that the `MongoRepository` class reads a environment variable `MONGO_URL` . To export the environment variable, run:

```bash
export MONGO_URL=mongodb://mongo_user:mongo_secret@0.0.0.0:27017/
```

Since you might want to use other database in the future, it is a good idea to decouple your application from MongoDB. For the sake of simplicity you are going to create an abstract class to represent a `Repository`, this class should be the one used throughout your application.

Paste the following content into the `app/repository/__init__.py` file:

```python
class Repository(object):
 def __init__(self, adapter=None):
   self.client = adapter()

 def find_all(self, selector):
   return self.client.find_all(selector)
 
 def find(self, selector):
   return self.client.find(selector)
 
 def create(self, kudo):
   return self.client.create(kudo)
  
 def update(self, selector, kudo):
   return self.client.update(selector, kudo)
  
 def delete(self, selector):
   return self.client.delete(selector)
```

You might recall the user story that you're working on is that ann authenticated user should able to create, delete and list all favorited Github open-source projects. In order to get that done those `MongoRepository`'s methods will come handy.

You will soon implement the endpoints of your ReST API. First, you need to create a service class that knows how to translate the incoming request payload to our representation `KudoSchema` defined in the `app/kudo/schema.py`. The difference between the incoming request payload, represented by `GithubSchema`, and the object you persist in the database, represented by `KudoSchema` is: The first has an `user_Id` which determines who owns the object. 

Copy the content below to the `app/kudo/service.py` file:

```python
from ..repository import Repository
from ..repository.mongo import MongoRepository
from .schema import KudoSchema

class Service(object):
 def __init__(self, user_id, repo_client=Repository(adapter=MongoRepository)):
   self.repo_client = repo_client
   self.user_id = user_id

   if not user_id:
     raise Exception("user id not provided")

 def find_all_kudos(self):
   kudos  = self.repo_client.find_all({'user_id': self.user_id})
   return [self.dump(kudo) for kudo in kudos]

 def find_kudo(self, repo_id):
   kudo = self.repo_client.find({'user_id': self.user_id, 'repo_id': repo_id})
   return self.dump(kudo)

 def create_kudo_for(self, githubRepo):
   self.repo_client.create(self.prepare_kudo(githubRepo))
   return self.dump(githubRepo.data)

 def update_kudo_with(self, repo_id, githubRepo):
   records_affected = self.repo_client.update({'user_id': self.user_id, 'repo_id': repo_id}, self.prepare_kudo(githubRepo))
   return records_affected > 0

 def delete_kudo_for(self, repo_id):
   records_affected = self.repo_client.delete({'user_id': self.user_id, 'repo_id': repo_id})
   return records_affected > 0

 def dump(self, data):
   return KudoSchema(exclude=['_id']).dump(data).data

 def prepare_kudo(self, githubRepo):
   data = githubRepo.data
   data['user_id'] = self.user_id
   return data
```

Notice that your constructor `__init__` receives as parameters the `user_id` and the `repo_client` which are used in all operations in this service. That's the beauty of having a class to represent a repository, As far as the service is concerned, it does not care if the `repo_client` is persisting the data in a MongoDB, PostgreSQL, or sending the data over the network to a third party service API, all it needs to know is the `repo_client` is a `Repository` instance that was configured with an adapter that implements methods like `create`, `delete` and `find_all`. 

### Define Your ReST API Middleware
At this point, you've covered 70% of the backend. You are ready to implement the HTTP endpoints and the JWT middleware which will secure your ReST API against unauthenticated requests.

You can start by creating a directory where HTTP related files should be placed.

```bash
mkdir -p app/http/api
```

Within this directory, you will have two files, `endpoints.py` and `middlewares.py`. To create them run the following commands:

```bash
touch app/http/api/__init__.py
touch app/http/api/endpoints.py
touch app/http/api/middlewares.py
```

The requests made to your ReST API are JWT-authenticated, which means you need to make sure that every single request carries a valid [json web token](https://stormpath.com/blog/beginners-guide-jwts-in-java/). [`pyjwt`](https://pyjwt.readthedocs.io/en/latest/) will take care of the validation for us. To install it run the following command:

```bash
pipenv install pyjwt==1.7.1
```

Now that you understand the role of the JWT middleware, you need to write it. Paste the following content to the `middlewares.py` file.

```python
from functools import wraps
from flask import request, g, abort
from jwt import decode, exceptions
import json

def login_required(f):
   @wraps(f)
   def wrap(*args, **kwargs):
       authorization = request.headers.get("authorization", None)
       if not authorization:
           return json.dumps({'error': 'no authorization token provied'}), 403, {'Content-type': 'application/json'}
      
       try:
           token = authorization.split(' ')[1]
           resp = decode(token, None, verify=False, algorithms=['HS256'])
           g.user = resp['sub']
       except exceptions.DecodeError as identifier:
           return json.dumps({'error': 'invalid authorization token'}), 403, {'Content-type': 'application/json'}
      
       return f(*args, **kwargs)
 
   return wrap
```

Flask provide a module called `g` which is a global context shared across the request life cycle. This middleware is checking whether or not the request is valid, if so, the middleware will extract the authenticated user details and persist them in the global context. 

### Define Your ReST API Endpoints
The HTTP handlers should be easy now, since you have already done the important pieces, it's just a matter of putting everything together. 

Since your end goal is to create a JavaScript application that will run on web browsers, you need to make sure that web browsers are happy when a preflight is performed, you can learn more about it [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). In order to implement CORS our your ReST API, you are going to install `flask_cors`.

```bash
pipenv install flask_cors==3.0.7
```

Next, implement your endpoints. Go ahead and paste the content above into the `app/http/api/endpoints.py` file.

```python
from .middlewares import login_required
from flask import Flask, json, g, request
from app.kudo.service import Service as Kudo
from app.kudo.schema import GithubRepoSchema
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/kudos", methods=["GET"])
@login_required
def index():
 return json_response(Kudo(g.user).find_all_kudos())


@app.route("/kudos", methods=["POST"])
@login_required
def create():
   github_repo = GithubRepoSchema().load(json.loads(request.data))
  
   if github_repo.errors:
     return json_response({'error': github_repo.errors}, 422)

   kudo = Kudo(g.user).create_kudo_for(github_repo)
   return json_response(kudo)


@app.route("/kudo/<int:repo_id>", methods=["GET"])
@login_required
def show(repo_id):
 kudo = Kudo(g.user).find_kudo(repo_id)

 if kudo:
   return json_response(kudo)
 else:
   return json_response({'error': 'kudo not found'}, 404)


@app.route("/kudo/<int:repo_id>", methods=["PUT"])
@login_required
def update(repo_id):
   github_repo = GithubRepoSchema().load(json.loads(request.data))
  
   if github_repo.errors:
     return json_response({'error': github_repo.errors}, 422)

   kudo_service = Kudo(g.user)
   if kudo_service.update_kudo_with(repo_id, github_repo):
     return json_response(github_repo.data)
   else:
     return json_response({'error': 'kudo not found'}, 404)

  
@app.route("/kudo/<int:repo_id>", methods=["DELETE"])
@login_required
def delete(repo_id):
 kudo_service = Kudo(g.user)
 if kudo_service.delete_kudo_for(repo_id):
   return json_response({})
 else:
   return json_response({'error': 'kudo not found'}, 404)


def json_response(payload, status=200):
 return (json.dumps(payload), status, {'content-type': 'application/json'})
```

Brilliant! It's all in place now! You should be able to run your ReST API with the command below:

```bash
FLASK_APP=$PWD/app/http/api/endpoints.py FLASK_ENV=development pipenv run python -m flask run --port 4433
```
## Create the React Client-Side App
To create your React Client-Side App, you will use Facebook's awesome `create-react-app` tool to bypass all the webpack hassle.

Installing `create-react-app` is simple. In this tutorial you will use `yarn`. Make sure you either have it installed or use the dependency manager of your preference.

To install `create-react-app`, run the command:

```bash
yarn global add create-react-app
```

You will need a directory to place your React application, go ahead and create the `web` directory within the `pkg/http` folder.

```bash
mkdir -p app/http/web
```

Now, create a React application:

```bash
cd app/http/web
create-react-app app
```

`create-react-app` might take a few minutes to generate the boilerplate application. Go to the recently created `app` directory and run `npm start`

By default, the React app generated by `create-react-app` will run listening on port 3000. Let's change it to listen to the port 8080. 

Change the `start` command on the file `app/http/web/app/package.json` to use the correct port.

{% img blog/python-react/start-script.png alt:"start script" width:"400" %}{: .center-image }

Then, run the React app.

```bash
cd app
npm start
```

Running `npm start` will start a web server listening to the port 8080. Open `http://localhost:8080/` in your browser. Your browser should load React and render the App.js component created automatically by `create-react-app`. 

{% img blog/python-react/react-app-first-run.png alt:"react app first run" width:"800" %}{: .center-image }

Your goal now is to use [Material Design](https://material.io/design/) to create a simple and beautiful UI. Thankfully, the React community has created https://material-ui.com/ which basically are the Material Design concepts translated to React components.

Run the following commands to install what you will need from Material Design.

```bash
yarn add @material-ui/core
yarn add @material-ui/icons
```

Great, now you have components like: Grid, Card, Icon, AppBar and many more ready to be imported and used. You will use them soon. Let's talk about protected routes.

### Add Authentication to Your React App with Okta
Writing secure user authentication and building login pages are easy to get wrong and can be the downfall of a new project. Okta makes it simple to implement all the user management functionality quickly and securely. Get started by signing up for a [free developer account](https://developer.okta.com/signup/) and creating an OpenID Connect application in Okta.

{% img blog/python-react/okta-developer-signup.png alt:"okta signup" width:"800" %}{: .center-image }

Once logged in, create a new application by clicking **Add Application**.

{% img blog/python-react/okta-add-application.png alt:"add application" width:"800" %}{: .center-image }

Select the **Single-Page App** platform option.

{% img blog/python-react/okta-choose-spa.png alt:"select spa app" width:"800" %}{: .center-image }

The default application settings should be the same as those pictured.

{% img blog/python-react/okta-spa-settings.png alt:"okta spa settings" width:"800" %}{: .center-image }

Great! With your OIDC application in place, you can now move forward and secure the routes that requires authentication.

### Create Your React Routes
[React Router](https://reacttraining.com/react-router/) is the most used library for routing URLs to React components. React Router has a collection a components that can be used to help the user to navigate in you application. 

Your React application will have two routes:

`/`  The root route does not require the user to be logged in, it actually is the landing page of your application. A user should be able to access this page in order to log in. You will use the [Okta React SDK](https://developer.okta.com/code/react/) to integrate react-router with Okta's OpenID Connect API.

`/home` The Home route will render most of the React components you application will have. It should implement the following user stories.

An authenticated user should be able to search through the Github API the open source projects of his/her preferences
An authenticated user should be able to bookmark open source projects that pleases him/her
An authenticated user should be able to see in different tabs his/her previously bookmarked open source projects and the search results

To install `react-router` run the command:

```bash
yarn add react-router-dom
```

And to install the Okta React SDK run the command:

```bash
yarn add @okta/okta-react
```

Now, go head and create your Main component.

```bash
mkdir  -p src/Main
```

Then, within the Main directory create a file named `index.js`.

```bash
touch src/Main/index.js
```

And paste the following content into the recently created file:

```javascript
import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import { Security, ImplicitCallback, SecureRoute } from '@okta/okta-react';

import Login from '../Login'
import Home from '../Home'

class Main extends Component {
 render() {
   return (
     <Router>
       <Security
         issuer={yourOktaDomain}
         client_id={yourClientId}
         redirect_uri={'http://localhost:8080/implicit/callback'}
         scope={['openid', 'profile', 'email']}>
        
         <Switch>
           <Route exact path="/" component={Login} />
           <Route path="/implicit/callback" component={ImplicitCallback} />
           <SecureRoute path="/home" component={Home} />
         </Switch>
       </Security>
     </Router>
   );
 }
}

export default Main;
```

Don't worry for now about the `Home` and `Login` components. You will work on them soon. Focus on the `Security`, `SecureRoute`, and `ImplicitCallback` components.

For routes to work properly in React, you need to wrap your whole application in a router. Similarly, to allow access to authentication anywhere in the app, you need to wrap the app in a `Security` component provided by Okta. Okta also needs access to the router, so the `Security` component should be nested inside the router. 

For routes that require authentication, you will define them using the `SecureRoute` Okta component. If an unauthenticated user tries to access `/home`, he/she will be redirect to the `/` root route.

The `ImplicitCallback` component is the route/URI destination to which the user will be redirected after Okta finishes the sign in process.

Go ahead and change the `src/index.js` to mount your Main component.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import Main from './Main';

const history = createBrowserHistory();

ReactDOM.render((
  <Router history={history}>
    <Main history={history} />
  </Router>
), document.getElementById('root'))
```

Your are now ready to create the Login component. As mentioned previously, this component will be accessible to all users (not only authenticated users). The main goal of the Login component is to authenticate the user.

Inside the directory `app`, you will find a directory called `src` which stands for source. Go ahead and create a directory named Login.

```bash
mkdir  -p src/Login
```

Then, within the Login directory create a file named `index.js`.

```bash
touch src/Login/index.js
```

And paste the following content into the file:

{% raw %}
```javascript
import React from 'react'
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom'
import { withAuth } from '@okta/okta-react';

class Login extends React.Component {
 constructor(props) {
   super(props);
   this.state = { authenticated: null };
   this.checkAuthentication = this.checkAuthentication.bind(this);
   this.login = this.login.bind(this);
 }

 async checkAuthentication() {
   const authenticated = await this.props.auth.isAuthenticated();
   if (authenticated !== this.state.authenticated) {
     this.setState({ authenticated });
   }
 }

 async componentDidMount() {
   this.checkAuthentication()
 }

 async login(e) {
   this.props.auth.login('/home');
 }

 render() {
   if (this.state.authenticated) {
     return <Redirect to='/home' />
   } else {
     return (
       <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
         <Button variant="contained" color="primary" onClick={this.login}>Login with Okta</Button>
       </div>
     )
   }
 }
}

export default withAuth(Login);
```
{% endraw %}

In order to see the Login page working, you need to create a placeholder for the Home component.

Go ahead and create a directory called `Home`.

```bash
mkdir -p src/Home
```

Then, within that directory, create a file named `index.js`.

```bash
touch src/Home/index.js
```

And paste the following content into it:

```javascript
import React from 'react'

const home = (props) => {
  return (
    <div>Home</div>
  )
};

export default home;
```

Now try running `npm start` and open `http://localhost:8080` in your browser. You should see the page below.

{% img blog/python-react/app-login-button.png alt:"login button" width:"800" %}{: .center-image }

In the Login component you are using the Okta React SDK to check whether the user has signed in.. If the user has already signed in, they should be redirected to the `/home` route, otherwise he/she could click `Login With Okta` to be redirected to Okta, authenticate and be sent to the the home page. 

{% img blog/python-react/app-login.png alt:"login page" width:"800" %}{: .center-image }

For now, the home page is blank, but eventually here's what you'll want the home page to look like:

{% img blog/python-react/app-home-page.png alt:"home page" width:"800" %}{: .center-image }

The Home component is composed of Material Design components like: `Tab`, `AppBar`,
`Button`, and `Icon` as well as a few custom components you will have to create. 

For your app, you need to list all the bookmarked open source projects as well as the search results. As you can see in the image above, the Home component is using a tabs to separate bookmarked open source projects from search results, the first tab is listing all the open source projects bookmarked by the user whereas the second tab will list the search results. 

You can create a component to represent an open source project in both "Kudos" and "Search Results" lists, that's the beauty of React components they are highly flexible and reusable. 

Go ahead and create a directory called `GithubRepo`

```bash
mkdir -p src/GithubRepo
```

Then, within that directory, create a file named `index.js`

```bash
touch src/GithubRepo/index.js
```

And paste the following content into it:

{% raw %}
```javascript
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';


const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  }
});

class GithubRepo extends React.Component {
  handleClick = (event) =>  {
    this.props.onKudo(this.props.repo)
  }


  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          title={this.props.repo.full_name}
        />
        <CardContent>
          <Typography component="p" style={{minHeight: '90px', overflow: 'scroll'}}>
            {this.props.repo.description}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton aria-label="Add to favorites" onClick={this.handleClick}>
            <FavoriteIcon color={this.props.isKudo ? "secondary" : "primary"} />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(GithubRepo);
```
{% endraw %}

The `GithubRepo` is a quite simple component, it receives two `props`: A `repo` object which holds a reference to a Github repository and an `isKudo` boolean flag that indicates whether the `repo` has been bookmarked or not.

The next component you will need is the `SearchBar`. It will have two responsibilities: log the user out and call React on every press of the `Enter` key in the search text field. 


Create a directory called `SearchBar`

```bash
mkdir -p src/SearchBar
```

Then, within the directory, create a file named `index.js`

```bash
touch src/SearchBar/index.js
```

Paste the following content:

{% raw %}
```javascript
import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { withAuth } from '@okta/okta-react';

const styles = theme => ({
  root: {
    width: '100%',
  },
  MuiAppBar: {
    alignItems: 'center'
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 400,
    },
  },
  toolbar: {
    alignItems: 'center'
  }
});

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  async logout(e) {
    e.preventDefault();
    this.props.auth.logout('/');
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" style={{alignItems: 'center'}}>
          <Toolbar>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search for your OOS project on Github + Press Enter"
                onKeyPress={this.props.onSearch}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
              />
            </div>
            <div className={classes.grow} />
            <Button onClick={this.logout} color="inherit">Logout</Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

SearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withAuth(SearchBar));
```
{% endraw %}

The `SearchBar` component receives one `prop` called `onSearch` which is the function that should be called in each `keyPress` event triggered in the search text input.

The `SearchBar` uses the `withAuth` helper provided by Okta React SDK which will inject the `auth` object in the `props` of the component. The `auth` object has a method called `logout` that will wipe out all user related data from the session. This is exactly what you want in order to log the user out. 

Now it's time to work on the `Home` component. One of the dependencies the component has is the [`react-swipeable-views`](https://github.com/oliviertassinari/react-swipeable-views) library which will add nice animations when the user changes tabs.

To install react-swipeable-views, run the command:

```bash
yarn add react-swipeable-views
```

You will also need to make HTTP calls to your Python ReST API as well as to the Github ReST API. The Github HTTP client will need to have a method or function to make a request to this URL: `https://api.github.com/search/repositories?q=USER-QUERY`. You are going to use the `q` query string to pass the term the user wants to query against Github's repositories. 

Create a file named `githubClient.js`.

```bash
touch src/githubClient.js
```

Paste the following content in it:

```javascript
export default {
 getJSONRepos(query) {
   return fetch('https://api.github.com/search/repositories?q=' + query).then(response => response.json());
 }
}
```

Now, you need to create an HTTP client to make HTTP calls to the Python ReST API you implemented in the first section of this tutorial. Since all the requests made to your Python ReST API require the user to be authenticated, you will need to set the `Authorization` HTTP Header with the `accessToken` provided by Okta.

Go ahead and create a file named `apiClient.js`

```bash
touch src/apiClient.js
```

And install [`axios`](https://github.com/axios/axios) to help you to perform HTTP calls to your flask API.

```bash
yarn add axios
```

Then, paste the following content:

{% raw %}
```javascript
import axios from 'axios';

const BASE_URI = 'http://localhost:4433';

const client = axios.create({
 baseURL: BASE_URI,
 json: true
});

class APIClient {
 constructor(accessToken) {
   this.accessToken = accessToken;
 }

 createKudo(repo) {
   return this.perform('post', '/kudos', repo);
 }

 deleteKudo(repo) {
   return this.perform('delete', `/kudos/${repo.id}`);
 }

 getKudos() {
   return this.perform('get', '/kudos');
 }

 async perform (method, resource, data) {
   return client({
     method,
     url: resource,
     data,
     headers: {
       Authorization: `Bearer ${this.accessToken}`
     }
   }).then(resp => {
     return resp.data ? resp.data : [];
   })
 }
}

export default APIClient;
```
{% endraw %}

Great! Your `APIClient`'s method `perform` is adding the user's `accessToken` to the `Authorization` HTTP header of  every request, which means, it's authenticating every request. When the server receives these HTTP requests your Okta middleware will be able to verify the token and to extract user details from it as well. 

Normally, you might create separate components for getting the user's bookmarks and for searching for github repos. For simplicity's sake you'll put them all in the `HomeComponent`

Paste the following content in the `src/Home/index.js` file.

{% raw %}
```js
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import { withAuth } from '@okta/okta-react';

import GithubRepo from "../GithubRepo"
import SearchBar from "../SearchBar"

import githubClient from '../githubClient'
import APIClient from '../apiClient'

const styles = theme => ({
 root: {
   flexGrow: 1,
   marginTop: 30
 },
 paper: {
   padding: theme.spacing.unit * 2,
   textAlign: 'center',
   color: theme.palette.text.secondary,
 },
});

class Home extends React.Component {
 state = {
   value: 0,
   repos: [],
   kudos: []
 };

 async componentDidMount() {
   const accessToken = await this.props.auth.getAccessToken()
   this.apiClient = new APIClient(accessToken);
   this.apiClient.getKudos().then((data) =>
     this.setState({...this.state, kudos: data})
   );
 }

 handleTabChange = (event, value) => {
   this.setState({ value });
 };

 handleTabChangeIndex = index => {
   this.setState({ value: index });
 };

 resetRepos = repos => this.setState({ ...this.state, repos })

 isKudo = repo => this.state.kudos.find(r => r.id == repo.id)
  onKudo = (repo) => {
   this.updateBackend(repo);
 }

 updateBackend = (repo) => {
   if (this.isKudo(repo)) {
     this.apiClient.deleteKudo(repo);
   } else {
     this.apiClient.createKudo(repo);
   }
   this.updateState(repo);
 }

 updateState = (repo) => {
   if (this.isKudo(repo)) {
     this.setState({
       ...this.state,
       kudos: this.state.kudos.filter( r => r.id !== repo.id )
     })
   } else {
     this.setState({
       ...this.state,
       kudos: [repo, ...this.state.kudos]
     })
   }
 }

 onSearch = (event) => {
   const target = event.target;
   if (!target.value || target.length < 3) { return }
   if (event.which !== 13) { return }

   githubClient
     .getJSONRepos(target.value)
     .then((response) => {
       target.blur();
       this.setState({ ...this.state, value: 1 });
       this.resetRepos(response.items);
     })
 }
  renderRepos = (repos) => {
   if (!repos) { return [] }
   return repos.map((repo) => {
     return (
       <Grid item xs={12} md={3} key={repo.id}>
         <GithubRepo onKudo={this.onKudo} isKudo={this.isKudo(repo)} repo={repo} />
       </Grid>
     );
   })
 }

 render() {
   return (
     <div className={styles.root}>
       <SearchBar auth={this.props.auth} onSearch={this.onSearch} />
        <Tabs
         value={this.state.value}
         onChange={this.handleTabChange}
         indicatorColor="primary"
         textColor="primary"
         fullWidth
       >
         <Tab label="Kudos" />
         <Tab label="Search" />
       </Tabs>
      
       <SwipeableViews
         axis={'x-reverse'}
         index={this.state.value}
         onChangeIndex={this.handleTabChangeIndex}
       >
         <Grid container spacing={16} style={{padding: '20px 0'}}>
           { this.renderRepos(this.state.kudos) }
         </Grid>
         <Grid container spacing={16} style={{padding: '20px 0'}}>
           { this.renderRepos(this.state.repos) }
         </Grid>
       </SwipeableViews>
     </div>
   );
 }
}

export default withStyles(styles)(withAuth(Home));
```
{% endraw %}

Now run `npm start` and open `http://localhost:8080` in your browser. You should be able to login, search for GitHub repos, and favorite a repo and see it in your Kudos list!

{% img blog/python-react/final-running-app.gif alt:"final running app" width:"800" %}{: .center-image }

If you want to see what the finished project looks like, you can see the [code on GitHub](https://github.com/oktadeveloper/python-flask-react-crud-example).

## Learn More About Python, Flask, and React
As we've seen, React is a powerful and straightforward JavaScript library with phenomenal adoption and community growth. In this tutorial, you learned to build a fully-functional, secure JavaScript with React, Python, and Flask. To learn more about React and other technologies check out these other great resources from the @oktadev team:

- [The Ultimate Guide to Progressive Web Applications](/blog/2017/07/20/the-ultimate-guide-to-progressive-web-applications)
- [Build a Simple CRUD App with Python and Flask](/blog/2018/07/23/build-a-simple-crud-app-with-flask-and-python)
- [Build a Basic CRUD App with Node and React](/blog/2018/07/10/build-a-basic-crud-app-with-node-and-react)


As always, if you have any questions feel free to leave us a comment below. Don't forget to follow us Follow us on [Twitter](https://twitter.com/oktadev), like us on [Facebook](https://www.facebook.com/oktadevelopers), check us out on [LinkedIn](https://www.linkedin.com/company/oktadev/), and subscribe to our [YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q).

