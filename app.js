//app.js
var util = require('./utils/util.js');
var api = require('./api/api.js');
var user = require('./services/user.js');
App({
  onLaunch: function () {
    //检查是否登录
    user.checkLogin().then(res => {
      console.log("已登陆");
      var app = getApp();
      app.globalData.systemLogin = true;
      app.globalData.userInfo = wx.getStorageSync('userInfo');

    }).catch((res) => {
      console.warn("未登陆");
      var app = getApp();
      //进行后台登录
      user.loginByWeixin().then(res => {
        console.log('后台登录成功');
        app.globalData.systemLogin = true;
        if (res != null && res.openid != '') {
          var userInfo = {
            avataurl: res.avataurl,
            id: res.id,
            nickname: res.nickname,
            openid: res.openid
          };
          wx.setStorageSync('userInfo', userInfo);
          app.globalData.userInfo = userInfo;
        } else {
          wx.navigateTo({
            url: '/pages/login/login',
          });
        }
      }).catch(function (res) {
        console.error(res);
      });
    });
    this.globalData.SystemInfo = wx.getSystemInfoSync()
  },
  reLogin: function () {
    var that = this;
    user.loginByWeixin().then(res => {
      console.log('后台重新登录成功');
      var pages = getCurrentPages() //获取加载的页面

      var currentPage = pages[pages.length - 1] //获取当前页面的对象
      currentPage.onLoad(currentPage.options);
      currentPage.onShow();

      if (res != null && res.openid != '') {
        var userInfo = {
          avataurl: res.avataurl,
          id: res.id,
          nickname: res.nickname,
          openid: res.openid
        };
        wx.setStorageSync('userInfo', userInfo);
        that.globalData.userInfo = userInfo;
      } else {
        wx.navigateTo({
          url: '/pages/login/login',
        });
      }
    });
  },
  globalData: {
    userInfo: {},
    SystemInfo: {}
  }
})