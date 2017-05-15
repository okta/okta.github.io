'use strict';

const util = require('../shared/util');
const EC = protractor.ExpectedConditions;
const baseUrl = 'http://localhost:4000';

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
    browser.get(util.formatUrl(this.url, false));
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
    return elements.filter(function(element) {
      return element.getText().then(function(text) {
        for (let i = 0; i < expectedTextArray.length; i++) {
          if (text == expectedTextArray[i]) {
            return true;
          }
        }
      })
    }).then(function(elementList) {
      return elementList.length == expectedTextArray.length;
    })
  }

  doesElementContainText(element, expectedTextArray) {
    return element.getText().then(function(text) {
      let found = true;
      for (let i = 0; i < expectedTextArray.length; i++) {
        if (text.indexOf(expectedTextArray[i]) < 0) {
          found = false;
        }
      }
      return found;
    })
  }
  
  waitTillURLChangedTo(relativeUrl) {
    browser.wait(this.urlChangedTo(baseUrl + relativeUrl), 5000);
  }

  urlChangedTo(url) {
    return function () {
      return browser.getCurrentUrl().then(function(actualUrl) {
        return url == actualUrl;
      });
    };
  };

  // FIXME: Take sizes from the CSS that we use to define sizes.
  runTestOnDesktopBrowserSize() {
    this.setWindowSize(2120, 1280);
  }

  runTestOnMobileBrowserSize() {
    this.setWindowSize(360, 640);
  }
}

module.exports = BasePage;
