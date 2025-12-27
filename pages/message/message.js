import tabService from '../../utils/tab-service';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    delType: 'line', // all全部删除，line删除条
    showDelDialog: false,
    reviewShow: false,
    reviewStatus: '1',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    //更新底部高亮
    tabService.updateIndex(this, 2)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  // 删除消息
  onDelete(e) {
    let {
      type
    } = e?.currentTarget?.dataset
    this.setData({
      delType: type,
      showDelDialog: true
    })
  },
  // 提交删除
  submitDelDialog() {
    console.log('删除消息', this.data.delType)
  },
  // 关闭删除弹窗
  closeDialog(e) {
    const {
      type
    } = e.currentTarget.dataset;
    this.setData({
      [type]: false
    });
  },
  // 审核
  goReview() {
    this.setData({
      reviewShow: true
    })
  },
  radioChange(e) {
    const {
      value
    } = e?.detail;
    this.setData({
      reviewStatus: value
    })
  },
})