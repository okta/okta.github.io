const DocsPage = require('../framework/page-objects/DocsPage');

describe('API tags check spec', () => {
  it('shows the Beta, Early Access and Deprecated lifecycle tags', () => {
    const docsPage = new DocsPage('/docs/api/getting_started/releases-at-okta.html');
    docsPage.load();
    expect(docsPage.hasBetaTags()).toBe(true);
    expect(docsPage.hasEATags()).toBe(true);
    expect(docsPage.hasDeprecatedTags()).toBe(true);
  });

  it('shows the CORS tags', () => {
    const docsPage = new DocsPage('/docs/api/getting_started/enabling_cors.html ');
    docsPage.load();
    expect(docsPage.hasCORSTags()).toBe(true);
  });

  it('shows the API URI tags', () => {
    const docsPage = new DocsPage('/docs/api/resources/sessions.html');
    docsPage.load();
    expect(docsPage.hasGetTags()).toBe(true);
    expect(docsPage.hasPostTags()).toBe(true);
    expect(docsPage.hasDeleteTags()).toBe(true);
  });
})