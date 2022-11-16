<template>
	<div id="bill" class="page_main" :style="`padding-top: ${head_rem}rem;`">
		<NavBar :meta="meta" />
		<div class="banner_header_public" v-if="billHead !== ''">
			<span>{{billHead}}</span>
		</div>
		<div class="div">
			<van-dropdown-menu>
				<van-dropdown-item v-model="order_value" :options="order_key" v-on:change="onRefresh" />
				<van-dropdown-item v-model="desk_id" :options="desk_data" v-on:change="onRefresh"
					v-if="(this.level !== 'cashier' && this.apply_uid != null) || (this.level === 'master' && this.apply_uid == null) || (this.level === 'merchant' && this.apply_uid == null) ||  this.level === 'shoper'" />
				<van-dropdown-item v-model="sort_value" :options="sort_key" v-on:change="onRefresh" />
			</van-dropdown-menu>
		</div>
		<div class="top-title">
			<span>收款总计</span>
			<p style="font-size: 0.32rem">
				收款:
				<span style="font-size: 0.293333rem;">
					{{this.amount}}元({{this.orderNum}}笔)
				</span>
			</p>
		</div>
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			<van-list v-model="loading" :finished="finished" finished-text="" @load="onLoad">
				<template v-for="item in dataList">
					<div class="bill_item" :key="item.pay_day" v-show="item.order.length > 0">
						<div class="item_title">
							<span>{{item.date}}</span>
							<p>收款:<span>{{item.total_money}}元({{item.total_count}}笔)</span></p>
						</div>
						<div class="item_list">
							<div class="item" @click="showDetailHandler(obj)" v-for="obj in item.order" :key="obj.id">
								<div class="item_img">
									<img v-if="obj.pay_type === 'wechat'" src="@/assets/img/merchant/merchant_icon5.png"
										alt="">
									<img v-if="obj.pay_type === 'alipay'" src="@/assets/img/merchant/merchant_icon3.png"
										alt="">
									<img v-if="obj.pay_type === 'unionpay'"
										src="@/assets/img/merchant/merchant_icon2.png" alt="">
									<img v-if="!obj.pay_type" src="@/assets/img/merchant/merchant_icon5.png" alt="">
								</div>
								<div class="item_box">
									<div class="item_desc">
										<div class="desc_top">
											<span v-if="obj.pay_type === 'wechat'">微信支付</span>
											<span v-if="obj.pay_type === 'alipay'">支付宝支付</span>
											<span v-if="obj.pay_type === 'unionpay'">银联支付</span>
											<span v-if="!obj.pay_type">微信支付</span>
											<span style="font-size: 0.3rem;color: red;" v-for="d in desk_data">
												<span v-if="d.value === obj.desk_id">{{d.text}}</span>
											</span>
											<span style="font-size: 0.3rem;color: red;"
												v-if="is_type_merchant === 'cashier'">
												<span>{{desk_name}}</span>
											</span>
										</div>
										<div class="desc_bottom">
											{{obj.paid_at ? obj.paid_at : obj.update_time}}

										</div>
										<div style="padding: 5px 0px;">
											<span style="font-size: 0.3rem;color: red;"
												v-if="obj.status === 'paid'">订单状态：支付成功</span>
											<span style="font-size: 0.3rem;"
												v-if="obj.status === 'pending'">订单状态：待付款</span>
											<span style="font-size: 0.3rem;"
												v-if="obj.status === 'failed'">订单状态：支付失败</span>
											<span style="font-size: 0.3rem;"
												v-if="obj.status === 'refunding'">订单状态：待退款</span>
											<span style="font-size: 0.3rem;"
												v-if="obj.status === 'refunded'">订单状态：退款成功</span>
										</div>
									</div>
									<div class="item_money">

										<i v-if="obj.status === 'paid'" style="color: red;font-weight: bold;">+</i>
										<i v-if="obj.status === 'refunded'" style="color: red;font-weight: bold;">-</i>
										<i>￥</i>{{obj.money}}
									</div>
								</div>
							</div>
						</div>
					</div>
				</template>
				<DataDone v-show="finished" :list="dataList" />
			</van-list>
		</van-pull-refresh>

		<van-popup position="bottom" :style="{height: 'auto'}" v-model="pop_show">
			<div class="bill_detail">
				<div class="detail_head">
					<a href="javascript:;" @click="closeDetailHandler">
						<img src="@/assets/img/bill/bill_icon5.png" alt="">
					</a>
					账单详情
				</div>
				<div class="bill_list">
					<div class="list_item">
						<span>【实付金额】</span>
						<p>
							<i>￥</i>{{detail.money}}
						</p>
					</div>
					<div class="list_item">
						<span>【优惠方式】</span>
						<p>
							无
						</p>
					</div>
					<div class="list_item">
						<span>【消费总额】</span>
						<p>
							<i>￥</i>{{detail.money}}
						</p>
					</div>
					<div class="list_item">
						<span>【支付方式】</span>
						<p v-if="detail.pay_type === 'wechat'">
							微信支付
						</p>
						<p v-if="detail.pay_type === 'alipay'">
							支付宝支付
						</p>
						<p v-if="detail.pay_type === 'unionpay'">
							银联支付
						</p>
					</div>
					<div class="list_item">
						<span>【订单编号】</span>
						<p>
							{{detail.order_no}}
						</p>
					</div>
					<div class="list_item">
						<span>【付款状态】</span>
						<p v-if="detail.status === 'paid'">
							支付成功
						</p>
						<p v-if="detail.status === 'pending'">
							待支付
						</p>
						<p v-if="detail.status === 'failed'">
							订单失败
						</p>
						<p v-if="detail.status === 'refunding'">
							待退款
						</p>
						<p v-if="detail.status === 'refunded'">
							退款成功
						</p>
					</div>
					<div class="list_item">
						<span>【付款时间】</span>
						<p>
							{{detail.paid_at}}
						</p>
					</div>
					<div class="list_item size_color">
						<van-button type="primary" plain size="small" v-if="detail.status === 'paid'"
							v-on:click="get_refund()">点击订单退款</van-button>
						<!-- <van-button type="primary" plain size="small" v-if="detail.status ='paid'">点击订单退款</van-button> -->

					</div>
				</div>

			</div>
		</van-popup>
	</div>
