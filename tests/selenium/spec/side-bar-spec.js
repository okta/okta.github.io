'use strict';
const SideBarPage = require('../framework/page-objects/SideBarPage');

describe('sidebar navigation spec', () => {
  const sideBarPage = new SideBarPage();

  beforeEach(() => {
    sideBarPage.load();
    sideBarPage.resizeXLarge(); // At smaller sizes, sidebar navigation is hidden
  });

  it('has links in side navigation', () => {
    expect(sideBarPage.useCasesHasLinks()).toBe(true);
    expect(sideBarPage.referenceHasLinks()).toBe(true);
    expect(sideBarPage.standardsHasLinks()).toBe(true);
  });

  it('contains sub-links on reference side navigation', () => {
    // Sub-links are shown when the user clicks on the main link on the side bar
    sideBarPage.clickAuthenticationReferenceLink();
    expect(sideBarPage.getCurrentURL()).toBe('/docs/api/resources/authn.html');
    expect(sideBarPage.authenticationReferenceHasLinks()).toBe(true);
    expect(sideBarPage.APIReferenceHasLinks()).toBe(false);

    sideBarPage.clickAPIReferenceLink();
    expect(sideBarPage.getCurrentURL()).toBe('/docs/api/resources/apps.html');
    expect(sideBarPage.authenticationReferenceHasLinks()).toBe(false);
    expect(sideBarPage.APIReferenceHasLinks()).toBe(true);
  });
});
