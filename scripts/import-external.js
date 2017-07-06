/**
 * Returns markdown from a given module's README.md file - some filters and
 * transforms are applied to the markdown to render better on d.o.c.
 *
 * Usage: node import-external.js {{moduleName}}
 */

const path = require('path');
const fs = require('fs');

const START_GITHUB_ONLY = '<!-- START GITHUB ONLY -->';
const END_GITHUB_ONLY = '<!-- END GITHUB ONLY -->';

/**
 * Markdown documents can have start and end github only tags to specify
 * content that will not render in d.o.c.
 * @param {String} markdown
 */
function removeGithubOnly(markdown) {
  const rex = new RegExp(`${START_GITHUB_ONLY}[^]*?${END_GITHUB_ONLY}`, 'g');
  return markdown.replace(rex, '');
}

/**
 * Downlevel headers to match expectations for d.o.c. headers - this is used
 * by the right sidebar menu.
 * @param {String} markdown
 */
function updateHeadings(markdown) {
  return markdown.replace(/(\n\n#+) /g, '$1# ');
}

/**
 * Removes last section for "Developing..."
 * @param {String} markdown
 */
function removeDevelopingSection(markdown) {
  return markdown.replace('# Developing the ', START_GITHUB_ONLY) + END_GITHUB_ONLY;
}

/**
 * Removes ()'s from API method headers
 * @param {String} markdown
 */
function removeParensFromApiHeaders(markdown) {
  return markdown.replace(/\n#+.*?\n/g, (match, offset, str) => {
    return match.replace(/([^\]]+)\([^)]*\)/g, '$1');
  });
}

/**
 * Sign-In Widget specific transforms. These transforms should be temporary
 * until a new version of the widget README is published that takes these
 * into account
 * @param {String} markdown
 */
function transformSignInWidget(markdown) {
  // Remove OIDC in headings
  markdown = markdown.replace(/## `OIDC` /g, '## ');

  // Remove github only links
  markdown = markdown
    .replace('[login.properties](node_modules/@okta/i18n/dist/properties/login.properties)', 'login.properties')
    .replace('[country.properties](node_modules/@okta/i18n/dist/properties/country.properties)', 'country.properties');

  // Internal link from replacing parens in headers
  markdown = markdown.replace(/#onevent-callback-context/g, '#on');

  return markdown;
}

/**
 * AuthJs specific transforms. These transforms should be temporary
 * until a new version of the authJs README is published that takes these
 * into account
 * @param {String} markdown
 */
function transformAuthJs(markdown) {
  // Bad link
  return markdown.replace('#configuration', '#client-configuration');
}

/**
 * Loads README.md from installed module in node_modules
 * @param {String} moduleName
 */
function loadReadme(moduleName) {
  const root = path.resolve(__dirname, '../');
  const docPackage = require(`${root}/package.json`);
  const version = docPackage.devDependencies[moduleName];

  if (!version) {
    throw new Error(`Module does not exist in devDependencies: ${moduleName}`);
  }

  const moduleRoot = `${root}/node_modules/${moduleName}`;
  const modulePackage = require(`${moduleRoot}/package.json`);

  if (modulePackage.version !== version) {
    throw new Error(`Missing node_modules - run "npm install"`);
  }

  return fs.readFileSync(`${moduleRoot}/README.md`, 'utf8');
}

// Initialization

const moduleName = process.argv[2];
const transforms = [loadReadme];

if (moduleName === '@okta/okta-signin-widget') {
  transforms.push(
    removeDevelopingSection,
    removeParensFromApiHeaders,
    transformSignInWidget
  );
}
else if (moduleName === '@okta/okta-auth-js') {
  transforms.push(
    removeDevelopingSection,
    removeParensFromApiHeaders,
    transformAuthJs
  );
}

transforms.push(removeGithubOnly, updateHeadings);

const markdown = transforms.reduce(
  (memo, transform) => transform(memo),
  moduleName
);

console.log(markdown);
