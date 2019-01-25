---
layout: docs_page
title: Inline Hooks
category: management
excerpt: The Inline Hooks APIs provides a CRUD and execution interface for Inline Hooks.
---

# Inline Hooks API 

{% api_lifecycle ea %}

The Inline Hooks API provides a CRUD interface for Inline Hooks in the system as well as a way to test Inline Hooks outside of 
their normal uses in the product to assess performance and compatibility.

## Inline Hook Operations

### Create Inline Hooks

{% api_operation post /api/v1/inlineHooks%}

Adds a new Inline Hook to your Organization in an ACTIVE status

#### Request Parameters

| Parameter | Description                                                                            | Param Type | DataType                                | Required |
|-----------|----------------------------------------------------------------------------------------|------------|-----------------------------------------|----------|
| Inline Hook  | A valid Inline Hook                                                                 | Body       |[Inline Hook Object](#inline-hook-object)| TRUE     |

#### Response Parameters

All responses return the created Inline Hook

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
the given inlineHookType and version.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '
{
    "eventTypeVersion": "1.0",
    "cloudEventVersion": "0.1",
    "contentType": "application/json",
    "eventType": "com.okta.tokens.transform",
    "source": "http://oauth.okta1.com:1802/app/oauth_samlsp_1/exk2i7aJ1R9v631PM0g4/sso/saml", // the SAML IDP URL generates the assertion
    "eventId": "IxyGfzHoQOKmtVUgEXwOoA",
    "eventTime": "2018-06-26T22:26:07.000Z",
    "data": {
        "context": {
            // information about the original HTTP request
            "request": {
                "id": "reqLmhh_4uUTGG2QxwSQtw",
                "method": "GET",
                "url": {
                    "value": "http://oauth.okta1.com:1802/app/oauth_samlsp_1/exk2i1R9v631PM0g4/sso/saml"
                },
                "ipAddress": "127.0.0.1"
            },
            // information about the session, please refer to https://developer.okta.com/docs/api/resources/sessions#session-properties
            "session": {
                "id": "102Cwvn6kJhAwgLdlVag",
                "userId": "00u12j7vjWm60gxixix4",
                "login": "admin@test.com",
                "createdAt": "2018-06-26T22:15:25.000Z",
                "expiresAt": "2018-06-27T00:26:07.000Z",
                "status": "ACTIVE",
                "lastPasswordVerification": "2018-06-26T22:15:25.000Z",
                "amr": [
                    "PASSWORD"
                ],
                "idp": {
                    "id": "00o12ich7X7pNrCO70g4",
                    "type": "OKTA"
                },
                "mfaActive": false
            },
            // information about the user, please refer to https://developer.okta.com/docs/api/resources/authn#user-object
            "user": {
                "id": "00u12j7vjWt0T9um60g4",
                "passwordChanged": "2018-05-03T20:01:35.000Z",
                "profile": {
                    "login": "admin@test.com",
                    "firstName": "admin",
                    "lastName": "oauth",
                    "locale": "en",
                    "timeZone": "America/Los_Angeles"
                },
                "_links": {
                    "groups": {
                        "href": "http://oauth.okta1.com:1802/00u12j7vjWt0T9um60g4/groups"
                    },
                    "factors": {
                        "href": "http://oauth.okta1.com:1802/api/v1/users/00u12j7vjWt0T9um60g4/factors"
                    }
                }
            },
            // information about the authentication protocol, please refer to https://developer.okta.com/docs/api/resources/authn#authentication-object
            "authentication": {
                // the SAML authn request
                "request": {
                    "id": "_1cf5518445236d11eae4",
                    "version": "2.0",
                    "issuerInstant": "2018-06-26T22:26:06.000Z",
                    "destination": "http://oauth.okta1.com:1802/app/oauth_samlsp_1/exk2i7aJ1R9v631PM0g4/sso/saml",
                    "providerName": "Simple SAML Service Provider",
                    "forceAuthn": false,
                    "passive": false,
                    "issuer": "urn:example:sp",
                    "assertionConsumerServiceURL": "http://localhost:7070/saml/sso",
                    "protocolBinding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect",
                    "nameIdPolicy": {
                        "format": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
                        "allowCreate": true
                    },
                    "requestedAuthnContext": {
                        "comparison": "exact",
                        "authnContextClassRefs": [
                            "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport"
                        ]
                    }
                },
                "protocol": "SAML2.0",
                "issuer": {
                    "id": "0oa2i7brpuFcaE81T0g4",
                    "name": "SAML SP",
                    "uri": "http://www.okta.com/exk2i7aJ1R9v631PM0g4"
                }
            }
        },
        "tokens": {
            // the SAML assertion will be returned to the SP
            "assertion": {
                "subject": {
                    "nameId": "admin@test.com",
                    "format": "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
                    "confirmation": {
                        "method": "urn:oasis:names:tc:SAML:2.0:cm:bearer",
                        "data": {
                            "inResponseTo": "_1cf5518445236d11eae4",
                            "recipient": "http://localhost:7070/saml/sso"
                        }
                    }
                },
                "authentication": {
                    "sessionIndex": "_1cf5518445236d11eae4",
                    "authnContext": {
                        "authnContextClassRef": "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport"
                    }
                },
                "conditions": {
                    "audienceRestrictions": [
                        "urn:example:sp"
                    ]
                },
                // the AttributeStatement
                "claims": {
                    "email": {
                        "attributes": {
                            "NameFormat": "urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified"
                        },
                        "attributeValues": [
                            {
                                "attributes": {
                                    "xsi:type": "xs:string"
                                },
                                "value": "admin@test.com"
                            }
                        ]
                    },
                    "trust-groups": {
                        "attributes": {
                            "NameFormat": "urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified"
                        },
                        "attributeValues": [
                            {
                                "attributes": {
                                    "xsi:type": "xs:string"
                                },
                                "value": "Groups.contains(\"0oa2yp4BGz8oSYxjM0g4\", \"Admin\", 100)"
                            }
                        ]
                    },
                    "filtered-groups": {
                        "attributes": {
                            "NameFormat": "urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified"
                        },
                        "attributeValues": [
                            {
                                "attributes": {
                                    "xsi:type": "xs:string"
                                },
                                "value": ""
                            }
                        ]
                    }
                },
                "lifetime": {
                    "expiration": 300 // SAML assertion returned to SP will be valid for 300 seconds
                }
            }
        }
    }
}
' "https://{yourOktaDomain}/api/v1/inlineHooks/{inlineHookId}/execute"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json

{
  [{
    "type": "com.okta.tokens.assertion.patch",
      "value":
        [{
          "op": "add",
          "path": "/claims/externalData", // your claim name
          "value":
          {
            "attributes":
              {
                "NameFormat": "urn:oasis:names:tc:SAML:2.0:attrname-format:basic"
              },
              "attributeValues":
                [{
                  "attributes":
                    {
                      "xsi:type": "xs:string"
                    },
                  "value": "NOT_STORED_IN_OKTA" // your claim value
                }]
            }
          },
          {
            "op": "replace",
            "path": "/subject/nameId",
            "value": "notjohn@okta.com"
          }],
      "debugContext": 
      {
        "stuff": "debug content"
      }
	[}
};

~~~

### Inline Hook Object

| Property        | Description                                              | DataType        | Nullable | Unique | ReadOnly | MinLength | MaxLength | Validation |
|-----------------|----------------------------------------------------------|-----------------|----------|--------|----------|-----------|-----------|------------|
| id              | Unique key for the Inline Hook                           | String          | FALSE    | TRUE   | TRUE     |           |           |            |
| status          | Status of the Inline Hook, INACTIVE will block execution | Enum            | FALSE    | FALSE  | FALSE    |           |           | One of ACTIVE, INACTIVE |
| name            | Display name for Inline Hook                             | String          | FALSE    | TRUE   | FALSE    | 1         | 255       | |
| type            | inlineHookType for the Inline Hook                       | inlineHookType  | FALSE    | FALSE  | TRUE     |           |           | Immutable after Inline Hook creation |
| version         | Version of the Channel                                   | Integer         | FALSE    | FALSE  | TRUE     |           |           | Must match a valid version number |
| channel         | Channel for the Inline Hook                              | Channel         | FALSE    | FALSE  | FALSE    |           |           | Validation is determined by the specific Channel |
| created         | Date of Inline Hook creation                             | Date | TRUE | FALSE | TRUE | | | |
| lastUpdated     | Date of Inline Hook update                               | Date | TRUE | FALSE | TRUE | | | |
{:.table .table-word-break} 

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
    }
    "created": "2018-12-05T00:35:20.000Z",
    "lastUpdated": "2018-12-05T00:35:20.000Z"
}
~~~