'use strict';

const BasePage = require('./BasePage');
const util = require('../shared/util');

class QuickStartsPage extends BasePage {
  constructor(url) {
    super(url);
    this.$clientSelector = $('#client-selector');
    this.$skipToServerSetup = element(by.linkText('Skip to server setup'));
    this.$clientSetupLink = $('#client_setup_link');
    this.$serverSetupLink = $('#server_setup_link');
    this.$androidLink = element(by.linkText('Android'));
    this.$angularLink = element(by.linkText('Angular'));
    this.$iOSLink = element(by.linkText('iOS'));
    this.$reactNativeLink = element(by.linkText('React Native'));
    this.$vueLink = element(by.linkText('Vue'));
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
    this.$$signInPageContentHeader = element(by.id('okta-sign-in-page-quickstart'));
    this.$$signInWidgetContentHeader = element(by.id('okta-sign-in-widget-quickstart'));
    this.$$angularContentHeader = element(by.id('okta-angular-quickstart'));
    this.$$reactContentHeader = element(by.id('okta-react-quickstart'));
    this.$$androidContentHeader = element(by.id('okta-android-quickstart'));
    this.$$iosContentHeader = element(by.id('okta-ios-quickstart'));
    this.$$nodeGenericContentHeader = element(by.id('okta-nodejs-quickstart'));
    this.$$nodeExpressContentHeader = element(by.id('okta-nodejsexpressjs-quickstart'));
    this.$$javaGenericContentHeader = element(by.id('okta-java-quickstart'));
    this.$$javaSpringExpressContentHeader = element(by.id('okta-javaspring-quickstart'));
    this.$$phpGenericContentHeader = element(by.id('okta-php-quickstart'));
    this.$$dotnetAspCoreGenericContentHeader = element(by.id('okta-aspnet-core-mvc-quickstart'));
    this.$$dotnetAsp4GenericContentHeader = element(by.id('okta-aspnet-4x-mvc-quickstart'));

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

  selectClientSetupLink() {
    return this.$clientSetupLink.click();
  }

  selectServerSetupLink() {
    return this.$serverSetupLink.click();
  }

  getSkipLink() {
    return this.$skipToServerSetup;
  }

  getNodeJSLink() {
    return this.$nodeJSLink;
  }

  selectSignInWidget() {
    return this.$siwLink.click();
  }

  selectHosted(){
    return this.$hostedLink.click();
  }

  selectAndroidClient() {
    return this.$androidLink.click();
  }

  selectAngularClient() {
    return this.$angularLink.click();
  }

  selectiOSClient() {
    return this.$iOSLink.click();
  }

  selectReactNativeClient() {
    return this.$reactNativeLink.click()
  }

  selectVueClient() {
    return this.$vueLink.click();
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

  isShowingSignInPageContent() {
    return this.$$signInPageContentHeader.isPresent();
  }

  isShowingSignInWidgetContent() {
    return this.$$signInWidgetContentHeader.isPresent();
  }

  isShowingAngularContent() {
    return this.$$angularContentHeader.isPresent();
  }

  isShowingReactContent() {
    return this.$$reactContentHeader.isPresent();
  }

  isShowingAndroidContent() {
    return this.$$androidContentHeader.isPresent();
  }

  isShowingIosContent() {
    return this.$$iosContentHeader.isPresent();
  }

  isShowingNodeGenericContent() {
    return this.$$nodeGenericContentHeader.isPresent();
  }

  isShowingNodeExpressContent() {
    return this.$$nodeExpressContentHeader.isPresent();
  }

  isShowingJavaGenericContent() {
    return this.$$javaGenericContentHeader.isPresent();
  }

  isShowingJavaSpringContent() {
    return this.$$javaSpringExpressContentHeader.isPresent();
  }

  isShowingPhpGenericContent() {
    return this.$$phpGenericContentHeader.isPresent();
  }

  isShowingDotnetAspCoreContent() {
    return this.$$dotnetAspCoreGenericContentHeader.isPresent();
  }

  isShowingDotnetAsp4Content() {
    return this.$$dotnetAsp4GenericContentHeader.isPresent();
  }

}
module.exports = QuickStartsPage;
