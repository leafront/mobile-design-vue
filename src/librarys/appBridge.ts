/**
 * 启用webview动桥接设置
 * @param {String} cbName 注册的函数名
 * @param {Function} fn 回调函数
 */
function wbBridgeSetup(cbName, fn) {
  window.setupWebViewJavascriptBridge(function (bridge) {
    // console.log('设置成功')
    if (cbName && fn) {
      // console.log('注册函数', cbName, fn)
      bridge.registerHandler(cbName, fn)
    }
  })
}

/**
 * APP功能暴露接口
 * @param {String} type 调用那个功能 setTitle | getCity | toast | enableRefresh | showProgress
 * | getUserInfo | tel | contacts | share | isLogin | wxpay | alipay
 * @param params 各个功能需要的参数
 * @param {*} cfn 设置成功后的回调函数
 *
 */

interface CallbackFn {
  (): void
}

function apwbBridge(type, params?: any, cfn: CallbackFn = function () {}) {
  // console.log('调用类型: ', type, params, cfn)
  let wbB = window.WebViewJavascriptBridge
  if (!wbB) {
    setTimeout(() => {
      wbB = window.WebViewJavascriptBridge
      // alert(wbB)
      // if (!wbB) console.error('任然无法使用window.WebViewJavascriptBridge对象')
      wbB && wbB.callHandler(type, params, cfn)
    }, 0)
  } else {
    wbB.callHandler(type, params, cfn)
  }
}

/**
 * 设置webview的标题
 * @param {String} content  标题名
 * @param {*} cnf 回调函数
 *
 */
function apSetTitle(content) {
  apwbBridge('setTitle', { title: content })
}

// 获取移动设备号
function apGetDeviceNo(cb) {
  apwbBridge('getDeviceNo', undefined, cb)
}

/**
 * toash
 * @param {*String} content 文本
 */
function apToast(content) {
  apwbBridge('toast', { content })
}
// 返回
function back() {
  apwbBridge('back', undefined)
}
// 获取顶部状态栏高度
function getStatusBarHeight(params, cb) {
  apwbBridge('getStatusBarHeight', params, cb)
}
// 改变顶部状态栏字体颜色
function setStatusBarStyle(params) {
  apwbBridge('setStatusBarStyle', params)
}

/**
 * 关闭webView侧滑功能
 * @param {*} params
 * @param {*} cfn
 */
function apForbidEdgeGes(params) {
  apwbBridge('forbidEdgeGes', params)
}

// 本地获取token
function getUserInfo(cfn) {
  apwbBridge('getUserInfo', undefined, cfn)
}

// 跳转地址
function apNavigate(params) {
  apwbBridge('navigate', params)
}

/**
 * 当前定位信息，经纬度城市等
 * @param  标题名
 * @param {*} cnf 回调函数
 *
 */
function apGetLocation(cfn) {
  apwbBridge('getLocation', undefined, cfn)
}

/**
 * 关闭webview回传给原生参数
 * @param {Object} params  标题名
 * @param {*} cnf 回调函数
 *
 */
function apOperateCallback(params, cfn?: any) {
  apwbBridge('operateCallback', params, cfn)
}

// 关闭
function apClose() {
  apwbBridge('close', undefined)
}

// 关闭webview并跳转
function apdismissPresentContrllerAndJump(param) {
  apwbBridge('dismissPresentContrllerAndJump', param)
}

function apStopMoving(param) {
  apwbBridge('moving', param)
}

export {
  wbBridgeSetup,
  apwbBridge,
  apSetTitle,
  apToast,
  back,
  getStatusBarHeight,
  setStatusBarStyle,
  apForbidEdgeGes,
  getUserInfo,
  apNavigate,
  apGetDeviceNo,
  apGetLocation,
  apOperateCallback,
  apClose,
  apdismissPresentContrllerAndJump,
  apStopMoving
}
