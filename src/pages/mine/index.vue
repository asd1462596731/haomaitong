<template>
	<div class="page_main" id="mine">
		<div class="user_head" @click="jumpTo('/userInfo')">
			<div class="head_img">
				<img v-if="user_info.avatar" :src="user_info.avatar" alt="">
				<img v-if="!user_info.avatar" src="@/assets/img/mine/mine_icon1.png" alt="">
			</div>
			<div class="head_right">
				<div class="right_top">
					<div v-if="user_info.nickname">{{user_info.nickname}}</div>
					<div v-if="!user_info.nickname">游客</div>
					<img src="@/assets/img/mine/mine_icon5.png" alt="">
				</div>
				<div class="right_bottom">
					<img src="@/assets/img/mine/mine_icon9.png" alt="">
					<span v-if="user_info.mobile">{{user_info.mobile}}</span>
					<span v-if="!user_token">未登录</span>
				</div>
			</div>
		</div>
		<div class="user_content">
			<div class="content_left">
				<img src="@/assets/img/mine/mine_icon10.png" alt="" class="content_icon">
				<span class="content_text" v-if="!user_token">
					当前身份：
					<i>--</i>
				</span>
				<span class="content_text" v-else>
					当前身份：
					<!-- <i v-show="user_info.level === 'visitor'">游客</i>
					<i v-show="user_info.level === 'merchant'">商家</i>
					<i v-show="user_info.level === 'sale'">业务经理</i>
					<i v-show="user_info.level === 'cashier'">店员</i>
					<i v-show="user_info.level === 'province'">分公司</i>
					<i v-show="user_info.level === 'city'">钻石服务商</i>
					<i v-show="user_info.level === 'area'">金牌服务商</i> -->
					<i>{{this.user_info.level_lab}}</i>
					<!-- <i v-show="user_info.level === 'province' || user_info.level === 'city' || user_info.level === 'area'">代理</i> -->
				</span>
			</div>
			<div class="content_right"  @click="getUserInfo">
				<span class="content_desc">了解身份</span>
				<img src="@/assets/img/mine/mine_icon6.png" alt="" class="content_link">
			</div>
		</div>
		<div class="user_links">
			<div class="links_item" @click="jumpTo('/helpCenter')">
				<div class="item_img">
					<img class="width37" src="@/assets/img/mine/mine_icon2.png" alt="">
				</div>
				<span>帮助中心</span>
				<img src="@/assets/img/mine/mine_icon7.png" alt="" class="item_right">
			</div>
			<div class="links_item" @click="jumpTo('/aboutUs')">
				<div class="item_img">
					<img class="width42" src="@/assets/img/mine/mine_icon3.png" alt="">
				</div>
				<span>关于我们</span>
				<img src="@/assets/img/mine/mine_icon7.png" alt="" class="item_right">
			</div>
			<div class="links_item" @click="openMeiQia">
				<div class="item_img">
					<img class="width40" src="@/assets/img/mine/mine_icon8.png" alt="">
				</div>
				<span>在线客服</span>
				<img src="@/assets/img/mine/mine_icon7.png" alt="" class="item_right">
			</div>
			<div class="links_item" @click="openWexXinCode" v-if="user_info.level === 'merchant'">
				<div class="item_img">
					<img class="width40" src="@/assets/img/mine/mine_icon16.png" alt="">
				</div>
				<span>实名认证</span>
				<img src="@/assets/img/mine/mine_icon7.png" alt="" class="item_right">
			</div>
			<div class="links_item" @click="jumpTo('/setUp')">
				<div class="item_img">
					<img class="width40" src="@/assets/img/mine/mine_icon4.png" alt="">
				</div>
				<span>设置</span>
				<img src="@/assets/img/mine/mine_icon7.png" alt="" class="item_right">
			</div>
		</div>
	</div>
	
	
	
	
</template>
<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import * as request from '@/api'
	export default {
		data() {
			return {
				userInfo:'',
			}
		},
		computed: {
			...mapGetters(['user_token', 'user_info', 'mq_client_id', 'is_web_type'])
		},
		created() {
		},
		methods: {
			getUserInfo(){
				if (!this.user_token) {
					this.noPastTo('/login')
					return false;
				}else{
					this.jumpTo("/aboutIden");
				}
				// request.getIdentity(this.user_info.level).then(res => {
				// 	if(res.code === 0){
				
				// 		this.$toast(res.data.des);
				// 	}
				// })
				
			},
			
			openWexXinCode(){
				this.jumpTo("/wxCode");
			},
			
			openMeiQia() {
				var type_web = this.is_web_type;
				if (type_web == "H5") {
					this.$toast.fail("请使用APP打开此功能！");
					return false;
				}
				if (!this.user_token) {
					this.noPastTo('/login')
				}
				let level = this.user_info.level
				let shenfen = ''
				switch (level) {
					case 'sale':
						shenfen = '业务'
						break
					case 'province':
						shenfen = '省代理'
						break
					case 'merchant_d0':
						shenfen = 'D0代理'
						break
					case 'city':
						shenfen = '市代理'
						break
					case 'area':
						shenfen = '区代理'
						break
					case 'merchant':
						shenfen = '商家'
						break
					case 'master':
						shenfen = '主商家'
						break
					case 'cashier':
						shenfen = '收银'
						break
					case 'shoper':
						shenfen = '店长'
						break
					default:
						shenfen = '游客'
						break
				}

				let _this = this
				var infoParam = {
					comment: `身份: ${shenfen}`,
					gender: this.user_info.gender === 'male' ? '男' : '女',
					avatar: this.user_info.avatar,
					tel: this.user_info.mobile ? this.user_info.mobile : '暂无电话',
					name: this.user_info.nickname
				}
				this.$MeiQia.setClientInfo(infoParam)
				this.$MeiQia.show({
					showAvatar: true
				})
			},
			
			...mapMutations({
				set_user_info: 'SET_USER_INFO'
			})
		}
	}
</script>
