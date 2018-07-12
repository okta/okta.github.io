'use strict';

const BasePage = require('./BasePage');
const util = require('../shared/util');

class BlogPage extends BasePage {
  constructor(url) {
    super(url);
    this.$blog = $('.Blog.is-index');
    this.$$blogPost = $$('.BlogPost.is-excerpt');
    this.$pagination = $('.Blog-pagination');
    this.$nextLink = element(by.partialLinkText('Next »'));
    this.$prevLink = element(by.linkText('« Prev'));
    this.setPageLoad(this.$blog);
  }

  getBlogPostCount() {
    return this.$$blogPost.count();
  }

  isPaginationVisible() {
    this.waitForPresence(this.$pagination);
    return this.$pagination.isPresent();
  }

  clickNext() {
    this.waitForPresence(this.$nextLink);
    return this.$nextLink.click();
  }

  clickPrevious() {
    this.waitForPresence(this.$prevLink);
    return this.$prevLink.click();
  }

  clickItem(item) {
    const itemLink = element(by.linkText(item.toString()));
    this.waitForPresence(itemLink);
    return itemLink.click();
  }

  clickReadMoreOnPost(post) {
    const blogPost = this.$$blogPost.get(post);
    const readMoreLink = blogPost.element(by.linkText('Read more'));
    this.waitForPresence(readMoreLink);
    return readMoreLink.click();
  }

  getBlogLink(post) {
    const blogPost = this.$$blogPost.get(post);
    const title = blogPost.element(by.css('h1 a'));
    return title.getAttribute('href');
  }
}

module.exports = BlogPage;
