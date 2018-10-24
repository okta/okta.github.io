---
layout: blog_post
title: "Get Started with Blazor and WebAssembly"
author: ibrahim
description: "This tutorial walks you through the basics of Blazor and WebAssembly."
tags: [blazor, webassembly]
tweets:
- "Getting started with #blazor? @ibro has you covered!"
- "A quick introduction to #blazor and WebAssembly. ->"
- "Looking for a quick introduction to #blazor and WebAssembly, check this out!"
image: blog/blazor/okta-dotnet-books-quarter.jpg
---

If you're a modern web dev, you're probably using JavaScript. Until recently, it was the only serious choice for more web development. For those of us who may not have JS as their primary language competency (but who are still interested in building web apps) that world is beginning to change. Today, we have WebAssembly (Wasm). WebAssembly is an alternative way of developing web applications, and it doesn't require you to know any JavaScript. WebAssembly is a new type of code that can be run in modern web browsers and provides new features and major gains in performance. It is not primarily intended to be written by hand, rather it is designed to be an effective compilation target for other languages. It was designed to run alongside JavaScript, and allows you to load WebAssembly modules in JavaScript using the WebAssembly JavaScript APIs.

Microsoft has been closely following the progress of WebAssembly, and recently they decided to get more serious in their experimenting. Last year in August it was announced that .NET is coming to the browser using the Mono runtime. Some months after, we got Blazor a .NET web framework using the power of Razor and C# to run in the browser with WebAssembly. It's a SPA web framework with all the features of a modern web framework like the component model, routing, layouts, forms and validation, DI, live reloading, server-side rendering, and full .NET debugging in browsers and in the IDE.

Running Blazor in a browser really depends on the browser's support for WebAssembly. Luckily, all modern browsers supports WebAssembly. This includes Edge, Edge Mobile, Chrome, Chrome for Android, Firefox, Firefox for Android, Safari, iOS Safari, and Samsung Internet.


## Advantages of Blazor
As a .NET developer you will be able to use your favorite language and framework to build client side applications as well. You will also be able to share your models, code, business logic between your server side code and client side code, and this is huge. Having shared code between server and client has always been a dream for many .NET developers. 

Onboarding new developers to the project should be a lot easier since they won't need to know yet another major language. Also, having backend developers work on frontend tasks is going to be more realistic and enjoyable for developers.


