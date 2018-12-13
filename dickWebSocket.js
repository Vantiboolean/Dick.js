class Websocket {
  constructor(url) {
    wx.connectSocket({
      url: url
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      // wx.sendSocketMessage({
      //   data: 'join',
      // })
    })
    wx.onSocketMessage(function (res) {
      return res
    })
  }
  send(e) {
    wx.sendSocketMessage({
      data: e,
    })
  }
}
export {
  Websocket
}