<template>
  <HeadDom :styles="navStyle">
    <div slot="left">
      <a href="javascript:;" slot="left" v-show="meta.left === 'icon_back'" @click="goBack">
        <img class="left_back" src="@/assets/img/layout/layout_back.png" alt="">
      </a>
      <!-- <a href="javascript:;" slot="left" v-show="meta.left === 'icon_dp'">
        <img class="left_icon44" src="@/assets/img/home/home_s_icon10.png" alt="">
      </a> -->
    </div>
    <span v-show="!isSearchShow" href="javascript:;" slot="center" class="head_span" v-html="meta.title"></span>
    <div slot="center" v-show="isSearchShow" class="head_search">
      <van-search
        v-model="search_value"
        placeholder="请输入商户名关键字"
        show-action
        @search="onSearchInput"
        @cancel="onSearchCancel"
      />
    </div>
    <div slot="right">
      <a href="javascript:;" v-show="meta.right === 'icon_ld'" @click="jumpTo('/hoverCenter')">
        <img class="left_icon31" src="@/assets/img/home/home_s_icon1.png" alt="">
      </a>
      <a href="javascript:;" v-show="meta.right === 'wallet_detail'" @click="jumpTo('/fundDetails')">
        资金明细
      </a>
      <a href="javascript:;" v-show="meta.right === 'withdraw_detail'" @click="jumpTo('/withdrawDetail')">
        提现记录
      </a>
	  <a href="javascript:;" v-show="meta.right === 'pay_detail'" @click="jumpTo('/payDetail')">
	    充值记录
	  </a>
      <a href="javascript:;" v-show="meta.right === 'my_order'" @click="jumpTo('/myOrder')">
        我的订单
      </a>
      <a href="javascript:;" v-show="meta.right === 'change_card' && status === 'success'" @click="jumpTo(`/changeCard`)">
        换绑卡
      </a>
      <a href="javascript:;" v-show="meta.right === 'down_qrcode'" @click="saveImageFunc">
           {{text}}
      </a>
      <a href="javascript:;" v-show="meta.right === 'default_rate' && isProxy" @click="jumpTo('/defaultRate')">
        设置默认费率
      </a>
      <a href="javascript:;" v-show="meta.right === 'icon_search' && !isSearchShow" @click="onSearchBegin">
        <img class="right_icon31" src="@/assets/img/proxy/proxy_icon1.png" alt="">
      </a>
    </div>
  </HeadDom>
</template>
<script>
import HeadDom from '@/components/head'
import { mapGetters } from 'vuex'
export default {
  components: {
    HeadDom
  },
  props: {
    meta: {
      type: Object,
      default () {
        return {}
      }
    },
    status: {
      type: String,
      default: ''
    },
    navStyle: {
      type: String,
      default: ''
    },
	text: {
      type: String,
    },
  },
  computed: {
    isProxy () {
      return this.user_info.level === 'province' || this.user_info.level === 'city' || this.user_info.level === 'area'
    },
    // level () {
    //  && level !== 'merchant' && level !== 'cashier'
    // return this.user_info.level
    // },
    ...mapGetters(['user_info','is_web_type'])
  },
  data () {
    return {
      isSearchShow: false,
      search_value: '',
    }
  },
  created () {
	  // if(this.is_web_type == "H5"){
	  //    this.text = "点击生成收款码"
	  //   }else{
	  // 	  this.text = "保存相册"
	  // }
  },
  methods: {
    onSearchCancel () {
      this.isSearchShow = false
      this.$emit('onSearchCancel')
    },
    onSearchBegin () {
      this.isSearchShow = true
    },
    onSearchInput () {
      this.$emit('onSearchInput', this.search_value)
    },
    onSureChooseAddress () {
      this.$emit('onSureChooseAddress', this.search_value)
    },
    saveImageFunc () {
      this.$emit('saveImageFunc')
    }
  }
}
</script>