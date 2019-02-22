const DocsPage = require('../framework/page-objects/DocsPage');
const CodePage = require('../framework/page-objects/CodePage');

const util = require('../framework/shared/util');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('promo banner spec', () => {
  it('shows the promo banner on docs pages', util.itHelper(async () => {
    const docsPage = new DocsPage('/docs/api/resources/sessions.html');
    docsPage.navigate();
    expect(await docsPage.hasPromoBanner(), 'expects the Promo Banner to be present').to.be.true;
  }));

  it('does not show promo banner on code pages', util.itHelper(async () => {
    const codePage = new CodePage('/code/java/');
    codePage.navigate();
    expect(await codePage.hasPromoBanner(), 'expects the Promo Banner to be present').to.be.false;
  }));
});
