---
layout: quickstart_partial
exampleDescription: ASP.NET 4.x MVC authorization code example
---

## Okta ASP.NET 4.x MVC Quickstart

Now that your users can sign in, let's add authentication to your server.

> If you would prefer to download a complete sample application instead, please visit [ASP.NET MVC Example](https://github.com/oktadeveloper/okta-aspnet-mvc-example) and follow those instructions.

### Create a new project

If you don't already have an ASP.NET project, create one using the ASP.NET Web Application (MVC) template in Visual Studio. Choose **No Authentication** as the authentication type.

Install these packages in the new project:

* [Microsoft.Owin.Host.SystemWeb](https://www.nuget.org/packages/Microsoft.Owin.Host.SystemWeb) 4.0.0 or higher
* [Microsoft.Owin.Security.Cookies](https://www.nuget.org/packages/Microsoft.Owin.Security.Cookies) 4.0.0 or higher
* [Microsoft.Owin.Security.OpenIdConnect](https://www.nuget.org/packages/Microsoft.Owin.Security.OpenIdConnect) 4.0.0 or higher
* [IdentityModel](https://www.nuget.org/packages/IdentityModel) 3.3.1 or higher


### Add a Startup class

Add a Startup class to your project by right-clicking on the project in the Solution Explorer and choosing **Add** > **OWIN Startup Class**. Name the file `Startup.cs`.

Paste this code into the new class:

```csharp
public class Startup
{
    // These values are stored in Web.config. Make sure you update them!
    private readonly string clientId = ConfigurationManager.AppSettings["okta:ClientId"];
    private readonly string redirectUri = ConfigurationManager.AppSettings["okta:RedirectUri"];
    private readonly string authority = ConfigurationManager.AppSettings["okta:OrgUri"];
    private readonly string clientSecret = ConfigurationManager.AppSettings["okta:ClientSecret"];
    private readonly string postLogoutRedirectUri = ConfigurationManager.AppSettings["okta:PostLogoutRedirectUri"];

    /// <summary>
    /// Configure OWIN to use OpenID Connect to log in with Okta.
    /// </summary>
    /// <param name="app"></param>
    public void Configuration(IAppBuilder app)
    {
        app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

        app.UseCookieAuthentication(new CookieAuthenticationOptions());

        app.UseOpenIdConnectAuthentication(new OpenIdConnectAuthenticationOptions
        {
            ClientId = clientId,
            ClientSecret = clientSecret,
            Authority = authority,
            RedirectUri = redirectUri,
            ResponseType = OpenIdConnectResponseType.CodeIdToken,
            Scope = OpenIdConnectScope.OpenIdProfile,
            PostLogoutRedirectUri = postLogoutRedirectUri,
            TokenValidationParameters = new TokenValidationParameters
            {
                NameClaimType = "name"
            },

            Notifications = new OpenIdConnectAuthenticationNotifications
            {
                AuthorizationCodeReceived = async n =>
                {
                    // Exchange code for access and ID tokens
                    var tokenClient = new TokenClient(authority + "/v1/token", clientId, clientSecret);
                    var tokenResponse = await tokenClient.RequestAuthorizationCodeAsync(n.Code, redirectUri);

                    if (tokenResponse.IsError)
                    {
                        throw new Exception(tokenResponse.Error);
                    }

                    var userInfoClient = new UserInfoClient(authority + "/v1/userinfo");
                    var userInfoResponse = await userInfoClient.GetAsync(tokenResponse.AccessToken);
                    var claims = new List<Claim>();
                    claims.AddRange(userInfoResponse.Claims);
                    claims.Add(new Claim("id_token", tokenResponse.IdentityToken));
                    claims.Add(new Claim("access_token", tokenResponse.AccessToken));

                    if (!string.IsNullOrEmpty(tokenResponse.RefreshToken))
                    {
                        claims.Add(new Claim("refresh_token", tokenResponse.RefreshToken));
                    }

                    n.AuthenticationTicket.Identity.AddClaims(claims);

                    return;
                },

                RedirectToIdentityProvider = n =>
                {
                    // If signing out, add the id_token_hint
                    if (n.ProtocolMessage.RequestType == OpenIdConnectRequestType.Logout)
                    {
                        var idTokenClaim = n.OwinContext.Authentication.User.FindFirst("id_token");

                        if (idTokenClaim != null)
                        {
                            n.ProtocolMessage.IdTokenHint = idTokenClaim.Value;
                        }

                    }

                    return Task.CompletedTask;
                }
            },
        });
    }
}
```

**Note**: If you are using .NET framework <4.6 or you are getting the following error: ```The request was aborted: Could not create SSL/TLS secure channel ```. Make sure to include the following code in the `Application_Start` or `Startup`:

```csharp
// Enable TLS 1.2
ServicePointManager.SecurityProtocol |= SecurityProtocolType.Tls12;
```

Add these using statements at the top of the file:

```csharp
using Microsoft.Owin;
using Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using System.Configuration;
using System.Security.Claims;
using IdentityModel.Client;
using System;
using System.Collections.Generic;
using Microsoft.IdentityModel.Tokens;
```

### Configure the application in Okta

If you haven't already, sign in to your Okta developer account (or [create one](https://developer.okta.com/signup/)). Create or update an application in Okta with these settings:

* **Application type**: Web
* **Allowed grant types**: Authorization Code, Implicit (Hybrid) - Allow ID Token
* **Login redirect URI**: `http://localhost:8080/authorization-code/callback`
* **Logout redirect URI**: `http://localhost:8080/Account/PostLogout`

If you are creating an Okta application from scratch, click **Done** to see the full settings page and make sure the settings match the values above.

### Set up the project port

The local port may be different on your machine. Right-click on the project and choose  **Properties**, then **Web**. If it's different than 8080, update the **Project Url** and save your changes.

{% img vs-project-port.png alt:"Project port settings" %}{: .center-image }

**Note**: You can also find the assigned port by running the application.

If you want to use a different port update the URIs in Okta and in `Web.config` as well.

### Configure the project

Open the `Web.config` file and add these keys to the `<appSettings>` section:

```xml
<!-- 1. Replace these values with your Okta configuration -->
<add key="okta:ClientId" value="{clientId}" />
<add key="okta:ClientSecret" value="{clientSecret}" />
<add key="okta:OrgUri" value="https://{yourOktaDomain}/oauth2/default" />

<!-- 2. Update the Okta application with these values -->
<add key="okta:RedirectUri" value="http://localhost:8080/authorization-code/callback" />
<add key="okta:PostLogoutRedirectUri" value="http://localhost:8080/Account/PostLogout" />
```

Copy the client ID and client secret from your Okta application into the appropriate keys in `Web.config`, and replace `{yourOktaDomain}` with your Okta domain name.

{% include domain-admin-warning.html %}

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
