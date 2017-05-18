const NavPage = require('../framework/page-objects/NavPage');
const util = require('../framework/shared/util');

describe('page layout and browser size spec', function() {
  const navPage = new NavPage();

  beforeEach(function() {
    navPage.load();
  });

  it('shows the main navigation with desktop browser sizes', function() {
    navPage.resizeDesktop();
    navPage.waitUntilTopNavOnScreen();
    expect(navPage.isMobileNavDisplayed()).toBeFalsy();
  });

  // Phantom does not support the CSS transform we use to hide the top nav
  util.itNoPhantom('shows mobile navigation with mobile browser sizes', function() {
    navPage.resizeMobile();
    navPage.waitUntilTopNavOffScreen();
    expect(navPage.isMobileNavDisplayed()).toBe(true);
  });
});
