<template>
  <div id="faceModal">
    <div class="face_box">
      <div class="face_title">
        <span>收款金额：</span>
        <i>￥{{moneyResult}}</i>
      </div>
      <div class="content">
        <div class="content_title">
          等待刷脸单号写入
        </div>
        <div class="content_input">
          <van-field type="none" @input="inputHandler" ref="input" v-model="value" />
        </div>
        <div class="button">
          <a href="javascript:;" class="cancel" @click="cancelHandler">取消</a>
          <a href="javascript:;" class="confirm" @click="confirmHandler">收款</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    moneyResult: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      value: ''
    }
  },
  methods: {
    inputFocus () {
      this.$refs.input.focus()
    },
    cancelHandler () {
      this.$emit('cancelHandler')
    },
    inputHandler () {
      this.$emit('inputHandler', this.value)
    },
    confirmHandler () {
      this.$emit('confirmHandler', this.value)
    }
  }
}
</script>