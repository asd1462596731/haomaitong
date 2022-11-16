<template>
  <div id="home_nav">
    <div class="nav_item" v-for="item in navList" :key="item.text" @click="jumpTo(item.link)">
      <div class="item_img">
        <img class="width67" v-if="item.icon === '1'" src="@/assets/img/home/home_icon1.png" alt="">
        <img class="width72" v-if="item.icon === '2'" src="@/assets/img/home/home_icon2.png" alt="">
        <img class="width72" v-if="item.icon === '3'" src="@/assets/img/home/home_icon3.png" alt="">
        <img class="width72" v-if="item.icon === '4'" src="@/assets/img/home/home_icon4.png" alt="">
        <img class="width72" data-v-step="5" v-if="item.icon === '5'" src="@/assets/img/home/home_icon5.png" alt="">
        <img class="width56" v-if="item.icon === '6'" src="@/assets/img/home/home_icon6.png" alt="">
        <img class="width72" v-if="item.icon === '7'" src="@/assets/img/home/home_icon7.png" alt="">
        <img class="width72" data-v-step="8" v-if="item.icon === '8'" src="@/assets/img/home/home_icon8.png" alt="">
        <img class="width53" v-if="item.icon === '9'" src="@/assets/img/home/home_icon9.png" alt="">
      </div>
      <span>{{item.text}}</span>
    </div>
    <!-- <v-tour name="myTour" :steps="steps"></v-tour> -->
  </div>
</template>
<script>
export default {
  name: 'MyTour',
  props: {
    navList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      // steps: [
      //   {
      //     target: '[data-v-step="5"]',  // We're using document.querySelector() under the hood
      //     content: `Discover <strong>Vue Tour</strong>!`
      //   },
      //   {
      //     target: '[data-v-step="8"]',
      //     content: 'An awesome plugin made with Vue.js!'
      //   }
      // ]
    }
  },
  created () {
  },
  mounted () {
    // this.$nextTick(() => {
    //   this.$tours['myTour'].start()
    // })
  }
}
</script>