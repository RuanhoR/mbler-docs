import type {
  Config as ThemeConfig
} from '@vue/theme';
export const sidebar: ThemeConfig['sidebar'] = {
  '/guide/': [{
      text: 'Tutorials',
      items: [{
          text: 'Introduction',
          link: '/guide/introduction'
        },
        {
          text: 'Get Started',
          link: '/guide/quick-start'
        },
        {
          text: 'Project Structure',
          link: '/guide/project'
        },
        {
          text: 'Command Usage',
          link: '/guide/cli'
        },
        {
          text: 'mbler.config.js',
          link: '/guide/mbler-config'
        },
        {
          text: 'Create Projects with Mcx (Beta)',
          link: '/guide/mcx'
        },
        {
          text: 'Vscode Extension',
          link: '/guide/vscode'
        },
        {
          text: 'MNX Marketplace',
          link: '/guide/mnx'
        },
        {
          text: 'Troubleshooting & FAQ',
          link: '/guide/troubleshooting'
        }
      ]
    },
    {
      text: 'Internal Implementation',
      items: [{
          text: 'Mbler',
          link: '/guide/internal/mbler'
        },
        {
          text: 'Mcx Core',
          link: '/guide/internal/mcx'
        },
        {
          text: 'Runtime Framework',
          link: '/guide/internal/runtime'
        }
      ]
    }
  ]
};
const nav: ThemeConfig['nav'] = [{
    text: 'Documentation',
    activeMatch: `^/(guide|examples)/`,
    items: [{
        text: 'Get Started',
        link: '/guide/quick-start'
      },
      {
        text: 'Introduction',
        link: '/guide/introduction'
      }
    ]
  },
  {
    text: 'Language',
    items: [{
        text: 'Chinese',
        link: "https://zh-mbler-docs.ruanhor.dpdns.org"
      },
      {
        text: 'English',
        link: "https://mbler-docs.ruanhor.dpdns.org"
      }
    ]
  },
  {
    text: "Sitemap",
    link: "/sitemap.xml"
  }
];
export default {
  title: 'Mbler Docs',
  description: 'Mbler Docs',
  srcDir: "src",
  themeConfig: {
    outline: {
      level: [1, 2, 3, 4, 5, 6],
    },
    search: {
      provider: 'local',
    },
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
  },
  base: "/"
};