'use strict';

const util = require('../shared/util');
const EC = protractor.ExpectedConditions;
const baseUrl = 'http://localhost:4000';

class BasePage {
  constructor(relativeURL) {
    this.$pageLoad = null;
    if(relativeURL) {
      this.url = baseUrl + relativeURL;
    } else {
      this.url = baseUrl;
    }
  }

  setPageLoad(element) {
    this.$pageLoad = element;
  }

  load() {
    browser.ignoreSynchronization = true;
    browser.get(this.url);
    return this.waitForPageLoad();
  }

  waitForPageLoad() {
    return util.wait(this.$pageLoad);
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

  elementsContainText(elements, expectedTextArray) {
    if (!Array.isArray(expectedTextArray)) {
      expectedTextArray = [expectedTextArray];
    }
    return elements.filter((element, index) => {
      return element.getText().then((text) => {
        return expectedTextArray.indexOf(text) > -1;
      });
    }).then((elementList) => {
      return elementList.length == expectedTextArray.length;
    })
  }

  elementHasLinks(element, expectedTextArray) {
    if (!Array.isArray(expectedTextArray)) {
      expectedTextArray = [expectedTextArray];
    }

    return element.getText().then((text) => {
      for(let i = 0; i < expectedTextArray.length; i++) {
        if (text.indexOf(expectedTextArray[i]) < 0) {
          return false;
        }
      }
      return true;
    });
  }

  urlContains(str) {
    return EC.urlContains(str)();
  }

  getCurrentURL() {
    return browser.getCurrentUrl().then(url => url.replace(baseUrl, ''));
  }
  
  // These are values used in css for managing different browser sizes -
  // max-width: 1599px -> xxLarge
  // max-width: 1399px -> xLarge
  // max-width: 1199px -> large
  // max-width: 1023px -> medium
  // max-width: 899px -> mediumSmall
  // max-width: 767px -> small
  // max-width: 479px -> xSmall
  // max-width: 319px -> xxSmall
  resizeMedium() {
    if (!process.env.CHROME_HEADLESS) {
      browser.driver.manage().window().setSize(1060, 640);
    }
  }

  resizeXsmall() {
    if (!process.env.CHROME_HEADLESS) {
      browser.driver.manage().window().setSize(480, 640);
    }
  }

  resizeXLarge() {
    if (!process.env.CHROME_HEADLESS) {
      browser.driver.manage().window().setSize(1560, 840);
    }
  }

  hasElements(elements) {
    return elements.then(element => element.length > 0);
  }
}

module.exports = BasePage;
