---
layout: docs_page
title: Apps
redirect_from: "/docs/api/rest/apps.html"
---

# Apps API

The Okta Application API provides operations to manage applications and/or assignments to users or groups for your organization.

## Getting Started

Explore the Apps API: [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/4b283a9afed50a1ccd6b)

## Application Operations

### Add Application
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /apps</span>

Adds a new application to your Okta organization.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                                                            | Param Type | DataType                          | Required | Default
--------- | -------------------------------------------------------------------------------------- | ---------- | --------------------------------- | -------- | -------
activate  | Executes [activation lifecycle](#activate-application) operation when creating the app | Query      | Boolean                           | FALSE    | TRUE
app       | App-specific name, signOnMode and settings                                             | Body       | [Application](#application-model) | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

All responses return the created [Application](#application-model).

#### Add Bookmark Application
{:.api .api-operation}

Adds an new bookmark application to your organization.

##### Settings
{:.api .api-request .api-request-params}

Parameter          | Description                                             | DataType | Nullable | Unique | Validation
------------------ | ------------------------------------------------------- | -------- | -------- | ------ | ----------------------------------------
url                | The URL of the launch page for this app                 | String   | FALSE    | FALSE  | [URL](http://tools.ietf.org/html/rfc3986)
requestIntegration | Would you like Okta to add an integration for this app? | Boolean  | FALSE    | FALSE  |

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "name": "bookmark",
  "label": "Sample Bookmark App",
  "signOnMode": "BOOKMARK",
  "settings": {
    "app": {
      "requestIntegration": false,
      "url": "https://example.com/bookmark.htm"
    }
  }
}' "https://${org}.okta.com/api/v1/apps"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "0oafxqCAJWWGELFTYASJ",
  "name": "bookmark",
  "label": "Sample Bookmark App",
  "status": "ACTIVE",
  "lastUpdated": "2013-10-01T04:22:31.000Z",
  "created": "2013-10-01T04:22:27.000Z",
  "accessibility": {
    "selfService": false,
    "errorRedirectUrl": null
  },
  "visibility": {
    "autoSubmitToolbar": false,
    "hide": {
      "iOS": false,
      "web": false
    },
    "appLinks": {
      "login": true
    }
  },
  "features": [],
  "signOnMode": "BOOKMARK",
  "credentials": {
    "userNameTemplate": {
      "template": "${source.login}",
      "type": "BUILT_IN"
    }
  },
  "settings": {
    "app": {
      "requestIntegration": false,
      "url": "https://example.com/bookmark.htm"
    }
  },
  "_links": {
    "logo": [
      {
        "href": "https:/example.okta.com/img/logos/logo_1.png",
        "name": "medium",
        "type": "image/png"
      }
    ],
    "users": {
      "href": "https://example.okta.com/api/v1/apps/0oafxqCAJWWGELFTYASJ/users"
    },
    "groups": {
      "href": "https://example.okta.com/api/v1/apps/0oafxqCAJWWGELFTYASJ/groups"
    },
    "self": {
      "href": "https://example.okta.com/api/v1/apps/0oafxqCAJWWGELFTYASJ"
    },
    "deactivate": {
      "href": "https://example.okta.com/api/v1/apps/0oafxqCAJWWGELFTYASJ/lifecycle/deactivate"
    }
  }
}
~~~

#### Add Basic Authentication Application
{:.api .api-operation}

Adds an new application that uses HTTP Basic Authentication Scheme and requires a browser plugin.

##### Settings
{:.api .api-request .api-request-params}

Parameter | Description                                     | DataType | Nullable | Unique | Validation
--------- | ----------------------------------------------- | -------- | -------- | ------ | ----------------------------------------
url       | The URL of the login page for this app          | String   | FALSE    | FALSE  | [URL](http://tools.ietf.org/html/rfc3986)
authURL   | The URL of the authenticating site for this app | String   | FALSE    | FALSE  | [URL](http://tools.ietf.org/html/rfc3986)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "name": "template_basic_auth",
  "label": "Sample Basic Auth App",
  "signOnMode": "BASIC_AUTH",
  "settings": {
    "app": {
      "url": "https://example.com/login.html",
      "authURL": "https://example.com/auth.html"
    }
  }
}' "https://${org}.okta.com/api/v1/apps"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "0oafwvZDWJKVLDCUWUAC",
  "name": "template_basic_auth",
  "label": "Sample Basic Auth App",
  "status": "ACTIVE",
  "lastUpdated": "2013-09-30T00:56:52.365Z",
  "created": "2013-09-30T00:56:52.365Z",
  "accessibility": {
    "selfService": false,
    "errorRedirectUrl": null
  },
  "visibility": {
    "autoSubmitToolbar": false,
    "hide": {
      "iOS": false,
      "web": false
    },
    "appLinks": {
      "login": true
    }
  },
  "features": [],
  "signOnMode": "BASIC_AUTH",
  "credentials": {
    "scheme": "EDIT_USERNAME_AND_PASSWORD",
    "userNameTemplate": {
      "template": "${source.login}",
      "type": "BUILT_IN"
    }
  },
  "settings": {
    "app": {
      "url": "https://example.com/login.html",
      "authURL": "https://example.com/auth.html"
    }
  },
  "_links": {
    "logo": [
      {
        "href": "https:/example.okta.com/img/logos/logo_1.png",
        "name": "medium",
        "type": "image/png"
      }
    ],
    "users": {
      "href": "https://example.okta.com/api/v1/apps/0oafwvZDWJKVLDCUWUAC/users"
    },
    "groups": {
      "href": "https://example.okta.com/api/v1/apps/0oafwvZDWJKVLDCUWUAC/groups"
    },
    "self": {
      "href": "https://example.okta.com/api/v1/apps/0oafwvZDWJKVLDCUWUAC"
    },
    "deactivate": {
      "href": "https://example.okta.com/api/v1/apps/0oafwvZDWJKVLDCUWUAC/lifecycle/deactivate"
    }
  }
}
~~~

#### Add Plugin SWA Application
{:.api .api-operation}

Adds a SWA application that requires a browser plugin.

##### Settings
{:.api .api-request .api-request-params}

Parameter     | Description                                           | DataType | Nullable | Unique | Validation
------------- | ----------------------------------------------------- | -------- | -------- | ------ | ----------------------------------------
url           | The URL of the login page for this app                | String   | FALSE    | FALSE  | [URL](http://tools.ietf.org/html/rfc3986)
usernameField | CSS selector for the username field in the login form | String   | FALSE    | FALSE  |
passwordField | CSS selector for the password field in the login form | String   | FALSE    | FALSE  |
buttonField   | CSS selector for the login button in the login form   | String   | FALSE    | FALSE  |

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "name": "template_swa",
  "label": "Sample Plugin App",
  "signOnMode": "BROWSER_PLUGIN",
  "settings": {
    "app": {
      "buttonField": "btn-login",
      "passwordField": "txtbox-password",
      "usernameField": "txtbox-username",
      "url": "https://example.com/login.html"
    }
  }
}' "https://${org}.okta.com/api/v1/apps"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "0oabkvBLDEKCNXBGYUAS",
  "name": "template_swa",
  "label": "Sample Plugin App",
  "status": "ACTIVE",
  "lastUpdated": "2013-09-11T17:58:54.000Z",
  "created": "2013-09-11T17:46:08.000Z",
  "accessibility": {
    "selfService": false,
    "errorRedirectUrl": null
  },
  "visibility": {
    "autoSubmitToolbar": false,
    "hide": {
      "iOS": false,
      "web": false
    },
    "appLinks": {
      "login": true
    }
  },
  "features": [],
  "signOnMode": "BROWSER_PLUGIN",
  "credentials": {
    "scheme": "EDIT_USERNAME_AND_PASSWORD",
    "userNameTemplate": {
      "template": "${source.login}",
      "type": "BUILT_IN"
    }
  },
  "settings": {
    "app": {
      "buttonField": "btn-login",
      "passwordField": "txtbox-password",
      "usernameField": "txtbox-username",
      "url": "https://example.com/login.html"
    }
  },
  "_links": {
    "logo": [
      {
        "href": "https:/example.okta.com/img/logos/logo_1.png",
        "name": "medium",
        "type": "image/png"
      }
    ],
    "users": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/users"
    },
    "groups": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/groups"
    },
    "self": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS"
    },
    "deactivate": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/lifecycle/deactivate"
    }
  }
}
~~~

#### Add Plugin SWA (3 Field) Application
{:.api .api-operation}

Adds a SWA application that requires a browser plugin and supports 3 CSS selectors for the login form.

##### Settings
{:.api .api-request .api-request-params}

Parameter          | Description                                           | DataType | Nullable | Unique | Validation
------------------ | ----------------------------------------------------- | -------- | -------- | ------ | ----------------------------------------
url                | The URL of the login page for this app                | String   | FALSE    | FALSE  | [URL](http://tools.ietf.org/html/rfc3986)
usernameField      | CSS selector for the username field in the login form | String   | FALSE    | FALSE  |
passwordField      | CSS selector for the password field in the login form | String   | FALSE    | FALSE  |
buttonField        | CSS selector for the login button in the login form   | String   | FALSE    | FALSE  |
extraFieldSelector | CSS selector for the extra field in the form          | String   | FALSE    | FALSE  |
extraFieldValue    | Value for extra field form field                      | String   | FALSE    | FALSE  |

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "name": "template_swa3field",
  "label": "Sample Plugin App",
  "signOnMode": "BROWSER_PLUGIN",
  "settings": {
    "app": {
      "buttonField": "#btn-login",
      "passwordField": "#txtbox-password",
      "usernameField": "#txtbox-username",
      "url": "https://example.com/login.html",
      "extraFieldSelector": ".login",
      "extraFieldValue": "SOMEVALUE"
    }
  }
}' "https://${org}.okta.com/api/v1/apps"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "0oabkvBLDEKCNXBGYUAS",
  "name": "template_swa",
  "label": "Sample Plugin App",
  "status": "ACTIVE",
  "lastUpdated": "2013-09-11T17:58:54.000Z",
  "created": "2013-09-11T17:46:08.000Z",
  "accessibility": {
    "selfService": false,
    "errorRedirectUrl": null
  },
  "visibility": {
    "autoSubmitToolbar": false,
    "hide": {
      "iOS": false,
      "web": false
    },
    "appLinks": {
      "login": true
    }
  },
  "features": [],
  "signOnMode": "BROWSER_PLUGIN",
  "credentials": {
    "scheme": "EDIT_USERNAME_AND_PASSWORD",
    "userNameTemplate": {
      "template": "${source.login}",
      "type": "BUILT_IN"
    }
  },
  "settings": {
    "app": {
      "buttonField": "#btn-login",
      "passwordField": "#txtbox-password",
      "usernameField": "#txtbox-username",
      "url": "https://example.com/login.html",
      "extraFieldSelector": ".login",
      "extraFieldValue": "SOMEVALUE"
    }
  },
  "_links": {
    "logo": [
      {
        "href": "https:/example.okta.com/img/logos/logo_1.png",
        "name": "medium",
        "type": "image/png"
      }
    ],
    "users": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/users"
    },
    "groups": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/groups"
    },
    "self": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS"
    },
    "deactivate": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/lifecycle/deactivate"
    }
  }
}
~~~

#### Add SWA Application (No Plugin)
{:.api .api-operation}

Adds a SWA application that uses HTTP POST and does not require a browser plugin

##### Settings
{:.api .api-request .api-request-params}

Parameter           | Description                                           | DataType  | Nullable | Unique | Validation
------------------- | ----------------------------------------------------- | --------- | -------- | ------ | ----------------------------------------
url                 | The URL of the login page for this app                | String    | FALSE    | FALSE  | [URL](http://tools.ietf.org/html/rfc3986)
usernameField       | CSS selector for the username field in the login form | String    | FALSE    | FALSE  |
passwordField       | CSS selector for the password field in the login form | String    | FALSE    | FALSE  |
optionalField1      | Name of the optional parameter in the login form      | String    | TRUE     | FALSE  |
optionalField1Value | Name of the optional value in the login form          | String    | TRUE     | FALSE  |
optionalField2      | Name of the optional parameter in the login form      | String    | TRUE     | FALSE  |
optionalField2Value | Name of the optional value in the login form          | String    | TRUE     | FALSE  |
optionalField3      | Name of the optional parameter in the login form      | String    | TRUE     | FALSE  |
optionalField3Value | Name of the optional value in the login form          | String    | TRUE     | FALSE  |


##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "name": "template_sps",
  "label": "Example SWA App",
  "signOnMode": "SECURE_PASSWORD_STORE",
  "settings": {
    "app": {
      "url": "https://example.com/login.html",
      "passwordField": "#txtbox-password",
      "usernameField": "#txtbox-username",
      "optionalField1": "param1",
      "optionalField1Value": "somevalue",
      "optionalField2": "param2",
      "optionalField2Value": "yetanothervalue",
      "optionalField3": "param3",
      "optionalField3Value": "finalvalue"
    }
  }
}' "https://${org}.okta.com/api/v1/apps"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "0oafywQDNMXLYDBIHQTT",
  "name": "template_sps",
  "label": "Example SWA App",
  "status": "ACTIVE",
  "lastUpdated": "2013-10-01T05:41:01.983Z",
  "created": "2013-10-01T05:41:01.983Z",
  "accessibility": {
    "selfService": false,
    "errorRedirectUrl": null
  },
  "visibility": {
    "autoSubmitToolbar": false,
    "hide": {
      "iOS": false,
      "web": false
    },
    "appLinks": {
      "login": true
    }
  },
  "features": [],
  "signOnMode": "SECURE_PASSWORD_STORE",
  "credentials": {
    "scheme": "EDIT_USERNAME_AND_PASSWORD",
    "userNameTemplate": {
      "template": "${source.login}",
      "type": "BUILT_IN"
    }
  },
  "settings": {
    "app": {
      "url": "https://example.com/login.html",
      "passwordField": "#txtbox-password",
      "usernameField": "#txtbox-username",
      "optionalField1": "param1",
      "optionalField1Value": "somevalue",
      "optionalField2": "param2",
      "optionalField2Value": "yetanothervalue",
      "optionalField3": "param3",
      "optionalField3Value": "finalvalue"
    }
  },
  "_links": {
    "logo": [
      {
        "href": "https:/example.okta.com/img/logos/logo_1.png",
        "name": "medium",
        "type": "image/png"
      }
    ],
    "users": {
      "href": "https://example.okta.com/api/v1/apps/0oafywQDNMXLYDBIHQTT/users"
    },
    "groups": {
      "href": "https://example.okta.com/api/v1/apps/0oafywQDNMXLYDBIHQTT/groups"
    },
    "self": {
      "href": "https://example.okta.com/api/v1/apps/0oafywQDNMXLYDBIHQTT"
    },
    "deactivate": {
      "href": "https://example.okta.com/api/v1/apps/0oafywQDNMXLYDBIHQTT/lifecycle/deactivate"
    }
  }
}
~~~

#### Add Custom SWA Application
{:.api .api-operation}

Adds a SWA application. This application is only available to the org that creates it.

##### Settings
{:.api .api-request .api-request-params}

