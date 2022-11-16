<template>
  <div id="charts" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
	<van-dropdown-menu>
	  <van-dropdown-item  v-model="table_type" :options="option1" custom-class="dro-item" v-on:change="onType"/>
	  <van-dropdown-item v-model="quarter" :options="option2" v-on:change="onQuarter"/>
	</van-dropdown-menu>
    <ChartsHead head-title="日期选择" ref="time_or" @beginSearchHandler="beginSearchHandler" v-if="quarter == 0"/>
       <!-- 分佣 -->
	  <div v-if="table_type == 0">
      	<div id="merchant_chart"></div>
      	<div id="money_chart"></div>
      </div>
	  <!-- 跨境 -->
	  <div v-if="table_type == 1">
	     <div id="money_chart"></div>
		 
	  </div>
	  <!-- 开户 -->
	  <div v-if="table_type == 2">
	     <div id="money_chart"></div>
	  		 
	  </div>
	  <!-- 广告 -->
	  <div v-if="table_type == 3">
	     <div id="money_chart"></div>
	  </div>
	  <div style="width: 100%;text-align: center;margin-top: 20px;">
	 <!--  <van-button type="info" size="small" v-on:click="ifweach" v-if="is_web_type == 'H5'">点击选择下载的相应的图表</van-button>
	   <van-button type="info" size="small" v-on:click="test" v-if="is_web_type == 'app'">图表仅支持wap导出->去导出</van-button> -->
	   <div style="margin-top: 10px;">
	   	<van-icon name="envelop-o" size="30px" @click="email_show"/>
	   </div>
			<!-- <van-popup
			   v-model="show"
			   closeable
			   position="bottom"
			   :style="{ height: '50%' }"
			 >
			    <div class="excel-box">
					<div class="excel-text">
						 {{type_text}}相关表下载
						 <van-dropdown-menu :overlay="false">
						   <van-dropdown-item  v-model="dow_type" :options="option3" custom-class="dro-item" v-on:change="on_dow"/>
						   
						 </van-dropdown-menu>
						
						 <ChartsHead2 head-title="日期选择"  @beginSearchHandler2="beginSearchHandler2" ref="headerChild" v-show="dow_type == 2" />
					</div>
					<div class="exlcel-t" v-if="dow_type == '0'">
						
					   <download-excel
						  class   = "btn btn-default"
						  :data   = "json_data"
						  :fields = "json_fields"
						  :worksheet = "type_text"
						   type = "csv"
						  name = "全年报表.xls">
						  <div class="excel-dow">
							 全年{{type_text}}<van-icon name="down" color="#11a8f6"/><span class="text">(双击下载)</span>
						  </div>
						 </download-excel>
					</div>
					   <template v-if="dow_type == '1'" v-for="(item, index) in json_data2" >
								<div class="exlcel-t">
									
								   <download-excel
									  class   = "btn btn-default"
									  :data   = "json_data2[index]"
									  :fields = "json_fields"
									  worksheet = "My Worksheet"
									   type = "csv"
									  :name = "index+'报表.xls'">
									  <div class="excel-dow">
										 {{index}}数据明细表<van-icon name="down" color="#11a8f6"/><span class="text">(双击下载)</span>
									  </div>
									 </download-excel>
								</div>
					</template> 
					<div class="exlcel-t" v-if="dow_type == 2">
											
								   <download-excel
									  class   = "btn btn-default"
									  :data   = "json_data"
									  :fields = "json_fields"
									  worksheet = "My Worksheet"
									   type = "csv"
									  name = "起止时间点.xls">
									  <div class="excel-dow">
										<span style="font-size: 0.3rem;">{{start_time2}}-{{end_time2}}{{type_text}}</span>{{type_text}}<van-icon name="down" color="#11a8f6"/><span class="text">(双击下载)</span>
									  </div>
									 </download-excel>
						</div>
			  	</div>
				
			 </van-popup> -->
			 <van-popup
			   v-model:show="is_popup"
			   closeable
			   close-icon="close"
			   position="bottom"
			   :style="{ height: '50%' }"
			 >
			   <div style="padding: 10px;margin-top: 30px;">
			 			
			 			     <van-cell-group inset>
			 			       <van-field
			 			         v-model="email"
			 					  required
			 			         name="email"
			 			         label="邮箱"
			 			         placeholder="请输入邮箱"
			 			       />
			 			      <van-field
			 				  v-model="title"
			 			        name="title"
			 			        label="标题"
			 			        placeholder="标题"
			 			       readonly
			 			      />
			 				  <van-field
			 				    v-model="time"
			 				    name="time"
			 				    label="时间"
			 				    placeholder="时间"
			 					readonly
			 				  />
			 			     </van-cell-group>
			 				 
			 				 
			 			    <div style="margin: 16px;">
			 			       <van-button round plain block type="info" @click="getemail">
			 			         发送邮件
			 			       </van-button>
			 			     </div>
			 			   
			   </div>
			 </van-popup>
	
	  </div>
	   <!-- <van-overlay :show="show" @click="z_show = false" /> -->
  </div>

