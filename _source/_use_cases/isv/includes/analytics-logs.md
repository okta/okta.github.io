
Our System Log API is a recent addition that improvies upon our Events API.\\
Among other thigns it provides:

+ Extensible query parameters
  + Only retrieve the data relevant to your need
+ More log context
  + Well defined structure
  + More information

See the reference section at the end of the document for information on migrating from the Event API to the System Log API.

Data provided from this endpoint includes but is not limited to.\\
Authentication events, user profile updates, user state changes, application and group assignment, Okta platform changes and more.  Each log clearly describing the actor, action, targets and context of the event.

This endpoint is most relevant for a SIEM, UEBA or CASB looking to ingest activity from. Other specialized cases exist where tightly scoped queries are made to detect a specific condition or an Ad hoc query to provide enriched context to an incident (security or operational) investigation. An example of such a use case is elaborated in a recent [blog post](/blog/2017/10/17/add-the-power-of-webhooks-to-your-app-with-oktas-system-log)

#### Best Practices Logs

<div style="border: 1px solid #626b6d; background-color: #ddf8ff; padding-left: 15px; padding-right: 15px; padding-bottom: 15px; padding-top: 15px">

In addition to the [Common Guidance] offered above the System Log API carries these unique guidelines.

The page size (`limit` _parameter_) should be a configurable value with a range between 10 and 100, the default value should be 100.

For ongoing polling, the of collection should be configurable. Regular polling for new logs is preferred, a suggested default interval between 60 and 300 seconds is encouraged. A maximum interval of 1 day should be enforced.

for Ad hoc queries, crafting a tightly scoped `filter` and specifcying `start` and `end` dates to reduce the data overhead associated with trying to do client side filtering.

</div>

##### Ongoing Polling

This approach is intended to address the use-case of the SIEM, UEBA or other external system that aims to ingest all event data from Okta as efficiently as possible.  This is accomplished in 2 phases

+ Cold Start
  + The initial collection, including any and all pages returned
+ Warm Start
  + Ongoing collection after an elapsed timer collecting only data that was written after the completion of the Cold Start or a previous Warm Start interval

###### Collection Pseudocode

This demonstates a logic to deal with pagination aware cold and warm start collection

Pseudocode (_pythonish_)

+ `since` = ISO8601 date/time
  + not to exeed 180 days in the past
  + if ommitted, defaults to 7 days in the past
+ `limit` = configurable page size
  + if ommitted, default 100

```python
# check for an existing checkpointUrl
if checkpointUrl:
  # This is a warm start, picking up from where we left off
  url = checkpointUrl
else:
  # This is a cold start, use configuration values
  myOkta = "yourOktaDomainName"
  myLimit = 100
  mySince = "2017-10-01T00:00:00.000Z"
  # your http client library of choice will probably do this part for you
  url = "https://" + myOkta + "/api/v1/logs"
  url += "?since=" + mySince
  url += "&limit=" + myLimit

# collect data and all available pages
while url:
  response = GET url
  results += response.json()
  # determine if there are more pages to collect
  if len(response.json()) = myLimit and 'next' in response.links
    # extract the next link from the response
    url = response.links['next']['url']
  elif len(response.json()) = 0:
    # if this request returned 0 results there is no next link contained
    # use the same as the checkpointUrl for the next itteration
    checkpointUrl = url
    url = false
  else:
    # if this request returned fewer results than requested
    # use the next link contained in the response for the next itteration
    checkpointUrl = response.links['next']['url']
    url = false

# store the data collected during this interval
store results

# save the checkpointUrl for future iterations
save checkpointUrl
```

##### Ad hoc Queries

This approach is intended to one-off collection of specific events tightly filtered by date, a filter, a query or any valid combination of these as [described here](../../docs/api/resources/system_log.html#list-events)

###### Ad hoc Pseudocode 1

fetch all events occuring in the last 7 days with a specific eventType

Pseudocode (_pythonish_)

+ `limit` = configurable page size
  + if ommitted, default 100
+ `eventType` = a specific event type

```python
myOkta = "yourOktaDomainName"
myLimit = 100
myEventType = "user.session.start"
url = "https://" + myOkta + "/api/v1/logs"
url += "?limit=" + myLimit
url += '&filter=(eventType eq "' + myEventType + '")'

# collect data and all available pages
while url:
  response = GET url
  results += response.json()
  # determine if there are more pages to collect
  if len(response.json()) = myLimit and 'next' in response.links
    # extract the next link from the response
    url = response.links['next']['url']
  else:
    # if this request returned fewer results than requested we are done
    url = false

# store the data collected during this interval
store results
```

###### Ad hoc Pseudocode 2

fetch the most recent 1000 events or 7 day worth of events for a specific user

Pseudocode (_pythonish_)

+ `limit` = configurable page size
  + if ommitted, default 100
+ `userId` = a specific user of interest

```python
now = now()
then = now.addDays(-7)
myOkta = "yourOktaDomainName"
myLimit = 100
mySince = then.toISO8601() #"2017-10-01T00:00:00.000Z"
myUntil = now.toISO8601()  #"2017-10-08T00:00:00.000Z"
myUserId = "john.doe"
url = "https://" + myOkta + "/api/v1/logs"
url += "?limit=" + myLimit
url += "&since=" +mySince
url += "&until=" +myUntil
url += "&sortOrder=DESCENDING"
url += '&filter=(actor.alternateId eq "' + myUserId + '")'

# collect data and all available pages
while url:
  response = GET url
  results += response.json()
  # determin if we have already collected 1000
  if len(results) >= 1000
    url = false
  # determine if there are more pages to collect
  elif len(response.json()) = myLimit and 'next' in response.links
    # extract the next link from the response
    url = response.links['next']['url']
  else:
    # if this request returned fewer results than requested we are done
    url = false

# store the data collected during this interval
store results
```

#### Logs Data and More

More details and complete examples are available in our [System Log API] documentation as well as our [ISV Syslog References] guide
