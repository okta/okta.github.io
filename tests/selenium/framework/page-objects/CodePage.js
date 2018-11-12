'use strict';

const BasePage = require('./BasePage');
const util = require('../shared/util');

class CodePage extends BasePage {
  constructor(url) {
    super(url);
    this.$pageLoad = $('.Row');
    this.$quickStart = element(by.cssContainingText('span', 'Spring Quickstart'));
    this.$sampleApp = element(by.cssContainingText('span', 'Okta Spring Boot Starter'));
    this.$createAccountButton = element(by.cssContainingText('span', 'Create Free Account'));
    this.$$promoBannerLabel = $$('.DocsPromoBanner');
    this.setPageLoad(this.$pageLoad);
  }

  hasQuickStart() {
    return this.$quickStart.isPresent();
  }

  hasSampleApp() {
    return this.$sampleApp.isPresent();
  }

  hasCreateAccountButton() {
    return this.$createAccountButton.isPresent();
  }

  hasPromoBanner() {
    return this.hasElements(this.$$promoBannerLabel);
  }
}
module.exports = CodePage;
