Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas:null,  // 歌手信息
    musicList:null // 歌曲列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    console.log('id ==>',id)
    this.getSonger(id)   // 调用歌手单曲函数
  },
// 获取歌手单曲
  getSonger(id) {
    var _this = this;
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 10000
    })

    wx.request({
      url: `http://localhost:3000/artists?id=${id}`,
      method: 'GET',
      dataType: 'json',
      data: null,
      header: { 'content-type': 'application/json' },
      success: function (res) {
        // 数据请求完成关闭加载
        wx.hideToast()

        var artist = res.data.artist;
        var hotSongs = res.data.hotSongs;
        
        _this.setData({
          datas: artist,
          musicList: hotSongs
        })

         console.log('data ==>', res.data)

        // 将数据存在本地
        wx.setStorageSync("music_list", hotSongs)
      }
    })
  },
    // 跳转到播放页面
  goPath(e) {
    var datas = e.currentTarget.dataset.count;
    var index = e.currentTarget.dataset.index;
    var id = datas.id;
    var name = datas.al.name;
    var url = datas.al.picUrl;
    //  console.log('id ==>',id)

    wx.navigateTo({
      url: `../play/index?id=${id}&name=${name}&index=${index}&img=${encodeURIComponent(url)}`,
    })
  },
    
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '歌手详情'
    })
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