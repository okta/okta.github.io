const EC = protractor.ExpectedConditions;

function isOnScreen(elementFinder) {
  return () => {
    const location = elementFinder.getLocation();
    const size = elementFinder.getSize();
    return Promise.all([location, size]).then((args) => {
      const pos = args[0];
      const dim = args[1];
      return dim.width + pos.x > 0 && dim.height + pos.y > 0;
    });
  };
}

function itNoPhantom(desc, fn) {
  if (process.env.PHANTOMJS) {
    xit(desc, fn);
  } else {
    it(desc, fn);
  }
}

describe('page layout and browser size tests', function() {

  beforeEach(() => {
    browser.ignoreSynchronization = true;
    browser.get('http://localhost:4000');
  });

  it('shows the main navigation with desktop browser sizes', function() {
    browser.driver.manage().window().setSize(1060, 640);
    browser.wait(isOnScreen($('#top-nav')));
    expect($('#mobile-nav').isDisplayed()).toBeFalsy();
  });

  // Phantom does not support the CSS transform we use to hide the top nav
  itNoPhantom('shows mobile navigation with mobile browser sizes', function() {
    browser.driver.manage().window().setSize(360, 640);
    browser.wait(EC.not(isOnScreen($('#top-nav'))));
    expect($('#mobile-nav').isDisplayed()).toBeTruthy();
  });

});
