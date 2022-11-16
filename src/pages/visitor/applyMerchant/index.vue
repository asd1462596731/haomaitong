<template>
  <div id="applyMerchant" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="banner_public_visitor">
      推广员（业务/代理）可以协助您完成开户和收款，请认真核实
    </div>
    <div class="title">
      推广员电话
    </div>
    <div class="input_box">
      <van-field v-model="mobile" type="tel" clearable placeholder="请输入推广员手机号" />
    </div>
    <div class="button">
     <!-- <a href="javascript:;" class="sure_button" :class="{'disable': !isCanSubmit}" @click="sureSubmit">确定无误</a> -->
    <a href="javascript:;" class="sure_button" @click="sureSubmit">确定</a>
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
      meta: this.$route.meta,
      mobile: ''
    }
  },
  computed: {
    isCanSubmit () {
      return this.mobile !== ''
    },
    pid () {
      return this.user_info.pid || null
    },
    ...mapGetters(['user_info'])
  },
  created () {
    // this.getParentInfo()
    if (this.pid) {
      this.noPastTo('/applyShop')
    }
  },
  methods: {
    // getParentInfo () {
    //   request.get_visitor_parent().then(res => {
    //     console.log(res)
    //     if (res.code === this.SUCCESS_CODE) {
    //       let data = res.data
    //       if (data.parent) {
    //         this.noPastTo('/applyShop')
    //       }
    //     } else {
    //       this.$toast.fail(res.msg)
    //     }
    //   })
    // },
    sureSubmit () {
      // if (!this.isCanSubmit) {
      //   return false
      // }
      let mobile = this.mobile
      // if (mobile.length !== 11) {
      //   this.$dialog.alert({
      //     message: '手机号码格式错误'
      //   })
      //   return false
      // }
      // this.$dialog.confirm({
      //   message: `请确认推广员电话：${mobile}`
      // }).then(() => {
      //   // on confirm
      //   this.submitCallback(mobile)
      // }).catch(() => {
      //   // on cancel
      // })
	   this.submitCallback(mobile)
    },
    submitCallback (mobile) {
      request.post_visitor_merchant(mobile).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          this.$toast.success(res.msg)
          setTimeout(() => {
            this.noPastTo('/applyShop')
          }, 1000)
        } else {
          this.$toast.fail(res.msg)
        }
      })
    }
  }
}
</script>