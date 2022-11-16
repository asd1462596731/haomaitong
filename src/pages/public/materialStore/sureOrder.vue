<template>
	<div id="sureOrder" class="page_container" :style="`padding-top: ${head_rem}rem;`">
		<NavBar :meta="meta" />
		<!-- section -->
		<div class="section border_none">
			<div class="section_title">收货方式</div>
			<div class="section_content" v-show="mailing_index !== 2">
				<div class="content_item" :class="{'active': mailing_index === 1}" @click="changeMailingIndex(1)">
					公司自提
				</div>
				<div class="content_item" :class="{'active': mailing_index === 3}" @click="changeMailingIndex(3)">
					业务发放
				</div>
				<div class="content_item" :class="{'active': mailing_index === 2}" @click="changeMailingIndex(2)">
					&#x3000;邮寄&#x3000;
				</div>
			</div>
			<!-- address -->
			<div class="section_address" v-show="mailing_index === 2" @click="jumpTo('/storeAddress')">
				<div class="address_title">
					<span>{{material_address.person}}</span><i>{{material_address.mobile}}</i>
				</div>
				<div class="address_desc">
					<i v-show="material_address.address === ''">请选择地址</i>
					<span v-show="material_address.address !== ''">{{material_address.address}}</span>
				</div>
				<img src="@/assets/img/public/public_icon2.png" alt="">
			</div>
		</div>

		<!-- list -->
		<div class="goods">
			<div class="goods_item" v-for="(item, index) in select_goods" :key="item.id">
				<div class="item_img">
					<img :src="item.pic_url" alt="">
				</div>
				<div class="item_desc">
					<p class="desc_name">{{item.name}}</p>
					<p class="desc_money">
						<span class="money_new">￥{{item.price}}</span>
						<span class="money_old">￥{{item.original_price}}</span>
					</p>
				</div>
				<div class="item_btn">
					<!-- <a href="javascript:;" class="btn_add" :class="{'ios': systemType === 'ios'}">+</a> -->
					<div class="btn_zoom">
						<a href="javascript:;" class="zoom_btn" :class="{'ios': systemType === 'ios'}"
							@click="seeNumber(index)">-</a>
						<div class="input_box">
							<van-field v-model="item.number" class="zoom_input" @blur="changeNumber(index)" />
						</div>
						<a href="javascript:;" class="zoom_btn" :class="{'ios': systemType === 'ios'}"
							@click="addNumber(index)">+</a>
					</div>
				</div>
			</div>
		</div>

		<!-- detail -->
		<div class="detail">
			<div class="detail_item">
				<span>商品金额</span><i>￥{{totalMoney}}</i>
			</div>
			<div class="detail_item">
				<span>运费</span><i>￥{{yMoney}}</i>
			</div>
		</div>
		<div class="bottom_money" v-show="goodsBalance > 0">
			物料基金余额：{{goodsBalance}}元
		</div>
		<!-- bottom -->
		<div class="bottom">
			<div class="bottom_left">
				<span>总计：</span>
				<i :class="{'small': parseInt(total) > 9999}">￥{{total}}</i>
				<b :class="[systemType === 'ios' ? 'ios' : '', parseInt(total) > 9999 ? 'small' : '']"
					v-show="mailing_index === 2">(含运费{{yMoney}}元)</b>
			</div>
			<div class="bottom_right">
				<a href="javascript:;" :class="{'disable': !isCanSubmit}" @click="submit">
					支付订单
				</a>
			</div>
		</div>
	</div>
