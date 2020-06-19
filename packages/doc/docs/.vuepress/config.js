module.exports = {
  title: '业务组件库',
  description: '校宝业务组件库',
  dest: './public',
  repo: 'http://git.greedyint.com/xb-fe/xb-ui',
  repoLabel: '查看源码',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '组件库', link: '/comp/' },
    ],
    logo: '/logo.png',
    // docsDir: 'src',
    // pageSize: 5,
    // startPage: 0,
    sidebar: [
      '/',
      {
        title: '组件库',
        children: [
          {
            title: '高级筛选组件', // 必要的
            path: '/comp/xbfilter/', // 可选的, 应该是一个绝对路径
            collapsable: false, // 可选的, 默认值是 true,
            sidebarDepth: 2,
            children: [
              {
                title: '基本配置', // 必要的
                path: '/comp/xbfilter/basic.md', // 可选的, 应该是一个绝对路径
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 3,
              },
              {
                title: '进阶配置', // 必要的
                path: '/comp/xbfilter/advance.md', // 可选的, 应该是一个绝对路径
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 3,
              },
              {
                title: '类型参考', // 必要的
                path: '/comp/xbfilter/type.md', // 可选的, 应该是一个绝对路径
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 3,
              },
              {
                title: 'TODO', // 必要的
                path: '/comp/xbfilter/future.md', // 可选的, 应该是一个绝对路径
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 3,
              },
            ],
          },
        ],
      },
    ],
    displayAllHeaders: true,
  },
  head: [
    ['link', { rel: 'icon', sizes: '32x32', href: '/logo.png' }],
    ['link', { rel: 'icon', sizes: '16x16', href: '/logo.png' }],
  ],
  plugins: [
    // require('./plugins/index.js'),
    '@vuepress/active-header-links',
    {
      sidebarLinkSelector: '.sidebar-link',
      headerAnchorSelector: '.header-anchor',
    },
  ],
}
