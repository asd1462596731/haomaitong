<template>
  <div id="foot">
    <div class="foot_item" @click="noPastTo('/')" :class="{'active': $route.name === 'home'}">
      <div class="item_icon">
        <img v-show="$route.name !== 'home'" src="@/assets/img/layout/layout_icon1_1.png" alt="">
        <img v-show="$route.name === 'home'" src="@/assets/img/layout/layout_icon1.png" alt="">
      </div>
      <span>首页</span>
    </div>
    <div class="foot_item" @click="noPastTo('/bill')" :class="{'active': $route.name === 'bill'}">
      <div class="item_icon">
        <img v-show="$route.name !== 'bill'" src="@/assets/img/layout/layout_icon3_1.png" alt="">
        <img v-show="$route.name === 'bill'" src="@/assets/img/layout/layout_icon3.png" alt="">
      </div>
      <span>账单</span>
    </div>
    <div class="foot_item" @click="noPastTo('/mine')" :class="{'active': $route.name === 'mine'}">
      <div class="item_icon">
        <img v-show="$route.name !== 'mine'" src="@/assets/img/layout/layout_icon2_1.png" alt="">
        <img v-show="$route.name === 'mine'" src="@/assets/img/layout/layout_icon2.png" alt="">
      </div>
      <span>我的</span>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    level () {
      return this.user_info.level
    },
    ...mapGetters(['user_info'])
  }
}
</script>
