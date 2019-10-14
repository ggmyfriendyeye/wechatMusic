Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
   		danmuList: [
      {
        text: '第 1s 出现的弹幕',
        color: '#ff0000',
        time: 1
      },
      {
        text: '第 3s 出现的弹幕',
        color: '#ff00ff',
        time: 3
      }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 10000
    })
     if(options.id) {
       var Id = options.id;
       
       this.getMvUrl(Id)
     }
    
  },

  // 请求mv播放地址
  getMvUrl(id) {
  var _this = this;
    wx.request({
      url: `http://47.106.141.113:3000/mv/url?id=${id}`,
      method: 'GET',
      dataType: 'json',
      data: null,
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log('url ==>', res)
        // 数据请求完成关闭加载
        wx.hideToast()

        _this.setData({
          url: res.data.data.url
        })

      }
    })
  },
  videoPlay: function () {
    this.videoContext.play();
  },
  //暂停
  videoPause: function () {
    this.videoContext.pause();
  },
  //写弹幕
  bindInputBlur: function (e) {
    this.inputValue = e.detail.value
  },//获取视频
  bindButtonTap: function () {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: ['front', 'back'],
      success: function (res) {
        that.setData({
          src: res.tempFilePath
        })
      }
    })
  },
  //发送弹幕
  bindSendDanmu: function () {
    var _this = this;
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: _this.getRandomColor()
    })
  },
   getRandomColor() {//随机获取颜色
    let rgb = []
  for(let i = 0 ; i< 3; ++i){
  let color = Math.floor(Math.random() * 256).toString(16)
  color = color.length == 1 ? '0' + color : color
  rgb.push(color)
}
return '#' + rgb.join('')
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '在线播放',
    })

    this.videoContext = wx.createVideoContext('myVideo');//获取上下文
    this.videoContext.requestFullScreen();//执行全屏方法
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})