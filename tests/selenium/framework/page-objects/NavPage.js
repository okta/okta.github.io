'use strict';

const BasePage = require('./BasePage');
const util = require('../shared/util');

class NavPage extends BasePage {
  constructor(url) {
    super(url);
    this.$desktopNav = $('.Header-nav.PrimaryNav');
    this.$mobileToggleIcon = $$('.PrimaryNav-toggle');
    this.$mobileNav = $$('.PrimaryNav-is-active');
    this.$header = $('header.Header');
    this.$searchIcon = $('.SearchIcon');
    this.$searchInput = $('#st-search-input-auto');
    this.$resultsBox = $('.SearchResults');
    this.$supportLink = element(by.cssContainingText('span', 'Support'));
    this.$$menus = $$('.menu');
    this.setPageLoad(this.$header);
  }

  isDesktopNavDisplayed() {
    return this.$desktopNav.isDisplayed();
  }

  isMobileNavDisplayed() {
    return this.hasElements(this.$mobileNav);
  }

  isMobileToggleIconDisplayed() {
    return this.$mobileToggleIcon.isPresent();
  }

  clickSearchIcon() {
    return this.$searchIcon.click();
  }

  enterSearchText(searchText) {
    return this.$searchInput.sendKeys(searchText);
  }

  submitSearch() {
    return this.$searchInput.sendKeys(protractor.Key.ENTER);
  }

  isSearchFieldPresent() {
    return this.$searchInput.isPresent();
  }

  areSearchResultsPresent() {
    return this.$resultsBox.isPresent();
  }

  waitForSearchResults() {
    return util.wait(this.$resultsBox);
  }

  clickSupportLink() {
    return this.$supportLink.click()
  }

  isSupportMenuDisplayed() {
    return this.$$menus.get(1).isDisplayed();
  }
}

module.exports = NavPage;
