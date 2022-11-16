<template>
  <div id="bindPhone" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="userInfo_form">
      <div class="form_item">
        <van-field v-model="nickname" clearable class="widthNickname" placeholder="请输入新商户名称" />
      </div>
      <div class="form_btn">
        <a href="javascript:;" class="sure_button" @click="changeNicnameHandler">修  改</a>
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
  computed: {
    ...mapGetters(['user_info'])
  },
  data () {
    return {
      nickname: '',
      meta: this.$route.meta
    }
  },
  created () {
    this.nickname = this.user_info.nickname
  },
  methods: {
    changeNicnameHandler () {
      let nickname = this.nickname
      let data = {
        nickname
      }
      request.post_user_modify_info(data).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          let data = this.user_info
          data.nickname = this.nickname
          this.set_user_info(data)
          this.goBack()
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

<style scoped>

</style>
