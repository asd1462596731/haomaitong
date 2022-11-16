<template>
	<div id="cross" class="page_container" :style="`padding-top: ${head_rem}rem;`">
		<NavBar :meta="meta" />
		<div class="cross_head banner_header_public">
			<img src="@/assets/img/public/public_icon1.png" alt="">
			<span>粉丝消费低于1元，不参数跨界收益</span>
		</div>
		<van-dropdown-menu v-if="this.user_info.level === 'master'" >
			<van-dropdown-item v-model="merchants_id" :options="merchants_list" v-on:change="onRefresh_m" />
		</van-dropdown-menu>
		<van-dropdown-menu>
			<van-dropdown-item v-model="desk_id" :options="desk_data" v-on:change="onRefresh"
				v-if="this.user_info.level === 'merchant' || this.user_info.level === 'master' " />
		</van-dropdown-menu>
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			<van-list v-model="loading" :finished="finished" finished-text="" @load="onLoad">
				<div class="cross_item" v-for="(item,index) in money_list" :key="index">
					<div class="item_title">
						<span>{{item.day}}</span>
						<p>收款:<span>{{item.count}}元({{item.commission_log.length}}笔)</span></p>
					</div>
					<div class="item_list">
						<div class="item" v-for="cross in item.commission_log" :key="cross.id">
							<div class="item_img">
								<img src="@/assets/img/merchant/monitubiao.png" alt="">
							</div>
							<div class="item_box">
								<div class="item_desc">
									<div class="desc_top">
										<span>10011001</span>
										<i>[粉丝编号]<i>{{cross.desk_name}}</i></i>
									</div>
									<div class="desc_bottom">
										{{cross.update_time}}
									</div>
								</div>
								<div class="item_money">
									￥{{cross.money}}
								</div>
							</div>
						</div>
					</div>
				</div>
				<DataDone v-show="finished" :list="money_list" />
			</van-list>
		</van-pull-refresh>
	</div>
</template>
<script>
	import DataDone from '@/components/dataDone'
	import NavBar from '@/components/navBar'
	import * as request from '@/api'
	import {
		mapGetters
	} from 'vuex'
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
				page: 0,
				merchants_id: 0,
				money_list: [],
				desk_id: 0,
				desk_data: [{
						text: '全部门店',
						value: 0
					}
				],
				merchants_list: [{
					text: '选择商家',
					value: 0
				}]
			}
		},
		computed: {
			...mapGetters(['user_token', 'user_info'])
		},
		created() {
			if (!this.user_token) {
				this.noPastTo('/login')
			}
			if (this.user_info.level === 'merchant' || this.user_info.level === 'master') {
				this.getDeskData()
				this.getMerData()
			}
		},
		methods: {
			getCorssMoneyList() {
				this.page = this.page + 1
				request.get_money_commission(this.page, this.desk_id,this.merchants_id).then(res => {
					if (res.code === this.SUCCESS_CODE) {
						let data = res.data
						let day = data.day
						if (day) {
							day = day.toString()
							data.day = day.substr(0, 4) + '-' + day.substr(4, 2) + '-' + day.substr(6, 2)
						}
						let now_date = this.getDate()
						if (data.day === now_date) {
							data.day = '今天'
						}
						if (data.length === 0) {
							this.finished = true
							this.isLoading = false
							this.loading = false
							return false
						}
						if (this.isLoading) {
							this.money_list = []
							this.money_list.push(data)
						} else {
							this.money_list.push(data)
						}
						this.isLoading = false
						this.loading = false
					} else {
						this.$toast.fail(res.msg)
					}
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
			//读取门店
			getDeskData() {
				request.get_desk_list(this.merchants_id).then(res => {
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

			},
			//读取商家
			getMerData() {
				request.get_list_mer(this.user_info.id).then(res => {
					if (res.code === this.SUCCESS_CODE) {
						var data = res.data;
						let arr = this.merchants_list;
						data.map((item) => {
						
							arr.push({
								'text': item.text,
								'value': item.value
							})
						
						})
						this.merchants_list = arr
					}
				})
			},
			
			onLoad() {
				this.getCorssMoneyList()
			},
			onRefresh() {
				this.finished = false
				this.page = 0
				this.loading = true
				this.money_list = []
				this.onLoad()
			},
			onRefresh_m(res){
				this.page = 0
				this.merchants_id = res
				this.desk_data = [{
					'text' : '全部门店',
					'value' : 0
				},]
				//重新读取门店
				this.getDeskData()
				this.fans_count = 0
				this.money_list = []
				this.finished = false
				this.isLoading = true
				this.desk_id = 0
			}
		}
	}
</script>
