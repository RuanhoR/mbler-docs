export default {
  title: 'Mbler Docs',
  description: 'Mbler Docs',
  themeConfig: {
    nav: [{
        text: '中文',
        link: '/zh'
      },
      {
        text: 'English',
        link: '/en'
      }
    ],

    sidebar: [{
      text: '中文',
      items: [{
          text: '开始',
          link: '/zh/start'
        },
        {
          text: 'API 文档',
          link: '/zh/api/'
        }
      ]
    }, {
      text: 'English',
      items: [{
          text: 'Getting started',
          link: '/en/start'
        },
        {
          text: 'API Docs',
          link: '/en/api/'
        }
      ]
    }],

    socialLinks: [{
      icon: 'github',
      link: 'https://github.com/vuejs/vitepress'
    }]
  }
}