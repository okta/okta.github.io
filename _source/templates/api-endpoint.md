---
layout: docs_page
title: API-Name
excerpt: Pithy phrase describing problem that customer solves with this API 
---

<!-- Each API may have additional content required to describe it. Feel free to add sections. This template provides the basic pattern. -->

# API-Name

<!-- Be sure to give the API name in both places where API-Name appears -->

The Feebleblitzer API...
 
## Endpoints

Explore the API-Name API: [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/4adca9a35eab5716d9f6)
<!-- Replace link with a link to your postman collection. If you haven't published it yet, hide this section. -->

### Endpoint-Name Request
{:.api .api-operation}

<!-- Phrase that describes what the endpoint does, like "Returns a list of all feebleblitzers" -->

{% api_operation get //api-url %}
<!-- Replace "get" with appropriate HTTP request get, post etc. and "//api-ur" with the full URI after the org name such as /api/v1/my-endpoint -->

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter         | Description                                                                                        | Param Type | DataType  | Required | Default         |
----------------- | -------------------------------------------------------------------------------------------------- | ---------- | --------- | -------- | --------------- |
paramName         | What param represents. If very detailed, add details at end of table                               | ---------- | --------- | -------- | --------------- |

#### Parameter Details
<!-- You can delete this section if there aren't any details to add. -->

#### Response Parameters

Parameter         | Description                                                                                        | DataType  |
----------------- | -------------------------------------------------------------------------------------------------- | ----------|
responseParameter   What the value returned represents.

#### Request Example

~~~
insert request example here
~~~

#### Response Example

~~~
insert response example here
~~~

## Model

#### Example

~~~json
Insert schema example
~~~

#### Object-Name Properties

All object-names have the following properties:

|----------------+--------------------------------------------+-------------------------------------------------------------------+----------+--------+----------+-----------+-----------+------------|
| Property       | Description                                | DataType                                                          | Nullable | Unique | Readonly | MinLength | MaxLength | Validation |
| -------------- | ------------------------------------------ | ----------------------------------------------------------------- | -------- | ------ | -------- | --------- | --------- | ---------- |
| id             | The feebleblitzer...
