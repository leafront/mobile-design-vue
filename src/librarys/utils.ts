import 'url-search-params-polyfill'

interface CallbackFn {
  <T>(data: T): void
}

const ua = navigator.userAgent

const isIOS = ua && /iPhone|iPad|iPod/gi.test(ua)
const isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1
const isApp = !!ua.match(/hobby/)
const isWeixin = ua.indexOf('MicroMessenger') > -1

function prefixZero(val: string | number): string {
  if (val < 10) {
    return '0' + val
  } else {
    return '' + val
  }
}

function getAppVersion() {
  const ua = navigator.userAgent
  const reg = /hobby\/(\S*)/
  const rets = ua.match(reg) && ua.match(reg)[1]
  if (rets) {
    return rets
  } else {
    return getQueryParams('appVersion') || ''
  }
}

function toFixed(number, n = 2) {
  if (n > 20 || n < 0) {
    throw new RangeError('toFixed() digits argument must be between 0 and 20')
  }
  if (isNaN(number) || number >= Math.pow(10, 21)) {
    return number.toString()
  }
  if (typeof n == 'undefined' || n == 0) {
    return Math.round(number).toString()
  }
  let result = number.toString()

  const arr = result.split('.')
  // 整数的情况
  if (arr.length < 2) {
    result += '.'
    for (let i = 0; i < n; i += 1) {
      result += '0'
    }
    return result
  }
  const integer = arr[0]
  const decimal = arr[1]
  if (decimal.length == n) {
    return result
  }
  if (decimal.length < n) {
    for (let i = 0; i < n - decimal.length; i += 1) {
      result += '0'
    }
    return result
  }
  result = integer + '.' + decimal.substr(0, n)
  const last = decimal.substr(n, 1)
  // 四舍五入，转换为整数再处理，避免浮点数精度的损失
  if (parseInt(last, 10) >= 5) {
    const x = Math.pow(10, n)
    result = (Math.round(parseFloat(result) * x) + 1) / x
    result = result.toFixed(n)
  }
  return result
}

/**
 * @param fn {Function}   实际要执行的函数
 * @param wait {Number}  执行间隔，单位是毫秒（ms）
 * @return {Function}     返回一个“节流”函数
 */
