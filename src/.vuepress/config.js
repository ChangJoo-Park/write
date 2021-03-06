const { description } = require('../../package')
const dayjs = require('dayjs')
const AdvancedFormat = require('dayjs/plugin/advancedFormat')
const localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(AdvancedFormat)
dayjs.extend(localizedFormat)
require('dayjs/locale/en')
require('dayjs/locale/ko')

module.exports = {
  base: '/write/',
  locales: {
    '/': {
      lang: 'ko'
    }
  },
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'ChangJoo Park\'s Write',
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
        text: 'Github',
        link: 'https://github.com/changjoo-park/',
        target:'_blank'
      },
      {
        text: 'Medium',
        link: 'https://medium.com/@changjoopark/',
        target:'_blank'
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
            'deno/',
            'deno/install-deno-macos',
            'deno/denon',
            'deno/first-api-server',
            'deno/test-deno-modules',
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
    [
      'sitemap',
      {
        hostname: 'https://changjoo-park.github.io/write/guide'
      },
    ],
    'vuepress-plugin-git-log',
    {
      additionalArgs: '--no-merge',
      onlyFirstAndLastCommit: true,
    },
    'vuepress-plugin-table-of-contents',
  ]
}
