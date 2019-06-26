---
layout: blog_post
title: "Decode JWTs in C# for Authorization"
author: ryanfoster
description: "Learn how to decode JWTs using C#."
tags: [csharp, jwt, authorization, C#]
tweets:
- "If you need to learn how to decode JWTs in C#, check out this post!"
- "Check out this easy-to-follow tutorial for creating a CRUD app with @aspnetcore and #typescript."
- "This is a quick tutorial for building a CRUD app using @aspnetcore and TypeScript."
image: blog/featured/okta-dotnet-mouse-down.jpg
---

There are two main steps in securing an application: authentication and authorization. Authentication is easy enough. A user enters a username and password (maybe even a second factor) to prove (authenticate) who they are. Authorization is a little less cut and dried. There are lots of factors that go into what an authenticated user is authorized to do. First, you need some information about the user that just authenticated.

Many modern web apps use JSON Web Tokens (JWTs) during the authentication process. These JWTs can also carry information that can be used for authorization decisions within your applications. In this tutorial, you will learn how to decode JWTs in C# and how to use information from a JWT to make authorization decisions in a .NET Core app.

## TL;DR - How to Decode JWTs in C#

If you already have a JWT and you just want to know how to decode it in C#, here is the code you need:

```cs
var jwt = "(the JTW here)";
var handler = new JwtSecurityTokenHandler();
var token = handler.ReadJwtToken(jwt);

// now do something with token.Claims, token.Audiences, etc.
```

Note that the code above just reads the information from the JWT. It _does not validate the JWT_ to ensure that it hasn't been forged or tampered with.

If you're using OpenID Connect, there is actually a better way to access the information in the JWTs used in the authentication process, so read on! 

## Clone the JWT C# Project

To get started, clone or download [the starter project](https://github.com/oktadeveloper/csharp-decode-jwt-example) from GitHub, and open the solution in Visual Studio 2019.

Next, click on the down arrow near the green start button and change startup action from **IIS Express** to **DecodeJWTs**.

{% img blog/decode-jwt-csharp/setting-run-using-kestrel.png alt:"Run with Kestrel" width:"800" %}{: .center-image }

Now when you run the project, it will use the Kestrel web server instead of IIS Express. Before you run the project you will need to add some configuration settings from Okta, which you will do in a moment.

## Set up an Authorization Server to Generate JWTs

While you could invent your own security system using JWTs, that would probably be _a very bad idea_. Security systems are complex, and there are many opportunities to get something wrong. So for this tutorial, you will use OpenID Connect for authentication so you won't need to worry about generating and validating JWTs. You will just learn how to decode and use the JWTs that are used in the OpenID authentication handshake.

To keep things simple, you will use a [forever-free developer account](https://developer.okta.com/signup/) from Okta to quickly set up an OpenID Connect authentication server. Sign in to your Okta account if you already have one or [sign up now](https://developer.okta.com/signup/) if you don't.

Once you're signed in to Okta, register your client application.

* In the top menu, click on **Applications**
* Click on **Add Application**
* Select **Web** and click **Next**
* Enter `DecodeJWTs` for the **Name** 
* Change the **Base URIs** to the exact URL that your application runs on locally, including the trailing backslash. This should be `https://localhost:5001/` if you followed the instructions above (make sure it is https).
* Change the first of the **Login redirect URIs** to have the same scheme, host, and port number as above. It should still end with `authorization-code/callback`.
* Click **Done**

On the next screen, you will see an overview of settings. You need to add one more thing that wasn't on the previous screen, so click the **Edit** button at the top of the **General Settings** section of the page.

Next to **Logout redirect URIs** click **Add URI** and enter a URL like `https://localhost:5001/signout-callback-oidc` where the scheme, hostname, and port are the same as the other URLs on the page. Then click **Save**.

Below the **General Settings** section, you'll see the **Client Credentials** section. Note the **Client ID** and the **Client Secret** on the next page and add them to your `appsettings.json` file, like this:

```json
"Okta": {
  "ClientId": "{OktaClientId}",
  "ClientSecret": "{OktaClientSecret}",
  "OktaDomain": "https://{yourOktaDomain}"
}
```

Your Okta Domain is the **Org URL** displayed in the top left corner of the main Okta **Dashboard** page.

(Note that in order to keep these secrets out of source control you should move the `ClientId` and `ClientSecret` settings to your **User Secrets** file before you commit. You can skip this step for now since this is just a tutorial.)

Now run your project and make sure that you can sign in and out.

## Review the OpenID Connect Authentication Middleware

Okta has some custom middleware that makes adding OpenID Connect authentication to your application really easy. But for this application, you will use the generic OpenID Connect middleware that comes with .NET Core so you can directly access the JWTs that are used in the authentication process.

In your `Startup.cs` file, you will see the configuration for the OpenID Connect middleware:

```cs
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = "OpenIdConnect";
})
.AddCookie()
.AddOpenIdConnect(options =>
{
    options.ClientId = Configuration.GetValue<string>("Okta:ClientId");
    options.ClientSecret = Configuration.GetValue<string>("Okta:ClientSecret");
    options.Authority = $"{Configuration.GetValue<string>("Okta:OktaDomain")}/oauth2/default";
    options.CallbackPath = "/authorization-code/callback";
    options.ResponseType = "code";
    options.SaveTokens = true;
    options.UseTokenLifetime = false;
    options.GetClaimsFromUserInfoEndpoint = true;
    options.Scope.Add("openid");
    options.Scope.Add("profile");
    options.Scope.Add("email");

    options.TokenValidationParameters = new TokenValidationParameters
    {
      NameClaimType = "name",
      RoleClaimType = "role"
    };

    options.Events = new OpenIdConnectEvents()
    {
      OnUserInformationReceived = context =>
      {
        string rawAccessToken = context.ProtocolMessage.AccessToken;
        string rawIdToken = context.ProtocolMessage.IdToken;
        var handler = new JwtSecurityTokenHandler();
        var accessToken = handler.ReadJwtToken(rawAccessToken);
        var idToken = handler.ReadJwtToken(rawIdToken);

        // do something with the JWTs

        return Task.CompletedTask;
      },
    };
});
```

The code above configures your application to use Okta as an identity provider, using the settings you specified in `appsettings.json`. You will also notice some code that intercepts and decodes the two JWTs provided by Okta's authorization server during the authentication process. The access token is always provided. It only contains essential information that identifies the user and grants access. Because you specified `options.GetClaimsFromUserInfoEndpoint = true;`, an identity token is also requested. This token will contain any additional information (claims) about the user that has been requested. In the example above, we requested the `profile` and `email` scopes, so the `idToken.Claims` collection will contain information such as the name and email address of the authenticated user.

## Use Information in JWT for Authorization in C#

Now you'll extract some information from the id token that you can use for authorization decisions.

You already learned how to decode the id token in the `OnUserInformationReceived` event of the OpenID Connect middleware. I have some good news for you. You don't actually need to decode the JWT yourself because the middleware automatically decodes the id token and uses the information in it to populate the authenticated user's claims.

If you set a breakpoint in the `OnUserInformationReceived` event and examine `idToken.Claims` and `context.Principal.Claims`, you will see that both properties contain a list of the exact same claims.

So how can you use the claims that are automatically extracted from the id token to make authorization decisions? I will share an example.

## Assign User to Roles in C# Based on JWT Claims

Suppose you have a simple application that just has a couple of admin users which can be hard-coded into your application. In the `OnUserInformationReceived` event you could check if the authenticated user is one of the admins, and if so, assign the user to the `Admin` role, like this:

At the top of `Startup.cs` add

```cs
using System.Security.Claims;
```

Then replace the `OnUserInformationReceived` event with this code:

```cs
OnUserInformationReceived = context =>
{
    var admins = new string[]
    {
        "admin@company.com",
        "{your email address here}"
    };

    var additionalClaims = new List<Claim>();
    if (admins.Contains(context.Principal.FindFirstValue("email")))
    {
        additionalClaims.Add(new Claim("role", "Admin"));
    }

    var newIdentity = new ClaimsIdentity(context.Principal.Identity, additionalClaims, "pwd", "name", "role");
    context.Principal = new ClaimsPrincipal(newIdentity);

    return Task.CompletedTask;
},
```

In the code above you check to see if the user's email address (that was provided in the JWT because we requested the `email` scope from the authorization server) is in the list of admins. If so, we recreate the `ClaimsPrincipal`, adding an additional claim for the Admin role.

The `HomeController` should already have an `Admin` method that is decorated with an `[Authorize(Roles = "Admin")]` attribute. Run the app and if you are signed in, sign out and sign in again to re-run the authentication middleware and create a new cookie. After that try to access the Admin page. If your email address is in the list of admins, you should be able to access the page. Otherwise, access should be denied.

Another way that you could use claims that are populated from a JWT for authorization decisions would be to write a custom authorization policy that contains custom authorization logic based on the information in `context.User.Claims`. I will leave that exercise for you.

## Learn More About ASP.NET Core CRUD Apps and JWTs
Interested in learning more about ASP.NET Core, JWTs, or building secure applications with Okta? Check out our [Product Documentation](https://developer.okta.com/use_cases/api_access_management/) or any of these great resources:

* [Build a CRUD App with ASP.NET Core and SQL Server](https://developer.okta.com/blog/2019/04/24/crud-app-aspnet-core-sql-server)
* [Add Login to Your ASP.NET Core MVC App](https://developer.okta.com/blog/2018/10/29/add-login-to-you-aspnetcore-app)
* [JWT Validation Guide](https://developer.okta.com/code/dotnet/jwt-validation/)

If you have questions, feel free to post them below. Don't miss any of our killer content by following us on [Twitter](https://twitter.com/oktadev) and [YouTube](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q).