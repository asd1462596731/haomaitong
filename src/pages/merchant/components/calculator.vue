<template>
  <!-- 计算器组件 -->
  <div id="calculator">
    <div class="calculator_content">
      <div class="content_str">{{calculator_calc}}</div>
      <div class="content_result">{{calculator_result}}</div>
    </div>
    <div class="calculator_key">
      <div class="key_line" v-for="(item, index) in keyArr" :key="index">
        <div class="key_item" v-for="key in item" :key="key" @click="keyDownHandler(key)">
          {{key}}
        </div>
      </div>
      <div class="key_del" @click="keyDownHandler('del')">
        <img src="@/assets/img/merchant/merchant_icon1.png" alt="">
      </div>
      <div class="key_add" @click="keyDownHandler('add')">
        +
      </div>
    </div>
    <div class="calculator_bottom">
      <div class="bottom_total">
        结算：<span>￥{{calculator_result}}</span>
      </div>
      <div class="bottom_button">
        <a href="javascript:;" @click="modalShowHandler">收  款</a>
      </div>
    </div>
    <!-- <van-popup
      position="bottom"
      :style="{height: 'auto'}"
      v-model="pop_show">
      <div class="modal">
        <div class="modal_title">
          收款：<span>￥{{calculator_result}}</span>
        </div>
        <div class="modal_list">
          <div class="list_title">
            收款方式
          </div>
        </div>
        <div class="modal_nav">
          <div class="modal_item" @click="shareHandler(1)">
            <img src="@/assets/img/merchant/merchant_icon5.png" alt="">
            <span>微信支付</span>
          </div>
          <div class="modal_item" @click="shareHandler(2)">
            <img src="@/assets/img/merchant/merchant_icon3.png" alt="">
            <span>支付宝支付</span>
          </div>
          <div class="modal_item" @click="shareHandler(3)">
            <img src="@/assets/img/merchant/merchant_icon4.png" alt="">
            <span>花呗支付</span>
          </div>
          <div class="modal_item" @click="shareHandler(4)">
            <img src="@/assets/img/merchant/merchant_icon2.png" alt="">
            <span>银联支付</span>
          </div>
        </div>
        <div class="modal_button">
          <a href="javascript:;" @click="modalHideHandler">取消</a>
        </div>
      </div>
    </van-popup> -->

    <van-popup
      :style="{height: 'auto'}"
      v-model="pop_show_face">
      <FaceModal ref="faceModal" :money-result="calculator_result" @inputHandler="inputHandler" @cancelHandler="cancelHandler" @confirmHandler="confirmHandler" />
    </van-popup>
  </div>
</template>
<script>
import { key_arr } from '@/config'
import FaceModal from './face_modal/index'
export default {
  components: {
    FaceModal
  },
  props: {
    receiptType: {
      type: String,
      default: '1'
    }
  },
  data () {
    return {
      pop_show_face: false,
      keyArr: key_arr,
      calculator_calc: '',
      calculator_result: 0.00,
      prevKey: '',
      pop_show: false
    }
  },
  computed: {
    add_number () {
      return this.calculator_calc.split('+')
    }
  },
  methods: {
    confirmHandler (value) {
      this.pop_show_face = false
      this.$emit('confirmFaceHandler', value, this.calculator_result)
    },
    cancelHandler () {
      this.pop_show_face = false
    },
    inputHandler (value) {
    },
    shareHandler (type) {
      this.jumpTo('/receiptResult')
    },
    modalHideHandler () {
      this.pop_show = false
    },
    modalShowHandler () {
      if (!parseFloat(this.calculator_result) > 0) {
        return false
      }
      if (this.receiptType === '1') {
        // this.pop_show = true
        this.$dialog.confirm({
          message: `请确认收款金额：${this.calculator_result}`
        }).then(() => {
          this.$emit('openFNScannerHandler', this.calculator_result)
        }).catch(() => {
          // on cancel
        })
      } else {
        this.pop_show_face = true

        this.$nextTick(() => {
          this.$refs.faceModal.inputFocus()
        })
      }
    },
    keyDownHandler (key) {
      if (key === this.prevKey && this.prevKey === '.') {
        return false
      }
      if (key === this.prevKey && this.prevKey === 'add') {
        return false
      }
      if (this.prevKey === '' && key === 'add') {
        return false
      }
      if ((this.prevKey === '' && key === '.') || (this.prevKey === 'add' && key === '.')) {
        this.calculator_calc += '0.'
      } else {
        if (key === 'del') {
        // 删除
          this.calculator_calc = this.calculator_calc.slice(0, -1)
        } else if (key === 'add') {
          // 加
          if (this.prevKey === '.') {
            // 如果加号前面是点
            this.calculator_calc += '0+'
          } else {
            this.calculator_calc += '+'
          }
        } else {
          this.calculator_calc += key
        }
      }
      this.prevKey = key
      this.calcResultHandler()
    },
    // 检查输入金额
    checkMoneyReg () {
      let regStrs = [
        ['^\\.', '0.'], // 必须保证第一个为数字而不是.
        ['^0(\\d+)$', '$1'], // 禁止录入整数部分两位以上，但首位为0
        ['[^\\d\\.]+$', ''], // 禁止录入任何非数字和点
        ['\\.(\\d?)\\.+', '.$1'], // 禁止录入两个以上的点
        ['^(\\d+\\.\\d{2}).+', '$1'] // 禁止录入小数点后两位以上
      ]
      for (let i = 0; i < regStrs.length; i++) {
        var reg = new RegExp(regStrs[i][0])
        let money = this.moneyVal.replace(reg, regStrs[i][1])
        if (parseFloat(money) > 100000) {
          this.moneyVal = '100000'
        } else {
          this.moneyVal = money
        }
      }
    },
    calcResultHandler () {
      let arr = this.add_number
      let result = 0
      arr.forEach(item => {
        if (item !== '') {
          result += parseFloat(item)
        }
      })
      this.calculator_result = result.toFixed(2)
      if (result > 100000) {
        this.$dialog.alert({
          message: '收款金额最高100000元'
        })
        return false
      }
    }
  }
}
</script>