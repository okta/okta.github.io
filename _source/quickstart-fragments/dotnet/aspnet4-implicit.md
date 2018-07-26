---
layout: quickstart_partial
exampleDescription: ASP.NET 4.x Web API implicit example
---

## Okta ASP.NET 4.x Web API Quickstart

Now that your clients can get tokens, let's validate those tokens on your server.

### Create a new Web API project

If you don't already have a Web API project, create a new ASP.NET (.NET Framework) project and choose the Web API template. Choose **No Authentication**.

### Install required packages

First, install these packages with NuGet:

- `Microsoft.Owin.Host.SystemWeb` 4.0.0 or higher (if it isn't already installed)
- `Microsoft.IdentityModel.Protocols.OpenIdConnect` 5.2.1 or higher
- `Microsoft.IdentityModel.Tokens` 5.2.1 or higher
- `Microsoft.Owin.Security.Jwt` 4.0.0 or higher


### Configure the middleware

If you don't already have a `Startup.cs` file (OWIN Startup class), create one by right-clicking on your project and choosing **Add** - **Class**. Pick the **OWIN Startup** template and name the new class `Startup`.

Make sure you have these `using` statements at the top of your `Startup.cs` file:

```csharp
using System.Threading.Tasks;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Jwt;
using Owin;
```

Add the following code to your `Configuration` method:
{% include domain-admin-warning.html %}

```csharp
public void Configuration(IAppBuilder app)
{
    // Configure JWT Bearer middleware
    // with an OpenID Connect Authority

    var authority = "https://{yourOktaDomain}/oauth2/default";

    var configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>(
        authority + "/.well-known/openid-configuration",
        new OpenIdConnectConfigurationRetriever(),
        new HttpDocumentRetriever());

    app.UseJwtBearerAuthentication(new JwtBearerAuthenticationOptions
    {
        AuthenticationMode = AuthenticationMode.Active,
        TokenValidationParameters = new TokenValidationParameters
        {
            ValidAudience = "api://default",
            ValidIssuer = authority,
            IssuerSigningKeyResolver = (token, securityToken, identifier, parameters) =>
            {
                var discoveryDocument = Task.Run(() => configurationManager.GetConfigurationAsync()).GetAwaiter().GetResult();
                return discoveryDocument.SigningKeys;
            }
        }
    });
}
```

### Protect application resources

Use the `[Authorize]` attribute on API controllers or actions to require an authenticated user. For example, create an `/api/messages` route in a new API controller that returns secret messages if a token is present:

```csharp
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web.Http;

[Authorize]
public class MessagesController : ApiController
{
    [HttpGet]
    [Route("~/api/messages")]
    public IEnumerable<string> Get()
    {
        var principal = RequestContext.Principal.Identity as ClaimsIdentity;

        var login = principal.Claims
            .SingleOrDefault(c => c.Type == ClaimTypes.NameIdentifier)
            ?.Value;

        return new string[]
        {
            $"For {login ?? "your"} eyes only",
            "Your mission, should you choose to accept it..."
        };
    }
}
```

### That's it!

The JWT Bearer middleware automatically validates tokens and populates `HttpContext.User` with a limited set of user information.

If you want to do more with the user, you can use the [Okta .NET SDK](https://github.com/okta/okta-sdk-dotnet) to get or update the user's details stored in Okta.

> Note: If your client application is running on a different server (or port) than your ASP.NET Core server, you'll need to add [CORS middleware](https://docs.microsoft.com/en-us/aspnet/core/security/cors) to the pipeline as well.
