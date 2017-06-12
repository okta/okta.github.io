const DocsPage = require('../framework/page-objects/DocsPage');

describe('API tags check spec', () => {
  it('shows the Deprecated lifecycle tags', () => {
    const docsPage = new DocsPage('/docs/api/resources/sessions.html');
    docsPage.load();
    expect(docsPage.hasDeprecatedTags()).toBe(true);
    expect(docsPage.hasBetaTags()).toBe(false);
    expect(docsPage.hasEATags()).toBe(false);
  });

  it('shows the Beta and Early Access lifecycle tags', () => {
    const docsPage = new DocsPage('/docs/api/resources/oauth2.html');
    docsPage.load();
    // TODO - Look for beta tags in other pages. Beta tag on this page updated to EA (OKTA-124731)
    //expect(docsPage.hasBetaTags()).toBe(true);
    expect(docsPage.hasEATags()).toBe(true);
    expect(docsPage.hasDeprecatedTags()).toBe(false);
  });

  it('shows the CORS tags', () => {
    const docsPage = new DocsPage('/docs/api/getting_started/enabling_cors.html ');
    docsPage.load();
    expect(docsPage.hasCORSTags()).toBe(true);
    expect(docsPage.hasDeprecatedTags()).toBe(false);
    expect(docsPage.hasBetaTags()).toBe(false);
    expect(docsPage.hasEATags()).toBe(false);
  });

  it('shows the API URI tags', () => {
    const docsPage = new DocsPage('/docs/api/resources/sessions.html');
    docsPage.load();
    expect(docsPage.hasGetTags()).toBe(true);
    expect(docsPage.hasPostTags()).toBe(true);
    expect(docsPage.hasDeleteTags()).toBe(true);
  });
})