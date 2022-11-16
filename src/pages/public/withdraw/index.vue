<template>
  <div id="withdraw" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="withdraw_title">提现金额</div>
    <div class="withdraw_form">
      <div class="input_box">
        <van-field
          v-model="money"
          placeholder="请输入金额">
        </van-field>
        <a href="javascript:;" @click="allMoneyHandler">全部提现</a>
      </div>
      <div class="input_desc">
        可提金额:{{totalMoney}}元
      </div>
    </div>
    <div class="withdraw_button">
      <a href="javascript:;" class="sure_button" :class="{'disable': !isCanSubmit}" @click="withDrawHandler">确    定</a>
    </div>
    <div class="withdraw_info">
      <p>温馨提示：</p>
      <p>1.每日只能提现1次；</p>
      <p>2.每次提现金额最低1元 </p>
    </div>
  </div>
</template>
<script>
import NavBar from '@/components/navBar'
import * as request from '@/api'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      meta: this.$route.meta,
      money: '',
      totalMoney: 0,
      wx: null,
      timer: null
    }
  },
  computed: {
    isCanSubmit () {
      if (this.moeny === '') {
        return false
      } else if (parseFloat(this.money) <= parseFloat(this.totalMoney)) {
        return true
      }
    },
    ...mapGetters(['user_info'])
  },
  created () {
    this.$nextTick(() => {
      this.totalMoney = this.$route.query.money
    })
  },
  methods: {
    allMoneyHandler () {
      this.money = this.totalMoney
    },
    withDrawHandler () {
      if (this.user_info.openid === '') {
        this.$dialog.alert({
          message: '请先绑定微信'
        }).then(() => {
          this.wxLogin()
        })
        return false
      }
      if (!this.isCanSubmit) {
        return false
      }
      request.post_user_withdrawal(this.money).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          this.$toast.success(res.msg)
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    // 微信登录
    wxLogin () {
      this.showProgress('加载中')
      this.timer = setTimeout(() => {
        this.hideProgress()
      }, 5000)
      let _this = this
      this.wx = this.$app.require('wx')
      this.wx.auth((ret, err) => {
        if (!ret) {
          _this.hideProgress()
        }
        if (ret.status) {
          let code = ret.code
          _this.getWxToken(code)
        } else {
          _this.hideProgress()
          if (err.code == 1) {
            _this.$toast.fail('微信授权取消')
          }
          if (err.code == 2) {
            _this.$toast.fail('微信授权拒绝')
          }
          if (err.code == 3) {
            _this.$toast.fail('当前设备未安装微信')
          }
          if (err.code == -1) {
            _this.$toast.fail('发生未知错误')
          }
        }
      })
    },
    getWxToken (code) {
      let _this = this
      this.wx.getToken({
        code: code
      }, (ret, err) => {
        if (!ret) {
          _this.hideProgress()
        }
        if (ret.status) {
          let accessToken = ret.accessToken
          let openId = ret.openId
          this.openid = openId
          _this.getWxUserInfo(accessToken, openId)
          // _this.wxLoginCallBack(openId)
        } else {
          _this.hideProgress()
          if (err.code == 1) {
            _this.$toast.fail('apiKey值为空或非法')
          }
          if (err.code == 2) {
            _this.$toast.fail('apiSecret值为空或非法')
          }
          if (err.code == 3) {
            _this.$toast.fail('code值为空或非法')
          }
          if (err.code == 4) {
            _this.$toast.fail('网络超时，请稍后重试')
          }
          if (err.code == -1) {
            _this.showMsgError('发生未知错误')
          }
        }
      })
    },
    getWxUserInfo (accessToken, openId) {
      let _this = this
      this.wx.getUserInfo({
        accessToken: accessToken,
        openId: openId
      }, (ret, err) => {
        if (!ret) {
          _this.hideProgress()
        }
        if (ret.status) {
          _this.openid = ret.openid
          _this.nickname = ret.nickname
          _this.wxLoginCallBack()
        } else {
          _this.hideProgress()
          if (err.code == 1) {
            _this.showMsgError('accessToken过期')
          }
          if (err.code == 2) {
            _this.showMsgError('openId非法')
          }
          if (err.code == 3) {
            _this.showMsgError('openId值为空')
          }
          if (err.code == 4) {
            _this.showMsgError('accessToken值为空')
          }
          if (err.code == 5) {
            _this.showMsgError('accessToken非法')
          }
          if (err.code == 6) {
            _this.showMsgError('网络超时，请稍后重试')
          }
          if (err.code == -1) {
            _this.showMsgError('发生未知错误')
          }
        }
      })
    },
    wxLoginCallBack () {
      request.post_profile_bind_wechat(this.openid, this.nickname).then(res => {
        this.hideProgress()
        if (res.code === this.SUCCESS_CODE) {
          this.$toast.success(res.msg)
          let data = this.user_info
          data.openid = openid
          this.set_user_info(data)
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    ...mapMutations({
      set_user_info: 'UPDATE_USER_INFO'
    })
  }
}
</script>