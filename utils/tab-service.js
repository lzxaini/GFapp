// tabBar的data
let tabData = {
  tabIndex: 0, //底部按钮高亮下标
  tabBar: {
    custom: true,
    color: "#5F5F5F",
    selectedColor: "#07c160",
    backgroundColor: "#F7F7F7",
    list: []
  }
}

// 更新菜单
const updateRole = (that, type, dept) => {
  //这里设置权限（分2种权限，权限1显示1，2，3；权限2显示4，5，6，7；）
  if (type === '1') {
    tabData.tabBar.list = [{
        "pagePath": "pages/agent-device-list/agent-device-list?deptInfo=" + dept,
        "iconPath": "../static/icon/tabBar/my_menu_1.png",
        "selectedIconPath": "../static/icon/tabBar/my_menu_1.png",
        "text": "首页"
      }, {
        "pagePath": "pages/operation/operation",
        "iconPath": "../static/icon/tabBar/my_menu_1.png",
        "selectedIconPath": "../static/icon/tabBar/my_menu_1.png",
        "text": "运营"
      },
      {
        "pagePath": "pages/message/message",
        "iconPath": "../static/icon/tabBar/my_menu_1.png",
        "selectedIconPath": "../static/icon/tabBar/my_menu_1.png",
        "text": "消息"
      },
      {
        "pagePath": "pages/my/my",
        "iconPath": "../static/icon/tabBar/my_menu_1.png",
        "selectedIconPath": "../static/icon/tabBar/my_menu_1.png",
        "text": "我的"
      }
    ]
  } else if (type === '2') {
    tabData.tabBar.list = [{
        "pagePath": "pages/agent-device/agent-device?deptInfo=" + dept,
        "iconPath": "../static/icon/tabBar/my_menu_1.png",
        "selectedIconPath": "../static/icon/tabBar/my_menu_1.png",
        "text": "首页"
      }, {
        "pagePath": "pages/operation/operation",
        "iconPath": "../static/icon/tabBar/my_menu_1.png",
        "selectedIconPath": "../static/icon/tabBar/my_menu_1.png",
        "text": "运营"
      },
      {
        "pagePath": "pages/message/message",
        "iconPath": "../static/icon/tabBar/my_menu_1.png",
        "selectedIconPath": "../static/icon/tabBar/my_menu_1.png",
        "text": "消息"
      },
      {
        "pagePath": "pages/my/my",
        "iconPath": "../static/icon/tabBar/my_menu_1.png",
        "selectedIconPath": "../static/icon/tabBar/my_menu_1.png",
        "text": "我的"
      }
    ]
  } else if (type === '3') {
    tabData.tabBar.list = [{
        "pagePath": "pages/store-device/store-device?deptInfo=" + dept,
        "iconPath": "../static/icon/tabBar/my_menu_1.png",
        "selectedIconPath": "../static/icon/tabBar/my_menu_1.png",
        "text": "首页"
      }, {
        "pagePath": "pages/operation/operation",
        "iconPath": "../static/icon/tabBar/my_menu_1.png",
        "selectedIconPath": "../static/icon/tabBar/my_menu_1.png",
        "text": "运营"
      },
      {
        "pagePath": "pages/message/message",
        "iconPath": "../static/icon/tabBar/my_menu_1.png",
        "selectedIconPath": "../static/icon/tabBar/my_menu_1.png",
        "text": "消息"
      },
      {
        "pagePath": "pages/my/my",
        "iconPath": "../static/icon/tabBar/my_menu_1.png",
        "selectedIconPath": "../static/icon/tabBar/my_menu_1.png",
        "text": "我的"
      }
    ]
  } else {
    tabData.tabBar.list = [{
        "pagePath": "pages/device-list-tab/device-list-tab",
        "iconPath": "../static/icon/tabBar/my_menu_1.png",
        "selectedIconPath": "../static/icon/tabBar/my_menu_1.png",
        "text": "首页"
      }, {
        "pagePath": "pages/operation/operation",
        "iconPath": "../static/icon/tabBar/my_menu_1.png",
        "selectedIconPath": "../static/icon/tabBar/my_menu_1.png",
        "text": "运营"
      },
      {
        "pagePath": "pages/message/message",
        "iconPath": "../static/icon/tabBar/my_menu_1.png",
        "selectedIconPath": "../static/icon/tabBar/my_menu_1.png",
        "text": "消息"
      },
      {
        "pagePath": "pages/my/my",
        "iconPath": "../static/icon/tabBar/my_menu_1.png",
        "selectedIconPath": "../static/icon/tabBar/my_menu_1.png",
        "text": "我的"
      }
    ]
  }
  updateTab(that);
}

// 更新底部高亮
const updateIndex = (that, index) => {
  tabData.tabIndex = index;
  updateTab(that);
}

// 更新Tab状态
const updateTab = (that) => {
  if (typeof that.getTabBar === 'function' && that.getTabBar()) {
    that.getTabBar().setData(tabData);
  }
}

// 将可调用的方法抛出让外面调用
module.exports = {
  updateRole,
  updateTab,
  updateIndex,
  tabBar: tabData.tabBar.list
}