<template>
	<div id="materialStore" class="page_container" :style="`padding-top: ${head_rem}rem;`">
		<NavBar :meta="meta" />
		<div class="material_swiper" v-show="banner_list.length > 0">
			<van-swipe :autoplay="4500" indicator-color="white">
				<van-swipe-item v-for="(item, index) in banner_list" :key="index">
					<img :src="item" alt="">
				</van-swipe-item>
			</van-swipe>
		</div>
		<!-- list -->
		<div class="goods">
			<div class="goods_item" v-for="(item, index) in goods_list" :key="item.id">
				<div class="item_img">
					<img :src="item.pic_url" @click="showBigImageHandler(item.pic_url,item.name,item.desc)" alt="">
				</div>
				<div class="item_desc">
					<p class="desc_name">{{item.name}}</p>
					<p class="desc_money">
						<span class="money_new">￥{{item.price}}</span>
						<span class="money_old">￥{{item.original_price}}</span>
					</p>
				</div>
				<div class="item_btn">
					<a href="javascript:;" class="btn_add" :class="{'ios': systemType === 'ios'}"
						@click="addNumber(index)" v-show="parseInt(item.number) === 0">+</a>
					<div class="btn_zoom" v-show="item.number > 0 || item.number === ''">
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
		<!-- bottom -->
		<div class="bottom">
			<div class="bottom_left">
				<span>总计：</span>
				<i :class="{'small': parseInt(seePrice) > 999}">￥{{price}}</i>
				<s
					:class="[systemType === 'ios' ? 'ios' : '', parseInt(seePrice) > 999 ? 'small' : '']">已优惠{{seePrice}}元</s>
			</div>
			<div class="bottom_right">
				<a href="javascript:;" :class="{'disable': !isCanSubmit}" @click="wx_check()"
					v-if="this.is_web_type == 'H5'">
					去结算<span v-show="total > 0">({{total}})</span>
				</a>
				<a href="javascript:;" :class="{'disable': !isCanSubmit}" @click="go_order()"
					v-if="this.is_web_type == 'app'">
					去结算<span v-show="total > 0">({{total}})</span>
				</a>
			</div>
		</div>
		<van-dialog v-model="image_show">
			<img class="dialog_img" :src="image_src">
			<div style="padding: 10px;">
				{{shop_name}}
			</div>
			<div style="padding: 10px;" v-html="desc">
			
			</div>
			
		</van-dialog>
	</div>
