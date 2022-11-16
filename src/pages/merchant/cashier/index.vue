<template>
	<div id="cashier" class="page_container" :style="`padding-top: ${head_rem}rem;`">
		<NavBar :meta="meta" />
		<van-dropdown-menu>
			<van-dropdown-item v-model="desk_id" :options="desk_data" v-on:change="onRefresh" v-if="this.user_info.level === 'merchant'"/>
		</van-dropdown-menu>
		
		<div class="cashier_list">
			<div class="cashier_item" v-for="(item, index) in cashier_list" :key="item.uid">
				<div class="item_header">
					<span>门店名称：{{item.desk.name}}</span>
				</div>
				<div class="item_content" v-if="item.user">
					姓名：{{item.user.nickname}} / 电话: {{item.user.mobile}}
				</div>
				<div class="item_button">
					<div class="button_item">
						<van-switch active-color="#0099FF" inactive-color="#BFC2CC"
							@change="changeHandler(index, item.is_checked)" v-model="item.is_checked" />
					</div>
					<div class="button_item">
						<a href="javascript:;" @click="delCashierHandler(item.uid, index)">
							<img src="@/assets/img/merchant/merchant_icon8.png" alt="">
							<span>删除</span>
						</a>
					</div>
				</div>
			</div>
			<DataDone :list="cashier_list" />
		</div>
		<div class="fixed_button">
			<a href="javascript:" @click="jumpTo('addCashier')">添加店员</a>
		</div>
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
		computed: {
			...mapGetters(['user_token','user_info'])
		},
		data() {
			return {
				meta: this.$route.meta,
				is_checked: false,
				cashier_list: [],
				desk_id: 0,
				desk_data: [{
						text: '全部门店',
						value: 0
					}
							
				],
			}
		},
		created() {
			if (!this.user_token) {
				this.noPastTo('/login')
			}
			this.getCashierList()
			if(this.user_info.level === 'merchant'){
				this.getDeskData()
			}
		},
		methods: {
			changeHandler(index, checked) {
				let obj = this.cashier_list[index]
				let status = 'normal'

				if (!checked) {
					obj.status = 'hidden'
					status = 'hidden'
				} else {
					status = 'normal'
				}
				let id = obj.id
				request.post_cashier_toggle(id, status).then((res) => {
					if (res.code === this.SUCCESS_CODE) {
						this.$toast.success(res.msg)
						obj.is_checked = checked
						if (checked) {
							obj.status = 'normal'
						} else {
							obj.status = 'hidden'
						}
						this.$set(this.cashier_list, index, obj)
					} else {
						this.$toast.fail(res.msg)
					}
				})
			},
			//读取门店
			getDeskData(){
				 request.get_desk_list().then(res => {
				   if (res.code === this.SUCCESS_CODE) {
				         var data = res.data;
						 let arr = this.desk_data;
						 data.map((item)=>{
							 
						    arr.push({
								 'text':item.name,
								 'value':item.id
							}) 
							 
						 })
				     this.desk_data = arr;
				   } 
				 })
				
			},
			getCashierList() {
				request.get_cashier_list(this.desk_id).then(res => {
					if (res.code === this.SUCCESS_CODE) {
						let list = res.data.cashier
						list.forEach(item => {
							if (item.status === 'normal') {
								item.is_checked = true
							} else {
								item.is_checked = false
							}
						})
						
						this.cashier_list = list
					} else {
						this.$toast.fail(res.msg)
					}
				})
			},
			onRefresh(){
				this.getCashierList()
			},
			delCashierHandler(uid, index) {
				this.$dialog.confirm({
					message: '删除后，该店员恢复游客身份',
					beforeClose: (action, done) => {
						if (action === 'confirm') {
							request.post_del_cashier(uid).then(res => {
								done()
								if (res.code === this.SUCCESS_CODE) {
									this.$toast.success(res.msg)
									this.getCashierList()
								} else {
									this.$toast.fail(res.msg)
								}
							})
						} else {
							done()
						}
					}
				}).catch(() => {
					// on cancel
				})
			}
		}
	}
</script>
