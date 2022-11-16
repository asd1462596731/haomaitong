<template>
  <div id="bindPhone" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="userInfo_form">
      <div class="form_item">
        <span>手机号</span>
        <van-field v-model="mobile" placeholder="请输入手机号" />
      </div>
      <div class="form_item">
        <span>验证码</span>
        <van-field v-model="code" class="widthAuto" placeholder="请输入验证码" />
        <div class="item_button">
          <a href="javascript:;" v-show="count === 60" @click="getCodeHandler">获取验证码</a>
          <a href="javascript:;" class="btn_count" v-show="count < 60">{{count}}s后重新获取</a>
        </div>
      </div>
      <div class="form_btn">
        <a href="javascript:;" class="sure_button" :class="{'disable': !isCanSubmit}">确   定</a>
      </div>
    </div>
  </div>
</template>
<script>
import NavBar from '@/components/navBar'
import { CountdownFunction } from '@/util'
import { mapGetters, mapMutations } from 'vuex'
import * as request from '@/api'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      mobile: '',
      code: '',
      meta: this.$route.meta
    }
  },
  computed: {
    isCanSubmit () {
      return this.mobile !== '' && this.code !== '' && this.mobile.length === 11
    },
    ...mapGetters(['count'])
  },
  methods: {
    getCodeHandler () {
      if (this.mobile.length !== 11) {
        this.$toast.fail('手机号不正确')
        return false
      }
      request.post_sms_send(this.mobile, 'changemobile').then(res => {
        if (res.code === this.SUCCESS_CODE) {
          this.$toast.success('验证码已发送')
          CountdownFunction()
        } else {
          this.$toast.fail(res.msg)
        }
      })
    }
  }
}
</script>
