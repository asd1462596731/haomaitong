<template>
  <div id="applyProxy" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="proxy_content">
      <p>说明</p>
      <p>1.联系上级通过管理后台开通；</p>
      <p>2.申请代理需要一定的条件审核；</p>
      <p>3.是否通过由上级决定；</p>
      <p>4.建议先开通业务员，后期再申请代理</p>
    </div>
    <div class="button">
      <a href="javascript:;" class="sure_button" @click="goBack">提交</a>
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
      content: ''
    }
  },
  methods: {
    getContentHandler () {
      request.get_salesman_mylevel().then(res => {
        console.log(res)
      })
    }
  }
}
</script>