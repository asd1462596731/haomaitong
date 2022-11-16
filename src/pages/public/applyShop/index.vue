<template>
	<div id="applyShop" class="page_container" :style="`padding-top: ${head_rem}rem;`">
		<NavBar :meta="meta" :status="apply_status" />
		<div class="applyShop_head" @click="changeLicenseType">
			<div class="head_top">
				<div class="top_title"><i style="color: red;">*</i>入网类型</div>
				<div class="top_desc">
					<i v-show="apply_info.license_type === 'xiaowei'">小微商户</i>
					<i v-show="apply_info.license_type === 'geti'">个体户</i>
					<i v-show="apply_info.license_type === 'qiye'">企业</i>
					<i v-show="!apply_info.license_type">小微商户</i>
					<img src="@/assets/img/public/public_icon2.png" alt="">
				</div>
			</div>
			<div class="head_bottom">
				支持个体工商户、 企业
			</div>
		</div>
		<div class="applyShop_form">
			<div class="form_tabs">
				<div class="tab_item" :class="{'active': apply_shop_tab === 1}" @click="changeTabHandler(1)">
					1.基本信息
				</div>
				<div class="tab_item" :class="{'active': apply_shop_tab === 2}" @click="changeTabHandler(2)">
					2.结算信息
				</div>
				<div class="tab_item" :class="{'active': apply_shop_tab === 3}" @click="changeTabHandler(3)">
					3.商户信息
				</div>
			</div>
			<div class="form_content" v-show="apply_shop_tab === 1">
				<Basic :address-show="addressShow" :is-self="isSelf" />
			</div>
			<div class="form_content" v-show="apply_shop_tab === 2">
				<Seelement />
			</div>
			<div class="form_content" v-show="apply_shop_tab === 3">
				<Shop />
			</div>
		</div>
		<div class="applyShop_button">
			<van-row type="flex" justify="center">
				<van-button :disabled="disable"
					v-if="apply_status === 'success' || apply_status === 'auditing'"
					type="info" :round="true" block>{{button_text}}</van-button>
				<van-button :disabled="disable" @click="applySubmit" v-else-if="apply_status === 'imperfect'"
					type="info" :round="true" block>{{button_text}}</van-button>
				<van-button :disabled="disable" @click="applySubmit" v-else-if="apply_status === 'wait'"
					type="info" :round="true" block>{{button_text}}</van-button>
				<template v-else>
					<van-col span="8" @click="applyLast" v-if="apply_shop_tab == 3 || apply_shop_tab == 2">
						<van-button style="height: 40px;width: 100px;line-height: 40px;" type="info" size="small">上一步</van-button>
					</van-col>
					<van-col span="8" @click="applyNext" v-if="apply_shop_tab == 1 || apply_shop_tab == 2">
						<van-button style="height: 40px;width: 100px;line-height: 40px;margin-left: 10px;" type="info">下一步</van-button>
					</van-col>
					<van-col span="8" @click="applySubmit" v-if="apply_shop_tab == 3">
						<van-button style="height: 40px;width: 110px;line-height: 40px;" type="info">{{button_text}}
						</van-button>
					</van-col>
				</template>
			</van-row>

		</div>

		<!-- 入网类型 -->
		<van-action-sheet v-model="showBusinessType" :actions="actions" @select="onSelectHandler" />
		<van-popup v-model="status_show" closeable :overlay="false" position="top" close-icon-position="bottom-right"
			@close="statusCloseHandler" :style="{ height: 'auto' }">
			<!-- <p :style="`padding-top: ${top_rem + 0.4}rem;`" class="apply_shop_error">test</p> -->
		</van-popup>
	</div>
