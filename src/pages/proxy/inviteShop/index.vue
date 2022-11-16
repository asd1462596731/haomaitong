<template>
  <div id="inviteShop" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="cotnent" id="cotnent">
      <img :src="site_config.poster_img" class="content_bg" alt="">
      <div class="content_icon">
        <img src="@/assets/img/proxy/proxy_icon7.png" alt="">
      </div>
      <div class="content_container">
		     <div class="box">
				 
					<div class="container_title">
					  <img src="@/assets/img/proxy/proxy_icon6.png" class="title_left_icon" alt="">
					  <span>{{site_config.poster_title}}</span>
					  <img src="@/assets/img/proxy/proxy_icon5.png" class="title_right_icon" alt="">
					</div>
					<ul class="container_list">
					  <li>
						
						<span style="line-height: 0.5rem;" v-html="site_config.poster_info">
						</span>
					  </li>
					 
					</ul>
					<div class="container_qrcode">
					  <img :src="invite_qrcodek" alt="">
					</div>
					<div class="container_button" data-html2canvas-ignore="true">
										 <!-- <a href="javascript:;" class="theme_border" v-if="is_web_type == 'H5'">长按保存{{dataImg}}</a> -->
					  <a href="javascript:;" class="theme_border" @click="saveImageHandler">点击生成海报</a>
					</div>
				</div>
				 
      </div>
    </div>
	
	<van-overlay :show="show" :z-index='100'>
	  <div class="wrapper">
	   <!-- <div class="block" /> -->
	   <img style="width:100%;height:100%;" :src="dataImg" v-if="dataImg" alt @touchstart="touchStart()" @touchend="touchEnd()">
	  <!-- <div class="container_button">
	     <a href="javascript:;" class="theme_border" @click="saveImageHandler">{{text}}</a>
	   </div> -->
	  
	  </div>
	  <div class="img_but" @click="stop">
	 
		  <div class="container_button" style="margin-top: -10px;">
		     <a href="javascript:;" style="background-color: #fff;" v-if="dataImg"  class="theme_border" @click="saveImageHandler">{{text}}</a>
		   </div>
		   <!-- <a href="javascript:;" class="theme_border" @click="saveImageHandler">{{text}}</a> -->
		 <!--<div class="img-box" @click="fenxiang">
			  <img src="@/assets/img/public/weixin.png" style="width: 50px;height: 50px;" alt="">
			  <p style="margin-top: 10px;color: #fff;">微信分享</p>
		  </div>
			
			<div class="img-box" @click="downloadCodeImg">
						  <img src="@/assets/img/public/dow.png" style="width: 50px;height: 50px;" alt="">
						  <p style="margin-top: 10px;color: #fff;">海报下载</p>
			</div>
			<div style="clear: both;"></div>
			 -->
	  </div>
	</van-overlay>
	
	<div>
		
	</div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import NavBar from '@/components/navBar'
import * as request from '@/api'
import { mapGetters, mapMutations } from 'vuex'
import { getPermissionFunc } from '@/util'


