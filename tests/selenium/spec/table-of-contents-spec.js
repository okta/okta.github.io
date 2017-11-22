'use strict';
const TableOfContentsPage = require('../framework/page-objects/TableOfContentsPage');
const SideBarPage = require('../framework/page-objects/SideBarPage');
const util = require('../framework/shared/util');

describe('table of contents navigation spec', () => {
  const tocPage = new TableOfContentsPage();

  beforeEach(() => {
    tocPage.load();
    tocPage.resizeXLarge();  // At smaller sizes, table of contents is hidden
  });

  it('has basic table of contents in the test page', () => {
    expect(tocPage.level1ItemContains('Test Page')).toBe(true);

    const expectedLevel2Items = ['Overview', 'First Section', 'Second Section', 'Third Section', 'Last Section'];
    expect(tocPage.level2ItemsContain(expectedLevel2Items)).toBe(true);
  });

  util.itNoHeadless('has table of contents with multi level items', () => {
    const expectedLevel3Items = ['Sub Section 1', 'Sub Section 2'];
    expect(tocPage.level3ItemsVisible(expectedLevel3Items)).toBe(false);

    tocPage.clickByLinkText('Last Section');
    tocPage.waitForLinkToBeDisplayed('Sub Section 1');
    expect(tocPage.level3ItemsVisible(expectedLevel3Items)).toBe(true);

    const expectedLevel4Items = ['Image Section', 'Link Section'];
    tocPage.clickByLinkText('Sub Section 1');
    tocPage.waitForLinkToBeDisplayed('Image Section');
    tocPage.waitForLinkToBeDisplayed('Link Section');
    expect(tocPage.level4ItemsVisible(expectedLevel4Items)).toBe(true);

    expect(tocPage.isTopOfPageLinkDisplayed()).toBe(true);
    
    tocPage.gotoTopOfPage();
    expect(tocPage.level3ItemsVisible(expectedLevel3Items)).toBe(false);
  });
});
