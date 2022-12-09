<template>
  <div id="header">
    <div id="merchant_header">
      <div class="header_shop"><span>{{merchant_name}}</span></div>
      <div class="header_money">
        <div class="_money">今日收款(元)</div>
        <div class="header_">{{ total_money }}</div>
      </div>
      <div class="header_deal"> 
        <div class="dot"></div>
      交易笔数(笔)：{{ total_count }} </div>
      <div class="header_fans">
        <div class="dot"></div>
        新增粉丝：{{ today_count }} </div>
    </div>
    <div class="row">
      <van-row class="statement">
        <!-- 生意报表 -->
        <van-col span="11" @click="jumpTo('/chartsMerchant')">
          <div class="merchant_title">
            经营报表<van-icon  name="arrow" /></div>
          <div id="merchant_line_chart"></div>
        </van-col>
        <van-col span="2"></van-col>
        <van-col class="col_two" span="11">
          <!-- 实时账本 -->
          <div class="merchant_title">
            实时账本<van-icon name="arrow" /></div>
          <div class="merchant_bill">
            <template v-for="item in dataList">
              <div class="bill_item" :key="item.pay_day" v-show="item.order.length > 0">
                <div class="item_list">
                  <div class="item" @click="jumpTo('/bill')" v-for="obj in item.order" :key="obj.id">
                    <div class="item_img">
                      <img v-if="obj.pay_type === 'wechat'" src="@/assets/img/merchant/merchant_icon5.png" alt="">
                      <img v-if="obj.pay_type === 'alipay'" src="@/assets/img/merchant/merchant_icon3.png" alt="">
                      <img v-if="obj.pay_type === 'unionpay'" src="@/assets/img/merchant/merchant_icon2.png" alt="">
                      <img v-if="!obj.pay_type" src="@/assets/img/merchant/merchant_icon5.png" alt="">
                    </div>
                    <div class="item_box">
                      <div class="item_money">
                        <i v-if="obj.status === 'paid'" style="font-weight: bold;">+</i>
                        <i v-if="obj.status === 'refunded'" style="font-weight: bold;">-</i>
                        {{( obj.money )}}
                      </div>
                    </div>
                    <div class="item_desc">
                      {{ obj.paid_at ? obj.paid_at : obj.update_time }}
                      <!-- <div style="padding: 5px 0px;">
                          <span style="font-size: 0.3rem;color: red;" v-if="obj.status === 'paid'">订单状态：支付成功</span>
                        </div> -->
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div v-if="dataList.length === 0 " class="not" @click="jumpTo('/bill')">暂无交易</div>
          </div>
        </van-col>
      </van-row>
    </div>
    <div class="home-banner-box" style="width:95%;height:2rem;margin-left: .23rem;margin-top: .23rem;">
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(item,index) in bannerList"
        :key="index">
        <img style="width:100%;height:2.5rem" :src="item.image" alt="">
      </van-swipe-item>
    </van-swipe>
  </div>
    <HomeNav :nav-list="nav_list" style="margin-top:.7rem" />
    <HomeLink style="margin-top:-0.5rem" :link-list="link_list" />
  </div>
</template>

<script>
import HomeNav from '../compontents/home_nav'
import HomeLink from '../compontents/home_link'
import HomeBanner from '../compontents/home_banner'
import HomeBottom from '../compontents/home_bottom'
import { merchant_nav_list, merchant_link_list } from '@/config'
import * as request from '@/api'
import {
		mapGetters,
	} from 'vuex'
