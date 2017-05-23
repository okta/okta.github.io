'use strict';

const BasePage = require('./BasePage');
const util = require('../shared/util');

class CodePage extends BasePage {
  constructor(url) {
    super(url);
    this.$pageLoad = $('.Row');
    this.$$codeColumn = $$('.Column--4');
    this.$$columnHeader = $$('h3.h4');
    this.setPageLoad(this.$pageLoad);
  }

  hasColumns() {
    return this.hasElements(this.$$codeColumn);
  }

  linksInOrder(expectedLinks) {
    return this.$$columnHeader.filter((element, index) => {
      return element.getText().then(text => text == expectedLinks[index]);
    }).then(elementList => elementList.length == expectedLinks.length);
  }
}
module.exports = CodePage;
