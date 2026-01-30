import type {
  Config as ThemeConfig
} from '@vue/theme'
export const sidebar: ThemeConfig['sidebar'] = {
  '/guide/': [{
      text: 'Getting Started',
      items: [{
          text: 'Introduction',
          link: '/guide/introduction'
        },
        {
          text: 'Quick Start',
          link: '/guide/quick-start'
        },
      ]
    },
    {
      text: "Command",
      link: "/guide/cli"
    },
    {
      text: "Make a package",
      items: [{
        text: "Project",
        link: "/guide/init"
      },
      {
        text: "Project structure",
        link: "/guide/init#structure"
      }
    },
    {
      text: "Beta",
      items: [{
        text: "mcx",
        link: "/guide/mcx"
      }]
    }
  ],
  '/examples/': [{
    text: 'Basic',
    items: [{
      text: 'Hello World',
      link: '/examples/hello-world'
    }]
  }]
}
const nav: ThemeConfig['nav'] = [{
    text: 'Docs',
    activeMatch: `^/(guide|examples)/`,
    items: [{
        text: 'Examples',
        link: '/examples/hello-world'
      },
      {
        text: 'Quick Start',
        link: '/guide/quick-start'
      },
      {
        text: "Overview",
        link: "/guide/introduction"
      }
    ]
  },
  {
    text: "lang",
    items: [{
        text: "中文",
        link: "https://zh.mbler-docs.ruanhor.dpdns.org"
      },
      {
        text: "English",
        link: "https://mbler-docs.ruanhor.dpdns.org"
      }
    ]
  }
]
export default {
  title: 'Mbler Docs',
  description: 'Mbler Docs',
  srcDir: "src",
  themeConfig: {
    footer: {
      license: {
        text: 'MIT License',
        link: 'https://opensource.org/licenses/MIT'
      }
    },
    nav,
    sidebar,
    socialLinks: [{
      icon: 'github',
      link: 'https://github.com/RuanhoR/mbler'
    }]
  },
  markdown: {
    html: false
  }
}