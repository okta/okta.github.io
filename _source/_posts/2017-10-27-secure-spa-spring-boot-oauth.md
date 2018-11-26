---
layout: blog_post
title: 'Secure your SPA with Spring Boot and OAuth'
author: bdemers
tags: [oauth, oauth2, oauth2.0, oauth 2.0, spring, spring boot, spring security]
---

If you have a JavaScript single-page application (SPA) that needs to securely access resources from a Spring Boot application, you likely want to use the OAuth 2.0 implicit flow! With this flow your client will send a bearer token with each request and your server side application will verify the token with an Identity Provider (IdP). This allows your resource server to trust that your client is authorized to make the request. In OAuth terms your SPA is the client and your Spring Boot application is the Resource Server. For a more detailed explanation on the various OAuth flows take a look at our [What the Heck is OAuth](/blog/2017/06/21/what-the-heck-is-oauth) post.

Today you are going to build two small applications that demonstrate these principles in action: a simple SPA client app with a little bit of JQuery and a backend service with Spring Boot. You'll start out by using the standard Spring OAuth bits and then switch to the Okta Spring Boot Starter and check out its added features. Obviously (this is the Okta developer blog), you'll be using Okta for your IdP, but the first sections will be vendor agnostic.

## Create a Spring Boot Application

**Update:** You must use Spring Boot version 1.5.x.

If you haven't tried out [start.spring.io](https://start.spring.io) go check it out right now... with a couple of clicks it will get you a basic, runnable Spring Boot Application.

```bash
curl https://start.spring.io/starter.tgz \
 -d artifactId=oauth-implicit-example  \
 -d dependencies=security,web \
 -d language=java \
 -d type=maven-project \
 -d baseDir=oauth-implicit-example \
 -d bootVersion=1.5.8.RELEASE \
 | tar -xzvf -
```

