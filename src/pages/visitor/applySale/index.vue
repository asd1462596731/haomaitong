<template>
  <div id="applySale" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="banner_public_visitor">
      可填写上级代理手机号，自动升级成业务员
    </div>
    <div class="title">
      代理电话
    </div>
    <div class="input_box">
      <van-field v-model="mobile" type="tel" clearable placeholder="请输入代理手机号" />
    </div>
    <div class="button">
      <a href="javascript:;" class="sure_button" @click="submit">确定无误</a>
    </div>
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
      meta: this.$route.meta,
      mobile: ''
    }
  },
  computed: {
    isCanSubmit () {
      return this.mobile !== '' && this.mobile.length === 11
    }
  },
  methods: {
    submit () {
      request.post_visitor_sales(this.mobile).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          this.$dialog.alert({
            message: res.msg
          }).then(() => {
            this.goBack()
          })
        } else {
          this.$toast.fail(res.msg)
        }
      })
    }
  }
}
</script>