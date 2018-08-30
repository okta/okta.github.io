---
layout: quickstart_partial
exampleDescription: ASP.NET Core 2.0 API implicit example
---

## Okta ASP.NET Core Web API Quickstart

Now that your clients can get tokens, let's validate those tokens on your server.

### Create a new project

If you don't already have an ASP.NET Core 2.0 project, create one using `dotnet new mvc` or the ASP.NET Core Web Application template in Visual Studio. Choose **No Authentication** if necessary.


### Configure the middleware

Make sure you have these `using` statements at the top of your `Startup.cs` file:

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;

```

In the `ConfigureServices` method, add this `UseAuthentication` block and configure it using the information from the Okta application you just created:
{% include domain-admin-warning.html %}

```csharp
services.AddAuthentication(sharedOptions =>
{
    sharedOptions.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    sharedOptions.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options => {
    options.Authority = "https://{yourOktaDomain}/oauth2/default";
    options.Audience = "api://default";
});
```

Then, in the `Configure` method, add this line **above** the `UseMvc` line:

```csharp
app.UseAuthentication();
```

### Protect application resources

Use the `[Authorize]` attribute on controllers or actions to require an authenticated user. For example, create an `/api/messages` route in a new controller that returns secret messages if a token is present:

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[Authorize]
[Route("/api")]
public class MessagesController : Controller
{
    [HttpGet]
    [Route("messages")]
    public IEnumerable<string> GetPrivateMessages()
    {
        var login = User.Claims
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
