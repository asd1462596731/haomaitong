<template>
  <div id="teamManage" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="manage_form" v-if="info_rate">
      <div class="form_item padding alginRight" @click="showSelectRateHandler('wechat')">
        <div class="input_box">
          <span>微&#x3000;信</span>
          <van-field :value="`${info_rate.wechat || 0}%`" :readonly="readonly" />
          <img src="@/assets/img/public/public_icon2.png" alt="">
        </div>
      </div>
      <div class="form_item padding alginRight" @click="showSelectRateHandler('alipay')">
        <div class="input_box">
          <span>支付宝</span>
          <van-field :value="`${info_rate.alipay || 0}%`" :readonly="readonly" />
          <img src="@/assets/img/public/public_icon2.png" alt="">
        </div>
      </div>
      <div class="form_item padding alginRight" @click="showSelectRateHandler('unionpay')">
        <div class="input_box">
          <span>银&#x3000;联</span>
          <van-field :value="`${info_rate.unionpay || 0}%`" :readonly="readonly" />
          <img src="@/assets/img/public/public_icon2.png" alt="">
        </div>
      </div>

      <div class="manage_button">
        <a href="javascript:;" class="sure_button" @click="submit">确  定</a>
      </div>
    </div>
    <van-popup v-model="rateSelectShow" position="bottom">
      <van-picker :columns="rate_list" show-toolbar @confirm="onRateSelect" @cancel="rateSelectShow = false" />
    </van-popup>
  </div>
</template>
<script>
import NavBar from '@/components/navBar'
import * as request from '@/api'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      uid: null,
      meta: this.$route.meta,
      readonly: true,
      rateSelectShow: false,
      set_rate_type: 'wechat',
      rate_list: [],
      info_rate: {
        alipay: '0.00',
        unionpay: '0.00',
        wechat: '0.00'
      },
      rate_alipay: [],
      rate_unionpay: [],
      rate_wechat: []
    }
  },
  created () {
    this.getMyRateFunc()
  },
  methods: {
    getMyRateFunc () {
      request.get_salesman_myrate().then(res => {
        if (res.code === this.SUCCESS_CODE) {
          let data = res.data
          this.info_rate = data.default_rate
          this.rate_alipay = data.myrate_region.alipay
          this.rate_unionpay = data.myrate_region.unionpay
          this.rate_wechat = data.myrate_region.wechat
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    onRateSelect (item) {
      if (this.set_rate_type === 'wechat') {
        this.info_rate.wechat = item
      }
      if (this.set_rate_type === 'alipay') {
        this.info_rate.alipay = item
      }
      if (this.set_rate_type === 'unionpay') {
        this.info_rate.unionpay = item
      }
      this.rateSelectShow = false
    },
    showSelectRateHandler (type) {
      this.set_rate_type = type
      if (type === 'alipay') {
        this.rate_list = this.rate_alipay
      }
      if (type === 'wechat') {
        this.rate_list = this.rate_wechat
      }
      if (type === 'unionpay') {
        this.rate_list = this.rate_unionpay
      }
      this.rateSelectShow = true
    },
    submit () {
      let data = this.info_rate
      request.post_update_default_rate(data).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          this.$toast.success(res.msg)
          setTimeout(() => {
            this.goBack()
          }, 1000)
        } else {
          this.$toast.fail(res.msg)
        }
      })
    }
  }
}
</script>
