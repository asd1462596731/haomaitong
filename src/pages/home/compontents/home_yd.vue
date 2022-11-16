<template>
  <div id="home_yd">
    <van-swipe indicator-color="#0099FF" :loop="false">
	
		<template v-for="(item,index) in yd_banner">
      <van-swipe-item>
        <img :src="item.image" alt="">
		<template v-if="index === 0">
        <p>聚合支付</p>
		<br />
		
        <span>支持微信/支付宝/花呗/信用卡/刷脸支付</span>
		</template>
		<template v-if="index === 1">
		<p class="color2">客流量即时变现</p>
			<br />
		<span>引客促流，迅速转化，高效、快捷</span>
		</template>
		<template v-if="index === 2">
		<p>帮您管理店铺粉丝</p>
			<br />
		<span>锁定店铺粉丝，掌握粉丝消费数据分析</span>
		</template>
		<a href="javascript:;" class="home_yd_sure" @click="closeBannerHandler" v-show="index+1 === yd_banner.length">立即体验</a>
      </van-swipe-item>
	  </template>
    </van-swipe>
    <a href="javascript:;" class="home_yd_close" @click="closeBannerHandler">跳过</a>
  </div>
</template>
<script>
export default {
    props:{
		yd_banner:''
	},
  methods: {
    closeBannerHandler () {
      this.$emit('closeBannerHandler')
    }
  },
  
}
</script>