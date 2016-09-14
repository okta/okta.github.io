---
layout: docs_page
title: API Test Client
redirect_from: "/docs/getting_started/api_test_client.html"
---

## Overview

[Postman](http://getpostman.com) is an awesome REST API test client that a lot of people at Okta use to test the Okta API.  We have built templates for all of the Okta APIs that makes playing with the Okta APIs simple and easy if you don't have time to practice your *Command Line Fu* with [cURL](http://en.wikipedia.org/wiki/CURL)

![Postman Chrome Web Store](/assets/img/postman-chrome-web-store.png)

## Prerequisites

- Chrome Web Browser
- [API Key created in the Okta Admin UI](/docs/api/getting_started/getting_a_token.html)

## Setup

1. [Download Postman Chrome Extension](https://chrome.google.com/webstore/detail/postman-rest-client-packa/fhbjgbiflinjbdggehcddcbncdddomop)
2. Launch **Postman** with new Chrome App Launcher

    ![Chrome App Launcher](/assets/img/chrome-ui-app-launcher.png "Chrome App Launcher")

3. Import and configure a new environment template for your Okta organization

    You should [import the example Postman environment](../postman/example.okta.com.environment) and duplicate for each Okta environment (dev, test, preview, prod)

    1. Click the **Import** button in the top toolbar
      ![Import Button](/assets/img/postman-ui-import-button.png "Import Button")
    2. Select the **From URL** tab, paste [this URL for the example.okta.com environment](../postman/example.okta.com.environment), and click the **Import** button
      ![Import Environment](/assets/img/postman-ui-import-env.png "Import Environment")
    3. Select the **No environment** pull-down in the top-right of the UI and select **Manage environments**
        ![Manage Environments](/assets/img/postman-ui-manage-env.png "Manage Environments")
    4. Click the **Duplicate environment** icon to create a new environment from imported template
        ![Duplicate Environment](/assets/img/postman-ui-duplicate-env.png "Duplicate Environment")
    5. Click the name to edit the duplicated environment, assign a new name, and specify the following values:

        - `url`: full-qualified base URL for your Okta organization such as *https://acme.okta.com*
        - `apikey`: the API key you generated as part of prerequisites
        - `email-suffix`: used by request templates for email addresses and logins of new users
        - `subdomain`: *orgname* in https://*orgname*.okta.com

        > We recommend you name the new environment the name of your Okta organization such as example.okta.com in case you have both a preview and production organization

        ![Edit Environment](/assets/img/postman-ui-edit-env.png "Edit Environment")
    6. Modify Postman settings to "Retain headers on clicking on links" (Optional)
      ![Postman Settings](/assets/img/postman-ui-settings.png "Postman Settings")

4. Select and verify your configured environment

    1. Ensure you have selected your environment in the pull-down

        ![Choose Environment](/assets/img/postman-ui-choose-env.png "Choose Environment")

        > Your selected environment should have your name that you configured above and not say `No environment` or `example.okta.com`

    2. You can preview your configured environment variables by clicking the large **X** icon next to the environment pull-down

        ![Preview Environment](/assets/img/postman-ui-preview-env.png "Preview Environment")

## Collections

Once you have setup your Postman environment, you can import pre-built collections for the Okta APIs

1. Click the **Import** button again at the top of the UI

    ![Import Button](/assets/img/postman-ui-import-button.png "Import Button")

2. Select the **From URL** tab and import the following URLs:

    |--------------------+-------------------------------------------------------------------------|
    | Resource           | Postman Collection                                                      |
    |:-------------------|:------------------------------------------------------------------------|
    | Authentication     | [Authentication API](../postman/authentication.json)                    |
    | Sessions           | [Sessions API](../postman/sessions.json)                                |
    | Users              | [Users API](../postman/users.json)                                      |
    | Factors            | [Factors API](../postman/factors.json)                                  |
    | Groups             | [Groups API](../postman/groups.json)                                    |
    | Identity Providers | [IDP API](../postman/idps.json)                                         |
    | Admin Roles        | [Admin Roles API](../postman/admin-roles.json)                          |
    | Apps               | [Apps API](../postman/apps.json)                                        |
    | Schemas            | [Schemas API](../postman/schemas.json)                                  |
    | Events             | [Events API](../postman/events.json)                                    |
    | Templates          | [Templates API](../postman/templates.json)                                    |
    |--------------------+-------------------------------------------------------------------------|

    > You must import each collection individually

3. Click **Collections** to view your imported collections
  ![View Collections](/assets/img/postman-ui-collections.png "View Collections")

## Requests

The imported collections contain URLs and JSON request bodies that have sample data with variables such as **\{\{userId\}\}**.  You will need to replace URL and body variables with ids of specific resources for your specific organization.  This can usually be accomplished by first listing a resource collection with a search or filter, than copying the `id` of a specific resource.  See API documentation for the specific request for details.

--- | ---
URL templates often have variables such as `url` or `userId` | ![URL template with ID](/assets/img/postman-ui-replace-id.png "URL template with ID")
**POST** or **PUT** requests often have variables in the **Body** tab | ![Body environment variable](/assets/img/postman-ui-body-variable.png "Body environment variable")
You can copy an `id` from a previous response such as a `GET` request and paste it in another request. | ![Copy and replace ID](/assets/img/postman-ui-paste-id.png "Copy and replace ID in URL")
You can also set environment variables directly from the right-click context menu.  This is recommended so you can re-use the `id` across multiple requests | ![Set environment variable](/assets/img/postman-ui-set-variable-id.png "Set environment variable")
Always check the request preview to ensure all **\{\{variables\}\}** have been properly replaced before sending the request by click the the generate snippet button **</>**  | ![Generate snippet button](/assets/img/postman-ui-gen-snip-button.png "Generate snippet button") <br> ![Request preview](/assets/img/postman-ui-req-prevew.png "Request preview")
