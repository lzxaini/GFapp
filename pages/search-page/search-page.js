Page({
  data: {
    searchName: ''
  },
  searchTeam() {
    // $TODO 待完善搜索团队功能
    console.log('测试', this.data.searchName)
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
  }
})