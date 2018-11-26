---
layout: blog_post
title: "Build a SPA with ASP.NET Core 2.1, Stripe, and Angular 6"
author: leebrandt
description: "This tutorial walks you through building an online ticket sales app using ASP.NET Core 2.1, Stripe, and Angular 6."
tags: [asp.net, dotnet, core, asp.net core, dotnet core, dot net core, angular, crud]
tweets:
- "Build a ticket sales app using @stripe, #aspnetcore 2.1, and @angular 6! →"
- "Need to learn the basics of #aspnetcore 2.1, @stripe, and @angular 6? We've got you covered. <3"
- "Let @leebrandt show you how to sell tickets online using #aspnetcore, @stripe, and @angular 6! →"
---

Buying things on the Internet has become a daily activity and is a feature many new projects require. In this tutorial, I will show you how to build an app to sell tickets using an Angular 6 single page app (SPA) using an ASP.NET Core 2.1 backend API. You'll build both the Angular and ASP.NET Core applications and run them from within VS Code. Let's get to it!

## Upgrade to Angular 6

I love to use the latest and greatest when starting a new project. But when you use a project generator (like Angular-CLI, or the DotNetCLI), you may be at the mercy of the latest version the authors of those libraries have added. Right now, the DotNet CLI generates an Angular application with `dotnet new angular` gives you an Angular app at about version 4.5, which is about two versions behind the latest. Let me show you how to upgrade the templates and the generated application so that you're using Angular 6, which is the latest as of the time of this article.

### Upgrade the Angular App Template

Update the DotNet command line tools with:

```bash
dotnet new --install Microsoft.DotNet.Web.Spa.ProjectTemplates::2.1.0
```

Then run:

```bash
dotnet new --install Microsoft.AspNetCore.SpaTemplates::2.1.0-preview1-final
```

### Generate the ASP.NET Angular App

Now you can scaffold a new project:

```bash
dotnet new angular -o ticket-sales-example
```

### Upgrade the Angular App To 6

The closest that gets you is Angular v5.2.0. To update Angular to v6.0.9 (as of this writing) switch to the `ClientApp` directory and run:

```bash
ng update --all
```

This will update the `package.json` file; then you need to run:

```bash
npm install
```

If you get a message about `@angular/cli` you can update it by running:

```bash
ng update @angular/cli
```

You may now see some vulnerabilities in your NPM packages. To fix them run:

```bash
npm audit fix
```

You may have to run this several times as some of the fixes introduce new vulnerabilities. I was only able to get my vulnerability list down to 6. I still have one low and five moderate vulnerabilities. If you want to get to zero vulnerabilities, you would have to hunt them each down and fix them manually.

## Create a Stripe Account

