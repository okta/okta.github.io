'use strict';

const BasePage = require('./BasePage');
const util = require('../shared/util');

class BlogPage extends BasePage {
  constructor(url) {
    super(url);
    this.$blog = $('.wrap.blog');
    this.$$blogPost = $$('article.post-block');
    this.$pagination = $('.pagination');
    this.$nextLink = element(by.partialLinkText('Next'));
    this.$prevLink = element(by.partialLinkText('Prev'));
    this.setPageLoad(this.$blog);
  }
  
  getBlogPostCount() {
    return this.$$blogPost.count();
  }

  isPaginationVisible() {
    return this.$pagination.isDisplayed();
  }
  
  clickNext() {
    return this.$nextLink.click();
  }

  clickPrevious() {
    return this.$prevLink.click();
  }

  clickItem(item) {
    let itemLink = element(by.linkText(item.toString()));
    return itemLink.click();
  }

  clickReadMoreOnPost(post) {
    let blogPost = this.$$blogPost.get(post);
    let readMoreLink = blogPost.element(by.linkText('Read more'));
    return readMoreLink.click();
  }
  
  getBlogLink(post) {
    let blogPost = this.$$blogPost.get(post);
    let title = blogPost.element(by.css('a'));
    return title.getAttribute('href');
  }
}

module.exports = BlogPage;