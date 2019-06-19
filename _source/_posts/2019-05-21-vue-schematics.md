---
layout: blog_post
title: "Use Schematics with Vue and Add Authentication in 5 Minutes"
author: mraible
description: "Learn what Schematics are and how to use them with your Vue applications."
tags: [schematics, vue, authentication]
tweets:
- "This tutorial shows you how to create a schematic to modify a Vue project. Check it out!"
- "Do you love @vuejs, but find yourself doing the same thing over and over in new projects? Create a schematic to do it for you!"
- "Schematics with Vue are pretty awesome - find out why!"
image: blog/featured/okta-vue-bottle-headphones.jpg
---

Schematics is a tool from the Angular team that allows you to manipulate projects with code. You can create files, update existing files, and add dependencies to any project that has a `package.json` file. That's right, Schematics aren't only for Angular projects! 

In this post, I'll show you how to use Schematics to modify a project created with Vue CLI. Why Vue? Because it's fast and efficient. Its default bundle size is smaller than Angular and React too! 

{% img blog/vue-schematics/bundle-sizes.png alt:"JavaScript framework bundle sizes" width:"600" %}{: .center-image }

See [The Baseline Costs of JavaScript Frameworks](https://blog.uncommon.is/the-baseline-costs-of-javascript-frameworks-f768e2865d4a) for more information about Vue's speed. I also think it's cool that Vue inspired a Wired magazine article: [The Solo JavaScript Developer Challenging Google and Facebook](https://www.wired.com/story/the-solo-javascript-developer-challenging-google-facebook/).

Bootstrap is a popular CSS framework, and Vue has support for it via [BootstrapVue](https://bootstrap-vue.js.org/). In this tutorial, you'll learn how to create a schematic that integrates BootstrapVue. It's a straightforward example, and I'll include unit and integrating testing tips.

## Schematics: Manipulate Projects with Code

Angular DevKit is part of the [Angular CLI project on GitHub](https://github.com/angular/angular-cli). DevKit provides libraries that can be used to manage, develop, deploy, and analyze your code. DevKit has a `schematics-cli` command line tool that you can use to create your own Schematics.

To create a Schematics project, first install the Schematics CLI:

```shell
npm i -g @angular-devkit/schematics-cli@0.13.4
```

Then run `schematics` to create a new empty project. Name it `bvi` as an abbreviation for Bootstrap Vue Installer.

```shell
schematics blank --name=bvi
```

This will create a `bvi` directory and install the project's dependencies. There's a `bvi/package.json` that handles your project's dependencies. There's also a `src/collection.json` that defines the metadata for your schematics.

```json
{
  "$schema": "../node_modules/@angular-devkit/schematics/collection-schema.json",
  "schematics": {
    "bvi": {
      "description": "A blank schematic.",
      "factory": "./bvi/index#bvi"
    }
  }
}
```

You can see that the `bvi` schematic points to a factory function in `src/bvi/index.ts`. Crack that open and you'll see the following:

```typescript
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export function bvi(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return tree;
  };
}
```

There's also a test in `src/bvi/index_spec.ts`.

```typescript
import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('bvi', () => {
  it('works', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = runner.runSchematic('bvi', {}, Tree.empty());

    expect(tree.files).toEqual([]);
  });
});
```

One neat thing about Schematics is they don't perform any direct actions on your filesystem. Instead, you specify actions against a `Tree`. The `Tree` is a data structure with a set of files that already exist and a staging area (of files that will contain new/updated code). 

## Build Schematics with Vue

If you're familiar with Schematics, you've probably seen them used to manipulate Angular projects. Schematics has excellent support for Angular, but they can run on any project if you code it right! Instead of looking for Angular-specifics, you can just look for `package.json` and a common file structure. CLI tools that generate projects make this a lot easier to do because you know where files will be created.

## Add Dependencies with Schematics

The [BootstrapVue docs](https://bootstrap-vue.js.org/docs) provide installation instructions. 
These are the steps you will automate with the `bvi` schematic.

1. `npm i bootstrap-vue bootstrap`
2. Import and register the `BootstrapVue` plugin
3. Import Bootstrap's CSS files

You can use [Schematics Utilities](https://nitayneeman.github.io/schematics-utilities/) to automate adding dependencies, among other things. 

Start by opening a terminal window and installing `schematic-utilities` in the `bvi` project you created.

```shell
npm i schematics-utilities
```

Change `src/bvi/index.ts` to add `bootstrap` and `bootstrap-vue` as dependencies with an `addDependencies()` function. Call this method from the main function.

```typescript
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependency, NodeDependencyType } from 'schematics-utilities';

function addDependencies(host: Tree): Tree {
  const dependencies: NodeDependency[] = [
    { type: NodeDependencyType.Default, version: '4.3.1', name: 'bootstrap' },
    { type: NodeDependencyType.Default, version: '2.0.0-rc.13', name: 'bootstrap-vue' }
  ];
  dependencies.forEach(dependency => addPackageJsonDependency(host, dependency));
  return host;
}

export function bvi(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    addDependencies(tree);
    return tree;
  };
}
```

## Create, Copy, and Update Files

Create a `src/bvi/templates/src` directory. You'll create templates in this directory that already have the necessary Bootstrap Vue imports and initialization.

Add an `App.vue` template and put the following Bootstrap-ified code in it.

```html
<template>
  <div id="app" class="container">
    <img alt="Vue logo" src="./assets/logo.png">
    <b-alert variant="success" show>Bootstrap Vue installed successfully!</b-alert>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  }
}
</script>
```

Create a `main.js` file in the same directory with the Bootstrap Vue imports and registration.

```js
import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
```

Modify the `bvi()` function in `src/bvi/index.ts` to copy these templates and overwrite existing files.

```typescript
import { Rule, SchematicContext, Tree, apply, url, template, move, forEach, FileEntry, mergeWith, MergeStrategy } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependency, NodeDependencyType } from 'schematics-utilities';
import { normalize } from 'path';

function addDependencies(host: Tree): Tree {
  const dependencies: NodeDependency[] = [
    { type: NodeDependencyType.Default, version: '4.3.1', name: 'bootstrap' },
    { type: NodeDependencyType.Default, version: '2.0.0-rc.13', name: 'bootstrap-vue' }
  ];
  dependencies.forEach(dependency => addPackageJsonDependency(host, dependency));
  return host;
}

export function bvi(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    addDependencies(tree);

    const movePath = normalize('./src');
    const templateSource = apply(url('./templates/src'), [
      template({..._options}),
      move(movePath),
      // fix for https://github.com/angular/angular-cli/issues/11337
      forEach((fileEntry: FileEntry) => {
        if (tree.exists(fileEntry.path)) {
          tree.overwrite(fileEntry.path, fileEntry.content);
        }
        return fileEntry;
      }),
    ]);
    const rule = mergeWith(templateSource, MergeStrategy.Overwrite);
    return rule(tree, _context);
  };
}
```

## Test Your BootstrapVue Installer

In order to add dependencies to `package.json`, you have to provide one in your tests. Luckily, TypeScript 2.9 added JSON imports, so you can create a testable version of `package.json` (as generated by Vue CLI) and add it to `Tree` before you run the test.

In the `bvi/tsconfig.json` file, under compiler options, add these two lines:

```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    "esModuleInterop": true  
  }
}
```

Create `vue-pkg.json` in the same directory as `index_spec.ts`.  

```json
{
  "name": "bvi-test",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "vue": "^2.6.6"
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "^3.4.0",
    "@vue/cli-plugin-eslint": "^3.4.0",
    "@vue/cli-service": "^3.4.0",
    "babel-eslint": "^10.0.1",
    "eslint": "^5.8.0",
    "eslint-plugin-vue": "^5.0.0",
    "vue-template-compiler": "^2.5.21"
  }
}
```

Now you can import this file in your test, and add it to a `UnitTestTree`. This allows you to verify the files are created, as well as their contents. Modify `src/bvi/index_spec.ts` to match the code below.

```typescript
import { HostTree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import packageJson from './vue-pkg.json';

const collectionPath = path.join(__dirname, '../collection.json');

describe('bvi', () => {
  it('works', () => {
    const tree = new UnitTestTree(new HostTree);
    tree.create('/package.json', JSON.stringify(packageJson));

    const runner = new SchematicTestRunner('schematics', collectionPath);
    runner.runSchematic('bvi', {}, tree);

    expect(tree.files.length).toEqual(3);
    expect(tree.files.sort()).toEqual(['/package.json', '/src/App.vue', '/src/main.js']);

    const mainContent = tree.readContent('/src/main.js');
    expect(mainContent).toContain(`Vue.use(BootstrapVue)`);
  });
});
```

Run `npm test` and rejoice when everything passes!

## Verify Your Vue Schematic Works

You can verify your schematic works by creating a new Vue project with Vue CLI's defaults, installing your schematic, and running it.

Start by installing Vue CLI if you don't already have it. 

```shell
npm i -g @vue/cli@3.4.1
```

Run `vue create test` and select the **default** preset.

Run `npm link /path/to/bvi` to install your BootstapVue Installer. You might need to adjust the `bvi` project's path to fit your system. 

```shell
cd test
npm link ../bvi
```

Run `schematics bvi:bvi` and you should see files being updated.

```shell
UPDATE /package.json (956 bytes)
UPDATE /src/App.vue (393 bytes)
UPDATE /src/main.js (287 bytes)
```

Run `npm install` followed by `npm run serve` and bask in the glory of your Vue app with Bootstrap installed!

{% img blog/vue-schematics/vue-with-bootstrap.png alt:"Vue with Bootstrap" width:"800" %}{: .center-image }

## Schematics with Angular 

Angular CLI is based on Schematics, as are its PWA and Angular Material modules. I won't go into Angular-specific Schematics here, you can read [Use Angular Schematics to Simplify Your Life](/blog/2019/02/13/angular-schematics) for that.

This tutorial includes information on how to add prompts, how to publish your Schematic, and it references an [OktaDev Schematics](https://github.com/oktadeveloper/schematics) project that I helped develop. This project's continuous integration uses a [`test-app.sh`](https://github.com/oktadeveloper/schematics/blob/master/test-app.sh) script that creates projects with each framework's respective CLI. For example, here's the script that tests creating a new Vue CLI project, and installing the schematic.

```bash
elif [ "$1" == "vue" ] || [ "$1" == "v" ]
then
  config=$(cat <<EOF
{
  "useConfigFiles": true,
  "plugins": {
    "@vue/cli-plugin-babel": {},
    "@vue/cli-plugin-eslint": {
      "config": "base",
      "lintOn": [
        "save"
      ]
    },
    "@vue/cli-plugin-unit-jest": {}
  },
  "router": true,
  "routerHistoryMode": true
}
EOF
)
  vue create vue-app -i "$config"
  cd vue-app
  npm install ../../oktadev*.tgz
  schematics @oktadev/schematics:add-auth --issuer=$issuer --clientId=$clientId
  npm run test:unit
fi
```

This project has support for TypeScript-enabled Vue projects as well. 

Got a minute? Let me show you how to create a Vue + TypeScript project and add authentication with OIDC and Okta. 

## Use Vue Schematics to Add Authentication with OpenID Connect 

Run `vue create vb`, select **Manually select features** and choose **TypeScript**, **PWA**, **Router**. 

{% img blog/vue-schematics/vue-cli-features.png alt:"Vue CLI features" width:"800" %}{: .center-image }

While that process completes, create an OIDC app on Okta.

### Create an OpenID Connect App on Okta

Log in to your Okta Developer account (or https://developer.okta.com/signup/[sign up] if you don't have an account) and navigate to **Applications** > **Add Application**. Click **Single-Page App**, click **Next**, and give the app a name you'll remember, and click **Done**.

The next screen should look similar to the following:

{% img blog/vue-schematics/okta-oidc-settings.png alt:"Okta OIDC Settings" width:"700" %}{: .center-image }

Go back to the terminal window where you created the `vb` app. Navigate into the directory and run the app to make sure it starts on port 8080. 

```shell
cd vb
npm run serve
```

**TIP:** If it starts on port 8081, it's because you already have a process running on 8080. You can use `fkill :8080` to kill the process after installing [`fkill-cli`](https://github.com/sindresorhus/fkill-cli).

Stop the process (Ctrl+C) and add OIDC authentication to your app with the following commands:

```shell
npm i @oktadev/schematics@0.7.2
schematics @oktadev/schematics:add-auth
```

When prompted, enter your issuer (it can be found in Okta's dashboard under **API** > **Authorization Servers**) and client ID. When the installation completes, run `npm run serve` and marvel at your Vue app with authentication!

{% img blog/vue-schematics/vue-with-authentication.png alt:"Vue with Authentication" width:"700" %}{: .center-image }

Click **login**, enter the credentials you used to signup with Okta, and you'll be redirected back to your app. This time, a **logout** button will be displayed. 

## Learn More about Vue, Schematics, and Secure Authentication

I hope you've enjoyed learning how to create Schematics for Vue. I found the API fairly easy to use and was pleasantly surprised by its testing support too. If you want to learn more about Okta's Vue SDK, see [its docs](https://github.com/okta/okta-oidc-js/tree/master/packages/okta-vue).

You can find the example schematic for this tutorial [on GitHub](https://github.com/oktadeveloper/vue-schematics-example).

We've written several posts on Schematics and Vue on this blog. You might enjoy them too.

* [Use Angular Schematics to Simplify Your Life](/blog/2019/02/13/angular-schematics)
* [Use Schematics with React and Add OpenID Connect Authentication in 5 Minutes](/blog/2019/03/05/react-schematics)
* [Build a Basic CRUD App with Vue.js and Node](/blog/2018/02/15/build-crud-app-vuejs-node)
* [Build a Simple CRUD App with Spring Boot and Vue.js](/blog/2018/11/20/build-crud-spring-and-vue) 
* [Bootiful Development with Spring Boot and Vue](/blog/2018/12/03/bootiful-spring-boot-java-vue-typescript)
* [If It Ain't TypeScript It Ain't Sexy](/blog/2019/02/11/if-it-aint-typescript)

Follow [@oktadev](https://twitter.com/oktadev) on Twitter to learn about more leading-edge technology like Schematics, Vue, and TypeScript. We also publish screencasts to our [YouTube channel](https://www.youtube.com/c/oktadev).
