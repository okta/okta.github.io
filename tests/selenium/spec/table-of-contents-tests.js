const TableOfContentsPage = require('../framework/page-objects/TableOfContentsPage');
const SideBarPage = require('../framework/page-objects/SideBarPage');
const util = require('../framework/shared/util');

describe('table of contents navigation tests', function() {
  const tocPage = new TableOfContentsPage();
  const sideBarPage = new SideBarPage();

  beforeEach(function() {
    browser.ignoreSynchronization = true;
    tocPage.load();
    tocPage.runTestOnDesktopBrowserSize();  // At smaller sizes, table of contents is hidden
  });

  util.itNoPhantom('has basic table of contents in the documentation page', function() {
    expect(tocPage.doesLevel1ItemContain('Authentication')).toBeTruthy();

    let expectedLevel2Items = ['Introduction', 'Building apps supporting Single Sign-On', 'Building custom login experience for your application',
      'Sign-in Widget', 'Auth SDK – a lightweight Javascript-based SDK', 'Authentication APIs – REST APIs for any client', 'Social Authentication'];
    expect(tocPage.doLevel2ItemsContain(expectedLevel2Items)).toBeTruthy();
  });

  util.itNoPhantom('has table of contents with multi level items', function() {
    sideBarPage.clickMFAUseCase();
    sideBarPage.waitTillURLChangedTo("/use_cases/mfa/");

    expect(tocPage.doesLevel1ItemContain('Multi-Factor Authentication')).toBeTruthy();

    let expectedLevel2Items = ['Introduction', 'Overview of API calls used for multi-factor authentication', 'Learn more'];
    let expectedLevel3Items = ['Prerequisites'];
    expect(tocPage.doLevel2ItemsContain(expectedLevel2Items)).toBeTruthy();
    expect(tocPage.areLevel3ItemsVisible(expectedLevel3Items)).toBeTruthy();

    tocPage.clickByLinkText('Overview of API calls used for multi-factor authentication');
    tocPage.waitForLinkToBeDisplayed('Setting up your Okta org for MFA');

    expect(tocPage.areLevel3ItemsVisible(['Prerequisites'])).toBeFalsy();
    expectedLevel3Items = ['Setting up your Okta org for MFA', 'Enabling MFA in your Okta org', 'Creating an API token for your Okta org',
                         'Set up Postman', 'Test Postman', 'Create a test user', 'Adding MFA', 'Adding a factor to a user account',
                         'Enroll the factor', 'Verifying the factor']
    expect(tocPage.areLevel3ItemsVisible(expectedLevel3Items)).toBeTruthy();

    expect(tocPage.isTopOfPageLinkDisplayed()).toBeTruthy();
    tocPage.gotoTopOfPage();
    
    expect(tocPage.areLevel3ItemsVisible(['Prerequisites'])).toBeTruthy();
    expect(tocPage.areLevel3ItemsVisible(expectedLevel3Items)).toBeFalsy();
  });
});
