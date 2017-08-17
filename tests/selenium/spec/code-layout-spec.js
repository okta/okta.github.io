const CodePage = require('../framework/page-objects/CodePage');

describe('code page spec (java)', () => {
  const codePage = new CodePage('/code/java/');

  beforeEach(() => {
    codePage.load();
  });

  it('has columns in right order', () => {
    expect(codePage.hasColumns()).toBe(true);

    const expectedLinks = ['Okta SDK', 'JWT Validation Guide',
      'Android Native Application with AppAuth', 'Spring Security SAML'];

    expect(codePage.linksInOrder(expectedLinks)).toBe(true);
  });
});
