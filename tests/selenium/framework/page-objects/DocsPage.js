'use strict';

const BasePage = require('./BasePage');
const util = require('../shared/util');
const EC = protractor.ExpectedConditions;

class DocsPage extends BasePage {
  constructor(url) {
    super(url);
    this.$pageLoad = $('.has-tableOfContents');
    this.$$h1 = $$('h1');
    this.$$h2 = $$('h2');
    this.$$h3 = $$('h3');

    this.$$deprecatedLabel = $$('.api-label-deprecated');
    this.$$betaLabel = $$('.api-label-beta');
    this.$$eaLabel = $$('.api-label-ea');
    this.$$corsLabel = $$('.api-label-cors');
    this.$$getLabel = $$('.api-uri-get');
    this.$$postLabel = $$('.api-uri-post');
    this.$$deleteLabel = $$('.api-uri-delete');
    this.$$promoBannerLabel = $$('.DocsPromoBanner');

    this.setPageLoad(this.$pageLoad);
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

  hasDeprecatedTags() {
    return this.hasElements(this.$$deprecatedLabel);
  }

  hasBetaTags() {
    return this.hasElements(this.$$betaLabel);
  }

  hasEATags() {
    return this.hasElements(this.$$eaLabel);
  }

  hasCORSTags() {
    return this.hasElements(this.$$corsLabel);
  }

  hasGetTags() {
    return this.hasElements(this.$$getLabel);
  }

  hasPostTags() {
    return this.hasElements(this.$$postLabel);
  }

  hasDeleteTags() {
    return this.hasElements(this.$$deleteLabel);
  }

  hasPromoBanner() {
    return this.hasElements(this.$$promoBannerLabel);
  }
}

module.exports = DocsPage;
