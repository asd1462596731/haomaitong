<template>
  <div id="merchantList" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <div class="merchant_head">
			<div class="head_merchant" >
				<div>
          <div class="head_title">我的商户总数(个)</div>
			<div class="head_content" >{{total}}</div>
        </div>
			</div>
      <div class="count">
        <span class="direct">直推商户  <span class="num">{{direct_count}}</span>  个</span>
        <span class="direct">间接商户  <span class="num">{{total - direct_count}}</span>  个</span>
      </div>
		</div>
    <NavBar :meta="meta" @onSearchInput="onSearchInput" @onSearchCancel="onSearchCancel" />
    <van-tabs v-model="activeName" @change="getMerchantList">
  <van-tab style="width:.4rem" title="全部" name=""></van-tab>
  <van-tab :title="`营业中 ${open_count}`" name="open"></van-tab>
  <van-tab :title="`代办理 ${doing_count}`" name="doing"></van-tab>
  <van-tab :title="`审核中 ${check_count}`" name="check"></van-tab>
  <van-tab :title="`驳回 ${reject_count}`" name="reject"></van-tab>
</van-tabs>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text=""
        @load="onLoad">
        <div class="merchant_item" v-for="item in list" :key="item.id" >
          <div class="item_img">
            <img v-if="item.avatar" :src="item.merchant.store_pic" alt="">
            <img v-else src="@/assets/img/merchant/monitubiao.png" alt="">
          </div>
          <div class="item_info">
            <div class="info_name">{{item.merchant.merchant_alias}}
            </div>
            <div class="info_p">
              <span>{{item.mobile}}</span>
              <span>今日收益:{{item.day_sum}}元</span>
            </div>
            <div class="info_p">
              <span>粉丝:{{item.fans_count}}人</span>
              <span>今日收款:{{item.day_total}}笔</span>
            </div>
            <span class="info_time">{{item.merchant.create_time}}</span>
            <van-button plain hairline size="small" color="#888888" @click="goApplyBuilHandler(item)">商家收款明细</van-button>
            <div class="info_exmine">
				 &nbsp;&nbsp; &nbsp;<van-button  plain hairline size="mini" color="#888888" @click="goApplyShopHandler(item.id)" style="padding-left:4px;padding-right:4px;">查看信息</van-button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				 <van-button  plain hairline size="mini" color="#888888" @click="goToDeskHandler(item.id)" style="padding-left:4px;padding-right:4px;">查看门店</van-button>
			</div>
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
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    NavBar,
    DataDone
  },
  data() {
    return {
      meta: this.$route.meta,
      loading: false,
      finished: false,
      isLoading: false,
      pop_show: false,
      check_count: 0,
      open_count: 0,
      reject_count: 0,
      doing_count: 0,
      activeName:'',
      total: 0,
      direct_count: 0,
      page: 0,
      list: [],
      search_key: ''
    }
  },
  computed: {
    ...mapGetters(['sub_uid', 'apply_uid', 'apply_info'])
  },
  created() {
    this.set_sub_uid(null)
    this.set_apply_info({})
  },
  methods: {
    goToDeskHandler(id) {
      this.set_sub_uid(id)
      this.jumpTo('/desk')
    },
    goApplyShopHandler(id) {
      this.set_apply_uid(id)
      this.jumpTo({
        name: 'applyShop'
      })
    },
    goApplyBuilHandler(item) {
      this.merchant_id(item.merchant.id)
      this.set_apply_uid(item.id)
      this.jumpTo({
        name: 'bill'
      })
    },
    onSearchCancel() {
      this.search_key = ''
      this.page = 0
      this.finished = false
      this.isLoading = true
    },
    onSearchInput(value) {
      this.search_key = value
      this.page = 0
      this.finished = false
      this.isLoading = true
    },
    getMerchantList() {
      request.get_salesman_merchant(this.page, this.search_key).then(res => {
        this.finished = true
        if (res.code === this.SUCCESS_CODE) {
          let data = res.data
          console.log(res);
          this.open_count = res.data.open_count
          this.doing_count = res.data.doing_count
          this.check_count = res.data.check_count
          this.reject_count = res.data.reject_count
          this.total = res.data.total
          this.direct_count = res.data.direct_count
          if (data.list.length === 0) {
            this.finished = true
          }
          if (this.isLoading) {
            if (this.activeName === 0) {
              console.log(data.list);
            } else if (this.activeName === 'open') {
              this.list = data.open
            }else if (this.activeName === 'doing') {
              this.list = data.doing
            } else if (this.activeName === 'check') {
              this.list = data.check
            }
            else if (this.activeName === 'reject') {
              this.list = data.reject
            }
            // this.list = data.list
          } else {
            if (this.activeName === '') {
              this.list = data.list
            } else if (this.activeName === 'open') {
              this.list = data.open
            }else if (this.activeName === 'doing') {
              this.list = data.doing
            } else if (this.activeName === 'check') {
              this.list = data.check
            }
            else if (this.activeName === 'reject') {
              this.list = data.reject
            }
            // this.list = this.list.concat(data.list)
          }
        } else {
          this.$toast.fail(res.msg)
          this.finished = true
        }
        this.isLoading = false
        this.loading = false
      })
    },
    onLoad() {
      this.page = this.page + 1
      this.getMerchantList()
    },
    onRefresh() {
      this.page = 0
      this.finished = false
      this.isLoading = true
      this.list = []
    },
    ...mapMutations({
      set_sub_uid: 'SET_SUB_UID',
      set_apply_info: 'SET_APPLY_INFO',
      set_apply_uid: 'SET_APPLY_UID',
      merchant_id: 'MERCHANT_ID'
    })
  }
}
</script>
<style scoped>
/deep/ .van-tab {
  flex: none !important;
  width: 2rem;
}
</style>