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
						<van-field clearable v-model="mobile" type="tel" />
					</div>
				</div>

				<div class="form_item">
					<div class="form_title">
						<img src="@/assets/img/auth/auth_icon2.png" alt="">
						<span>验证码</span>
					</div>
					<div class="form_input">
						<van-field clearable v-model="code" placeholder="请输入验证码" />
						<div class="input_button">
							<a href="javascript:;" v-show="count === 60" @click="getCodeHandler">获取验证码</a>
							<a href="javascript:;" class="disable" v-show="count < 60">{{count}}s后重新获取</a>
						</div>
					</div>
				</div>
			</div>
			<div class="auth_button">
				<a href="javascript:;" class="sure_button" :class="{'disable': !isCanSubmit}"
					@click="userLoginHandler">登 录</a>
			</div>
			<div class="auth_link">
				还没有{{site_config.sitename}}账号?
				<a href="javascript:;" @click="jumpTo('/register')">立即注册</a>
				<span @click="jumpTo('/login')">密码登录</span>
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
		company_name
	} from '@/config'
	import {
		CountdownFunction
	} from '@/util'
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import * as request from '@/api'
	export default {
		data() {
			return {
				app_name: app_name,
				company_name: company_name,
				mobile: '',
				code: ''
			}
		},
		computed: {
			isCanSubmit() {
				return this.mobile !== '' && this.code !== '' && this.mobile.length === 11
			},
			...mapGetters(['site_config', 'is_code', 'user_token', 'count']),
		},
		created() {
			if (this.user_token) {
				this.noPastTo('/')
			}
		},
		methods: {
			userLoginHandler() {
				if (!this.isCanSubmit) {
					return false
				}
				request.post_user_mobilelogin(this.mobile, this.code, this.is_code).then(res => {
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
			getCodeHandler() {
				if (this.mobile.length !== 11) {
					this.$toast.fail('手机号不正确')
					return false
				}
				request.post_sms_send(this.mobile, 'mobilelogin').then(res => {
					if (res.code === this.SUCCESS_CODE) {
						this.$toast.success('验证码已发送')
						CountdownFunction()
					} else {
						this.$toast.fail(res.msg)
					}
				})
			},
			...mapMutations({
				set_user_token: 'UPDATE_USER_TOKEN',
				set_user_info: 'UPDATE_USER_INFO'
			})
		}
	}
</script>
