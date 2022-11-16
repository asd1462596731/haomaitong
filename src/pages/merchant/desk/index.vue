<template>
	<div id="desk" class="page_container" :style="`padding-top: ${head_rem}rem;`">
		<NavBar :meta="meta" />
		<div class="desk_list">
			<div class="desk_item" v-for="(item, key, index) in desk_list" :key="item.id">
				<div class="item_left">
					<!-- <p class="left_line">
						收款码:
						<span v-if="item.qrcode_number">{{ item.qrcode_number }}</span>
						<span v-else>未绑定</span>
					</p>
					<p class="left_line">
						云喇叭:
						<span v-if="item.horn_serial">{{ item.horn_serial }}</span>
						<span v-else>未绑定</span>
					</p> -->
					<p class="left_line" @click="change_name(item)" v-if="level !='cashier'">
						门店名称:
						<span>{{ item.name }}</span>
						<van-icon name="edit"/>
					</p>
					<p class="left_line" v-else>
						门店名称:
						<span>{{ item.name }}</span>
					</p>
					
					<div class="left_button">
						
						<a href="javascript:;" class="theme_bg" @click="goToBindQrNum(item)" v-if="item.qrcode_number">收款码</a>
						<a href="javascript:;" class="theme_border" @click="goToBindQrNum(item)" v-if="item.qrcode_number == null ">收款码</a>
						
						<a href="javascript:;" class="theme_bg" @click="goToCloudSpeaker(item)" v-if="item.horn_serial">云喇叭</a>
						<a href="javascript:;" class="theme_border" @click="goToCloudSpeaker(item)" v-if="item.horn_serial == null ">云喇叭</a>
						
						<a href="javascript:;" class="theme_bg" @click="goToCloudPos(item)" v-if="item.bsj_sn">POS</a>
						<a href="javascript:;" class="theme_border" @click="goToCloudPos(item)" v-if="item.bsj_sn == null ">POS</a>
						
						<a v-if="account_info != 'merchant' && account_info != 'cashier' && account_info != 'shoper' && account_info != 'visitor' && account_info != 'master'" 
							href="javascript:;" class="theme_border" @click="goToEnergize(item)">
							赋能设置
						</a>
						<a href="javascript:;" class="theme_border" @click="delDesk(item)" v-if="(key != 0) && (level !='cashier' && level !='shoper')">删除门店</a>
					</div>
				</div>
				<div class="item_right" style="display: block;text-align: center;">
					<span>电子收款码</span>
					<br />
					<img style="margin-top: 9px;" :src="item.qrcode" @click="goToQrcode(item.qrcode)" alt="" />
				</div>
			</div>
			<DataDone :list="desk_list" />
		</div>
		<div class="fixed_button" v-if="(desk_list.length < desk_num) && (level !='cashier' && level !='shoper')">
			<a href="javascript:" @click="addDeskHandler">添加门店</a>
		</div>
		
		<van-dialog v-model="image_show" @closed='isclosed'>
			<van-cell-group inset>
			  <van-field
			    v-model="desk_name"
				autosize
			    required
			    label="门店名"
			    placeholder="请输入门店名称"
			  />
			</van-cell-group>
		</van-dialog>
		
		<van-dialog v-model="updata_show" @closed='updata_name'>
			<van-cell-group inset>
			  <van-field
			    v-model="new_desk_name"
				autosize
			    required
			    label="门店名"
			    placeholder="请输入门店名称"
			  />
			</van-cell-group>
		</van-dialog>
		
	</div>
