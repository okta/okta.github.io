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
    expect(navPage.getCurrentURL()).toBe('/search/#stq=Authentication');
    expect(navPage.areSearchResultsPresent()).toBe(true);
  });

  // We do not need to test mobile search.
  // The selector and user experience is the same as desktop
  // util.itNoHeadless('does search on mobile browser sizes', () => {
  //   navPage.resizeXXsmall();

  //   navPage.clickMobileSearch();
  //   expect(navPage.areSearchResultsPresent()).toBe(false);

  //   navPage.enterMobileSearchText('Authentication');
  //   navPage.submitMobileSearch();

  //   expect(navPage.areSearchResultsPresent()).toBe(true);
  // });
});