One of the easiest ways to take payments on the web is to use [Stripe](https://stripe.com/). You can create a free developer account on [Stripe's registration page](https://dashboard.stripe.com/register).

Once you've registered, make sure that you go to your dashboard and on the left-hand menu, click the toggle to ensure you are viewing test data. Then click on the **Developers** menu item and then click **API Keys**. Copy down the **Publishable key** to use in your Angular app.

## Add Stripe to Your Angular 6 App

In your `index.html` file, add a script tag for Stripe's JavaScript library, right below the `app-root` component.

```ts
<script type="text/javascript" src="https://js.stripe.com/v2/" />
```

Also add your publishable key to the Stripe object:

```ts
<script type="text/javascript">
  Stripe.setPublishableKey('{yourPublishableKey}');
</script>
```

> Make sure that your publishable key starts with `pk_test_`. If it doesn't, you're using the production key, and you don't want to do that yet.

## Create the Stripe Ticket Registration Page

You can easily scaffold the base registration component with the Angular CLI. Go to a command line and change directories into the `src/app` directory. Then run the command:

```bash
ng generate component registration
```

The shorthand for the CLI is:

```bash
ng g c registration
```

The generate command will generate a folder called `registration`, and inside that a `registration.compomnent.css`, `registration.component.html`, a `registration.component.spec.ts`, and a `registration.component.ts` file. These are all the basic files for an Angular 6 component. I won't be covering testing in this tutorial, so you can ignore or delete the `registration.component.spec.ts` file.

First, add some basic HTML to your `registration.component.html` file for displaying tickets. So the final file contents looks like this:

{% raw %}

```html
<h1>Register for SuperDuperConf</h1>

<div class="ticket conf-only">
  <span class="title">Conference Only Pass</span>
  <span class="price">$295</span>
  <button (click)="selectTicket('Conference Only', 295)">Register Now!</button>
</div>

<div class="ticket full">
  <span class="title">Full Conference + Workshop Pass</span>
  <span class="price">$395</span>
  <span class="value">Best Value!</span>
  <button (click)="selectTicket('Full Conference + Workshop', 395)">Register Now!</button>
</div>

<div class="ticket work-only">
  <span class="title">Workshop Only Pass</span>
  <span class="price">$195</span>
  <button (click)="selectTicket('Workshop Only', 195)">Register Now!</button>
</div>

<div class="alert alert-success" *ngIf="model.successMessage">{{successMessage}}</div>
<div class="alert alert-danger" *ngIf="model.errorMessage">{{errorMessage}}</div>

<div *ngIf="model.ticket.price">

  <form (submit)="purchaseTicket()" class="needs-validation" novalidate #regForm="ngForm">
    <div class="form-group">
      <label for="firstName">First Name:</label>
      <input type="text" class="form-control" name="firstName" id="firstName" [(ngModel)]="model.firstName" required #firstName="ngModel">
      <div [hidden]="firstName.valid || firstName.pristine" class="text-danger">First Name is required.</div>
    </div>

    <div class="form-group">
      <label for="lastName">Last Name:</label>
      <input type="text" class="form-control" name="lastName" id="lastName" [(ngModel)]="model.lastName" required #lastName="ngModel">
      <div [hidden]="lastName.valid || lastName.pristine" class="text-danger">Last Name is required.</div>
    </div>

    <div class="form-group">
      <label for="email">Email Address:</label>
      <input type="text" class="form-control" name="email" id="email" [(ngModel)]="model.emailAddress" required #email="ngModel">
      <div [hidden]="email.valid || email.pristine" class="text-danger">Email Address is required.</div>
    </div>

    <div class="form-group">
      <label for="password">Password:</label>
      <input type="password" class="form-control" name="password" id="password" [(ngModel)]="model.password" required #password="ngModel">
      <div [hidden]="password.valid || password.pristine" class="text-danger">Password is required.</div>
    </div>

    <div class="form-group">
      <label for="cardNumber">Card Number:</label>
      <input type="text" class="form-control" name="cardNumber" id="cardNumber" [(ngModel)]="model.card.number" required>
    </div>

    <div class="form-group form-inline">
      <label for="expiry">Expiry:</label>
      <br/>
      <input type="text" class="form-control mb-1 mr-sm-1" name="expiryMonth" id="expiryMonth" [(ngModel)]="model.card.exp_month"
        required> /
      <input type="text" class="form-control" name="expiryYear" id="expiryYear" [(ngModel)]="model.card.exp_year" required>
    </div>

    <div class="form-group">
      <label for="cvc">Security Code:</label>
      <input type="text" class="form-control" name="cvc" id="cvc" [(ngModel)]="model.card.cvc" required>
    </div>
    <button type="submit" class="btn btn-success" [disabled]="!regForm.form.valid">Pay ${{model.ticket.price / 100}}</button>
  </form>
</div>
```

{% endraw %}

I know it seems like a lot, but there is a lot of repetition here. The first section lists three tickets that a user can buy to register for the "SuperDuperConf". The second section is just a form that collects the information needed to register an attendee for the conference.

The important thing to take note of here is the `[(ngModel)]="model.some.thing"` lines of code. That weird sequence of characters around `ngModel` is just parentheses inside of square brackets. The parentheses tell Angular that there is an action associated with this field. You see this a lot for click event handlers. It usually looks something like `(click)="someEventHandler()"`. It is the same, in that the `ngModel` is the handler of the event when the model changes.

The square brackets are used for updating the DOM when something on the model changes. It is usually seen in something like disabling a button as you did above with `[disabled]="!regForm.form.valid"`. It watches the value on the form, and when it is not valid, the button is disabled. Once the form values become valid, the disabled property is removed from the DOM element.

Now that you have all the fields on the page, you will want to style that ticket section up a bit so that it looks like tickets.

```css
.ticket {
  text-align: center;
  display: inline-block;
  width: 31%;
  border-radius: 1rem;
  color: #fff;
  padding: 1rem;
  margin: 1rem;
}

.ticket.conf-only,
.ticket.work-only {
  background-color: #333;
}

.ticket.full {
  background-color: #060;
}

.ticket span {
  display: block;
}

.ticket .title {
  font-size: 2rem;
}

.ticket .price {
  font-size: 2.5rem;
}

.ticket .value {
  font-style: italic;
}

.ticket button {
  border-radius: 0.5rem;
  text-align: center;
  font-weight: bold;
  color: #333;
  margin: 1rem;
}
```

These are just three basic ticket types I regularly see for conference registrations.

Now the meat of the registration page, the TypeScript component. You will need a few things to make the page work. You will need a model to store the values that the user enters, a way for the user to _select_ a ticket, and a way for the user to _pay_ for the ticket they have selected.

```ts
import { Component, ChangeDetectorRef, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  public model: any;
  public card: any;

  public errorMessage: string;
  public successMessage: string;

  constructor(
    private http: HttpClient,
    private changeDetector: ChangeDetectorRef,
    @Inject('BASE_URL') private baseUrl: string
  ) {
    this.resetModel();
    this.successMessage = this.errorMessage = null;
  }

  resetModel(): any {
    this.model = {
      firstName: '',
      lastName: '',
      emailAddress: '',
      password: '',
      token: '',
      ticket: { ticketType: '', price: 0 }
    };
    this.card = { number: '', exp_month: '', exp_year: '', cvc: '' };
  }

  selectTicket(ticketType: string, price: number) {
    this.model.ticket = { ticketType, price: price * 100 };
  }

  purchaseTicket() {
    (<any>window).Stripe.card.createToken(
      this.card,
      (status: number, response: any) => {
        if (status === 200) {
          this.model.token = response.id;
          this.http
            .post(this.baseUrl + 'api/registration', this.model)
            .subscribe(
              result => {
                this.resetModel();
                this.successMessage = 'Thank you for purchasing a ticket!';
                console.log(this.successMessage);
                this.changeDetector.detectChanges();
              },
              error => {
                this.errorMessage = 'There was a problem registering you.';
                console.error(error);
              }
            );
        } else {
          this.errorMessage = 'There was a problem purchasing the ticket.';
          console.error(response.error.message);
        }
      }
    );
  }
}
```

Even if you're familiar with Angular, some of this may look foreign. For instance, the `BASE_URL` value that is getting injected into the component. It comes from the `main.ts` file that the Angular CLI generated. If you look at that file, right below the imports, there is a function called `getBaseUrl()` and below that is a `providers` section that provides the value from the `getBaseUrl()` function, which is just a simple way to inject constant values into components.

The other thing that might look strange is the `purchaseTicket()` function. If you've never used Stripe before, the `createToken()` method creates a single-use token that you can pass to your server to use in your server-side calls, that way you don't have to send credit card information to your server, and you can let Stripe handle the security of taking online payments!

## Add the ASP.NET Registration Controller

Now that your Angular app can get a token from Stripe, you'll want to send that token and the user's information to the server to charge their card for the ticket. Create a controller in the `Controllers` folder in the server-side application root. The contents of the file should be:

```cs
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Okta.Sdk;
using Stripe;
using ticket_sales_example.Models;

namespace ticket_sales_example.Controllers
{
  [Produces("application/json")]
  [Route("api/[controller]")]
  public class RegistrationController : ControllerBase
  {
    [HttpPost]
    public async Task<ActionResult<Registration>> CreateAsync([FromBody] Registration registration)
    {
      ChargeCard(registration);
      var oktaUser = await RegisterUserAsync(registration);
      registration.UserId = oktaUser.Id;
      return Ok(registration);
    }

    private async Task<User> RegisterUserAsync(Registration registration)
    {
      var client = new OktaClient();
      var user = await client.Users.CreateUserAsync(
        new CreateUserWithPasswordOptions
        {
          Profile = new UserProfile
          {
            FirstName = registration.FirstName,
            LastName = registration.LastName,
            Email = registration.EmailAddress,
            Login = registration.EmailAddress,
          },
          Password = registration.Password,
          Activate = true
        }
      );

      var groupName = "";
      if (registration.Ticket.TicketType == "Full Conference + Workshop")
      {
        groupName = "FullAttendees";
      }
      if (registration.Ticket.TicketType == "Conference Only")
      {
        groupName = "ConferenceOnlyAttendees";
      }
      if (registration.Ticket.TicketType == "Workshop Only")
      {
        groupName = "WorkshopOnlyAttendees";
      }

      var group = await client.Groups.FirstOrDefault(g => g.Profile.Name == groupName);
      if (group != null && user != null)
      {
        await client.Groups.AddUserToGroupAsync(group.Id, user.Id);
      }



      return user as User;
    }

    private StripeCharge ChargeCard(Registration registration)
    {
      StripeConfiguration.SetApiKey("sk_test_uukFqjqsYGxoHaRTOS6R7nFI");

      var options = new StripeChargeCreateOptions
      {
        Amount = registration.Ticket.Price,
        Currency = "usd",
        Description = registration.Ticket.TicketType,
        SourceTokenOrExistingSourceId = registration.Token,
        StatementDescriptor = "SuperDuperConf Ticket"
      };

      var service = new StripeChargeService();
      return service.Create(options);
    }
  }
}
```

It seems like there is a bit here, but there is only the `HttpPost` method `CreateAsync()` that is the API endpoint for a `POST` to `/api/registration`. The other methods are helpers to the endpoint.

The `ChargeCard()` method does just as the name implies, it charges the user's credit card using the token that the Angular app got from Stripe and sent to the API. Even though I am setting the Stripe API key with a simple string here for demonstration purposes, you might want to store the key in an environment variable, in a configuration file that doesn't get checked into source control, or in a key management service like Azure's Key Vault. This will mitigate the chances that you will accidentally check the test key into your source control and have that end up being deployed to production!

The `RegisterUserAsync()` method handles registering a user with Okta and putting them into a group that corresponds to the ticket that the user is purchasing. This is done in two steps: by creating the user, then finding the group that corresponds with the ticket purchased, and adding that group's ID to the newly created Okta user.

## Set Up Okta for Your Angular and ASP.NET Core Applications

Dealing with user authentication in web apps is a massive pain for every developer. This is where Okta shines: it helps you secure your web applications with minimal effort.

### Why Okta?

At Okta, our goal is to make [identity management](https://developer.okta.com/product/user-management/) a lot easier, more secure, and more scalable than what you're used to. Okta is a cloud service that allows developers to create, edit, and securely store user accounts and user account data, and connect them with one or multiple applications. Our API enables you to:

- [Authenticate](https://developer.okta.com/product/authentication/) and [authorize](https://developer.okta.com/product/authorization/) your users
- Store data about your users
- Perform password-based and [social login](https://developer.okta.com/authentication-guide/social-login/)
- Secure your application with [multi-factor authentication](https://developer.okta.com/use_cases/mfa/)
- And much more! Check out our [product documentation](https://developer.okta.com/documentation/)

### Create an Okta Application

To get started, you'll need to create an OpenID Connect application in Okta. Sign up for a forever-free developer account (or log in if you already have one).

{% img blog/ticket-sales-app/OktaSignUp.png alt:"Okta's sign up page." width:"800" %}{: .center-image }

Once you've logged in and landed on the dashboard page, copy down the Org URL pictured below. You will need this later.

{% img blog/ticket-sales-app/OktaOrgUrl.png alt:"Okta developer dashboard highlighting the org URL." width:"800" %}{: .center-image }

Then create a new application by browsing to the **Applications** tab and clicking **Add Application**, and from the first page of the wizard choose **Single-Page App**.

{% img blog/ticket-sales-app/CreateSpaAppScreenshot.png alt:"Create application wizard with Single Page App selected." width:"800" %}{: .center-image }

On the settings page, enter the following values:

- Name: TicketSalesApp
- Base URIs: http://localhost:5000
- Login redirect URIs: http://localhost:5000/implicit/callback

You can leave the other values unchanged, and click **Done**.

{% img blog/ticket-sales-app/application-settings.png alt:"The settings page for the application." width:"800" %}{: .center-image }

Now that your application has been created copy down the Client ID and Client secret values on the following page, you'll need them soon.

{% img blog/ticket-sales-app/OktaAppSecrets.png alt:"The new client ID and client secret." width:"800" %}{: .center-image }

Finally, create a new authentication token. This will allow your app to talk to Okta to retrieve user information, among other things. To do this, click the **API** tab at the top of the page followed by the **Create Token** button. Give your token a name, in this case, "Crud API" would be a good name, then click **Create Token**. Copy down this token value as you will need it soon.

{% img blog/ticket-sales-app/CrudApiToken.png alt:"Screen showing the API Token." width:"800" %}{: .center-image }

Even though you have a method for registering users, you'll need to create the groups for the tickets, set up your API to use Okta, and configure it to receive access tokens from users of the Angular app for authorization.

Start by creating a group for each of the three tickets you'll be selling. From the Okta dashboard hover over the **Users** menu item until the drop-down appears and choose **Groups**. From the Groups page, click the **Add Group** button.

{% img blog/ticket-sales-app/groups-listing.png alt:"List of groups" width:"800" %}{: .center-image }

In the Add Group modal that pops up, add a group for each ticket type.

{% img blog/ticket-sales-app/add-group.png alt:"Add group" width:"800" %}{: .center-image }

Now, you'll need to add these newly created groups to the ticket sales application. Click on the **Applications** menu item, and choose the **TicketSalesApp** from the list of apps. It should open on the **Assignments** tab. Click on the **Assign** button and choose **Assign to Groups** from the button's drop-down menu. From here, assign each group you just created to the Ticket Sales app.

{% img blog/ticket-sales-app/assign-groups.png alt:"Assign group" width:"800" %}{: .center-image }

### Add Groups to the ID Token

Now you just need to add these groups to the token.

- Hover over the **API** menu item and select **Authorization Servers**.
- Select the default authorization server (it was created for you when you created your Okta account).
- Choose the Claims tab, and click **Add Claim**.
- The name of the claim will be "groups",
  Select **ID Token** and **Always** from the **Include in token type** setting.
- Choose **Groups** from the **Value Type** setting, and **Regex** from the **Filter** setting.
- In the text box type `.*`.
- Finally, make sure the **Disable claim** checkbox is unchecked and that the **Any scope** radio button is selected in the **Include in** setting.

{% img blog/ticket-sales-app/AddGroupsToTokenScreenshot.png alt:"Add Groups to Token Screen" width:"600" %}{: .center-image }

## Add Okta to Your Angular Application

To set up your Angular application to use Okta for authentication, you'll need to install the Angular SDK and the `rxjs` compatibility package.

```sh
npm install @okta/okta-angular rxjs-compat@6 --save
```

Add the components to your `app.module.ts` file in `src/app` by first importing them:

```ts
import {
  OktaCallbackComponent,
  OktaAuthModule,
  OktaAuthGuard
} from '@okta/okta-angular';
```

Now add a configuration variable right below the import statements:

```ts
const config = {
  issuer: 'https://{yourOktaDomain}/oauth2/default',
  redirectUri: 'http://localhost:5000/implicit/callback',
  clientId: '{clientId}'
};
```

Add the callback route to the routes in the `imports` section of the `@NgModule` declaration:

```
{ path: 'implicit/callback', component: OktaCallbackComponent }
```

That's all for now in the Angular application. Now let's get the ASP.NET Core app set up.

## Add Okta to Your ASP.NET Core API

Now you need to let the API know two things: how to get the user's identity from an access token (when one is sent) and how to call Okta for user management.

Start by adding the Okta Nuget package:

```sh
dotnet add package Okta.Sdk
```

For the ASP.NET Core application, the best thing to do is set up a file in your home folder to store the configuration. Okta's SDK will pick the settings up for you, and you'll never accidentally check them into source control!

In your home directory, create a .okta folder and add a file called okta.yaml. Your home folder will depend on your operating system. For \*nix variants like Linux or macOS it is:

```sh
~/.okta/okta.yaml
```

for Windows environments it is:

```sh
%userprofile%\.okta\okta.yaml
```

YAML is just a file format for configuration. The okta.yaml file looks like:

```yaml
okta:
  client:
    orgUrl: "https://{yourOktaDomain}"
    token: "{yourApiToken}"
```

In the ConfigureServices() method before the services.AddMvc() line, add:

```cs
services.AddAuthentication(sharedOptions =>
{
  sharedOptions.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  sharedOptions.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
  options.Authority = "https://{yourOktaDomain}/oauth2/default";
  options.Audience = "api://default";
});
```

And in the Configure() method before the app.UseMvc() line add:

```cs
app.UseAuthentication();
```

That's it! Now your ASP.NET Core app will take that bearer token, get the user's information from Okta add them to the User object so you can get the currently requesting user's data. It will also use the API token stored in the `okta.yaml` file when registering users.

## Show the Tickets in Your Angular App

Now that users can purchase a ticket, you'll want them to be able to log in and see their purchased ticket. To do this, generate a profile component using Angular's CLI. From the `src/app` folder of the client app, run:

```sh
ng g c profile
```

Again, this is just shorthand for `ng generate component profile`, which will generate all the base files for the profile component. The `profile.component.ts` file should have the following contents:

```ts
import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import 'rxjs/Rx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  ticket: string;

  constructor(private oktaAuth: OktaAuthService) {}

  async ngOnInit() {
    this.user = await this.oktaAuth.getUser();
    if (this.user.groups.includes('FullAttendees')) {
      this.ticket = 'Full Conference + Workshop';
    } else if (this.user.groups.includes('ConferenceOnlyAttendees')) {
      this.ticket = 'Conference Only';
    } else if (this.user.groups.includes('WorkshopOnlyAttendees')) {
      this.ticket = 'Workshop Only';
    } else {
      this.ticket = 'None';
    }
  }
}
```

This does two things: it gets the currently logged in user and translates the group name into a displayable string representation of the ticket type purchased. The `profile.component.html` file is straightforward:

{% raw %}

```ts
<h1>{{user.name}}</h1>

<p>
  Your Puchased Ticket: {{ticket}}
</p>
```

{% endraw %}

The last thing to do is to add a protected route to the profile page in the `app.module.ts`. I added mine right above the callback route:

```ts
{
  path: 'profile',
  component: ProfileComponent,
  canActivate: [OktaAuthGuard]
},
```

You can now sell tickets, and the users can log in and see which ticket they have once they've purchased one. You're ready to hold your event!

## Learn More about ASP.NET

Check out our other Angular and .NET posts on the Okta developer blog:

- Ibrahim creates a [CRUD app with an ASP.NET Framework 4.x API in his post](/blog/2018/07/27/build-crud-app-in-aspnet-framework-webapi-and-angular)
- Build a basic [CRUD app using Angular and ASP.NET Core](/blog/2018/07/02/build-a-secure-crud-app-with-aspnetcore-and-react)
- If you would like to use [React instead of Angular for your CRUD app, I've got you covered](/blog/2018/08/02/aspnet-core-angular-crud)
- Get nitty-gritty on [token authentication in ASP.NET Core](/blog/2018/03/23/token-authentication-aspnetcore-complete-guide)
- Get your project out into the world by [deploying it to Azure, the right way](/blog/2018/06/19/deploy-your-aspnet-core-app-to-azure)

As always, if you have any comments or questions, feel free to leave a comment below. Don't forget to follow us on Twitter [@oktadev](https://twitter.com/oktadev) and [on Facebook](https://www.facebook.com/oktadevelopers)!
