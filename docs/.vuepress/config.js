module.exports = {
  /**
   * Custom head elements here
   */
  head: [
    ['link', { rel: 'icon', href: '/assets/favicon/logo.png' }]
  ],
  title: "Okta Developer",
  description: "Secure, scalable, and highly available authentication and user management for any app.",
  /**
   * Global theme config
   */
  themeConfig: {
    /**
     * Primary Nav (WIP)
     */
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/documentation/' },
      { text: 'External', link: 'https://developer.okta.com' },
    ],
    getStarted: {
      languages: [
        {name: "android", link: "/code/android", icon: "code-android-32"},
        {name: "angular", link: "/code/angular", icon: "code-angular-32"},
        {name: "react", link: "/code/react", icon: "code-react-32"},
        {name: "ios", link: "/code/ios", icon: "code-ios-32"},
        {name: "javascript", link: "/code/javascript", icon: "code-javascript-32"},
        {name: "vue.js", link: "/code/vue", icon: "code-vue-32"},
        {name: "java", link: "/code/java", icon: "code-java-32"},
        {name: ".net", link: "/code/dotnet", icon: "code-dotnet-32"},
        {name: "node.js", link: "/code/nodejs", icon: "code-nodejs-32"},
        {name: "php", link: "/code/php", icon: "code-php-32"},
        {name: "rest", link: "/code/rest", icon: "code-rest-32"},
      ],
      sections: [
        {
          title: 'Use Cases',
          links: [
            {
              title: 'Authentication',
              description: 'Overview of the ways Okta can be used to authenticate users depending on your needs.',
              link: '/use_cases/authentication'
            },
            {
              title: 'Events API Migration',
              description: 'How to migrate from the Events API to its System Log API replacement.',
              link: '/use_cases/events-api-migration'
            },
            {
              title: 'Multi-Factor Authentication',
              description: 'Using Okta\'s Multi-Factor Authentication API to add MFA to an existing application.',
              link: '/use_cases/mfa'
            },
            {
              title: 'API Access Management',
              description: 'Secure your APIs with Okta\'s implementation of the OAuth 2.0 standard.',
              link: '/use_cases/api-access-management'
            },
            {
              title: 'Relationships with Linked Objects',
              description: 'Create users with relationships.',
              link: '/use_cases/relationships'
            }
          ]
        },
        {
          title: 'API Reference',
          links: [
            {
              title: 'Sign in Your Users',
              description: 'API endpoints to authenticate your users, challenge for factors, recover passwords, and more.',
              link: '/docs/api/resources/oidc.html'
            },
            {
              title: 'Manage Okta Resources',
              description: 'REST endpoints to configure resources such as users, apps, sessions, and factors whenever you need.',
              link: '/docs/api/resources/apps'
            },
            {
              title: 'API Concepts',
              description: 'Learn the basics of the Okta API.',
              link: '/docs/api/getting_started/design_principles.html'
            },
            {
              title: 'Error Codes',
              description: 'Understand Okta API errors.',
              link: '/reference/error_codes/'
            },
            {
              title: 'Okta Expression Language',
              description: 'Read and transform attributes in our APIs and admin UI.',
              link: '/reference/okta_expression_language/'
            },
            {
              title: 'Postman Collections',
              description: 'Import Okta API collections in Postman for easy inspection.',
              link: '/reference/postman_collections/'
            }
          ]
        },
        {
          title: 'Change Log',
          links: [
            {
              title: 'API Products Change Log',
              description: 'See what\'s new in API Products releases.',
              link: '/docs/change-log'
            }
          ]
        }
      ]
    }
  }
}
