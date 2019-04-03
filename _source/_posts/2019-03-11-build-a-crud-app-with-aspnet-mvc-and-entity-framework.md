---
layout: blog_post
title: "Build a CRUD App with ASP.NET MVC and Entity Framework"
author: quorralyne
description: "This post walks through setting up a user managed CRUD app in ASP.NET MVC with Entity Framework."
tags: [ aspnet, entityframework, okta, dotnet, crud, usermanagement ]
tweets:
- "Build a CRUD app that your users can write data in with Okta and ASP.NET! →"
- "Wondering what it's like to build a CRUD app in ASP.NET framework with user management that's actually easy? @quorralyne has you covered! →"
- "Get your CRUD app going with ASP.NET, Entity Framework and Okta! →"
image: blog/featured/okta-dotnet-skew.jpg
---

Interested in building a secure ASP.NET MVC website that allows users to handle their own data with ease? Let's walk through creating a basic application that allows the creation, reading, updating, and deletion of data (CRUD) with Entity Framework by your users while managing them easily with Okta. For a fun example, we will create a web application that lists upcoming rocket launches for space enthusiasts! You will have everything you need to get up and running by the end of this post.


## What Does Your ASP.NET MVC + Entity Framework App Need to Do?

For the purposes of this tutorial, here are the requirements you'll need to fulfill:

* _Users must sign in to see a specific page (i.e. a gated flow)_
* _Users must be able to create and read data_
* _The app should display user-specific data, i.e. name_

Be sure to have Visual Studio and the latest ASP.NET Framework (4.x) version installed on your development machine before you continue. We will walk through installing the other dependencies together. Let's get started!

{% img blog/aspnet-mvc-crud/oktarocket.png alt:"Okta Rocket" width:"800" %}{: .center-image }

## Create Sample Users for Your ASP.NET MVC App

For this tutorial, you'll use Okta for user creation and authentication. 

Why use Okta for authentication? Okta makes identity management easier, more secure, and more scalable than what you're used to. Okta is an API service that allows you to create, edit, and securely store user accounts and user account data, and connect them with one or more applications.

If you haven't already, go to [developer.okta.com](https://developer.okta.com/) and create an account to get started, then continue with the following steps.

Visit the **Users** tab and click **Add Person**. Fill out the form and be sure to set the Password drop down to "Set by Admin", and fill in a temporary password for the user. Click **Save and Add Another** and continue adding a couple more users. 

{% img blog/aspnet-mvc-crud/okta-add-person.png alt:"Add person" width:"800" %}{: .center-image }

Once you have the users added, you'll notice the status for your newly created users is set to "Password expired". This is expected for admin-created users and will guide them through their reset password flow during the first login to your site - without any additional work on your part. 

{% img blog/aspnet-mvc-crud/okta-user-dashboard.png alt:"User dashboard" width:"800" %}{: .center-image }

## Set Up Your ASP.NET MVC Application in Okta

Now that you have your users set up in your database, set up this specific application within Okta. On the Dashboard, click **Applications** in the main menu and on the Application screen, click **Add Application**. Select **Web** and then click **Next**.

{% img blog/aspnet-mvc-crud/okta-create-new-app.png alt:"User dashboard" width:"800" %}{: .center-image }

Name the application "Okta MVC CRUD App". Select **Implicit (Hybrid)** in addition to the pre-selected Authorization Code, and click **Done**.

{% img blog/aspnet-mvc-crud/okta-app-settings-done.png alt:"App settings" width:"800" %}{: .center-image }

Your application has been created, but you still need to add the logout redirect now that the field is available. Select **Edit**, add the URI `http://localhost:8080/Account/PostLogout`, and click **Save**.

{% img blog/aspnet-mvc-crud/okta-general-settings.png alt:"General settings" width:"800" %}{: .center-image }

Scroll down and you'll have access to the ClientID and Client Secret. Keep these on hand to add to your application's `Web.config` file later on. Now your app is good to go for Okta auth!

{% img blog/aspnet-mvc-crud/okta-app-dashboard.png alt:"App dashboard" width:"800" %}{: .center-image }

## Create an ASP.NET MVC Application with Entity Framework using a LocalDB Connection

Click **File** > **New** > **Project**. Select **Visual C#** then select **ASP.NET Application**. Choose **MVC** and name it "CrudMVCCodeFirst".

Right-click on the project and select **Properties**. Go to the Web tab and set the project URL to reflect the application settings in Okta's portal `https://localhost:8080`.

{% img blog/aspnet-mvc-crud/vs-project-settings-url.png alt:"Visual Studio project settings URL" width:"800" %}{: .center-image }

Right-click on the project and select **Manage NuGet Packages**. Tap on **Browse** and search for Entity Framework. Install version 6.2.0. 

