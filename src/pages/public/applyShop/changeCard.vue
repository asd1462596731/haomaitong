<template>
  <div id="changeCard" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="apply_result">
      {{apply_tip}}
    </div>
    <div class="applyShop_form">
      <div class="form_content">
        <!-- 结算类型 -->
        <div class="input_box" @click="selectAccountTypeHandler" v-show="licenseType !== 'xiaowei'">
          <div class="box_top algin_right">
            <van-cell title="结算类型" :value="account_type_text" />
            <img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
          </div>
        </div>
        <!-- 银行卡开户名 -->
        <div class="input_box">
          <div class="box_top">
            <span>银行卡开户名</span>
            <van-field :readonly="readyOnly" v-model="formData.account_person" />
          </div>
          <div class="box_bottom">在顾客消费付款码中展示</div>
        </div>
        <!-- 银行卡开户名 -->
        <div class="input_box">
          <div class="box_top">
            <span>银行卡号</span>
            <van-field v-model="formData.account_bank_no" />
          </div>
          <div class="box_bottom">结算人银行卡卡号</div>
        </div>
        <!-- 商户信息变更表 -->
        <div class="input_box">
          <div class="box_img only_one">
            <div class="img_title">
              <span>商户信息变更表</span>
            </div>
            <div v-if="isMobile" class="img_wrapper">
              <div class="img_item" @click="showUploadTypeHandler('modify_pic')">
                <ApplyImage img-desc="商户信息变更表" :img-src="picture_list.modify_pic" />
              </div>
            </div>
            <div v-else class="img_wrapper">
              <div class="img_item">
                <div v-if="picture_list.modify_pic" class="top_delete">
                  <i class="van-icon van-icon-delete" @click="deletePicture('modify_pic')"></i>
                </div>
                <ApplyImage
                  img-desc="商户信息变更表"
                  :img-src="picture_list.modify_pic"
                  :style="picture_list.modify_pic ? 'visibility: visible;' : 'visibility: hidden;'"
                />
                <van-uploader
                  v-if="!picture_list.modify_pic"
                  class="top_div"
                  :preview-image="false"
                  name="modify_pic"
                  :after-read="afterRead"
                  upload-text="商户信息变更表"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- 银行卡照片 -->
        <div class="input_box">
          <div class="box_img">
            <div class="img_title">
              <span>银行卡照片</span>
            </div>
            <div v-if="isMobile" class="img_wrapper">
              <div class="img_item" @click="showUploadTypeHandler('bank_card_pica')">
                <ApplyImage img-desc="银行卡(正面) 请选择一类卡" :img-src="picture_list.bank_card_pica" />
              </div>
              <div class="img_item" @click="showUploadTypeHandler('bank_card_picb')">
                <ApplyImage img-desc="银行卡(反面) 请选择一类卡" :img-src="picture_list.bank_card_picb" />
              </div>
            </div>
            <div v-else class="img_wrapper">
              <div class="img_item">
                <div v-if="picture_list.bank_card_pica" class="top_delete">
                  <i class="van-icon van-icon-delete" @click="deletePicture('bank_card_pica')"></i>
                </div>
                <ApplyImage
                  img-desc="银行卡(正面) 请选择一类卡"
                  :img-src="picture_list.bank_card_pica"
                  :style="picture_list.bank_card_pica ? 'visibility: visible;' : 'visibility: hidden;'"
                />
                <van-uploader
                  v-if="!picture_list.bank_card_pica"
                  class="top_div"
                  :preview-image="false"
                  name="bank_card_pica"
                  :after-read="afterRead"
                  upload-text="银行卡(正面) 请选择一类卡"
                />
              </div>
              <div class="img_item">
                <div v-if="picture_list.bank_card_picb" class="top_delete">
                  <i class="van-icon van-icon-delete" @click="deletePicture('bank_card_picb')"></i>
                </div>
                <ApplyImage
                  img-desc="银行卡(反面) 请选择一类卡"
                  :img-src="picture_list.bank_card_picb"
                  :style="picture_list.bank_card_picb ? 'visibility: visible;' : 'visibility: hidden;'"
                />
                <van-uploader
                  v-if="!picture_list.bank_card_picb"
                  class="top_div"
                  :preview-image="false"
                  name="bank_card_picb"
                  :after-read="afterRead"
                  upload-text="银行卡(反面) 请选择一类卡"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 	结算人身份证号 -->
        <div class="input_box">
          <div class="box_top">
            <span>身份证号</span>
            <van-field :readonly="readyOnly" v-model="formData.account_identity_no" />
          </div>
        </div>
        <!-- 开户许可证 -->
        <div class="input_box" v-show="formData.account_type === 2">
          <div class="box_img only_one">
            <div class="img_title">
              <span>开户许可证</span>
            </div>
            <div v-if="isMobile" class="img_wrapper">
              <div class="img_item" @click="showUploadTypeHandler('account_license_pic')">
                <ApplyImage img-desc="开户许可证" :img-src="picture_list.account_license_pic" />
              </div>
            </div>
            <div v-else class="img_wrapper">
              <div class="img_item">
                <div v-if="picture_list.account_license_pic" class="top_delete">
                  <i class="van-icon van-icon-delete" @click="deletePicture('account_license_pic')"></i>
                </div>
                <ApplyImage
                  img-desc="商户信息变更表"
                  :img-src="picture_list.account_license_pic"
                  :style="picture_list.account_license_pic ? 'visibility: visible;' : 'visibility: hidden;'"
                />
                <van-uploader
                  v-if="!picture_list.account_license_pic"
                  class="top_div"
                  :preview-image="false"
                  name="account_license_pic"
                  :after-read="afterRead"
                  upload-text="商户信息变更表"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- 所在地 -->
        <div class="input_box" @click="showSelectAreaHandler">
          <div class="box_top">
            <van-cell title="银行卡所在地" :value="bank_address" />
            <img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
          </div>
        </div>
        <!-- 银行卡开户行 -->
        <div class="input_box" @click="showSelectBankHandler">
          <div class="box_top">
            <van-cell title="银行卡开户行" :value="bank_name" />
            <img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
          </div>
        </div>
        <!-- 支行 -->
        <div class="input_box" @click="showSelectBankUnionHandler">
          <div class="box_top">
            <van-cell title="银行卡支行" :value="bank_union_name" />
            <img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
          </div>
        </div>
      </div>
    </div>

    <div class="applyShop_button">
      <a href="javascript:;" class="sure_button" :class="{'disable': disable}" @click="applySubmit">{{button_text}}</a>
    </div>

    <!-- 上传类型 -->
    <van-action-sheet
      v-model="showUploadType"
      :actions="upload_type_list"
      @select="onUploadSelectHandler"
    />
    <!-- 结算类型 -->
    <van-action-sheet
      v-model="showAccountType"
      :actions="account_type_list"
      @select="onAccountSelectHandler"
    />
    <!-- 银行所在地 -->
    <van-popup v-model="areaListShow" position="bottom">
      <van-area :columns-num="2" value="4101" :area-list="areaList" @confirm="areaConfirm" @cancel="areaCancel" />
    </van-popup>
    <!-- 银行picker -->
    <van-popup v-model="bankListShow" position="bottom">
      <van-picker :columns="bankList" show-toolbar value-key="bank_name" :loading="bankLoading" @confirm="bankConfirm" @cancel="bankCancel" />
    </van-popup>
    <!-- 支行picker -->
    <van-popup v-model="bankUnionListShow" position="bottom">
      <van-picker :columns="bankUnionList" show-toolbar value-key="union_name" :loading="bankUnionLoading" @confirm="bankUnionConfirm" @cancel="bankUnionCancel" />
    </van-popup>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import NavBar from '@/components/navBar'
