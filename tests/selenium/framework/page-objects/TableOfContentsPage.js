'use strict';

const BasePage = require('./BasePage');
const util = require('../shared/util');

class TableOfContentsPage extends BasePage {
  constructor(url) {
    const relativeUrl = '/test_page';
    super(relativeUrl);
    this.$tableOfContents = $('.TableOfContents');
    this.$level1Item = $('.TableOfContents-item.is-level1');
    this.$$level2Item = $$('.TableOfContents-item.is-level2');
    this.$$level3Item = $$('.TableOfContents-item.is-level3');
    this.$$level4Item = $$('.TableOfContents-item.is-level4');
    this.$topOfPage = element(by.linkText('Top of Page'));
    this.setPageLoad(this.$tableOfContents);
  }
  
  level1ItemContains(expectedText) {
    return this.$level1Item.getText().then(text => (text == expectedText));
  }

  level2ItemsContain(expectedTextArray) {
    return this.elementsContainText(this.$$level2Item, expectedTextArray);
  }
  
  level3ItemsVisible(expectedTextArray) {
    return this.$$level3Item.filter(element => {
      return element.getText().then(text => {
        for (let i = 0; i < expectedTextArray.length; i++) {
          if (text == expectedTextArray[i] && element.isDisplayed()) {
            return true;
          }
        }
      })
    }).then(elementList => (elementList.length == expectedTextArray.length));
  }

  level4ItemsVisible(expectedTextArray) {
    return this.$$level4Item.filter(element => {
      return element.getText().then(text => {
        for (let i = 0; i < expectedTextArray.length; i++) {
          if (text == expectedTextArray[i] && element.isDisplayed()) {
            return true;
          }
        }
      })
    }).then(elementList => (elementList.length == expectedTextArray.length));
  }
  
  clickByLinkText(linkText) {
    const linkItem = this.$tableOfContents.element(by.linkText(linkText));
    return linkItem.click();
  }

  isTopOfPageLinkDisplayed() {
    return this.$topOfPage.isDisplayed();
  }

  gotoTopOfPage() {
    return this.$topOfPage.click();
  }

  waitForLinkToBeDisplayed(linkText) {
    const linkItem = this.$tableOfContents.element(by.linkText(linkText));
    return util.wait(linkItem);
  }
}

module.exports = TableOfContentsPage;
