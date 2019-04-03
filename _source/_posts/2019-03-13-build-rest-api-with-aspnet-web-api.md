---
layout: blog_post
title: "Build a REST API with ASP.NET Web API"
author: ryanfoster
description: "Learn how to build RESTful API service with ASP.NET Web API."
tags: [aspnet, dotnet, web api, aspnet web api, dotnet web api, webapi]
tweets:
- "If you need to learn how to build a REST API with @aspnet Web API, check out this post!"
- "Check out this easy-to-follow tutorial for creating a RESTful API using @aspnet Web API."
- "This is a quick tutorial for building a REST API using @aspnet Web API."
image: blog/featured/okta-dotnet-bottle-headphones.jpg
---

Do you need to build a REST API with ASP.NET Web API?  If you're creating a new API, you should probably create it with .NET Core. But it's not always possible to use the latest and greatest technologies. If you're working in an existing ASP.NET 4.x app, or the organization you work for hasn't approved the use of .NET Core yet, you may need to build an API in .NET Framework 4.x. That is what you will learn here. You'll also learn how to access your API from another application (for machine-to-machine communication) and prevent unauthorized access to your API.

As you go, I'll show you how to implement standard design patterns so it will be easy for other developers to understand and work with your API.

There are a couple of things you'll need to work through this tutorial.

