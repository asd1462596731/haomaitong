<template>
	<div id="wxCode" class="page_container" :style="`padding-top: ${head_rem}rem;`" style="text-align: center;">
	  <NavBar :meta="meta" />
	  <div style="width: 90%;text-align: left; padding: 0.2rem 0rem;font-size: 0.4rem;line-height: 0.6rem;margin: 0 auto;" v-if="wxcode !=='' || wxcode== null">微信实名认证：请法人扫码或长按识别进行微信实名认证</div>
	  <img :src="wxcode" style="width: 7rem" />
	  <div style="width: 90%;text-align: left; padding: 0.2rem 0rem;font-size: 0.4rem;line-height: 0.6rem;margin: 0 auto;" v-if="zfbcode !=='' || zfbcode== null">支付宝实名认证：请保存图片，然后打开支付宝扫码认证</div>
	  <img :src="zfbcode" style="width: 6.5rem" />
	</div>

	
</template>
<script>
	import {mapGetters} from 'vuex'
	import * as request from '@/api'
	import NavBar from '@/components/navBar'
	
	export default {
		components: {
		  NavBar
		},
		data() {
			return {
				userInfo:'',
				wxcode:'',
				zfbcode:'',
				meta: {}
			}
			
		},
		computed: {
			...mapGetters(['user_info'])
		},
		created() {
			this.openWexXinCode();
			this.$route.meta.title = "请“<span style='color:red'>法人</span>”分别进行微信和支付宝实名认"
			this.meta = this.$route.meta
		},
		methods: {		
	
			openWexXinCode(){
				request.get_wexin_code(this.user_info.id).then(res => {
					if(res.code === 0){
						this.wxcode = res.data.wx
						this.zfbcode = res.data.zfb
					}else{
						this.$toast.fail(res.msg);
					}
				})
			},
			

		}
	}
</script>
<style scoped>

	.wxcode{
		background-size:100% ;
	}
</style>