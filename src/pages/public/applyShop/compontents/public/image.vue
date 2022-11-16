<template>
  <div class="applyShop_image">
    <img class="icon" src="@/assets/img/public/public_icon5.png" alt="">
    <i>{{imgDesc}}</i>
    <img class="img" v-show="imgSrc !== ''" :src="imgSrc" alt="">
  </div>
</template>
<script>
export default {
  props: {
    imgDesc: {
      type: String,
      default: ''
    },
    imgSrc: {
      type: String,
      default: ''
    }
  }
}
</script>