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
				<div style="margin-top:.3rem;margin-bottom:.9rem" v-if="(invite_code != null) && (invite_code.length != 0)">
					<div style="margin-bottom:.3rem">
						<van-icon name="manager-o" size=".48rem" />
						<span style="padding-left:.2rem">身份选择</span>
					</div>
						<van-field
                            v-model="levelstr"
                            is-link
                            readonly
                            placeholder="请选择身份"
                            @click="show = true"
                        />
                           <van-popup v-model="show" round position="bottom">
                           	<van-picker
                             title="身份"
                             show-toolbar
                             :columns="columns"
                             @confirm="onConfirm"
                             @cancel="onCancel"
                             @change="onChange"
                           />
                           </van-popup>
					</div>
				<div class="form_item">
					<div class="form_title">
						<img src="@/assets/img/auth/auth_icon3.png" alt="">
						<span>密码</span>
					</div>
					<div class="form_input">
						<van-field v-model="password" type="password" placeholder="请设置密码"/>
					</div>
				</div>

				<div class="form_item">
					<div class="form_title">
						<img src="@/assets/img/auth/auth_icon3.png" alt="">
						<span>确认密码</span>
					</div>
					<div class="form_input">
						<van-field v-model="password_check" type="password" placeholder="请重新输入密码" />
					</div>
				</div>
			</div>
			<div class="auth_button">
				<a href="javascript:;" class="sure_button" :class="{'disable': !isCanSubmit}" @click="registerHandler">注册</a>
			</div>
			<div class="auth_link" @click="jumpTo('/login')">
				已有{{site_config.sitename}}账号，
				<a href="javascript:;">直接登录</a>
			</div>
		</div>
		<div class="auth_bottom" v-html="site_config.copyright">
		</div>
	</div>
</template>

<script>
import { Toast } from 'vant';
	import {
		app_name,
		company_name
	} from '@/config'
	import {
		CountdownFunction
	} from '@/util'

	import {
		getUrlParam
	} from '@/util/GetUrlParam';
	import {
		mapGetters
	} from 'vuex'
import * as request from '@/api'
	export default {
		data() {
			return {
				app_name: app_name,
				company_name: company_name,
				mobile: '',
				code: '',
				password: '',
				password_check: '',
				invite_code: '',
				show: false,
				levelstr:'商家',
				level:'merchant',
                cascaderValue: '',
				columns: [
					'商家',
					'D0代理'
	  ],
			}
		},
		computed: {
			isCanSubmit() {
				return this.mobile !== '' && this.code !== '' && this.password !== '' && this.mobile.length === 11
			},
			...mapGetters(['count', 'is_code', 'site_config', 'user_info'])
		},
		created() {
			let invite_code = getUrlParam("invite_code"); //读取携带分享用户的参数 
			this.invite_code = invite_code;
		},
	methods: {
		onConfirm(value, index) {
			this.levelstr = value
			this.show = false
			console.log();
		},
		onChange(picker, value, index) {
			if (value === '商家') {
				this.level = 'merchant'
			} else {
				this.level = 'merchant_d0'
			}
		},
		onCancel() {
			this.show = false
		},
			getCodeHandler() {
				if (this.mobile.length !== 11) {
					this.$toast.fail('手机号不正确')
					return false
				}
				request.post_sms_send(this.mobile, 'register').then(res => {
					if (res.code === this.SUCCESS_CODE) {
						this.$toast.success('验证码已发送')
						CountdownFunction()
					} else {
						this.$toast.fail(res.msg)
					}
				})
			},
			registerHandler() {
				if (!this.isCanSubmit) {
					return false
				}
				let mobile = this.mobile
				let level = this.level
				let password = this.password
				let captcha = this.code
				let invite_code = this.invite_code;
				// let code = this.$md5(this.randomString(24));
				let code = this.is_code
				// console.log(this.password)
				// console.log(this.password_click)
				var pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/
				if(!pattern.test(this.password)){
					this.$toast.fail('密码由6至12位字母或数字组成')
					return false
				}
				
				if(this.password !== this.password_check){
					this.$toast.fail('两次输入的密码不相同')
					return false
				}
				
				//判断是否是存在邀请码
				if ((invite_code != null) && (invite_code.length != 0)) {
					let data = {
						mobile,
						password,
						captcha,
						invite_code,
						level,
						code
					}
					request.post_user_shareReg(data).then(res => {
						if (res.code === this.SUCCESS_CODE) {
							this.$toast.success('注册成功')
							setTimeout(() => {
								this.jumpTo('/login')
							}, 1000)
						} else {
							this.$toast.fail(res.msg)
						}
					})

				} else {

					let data = {
						mobile,
						password,
						captcha,
						code,
						level
					}
					request.post_user_register(data).then(res => {
						if (res.code === this.SUCCESS_CODE) {
							this.$toast.success('注册成功')
							setTimeout(() => {
								this.jumpTo('/login')
							}, 1000)
						} else {
							this.$toast.fail(res.msg)
						}
					})

				}

			},
			randomString(len) {
				len = len || 32
				const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678' /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
				const maxPos = $chars.length
				let pwd = ''
				for (let i = 0; i < len; i++) {
					pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
				}
				return pwd
			}
		}
	}
</script>
