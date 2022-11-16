<template>
  <div id="wallet" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="wallet_top">
      <div class="top_content">
        <div class="content_item">
          <div class="item_top">
            总金额(元)
          </div>
          <div class="item_bottom" :class="{'font_small': user_info.balance.toString().length > 8}">
            {{user_info.balance}}
          </div>
        </div>
        <div class="content_item">
          <div class="item_top">
            可提金额(元)
          </div>
          <div class="item_bottom" :class="{'font_small': user_info.available_balance.toString().length > 8}">
            {{user_info.available_balance}}
          </div>
        </div>
      </div>
      <div class="top_footer">
        钱包金额是平台为商家产生的额外金额，非扫码收款金额
      </div>
    </div>
    <div class="wallet_button">
      <a href="javascript:;" class="sure_button" @click="jumpTo(`/withdraw?money=${user_info.available_balance}`)">我要提现</a>
	  <a href="javascript:;" class="sure_button" @click="jumpTo(`/pay`)" style="margin-top: 10px;">去充值</a>
    </div>
	  
    <div class="wallet_info">
      温馨提示：产生的金额需要24小时才可提现
    </div>
  </div>
</template>
<script>
import NavBar from '@/components/navBar'
import * as request from '@/api'
import { mapGetters } from 'vuex'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      meta: this.$route.meta
    }
  },
  computed: {
    ...mapGetters(['user_info', 'user_token'])
  },
  created () {
    if (!this.user_token) {
      this.noPastTo('/login')
    }
  },
  methods: {
  }
}
</script>