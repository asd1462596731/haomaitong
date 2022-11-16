<template>
	
	<div id="teamManage" class="page_container" :style="`padding-top: ${head_rem}rem;`">
		<NavBar :meta="meta" />
		<van-notice-bar color="#ff0000" background="#ecf9ff" left-icon="info-o">
		   广告赋能会扣除账户余额，请谨慎填写下方信息后提交
		 </van-notice-bar>
		
		<div class="manage_form">
			<div class="form_item padding alginRight">
				<div class="input_box">
					<span>微&#x3000;信</span>
					<van-field :value="`${info.wechat || 0}%`" />
					<img src="@/assets/img/public/public_icon2.png" alt="">
				</div>
			</div>
			<div class="form_item padding alginRight">
				<div class="input_box">
					<span>支付宝</span>
					<van-field :value="`${info.alipay || 0}%`" />
					<img src="@/assets/img/public/public_icon2.png" alt="">
				</div>
			</div>
			<div class="form_item padding alginRight">
				<div class="input_box">
					<span>银&#x3000;联</span>
					<van-field :value="`${info.unionpay || 0}%`" />
					<img src="@/assets/img/public/public_icon2.png" alt="">
				</div>
			</div>

			<div class="manage_button">
				<a href="javascript:;" class="sure_button" @click="submit">确 定</a>
			</div>
		</div>
	</div>
</template>
<script>
	import NavBar from '@/components/navBar'
	import * as request from '@/api'
	export default {
		components: {
			NavBar
		},
		data() {
			return {
				uid: null,
				meta: this.$route.meta,
				readonly: true,
				roleSelectShow: false,
				rateSelectShow: false,
				rate_alipay: [],
				rate_unionpay: [],
				rate_wechat: [],
				set_rate_type: 'wechat',
				rate_list: [],
				info: {
					alipay: '',
					unionpay_big: '',
					unionpay_small: '',
					wechat: ''
				}
			}
		},
		created() {
			this.getMyRateFunc()
		},
		methods: {
			getMyRateFunc() {
				request.get_salesman_myrate().then(res => {
					if (res.code === this.SUCCESS_CODE) {
						this.info = res.data.default_rate // myrate
					} else {
						this.$toast.fail(res.msg)
					}
				})
			},
			submit() {
				this.goBack()
			}
		}
	}
</script>
