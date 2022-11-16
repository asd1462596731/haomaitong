<template>
  <div id="userInfo" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="content">
      <div class="content_title">
        基本信息
      </div>
      <div class="content_box">
        <div class="content_item">
          <span class="item_left">头像</span>
          <div class="item_right">
        <!--  <img v-if="user_info.avatar" class="right_photo" :src="user_info.avatar" alt="">
            <img v-if="!user_info.avatar" class="right_photo" src="@/assets/img/mine/mine_icon1.png" alt="">
			 <van-icon name="close" @click="delImg(nn)" class="delte"/>
            <img class="right_icon" src="@/assets/img/public/public_icon2.png" alt=""> -->
			<!-- <van-uploader
			   v-model="ImageUrl"
			   :after-read="afterRead"
			   :preview-full-image='false'
			   :max-count='1'
			   class="img"
			 /> -->
			  <van-uploader :after-read="afterRead" accept="image/*">
			               <img class="right_photo"
			                 :src=" ImageUrl ? ImageUrl : require('@/assets/img/mine/mine_icon1.png')" />
			               <!-- <van-tag type="danger" class="vip" size="medium">VIP</van-tag> -->
			               <!-- <div class="personCompany">{{loginType==0?"个人用户":"企业用户"}}</div> -->
			           </van-uploader>
			 
          </div>
		  
        </div>
		
		<!-- <Img :img-src="user_info.avatar" :style="user_info.avatar ? 'visibility: visible;' : 'visibility: hidden;'"/> -->
		<!-- <div class="content_item">
		  <span class="item_left">头像</span>
		  <div class="item_right">
			<van-uploader v-model="ImageUrl" :after-read="avatar"   name="store_inside_pic" :max-count='1'/>
			
		  </div>
		</div> -->
		<!-- <van-uploader :after-read="afterRead" /> -->
        <!-- <div v-else class="content_item" @click="handShowPhoto">
          <span class="item_left">头像</span>
          <div class="item_right">
            <img v-if="user_info.avatar" class="right_photo" :src="user_info.avatar" alt="">
            <img v-if="!user_info.avatar" class="right_photo" src="@/assets/img/mine/mine_icon1.png" alt="">
            <div class="img_item">
              <div v-if="picture.legal_identity_pica" class="top_delete">
                <i class="van-icon van-icon-delete" @click="deletePicture('legal_identity_pica')"></i>
              </div>
              <ApplyImage
                img-desc="身份证正面"
                :img-src="picture.legal_identity_pica"
                :style="picture.legal_identity_pica ? 'visibility: visible;' : 'visibility: hidden;'"
              />
              <van-uploader
                v-if="!picture.legal_identity_pica"
                class="top_div"
                :preview-image="false"
                name="legal_identity_pica"
                :after-read="afterRead"
                upload-text="身份证正面"
              />
            </div>
            <img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
          </div>
        </div> -->
        <div class="content_item" @click="jumpTo('/nickname')">
          <span class="item_left">名称</span>
          <div class="item_right">
            <i>{{user_info.nickname}}</i>
            <img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
          </div>
        </div>
        <div class="content_item" @click="showSelectMaleHandler">
          <span class="item_left">性别</span>
          <div class="item_right">
            <!-- <i>男</i> -->
            <i v-if="user_info.gender === 'male'">男</i>
            <i v-else>女</i>
            <img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
          </div>
        </div>

        <div class="content_item" @click="showSelectAreaHandler">
          <span class="item_left">地区</span>
          <div class="item_right">
            <i v-show="!show_address">请选择地区</i>
            <i v-show="show_address">{{show_address}}</i>
            <img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="content_title">
        认证信息
      </div>
      <div class="content_box">
        <div class="content_item" @click="goToBindPhone">
          <span class="item_left">手机认证</span>
          <div class="item_right">
            <i v-show="!user_info.mobile">未绑定</i>
            <i v-show="user_info.mobile">{{user_info.mobile}}</i>
            <img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
          </div>
        </div>
        <div class="content_item" @click="goToVerified" v-if="user_info.level === 'merchant'">
          <span class="item_left">实名认证</span>
          <div class="item_right">
            <i v-show="user_info.is_auth === 1">已认证</i>
            <i v-show="user_info.is_auth === 0">未认证</i>
            <img class="right_icon" src="@/assets/img/public/public_icon2.png" alt="">
          </div>
        </div>
      </div>
    </div>

    <van-action-sheet
      v-model="isMaleShow"
      :actions="maleActions"
      @select="onMaleSelect"
    />

    <van-popup v-model="areaListShow" position="bottom">
      <van-area value="410101000000" :area-list="areaList" @confirm="areaConfirm" @cancel="areaCancel" />
    </van-popup>
    <!-- 上传类型 -->
    <van-action-sheet
      v-model="showUploadType"
      :actions="upload_type_list"
      @select="onUploadSelectHandler"
    />
    <div class="cropper-box" v-show="showCropper">
      <img src="" ref="img_dom" />
      <div class="tool">
        <div class="buttons">
          <a href="javascript:;" @click="closeCropper">取消</a>
          <a href="javascript:;" @click="resetUpload">重置</a>
          <a href="javascript:;" @click="submitUpload">确定</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import NavBar from '@/components/navBar'
