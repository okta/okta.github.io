# Objects Reference: ${hook_type} Inline Hook

This page provides reference documentation for:

- JSON objects contained in the outbound request from Okta to your external service

- JSON objects you can include in your response

This information is specific to the ${hook_type} hook, one type of inline hook supported by Okta.

## Objects in the Request from Okta

For ${hook_type}, the outbound call from Okta to your external service will include the following objects in its JSON payload:

### data.object1

Describe what object1 provides information about.

| Property | Description | Data Type                                                               |
|----------|-------------|-------------------------------------------------------------------------|
| name     | Description | Type or, for a nested object, anchor link to [sub_object](#sub_object). |
| name     | description |                                                                         |
| name     | description |                                                                         |

#### sub_object

| Property | Description | Data Type |
|----------|-------------|-----------|
| name     | description | data type |
| name     | description | data type |
| name     | description | data type |

(Repeat for additional sub-objects.)

### data.object2

Describe what object2 provides information about.

| Property | Description | Data Type                                                                                                                               |
|----------|-------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| name     | Description | Type or, for a nested object, anchor link to [sub_object](#sub_object), which will be right below and have a description of the object. |
| name     | description |                                                                                                                                         |
| name     | description |    

#### sub_object

| Property | Description | Data Type |
|----------|-------------|-----------|
| name     | description | data type |
| name     | description | data type |
| name     | description | data type |

(Repeat for additional sub-objects.)

(Repeat for additional objects.)

## Objects in Response to Okta

For ${hook_type} hooks, the `commands`, `error`, and `debugContext` objects that you can return in the JSON payload of your response are defined as follows:

### commands

The `commands` object is where you can provide commands to Okta. It is an array, allowing you to include mutlitple commands. In each array element, there needs to be a `type` property and `value` property. The `type` property is where you specify which of the supported commands you wish to execute and `value` is where you supply an operand for the command.

| Property | Description                                                              | Data Type              |
|----------|--------------------------------------------------------------------------|------------------------|
| type     | The name of one of the [supported commands](#supported-commands) | String                 |
| value    | An operand to pass to the command.                                       | Data type or, for nested objects, [value](#value) object |


#### Supported Commands

The following commands are supported for the ${hook_type} inline hook type:

| Command               | Description |
|-----------------------|-------------|
| com.okta.command_name | Description |
| com.okta.command_name | Description |

#### value

For hook types which use a nested object as the operand of a command, a description of that object.

| Property | Description | Data Type |
|----------|-------------|-----------|
|          |             |           |
|          |             |           |
|          |             |           |

### error

You can return an error object, with the following structure:

| Property     | Description | Data Type                   |
|--------------|-------------|-----------------------------|
| errorCode    |             |                             |
| errorSummary |             |                             |
| errorCauses  |             | [errorCauses](#errorCauses) |

#### errorCauses

| Property     | Description | Data Type |
|--------------|-------------|-----------|
| errorSummary |             |           |
| reason       |             |           |
| locationType |             |           |
| location     |             |           |
| domain       |             |           |

(Indicate what errors are defined, an how they will affect the process flow.)

### debugContext

This object is user-defined. Information returned in it will be available in the Okta event log if (insert conditions, e.g., debug mode enabled for hook).

## Sample Listing of JSON Payload of Request

```JSON
sample listing here
```

## Sample Listing of JSON Payload of Response 

```JSON
sample listing here
```
## Context Objects

<!-- Not sure whether to cover context objects. Questions: are they the same for all hooks? Are they useful to developers?-->

 - data.context.request
 - data.context.protocol
 - data.context.session
 - data.context.user
 - data.context.policy

## See Also

For a general introduction Okta inline hooks, see [Inline Hooks](/use_cases/hooks/).

For setup steps for the ${Hook_Type} inline hook, see [${hook_type Setup}](/use_cases/hooks/setup/${Hook_Type}-setup.md).

For information on the API for registering external service endpoints with Okta, see [Callbacks API](/api/resources/callbacks).


