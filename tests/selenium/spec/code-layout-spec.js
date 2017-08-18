const CodePage = require('../framework/page-objects/CodePage');

describe('code page spec (java)', () => {
  const codePage = new CodePage('/code/java/');

  beforeEach(() => {
    codePage.load();
  });

  it('has a quick start guide and sample app', () => {
    expect(codePage.hasQuickStart()).toBe(true);
    expect(codePage.hasSampleApp()).toBe(true);
  });
});
