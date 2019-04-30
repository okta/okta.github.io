---
layout: blog_post
title: "Use Firebase with Your ASP.NET MVC App"
author: quorralyne
description: "Learn how to store user non-identifiable data in Firebase using Okta and ASP.NET MVC"
tags: [ aspnet, csharp, dotnet, mvc, firebase, realtimedatabase, nosql, identitymanagement, okta ]
tweets:
- "Learn how to quickly integrate Firebase into your ASP.NET MVC apps →"
- "Check it out! Firebase + ASP.NET MVC = lightning fast! →"
- "Hey ASP.NET devs! In this simple tutorial learn how to use Firebase for quick data →"
image: blog/featured/okta-dotnet-skew.jpg
---

Working with databases hosted online has become easier over recent years. The emergence of Database as a Service (DaaS) specifically makes quick integrations much easier. It is important to keep application user data separate from personally identifiable information, especially in this day and age. When using a third party auth provider like Okta, user information like a name or email address can be stored by that provider directly in their system, benefitting from their oversight and protection. 

For transaction-heavy applications with requirements like logging sign-in timestamps, real time messaging or even monetary purchases, using a secondary database like Firebase can assist with that and be set up quite rapidly. While there are many, many configurations that Firebase can support, this tutorial will cover a loose ruleset with a basic integration into your ASP.NET MVC application. 

Let's get started!

## Set Up a Realtime Database in Firebase for Your ASP.NET MVC App

First you will create a new project in Firebase. Visit https://firebase.google.com, click on **Get Started** and sign in with your Google account. Select **Add Project**, name it "FirebaseMVCSample" and agree to the Terms and Conditions before clicking **Create Project**. When the new project is ready, click** Continue**. You will land directly into the Firebase console dashboard.

 Expand the **Develop** menu on the left-hand side and select **Database**. Scroll down to Realtime Database and click **Create Database**.

Now you will be presented with Security rules for this new database. Select **Start in Test Mode** and click **Enable**. You will land on the Realtime database with your initial node set to null - because you haven't added any data yet! Copy the link to your Firebase database. This will allow you to get up and running quickly for this tutorial:

{% img blog/firebase-aspnet-mvc/firebase-starting-database.png alt:"Firebase realtime database" width:"800" %}{: .center-image }

>Google gives you a warning about the security rules (this is a good thing!). For the purposes of this tutorial, you can leave the rules unrestricted for this proof-of-concept integration.

## Create Your ASP.NET MVC Application with Firebase

Open Visual Studio 2019 and select **Create a New Project**. Choose **ASP.NET MVC Web Application**. Name the project "FirebaseMVCApp" and make sure **.NET Framework 4.7.2** is selected then click **Create**. Select **MVC**, leave all the defaults and click **Create**. 

You need to create an object that will represent what will be saved inside of your Firebase database for each user. Right-click on the **Models** folder and add a new class called "LoginData.cs". Add the following property inside of the class:

```csharp
public string TimestampUtc { get; set; }
```

Now you need to add a library to handle database access. Right-click on the project and select Manage Nuget Packages. Install the following library:

```csharp
FirebaseDatabase.net
```

Open the **HomeController** and add the following references in the Usings section:

```csharp
using Firebase.Database;
using Firebase.Database.Query;
using System.Linq;
using System.Threading.Tasks;
```

Now replace the About function with the code below, and change the FirebaseClient to your unique Firebase project URL.

```csharp
public async Task<ActionResult> About()
{
  //Simulate test user data and login timestamp
  var userId = "12345";
  var currentLoginTime = DateTime.UtcNow.ToString("MM/dd/yyyy HH:mm:ss");

  //Save non identifying data to Firebase
  var currentUserLogin = new LoginData() { TimestampUtc = currentLoginTime };
  var firebaseClient = new FirebaseClient("yourFirebaseProjectUrl");
  var result = await firebaseClient
    .Child("Users/" + userId + "/Logins")
    .PostAsync(currentUserLogin);

  //Retrieve data from Firebase
  var dbLogins = await firebaseClient
    .Child("Users")
    .Child(userId)
    .Child("Logins")
    .OnceAsync<LoginData>();

  var timestampList = new List<DateTime>();

  //Convert JSON data to original datatype
  foreach (var login in dbLogins)
  {
      timestampList.Add(Convert.ToDateTime(login.Object.TimestampUtc).ToLocalTime());
  }

  //Pass data to the view
  ViewBag.CurrentUser = userId;
  ViewBag.Logins = timestampList.OrderByDescending(x => x);
  return View();
}
```

>You will need to add a Using reference to your project's Models folder to resolve the code above.

Let's test out the database read and write visually by updating the About view of your MVC application. Expand the **Views** folder, open About.cshtml and replace it with the code below:

```html
@{
    ViewBag.Title = "About";
}
<h2>@ViewBag.Title</h2>

<h3>Login History</h3>
<p>Current user: @ViewBag.CurrentUser</p>
<ul>
    @foreach(var timestamp in ViewBag.Logins)
    {
        <li>Login at @timestamp</li>
    }
</ul>
```

