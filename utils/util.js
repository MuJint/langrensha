var api = require('../api/api.js');
var app = getApp();
var canReLogin = true;

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * forEach
 */
if (typeof Array.prototype.forEach != 'function') {
  Array.prototype.forEach = function(callback) {
    for (var i = 0; i < this.length; i++) {
      callback.apply(this, [this[i], i, this]);
    }
  };
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "POST") {
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'changqing-Header-Token': wx.getStorageSync('token')
      },
      success: function(res) {
        if (res.data.code == 200) {
          if (res.data != undefined && res.data.msg == "令牌无效，此请求被拒绝！") {
            //需要登录后才可以操作
            console.error('令牌无效，此请求已被拒绝！');
            wx.showLoading({
              title: '重新登录..',
            })
            setTimeout(function() {
              wx.hideLoading();
            }, 2000)
            if (canReLogin) {
              canReLogin = false;
              getApp().reLogin();
              //30秒之内签名错误，不再从新登陆
              setTimeout(function() {
                canReLogin = true;
              }, 30000);
            }
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }

      },
      fail: function(err) {
        reject(err)
        console.log("failed")
      }
    })
  });
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function(resolve, reject) {
    wx.login({
      success: function(res) {
        if (res.code) {
          try {
            resolve(res);
          } catch (e) {
            console.log(e)
          }
        } else {
          reject(res);
        }
      },
      fail: function(err) {
        reject(err);
      }
    });
  });
}

function getUserInfo() {
  return new Promise(function(resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function(res) {
        resolve(res);
      },
      fail: function(err) {
        reject(err);
      }
    })
  });
}

module.exports = {
  formatTime: formatTime,
  request,
  getUserInfo,
  login,
}