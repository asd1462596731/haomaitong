<template>
  <div id="merchantList" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" @onSearchInput="onSearchInput" @onSearchCancel="onSearchCancel" />
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text=""
        @load="onLoad">
        <div class="merchant_item" v-for="item in list" :key="item.id" >
          <div class="item_img">
            <img v-if="item.avatar" :src="item.avatar" alt="">
            <img v-else src="@/assets/img/merchant/monitubiao.png" alt="">
          </div>
          <div class="item_info">
            <div class="info_name">{{item.merchant.merchant_alias}}</div>
            <div class="info_p">
              <span>{{item.mobile}}</span><span>今日收款:{{item.day_total}}笔</span>
            </div>
            <div class="info_p">
              <span>粉丝:{{item.fans_count}}人</span>
			<van-button plain hairline size="small" color="#888888" @click="goApplyBuilHandler(item.id)">商家收款明细</van-button>
            </div>
            <div class="info_time">
				{{item.merchant.create_time}}
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
  data () {
    return {
      meta: this.$route.meta,
      loading: false,
      finished: false,
      isLoading: false,
      pop_show: false,
      page: 0,
      list: [],
      search_key: ''
    }
  },
  computed: {
    ...mapGetters(['sub_uid','apply_uid','apply_info'])
  },
  created () {
    this.set_sub_uid(null)
	this.set_apply_info({})
  },
  methods: {
    goToDeskHandler (id) {
      this.set_sub_uid(id)
      this.jumpTo('/desk')
    },
	goApplyShopHandler (id) {
	this.set_apply_uid(id)
	this.jumpTo({
	  name: 'applyShop'
	})
	},
	goApplyBuilHandler (id) {
		this.set_apply_uid(id)
		this.jumpTo({
		  name: 'bill'
		})
	},
    onSearchCancel () {
      this.search_key = ''
      this.page = 0
      this.finished = false
      this.isLoading = true
    },
    onSearchInput (value) {
      this.search_key = value
      this.page = 0
      this.finished = false
      this.isLoading = true
    },
    getMerchantList () {
      request.get_salesman_merchant(this.page, this.search_key).then(res => {
        this.finished = true
        if (res.code === this.SUCCESS_CODE) {
          let data = res.data
          if (data.list.length === 0) {
            this.finished = true
          }
          if (this.isLoading) {
            this.list = data.list
          } else {
            this.list = this.list.concat(data.list)
          }
        } else {
          this.$toast.fail(res.msg)
          this.finished = true
        }
        this.isLoading = false
        this.loading = false
      })
    },
    onLoad () {
      this.page = this.page + 1
      this.getMerchantList()
    },
    onRefresh () {
      this.page = 0
      this.finished = false
      this.isLoading = true
      this.list = []
    },
    ...mapMutations({
      set_sub_uid: 'SET_SUB_UID',
	  set_apply_info: 'SET_APPLY_INFO',
	 set_apply_uid: 'SET_APPLY_UID',
    })
  }
}
</script>
