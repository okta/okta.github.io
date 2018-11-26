// Theme API.
module.exports = (options, ctx) => ({
  plugins: [
    ['@vuepress/active-header-links', {
      headerAnchorSelector: ".test"
    }],
    ['@okta/vuepress-plugin-markdown-it-atts', {
      headerAnchorSelector: ".test"
    }]
  ]
})
