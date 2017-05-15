'use strict';

const BasePage = require('./BasePage');
const util = require('../shared/util');

class TableOfContentsPage extends BasePage {
  constructor(url) {
    let relativeUrl = '/use_cases/authentication/';
    super(relativeUrl);
    this.tableOfContents = $('.TableOfContents');
    this.level1Item = $('.TableOfContents-item.is-level1');
    this.level2Items = $$('.TableOfContents-item.is-level2');
    this.level3Items = $$('.TableOfContents-item.is-level3');
    this.topOfPage = element(by.linkText('Top of Page'));
  }

  load() {
    this.get();
    return this.waitForPageLoad();
  }

  waitForPageLoad() {
    return util.wait(this.tableOfContents);
  }
  
  doesLevel1ItemContain(expectedText) {
    return this.level1Item.getText().then(function(text) {
      return text == expectedText;
    })
  }

  doLevel2ItemsContain(expectedTextArray) {
    return this.doElementsContainText(this.level2Items, expectedTextArray);
  }
  
  areLevel3ItemsVisible(expectedTextArray) {
    return this.level3Items.filter(function(element) {
      return element.getText().then(function(text) {
        for (let i = 0; i < expectedTextArray.length; i++) {
          if (text == expectedTextArray[i] && element.isDisplayed()) {
            return true;
          }
        }
      })
    }).then(function(elementList) {
      return elementList.length == expectedTextArray.length;
    })
  }
  
  clickByLinkText(linkText) {
    let linkItem = this.tableOfContents.element(by.linkText(linkText));
    return linkItem.click();
  }

  isTopOfPageLinkDisplayed() {
    return this.topOfPage.isDisplayed();
  }

  gotoTopOfPage() {
    return this.topOfPage.click();
  }

  waitForLinkToBeDisplayed(linkText) {
    let linkItem = this.tableOfContents.element(by.linkText(linkText));
    return util.wait(linkItem);
  }
}

module.exports = TableOfContentsPage;