function throttle(func: CallbackFn, wait: number): CallbackFn {
  let lastTime = null
  let timeout = null
  return function (...args) {
    const context = this
    const now = new Date().getTime()
    // 如果上次执行的时间和这次触发的时间大于一个执行周期，则执行
    if (now - lastTime - wait > 0) {
      // 如果之前有了定时任务则清除
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      func.apply(context, args)
      lastTime = now
    } else if (!timeout) {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
  }
}
/**
 * @param {Function} fn   实际要执行的函数
 * @param { Number } wait  执行间隔，单位是毫秒（ms）
 * @return {Function}     返回一个“防抖”函数
 */
function debounce(func: CallbackFn, wait: number): CallbackFn {
  let lastTime = null
  let timeout = null
  return function (...args) {
    const context = this
    const now = new Date().getTime()
    // 判定不是一次抖动
    if (now - lastTime - wait > 0) {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    } else {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
    // 注意这里lastTime是上次的触发时间
    lastTime = now
  }
}
/**
 * @param {Object} obj
 * @returns {string} result
 */
function queryStringify(obj: any): string {
  if (!obj) {
    return ''
  }
  function toQueryPair(key, value) {
    if (value == '') {
      return key
    }
    return key + '=' + encodeURIComponent(value === '' ? '' : String(value))
  }

  let result = []
  Object.keys(obj).forEach((key) => {
    key = encodeURIComponent(key)
    const values = obj[key]
    if (values && values.constructor == Array) {
      const queryValues = []
      for (let i = 0, len = values.length; i < len; i++) {
        queryValues.push(toQueryPair(key, values[i]))
      }
      result = result.concat(queryValues)
    } else {
      result.push(toQueryPair(key, values))
    }
  })

  return result.join('&')
}

function compareVersion(ver1, ver2) {
  // ver1>ver2 = 1 ver1<ver2 = -1;ver1===ver2 = 0
  const ver1List = ver1.split('.')
  const ver2List = ver2.split('.')
  let res = 0
  for (let i = 0; i < ver1List.length; i++) {
    if (ver1List[i] !== ver2List[i]) {
      res = ~~ver1List[i] > ~~ver2List[i] ? 1 : -1
      break
    }
  }
  return res
}

/**
 * @param {String || null } val
 * @return {Object |  String} result
 */
function getQueryParams(val: string): string {
  const searchParams = new URLSearchParams(location.search)
  const result = Object.create(null)
  searchParams.forEach((value, key) => {
    result[key] = value
  })
  if (val) {
    return result[val]
  } else {
    return result
  }
}
function getPassiveValue(): any {
  let supportsPassiveOption = false
  try {
    addEventListener(
      'test',
      null,
      Object.defineProperty({}, 'passive', {
        get: function () {
          supportsPassiveOption = true
        }
      })
    )
  } catch (e) {}
  //{passive: true} 就不会调用 preventDefault 来阻止默认滑动行为
  return supportsPassiveOption ? { passive: true, capture: true } : true
}
function trim(text): string {
  if (text) {
    return text.replace(/\s+/g, '')
  } else {
    return ''
  }
}
function getUniqueId(randomLength = 10): string {
  let idStr = Date.now().toString(36)
  idStr += Math.random().toString(36).substr(3, randomLength)
  return idStr
}
function getFontSize() {
  return parseFloat(document.documentElement.style.fontSize)
}
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
function parseTime(time, cFormat) {
  if (arguments.length == 0) {
    return null
  }
  const isSafariBrowser = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)

  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    if (isSafariBrowser) {
      // 兼容safari浏览器
      date = new Date(time.split('.')[0])
    } else {
      date = new Date(time)
    }
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

function gotoURL(url: string, urlPrefix = 'hobby-business') {
  const pageUrl = `wflks://${location.host}/${urlPrefix}` + url
  location.href = pageUrl
}

/**
 * 金额元转分
 * @param num 金额。
 * @param precision 精度。默认为12，一般选12就能解决掉大部分0001和0009问题，而且大部分情况下也够用了，如果你需要更精确可以调高。
 * @returns {number}
 */
function yuanToFen(num, precision = 12) {
  return +parseFloat((num * 100).toPrecision(precision))
}

/**
 * 金额分转元
 * @param num 金额。
 * @param precision 精度。默认为12，一般选12就能解决掉大部分0001和0009问题，而且大部分情况下也够用了，如果你需要更精确可以调高。
 * @returns {number}
 */
function fenToYuan(price, digit = 2) {
  if (!price && price !== 0) {
    return ''
  } else {
    return Number(toFixed(price / 100, digit))
  }
}

function parsePrice(price, digit = 2) {
  if (!price && price !== 0) {
    return ''
  } else {
    const result = price / 100
    if (Number.isInteger(result)) {
      return result
    } else {
      return formatDecimal(price / 100, digit)
    }
  }
}

function loadScript(url: string, fn?: () => void) {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.charset = 'UTF-8'
  script.src = url
  document.body.appendChild(script)
  script.onload = () => {
    fn && fn()
  }
}

function formatDecimal(num, decimal) {
  if (num == null || num == undefined) {
    return ''
  }
  num = num.toString()
  const index = num.indexOf('.')
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1)
  } else {
    num = num.substring(0)
  }
  return Number(parseFloat(num).toFixed(decimal))
}

export {
  isWeixin,
  isApp,
  isIOS,
  isAndroid,
  loadScript,
  prefixZero,
  parsePrice,
  formatDecimal,
  toFixed,
  parseTime,
  getFontSize,
  getAppVersion,
  getPassiveValue,
  trim,
  getQueryParams,
  getUniqueId,
  queryStringify,
  throttle,
  debounce,
  gotoURL,
  yuanToFen,
  fenToYuan,
  compareVersion
}
