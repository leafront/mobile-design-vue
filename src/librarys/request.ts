import { queryStringify } from './utils'
import Store from './store'
import { isLocalStorageSupported } from './fun'

interface RequestFn {
  url: string
  method: string
  hostPath?: string
  timeout?: number
  data?: any
  cache?: boolean
  expires?: number
  headers?: {
    [key: string]: string
  }
}

interface Callback {
  (data: unknown, xhrStatus?: number): void
}

function removeStorageData(times: number): void {
  const storage = isLocalStorageSupported() ? localStorage : window.name
  if (!storage) {
    return
  }
  Object.keys(storage).forEach((item) => {
    const data = Store.get(item, 'local')
    if (data && data.times && times > data.times) {
      Store.remove(item, 'local')
    }
  })
}

function xhr({
  hostPath = location.origin,
  url,
  timeout = 60000,
  method,
  headers,
  data
}: RequestFn): Promise<{ result: any; xhrStatus?: number }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const bodyData =
      headers['Content-Type'] == 'application/json' ? JSON.stringify(data) : queryStringify(data)
    const httpUrl = method == 'GET' && data ? url + '?' + bodyData : url
    xhr.open(method, hostPath + httpUrl, true)
    xhr.timeout = timeout
    Object.keys(headers).forEach((key) => {
      xhr.setRequestHeader(key, headers[key])
    })
    xhr.responseType = 'json'
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        const xhrStatus = xhr.status
        const responseData = xhr.response
        if ((xhrStatus >= 200 && xhrStatus < 300) || xhrStatus == 304) {
          resolve({ result: responseData })
        } else {
          reject({ result: responseData, xhrStatus })
        }
      }
    }
    method == 'GET' ? xhr.send(null) : xhr.send(bodyData)
  })
}

export default function dispatchRequest(
  {
    url,
    method,
    timeout,
    data = null,
    cache = false,
    expires = 5 * 60 * 1000,
    headers,
    hostPath
  }: RequestFn,
  successCallback?: Callback,
  failCallback?: Callback
): Promise<any> | any {
  const cacheUrl = data ? url + '?' + queryStringify(data) : url
  const options = {
    method: method.toUpperCase(),
    data,
    url,
    timeout,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      ...headers
    },
    cacheUrl,
    hostPath
  }
  const times = new Date().getTime()
  const storeData = Store.get(hostPath + cacheUrl, 'local')

  if (cache && storeData) {
    const cacheTime = data.times
    if (times < cacheTime) {
      return Promise.resolve(data.results)
    }
  } else {
    function setResponseData(results) {
      const data = {
        times: times + expires,
        results
      }
      if (results && cache) {
        Store.set(hostPath + cacheUrl, data, 'local')
      }
      return Promise.resolve(results)
    }

    if (successCallback && failCallback) {
      return xhr(options)
        .then(successCallback, failCallback)
        .then((result) => {
          return setResponseData(result)
        })
    } else {
      return xhr(options).then(({ result }) => {
        return setResponseData(result)
      })
    }
  }

  removeStorageData(times)
}
