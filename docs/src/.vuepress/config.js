const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Vuepress Docs Boilerplate',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: '가이드',
        link: '/guide/',
      },
      {
        text: 'Vue 3 마이그레이션',
        link: '/migrations/'
      }
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Vue.js',
          collapsable: true,
          children: [
            '',
            'composition-api',
            'difference-between-ref-and-reactive',
            'performance-ref-reactive',
            'watch-watch-effect',
            'debugging-vue',
            'devtools'
          ]
        },
        {
          title: 'Nuxt',
          collapsable: true,
          children: [
            'nuxt'
          ]
        },
        {
          title: 'Deno',
          collapsable: true,
          children: []
        },
        {
          title: 'Flutter',
          collapsable: true,
          children: []
        }
      ],
      '/migrations/': [
        {
          title: '마이그레이션',
          collapsable: false,
          children: [
            '',
            'composition-api-to-three',
            'prototype-to-global-properties'
          ]
        }
      ],
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
