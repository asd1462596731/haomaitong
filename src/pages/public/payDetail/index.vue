<template>
  <div id="fundDetails" class="page_container" :style="`padding-top: ${head_rem}rem;`">
	  <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o">
	     如对资金有疑问请联系我们
	   </van-notice-bar>
    <NavBar :meta="meta" />
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text=""
        @load="onLoad">
        <div class="detail_item" v-for="(item,index) in money_list" :key="index">
          <div class="item_left">
            <div class="left_top">
             {{item.topupType}}
            </div>
            <div class="left_bottom">
              {{item.update_time}}
            </div>
          </div>
          <div class="item_right">
            +{{item.amount}}
          </div>
        </div>
        <DataDone v-show="finished" :list="money_list"/>
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
      money_list: [],
      page: 0
    }
  },
  methods: {
    getMoneyList () {
      this.page = this.page + 1
      request.post_recharge_cashWithdrawal(this.page).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          let list = res.data
          if (this.isLoading) {
            this.money_list = list
          } else {
            this.money_list = this.money_list.concat(list)
          }
          this.isLoading = false
          this.loading = false
          if (list.length === 0) {
            this.finished = true
          }
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    onLoad () {
      this.getMoneyList()
    },
    onRefresh () {
      this.finished = false
      this.page = 0
      this.isLoading = true
      this.money_list = []
	  var _this = this;
	  setTimeout(function(){
		  _this.getMoneyList();
	  },2000)
    }
  }
}
</script>