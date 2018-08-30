---
layout: docs_page
weight: 2
excerpt: Leverage the power of Okta and increase adoption of your SaaS application by embeddeding Okta Cloud Connect (OCC) into your product
title: Embedded Okta Cloud Connect (OCC)
---
# {{page.title}}

{{page.excerpt}}

## Overview

Okta offers Okta Cloud Connect (OCC) program for ISV partners with the need to quickly and easily connect to customer's AD infrastructure for authentication and lifecycle management support.  For customers, OCC is a free offering for an unlimited time, and for an unlimited number of users to be used with a single ISV application.  To learn more about the OCC program, visit the [Okta Cloud Connect] page.

Embedded OCC takes this one step further by providing an even more seamless user experience for your customers through the following:

  1. Enhancing the Okta tenant creation experience by embedding this into your product user interface
  1. Programmatically instantiating the appropriate app instance in the Okta tenant without the need to go through administrator UI.

At a high-level, the runtime flow/administrator experience is as follows:

  {% img occ_diag1.png alt:"OCC High Level Diagram" %}

> In this example, ISV is "ACME" -- customer is "mycompany"

  1. Administrator navigates to Okta Configuration UI in the ACME administrator console.  Enters the necessary information for new Okta tenant creation and hits submit.
  1. ACME uses the input and calls the Okta tenant creation API (/orgs).  A tenant is created.  API call returns tenant-specific information including an API key for subsequent API access against this newly created Okta tenant.
  1. ACME uses Okta /apps API to instantiate the appropriate app instance to exchange SAML metadata to enable Single Sign-On.  Okta receives SAML SP metadata in the request; ACME receives SAML IDP metadata in the response.

If the customer is an existing Okta customer or already has an Okta tenant, an option should be provided to carry out step 3) only.  In the diagram above, the "User Existing Okta tenant" option should prompt for tenant-specific information for app instantiation only.  More details to follow.

## Implementation Steps

### Obtain API access for tenant creation

Any ISVs interested in Embedded-OCC should contact Okta (developers@okta.com).  Special privilege needs to be granted to an API user of your choice before you are allowed to create new tenants.  Here is how the tenant creation privilege is set up:

  1. You must have an existing Okta tenant in the appropriate Okta instance (*.okta.com and/or *.oktapreview.com).  If your company is an existing Okta customer, we recommend that you create a separate tenant for the purpose of setting up Embedded-OCC.
  1. Create a user in your Okta tenant.  Best practice is to create a system account used solely for Embedded-OCC.  Using an account that represents an end user or administrator may lead to issues if this user is deactivated/locked-out in the future due to human activities.
  1. Provide the user/tenant information to Okta.
  1. Once approved, Okta will grant the tenant creation privilege to this particular user.

In general, ISVs are expected to test out their implementation on *.oktapreview.com first.  Once the implementation has been reviewed and tested on *.oktapreview.com, Okta will then grant tenant creation privilege for the production environment (*.okta.com) in your production implementation.

You may choose to ONLY allow your production environment to create Okta tenants in *.okta.com.  Best practice is to support both *.okta.com and *.oktapreview.com as we have seen situations where this is useful for sandbox setup, UAT testing and diagnostics for your customers and your own testing.

### Build UI to capture input for tenant creation and app instantiation

You need to build and expose an administrator user interface to allow the following options:

  1. Create a brand new Okta tenant + App instantiation
  1. Use an existing Okta tenant for App instantiation

### Create a brand new Okta tenant + App instantiation