{% img blog/aspnet-mvc-crud/vs-nuget-ef.png alt:"Visual Studio NuGet Entity Framework" width:"800" %}{: .center-image }

Open the Web.config and add your connection string inside the configuration element to use LocalDB using the code below.

```xml
<connectionStrings>
    <add name="LaunchContext" 
	connectionString="Data Source=(LocalDb)\MSSQLLocalDB;Initial 
        Catalog=RocketLaunch1;Integrated Security=SSPI;" 
	providerName="System.Data.SqlClient" />
  </connectionStrings>
```
>You will be using Entity Framework to create database entities. This code first approach eliminates the need for you to define a database. Instead, the first time you access your data by running the app, Entity Framework will create your database for you using LocalDB as your database engine.

Create a class in the `Models` folder called `LaunchEntry.cs` and add the properties below. 


```csharp
public class LaunchEntry
{
    public int Id { get; set; }
    public string LaunchInfo { get; set; }
    public string PostedByUserName { get; set; }
}
```

Create a folder at the project level called `Data` and add a class inside of it called `LaunchContext.cs` Add `System.Data.Entity`, `CrudMVCCodeFirst.Models` and `System.Data.Entity.ModelConfiguration.Conventions` to the `usings` at the top of the file and extend the class with `DBContext`. Now you can add your `DbSets`. The name of the connection string in your `Web.config` is passed into the constructor. Add the code below. 

```csharp
public class LaunchContext : DbContext
{
    public LaunchContext() : base("LaunchContext")
    {
    }

    public DbSet<LaunchEntry> Launches { get; set; }

    protected override void OnModelCreating(DbModelBuilder modelBuilder)
    {
        modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
    }
}
```
>The code in the `OnModelCreating()` method prevents table names from being pluralized. If you didn't do this, the generated tables in the database would be named LaunchEntries. Instead, the table name will be LaunchEntry. This tutorial utilizes singular form, but you can select whichever form you prefer by including or omitting this overridden method.

Right-click on the `Controller` folder and add a new scaffolded item. 

{% img blog/aspnet-mvc-crud/vs-new-scaffold-item.png alt:"Visual Studio add a new scaffold item" width:"800" %}{: .center-image }

Select **MVC 5 Controller with views, using Entity Framework** and click **Add**. 

{% img blog/aspnet-mvc-crud/vs-mvc-ef-add.png alt:"Visual Studio add MVC EF controller" width:"800" %}{: .center-image }

Select "LaunchEntry" as the Model class and "LaunchContext" as the Data context class. Set the controller name to "LaunchController", leave the other default values and click **Add**.

{% img blog/aspnet-mvc-crud/vs-add-controller-ef.png alt:"Visual Studio add controller" width:"600" %}{: .center-image }

>The scaffolder will create a `LaunchController.cs` file and a set of views for it (`.cshtml` files)


Because this is a claims-aware application, we need to indicate where to get user identity information from. Open your `Global.asax.cs file`. Add `System.Web.Helpers` to the `usings` group. Replace the `Application_Start()` method with the code below to match the name of claim type - "name" in this case - from the JsonWebToken (JWT) you are receiving from Okta to set your user's identifier.


```csharp
protected void Application_Start()
{
    AreaRegistration.RegisterAllAreas();
    FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
    RouteConfig.RegisterRoutes(RouteTable.Routes);
    BundleConfig.RegisterBundles(BundleTable.Bundles);
            
    AntiForgeryConfig.UniqueClaimTypeIdentifier = "name";
}

```

Go into `Views/Shared` and open `_Layout.cshtml`. Add a link to your Launch controller's newly generated `Index` page by replacing the unordered list with the class `nav navbar-nav` with the code below. This will allow you to navigate to the launch controller from the home page of the site.


```html
<ul class="nav navbar-nav">
    <li>@Html.ActionLink("Launches", "Index", "Launch")</li>
    <li>@Html.ActionLink("Home", "Index", "Home")</li>
    <li>@Html.ActionLink("About", "About", "Home")</li>
    <li>@Html.ActionLink("Contact", "Contact", "Home")</li>
</ul>
```


Run the project in the browser. You should see your **Launches** link in the navigation bar. Select it to access the `Index` page, and add a launch or two, adding your name and editing a bit. 

{% img blog/aspnet-mvc-crud/browser-aspnet-default.png alt:"ASP.NET site default page" width:"800" %}{: .center-image }

{% img blog/aspnet-mvc-crud/browser-create-page.png alt:"Create page" width:"800" %}{: .center-image }

{% img blog/aspnet-mvc-crud/browser-index-page.png alt:"Index page" width:"800" %}{: .center-image }

## Add the Okta .NET SDK to your ASP.NET MVC App

