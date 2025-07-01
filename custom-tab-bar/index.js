Component({
  data: {
    isBorder: false, // 边框是否显示
    showTabBar: true,
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      "pagePath": "/pages/index/index",
      "iconPath": "../static/icon/tabBar/tabBar_index.png",
      "selectedIconPath": "../static/icon/tabBar/tabBar_logo.png",
      "text": "拜访"
    },
    {
      "pagePath": "/pages/history/history",
      "iconPath": "../static/icon/tabBar/tabBar_my.png",
      // "selectedIconPath": "../static/icon/tabBar/tabBar_my_active.png",
      "selectedIconPath": "../static/icon/tabBar/tabBar_logo.png",
      "text": "记录"
    }]
  },
  attached() { },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({
        url
      })
    }
  }
})