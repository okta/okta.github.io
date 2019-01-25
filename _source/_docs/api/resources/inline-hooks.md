---
layout: docs_page
title: Inline Hooks
category: management
excerpt: The Inline Hooks APIs provides a CRUD and execution interface for Inline Hooks.
---

# Inline Hooks API 

{% api_lifecycle ea %}

The Inline Hooks API provides a CRUD interface for registering external inline hook endpoints. It also provides a way to manually trigger invocation of an inline hook for testing purposes.

## Inline Hook Operations

### Create Inline Hooks

{% api_operation post /api/v1/inlineHooks%}

Adds a new Inline Hook to your Organization in ACTIVE status.

#### Request Parameters

| Parameter | Description                                                                            | Param Type | DataType                                | Required |
|-----------|----------------------------------------------------------------------------------------|------------|-----------------------------------------|----------|
| Inline Hook  | A valid Inline Hook                                                                 | Body       |[Inline Hook Object](#inline-hook-object)| TRUE     |

#### Response Parameters

All responses return the created Inline Hook.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
    "name" : "My Test Inline Hook",
    "type" : "com.okta.tokens.transform",
    "version" : "1.0.0",
    "channel" : {
        "type" : "HTTP",
        "version" : "1.0.0",
        "config" : {
            "uri" : "http://127.0.0.1:4567/inlineHook",
            "method" : "POST",
            "headers" : [
                {
                    "key" : "X-Other-Header",
                    "value" : "some-other-value"
                }
            ],
            "authScheme" : {
                "type" : "HEADER",
                "key" : "Authorization",
                "value" : "api-key"
            }
        }
    }
}' "https://{yourOktaDomain}/api/v1/inlineHook"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
    "id": "calr0dvWvbMQJHZCM0g3",
    "status": "ACTIVE",
    "name" : "My Test Inline Hook",
    "type" : "com.okta.tokens.transform",
    "version" : "1.0.0",
    "channel" : {
        "type" : "HTTP",
        "version" : "1.0.0",
        "config" : {
            "uri" : "http://127.0.0.1:4567/inlineHook",
            "method" : "POST",
            "headers" : [
                {
                    "key" : "X-Other-Header",
                    "value" : "some-other-value"
                }
            ],
            "authScheme" : {
                "type" : "HEADER",
                "key" : "Authorization",
                "value" : "api-key"
            }
        }
    },
    "created": "2018-05-15T01:23:08.000Z",
    "lastUpdated": "2018-05-15T01:23:08.000Z"
}
~~~

### Get Inline Hook

{% api_operation get /api/v1/inlineHoooks/${inlineHookId}%}

#### Request Parameters

| Parameter    | Description                                                                               | Param Type | DataType                          | Required |
|--------------|-------------------------------------------------------------------------------------------|------------|-----------------------------------|----------|
| inlineHookId | A valid Inline Hook id                                                                    | Path       | String                            | TRUE     |

#### Response Parameters

All responses return the Inline Hook that matches the inlineHookId provided

##### Request Example
{:.api .api-request .api-request-example}

~~~json
curl -v -X GET \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}/api/v1/inlineHooks/{inlineHookId}"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
    "id": "cali2j192cIE9VpHn0h7",
    "status": "ACTIVE",
    "name": "Test Inline Hook",
    "type": "com.okta.tokens.transform",
    "version": "1.0.0",
    "channel": {
        "type": "HTTP",
        "version": "1.0.0",
        "config": {
            "uri": "https://my.test.url",
            "headers": [
                {
                    "key": "X-Other-Header",
                    "value": "some-other-value"
                }
            ],
            "method": "POST",
            "authScheme": {
                "type": "HEADER",
                "key": "Authorization",
                "value": "******"
            }
        }
    },
    "created": "2018-12-05T00:35:20.000Z",
    "lastUpdated": "2018-12-05T00:35:20.000Z"
}
~~~

### List Inline Hooks

{% api_operation get /api/v1/inlineHooks%}

| Parameter | Description                                                                              | Param Type | DataType                          | Required |
|-----------|------------------------------------------------------------------------------------------|------------|-----------------------------------|----------|
| type      | A valid inlineHookType name                                                              | Query      | Enum                              | FALSE    |

All responses return a list of Inline Hooks, filtered by the optional type query parameter

##### Request Example
{:.api .api-request .api-request-example}

