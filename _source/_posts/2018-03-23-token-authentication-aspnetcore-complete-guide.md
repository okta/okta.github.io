---
layout: blog_post
title: "Token Authentication in ASP.NET Core 2.0 - A Complete Guide"
author: nbarbettini
description: "Everything you ever wanted to know about token authentication in ASP.NET Core 2.0 and beyond."
tags: [asp.net, aspnetcore, dotnet, webapi, security, oauth, oidc]
tweets:
 - "Confused about token authentication in #aspnetcore? @nbarbettini breaks it down step by step →"
 - "A comprehensive guide to understanding token authentication in #aspnetcore →"
redirect_from:
 - "/blog/2018/03/27/token-authentication-aspnetcore-complete-guide"
---

Token authentication has been a popular topic for the past few years, especially as mobile and JavaScript apps have continued to gain mindshare. Widespread adoption of token-based standards like [OAuth 2.0 and OpenID Connect][wthk-oauth] have introduced even more developers to tokens, but the best practices aren't always clear.

I spend a lot of time in the ASP.NET Core world and have been working with the framework since the pre-1.0 days. ASP.NET Core 2.0 has great support for consuming and validating tokens, thanks to built-in JWT validation middleware. However, many people were surprised about the removal of the token generation code from ASP.NET 4. In the early days of ASP.NET Core, the full token authentication story was a confusing jumble.

Now that ASP.NET Core 2.0 (soon 2.1) is stable, things have settled down. In this post, I'll examine the best practices for both sides of the token authentication story: token validation and token generation.

## What is Token Authentication?
Token authentication is the process of attaching a token (sometimes called an _access token_ or a _bearer token_) to HTTP requests in order to authenticate them. It's commonly used with APIs that serve mobile or SPA (JavaScript) clients.

Each request that arrives at the API is inspected. If a valid token is found, the request is allowed. If no token is found, or the token is invalid, the request is rejected with a `401 Unauthorized` response.

Token authentication is usually used in the context of OAuth 2.0 or OpenID Connect. If you want to brush up on how those protocols work, read our [primer on OpenID Connect][oidc-primer], or watch my talk [OAuth and OpenID Connect in plain English][nate-oidc-talk] on YouTube!

## Validate Tokens in ASP.NET Core
Adding token authentication to your API in ASP.NET Core is easy thanks to the `JwtBearerAuthentication` middleware included in the framework. If you're consuming tokens created by a standard OpenID Connect server, the configuration is super easy.

In your `Startup` class, add the middleware anywhere in your `ConfigureServices` method, and configure it with the values from your authorization server:

```csharp
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.Authority = "{yourAuthorizationServerAddress}";
    options.Audience = "{yourAudience}";
});
```

Then, in your `Configure` method, add this line just above `UseMvc`:

```csharp
app.UseAuthentication();
```

This second step of adding `UseAuthentication()` is easy to forget! I've done it a few times. If your authenticated calls aren't working properly, make sure you've added this line in the right place (above `UseMvc`).

The `JwtBearer` middleware looks for tokens (JSON Web Tokens or JWTs) in the HTTP Authorization header of incoming requests. If a valid token is found, the request is authorized. You then add the `[Authorize]` attribute on your controllers or routes you want protected:

```csharp
[Route("/api/protected")
[Authorize]
public string Protected()
{
    return "Only if you have a valid token!";
}
```

You might be wondering: with only the authority and audience specified, how does the `JwtBearer` middleware validate incoming tokens?

### Automatic Authorization Server Metadata

