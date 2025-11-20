import { showMessage } from '../../utils/tools';

const app = getApp()
Page({
  data: {
    imageUrl: 'https://cdn.guangfkm.cn/images/Usage-Guide.jpg'
  },
  onLoad() {
    wx.showLoading({
      title: '正在加载...',
    })
  },
  loadImage(){
    wx.hideLoading()
  },
  errorImage(){
    wx.hideLoading()
    this.message('error', '使用指南加载失败，请稍后再试！', 3000)
  },
  message(type, text, duration = 1500) {
    showMessage(type, text, duration, this);
  }
})