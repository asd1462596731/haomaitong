<template>
  <div id="aboutUs" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div id="aboutDom" v-html="aboutUsData" style="padding: .266667rem;"></div>
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
  computed: {
	  ...mapGetters(['is_code','user_info'])
  },
  data () {
    return {
      aboutUsData: '',
      meta: this.$route.meta
    }
  },
  created () {
    this.getDataInfo()
  },
  methods: {
    getDataInfo () {
		request.getIdentity(this.user_info.level).then(res => {
			if(res.code === 0){
				 this.aboutUsData = res.data.des
				// this.$toast(res.data.des);
			}
		})
      // request.get_profile_single(1,this.is_code).then(res => {
      //   if (res.code === this.SUCCESS_CODE) {
      //     this.aboutUsData = res.data.detail
      //   } else {
      //     this.$toast.fail(res.msg)
      //   }
      // })
    }
  }
}
</script>

<style scoped>

</style>
