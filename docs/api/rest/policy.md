---
layout: docs_page
title: Policy
---

* Will be replaced with the ToC
{:toc .list-unstyled .toc}

# Overview

The Okta Policy API enables you to peform policy and rule operations. These operation apply to various policies including Okta Signon.

This API supports the following **policy operations**:

* Get all policies of a specific type
* Create, read, update, and delete a policy
* Activate and deactivate a policy

This API supports the following **rule operations**:

* Get all rules for a policy
* Create, read, update, and delete a rule for a policy
* Activate and deactivate a rule

# Policies

## Policy Model and Defaults

### Default Policies

There is always a default policy created for each type of policy. The default policy applies to any users for whom other policies in the org do not apply. This ensures that there is always a policy to apply to a user in all situations. 

 - A default policy is required and cannot be deleted.

 - The default policy is always the last policy in the priority order. Any added policies of this type have higher priority than the default policy. 

 - The default policy always has one default rule that cannot be deleted. It is always the last rule in the priority order. If you add rules to the default policy, they have a higher priority than the default rule. For information on default rules, see [Rules Model and Defaults](#rules-model-and-defaults).

 - The `system` attribute determines whether a policy is created by a system or by a user.

### Policy Model

Policies and rules are ordered numerically by priority. This priority determines the order in which they are searched for a context match. The highest priority policy has a priorityOrder of 1.

For example, assume the following conditions are in effect.

- Rule A has priority 1 and applies to RADIUS VPN scenarios.
- Rule B has priority 2 and applies to ON_NETWORK scenarios.

Because Rule A has a higher priority, even though requests are coming from ON_NETWORK due to VPN,
the action in Rule A is taken, and Rule B is not evaluated.

### Policy Object

The Policy model defines several attributes:

Parameter | Description | Data Type | Required | Default
| --- | --- | --- | --- 
id | Identifier for the policy | String | No | Assigned 
type | Policy type –  must be `OKTA_SIGN_ON` | String | Yes | 
name | Name for the policy | String | Yes | 
description | Description for the policy | String | No | Null 
priorityOrder | Priority for the policy | Int | No | Last / Lowest Priority 
system | Whether or not the policy is the default | Boolean | No | false 
status | Status of the policy: ACTIVE or INACTIVE | String | No | "ACTIVE" 
created | Timestamp when the policy was created | Date | No | Assigned 
lastUpdated | Timestamp when the policy was last modified | Date | No | Assigned

### People Object

The people condition identifies users and groups that are used together. For policies, you can only include a group.

Parameter | Description | Data Type | Required | Default
| --- | --- | --- | --- 
groups | The group condition | Group Condition | No | Include Everyone 
users  | The user condition  | User Condition  | No | Empty

### Group Condition Object

Parameter | Description | Data Type | Required | Default
| --- | --- | --- | --- 
include	| The groups to be included |	Collection of String	| No |	Everyone Group (if exclude is empty)
exclude	| The groups to be excluded	| Collection of String	| No	| Empty


### User Condition Object

Parameter | Description | Data Type | Required | Default
| --- | --- | --- | --- 
include	| The users to be included	| Collection of String	| No	| Empty
exclude	| The users to be excluded	| Collection of String	| No	| Empty

### Links Object

Specifies link relations (See [Web Linking](http://tools.ietf.org/html/rfc5988)) available for the current policy.  The Links Object is used for dynamic discovery of related resources.  The Links Object is **read-only**.

Specified link 

Link Relation Type     | Description
---------------------- | -----------
self	| The policy or rule
activate	| Action to activate a policy or rule
deactivate	| Action to deactivate a policy or rule
rules	| Rules objects for a policy only
policy	| Policy object for a rule only

## Policy Operations

### Get All Policies by Type
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET </span> /api/v1/policies?type={type}</span>

#### Request Parameters

The policy type described in the [Policy Object](#policy-object) is required.

##### Request Example
{:.api .api-request .api-request-example}

GET api/v1/policies?type=OKTA_SIGN_ON

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
        "type": "OKTA_SIGN_ON",
        "id": "00oewwEGGIFFQTUCFCVJ",
        "status": "ACTIVE",
        "name": "Legacy Policy",
        "description": "The legacy policy contains any existing settings from the legacy Okta Sign On Policy",
        "priorityOrder": 1,
        "system": false,
        "conditions": {
            "people": {
                "groups": {
                    "include": [
                        "00oewwEGGIFFQTUCFCVJ"
                    ]
                }
            }
        },
        "created": "2014-10-09T00:06:07.000Z",
        "lastUpdated": "2014-10-09T00:06:07.000Z",
        "_links": {
            "self": {
                "href": "https:/your-domain.okta.com/api/v1/policies/00oewwEGGIFFQTUCFCVJ",
                "hints": {
                    "allow": [
                        "GET",
                        "PUT",
                        "DELETE"
                    ]
                }
            },
            "deactivate": {
                "href": "https:/your-domain.okta.com/api/v1/policies/00oewwEGGIFFQTUCFCVJ/lifecycle/deactivate",
                "hints": {
                    "allow": [
                        "POST"
                    ]
                }
            },
            "rules": {
                "href": "https:/your-domain.okta.com/api/v1/policies/00oewwEGGIFFQTUCFCVJ/rules",
                "hints": {
                    "allow": [
                        "GET",
                        "POST"
                    ]
                }
            }
        }
    },
    {
        "type": "OKTA_SIGN_ON",
        "id": "11oewwEGGIFFQTUCFCVJ",
        "status": "ACTIVE",
        "name": "Default Policy",
        "description": "The default policy applies in all situations if no other policy applies.",
        "priorityOrder": 2,
        "system": true,
        "conditions": {
            "people": {
                "groups": {
                    "include": [
                        "01oewwEGGIFFQTUCFCVJ"
                    ]
                }
            }
        },
        "created": "2014-10-09T00:06:06.000Z",
        "lastUpdated": "2014-10-09T00:06:07.000Z",
        "_links": {
            "self": {
                "href": "https:/your-domain.okta.com/api/v1/policies/01oewwEGGIFFQTUCFCVJ",
                "hints": {
                    "allow": [
                        "GET",
                        "PUT"
                    ]
                }
            },
            "rules": {
                "href": "https:/your-domain.okta.com/api/v1/policies/01oewwEGGIFFQTUCFCVJ/rules",
                "hints": {
                    "allow": [
                        "GET",
                        "POST"
                    ]
                }
            }
        }
    }
~~~


### Get a Policy
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET </span> /api/v1/policies/{id}</span>

Gets an existing policy.

#### Request Parameters

The policy id described in the [Policy Object](#policy-object) is required.

##### Request Example
{:.api .api-request .api-request-example}

GET api/v1/policies/00oewwEGGIFFQTUCFCVJ

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
    "type": "OKTA_SIGN_ON",
    "id": "00oewwEGGIFFQTUCFCVJ",
    "status": "ACTIVE",
    "name": "Legacy Policy",
    "description": "The legacy policy contains any existing settings from the legacy Okta Sign On Policy",
    "priorityOrder": 1,
    "system": false,
    "conditions": {
        "people": {
            "groups": {
                "include": [
                    "00oewwEGGIFFQTUCFCVJ"
                ]
            }
        }
    },
    "created": "2014-10-09T00:06:07.000Z",
    "lastUpdated": "2014-10-09T00:06:07.000Z",
    "_links": {
        "self": {
            "href": "https:/your-domain.okta.com/api/v1/policies/00oewwEGGIFFQTUCFCVJ",
            "hints": {
                "allow": [
                    "GET",
                    "PUT",
                    "DELETE"
                ]
            }
        },
        "deactivate": {
            "href": "https:/your-domain.okta.com/api/v1/policies/00oewwEGGIFFQTUCFCVJ/lifecycle/deactivate",
            "hints": {
                "allow": [
                    "POST"
                ]
            }
        },
        "rules": {
            "href": "https:/your-domain.okta.com/api/v1/policies/00oewwEGGIFFQTUCFCVJ/rules",
            "hints": {
                "allow": [
                    "GET",
                    "POST"
                ]
            }
        }
    }
}
~~~

### Create a Policy
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST </span> /api/v1/policies</span>

Creates a new policy with no rules.

#### Request Parameters

The policy name, description, and type described in the [Policy Object](#policy-object) are required. The policy name cannot be the same as the name of an existing policy.

#### Request Example

~~~json
{
  "name": "New Okta Sign On Policy",
  "description": "API created policy",
  "type": "OKTA_SIGN_ON"
}
~~~

##### Response Example
{:.api .api-response .api-response-example}


~~~json
{
    "type": "OKTA_SIGN_ON",
    "id": "00oewwEGGIFFQTUCFCVJ",
    "status": "ACTIVE",
    "name": "New Okta Sign On Policy",
    "description": "API created policy",
    "priorityOrder": 2,
    "system": false,
    "conditions": {
        "people": {
            "groups": {
                "include": [
                    "00oewwEGGIFFQTUCFCVJ"
                ]
            }
        }
    },
    "created": "2014-10-13T22:53:12.000Z",
    "lastUpdated": "2014-10-13T22:53:12.000Z",
    "_links": {
        "self": {
            "href": "https:/your-domain.okta.com/api/v1/policies/00oewwEGGIFFQTUCFCVJ",
            "hints": {
                "allow": [
                    "GET",
                    "PUT",
                    "DELETE"
                ]
            }
        },
        "deactivate": {
            "href": "https:/your-domain.okta.com/api/v1/policies/00oewwEGGIFFQTUCFCVJ/lifecycle/deactivate",
            "hints": {
                "allow": [
                    "POST"
                ]
            }
        },
        "rules": {
            "href": "https:/your-domain.okta.com/api/v1/policies/00oewwEGGIFFQTUCFCVJ/rules",
            "hints": {
                "allow": [
                    "GET",
                    "POST"
                ]
            }
        }
    }
}
~~~


### Update a Policy
{:.api .api-operation}

<span class="api-uri-template api-uri-put"><span class="api-label">PUT </span> /api/v1/policies/{id}</span>

Updates an existing policy.

#### Request Parameters

The policy id described in the [Policy Object](#policy-object) is required.

##### Request Example
{:.api .api-request .api-request-example}

The example below shows the required items. You can add other items in the [Policy Object](#policy-object) as desired.

**Note:** This is a strict PUT. Any missing item is set to its default value. For example if `priorityOrder` is missing from the policy body, the item moves to the lowest priority order in the policy. If the group assignment is missing, the policy is reassigned to the Everyone group.

~~~json
{
  "name": "My Updated Policy",
  "description": "This is my policy",
  "type": "OKTA_SIGN_ON"
}
~~~

### Response Parameters

~~~json
{
    "type": "OKTA_SIGN_ON",
    "id": "00oewwEGGIFFQTUCFCVJ",
    "status": "ACTIVE",
    "name": "My Updated Policy",
    "description": "This is my policy",
    "priorityOrder": 2,
    "system": false,
    "conditions": {
        "people": {
            "groups": {
                "include": [
                    "00g6fud2wSIIWCLSPYVR"
                ]
            }
        }
    },
    "created": "2014-10-13T22:53:12.000Z",
    "lastUpdated": "2014-10-13T23:55:46.000Z",
    "_links": {
        "self": {
            "href": "https:/your-domain.okta.com/api/v1/policies/00oewwEGGIFFQTUCFCVJ",
            "hints": {
                "allow": [
                    "GET",
                    "PUT",
                    "DELETE"
                ]
            }
        },
        "deactivate": {
            "href": "https:/your-domain.okta.com/api/v1/policies/00oewwEGGIFFQTUCFCVJ/lifecycle/deactivate",
            "hints": {
                "allow": [
                    "POST"
                ]
            }
        },
        "rules": {
            "href": "https:/your-domain.okta.com/api/v1/policies/00oewwEGGIFFQTUCFCVJ/rules",
            "hints": {
                "allow": [
                    "GET",
                    "POST"
                ]
            }
        }
    }
}
~~~~

### Delete Policy
{:.api .api-operation}

<span class="api-uri-template api-uri-delete"><span class="api-label">Delete </span> /api/v1/policies/{id}</span>

Deletes a policy and all rules associated with it.

#### Request Parameters

The policy id described in the [Policy Object](#policy-object) is required.

### Response Parameters

None. Status 204 No Content is returned when the deletion is successful.

### Activate a Policy
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST </span>/api/v1/policies/{id}/lifecycle/activate</span>

Activates the specified policy.

#### Request Parameters

The policy id described in the [Policy Object](#policy-object) is required.

#### Response Parameters

None. Status 204 No Content is returned when the activation is successful.

### Deactivate a Policy
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST </span>/api/v1/policies/{id}/lifecycle/deactivate</span>

Deactivates the specified policy.

#### Request Parameters

The policy id described in the [Policy Object](#policy-object) is required.

#### Response Parameters

None. Status 204 No Content is returned when the deactivation is successful.

# Rules

## Rules Model and Defaults

### Default Rules

 - Only the default policy contains a default rule. The default rule cannot be edited or deleted.

 - The default rule is required and always is the last rule in the priority order. If you add rules to the default policy, they have a higher priority than the default rule.

 - The `system` attribute determines whether a rule is created by a system or by a user. The default rule is the only rule that has this attribute.


### Rules Object

The Rules model defines several attributes:

Parameter | Description | Data Type | Required | Default
| --- | --- | --- | --- 
id | Identifier for the rule | String | No | Assigned 
type | Rule type –  must be `SIGN_ON` | String | Yes | 
name | Name for the rule | String | Yes | 
status | Status of the rule: `ACTIVE` or `INACTIVE` | String | No | `ACTIVE` 
priorityOrder | Priority for the rule | Int | No | Last / Lowest Priority 
system | Whether or not the rule is the default | Boolean | No | false 
created | Timestamp when the rule was created | Date | No | Assigned 
lastUpdated | Timestamp when the rule was last modified | Date | No | Assigned

### Conditions

Rule conditions include the people, user, and group conditions from the policy model in addition to:

**Network Condition Body**

Specifies a network segment.

Parameter |	Description	| Data Type	|  Required	|  Default
| --- | --- | --- | --- 
connection	|  `ANYWHERE`, `ON_NETWORK`, or `OFF_NETWORK` | 	String	| No	|  Empty

**AuthContext Condition Body**

Specifies an authentication entry point.

Parameter | Description | DataType  |  Required |  Default
| --- | --- | --- | --- 
authType	| `ANY` or `RADIUS`	| String	| No	| Empty

### Actions

**Signon Action**

Parameter | Description | Data Type  |  Required |  Default
| --- | --- | --- | --- 
access	| `ALLOW` or `DENY`	| String	| YES	
requireFactor	| `true` or `false`	| Boolean	| NO	| `false`
factorPromptMode	| `DEVICE`, `SESSION` or `ALWAYS`	| String	| When requireFactor = `true`	
factorLifetime	| How long until factor times out	| Int	| When factorPromptMode = `SESSION`	

## Rules Operations

### Get Policy Rules
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET </span> /api/v1/policies/{policyId}/rules</span>

Retrieves all rules for a specified policy. 

#### Request Parameters

The policy id described in the [Policy Object](#policy-object) is required.

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
        "type": "SIGN_ON",
        "id": "00oewwEGGIFFQTUCFRUL",
        "status": "ACTIVE",
        "name": "Legacy Rule",
        "priorityOrder": 1,
        "created": "2014-10-09T00:06:07.000Z",
        "lastUpdated": "2014-10-09T00:06:07.000Z",
        "system": false,
        "conditions": {
            "people": {
                "users": {
                    "exclude": []
                }
            },
            "network": {
                "connection": "ANYWHERE"
            },
            "authContext": {
                "authType": "ANY"
            }
        },
        "actions": {
            "signon": {
                "access": "ALLOW",
                "requireFactor": true,
                "factorPromptMode": "ALWAYS"
            }
        }
    }
~~~

### Get a Rule
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET </span> /api/v1/policies/{policyId}/rules/{ruleId}</span>

Retrieves the specified rule for a specified policy. The returned `id` is the rule id.

#### Request Parameters

The policy id described in the [Policy Object](#policy-object) and the rule id described in the [Rules Object](#rules-object) are both required.

#### Response Parameters

~~~json
{
    "type": "SIGN_ON",
    "id": "0pr2saywjsXMDPGASRRH",
    "status": "ACTIVE",
    "name": "Legacy Rule",
    "priorityOrder": 1,
    "created": "2014-10-09T00:06:07.000Z",
    "lastUpdated": "2014-10-09T00:06:07.000Z",
    "system": false,
    "conditions": {
        "people": {
            "users": {
                "exclude": []
            }
        },
        "network": {
            "connection": "ANYWHERE"
        },
        "authContext": {
            "authType": "ANY"
        }
    },
    "actions": {
        "signon": {
            "access": "ALLOW",
            "requireFactor": true,
            "factorPromptMode": "ALWAYS"
        }
    }
}
~~~

### Create Rule 
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST </span> /api/v1/policies/{policyId}/rules</span>

Creates a new rule for a specified policy. The returned `id` is the rule id.

#### Request Parameters

The policy id described in the [Policy Object](#policy-object) is required.

##### Request Example
{:.api .api-resquest .api-request-example}

~~~json
 {
  "name": "mySignOnPolicyRule",
  "type": "SIGN_ON",
  "conditions": {
    "network": {
      "connection": "OFF_NETWORK"
    },
    "authContext": {
      "authType": "RADIUS"
    }
  },
  "actions": {
    "signon": {
      "access": "ALLOW",
      "requireFactor": true,
      "factorPromptMode": "SESSION",
      "factorLifetime": 1
    }
  }
}
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
    "type": "SIGN_ON",
    "id": "0pr2saywjsXMDPGASRRH",
    "status": "ACTIVE",
    "name": "mySignOnPolicyRule",
    "priorityOrder": 2,
    "created": "2014-10-14T17:17:42.000Z",
    "lastUpdated": "2014-10-14T17:17:42.000Z",
    "system": false,
    "conditions": {
        "network": {
            "connection": "OFF_NETWORK"
        },
        "authContext": {
            "authType": "RADIUS"
        }
    },
    "actions": {
        "signon": {
            "access": "ALLOW",
            "requireFactor": true,
            "factorPromptMode": "SESSION",
            "factorLifetime": 1
        }
    }
} 
~~~

### Update a Rule
{:.api .api-operation}

<span class="api-uri-template api-uri-put"><span class="api-label">PUT </span> /api/v1/policies/{policyId}/rules/{ruleId}</span>

Updates the specified rule for the specified policy. 

#### Request Parameters

The policy id described in the [Policy Object](#policy-object) and the rule id described in the [Rules Object](#rules-object) are both required.

##### Request Example
{:.api .api-resquest .api-request-example}

**Note:** This is a strict PUT. Any missing item is set to its default value. For example if `priorityOrder` is missing, the item moves to the lowest priority order in the policy. 

~~~json
{
  "name": "mySignOnPolicyRule",
  "type": "SIGN_ON",
  "conditions": {
    "people": {
      "users": {
        "exclude": []
      }
    },
    "network": {
      "connection": "OFF_NETWORK"
    },
    "authContext": {
      "authType": "RADIUS"
    }
  },
  "actions": {
    "signon": {
      "access": "ALLOW",
      "requireFactor": false,
      "factorPromptMode": "SESSION",
      "factorLifetime": 1
    }
  }
}
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
    "type": "SIGN_ON",
    "id": "0pr2t4by8wWYZMLJMGEM",
    "status": "ACTIVE",
    "name": "mySignOnPolicyRule",
    "priorityOrder": 2,
    "created": "2014-10-14T17:17:42.000Z",
    "lastUpdated": "2014-10-14T20:51:24.000Z",
    "system": false,
    "conditions": {
        "people": {
            "users": {
                "exclude": []
            }
        },
        "network": {
            "connection": "OFF_NETWORK"
        },
        "authContext": {
            "authType": "RADIUS"
        }
    },
    "actions": {
        "signon": {
            "access": "ALLOW",
            "requireFactor": false
        }
    }
}
~~~

### Activate a Rule
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST </span> /api/v1/policies/{policyId}/rules/{ruleId}/lifecycle/activate</span>

Activates the specified rule for the specified policy. 

#### Request Parameters

The policy id described in the [Policy Object](#policy-object) and the rule id described in the [Rules Object](#rules-object) are both required.

#### Response Parameters

None. Status 204 No Content is returned when the activation is successful.

### Deactivate a Rule
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST </span> /api/v1/policies/{policyId}/rules/{ruleId}/lifecycle/deactivate</span>

Deactivates the specified rule for the specified policy. 

#### Request Parameters

The policy id described in the [Policy Object](#policy-object) and the rule id described in the [Rules Object](#rules-object) are both required.

#### Response Parameters

None. Status 204 No Content is returned when the deactivation is successful.

### Delete a Rule
{:.api .api-operation}

<span class="api-uri-template api-uri-delete"><span class="api-label">DELETE </span> /api/v1/policies/{policyId}/rules/{ruleId}</span>

Deletes the specified rule for the specified policy. 

#### Request Parameters

TThe policy id described in the [Policy Object](#policy-object) and the rule id described in the [Rules Object](#rules-object) are both required.

#### Response Parameters

None. Status 204 No Content is returned when the deletion is successful.

