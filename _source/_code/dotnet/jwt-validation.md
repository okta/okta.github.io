---
layout: software
title: JWT Validation Guide
language: .NET
excerpt: How to manually validate Okta JWTs with .NET (C#).
support_email: developers@okta.com
---

# Overview

When you use the Okta API to [obtain an authorization grant for a user](/docs/api/resources/oauth2.html#obtain-an-authorization-grant-from-a-user), the response contains a signed JWT (`id_token` and/or `access_token`).

A common practice is to send one of these tokens in the `Bearer` header of future requests, to authorize the request for that user. Your server must then validate the token to make sure it's authentic and hasn't expired.

> Note: This guide is specific to the .NET environment.  If you need general information, please see [Working With OAuth 2.0 Tokens](/authentication-guide/tokens/).

## Who should use this guide

You **don't** need to validate tokens manually if:

* You are using <a href='/quickstart/#/widget/dotnet/aspnet4' data-proofer-ignore>ASP.NET</a> or <a href='/quickstart/#/widget/dotnet/aspnetcore' data-proofer-ignore>ASP.NET Core</a> with the `JwtBearer` or `OpenIdConnect` middleware
* You want to send tokens to Okta to be validated (this is called [token introspection](/docs/api/resources/oauth2.html#introspection-request))

If you need to validate a token manually, and don't want to make a network call to Okta, this guide will help you validate tokens locally.

## What you'll need

* Your authorization server URL
* A JWT (string)
* Libraries for retrieving the signing keys and validating the token

When you create a [new Okta developer org](https://www.okta.com/developer/signup), Okta creates an authorization server called `default`. The URL for this authorization server is `https://{yourOktaDomain}.com/oauth2/default`. You can always find the full authorization server URL (also called an Issuer URI) in the Okta developer console by opening the **API** menu and choosing **Authorization Servers**.

In this guide, you'll use the official Microsoft OpenID Connect and JWT libraries, but you can adapt it to your preferred key parser and JWT validation libraries as well.

## Get the signing keys

Okta signs JWTs using [asymmetric encryption (RS256)](https://stackoverflow.com/a/39239395/3191599), and publishes the public signing keys in a JWKS (JSON Web Key set) as part of the OAuth 2.0 and OpenID Connect discovery documents. The signing keys are rotated on a regular basis. The first step to verify a signed JWT is to retrieve the current signing keys.

The `OpenIdConnectConfigurationRetriever` class in the [Microsoft.IdentityModel.Protocols.OpenIdConnect](https://www.nuget.org/packages/Microsoft.IdentityModel.Protocols.OpenIdConnect/) package will download and parse the discovery document to get the key set. You can use it in conjunction with the `ConfigurationManager` class, which will handle caching the response and refreshing it regularly:

```csharp
// Replace with your authorization server URL:

var issuer = "https://{yourOktaDomain}.com/oauth2/default";

var configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>(
    issuer + "/.well-known/oauth-authorization-server",
    new OpenIdConnectConfigurationRetriever(),
    new HttpDocumentRetriever());
```

Once you've instantiated the `configurationManager`, keep it around as a singleton. You only need to set it up once.

## Validate a token

The `JwtSecurityTokenHandler` class in the [System.IdentityModel.Tokens.Jwt](https://www.nuget.org/packages/System.IdentityModel.Tokens.Jwt) package will handle the low-level details of validating a JWT.

You can write a method that takes the token, the issuer, and the `configurationManager` you created. The method is `async` because the `configurationManager` may need to make an HTTP call to get the signing keys (if they aren't already cached):

```csharp
private static async Task<JwtSecurityToken> ValidateToken(
    string token,
    string issuer,
    IConfigurationManager<OpenIdConnectConfiguration> configurationManager,
    CancellationToken ct = default(CancellationToken))
{
    if (string.IsNullOrEmpty(token)) throw new ArgumentNullException(nameof(token));
    if (string.IsNullOrEmpty(issuer)) throw new ArgumentNullException(nameof(issuer));

    var discoveryDocument = await configurationManager.GetConfigurationAsync(ct);
    var signingKeys = discoveryDocument.SigningKeys;

    var validationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = issuer,
        ValidateIssuerSigningKey = true,
        IssuerSigningKeys = signingKeys,
        ValidateLifetime = true,
        // Allow for some drift in server time
        // (a lower value is better; we recommend five minutes or less)
        ClockSkew = TimeSpan.FromMinutes(5),
        // See additional validation for aud below
        ValidateAudience = false,
    };

    try
    {
        var principal = new JwtSecurityTokenHandler()
            .ValidateToken(token, validationParameters, out var rawValidatedToken);

        return (JwtSecurityToken)rawValidatedToken;
    }
    catch (SecurityTokenValidationException)
    {
        // Logging, etc.

        return null;
    }
}
```

To use the method, pass it a token, and the issuer and `configurationManager` you declared earlier:

```csharp
var accessToken = "eyJh...";

var validatedToken = await ValidateToken(accessToken, issuer, configurationManager);

if (validatedToken == null)
{
    Console.WriteLine("Invalid token");
}
else
{
    // Additional validation...

    Console.WriteLine("Token is valid!");
}
```

This method will return an instance of `JwtSecurityToken` if the token is valid, or `null` if it is invalid. Returning `JwtSecurityToken` makes it possible to retrieve claims from the token later.

Depending on your application, you could change this method to return a `bool`, log specific exceptions like `SecurityTokenExpiredException` with a message, or handle validation failures in some other way.

### Additional validation for access tokens

If you are validating access tokens, you should verify that the `aud` (Audience) claim equals the Audience that is configured for your Authorization Server in the Okta Developer Dashboard. For example, if your Authorization Server Audience is set to `MyAwesomeApi`, add this to the validation parameters:

```csharp
ValidateAudience = true,
ValidAudience = "MyAwesomeApi",
```

You can also optionally verify that the `cid` claim matches the expected Client ID of the current application. You'll have to perform this check after the `ValidateToken` method returns a validated token:

```csharp
var validatedToken = await ValidateToken(accessToken, issuer, configurationManager);

// Validate client ID
var expectedClientId = "xyz123"; // This Application's Client ID
var clientIdMatches = validatedToken.Payload.TryGetValue("cid", out var rawCid)
    && rawCid.ToString() == expectedClientId;

if (!clientIdMatches)
{
    throw new SecurityTokenValidationException("The cid claim was invalid.");
}
```

### Additional validation for ID tokens

When validating an ID token, you should verify that the `aud` (Audience) claim equals the Client ID of the current application. Add this to the validation parameters:

```csharp
ValidateAudience = true,
ValidAudience = "xyz123", // This Application's Client ID
```

If you specified a nonce during the initial code exchange when your application retrieved the ID token, you can verify that the nonce matches:

```csharp
var validatedToken = await ValidateToken(accessToken, issuer, configurationManager);

// Validate nonce
var expectedNonce = "foobar"; // Retrieve this from a saved cookie or other mechanism
var nonceMatches = validatedToken.Payload.TryGetValue("nonce", out var rawNonce)
    && rawNonce.ToString() == expectedNonce;

if (!nonceMatches)
{
    throw new SecurityTokenValidationException("The nonce was invalid.");
}
```

## Decode token claims

The sample `ValidateToken` method above both validates a token and decodes its claims. You can use the returned `JwtSecurityToken` object to inspect the claims in the token.

For example, you can get the `sub` (Subject) claim with the `Subject` property:

```csharp
Console.WriteLine($"Token subject: {validatedToken.Subject}");
```

You can access more claims with the `Payload` property, or loop over the entire `Claims` collection:

```csharp
Console.WriteLine("All claims:");

foreach (var claim in validatedToken.Claims)
{
    Console.WriteLine($"{claim.Type}\t{claim.Value}");
}
```

## Conclusion

This guide provides the basic steps required to locally verify an access or ID token signed by Okta. It uses packages from Microsoft for key parsing and token validation, but the general principles should apply to any JWT validation library.
