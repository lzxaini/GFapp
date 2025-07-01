var oldX = 0;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //是否展示
    isShow: {
      type: Boolean,
      value: false
    },
    //是否允许关闭
    enableClose: {
      type: Boolean,
      value: true
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    backImg: [
      'https://cdn.fxnws.com/beasun/verify/verify_1.jpg',
      'https://cdn.fxnws.com/beasun/verify/verify_2.jpg',
      'https://cdn.fxnws.com/beasun/verify/verify_3.jpg'
    ],
    backIndex: 0,
    isShow: false,
    isMove: false, //是否移动中
    status: -1, //状态 -1 初始值，1，成功，0 失败
    box: {
      width: 100,
      height: 100,
      back: ''
    }, //背景框大小
    position: {
      left: 200,
      top: 29,
      left2: 0,
    } //滑块位置
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //事件绑定
    //滑块事件
    startClick(e) {
      this.setData({
        isMove: true
      });
      if (e.touches.length > 0) {
        oldX = e.touches[0].pageX;
      }
    },
    moveClick(e) {
      var _this = this;
      var newX = 0;
      if (e.touches.length > 0) {
        newX = e.touches[0].pageX;
      }
      var span = newX - oldX;
      span = Math.max(span, 0);
      span = Math.min(span, _this.data.box.width - 50);
      _this.setData({
        'position.left2': span
      });
    },
    endClick() {
      var _this = this;
      //处理结果判断
      var position = _this.data.position;
      var span = Math.abs(position.left2 - position.left);
      if (span > 3) {
        _this.setData({
          isMove: false,
          status: 0
        });
        setTimeout(() => {
          _this.refereshClick();
        }, 1000);
        //触发失败
        _this.triggerEvent('onerror', {}, {
          bubbles: false,
          composed: false
        });
      } else {
        _this.setData({
          isMove: false,
          status: 1
        });
        //1秒后关闭
        setTimeout(() => {
          _this.setData({
            isShow: false
          });
          _this.refereshClick();
        }, 1000);
        //触发成功
        _this.triggerEvent('onsuccess', {}, {
          bubbles: false,
          composed: false
        });
      }
    },
    //刷新
    refereshClick() {
      // 随机数
      let num = Math.floor(Math.random() * 2)
      var _this = this;
      var box = this.data.box;
      //随机宽度，高度
      var left = Math.round(Math.random() * (box.width - 100)) + 50;
      var top = Math.round(Math.random() * (box.height - 60)) + 20;
      _this.setData({
        'position.left': left,
        'position.top': top,
        'position.left2': 0,
        status: -1,
        isMove: false,
        'box.back': _this.data.backImg[num]
      });
    },
    //关闭
    closeClick() {
      this.setData({
        isShow: false
      });
    }
  },
  lifetimes: {
    ready() {
      var _this = this;
      //获取系统信息计算图片宽度高度
      wx.getSystemInfo({
        success: (result) => {
          var width = result.screenWidth - 20 - 20;
          var height = width / 16 * 9;
          _this.setData({
            box: {
              width: width,
              height: height
            }
          });
          //随机初始化位置
          _this.refereshClick();
        },
      })
    }
  }
})
