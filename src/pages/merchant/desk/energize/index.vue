<template>
	<div id="bindQrcodeNum" class="page_container" :style="`padding-top: ${head_rem}rem;`">
		<NavBar :meta="meta" />
		<section class="form-wrap">
			<!-- <van-field name="picker" :value="user_info.nickname" label="门店名称" readonly /> -->
			<van-field v-model="comboUrl" name="comboUrl" label="赋能链接" placeholder="请输入完整赋值链接口令" />

			<van-field v-model="comboTypeUrl" name="comboTypeUrl" label="赋能类型" placeholder="请输入赋值类型，例如：淘宝，拼多多" />
			<div style="margin: 16px;">
				<van-button round block type="info" @click="editSubmit">
					提交
				</van-button>
			</div>
		</section>
	</div>
</template>
<script>
	import NavBar from "@/components/navBar";
	import * as request from "@/api";
	import {
		mapGetters,
		mapMutations
	} from "vuex";
	export default {
		components: {
			NavBar,
		},
		data() {
			return {
				meta: this.$route.meta,
				code: "",
				url_name: "",
				number: "",
				desk_id: null,
				shopName: "",
				isPost: false,
				btnText: "添  加",
				isBind: false,
				comboUrl: "",
				comboTypeUrl: "",
			};
		},
		computed: {
			...mapGetters(["sub_uid", "user_info"]),
		},
		created() {
			this.$nextTick(() => {
				this.comboUrl = this.$route.params.url;
				this.comboTypeUrl = this.$route.params.url_type;
				this.shopName = this.$route.params.name;
				this.desk_id = this.$route.params.desk_id;
			});
			
			this.get_combo_info();
		},
		methods: {
			editSubmit() {
				if (this.comboUrl === "" || this.comboTypeUrl === "") return;
				const params = {
					id: this.$route.params.id,
					url: this.comboUrl,
					url_type: this.comboTypeUrl,
				};
				request.ad_combo_update(params).then((res) => {
					const {
						code,
						msg
					} = res;
					if (code === 0) {
						this.$toast("修改成功");
					} else if (code === 1) {
						this.$toast.fail(msg || "修改失败");
					}
					this.$router.go(-1);
				});
			},
			showKeyBoard() {
				if (this.isBind) {
					return false;
				}
				this.keyShow = true;
			},
			onInput(value) {
				this.code = `${this.code}${value}`;
				this.getNum();
			},
			onDelete() {
				if (this.code.length > 0) {
					this.values[this.code.length - 1].value = "";
					this.code = this.code.slice(0, -1);
				}
			},
			unBindQrcodeNumber() {
				this.$dialog
					.confirm({
						message: "确认解绑二维码编号？",
					})
					.then(() => {
						// on confirm
						this.unBindQrcodeNumberCallBack();
					})
					.catch(() => {
						// on cancel
					});
			},
			unBindQrcodeNumberCallBack() {
				let data = {
					id: this.desk_id,
				};
				request.post_del_qrcode(data).then((res) => {
					if (res.code === this.SUCCESS_CODE) {
						this.$toast.success(res.msg);
						this.isBind = false;
						this.number = "";
						this.btnText = "添  加";
						this.code = "";
						this.values = [{
								value: ""
							},
							{
								value: ""
							},
							{
								value: ""
							},
							{
								value: ""
							},
							{
								value: ""
							},
							{
								value: ""
							},
							{
								value: ""
							},
						];
					} else {
						this.$toast.fail(res.msg);
					}
				});
			},
			addQrcodeNumber() {
				if (this.number) {
					return false;
				}
				let qrcode_number = this.code;
				if (qrcode_number.length != 7) {
					this.$dialog.alert({
						message: "请填写正确的收款编号",
					});
					return false;
				}
				let _this = this;
				this.$dialog
					.confirm({
						message: `确认绑定收款编号：${qrcode_number}`,
					})
					.then(() => {
						let data = {
							qrcode_number: qrcode_number,
							id: this.desk_id,
						};
						if (this.sub_uid) {
							request.post_selesman_add_code(data).then((res) => {
								this.successCallBack(res);
							});
						} else {
							request.post_desk_codenums(data).then((res) => {
								this.successCallBack(res);
							});
						}
					})
					.catch(() => {
						// on cancel
					});
			},
			successCallBack(res) {
				if (res.code === this.SUCCESS_CODE) {
					this.$toast.success(res.msg);
					setTimeout(() => {
						this.goBack();
					}, 1000);
				} else {
					this.$toast.fail(res.msg);
				}
			},
			getNum() {
				if (!this.code) {
					return false;
				}
				let code = this.code;
				if (code.length >= 7) {
					code = code.slice(0, 7);
					this.code = code;
				}
				code = code.split("");
				code.forEach((item, index) => {
					this.values[index].value = item;
				});
			},
			// 获取口令
			get_combo_info() {
				request.post_combo_info(this.user_info.id).then((res) => {});
			},
		},
	};
</script>
<style lang="less"></style>
