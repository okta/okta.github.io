'use strict';
const SideBarPage = require('../framework/page-objects/SideBarPage');
const util = require('../framework/shared/util');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('sidebar navigation spec', () => {
  const sideBarPage = new SideBarPage('/use_cases/authentication/');

  beforeEach(util.itHelper(async () => {
    sideBarPage.navigate();
    sideBarPage.resizeXLarge(); // At smaller sizes, sidebar navigation is hidden
  }));

  it('has links in side navigation', util.itHelper(async () => {
    await sideBarPage.waitForPresence(sideBarPage.getUseCasesNav());
    // We check if each section has at least 1 link. We can enhance this in the future to check for a specific number of links
    expect(await sideBarPage.getUseCaseLinkCount(), 'expects Use Case Link count to be > 0').to.be.greaterThan(0);
    expect(await sideBarPage.getReferencesLinkCount(), 'expects References Link count to be > 0').to.be.greaterThan(0);
    expect(await sideBarPage.getStandardsLinkCount(), 'expects Standards Link count to be > 0').to.be.greaterThan(0);
  }));

  it('contains sub-links on reference side navigation', util.itHelper(async () => {
    // Sub-links are shown when the user clicks on the main link on the side bar
    sideBarPage.clickAuthenticationReferenceLink();
    await sideBarPage.waitForPresence(sideBarPage.getSideBarReferences());
    expect(await sideBarPage.getCurrentURL()).to.equal(SideBarPage.getAuthReferenceUrl());
    expect(await sideBarPage.getAuthReferenceLinkCount(), 'expects Auth Reference Link count to be > 0').to.be.greaterThan(0);
    expect(await sideBarPage.getApiReferenceLinkCount(), 'expects API Reference Link count to be = 0').to.be.equal(0);

    sideBarPage.clickApiReferenceLink();
    await sideBarPage.waitForPresence(sideBarPage.getSideBarResources());
    expect(await sideBarPage.getCurrentURL()).to.equal(SideBarPage.getApiReferenceUrl());
    expect(await sideBarPage.getAuthReferenceLinkCount(), 'expects Auth Reference Link count to be = 0').to.be.equal(0);
    expect(await sideBarPage.getApiReferenceLinkCount(), 'expects API Reference Link count to be > 0').to.be.greaterThan(0);
  }));
});
