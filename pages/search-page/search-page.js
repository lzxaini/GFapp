Page({
  data: {
    searchName: '',
    historyTag: [],
  },
  onLoad() {
    // 页面加载时读取本地历史
    const history = wx.getStorageSync('searchHistory') || [];
    this.setData({ historyTag: history });
  },
  searchTeam() {
    // $TODO 待完善搜索团队功能
    console.log('测试', this.data.searchName)
    this.saveHistory(this.data.searchName);
  },
  searchInput(e) {
    let { value } = e?.detail
    this.setData({ searchName: value })
  },
  // 点击历史搜索自动带入输入框
  clickTagname(e) {
    let { tag } = e?.currentTarget?.dataset
    this.setData({ searchName: tag })
    this.searchTeam()
  },
  clickDel() {
    // 清除历史搜索
    wx.removeStorageSync('searchHistory');
    this.setData({ historyTag: [] });
  },
  // 保存历史搜索
  saveHistory(keyword) {
    if (!keyword || !keyword.trim()) return;
    let history = wx.getStorageSync('searchHistory') || [];
    // 去重，最新的放最前面
    history = history.filter(item => item !== keyword);
    history.unshift(keyword);
    // 最多保存10条
    if (history.length > 10) history = history.slice(0, 10);
    wx.setStorageSync('searchHistory', history);
    this.setData({ historyTag: history });
  }
})