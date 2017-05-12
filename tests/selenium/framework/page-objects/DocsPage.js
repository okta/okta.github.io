'use strict';

const BasePage = require('./BasePage');
const util = require('../shared/util');

class DocsPage extends BasePage {
  constructor(url) {
    super(url);
    this.docs = $('#docs-body');
    this.h1Elements = $$('h1');
    this.h2Elements = $$('h2');
  }

  load() {
    this.get();
    return this.waitForPageLoad();
  }

  waitForPageLoad() {
    return util.wait(this.docs);
  }

  doesh1HeaderContain(header1String) {
    return this.doElementsContainText(this.h1Elements, header1String);
  }

  doesh2HeaderContain(header2Strings) {
    return this.doElementsContainText(this.h2Elements, header2Strings);
  }
}

module.exports = DocsPage;