You need to prompt for the following:

  1. If you allow administrators to choose between *okta.com and *.oktapreview.com (recommended approach), prompt for it
  1. **Okta Subdomain**: this determines the subdomain URL.  The domain name must be unused.
  1. **Company Name**: this is a "display name" for the customer's company. (eg. "MyCompany Inc.")
  1. **Admin First Name**: Okta requires first name for all users
  1. **Admin Last Name**: Okta requires last name for all users
  1. **Admin Email**: This needs to be a real email.  Notifications (activation, password reset, etc) will be sent to this email.  This value CAN be defaulted to be the Okta login name as well. However, the API does allow for login name and email to be different as they are two distinct attributes.
  1. **Password**: Password for the Okta administrator account
      1. Best practice should include a "confirmation" field forcing user to retype the password.
      1. The default password policy requires the following and should be displayed in the UI.  **Tenant creation will result in an error if this is not met.**
          1. At least 8 characters
          1. A lowercase letter
          1. An uppercase letter
          1. A number
          1. No parts of your username
  1. **Security Question**: A security question chosen by the user for simple 2-factor used during password recovery
  1. **Security Answer**: Answer to the above question chosen by the user for simple 2-factor used during password recovery

>Note that the password policy and 2-factor settings in the Okta tenant can be modified by the customer once the tenant is created.

### Use an existing Okta tenant for App instantiation

If the administrator wants to use an existing Okta tenant, you should prompt for the following in order to instantiate your application with the given Okta tenant:

  1. **Okta tenant URL**: (e.g.  _{youOktaDomain}.com_ ) Best practice, as stated before, is to support both *.okta.com and *.oktapreview.com
  1. **Okta API token**: This is the API token obtained from the administrator UI for API access.  The API token carries the privileges of the administrator user used to fetch the token.  If the token does not have sufficient privilege, the API call returns an error.

## Tenant Creation API (org api)

>Continue with the "ACME" (ISV) and "mycompany" (customer) as an example.

### Create a token

Okta has granted access to a system account (system user) in https://{yourOktaDomain}.  You must create an API token for this user, follow the steps in [Getting a token] to perform this action.

### Test the Token

To test if the token is valid, you can try the following curl command:

```sh
curl -v -H "Authorization:SSWS <API token>" -H "Accept:application/json" -H "Content-type:application/json" -X GET https://{yourOktaDomain}/api/v1/users/me
```

### Create an Okta Tenant

The following curl command will create a new Okta tenant.  _If you use a *.okta.com token, the tenant will be created under *.okta.com._

```sh
curl -v -H "Authorization:SSWS <API token>" \
 -H "Accept:application/json" \
 -H "Content-type:application/json" \
 -X POST https://{yourOktaDomain}/api/v1/orgs \
 -d '{
        "subdomain": "mycompany",
        "name": "MyCompany Inc",
        "website": "https://www.mycompany.com",
        "edition": "DIRECTORY",
        "licensing": {
            "apps": ["boxnet"]
            },
        "admin": {
            "profile": {
                "firstName": "Joe",
                "lastName": "Smith",
                "email": "joe@mycompany.com",
                "login": "joe@mycompany.com",
                "mobilePhone": null
            },
            "credentials": {
                "password": {
                    "value": "L0v30ktA!"
                },
                "recovery_question": {
                    "question": "What is your favorite IDaaS?",
                    "answer": "Okta"
                }
            }
        }
    }'
```

Some additional parameters are needed in the request beyond the input from your UI discussed earlier.

  1. **website**: This is the URL of the website we typically ask during our free trial sign-up.  It is a mandatory attribute and it must be of a URL format.  A suggestion is to hardcode your company URL.
  1. **edition**: An Okta tenant can be created with different editions/SKUs enabled.  Here, we are creating an OCC tenant for a single app only – by specifying the "DIRECTORY" value.
  1. **app**: This is an attribute within the licensing object.  This will be the internal Okta app ID of your application in the Okta Application Network.  You can find this out by doing the following:
      1. Log into your Okta instance as an admin
      1. Create a new app instance for your app
      1. During the configuration wizard, your internal app name is part of the URL.  The example below shows "boxnet" as the internal app id for Box.  If you have trouble figuring out your Okta App ID, contact us.

{% img occ_diag3.png alt:"Finding App Name" %}

Here is a sample response from a successful call.

