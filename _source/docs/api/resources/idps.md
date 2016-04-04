---
layout: docs_page
title: Identity Providers
---

## Overview

The Okta Identity Providers API provides operations to manage federations with external Identity Providers (IdP).

## Identity Provider Model

### Example

~~~json
{
  "id": "0oa1k5d68qR2954hb0g4",
  "type": "SAML2",
  "name": "Example IdP",
  "status": "ACTIVE",
  "created": "2015-03-05T20:24:09.000Z",
  "lastUpdated": "2015-12-18T05:19:40.000Z",
  "protocol": {
    "type": "SAML2",
    "endpoints": {
      "sso": {
        "url": "https://idp.example.com/saml2/sso",
        "binding": "HTTP-REDIRECT",
        "destination": "https://idp.example.com/saml2/sso"
      },
      "acs": {
        "binding": "HTTP-POST",
        "type": "INSTANCE"
      }
    },
    "algorithms": {
      "request": {
        "signature": {
          "algorithm": "SHA-1",
          "scope": "REQUEST"
        }
      },
      "response": {
        "signature": {
          "algorithm": "SHA-1",
          "scope": "ANY"
        }
      }
    },
    "credentials": {
      "trust": {
        "issuer": "urn:example:idp",
        "audience": "https://www.okta.com/saml2/service-provider/spgv32vOnpdyeGSaiUpL",
        "kid": "164f0d13-be79-4a13-8848-a9450e9abd2c"
      }
    }
  },
  "policy": {
    "provisioning": {
      "action": "AUTO",
      "profileMaster": true,
      "groups": {
        "action": "NONE"
      }
    },
    "accountLink": {
      "filter": null,
      "action": "AUTO"
    },
    "subject": {
      "userNameTemplate": {
        "template": "idpuser.subjectNameId"
      },
      "filter": null,
      "matchType": "USERNAME"
    },
    "maxClockSkew": 120000
  },
  "_links": {
    "metadata": {
      "href": "https://example.okta.com/api/v1/idps/0oa1k5d68qR2954hb0g4/metadata.xml",
      "type": "application/xml",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    },
    "acs": {
      "href": "https://example.okta.com/sso/saml2/0oa1k5d68qR2954hb0g4",
      "type": "application/xml",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "users": {
      "href": "https://example.okta.com/api/v1/idps/0oa1k5d68qR2954hb0g4/users",
      "hints": {
        "allow": [
          "GET"
        ]
      }
    },
    "activate": {
      "href": "https://example.okta.com/api/v1/idps/0oa1k5d68qR2954hb0g4/lifecycle/activate",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "deactivate": {
      "href": "https://example.okta.com/api/v1/idps/0oa1k5d68qR2954hb0g4/lifecycle/deactivate",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    }
  }
}
~~~


### Identity Provider Attributes

All Identity Providers have the following properties:

|---------------+--------------------------------------------------------------+----------------------------------------------------------------+----------|--------|----------|-----------|-----------+------------|
| Property      | Description                                                  | DataType                                                       | Nullable | Unique | Readonly | MinLength | MaxLength | Validation |
| ------------- | ------------------------------------------------------------ | -------------------------------------------------------------- | -------- | ------ | -------- | --------- | --------- | ---------- |
| id            | unique key for the IdP                                       | String                                                         | FALSE    | TRUE   | TRUE     |           |           |            |
| type          | type of IdP                                                  | [Identity Provider Type](#identity-provider-type)              | FALSE    | FALSE  | FALSE    |           |           |            |
| name          | unique name for the IdP                                      | String                                                         | FALSE    | TRUE   | FALSE    | 1         | 100       |            |
| status        | status of the IdP                                            | `ACTIVE` or `INACTIVE`                                         | FALSE    | FALSE  | TRUE     |           |           |            |
| created       | timestamp when IdP was created                               | Date                                                           | FALSE    | FALSE  | TRUE     |           |           |            |
| lastUpdated   | timestamp when IdP was last updated                          | Date                                                           | FALSE    | FALSE  | TRUE     |           |           |            |
| protocol      | protocol settings for IdP `type`                             | [Protocol Object](#identity-provider-type)                     | FALSE    | FALSE  | FALSE    |           |           |            |
| policy        | policy settings for IdP `type`                               | [Policy Object](#identity-provider-type)                       | FALSE    | FALSE  | FALSE    |           |           |            |
| _links        | [discoverable resources](#links-object) related to the IdP   | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06) | TRUE     | FALSE  | TRUE     |           |           |            |
| _embedded     | embedded resources related to the IdP                        | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06) | TRUE     | FALSE  | TRUE     |           |           |            |
|---------------+--------------------------------------------------------------+----------------------------------------------------------------+----------|--------|----------|-----------|-----------+------------|

> `id`, `created`, `lastUpdated`, and `_links` are only available after an IdP is created

### Identity Provider Type

Okta supports the following enterprise and social IdPs:

|--------------+-------------------------------------------------------------------------------------------------------------------------------------------------------+
| Type         | Description                                                                                                                                           |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SAML2`      | Enterprise IdP provider that supports the [SAML 2.0 Web Browser SSO Profile](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf) |
| `FACEBOOK`   | [Facebook Login](https://developers.facebook.com/docs/facebook-login/overview/)                                                                       |
| `GOOGLE`     | [Google Sign-In with OpenID Connect](https://developers.google.com/identity/protocols/OpenIDConnect)                                                  |
| `LINKEDIN`   | [Sign In with Linked In](https://developer.linkedin.com/docs/signin-with-linkedin)                                                                    |
| `MICROSOFT`  | [Microsoft Account](https://www.microsoft.com/en-us/account)
|--------------+-------------------------------------------------------------------------------------------------------------------------------------------------------+

### Protocol Object

IdP-specific protocol settings for endpoints, bindings, and algorithms used to connect with the IdP and validate messages.

|--------------+--------------------------------------------+
| Provider     | Protocol                                   |
| ------------ | -------------------------------------------|
| `SAML2`      | [SAML 2.0](#saml-20-protocol)              |
| `FACEBOOK`   | [OAuth 2.0](#oauth-20-protocol)            |
| `GOOGLE`     | [OpenID Connect](#openid-connect-protocol) |
| `LINKEDIN`   | [OAuth 2.0](#oauth-20-protocol)            |
| `MICROSOFT`  | [OpenID Connect](#openid-connect-protocol) |
|--------------+--------------------------------------------+

#### SAML 2.0 Protocol

Protocol settings for the [SAML 2.0 Authentication Request Protocol](http://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)

|-------------+--------------------------------------------------------------------+-------------------------------------------------------------------+----------+----------+-----------+-----------+------------|
| Property    | Description                                                        | DataType                                                          | Nullable | Readonly | MinLength | MaxLength | Validation |
| ----------- | ------------------------------------------------------------------ | ----------------------------------------------------------------- | -------- | -------- | --------- | --------- | ---------- |
| type        | SAML 2.0 protocol                                                  | `SAML2`                                                           | FALSE    | TRUE     |           |           |            |
| endpoints   | SAML 2.0 HTTP binding settings for IdP and SP (Okta)               | [SAML 2.0 Endpoints Object](#saml-20-endpoints-object)            | FALSE    | FALSE    |           |           |            |
| algorithms  | Settings for signing and verifying SAML messages                   | [SAML 2.0 Algorithms Object](#saml-20-algorithms-object)          | FALSE    | FALSE    |           |           |            |
| credentials | Federation trust credentials for verifying assertions from the IdP | [SAML 2.0 Credentials Object](#saml-20-trust-credentials-object)  | FALSE    | FALSE    |           |           |            |
| settings    | Advanced settings for the SAML 2.0 protocol                        | [SAML 2.0 Settings Object](#saml-20-settings-object)              | TRUE     | FALSE    |           |           |            |
|-------------+--------------------------------------------------------------------+-------------------------------------------------------------------+----------+----------+-----------+-----------+------------|

~~~json
{
  "protocol": {
    "type": "SAML2",
    "endpoints": {
      "sso": {
        "url": "https://idp.example.com/saml2/sso",
        "binding": "HTTP-POST",
        "destination": "https://idp.example.com/saml2/sso"
      },
      "acs": {
        "binding": "HTTP-POST",
        "type": "INSTANCE"
      }
    },
    "algorithms": {
      "request": {
        "signature": {
          "algorithm": "SHA-1",
          "scope": "REQUEST"
        }
      },
      "response": {
        "signature": {
          "algorithm": "SHA-1",
          "scope": "ANY"
        }
      }
    },
    "credentials": {
      "trust": {
        "issuer": "urn:example:idp",
        "audience": "https://www.okta.com/saml2/service-provider/spgv32vOnpdyeGSaiUpL",
        "kid": "164f0d13-be79-4a13-8848-a9450e9abd2c"
      }
    },
    "settings": {
        "nameFormat": "urn:oasis:names:tc:SAML:2.0:nameid-format:transient"
    }
  }
}
~~~

##### SAML 2.0 Endpoints Object

The `SAML2` protocol supports the `sso` and `acs` endpoints

|----------+---------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------------------------+----------+----------+-----------+-----------+------------|
| Property | Description                                                                           | DataType                                                                                            | Nullable | Readonly | MinLength | MaxLength | Validation |
| -------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------- | -------- | --------- | --------- | ---------- |
| sso      | IdP's `SingleSignOnService` endpoint where Okta will send an `<AuthnRequest>` message | [Single Sign-On (SSO) Endpoint Object](#single-sign-on-sso-endpoint-object)                         | FALSE    | FALSE    |           |           |            |
| acs      | Okta's `SPSSODescriptor` endpoint where the IdP will send a `<SAMLResponse>` message  | [Assertion Consumer Service (ACS) Endpoint Object](#assertion-consumer-service-acs-endpoint-object) | FALSE    | FALSE    |           |           |            |
|----------+---------------------------------------------------------------------------------------+-----------------------------------------------------------------------------------------------------+----------+----------+-----------+-----------+------------|

###### Single Sign-On (SSO) Endpoint Object

The Single Sign-On (SSO) endpoint is the IdP's `SingleSignOnService` endpoint where Okta will send a SAML 2.0 `<AuthnRequest>` message

|-------------+------------------------------------------------------------------------------------+----------------------------------+----------+----------+-----------+-----------+-------------------------------------------------|
| Property    | Description                                                                        | DataType                         | Nullable | Readonly | MinLength | MaxLength | Validation                                      |
| ----------- | ---------------------------------------------------------------------------------- | -------------------------------- | -------- | -------- | --------- | --------- | ----------------------------------------------- |
| url         | URL of binding-specific endpoint to send an `<AuthnRequest>` message to IdP        | String                           | FALSE    | FALSE    | 11        | 1014      | [RFC 3986](https://tools.ietf.org/html/rfc3986) |
| binding     | HTTP binding used to send an `<AuthnRequest>` message to IdP                       | `HTTP-POST` or `HTTP-Redirect`   | FALSE    | FALSE    |           |           |                                                 |
| destination | URI reference indicating the address to which the `<AuthnRequest>` message is sent | String                           | TRUE     | FALSE    | 1         | 512       |                                                 |
|-------------+------------------------------------------------------------------------------------+----------------------------------+----------+----------+-----------+-----------+-------------------------------------------------|

> The `destination` property is required if request signatures are specified (See [SAML 2.0 Request Algorithm Object](#saml-20-request-algorithm-object)).
>
> The value is defaulted to the same `url` as the `sso` endpoint if omitted during creation of a new IdP instance.

~~~json
{
  "protocol": {
    "type": "SAML2",
    "endpoints": {
      "sso": {
        "url": "https://idp.example.com/saml2/sso",
        "binding": "HTTP-POST",
        "destination": "https://idp.example.com/saml2/sso"
      }
    }
  }
}
~~~

> The `url` should be the same value as the `Location` attribute for a published binding in the IdP's SAML Metadata `IDPSSODescriptor`

~~~xml
<IDPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
  <SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://idp.example.com/saml2/sso"/>
  <SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://idp.example.com/saml2/sso"/>
</IDPSSODescriptor>
~~~

###### Assertion Consumer Service (ACS) Endpoint Object

The Assertion Consumer Service (ACS) endpoint is Okta's `SPSSODescriptor` endpoint where the IdP will send a SAML 2.0 `<SAMLResponse>` message

|-------------+-----------------------------------------------------------------------------------------------------------------------+-----------------------+----------+----------+-----------+-----------+------------|
| Property    | Description                                                                                                           | DataType              | Nullable | Readonly | MinLength | MaxLength | Default    |
| ----------- | --------------------------------------------------------------------------------------------------------------------- | --------------------- | -------- | -------- | --------- | --------- | ---------- |
| binding     | HTTP binding used to receive a `<SAMLResponse>` message from the IdP                                                  | `HTTP-POST`           | TRUE     | FALSE    |           |           | `HTTP-POST`|
| type        | Determines whether to publish a instance-specific (trust) or organization (shared) ACS endpoint in the SAML metadata  | `INSTANCE` or `ORG`   | TRUE     | FALSE    |           |           | `INSTANCE` |
|-------------+-----------------------------------------------------------------------------------------------------------------------+-----------------------+----------+----------+-----------+-----------+------------|

~~~json
{
  "protocol": {
    "type": "SAML2",
    "endpoints": {
      "acs": {
        "binding": "HTTP-POST",
        "type": "INSTANCE"
      }
    }
  }
}
~~~

**Trust-specific ACS Endpoint Example**

~~~xml
<md:EntityDescriptor entityID="https://idp.example.com/saml2/sso" xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata">
  <md:SPSSODescriptor AuthnRequestsSigned="true" WantAssertionsSigned="true" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://your-domain.okta.co/sso/saml2/0oamxfD9Jvaxvr0M00g3" index="0" isDefault="true"/>
  </md:SPSSODescriptor>
</md:EntityDescriptor>
~~~

> Note the unique IdP instance `id` in the ACS `Location`

**Organization (shared) ACS Endpoint Example**

~~~xml
<md:EntityDescriptor entityID="https://idp.example.com/saml2/sso" xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata">
  <md:SPSSODescriptor AuthnRequestsSigned="true" WantAssertionsSigned="true" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://your-domain.okta.com/sso/saml2" index="0" isDefault="true"/>
  </md:SPSSODescriptor>
</md:EntityDescriptor>
~~~

> Organization-specific ACS endpoint enables multiple trusts from an IdP to a single ACS URL which may be required by specific IdP vendors

##### SAML 2.0 Algorithms Object

The `SAML2` protocol supports `request` and `response` algorithm and verification settings

|----------+---------------------------------------------------------------+--------------------------------------------------------------------------+----------+----------+-----------+-----------+------------|
| Property | Description                                                   | DataType                                                                 | Nullable | Readonly | MinLength | MaxLength | Validation |
| -------- | ------------------------------------------------------------- | ------------------------------------------------------------------------ | -------- | -------- | --------- | --------- | ---------- |
| request  | Algorithm settings used to secure an `<AuthnRequest>` message | [SAML 2.0 Request Algorithm Object](#saml-20-request-algorithm-object)   | FALSE    | FALSE    |           |           |            |
| response | Algorithm settings used to verify a `<SAMLResponse>` message  | [SAML 2.0 Response Algorithm Object](#saml-20-response-algorithm-object) | FALSE    | FALSE    |           |           |            |
|----------+---------------------------------------------------------------+--------------------------------------------------------------------------+----------+----------+-----------+-----------+------------|

~~~json
{
  "protocol": {
    "type": "SAML2",
    "algorithms": {
      "request": {
        "signature": {
          "algorithm": "SHA-1",
          "scope": "REQUEST"
        }
      },
      "response": {
        "signature": {
          "algorithm": "SHA-1",
          "scope": "ANY"
        }
      }
    }
  }
}
~~~

###### SAML 2.0 Request Algorithm Object

Algorithm settings for securing `<AuthnRequest>` messages sent to the IdP

|-----------+-------------------------------------------------------------+--------------------------------------------------------------------------------------------+----------+----------+-----------+-----------+------------|
| Property  | Description                                                 | DataType                                                                                   | Nullable | Readonly | MinLength | MaxLength | Validation |
| --------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------- | -------- | --------- | --------- | ---------- |
| signature | Algorithm settings used to sign an `<AuthnRequest>` message | [SAML 2.0 Request Signature Algorithm Object](#saml-20-request-signature-algorithm-object) | FALSE    | FALSE    |           |           |            |
|-----------+-------------------------------------------------------------+--------------------------------------------------------------------------------------------+----------+----------+-----------+-----------+------------|

~~~json
{
  "protocol": {
    "type": "SAML2",
    "algorithms": {
      "request": {
        "signature": {
          "algorithm": "SHA-256",
          "scope": "REQUEST"
        }
      }
    }
  }
}
~~~

###### SAML 2.0 Request Signature Algorithm Object

XML digital signature algorithm settings for signing `<AuthnRequest>` messages sent to the IdP

|-------------+------------------------------------------------------------------------------------+----------------------+----------+----------+-----------+-----------+------------|
| Property    | Description                                                                        | DataType             | Nullable | Readonly | MinLength | MaxLength | Validation |
| ----------- | ---------------------------------------------------------------------------------- | -------------------- | -------- | -------- | --------- | --------- | ---------- |
| algorithm   | XML digital signature algorithm used when signing an `<AuthnRequest>` message      | `SHA-1` or `SHA-256` | FALSE    | FALSE    |           |           |            |
| scope       | Specifies whether or not to digitally sign an `<AuthnRequest>` messages to the IdP | `REQUEST` or `NONE`  | FALSE    | FALSE    |           |           |            |
|-------------+------------------------------------------------------------------------------------+----------------------+----------+----------+-----------+-----------+------------|

> The `algorithm` property is ignored when disabling request signatures (`scope` set as `NONE`)

###### SAML 2.0 Response Algorithm Object

Algorithm settings for verifying `<SAMLResponse>` messages and `<Assertion>` elements from the IdP

|-----------+----------------------------------------------------------------------------------------------------+----------------------------------------------------------------------------------------------+----------+----------+-----------+-----------+------------|
| Property  | Description                                                                                        | DataType                                                                                     | Nullable | Readonly | MinLength | MaxLength | Validation |
| --------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------- | -------- | --------- | --------- | ---------- |
| signature | Algorithm settings for verifying `<SAMLResponse>` messages and `<Assertion>` elements from the IdP | [SAML 2.0 Response Signature Algorithm Object](#saml-20-response-signature-algorithm-object) | FALSE    | FALSE    |           |           |            |
|-----------+----------------------------------------------------------------------------------------------------+----------------------------------------------------------------------------------------------+----------+----------+-----------+-----------+------------|

~~~json
{
  "protocol": {
    "type": "SAML2",
    "algorithms": {
      "response": {
        "signature": {
          "algorithm": "SHA-256",
          "scope": "ANY"
        }
      }
    }
  }
}
~~~

###### SAML 2.0 Response Signature Algorithm Object

XML digital signature algorithm settings for verifying `<SAMLResponse>` messages and `<Assertion>` elements from the IdP

|-------------+------------------------------------------------------------------------------------------------------------------------+--------------------------------+----------+----------+-----------+-----------+------------|
| Property    | Description                                                                                                            | DataType                       | Nullable | Readonly | MinLength | MaxLength | Validation |
| ----------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------ | -------- | -------- | --------- | --------- | ---------- |
| algorithm   | The minimum XML digital signature algorithm allowed when verifying a `<SAMLResponse>` message or `<Assertion>` element | `SHA-1` or `SHA-256`           | FALSE    | FALSE    |           |           |            |
| scope       | Specifies whether to verify a `<SAMLResponse>` message or `<Assertion>` element XML digital signature                  | `RESPONSE`, `ASSERTION`, `ANY` | FALSE    | FALSE    |           |           |            |
|-------------+------------------------------------------------------------------------------------------------------------------------+--------------------------------+----------+----------+-----------+-----------+------------|

###### SAML 2.0 Trust Credentials Object

Federation trust credentials for verifying assertions from the IdP

|---------+--------------------------------------------------------------------------------------------------------+----------+----------+----------+-----------+-----------+--------------------------------------------|
| Property | Description                                                                                           | DataType | Nullable | Readonly | MinLength | MaxLength | Validation                                 |
| -------- | ----------------------------------------------------------------------------------------------------- | -------- | -------- | -------- | --------- | --------- | ------------------------------------------ |
| issuer   | URI that identifies the issuer (IdP) of a SAML `<SAMLResponse>` message `<Assertion>` element         | String   | FALSE    | FALSE    | 1         | 1024      | [URI](https://tools.ietf.org/html/rfc3986) |
| audience | URI that identifies the target Okta IdP instance (SP) for an `<Assertion>`                            | String   | FALSE    | FALSE    | 1         | 1024      | [URI](https://tools.ietf.org/html/rfc3986) |
| kid      | [Key ID](#identity-provider-key-store-operations) reference to the IdP's X.509 signature certificate  | String   | FALSE    | FALSE    | 36        | 36        | Valid IdP Key ID reference                 |
|----------+-------------------------------------------------------------------------------------------------------+----------+----------+----------+-----------+-----------+--------------------------------------------|

~~~json
{
  "protocol": {
    "type": "SAML2",
    "credentials": {
      "trust": {
        "issuer": "urn:example:idp",
        "audience": "https://www.okta.com/saml2/service-provider/spgv32vOnpdyeGSaiUpL",
        "kid": "164f0d13-be79-4a13-8848-a9450e9abd2c"
      }
    }
  }
}
~~~

##### SAML 2.0 Settings Object

|-------------+-----------------------------------+-------------+----------+----------+----------------------------------------------------------------------+-------------------------------------------------------|
| Property    | Description                       | DataType    | Nullable | Readonly | DataType                                                             | Default                                               |
| ----------- + --------------------------------- + ----------- + -------- + -------- +--------------------------------------------------------------------- + ------------------------------------------------------|
| nameFormat  | The name identifier format to use | String      | TRUE     | FALSE    | [SAML 2.0 Name Identifier Formats](#saml-20-name-identifier-formats) | urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified |
|-------------+-----------------------------------+-------------+----------+----------+----------------------------------------------------------------------+-------------------------------------------------------|

~~~json
{
  "protocol": {
    "type": "SAML2",
    "settings": {
      "nameFormat": "urn:oasis:names:tc:SAML:2.0:nameid-format:transient"
    }
  }
}
~~~

##### SAML 2.0 Name Identifier Formats

|--------------------------------------------------------|
| Options                                                |
| -------------------------------------------------------|
| urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified  |
| urn:oasis:names:tc:SAML:2.0:nameid-format:transient    |
| urn:oasis:names:tc:SAML:2.0:nameid-format:persistent   |
| urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress |
|--------------------------------------------------------|

#### OAuth 2.0 Protocol

Protocol settings for authentication using the [OAuth 2.0 Authorization Code Flow](https://tools.ietf.org/html/rfc6749#section-4.1)

|-------------+---------------------------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------+----------+----------+-----------+-----------+------------|
| Property    | Description                                                                                                                     | DataType                                                  | Nullable | Readonly | MinLength | MaxLength | Validation |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | -------- | -------- | --------- | --------- | ---------- |
| type        | [OAuth 2.0 Authorization Code Flow](https://tools.ietf.org/html/rfc6749#section-4.1)                                            | `OAUTH2`                                                  | FALSE    | TRUE     |           |           |            |
| endpoints   | Endpoint settings for OAuth 2.0 Authorization Server (AS)                                                                       | [OAuth 2.0 Endpoints Object](#oauth-20-endpoints-object)  | TRUE     | TRUE     |           |           |            |
| scopes      | IdP-defined permission bundles to request delegated access from user                                                            | Array of String                                           | FALSE    | FALSE    | 1         |           |            |
| credentials | Client authentication credentials for an [OAuth 2.0 Authorization Server (AS)](https://tools.ietf.org/html/rfc6749#section-2.3) | [Credentials Object](#oauth-20-client-credentials-object) | FALSE    | FALSE    |           |           |            |
|-------------+---------------------------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------+----------+----------+-----------+-----------+------------|

> Refer to the IdP setup documentation for a list of what scopes are supported [per-IdP provider](#identity-provider-type)

~~~json
{
  "protocol": {
    "type": "OAUTH2",
    "endpoints": {
      "authorization": {
        "url": "https://www.facebook.com/dialog/oauth",
        "binding": "HTTP-REDIRECT"
      },
      "token": {
        "url": "https://graph.facebook.com/v2.5/oauth/access_token",
        "binding": "HTTP-POST"
      }
    },
    "scopes": [
      "public_profile",
      "email"
    ],
    "credentials": {
      "client": {
        "client_id": "430731646638-sq6oeve9f6rpm2rne289nukind6f1qgk.apps.googleusercontent.com",
        "client_secret": "kOgHsuPDawNDSkkaAKvv6SMh"
      }
    }
  }
}
~~~

#### OpenID Connect Protocol

Protocol settings for authentication using the [OpenID Connect Protocol](http://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth)

|-------------+---------------------------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------+----------+----------+-----------+-----------+------------|
| Property    | Description                                                                                                                     | DataType                                                        | Nullable | Readonly | MinLength | MaxLength | Validation |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | -------- | -------- | --------- | --------- | ---------- |
| type        | [OpenID Connect Authorization Code Flow](http://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth)                     | `OIDC`                                                          | FALSE    | TRUE     |           |           |            |
| endpoints   | Endpoint settings for OAuth 2.0 Authorization Server (AS)                                                                       | [OAuth 2.0 Endpoints Object](#openid-connect-endpoints-object)  | TRUE     | TRUE     |           |           |            |
| scopes      | OpenID Connect and IdP-defined permission bundles to request delegated access from user                                         | Array of String                                                 | FALSE    | FALSE    | 1         |           |            |
| credentials | Client authentication credentials for an [OAuth 2.0 Authorization Server (AS)](https://tools.ietf.org/html/rfc6749#section-2.3) | [Credentials Object](#openid-connect-client-credentials-object) | FALSE    | FALSE    |           |           |            |
|-------------+---------------------------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------------+----------+----------+-----------+-----------+------------|

> Refer to the IdP setup documentation for a list of what scopes are supported [per-IdP provider](#identity-provider-type).  The base `openid` scope is always required.

~~~json
{
  "protocol": {
    "type": "OIDC",
    "endpoints": {
      "authorization": {
        "url": "https://accounts.google.com/o/oauth2/auth",
        "binding": "HTTP-REDIRECT"
      },
      "token": {
        "url": "https://www.googleapis.com/oauth2/v3/token",
        "binding": "HTTP-POST"
      }
    },
    "scopes": [
      "profile",
      "email",
      "openid"
    ],
    "credentials": {
      "client": {
        "client_id": "430731646638-sq6oeve9f6rpm2rne289nukind6f1qgk.apps.googleusercontent.com",
        "client_secret": "kOgHsuPDawNDSkkaAKvv6SMh"
      }
    }
  }
}
~~~

##### OAuth 2.0 and OpenID Connect Endpoints Object

The `OAUTH2` and `OIDC` protocols support the `authorization` and `token` endpoints

|---------------+------------------------------------------------------------------------------------------------------------+-------------------------------------------------------------------------------------------------+----------+----------+-----------+-----------+------------|
| Property      | Description                                                                                                | DataType                                                                                        | Nullable | Readonly | MinLength | MaxLength | Validation |
| ------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------- | -------- | --------- | --------- | ---------- |
| authorization | IdP Authorization Server (AS) endpoint to request consent from user and obtain an authorization code grant | [OAuth 2.0 Authorization Server Endpoint Object](#oauth-20-authorization-server-endpoint-object)| TRUE     | TRUE     |           |           |            |
| token         | IdP Authorization Server (AS) endpoint to exchange authorization code grant for an access token            | [OAuth 2.0 Authorization Server Endpoint Object](#oauth-20-authorization-server-endpoint-object)| TRUE     | TRUE     |           |           |            |
|---------------+------------------------------------------------------------------------------------------------------------+-------------------------------------------------------------------------------------------------+----------+----------+-----------+-----------+------------|

> The IdP Authorization Server (AS) endpoints are currently defined as part of the [IdP provider](#identity-provider-type) and are **read-only**

~~~json
{
  "protocol": {
    "type": "OAUTH2",
    "endpoints": {
      "authorization": {
        "url": "https://www.facebook.com/dialog/oauth",
        "binding": "HTTP-REDIRECT"
      },
      "token": {
        "url": "https://graph.facebook.com/v2.5/oauth/access_token",
        "binding": "HTTP-POST"
      }
    }
  }
}
~~~

~~~json
{
  "protocol": {
    "type": "OIDC",
    "endpoints": {
      "authorization": {
        "url": "https://accounts.google.com/o/oauth2/auth",
        "binding": "HTTP-REDIRECT"
      },
      "token": {
        "url": "https://www.googleapis.com/oauth2/v3/token",
        "binding": "HTTP-POST"
      }
    }
  }
}
~~~

##### OAuth 2.0 and Openid Connect Client Credentials Object

Client authentication credentials for an [OAuth 2.0 Authorization Server (AS)](https://tools.ietf.org/html/rfc6749#section-2.3)

|---------------+-------------------------------------------------------------------------------------------------------------+----------+----------+----------+-----------+-----------+------------|
| Property      | Description                                                                                                 | DataType | Nullable | Readonly | MinLength | MaxLength | Validation |
| ------------- | ----------------------------------------------------------------------------------------------------------- | -------- | -------- | -------- | --------- | --------- | ---------- |
| client_id     | [Unique identifier](https://tools.ietf.org/html/rfc6749#section-2.2) issued by AS for the Okta IdP instance | String   | FALSE    | FALSE    | 1         | 1024      |            |
| client_secret | [Client secret issued](https://tools.ietf.org/html/rfc6749#section-2.3.1) by AS for the Okta IdP instance   | String   | FALSE    | FALSE    | 1         | 1024      |            |
|---------------+-------------------------------------------------------------------------------------------------------------+----------+----------+----------+-----------+-----------+------------|

> You must perform client registration with the IdP Authorization Server for your Okta IdP instance to obtain client credentials

~~~json
{
  "protocol": {
    "type": "OAUTH2",
    "credentials": {
      "client": {
        "client_id": "399886900205105",
        "client_secret": "854b2478619d4fcff49f1eb10c78292d"
      }
    }
  }
}
~~~

~~~json
{
  "protocol": {
    "type": "OIDC",
    "credentials": {
      "client": {
        "client_id": "430731646638-sq6oeve9f6rpm2rne289nukind6f1qgk.apps.googleusercontent.com",
        "client_secret": "kOgHsuPDawNDSkkaAKvv6SMh"
      }
    }
  }
}
~~~

### Policy Object

|--------------+------------------------------------------------------------------------------------------------+-----------------------------------------------------------+----------+----------+-----------+-----------+------------|
| Property     | Description                                                                                    | DataType                                                  | Nullable | Readonly | MinLength | MaxLength | Validation |
| ------------ | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------- | -------- | -------- | --------- | --------- | ---------- |
| provisioning | Policy rules to just-in-time (JIT) provision an IdP user as a new Okta user                    | [Provisioning Policy Object](#provisioning-policy-object) | FALSE    | FALSE    |           |           |            |
| accountLink  | Policy rules to link an IdP user to an existing Okta user                                      | [Account Link Policy Object](#account-link-policy-object) | FALSE    | FALSE    |           |           |            |
| subject      | Policy rules to select the Okta login identifier for the IdP user and determine matching rules | [Subject Policy Object](#subject-policy-object)           | FALSE    | FALSE    |           |           |            |
| maxClockSkew | Maximum allowable clock-skew when processing messages from the IdP                             | Number                                                    | FALSE    | FALSE    |           |           |            |
|--------------+------------------------------------------------------------------------------------------------+-----------------------------------------------------------+----------+----------+-----------+-----------+------------|


~~~json
{
  "policy": {
    "provisioning": {
      "action": "AUTO",
      "profileMaster": true,
      "groups": {
        "action": "NONE"
      }
    },
    "accountLink": {
      "filter": null,
      "action": "AUTO"
    },
    "subject": {
      "userNameTemplate": {
        "template": "idpuser.subjectNameId"
      },
      "filter": null,
      "matchType": "USERNAME"
    },
    "maxClockSkew": 120000
  }
}
~~~

#### IdP Type Policy Actions

|--------------+-------------------------------+---------------------------------------+----------------------+----------------------+
| Type         | User Provisioning Actions     | Group Provisioning Actions            | Account Link Actions | Account Link Filters |
| ------------ | ----------------------------- | ------------------------------------- | -------------------- | -------------------- |
| `SAML2`      | `AUTO` or `DISABLED`          | `NONE`, `ASSIGN`, `APPEND`, or `SYNC` | `AUTO`               |                      |
| `FACEBOOK`   | `AUTO`, `CALLOUT`, `DISABLED` | `NONE` or `ASSIGN`                    | `AUTO` or `CALLOUT`  | `groups`             |
| `GOOGLE`     | `AUTO`, `CALLOUT`, `DISABLED` | `NONE` or `ASSIGN`                    | `AUTO` or `CALLOUT`  | `groups`             |
| `LINKEDIN`   | `AUTO`, `CALLOUT`, `DISABLED` | `NONE` or `ASSIGN`                    | `AUTO` or `CALLOUT`  | `groups`             |
|--------------+-------------------------------+---------------------------------------+----------------------+----------------------+


#### Provisioning Policy Object

Specifies the behavior for just-in-time (JIT) provisioning of an IdP user as a new Okta user and their group memberships

|---------------+-----------------------------------------------------------------------------------+-----------------------------------------------------------------------+----------+----------+-----------+-----------+------------|
| Property      | Description                                                                       | DataType                                                              | Nullable | Readonly | MinLength | MaxLength | Validation |
| --------------| --------------------------------------------------------------------------------- | --------------------------------------------------------------------- | -------- | -------- | --------- | --------- | ---------- |
| action        | Provisioning action for an IdP user during authentication                         | [User Provisioning Action Type](#user-provisioning-action-type)       | FALSE    | FALSE    |           |           |            |
| profileMaster | Determines if the IdP should act as a source of truth for user profile attributes | Boolean                                                               | FALSE    | FALSE    |           |           |            |
| callout       | Webhook settings for the `CALLOUT` action                                         | [Callout Object](#callout-object)                                     | TRUE     | FALSE    |           |           |            |
| groups        | Provisioning settings for a user's group memberships                              | [Group Provisioning Policy Object](#group-provisioning-policy-object) | FALSE    | FALSE    |           |           |            |
|---------------+-----------------------------------------------------------------+-----------------------------------------------------------------------------------------+----------+----------+-----------+-----------+------------|

~~~json
{
  "provisioning": {
    "action": "AUTO",
    "profileMaster": true,
    "groups": {
      "action": "SYNC",
      "sourceAttributeName": "Groups",
      "filter": [
        "00gak46y5hydV6NdM0g4"
      ]
    }
  }
}
~~~

##### IdP Type Provisioning Policy Actions

The follow provisioning actions are support by each IdP provider:

|--------------+-------------------------------+---------------------------------------+
| Type         | User Provisioning Actions     | Group Provisioning Actions            |
| ------------ | ----------------------------- | ------------------------------------- |
| `SAML2`      | `AUTO` or `DISABLED`          | `NONE`, `ASSIGN`, `APPEND`, or `SYNC` |
| `FACEBOOK`   | `AUTO`, `CALLOUT`, `DISABLED` | `NONE` or `ASSIGN`                    |
| `GOOGLE`     | `AUTO`, `CALLOUT`, `DISABLED` | `NONE` or `ASSIGN`                    |
| `LINKEDIN`   | `AUTO`, `CALLOUT`, `DISABLED` | `NONE` or `ASSIGN`                    |
|--------------+-------------------------------+---------------------------------------+

##### User Provisioning Action Type

Specifies the user provisioning action during authentication when an IdP user is not linked to an existing Okta user

|-------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Action Type | Description                                                                                                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AUTO`      | The IdP user profile will be transformed via defined universal directory profile mappings to an Okta user profile and automatically provisioned as an Okta user.                                 |
| `CALLOUT`   | Okta will callout to an external web service during authentication to validate the IdP user profile, determine whether to provision a new Okta user, and define the resulting Okta user profile. |
| `DISABLED`  | Okta will reject the authentication request and skip provisioning of a new Okta user if the IdP user is not linked to an existing Okta User.                                                     |
|--------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

> JIT provisioning **must** be enabled in your organization security settings for `AUTO` or `CALLOUT` actions to successfully provision a new Okta user

> JIT provisioning **may** fail if the target username is not unique or the resulting Okta user profile is missing a required profile attribute

> New Okta users will be provisioned with either a `FEDERATION` or `SOCIAL` authentication provider depending on the IdP `type`

##### Group Provisioning Policy Object

|---------------------+--------------------------------------------------------------------------------------------------------------------------+-------------------------------------------------------------------+----------+----------+-----------+-----------+------------|
| Property            | Description                                                                                                              | DataType                                                          | Nullable | Readonly | MinLength | MaxLength | Validation |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- | -------- | -------- | --------- | --------- | ---------- |
| action              | Provisioning action for IdP user's group memberships                                                                     | [Group Provisioning Action Type](#group-provisioning-action-type) | FALSE    | FALSE    |           |           |            |
| sourceAttributeName | IdP user profile attribute name (case-insensitive) for an array value that contains group memberships                    | String                                                            | TRUE     | FALSE    | 0         | 1024      |            |
| filter              | Whitelist of `OKTA_GROUP` group identifiers that are allowed for the `APPEND` or `SYNC` provisioning action              | Array of String (`OKTA_GROUP` IDs)                                | TRUE     | FALSE    |           |           |            |
| assignments         | List of `OKTA_GROUP` group identifiers to add IdP user as a member with the `ASSIGN` action                              | Array of String (`OKTA_GROUP` IDs)                                | TRUE     | FALSE    |           |           |            |
|---------------------+--------------------------------------------------------------------------------------------------------------------------+-------------------------------------------------------------------+----------+----------+-----------+-----------+------------|


~~~json
{
  "groups": {
    "action": "ASSIGN",
    "assignments": [
      "00gak46y5hydV6NdM0g4"
    ]
  }
}
~~~


~~~json
{
  "groups": {
    "action": "SYNC",
    "sourceAttributeName": "Groups",
    "filter": [
      "00gak46y5hydV6NdM0g4"
    ]
  }
}
~~~

###### Group Provisioning Action Type

The group provisioning action for an IdP user

|-------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|--------------------------------|-------------------------------|
| Action      | Description                                                                                                                                                        | Existing OKTA_GROUP Memberships                                                               | Existing APP_GROUP Memberships | Existing BUILT_IN Memberships |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ------------------------------ |------------------------------ |
| `NONE`      | Skips processing of group memberships                                                                                                                              | Unchanged                                                                                     | Unchanged                      | Unchanged                     |
| `ASSIGN`    | Assigns user to groups defined in the `assignments` array                                                                                                          | Unchanged                                                                                     | Unchanged                      | Unchanged                     |
| `APPEND`    | Adds user to any group defined by the IdP as a value of the `sourceAttributeName` array that matches the **name** of **whitelisted group** defined in the `filter` | Unchanged                                                                                     | Unchanged                      | Unchanged                     |
| `SYNC`      | Group memberships are mastered by the IdP as a value of the `sourceAttributeName` array that matches the **name** of **whitelisted group** defined in the `filter` | Removed if not defined by IdP in `sourceAttributeName` and matching name of group in `filter` | Unchanged                      | Unchanged                     |
|-------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|--------------------------------|-------------------------------|

> Group provisioning action is processed independently from profile mastering.  You can sync group memberships via SAML with profile mastering disabled.

###### Group Provisioning Action Examples

**Organization Groups**

|----------------------|-----------------------|--------------|
| ID                   | Name                  | Type         |
| -------------------- | --------------------- | ------------ |
| 00gjg5lzfBpn62wuF0g3 | MFA Users             | `OKTA_GROUP` |
| 00glxpsrGUKMnSPss0g3 | Enterprise IdP Users  | `OKTA_GROUP` |
| 00gak46y5hydV6NdM0g4 | Cloud Users           | `OKTA_GROUP` |
| 00ggniobeT51fBl0B0g3 | Everyone              | `BUILT_IN`   |
| 00g51vdPerxUiLarG0g4 | Domain Users          | `APP_GROUP`  |
|----------------------|-----------------------|--------------|

**Existing Group Memberships for IdP User**

|----------------------|--------------|--------------|
| ID                   | Name         | Type         |
| -------------------- | ------------ | ------------ |
| 00gak46y5hydV6NdM0g4 | Cloud Users  | `OKTA_GROUP` |
| 00ggniobeT51fBl0B0g3 | Everyone     | `BUILT_IN`   |
| 00g51vdPerxUiLarG0g4 | Domain Users | `APP_GROUP`  |
|----------------------|--------------|--------------|

**IdP Assertion**

~~~xml
<saml:AttributeStatement
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <saml:Attribute Name="groups">
        <saml:AttributeValue xsi:type="xs:anyType">Enterprise IdP Users</saml:AttributeValue>
        <saml:AttributeValue xsi:type="xs:anyType">West Coast Users</saml:AttributeValue>
        <saml:AttributeValue xsi:type="xs:anyType">Cloud Users</saml:AttributeValue>
    </saml:Attribute>
</saml:AttributeStatement>
~~~

**Provisioning Policy Action Results**

|----------|-----------------------|----------------------|----------------------|-----------------------------------------------------------------+
| Action   | Source Attribute Name | Assignments          | Filter               | Group Membership Results                                        |
| -------- | --------------------- | -------------------- | -------------------- | --------------------------------------------------------------- |
| `NONE`   |                       |                      |                      | Cloud Users, Domain Users, & Everyone                           |
| `ASSIGN` |                       | 00gjg5lzfBpn62wuF0g3 |                      | **MFA Users**, Cloud Users, Domain Users, & Everyone            |
| `APPEND` | Groups                |                      | 00glxpsrGUKMnSPss0g3 | **Enterprise IdP Users**, Cloud Users, Domain Users, & Everyone |
| `SYNC`   | Groups                |                      | 00glxpsrGUKMnSPss0g3 | **Enterprise IdP Users**, Domain Users, & Everyone              |
|----------|-----------------------|----------------------|----------------------|-----------------------------------------------------------------|


#### Account Link Policy Object

Specifies the behavior for linking an IdP user to an existing Okta user

|----------+-------------------------------------------------------+-----------------------------------------------------------+----------+----------+-----------+-----------+------------|
| Property | Description                                           | DataType                                                  | Nullable | Readonly | MinLength | MaxLength | Validation |
| -------- | ----------------------------------------------------- | --------------------------------------------------------- | -------- | -------- | --------- | --------- | ---------- |
| action   | Specifies the account linking action for an IdP user  | [Account Link Action Type](#account-link-action-type)     | FALSE    | FALSE    |           |           |            |
| filter   | Whitelist for link candidates                         | [Account Link Filter Object](#account-link-filter-object) | TRUE     | FALSE    |           |           |            |
| callout  | Webhook settings for the `CALLOUT` action             | [Callout Object](#callout-object)                         | TRUE     | FALSE    |           |           |            |
|----------+-------------------------------------------------------+-----------------------------------------------------------+----------+----------+-----------+-----------+------------|

~~~json
{
  "accountLink": {
    "filter": {
      "groups": {
        "include": [
          "00gjg5lzfBpn62wuF0g3"
        ]
      }
    },
    "action": "AUTO"
  }
}
~~~

##### IdP Type Account Link Policy Actions

The follow account link actions are supported by each IdP provider:

|--------------+----------------------+----------------------+
| Type         | Account Link Actions | Account Link Filters |
| ------------ | -------------------- | -------------------- |
| `SAML2`      | `AUTO`               |                      |
| `FACEBOOK`   | `AUTO` or `CALLOUT`  | `groups`             |
| `GOOGLE`     | `AUTO` or `CALLOUT`  | `groups`             |
| `LINKEDIN`   | `AUTO` or `CALLOUT`  | `groups`             |
|--------------+----------------------+----------------------+

##### Account Link Action Type

The account link action for an IdP user during authentication

|--------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Action Type | Description                                                                                                                                                                            |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AUTO`      | The IdP user will be automatically linked to an Okta user when the transformed IdP user matches an existing Okta user according to [subject match rules](#subject-policy-object)       |
| `CALLOUT`   | Okta will callout to an external web service during authentication to validate the IdP user profile and determine whether to link the IdP user to an Okta user candidate               |
| `DISABLED`  | Okta will never attempt link the IdP user to an existing Okta user, but may still attempt to provision a new Okta user (See [Provisioning Action Type](#user-provisioning-action-type) |
|--------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

~~~json
{
  "accountLink": {
    "filter": {
      "groups": {
        "include": [
          "00gak46y5hydV6NdM0g4"
        ]
      }
    },
    "action": "AUTO"
  }
}
~~~

##### Account Link Filter Object

Specifies group memberships to restrict which users are available for account linking by an IdP

|----------+--------------------------------------------------+-------------------------------------------------------------------------+----------+----------+-----------+-----------+------------|
| Property | Description                                      | DataType                                                                | Nullable | Readonly | MinLength | MaxLength | Validation |
| -------- | ------------------------------------------------ | ----------------------------------------------------------------------- | -------- | -------- | --------- | --------- | ---------- |
| groups   | Group memberships to determine link candidates   | [Groups Account Link Filter Object](#groups-account-link-filter-object) | TRUE     | FALSE    |           |           |            |
|----------+--------------------------------------------------+-------------------------------------------------------------------------+----------+----------+-----------+-----------+------------|

~~~json
{
  "filter": {
    "groups": {
      "include": [
        "00gjg5lzfBpn62wuF0g3"
      ]
    }
  }
}
~~~

###### Groups Account Link Filter Object

Defines a whitelist of group membership to restrict which users are available for account linking by an IdP

|----------+---------------------------------------------------------------+------------------------------+----------+----------+-----------+-----------+------------|
| Property | Description                                                   | DataType                     | Nullable | Readonly | MinLength | MaxLength | Validation |
| -------- | ------------------------------------------------------------- | ---------------------------- | -------- | -------- | --------- | --------- | ---------- |
| include  | Specifies the whitelist of group identifiers to match against | Array of String (Group IDs)  | TRUE     | FALSE    |           |           |            |
|----------+---------------------------------------------------------------+------------------------------+----------+----------+-----------+-----------+------------|

> Group memberships are currently restricted to type `OKTA_GROUP`

~~~json
{
  "groups": {
    "include": [
      "00gjg5lzfBpn62wuF0g3"
    ]
  }
}
~~~

#### Subject Policy Object

Specifies the behavior for establishing, validating, and matching a username for an IdP user

|------------------+-------------------------------------------------------------------------------------------------------------------------------------+--------------------------------------------------------+----------+----------+-----------+-----------+---------------------------------------------------------------------|
| Property         | Description                                                                                                                         | DataType                                               | Nullable | Readonly | MinLength | MaxLength | Validation                                                          |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | -------- | -------- | --------- | --------- | ------------------------------------------------------------------- |
| userNameTemplate | [Okta EL Expression](../getting_started/okta_expression_lang.html) to generate or transform an unique username for the IdP user     | [UserName Template Object](#username-template-object)  | FALSE    | FALSE    |           |           | [Okta EL Expression](../getting_started/okta_expression_lang.html)  |
| filter           | Optional [regular expression pattern](https://en.wikipedia.org/wiki/Regular_expression) used to filter untrusted IdP usernames      | String                                                 | TRUE     | FALSE    | 0         | 1024      |                                                                     |
| matchType        | Determines the Okta user profile attribute match conditions for account linking and authentication of the transformed IdP username  | `USERNAME`, `EMAIL`, or `USERNAME_OR_EMAIL`            | FALSE    | FALSE    |           |           |                                                                     |
|------------------+-------------------------------------------------------------------------------------------------------------------------------------+--------------------------------------------------------+----------+----------+-----------+-----------+---------------------------------------------------------------------|

> Defining a [regular expression pattern](https://en.wikipedia.org/wiki/Regular_expression) to filter untrusted IdP usernames for security purposes is **highly recommended**, especially if you have multiple IdPs connected to your organization.  The filter prevents and IdP from issuing an assertion for **ANY** user including partners or directory users in your Okta organization.
>
> For example, the filter pattern `(\S+@example\.com)` will only allow users that have a `@example.com` username suffix and would reject assertions that have any other suffix such as `@corp.example.com` or `@partner.com`

> Only `SAML2` IdP providers support the `filter` property

~~~json
{
  "subject": {
    "userNameTemplate": {
      "template": "idpuser.subjectNameId"
    },
    "filter": null,
    "matchType": "USERNAME"
  }
}
~~~

##### UserName Template Object

|----------+----------------------------------------------------------------------------------------------------------------------------------+----------+----------+----------+-----------+-----------+--------------------------------------------------------------------|
| Property | Description                                                                                                                      | DataType | Nullable | Readonly | MinLength | MaxLength | Validation                                                         |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- | -------- | -------- | --------- | --------- | ------------------------------------------------------------------ |
| template | [Okta EL Expression](../getting_started/okta_expression_lang.html) to generate or transform an unique username for the IdP user  | String   | FALSE    | FALSE    | 9         | 1024      | [Okta EL Expression](../getting_started/okta_expression_lang.html) |
|----------+----------------------------------------------------------------------------------------------------------------------------------+----------+----------+----------+-----------+-----------+--------------------------------------------------------------------|

> IdP user profile attributes can be referenced with the `idpuser` prefix such as `idpuser.subjectNameId`

> You must define a IdP user profile attribute before it can be referenced in an Okta EL expression which may required first creating an new IdP instance without a base profile property, editing the IdP user profile, then updating the IdP instance with an expression that references the newly added IdP user profile attribute.

~~~json
{
  "userNameTemplate": {
    "template": "idpuser.subjectNameId"
  }
}
~~~

#### OAuth 2.0 Authorization Server Endpoint Object

Endpoint for an [OAuth 2.0 Authorization Server (AS)](https://tools.ietf.org/html/rfc6749#page-18)

|-------------+-----------------------------------------------------------------------------+----------------------------------+----------+----------+-----------+-----------+-------------------------------------------------|
| Property    | Description                                                                 | DataType                         | Nullable | Readonly | MinLength | MaxLength | Validation                                      |
| ----------- | --------------------------------------------------------------------------- | -------------------------------- | -------- | -------- | --------- | --------- | ----------------------------------------------- |
| url         | URL of IdP Authorization Server (AS) endpoint                               | String                           | TRUE     | TRUE     | 11        |           | [RFC 3986](https://tools.ietf.org/html/rfc3986) |
| binding     | HTTP binding used to send request to IdP Authorization Server (AS) endpoint | `HTTP-POST` or `HTTP-Redirect`   | TRUE     | TRUE     |           |           |                                                 |
|-------------+-----------------------------------------------------------------------------+----------------------------------+----------+----------+-----------+-----------+-------------------------------------------------|

> The IdP Authorization Server (AS) endpoints are currently defined as part of the [IdP provider](#identity-provider-type) and are **read-only**

~~~json
{
  "token": {
    "url": "https://graph.facebook.com/v2.5/oauth/access_token",
    "binding": "HTTP-POST"
  }
}
~~~

#### Callout Object

Webhook settings for an IdP provisioning or account link transaction

|---------------+-------------------------------------------------------------------------------+---------------------------------------------------------------+----------+----------+-----------+-----------+-------------------------------------------------|
| Property      | Description                                                                   | DataType                                                      | Nullable | Readonly | MinLength | MaxLength | Validation                                      |
| ------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------- | -------- | -------- | --------- | --------- | ----------------------------------------------- |
| url           | URL of binding-specific endpoint to send the webhook                          | String                                                        | FALSE    | FALSE    | 11        |           | [RFC 3986](https://tools.ietf.org/html/rfc3986) |
| binding       | HTTP binding used to send the webhook                                         | `HTTP-POST` or `HTTP-Redirect`                                | FALSE    | FALSE    |           |           |                                                 |
| authorization | HTTP authorization scheme and credentials to authenticate the webhook request | [Callout Authorization Object](#callout-authorization-object) | TRUE     | FALSE    |           |           |                                                 |
|---------------+-------------------------------------------------------------------------------+---------------------------------------------------------------+----------+----------+-----------+-----------+-------------------------------------------------|

~~~json
{
  "callout": {
    "url": "https://app.example.com",
    "binding": "HTTP-POST",
    "authorization": {
      "basic": {
        "username": "00ugr7Wf8PoSmPXbS0g3",
        "password": "00065EmIVWf7ln0HcVQNy9T_I7qS8rhjujc1hKHaoW"
      }
    }
  }
}
~~~

##### Callout Authorization Object

Webhook authorization settings for an IdP provisioning or account link transaction

|------------+-----------------------------------+-------------------------------------------------------------+----------+----------+-----------+-----------+------------|
| Property   | Description                       | DataType                                                    | Nullable | Readonly | MinLength | MaxLength | Validation |
| ---------- | --------------------------------- | ----------------------------------------------------------- | -------- | -------- | --------- | --------- | ---------- |
| basic      | HTTP Basic Authorization Scheme   | [Basic Authorization Scheme](#basic-authorization-scheme)   | FALSE    | FALSE    |           |           |            |
| bearer     | HTTP Bearer Authorization Scheme  | [Bearer Authorization Scheme](#bearer-authorization-scheme) | FALSE    | FALSE    |           |           |            |
| custom     | Custom key/value HTTP headers     | Object                                                      | FALSE    | FALSE    |           |           |            |
|------------+-----------------------------------+-------------------------------------------------------------+----------+----------+-----------+-----------+------------|

> A null value specifies that no authorization scheme shall be used for a callout

> Authorization schemes are mutually exclusive and a single scheme must be selected

###### Basic Authorization Scheme

|---------------+------------------------------------------+----------+----------+----------+-----------+-----------+------------|
| Property      | Description                              | DataType | Nullable | Readonly | MinLength | MaxLength | Validation |
| ------------- | ---------------------------------------- | -------- | -------- | -------- | --------- | --------- | ---------- |
| username      | unique identifier for service account    | String   | FALSE    | FALSE    |           |           |            |
| password      | service account password                 | String   | FALSE    | FALSE    |           |           |            |
|---------------+------------------------------------------+----------+----------+----------+-----------+-----------+------------|

~~~json
{
  "authorization": {
    "basic": {
      "username": "00ugr7Wf8PoSmPXbS0g3",
      "password": "00065EmIVWf7ln0HcVQNy9T_I7qS8rhjujc1hKHaoW"
    }
  }
}
~~~

###### Bearer Authorization Scheme

|---------------+----------------------+----------+----------+----------+-----------+-----------+------------|
| Property      | Description          | DataType | Nullable | Readonly | MinLength | MaxLength | Validation |
| ------------- | -------------------- | -------- | -------- | -------- | --------- | --------- | ---------- |
| token         | bearer token value   | String   | FALSE    | FALSE    |           |           |            |
|---------------+----------------------+----------+----------+----------+-----------+-----------+------------|

~~~json
{
  "authorization": {
    "bearer": {
      "token": "00065EmIVWf7ln0HcVQNy9T_I7qS8rhjujc1hKHaoW"
    }
  }
}
~~~

### Links Object

Specifies link relations (See [Web Linking](http://tools.ietf.org/html/rfc5988)) available for the IdP using the [JSON Hypertext Application Language](http://tools.ietf.org/html/draft-kelly-json-hal-06) specification.  This object is used for dynamic discovery of related resources and lifecycle operations.

|--------------------+-----------------------------------------------------------------------------------------------------------------------------------|
| Link Relation Type | Description                                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| self               | The primary URL for the IdP                                                                                                       |
| authorize          | OAuth 2.0 authorization endpoint for the IdP [OAuth 2.0 Authorization Code Flow](https://tools.ietf.org/html/rfc6749#section-4.1) |
| clientRedirectUri  | Redirect URI for [OAuth 2.0 Authorization Code Flow](https://tools.ietf.org/html/rfc6749#section-4.1)                             |
| metadata           | Federation metadata document for IdP (e.g SAML 2.0 Metadata)                                                                      |
| acs                | SAML 2.0 Assertion Consumer Service URL for Okta SP                                                                               |
| users              | IdP Users                                                                                                                         |
|--------------------+-----------------------------------------------------------------------------------------------------------------------------------|

> The Links Object is **read-only**.

## Identity Provider Transaction Model

The Identity Provider Transaction Model represents a account link or just-in-time (JIT) provisioning transaction

### Example

~~~json
{
  "id": "satvklBYyJmwa6qOg0g3",
  "status": "ACCOUNT_JIT",
  "expiresAt": "2016-01-03T23:52:58.000Z",
  "created": "2016-01-03T23:44:38.000Z",
  "idp": {
    "id": "0oabmluDNh2JZi8lt0g4",
    "name": "Facebook",
    "type": "FACEBOOK"
  },
  "context": {
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36",
    "ipAddress": "54.197.192.167"
  },
  "_links": {
    "source": {
      "href": "https://example.okta.com/api/v1/idps/tx/satvklBYyJmwa6qOg0g3/source"
    },
    "target": {
      "href": "https://example.okta.com/api/v1/idps/tx/satvklBYyJmwa6qOg0g3/target"
    },
    "cancel": {
      "href": "https://example.okta.com/api/v1/idps/tx/satvklBYyJmwa6qOg0g3/cancel",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "provision": {
      "href": "https://example.okta.com/api/v1/idps/tx/satvklBYyJmwa6qOg0g3/lifecycle/provision",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    }
  }
}
~~~

### Identity Provider Transaction Attributes

All IdP transactions have the following properties:

|---------------+----------------------------------------------------------------------------------------+-----------------------------------------------------------------+----------|--------|----------|-----------|-----------+------------|
| Property      | Description                                                                            | DataType                                                        | Nullable | Unique | Readonly | MinLength | MaxLength | Validation |
| ------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------- | -------- | ------ | -------- | --------- | --------- | ---------- |
| id            | unique key for transaction                                                             | String                                                          | FALSE    | TRUE   | TRUE     |           |           |            |
| status        | status of transaction                                                                  | `ACCOUNT_JIT`, `ACCOUNT_LINK` or `SUCCESS`                      | FALSE    | FALSE  | TRUE     |           |           |            |
| created       | timestamp when transaction was created                                                 | Date                                                            | FALSE    | FALSE  | TRUE     |           |           |            |
| expiresAt     | timestamp when transaction expires                                                     | Date                                                            | FALSE    | FALSE  | TRUE     |           |           |            |
| sessionToken  | ephemeral [one-time token](authn.html#session-token) used to bootstrap an Okta session | String                                                          | TRUE     | FALSE  | TRUE     |           |           |            |
| idp           | identity provider for authenticated user                                               | [IdP Authority Object](#identity-provider-authority-object)     | FALSE    | FALSE  | TRUE     |           |           |            |
| context       | optional authentication context for transaction                                        | [Context Object](#identity-provider-transaction-context-object) | FALSE    | FALSE  | TRUE     |           |           |            |
| _links        | [discoverable resources](#links-object) related to the transaction                     | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06)  | TRUE     | FALSE  | TRUE     |           |           |            |
| _embedded     | embedded resources related to the transaction                                          | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06)  | TRUE     | FALSE  | TRUE     |           |           |            |
|---------------+----------------------------------------------------------------------------------------+-----------------------------------------------------------------+----------|--------|----------|-----------|-----------+------------|

> The `sessionToken` is only available for completed transactions with the `SUCCESS` status

#### Identity Provider Authority Object

Metadata about the IdP that authenticated the user

|----------+-------------------------+---------------------------------------------------+----------|--------|----------|-----------|-----------+------------|
| Property | Description             | DataType                                          | Nullable | Unique | Readonly | MinLength | MaxLength | Validation |
| -------- | ----------------------- | ------------------------------------------------- | -------- | ------ | -------- | --------- | --------- | ---------- |
| id       | unique key for the IdP  | String                                            | FALSE    | TRUE   | TRUE     |           |           |            |
| name     | unique name for the IdP | String                                            | FALSE    | FALSE  | TRUE     |           |           |            |
| type     | type of IdP             | [Identity Provider Type](#identity-provider-type) | FALSE    | FALSE  | TRUE     |           |           |            |
|----------+-------------------------+---------------------------------------------------+----------|--------|----------|-----------|-----------+------------|

~~~json
{
  "idp": {
    "id": "0oabmluDNh2JZi8lt0g4",
    "name": "Facebook",
    "type": "FACEBOOK"
  }
}
~~~

#### Identity Provider Transaction Context Object

Additional context that describes the HTTP client for the transaction

|---------------+----------------------------------------+----------------------------+----------|--------|----------|-----------|-----------+------------|
| Property      | Description                            | DataType                   | Nullable | Unique | Readonly | MinLength | MaxLength | Validation |
| ------------- | -------------------------------------- | -------------------------- | -------- | ------ | -------- | --------- | --------- | ---------- |
| userAgent     | HTTP User Agent string for transaction | String                     | FALSE    | FALSE  | TRUE     |           |           |            |
| ipAddress     | Client IP Address for transaction      | String                     | FALSE    | FALSE  | TRUE     |           |           |            |
|---------------+----------------------------------------+----------------------------+----------|--------|----------|-----------|-----------+------------|

~~~json
{
  "context": {
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36",
    "ipAddress": "54.197.192.167"
  }
}
~~~

### Links Object

Specifies link relations (See [Web Linking](http://tools.ietf.org/html/rfc5988)) available for the IdP transaction using the [JSON Hypertext Application Language](http://tools.ietf.org/html/draft-kelly-json-hal-06) specification.  This object is used for dynamic discovery of related resources and lifecycle operations.

|--------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Link Relation Type | Description                                                                                                                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| source             | [IdP user](#identity-provider-user-model) for the transaction                                                                                                                                       |
| target             | Transformed [Okta user profile](users.html#profile-object) for the transaction via UD Profile Mappings for the IdP                                                                                  |
| users              | [Okta user](users.html#user-model) candidates for the account link transaction that match the IdP's [account link policy](#account-link-policy-object) and [subject policy](#subject-policy-object) |
| provision          | Lifecycle operation to just-in-time provision a new [Okta user](users.html#user-model) for the IdP user                                                                                             |
| next               | Completes the transaction                                                                                                                                                                           |
| cancel             | Cancels the transaction                                                                                                                                                                             |
|--------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

> The Links Object is **read-only**.

## Identity Provider Key Credential Model

The IdP key credential model defines a [JSON Web Key](https://tools.ietf.org/html/rfc7517) for a signature or encryption credential for an IdP.

### Example

~~~json
{
  "kid": "74bb2164-e0c8-4457-862b-7c29ba6cd2c9",
  "created": "2016-01-03T18:15:47.000Z",
  "lastUpdated": "2016-01-03T18:15:47.000Z",
  "e": "65537",
  "n": "101438407598598116085679865987760095721749307901605456708912786847324207000576780508113360584555007890315805735307890113536927352312915634368993759211767770602174860126854831344273970871509573365292777620005537635317282520456901584213746937262823585533063042033441296629204165064680610660631365266976782082747",
  "kty": "RSA",
  "use": "sig",
  "x5c": [
    "MIIDnjCCAoagAwIBAgIGAVG3MN+PMA0GCSqGSIb3DQEBBQUAMIGPMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxEDAOBgNVBAMMB2V4YW1wbGUxHDAaBgkqhkiG9w0BCQEWDWluZm9Ab2t0YS5jb20wHhcNMTUxMjE4MjIyMjMyWhcNMjUxMjE4MjIyMzMyWjCBjzELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAUBgNVBAcMDVNhbiBGcmFuY2lzY28xDTALBgNVBAoMBE9rdGExFDASBgNVBAsMC1NTT1Byb3ZpZGVyMRAwDgYDVQQDDAdleGFtcGxlMRwwGgYJKoZIhvcNAQkBFg1pbmZvQG9rdGEuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtcnyvuVCrsFEKCwHDenS3Ocjed8eWDv3zLtD2K/iZfE8BMj2wpTfn6Ry8zCYey3mWlKdxIybnV9amrujGRnE0ab6Q16v9D6RlFQLOG6dwqoRKuZy33Uyg8PGdEudZjGbWuKCqqXEp+UKALJHV+k4wWeVH8g5d1n3KyR2TVajVJpCrPhLFmq1Il4G/IUnPe4MvjXqB6CpKkog1+ThWsItPRJPAM+RweFHXq7KfChXsYE7Mmfuly8sDQlvBmQyxZnFHVuiPfCvGHJjpvHy11YlHdOjfgqHRvZbmo30+y0X/oY/yV4YEJ00LL6eJWU4wi7ViY3HP6/VCdRjHoRdr5L/DwIDAQABMA0GCSqGSIb3DQEBBQUAA4IBAQCzzhOFkvyYLNFj2WDcq1YqD4sBy1iCia9QpRH3rjQvMKDwQDYWbi6EdOX0TQ/IYR7UWGj+2pXd6v0t33lYtoKocp/4lUvT3tfBnWZ5KnObi+J2uY2teUqoYkASN7F+GRPVOuMVoVgm05ss8tuMb2dLc9vsx93sDt+XlMTv/2qi5VPwaDtqduKkzwW9lUfn4xIMkTiVvCpe0X2HneD2Bpuao3/U8Rk0uiPfq6TooWaoW3kjsmErhEAs9bA7xuqo1KKY9CdHcFhkSsMhoeaZylZHtzbnoipUlQKSLMdJQiiYZQ0bYL83/Ta9fulr1EERICMFt3GUmtYaZZKHpWSfdJp9"
  ],
  "x5t": "noocvK-9pzU-n35eimPK16zYEYk"
}
~~~

### Identity Provider Key Credential Properties

IdP credential keys have the following properties:

|------------------+--------------------------------------------------------------------------------+-----------------------------------------------------------------------------|----------|--------|----------|-----------|-----------+------------|
| Property         | Description                                                                    | DataType                                                                    | Nullable | Unique | Readonly | MinLength | MaxLength | Validation |
| ---------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------- | -------- | ------ | -------- | --------- | --------- | ---------- |
| kid              | unique identifier for the key                                                  | String                                                                      | FALSE    | TRUE   | TRUE     |           |           |            |
| created          | timestamp when key was added to the key store                                  | Date                                                                        | FALSE    | FALSE  | TRUE     |           |           |            |
| lastUpdated      | timestamp when key was last updated                                            | Date                                                                        | FALSE    | FALSE  | TRUE     |           |           |            |
| x5c              | base64-encoded X.509 certificate chain with DER encoding                       | Array                                                                       | FALSE    | TRUE   | FALSE    |           |           |            |
| x5t              | base64url-encoded SHA-1 thumbprint of the DER encoding of an X.509 certificate | String                                                                      | FALSE    | TRUE   | TRUE     |           |           |            |
| kty              | identifies the cryptographic algorithm family used with the key                | `RSA`                                                                       | FALSE    | FALSE  | TRUE     |           |           |            |
| use              | intended use of the public key                                                 | `sig`                                                                       | FALSE    | FALSE  | TRUE     |           |           |            |
| e                | the exponent value for the RSA public key                                      | String                                                                      | FALSE    | TRUE   | TRUE     |           |           |            |
| n                | the modulus value for the RSA public key                                       | String                                                                      | FALSE    | TRUE   | TRUE     |           |           |            |
|------------------+--------------------------------------------------------------------------------+-----------------------------------------------------------------------------|----------|--------|----------|-----------|-----------+------------|

## Identity Provider User Model

The Identity Provider User Model represents a linked user and their IdP user profile

### Example

~~~json
{
  "id": "00ulwodIu7wCfdiVR0g3",
  "externalId": "saml.jackson@example.com",
  "created": "2015-03-10T22:24:55.000Z",
  "lastUpdated": "2016-01-01T02:03:56.000Z",
  "profile": {
    "lastName": "Jackson",
    "subjectNameQualifier": "example.com",
    "subjectSpNameQualifier": "urn:federation:example",
    "authnContextClassRef": null,
    "subjectNameId": "saml.jackson@example.com",
    "subjectConfirmationAddress": null,
    "displayName": "Saml Jackson",
    "mobilePhone": "+1-415-555-5141",
    "email": "saml.jackson@example.com",
    "subjectNameFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
    "firstName": "Saml",
    "subjectSpProvidedId": null,
    "subjectConfirmationMethod": null
  },
  "_links": {
    "self": {
      "href": "https://example.okta.com/api/v1/idps/0oa1k5d68qR2954hb0g4/users/00ulwodIu7wCfdiVR0g3",
      "hints": {
        "allow": [
          "GET",
          "DELETE"
        ]
      }
    },
    "idp": {
      "href": "https://example.okta.com/api/v1/idps/0oa1k5d68qR2954hb0g4"
    },
    "user": {
      "href": "https://example.okta.com/api/v1/users/00ulwodIu7wCfdiVR0g3"
    }
  }
}
~~~

### Identity Provider User Properties

All linked IdP users have the following properties:

|------------------+--------------------------------------------------------------+---------------------------------------------------------------------------------|----------|--------|----------|-----------|-----------+------------|
| Property         | Description                                                  | DataType                                                                        | Nullable | Unique | Readonly | MinLength | MaxLength | Validation |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------- | -------- | ------ | -------- | --------- | --------- | ---------- |
| id               | unique key of [User](Users.html)                             | String                                                                          | FALSE    | TRUE   | TRUE     |           |           |            |
| externalId       | unique IdP-specific identifier for user                      | String                                                                          | FALSE    | TRUE   | TRUE     |           | 512       |            |
| created          | timestamp when IdP user was created                          | Date                                                                            | FALSE    | FALSE  | TRUE     |           |           |            |
| lastUpdated      | timestamp when IdP user was last updated                     | Date                                                                            | FALSE    | FALSE  | TRUE     |           |           |            |
| profile          | IdP-specific profile for the user                            | [Identity Provider User Profile Object](#identity-provider-user-profile-object) | FALSE    | FALSE  | TRUE     |           |           |            |
| _embedded        | embedded resources related to the IdP user                   | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06)                  | TRUE     | FALSE  | TRUE     |           |           |            |
| _links           | discoverable resources related to the IdP user               | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06)                  | TRUE     | FALSE  | TRUE     |           |           |            |
|------------------+--------------------------------------------------------------+---------------------------------------------------------------------------------|----------|--------|----------|-----------|-----------+------------|

### Identity Provider User Profile Object

Identity Provider user profiles are IdP-specific but may be customized by the Profile Editor in the Okta Admin UI.

![IdP Profile Editor UI](/assets/img/okta-admin-ui-profile-editor-idp.png)

> Okta variable names have reserved characters that may conflict with the name of an IdP assertion attribute.  You can use the **External name** to define the attribute name as defined in an IdP assertion such as a SAML attribute name.

![IdP Profile Editor Attribute Modal UI](/assets/img/okta-admin-ui-profile-editor-attribute-idp.png)

#### Example Profile Object

~~~json
{
  "profile": {
    "lastName": "Jackson",
    "subjectNameQualifier": "example.com",
    "subjectSpNameQualifier": "urn:federation:example",
    "authnContextClassRef": null,
    "subjectNameId": "saml.jackson@example.com",
    "subjectConfirmationAddress": null,
    "displayName": "Saml Jackson",
    "mobilePhone": "+1-415-555-5141",
    "email": "saml.jackson@example.com",
    "subjectNameFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
    "firstName": "Saml",
    "subjectSpProvidedId": null,
    "subjectConfirmationMethod": null
  }
}
~~~

### Links Object

Specifies link relations (See [Web Linking](http://tools.ietf.org/html/rfc5988)) available for the IdP user using the [JSON Hypertext Application Language](http://tools.ietf.org/html/draft-kelly-json-hal-06) specification.  This object is used for dynamic discovery of related resources and lifecycle operations.

|--------------------+------------------------------------|
| Link Relation Type | Description                        |
| ------------------ | ---------------------------------- |
| self               | The primary URL for the IdP user   |
| idp                | The IdP that issued the identity   |
| users              | The linked [Okta user](users.html) |
|--------------------+------------------------------------|

> The Links Object is **read-only**.

## Identity Provider Operations

### Add Identity Provider
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /idps</span>

Adds a new IdP to your organization

- [Add SAML 2.0 Identity Provider](#add-saml-20-identity-provider)
- [Add Facebook Identity Provider](#add-facebook-identity-provider)
- [Add Google Identity Provider](#add-google-identity-provider)
- [Add LinkedIn Identity Provider](#add-linkedin-identity-provider)

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description       | Param Type | DataType                                      | Required | Default
--------- | ----------------- | ---------- | --------------------------------------------- | -------- | -------
idp       | IdP settings      | Body       | [Identity Provider](#identity-provider-model) | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

The created [Identity Provider](#identity-provider-model)

#### Add SAML 2.0 Identity Provider
{:.api .api-operation}

Adds a new `SAML2` type IdP to your organization

> You must first add the IdP's signature certificate to the IdP key store before you can add a SAML 2.0 IdP with a `kid` credential reference

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{

}' "https://${org}.okta.com/api/v1/idps"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json

~~~

#### Add Facebook Identity Provider
{:.api .api-operation}

Adds a new `FACEBOOK` type IdP to your organization

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{

}' "https://${org}.okta.com/api/v1/idps"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json

~~~

#### Add Google Identity Provider
{:.api .api-operation}

Adds a new `Google` type IdP to your organization

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{

}' "https://${org}.okta.com/api/v1/idps"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json

~~~

#### Add LinkedIn Identity Provider
{:.api .api-operation}

Adds a new `LINKEDIN` type IdP to your organization

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{

}' "https://${org}.okta.com/api/v1/idps"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json

~~~

### Get Identity Provider
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /idps/*:id*</span>

Fetches a specific IdP by `id` from your organization

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description     | Param Type | DataType | Required | Default
--------- | --------------- | ---------- | -------- | -------- | -------
id        | `id` of an IdP  | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[Identity Provider](#identity-provider-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/idps/0oabzr1fHCHDNsiko0g4"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json

~~~

### List Identity Providers
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /idps</span>

Enumerates IdPs in your organization with pagination. A subset of IdPs can be returned that match a supported filter expression or query.

- [List Identity Providers with Defaults](#list-identity-providers-with-defaults)
- [Search Identity Providers](#search-identity-providers)
- [List Identity Providers with Type](#list-identity-providers-with-type)

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                                                                | Param Type | DataType | Required | Default
--------- | ------------------------------------------------------------------------------------------ | ---------- | -------- | -------- | -------
q         | Searches the `name` property of IdPs for matching value                                    | Query      | String   | FALSE    |
type      | Filters IdPs by `type`                                                                     | Query      | String   | FALSE    |
limit     | Specifies the number of IdP results in a page                                              | Query      | Number   | FALSE    | 20
after     | Specifies the pagination cursor for the next page of IdPs                                  | Query      | String   | FALSE    |

> The `after` cursor should treated as an opaque value and obtained through the next link relation. See [Pagination](/docs/api/getting_started/design_principles.html#pagination)

> Search currently performs a startsWith match but it should be considered an implementation detail and may change without notice in the future

##### Response Parameters
{:.api .api-response .api-response-params}

Array of [Identity Provider](#identity-provider-model)

#### List Identity Providers with Defaults
{:.api .api-operation}

Enumerates all IdPs in your organization.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/idps"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 200 OK
Content-Type: application/json
Link: <https://your-domain.okta.com/api/v1/idps?limit=20>; rel="self"
Link: <https://your-domain.okta.com/api/v1/idps?after=0oaxdqpA88PtFNmhu0g3&limit=20>; rel="next"

[

]
~~~

#### Search Identity Providers
{:.api .api-operation}

Searches for IdPs by `name` in your organization.

> Search currently performs a startsWith match but it should be considered an implementation detail and may change without notice in the future. Exact matches will always be returned before partial matches

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/idps?q=Example&limit=10"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[

]
~~~

#### List Identity Providers with Type
{:.api .api-operation}

Enumerates all IdPs with a [specific type](#identity-provider-type)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/idps?type=SAML2"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 200 OK
Content-Type: application/json
Link: <https://your-domain.okta.com/api/v1/idps?limit=20>; rel="self"
Link: <https://your-domain.okta.com/api/v1/idps?after=0oaxdqpA88PtFNmhu0g3&limit=20>; rel="next"

[

]
~~~

### Update Identity Provider
{:.api .api-operation}

<span class="api-uri-template api-uri-put"><span class="api-label">PUT</span> /idps/*:id*</span>

Updates the configuration for an IdP

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                       | Param Type | DataType                                      | Required | Default
--------- | --------------------------------- | ---------- | --------------------------------------------- | -------- | -------
id        | id of the group to update         | URL        | String                                        | TRUE     |
idp       | Updated configuration for the IdP | Body       | [Identity Provider](#identity-provider-model) | TRUE     |

> All properties must be specified when updating IdP configuration, **partial updates are not supported!**

##### Response Parameters
{:.api .api-response .api-response-params}

Updated [Identity Provider](#identity-provider-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X PUT \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{

}' "https://${org}.okta.com/api/v1/idps/0oa1k5d68qR2954hb0g4"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json

~~~

### Delete Identity Provider
{:.api .api-operation}

<span class="api-uri-template api-uri-delete"><span class="api-label">DELETE</span> /idps/*:id*</span>

Removes an IdP from your organization.

> All existing IdP users will be automatically unlinked with the highest order profile master taking precedence for each IdP user
>
> Unlinked users will keep their existing authentication provider such as `FEDERATION` or `SOCIAL`.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                 | Param Type | Data Type | Required | Default
--------- | --------------------------- | ---------- | --------- | -------- | -------
id        | `id` of the IdP to delete   | URL        | String    | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

N/A

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/idps/0oa1k5d68qR2954hb0g4"
~~~


##### Response Example
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 204 No Content
~~~

## Identity Provider Lifecycle Operations

### Activate Identity Provider
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /idps/*:id*/lifecycle/activate</span>

Activates an inactive IdP.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description             | Param Type | DataType | Required | Default
--------- | ----------------------- | ---------- | -------- | -------- | -------
id        | `id` of IdP to activate | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

Activated [Identity Provider](#identity-provider-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/idps/0oa1k5d68qR2954hb0g4/lifecycle/activate"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json

~~~

### Deactivate Identity Provider
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /idps/*:id*/lifecycle/deactivate</span>

Deactivates an active IdP.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description               | Param Type | DataType | Required | Default
--------- | ------------------------- | ---------- | -------- | -------- | -------
id        | `id` of IdP to deactivate | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

Deactivated [Identity Provider](#identity-provider-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/idps/0oa1k5d68qR2954hb0g4/lifecycle/deactivate"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json

~~~

## Identity Provider Transaction Operations

Operations for just-in-time provisioning or account linking with a `CALLOUT` action (webhook)

### Get Identity Provider Transaction
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /idps/tx/*:tid*</span>

Fetches an IdP transaction by `id`

> You must use a `CALLOUT` action for [user provisioning](#user-provisioning-action-type) or [account linking](#account-link-action-type) to obtain an IdP transaction `id`

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                | Param Type | DataType | Required | Default
--------- | -------------------------- | ---------- | -------- | -------- | -------
tid       | `id` of an IdP transaction | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[Identity Provider Transaction](#identity-provider-transaction-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/idps/tx/satvklBYyJmwa6qOg0g3"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "satvklBYyJmwa6qOg0g3",
  "status": "ACCOUNT_JIT",
  "expiresAt": "2016-01-03T23:52:58.000Z",
  "created": "2016-01-03T23:44:38.000Z",
  "idp": {
    "id": "0oabmluDNh2JZi8lt0g4",
    "name": "Facebook",
    "type": "FACEBOOK"
  },
  "context": {
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36",
    "ipAddress": "127.0.0.1"
  },
  "_links": {
    "source": {
      "href": "https://example.okta.com/api/v1/idps/tx/satvklBYyJmwa6qOg0g3/source"
    },
    "target": {
      "href": "https://example.okta.com/api/v1/idps/tx/satvklBYyJmwa6qOg0g3/target"
    },
    "cancel": {
      "href": "https://example.okta.com/api/v1/idps/tx/satvklBYyJmwa6qOg0g3/cancel",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "provision": {
      "href": "https://example.okta.com/api/v1/idps/tx/satvklBYyJmwa6qOg0g3/lifecycle/provision",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    }
  }
}
~~~

### Get Source IdP User for IdP Transaction
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /idps/tx/*:tid*/source</span>

Fetches the source [IdP user](#identity-provider-user-model) for a transaction

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                | Param Type | DataType | Required | Default
--------- | -------------------------- | ---------- | -------- | -------- | -------
tid       | `id` of an IdP transaction | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[Identity Provider User](#identity-provider-user-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/idps/tx/satvklBYyJmwa6qOg0g3/source"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "externalId": "1437424479920471",
  "profile": {
    "middleName": null,
    "lastName": "Zuckersky",
    "email": "mark_drvbrjr_zuckersky@tfbnw.net",
    "displayName": "Mark Zuckersky",
    "firstName": "Mark",
    "profile": "https://www.facebook.com/app_scoped_user_id/1437424479920471/"
  },
  "_links": {
    "idp": {
      "href": "https://example.okta.com/api/v1/idps/0oabmluDNh2JZi8lt0g4"
    }
  }
}
~~~

### Get Target User for IdP Provision Transaction
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /idps/tx/*:tid*/target</span>

Fetches the target transformed [Okta user profile](users.html#profile-object) for a just-in-time provisioning transaction

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                | Param Type | DataType | Required | Default
--------- | -------------------------- | ---------- | -------- | -------- | -------
tid       | `id` of an IdP transaction | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[Trasformed Okta User Profile](users.html#profile-object)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/idps/tx/satvklBYyJmwa6qOg0g3/source"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "profile": {
    "middleName": null,
    "streetAddress": null,
    "lastName": "Zuckersky",
    "secondEmail": null,
    "postAddress": null,
    "state": null,
    "countryCode": null,
    "city": null,
    "profileUrl": "https://www.facebook.com/app_scoped_user_id/1437424479920471/",
    "primaryPhone": null,
    "mobilePhone": null,
    "email": "mark_drvbrjr_zuckersky@tfbnw.net",
    "zipCode": null,
    "login": "mark_drvbrjr_zuckersky@tfbnw.net",
    "displayName": "Mark Zuckersky",
    "firstName": "Mark",
    "typeId": null
  }
}
~~~

### List Users for IdP Link Transaction
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /idps/tx/*:tid*/users</span>

Enumerates the candidate [Okta users](users.html#user-model) for an account link transaction

> Link candidates are determined by the IdP's [account link policy](#account-link-policy-object) and [subject policy](#subject-policy-object)

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                | Param Type | DataType | Required | Default
--------- | -------------------------- | ---------- | -------- | -------- | -------
tid       | `id` of an IdP transaction | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

Array of [Okta User](users.html#user-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/idps/tx/satvklBYyJmwa6qOg0g3/users"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[
  {
    "id": "00uc8wfZSNWKlFGZa0g4",
    "status": "ACTIVE",
    "created": "2016-01-03T23:55:34.000Z",
    "activated": "2016-01-03T23:55:38.000Z",
    "statusChanged": "2016-01-03T23:55:38.000Z",
    "lastLogin": null,
    "lastUpdated": "2016-01-03T23:55:38.000Z",
    "passwordChanged": null,
    "profile": {
      "login": "mark_drvbrjr_zuckersky@tfbnw.net",
      "mobilePhone": null,
      "email": "mark_drvbrjr_zuckersky@tfbnw.net",
      "secondEmail": null,
      "firstName": "Mark",
      "lastName": "Zuckersky",
      "profileUrl": "https://www.facebook.com/app_scoped_user_id/1437424479920471/",
      "displayName": "Mark Zuckersky"
    },
    "credentials": {
      "provider": {
        "type": "SOCIAL",
        "name": "SOCIAL"
      }
    },
    "_links": {
      "suspend": {
        "href": "https://example.okta.com/api/v1/users/00uc8wfZSNWKlFGZa0g4/lifecycle/suspend",
        "method": "POST"
      },
      "resetPassword": {
        "href": "https://example.okta.com/api/v1/users/00uc8wfZSNWKlFGZa0g4/lifecycle/reset_password",
        "method": "POST"
      },
      "self": {
        "href": "https://example.okta.com/api/v1/users/00uc8wfZSNWKlFGZa0g4"
      },
      "changeRecoveryQuestion": {
        "href": "https://example.okta.com/api/v1/users/00uc8wfZSNWKlFGZa0g4/credentials/change_recovery_question",
        "method": "POST"
      },
      "deactivate": {
        "href": "https://example.okta.com/api/v1/users/00uc8wfZSNWKlFGZa0g4/lifecycle/deactivate",
        "method": "POST"
      },
      "confirm": {
        "href": "https://example.okta.com/api/v1/idps/tx/satvkokI9JsOxqsjz0g3/lifecycle/confirm/00uc8wfZSNWKlFGZa0g4",
        "method": "POST"
      }
    }
  }
]
~~~

### Provision IdP User
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /idps/tx/*:tid*/lifecycle/provision</span>

Just-in-time provisions an IdP user as a new Okta user

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                        | Param Type | DataType                                              | Required | Default
--------- | -------------------------------------------------- | ---------- | ----------------------------------------------------- | -------- | --------------------------------
tid       | `id` of an IdP transaction                         | URL        | String                                                | TRUE     |
profile   | profile for [Okta user](users.html#profile-object) | Body       | [Okta User Profile Object](users.html#profile-object) | FALSE    | UD transformed Okta user profile

##### Response Parameters
{:.api .api-response .api-response-params}

[Identity Provider Transaction](#identity-provider-transaction-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "userType": "Social"
  }
}' "https://${org}.okta.com/api/v1/idps/tx/satvkokI9JsOxqsjz0g3/lifecycle/provision"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "satvkokI9JsOxqsjz0g3",
  "status": "SUCCESS",
  "sessionToken": "20111ItcRRtx_HOKguQRqx6YIeFL3L6cQhpqSCvLOD-fpj-3K53aqXN",
  "expiresAt": "2016-01-04T02:40:43.000Z",
  "created": "2016-01-04T02:32:23.000Z",
  "idp": {
    "id": "0oabmluDNh2JZi8lt0g4",
    "name": "Facebook",
    "type": "FACEBOOK"
  },
  "context": {
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36",
    "ipAddress": "127.0.0.1"
  },
  "_links": {
    "next": {
      "href": "https://example.okta.com/api/v1/idps/tx/satvkokI9JsOxqsjz0g3/finish",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "cancel": {
      "href": "https://example.okta.com/api/v1/idps/tx/satvkokI9JsOxqsjz0g3/cancel",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    }
  }
}
~~~

### Link IdP User
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /idps/tx/*:tid*/lifecycle/confirm/*:uid*</span>

Links an IdP user to an [existing Okta user](#list-users-for-idp-link-transaction)

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                                                 | Param Type | DataType                                              | Required | Default
--------- | --------------------------------------------------------------------------- | ---------- | ----------------------------------------------------- | -------- | --------------------------------
tid       | `id` of an IdP transaction                                                  | URL        | String                                                | TRUE     |
uid       | `id` of an Okta user [link candidate](#list-users-for-idp-link-transaction) | URL        | String                                                | TRUE     |
profile   | profile for [Okta user](users.html#profile-object)                          | Body       | [Okta User Profile Object](users.html#profile-object) | FALSE    |

##### Response Parameters
{:.api .api-response .api-response-params}

[Identity Provider Transaction](#identity-provider-transaction-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "userType": "Social"
  }
}' "https://${org}.okta.com/api/v1/idps/tx/satvkokI9JsOxqsjz0g3/lifecycle/confirm/00uc8ydZUPiwS2Xud0g4"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "satvkokI9JsOxqsjz0g3",
  "status": "SUCCESS",
  "sessionToken": "20111FLDl04JoQdl-NJOB9A6HosTSuHtQQUmCBhdEvnE4XEInod0Sg_",
  "expiresAt": "2016-01-04T02:53:13.000Z",
  "created": "2016-01-04T02:44:53.000Z",
  "idp": {
    "id": "0oabmluDNh2JZi8lt0g4",
    "name": "Facebook",
    "type": "FACEBOOK"
  },
  "context": {
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36",
    "ipAddress": "127.0.0.1"
  },
  "_links": {
    "next": {
      "href": "https://example.okta.com/api/v1/idps/tx/satvkokI9JsOxqsjz0g3/finish",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    },
    "cancel": {
      "href": "https://example.okta.com/api/v1/idps/tx/satvkokI9JsOxqsjz0g3/cancel",
      "hints": {
        "allow": [
          "POST"
        ]
      }
    }
  }
}
~~~

## Identity Provider Key Store Operations

### Add X.509 Certificate Public Key
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /idps/credentials/keys</span>

Adds a new X.509 certificate credential to the IdP key store

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                              | Param Type | DataType        | Required | Default
--------- | -------------------------------------------------------- | ---------- | --------------- | -------- | -------
x5c       | base64-encoded X.509 certificate chain with DER encoding | Body       | Array of String | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[Identity Provider Key Credential](#identity-provider-key-credential-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "x5c": [
    "MIIDnjCCAoagAwIBAgIGAVG3MN+PMA0GCSqGSIb3DQEBBQUAMIGPMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxEDAOBgNVBAMMB2V4YW1wbGUxHDAaBgkqhkiG9w0BCQEWDWluZm9Ab2t0YS5jb20wHhcNMTUxMjE4MjIyMjMyWhcNMjUxMjE4MjIyMzMyWjCBjzELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAUBgNVBAcMDVNhbiBGcmFuY2lzY28xDTALBgNVBAoMBE9rdGExFDASBgNVBAsMC1NTT1Byb3ZpZGVyMRAwDgYDVQQDDAdleGFtcGxlMRwwGgYJKoZIhvcNAQkBFg1pbmZvQG9rdGEuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtcnyvuVCrsFEKCwHDenS3Ocjed8eWDv3zLtD2K/iZfE8BMj2wpTfn6Ry8zCYey3mWlKdxIybnV9amrujGRnE0ab6Q16v9D6RlFQLOG6dwqoRKuZy33Uyg8PGdEudZjGbWuKCqqXEp+UKALJHV+k4wWeVH8g5d1n3KyR2TVajVJpCrPhLFmq1Il4G/IUnPe4MvjXqB6CpKkog1+ThWsItPRJPAM+RweFHXq7KfChXsYE7Mmfuly8sDQlvBmQyxZnFHVuiPfCvGHJjpvHy11YlHdOjfgqHRvZbmo30+y0X/oY/yV4YEJ00LL6eJWU4wi7ViY3HP6/VCdRjHoRdr5L/DwIDAQABMA0GCSqGSIb3DQEBBQUAA4IBAQCzzhOFkvyYLNFj2WDcq1YqD4sBy1iCia9QpRH3rjQvMKDwQDYWbi6EdOX0TQ/IYR7UWGj+2pXd6v0t33lYtoKocp/4lUvT3tfBnWZ5KnObi+J2uY2teUqoYkASN7F+GRPVOuMVoVgm05ss8tuMb2dLc9vsx93sDt+XlMTv/2qi5VPwaDtqduKkzwW9lUfn4xIMkTiVvCpe0X2HneD2Bpuao3/U8Rk0uiPfq6TooWaoW3kjsmErhEAs9bA7xuqo1KKY9CdHcFhkSsMhoeaZylZHtzbnoipUlQKSLMdJQiiYZQ0bYL83/Ta9fulr1EERICMFt3GUmtYaZZKHpWSfdJp9"
  ]
}' "https://${org}.okta.com/api/v1/idps/credentials/keys"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 201 Created
Content-Type: application/json
Location: https://${org}.okta.com/api/v1/idps/credentials/keys/74bb2164-e0c8-4457-862b-7c29ba6cd2c9

{
  "kid": "74bb2164-e0c8-4457-862b-7c29ba6cd2c9",
  "created": "2016-01-03T18:15:47.000Z",
  "lastUpdated": "2016-01-03T18:15:47.000Z",
  "e": "65537",
  "n": "101438407598598116085679865987760095721749307901605456708912786847324207000576780508113360584555007890315805735307890113536927352312915634368993759211767770602174860126854831344273970871509573365292777620005537635317282520456901584213746937262823585533063042033441296629204165064680610660631365266976782082747",
  "kty": "RSA",
  "use": "sig",
  "x5c": [
    "MIIDnjCCAoagAwIBAgIGAVG3MN+PMA0GCSqGSIb3DQEBBQUAMIGPMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxEDAOBgNVBAMMB2V4YW1wbGUxHDAaBgkqhkiG9w0BCQEWDWluZm9Ab2t0YS5jb20wHhcNMTUxMjE4MjIyMjMyWhcNMjUxMjE4MjIyMzMyWjCBjzELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAUBgNVBAcMDVNhbiBGcmFuY2lzY28xDTALBgNVBAoMBE9rdGExFDASBgNVBAsMC1NTT1Byb3ZpZGVyMRAwDgYDVQQDDAdleGFtcGxlMRwwGgYJKoZIhvcNAQkBFg1pbmZvQG9rdGEuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtcnyvuVCrsFEKCwHDenS3Ocjed8eWDv3zLtD2K/iZfE8BMj2wpTfn6Ry8zCYey3mWlKdxIybnV9amrujGRnE0ab6Q16v9D6RlFQLOG6dwqoRKuZy33Uyg8PGdEudZjGbWuKCqqXEp+UKALJHV+k4wWeVH8g5d1n3KyR2TVajVJpCrPhLFmq1Il4G/IUnPe4MvjXqB6CpKkog1+ThWsItPRJPAM+RweFHXq7KfChXsYE7Mmfuly8sDQlvBmQyxZnFHVuiPfCvGHJjpvHy11YlHdOjfgqHRvZbmo30+y0X/oY/yV4YEJ00LL6eJWU4wi7ViY3HP6/VCdRjHoRdr5L/DwIDAQABMA0GCSqGSIb3DQEBBQUAA4IBAQCzzhOFkvyYLNFj2WDcq1YqD4sBy1iCia9QpRH3rjQvMKDwQDYWbi6EdOX0TQ/IYR7UWGj+2pXd6v0t33lYtoKocp/4lUvT3tfBnWZ5KnObi+J2uY2teUqoYkASN7F+GRPVOuMVoVgm05ss8tuMb2dLc9vsx93sDt+XlMTv/2qi5VPwaDtqduKkzwW9lUfn4xIMkTiVvCpe0X2HneD2Bpuao3/U8Rk0uiPfq6TooWaoW3kjsmErhEAs9bA7xuqo1KKY9CdHcFhkSsMhoeaZylZHtzbnoipUlQKSLMdJQiiYZQ0bYL83/Ta9fulr1EERICMFt3GUmtYaZZKHpWSfdJp9"
  ],
  "x5t": "noocvK-9pzU-n35eimPK16zYEYk"
}
~~~

### Get Key
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /idps/credentials/keys/*:kid*</span>

Gets a specific [IdP Key Credential](#identity-provider-key-credential-model) by `kid`

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter     | Description                                                                 | Param Type | DataType | Required | Default
------------- | --------------------------------------------------------------------------- | ---------- | -------- | -------- | -------
kid           | unique key of [IdP Key Credential](#identity-provider-key-credential-model) | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[Identity Provider Key Credential](#identity-provider-key-credential-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
}' "https://${org}.okta.com/api/v1/idps/credentials/keys/74bb2164-e0c8-4457-862b-7c29ba6cd2c9"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "kid": "74bb2164-e0c8-4457-862b-7c29ba6cd2c9",
  "created": "2016-01-03T18:15:47.000Z",
  "lastUpdated": "2016-01-03T18:15:47.000Z",
  "e": "65537",
  "n": "101438407598598116085679865987760095721749307901605456708912786847324207000576780508113360584555007890315805735307890113536927352312915634368993759211767770602174860126854831344273970871509573365292777620005537635317282520456901584213746937262823585533063042033441296629204165064680610660631365266976782082747",
  "kty": "RSA",
  "use": "sig",
  "x5c": [
    "MIIDnjCCAoagAwIBAgIGAVG3MN+PMA0GCSqGSIb3DQEBBQUAMIGPMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxEDAOBgNVBAMMB2V4YW1wbGUxHDAaBgkqhkiG9w0BCQEWDWluZm9Ab2t0YS5jb20wHhcNMTUxMjE4MjIyMjMyWhcNMjUxMjE4MjIyMzMyWjCBjzELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAUBgNVBAcMDVNhbiBGcmFuY2lzY28xDTALBgNVBAoMBE9rdGExFDASBgNVBAsMC1NTT1Byb3ZpZGVyMRAwDgYDVQQDDAdleGFtcGxlMRwwGgYJKoZIhvcNAQkBFg1pbmZvQG9rdGEuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtcnyvuVCrsFEKCwHDenS3Ocjed8eWDv3zLtD2K/iZfE8BMj2wpTfn6Ry8zCYey3mWlKdxIybnV9amrujGRnE0ab6Q16v9D6RlFQLOG6dwqoRKuZy33Uyg8PGdEudZjGbWuKCqqXEp+UKALJHV+k4wWeVH8g5d1n3KyR2TVajVJpCrPhLFmq1Il4G/IUnPe4MvjXqB6CpKkog1+ThWsItPRJPAM+RweFHXq7KfChXsYE7Mmfuly8sDQlvBmQyxZnFHVuiPfCvGHJjpvHy11YlHdOjfgqHRvZbmo30+y0X/oY/yV4YEJ00LL6eJWU4wi7ViY3HP6/VCdRjHoRdr5L/DwIDAQABMA0GCSqGSIb3DQEBBQUAA4IBAQCzzhOFkvyYLNFj2WDcq1YqD4sBy1iCia9QpRH3rjQvMKDwQDYWbi6EdOX0TQ/IYR7UWGj+2pXd6v0t33lYtoKocp/4lUvT3tfBnWZ5KnObi+J2uY2teUqoYkASN7F+GRPVOuMVoVgm05ss8tuMb2dLc9vsx93sDt+XlMTv/2qi5VPwaDtqduKkzwW9lUfn4xIMkTiVvCpe0X2HneD2Bpuao3/U8Rk0uiPfq6TooWaoW3kjsmErhEAs9bA7xuqo1KKY9CdHcFhkSsMhoeaZylZHtzbnoipUlQKSLMdJQiiYZQ0bYL83/Ta9fulr1EERICMFt3GUmtYaZZKHpWSfdJp9"
  ],
  "x5t": "noocvK-9pzU-n35eimPK16zYEYk"
}
~~~

### List Keys
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /idps/credentials/keys</span>

Enumerates IdP key credentials

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                               | Param Type | DataType | Required | Default
--------- | --------------------------------------------------------- | ---------- | -------- | -------- | -------
limit     | Specifies the number of key results in a page             | Query      | Number   | FALSE    | 20
after     | Specifies the pagination cursor for the next page of keys | Query      | String   | FALSE    |

##### Response Parameters
{:.api .api-response .api-response-params}

Array of [Identity Provider Key Credential](#identity-provider-key-credential-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
}' "https://${org}.okta.com/api/v1/idps/credentials/keys"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[
  {
    "kid": "74bb2164-e0c8-4457-862b-7c29ba6cd2c9",
    "created": "2016-01-03T18:15:47.000Z",
    "lastUpdated": "2016-01-03T18:15:47.000Z",
    "e": "65537",
    "n": "101438407598598116085679865987760095721749307901605456708912786847324207000576780508113360584555007890315805735307890113536927352312915634368993759211767770602174860126854831344273970871509573365292777620005537635317282520456901584213746937262823585533063042033441296629204165064680610660631365266976782082747",
    "kty": "RSA",
    "use": "sig",
    "x5c": [
      "MIIDnjCCAoagAwIBAgIGAVG3MN+PMA0GCSqGSIb3DQEBBQUAMIGPMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxEDAOBgNVBAMMB2V4YW1wbGUxHDAaBgkqhkiG9w0BCQEWDWluZm9Ab2t0YS5jb20wHhcNMTUxMjE4MjIyMjMyWhcNMjUxMjE4MjIyMzMyWjCBjzELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAUBgNVBAcMDVNhbiBGcmFuY2lzY28xDTALBgNVBAoMBE9rdGExFDASBgNVBAsMC1NTT1Byb3ZpZGVyMRAwDgYDVQQDDAdleGFtcGxlMRwwGgYJKoZIhvcNAQkBFg1pbmZvQG9rdGEuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtcnyvuVCrsFEKCwHDenS3Ocjed8eWDv3zLtD2K/iZfE8BMj2wpTfn6Ry8zCYey3mWlKdxIybnV9amrujGRnE0ab6Q16v9D6RlFQLOG6dwqoRKuZy33Uyg8PGdEudZjGbWuKCqqXEp+UKALJHV+k4wWeVH8g5d1n3KyR2TVajVJpCrPhLFmq1Il4G/IUnPe4MvjXqB6CpKkog1+ThWsItPRJPAM+RweFHXq7KfChXsYE7Mmfuly8sDQlvBmQyxZnFHVuiPfCvGHJjpvHy11YlHdOjfgqHRvZbmo30+y0X/oY/yV4YEJ00LL6eJWU4wi7ViY3HP6/VCdRjHoRdr5L/DwIDAQABMA0GCSqGSIb3DQEBBQUAA4IBAQCzzhOFkvyYLNFj2WDcq1YqD4sBy1iCia9QpRH3rjQvMKDwQDYWbi6EdOX0TQ/IYR7UWGj+2pXd6v0t33lYtoKocp/4lUvT3tfBnWZ5KnObi+J2uY2teUqoYkASN7F+GRPVOuMVoVgm05ss8tuMb2dLc9vsx93sDt+XlMTv/2qi5VPwaDtqduKkzwW9lUfn4xIMkTiVvCpe0X2HneD2Bpuao3/U8Rk0uiPfq6TooWaoW3kjsmErhEAs9bA7xuqo1KKY9CdHcFhkSsMhoeaZylZHtzbnoipUlQKSLMdJQiiYZQ0bYL83/Ta9fulr1EERICMFt3GUmtYaZZKHpWSfdJp9"
    ],
    "x5t": "noocvK-9pzU-n35eimPK16zYEYk"
  }
]
~~~

### Delete Key
{:.api .api-operation}

<span class="api-uri-template api-uri-delete"><span class="api-label">DELETE</span> /idps/credentials/keys/*:kid*</span>

Deletes a specific [IdP Key Credential](#identity-provider-key-credential-model) by `kid`

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                                                 | Param Type | DataType | Required | Default
--------- | --------------------------------------------------------------------------- | ---------- | -------- | -------- | -------
kid       | unique key of [IdP Key Credential](#identity-provider-key-credential-model) | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

N/A

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/idps/credentials/keys/74bb2164-e0c8-4457-862b-7c29ba6cd2c9"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 204 No Content
~~~

## Identity Provider User Operations

### Get Linked Identity Provider User
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /idps/*:id*/users/*:uid*</span>

Fetches a specific linked [IdP user](#identity-provider-user-model) by `id`.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                                      | Param Type | DataType | Required | Default
--------- | ---------------------------------------------------------------- | ---------- | -------- | -------- | -------
id        | unique key of [Identity Provider](#identity-provider-model)      | URL        | String   | TRUE     |
uid       | unique key of linked [IdP User](#identity-provider-user-model)   | URL        | String   | TRUE     |
expand    | optionally embeds linked [User](Users.html#user-model) resource  | Query      | String   | FALSE    |

##### Response Parameters
{:.api .api-response .api-response-params}

[Identity Provider User](#identity-provider-user-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/idps/0oa1k5d68qR2954hb0g4/users/00ulwodIu7wCfdiVR0g3?expand=user"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json

~~~

### List Linked Identity Provider Users
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /idps/*:id*/users</span>

Enumerates all [users](#identity-provider-user-model) linked to an IdP.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                                       | Param Type | DataType | Required | Default
--------- | ----------------------------------------------------------------- | ---------- | -------- | -------- | -------
id        | unique key of [Identity Provider](#identity-provider-model)       | URL        | String   | TRUE     |
limit     | specifies the number of results for a page                        | Query      | Number   | FALSE    | 20
after     | specifies the pagination cursor for the next page of linked users | Query      | String   | FALSE    |
expand    | optionally embeds linked [User](Users.html#user-model) resource   | Query      | String   | FALSE    |

> The page cursor should treated as an opaque value and obtained through the next link relation. See [Pagination](/docs/api/getting_started/design_principles.html#pagination)

##### Response Parameters
{:.api .api-response .api-response-params}

Array of [Identity Provider User](#identity-provider-user-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/idps/0oa1k5d68qR2954hb0g4/users"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[

]
~~~

### Unlink Identity Provider User
{:.api .api-operation}

<span class="api-uri-template api-uri-delete"><span class="api-label">DELETE</span> /idps/*:id*/users/*:uid*</span>

Unlinks a [user](Users.html#user-model) from an IdP by `id`.

> User will revert to highest order profile master and keep its existing authentication provider such as `FEDERATION` or `SOCIAL`.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                                      | Param Type | DataType | Required | Default
--------- | ---------------------------------------------------------------- | ---------- | -------- | -------- | -------
id        | unique key of [Identity Provider](#identity-provider-model)      | URL        | String   | TRUE     |
uid       | unique key of linked [User](Users.html#user-model)               | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

N/A

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/idps/0oa1k5d68qR2954hb0g4/users/00ulwodIu7wCfdiVR0g3"
~~~


##### Response Example
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 204 No Content
~~~
