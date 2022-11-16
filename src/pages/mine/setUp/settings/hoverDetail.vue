<template>
  <div id="hoverDetail" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="content">
      <div class="content_title">
        {{info.title}}
      </div>
      <div class="content_desc" v-html="info.description">
      </div>
      <div class="content_info">
        <p>{{info.author}}</p>
        <p>{{info.created_at}}</p>
      </div>
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
      id: null,
      info: {}
    }
  },
  created () {
    this.id = this.$route.query.id
    if (!this.id) {
      this.$toast.fail('页面出错，请重试')
      setTimeout(() => {
        this.goBack()
      }, 1000)
    } else {
      this.getDetail()
    }
  },
  methods: {
    getDetail () {
      request.get_profile_help_detail(this.id).then((res) => {
        if (res.code === this.SUCCESS_CODE) {
          this.info = res.data.detail
        } else {
          this.$toast.fail(res.msg)
        }
      })
    }
  }
}
</script>
