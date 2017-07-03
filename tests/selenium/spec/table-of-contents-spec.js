'use strict';
const TableOfContentsPage = require('../framework/page-objects/TableOfContentsPage');
const SideBarPage = require('../framework/page-objects/SideBarPage');
const util = require('../framework/shared/util');

describe('table of contents navigation spec', () => {
  const tocPage = new TableOfContentsPage();
  const sideBarPage = new SideBarPage();

  beforeEach(() => {
    tocPage.load();
    tocPage.resizeXLarge();  // At smaller sizes, table of contents is hidden
  });

  it('has basic table of contents in the documentation page', () => {
    expect(tocPage.level1ItemContains('Authentication')).toBe(true);

    const expectedLevel2Items = ['Introduction', 'Building apps supporting Single Sign-On',
        'Building custom login experience for your application',
        'Sign-in Widget', 'Auth SDK – a lightweight Javascript-based SDK',
        'Authentication APIs – REST APIs for any client', 'Social Authentication'];
    expect(tocPage.level2ItemsContain(expectedLevel2Items)).toBe(true);
  });

  util.itNoHeadless('has table of contents with multi level items', () => {
    sideBarPage.clickMFAUseCase();
    expect(sideBarPage.getCurrentURL()).toBe('/use_cases/mfa/');
    expect(tocPage.level1ItemContains('Multi-Factor Authentication')).toBe(true);

    const expectedLevel2Items = ['Introduction', 'Overview of API calls used for multi-factor authentication',
        'Learn more'];
    let expectedLevel3Items = ['Prerequisites'];
    expect(tocPage.level2ItemsContain(expectedLevel2Items)).toBe(true);
    expect(tocPage.level3ItemsVisible(expectedLevel3Items)).toBe(true);

    tocPage.clickByLinkText('Overview of API calls used for multi-factor authentication');
    tocPage.waitForLinkToBeDisplayed('Setting up your Okta org for MFA');

    expect(tocPage.level3ItemsVisible(['Prerequisites'])).toBe(false);
    expectedLevel3Items = ['Setting up your Okta org for MFA', 'Enabling MFA in your Okta org',
        'Creating an API token for your Okta org', 'Set up Postman', 'Test Postman',
        'Create a test user', 'Adding MFA', 'Adding a factor to a user account',
        'Enroll the factor', 'Verifying the factor']
    expect(tocPage.level3ItemsVisible(expectedLevel3Items)).toBe(true);

    tocPage.clickByLinkText('Learn more');
    tocPage.waitForLinkToBeDisplayed('Top of Page');
    expect(tocPage.isTopOfPageLinkDisplayed()).toBe(true);
    
    tocPage.gotoTopOfPage();
    expect(tocPage.level3ItemsVisible(expectedLevel3Items)).toBe(false);
  });
});
