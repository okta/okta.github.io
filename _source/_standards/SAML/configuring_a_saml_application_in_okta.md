---
layout: docs_page
title: Setting up a SAML application in Okta
---

Here is how to configure Okta:

1.  Log in to your Okta organization as a user with administrative
    privileges.

    If you don't have an Okta organization, you can create a free Okta
    Developer Edition organization here:
    <https://www.okta.com/developer/signup/>

2.  Click on the blue "Admin" button
    ![Admin](/assets/img/okta-admin-ui-button-admin.png)

3.  Click on the "Add Applications" shortcut
    ![Add Applications](/assets/img/okta-admin-ui-add-applications.png)

4.  Click on the green "Create New App" button
    ![Create New App](/assets/img/okta-admin-ui-button-create-new-app.png)

5.  In the dialog that opens, select the "SAML 2.0" option, then click
    the green "Create" button
    ![Create a New Application Integration](/assets/img/okta-admin-ui-create-new-application-integration.png)

6.  In Step 1 "General Settings", enter "Spring Security SAML" in the
    "App name" field, then click the green "Next" button.
    ![General Settings](/assets/img/spring-security-saml-okta-general-settings.png)

7.  In Step 2 "Configure SAML",
    Paste the URL below into the "Single sign on URL" field:

    ~~~ shell
    http://localhost:8080/spring-security-saml2-sample/saml/SSO
    ~~~

    Then paste the URL below into the "Audience URI (SP Entity ID)"
    field:

    ~~~ shell
    http://localhost:8080/spring-security-saml2-sample/saml/SSO/alias/defaultAlias
    ~~~

    Then click the green "Next" button

    ![SAML Settings](/assets/img/spring-security-saml-okta-configure-settings.png)


8.  In Step 3 "Feedback", click the checkbox next to the text "This is
    an internal application that we created", then click the green
    "Finish" button.
    ![App type](/assets/img/okta-admin-ui-new-application-step-3-feedback.png)

9.  You will now see the "Sign On" section of your newly created "Spring
    Security SAML" application.

10. Keep this page open it a separate tab or browser window. You will
    need to return to this page later in this guide and copy the
    "Identity Provider metadata" link. (To copy the that link, right
    click on the "Identity Provider metadata" link and select "Copy")
    ![Sign on methods](/assets/img/okta-admin-ui-identity-provider-metadata-link.png)

11. Right-click on the "People" section of the "Spring Security SAML"
    application and select "Open Link In New Tab" (so that you can come
    back to the "Sign On" section later).

    In the new tab that opens, click on the "Assign Application" button
    ![Assign Application](/assets/img/spring-security-saml-okta-assign-people-to-application.png)

12. A dialog titled "Assign Spring Security SAML to up to 500 people"
    will open. Type your username into the search box, select the
    checkbox next to your username, then click the green "Next" button
    ![People search box](/assets/img/okta-admin-ui-confirm-assignments.png)

13. You will be prompted to "Enter user-specific attributes". Just click
    the green "Confirm Assignments" button to keep the defaults.
    ![Enter user attributes](/assets/img/spring-security-saml-okta-confirm-assignments.png)

14. You are now ready to proceed to the next section. Make sure that the
    link you copied in step \#9 is still in your clipboard, as you will
    need it in the next section.
