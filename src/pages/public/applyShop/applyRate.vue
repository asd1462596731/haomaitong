<template>
  <div id="teamManage" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="manage_form">
      <div class="form_item padding alginRight" @click="showRateSelect('wechat')">
        <div class="input_box">
          <span>微&#x3000;信</span>
          <van-field :value="`${rateObj.wechat}‰`" :readonly="readonly" />
          <img src="@/assets/img/public/public_icon2.png" alt="">
        </div>
      </div>
      <div class="form_item padding alginRight" @click="showRateSelect('alipay')">
        <div class="input_box">
          <span>支付宝</span>
          <van-field :value="`${rateObj.alipay}‰`" :readonly="readonly" />
          <img src="@/assets/img/public/public_icon2.png" alt="">
        </div>
      </div>
      <div class="form_item padding alginRight" @click="showRateSelect('unionpay')">
        <div class="input_box">
          <span>银&#x3000;联(<1000)</span>
          <van-field :value="`${rateObj.unionpay}‰`" :readonly="readonly" />
          <img src="@/assets/img/public/public_icon2.png" alt="">
        </div>
      </div>
      <div class="form_item padding alginRight" @click="showRateSelect('unionpay2')">
        <div class="input_box">
          <span>银&#x3000;联(>1000)</span>
          <van-field :value="`${rateObj.unionpay2}‰`" :readonly="readonly" />
          <img src="@/assets/img/public/public_icon2.png" alt="">
        </div>
      </div>

      <div class="manage_button">
        <a href="javascript:;" class="sure_button" @click="submit">确  定</a>
      </div>
    </div>

    <van-popup v-model="show" position="bottom">
      <van-picker :columns="actions" show-toolbar @confirm="onSelect" @cancel="show = false" />
    </van-popup>
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
      show: false,
      actions: [],
      uid: null,
      meta: this.$route.meta,
      readonly: true,
      roleSelectShow: false,
      rateSelectShow: false,
      set_rate_type: 'wechat'
    }
  },
  computed: {
    ...mapGetters(['pay_rate', 'rate_region', 'apply_info']),
    rateObj () {
      const obj = {
        wechat: (this.pay_rate && this.pay_rate.wechat) ? this.pay_rate.wechat : 0,
        alipay: (this.pay_rate && this.pay_rate.alipay) ? this.pay_rate.alipay : 0,
        unionpay: (this.pay_rate && this.pay_rate.unionpay) ? this.pay_rate.unionpay : 0,
		unionpay2: (this.pay_rate && this.pay_rate.unionpay2) ? this.pay_rate.unionpay2 : 0
      }
      return obj
    }

  },
  created () {
	   let obj = {
	     wechat: (this.pay_rate && this.pay_rate.wechat) ? this.pay_rate.wechat : 0,
	     alipay: (this.pay_rate && this.pay_rate.alipay) ? this.pay_rate.alipay : 0,
	     unionpay: (this.pay_rate && this.pay_rate.unionpay) ? this.pay_rate.unionpay : 0,
	   	 unionpay2: (this.pay_rate && this.pay_rate.unionpay2) ? this.pay_rate.unionpay2 : 0
	   }
	    obj = JSON.parse(JSON.stringify(obj))
		if(obj.wechat === '0' && obj.alipay === '0' && obj.unionpay === '0' && obj.unionpay2 === '0'){
			 obj = {}
		}
	    this.set_pay_rate(obj)
		
		let info = this.apply_info
		info.pay_rate = obj
		this.set_apply_info(info)
		console.log('初始化')
		console.log(this.apply_info)
  },
  methods: {
    submit () {
      // this.goBack()
	  this.$router.back()
    },
    onSelect (item) {
      let data = this.rateObj
      let key = item.key
      data[this.set_rate_type] = key
      this.set_pay_rate(data)
      let info = this.apply_info
      info.pay_rate = this.rateObj
      this.set_apply_info(info)
      this.show = false
    },
    showRateSelect (type) {
      this.set_rate_type = type
      this.actions = []
      let arr = this.rate_region[type]
      arr.forEach(element => {
        this.actions.push({
          text: parseFloat(element).toFixed(2) + '‰',
          key: parseFloat(element).toFixed(2)
        })
      })
      this.show = true
    },
    ...mapMutations({
      set_apply_info: 'SET_APPLY_INFO',
      set_pay_rate: 'SET_PAY_RATE'
    })
  }
}
</script>
