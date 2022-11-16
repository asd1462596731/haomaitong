<template>
  <div id="bindPhone" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="userInfo_form">
      <div class="form_item">
        <span>认证手机</span>
        <van-field v-model="user_info.mobile" :readonly="readonly" placeholder="请输入新的手机号码" />
      </div>
      <div class="form_item">
        <span>更换手机</span>
        <van-field v-model="mobile" placeholder="请输入新的手机号码" />
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
        <a href="javascript:;" class="sure_button" :class="{'disable': !isCanSubmit}" @click="submit">确   定</a>
      </div>
    </div>
  </div>
</template>
<script>
import NavBar from '@/components/navBar'
import * as request from '@/api'
import { CountdownFunction } from '@/util'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      mobile: '',
      code: '',
      meta: this.$route.meta,
      readonly: true
    }
  },
  computed: {
    isCanSubmit () {
      return this.mobile !== '' && this.code !== '' && this.mobile.length === 11
    },
    ...mapGetters(['count', 'user_info'])
  },
  methods: {
    submit () {
      if (!this.isCanSubmit) {
        return false
      }
      this.$dialog.confirm({
        message: '确定换绑手机?'
      }).then(() => {
        request.post_user_change_mobile(this.mobile, this.code).then(res => {
          if (res.code === this.SUCCESS_CODE) {
            this.$toast.success(res.msg)
            let data = this.user_info
            data.mobile = this.mobile
            this.set_user_info(data)
            setTimeout(() => {
              this.goBack()
            }, 1000)
          } else {
            this.$toast.fail(res.msg)
          }
        })
      }).catch(() => {
        // on canccel
      })
    },
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
    },
    ...mapMutations({
      set_user_info: 'UPDATE_USER_INFO'
    })
  }
}
</script>
