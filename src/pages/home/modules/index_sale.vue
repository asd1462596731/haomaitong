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
import { sale_nav_list,sale_nav_list2, sale_link_list } from '@/config'
export default {
  components: {
    HomeNav,
    HomeLink,
    HomeBanner,
    HomeBottom
  },
  data () {
    return {
      nav_list: sale_nav_list,
      nav_list2: sale_nav_list2,
      link_list: sale_link_list
    }
  }
}
</script>