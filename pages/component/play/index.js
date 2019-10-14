const backgroundAudioManager = wx.getBackgroundAudioManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '../../../image/ajf.png', // 播放按钮图片切换
    animationData:{},
    isShow: true,
    Id:'',        // 当前歌曲id
    songName:'',  // 当前歌曲名
    img:'',       // 当前歌曲图片
    tag: true,
    duration:'00:00',
    currentTime:'00:00',
    progress: '',
    propWidth: 0,   // 进度条宽度
    lyricArr: null,   // 歌词
    count: 0,
    top: 0,
    musicList: null,   // 音乐列表
    num: '' ,  //上一首 下一首
    showLyr:true,  // 有无歌词
    isCollaction: false,  // 是否收藏
    col_img: '../../../image/a_r.png',
    collectionSong:[],  // 收藏歌曲数组
  },
  // 歌词列表显示
  showTag() {
    var that = this;
    that.setData({
      isShow: (!that.data.isShow)
    })
  },

  // 歌词列表显示
  toAttention() {
    var that = this;
    that.setData({
      isShow: (!that.data.isShow)
    })
   
  },

  // 音乐播放功能  图片切换
  Playing() {

  let that = this;

    if(this.data.tag) {
      console.log('tag ==>',this.data.tag)
      this.setData({
        url: '../../../image/ajd.png',
        tag: false
      })

      backgroundAudioManager.play();   // 播放
      
// 监听播放拿取播放进度
      backgroundAudioManager.onTimeUpdate(() => {
        var duration = backgroundAudioManager.duration;
        var currentTime = backgroundAudioManager.currentTime;
        that.timeChange(duration, currentTime)
        that.handleLyric(currentTime)
        //  console.log('----', backgroundAudioManager.currentTime, '+++++', backgroundAudioManager.duration)
      })
     
    }else{
      console.log('tag ==>', this.data.tag)

      this.setData({
        tag: true,
        url: '../../../image/ajf.png'
      })

      backgroundAudioManager.pause()  // 暂停
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    var that = this;
   if(options.id) {  // 当前歌曲id存在
    
     if (!options.img) {
       this.setData({
         img: '../../../image/play.png',
         songName: options.name,
         Id: options.id,
         num: options.index
       })
     }else{

       this.setData({
         img: decodeURIComponent(options.img),
         songName: options.name,
         Id: options.id,
         num: options.index
       })

     }
     
     // 获取进度条的宽度
     wx.createSelectorQuery().selectAll('.layer').boundingClientRect(function (rect) {
       that.setData({
         propWidth: rect[0].width
       })

     }).exec()

     this.getUrl(options.id, options.name)            // 调用歌曲播放地址函数
     this.getLyric(options.id, this)                  // 调用获取歌词函数
   
     this.Playing() // 进入播放页面开始播放

     backgroundAudioManager.onPlay(() => {
       console.log("音乐播放开始");
     })

     backgroundAudioManager.onEnded(() => {
       console.log("音乐播放结束");
       that.setData({
         tag: true,
         url: '../../../image/ajf.png'
       })
     })

    
    // 获取本地的音乐列表数据
    var music_list = wx.getStorageSync("music_list");
    this.setData({
      musicList: music_list
    })
   }
       
  },
   // 时间格式化
  timeChange(td, currentTime) {
   var that = this;
    var fen = parseInt(td / 60);
    var miao = parseInt(td % 60);
    miao = miao < 10 ? "0" + miao : miao;
    var time = fen + ':' + miao;

    if (currentTime % 60 < 10) {
      this.setData({
        currentTime: parseInt(currentTime / 60) + ':0' + parseInt(currentTime % 60),
        duration: time
      })
    } else {
      this.setData({
        currentTime: parseInt(currentTime / 60) + ':' + parseInt(currentTime % 60),
        duration: time
      })
    }
    

      // 进度条比例
      var progress = (currentTime / td) * that.data.propWidth;

      that.setData({
        progress: progress
      })
  },

  // 获取歌曲播放地址函数
  getUrl(id,songName) {
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 10000
    })
   var that = this;
    wx.request({
      url: `http://47.106.141.113:3000/song/url?id=${id}`,
      method: 'GET',
      dataType: 'json',
      data: null,
      header: { 'content-type': 'application/json' },
      success: function (res) {
        // console.log('url ==>', res)
        if(!res) {
         return;
        }
        wx.hideToast()  // 数据请求完成关闭加载
        var url = res.data.data[0].url;
       
        backgroundAudioManager.src = url;
        backgroundAudioManager.title = songName;
    
      }
    })
  },
  // 获取歌词
  getLyric(Id,that) {
    wx.request({
      url: `http://47.106.141.113:3000/lyric?id=${Id}`,
      method: 'GET',
      dataType: 'json',
      data: null,
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log('lyric ==>',res);

        // 是否有歌词
        if (res.data.lrc) {
          
          // 显示歌词状态 true
          that.setData({
            showLyr: true
          })

          var lyric = res.data.lrc.lyric;
          // 存放匹配后的歌词
          var lyricArr = [];
          // 清除换行符
          var line = lyric.split('\n');

          // console.log('line ==>',line)
          // \d{2} 表示匹配两个数字
          var timeReg = /\[\d{2}:\d{2}.\d{2,3}]/g;
          var results = [];
          if (line != "") {
            for (let i in line) {
              var time = line[i].match(timeReg);
              if (!time) continue;
              var value = line[i].replace(timeReg, "");
              for (let j in time) {
                var t = time[j].slice(1, -1).split(':');
                var timeArr = parseInt(t[0], 10) * 60 + parseFloat(t[1]);

                // console.log('timeArr :', timeArr)
                results.push([timeArr, value])
              }
            }
          }

          results.sort(function (a, b) {
            return a[0] - b[0];
          });
          lyricArr = results;
          that.setData({
            lyricArr: lyricArr
          })

        } else {

          that.setData({
            lyricArr: "暂无歌词",
            showLyr: false
          })
          return
        }
      }
    })
  },
 // 歌词滚动函数
  handleLyric(currentTime) {
    var lyric = this.data.lyricArr;
    var _this = this;

    if (!lyric) {
      return;
    }

    for (var i = 0; i < lyric.length - 1; i++) {
      var time1 = lyric[i][0];
      var time2 = lyric[i+1][0];

      if (currentTime >= time1 && currentTime < time2) {
        _this.setData({
          count: i
        })
        if (i > 6) {
          _this.setData({
            top: -(i - 2) * 30
          })
        }
        break;
      }
    }
   
  },

  // 下一首
  next() {
    var that = this;
    var num = this.data.num;
    var currentData = null;
    var list = this.data.musicList;
    if(!this.data.tag) {
            this.setData({
              tag: true
            })
    }
   
    num++;
    if(list.length === 1) {
      return;
    }
    if(num > list.length - 1) {
      num = 0;
    }
    console.log('num ==>', num)
    that.setData({
      num:num
    })
    
    for(var i=0; i<list.length; i++) {
       if(num === i) {
         currentData = list[i]
       }
    }
    // console.log('currentData ==>', currentData)
 // 下一首的歌名
    if (currentData.al) {
      that.setData({
        songName: currentData.name,
        img: currentData.al.picUrl,
        Id: currentData.id
      })
     
    }else{
      that.setData({
        songName: currentData.name,
        img: '../../../image/play.png',
        Id: currentData.id
      })
    }
    this.getUrl(currentData.id, currentData.name)
   
    setTimeout(() => {
      this.Playing()   // 调用音乐播放函数
    },1000)
   
   
   
  },

  // 上一首
  prev() {
    if (!this.data.tag) {
      this.setData({
        tag: true
      })
    }
    var that = this;
    var num = this.data.num;
    var currentData = null;
    var list = this.data.musicList;

    num--;
    if (list.length === 1) {
      return;
    }
    if(num < 0) {
      num = list.length - 1;
    }
    console.log('num ==>', num)
    that.setData({
      num: num
    })

    for (var i = 0; i < list.length; i++) {
      if (num === i) {
        currentData = list[i]
      }
    }
// 上一首的歌名
    if (currentData.al) {
      that.setData({
        songName: currentData.name,
        img: currentData.al.picUrl,
        Id: currentData.id
      })

    } else {
      that.setData({
        songName: currentData.name,
        img: '../../../image/play.png',
        Id: currentData.id
      })
    }
    this.getUrl(currentData.id, currentData.name)

    setTimeout(() => {
      this.Playing()   // 调用音乐播放函数
    }, 1000)

  },


  // 收藏功能
  cellaction() {
    console.log(11111)
    var songName = this.data.songName;  // 当前歌曲名
    var id = this.data.Id;  // 当前歌曲id
    var img = this.data.img; // 当前歌曲图片
    var isCol = this.data.isCollaction;
    var currentList = {
      "songName": songName,
      "id": id,
      "img": img
    }

    if (!isCol) {
      this.setData({
        isCollaction: true,
        col_img: '../../../image/a_t.png'
      })
      this.data.collectionSong.push(currentList);
      wx.setStorageSync("collectionData", this.data.collectionSong)
    }else {
      this.setData({
        isCollaction: false,
        col_img: '../../../image/a_r.png'
      })
    }

   




  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '在线播放',
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // innerAudioContext.src = this.data.url;
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
    // this.data.innerAudioContext.destroy();
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



 // timer = setInterval(() => {
      //   wx.getBackgroundAudioPlayerState({
      //     success: function (res) {
      //       //调用需要更新的

      //       const status = res.status
      //      const dataUrl = res.dataUrl
      //      const currentPosition = res.currentPosition
      //      const duration = res.duration
      //      const downloadPercent = res.downloadPercent

      //       console.log('status ==>',status);
            // if (currentPosition === duration) {
            //      that.setData({
            //     tag: true,
            //     url: '../../../image/ajf.png'
            //   })
            //     clearInterval(timer);  // 清除定时器
            //   return;
            // }
            // if(status === 2) {  // 音乐播放完
            //   that.setData({
            //     tag: true,
            //     url: '../../../image/ajf.png'
            //   })
              // wx.stopBackgroundAudio()
              // clearInterval(timer);  // 清除定时器
              // return;
            // }
      //       that.timeChange(duration, currentPosition)
      //       that.handleLyric(currentPosition, that)
      //     }
      //   });
      // }, 1000);

          // wx.playBackgroundAudio({
        //   dataUrl: url,
        //   title: songName,
        // })
