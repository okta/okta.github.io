---
layout: docs_page
title:  OIN FAQs
weight: 5
excerpt: OIN FAQs
---

## Okta Integration Network FAQs

**Q: I am an ISV and want to integrate with Okta for SAML and SCIM. Do I need to contact Okta first to start integrating my application?**

**A:** We work hard to make it super easy for you to integrate with Okta. To that end, you don't have to *contact* Okta to *integrate* with Okta. Just start with the following SCIM or SAML documentation links, and you should be all set! Of course, if you do have questions, our developer support team <developers@okta.com> is here to help you.

* For SAML, follow the steps [here](/use_cases/integrate_with_okta/sso-with-saml) to get started with the integration process using the [App Integration Wizard](https://help.okta.com/en/prod/Content/Topics/Apps/Apps_App_Integration_Wizard.htm).
* For SCIM, follow the steps [here](/standards/SCIM/#publishing-your-scim-based-provisioning-integration) to get started with the integration process using our SCIM templates.

Once your application is ready for Okta's review, submit it to us via the [OIN Manager](https://oinmanager.okta.com/), where you can also track review status. Get stuck or have questions? Email <developers@okta.com>.

**Q:  I am an ISV whose app is already listed in the OIN. How do I request changes/updates to the existing integration?**

**A:** Submit your application with the changes as you would if your application was not listed in the OIN. Once your submission goes under Okta's review, we compare your submission against the existing customer facing integration, and update it accordingly. If there are special instructions you'd like to provide to us, add them in the **Additional Instructions** text box on the submission form. We will reach out to you directly for questions.

{% img oin-add-instructions.png alt: "Add Instructions image" %}

**Q: I am an ISV having issues integrating my app or have questions about single sign-on support in my app. How do I contact Okta?**

**A:** If you have any technical questions, you can submit them to <developers@okta.com> or post your questions on [stackoverflow](https://stackoverflow.com).

**Q: Where can I get a free Okta account to play around with?**

**A:** Sign up for an [Okta Developer Edition](https://developer.okta.com/signup/) account.

**Q: Are there any cost associated with joining the Okta Integration Network (OIN)?**

**A:** No, integrating your application with the Okta Integration Network is completely FREE. Also, Okta's paid customers can utilize all application integrations in the OIN free of charge.

**Q: By following the guidance here, am I building an integration that only works with Okta? What about other identity vendors?**

**A:** Absolutely not. Our goal is to help you identity-enable your application using industry standards. The guidance offered here for SAML and SCIM allows you to integrate with customers using other identity solutions.

**Q: My customer is asking for AD (Active Directory) integration. If I integrate with Okta, can I connect to my customer's on-premise directory?**

**A:** Yes. This is one of the key benefits of developing a pre-built integration with Okta — you can leverage our existing integrations with directories so you don't have to. By integrating with Okta (for single sign-on and provisioning), you effectively have the ability to integrate with your customer's on-premise AD or LDAP infrastructure for authentication (log into your cloud app with their corporate password), authorization (use details like AD groups to drive access rights), and provisioning policies.

**Q: What is Secure Web Authentication (SWA)?**

**A:** SWA was developed by Okta to provide single sign-on for apps that do not support federated sign-on methods. Users can still sign in directly through the application and then enter their credentials for these apps on their Okta homepage. These credentials are stored such that users can access their apps with a single sign-on. When users first sign-in to a SWA app from their homepage, they see a pop-up message asking if they were able to sign-in successfully.

**Q: What is the process after I have submitted my app using the OIN Manager?**

**A:**  Once your submit your app integration, it goes through a review cycle - Okta (OIN Operations team) reviews and tests your integration. We will reach out to you directly if your integration does not pass the review, requires re-submission, or we need additional information from you. Once the review is completed, the integration is promoted to the public Okta Integration Network. Typical review time is two weeks. and you can track the progress of each submission in the OIN Manager.

Have you submitted an app but have not seen a change in review status in the [OIN Manager](https://oinmanager.okta.com)? Email <developers@okta.com>.

**Q: I'm an ISV setting up a SAML 2.0 app using the App Wizard and we have different domains for each customer. How do you manage these types of situations?**

**A:** Currently, the App Wizard does not support custom domains, but public facing integrations can still have this functionality. Create an app integration as you normally would using the [App Wizard](https://help.okta.com/en/prod/Content/Topics/Apps/Apps_App_Integration_Wizard.htm). Once you get to the step of submitting your app integration via the [OIN Manager](https://oinmanager.okta.com), you will be asked to fill out a form (see image below); be sure to select "No" and provide all relevant information. We will add the ability for customers to set a custom domain in the customer facing integration.

{% img oin-mgr-app-integration.png alt: "Custom domain choice in app integration form" %}

**Q: My app currently supports WS-FED for single sign-on. Can I use the App Wizard?**

**A:** The Okta App Wizard only supports SAML 2.0 for federated single sign-on. If your app supports WS-Fed, create a [WS-Fed Template App](https://help.okta.com/en/prod/Content/Topics/Apps/Apps_Configure_Okta%20Template_WS_Federation.htm). Once completed, the Template Application you created is can be to be used only within your account. In order to promote your Template App to the Okta Integration Network, please email a screenshot of the configured app details to <developers@okta.com> with your app name in the subject line.

**Q: I am creating a SWA using the App Wizard but my application has fields on the login page in addition to the standard username and password (example: Customer / OrgID). Can an app with additional fields on the login be configured using the App Wizard?**

**A:** Currently, the App Wizard does not support extra login fields. Create an app using the Plug-in (SWA) Template Application. In order to promote your Template App to the Okta Integration Network, please email a screenshot of the configured app details to <developers@okta.com> with your app name in the subject line.

**Q: Does Okta support single logout or single sign-out (SAML protocol)?**

**A:** Yes. For more information, see [Using the App Integration Wizard: SAML App Wizard: Advanced Settings](https://help.okta.com/en/prod/Content/Topics/Apps/Apps_App_Integration_Wizard.htm).


**Q: Is the IDP session time out a setting that an Okta administrator can change? And if so, can it be changed on a per application basis, or is it a global setting for all of the user's applications?**

**A:** Yes, the session time out default is two hours but the Okta administrator can customized the default by hour or minute. This session time out is an IDP setting and therefore, it is global and applies to all applications in an Okta org.

**Q: My app is now in the OIN, what is the user experience for a joint customer administrator that wants to set up single sign-on and provisioning for my app in the Okta interface?**

**A:** Okta creates unique SAML configuration documentation for each application in the OIN so each will be different. For a sample configuration, see our instructions for [How to Configure SAML 2.0 in Salesforce.com](http://saml-doc.okta.com/SAML_Docs/How-to-Configure-SAML-2.0-in-Salesforce.html). See the [Setting up Salesforce in Okta](https://support.okta.com/help/articles/Knowledge_Article/Setting-Up-Salesforce-in-Okta) video for a step-by-step walk through of all the steps an IT administrator would take to configure single sign-on and provisioning for an app.

Also, if you haven't already done so, sign up for an Okta [developer account](https://developer.okta.com/signup/) and you can test drive the Okta user experience yourself.

**Q: In general, how can I get familiar with the Okta product?**

**A:** To get started, check out the [Okta Help Center](https://help.okta.com) or [OktaInc on YouTube](https://www.youtube.com/user/OktaInc). App Partners are eligible for live Okta 101 sessions as well. Please email <developers@okta.com> if you are interested.

See also:

* [Single Sign-On](/use_cases/integrate_with_okta/sso-with-saml)
* [Provisioning](/use_cases/integrate_with_okta/provisioning)
* [Promotion](/use_cases/integrate_with_okta/promotion)