---
layout: blog_post
title: "Build a Simple CRUD App with ASP.NET Core and Vue"
author: ibrahim
description: "This tutorial walks you through building a basic CRUD application with ASP.NET Core and Vue.js."
tags: [aspnet, aspnetcore, vue, vuejs, vue.js]
tweets:
- "Wanna build an app using #aspnetcore and @vuejs? We've got you covered!"
- "If you need to learn more about using #aspnetcore and @vuejs to build application, check this out!"
- "Need to learn the basics of building a CRUD app with #aspnetcore and @vuejs? Check out @ibrahimsuta's latest post!"
---

Keeping an eye on your daily calorie intake can be crucial to healthy lifestyle. There are a ton of apps on the market that will help you do this, but may be bloated with extra features or just full of ads. The app we'll build today is a bare-bones stand-in for any of those, as a demonstration of these technologies, and a great stand-in if simple calorie tracking is all you really need.


## Why ASP.NET Core and Vue?

You are probably asking why should we go with Vue if there are trusted, established players like Angular and React. Well, it turns out that Vue is a lot easier to get started with and you don't have to learn JSX or TypeScript, it is simply a pure, vanilla JavaScript. In my opinion, Vue is as fast as React and simpler than original AngularJS (Angular 1). Vue is also a lot less opinionated about the way you approach your code. Furthermore, it's bundle size is much smaller when compared to Angular and React.

Vue's popularity keeps increasing. In fact, it's been rising so fast that it has over 110K stars on GitHub! It ranks as the 3rd most starred repository on GitHub and most starred JavaScript library/framework.

ASP.NET Core is another bright and rising star, which takes the best from Rails and Node.js worlds. ASP.NET MVC itself was in many ways a copy of Rails, with many concepts and features borrowed from Rails. ASP.NET Core takes the modularity of Node packages and the middleware concept from Express, the most popular web framework in Node world. However, it still contains all of the old MVC and Web API features, which makes it super powerful for building any kind of web applications.

The web framework has been rewritten from scratch, made cross-platform and it's the fastest mainstream web framework out there by various [benchmarks](https://www.techempower.com/benchmarks/#section=test&runid=283e5ea5-7d26-4ed6-bf47-62b9dcbdb9ea&hw=ph&test=plaintext). Also, more than welcome addition in ASP.NET Core 2 is a new, page-oriented development approach with [Razor Pages](https://docs.microsoft.com/en-us/aspnet/core/razor-pages/?view=aspnetcore-2.1&tabs=visual-studio). Hence, by choosing ASP.NET Core for any kind of web applications, you really can't go wrong.


## Prerequisites for this ASP.NET Core + Vue App