</template>
<script>
	import NavBar from '@/components/navBar'
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import * as request from '@/api'
	import Wx from "weixin-jsapi"
	export default {
		components: {
			NavBar
		},
		data() {
			return {
				meta: this.$route.meta,
				addressDetail: '',
				shopPhone: '',
				shopContact: '',
				totalMoney: 0.00,
				total: 0,
				yMoney: 0.00,
				isCanSubmit: false,
				goodsBalance: 0
			}
		},
		computed: {
			...mapGetters([
				'material_address',
				'mailing_index',
				'select_goods',
				'goods_list',
				'freight',
				'is_web_type',
				'user_info'
			])
		},
		created() {
		
			if (this.mailing_index === 2) {
				this.yMoney = parseFloat(this.freight)
			} else {
				this.yMoney = 0.00
			}
			if (this.mailing_index !== 0) {
				this.isCanSubmit = true
				if (this.mailing_index === 2 && this.material_address.address === '') {
					this.isCanSubmit = false
				}
			} else {
				this.isCanSubmit = false
			}
			this.yMoney = this.yMoney.toFixed(2)
			this.jsTotal()
		},

		methods: {
			submit() {
				if (this.mailing_index === 0) {
					this.$toast.fail('请选择收货方式')
					return false
				}
				if (this.mailing_index === 2 && this.material_address.address === '') {
					this.$toast.fail('请选择地址')
					return false
				}
				let shipping_type = ''
				if (this.mailing_index === 1) {
					shipping_type = 'self'
				}
				if (this.mailing_index === 2) {
					shipping_type = 'mail'
				}
				if (this.mailing_index === 3) {
					shipping_type = 'grant'
				}
				let data = {
					goods: [],
					shipping_type: shipping_type,
					shipping_name: this.material_address.person,
					shipping_mobile: this.material_address.mobile,
					shipping_address: this.material_address.address,
					is_web_type: this.is_web_type
				}
				let arr = this.select_goods
				arr.forEach((item, index) => {
					let obj = {
						goods_id: item.id,
						number: item.number
					}
					data.goods.push(obj)
				})
				// this.$dialog.alert({
				//   message: '测试环境不能支付'
				// })
				request.post_create_order(data).then(res => {
					if (res.code === this.SUCCESS_CODE) {
						if (this.is_web_type == "H5") {
							//h5
							this.wx_beginPay(res.data)

						} else {
							// app
							this.beginPay(res.data)
						}

					} else {
						this.$toast.fail(res.msg)
						return false
					}
				})
			},

			// 开始支付
			beginPay(res) {
				this.wxPay = this.$app.require('wxPay')
				let _this = this
				this.wxPay.payOrder({
					apiKey: res.appid,
					orderId: res.prepayid,
					mchId: res.partnerid,
					nonceStr: res.noncestr,
					timeStamp: res.timestamp,
					sign: res.sign
				}, function(ret, err) {
					if (ret.status) {
						_this.$toast.success('支付成功')
						_this.set_select_goods([])
						_this.set_goods_list([])
						// 支付成功
						setTimeout(() => {
							_this.noPastTo('/myOrder')
						}, 1000)
					} else {
						if (err.code == -2) {
							_this.$toast.fail('支付取消')
						}
						if (err.code == -1) {
							_this.$toast.fail('支付失败，请稍后重试')
						}
						if (err.code == 1) {
							_this.$toast.fail('apiKey值非法')
						}
					}
				})
			},

			//h5支付
			//微信提交方法  pay后台返回支付所需数据
			wx_beginPay(res) {
				let _this = this
				var ua = navigator.userAgent.toLowerCase(); //判断是否是微信浏览器
				var isWeixin = ua.indexOf('micromessenger') != -1; //判断是否
				if (!isWeixin) {
					_this.$toast.fail('请在微信浏览器中打开')
					return false;
				}
				Wx.config({
					debug: false, //这里一般在测试阶段先用ture，等打包给后台的时候就改回false,
					appId: res.appId,
					timestamp: res.timeStamp,
					nonceStr: res.nonceStr,
					signature: res.sign,
					jsApiList: ["chooseWXPay"]
				});
				Wx.ready(() => {
					this.flag = true;
					Wx.chooseWXPay({
						timestamp: res
							.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
						nonceStr: res.nonceStr, // 支付签名随机串，不长于 32 位
						package: res.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
						signType: res.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
						paySign: res.paySign, // 支付签名
						success: function(res) {
							_this.$toast.success('支付成功')
							_this.set_select_goods([])
							_this.set_goods_list([])
							// 支付成功
							setTimeout(() => {
								_this.noPastTo('/myOrder')
							}, 1000)
						},
						cancel: function(res) {
							_this.$toast.fail('支付取消')
						}
					});
				});
			},

			// 减number
			seeNumber(index) {
				let arr = this.select_goods
				if (arr[index].number == 1) {
					this.$dialog.alert({
						message: '最低选购一件'
					})
					this.set_select_goods(arr)
					return false
				}
				arr[index].number = parseInt(arr[index].number) - 1
				this.set_select_goods(arr)
				this.setGoodsList(index)

				this.jsTotal()
			},
			// 加number
			addNumber(index) {
				let arr = this.select_goods
				arr[index].number = parseInt(arr[index].number) + 1
				this.set_select_goods(arr)
				this.setGoodsList(index)
				this.jsTotal()
			},
			changeNumber(index) {
				let arr = this.select_goods
				if (arr[index].number == '' || arr[index].number == 0) {
					arr[index].number = 1
					this.$dialog.alert({
						message: '最低选购一件'
					})
				}
				if (parseInt(arr[index].number) > 1000 || parseInt(arr[index].number) == 1000) {
					arr[index].number = 999
				}
				this.set_select_goods(arr)
				this.setGoodsList(index)

				this.jsTotal()
			},
			setGoodsList(i) {
				let arr = this.select_goods
				let list = this.goods_list
				list.forEach((item, index) => {
					if (item.id == arr[i].id) {
						list[index].number = arr[i].number
						this.set_goods_list(list)
					}
				})
			},
			// 计算总数
			jsTotal() {
				let arr = this.select_goods
				this.totalMoney = 0
				this.total = 0
				this.yMoney = 0 
				// 加上运费
				this.total = (parseFloat(this.totalMoney)).toFixed(2)
				let list = []
				arr.forEach((item, index) => {
					let itemNewTotal = parseFloat(item.price) * parseInt(item.number)
					this.totalMoney = (parseFloat(this.totalMoney) + parseFloat(itemNewTotal)).toFixed(2)
					if(this.mailing_index !== 2){
						  //不是邮寄
						this.yMoney = 0
						this.total = (parseFloat(this.total) + parseFloat(itemNewTotal)).toFixed(2)
					}else{
						this.yMoney = (parseFloat(this.yMoney) + parseFloat(item.freight))
						this.total = (parseFloat(this.total) + parseFloat(itemNewTotal) + parseFloat(item.freight)).toFixed(2)
					}
					
				})
			},
			changeMailingIndex(index) {
				this.set_mailing_index(index)
				if (this.mailing_index === 2) {
					this.yMoney = parseFloat(this.freight)
				} else {
					this.yMoney = 0.00
				}
				this.jsTotal()
			},
			...mapMutations({
				set_select_goods: 'SET_SELECT_GOODS',
				set_goods_list: 'SET_GOODS_LIST',
				set_mailing_index: 'SET_MAILING_INDEX'
			})
		}
	}
</script>