* Visual Studio 2017
* [Postman](https://www.getpostman.com/downloads/), curl, or a similar tool to manually test your API

Let's get started!

## Create an ASP.NET Web API 2 Project

In Visual Studio...

* Go to **File** > **New** > **Project...**
* Select the **Visual C#** project category and then select **ASP.NET Web Application (.NET Framework)**
* Name your project `AspNetWebApiRest` and click **OK**
* Select the **Empty** project template and click **OK** (don't check any boxes to add core references)

Now you need to get a few NuGet packages. Use these commands in the Package Manager console to install them:

```sh
Install-Package Microsoft.AspNet.WebApi
Install-Package Microsoft.Owin.Host.SystemWeb
Install-Package Microsoft.AspNet.WebApi.OwinSelfHost
```

If you pasted those in all at once, make sure to hit enter after the last line so the last package will be installed too.

Now right click on your project select **Add** > **Class...** and name it `Startup.cs`. Copy and paste this into the new file:

```cs
using System.Web.Http;
using Newtonsoft.Json.Serialization;
using Owin;

namespace AspNetWebApiRest
{
   public class Startup
   {
       public void Configuration(IAppBuilder app)
       {
           var config = new HttpConfiguration();

           config.MapHttpAttributeRoutes();

           config.Routes.MapHttpRoute(
               name: "DefaultApi",
               routeTemplate: "api/{controller}/{id}",
               defaults: new { id = RouteParameter.Optional }
           );

           app.UseWebApi(config);
       }
   }
}
```

The code above creates an OWIN pipeline for hosting your Web API, and configures the routing.

Next add a `Controllers` folder to your project. Then right click on the `Controllers` folder and select **Add** > **New Item...**. On the left select **Visual C#** > **Web** > **Web API**. Then click on **Web API Controller Class (v2.1)**, name it  `ListItemsController.cs`, and click **Add**.

Now you should have a controller with methods to get, post, put, and delete list items. Let's test it.

Press **F5** to launch your API. After the browser opens, add `/api/listitems` to the end of the URL and hit **Enter**

You should see some items in the XML output. You actually want your API to use JSON, not XML, so let's fix that.

In `Startup.cs` add these lines in the `Configuration()` method, right above `app.UseWebApi(config);`

```cs
config.Formatters.Remove(config.Formatters.XmlFormatter);
config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
config.Formatters.JsonFormatter.SerializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc;
```

This code removes the `XmlFormatter` (which was the default output formatter), and configures the `JsonFormatter` to camel-case property names and to use UTC time for dates.

Now run your project again, navigate to `/api/listitems`, and verify that it spits out a JSON list now.

## Create a Resource and the ASP.NET Web API Actions 

Now let's make this API actually do something useful. In this section, you'll create a list item resource and wire up all of the controller actions so you can create, read, update, and delete items.

Go ahead and create a `Models` folder in your project and add a `CustomListItem.cs` class. It should look like this:

```cs
namespace AspNetWebApiRest.Models
{
   public class CustomListItem
   {
       public int Id { get; set; }
       public string Text { get; set; }
   }
}
```

Normally you would want to store your items in some kind of database, but since the focus of this tutorial is on building a REST API, you will just use a static list in memory to store our items.

Back in your `ListItemsController` class, add a private static property to store your list items in memory. Add the private property inside the class declaration.

```cs
private static List<CustomListItem> _listItems { get; set; } = new List<CustomListItem>();
```

You will also need to add a using statement to the top of the controller.

```cs
using AspNetWebApiRest.Models;
```

Now change the first `Get()` method in the controller to return this list (note the change in the return type):

```cs
public IEnumerable<CustomListItem> Get()
{
   return _listItems;
}
```

If you run the API again, you'll see that `/api/listitems` returns an empty list.

Let's modify the `Post()` method so you can add new items to the list.

```cs
public HttpResponseMessage Post([FromBody]CustomListItem model)
{
   if(string.IsNullOrEmpty(model?.Text))
   {
       return Request.CreateResponse(HttpStatusCode.BadRequest);
   }
   var maxId = 0;
   if (_listItems.Count > 0)
   {
       maxId = _listItems.Max(x => x.Id);
   }
   model.Id = maxId + 1;
   _listItems.Add(model);
   return Request.CreateResponse(HttpStatusCode.Created, model);
}
```

This is what the `Post()` method does:

* Returns a Bad Request response if the list item `Text` property is missing or blank
* Calculates the next available ID
* Assigns the ID and adds the item to the list
* Returns the whole item (including the new id) in the response body, along with a Created status code

Note that for ideal security, you would create a separate EditModel that didn't include the `Id` property, and receive that as the method parameter in order to prevent any possibility of the user specifying their own ID. The code above is safe, but if another developer came along and modified it, they might accidentally introduce a vulnerability.

Now let's test your `Post()` method with Postman:

{% img blog/rest-aspnet-webapi/postman-create-item-post-json.png alt:"Postman Create Item" width:"800" %}{: .center-image }

In Postman...

* Create a new request
* Change the method to **POST**
* Enter the URL for your API: `http://localhost:{yourPortNumber}/api/listitems`
* Click on the **Body** tab, select **raw**
* Notice the dropdown menu that appears in that row. Click on it and change it to **JSON (application/json)** (this will add a `Content-Type` header with the value of `application/json` to the request)
* Put the object your want to create into the body: `{ "text": "Test item" }`
* Click **Send**

If you get an error, make sure your API is running. You can see the API is returning a 201 Created status code and the new object in the response body.

After you add a few items, you can make a GET request to the same URL to see your list of items. It should look something like this:

```json
[{"id":1,"text":"Test item"},{"id":2,"text":"Test item 2"}]
```

Now let's implement the method to get a specific item from the list:

```cs
public HttpResponseMessage Get(int id)
{
    var item = _listItems.FirstOrDefault(x => x.Id == id);
    if (item != null)
    {
        return Request.CreateResponse(HttpStatusCode.OK, item);
    }
    return Request.CreateResponse(HttpStatusCode.NotFound);
}
```

Here you find the item and return it with a status code of 200 (OK). If the item to was not found, the API returns a 404 (Not Found) status code.

The `Delete()` method is similar:

```cs
public HttpResponseMessage Delete(int id)
{
    var item = _listItems.FirstOrDefault(x => x.Id == id);
    if (item != null) {
        _listItems.Remove(item);
        return Request.CreateResponse(HttpStatusCode.OK, item);
    }
    return Request.CreateResponse(HttpStatusCode.NotFound);
}
```

You can either return a copy of the item you deleted along with a status code of 200 (OK) to indicate that everything went well as in the example above, or you can use the status code 204 (No Content) to indicate success without returning the item.

For updates, you can use either the PUT or PATCH method. Use the PUT method if you need to replace the existing item with a new one. If you just need to update one property, you would still need to include all of the other properties as well when you update the item. Use the PATCH method if you just want to update select properties and leave all other properties of the item alone.

Some APIs just use the POST method for updates. For this example, you'll use the PUT method. Replace the `Put()` method with this code:

```cs
public HttpResponseMessage Put(int id, [FromBody]CustomListItem model)
{
    if (string.IsNullOrEmpty(model?.Text))
    {
        return Request.CreateResponse(HttpStatusCode.BadRequest);
    }
    var item = _listItems.FirstOrDefault(x => x.Id == id);
    if (item != null)
    {
        // Update *all* of the item's properties
        item.Text = model.Text;

        return Request.CreateResponse(HttpStatusCode.OK, item);
    }
    return Request.CreateResponse(HttpStatusCode.NotFound);
}
```

The code above is similar to the other methods you have implemented. Note that if you were updating a resource that had a uniqueness constraint, you would need to make sure the update did not violate that constraint. If a conflict was detected, you would use the status code 409 (Conflict) to inform the caller that the update failed.

## Secure Your RESTful ASP.NET Web API 

What is the best way to secure this API if you need to access it from another program or service?

You could hard-code a username and password in the API and then pass those credentials in an authorization header, but that wouldn't be ideal. Whenever you needed to change the credentials you would need to update the clients and the API. Also, there wouldn't be a good way to revoke access for just one client, leaving access for other clients in place.

The OAuth 2.0 Client Credentials flow solves these problems by outsourcing the management and validation of client credentials to an authorization server.

Here's how it works:

1. The client application requests an access token from the authorization server. To get this access token, the client presents a username and password.
2. When the client makes a request to your API, it sends along the access token in the authorization header.
3. Your API validates the token. If the token is valid and contains the right permissions, your API allows the request to complete.

(If this is all new to you, you can [learn more about OAuth here](https://developer.okta.com/blog/2017/06/21/what-the-heck-is-oauth).)

You probably don't want to build an OAuth 2.0 authorization server yourself, so for this tutorial, you will sign up for a [forever-free Okta developer account](https://developer.okta.com/signup/) (or sign in to `{yourOktaDomain}` if you already have an account).

## Register the Client Application for Your REST API

Once you're signed in to Okta, register your client application.

* In the top menu, click on **Applications**
* Click on **Add Application**
* Select **Service** and click **Next**
* Enter `Postman` for the **Name** and click **Done**

Note the **Client ID** and the **Client Secret**. This is the username and password that our client application (Postman in our case) need to send to the authorization server to request an access token. You can make note these credentials now or you can come back and get them later when you need them.

## Create a Custom Scope

Now you need to set up the authorization server:

* Go to **API** > **Authorization Servers**
* Click the link for the **default** authorization server
* Select the **Scopes** tab
* Add a scope named `manage:lists` and click **Create** (you can leave everything except for the **Name** field blank)

Your client application will request access to this scope.

You are all done configuring your authorization server!

## Add Authentication to Your REST API

Now you will configure your API to require an access token. First, use these commands in the Package Manager console to add the NuGet packages you will need:

```sh
Install-Package Microsoft.Owin.Security.Jwt
Install-Package Microsoft.IdentityModel.Protocols.OpenIdConnect
```

Now we need to make a few changes to `Startup.cs`. First you will add some code that will contact your authorization server to get configuration information. Specifically, the API needs a public signing key so the API can validate the signature of access tokens (this makes it impossible for the bad guys to forge a valid access token).

After that, you will add the JWT Bearer Authentication middleware to the OWIN pipeline. This middleware will automatically validate any access token sent to the API and use it to create an identity with claims.

Open `Startup.cs`, and add these `using` statements at the top of the file:

```cs
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Jwt;
using System.Threading.Tasks;
```

Now add this code at the top of the `Configuration()` method:

```cs
var authority = "https://{yourOktaDomain}/oauth2/default";

var configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>(
   authority + "/.well-known/openid-configuration",
   new OpenIdConnectConfigurationRetriever(),
   new HttpDocumentRetriever());
var discoveryDocument = Task.Run(() => configurationManager.GetConfigurationAsync()).GetAwaiter().GetResult();

app.UseJwtBearerAuthentication(
   new JwtBearerAuthenticationOptions
   {
       AuthenticationMode = AuthenticationMode.Active,
       TokenValidationParameters = new TokenValidationParameters()
       {
           ValidAudience = "api://default",
           ValidIssuer = authority,
           IssuerSigningKeyResolver = (token, securityToken, identifier, parameters) =>
           {
               return discoveryDocument.SigningKeys;
           }
       }
   });
```

Now edit the first line to set your `authority` to the **Issuer URI** of your authorization server. To find this, go to your Okta dashboard and navigate to **API** > **Authorization Servers**. Find the row for the default authorization server, copy the value in the **Issuer URI** column, and paste it into the line where you set the `authority` variable. (If you're building something for production, be sure to store this value in a configuration setting rather than hard-coding it here.)

Note that the `ValidAudience` in the code above must also match the your authorization server's audience (in this case `api://default`) and the token must not be expired for the validation to succeed.

Now go to your `ListsController.cs` and add an `[Authorize]` attribute right above the class definition.

```cs
   [Authorize]
   public class ListsController : ApiController
   {
```

Now your API will require a valid access token to be sent via the Authorization header of every request.

Let's verify that access is denied if we _don't_ provide an access token.

Run the API. Then in Postman, send a POST request to `/api/listitems`, like you did earlier. Now you should see a `401 Unauthorized` status returned, and a message in the body:

```json
{
   "message": "Authorization has been denied for this request."
}
```

Great.

Now you need an access token.

Here is how to get it in Postman:

{% img blog/rest-aspnet-webapi/postman-authorization-get-oauth-access-token.png alt:"Postman get access token" width:"800" %}{: .center-image }

Click on the **Authorization** tab of your request, select **OAuth 2.0** from the **TYPE**  drop-down list, and click **Get New Access Token**

Now fill in the form. **Token Name** can be something recognizable like `AspNetWebApiRest`. **Grant Type** must be **Client Credentials**.

**Access Token URL** will be in this format: `https://{yourOktaDomain}/oauth2/default/v1/token`. To find this in your Okta dashboard go to **API** > **Authorization Servers**, copy the **Issuer URI** for the authorization server that you created earlier, and append `/v1/token` to the end.

To find your **Client ID** and **Client Secret**, in your Okta dashboard:

* Navigate to **Applications**
* Click on **Postman** (the client application you add earlier)
* Use the **Copy to clipboard** icon beside each field to copy the values and then paste them into Postman

Now fill in the last two fields left in the form. For **Scope** enter `manage:lists`. For **Client Authentication** make sure **Send as Basic Auth header** is selected.

Now you can click **Request Token**. If you get an error, double check every value in the **Get New Access Token** form.

When you get the access token, scroll down and click **Use Token**. If you miss this step, you can find the token in the **Available Tokens** drop-down list the Postman authorization tab.

Now you're all set. Click on **Send** in Postman to send the request (with the access token attached).

If you've done everything correctly so far, you'll get a success message back from the API.

If you made a mistake somewhere, you'll see that authorization has been denied, and you'll want to cry because you have no idea where you made a mistake. Here are some things you can check:

* Does the `authority` in `Startup.cs` match the **Issuer URI** of your authorization server?
* Does the `ValidAudience` in `Startup.cs` match the **Audience** of your authorization server exactly?
* If it has been more than an hour since you requested an access token, remember to request a _new_ access token (they are set to expire after 1 hour)

Note that in this tutorial you are running your local API over an insecure http connection. For production, you should serve your API via https so that your access token cannot be stolen in transit. If you host this API in IIS, you will also need to configure IIS to allow the PUT and DELETE verbs, which are not allowed by default.

That wasn't too difficult, was it?

Although this setup is _slightly_ more complicated than simply hardcoding a username and password in your API, it gives you a lot more control over how you manage access to your API. I think you'll agree that it is a better approach.

## Learn More About REST APIs and ASP.NET Web API

Interested in learning more about API access management or building secure applications with Okta? Check out our [Product Documentation](https://developer.okta.com/use_cases/api_access_management/) or any of these great resources:

* [How to Secure Your .NET Web API with Token Authentication](/blog/2018/02/01/secure-aspnetcore-webapi-token-auth)
* [Build a Simple CRUD App with ASP.NET Framework 4.x Web API and Vue](/blog/2018/09/07/build-simple-crud-with-aspnet-webapi-vue)
* [Build a CRUD App with ASP.NET Framework 4.x Web API and Angular](/blog/2018/07/27/build-crud-app-in-aspnet-framework-webapi-and-angular)
