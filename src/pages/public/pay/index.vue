<template>
  <div id="withdraw" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="withdraw_title">充值金额</div>
    <div class="withdraw_form">
      <div class="input_box">
        <van-field
          v-model="money"
          placeholder="请输入金额" 
		  :change="handleChange()">
>
        </van-field>
      </div>
      <div class="input_desc">
        当前账户余额:{{totalMoney}}元
      </div>
    </div>
    <div class="withdraw_button">
      <!-- <a href="javascript:;" class="sure_button" :class="{'disable':isCanSubmit}" @click="withDrawHandler">确    定</a> -->
	  <van-button :disabled="isCanSubmit" type="info" @click="withDrawHandler" block>确    定</van-button>
    </div>
    <!-- <div class="withdraw_info">
      <p>温馨提示：</p>
      <p>1.每日只能提现1次；</p>
      <p>2.每次提现金额最低1元 </p>
    </div> -->
  </div>
</template>
<script>
import NavBar from '@/components/navBar'
import * as request from '@/api'
import { mapGetters, mapMutations } from 'vuex'
import Wx from "weixin-jsapi"
export default {
  components: {
    NavBar
  },
  data () {
    return {
      meta: this.$route.meta,
      money: '',
      totalMoney: 0,
	  isCanSubmit: true,
      wx: null,
      timer: null
    }
  },
  computed: {
    
    ...mapGetters(['user_info','user_token','is_web_type'])
  },
  created () {
	  if (!this.user_token) {
	    this.noPastTo('/login')
	  }
    this.$nextTick(() => {
      this.totalMoney = this.user_info.balance
    })
	this.get_user_data();
  },
  methods: {
    allMoneyHandler () {
      this.money = this.totalMoney
    },
    withDrawHandler () {
      if (this.user_info.openid === '') {
        this.$dialog.alert({
          message: '请先绑定微信'
        }).then(() => {
          // this.wxLogin()
		  //判断是否是app还是h5环境
		   var type_web = this.is_web_type;
		    if(type_web == "H5"){
		  			//当前环境是h5
		  		 this.getinfo_h5(this.user_info.id);	
		    }else{
		  	  //当前环境是app
		  	    this.wxLogin()
		    }
        })
        return false
      }
	  //
	  if(this.money =='' || this.money == null){
		  this.$toast.fail("请输入要充值的金额");
		  return false;
	  }
     
      request.post_user_recharge(this.money,'wechat',this.is_web_type).then(res => {
        if (res.code === this.SUCCESS_CODE) {
				
				if(this.is_web_type == "H5"){
						//h5
						this.wx_beginPay(res.data)
						
					}else{
						// app
						 this.beginPay(res.data)
					}
			
		  
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
	// 开始支付
	beginPay (res) {
	  this.wxPay = this.$app.require('wxPay')
	  let _this = this
	  this.wxPay.payOrder({
	    apiKey: res.appid,
	    orderId: res.prepayid,
	    mchId: res.partnerid,
	    nonceStr: res.noncestr,
	    timeStamp: res.timestamp,
	    sign: res.sign
	  }, function (ret, err) {
	    if (ret.status) {
	      _this.$toast.success('充值成功')
	      _this.set_select_goods([])
	      _this.set_goods_list([])
	      // 支付成功
	      setTimeout(() => {
	        _this.noPastTo('/payDetail')
	      }, 1000)
	    } else {
	      if (err.code == -2) {
	        _this.$toast.fail('充值取消')
	      }
	      if (err.code == -1) {
	        _this.$toast.fail('充值失败，请稍后重试')
	      }
	      if (err.code == 1) {
	        _this.$toast.fail('apiKey值非法')
	      }
	    }
	  })
	},
	
	//h5支付
	//微信提交方法  pay后台返回支付所需数据
	wx_beginPay(res){
		let _this = this
	    var ua = navigator.userAgent.toLowerCase();			//判断是否是微信浏览器
	    var isWeixin = ua.indexOf('micromessenger') != -1;	//判断是否
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
	            timestamp: res.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
	            nonceStr: res.nonceStr, // 支付签名随机串，不长于 32 位
	            package: res.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
	            signType: res.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
	            paySign: res.paySign, // 支付签名
	            success: function(res) {
	              _this.$toast.success('充值成功')
				  _this.get_user_data();
				  // 支付成功
				  setTimeout(() => {
				    _this.noPastTo('/payDetail')
				  }, 1000)
	            },
	            cancel: function(res) {
	                 _this.$toast.fail('充值取消')
	            }
	        });
	    });
	},
	getinfo_h5(id){
		
		var _this = this;
		var url = 'pay';
		 //请求后端
		 request.post_info_wechat(id,url).then(res => {
		   if (res.code === this.SUCCESS_CODE) {
			     
				  //
			     // window.location.href = res.data
				 _this.getinfo_h52(res.data);
				 //将返回地址只想获取
				 
		         // this.$toast.fail(res.msg)
		   } 
		 })
	},
	getinfo_h52(url){
		    
		   window.location.href = url;
	},
    // 微信登录
    wxLogin () {
      this.showProgress('加载中')
      this.timer = setTimeout(() => {
        this.hideProgress()
      }, 5000)
      let _this = this
      this.wx = this.$app.require('wx')
      this.wx.auth((ret, err) => {
        if (!ret) {
          _this.hideProgress()
        }
        if (ret.status) {
          let code = ret.code
          _this.getWxToken(code)
        } else {
          _this.hideProgress()
          if (err.code == 1) {
            _this.$toast.fail('微信授权取消')
          }
          if (err.code == 2) {
            _this.$toast.fail('微信授权拒绝')
          }
          if (err.code == 3) {
            _this.$toast.fail('当前设备未安装微信')
          }
          if (err.code == -1) {
            _this.$toast.fail('发生未知错误')
          }
        }
      })
    },
	get_user_data(){
		  var _this = this;
		   //请求后端
		   request.post_info_user(_this.user_info.id).then(res => {
		     if (res.code === this.SUCCESS_CODE) {
					if(res.data.openid !=null){
						// this.openid  = res.data.openid
						// data.openid = openid
						// this.set_user_info(data)
						let data = this.user_info
						data.openid = res.data.openid
						this.set_user_info(data)
					}
		     } 
		   })
	},
    getWxToken (code) {
      let _this = this
      this.wx.getToken({
        code: code
      }, (ret, err) => {
        if (!ret) {
          _this.hideProgress()
        }
        if (ret.status) {
          let accessToken = ret.accessToken
          let openId = ret.openId
          this.openid = openId
          _this.getWxUserInfo(accessToken, openId)
          // _this.wxLoginCallBack(openId)
        } else {
          _this.hideProgress()
          if (err.code == 1) {
            _this.$toast.fail('apiKey值为空或非法')
          }
          if (err.code == 2) {
            _this.$toast.fail('apiSecret值为空或非法')
          }
          if (err.code == 3) {
            _this.$toast.fail('code值为空或非法')
          }
          if (err.code == 4) {
            _this.$toast.fail('网络超时，请稍后重试')
          }
          if (err.code == -1) {
            _this.showMsgError('发生未知错误')
          }
        }
      })
    },
	      handleChange(e) {
	         // 定义整数部位最大输入长度
	         let length = 6;
	         // 数值中转
	         let temp = this.money;
			 if(temp == null){
				  this.isCanSubmit = true;
			     return false;
			 }
	         //  限制首位输入00000多个零的情况
	         if (temp === "0" || temp === "00") {
	            return (temp = "0");
	         }
	        //  正则限制 3.. 以及 3.3.3的情况
	         temp = temp
	            .replace(/[^0-9.]|^\.|\.{2,}/g, "")
	            .replace(".", "$#$")
	            .replace(/\./g, "")
	            .replace("$#$", ".");
	         const point = temp.split(".");
	         let decimals; // 整数部分
	         let positiveInteger; // 小数部分
	         // 先处理整数部分
	         if (point[0]) {
	            decimals =
	               point[0].length > length ? point[0].slice(0, length) : point[0];
	         }
	         //  处理小数部分
	         if (temp.includes(".")) {
	            positiveInteger =
	               point[1].length > 2 ? point[1].slice(0, 2) : point[1];
	            temp = positiveInteger
	               ? `${decimals}.${positiveInteger}`
	               : `${decimals}.`;
	         } else {
	            temp = decimals;
	         }
	         this.money = temp;
			  this.isCanSubmit = false;
			
	      },
    getWxUserInfo (accessToken, openId) {
      let _this = this
      this.wx.getUserInfo({
        accessToken: accessToken,
        openId: openId
      }, (ret, err) => {
        if (!ret) {
          _this.hideProgress()
        }
        if (ret.status) {
          _this.openid = ret.openid
          _this.nickname = ret.nickname
          _this.wxLoginCallBack()
        } else {
          _this.hideProgress()
          if (err.code == 1) {
            _this.showMsgError('accessToken过期')
          }
          if (err.code == 2) {
            _this.showMsgError('openId非法')
          }
          if (err.code == 3) {
            _this.showMsgError('openId值为空')
          }
          if (err.code == 4) {
            _this.showMsgError('accessToken值为空')
          }
          if (err.code == 5) {
            _this.showMsgError('accessToken非法')
          }
          if (err.code == 6) {
            _this.showMsgError('网络超时，请稍后重试')
          }
          if (err.code == -1) {
            _this.showMsgError('发生未知错误')
          }
        }
      })
    },
    wxLoginCallBack () {
      request.post_profile_bind_wechat(this.openid, this.nickname).then(res => {
        this.hideProgress()
        if (res.code === this.SUCCESS_CODE) {
          this.$toast.success(res.msg)
          let data = this.user_info
          data.openid = openid
          this.set_user_info(data)
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    ...mapMutations({
      set_user_info: 'UPDATE_USER_INFO'
    })
  }
}
</script>