const DocsPage = require('../framework/page-objects/DocsPage');
const util = require('../framework/shared/util');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('API tags check spec', () => {
  const docsPage = new DocsPage('/documentation');

  it('shows the Beta, Early Access, and Deprecated lifecycle tags', util.itHelper(async () => {
    docsPage.navigate('/docs/api/getting_started/releases-at-okta.html');
    expect(await docsPage.hasBetaTags(), 'expects Beta tag to be present on page').to.be.true;
    expect(await docsPage.hasEATags(), 'expects EA tag to be present on page').to.be.true;
    expect(await docsPage.hasDeprecatedTags(), 'expects Deprecated tag to be present on page').to.be.true;
  }));

  it('shows the CORS tags', util.itHelper (async () => {
    docsPage.navigate('/docs/api/getting_started/enabling_cors.html');
    expect(await docsPage.hasCORSTags(), 'expects CORS tag to be present on page').to.be.true;
  }));

  it('shows the API URI tags', util.itHelper(async () => {
    docsPage.navigate('/docs/api/resources/sessions.html');
    expect(await docsPage.hasGetTags(), 'expects GET tag to be present on page').to.be.true;
    expect(await docsPage.hasPostTags(), 'expects POST tag to be present on page').to.be.true;
    expect(await docsPage.hasDeleteTags(), 'expects DELETE tag to be present on page').to.be.true;
  }));
});
