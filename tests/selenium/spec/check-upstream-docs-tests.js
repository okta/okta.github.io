describe('upstream docs string tests', function() {
  var baseUrl = 'http://localhost:4000';

  it('has authClient.signIn visible in okta-auth-js documentation', function() {
    browser.ignoreSynchronization = true
    browser.get(baseUrl + "/code/javascript/okta_auth_sdk.html");

    expect(element(by.css('#docs-body')).getText()).toContain('authClient.signIn');
  });

  it('has .renderEl visible in okta-signin-widget documentation', function() {
    browser.ignoreSynchronization = true
    browser.get(baseUrl + "/code/javascript/okta_sign-in_widget.html");

    expect(element(by.css('#docs-body')).getText()).toContain('.renderEl');
  });
});
