---
layout: docs_page
title: Rate Limiting at Okta
weight: 3
redirect_from:
  - "/docs/getting_started/design_principles"
excerpt: Understand rate limits at Okta and learn how to design for efficient use of resources
---

# Rate Limiting at Okta

The number of API requests for an organization is limited for all APIs in order to protect the service for all users.

Okta has two types of rate limits:

* [Org-wide rate limits](#org-wide-rate-limits) that vary by API endpoint. These limits are applied on a per-minute or per-second basis, and some are also applied on a per-user basis. For example, if your org sends a request to list applications more than one hundred times in a minute, the org-wide rate limit is exceeded. These limits protect against denial-of-service attacks, and help ensure that adequate resources are available for all customers.
* [Concurrent rate limits](#concurrent-rate-limits) on the number of simultaneous transactions regardless of endpoint. For example, if you sent 77 very long-lasting requests to any API endpoint simultaneously, you might exceed the concurrent rate limit.

Rate limits may be changed to protect customers. We provide advance warning of changes when possible.

## Org-Wide Rate Limits

API rate limits apply per minute or per second to the endpoints in an org.

If an org-wide rate limit is exceeded, an HTTP 429 Status Code is returned.
You can anticipate hitting the rate limit by checking [Okta's rate limiting headers](#check-your-rate-limits-with-oktas-rate-limit-headers).

When reading the following tables, remember that a more specific limit is considered separately from a more general limit on the same base URI. For example, when you are updating an application, the rate limit for creating or listing an application is not also applied.

### Okta API Endpoints and Per Minute Limits

Extensions to the base URLs listed below are included in the specified limit, unless the URL is followed by "only." For example, `/api/v1/apps/{id}` has a per-minute rate limit of 500 as listed in the second line in the table. However, `/api/v1/apps/{id}/users` falls under the more general first line of the table. This pattern applies to all the URLs.

| Action | Okta API Endpoint                                             | Per Minute Limit |
|:---------|:--------------------------------------------------------------|-----------------------:|
| Create or list applications | `/api/v1/apps`   except `/api/v1/apps/{id}`                                     |   100 |
| Get, update, or delete an application | `/api/v1/apps/{id}` only   |   500 |
| Authenticate different end users | `/api/v1/authn`                       |   500 |
| Creating or listing groups | `/api/v1/groups` except  `/api/v1/groups/{id}` |  500 |
| Get, update, or delete a group | `/api/v1/groups/{id}` only          | 1000 |
| Get System Log data | `/api/v1/logs`                                           | 120 |
| Get session information | `/api/v1/sessions`                               |   750 |
| Create or list users | `/api/v1/users` except `/api/v1/users/{id}` and `/api/v1/users/{login}`    |   600 |
| Get a user by user ID or login (combined) | `/api/v1/users/{id}` or `/api/v1/users/{login}`  only   | 2000 |
| Update or delete a user by ID | `/api/v1/users/{id}` only     |   600 |
| Create an org (ISVs only)           | `/api/v1/orgs`                          |   50 |
| All other actions | `/api/v1/`                                               |  1200 |

### Okta API Endpoints and Per-User Limits
API endpoints that take username and password credentials, including the [Authentication API](/docs/api/resources/authn) and the [OAuth 2.0 resource owner password flow](/authentication-guide/implementing-authentication/password), have a per-username rate limit to prevent brute force attacks with the user's password:

| Action | Okta API Endpoint                           | Per Second Limit |
|:-------- | :----------------------------------------------------------|-------:|
| Generate or refresh an OAuth 2.0 token for the resource owner password flow | `/oauth2/v1/token`    |      4 |
| Authenticate the same user | `/api/v1/authn/`           |      4 |

### Okta Rate Limits for All Other Endpoints
Finally, for all endpoints not listed in the tables above, the API rate limit is a combined 10,000 requests per minute. 

### Okta Home Page Endpoints and Per-Minute Limits

The following endpoints are used by the Okta home page for authentication and sign on, and have org-wide rate limits:

| Okta Home Page Endpoints                 | Per-Minute Limit |
|:-----------------------------------------|------:|
| `/app/{app}/{key}/sso/saml`              |   750 |
| `/app/office365/{key}/sso/wsfed/active`  |  2000 |
| `/app/office365/{key}/sso/wsfed/passive` |   250 |
| `/app/template_saml_2_0/{key}/sso/saml`  |  2500 |
| `/login/do-login`                        |   200 |
| `/login/login.htm`                       |   850 |
| `/login/sso_iwa_auth`                    |   500 |
| `/api/plugin/{protocol version}/form-cred/{app user IDs}/{form site option}`     |   650 |
| `/api/plugin/{protocol version}/sites`    |   150 |
| `/bc/fileStoreRecord`                          |    500 |
| `/bc/globalFileStoreRecord`               |    500 |

### End-User Rate Limit

Okta limits the number of requests from the administrator UI to 40 requests per user per 10 seconds per endpoint. This rate limit protects users from each other, and from other API requests in the system. 

If a user exceeds this limit, they receive an HTTP 429 response without affecting other users in your org.
A message is written to the System Log indicating that the end-user rate limit was encountered. 

## Concurrent Rate Limits

In order to protect the service for all customers, Okta enforces concurrent rate limits, a limit on the number of simultaneous transactions. Concurrent rate limits are distinct from [the org-wide, per-minute API rate limits](#org-wide-rate-limits), which measure the total number of transactions per minute. Transactions are typically very short-lived. Even very large bulk loads rarely use more than 10 simultaneous transactions at a time.

For concurrent rate limits, traffic is measured in three different areas. Counts in one area aren't included in counts for the other two:

* For agent traffic, Okta has set the limit based on typical org usage. This limit varies from agent to agent.
* For Office365 traffic, the limit is 75 concurrent transactions per org.
* For all other traffic including API requests, the limit is 75 concurrent transactions per org.

Okta has verified that these limits are sufficient based on current usage. As a result of verification, we increased the limit for some orgs to 150 transactions.

The first request to exceed the concurrent limit returns an HTTP 429 error, and the first error every sixty seconds is written to the log. Reporting concurrent rate limits once a minute keeps log volume manageable.

> Important: Under normal circumstances, customers don't exceed the concurrency limits. Exceeding them may be an indication of a problem which requires investigation.

## Check Your Rate Limits with Okta's Rate Limit Headers

Okta provides three headers in each response to report on both concurrent and org-wide rate limits. 

For org-wide rate limits, the three headers show the limit that is being enforced, when it resets, and how close you are to hitting the limit:
* `X-Rate-Limit-Limit` - the rate limit ceiling that is applicable for the current request.
* `X-Rate-Limit-Remaining` - the number of requests left for the current rate-limit window.
* `X-Rate-Limit-Reset` - the time at which the rate limit will reset, specified in UTC epoch time.

For example:

~~~ http
HTTP/1.1 200 OK
X-Rate-Limit-Limit  10000
X-Rate-Limit-Remaining  9999
X-Rate-Limit-Reset  1516307596
~~~

The best way to be sure about org-wide rate limits is to check the relevant headers in the response. The System Log doesn't report every
API request. Rather, it typically reports completed or attempted real-world events such as configuration changes, user logins, or user lockouts.
The System Log doesn’t report the rate at which you’ve been calling the API.

Instead of the accumulated counts for time-based rate limits, when a request exceeds the limit for concurrent requests,
`X-Rate-Limit-Limit`, `X-Rate-Limit-Remaining`, and `X-Rate-Limit-Reset` report the concurrent values. 

The three headers behave a little differently for concurrent rate limits: when the number of unfinished requests is below the concurrent rate limit, request headers only report org-wide rate limits.
When you exceed a concurrent rate limit threshold, the headers report that the limit has been exceeded. When you drop back down below the concurrent rate limit, the headers  switch back to reporting the time-based rate limits.
Additionally, the `X-Rate-Limit-Reset` time for concurrent rate limits is only a suggestion. There's no guarantee that enough requests will complete to stop exceeding the concurrent rate limit at the time indicated.

### Example Rate Limit Header with Org-Wide Rate Limit  

This example shows the relevant portion of a rate limit header being returned with  for a request that hasn't exceeded the org-wide rate limit for the `/api/v1/users` endpoint:

~~~http
HTTP/1.1 200 
Date: Tue, 27 Jan 2018 21:33:25 GMT
X-Rate-Limit-Limit: 600
X-Rate-Limit-Remaining: 598
X-Rate-Limit-Reset: 1516308901
~~~

The following example show a rate limit header being returned for a request that has exceeded the rate limit for the `/api/v1/users` endpoint:

~~~http
HTTP/1.1 429 
Date: Tue, 27 Jan 2018 21:33:25 GMT
X-Rate-Limit-Limit: 600
X-Rate-Limit-Remaining: 0
X-Rate-Limit-Reset: 1516308966
~~~

### Example Rate Limit Header with Concurrent Rate Limit  

This example shows the relevant portion of a rate limit header being returned with the error for a request that exceeded the concurrent rate limit. If the rate limit wasn't being exceeded, the headers would contain information about the org-wide rate limit. You won't ever see non-error concurrent rate limits in the headers.

~~~http
HTTP/1.1 429 
Date: Tue, 26 Jan 2018 21:33:25 GMT
X-Rate-Limit-Limit: 0
X-Rate-Limit-Remaining: 0
X-Rate-Limit-Reset: 1506461721
~~~

The first two header values are always `0` for concurrent rate limit errors.
The third header reports an estimated time interval when the concurrent rate limit may be resolved. It is not a guarantee.

The error condition resolves itself as soon as there is another concurrent thread available. Normally, no intervention is required. However, if you notice frequent bursts of 429 errors, or if the concurrent rate limit isn't quickly resolved, you may be exceeding the concurrent rate limit. If you can't identify what is causing you to exceed the limit by examining activity in the log before the burst of 429 errors are logged, {{site.contact_support_lc}}.


### Example Error Response Events for Concurrent Rate Limit

~~~json
{
    "eventId": "tevEVgTHo-aQjOhd1OZ7QS3uQ1506395956000",
    "sessionId": "102oMlafQxwTUGJMLL8FhVNZA",
    "requestId": "reqIUuPHG7ZSEuHGUXBZxUXEw",
    "published": "2018-01-26T03:19:16.000Z",
    "action": {
      "message": "Too many concurrent requests in flight",
      "categories": [],
      "objectType": "core.concurrency.org.limit.violation",
      "requestUri": "/report/system_log"
    },
    "actors": [
      {
        "id": "00uo7fD8dXTeWU3g70g3",
        "displayName": "Test User",
        "login": "test-user@test.net",
        "objectType": "User"
      },
      {
        "id": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36",
        "displayName": "CHROME",
        "ipAddress": "127.0.0.1",
        "objectType": "Client"
      }
    ],
    "targets": []
  }
~~~

### Example Error Response in System Log API (Beta) for Concurrent Rate Limit

~~~json
{
        "actor": {
            "alternateId": "test.user@test.com",
            "detailEntry": null,
            "displayName": "Test User",
            "id": "00u1qqxig80SMWArY0g7",
            "type": "User"
        },
        "authenticationContext": {
            "authenticationProvider": null,
            "authenticationStep": 0,
            "credentialProvider": null,
            "credentialType": null,
            "externalSessionId": "trs2TSSLkgWR5iDuebwuH9Vsw",
            "interface": null,
            "issuer": null
        },
        "client": {
            "device": "Unknown",
            "geographicalContext": null,
            "id": null,
            "ipAddress": "4.15.16.10",
            "userAgent": {
                "browser": "UNKNOWN",
                "os": "Unknown",
                "rawUserAgent": "Apache-HttpClient/4.5.2 (Java/1.7.0_76)"
            },
            "zone": "null"
        },
        "debugContext": {
            "debugData": {
                "requestUri": "/api/v1/users"
            }
        },
        "displayMessage": "Too many requests in flight",
        "eventType": "core.concurrency.org.limit.violation",
        "legacyEventType": "core.concurrency.org.limit.violation",
        "outcome": null,
        "published": "2018-01-26T20:21:32.783Z",
        "request": {
            "ipChain": [
                {
                    "geographicalContext": null,
                    "ip": "4.15.16.10",
                    "source": null,
                    "version": "V4"
                },
                {
                    "geographicalContext": null,
                    "ip": "52.22.142.162",
                    "source": null,
                    "version": "V4"
                }
            ]
        },
        "securityContext": {
            "asNumber": null,
            "asOrg": null,
            "domain": null,
            "isProxy": null,
            "isp": null
        },
        "severity": "INFO",
        "target": null,
        "transaction": {
            "detail": {},
            "id": "Wcq2zDtj7xjvEu-gRMigPwAACYM",
            "type": "WEB"
        },
        "uuid": "dc7e2385-74ba-4b77-827f-fb84b37a4b3b",
        "version": "0"
    }
~~~

## Requesting Exceptions

You can request a temporary rate limit increase. For example, if you are importing a large number of users and groups you may need a temporary rate limit increase.

To request an exception, {{site.contact_support_lc}} 10 days before you need the increase, and provide the following details:

* Your Org Name: the entire URL, for example https://cloudcompany.okta.com or https://unicorn.oktapreview.com
* Endpoints and Rates: the URI that need to have their limits increased and how much of an increase is required
* Start date and time
* End date and time
* Business Justification: why you need the temporary increase
