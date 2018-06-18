const DocsPage = require('../framework/page-objects/DocsPage');
const CodePage = require('../framework/page-objects/CodePage');

describe('promo banner spec', () => {
  it('shows the promo banner on docs pages', () => {
    const docsPage = new DocsPage('/docs/api/resources/sessions.html');
    docsPage.load();
    expect(docsPage.hasPromoBanner()).toBe(true);
  });

  it('does not show promo banner on code pages', () => {
    const codePage = new CodePage('/code/java/');
    codePage.load();
    expect(codePage.hasPromoBanner()).toBe(false);
  });
})
