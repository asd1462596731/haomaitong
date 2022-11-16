<template>
  <div id="hoverCenter" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="hover_item" v-for="(item, index) in dataList" :key="index" @click="jumpTo(`/hoverDetail?id=${item.id}`)">
      <div class="item_title">
        {{item.title}}
      </div>
      <div class="item_desc">
        <span class="desc_time">
          {{item.create_time}}
        </span>
        <a href="javascript:;" class="desc_btn">
          查看详情
          <img src="@/assets/img/public/public_icon2.png" alt="">
        </a>
      </div>
    </div>
    <DataDone :list="dataList"/>
  </div>
</template>
<script>
import DataDone from '@/components/dataDone'
import NavBar from '@/components/navBar'
import * as request from '@/api'
import { mapGetters } from 'vuex'
export default {
  components: {
    NavBar,
    DataDone
  },
  data () {
    return {
      meta: this.$route.meta,
      dataList: []
    }
  },
  computed: {
    ...mapGetters(['user_token'])
  },
  created () {
    if (!this.user_token) {
      this.noPastTo('/login')
    }
    this.getDataList()
  },
  methods: {
    getDataList () {
      request.get_profile_help(2).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          this.dataList = res.data.list
        } else {
          this.$toast.fail(res.msg)
        }
      })
    }
  }
}
</script>
