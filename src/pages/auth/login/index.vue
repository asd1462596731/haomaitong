<template>
	<div id="auth">
		<div class="auth_box">
			<div class="auth_title">
				<span>欢迎来到</span><i>{{site_config.sitename}}</i>
			</div>
			<div class="auth_form">
				<div class="form_item">
					<div class="form_title">
						<img src="@/assets/img/auth/auth_icon1.png" alt="">
						<span>手机号码</span>
					</div>
					<div class="form_input">
						<span>+86</span>
						<van-field clearable type="tel" v-model="mobile" />
					</div>
				</div>

				<div class="form_item">
					<div class="form_title">
						<img src="@/assets/img/auth/auth_icon3.png" alt="">
						<span>密码</span>
					</div>
					<div class="form_input">
						<van-field clearable v-model="password" type="password" placeholder="请输入密码" />
					</div>
				</div>
			</div>
			<div class="auth_button">
				<a href="javascript:;" class="sure_button" @click="userLoginHandler">登 录</a>
			</div>
			<div class="auth_link">
				还没有<b style="color: #000;">{{site_config.sitename}}</b>账号?
				<a href="javascript:;" @click="jumpTo('/register')">立即注册</a>
				<span @click="jumpTo('/verification')">验证码登录</span>
			</div>
		</div>
		<div class="auth_bottom">
			{{site_config.copyright}}
		</div>
	</div>
</template>
<script>

	import {
		app_name,
		company_name,
		axios_base_url
	} from '@/config'
	import * as request from '@/api'
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				app_name: app_name,
				company_name: company_name,
				count: 60,
				password: '',
				mobile: '',
				url: axios_base_url
			}
		},
		computed: {
			...mapGetters(['site_config', 'is_code', 'user_token']),
		},
		created() {
			if (this.user_token) {
				this.noPastTo('/')
			}
		},
		methods: {
			userLoginHandler() {
				request.post_user_login(this.mobile, this.password, this.is_code).then(res => {
					if (res.code === this.SUCCESS_CODE) {
						this.$toast.success('登录成功')
						let data = res.data
						this.set_user_token(data.token)
						this.set_user_info(data)
						if (data.openid == '' || data.openid == null) {
							var ua = navigator.userAgent.toLowerCase(); //判断是否是微信浏览器
							var isWeixin = ua.indexOf('micromessenger') != -1; //判断是否
							if (isWeixin) {
								this.auth_weach(data.id)
							} else {
								setTimeout(() => {
									this.noPastTo('/')
								}, 1000)
							}

						} else {
							setTimeout(() => {
								this.noPastTo('/')
							}, 1000)
						}
					} else {
						this.$toast.fail(res.msg)
					}
				})
			},
			auth_weach(id) {
				window.location.href = this.url + '/common/auth_weach?user_id=' + id;
			},
			...mapMutations({
				set_user_token: 'UPDATE_USER_TOKEN',
				set_user_info: 'UPDATE_USER_INFO'
			})
		}
	}
	
</script>
