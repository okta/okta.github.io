const NavPage = require('../framework/page-objects/NavPage');
const util = require('../framework/shared/util');

describe('page layout and browser size spec', () => {
  const navPage = new NavPage();

  beforeEach(() => {
    navPage.load();
  });

  it('shows the main navigation with desktop browser sizes', () => {
    navPage.resizeMedium();

    expect(navPage.isDesktopNavDisplayed()).toBe(true);
    expect(navPage.isMobileNavDisplayed()).toBe(false);

  });

  // PhantomJS does not support the CSS transform we use to hide the top nav
  // Chrome headless doesn't support window resize
  util.itNoHeadless('shows mobile navigation with mobile browser sizes', () => {
    navPage.resizeXXsmall();
    expect(navPage.isMobileToggleIconDisplayed()).toBe(true);
    const mobileToggle = navPage.$mobileToggleIcon;
    mobileToggle.click();
    expect(navPage.isMobileNavDisplayed()).toBe(true);
  });
});
