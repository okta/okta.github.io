'use strict';

const BasePage = require('./BasePage');
const util = require('../shared/util');

class NavPage extends BasePage {
  constructor() {
    super();
    this.topNav = $('#top-nav');
    this.mobileNav = $('#mobile-nav');
    this.header = $('#header');
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
}

module.exports = NavPage;