If you want to download the project from your browser go to: [start.spring.io](https://start.spring.io/#!artifactId=oauth-implicit-example) search for and select the 'security' dependencies then click the big green "Generate Project" button.

Once you have your project unzipped you should be able to start it up on the command line: with `./mvnw spring-boot:run`. This application won't do anything yet, but this is a good 'so far so good' check. Kill the process with `^C` and let's start actually writing code!

### Write Some Code!

Well, almost. First, add the Spring OAuth 2.0 dependency to your `pom.xml`
```xml
<dependency>
   <groupId>org.springframework.security.oauth</groupId>
   <artifactId>spring-security-oauth2</artifactId>
   <version>2.2.0.RELEASE</version>
</dependency>
```

Open up `DemoApplication.java`, if you are following along (and you are right?) then this should located in `src/main/java/com/example/oauthimplicitexample`. It shouldn't be hard to find, the project only contains two Java classes and one of them is a test.

Annotate the class with `@EnableResourceServer`, this will tell Spring Security to add the necessary Filters and logic to handle the OAuth implicit requests.

Next, add a Controller:
```java
@RestController
public class MessageOfTheDayController {
   @GetMapping("/mod")
   public String getMessageOfTheDay(Principal principal) {
       return "The message of the day is boring for user: " + principal.getName();
   }
}
```

That is it! It's basically hello world with an extra annotation. Start your app back up with `./mvnw spring-boot:run`. You should be able to hit `http://localhost:8080/mod`:

```bash
curl -v http://localhost:8080/mod

HTTP/1.1 401
Content-Type: application/json;charset=UTF-8
WWW-Authenticate: Bearer realm="oauth2-resource", error="unauthorized", error_description="Full authentication is required to access this resource"

{
   "error": "unauthorized",
   "error_description": "Full authentication is required to access this resource"
}
```

A `401`? Yup, secure by default! Plus, we haven't actually supplied any of the configuration detail for our OAuth IdP. Stop the server with `^C` and move to the next section.

## Get Your OAuth Info Ready

As I mentioned above, you'll be using Okta going forward. You can go sign up for a free (forever) account over at [https://developer.okta.com/](https://developer.okta.com/). Just click the sign up button and fill out the form. When that's done you'll have two things, your Okta organization URL (e.g. `https://{yourOktaDomain}`), and an email with instructions on how to activate your account.

Activate your account, and while you're still in the Okta Developer Console you have one last step: create an Okta SPA application. On the top menu bar click on **Applications** then click **Add Application**. Select **SPA** and click **Next**.

Fill out the form with the following values:

- Name: OAuth Implicit Tutorial
- Base URIs: http://localhost:8080/
- Login redirect URIs: http://localhost:8080/

Leave everything else as the defaults and click **Done**. At the bottom of the next page is your `Client ID` which you'll need in the next step.
### Configure OAuth for Spring

The generated sample application uses an `application.properties` file. I prefer YAML so I'm going to rename the file to `application.yml`.

An application resource server only needs to know how to validate an access token. Since the format of the access token is not defined by the OAuth 2.0 or OIDC specs, the tokens are validated remotely.

```yml
security:
 oauth2:
   resource:
     userInfoUri: https://{yourOktaDomain}/oauth2/default/v1/userinfo
```

At this point you could start up your application and start validating access tokens! But of course you would need an access token to validate...

## Create a Login Page

To keep things simple you're going to reuse your existing Spring Boot application to host your SPA. Typically these assets could be hosted somewhere else: a different application, a CDN, etc. It just seems like overkill to host a lonely index.html file in a different application for the purposes of this tutorial.

Create a new file `src/main/resources/static/index.html` and populate it with the following:
```html
<!doctype html>

<html lang="en">
<head>
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
   <meta name="description" content="">
   <meta name="author" content="">
   <title>Okta Implicit Spring-Boot</title>
   <base href="/">
   <script src="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/2.3.0/js/okta-sign-in.min.js" type="text/javascript"></script>
   <link href="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/2.3.0/css/okta-sign-in.min.css" type="text/css" rel="stylesheet">
   <link href="https://ok1static.oktacdn.com/assets/js/sdk/okta-signin-widget/2.3.0/css/okta-theme.css" type="text/css" rel="stylesheet">
   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
   <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
</head>
<body>
<!-- Render the login widget here -->
<div id="okta-login-container"></div>
<!-- Render the REST response here -->
<div id="cool-stuff-here"></div>
<!-- And a logout button, hidden by default -->
<button id="logout" type="button" class="btn btn-danger" style="display:none">Logout</button>
<script>

 $.ajax({
   url: "/sign-in-widget-config",
 }).then(function(data) {

   // we are priming our config object with data retrieved from the server in order to make this example easier to run
   // You could statically define your config like if you wanted too:
   /*
   const data = {
     baseUrl: 'https://{yourOktaDomain}',
     clientId: '00icu81200icu812w0h7',
     redirectUri: 'http://localhost:8080',
     authParams: {
       issuer: 'https://{yourOktaDomain}/oauth2/default',
       responseType: ['id_token', 'token']
     }
   }; */

   // we want the access token so include 'token'
   data.authParams.responseType = ['id_token', 'token'];
   data.authParams.scopes = ['openid', 'email', 'profile'];
   data.redirectUri = window.location.href; // simple single page app
   // setup the widget
   window.oktaSignIn = new OktaSignIn(data);

   // handle the rest of the page
   doInit();
 });

 /**
  * Makes a request to a REST resource and displays a simple message to the page.
  * @param accessToken The access token used for the auth header
  */
 function doAllTheThings(accessToken) {

   // include the Bearer token in the request
   $.ajax({
     url: "/mod",
     headers: {
       'Authorization': "Bearer " + accessToken
     },
   }).then(function(data) {
     // Render the message of the day
     $('#cool-stuff-here').append("<strong>Message of the Day:</strong>&nbsp;"+ data);
   })
   .fail(function(data) {
     // handle any errors
     console.error("ERROR!!");
     console.log(data.responseJSON.error);
     console.log(data.responseJSON.error_description);
   });

   // show the logout button
   $( "#logout" )[0].style.display = 'block';
 }

 function doInit() {

   $( "#logout" ).click(function() {
     oktaSignIn.signOut(() => {
       oktaSignIn.tokenManager.clear();
       location.reload();
     });
   });

   // Check if we already have an access token
   const token = oktaSignIn.tokenManager.get('my_access_token');

   // if we do great, just go with it!
   if (token) {
     doAllTheThings(token.accessToken)
   } else {

     // otherwise show the login widget
     oktaSignIn.renderEl(
       {el: '#okta-login-container'},
       function (response) {

         // check if success
         if (response.status === 'SUCCESS') {

           // for our example we have the id token and the access token
           oktaSignIn.tokenManager.add('my_id_token', response[0]);
           oktaSignIn.tokenManager.add('my_access_token', response[1]);

           // hide the widget
           oktaSignIn.hide();

           // now for the fun part!
           doAllTheThings(response[1].accessToken);
         }
       },
       function (err) {
         // handle any errors
         console.log(err);
       }
     );
   }
 }

</script>
</body>
</html>
```

This page does a few things:
- Displays the Okta Sign-In Widget and gets an access token
- Calls the `/sign-in-widget-config` controller to configure said widget (we are pretending this file is served by another service)
- Once a user is logged in, the page calls the `/mod` controller (with the access token)  and displays the result

To support our HTML we need to create a new `Controller` for the `/sign-in-widget-config` endpoint.

In the same package as your Spring Boot Application class create a new `SignInWidgetConfigController` class:

```java
@RestController
public class SignInWidgetConfigController {

   private final String issuerUrl;
   private final  String clientId;

   public SignInWidgetConfigController(@Value("#{@environment['okta.oauth2.clientId']}") String clientId,
                                       @Value("#{@environment['okta.oauth2.issuer']}")   String issuerUrl) {

       Assert.notNull(clientId,  "Property 'okta.oauth2.clientId' is required.");
       Assert.notNull(issuerUrl, "Property 'okta.oauth2.issuer' is required.");
       this.clientId = clientId;
       this.issuerUrl = issuerUrl;
   }

   @GetMapping("/sign-in-widget-config")
   public WidgetConfig getWidgetConfig() {
       return new WidgetConfig(issuerUrl, clientId);
   }

   public static class WidgetConfig {
       public String baseUrl;
       public String clientId;
       public Map<String, Object> authParams = new LinkedHashMap<>();

       WidgetConfig(String issuer, String clientId) {
           this.clientId = clientId;
           this.authParams.put("issuer", issuer);
           this.baseUrl = issuer.replaceAll("/oauth2/.*", "");
       }
   }
}
```

Add the corresponding configuration to your `application.yml` file:

```yml
okta:
 oauth2:
   # Client ID from above step
   clientId: {clientId}
   issuer: https://{yourOktaDomain}/oauth2/default
```

The last thing is to allow public access to the `index.html` page and `/sign-in-widget-config`

Define a `ResourceServerConfigurerAdapter` Bean in your Application to allow access to those resources.

```java
@Bean
protected ResourceServerConfigurerAdapter resourceServerConfigurerAdapter() {
   return new ResourceServerConfigurerAdapter() {
       @Override
       public void configure(HttpSecurity http) throws Exception {
           http.authorizeRequests()
                   .antMatchers("/", "/index.html", "/sign-in-widget-config").permitAll()
                   .anyRequest().authenticated();
       }
   };
}
```

### Fire it up!

Start up your application again with `./mvnw spring-boot:run`, and browse to `http://localhost:8080/`. You should be able to log in with your new Okta account and view the message of the day.

## Try the Okta Spring Boot Starter

Up until now (with the exception of the login page) you have been using using the out of the box Spring Security OAuth 2.0 support. This just works because: standards! There are a few issues with this approach:
- Each request to our application requires an unnecessary round trip back to the OAuth IdP
- We don't know which scopes were used when the access token was created
- The user's groups/roles are not available in this context

These may or may not be issues for your application, but resolving them is as simple as adding another dependency to your pom file:

```xml
<dependency>
   <groupId>com.okta.spring</groupId>
   <artifactId>okta-spring-boot-starter</artifactId>
   <version>0.2.0</version>
</dependency>
```

You can even trim down your `application.yml` file if you want to, any of the `security.*` properties will take precedence over the `okta.*` ones:

```yaml
okta:
 oauth2:
   clientId: {clientId}
   issuer: https://{yourOktaDomain}/oauth2/default
```

Restart your application and the first two concerns have been taken care of!

The last one requires an extra step, you will have to add extra data to Okta's access token. We have a [whole post on this topic](/blog/2017/10/13/okta-groups-spring-security), but the cliff notes are as follows:

Head back over to the Okta Developer Console, on the menu bar click **API** > **Authorization Server**. In this example we have been using the 'default' authorization server, so click edit, then select the 'Claims' tab. Click 'Add Claim' and fill out the form with the following values:

- Name: groups
- Include in token type: Access Token
- Value type: Groups
- Filter: Regex - `.*`

Leave the rest as the defaults, and click 'Create'.

The `okta-spring-boot-starter` automatically maps the values in the `groups` claim to Spring Security Authorities; in standard Spring Security fashion we can annotate our methods to configure access levels.

To enable use of the `@PreAuthorize` annotation you need to add the `@EnableGlobalMethodSecurity` to your Spring Boot Application.  If you want to validate the OAuth scopes as well, you will need to add a `OAuth2MethodSecurityExpressionHandler`. Just drop the following snippet in your Spring Boot Application.

```java
@EnableGlobalMethodSecurity(prePostEnabled = true)
protected static class GlobalSecurityConfiguration extends GlobalMethodSecurityConfiguration {
   @Override
   protected MethodSecurityExpressionHandler createExpressionHandler() {
       return new OAuth2MethodSecurityExpressionHandler();
   }
}
```

Finally, update `MessageOfTheDayController` with a `@PreAuthorize` (in this case you are allowing members of the group 'Everyone' or anyone with the 'email' scope).
```java
@RestController
public class MessageOfTheDayController {
   @GetMapping("/mod")
   @PreAuthorize("hasAuthority('Everyone') || #oauth2.hasScope('email')")
   public String getMessageOfTheDay(Principal principal) {
       return "The message of the day is boring for user: " + principal.getName();
   }
}
```

## Learn More!

In this post, we created a standard Spring Boot + Spring Security OAuth 2.0 application that uses an OAuth implicit flow, then spiced it up with the `okta-spring-boot-starter` which added (without any code) support for: client side access token validation, OAuth scope support, and Okta group to authority mapping. Next time, I'll create a sample app which uses an OAuth code-flow.

Want to learn more about OAuth?
- [What the Heck is OAuth](/blog/2017/06/21/what-the-heck-is-oauth)
- [An OpenID Connect Primer](/blog/2017/07/25/oidc-primer-part-1)
- [OAuth.net](https://www.oauth.com/)

Questions? Comments? Cool stories about OAuth? Hit me up on Twitter [@briandemers](https://twitter.com/briandemers) and make sure to follow my team [@oktadev](https://twitter.com/oktadev).
