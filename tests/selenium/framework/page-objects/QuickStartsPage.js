'use strict';

const BasePage = require('./BasePage');
const util = require('../shared/util');

class QuickStartsPage extends BasePage {
  constructor(url) {
    super(url);
    this.$clientSelector = $('#client-selector');
    this.$angularLink = element(by.linkText('Angular'));
    this.$iOSLink = element(by.linkText('iOS'));
    this.$siwLink = element(by.linkText('Sign-In Widget'));
    this.$nodeJSLink = element(by.linkText('Node JS'));
    this.$javaLink = element(by.linkText('Java'));
    this.$phpLink = element(by.linkText('PHP'));
    this.$genericNodeLink = element(by.linkText('Generic Node'));
    this.$expressJSLink = element(by.linkText('Express.js'));   
    this.$genericJavaLink = element(by.linkText('Generic Java'));
    this.$springLink = element(by.linkText('Spring'));
    this.$$activeLinks = $$('.active');
    this.$$frameworkLinks = $$('#framework-selector a');

    this.setPageLoad(this.$clientSelector);
  }

  selectSignInWidget() {
    return this.$siwLink.click();
  }

  selectAngularClient() {
    return this.$angularLink.click();
  }

  selectiOSClient() {
    return this.$iOSLink.click();
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
    return this.$expressJSLink.click();
  }

  selectSpring() {
    return this.$springLink.click();
  }

  selectGenericJava() {
      return this.$genericJavaLink.click();
  }

  selectGenericNode() {
      return this.$genericNodeLink.click();
  }

  activeLinksContain(links) {
    return this.elementsContainText(this.$$activeLinks, links);
  }

  frameworkLinksContain(links) {
    return this.elementsContainText(this.$$frameworkLinks, links);
  }
}
module.exports = QuickStartsPage;
