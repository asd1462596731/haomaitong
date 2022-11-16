export default {
  set: function (key, data) {
    return window.localStorage.setItem(key, window.JSON.stringify(data))
  },
  get: function (key) {
    return window.localStorage.getItem(key) ? window.JSON.parse(window.localStorage.getItem(key)) : null
  },
  remove: function (key) {
    return window.localStorage.removeItem(key)
  },
  // 加时间的储存
  setAndTime: function (key, value, expired) {
    window.localStorage[key] = window.JSON.stringify(value)
    if (expired) {
      window.localStorage[`${key}__expires__`] = Date.now() + expired
    }
  },
  // 加时间的获取
  getAndTime: function (key) {
    let valueTime = window.localStorage.getItem(`${key}__expires__`) ? window.localStorage.getItem(`${key}__expires__`) : Date.now() + 1
    let now = Date.now()
    if (now >= valueTime) {
      // 过期
      window.localStorage.removeItem(key)
      window.localStorage.removeItem(`${key}__expires__`)
    }
    let value = window.localStorage.getItem(key)
    return value
  }
}
