const QuickStartsPage = require('../framework/page-objects/QuickStartsPage');

describe('quickstarts page spec', () => {
  const quickstartsPage = new QuickStartsPage('/quickstart');

  beforeEach(() => {
    return quickstartsPage.load();
  });

  it('has okta-sign-in-page + nodejs generic selected by default', () => {
    expect(quickstartsPage.urlContains("/okta-sign-in-page/nodejs/generic")).toBe(true);

    expect(quickstartsPage.activeLinksContain([
        'Okta Sign-In Page',
        'Node JS',
        'Generic Node'
      ])).toBe(true);
  });

  xit('can select all client setups', () => {
    quickstartsPage.selectAndroid();
    expect(quickstartsPage.urlContains("/android")).toBe(true);
    expect(quickstartsPage.activeLinksContain([
        'Android',
        'Node JS',
        'Generic Node'
      ])).toBe(true);

    quickstartsPage.selectAngularClient();
    expect(quickstartsPage.urlContains("/angular")).toBe(true);
    expect(quickstartsPage.activeLinksContain([
        'Angular',
        'Node JS',
        'Generic Node'
      ])).toBe(true);

    quickstartsPage.selectiOSClient();
    expect(quickstartsPage.urlContains("/ios")).toBe(true);
    expect(quickstartsPage.activeLinksContain([
        'iOS',
        'Node JS',
        'Generic Node'
      ])).toBe(true);

    quickstartsPage.selectSignInWidget();
    expect(quickstartsPage.urlContains("/widget")).toBe(true);
    expect(quickstartsPage.activeLinksContain([
        'Sign-In Widget',
        'Node JS',
        'Generic Node'
      ])).toBe(true);
  });

  it('can select all server setups', () => {
    quickstartsPage.selectNodeJSServer()
    expect(quickstartsPage.urlContains("/nodejs/generic")).toBe(true);
    expect(quickstartsPage.activeLinksContain([
        'Node JS',
        'Generic Node'
      ])).toBe(true);

    quickstartsPage.selectJavaServer();
    expect(quickstartsPage.urlContains("/java/generic")).toBe(true);
    expect(quickstartsPage.activeLinksContain([
        'Java',
        'Generic Java'
      ])).toBe(true);

    quickstartsPage.selectPHPServer();
    expect(quickstartsPage.urlContains("/php/generic")).toBe(true);
    expect(quickstartsPage.activeLinksContain([
        'PHP',
        'Generic PHP'
      ])).toBe(true);
  });

  it('shows & selects specific frameworks for server setup', () => {
    quickstartsPage.selectNodeJSServer();
    expect(quickstartsPage.frameworkLinksContain([
        'Generic Node',
        'Express.js'
      ])).toBe(true);

    quickstartsPage.selectExpressJS();
    expect(quickstartsPage.urlContains("/nodejs/express")).toBe(true);

    quickstartsPage.selectGenericNode();
    expect(quickstartsPage.urlContains("/nodejs/generic")).toBe(true);

    quickstartsPage.selectJavaServer();
    expect(quickstartsPage.frameworkLinksContain([
        'Generic Java',
        'Spring'
    ])).toBe(true);

    quickstartsPage.selectSpring();
    expect(quickstartsPage.urlContains("/java/spring")).toBe(true);

    quickstartsPage.selectGenericJava();
    expect(quickstartsPage.urlContains("/java/generic")).toBe(true);

    quickstartsPage.selectPHPServer();
    expect(quickstartsPage.frameworkLinksContain([
        'Generic PHP',
        ])).toBe(true);
  });

  it('retains the combination selected on refresh', () => {
    quickstartsPage.selectJavaServer();
    expect(quickstartsPage.frameworkLinksContain([
        'Generic Java',
        'Spring'
    ])).toBe(true);

    quickstartsPage.refresh();

    expect(quickstartsPage.frameworkLinksContain([
        'Generic Java',
        'Spring'
    ])).toBe(true);
  });

});