When the `JwtBearer` middleware handles a request for the first time, it tries to retrieve some metadata from the authorization server (also called an authority or issuer). This metadata, or _discovery document_ in OpenID Connect terminology, contains the public keys and other details needed to validate tokens. (Curious what the metadata looks like? Here's an [example discovery document](https://nate-example.oktapreview.com/oauth2/default/.well-known/openid-configuration).)

If the `JwtBearer` middleware finds this metadata document, it configures itself automatically. Pretty nifty!

If the document doesn't exist, you'll get an error:

```
System.IO.IOException: IDX10804: Unable to retrieve document from: "{yourAuthorizationServerAddress}".
System.Net.Http.HttpRequestException: Response status code does not indicate success: 404 (Not Found).
```

If your authorization server doesn't publish this metadata, or you just want to specify the token validation parameters yourself, you can add them to the middleware configuration manually.
### Specify Token Validation Parameters
The full set of `JwtBearer` options can be used if you want fine-grained control over how your tokens are validated:

```csharp
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        // Clock skew compensates for server time drift.
        // We recommend 5 minutes or less:
        ClockSkew = TimeSpan.FromMinutes(5),
        // Specify the key used to sign the token:
        IssuerSigningKey = signingKey,
        RequireSignedTokens = true,
        // Ensure the token hasn't expired:
        RequireExpirationTime = true,
        ValidateLifetime = true,
        // Ensure the token audience matches our audience value (default true):
        ValidateAudience = true,
        ValidAudience = "api://default",
        // Ensure the token was issued by a trusted authorization server (default true):
        ValidateIssuer = true,
        ValidIssuer = "https://{yourOktaDomain}/oauth2/default"
    };
});
```

The most common options to set in `TokenValidationParameters` are issuer, audience, and clock skew. You'll also need to provide the key(s) your tokens will be signed with, which will look different depending on whether you're using a symmetric or asymmetric key.

## Understand Symmetric and Asymmetric Signing
Tokens generated by your authorization server will be signed with either a symmetric key (HS256) or an asymmetric key (RS256). If your authorization server publishes a discovery document, it will include the key information so you don't have to worry about how this works.

However, if you're configuring the middleware yourself or are validating tokens manually, you'll have to understand how your tokens are signed. What's the difference between symmetric and asymmetric keys?

### Symmetric Keys
A symmetric key, also called a shared key or shared secret, is a secret value (like a password) that is kept on both the API (your application) and the authorization server that's issuing tokens. The authorization server signs the token payload with the shared key, and the API validates that incoming tokens are properly signed using the same key.

If you have a shared symmetric key, it's easy to use it with the `JwtBearer` middleware:

```csharp
// For example only! Don't store your shared keys as strings in code.
// Use environment variables or the .NET Secret Manager instead.
var sharedKey = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes("mysupers3cr3tsharedkey!"));

services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        // Specify the key used to sign the token:
        IssuerSigningKey = sharedKey,
        RequireSignedTokens = true,
        // Other options...
    };
});
```

Make sure you keep the key safe! Storing it in your code (like the above example) is a bad idea since it's easy to accidentally check it into source control. Instead, store it in environment variables on your server, or use the [.NET Secret Manager](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets). The [ASP.NET Core configuration model](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/) makes it easy to load the value from the environment or user secrets:

```csharp
var sharedKey = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes(Configuration["SigningKey"]);
```

Likewise, don't store your shared key in your frontend code or expose it to the browser. It must be kept protected on your server.

### Asymmetric Keys
With asymmetric signing, you don't need to keep a secret key on your server. Instead, a public/private keypair is used: the authorization server signs tokens with a secret private key, and publishes a public key that anyone can use to validate tokens.

Usually, the public key information is automatically retrieved from the discovery document as described in the section above. If you need to specify it manually, you'll need to get the key parameters from the authorization server and create a `SecurityKey` object:

```csharp
// Manually specify a public (asymmetric) key published as a JWK:
var publicJwk = new JsonWebKey
{
    KeyId = "(some key ID)",
    Alg = "RS256",
    E = "AQAB",
    N = "(a long string)",
    Kty = "RSA",
    Use = "sig"
};
```

In most cases, the public keys are available in a JSON Web Key Set (JWKS) on the authorization server (here's an [example JWKS](https://nate-example.oktapreview.com/oauth2/default/v1/keys)). The authorization server may rotate the keys periodically, too, so you'll need to check for updated keys regularly. If you let the `JwtBearer` middleware auto-configure via the discovery document, this all works automatically!

## Validate Tokens Manually in ASP.NET Core
In some cases, you might need to validate tokens _without_ using the `JwtBearer` middleware. Using the middleware should always be the first choice, since it plugs nicely (and automatically) into the ASP.NET Core authorization system.

If you absolutely need to validate a JWT by hand, you can use the `JwtSecurityTokenHandler` in the [System.IdentityModel.Tokens.Jwt](https://www.nuget.org/packages/System.IdentityModel.Tokens.Jwt) package. It uses the same `TokenValidationParameters` class to specify the validation options:

```csharp
private static JwtSecurityToken ValidateAndDecode(string jwt, IEnumerable<SecurityKey> signingKeys)
{
    var validationParameters = new TokenValidationParameters
    {
        // Clock skew compensates for server time drift.
        // We recommend 5 minutes or less:
        ClockSkew = TimeSpan.FromMinutes(5),
        // Specify the key used to sign the token:
        IssuerSigningKeys = signingKeys,
        RequireSignedTokens = true,
        // Ensure the token hasn't expired:
        RequireExpirationTime = true,
        ValidateLifetime = true,
        // Ensure the token audience matches our audience value (default true):
        ValidateAudience = true,
        ValidAudience = "api://default",
        // Ensure the token was issued by a trusted authorization server (default true):
        ValidateIssuer = true,
        ValidIssuer = "https://{yourOktaDomain}/oauth2/default"
    };

    try
    {
        var claimsPrincipal = new JwtSecurityTokenHandler()
            .ValidateToken(jwt, validationParameters, out var rawValidatedToken);

        return (JwtSecurityToken)rawValidatedToken;
        // Or, you can return the ClaimsPrincipal
        // (which has the JWT properties automatically mapped to .NET claims)
    }
    catch (SecurityTokenValidationException stvex)
    {
        // The token failed validation!
        // TODO: Log it or display an error.
        throw new Exception($"Token failed validation: {stvex.Message}");
    }
    catch (ArgumentException argex)
    {
        // The token was not well-formed or was invalid for some other reason.
        // TODO: Log it or display an error.
        throw new Exception($"Token was invalid: {argex.Message}");
    }
}
```

If your authorization server publishes a metadata document, you can retrieve it with the `OpenIdConnectConfigurationRetriever` class in the [Microsoft.IdentityModel.Protocols.OpenIdConnect](https://www.nuget.org/packages/Microsoft.IdentityModel.Protocols.OpenIdConnect/) package. This will let you get signing keys automatically:

```csharp
var configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>(
    // .well-known/oauth-authorization-server or .well-known/openid-configuration
    "{yourAuthorizationServerAddress}/.well-known/openid-configuration",
    new OpenIdConnectConfigurationRetriever(),
    new HttpDocumentRetriever());

var discoveryDocument = await configurationManager.GetConfigurationAsync();
var signingKeys = discoveryDocument.SigningKeys;
```

That takes care of the _validation_ side of token authentication, but what about generating the tokens themselves?

## Generate Tokens for Authentication in ASP.NET Core
Back in the ASP.NET 4.5 days, the `UseOAuthAuthorizationServer` middleware gave you an endpoint that could easily generate tokens for your application. However, the ASP.NET Core team [decided not to bring it to ASP.NET Core](https://stackoverflow.com/a/29144031/3191599), which means that you'll need to plug something else in. Specifically, you'll need to either find or build an authorization server that can generate tokens.

The two common ways to get an authorization server are:

* Using a cloud service like Azure AD B2C or [Okta](/quickstart/#/widget/dotnet/aspnetcore)
* Building or configuring your own

### Hosted Authorization Server with Okta
A hosted authorization server is the easiest way to generate tokens, because you don't need to build (or maintain) anything yourself. You can sign up for a [free account](https://developer.okta.com/signup/) and then follow the [Okta + ASP.NET Core API quickstart](/quickstart/#/widget/dotnet/aspnetcore) for step-by-step instructions.

Since the authorization server Okta creates for you has a standard discovery document, the `JwtBearer` configuration is super simple:

```csharp
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.Authority = "https://{yourOktaDomain}/oauth2/default";
    options.Audience = "api://default";
});
```

If you want to roll your own authorization server, you can use one of the popular [community-built packages](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/community):

### OpenIddict
[OpenIddict](https://github.com/openiddict/openiddict-core) is an easy-to-configure authorization server that works nicely with [ASP.NET Core Identity](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity) and Entity Framework Core. It plugs right into the ASP.NET Core middleware pipeline and is easy to configure.

OpenIddict is a great choice if you're already using ASP.NET Core Identity and want to generate tokens for your users. You can follow Mike Rousos' in-depth [tutorial on the MSDN blog](https://blogs.msdn.microsoft.com/webdev/2016/10/27/bearer-token-authentication-in-asp-net-core/) to set it up and configure it in your application.

### ASOS
The [AspNet.Security.OpenIdConnect.Server](https://github.com/aspnet-contrib/AspNet.Security.OpenIdConnect.Server) package is lower-level than OpenIddict (in fact, OpenIddict uses it under the hood). It takes more work to set up, but it's useful when you want to have more direct control over how the OpenID Connect protocol is handled and how tokens are generated. 
Kévin Chalet has an in-depth [tutorial on creating an OpenID Connect server](http://kevinchalet.com/2016/07/13/creating-your-own-openid-connect-server-with-asos-introduction/) on his blog.

### IdentityServer4
Thinktecture's open-source [IdentityServer project](https://github.com/IdentityServer/IdentityServer4) has been around for a long time, and it got a major update for .NET Core with IdentityServer4. Of the three packages discussed here, it's the most powerful and flexible.

IdentityServer is a good choice when you want to roll your own full-fledged OpenID Connect authorization server that can handle complex use cases like federation and single sign-on. Depending on your use case, configuring IdentityServer4 can be a little complicated. Fortunately, the [official documentation](http://docs.identityserver.io/en/release/) covers many common scenarios.

## Token Authentication Can Be Complex!
I hope this article helps it feel a little less confusing. The ASP.NET Core team has done a great job of making it easy to add token authentication to your ASP.NET Core API, and options like OpenIddict and Okta make it easy to spin up an authorization server that generates tokens for your clients.

Here are some more resources if you want to keep learning:
* [How to Secure Your .NET Web API with Token Authentication](/blog/2018/02/01/secure-aspnetcore-webapi-token-auth) here on the Okta blog
* A [deep dive into the JWT bearer middleware](https://andrewlock.net/a-look-behind-the-jwt-bearer-authentication-middleware-in-asp-net-core/) on Andrew Lock's blog
* [What the Heck is OAuth?][wthk-oauth]
* Our [primer on OpenID Connect][oidc-primer]
* [OAuth and OpenID Connect in plain English][nate-oidc-talk] on YouTube, by yours truly

I'd love to hear your feedback! If you have questions or thoughts, post a comment below. You can also reach us on Twitter [@oktadev](https://twitter.com/oktadev).

[wthk-oauth]: /blog/2017/06/21/what-the-heck-is-oauth
[oidc-primer]: /blog/2017/07/25/oidc-primer-part-1
[nate-oidc-talk]: https://www.youtube.com/watch?v=996OiexHze0