Congrats, you have a working CRUD application that lets you keep track of rocket launches! However - right now anyone can access the Launch page. Let's add functionality to authenticate users to give only specific people access to that and hide it from public view.

Right-click on the project and select Manage NuGet Packages. Tap on Browse and search for `Okta.AspNet`. This is the .NET 4.x framework version of the SDK. Find version 1.1.4 and click **Install**.

{% img blog/aspnet-mvc-crud/vs-nuget-okta.png alt:"Visual Studio NuGet install Okta.AspNet" width:"800" %}{: .center-image }

>Additionally, you need to install `Microsoft.Owin.Host.SystemWeb` version 4.0.1 and `Microsoft.Owin.Security.Cookies` version 4.0.1. These libraries will assist us in accessing the token data in our code.

Add the Okta account access to your `Web.config` file under the `appSettings` section. Use the code below, replacing the Okta client ID and secret with your specific app's Okta credentials you generated in the portal earlier.


```xml
<!-- 1. Replace these values with your Okta configuration -->
    <add key="okta:ClientId" value="{clientId}" />
    <add key="okta:ClientSecret" value="{clientSecret}" />
    <add key="okta:OktaDomain" value="https://{yourOktaDomain}" />

    <add key="okta:RedirectUri" value="http://localhost:8080/authorization-code/callback" />
    <add key="okta:PostLogoutRedirectUri" value="http://localhost:8080/Account/PostLogout" />
```

In order to handle OWIN, we need to do that from a Startup class. Right-click on the project and select **Add OWIN Startup** class. Call it "Startup" and click **OK**.

{% img blog/aspnet-mvc-crud/vs-add-owin.png alt:"Visual Studio Add OWIN Startup file" width:"800" %}{: .center-image }

Add the following to your `usings` section. 

```cs
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Okta.AspNet;
using System.Collections.Generic;
using System.Configuration;
```

Replace the `Configuration()` method with the code below.


```csharp
public void Configuration(IAppBuilder app)
{
    app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

    app.UseCookieAuthentication(new CookieAuthenticationOptions());

    app.UseOktaMvc(new OktaMvcOptions()
    {
        OktaDomain = ConfigurationManager.AppSettings["okta:OktaDomain"],
        ClientId = ConfigurationManager.AppSettings["okta:ClientId"],
        ClientSecret = ConfigurationManager.AppSettings["okta:ClientSecret"],
        RedirectUri = ConfigurationManager.AppSettings["okta:RedirectUri"],
        PostLogoutRedirectUri = ConfigurationManager.AppSettings["okta:PostLogoutRedirectUri"],
        GetClaimsFromUserInfoEndpoint = true,
        Scope = new List<string> { "openid", "profile", "email" },
    });
}
```

Now you need to handle the login and logout functionality. Right-click on the `Controllers` folder and add a new MVC 5 empty controller called `AccountController`. Add `Okta.AspNet` and `Microsoft.Owin.Security.Cookies` to the `usings` section. Add the code below inside of the `AccountController` class to handle the `Action Results` for this controller.

```csharp
public ActionResult Login()
{
    if (!HttpContext.User.Identity.IsAuthenticated)
    {
        HttpContext.GetOwinContext().Authentication.Challenge(
            OktaDefaults.MvcAuthenticationType);
        return new HttpUnauthorizedResult();
    }

    return RedirectToAction("Index", "Home");
}

[HttpPost]
public ActionResult Logout()
{
    if (HttpContext.User.Identity.IsAuthenticated)
    {
        HttpContext.GetOwinContext().Authentication.SignOut(
            CookieAuthenticationDefaults.AuthenticationType,
            OktaDefaults.MvcAuthenticationType);
    }

    return RedirectToAction("Index", "Home");
}

public ActionResult PostLogout()
{
    return RedirectToAction("Index", "Home");
}

```


Open the `LaunchController` and add the `Authorize` attribute at the top of any actions you don't want public access to. Leaving the attribute off of the `Index` action will allow anyone to view the list of upcoming launches - just not edit them. Add `Authorize` to the top of `GET` actions for Create, Edit, Delete, and their corresponding `POST` endpoints. This will ensure those function will be accessed by authenticated users only and will redirect to the Okta login process if they are not authenticated.


```csharp
//// GET: Launch/Create
[Authorize]
public ActionResult Create()
```

```csharp
// POST: Launch/Create
// To protect from overposting attacks, please enable the specific properties you want to bind to, for 
// more details see https://go.microsoft.com/fwlink/?LinkId=317598.
[HttpPost]
[ValidateAntiForgeryToken]
[Authorize]
public ActionResult Create([Bind(Include = "Id,LaunchInfo,PostedByUserName")] LaunchEntry launchEntry)
```


