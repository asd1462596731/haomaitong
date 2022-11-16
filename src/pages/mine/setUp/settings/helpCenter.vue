<template>
  <div id="helpCenter" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="help_item" v-for="(item, index) in dataList" :key="index" @click="changeIsShow(index)">
      <div class="item_title">
        <span>{{item.title}}</span>
        <img :class="{'up': item.isShow}" src="@/assets/img/mine/mine_icon11.png" alt="">
      </div>
      <div class="item_content" v-show="item.isShow">
        {{item.description}}
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
    changeIsShow (i) {
      let arr = this.dataList
      arr.forEach((item, index) => {
        if (index === i) {
          item.isShow = !item.isShow
        } else {
          item.isShow = false
        }
      })
      this.list = arr
    },
    getDataList () {
      request.get_profile_help(1).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          let list = res.data.list
          for (let index = 0; index < list.length; index++) {
            const element = list[index]
            element.isShow = false
            this.dataList.push(element)
          }
        } else {
          this.$toast.fail(res.msg)
        }
      })
    }
  }
}
</script>
