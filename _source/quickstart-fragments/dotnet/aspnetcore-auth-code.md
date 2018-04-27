---
layout: quickstart_partial
exampleDescription: ASP.NET Core 2.0 MVC authorization code example
---

## Okta ASP.NET Core MVC Quickstart

Now that your users can sign in, let's add authentication to your server.

> If you would prefer to download a complete sample application instead, please visit [ASP.NET Core MVC Example](https://github.com/oktadeveloper/okta-aspnetcore-mvc-example) and follow those instructions.

### Create a new project

If you don't already have an ASP.NET Core 2.0 project, create one using `dotnet new mvc` or the ASP.NET Core Web Application template in Visual Studio. Choose **No Authentication** as the authentication type.


### Configure the application in Okta

Sign in to your Okta developer account (or [create one](https://developer.okta.com/signup/)). Create or update an application in Okta with these settings:

* **Application type:** Web
* **Allowed grant types:** Authorization Code
* **Login redirect URI:** http://localhost:60611/authorization-code/callback
* **Logout redirect URI:** http://localhost:60611/signout-callback-oidc

If you are creating an Okta application from scratch, click **Done** to see the full settings page and make sure the settings match the values above.

Scroll to the bottom of the Okta application page to find the client ID and client secret. You'll need those values in the next step.

### Configure the middleware

Make sure you have these `using` statements at the top of your `Startup.cs` file:

```csharp
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
```

In the `ConfigureServices` method, add this `UseAuthentication` block and configure it using the information from your Okta application:

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
    options.Authority = "https://{yourOktaDomain}/oauth2/default";
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

**Note:** The value of `{yourOktaDomain}` should be something like dev-123456.oktapreview.com. Make sure you don't include `-admin` in the value!

Then, in the `Configure` method, add this line **above** the `UseMvc` line:

```csharp
app.UseAuthentication();
```

### Secure your application

Use the `[Authorize]` attribute on controllers or actions to require a logged-in user:

```csharp
[Authorize]
public IActionResult Protected()
{
    // Only for logged-in users!
    return View();
}
```

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

    [HttpPost]
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

### Run the project

Start the project in Visual Studio, or with this command:

```bash
dotnet run
```

Open `http://localhost:60611` in a private or incognito window in your browser. Try navigating to a route that has the `[Authorize]` attribute, or to the `/Account/Login` action. You'll be redirected to the Okta Sign-In page.

### That's it!

ASP.NET Core automatically populates `HttpContext.User` with the information Okta sends back about the user. You can check whether the user is logged in with `User.Identity.IsAuthenticated` in your actions or views, and see all of the user's claims in `User.Claims`.

The [full example project](https://github.com/oktadeveloper/okta-aspnetcore-mvc-example) has more examples of authenticating and interacting with the user's information (claims).

If you want to do more with the user, you can use the [Okta .NET SDK](https://github.com/okta/okta-sdk-dotnet) to get or update the user's details stored in Okta.
