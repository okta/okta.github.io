
An individual user's
 [state](security-enforcement#user---change-state),
 [sessions](security-enforcement#user---clear-sessions),
 [credentials](security-enforcement#user---credentials) and
 [profile](security-enforcement#user---profile) can be updated depending on the specific use case.

#### User - Change State

A user's state can be toggled according to a prescribed [state machine](/docs/api/resources/users#user-status)

Suspending a user is a non-destructive operation that will leave a user profile, credentials, enrolled factors, groups membership and assigned applications intact while still preventing the user from signing into Okta or any subordinate application. *The act of suspending a user will destroy any existing Okta session for that user.*

[Suspend a User](/docs/api/resources/users#suspend-user)

Request
{:.api .api-request .api-request-example}

```sh
POST https://{yourOktaDomain}/api/v1/users/{user_id}/lifecycle/suspend
```

Response
{:.api .api-response .api-response-example}

```sh
HTTP/1.1 200 OK
```

To reverse this operation after a threat has been cleared or an internal timer has elapsed you can return a suspended user back to an active state:

[Unsuspend a User](/docs/api/resources/users#unsuspend-user)

Request
{:.api .api-request .api-request-example}

```sh
POST https://{yourOktaDomain}/api/v1/users/{user_id}/lifecycle/unsuspend
```

Response
{:.api .api-response .api-response-example}

```sh
HTTP/1.1 200 OK
```

There are other user state operations that can be changed. Be aware of the full effect of such changes before implementing this feature.  Read our online documentation for more details about user [lifecycle operations](/docs/api/resources/users#lifecycle-operations).

#### User - Clear Sessions

You can clear existing user sessions, forcing a user to authenticate on the next operation.  This action may be taken alone to clear suspicious sessions or in conjunction with other actions -- like changing authentication policies to enforce MFA or expiring a password -- to accelerate the enforcement of that change.

[Clear User Session](/docs/api/resources/users#clear-user-sessions)

Request
{:.api .api-request .api-request-example}

```sh
DELETE https://{yourOktaDomain}/api/v1/users/{user_id}/sessions
```

Response
{:.api .api-response .api-response-example}

```sh
HTTP/1.1 204 NO CONTENT
```

#### User - Credentials

In certain situations, expiring or changing a user's password might also be prudent. Okta provides a consistent mechanism for expiring and changing passwords for users regardless of password authority. For example, when integrated with an on premise Active Directory (AD) expiring or resetting passwords will propagate through Okta to AD with no changes required to the calling client.

While there are more operations you can perform against a user's credentials we will focus on expiring and changing passwords. *Changing or expiring a password does not clear existing sessions for that user*.

##### User - Expire Password

Use this flow to expire a password.  This will cause a user to be foreced to change their current password the next time they login to a connected system. _Applies to AD mastered accounts too_.

[Expire Password](/docs/api/resources/users#expire-password)

Request
{:.api .api-request .api-request-example}

```sh
POST https://{yourOktaDomain}/api/v1/users/{user_id}/lifecycle/expire_password
```

Response
{:.api .api-response .api-response-example}

```json
{
  "id": "{user_id}",
  "...": "...",
}
```

##### User - Reset Password Flow 1

Use this password expiration flow along with a flag to define a `tempPassword`, as a result the password will be expired and a *randomly generated yet policy compliant password* will be set.  With this flow you can determine what -- if anything -- is done with the returned `tempPassword`.  Key benefits associated with this flow are:

+ Not needing to develop different password reset or expiration flows based on an underlying directory
  + Okta will broker the password reset if there is an underlying directory
+ Not needing to code in password complexity parameters or risk generating passwords that aren't compliant
  + Okta is aware of it's own policies or the policies of the underlying directory and will generate compliant passwords

[Expire Password with random tempPassword](/docs/api/resources/users#response-parameters-15)

Request
{:.api .api-request .api-request-example}

```sh
POST https://{yourOktaDomain}/api/v1/users/{user_id}/lifecycle/expire_password?tempPassword=True
```

Response
{:.api .api-response .api-response-example}

```json
{
  "tempPassword": "{compliantPassword"
}
```

##### User - Reset Password Flow 2

Use this password reset flow to generate an Okta password reset flow link.  Use of these links is contingent upon an Okta Org having a password reset flows enabled and will require additional security measures based on the configuration of the Okta org.  These additional security measures can include password reset Security Question and SMS challenge.

Using an Okta password reset link will direct the user to an Okta password reset sequence.  You can choose to have Okta send the link to the user directly or you can have the link returned and choose to provide it to the user through other means.

[Reset a password](/docs/api/resources/users#reset-password)

Request (Okta returns link)
{:.api .api-request .api-request-example}

```sh
#have the password reset link returned
POST https://{yourOktaDomain}/api/v1/users/{user_id}/lifecycle/reset_password?sendEmail=False
```

Response (Okta returns link)
{:.api .api-response .api-response-example}

```json
{
  "resetPasswordUrl": "{yourOktaDomain}/reset_password/XE6wE17zmphl3KqAPFxO"
}
```

Request (Okta sends link)
{:.api .api-request .api-request-example}

```sh
#have Okta send the email
POST https://{yourOktaDomain}/api/v1/users/{user_id}/lifecycle/reset_password?sendEmail=True
```

Response (Okta sends link)
{:.api .api-response .api-response-example}

```json
{
  "id": "{user_id}",
  "...": "...",
}
```

#### User - Profile

With the backing of Universal Directory, Okta Expression Language and rules based groups, a user profile is also a prime mechanism to enforce policy in Okta

+ Profile mappings can change user state in downstream applications based on an attribute value
+ Rules based group memberships can be driven by a variety of inputs, one of which is user attribute values

The following are ways to benefit from these capabilities

+ Extend a user profile
  + _example_ add a health indicator attribute
+ Configure policies in Okta based on that attribute value
+ Configure an integration to manipulate that value in Okta based on your observations
  + _example_ a UEBA might be configured to set a health indicator attribute to indicate risk
  + _example_ rules in Okta could drive group memberships based on attribute value
  + _example_ application assignment, sign-on and authentication policies could be driven by membership (or lack of) of such a rule based group

User attributes are:

+ Extensible
+ Strongly Typed (string, number, Boolean, integer, etc.)
+ Capable of being mapped downstream or leveraged by rules based groups
+ Discoverable through our [Schemas API](/docs/api/resources/schemas#schemas-api)

##### User - Profile Change

Even with all this power and flexibility a partial update of a user profile to a known or set of known attributes is a simple operation.

[Update Profile](/docs/api/resources/users#update-profile)

Request
{:.api .api-request .api-request-example}

```sh
POST https://{yourOktaDomain}/api/v1/users/{user_id}
"{
  "profile":
  {
    "uebaHealth": 75
  }
}"
```

Response
{:.api .api-response .api-response-example}

```json
{
  "id": "{user_id}",
  "...": "...",
  "profile":
  {
      "...": "...",
      "uebaHealth": 75
  },
  "...":"..."
}
```
