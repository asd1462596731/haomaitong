<template>
  <div id="teamManage" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="manage_form">
      <div class="form_item">
        <div class="input_box">
          <span class="width100">手机号</span>
          <van-field v-model="userObj.mobile" type="tel" placeholder="请填写下级手机号" />
        </div>
        <div class="msg_box">
          该用户必须为游客身份
        </div>
      </div>

      <div class="form_item alginRight" @click="showSelectRoleHandler">
        <div class="input_box">
          <span class="width100">角&#x3000;色</span>
          <van-field v-show="userObj.level === 'sale'" value="推广员" :readonly="readonly" />
          <van-field v-show="userObj.level === 'merchant_d0'" value="D0代理" :readonly="readonly" />
          <van-field v-show="userObj.level === 'province'" value="合伙人" :readonly="readonly" />
          <van-field v-show="userObj.level === 'city'" value="服务商" :readonly="readonly" />
          <!-- <van-field v-show="userObj.level === 'area'" value="区代理" :readonly="readonly" /> -->
          <img src="@/assets/img/public/public_icon2.png" alt="">
        </div>
        <div class="msg_box">
          必须高于身份
        </div>
      </div>
      <div class="margin_div"></div>

      <div class="form_title">
        <span>费率</span><i>不能低于自己的费率</i>
      </div>
      <div class="form_item padding alginRight" @click="showSelectRateHandler('wechat')">
        <div class="input_box">
          <span>微&#x3000;信</span>
          <van-field :value="`${userObj.wechat || 0}‰`" :readonly="readonly" />
          <img src="@/assets/img/public/public_icon2.png" alt="">
        </div>
      </div>
      <div class="form_item padding alginRight" @click="showSelectRateHandler('alipay')">
        <div class="input_box">
          <span>支付宝</span>
          <van-field :value="`${userObj.alipay || 0}‰`" :readonly="readonly" />
          <img src="@/assets/img/public/public_icon2.png" alt="">
        </div>
      </div>
      <div class="form_item padding alginRight" @click="showSelectRateHandler('unionpay')">
        <div class="input_box">
          <span>银&#x3000;联(<1000)</span>
          <van-field :value="`${userObj.unionpay || 0}‰`" :readonly="readonly" />
          <img src="@/assets/img/public/public_icon2.png" alt="">
        </div>
      </div>
	<div class="form_item padding alginRight" @click="showSelectRateHandler('unionpay2')">
	  <div class="input_box">
	    <span>银&#x3000;联(>1000)</span>
	    <van-field :value="`${userObj.unionpay2 || 0}‰`" :readonly="readonly" />
	    <img src="@/assets/img/public/public_icon2.png" alt="">
	  </div>
	</div>
      <div class="manage_button">
        <a href="javascript:;" class="sure_button" @click="submit">确  定</a>
      </div>
    </div>

    <van-popup v-model="roleSelectShow" position="bottom">
      <van-picker :columns="role_list" show-toolbar @confirm="onRoleSelect" @cancel="roleSelectShow = false" />
    </van-popup>
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
      roleSelectShow: false,
      rateSelectShow: false,
      role_list: [
        {
          text: '推广员',
          key: 'sale'
        },
        {
          text: '服务商',
          key: 'city'
        }
        ,
        {
          text: 'D0代理',
          key: 'merchant_d0'
        }
      ],
      rate_alipay: [],
      rate_unionpay: [],
	  rate_unionpay2: [],
      rate_wechat: [],
      set_rate_type: 'wechat',
      rate_list: [],
      userObj: {
        mobile: '',
        level: 'sale',
        wechat: '0.00',
        alipay: '0.00',
        unionpay: '0.00',
		unionpay2: '0.00'
      }
    }
  },
  created () {
    this.getRateHandler()
  },
  methods: {
    submit () {
      let data = {
        mobile: this.userObj.mobile,
        level: this.userObj.level,
        wechat: this.userObj.wechat ? this.userObj.wechat : 0,
        alipay: this.userObj.alipay ? this.userObj.alipay : 0,
        unionpay: this.userObj.unionpay ? this.userObj.unionpay : 0,
		unionpay2: this.userObj.unionpay2 ? this.userObj.unionpay2 : 0
      }
      request.post_agent_add(data).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          this.$toast.success(res.msg)
          setTimeout(() => {
            this.goBack()
          }, 1000)
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    getRateHandler () {
      request.get_user_rate().then(res => {
		  console.log(res.data)
        if (res.code === this.SUCCESS_CODE) {
          let data = res.data
          let arr_ali = data.alipay
          arr_ali.forEach(element => {
            this.rate_alipay.push({
              key: element,
              text: `${element}‰`
            })
          })
          let arr_unionpay = data.unionpay
          arr_unionpay.forEach(element => {
            this.rate_unionpay.push({
              key: element,
              text: `${element}‰`
            })
          })
		  let arr_unionpay2 = data.unionpay2
		  arr_unionpay2.forEach(element => {
		    this.rate_unionpay2.push({
		      key: element,
		      text: `${element}‰`
		    })
		  })
          let arr_wechat = data.wechat
          arr_wechat.forEach(element => {
            this.rate_wechat.push({
              key: element,
              text: `${element}‰`
            })
          })
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    showSelectRoleHandler () {
      this.roleSelectShow = true
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
	  if (type === 'unionpay2') {
	    this.rate_list = this.rate_unionpay2
	  }
      this.rateSelectShow = true
    },
    onRateSelect (item) {
      if (this.set_rate_type === 'wechat') {
        this.userObj.wechat = item.key
      }
      if (this.set_rate_type === 'alipay') {
        this.userObj.alipay = item.key
      }
      if (this.set_rate_type === 'unionpay') {
        this.userObj.unionpay = item.key
      }
	  if (this.set_rate_type === 'unionpay2') {
	    this.userObj.unionpay2 = item.key
	  }
      this.rateSelectShow = false
    },
    onRoleSelect (item) {
      console.log(item)
      this.userObj.level = item.key
      this.roleSelectShow = false
    }
  }
}
</script>
