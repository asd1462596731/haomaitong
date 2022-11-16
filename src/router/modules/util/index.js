
export default {
  show () { // 加载中显示loading组件
    // API_CLOUD.showProgress({
    //   title: '请稍后',
    //   text: '',
    //   modal: false
    // })
  },
  resolve (resolve) { // 加载完成隐藏loading组件
    return component => {
      setTimeout(() => {
        // API_CLOUD.hideProgress()//关闭loading组件
        resolve(component)
      }, 10)
    }
  }
}
