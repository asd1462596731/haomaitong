<template>
  <div id="receipt" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <Calculator :receipt-type="receipt_type" @openFNScannerHandler="openFNScannerHandler" @confirmFaceHandler="confirmFaceHandler" />
  </div>
 
</template>
<script>

import NavBar from '@/components/navBar'
import Calculator from '../components/calculator'
import { getPermissionFunc } from '@/util'
import { mapGetters } from 'vuex'
import * as request from '@/api'
export default {
  components: {
    NavBar,
    Calculator
  },
  data () {
    return {
      timer: null,
      meta: this.$route.meta,
      money: '',
      isOffLight: true,
      receipt_type: '1' // 1 普通收款  2 刷脸支付
    }
  },
  computed: {
    ...mapGetters(['user_token'])
  },
  created () {
    if (!this.user_token) {
      this.noPastTo('/login')
    }
    this.receipt_type = this.$route.query.type
	this.closeFnsCanner();
  },
  mounted () {
    this.$app.addEventListener({
      name: 'fnscannerClose'
    }, () => {
      this.closeFnsCanner()
    })
    this.$app.addEventListener({
      name: 'fnscannerSwitchLight'
    }, () => {
      this.switchLightFunc()
    })
  },
  methods: {
    confirmFaceHandler (value, money) {
      let data = {
        authCode: value,
        money: money,
        from: 'face'
      }
      this.showProgress('收款中')
      request.post_pay_reverse_scan(data).then(res => {
        this.hideProgress()
        console.log(JSON.stringify(res))
        if (res.code === this.SUCCESS_CODE) {
          this.jumpTo({
            name: 'receiptResult',
            params: {
              result: true,
              order: res.data
            }
          })
        } else {
          this.jumpTo({
            name: 'receiptResult',
            params: {
              result: false,
              order: res.data
            }
          })
        }
      })
    },
    openFNScannerHandler (money) {
      this.money = money
      getPermissionFunc(this, 'camera', '相机').then(() => {
        this.openFNScannerCallBack()
      })
    },
    openFNScannerCallBack () {
		
      if (this.$isLowAnd) {
        this.fnscannerViewAnd5()
      } else {
        this.fnscannerOpenView()
      }
    },
    // 扫码回调
    callBackFNScanner (ret) {
      this.closeFnsCanner()
      let _this = this
      if (ret.content) {
        let data = {
          authCode: ret.content,
          money: this.money,
          from: 'app'
        }
        this.showProgress('收款中')
        request.post_pay_reverse_scan(data).then(res => {
          console.log(JSON.stringify(res))
          if (res.code === this.SUCCESS_CODE) {
            this.hideProgress()
            this.jumpTo({
              name: 'receiptResult',
              params: {
                result: true,
                order: res.data
              }
            })
          } else if (res.code === this.OTHER_CODE) {
            let data = res.data
            let id = data.id
            this.showProgress('查询支付结果中')
            this.getPayResultHandler(id)
          } else {
            this.hideProgress()
            this.jumpTo({
              name: 'receiptResult',
              params: {
                result: false,
                order: res.data
              }
            })
          }
        })
      } else {
        this.$toast.fail('获取扫码结果失败')
      }
    },
    getPayResultHandler (id) {
      this.timer = setInterval(() => {
        request.get_order_show(id).then(res => {
          if (res.code === this.SUCCESS_CODE) {
            let data = res.data
            let status = data.status
            if (status !== 'pending') {
              if (status === 'paid') {
                this.hideProgress()
                clearInterval(this.timer)
                this.timer = null
                this.jumpTo({
                  name: 'receiptResult',
                  params: {
                    result: true,
                    order: res.data
                  }
                })
              } else {
                this.hideProgress()
                clearInterval(this.timer)
                this.timer = null
                this.jumpTo({
                  name: 'receiptResult',
                  params: {
                    result: false,
                    order: res.data
                  }
                })
              }
            }
          }
        })
      }, 1000)
    },
    // guan bi
    closeFnsCanner () {
      this.isOffLight = true
      this.$FNScanner.closeView()
      // this.$app.closeFrame({
      //   name: 'line'
      // })
      this.$app.closeFrame({
        name: 'fnscanner'
      })
    },
    // zhao ming
    switchLightFunc () {
      if (this.isOffLight) {
        this.$FNScanner.switchLight({
          status: 'on'
        })
        this.isOffLight = false
      } else {
        this.$FNScanner.switchLight({
          status: 'off'
        })
        this.isOffLight = true
      }
    },
    fnscannerOpenView () {
      let _this = this
      // this.showFnscanner = true
      let winW = this.$app.winWidth
      let winH = this.$app.winHeight
      this.$FNScanner.openView({
        rect: {
          x: 0,
          y: 0,
          w: winW,
          h: winH
        }
      }, (ret, err) => {
		 
        if (ret) {
          if (ret.eventType === 'cameraError') {
            _this.$toast.fail('访问摄像头失败')
          }
          if (ret.eventType === 'albumError') {
            _this.$toast.fail('访问相册失败')
          }
          if (ret.eventType === 'success') {
            _this.callBackFNScanner(ret)
          }
          if (ret.eventType === 'show') {
            _this.setFnsFrame()
          }
        } else {
          console.log(JSON.stringify(err))
        }
      })
    },
    fnscannerViewAnd5 () {
      let _this = this
      this.$FNScanner.open({
        autorotation: true,
        font: {
          hintText: {
            size: 16
          }
        },
        hintText: '对准客户微信/支付宝付款码',
        isAlbum: true
      }, (ret, err) => {
        if (ret) {
          if (ret.eventType === 'cameraError') {
            _this.$toast.fail('访问摄像头失败')
          }
          if (ret.eventType === 'albumError') {
            _this.$toast.fail('访问相册失败')
          }
          if (ret.eventType === 'success') {
            _this.callBackFNScanner(ret)
          }
        } else {
          console.log(JSON.stringify(err))
        }
      })
    },
    setFnsFrame () {
      let headerH = this.remToPx(this.head_rem) / this.dpr
      let footerH = this.remToPx(2.133333) / this.dpr
      let winW = this.$app.winWidth
      let winH = this.$app.winHeight
      let fnscannerH = winH - headerH
      let fnscannerT = this.$app.safeArea.top
      let lineH = winH - headerH - footerH
      setTimeout(() => {
		 this.$app.openFrame({
		      name: 'fnscanner',
		      url: '/web/code/html/qrcode_frm.html',
		      rect: {  // 采用 margin相对布局
		          marginTop: 0,
		          h: 'auto',
		          w: 'auto'
		      },
		      bounces: false,
		      bgColor: 'rgba(0,0,0,0)',
		  });
        // this.$app.openFrame({
        //   name: 'line',
        //   url: 'widget://html/line.html',
        //   rect: {
        //     x: 0,
        //     y: headerH,
        //     w: winW,
        //     h: lineH
        //   }
        // })
        // this.$app.openFrame({
        //   name: 'fnscanner',
        //   url: 'widget://html/fnscanner.html',
        //   pageParam: {
        //     money: this.money,
        //     isOffLight: this.isOffLight
        //   },
        //   rect: {
        //     x: 0,
        //     y: fnscannerT,
        //     w: winW,
        //     h: fnscannerH
        //   }
        // })
      }, 80)
    }
  }, 
  destroyed () {
    this.hideProgress()
    this.timer = null
  }
}

</script>