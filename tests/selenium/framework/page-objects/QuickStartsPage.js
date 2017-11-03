'use strict';

const BasePage = require('./BasePage');
const util = require('../shared/util');

class QuickStartsPage extends BasePage {
  constructor(url) {
    super(url);
    this.$clientSelector = $('#client-selector');
    this.$androidLink = element(by.linkText('Android'));
    this.$angularLink = element(by.linkText('Angular'));
    this.$iOSLink = element(by.linkText('iOS'));
    this.$siwLink = element(by.linkText('Okta Sign-In Widget'));
    this.$reactLink = element(by.linkText('React'));
    this.$hostedLink = element(by.linkText('Okta Sign-In Page'));
    this.$nodeJSLink = element(by.linkText('Node JS'));
    this.$javaLink = element(by.linkText('Java'));
    this.$phpLink = element(by.linkText('PHP'));
    this.$dotnetLink = element(by.linkText('.NET'));
    this.$genericNodeLink = element(by.linkText('Generic Node'));
    this.$expressJSLink = element(by.linkText('Express.js'));
    this.$genericJavaLink = element(by.linkText('Generic Java'));
    this.$genericPHPLink = element(by.linkText('Generic PHP'));
    this.$springLink = element(by.linkText('Spring'));
    this.$aspCore = element(by.linkText('ASP.NET Core'));
    this.$aspFour = element(by.linkText('ASP.NET 4.x'));
    this.$$activeLinks = $$('.active');
    this.$$frameworkLinks = $$('#framework-selector a');

    this.setPageLoad(this.$clientSelector);
  }

  /**
   * In order to test default selections, we need to leave the page and then come back.
   * Why? Because changing the URL fragment in-page will not cause the quickstart app's
   * main() function to re-run, which is what we want to test.  We want to test when
   * the app is bootstrapped with specific URL fragments.
   */
  leave() {
    browser.ignoreSynchronization = true;
    // Remove the quickstart URL, navigate back to the root of the site
    browser.get(this.url.replace(/\/quickstart\/.*/,'/'));
    return browser.sleep(1000);
  }

  selectSignInWidget() {
    return this.$siwLink.click();
  }

  selectHosted(){
    return this.$hostedLink.click();
  }

  selectAndroid() {
    return this.$androidLink.click();
  }

  selectAngularClient() {
    return this.$angularLink.click();
  }

  selectiOSClient() {
    return this.$iOSLink.click();
  }

  selectReactClient() {
    return this.$reactLink.click();
  }

  selectNodeJSServer() {
    return this.$nodeJSLink.click();
  }

  selectJavaServer() {
    return this.$javaLink.click();
  }

  selectPHPServer() {
    return this.$phpLink.click();
  }

  selectExpressJS() {
    this.waitForPresence(this.$expressJSLink);
    return this.$expressJSLink.click();
  }

  selectSpring() {
    this.waitForPresence(this.$springLink);
    return this.$springLink.click();
  }

  selectGenericJava() {
    this.waitForPresence(this.$genericJavaLink);
    return this.$genericJavaLink.click();
  }

  selectGenericPHP() {
    this.waitForPresence(this.$genericPHPLink);
    return this.$genericPHPLink.click();
}

  selectGenericNode() {
    this.waitForPresence(this.$genericNodeLink);
    return this.$genericNodeLink.click();
  }

  selectDotNet() {
    return this.$dotnetLink.click();
  }

  selectDotNetCore() {
    this.waitForPresence(this.$aspCore);
    return this.$aspCore.click();
  }

  selectDotNetFour() {
    this.waitForPresence(this.$aspFour);
    return this.$aspFour.click();
  }

  activeLinksContain(links) {
    return this.elementsContainText(this.$$activeLinks, links);
  }

  frameworkLinksContain(links) {
    return this.elementsContainText(this.$$frameworkLinks, links);
  }
}
module.exports = QuickStartsPage;
