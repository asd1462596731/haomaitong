<template>
	<div id="charts" class="page_container" :style="`padding-top: ${head_rem}rem;`">
		<NavBar :meta="meta" />
		<van-tabs v-model="activeName" color="#d5d5d5" @change="cut">
             <van-tab title="经营报表" name="statement"></van-tab>
             <van-tab title="营业趋势" name="tendency"></van-tab>
             <van-tab title="顾客" name="client"></van-tab>
</van-tabs>
<div v-if="(activeName === 'statement')">
	<div class="head-but">
			<div class="head-but-left">

				<div class="ht" :class="{'ht_c':is_check == index }" v-for="(item,index) in data_time"
					@click="check_time(item.key,index,item.name)">{{item.name}}</div>

			</div>
			<div class="head-but-right" @click="rq">
				日期选择
			</div>
		</div>
		<div v-if="user_info.level == 'master' " class="head-met">
			<label>选择商家</label>
			<select name="selectemerchants" @change="changeMet" style="padding: 3px;border-color: #ccc;color: #999;">
				<option value="" >未选择</option>
				<option v-for="(options,id) in selectMerchants" :key="id" :value="options.id">{{options.merchant_alias}}
				</option>
			</select>
		</div>
		<div v-if="user_info.level == 'shoper' || user_info.level == 'merchant'" class="head-met">
			<label>选择门店</label>
			<select name="selectemerchants" @change="changeMet2" style="padding: 3px;border-color: #ccc;color: #999;">
				<option value="" >全部门店</option>
				<option v-for="(options,id) in selectStores" :key="id" :value="options.id" :text="options.name">{{options.name}}
				</option>
			</select>
		</div>

		<ChartsHead head-title="日期选择" ref="time_or" @beginSearchHandler="beginSearchHandler" v-if="is_rq" />
		<div class="pice-box">
			<div class="pice-box-title">
				总营收
			</div>
			<div class="pice-box-pice">
				<span>￥</span>
				<span>{{pice_all[0]}}</span>
			</div>

		</div>
		<div class="mone-box">
			<div class="mone-box-b">
				<van-cell title="直接营收" is-link @click="jumpTo(`/bill`)" title-class='mone-title' />
				<div class="mone-pic">￥{{pice_all[1]}}</div>
			</div>
			<div class="mone-box-b">
				<van-cell title="跨境营收" is-link @click="jumpTo(`/cross`)" title-class='mone-title' />
				<div class="mone-pic">￥{{pice_all[2]}}</div>
			</div>
		</div>

		<!-- <div id="pie_chart" v-show="isShowPie"></div> -->
		<!-- <div id="line_chart2"></div> -->
		<div id="line_chart"></div>

		<div style="width: 100%;text-align: center;margin-top: 20px;">
			<!-- <download-excel
			  class   = "btn btn-default"
			  :data   = "json_data"
			  :fields = "json_fields"
			  worksheet = "My Worksheet"
			   type = "csv"
			  name = "经营报表.xls">
			  <div class="excel-dow">
				<van-button type="info" size="small" v-if="is_web_type == 'H5'">经营报表导出图表</van-button>
				<van-button type="info" size="small" v-if="is_web_type == 'app'">去wap导出经营报表</van-button>
			  </div>
			 </download-excel> -->
			<div>
				<van-icon name="envelop-o" size="30px" @click="email_show" />
			</div>
		</div>
		<van-popup v-model:show="is_popup" closeable close-icon="close" position="bottom" :style="{ height: '50%' }">
			<div style="padding: 10px;margin-top: 30px;">

				<van-cell-group inset>
					<van-field v-model="email" required name="email" label="邮箱" placeholder="请输入邮箱" />
					<van-field v-model="title" name="title" label="标题" placeholder="标题" readonly />
					<van-field v-model="mach_name" name="mach_name" label="商户名称" placeholder="商户名称" readonly />
					<van-field v-model="time" name="time" label="时间" placeholder="时间" readonly />
				</van-cell-group>


				<div style="margin: 16px;">
					<van-button round plain block type="info" @click="getemail">
						发送邮件
					</van-button>
				</div>

			</div>
		</van-popup>
</div>
<Tendency v-if="(activeName === 'tendency')"></Tendency>
<Client v-if="(activeName === 'client')"></Client>
	</div>



