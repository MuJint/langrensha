// pages/createR/index.js
import Toast from '../../dist/toast/toast';
var api = require('../../api/api.js');
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    person_step: 62.5, //初始人数条
    wolf_step: 60, //初始狼人条
    sumPerson: 9, //参与人数
    sumWolf: 3, //狼人人数
    radio: '2', //默认屠边
    loading: false, //不加载
    initPerson: { //默认配置
      hunter: 1, //猎人
      witch: 1, //女巫
      prophet: 1, //预言家
      guard: 0, //守卫
      idiot: 0, //白痴
      villager: 3, //村民
      wolf: 3, //狼人
      sheriff: 2, //警长票数
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  onDrag(event) {
    this.setData({
      sumPerson: Math.ceil(event.detail.value / 6.25)
    })
  },
  onDrag_wolf(event) {
    this.setData({
      sumWolf: Math.ceil(event.detail.value / 20)
    })
  },
  onChange(event) {
    this.setData({
      radio: event.detail
    });
  },
  //推荐设置
  setIdentity() {
    let initPerson = this.data.initPerson,
      that = this
    switch (this.data.sumPerson) {
      case 9:
        initPerson.hunter = 1
        initPerson.witch = 1
        initPerson.prophet = 1
        initPerson.wolf = 3
        initPerson.villager = 3
        initPerson.guard = 0
        initPerson.idiot = 0
        initPerson.sheriff = 0
        break;
      case 10:
        initPerson.hunter = 1
        initPerson.witch = 1
        initPerson.prophet = 1
        initPerson.wolf = 3
        initPerson.villager = 4
        initPerson.guard = 0
        initPerson.idiot = 0
        initPerson.sheriff = 0
        break;
      case 11:
        initPerson.hunter = 1
        initPerson.witch = 1
        initPerson.prophet = 1
        initPerson.wolf = 4
        initPerson.villager = 3
        initPerson.guard = 0
        initPerson.idiot = 1
        initPerson.sheriff = 3
        break;
      case 12:
        initPerson.hunter = 1
        initPerson.witch = 1
        initPerson.prophet = 1
        initPerson.wolf = 4
        initPerson.villager = 4
        initPerson.guard = 0
        initPerson.idiot = 1
        initPerson.sheriff = 3
        break;
      case 13:
        Toast('目前没有推荐配置，请自行配置')
        break;
      case 14:
        Toast('目前没有推荐配置，请自行配置')
        break;
      case 15:
        Toast('目前没有推荐配置，请自行配置')
        break;
      case 16:
        Toast('目前没有推荐配置，请自行配置')
        break;
    }
    this.setData({
      initPerson: initPerson,
      sumWolf: initPerson.wolf,
      sumPerson: that.reckonPerson(),
      person_step: that.reckonPerson() * 6.25,
      wolf_step: initPerson.wolf * 20
    })
  },
  //头像单点
  identityClick(event) {
    // 1 2 3 4 5 6 7 8  hunter witch prophet wolf villager guard idiot sheriff
    let initPerson = this.data.initPerson,
      that = this,
      sumPerson = this.data.sumPerson
    switch (parseInt(event.currentTarget.dataset.index)) {
      case 1:
        Toast('当前局只能有1个猎人')
        break;
      case 2:
        Toast('当前局只能有1个女巫')
        break;
      case 3:
        Toast('当前局只能有1个预言家')
        break;
      case 4:
        initPerson.wolf = initPerson.wolf + 1
        break;
      case 5:
        initPerson.villager = initPerson.villager + 1
        break;
      case 6:
        initPerson.guard = initPerson.guard + 1
        break;
      case 7:
        initPerson.idiot = initPerson.idiot + 1
        break;
      case 8:
        if (parseInt(initPerson.sheriff) < 4) {
          initPerson.sheriff = initPerson.sheriff + 0.5;
        } else {
          Toast('最高4票，0.5票算作一人')
        }
        break;
    }
    if (that.reckonPerson() <= 16) {
      this.setData({
        initPerson: initPerson,
        sumPerson: that.reckonPerson(),
        sumWolf: initPerson.wolf,
        person_step: that.reckonPerson() * 6.25,
        wolf_step: initPerson.wolf * 20
      })
    } else {
      Toast('超过最大人数十六人')
    }
  },
  //计算总人数
  reckonPerson() {
    let initPerson = this.data.initPerson
    let sumPerson = initPerson.hunter + initPerson.witch + initPerson.prophet + initPerson.wolf + initPerson.villager + initPerson.guard + initPerson.idiot
    return sumPerson;
  },
  btnCreate() {
    let that = this,
      initPerson = this.data.initPerson
    this.setData({
      loading: true
    })
    //请求创建房间
    util.request(api.CreateRoom, {
      openid: app.globalData.userInfo.openid,
      gamer: that.reckonPerson(),
      wolf: initPerson.wolf,
      villager: initPerson.villager,
      witch: initPerson.witch,
      prophet: initPerson.prophet,
      hunter: initPerson.hunter,
      idiot: initPerson.idiot,
      guard: initPerson.guard,
      sheriff: initPerson.sheriff
    }).then(res => {
      if (res.code == 200) {
        wx.redirectTo({
          url: '/pages/room/room?roomid=' + res.data.id,
        })
      }
    })
  }
})