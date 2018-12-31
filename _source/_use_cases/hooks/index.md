---
layout: docs_page
weight: 2
title: Inline Hooks Overview
excerpt: Using inline hooks to integrate custom functionality into Okta process flows
---

# Inline Hooks Concepts

## What Are Okta Inline Hooks?

Inline hooks are outbound calls from Okta to your own custom code, triggered at specific points in Okta process flows. They allow you to integrate custom functionality into those Okta process flows.

You implement your custom code as a web service with an Internet-accessible endpoint. It’s your responsibility to arrange hosting of your code on a system external to Okta. Okta defines the REST API contract for the requests it sends to your custom code, as well as for the responses your custom code can send back. 

The outbound call from Okta is called a hook. Your code, which receives the call, will be referred to as your external service.

The Okta process that triggered the hook is paused until a response from your service is received (i.e., inline hooks are synchronous calls).

## Multiple Types of Okta Inline Hooks

Okta defines several different types of inline hooks. Each type of inline hook makes it possible to customize a different Okta process flow. All the types share the same general syntax for requests and responses sent between Okta and the external service, but each differs in the specifics of the JSON objects that are sent and received. When implementing your external service, you need to develop your code according to the details of the particular type of hook you intend to use.

## Inline Hook Process Flow

### Extension Points

The point in an Okta process flow where an inline hook can be triggered is called an extension point, because it's where you can extend Okta functionality with your own custom code. Each type of inline hooks is triggered at a particular extension point in a particular Okta process flow. At the extension point, if you have configured an inline hook, Okta calls your external service, and waits for a response. When the response is received, Okta resumes the process flow.

### Steps in an Inline Hook Call

The graphic below illustrates the sequence of steps in an inline hook call:

{% img hook-call-steps.png "Hook Call Steps Diagram" alt:"Hook Call Steps Diagram" %}

1. At the extension point, between points B and C, Okta sends a request to your external service. The request conforms to a predefined data contract and provides data relevant to the process flow. 

1. Your external service performs some processing.

1. Your external service sends a response back to Okta.

1. Okta receives the response, acts on any commands it includes, and resumes the process flow that originally triggered the inline hook.

## The Request

Okta’s request to your endpoint consists of an HTTPS POST request with a JSON payload. The objects included in the JSON payload vary depending on the type of inline hook you're using, and provide data relevant to the process flow that triggered the inline hook.

The following are some of the objects that can be included in the request, depending on the type of the inline hook:

### `user`

For process flows that involve a specific end user this object provides the values of attributes in the user’s Okta profile. In the case of a user attempting to register using the Self-Service Registration widget, the values provided are those the user entered in the widget’s fields. Password fields, and any attributes designated sensitive, are not included.


### `authentication`

For process flows that involve authentication exchanges between Okta and Service Providers, this object provides a representation of an authentication request made to Okta.


### `policy`

For process flows that involve Okta Policy objects, this object provides a representation of the Policy object.

### `context`

This object provides information about the original end user request to Okta that started the process flow.

## The Response

Your service receives the request and responds to it. The response needs to include an HTTP response code and will usually also include a JSON payload. You use the objects in the JSON payload to specify actions for Okta to execute or to communicate information back to Okta. You can include any of the following types of objects in the JSON payload:

### `commands`

Lets you invoke commands to modify the actions executed by Okta, or to update values within Okta objects. The available commands differ by inline hook type.

### `error`

Lets you return error messages.

### `debugContext`

Lets you supply any additional information you wish to store in Okta logs for debugging purposes.

## Request Syntax

### HTTP Method

Okta uses an HTTPS POST request to call your service.

### HTTP Header

The header of the request sent by Okta includes the following fields:

```
Accept: application/json
Content-Type: application/json
Authorization: <key>
```

The `Authorization` header is described below.

When registering your external service with Okta, you can also optionally specify additional headers you would like Okta to include in requests.

#### Authorization Header

The Authorization header is a secret string you provide to Okta when you register your external service. This string serves as an API access key for your service, and Okta will provide it in every request, allowing your code to check for its presence as a security measure.

This is not an Okta SSWS authorization token, it is simply a text string you decide on.

The name of the Authorization header is not fixed: you can set header name, in addition to header value, at the time you register your your external service.

### JSON Payload Objects

Depending on what type of hook you’re using, the JSON payload of the request will contain a different set of sub-objects, to provide your external service with data relevant to the Okta process flow that’s being executed.

## Response Syntax

