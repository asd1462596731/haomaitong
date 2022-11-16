<template>
  <div id="teamManage" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="manage_form">
      <div class="form_item padding alginRight">
        <div class="input_box">
          <span>微&#x3000;信</span>
          <van-field :value="`${info.wechat || 0}‰`" :readonly="readonly" />
          <img src="@/assets/img/public/public_icon2.png" alt="">
        </div>
      </div>
      <div class="form_item padding alginRight">
        <div class="input_box">
          <span>支付宝</span>
          <van-field :value="`${info.alipay || 0}‰`" :readonly="readonly" />
          <img src="@/assets/img/public/public_icon2.png" alt="">
        </div>
      </div>
      <div class="form_item padding alginRight">
        <div class="input_box">
          <span>银&#x3000;联(<1000)</span>
          <van-field :value="`${info.unionpay || 0}‰`" :readonly="readonly" />
          <img src="@/assets/img/public/public_icon2.png" alt="">
        </div>
      </div>
   <div class="form_item padding alginRight">
        <div class="input_box">
          <span>银&#x3000;联(>1000)</span>
          <van-field :value="`${info.unionpay2 || 0}‰`" :readonly="readonly" />
          <img src="@/assets/img/public/public_icon2.png" alt="">
        </div>
      </div>
      <div class="manage_button">
        <a href="javascript:;" class="sure_button" @click="submit">确  定</a>
      </div>
    </div>
  </div>
</template>
<script>
import NavBar from '@/components/navBar'
import * as request from '@/api'
import { mapGetters} from 'vuex'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      uid: null,
      meta: this.$route.meta,
      readonly: true,
      roleSelectShow: false,
      rateSelectShow: false,
      rate_alipay: [],
      rate_unionpay: [],
      rate_wechat: [],
      set_rate_type: 'wechat',
      rate_list: [],
      info: {
        alipay: '',
        unionpay_big: '',
        unionpay_small: '',
        wechat: ''
      }
    }
  },
  computed: {
	    ...mapGetters(['user_info','is_web_type'])
  },
  created () {
	   this.getRate();
    this.getMyRateFunc()
  },
  methods: {
    getMyRateFunc () {
      request.get_salesman_myrate().then(res => {
        if (res.code === this.SUCCESS_CODE) {
		var default_rate  = res.data.default_rate
		var myrate = res.data.myrate
		
		 myrate !=null || myrate != '' ?  this.info = myrate : this.info = default_rate
		
    //       this.info = res.data.default_rate // myrate
		    
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    submit () {
      this.goBack()
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
  }
}
</script>
