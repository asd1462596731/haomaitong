<template>
  <div id="addCashier" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="add_title">添加店员</div>
    <div class="add_form">
      <div class="input_box">
        <van-field
          v-model="mobile"
          placeholder="请输入店员手机号">
        </van-field>
        <a href="javascript:;" @click="checkedMobileHandler">检测</a>
      </div>
      <div class="input_box" style="margin-top: .666667rem;" v-show="!isRegister">
        <van-field
          v-model="password"
          placeholder="请输入初始密码(若不填，默认123456)">
        </van-field>
      </div>
      <div class="result_msg" :class="{'red': !isRegister}">
        {{msg}}
      </div>
      <div class="input_box" @click="showSelectDeskHandler">
        <van-cell title="门店" :value="desk_name" />
        <img class="right_icon" src="@/assets/img/merchant/merchant_icon9.png" alt="">
      </div>
      <div class="result_msg">
        展示已开通的门店
      </div>
    </div>
    <div class="add_button">
      <a href="javascript:;" class="sure_button" :class="{'disable': !isCnaSubmit}" @click="addCashierHandler">确    定</a>
    </div>

    <van-popup v-model="showDeskArr" position="bottom">
      <van-picker :columns="actions" show-toolbar @confirm="onSelectHandler" @cancel="showDeskArr = false" />
    </van-popup>
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
      showDeskArr: false,
      meta: this.$route.meta,
      mobile: '',
      isRegister: true,
      msg: '',
      actions: [
      ],
      desk_id: null,
      desk_name: '',
      password: '',
      uid: null
    }
  },
  computed: {
    isCnaSubmit () {
      if (this.desk_name !== '' && this.mobile !== '' && this.mobile.length === 11) {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    this.getDeskList()
  },
  methods: {
    addCashierHandler () {
      if (!this.isCnaSubmit) {
        return false
      }
      if (!this.desk_id) {
        this.$toast.fail('请选择门店')
        return false
      }
      if (this.isRegister) {
        let data = {
          uid: this.uid,
          desk_id: this.desk_id
        }
        request.post_cashier_create(data).then(res => {
          if (res.code === this.SUCCESS_CODE) {
            this.$toast.success(res.msg)
            setTimeout(() => {
              this.goBack()
            }, 1000)
          } else {
            this.$toast.fail(res.msg)
          }
        })
      } else {
        let data = {
          mobile: this.mobile,
          password: this.password,
          desk_id: this.desk_id
        }
        request.post_cashier_create(data).then(res => {
          if (res.code === this.SUCCESS_CODE) {
            this.$toast.success(res.msg)
            setTimeout(() => {
              this.goBack()
            }, 1000)
          } else {
            this.$toast.fail(res.msg)
          }
        })
      }
    },
    checkedMobileHandler () {
      let mobile = this.mobile
      if (mobile.length !== 11) {
        this.$toast.fail('手机号码格式不正确')
        return false
      }
      request.get_cashier_checked(parseInt(mobile)).then(res => {
        if (res.code === this.SUCCESS_CODE) {
          if (!res.data) {
            this.isRegister = false
          } else {
            this.isRegister = true
            this.uid = res.data.id
          }
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    getDeskList () {
      request.get_desk_list().then(res => {
        if (res.code === this.SUCCESS_CODE) {
          let list = res.data
          for (let index = 0; index < list.length; index++) {
            const item = list[index]
            this.actions.push({
              text: item.name,
              id: item.id
            })
          }
        } else {
          this.$toast.fail(res.msg)
        }
      })
    },
    showSelectDeskHandler () {
      this.showDeskArr = true
    },
    onSelectHandler (item) {
      this.desk_name = item.text
      this.desk_id = item.id
      this.showDeskArr = false
    }
  }
}
</script>