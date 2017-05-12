'use strict';

const util = require('../shared/util');
const _ = require('lodash');
const EC = protractor.ExpectedConditions;
const baseUrl = 'http://localhost:4000/';

class BasePage {
  constructor(relativeURL) {
    if(relativeURL) {
      this.url = baseUrl + relativeURL;
    } else {
      this.url = baseUrl;
    }
  }

  get() {
    browser.ignoreSynchronization = true;
    browser.get(util.formatUrl(this.url, true));
  }

  setWindowSize(width, height) {
    browser.driver.manage().window().setSize(width, height);
  }

  waitUntilOnScreen(elementFinder) {
    browser.wait(util.isOnScreen(elementFinder));
  }

  waitUntilOffScreen(elementFinder) {
    browser.wait(EC.not(util.isOnScreen(elementFinder)));
  }

  doElementsContainText(elements, expectedTextArray) {
    return elements.filter(function(element, index) {
      return element.getText().then(function(text) {
        for (var i = 0; i < expectedTextArray.length; i++) {
          if (text == expectedTextArray[i]) {
            return true;
          }
        }
      })
    }).then(function(elementList) {
      return elementList.length == expectedTextArray.length;
    })
  }
}

module.exports = BasePage;
