---
layout: docs_page
weight: 1
title: Getting Started With the Okta APIs
redirect_from: "/docs/getting_started/api_test_client.html"
---

# Overview

A great way to learn an API is to issue requests and inspect the responses. You can easily access our Postman collections and Example environment to do just that.

{% img okta_postman_logo.png alt:"Postman and an Okta Collection" %}

To use these collections, you'll need to set up your environment, import the collections, send a test request, and verify the results.

## Set Up Your Environment

1. [Create an API token](getting_a_token.html){:target="_blank"}.
2. [Install the Postman App](https://www.getpostman.com/apps){:target="_blank"}.
3. Launch Postman and click the 'import button'. Select import from link, and paste this link into the textbox: `http://developer.okta.com/docs/api/postman/example.oktapreview.com.environment`
    {% img import_enviro.png alt:"Importing the Okta Example Environment" %}

4. Once you have clicked import, make sure the `example.oktapreview.com` environment is selected.
    {% img postman_example_start.png alt:"Postman app with collections" %}

5. Click the eye icon next to `example.oktapreview.com` and select **Edit** to replace or add these values:
    * Rename your environment to something you'll recognize, for example **myOrg**.
    * `url`: Replace the example value with your org's URL, for example **https://myOrg.oktapreview.com**. This becomes the new name of your environment. Do **not** include '-admin' in the subdomain.
    * `apikey`: Enter the API token you created in your org, for example **00LzMWxMq_0sdErHy9Jf1sijEGexYZlsdGr9a4QjkS**.
    * `email-suffix`: Enter the email suffix for your domain, for example **myOrg.com**.

6. Save your changes by selecting **Update**. Now your environment looks similar to this example:
    {% img postman_example_enviro.png alt:"Example.okta.com environment with required values" %}

## Import a Collection

Import the collection for the Users API: 

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/78060451b3ba309f5bcf){:target="_blank"}

> Note: You can import and work with the rest of the Okta API using the link at the top of each API reference page, 
or use the [Collections Quick Reference](#collections-quick-reference). This tutorial only requires the Users collection import.

## Send a Request

To test your configuration, send a request to list all the users in your org:

1. Make sure you've imported the Users API collection and configured your example environment using the instructions in the previous section.
2. Select the **Collections** tab in Postman, open the **List Users** folder, and select **GET List Users**.
3. Click **Send**. The result pane automatically displays the results of your request:
    {% img postman_response.png alt:"GET List Users" %}
    If you receive errors, it's likely that one of the values in the environment isn't set correctly. Check the values and try again.

Once you have completed this simple request, you are ready to explore the Okta API. 

## Collections Quick Reference

Import any Okta API collection for Postman from the following list:

|  Collections  | click to Run   |
|:---|:---|
| Authentication | [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/07df454531c56cb5fe71){:target="_blank"} |
| OAuth 2.0 and OpenID Connect | [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/4adca9a35eab5716d9f6){:target="_blank"} |
| Apps | [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/4b283a9afed50a1ccd6b){:target="_blank"} |
| Events | [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/44d6b3bbbbf674035a86){:target="_blank"} |
| Factors | [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/b055a859dbe24a54814a){:target="_blank"} |
| Groups | [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/c33a1f9fa8a44c481a6f){:target="_blank"} |
| Identity Providers (IdP) | [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/8438ef3445415386b407){:target="_blank"} |
| Logs | [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/8f19fc704561a8b44e27){:target="_blank"} |
| Admin Roles | [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/5f91aaea133fe6c9cb8b){:target="_blank"} |
| Schemas | [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/443242e60287fb4b8d6d){:target="_blank"} |
| Users  | [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/78060451b3ba309f5bcf){:target="_blank"} |
| Custom SMS Templates | [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/d71f7946d8d56ccdaa06){:target="_blank"} |

These buttons are also available at the top of each API reference page in [developer.okta.com](/docs/api/resources/apps.html).

## Tips

Now that you have a working collection, you can use the following tips to work more efficiently.

### Find IDs for Okta API Requests

Your imported collections contain URLs and JSON request bodies that have sample data with variables such as **\{\{userId\}\}**.
Replace URL and body variables with the IDs of the resources you wish to specify.

To find an ID:

1. List a resource collection with a search or filter. For example, list the users in your org, as you did in the previous section.
    {% img postman_response2.png alt:"List Users Response" %}
    
2. Copy the `id` of the resource, in this example the `id` for Tony Stark, in your next request. 

### Retain Headers When Clicking Links

Retaining the headers is helpful when you click HAL links in responses.

To retain the headers:

1. Launch Postman and click the wrench icon.
2. Select **Settings**.
3. In the **Headers** column, enable **Retain headers when clicking on links**.