First of all, you need Node and npm installed; you can get them from the official [Node site](https://nodejs.org/en/download/).

You will also need [Vue CLI tools](https://github.com/vuejs/vue-cli).

To install, simply execute the following command in PowerShell or in your favorite bash:

```sh
npm install -g vue-cli@2.9.6
```

After you make sure you have all that installed, you will need to install the [.NET Core SDK](https://www.microsoft.com/net/download).

After that, you are ready. This demo will use VS Code, but feel free to use your preferred editor.


## Create the Vue Application

For this tutorial, you'll use the official [Vue CLI](https://github.com/vuejs/vue-cli) to make the process of bootstrapping a new template application as smooth as possible. You'll use the [PWA template](https://github.com/vuejs-templates/pwa) for Vue.js applications.

Create a root folder for all of your source files, including backend and frontend code, and name the folder `FoodTracker`. Inside of that folder create a folder named `Vue` and folder named `AspNetCore`.

Inside of `Vue` folder, initialize the new Vue application:

```sh
vue init pwa food-tracker  .
```
Make sure you install the `vue-router` as well when you are asked to. You can simply leave all the defaults (and press enter) except for last four:

```sh
? Install vue-router? Yes
? Use ESLint to lint your code? No
? Setup unit tests with Karma + Mocha? No
? Setup e2e tests with Nightwatch? No
```
You can now proceed with the instructions you get from the CLI:


```sh
cd food-tracker
npm install
npm run dev
```

Your default browser should now open up at `http://localhost:8080/#/` and display the homepage of starter Vue.js PWA template.

{% img blog/netcore-vue-crud/default-vue-app.png alt:"Default Vue Homepage" width:"800" %}{: .center-image }


## Add Bootstrap to the Vue Project

You will install the most popular Bootstrap package for Vue, [bootstrap-vue](https://github.com/bootstrap-vue/bootstrap-vue). It might not be the official package since there is no official Bootstrap Vue plugin, but with 6k stars and over 150 contributors, it's a great choice.

Use the latest version, which is at the time of writing this post 2.0 RC11:

```sh
npm i bootstrap-vue@2.0.0-rc.11
```

Now register the BootstrapVue plugin inside your `main.js` file (inside `src` folder):

```js
import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue);
```

And after that, import Bootstrap and Bootstrap-Vue css files:

```js
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
```

After you apply those changes, this is how your `main.js` file should look:

```js
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import router from './router'

Vue.use(BootstrapVue)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
```


## Create the Basic Layout for Your Vue.js Application

You can find the main layout for Vue.js template inside of `App.vue` file, which is located in `src` folder. The template uses the [router-view](https://router.vuejs.org/en/api/router-view) component to render appropriate component for the current location.

Replace the content of your `App.vue` file with the following code:

```html
<template>
  <div id="app">
    <header>
      <b-navbar toggleable="md" type="light" variant="light">
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-navbar-brand to="/">Food Tracker</b-navbar-brand>
        <b-collapse is-nav id="nav-collapse">
          <b-navbar-nav>
            <b-nav-item href="#" @click.prevent="login" v-if="!user">Login</b-nav-item>
            <b-nav-item href="#" @click.prevent="logout" v-else>Logout</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>

  export default {
    name: 'app',
    data () {
      return {
        user: null
      }
    },
    methods: {
      login () {

      },
      async logout () {

      }
    }
  }
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
  margin-top: 40px;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #f8f9fa;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}
</style>
```

While you are changing the files for layout, you will also do the cleanup of your `Hello` component which is used for the main page. Replace the content of `Hello.vue` with the following:

{% raw %}
```html
<template>
  <div class="hello">
	<h1>{{ title }}</h1>
	<h2>Take care of your daily calories intake</h2>
  </div>
</template>

<script>
export default {
  data () {
	  return {
  	  title: 'Food Tracker Application'
	  }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #35495E;
}
</style>
```
{% endraw %}


## Set Up Authentication for Your Vue Application

Handling the authentication is never an easy or comfortable task. If you want to quickly and easily take care of authentication for your application then you should probably use a solution that just works and preferably one that is actively maintained by someone else. That's why people love and use Okta, it takes a minimum amount of your time to get started with Okta and secure your existing application.

Sign up for a [forever-free developer account](https://developer.okta.com/signup/) (or log in if you already have one).

{% img blog/netcore-vue-crud/okta-sign-up.png alt:"Okta Signup Page" width:"800" %}{: .center-image }

After you have completed your login (and registration) you should see the Dashboard and in the upper right corner, there should be your unique Org URL. Save it for later.

{% img blog/netcore-vue-crud/okta-dashboard.png alt:"Okta dashboard" width:"800" %}{: .center-image }

Now you need to create a new application by browsing to the Applications tab and clicking Add Application, and from the first page of the wizard choose **Single-Page App**.

{% img blog/netcore-vue-crud/okta-spa-app.png alt:"Okta spa app" width:"800" %}{: .center-image }

On the settings page, enter `FoodTracker` as your name value.

{% img blog/netcore-vue-crud/food-tracker-app-settings.png alt:"Food Tracker app settings" width:"800" %}{: .center-image }

You can leave the other default values unchanged, and click **Done**.

Now that your application has been created, copy down the Client ID from the following page, you'll need it soon (of course, yours will be different).

{% img blog/netcore-vue-crud/okta-client-credentials.png alt:"Okta client credentials" width:"800" %}{: .center-image }

Before proceeding, install the Okta SDK for Vue.js:

```sh
npm install @okta/okta-vue@1.0.1
```

With this installed, you can handle the authentication part for Vue.js and add the necessary routes. Locate the `index.js` file inside of `src/router` folder and replace its content with this code:

```js
// Vue imports
import Vue from 'vue'
import Router from 'vue-router'

// 3rd party imports
import Auth from '@okta/okta-vue'

// our own imports
import Hello from '@/components/Hello'

Vue.use(Auth, {
  issuer: 'https://{yourOktaDomain}/oauth2/default',
  client_id: '{yourClientId}',
  redirect_uri: 'http://localhost:8080/implicit/callback',
  scope: 'openid profile email'
})

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
	{
  	path: '/',
  	name: 'Hello',
  	component: Hello
	},
	{
  	path: '/implicit/callback',
  	component: Auth.handleCallback()
	},
  ]
})

router.beforeEach(Vue.prototype.$auth.authRedirectGuard())

export default router
```

Take a look at the code and the part of the code where we make use of `Auth` import:

```js
Vue.use(Auth, {
  issuer: 'https://{yourOktaDomain}/oauth2/default',
  client_id: '{yourClientId}',
  redirect_uri: 'http://localhost:8080/implicit/callback',
  scope: 'openid profile email'
})
```

You will notice that you need to replace `{yourClientId}` with your Client ID from your Okta Application and `{yourOktaDomain}` with your Okta domain that we saved previously. This part of code adds the Okta's `Auth` plugin to your Vue application and makes sure that your application is using Okta for authentication, and that users get redirected to Okta's login page when they try to log in.

Since `redirect_uri` is the value that OpenID Connect (OIDC) providers use to redirect the user back to the original application, you will need to handle that case within our routes. Therefore, you added `implicit/callback` as a separate route, that will  trigger the Okta component:

```js
{
	path: '/implicit/callback',
	component: Auth.handleCallback()
}
```

When dealing with authentication and authorization for frontend applications you realize you also need to handle your protected routes. Vue's router is powerful enough to allow you to do global and individual [navigation(auth) guards](https://router.vuejs.org/guide/advanced/navigation-guards.html). Navigation guards are used to secure navigations(routes) either by redirecting to somewhere else or cancelling the navigation. You can hook into the navigation process globally, per-route or in-component.

Okta's SDK for Vue.js comes with predefined means to check if the user can access the route or not:

```js
Vue.prototype.$auth.authRedirectGuard()
```

That is what you added[`beforeEach` guard](https://router.vuejs.org/guide/advanced/navigation-guards.html#global-guards) to the global:

```js
router.beforeEach(Vue.prototype.$auth.authRedirectGuard())
```

After this, if you want some routes to be guarded you can simply add auth metadata to it:

```js
meta: {
  requiresAuth: true
}
```


## Complete Layout for Your Vue App

After you've added Okta to your Vue.js application, it's time to make changes inside your layout page to ensure that login and logout actually work.

Locate the `App.vue` file inside of `src` folder and replace code inside of `script` tags with the following:

```js
export default {
  name: 'app',
  data() {
    return {
      user: null
    }
  },
  async created() {
    await this.refreshUser()
  },
  watch: {
    '$route': 'onRouteChange'
  },
  methods: {
    login() {
      this.$auth.loginRedirect()
    },
    async onRouteChange() {
      // every time a route is changed refresh the user details
      await this.refreshUser()
    },
    async refreshUser() {
      // get new user details and store it to user object
      this.user = await this.$auth.getUser()
    },
    async logout() {
      await this.$auth.logout()
      await this.refreshUser()
      this.$router.push('/')
    }
  }
}
```
Here you are watching for route changes and then refreshing the user details every time a route change happens. You are making use of Okta's `this.$auth.getUser()` mechanism to get current user details. You can also use Okta's to redirect user to the login page, by using the `this.$auth.loginRedirect()` method.

At logout, you call Okta's `this.$auth.logout()` method, and it will handle the logout process for us.


## Add a Food Records Page to Your ASP.NET Core + Vue App

Before actually building the Food Records page you'll want to make a file that will serve as an API service for your food records.

First, we will install a HTTP client for our Vue application. Run the following in your bash:

```sh
npm install axios --save
```

Inside of `src` folder create a new file named `FoodRecordsApiService.js` and paste the following inside:

```js
import Vue from 'vue'
import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:5000/api/FoodRecords',
  json: true
})

export default {
  async execute(method, resource, data) {
    const accessToken = await Vue.prototype.$auth.getAccessToken()
    return client({
      method,
      url: resource,
      data,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(req => {
      return req.data
    })
  },
  getAll() {
    return this.execute('get', '/')
  },
  create(data) {
    return this.execute('post', '/', data)
  },
  update(id, data) {
    return this.execute('put', `/${id}`, data)
  },
  delete(id) {
    return this.execute('delete', `/${id}`)
  }
}
```

With `FoodRecordsApiService` available you can proceed to create a component for food records. Inside of `src/components` folder create a new file `FoodRecords.vue` and paste the following code: 

{% raw %}
```html
<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">Food Records</h1>
    <b-alert : show="loading" variant="info">Loading...</b-alert>
    <b-row>
      <b-col>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Value</th>
              <th>Date Time</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in records" : key="record.id">
              <td>{{ record.id }}</td>
              <td>{{ record.name }}</td>
              <td>{{ record.value }}</td>
              <td>{{ record.dateTime }}</td>
              <td class="text-right">
                <a href="#" @click.prevent="updateFoodRecord(record)">Edit</a> -
                <a href="#" @click.prevent="deleteFoodRecord(record.id)">Delete</a>
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>
      <b-col lg="3">
        <b-card : title="(model.id ? 'Edit Food ID#' + model.id : 'New Food Record')">
          <form @submit.prevent="createFoodRecord">
            <b-form-group label="Name">
              <b-form-input type="text" v-model="model.name"></b-form-input>
            </b-form-group>
            <b-form-group label="Value">
              <b-form-input rows="4" v-model="model.value" type="number"></b-form-input>
            </b-form-group>
            <b-form-group label="Date Time">
              <b-form-input rows="4" v-model="model.dateTime" type="datetime-local"></b-form-input>
            </b-form-group>
            <div>
              <b-btn type="submit" variant="success">Save Record</b-btn>
            </div>
          </form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import api from '@/FoodRecordsApiService';

  export default {
    data() {
      return {
        loading: false,
        records: [],
        model: {}
      };
    },
    async created() {
      this.getAll()
    },
    methods: {
      async getAll() {
        this.loading = true

        try {
          this.records = await api.getAll()
        } finally {
          this.loading = false
        }
      },
      async updateFoodRecord(foodRecord) {
        // We use Object.assign() to create a new (separate) instance
        this.model = Object.assign({}, foodRecord)
      },
      async createFoodRecord() {
        const isUpdate = !!this.model.id;

        if (isUpdate) {
          await api.update(this.model.id, this.model)
        } else {
          await api.create(this.model)
        }

        // Clear the data inside of the form
        this.model = {}

        // Fetch all records again to have latest data
        await this.getAll()
      },
      async deleteFoodRecord(id) {
        if (confirm('Are you sure you want to delete this record?')) {
          // if we are editing a food record we deleted, remove it from the form
          if (this.model.id === id) {
            this.model = {}
          }

          await api.delete(id)
          await this.getAll()
        }
      }
    }
  }
</script>
```
{% endraw %}

Now it's time to add this component to the main menu and make sure our router renders the component once we navigate to `/food-records`. Inside of your Vue application, update the `src/router/index.js` file. Add the following to the list of routes:

```js
{
  path: '/food-records',
  name: 'FoodRecords',
  component: FoodRecords,
  meta: {
    requiresAuth: true
  }
},
```

That could be placed under the following:

```js
{
  path: '/implicit/callback',
  component: Auth.handleCallback()
},
```

After adding the route to our router we can add a link to this route. We will do this by changing our layout. Locate the `src/App.vue` file and add the following above the link for Login:

```html
<b-nav-item to="/food-records">Food Records</b-nav-item>
```

Your navbar should now look like this:

```html
<b-navbar toggleable="md" type="light" variant="light">
  <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
  <b-navbar-brand to="/">Food Tracker</b-navbar-brand>
  <b-collapse is-nav id="nav-collapse">
    <b-navbar-nav>
      <b-nav-item to="/food-records">Food Records</b-nav-item>
      <b-nav-item href="#" @click.prevent="login" v-if="!user">Login</b-nav-item>
      <b-nav-item href="#" @click.prevent="logout" v-else>Logout</b-nav-item>
    </b-navbar-nav>
  </b-collapse>
</b-navbar>
```


## Build the ASP.NET Core API

Inside of your main folder `food-records` navigate to AspNetCore folder and run the following:

```sh
dotnet new webapi
```

This will create a basic template for ASP.NET Core Web API application.


### Set Up You Database Connection

Now you'll need to set up your connection with the database. For this tutorial, you'll use the SQLite database, so you'll need to install the required NuGet package. Inside of your bash/terminal/cmd/powershell enter the following:

```sh
dotnet add package Microsoft.EntityFrameworkCore.Sqlite --version 2.1.1
```

And now you can set up the connection string for your database. Change the content of `appsettings.json` by adding the following above the `Logging` section:

```json
"ConnectionStrings": {
  "DefaultConnection": "Data Source=Database.db"
},
```

Inside your ASP.NET Core project create a new file `ApplicationDbContext.cs` that contains the following:

```cs
using Microsoft.EntityFrameworkCore;

namespace AspNetCore.Controllers {
  public class ApplicationDbContext : DbContext
  {
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    { }

    public DbSet<FoodRecord> FoodRecords { get; set; }
  }
}
```

Time to add DbContext to your application. Inside of the`Startup` class, locate the `ConfigureServices` method add the following to the beginning:

```cs
var connectionString = Configuration.GetConnectionString("DefaultConnection");
services.AddDbContext<ApplicationDbContext>(options => options.UseSqlite(connectionString));
```

This retrieves the connection string from our configuration (`appsettings.json` file) and adds the DbContext to our ASP.NET Core application, to its DI container. We also make sure to specify the connection string that will be used by our DbContext.


## Create FoodRecord model 

Then change the `Configure` method inside of `Startup` class to look like this:

```cs
public void Configure(IApplicationBuilder app, IHostingEnvironment env, ApplicationDbContext dbContext)
{
  if (env.IsDevelopment())
  {
    app.UseDeveloperExceptionPage();
  }
  
  dbContext.Database.EnsureCreated();
    
  app.UseMvc();
}
```


### Create Your Model

Inside your main project let's make a class `FoodRecord`:

```cs
public class FoodRecord
{
  public string Id { get; set; }

  public string Name { get; set; }

  public decimal Value { get; set; }

  public DateTime DateTime { get; set; }
}
```


### Enable CORS

Inside of `ConfigureServices` method within `Startup` class add the following:

```cs
services.AddCors(options =>
{
  options.AddPolicy("VueCorsPolicy", builder =>
    {
      builder
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
        .WithOrigins("http://localhost:8080");
    });
});
```

And inside of `Configure` method, after `if-else` block, add the following:

```cs
app.UseCors("VueCorsPolicy");
```


## Set Up Your ASP.NET Core API Endpoints

You will use the controller as your endpoint source for the API. Add a `FoodRecordsController.cs` class inside of your controllers folder. Paste the following code:

```cs
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AspNetCore.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class FoodRecordsController : ControllerBase
  {
    private readonly ApplicationDbContext _dbContext;

    public FoodRecordsController(ApplicationDbContext dbContext)
    {
      _dbContext = dbContext;
    }

    // GET api/foodrecords
    [HttpGet]
    public async Task<ActionResult<List<FoodRecord>>> Get()
    {
      return await _dbContext.FoodRecords.ToListAsync();
    }

    // GET api/foodrecords/5
    [HttpGet("{id}")]
    public async Task<ActionResult<FoodRecord>> Get(string id)
    {
      return await _dbContext.FoodRecords.FindAsync(id);
    }

    // POST api/foodrecords
    [HttpPost]
    public async Task Post(FoodRecord model)
    {
      await _dbContext.AddAsync(model);
      
      await _dbContext.SaveChangesAsync();
    }

    // PUT api/foodrecords/5
    [HttpPut("{id}")]
    public async Task<ActionResult> Put(string id, FoodRecord model)
    {
      var exists = await _dbContext.FoodRecords.AnyAsync(f => f.Id == id);
      if (!exists)
      {
        return NotFound();
      }

      _dbContext.FoodRecords.Update(model);
      
      await _dbContext.SaveChangesAsync();

      return Ok();

    }

    // DELETE api/foodrecords/5
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
      var entity = await _dbContext.FoodRecords.FindAsync(id);

      _dbContext.FoodRecords.Remove(entity);
      
      await _dbContext.SaveChangesAsync();
      
      return Ok();
    }
  }
}
```


## Secure Your ASP.NET Core API

Adding authorization to ASP.NET Core with help of Okta is dead simple. You don't even need to install any additional NuGet packages.

First, add the Okta details to your `appsettings.json` file. Above `Logging` section, add the following:

```json
"Okta": {
  "ClientId": "{OktaClientId}",
  "ClientSecret": "{OktaClientSecret}",
  "Authority": "https://{yourOktaDomain}/oauth2/default"
},
```

Add the following namespace at the top of `Startup.cs` file:

```cs
Microsoft.AspNetCore.Authentication.JwtBearer;
```

After that, add the details about your identity provider to your application. Inside of `ConfigureServices` method add the following:

```cs 
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(options =>
            	{
                	options.Authority = Configuration["Okta:Authority"];
                	options.Audience = "api://default";
            	});
```

After that, add the following to the `Configure` method, above the `app.UseMvc();` line:

```cs
app.UseAuthentication();
```

Now you can protect your endpoints by adding an authorization attribute to your controller. Go to `FoodRecordsController.cs` file, add the following namespace:

```cs
Microsoft.AspNetCore.Authorization
```

Above the `[ApiController]` attribute add the following:

```cs
[Authorize]
```


## Test out the application

Let's give our application a spin. Run the ASP.NET Core by running the following in your bash inside of `AspNetCore` folder:

```sh
dotnet run
```

You can now start the Vue application by running the following in your bash inside of `Vue/food-tracker` folder:

```sh
npm run dev
```

Your default browser should now open and show a page like this:

{% img blog/netcore-vue-crud/food-tracker-homepage.png alt:"Food tracker homepage" width:"800" %}{: .center-image }

After a successful login, navigate to Food Records page:

{% img blog/netcore-vue-crud/food-tracker-food-records.png alt:"Food Tracker food records page" width:"800" %}{: .center-image }

You should now be able to add and delete records.


## Learn More About Vue, ASP.NET Core, and Okta

With release of ASP.NET Core 2 a bunch of Microsoft's libraries are baked into the SDK and you get access to those libraries when you create new applications. This is achieved through the `Microsoft.AspNetCore.App` NuGet meta-package, which allows us to use the built-in `JwtBearerAuthentication` middleware. It makes the the process of adding token authentication to your application smoothless. If you are dealing with a standard OpenID Connect server the configuration takes only few lines of code.

If you are new to Vue, I hope you found it interesting enough to explore it more and give it a try for your next project. With help of Okta's Vue SDK, doing authentication and authorization on client side is easier than ever.

Hopefully this article was helpful for you and you now realize how easy it is to add authentication to ASP.NET Core APIs and Vue.js applications.

You can find the source code for complete application at [https://github.com/oktadeveloper/okta-aspnetcore-vue-crud-example](https://github.com/oktadeveloper/okta-aspnetcore-vue-crud-example).

If you want to read more about Okta, Vue or ASP.NET Core check out the Okta Dev Blog. This post was not-so-loosely based on [Build a Basic CRUD App with Vue.js and Node](/blog/2018/02/15/build-crud-app-vuejs-node), which I would definitely recommend checking out if you're interested in learning more about Vue.js.

Here are some other great articles to check out as well:

* [The Ultimate Guide to Progressive Web Applications](/blog/2017/07/20/the-ultimate-guide-to-progressive-web-applications)
* [The Lazy Developer's Guide to Authentication with Vue.js](/blog/2017/09/14/lazy-developers-guide-to-auth-with-vue)
* [Build a Secure CRUD App with ASP.NET Core and React](/blog/2018/07/02/build-a-secure-crud-app-with-aspnetcore-and-react)
* [Token Authentication in ASP.NET Core 2.0 - A Complete Guide](/blog/2018/03/23/token-authentication-aspnetcore-complete-guide)

And as always, we'd love to hear from you. Hit us up with questions or feedback in the comments, or on Twitter [@oktadev](https://twitter.com/oktadev)!
