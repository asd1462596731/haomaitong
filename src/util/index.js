import store from '@/store'
/**
 * 倒计时
 */
export const CountdownFunction = function () {
  if (window.CountdownTimer) {
    return false
  }
  store.commit('SET_COUNT', 59)
  let count = 58
  window.CountdownTimer = setInterval(() => {
    if (count == 0) {
      clearInterval(window.CountdownTimer)
      window.CountdownTimer = null
      store.commit('SET_COUNT', 60)
    } else {
      store.commit('SET_COUNT', count--)
    }
  }, 1000)
}

export const UtilchooseImage = function (that) {
  return new Promise((resolve, reject) => {
    checkedPromiseStorage(that, 'storage').then(() => {
      let key = that.upload_key
      if (key === 1) {
        // 从相册中选择图片
        checkedPromiseStorage(that, 'photos').then(() => {
          getPicturePhoto(that).then(res => {
            resolve(res)
          }).catch((err) => {
            reject(err)
          })
        }).catch((err) => {
          reject(err)
        })
      } else if (key === 2) {
        // 拍照
        getPermissionFunc(that, 'camera', '相机').then(() => {
			console.log(123);
          checkedPromiseStorage(that, 'camera').then(() => {
            getPictureCamera(that).then(res => {
              resolve(res)
            }).catch((err) => {
              reject(err)
            })
          }).catch((err) => {
            reject(err)
          })
        })
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

// 相册获取图片
function getPicturePhoto (that) {
  return new Promise((resolve, reject) => {
    let _this = that
    that.$app.getPicture({
      sourceType: 'library',
      encodingType: 'png',
      mediaValue: 'pic',
      destinationType: 'base64', // url
      quality: 50
    }, (ret, err) => {
      if (ret) {
        _this.showProgress('上传中')
        let url = ret.base64Data // data
        if (url == '') {
          _this.hideProgress()
          _this.$toast.fail('上传取消')
          return false
        }
        resolve(url)
      } else {
        reject(err)
        _this.$toast.fail(err.msg)
      }
    })
  })
}
// 相机获取图片
function getPictureCamera (that) {
  return new Promise((resolve, reject) => {
    let _this = that
    that.$app.getPicture({
      sourceType: 'camera',
      encodingType: 'jpg',
      mediaValue: 'pic',
      destinationType: 'base64', // url
      quality: 50,
      saveToPhotoAlbum: true
    }, (ret, err) => {
      if (ret) {
        _this.showProgress('上传中')
        let url = ret.base64Data // data
        if (url == '') {
          _this.hideProgress()
          _this.$toast.fail('上传取消')
          return false
        }
        resolve(url)
      } else {
        reject(err)
        _this.$toast.fail(err.msg)
      }
    })
  })
}

// 检测权限
function checkedPromiseStorage (that, promise) {
  return new Promise((resolve, reject) => {
    if (that.$app.systemType == 'ios') {
      resolve()
      return false
    }
    let promiseText = ''
    if (promise == 'storage') {
      promiseText = '储存'
    }
    if (promise == 'photos') {
      promiseText = '相册'
    }
    if (promise == 'camera') {
      promiseText = '相机'
    }
    let list = []
    list.push(promise)
    // 检查安卓储存权限 未打开储存权限会导致提示请先插入sd卡
    let resultList = that.$app.hasPermission({
      list: list
    })
    let _this = that
    let result = resultList[0]
    let granted = result.granted

    if (!granted) {
      this.$app.requestPermission({
        list: list,
        code: 1
      }, (ret, err) => {
        if (ret) {
          let granted = res.list[0].granted
          if (granted) {
            resolve()
          } else {
            reject(err)
            _this.$toast.fail(`注意：不打开${promiseText}权限会影响部分功能`)
          }
        } else {
          reject(err)
          _this.$toast.fail(`${promiseText}权限加载失败，请稍后重试`)
        }
      })
    } else {
      resolve()
    }
  })
}
// 时间戳转时间
export const FormatDate = function (now) {
  var year = now.getFullYear()
  var month = now.getMonth() + 1
  month = month < 10 ? `0${month}` : month
  var date = now.getDate()
  date = date < 10 ? `0${date}` : date
  return `${year}-${month}-${date}`
}
export const getPermissionFunc = function (that, permission, desc) {
  return new Promise((resolve, reject) => {
    let list = []
    list.push(permission)
	if(!that.$app){
		that.$toast.fail('请使用APP进行扫码')
		reject()
	}
    let resultList = that.$app.hasPermission({
      list: list
    })
    let result = resultList[0]
    let granted = result.granted
    let _this = that
    // 如果没有定位权限开始获取定位权限
    if (!granted) {
      that.$app.requestPermission({
        list: list,
        code: 1
      }, (ret, err) => {
        if (ret.list[0].granted) {
          resolve()
        } else {
          _this.$toast.fail(`${desc}权限获取失败请稍后重试`)
          reject()
        }
      })
    } else {
      resolve()
    }
  })
}