import { mapGetters, mapMutations } from 'vuex'
import areaList from '@/assets/js/area.js'
import areaIdList from '@/assets/js/area_id.js'
import * as request from '@/api'
import { UtilchooseImage } from '@/util'
import Cropper from 'cropperjs'
import Exif from 'exif-js'
import Img from './infos/img'
export default {
  components: {
    NavBar,
	Img
  },
  data () {
    return {
      lazyTime: 0, // 延迟标识
      lazyTimer: null, // 延迟展示
	  ImageUrl:[],
      files: {
        name: '',
        type: ''
      },
      isMobile: true, // 是否手机平台
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
      isMaleShow: false,
      maleActions: [
        {
          name: '男',
          key: 'male'
        },
        {
          name: '女',
          key: 'female'
        }
      ],
      upload_key: '1',
      areaListShow: false,
      meta: this.$route.meta,
      areaList: areaList,
      p_id: 1,
      c_id: null,
      a_id: null,
      show_address: '',
      cropper_options: {
        aspectRatio: 1 / 1,
        minContainerHeight: 300 * this.dpr,
        minContainerWidth: 300 * this.dpr,
        viewMode: 1, // 显示
        background: true,
        rotatable: false,
        guides: false, // 裁剪框虚线 默认true有
        dragMode: 'move',
        center: false // 是否显示裁剪框 中间的+
      },
      showCropper: false,
      rotateVal: 0,
      cropper: null,
      scaleYval: false,
      scaleXval: false,
      upload_key: '',
      upload_url: ''
    }
  },
  computed: {
    ...mapGetters(['user_info', 'user_token','is_web_type'])
  },
  created () {
    this.getPlatform()
    if (!this.user_token) {
      this.noPastTo('/login')
    }
	if(this.user_info.avatar !='' ||  this.user_info.avatar !=null){
		this.ImageUrl = this.user_info.avatar
	}
	  
  }, 
  mounted () {
    this.initCropper()
    if (this.user_info.city && this.user_info.province && this.user_info.area) {
      this.getAddressText()
    }
  },
  methods: {
    // 上传图片
    afterRead (file, detail) {
      const name = detail.name
      this.upload_type = name
      this.files.name = file.file.name // 获取文件名
      this.files.type = file.file.type // 获取类型
	  // this.uploadImgCallBack2(file)
      this.imgPreview(file.file)
    },
    // 删除图片
    deletePicture (upload_type) {
      let picture = this.picture
      picture[upload_type] = ''
      this.set_picture(picture)
      this.picture[upload_type] = ''
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
		
      // this.$toast.loading({
      //   message: '上传中...',
      //   forbidClick: true,
      //   overlay: true,
      //   duration: 0,
      //   loadingType: 'spinner'
      // })
      request.post_common_upload(base64).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          // this.formData[this.upload_type] = res.data.key
          // let picture = this.picture
          // picture[this.upload_type] = res.data.url
          // this.set_picture(picture)
          // let data = { ...this.apply_info, ...this.formData }
          // this.set_apply_info(data)
          // this.lazyTimer = setTimeout(() => {
          //   this.$toast.success(res.msg)
          // }, 100)
		  this.ImageUrl = res.data.url
		  this.upload_key = res.data.key
		  let data = {
		    avatar: this.upload_key
		  }
		  this.updateUserInfo(data)
        } else {
          this.$toast.fail(res.msg)
        }
        // this.hideProgress()
      })
    },
    getPlatform () {
      this.isMobile = this.systemType !== 'web'
    },
    goToVerified () {
      if (this.user_info.is_auth === 1) {
        return false
      }
      this.jumpTo('/verified')
    },
    getAddressText () {
      let { province, city, area } = { ...this.user_info }
      let p_code = ''
      let c_code = ''
      let a_code = ''
      let p_text = ''
      let c_text = ''
      let a_text = ''
      for (const key in areaIdList) {
        if (areaIdList.hasOwnProperty(key)) {
          const element = areaIdList[key]
          if (element === province) {
            p_code = key
            p_text = areaList.province_list[p_code]
          }
          if (element === city) {
            c_code = key
            c_text = areaList.city_list[c_code]
          }
          if (element === area) {
            a_code = key
            a_text = areaList.county_list[a_code]
          }
        }
      }
      this.show_address = `${p_text}${c_text}${a_text}`
    },
    // 去绑定手机
    goToBindPhone () {
      if (this.user_info.mobile) {
        this.jumpTo('/changePhone')
      } else {
        this.jumpTo('/bindPhone')
      }
    },
    handShowPhoto () {
		 this.showUploadType = true
    },
    onUploadSelectHandler (item) {
      let key = item.key
      this.upload_key = key
      this.showUploadType = false
      UtilchooseImage(this).then(result => {
        this.hideProgress()
        this.imageCropper(result)
      }).catch(() => {
        this.$toast.fail('选取失败')
      })
    },
    // 关闭剪裁
    closeCropper () {
      this.showCropper = false
    },
    // 显示剪裁
    imageCropper (url) {
      this.setImg(url)
      this.showCropper = true
    },
    // 设置图片剪裁的img
    setImg (src) {
      this.images.compress({
        url: src,
        width: document.body.offsetWidth,
        height: document.body.offsetHeight,
        success: path => {
          this.cropper.reset().replace(path)
        }
      })
    },
    // 重置 剪裁图片
    resetUpload () {
      this.rotateVal = 0
      this.scaleXval = false
      this.scaleYval = false
      this.cropper.reset()
    },
    // 初始化图片剪裁
    initCropper () {
      this.cropper = new Cropper(this.$refs.img_dom, this.cropper_options)
    },
    // 提交上传
    submitUpload () {
      const img = this.cropper.getCroppedCanvas().toDataURL('image/jpeg')
      this.uploadImgCallBack(img)
    },
    // 上传回调
    uploadImgCallBack (img) {
      this.closeCropper()
      this.showProgress('上传中')
      request.post_common_upload(img).then(res => {
		  
        this.hideProgress()
        if (res.code === this.SUCCESS_CODE) {
          this.upload_key = res.data.key
          let data = {
            avatar: this.upload_key
          }
		  this.ImageUrl = res.data.url
          this.updateUserInfo(data)
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
	
    // 性别
    showSelectMaleHandler () {
      this.isMaleShow = true
    },
    onMaleSelect (item) {
      let key = item.key
      let data = {
        gender: key
      }
      this.updateUserInfo(data)
      this.isMaleShow = false
    },
    // 地区
    showSelectAreaHandler () {
      this.areaListShow = true
    },
    areaConfirm (options) {
      if (options) {
        let p_code = options[0].code
        let c_code = options[1].code
        let a_code = options[2].code
        this.p_id = areaIdList[p_code]
        this.c_id = areaIdList[c_code]
        this.a_id = areaIdList[a_code]

        let data = {
          province: this.p_id,
          city: this.c_id,
          area: this.a_id
        }
        this.updateUserInfo(data)
        let str = ''
        options.forEach(item => {
          str += item.name
        })
        this.show_address = str
      }
      this.areaListShow = false
    },
    areaCancel () {
      this.areaListShow = false
    },
    updateUserInfo (data) {
      request.post_user_modify_info(data).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          this.$toast.success(res.msg)
          let info = { ...this.user_info, ...res.data }
          this.set_user_info(info)
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    ...mapMutations({
      set_user_info: 'UPDATE_USER_INFO'
    })
  }
}
</script>
<style lang="less">
	.van-uploader__upload-icon{
		margin-top: 20px;
	}
	.van-uploader__preview {
	   height: 1.493333rem;
	   width: 1.493333rem;
	   border-radius: 50%;
	}
	.van-uploader__upload, .van-image, .van-uploader__preview-image{
		    height: 1.493333rem;
		    width: 1.493333rem;
		    border-radius: 50%;
	}
	.van-uploader__upload, .van-image, .van-uploader__preview-image{
		      background: transparent;
		    border: 0.02667rem solid #CCCCCC;
		    overflow: hidden;
		    // border-radius: 0.08rem;
	}
	.van-uploader__preview-delete{
		    position: absolute;
		    right: 20px;
			color: #fff;
	}
  .cropper-box{
    width:100%;
    height:100%;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 99999;
    .tool{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
    }
    .buttons{
      height: .866667rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: .266667rem;
      height: 1.6rem;
      background-color: #000000;
      border-top: .033333rem solid #f0f0f0;
      box-sizing: border-box;
      width: 100%;
      a{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 0 .4rem;
        font-size: .373333rem;
        color: #ffffff;
      }
    }
  }
</style>
