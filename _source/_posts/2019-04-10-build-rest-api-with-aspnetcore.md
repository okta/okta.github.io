---
layout: blog_post
title: "Build a REST API with ASP.NET Core 2.2"
author: ibrahim
description: "This is a step-by-step for creating a REST API application using ASP.NET Core 2.2."
tags: [aspnetcore, netcore, rest, api]
tweets:
  - "Need a step-by-step for creating a REST API in ASP.NET Core 2.2? We've got you covered!"
  - "If you've been looking for a step-by-step on building REST APIs in ASP.NET Core 2.2, look no further!"
  - "Ready to dive into ASP.NET Core 2.2 REST APIs and don't know where to start? Start here!!"
image: blog/featured/okta-dotnet-mouse-down.jpg
---

ASP.NET Core is entirely open source, free, has built-in DI and logging, works smoothly with a fantastic ORM and has tons of built-in features within Web API framework, and on top of that you get Microsoft support for free, maturity and flexibility of C# and ASP.NET, it's evident that ASP.NET Core is easily one of the best picks for building REST APIs.

Lots of folks keep a daily journal that is essentially a detailed log that you can use to compare your plans with your achievements. In this tutorial, I will show you how to build a REST API for keeping track of simple daily journal.

## Prerequisites for Your ASP.NET Core REST API

