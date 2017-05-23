const BlogPage = require('../framework/page-objects/BlogPage');

describe('blog page spec', () => {
  const blogPage = new BlogPage('/blog');

  beforeEach(() => {
    blogPage.load();
  });

  it('has blog posts with read more links to open them', () => {
    expect(blogPage.getBlogPostCount()).toBeGreaterThan(0);

    const blogLink = blogPage.getBlogLink(1);
    blogPage.clickReadMoreOnPost(1);
    expect(blogLink).toContain(blogPage.getCurrentURL());
  });

  it('has pagination and navigates to next and previous links', () => {
    expect(blogPage.isPaginationVisible()).toBe(true);

    blogPage.clickNext();
    expect(blogPage.getCurrentURL()).toBe('/blog/page/2/');
    blogPage.clickPrevious();
    expect(blogPage.getCurrentURL()).toBe('/blog/');

    blogPage.clickItem(2);
    expect(blogPage.getCurrentURL()).toBe('/blog/page/2/');
    blogPage.clickItem(1);
    expect(blogPage.getCurrentURL()).toBe('/blog/');
  });
});
