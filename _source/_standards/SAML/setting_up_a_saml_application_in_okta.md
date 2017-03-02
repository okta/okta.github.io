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

 1.  Log in to your Okta organization as a user with administrative
    privileges. If you don't have an Okta organization, you can create a free Okta
    <a href="https://www.okta.com/developer/signup/" target="_blank">Developer Edition organization</a>.

 2.  Click on the blue "Admin" button
    ![Admin](/assets/img/okta-admin-ui-button-admin.png)

 3.  Click on the "Add Applications" shortcut
    ![Add Applications](/assets/img/okta-admin-ui-add-applications.png)

 4.  Click on the green "Create New App" button
    ![Create New App](/assets/img/okta-admin-ui-button-create-new-app.png)

 5.  In the dialog that opens, select the "SAML 2.0" option, then click
    the green "Create" button
    ![Create a New Application Integration](/assets/img/okta-admin-ui-create-new-application-integration.png)

 6.  In Step 1 "General Settings", enter "Example SAML Application" in the
    "App name" field, then click the green "Next" button.
    ![General Settings](/assets/img/example-saml-application-okta-general-settings.png)

 7.  In Step 2 "Configure SAML," section A "SAML Settings", paste the URL below into the "Single sign on URL" and "Audience URI (SP Entity ID)" fields:

      ~~~ shell
      http://example.com/saml/sso/example-okta-com
      ~~~
     
     ![SAML Settings](/assets/img/example-saml-application-okta-configure-settings1.png)

 8. In the "Attribute Statements" section, add three attribute statements:
      1. "FirstName" set to "user.firstName"
      2. "LastName" set to "user.lastName"
      3. "Email" set to "user.email"

      ![SAML Settings](/assets/img/example-saml-application-okta-configure-settings2.png)

    Click Next to continue.

 9. In Step 3 "Feedback", select "I'm an Okta customer adding an internal app", and "This is an internal app that we have created," then click Finish.

    ![App type](/assets/img/example-saml-application-okta-configure-settings3.png)

10.  The "Sign On" section of your newly created "Example
    SAML Application" application appears. Keep this page open it a separate tab or browser window. You will
    return to this page later in this guide and copy the
    "Identity Provider metadata" link. (To copy that link, right-click
    on the "Identity Provider metadata" link and select "Copy")
    ![Sign on methods](/assets/img/okta-admin-ui-identity-provider-metadata-link.png)

11. Right-click on the "People" section of the "Example SAML Application"
    application and select "Open Link In New Tab" (so that you can come
    back to the "Sign On" section later).

    In the new tab that opens, click on the "Assign Application" button
    ![Assign Application](/assets/img/example-saml-application-okta-assign-people-to-application.png)

12. A dialog titled "Assign Example SAML Application to up to 500 people"
    will open. Type your username into the search box, select the
    checkbox next to your username, then click the green "Next" button
    ![People search box](/assets/img/okta-admin-ui-confirm-assignments.png)

13. You will be prompted to "Enter user-specific attributes". Just click
    the green "Confirm Assignments" button to keep the defaults.
    ![Enter user attributes](/assets/img/example-saml-application-okta-confirm-assignments.png)

You are now ready to configure SAML in your application. The information in the tab you
opened in step \#10 contains the information that you'll need to configure SAML in your application.

