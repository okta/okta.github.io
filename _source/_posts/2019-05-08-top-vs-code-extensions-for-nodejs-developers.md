---
layout: blog_post
title: "Top 10 Visual Studio Code Extensions for Node.js"
author: reverentgeek
description: "Our recommendations for the essential Visual Studio Code extensions for Node.js developers."
tags: [nodejs, vscode, javascript, extensions]
tweets:
 - "VS @code is awesome for @nodejs development! Here are the top 10 VS Code extensions you need!"
 - "Are you a @nodejs developer new to VS @code? Check out the top 10 VS Code extensions you need!"
 - "VS @code is quickly becoming one of the most popular code editors. Is it good for @nodejs development? Absolutely! Here are the top 10 VS Code extensions you need!"
image: blog/vscode-extensions-for-nodejs/vscode-extensions-for-nodejs.jpg
---

I am amazed at the adoption of Visual Studio Code by developers from all platforms and languages. According to the 2019 Stack Overflow Developer Survey, VS Code is dominating. The primary reasons I use VS Code are its great support for debugging JavaScript and Node.js code, and how easy it is to customize with free extensions available in Visual Studio Marketplace.

However, there are thousands of extensions available! How do you know which ones are good to use?

One way is to look at an extensions average rating and the number of downloads to gauge its popularity. Another way is to read personal opinion posts like this one. And here you are!

Here are my top picks for Visual Studio Code extensions for Node.js developers.

{% img blog/vscode-extensions-for-nodejs/vscode-extensions-for-nodejs.jpg alt:"Top 10 VS Code Extensions for Node.js" width:"648" %}{: .center-image }

## Bracket Pair Colorizer 2

I try to keep my code as simple as possible and not nest too many things. Unfortunately, sometimes it is unavoidable. [Bracket Pair Colorizer 2](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer-2) colorizes matching brackets, making it easier to visually see which opening and closing brackets, braces, or parentheses belong to each other.

{% img blog/vscode-extensions-for-nodejs/bracket-pair-colorizer.gif alt:"npm intellisense module autocomplete" width:"648" %}{: .center-image }

## npm