Build and launch your application in a browser. Make sure to keep a tab open to the Firebase console on your Realtime database page at the same time. Click on your **About** navigation link. The act of launching the view will add a timestamp to the page.

{% img blog/firebase-aspnet-mvc/mvc-launch-about.png alt:"MVC App About page launch" width:"500" %}{: .center-image }

Now look at your Firebase console tab. Expand the nodes to see how the data was saved, in JSON format style. Notice that there is a randomly generated session node that the timestamp is inside of. That is built into the **PostAsync** method in the FirebaseDatabase library for the final child object. 

{% img blog/firebase-aspnet-mvc/firebase-first-node.png alt:"Firebase first user node" width:"600" %}{: .center-image }

If you navigate to the **Home** page and then back to the **About** page, you will see an additional entry not only on the view but in the database as well.

{% img blog/firebase-aspnet-mvc/firebase-additional-logins.png alt:"Firebase additional user logins" width:"600" %}{: .center-image }

Congratulations, you've put non-identifying data into a database with ease!

## Set Up Secure User Authentication

You can generate your own user IDs to insert into the database, but using a third party auth provider is a more secure way to allow users to be in charge of their own data while you concentrate on your business logic.

Okta provides hosting for user-identifying data and handles the authentication login process for you - handing off the user ID and making this a painless integration. If you haven't already, go to https://developer.okta.com and create an account to get started, then continue with the following steps.

Visit the **Users** tab and click **Add Person**. Fill out the form for a sample user, be sure to set the Password drop down to "Set by Admin” and fill in a temporary password. Click **Save**. Once you have the user added, you'll notice the status for your newly created user is set to "Password expired”. This is expected for admin-created users and will guide them through their reset password flow during the first login to your site - without any additional work on your part.

Now that you have your users set up in your database, set up this specific application within Okta. On the Dashboard, click **Applications** in the main menu and on the Application screen, click **Add Application**. Select **Web** and then click **Next**.

Name the application "FirebaseMVC". Select **Implicit (Hybrid)** in addition to the pre-selected Authorization Code, and click **Done**. Your application has been created, but you still need to add the logout redirect now that the field is available. Select **Edit**, add the URI http://localhost:8080/Account/PostLogout, and click **Save**. 

{% img blog/firebase-aspnet-mvc/okta-app-general.png alt:"Okta app general settings" width:"800" %}{: .center-image }

Scroll down and you'll have access to the ClientID and Client Secret. Keep these on hand to add to your application's Web.config file later on. Now your app is good to go for Okta auth!

## Add Authentication to Your ASP.NET MVC App

It's time to revise your application, hand off the user login and allow Okta to generate the object that will give you the ID to pass to Firebase to save additional data.

Right-click on the project and select **Properties**. Go to the Web tab and set the project URL to reflect the application settings in Okta's portal (https://localhost:8080). Next, right-click on the project and select **Manage NuGet Packages**. Install the following libraries:


```csharp
Microsoft.Owin.Host.SystemWeb
Microsoft.Owin.Security.Cookies
Okta.AspNet
```

Add the Okta account access to your **Web.config** file under the **appSettings** section. Use the code below, replacing the Okta client ID and secret with your specific app's Okta credentials you generated in the portal earlier.

```csharp
<!-- 1. Replace these values with your Okta configuration -->
<add key="okta:ClientId" value="{clientId}" />
<add key="okta:ClientSecret" value="{clientSecret}" />
<add key="okta:OktaDomain" value="{yourOktaDomain}" />

<add key="okta:RedirectUri" value="http://localhost:8080/authorization-code/callback" />
<add key="okta:PostLogoutRedirectUri" value="http://localhost:8080/Account/PostLogout" />
```

In order to handle OWIN, we need to do that from a Startup class. Right-click on the project and select **Add OWIN Startup class**. Call it "Startup” and click **OK**. Add the following to your usings section:

```csharp
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Okta.AspNet;
using System.Collections.Generic;
using System.Configuration;
```

Replace the Configuration() method with the code below.

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

Because this is a claims-aware application, we need to indicate where to get user identity information from. Open your **Global.asax.cs** file. Add the following to the Usings section. 

```csharp
using System.Web.Helpers;
```

Replace the Application_Start() method with the code below to match the name of claim type - "name” in this case - from the JsonWebToken (JWT) you are receiving from Okta to set your user's identifier.

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

Go to **Views/Shared** and open **_Layout.cshtml**. Beneath the <ul> list of ActionLinks add the code below to display the user's name and toggle the Login/Logout link button.

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

Now you need to handle the login and logout functionality. Right-click on the **Controllers** folder and add a new MVC 5 empty controller called "AccountController". Add the following references to the Usings section:

```csharp
using Microsoft.Owin.Security.Cookies;
using Okta.AspNet;
```

Add the code below inside of the **AccountController** class to handle the Action Results for this controller.

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

Open the **HomeController** and add the **Authorize** attribute at the top of the **About** ActionResult. This will ensure that function will only be accessed by authenticated users and redirect to the Okta login process if they are not authenticated.

