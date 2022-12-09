<template>
  <div id="root">
	  <!-- <title>XXX后台管理</title> -->
    <transition :name="transitionName" >
      <router-view  />
    </transition>
    <Foot v-show="$route.name === 'home' || $route.name === 'bill' || $route.name === 'mine'" />
	<!-- <audio id="resource" ref="up" src="" controls @ended="ended"></audio> -->
	<audio controls="controls"  autoplay  ref="up" @ended="ended" v-show="false">
	  <source :src="audioSrc" type="audio/ogg">
	</audio>
  </div>
</template>
<script>
// 头部
import Foot from '@/components/foot'
import { mapGetters, mapMutations } from 'vuex'
import { getUrlParam } from '@/util/GetUrlParam';
import * as request from '@/api'
export default {
  components: {
    Foot
  },
  data () {
    return {
		
		is_sta:true,
		audioSrc:''
    }
  },
  computed: {
    transitionName () {
      if (this.$route.name === 'home' || this.$route.name === 'bill' || this.$route.name === 'mine') {
        return ''
      } else {
        return 'vux-pop-' + (this.direction === 'forward' ? 'in' : 'out')
      }
    },
    ...mapGetters([
      'direction',
	  'user_token',
	  'user_info'
    ])
  },
    mounted(){
		//播报
		
			setInterval(this.getaudio,5000)
		  
	},
  created () {
    this.$nextTick(() => {
    })
	let codet = getUrlParam("code"); //读取携带分享用户的参数
	this.is_code = codet;
	 if(codet){
		 localStorage.setItem("is_code",this.is_code);//保存数据
	 }
	 var tcode = localStorage.getItem("is_code");//读取数据
	 this.is_code = tcode
	  this.set_is_code(tcode)
	  this.getSiteConfig()
	  // var music = document.getElementById("resource");
	  //  //判断如果音乐停止播放中，就让他播放。。。
	  //  music.play();
	
  },
   methods: {
		getaudio(){
			// console.log(this.user_token)
			var _this = this
			if(_this.is_sta){
			var date = new Date();
			var hours = date.getHours();
			
			if(_this.user_token && (_this.user_info.notice_open == 1) && ((_this.user_info.notice_start <= parseInt(hours)) && (_this.user_info.notice_end >= parseInt(hours)))){
				//已登录不执行播报
			
					request.post_audio().then((res) => {
						    if(res.code ==0){
								_this.is_sta = false
								_this.audioSrc = res.data
								  _this.$refs.up.src = res.data
								// var dom = _this.$refs.up
								// dom.play()
								 _this.$refs.up.play()
							}else{
								_this.is_sta = true
							}
						  
							
						})
				
			}
			  
			}
		},
		ended(){
			//播放结束
			this.is_sta = true
		},
	   getSiteConfig() {
	   	request.post_site_config(this.is_code).then((res) => {
	   		if (res.code === this.SUCCESS_CODE) {
				document.title = res.data.sitename ? res.data.sitename : "麦管嘉";
	   			this.set_site_config(res.data);
	   		} else {
	   			this.$toast.fail(res.msg);
	   		}
	   	});
	   },
  ...mapMutations({
    set_is_code: 'SET_IS_CODE',
	set_site_config:'SET_SITE_CONFIG',
  })
  }
}
</script>
<style lang="less">
  @import './assets/less/root.less';
  .vux-pop-out-enter-active,
  .vux-pop-out-leave-active,
  .vux-pop-in-enter-active,
  .vux-pop-in-leave-active {
    will-change: transform;
    transition: all .35s;
    height: 100%;
    top: 0;
    position: absolute;
    backface-visibility: hidden;
    perspective: 1000;
  }

  .vux-pop-out-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  .vux-pop-out-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .vux-pop-in-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .vux-pop-in-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  b{font-weight: bold;}
</style>
