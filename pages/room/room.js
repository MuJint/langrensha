// pages/room/room.js
var app = getApp();
var initRe = '等待开始\n人满自动开始\n'
var extraLine = [];
import Toast from '../../dist/toast/toast';
var api = require('../../api/api.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: '', //系统高
    currentInput: initRe, //记录
    gameInit: false, //是否已经开始游戏
    gameSheriff: false, //是否在警长投票阶段
    gameDay: 0, //游戏进程
    gamerId: 0, //当前游戏者ID
    gameWolf: false, //狼人进行
    gameProp: false, //预言家进行
    gameWitch: false, //女巫进行
    gemeHunter: false, //猎人进行
    gemeGuard: false, //守卫进行
    gameIdiot: false, //白痴进行时
    gameIdent: '', //当前游戏者身份
    wolfWork: [], //狼人击杀状态
    guardWork: [], //守卫守人状态
    witchWork: [{
      antidote: 1,
      poison: 1
    }], //女巫用药状态
    gamer: [{
      avatarUrl: '', //头像
      userId: 0, //用户ID
      seatN: 1, //座位号
      ident: '', //身份
      simple_I: '', //身份简写
      alive: true, //默认存活
    }, {
      avatarUrl: '',
      userId: 0,
      seatN: 2,
      ident: '',
      simple_I: '',
      alive: true,
    }, {
      avatarUrl: '',
      userId: 0,
      seatN: 3,
      ident: '',
      simple_I: '',
      alive: true,
    }, {
      avatarUrl: '',
      userId: 0,
      seatN: 4,
      ident: '',
      simple_I: '',
      alive: true,
    }, {
      avatarUrl: '',
      userId: 0,
      seatN: 5,
      ident: '',
      simple_I: '',
      alive: true,
    }, {
      avatarUrl: '',
      userId: 0,
      seatN: 6,
      ident: '',
      simple_I: '',
      alive: true,
    }, {
      avatarUrl: '',
      userId: 0,
      seatN: 7,
      ident: '',
      simple_I: '',
      alive: true,
    }, {
      avatarUrl: '',
      userId: 0,
      seatN: 8,
      ident: '',
      simple_I: '',
      alive: true,
    }, {
      avatarUrl: '',
      userId: 0,
      seatN: 9,
      ident: '',
      simple_I: '',
      alive: true,
    }, {
      avatarUrl: '',
      userId: 0,
      seatN: 10,
      ident: '',
      simple_I: '',
      alive: true,
    }, {
      avatarUrl: '',
      userId: 0,
      seatN: 11,
      ident: '',
      simple_I: '',
      alive: true,
    }, {
      avatarUrl: '',
      userId: 0,
      seatN: 12,
      simple_I: '',
      alive: true,
    }, {
      avatarUrl: '',
      userId: 0,
      seatN: 13,
      ident: '',
      simple_I: '',
      alive: true,
    }, {
      avatarUrl: '',
      userId: 0,
      seatN: 14,
      ident: '',
      simple_I: '',
      alive: true,
    }, {
      avatarUrl: '',
      userId: 0,
      seatN: 15,
      ident: '',
      simple_I: '',
      alive: true,
    }, {
      avatarUrl: '',
      userId: 0,
      seatN: 16,
      ident: '',
      simple_I: '',
      alive: true,
    }], //玩家
    room_Info: {}, //房间信息
    identiCards: {}, //身份牌信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取房间 并加入房间
    if (options.roomid.length > 0) {
      this.getRoomInfo(parseInt(options.roomid))
    }
    //获取高度
    this.getAppheight()
    //坐下
    this.sitDown()
    //轮询房间是否人满
    this.isStartGame()
    console.log(this.data)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 获取房间信息
   * 身份牌信息 
   * 加入房间
   */
  getRoomInfo(roomid) {
    let that = this
    util.request(api.GetRoomInfo, {
      roomid: roomid
    }).then(res => {
      if (res.code == 200) {
        that.setData({
          room_Info: res.data
        })
      }
    })
    util.request(api.GetIdentityCardsInfo, {
      roomid: roomid
    }).then(res => {
      if (res.code == 200) {
        that.setData({
          identiCards: res.data
        })
      }
    })
  },
  /**获取屏幕高度 */
  getAppheight() {
    let that = this
    wx.getSystemInfo({
      success: res => {
        that.setData({
          //windowHeight 为屏幕可用高度
          winHeight: res.windowHeight
        })
      }
    })
  },
  /**
   * 增加字幕 
   */
  addRe(str) {
    extraLine.push(str)
    this.setData({
      currentInput: initRe + '\n' + extraLine.join('\n')
    })
  },
  /**
   * 头像点击
   * 游戏未开始 换位置
   * 游戏开始并且在警长投票时 投票功能
   * 查看资料 该位置有人并且不在警长投票
   */
  avatarClick(e) {
    let that = this,
      gamer = this.data.gamer,
      uid = app.globalData.userInfo.id,
      url = "https://yzxtapi.xnxv.cn/yzxt/img/avatar_yuxinya.jpeg",
      index = parseInt(e.currentTarget.dataset.index),
      isSitdown = false,
      sumPerson = this.data.room_Info.roomGamer
    //换位置
    if (!this.data.gameInit) {
      if (index > sumPerson) {
        Toast('此位置不能坐下')
        return false;
      }
      let t = {},
        t_NULL = {},
        seatID = 0
      gamer.forEach(item => {
        //此位置没有人
        if (item.seatN == index && item.userId == 0) {
          t = {
            avatarUrl: url,
            userId: uid,
            seatN: index,
            ident: '',
            simple_I: ''
          }
        }
        //记录原有位置ID
        if (item.userId == uid) {
          seatID = item.seatN
          t_NULL = {
            avatarUrl: '',
            userId: 0,
            seatN: item.seatN,
            ident: '',
            simple_I: ''
          }
        }
        if (item.seatN == index && item.userId != 0) {
          isSitdown = true
        }
      })
      //在原位置查看资料
      if (isSitdown) {
        //调取查看资料函数
      } else {
        //清除原位置
        gamer.splice(seatID - 1, 1, t_NULL)
        //坐下新位置
        gamer.splice(index - 1, 1, t)
      }
    }
    //狼人进行时
    if (this.data.gameWolf) {
      that.wolfWork(index)
    }
    this.setData({
      gamer: gamer
    })
  },
  /**
   * 进入房间坐下位置
   */
  sitDown() {
    let that = this,
      gamer = this.data.gamer,
      uid = app.globalData.userInfo.id,
      url = "https://yzxtapi.xnxv.cn/yzxt/img/avatar_yuxinya.jpeg",
      t = {},
      isUse = false
    gamer.forEach(item => {
      //开始循环，位置没人坐下，然后退出
      if (item.userId == 0 && !isUse) {
        t = {
          avatarUrl: url,
          userId: uid,
          seatN: item.seatN,
          ident: '',
          simple_I: ''
        }
        gamer.splice(item.seatN - 1, 1, t)
        isUse = true
      }
    })
    this.setData({
      gamer: gamer
    })
  },
  /**
   * 轮询房间是否人满
   */
  isStartGame() {
    let gamer = this.data.gamer,
      that = this
    var startGame = setInterval(function() {
      if (that.data.room_Info.joinGamer == that.data.room_Info.roomGamer) {
        clearInterval(startGame)
        that.addRe('人已满，即将自动开始游戏')
        that.addRe('开始游戏后不可退出房间，请至网络状态良好环境下游戏')
        that.iniTsleep(2000)
        that.addRe('3')
        that.iniTsleep(1000)
        that.addRe('2')
        that.iniTsleep(1000)
        that.addRe('1')
        that.iniTsleep(1000)
        //执行开始游戏函数
        that.initGame()
      }
      console.log('正在轮询房间是否人满')
    }, 4000)
  },
  /**
   * 延迟函数
   */
  iniTsleep(delay) {
    var start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay) {
      continue;
    }
  },
  /**
   * 开始游戏
   */
  initGame() {
    //闭麦
    //分发身份
    console.log('闭麦')
    this.randomGamer()
    console.log('分发身份')
    this.judegeWork()
    console.log('法官工作')
  },
  /**
   * 分发身份
   * 根据房间人数来分发，分发身份牌根据房间信息
   * */
  randomGamer() {
    var gamer = this.data.gamer,
      sumPerson = 12,
      step = 0,
      t = {},
      that = this
    var initArr = ['狼人', '女巫', '狼人', '预言家', '村民', '村民', '白痴', '狼人', '狼人', '村民', '猎人', '村民'];
    gamer.forEach(item => {
      if (step < sumPerson) {
        let index = Math.floor(Math.random() * initArr.length)
        t = {
          avatarUrl: item.avatarUrl,
          userId: item.userId,
          seatN: item.seatN,
          ident: initArr[index],
          simple_I: that.simplIdent(initArr[index])
        }
        gamer.splice(item.seatN - 1, 1, t)
        initArr.splice(index, 1)
        step++;
      }
    })
    this.setData({
      gamer: gamer
    })
  },
  /**
   * 法官开始工作
   */
  judegeWork() {
    let that = this
    //变更游戏状态
    this.setData({
      gameInit: true
    })
    that.addRe('天黑请闭眼，狼人请睁眼，请确认你们的同伴及今晚要刀的对象。点击头像即可')
  },
  /**
   * 狼人事件
   * seatNo 座位号
   */
  wolfWork(seatNo) {
    let that = this,
      gamer = this.data.gamer
    gamer.forEach(item => {

    })
  },
  /**
   * 返回简写身份
   */
  simplIdent(str) {
    let res = ''
    if (str.indexOf('白痴') != -1) {
      res = '白'
    } else if (str.indexOf('预言家') != -1) {
      res = '预'
    } else if (str.indexOf('村民') != -1) {
      res = '民'
    } else if (str.indexOf('女巫') != -1) {
      res = '巫'
    } else if (str.indexOf('猎人') != -1) {
      res = '猎'
    } else if (str.indexOf('狼人') != -1) {
      res = '狼'
    } else if (str.indexOf('守卫') != -1) {
      res = '守'
    }
    return res
  },
})