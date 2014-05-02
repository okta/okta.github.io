
=====================================================================
# Okta Developer Site
=====================================================================

Okta developer site is a custom Jekyll site deployed on GitHub pages


----------------------------- SETUP

http://jekyllrb.com/

1. Clone repository
2. `~ $ gem install jekyll`
3. `~ $ cd okta.github.io`
4. `~ $ jekyll serve -w -t`
5. `http://localhost:4000`
6. Change CNAME with the right subdomain
7. Change Return URL for signup.
    ex. `<input type=hidden name="retURL" value="http://github.essaoui.com/welcome.html">`



=====================================================================
Authoring Guide
=====================================================================

----------------------------- PAGES

Pages are single purpose html or markdown files

1. Create a folder with `index.html` file.
    ex. `pricing/index.html`

2. Author front matter as follows:
    ex.
    ---
    layout: page
    title: YOUR_TITLE
    css: CSS_FILENAME.css (optional page specific css file)
    ---

3. Put html or css content under front matter

4. Expose link to page in header or elsewhere. URL will be the folder
   name, `index.html` is not necessary
    ex. `/pricing`



----------------------------- DOCS

1.  Create `PAGE_NAME.md` in `docs/FOLDER_NAME`
      ex. `docs/endpoints/tokens.md`

2.  Filenames are underscore seperated and all lowercase. ex. `my_cool_doc_page.md`

3.  Author front matter
      ex.
      ---
      layout: docs_page
      title: Title Case Name of Page
      ---

4.  The content under the front matter should not have any `h1`s -
    this will be set by the `title` property

5.  All `h2`s in the content will be rendered as a link in the table
    of contents

6.  Create placement entry in manifest at `_data/docs.yml` in
    appropriate `pages` section.

7.  The `pages` name must match the filename without extension.
      ex. `tokens.md` => `tokens`

8.  To create a new section in the manifest
      `section: NAME_OF_FOLDER`
      `title: TITLE_CASE_NAME_OF_SECTION`

9.  The sections structure should follow the folder names

10. The ordering of sections and pages in the manifest determines the order in
    which they appear in the leftnav



----------------------------- CUSTOMERS

1.  Create an `index.md` folder in `customers/CUSTOMER_NAME`
      ex. `customers/box/index.md`

2. create the images:
      `thumb_image`:   250px x 120px
      `index_image`:   303px x 226px
      `diagram_image`: 694px x <n>px

3.  author front matter
      `index_blurb` will be clipped over three lines of text
      `sidebar_copy` will be markdownified. Newlines sohuld be doubled.

