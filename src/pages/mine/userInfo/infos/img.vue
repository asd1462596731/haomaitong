<template>
	
	<div class="content_item">
	  <span class="item_left">头像</span>
	  <div class="item_right">
	   <img v-if="imgSrc" class="right_photo" :src="imgSrc" alt="">
	    <img v-if="!imgSrc" class="right_photo" src="@/assets/img/mine/mine_icon1.png" alt="">
	    <img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
		<!-- <img class="img" v-show="imgSrc !== ''" :src="imgSrc" alt=""> -->
	  </div>
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

<style>
</style>