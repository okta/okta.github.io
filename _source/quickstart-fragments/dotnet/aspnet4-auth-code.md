---
layout: quickstart_partial
exampleDescription: ASP.NET 4.x Auth Code Example
---

## Okta ASP.NET 4.x Quickstart

If you want a full, working example, head over to the [ASP.NET MVC example](https://github.com/oktadeveloper/okta-aspnet-mvc-example) repository.

### Create a new project

If you don't already have an ASP.NET project, create one using the ASP.NET Web Application template in Visual Studio. Choose **No Authentication** as the authentication type.

Install these packages in the new project:

* [Microsoft.Owin.Host.SystemWeb](https://www.nuget.org/packages/Microsoft.Owin.Host.SystemWeb) 3.1.0 or higher
* [Microsoft.Owin.Security.Cookies](https://www.nuget.org/packages/Microsoft.Owin.Security.Cookies) 3.1.0 or higher
* [Microsoft.Owin.Security.OpenIdConnect](https://www.nuget.org/packages/Microsoft.Owin.Security.OpenIdConnect) 3.1.0 or higher
* [IdentityModel](https://www.nuget.org/packages/IdentityModel) 2.16.1 or higher


### Add a Startup class

Add a file to the root of your project called `Startup.cs`:

```csharp
public class Startup
{
    public void Configuration(IAppBuilder app)
    {
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=316888

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
                        var idToken = context.OwinContext.Authentication.User.Claims.FirstOrDefault(c => c.Type == "id_token")?.Value;
                        context.ProtocolMessage.IdTokenHint = idToken;
                    }

                    return Task.FromResult(true);
                },
                AuthorizationCodeReceived = async context =>
                {
                    // Exchange code for access and ID tokens
                    var tokenClient = new TokenClient(
                        issuer + "/v1/token", clientId, clientSecret);
                    var tokenResponse = await tokenClient.RequestAuthorizationCodeAsync(context.ProtocolMessage.Code, redirectUri);

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

                    var nameClaim = new Claim(ClaimTypes.Name, userInfoResponse.Claims.FirstOrDefault(c => c.Type == "name")?.Value);
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

**Note**: The local port may be different on your machine. When you run the project with Visual Studio, you can see which port it was assigned. If it's different than 59896, update the URIs in `Web.config` and in Okta.

### Configure the project

Open the `Web.config` file and add these keys:

```xml
<!-- 1. Replace these values with your Okta configuration -->
<add key="okta:ClientId" value="{clientId}" />
<add key="okta:ClientSecret" value="{clientSecret}" />
<add key="okta:Issuer" value="https://{yourOktaDomain}.com/oauth2/default" />

<!-- 2. Update the Okta application with these values -->
<add key="okta:RedirectUri" value="http://localhost:59896/authorization-code/callback" />
<add key="okta:PostLogoutRedirectUri" value="http://localhost:59896/Account/PostLogout" />
```

Copy the client ID and client secret from your Okta application into the appropriate keys in `Web.config`, and replace `{yourOktaDomain}` with your Okta domain name.

**Note**: The value of `{yourOktaDomain}` should be something like `dev-123456.oktapreview.com`. Make sure you don't include `-admin` in the value!

### Annotate your application

Use the `[Authorize]` attribute on controllers or actions to require a logged-in user:

```csharp
[Authorize]
public ActionResult Protected()
{
    // Only for logged-in users!
    return View();
}
```

Alternatively, you can create actions to log the user in (or out):

```csharp
public ActionResult Login()
{
    if (!HttpContext.User.Identity.IsAuthenticated)
    {
        HttpContext.GetOwinContext().Authentication.Challenge(OpenIdConnectAuthenticationDefaults.AuthenticationType);
        return new HttpUnauthorizedResult();
    }

    return RedirectToAction("Index", "Home");
}

[HttpPost]
public ActionResult Logout()
{
    if (HttpContext.User.Identity.IsAuthenticated)
    {
        HttpContext.GetOwinContext().Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType, OpenIdConnectAuthenticationDefaults.AuthenticationType);
    }

    return RedirectToAction("Index", "Home");
}
```

### Run the project

Open a private or incognito window in your browser and try navigating to a route that has the `[Authorize]` attribute. You'll be redirected to the Okta Sign-In page.

### That's it!

ASP.NET Core automatically populates `HttpContext.User` with the information Okta sends back about the user. You can check whether the user is logged in with `User.Identity.IsAuthenticated` in your actions or views.

If you want to do more with the user, you can use the [Okta .NET SDK](https://github.com/okta/okta-sdk-dotnet) to get or update the user's details stored in Okta.
