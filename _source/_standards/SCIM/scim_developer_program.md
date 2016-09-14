---
title: SCIM Provisioning Developer Program
excerpt: Develop SCIM provisioning with Okta
redirect_from:
    - "/docs/guides/scim_developer_program"
    - "/docs/guides/scim_developer_program.html"
---
# SCIM Provisioning Developer Program

Increasingly, businesses expect their cloud application providers to support advanced provisioning features 
in order to automate user lifecycle management for an application, including account creation, profile updates, 
authorization settings, and account deactivation. 

Okta's developer program helps cloud service providers quickly integrate with Okta, using the [SCIM standard](http://www.simplecloud.info/), 
to enable advanced provisioning. The program includes:

* Hands-on workshops ([Schedule](http://okta.litmos.com/self-signup/register/328927?type=1))
* Step-by-step documentation 
* Free Okta Developer Edition license
* QA tools
* Dedicated support

> [Sign up for the program.](http://pages.okta.com/DeveloperSCIM.html)

# Development Process

After [signing up for the program](http://pages.okta.com/DeveloperSCIM.html), follow these steps to build, test, 
and publish your SCIM-based integration with Okta:

1. [Review Okta’s SCIM Docs & Prepare Your App](#review-oktas-scim-docs-and-prepare-your-app)
2. [Test Your SCIM Server](#test-your-scim-server)
3. [Submit for Okta Review](#submit-for-okta-review)
4. [Test with Customers](#customer-testing)
5. [Publish to Okta Application Network](#publish-to-okta-application-network)

> At any stage of the process, please send all questions to <developers@okta.com>.


## Review Okta’s SCIM Docs and Prepare Your App

The first step on is to build a “compliant” SCIM server. We developed [Okta’s SCIM Docs](http://developer.okta.com/docs/guides/scim_guidance.html)
to assist you in this effort. Even if you already support SCIM, it’s important that you still review Okta’s SCIM docs 
(especially the sections below) to understand the specifics of Okta’s support for the SCIM standard:

* [Understanding User Provisioning in Okta](index.html#understanding-of-user-provisioning-in-okta)
* [Required SCIM Capabilities](index.html#required-scim-capabilities)
* [SCIM Features Not Implemented by Okta](index.html#scim-features-not-implemented-by-okta)

> Okta hosts a monthly hands-on SCIM developer workshop to help ISV partners accelerate their implementation of SCIM and integration with Okta. 
[See the workshop agenda and sign-up](http://okta.litmos.com/self-signup/register/328927?type=1).


## Test Your SCIM Server

### Leverage Runscope to simplify your SCIM testing

The easiest way for you to develop and verify your SCIM integration is to make use of an automated test suite that runs on Runscope. 
A Runscope [free trial account](https://www.runscope.com/signup) will give you all you need for testing if you don’t already use the service. 
For more details, see [Testing your SCIM server with Runscope](http://developer.okta.com/docs/guides/scim_guidance.html#testing-your-scim-server-with-runscope).

### Testing your SCIM server with Okta

Once you have a SCIM server that passes all of the Runscope tests, you will want to test your SCIM integration 
directly with Okta. To do so, you will first need to sign up for an Okta developer account.

Once logged in, email <developers@okta.com> with your org subdomain (e.g. dev-123456) so we can enable 
a SCIM “template app” in your Okta org. 

> If you are using OAuth Authorization Code Grant flow as your authentication method, Okta will need to custom-configure a template app for you. 
Please make note of this in your email to <developers@okta.com>.

Once the SCIM template app has been assigned to your Okta developer org, you can start testing by following the steps below:

1. Navigate to the admin interface in your Okta org by clicking “Admin.” <img src="/assets/img/end_user.png" alt="Navigate to Admin view" width="600px" />

2. Click **Applications**, then **Add Application**. <img src="/assets/img/applications.png" alt="Navigate to Applications" width="600px" />

3. Search for “SCIM”. You’ll see three different SCIM template applications for each SCIM version (1.1 and 2.0) 
based off of the various authentication methods you could choose to support (Header Auth, Basic Auth, or Bearer Token).<img src="/assets/img/scim.png" alt="SCIM template apps" width="600px" />

<!--Comment from original doc: Do we have testing plan details that our internal teams use which ISVs can also follow for testing in Okta?
Comment on comment: Do we have this in a format that we can link to or include directly here? --> 

## Submit for Okta Review

Once you have a functioning SCIM integration in your Okta developer org, and have confirmed support 
for Okta’s [required SCIM capabilities](http://developer.okta.com/docs/guides/scim_guidance.html#required-scim-capabilities), 
you are ready to formally [submit your app for review](https://docs.google.com/forms/d/1olk5SYxiM4Ul-Hk02VVYOFnT28-vStFsjLaHAOWARX0/viewform) by Okta.

Your submission will provide Okta with all the metadata needed to create a customized app 
(includes default mappings, link to config docs) which will be used by joint customers and
eventually published publicly in the [Okta Application Network](https://www.okta.com/resources/find-your-apps/). Okta will review the submission, 
create the customized app, run it through our internal QA, and then make it available in your developer org for your own testing. 

Prepare the following two components before beginning to work through [the submission document](https://docs.google.com/forms/d/1olk5SYxiM4Ul-Hk02VVYOFnT28-vStFsjLaHAOWARX0/viewform):

1. Demo video showing working SCIM integration. This will be used for Okta internal review purposes only.
Please use a QuickTime Player compatible video format such as .mov.
2. Customer-facing Configuration Guide. This will be exposed externally in Okta to end customers. 
For more details, see [the configuration guide guidelines](http://saml-doc.okta.com/Provisioning_Docs/SCIM_Configuration_Guide_Instructions.pdf).

> Before submitting your application to Okta, you should 
[check the User Attributes](http://developer.okta.com/docs/guides/scim_guidance.html#submitting-to-okta)
to make sure that the attributes are set to what you want your users to see.

## Customer Testing

We require one joint customer to successfully use the integration in production before making it publically available 
in the Okta Application Network. Here’s the process for getting joint customers involved 
in testing the newly developed SCIM integration:

1. Identify joint customers interested in piloting the integration. Here’s [a template email](https://docs.google.com/a/okta.com/document/d/1UCvtjTj-nfKUVff4xMGwWz_hKlHBOZrCMbFkJHMkc-g/edit?usp=sharing) to assist in outreach.
2. Once identified, an Okta admin from the joint customer will need to email <developers@okta.com> asking 
for this integration to be assigned to their Okta preview org (please have them specify org subdomain in their request). 
Okta will then assign the app.
3. Integration and configuration review with the joint customer. 
Partners are responsible for managing the customer identification and testing process, but Okta can support as needed. 
Please coordinate via <developers@okta.com>.


## Publish to Okta Application Network

In order for an app to be published in the Okta Application Network, it must meet the following criteria:

* Have at least one customer using the integration in production send an email to <developers@okta.com> 
saying that they "would recommend to other customers."
* [ISV configuration guide](http://saml-doc.okta.com/Provisioning_Docs/SCIM_Configuration_Guide_Instructions.pdf) explaining:
    * The supported features
    * Step-by-step instructions for setting up the integration
    * Gotchas & Known-issues
    * Support and Contact Info
* ISV Support Contact
* ISV Escalation Contact
* Full, permanent test tenant provided to Okta
* RunScope Test Suite 
* Final Full QA by Okta 
