<template>
  <div id="feedBack" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="feed_form">
      <div class="form_textarea" @click="inputFocus">
        <textarea ref="input" placeholder="请输入你要反馈的问题或建议,请输入你要反馈的问题或建议" v-model="textVal"></textarea>
        <div class="textLenght" :class="{'red': textVal.length > maxLength}">
          {{textVal.length}}/{{maxLength}}
        </div>
      </div>
      <div class="form_upload">
        <!-- <div class="upload_item">
          <img :src="item" alt="">
        </div> -->
        <div class="upload_item" v-if="imgList.length < 3">
          <img src="@/assets/img/mine/mine_icon14.png" alt="">
        </div>
      </div>
      <div class="form_btn">
        <a href="javascript:;" class="sure_button" :class="{'disable': !isCanSubmit}">提    交</a>
      </div>
    </div>
  </div>
</template>
<script>
import NavBar from '@/components/navBar'
import * as request from '@/api'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      meta: this.$route.meta,
      textVal: '',
      maxLength: 60,
      isCanSubmit: false,
      showPhoto: false,
      menusPhoto: {
        1: '从相册中选择',
        2: '拍摄照片'
      },
      getPicKey: 1,
      imgList: [],
      changeImgIndex: -1
    }
  },
  methods: {
    inputFocus (val) {
      this.$refs.input.focus()
    }
  }
}
</script>
