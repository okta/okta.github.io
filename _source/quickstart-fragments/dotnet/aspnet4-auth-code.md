---
layout: quickstart_partial
exampleDescription: ASP.NET 4.x MVC authorization code example
---

## Okta ASP.NET 4.x MVC Quickstart

If you want a full, working example, head over to the [ASP.NET MVC example](https://github.com/oktadeveloper/okta-aspnet-mvc-example) repository.

### Create a new project

If you don't already have an ASP.NET project, create one using the ASP.NET Web Application (MVC) template in Visual Studio. Choose **No Authentication** as the authentication type.

Install these packages in the new project:

* [Microsoft.Owin.Host.SystemWeb](https://www.nuget.org/packages/Microsoft.Owin.Host.SystemWeb) 3.1.0 or higher
* [Microsoft.Owin.Security.Cookies](https://www.nuget.org/packages/Microsoft.Owin.Security.Cookies) 3.1.0 or higher
* [Microsoft.Owin.Security.OpenIdConnect](https://www.nuget.org/packages/Microsoft.Owin.Security.OpenIdConnect) 3.1.0 or higher
* [IdentityModel](https://www.nuget.org/packages/IdentityModel) 2.16.1 or higher


### Add a Startup class

Add a Startup class to your project by right-clicking on the project in the Solution Explorer and choosing **Add** > **OWIN Startup Class**. Name the file `Startup.cs`.

Paste this code into the new class:

```csharp
public class Startup
{
    public void Configuration(IAppBuilder app)
    {
        ConfigureAuth(app);
    }

    private void ConfigureAuth(IAppBuilder app)
    {
        app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

        app.UseCookieAuthentication(new CookieAuthenticationOptions
        {
            AuthenticationType = CookieAuthenticationDefaults.AuthenticationType,
        });

        var clientId = ConfigurationManager.AppSettings["okta:ClientId"].ToString();
        var clientSecret = ConfigurationManager.AppSettings["okta:ClientSecret"].ToString();
        var issuer = ConfigurationManager.AppSettings["okta:Issuer"].ToString();
        var redirectUri = ConfigurationManager.AppSettings["okta:RedirectUri"].ToString();

        app.UseOpenIdConnectAuthentication(new OpenIdConnectAuthenticationOptions
        {
            ClientId = clientId,
            ClientSecret = clientSecret,
            Authority = issuer,
            RedirectUri = redirectUri,
            ResponseType = "code id_token",
            UseTokenLifetime = false,
            Scope = "openid profile",
            PostLogoutRedirectUri = ConfigurationManager.AppSettings["okta:PostLogoutRedirectUri"].ToString(),
            TokenValidationParameters = new TokenValidationParameters
            {
                NameClaimType = "name"
            },
            Notifications = new OpenIdConnectAuthenticationNotifications
            {
                RedirectToIdentityProvider = context =>
                {
                    if (context.ProtocolMessage.RequestType == OpenIdConnectRequestType.LogoutRequest)
                    {
                        var idToken = context.OwinContext.Authentication.User.Claims
                            .FirstOrDefault(c => c.Type == "id_token")?.Value;
                        context.ProtocolMessage.IdTokenHint = idToken;
                    }

                    return Task.FromResult(true);
                },
                AuthorizationCodeReceived = async context =>
                {
                    // Exchange code for access and ID tokens
                    var tokenClient = new TokenClient(
                        issuer + "/v1/token", clientId, clientSecret);
                    var tokenResponse = await tokenClient.RequestAuthorizationCodeAsync(
                        context.ProtocolMessage.Code, redirectUri);

                    if (tokenResponse.IsError)
                    {
                        throw new Exception(tokenResponse.Error);
                    }
                    
                    var userInfoClient = new UserInfoClient(issuer + "/v1/userinfo");
                    var userInfoResponse = await userInfoClient.GetAsync(tokenResponse.AccessToken);

                    var identity = new ClaimsIdentity();
                    identity.AddClaims(userInfoResponse.Claims);

                    identity.AddClaim(new Claim("id_token", tokenResponse.IdentityToken));
                    identity.AddClaim(new Claim("access_token", tokenResponse.AccessToken));
                    if (!string.IsNullOrEmpty(tokenResponse.RefreshToken))
                    {
                        identity.AddClaim(new Claim("refresh_token", tokenResponse.RefreshToken));
                    }

                    var nameClaim = new Claim(
                        ClaimTypes.Name,
                        userInfoResponse.Claims.FirstOrDefault(c => c.Type == "name")?.Value);
                    identity.AddClaim(nameClaim);


                    context.AuthenticationTicket = new AuthenticationTicket(
                        new ClaimsIdentity(identity.Claims, context.AuthenticationTicket.Identity.AuthenticationType),
                        context.AuthenticationTicket.Properties);
                }
            }
        });
    }
}
```

Add these using statements at the top of the file:

```csharp
using System;
using System.Configuration;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityModel.Client;
using Microsoft.IdentityModel.Protocols;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;
using Owin;
```

### Configure the application in Okta

If you haven't already, sign in to your Okta developer account (or [create one](https://developer.okta.com/signup/)). Create or update an application in Okta with these settings:

* **Application type**: Web
* **Allowed grant types**: Authorization Code, Implicit (Hybrid) - Allow ID Token
* **Login redirect URI**: `http://localhost:59896/authorization-code/callback`
* **Logout redirect URI**: `http://localhost:59896/Account/PostLogout`

If you are creating an Okta application from scratch, click **Done** to see the full settings page and make sure the settings match the values above.

**Note**: The local port may be different on your machine. You can find the assigned port by running the application, or right-clicking on the project and choosing **Properties**, then **Web**. If it's different than 59896, update the URIs in Okta and in `Web.config` below.

### Configure the project

Open the `Web.config` file and add these keys to the `<appSettings>` section:

```xml
<!-- 1. Replace these values with your Okta configuration -->
<add key="okta:ClientId" value="{clientId}" />
<add key="okta:ClientSecret" value="{clientSecret}" />
<add key="okta:Issuer" value="https://{yourOktaDomain}.com/oauth2/default" />

<!-- 2. Update the Okta application with these values -->
<add key="okta:RedirectUri" value="http://localhost:59896/authorization-code/callback" />
<add key="okta:PostLogoutRedirectUri" value="http://localhost:59896/Account/PostLogout" />
```

Copy the client ID and client secret from your Okta application into the appropriate keys in `Web.config`, and replace `{yourOktaDomain}` with your Okta domain name. You can find your Okta domain name in the top-right corner of the Dashboard page.

**Note**: The value of `{yourOktaDomain}` should be something like `dev-123456.oktapreview.com`. Make sure you don't include `-admin` in the value!

### Secure your application

Use the `[Authorize]` attribute on controllers or actions to require a logged-in user:

```csharp
[Authorize]
public ActionResult Protected()
{
    // Only for logged-in users!
    return View();
}
```

Create a basic `AccountController` to handle login and logout:

```csharp
public class AccountController : Controller
{
    public ActionResult Login()
    {
        if (!HttpContext.User.Identity.IsAuthenticated)
        {
            HttpContext.GetOwinContext().Authentication.Challenge(
                OpenIdConnectAuthenticationDefaults.AuthenticationType);
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
                OpenIdConnectAuthenticationDefaults.AuthenticationType);
        }

        return RedirectToAction("Index", "Home");
    }

    public ActionResult PostLogout()
    {
        return RedirectToAction("Index", "Home");
    }
}
```

Add these using statements at the top of the `AccountController.cs` file:

```csharp
using System.Web;
using System.Web.Mvc;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;
```

You can also update your views to show whether the user is logged in. Add this code to `_Layout.cshtml`:

```html
<div class="navbar-collapse collapse">
    <ul class="nav navbar-nav">
        <li>@Html.ActionLink("Home", "Index", "Home")</li>
        <li>@Html.ActionLink("About", "About", "Home")</li>
        <li>@Html.ActionLink("Contact", "Contact", "Home")</li>
    </ul>
    @if (Context.User.Identity.IsAuthenticated)
    {
        <ul class="nav navbar-nav navbar-right">
            <li>
                <p class="navbar-text">Hello, <b>@Context.User.Identity.Name</b></p>
            </li>
            <li>
                <a onclick="document.getElementById('logout_form').submit();" style="cursor: pointer;">Log out</a>
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
</div>
```

### Run the project

Start the project in Visual Studio and try logging in or navigating to a route that has the `[Authorize]` attribute. You'll be redirected to the Okta Sign-In page.

### That's it!

ASP.NET automatically populates `HttpContext.User` with the information Okta sends back about the user. You can check whether the user is logged in with `User.Identity.IsAuthenticated` in your actions or views.

The [full example project](https://github.com/oktadeveloper/okta-aspnet-mvc-example) has more examples of authenticating and interacting with the user's information (claims).

If you want to do more with the user, you can use the [Okta .NET SDK](https://github.com/okta/okta-sdk-dotnet) to get or update the user's details stored in Okta.
