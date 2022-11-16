<template>
  <div id="applyProxy" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="proxy_content">
      <p>说明</p>
      <p v-html="content"></p>
    </div>
    <div class="button">
      <a href="javascript:;" class="sure_button" @click="goBack">我已知晓</a>
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
      content: ''
    }
  },
  computed: {
    level () {
      return this.user_info.level
    },
    ...mapGetters(['user_info'])
  },
  created () {
    if (this.level === 'visitor') {
      this.getContentVisitorHandler()
    } else {
      this.getContentHandler()
    }
  },
  methods: {
    getContentVisitorHandler () {
      request.post_visitor_agent().then(res => {
        if (res.code === this.SUCCESS_CODE) {
          this.content = res.data.content
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    getContentHandler () {
      request.get_salesman_mylevel().then(res => {
        if (res.code === this.SUCCESS_CODE) {
          this.content = res.data.content
        } else {
          this.$toast.fail(res.msg)
        }
      })
    }
  }
}
</script>