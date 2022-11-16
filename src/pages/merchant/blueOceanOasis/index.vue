<template>
  <div id="blueOceanOasis" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="banner_header_public">
      <span>暂只支持个体户/企业，餐饮行业申请</span>
    </div>
    <div class="link_list">
      <div class="list_item" v-for="item in list" :key="item.id" @click="goToApply(item)">
        <span v-show="item.activity_type === 1">支付宝蓝海</span>
        <span v-show="item.activity_type === 2">微信智慧餐饮</span>
        <span v-show="item.activity_type === 3">微信高校食堂</span>
        <div class="item_right">
          <i v-show="!item.sxf_status">暂未申请</i>
          <i v-show="item.sxf_status === 'wait'">待审核</i>
          <i v-show="item.sxf_status === 'auditing'">审核中</i>
          <i v-show="item.sxf_status === 'back'">平台驳回</i>
          <i v-show="item.sxf_status === 'reject'">第三方驳回</i>
          <i v-show="item.sxf_status === 'success'">申请成功</i>
          <img src="@/assets/img/public/public_icon2.png" alt="">
        </div>
      </div>
    </div>
    <DataDone :list="list"/>
  </div>
</template>
<script>
import DataDone from '@/components/dataDone'
import NavBar from '@/components/navBar'
import * as request from '@/api'
import { mapGetters } from 'vuex'
export default {
  components: {
    NavBar,
    DataDone
  },
  data () {
    return {
      meta: this.$route.meta,
      list: []
    }
  },
  computed: {
    ...mapGetters(['user_info', 'user_token'])
  },
  created () {
    if (!this.user_token) {
      this.noPastTo('/login')
    }
    this.getMerchantActivity()
  },
  methods: {
    goToApply (item) {
      this.jumpTo({
        name: 'blueOceanOasisApply',
        params: item
      })
    },
    getMerchantActivity () {
      let merchant = this.user_info.merchant
      request.get_merchant_activity(merchant.id).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          let list = res.data.list
          for (const key in list) {
            if (list.hasOwnProperty(key)) {
              const element = list[key]
              this.list.push(element)
            }
          }
        } else {
          this.$toast.fail(res.msg)
        }
      })
    }
  }
}
</script>