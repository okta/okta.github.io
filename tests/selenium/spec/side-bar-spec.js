'use strict';
const SideBarPage = require('../framework/page-objects/SideBarPage');

describe('sidebar navigation spec', () => {
  const sideBarPage = new SideBarPage();

  beforeEach(() => {
    sideBarPage.load();
    sideBarPage.resizeXLarge(); // At smaller sizes, sidebar navigation is hidden
  });

  it('has all the links for side navigation', () => {
    const expectedUseCases = ['Authentication', 'Multi-Factor Authentication',
        'API Access Management', 'Integrate with Okta'];
    expect(sideBarPage.doesUseCasesHaveLinks(expectedUseCases)).toBe(true);

    const expectedReferences = ['Getting Started', 'Authentication Reference',
        'API Reference', 'Error Codes',
        'Okta Expression Language', 'Platform Release Notes'];
    expect(sideBarPage.doesReferenceHaveLinks(expectedReferences)).toBe(true);

    const expectedStandards = ['OAuth 2.0 and Okta', 'OpenID Connect and Okta',
        'SAML', 'SCIM Provisioning with Lifecycle Management'];
    expect(sideBarPage.doesStandardsHaveLinks(expectedStandards)).toBe(true);
  });

  it('navigates to links on side navigation', () => {
    sideBarPage.clickMFAUseCase();
    expect(sideBarPage.getCurrentURL()).toBe('/use_cases/mfa/');

    sideBarPage.clickAPIAMUserCase();
    expect(sideBarPage.getCurrentURL()).toBe('/use_cases/api_access_management/');

    sideBarPage.clickIntegrateUseCaseLink();
    expect(sideBarPage.getCurrentURL()).toBe('/use_cases/integrate_with_okta/');
  });

  it('contains sub-links on reference side navigation', () => {
    // Sub-links are shown when the user clicks on the main link on the side bar
    sideBarPage.clickGettingStartedReferenceLink();
    expect(sideBarPage.getCurrentURL()).toBe('/docs/api/getting_started/api_test_client.html');
    let expectedSubLinks = ['Getting Started With the Okta APIs', 'Getting a Token',
        'Enabling CORS', 'Design Principles', 'Okta Release Lifecycle'];
    expect(sideBarPage.doesReferenceHaveLinks(expectedSubLinks)).toBe(true);

    sideBarPage.clickAuthenticationReferenceLink();
    expect(sideBarPage.getCurrentURL()).toBe('/docs/api/resources/authn.html');
    expectedSubLinks = ['Authentication API', 'OAuth 2.0',
        'OpenID Connect', 'Social Login',
        'Sessions'];
    expect(sideBarPage.doesReferenceHaveLinks(expectedSubLinks)).toBe(true);

    sideBarPage.clickAPIReferenceLink();
    expect(sideBarPage.getCurrentURL()).toBe('/docs/api/resources/apps.html');
    expectedSubLinks = ['Apps', 'Events', 'Factors',
        'Groups', 'Identity Providers', 'Policy',
        'Admin Roles', 'Schemas API',
        'System Log (Beta)', 'Templates', 'Users'];
    expect(sideBarPage.doesReferenceHaveLinks(expectedSubLinks)).toBe(true);
  });
});
