<template>
	<div id="apply_basic">
		<div style="margin-top: 0.6rem;color: crimson;">提示：带*为必填项</div>
		<div class="input_box">
			<div class="box_top">
				<span><i style="color: red;">*</i>商户简称</span>
				<van-field v-model="formData.merchant_alias" @input="inputChangeHandler" />
			</div>
			<div class="box_bottom">在顾客消费付款码中展示</div>
		</div>
		<div class="input_box">
			<div class="box_top">
				<span><i style="color: red;">*</i>{{isXiaowei ? '商户姓名' : '法人姓名'}}</span>
				<van-field v-model="formData.legal_person" @input="inputChangeHandler" />
			</div>
			<div class="box_bottom">{{isXiaowei ? '商户负责人姓名' : '法人或者负责人姓名'}}</div>
		</div>
		<div class="input_box">
			<div class="box_top">
				<span><i style="color: red;">*</i>商户电话</span>
				<van-field v-model="formData.merchant_mobile" type="tel" @input="inputChangeHandler"
					@blur="onMobileInputBlur" />
			</div>
			<div class="box_bottom">商户负责人电话</div>
		</div>
		<div class="input_box" @click="showSelectAreaHandler">
			<div class="box_top algin_right">
				<i style="color: red;">*</i>
				<van-cell title="所在地区" :value="myAddress" />
				<img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
			</div>
		</div>
		<div class="input_box">
			<div class="box_top">
				<span><i style="color: red;">*</i>详细地址</span>
				<van-field v-model="formData.address" @input="inputChangeHandler" />
			</div>
		</div>

		<div class="input_box" v-show="!isSelf" @click="jumpTo('/applyRate')">
			<div class="box_top algin_right">
				<van-cell title="结算费率" value="修改" />
				<img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
			</div>
			<div class="box_bottom">不能低于自己的费率</div>
		</div>

		<van-popup v-model="areaListShow" position="bottom">
			<van-area value="440103000000" :area-list="areaList" @confirm="areaConfirm" @cancel="areaCancel" />
		</van-popup>
	</div>
</template>
<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import areaList from '@/assets/js/area.js'
	import areaIdList from '@/assets/js/area_id.js'
	export default {
		props: {
			addressShow: {
				type: String,
				default: ''
			},
			isSelf: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				address_show: '',
				areaListShow: false,
				areaList: areaList
			}
		},
		computed: {
			myAddress() {
				return this.address_show ? this.address_show : this.addressShow
			},
			isXiaowei() {
				return this.apply_info.license_type === 'xiaowei'
			},
			formData() {
				return this.apply_info
			},
			...mapGetters([
				'apply_info'
			])
		},
		created() {},
		mounted() {},
		methods: {
			onMobileInputBlur() {
				let mobile = this.formData.merchant_mobile
				if (mobile.length !== 11) {
					this.$dialog.alert({
						message: '手机号码格式不正确'
					})
				}
			},
			showSelectAreaHandler() {
				this.areaListShow = true
			},
			// 确认选择地址
			areaConfirm(options) {
				if (options) {
					let p_code = options[0].code
					let c_code = options[1].code
					let a_code = options[2].code
					this.p_id = areaIdList[p_code]
					this.c_id = areaIdList[c_code]
					this.a_id = areaIdList[a_code]

					let data = {
						province: this.p_id,
						city: this.c_id,
						area: this.a_id
					}
					
					let str = ''
					options.forEach(item => {
						str += item.name
					})
					this.address_show = str
					let addressObj = {
						province: options[0].name,
						city: options[1].name,
						district: options[2].name,
						address: str
					}
					let data2 = {
						province_id: this.p_id,
						city_id: this.c_id,
						county_id: this.a_id,
						merchant_address: str
					}
					let info = {
						...this.apply_info,
						...data2
					}
					this.set_apply_info(info)
					console.log('data2')
					console.log(data2)
					console.log('yuans')
					console.log(info)
					console.log('选择')
					console.log(this.apply_info)
					this.set_apply_info_address(addressObj)
					
				}
				this.areaListShow = false
			},
			// 取消选择地址
			areaCancel() {
				this.areaListShow = false
			},
			changeAddressHandler() {
				this.$dialog.confirm({
					message: '确认重新选择地址？'
				}).then(() => {
					// on confirm
					this.set_address_select_algin(true)
					this.jumpTo('/selectAddress')
				}).catch(() => {
					// on cancel
				})
			},
			inputChangeHandler() {
				let data = {
					...this.apply_info,
					...this.formData
				}
				this.set_apply_info(data)
			},
			...mapMutations({
				set_address_select_algin: 'SET_ADDRESS_SELECT_ALGIN',
				set_apply_info: 'SET_APPLY_INFO',
				set_address_name: 'SET_ADDRESS_NAME',
				set_apply_info_address: 'SET_APPLY_INFO_ADDRESS'
			})
		}
	}
</script>