</template>
<script>
	import NavBar from '@/components/navBar'
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import Basic from './compontents/basic'
	import Seelement from './compontents/settlement'
	import Shop from './compontents/shop'
	import Area from '@/assets/js/area.js'
	import AreaId from '@/assets/js/area_id.js'
	import * as request from '@/api'
	import {
		stat
	} from 'fs'
	export default {
		components: {
			Basic,
			Seelement,
			Shop,
			NavBar
		},
		data() {
			return {
				meta: this.$route.meta,
				addressShow: '',
				showBusinessType: false,
				actions: [{
					key: 'xiaowei',
					name: '小微商户'
				}, {
					key: 'geti',
					name: '个体户'
				}, {
					key: 'qiye',
					name: '企业'
				}],
				uid: null,
				merchant_status: 'none',
				status_show: false,
				disable: false,
				button_text: '申请开户'
			}
		},
		computed: {
			isSelf() {
				if (this.apply_uid) {
					return false
				} else {
					return true
				}
			},
			apply_status() {
				return this.apply_info.sxf_status || ''
			},
			isXiaowei() {
				return this.apply_info.sxf_status === 'xiaowei'
			},
			...mapGetters([
				'apply_shop_tab',
				'apply_info',
				'user_info',
				'address_select_algin',
				'apply_info_address',
				'merchant_status_show',
				'apply_uid',
				'user_token'
			])
		},
		created() {
			if (!this.user_token) {
				this.noPastTo('/login')
			}
			if (!this.address_select_algin) {
				this.set_address_select_algin(false)
			}
			if (JSON.stringify(this.apply_info) == '{}') {
				this.getMerchantInfoHandler()
			} else {
				this.setMerchantStatus()
			}
			// 选择的地址
			if (this.apply_info_address) {
				// this.setAddressCode()
				let data = this.apply_info
				// data.address = this.apply_info_address.address
				this.set_apply_info(data)
				this.set_address_select_algin(false)
			}

			this.changeTabHandler(1)

		},
		methods: {
			getMerchantInfoHandler() {
				request.get_merchant_show(this.apply_uid).then(res => {
					if (res.code === this.SUCCESS_CODE) {
						let data = res.data
						if (data.merchant) {
							this.set_apply_info(data.merchant)
							this.setMerchantStatus()
							let merchant = data.merchant
							let address = {
								province: merchant.province_name,
								city: merchant.city_name,
								district: merchant.county_name
							}
							this.addressShow =
								`${merchant.province_name}${merchant.city_name}${merchant.county_name}`
							this.set_apply_info_Address(address)
							// 银行对象
							let bank_address = this.apply_info.bank_province ? this.apply_info.bank_province + this
								.apply_info.bank_city : ''
							let bank_name = this.apply_info.bank_bank ? this.apply_info.bank_bank : ''
							let bank_union_name = this.apply_info.bank_union ? this.apply_info.bank_union : ''
							let bank_city_code = this.apply_info.bank_city_code ? this.apply_info.bank_city_code :
								''
							let bank_code = this.apply_info.bank_bank_code ? this.apply_info.bank_bank_code : ''
							this.set_bank_obj({
								bank_address,
								bank_name,
								bank_union_name,
								bank_code,
								bank_city_code
							})
						} else {
							let info = {
								uid: this.apply_uid,
								license_type: 'xiaowei',
								account_type: 1,
								license_merge: 1
							}
							this.set_apply_info(info)
						}
						let picture = data.picture
						if (!picture) {
							picture = {
								legal_identity_pica: '',
								legal_identity_picb: '',
								img_idcard_holding: '',
								bank_card_pica: '',
								auth_card_pica: '',
								bank_card_picb: '',
								license_pic: '',
								tax_pic: '',
								org_pic: '',
								store_pic: '',
								store_inside_pic: ''
							}
						}
						// const rateObj = {
						//   wechat: (data.pay_rate && data.pay_rate.wechat) ? data.pay_rate.wechat : 0,
						//   alipay: (data.pay_rate && data.pay_rate.alipay) ? data.pay_rate.alipay : 0,
						//   unionpay: (data.pay_rate && data.pay_rate.unionpay) ? data.pay_rate.unionpay : 0
						// }
						this.set_pay_rate(data.pay_rate)
						this.set_picture(picture)
						this.set_rate_region(data.rate_region)
					} else {
						this.$toast.fail(res.msg)
						let info = {
							uid: this.apply_uid,
							license_type: 'xiaowei',
							account_type: 1,
							license_merge: 1
						}
						this.set_apply_info(info)
					}
				})
			},
			setMerchantStatus() {
				let info = this.apply_info
				if (info.sxf_status) {
					this.merchant_status = info.sxf_status
					let status = info.sxf_status
					if (status === 'success' || status === 'wait' || status === 'auditing') {
						this.disable = true
						if (status === 'wait') {
							this.button_text = '待审核'
							this.disable = false
						} else if (status === 'success') {
							this.button_text = '申请成功'
						} else if (status === 'auditing') {
							this.button_text = '审核中'
						}
					} else {
						this.disable = false
						if (this.apply_shop_tab == 3) {
							this.button_text = '申请开户'
						}
					}
					if (status === 'imperfect' && this.user_info.level != 'merchant') {
						this.disable = false
						this.button_text = '提交资料'
					}
					if (status === 'imperfect' && this.user_info.level === 'merchant') {
						this.disable = true
						this.button_text = '待审核'
					}

					if (this.merchant_status_show) {
						return false
					}
					if (status === 'reject' || status === 'back') {
						this.status_show = true
					} else {
						this.status_show = false
					}
				}
			},
			statusCloseHandler() {
				this.set_merchant_status_show(true)
			},
			applyNext() {
				if (this.apply_shop_tab == 1) {
					this.changeTabHandler(2)
				} else if (this.apply_shop_tab == 2) {
					this.changeTabHandler(3)
				}
			},
			applyLast() {
				if (this.apply_shop_tab == 2) {
					this.changeTabHandler(1)
				} else if (this.apply_shop_tab == 3) {
					this.changeTabHandler(2)
				}
			},
			applySubmit() {
				if (this.disable) {
					if (this.merchant_status === 'success') {
						this.$dialog.alert({
							message: '您已是商家'
						})
					}
					if (this.merchant_status === 'wait' || this.merchant_status === 'auditing') {
						this.$dialog.alert({
							message: '请耐心等待审核'
						})
					}
					if (this.merchant_status === 'imperfect' && !this.uid) {
						this.$dialog.alert({
							message: '请耐心等待完善'
						})
					}
					return false
				}
				let data = this.apply_info
				if (this.uid) {
					data.uid = this.uid
				}
				if (data.license_type === 'xiaowei') {
					// 小微商户
					data.account_person = data.legal_person
					data.account_identity_no = data.legal_identity_no
				} else {
					if (data.account_type === 1) {
						// 对私
						data.account_person = data.legal_person
						data.account_identity_no = data.legal_identity_no
					} else if (data.account_type === 2) {
						// 对公
						data.account_person = data.license_name
					}
				}
				console.log('提交')
				console.log(data)
				request.post_merchant_store(data).then(res => {
					if (res.code === this.SUCCESS_CODE) {
						this.$dialog.alert({
							message: res.msg
						}).then(() => {
							// this.set_picture({})
							// this.set_rate_region(null)
							data.sxf_status = "wait"
							this.set_apply_info(data)
							// this.set_pay_rate(null)
							this.set_apply_shop_tab(1)
							this.goBack()
						})
					} else {
						this.$dialog.alert({
							message: res.msg
						})
					}
				})

			},
			// 获取地址id
			setAddressCode() {
				// 省
				let p_obj = Area.province_list
				// 市
				let c_obj = Area.city_list
				// 区
				let a_obj = Area.county_list

				let p = this.apply_info_address.province ? this.apply_info_address.province : ''
				let c = this.apply_info_address.city ? this.apply_info_address.city : ''
				let a = this.apply_info_address.district ? this.apply_info_address.district : ''
				this.addressShow = p + c + a

				if (c === a) {
					if (p === '新疆维吾尔自治区') {
						p = p.substr(0, 2)
					}
					c = p + '县级行政区划'
				}

				for (let key in p_obj) {
					if (p_obj.hasOwnProperty(key)) {
						const item = p_obj[key]
						if (item === p) {
							let data = this.apply_info
							data.province_id = AreaId[key]
							this.set_apply_info(data)
						}
					}
				}
				for (let key in c_obj) {
					if (c_obj.hasOwnProperty(key)) {
						const item = c_obj[key]
						if (item === c) {
							let data = this.apply_info
							data.city_id = AreaId[key]
							this.set_apply_info(data)
						}
					}
				}
				for (let key in a_obj) {
					if (a_obj.hasOwnProperty(key)) {
						const item = a_obj[key]
						if (item === a) {
							let data = this.apply_info
							data.county_id = AreaId[key]
							this.set_apply_info(data)
						}
					}
				}
			},
			changeLicenseType() {
				this.showBusinessType = true
			},
			closeLicenseType() {
				this.showBusinessType = false
			},
			onSelectHandler(item) {
				let data = this.apply_info
				let key = item.key
				data.license_type = key
				if (key === 'xiaowei') {
					data.account_type = 1
				}
				this.set_apply_info(data)
				this.closeLicenseType()
			},
			changeTabHandler(index) {
				this.set_apply_shop_tab(index)
			},
			...mapMutations({
				set_apply_shop_tab: 'SET_APPLY_SHOP_TAB',
				set_address_obj: 'SET_ADDRESS_OBJ',
				set_address_select_algin: 'SET_ADDRESS_SELECT_ALGIN',
				set_apply_info: 'SET_APPLY_INFO',
				set_pay_rate: 'SET_PAY_RATE',
				set_picture: 'SET_PICTURE',
				set_rate_region: 'SET_RATE_REGION',
				set_merchant_status_show: 'SET_MERCHANT_STATUS_SHOW',
				set_apply_uid: 'SET_APPLY_UID',
				set_apply_info_Address: 'SET_APPLY_INFO_ADDRESS',
				set_bank_obj: 'SET_BANK_OBJ'
			})
		}
	}
</script>
<style>
	.van-field__control {
		background: #cccccc4f;
		padding: 0px 3px;
	}

	.van-cell {
		padding: 0.26667rem 0rem
	}

	.applyShop_button {
		text-align: center;
	}
</style>
