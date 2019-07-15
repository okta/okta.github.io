---
layout: blog_post
title: "Secure Your ASP.NET Core App with OAuth 2.0"
author: ryanfoster
description: "Learn how to use OAuth 2.0 to secure your ASP.NET Core Application."
tags: [aspnet, asp.net, asp net, oauth, oauth 2.0]
tweets:
- "If you need to learn how to secure your @aspnetcore app with OAuth 2.0, check out this post!"
- "Check out this easy-to-follow tutorial for securing an @aspnetcore app with OAuth 2.0."
- "This is a quick tutorial for securing an @aspnetcore app using OAuth 2.0."
image: blog/featured/okta-dotnet-mouse-down.jpg
---

Do you ever wish you had a virtual scrap of paper you could use to write notes in the cloud? I'll show you how to build a simple ASP.NET Core app to keep track of your notes, plus how to use .NET Core's OAuth 2 authentication middleware to secure access to your app so your personal notes are kept private.

## My Private Notes App

Your note-keeping app will be a simple of an ASP.NET app. You will just transform the home page into a list of recent notes. If you add more than three notes, the oldest note will be discarded to make room for the most recent note.

First, you'll build your note keeping app without any security. After that, you'll learn how to secure it with OAuth. To get started, please clone or download [this starter project](https://github.com/oktadeveloper/okta-aspnet-oauth2-starter-example) from GitHub.

Run the project to make sure it starts. You should see a **Hello World** message displayed and some other basic app scaffolding.

Start by replacing the contents of `Controllers\HomeController.cs` with the code below.

```cs
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace OAuthNotes.Controllers
{
  public class HomeController : Controller
  {
    private static List<string> _notes;

    public HomeController()
    {
      if (_notes == null)
      {
        _notes = new List<string> {"", "", ""};
      }
    }

    public IActionResult Index()
    {
      return View(_notes);
    }

    [HttpPost]
    public IActionResult Add(string note)
    {
      _notes.Add(note);
      if (_notes.Count > 3)
      {
        _notes.RemoveAt(0);
      }
      return RedirectToAction("Index");
    }
  }
}
```

As you can see, notes are kept in a static list, which is initialized the first time the controller is loaded. Then there are methods to show the list and add items to it.

Next you need to replace the contents of `Views\Home\Index.cshtml` with this code:

```cs
@model List<string>
@{
  ViewData["Title"] = "My Notes";
}
<h1>My Notes</h1>

<ul>
  @foreach (var note in Model)
  {
    <li>@note</li>
  }
</ul>

<form asp-action="Add" method="POST">
  <input type="text" name="note" />
  <input type="submit" value="Add Note" />
</form>
```

Now the home page should allow you to add up to three notes. That was easy, wasn't it? But what if you don't want curious eyes looking at your notes? How can you keep your notes private? Let's use OAuth 2.0 to secure access to the app.

## Set up ASP.NET OAuth 2.0 Authentication Middleware

OAuth 2.0 is a popular security protocol used by many organizations to protect sensitive systems and information. Many websites use OAuth to allow users to sign into their applications _and_ other people's applications.

ASP.NET Core comes with OAuth authentication middleware, that makes it easy to use a third party OAuth 2.0 server for login. Many social networks and websites provide an OAuth 2.0 service for public use, so regardless of whether you want to log in with Facebook, BitBucket, Stack Overflow, or Trello, it's just a matter of setting them up as the Identity Provider. For this tutorial, you will use Okta's OAuth service to protect your app. The ASP.NET OAuth Middleware will be connected to Okta and use Okta as the Identity Provider. One neat feature of Okta's service is that it can federate many different authentication services and provide your app just one point of integration for them all.

First you'll need to open up `Startup.cs` and add this line right above `app.UseMvc` in the `Configure` method:

```cs
app.UseAuthentication();
```

Then add this at the top of the `ConfigureServices` method:

```cs
services.AddAuthentication(options =>
{
  // If an authentication cookie is present, use it to get authentication information
  options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
  options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;

  // If authentication is required, and no cookie is present, use Okta (configured below) to sign in
  options.DefaultChallengeScheme = "Okta";
})
.AddCookie() // cookie authentication middleware first
.AddOAuth("Okta", options =>
{
  // Oauth authentication middleware is second

  var oktaDomain = Configuration.GetValue<string>("Okta:OktaDomain");

  // When a user needs to sign in, they will be redirected to the authorize endpoint
  options.AuthorizationEndpoint = $"{oktaDomain}/oauth2/default/v1/authorize";

  // Okta's OAuth server is OpenID compliant, so request the standard openid
  // scopes when redirecting to the authorization endpoint
  options.Scope.Add("openid");
  options.Scope.Add("profile");
  options.Scope.Add("email");

  // After the user signs in, an authorization code will be sent to a callback
  // in this app. The OAuth middleware will intercept it
  options.CallbackPath = new PathString("/authorization-code/callback");

  // The OAuth middleware will send the ClientId, ClientSecret, and the
  // authorization code to the token endpoint, and get an access token in return
  options.ClientId = Configuration.GetValue<string>("Okta:ClientId");
  options.ClientSecret = Configuration.GetValue<string>("Okta:ClientSecret");
  options.TokenEndpoint = $"{oktaDomain}/oauth2/default/v1/token";

  // Below we call the userinfo endpoint to get information about the user
  options.UserInformationEndpoint = $"{oktaDomain}/oauth2/default/v1/userinfo";

  // Describe how to map the user info we receive to user claims
  options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "sub");
  options.ClaimActions.MapJsonKey(ClaimTypes.Name, "given_name");
  options.ClaimActions.MapJsonKey(ClaimTypes.Email, "email");

  options.Events = new OAuthEvents
  {
    OnCreatingTicket = async context =>
    {
      // Get user info from the userinfo endpoint and use it to populate user claims
      var request = new HttpRequestMessage(HttpMethod.Get, context.Options.UserInformationEndpoint);
      request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
      request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", context.AccessToken);

      var response = await context.Backchannel.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, context.HttpContext.RequestAborted);
      response.EnsureSuccessStatusCode();

      var user = JObject.Parse(await response.Content.ReadAsStringAsync());

      context.RunClaimActions(user);
    }
  };
});
```

I added a lot of comments in the code you just pasted in to help you understand what the middleware is doing, but I'll also describe it step-by-step here.

## Enforce the OAuth Authorization Code Flow

If an unauthenticated user tries to access a URL that requires authorization, the authentication middleware will be triggered. In this case, it will use the Okta OAuth service, since the `DefaultChallengeScheme` is set to `"Okta"`. 

The OAuth middleware will kick off the OAuth 2.0 authorization code flow, which works like this:

1. Your app redirects the user to the `AuthorizationEndpoint` where they can authenticate (sign in with a username and password) and authorize the app to get access to the requested resources. In this case, we request access to some identity information, including the user's name and email address, via some predefined scopes.
2. The authorization server redirects the user back to your app's `CallbackPath` with an authorization code in the URL. The middleware intercepts this request and gets the authorization code.
3. Your app sends the authorization code, the `ClientId`, and `ClientSecret` to the TokenEndpoint.
4. The authorization server returns an access token.
5. Your app sends the access token to the `UserInformationEndpoint`.
6. The authorization server returns the identity information that was requested.

Once the flow is complete, the middleware in your app maps the identity information it received to claims and creates a secure cookie to save the authenticated user's information. On subsequent requests, the user identity is populated from the cookie, saving all of the back-and-forth communication between your app and the authentication server.

Now you just need to add an `[Authorize]` attribute right above the `HomeController` class in `Controllers\HomeController.cs` so that only authenticated users can access the app.

## Configure the Authorization Server in Okta

Although you have set up the app to authenticate with Okta, Okta won't recognize your app until you register it.

Sign in to your Okta domain if you already have an account or [sign up now](https://developer.okta.com/signup/) for a forever-free developer account if you don't.

Once you're signed in to Okta, register your client application.

* In the top menu, click on **Applications**
* Click on **Add Application**
* Select **Web** and click **Next**
* Enter `ListApp` for the **Name**
* Change the **Base URIs** to the exact URL that your application runs on locally, including the trailing backslash. This should be something like  `https://localhost:44377/` (change the port number to match your port number and make sure it is https).
* Change the first of the **Login redirect URIs** to have the same scheme, host, and port number as above. It should still end with `authorization-code/callback`.
* Click **Done**

On the next screen, you will see an overview of settings. Below the **General Settings** section, you'll see the **Client Credentials** section. Note the **Client ID** and the **Client Secret** on the next page and add them to your `appsettings.json` file, like this:

```json
"Okta": {
  "ClientId": "{yourOktaClientId}",
  "ClientSecret": "{yourOktaClientSecret}",
  "OktaDomain": "https://{yourOktaDomain}"
}
```

Your Okta Domain is the **Org URL** displayed in the top left corner of the main Okta **Dashboard** page.

(Note that in order to keep these secrets out of source control you should move the `ClientId` and `ClientSecret` settings to your **User Secrets** file before you commit. You can skip this step for now since this is just a tutorial.)

Now you should be all set. When you run your app, Okta should prompt you to sign in. After signing in, you will be able to access your private notes.

If you want to keep your notes truly private, you will need to adjust the `HomeController` to maintain separate lists for each authenticated user. For example, you could create a dictionary of user's lists, using the unique identifier in `User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value` as a dictionary key. I'll leave that coding to you.

## Limitations of OAuth 2.0

Although the OAuth protocol can be used for user authentication, it wasn't actually designed for it. The OAuth protocol was designed for delegated access. The access tokens that are issued by OAuth servers are like hotel key cards. They grant access to certain rooms, but they often don't have any identity information attached. Of course, the staff at the front desk of a hotel will probably require you to present identification before they hand out a key card, but each hotel's process could be a bit different.

As people began to use OAuth for authentication there were a variety of different ways that the authentication process was handled. For example, there is no standard way to do a logout process with OAuth. The app you just created clears a local cookie when you click on **Sign out**, but you are still signed in at the Okta server, so if you click **Sign in** again you will be automatically signed in again without being prompted for a password! (If you want, you can close your browser to clear Okta's cookie)

To overcome the confusion of using OAuth for authentication without having a shared standard for _how_ to use it, the OpenID Connect standard was built _on top of OAuth_. If you're interacting with an OAuth authorization server that also supports OpenID Connect (like Okta), using the .NET Core OpenID Connect middleware (or Okta's even simpler OpenID Connect middleware) will save you a lot of effort. See the links below for more information on how to use OpenID Connect for authentication in your app.

## Learn More About OAuth 2.0 and ASP.NET

Interested in learning more about ASP.NET Core, Oauth 2.0, OpenID Connect, or building secure applications with Okta? Check out our [Product Documentation](https://developer.okta.com/use_cases/api_access_management/) or any of these great resources:

* [What is OAuth?](/blog/2017/06/21/what-the-heck-is-oauth)
* [OAuth 2.0 and OpenID Connect](/docs/concepts/auth-overview/#authentication-api-vs-oauth-2-0-vs-openid-connect)
* [OpenID Connect for User Authentication in ASP.NET Core](/blog/2017/06/29/oidc-user-auth-aspnet-core)
* [Create Login and Registration in Your ASP.NET Core MVC App](/blog/2019/02/05/login-registration-aspnet-core-mvc)
* [Add Login to Your ASP.NET Core MVC App](/blog/2018/10/29/add-login-to-you-aspnetcore-app)

As always, if you have comments or questions about this post, feel free to leave them in the comments below. Also, don't forget to follow us on [Twitter](https://twitter.com/oktadev) and [YouTube](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q) so that you never miss any of ur awesome content!
