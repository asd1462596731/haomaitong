<template>
	
	<div id="apply_settlement">
		<div style="margin-top: 0.6rem;color: crimson;">提示：带*为必填项</div>
		<!-- 身份证照片 -->
		<div class="input_box">
			<div class="box_img">
				<div class="img_title">
					<span><i style="color: red;">*</i>{{isXiaowei ? '身份证照片' : '法人身份证照片'}}</span>
				</div>
				<div v-if="isMobile" class="img_wrapper">
					<div class="img_item" @click="showUploadTypeHandler('legal_identity_pica')">
						<ApplyImage img-desc="身份证正面" :img-src="picture.legal_identity_pica" />
					</div>
					<div class="img_item" @click="showUploadTypeHandler('legal_identity_picb')">
						<ApplyImage img-desc="身份证反面" :img-src="picture.legal_identity_picb" />
					</div>
					<!-- <div class="img_item" v-show="isXiaowei" @click="showUploadTypeHandler('img_idcard_holding')">
            <ApplyImage img-desc="手持身份证" :img-src="picture.img_idcard_holding" />
          </div> -->
				</div>
				<div v-else class="img_wrapper">
					<div class="img_item">
						<div v-if="picture.legal_identity_pica" class="top_delete">
							<i class="van-icon van-icon-delete" @click="deletePicture('legal_identity_pica')"></i>
						</div>
						<ApplyImage img-desc="身份证正面" :img-src="picture.legal_identity_pica"
							:style="picture.legal_identity_pica ? 'visibility: visible;' : 'visibility: hidden;'" />
						<van-uploader v-if="!picture.legal_identity_pica" class="top_div" :preview-image="false"
							name="legal_identity_pica" :after-read="afterRead" upload-text="身份证正面" />
					</div>
					<div class="img_item">
						<div v-if="picture.legal_identity_picb" class="top_delete">
							<i class="van-icon van-icon-delete" @click="deletePicture('legal_identity_picb')"></i>
						</div>
						<ApplyImage img-desc="身份证反面" :img-src="picture.legal_identity_picb"
							:style="picture.legal_identity_picb ? 'visibility: visible;' : 'visibility: hidden;'" />
						<van-uploader v-if="!picture.legal_identity_picb" class="top_div" :preview-image="false"
							name="legal_identity_picb" :after-read="afterRead" upload-text="身份证反面" />
					</div>
				</div>
			</div>
		</div>
		<!-- 身份证号 -->
		<div class="input_box">
			<div class="box_top">
				<span><i style="color: red;">*</i>{{isXiaowei ? '身份证号码' : '法人身份证号'}}</span>
				<van-field v-model="formData.legal_identity_no" @input="inputChangeHandler" />
			</div>
			<div class="box_bottom">商户负责人身份证号</div>
		</div>
		<!-- 身份有效期开始 -->
		<!-- 		<div class="input_box">
			<div class="box_top algin_right">
					<i style="color: red;">*</i><van-cell title="身份有效期开始" :value="formData.idcard_validity_start" @click="idcard_time('1')"/>
					<img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
				
			</div>
			<div class="box_bottom">商户负责人身份证号有效期开始</div>
		</div>
		
		<div class="input_box">
			<div class="box_top algin_right">
					<i style="color: red;">*</i><van-cell title="身份有效期结束" :value="formData.idcard_validity_end" @click="idcard_time('2')"/>
					<img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
				
			</div>
			<div class="box_bottom">商户负责人身份证号有效期结束</div>
		</div> -->


		<!-- 结算类型 -->
		<div class="input_box" v-show="!isXiaowei" @click="selectAccountTypeHandler">
			<div class="box_top algin_right">
				<i style="color: red;">*</i>
				<van-cell title="结算类型" :value="account_type_text" />
				<img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
			</div>
		</div>
		<!-- 开户许可证 -->
		<div class="input_box" v-show="formData.account_type === 2 || formData.account_type === 4">
			<div class="box_img ">
				<div class="img_title">
					<span><i style="color: red;">*</i>开户许可证</span>
				</div>
				<div v-if="isMobile" class="img_wrapper">
					<div class="img_item" @click="showUploadTypeHandler('account_license_pic')">
						<ApplyImage img-desc="开户许可证" :img-src="picture.account_license_pic" />
					</div>
				</div>
				<div v-else class="img_wrapper">
					<div class="img_item">
						<div v-if="picture.account_license_pic" class="top_delete">
							<i class="van-icon van-icon-delete" @click="deletePicture('account_license_pic')"></i>
						</div>
						<ApplyImage img-desc="商户信息变更表" :img-src="picture.account_license_pic"
							:style="picture.account_license_pic ? 'visibility: visible;' : 'visibility: hidden;'" />
						<van-uploader v-if="!picture.account_license_pic" class="top_div" :preview-image="false"
							name="account_license_pic" :after-read="afterRead" upload-text="商户信息变更表" />
					</div>
				</div>
			</div>
		</div>


		<!-- 对私非法人上传授权函 ，对公非营业执照名-->
		<div class="input_box" v-if="isShowAuthor || formData.account_type === 4">
			<div class="box_img">
				<div class="img_title">
					<span><i style="color: red;">*</i>授权函照片</span>
				</div>
				<div v-if="isMobile" class="img_wrapper">
					<div class="img_item" @click="showUploadTypeHandler('grant_letter')">
						<ApplyImage img-desc="请选择一张授权函照片" :img-src="picture.grant_letter" />
					</div>

				</div>
				<div v-else class="img_wrapper">
					<div class="img_item">
						<div v-if="picture.grant_letter " class="top_delete">
							<i class="van-icon van-icon-delete" @click="deletePicture('grant_letter')"></i>
						</div>
						<ApplyImage img-desc="请选择一张授权函照片" :img-src="picture.grant_letter"
							:style="picture.grant_letter ? 'visibility: visible;' : 'visibility: hidden;'" />
						<van-uploader v-if="!picture.grant_letter" class="top_div" :preview-image="false"
							name="grant_letter" :after-read="afterRead" upload-text="请选择一张授权函照片" />
					</div>

				</div>
			</div>
		</div>
		
		
		<!-- 结算人身份证照片 -->
		<div class="input_box" v-if="isShowAuthor">
			<div class="box_img">
				<div class="img_title">
					<span><i style="color: red;">*</i>结算人身份证照片</span>
				</div>
				<div v-if="isMobile" class="img_wrapper">
					<div class="img_item" @click="showUploadTypeHandler('account_identity_pica')">
						<ApplyImage img-desc="身份证正面" :img-src="picture.account_identity_pica" />
					</div>
					<div class="img_item" @click="showUploadTypeHandler('account_identity_picb')">
						<ApplyImage img-desc="身份证反面" :img-src="picture.account_identity_picb" />
					</div>
					<!-- <div class="img_item" v-show="isXiaowei" @click="showUploadTypeHandler('img_idcard_holding')">
		    <ApplyImage img-desc="手持身份证" :img-src="picture.img_idcard_holding" />
		  </div> -->
				</div>
				<div v-else class="img_wrapper">
					<div class="img_item">
						<div v-if="picture.account_identity_pica" class="top_delete">
							<i class="van-icon van-icon-delete" @click="deletePicture('account_identity_pica')"></i>
						</div>
						<ApplyImage img-desc="身份证正面" :img-src="picture.account_identity_pica"
							:style="picture.account_identity_pica ? 'visibility: visible;' : 'visibility: hidden;'" />
						<van-uploader v-if="!picture.account_identity_pica" class="top_div" :preview-image="false"
							name="account_identity_pica" :after-read="afterRead" upload-text="身份证正面" />
					</div>
					<div class="img_item">
						<div v-if="picture.account_identity_picb" class="top_delete">
							<i class="van-icon van-icon-delete" @click="deletePicture('account_identity_picb')"></i>
						</div>
						<ApplyImage img-desc="身份证反面" :img-src="picture.account_identity_picb"
							:style="picture.account_identity_picb ? 'visibility: visible;' : 'visibility: hidden;'" />
						<van-uploader v-if="!picture.account_identity_picb" class="top_div" :preview-image="false"
							name="account_identity_picb" :after-read="afterRead" upload-text="身份证反面" />
					</div>
				</div>
			</div>
		</div>
		
		<!-- 结算人身份证号 -->
		<div class="input_box" v-if="isShowAuthor">
			<div class="box_top">
				<span><i style="color: red;">*</i>结算人身份证号</span>
				<van-field v-model="formData.account_identity_no" @input="inputChangeHandler" />
			</div>
			<div class="box_bottom">结算人身份证号</div>
		</div>
		
		<!-- 结算人姓名 -->
		<div class="input_box" v-if="isShowAuthor || formData.account_type === 4">
			<div class="box_top" v-if="isShowAuthor && formData.account_type === 4">
				<span><i style="color: red;">*</i>结算人姓名</span>
				<van-field v-model="formData.account_person" @input="inputChangeHandler" />
			</div>
			<div class="box_top" v-else>
				<span><i style="color: red;">*</i>结算账户名</span>
				<van-field v-model="formData.account_person" @input="inputChangeHandler" />
			</div>
			<div class="box_bottom">结算名</div>
		</div>

		<!-- 银行卡号 -->
	<!-- 	<div class="input_box">
			<div class="box_top">
				<span><i style="color: red;">*</i>银行卡号</span>
				<van-field v-model="formData.account_bank_no" @input="inputChangeHandler" />
			</div>
			<div class="box_bottom">商户负责人银行卡卡号</div>
		</div> -->
		<!-- 银行卡照片 -->
		<div class="input_box" v-show="this.isOp != 1">
			<div class="box_img">
				<div class="img_title">
					<span><i style="color: red;">*</i>银行卡照片</span>
				</div>
				<div v-if="isMobile" class="img_wrapper">
					<div class="img_item" @click="showUploadTypeHandler('bank_card_pica')">
						<ApplyImage img-desc="银行卡(正面) 请选择一类卡" :img-src="picture.bank_card_pica" />
					</div>
					<div class="img_item" @click="showUploadTypeHandler('bank_card_picb')">
						<ApplyImage img-desc="银行卡(反面) 请选择一类卡" :img-src="picture.bank_card_picb" />
					</div>
				</div>
				<div v-else class="img_wrapper">
					<div class="img_item">
						<div v-if="picture.bank_card_pica" class="top_delete">
							<i class="van-icon van-icon-delete" @click="deletePicture('bank_card_pica')"></i>
						</div>
						<ApplyImage img-desc="银行卡(正面) 请选择一类卡" :img-src="picture.bank_card_pica"
							:style="picture.bank_card_pica ? 'visibility: visible;' : 'visibility: hidden;'" />
						<van-uploader v-if="!picture.bank_card_pica" class="top_div" :preview-image="false"
							name="bank_card_pica" :after-read="afterRead" upload-text="银行卡(正面) 请选择一类卡" />
					</div>
					<div class="img_item">
						<div v-if="picture.bank_card_picb" class="top_delete">
							<i class="van-icon van-icon-delete" @click="deletePicture('bank_card_picb')"></i>
						</div>
						<ApplyImage img-desc="银行卡(反面) 请选择一类卡" :img-src="picture.bank_card_picb"
							:style="picture.bank_card_picb ? 'visibility: visible;' : 'visibility: hidden;'" />
						<van-uploader v-if="!picture.bank_card_picb" class="top_div" :preview-image="false"
							name="bank_card_picb" :after-read="afterRead" upload-text="银行卡(反面) 请选择一类卡" />
					</div>
				</div>
			</div>
		</div>
		
		
		<!-- 银行卡号 -->
		<div class="input_box">
			<div class="box_top">
				<span v-if="this.isOp == 0"><i style="color: red;">*</i>银行卡号</span>
				<span v-if="this.isOp == 1"><i style="color: red;">*</i>银行账户</span>
				<van-field v-model="formData.account_bank_no" @input="inputChangeHandler" />
			</div>
			<div class="box_bottom"  v-if="this.isOp == 0">商户负责人银行卡卡号</div>
			<div class="box_bottom"  v-if="this.isOp == 1">商户负责人银行账户号</div>
		</div>
		
		
		<!-- 所在地 -->
		
		<div class="input_box" @click="showSelectAreaHandler">
			<div class="box_top algin_right">
				<i style="color: red;">*</i>
				<van-cell  v-if="this.isOp == 0" title="银行卡所在地" :value="bank_address" />
				<van-cell  v-if="this.isOp == 1" title="银行账户所在地" :value="bank_address" />
				<img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
			</div>
		</div>
		<!-- 银行卡开户行 -->
		<div class="input_box" @click="showSelectBankHandler">
			<div class="box_top algin_right">
				<i style="color: red;">*</i>
				<van-cell  v-if="this.isOp == 0" title="银行卡开户行" :value="bank_name" />
				<van-cell  v-if="this.isOp == 1" title="银行账户开户行" :value="bank_name" />
				<img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
			</div>
		</div>
		<!-- 支行 -->
		<div class="input_box" @click="showSelectBankUnionHandler">
			<div class="box_top algin_right">
				<i style="color: red;">*</i>
				<van-cell v-if="this.isOp == 0" title="银行卡支行" :value="bank_union_name" />
				<van-cell v-if="this.isOp == 1" title="银行账户支行" :value="bank_union_name" />
				<img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
			</div>
		</div>

		<!-- 结算类型 -->
		<van-action-sheet v-model="showAccountType" :actions="account_type_list" @select="onAccountSelectHandler" />
		<!-- 上传类型 -->
		<van-action-sheet v-model="showUploadType" :actions="upload_type_list" @select="onUploadSelectHandler" />
		<!-- 银行所在地 -->
		<van-popup v-model="areaListShow" position="bottom">
			<van-area :columns-num="2" value="4101" :area-list="areaList" @confirm="areaConfirm" @cancel="areaCancel" />
		</van-popup>
		<!-- 银行picker -->
		<van-popup v-model="bankListShow" position="bottom">
			<van-picker :columns="bankList" show-toolbar value-key="bank_name" :loading="bankLoading"
				@confirm="bankConfirm" @cancel="bankCancel" />
		</van-popup>
		<!-- 支行picker -->
		<van-popup v-model="bankUnionListShow" position="bottom">
			<form action="/">
			  <van-search
			    v-model="search_value"
			    placeholder="请输入搜索支行"
			    @search="onSearch"
			  />
			</form>
			<van-picker :columns="bankUnionList" show-toolbar value-key="union_name" :loading="bankUnionLoading"
				@confirm="bankUnionConfirm" @cancel="bankUnionCancel" >
				
			</van-picker>
		</van-popup>
		<van-popup v-model="idcard_show" position="bottom">
			<van-datetime-picker v-model="currentDate" type="date" title="身份证有效期开始" :min-date="minDate"
				:max-date="maxDate" @confirm="ok_idcard" />
		</van-popup>
		<van-popup v-model="idcard_show2" position="bottom">
			<van-datetime-picker v-model="currentDate" type="date" title="身份证有效期结束" :min-date="minDate"
				:max-date="maxDate" @confirm="ok_idcard2" />
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
	import AreaBank from '@/assets/js/area_bank.js'
	import Exif from 'exif-js'
	import axios from 'axios'
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
				bankListShow: false,
				showAccountType: false,
				idcard_show: false,
				idcard_show2: false,
				search_value:'',
				account_type_list: [{
						name: '对私-法人',
						key: 1
					},
					{
						name: '对私-非法人',
						key: 3
					},
					{
						name: '对公-营业执照名',
						key: 2
					},
					{
						name: '对公-非营业执照名',
						key: 4
					},

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
				areaList: AreaBank,
				areaListShow: false,
				bankList: [],
				bankLoading: true,
				bankUnionListShow: false,
				bankUnionList: [],
				//保存原始银行信息列表
				bank_Lists : [],
				
				bankUnionLoading: true,
				isShowAuthor: false,
				minDate: new Date(1980, 1, 1),
				maxDate: new Date(2090, 10, 1),
				currentDate: new Date(2020, 1, 17),
				isOp:0,
			}
		},
		
		computed: {
			account_type_text() {
				// return this.apply_info.account_type === 1 ? '对私-法人' : '对公'
				if (this.apply_info.account_type == 1) {
					this.isShowAuthor = false
					return '对私-法人'
				} else if (this.apply_info.account_type == 2) {
					this.isShowAuthor = false
					return '对公-营业执照名'
				} else if(this.apply_info.account_type == 4){
					this.isShowAuthor = false
					return '对公-非营业执照名'
				} else {
					this.isShowAuthor = true
					return '对私-非法人'
				}
			},
			isXiaowei() {

				return this.apply_info.license_type === 'xiaowei'
			},
			formData() {
				return this.apply_info
			},
			bank_name() {
				return this.bank_obj.bank_name
			},
			bank_union_name(){
				return this.bank_obj.bank_union_name
			},
			bank_address() {
				return this.bank_obj.bank_address
			},
			bank_code() {
				return this.bank_obj.bank_code
			},
			bank_city_code() {
				return this.bank_obj.bank_city_code
			},
			...mapGetters([
				'apply_info',
				'picture',
				'bank_obj'
			])
		},
		watch: {
			'bank_code'() {
				if (this.bank_city_code) {
					this.getbankUnionHandler()
				}
			},
			'bank_city_code'() {
				this.getBankListHandler()
				this.getbankUnionHandler()
				// this.bank_union_name = ''
			},
			
			account_type_text(res){
				if(res === '对公-营业执照名' || res === '对公-非营业执照名'){
					this.isOp = 1
				}else{
					this.isOp = 0
				}
			}
		},
		created() {
			this.getPlatform()
			if (this.bank_city_code) {
				this.getBankListHandler()
			}
			if (this.bank_city_code && this.bank_code) {
				this.getbankUnionHandler()
			}
			if (this.apply_info.account_type == 2 || this.apply_info.account_type == 4) {
				this.isOp = 1
			} 

		},
		methods: {
			onSearch(){
				console.log(this.search_value)
				// console.log(this.bankUnionList)
				// this.bankUnionList = this.bankUnionList.map((item) =>{
				// 	if(item.union_name.indexOf(this.search_value)){
				// 		return item
				// 	}
				// })
				this.bank_Lists = this.bankUnionList
				const res = this.bankUnionList.filter( item => {
					return item.union_name.indexOf(this.search_value.trim()) != -1
				})
				this.bankUnionList = res
				
			},
			// 上传图片
			afterRead(file, detail) {
				const name = detail.name
				this.upload_type = name
				this.files.name = file.file.name // 获取文件名
				this.files.type = file.file.type // 获取类型
				this.imgPreview(file.file,name)
			},
			// 删除图片
			deletePicture(upload_type) {
				let picture = this.picture
				picture[upload_type] = ''
				this.set_picture(picture)
				this.picture[upload_type] = ''
			},
			// 处理图片
			imgPreview(file,name) {
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
							self.postImg(this.result,name)
						} else {
							img.onload = function() {
								let data = self.compress(img, Orientation)
								// 上传图片
								self.postImg(data,name)
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
			postImg(base64,name) {
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

						let data = {
							...this.apply_info,
							...this.formData
						}
						this.set_apply_info(data)
						this.$toast.clear();
						// this.lazyTimer = setTimeout(() => {
						// 	this.$toast.success(res.msg)
						// }, 100)
						
						// this.$toast.clear();
						// console.log(name)
						if(name == 'legal_identity_pica'){
							this.idCardIdentification(res.data.url)
						}else if(name == 'account_identity_pica'){
							this.accountIdCardIdentification(res.data.url)
						}else if(name == 'bank_card_pica'){
							this.idbankCard(res.data.url)
						}
						
					} else {
						this.$toast.fail(res.msg)
					}
					// this.hideProgress()
				})
			},
			getPlatform() {
				this.isMobile = this.systemType !== 'web'
			},
			showSelectBankUnionHandler() {
				if (this.bank_code === '') {
					this.$dialog.alert({
						message: '请先选择银行'
					})
					return false
				}
				this.bankUnionList = this.bank_Lists
				this.bankUnionListShow = true
			},
			bankUnionConfirm(value) {
				this.formData.bank_id = value.id

				let obj = this.bank_obj
				obj.bank_union_name = value.union_name
				this.set_bank_obj(obj)

				this.bankUnionListShow = false
				let data = {
					...this.apply_info,
					...this.formData
				}
				this.set_apply_info(data)
			},
			bankUnionCancel() {
				this.bankUnionListShow = false
			},
			getbankUnionHandler() {
				request.get_bank_union_list(this.bank_city_code, this.bank_code).then(res => {
					if (res.code === this.SUCCESS_CODE) {
						this.bankUnionList = res.data
						this.bank_Lists = res.data
						this.bankUnionLoading = false
					} else {
						this.$toast.fail(res.msg)
					}
				})
			},
			showSelectBankHandler() {
				if (this.bank_city_code === '') {
					this.$dialog.alert({
						message: '请先选择地区'
					})
					return false
				}
				this.bankListShow = true
			},
			bankConfirm(value) {
				let data = this.bank_obj
				data.bank_code = value.bank_code
				data.bank_name = value.bank_name
				this.set_bank_obj(data)
				this.bankListShow = false
			},
			bankCancel() {
				this.bankListShow = false
			},
			idcard_time(e) {
				if (e == '1') {
					this.idcard_show = true
					this.currentDate = new Date(this.formData.idcard_validity_start ? this.formData.idcard_validity_start :
						new Date(2020, 1, 17))
				} else if (e == '2') {
					this.currentDate = new Date(this.formData.idcard_validity_end ? this.formData.idcard_validity_end :
						new Date(this.formData.idcard_validity_start))

					this.idcard_show2 = true
				}

			},
			ok_idcard(value) {
				var currentDate = this.timeFormat(value)
				this.formData.idcard_validity_start = currentDate
				let data = {
					...this.apply_info,
					...this.formData
				}
				this.set_apply_info(data)
				// this.currentDate = new Date(2020, 1, 17)
				this.idcard_show = false
			},
			ok_idcard2(value) {
				var currentDate = this.timeFormat(value)
				this.formData.idcard_validity_end = currentDate
				let data = {
					...this.apply_info,
					...this.formData
				}
				this.set_apply_info(data)
				// this.currentDate = new Date(2020, 1, 17)
				this.idcard_show2 = false
			},
			timeFormat(time) { // 时间格式化 2019-09-08

				let year = time.getFullYear();

				let month = (time.getMonth() + 1).toString().padStart(2, '0');;

				let day = (time.getDate()).toString().padStart(2, '0');

				return year + '-' + month + '-' + day
			},
			getBankListHandler() {
				request.get_bank_list(this.bank_city_code).then(res => {
					if (res.code === this.SUCCESS_CODE) {
						this.bankList = res.data
						this.bankLoading = false
					} else {
						this.$toast.fail(res.msg)
					}
				})
			},
			showSelectAreaHandler() {
				this.areaListShow = true
			},
			// 确认选择地址
			areaConfirm(options) {
				if (options) {
					let str = options[0].name + options[1].name
					let data = this.bank_obj
					data.bank_city_code = options[1].code
					data.bank_address = str
					this.set_bank_obj(data)
				}
				this.areaListShow = false
			},
			// 取消选择地址
			areaCancel() {
				this.areaListShow = false
			},
			showUploadTypeHandler(type) {
				this.showUploadType = true
				this.upload_type = type
			},
			onUploadSelectHandler(item) {
				let key = item.key
				this.upload_key = key
				this.showUploadType = false
				UtilchooseImage(this).then(result => {
					request.post_common_upload(result).then(res => {
						// ***
						// this.$dialog.alert({
						//   message: 'file: ' + result + '\n\n' + JSON.stringify(res)
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
			selectAccountTypeHandler() {
				this.showAccountType = true
			},
			//身份证识别
			idCardIdentification(res){
				request.post_get_id_identity(res).then(res => {
					if (res.code === 0) {
						if(res.data){
							this.formData.legal_identity_no = res.data
							this.$toast.success('请核对法人身份证号信息')	
						}else{
							this.$toast.success('未能识别到身份证号信息，请手动输入')	
						}
						
					}else{
						this.$toast.fail('识别身份证信息失败，请手动填写')	
					}
				}).catch(() => {
					this.$toast.fail('识别错误，请手动输入信息')
				})
			},
			//银行卡识别
			idbankCard(res){
				request.post_get_id_idbankCard(res).then(res => {
					if (res.code === 0) {
						if(res.data){
							this.formData.account_bank_no = res.data
							this.$toast.success('请核对银行卡信息')	
						}else{
							this.$toast.success('未能识别到银行卡号信息，请手动输入')	
						}
						
					}else{
						this.$toast.fail('识别银行卡信息失败，请手动填写')	
					}
				}).catch(() => {
					this.$toast.fail('识别错误，请手动输入信息')
				})
			},
			//结算人身份证识别
			accountIdCardIdentification(res){
				request.post_get_id_identity(res).then(res => {
					if (res.code === 0) {
						if(res.data){
							this.formData.account_identity_no = res.data
							this.$toast.success('请核对结算人身份证号信息')	
						}else{
							this.$toast.success('未能识别到结算人身份证号信息，请手动输入')	
						}
						
					}else{
						this.$toast.fail('识别身份证信息失败，请手动填写')	
					}
				}).catch(() => {
					this.$toast.fail('识别错误，请手动输入信息')
				})
			},
			onAccountSelectHandler(item) {
				let key = item.key
				this.formData.account_type = key
				let data = {
					...this.apply_info,
					...this.formData
				}
				this.set_apply_info(data)
				this.showAccountType = false
			},
			inputChangeHandler() {

				let data = {
					...this.apply_info,
					...this.formData
				}
				this.set_apply_info(data)
			},
			...mapMutations({
				set_picture: 'SET_PICTURE',
				set_apply_info: 'SET_APPLY_INFO',
				set_bank_obj: 'SET_BANK_OBJ'
			})
		}
	}
</script>