The [npm](https://marketplace.visualstudio.com/items?itemName=eg2.vscode-npm-script) extension provides two features: running npm scripts defined in the `package.json` in the editor and validating the packages listed in the `package.json`.

{% img blog/vscode-extensions-for-nodejs/npm-palette.gif alt:"Adds npm commands to Command Palette" width:"800" %}{: .center-image }

{% img blog/vscode-extensions-for-nodejs/npm-validate.gif alt:"Validates package.json" width:"672" %}{: .center-image }

## npm Intellisense

The [npm Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense) extension introduces autocomplete behavior when you use `require()` to import modules into your code.

{% img blog/vscode-extensions-for-nodejs/npm-intellisense.gif alt:"npm intellisense module autocomplete" width:"696" %}{: .center-image }

## ESLint

When I initialize a new Node.js project folder, the first thing I install from the terminal is [ESLint](https://eslint.org/).

```bash
npm init -y
npm install --save-dev eslint
```

The [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) uses your local ESLint and configured rules to look for common patterns and issues in JavaScript code, and is designed to help you write better code with fewer bugs. ESLint can also reformat your code to make it more consistent, depending on the rules you have enabled for your project. Be sure to enable **Auto Fix On Save**  (`"eslint.autoFixOnSave": true`) in your VS Code settings.

You can initialize an ESLint configuration file in your project with this command.

```bash
npx eslint --init
```

My current `.eslintrc.js` looks like the following.

```javascript
module.exports = {
 env: {
   commonjs: true,
   es6: true,
   node: true
 },
 extends: "eslint:recommended",
 globals: {},
 parserOptions: {
   ecmaVersion: 2018
 },
 rules: {
   indent: [ "error", "tab" ],
   "linebreak-style": [ "error", "unix" ],
   quotes: [ "error", "double" ],
   semi: [ "error", "always" ],
   "array-bracket-spacing": [ "error", "always" ],
   "object-curly-spacing": [ "error", "always" ],
   "space-in-parens": [ "error", "always" ]
 }
};
```

{% img blog/vscode-extensions-for-nodejs/eslint.gif alt:"ESLint extension automatically fixes issues on save" width:"800" %}{: .center-image }

## Code Spell Checker

I don't know about you, but it really _bugs_ me when I discover I've misspelled function names, variables, comments, or anything else in my code. Misspelled code, as long as it's consistently misspelled, _works_ fine, but mistakes can still be frustrating or embarrassing.

Well, those days are over with [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)! One nice thing is the extension understands `camelCase`, `PascalCase`, `snake_case`, and more. Another great feature is there are dictionaries available for Spanish, French, German, Russian, and a number of other languages.

{% img blog/vscode-extensions-for-nodejs/code-spell-checker.gif alt:"code spell checker" width:"492" %}{: .center-image }

## Auto Close Tag

More recent versions of VS Code automatically create closing tags when you are working in an HTML or XML file. For other file types, such as JavaScript, Vue, and JSX, [Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag) will save you some typing!

{% img blog/vscode-extensions-for-nodejs/auto-close-tag.gif alt:"auto close tag" width:"548" %}{: .center-image }

## DotENV

It's quite common to configure Node.js applications using environment variables. And, one of the most popular modules for managing environment variables is [dotenv](https://www.npmjs.com/package/dotenv). The [DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv) extension for VS Code adds convenient syntax highlighting when editing a `.env` file.

{% img blog/vscode-extensions-for-nodejs/dotenv.png alt:"DotENV Extension" width:"451" %}{: .center-image }

## Path Intellisense

The [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense) extension adds autocomplete support for file paths and names, reducing typing as well as the introduction of bugs related to wrong paths.

{% img blog/vscode-extensions-for-nodejs/path-intellisense.gif alt:"Path Intellisense" width:"800" %}{: .center-image }

## MarkdownLint

Good code and good documentation go hand-in-hand. I prefer to write README's and other documentation in markdown format. The [Markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint) extension can help you make sure your markdown syntax is in good form!

{% img blog/vscode-extensions-for-nodejs/markdownlint.gif alt:"Markdown linter" width:"650" %}{: .center-image }

## Material Icon Theme

The [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme) adds a ton of icons to VS Code for different file types. Being able to quickly distinguish different files in project can be a great time saver!

{% img blog/vscode-extensions-for-nodejs/material-icon-theme.png alt:"Material Icon Theme" width:"327" %}{: .center-image }

## Honorable Mention VS Code Extensions for Node.js

These extensions didn't make the top 10 list, but are still useful in some scenarios for Node.js developers!

* [Encode Decode](https://marketplace.visualstudio.com/items?itemName=mitchdenny.ecdc) - Adds commands to quickly convert text to and from various formats, such as Base64, HTML entities, and JSON byte arrays.
* [Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) - Make HTTP requests directly from your editor and view the responses in a separate window. Great for testing and prototyping APIs.
* [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments) - This extension helps you create more "human-friendly" comments by adding highlights to different types of comments.

## Learn More about Building Secure Node.js Apps in Visual Studio Code

Want to learn more about building secure Node.js applications? Check out these other posts!

* [Build a Basic CRUD App with Vue.js and Node](/blog/2018/02/15/build-crud-app-vuejs-node)
* [Create and Verify JWTs with Node](/blog/2018/11/13/create-and-verify-jwts-with-node)
* [Modern Token Authentication in Node with Express](/blog/2019/02/14/modern-token-authentication-in-node-with-express)
* [Build a REST API with Node and Postgres](/blog/2019/03/27/build-rest-api-with-node-and-postgres)

Additional links you may find useful!

* [Visual Studio Code](https://code.visualstudio.com/)
* [Visual Studio Marketplace](https://marketplace.visualstudio.com/VSCode)
* [2019 Stack Overflow Developer Survey](https://insights.stackoverflow.com/survey/2019#technology-_-most-popular-development-environments)
