const QuickStartsPage = require('../framework/page-objects/QuickStartsPage');
const util = require('../framework/shared/util');


describe('quickstarts page default selections spec', () => {

  it('selects okta-sign-in-page + nodejs + express if nothing is specified', () => {
    const quickstartsPage = new QuickStartsPage('/quickstart');
    return quickstartsPage.load().then(() => {
      expect(quickstartsPage.urlContains("/okta-sign-in-page/nodejs/express")).toBe(true);
      expect(quickstartsPage.activeLinksContain([
        'Okta Sign-In Page',
        'Node JS',
        'Express.js'
      ])).toBe(true);
    });
  });

  it('selects spring if only java is specified', () => {
    const quickstartsPage = new QuickStartsPage('/quickstart/#/okta-sign-in-page/java');
    return quickstartsPage.leave().then(() => {
      return quickstartsPage.load().then(() => {
        expect(quickstartsPage.urlContains("/okta-sign-in-page/java/spring")).toBe(true);
        expect(quickstartsPage.activeLinksContain([
          'Okta Sign-In Page',
          'Java',
          'Spring'
        ])).toBe(true);
      });
    });
  });

  it('selects express if only node is specified', () => {
    const quickstartsPage = new QuickStartsPage('/quickstart/#/okta-sign-in-page/nodejs');
    return quickstartsPage.leave().then(() => {
      return quickstartsPage.load().then(() => {
        expect(quickstartsPage.urlContains("/okta-sign-in-page/nodejs/express")).toBe(true);
        expect(quickstartsPage.activeLinksContain([
          'Okta Sign-In Page',
          'Node JS',
          'Express.js'
        ])).toBe(true);
      });
    });
  });

  it('selects ASP.NET Core if only dotnet is specified', () => {
    const quickstartsPage = new QuickStartsPage('/quickstart/#/okta-sign-in-page/dotnet');
    return quickstartsPage.leave().then(() => {
      return quickstartsPage.load().then(() => {
        expect(quickstartsPage.urlContains("/okta-sign-in-page/dotnet/aspnetcore")).toBe(true);
        expect(quickstartsPage.activeLinksContain([
          'Okta Sign-In Page',
          '.NET',
          'ASP.NET Core'
        ])).toBe(true);
      });
    });
  });
});

describe('quickstarts page navigation spec', () => {
  const quickstartsPage = new QuickStartsPage('/quickstart');

  beforeEach(() => {
    quickstartsPage.resizeMedium();
    return quickstartsPage.load();
  });

  it('can toggle to client and server setup via right-side nav', () => {
    quickstartsPage.resizeXLarge();
    quickstartsPage.waitUntilOnScreen(quickstartsPage.getSkipLink());    
    quickstartsPage.selectServerSetupLink();
    quickstartsPage.waitUntilOnScreen(quickstartsPage.getNodeJSLink());
    quickstartsPage.selectClientSetupLink();
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
