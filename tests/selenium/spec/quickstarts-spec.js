const QuickStartsPage = require('../framework/page-objects/QuickStartsPage');
const util = require('../framework/shared/util');

describe('quickstarts page spec', () => {
  const quickstartsPage = new QuickStartsPage('/quickstart');

  beforeEach(() => {
    quickstartsPage.resizeMedium();
    return quickstartsPage.load();
  });

  it('has okta-sign-in-page + nodejs express selected by default', () => {
    expect(quickstartsPage.urlContains("/okta-sign-in-page/nodejs/express")).toBe(true);
    expect(quickstartsPage.activeLinksContain([
        'Okta Sign-In Page',
        'Node JS',
        'Express.js'
      ])).toBe(true);
  });

  it('can select all client setups', () => {
    quickstartsPage.selectSignInWidget();
    expect(quickstartsPage.urlContains("/widget")).toBe(true);
    expect(quickstartsPage.activeLinksContain([
        'Okta Sign-In Widget',
        'Node JS',
        'Express.js'
      ])).toBe(true);

    quickstartsPage.selectAngularClient();
    expect(quickstartsPage.urlContains("/angular")).toBe(true);
    expect(quickstartsPage.activeLinksContain([
        'Angular',
        'Node JS',
        'Express.js'
      ])).toBe(true);

    quickstartsPage.selectReactClient();
    expect(quickstartsPage.urlContains("/react")).toBe(true);
    expect(quickstartsPage.activeLinksContain([
      'React',
      'Node JS',
      'Express.js'
    ])).toBe(true);

    quickstartsPage.selectAndroid();
    expect(quickstartsPage.urlContains("/android")).toBe(true);
    expect(quickstartsPage.activeLinksContain([
        'Android',
        'Node JS',
        'Express.js'
      ])).toBe(true);

    quickstartsPage.selectiOSClient();
    expect(quickstartsPage.urlContains("/ios")).toBe(true);
    expect(quickstartsPage.activeLinksContain([
        'iOS',
        'Node JS',
        'Express.js'
      ])).toBe(true);
  });

  util.itNoHeadless('can select all server setups', () => {
    quickstartsPage.selectNodeJSServer()
    expect(quickstartsPage.urlContains("/nodejs/express")).toBe(true);
    expect(quickstartsPage.activeLinksContain([
        'Node JS',
        'Express.js'
      ])).toBe(true);

    quickstartsPage.selectJavaServer();
    expect(quickstartsPage.urlContains("/java/spring")).toBe(true);
    expect(quickstartsPage.activeLinksContain([
        'Java',
        'Spring'
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

    quickstartsPage.selectGenericPHP();
    expect(quickstartsPage.urlContains("/php/generic")).toBe(true);

    quickstartsPage.selectDotNet();
    expect(quickstartsPage.frameworkLinksContain([
      'ASP.NET Core',
      'ASP.NET 4.x'
    ])).toBe(true);

    quickstartsPage.selectDotNetCore();
    expect(quickstartsPage.urlContains("/dotnet/aspnetcore")).toBe(true);

    quickstartsPage.selectDotNetFour();
    expect(quickstartsPage.urlContains("/dotnet/aspnet4")).toBe(true);
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
