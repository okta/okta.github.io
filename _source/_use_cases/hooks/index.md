---
layout: docs_page
weight: 2
title: Inline Hooks Overview
excerpt: Using inline hooks to integrate custom functionality into Okta process flows
---

# Inline Hooks Concepts

{% api_lifecycle ea %}

## What Are Okta Inline Hooks?

Inline hooks are outbound calls from Okta to your own custom code, triggered at specific points in Okta process flows. They allow you to integrate custom functionality into those Okta process flows.

You implement your custom code as a web service with an Internet-accessible endpoint. It’s your responsibility to arrange hosting of your code on a system external to Okta. Okta defines the REST API contract for the requests it sends to your custom code, as well as for the responses your custom code can send back. 

The outbound call from Okta is called a hook. Your code, which receives the call, is referred to as your external service.

The Okta process that triggered the hook is paused until a response from your service is received (i.e., inline hooks are synchronous calls).

## Multiple Types of Okta Inline Hooks

Okta defines several different types of inline hooks. Each type of inline hook makes it possible to customize a different Okta process flow. All the types share the same general syntax for requests and responses sent between Okta and the external service, but each differs in the specifics of the JSON objects that are sent and received. When implementing your external service, you need to develop your code according to the details of the particular type of hook you intend to use.

## Inline Hook Process Flow

### Extension Points

The points in Okta process flows where inline hooks can be triggered are called extension points, because they are where you can extend Okta functionality with your own custom code. Each type of inline hooks is triggered at a particular extension point in a particular Okta process flow. At an extension point, if you have configured an inline hook, Okta calls your external service, and waits for a response. When the response is received, Okta resumes the process flow.

### Inline Hook Call within an Okta Process Flow

The graphic below illustrates the position of an extension point within an Okta process flow, and how an inline hook call is triggered at that point:

{% img hook-call-steps.png "Hook Call Steps Diagram" alt:"Hook Call Steps Diagram" %}

1. Point A represents the start of a particular Okta process flow, for instance registering a new user or generating a SAML assertion.

1. During the execution of the Okta process flow, at the extension point, between points B and C, Okta sends a request to your external service. 

1. Your external service performs some processing.

1. Your external service sends a response back to Okta.

1. Okta receives the response, acts on any commands it includes, and resumes the process flow that originally triggered the inline hook.

### Request and Response Overview

Okta’s request to your endpoint consists of an HTTPS POST request with a JSON payload. The objects included in the JSON payload provide data relevant to the process flow that triggered the inline hook. The objects included vary depending on the type of inline hook you're using.

{% img hook-request-response.png "Hook Request and Response" alt:"Hook Request and Response" %}

Your service needs to send an HTTPS response back to Okta. The JSON payload of your response contains a `commands` object, in which you can send commands to Okta that affect the course of the Okta process flow or modify Okta objects. The commands that are available vary depending on the type of inline hook you're using. 

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

The Authorization header is a secret string you provide to Okta when you register your external service. This string serves as an API access key for your service, and Okta will provide it in every request, allowing your code to check for its presence as a security measure.

This is not an Okta SSWS authorization token, it is simply a text string you decide on.

The name of the Authorization header is not fixed: you can set header name, in addition to header value, at the time you register your your external service.

### JSON Payload Objects

The JSON payload is where Okta provides specific information about the process flow that's being executed, so that your external service can evaluate the specific situation. Information is encapsulated in JSON objects. The set of objects sent depends on the type of inline hook you are using. Objects are defined in the specific documentation for each kind of inline hook.

The objects providing this specific information on the process flow are nested within a large object called `data`.

The following are some of the objects that can be included in the request, depending on the type of the inline hook:

#### user

For process flows that involve a specific end user, this object provides the values of attributes in the user’s Okta profile. In the case of a user attempting to register using the Self-Service Registration widget, the values provided are those the user entered in the widget’s fields. Password fields, and any attributes designated sensitive, are not included.

#### authentication

For process flows that involve authentication exchanges between Okta and Service Providers, this object provides a representation of an authentication request made to Okta.

#### policy

For process flows that involve Okta Policy objects, this object provides a representation of the Policy object.

#### context

This object provides information about the original end user request to Okta that started the process flow.

## The Response

Your service receives the request from Okta and needs to respond to it. The response needs to include an HTTP response code and will usually also include a JSON payload. In particular, you will typically include a `commands` object in the the JSON payload to specify actions for Okta to execute or to communicate information back to Okta.

### HTTP Status Code

You need to return an HTTP status code with your response. Typically, your service should return an HTTP status code of 200 (OK). In inline hook types that support empty responses, HTTP status code 204 (No Content) needs to be provided when sending an empty response. Do not use the HTTP status code to return information to Okta regarding problems your service has detected in the data; use an error object sent in the JSON payload of the response. HTTP error codes should not be used unless your service could not parse the request from Okta.

### JSON Payload Objects

You can include any of the following types of objects in the JSON payload:

#### commands

Lets you return commands to Okta to affect the process flow being executed and to modify values within Okta objects. The available commands differ by inline hook type and are defined in the specific documentation for each inline hook type.

The `commands` object is an array, allowing you to return more than one command in your response. Each element within the array needs to consist of a pair of `type` and value elements. Each `type` element needs to be the name of a supported command you wish to invoke. The corresponding `value` element is the operand you wish to specify for the command.

The names of commands follow Java-style reverse DNS name format, beginning with com.okta, followed by an Okta object that the command operates on.

#### error

Lets you return error messages. How the error data is used varies by inline hook type.

#### debugContext

Lets you supply any additional information you wish to store in Okta logs for debugging purposes.

## Okta System Log Entries

Currently, unless debugging is enabled for your org, processing of a hook response is not recorded in the Okta System Log. Further, any `debugContext` data your service returns will only be recorded in the Okta system log if debugging is enabled for your org.

Failures are recorded in the System Log inside a `callback.response.processed` event.

## Inline Hook Setup

After creating your external service, you need to tell Okta it exists and to enable it for a particular process flow. The steps are:

1. Create an external service.

1. Register your service's endpoint with Okta by making a `POST` request to `<orgUrl>/api/v1/callbacks`. You specify your endpoint's address in the request's JSON payload, in the object `channel.config.uri`. <!-- When available, add link to reference documentation for Okta API CRUD operators for registering hook endpoints. -->

1. Associate the endpoint with a particular Okta process flow. How to do this varies by inline hook. Usually, options in the Admin Console allow you to specify that an inline hook should be enabled for a particular process flow. 

