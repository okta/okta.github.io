---
layout: quickstart_partial
exampleDescription: Express.js Implicit Flow Example
---

In the Generic Node example (see other tab) we show you how to use the simplified [Okta JWT Verifier](https://www.npmjs.com/package/@okta/jwt-verifier) to verify Okta's JWTs.  In the example below we use the same verifier to create a simple Express middleware function that can prevent a request from completing if the request is not authenticated with a valid access token.  To learn more about validating Okta access tokens, please see [Validating Access Tokens](https://developer.okta.com/standards/OAuth/index#validating-access-tokens).

```javascript
const express = require('express');
const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'http://{your-okta-org-url}/oauth2/default',
  assertClaims: {
    aud: 'api://default',
  },
});

/**
 * A simple middleware that asserts valid access tokens and sends 401 responses
 * if the token is not present or fails validation.  If the token is valid its
 * contents are attached to req.jwt
 */
function authenticationRequired(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    return res.status(401).end();
  }

  const accessToken = match[1];

  return oktaJwtVerifier.verifyAccessToken(accessToken)
    .then((jwt) => {
      req.jwt = jwt;
      next();
    })
    .catch((err) => {
      res.status(401).send(err.message);
    });
}

const app = express();

/**
 * An example route that requires a valid access token for authentication, it
 * will echo the contents of the access token if the middleware successfully
 * validated the token.
 */
app.get('/secure', authenticationRequired, (req, res) => {
  res.json(req.jwt);
});

app.listen(3000);
```
