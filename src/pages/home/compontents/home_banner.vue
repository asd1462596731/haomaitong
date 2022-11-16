<template>
  <div id="home_banner">
    <van-swipe :autoplay="4500" indicator-color="white">
      <van-swipe-item v-for="item in index_banner" :key="item.image">
       <img :src="item.image">
	   <div style="width: 100%;text-align: center;padding: 10px 0px;">{{item.info}}</div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['index_banner'])
  }
}
</script>
<style>
	.van-swipe__indicators{
		bottom: 1rem;
	}
</style>