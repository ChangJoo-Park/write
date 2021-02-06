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
            'vue/',
            'vue/composition-api',
            'vue/difference-between-ref-and-reactive',
            'vue/performance-ref-reactive',
            'vue/watch-watch-effect',
            'vue/debugging-vue',
            'vue/devtools',
            'vue/composition-api-to-three',
            'vue/prototype-to-global-properties'
          ]
        },
        {
          title: 'Nuxt',
          collapsable: true,
          children: [
            'nuxt/'
          ]
        },
        {
          title: 'Deno',
          collapsable: true,
          children: [
            'deno/'
          ]
        },
        {
          title: 'Flutter',
          collapsable: true,
          children: [
            'flutter/'
          ]
        }
      ],
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    'vuepress-plugin-nprogress',
    'vuepress-plugin-git-log',
    {
      additionalArgs: '--no-merge',
      onlyFirstAndLastCommit: true,
    },
    'vuepress-plugin-table-of-contents',
    '@vuepress/last-updated',
    '@vuepress/blog',
    {
      directories: [
        {
          // Unique ID of current classification
          id: 'post',
          // Target directory
          dirname: '_posts',
          // Path of the `entry page` (or `list page`)
          path: '/',
        },
      ],
    },
  ]
}
