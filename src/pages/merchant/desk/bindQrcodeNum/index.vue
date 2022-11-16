<template>
  <div id="bindQrcodeNum" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="bind_head" v-show="number == '0'">
      绑定“{{shopName}}”的收款编号
    </div>
    <div class="bind_head" v-show="number != '0'">
      商家“{{shopName}}”的收款编号
    </div>
    <div class="bind_box" @click="showKeyBoard">
      <input ref="input" v-show="number == '0'" type="tel" maxlength="7" class="realInput" autofocus="autofocus" v-model="code" @input="getNum()" @keydown="delNum()">
      <input v-show="number != '0'" readonly="readonly" type="tel" maxlength="7" class="realInput" v-model="code">
      <div class="input_item" v-for="(disInput, index) in values" :key="index">
        {{disInput.value}}
      </div>
    </div>
    <div class="bind_message" v-show="number == '0'">
      请认真核对，添加成功后无法更改！
    </div>
    <div class="bind_button">
      <a href="javascript:;" v-if="!isBind && level !='cashier'" @click="addQrcodeNumber" :class="[number ? 'disable' : '']">{{btnText}}</a>
      <a href="javascript:;" v-if="isBind && level !='cashier'" @click="unBindQrcodeNumber" :class="[number ? 'disable' : '']">解绑</a>
    </div>

    <van-number-keyboard
      :show="keyShow"
      extra-key="."
      close-button-text="完成"
      @blur="keyShow = false"
      @input="onInput"
      @delete="onDelete"
    />
  </div>
</template>
<script>
import NavBar from '@/components/navBar'
import * as request from '@/api'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      keyShow: false,
      meta: this.$route.meta,
      code: '',
      number: '',
      desk_id: null,
      shopName: '',
      isPost: false,
      btnText: '添  加',
      isBind: false,
      values: [{value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}]
    }
  },
  computed: {
    ...mapGetters(['sub_uid','user_info']),
	level(){
		return this.user_info.level
	}
  },
  created () {
    this.$nextTick(() => {
      this.shopName = this.$route.params.name
      this.desk_id = this.$route.params.desk_id
      this.number = this.$route.params.number
	  console.log(this.$route.params)
      if (this.number) {
        this.code = this.number.toString()
        this.btnText = '已绑定'
        this.getNum()
        if (!this.sub_uid) {
          this.isBind = true
        }
      }
    })
  },
  methods: {
    showKeyBoard () {
      if (this.isBind) {
        return false
      }
      this.keyShow = true
    },
    onInput (value) {
      this.code = `${this.code}${value}`
      this.getNum()
    },
    onDelete () {
      if (this.code.length > 0) {
        this.values[this.code.length - 1].value = ''
        this.code = this.code.slice(0, -1)
      }
    },
    unBindQrcodeNumber () {
      this.$dialog.confirm({
        message: '确认解绑二维码编号？'
      }).then(() => {
        // on confirm
        this.unBindQrcodeNumberCallBack()
      }).catch(() => {
        // on cancel
      })
    },
    unBindQrcodeNumberCallBack () {
      let data = {
        id: this.desk_id
      }
      request.post_del_qrcode(data).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          this.$toast.success(res.msg)
          this.isBind = false
          this.number = ''
          this.btnText = '添  加'
          this.code = ''
          this.values = [{value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}]
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    addQrcodeNumber () {
      if (this.number) {
        return false
      }
      let qrcode_number = this.code
      if (qrcode_number.length != 7) {
        this.$dialog.alert({
          message: '请填写正确的收款编号'
        })
        return false
      }
      let _this = this
      this.$dialog.confirm({
        message: `确认绑定收款编号：${qrcode_number}`
      }).then(() => {
        let data = {
          qrcode_number: qrcode_number,
          id: this.desk_id
        }
        if (this.sub_uid) {
          request.post_selesman_add_code(data).then(res => {
            this.successCallBack(res)
          })
        } else {
          request.post_desk_codenums(data).then(res => {
            this.successCallBack(res)
          })
        }
      }).catch(() => {
        // on cancel
      })
    },
    successCallBack (res) {
      if (res.code === this.SUCCESS_CODE) {
        this.$toast.success(res.msg)
        setTimeout(() => {
          this.goBack()
        }, 1000)
      } else {
        this.$toast.fail(res.msg)
      }
    },
    getNum () {
      if (!this.code) {
        return false
      }
      let code = this.code
      if (code.length >= 7) {
        code = code.slice(0, 7)
        this.code = code
      }
      code = code.split('')
      code.forEach((item, index) => {
        this.values[index].value = item
      })
    }
  }
}
</script>
<style lang="less">
</style>
