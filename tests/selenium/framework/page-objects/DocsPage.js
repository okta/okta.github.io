'use strict';

const BasePage = require('./BasePage');
const util = require('../shared/util');
const EC = protractor.ExpectedConditions;

class DocsPage extends BasePage {
  constructor(url) {
    super(url);
    this.pageLoadElement = $('.has-tableOfContents');
    this.h1Elements = $$('h1');
    this.h2Elements = $$('h2');
    this.h3Elements = $$('h3');
    this.h4Elements = $$('h4');
  }

  load() {
    this.get();
    return this.waitForPageLoad();
  }

  waitForPageLoad() {
    // This waits for the sidebar menu to fully finish rendering
    return util.wait(this.pageLoadElement);
  }

  hasHeader(str) {
    return EC.or(
      () => this.h1Contains(str),
      () => this.h2Contains(str),
      () => this.h3Contains(str)
    )();
  }

  h1Contains(strs) {
    return this.elementsContainText(this.h1Elements, strs);
  }

  h2Contains(strs) {
    return this.elementsContainText(this.h2Elements, strs);
  }

  h3Contains(strs) {
    return this.elementsContainText(this.h3Elements, strs);
  }

  h4Contains(strs) {
    return this.elementsContainText(this.h4Elements, strs);
  }

  clickLinkHeader(str) {
    const el = element(by.cssContainingText('h4 a', str));
    return el.click();
  }

}

module.exports = DocsPage;