</template>
<script>
import NavBar from '@/components/navBar'
import * as request from '@/api'
import ChartsHead from '../components/chartsHead'
import ChartsHead2 from '../components/chartsHead2'
import { mapGetters } from 'vuex'
import { theme_color ,web_h5 } from '@/config'
export default {
  components: {
    ChartsHead,
	ChartsHead2,
    NavBar
  },
 computed: {
   ...mapGetters(['is_web_type'])
 },
  data () {
    return {
      meta: this.$route.meta,
	  show:false,
      start_time: null,
      end_time: null,
	  start_time2: null,
	  end_time2: null,
      pieChart: null,
      merchant_list: [],
      money_list: [],
	  is_popup:false,
      date_list: [],
	  dow_type:0,
	  type_text:'',
	  table_type: 0,
	  quarter: 0,
		option1: [
		  { text: '分佣明细报表', value: 0 },
		  { text: '跨界收益报表', value: 1 },
		  { text: '开户收益报表', value: 2 },
		  { text: '广告收益报表', value: 3 },
		],
		option2: [
		  { text: '时间查询', value: 0 },
		  { text: '', value: 1 },
		],
		option3: [
		  { text: '全年报表', value: 0 },
		  { text: '季度报表', value: 1 },
		  { text: '时间段报表', value: 2 },
		],
		json_fields: {},
		json_data:{},
		json_data2:[],
		email:'',
		title:'分佣金额明细报表',
		time:''
		
		      
		        
    }
  },
  created () {
	  var myDate = new Date();
	  var myYear = myDate.getFullYear(); // 获取当前年份
	 this.option2[0].text  = '时间查询（'+myYear+'年)';
	 this.option2[1].text  = '季度（'+myYear+'年)';
	  setTimeout(()=>{  
		      this.time = this.$refs.time_or.begin_date+'-'+this.$refs.time_or.end_date
			  this.start_time = this.$refs.time_or.begin_date
			  this.end_time = this.$refs.time_or.end_date
	  },1)
  },

  // mounted () {
  //   this.$nextTick(() => {
	  //  console.log(_this.$refs.headerChild.name);
  //     this.openMerchantChartsFunc()
  //     this.openMoneyChartsFunc()
  //   })
  // },
  mounted () {
	   var is_web_type = this.is_web_type;
	   this.get_statement_download();
	  
	  var table_type = this.table_type;
	 
	  if(table_type == '0'){
		   this.type_text = "分佣金额明细报表"; 
		    //分佣报表
		   this.getOrderReportFunc();
	  }else{
		    //跨界收益报表
		    this.getTransboundaryFun();
	  } 
	
	  
   
  },
  methods: {
	  email_show(){
	  	this.is_popup = true  
	  },
	  getemail(){
	  		if(this.email == '' || this.email == null){
	  			this.$toast.fail('请输入邮箱号！');
	  			return false
	  		}
			if(this.start_time == null || this.end_time == null){
				this.$toast.fail('请选择时间！');
				return false
			}
	  	   var pattern = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;   
	  	    let flag = pattern.test(this.email);  
	  		 
	  		 if(!flag){
	  			this.$toast.fail('请输入正确的邮箱！');
	  			return false
	  		 }
	  		 
	  		var data = {
	  				start_time:this.start_time,
	  				end_time:this.end_time,
	  				table_type:this.table_type,
	  				email:this.email,
	  				title:this.title,
	  				time:this.time
	  	     	}
	  	   
	  	
	  	request.post_salesman_email_send(data).then(res => {
	  		if (res.code === this.SUCCESS_CODE) {
	  				this.is_popup = false
	  			  this.$dialog.alert({
	  			    message: res.msg
	  			  })
	  		} else {
	  			this.$toast.fail(res.msg)
	  		}
	  	})
	  	
	  },
		test(){
			 
			 this.$app.openApp({
			                  androidPkg : 'android.intent.action.VIEW',
			                  mimeType : 'text/html',
			                  uri : web_h5+'/chartsSale' }, function(ret, err) { 
			                      var msg = JSON.stringify(ret);
			                     this.$app.alert({
			                            title : 'openApp',
			                            msg : msg,
			                            buttons : ['确定']
			                 });
			          });
                    
		},
		
	  ifweach(){
		  
		    var _this = this;
			 
			
		   _this.show = true;
		 
		   // //判断是否是微信浏览器
		   // var ua = window.navigator.userAgent.toLowerCase();
		   // if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		   //     alert('请在浏览器使用该功能！');
		   // } else {
		      
		   // }
		  
	    },
	  
	  //切换
	  onType(e){
		   this.type_text = this.option1[e-0].text; 
		   this.title = this.option1[e-0].text
		  var table_type = this.table_type;
		  if(table_type == '0'){
		  		    //分佣报表
		  		   this.getOrderReportFunc();
		  }else{
		  		    //广告收益报表
				   this.getTransboundaryFun();
		  }
		 
	  },
	  
	  //下载类型表选项
	  on_dow(e){
		   
		   // this.type_text = this.option3[e-0].text; 
		   var _this = this;
		   _this.dow_type = e;
		  _this.get_statement_download();
		   
		   
		   
		   
		   
	  },
	onQuarter(){
		var table_type = this.table_type;
		
		if(table_type == '0'){
				    //分佣报表
				   this.getOrderReportFunc();
		}else{
				    //广告收益报表
				 this.getTransboundaryFun();
		}
		
	},
	  
    getOrderReportFunc () {
      request.post_salesman_salesmanReport(this.start_time, this.end_time,this.quarter).then(res => {
        if (res.code === this.SUCCESS_CODE) {
			var date_list = res.data.date;
			var money_list = res.data.reportList;
		  this.json_data = res.data.year_data;
          this.money_list = []
          this.merchant_list = []
		  this.date_list = [];
		  
		  	if(this.quarter == 0){
				  // var data = res.data.reportList;
					  for (const key in date_list) {
							this.date_list = date_list;
							  for (const key2 in money_list) {
									  if(date_list[key] == key2){
											this.money_list.push(money_list[key2].money)
											this.merchant_list.push(money_list[key2].nums)
									  }
								  
								  }
					  }
					}else{
					
					 
						for (const key in date_list) {
							for (const key2 in money_list) {
							  if(key == money_list[key2].quar){
								  this.date_list.push(date_list[key])
								this.money_list.push(money_list[key2].money)
								this.merchant_list.push(money_list[key2].nums)
							  }
							  
							  }
						  
						  }
		      }
		  if(this.table_type == '0'){
			   this.openMerchantChartsFunc()
		  }
         
          this.openMoneyChartsFunc()
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
	
	//获取跨界佣金
	getTransboundaryFun(){
		var table_type = this.table_type;
		
		var t =null;
		if(table_type == 1){
				    //跨界收益
				   t = request.post_salesman_kjReport(this.start_time, this.end_time, this.quarter);
		}else if(table_type == 2){
				    //开户收益
				   t = request.post_salesman_openEarnings(this.start_time, this.end_time, this.quarter);
		}else{
				    //广告收益报表
				  t = request.post_salesman_adverEarnings(this.start_time, this.end_time, this.quarter);
		}
		
		
	     t.then(res => {
		  if (res.code === this.SUCCESS_CODE) {
					var date_list = res.data.date;
					var money_list = res.data.reportList;
					
		    this.money_list = []
		    this.merchant_list = []
			this.date_list = [];
			this.date_list = [];
			
				if(this.quarter == 0){
					this.date_list = date_list;
						for (const key in date_list) {
									  for (const key2 in money_list) {
											  if(date_list[key] == key2){
													this.money_list.push(money_list[key2].money)
													
											  }
										  
										  }
						}
				
			}else{
				var art = [];
				for (const key in date_list) {
					
					this.date_list.push(date_list[key])
				  
				  }
				  var i=0;
				  for (const key in  money_list) {
					  
					      art.push(money_list[key].money);
					  
					  }
				
				  
				 this.money_list = art;
			}
			
			
		    this.openMoneyChartsFunc()
		  } else {
		    this.$toast.fail(res.msg)
		  }
		})
	},
 //报表数据 
 get_statement_download(){
	 
	   
	       var dow_type = this.dow_type;//读取类型数据
	      var table_type = this.table_type;//显示图表类型
		
			
		    if(dow_type == 2){
				this.start_time2 = this.$refs["headerChild"].begin_date;
				this.end_time2 = this.$refs["headerChild"].end_date;
				
			}
		   var t = null;
		   
			
	      if(table_type == '0'){
	      		   //分佣
	      		   t = request.post_statement_split_download(this.start_time2, this.end_time2,dow_type);
	      		  	
	      }else if(table_type == '1'){
	      		    //跨界收益报表
	      		 // t = request.post_statement_tran_download(this.start_time2, this.end_time2,dow_type);
				  t = request.post_statement_tran_downlo(this.start_time2, this.end_time2,dow_type);
	      }else if(table_type == '2'){
	      		    //广告收益报表
	      		 t = request.post_statement_open_downlo(this.start_time2, this.end_time2,dow_type);
	      }else{
			   t = request.post_statement_ad_downlo(this.start_time2, this.end_time2,dow_type);
		  }
	      // if(dow_type == 0){
	      // 		    //分佣报表
	      // 	this.get_statement_download();
	      // }
	 
	   
		
	 
		 t.then(res => {
		  if (res.code === this.SUCCESS_CODE) {
			  
			         if(this.dow_type == 1){
						 
						   this.json_data2 = res.data ;
						   
					 }else{
						 let arr = []
						  for(let i in res.data){
						       arr.push(res.data[i])
						    }
						  this.json_data = arr;
					 }
				 
				  
				   if(this.table_type == "0"){
					   var json_fields = {
					               '日期': 'day',
					               '分享佣金': 'money',
					               '分享人数': 'nums',
					           };
						this.json_fields = json_fields;
				   }else{
					   var json_fields = {
					               '日期': 'day',
					               '金额': 'money',
					           };
					this.json_fields = json_fields;
				   }
				   		
				}
									
			})
	 
	 
 },
    openMerchantChartsFunc () {
      let date_list = this.date_list
      let merchant_list = this.merchant_list
      let myChart = this.$echarts.init(document.getElementById('merchant_chart'))
      var option = {
        title: {
          left: 'center',
          text: '分佣商家数'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '23%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: date_list
        },
        yAxis: {
          type: 'value',
		  minInterval:1
        },
        series: [{
          data: merchant_list,
          type: 'line',
          areaStyle: {normal: {}},
          smooth: true,
          lineStyle: {
            color: '#0099FF'
          },
          areaStyle: {
            color: theme_color
          },
          label: {
            normal: {
              color: theme_color,
              show: true,
              position: 'top'
            }
          }
        }]
      }
      myChart.setOption(option)
    },
    openMoneyChartsFunc () {
      let date_list = this.date_list
      let money_list = this.money_list
      let myChart = this.$echarts.init(document.getElementById('money_chart'))
      var option = {
        title: {
          left: 'center',
          text: this.type_text
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '23%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: date_list
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: money_list,
          type: 'line',
          areaStyle: {normal: {}},
          smooth: true,
          lineStyle: {
            color: theme_color
          },
          areaStyle: {
            color: theme_color
          },
          label: {
            normal: {
              color: theme_color,
              show: true,
              position: 'top'
            }
          }
        }]
      }
      myChart.setOption(option)
    },
    beginSearchHandler (data) {
      this.start_time = data.begin
      this.end_time = data.end
	  this.time = data.begin+'-'+data.end
      // this.getOrderReportFunc()
	  var table_type = this.table_type;
	  if(table_type == 0){
	  		    //分佣报表
	  		   this.getOrderReportFunc();
	  }else if(table_type == 1){
	  		    //跨界收益报表
	  		 this.getTransboundaryFun();
	  } else if(table_type == 2){
	  		     //开户收益报表
	  		this.getOrderReportFunc();
	  }else{
	  		    //广告收益报表
	  		 this.getOrderReportFunc();
	  }
    },
	beginSearchHandler2 (data) {
		if(data !=undefined){
			
			this.start_time2 = data.begin
			this.end_time2 = data.end
			this.get_statement_download();
		}
	
	},
	
  }
}
</script>
<style>
	* { touch-action: pan-y; }
	.excel-dow{padding: 10px;}
	.excel-box{width: 100%;margin-top: 0.7rem;font-size: 0.4rem;color: #999;}
	.excel-text{padding: 20px 0px;color: green;}
	.text{font-size: 0.2rem;}
</style>