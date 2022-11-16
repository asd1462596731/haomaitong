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
				<img src="@/assets/img/merchant/merchant_banner0.png" alt="">
			</div>
			<div class="number" v-show="!isBindW">
				<span>设备编号</span>
				<i></i>
				<van-field v-model="horn_number" style="padding-right: .7rem;" placeholder="请输入设备编号" />
				<img @click.stop="openFNScanner" src="@/assets/img/merchant/merchant_icon11.png" alt="" v-if="level !='cashier'">
			</div>
			<div class="detail" v-show="isBindW">
				<div class="number">
					<span>设备编号</span>
					<i></i>
					<van-field :readonly="readonly" :value="detail.horn_serial" />
				</div>
			</div>
			<!-- 解绑 -->
			<div class="button" v-if="isBindW && level !='cashier'">
				<a href="javascript:;" class="dsable" @click="unBindHron">解 绑</a>
			</div>
			<!-- 绑定 -->
			<div class="button" style="margin-top: 1.453333rem;" v-if="!isBindW && level !='cashier'">
				<a href="javascript:;" @click="bindHron()" :class="[horn_number == '' ? 'dsable' : '']">绑 定</a>
			</div>
		</div>
		<!-- 蓝款 -->
		<div class="content" v-show="styleVal == 'blue'">
			<div class="banner">
				<img src="@/assets/img/merchant/merchant_banner1.png" alt="">
			</div>
			<div class="number" v-if="!isBindB && level !='cashier'">
				<span>设备编号</span>
				<i></i>
				<van-field v-model="horn_number" placeholder="请输入设备编号" type="tel" />
			</div>
			<div class="detail" v-show="isBindB">
				<div class="number">
					<span>设备编号</span>
					<i></i>
					<van-field :readonly="readonly" :value="detail.horn_serial" />
				</div>
				<div class="detail_vol">
					<span>音量大小</span>
					<div class="vol_right">
						<i>{{volValText}}</i>
						<a href="javascript:;" @click="showVolSelect">调整音量</a>
					</div>
				</div>
			</div>

			<div class="button" v-if="isBindB && level !='cashier'">
				<a href="javascript:;" class="dsable" @click="unBindHron">解 绑</a>
			</div>
			<div class="volume" v-if="!isBindB && level !='cashier'">
				<span>音量大小</span>
				<i></i>
				<div class="volume_box">
					<van-field :readonly="readonly" :value="volValText" />
					<a href="javascript:;" @click="showVolSelect">调整音量</a>
				</div>
			</div>
			<!-- 绑定 -->
			<div class="button" v-if="!isBindB && level !='cashier'">
				<a href="javascript:;" @click="bindHron()" :class="[horn_number == '' ? 'dsable' : '']">绑 定</a>
			</div>
		</div>
		<div class="progress" v-show="styleVal == 'blue'">
			<p class="progress_item">绑定流程：</p>
			<p class="progress_item">1、给云喇叭上电。</p>
			<p class="progress_item">2、扫码云喇叭二维码进行联网。</p>
			<p class="progress_item">3、输入云喇叭设备编号并绑定。</p>
			<p class="progress_item">4、设置音量，测试播报成功后正常使用。</p>
		</div>
		<div class="tip" v-show="styleVal == 'blue'">
			<p class="tip_head">温馨提示：</p>
			<div class="tip_box">
				<p class="box_item">1、绑定后可能需要1~3分钟生效</p>
				<p class="box_item">2、长按配置键6秒可恢复出厂设置</p>
			</div>
		</div>
		<div class="tip tip_white" v-show="styleVal == 'white'">
			<p class="tip_head">温馨提示：</p>
			<div class="tip_box">
				<p class="box_item">1.指示灯含义（其中蓝灯为部分产品）</p>
				<p class="box_item">
					<span>
						<img src="@/assets/img/merchant/merchant_icon14.png" alt="">
						<i>联网中</i>
					</span>
					<span>
						<img src="@/assets/img/merchant/merchant_icon13.png" alt="">
						<i>GPRS网络</i>
					</span>
					<span>
						<img src="@/assets/img/merchant/merchant_icon12.png" alt="">
						<i>WIFI网络</i>
					</span>
				</p>
				<p class="box_item">2.设备支持音量大小调节；</p>
				<p class="box_item">3.长按音量减键可恢复出厂设置。</p>
			</div>
		</div>

		<van-action-sheet v-model="volumeShow" :actions="volumeActions" @select="onVolumeSelect" />
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
				volValText: '高',
				volumeActions: [{
						name: '低',
						val: 30
					},
					{
						name: '中',
						val: 50
					},
					{
						name: '高',
						val: 70
					},
					{
						name: '超高',
						val: 100
					}
				],
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
				if (this.horn_number == '') {
					return false
				}
				let _this = this
				if (this.isBindW) {
					this.$dialog.alert({
						message: '请先解绑白款GPRS的云喇叭'
					})
					this.styleVal = 'white'
					return false
				}
				if (this.isBindB) {
					this.$dialog.alert({
						message: '请先解绑蓝款WIFI的云喇叭'
					})
					this.styleVal = 'blue'
					return false
				}
				let msg = ''
				if (this.styleVal == 'white') {
					msg = '请仔细核对IMEI码是否正确？'
				} else {
					msg = '请仔细核对设备编号是否正确？'
				}
				this.$dialog.confirm({
					message: msg
				}).then(() => {
					_this.bindHronCallBack()
				}).catch(() => {
					// on cancel
				})
			},
			bindHronCallBack() {
				this.isBingIng = true
				let data = {
					id: this.deskId,
					horn_serial: this.horn_number == '' ? -1 : this.horn_number,
					horn_vol: this.volVal,
					type: this.styleVal
				}
				if (this.sub_uid) {
					data.userid = this.sub_uid
					request.post_selesman_add_horn(data).then(res => {
						this.bindHronSuccessCallBack(res)
					})
				} else {
					request.post_desk_horn(data).then(res => {
						this.bindHronSuccessCallBack(res)
					})
				}
			},
			bindHronSuccessCallBack(res) {
				this.horn_number = ''
				this.isBingIng = false
				if (res.code === this.SUCCESS_CODE) {
					this.getHornDetail()
					this.$toast.success(res.msg)
				} else {
					this.$toast.fail(res.msg)
				}
			},
			// 解绑喇叭
			unBindHron() {
				let _this = this
				this.$dialog.confirm({
					message: '解绑后无法收到推送通知，确定解绑吗？'
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
					request.post_salesman_del_horn(data).then(res => {
						this.unBindHronSuccessCallBack(res)
					})
				} else {
					let desk_id = this.deskId
					request.post_del_horn(desk_id).then(res => {
						this.unBindHronSuccessCallBack(res)
					})
				}
			},
			unBindHronSuccessCallBack(res) {
				if (res.code === this.SUCCESS_CODE) {
					this.$toast.success(res.msg)
					this.isBindW = false
					this.isBindB = false
					this.volValText = '高'
					this.horn_number = ''
					this.volVal = 70
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
					this.styleVal = data.type == '' ? 'white' : data.type
					if (this.styleVal == 'blue') {
						this.isBindB = true
						this.isBindW = false
					} else {
						this.isBindW = true
						this.isBindB = false
					}
					if (!data.horn_serial) {
						this.isBindW = false
						this.isBindB = false
					} else {
						this.horn_number = data.horn_serial
						// 30、50、70、100。
						if (data.horn_vol == 30) {
							this.volVal = 30
							this.volValText = '低'
						} else if (data.horn_vol == 50) {
							this.volVal = 50
							this.volValText = '中'
						} else if (data.horn_vol == 70) {
							this.volVal = 70
							this.volValText = '高'
						} else if (data.horn_vol == 100) {
							this.volVal = 100
							this.volValText = '超高'
						}
					}
				} else {
					this.$toast.fail(res.msg)
				}
			}
		}
	}
</script>
<style lang="">
#cloudSpeaker .number input{
	padding: 15px 0px !important;
	font-size: 0.526667rem !important;
}
.van-field__control{
	background-color: #00000017 !important
}
</style>
