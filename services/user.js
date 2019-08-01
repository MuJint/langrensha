var app = getApp();

const util = require('../utils/util.js');
const api = require('../api/api.js');

/**
 * 调用微信登录
 */
function loginByWeixin(userData) {
  let code = null;
  return new Promise(function (resolve, reject) {
    return util.login().then((res) => {
      code = res.code;
      console.log('AuthLoginByWeixin');
      //登录服务器
      util.request(api.AuthLoginByWeixin, {
        code: code
      }, 'POST').then(res => {
        if (res.code === 200) {
          wx.setStorageSync('token', res.data.key);
          wx.setStorageSync('openid', res.data.openid);
          console.log(res.data.user);
          resolve(res.data.user);
        } else {
          console.error("服务器登录失败", res);
          reject(false);
        }
      }).catch((err) => {
        console.error("服务器登录失败", err);
        reject(err);
      });
    }).catch((err) => {
      console.error("微信登录失败");
      reject(err);
    })
  });
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('userInfo')) {
      util.checkSession().then((res) => {
        resolve(true);
      }).catch((e) => {
        reject(false);
      });
    } else {
      reject(false);
    }
  });
}

module.exports = {
  loginByWeixin,
  checkLogin,
};