export default {
  data () {
    return {
      meta: this.$route.meta,
	  invite_qrcodek:'',
      show:false,
	  showDom: true,
	  dataImg:'',
	  but_show:true,
	  text:"保存相册"
	 
    }
  },
  components: {
    NavBar
  },
  computed: {
    invite_qrcode () {
      return this.user_info.invite_qrcode
    },
	is_web_type () {
	  return this.is_web_type
	},
    ...mapGetters(['user_info','is_web_type','site_config'])
  },
  created () {
	  
	 this.getRate();
	 
	  
	  this.user_pro();
	  if(this.is_web_type == "H5"){
	  		this.text = "点击生成海报"
	  }else{
		  this.text = "保存相册"
	}
  },
  methods: {
	    stop(){
			this.show = false
		},
		  touchEnd(){
			  //手指离开
			  clearTimeout(this.Loop);
		  },
		  touchStart(){
			  //手指触摸
			  clearTimeout(this.Loop); //再次清空定时器，防止重复注册定时器
			  this.Loop = setTimeout(() => {
				  // console.log(1222)
				  this.downImg()
			  },1000)
		  },
		   // 下载
		  downImg() {
			  if(!window.plus) return;
				  plus.gallery.save(this.dataImg, function () {
					  console.log('保存成功');
				  },function(){
					  console.log('保存失败');
			  });
		  },
   
    saveImageHandler () {
		
		// this.but_show = false
		
		// if (this.$app.systemType == 'ios') {
		// 			this.savecanvas()
		// 			return false
		// }
		// getPermissionFunc(this, 'storage', '储存').then(() => {
		// 			this.savecanvas()
		// })
      // this.savecanvas()
	  if(this.is_web_type == "H5"){
	  		this.savek();
	  }else{	
		  if (this.$app.systemType == 'ios') {
			this.savecanvas()
			return false
		  }
		  getPermissionFunc(this, 'storage', '储存').then(() => {
			this.savecanvas()
		  })
	  }
    },
	getRate(){
		request.post_get_rate(this.user_info.id).then(res => {
			
		  if (res.code === this.SUCCESS_CODE) {
					     
					var status = res.data.status;
					if(status == 0){
						this.$toast.fail("代理商费率未设置，请联系管理员！");
						this.jumpTo('/')
					}
								
		     }
		})
	},
	//读取个人推广二维码
	user_pro(){
		
		request.post_user_pro(this.user_info.invite_code).then(res => {
			
		  if (res.code === this.SUCCESS_CODE) {
					     
						this.invite_qrcodek = res.data;
								
		     }
		})
		
	},
    savecanvas () {
      this.showProgress('保存中')
      let canvas = document.getElementById('cotnent')
      let _this = this
      html2canvas(canvas, {
        scale: 2,
        logging: false,
        useCORS: true
      }).then(function (canvas) {
        let rnd = ''
        for (let i = 0; i < 20; i++) {
          rnd += Math.floor(Math.random() * 10)
        }
        let type = 'png'
        let filename = rnd + '.' + type
        let imgData = canvas.toDataURL(type)
        imgData = imgData.replace('data:image/png;base64,', '')
        _this.saveFile(imgData, filename)
      })
    },
    saveFile (data, filename) {
      this.trans = this.$app.require('trans')
      let _this = this
      this.trans.saveImage({
        base64Str: data,
        album: true,
        imgPath: 'fs://img/',
        imgName: filename
      }, function (ret, err) {
        _this.hideProgress()
        if (ret.status) {
          _this.$toast.success('保存成功')
        } else {
          _this.$toast.fail(`保存失败：${err.msg}`)
        }
      })
    },
	savek() {
		        let _this = this
			   // _this.$toast.success('海报生成成功,请长按保存')
			   _this.show = true
				    let canvas = document.getElementById('cotnent')
				  
				    html2canvas(canvas, {
				      scale: 2,
				      logging: false,
				      useCORS: true
				    }).then(function (canvas) {
						 _this.dataImg = canvas.toDataURL("image/jpeg");
						 _this.showDom = false;
						 _this.text = "长按海报分享或保存"
				      // let rnd = ''
				      // for (let i = 0; i < 20; i++) {
				      //   rnd += Math.floor(Math.random() * 10)
				      // }
				      // let type = 'png'
				      // let filename = rnd + '.' + type
				   //    let imgData = canvas.toDataURL(type)
					  
					  // var link= document.createElement("a");
					  //         //将生成的图片url赋值给a标签的href属性
							// _this.imgk = link;
							// return false;
					  //         link.href = imgData; 
							  
					  //         //设置下载的文件名
					  //         link.download = "商家推广码";
					  //         // 将a标签插入dom中
					  //         document.body.appendChild(link);
					  //         //模拟点击事件触发下载
					  //         link.click();
					  //         // 完成之后销毁创建的a标签
					  //         document.body.removeChild(link);
					  
				      // console.log(imgData)
				      // imgData = imgData.replace('data:image/png;base64,', '')
					   // img.src=tempSrc;  
				      // _this.saveFile(imgData, filename)
					  // console.log( imgData)
				    })
				},
				//点击分享
		    fenxiang(){
				console.log(this.$wxt)
				request.post_comm_share().then(res => {
					var url = this.site_config.domain+'/h5/#/register/?invite_code='+this.user_info.invite_code
					
				  if (res.code === this.SUCCESS_CODE) {
							    
								 this.$wxt.config({
								       debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
								       appId: res.data.appID, // 必填，公众号的唯一标识
								       timestamp: res.data.timestamp, // 必填，生成签名的时间戳
								       nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
								       signature: res.data.signature, // 必填，签名
								       jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表
								     })
								     this.$wxt.scanQRCode({
								       needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
								       scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
								       success: function (res) {
								         var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
								       }
								     });
								    
								 
										
				     }
				})
			},
			downloadCodeImg() {
				
			        var image = new Image();
			        image.setAttribute("crossOrigin", "anonymous");
			        var _this = this;
			        image.onload = function () {
			          var canvas = document.createElement("canvas");
			          canvas.width = image.width;
			          canvas.height = image.height;
			          var context = canvas.getContext("2d");
			          context.drawImage(image, 0, 0, image.width, image.height);
			          var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
			          var a = document.createElement("a"); // 生成一个a元素
			          var event = new MouseEvent("click"); // 创建一个单击事件
			          a.download = _this.projectName || "photo"; // 设置图片名称
			          a.href = url; // 将生成的URL设置为a.href属性
			          a.dispatchEvent(event); // 触发a的单击事件
			        };
			        image.src = this.dataImg;
			      }
  }
}
</script>

<style lang="less" scoped>
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 55%;
	width: 60%;
	margin: 0 auto;
	margin-top: 70px;
  }
.img_but{width: 60%;margin: 0 auto;margin-top: 50px;}
.my-icon{text-align: center;}
.van-icon__image{margin-bottom: 0.31333rem;}
.img-box{width: 50%;text-align: center;float: left;}
// .page_container{
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: auto;
//   box-sizing: border-box;
//   overflow-x: hidden;
//   overflow-y: auto;
// }
</style>
