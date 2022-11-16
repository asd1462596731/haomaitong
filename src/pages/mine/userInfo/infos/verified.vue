<template>
  <div id="verified" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="userInfo_form">
      <div class="form_item">
        <span>姓&#x3000;&#x3000;名</span>
        <van-field v-model="realname" placeholder="请输入身份证姓名" />
      </div>
      <div class="form_item">
        <span>身份证号</span>
        <van-field v-model="idcard" placeholder="请输入身份证号" />
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
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      realname: '',
      idcard: '',
      meta: this.$route.meta
    }
  },
  computed: {
    isCanSubmit () {
      return this.realname !== '' && this.idcard !== ''
    },
    ...mapGetters(['user_info'])
  },
  created () {
    this.realname = this.user_info.realname || ''
    this.idcard = this.user_info.identity_no || ''
  },
  methods: {
    submit () {
      let data = {
        realname: this.realname,
        identity_no: this.idcard
      }
      request.post_profile_identify(data).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          this.$toast.success(res.msg)
          let data = this.user_info
          data.realname = this.realname
          data.identity_no = this.idcard
          data.is_auth = 1
          this.set_user_info(data)
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