Run the project in a browser and use a different one then what you are logged into the Okta portal with (or log out of your admin account first). Use one of your newly created user credentials and try it out. Click on **Launches** and you should be taken through the Okta generated authentication flow before landing on the Index page.


## Track Users In Your Entity Framework CRUD Actions

You've successfully gated the Launches section! However, you might want to know which specific user would be doing the CRUD operations from here - and perhaps display the name of the currently logged in user. Let's add that functionality now.

Go to `Views/Shared` and open `_Layout.cshtml`. Beneath the `<ul>` list of `ActionLinks` add the code below to display the user's name and toggle the Login/Logout link button.


```html
@if (Context.User.Identity.IsAuthenticated)
{
    <ul class="nav navbar-nav navbar-right">
        <li>
            <p class="navbar-text">Hello, <b>@Context.User.Identity.Name</b></p>
        </li>
        <li>
            <a onclick="document.getElementById('logout_form').submit();" 
                style="cursor: pointer;">Log out</a>
        </li>
    </ul>
    <form action="/Account/Logout" method="post" id="logout_form"></form>
}
else
{
    <ul class="nav navbar-nav navbar-right">
        <li>@Html.ActionLink("Log in", "Login", "Account")</li>
    </ul>
}
```


Go to `Views/Launch` and open `Create.cshtml`. Locate the `form-group` div that specifies the `PostedByUserName` field and delete it. Locate and remove in the `Edit.cshtml` as well.

Open the `LaunchController`. Replace your `Create()` method with the code below to automatically assign the logged in user to the `PostedByUserName` property which is called upon saving the form in each case.


```csharp
// POST: Launch/Create
// To protect from overposting attacks, please enable the specific properties you want to bind to, for 
// more details see https://go.microsoft.com/fwlink/?LinkId=317598.
[HttpPost]
[ValidateAntiForgeryToken]
[Authorize]
public ActionResult Create([Bind(Include = "Id,LaunchInfo,PostedByUserName")] LaunchEntry launchEntry)
{
    launchEntry.PostedByUserName = this.User.Identity.Name;

    if (ModelState.IsValid)
    {
        db.Launches.Add(launchEntry);
        db.SaveChanges();
        return RedirectToAction("Index");
    }

    return View(launchEntry);
}
```

Now replace the `Edit()` method as well with the code below.


```csharp
// POST: Launch/Edit/5
// To protect from overposting attacks, please enable the specific properties you want to bind to, for 
// more details see https://go.microsoft.com/fwlink/?LinkId=317598.
[HttpPost]
[ValidateAntiForgeryToken]
[Authorize]
public ActionResult Edit([Bind(Include = "Id,LaunchInfo,PostedByUserName")] LaunchEntry launchEntry)
{
    launchEntry.PostedByUserName = this.User.Identity.Name;

    if (ModelState.IsValid)
    {
        db.Entry(launchEntry).State = EntityState.Modified;
        db.SaveChanges();
        return RedirectToAction("Index");
    }
    return View(launchEntry);
}
```


Launch the application in the browser and log in as one of your created users. Play around with creating new launches, editing a few that already exist and even delete one. You will notice the Posted By field is gone since we automatically assign it to the logged in user now.

{% img blog/aspnet-mvc-crud/browser-create-postedby-removed.png alt:"Create page final" width:"600" %}{: .center-image }

That's it! Your users can now create, edit and delete the launch entries after being signed in, and without typing their name for the changes they produce. You've taken a journey from the basics of a CRUD app and transformed it into something that can be done by the users on your site in a secure fashion. Pretty slick!

How have you used this approach in your projects? Leave a comment below and tell me what you've used this for. 

In the meantime... I have a couple of space rockets to check out.

## Learn More About ASP.NET

* [Add Identity Management to Your ASP.NET app (Okta docs)](https://developer.okta.com/code/dotnet/aspnet/)
* [Build a CRUD App with ASP.NET Framework 4.x Web API and Angular](/blog/2018/07/27/build-crud-app-in-aspnet-framework-webapi-and-angular)
* [Build a Basic Website with ASP.NET MVC and Angular](/blog/2018/12/21/build-basic-web-app-with-mvc-angular)
* [Secure Your ASP.NET Web Forms Application with OpenID Connect and Okta](/blog/2018/08/29/secure-webforms-with-openidconnect-okta)
* [Use OpenID Connect for Authorization in Your ASP.NET MVC Framework 4.x App](/blog/2018/04/18/authorization-in-your-aspnet-mvc-4-application)

As always if you have any questions, comments, or concerns about this post feel free to leave a comment below. For other great content from the Okta Dev Team, follow us on [Twitter](https://twitter.com/oktadev) and [Facebook](https://www.facebook.com/oktadevelopers)!
