// import store from '../store/'
export default {
  install(Vue, options) {
    Vue.prototype.jumpTo = function (opt, text) {
      if (text === "D0注册登入") {
        location.href = "https://bhm.zf100.hk/ys/index"
      } else {
        options.router.push(opt)
      }
    }
    Vue.prototype.noPastTo = function (opt) {
      options.router.replace(opt)
    }
    Vue.prototype.goBack = function () {
      window.history.length > 1 ? options.router.go(-1) : options.router.push('/')
    }
    Vue.prototype.remToPx = function (rem) {
      let fontSize = document.getElementById('html').style.fontSize
      fontSize = parseFloat(fontSize.replace('px', ''))
      return rem * fontSize
    }
    Vue.prototype.pxToRem = function (px) {
      let fontSize = document.getElementById('html').style.fontSize
      fontSize = parseFloat(fontSize.replace('px', ''))
      return px / fontSize
    }
    Vue.prototype.showProgress = function (msg, modal) {
      options.api.showProgress({
        title: msg,
        text: '',
        modal: modal || true
      })
    }
    Vue.prototype.hideProgress = function () {
      options.api.hideProgress()
    }
    Vue.prototype.apiToast = function (msg) {
      options.api.toast({
        msg: msg,
        duration: 2000,
        location: 'bottom'
      })
    }
  }
}
