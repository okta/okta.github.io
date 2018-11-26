---
layout: blog_post
title: "Add the Power of Webhooks to Your App with Okta's System Log"
author: jf
tags: [webhooks, go]
---

If you've used webhooks before, you probably understand the magical powers they boast. Do you want to build a sleep tracker for your dog? Get notified when it's going to rain? Or maybe have new Eventbrite attendees automatically added to Salesforce? You can do all of those things with webhooks and services like Twilio, Zapier and Workato.

To get webhooks with Okta, this post will show you how to use an underappreciated feature in Okta, the System Log. It's a record of all activity that happens in your Okta org. Examples of the events that get recorded in your System Log are:

-   Failed login attempts
-   When a user is added or removed from a group
-   When a user is promoted to an administrator

In this post, I will be showing you how to use the Go programming language to write a command line utility that will poll the Okta System Log for pre-configured events that match a regular expression, then fire that event data off via a webhook.

If you're impatient and want to try out the finished software and start sending webhooks from Okta, you can download the "loghook" program below and get started:

-   [macOS](https://github.com/jpf/loghook/releases/download/v0.0.4/loghook_darwin_amd64)
-   [Linux](https://github.com/jpf/loghook/releases/download/v0.0.4/loghook_linux_amd64)

Let's discuss what webhooks are. Simply stated, they are "[user-defined HTTP callbacks](http://timothyfitz.com/2009/02/09/what-webhooks-are-and-why-you-should-care/)". In concrete terms what this means is that by implementing webhooks with Okta, you can integrate Okta into any website that supports callbacks via webhooks.

One of the major benefits of using webhooks is that they are so composable. Any developer who is familiar with the semantics of HTTP can use webhooks to integrate Okta with any system they can interact with
via a web application. And, because of the widespread adoption of webhooks, you can integrate directly into services like Loggly and Zapier without needing to implement anything beyond basic HTTP handlers.


## Use Go to Turn System Log Events into Webhooks

Below, we will cover the critical parts of the "loghook" command that takes System Log events from Okta and turns them into webhooks.

The key parts of this code are as follows:

-   The main event loop
-   Getting System Log events from Okta
-   Processing events
-   Sending webhooks

As you walk through the webhook implementation, I encourage you to keep the source code open to get a sense of where we are:

<https://github.com/jpf/loghook>


## Set Up the Main Event Loop

Let's start by looking at the main loop that drives the core of this program:

```go
for {
    for logEvents.Next() {
        logEvent, raw := logEvents.Get()
        if !logEvent.Published.IsZero() {
            logEvents.Since = logEvent.Published.Add(time.Second * 1)
        }
        eventProcessor.Process(logEvent, raw)
    }
    if logEvents.err != nil {
        log.Warning("Error:", logEvents.err)
        break
    }
    logEvents.Sleep()
}
```

What you see above are two nested `for` loops.

The innermost `for` loop uses a [stateful iterator](https://ewencp.org/blog/golang-iterators/#pattern-4-stateful-iterators) to iterate over any events that might be in the System Log. For each event, we'll call the `Process()` method to process the event. Also, if the event has a "Published" time, use that time as the "last seen" or time "Since" we last saw an event. Note that we add "1" second to this time to avoid duplicates, which might lead to missed events for high volume Okta orgs.

The outermost `for` loop allows us to check for errors fetching events and then sleep after we've processed a batch of events.

Now that you've got an idea of how the main loop works let's take a look at the whole function that runs the main loop. This code below contains the main loop, but also has the code we use to configure the Okta log client as well as the event processing code which loads configuration from a file named `loghook.csv`:

```go
func main() {
    log.SetOutput(os.Stdout)
    log.SetLevel(log.InfoLevel)

    oktaLogClient := &logClient{
        oktaOrgUrl:   os.Getenv("OKTA_ORG_URL"),
        apiToken:     os.Getenv("OKTA_API_KEY"),
        retrySeconds: os.Getenv("LOGHOOK_RETRY_SECONDS"),
    }
    logEvents, _ := oktaLogClient.Tail()
    logEvents.Since = time.Now().UTC().Add(time.Minute * -2)

    eventProcessor := eventProcessorInit()
    eventProcessor.LoadConfig("loghook.csv")

    log.Info("Started polling for events at: ", oktaLogClient.oktaOrgUrl)
    for {
        for logEvents.Next() {
            logEvent, raw := logEvents.Get()
            if !logEvent.Published.IsZero() {
                logEvents.Since = logEvent.Published.Add(time.Second * 1)
            }
            eventProcessor.Process(logEvent, raw)
        }
        if logEvents.err != nil {
            log.Warning("Error:", logEvents.err)
            break
        }
        logEvents.Sleep()
    }
}
```

Note in particular the use of `os.Getenv` which we use to get Okta configuration from environment variables.


### A Note About Logging

As you read through this code, you'll notice a lot of usage of `log`. If you aren't familiar with it yet, this is the [log](https://golang.org/pkg/log/) package that is part of the Go standard library.

In this project, we configure `log` to send log output to the [Standard Out](https://www.gnu.org/software/libc/manual/html_node/Standard-Streams.html) stream and to only display messages marked as the "Information" [severity level](https://tools.ietf.org/html/rfc5424#page-11) or higher:

```go
log.SetOutput(os.Stdout)
log.SetLevel(log.InfoLevel)
```


## Get System Log Events From Okta

In this section, I'll cover how we use the `Next()`, `Get()`, and `Sleep()` functions to abstract away some of the complexity in fetching System Log events from Okta.

At a high level, here is what each of these functions does:

1.  `Tail()`: creates a stateful iterator for the System Log
2.  `Next()`: returns a boolean "true" if there is another System Log event to fetch or returns boolean "false" otherwise. This function also transparently handles paginated results from the System Log.
3.  `Get()`: fetches the next event in the System Log
4.  `Sleep()`: sleeps for 15 seconds by defaults, or the interval configured using an environment variable

Let's take a look at each of these functions in detail:


### Tail()

The code below is syntactic sugar used to initialize a stateful iterator for the System Log.

```go
func (c *logClient) Tail() (*logEventResult, error) {
    logEvent := &logEventResult{
        logClient: c,
        offset:    -1,
    }
    return logEvent, nil
}
```


### Next()

The `Next()` function uses an "offset" to keep track of where you are in the results from Okta. It uses the following logic:

-   If the offset is undefined (`-1`), then fetch results from Okta
-   If the offset is less than the results from Okta then return boolean "true" because you have results left
-   Otherwise, we've run out of results, so check to see if the results were paginated and then fetch the next set of results if so
-   Finally, if you have no more results and no more pages to list, reset and return boolean "false" as you have no more results to return

Here is the code that implements this logic:

```go
func (l *logEventResult) Next() bool {
    if l.offset == -1 {
        err := l.getEvents("")
        if err != nil {
            log.Warning("Error:", err)
            return false
        }
    }
    if l.offset < len(l.events) {
        return true
    } else if l.nextLink != "" {
        err := l.getEvents(l.nextLink)
        if err != nil {
            log.Warning("Error: ", err)
            return false
        } else {
            return true
        }
    }
    // Try again next time
    l.offset = -1
    return false
}
```

Astute readers will note that the `Next()` function makes several calls to the private `getEvents()` function. Let's take a look at that function. Here's what the `getEvents()` function does:

1.  Construct the request URL, using query parameters if needed.

    ```go
    log.Debug("Events since: ", l.Since)
    if loc == "" {
        u, err := url.Parse(l.logClient.oktaOrgUrl + "/api/v1/logs")
        if err != nil {
            log.Fatal(err)
        }
        if !l.Since.IsZero() {
            q := u.Query()
            q.Set("since", l.Since.Format(time.RFC3339))
            q.Set("until", time.Now().UTC().Format(time.RFC3339))
            u.RawQuery = q.Encode()
        }
        loc = u.String()
    }
    log.Debug("Getting URL: ", loc)
    req, err := http.NewRequest("GET", loc, nil)
    if err != nil {
        return l.log(err)
    }
    ```
2.  Set the appropriate headers for our HTTP request to Okta.

    ```go
    req.Header.Add("Accept", "application/json")
    req.Header.Add("Authorization", "SSWS "+l.logClient.apiToken)
    req.Header.Add("Cache-Control", "no-cache")
    req.Header.Add("Content-Type", "application/json")
    ```
3.  Execute the HTTP request, checking for errors.

    ```go
    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return l.log(err)
    }
    defer resp.Body.Close()
    ```
4.  Determine if the response was paginated by checking for a `Link` header in the HTTP response

    ```go
    for _, value := range resp.Header["Link"] {
        match := rfc5988.FindStringSubmatch(value)
        link, rel := match[1], match[2]
        if rel == "next" {
            l.nextLink = link
        }
    }
    ```
5.  Finally, decode the response into an array of raw JSON strings

    ```go
    l.offset = 0
    l.events = make([]json.RawMessage, 100)
    err = json.NewDecoder(resp.Body).Decode(&l.events)
    if err != nil {
        return l.log(err)
    }
    return nil
    ```

This section of code is short, but is the most important and interesting part of this project. By defining `l.events` as a slice of `json.RawMessage` types, this code does not need to know anything about the structure of events from the Okta System Log. Thus, you don't need to have a fully defined [struct](https://tour.golang.org/moretypes/2) for System Log events, all you need to do is to parse out what is important to you (in this case, the `eventType`) and then POST the full string as a webhook when you find an event you want to pass on. Without using `json.RawMessage`, you'd have to account for every possible System Log event type or risk losing data when you serialize a Go object back into a JSON string.

Here's what it all looks like when it's put together into one function:

```go
func (l *logEventResult) getEvents(loc string) error {
    log.Debug("Events since: ", l.Since)
    if loc == "" {
        u, err := url.Parse(l.logClient.oktaOrgUrl + "/api/v1/logs")
        if err != nil {
            log.Fatal(err)
        }
        if !l.Since.IsZero() {
            q := u.Query()
            q.Set("since", l.Since.Format(time.RFC3339))
            q.Set("until", time.Now().UTC().Format(time.RFC3339))
            u.RawQuery = q.Encode()
        }
        loc = u.String()
    }
    log.Debug("Getting URL: ", loc)
    req, err := http.NewRequest("GET", loc, nil)
    if err != nil {
        return l.log(err)
    }

    req.Header.Add("Accept", "application/json")
    req.Header.Add("Authorization", "SSWS "+l.logClient.apiToken)
    req.Header.Add("Cache-Control", "no-cache")
    req.Header.Add("Content-Type", "application/json")

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return l.log(err)
    }
    defer resp.Body.Close()

    for _, value := range resp.Header["Link"] {
        match := rfc5988.FindStringSubmatch(value)
        link, rel := match[1], match[2]
        if rel == "next" {
            l.nextLink = link
        }
    }
    l.offset = 0
    l.events = make([]json.RawMessage, 100)
    err = json.NewDecoder(resp.Body).Decode(&l.events)
    if err != nil {
        return l.log(err)
    }
    return nil
}
```


### Get()

Gets the current System Log event from the internal `events` property, using the `offset` property to keep track of which property is the current one.

```go
func (l *logEventResult) Get() (*oktaLogEvent, *[]byte) {
    raw := []byte(l.events[l.offset])
    l.offset += 1

    var oktaEvent oktaLogEvent
    err := json.Unmarshal(raw, &oktaEvent)
    if err != nil {
        l.log(err)
        return nil, nil
    }
    return &oktaEvent, &raw
}
```


### Sleep()

This code is used to wait between calls to the System Log. Uses the value in the `LOGHOOK_RETRY_SECONDS` environment variable as the number of seconds to wait, or 15 seconds otherwise.

```go
func (l *logEventResult) Sleep() {
    ts := l.Since.Format(time.RFC3339)
    log.WithFields(log.Fields{"last_seen": ts}).Debug("Sleeping")
    var retrySeconds int
    retrySeconds, err := strconv.Atoi(l.logClient.retrySeconds)
    if err != nil {
        retrySeconds = 15
    }
    time.Sleep(time.Second * time.Duration(retrySeconds))
}
```


## Process Events

Now that we've covered how we get events from Okta's System Log, let's go over how to process these events and decide which events to send as webhooks and where to send those events.

Let's start with `loghook.csv`, the configuration file that our `loghook` command will use to decide which events to send and to where.

Here is what an example `loghook.csv` would look like:

```csv
^example.example,http://example.com
```

This file is a [CSV](https://tools.ietf.org/html/rfc4180) file, meaning that we use commas to separate values. Each line in this file has two values:

1.  A regular expression for matching an `eventType` for an event
2.  The URL where the JSON payload for the event will be sent via an HTTP POST

In the example above, any event in the Okta System Log that has the type of `example.example` will be sent to the URL `http://example.com`. Note that no Okta events will have the type of `example.example`, so this line is safe to keep in your configuration file.

Here are the steps you'll use to load the configuration into this program:

1.  Load the configuration from the `loghook.csv` file.
2.  Turn each [regular expression](https://golang.org/pkg/regexp/#Regexp) and [URL](https://golang.org/pkg/net/url/) into their respective types in Go and store the results in an array.

Loading the `loghook.csv` file is easy, we just use Go's [built-in CSV parsing package](https://golang.org/pkg/encoding/csv/):

```go
func (p *eventProcessor) LoadConfig(filename string) {
    f, err := os.Open(filename)
    if err != nil {
        log.Fatal(err)
    }
    defer f.Close()
    records, _ := csv.NewReader(f).ReadAll()
    for _, record := range records {
        p.Add(record[0], record[1])
    }
}
```

For each line in the CSV file, we call the `Add()` method to process the regular expression and URL in the line, then append an array containing the compiled regular expression and URL to our list of "processors":

```go
func (p *eventProcessor) Add(expression, destination string) {
    re, err := regexp.Compile(expression)
    if err != nil {
        log.Fatal("Error compiling Regular Expression: ", err)
    }
    url, err := url.Parse(destination)
    if err != nil {
        log.Fatal("Error parsing destination URL: ", err)
    }
    p.Handlers = append(p.Handlers, eventHandler{re, url})
    log.Info(fmt.Sprintf("Sending events matching '%s' to '%s'", expression, destination))
}
```

Here are how we define the `eventProcessor` type and the `Handler` Array in the `eventProcessor`:

```go
type eventHandler struct {
    Expression *regexp.Regexp
    URL        *url.URL
}

type eventProcessor struct {
    Handlers []eventHandler
}

func eventProcessorInit() eventProcessor {
    processor := eventProcessor{}
    processor.Handlers = []eventHandler{}
    return processor
}
```

Finally, here is one of the core functions in this program, the function that processes each event and determines if the event should be sent via a webhook.

This function works by iterating over each handler. If the `eventType` of that event matches the regular expression for a handler, then a webhook is sent to the URL that corresponds to that
regular expression:

```go
func (p *eventProcessor) Process(event *oktaLogEvent, raw *[]byte) {
    for _, handler := range p.Handlers {
        re, url := handler.Expression, handler.URL
        log.WithFields(log.Fields{
            "UUID":      event.UUID,
            "Published": event.Published.Format(time.RFC3339),
            "EventType": event.EventType,
        }).Info("Event")
        if re.MatchString(event.EventType) {
            sendWebhook(url, event, raw)
        }
    }
}
```


## Send Your Webhooks

Last is `sendWebhook`, the function that makes the HTTP request (or webhook) to a URL. This code is a pretty standard HTTP client, we set up a POST request, configure a few headers, then make the request.

```go
func sendWebhook(url *url.URL, event *oktaLogEvent, payload *[]byte) error {
    log.Debug("POSTing to URL:", url)

    req, err := http.NewRequest("POST", url.String(), bytes.NewReader(*payload))
    req.Header.Set("User-Agent", userAgent)
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        log.Error(err)
    }
    defer resp.Body.Close()

    log.WithFields(log.Fields{"EventType": event.EventType, "URL": url}).Info("Match found")
    return nil
}

```

The only thing that isn't obvious above is where the `userAgent` string is defined. This string is configured once at runtime and will look something like this: `loghook/0.0.2 go/1.8.3 darwin/16.7.0`

Here is how the `userAgent` string is defined:

```go
func makeUserAgent() string {
    goVersion := strings.Replace(runtime.Version(), "go", "", -1)
    osVersion, err := osversion.GetString()
    if err != nil {
        osVersion = "ERROR"
    }
    userAgent := fmt.Sprintf("%s/%s go/%s %s/%s",
        "loghook", // clientName
        "0.0.3",   // Version
        goVersion,
        runtime.GOOS,
        osVersion,
    )
    return userAgent
}

var userAgent = makeUserAgent()
```


## Running Loghook Yourself

You're all done reading the code now! If you want to see loghook in action with your own Okta org, just follow the steps below.

Get loghook on your system by downloading a pre-compiled binary above or compiling it yourself as follows:

```console
$ git clone https://github.com/jpf/loghook.git
$ cd loghook
$ go get github.com/getlantern/osversion
$ go get github.com/sirupsen/logrus
$ go build loghook.go
```

At this point, you will have a binary named `loghook` in your current directory. Now you'll need to configure the environment variables that `loghook` uses and then edit the `loghook.csv` file:

```console
$ export OKTA_ORG_URL="https://{yourOktaDomain}"
$ export OKTA_API_KEY="01A_BcDE23fgH4IJKLM5nop_QRstUvwXYZ6aBC78dE"
```

**IMPORTANT**: The values for `OKTA_ORG_URL` and `OKTA_API_KEY` above are examples. You will need to use the URL for your own Okta org as well as [create an API token](https://developer.okta.com/docs/api/getting_started/getting_a_token) to allow `loghook` to connect to your Okta org.

Now, you'll need to edit the `loghook.csv` file and add entries for where you want to send the webhooks. The [RequestBin](https://requestb.in/) tool is a great resource to use for setting up a quick and temporary webhook endpoint for testing.

I suggest creating a URL with RequestBin, then updating your `loghook.csv` file to look something like this:

```csv
^example.example,http://example.com
.*,https://requestb.in/0ab12345
```

Once you do this, start up `loghook` by running this command:

```console
./loghook
```

You'll know it's working if you see output like this:

```console
$ ./loghook
INFO[0000] Sending events matching '^example.example' to 'http://example.com'
INFO[0000] Sending events matching '.*' to 'https://requestb.in/0ab12345'
INFO[0000] Started polling for events at: https://dev-12345.oktapreview.com
```

I hope that this post has inspired you to think of cool ways you can use webhooks with your own Okta org. I highly suggest checking out [Zapier](https://zapier.com/) and in particular the excellent [Zapier Webhook support](https://zapier.com/blog/how-use-zapier-webhooks/) that Zapier provides. You should also take a look at this post on [the webhooks vs serverless debate](/blog/2017/10/11/why-are-webhooks-better-than-serverless-extensibility) by my friend and colleague Randall Degges.

[Let me know](mailto:joel.franusic@okta.com) how you're using `loghook` or if you have any questions or comments about this post. And don't forget to follow our team on Twitter [@oktadev](https://twitter.com/OktaDev). Thanks for reading!
