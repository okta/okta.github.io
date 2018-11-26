
Groups are a first-class citizen in the Okta environment. They serve purposes including but not limited to:

+ Application Assignment
+ Application Role
+ Policy Assignment

With that in mind, the simple manipulation of group membership can have far reaching effects to strengthen your customer's security posture.\\
For example

+ Adding a user to a group could enforce a restrictive authentication policy with short session lifetimes that always require MFA policy
+ Removing a user from a group could un-assign a sensitive application or remove a permissive role in a downstream application

> As previously mentioned, the `{group_id}` referenced below is an opaque Okta ID and may need to be discovered or configured in some way.\\
Refer to the [Groups](security-analytics#groups) section in our analytics guide for ideas related to working with groups.

#### Group - Add Member

Follow these steps to [add a user to a group](/docs/api/resources/groups#add-user-to-group)

Request
{:.api .api-request .api-request-example}

```sh
PUT https://{yourOktaDomain}/api/v1/users/{user_id}
```

Response
{:.api .api-response .api-response-example}

```sh
HTTP/1.1 204 No Content
```

#### Group - Remove Member

Follow these steps to [remove a user from a group](/docs/api/resources/groups#remove-user-from-group)

Request
{:.api .api-request .api-request-example}

```sh
DELETE https://{yourOktaDomain}/api/v1/users/{user_id}
```

Response
{:.api .api-response .api-response-example}

```sh
HTTP/1.1 204 No Content
```