```json
{
    "id": "00o8abcd3myfI6FM1234",
    "subdomain": "mycompany",
    "name": "MyCompany Inc",
    "website": "https://www.mycompany.com",
    "status": "ACTIVE",
    "edition": "DIRECTORY",
    "expiresAt": null,
    "created": "2016-11-08T15:16:01.000Z",
    "lastUpdated": "2016-11-08T15:16:01.000Z",
    "licensing": {
        "apps": [ "boxnet"]
    },
    "settings": {
        "app": {
            "errorRedirectUrl": null,
            "interstitialUrl": null,
            "interstitialMinWaitTime": 1200
        },
        "userAccount": {
            "attributes": {
                "secondaryEmail": true,
                "secondaryImage": true
            }
        },
        "portal": {
            "errorRedirectUrl": null,
            "signOutUrl": null
        }
    },
    "token": "00AbCdefghPijn7s7sue77oi7zz7zzZZxyzOHa7XyZ",
    "tokenType": "SSWS",
    "_links": {
        "organization": {
            "href": "https://{yourOktaDomain}/api/v1/orgs/sleedemo1"
        },
        "administrator": {
            "href": "https://{yourOktaDomain}/api/v1/users/00u1abcd1Abcd11a1a1"
        },
        "policy": {
            "href": "https://{yourOktaDomain}/api/v1/orgs/sleedemo1/policy"
        },
        "contacts": {
            "href": "https://{yourOktaDomain}/api/v1/orgs/sleedemo1/contacts"
        }
    }
}
```

### Create an app in the Okta Tenant

Now that you have created the Okta tenant, the next API call is to instantiate the app instance.  You need two pieces of information for this:

  1. The Okta tenant URL
  1. The API token
      1. The API token either comes from the tenant creation response or come from administrator input from the user interface where an existing Okta tenant is being used.

Depending on the set of inputs required to set up SAML for your app in Okta, the input parameters.  An example here is the "servicenow_app2" SAML app instantiation.  The only parameter needed is "loginURL" which is set to the SAML endpoint on the ServiceNow side.

```sh
curl -v -H "Authorization:SSWS <API token>" \
 -H "Accept:application/json" -H "Content-type:application/json" \
 -X POST https://{yourOktaDomain}/api/v1/apps \
 -d  '{
        "name": "servicenow_app2",
        "status": "ACTIVE",
        "signOnMode": "SAML_2_0",
        "settings": {
            "app": {
                "loginURL": "https://sleetesting.com/sso/saml"
            }
        }
    }'
```

>The name parameter value above is to be replaced with the name of your application

