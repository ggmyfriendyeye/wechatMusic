Page({

  /**
   * 页面的初始数据
   */
  data: {
      songList:null, // 歌曲列表
      album:null  // 专辑
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var Id = options.id;
    var name = options.name;

    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 10000
    })

    this.getAlbum(Id)   // 调用获取专辑详情函数
  },

  // 请求专辑详情数据
  getAlbum(id) {
    var _this = this;
    wx.request({
      url: `http://47.106.141.113:3000/album?id=${id}`,
      method: 'GET',
      dataType: 'json',
      data: null,
      header: { 'content-type': 'application/json' },
      success: function (res) {
        // 数据请求完成关闭加载
        wx.hideToast()

        var song = res;
        _this.setData({
          songList: res.data.songs,
          album: res.data.album
        })

         console.log('专辑 ==>', song )
        // 将数据存在本地
        wx.setStorageSync("music_list", res.data.songs)
      }
    })
  },
  // 跳转到播放页面
  goPath(e) {
    let{id, name} = e.currentTarget.dataset.base;
   
    let { index } = e.currentTarget.dataset;

    wx.navigateTo({
      url: `../play/index?id=${id}&name=${name}&index=${index}`,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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