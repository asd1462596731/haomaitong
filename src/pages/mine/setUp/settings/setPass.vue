<template>
  <div id="setPass" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="form">
      <div class="form_item">
        <van-field v-model="code" placeholder="输入验证码" />
        <div class="item_button">
          <a href="javascript:;" v-show="count === 60" @click="getCodeHandler">获取验证码</a>
          <a href="javascript:;" class="btn_count" v-show="count < 60">{{count}}s后重新获取</a>
        </div>
      </div>
      <div class="form_item">
        <van-field type="password" v-if="!lookPass" v-model="password" placeholder="设置新密码" />
        <van-field v-if="lookPass" v-model="password" placeholder="设置新密码" />
        <div class="item_eyes">
          <a href="javascript:;" @click="changeLookPass">
            <img v-if="!lookPass" src="@/assets/img/mine/mine_icon12.png" alt="">
            <img v-if="lookPass" src="@/assets/img/mine/mine_icon13.png" alt="">
          </a>
        </div>
      </div>
      <div class="form_desc">
        验证码将发送至{{user_info.mobile}}
        <a href="javascript:;" @click="jumpTo('/changePhone')">不可用</a>
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
      lookPass: false,
      code: '',
      password: '',
      meta: this.$route.meta
    }
  },
  computed: {
    isCanSubmit () {
      return this.password !== '' && this.code !== ''
    },
    ...mapGetters(['count', 'user_info'])
  },
  methods: {
    changeLookPass () {
      this.lookPass = !this.lookPass
    },
    getCodeHandler () {
      request.post_sms_send(this.user_info.mobile, 'resetpwd').then(res => {
        if (res.code === this.SUCCESS_CODE) {
          this.$toast.success('验证码已发送')
          CountdownFunction()
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    submit () {
      // post_reset_password
      if (!this.isCanSubmit) {
        return false
      }
      this.$dialog.confirm({
        message: '确认修改密码?'
      }).then(() => {
        request.post_reset_password(this.user_info.mobile, this.password, this.code).then(res => {
          if (res.code === this.SUCCESS_CODE) {
            this.$dialog.alert({
              message: '修改成功，请重新登录'
            }).then(() => {
              this.set_user_logout()
              this.noPastTo('/')
            })
          } else {
            this.$toast.fail(res.msg)
          }
        })
      }).catch(() => {
        // on canccel
      })
    },
    ...mapMutations({
      set_user_logout: 'SET_USER_LOGOUT'
    })
  }
}
</script>
