const pages = [
  'pages/home/index',
  'pages/projects/index',
  'pages/nature-class/index',
  'pages/family-sports/index',
  'pages/booking/index',
  'pages/orders/index',
  'pages/orders/detail',
  'pages/poster/index',
  'pages/login/index',
  'pages/profile/index',
  'pages/reviews/create',
  'pages/reviews/my',
  'pages/admin/index',
  'pages/suggest/index',
  'pages/contact/index'
]

export default defineAppConfig({
  pages,
  tabBar: {
    color: '#8D9685',
    selectedColor: '#388E3C',
    backgroundColor: '#F1F8E9',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: './assets/icons/home_unselected.png',
        selectedIconPath: './assets/icons/home_selected.png'
      },
      {
        pagePath: 'pages/projects/index',
        text: '项目',
        iconPath: './assets/icons/list-middle_unselected.png',
        selectedIconPath: './assets/icons/list-middle_selected.png'
      },
      {
        pagePath: 'pages/orders/index',
        text: '订单',
        iconPath: './assets/icons/clipboard-list_unselected.png',
        selectedIconPath: './assets/icons/clipboard-list_selected.png'
      },
      {
        pagePath: 'pages/contact/index',
        text: '联系',
        iconPath: './assets/icons/contact-support_unselected.png',
        selectedIconPath: './assets/icons/contact-support_selected.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: './assets/icons/account_unselected.png',
        selectedIconPath: './assets/icons/account_selected.png'
      }
    ]
  },
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#388E3C',
    navigationBarTitleText: '趣种地',
    navigationBarTextStyle: 'white'
  },
  permission: {
    'scope.userLocation': {
      desc: '用于展示营地位置并提供导航服务'
    }
  },
  requiredPrivateInfos: ['getLocation', 'chooseLocation']
})
