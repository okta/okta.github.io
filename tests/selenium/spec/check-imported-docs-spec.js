const DocsPage = require('../framework/page-objects/DocsPage');
const util = require('../framework/shared/util');

function setup(url) {
  const docsPage = new DocsPage(url);
  docsPage.load();
  return docsPage;
}

function setupAuthJs() {
  return setup('/code/javascript/okta_auth_sdk_external_ref');
}

function setupOSW() {
  return setup('/code/javascript/okta_sign-in_widget_ref');
}

describe('imported docs string spec', function() {

  beforeEach(() => {
    browser.ignoreSynchronization = true;
  });

  describe('Sign-In Widget', () => {
    it('removes github only sections', () => {
      const page = setupOSW();
      expect(page.hasHeader('Table of Contents')).toBe(false);
      expect(page.hasHeader('Developing the Sign-In Widget')).toBe(false);
      expect(page.hasHeader('Building the widget')).toBe(false);
    });
    it('updates headings to be one level lower (h1 -> h2, etc)', () => {
      const page = setupOSW();
      expect(page.h1Contains('Okta Sign-In Widget')).toBe(true);
      expect(page.h2Contains([
        'Install',
        'API',
        'Configuration',
        'Events'
      ])).toBe(true);
      expect(page.h3Contains([
        'Using the Okta CDN',
        'Using the npm module',
        'hide',
        'show'
      ])).toBe(true);
    });
    it('removes options from headers', () => {
      const page = setupOSW();
      expect(page.h3Contains([
        'new OktaSignIn',
        'on',
        'off',
        'session.get'
      ])).toBe(true);
    });
    it('removes OIDC headings from API headers', () => {
      const page = setupOSW();
      expect(page.h3Contains([
        'token.hasTokensInUrl',
        'token.parseTokensFromUrl',
        'tokenManager.add'
      ])).toBe(true);
    });
  });

  describe('AuthJs', () => {
    it('removes github only sections', () => {
      const page = setupAuthJs();
      expect(page.hasHeader('Table of Contents')).toBe(false);
      expect(page.hasHeader('Developing the Okta Auth Client')).toBe(false);
      expect(page.hasHeader('Building the Client')).toBe(false);
    });
    it('updates headings to be one level lower (h1 -> h2, etc)', () => {
      const page = setupAuthJs();
      expect(page.h1Contains('Introduction')).toBe(true);
      expect(page.h2Contains([
        'Install',
        'API',
        'Client Configuration',
        'OpenId Connect Options'
      ])).toBe(true);
      expect(page.h3Contains([
        'Using the Okta CDN',
        'Using the npm module',
        'transaction.status',
        'Can be in Client Configuration'
      ])).toBe(true);
    });
    it('removes options from headers', () => {
      const page = setupAuthJs();
      expect(page.h3Contains([
        'new OktaAuth',
        'signIn',
        'tx.resume',
        'session.get'
      ])).toBe(true);
    });
    util.itNoHeadless('does not break links in headers', () => {
      const page = setupAuthJs();
      page.clickLinkHeader('LOCKED_OUT');
      const authnUrl = '/docs/api/resources/authn';
      const authnPage = new DocsPage(authnUrl);
      authnPage.waitForPageLoad();
      expect(authnPage.urlContains('#show-lockout-failures')).toBe(true);
    });
  });

});
