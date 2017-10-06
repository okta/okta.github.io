---
layout: docs_page
title: Revoking Tokens
excerpt: How to revoke OAuth 2.0 and Okta session tokens
---

## How to Revoke a Token

If for whatever reason you would like to disable an access or refresh token, simply send a request to your `/revoke` endpoint:

```
http --form POST https://dev-144769.oktapreview.com/oauth2/ausaw8fz3q4Yd3Zk70h7/v1/revoke \
  accept:application/json \
  authorization:'Basic ZmEz...' \
  cache-control:no-cache \
  content-type:application/x-www-form-urlencoded \
  token=eyJhbG... \
  token_type_hint=access_token
```

> Note: Revoking a token that is invalid, expired, or already revoked will still return a `200 OK` so as to not leak information.

For more information, see [Revoke a Token](https://developer.okta.com/docs/api/resources/oauth2.html#revoke-a-token) in the Okta OAuth 2.0 reference.

## Revoking the Access VS the Refresh Token

The token revocation endpoint can revoke either access or refresh tokens. Revoking an access token does not revoke the associated refresh token, and revoking a refresh token does not revoke the associated access token. 

#### Revoking only the access token

Revoking only the access token will effectively forces the use of the refresh token to retrieve a new access token. This could be useful if, for example, you have changed a user's data and you want this information to be reflected in a new access token.

#### Revoking only the refresh token 

If you revoke only the refresh token then the access token will only last as long as the configured time-to-live (TTL) of the access token. This allows you to, for example, force a user to reauthenticate soon (when the access token expires) but not immediately. 

For more information on configuring TTL and other parameters involving access and refresh tokens, you can read about [Okta Access Policies](https://developer.okta.com/standards/OAuth/index#access-policies).

## Removing a User Session

Separate from access and refresh tokens, there is also the Okta session cookie which provides access to your Okta organization and applications. For a more complete explanation of Okta User sessions, see (jakub.todo). Okta sessions can be revoked in one of two ways: you can either close a specific session using the Sessions API, or revoke all sessions for a given user using the Users API. 

> Note: Removing all user sessions can optionally also remove all related access and refresh tokens as well.

For more information on removing a specific session, see [Close Session](https://developer.okta.com/docs/api/resources/sessions.html#close-session) in the Sessions API reference. For more on removing all of a user's sessions, see [Clear User Sessions](https://developer.okta.com/docs/api/resources/users.html#clear-user-sessions) in the Users API reference.


