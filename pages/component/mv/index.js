Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: null
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

    var Id = options.id;
    console.log('id ==>',Id)

    this.getMv(Id)  //调用mv数据函数
  },

  // 请求mv数据
  getMv(id) {
    let _this = this;
    wx.request({
      url: `http://47.106.141.113:3000/mv/detail?mvid=${id}`,
      method: 'GET',
      dataType: 'json',
      data: null,
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log('mv ==>', res) 
        // 数据请求完成关闭加载
        wx.hideToast()

        _this.setData({
          dataList: res.data.data
        })

      }
    })
  },

  //
  goPlay(e) {
    var datas = e.currentTarget.dataset.base;
    var id = datas.id;
    var name = datas.name;
    console.log('id ==>',id)

    wx.navigateTo({
      url: `../pmv/index?id=${id}&name=${name}`,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: 'mv详情'
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