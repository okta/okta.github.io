---
layout: docs_page
title: Policy
beta: true
redirect_from: "/docs/getting_started/policy.html"
---

> This API is currently in **Early Access (EA)** status.

# Policy API

The Okta Policy API enables an Administrator to perform policy and policy rule operations.  The policy framework is used by Okta to control rules and settings that govern, among other things, user session lifetime, whether multi-factor authentication is required when logging in, what MFA factors may be employed, password complexity requirements, and what types of self-service operations are permitted under various circumstances.

Policy settings for a particular policy type, such as Sign On Policy, consist of one or more Policy objects, each of which contains one or more Policy Rules.  Policies and rules contain conditions that determine whether they are applicable to a particular user at a particular time.

The policy API supports the following **policy operations**:

* Get all policies of a specific type
* Create, read, update, and delete a policy
* Activate and deactivate a policy

The policy API supports the following **rule operations**:

* Get all rules for a policy
* Create, read, update, and delete a rule for a policy
* Activate and deactivate a rule

## Policies

### Policy Evaluation

When a policy needs to be retrieved for a particular user, for example when the user attempts to log in to Okta, or when the user initiates a self-service operation, then a policy evaluation takes place.
During policy evaluation each policy of the appropriate type is considered in turn, in the order indicated by the policy priority.   Each of the conditions associated with the policy is evaluated.  If one or more of the conditions cannot be met, then the next policy in the list is considered.  If the conditions can be met, then each of the rules associated with the policy is considered in turn, in the order specified by the rule priority.  Each of the conditions associated with a given rule is evaluated.  If all of the conditions associated with a rule are met, then the settings contained in the rule and in the associated policy are applied to the user.  If none of the policy rules have conditions that can be met, then the next policy in the list is considered.

Policies that have no rules are not considered during evaluation, and will never be applied.

### Policy Types
Different policy types control settings for different operations.  All policy types share a common framework, message structure and API, but have different policy settings and rule data.  The data structures specific to each policy type are discussed in the various sections below.


<a href="#OktaSignOnPolicy">Okta Sign On Policy</a>

<a href="#OktaMFAPolicy">Okta MFA Policy</a>

<a href="#GroupPasswordPolicy">Password Policy</a>

### Policy Priority and Defaults

### Default Policies

