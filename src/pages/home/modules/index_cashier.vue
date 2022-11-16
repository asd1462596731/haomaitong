<template>
  <div id="index_cashier" class="home_box" :style="`top: ${head_rem}rem;`">
    <div class="home_container">
     <!-- <div class="cashier_qrcode">
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
import { cashier_nav_list,cashier_link_list } from '@/config'
import { mapGetters } from 'vuex'
export default {
  components: {
    HomeNav,
    HomeBanner,
	HomeLink,
    HomeBottom
  },
  data () {
    return {
      nav_list: cashier_nav_list,
	  link_list:cashier_link_list
    }
  },
  computed: {
    ...mapGetters(['user_info'])
  }
}
</script>