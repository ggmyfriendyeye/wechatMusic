Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:null,
    description:'',
    name:'',
    tracks: null
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

    var postId = options.id;
    
  // /playlist/detail?id=24381616
  let that = this;
    wx.request({
      url: `http://47.106.141.113:3000/playlist/detail?id=${postId}`,
      method: 'GET',
      dataType: 'json',
      data: null,
      header: { 'content-type': 'application/json' },
      success: function (res) {
        // console.log('this is put request result', res) 
       
        wx.hideToast()  // 数据请求完成关闭加载

        that.setData({
          dataList: res.data.playlist.coverImgUrl,
          name: res.data.playlist.name,
          description: res.data.playlist.description,
          tracks: res.data.playlist.tracks
        })
           
           // 将数据存在本地
        wx.setStorageSync("music_list", res.data.playlist.tracks)
      }
    })

  },

  //数据接受
  goPath: function (e) {
    var datas = e.currentTarget.dataset.lists;
    var index = e.currentTarget.dataset.index;
    var id = datas.id;
    var name = datas.name;
    var url = datas.al.picUrl;
    //参数被url截断了 、需要编码传送，解码接收
    wx.navigateTo({
      url: `../play/index?id=${id}&name=${name}&img=${encodeURIComponent(url)}&index=${index}`
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '歌单详情',
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