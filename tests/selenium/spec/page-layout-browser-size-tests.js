const NavPage = require('../framework/page-objects/NavPage');
const util = require('../framework/shared/util');

describe('page layout and browser size tests', function() {
  const navPage = new NavPage();

  beforeEach(function() {
    browser.ignoreSynchronization = true;
    navPage.load();
  });

  it('shows the main navigation with desktop browser sizes', function() {
    // FIXME: Abstract this into a "Run this test on desktop" function.
    //        Take sizes from the CSS that we use to define sizes.
    navPage.setWindowSize(1060, 640);
    navPage.waitUntilTopNavOnScreen();
    expect(navPage.isMobileNavDisplayed()).toBeFalsy();
  });

  // Phantom does not support the CSS transform we use to hide the top nav
  util.itNoPhantom('shows mobile navigation with mobile browser sizes', function() {
    navPage.setWindowSize(360, 640);
    navPage.waitUntilTopNavOffScreen();
    expect(navPage.isMobileNavDisplayed()).toBeTruthy();
  });
});