</template>
<script>
	import NavBar from '@/components/navBar'
	import Tendency from '../tendency/index'
	import Client from '../client/index'
	import * as request from '@/api'
	import ChartsHead from '../components/chartsHead'
	import {
		theme_color,
		web_h5
	} from '@/config'
	import * as math from 'mathjs'
	import {
		mapGetters
	} from 'vuex'
	export default {
		components: {
			ChartsHead,
			NavBar,
			Tendency,
			Client
		},
		computed: {
			...mapGetters(['user_token', 'is_web_type', 'user_info'])
		},
		data() {
			return {
				desk_name:'全部门店',
				selectStores:[],
				selectMerchants: [],
				meta: this.$route.meta,
				line_chart_date: [],
				line_chat_list: [],
				pie_chart_data: [],
				pie_chart_list: [],
				start_time: null,
				end_time: null,
				isShowPie: true,
				is_popup: false,
				is_check: 0,
				is_rq: false,
				mach_id:null,
				desk_id:null,
				key: 1,
				id: '',
				all_money: [],
				order_money: [],
				activeName:'',
				log_money: [],
				pice_all: [],
				data_time: [{
						name: '天',
						key: 1
					},
					{
						name: '周',
						key: 2
					},
					{
						name: '月',
						key: 3
					},
					{
						name: '季',
						key: 4
					},
					{
						name: '年',
						key: 5
					},
				],
				json_fields: {
					"日期": 'day',
					'直接营收': 'pice_zy',
					'跨境营收': 'pice_kj',
					'总计': 'pice_total',
				},
				json_data: [],
				email: '',
				title: '',
				mach_name: '',
				time: '天'
			}
		},
		created() {
			if (!this.user_token) {
				this.noPastTo('/login')
			}
			if (this.user_info.level === 'master') {
				this.title = this.user_info.nickname + '（经营明细表）'
				this.mach_name = this.user_info.nickname
			}else{
				this.title = this.user_info.merchant.merchant_alias + '（经营明细表）'
				this.mach_name = this.user_info.merchant.merchant_alias
			}
			this.id = this.user_info.id
			if(this.user_info.level === 'shoper' || this.user_info.level === 'merchant'){
				this.getStores()
			}else{
				this.getMerchants()
			}
		},
		mounted() {
			this.getOrderReportFunc()
		},
	methods: {
		//切换
		cut() {
			if (this.activeName === 'statement') {
				this.getOrderReportFunc()
			}
		},
		getStores() {
			request.get_getStores().then(res => {
				if (res.code === this.SUCCESS_CODE) {
					this.selectStores = res.data
				}
			})
		},
		getMerchants() {
			request.get_get_getMerchants(this.user_info.id).then(res => {
				if (res.code === this.SUCCESS_CODE) {
					this.selectMerchants = res.data
				}
			})
		},
		changeMet(event) {
			this.mach_id = event.target.value
			if (event.target.value != '') {
				let arr_1 = this.selectMerchants
				let mer_name_1 = arr_1.find((item) => {
					if (item.id == this.mach_id) {
						return item;
					}
				})
				console.log(mer_name_1)
				this.title = mer_name_1.merchant_alias + '（经营明细表）'
				this.mach_name = mer_name_1.merchant_alias
			} else {
				if (this.user_info.level === 'master') {
					this.title = this.user_info.nickname + '（经营明细表）'
					this.mach_name = this.user_info.nickname
				} else {
					this.title = this.user_info.merchant.merchant_alias + '（经营明细表）'
					this.mach_name = this.user_info.merchant.merchant_alias
				}
			}
			this.getOrderReportFunc()
			// if(this.user_info.level == 'shoper'){


			// }
			// this.getOrderReportFunc()
			// let arr = this.selectMerchants
			// let mer_name = arr.find((item)=>{
			// 	// console.log(item)
			// 	if(item.id == this.id){
			// 		return item;
			// 	}
			// })
			// if(mer_name == undefined){
			// 	return false
			// }
			// this.title = mer_name.merchant_alias + '（经营明细表）'
			// this.mach_name = mer_name.merchant_alias
		},
		changeMet2(event) {

			this.desk_id = event.target.value
			if (event.target.value != '') {
				let arr_1 = this.selectStores
				let mer_name_1 = arr_1.find((item) => {
					if (item.id == this.desk_id) {
						return item;
					}
				})
				this.title = mer_name_1.name + '（经营明细表）'
				this.mach_name = mer_name_1.name
			} else {
				if (this.user_info.level === 'master') {
					this.title = this.user_info.nickname + '（经营明细表）'
					this.mach_name = this.user_info.nickname
				} else {
					this.title = this.user_info.merchant.merchant_alias + '（经营明细表）'
					this.mach_name = this.user_info.merchant.merchant_alias
				}
			}
			this.getOrderReportFunc()
			// if(this.user_info.level == 'shoper'){


			// }
			// this.getOrderReportFunc()
			// let arr = this.selectMerchants
			// let mer_name = arr.find((item)=>{
			// 	// console.log(item)
			// 	if(item.id == this.id){
			// 		return item;
			// 	}
			// })
			// if(mer_name == undefined){
			// 	return false
			// }
			// this.title = mer_name.merchant_alias + '（经营明细表）'
			// this.mach_name = mer_name.merchant_alias
		},
		email_show() {
			this.is_popup = true
			if (this.user_info.level == 'shoper') {
				this.title = this.desk_name
			}

		},
		getOrderReportFunc() {
			// this.time = this.start_time+'-'+this.end_time

			request.post_order_report(this.start_time, this.end_time, this.key, this.mach_id, this.desk_id).then(res => {
				if (res.code === this.SUCCESS_CODE) {
					// this.line_chart_date = []
					this.line_chat_list = res.data.data_time;
					var data = res.data.data;
					this.all_money = [];
					this.order_money = [];
					this.log_money = [];
					var pice_total = 0;
					var pice_zy = 0;
					var pice_kj = 0;
					var list_data = [];
					for (const key in data) {

						list_data.push({
							day: key,
							pice_zy: this.$math.round(pice_zy, 4),
							pice_kj: this.$math.round(pice_kj, 4),
							pice_total: this.$math.round(pice_total, 4)
						})
						pice_total += Number(data[key][0]);
						pice_zy += Number(data[key][1]);
						pice_kj += Number(data[key][2]);
						this.all_money.push(Number(data[key][0]))
						this.order_money.push(Number(data[key][1]))
						this.log_money.push(Number(data[key][2]))
					}
					this.pice_all = [this.$math.round(pice_total, 4), this.$math.round(pice_zy, 4), this.$math
						.round(pice_kj, 4)
					]

					this.json_data = list_data;
					this.echear()
				} else {
					this.$toast.fail(res.msg)
				}
			})
		},
		getemail() {
			if (this.email == '' || this.email == null) {
				this.$toast.fail('请输入邮箱号！');
				return false
			}
			var pattern =
				/^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
			let flag = pattern.test(this.email);

			if (!flag) {
				this.$toast.fail('请输入正确的邮箱！');
				return false
			}


			var data = {
				start_time: this.start_time,
				end_time: this.end_time,
				key: this.key,
				email: this.email,
				title: this.title,
				mach_name: this.mach_name,
				time: this.time,
				mach_id: this.mach_id,
				desk_id: this.desk_id
			}


			request.post_email_send(data).then(res => {
				if (res.code === this.SUCCESS_CODE) {
					this.is_popup = false
					this.$toast.fail(res.msg)
				} else {
					this.$toast.fail(res.msg)
				}
			})

		},
		rq() {
			if (!this.is_rq) {
				this.is_rq = true
				this.is_check = 'k'
				this.key = 6
				setTimeout(() => {

					this.start_time = this.$refs.time_or.begin_date
					this.end_time = this.$refs.time_or.end_date
					this.time = this.start_time + '-' + this.end_time
				}, 1)

			} else {
				this.is_rq = false
				this.is_check = 0
				this.key = 1
				this.time = "天"
			}
			this.getOrderReportFunc()
		},
		check_time(key, index, name) {
			this.is_check = index;
			this.is_rq = false
			this.key = key;
			this.time = name
			this.getOrderReportFunc()
		},

		beginSearchHandler(data) {
			this.start_time = data.begin
			this.end_time = data.end
			this.time = this.start_time + '-' + this.end_time
			this.getOrderReportFunc()
		},
		ifweach() {

			if (this.is_web_type == 'H5') {

				// this.$dialog.confirm({
				// 		  message: "确认要导出表报？"
				// 		}).then(() => {

				// 		}).catch(() => {

				//   // on canccel
				// })
				this.get_summary_sheet();
			} else {

				this.$app.openApp({
					androidPkg: 'android.intent.action.VIEW',
					mimeType: 'text/html',
					uri: web_h5 + '/chartsSale'
				}, function (ret, err) {
					var msg = JSON.stringify(ret);
					this.$app.alert({
						title: 'openApp',
						msg: msg,
						buttons: ['确定']
					});
				});
			}
		},
		get_summary_sheet() {
			request.post_summary_sheet().then(res => {
				if (res.code === this.SUCCESS_CODE) {

					let arr = []
					for (let i in res.data) {
						arr.push(res.data[i])
					}
					this.json_data = arr[0];
				} else {

					this.$toast.fail(res.msg)
				}

			})
			s
			},
			echear() {
				let myChart = this.$echarts.init(document.getElementById('line_chart'))

				var option = {
					legend: {
						data: ['总营收', '直接营收', '跨境营收'],
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						top: '40%',
						containLabel: true
					},
					// toolbox: {
					//   feature: {
					//     saveAsImage: {}
					//   }
					// },
					xAxis: {
						type: 'category',
						boundaryGap: true,
						data: this.line_chat_list
					},
					yAxis: {
						type: 'value',
						axisLine: {
							show: false,
							lineStyle: {

							} // 样式
						},
						//背景网格为虚线
						splitLine: {
							show: true,
							lineStyle: {
								type: 'dashed'
							}
						}
					},
					series: [{
							name: '总营收',
							type: 'line',
							smooth: true,
							label: {
								normal: {
									show: true,
									position: 'top'
								}
							},
							data: this.all_money
						},
						{
							name: '直接营收',
							type: 'line',
							smooth: true,
							label: {
								normal: {
									show: true,
									position: 'top'
								}
							},
							data: this.order_money
						},
						{
							name: '跨境营收',
							type: 'line',
							smooth: true,
							label: {
								normal: {
									show: true,
									position: 'top'
								}
							},
							data: this.log_money
						}
					]
				};

				myChart.setOption(option)
			}
		}
	}
