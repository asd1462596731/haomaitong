<template>
	<div id="cloudSpeaker" class="page_container" :style="`padding-top: ${head_rem}rem;`">
		<NavBar :meta="meta" />
		<!-- <div class="tabs">
      <div class="tabs_item" :class="{'active': styleVal == 'white'}" @click="changeStyleVal('white')">
        白款(GPRS）
        <span></span>
      </div>
      <div class="tabs_item" :class="{'active': styleVal == 'blue'}" @click="changeStyleVal('blue')">
        蓝款(WIFI）
        <span></span>
      </div>
    </div> -->
		<div style="height:10px"></div>
		<!-- 白款 -->
		<div class="content" v-show="styleVal == 'white'">
			<div class="banner">
				<img src="@/assets/img/merchant/merchant_bannerP.png" alt="">
			</div>
			<div class="number" v-show="!isBindW">
				<span>设备sn</span>
				<i></i>
				<van-field v-model="horn_number" style="padding-right: .7rem;" placeholder="请输入设备sn" />
				<img @click.stop="openFNScanner" src="@/assets/img/merchant/merchant_icon11.png" alt="" v-if="level != 'cashier'">
			</div>
			<div class="detail" v-show="isBindW">
				<div class="number">
					<span>设备sn</span>
					<i></i>
					<van-field :readonly="readonly" :value="horn_number" />
				</div>
			</div>
			<!-- 解绑 -->
			<div class="button" v-if="isBindW && level !='cashier'">
				<a href="javascript:;" class="dsable" @click="unBindHron">解 绑</a>
			</div>
			<!-- 绑定 -->
			<div class="button" style="margin-top: 1.453333rem;" v-if="!isBindW && (level != 'cashier')">
				<a href="javascript:;" @click="bindHron()" :class="[horn_number == '' ? 'dsable' : '']">绑 定</a>
			</div>
		</div>
	</div>
</template>
<script>
	import NavBar from '@/components/navBar'
	import * as request from '@/api'
	import wx from "weixin-jsapi"
	import {
		getPermissionFunc
	} from '@/util'
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		components: {
			NavBar
		},
		computed: {
			...mapGetters(['sub_uid','user_info']),
			level(){
				return this.user_info.level
			}
		},
		data() {
			return {
				volumeShow: false,
				meta: this.$route.meta,
				readonly: true,
				volVal: 70,
				isBindW: false,
				isBindB: false,
				deskId: null,
				detail: {},
				horn_number: '',
				isBingIng: false,
				styleVal: 'white'
			}
		},
		created() {
			this.$nextTick(() => {
				this.deskId = this.$route.params.desk_id
                if(!this.deskId){
					this.jumpTo('/desk')
					return false
				}
				this.getHornDetail()
			})
		},
		methods: {
			// 打开选择声音
			showVolSelect() {
				this.volumeShow = true
			},
			onVolumeSelect(item) {
				this.volVal = item.val
				this.volValText = item.name
				this.volumeShow = false
				if (this.isBindB) {
					this.bindHronCallBack()
				}
			},
			// 打开扫码
			openFNScanner() {
	
				// 先获取是否有相机权限
				getPermissionFunc(this, 'camera', '相机').then(() => {
					this.openFNScannerCallBack()
				})

			},
			openFNScannerCallBack() {
				this.$FNScanner.open({
					autorotation: true,
					hintText: '请扫描包装盒或设备底座内IMEI条形码',
					isAlbum: true
				}, (ret, err) => {
					if (ret) {
						let _this = this
						
						if (ret.eventType === 'cameraError') {
							_this.$toast.fail('访问摄像头失败')
						}
						if (ret.eventType === 'albumError') {
							_this.$toast.fail('访问相册失败')
						}
						if (ret.eventType === 'success') {
							_this.callBackFNScanner(ret)
						}
					} else {
						// console.log(JSON.stringify(err))
					}
				})
			},

			// 扫码回调
			callBackFNScanner(ret) {
				if (ret.content) {
					this.horn_number = ret.content
				} else {
					this.$toast.fail('获取扫码结果失败')
				}
			},
			// 切换蓝款白款
			changeStyleVal(val) {
				this.styleVal = val
			},
			// 绑定喇叭
			bindHron() {
				if (this.isBingIng) {
					return false
				}
				if (this.horn_number == '' || this.horn_number == null) {
					
					this.$toast.fail('请填写设备sn');
					return false
				}
				
				var msg = '请仔细核对设备sn是否正确？';
				this.$dialog.confirm({
					message: msg
				}).then(() => {
					this.bindHronCallBack()
				}).catch(() => {
					// on cancel
				})
			},
			bindHronCallBack() {
				this.isBingIng = true
				let data = {
					id: this.deskId,
					bsj_sn:this.horn_number,
				}
				if (this.sub_uid) {
					data.userid = this.sub_uid
					request.post_selesman_add_pos(data).then(res => {
						this.bindHronSuccessCallBack(res)
					})
				} else {
					request.post_desk_pos(data).then(res => {
						this.bindHronSuccessCallBack(res)
					})
				}
			},
			bindHronSuccessCallBack(res) {
				this.horn_number = ''
				this.isBingIng = false
				if (res.code === this.SUCCESS_CODE) {
					this.getHornDetail()
					this.isBindW = true
					this.$toast.success(res.msg)
				} else {
					this.$toast.fail(res.msg)
				}
			},
			// 解绑喇叭
			unBindHron() {
				let _this = this
				this.$dialog.confirm({
					message: '解绑设备无法使用，确定解绑吗？'
				}).then(() => {
					_this.unBindHronCallBack()
				}).catch(() => {
					// on cancel
				})
			},
			// 解绑回调
			unBindHronCallBack() {
				if (this.sub_uid) {
					let data = {
						id: this.deskId,
						userid: this.sub_uid
					}
					request.post_salesman_del_pos(data).then(res => {
						this.unBindHronSuccessCallBack(res)
					})
				} else {
					let desk_id = this.deskId
					request.post_del_pos(desk_id).then(res => {
						this.unBindHronSuccessCallBack(res)
					})
				}
			},
			unBindHronSuccessCallBack(res) {
				if (res.code === this.SUCCESS_CODE) {
					this.$toast.success(res.msg)
					this.horn_number = ''
					this.isBindW = false
				} else {
					this.$toast.fail(res.msg)
				}
			},
			// 获取详情
			getHornDetail() {
				if (this.sub_uid) {
					let data = {
						userid: this.sub_uid,
						id: this.deskId
					}
					request.post_salesman_show_desk(data).then(res => {
						this.getDetailCallBack(res)
					})
				} else {
					request.get_desk_show(this.deskId).then(res => {
						this.getDetailCallBack(res)
					})
				}
			},
			getDetailCallBack(res) {
				if (res.code == this.SUCCESS_CODE) {
					let data = res.data
					this.detail = data
					this.horn_number = data.bsj_sn
					data.bsj_sn ? this.isBindW = true : this.isBindW = false
				} else {
					this.$toast.fail(res.msg)
				}
			}
		}
	}
</script>
<style lang="">

</style>
