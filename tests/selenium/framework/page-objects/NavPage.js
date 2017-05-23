'use strict';

const BasePage = require('./BasePage');
const util = require('../shared/util');

class NavPage extends BasePage {
  constructor() {
    super();
    this.$topNav = $('#top-nav');
    this.$mobileNav = $('#mobile-nav');
    this.$header = $('#header');
    this.$searchIcon = $('.SearchIcon');
    this.$searchInput = $('input#q');
    this.$resultsBox = $('.gsc-resultsbox-visible');
    this.$mobileSearch = $('#mobile-search');
    this.$mobileSearchInput = $('#gsc-i-id1');
    this.setPageLoad(this.$header);
  }

  waitUntilTopNavOnScreen() {
    this.waitUntilOnScreen(this.$topNav);
  }

  waitUntilTopNavOffScreen() {
    this.waitUntilOffScreen(this.$topNav);
  }

  isMobileNavDisplayed() {
    return this.$mobileNav.isDisplayed();
  }

  clickSearchIcon() {
    return this.$searchIcon.click();
  }

  clickMobileSearch() {
    return this.$mobileSearch.click();
  }

  enterMobileSearchText(searchText) {
    return this.$mobileSearchInput.sendKeys(searchText);
  }

  enterSearchText(searchText) {
    return this.$searchInput.sendKeys(searchText);
  }

  submitSearch() {
    return this.$searchInput.sendKeys(protractor.Key.ENTER);
  }

  areSearchResultsPresent() {
    return this.$resultsBox.isPresent();
  }

  waitForSearchResults() {
    return util.wait(this.$resultsBox);
  }

  submitMobileSearch() {
    return this.$mobileSearchInput.sendKeys(protractor.Key.ENTER);
  }
}

module.exports = NavPage;