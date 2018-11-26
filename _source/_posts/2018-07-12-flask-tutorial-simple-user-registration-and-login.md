---
layout: blog_post
title: "Flask Tutorial: Simple User Registration and Login"
author: rdegges
description: "This post walks you through building a simple Flask web app with user registration and login."
tags: [python, flask, oidc, openid connect, user management]
tweets:
- "Are you a Python developer? Check out our latest #python #flask tutorial that shows you how to build a simple Flask app with user registration and login!"
- "Like building web apps in #python #flask? @rdegges just published a tutorial that walks you through adding user registration and login to your Flask apps with @openid"
- "Want to learn some #python today? Check out @rdegges' new tutorial that walks you through building #flask web apps with user registration and login."
---


Flask is my favorite Python web framework. It's minimal, it's fast, and most of all: *it's fun*. I love almost everything about Flask development, with one exception: user management.

User management in Flask, just like in many other web frameworks, is difficult. I can't tell you how many times I've created user databases, set up groups and roles, integrated social login providers, handled password reset workflows, configured multi-factor authentication workflows, etc. Even awesome libraries like [Flask-Login](http://flask-login.readthedocs.io/en/latest/) and [Flask-Security](https://pythonhosted.org/Flask-Security/) can be difficult to setup and maintain over long periods of time as your requirements change.

In this short tutorial, I'll show you what I think is one of the best and simplest ways to manage users for your Flask web applications: OpenID Connect. If you haven't heard of it, [OpenID Connect](/blog/2017/07/25/oidc-primer-part-1) is an open protocol that makes managing user authentication and authorization simple.

Follow along below and you'll learn how to:

* Create a simple Flask website
* Use OpenID Connect for user authentication and authorization
* Use Okta as your authorization server to store and manage your user accounts in a simple, straightforward way

If you'd like to skip the tutorial and just check out the fully built project, you can go [view it on GitHub](https://github.com/rdegges/okta-flask-example).

## Initialize Authentication for Your Flask App with Okta

Okta is a free-to-use API service that stores user accounts, and makes handling user authentication, authorization, social login, password reset, etc. — simple. Okta utilizes open standards like OpenID Connect to make integration seamless.

In this tutorial, you'll use Okta to store the user accounts for your web app, and you'll use OpenID Connect to talk to Okta to handle the logistics around authentication and authorization.

To get started, you first need to go create a free Okta developer account: [https://developer.okta.com/signup/](https://developer.okta.com/signup/). Once you've created your account and logged in, follow the steps below configure Okta and then you'll be ready to write some code!

{% img blog/flask-tutorial-simple-user-registration-and-login/okta-registration-page.png alt:"Okta registration page" width:"700" %}{: .center-image }


### Step 1: Store Your Org URL

The first thing you need to do is copy down the **Org URL** from the top-right portion of your Okta dashboard page. This URL will be used to route to your authorization server, communicate with it, and much more. You'll need this value later, so don't forget it.

{% img blog/flask-tutorial-simple-user-registration-and-login/okta-org-url.png alt:"Okta org URL" width:"700" %}{: .center-image }


### Step 2: Create an OpenID Connect Application

Okta allows you to store and manage users for multiple applications you might be creating. This means that before we can go any further, you need to create a new OpenID Connect application for this project.

Applications in OpenID Connect have a username and password (referred to as a client ID and client secret) that allow your authorization server to recognize which application is talking to it at any given time.

To create a new application browse to the **Applications** tab and click **Add Application**.

{% img blog/flask-tutorial-simple-user-registration-and-login/okta-application-page.png alt:"Okta application page" width:"700" %}{: .center-image }

Next, click the **Web** platform option (since this project is a web app).

{% img blog/flask-tutorial-simple-user-registration-and-login/okta-create-application-page.png alt:"Okta create application page" width:"700" %}{: .center-image }

On the settings page, enter the following values:

* **Name**: Simple Flask App
* **Base URIs**: `http://localhost:5000`
* **Login redirect URIs**: `http://localhost:5000/oidc/callback`

You can leave all the other values unchanged.

{% img blog/flask-tutorial-simple-user-registration-and-login/okta-create-application-settings-page.png alt:"Okta create application settings page" width:"700" %}{: .center-image }

Now that your application has been created, copy down the **Client ID** and **Client secret** values on the following page, you'll need them later when we start writing code.

{% img blog/flask-tutorial-simple-user-registration-and-login/okta-application-credentials-page.png alt:"Okta application credentials page" width:"700" %}{: .center-image }


### Step 3: Create an Authentication Token

In order to access the Okta APIs and be able to manage your user accounts with a great deal of granularity, you'll also need to create an Okta authentication token. This is an API key that will be used later on communicate with the Okta APIs and allows you to do things like:

* Create, update, and delete users
* Create, update, and delete groups
* Manage application settings
* Etc.

To create an authentication token click the **API** tab at the top of the page followed by the **Create Token** button. Give your token a name, preferably the same name as your application, then click **Create Token**. Once your token has been created, copy down the token value as you will need it later.

{% img blog/flask-tutorial-simple-user-registration-and-login/okta-create-token-page.png alt:"Okta create token page" width:"400" %}{: .center-image }


### Step 4: Enable User Registration

The last piece of setup you need to complete is to enable user registration functionality for the authorization server. Normally, authorization servers only support login, logout, and stuff like that. But Okta's authorization server also supports self-service registration, so that users can create accounts, log into them, reset passwords, and basically do everything without you writing any code for it.

In your Okta dashboard, you'll notice a small button labeled **< > Developer Console** at the top-left of your page. Hover over that button and select the **Classic UI** menu option that appears.

{% img blog/flask-tutorial-simple-user-registration-and-login/okta-classic-ui-dropdown.png alt:"Okta classic UI dropdown" width:"700" %}{: .center-image }

Next, hover over the **Directory** tab at the top of the page then select the **Self-Service Registration** menu item. On this page click the **Enable Registration** button.

{% img blog/flask-tutorial-simple-user-registration-and-login/okta-enable-self-service-registration-page.png alt:"Okta enable self-service registration page" width:"700" %}{: .center-image }

On the configuration page, leave all the settings as their default values, except for two:

* Disable the **User must verify email address to be activated.** checkbox. This setting removes the requirement for new users to verify their email address before being allowed to access your web app.
* Set the **Default redirect** option by clicking the **Custom URL** radio box and entering `http://localhost:5000/dashboard` as the value. This setting tells the authorization server where to redirect users after they've successfully created a new account on your site.

Once you've clicked **Save**, the last thing you need to is switch back to the developer console.

{% img blog/flask-tutorial-simple-user-registration-and-login/okta-self-service-registration-settings-page.png alt:"Okta self-service registration settings page" width:"700" %}{: .center-image }

Hover over the **Classic UI** button at the top right of the page and select the **< > Developer Console** menu item from the drop-down.


## Install Python and Flask Dependencies

The first thing you need to do in order to initialize your Flask app is install all of the required dependencies. If you don't have Python installed on your computer already, please go [install it now](https://www.python.org/downloads/).

**NOTE**: I also strongly recommend you get familiar with [pipenv](https://docs.pipenv.org/) when you get some time. It's a great tool that makes managing Python dependencies very simple.

Now install the dependencies required for this application.

```bash
pip install Flask>=1.0.0
pip install flask-oidc>=1.4.0
pip install okta==0.0.4
```


## Initialize Your Flask App

Now that the dependencies are installed, let's start by creating a simple Flask app. We'll build on this simple "hello, world!" app until we've got all our functionality included.

Create an `app.py` file and enter the following code:

{% raw %}
```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return 'hello, world!'
```
{% endraw %}

Open the terminal and run the following code to start up your new Flask app.

```console
FLASK_APP=app.py flask run
```

Once your Flask app is running, go visit `http://localhost:5000` in the browser to see the hello world message!

As you can see from the small file above, building a minimalist app with Flask can be really simple. All you need to do is:

* Import the Flask library
* Create a Flask app object
* Define a function (called a view) that runs when a particular URL is requested by a user (in this case, the `/` URL)

Not bad, right?


## Create an Index and Dashboard View in Flask

The next step to building a simple Flask app is creating a homepage and dashboard page. The homepage is what will be shown to the user when they visit the `/` URL, and the dashboard page (`/dashboard`) will be shown to the user once they've logged into their account.

When I'm building web apps, I like to define my templates and views first so I can get the hard part out of the way (design isn't my strong suit).

To get started, open up you `app.py` file from before and modify it to look like the following:

{% raw %}
```python
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")
```
{% endraw %}

You'll notice that you now have two view functions defined: `index` (which renders the homepage) and `dashboard` (which renders the dashboard page). Both of the view functions are calling the `render_template` Flask function, which is responsible for displaying an HTML page to the user.

Now, you obviously haven't created those HTML templates yet, so let's do that next!

Templates in Flask are built using the [Jinja2 templating language](http://jinja.pocoo.org/docs/2.10/). If you're familiar with HTML, it should look natural.

Let's start by creating the template files we'll need.

```console
mkdir templates
touch templates/{layout.html,index.html,dashboard.html}
```

All templates in Flask should live inside the `templates` folder.

Next, open up the `templates/layout.html` file and enter the following code.

{% raw %}
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">
    <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
    <title>Simple Flask App | {% block title %}{% endblock %}</title>
  </head>
  <body>
    <div class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
      <h5 class="my-0 mr-md-auto font-weight-normal">Simple Flask App</h5>
      <nav class="my-2 my-md-0 mr-md-3">
        <a class="p-2 text-dark" href="/" title="Home">Home</a>
        {% if not g.user %}
          <a class="p-2 text-dark" href="/login">Log In / Register</a>
        {% else %}
          <a class="p-2 text-dark" href="/dashboard">Dashboard</a>
          <a class="p-2 text-dark" href="/logout">Logout</a>
        {% endif %}
      </nav>
    </div>
    <div class="container">
      {% block body %}{% endblock %}
    </div>
    <footer class="text-center">Created by <a href="https://twitter.com/rdegges">@rdegges</a>, built using <a href="https://twitter.com/okta">@okta</a>.
  </body>
</html>
```
{% endraw %}

This `layout.html` file is our *base* template. It's basically a building block that all the other templates will inherit from. By defining our common, *shared* HTML in this file, we can avoid writing redundant HTML everywhere else. Yey!

Now, this file contains all the basic stuff you might expect:

* A simple, [Bootstrap](https://getbootstrap.com/)-based layout
* A nav bar (that contains some special Jinja2 logic)
* A special Jinja2 body
* A footer

Let's take a look at one interesting part of the template.

{% raw %}
```html
{% if not g.user %}
  <a class="p-2 text-dark" href="/login">Log In / Register</a>
{% else %}
  <a class="p-2 text-dark" href="/dashboard">Dashboard</a>
  <a class="p-2 text-dark" href="/logout">Logout</a>
{% endif %}
```
{% endraw %}

Anything in a Jinja2 tag (the {% raw %}`{% ... %}`{% endraw %} stuff) will be compiled by Flask before being shown to the user. In the example above, we're basically telling Flask that if the object `g.user` exists, we should render a dashboard and logout link in the navbar, but if no `g.user` object exists, we should show a login button instead.

We're doing this because eventually we're going to have the user's account accessible via the `g.user` object and we want the navbar to be smart in regards to what the user sees.

The next interesting part of the template is the body tag:

{% raw %}
```html
<div class="container">
  {% block body %}{% endblock %}
</div>
```
{% endraw %}

The `block` Jinja2 tag allows us to inject content from a child template into this parent template. This is what lets us build complex HTML pages without writing redundant code.

Now that the layout is defined, let's create the homepage. Open the `templates/index.html` file and insert the following code.

{% raw %}
```html
{% extends "layout.html" %}

{% block title %}Home{% endblock %}

{% block body %}
  <h1 class="text-center">Simple Flask App</h1>
  <div class="row">
    <div class="col-sm-6 offset-sm-3">
      <div class="jumbotron">
        Welcome to this simple Flask example app. It shows you how to easily
        enable users to register, login, and logout of a Flask web app using <a
           href="https://developer.okta.com">Okta</a>.
      </div>
    </div>
  </div>
{% endblock %}
```
{% endraw %}

The {% raw %}`{% extends "layout.html" %}`{% endraw %} tag is what tells the template engine that this template depends on the `layout.html` template to work.

Everything inside the `block` tags is then injected back into the parent template from before. By combining these two things together, you're now able to have a fully rendered homepage!

Next, go ahead and place the following code into the `templates/dashboard.html` file.

{% raw %}
```html
{% extends "layout.html" %}

{% block title %}Dashboard{% endblock %}

{% block body %}
  <h1 class="text-center">Dashboard</h1>
  <div class="row">
    <div class="col-sm-8 offset-sm-2">
      <p>Welcome to the dashboard, {{ g.user.profile.firstName }}!</p>
      <p>Your user information has been pulled from the <code>g.user</code>
      object, which makes accessing your user information simple. Your first
      name, for example, is available via the <code>g.user.profile.firstName</code>
      property. Your user id (<code>{{ g.user.id }}</code>), is pulled from the <code>g.user.id</code> property!</p>
    </div>
  </div>
{% endblock %}
```
{% endraw %}

This template works in the same way, except it also outputs some variables. For instance, the {% raw %}`{{ g.user.id }}`{% endraw %} value will output that ID value into the HTML template directly. These variables will eventually be available once we hook up the OpenID Connect library.

The last thing you need to do before testing things is add a bit of CSS to make things look nicer.

```console
mkdir static
touch static/style.css
```

Open `static/style.css` and copy in the following CSS.

```css
h1 {
  margin: 1em 0;
}

footer {
  padding-top: 2em;
}
```

Finally, now that your templates have been created, go test them out!

Visit `http://localhost:5000` and you should see your beautiful new website.

{% img blog/flask-tutorial-simple-user-registration-and-login/app-homepage.png alt:"app homepage" width:"700" %}{: .center-image }


## Add User Registration and Login to Your Flask App

Now that the UI for the app is finished, let's get the interesting stuff working: user registration and login.


### Step 1: Create an OpenID Connect Config File

Create a new file named `client_secrets.json` in the root of your project folder and insert the following code.

{% raw %}
```json
{
  "web": {
    "client_id": "{{ OKTA_CLIENT_ID }}",
    "client_secret": "{{ OKTA_CLIENT_SECRET }}",
    "auth_uri": "{{ OKTA_ORG_URL }}/oauth2/default/v1/authorize",
    "token_uri": "{{ OKTA_ORG_URL }}/oauth2/default/v1/token",
    "issuer": "{{ OKTA_ORG_URL }}/oauth2/default",
    "userinfo_uri": "{{ OKTA_ORG_URL }}/oauth2/default/userinfo",
    "redirect_uris": [
      "http://localhost:5000/oidc/callback"
    ]
  }
}
```
{% endraw %}

Be sure to replace the placeholder variables with your actual Okta information.

* Replace {% raw %}`{{ OKTA_ORG_URL }}`{% endraw %} with the Org URL on your dashboard page
* Replace {% raw %}`{{ OKTA_CLIENT_ID }}}`{% endraw %} with the Client ID on your application page
* Replace {% raw %}`{{ OKTA_CLIENT_SECRET }}`{% endraw %} with the Client secret on your application page

This file will be used by the Flask-OIDC library which we'll be configuring in a moment. These settings essentially tell the OpenID Connect library what OpenID Connect application you're using to authenticate against, and what your authorization server API endpoints are.

The URIs above simply point to your newly created Okta resources so that the Flask library will be able to talk to it properly.


### Step 2: Configure Flask-OIDC

Open up `app.py` and paste in the following code.

{% raw %}
```python
from flask import Flask, render_template
from flask_oidc import OpenIDConnect

app = Flask(__name__)
app.config["OIDC_CLIENT_SECRETS"] = "client_secrets.json"
app.config["OIDC_COOKIE_SECURE"] = False
app.config["OIDC_CALLBACK_ROUTE"] = "/oidc/callback"
app.config["OIDC_SCOPES"] = ["openid", "email", "profile"]
app.config["SECRET_KEY"] = "{{ LONG_RANDOM_STRING }}"
oidc = OpenIDConnect(app)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")
```
{% endraw %}

What we're doing here is configuring the Flask-OIDC library.

* The `OIDC_CLIENT_SECRETS` setting tells Flask-OIDC where your OpenID Connect configuration file is located (the one you created in the previous section).
* The `OIDC_COOKIE_SECURE` setting allows you to test out user login and registration in development without using SSL. If you were going to run your site publicly, you would remove this option and use SSL on your site.
* The `OIDC_CALLBACK_ROUTE` setting tells Flask-OIDC what URL on your site will handle user login. This is a standard part of the OpenID Connect flows. This is out of scope for this article, but if you want to learn more, go read our [OpenID Connect primer](/blog/2017/07/25/oidc-primer-part-1).
* The `OIDC_SCOPES` setting tells Flask-OIDC what data to request about the user when they log in. In this case, we're requesting basic user information (email, name, etc.).
* The `SECRET_KEY` setting should be set to a *long*, random string. This is used to secure your Flask sessions (cookies) so that nobody can tamper with them. Make sure this variable stays private. It should never be publicly exposed.

Finally, after all the configuration is finished, we initialize the Flask-OIDC extension by creating the `oidc` object.


### Step 3: Inject the User Into Each Request

Open up `app.py` and paste in the following code.

{% raw %}
```python
from flask import Flask, render_template, g
from flask_oidc import OpenIDConnect
from okta import UsersClient

app = Flask(__name__)
app.config["OIDC_CLIENT_SECRETS"] = "client_secrets.json"
app.config["OIDC_COOKIE_SECURE"] = False
app.config["OIDC_CALLBACK_ROUTE"] = "/oidc/callback"
app.config["OIDC_SCOPES"] = ["openid", "email", "profile"]
app.config["SECRET_KEY"] = "{{ LONG_RANDOM_STRING }}"
app.config["OIDC_ID_TOKEN_COOKIE_NAME"] = "oidc_token"
oidc = OpenIDConnect(app)
okta_client = UsersClient("{{ OKTA_ORG_URL }}", "{{ OKTA_AUTH_TOKEN }}")


@app.before_request
def before_request():
    if oidc.user_loggedin:
        g.user = okta_client.get_user(oidc.user_getfield("sub"))
    else:
        g.user = None


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")
```
{% endraw %}

What we're doing here is importing the `okta` Python library, and using it to define the `okta_client` object. This client object will be used to retrieve a robust User object that you can use to:

* Identify the currently logged in user
* Make changes to the user's account
* Store and retrieve user information

Make sure you replace {% raw %}`{{ OKTA_ORG_URL }}`{% endraw %} and {% raw %}`{{ OKTA_AUTH_TOKEN }}`{% endraw %} with the values you wrote down in the first section of this tutorial. These two variables are mandatory so the `okta` library can communicate with the Okta API service.

{% raw %}
```python
@app.before_request
def before_request():
    if oidc.user_loggedin:
        g.user = okta_client.get_user(oidc.user_getfield("sub"))
    else:
        g.user = None
```
{% endraw %}

The code above is where the magic happens. This function will be executed each time a user makes a request to view a page on the site before the normal view code runs. What this function does is:

* Check to see whether or not a user is logged in via OpenID Connect or not (the `oidc.user_loggedin` value is provided by the Flask-OIDC library)
* If a user is logged in, it will grab the user's unique user ID from the user's session, then use that ID to fetch the user object from the Okta API

In all cases, there will be a newly created value: `g.user`. In Flask, you can store request data on the `g` object, which can be accessed from anywhere: view code, templates, etc. This makes it a convenient place to store something like a user object so it can easily be used later on.


### Step 4: Enable User Registration, Login, and Logout

Open up `app.py` and insert the following code.

{% raw %}
```python
from flask import Flask, render_template, g, redirect, url_for
from flask_oidc import OpenIDConnect
from okta import UsersClient

app = Flask(__name__)
app.config["OIDC_CLIENT_SECRETS"] = "client_secrets.json"
app.config["OIDC_COOKIE_SECURE"] = False
app.config["OIDC_CALLBACK_ROUTE"] = "/oidc/callback"
app.config["OIDC_SCOPES"] = ["openid", "email", "profile"]
app.config["SECRET_KEY"] = "{{ LONG_RANDOM_STRING }}"
app.config["OIDC_ID_TOKEN_COOKIE_NAME"] = "oidc_token"
oidc = OpenIDConnect(app)
okta_client = UsersClient("{{ OKTA_ORG_URL }}", "{{ OKTA_AUTH_TOKEN }}")


@app.before_request
def before_request():
    if oidc.user_loggedin:
        g.user = okta_client.get_user(oidc.user_getfield("sub"))
    else:
        g.user = None


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/dashboard")
@oidc.require_login
def dashboard():
    return render_template("dashboard.html")


@app.route("/login")
@oidc.require_login
def login():
    return redirect(url_for(".dashboard"))


@app.route("/logout")
def logout():
    oidc.logout()
    return redirect(url_for(".index"))
```
{% endraw %}

There are only a few things different here:

* You now have a `login` view. The view will redirect the user to Okta (the OpenID Connect provider) to register or login. This is powered by the `@oidc.require_login` decorator which is provided by the Flask-OIDC library. Once the user has been logged in, they'll be redirected to the dashboard page.
* The `logout` view is also present. This simply logs the user out using the `oidc.logout()` method and then redirects the user to the homepage.

And with that, your application is now fully functional!


## Test Your New Flask App

Now that your app is fully built, go test it out! Open up `http://localhost:5000`, create an account, log in, etc.

{% img blog/flask-tutorial-simple-user-registration-and-login/app-usage.gif alt:"app usage" width:"700" %}{: .center-image }

As you can see, building a Flask app with user registration, login, etc. doesn't have to be hard!

If you're interested in learning more about web authentication and security, you may also want to check out some of [our other articles](/blog/), or [follow us](https://twitter.com/oktadev) on Twitter — we write a lot about interesting web development topics.

Here are two of my favorites:

* [Build a Simple CRUD App with Flask and Python](/blog/2018/07/23/build-a-simple-crud-app-with-flask-and-python)
* [Add Authentication to Any Web Page in 10 Minutes](/blog/2018/06/08/add-authentication-to-any-web-page-in-10-minutes)
* [What Happens if Your JWT is Stolen?](/blog/2018/06/20/what-happens-if-your-jwt-is-stolen)
