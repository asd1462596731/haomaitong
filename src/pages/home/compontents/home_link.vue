<template>
  <div id="home_link">
    <div class="link_box" v-for="item in linkList" :key="item.title">
      <div class="link_title">
        {{item.title}}
      </div>
      <div class="link_list">
        <div class="link_item" v-for="link in item.nav" :key="link.text" @click="jumpTo(link.link)">
          <div class="item_img">
            <img class="width52" v-if="link.icon === '2'" src="@/assets/img/home/home_s_icon2.png" alt="">
            <img class="width52" v-if="link.icon === '3'" src="@/assets/img/home/home_s_icon3.png" alt="">
            <img class="width54" v-if="link.icon === '4'" src="@/assets/img/home/home_s_icon4.png" alt="">
            <img class="width52" v-if="link.icon === '5'" src="@/assets/img/home/home_s_icon5.png" alt="">
            <img class="width52" v-if="link.icon === '6'" src="@/assets/img/home/home_s_icon6.png" alt="">
            <img class="width52" v-if="link.icon === '7'" src="@/assets/img/home/home_s_icon7.png" alt="">
            <img class="height52" v-if="link.icon === '8'" src="@/assets/img/home/home_s_icon8.png" alt="">
            <img class="height52" v-if="link.icon === '9'" src="@/assets/img/home/home_s_icon9.png" alt="">
            <img class="width52" v-if="link.icon === '11'" src="@/assets/img/home/home_s_icon11.png" alt="">
            <img class="width52" v-if="link.icon === '12'" src="@/assets/img/home/home_s_icon12.png" alt="">
          </div>
          <span class="item_text">{{link.text}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    linkList: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>