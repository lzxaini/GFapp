Page({
  goTeamInfo(e) {
    console.log("🥵 ~ goTeamInfo ~ e: ", e)
    let { flag } = e?.currentTarget?.dataset
    wx.navigateTo({
      url: `/pages/work-team/work-team?editFlag=${flag}`,
    });
  },
})