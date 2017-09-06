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
    this.$siwLink = element(by.linkText('Sign-In Widget'));
    this.$hostedLink = element(by.linkText('Okta Sign-In Page'));
    this.$nodeJSLink = element(by.linkText('Node JS'));
    this.$javaLink = element(by.linkText('Java'));
    this.$phpLink = element(by.linkText('PHP'));
    this.$doenetLink = element(by.linkText('.NET'));
    this.$genericNodeLink = element(by.linkText('Generic Node'));
    this.$expressJSLink = element(by.linkText('Express.js'));   
    this.$genericJavaLink = element(by.linkText('Generic Java'));
    this.$springLink = element(by.linkText('Spring'));
    this.$aspCore = element(by.linkText('ASP.NET Core'));
    this.$aspFour = element(by.linkText('ASP.NET 4.x'));
    this.$$activeLinks = $$('.active');
    this.$$frameworkLinks = $$('#framework-selector a');

    this.setPageLoad(this.$clientSelector);
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

  selectDotNet() {
    return this.$doenetLink.click();
  }

  selectDotNetCore() {
    return this.$aspCore.click();
  }

  selectDotNetFour() {
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
