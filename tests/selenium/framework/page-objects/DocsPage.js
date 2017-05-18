'use strict';

const BasePage = require('./BasePage');
const util = require('../shared/util');
const EC = protractor.ExpectedConditions;

class DocsPage extends BasePage {
  constructor(url) {
    super(url);
    this.$page = $('.has-tableOfContents');
    this.$$h1 = $$('h1');
    this.$$h2 = $$('h2');
    this.$$h3 = $$('h3');
    this.setPageLoad(this.$page);
  }

  hasHeader(str) {
    return EC.or(
      () => this.h1Contains(str),
      () => this.h2Contains(str),
      () => this.h3Contains(str)
    )();
  }

  h1Contains(strs) {
    return this.elementsContainText(this.$$h1, strs);
  }

  h2Contains(strs) {
    return this.elementsContainText(this.$$h2, strs);
  }

  h3Contains(strs) {
    return this.elementsContainText(this.$$h3, strs);
  }

  clickLinkHeader(str) {
    const el = element(by.cssContainingText('h4 a', str));
    return el.click();
  }

}

module.exports = DocsPage;