export default {
  components: {
    HomeNav,
    HomeLink,
    HomeBanner,
    HomeBottom
  },
  data() {
    return {
      // this.page, this.order_value, this.sort_value, this.desk_id, this.apply_uid, this.create_time, this.pay_type, this.status, this.merchant_id
      nav_list: merchant_nav_list,
      link_list: merchant_link_list,
      all_money: [],
      line_chat_list: [],
      apply_uid:null,
      dataList: [],
      today_count: 0,
      total_money: 0,
      total_count: 0,
      mach_id: null,
      merchant_name:'',
      order_value: 0,
      bannerList: [
      ],
      sort_value: 0,
      desk_id: 0,
      start_time: null,
      create_time: '',
      pay_type: '',
      status: '',
      key: 2,
      merchant_id:null,
      end_time: null,
      link_list: merchant_link_list,
      page: 1,
      order_value: 1,
    }
  },
  computed: {
    ...mapGetters(['is_code'])
  },
  mounted() {
    // this.echear()
    this.getOrderReportFunc()
    this.getOrderIndexFunc()
    this.getUserIndexHandler()
    this.getHomeBannerHandler()
    this.getFnasListHandler()
  },
  methods: {
    //获取粉丝
    getFnasListHandler() {
      request.post_user_myfans(this.page, this.desk_id, 0).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          this.today_count = res.data.today_count
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    //获取实时账单
    getOrderIndexFunc() {
      request.get_merchant_index(this.page, this.order_value, this.sort_value, this.desk_id, this.apply_uid, this.create_time, this.pay_type, this.status, this.merchant_id)
        .then(res => {
          let daList = []
          daList.push(res.data)
          console.log(res.data);
          if (daList[0].order) {
            daList[0].order.map((item, index, arr) => {
              item.paid_at = item.paid_at.substring(10, 19)
              item.update_time = item.update_time.substring(10, 19)
              return arr
            })
            this.total_money = res.data.total_money
            this.total_count = res.data.total_count
            this.dataList.push(res.data)
          } else {
            console.log(this.dataList);
          }
        })
    },
    getOrderReportFunc() {
      // this.time = this.start_time+'-'+this.end_time

      request.post_order_report(this.start_time, this.end_time, this.key, this.mach_id, this.desk_id).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          res.data.data_time.forEach((item, index, arr) => {
            this.line_chat_list.push(item.slice(5, 11))
          });
          var data = res.data.data;
          this.all_money = [];
          var pice_total = 0;
          var pice_zy = 0;
          var pice_kj = 0;
          var list_data = [];
          for (const key in data) {
            list_data.push({
              day: key,
              pice_zy: this.$math.round(pice_zy, 4),
              pice_kj: this.$math.round(pice_kj, 4),
              pice_total: this.$math.round(pice_total, 4)
            })
            pice_total += Number(data[key][0]);
            pice_zy += Number(data[key][1]);
            pice_kj += Number(data[key][2]);
            this.all_money.push( Number(data[key][0]))
          }

          this.echear()
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    //获取图片
    getHomeBannerHandler() {
				request.get_home_banner(this.is_code).then(res => {
          if (res.code === this.SUCCESS_CODE) {
						this.bannerList = res.data.merchant_banner
					} else {
						this.$toast.fail(res.msg)
					}
				})
			},
    //获取商户名
    getUserIndexHandler() {
				request.get_user_index().then(res => {
          if (res.code === this.SUCCESS_CODE) {
            if (res.data.user.merchant != '' && res.data.user.merchant != null) {
              this.nav_list[2].text = '开户资料'
            } else {
              this.nav_list[2].text = '商家开户'
            }
						this.merchant_name = res.data.user.merchant.merchant_alias
					} else {
						this.$toast.fail(res.msg)
					}
				})
    },
      //echart表格
    echear() {
      let myChart = this.$echarts.init(document.getElementById('merchant_line_chart'))
      var option = {
        color: ["#3398DB"],
        tooltip: {
          axisPointer: {
            type: "cross"
          }
        },
        grid: {
          left: '23%',
          top: '12%',
          bottom: '15%'
        },
        xAxis: [{
          show: true,
          type: "category",
          name: "",
          data:this.line_chat_list,
          axisLabel: {
            interval:1,
            textStyle: {
              fontSize: "10",
            },
          },
          axisLine: {
            lineStyle: {
              width: 1 // 粗细
            }
          },
          //    splitLine: {     //网格线
          //    show: true
          // },
          nameTextStyle: {
            color: '#909198',
            fontWeight: "100"
          },
          axisTick: {
            show: false
          }
        }],
        yAxis: [{
          type: "value",
          axisLine: {
            lineStyle: {
            },
            show: false, //不显示坐标轴线
          },
          axisLabel: {
            textStyle: {
              fontSize: "10",
            },
          },
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '总营收',
          type: 'line',
          symbol: "circle",
          itemStyle: {
                normal: {
                    lineStyle: {
                      width:1.4// 0.1的线条是非常细的了
                    }
                }
            },
          data: this.all_money
        },
          
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>

<style>

</style>