---
layout: docs_page
title: Okta API Release Notes
excerpt: Summary of changes to the Okta API since Release 2017.38
---

## Okta API Release Notes for Release 2017.39

The following API feature enhancements<!-- and bug fixes --> are available in the 2017.39 release.
Dates for preview and production release are the earliest possible release date. Always check your org to verify the release version.

### API Feature Enhancements

| Feature Enhancement                                 | Expected in Preview Orgs | Expected in Production Orgs |
|:----------------------------------------------------|:-------------------------|:----------------------------|
|   [Concurrent Rate Limits](#concurrency-rate-limits)  | September 27, 2017       | October 1, 2017             |
|          [ Policy API](#policy-api)                           | September 7, 2017        | October 9, 2017             |
|           [Password Policy API](#password-policy-api)         | September 7, 2017        | October 9, 2017             |

#### Concurrency Rate Limits

In order to protect the service for all customers, Okta enforces concurrent rate limits starting in Release 2017.39.
These limits are distinct from [the org-wide, per-minute API rate limits](/docs/api/getting_started/design_principles.html#org-wide-rate-limits).

For concurrent rate limits, traffic is measured in three different areas (counts in one area aren't included in counts for the other two):

* For agent traffic, Okta measured each org's traffic and set the limit at above the highest usage in the last four weeks.
* For Office365 traffic, the limit is 70 concurrent transactions per org.
* For all other traffic including API requests, the limit is 70 concurrent transactions per org.

Okta has verified that these limits are sufficient based on current usage.

The first request to exceed the concurrent limit returns an HTTP 429 error, and the first error every sixty seconds is written to the log.
Reporting concurrent rate limits once a minute keeps log volume manageable. 

##### Example Error Response Events

~~~json
{
    "eventId": "tevEVgTHo-aQjOhd1OZ7QS3uQ1506395956000",
    "sessionId": "102oMlafQxwTUGJMLL8FhVNZA",
    "requestId": "reqIUuPHG7ZSEuHGUXBZxUXEw",
    "published": "2017-09-26T03:19:16.000Z",
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

##### Example Error Response for System Log API (Beta)

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
        "published": "2017-09-26T20:21:32.783Z",
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

<!-- Example Rate Limit Header

~~~json

HTTP/1.1 200 OK
X-Rate-Limit-Limit: 20
X-Rate-Limit-Remaining: 15
X-Rate-Limit-Reset: 1366037820
~~~ -->

You can find out how close you are to the limit by inspecting the [rate limit headers](/docs/api/getting_started/design_principles.html#rate-limiting).

#### Policy API 

The Policy API enables an Administrator to perform policy and policy rule operations. The policy framework is used by Okta to control rules and settings that govern, among other things, user session lifetime, whether multi-factor authentication is required when logging in, what MFA factors may be employed, password complexity requirements, and what types of self-service operations are permitted under various circumstances. For more information, see Okta's [API Reference](/docs/api/resources/policy.html).

#### Password Policy API 

The Password Policy type controls settings that determine a user’s password length and complexity, as well as the frequency with which a password can be changed. This policy also governs the recovery operations that may be performed by the user, including change password, reset (forgot) password and self-service password unlock. For more information, see Okta's [API Reference](/docs/api/resources/policy.html#GroupPasswordPolicy).

### API Bug Fixes

Bug fixes are expected on preview orgs starting September 20, 2017, and on production orgs starting September 25, 2017.

* Using a refresh token for a client application with a client ID longer than 20 characters caused an error. (OKTA-139722)

### Does Your Org Have This Change Yet?

To verify the current release for an org, click the **Admin** button and check the footer of the Dashboard page.

{% img release_notes/version_footer.png alt:"Release Number in Footer" %}

### Looking for Something Else?

* [Platform Release Note Index for 2016](platform-release-notes2016-index.html) 
* [Platform Release Note Index for 2017](platform-release-notes2017-index.html)
* For changes outside the Okta platform, see the [Product Release Notes](https://help.okta.com/en/prev/Content/Topics/ReleaseNotes/preview.htm).