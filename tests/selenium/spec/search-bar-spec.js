const NavPage = require('../framework/page-objects/NavPage');
const util = require('../framework/shared/util');

describe('navigation bar search spec', () => {
  const navPage = new NavPage();

  beforeEach(() => {
    navPage.load();
  });

  // Disabled in chrome headless due to chromedriver bug - https://bugs.chromium.org/p/chromedriver/issues/detail?id=1772
  util.itNoHeadless('does search on desktop browser sizes', () => {
    navPage.resizeXLarge();
    // After resize it's better to call load() which waits for the presence of a page element
    // Sometimes, the searchIcon isn't present immediately after resize
    navPage.load();
    
    navPage.clickSearchIcon();
    expect(navPage.areSearchResultsPresent()).toBe(false);

    navPage.enterSearchText('Authentication');
    navPage.submitSearch();

    // Search results are not immediately available. We need this wait for a short period
    navPage.waitForSearchResults();
    expect(navPage.areSearchResultsPresent()).toBe(true);
  });

  util.itNoHeadless('does search on mobile browser sizes', () => {
    navPage.resizeXsmall();

    navPage.clickMobileSearch();
    expect(navPage.areSearchResultsPresent()).toBe(false);

    navPage.enterMobileSearchText('Authentication');
    navPage.submitMobileSearch();

    expect(navPage.areSearchResultsPresent()).toBe(true);
  });
});
