const ApiRootUrl = 'https://changqingmao.xyz/';

module.exports = {
  AuthLoginByWeixin: ApiRootUrl + "api/account/login",  //用户后台登录
  CreateRoom: ApiRootUrl + "api/room/createroom",  //创建房间
  GetRoomInfo: ApiRootUrl + "api/room/GetRoomInfo",  //获取房间信息
  GetIdentityCardsInfo: ApiRootUrl + "api/room/GetIdentityCardsInfo",  //获取当前房间身份牌
};