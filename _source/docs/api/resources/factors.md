---
layout: docs_page
title: Factors (MFA)
redirect_from: "/docs/api/rest/factors.html"
---

* Will be replaced with the ToC
{:toc .list-unstyled .toc}


# Overview

The Okta Factors API provides operations to enroll, manage, and verify factors for multi-factor authentication (MFA).  It is optimized for both administrative and end-user account management, but may also be used verify a factor at any time on-demand.

The Factors API contains three types of operations.

 - **Factor Operations** &ndash; List factors and security questions.
 - **Factor Lifecycle Operations** &ndash; Enroll, activate, and reset factors.
 - **Factor Verification Operations** &ndash; Verify a factor

> This API is currently in **Early Access (EA)** status.

## Factor Model

Attribute     | Description                                                     | DataType                                                                       | MinLength | MaxLength | Nullable | Unique | Readonly
------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------ | --------- | --------- | -------- | ------ | --------
id            | unique key for factor                                           | String                                                                         |           |           | FALSE    | TRUE   | TRUE
factorType    | type of factor                                                  | [Factor Type](#factor-type)                                                    |           |           | FALSE    | TRUE   | TRUE
provider      | factor provider                                                 | [Provider Type](#Provider-Type)                                                |           |           | FALSE    | TRUE   | TRUE
status        | status of factor                                                | `NOT_SETUP`, `PENDING_ACTIVATION`, `ENROLLED`, `ACTIVE`, `INACTIVE`, `EXPIRED` |           |           | FALSE    | FALSE  | TRUE
created       | timestamp when factor was created                               | Date                                                                           |           |           | FALSE    | FALSE  | TRUE
lastUpdated   | timestamp when factor was last updated                          | Date                                                                           |           |           | FALSE    | FALSE  | TRUE
profile       | profile of a [supported factor](#supported-factors)             | [Factor Profile Object](#factor-profile-object)                                |           |           | TRUE     | FALSE  | FALSE
_links        | [discoverable resources](#links-object) related to the factor   | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06)                 |           |           | TRUE     | FALSE  | TRUE
_embedded     | [embedded resources](#embedded-object) related to the factor    | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06)                 |           |           | TRUE     | FALSE  | TRUE

> `id`, `created`, `lastUpdated`, `status`, `_links`, and `_embedded` are only available after a factor is enrolled.

### Factor Type

The following factor types are supported:

Factor Type           | Description
--------------------- | -----------
`push`                | Allows the end user to provide a second authentication factor by tapping an approval button 
`sms`                 | SMS
`token`               | Software or hardware one-time password [OTP](http://en.wikipedia.org/wiki/One-time_password) device
`token:software:totp` | Software [Time-based One-time Password (TOTP)](http://en.wikipedia.org/wiki/Time-based_One-time_Password_Algorithm)
`token:hardware`      | Hardware one-time password [OTP](http://en.wikipedia.org/wiki/One-time_password) device
`question`            | Additional security question

### Provider Type

The following providers are supported:

Provider   | Description
---------- | -----------------------------
`OKTA`     | Okta
`RSA`      | RSA SecurID Integration
`SYMANTEC` | Symantec VIP Integration
`GOOGLE`   | Google Integration

### Supported Factors

The following providers support the following factor types:

Provider   | Factor Type
---------- | -----------------------------
`OKTA`     | `push`
`OKTA`     | `question`
`OKTA`     | `sms`
`OKTA`     | `token:software:totp`
`GOOGLE`   | `token:software:totp`
`SYMANTEC` | `token`
`RSA`      | `token`

### Factor Profile Object

Profiles are specific to the [factor type](#factor-type)

#### Question Profile

Specifies the profile for a `question` factor

Attribute     | Description               | DataType  | MinLength | MaxLength | Nullable | Unique | Readonly
------------- | ------------------------- | --------- | --------- | --------- | -------- | -------| ----------
question      | unique key for question   | String    |           |           | FALSE    | TRUE   | TRUE
questionText  | display text for question | String    |           |           | FALSE    | FALSE  | TRUE
answer        | answer to question        | String    |           |           | TRUE     | FALSE  | FALSE

~~~ json
"profile": {
  "question": "favorite_art_piece",
  "questionText": "What is your favorite piece of art?"
}
~~~

#### SMS Profile

Specifies the profile for a `sms` factor

Attribute     | Description                     | DataType                                                        | MinLength | MaxLength | Nullable | Unique  | Readonly
------------- | -------------------------       | --------------------------------------------------------------- | --------- | --------- | -------- | ------- | ----------
phoneNumber   | phone number of mobile device   | String [E.164 formatted](http://en.wikipedia.org/wiki/E.164)    |           | 15        | FALSE    | TRUE    | FALSE

~~~ json
"profile": {
  "phoneNumber": "+1-555-415-1337"
}
~~~

E.164 numbers can have a maximum of fifteen digits and are usually written as follows: [+][country code][subscriber number including area code]. Phone numbers that are not formatted in E.164 may work, but it depends on the phone or handset that is being used as well as the carrier from which the call or SMS is being originated.

For example, to convert a US phone number (415 599 2671) to E.164 format, one would need to add the ‘+’ prefix and the country code (which is 1) in front of the number (+1 415 599 2671). In the UK and many other countries internationally, local dialing requires the addition of a 0 in front of the subscriber number. However, to use E.164 formatting, this 0 must be removed. A number such as 020 7183 8750 in the UK would be formatted as +44 20 7183 8750.

#### TOTP Profile

Specifies the profile for a `token:software:totp` factor

Attribute     | Description                     | DataType  | MinLength | MaxLength | Nullable | Unique  | Readonly
------------- | -------------------------       | --------- | --------- | --------- | -------- | ------- | ----------
credentialId  | unique id for instance          | String    |           |           | FALSE    | FALSE   | TRUE

~~~ json
"profile": {
  "credentialId": "isaac@example.org"
}
~~~

### Links Object

Specifies link relations (See [Web Linking](http://tools.ietf.org/html/rfc5988)) available for the current status of a factor using the [JSON Hypertext Application Language](http://tools.ietf.org/html/draft-kelly-json-hal-06) specification.  This object is used for dynamic discovery of related resources and lifecycle operations.

Link Relation Type | Description
------------------ | -----------
self               | The actual factor
activate           | [Lifecycle action](#activate-factor) to transition factor to `ACTIVE` status
deactivate         | [Lifecycle action](#deactivate-factor) to transition factor to `INACTIVE` status
questions          | List of questions for the `question` factor type

> The Links Object is **read-only**

## Embedded Resources

### TOTP Factor Activation Object

TOTP factors when activated have an embedded verification object which describes the [TOTP](http://tools.ietf.org/html/rfc6238) algorithm parameters.

Attribute     | Description                                       | DataType                                                       | MinLength | MaxLength | Nullable | Unique | Readonly
------------- | ------------------------------------------------- | -------------------------------------------------------------- | --------- | --------- | -------- | ------ | --------
timeStep      | time-step size for TOTP                           | String                                                         |           |           | FALSE    | FALSE  | TRUE
sharedSecret  | unique secret key for prover                      | String                                                         |           |           | FALSE    | FALSE  | TRUE
encoding      | encoding of `sharedSecret`                        | `base32` or `base64`                                           |           |           | FALSE    | FALSE  | TRUE
keyLength     | number of digits in an HOTP value                 | Number                                                         |           |           | FALSE    | FALSE  | TRUE
_links        | discoverable resources related to the activation  | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06) |           |           | TRUE     | FALSE  | TRUE

~~~ json
"activation": {
  "timeStep": 30,
  "sharedSecret": "HE64TMLL2IUZW2ZLB",
  "encoding": "base32",
  "keyLength": 6
}
~~~

### Factor Verify Result Object

Attribute     | Description                                       | DataType                                                       | MinLength | MaxLength | Nullable | Unique | Readonly
------------- | ------------------------------------------------- | -------------------------------------------------------------- | --------- | --------- | -------- | ------ | --------
factorResult  | result of factor verification                     | [Factor Result](#factor-result)                                |           |           | FALSE    | FALSE  | TRUE
factorMessage | optional display message for factor verification  | String                                                         |           |           | TRUE     | FALSE  | TRUE

#### Factor Result

Specifies the result status of a factor verification attempt

factorResult           | Description
---------------------- | -------------------------------------------------------------------------------------------------------------------------------
`SUCCESS`              | Factor was successfully verified
`CHALLENGE`            | Another verification is required
`WAITING`              | Factor verification has started but not yet completed (e.g user hasn't answered phone call yet)
`FAILED`               | Factor verification failed
`CANCELLED`            | Factor verification was canceled by user
`TIMEOUT`              | Unable to verify factor within the allowed time window
`TIME_WINDOW_EXCEEDED` | Factor was successfully verified but outside of the computed time window.  Another verification is required in current time window.
`PASSCODE_REPLAYED`    | Factor was previously verified within the same time window.  User must wait another time window and retry with a new verification.
`ERROR`                | Unexpected server error occurred verifying factor.


## Factor Operations

### Get Factor
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /api/v1/users/*:uid*/factors/*:fid*

Fetches a factor for the specified user.

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
uid          | `id` of user                                        | URL        | String   | TRUE     |
fid          | `id` of factor                                      | URL        | String   | TRUE     |

#### Response Parameters
{:.api .api-response .api-response-params}

[Factor](#factor-model)

#### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/factors/ufs2bysphxKODSZKWVCT"
~~~

#### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "sms2gt8gzgEBPUWBIFHN",
  "factorType": "sms",
  "provider": "OKTA",
  "status": "ACTIVE",
  "created": "2014-06-27T20:27:26.000Z",
  "lastUpdated": "2014-06-27T20:27:26.000Z",
  "profile": {
    "phoneNumber": "+1-555-415-1337"
  },
  "_links": {
    "verify": {
      "href": "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/factors/sms2gt8gzgEBPUWBIFHN/verify",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "self": {
      "href": "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/factors/sms2gt8gzgEBPUWBIFHN",
      "hints": {
        "allow": [
          "GET",
          "DELETE"
        ]
      }
    },
    "user": {
      "href": "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    }
  }
}
~~~

### List Enrolled Factors
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /api/v1/users/*:uid*/factors

Enumerates all the enrolled factors for the specified user.

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
uid          | `id` of user                                        | URL        | String   | TRUE     |

#### Response Parameters
{:.api .api-response .api-response-params}

Array of [Factors](#factor-model)

#### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/factors"
~~~

#### Response Example
{:.api .api-response .api-response-example}

~~~json
[
  {
    "id": "ufs2bysphxKODSZKWVCT",
    "factorType": "question",
    "provider": "OKTA",
    "status": "ACTIVE",
    "created": "2014-04-15T18:10:06.000Z",
    "lastUpdated": "2014-04-15T18:10:06.000Z",
    "profile": {
      "question": "favorite_art_piece",
      "questionText": "What is your favorite piece of art?"
    },
    "_links": {
      "questions": {
        "href": "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/factors/questions",
        "hints": {
          "allow": [
            "GET"
          ]
        }
      },
      "self": {
        "href": "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/factors/ufs2bysphxKODSZKWVCT",
        "hints": {
          "allow": [
            "GET",
            "DELETE"
          ]
        }
      },
      "user": {
        "href": "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG",
        "hints": {
          "allow": [
            "GET"
          ]
        }
      }
    }
  },
  {
    "id": "ostf2gsyictRQDSGTDZE",
    "factorType": "token:software:totp",
    "provider": "OKTA",
    "status": "PENDING_ACTIVATION",
    "created": "2014-06-27T20:27:33.000Z",
    "lastUpdated": "2014-06-27T20:27:33.000Z",
    "profile": {
      "credentialId": "isaac@example.org"
    },
    "_links": {
      "next": {
        "name": "activate",
        "href": "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/factors/ostf2gsyictRQDSGTDZE/lifecycle/activate",
        "hints": {
          "allow": [
            "POST"
          ]
        }
      },
      "self": {
        "href": "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/factors/ostf2gsyictRQDSGTDZE",
        "hints": {
          "allow": [
            "GET"
          ]
        }
      },
      "user": {
        "href": "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG",
        "hints": {
          "allow": [
            "GET"
          ]
        }
      }
    },
    "_embedded": {
      "activation": {
        "timeStep": 30,
        "sharedSecret": "HE64TMLL2IUZW2ZLB",
        "encoding": "base32",
        "keyLength": 16
      }
    }
  },
  {
    "id": "sms2gt8gzgEBPUWBIFHN",
    "factorType": "sms",
    "provider": "OKTA",
    "status": "ACTIVE",
    "created": "2014-06-27T20:27:26.000Z",
    "lastUpdated": "2014-06-27T20:27:26.000Z",
    "profile": {
      "phoneNumber": "+1-555-415-1337"
    },
    "_links": {
      "verify": {
        "href": "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/factors/sms2gt8gzgEBPUWBIFHN/verify",
        "hints": {
          "allow": [
            "POST"
          ]
        }
      },
      "self": {
        "href": "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/factors/sms2gt8gzgEBPUWBIFHN",
        "hints": {
          "allow": [
            "GET",
            "DELETE"
          ]
        }
      },
      "user": {
        "href": "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG",
        "hints": {
          "allow": [
            "GET"
          ]
        }
      }
    }
  }
]
~~~

### List Factors to Enroll
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /api/v1/users/*:uid*/factors/catalog

Enumerates all the [supported factors](#supported-factors) that can be enrolled for the specified user.

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
uid          | `id` of user                                        | URL        | String   | TRUE     |

#### Response Parameters
{:.api .api-response .api-response-params}

Array of [Factors](#factor-model)

#### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/factors/catalog"
~~~

#### Response Example
{:.api .api-response .api-response-example}

~~~json
[
  {
    "factorType": "question",
    "provider": "OKTA",
    "_links": {
      "questions": {
        "href": "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/factors/questions",
        "hints": {
          "allow": [
            "GET"
          ]
        }
      },
      "enroll": {
        "href": "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/factors",
        "hints": {
          "allow": [
            "POST"
          ]
        }
      }
    }
  },
  {
    "factorType": "token:software:totp",
    "provider": "OKTA",
    "_links": {
      "enroll": {
        "href": "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/factors",
        "hints": {
          "allow": [
            "POST"
          ]
        }
      }
    }
  },
  {
    "factorType": "token:software:totp",
    "provider": "GOOGLE",
    "_links": {
      "enroll": {
        "href": "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/factors",
        "hints": {
          "allow": [
            "POST"
          ]
        }
      }
    }
  },
  {
    "factorType": "sms",
    "provider": "OKTA",
    "_links": {
      "enroll": {
        "href": "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/factors",
        "hints": {
          "allow": [
            "POST"
          ]
        }
      }
    }
  },
  {
    "factorType": "token",
    "provider": "RSA",
    "_links": {
      "enroll": {
        "href": "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/factors",
        "hints": {
          "allow": [
            "POST"
          ]
        }
      }
    }
  },
  {
    "factorType": "token",
    "provider": "SYMANTEC",
    "_links": {
      "enroll": {
        "href": "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/factors",
        "hints": {
          "allow": [
            "POST"
          ]
        }
      }
    }
  }
]
~~~

### List Security Questions
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /api/v1/users/*:uid*/factors/questions

Enumerates all available security questions for a user's `question` factor.

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
uid          | `id` of user                                        | URL        | String   | TRUE     |

#### Response Parameters
{:.api .api-response .api-response-params}

Array of Questions

Attribute     | Description               | DataType  | MinLength | MaxLength | Nullable | Unique | Readonly
------------- | ------------------------- | --------- | --------- | --------- | -------- | -------| ----------
question      | unique key for question   | String    |           |           | FALSE    | TRUE   | TRUE
questionText  | display text for question | String    |           |           | FALSE    | FALSE  | TRUE

#### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X GET "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/factors/questions"
~~~

#### Response Example
{:.api .api-response .api-response-example}

~~~json
[
  {
    "question": "disliked_food",
    "questionText": "What is the food you least liked as a child?"
  },
  {
    "question": "name_of_first_plush_toy",
    "questionText": "What is the name of your first stuffed animal?"
  },
  {
    "question": "first_award",
    "questionText": "What did you earn your first medal or award for?"
  }
]
~~~

## Factor Lifecycle Operations

### Enroll Factor
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /api/v1/users/*:id*/factors

Enrolls a user with a supported [factor](#list-factors-to-enroll) for the specified user.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description      | Param Type  | DataType                | Required | Default
------------ | ---------------- | ----------- | ----------------------- | -------- | -------
id           | `id` of user     | URL         | String                  | TRUE     |
factor       | Factor           | Body        | [Factor](#factor-model) | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

All responses return the enrolled [Factor](#factor-model) with a status of either `PENDING_ACTIVATION` or `ACTIVE`.

> Some [factor types](#factor-types) require [activation](#activate-factor) to complete the enrollment process

#### Enroll User with Security Question
{:.api .api-operation}

Enrolls a user with the Okta `question` factor and [question profile](#question-profile).

> Security Question factor does not require activation and is `ACTIVE` after enrollment

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors
-d \
'{
  "factorType": "question",
  "provider": "OKTA",
  "profile": {
    "question": "disliked_food",
    "answer": "mayonnaise"
  }
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
  "id": "ufs1o01OTMGHLAJPVHDZ",
  "factorType": "question",
  "provider": "OKTA",
  "status": "ACTIVE",
  "created": "2014-08-05T22:58:49.000Z",
  "lastUpdated": "2014-08-05T22:58:49.000Z",
  "profile": {
    "question": "disliked_food",
    "questionText": "What is the food you least liked as a child?"
  },
  "_links": {
    "questions": {
      "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/questions",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    },
    "self": {
      "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/ufs1o01OTMGHLAJPVHDZ",
      "hints": {
        "allow": [
          "GET",
          "DELETE"
        ]
      }
    },
    "user": {
      "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    }
  }
}
~~~

#### Enroll User with Okta SMS Factor
{:.api .api-operation}

Enrolls a user with the Okta `sms` factor and a [SMS profile](#sms-profile).  A text message with an OTP is sent to the device during enrollment and must be [activated](#activate-sms-factor) by following the `activate` link relation to complete the enrollment process.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/factors
-d \
'{
  "factorType": "sms",
  "provider": "OKTA",
  "profile": {
    "phoneNumber": "+1-555-415-1337"
  }
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
  "id": "mbl1nz9JHJGHWRKMTLHP",
  "factorType": "sms",
  "provider": "OKTA",
  "status": "PENDING_ACTIVATION",
  "created": "2014-08-05T20:59:49.000Z",
  "lastUpdated": "2014-08-06T03:59:49.000Z",
  "profile": {
    "phoneNumber": "+1-555-415-1337"
  },
  "_links": {
    "activate": {
      "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/mbl1nz9JHJGHWRKMTLHP/lifecycle/activate",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "resend": [
      {
        "name": "sms",
        "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/mbl1nz9JHJGHWRKMTLHP/resend",
        "hints": {
          "allow": [
            "POST"
          ]
        }
      }
    ],
    "self": {
      "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/mbl1nz9JHJGHWRKMTLHP",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    },
    "user": {
      "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    }
  }
}
~~~

#### Enroll User with Okta Verify Factor
{:.api .api-operation}

Enrolls a user with the Okta `token:software:totp` factor.  The factor must be [activated](#activate-totp-factor) after enrollment by following the `activate` link relation to complete the enrollment process.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors
-d \
'{
  "factorType": "token:software:totp",
  "provider": "OKTA"
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
  "id": "ostf1fmaMGJLMNGNLIVG",
  "factorType": "token:software:totp",
  "provider": "OKTA",
  "status": "PENDING_ACTIVATION",
  "created": "2014-07-16T16:13:56.000Z",
  "lastUpdated": "2014-07-16T16:13:56.000Z",
  "profile": {
    "credentialId": "isaac@example.org"
  },
  "_links": {
    "activate": {
      "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/ostf1fmaMGJLMNGNLIVG/lifecycle/activate",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "self": {
      "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/ostf1fmaMGJLMNGNLIVG",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    },
    "user": {
      "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    }
  },
  "_embedded": {
    "activation": {
      "timeStep": 30,
      "sharedSecret": "JBTWGV22G4ZGKV3N",
      "encoding": "base32",
      "keyLength": 6
    },
    "_links": {
      "qrcode": {
        "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/ostf1fmaMGJLMNGNLIVG/qr/00fukNElRS_Tz6k-CFhg3pH4KO2dj2guhmaapXWbc4",
        "type": "image/png"
      }
    }
  }
}
~~~

#### Enroll User with Google Authenticator Factor
{:.api .api-operation}

Enrolls a user with the Google `token:software:totp` factor.  The factor must be [activated](#activate-totp-factor) after enrollment by following the `activate` link relation to complete the enrollment process.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors
-d \
'{
  "factorType": "token:software:totp",
  "provider": "GOOGLE"
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
  "id": "ostf1fmaMGJLMNGNLIVG",
  "factorType": "token:software:totp",
  "provider": "GOOGLE",
  "status": "PENDING_ACTIVATION",
  "created": "2014-07-16T16:13:56.000Z",
  "lastUpdated": "2014-07-16T16:13:56.000Z",
  "profile": {
    "credentialId": "isaac@example.org"
  },
  "_links": {
    "activate": {
      "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/ostf1fmaMGJLMNGNLIVG/lifecycle/activate",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "self": {
      "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/ostf1fmaMGJLMNGNLIVG",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    },
    "user": {
      "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    }
  },
  "_embedded": {
    "activation": {
      "timeStep": 30,
      "sharedSecret": "JBTWGV22G4ZGKV3N",
      "encoding": "base32",
      "keyLength": 16,
      "_links": {
        "qrcode": {
          "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/ostf1fmaMGJLMNGNLIVG/qr/00fukNElRS_Tz6k-CFhg3pH4KO2dj2guhmaapXWbc4",
          "type": "image/png"
        }
      }
    }
  }
}
~~~

#### Enroll User with an Okta Verify Push Factor
{:.api .api-operation}

Enrolls a user with the Okta verify `push` factor. The factor must be [activated](#activate-push-factor) after enrollment by following the `activate` link relation to complete the enrollment process.

##### Request Example
{:.api .api-request .api-request-example}

~~~ json
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/factors
-d \
'{
  "factorType": "push",
  "provider": "OKTA",
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
  "id": "mbl1nz9JHJGHWRKMTLHP",
  "factorType": "push",
  "provider": "OKTA",
  "status": "PENDING_ACTIVATION",
  "created": "2015-04-05T20:59:49.000Z",
  "lastUpdated": "2015-04-06T03:59:49.000Z",
  "profile": {
      "credentialId": "nag@test.com",
      "keys": [
        {
          "kty": "PKIX",
          "use": "sig",
          "kid": "default",
          "x5c": [
              null
            ]
          }
        ]
  },
  "_links": {
    "activate": {
      "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/mbl1nz9JHJGHWRKMTLHP/lifecycle/activate",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "self": {
      "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/mbl1nz9JHJGHWRKMTLHP",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    },
    "user": {
      "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    },
    "qrcode": {
      "href": "https://your-domain.okta.com/api/v1/users/00ugti3kwafWJBRIY0g3/factors/opfh52xcuft3J4uZc0g3/qr/00CnAHABTzHh9hjEij9qcteMrOoeFLK6evHruUH7p9",
      "type": "image/png"
    }
  },
  "_embedded": {
    "activation": {
      "links": null,
      "deviceActivationToken": "I17JQoOqbYOPH_lMWK5F"
    }
  }
}
~~~



### Activate Factor
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /users/*:uid*/factors/*:fid*/lifecycle/activate</span>

The `sms` and `token:software:totp` [factor types](#factor-types) require activation to complete the enrollment process.

- [Activate TOTP Factor](#activate-totp-factor)
- [Activate SMS Factor](#activate-sms-factor)
- [Activate Okta Verify Push Factor](#activate-push-factor)

#### Activate TOTP Factor
{:.api .api-operation}

Activates a `token:software:totp` factor by verifying the OTP.

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
uid          | `id` of user                                        | URL        | String   | TRUE     |
fid          | `id` of factor returned from enrollment             | URL        | String   | TRUE     |
passCode     | OTP generated by device                             | Body       | String   | TRUE     |

#### Response Parameters
{:.api .api-response .api-response-params}

If the passcode is correct you will receive the [Factor](#factor-model) with an `ACTIVE` status.

If the passcode is invalid you will receive a `403 Forbidden` status code with the following error:

~~~ json
{
  "errorCode": "E0000068",
  "errorSummary": "Invalid Passcode/Answer",
  "errorLink": "E0000068",
  "errorId": "oaei_IfXcpnTHit_YEKGInpFw",
  "errorCauses": [
    {
      "errorSummary": "Your passcode doesn't match our records. Please try again."
    }
  ]
}
~~~

#### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/ostf1fmaMGJLMNGNLIVG/lifecycle/activate
-d \
'{
  "passCode": "123456"
}'
~~~

#### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
  "id": "ostf1fmaMGJLMNGNLIVG",
  "factorType": "token:software:totp",
  "provider": "OKTA",
  "status": "ACTIVE",
  "created": "2014-07-16T16:13:56.000Z",
  "lastUpdated": "2014-08-06T00:31:07.000Z",
  "profile": {
    "credentialId": "isaac@example.org"
  },
  "_links": {
    "verify": {
      "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/ostf1fmaMGJLMNGNLIVG/verify",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "self": {
      "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/ostf1fmaMGJLMNGNLIVG",
      "hints": {
        "allow": [
          "GET",
          "DELETE"
        ]
      }
    },
    "user": {
      "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    }
  }
}
~~~

#### Activate SMS Factor
{:.api .api-operation}

Activates a `sms` factor by verifying the OTP.  The request/response is identical to [activating a TOTP factor](#activate-totp-factor).

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
uid          | `id` of user                                        | URL        | String   | TRUE     |
fid          | `id` of factor returned from enrollment             | URL        | String   | TRUE     |
passCode     | OTP sent to mobile device                           | Body       | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

If the passcode is correct you will receive the [Factor](#factor-model) with an `ACTIVE` status.

If the passcode is invalid you will receive a `403 Forbidden` status code with the following error:

~~~ json
{
  "errorCode": "E0000068",
  "errorSummary": "Invalid Passcode/Answer",
  "errorLink": "E0000068",
  "errorId": "oaei_IfXcpnTHit_YEKGInpFw",
  "errorCauses": [
    {
      "errorSummary": "Your passcode doesn't match our records. Please try again."
    }
  ]
}
~~~

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/sms1o51EADOTFXHHBXBP/lifecycle/activate
-d \
'{
  "passCode": "123456"
}'
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
  "id": "sms1o51EADOTFXHHBXBP",
  "factorType": "sms",
  "provider": "OKTA",
  "status": "ACTIVE",
  "created": "2014-08-06T16:56:31.000Z",
  "lastUpdated": "2014-08-06T16:56:31.000Z",
  "profile": {
    "phoneNumber": "+1-555-415-1337"
  },
  "_links": {
    "verify": {
      "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/sms1o51EADOTFXHHBXBP/verify",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "self": {
      "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/sms1o51EADOTFXHHBXBP",
      "hints": {
        "allow": [
          "GET",
          "DELETE"
        ]
      }
    },
    "user": {
      "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    }
  }
}
~~~

#### Activate Okta Verify Push Factor
{:.api .api-operation}

Poll the device to verify activation for a `push` factor is complete.  There are three response examples showing pending activation, successful activation, and a timed out request.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
uid          | `id` of user                                        | URL        | String   | TRUE     |
fid          | `id` of factor returned from enrollment             | URL        | String   | TRUE     |


#### Response Parameters
{:.api .api-response .api-response-params}

Parameter    | Description                                         | Param Type | DataType                                            | Required | Default
------------ | --------------------------------------------------- | ---------- | --------------------------------------------------- | -------- | -------
factorResult | result of verification result                       | Body       | [Factor Verify Result](#factor-verify-result-object) | TRUE     |


#### Response Example
{:.api .api-response .api-response-example}

In this example, the a response from the user is pending and has not timed out.

~~~ json
{
  "expiresAt": "2015-04-01T15:57:32.000Z",
  "factorResult": "WAITING",
  "_links": {
    "poll": {
      "href": "https://your-domain.okta.com/api/v1/users/00ugti3kwafWJBRIY0g3/factors/opfh52xcuft3J4uZc0g3/lifecycle/activate",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },  
    "qrcode": {
      "href": "https://your-domain.okta.com/api/v1/users/00ugti3kwafWJBRIY0g3/factors/opfh52xcuft3J4uZc0g3/qr/00fukNElRS_Tz6k-CFhg3pH4KO2dj2guhmaapXWbc4",
      "type": "image/png"
    },
    "send": [
      {
        "name": "email",
        "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/mbl1nz9JHJGHWRKMTLHP/lifecycle/activate/email",
        "hints": {
          "allow": [
            "POST"
          ]
        }
      },
      {
        "name": "sms",
        "href": "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/mbl1nz9JHJGHWRKMTLHP/lifecycle/activate/sms",
        "hints": {
          "allow": [
            "POST"
          ]
        }
      }              
    ]
  }
}
~~~

#### Response Example
{:.api .api-response .api-response-example}

In this example, the user has responded and activation is complete.

~~~ json
{
  "id": "opfh52xcuft3J4uZc0g3",
  "factorType": "push",
  "provider": "OKTA",
  "status": "ACTIVE",
  "created": "2015-04-01T15:57:32.000Z",
  "lastUpdated": "2015-04-01T16:04:56.000Z",
  "profile": {
    "platform": "IOS",
    "deviceType": "SMARTPHONE",
    "name": "brock iPhone",
    "version": "8.1"
  },
  "_links": {
    "self": {
      "href": "https://your-domain.okta.com/api/v1/users/00ugti3kwafWJBRIY0g3/factors/opfh52xcuft3J4uZc0g3",
      "hints": {
        "allow": [
          "GET",
          "DELETE"
        ]
      }
    },
    "verify": {
      "href": "https://your-domain.okta.com/api/v1/users/00ugti3kwafWJBRIY0g3/factors/opfh52xcuft3J4uZc0g3/verify",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },    
    "user": {
      "href": "https://your-domain.okta.com/api/v1/users/00ugti3kwafWJBRIY0g3",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    }
  }
}
~~~

#### Response Example
{:.api .api-response .api-response-example}

In this example, the user has not responded and the request timed out.

~~~ json
{
  "factorResult": "TIMEOUT",
  "_links": {
    "activate": {
      "href": "https://your-domain.okta.com/api/v1/users/00ugti3kwafWJBRIY0g3/factors/opfh52xcuft3J4uZc0g3/lifecycle/activate",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    }
  }
}
~~~


### Reset Factor
{:.api .api-operation}

<span class="api-uri-template api-uri-delete"><span class="api-label">DELETE</span> /api/v1/users/*:uid*/factors/*:fid*

Resets a factor for the specified user.

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
uid          | `id` of user                                        | URL        | String   | TRUE     |
fid          | `id` of the factor to reset                         | URL        | String   | TRUE     |

#### Response Parameters
{:.api .api-response .api-response-params}

`204 No Content`

#### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X DELETE "https://your-domain.okta.com/api/v1/users/00u6fud33CXDPBXULRNG/factors"
~~~

#### Response Example
{:.api .api-response .api-response-example}

`204 No Content`

## Factor Verification Operations

### Verify Security Question Factor
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /users/*:uid*/factors/*:fid*/verify</span>

Verifies an answer to a `question` factor.

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
uid          | `id` of user                                        | URL        | String   | TRUE     |
fid          | `id` of factor                                      | URL        | String   | TRUE     |
answer       | answer to security question                         | Body       | String   | TRUE     |

#### Response Parameters
{:.api .api-response .api-response-params}

Parameter    | Description                                         | Param Type | DataType                                            | Required | Default
------------ | --------------------------------------------------- | ---------- | --------------------------------------------------- | -------- | -------
result       | verification result                                 | Body       | [Factor Verify Result](#factor-verify-result-object) | TRUE     |

If the `answer` is invalid you will receive a `403 Forbidden` status code with the following error:

~~~ json
{
  "errorCode": "E0000068",
  "errorSummary": "Invalid Passcode/Answer",
  "errorLink": "E0000068",
  "errorId": "oaei_IfXcpnTHit_YEKGInpFw",
  "errorCauses": [
    {
      "errorSummary": "Your answer doesn't match our records. Please try again."
    }
  ]
}
~~~

#### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/ufs1pe3ISGKGPYKXRBKK/verify
-d \
'{
  "answer": "mayonnaise"
}'
~~~

#### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
  "factorResult": "SUCCESS"
}
~~~


### Verify SMS Factor
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /users/*:uid*/factors/*:fid*/verify</span>

Verifies an OTP for a `sms` factor.

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
uid          | `id` of user                                        | URL        | String   | TRUE     |
fid          | `id` of factor                                      | URL        | String   | TRUE     |
passCode     | OTP sent to device                                  | Body       | String   | FALSE    |

> If you omit `passCode` in the request a new OTP will be sent to the device, otherwise the request will attempt to verify the `passCode`

#### Response Parameters
{:.api .api-response .api-response-params}

Parameter    | Description                                         | Param Type | DataType                                            | Required | Default
------------ | --------------------------------------------------- | ---------- | --------------------------------------------------- | -------- | -------
result       | verification result                                 | Body       | [Factor Verify Result](#factor-verify-result-object) | TRUE     |

If the passcode is invalid you will receive a `403 Forbidden` status code with the following error:

~~~ json
{
  "errorCode": "E0000068",
  "errorSummary": "Invalid Passcode/Answer",
  "errorLink": "E0000068",
  "errorId": "oaei_IfXcpnTHit_YEKGInpFw",
  "errorCauses": [
    {
      "errorSummary": "Your passcode doesn't match our records. Please try again."
    }
  ]
}
~~~

#### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/ostf17zuKEUMYQAQGCOV/verify
-d \
'{
  "passCode": "123456"
}'
~~~

#### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
  "factorResult": "SUCCESS"
}
~~~

### Verify TOTP Factor
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /users/*:uid*/factors/*:fid*/verify</span>

Verifies an OTP for a `token:software:totp` factor.

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
uid          | `id` of user                                        | URL        | String   | TRUE     |
fid          | `id` of factor                                      | URL        | String   | TRUE     |
passCode     | OTP generated by device                             | Body       | String   | TRUE     |

#### Response Parameters
{:.api .api-response .api-response-params}

Parameter    | Description                                         | Param Type | DataType                                            | Required | Default
------------ | --------------------------------------------------- | ---------- | --------------------------------------------------- | -------- | -------
result       | verification result                                 | Body       | [Factor Verify Result](#factor-verify-result-object) | TRUE     |

If the passcode is invalid you will receive a `403 Forbidden` status code with the following error:

~~~ json
{
  "errorCode": "E0000068",
  "errorSummary": "Invalid Passcode/Answer",
  "errorLink": "E0000068",
  "errorId": "oaei_IfXcpnTHit_YEKGInpFw",
  "errorCauses": [
    {
      "errorSummary": "Your passcode doesn't match our records. Please try again."
    }
  ]
}
~~~

#### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -H "Authorization: SSWS yourtoken" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-X POST "https://your-domain.okta.com/api/v1/users/00u15s1KDETTQMQYABRL/factors/ostf17zuKEUMYQAQGCOV/verify
-d \
'{
  "passCode": "123456"
}'
~~~

#### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
  "factorResult": "SUCCESS"
}
~~~

### Verify an Okta Verify Push Factor
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /users/*:uid*/factors/*:fid*/verify</span>

Verifies a `push` factor. First, send a request to the device. When successfully sent, you are in a waiting state. Then, poll for user action.

##### Start the Verify Transaction

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
uid          | `id` of user                                        | URL        | String   | TRUE     |
fid          | `id` of factor                                      | URL        | String   | TRUE     |


#### Response Parameters
{:.api .api-response .api-response-params}

Parameter    | Description                                         | Param Type | DataType                                            | Required | Default
------------ | --------------------------------------------------- | ---------- | --------------------------------------------------- | -------- | -------
factorResult | result of verification result                       | Body       | [Factor Verify Result](#factor-verify-result-object) | TRUE     |


#### Response Example
{:.api .api-response .api-response-example}

~~~ json
{
    "factorResult": "TIMEOUT",
    "_links": {
        "verify": {
            "href": "https://your-domain.okta.com/api/v1/users/00ugti3kwafWJBRIY0g3/factors/opfh52xcuft3J4uZc0g3/verify",
            "hints": {
                "allow": [
                    "POST"
                ]
            }
        },
        "factor": {
            "href": "https://your-domain.okta.com/api/v1/users/00ugti3kwafWJBRIY0g3/factors/opfh52xcuft3J4uZc0g3",
            "hints": {
                "allow": [
                    "get",
                    "DELETE"
                ]
            }
        }
    }
}
~~~

##### Poll the Verify Transaction

### Verify Transaction
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /api/v1/users/*:uid*/factors/*:fid*/transactions/*:tid*/verify

Polls the verify transaction. There are four response examples showing a waiting state, a successful verification, a timeout, and a rejected verification.

#### Request Parameters
{:.api .api-request .api-request-params}

Parameter    | Description                                         | Param Type | DataType | Required | Default
------------ | --------------------------------------------------- | ---------- | -------- | -------- | -------
uid          | `id` of user                                        | URL        | String   | TRUE     |
fid          | `id` of factor                                      | URL        | String   | TRUE     |
tid          | `id` of transaction                                 | URL        | String   | TRUE     |

The <em>tid</em> is available in a returned link.

#### Response Parameters
{:.api .api-response .api-response-params}

Parameter    | Description                                         | Param Type | DataType                                            | Required | Default
------------ | --------------------------------------------------- | ---------- | --------------------------------------------------- | -------- | -------
factorResult | result of verification result                       | Body       | [Factor Verify Result](#factor-verify-result-object) | TRUE     |


#### Response Example
{:.api .api-response .api-response-example}

##### Waiting State

~~~ json
{
  "expiresAt": "2015-04-01T15:57:32.000Z",
  "factorResult": "WAITING",
  "_links": {
    "poll": {
      "href": "https://your-domain.okta.com/api/v1/users/00ugti3kwafWJBRIY0g3/factors/opfh52xcuft3J4uZc0g3/transactions/mst1eiHghhPxf0yhp0g",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    },
    "cancel": {
      "href": "https://your-domain.okta.com/api/v1/users/00ugti3kwafWJBRIY0g3/factors/opfh52xcuft3J4uZc0g3/transactions/mst1eiHghhPxf0yhp0g",
      "hints": {
        "allow": [
          "DELETE"
        ]
      }
    }
  }
}
~~~

#### Response Example
{:.api .api-response .api-response-example}

##### Approved

~~~ json
{
  "factorResult": "SUCCESS"
}
~~~

#### Response Example
{:.api .api-response .api-response-example}

##### Timeout

~~~ json
{
  "factorResult": "TIMEOUT",
  "_links": {
    "verify": {
      "href": "https://your-domain.okta.com/api/v1/users/00ugti3kwafWJBRIY0g3/factors/opfh52xcuft3J4uZc0g3/verify",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "factor": {
      "href": "https://your-domain.okta.com/api/v1/users/00ugti3kwafWJBRIY0g3/factors/opfh52xcuft3J4uZc0g3",
      "hints": {
        "allow": [
          "GET",
          "DELETE"
        ]
      }
    }
  }
}
~~~

#### Response Example
{:.api .api-response .api-response-example}

##### Rejected

~~~ json
{
  "factorResult": "REJECTED",
  "_links": {
    "verify": {
      "href": "https://your-domain.okta.com/api/v1/users/00ugti3kwafWJBRIY0g3/factors/opfh52xcuft3J4uZc0g3/verify",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "factor": {
      "href": "https://your-domain.okta.com/api/v1/users/00ugti3kwafWJBRIY0g3/factors/opfh52xcuft3J4uZc0g3",
      "hints": {
        "allow": [
          "GET",
          "DELETE"
        ]
      }
    }
  }
}
~~~


