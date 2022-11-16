<template>
  <div id="withdrawDetail" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text=""
        @load="onLoad">
        <div class="detail_item" v-for="item in list" :key="item.id">
          <div class="item_left">
            <div class="left_top" :class="[item.status === 'waiting' ? 'theme_color' : '', item.status === 'failed' ? 'failed_color' : '']">
              <span v-if="item.status === 'success'">已处理</span>
              <span v-if="item.status === 'waiting'">审核中</span>
              <span v-if="item.status === 'failed'">失败</span>
            </div>
            <div class="left_bottom">
              {{item.update_time}}
            </div>
          </div>
          <div class="item_right">
            <i>￥</i><span>{{item.money}}</span>
          </div>
        </div>
        <DataDone v-show="finished" :list="list"/>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import DataDone from '@/components/dataDone'
import NavBar from '@/components/navBar'
import * as request from '@/api'
export default {
  components: {
    NavBar,
    DataDone
  },
  data () {
    return {
      meta: this.$route.meta,
      loading: false,
      finished: false,
      isLoading: false,
      list: []
    }
  },
  methods: {
    getListFunc () {
      request.post_user_cashWithdrawal().then(res => {
        if (res.code === this.SUCCESS_CODE) {
          this.list = res.data
          this.isLoading = false
          this.loading = false
          this.finished = true
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    onLoad () {
      this.getListFunc()
    },
    onRefresh () {
      this.getListFunc()
    }
  }
}
</script>