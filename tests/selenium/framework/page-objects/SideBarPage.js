'use strict';

const BasePage = require('./BasePage');
const util = require('../shared/util');

class SideBarPage extends BasePage {
  constructor() {
    const relativeUrl = '/use_cases/authentication/';
    super(relativeUrl);
    this.$sideBar = $('.Sidebar');
    this.$$sideBarNav = $$('.Sidebar-nav');
    this.$useCasesNav = this.$$sideBarNav.get(0);
    this.$referenceNav = this.$$sideBarNav.get(1);
    this.$standardsNav = this.$$sideBarNav.get(2);

    this.$authenticationReferenceLink = element(by.linkText('Authentication API'));
    this.$apiReferenceLink = element(by.linkText('Management API'));

    this.$$sideBarReferences = $$('#Sidebar_References li.is-active');
    this.$$sideBarResources = $$('#Sidebar_Resources li.is-active');

    this.$$useCasesLinks = this.$useCasesNav.all(By.tagName('li'));
    this.$$referenceLinks = this.$referenceNav.all(By.tagName('li'));
    this.$$standardsLinks = this.$standardsNav.all(By.tagName('li'));
    this.setPageLoad(this.$sideBar)
  }

  clickAuthenticationReferenceLink() {
    this.$authenticationReferenceLink.click();
  }
  
  clickAPIReferenceLink() {
    this.$apiReferenceLink.click();
  }

  useCasesHasLinks() {
    // We check if 'Use Cases' section has at least 1 link. We can enhance this in the future to check for a specific number of links
    return this.$$useCasesLinks.count().then(count => count > 0);
  }

  authenticationReferenceHasLinks() {
    return this.$$sideBarReferences.count().then(count => count > 0);
  }

  APIReferenceHasLinks() {
    return this.$$sideBarResources.count().then(count => count > 0);
  }

  referenceHasLinks() {
    // We check if 'References' section has at least 1 link. We can enhance this in the future to check for a specific number of links
    return this.$$referenceLinks.count().then(count => count > 0);
  }

  standardsHasLinks() {
    // We check if 'Standards' section has at least 1 link. We can enhance this in the future to check for a specific number of links
    return this.$$standardsLinks.count().then(count => count > 0);
  }
}

module.exports = SideBarPage;