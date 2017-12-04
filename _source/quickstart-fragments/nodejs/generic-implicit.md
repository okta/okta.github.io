---
layout: quickstart_partial
exampleDescription: NodeJS Implicit Example
---

## Okta Node.js Quickstart

Okta has created a simplified Node library to make this easy for Okta applications, [Okta JWT Verifier](https://www.npmjs.com/package/@okta/jwt-verifier).  Below is an example that shows you how to validate access tokens for a specific Okta authorization server (the issuer) and adds a secondary check for the audience of the token. To learn more about validating Okta access tokens, please see [Validating Access Tokens](https://developer.okta.com/standards/OAuth/index.html#validating-access-tokens).

```javascript
const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'https://{yourOktaDomain}.com/oauth2/default',
  assertClaims: {
    aud: 'api://default'
  }
});

// The access token string, which should be obtained from the Authorization header on the request to your server
const accessTokenString = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Imk2UnRjSkxvbUg0e...';

oktaJwtVerifier.verifyAccessToken(accessTokenString)
  .then(jwt => {
    // the token is valid
    console.log(jwt.claims);
  })
  .catch(err => {
    // a validation failed, inspect the error
  });
```