</template>
<script>
	import DataDone from '@/components/dataDone'
	import NavBar from '@/components/navBar'
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import * as request from '@/api'
	export default {
		components: {
			NavBar,
			DataDone
		},
		data() {
			return {
				amount:0,
				orderNum:0,
				meta: this.$route.meta,
				loading: false,
				finished: false,
				isLoading: false,
				pop_show: false,
				page: 0,
				dataList: [],
				detail: {},
				billHead: '',
				order_key: [{
						text: '全部订单',
						value: 0
					},
					{
						text: '今日订单',
						value: 1
					},
					{
						text: '昨日订单',
						value: 5
					},
					{
						text: '本周订单',
						value: 2
					},
					{
						text: '本月订单',
						value: 3
					},
					{
						text: '上月订单',
						value: 4
					},
				],
				sort_key: [{
						text: '默认排序',
						value: 0
					},
					{
						text: '金额排序',
						value: 1
					},
					{
						text: '订单时间',
						value: 2
					},
				],
				desk_data: [{
					text: '全部门店',
					value: 0
				}, ],
				order_value: 0,
				sort_value: 0,
				desk_id: 0,
				is_type_merchant: '',
				desk_name: ''
			}
		},
		computed: {
			level() {
				return this.user_info.level
			},
			...mapGetters([
				'user_info',
				'user_token',
				'apply_uid'

			])
		},
		created() {
			if (!this.user_token) {
				this.finished = true
			}
			this.is_type_merchant = this.user_info.level;
			if (this.user_info.level == 'merchant' || this.user_info.level == 'cashier' || this.user_info.level == 'shoper') {
				this.desk_name = this.user_info.desk.name;
			}
			this.getHeadBannerHandler()
			if ((this.level !== 'visitor') && (this.user_info.id !== this.apply_uid)) {
				this.getDeskData()
			}


		},
		destroyed() {
			this.set_apply_uid(null)
		},
		methods: {
			getHeadBannerHandler() {
				request.get_profile_single(2).then(res => {
					if (res.code === this.SUCCESS_CODE) {
						let data = res.data.detail
						this.billHead = data.description
					} else {
						this.$toast.fail(res.msg)
					}
				})
			},
			getOrderIndexFunc() {

				this.page = this.page + 1
				if (this.level === 'cashier') {
					// 店员
					request.get_cashier_index(this.page, this.order_value, this.sort_value, this.desk_id).then(res => {
						this.getOrderIndexCallBack(res)
					})
				} else if (this.level === 'merchant' || this.level === 'master' || this.level === 'shoper' ) {
					// 商家
					request.get_merchant_index(this.page, this.order_value, this.sort_value, this.desk_id, this.apply_uid)
						.then(res => {
							this.getOrderIndexCallBack(res)
						})
				} else if (this.level === 'province' || this.level === 'city' || this.level === 'area' || this.level ===
					'sale' || this.level === 'merchant_d0') {
					//代理
					request.get_daili_index(this.page, this.order_value, this.sort_value, this.desk_id, this.apply_uid)
						.then(res => {
							this.getOrderIndexCallBack(res)
						})
				} else {
					this.finished = true
					this.isLoading = false
					this.loading = false
				}
			},
			getOrderIndexCallBack(res) {
				if (res.code === this.SUCCESS_CODE) {
					let data = res.data
					let pay_day = data.pay_day
					if (pay_day) {
						pay_day = pay_day.toString()
						data.date = pay_day.substr(0, 4) + '-' + pay_day.substr(4, 2) + '-' + pay_day.substr(6, 2)
					}
					let now_date = this.getDate()
					if (data.date === now_date) {
						data.date = '今天'
					}
					if (data.length === 0) {
						this.finished = true
						this.isLoading = false
						this.loading = false
						return false
					}
					if (this.isLoading) {
						this.dataList = []
						this.amount = data.amount
						this.orderNum = data.orderNum
						this.dataList.push(data)
					} else {
						this.amount = data.amount
						this.orderNum = data.orderNum
						this.dataList.push(data)
					}
					this.isLoading = false
					this.loading = false

				} else {
					this.$toast.fail(res)
				}
			},
			get_refund() {

				this.$dialog.confirm({
					message: "确认要退款？"
				}).then(() => {
					var order_no = this.detail.order_no;
					request.post_order_refund(order_no).then(res => {
						if (res.code === this.SUCCESS_CODE) {
							let data = res.data.detail
							this.billHead = data.description
						} else {
							this.$toast.fail(res.msg)
						}
					})
				}).catch(() => {
					// on canccel
				})

			},
			getDate() {
				let date = new Date()
				let year = date.getFullYear()
				let month = date.getMonth() + 1
				if (month < 10) {
					month = '0' + month
				}
				let day = date.getDate()
				if (day < 10) {
					day = '0' + day
				}
				return year + '-' + month + '-' + day
			},
			showDetailHandler(obj) {
				// console.log(obj);
				this.detail = obj
				this.pop_show = true
			},
			closeDetailHandler() {
				this.pop_show = false
			},
			onLoad() {
				//    this.getOrderIndexFunc()
				this.test();
			},
			onRefresh() {
				this.page = 0
				this.dataList = []
				this.amount = 0
				this.orderNum = 0
				this.loading = true,
					this.finished = false,
					this.isLoading = false,
					this.pop_show = false,
					this.test();
			},
			test() {
				this.getOrderIndexFunc()
			},
			//读取门店
			getDeskData() {
				if ((this.level === 'merchant' && this.apply_uid == null) || this.level === 'master' || this.level === 'shoper') {
					request.get_desk_list(this.apply_uid).then(res => {
						if (res.code === this.SUCCESS_CODE) {
							var data = res.data;
							let arr = this.desk_data;
							data.map((item) => {

								arr.push({
									'text': item.name,
									'value': item.id
								})

							})
							this.desk_data = arr;
						}
					})
				} else if ((this.level === 'province' || this.level === 'city' || this.level === 'area' || this.level ===
						'sale') && this.apply_uid != null) {
					request.get_dalidesk_list(this.apply_uid).then(res => {
						if (res.code === this.SUCCESS_CODE) {
							var data = res.data;
							let arr = this.desk_data;
							data.map((item) => {

								arr.push({
									'text': item.name,
									'value': item.id
								})

							})
							this.desk_data = arr;
						}
					})
				}


			},
			...mapMutations({
				set_apply_uid: 'SET_APPLY_UID',
			})
		}
	}
</script>
<style>
	.size_color {
		color: #000 !important;
	}

	.top-title {
		display: flex;
		justify-content: space-between;
		padding: 0 0.533333rem;
		margin-top: 0.2rem;
		margin-bottom: 0.2rem;
		font-size: 0.32rem;
		color: #909399;
	}
</style>
