---
layout: blog_post
title: "Build a Secure To-Do App with Vue, ASP.NET Core, and Okta"
author: nbarbettini
tags: [vue.js, vue, oidc, dotnet, aspnetcore]
tweets: 
  - "ICYMI: @nbarbettini shows how to build a to-do app with #vuejs and #aspnetcore step-by-step"
  - "In-depth tutorial on building full-stack #vuejs and #aspnetcore apps by our own @nbarbettini"
---

I love lists. I keep everything I need to do (too many things, usually) in a big to-do list, and the list helps keep me sane throughout the day. It's like having a second brain!

There are hundreds of to-do apps out there, but today I'll show you how to build your own from scratch. Why? It's the perfect exercise for learning a new language or framework! A to-do app is more complex than "Hello World", but simple enough to build in an afternoon or on the weekend. Building a simple app is a great way to stretch your legs and try a language or framework you haven't used before.

## Why Vue.js and ASP.NET Core?
In this article, I'll show you how to build a lightweight, secure to-do app with a Vue.js frontend and an ASP.NET Core backend. Not familiar with these frameworks? That's fine! You'll learn everything as you go. Here's a short introduction to both:

[Vue.js](https://vuejs.org) is a JavaScript framework for building applications that run in the browser. It borrows some good ideas from both Angular and React, and has been gaining popularity recently. I like Vue because it's easy to pick up and get started. Compared to both Angular and React, the learning curve doesn't feel as steep. Plus, it has great documentation! For this tutorial, I've borrowed from Matt Raible's excellent article [The Lazy Developer's Guide to Authentication with Vue.js](https://developer.okta.com/blog/2017/09/14/lazy-developers-guide-to-auth-with-vue).

[ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/) is Microsoft's new open-source framework for building web apps and APIs. I like ASP.NET Core on the backend because it's type-safe, super fast, and has a large ecosystem of packages available. If you want to learn the basics, I wrote a [free ebook](http://littleasp.net/book) about version 2.0, which was released earlier this year. 

Ready to build an app? Let's get started!


## Install the tools
You'll need Node and npm installed for this tutorial, which you can install from the [Node.js official site](https://nodejs.org).

You'll also need `dotnet` installed, which you can install from the [Microsoft .NET site](https://dot.net/core).

To double check that everything is installed correctly, run these commands in your terminal or shell:

```bash
npm -v

dotnet --version
```

{% img blog/build-secure-todo-app-vuejs-aspnetcore/check-versions.gif alt:"Check tool versions in the terminal" width:"900" %}{: .center-image }

I'm using [Visual Studio Code](https://code.visualstudio.com/) for this project, but you can use whatever code editor you feel comfortable in. If you're on Windows, you can also use Visual Studio 2017 or later.


## Set up the project
Instead of starting from absolute zero, you can use a template to help you scaffold a basic, working application. Mark Pieszak has an excellent [ASP.NET Core Vue SPA starter kit](https://github.com/MarkPieszak/aspnetcore-Vue-starter), which we'll use as a starting point.

Download or clone the project from GitHub, and then open the folder in your code editor.

{% img blog/build-secure-todo-app-vuejs-aspnetcore/project.png alt:"Initial project structure" width:"300" %}{: .center-image }

Run `npm install` to restore and install all of the JavaScript packages (including Vue.js).

### Configure the environment and run the app
You'll need to make sure the `ASPNETCORE_ENVIRONMENT` variable is set on your machine. ASP.NET Core looks at this environment variable to determine whether it's running in a development or production environment.

* If you're on Windows, use PowerShell to execute `$Env:ASPNETCORE_ENVIRONMENT = "Development"`
* If you're on Mac or Linux, execute `export ASPNETCORE_ENVIRONMENT=Development`

In Visual Studio Code, you can open the Integrated Terminal from the View menu to run the above commands.

Now you're ready to run the app for the first time! Execute `dotnet run` in the terminal. After the app compiles, it should report that it's running on `localhost:5000`.

{% img blog/build-secure-todo-app-vuejs-aspnetcore/dotnet-run-localhost.png alt:"Execute dotnet run in terminal" width:"800" %}{: .center-image }

Open up a browser and navigate to `http://localhost:5000`:

{% img blog/build-secure-todo-app-vuejs-aspnetcore/vue-starter.png alt:"Vue.js starter template app" width:"800" %}{: .center-image }

### Optional: Install Vue Devtools
If Chrome is your preferred browser, I'd highly recommend the [Vue Devtools](https://github.com/vuejs/vue-devtools) extension. It adds some great debugging and inspection features to Chrome that are super useful when you're building Vue.js applications.


## Build the Vue.js app
It's time to start writing some real code. If `dotnet run` is still running in your terminal, press Ctrl-C to stop it.

Delete all the files and folders under the ClientApp folder, and create a new file called `boot-app.js`:

```js
import Vue from 'vue'
import App from './components/App'
import router from './router'
import store from './store'
import { sync } from 'vuex-router-sync'

// Sync Vue router and the Vuex store
sync(store, router)

new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
```

This file sets up Vue, and serves as the main entry point (or starting point) for the whole JavaScript application.

Next, create `router.js`:

```js
import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Dashboard from './components/Dashboard'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Dashboard }
  ]
})

export default router
```

The [Vue router](https://router.vuejs.org/en/) keeps track of what page the user is currently viewing, and handles navigating between pages or sections of your app. For now, this file sets up the router with only one path `/` and associates it with a component called Dashboard.

You might be wondering what `store` and `Dashboard` are. Don't worry, you'll add them next!

### Add components
Components are how Vue.js organizes pieces of your application. A component wraps up some functionality, from a simple button or UI element to entire pages and sections. Components can contain HTML, JavaScript, and CSS styles.

In the ClientApp folder, create a new folder called `components`. Inside the new folder, create a file called `Dashboard.vue`:

{% raw %}
```html
<template>
  <div class="dashboard">
    <template v-if="!this.$parent.authenticated">
      <h2>Welcome!</h2>
      <p>Log in to view your to-do list.</p>
    </template>

    <template v-if="this.$parent.authenticated">
      <h2>{{name}}, here's your to-do list</h2>

      <input class="new-todo"
          autofocus
          autocomplete="off"
          placeholder="What needs to be done?"
          @keyup.enter="addTodo">

      <ul class="todo-list">
        <todo-item v-for="(todo, index) in todos" :key="index" :item="todo"></todo-item>
      </ul>
      
      <p>{{ remaining }} remaining</p>
    </template>
  </div>
</template>

<script>
import TodoItem from './TodoItem'

export default {
  components: { TodoItem },
  computed: {
    name () {
      if (this.$parent.userInfo) {
        return this.$parent.userInfo.given_name
      } else {
        return 'Hello'
      }
    },
    todos () {
      return this.$store.state.todos
    },
    complete () {
      return this.todos.filter(todo => todo.completed).length
    },
    remaining () {
      return this.todos.filter(todo => !todo.completed).length
    }
  },
  methods: {
    addTodo (e) {
      var text = e.target.value || ''
      text = text.trim()

      if (text.length) {
        this.$store.dispatch('addTodo', { $auth: this.$auth, text })
      }
      
      e.target.value = ''
    },
  }
}
</script>

<style>
.new-todo {
  width: 100%;
  font-size: 18px;
  margin-bottom: 15px;
  border-top-width: 0;
  border-left-width: 0;
  border-right-width: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}
</style>
```
{% endraw %}

The Dashboard component is responsible for displaying all the user's to-do items, and rendering an input field that lets the user add a new item. In `router.js`, you told the Vue router to render this component on the `/` path, or the root route of the application.

This component has HTML in the `<template>` section, JavaScript in the `<script>` section, and CSS in the `<style>` section, all stored in one `.vue` file. If your Vue components become too large or unwieldy, you can choose to split them into separate HTML, JS, and CSS files as needed.

When you use {% raw %}`{{moustaches}}`{% endraw %} or attributes like `v-for` in the component's HTML, Vue.js automatically inserts (or **binds**) data that's available to the component. In this case, you've defined a handful of JavaScript methods in the `computed` section that retrieve things like the user's name and the user's to-do list from the data store. That data is then automatically rendered by Vue. Don't worry about `$store` and `$auth` yet. You'll add these pieces in a few minutes.

Notice the `components: { TodoItem }` line? The Dashboard component relies on another component called TodoItem. Create a file called `TodoItem.vue`:

```html
<template>
  <li class="todo" :class="{ completed: item.completed }">
    <input class="toggle"
      type="checkbox"
      :checked="item.completed"
      @change="toggleTodo({ id: item.id, completed: !item.completed })">

    <label v-text="item.text"></label>

    <button class="delete" @click="deleteTodo({ id: item.id })">
      <span class="glyphicon glyphicon-trash"></span>
    </button>
  </li>
</template>

<script>
export default {
  props: ['item'],
  methods: {
    toggleTodo (data) {
      data.$auth = this.$auth
      this.$store.dispatch('toggleTodo', data)
    },
    deleteTodo (data) {
      data.$auth = this.$auth
      this.$store.dispatch('deleteTodo', data)
    }
  }
}
</script>

<style>
  .todo {
    list-style-type: none;
  }

  .todo.completed {
    opacity: 0.5;
  }

  .todo.completed label {
    text-decoration: line-through;
  }

  button.delete {
    color: red;
    opacity: 0.5;
    -webkit-appearance: none;
    -moz-appearance: none;
    outline: none;
    border: 0;
    background: transparent;
  }
</style>
```

The TodoItem component is only responsible for rendering a single to-do item. The `props: ['item']` line declares that this component receives a **prop** or parameter called `item`, which contains the data about one to-do item (the text, whether it's completed, and so on).

In the Dashboard component, this line creates a TodoItem component for each to-do item:

```html
<todo-item v-for="(todo, index) in todos" :key="index" :item="todo"></todo-item>
```

There's a lot going on in this syntax, but the important bits are:

* The `<todo-item>` tag, which refers to the new TodoItem component.
* The `v-for` directive, which tells Vue to loop through all the items in the `todos` array and render a `<todo-item>` for each one.

* The `:item="todo"` attribute, which binds the value of `todo` (a single item from the `todos` array) to an attribute called `item`. This data is passed into the TodoItem component as the `item` prop.

Using components to split your app into small pieces makes it easier to organize and maintain your code. If you need to change how to-do items are rendered in the future, you just need to make changes to the TodoItem component.

The Dashboard and TodoItem components (and the router configuration) refer to something called `store` or `$store`. I'll explain what the store is, and how to build it, in the next section. Later, you'll also add `$auth`, which is a plugin that keeps track of whether a user is currently logged in. Before you get there, you need to build one more component.

Create a file called `App.vue` in the `components` folder:

```html
<template>
  <div class="app-container">
    <div class="app-view">
      <router-view />

      <template v-if="authenticated">
        <button v-on:click='logout'>Log out</button>
      </template>

      <template v-else>
        <button v-on:click='$auth.loginRedirect'>Log in</button>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data: function () {
    return {
      authenticated: false,
      userInfo: null
    }
  },
  created () {
    this.checkAuthentication()
  },
  watch: {
    // Every time the route changes, check the auth status
    '$route': 'checkAuthentication'
  },
  methods: {
    async checkAuthentication () {
      let previouslyLoggedIn = this.authenticated
      this.authenticated = await this.$auth.isAuthenticated()

      let justLoggedIn = !previouslyLoggedIn && this.authenticated
      if (justLoggedIn) {
        this.$store.dispatch('getAllTodos', { $auth: this.$auth })
        this.userInfo = await this.$auth.getUser()
      }

      let justLoggedOut = previouslyLoggedIn && !this.authenticated
      if (justLoggedOut) {
        this.userInfo = null
        this.$store.commit('clearTodos')
      }
    },
    async logout () {
      await this.$auth.logout()
      await this.checkAuthentication()

      // Navigate back to home
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style>
html, body {
	margin: 0;
	padding: 0;
}

body {
	font: 14px -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif;
	line-height: 1.4em;
	background: #F3F5F6;
	color: #4d4d4d;
}

ul {
  padding: 0;
}

h1, h2 {
  text-align: center;
}

.app-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-view {
  background: #fff;
  min-width: 400px;
  min-height: 200px;
  padding: 20px 25px 15px 25px;
  margin: 30px;
	position: relative;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2),
	            0 5px 10px 0 rgba(0, 0, 0, 0.1);
}
</style>
```

The App component is responsible for two things:
* Providing the base HTML and CSS used by the app.
* Keeping track of whether the user is logged in, using the `$auth` plugin. (This will be covered a little later.)

The `<router-view>` element provides a place to render the Vue router's active route. Right now, there's only one route: `/` which will render the Dashboard component in the `<router-view>`.

Navbars and other UI elements that should exist outside of the current router view can be placed in this component. For now, the component will just show a simple button to log in or out, depending on the value of the `authenticated` variable in the component code.

How does Vue know that the App component should be used as the "base" HTML and CSS for the app? If you look back at `boot-app.js`, you'll see this line:

```js
import App from './components/App'
```

This statement loads the App component, which is then passed to Vue in `new Vue(...)`. This tells Vue that it should load the App component first.

You're all done building components! It's time to add some state management and authentication. First, I'll explain what state management is and why it's useful.

### Add Vuex for state management
Components are a great way to break up your app into manageable pieces, but when you start passing data between many components, it becomes hard to keep all of that data in sync.

The [Vuex](https://vuex.vuejs.org/) library helps solve this problem by creating a **store** that holds data in a central place. Then, any of your components can get the data they need from the store. Bonus: if the data in the store changes, all your components get the updated data immediately!

If you've used Flux or Redux, you'll find Vuex familiar: it's a state management library with strict rules around how state can be mutated (modified) inside your app.

The template you started with already has Vuex installed. To keep things tidy, create a new folder under `ClientApp` called `store`. Then, create a file inside called `index.js`:

```js
import Vue from 'vue'
import Vuex from 'vuex'
import { state, mutations } from './mutations'
import { actions } from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions
})
```

This file initializes Vuex and makes it available to your Vue components. The real meat of Vuex is in **mutations** and **actions**, but you'll write those in separate files to keep everything organized.

Create a file called `mutations.js`:

```js
export const state = {
  todos: []
}

export const mutations = {
  loadTodos(state, todos) {
    state.todos = todos || [];
  },

  clearTodos(state) {
    state.todos = [];
  }
}
```

This file defines two things: the `state` or data that's shared across the app, and mutations that change that state. Vuex follows a few simple rules:

* State is immutable -- it can't be changed except by a mutation.
* Mutations can change state, but they must be synchronous. Async code (like API calls) must run in an action instead.
* Actions run asynchronous code, then commit mutations, which change state.

Enforcing this hierarchy of rules makes it easier to understand how data and changes flow through your app. If some piece of state changes, you know that a mutation caused the change.

This app uses the Vuex store to keep track of the to-do list (the `state.todos` array). The Dashboard component accesses this data with computed properties like:

```js
todos () {
  return this.$store.state.todos
},
```

The mutations defined here are only half the story, because they only handle updating the state *after* an action has run. Create another file called `actions.js`:

```js
import axios from 'axios'

export const actions = {
  async getAllTodos({ commit }, data) {
    // Todo: get the user's to-do items
    let fakeTodoItem = { text: 'Fake to-do item' }
    commit('loadTodos', [fakeTodoItem])
  },

  async addTodo({ dispatch }, data) {
    // Todo: save a new to-do item
    await dispatch('getAllTodos', data.$auth)
  },

  async toggleTodo({ dispatch }, data) {
    // Todo: toggle to-do item completed/not completed
    await dispatch('getAllTodos', data.$auth)
  },

  async deleteTodo({ dispatch }, data) {
    // Todo: delete to-do item
    await dispatch('getAllTodos', data.$auth)
  }
}
```

Most of these actions are marked with `// Todo` (no pun intended), because you'll need to revisit them after you have the backend API in place. For now, the `getAllTodos` action commits the `loadTodos` mutation with a fake to-do item. Later, this action will call your API to retrieve the user's to-do items and then commit the mutation with the real items returned from the API.


## Add identity and security with Okta

[Okta](https://developer.okta.com) is a cloud-hosted identity API that makes it easy to add authentication, authorization, and user management to your web and mobile apps. You'll use it in this project to:

* Add login to the Vue app
* Require authentication on the backend API
* Store each user's to-do items securely

To get started, sign up for a free [Okta Developer account](https://developer.okta.com/signup/). After you activate your new account (called an Okta organization, or org), click Applications at the top of the screen. Choose Single-Page App and click Next. Change the base URI to `http://localhost:5000`, and the login redirect URI to `http://localhost:5000/implicit/callback`:

{% img blog/build-secure-todo-app-vuejs-aspnetcore/okta-app-settings.png alt:"Okta application settings" width:"700" %}{: .center-image }

After you click Done, you'll be redirected to the new application's details. Scroll down and copy the Client ID. You'll need it in a minute.

### Add a custom user profile field
By default, Okta stores basic information about your users: first name, last name, email, and so on. If you want to store more, Okta supports custom profile fields that can store any type of user data you need. You can use this to store the to-do items for each user right on the user profile - no extra database needed!

To add a custom field, open the Users menu at the top of the screen and click on Profile Editor. On the first row (Okta User), click Profile to edit the default user profile. Add a string attribute called `todos`:

{% img blog/build-secure-todo-app-vuejs-aspnetcore/add-todos-profile-field.png alt:"Add custom field in Okta profile" width:"700" %}{: .center-image }

Next, you'll connect your frontend code (the Vue app) to Okta.

### Add the Okta Vue SDK

The [Okta Vue SDK](https://www.npmjs.com/package/@okta/okta-vue) makes it easy to add Okta authentication to your Vue app. Add it with `npm`:

```bash
npm install --save @okta/okta-vue
```

Once it's installed, update `router.js` and some new code (highlighted here with comments):

```js
import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Dashboard from './components/Dashboard'
// Import the Okta Vue SDK
import Auth from '@okta/okta-vue'

Vue.use(Router)

// Add the $auth plugin from the Okta Vue SDK to the Vue instance
Vue.use(Auth, {
  // Replace this with your Okta domain:
  issuer: 'https://{yourOktaDomain}/oauth2/default',
  // Replace this with the client ID of the Okta app you just created:
  client_id: '{clientId}',
  redirect_uri: 'http://localhost:5000/implicit/callback',
  scope: 'openid profile email'
})

const router = new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Dashboard },
    // Handle the redirect from Okta using the Okta Vue SDK
    { path: '/implicit/callback', component: Auth.handleCallback() },
  ]
})

// Check the authentication status before router transitions
router.beforeEach(Vue.prototype.$auth.authRedirectGuard())

export default router
```

Replace `{yourOktaDomain}` with your Okta org URL, which you can find on the Dashboard page in the Developer Console. Next, paste the Client ID you copied from the application you created a minute ago into the `client_id` property.

Try it out: run the server with `dotnet run` and try logging in with the email and password you used to sign up for Okta:

{% img blog/build-secure-todo-app-vuejs-aspnetcore/logged-in.png alt:"Logged in via Okta" width:"450" %}{: .center-image }

The Log in button uses the Okta Vue SDK to redirect to your Okta organization's hosted login screen, which then redirects back to your app with tokens that identify the user. The `/implicit/callback` route you added to the router handles this redirect from Okta and calls the `Auth.handleCallback()` function in the Okta Vue SDK. This function takes care of parsing the tokens and letting your app know that the user logged in.

Tip: If you need to fix bugs or make changes in your JavaScript code, you don't need to stop and restart the server with `dotnet run` again. As soon as you modify any of your Vue or JavaScript files, the frontend app will be recompiled automatically. If you make a change to the Dashboard component (for example), it'll appear instantly in the browser (almost like magic).

Try logging in, refreshing the page (you should still be logged in!), and logging out. That takes care of authenticating the user on the frontend! Later, you'll update the store to make secure, authenticated calls to your backend API using the same tokens you just obtained.

Great job so far! You've set up Vue.js, built components and routing, added state management with Vuex, and added Okta for authentication. The next step is adding the backend API with ASP.NET Core. Grab a refill of coffee and let's dive in!


## Build an API with ASP.NET Core
The user's to-do items will be stored in the cloud (via Okta) so they can be accessed anywhere. Your frontend app won't access this data directly. Instead, the Vuex actions will call your backend API, which will retrieve the data and return it to the frontend.

This pattern (JavaScript code calling a backend API) is a common way to architect modern apps. The API can be written in any language you prefer. In this tutorial, you'll write the API in C# using the ASP.NET Core framework.

If you want an introduction to ASP.NET Core from the ground up, check out my free [Little ASP.NET Core Book](http://littleasp.net/book)!

The template you started from already includes the scaffolding you need for a basic ASP.NET Core project:
* The `Startup.cs` file, which configures the project and defines the middleware pipeline.
* A pair of controllers in the aptly-named Controllers folder.

In ASP.NET Core, Controllers handle requests to specific routes in your backend application or API. The `HomeController` contains boilerplate code that handles the root route `/` and renders your frontend app. You won't need to modify it. The `SampleDataController`, on the other hand, can be deleted. Time to write a new controller!

Create a new file in the Controllers folder called `TodoController.cs`:

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Vue2Spa.Controllers
{
    [Route("api/[controller]")]
    public class TodoController : Controller
    {
        // Handles GET /api/todo
        [HttpGet]
        public async Task<IActionResult> GetAllTodos()
        {
            // TODO: Get to-do items and return to frontend
        }
    }
}
```

The `Route` attribute at the top of the controller with a value of `"api/[controller]"` tells ASP.NET Core that this controller will be handling the route `http://yourdomain/api/todo`. Inside the controller, the `GetAllTodos` method is decorated with the `HttpGet` attribute to indicate that it should handle an HTTP GET. When your frontend code makes a GET to `/api/todo`, the `GetAllTodos` method will run.

### Define a model
Before you return to-do items from the method, you need to define the structure of the object, or **model**, you'll return. Since C# is a statically-typed language (as opposed to a dynamic language like JavaScript), it's typical to define these types in advance.

Create a new folder at the root of the project (next to to the Controllers folder) called Models. Inside, create a file called `TodoItemModel.cs`:

```csharp
using System;

namespace Vue2Spa.Models
{
    public class TodoItemModel
    {
        public Guid Id { get; set; }

        public string Text { get; set; }

        public bool Completed { get; set; }
    }
}
```

This model defines a few simple properties for all to-do items: an ID, some text, and a boolean indicating whether the to-do is complete. When you fill this model with data and return it from your controller, ASP.NET Core will automatically serialize these properties to JSON that your frontend code can easily consume.

### Define a service
You could return a model directly from the `GetAllTodos` method, but it's common to add another layer. In the next section, you'll add code to look up the user's profile in Okta and retrieve their to-do items. To keep everything organized, you can create a **service** that will wrap up the code that retrieves the user's to-do items.

Create one more folder in the project root called Services, and add a file called `ITodoItemService.cs`:

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vue2Spa.Models;

namespace Vue2Spa.Services
{
    public interface ITodoItemService
    {
        Task<IEnumerable<TodoItemModel>> GetItems(string userId);

        Task AddItem(string userId, string text);

        Task UpdateItem(string userId, Guid id, TodoItemModel updatedData);

        Task DeleteItem(string userId, Guid id);
    }
}
```

This file describes an **interface** -- a feature in C# (and many other languages) that defines the methods available in a particular class without providing the "concrete" implementation. This makes it easy to test and swap out implementations during development.

Create a new file called `FakeTodoItemService.cs` that will be a temporary implementation until you add the connection to Okta in the next section:

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vue2Spa.Models;

namespace Vue2Spa.Services
{
    public class FakeTodoItemService : ITodoItemService
    {
        public Task<IEnumerable<TodoItemModel>> GetItems(string userId)
        {
            var todos = new[]
            {
                new TodoItemModel { Text = "Learn Vue.js", Completed = true },
                new TodoItemModel { Text = "Learn ASP.NET Core" }
            };

            return Task.FromResult(todos.AsEnumerable());
        }

        public Task AddItem(string userId, string text)
        {
            throw new NotImplementedException();
        }

        public Task DeleteItem(string userId, Guid id)
        {
            throw new NotImplementedException();
        }

        public Task UpdateItem(string userId, Guid id, TodoItemModel updatedData)
        {
            throw new NotImplementedException();
        }
    }
}
```

This dummy service will always return the same to-do items. You'll replace it soon, but it will let you test the app and make sure everything is working.

### Use the service
With the controller, model, and service all in place, all you need to do is connect them together. First, open up the `Startup.cs` file and add this line anywhere in the `ConfigureServices` method:

```csharp
services.AddSingleton<ITodoItemService, FakeTodoItemService>();
```

You'll also need to add this `using` statement to the top of the file:

```csharp
using Vue2Spa.Services;
```

Adding the new service to the `ConfigureServices` method makes it available to your controllers. In your `TodoController`, add this code at the top of the class:

```csharp
// ...

public class TodoController : Controller
{
    private readonly ITodoItemService _todoItemService;

    public TodoController(ITodoItemService todoItemService)
    {
        _todoItemService = todoItemService;
    }

    // Existing code...
}
```

Adding this code causes ASP.NET Core to inject an `ITodoItemService` object into the controller. Because you're using the interface here, your controller doesn't know (or care) which implementation of the `ITodoItemService` it receives. It's currently the `FakeTodoItemService`, but later it'll be a more interesting (and real) implementation.

Add this `using` statement at the top of the file:

```csharp
using Vue2Spa.Services;
```

Finally, add this code to the `GetAllTodos` method:

```csharp
var userId = "123"; // TODO: Get actual user ID
var todos = await _todoItemService.GetItems(userId);

return Ok(todos);
```

When a request comes into the `GetAllTodos` method, the controller calls the `ITodoItemService` to get the to-do items for the current user, and then returns HTTP OK (200) with the to-do items.

That takes care of the backend API (for now). The frontend now needs to be updated to call the `/api/todo` route to get the user's to-do items. In `actions.js`, update the `getAllTodos` function:

```js
async getAllTodos({ commit }, data) {
  let response = await axios.get('/api/todo')
  
  if (response && response.data) {
    let updatedTodos = response.data
    commit('loadTodos', updatedTodos)
  }
},
```

The new action code uses the [axios library](https://github.com/axios/axios) to make a request to the backend on the `/api/todo` route, which will be handled by the `GetAllTodos` method on the backend `TodoController`. If data is returned, the `loadTodos` mutation is committed and the Vuex store is updated with the user's to-do items. The Dashboard view will automatically see the updated data in the store and render the items in the browser.

Ready to test it out? Run the project with `dotnet run` and browse to `http://localhost:5000`: 

{% img blog/build-secure-todo-app-vuejs-aspnetcore/logged-in-fake-items-via-backend.png alt:"Retrieved fake items from the backend API" width:"500" %}{: .center-image }

The data may be fake, but you've successfully connected the backend and frontend! The final step is to add data storage and token authentication to the app. You're almost there!


## Add token authentication to the API

When the Okta Vue SDK handles a login via Okta, it saves a token called an **access token** in your frontend app. You can attach this access token to calls to your backend API to make them secure. Before you do that, you have to tell your ASP.NET Core project to use token authentication. Open up the `Startup.cs` file and add this code to the `ConfigureServices` method:

{% raw %}
```csharp
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.Authority = "https://{yourOktaDomain}/oauth2/default";
    options.Audience = "api://default";
});
```
{% endraw %}

Make sure you replace `yourOktaDomain` with your Okta Org URL (find it in the top-right of your Okta developer console's Dashboard).

You'll need to add this using statement at the top of the file:

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
```

And this line down in the `Configure` method:

```csharp
app.UseStaticFiles();

// Add this:
app.UseAuthentication();

app.UseMvc(...
```

The `Configure` method defines the middleware pipeline for an ASP.NET Core project, or the list of handlers that modify incoming requests. Adding `UseAuthentication()` makes it possible for you to require authentication for your controllers.

Controllers need to opt-in to an authentication check, by adding the `[Authorize]` attribute at the top of the controller. Add this in the `TodoController`:

```csharp
[Route("api/[controller]")]
// Add this attribute:
[Authorize]
public class TodoController : Controller
{
    // Existing code...
}
```

With the code you've added to the `Startup` class, plus the `[Authorize]` attribute on the controller, requests to `/api/todo` now require a valid access token to succeed. If you tried running the app now and looking at your browser's network console, you'd see a failed API request:

{% img blog/build-secure-todo-app-vuejs-aspnetcore/api-request-401.png alt:"API request returns 401" width:"700" %}{: .center-image }

Since your frontend code isn't yet attaching a token to the request, the `TodoController` is responding with 401 Unauthorized (access denied).

Open up `actions.js` once more and add a small function at the top that attaches the user's token to the HTTP `Authorization` header:

```js
const addAuthHeader = async (auth) => {
  return {
    headers: { 'Authorization': 'Bearer ' + await auth.getAccessToken() }
  }
}
```

Then, update the code that calls the backend in the `getAllTodos` function:

```js
let response = await axios.get('/api/todo', await addAuthHeader(data.$auth))
```

The Okta Vue SDK (the `$auth` plugin) isn't available in the context of the store, so it's being passed in as part of the `data` payload when the action is dispatched. You can see how this works in `App.vue`:

```js
if (justLoggedIn) {
  this.$store.dispatch('getAllTodos', { $auth: this.$auth })
  // ...
```

Refresh the browser (or start the server) and the request will succeed once again, because the frontend is passing a valid token.

### Add the Okta .NET SDK

Almost done! The final task is to store and retrieve the user's to-do items in the Okta custom profile attribute you set up earlier. You'll use the [Okta .NET SDK](https://www.nuget.org/packages/Okta.Sdk) to do this in a few lines of backend code.

Stop the `dotnet` server (if it's running), and install the Okta .NET SDK in your project:

```bash
dotnet add package Okta.Sdk --version 1.0.0-alpha4
```

Open the `Startup.cs` file again and add this code anywhere in the `ConfigureServices` method:

```csharp
services.AddSingleton<IOktaClient>(new OktaClient(new OktaClientConfiguration
{
    OrgUrl = "https://{yourOktaDomain}",
    Token = Configuration["okta:token"]
}));
```

This makes the Okta .NET SDK available to the whole project as a service. You'll also need to add these lines to the top of the file:

```csharp
using Okta.Sdk;
using Okta.Sdk.Configuration;
```

Remember to replace `yourOktaDomain` with your Okta Org URL.

### Get an Okta API token
The Okta SDK needs an Okta API token to call the Okta API. This is used for management tasks (like storing and retrieving user profile data), and is separate from the Bearer tokens you're using for user authentication.

Generate an Okta API token in the Okta developer console by hovering on API and clicking Tokens. Create a token and copy the value.

The Okta API token is sensitive and should be protected, because it allows you to do any action in the Okta API (including deleting users and applications). You shouldn't store it in code that gets checked into source control. Instead, use the [.NET Secret Manager](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets) tool.

Tip: If you're using Visual Studio 2017 on Windows, you can right-click the project in the Solution Explorer and choose **Manage user secrets**. Then you can skip the installation steps and jump down to adding the secret value with `dotnet user-secrets set`.

Open up the `Vue2Spa.csproj` file and add this line near the existing `DotNetCliToolReference` line:

```xml
<DotNetCliToolReference Include="Microsoft.Extensions.SecretManager.Tools" Version="2.0.0" />
```

The `.csproj` file is the main project file for any ASP.NET Core application. It defines the packages that are installed in the project, and some other metadata. Adding this line installs the Secret Manager tool in this project. Run a package restore to make sure the tool gets installed, and test it out:

```bash
dotnet restore
dotnet user-secrets -h
```

Next, add another line near the top of the `Vue2Spa.csproj` file, right under `<TargetFramework>`:

```xml
<UserSecretsId>(some random value)</UserSecretsId>
```

Generate a [random GUID](https://www.guidgenerator.com/) as the ID value, and save the project file.

Grab the Okta API token value and store it using the Secret Manager:

{% raw %}
```bash
dotnet user-secrets set okta:token {{oktaApiToken}}
```
{% endraw %}

To make the values stored in the Secret Manager available to your application, you need to add it as a configuration source in `Startup.cs`. At the top of the file, in the `Startup` (constructor) method, add this code:

```csharp
// ... existing code
.AddEnvironmentVariables();

// Add this:
if (env.IsDevelopment())
{
    builder.AddUserSecrets<Startup>();
}

// Existing code continues... 
Configuration = builder.Build();
```

With that, the Okta .NET SDK will have an API token it can use to call the Okta API. You'll use the SDK to store and retrieve the user's to-do items.

### Use Okta for user data storage
Remember the `FakeTodoItemService` you created? It's time to replace it with a new service that uses Okta to store the user's to-do items. Create `OktaTodoItemService.cs` in the Services folder:

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Okta.Sdk;
using Vue2Spa.Models;

namespace Vue2Spa.Services
{
    public class OktaTodoItemService : ITodoItemService
    {
        private const string TodoProfileKey = "todos";

        private readonly IOktaClient _oktaClient;

        public OktaTodoItemService(IOktaClient oktaClient)
        {
            _oktaClient = oktaClient;
        }

        private IEnumerable<TodoItemModel> GetItemsFromProfile(IUser oktaUser)
        {
            if (oktaUser == null)
            {
                return Enumerable.Empty<TodoItemModel>();
            }

            var json = oktaUser.Profile.GetProperty<string>(TodoProfileKey);
            if (string.IsNullOrEmpty(json))
            {
                return Enumerable.Empty<TodoItemModel>();
            }

            return JsonConvert.DeserializeObject<TodoItemModel[]>(json);
        }

        private async Task SaveItemsToProfile(IUser user, IEnumerable<TodoItemModel> todos)
        {
            var json = JsonConvert.SerializeObject(todos.ToArray());

            user.Profile[TodoProfileKey] = json;
            await user.UpdateAsync();
        }

        public async Task AddItem(string userId, string text)
        {
            var user = await _oktaClient.Users.GetUserAsync(userId);

            var existingItems = GetItemsFromProfile(user)
                .ToList();

            existingItems.Add(new TodoItemModel
            {
                Id = Guid.NewGuid(),
                Completed = false,
                Text = text
            });

            await SaveItemsToProfile(user, existingItems);
        }

        public async Task DeleteItem(string userId, Guid id)
        {
            var user = await _oktaClient.Users.GetUserAsync(userId);

            var updatedItems = GetItemsFromProfile(user)
                .Where(item => item.Id != id);

            await SaveItemsToProfile(user, updatedItems);
        }

        public async Task<IEnumerable<TodoItemModel>> GetItems(string userId)
        {
            var user = await _oktaClient.Users.GetUserAsync(userId);
            return GetItemsFromProfile(user);
        }

        public async Task UpdateItem(string userId, Guid id, TodoItemModel updatedData)
        {
            var user = await _oktaClient.Users.GetUserAsync(userId);

            var existingItems = GetItemsFromProfile(user)
                .ToList();

            var itemToUpdate = existingItems
                .FirstOrDefault(item => item.Id == id);
            if (itemToUpdate == null)
            {
                return;
            }

            // Update the item with the new data
            itemToUpdate.Completed = updatedData.Completed;
            if (!string.IsNullOrEmpty(updatedData.Text))
            {
                itemToUpdate.Text = updatedData.Text;
            }

            await SaveItemsToProfile(user, existingItems);
        }
    }
}
```

Okta custom profile fields only store primitives likes strings and numbers, but you're using the `TodoModel` type to represent to-do items. This service serializes the `TodoModel` items to a JSON array and stores them as a string. It's not the fastest data storage mechanism, but it works!

Since you've created a new service class, update the line in the `Startup.cs` file to use the `OktaTodoItemService` instead of the `FakeTodoItemService`:

```csharp
services.AddSingleton<ITodoItemService, OktaTodoItemService>();
```

The `TodoController` will now use the new service when it interacts with the `ITodoItemService` interface. Update the controller with some new code and methods:

```csharp
// GET /api/todo
[HttpGet]
public async Task<IActionResult> GetAllTodos()
{
    var userId = User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
    if (string.IsNullOrEmpty(userId)) return BadRequest();

    var todos = await _todoItemService.GetItems(userId);
    var todosInReverseOrder = todos.Reverse();

    return Ok(todosInReverseOrder);
}

// POST /api/todo
[HttpPost]
public async Task<IActionResult> AddTodo([FromBody]TodoItemModel newTodo)
{
    if (string.IsNullOrEmpty(newTodo?.Text)) return BadRequest();

    var userId = User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
    if (string.IsNullOrEmpty(userId)) return BadRequest();

    await _todoItemService.AddItem(userId, newTodo.Text);

    return Ok();
}

// POST /api/todo/{id}
[HttpPost("{id}")]
public async Task<IActionResult> UpdateTodo(Guid id, [FromBody]TodoItemModel updatedData)
{
    var userId = User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
    if (string.IsNullOrEmpty(userId)) return BadRequest();

    await _todoItemService.UpdateItem(userId, id, updatedData);

    return Ok();
}

// DELETE /api/todo/{id}
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteTodo(Guid id)
{
    var userId = User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
    if (string.IsNullOrEmpty(userId)) return BadRequest();

    try
    {
        await _todoItemService.DeleteItem(userId, id);
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message);
    }

    return Ok();
}
```

And add one more `using` statement at the top:

```csharp
using Vue2Spa.Models;
```

In each method, the first step is to extract the user's ID from the Bearer token attached to the incoming request. The ID is then passed along to the service method, and the Okta .NET SDK uses it to find the right user's profile.

Finish out the frontend code by adding the last few actions to `actions.js`:

```js
async addTodo({ dispatch }, data) {
  await axios.post(
    '/api/todo',
    { text: data.text },
    await addAuthHeader(data.$auth))

  await dispatch('getAllTodos', { $auth: data.$auth })
},

async toggleTodo({ dispatch }, data) {
  await axios.post(
    '/api/todo/' + data.id,
    { completed: data.completed },
    await addAuthHeader(data.$auth))

  await dispatch('getAllTodos', { $auth: data.$auth })
},

async deleteTodo({ dispatch }, data) {
  await axios.delete('/api/todo/' + data.id, await addAuthHeader(data.$auth))
  await dispatch('getAllTodos', { $auth: data.$auth })
}
```

Start the server once more with `dotnet run` and try adding a real to-do item to the list:

{% img blog/build-secure-todo-app-vuejs-aspnetcore/final-app.png alt:"Final to-do application" width:"500" %}{: .center-image }


## Build Secure Apps with ASP.NET Core and Vue.js
If you made it all the way to the end, congratulations! I'd love to hear about what you built. Shoot me a tweet [@nbarbettini](https://twitter.com/nbarbettini) and tell me about it!

Feel free to download the final project's [code on GitHub](https://github.com/oktadeveloper/okta-vuejs-aspnetcore-todo-example).

If you want to keep building, here's what you could do next:
- Add a form in Vue (and a controller on the backend) to let a new user create an account
- Store a timestamp when a new to-do item is added, and display it with each item
- Speed up the frontend by storing changes in the Vuex store immediately (before the API response arrives)

For more Vue.js inspiration, check out some other recent posts:

* [The Lazy Developer's Guide to Authentication with Vue.js](https://developer.okta.com/blog/2017/09/14/lazy-developers-guide-to-auth-with-vue)
* [Build a Cryptocurrency Comparison Site with Vue.js](https://developer.okta.com/blog/2017/09/06/build-a-cryptocurrency-comparison-site-with-vuejs)

Happy coding!
