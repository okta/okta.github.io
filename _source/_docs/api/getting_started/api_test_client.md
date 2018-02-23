---
layout: docs_page
weight: 1
title: Getting Started With the Okta APIs
redirect_from:
  - "/docs/getting_started/api_test_client.html"
  - "/docs/api/getting_started/index.html"
  - "/docs/api/getting_started/index"
  - "/docs/api/getting_started/"
---

# Overview

A great way to learn an API is to issue requests and inspect the responses. You can easily use our Postman collections to do just that.

{% img okta_postman_logo.png alt:"Postman and an Okta Collection" %}

To use these collections, you'll need to set up your local environment and import the collections. Then, you can send a test request and verify the results.

## Sign Up for Okta

You'll need a free Okta developer organization to get started. If you don't have one already, [sign up](https://developer.okta.com/signup/){:target="_blank"} to create one.

When you create a new Okta organization, it will be assigned a base URL like `dev-12345.oktapreview.com`. This is your unique subdomain in Okta. `oktapreview.com` orgs are production-ready and can be used for development work or full-fledged apps, but they don't include SLAs.

If you need organizations with guaranteed SLAs or enterprise features, [let us know](https://developer.okta.com/contact/). These orgs use a different domain, like `your-org.okta.com`. Regardless of the domain or base URL style, you can use the following instructions to send requests to the Okta API.

## Set Up Your Environment

1. [Create an API token](getting_a_token){:target="_blank"} for your org.
1. [Install the Postman app](https://www.getpostman.com/apps){:target="_blank"}.
1. Launch Postman and click the **Import** button. Select **Import From Link**, and paste this link into the textbox: `https://developer.okta.com/docs/api/postman/example.oktapreview.com.environment`
    {% img import_enviro.png alt:"Importing the Okta Example Environment" %}

1. Once it's imported, make sure the `example.oktapreview.com` environment is selected.
    {% img postman_example_start.png alt:"Postman app with collections" %}

1. Click the eye icon next to `example.oktapreview.com` and select **Edit** to replace or add these values:
    * Rename your environment to something you'll recognize. For example, `My Org`.
    * `url`: Replace the example value with your org's full URL. For example, `https://dev-{id}.oktapreview.com`. (Make sure you don't include `-admin` in the subdomain!)
    * `apikey`: Enter the API token you created earlier, for example `00LzMWxMq_0sdErHy9Jf1sijEGexYZlsdGr9a4QjkS`.

1. Click **Update** to save your changes.

## Import a Collection

Import the collection for the Users API:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/1755573c5cf5fbf7968b){:target="_blank"}

If you have Postman installed, clicking the button above gives you the option of importing the collection into Postman.

You can also import the collection by following the Web View link and downloading the collection as a JSON file. Import that file into Postman by clicking the **Import** button and browsing to your download location.

> Note: You can import and work with the rest of the Okta API using the link at the top of each API reference page,
or use the [Collections Quick Reference](#collections-quick-reference). This tutorial only requires the Users API collection.

## Send a Request

Once you've imported the Users API collection, and added your Okta org information to your environment, you're ready to send a request.

To make sure everything works, send a request to list all the users in your org:

1. Select the **Collections** tab in Postman and open the **Users (Okta API)** collection. Open the **List Users** folder, and select **(GET) List Users**. This loads the List Users request into Postman, ready to send.
1. Click **Send**. The result pane automatically displays the results of your request:
    {% img postman_response.png alt:"GET List Users" %}

If you receive an error, it's likely that one of the values in the environment isn't set correctly. Check the values and try again.

Once you have completed this simple request, you're ready to explore the Okta API!

## Collections Quick Reference

Import any Okta API collection for Postman from the following list:

| Collections                               | Click to Run                                                                                                                            |
|:------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------|
| Authentication                            |   [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/f9684487e584101f25a3){:target="_blank"} |
| API Access Management (OAuth 2.0)         |   [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/e4d286b1af2294bb14a0){:target="_blank"} |
| OpenID Connect                            |   [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/fd92d7c1ab0fbfdecab2){:target="_blank"} |
| Client Registration                   |   [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/291ba43cde74844dd4a7){:target="_blank"} |
| Sessions                                  |   [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/b2e06a22c396bcc94530){:target="_blank"} |
| Apps                                      |   [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/4857222012c11cf5e8cd){:target="_blank"} |
| Events                                    |   [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/f990a71f061a7a16d0bf){:target="_blank"} |
| Factors                                   |   [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/9fdda657d134039fcaba){:target="_blank"} |
| Groups                                    |   [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/0bb414f9594ed93672a0){:target="_blank"} |
| Identity Providers (IdP)                  |   [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/00a7a643fc0ab3bb54c8){:target="_blank"} |
| Logs                                      |   [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/9cfb0dd661a5432a77c6){:target="_blank"} |
| Admin Roles                               |   [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/04f5ec85685ac6f2827e){:target="_blank"} |
| Schemas                                   |   [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/443242e60287fb4b8d6d){:target="_blank"} |
| Users                                     |   [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/1755573c5cf5fbf7968b){:target="_blank"} |
| Custom SMS Templates                      |   [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/d71f7946d8d56ccdaa06){:target="_blank"} |

These buttons are also available at the top of each API reference page in [developer.okta.com](/docs/api/resources/apps).

## Tips

Now that you have a working collection, you can use the following tips to work more efficiently.

### Find IDs for Okta API Requests

Your imported collections contain URLs and JSON request bodies that have sample data with variables such as `{{userId}}`.
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
