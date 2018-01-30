---
layout: docs_page
title: Setting up a SAML application in Okta
redirect_from:
    - "/docs/guides/setting_up_a_saml_application_in_okta"
    - "/docs/guides/setting_up_a_saml_application_in_okta.html"
    - "/docs/examples/configuring_a_saml_application_in_okta"
    - "/docs/examples/configuring_a_saml_application_in_okta.html"
---

# Setting Up a SAML Application in Okta

The first step in configuring an application to support SAML based Single Sign-On from Okta is to set up an application in Okta.

In SAML terminology, what you will be doing here is configuring Okta (your
SAML Identity Provider or "SAML IdP"), with the details of your application
(the new SAML Service Provider or "SAML SP").

Here is how to set up a SAML application in Okta:

> If you are using the developer dashboard you will first need to switch to the Classic UI. <br />
If you see a <b>< > Developer</b> prompt in the top left, click it and select <b>Classic UI</b> to switch to the Classic UI. 

1.  Log in to your Okta organization as a user with administrative
    privileges. If you don't have an Okta organization, you can create a free Okta
    <a href="https://developer.okta.com/signup/" target="_blank">Developer Edition organization</a>.

2.  Click on the blue "Admin" button
    {% img okta-admin-ui-button-admin.png alt:"Admin" %}

3.  Click on the "Add Applications" shortcut
    {% img okta-admin-ui-add-applications.png alt:"Add Applications" %}

4.  Click on the green "Create New App" button
    {% img okta-admin-ui-button-create-new-app.png alt:"Create New App" %}

5.  In the dialog that opens, select the "SAML 2.0" option, then click
    the green "Create" button
    {% img okta-admin-ui-create-new-application-integration.png alt:"Create a New Application Integration" %}

6.  In Step 1 "General Settings", enter "Example SAML Application" in the
    "App name" field, then click the green "Next" button.
    {% img example-saml-application-okta-general-settings.png alt:"General Settings" %}

7.  In Step 2 "Configure SAML," section A "SAML Settings", paste the URL below into the "Single sign on URL" and "Audience URI (SP Entity ID)" fields:

      ~~~ shell
      http://example.com/saml/sso/example-okta-com
      ~~~
     
     {% img example-saml-application-okta-configure-settings1.png alt:"SAML Settings" %}

8. In the "Attribute Statements" section, add three attribute statements:
      1. "FirstName" set to "user.firstName"
      2. "LastName" set to "user.lastName"
      3. "Email" set to "user.email"

      {% img example-saml-application-okta-configure-settings2.png alt:"SAML Settings" %}

    Click Next to continue.

9. In Step 3 "Feedback", select "I'm an Okta customer adding an internal app", and "This is an internal app that we have created," then click Finish.

    {% img example-saml-application-okta-configure-settings3.png alt:"App type" %}

10.  The "Sign On" section of your newly created "Example
    SAML Application" application appears. Keep this page open it a separate tab or browser window. You will
    return to this page later in this guide and copy the
    "Identity Provider metadata" link. (To copy that link, right-click
    on the "Identity Provider metadata" link and select "Copy")
    {% img okta-admin-ui-identity-provider-metadata-link.png alt:"Sign on methods" %}

11. Right-click on the "Assignments" section of the "Example SAML Application"
    application and select "Open Link In New Tab" (so that you can come
    back to the "Sign On" section later).

    In the new tab that opens, click on the "Assign" button and select "Assign to People"
    {% img example-saml-application-okta-assign-people-to-application.png alt:"Assign Application" width:"500" %}

12. A dialog titled "Assign Example SAML Application to People"
    will open. Type your username into the search box, select the
    "Assign" button next to your username. 
    {% img okta-admin-ui-confirm-assignments.png alt:"People search box" width:"500" %}

13. Verify the user-specific attributes, then select "Save and Go Back".
    {% img example-saml-application-okta-confirm-assignments.png alt:"Enter user attributes" width:"500" %}

14. Click "Done" to exit the assignment wizard.

You are now ready to configure SAML in your application. The information in the tab you
opened in step \#10 contains the information that you'll need to configure SAML in your application.

