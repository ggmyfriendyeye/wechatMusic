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
    hot1: ["狂狼", "心如止水", "缘分一道桥", "黎明前的黑暗","学猫叫"],
    hot2: ["遇见", "你的酒馆对我打了洋", "I LOVE YOU", "绿色","将盗行"],
    songer1:["周杰伦","华晨宇","邓丽君","刀郎","张杰"],
    songer2: ["冯提莫", "薛之谦", "花粥", "林俊杰", "刘珂矣"],
    zhuanJi1:["抖音","生僻字","心如止水","黎明前的黑暗"],
    zhuanJi2: ["缘分一道桥", "98k", "儿歌"],
    fm:["来自天堂的魔鬼","心如止水","98k","生僻字"],
    searchValue:'',
    beginShow: false,
    song:null, // 单曲
    songerList:null, // 歌手
    albumList:null,  // 专辑
    mvList:null     // mv
  },
  changeTab: function (event) {
    let that = this;
    let { index } = event.currentTarget.dataset;
    that.setData({ deskIndex: index, currentIndex: index });

  },
  //swiper切
  bindchange: function (event) {

    let that = this;

    let current = event.detail.current;

    that.setData({ deskIndex: current });

  },
  changeDate(e) {
    var text = e.currentTarget.dataset.text;
    this.setData({
      searchValue: text
    })
  },

  // 搜索
  Search() {
    var key = this.data.searchValue;
    this.getData(key,this)

  },

  getData(keywords,_this) {
    var count = this.data.deskIndex;
   if(!keywords) {

     wx.showToast({
       title: '关键字不能为空',
       icon: 'loading',
       duration: 10000
     })

     setTimeout(function () {
       wx.hideToast()
     }, 2000)

   }else{
     if (count === 0) {
       wx.showToast({
         title: '正在加载',
         icon: 'loading',
         duration: 10000
       })
       wx.request({
         url: `http://47.106.141.113:3000/search?type=1&keywords=${keywords}`,
         method: 'GET',
         dataType: 'json',
         data: null,
         header: { 'content-type': 'application/json' },
         success: function (res) {
           // 数据请求完成关闭加载
           wx.hideToast()

           var song = res.data;
           _this.setData({
             song: res.data.result.songs,
             beginShow: true
           })
         
          //  console.log('单曲 ==>', song )
           // 将数据存在本地
           wx.setStorageSync("music_list", res.data.result.songs)
         }
       })

     } else if (count === 1) {
        
       wx.showToast({
         title: '正在加载',
         icon: 'loading',
         duration: 10000
       })
       
       wx.request({
         url: `http://47.106.141.113:3000/search?type=100&keywords=${keywords}`,
         method: 'GET',
         dataType: 'json',
         data: null,
         header: { 'content-type': 'application/json' },
         success: function (res) {
           // 数据请求完成关闭加载
           wx.hideToast()

           var songer = res.data;
           _this.setData({
             songerList: res.data.result.artists,
           })

          //  console.log('歌手 ==>', songer)

         }
       })

     } else if (count === 2) {
       
       wx.showToast({
         title: '正在加载',
         icon: 'loading',
         duration: 10000
       })

       wx.request({
         url: `http://47.106.141.113:3000/search?type=10&keywords=${keywords}`,
         method: 'GET',
         dataType: 'json',
         data: null,
         header: { 'content-type': 'application/json' },
         success: function (res) {
           // 数据请求完成关闭加载
           wx.hideToast()

           var album = res.data;
           _this.setData({
             albumList: res.data.result.albums,
             //  beginShow: true
           })

          //  console.log('专辑 ==>', album)
         }
       })
     } else if (count === 3) {
       wx.showToast({
         title: '正在加载',
         icon: 'loading',
         duration: 10000
       })
       wx.request({
         url: `http://47.106.141.113:3000/search?type=1004&keywords=${keywords}`,
         method: 'GET',
         dataType: 'json',
         data: null,
         header: { 'content-type': 'application/json' },
         success: function (res) {
           // 数据请求完成关闭加载
           wx.hideToast()
           console.log('mv ==>', mv)
           var mv = res.data;
           if(!res.data.result) {
             return;
           }
           _this.setData({
             mvList: res.data.result.mvs
           })

          
           
           // 将数据存在本地
           wx.setStorageSync("music_list", res.data.result.mvs)
         }
       })

     } else {
         return;
     }
   }
  },
// 搜索框的val值
  changeInputVal(e) {
    this.setData({
      searchValue: e.detail.value
    })
  },

  // 跳转到播放页面
  goPath(e) {
    var datas = e.currentTarget.dataset.list;
   var index = e.currentTarget.dataset.index;
   var id = datas.id;
   var name = datas.name;
  //  console.log('id ==>',id)

   wx.navigateTo({
     url: `../play/index?id=${id}&name=${name}&index=${index}`,
   })
  },

// 跳转到歌手详情
  getPath(e) {
    var datas = e.currentTarget.dataset.list;
    var index = e.currentTarget.dataset.index;
    var id = datas.id;
    var name = datas.name;
    //  console.log('id ==>',id)

    wx.navigateTo({
      url: `../songer/index?id=${id}&name=${name}&index=${index}`,
    })
  },

  // 跳转到专辑详情
  goPast(e) {
    var datas = e.currentTarget.dataset.album;
    var id = datas.id;
    var name = datas.name;
    //  console.log('id ==>',id)
    wx.navigateTo({
      url: `../album/index?id=${id}&name=${name}`,
    })
  },

  // 跳转到MV详情
  goHost(e) {
    var id = e.currentTarget.dataset.base;
    wx.navigateTo({
      url: `../mv/index?id=${id}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '热门搜索'
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