import ApplyImage from './compontents/public/image'
import * as request from '@/api'
import { UtilchooseImage } from '@/util'
import AreaBank from '@/assets/js/area_bank.js'
import Exif from 'exif-js'
export default {
  components: {
    NavBar,
    ApplyImage
  },
  data () {
    return {
      lazyTime: 0, // 延迟标识
      lazyTimer: null, // 延迟展示
      files: {
        name: '',
        type: ''
      },
      isMobile: true, // 是否手机平台
      readyOnly: true,
      meta: this.$route.meta,
      showAccountType: false,
      showUploadType: false,
      upload_type_list: [
        {
          name: '相册',
          key: 1
        },
        {
          name: '拍照',
          key: 2
        }
      ],

      areaList: AreaBank,
      areaListShow: false,
      bank_address: '',
      bank_city_code: '',
      bank_name: '',
      bank_code: '',
      bankList: [],
      bankLoading: true,
      bankUnionListShow: false,
      bankUnionList: [],
      bankUnionLoading: true,
      bank_union_name: '',
      bankListShow: false,
      button_text: '申请换绑',
      apply_tip: '只更换银行卡信息，不更换结算人',

      account_type_list: [
        {
          name: '对私-法人',
          key: 1
        },
        {
          name: '对公',
          key: 2
        }
      ],
      formData: {
        merchant_id: null,
        account_type: null,
        account_person: '',
        account_bank_no: '',
        bank_id: '',
        modify_pic: '',
        bank_card_pica: '',
        bank_card_picb: '',
        account_identity_no: '',
        account_license_pic: ''
      },
      picture_list: {
      },
      disable: false,
      upload_type: ''
    }
  },
  computed: {
    licenseType () {
      return this.apply_info.license_type
    },
    merchant_id () {
      return this.apply_info.id
    },
    account_type_text () {
      return this.formData.account_type === 1 ? '对私-法人' : '对公'
    },
    ...mapGetters(['user_info', 'apply_info', 'picture'])
	
  },
  created () {
    this.getPlatform()
    this.$nextTick(() => {
      this.getChangeCardInfo()
    })
  },
  methods: {
    // 上传图片
    afterRead (file, detail) {
      const name = detail.name
      this.upload_type = name
      this.files.name = file.file.name // 获取文件名
      this.files.type = file.file.type // 获取类型
      this.imgPreview(file.file)
    },
    // 删除图片
    deletePicture (upload_type) {
      let picture = this.picture_list
      picture[upload_type] = ''
      this.set_picture(picture)
      this.picture_list[upload_type] = ''
    },
    // 处理图片
    imgPreview (file) {
      let self = this
      let Orientation
      // 去获取拍照时的信息，解决拍出来的照片旋转问题   npm install exif-js --save   这里需要安装一下包
      Exif.getData(file, function () {
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
        reader.onloadend = function () {
          let result = this.result
          let img = new Image()
          img.src = result
          // 判断图片是否大于500K,是就直接上传，反之压缩图片
          if (this.result.length <= 500 * 1024) {
            // 上传图片
            self.postImg(this.result)
          } else {
            img.onload = function () {
              let data = self.compress(img, Orientation)
              // 上传图片
              self.postImg(data)
            }
          }
        }
      }
    },
    // 压缩图片
    compress (img, Orientation) {
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
    rotateImg (img, direction, canvas) {
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
    dataURLtoFile (dataurl) {
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
    postImg (base64) {
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
          let picture = this.picture_list
          picture[this.upload_type] = res.data.url
          this.set_picture(picture)

          let data = { ...this.apply_info, ...this.formData }
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
    getPlatform () {
      this.isMobile = this.systemType !== 'web'
    },
    applySubmit () {
      if (this.disable) {
        let status = this.formData.sxf_status
        if (status === 'wait' || status === 'auditing') {
          this.$dialog.alert({
            message: '请耐心等待审核'
          })
        }
        return false
      }
      request.post_merchant_modify(this.formData).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          this.$dialog.alert({
            message: res.msg
          }).then(() => {
            this.goBack()
          })
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    getChangeCardInfo () {
      request.get_merchant_modify(this.merchant_id).then(res => {
        if (res.code === this.SUCCESS_CODE) {
			
          let data = res.data
          if (data.merchant_modify) {
            this.formData = data.merchant_modify
            this.picture_list = data.picture
			this.bank_address = data.picture.city
			this.bank_name = data.picture.bank_name
			this.bank_union_name = data.picture.union_name
            let status = this.formData.sxf_status
            if (status === 'wait') {
              this.apply_tip = '审核结果：待审核，请等待'
              this.disable = true
            }
            if (status === 'auditing') {
              this.apply_tip = '审核结果：正在审核中，请等待'
              this.disable = true
            }
            if (status === 'success') {
              this.apply_tip = '审核结果：审核成功'
            }
            if (status === 'back') {
              this.apply_tip = '平台驳回：' + this.formData.memo
            }
            if (status === 'reject') {
              this.apply_tip = '第三方驳回：' + this.formData.memo
            }
          } else {
            this.formData = this.apply_info
            this.picture_list = this.picture
          }
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    showSelectBankUnionHandler () {
      if (this.bank_code === '') {
        this.$dialog.alert({
          message: '请先选择银行'
        })
        return false
      }
      this.bankUnionListShow = true
    },
    showSelectBankHandler () {
      if (this.bank_city_code === '') {
        this.$dialog.alert({
          message: '请先选择地区'
        })
        return false
      }
      this.bankListShow = true
    },
    showSelectAreaHandler () {
      this.areaListShow = true
    },
    bankUnionConfirm (value) {
      this.formData.bank_id = value.id
      this.bank_union_name = value.union_name
      this.bankUnionListShow = false
    },
    bankUnionCancel () {
      this.bankUnionListShow = false
    },
    onUploadSelectHandler (item) {
      let key = item.key
      this.upload_key = key
      this.showUploadType = false
      UtilchooseImage(this).then(result => {
        request.post_common_upload(result).then(res => {
          if (res.code === this.SUCCESS_CODE) {
            this.$toast.success(res.msg)
            this.formData[this.upload_type] = res.data.key
            this.picture_list[this.upload_type] = res.data.url
          } else {
            this.$toast.fail(res.msg)
          }
          this.hideProgress()
        })
      }).catch(() => {
        this.$toast.fail('选取失败')
      })
    },
    getbankUnionHandler () {
      request.get_bank_union_list(this.bank_city_code, this.bank_code).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          this.bankUnionList = res.data
          this.bankUnionLoading = false
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    bankConfirm (value) {
      this.bank_code = value.bank_code
      this.bank_name = value.bank_name
      this.bankListShow = false
      this.getbankUnionHandler()
    },
    bankCancel () {
      this.bankListShow = false
    },
    getBankListHandler () {
      request.get_bank_list(this.bank_city_code).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          this.bankList = res.data
          this.bankLoading = false
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    // 确认选择地址
    areaConfirm (options) {
      if (options) {
        let str = options[0].name + options[1].name
        this.bank_address = str
        this.bank_city_code = options[1].code
        this.getBankListHandler()
      }
      this.areaListShow = false
    },
    // 取消选择地址
    areaCancel () {
      this.areaListShow = false
    },
    // 打开上传类型选择
    showUploadTypeHandler (type) {
      this.showUploadType = true
      this.upload_type = type
    },
    selectAccountTypeHandler () {
      this.showAccountType = true
    },
    onAccountSelectHandler (item) {
      let key = item.key
      this.formData.account_type = key
      this.showAccountType = false
    },
    ...mapMutations({
      // set_change_card_info: 'SET_CHANGE_CARD_INFO'
	  set_picture: 'SET_PICTURE',
	  set_apply_info: 'SET_APPLY_INFO',
	  set_user_info:'SET_APPLY_INFO'
    })
  }
}
</script>
