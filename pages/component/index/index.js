var sliderWidth = 96;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    deskIndex: 0,
    currentIndex: 0,
    isShow: false,
    isFans: false,
    classIndex: 0,
     dataList:null,
     banners:null,
     diantai:null,
     // 推存电台
    playlist: null,
    showBar :false,
     nvaData:[
       { text: '排行榜', url:'../../../image/排行榜.png'},
       { text: '歌手馆', url: '../../../image/歌手.png' },
       { text: '分类歌单', url: '../../../image/分类.png' },
       { text: '私人电台', url: '../../../image/线性_电台.png' },
       { text: '福利专区', url: '../../../image/我的福利.png' }              
     ],
     // 推存歌单数据
     songList:null
  },

  changeTab: function (event) {
    let that = this;
    let { index } = event.currentTarget.dataset;
    that.setData({ deskIndex: index, currentIndex: index });
    console.log(index);

  },

  //数据接受
  goPath: function (e) {
    var postad = e.currentTarget.dataset.index;
    console.log('index ==>', postad)
    wx.navigateTo({
      url: '../detail/index?id=' + postad
    })

  },

// 跳转搜索
  goPast() {
    
    wx.switchTab({
      url: '../search/index'
    })
    
  },

  // 弹出层
  layout() {
      this.setData({
        showBar: true
      })    
  },

  dropDown(event) {
    this.setData({
      showBar: false
    })   
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let that = this;
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 10000
    })
   //轮播图图片
    wx.request({
      url: 'http://47.106.141.113:3000/banner?type=1', 
       method: 'GET',
       dataType: 'json', 
       data: null,
       header: { 'content-type': 'application/json' },
      success: function (res) { 
        // console.log('this is put request result', res) 
        // 数据请求完成关闭加载
        wx.hideToast()
        
        that.setData({
          dataList: res.data,
          banners: res.data.banners.slice(0, 5),
          diantai: res.data.banners.slice(5)
        })
        
        } 
        })
       

        // 推存歌单 http://258o8p3553.wicp.vip/personalized
    wx.request({
      url: 'http://47.106.141.113:3000/personalized',
      method: 'GET',
      dataType: 'json',
      data: null,
      header: { 'content-type': 'application/json' },
      success: function (res) {
        // console.log('this is put request result', res)

        that.setData({
          songList: res.data.result
        })

      }
    })

    this.getData(this) //调用推存电台接口
  

  },

// 获取数据的函数 需要传入参数url
  getData( _this) {
    let url = 'http://47.106.141.113:3000/top/playlist/highquality?before=1503639064232&limit=30';  // 精品歌单接口
    wx.request({
      url: url,
      method: 'GET',
      dataType: 'json',
      data: null,
      header: { 'content-type': 'application/json' },
      success: function (res) {
        // console.log('this is put request result', res)
       _this.setData({
         playlist: res.data.playlists
       })
      }
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
    // console.log('diantai ==>',this.data.diantai)
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