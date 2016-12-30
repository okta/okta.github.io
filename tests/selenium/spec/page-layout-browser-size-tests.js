describe('page layout and browser size tests', function() {
  var baseUrl = 'http://localhost:4000';

  // FIXME: Put shared code in a `beforeEach` function
  it('has DOCUMENTATION visible at large sizes', function() {
    browser.ignoreSynchronization = true
    browser.get(baseUrl);
    browser.driver.manage().window().setSize(1060, 640);

    // FIXME: Try selecting the element using `:first-child`
    var topNav = element.all(by.css('#top-nav ul li'));
    expect(topNav.get(1).getText()).toEqual("DOCUMENTATION");
  });
  // FIXME: Break this into page objects
  it('does not have DOCUMENTATION visible at small sizes', function() {
    browser.ignoreSynchronization = true
    browser.get(baseUrl);
    browser.driver.manage().window().setSize(360, 640);
    
    var topNav = element.all(by.css('#top-nav ul li'));
    expect(topNav.get(1).getText()).toEqual("");
  });
  it('does not have mobile navigation visible at large sizes', function() {
    browser.ignoreSynchronization = true
    browser.get(baseUrl);
    // FIXME: Abstract this into a "Run this test on desktop" function.
    //        Take sizes from the CSS that we use to define sizes.
    browser.driver.manage().window().setSize(1060, 640);
    
    expect(element.all(by.css('#mobile-nav')).isDisplayed()).toBeTruthy();
  });
  it('has mobile navigation visible at small sizes', function() {
    browser.ignoreSynchronization = true
    browser.get(baseUrl);
    browser.driver.manage().window().setSize(360, 640);
    
    expect(element.all(by.css('#mobile-nav')).isDisplayed()).toBeTruthy();
  });
});