</template>
<script>
	import NavBar from '@/components/navBar'
	import * as request from '@/api'
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		components: {
			NavBar
		},
		data() {
			return {
				meta: this.$route.meta,
				seePrice: 0,
				isCanSubmit: false,
				total: 0,
				price: 0,
				original_price: 0,
				image_src: '',
				shop_name: '',
				desc:'',
				image_show: false,
			}
		},
		computed: {
			...mapGetters(['goods_list', 'banner_list', 'user_token', 'user_info', 'is_web_type'])
		},
		created() {
			if (!this.user_token) {
				this.noPastTo('/login')
			}
			// if (this.goods_list.length > 0) {
			// 	this.jsTotal()
			// 	return false
			// }
			
		     this.set_goods_list([]);
			 this.set_mailing_index(1)
			this.getGoosList()
			this.get_user_data()


		},
		methods: {
			go_order() {
				
				if(!this.isCanSubmit){
					return false
				}
				if (Number(this.price) > 0) {
					this.set_mailing_index(1)
					this.jumpTo('/sureOrder')
				}

			},
			//微信验证
			wx_check() {
				if(!this.isCanSubmit){
					return false
				}
				var ua = navigator.userAgent.toLowerCase(); //判断是否是微信浏览器
				var isWeixin = ua.indexOf('micromessenger') != -1; //判断是否
				if (!isWeixin) {
					//nowx
					this.$toast.fail('请在微信浏览器中打开')
					return false;
				} else {
					if (this.user_info.openid === '') {
						//去授权
						this.getinfo_h5()
					} else {
						this.jumpTo('/sureOrder')
					}
				}

			},
			getinfo_h5() {
				//请求后端
				var url = 'materialStore';
				request.post_info_wechat(this.user_info.id, url).then(res => {
					if (res.code === this.SUCCESS_CODE) {
						// window.location.href = res.data
						this.getinfo_h52(res.data);
						//将返回地址只想获取

						// this.$toast.fail(res.msg)
					}
				})

			},
			getinfo_h52(url) {

				window.location.href = url;
			},
			get_user_data() {
				var _this = this;
				//请求后端
				request.post_info_user(this.user_info.id).then(res => {
					if (res.code === this.SUCCESS_CODE) {

						if (res.data.openid != null) {
							let data = this.user_info
							data.openid = res.data.openid
							this.set_user_info(data)
						}
					}
				})
			},
			showBigImageHandler(src, name ,desc) {
				this.image_src = src
				this.shop_name = name
				this.desc = desc
				this.image_show = true
			},
			// 加number
			addNumber(index) {
				let arr = this.goods_list
				arr[index].number = parseInt(arr[index].number) + 1
				this.set_goods_list(arr)
				this.jsTotal()
			},
			// 减number
			seeNumber(index) {
				let arr = this.goods_list
				if (arr[index].number == 0) {
					this.set_goods_list(arr)
				} else {
					arr[index].number = parseInt(arr[index].number) - 1
					this.set_goods_list(arr)
				}
				this.jsTotal()
			},
			changeNumber(index) {
				let arr = this.goods_list
				if (arr[index].number == '') {
					arr[index].number = 0
				}
				if (parseInt(arr[index].number) > 1000 || parseInt(arr[index].number) == 1000) {
					arr[index].number = 999
				}
				this.set_goods_list(arr)
				this.jsTotal()
			},
			// 计算总数
			jsTotal() {
				let arr = this.goods_list
				this.total = 0
				this.original_price = 0
				this.price = 0
				let list = []
				arr.forEach((item) => {
					let number = item.number
					let itemOldTotal = parseFloat(item.original_price) * parseInt(number)
					let original_price = parseFloat(this.original_price) + parseFloat(itemOldTotal)
					this.original_price = original_price.toFixed(2)

					let itemNewTotal = parseFloat(item.price) * parseInt(number)
					let price = parseFloat(this.price) + parseFloat(itemNewTotal)
					this.price = price.toFixed(2)

					this.total = parseInt(this.total) + parseInt(number)
					if (parseInt(number) > 0) {
						list.push(item)
						this.set_select_goods(list)
					}
					if (parseInt(this.total) > 0) {
						this.isCanSubmit = true
					} else {
						this.isCanSubmit = false
					}
				})
			},
			getGoosList() {
				request.get_good_list().then(res => {
					if (res.code === this.SUCCESS_CODE) {
						let arr = res.data.goods
						arr.forEach((item) => {
							item.number = 0
						})
						this.set_goods_list(res.data.goods)
						this.set_freight(res.data.freight)
						let data = {
							address: '',
							person: res.data.shipping_name,
							mobile: res.data.shipping_mobile
						}
						this.set_material_address(data)
						if (res.data.banner) {
							let banner = res.data.banner
							this.set_banner_list(banner)
						}
					} else {
						this.$toast.fail(res.msg)
					}
				})
			},
			...mapMutations({
				set_freight: 'SET_FREIGHT',
				set_material_address: 'SET_MATERIAL_ADDRESS',
				set_select_goods: 'SET_SELECT_GOODS',
				set_goods_list: 'SET_GOODS_LIST',
				set_banner_list: 'SET_BANNER_LIST',
				set_user_info: 'UPDATE_USER_INFO',
				set_mailing_index: 'SET_MAILING_INDEX'
			})
		}
	}
</script>
<style>
	.van-swipe {
		height: 200px;
	}
</style>
