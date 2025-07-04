Page({
  data: {},
  // 上传团队封面
  updateTeamCover() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        // 这里假设有上传接口 /api/upload
        wx.uploadFile({
          url: 'https://your-api-domain.com/api/upload', // 替换为你的上传接口
          filePath: tempFilePath,
          name: 'file',
          success: (uploadRes) => {
            // 上传成功后的处理，比如保存图片地址到data
            const data = JSON.parse(uploadRes.data);
            this.setData({
              teamCover: data.url // 假设返回的图片地址字段为url
            });
            wx.showToast({ title: '上传成功', icon: 'success' });
          },
          fail: () => {
            wx.showToast({ title: '上传失败', icon: 'none' });
          }
        });
      },
      fail: () => {
        wx.showToast({ title: '未选择图片', icon: 'none' });
      }
    });
  }
})