~~~json
curl -v -X GET \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}/api/v1/inlineHooks"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[
	{
	    "id": "cali2j192cIE9VpHn0h7",
	    "status": "ACTIVE",
	    "name": "Test Inline Hook",
	    "type": "com.okta.tokens.transform",
	    "version": "1.0.0",
	    "channel": {
	        "type": "HTTP",
	        "version": "1.0.0",
	        "config": {
	            "uri": "https://my.test.url",
	            "headers": [
	                {
	                    "key": "X-Other-Header",
	                    "value": "some-other-value"
	                }
	            ],
	            "method": "POST",
	            "authScheme": {
	                "type": "HEADER",
	                "key": "Authorization",
	                "value": "******"
	            }
	        }
	    },
	    "created": "2018-12-05T00:35:20.000Z",
	    "lastUpdated": "2018-12-05T00:35:20.000Z"
	}
]
~~~

### Update Inline Hook

{% api_operation put /api/v1/inlineHooks/{inlineHookId}%}

#### Request Parameters

| Parameter | Description                                                                                    | Param Type | DataType                          | Required |
|-----------|------------------------------------------------------------------------------------------------|------------|-----------------------------------|----------|
| inlineHookId  | A valid Inline Hook id                                                                     | Path       | String                            | TRUE     |
| inlineHook    | A valid Inline Hooks                                                                       | Body       | Inline Hook Model                    | TRUE     |

The submitted Inline Hook will replace the existing version after passing validation. Refer to the above models to see
which properties are immutable.

#### Response Parameters

All responses return the updated Inline Hook

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X PUT \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
    "name" : "My Test Inline Hook",
    "type" : "com.okta.tokens.transform",
    "version" : "1.0.0",
    "channel" : {
        "type" : "HTTP",
        "version" : "1.0.0",
        "config" : {
            "uri" : "http://127.0.0.1:8080/inlineHook",
            "method" : "POST",
            "headers" : [
                {
                    "key" : "X-Other-Header",
                    "value" : "some-other-value"
                }
            ],
            "authScheme" : {
                "type" : "HEADER",
                "key" : "Authorization",
                "value" : "api-key"
            }
        }
    }
}' "https://{yourOktaDomain}/api/v1/inlineHooks"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
    "id": "calr0dvWvbMQJHZCM0g3",
    "status": "ACTIVE",
    "name" : "My Test Inline Hook",
    "type" : "com.okta.tokens.transform",
    "version" : "1.0.0",
    "channel" : {
        "type" : "HTTP",
        "version" : "1.0.0",
        "config" : {
            "uri" : "http://127.0.0.1:8080/inlineHook",
            "method" : "POST",
            "headers" : [
                {
                    "key" : "X-Other-Header",
                    "value" : "some-other-value"
                }
            ],
            "authScheme" : {
                "type" : "HEADER",
                "key" : "Authorization",
                "value" : "api-key"
            }
        }
    },
    "created": "2018-05-15T01:23:08.000Z",
    "lastUpdated": "2018-05-15T01:23:08.000Z"
}
~~~

### Delete Inline Hook

{% api_operation delete /api/v1/inlineHooks/{inelinHookId}%}

#### Request Parameters

| Parameter    | Description                                                                               | Param Type | DataType                          | Required |
|--------------|-------------------------------------------------------------------------------------------|------------|-----------------------------------|----------|
| inlineHookId | A valid Inline Hook id                                                                    | Path       | String                            | TRUE     |

Deletes the Inline Hook matching the provided inlineHook. Once deleted, this Inline Hook will be unrecoverable.
As a safety precaution, only Inline Hooks with a status of INACTIVE are eligible for deletion.

#### Response Parameters

All responses will return a 204 with no content

##### Request Example
{:.api .api-request .api-request-example}

~~~json
curl -v -X DELETE \
-H "Authorization: SSWS ${api_token}" \
"https://{yourOktaDomain}/api/v1/inlineHook/{inlineHookId}"
~~~

##### Response Example
{:.api .api-response .api-response-example}

204 with no content

### Execute Inline Hook

{% api_operation post /api/v1/inlineHooks/{inlineHookId}/execute%}

| Parameter | Description                                                                            | Param Type | DataType                          | Required |
|-----------|----------------------------------------------------------------------------------------|------------|-----------------------------------|----------|
| inlineHookId  | A valid Inline Hook id                                                                  | Path       | String                            | TRUE     |
| inlineHookType-specific input | JSON that matches the data contract of the linked inlineHookType       | Body       | JSON                              | TRUE     |

Executes the Inline Hook matching the provided inlineHookId using the request body as the input. This will send the provided
data through the Channel and return a response if it matches the correct data contract. Otherwise it will throw
an error.

Inline Hook execution will enforce a timeout of 3 seconds on all outbound requests and will retry once in the event of a
timeout or an error response from the remote system. If a successful response has not been received after that it will 
return a 400 error with more information about what failed.

Note that this execution endpoint is NOT tied to any other functionality in Okta and should only be used for testing purposes. 

#### Response Parameters

Successful responses will return the full response from the Inline Hook execution, which will match the data contract for
the given `inlineHookType` and version.

