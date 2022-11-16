<template>
	<div class="page_container" :style="`padding-top: ${head_rem}rem;`">
		<NavBar :meta="meta" />
		<van-notice-bar color="#ff0000" background="#ecf9ff" left-icon="info-o">
			广告赋能将扣除账户余额，请谨慎填写下方信息后提交
		</van-notice-bar>
		<section class="form-wrap">
			<van-field name="user_info.nickname" :value="user_info.nickname" label="代理商名称" readonly />
			<van-field name="picker" :value="type.text" label="套餐类型" placeholder="请选择"
				@click="showSetMealTypePicker = true" />
			<van-field v-model="comboNum" name="comboNum" label="套餐数量" type="number" placeholder="请输入套餐数量，最低为1" />
			<van-field v-model="comboLink" name="comboLink" label="赋能链接" placeholder="请输入完整赋值链接口令" />

			<van-field v-model="comboType" name="comboType" label="赋能类型" placeholder="请输入赋值类型，例如：淘宝，拼多多" />
			<div style="margin: 16px;">
				<van-button round block type="info" @click="onSubmit">
					添加
				</van-button>
			</div>
		</section>

		<!-- 套餐类型选择popup -->
		<van-popup v-model="showSetMealTypePicker" position="bottom">
			<van-picker show-toolbar :columns="typeColumns" @confirm="onConfirmType"
				@cancel="showSetMealTypePicker = false" />
		</van-popup>
	</div>
</template>

<script>
	import NavBar from "@/components/navBar";
	import * as request from "@/api";
	import {
		mapGetters
	} from "vuex";
	export default {
		name: "Form",
		data() {
			return {
				meta: this.$route.meta,
				type: {
					id: "",
					text: "",
				},
				comboNum: 1,
				comboLink: "",
				comboType: "",
				showSetMealTypePicker: false,
				typeColumns: [{
						id: 1,
						text: "一天"
					},
					{
						id: 2,
						text: "一周"
					},
					{
						id: 3,
						text: "一季度"
					},
					{
						id: 4,
						text: "一年"
					},
					{
						id: 5,
						text: "10次"
					},
					{
						id: 6,
						text: "50次"
					},
					{
						id: 7,
						text: "100次"
					},
					{
						id: 8,
						text: "500次"
					},
				],
			};
		},

		components: {
			NavBar,
		},
		computed: {
			...mapGetters(["user_info", "apply_info"]),
		},
		methods: {
			async onSubmit(values) {
				const params = {
					pid: this.user_info.id,
					type_id: this.type.id,
					combo_num: this.comboNum,
					url: this.comboLink,
					url_type: this.comboType,
				};
				if (
					this.comboNum === "" ||
					this.comboLink === "" ||
					this.comboType === ""
				) {
					this.$toast("请设置相关参数");
				}
				
				const result = await request.get_user_money(params);
				if(result.code == 1){
					this.$toast(result.msg);
				}

				this.onSure(result);
			},

			onSure(data) {
				this.$dialog
					.confirm({
						title: "提示",
						message: `将扣款${data.data[0]}元,当前账户余额为${data.data[1]}`,
					})
					.then(() => {
						const params = {
							pid: this.user_info.id,
							type_id: this.type.id,
							combo_num: this.comboNum,
							url: this.comboLink,
							url_type: this.comboType,
							money: data.data[0],
						};
						request.add_combo_set(params).then((res) => {
							const {
								code,
								msg
							} = res;
							if (code === 0) {
								this.$toast.success(msg);
							} else if (code === 1) {
								this.$toast.fail(msg);
							}
							this.jumpTo({
								name: "adSet"
							});
						});
					});
			},

			onConfirmType(value) {
				const {
					id,
					text
				} = value;
				if (value) {
					this.type.id = id;
					this.type.text = text;
				}
				this.showSetMealTypePicker = false;
			},
		},
	};
</script>

<style scoped>
	.form-wrap {
		padding: 0.4rem;
	}
</style>
