# Okta Developer Blog

The [Okta Developer Blog][blog] is awesome. You should check it out! This is the source code repository for it.

If you're having problems running one of the tutorials for a blog post, please create an issue in this project, or leave a comment on the blog post.

If you have questions or need help with Okta's APIs or SDKs, please post to our **[developer forums][devforum]**. If you think you've encountered a bug in one of our SDKs, please create a GitHub issue for that SDK.

If you are looking for Okta's developer documentation, that has moved to [@okta/okta-developer-docs](https://github.com/okta/okta-developer-docs).

## Contributing to the site

This site is built using [Jekyll](http://jekyllrb.com/). Blog post updates, bug fixes, and PRs are all welcome!

The wiki will show you how to [set up your local environment](https://github.com/oktadeveloper/okta.github.io/wiki/Setting-Up-Your-Environment) and how to [deploy the site](https://github.com/oktadeveloper/okta.github.io/wiki/Deploying-the-Site).

### Building the site locally

- [Clone and install dependencies](https://github.com/oktadeveloper/okta.github.io/wiki/Setting-Up-Your-Environment)
- Build the site and start a development server with `npm start`
- Visit [localhost:4000](http://localhost:4000) in your browser

[doc]: https://developer.okta.com
[blog]: https://developer.okta.com/blog
[devforum]: https://devforum.okta.com

## Post Utilities

There are a number of scripts available to assist with content creation.

### Create a new post

```sh
npm run post create [post-name] [format] [date]
```

Creates a new post under `_source/_posts` with the given name and populates it the file with a blank front matter template. Also creates a folder with the same name for images under `_source/_assets/img/blog`. **Format** can be `md` (default), `adoc`, or any file extension. If **date** is not specified, it will default to today's date.

Example:

```sh
npm run post create build-crud-app-with-nodejs
```

### Stamp a post

```sh
npm run post stamp [date]
```

Finds the latest blog post and updates the post date to the date specified. **Date** should be in ISO format (e.g. 2019-08-31). If no **date** is specified, today's date is used.

### Faster rendering for development

```sh
npm run dev
```

This command removes all posts from the local development environment except those dated within the last two weeks.

### Restoring deleted posts before pushing to GitHub

Deleted posts are restored automatically before the push occurs. However, you can manually restore all deleted posts using the following.

```sh
npm run dev-restore
```
