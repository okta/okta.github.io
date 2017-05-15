'use strict';

const BasePage = require('./BasePage');
const util = require('../shared/util');

class NavPage extends BasePage {
  constructor() {
    super();
    this.topNav = $('#top-nav');
    this.mobileNav = $('#mobile-nav');
    this.header = $('#header');
    this.searchIcon = $('.SearchIcon');
    this.searchInput = $('input#q');
    this.resultsBox = $('.gsc-resultsbox-visible');
    this.mobileToggle = $('#mobile-open');
    this.mobileNavActive = $('.mobile-nav-active')
  }

  load() {
    this.get();
    return this.waitForPageLoad();
  }

  waitForPageLoad() {
    return util.wait(this.header);
  }

  waitUntilTopNavOnScreen() {
    this.waitUntilOnScreen(this.topNav);
  }

  waitUntilTopNavOffScreen() {
    this.waitUntilOffScreen(this.topNav);
  }
  
  isMobileNavDisplayed() {
    return this.mobileNav.isDisplayed();
  }

  clickSearchIcon() {
    util.waitTillClickable(this.searchIcon);
    return this.searchIcon.click();
  }
  
  enterSearchText(searchText) {
    util.wait(this.searchInput);
    return this.searchInput.sendKeys(searchText);
  }

  submitSearch() {
    util.wait(this.searchInput);
    return this.searchInput.sendKeys(protractor.Key.ENTER);
  }
  
  areSearchResultsPresent() {
    return this.resultsBox.isPresent();
  }
  
  clickMobileToggle() {
    return this.mobileToggle.click();
  }

  isMobileNavActive() {
    return this.mobileNavActive.isPresent();
  }
}

module.exports = NavPage;