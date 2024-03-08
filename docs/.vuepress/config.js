module.exports = {
  title: 'chumeng 博客',
  description: '学习记录',
  theme: 'reco',
  locales: {
        '/': {
          lang: 'zh-CN'
        }
  },
  themeConfig: {
        subSidebar: 'auto',
        nav: [
            { text: '首页', link: '/' },
            { 
                text: '--', 
                items: [
                    { text: 'baidu', link: 'https://baidu.com' },
                    { text: '--', link: '--' }
                ]
            }
        ],
        sidebar: [
            {
                title: '首页',
                path: '/',
                collapsable: false, // 不折叠
                // children: [
                //     { title: "学前必读", path: "/" }
                // ]
            },
            {
              title: "Java",
              path: '/Java',
              collapsable: true, // 折叠
              children: [
                { title: "常用API", path: "/Java/api" },
                { title: "test", path: "/Java/test" },
              ],
            },
            {
              title: "数据库",
              path: '/database',
              collapsable: true, // 折叠
              children: [
                { title: "MySQL自测", path: "/database/learn" }
              ],
            },
            {
              title: "随笔",
              path: '/essay',
              collapsable: true, // 折叠
              children: [
                { title: "bug记录", path: "/essay/bug" }
              ],
            },
            {
              title: "网络",
              path: '/code',
              collapsable: true, // 折叠
              children: [
                { title: "Xray", path: "/code/xray" }
              ],
            }
        ]
    }
}