<template>

	<div id="home" class="page_main" :style="`padding-top: ${head_rem}rem;`">
		<NavBar :meta="meta" />
		<indexMerchant v-if="level === 'merchant'" />
		<indexMaster v-if="level === 'master' " />
		<indexMerchant_d0 v-if="level === 'merchant_d0' " />
		<indexSale v-if="level === 'sale'" />
		<indexVisitor v-if="level === 'visitor'" />
		<indexCashier v-if="level === 'cashier'" />
		<indexShoper v-if="level === 'shoper'" />
		<indexProxy v-if="level === 'province' || level === 'city' || level === 'area'" />
		<HomeZy v-if="user_token !== '' && show_zy && level !== 'cashier' && level !== 'shoper' && level !== 'cashier' && level !== 'merchant_d0'" />
		<HomeYd v-if="banner_page_show === 1" @closeBannerHandler="closeBannerHandler" :yd_banner="yd_banner" />
	</div>
</template>
<script>
	import NavBar from '@/components/navBar'
	//主商家
	import indexMaster from './modules/index_master'
	// 商家
	import indexMerchant from './modules/index_merchant'
	// 商家 D0
    import indexMerchant_d0 from './modules/idnex_merchant_d0.vue'
	// 业务员
	import indexSale from './modules/index_sale'
	// 游客
	import indexVisitor from './modules/index_visitor'
	// 店员
	import indexCashier from './modules/index_cashier'
	// 店长
	import indexShoper from './modules/index_shoper'
	// 代理
	import indexProxy from './modules/index_proxy'
	// 引导页
	import HomeYd from './compontents/home_yd'
	import {
		getUrlParam
	} from '@/util/GetUrlParam';
	// 指引页
	import HomeZy from './compontents/home_zy'

	import {
		mapGetters,
		mapMutations
	} from 'vuex'

	import * as request from '@/api'
	export default {
		components: {
			NavBar,
			indexMaster,
			indexMerchant,
			indexSale,
			indexVisitor,
			indexCashier,
			indexProxy,
			indexShoper,
			HomeZy,
			HomeYd,
			indexMerchant_d0,
			is_code: ''
		},
		data() {
			return {
				meta: this.$route.meta,
				yd_banner: []
			}
		},
		computed: {
			level() {
				return this.user_info.level
			},
			agent_no () {
             return this.user_info.agent_no
         },
			...mapGetters(['user_token', 'user_info', 'show_zy', 'device_id', 'banner_page_show', 'is_code'])
		},
		created() {
		
			this.getHomeBannerHandler()
			this.meta.title = this.user_info.nickname
			if (this.level === 'cashier') {
				this.meta.left = ''
			}
			
			if (!this.user_token) {
				let data = {
					level: 'merchant'
				}
				this.meta.title = '游客'
				this.set_user_info(data)
			} else {
				this.getUserIndexHandler()
			}
		},
		mounted() {
			this.$nextTick(() => {
				setTimeout(() => {
					// console.log(`device_id: ${this.device_id}`)
					if (this.user_token) {
						if (this.device_id !== '') {
							this.updateDeviceId()
						}
					}
				}, 500)
			})
		},
		methods: {
			// 关闭引导页
			closeBannerHandler() {
				this.set_banner_page_show(2)
			},
			// 用户登录
			setUserInfoHandler(res) {
				let data = res.data.user
				this.set_user_info(data)
				this.set_user_token(data.token)
				// 设置标题
				this.meta.title = data.nickname ? data.nickname : data.username
			},
			// 更新推送id
			updateDeviceId() {
				request.post_device_id(this.device_id, this.systemType).then(res => {
					console.log(JSON.stringify(res))
					if (res.code === this.SUCCESS_CODE) {
						console.log('更新推送id成功')
						//  on success
					} else {
						this.$toast.fail(res.msg)
					}
				})
			},

			getHomeBannerHandler() {
				request.get_home_banner(this.is_code).then(res => {
					if (res.code === this.SUCCESS_CODE) {
						let banner = res.data.banner ? res.data.banner : []

						this.yd_banner = res.data.yd_banner
						this.set_index_banner(banner)

						// 微信登录操作
						res.data.user && this.setUserInfoHandler(res)
					} else {
						this.$toast.fail(res.msg)
					}
				})
			},
			getUserIndexHandler() {
				request.get_user_index().then(res => {
					if (res.code === this.SUCCESS_CODE) {

						// let data = res.data.user
						// this.set_user_info(data)
						// this.set_user_token(data.token)
						this.setUserInfoHandler(res)
					} else {
						this.$toast.fail(res.msg)
					}
				})
			},
			...mapMutations({
				set_user_info: 'UPDATE_USER_INFO',
				set_user_token: 'UPDATE_USER_TOKEN',
				set_index_banner: 'SET_INDEX_BANNER',
				set_banner_page_show: 'SET_BANNER_PAGE_SHOW',
			})
		}
	}
</script>
