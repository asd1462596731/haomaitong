<template>
	<div id="addShop" class="page_container" :style="`padding-top: ${head_rem}rem;`">
		<NavBar :meta="meta" />

		<div class="add_info" v-for="(item, index) in list" :key="item.id" @click="setSelectIndex(item, index)">
			<div class="info_desc">
				<span class="desc_name" v-if="item.combo_type == 'num'">次数套餐</span>
				<span class="desc_phone" v-if="item.combo_type == 'num'">已使用{{ item.combo_use_num }}次</span>
				<span class="desc_name" v-if="item.combo_type == 'time'">时长套餐</span>
				<span class="desc_phone" v-if="item.combo_type == 'time'">截止：{{ item.combo_end_time }}</span>
			</div>
			<div class="info_status_box" v-if="item">
				<div class="info_status" v-if="item.combo_type == 'time'"
					:class="[item.s_time < now_time ? 'color3' : 'color1']">
					{{ item.s_time < now_time ? " 已过期" : "正常" }}
				</div>
				<div class="info_status" v-else
					:class="[item.combo_num - item.combo_use_num > 1 ? 'color1' : 'color3']">
					{{ item.s_time < now_time ? " 正常" : "已过期" }}
				</div>
				<!-- <div class="info_status color1" v-else></div> -->
			</div>
		</div>

		<div class="add_noData" v-show="list.length === 0">
			暂无更多数据
		</div>

		<div class="fixed_button">
			<a class="btn" href="javascript:;"  @click="handAddSet()">新增赋能</a>
		</div>
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
		data() {
			return {
				meta: this.$route.meta,
				mobile: "",
				data: "",
				code: "",
				msg: "",
				status: -1,
				canSubmit: false,
				list: [],
				selectIndex: -1,
				now_time: Number(Number(+new Date()).toString().substr(0, 10)),
			};
		},

		components: {
			NavBar,
		},
		computed: {
			...mapGetters(["user_info", "apply_info"]),
			isTakeEffect() {	
				return this.list.some((item) => item.s_time > this.now_time);
			},
			isNumber(){
				return this.list.some((item) => item.combo_num - item.combo_use_num >0 );
			}
		},
		created() {
			this.getSetInfo();
			this.set_apply_uid(null);
			this.set_apply_info({});
			this.set_apply_info({});
			this.set_merchant_status_show(false);
		},
		methods: {
			getSetInfo() {
				request.get_set_info(this.user_info.id).then((res) => {
					if (res.code === this.SUCCESS_CODE) {
						let arr = res.data != null ? arr = res.data : arr = [];
						if (arr.length === 0) {
							this.list = [];
						} else {
							this.list = res.data;
						}
					} else {
						this.$toast.fail(res.msg);
					}
				});
			},
			setSelectIndex(item, index) {
				if (item.combo_type == 'time') {
					if (item.s_time < this.now_time) {
						this.canSubmit = true;
						this.$toast("该套餐已过期");
					} else {
						this.jumpTo({
							name: "edit",
							params: {
								id: item.id,
								url: item.url,
								url_type: item.url_type,
							},
						});
					}

				} else {
					if (item.combo_num - item.combo_use_num < 1) {
						this.canSubmit = true;
						this.$toast("该套餐已过期");
					} else {
						this.jumpTo({
							name: "edit",
							params: {
								id: item.id,
								url: item.url,
								url_type: item.url_type,
							},
						});
					}
				}


			},
			handAddSet() {
				// if (this.isTakeEffect) {
				// 	this.$dialog
				// 		.alert({
				// 			message: "当前已有正在生效的套餐，请勿重复添加",
				// 		})
				// 		.then(() => {
				// 			// on close
				// 		});
				// } else {
					
				// }
				
				this.set_apply_uid(this.user_info.id);
				this.jumpTo({
					name: "addEnabled",
				});

			},
			...mapMutations({
				set_picture: "SET_PICTURE",
				set_rate_region: "SET_RATE_REGION",
				set_pay_rate: "SET_PAY_RATE",
				set_apply_info: "SET_APPLY_INFO",
				set_apply_info_address: "SET_APPLY_INFO_ADDRESS",
				set_apply_uid: "SET_APPLY_UID",
				set_merchant_status_show: "SET_MERCHANT_STATUS_SHOW",
			}),
		},
	};
</script>

<style lang="less" scoped>
	.desc_phone {
		width: 5.5rem !important;
	}
</style>
