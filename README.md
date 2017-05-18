# Okta Developer Site

- [Setting Up Your Environment](#setting-up-your-environment)
- [Contributing to the Site](#contributing-to-the-site)
- [Deploying the Site](#deploying-the-site)
- [Authoring Guide](#authoring-guide)

Okta developer site (developer.okta.com) is a custom [Jekyll](http://jekyllrb.com/) site deployed on [GitHub
pages](https://pages.github.com/).

All documentation submissions are welcome. To submit a change, please follow the contribution process detailed [below](#you-are-making-a-non-blog-change).


## Setting Up Your Environment

Most of the content of the developer site is written in a format called
[Kramdown](http://kramdown.gettalong.org/syntax.html) which is a flavor of Markdown with some enhanced features like the
ability to do footnote notations. We use Kramdown because the markup is both human readable and convertible in to fully
fledged HTML. If there's some functionality you can't implement in Kramdown you can always drop down into HTML as a
last resort.

Though Kramdown gives us benefits of readability it comes at the cost of requiring a build step to preview the changes to
the site. Jekyll, handles this nicely by detecting changes to the file system and refreshing automatically. To setup
Jekyll to be able to build and view the site, follow the steps below:

1. Install RVM if you don't already have it. On OSX [install the stable version](https://rvm.io/rvm/install) or on Linux `yum install rvm`. To ensure you have
   rvm installed properly run `rvm list` and ensure that there is a version marked as 'current'.
2. Clone repository `git clone git@github.com:okta/okta.github.io.git`
3. Go into project directory `cd okta.github.io`
4. You may be told that the version of ruby needed by this project isn't installed, follow the given instruction to
   install the correct version of ruby for RVM. If you did have to install a new version of ruby re-enter the directory
   you're in: `cd ..;cd okta.github.io` then verify that the current gemset you're using is called "okta.github.io" by
   running `rvm gemset list`. This project specifies a gemset so that the build of this project isn't affected by global
   gems on your system.
5. Now install gems needed by this project into the projects gemset with `gem install bundler` and then `bundle install`.
   This will essentially read the Gemfile in the root directory and install all packages required to run the site.
6. Start the site `npm start`
7. Visit `http://localhost:4000` in your browser
8. To stop serving the site hit `ctrl+c` in the terminal

### Important Directories

* **_source:** this is where the source files live. If you're editing content, or adding assets like images or CSS, they
  belong in here
* **dist:** this directory is ignored in GitHub. It contains the local version of each of the built files in the site
* **almost everything else:** most of the other directories in the root are the checked in versions of the built site.
  These files should not be edited directly. Find the corresponding version of the file in the `_source` directory, modify
  that and then re-run the build.

### Resolving conflicts with "upstream"

If you are making changes in a fork, here is how to make a clean Pull Request against "upstream":

1. [Sync your fork](https://help.github.com/articles/fork-a-repo/#keep-your-fork-synced) to https://github.com/okta/okta.github.io/
   The command `git remote add upstream git@github.com:okta/okta.github.io.git` is the key part of this step.
2. After running `git fetch upstream` in the guide above, run this command to pull down changes from upstream:
   `git merge -s recursive -X theirs upstream/master`

## Contributing to the Site

Okta uses the
[GitHub Flow](https://guides.github.com/introduction/flow/)
workflow for contributions. The process varies depending on what sort of change you are making:

- [You are making a non-blog change](#you-are-making-a-non-blog-change)
- [You are making a blog post change](#you-are-making-a-blog-post-change)

### You are making a non-blog change

All commits will go through the `weekly` branch. They will be deployed once a week after the preview release.

#### Contributor

1. Fetch latest from origin, and create a new topic branch off of `weekly`:

    ```bash
    [okta.github.io master]$ git fetch origin
    [okta.github.io master]$ git checkout -b my-topic-branch origin/weekly
    ```

2. Make your changes inside the `_source` directory.

3. Confirm that Jekyll still builds properly by running `npm start` and then navigating to http://localhost:4000.

4. Once you are happy with your changes, commit them.

5. Push your topic branch:

    ```bash
    [okta.github.io my-topic-branch]$ git push origin my-topic-branch:my-topic-branch
    ```

6. Create a Pull Request. **Set "base" to "weekly"** (Important!)

7. Get it reviewed. When it passes the Travis tests and has an approval, merge.

8. After it's been merged into `weekly`, it will be deployed to the [staging site](https://d384qaxymvjmjw.cloudfront.net/) - this usually takes a couple minutes. Verify that your changes show up correctly on the live version of the site. Note - you can tell exactly when it's been pushed by looking at the bacon publish task for the okta.github.io artifact.

9. You're done! Your changes will go out with the weekly release, which happens after preview is deployed.

#### Reviewer

Verify that the change makes sense. Verify that the changed files are all in `_source` - there should be no production build files (which would show up outside of `_source`).

### You are making a blog post change

Blog commits will be merged into the `master` branch. They should include the production build - once it's merged, it's live on developer.okta.com.

#### Contributor

1. Fetch latest from origin, and create a new topic branch off of `master`. If you're working off a fork, [follow these instructions](https://help.github.com/articles/syncing-a-fork/).

    ```bash
    # After synced with latest from upstream
    [okta.github.io master]$ git checkout -b my-blog-branch
    ```

2. Make your changes inside the `_source` directory.

3. Confirm that Jekyll still builds properly by running `npm start` and then navigating to http://localhost:4000.

4. Once you are happy with your changes, commit them.

5. Run the command to build the production files:

    ```bash
    # Important! You must use this command to generate the build version.
    [okta.github.io my-blog-branch]$ npm run build-prod
    ```

6. Verify that only the intended files were copied over. If this is correct, create a new commit to your branch with the message "Production build".

7. Create a new Pull Request. Leave the base branch as `master`.

8. Once the Travis tests have passed, send a HipChat message to the current DevEx EEP in the DevEx-Public HipChat room. They'll be responsible for reviewing and merging your PR into `master`.

    ```
    # Easy way to ping the current EEP - do this in DevEx-Public
    > @Nomy guardian-devex please review my blog pr: https://github.com/okta/okta.github.io/pull/{{ID}}
    ```

#### Reviewer

Verify that the only changed files are blog files:
- The main blog post under `_source/_posts`
- Any assets that are added to the blog - `_source/_assets`
- The production versions of these:
  - `assets/{{the same images, but with a sha in the url}}`
  - The generated blog files (the post, `feed.xml`, `sitemap.xml`, and the list file `blog/index.html`)

An example of a correct PR is [here](https://github.com/okta/okta.github.io/pull/838/files).

## Deploying the Site

Only approved Okta employees can deploy the site. In most cases this will be the DevEx EEP. 

- [You are deploying the weekly branch](#you-are-deploying-the-weekly-branch)
- [You are deploying a hotfix change](#you-are-making-a-hotfix-change)

### You are deploying the weekly branch

Create a production build of the `weekly` branch, merge it, then reset `weekly`.

1. Create a new topic branch based off of `weekly`:

    ```bash
    [okta.github.io weekly]$ git fetch origin
    [okta.github.io master]$ git checkout -b my-weekly-branch origin/weekly
    ```
    
2. Rebase to pull in any commits that have been merged to `master` directly

    ```bash
    [okta.github.io my-weekly-branch] git rebase -i origin/master
    ```

3. Run the command to build the production files:

    ```bash
    # Important! You must use this command to generate the build version.
    [okta.github.io my-weekly-branch]$ npm run build-prod
    ```

4. Verify that only the intended files were copied over. If this is correct, create a new commit to your branch with the message "Production build".

5. Push the branch, and create a new Pull Request. Set the base branch to `weekly`. If the rebase included changes, you will need to force push.

6. After it's been approved and passes the Travis tests, merge it into `weekly`.

7. After it's been merged into `weekly`, it will be deployed to the [staging site](https://d384qaxymvjmjw.cloudfront.net/) - this usually takes a couple minutes. Verify that all weekly changes show up correctly on the live version of the site. Note - you can know exactly when it's been pushed by looking at the bacon publish task for the okta.github.io artifact.

8. Create a PR for the `weekly` branch to merge into `master`. Once it's been approved, merge it into `master`. The changes are live!

9. Reset the `weekly` branch with the latest `master` changes

    ```bash
    [okta.github.io master]$ git fetch origin
    
    # Note: This will overwrite any new changes to the weekly branch! Before running this,
    # make sure there are no new commits that have been merged in since you merged into master.
    [okta.github.io master]$ git push -f origin origin/master:weekly
    ```

### You are making a hotfix change

Hotfix commits will be merged into the `master` branch. They should include the production build - once it's merged, it's live on developer.okta.com.

#### Contributor

1. Fetch latest from origin, and create a new topic branch off of `master`:

    ```bash
    [okta.github.io master]$ git fetch origin
    [okta.github.io master]$ git merge origin/master
    [okta.github.io master]$ git checkout -b my-hotfix-branch
    ```

2. Make your changes inside the `_source` directory.

3. Confirm that Jekyll still builds properly by running `npm start` and then navigating to http://localhost:4000.

4. Once you are happy with your changes, commit them.

5. Run the command to build the production files:

    ```bash
    # Important! You must use this command to generate the build version.
    [okta.github.io my-hotfix-branch]$ npm run build-prod
    ```

6. Verify that only the intended files were copied over. If this is correct, create a new commit to your branch with the message "Production build".

7. Push the branch, and create a new Pull Request. Leave the base branch as `master`.

8. Get it reviewed. When it passes the Travis test and is approved, it can be merged.

#### Reviewer

Verify that the only changed files are the files in `_source`, and the files that have been copied to root as a result of the `_source` changes.

## Authoring Guide

### Pages

Pages are single purpose HTML or Markdown (`.md`) files

1. Create a folder with `index.html` file. (e.g. `pricing/index.html`)
2. Author front matter as follows:

  ```
  ---
  layout: page
  title: YOUR_TITLE
  css: CSS_FILENAME.css (optional page specific css file)
  ---
  ```

3. Put HTML or CSS content under front matter
4. Expose link to page in header or elsewhere. URL will be the folder
   name, `index.html` is not necessary (e.g. */pricing*)

### Docs

1.  Create `PAGE_NAME.md` in `docs/FOLDER_NAME` (e.g. `docs/api/rest/users.md`)
2.  Filenames are underscore separated and all lowercase. (e.g. `my_cool_doc_page.md`)
3.  Author front matter:

  ```
  ---
  layout: docs_page
  title: Title Case Name of Page
  ---
  ```

4.  The content under the front matter should not have any `h1`s -
    this will be set by the `title` property
5.  All `h2`s in the content will be rendered as a link in the table
    of contents
6.  Create placement entry in manifest at `_data/docs.yml` in
    appropriate `pages` section.
7.  The `pages` name must match the filename without extension. (e.g. `users.md` => `users`)
8.  To create a new section in the manifest

  ```
  section: NAME_OF_FOLDER
  title: TITLE_CASE_NAME_OF_SECTION
  ```

9.  The sections structure should follow the folder names
10. The ordering of sections and pages in the manifest determines the order in
    which they appear in the leftnav

### Customers

1.  Create an `index.md` folder in `customers/CUSTOMER_NAME` (e.g. `customers/box/index.md`)
2.  Create the images:

  ```
  `index_image`:     220px x 165px @144dpi  // image used on index page
  `header_image`:   1080px x 220px @144dpi  // title bar image on story page
  `diagram_image`:   694px x <n>px @144dpi  // information graphic at bottom of story page
  ```
3.  Author front matter

  ```
  `index_blurb` will be clipped over three lines of text
  `sidebar_copy` will be markdownified. Newlines should be doubled.
  ```

### Authors

1.  Create an entry in `_source/_data/authors.yml`
2.  Put avatar image in `_source/assets/img`. Make sure aspect ratio of image is square.

### Blog Posts

1. Create a file in `_source/_posts/` with the form `YYYY-mm-dd-the-title.md`
2. The header should look something like:

  ```
  ---
  layout: blog_post
  title: Productionalizing ActiveMQ
  author: okta_generic_blogger
  tags: [activemq, jvm]
  ---
  ```

3. Supporting images should be placed in `_source/assets/img` and should follow the convention:
   `<name_of_post>-image-name.extension` where name of the post doesn't include the `.md` extension. This will allow us
   to know which images are referenced by which post.
4. Look at other posts for examples.
