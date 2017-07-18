---
layout: docs_page
title: Single Sign-On with SAML
weight: 2
excerpt: Support SSO in your app and join the Okta Application Network.
---

## Single Sign-On

Your application needs to support Federated Single Sign-On, a common approach for an application to rely on an external identity provider. For web-based applications, [Security Assertion Markup Language (SAML)](https://en.wikipedia.org/wiki/Security_Assertion_Markup_Language) is the standard. For mobile applications, many mobile solution vendors offer proprietary SDKs to provide support. Okta offers [Okta Mobile Connect](/docs/guides/okta_mobile_connect.html) which is based on the SAML protocol.

For details on how to federate your application with SAML and Okta Mobile Connect, go to our [Single Sign-On with Okta](/docs/guides/saml_guidance.html) section for additional guidance.


### Single Sign-On: Building an Integration with Okta

Use the following instructions to support single sign-on for your app in the public-facing Okta Application Network:

#### 1. Prepare Your Application

Use Okta’s [Single Sign-On with Okta](/docs/guides/saml_guidance.html) guide for best practices on supporting SAML in your app which includes toolkits and testing tools.

#### 2. Integrate Your App

* Sign up for an Okta [developer account](https://www.okta.com/developer/signup/).
* In your Okta account (make sure you are signed in as an admin), use the [App Wizard](https://support.okta.com/help/articles/Knowledge_Article/Using-the-App-Integration-Wizard) to build a Single Sign-on integration with Okta. For the more visually inclined, see our [video](https://support.okta.com/help/articles/Knowledge_Article/Adding-Applications-Using-the-Application-Integration-Wizard-AIW) for using the App Wizard.
* When you are ready, navigate to the Feedback tab of the App Wizard:
    {% img saml-step3.png alt:"Feedback page for App wizard" %}

    1. Select **I'm a software vendor. I'd like to integrate my app with Okta.** if you want your app added to the OAN. Okta won’t contact you until this option is selected.
    2. Click **Submit your app for review.** You are redirected to [the OAN Manager](https://oanmanager.okta.com/).
    3. In the OAN Manager, click **Start Submission Form,** and enter the requested information in the General Settings tab.
    4. In the SAML tab, select On in the **SAML support** button, and enter information requested.
    5. When you've  entered all the information requested on the General Settings and SAML tabs, the **Submit for Review** button is enabled. Click it to submit your app for review.

Once submitted, you can track the stage of your integration in the OAN Manager.

>Note: Okta doesn't proactively add SWA-only, branded apps to the OAN. If you want a branded app in the OAN that only supports SWA to all customers, submit a request to <developers@okta.com>.

#### 3. Need Help?

Get stuck or have questions? See our Okta Application Network FAQs (below), email <developers@okta.com> or post your questions on [stackoverflow](https://stackoverflow.com).

#### 4. Partner with Okta (Optional)

Already part of the Okta App Network but looking for a more “go-to-market” partnership? Email <developers@okta.com> about becoming an [Okta App Partner](https://www.okta.com/partners/). App Partners are fully integrated with Okta and get access to great benefits like marketing support and a free version of Okta for your app.

Related articles:

* [Provisioning](/use_cases/integrate_with_okta/provisioning.html)
* [Promotion](/use_cases/integrate_with_okta/promotion.html)
* [OAN FAQs](/use_cases/integrate_with_okta/oan-faqs.html)