<template>
	<div id="qrcode" class="page_container" :style="`padding-top: ${head_rem}rem;`">
		<NavBar :meta="meta" @saveImageFunc="saveImageFunc" v-bind:text="text" />
		<div class="container" id="container" v-if="showDom">
			<img :src="site_config.gathering_img" class="container_bg" alt="">
			<div class="container_qrcode">
				<img :src="desk_qrcode" alt="">
			</div>
		</div>
		<img style="width:100%;height:100%" :src="dataImg" v-if="dataImg" alt @touchstart="touchStart()"
			@touchend="touchEnd()">
	</div>
</template>
<script>
	import html2canvas from 'html2canvas'
	import NavBar from '@/components/navBar'
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		getPermissionFunc
	} from '@/util'
	export default {
		data() {
			return {
				meta: this.$route.meta,
				showDom: true,
				dataImg: '',
				text: '保存收款码'
			}
		},
		components: {
			NavBar
		},
		computed: {
			...mapGetters(['desk_qrcode', 'is_web_type', 'user_token','site_config'])
		},
		created() {
			
			if (!this.desk_qrcode) {
				this.noPastTo('/desk')
			}
			if (this.is_web_type == "H5") {
				this.text = "点击生成收款码"
			} else {
				this.text = "保存收款码"
			}
		},
		methods: {

			touchEnd() {
				//手指离开
				clearTimeout(this.Loop);
			},
			touchStart() {
				//手指触摸
				clearTimeout(this.Loop); //再次清空定时器，防止重复注册定时器
				this.Loop = setTimeout(() => {
					// console.log(1222)
					this.downImg()
				}, 1000)
			},
			// 下载
			downImg() {
				if (!window.plus) return;
				plus.gallery.save(this.dataImg, function() {
					console.log('保存成功');
				}, function() {
					console.log('保存失败');
				});
			},
			saveImageFunc() {

				if (this.is_web_type == "H5") {
					this.save();
				} else {
					// this.savecanvas()
					if (this.$app.systemType == 'ios') {
						this.savecanvas()
						return false
					}

					getPermissionFunc(this, 'storage', '储存').then(() => {
						this.savecanvas()
					})
				}
			},
			savecanvas() {
				this.showProgress('保存中')
				let canvas = document.getElementById('container')
				let _this = this
				html2canvas(canvas, {
					scale: 2,
					logging: false,
					useCORS: true
				}).then(function(canvas) {
					let rnd = ''
					for (let i = 0; i < 20; i++) {
						rnd += Math.floor(Math.random() * 10)
					}
					let type = 'png'
					let filename = rnd + '.' + type
					let imgData = canvas.toDataURL(type)
					// console.log(imgData)
					imgData = imgData.replace('data:image/png;base64,', '')
					_this.saveFile(imgData, filename)
				})
			},
			saveFile(data, filename) {
				this.trans = this.$app.require('trans')
				let _this = this
				this.trans.saveImage({
					base64Str: data,
					album: true,
					imgPath: 'fs://img/',
					imgName: filename
				}, function(ret, err) {
					_this.hideProgress()
					if (ret.status) {
						_this.$toast.success('保存成功')
					} else {
						_this.$toast.fail(`保存失败：${err.msg}`)
					}
				})
			},


			save() {
				let _this = this
				_this.$toast.success('收款码生成成功,请长按保存')
				let canvas = document.getElementById('container')
				html2canvas(canvas, {
					scale: 2,
					logging: false,
					useCORS: true
				}).then(function(canvas) {


					_this.dataImg = canvas.toDataURL("image/jpeg");
					_this.showDom = false;
					_this.text = "收款生成成功,请长按保存"
					//    let rnd = ''
					//    for (let i = 0; i < 20; i++) {
					//      rnd += Math.floor(Math.random() * 10)
					//    }
					//    let type = 'png'
					//    let filename = rnd + '.' + type
					//    let imgData = canvas.toDataURL(type)

					// var link= document.createElement("a");
					//         //将生成的图片url赋值给a标签的href属性
					//         link.href = imgData; 
					//         //设置下载的文件名
					//         link.download = "个人收货款码";
					//         // 将a标签插入dom中
					//         document.body.appendChild(link);
					//         //模拟点击事件触发下载
					//         link.click();
					//         // 完成之后销毁创建的a标签
					//         document.body.removeChild(link);

					// console.log(imgData)
					// imgData = imgData.replace('data:image/png;base64,', '')
					// img.src=tempSrc;  
					// _this.saveFile(imgData, filename)
					// console.log( imgData)
				})
			}



		}
	}
</script>
<style>
	#qrcode .container .container_bg{width: 100%;}
</style>
