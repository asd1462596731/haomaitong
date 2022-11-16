<template>
	<div id="addShop" class="page_container" :style="`padding-top: ${head_rem}rem;`">
		<NavBar :meta="meta" />
		<div class="add_info" v-for="(item, index) in list" :key="item.id" @click="setSelectIndex(index)">
			<div class="info_img">
				<img :src="item.avatar" alt="">
			</div>
			<div class="info_desc">
				<span class="desc_name" v-if="item.merchant">{{item.merchant.merchant_alias}}</span>
				<span class="desc_phone">{{item.mobile}}</span>
			</div>
			<div class="info_time">
				{{item.created_at}}
			</div>
			<div class="info_status_box" v-if="item.merchant">
				<div class="info_status color4" v-show="!item.merchant">未申请</div>
				<div class="info_status color4" v-show="item.merchant.sxf_status === 'imperfect'">未完善</div>
				<div class="info_status color1" v-show="item.merchant.sxf_status === 'wait'">待审核</div>
				<div class="info_status color2" v-show="item.merchant.sxf_status === 'auditing'">审核中</div>
				<div class="info_status color3" v-show="item.merchant.sxf_status === 'reject'">第三方驳回</div>
				<div class="info_status color3" v-show="item.merchant.sxf_status === 'back'">平台驳回</div>
			</div>
			<div class="info_icon">
				<img v-show="index !== selectIndex" src="@/assets/img/proxy/proxy_icon2.png" alt="">
				<img v-show="index === selectIndex" src="@/assets/img/proxy/proxy_icon3.png" alt="">
			</div>
		</div>
		<div class="add_noData" v-show="list.length === 0">
			暂无更多数据
		</div>

		<div class="fixed_button">
			<a class="btn" href="javascript:;" :class="[canSubmit ? '' : 'disable']" @click="handAddSalesman()">帮他开户</a>
		</div>
	</div>
</template>

<script>
	import NavBar from '@/components/navBar'
	import * as request from '@/api'
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				meta: this.$route.meta,
				mobile: '',
				data: '',
				code: '',
				msg: '',
				status: -1,
				canSubmit: false,
				list: [],
				selectIndex: -1
			}
		},
		components: {
			NavBar,
		},
		computed: {
			...mapGetters(['user_info', 'apply_info'])
		},
		created() {
			this.getAddShopListFunc()
			this.set_apply_uid(null)
			this.set_apply_info({})
			this.set_apply_info({})
			this.set_merchant_status_show(false)
		},
		methods: {
			getAddShopListFunc() {
				request.get_salesman_cooperate().then(res => {
					if (res.code === this.SUCCESS_CODE) {
						let arr = res.data.list
						if (arr.length === 0) {
							this.list = []
						} else {
							this.list = res.data.list
						}
					} else {
						this.$toast.fail(res.msg)
					}
				})
			},
			setSelectIndex(index) {
				this.selectIndex = index
				let mobile = this.list[this.selectIndex].mobile
				this.status = this.list[this.selectIndex].status
				if (this.selectIndex !== -1) {
					this.canSubmit = true
				}
				this.set_picture({})
				this.set_rate_region(null)
				this.set_apply_info_address(null)
				this.set_pay_rate(null)
			},
			handAddSalesman() {
				if (!this.canSubmit) {
					return false
				}
				let obj = this.list[this.selectIndex]
				let uid = obj.id
				this.set_apply_uid(uid)
				this.jumpTo({
					name: 'applyShop'
				})
			},
			...mapMutations({
				set_picture: 'SET_PICTURE',
				set_rate_region: 'SET_RATE_REGION',
				set_pay_rate: 'SET_PAY_RATE',
				set_apply_info: 'SET_APPLY_INFO',
				set_apply_info_address: 'SET_APPLY_INFO_ADDRESS',
				set_apply_uid: 'SET_APPLY_UID',
				set_merchant_status_show: 'SET_MERCHANT_STATUS_SHOW'
			})
		}
	}
</script>

<style lang="less" scoped>

</style>