Parameter           | Description                                           | DataType  | Nullable | Unique | Validation
------------------- | ----------------------------------------------------- | --------- | -------- | ------ | ----------------------------------------
loginUrl            | Primary URL of the login page for this app            | String    | FALSE    | FALSE  | [URL](http://tools.ietf.org/html/rfc3986)
redirectUrl         | Secondary URL of the login page for this app          | String    | TRUE     | FALSE  | [URL](http://tools.ietf.org/html/rfc3986)

##### Request Example
{:.api .api-request .api-request-example}

> [Application](#application-model)'s "signOnMode" must be set to AUTO_LOGIN, the "name" field must be left blank, and "label" field must be defined.

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
      "label": "Example Custom SWA App",
      "visibility": {
        "autoSubmitToolbar": false,
        "hide": {
          "iOS": false,
          "web": false
        }
      },
      "features": [],
      "signOnMode": "AUTO_LOGIN",
      "settings": {
        "signOn": {
          "redirectUrl": "http://swasecondaryredirecturl.okta.com",
          "loginUrl": "http://swaprimaryloginurl.okta.com"
        }
      }
    }' "https://${org}.okta.com/api/v1/apps"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "0oaugjme6G6Aq6h7m0g3",
  "name": "testorgone_examplecustomswaapp_1",
  "label": "Example Custom SWA App",
  "status": "ACTIVE",
  "lastUpdated": "2016-06-29T17:11:24.000Z",
  "created": "2016-06-29T17:11:24.000Z",
  "accessibility": {
    "selfService": false,
    "errorRedirectUrl": null,
    "loginRedirectUrl": null
  },
  "visibility": {
    "autoSubmitToolbar": false,
    "hide": {
      "iOS": false,
      "web": false
    },
    "appLinks": {
      "testorgone_examplecustomswaapp_1_link": true
    }
  },
  "features": [],
  "signOnMode": "AUTO_LOGIN",
  "credentials": {
    "scheme": "EDIT_USERNAME_AND_PASSWORD",
    "userNameTemplate": {
      "template": "${source.login}",
      "type": "BUILT_IN"
    },
    "revealPassword": false,
    "signing": {}
  },
  "settings": {
    "app": {},
    "notifications": {
      "vpn": {
        "network": {
          "connection": "DISABLED"
        },
        "message": null,
        "helpUrl": null
      }
    },
    "signOn": {
      "redirectUrl": "http://swasecondaryredirecturl.okta.com",
      "loginUrl": "http://swaprimaryloginurl.okta.com"
    }
  },
  "_links": {
    "logo": [
      {
        "name": "medium",
        "href": "http://testorgone.okta.com:/assets/img/logos/default.6770228fb0dab49a1695ef440a5279bb.png",
        "type": "image/png"
      }
    ],
    "appLinks": [
      {
        "name": "testorgone_examplecustomswaapp_1_link",
        "href": "http://testorgone.okta.com/home/testorgone_examplecustomswaapp_1/0oaugjme6G6Aq6h7m0g3/alnuqqc3uS8X6L4Se0g3",
        "type": "text/html"
      }
    ],
    "users": {
      "href": "http://testorgone.okta.com/api/v1/apps/0oaugjme6G6Aq6h7m0g3/users"
    },
    "deactivate": {
      "href": "http://testorgone.okta.com/api/v1/apps/0oaugjme6G6Aq6h7m0g3/lifecycle/deactivate"
    },
    "groups": {
      "href": "http://testorgone.okta.com/api/v1/apps/0oaugjme6G6Aq6h7m0g3/groups"
    }
  }
}
~~~

#### Add Custom SAML Application
{:.api .api-operation}

Adds a SAML 2.0 application. This application is only available to the org that creates it.

##### Settings
{:.api .api-request .api-request-params}

Parameter             | Description                                                                                                       | DataType                                             | Nullable | Unique | Validation
--------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | -------- | ----- | ----------------------------------------
defaultRelayState     | Identifies a specific application resource in an IDP initiated SSO scenario.                                      | String                                               | TRUE     | FALSE |
ssoAcsUrl             | Single Sign On Url                                                                                                | String                                               | FALSE    | FALSE |  [URL](http://tools.ietf.org/html/rfc3986)
recipient             | The location where the app may present the SAML assertion                                                         | String                                               | FALSE    | FALSE |  [URL](http://tools.ietf.org/html/rfc3986)
destination           | Identifies the location where the SAML response is intended to be sent inside of the SAML assertion               | String                                               | FALSE    | FALSE |  [URL](http://tools.ietf.org/html/rfc3986)
audience              | Audience URI (SP Entity ID)                                                                                       | String                                               | FALSE    | FALSE |
idpIssuer             | SAML Issuer ID                                                                                                    | String                                               | FALSE    | FALSE |
subjectNameIdTemplate | Template for app user's username when a user is assigned to the app.                                              | String                                               | FALSE     | FALSE |
subjectNameIdFormat   | Identifies the SAML processing rules.                                                                             | String                                               | FALSE    | FALSE |
responseSigned        | Determines whether the SAML authentication response message is digitally signed by the IDP or not                 | Boolean                                              | FALSE    | FALSE |
assertionSigned       | determines whether the SAML assertion is digitally signed or not                                                  | Boolean                                              | FALSE    | FALSE |
signatureAlgorithm    | Determines the signing algorithm used to digitally sign the SAML assertion and response                           | String                                               | FALSE    | FALSE |
digestAlgorithm       | Determines the digest algorithm used to digitally sign the SAML assertion and response                            | String                                               | FALSE    | FALSE |
honorForceAuthn       | Prompt user to re-authenticate if SP asks for it                                                                  | Boolean                                              | FALSE    | FALSE |
authnContextClassRef  | Identifies the SAML authentication context class for the assertion's authentication statement                     | String                                               | FALSE    | FALSE |
attributeStatements   | Check [here](http://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0-cd-02.html) for details | [Attribute Statements](#attribute-statements-object) | FALSE    | FALSE |

> Fields that require certificate uploads can't be enabled through the API, such as Single Log Out and Assertion Encryption. These must be updated through the UI.

> Either (or both) "responseSigned" or "assertionSigned" must be TRUE.

##### Supported Values for Custom SAML App
The following values are support for creating custom SAML 2.0 Apps. Check [Attribute Statements](#attribute-statements-object) to see its supported values.

###### Name ID Format

Label           | Value
--------------- | ------------
Unspecified     | urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified
Email Address   | urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress
x509SubjectName | urn:oasis:names:tc:SAML:1.1:nameid-format:x509SubjectName
Persistent      | urn:oasis:names:tc:SAML:2.0:nameid-format:persistent
Transient       | urn:oasis:names:tc:SAML:2.0:nameid-format:transient

###### Signature Algorithm

Label            | Value
---------------- | ---------
RSA-SHA256       | RSA_SHA256
RSA-SHA1         | RSA_SHA1

###### Digest Algorithm

Label            | Value
---------------- | ---------
SHA256           | SHA256
SHA1             | SHA1

###### Authentication Context Class

Label                              | Value
---------------------------------- | -------------------------------------------------------------------
PasswordProtectedTransport         | urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport
Password                           | urn:oasis:names:tc:SAML:2.0:ac:classes:Password
Unspecified                        | urn:oasis:names:tc:SAML:2.0:ac:classes:unspecified
TLS Client                         | urn:oasis:names:tc:SAML:2.0:ac:classes:TLSClient
X509 Certificate                   | urn:oasis:names:tc:SAML:2.0:ac:classes:X509
Integrated Windows Authentication  | urn:federation:authentication:windows
Kerberos                           | oasis:names:tc:SAML:2.0:ac:classes:Kerberos

##### Request Example
{:.api .api-request .api-request-example}

> [Application](#application-model)'s "signOnMode" must be set to SAML_2_0, the "name" field must be left blank, and "label" field must be defined.

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
      "label": "Example Custom SAML 2.0 App",
      "visibility": {
        "autoSubmitToolbar": false,
        "hide": {
          "iOS": false,
          "web": false
        }
      },
      "features": [],
      "signOnMode": "SAML_2_0",
      "settings": {
        "signOn": {
          "defaultRelayState": "",
          "ssoAcsUrl": "http://testorgone.okta",
          "idpIssuer": "http://www.okta.com/${org.externalKey}",
          "audience": "asdqwe123",
          "recipient": "http://testorgone.okta",
          "destination": "http://testorgone.okta",
          "subjectNameIdTemplate": "${user.userName}",
          "subjectNameIdFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
          "responseSigned": true,
          "assertionSigned": true,
          "signatureAlgorithm": "RSA_SHA256",
          "digestAlgorithm": "SHA256",
          "honorForceAuthn": true,
          "authnContextClassRef": "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport",
          "spIssuer": null,
          "requestCompressed": false,
          "attributeStatements": [
            {
              "type": "EXPRESSION",
              "name": "Attribute",
              "namespace": "urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified",
              "values": [
                "Value"
              ]
            }
          ]
        }
      }
    }' "https://${org}.okta.com/api/v1/apps"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "0oav8uiWzPDrDMYxU0g3",
  "name": "testorgone_examplecustomsaml20app_1",
  "label": "Example Custom SAML 2.0 App",
  "status": "ACTIVE",
  "lastUpdated": "2016-06-29T19:57:33.000Z",
  "created": "2016-06-29T19:57:33.000Z",
  "accessibility": {
    "selfService": false,
    "errorRedirectUrl": null,
    "loginRedirectUrl": null
  },
  "visibility": {
    "autoSubmitToolbar": false,
    "hide": {
      "iOS": false,
      "web": false
    },
    "appLinks": {
      "testorgone_examplecustomsaml20app_6_link": true
    }
  },
  "features": [],
  "signOnMode": "SAML_2_0",
  "credentials": {
    "userNameTemplate": {
      "template": "${source.login}",
      "type": "BUILT_IN"
    },
    "signing": {}
  },
  "settings": {
    "app": {},
    "notifications": {
      "vpn": {
        "network": {
          "connection": "DISABLED"
        },
        "message": null,
        "helpUrl": null
      }
    },
    "signOn": {
      "defaultRelayState": null,
      "ssoAcsUrl": "http://testorgone.okta",
      "idpIssuer": "http://www.okta.com/${org.externalKey}",
      "audience": "asdqwe123",
      "recipient": "http://testorgone.okta",
      "destination": "http://testorgone.okta",
      "subjectNameIdTemplate": "${user.userName}",
      "subjectNameIdFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
      "responseSigned": true,
      "assertionSigned": true,
      "signatureAlgorithm": "RSA_SHA256",
      "digestAlgorithm": "SHA256",
      "honorForceAuthn": true,
      "authnContextClassRef": "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport",
      "spIssuer": null,
      "requestCompressed": false,
      "attributeStatements": [
        {
          "type": "EXPRESSION",
          "name": "Attribute",
          "namespace": "urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified",
          "values": [
            "Value"
          ]
        }
      ]
    }
  },
  "_links": {
    "logo": [
      {
        "name": "medium",
        "href": "http://testorgone.okta.com/assets/img/logos/default.6770228fb0dab49a1695ef440a5279bb.png",
        "type": "image/png"
      }
    ],
    "appLinks": [
      {
        "name": "testorgone_examplecustomsaml20app_6_link",
        "href": "http://testorgone.okta.com/home/testorgone_examplecustomsaml20app_6/0oav8uiWzPDrDMYxU0g3/alnvjz6hLyuTZadi80g3",
        "type": "text/html"
      }
    ],
    "help": {
      "href": "http://testorgone-admin.okta.com/app/testorgone_examplecustomsaml20app_6/0oav8uiWzPDrDMYxU0g3/setup/help/SAML_2_0/instructions",
      "type": "text/html"
    },
    "users": {
      "href": "http://testorgone.okta.com/api/v1/apps/0oav8uiWzPDrDMYxU0g3/users"
    },
    "deactivate": {
      "href": "http://testorgone.okta.com/api/v1/apps/0oav8uiWzPDrDMYxU0g3/lifecycle/deactivate"
    },
    "groups": {
      "href": "http://testorgone.okta.com/api/v1/apps/0oav8uiWzPDrDMYxU0g3/groups"
    },
    "metadata": {
      "href": "http://testorgone.okta.com:/api/v1/apps/0oav8uiWzPDrDMYxU0g3/sso/saml/metadata",
      "type": "application/xml"
    }
  }
}
~~~

#### Add WS-Federation Application
{:.api .api-operation}

Adds a WS-Federation Passive Requestor Profile application with a SAML 2.0 token

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "name": "template_wsfed",
  "label": "Sample WS-Fed App",
  "signOnMode": "WS_FEDERATION",
  "settings": {
    "app": {
      "audienceRestriction": "urn:example:app",
      "groupName": null,
      "groupValueFormat": "windowsDomainQualifiedName",
      "realm": "urn:example:app",
      "wReplyURL": "https://example.com/",
      "attributeStatements": null,
      "nameIDFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
      "authnContextClassRef": "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport",
      "siteURL": "https://example.com",
      "wReplyOverride": false,
      "groupFilter": null,
      "usernameAttribute": "username"
    }
  }
}' "https://${org}.okta.com/api/v1/apps"
~~~

### Get Application
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /apps/*:id*</span>

Fetches an application from your Okta organization by `id`.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description    | Param Type | DataType | Required | Default
--------- | -------------- | ---------- | -------- | -------- | -------
id        | `id` of an app | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

Fetched [Application](#application-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/apps/0oa1gjh63g214q0Hq0g4"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "0oa1gjh63g214q0Hq0g4",
  "name": "testorgone_customsaml20app_1",
  "label": "Custom Saml 2.0 App",
  "status": "ACTIVE",
  "lastUpdated": "2016-08-09T20:12:19.000Z",
  "created": "2016-08-09T20:12:19.000Z",
  "accessibility": {
    "selfService": false,
    "errorRedirectUrl": null,
    "loginRedirectUrl": null
  },
  "visibility": {
    "autoSubmitToolbar": false,
    "hide": {
      "iOS": false,
      "web": false
    },
    "appLinks": {
      "testorgone_customsaml20app_1_link": true
    }
  },
  "features": [],
  "signOnMode": "SAML_2_0",
  "credentials": {
    "userNameTemplate": {
      "template": "${fn:substringBefore(source.login, \"@\")}",
      "type": "BUILT_IN"
    },
    "signing": {}
  },
  "settings": {
    "app": {},
    "notifications": {
      "vpn": {
        "network": {
          "connection": "DISABLED"
        },
        "message": null,
        "helpUrl": null
      }
    },
    "signOn": {
      "defaultRelayState": "",
      "ssoAcsUrl": "http://example.okta.com",
      "idpIssuer": "http://www.okta.com/${org.externalKey}",
      "audience": "https://example.com/tenant/123",
      "recipient": "http://recipient.okta.com",
      "destination": "http://destination.okta.com",
      "subjectNameIdTemplate": "${user.userName}",
      "subjectNameIdFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
      "responseSigned": true,
      "assertionSigned": true,
      "signatureAlgorithm": "RSA_SHA256",
      "digestAlgorithm": "SHA256",
      "honorForceAuthn": true,
      "authnContextClassRef": "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport",
      "spIssuer": null,
      "requestCompressed": false,
      "attributeStatements": []
    }
  },
  "_links": {
    "logo": [
      {
        "name": "medium",
        "href": "http://testorgone.okta.com/assets/img/logos/default.6770228fb0dab49a1695ef440a5279bb.png",
        "type": "image/png"
      }
    ],
    "appLinks": [
      {
        "name": "testorgone_customsaml20app_1_link",
        "href": "http://testorgone.okta.com/home/testorgone_customsaml20app_1/0oa1gjh63g214q0Hq0g4/aln1gofChJaerOVfY0g4",
        "type": "text/html"
      }
    ],
    "help": {
      "href": "http://testorgone-admin.okta.com/app/testorgone_customsaml20app_1/0oa1gjh63g214q0Hq0g4/setup/help/SAML_2_0/instructions",
      "type": "text/html"
    },
    "users": {
      "href": "http://testorgone.okta.com/api/v1/apps/0oa1gjh63g214q0Hq0g4/users"
    },
    "deactivate": {
      "href": "http://testorgone.okta.com/api/v1/apps/0oa1gjh63g214q0Hq0g4/lifecycle/deactivate"
    },
    "groups": {
      "href": "http://testorgone.okta.com/api/v1/apps/0oa1gjh63g214q0Hq0g4/groups"
    },
    "metadata": {
      "href": "http://testorgone.okta.com/api/v1/apps/0oa1gjh63g214q0Hq0g4/sso/saml/metadata",
      "type": "application/xml"
    }
  }
}
~~~

### List Applications
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /apps</span>

Enumerates apps added to your organization with pagination. A subset of apps can be returned that match a supported filter expression or query.

- [List Applications with Defaults](#list-applications-with-defaults)
- [List Applications Assigned to User](#list-applications-assigned-to-user)
- [List Applications Assigned to Group](#list-applications-assigned-to-group)
- [List Applications Using a Key](#list-applications-using-a-key)

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                                                                                      | Param Type | DataType | Required | Default
--------- | ---------------------------------------------------------------------------------------------------------------- | ---------- | -------- | -------- | -------
limit     | Specifies the number of results for a page                                                                       | Query      | Number   | FALSE    | 20
filter    | Filters apps by `status`, `user.id`, `group.id` or `credentials.signing.kid` expression                                                    | Query      | String   | FALSE    |
after     | Specifies the pagination cursor for the next page of apps                                                        | Query      | String   | FALSE    |
expand    | Traverses `users` link relationship and optionally embeds [Application User](#application-user-model) resource   | Query      | String   | FALSE    |

> The page cursor should treated as an opaque value and obtained through the next link relation. See [Pagination](/docs/api/getting_started/design_principles.html#pagination)

###### Filters

The following filters are supported with the filter query parameter:

Filter                 | Description
---------------------- | ------------------------------------------------------
`status eq "ACTIVE"`   | Apps that have a `status` of `ACTIVE`
`status eq "INACTIVE"` | Apps that have a `status` of `INACTIVE`
`user.id eq ":uid"`    | Apps assigned to a specific user such as `00ucw2RPGIUNTDQOYPOF`
`group.id eq ":gid"`   | Apps assigned to a specific group such as `00gckgEHZXOUDGDJLYLG`
`credentials.signing.kid eq ":kid"`   | Apps using a particular key such as `SIMcCQNY3uwXoW3y0vf6VxiBb5n9pf8L2fK8d-FIbm4`

> Only a single expression is supported as this time. The only supported filter type is `eq`.

> To use `credentials.signing.kid` as a filter, you must enable the key rollover feature. Key rollover is an Early Access feature; contact Customer Support to enable it.

###### Link Expansions

The following link expansions are supported to embed additional resources into the response:

Expansion    | Description
------------ | ---------------------------------------------------------------------------------------------------------------
`user/:id`   | Embeds the [Application User](#application-user-model) for an assigned user such as `user/00ucw2RPGIUNTDQOYPOF`

> The `user/:id` expansion can currently only be used in conjunction with the `user.id eq ":uid"` filter (See [List Applications Assigned to User](#list-applications-assigned-to-user)).


##### Response Parameters
{:.api .api-response .api-response-params}

Array of [Applications](#application-model)

#### List Applications with Defaults
{:.api .api-operation}

Enumerates all apps added to your organization

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/apps"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[
  {
    "id": "0oa1gjh63g214q0Hq0g4",
    "name": "testorgone_customsaml20app_1",
    "label": "Custom Saml 2.0 App",
    "status": "ACTIVE",
    "lastUpdated": "2016-08-09T20:12:19.000Z",
    "created": "2016-08-09T20:12:19.000Z",
    "accessibility": {
      "selfService": false,
      "errorRedirectUrl": null,
      "loginRedirectUrl": null
    },
    "visibility": {
      "autoSubmitToolbar": false,
      "hide": {
        "iOS": false,
        "web": false
      },
      "appLinks": {
        "testorgone_customsaml20app_1_link": true
      }
    },
    "features": [],
    "signOnMode": "SAML_2_0",
    "credentials": {
      "userNameTemplate": {
        "template": "${fn:substringBefore(source.login, \"@\")}",
        "type": "BUILT_IN"
      },
      "signing": {}
    },
    "settings": {
      "app": {},
      "notifications": {
        "vpn": {
          "network": {
            "connection": "DISABLED"
          },
          "message": null,
          "helpUrl": null
        }
      },
      "signOn": {
        "defaultRelayState": "",
        "ssoAcsUrl": "http://example.okta.com",
        "idpIssuer": "http://www.okta.com/${org.externalKey}",
        "audience": "https://example.com/tenant/123",
        "recipient": "http://recipient.okta.com",
        "destination": "http://destination.okta.com",
        "subjectNameIdTemplate": "${user.userName}",
        "subjectNameIdFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
        "responseSigned": true,
        "assertionSigned": true,
        "signatureAlgorithm": "RSA_SHA256",
        "digestAlgorithm": "SHA256",
        "honorForceAuthn": true,
        "authnContextClassRef": "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport",
        "spIssuer": null,
        "requestCompressed": false,
        "attributeStatements": []
      }
    },
    "_links": {
      "logo": [
        {
          "name": "medium",
          "href": "http://testorgone.okta.com/assets/img/logos/default.6770228fb0dab49a1695ef440a5279bb.png",
          "type": "image/png"
        }
      ],
      "appLinks": [
        {
          "name": "testorgone_customsaml20app_1_link",
          "href": "http://testorgone.okta.com/home/testorgone_customsaml20app_1/0oa1gjh63g214q0Hq0g4/aln1gofChJaerOVfY0g4",
          "type": "text/html"
        }
      ],
      "help": {
        "href": "http://testorgone-admin.okta.com/app/testorgone_customsaml20app_1/0oa1gjh63g214q0Hq0g4/setup/help/SAML_2_0/instructions",
        "type": "text/html"
      },
      "users": {
        "href": "http://testorgone.okta.com/api/v1/apps/0oa1gjh63g214q0Hq0g4/users"
      },
      "deactivate": {
        "href": "http://testorgone.okta.com/api/v1/apps/0oa1gjh63g214q0Hq0g4/lifecycle/deactivate"
      },
      "groups": {
        "href": "http://testorgone.okta.com/api/v1/apps/0oa1gjh63g214q0Hq0g4/groups"
      },
      "metadata": {
        "href": "http://testorgone.okta.com:/api/v1/apps/0oa1gjh63g214q0Hq0g4/sso/saml/metadata",
        "type": "application/xml"
      }
    }
  },
  {
    "id": "0oabkvBLDEKCNXBGYUAS",
    "name": "template_swa",
    "label": "Sample Plugin App",
    "status": "ACTIVE",
    "lastUpdated": "2013-09-11T17:58:54.000Z",
    "created": "2013-09-11T17:46:08.000Z",
    "accessibility": {
      "selfService": false,
      "errorRedirectUrl": null
    },
    "visibility": {
      "autoSubmitToolbar": false,
      "hide": {
        "iOS": false,
        "web": false
      },
      "appLinks": {
        "login": true
      }
    },
    "features": [],
    "signOnMode": "BROWSER_PLUGIN",
    "credentials": {
      "scheme": "EDIT_USERNAME_AND_PASSWORD",
      "userNameTemplate": {
        "template": "${source.login}",
        "type": "BUILT_IN"
      }
    },
    "settings": {
      "app": {
        "buttonField": "btn-login",
        "passwordField": "txtbox-password",
        "usernameField": "txtbox-username",
        "url": "https://example.com/login.html"
      }
    },
    "_links": {
      "logo": [
        {
          "href": "https:/example.okta.com/img/logos/logo_1.png",
          "name": "medium",
          "type": "image/png"
        }
      ],
      "users": {
        "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/users"
      },
      "groups": {
        "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/groups"
      },
      "self": {
        "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS"
      },
      "deactivate": {
        "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/lifecycle/deactivate"
      }
    }
  }
]
~~~

#### List Applications Assigned to User
{:.api .api-operation}

Enumerates all applications assigned to a user and optionally embeds their [Application User](#application-user-model) in a single response.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/apps?filter=user.id+eq+\"00ucw2RPGIUNTDQOYPOF\"&expand=user/00ucw2RPGIUNTDQOYPOF"
~~~

> The `expand=user/:id` query parameter optionally return the user's [Application User](#application-user-model) information  in the response body's `_embedded` property.

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[
  {
    "id": "0oa1gjh63g214q0Hq0g4",
    "name": "testorgone_customsaml20app_1",
    "label": "Custom Saml 2.0 App",
    "status": "ACTIVE",
    "lastUpdated": "2016-08-09T20:12:19.000Z",
    "created": "2016-08-09T20:12:19.000Z",
    "accessibility": {
      "selfService": false,
      "errorRedirectUrl": null,
      "loginRedirectUrl": null
    },
    "visibility": {
      "autoSubmitToolbar": false,
      "hide": {
        "iOS": false,
        "web": false
      },
      "appLinks": {
        "testorgone_customsaml20app_1_link": true
      }
    },
    "features": [],
    "signOnMode": "SAML_2_0",
    "credentials": {
      "userNameTemplate": {
        "template": "${fn:substringBefore(source.login, \"@\")}",
        "type": "BUILT_IN"
      },
      "signing": {}
    },
    "settings": {
      "app": {},
      "notifications": {
        "vpn": {
          "network": {
            "connection": "DISABLED"
          },
          "message": null,
          "helpUrl": null
        }
      },
      "signOn": {
        "defaultRelayState": "",
        "ssoAcsUrl": "http://example.okta.com",
        "idpIssuer": "http://www.okta.com/${org.externalKey}",
        "audience": "https://example.com/tenant/123",
        "recipient": "http://recipient.okta.com",
        "destination": "http://destination.okta.com",
        "subjectNameIdTemplate": "${user.userName}",
        "subjectNameIdFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
        "responseSigned": true,
        "assertionSigned": true,
        "signatureAlgorithm": "RSA_SHA256",
        "digestAlgorithm": "SHA256",
        "honorForceAuthn": true,
        "authnContextClassRef": "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport",
        "spIssuer": null,
        "requestCompressed": false,
        "attributeStatements": []
      }
    },
    "_links": {
      "logo": [
        {
          "name": "medium",
          "href": "http://testorgone.okta.com/assets/img/logos/default.6770228fb0dab49a1695ef440a5279bb.png",
          "type": "image/png"
        }
      ],
      "appLinks": [
        {
          "name": "testorgone_customsaml20app_1_link",
          "href": "http://testorgone.okta.com/home/testorgone_customsaml20app_1/0oa1gjh63g214q0Hq0g4/aln1gofChJaerOVfY0g4",
          "type": "text/html"
        }
      ],
      "help": {
        "href": "http://testorgone-admin.okta.com/app/testorgone_customsaml20app_1/0oa1gjh63g214q0Hq0g4/setup/help/SAML_2_0/instructions",
        "type": "text/html"
      },
      "users": {
        "href": "http://testorgone.okta.com/api/v1/apps/0oa1gjh63g214q0Hq0g4/users"
      },
      "deactivate": {
        "href": "http://testorgone.okta.com/api/v1/apps/0oa1gjh63g214q0Hq0g4/lifecycle/deactivate"
      },
      "groups": {
        "href": "http://testorgone.okta.com/api/v1/apps/0oa1gjh63g214q0Hq0g4/groups"
      },
      "metadata": {
        "href": "http://testorgone.okta.com/api/v1/apps/0oa1gjh63g214q0Hq0g4/sso/saml/metadata",
        "type": "application/xml"
      }
    },
    "_embedded": {
      "user": {
        "id": "00ucw2RPGIUNTDQOYPOF",
        "externalId": null,
        "created": "2014-03-21T23:31:35.000Z",
        "lastUpdated": "2014-03-21T23:31:35.000Z",
        "scope": "USER",
        "status": "ACTIVE",
        "statusChanged": "2014-03-21T23:31:35.000Z",
        "passwordChanged": null,
        "syncState": "DISABLED",
        "lastSync": null,
        "credentials": {
          "userName": "user@example.com"
        },
        "_links": {
          "app": {
            "href": "https://example.okta.com/api/v1/apps/0oabizCHPNYALCHDUIOD"
          },
          "user": {
            "href": "https://example.okta.com/api/v1/users/00ucw2RPGIUNTDQOYPOF"
          }
        }
      }
    }
  },
  {
    "id": "0oabkvBLDEKCNXBGYUAS",
    "name": "template_swa",
    "label": "Sample Plugin App",
    "status": "ACTIVE",
    "lastUpdated": "2013-09-11T17:58:54.000Z",
    "created": "2013-09-11T17:46:08.000Z",
    "accessibility": {
      "selfService": false,
      "errorRedirectUrl": null
    },
    "visibility": {
      "autoSubmitToolbar": false,
      "hide": {
        "iOS": false,
        "web": false
      },
      "appLinks": {
        "login": true
      }
    },
    "features": [],
    "signOnMode": "BROWSER_PLUGIN",
    "credentials": {
      "scheme": "EDIT_USERNAME_AND_PASSWORD",
      "userNameTemplate": {
        "template": "${source.login}",
        "type": "BUILT_IN"
      }
    },
    "settings": {
      "app": {
        "buttonField": "btn-login",
        "passwordField": "txtbox-password",
        "usernameField": "txtbox-username",
        "url": "https://example.com/login.html"
      }
    },
    "_links": {
      "logo": [
        {
          "href": "https:/example.okta.com/img/logos/logo_1.png",
          "name": "medium",
          "type": "image/png"
        }
      ],
      "users": {
        "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/users"
      },
      "groups": {
        "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/groups"
      },
      "self": {
        "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS"
      },
      "deactivate": {
        "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/lifecycle/deactivate"
      }
    },
    "_embedded": {
      "user": {
        "id": "00ucw2RPGIUNTDQOYPOF",
        "externalId": null,
        "created": "2014-06-10T15:16:01.000Z",
        "lastUpdated": "2014-06-10T15:17:38.000Z",
        "scope": "USER",
        "status": "ACTIVE",
        "statusChanged": "2014-06-10T15:16:01.000Z",
        "passwordChanged": "2014-06-10T15:17:38.000Z",
        "syncState": "DISABLED",
        "lastSync": null,
        "credentials": {
          "userName": "user@example.com",
          "password": {}
        },
        "_links": {
          "app": {
            "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS"
          },
          "user": {
            "href": "https://example.okta.com/api/v1/users/00ucw2RPGIUNTDQOYPOF"
          }
        }
      }
    }
  }
]
~~~

#### List Applications Assigned to Group
{:.api .api-operation}

Enumerates all applications assigned to a group

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/apps?filter=group.id+eq+\"00gckgEHZXOUDGDJLYLG\""
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[
  {
    "id": "0oabkvBLDEKCNXBGYUAS",
    "name": "template_swa",
    "label": "Sample Plugin App",
    "status": "ACTIVE",
    "lastUpdated": "2013-09-11T17:58:54.000Z",
    "created": "2013-09-11T17:46:08.000Z",
    "accessibility": {
      "selfService": false,
      "errorRedirectUrl": null
    },
    "visibility": {
      "autoSubmitToolbar": false,
      "hide": {
        "iOS": false,
        "web": false
      },
      "appLinks": {
        "login": true
      }
    },
    "features": [],
    "signOnMode": "BROWSER_PLUGIN",
    "credentials": {
      "scheme": "EDIT_USERNAME_AND_PASSWORD",
      "userNameTemplate": {
        "template": "${source.login}",
        "type": "BUILT_IN"
      }
    },
    "settings": {
      "app": {
        "buttonField": "btn-login",
        "passwordField": "txtbox-password",
        "usernameField": "txtbox-username",
        "url": "https://example.com/login.html"
      }
    },
    "_links": {
      "logo": [
        {
          "href": "https:/example.okta.com/img/logos/logo_1.png",
          "name": "medium",
          "type": "image/png"
        }
      ],
      "users": {
        "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/users"
      },
      "groups": {
        "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/groups"
      },
      "self": {
        "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS"
      },
      "deactivate": {
        "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/lifecycle/deactivate"
      }
    }
  }
]
~~~

#### List Applications Using a key
{:.api .api-operation}

Enumerates all applications using a key.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/apps?filter=credentials.signing.kid+eq+\"SIMcCQNY3uwXoW3y0vf6VxiBb5n9pf8L2fK8d-FIbm4\""
~~~


##### Response Example
{:.api .api-response .api-response-example}

~~~json
[
  {
    "id": "0oa1gjh63g214q0Hq0g4",
    "name": "testorgone_customsaml20app_1",
    "label": "Custom Saml 2.0 App",
    "status": "ACTIVE",
    "lastUpdated": "2016-08-09T20:12:19.000Z",
    "created": "2016-08-09T20:12:19.000Z",
    "accessibility": {
      "selfService": false,
      "errorRedirectUrl": null,
      "loginRedirectUrl": null
    },
    "visibility": {
      "autoSubmitToolbar": false,
      "hide": {
        "iOS": false,
        "web": false
      },
      "appLinks": {
        "testorgone_customsaml20app_1_link": true
      }
    },
    "features": [],
    "signOnMode": "SAML_2_0",
    "credentials": {
      "userNameTemplate": {
        "template": "${fn:substringBefore(source.login, \"@\")}",
        "type": "BUILT_IN"
      },
       "signing": {
      "kid": "SIMcCQNY3uwXoW3y0vf6VxiBb5n9pf8L2fK8d-FIbm4"
      }
    },
    "settings": {
      "app": {},
      "notifications": {
        "vpn": {
          "network": {
            "connection": "DISABLED"
          },
          "message": null,
          "helpUrl": null
        }
      },
      "signOn": {
        "defaultRelayState": "",
        "ssoAcsUrl": "http://example.okta.com",
        "idpIssuer": "http://www.okta.com/${org.externalKey}",
        "audience": "https://example.com/tenant/123",
        "recipient": "http://recipient.okta.com",
        "destination": "http://destination.okta.com",
        "subjectNameIdTemplate": "${user.userName}",
        "subjectNameIdFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
        "responseSigned": true,
        "assertionSigned": true,
        "signatureAlgorithm": "RSA_SHA256",
        "digestAlgorithm": "SHA256",
        "honorForceAuthn": true,
        "authnContextClassRef": "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport",
        "spIssuer": null,
        "requestCompressed": false,
        "attributeStatements": []
      }
    },
    "_links": {
      "logo": [
        {
          "name": "medium",
          "href": "http://testorgone.okta.com/assets/img/logos/default.6770228fb0dab49a1695ef440a5279bb.png",
          "type": "image/png"
        }
      ],
      "appLinks": [
        {
          "name": "testorgone_customsaml20app_1_link",
          "href": "http://testorgone.okta.com/home/testorgone_customsaml20app_1/0oa1gjh63g214q0Hq0g4/aln1gofChJaerOVfY0g4",
          "type": "text/html"
        }
      ],
      "help": {
        "href": "http://testorgone-admin.okta.com/app/testorgone_customsaml20app_1/0oa1gjh63g214q0Hq0g4/setup/help/SAML_2_0/instructions",
        "type": "text/html"
      },
      "users": {
        "href": "http://testorgone.okta.com/api/v1/apps/0oa1gjh63g214q0Hq0g4/users"
      },
      "deactivate": {
        "href": "http://testorgone.okta.com/api/v1/apps/0oa1gjh63g214q0Hq0g4/lifecycle/deactivate"
      },
      "groups": {
        "href": "http://testorgone.okta.com/api/v1/apps/0oa1gjh63g214q0Hq0g4/groups"
      },
      "metadata": {
        "href": "http://testorgone.okta.com:/api/v1/apps/0oa1gjh63g214q0Hq0g4/sso/saml/metadata",
        "type": "application/xml"
      }
    }
  }
]
~~~

### Update Application
{:.api .api-operation}

<span class="api-uri-template api-uri-put"><span class="api-label">PUT</span> /apps/*:id*</span>

Updates an application in your organization.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description         | Param Type | DataType                          | Required | Default
--------- | ------------------- | ---------- | --------------------------------- | -------- | -------
id        | id of app to update | URL        | String                            | TRUE     |
app       | Updated app         | Body       | [Application](#application-model) | FALSE    |

> All properties must be specified when updating an app.  **Delta updates are not supported.**

##### Response Parameters
{:.api .api-response .api-response-params}

Updated [Application](#application-model)

#### Set SWA User-Editable UserName & Password
{:.api .api-operation}

Configures the `EDIT_USERNAME_AND_PASSWORD` scheme for a SWA application with a username template

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X PUT \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "name": "template_swa",
  "label": "Sample Plugin App",
  "status": "ACTIVE",
  "accessibility": {
    "selfService": false,
    "errorRedirectUrl": null
  },
  "visibility": {
    "autoSubmitToolbar": false,
    "hide": {
      "iOS": false,
      "web": false
    },
    "appLinks": {
      "login": true
    }
  },
  "features": [],
  "signOnMode": "BROWSER_PLUGIN",
  "credentials": {
    "scheme": "EDIT_USERNAME_AND_PASSWORD",
    "userNameTemplate": {
      "template": "${source.login}",
      "type": "BUILT_IN"
    }
  },
  "settings": {
    "app": {
      "buttonField": "btn-login",
      "passwordField": "txtbox-password",
      "usernameField": "txtbox-username",
      "url": "https://example.com/login.html"
    }
  }
}' "https://${org}.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "0oabkvBLDEKCNXBGYUAS",
  "name": "template_swa",
  "label": "Sample Plugin App",
  "status": "ACTIVE",
  "lastUpdated": "2013-10-01T06:28:03.486Z",
  "created": "2013-09-11T17:46:08.000Z",
  "accessibility": {
    "selfService": false,
    "errorRedirectUrl": null
  },
  "visibility": {
    "autoSubmitToolbar": false,
    "hide": {
      "iOS": false,
      "web": false
    },
    "appLinks": {
      "login": true
    }
  },
  "features": [],
  "signOnMode": "BROWSER_PLUGIN",
  "credentials": {
    "scheme": "EDIT_USERNAME_AND_PASSWORD",
    "userNameTemplate": {
      "template": "${source.login}",
      "type": "BUILT_IN"
    }
  },
  "settings": {
    "app": {
      "buttonField": "btn-login",
      "passwordField": "txtbox-password",
      "usernameField": "txtbox-username",
      "url": "https://example.com/login.html"
    }
  },
  "_links": {
    "logo": [
      {
        "href": "https:/example.okta.com/img/logos/logo_1.png",
        "name": "medium",
        "type": "image/png"
      }
    ],
    "users": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/users"
    },
    "groups": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/groups"
    },
    "self": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS"
    },
    "deactivate": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/lifecycle/deactivate"
    }
  }
}
~~~

#### Set SWA Administrator Sets Username and Password
{:.api .api-operation}

Configures the `ADMIN_SETS_CREDENTIALS` scheme for a SWA application with a username template

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X PUT \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "name": "template_swa",
  "label": "Sample Plugin App",
  "status": "ACTIVE",
  "accessibility": {
    "selfService": false,
    "errorRedirectUrl": null
  },
  "visibility": {
    "autoSubmitToolbar": false,
    "hide": {
      "iOS": false,
      "web": false
    },
    "appLinks": {
      "login": true
    }
  },
  "features": [],
  "signOnMode": "BROWSER_PLUGIN",
  "credentials": {
    "scheme": "ADMIN_SETS_CREDENTIALS",
    "userNameTemplate": {
      "template": "${source.login}",
      "type": "BUILT_IN"
    }
  },
  "settings": {
    "app": {
      "buttonField": "btn-login",
      "passwordField": "txtbox-password",
      "usernameField": "txtbox-username",
      "url": "https://example.com/login.html"
    }
  }
}' "https://${org}.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "0oabkvBLDEKCNXBGYUAS",
  "name": "template_swa",
  "label": "Sample Plugin App",
  "status": "ACTIVE",
  "lastUpdated": "2013-10-01T06:28:03.486Z",
  "created": "2013-09-11T17:46:08.000Z",
  "accessibility": {
    "selfService": false,
    "errorRedirectUrl": null
  },
  "visibility": {
    "autoSubmitToolbar": false,
    "hide": {
      "iOS": false,
      "web": false
    },
    "appLinks": {
      "login": true
    }
  },
  "features": [],
  "signOnMode": "BROWSER_PLUGIN",
  "credentials": {
    "scheme": "ADMIN_SETS_CREDENTIALS",
    "userNameTemplate": {
      "template": "${source.login}",
      "type": "BUILT_IN"
    }
  },
  "settings": {
    "app": {
      "buttonField": "btn-login",
      "passwordField": "txtbox-password",
      "usernameField": "txtbox-username",
      "url": "https://example.com/login.html"
    }
  },
  "_links": {
    "logo": [
      {
        "href": "https:/example.okta.com/img/logos/logo_1.png",
        "name": "medium",
        "type": "image/png"
      }
    ],
    "users": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/users"
    },
    "groups": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/groups"
    },
    "self": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS"
    },
    "deactivate": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/lifecycle/deactivate"
    }
  }
}
~~~

#### Set SWA User-Editable Password
{:.api .api-operation}

Configures the `EDIT_PASSWORD_ONLY` scheme for a SWA application with a username template

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X PUT \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "name": "template_swa",
  "label": "Sample Plugin App",
  "status": "ACTIVE",
  "accessibility": {
    "selfService": false,
    "errorRedirectUrl": null
  },
  "visibility": {
    "autoSubmitToolbar": false,
    "hide": {
      "iOS": false,
      "web": false
    },
    "appLinks": {
      "login": true
    }
  },
  "features": [],
  "signOnMode": "BROWSER_PLUGIN",
  "credentials": {
    "scheme": "EDIT_PASSWORD_ONLY",
    "userNameTemplate": {
      "template": "${source.login}",
      "type": "BUILT_IN"
    }
  },
  "settings": {
    "app": {
      "buttonField": "btn-login",
      "passwordField": "txtbox-password",
      "usernameField": "txtbox-username",
      "url": "https://example.com/login.html"
    }
  }
}' "https://${org}.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "0oabkvBLDEKCNXBGYUAS",
  "name": "template_swa",
  "label": "Sample Plugin App",
  "status": "ACTIVE",
  "lastUpdated": "2013-10-01T06:25:37.612Z",
  "created": "2013-09-11T17:46:08.000Z",
  "accessibility": {
    "selfService": false,
    "errorRedirectUrl": null
  },
  "visibility": {
    "autoSubmitToolbar": false,
    "hide": {
      "iOS": false,
      "web": false
    },
    "appLinks": {
      "login": true
    }
  },
  "features": [],
  "signOnMode": "BROWSER_PLUGIN",
  "credentials": {
    "scheme": "EDIT_PASSWORD_ONLY",
    "userNameTemplate": {
      "template": "${source.login}",
      "type": "BUILT_IN"
    }
  },
  "settings": {
    "app": {
      "buttonField": "btn-login",
      "passwordField": "txtbox-password",
      "usernameField": "txtbox-username",
      "url": "https://example.com/login.html"
    }
  },
  "_links": {
    "logo": [
      {
        "href": "https:/example.okta.com/img/logos/logo_1.png",
        "name": "medium",
        "type": "image/png"
      }
    ],
    "users": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/users"
    },
    "groups": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/groups"
    },
    "self": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS"
    },
    "deactivate": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/lifecycle/deactivate"
    }
  }
}
~~~

#### Set SWA Okta Password
{:.api .api-operation}

Configures the `EXTERNAL_PASSWORD_SYNC` scheme for a SWA application with a username template

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X PUT \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "name": "template_swa",
  "label": "Sample Plugin App",
  "status": "ACTIVE",
  "accessibility": {
    "selfService": false,
    "errorRedirectUrl": null
  },
  "visibility": {
    "autoSubmitToolbar": false,
    "hide": {
      "iOS": false,
      "web": false
    },
    "appLinks": {
      "login": true
    }
  },
  "features": [],
  "signOnMode": "BROWSER_PLUGIN",
  "credentials": {
    "scheme": "EXTERNAL_PASSWORD_SYNC",
    "userNameTemplate": {
      "template": "${source.login}",
      "type": "BUILT_IN"
    }
  },
  "settings": {
    "app": {
      "buttonField": "btn-login",
      "passwordField": "txtbox-password",
      "usernameField": "txtbox-username",
      "url": "https://example.com/login.html"
    }
  }
}' "https://${org}.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "0oabkvBLDEKCNXBGYUAS",
  "name": "template_swa",
  "label": "Sample Plugin App",
  "status": "ACTIVE",
  "lastUpdated": "2013-10-01T06:30:17.151Z",
  "created": "2013-09-11T17:46:08.000Z",
  "accessibility": {
    "selfService": false,
    "errorRedirectUrl": null
  },
  "visibility": {
    "autoSubmitToolbar": false,
    "hide": {
      "iOS": false,
      "web": false
    },
    "appLinks": {
      "login": true
    }
  },
  "features": [],
  "signOnMode": "BROWSER_PLUGIN",
  "credentials": {
    "scheme": "EXTERNAL_PASSWORD_SYNC",
    "userNameTemplate": {
      "template": "${source.login}",
      "type": "BUILT_IN"
    }
  },
  "settings": {
    "app": {
      "buttonField": "btn-login",
      "passwordField": "txtbox-password",
      "usernameField": "txtbox-username",
      "url": "https://example.com/login.html"
    }
  },
  "_links": {
    "logo": [
      {
        "href": "https:/example.okta.com/img/logos/logo_1.png",
        "name": "medium",
        "type": "image/png"
      }
    ],
    "users": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/users"
    },
    "groups": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/groups"
    },
    "self": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS"
    },
    "deactivate": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/lifecycle/deactivate"
    }
  }
}
~~~

#### Set SWA Shared Credentials
{:.api .api-operation}

Configures the `SHARED_USERNAME_AND_PASSWORD` scheme for a SWA application with a username and password

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X PUT \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "name": "template_swa",
  "label": "Sample Plugin App",
  "status": "ACTIVE",
  "accessibility": {
    "selfService": false,
    "errorRedirectUrl": null
  },
  "visibility": {
    "autoSubmitToolbar": false,
    "hide": {
      "iOS": false,
      "web": false
    },
    "appLinks": {
      "login": true
    }
  },
  "features": [],
  "signOnMode": "BROWSER_PLUGIN",
  "credentials": {
    "scheme": "SHARED_USERNAME_AND_PASSWORD",
    "userNameTemplate": {
      "template": "${source.login}",
      "type": "BUILT_IN"
    },
    "userName": "sharedusername",
    "password": {
      "value": "sharedpassword"
    }
  },
  "settings": {
    "app": {
      "buttonField": "btn-login",
      "passwordField": "txtbox-password",
      "usernameField": "txtbox-username",
      "url": "https://example.com/login.html"
    }
  }
}' "https://${org}.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS"
~~~

##### Response Example
{:.api .reponse}

~~~json
{
  "id": "0oabkvBLDEKCNXBGYUAS",
  "name": "template_swa",
  "label": "Sample Plugin App",
  "status": "ACTIVE",
  "lastUpdated": "2013-10-01T06:20:18.436Z",
  "created": "2013-09-11T17:46:08.000Z",
  "accessibility": {
    "selfService": false,
    "errorRedirectUrl": null
  },
  "visibility": {
    "autoSubmitToolbar": false,
    "hide": {
      "iOS": false,
      "web": false
    },
    "appLinks": {
      "login": true
    }
  },
  "features": [],
  "signOnMode": "BROWSER_PLUGIN",
  "credentials": {
    "scheme": "SHARED_USERNAME_AND_PASSWORD",
    "userNameTemplate": {
      "template": "${source.login}",
      "type": "BUILT_IN"
    },
    "userName": "sharedusername",
    "password": {}
  },
  "settings": {
    "app": {
      "buttonField": "btn-login",
      "passwordField": "txtbox-password",
      "usernameField": "txtbox-username",
      "url": "https://example.com/login.html"
    }
  },
  "_links": {
    "logo": [
      {
        "href": "https:/example.okta.com/img/logos/logo_1.png",
        "name": "medium",
        "type": "image/png"
      }
    ],
    "users": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/users"
    },
    "groups": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/groups"
    },
    "self": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS"
    },
    "deactivate": {
      "href": "https://example.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/lifecycle/deactivate"
    }
  }
}
~~~

#### Update Key Credential for Application
{:.api .api-operation}

Update [application key credential](#application-key-credential-model) by `kid`

> You must enable the key rollover feature to perform this operation. Key rollover is an Early Access feature; contact Customer Support to enable it.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter     | Description                                                             | Param Type | DataType                                      | Required | Default
------------- | ----------------------------------------------------------------------- | ---------- | --------------------------------------------- | -------- | -------
aid           | unique key of [Application](#application-model)                         | URL        | String                                        | TRUE     |
app           | app with new key credential kid                                         | Body       | [Application](#application-model)             | FALSE    |

##### Response Parameters
{:.api .api-response .api-response-params}

[Application](#application-model) with updated `kid`.

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X PUT \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "name": "zendesk",
  "label": "Zendesk",
  "signOnMode": "SAML_2_0",
  "credentials": {
    "userNameTemplate": {
      "template": "${source.login}",
      "type": "BUILT_IN"
    },
    "signing": {
      "kid": "SIMcCQNY3uwXoW3y0vf6VxiBb5n9pf8L2fK8d-FIbm4"
    }
  }
}' "https://${org}.okta.com/api/v1/apps/0oainmLkOL329Jcju0g3"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "0oainmLkOL329Jcju0g3",
  "name": "zendesk",
  "label": "Zendesk",
  "status": "ACTIVE",
  "lastUpdated": "2015-12-16T00:00:44.000Z",
  "created": "2015-12-14T18:18:48.000Z",
  "accessibility": {
    "selfService": false,
    "errorRedirectUrl": null,
    "loginRedirectUrl": null
  },
  "licensing": {
    "seatCount": 0
  },
  "visibility": {
    "autoSubmitToolbar": true,
    "hide": {
      "iOS": false,
      "web": false
    },
    "appLinks": {
      "login": true
    }
  },
  "features": [],
  "signOnMode": "SAML_2_0",
  "credentials": {
    "userNameTemplate": {
      "template": "${source.login}",
      "type": "BUILT_IN"
    },
    "signing": {
      "kid": "SIMcCQNY3uwXoW3y0vf6VxiBb5n9pf8L2fK8d-FIbm4"
    }
  },
  "settings": {
    "app": {
      "companySubDomain": "aaa",
      "authToken": null
    },
    "notifications": {
      "vpn": {
        "network": {
          "connection": "DISABLED"
        },
        "message": null,
        "helpUrl": null
      }
    },
    "signOn": {
      "defaultRelayState": null
    }
  },
  "_links": {
    "logo": [
      {
        "name": "medium",
        "href": "http://testorgone.okta.com/img/logos/zendesk.png",
        "type": "image/png"
      }
    ],
    "appLinks": [
      {
        "name": "login",
        "href": "http://testorgone.okta.com/home/zendesk/0oainmLkOL329Jcju0g3/120",
        "type": "text/html"
      }
    ],
    "help": {
      "href": "http://testorgone-admin.okta.com/app/zendesk/0oainmLkOL329Jcju0g3/setup/help/SAML_2_0/external-doc",
      "type": "text/html"
    },
    "users": {
      "href": "http://testorgone.okta.com/api/v1/apps/0oainmLkOL329Jcju0g3/users"
    },
    "deactivate": {
      "href": "http://testorgone.okta.com:/api/v1/apps/0oainmLkOL329Jcju0g3/lifecycle/deactivate"
    },
    "groups": {
      "href": "http://testorgone.okta.com/api/v1/apps/0oainmLkOL329Jcju0g3/groups"
    },
    "metadata": {
      "href": "http://testorgone.okta.com/api/v1/apps/0oainmLkOL329Jcju0g3/sso/saml/metadata",
      "type": "application/xml"
    }
  }
}
~~~



### Delete Application
{:.api .api-operation}

<span class="api-uri-template api-uri-delete"><span class="api-label">DELETE</span> /apps/*:id*</span>

Removes an inactive application.

> Applications must be deactivated before they can be deleted

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description         | Param Type | DataType | Required | Default
--------- | ------------------- | ---------- | -------- | -------- | -------
id        | id of app to delete | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

An empty JSON object `{}`

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~ http
HTTP/1.1 204 No Content
~~~

If the application has an `ACTIVE` status you will receive an error response.

~~~ http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "errorCode": "E0000056",
  "errorSummary": "Delete application forbidden.",
  "errorLink": "E0000056",
  "errorId": "oaeHifznCllQ26xcRsO5vAk7A",
  "errorCauses": [
    {
      "errorSummary": "The application must be deactivated before deletion."
    }
  ]
}
~~~

## Application Lifecycle Operations

### Activate Application
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /apps/*:id*/lifecycle/activate</span>

Activates an inactive application.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description           | Param Type | DataType | Required | Default
--------- | --------------------- | ---------- | -------- | -------- | -------
id        | `id` of app to activate | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

An empty JSON object `{}`

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/lifecycle/activate"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{}
~~~

### Deactivate Application
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /apps/*:id*/lifecycle/deactivate</span>

Deactivates an active application.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description               | Param Type | DataType | Required | Default
--------- | ------------------------- | ---------- | -------- | -------- | -------
id        | `id` of app to deactivate | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

An empty JSON object `{}`

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/apps/0oabkvBLDEKCNXBGYUAS/lifecycle/deactivate"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{}
~~~

## Application User Operations

### Assign User to Application for SSO
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /apps/*:aid*/users</span>

Assigns a user without a [profile](#application-user-profile-object) to an application for SSO.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                                            | Param Type | DataType                                    | Required | Default
--------- | ---------------------------------------------------------------------- | ---------- | ------------------------------------------- | -------- | -------
aid       | unique key of [Application](#application-model)                        | URL        | String                                      | TRUE     |
appuser   | user's [credentials](#application-user-credentials-object) for the app | Body       | [Application User](#application-user-model) | TRUE     |

> Only the user's `id` is required for the request body of applications with [SignOn Modes](#signon-modes) or [Authentication Schemes](#authentication-schemes) that do not require or support credentials

> If your SSO application requires a profile but doesn't have provisioning enabled, you should add a profile to the request and use the [Assign User to Application for SSO & Provisioning](#assign-user-to-application-for-sso--provisioning) operation

##### Response Parameters
{:.api .api-response .api-response-params}

[Application User](#application-user-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "id": "00ud4tVDDXYVKPXKVLCO",
  "scope": "USER",
  "credentials": {
    "userName": "user@example.com",
    "password": {
      "value": "correcthorsebatterystaple"
    }
  }
}' "https://${org}.okta.com/api/v1/apps/0oad5lTSBOMUBOBVVQSC/users"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "00u15s1KDETTQMQYABRL",
  "externalId": null,
  "created": "2014-08-11T02:24:31.000Z",
  "lastUpdated": "2014-08-11T05:38:01.000Z",
  "scope": "USER",
  "status": "ACTIVE",
  "statusChanged": "2014-08-11T02:24:32.000Z",
  "passwordChanged": null,
  "syncState": "DISABLED",
  "lastSync": null,
  "credentials": {
    "userName": "user@example.com"
  },
  "profile": {},
  "_links": {
    "app": {
      "href": "https://example.okta.com/api/v1/apps/0oaq2rRZUQAKJIZYFIGM"
    },
    "user": {
      "href": "https://example.okta.com/api/v1/users/00u15s1KDETTQMQYABRL"
    }
  }
}
~~~

### Assign User to Application for SSO & Provisioning
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /apps/*:aid*/users</span>

Assigns an user to an application with [credentials](#application-user-credentials-object) and an app-specific [profile](#application-user-profile-object). Profile mappings defined for the application are first applied before applying any profile properties specified in the request.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                                                                                            | Param Type | DataType                                    | Required | Default
--------- | ---------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------- | -------- | -------
aid       | unique key of [Application](#application-model)                                                                        | URL        | String                                      | TRUE     |
appuser   | user's [credentials](#application-user-credentials-object) and [profile](#application-user-profile-object) for the app | Body       | [Application User](#application-user-model) | FALSE    |

> The [Application User](#application-user-model) must specify the user's `id` and should omit [credentials](#application-user-credentials-object) for applications with [SignOn Modes](#signon-modes) or [Authentication Schemes](#authentication-schemes) that do not require or support credentials.
>
> *You can only specify profile properties that are not defined by profile mappings when Universal Directory is enabled.*

##### Response Parameters
{:.api .api-response .api-response-params}

[Application User](#application-user-model) with user profile mappings applied

Your request will be rejected with a `403 Forbidden` status for applications with the `PUSH_NEW_USERS` or `PUSH_PROFILE_UPDATES` features enabled if the request specifies a value for an attribute that is defined by an application user profile mapping (Universal Directory) and the value for the attribute does not match the output of the mapping.

*It is recommended to omit mapped properties during assignment to minimize assignment errors.*

~~~json
{
  "errorCode": "E0000075",
  "errorSummary": "Cannot modify the firstName attribute because it has a field mapping and profile push is enabled.",
  "errorLink": "E0000075",
  "errorId": "oaez9oW_WXiR_K-WwaTKhlgBQ",
  "errorCauses": []
}
~~~

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "id": "00u15s1KDETTQMQYABRL",
  "scope": "USER",
  "credentials": {
    "userName": "saml.jackson@example.com"
  },
  "profile": {
      "salesforceGroups": [
        "Employee"
      ],
      "role": "Developer",
      "profile": "Standard User"
  }
}' "https://${org}.okta.com/api/v1/apps/0oad5lTSBOMUBOBVVQSC/users"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "00u13okQOVWZJGDOAUVR",
  "externalId": "005o0000000ogQ9AAI",
  "created": "2014-07-03T20:37:14.000Z",
  "lastUpdated": "2014-07-10T13:25:04.000Z",
  "scope": "USER",
  "status": "PROVISIONED",
  "statusChanged": "2014-07-03T20:37:17.000Z",
  "passwordChanged": null,
  "syncState": "SYNCHRONIZED",
  "lastSync": "2014-07-10T13:25:04.000Z",
  "credentials": {
    "userName": "saml.jackson@example.com"
  },
  "profile": {
    "secondEmail": null,
    "lastName": "Jackson",
    "mobilePhone": null,
    "email": "saml.jackson@example.com",
    "salesforceGroups": [
      "Employee"
    ],
    "role": "Developer",
    "firstName": "Saml",
    "profile": "Standard User"
  },
  "_links": {
    "app": {
      "href": "https://example.okta.com/api/v1/apps/0oa164zIYRQREYAAGGQR"
    },
    "user": {
      "href": "https://example.okta.com/api/v1/users/00u13okQOVWZJGDOAUVR"
    }
  }
}
~~~

### Get Assigned User for Application
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /apps/*:aid*/users/*:uid*</span>

Fetches a specific user assignment for application by `id`.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                     | Param Type | DataType | Required | Default
--------- | ----------------------------------------------- | ---------- | -------- | -------- | -------
aid       | unique key of [Application](#application-model) | URL        | String   | TRUE     |
uid       | unique key of assigned [User](/docs/api/resources/users.html)       | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[Application User](#application-user-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/apps/0oad5lTSBOMUBOBVVQSC/users/00ud4tVDDXYVKPXKVLCO"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "00u13okQOVWZJGDOAUVR",
  "externalId": "005o0000000ogQ9AAI",
  "created": "2014-07-03T20:37:14.000Z",
  "lastUpdated": "2014-07-10T13:25:04.000Z",
  "scope": "USER",
  "status": "PROVISIONED",
  "statusChanged": "2014-07-03T20:37:17.000Z",
  "passwordChanged": null,
  "syncState": "SYNCHRONIZED",
  "lastSync": "2014-07-10T13:25:04.000Z",
  "credentials": {
    "userName": "saml.jackson@example.com"
  },
  "profile": {
    "secondEmail": null,
    "lastName": "Jackson",
    "mobilePhone": null,
    "email": "saml.jackson@example.com",
    "salesforceGroups": [
      "Employee"
    ],
    "role": "Developer",
    "firstName": "Saml",
    "profile": "Standard User"
  },
  "_links": {
    "app": {
      "href": "https://example.okta.com/api/v1/apps/0oa164zIYRQREYAAGGQR"
    },
    "user": {
      "href": "https://example.okta.com/api/v1/users/00u13okQOVWZJGDOAUVR"
    }
  }
}
~~~

### List Users Assigned to Application
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /apps/*:aid*/users</span>

Enumerates all assigned [application users](#application-user-model) for an application.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                                      | Param Type | DataType | Required | Default
--------- | ---------------------------------------------------------------- | ---------- | -------- | -------- | -------
aid       | unique key of [Application](#application-model)                  | URL        | String   | TRUE     |
limit     | specifies the number of results for a page                       | Query      | Number   | FALSE    | 20
after     | specifies the pagination cursor for the next page of assignments | Query      | String   | FALSE    |

> The page cursor should treated as an opaque value and obtained through the next link relation. See [Pagination](/docs/api/getting_started/design_principles.html#pagination)

##### Response Parameters
{:.api .api-response .api-response-params}

Array of [Application Users](#application-user-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/apps/0oad5lTSBOMUBOBVVQSC/users"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[
  {
    "id": "00ui2sVIFZNCNKFFNBPM",
    "externalId": "005o0000000umnEAAQ",
    "created": "2014-08-15T18:59:43.000Z",
    "lastUpdated": "2014-08-15T18:59:48.000Z",
    "scope": "USER",
    "status": "PROVISIONED",
    "statusChanged": "2014-08-15T18:59:48.000Z",
    "passwordChanged": null,
    "syncState": "SYNCHRONIZED",
    "lastSync": "2014-08-15T18:59:48.000Z",
    "credentials": {
      "userName": "user@example.com"
    },
    "profile": {
      "secondEmail": null,
      "lastName": "McJanky",
      "mobilePhone": "415-555-555",
      "email": "user@example.com",
      "salesforceGroups": [],
      "role": "CEO",
      "firstName": "Karl",
      "profile": "Standard Platform User"
    },
    "_links": {
      "app": {
        "href": "https://example.okta.com/api/v1/apps/0oajiqIRNXPPJBNZMGYL"
      },
      "user": {
        "href": "https://example.okta.com/api/v1/users/00ui2sVIFZNCNKFFNBPM"
      }
    }
  },
  {
    "id": "00ujsgVNDRESKKXERBUJ",
    "externalId": "005o0000000uqJaAAI",
    "created": "2014-08-16T02:35:14.000Z",
    "lastUpdated": "2014-08-16T02:56:49.000Z",
    "scope": "USER",
    "status": "PROVISIONED",
    "statusChanged": "2014-08-16T02:56:49.000Z",
    "passwordChanged": null,
    "syncState": "SYNCHRONIZED",
    "lastSync": "2014-08-16T02:56:49.000Z",
    "credentials": {
      "userName": "saml.jackson@example.com"
    },
    "profile": {
      "secondEmail": null,
      "lastName": "Jackson",
      "mobilePhone": null,
      "email": "saml.jackson@example.com",
      "salesforceGroups": [
        "Employee"
      ],
      "role": "Developer",
      "firstName": "Saml",
      "profile": "Standard User"
    },
    "_links": {
      "app": {
        "href": "https://example.okta.com/api/v1/apps/0oajiqIRNXPPJBNZMGYL"
      },
      "user": {
        "href": "https://example.okta.com/api/v1/users/00ujsgVNDRESKKXERBUJ"
      }
    }
  }
]
~~~

### Update Application Credentials for Assigned User
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /apps/*:aid*/users/*:uid*</span>

Updates a user's [credentials](#application-user-credentials-object) for an assigned application

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                                        | Param Type | DataType                                    | Required | Default
--------- | ------------------------------------------------------------------ | ---------- | ------------------------------------------- | -------- | -------
aid       | unique key of [Application](#application-model)                    | URL        | String                                      | TRUE     |
uid       | unique key of a valid [User](/docs/api/resources/users.html)                           | URL        | String                                      | TRUE     |
appuser   | user's [credentials](#application-user-credentials-object) for app | Body       | [Application User](#application-user-model) | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[Application User](#application-user-model)

Your request will be rejected with a `400 Bad Request` status if you attempt to assign a username or password to an application with an incompatible [Authentication Scheme](#authentication-schemes)

~~~json
{
  "errorCode": "E0000041",
  "errorSummary": "Credentials should not be set on this resource based on the scheme.",
  "errorLink": "E0000041",
  "errorId": "oaeUM77NBynQQu4C_qT5ngjGQ",
  "errorCauses": [
    {
      "errorSummary": "User level credentials should not be provided for this scheme."
    }
  ]
}
~~~

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "credentials": {
    "userName": "user@example.com",
    "password": {
      "value": "updatedP@55word"
    }
  }
}' "https://${org}.okta.com/api/v1/apps/0oad5lTSBOMUBOBVVQSC/users/00ud4tVDDXYVKPXKVLCO"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "00ud4tVDDXYVKPXKVLCO",
  "externalId": null,
  "created": "2014-07-03T17:24:36.000Z",
  "lastUpdated": "2014-07-03T17:26:05.000Z",
  "scope": "USER",
  "status": "ACTIVE",
  "statusChanged": "2014-07-03T17:24:36.000Z",
  "passwordChanged": "2014-07-03T17:26:05.000Z",
  "syncState": "DISABLED",
  "lastSync": null,
  "credentials": {
    "userName": "user@example.com",
    "password": {}
  },
  "profile": {},
  "_links": {
    "app": {
      "href": "https://example.okta.com/api/v1/apps/0oad5lTSBOMUBOBVVQSC"
    },
    "user": {
      "href": "https://example.okta.com/api/v1/users/00ud4tVDDXYVKPXKVLCO"
    }
  }
}
~~~

### Update Application Profile for Assigned User
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /apps/*:aid*/users/*:uid*</span>

Updates a user's profile for an application

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                     | Param Type | DataType                                    | Required | Default
--------- | ----------------------------------------------- | ---------- | ------------------------------------------- | -------- | -------
aid       | unique key of [Application](#application-model) | URL        | String                                      | TRUE     |
uid       | unique key of a valid [User](/docs/api/resources/users.html)        | URL        | String                                      | TRUE     |
appuser   | credentials for app                             | Body       | [Application User](#application-user-model) | FALSE    |

##### Response Parameters
{:.api .api-response .api-response-params}

[Application User](#application-user-model) with user profile mappings applied

Your request will be rejected with a `403 Forbidden` status for applications with the `PUSH_NEW_USERS` or `PUSH_PROFILE_UPDATES` features enabled if the request specifies a value for an attribute that is defined by an application user profile mapping (Universal Directory) and the value for the attribute does not match the output of the mapping.

> The Okta API currently doesn't support entity tags for conditional updates.  It is only safe to fetch the most recent profile with [Get Assigned User for Application](#get-assigned-user-for-application), apply your profile update, then `POST` back the updated profile as long as you are the **only** user updating a user's application profile.

{% beta %}

During the profile image Beta, image property definitions in the schema are of the `Object` data type with an additional `extendedType` of `Image`.
When a user's app profile is retrieved via the API, however, the value will be a URL (represented as a String).  Some caveats apply:

1) Image properties are described differently in the schema than how the data actually comes back.  This discrepancy is deliberate for the time being, but is likely to change after Beta.  Special handling rules apply (described below).

2) During Beta, the URL returned is a placeholder URL, resolving to a placeholder image.  By GA, the URL returned will resolve to the image (that is, a logged in user can click it and retrieve the image).

**Updating image property values via Users API**

Okta does not support uploading images via the Apps API.  All operations in this API that update properties on a user work in a slightly different way when applied to image properties:

1)  When performing a full update, if the property is not passed, it is unset (if set).  The same applies if a partial update explicitly sets it to null.

2)  When "updating" the value, it must be set to the value returned by a GET on that user (resulting in no change).  Any other value will not validate.

{% endbeta %}

~~~json
{
  "errorCode": "E0000075",
  "errorSummary": "Cannot modify the firstName attribute because it has a field mapping and profile push is enabled.",
  "errorLink": "E0000075",
  "errorId": "oaez9oW_WXiR_K-WwaTKhlgBQ",
  "errorCauses": []
}
~~~

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "salesforceGroups": [
      "Partner"
    ],
    "role": "Developer",
    "profile": "Gold Partner User"
  }
}' "https://${org}.okta.com/api/v1/apps/0oad5lTSBOMUBOBVVQSC/users/00ud4tVDDXYVKPXKVLCO"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "00ujsgVNDRESKKXERBUJ",
  "externalId": "005o0000000uqJaAAI",
  "created": "2014-08-16T02:35:14.000Z",
  "lastUpdated": "2014-08-16T02:56:49.000Z",
  "scope": "USER",
  "status": "PROVISIONED",
  "statusChanged": "2014-08-16T02:56:49.000Z",
  "passwordChanged": null,
  "syncState": "SYNCHRONIZED",
  "lastSync": "2014-08-16T02:56:49.000Z",
  "credentials": {
    "userName": "saml.jackson@example.com"
  },
  "profile": {
    "secondEmail": null,
    "lastName": "Jackson",
    "mobilePhone": null,
    "email": "saml.jackson@example.com",
    "salesforceGroups": [
      "Partner"
    ],
    "role": "Developer",
    "firstName": "Saml",
    "profile": "Gold Partner User"
  },
  "_links": {
    "app": {
      "href": "https://example.com/api/v1/apps/0oad5lTSBOMUBOBVVQSC"
    },
    "user": {
      "href": "https://example.okta.com/api/v1/users/00ud4tVDDXYVKPXKVLCO"
    }
  }
}
~~~

### Remove User from Application
{:.api .api-operation}

<span class="api-uri-template api-uri-delete"><span class="api-label">DELETE</span> /apps/*:aid*/users/*:uid*</span>

Removes an assignment for a user from an application.

> This is a destructive operation and the user's app profile will not be recoverable.  If the app is enabled for provisioning and configured to deactivate users, the user will also be deactivated in the target application.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                     | Param Type | DataType | Required | Default
--------- | ----------------------------------------------- | ---------- | -------- | -------- | -------
aid       | unique key of [Application](#application-model) | URL        | String   | TRUE     |
uid       | unique key of assigned [User](/docs/api/resources/users.html)       | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

An empty JSON object `{}`

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/apps/0oad5lTSBOMUBOBVVQSC/users/00ud4tVDDXYVKPXKVLCO"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{}
~~~

## Application Group Operations

### Assign Group to Application
{:.api .api-operation}

<span class="api-uri-template api-uri-put"><span class="api-label">PUT</span> /apps/*:aid*/groups/*:gid*</span>

Assigns a group to an application

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                     | Param Type | DataType                                      | Required | Default
--------- | ----------------------------------------------- | ---------- | --------------------------------------------- | -------- | -------
aid       | unique key of [Application](#application-model) | URL        | String                                        | TRUE     |
gid       | unique key of a valid [Group](groups.html)      | URL        | String                                        | TRUE     |
appgroup  | App group                                       | Body       | [Application Group](#application-group-model) | FALSE    |

##### Response Parameters
{:.api .api-response .api-response-params}

All responses return the assigned [Application Group](#application-group-model).

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X PUT \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
}' "https://${org}.okta.com/api/v1/apps/0oad5lTSBOMUBOBVVQSC/groups/00gbkkGFFWZDLCNTAGQR"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "00gbkkGFFWZDLCNTAGQR",
  "lastUpdated": "2013-10-02T07:38:20.000Z",
  "priority": 0
}
~~~

### Get Assigned Group for Application
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /apps/*:aid*/groups/*:gid*</span>

Fetches an application group assignment

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                     | Param Type | DataType | Required | Default
--------- | ----------------------------------------------- | ---------- | -------- | -------- | -------
aid       | unique key of [Application](#application-model) | URL        | String   | TRUE     |
gid       | unique key of an assigned [Group](groups.html)  | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

Fetched [Application Group](#application-group-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/apps/0oad5lTSBOMUBOBVVQSC/groups/00gbkkGFFWZDLCNTAGQR"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "id": "00gbkkGFFWZDLCNTAGQR",
  "lastUpdated": "2013-10-02T07:38:20.000Z",
  "priority": 0
}
~~~

### List Groups Assigned to Application
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /apps/*:aid*/groups</span>

Enumerates group assignments for an application.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                                      | Param Type | DataType | Required | Default
--------- | ---------------------------------------------------------------- | ---------- | -------- | -------- | -------
aid       | unique key of [Application](#application-model)                  | URL        | String   | TRUE     |
limit     | Specifies the number of results for a page                       | Query      | Number   | FALSE    | 20
after     | Specifies the pagination cursor for the next page of assignments | Query      | String   | FALSE    |

> The page cursor should treated as an opaque value and obtained through the next link relation. See [Pagination](/docs/api/getting_started/design_principles.html#pagination)

##### Response Parameters
{:.api .api-response .api-response-params}

Array of [Application Groups](#application-group-model)

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/apps/0oad5lTSBOMUBOBVVQSC/groups"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[
  {
    "id": "00gbkkGFFWZDLCNTAGQR",
    "lastUpdated": "2013-10-02T07:38:20.000Z",
    "priority": 0
  },
  {
    "id": "00gg0xVALADWBPXOFZAS",
    "lastUpdated": "2013-10-02T14:40:29.000Z",
    "priority": 1
  }
]
~~~

### Remove Group from Application
{:.api .api-operation}

<span class="api-uri-template api-uri-delete"><span class="api-label">DELETE</span> /apps/*:aid*/groups/*:gid*</span>

Removes a group assignment from an application.

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter | Description                                     | Param Type | DataType | Required | Default
--------- | ----------------------------------------------- | ---------- | -------- | -------- | -------
aid       | unique key of [Application](#application-model) | URL        | String   | TRUE     |
gid       | unique key of an assigned [Group](groups.html)  | URL        | String   | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

An empty JSON object `{}`

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${org}.okta.com/api/v1/apps/0oad5lTSBOMUBOBVVQSC/groups/00gbkkGFFWZDLCNTAGQR"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{}
~~~

## Application Key Store Operations

> You must enable the key rollover feature to perform the following operations. Key rollover is an Early Access feature; contact Customer Support to enable it.

### Generate New Application Key Credential
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /apps/*:aid*/credentials/keys/generate</span>

Generates a new X.509 certificate for an application key credential

> To update application with the newly generated key credential, see [Update Key Credential](#update-key-credential-for-application)

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter     | Description                                                                     | Param Type | DataType                                      | Required | Default
------------- | ------------------------------------------------------------------------------- | ---------- | --------------------------------------------- | -------- | -------
aid           | unique key of [Application](#application-model)                                 | URL        | String                                        | TRUE     |
validityYears | expiry of the [Application Key Credential](#application-key-credential-model)   | Query      | Number                                        | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

Return the generated [Application Key Credential](#application-key-credential-model).

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
}' "https://${org}.okta.com/api/v1/apps/0oad5lTSBOMUBOBVVQSC/credentials/keys/generate?validityYears=2"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 201 Created
Content-Type: application/json
Location: https://${org}.okta.com/api/v1/apps/0oad5lTSBOMUBOBVVQSC/credentials/keys/SIMcCQNY3uwXoW3y0vf6VxiBb5n9pf8L2fK8d-FIbm4

{
  "created": "2015-12-10T18:56:23.000Z",
  "expiresAt": "2017-12-10T18:56:22.000Z",
  "x5c": [
    "MIIDqDCCApCgAwIBAgIGAVGNQFX5MA0GCSqGSIb3DQEBBQUAMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxFTATBgNVBAMMDGJhbGFjb21wdGVzdDEcMBoGCSqGSIb3DQEJARYNaW5mb0Bva3RhLmNvbTAeFw0xNTEyMTAxODU1MjJaFw0xNzEyMTAxODU2MjJaMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxFTATBgNVBAMMDGJhbGFjb21wdGVzdDEcMBoGCSqGSIb3DQEJARYNaW5mb0Bva3RhLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJJjrcnI6cXBiXNq9YDgfYrQe2O5qEHG4MXP8Ue0sMeefFkFEHYHnHUeZCq6WTAGqR+1LFgOl+Eq9We5V+qNlGIfkFkQ3iHGBrIALKqLCd0Et76HicDiegz7j9DtN+lo0hG/gfcw5783L5g5xeQ7zVmCQMkFwoUA0uA3bsfUSrmfORHJL+EMNQT8XIXD8NkG4g6u7ylHVRTLgXbe+W/p04m3EP6l41xl+MhIpBaPxDsyUvcKCNwkZN3aZIin1O9Y4YJuDHxrM64/VtLLp0sC05iawAmfsLunF7rdJAkWUpPn+xkviyNQ3UpvwAYuDr+jKLUdh2reRnm1PezxMIXzBVMCAwEAATANBgkqhkiG9w0BAQUFAAOCAQEARnFIjyitrCGbleFr3KeAwdOyeHiRmgeKupX5ZopgXtcseJoToUIinX5DVw2fVZPahqs0Q7/a0wcVnTRpw6946qZCwKd/PvZ1feVuVEA5Ui3+XvHuSH5xLp7NvYG1snNEvlbN3+NDUMlWj2NEbihowUBt9+UxTpQO3+N08q3aZk3hOZ+tHt+1Te7KEEL/4CM28GZ9MY7fSrS7MAgp1+ZXtn+kRlMrXnQ49qBda37brwDRqmSY9PwNMbev3r+9ZHwxr9W5wXW4Ev4C4xngA7RkVoyDbItSUho0I0M0u/LHuppclnXrw97xyO5Z883eIBvPVjfRcxsJxXJ8jx70ATDskw=="
  ],
  "kid": "SIMcCQNY3uwXoW3y0vf6VxiBb5n9pf8L2fK8d-FIbm4",
  "kty": "RSA",
  "use": "sig",
  "x5t#S256": "5GOpy9CQVtfvBmu2T8BHvpKE4OGtC3BuS046t7p9pps"
}
~~~

If validityYears is out of range (2 - 10 years), you will receive an error response.

~~~http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "errorCode": "E0000001",
  "errorSummary": "Api validation failed: generateKey",
  "errorLink": "E0000001",
  "errorId": "oaeMHrsk2WLTACvPU5T7yQ4yw",
  "errorCauses": [
    {
      "errorSummary": "Validity years out of range. It should be 2 - 10 years"
    }
  ]
}
~~~

### Clone Application Key Credential
{:.api .api-operation}

<span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /apps/*:aid*/credentials/keys/*:kid*/clone?targetAid=*:targetAid*</span>

Clones a X.509 certificate for an application key credential from a source application to target application.

> For step-by-step instructions to clone a credential, see [Share Application Key Credentials Between Apps](http://developer.okta.com/docs/how-to/sharing-cert.html).

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter     | Description                                                                     | Param Type | DataType                                      | Required | Default
------------- | ------------------------------------------------------------------------------- | ---------- | --------------------------------------------- | -------- | -------
aid           | Unique key of the [Application](#application-properties)                                 | URL        | String                                        | TRUE     |
kid           | Unique key of [Application Key Credential](#application-key-credential-model)   | URL        | String                                        | TRUE     |                                      |      |
targetAid |  Unique key of the target [Application](#application-properties)   | Query      | String                                        | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

Returns the cloned [Application Key Credential](#application-key-credential-model).

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
}' "https://${org}.okta.com/api/v1/apps/0oad5lTSBOMUBOBVVQSC/credentials/keys/SIMcCQNY3uwXoW3y0vf6VxiBb5n9pf8L2fK8d-FIbm4/clone?targetAid=0oal21k0DVN7DhS3R0g3"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~http
HTTP/1.1 201 Created
Content-Type: application/json
Location: https://${org}.okta.com/api/v1/apps/0oal21k0DVN7DhS3R0g3/credentials/keys/SIMcCQNY3uwXoW3y0vf6VxiBb5n9pf8L2fK8d-FIbm4

{
  "created": "2015-12-10T18:56:23.000Z",
  "expiresAt": "2017-12-10T18:56:22.000Z",
  "x5c": [
    "MIIDqDCCApCgAwIBAgIGAVGNQFX5MA0GCSqGSIb3DQEBBQUAMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxFTATBgNVBAMMDGJhbGFjb21wdGVzdDEcMBoGCSqGSIb3DQEJARYNaW5mb0Bva3RhLmNvbTAeFw0xNTEyMTAxODU1MjJaFw0xNzEyMTAxODU2MjJaMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxFTATBgNVBAMMDGJhbGFjb21wdGVzdDEcMBoGCSqGSIb3DQEJARYNaW5mb0Bva3RhLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJJjrcnI6cXBiXNq9YDgfYrQe2O5qEHG4MXP8Ue0sMeefFkFEHYHnHUeZCq6WTAGqR+1LFgOl+Eq9We5V+qNlGIfkFkQ3iHGBrIALKqLCd0Et76HicDiegz7j9DtN+lo0hG/gfcw5783L5g5xeQ7zVmCQMkFwoUA0uA3bsfUSrmfORHJL+EMNQT8XIXD8NkG4g6u7ylHVRTLgXbe+W/p04m3EP6l41xl+MhIpBaPxDsyUvcKCNwkZN3aZIin1O9Y4YJuDHxrM64/VtLLp0sC05iawAmfsLunF7rdJAkWUpPn+xkviyNQ3UpvwAYuDr+jKLUdh2reRnm1PezxMIXzBVMCAwEAATANBgkqhkiG9w0BAQUFAAOCAQEARnFIjyitrCGbleFr3KeAwdOyeHiRmgeKupX5ZopgXtcseJoToUIinX5DVw2fVZPahqs0Q7/a0wcVnTRpw6946qZCwKd/PvZ1feVuVEA5Ui3+XvHuSH5xLp7NvYG1snNEvlbN3+NDUMlWj2NEbihowUBt9+UxTpQO3+N08q3aZk3hOZ+tHt+1Te7KEEL/4CM28GZ9MY7fSrS7MAgp1+ZXtn+kRlMrXnQ49qBda37brwDRqmSY9PwNMbev3r+9ZHwxr9W5wXW4Ev4C4xngA7RkVoyDbItSUho0I0M0u/LHuppclnXrw97xyO5Z883eIBvPVjfRcxsJxXJ8jx70ATDskw=="
  ],
  "kid": "SIMcCQNY3uwXoW3y0vf6VxiBb5n9pf8L2fK8d-FIbm4",
  "kty": "RSA",
  "use": "sig",
  "x5t#S256": "5GOpy9CQVtfvBmu2T8BHvpKE4OGtC3BuS046t7p9pps"
}
~~~

If key is already present in the list of key credentials for the target application, you will receive a 400 error response.

~~~http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "errorCode": "E0000001",
  "errorSummary": "Api validation failed: cloneKey",
  "errorLink": "E0000001",
  "errorId": "oaeQACJOHl1TKSGj8jA3hEpAg",
  "errorCauses": [
    {
      "errorSummary": "Key already exists in the list of key credentials for the target app."
    }
  ]
}
~~~

### List Key Credentials for Application
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /apps/*:aid*/credentials/keys</span>

Enumerates key credentials for an application

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter     | Description                                     | Param Type | DataType                                      | Required | Default
------------- | ----------------------------------------------- | ---------- | --------------------------------------------- | -------- | -------
aid           | unique key of [Application](#application-model) | URL        | String                                        | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

Array of [Application Key Credential](#application-key-credential-model).

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
}' "https://${org}.okta.com/api/v1/apps/0oad5lTSBOMUBOBVVQSC/credentials/keys"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
[
  {
    "created": "2015-12-10T18:56:23.000Z",
    "expiresAt": "2017-12-10T18:56:22.000Z",
    "x5c": [
      "MIIDqDCCApCgAwIBAgIGAVGNQFX5MA0GCSqGSIb3DQEBBQUAMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxFTATBgNVBAMMDGJhbGFjb21wdGVzdDEcMBoGCSqGSIb3DQEJARYNaW5mb0Bva3RhLmNvbTAeFw0xNTEyMTAxODU1MjJaFw0xNzEyMTAxODU2MjJaMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxFTATBgNVBAMMDGJhbGFjb21wdGVzdDEcMBoGCSqGSIb3DQEJARYNaW5mb0Bva3RhLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJJjrcnI6cXBiXNq9YDgfYrQe2O5qEHG4MXP8Ue0sMeefFkFEHYHnHUeZCq6WTAGqR+1LFgOl+Eq9We5V+qNlGIfkFkQ3iHGBrIALKqLCd0Et76HicDiegz7j9DtN+lo0hG/gfcw5783L5g5xeQ7zVmCQMkFwoUA0uA3bsfUSrmfORHJL+EMNQT8XIXD8NkG4g6u7ylHVRTLgXbe+W/p04m3EP6l41xl+MhIpBaPxDsyUvcKCNwkZN3aZIin1O9Y4YJuDHxrM64/VtLLp0sC05iawAmfsLunF7rdJAkWUpPn+xkviyNQ3UpvwAYuDr+jKLUdh2reRnm1PezxMIXzBVMCAwEAATANBgkqhkiG9w0BAQUFAAOCAQEARnFIjyitrCGbleFr3KeAwdOyeHiRmgeKupX5ZopgXtcseJoToUIinX5DVw2fVZPahqs0Q7/a0wcVnTRpw6946qZCwKd/PvZ1feVuVEA5Ui3+XvHuSH5xLp7NvYG1snNEvlbN3+NDUMlWj2NEbihowUBt9+UxTpQO3+N08q3aZk3hOZ+tHt+1Te7KEEL/4CM28GZ9MY7fSrS7MAgp1+ZXtn+kRlMrXnQ49qBda37brwDRqmSY9PwNMbev3r+9ZHwxr9W5wXW4Ev4C4xngA7RkVoyDbItSUho0I0M0u/LHuppclnXrw97xyO5Z883eIBvPVjfRcxsJxXJ8jx70ATDskw=="
    ],
    "kid": "SIMcCQNY3uwXoW3y0vf6VxiBb5n9pf8L2fK8d-FIbm4",
    "kty": "RSA",
    "use": "sig",
    "x5t#S256": "5GOpy9CQVtfvBmu2T8BHvpKE4OGtC3BuS046t7p9pps"
  },
  {
    "created": "2015-12-10T18:55:35.000Z",
    "expiresAt": "2045-01-23T02:15:23.000Z",
    "x5c": [
      "MIIDqDCCApCgAwIBAgIGAUsUkouzMA0GCSqGSIb3DQEBBQUAMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxFTATBgNVBAMMDGJhbGFjb21wdGVzdDEcMBoGCSqGSIb3DQEJARYNaW5mb0Bva3RhLmNvbTAeFw0xNTAxMjMwMjE0MjNaFw00NTAxMjMwMjE1MjNaMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxFTATBgNVBAMMDGJhbGFjb21wdGVzdDEcMBoGCSqGSIb3DQEJARYNaW5mb0Bva3RhLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKhmkmKsu3FYeBiJg44aN6Ah3g9gof1cytXJVMnblDUWpLfe/FMUQCssh8Y8NCYRri5jni4efBgk6B3SkC7ymqsOXILIEHSwUYWnAaqDOTxO101mHzryowu1+0PldRNoyTthahpprvAPYlTin9zrDTqFT+WY/zwoaN8H+CfixlW1nM85qF18zYYekkW50MSoHPcfJKe2ywIhPXTYTSBEPcHh8dQEjBrZn7A4qOoDnfOXll8OL7j2O6EVyTtHA0tLJHVLpwI4gSPsXFwEnHltjN57odwYe9yds0BbM/YG9i+am1+3cmZ6Uyd16mLGclrr05o9BHcEZ4ZctV2hr6whbRsCAwEAATANBgkqhkiG9w0BAQUFAAOCAQEAnNlF27gRmhGTQ+GRAvbvYToFRgsIbBAPvRqB2LmEIiQ6UJd602w6uP1sv/zEzBYg4SnMLuVyWgOJ6d71dCvXdIO9mgAq6BaEPjlo0WhGyt+zGrpkMnIX5EwRa64kHydcPRHNA607wVYA96sJdyNJEMzBvjY9fJnfevzzDCN3NWpMS2T6rk6HP5IziI1VuFWY2OUC1kbCqLj1dUgp8koe3ftLL55ZpkAocnVMnrzBveNjgAOAiKTMcyS0bhESph9aVWvuHVZSfTnUjnTPb/4jA2YlB3ED+qaU3aqHwft1KXwZskNXBKXy7lyC+CMoeB3/ncFhSg/UllBooPPS3wYlNA=="
    ],
    "kid": "mXtzOtml09Dg1ZCeKxTRBo3KrQuBWFkJ5oxhVagjTzo",
    "kty": "RSA",
    "use": "sig",
    "x5t#S256": "7CCyXWwKzH4P6PoBP91B1S_iIZVzuGffVnUXu-BTYQQ"
  }
]
~~~

### Get Key Credential for Application
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /apps/*:aid*/credentials/keys/*:kid*</span>

Gets a specific [application key credential](#application-key-credential-model) by `kid`

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter     | Description                                                                     | Param Type | DataType                                      | Required | Default
------------- | ------------------------------------------------------------------------------- | ---------- | --------------------------------------------- | -------- | -------
aid           | unique key of [Application](#application-model)                                 | URL        | String                                        | TRUE     |
kid           | unique key of [Application Key Credential](#application-key-credential-model)   | URL        | String                                        | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

[Application Key Credential](#application-key-credential-model).

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
}' "https://${org}.okta.com/api/v1/apps/0oad5lTSBOMUBOBVVQSC/credentials/keys/mXtzOtml09Dg1ZCeKxTRBo3KrQuBWFkJ5oxhVagjTzo"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~json
{
  "created": "2015-12-10T18:56:23.000Z",
  "expiresAt": "2017-12-10T18:56:22.000Z",
  "x5c": [
    "MIIDqDCCApCgAwIBAgIGAVGNQFX5MA0GCSqGSIb3DQEBBQUAMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxFTATBgNVBAMMDGJhbGFjb21wdGVzdDEcMBoGCSqGSIb3DQEJARYNaW5mb0Bva3RhLmNvbTAeFw0xNTEyMTAxODU1MjJaFw0xNzEyMTAxODU2MjJaMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxFTATBgNVBAMMDGJhbGFjb21wdGVzdDEcMBoGCSqGSIb3DQEJARYNaW5mb0Bva3RhLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJJjrcnI6cXBiXNq9YDgfYrQe2O5qEHG4MXP8Ue0sMeefFkFEHYHnHUeZCq6WTAGqR+1LFgOl+Eq9We5V+qNlGIfkFkQ3iHGBrIALKqLCd0Et76HicDiegz7j9DtN+lo0hG/gfcw5783L5g5xeQ7zVmCQMkFwoUA0uA3bsfUSrmfORHJL+EMNQT8XIXD8NkG4g6u7ylHVRTLgXbe+W/p04m3EP6l41xl+MhIpBaPxDsyUvcKCNwkZN3aZIin1O9Y4YJuDHxrM64/VtLLp0sC05iawAmfsLunF7rdJAkWUpPn+xkviyNQ3UpvwAYuDr+jKLUdh2reRnm1PezxMIXzBVMCAwEAATANBgkqhkiG9w0BAQUFAAOCAQEARnFIjyitrCGbleFr3KeAwdOyeHiRmgeKupX5ZopgXtcseJoToUIinX5DVw2fVZPahqs0Q7/a0wcVnTRpw6946qZCwKd/PvZ1feVuVEA5Ui3+XvHuSH5xLp7NvYG1snNEvlbN3+NDUMlWj2NEbihowUBt9+UxTpQO3+N08q3aZk3hOZ+tHt+1Te7KEEL/4CM28GZ9MY7fSrS7MAgp1+ZXtn+kRlMrXnQ49qBda37brwDRqmSY9PwNMbev3r+9ZHwxr9W5wXW4Ev4C4xngA7RkVoyDbItSUho0I0M0u/LHuppclnXrw97xyO5Z883eIBvPVjfRcxsJxXJ8jx70ATDskw=="
  ],
  "kid": "mXtzOtml09Dg1ZCeKxTRBo3KrQuBWFkJ5oxhVagjTzo",
  "kty": "RSA",
  "use": "sig",
  "x5t#S256": "5GOpy9CQVtfvBmu2T8BHvpKE4OGtC3BuS046t7p9pps"
}
~~~

### Preview SAML metadata for Application
{:.api .api-operation}

<span class="api-uri-template api-uri-get"><span class="api-label">GET</span> /apps/*:aid*/sso/saml/metadata</span>

Preview SAML metadata based on a specific key credential for an application

##### Request Parameters
{:.api .api-request .api-request-params}

Parameter     | Description                                                                     | Param Type | DataType                                      | Required | Default
------------- | ------------------------------------------------------------------------------- | ---------- | --------------------------------------------- | -------- | -------
aid           | unique key of [Application](#application-model)                                 | URL        | String                                        | TRUE     |
kid           | unique key of [Application Key Credential](#application-key-credential-model)   | Query      | String                                        | TRUE     |

##### Response Parameters
{:.api .api-response .api-response-params}

SAML metadata in XML

##### Request Example
{:.api .api-request .api-request-example}

~~~sh
curl -v -X GET \
-H "Accept: application/xml" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
}' "https://${org}.okta.com/api/v1/apps/0oa39sivhvvtqqFbu0h7/sso/saml/metadata?kid=mXtzOtml09Dg1ZCeKxTRBo3KrQuBWFkJ5oxhVagjTzo"
~~~

##### Response Example
{:.api .api-response .api-response-example}

~~~
<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="exk39sivhuytV2D8H0h7">
    <md:IDPSSODescriptor WantAuthnRequestsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
        <md:KeyDescriptor use="signing">
            <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                <ds:X509Data>
                    <ds:X509Certificate>MIIDqDCCApCgAwIBAgIGAVGNO4qeMA0GCSqGSIb3DQEBBQUAMIGUMQswCQYDVQQGEwJVUzETMBEG
A1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEU
MBIGA1UECwwLU1NPUHJvdmlkZXIxFTATBgNVBAMMDGJhbGFjb21wdGVzdDEcMBoGCSqGSIb3DQEJ
ARYNaW5mb0Bva3RhLmNvbTAeFw0xNTEyMTAxODUwMDhaFw0xNzEyMTAxODUxMDdaMIGUMQswCQYD
VQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsG
A1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxFTATBgNVBAMMDGJhbGFjb21wdGVzdDEc
MBoGCSqGSIb3DQEJARYNaW5mb0Bva3RhLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBALAakG48bgcTWHdwmVLHig0mkiRejxIVm3wbzrNSJcBruTq2zCYZ1rGfVxTYON8kJqvkXPmv
kzWKhpEkvhubL+mx29XpXY0AsNIfgcm5xIV56yhXSvlMdqzGo3ciRwoACaF+ClNLxmXK9UTZD89B
bVVGCG5AEvja0eCQ0GYsO5i9aSI5aTroab8Aew31PuWl/RGQWmjVy8+7P4wwkKKJNKCpxMYDlhfa
WRp0zwUSbUCO0qEyeAYdZx6CLES4FGrDi/7D6G+ewWC+kbz1tL1XpF2Dcg3+IOlHrV6VWzz3rG39
v9zFIncjvoQJFDGWhpqGqcmXvgH0Ze3SVcVF01T+bK0CAwEAATANBgkqhkiG9w0BAQUFAAOCAQEA
AHmnSZ4imjNrIf9wxfQIcqHXEBoJ+oJtd59cw1Ur/YQY9pKXxoglqCQ54ZmlIf4GghlcZhslLO+m
NdkQVwSmWMh6KLxVM18/xAkq8zyKbMbvQnTjFB7x45bgokwbjhivWqrB5LYHHCVN7k/8mKlS4eCK
Ci6RGEmErjojr4QN2xV0qAqP6CcGANgpepsQJCzlWucMFKAh0x9Kl8fmiQodfyLXyrebYsVnLrMf
jxE1b6dg4jKvv975tf5wreQSYZ7m//g3/+NnuDKkN/03HqhV7hTNi1fyctXk8I5Nwgyr+pT5LT2k
YoEdncuy+GQGzE9yLOhC4HNfHQXpqp2tMPdRlw==</ds:X509Certificate>
                </ds:X509Data>
            </ds:KeyInfo>
        </md:KeyDescriptor>
        <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</md:NameIDFormat>
        <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</md:NameIDFormat>
        <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://example.okta.com/app/sample-app/exk39sivhuytV2D8H0h7/sso/saml"/>
        <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://example.okta.com/app/sample-app/exk39sivhuytV2D8H0h7/sso/saml"/>
    </md:IDPSSODescriptor>
</md:EntityDescriptor>
~~~

## Models

* [Application Model](#application-model)
* [Application User Model](#application-user-model)
* [Appliction Group Model](#application-group-model)

### Application Model

#### Example

~~~json
{
  "id": "0oaud6YvvS7AghVmH0g3",
  "name": "testorg_testsamlapp_1",
  "label": "Test SAML App",
  "status": "ACTIVE",
  "lastUpdated": "2016-06-29T16:13:47.000Z",
  "created": "2016-06-29T16:13:47.000Z",
  "accessibility": {
    "selfService": false,
    "errorRedirectUrl": null,
    "loginRedirectUrl": null
  },
  "visibility": {
    "autoSubmitToolbar": false,
    "hide": {
      "iOS": false,
      "web": false
    },
    "appLinks": {
      "testorgone_testsamlapp_1_link": true
    }
  },
  "features": [],
  "signOnMode": "SAML_2_0",
  "credentials": {
    "userNameTemplate": {
      "template": "${source.login}",
      "type": "BUILT_IN"
    },
    "signing": {}
  },
  "settings": {
    "app": {},
    "notifications": {
      "vpn": {
        "network": {
          "connection": "ANYWHERE"
        },
        "message": "Help message text.",
        "helpUrl": "http://www.help-site.example.com/"
      }
    },
    "signOn": {
      "defaultRelayState": "",
      "ssoAcsUrl": "https://www.example.com/sso/saml",
      "idpIssuer": "http://www.okta.com/${org.externalKey}",
      "audience": "https://www.example.com/",
      "recipient": "https://www.example.com/sso/saml",
      "destination": "https://www.example.com/sso/saml",
      "subjectNameIdTemplate": "${user.userName}",
      "subjectNameIdFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
      "responseSigned": true,
      "assertionSigned": true,
      "signatureAlgorithm": "RSA_SHA256",
      "digestAlgorithm": "SHA256",
      "honorForceAuthn": true,
      "authnContextClassRef": "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport",
      "spIssuer": null,
      "requestCompressed": false,
      "attributeStatements": []
    }
  },
  "_links": {
    "logo": [
      {
        "name": "medium",
        "href": "http://testorgone.okta.com/assets/img/logos/default.6770228fb0dab49a1695ef440a5279bb.png",
        "type": "image/png"
      }
    ],
    "appLinks": [
      {
        "name": "testorgone_testsamlapp_1_link",
        "href": "http://testorgone.okta.com/home/testorgone_testsamlapp_1/0oaud6YvvS7AghVmH0g3/alnun3sSjdvR9IYuy0g3",
        "type": "text/html"
      }
    ],
    "help": {
      "href": "http://testorgone-admin.okta.com:/app/testorgone_testsamlapp_1/0oaud6YvvS7AghVmH0g3/setup/help/SAML_2_0/instructions",
      "type": "text/html"
    },
    "users": {
      "href": "http://testorgone.okta.com/api/v1/apps/0oaud6YvvS7AghVmH0g3/users"
    },
    "deactivate": {
      "href": "http://testorgone.okta.com:/api/v1/apps/0oaud6YvvS7AghVmH0g3/lifecycle/deactivate"
    },
    "groups": {
      "href": "http://testorgone.okta.com/api/v1/apps/0oaud6YvvS7AghVmH0g3/groups"
    },
    "metadata": {
      "href": "http://testorgone.okta.com/api/v1/apps/0oaud6YvvS7AghVmH0g3/sso/saml/metadata",
      "type": "application/xml"
    }
  }
}
~~~

#### Application Properties

All applications have the following properties:

|----------------+--------------------------------------------+-------------------------------------------------------------------+----------+--------+----------+-----------+-----------+------------|
| Property       | Description                                | DataType                                                          | Nullable | Unique | Readonly | MinLength | MaxLength | Validation |
| -------------- | ------------------------------------------ | ----------------------------------------------------------------- | -------- | ------ | -------- | --------- | --------- | ---------- |
| id             | unique key for app                         | String                                                            | FALSE    | TRUE   | TRUE     |           |           |            |
| name           | unique key for app definition              | String ([App Names & Settings](#app-names--settings))             | FALSE    | TRUE   | TRUE     | 1         | 255       |            |
| label          | unique user-defined display name for app   | String                                                            | FALSE    | TRUE   | FALSE    | 1         | 50        |            |
| created        | timestamp when app was created             | Date                                                              | FALSE    | FALSE  | TRUE     |           |           |            |
| lastUpdated    | timestamp when app was last updated        | Date                                                              | FALSE    | FALSE  | TRUE     |           |           |            |
| status         | status of app                              | `ACTIVE` or `INACTIVE`                                            | FALSE    | FALSE  | TRUE     |           |           |            |
| features       | enabled app features                       | [Features](#features)                                             | TRUE     | FALSE  | FALSE    |           |           |            |
| signOnMode     | authentication mode of app                 | [SignOn Mode](#signon-modes)                                      | FALSE    | FALSE  | FALSE    |           |           |            |
| accessibility  | access settings for app                    | [Accessibility Object](#accessibility-object)                     | TRUE     | FALSE  | FALSE    |           |           |            |
| visibility     | visibility settings for app                | [Visibility Object](#visibility-object)                           | TRUE     | FALSE  | FALSE    |           |           |            |
| credentials    | credentials for the specified `signOnMode` | [Application Credentials Object](#application-credentials-object) | TRUE     | FALSE  | FALSE    |           |           |            |
| settings       | settings for app                           | Object ([App Names & Settings](#app-names--settings))             | TRUE     | FALSE  | FALSE    |           |           |            |
| _links         | discoverable resources related to the app  | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06)    | TRUE     | FALSE  | TRUE     |           |           |            |
| _embedded      | embedded resources related to the app      | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06)    | TRUE     | FALSE  | TRUE     |           |           |            |
|----------------+--------------------------------------------+-------------------------------------------------------------------+----------+--------+----------+-----------+-----------+------------|

> `id`, `created`, `lastUpdated`, `status`, `_links`, and `_embedded` are only available after an app is created

##### App Names & Settings

The Okta Application Network (OAN) defines the catalog of applications that can be added to your Okta organization.  Each application has a unique name (key) and schema that defines the required and optional settings for the application.  When adding an application, the unique app name must be specified in the request as well as any required settings.

The catalog is currently not exposed via an API.  While additional apps may be added via the API, only the following template applications are documented:

|---------------------+-------------------------------------------------------------------------------|
| Name                | Example                                                                       |
| ------------------- | ------------------------------------------------------------------------------|
| bookmark            | [Add Bookmark Application](#add-bookmark-application)                         |
| template_basic_auth | [Add Basic Authentication Application](#add-basic-authentication-application) |
| template_swa        | [Add Plugin SWA Application](#add-plugin-swa-application)                     |
| template_swa3field  | [Add Plugin SWA (3 Field) Application](#add-plugin-swa-3-field-application)   |
| tempalte_sps        | [Add SWA Application (No Plugin)](#add-swa-application-no-plugin)             |
| template_wsfed      | [Add WS-Federation Application](#add-ws-federation-application)               |
| Custom SAML 2.0     | [Add Custom SAML 2.0 Application](#add-custom-saml-application)               |
| Custom SWA          | [Add Custom SWA Application](#add-custom-swa-application)                     |
|---------------------+-------------------------------------------------------------------------------|

The current workaround is to manually configure the desired application via the Okta Admin UI in a preview (sandbox) organization and view the application via [Get Application](#get-application)

> App provisioning settings currently cannot be managed via the API and must be configured via the Okta Admin UI.

##### Features

Applications may support optional provisioning features on a per-app basis.

> Provisioning features currently may not be configured via the API and must be configured via the Okta Admin UI.

The list of provisioning features an app may support are:

|------------------------+------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| App Feature            | Admin UI Name          | Description                                                                                                                                                                                                                                    |
| ---------------------- | ---------------------- | -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| IMPORT_NEW_USERS       | User Import            | Creates or links a user in Okta to a user from the application.                                                                                                                                                                                |
| IMPORT_PROFILE_UPDATES | User Import            | Updates a linked user's app profile during manual or scheduled imports.                                                                                                                                                                        |
| PROFILE_MASTERING      | Profile Master         | Designates the app as the identity lifecycle and profile attribute authority for linked users.  The user's profile in Okta is *read-only*                                                                                                      |
| IMPORT_USER_SCHEMA     |                        | Discovers the profile schema for a user from the app automatically                                                                                                                                                                             |
| PUSH_NEW_USERS         | Create Users           | Creates or links a user account in the application when assigning the app to a user in Okta.                                                                                                                                                   |
| PUSH_PROFILE_UPDATES   | Update User Properties | Updates a user's profile in the app when the user's profile changes in Okta (Profile Master).                                                                                                                                                  |
| PUSH_USER_DEACTIVATION | Deactivate Users       | Deactivates a user's account in the app when unassigned from the app in Okta or deactivated.                                                                                                                                                   |
| REACTIVATE_USERS       | Deactivate Users       | Reactivates an existing inactive user when provisioning a user to the app.                                                                                                                                                                     |
| PUSH_PASSWORD_UPDATES  | Sync Okta Password     | Updates the user's app password when their password changes in Okta.                                                                                                                                                                           |
| GROUP_PUSH             | Group Push             | Creates or links a group in the app when a mapping is defined for a group in Okta.  Okta is the the master for group memberships and all group members in Okta who are also assigned to the app will be synced as group members to the app.    |
|------------------------+------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

##### SignOn Modes

Applications support a limited set of sign-on modes that specify how a user is authenticated to the app.

The list of possible modes an app may support are:

|-----------------------+-------------------------------------------------------------------------|
| Mode                  | Description                                                             |
| --------------------- | ------------------------------------------------------------------------|
| BOOKMARK              | Just a bookmark (no-authentication)                                     |
| BASIC_AUTH            | HTTP Basic Authentication with Okta Browser Plugin                      |
| BROWSER_PLUGIN        | Secure Web Authentication (SWA) with Okta Browser Plugin                |
| SECURE_PASSWORD_STORE | Secure Web Authentication (SWA) with POST (plugin not required)         |
| SAML_2_0              | Federated Authentication with SAML 2.0 WebSSO                           |
| WS_FEDERATION         | Federated Authentication with WS-Federation Passive Requestor Profile   |
| AUTO_LOGIN            | Secure Web Authentication (SWA)
| Custom                | App-Specific SignOn Mode                                                |
|-----------------------+-------------------------------------------------------------------------|

This setting modifies the same settings as the `Sign On` tab when editing an application in your Okta Administration app.

### Accessibility Object

Specifies access settings for the application.

|------------------+--------------------------------------------+----------+----------+---------+-----------+-----------+------------|
| Property         | Description                                | DataType | Nullable | Default | MinLength | MaxLength | Validation |
| ---------------- | ------------------------------------------ | -------- | -------- | ------- | --------- | --------- | ---------- |
| selfService      | Enable self-service application assignment | Boolean  | TRUE     | FALSE   |           |           |            |
| errorRedirectUrl | Custom error page for this application     | String   | TRUE     | NULL    |           |           |            |
| loginRedirectUrl | Custom login page for this application     | String   | TRUE     | NULL    |           |           |            |
|------------------+--------------------------------------------+----------+----------+---------+-----------+------------------------|

> The `errorRedirectUrl` and `loginRedirectUrl` default to the organization default pages when empty

~~~json
{
  "accessibility": {
    "selfService": false,
    "errorRedirectUrl": null
  }
}
~~~


### Visibility Object

Specifies visibility settings for the application.

|-------------------+----------------------------------------------------|-------------------------------------+----------+---------|-----------|-----------+------------|
| Property          | Description                                        | DataType                            | Nullable | Default | MinLength | MaxLength | Validation |
| ----------------- | -------------------------------------------------- | ----------------------------------- | -------- | ------- | --------- | --------- | ---------- |
| autoSubmitToolbar | Automatically log in when user lands on login page | Boolean                             | FALSE    | FALSE   |           |           |            |
| hide              | Hides this app for specific end-user apps          | [Hide Object](#hide-object)         | FALSE    | FALSE   |           |           |            |
| appLinks          | Displays specific appLinks for the app             | [AppLinks Object](#applinks-object) | FALSE    |         |           |           |            |
|-------------------+----------------------------------------------------|-------------------------------------+----------+---------|-----------|-----------+------------|

~~~json
{
  "visibility": {
    "autoSubmitToolbar": false,
    "hide": {
      "iOS": false,
      "web": false
    },
    "appLinks": {
      "login": true
    }
  }
}
~~~

#### Hide Object

|-----------+----------------------------------------------------|----------|----------|---------|-----------|-----------+------------|
| Property  | Description                                        | DataType | Nullable | Default | MinLength | MaxLength | Validation |
| --------- | -------------------------------------------------- | -------- | -------- | ------- | --------- | --------- | ---------- |
| iOS       | Okta Mobile for iOS or Android (pre-dates Android) | Boolean  | FALSE    | FALSE   |           |           |            |
| web       | Okta Web Browser Home Page                         | Boolean  | FALSE    | FALSE   |           |           |            |
|-----------+----------------------------------------------------|----------|----------|---------|-----------|-----------+------------|

#### AppLinks Object

Each application defines 1 or more appLinks that can be published. AppLinks can be disabled by setting the link value to `false` .

### Application Credentials Object

Specifies credentials and scheme for the application's `signOnMode`.

|------------------+----------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------+----------+-----------------+-----------+-----------+------------|
| Property         | Description                                                                                                    | DataType                                                  | Nullable | Default         | MinLength | MaxLength | Validation |
| ---------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | -------- | --------------- | --------- | --------- | ---------- |
| scheme           | Determines how credentials are managed for the `signOnMode`                                                    | [Authentication Scheme](#authentication-schemes)          | TRUE     |                 |           |           |            |
| userNameTemplate | Template used to generate a user’s username when the application is assigned via a group or directly to a user | [UserName Template Object](#username-template-object)     | TRUE     | *Okta UserName* |           |           |            |
| signing          | Signing credential for the `signOnMode`                                                                        | [Signing Credential Object](#signing-credential-object)   | False    |                 |           |           |            |
| userName         | Shared username for app                                                                                        | String                                                    | TRUE     |                 | 1         | 100       |            |
| password         | Shared password for app                                                                                        | [Password Object](#password-object)                       | TRUE     |                 |           |           |            |
|------------------+----------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------+----------+-----------------+-----------+-----------+------------|

~~~json
{
  "credentials": {
    "scheme": "SHARED_USERNAME_AND_PASSWORD",
    "userNameTemplate": {
      "template": "${source.login}",
      "type": "BUILT_IN"
    },
    "signing": {
      "kid": "SIMcCQNY3uwXoW3y0vf6VxiBb5n9pf8L2fK8d-FIbm4"
    },
    "userName": "test",
    "password": {}
  }
}
~~~

#### Authentication Schemes

Applications that are configured with the `BASIC_AUTH`, `BROWSER_PLUGIN`, or `SECURE_PASSWORD_STORE`  have credentials vaulted by Okta and can be configured with the following schemes:

|------------------------------+---------------------------------------------------------------------------+-----------------+-----------------+------------------+--------------------------|
| Scheme                       | Description                                                               | Shared UserName | Shared Password | App UserName     | App Password             |
| ---------------------------- | ------------------------------------------------------------------------- | --------------- | --------------- | ---------------- | -------------------------|
| SHARED_USERNAME_AND_PASSWORD | Users share a single username and password set by administrator           | Admin:`R/W`     | Admin:`W`       |                  |                          |
| EXTERNAL_PASSWORD_SYNC       | Administrator sets username, password is the same as user's Okta password |                 |                 | Admin:`R/W`      | *Current User Password*  |
| EDIT_USERNAME_AND_PASSWORD   | User sets username and password                                           |                 |                 | Admin/User:`R/W` | Admin/User:`W`           |
| EDIT_PASSWORD_ONLY           | Administrator sets username, user sets password                           |                 |                 | Admin:`R/W`      | Admin/User:`W`           |
| ADMIN_SETS_CREDENTIALS       | Administrator sets username and password                                  |                 |                 | Admin: `R/W`     | Admin: `W`
|------------------------------+---------------------------------------------------------------------------+-----------------+-----------------+------------------+--------------------------|

> `BOOKMARK`, `SAML_2_0`, and `WS_FEDERATION` signOnModes do not support an authentication scheme as they use a federated SSO protocol.  The `scheme` property should be omitted for apps with these signOnModes

#### UserName Template Object

Specifies the template used to generate a user's username when the application is assigned via a group or directly to a user

|------------+-----------------------------------------+----------------------------------+----------+-------------------+-----------+-----------+------------|
| Property   | Description                             | DataType                         | Nullable | Default           | MinLength | MaxLength | Validation |
| ---------- | --------------------------------------- | -------------------------------- | -------- | ----------------- | --------- | ----------| ---------- |
| template   | mapping expression for username         | String                           | TRUE     | `${source.login}` |           | 1024      |            |
| type       | type of mapping expression              | `NONE`,  `BUILT_IN`, or `CUSTOM` | FALSE    | BUILT_IN          |           |           |            |
| userSuffix | suffix for built-in mapping expressions | String                           | TRUE     | NULL              |           |           |            |
|------------+-----------------------------------------+----------------------------------+----------+-------------------+-----------+-----------+------------|

> You must use the `CUSTOM` type when defining your own expression that is not built-in

~~~json
{
  "userNameTemplate": {
    "template": "${source.login}",
    "type": "BUILT_IN"
  }
}
~~~

#### Signing Credential Object
Determines the [key](#application-key-credential-model) used for signing assertions for the `signOnMode`

|------------+---------------------------------------------------------------------------------------------+----------------------------------+----------+-------------------+-----------+-----------+------------|
| Property   | Description                                                                                 | DataType                         | Nullable | Default           | MinLength | MaxLength | Validation |
| ---------- | ------------------------------------------------------------------------------------------- | -------------------------------- | -------- | ----------------- | --------- | ----------| ---------- |
| kid        | Reference for [key credential for the app](#application-key-store-operations)    | String                           | FALSE    |                   |           |           |            |
|------------+---------------------------------------------------------------------------------------------+----------------------------------+----------+-------------------+-----------+-----------+------------|

> You must to enable the key rollover feature to view `kid`. Key rollover is an Early Access feature; contact Customer Support to enable it.

~~~json
{
  "signing": {
    "kid": "SIMcCQNY3uwXoW3y0vf6VxiBb5n9pf8L2fK8d-FIbm4"
  }
}
~~~

##### Built-In Expressions

The following expressions are built-in and may be used with the `BUILT_IN` template type:

|---------------------------------+-----------------------------------------------|
| Name                            | Template Expression                           |
| ------------------------------- | ----------------------------------------------|
| Okta username                   | ${source.login}                               |
| Okta username prefix            | ${fn:substringBefore(source.login, ""@"")}    |
| Email                           | ${source.email}                               |
| Email prefix                    | ${fn:substringBefore(source.email, ""@"")}    |
| Email (lowercase)               | ${fn:toLowerCase(source.email)}               |
| AD SAM Account Name             | ${source.samAccountName}                      |
| AD SAM Account Name (lowercase) | ${fn:toLowerCase(source.samAccountName)}      |
| AD User Principal Name          | ${source.userName}                            |
| AD User Principal Name prefix   | ${fn:substringBefore(source.userName, ""@"")} |
| AD Employee ID                  | ${source.employeeID}                          |
| LDAP UID + custom suffix        | ${source.userName}${instance.userSuffix}      |
|---------------------------------+-----------------------------------------------|

### Password Object

Specifies a password for a user.  A password value is a **write-only** property.  When a user has a valid password and a response object contains a password credential, then the Password Object will be a bare object without the `value`  property defined (e.g. `password: {}` ) to indicate that a password value exists.

|-----------+-------------+----------+----------+---------+-----------+-----------+------------|
| Property  | Description | DataType | Nullable | Default | MinLength | MaxLength | Validation |
| --------- | ----------- | -------- | -------- | ------- | --------- | --------- | ---------- |
| value     |             | String   | TRUE     |         |           |           |            |
|-----------+-------------+----------+----------+---------+-----------+-----------+------------|

### Application Links Object

Specifies link relations (See [Web Linking](http://tools.ietf.org/html/rfc5988)) available for the current status of an application using the [JSON Hypertext Application Language](http://tools.ietf.org/html/draft-kelly-json-hal-06) specification.  This object is used for dynamic discovery of related resources and lifecycle operations.  The Links Object is **read-only**.

|--------------------+---------------------------------------------------------------------------------------------|
| Link Relation Type | Description                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------|
| self               | The actual application                                                                      |
| activate           | [Lifecycle action](#activate-application) to transition application to `ACTIVE` status      |
| deactivate         | [Lifecycle action](#deactivate-application) to transition application to `INACTIVE` status  |
| metadata           | Protocol-specific metadata document for the configured `SignOnMode`                         |
| users              | [User](#application-user-operations) assignments for application                            |
| groups             | [Group](#application-group-operations) assignments for application                          |
| logo               | Application logo image                                                                      |
|--------------------+---------------------------------------------------------------------------------------------|

### Notifications Object

Specifies notifications settings for the application. The VPN notification feature allows admins to communicate a requirement for signing into VPN-required apps.

|-------------------+----------------------------------------------------+------------------------------------------------------+----------+---------+-----------+-----------+------------|
| Property          | Description                                        | DataType                                             | Nullable | Default | MinLength | MaxLength | Validation |
| ----------------- | -------------------------------------------------- | ---------------------------------------------------- | -------- | ------- | --------- | --------- | ---------- |
| vpn               | VPN notification settings                          | [VPN Notification Object](#vpn-notification-object)  | FALSE    |         |           |           |            |
|-------------------+----------------------------------------------------+------------------------------------------------------+----------+---------+-----------+-----------+------------|

~~~json
{
  "notifications": {
    "vpn": {
      "network": {
        "connection": "ANYWHERE"
      },
      "message": "Help message text.",
      "helpUrl": "http:/www.help-site.example.com"
     }
   }
 }
~~~

#### VPN Notification Object

Specifies properties for a VPN notification

|-----------+--------------------------------------------------------------------------------------------+-----------------------------------+----------+---------+-----------+-----------+------------|
| Property  | Description                                                                                | DataType                          | Nullable | Default | MinLength | MaxLength | Validation |
| --------- | ------------------------------------------------------------------------------------------ | --------------------------------  | -------- | ------- | --------- | ----------| ---------- |
| network   | The network connections for the VPN.                                                       | [Network Object](#network-object) | FALSE    |         |           |           |            |
| message   | An optional message to your end users.                                                     | String                            | TRUE     |         |           |           |            |
| helpurl   | An optional URL to help page URL to assist your end users in signing into your company VPN | String                            | TRUE     |         |           |           |            |
|-----------+--------------------------------------------------------------------------------------------+-----------------------------------+----------+---------+-----------+-----------+------------|

#### Network Object

|------------+-------------------------------------------------------+--------------------------------------------------------+----------+------------+-----------+-----------+------------|
| Property   | Description                                           | DataType                                               | Nullable | Default    | MinLength | MaxLength | Validation |
| ---------- | ----------------------------------------------------- | ------------------------------------------------------ | -------- | -----------| --------- | ----------| ---------- |
| connection | The VPN settings on the app. Choices are shown below. | `DISABLED`, `ANYWHERE`, `ON_NETWORK`, or `OFF_NETWORK` | FALSE    | `DISABLED` |           |           |            |
|------------+-------------------------------------------------------+--------------------------------------------------------+----------+------------+-----------+-----------+------------|

There are four choices for the `connection` property.

 - `DISABLED` – The default state. Retain this setting for apps that do not require a VPN connection.
 - `ANYWHERE` – Displays VPN connection information regardless of the browser's client IP. The notification appears before the end user can access the app.
 - `ON_NETWORK` – Displays VPN connection information only when a browser's client IP matches the configured Pubic Gateway IPs. The notification appears before the end user can access the app.
 - `OFF_NETWORK` – Displays VPN connection information only when the browser's client IP does not match the configured Pubic Gateway IPs. The notification appears before the end user can access the app.

#### Attribute Statements Object

Specifies (optional) attribute statements for a SAML application.

|------------+----------------------------------------------------------------------------------------------+-------------+----------|
| Property   | Description                                                                                  | DataType    | Nullable |
| ---------- | -------------------------------------------------------------------------------------------- | ----------- | -------- |
| name       | The reference name of the attribute statement                                                | String      | FALSE    |
| ---------- | -------------------------------------------------------------------------------------------- | ----------- | -------- |
| namespace  | The name format of the attribute                                                             | String      | FALSE    |
| ---------- | -------------------------------------------------------------------------------------------- | ----------- | -------- |
| values     | The value of the attribute; Supports [Okta EL](../getting_started/okta_expression_lang.html) | String      | FALSE    |
|------------+--------------------------------------------------------------------------------------------- | ----------- | -------- |

##### Supported Namespaces

Label           | Value
----------------| -------------------------------------------------------
Unspecified     | urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified
URI Reference   | urn:oasis:names:tc:SAML:2.0:attrname-format:uri
Basic           | urn:oasis:names:tc:SAML:2.0:attrname-format:basic

~~~json
{
  ...
  "settings": {
    "signOn" : {
      ...
      "attributeStatements": [
        {
          "type": "EXPRESSION",
          "name": "Attribute One",
          "namespace": "urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified",
          "values": [
            "Value One"
          ]
        },
        {
          "type": "EXPRESSION",
          "name": "Attribute Two",
          "namespace": "urn:oasis:names:tc:SAML:2.0:attrname-format:basic",
          "values": [
            "Value Two"
          ]
        }
      ]
    }
  }
}
~~~

### Application User Model

The application user model defines a user's app-specific profile and credentials for an application.

#### Example

~~~json
{
  "id": "00u11z6WHMYCGPCHCRFK",
  "externalId": "70c14cc17d3745e8a9f98d599a68329c",
  "created": "2014-06-24T15:27:59.000Z",
  "lastUpdated": "2014-06-24T15:28:14.000Z",
  "scope": "USER",
  "status": "ACTIVE",
  "statusChanged": "2014-06-24T15:28:14.000Z",
  "passwordChanged": "2014-06-24T15:27:59.000Z",
  "syncState": "SYNCHRONIZED",
  "lastSync": "2014-06-24T15:27:59.000Z",
  "credentials": {
    "userName": "saml.jackson@example.com",
    "password": {}
  },
  "profile": {
    "secondEmail": null,
    "lastName": "Jackson",
    "mobilePhone": null,
    "email": "saml.jackson@example.com",
    "salesforceGroups": [
      "Employee"
    ],
    "role": "CEO",
    "firstName": "Saml",
    "profile": "Standard User"
  },
  "_links": {
    "app": {
      "href": "https://example.okta.com/api/v1/apps/0oabhnUQFYHMBNVSVXMV"
    },
    "user": {
      "href": "https://example.okta.com/api/v1/users/00u11z6WHMYCGPCHCRFK"
    }
  }
}
~~~

#### Application User Properties

All application user assignments have the following properties:

|------------------+--------------------------------------------------------------+-----------------------------------------------------------------------------|----------|--------|----------|-----------|-----------+------------|
| Property         | Description                                                  | DataType                                                                    | Nullable | Unique | Readonly | MinLength | MaxLength | Validation |
| ---------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------- | -------- | ------ | -------- | --------- | --------- | ---------- |
| id               | unique key of [User](/docs/api/resources/users.html)                             | String                                                                      | FALSE    | TRUE   | TRUE     |           |           |            |
| externalId       | id of user in target app *(must be imported or provisioned)* | String                                                                      | TRUE     | TRUE   | TRUE     |           | 512       |            |
| created          | timestamp when app user was created                          | Date                                                                        | FALSE    | FALSE  | TRUE     |           |           |            |
| lastUpdated      | timestamp when app user was last updated                     | Date                                                                        | FALSE    | FALSE  | TRUE     |           |           |            |
| scope            | toggles the assignment between user or group scope           | `USER` or `GROUP`                                                           | FALSE    | FALSE  | FALSE    |           |           |            |
| status           | status of app user                                           | `STAGED`, `PROVISIONED`, `ACTIVE`, `INACTIVE`, or `DEPROVISIONED`           | FALSE    | FALSE  | TRUE     |           |           |            |
| statusChanged    | timestamp when status was last changed                       | Date                                                                        | TRUE     | FALSE  | TRUE     |           |           |            |
| passwordChanged  | timestamp when app password last changed                     | Date                                                                        | TRUE     | FALSE  | TRUE     |           |           |            |
| syncState        | synchronization state for app user                           | `DISABLED`, `OUT_OF_SYNC`, `SYNCING`, `SYNCHRONIZED`, `ERROR`               | FALSE    | FALSE  | TRUE     |           |           |            |
| lastSync         | timestamp when last sync operation was executed              | Date                                                                        | TRUE     | FALSE  | TRUE     |           |           |            |
| credentials      | credentials for assigned app                                 | [Application User Credentials Object](#application-user-credentials-object) | TRUE     | FALSE  | FALSE    |           |           |            |
| profile          | app-specific profile for the user                            | [Application User Profile Object](#application-user-profile-object)         | FALSE    | FALSE  | TRUE     |           |           |            |
| _embedded        | embedded resources related to the app user                   | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06)              | TRUE     | FALSE  | TRUE     |           |           |            |
| _links           | discoverable resources related to the app user               | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06)              | TRUE     | FALSE  | TRUE     |           |           |            |
|------------------+--------------------------------------------------------------+-----------------------------------------------------------------------------|----------|--------|----------|-----------|-----------+------------|

> `lastSync` is only updated for applications with the `IMPORT_PROFILE_UPDATES` or `PUSH PROFILE_UPDATES` feature

##### External ID

Users in Okta are linked to a user in a target application via an `externalId`.  Okta anchors an user with his or her `externalId` during an import or provisioning synchronization event.  Okta uses the native app-specific identifier or primary key for the user as the `externalId`.  The `externalId` is selected during import when the user is confirmed (reconciled) or during provisioning when the user has been successfully created in the target application.

> SSO Application Assignments (e.g. SAML or SWA) do not have an `externalId` as they are not synchronized with the application.

##### Application User Status

###### Single Sign-On

Users assigned to an application for SSO without provisioning features enabled will have a an `ACTIVE` status with `syncState` as `DISABLED`.

###### User Import

Users imported and confirmed by an application with the `IMPORT_PROFILE_UPDATES` feature will have an `ACTIVE` status.  The application user's `syncState` depends on whether the `PROFILE_MASTERING` feature is enabled for the application. When `PROFILE_MASTERING` is enabled the `syncState` transitions to `SYNCHRONIZED` otherwise the `syncState` is `DISABLED`.

###### User Provisioning

User provisioning in Okta is an asynchronous background job that is triggered during assignment of user (or indirectly via a group assignment).

1. User is assigned to an application that has `PUSH_NEW_USERS` feature enabled
    * Application user will have a `STAGED` status with no `externalId` while the background provisioning job is queued.
2. When the background provisioning job completes successfully, the application user transitions to the `PROVISIONED` status.
    * Application user is assigned an `externalId` when successfully provisioned in target application.  The `externalId` should be immutable for the life of the assignment
3. If the background provisioning job completes with an error, the application user remains with the `STAGED` status but will have `syncState` as `ERROR`.  A provisioning task is created in the Okta Admin UI that must be resolved to retry the job.

When the `PUSH_PROFILE_UPDATES` feature is enabled, updates to an upstream profile are pushed downstream to the application according to profile mastering priority.  The app user's `syncState` will have the following values:

|--------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| syncState    | Description                                                                                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| OUT_OF_SYNC  | Application user has changes that have not been pushed to the target application                                                                                                       |
| SYNCING      | Background provisioning job is running to update the user's profile in the target application                                                                                          |
| SYNCHRONIZED | All changes to the app user profile have successfully been synchronized with the target application                                                                                    |
| ERROR        | Background provisioning job failed to update the user's profile in the target application. A provisioning task is created in the Okta Admin UI that must be resolved to retry the job. |
|--------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

> User provisioning currently must be configured via the Okta Admin UI and is only available to with specific editions.

#### Application User Credentials Object

Specifies a user's credentials for the application.  The [Authentication Scheme](#authentication-schemes) of the application determines whether a userName or password can be assigned to a user.

|-----------+------------------+-------------------------------------+----------+---------+-----------+-----------+------------|
| Property  | Description      | DataType                            | Nullable | Default | MinLength | MaxLength | Validation |
| --------- | ---------------- | ----------------------------------- | -------- | ------- | --------- | --------- | ---------- |
| userName  | username for app | String                              | TRUE     |         | 1         | 100       |            |
| password  | password for app | [Password Object](#password-object) | TRUE     |         |           |           |            |
|-----------+------------------+-------------------------------------+----------+---------+-----------+-----------+------------|

~~~json
{
  "credentials": {
    "userName": "test",
    "password": {}
  }
}
~~~

> The application's [UserName Template](#username-template-object) defines the default username generated when a user is assigned to an application.

If you attempt to assign a username or password to an application with an incompatible [Authentication Scheme](#authentication-schemes) you will receive the following error:

~~~json
{
  "errorCode": "E0000041",
  "errorSummary": "Credentials should not be set on this resource based on the scheme.",
  "errorLink": "E0000041",
  "errorId": "oaeUM77NBynQQu4C_qT5ngjGQ",
  "errorCauses": [
    {
      "errorSummary": "User level credentials should not be provided for this scheme."
    }
  ]
}
~~~

#### Application User Profile Object

Application User profiles are app-specific but may be customized by the Profile Editor in the Okta Admin UI. SSO apps typically don't support a user profile while apps with [user provisioning features](#features) have an app-specific profiles with optional and/or required properties.  Any profile properties visible in the Okta Admin UI for an application assignment can also be assigned via the API. Some properties are reference properties and imported from the target application and only allow specific values to be configured.

##### Profile Editor

![Profile Editor UI](/assets/img/okta-admin-ui-profile-editor.png "Profile Editor UI")

> Managing profiles for applications is restricted to specific editions and requires access to the Universal Directory Early Access feature

##### Example Application Assignment

![App Assignment UI](/assets/img/okta-admin-ui-app-assignment.png "App Assignment UI")

##### Example Profile Object

~~~json
{
  "profile": {
    "secondEmail": null,
    "lastName": "Jackson",
    "mobilePhone": null,
    "email": "saml.jackson@example.com",
    "salesforceGroups": [
      "Employee"
    ],
    "role": "CEO",
    "firstName": "Saml",
    "profile": "Standard User"
  }
}
~~~

### Application Group Model

#### Example

~~~json
{
  "id": "00gbkkGFFWZDLCNTAGQR",
  "lastUpdated": "2013-09-11T15:56:58.000Z",
  "priority": 0,
  "_links": {
    "user": {
      "href": "https://example.okta.com/api/v1/users/00ubgfEUVRPSHGWHAZRI"
    }
  }
}
~~~

#### Application Group Properties

All application groups have the following properties:

|--------------+-------------------------------------------------+----------------------------------------------------------------|----------+--------|----------|-----------|-----------+------------|
| Property     | Description                                     | DataType                                                       | Nullable | Unique | Readonly | MinLength | MaxLength | Validation |
| ------------ | ----------------------------------------------- | -------------------------------------------------------------- | -------- | ------ | -------- | --------- | --------- | ---------- |
| id           | unique key of group                             | String                                                         | FALSE    | TRUE   | TRUE     |           |           |            |
| lastUpdated  | timestamp when app group was last updated       | Date                                                           | FALSE    | FALSE  | TRUE     |           |           |            |
| priority     | priority of group assignment                    | Number                                                         | TRUE     | FALSE  | FALSE    | 0         | 100       |            |
| _links       | discoverable resources related to the app group | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-05) | TRUE     | FALSE  | TRUE     |           |           |            |
| _embedded    | embedded resources related to the app group     | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06) | TRUE     | FALSE  | TRUE     |           |           |            |
|--------------+-------------------------------------------------+----------------------------------------------------------------|----------+--------|----------|-----------|-----------+------------|

### Application Key Credential Model

The application key credential model defines a [JSON Web Key](https://tools.ietf.org/html/rfc7517) for a signature or encryption credential for an application.

> Currently only the X.509 JWK format is supported for applications with the `SAML_2_0` sign-on mode.

#### Example

~~~json
{
  "created": "2015-11-20T21:09:30.000Z",
  "expiresAt": "2017-11-20T21:09:29.000Z",
  "x5c": [
    "MIIDmDCCAoCgAwIBAgIGAVEmuwhKMA0GCSqGSIb3DQEBBQUAMIGMMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxDTALBgNVBAMMBHJhaW4xHDAaBgkqhkiG9w0BCQEWDWluZm9Ab2t0YS5jb20wHhcNMTUxMTIwMjEwODMwWhcNMTcxMTIwMjEwOTI5WjCBjDELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAUBgNVBAcMDVNhbiBGcmFuY2lzY28xDTALBgNVBAoMBE9rdGExFDASBgNVBAsMC1NTT1Byb3ZpZGVyMQ0wCwYDVQQDDARyYWluMRwwGgYJKoZIhvcNAQkBFg1pbmZvQG9rdGEuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1ml7//IDMpngTKGJJ5qhodUaOY2Yx7k6mCYyETA8wjVfJjWFYVDwfTJ5kB7zbuPBNVDFuLIxMqGyJk3i2/nSBKe1eAC2lv+WK2R5xqSgXNNLlnhR3xMp8ed7TCmrHFRoS46uIBpMfvROij4cmOjVtX1ZGTjdqC8Z8bPg+JiZW9BkBo9sdEIjWjZTzMpmuHJ26EcJkuODFp5jr3/SKv3LvFAjbF5slEXrZLyUFrmSL0AXU6fWszN1llUoPBjS9uSTelOsS4PvBUy/oH1e7vbo8jag68ym2+wbbTw9toOjGcdOcwsT7Phwh0ixjt1/oKnjNvMKHapSr2GoiY8cltkQ2wIDAQABMA0GCSqGSIb3DQEBBQUAA4IBAQBkYvW3dtPU5spAvUUNHZmk76C0GC0Dg+XD15menebia931qeO6o21SJLbcRr+0Doy8p59r8ZmqIj/jJOhCrA0jqiKT+wch/494K6OYz8k3jJ3OtrBQ3OtYJ7gpAq0QuWf/G3tFpH23tW/8VfBtalwPMxiffG9rkFzPYAoNgYHXAGLO5yRz3TC0Z8nkcY5xPO/NAN1gsWvlvTBxf3B06giug7g+szRaReAjpM3WUFz9XG4Hs/EtaqiBFeArWRqWxxO7igmSQEEmlAHYCCoTZ/Atvwa96CqCTlM2Dr45aT1h8tkaVFXl8HGdt1/m8mnw53PbgxvYW2AvN5JBwp9S8c6w"
  ],
  "x5t#S256": "CyhOiLD8_9hCFT02nUbkvmlNncBsb31xY_SUbF6fHPA",
  "kid": "SIMcCQNY3uwXoW3y0vf6VxiBb5n9pf8L2fK8d-FIbm4",
  "kty": "RSA",
  "use": "sig"
}
~~~

#### Application Key Credential (Certificate) Properties

|------------------+--------------------------------------------------------------+-----------------------------------------------------------------------------|----------|--------|----------|-----------|-----------+------------|
| Property         | Description                                                  | DataType                                                                    | Nullable | Unique | Readonly | MinLength | MaxLength | Validation |
| ---------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------- | -------- | ------ | -------- | --------- | --------- | ---------- |
| created          | timestamp when certificate was created                       | Date                                                                        | FALSE    | FALSE  | TRUE     |           |           |            |
| expiresAt        | timestamp when certificate expires                           | Date                                                                        | FALSE    | FALSE  | TRUE     |           |           |            |
| x5c              | X.509 certificate chain                                      | Array                                                                       | TRUE     | TRUE   | TRUE     |           |           |            |
| x5t#S256         | X.509 certificate SHA-256 thumbprint                         | String                                                                      | TRUE     | TRUE   | TRUE     |           |           |            |
| kid              | unique identifier for the certificate                        | String                                                                      | FALSE    | TRUE   | TRUE     |           |           |            |
| kty              | cryptographic algorithm family for the certificate's keypair | String                                                                      | FALSE    | FALSE  | TRUE     |           |           |            |
| use              | acceptable usage of the certificate                          | String                                                                      | TRUE     | FALSE  | TRUE     |           |           |            |
|------------------+--------------------------------------------------------------+-----------------------------------------------------------------------------|----------|--------|----------|-----------|-----------+------------|
