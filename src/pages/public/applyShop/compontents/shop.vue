<template>
	<div id="apply_shop">
		<div style="margin-top: 0.6rem;color: crimson;">提示：带*为必填项</div>
		<div class="input_box" @click="showBusinessPickerHandler">
			<div class="box_top algin_right">
				<i style="color: red;">*</i>
				<van-cell title="经营类型" :value="business_show_key" />
				<img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
			</div>
		</div>
		<div class="input_box" v-show="isGeti">
			<div class="box_top algin_right">
				<i style="color: red;">*</i>
				<van-cell title="营业执照类型" value="三证合一" />
				<img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
			</div>
		</div>
		<!-- 营业执照类型 -->
		<div class="input_box" v-show="isQiye" @click="selectLicenseTypeHandler">
			<div class="box_top algin_right">
				<i style="color: red;">*</i>
				<van-cell title="营业执照类型" :value="license_type_text" />
				<img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
			</div>
		</div>

		<!-- 营业执照 -->
		<div class="input_box" v-show="!isXiaowei && apply_info.license_merge === 1">
			<div class="box_img only_one">
				<div v-if="isMobile" class="img_wrapper">
					<div class="img_item" @click="showUploadTypeHandler('license_pic')">
						<ApplyImage img-desc="营业执照" :img-src="picture.license_pic" />
					</div>
				</div>
				<div v-else class="img_wrapper">
					<div class="img_item">
						<div v-if="picture.license_pic" class="top_delete">
							<i class="van-icon van-icon-delete" @click="deletePicture('license_pic')"></i>
						</div>
						<ApplyImage img-desc="营业执照" :img-src="picture.license_pic"
							:style="picture.license_pic ? 'visibility: visible;' : 'visibility: hidden;'" />
						<van-uploader v-if="!picture.license_pic" class="top_div" :preview-image="false"
							name="license_pic" :after-read="afterRead_pic" upload-text="营业执照" />
					</div>
				</div>
			</div>
		</div>
		<!-- 营业执照 -->
		<div class="input_box" v-show="isQiye && apply_info.license_merge === 2">
			<div class="box_img">
				<div v-if="isMobile" class="img_wrapper">
					<div class="img_item" @click="showUploadTypeHandler('license_pic')">
						<ApplyImage img-desc="营业执照" :img-src="picture.license_pic" />
					</div>
					<div class="img_item" @click="showUploadTypeHandler('tax_pic')">
						<ApplyImage img-desc="税务登记证" :img-src="picture.tax_pic" />
					</div>
					<div class="img_item" @click="showUploadTypeHandler('org_pic')">
						<ApplyImage img-desc="组织机构正式" :img-src="picture.org_pic" />
					</div>
				</div>
				<div v-else class="img_wrapper">
					<div class="img_item">
						<div v-if="picture.license_pic" class="top_delete">
							<i class="van-icon van-icon-delete" @click="deletePicture('license_pic')"></i>
						</div>
						<ApplyImage img-desc="营业执照" :img-src="picture.license_pic"
							:style="picture.license_pic ? 'visibility: visible;' : 'visibility: hidden;'" />
						<van-uploader v-if="!picture.license_pic" class="top_div" :preview-image="false"
							name="license_pic" :after-read="afterRead_pic" upload-text="营业执照" />
					</div>
					<div class="img_item">
						<div v-if="picture.tax_pic" class="top_delete">
							<i class="van-icon van-icon-delete" @click="deletePicture('tax_pic')"></i>
						</div>
						<ApplyImage img-desc="税务登记证" :img-src="picture.tax_pic"
							:style="picture.tax_pic ? 'visibility: visible;' : 'visibility: hidden;'" />
						<van-uploader v-if="!picture.tax_pic" class="top_div" :preview-image="false" name="tax_pic"
							:after-read="afterRead" upload-text="税务登记证" />
					</div>
					<div class="img_item">
						<div v-if="picture.org_pic" class="top_delete">
							<i class="van-icon van-icon-delete" @click="deletePicture('org_pic')"></i>
						</div>
						<ApplyImage img-desc="组织机构正式" :img-src="picture.org_pic"
							:style="picture.org_pic ? 'visibility: visible;' : 'visibility: hidden;'" />
						<van-uploader v-if="!picture.org_pic" class="top_div" :preview-image="false" name="org_pic"
							:after-read="afterRead" upload-text="组织机构正式" />
					</div>
				</div>
			</div>
		</div>

		<!-- 营业执照名称 -->
		<div class="input_box" v-show="!isXiaowei">
			<div class="box_top">
				<span><i style="color: red;">*</i>营业执照名称</span>
				<van-field v-model="formData.license_name" @input="inputChangeHandler" />
			</div>
		</div>

		<!-- 营业执照注册号 -->
		<div class="input_box" v-show="!isXiaowei">
			<div class="box_top">
				<span><i style="color: red;">*</i>营业执照注册号</span>
				<van-field v-model="formData.license_no" @input="inputChangeHandler" />
			</div>
		</div>

		<div class="input_box">
			<div class="box_img">
				<div class="img_title">
					<span><i style="color: red;">*</i>商家资料</span>
				</div>
				<div v-if="isMobile" class="img_wrapper">
					<div class="img_item" @click="showUploadTypeHandler('store_pic')">
						<ApplyImage img-desc="店铺门头照" :img-src="picture.store_pic" />
					</div>
					<div class="img_item" @click="showUploadTypeHandler('store_inside_pic')">
						<ApplyImage img-desc="店铺内景照" :img-src="picture.store_inside_pic" />
					</div>
				</div>
				<div v-else class="img_wrapper">
					<div class="img_item">
						<div v-if="picture.store_pic" class="top_delete">
							<i class="van-icon van-icon-delete" @click="deletePicture('store_pic')"></i>
						</div>
						<ApplyImage img-desc="店铺门头照" :img-src="picture.store_pic"
							:style="picture.store_pic ? 'visibility: visible;' : 'visibility: hidden;'" />
						<van-uploader v-if="!picture.store_pic" class="top_div" :preview-image="false" name="store_pic"
							:after-read="afterRead" upload-text="店铺门头照" />
					</div>
					<div class="img_item">
						<div v-if="picture.store_inside_pic" class="top_delete">
							<i class="van-icon van-icon-delete" @click="deletePicture('store_inside_pic')"></i>
						</div>
						<ApplyImage img-desc="店铺内景照" :img-src="picture.store_inside_pic"
							:style="picture.store_inside_pic ? 'visibility: visible;' : 'visibility: hidden;'" />
						<van-uploader v-if="!picture.store_inside_pic" class="top_div" :preview-image="false"
							name="store_inside_pic" :after-read="afterRead" upload-text="店铺内景照" />
					</div>
					<div class="img_item" v-show="isXiaowei">
						<div v-if="picture.img_idcard_holding" class="top_delete">
							<i class="van-icon van-icon-delete" @click="deletePicture('img_idcard_holding')"></i>
						</div>
						<ApplyImage img-desc="入账人手持身份证" :img-src="picture.img_idcard_holding"
							:style="picture.img_idcard_holding ? 'visibility: visible;' : 'visibility: hidden;'" />
						<van-uploader v-if="!picture.img_idcard_holding" class="top_div" :preview-image="false"
							name="img_idcard_holding" :after-read="afterRead" upload-text="入账人手持身份证" />
					</div>
				</div>
			</div>
		</div>

		<!-- 营业执照类型 -->
		<van-action-sheet v-model="showLicenseType" :actions="license_type_list" @select="onLicenseSelectHandler" />
		<!-- 上传类型 -->
		<van-action-sheet v-model="showUploadType" :actions="upload_type_list" @select="onUploadSelectHandler" />
		<!-- 行业类目 -->
		<van-popup v-model="showBusinessPicker" position="bottom">
			<van-picker :columns="businessColumns" show-toolbar @cancel="businessOnCancel" @change="businessOnChange"
				@confirm="businessOnConfirm" />
		</van-popup>
	</div>