It would be best if you had the latest .NET Core SDK. You can install it from here [.NET Core SDK](https://www.microsoft.com/net/download).

After that, you are ready. This demo will use VS Code, but feel free to use your preferred editor or IDE.

## Add Authentication to Your ASP.NET Core REST API

Authentication is a necessity for most applications and Okta makes it simple. Okta is a cloud service that allows developers to create, edit, and securely store user accounts and user account data, and connect them with one or multiple applications. Our API enables you to:

* [Authenticate](https://developer.okta.com/product/authentication/) and [authorize](https://developer.okta.com/product/authorization/) your users
* Store data about your users
* Perform password-based and [social login](https://developer.okta.com/authentication-guide/social-login/)
* Secure your application with [multi-factor authentication](https://developer.okta.com/use_cases/mfa/)
* And much more! Check out our [product documentation](https://developer.okta.com/documentation/)

Sign up for a [forever-free developer account](https://developer.okta.com/signup/) (or log in if you already have one).

{% img blog/aspnetcore-restapi/okta-signup.png alt:"Okta Signup" width:"800" %}{: .center-image }

After you have completed your login (and registration), you should see the Dashboard, and in the upper right corner, there should be your unique Org URL. Save it for later.

{% img blog/aspnetcore-restapi/okta-org-url.png alt:"Okta Org URL" width:"800" %}{: .center-image }

Now you need to create a new application by browsing to the Applications tab. Click **Add Application**, and from the first page of the wizard choose **Service**.

{% img blog/aspnetcore-restapi/okta-choose-platform.png alt:"Okta Chose Platform" width:"800" %}{: .center-image }

On the settings page, enter the name of your application:

{% img blog/aspnetcore-restapi/okta-app-name.png alt:"Okta App Name" width:"800" %}{: .center-image }

You can now click **Done**

Now that your application has been created copy down the Client ID and Client Secret values on the following page, you'll need them soon (of course, yours will be different).

{% img blog/aspnetcore-restapi/okta-client-credentials.png alt:"Okta Client Credentials" width:"800" %}{: .center-image }

## Create Your ASP.NET Core REST API and Client Projects

YouWe will create an API that will be in charge of validating the tokens with help of Okta services. Our client will be simple ASP.NET Core MVC application that will access the API.

Inside of your root project folder create two folders: `api` and `client`. Inside of your `client` folder run the following:

```sh
dotnet new mvc
```

Inside of your `api` folder run the following:

```sh
dotnet new webapi
```

After executing this command, you will have a basic template for ASP.NET Core Web API application. It's a bare-bones template for creating new REST APIs. We will need to expand on this.

Since ASP.NET Core template applications run on 5001 port (or 5000 for non HTTPS) we need to make sure that API is using different port. Inside of the `Program.cs` file update the `CreateWebHostBuilder` method with the following code:

```cs
 public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
  WebHost.CreateDefaultBuilder(args)
    .UseUrls("https://localhost:9001")
    .UseStartup<Startup>();
```

### Add a Model and Database for Your ASP.NET Core REST API and Client

Inside your main project make a class called `JournalLog`:

```cs
public class JournalLog
{
  public string Id { get; set; }
  public string Content { get; set; }
  public DateTime DateTime { get; set; }
}
```

Now you'll need to set up your connection with the database. For this tutorial, you'll use the InMemory database with Entity Framework Core.

Inside your ASP.NET Core project create a new file `ApplicationDbContext.cs` that contains the following:

```cs
using Microsoft.EntityFrameworkCore;

namespace Api
{
  public class ApplicationDbContext : DbContext
  {
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    { }

    public DbSet<JournalLog> JournalLogs { get; set; }
  }
}
```

Time to add DbContext to your application. Inside of the`Startup` class, locate the `ConfigureServices` method and add the following to the beginning:

```cs
services.AddDbContext<ApplicationDbContext>(context =>
{
  context.UseInMemoryDatabase("JournalLogs");
});
```

The piece of code above tells the Entity Framework to use an in-memory database named `JournalLogs`. This type of database is usually used for the tests, and you shouldn't use it in production. However, this should be more than enough to cover your need for development.

Since you're using the In-Memory database, the data will be lost on every new start of the application. We can simply seed the database when our application starts. Update the `Main` method inside of `Program.cs` file with the following content:

```cs
public static void Main(string[] args)
{
  var host = CreateWebHostBuilder(args).Build();
  using (var scope = host.Services.CreateScope())
  {
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.JournalLogs.AddRange(
      new JournalLog
      {
        Content = "First message",
        DateTime = DateTime.UtcNow,
      },
      new JournalLog
      {
        Content = "Second message day after",
        DateTime = DateTime.UtcNow.AddDays(1),
      }
    );

    context.SaveChanges();
  }
  host.Run();
}
```

### Create the ASP.NET Core REST API Endpoints

Once you have a model that you plan to use for your endpoints, it's quite easy to generate a basic CRUD that will use the DbContext and your entity. First, you need the `Microsoft.VisualStudio.Web.CodeGeneration.Design` NuGet package. Enter the following inside of your favorite terminal:

```sh
dotnet add package Microsoft.VisualStudio.Web.CodeGeneration.Design --version 2.2.0
```

Now we can scaffold the controller based on the model and DbContext:

```sh
dotnet aspnet-codegenerator controller -api -async -m JournalLog -dc ApplicationDbContext -name JournalLogsController -outDir Controllers -udl
```

The command above should generate a new file with a class inside of it. The code for the class should look like this:

```cs
[Route("api/[controller]")]
[ApiController]
public class JournalLogsController : ControllerBase
{
  private readonly ApplicationDbContext _context;

  public JournalLogsController(ApplicationDbContext context)
  {
    _context = context;
  }

  // GET: api/JournalLogs
  [HttpGet]
  public async Task<ActionResult<IEnumerable<JournalLog>>> GetJournalLogs()
  {
    return await _context.JournalLogs.ToListAsync();
  }

  // GET: api/JournalLogs/5
  [HttpGet("{id}")]
  public async Task<ActionResult<JournalLog>> GetJournalLog(string id)
  {
    var journalLog = await _context.JournalLogs.FindAsync(id);

    if (journalLog == null)
    {
      return NotFound();
    }

    return journalLog;
  }

  // PUT: api/JournalLogs/5
  [HttpPut("{id}")]
  public async Task<IActionResult> PutJournalLog(string id, JournalLog journalLog)
  {
    if (id != journalLog.Id)
    {
        return BadRequest();
    }

    _context.Entry(journalLog).State = EntityState.Modified;

    try
    {
      await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
      if (!JournalLogExists(id))
      {
        return NotFound();
      }
      else
      {
        throw;
      }
    }

    return NoContent();
  }

  // POST: api/JournalLogs
  [HttpPost]
  public async Task<ActionResult<JournalLog>> PostJournalLog(JournalLog journalLog)
  {
    _context.JournalLogs.Add(journalLog);
    await _context.SaveChangesAsync();

    return CreatedAtAction("GetJournalLog", new { id = journalLog.Id }, journalLog);
  }

  // DELETE: api/JournalLogs/5
  [HttpDelete("{id}")]
  public async Task<ActionResult<JournalLog>> DeleteJournalLog(string id)
  {
    var journalLog = await _context.JournalLogs.FindAsync(id);
    if (journalLog == null)
    {
      return NotFound();
    }

    _context.JournalLogs.Remove(journalLog);
    await _context.SaveChangesAsync();

    return journalLog;
  }

  private bool JournalLogExists(string id)
  {
    return _context.JournalLogs.Any(e => e.Id == id);
  }
}
```

This has created a constructor with your `DbContext` injected into it. The `DbContext` is used for all the CRUD methods to fetch, and manipulate data. This is a standard ASP.NET scaffolding which generates methods to list entries, get a single entry by ID, update entry, delete entry, and create a new entry.

### Validate Access Tokens in Your ASP.NET Core API

Since ASP.NET Core comes with enough JWT helpers to help us validate JWT tokens it will be quite easy to finish this step.

Inside of your `Startup` class add the following `using` statement:

```cs
using Microsoft.AspNetCore.Authentication.JwtBearer;
```

After that, add the following inside of `ConfigureServices` method:

```cs
services.AddAuthentication(options =>
{
  options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
  options.Authority = "https://{yourOktaDomain}/oauth2/default";
  options.Audience = "api://default";
  options.RequireHttpsMetadata = false;
});
```

You will also need a call to ASP.NET Core's authentication middleware. This middleware should be called before we call the MVC middleware. Place the following above `app.UseMvc();` line:

```cs
app.UseAuthentication();
```

## Set Up Your ASP.NET Core MVC Client App

Dealing with authentication and authorization is always a cumbersome and frustrating process. Using Okta makes the whole process pretty much straightforward.

First, add the Okta details to your `appsettings.json` file. Above `Logging` section, add the following:

```json
"Okta": {
  "ClientId": "{yourClientId}",
  "ClientSecret": "{yourClientSecret}",
  "TokenUrl": "https://{yourOktaDomain}/oauth2/default/v1/token"
},
```

The `TokenUrl` property is the URL to your default Authorization Server. You can find this in Okta by going to the dashboard and hovering over the API menu item in the menu bar, then choosing Authorization Servers from the drop down menu. The Issuer URI for the "default" server is the URI used for the `TokenUrl` property. The `ClientId` and `ClientSecret` properties are from the General Settings page of your API application in Okta.

You should create a class `OktaConfig` that will match `Okta` section in your configuration file. Create a new file called `OktaConfig.cs`:

```cs
namespace Client
{
  public class OktaConfig
  {
    public string TokenUrl { get; set; }
    public string ClientId { get; set; }
    public string ClientSecret { get; set; }
  }
}
```

It's time for you to add this class to ASP.NET Core's Configuration system. Add the following at the top of `ConfigureServices` method in `Startup` class:

```cs
services.Configure<OktaConfig>(Configuration.GetSection("Okta"));
```

You will need a service that will live inside the application and handle all things related to tokens. It will fetch a new access token when needed and reuse the existing one when possible. Since ASP.NET Core comes with built-in DI container, we usually create a new interface when we want to add a new service to our application.

Create a new file called `TokenService.cs` and place the interface inside of the file:

```cs
public interface ITokenService
{
  Task<string> GetToken();
}
```

The implementation will decide whether or not to get a new access token or return the one that it has previously received. For the implementation of the interface create the following class:

```cs
public class TokenService : ITokenService
{
  private OktaToken _token = new OktaToken();
  private readonly IOptions<OktaConfig> _oktaSettings;

  public TokenService(IOptions<OktaConfig> oktaSettings) => _oktaSettings = oktaSettings;

  public async Task<string> GetToken()
  {
    if (_token.IsValidAndNotExpiring)
    {
      return _token.AccessToken;
    }
    _token = await GetNewAccessToken();
    return _token.AccessToken;
  }
}
```

As you can see, you will also in need of `OktaToken` class to store the token result from Okta services. Since this class will be used only inside of your `TokenService`, you can make it as a nested class or create a separate file and make it internal. Here is the code for the class:

```cs
internal class OktaToken
{
  [JsonProperty(PropertyName = "access_token")]
  public string AccessToken { get; set; }

  [JsonProperty(PropertyName = "expires_in")]
  public int ExpiresIn { get; set; }

  public DateTime ExpiresAt { get; set; }

  public string Scope { get; set; }

  [JsonProperty(PropertyName = "token_type")]
  public string TokenType { get; set; }

  public bool IsValidAndNotExpiring
  {
    get
    {
        return !String.IsNullOrEmpty(this.AccessToken) && this.ExpiresAt > DateTime.UtcNow.AddSeconds(30);
    }
  }
}
```

This first pass at the Okta token service starts by getting the `OktaConfig` injected from the application services. It also has a class-level variable that will hold the `OktaToken` object (which you'll create in a moment). The `GetToken()` method merely checks to see if the token is valid and not expired (or expiring soon) and either gets a new access token or returns the current one.

As you can see already, we need a code to get a new access token. Here is the code for `GetNewAccessToken()` method:

```cs
private async Task<OktaToken> GetNewAccessToken()
{
  var client = new HttpClient();
  var clientId = _oktaSettings.Value.ClientId;
  var clientSecret = _oktaSettings.Value.ClientSecret;
  var clientCreds = System.Text.Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}");

  client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(clientCreds));

  var postMessage = new Dictionary<string, string>
  {
    {"grant_type", "client_credentials"},
    {"scope", "access_token"}
  };

  var request = new HttpRequestMessage(HttpMethod.Post, _oktaSettings.Value.TokenUrl)
  {
    Content = new FormUrlEncodedContent(postMessage)
  };

  var response = await client.SendAsync(request);
  if (response.IsSuccessStatusCode)
  {
    var json = await response.Content.ReadAsStringAsync();
    var newToken = JsonConvert.DeserializeObject<OktaToken>(json);
    newToken.ExpiresAt = DateTime.UtcNow.AddSeconds(_token.ExpiresIn);
    return newToken;
  }

  throw new ApplicationException("Unable to retrieve access token from Okta");
}
```

A lot of this method is setting up the `HttpClient` to make the call to the Authorization Server. The interesting parts are the `clientCreds` value that gets the bytes of a string that has the client ID and secret concatenated with a colon between them. That value is then base64 encoded when it's added to the `Authorization` header with "Basic " in front of it. Note that the word "Basic " is NOT encoded.

There are also two key-value pairs sent as `FormUrlEncodedContent`: the `grant_type` which has a value of "client_credentials", and the `scope` which has a value of "access_token". This simply tells the Authorization Server that you are sending client credentials and you want to get an access token in exchange.
The entire contents of the `OktaTokenService` (with using directives) should look like this:

```cs
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Client
{
  public interface ITokenService
  {
    Task<string> GetToken();
  }

  public class TokenService : ITokenService
  {
    private OktaToken _token = new OktaToken();
    private readonly IOptions<OktaConfig> _oktaSettings;

    public TokenService(IOptions<OktaConfig> oktaSettings) => _oktaSettings = oktaSettings;

    public async Task<string> GetToken()
    {
      if (_token.IsValidAndNotExpiring)
      {
        return _token.AccessToken;
      }

      _token = await GetNewAccessToken();

      return _token.AccessToken;
    }

    private async Task<OktaToken> GetNewAccessToken()
    {
      var client = new HttpClient();
      var clientId = _oktaSettings.Value.ClientId;
      var clientSecret = _oktaSettings.Value.ClientSecret;
      var clientCreds = System.Text.Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}");

      client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(clientCreds));

      var postMessage = new Dictionary<string, string>
      {
        {"grant_type", "client_credentials"},
        {"scope", "access_token"}
      };

      var request = new HttpRequestMessage(HttpMethod.Post, _oktaSettings.Value.TokenUrl)
      {
        Content = new FormUrlEncodedContent(postMessage)
      };

      var response = await client.SendAsync(request);
      if (response.IsSuccessStatusCode)
      {
        var json = await response.Content.ReadAsStringAsync();
        var newToken = JsonConvert.DeserializeObject<OktaToken>(json);
        newToken.ExpiresAt = DateTime.UtcNow.AddSeconds(_token.ExpiresIn);

        return newToken;
      }

      throw new ApplicationException("Unable to retrieve access token from Okta");
    }
  }
}
```

### Inject the Token Service Class Into the ASP.NET Core Application

As always when adding dependencies to the DI system, locate the `ConfigureServices()` method inside of `Startup` class and add the following at the top of the method:

```cs
services.AddSingleton<ITokenService, TokenService>();
```

Your `Startup.cs` file should look like this:

```cs
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Client {
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddSingleton<ITokenService, TokenService>();

      services.Configure<OktaConfig>(Configuration.GetSection("Okta"));

      services.AddDbContext<ApplicationDbContext>(context =>
      {
        context.UseInMemoryDatabase("JournalLogs");
      });

      services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      else
      {
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
      }

      app.UseHttpsRedirection();
      app.UseMvc();
    }
  }
}

```

Don't worry if everything isn't the same — order of methods in `ConfigureServices()` doesn't matter. However, inside of `Configure()` the order matters, and in general it's the most important thing.

### Call the Protected REST API from the ASP.NET Core MVC Client

Locate the `HomeController.cs` file and update its content with the following code:

```cs
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Client
{
  public class HomeController : Controller
  {
    private readonly ITokenService _tokenService;
    private readonly HttpClient _httpClient = new HttpClient();

    public HomeController(ITokenService tokenService)
    {
      _tokenService = tokenService;
    }

    public async Task<IActionResult> Index()
    {
      var logs = await GetJournalLogs();
      return View(logs);
    }

    public IActionResult Privacy()
    {
      return View();
    }

    private async Task<List<JournalLog>> GetJournalLogs()
    {
      var token = await _tokenService.GetToken();
      _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, token);
      var res = await _httpClient.GetAsync("https://localhost:9001/api/values");
      if (res.IsSuccessStatusCode)
      {
        var content = await res.Content.ReadAsStringAsync();
        var journalLogs = JsonConvert.DeserializeObject<List<JournalLog>>(content);
        return journalLogs;
      }
      return null;
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error() => View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });

    public class JournalLog
    {
      public string Id { get; set; }
      public string Content { get; set; }
      public DateTime DateTime { get; set; }
    }
  }
}
```

## Test Your ASP.NET Core REST API

Let's give our application a spin. Run the ASP.NET Core API by running the following in your bash inside of `api` folder:

```sh
dotnet run
```

You can now start the ASP.NET Core MVC application by running the following in your bash inside of `client` folder:

```sh
dotnet run
```

Your default browser should now open and show a page like this:

{% img blog/aspnetcore-restapi/app-running.png alt:"Final App Running" width:"800" %}{: .center-image }

## Learn More About ASP.NET Core, Secure REST APIs, and Authentication

As you can see, ASP.NET Core makes it really easy when it comes to creating REST APIs. With tons of built-in features it helps you write minimal amount of code needed for your application. Instead of caring how to handle REST actions, you focus on writing business oriented code.

You can find the source code for complete application at the following link: [https://github.com/oktadeveloper/okta-aspnetcore-22-rest-api-example](https://github.com/oktadeveloper/okta-aspnetcore-22-rest-api-example).

If you want to read more about Okta or ASP.NET Core check out the Okta Dev Blog.

Here are some other great content to check out as well:

* [Build a Secure CRUD App with ASP.NET Core and React](/blog/2018/07/02/build-a-secure-crud-app-with-aspnetcore-and-react)
* [Build a Simple CRUD App with ASP.NET Core and Vue](/blog/2018/08/27/build-crud-app-vuejs-netcore)
* [Token Authentication in ASP.NET Core 2.0 - A Complete Guide](/blog/2018/03/23/token-authentication-aspnetcore-complete-guide)

And as always, we'd love to hear from you. Hit us up with questions or feedback in the comments, or on Twitter [@oktadev](https://twitter.com/oktadev).
