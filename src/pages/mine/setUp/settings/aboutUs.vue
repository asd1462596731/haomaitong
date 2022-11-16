<template>
  <div id="aboutUs" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div id="aboutDom" v-html="aboutUsData.description" style="padding: .266667rem;"></div>
  </div>
</template>

<script>
import NavBar from '@/components/navBar'
import * as request from '@/api'
import { mapGetters} from 'vuex'
import { getUrlParam } from '@/util/GetUrlParam';
export default {
  components: {
    NavBar
  },
  computed: {
	  ...mapGetters(['is_code'])
  },
  data () {
    return {
      aboutUsData: {},
      meta: this.$route.meta
    }
  },
  created () {
	      let id = getUrlParam("id"); //读取携带分享用户的参数
	   if(id == undefined || id == '' || id == null){
		   id = 1;
	   }else{
		   var numReg = /^[0-9]*$/
		   var numRe = new RegExp(id)
		   if (!numRe.test(numRe)) {
			   this.$toast.fail("参数错误")
			   return false
		   }
	   }
    this.getDataInfo(id)
	
  },
  methods: {
    getDataInfo (id) {
      request.get_profile_single(id,this.is_code).then(res => {
        if (res.code === this.SUCCESS_CODE) {
			this.$route.meta.title = res.data.detail.title
          this.aboutUsData = res.data.detail
		 
        } else {
          this.$toast.fail(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