</template>
<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import ApplyImage from './public/image'
	import {
		UtilchooseImage
	} from '@/util'
	import * as request from '@/api'
	import Business from '@/assets/js/business.js'
	import Exif from 'exif-js'

	export default {
		components: {
			ApplyImage
		},
		data() {
			return {
				lazyTime: 0, // 延迟标识
				lazyTimer: null, // 延迟展示
				files: {
					name: '',
					type: ''
				},
				isMobile: true, // 是否手机平台
				showBusinessPicker: false,
				showLicenseType: false,
				type: 0,
				license_type_list: [{
						name: '三证合一',
						key: 1
					},
					{
						name: '非三证合一',
						key: 2
					}
				],
				showUploadType: false,
				upload_type_list: [{
						name: '相册',
						key: 1
					},
					{
						name: '拍照',
						key: 2
					}
				],
				upload_type: '',
				upload_key: '1',
				business_show: '',
				businessColumns: [{
						values: Object.keys(Business),
						className: 'column1'
					},
					{
						values: Business['生活百货'],
						className: 'column2',
						defaultIndex: 0
					},
					{
						values: Business['生活百货'][0].children,
						className: 'column3',
						defaultIndex: 0
					}
				]
			}
		},
		computed: {
			business_show_key() {
				return this.apply_info.business_three ? this.apply_info.business_three : ''
			},
			isQiye() {
				return this.apply_info.license_type === 'qiye'
			},
			isGeti() {
				return this.apply_info.license_type === 'geti'
			},
			isXiaowei() {
				return this.apply_info.license_type === 'xiaowei'
			},
			license_type_text() {
				return this.apply_info.license_merge === 1 ? '三证合一' : '非三证合一'
			},
			formData() {
				// console.log(JSON.stringify(this.apply_info))
				return this.apply_info
			},
			...mapGetters([
				'apply_info',
				'picture'
			])
		},
		created() {
			this.getPlatform()
		},
		methods: {
			// 上传图片
			afterRead(file, detail) {
				const name = detail.name
				this.upload_type = name
				this.files.name = file.file.name // 获取文件名
				this.files.type = file.file.type // 获取类型
				let ty = this.type
				this.imgPreview(file.file,ty)
			},
			
			//营业执照的上传处理
			afterRead_pic(file, detail) {
				const name = detail.name
				this.upload_type = name
				this.files.name = file.file.name // 获取文件名
				this.files.type = file.file.type // 获取类型
				let ty = this.type
				ty = 1
				this.imgPreview(file.file,ty)
			},
			// 删除图片
			deletePicture(upload_type) {
				let picture = this.picture
				picture[upload_type] = ''
				this.set_picture(picture)
				this.picture[upload_type] = ''
			},
			// 处理图片
			imgPreview(file,ty) {
				let self = this
				let Orientation
				// 去获取拍照时的信息，解决拍出来的照片旋转问题   npm install exif-js --save   这里需要安装一下包
				Exif.getData(file, function() {
					Orientation = Exif.getTag(this, 'Orientation')
				})
				// 看支持不支持FileReader
				if (!file || !window.FileReader) return
				if (/^image/.test(file.type)) {
					// 创建一个reader
					let reader = new FileReader()
					// 将图片2将转成 base64 格式
					reader.readAsDataURL(file)
					// 读取成功后的回调
					reader.onloadend = function() {
						let result = this.result
						let img = new Image()
						img.src = result
						// 判断图片是否大于500K,是就直接上传，反之压缩图片
						if (this.result.length <= 500 * 1024) {
							// 上传图片
							self.postImg(this.result,ty)
						} else {
							img.onload = function() {
								let data = self.compress(img, Orientation)
								// 上传图片
								self.postImg(data,ty)
							}
						}
					}
				}
			},
			// 压缩图片
			compress(img, Orientation) {
				let canvas = document.createElement('canvas')
				let ctx = canvas.getContext('2d')
				// 瓦片canvas
				let tCanvas = document.createElement('canvas')
				let tctx = tCanvas.getContext('2d')
				// let initSize = img.src.length;
				let width = img.width
				let height = img.height
				// 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
				let ratio
				if ((ratio = (width * height) / 4000000) > 1) {
					// console.log("大于400万像素");
					ratio = Math.sqrt(ratio)
					width /= ratio
					height /= ratio
				} else {
					ratio = 1
				}
				canvas.width = width
				canvas.height = height
				//    铺底色
				ctx.fillStyle = '#fff'
				ctx.fillRect(0, 0, canvas.width, canvas.height)
				// 如果图片像素大于100万则使用瓦片绘制
				let count
				if ((count = (width * height) / 1000000) > 1) {
					// console.log("超过100W像素");
					count = ~~(Math.sqrt(count) + 1) // 计算要分成多少块瓦片
					//      计算每块瓦片的宽和高
					let nw = ~~(width / count)
					let nh = ~~(height / count)
					tCanvas.width = nw
					tCanvas.height = nh
					for (let i = 0; i < count; i++) {
						for (let j = 0; j < count; j++) {
							tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
							ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
						}
					}
				} else {
					ctx.drawImage(img, 0, 0, width, height)
				}
				// 修复ios上传图片的时候 被旋转的问题
				if (Orientation != '' && Orientation != 1) {
					switch (Orientation) {
						case 6: // 需要顺时针（向左）90度旋转
							this.rotateImg(img, 'left', canvas)
							break
						case 8: // 需要逆时针（向右）90度旋转
							this.rotateImg(img, 'right', canvas)
							break
						case 3: // 需要180度旋转
							this.rotateImg(img, 'right', canvas) // 转两次
							this.rotateImg(img, 'right', canvas)
							break
					}
				}
				// 进行最小压缩
				let ndata = canvas.toDataURL('image/jpeg', 0.2)
				tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0

				return ndata
			},
			// 旋转图片
			rotateImg(img, direction, canvas) {
				// 最小与最大旋转方向，图片旋转4次后回到原方向
				const min_step = 0
				const max_step = 3
				if (img == null) return
				// img的高度和宽度不能在img元素隐藏后获取，否则会出错
				let height = img.height
				let width = img.width
				let step = 2
				if (step == null) {
					step = min_step
				}
				if (direction == 'right') {
					step++
					// 旋转到原位置，即超过最大值
					step > max_step && (step = min_step)
				} else {
					step--
					step < min_step && (step = max_step)
				}
				// 旋转角度以弧度值为参数
				let degree = (step * 90 * Math.PI) / 180
				let ctx = canvas.getContext('2d')
				switch (step) {
					case 0:
						canvas.width = width
						canvas.height = height
						ctx.drawImage(img, 0, 0)
						break
					case 1:
						canvas.width = height
						canvas.height = width
						ctx.rotate(degree)
						ctx.drawImage(img, 0, -height)
						break
					case 2:
						canvas.width = width
						canvas.height = height
						ctx.rotate(degree)
						ctx.drawImage(img, -width, -height)
						break
					case 3:
						canvas.width = height
						canvas.height = width
						ctx.rotate(degree)
						ctx.drawImage(img, -width, 0)
						break
				}
			},
			// 将base64转换为文件
			dataURLtoFile(dataurl) {
				var arr = dataurl.split(',')
				var bstr = atob(arr[1])
				var n = bstr.length
				var u8arr = new Uint8Array(n)
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n)
				}
				return new File([u8arr], this.files.name, {
					type: this.files.type
				})
			},
			// 提交图片到后端
			postImg(base64,ty) {
				this.$toast.loading({
					message: '上传中...',
					forbidClick: true,
					overlay: true,
					duration: 0,
					loadingType: 'spinner'
				})
				request.post_common_upload(base64).then(res => {
					if (res.code === this.SUCCESS_CODE) {
						this.formData[this.upload_type] = res.data.key
						let picture = this.picture
						picture[this.upload_type] = res.data.url
						this.set_picture(picture)

						if(ty === 1){
							this.get_pic_id(res.data.url)
						}
						let data = {
							...this.apply_info,
							...this.formData
						}
						this.set_apply_info(data)
						this.lazyTimer = setTimeout(() => {
							this.$toast.success(res.msg)
						}, 100)
					} else {
						this.$toast.fail(res.msg)
					}
					// this.hideProgress()
				})
			},
			
			//获取营业执照id
			get_pic_id(url){
				request.get_pic_idcard(url).then(res => {
					if (res.code === this.SUCCESS_CODE) {
						this.formData.license_no = res.data
					}else{
						this.$toast.fail('请手动填写营业执照注册号')
					}
				})
				
			},
			
			getPlatform() {
				this.isMobile = this.systemType !== 'web'
			},
			// 取消行业选择
			businessOnCancel() {
				this.showBusinessPicker = false
			},
			// 打开行业选择
			showBusinessPickerHandler() {
				this.showBusinessPicker = true
			},
			// 行业选择变化
			businessOnChange(picker, values) {
				picker.setColumnValues(1, Business[values[0]])
				picker.setColumnValues(2, Business[values[0]][values[1].index].children)
			},
			// 确认选择行业
			businessOnConfirm(value) {
				if (!value[2]) {
					this.showBusinessPicker = false
					return false
				}
				let str = `${value[2].text}` // ${value[0]}-${value[1].text}-
				let id = value[2].id
				this.business_show = str
				this.apply_info.business_three = str
				this.formData.business_id = id
				let data = {
					...this.apply_info,
					...this.formData
				}
				this.set_apply_info(data)
				this.showBusinessPicker = false
			},
			// 打开上传类型选择
			showUploadTypeHandler(type) {
				this.showUploadType = true
				this.upload_type = type
			},
			// 上传类型选择完毕
			onUploadSelectHandler(item) {
				let key = item.key
				this.upload_key = key
				this.showUploadType = false
				UtilchooseImage(this).then(result => {
					request.post_common_upload(result).then(res => {
						// ***
						// this.$dialog.alert({
						//   message: JSON.stringify(res)
						// }).then(() => {
						// }).catch(() => {
						// })
						// ***
						if (res.code === this.SUCCESS_CODE) {
							this.$toast.success(res.msg)
							this.formData[this.upload_type] = res.data.key
							let picture = this.picture
							picture[this.upload_type] = res.data.url
							this.set_picture(picture)

							let data = {
								...this.apply_info,
								...this.formData
							}
							this.set_apply_info(data)
						} else {
							this.$toast.fail(res.msg)
						}
						this.hideProgress()
					})
				}).catch(() => {
					this.$toast.fail('选取失败')
				})
			},
			// 打开结算方式选择
			selectLicenseTypeHandler() {
				this.showLicenseType = true
			},
			// 结算方式选择完毕
			onLicenseSelectHandler(item) {
				let key = item.key
				this.formData.license_merge = key
				let data = {
					...this.apply_info,
					...this.formData
				}
				this.set_apply_info(data)
				this.showLicenseType = false
			},
			// input 内容变化
			inputChangeHandler() {
				let data = {
					...this.apply_info,
					...this.formData
				}
				this.set_apply_info(data)
			},
			...mapMutations({
				set_picture: 'SET_PICTURE',
				set_apply_info: 'SET_APPLY_INFO'
			})
		}
	}
</script>