There is always a default policy created for each type of policy. The default policy applies to any users for whom other policies in the Okta org do not apply. This ensures that there is always a policy to apply to a user in all situations.

 - A default policy is required and cannot be deleted.
 - The default policy is always the last policy in the priority order. Any added policies of this type have higher priority than the default policy.
 - The default policy always has one default rule that cannot be deleted. It is always the last rule in the priority order. If you add rules to the default policy, they have a higher priority than the default rule. For information on default rules, see [Rules Model and Defaults](#rules-model-and-defaults).
 - The `system` attribute determines whether a policy is created by a system or by a user.

### Policy Priorities

Policies and are ordered numerically by priority. This priority determines the order in which they are evaluated for a context match. The highest priority policy has a `priority` of 1.

For example, assume the following policies exist.

- Policy A has priority 1 and applies to members of the "Administrators" group.
- Policy B has priority 2 and applies to members of the "Everyone" group.

When policy is evaluated for a user, policy "A" will be evaluated first.  If the user is a member of the "Administrators" group then the rules associated with policy "A" will be evaluated.   If a match is found then the policy settings will be applied.
If the user is not a member of teh "Administrators" group, then policy B would be evaluated.

<!-- ### Policy JSON Example

~~~json
{
    [ADD UPDATED JSON HERE]
}
~~~ -->

### Policy Object
{: #PolicyObject }

The Policy model defines several attributes:

Parameter | Description | Data Type | Required | Default
| --- | --- | --- | ---
id | Identifier of the policy | String | No | Assigned
type | Policy type | Specifies the type of the policy, e.g. `OKTA_SIGN_ON` or `MFA_ENROLL` | Yes | 
name | Name of the policy | String | Yes | 
system | This is set to 'true' on system policies, which cannot be deleted. | Boolean | No | false
description | Description of the policy | String | No | Null
priority | Priority of the policy | Int | No | Last / Lowest Priority
status | Status of the policy: ACTIVE or INACTIVE | String | No | "ACTIVE"
conditions | Conditions for policy | <a href="#PolicyConditionsObject">Conditions Object</a> | No | 
settings | Settings for policy | <a href="#PolicySettingsObject">Policy Settings Object</a> | No | 
created | Timestamp when the policy was created | Date | No | Assigned
lastUpdated | Timestamp when the policy was last modified | Date | No | Assigned
_links | Hyperlinks | <a href="#LinksObject">Links Object</a> | No | 


### Policy Settings Object
{: #PolicySettingsObject }

The policy settings object contains the policy level settings for the particular policy type.  Not all policy types have policy level settings.  For example, in Password Policy the settings object contains, among other items, the password complexity settings.   In Sign On policy, on the other hand, there are no policy level settings; all of the policy data is contained in the rules.  Each policy type section explains the settings objects specific to that type.


### Conditions Object
{: #PolicyConditionsObject }

The Conditions Object(s) specify the conditions that must be met during policy evaluation in order to apply the policy in question.   All policy conditions, as well as conditions for at least one rule must be met in order to apply the settings specified in the policy and the associated rule.  Policies and rules may contain different conditions depending on the policy type.  The conditions which can be used with a particular policy depends on the policy type.
See <a href="#Conditions">conditions</a>


### Links Object
{: #LinksObject }

Specifies link relations (See [Web Linking](http://tools.ietf.org/html/rfc5988)) available for the current policy.  The Links Object is used for dynamic discovery of related resources.  The Links Object is **read-only**.

Parameter | Description | Data Type | Required | Default
| --- | --- | --- | ---
self | The policy or rule | String | Yes | 
activate | Action to activate a policy or rule | String | Yes | 
deactivate | Action to deactivate a policy or rule | String | Yes | 
rules | Rules objects for a policy only | String | Yes | 
policy | Policy object for a rule only | String | Yes | 

## Rules
Each policy may contain one or more rules.  Rules, like policies contain conditions, which must be satisfied in order for the rule to be applied.  

### Rule Priority and Defaults

### Default Rules

 - Only the default policy contains a default rule. The default rule cannot be edited or deleted.
 - The default rule is required and always is the last rule in the priority order. If you add rules to the default policy, they have a higher priority than the default rule.
 - The `system` attribute determines whether a rule is created by a system or by a user. The default rule is the only rule that has this attribute.
 
### Rule Priority

Like policies, rules have a priority which governs the order in which they are considered during evaluation. The highest priority rule has a `priority` of 1.
For example if a particular policy had two rules, "A" and "B" as below.

- Rule A has priority 1 and applies to RADIUS VPN scenarios.
- Rule B has priority 2 and applies to ON_NETWORK scenarios.

If a request came in from the Radius endpoint but the request was on network then because Rule A has a higher priority, even though requests are coming from ON_NETWORK,
the action in Rule A would be taken, and Rule B is not evaluated.

<!-- ### Rules Message Example

~~~json
{
    [ADD UPDATED JSON HERE]
}
~~~ -->

### Rules Object
{: #RulesObject }

The Rules model defines several attributes:

Parameter | Description | Data Type | Required | Default
| --- | --- | --- | ---
id | Identifier of the rule | String | No | Assigned
type | Rule type | `OKTA_SIGN_ON` or `MFA_ENROLL` | Yes | 
status | Status of the rule: `ACTIVE` or `INACTIVE` | String | No | ACTIVE
priority | Priority of the rule | Integer | No | Last / Lowest Priority
system | This is set to 'true' on system rules, which cannot be deleted. | Boolean | No | false
created | Timestamp when the rule was created | Date | No | Assigned
lastUpdated | Timestamp when the rule was last modified | Date | No | Assigned
conditions | Conditions for rule | <a href="#RuleConditionsObject">Conditions Object</a> | No | 
actions | Actions for rule | <a href="#RulesActionsObject">Rules Actions Objects</a> | No | 

### Actions Objects
{: #RulesActionsObject }

Just as policies contains settings, rules contain "Actions", which typically specify actions to be taken, or operations that may be allowed, if the rule conditions are satisfied.  For example, in Password Policy rule actions govern whether or not self-service operations such as reset password or unlock are permitted.   Just as different policy types have different settings, rules have different actions depending on the type of the policy they belong to.

### Conditions Object
{: #RuleConditionsObject }

The Conditions Object(s) specify the conditions that must be met during policy evaluation in order to apply the rule in question.   All policy conditions, as well as conditions for at least one rule must be met in order to apply the settings specified in the policy and the associated rule.  Policies and rules may contain different conditions depending on the policy type.  The conditions which can be used with a particular policy depends on the policy type.
See <a href="#Conditions">conditions</a>

### Links Object
{: #LinksObject }

Specifies link relations (See [Web Linking](http://tools.ietf.org/html/rfc5988)) available for the current rule.  The Links Object is used for dynamic discovery of related resources.  The Links Object is **read-only**.

Parameter | Description | Data Type | Required | Default
| --- | --- | --- | ---
self | The policy or rule | String | Yes | 
activate | Action to activate a policy or rule | String | Yes | 
deactivate | Action to deactivate a policy or rule | String | Yes | 

### Conditions
{: #Conditions }
 
#### People Condition Object
{: #PeopleObject }

The people condition identifies users and groups that are used together. For policies, you can only include a group.

Parameter | Description | Data Type | Required | Default
| --- | --- | --- | ---
groups | The group condition | String | Yes | 
users | The user condition | String | Yes | 


#### User Condition Object
{: #UserConditionObject }


Parameter | Description | Data Type | Required | Default
| --- | --- | --- | ---
include | The users to be included | Array | Yes | 
exclude | The users to be excluded | Array | Yes | 


#### Group Condition Object
{: #GroupConditionObject }

Parameter | Description | Data Type | Required | Default
| --- | --- | --- | ---
include | The groups to be included | Array | Yes | 
exclude | The groups to be excluded | Array | Yes | 

#### AuthContext Condition Object
{: #AuthContextConditionObject }

Specifies an authentication entry point.

Parameter | Description | Data Type | Required | Default
| --- | --- | --- | ---
authType |  | `ANY` or `RADIUS` | No | 


#### Network Condition Object
{: #NetworkConditionObject }

Specifies a network segment.

Parameter | Description | Data Type | Required | Default
| --- | --- | --- | ---
connection |  | `ANYWHERE`, `ON_NETWORK` or `OFF_NETWORK` | No | 


#### People Condition Object
{: #PeopleConditionObject }

Parameter | Description | Data Type | Required | Default
| --- | --- | --- | ---
users |  | <a href="#UserConditionObject">User Condition Object</a> | No | 

<!-- #### Authentication Provider Condition Object

[THIS SECTION TBD] -->

## Policy API Operations

### Get a Policy
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET </span> /api/v1/policies/<em>:policyId</em></span>

#### Request Parameters

The policy ID described in the [Policy Object](#policy-object) is required.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/policies/{policyId}"
~~~

##### Response Types
{:.api .api-response .api-response-example}

HTTP 200: 
<a href="#PolicyObject">Policy Object</a>

### Get a Policy with Rules
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET </span> /api/v1/policies/<em>:policyId</em>?expand=rules</span>

#### Request Parameters

* The policy ID described in the [Policy Object](#policy-object) is required.
* The `expand=rules` query parameter returns up to twenty rules for the specified policy. If the policy has more than 20 rules, this request returns an error.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/policies/{policyId}?expand=rules"
~~~

##### Response Types
{:.api .api-response .api-response-example}

HTTP 200: 
<a href="#PolicyObject">Policy Object</a>

### Get All Policies by Type
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET </span> /api/v1/policies?type=<em>:type</em></span>

#### Request Parameters

The policy ID described in the [Policy Object](#policy-object) is required.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/policies?type={type}"
~~~

##### Response Types
{:.api .api-response .api-response-example}

HTTP 200: 
<a href="#PolicyObject">Policy Object</a>
HTTP 204: 
<a href="#PolicyObject">Policy Object</a>

### Delete Policy
{:.api .api-operation}

<span class="api-uri-template api-uri-delete"><span class="api-label">DELETE </span> /api/v1/policies/<em>:policyId</em></span>

#### Request Parameters

The policy ID described in the [Policy Object](#policy-object) is required.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/policies/{policyId}"
~~~

##### Response Types
{:.api .api-response .api-response-example}

HTTP 204: 
*No Content*

### Update a Policy
{:.api .api-operation}

<span class="api-uri-template api-uri-put"><span class="api-label">PUT </span> /api/v1/policies/<em>:policyId</em></span>

#### Request Parameters

The policy ID described in the [Policy Object](#policy-object) is required.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X PUT \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "name": "Example",
  "description": "This is an example policy",
  "conditions": {
    "people": {
      "groups": {
        "include": [
            "00gab0CDEFGHIJKLMNOP"
        ]
      }
    }
  }
}' \
"https://${org}.okta.com/api/v1/policies/{policyId}"
~~~

##### Response Types
{:.api .api-response .api-response-example}

HTTP 200: 
<a href="#PolicyObject">Policy Object</a>

### Create a Policy
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST </span> /api/v1/policies</span>

#### Request Parameters

The policy ID described in the [Policy Object](#policy-object) is required.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
    "type": "OKTA_SIGN_ON",
    "name": "Corporate Policy",
    "description": "Standard policy for every employee",
    "system": false,
    "conditions": {
        "people": {
            "groups": {
                "include": [
                    "00gab0CDEFGHIJKLMNOP"
                ]
            }
        }
    }
}' \
"https://${org}.okta.com/api/v1/policies"
~~~

##### Response Types
{:.api .api-response .api-response-example}

HTTP 204: 
<a href="#PolicyObject">Policy Object</a>

### Activate a Policy
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST </span> /api/v1/policies/<em>:policyId</em>/lifecycle/activate</span>

#### Request Parameters

The policy id described in the [Policy Object](#policy-object) is required.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/policies/{policyId}/lifecycle/activate"
~~~

##### Response Types
{:.api .api-response .api-response-example}

HTTP 204: 
*No Content is returned when the activation is successful.*

### Deactivate a Policy
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST </span> /api/v1/policies/<em>:policyId</em>/lifecycle/deactivate</span>

#### Request Parameters

The policy ID described in the [Policy Object](#policy-object) is required.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/policies/{policyId}/lifecycle/deactivate"
~~~

##### Response Types
{:.api .api-response .api-response-example}

HTTP 200: 
*No Content is returned when the deactivation is successful.*

## Rules Operations

### Get Policy Rules
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET </span> /api/v1/policies/<em>:policyId</em>/rules</span>

#### Request Parameters

The policy ID described in the [Policy Object](#policy-object) is required.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/policies/{policyId}/rules"
~~~

##### Response Types
{:.api .api-response .api-response-example}

HTTP 200: 
<a href="#RulesObject">Rules Object</a>

### Create a rule
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST </span> /api/v1/policies/<em>:policyId</em>/rules</span>

#### Request Parameters

The policy ID described in the [Policy Object](#policy-object) is required.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
    "type": "SIGN_ON",
    "name": "Deny",
    "conditions": {
        "network": {
            "connection": "ANYWHERE"
        },
        "authContext": {
            "authType": "ANY"
        }
    },
    "actions": {
        "signon": {
            "access": "DENY",
            "requireFactor": false
        }
    }
}' \
"https://${org}.okta.com/api/v1/policies/{policyId}/rules"
~~~

##### Response Types
{:.api .api-response .api-response-example}

HTTP 200: 
<a href="#RulesObject">Rules Object</a>

### Delete a rule
{:.api .api-operation}

<span class="api-uri-template api-uri-delete"><span class="api-label">DELETE </span> /api/v1/policies/<em>:policyId</em>/rules/<em>:ruleId</em></span>

#### Request Parameters

The policy ID described in the [Policy Object](#policy-object) is required.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/policies/{policyId}/rules/{ruleId}"
~~~

##### Response Types
{:.api .api-response .api-response-example}

HTTP 204: 
*No Content*

### Get a rule
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET </span> /api/v1/policies/<em>:policyId</em>/rules/<em>:ruleId</em></span>

#### Request Parameters

The policy ID described in the [Policy Object](#policy-object) is required.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/policies/{policyId}/rules/{ruleId}"
~~~

##### Response Types
{:.api .api-response .api-response-example}

HTTP 200: 
<a href="#RulesObject">Rules Object</a>

### Update a rule
{:.api .api-operation}

<span class="api-uri-template api-uri-put"><span class="api-label">PUT </span> /api/v1/policies/<em>:policyId</em>/rules/<em>:ruleId</em></span>

#### Request Parameters

The policy ID described in the [Policy Object](#policy-object) is required.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X PUT \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "name": "My Updated Policy Rule",
  "conditions": {
    "people": {
      "users": {
        "exclude": []
      }
    },
    "network": {
      "connection": "ON_NETWORK"
    },
    "authContext": {
      "authType": "ANY"
    }
  },
  "actions": {
    "signon": {
      "access": "DENY"
    }
  }
}' \
"https://${org}.okta.com/api/v1/policies/{policyId}/rules/{ruleId}"
~~~

##### Response Types
{:.api .api-response .api-response-example}

HTTP 200: 
<a href="#RulesObject">Rules Object</a>

### Activate A Rule
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST </span> /api/v1/policies/<em>:policyId</em>/rules/<em>:ruleId</em>/lifecycle/activate</span>

#### Request Parameters

The policy ID described in the [Policy Object](#policy-object) is required.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/policies/{policyId}/rules/{ruleId}/lifecycle/activate"
~~~

##### Response Types
{:.api .api-response .api-response-example}

HTTP 204: 
*No content*

### Deactivate A Rule
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST </span> /api/v1/policies/<em>:policyId</em>/rules/<em>:ruleId</em>/lifecycle/deactivate</span>

#### Request Parameters

The policy ID described in the [Policy Object](#policy-object) is required.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/policies/{policyId}/rules/{ruleId}/lifecycle/deactivate"
~~~

##### Response Types
{:.api .api-response .api-response-example}

HTTP 204: 
*No content*

## Type Specific Policy Data Structures

## Okta Sign On Policy
{: #OktaSignOnPolicy }

<!-- [THIS SECTION IN PROGRESS] -->

### Policy Settings Data

Okta sign on policy does not contain policy settings data.  In the case of sign on policy all of the data is contained in the rules.

### Policy Conditions
The following conditions may be applied to Okta Sign On Policy

### Rules Action Data

### Signon Action Object
{: #SignonObject }

Parameter | Description | Data Type | Required | Default
| --- | --- | --- | ---
access | `ALLOW` or `DENY` | `ALLOW` or `DENY` | Yes | 
requireFactor |  | Boolean | No | false
factorPromptMode | `DEVICE`, `SESSION` or `ALWAYS` | `DEVICE`, `SESSION` or `ALWAYS` | No | 
factorLifetime | How long until factor times out | Integer | No | 
session | Session Rules | <a href="#SignonSessionObject">Signon Session Object</a> | No | 


### Signon Session Object
{: #SignonSessionObject }

Parameter | Description | Data Type | Required | Default
| --- | --- | --- | ---
maxSessionIdleMinutes | Maximum number of minutes that a user session can be idle before the session is ended. | Integer | No | 
maxSessionLifetimeMinutes | Maximum number of minutes from user login that a user session will be active. Set this to force users to sign-in again after the number of specified minutes. Disable by setting to `0`. | Integer | No | 
usePersistentCookie | If set to `false`, user session cookies will only last the length of a browser session. If set to `true`, user session cookies will last across browser sessions. This setting does not impact Okta Administrator users, who can *never* have persistant session cookies. | Boolean | No | false

### Rules Conditions
The following conditions may be applied to the rules associated with Okta Sign On Policy

## Okta MFA Policy
{: #OktaMFAPolicy }

<!-- [THIS SECTION IN PROGRESS] -->

### Policy Settings Data

#### Policy Factors Configuration Object
{: #PolicyFactorsConfigurationObject }

Parameter | Description | Data Type | Required | Default
| --- | --- | --- | ---
google_otp | Google Authenticator | <a href="#PolicyFactorObject">Policy MFA Factor Object</a> | No | 
okta_otp | Okta Verify TOTP | <a href="#PolicyFactorObject">Policy MFA Factor Object</a> | No | 
okta_push | Okta Verify Push | <a href="#PolicyFactorObject">Policy MFA Factor Object</a> | No | 
okta_question | Okta Security Question | <a href="#PolicyFactorObject">Policy MFA Factor Object</a> | No | 
okta_sms | Okta SMS | <a href="#PolicyFactorObject">Policy MFA Factor Object</a> | No | 
rsa_token | RSA Token | <a href="#PolicyFactorObject">Policy MFA Factor Object</a> | No | 
symantec_vip | Symantic VIP | <a href="#PolicyFactorObject">Policy MFA Factor Object</a> | No | 

#### Policy MFA Factor Object
{: #PolicyFactorObject }

Parameter | Description | Data Type | Required | Default
| --- | --- | --- | ---
consent |  | <a href="#PolicyFactorConsentObject">Policy Factor Consent Object</a> | No | 
enroll |  | <a href="#PolicyFactorEnrollObject">Policy Factor Enroll Object</a> | No | 


#### Policy Factor Enroll Object
{: #PolicyFactorEnrollObject }

Parameter | Description | Data Type | Required | Default
| --- | --- | --- | ---
self |  | `NOT_ALLOWED`, `OPTIONAL` or `REQUIRED` | Yes | 

#### Policy Factor Consent Object
{: #PolicyFactorConsentObject }

Parameter | Description | Data Type | Required | Default
| --- | --- | --- | ---
terms | The format of the consent dialog to be presented. | `TEXT`, `RTF`, `MARKDOWN` or `URL` | No | 
type | Does the user need to consent to `NONE` or `TERMS_OF_SERVICE`. | String | No | NONE
value | The contents of the consent dialog. | String | No | 

### Policy Conditions
The following conditions may be applied to Okta MFA Policy

### Rules Action Data

#### Rules Actions Enroll Object
{: #RulesActionsEnrollObject }

Parameter | Description | Data Type | Required | Default
| --- | --- | --- | ---
self | Should the user be enrolled the first time they `LOGIN`, the next time they are `CHALLENGE`d, or `NEVER`? | `CHALLENGE`, `LOGIN` or `NEVER` | Yes | 

### Rules Conditions
The following conditions may be applied to the rules associated with Okta MFA Policy 

## Password Policy
{: #GroupPasswordPolicy }

[THIS SECTION TBD]

### Policy Settings Data

### Policy Conditions
The following conditions may be applied to Password Policy

### Rules Action Data

### Rules Conditions
The following conditions may be applied to the rules associated with Okta Password Policy