```csharp
[Authorize]
public async Task<ActionResult> About()
```

That is all you need to set up the user login to redirect to Okta, and back to your app afterwards. Now you can finally update your **About** function and use the Okta-provided user claims to retrieve the unique identifier for Firebase and update the current user to their email. 

Add the following reference to your Usings section:

```csharp
using System.Security.Claims;
```

Replace your **About** function with the code below finish this, remembering to change the FirebaseClient to your unique Firebase project URL during instantiation.

```csharp
[Authorize]
public async Task<ActionResult> About()
{
  //Get Okta user data
  var identity = (ClaimsIdentity)User.Identity;
  IEnumerable<Claim> claims = identity.Claims;
  var userEmail = claims.Where(x => x.Type == "email").FirstOrDefault().Value;
  var userOktaId = claims.Where(x => x.Type == "sub").FirstOrDefault().Value;
  var currentLoginTime = DateTime.UtcNow.ToString("MM/dd/yyyy HH:mm:ss");

  //Save non identifying data to Firebase
  var currentUserLogin = new LoginData() { TimestampUtc = currentLoginTime };
  var firebaseClient = new FirebaseClient("yourFirebaseProjectUrl/");
  var result = await firebaseClient
    .Child("Users/" + userOktaId + "/Logins")
    .PostAsync(currentUserLogin);

  //Retrieve data from Firebase
  var dbLogins = await firebaseClient
    .Child("Users")
    .Child(userOktaId)
    .Child("Logins")
    .OnceAsync<LoginData>();

  var timestampList = new List<DateTime>();

  //Convert JSON data to original datatype
  foreach (var login in dbLogins)
  {
      timestampList.Add(Convert.ToDateTime(login.Object.TimestampUtc).ToLocalTime());
  }

  //Pass data to the view
  ViewBag.CurrentUser = userEmail;
  ViewBag.Logins = timestampList.OrderByDescending(x => x);
  return View();
}
```

Build and run your app in the browser. Notice there will be a "Log in" option to the far right. The user will see this if they are not authenticated in the app, but right now they can still look at the Contact and Home pages unauthenticated. 

Click on **About**. The user should be redirected to your Okta hosted login page. Sign in as the user you created, and it might take you through a password update if this is the first time they have ever logged in. 

After authentication, you should be redirected back to your ASP.NET MVC application's About page, with the last login recorded for your authenticated user retrieved from Firebase and displayed on the page. Click the **About** navigation link a couple more times to generate additional ones if you wish. Notice that the user's name is now reflected in the navigation bar as assigned to the Principal Identity, and the option to Log out is presented.

{% img blog/firebase-aspnet-mvc/mvc-okta-user-login.png alt:"MVC App About page with Okta user" width:"800" %}{: .center-image }

Log into your Firebase console and go to your database. Notice that, instead of the user ID being manually set, it is now populated by the Okta user ID from the Principal Identity claims that Okta passed to it. If you log out and log in as a completely different user, it will automatically create the data node for them in Firebase without you having to do a different call to create it. 

{% img blog/firebase-aspnet-mvc/firebase-okta-user-logins.png alt:"Firebase logins for Okta user" width:"600" %}{: .center-image }

That's it! You have successfully implemented both Okta and Firebase into an ASP.NET MVC 4.7 application! What I really like about Firebase is it is easy to get started and throw your additional data up to a cloud with just a few clicks. Since it is a No-SQL database, it can take some getting used to the way the data is stored, and the data type safety is left up to you as the developer. For fast, unstructured data storage it is one of my favorite ways to get a project started - and features native Javascript and mobile SDKs that can take advantage of the web socket technology and listeners present in today's most lightning fast messaging apps.

The only question left is - what can you make with your Fire(base) power?

## Learn More About ASP.NET, Firebase, and Secure Authentication

If you'd like to learn more about using secure OAuth and user management in ASP.NET, we've also published a number of posts that might interest you:

* [Build a CRUD App with ASP.NET MVC and Entity Framework Authentication](https://developer.okta.com/blog/2019/03/11/build-a-crud-app-with-aspnet-mvc-and-entity-framework)
* [Build a CRUD App with ASP.NET Framework 4.x Web API and Angular](https://developer.okta.com/blog/2018/07/27/build-crud-app-in-aspnet-framework-webapi-and-angular)
* [Secure Your ASP.NET Web Forms Application with OpenID Connect and Okta](https://developer.okta.com/blog/2018/08/29/secure-webforms-with-openidconnect-okta)
* [Use OpenID Connect for Authorization in Your ASP.NET MVC Framework 4.x App](https://developer.okta.com/blog/2018/04/18/authorization-in-your-aspnet-mvc-4-application)
* [Build a CRUD App with Angular and Firebase](https://developer.okta.com/blog/2019/02/28/build-crud-app-with-angular-and-firebase)

As always if you have any questions or comments about this post feel free to leave a comment below. For other great content from the Okta Dev Team, follow us on [Twitter](https://twitter.com/oktadev) and [Facebook](https://www.facebook.com/oktadevelopers)!


