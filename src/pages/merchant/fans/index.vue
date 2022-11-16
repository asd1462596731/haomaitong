<template>
	<div id="fans" class="page_container" :style="`padding-top: ${head_rem}rem;`">
		<NavBar :meta="meta" />
		<div class="fnas_head">
			<div class="head_title">粉丝数量(个）</div>
			<div class="head_content">{{fans_count}}</div>
		</div>
		<van-dropdown-menu v-if="this.user_info.level === 'master'" >
			<van-dropdown-item v-model="merchants_id" :options="merchants_list" v-on:change="onRefresh_m" />
		</van-dropdown-menu>
		<van-dropdown-menu>
			<van-dropdown-item v-model="desk_id" :options="desk_data" v-on:change="onRefresh"
				v-if="this.user_info.level === 'merchant' || this.user_info.level === 'master'" />
		</van-dropdown-menu>
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			<van-list v-model="loading" :finished="finished" finished-text="" @load="onLoad">
				<div class="fans_item" v-for="item in fans_list" :key="item.id">
					<div class="item_img">
						<img v-if="item.pay_type === 'wechat'" src="@/assets/img/merchant/merchant_icon3.png" alt="">
						<img v-if="item.pay_type === 'alipay'" src="@/assets/img/merchant/merchant_icon5.png" alt="">
						<img v-if="item.pay_type === 'unionpay'" src="@/assets/img/merchant/merchant_icon4.png" alt="">
					</div>
					<div class="item_desc">
						<div class="desc_top">
							<span>{{item.serial}}</span>
							<i>[粉丝编号]<i>{{item.desk_name}}</i></i>

						</div>
						<div class="desc_center">
							<span v-if="item.from === 'barcode'">通过二维码支付成为您的粉丝</span>
							<span v-if="item.from === 'app'">通过app被扫支付成为您的粉丝</span>
							<span v-if="item.from === 'face'">通过刷脸支付成为您的粉丝</span>
						</div>
						<div class="desc_bottom">
							{{item.create_time}}
						</div>
					</div>
				</div>
				<DataDone v-show="finished" :list="fans_list" />
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
				fans_count: 0,
				fans_list: [],
				desk_id: 0,
				merchants_id: 0,
				desk_data: [{
					text: '全部门店',
					value: 0
				}],
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
			onLoad() {
				this.page = this.page + 1
				this.getFnasListHandler()
			},
			onRefresh() {
				this.page = 0
				this.fans_list = []
				this.finished = false
				this.isLoading = true
				// this.getFnasListHandler()
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
				this.fans_list = []
				this.finished = false
				this.isLoading = true
				this.desk_id = 0
			},
			getFnasListHandler() {
				request.post_user_myfans(this.page, this.desk_id,this.merchants_id).then(res => {
					if (res.code === this.SUCCESS_CODE) {
						let fans_list = res.data.fans
						if (this.isLoading) {
							this.fans_list = fans_list
						} else {
							this.fans_list = this.fans_list.concat(fans_list)
						}
						this.fans_count = res.data.count
						this.loading = false
						this.isLoading = false
						if (fans_list.length === 0) {
							this.finished = true
						}
					} else {
						this.$toast.fail(res.msg)
					}
				})
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
			}
		}
	}
</script>
