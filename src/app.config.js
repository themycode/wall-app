export default {
  pages: [
    'pages/index/index',
    'pages/widgets/index',
    'pages/about/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '壁纸应用',
    navigationBarTextStyle: 'black',
    navigationStyle: 'default',
    enablePullDownRefresh: false,
    // enableIntersectionObserver: true // 启用交叉观察器
  },
  tabBar: {
    color: '#999',
    selectedColor: '#333',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/tabbar/home.png',
        selectedIconPath: 'assets/tabbar/home-active.png'
      },
      {
        pagePath: 'pages/widgets/index',
        text: '组件',
        iconPath: 'assets/tabbar/widget.png',
        selectedIconPath: 'assets/tabbar/widget-active.png'
      },
      {
        pagePath: 'pages/about/index',
        text: '我的',
        iconPath: 'assets/tabbar/about.png',
        selectedIconPath: 'assets/tabbar/about-active.png'
      }
    ]
  }
}