Refer to the [apps api](/docs/api/resources/apps#response-example-6) documentation for details about responses and error codes.

At this point, the app instance in Okta is created and Okta is now aware of the SAML SP information based on your input in the app instantiation API call.  Now you need to get the SAML IDP Metadata from Okta to complete the SAML configuration in your environment. The response property `_links.metadata.href` is the endpoint to be used to fetch the IDP metadata.  The response will be returned in XML format.

The following curl command will return the SAML IDP metadata (based on an example `_links.metadata.href` value).

> Note the "application/xml" value for both "Accept" and "Content-type"

```sh
curl -v -H "Authorization:SSWS <API Token>" \
 -H "Accept:application/xml" \
 -H "Content-type:application/xml" \
 -X GET https://{yourOktaDomain}/api/v1/apps/0oa19jdq4ytHHtfgk1d8/sso/saml/metadata
```

Here is a sample response from a successful call:

```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="exk19jdq4yshW8Ru71d8">
    <md:IDPSSODescriptor WantAuthnRequestsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
        <md:KeyDescriptor use="signing">
            <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                <ds:X509Data>
                    <ds:X509Certificate>
                        MIIDmjCCAoKgAwIBAgIGAUtB...cXa14=
                    </ds:X509Certificate>
                </ds:X509Data>
            </ds:KeyInfo>
        </md:KeyDescriptor>
        <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</md:NameIDFormat>
        <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</md:NameIDFormat>
        <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://{yourOktaDomain}/app/servicenow_app2/exk19jdq4yshW8Ru71d8/sso/saml"/>
        <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://{yourOktaDomain}/app/servicenow_app2/exk19jdq4yshW8Ru71d8/sso/saml"/>
    </md:IDPSSODescriptor>
</md:EntityDescriptor>
```

### Error Codes

Below we provide a list of error codes that could be encountered, for more details on error codes and http response codes from Okta please refer to our [Error Codes](/docs/api/getting_started/error_codes)

#### Duplicate Subdomain

```json
{
   "errorCode": "E0000088",
   "errorSummary": "Api validation failed: subDomain",
   "errorLink": "E0000088",
   "errorId": "08ab79d407eafb1c",
   "errorCauses": [
        {
            "errorSummary": "subDomain: An object with this field already exists"
        }
    ]
}
```

#### Invalid Token

```json
{
    "errorCode": "E0000011",
    "errorSummary": "Invalid token provided",
    "errorLink": "E0000011",
    "errorId": "oaetOwX4JU-TD2EJUf2Vh9H1Q",
    "errorCauses": []
}
```

#### Invalid App Name

```json
{
    "errorCode": "E0000007",
    "errorSummary": "Not found: Resource not found: badappname (App)",
    "errorLink": "E0000007",
    "errorId": "oaeqE8V21bkSfy50jiJPgF1Zg",
    "errorCauses": []
}
```

#### Password Requirements Not Met

```json
{
    "errorCode": "E0000001",
    "errorSummary": "Api validation failed: admin.password",
    "errorLink": "E0000001",
    "errorId": "oaeE4lry9XFR_aZq6yJ-3uGsw",
    "errorCauses": [
        {
            "errorSummary": "admin.password: Password requirements were not met. Your password must have at least 8 characters, a lowercase letter, an uppercase letter, a number, no parts of your username."
        }
    ]
}
```

#### Website value is blank

```json
{
    "errorCode": "E0000001",
    "errorSummary": "Api validation failed: website",
    "errorLink": "E0000001",
    "errorId": "oaeswACavHpT3KAfRv8RwqrAw",
    "errorCauses": [
        {
            "errorSummary": "website: The field cannot be left blank"
        }
    ]
}
```

#### Blank Security Question

```json
{
    "errorCode": "E0000001",
    "errorSummary": "Api validation failed: admin.customSecurityQuestion",
    "errorLink": "E0000001",
    "errorId": "oaebCAc-TxcT8y2fzG_vfvZgA",
    "errorCauses": [
        {
            "errorSummary": "admin.customSecurityQuestion: The field cannot be left blank"
        }
    ]
}
```

#### Blank Security Answer

```json
{
    "errorCode": "E0000001",
    "errorSummary": "Api validation failed: admin.securityQuestion",
    "errorLink": "E0000001",
    "errorId": "oaeuVq3ykU8RmK-0GQoHkAVBg",
    "errorCauses": [
        {
            "errorSummary": "admin.securityQuestion: Fields must both be empty, or both non-empty"
        }
    ]
}
```

#### Errors - App Instantiation API Invalid name (ie. Invalid Okta App ID being used)

```json
{
    "errorCode": "E0000007",
    "errorSummary": "Not found: Resource not found: bad_okta_app_id (App)",
    "errorLink": "E0000007",
    "errorId": "oae8P1iYH1pQw-_3NKOsMhqXg",
    "errorCauses": []
}
```

#### Label already exists

```json
{
    "errorCode": "E0000001",
    "errorSummary": "Api validation failed: label",
    "errorLink": "E0000001",
    "errorId": "oae_cM34bW6TVOgQuxb2B94GA",
    "errorCauses": [
        {
            "errorSummary": "label: An active ServiceNow - Eureka and later releases instance with the label \"SLEE Test\" already exists."
        }
    ]
}
```

#### Invalid Session

```json
{
    "errorCode":"E0000005",
    "errorSummary":"Invalid session",
    "errorLink":"E0000005",
    "errorId":"oae1_E9HWBkQn-EcYT828MzKg",
    "errorCauses":[]
}
```

## Related articles

{% include_relative includes/related.md %}
