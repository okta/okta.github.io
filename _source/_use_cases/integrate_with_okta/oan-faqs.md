---
layout: docs_page
title:  OIN FAQs
weight: 5
excerpt: OIN FAQs
---

## Okta Integration Network FAQs

**Q: Do I need to contact Okta first to start integrating my application?**

A: No, the materials here should be enough to help you get started. You should start by enabling [SAML](/docs/guides/saml_guidance) with your application. Then test your app integration and submit for review by Okta with the [App Wizard](/use_cases/integrate_with_okta/sso-with-saml). Get stuck or have questions? Email <developers@okta.com>.

<br/>

**Q: I am having issues integrating my app or have questions about single sign-on support in my app. How do I contact Okta?**

A: If you have any technical questions, you can submit them to <developers@okta.com> or post your questions on [stackoverflow](https://stackoverflow.com).

<br/>

**Q: Where can I get a free Okta account to play around with?**

A: Sign up for an [Okta Developer Edition](https://developer.okta.com/signup/) account.

<br/>

**Q: Are there any cost associated with joining the Okta Integration Network (OIN)?**

A: No, integrating your application with the Okta Integration Network is completely FREE. Also, Okta’s paid customers can utilize all application integrations in the OIN free of charge.

<br/>

**Q: By following the guidance here, am I building an integration that only works with Okta? What about other identity vendors?**

A: Absolutely not. Our goal is to help you identity-enable your application using industry standards. The guidance offered here for SAML and SCIM allows you to integrate with customers using other identity solutions.

<br/>

**Q: My customer is asking for AD (Active Directory) integration. If I integrate with Okta, can I connect to my customer's on-prem directory?**

A: Yes this is one of the key benefits of developing a pre-built integration with Okta — you can leverage our existing integrations with directories so you don’t have to. By integrating with Okta (for single sign-on and provisioning), you effectively have the ability to integrate with your customer’s on-prem AD or LDAP infrastructure for authentication (log into your cloud app with their corporate password), authorization (use details like AD groups to drive access rights), and provisioning policies.

<br/>

**Q: What is Secure Web Authentication (SWA)?**

A: SWA was developed by Okta to provide single sign-on for apps that do not support federated sign-on methods. Users can still sign in directly through the application and then enter their credentials for these apps on their Okta homepage. These credentials are stored such that users can access their apps with a single sign-on. When users first sign-in to a SWA app from their homepage, they see a pop-up message asking if they were able to sign-in successfully.

<br/>

**Q: What is the process after I have submitted my app using the App Wizard?**

A: The Okta App Integration team reviews all submitted apps. The team will reach out during the testing and documentation process for additional information. When completed, the application is then be promoted to the public Okta Integration Network, and you are notified. Typical review time is two weeks. Have you submitted an app but have not heard from Okta? Email <developers@okta.com>.

<br/>

**Q: What is the difference between Okta Verified and Community Created in the Okta Integration Network?**

A: There are two different app certification levels in the OIN – Okta Verified and Community Created. Okta Verified apps have custom configuration documentation and the integrations are tested by Okta on an ongoing basis. In many cases, Okta has partnered with the app's developer. All other apps are labeled in the Okta Integration Network as Community Created and have not been tested and verified by Okta.

![OIN Certification](https://cloud.githubusercontent.com/assets/3278918/12027092/9cab6bd2-ad76-11e5-8372-938b5367ba30.png "OIN Certification")

<br/>

**Q: I’m setting up a SAML 2.0 app using the App Wizard and we have different domains for each customer. How do you manage these types of situations?**

A: Currently, the App Wizard does not support custom domains. Create an app integration as you normally would using the [App Wizard](https://help.okta.com/en/prod/Content/Topics/Apps/Apps_App_Integration_Wizard.htm). In step #3 Feedback, please try to include in the “How to enable SAML” section or email <developers@okta.com>. Our team will work with you to add this functionality when they begin to work with you.

<br/>

**Q: My app currently supports WS-FED for single sign-on. Can I use the App Wizard?**

A: The Okta App Wizard only supports SAML 2.0 for federated single sign-on. If your app supports WS-Fed, you will instead need to create a [WS-Fed Template App](https://help.okta.com/en/prod/Content/Topics/Apps/Apps_Configure_Okta%20Template_WS_Federation.htm). Once completed, the Template Application you have created will only be able to be used within your account. In order to promote your Template App to the Okta Integration Network, please email a screenshot of the configured app details to <developers@okta.com> with your app name in the subject line.

<br/>

**Q: I am creating a SWA using the App Wizard but I realize my application has additional fields on the login page beyond the standard username and password (example: Customer / OrgID). Can an app with additional fields like this on the login be configured using the App Wizard?**

A: Currently, the App Wizard does not support extra login fields. Create an app using the Plug-in (SWA) Template Application. In order to promote your Template App to the Okta Integration Network, please email a screenshot of the configured app details to <developers@okta.com> with your app name in the subject line.

<br/>

**Q: Does Okta support single logout / single sign-out (SAML protocol)?**

A: Yes. For more information, see [Using the App Integration Wizard: SAML App Wizard: Advanced Settings](https://help.okta.com/en/prod/Content/Topics/Apps/Apps_App_Integration_Wizard.htm).

<br/>

**Q: Is the IDP session time out a setting that an Okta admin can change? And if so, can it be changed on a per application basis, or is it a global setting for all of the user’s applications?**

A: Yes, the session time out default is 2 hours but can be customized by the hour or minute by the Okta administrator. This session time out is an IDP setting – and therefore, it is global and applies to all applications.

<br/>

**Q: My app is now in the OIN, what is the user experience for a joint customer admin that wants to set up single sign-on and provisioning for my app in the Okta interface?**

A: Okta creates unique SAML configuration documentation for each application in the OIN so each will be different but for a sample, see our instructions for [How to Configure SAML 2.0 in Salesforce.com](http://saml-doc.okta.com/SAML_Docs/How-to-Configure-SAML-2.0-in-Salesforce.html) as an example. See the [Setting up Salesforce in Okta](https://support.okta.com/help/articles/Knowledge_Article/Setting-Up-Salesforce-in-Okta) video for a step-by-step walk through of all the steps an IT admin would take to configure single sign-on and provisioning for an app.

Also, if you haven’t already done so, sign up for an Okta [developer account](https://developer.okta.com/signup/) and you can test drive the Okta user experience yourself.

<br/>

**Q: In general, how can I get familiar with the Okta product?**

A: To get started, check out the [Okta Help Center](https://help.okta.com) or [OktaInc on YouTube](https://www.youtube.com/user/OktaInc). App Partners are eligible for live Okta 101 sessions as well, please email <developers@okta.com> if you are interested. 

<br />

See also:

* [Single Sign-On](/use_cases/integrate_with_okta/sso-with-saml)
* [Provisioning](/use_cases/integrate_with_okta/provisioning)
* [Promotion](/use_cases/integrate_with_okta/promotion)