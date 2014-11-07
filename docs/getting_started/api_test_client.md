---
layout: docs_page
title: API Test Client
---

* Will be replaced with the ToC
{:toc .list-unstyled .toc}

## Postman

[Postman](http://getpostman.com) is an awesome REST API test client that a lot of people at Okta use to test the Okta API.  We have built templates for all of the Okta APIs that makes playing with the Okta APIs simple and easy if you don't have time to practice your *Command Line Fu* with [cURL](http://en.wikipedia.org/wiki/CURL)

### Prerequisites

- Chrome Web Browser
- [API Key created in the Okta Admin UI](/docs/getting_started/getting_a_token.html)

### Setup

1. [Download Postman Chrome Extension](https://chrome.google.com/webstore/detail/postman-rest-client-packa/fhbjgbiflinjbdggehcddcbncdddomop)
2. Launch Postman with new Chrome App Launcher

    ![Chrome App Launcher](/assets/img/chrome-ui-app-launcher.png "Chrome App Launcher")
    
    <br>
    
    ![Postman App Icon](/assets/img/postman-icon.png "Postman App Icon")

3. Import the environment template

    You should [download and import the Environment Template JSON](templates/example.okta.com.postman_environment) and duplicate for each new environment (dev, test, preview, prod)

    1. [Download the template environment JSON](templates/example.okta.com.postman_environment) to your computer
    2. Select the `No environment` dropdown at the top and select `Manage environments`

        ![Manage Environments](/assets/img/postman-ui-manage-env.png "Manage Environments")

    3. Click the `Import` button in the **Manage Environments** modal and use the downloaded JSON file
   
        ![Import Environment](/assets/img/postman-ui-import-env.png "Import Environment")

        ---

        ![Choose Environment](/assets/img/postman-ui-choose-env.png "Choose Environment")

    4. Click the `Duplicate environment` icon to create a new environment from downloaded template

        ![Duplicate Environment](/assets/img/postman-ui-duplicate-env.png "Duplicate Environment")

    5. Edit the environment, assign a new name, and specify the following values:

        - `url`
        - `apikey`

            > Enter the API key you generated as part of prerequisites

        - `email-suffix`

            > `email-suffix` is for generating email address and logins for new users

        - `subdomain` (orgname in https://*orgname*.okta.com/

        ![Edit Environment](/assets/img/postman-ui-edit-env.png "Edit Environment")

        > We recommend you name the new environment the name of your okta organization such as example.okta.com in case you have both a preview and production organization

### Collections

Once you have setup your Postman environment, you can import pre-built collections for Okta APIs

1. Click Import Collection

    ![Import Collection](/assets/img/postman-ui-import-collection.png "Import Collection")

2. Add URL for Collection

    ![Add URL for Collection](/assets/img/postman-ui-import-url.png "Add URL for Collection")

    **Import the following templates:**

    API            | Postman Template
    -------------- | ---------------------------------------------------------
    Users          | https://www.getpostman.com/collections/8bf0965119e3a46fd18b
    Groups         | https://www.getpostman.com/collections/342602f07409f65559fd
    Sessions       | https://www.getpostman.com/collections/570290000c864ac8d454
    Apps           | https://www.getpostman.com/collections/d4296020e4118bdbfa7a
    Events         | https://www.getpostman.com/collections/57071989b25f5fc96070
    Authentication | https://www.getpostman.com/collections/005bc1ffcf4302fe4346
    Factors        | https://www.getpostman.com/collections/871df976d79a9a5f7a85

### Sample Requests

The imported collections contain URLs and JSON request bodies that have sample data.  You will need to replace URL and body parameters designiated in the API documentation for your specific organization. 

   ![Add URL for Collection](/assets/img/postman-ui-replace-id.png "Add URL for Collection")







