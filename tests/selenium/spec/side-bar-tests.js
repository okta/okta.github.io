const SideBarPage = require('../framework/page-objects/SideBarPage');

describe('sidebar navigation tests', function() {
    const sideBarPage = new SideBarPage();

    beforeEach(function() {
        browser.ignoreSynchronization = true;
        sideBarPage.load();
        sideBarPage.runTestOnDesktopBrowserSize(); // At smaller sizes, sidebar navigation is hidden
    });

    it('has all the links in use cases side navigation', function() {
        let expectedUseCases = ['Authentication', 'Multi-Factor Authentication', 'API Access Management', 'Integrate with Okta'];
        let useCasesNavText = sideBarPage.getUseCasesLinkText();
        for(let i = 0; i < expectedUseCases.length; i++) {
            expect(useCasesNavText).toContain(expectedUseCases[i]);
        }
    });

    it('has all the links in reference side navigation', function() {
        let expectedReferences = ['Getting Started', 'Authentication Reference', 'API Reference', 'Error Codes', 'Okta Expression Language', 'Platform Release Notes'];
        let referenceNavText = sideBarPage.getReferencesLinkText();
        for(let i = 0; i < expectedReferences.length; i++) {
            expect(referenceNavText).toContain(expectedReferences[i]);
        }
    });

    it('has all the links in standards side navigation', function() {
        let expectedStandards = ['OAuth 2.0 and Okta', 'OpenID Connect and Okta', 'SAML', 'SCIM Provisioning with Lifecycle Management'];
        let standardsNavText = sideBarPage.getStandardsLinkText();
        for(let i = 0; i < expectedStandards.length; i++) {
            expect(standardsNavText).toContain(expectedStandards[i]);
        }
    });
  
    it('navigates to links on side navigation', function() {
        sideBarPage.clickMFAUseCase();
        sideBarPage.waitTillURLChangedTo("/use_cases/mfa/");

        sideBarPage.clickAPIAMUserCase();
        sideBarPage.waitTillURLChangedTo("/use_cases/api_access_management/");

        sideBarPage.clickIntegrateUseCaseLink();
        sideBarPage.waitTillURLChangedTo("/use_cases/integrate_with_okta/");
    });

    it('contains sub-links on reference side navigation', function() {
        // Sub-links are shown when the user clicks on the main link on the side bar
        sideBarPage.clickGettingStartedReferenceLink();
        sideBarPage.waitTillURLChangedTo("/docs/api/getting_started/api_test_client.html");
        let expectedSubLinks = ['Getting Started With the Okta APIs', 'Getting a Token', 'Enabling CORS', 'Design Principles', 'Okta Release Lifecycle'];
        let subLinks = sideBarPage.getReferencesLinkText();
        for(let i = 0; i < expectedSubLinks.length; i++) {
            expect(subLinks).toContain(expectedSubLinks[i]);
        }

        sideBarPage.clickAuthenticationReferenceLink();
        sideBarPage.waitTillURLChangedTo("/docs/api/resources/authn.html");
        expectedSubLinks = ['Authentication API', 'OAuth 2.0', 'OpenID Connect', 'Social Authentication', 'Sessions'];
        subLinks = sideBarPage.getReferencesLinkText();
        for(let i = 0; i < expectedSubLinks.length; i++) {
            expect(subLinks).toContain(expectedSubLinks[i]);
        }

        sideBarPage.clickAPIReferenceLink();
        sideBarPage.waitTillURLChangedTo("/docs/api/resources/apps.html");
        expectedSubLinks = ['Apps', 'Events', 'Factors', 'Groups', 'Identity Providers', 'Policy', 'Admin Roles', 'Schemas API', 'System Log (Beta)', 'Templates', 'Users'];
        subLinks = sideBarPage.getReferencesLinkText();
        for(let i = 0; i < expectedSubLinks.length; i++) {
            expect(subLinks).toContain(expectedSubLinks[i]);
        }
    });
});
