'use strict';

const BasePage = require('./BasePage');
const util = require('../shared/util');

class SideBarPage extends BasePage {
  constructor() {
    let relativeUrl = '/use_cases/authentication/';
    super(relativeUrl);
    this.sideBar = $('.Sidebar');
    this.sideBarNavs = $$('.Sidebar-nav');
    this.useCasesNav = this.sideBarNavs.get(0);
    this.referenceNav = this.sideBarNavs.get(1);
    this.standardsNav = this.sideBarNavs.get(2);
    
    this.mfaUseCaseLink = element(by.linkText('Multi-Factor Authentication'));
    this.apiamUseCaseLink = element(by.linkText('API Access Management'));
    this.integrateUseCaseLink = element(by.linkText('Integrate with Okta'));

    this.gettingStartedReferenceLink = element(by.linkText('Getting Started'));
    this.authenticationReferenceLink = element(by.linkText('Authentication Reference'));
    this.apiReferenceLink = element(by.linkText('API Reference'));
  }

  load() {
    this.get();
    return this.waitForPageLoad();
  }

  waitForPageLoad() {
    return util.wait(this.sideBar);
  }
  
  clickMFAUseCase() {
    this.mfaUseCaseLink.click();
  }

  clickAPIAMUserCase() {
    this.apiamUseCaseLink.click();
  }

  clickIntegrateUseCaseLink() {
    this.integrateUseCaseLink.click();
  }

  clickGettingStartedReferenceLink() {
    this.gettingStartedReferenceLink.click();
  }

  clickAuthenticationReferenceLink() {
    this.authenticationReferenceLink.click();
  }
  
  clickAPIReferenceLink() {
    this.apiReferenceLink.click();
  }

  getUseCasesLinkText() {
    return this.useCasesNav.getText();
  }

  getReferencesLinkText() {
    return this.referenceNav.getText();
  }

  getStandardsLinkText() {
    return this.standardsNav.getText();
  }
}

module.exports = SideBarPage;