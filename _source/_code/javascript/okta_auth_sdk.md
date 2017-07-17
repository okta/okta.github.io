---
layout: docs_page
title: Okta Auth SDK
weight: 10
excerpt: A Javascript wrapper for Okta's Authentication APIs. Build your own branded UI and power sign-in with Okta.
---

# Overview

The Okta Auth SDK builds on top of our [Authentication API](/docs/api/resources/authn.html) and [OAuth 2.0 API](/docs/api/resources/oidc.html) to enable you to create a fully branded sign-in experience using JavaScript.

## Prerequisites

- An Okta org - Register for [Okta Developer Edition](https://www.okta.com/developer/signup/) if you don't have an existing org
- A domain that is [CORS enabled for your org](/docs/api/getting_started/enabling_cors.html)

## Installation

Include the following script tag in your target web page:

~~~ html
<script src="https://ok1static.oktacdn.com/assets/js/sdk/okta-auth-js/1.8.0/okta-auth-js.min.js" type="text/javascript"></script>
~~~

## Authentication Flow

The goal of an authentication flow is to set an Okta session cookie on the user's browser.

All Auth SDK methods return [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), deferred objects that resolve when the method has finished. For more information about why Promises are useful, and how to use our specific promise library, check out the [Q.js readme](https://github.com/kriskowal/q).

An example authentication flow would look like this:

~~~ javascript
var authClient = new OktaAuth({url: 'https://your-org.okta.com'});
authClient.signIn({
  username: 'some-username',
  password: 'some-password'
})
.then(function(transaction) { // On success
  switch(transaction.status) {

    case 'SUCCESS':
      authClient.session.setCookieAndRedirect(transaction.sessionToken); // Sets a cookie on redirect
      break;

    default:
      throw 'We cannot handle the ' + transaction.status + ' status';
  }
})
.fail(function(err) { // On failure
  console.error(err);
});
~~~

## Transactions

When Auth SDK methods resolve, they return a Transaction object that encapsulates the new state in the authentication flow. This Transaction object contains metadata about the current state, and methods that can be used to progress to the next state.

More information about Transaction states, their definitions, and the flow between them can be found in our [Authentication API documentation](/docs/api/resources/authn.html#transaction-state).

### Transaction States

> Keep in mind:
>
> * Methods listed for a state are not always guaranteed to be available.
>
> * `stateToken` is never required as a parameter.
>
> * All transactions have a `data` attribute that contains the response body as an object.

#### Locked Out

The user account is locked; self-service unlock or admin unlock is required.

Property              |   Type    | Description
--------------------- | --------  | -----------
`status`              | String    | `LOCKED_OUT`
`unlock`            | Function | [Parameters](/docs/api/resources/authn.html#unlock-account)
`cancel`            | Function | Ends the transaction

Example:

~~~ javascript
transaction.unlock({
  username: 'dade.murphy@example.com',
  factorType: 'EMAIL'
});
~~~

#### Password Expired

The user’s password was successfully validated but is expired.

Property              |   Type    | Description
--------------------- | --------  | -----------
`status`              | String    | `PASSWORD_EXPIRED`
`expiresAt`           | [Date String](https://tools.ietf.org/html/rfc3339) | Time the transaction will expire
`user`                | [User](/docs/api/resources/authn.html#user-object) | Subset of user properties
`changePassword`      | Function | [Parameters](/docs/api/resources/authn.html#change-password)
`cancel`              | Function | Ends the transaction

Example:

~~~ javascript
transaction.changePassword({
  oldPassword: '0ldP4ssw0rd',
  newPassword: 'N3wP4ssw0rd'
});
~~~

#### Password Reset

The user successfully answered their recovery question and can set a new password.

Property              |   Type    | Description
--------------------- | --------  | -----------
`status`              | String    | `PASSWORD_RESET`
`expiresAt`           | [Date String](https://tools.ietf.org/html/rfc3339) | Time the transaction will expire
`user`                | [User](/docs/api/resources/authn.html#user-object) | Subset of user properties
`resetPassword`       | Function | [Parameters](/docs/api/resources/authn.html#reset-password)
`cancel`              | Function | Ends the transaction

Example:

~~~ javascript
transaction.resetPassword({
  newPassword: 'N3wP4ssw0rd'
});
~~~

#### Password Almost Expired

The user’s password was successfully validated but is about to expire and should be changed.

Property              |   Type    | Description
--------------------- | --------  | -----------
`status`              | String    | `PASSWORD_WARN`
`expiresAt`           | [Date String](https://tools.ietf.org/html/rfc3339) | Time the transaction will expire
`user`                | [User](/docs/api/resources/authn.html#user-object) | Subset of user properties
`policy`              | [Policy](/docs/api/resources/authn#password-policy-object) | Password requirements
`changePassword`      | Function | [Parameters](/docs/api/resources/authn.html#change-password)
`skip`                | Function | Ignore the warning and continue
`cancel`              | Function | Ends the transaction

Example:

~~~ javascript
transaction.changePassword({
  oldPassword: '0ldP4ssw0rd',
  newPassword: 'N3wP4ssw0rd'
});
~~~

#### Recovery

The user has requested a recovery token to reset their password or unlock their account.

Property              |   Type    | Description
--------------------- | --------  | -----------
`status`              | String    | `RECOVERY`
`recoveryType`        | String    | `PASSWORD` or `UNLOCK`
`user`                | [User](/docs/api/resources/authn.html#user-object) | Subset of user properties
`answer`              | Function | [Parameters](/docs/api/resources/authn#answer-recovery-question)
`cancel`              | Function | Ends the transaction

Example:

~~~ javascript
transaction.answer({
  answer: 'My favorite recovery question answer'
});
~~~

#### Verify Recovery

The user must verify the factor-specific recovery challenge.

Property              |   Type    | Description
--------------------- | --------  | -----------
`status`              | String    | `RECOVERY_CHALLENGE`
`expiresAt`           | [Date String](https://tools.ietf.org/html/rfc3339) | Time the transaction will expire
`user`                | [User](/docs/api/resources/authn.html#user-object) | Subset of user properties
`factorType`          | String | `EMAIL` or `SMS`
`recoveryType`        | String | `PASSWORD` or `UNLOCK`
`verify`              | Function | [Parameters](/docs/api/resources/authn.html#verify-recovery-factor)
`resend`              | Function | Resend the recovery email or text
`cancel`              | Function | Ends the transaction

Examples:

~~~ javascript
// Verify the recovery
transaction.verify({
  passCode: '615243'
});

// Resend recovery email or sms
transaction.resend();
~~~

#### Begin MFA Enrollment

When MFA is required, but a user isn't enrolled in MFA, they must enroll in at least one factor.

Property              |   Type    | Description
--------------------- | --------  | -----------
`status`              | String    | `MFA_ENROLL`
`expiresAt`           | [Date String](https://tools.ietf.org/html/rfc3339) | Time the transaction will expire
`user`                | [User](/docs/api/resources/authn.html#user-object) | Subset of user properties
`factors`             | List of [Enroll Factors](#enroll-factor) | Factors enabled for an org
`skip`                | Function | Ignore enrollment and continue
`cancel`              | Function | Ends the transaction

##### Enroll Factor

Property              |   Type    | Description
--------------------- | --------  | -----------
`enrollment`          | String    | `OPTIONAL` or `REQUIRED`
`status`              | String    | `NOT_SETUP`, `PENDING_ACTIVATION`, `ENROLLED`, `ACTIVE`, `INACTIVE`, or `EXPIRED`
`factorType`          | [Factor Type](/docs/api/resources/factors.html#factor-type) | Type of factor
`provider`            | [Factor Provider](/docs/api/resources/factors.html#provider-type) | Provider of the given `factorType`
`enroll`              | Function  | [Parameters](/docs/api/resources/authn.html#enroll-factor). `factorType` and `provider` are optional
`questions`           | Function  | Returns [available questions](/docs/api/resources/factors.html#response-example-3), not a transaction. Only available for the `question` factorType

Example:

~~~ javascript
// Assume the first factor is a question
var factor = transaction.factors[0];

// Returns the available questions
factor.questions();

// Enroll after selecting a question and entering an answer
factor.enroll({
  profile: {
    question: 'disliked_food',
    answer: 'mayonnaise'
  }
});
~~~

#### Activate a Factor for MFA Enrollment

The user must activate the factor to complete enrollment.

Property              |   Type    | Description
--------------------- | --------  | -----------
`status`              | String    | `MFA_ENROLL_ACTIVATE`
`expiresAt`           | [Date String](https://tools.ietf.org/html/rfc3339) | Time the transaction will expire
`factorResult`        | String   | `WAITING`, `CANCELLED`, `TIMEOUT`, or `ERROR`
`user`                | [User](/docs/api/resources/authn.html#user-object) | Subset of user properties
`factor`              | [Activate Enroll Factor](#activate-enroll-factor) | Factor to activate
`activate`            | Function | Verify the OTP or restart the activation process if the activation is expired
`poll`                | Function | Poll until `factorResult` changes. Throws [AuthPollStopError](#authpollstoperror) when `prev` or `cancel` is called
`resend`              | Function | Send another OTP if user doesn’t receive the original activation SMS OTP
`prev`                | Function | End current factor enrollment and return to [MFA_ENROLL](#begin-mfa-enrollment)
`cancel`              | Function | Ends the transaction

##### Activate Enroll Factor

Property              |   Type    | Description
--------------------- | --------  | -----------
`id`                  | String    | Unique id for the factor
`factorType`          | [Factor Type](/docs/api/resources/factors.html#factor-type) | Type of factor
`provider`            | [Factor Provider](/docs/api/resources/factors.html#provider-type) | Provider of the given `factorType`
`activation`          | [Activation](#activation) | Activation properties

##### Activation

Property              |   Type    | Description
--------------------- | --------  | -----------
`expiresAt`           | [Date String](https://tools.ietf.org/html/rfc3339) | Time the activation will expire
`factorResult`        | String   | `WAITING`, `CANCELLED`, `TIMEOUT`, or `ERROR`
`send`                | Function | Takes a `name` parameter that's `sms` or `email`
`qrcode`              | [Link](/docs/api/getting_started/design_principles.html#links) | Contains `href` and `type` to embed as an image

Example:

~~~ javascript
transaction.activate({
  passCode: '615243'
});
~~~

#### Select MFA When Required

The user must provide additional verification with a previously enrolled factor.

Property              |   Type    | Description
--------------------- | --------  | -----------
`status`              | String    | `MFA_REQUIRED`
`expiresAt`           | [Date String](https://tools.ietf.org/html/rfc3339) | Time the transaction will expire
`user`                | [User](/docs/api/resources/authn.html#user-object) | Subset of user properties
`factors`             | List of [Enrolled Factors](#enrolled-factor) | Factors available to pass MFA
`cancel`              | Function | Ends the transaction

##### Enrolled Factor

Property              |   Type    | Description
--------------------- | --------  | -----------
`id`                  | String    | Unique id for the factor
`factorType`          | [Factor Type](/docs/api/resources/factors.html#factor-type) | Type of factor
`provider`            | [Factor Provider](/docs/api/resources/factors.html#provider-type) | Provider of the given `factorType`
`profile`             | [Factor Profile](/docs/api/resources/factors.html#factor-profile-object) | Details about the factor
`verify`              | Function  | [Parameters](/docs/api/resources/authn.html#verify-factor)

Example:

~~~ javascript
// Assume the first factor is a question
var factor = transaction.factors[0];

factor.verify({
  answer: 'mayonnaise'
});
~~~

#### MFA Enforcement

The user must verify the factor-specific challenge.

Property              |   Type    | Description
--------------------- | --------  | -----------
`status`              | String    | `MFA_CHALLENGE`
`expiresAt`           | [Date String](https://tools.ietf.org/html/rfc3339) | Time the transaction will expire
`factorResult`        | String   | `WAITING`, `CANCELLED`, `TIMEOUT`, or `ERROR`
`user`                | [User](/docs/api/resources/authn.html#user-object) | Subset of user properties
`factor`              | [Challenge Factor](#challenge-factor) | Factor currently being challenged
`poll`                | Function | Poll until `factorResult` is not `WAITING`. Throws [AuthPollStopError](#authpollstoperror) if `prev`, `resend`, or `cancel` is called
`resend`              | Function | Takes a `name` parameter that's usually `sms` or `push`
`prev`                | Function | End current factor enrollment and return to [MFA_ENROLL](#begin-mfa-enrollment)
`cancel`              | Function | Ends the transaction

##### Challenge Factor

Property              |   Type    | Description
--------------------- | --------  | -----------
`id`                  | String    | Unique id for the factor
`factorType`          | [Factor Type](/docs/api/resources/factors.html#factor-type) | Type of factor
`provider`            | [Factor Provider](/docs/api/resources/factors.html#provider-type) | Provider of the given `factorType`
`profile`             | [Factor Profile](/docs/api/resources/factors.html#factor-profile-object) | Details about the factor
`verification`        | [Verification](/docs/api/resources/authn.html#verify-factor)  | Verification properties

Example:

~~~ javascript
transaction.poll();
~~~

#### Successful Sign-In

At the end of the authentication flow, a transaction with a status of `SUCCESS` is returned. This transaction contains a `sessionToken` that you can [exchange for an Okta cookie](#create-a-session).

Property              |   Type    | Description
--------------------- | --------  | -----------
`status`              | String    | `SUCCESS`
`expiresAt`           | [Date String](https://tools.ietf.org/html/rfc3339) | Time the sessionToken will expire
`sessionToken`        | [Session Token](/docs/api/resources/authn.html#session-token) | Token that can be exchanged for a cookie
`user`                | [User](/docs/api/resources/authn.html#user-object) | Subset of user properties

Example:

~~~ javascript
authClient.session.setCookieAndRedirect(transaction.sessionToken);
~~~

## Transaction Management

If the user navigates away from the page during an authentication flow, you may want to resume the transaction.

### Check for Existing Transaction

Check for a transaction to be resumed. This is synchronous and returns `true` or `false`.

~~~ javascript
authClient.tx.exists();
~~~

### Resume the transaction

Returns a transaction with a user's previous state.

~~~ javascript
authClient.tx.resume();
~~~

## Social Authentication and OpenID Connect

If you want to create a token via [OpenID Connect](/docs/api/resources/oidc.html) or [social authentication](/docs/api/resources/social_authentication.html), it's possible to manage the flow with this SDK. To do so, instantiate your client with a `clientId` and `redirectUri`. If you don't have either of those, [set up OpenID Connect with these instructions](https://github.com/oktadeveloper/okta-oauth-spa-authjs-osw/blob/master/Okta-OIDC_SPA_JS-OSW_DevSetupGuide.pdf).

~~~ javascript
var authClient = new OktaAuth({
  url: 'https://your-org.okta.com',
  clientId: 'your-client-id',
  redirectUri: 'https://your.redirect.uri/redirect' // defaults to current url if omitted
});
~~~

Each method to create a token (or tokens) takes an optional argument:

~~~ javascript
// Defaults
var options = {
  responseType: 'id_token',
  scopes: ['openid', 'email']
};
~~~

The `responseType` option can be a string (`id_token`, `token`, or `code`) or an array with multiple responseTypes. When a string is passed, the response is a single token. When an array is passed, the response is a token array in the order they were requested. For example:

A single token

~~~ javascript
authClient.token.getWithPopup({
  responseType: 'id_token'
})
.then(function(idToken) {
  // Manage the idToken
})
.catch(function(err) {
  // Handle OAuthError
});
~~~

Multiple tokens

~~~ javascript
authClient.token.getWithPopup({
  responseType: ['token', 'id_token']
})
.then(function(tokenArray) {
  // The tokenArray order corresponds with the responseType array

  // 'token' was first, so the first item is an accessToken
  var accessToken = tokenArray[0];

  // 'id_token' was second, so the second item is an idToken
  var idToken = tokenArray[1];

  // Manage the tokens
})
.catch(function(err) {
  // Handle OAuthError
});
~~~

Each `responseType` has its own format:

~~~ javascript
// id_token
{
  idToken: 'theIdTokenString',
  claims: {}, // The claims of the idToken (they're determined by the scopes requested)
  expiresAt: 123456789, // When the token expires in unix time
  scopes: [] // The scopes requested
}

// token
{
  accessToken: 'theAccessTokenString',
  expiresAt: 123456789, // When the token expires in unix time,
  tokenType: 'Bearer', // This is the default type for access tokens
  scopes: [] // The scopes requested
}

// code
{
  authorizationCode: 'theAuthorizationCodeString'
}
~~~

### Create token with a popup
~~~ javascript
authClient.token.getWithPopup(options)
.then(function(tokenOrTokens) {
  // Manage token or tokens
})
.catch(function(err) {
  // Handle OAuthError
});
~~~

This is commonly used to create a token with an external idp.

~~~ javascript
authClient.token.getWithPopup({
  idp: 'target-idp'
});
~~~

### Create token using a redirect
~~~ javascript
authClient.token.getWithRedirect(options);

// If the token is in the url after the redirect
authClient.token.parseFromUrl()
.then(function(tokenOrTokens) {
  // Manage token or tokens
})
.catch(function(err) {
  // Handle OAuthError
});
~~~

This is commonly used to create an authorization code.

~~~ javascript
authClient.token.getWithRedirect({
  responseType: 'code'
});

// authClient.token.parseFromUrl isn't necessary, because it's parsed from the query param by your server
~~~

### Exchange a sessionToken for a token

When you've obtained a sessionToken from the authorization flows, or a session already exists, you can obtain a token or tokens without prompting the user to log in.

~~~ javascript
authClient.token.getWithoutPrompt({
  responseType: 'id_token', // or array of types
  sessionToken: 'testSessionToken' // optional if the user has an existing Okta session
})
.then(function(tokenOrTokens) {
  // Manage token or tokens
})
.catch(function(err) {
  // Handle OAuthError
});
~~~

Note: If the Okta cookie is not set and you are using `token.getWithoutPrompt`, try enabling third-party cookies in the browser.

### Refresh a token

Returns a new token if the Okta session is still valid.

~~~ javascript
authClient.token.refresh(tokenToRefresh)
.then(function(freshToken) {
  // Manage freshToken
})
.catch(function(err) {
  // Handle OAuthError
});
~~~

### Decode an ID Token

Decode a raw ID Token

~~~ javascript
authClient.token.decode(idTokenString);
~~~

## Session Management

The SDK allows managing your Okta session. Each of these methods returns a Promise.

### Create a session

To create a session, you must first have a `sessionToken`. This can be created by going through the [Authentication Flow](#authentication-flow) until the [SUCCESS](#successful-sign-in) status. The transaction will contain the `sessionToken`. If a `redirectUri` is not passed, Okta will redirect to the current page.

~~~ javascript
authClient.session.setCookieAndRedirect(sessionToken, redirectUri);
~~~

### Check for an existing session

Resolves with `true` or `false`.

~~~ javascript
authClient.session.exists();
~~~

### Get an existing session

Resolves with a [session](/docs/api/resources/sessions.html#example).

~~~ javascript
authClient.session.get();
~~~

### Refresh a session

Resolves with a refreshed version of your existing [session](/docs/api/resources/sessions.html#example).

~~~ javascript
authClient.session.refresh();
~~~

### Close a session

Terminates an existing [session](/docs/api/resources/sessions.html#example).

~~~ javascript
authClient.session.close();
~~~

## Errors

A `fail` on a promise will resolve with one of these failures:

#### AuthApiError

This is thrown when we receive a response from the Okta service that is not a 200. It contains the same properties as our [API errors](/docs/api/getting_started/design_principles.html#errors).

#### AuthSdkError

This is thrown when an error occurs within the SDK.

Property              |   Type    | Description
--------------------- | --------  | -----------
`errorCode`           | String | Always `INTERNAL`
`errorSummary`        | String | Summary of the error

#### AuthPollStopError

This is thrown when a `poll` has been initiated, but another action is taken before the `poll` is finished.

#### OAuthError

This is thrown when an [error occurs during the OAuth flow](/reference/error_codes/index#openid-connect-and-okta-social-authentication).

Property              |   Type    | Description
--------------------- | --------  | -----------
`errorCode`           | String | The OAuth error code
`errorSummary`        | String | Summary of the error