## Building Your First Blazor and WebAssembly App
You should have [.NET Core 2.1 SDK (2.1.302)](https://go.microsoft.com/fwlink/?linkid=873092), Visual Studio 2017 (15v.7 or later) with the *ASP.NET and web development workload* installed, and finally, you should install the [Blazor Language Service extension](https://go.microsoft.com/fwlink/?linkid=870389).

Now we can create a Blazor app using built-in template within Visual Studio. We will start from a scratch.

In Visual Studio, select **File** > **New Project**.

{% img blog/blazor/new-blazor-project.png alt:"new blazor project" width:"800" %}{: .center-image }

Select a location where your code will be stored.

{% img blog/blazor/choose-blazor-type.png alt:"choose blazor type" width:"800" %}{: .center-image }

Now we will create a simple API project that will act as server-side API. 

In Visual Studio, right click on the Solution inside of the **Solution Explorer** > **New Project**.

{% img blog/blazor/new-api-project.png alt:"new api project" width:"800" %}{: .center-image }

Choose the existing folder for your application and click **OK**.

{% img blog/blazor/choose-api-type.png alt:"choose api type" width:"800" %}{: .center-image }

You should choose the API template, uncheck `Configure for HTTPS` and click **OK**.

You'll want to specify the port that for the Blazor application and the API. To do so, right click on the project in the solution explorer and click **properties**. In the main properties window, choose **Debug** from the left-hand menu, find *Web Server Settings* section.

For the Blazor project set the **App Url** property to `http://localhost:5000`. Do the same for the API project and set the **App Url** property to `http://localhost:5001`.

{% img blog/blazor/set-web-url.png alt:"set web url" width:"800" %}{: .center-image }

Update the Solution properties for Startup Project. Within Solution Explorer right click on Solution file `OktaBlazor` -> Properties and at `Startup Project` tab make sure you have following settings:

{% img blog/blazor/set-startup-project.png alt:"set startup project" width:"800" %}{: .center-image }


## Update the Blazor API
For the API project, we will update the ValuesController with the following content:

```cs
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace OktaBlazor.API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ValuesController : ControllerBase
  {
    // GET api/values
    [HttpGet]
    public ActionResult<IEnumerable<string>> Get() => new[] { "Okta", "Blazor", ".NET", "Razor" };   	 
  }
}
```

## Enable CORS in Your Blazor API
If you want to be able to fetch data from the server you will need to enable CORS on your API.

Inside of `ConfigureServices` method within `Startup` class add the following:

```cs
services.AddCors(options =>
{
  options.AddPolicy("CorsPolicy",
    builder =>
    {
      builder
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
        .WithOrigins("http://localhost:5000");
    });
});
```

And inside of `Configure` method, before `app.UseMvc();` line add the following:

```cs
app.UseCors("CorsPolicy");
```

## Update Your Blazor Application
Back in the OktaBlazor project, inside of `Pages` folder there is `FetchData.cshtml` file which represents a Blazor component. Update the file with following content:


```html
@page "/fetchdata"
@inject HttpClient Http

<h1>Blazor</h1>

<p>This component demonstrates fetching data from the server.</p>

@if (words == null)
{
  <p><em>Loading...</em></p>
}
else
{
  foreach (var word in words)
  {
    <span>@word</span>
    <br />
  }
}

@functions {
  string[] words;

  protected override async Task OnInitAsync()
  {
    words = await Http.GetJsonAsync<string[]>("http://localhost:5001/api/values");
  }
}
```
You can run the application by pressing `CTRL + F5` or simply `F5`. You won't need to do anything special to configure it. It will simply work since Blazor will do everything for you. Blazor will not compile your .NET code to JS. It will download .NET assemblies in the browser, load them with the help of Mono and will execute those directly in the browser via WebAssembly.

## Learn More About Blazor, WebAssembly, and Secure Web Development
Blazor is an experimental technology that has the perspective to replace current major client-side frameworks eventually. It is still not a production-ready framework, but it promises to be an enjoyable full SPA framework powered by C# and Razor.

If this turns out to be true, Microsoft will probably be aiming to make it a solid replacement for the most used SPA frameworks (React, Angular, Vue). As time passes, I am sure there will be other WebAssembly frameworks that will compete with Razor. However, it seems that Microsoft is starting to invest more and more in Blazor and taking it more seriously.

With the possibility to use your C# skills for frontend applications, Blazor opens space for a whole new ecosystem inside of the .NET world. Hence, we will see many more NuGet libraries aiming to help and replace libraries that we use on client-side.

After playing around with Blazor, I hope you will follow its progress in the future. It definitely seems interesting, and it promises a lot, but we still need to see what will Microsoft do and what kind of tooling they will offer for Visual Studio and outside of Visual Studio. Also, it will be interesting to see how the community will react and if we can build a healthy ecosystem around Blazor and create amazing client-side libraries.

You can find the source code for complete application at following link: [https://github.com/oktadeveloper/blazor-example](https://github.com/oktadeveloper/blazor-example).

Here are some other great resources to check out as well:

* [Official Blazor repository](https://github.com/aspnet/blazor)
* [Get started with Blazor](https://blazor.net/docs/get-started.html)
* [Getting started with Blazor](https://www.jerriepelser.com/blog/getting-started-with-blazor/)

You can also learn more about ASP.NET and from our developer blog.

* [CRUD with ASP.NET Framework WebAPI and Angular](/blog/2018/07/27/build-crud-app-in-aspnet-framework-webapi-and-angular)
* [Build a simple CRUD app with ASP.NET Core and Vue](/blog/2018/08/27/build-crud-app-vuejs-netcore)
* [Deploy your ASP.NET Core app to Azure](/blog/2018/06/19/deploy-your-aspnet-core-app-to-azure)

As always, if you have questions feel free to post them in the comments below. Don't forget to follow us on [Twitter](https://twitter.com/oktadev), [Facebook](https://www.facebook.com/oktadevelopers/), and [LinkedIn](https://www.linkedin.com/company/oktadev/). Also, check out our [YouTube Channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q).