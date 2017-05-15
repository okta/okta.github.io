'use strict';

const BasePage = require('./BasePage');
const util = require('../shared/util');

class BlogPage extends BasePage {
  constructor(url) {
    super(url);
    this.blog = $('.wrap.blog');
    this.blogPosts = $$('article.post-block');
    this.paginationDiv = $('.pagination');
  }

  load() {
    this.get();
    return this.waitForPageLoad();
  }

  waitForPageLoad() {
    return util.wait(this.blog);
  }

  getBlogPostCount() {
    return this.blogPosts.count();
  }

  isPaginationVisible() {
    return this.paginationDiv.isDisplayed();
  }

  doesPaginationHaveLinks() {
    let links = ['Prev', '1', '2', 'Next'];
    return this.doesElementContainText(this.paginationDiv, links);
  }

  doBlogsHaveReadMoreLink() {
    let linkPresent = true;
    let blogCount = 0;
    return this.blogPosts.filter(function (blogPost) {
      blogCount++;
      let readMoreLink = blogPost.element(by.linkText('Read more'));

      if (readMoreLink.isPresent() == false) {
        linkPresent = false;
      }
      return linkPresent;
    }).then(function (elementList) {
      return elementList.length == blogCount;
    })
  }
}

module.exports = BlogPage;