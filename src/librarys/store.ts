import { isLocalStorageSupported } from './fun'

function getStorageType(type) {
  return type == 'local' ? window.localStorage : window.sessionStorage
}

/**
 * @param  {Object}  value
 * @return {String}  value
 */
function serialize(value: any): string {
  if (typeof value == 'object') {
    return JSON.stringify(value)
  } else {
    return value
  }
}
/**
 * @param  {String} value
 * @return {String} value
 */
function deserialize(value: string): string {
  try {
    return JSON.parse(value)
  } catch (e) {
    return value
  }
}

const isSupported = isLocalStorageSupported()
let windowStorage = Object.create(null)

function setItem (key: string, val: any, type: string): void {
  const storage = getStorageType(type)
  if (typeof val == 'object') {
    storage.setItem(key, serialize(val))
  } else {
    storage.setItem(key, val)
  }
}

function getItem (key: string, type: string): string {
  const storage = getStorageType(type)
  return deserialize(storage.getItem(key))
}

function removeItem (key: string, type: string): void {
  const storage = getStorageType(type)
  storage.removeItem(key)
}

function clearAll (type: string): void {
  const storage = getStorageType(type)
  storage.clear()
}

function windowSet (key: string, val: any): void {
  if (window.name) {
    windowStorage = deserialize(window.name)
  }
  windowStorage[key] = val
  window.name = serialize(windowStorage)
}
function windowGet (key: string): string {
  if (window.name) {
    return deserialize(window.name)[key]
  } else {
    return ''
  }
}
function windowRemove (key: string): void {
  windowStorage = deserialize(window.name)
  delete windowStorage[key]
  window.name = serialize(windowStorage)
}
function windowClear (): void {
  window.name = ''
}

function set (key: string, val: any, type: string): void {
  if (isSupported) {
    setItem(key, val, type)
  } else {
    windowSet(key, val)
  }
}

function get (key: string, type: string): any {
  if (isSupported) {
    return getItem(key, type)
  } else {
    return windowGet(key)
  }
}

function remove (key: string, type: string): void {
  if (isSupported) {
    return removeItem(key, type)
  } else {
    return windowRemove(key)
  }
}

function clear (type: string): void {
  if (isSupported) {
    clearAll(type)
  } else {
    windowClear()
  }
}

export default {
  set,
  get,
  remove,
  clear
}
