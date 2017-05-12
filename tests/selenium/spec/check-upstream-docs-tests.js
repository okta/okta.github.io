const DocsPage = require('../framework/page-objects/DocsPage');

describe('upstream docs string tests', function() {
  beforeEach(function() {
    browser.ignoreSynchronization = true;
  });

  it('has headers visible in okta-auth-js documentation', function() {
    let docsPage = new DocsPage('/code/javascript/okta_auth_sdk.html');
    docsPage.load();
    expect(docsPage.doesh1HeaderContain(['Overview'])).toBeTruthy();
    let header2Strings = ['Prerequisites', 'Installation', 'Authentication Flow'];
    expect(docsPage.doesh2HeaderContain(header2Strings)).toBeTruthy();
  });

  it('has headers visible in okta-signin-widget documentation', function() {
    let docsPage = new DocsPage('/code/javascript/okta_sign-in_widget.html');
    docsPage.load();
    expect(docsPage.doesh1HeaderContain(['Overview'])).toBeTruthy();
    let header2Strings = ['A simple example', 'An in-depth example', 'Customization'];
    expect(docsPage.doesh2HeaderContain(header2Strings)).toBeTruthy();
  });
});
