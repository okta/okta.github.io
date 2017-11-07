---
layout: quickstart_partial
exampleDescription: ASP.NET Core 2.0 Auth Code Example
sitemap:
  exclude: "yes"
---

## Okta ASP.NET Core Quickstart

### Create a new project

If you don't already have an ASP.NET Core 2.0 project, create one using `dotnet new mvc` or the ASP.NET Core Web Application template in Visual Studio. Choose **No Authentication** if necessary.


### Configure the middleware

Make sure you have these `using` statements at the top of your `Startup.cs` file:

```csharp
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
```

In the `ConfigureServices` method, add this `UseAuthentication` block and configure it using the information from the Okta application you just created:

```csharp
services.AddAuthentication(sharedOptions =>
{
    sharedOptions.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    sharedOptions.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    sharedOptions.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
})
.AddCookie()
.AddOpenIdConnect(options =>
{
    options.ClientId = "{clientId}";
    options.ClientSecret = "{clientSecret}";
    options.Authority = "https://{yourOktaDomain}.com/oauth2/default";
    options.CallbackPath = "/authorization-code/callback";
    options.ResponseType = "code";
    options.SaveTokens = true;
    options.UseTokenLifetime = false;
    options.GetClaimsFromUserInfoEndpoint = true;
    options.Scope.Add("openid");
    options.Scope.Add("profile");
    options.TokenValidationParameters = new TokenValidationParameters
    {
        NameClaimType = "name"
    };
});
```

Then, in the `Configure` method, add this line **above** the `UseMvc` line:

```csharp
app.UseAuthentication();
```

### Annotate your application

Use the `[Authorize]` attribute on controllers or actions to require a logged-in user.

Alternatively, you can create actions to log the user in (or out):

```csharp
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

public class AccountController : Controller
{
    public IActionResult Login()
    {
        if (!HttpContext.User.Identity.IsAuthenticated)
        {
            return Challenge(OpenIdConnectDefaults.AuthenticationScheme);
        }

        return RedirectToAction("Index", "Home");
    }

    public IActionResult Logout()
    {
        if (HttpContext.User.Identity.IsAuthenticated)
        {
            return SignOut(CookieAuthenticationDefaults.AuthenticationScheme, OpenIdConnectDefaults.AuthenticationScheme);
        }

        return RedirectToAction("Index", "Home");
    }
}
```

Open a private or incognito window in your browser and try navigating to a route that has the `[Authorize]` attribute, or to the `/Account/Login` action above. You'll be redirected to the Okta Sign-In page.

> Note: If you want to log the user out, you'll need to add a **Logout redirect URI** to the application configuration in Okta with a value of `http://{yourServerUrl}/signout-callback-oidc`. For example, `http://localhost:5000/signout-callback-oidc`.

### That's it!

ASP.NET Core automatically populates `HttpContext.User` with the information Okta sends back about the user. You can check whether the user is logged in with `User.Identity.IsAuthenticated` in your actions or views, and see all of the user's claims in `User.Claims`.

If you want to do more with the user, you can use the [Okta .NET SDK](https://github.com/okta/okta-sdk-dotnet) to get or update the user's details stored in Okta.

### Example project

If you want a full, working example, head over to the [ASP.NET Core 2.0 MVC example](https://github.com/oktadeveloper/okta-aspnetcore-mvc-example) repository.
