
<template>
  <div id="setUp" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="set_content">
      <div class="content_item" @click="changeWechat">
        <span class="item_left">微信账号</span>
        <div class="item_right">
          <i class="right_text" v-if="openid === ''">
            绑定
          </i>
          <i class="right_text" v-if="openid !== ''">
            解绑
          </i>
          <img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
        </div>
      </div>

      <div class="content_item" @click="goToBindPhone">
        <span class="item_left">手机账号</span>
        <div class="item_right">
          <i class="right_text" v-show="!user_info.mobile">
            未绑定
          </i>
          <i class="right_text" v-show="user_info.mobile">
            {{user_info.mobile}}
          </i>
          <img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
        </div>
      </div>

      <div class="content_item" @click="jumpTo('/setPass')">
        <span class="item_left">登录密码</span>
        <div class="item_right">
          <i class="right_text">
            修改
          </i>
          <img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
        </div>
      </div>
    </div>
    <div class="set_content">
      <div class="content_item" @click="jumpTo('/voiceVroad')">
        <span class="item_left">推送通知</span>
        <div class="item_right">
          <i class="right_text">
            开启
          </i>
          <img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
        </div>
      </div>
    </div>
    <div class="set_loginout">
      <a href="javascript:;" class="submitBtn" @click="logout">退出账号</a>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/navBar'
import * as request from '@/api'
import { mapGetters, mapMutations } from 'vuex'
import { app_id } from '@/config'
const axios = require('axios');
export default {
  components: {
    NavBar
  },
  data () {
    return {
      val: '',
      versions: '',
      unionid: '',
      wx: null,
      nickname: '',
      meta: this.$route.meta,
	  id:'',
    }
  },
  computed: {
    openid () {
      return this.user_info.openid ? this.user_info.openid : ''
    },
    ...mapGetters(['user_info', 'user_token','is_web_type'])
  },
  created () {
	  this.id = this.user_info.id
    if (!this.user_token) {
      this.noPastTo('/login')
    }
	this.get_user_data();
  },
  mounted () {
  },
  methods: {
    changeWechat () {
      let message = ''
      if (this.openid === '') {
        message = '确认绑定微信？'
      } else {
        message = '确认解绑微信？'
      }
      this.$dialog.confirm({
        message: message
      }).then(() => {
        // on confirm
		//判断是否是app还是h5环境
		 var type_web = this.is_web_type;
		  if(type_web == "H5"){
					//当前环境是h5
				 this.getinfo_h5(this.id);	
		  }else{
			  //当前环境是app
			    this.changeWechatCallBack()
		  }
      }).catch(() => {
        // on canccel
      })
    },
	getinfo_h5(id){
		
		//判断openid 是否存在
		if (this.openid === '') {
		var _this = this;
		var url = 'setUp';
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
		 }else{	
				// 解绑
				request.post_profile_unbind_wechat().then(res => {
				  if (res.code === this.SUCCESS_CODE) {
				    this.$toast.success(res.msg)
				    let data = this.user_info
				    data.openid = ''
				    this.set_user_info(data)
				  } else {
				    this.$toast.fail(res.msg)
				  }
				})
		 }
	   
	},
   getinfo_h52(url){
	    
	   window.location.href = url;
   },
  get_user_data(){
	  var _this = this;
	   //请求后端
	   request.post_info_user(_this.id).then(res => {
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
    changeWechatCallBack () {
      if (this.openid === '') {
        // 绑定
        this.wx = this.$app.require('wx')
        this.wx.isInstalled((ret, err) => {
          if (ret.installed) {
            this.wxLogin()
          } else {
            this.$toast.fail('当前设备未安装微信客户端')
          }
        })
      } else {
        // 解绑
        request.post_profile_unbind_wechat().then(res => {
          if (res.code === this.SUCCESS_CODE) {
            this.$toast.success(res.msg)
            let data = this.user_info
            data.openid = ''
            this.set_user_info(data)
          } else {
            this.$toast.fail(res.msg)
          }
        })
      }
    },
    // 微信登录
    wxLogin () {
      this.showProgress('加载中')
      this.timer = setTimeout(() => {
        this.hideProgress()
      }, 5000)
      let _this = this
		// _this.wx.auth({
		// 	apiKey: app_id
		// }, function(ret, err) {
		// 	if (ret.status) {
		// 		alert(JSON.stringify(ret));
		// 	} else {
		// 		alert(err.code);
		// 	}
		// });
      _this.wx.auth(function(ret, err) {
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
    // 去绑定手机
    goToBindPhone () {
      if (this.user_info.mobile) {
        this.jumpTo('/changePhone')
      } else {
        this.jumpTo('/bindPhone')
      }
    },
    logout () {
      this.$dialog.confirm({
        message: '确定退出登录吗？'
      }).then(() => {
        this.set_user_logout()
        this.noPastTo('/')
      }).catch(() => {
        // on cancel
      })
    },
    ...mapMutations({
      set_user_logout: 'SET_USER_LOGOUT',
      set_user_info: 'UPDATE_USER_INFO'
    })
  }
}
</script>

<style scoped>

</style>
