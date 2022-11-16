<template>
  <div id="index_visitor" class="home_box" :style="`top: ${head_rem}rem;`">
    <div class="home_container">
      <HomeNav :nav-list="nav_list" />
      <HomeBanner style="margin-top: .266667rem;" />
	  <HomeBottom />
    </div>
  
  </div>
</template>
<script>
import HomeNav from '../compontents/home_nav'
import HomeBanner from '../compontents/home_banner'
import HomeBottom from '../compontents/home_bottom'
import { visitor_nav_list } from '@/config'
export default {
  components: {
    HomeNav,
    HomeBanner,
    HomeBottom
  },
  data () {
    return {
      nav_list: visitor_nav_list
    }
  }
}
</script>