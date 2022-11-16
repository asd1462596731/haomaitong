<template>
  <div id="index_master" class="home_box" :style="`top: ${head_rem}rem;`">
    <div class="home_container">
      <HomeNav :nav-list="nav_list" />
	  <HomeNavMaster :nav-list = "nav_master_list" />
      <HomeLink :link-list="link_list" />
      <HomeBanner />
    </div>
    <HomeBottom />
  </div>
</template>
<script>
import HomeNav from '../compontents/home_nav'
import HomeNavMaster from '../compontents/home_nav_master'
import HomeLink from '../compontents/home_link'
import HomeBanner from '../compontents/home_banner'
import HomeBottom from '../compontents/home_bottom'
import { mapGetters } from 'vuex'
import { master_nav_list, merchant_link_list ,mas_nav_list } from '@/config'
export default {
  components: {
    HomeNav,
	HomeNavMaster,
    HomeLink,
    HomeBanner,
    HomeBottom
  },
  data () {
    return {
      nav_list: master_nav_list,
      link_list: merchant_link_list,
	  nav_master_list : mas_nav_list
    }
  },
  computed: {
    level () {
      return this.user_info.level
    },
    ...mapGetters(['user_info'])
  },
}
</script>