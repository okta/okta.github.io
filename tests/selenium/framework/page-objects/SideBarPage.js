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
    
    this.$mfaUseCaseLink = element(by.linkText('Multi-Factor Authentication'));
    this.$apiamUseCaseLink = element(by.linkText('API Access Management'));
    this.$integrateUseCaseLink = element(by.linkText('Integrate with Okta'));

    this.$gettingStartedReferenceLink = element(by.linkText('Getting Started'));
    this.$authenticationReferenceLink = element(by.linkText('Authentication Reference'));
    this.$apiReferenceLink = element(by.linkText('API Reference'));
    this.setPageLoad(this.$sideBar)
  }

  clickMFAUseCase() {
    this.$mfaUseCaseLink.click();
  }

  clickAPIAMUserCase() {
    this.$apiamUseCaseLink.click();
  }

  clickIntegrateUseCaseLink() {
    this.$integrateUseCaseLink.click();
  }

  clickGettingStartedReferenceLink() {
    this.$gettingStartedReferenceLink.click();
  }

  clickAuthenticationReferenceLink() {
    this.$authenticationReferenceLink.click();
  }
  
  clickAPIReferenceLink() {
    this.$apiReferenceLink.click();
  }

  doesUseCasesHaveLinks(links) {
    return this.elementHasLinks(this.$useCasesNav, links);
  }

  doesReferenceHaveLinks(links) {
    return this.elementHasLinks(this.$referenceNav, links);
  }
  
  doesStandardsHaveLinks(links) {
    return this.elementHasLinks(this.$standardsNav, links);
  }
}

module.exports = SideBarPage;