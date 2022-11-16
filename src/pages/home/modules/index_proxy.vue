<template>
  <div id="index_sale" class="home_box" :style="`top: ${head_rem}rem;`">
    <div class="home_container">
      <HomeNav :nav-list="nav_list" />
      <HomeLink :link-list="link_list" />
      <HomeBanner />
    </div>
    <HomeBottom />
  </div>
</template>
<script>
import HomeNav from '../compontents/home_nav'
import HomeLink from '../compontents/home_link'
import HomeBanner from '../compontents/home_banner'
import HomeBottom from '../compontents/home_bottom'
import { proxy_nav_list, sale_link_list, proxy_link_list, province_link_list } from '@/config'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    HomeNav,
    HomeLink,
    HomeBanner,
    HomeBottom
  },
  computed: {
    ...mapGetters(['user_info'])
  },
  data () {
    return {
      nav_list: proxy_nav_list,
      link_list: proxy_link_list,
      banner_height: ''
    }
  },
  created () {
    let level = this.user_info.level
    if (level === 'province') {
      this.link_list = province_link_list
    }
    if (level === 'sale') {
      this.link_list = sale_link_list
    }
  }
}
</script>