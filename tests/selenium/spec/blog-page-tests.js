const BlogPage = require('../framework/page-objects/BlogPage');

describe('blog page tests', function () {
    const blogPage = new BlogPage('/blog');

    beforeEach(function () {
        browser.ignoreSynchronization = true;
        blogPage.load();
    });
    
    it('has blog posts with read more links and pagination', function () {
        expect(blogPage.getBlogPostCount()).toBeGreaterThan(0);
        expect(blogPage.doBlogsHaveReadMoreLink()).toBeTruthy();
        expect(blogPage.isPaginationVisible()).toBeTruthy();
        expect(blogPage.doesPaginationHaveLinks()).toBeTruthy();
    });
});
