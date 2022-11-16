<template>
  <div id="index_shoper" class="home_box" :style="`top: ${head_rem}rem;`">
    <div class="home_container">
      <!-- <div class="shoper_qrcode">
        <img v-if="user_info.desk" :src="user_info.desk.qrcode" alt="">
      </div> -->
      <HomeNav :nav-list="nav_list" />
	  <HomeLink :link-list="link_list" />
      <HomeBanner style="margin-top: .266667rem;" />
    </div>
    <HomeBottom />
  </div>
</template>
<script>
import HomeNav from '../compontents/home_nav'
import HomeLink from '../compontents/home_link'
import HomeBanner from '../compontents/home_banner'
import HomeBottom from '../compontents/home_bottom'
import { shoper_nav_list } from '@/config'
import { shoper_link_list } from '@/config'
import { mapGetters } from 'vuex'
export default {
  components: {
    HomeNav,
	HomeLink,
    HomeBanner,
    HomeBottom
  },
  data () {
    return {
      nav_list: shoper_nav_list,
	  link_list: shoper_link_list
    }
  },
  created() {
  	console.log(this.user_info)
  },
  computed: {
    ...mapGetters(['user_info'])
  }
}
</script>