import WeCropper from '../../utils/we-cropper/we-cropper.js' // 之前复制过来的we-cropper.js的位置

const app = getApp()
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 80
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cropperOpt: {
      id: 'cropper',
      targetId: 'targetCropper',
      pixelRatio: device.pixelRatio,
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 160) / 2,
        y: (height - 240) / 2,
        width: 160,
        height: 240
      },
      boundStyle: {
        color: "green",
        mask: 'rgba(0,0,0,0.8)',
        lineWidth: 1
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    this.setData({
      'cropperOpt.src': option.src
    })
  },
  onReady() {
    const { cropperOpt } = this.data
    let _this = this
    this.cropper = new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        // let { baseWidth, baseHeight } = ctx
      })
      .on('beforeImageLoad', (ctx) => {
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        wx.hideToast()
      })
  },
  touchStart(e) {
    this.cropper.touchStart(e)
  },
  touchMove(e) {
    this.cropper.touchMove(e)
  },
  touchEnd(e) {
    this.cropper.touchEnd(e)
  },
  // 点击取消，返回上一页
  cancel() {
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      })
    }, 1000)
  },
  uploadImage() {
    this.cropper.getCropperImage()
      .then((src) => {
        wx.showLoading({
          title: '上传中...',
          mask: true,
        })
        let pages = getCurrentPages();
        // 获取前一个页面的对象
        let page = pages[pages.length - 2];
        wx.uploadFile({
          url: app.globalData.baseUrl + '/resource/oss/uploadNoToken', // 上传接口
          filePath: src,
          name: 'file',
          formData: { picture: 'picture' },
          success: (e) => {
            try {
              let res = JSON.parse(e.data)
              function extractPath(url) {
                const match = url.match(/^https?:\/\/[^/]+(\/.*)$/);
                return match ? match[1] : url;
              }
              const path = extractPath(res.data.url);
              const ossUrl = app.globalData.ossUrl + path;
              if (page && page.setData) {
                // 调用前一个页面的 setData 方法
                page.setData({
                  'from.picture': ossUrl
                });
                // 更新前一页的fileList
                if (page.data.fileList) {
                  page.setData({
                    fileList: [...page.data.fileList, { url: ossUrl, status: 'done' }]
                  });
                } else {
                  page.setData({
                    fileList: [{ url: ossUrl, status: 'done' }]
                  });
                }
              }
              wx.hideLoading()
              wx.navigateBack({
                delta: 1 // 返回上一页
              });
            } catch (error) {
              wx.hideLoading()
              console.log("🥵 ~ onUpload ~ error: ", error)
              wx.showToast({
                icon: 'error',
                title: '上传失败',
              })
            }
          },
          fail: (err) => {
            wx.hideLoading()
            console.log("🥵 ~ fail ~ err: ", err)
            wx.showToast({
              icon: 'error',
              title: '上传失败',
            })
          }
        });
      })
      .catch((err) => {
        console.log("🥵 ~ uploadImage ~ err: ", err)
        wx.showModal({
          title: '温馨提示',
          content: '操作失败'
        })
      })
  },
})