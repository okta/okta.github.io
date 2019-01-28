---
layout: docs_page
title: Inline Hooks
excerpt: Integrate custom functionality into Okta process flows.
---

# Inline Hooks

{% api_lifecycle ea %}

## What Are Okta Inline Hooks?

Inline hooks are outbound calls from Okta to your own custom code, triggered at specific points in Okta process flows. They allow you to integrate custom functionality into those Okta process flows.

You implement your custom code as a web service with an Internet-accessible endpoint. It's your responsibility to arrange hosting of your code on a system external to Okta. Okta defines the REST API contract for the requests it sends to your custom code, as well as for the responses your custom code can send back. 

The outbound call from Okta is called a hook. Your code, which receives the call, is referred to as your external service.

The Okta process that triggered the hook is paused until a response from your service is received (i.e., inline hooks are synchronous calls).

## Multiple Types of Okta Inline Hooks

Okta defines several different types of inline hooks. Each type of inline hook makes it possible to customize a different Okta process flow. All the types share the same general syntax for requests and responses sent between Okta and the external service, but each differs in the specifics of the JSON objects that are sent and received. When implementing your external service, you need to develop your code according to the details of the particular type of hook you intend to use.

## Inline Hook Process Flow

### Extension Points

The points in Okta process flows where inline hooks can be triggered are called extension points, because they are where you can extend Okta functionality. Each type of inline hook is triggered at a particular extension point in a particular Okta process flow. At an extension point, if you have configured an inline hook, Okta calls your external service, and waits for a response. When the response is received, Okta resumes the process flow.

### Inline Hook Call within an Okta Process Flow

The graphic below illustrates the position of an extension point within an Okta process flow, and how an inline hook call is triggered at that point:

{% img hook-call-steps.png "Hook Call Steps Diagram" alt:"Hook Call Steps Diagram" %}

1. During the execution of the Okta process flow, at the extension point, between points A and B, Okta sends a request to your external service. 

1. Your external service performs some processing.

1. Your external service sends a response back to Okta.

1. Okta receives the response, acts on any commands it includes, and resumes the process flow that originally triggered the inline hook.

### Request and Response Overview

Okta's request to your external service consists of an HTTPS POST request with a JSON payload. The objects included in the JSON payload provide data relevant to the process flow that triggered the inline hook. The set of objects varies depending the type of inline hook you're using.

{% img hook-request-response.png "Hook Request and Response" alt:"Hook Request and Response" %}

Your service needs to handle the inline hook by responding to Okta's request. The JSON payload of your response contains a `commands` object, in which you can send commands to Okta that affect the course of the Okta process. The commands available vary depending on the type of inline hook you're using. 

## The Request

### HTTP Method

Okta uses an HTTPS POST request to call your service.

### HTTP Header

The header of the request sent by Okta includes the following fields:

```
Accept: application/json
Content-Type: application/json
Authorization: <key>
```
#### Authorization Header

The Authorization header is a secret string you provide to Okta when you register your external service. This string serves as an API access key for your service, and Okta will provide it in every request, allowing your code to check for its presence as a security measure. (This is not an Okta authorization token, it is simply a text string you decide on.)

### JSON Payload Objects

The JSON payload is where Okta provides specific information about the process flow that's being executed, so that your external service can evaluate the specific situation. Information is encapsulated in JSON objects. The set of objects sent depends on the type of inline hook you're using. Objects are defined in the specific documentation for each kind of inline hook.

The objects providing this information are nested within a large object called `data`.

Always included is a `data.context` object, providing context information. In general, `data.context` encapsulates objects that your external service cannot affect, while objects in `data` outside of `data.context` encapsulate objects that your external service will be able to modify by means of commands sent in the response.

## The Response

Your service receives the request from Okta and needs to respond to it. The response needs to include an HTTP response code and will usually also include a JSON payload. In particular, you will typically include a `commands` object in the the JSON payload to specify actions for Okta to execute or to communicate information back to Okta.

### HTTP Status Code

You need to return an HTTP status code with your response. Typically, your service should return an HTTP status code of 200 (OK). In inline hook types that support empty responses, HTTP status code 204 (No Content) needs to be provided when sending an empty response.


#### Don't Use HTTP Status Code to Return Information

Don't use the HTTP status code to return information to Okta regarding problems your service has detected in the data; use an [error](#error) object sent in the JSON payload of the response. HTTP error codes should not be used unless your service could not parse the request from Okta.

### JSON Payload Objects

You can include any of the following types of objects in the JSON payload:

#### commands

Lets you return commands to Okta to affect the process flow being executed and to modify values within Okta objects. The available commands differ by inline hook type and are defined in the specific documentation for each inline hook type.

The `commands` object is an array, allowing you to return more than one command in your response. Each element within the array needs to consist of a pair of `type` and `value` elements. Each `type` element needs to be the name of a supported command you wish to invoke. The corresponding `value` element is the operand you wish to specify for the command.

The names of commands follow Java-style reverse DNS name format, beginning with com.okta, followed by an Okta object that the command operates on, and then an action.

#### error

Lets you return error messages. How the error data is used varies by inline hook type.

Within an `error` object, you need to provide an `errorSummary` property set to a text string. Additionally, you can use an `errorCauses` object to supply more information. A single error object can contain multiple `errorCauses` objects. The fields within errorCauses are: `errorSummary`, `reason`, `locationType`, `location`, and `domain`. 

#### debugContext

Lets you supply any additional information you wish to store in Okta logs for debugging purposes. You can use this object as you wish, sending any information that would be useful for debugging purposes.

## Inline Hook Setup

After creating your external service, you need to tell Okta it exists and to enable it for a particular process flow. The steps are:

1. Create an external service.

1. Register your service's endpoint with Okta by making a `POST` request to `/api/v1/inlineHook`. You specify your endpoint's address in the request's JSON payload, in the object `channel.config.uri`. See [Inline Hooks Management API](/docs/api/resources/inline-hooks).

1. Associate the endpoint with a particular Okta process flow. How to do this varies by inline hook.

