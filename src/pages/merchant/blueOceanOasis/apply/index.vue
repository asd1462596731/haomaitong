<template>
  <div id="applyBlueOceanOasis" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="apply_result" v-show="apply_result">
      {{apply_result}}
    </div>
    <div class="applyShop_form blueOceanOasis">
      <div class="form_content">
        <div class="input_box">
          <div class="box_top">
            <span>类&#x3000;&#x3000;型</span>
            <van-field :value="type_text" :readonly="readyonly" />
          </div>
        </div>
        <div class="input_box">
          <div class="box_top">
            <span>门店名称</span>
            <van-field v-model="formData.store_name" />
          </div>
        </div>
        <div class="input_box">
          <div class="box_top">
            <span>电子邮箱</span>
            <van-field v-model="formData.email" />
          </div>
        </div>
        <div class="input_box">
          <div class="box_top">
            <span>费&#x3000;&#x3000;率</span>
            <van-field :value="rate_text" :readonly="readyonly" />
          </div>
        </div>
      </div>
    </div>
    <div class="applyShop_button">
      <a href="javascript:;" class="sure_button" :class="{'disable': disable}" @click="submit">{{button_text}}</a>
    </div>
  </div>
</template>
<script>
import NavBar from '@/components/navBar'
import * as request from '@/api'
import { mapGetters } from 'vuex'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      readyonly: true,
      meta: this.$route.meta,
      formData: {
        activity_rate: '',
        activity_type: 1,
        email: '',
        memo: '',
        merchant_id: 1,
        store_name: '',
        sxf_status: 'wait'
      },
      activity_id: null,
      button_text: '申请',
      sxf_status: '',
      disable: false,
      apply_result: ''
    }
  },
  computed: {
    rate_text () {
      return this.formData.activity_rate ? this.formData.activity_rate + '%' : ''
    },
    type_text () {
      if (this.formData.activity_type === 1) {
        return '支付宝蓝海'
      } else if (this.formData.activity_type === 2) {
        return '微信智慧餐饮'
      } else if (this.formData.activity_type === 3) {
        return '微信高校食堂'
      } else {
        return '支付宝蓝海'
      }
    },
    ...mapGetters(['user_info'])
  },
  created () {
    this.$nextTick(() => {
      let params = this.$route.params
      this.formData = params
      this.activity_id = params.id
      this.sxf_status = params.sxf_status
      this.setButtonStatus()
    })
  },
  methods: {
    submit () {
      if (this.disable) {
        let status = this.sxf_status
        if (status === 'success') {
          this.$dialog.alert({
            message: '已申请成功'
          })
        }
        if (status === 'wait' || status === 'auditing') {
          this.$dialog.alert({
            message: '请耐心等待审核'
          })
        }
        return false
      }
      let data = this.formData
      request.post_merchant_activity_store(data).then(res => {
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
    setButtonStatus () {
      let status = this.sxf_status
      if (status === 'success' || status === 'wait' || status === 'auditing') {
        this.disable = true
        if (status === 'wait') {
          this.button_text = '待审核'
          this.apply_result = '审核结果：待审核，请等待'
        } else if (status === 'success') {
          this.button_text = '申请成功'
          this.apply_result = '审核结果：申请成功'
        } else if (status === 'auditing') {
          this.button_text = '审核中'
          this.apply_result = '审核结果：审核中，请等待'
        }
      } else {
        this.disable = false
        this.button_text = '申请'
        this.apply_result = ''
      }
    }
    // getMerchantActivityShow () {
    //   request.get_merchant_activity_show(this.activity_id).then(res => {
    //     if (res.code === this.SUCCESS_CODE) {

    //     } else {
    //       this.$toast.fail(res.msg)
    //     }
    //   })
    // }
  }
}
</script>