const QuickStartsPage = require('../framework/page-objects/QuickStartsPage');
const util = require('../framework/shared/util');

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                   *
 *        DO NOT Remove or disable these tests.                      *
 *                                                                   *
 * These URLs are linked to directly from the Developer Dashboard.   *
 *                                                                   *
 * Changing any of the following links will result in broken links:  *
 *   - quickstart/#/android                                          *
 *   - quickstart/#/angular                                          *
 *   - quickstart/#/ios                                              *
 *   - quickstart/#/okta-sign-in-page/java                           *
 *   - quickstart/#/okta-sign-in-page/dotnet                         *
 *   - quickstart/#/okta-sign-in-page/nodejs                         *
 *   - quickstart/#/okta-sign-in-page/php                            *
 *   - quickstart/#/react                                            *
 *                                                                   *
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

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

    quickstartsPage.selectAndroidClient();
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

    quickstartsPage.selectReactNativeClient();
    expect(quickstartsPage.urlContains("/react-native")).toBe(true);
    expect(quickstartsPage.activeLinksContain([
        'React Native',
        'Node JS',
        'Express.js'
    ])).toBe(true);

    quickstartsPage.selectVueClient();
    expect(quickstartsPage.urlContains("/vue")).toBe(true);
    expect(quickstartsPage.activeLinksContain([
        'Vue',
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

describe('quickstart page content spec', () => {
  const quickstartsPage = new QuickStartsPage('/quickstart');

  beforeEach(() => {
    quickstartsPage.resizeMedium();
    return quickstartsPage.load();
  });

  it('should load the sign-in page content when I click Sign-In Page', () => {
    quickstartsPage.selectHosted();
    browser.sleep(100);
    return expect(quickstartsPage.isShowingSignInPageContent()).toBe(true);
  });

  it('should load the sign-in widget content when I click Sign-In Widget', () => {
    quickstartsPage.selectSignInWidget();
    browser.sleep(100);
    return expect(quickstartsPage.isShowingSignInWidgetContent()).toBe(true);
  });

  it('should load the Angular content when I click Angular', () => {
    quickstartsPage.selectAngularClient();
    browser.sleep(100);
    return expect(quickstartsPage.isShowingAngularContent()).toBe(true);
  });

  it('should load the React content when I click React', () => {
    quickstartsPage.selectReactClient();
    browser.sleep(100);
    return expect(quickstartsPage.isShowingReactContent()).toBe(true);
  });

  it('should load the Android content when I click Android', () => {
    quickstartsPage.selectAndroidClient();
    browser.sleep(100);
    return expect(quickstartsPage.isShowingAndroidContent()).toBe(true);
  });

  it('should load the iOS content when I click iOS', () => {
    quickstartsPage.selectiOSClient();
    browser.sleep(100);
    return expect(quickstartsPage.isShowingIosContent()).toBe(true);
  });

  it('should load the Node/Generic content when I click Node/Generic', () => {
    quickstartsPage.selectNodeJSServer();
    quickstartsPage.selectGenericNode();
    browser.sleep(100);
    return expect(quickstartsPage.isShowingNodeGenericContent()).toBe(true);
  });

  it('should load the Node/Express content when I click Node/Express', () => {
    quickstartsPage.selectNodeJSServer();
    quickstartsPage.selectExpressJS();
    browser.sleep(100);
    return expect(quickstartsPage.isShowingNodeExpressContent()).toBe(true);
  });

  it('should load the Java/Generic content when I click Java/Generic', () => {
    quickstartsPage.selectJavaServer();
    quickstartsPage.selectGenericJava();
    browser.sleep(100);
    return expect(quickstartsPage.isShowingJavaGenericContent()).toBe(true);
  });

  it('should load the Java/Spring content when I click Java/Spring', () => {
    quickstartsPage.selectJavaServer();
    quickstartsPage.selectSpring();
    browser.sleep(100);
    return expect(quickstartsPage.isShowingJavaSpringContent()).toBe(true);
  });

  it('should load the .NET/ASP Core content when I click .NET/ASP Core', () => {
    quickstartsPage.selectDotNet();
    quickstartsPage.selectDotNetCore();
    browser.sleep(100);
    return expect(quickstartsPage.isShowingDotnetAspCoreContent()).toBe(true);
  });

  it('should load the .NET/ASP 4 content when I click .NET/ASP 4', () => {
    quickstartsPage.selectDotNet();
    quickstartsPage.selectDotNetFour();
    browser.sleep(100);
    return expect(quickstartsPage.isShowingDotnetAsp4Content()).toBe(true);
  });
});
