<template>
    <div id="index_merchant" class="home_box" :style="`top: ${head_rem}rem;`">
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
  import {  merchant_0d_link_list,merchant_d0_nav_list } from '@/config'
  export default {
    components: {
      HomeNav,
      HomeLink,
      HomeBanner,
      HomeBottom
    },
    data () {
      return {
        nav_list: merchant_d0_nav_list,
        link_list: merchant_0d_link_list
      }
    }
  }
  </script>