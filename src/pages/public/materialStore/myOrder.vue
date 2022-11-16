<template>
  <div id="myOrder" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <!-- <div class="myOrder_head">
      <p>2019年7月30日前购买云喇叭(满299笔）,POS机(满999笔)可申请退款到余额</p>
    </div> -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text=""
        @load="onLoad">
        <div class="list_item" v-for="item in order_list" :key="item.order_id">
          <div class="item_title">
            <span>
              订单编号:{{item.order_no}}
              <b v-show="item.shipping_type === 'mail'">快递单</b>
            </span>
            <i v-show="item.status == 'pending'">待支付</i>
            <i v-show="item.status == 'paid'">已支付</i>
            <i v-show="item.status == 'part_refund'" class="blue">部分退款</i>
            <i v-show="item.status == 'refunding'" class="blue">审核中</i>
            <i v-show="item.status == 'refund_failed'" class="red" @click="showRefund(item.memo)">退款失败,查看原因</i>
            <i v-show="item.status == 'complete'">退款完成</i>
          </div>
          <div class="item_info">
            <div class="info_img">
              <img :src="item.goods.pic_url" alt="">
            </div>
            <div class="info_desc">
              <div class="desc_name">{{item.goods_name}}</div>
            </div>
            <div class="info_other">
              <div class="other_total">￥{{item.price}}</div>
              <div class="other_number">x{{item.number}}</div>
            </div>
          </div>
          <div class="item_bottom">
            <span>实付：￥{{item.money}}<i v-show="item.refund_money && item.status == 'part_refund'">(已退￥{{item.refund_money}})</i></span>
            <!-- <div class="bottom_btn">
              <a href="javascript:;" class="disable_btn" v-show="item.status === 'refunding'">
                申请退款
              </a>
              <a href="javascript:;" class="light_btn" v-show="item.status === 'paid' || item.status === 'part_refund' || item.status === 'refund_failed'">
                申请退款
              </a>
            </div> -->
            <!-- <div class="bottom_btn" v-show="item.can_refund == '0'">
              <a href="javascript:;" class="gray_btn">不支持退款</a>
            </div> -->
          </div>
        </div>
        <DataDone v-show="finished" :list="order_list"/>
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
      order_list: [],
      page: 0
    }
  },
  methods: {
    getOrderList () {
      this.page = this.page + 1
      request.get_goods_order(this.page).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          let list = res.data.order
          if (this.isLoading) {
            this.order_list = list
          } else {
            this.order_list = this.order_list.concat(list)
          }
          if (list.length === 0) {
            this.finished = true
          }
          this.loading = false
          this.isLoading = false
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    onLoad () {
      this.getOrderList()
    },
    onRefresh () {
      this.finished = false
      this.page = 0
      this.isLoading = true
      this.order_list = []
    }
  }
}
</script>