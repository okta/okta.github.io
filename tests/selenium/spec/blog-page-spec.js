const BlogPage = require('../framework/page-objects/BlogPage');
const util = require('../framework/shared/util');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('blog page spec', () => {
  const blogPage = new BlogPage('/blog/');

  beforeEach(util.itHelper(async () => {
    blogPage.resizeXLarge();
    blogPage.navigate('/blog/');
    await blogPage.refresh();
  }));

  it('has blog posts', util.itHelper (async () => {
    expect(await blogPage.getBlogPostCount(), 'expects blog post count to be > 0').to.be.greaterThan(0);
  }));

  it('has read more links', util.itHelper (async () => {
    await blogPage.clickReadMoreOnPost(1);
    expect(await blogPage.getBlogLink(1), 'expects blog link to contain current URL').to.contain(await blogPage.getCurrentURL());
  }));

  it('has pagination', util.itHelper(async () => {
    expect(await blogPage.isPaginationVisible(), 'expects pagination to be visible').to.be.true;
  }));

  util.itNoHeadless('navigates to next link', util.itHelper(async () => {
    blogPage.navigate('/blog/');
    blogPage.clickNext();
    blogPage.waitForPresence(blogPage.getFooterElement());
    expect(await blogPage.getCurrentURL(), 'expects current URL to equal expected').to.equal('/blog/page/2/');
  }));

  util.itNoHeadless('navigates to previous link', util.itHelper(async () => {
    blogPage.navigate('/blog/page/2');
    blogPage.clickPrevious();
    blogPage.waitForPresence(blogPage.getFooterElement());
    expect(await blogPage.getCurrentURL(), 'expects current URL to equal expected').to.equal('/blog/');
  }));

  util.itNoHeadless('navigates to specific page link (2)', util.itHelper(async () => {
    blogPage.clickItem(2);
    blogPage.waitForPresence(blogPage.getFooterElement());
    expect(await blogPage.getCurrentURL(), 'expects current URL to equal expected').to.equal('/blog/page/2/');
  }));

  util.itNoHeadless('navigates to specific page link (1)', util.itHelper(async () => {
    blogPage.navigate('/blog/page/2');
    blogPage.clickItem(1);
    blogPage.waitForPresence(blogPage.getFooterElement());
    expect(await blogPage.getCurrentURL(), 'expects current URL to equal expected').to.equal('/blog/');
  }));
});