</script>
<style>
	* {
		touch-action: pan-y;
	}

	.head-met {
		margin: 0.5rem 0.5rem;

	}

	.head-met .select {
		width: 2rem;
	}

	.excel-dow {
		padding: 10px;
	}

	.excel-box {
		width: 100%;
		margin-top: 0.7rem;
		font-size: 0.4rem;
		color: #999;
	}

	.excel-text {
		padding: 20px 0px;
		color: green;
	}

	.text {
		font-size: 0.2rem;
	}

	.head-but {
		width: 100%;
		margin: 0 auto;
		justify-content: space-around;
		display: flex;
		padding: 10px 0px;
		box-shadow: 0 15px 30px rgba(0, 0, 0, .05);
	}

	.head-but-left {
		width: 70%;
		background-color: #e1e0e0;
		justify-content: space-around;
		display: flex;
	}

	.head-but-right {
		width: 15%;
		padding: 10px 0px;
	}

	.ht {
		width: 20%;
		padding: 10px 0px;
		text-align: center;
		color: #fff;
		font-weight: bold;
	}

	.ht_c {
		background-color: #494444;
	}

	.pice-box {
		border-bottom: 1px solid #f0ecec;
		text-align: center;
		padding: 10px 0px;
	}

	.pice-box-title {
		padding-top: 20px;
		font-size: 15px;
		font-weight: bold;
		letter-spacing: 3px;
	}

	.pice-box-pice {
		padding-top: 10px;
		font-size: 20px;
		font-weight: bold;
	}

	.mone-box {
		width: 100%;
		background-color: #fff;
		justify-content: space-around;
		display: flex;
		border-bottom: 1px solid #f0ecec;
	}

	.mone-box-b {
		width: 100%;
		border-right: 1px solid #f0ecec;
	}

	.mone-pic {
		padding: 15px;
		font-weight: bold;
		color: orange;
		font-size: 15px;
	}

	.mone-title {
		font-weight: bold;
	}

	.broder-left {}

	.head-mer {
		display: inline-block;
		position: relative;
	}
</style>
