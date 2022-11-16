<template>
	<div id="receipt_result" class="page_container" :style="`padding-top: ${head_rem}rem;`">
		<NavBar :meta="meta" />
		<div class="result_content">
			<div class="content_box" v-if="result">
				<img src="@/assets/img/merchant/merchant_icon6.png" alt="">
				<span>收款成功</span>
			</div>
			<div class="content_box error" v-if="!result">
				<img src="@/assets/img/merchant/merchant_icon7.png" alt="">
				<span>收款失败</span>
			</div>
			<div class="content_money">
				￥<span>{{order_data.money}}</span>
			</div>
			<div class="content_list">
				<div class="list_item" v-if="result">
					<span>收款方式</span>
					<i v-show="order_data.pay_type === 'wechat'">微信</i>
					<i v-show="order_data.pay_type === 'alipay'">支付宝</i>
				</div>
				<div class="list_item">
					<span>收款时间</span>
					<i>{{order_data.update_time}}</i>
				</div>
			</div>

			<div class="content_button">
				<a href="javascript:;" class="sure_button" @click="goBack">继续收款</a>
			</div>
		</div>
	</div>
</template>
<script>
	import NavBar from '@/components/navBar'
	import Speech from 'speak-tts'
	export default {
		components: {
			NavBar
		},
		data() {
			return {
				meta: this.$route.meta,
				result: true,
				order_data: {},
				speech: null
			}
		},
		mounted() {
			this.speechInit();
		},
		created() {
			let params = this.$route.params
			this.result = params.result
			this.order_data = params.order ? params.order : {}
		},
		methods: {
			speechInit() {
				this.speech = new Speech();
				this.speech.setLanguage('zh-CN');
				this.speech.init().then(() => {
					console.log('语音播报初始化完成...')
				})
			},

			//语音播报
			speak() {
				this.speech.speak({
					text: "成功收款"
				}).then(() => {
					console.log("播报完成...")
				})
			}
		}
	}
</script>