</template>
<script>
	import DataDone from "@/components/dataDone";
	import NavBar from "@/components/navBar";
	import * as request from "@/api";
	import {
		mapGetters,
		mapMutations
	} from "vuex";
	export default {
		components: {
			NavBar,
			DataDone,
		},
		data() {
			return {
				desk_name:'',
				meta: this.$route.meta,
				desk_list: [],
				account_info: "",
				image_show: false,
				updata_show:false,
				new_desk_name:''
			};
		},
		computed: {
			...mapGetters(["sub_uid", "user_token", "user_info", "apply_info", 'site_config']),
			level(){
				
				return this.user_info.level
			},
		    desk_num(){
				return this.site_config.desk_num;
			} 
		},
		created() {
			this.account_info = this.user_info.level;
			if (!this.user_token) {
				this.noPastTo("/login");
			}
			
			this.set_desk_qrcode("");
			this.getDeskList();

		},
		methods: {
			goToQrcode(src) {
				this.set_desk_qrcode(src);
				this.jumpTo("/qrcode");
			},
			goToCloudSpeaker(obj) {
				this.jumpTo({
					name: "cloudSpeaker",
					params: {
						desk_id: obj.id,
					},
				});
			},
			goToCloudPos(obj) {
				this.jumpTo({
					name: "cloudPos",
					params: {
						desk_id: obj.id,
					},
				});
			},
			goToBindQrNum(obj) {
				this.jumpTo({
					name: "bindQrcodeNum",
					params: {
						desk_id: obj.id,
						name: obj.name,
						number: obj.qrcode_number,
					},
				});
			},
			goToEnergize(obj) {
				request.get_ad_desk_info(obj.id).then((res) => {
					const {
						code,
						data,
						msg
					} = res;
					if (code === 0) {
						this.jumpTo({
							name: "energize",
							params: {
								id: data.id,
								name: data.p_name,
								url: data.url,
								url_type: data.url_type,
							},
						});
					} else {
						this.$toast("请设置广告赋能");
					}
				});
			},
			delDesk(obj) {
				this.$dialog.confirm({
					message: "确认要删除？"
				}).then(() => {
					request.post_del_desk(obj.id).then(res => {
						if (res.code === this.SUCCESS_CODE) {
							this.$toast.success(res.msg);
							this.getDeskList();
						} else {
							this.$toast.fail(res.msg)
						}
					})
				}).catch(() => {})
			},
			isclosed(){
				if(this.desk_name == ''){
					this.$toast.fail('门店名不为空')
				}else{
					
					if (this.sub_uid) {
						request.post_selesman_add_desk(this.sub_uid,this.desk_name).then((res) => {
							if (res.code === this.SUCCESS_CODE) {
								this.$toast.success(res.msg);
								this.getDeskList();
							} else {
								this.$toast.fail(res.msg);
							}
						});
					} else {
						request.post_add_desk(this.desk_name).then((res) => {
							if (res.code === this.SUCCESS_CODE) {
								this.$toast.success(res.msg);
								this.getDeskList();
							} else {
								this.$toast.fail(res.msg);
							}
						});
					}
				}
				
			},
			
			//添加门店按钮
			addDeskHandler() {
				if(this.desk_list == ''){
					if (this.sub_uid) {
						request.post_selesman_add_desk(this.sub_uid).then((res) => {
							if (res.code === this.SUCCESS_CODE) {
								this.$toast.success(res.msg);
								this.getDeskList();
							} else {
								this.$toast.fail(res.msg);
							}
						});
					} else {
						request.post_add_desk().then((res) => {
							if (res.code === this.SUCCESS_CODE) {
								this.$toast.success(res.msg);
								this.getDeskList();
							} else {
								this.$toast.fail(res.msg);
							}
						});
					}
				}else{
					this.image_show = true
				}
				
			},
			//修改门店名称
			change_name(item){
				this.updata_show = true
				this.updata_desk_id = item.id
			},
			//修改门店方法
			updata_name(){
				if(this.new_desk_name == ''){
					this.$toast.fail('门店名不为空')
				}else{
					request.post_update_desk_name(this.updata_desk_id,this.new_desk_name).then((res) => {
						if (res.code === this.SUCCESS_CODE) {
							this.$toast.success(res.msg);
							this.getDeskList();
						} else {
							this.$toast.fail(res.msg);
						}
					});
				}
			},
			getDeskList() {
				if (this.sub_uid) {
					request.post_salesman_desk(this.sub_uid).then((res) => {

						if (res.code === this.SUCCESS_CODE) {
							this.desk_list = res.data;
						} else {
							this.$toast.fail(res.msg);
						}
					});
				} else {
					request.get_desk_list().then((res) => {

						if (res.code === this.SUCCESS_CODE) {
							this.desk_list = res.data;
						} else {
							this.$toast.fail(res.msg);
						}
					});
				}
			},

			...mapMutations({
				set_desk_qrcode: "SET_DESK_QRCODE",
			}),
		},
	};
</script>
<style>
	.left_button {
		display: block !important;
	}

	.left_button a {
		float: left;
		margin-bottom: 0.3rem;
	}
	.van-field__control{
		background: #8c867f26 !important;
	}
</style>
