<template>
	<div id="home_zy">
		<div class="zy_box visitor" v-if="level === 'visitor'" :style="`top: ${top_rem}rem;`">
			<img class="zy_img1" v-show="!visitor_show_next" src="@/assets/img/other/zhiyin_visitor.png" alt="">
			<img class="zy_img2" v-show="visitor_show_next" src="@/assets/img/other/zhiyin_visitor2.png" alt="">
			<img class="zy_button" @click="nextZyHandler('visitor_show_next')"
				src="@/assets/img/other/zhiyin_button.png" alt="">
		</div>
		<div class="zy_box merchant" v-if="level === 'merchant'" :style="`top: ${top_rem}rem;`">
			<img class="zy_img1" v-show="!merchant_show_next" src="@/assets/img/other/zhiyin_merchant.png" alt="">
			<img class="zy_img2" v-show="!merchant_show_next" src="@/assets/img/other/zhiyin_merchant1.png" alt="">
			<img class="zy_img3" v-show="merchant_show_next" src="@/assets/img/other/zhiyin_merchant2.png" alt="">
			<img class="zy_button" @click="nextZyHandler('merchant_show_next')"
				src="@/assets/img/other/zhiyin_button.png" alt="">
		</div>
		<div class="zy_box merchant" v-if="level === 'master'" :style="`top: ${top_rem}rem;`">
			<img class="zy_img1" v-show="!merchant_show_next" src="@/assets/img/other/zhiyin_merchant.png" alt="">
			<!-- <img class="zy_img2" v-show="!merchant_show_next" src="@/assets/img/other/zhiyin_merchant1.png" alt=""> -->
			<!-- <img class="zy_img3" v-show="merchant_show_next" src="@/assets/img/other/zhiyin_merchant2.png" alt=""> -->
			<img class="zy_button" @click="nextZyHandler('merchant_show_next')"
				src="@/assets/img/other/zhiyin_button.png" alt="">
		</div>
		<div class="zy_box sale" v-if="level === 'sale'" :style="`top: ${top_rem}rem;`">
			<img class="zy_img1" v-show="!sale_show_next" src="@/assets/img/other/zhiyin_sale.png" alt="">
			<img class="zy_img2" v-show="sale_show_next" src="@/assets/img/other/zhiyin_sale2.png" alt="">
			<img class="zy_button" @click="nextZyHandler('sale_show_next')" src="@/assets/img/other/zhiyin_button.png"
				alt="">
		</div>
		<div class="zy_box proxy" v-if="level === 'province' || level === 'city' || level === 'area'"
			:style="`top: ${top_rem}rem;`">
			<img class="zy_img1" v-show="!sale_show_next" src="@/assets/img/other/zhiyin_sale.png" alt="">
			<img class="zy_img2" v-show="sale_show_next" src="@/assets/img/other/zhiyin_sale2.png" alt="">
			<img class="zy_img3" v-show="sale_show_next" src="@/assets/img/other/zhiyin_sale3.png" alt="">
			<img class="zy_button" @click="nextZyHandler('sale_show_next')" src="@/assets/img/other/zhiyin_button.png"
				alt="">
		</div>

	</div>
</template>
<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		computed: {
			level() {
				return this.user_info.level
			},
			...mapGetters(['user_token', 'user_info'])
		},
		data() {
			return {
				sale_show_next: false,
				visitor_show_next: false,
				merchant_show_next: false
			}
		},
		methods: {
			nextZyHandler(type) {
				if (this[type]) {
					this.hideZyHandler()
					return false
				}
				this[type] = true
			},
			hideZyHandler() {
				this.set_show_zy(false)
			},
			...mapMutations({
				set_show_zy: 'SET_SHOW_ZY'
			})
		}
	}
</script>
