<template>
  <div id="storeAddress" class="page_container" :style="`padding-top: ${head_rem}rem;`">
    <NavBar :meta="meta" />
    <div class="form">
      <div class="form_item" @click="showSelectAreaHandler">
        <span class="item_title">省市区:</span>
        <van-field v-model="form.addressName" :readonly="readonly" placeholder="请选择地区" />
        <img src="@/assets/img/public/public_icon2.png" class="box_right" alt="">
      </div>
      <div class="form_item">
        <span class="item_title">
          详细地址:
        </span>
        <van-field v-model="form.addressDetail" placeholder="请输入详细地址" />
      </div>
      <div class="form_item">
        <span class="item_title">
          联系人:
        </span>
        <van-field v-model="form.name" placeholder="请填写收货人姓名" />
      </div>
      <div class="form_item">
        <span class="item_title">
          联系电话:
        </span>
        <van-field v-model="form.tel" placeholder="请填写收货人电话" />
      </div>
    </div>
    <div class="form_button">
      <a href="javascript:;" class="sure_button" @click="sureAddressHandler">确   定</a>
    </div>
    <div class="form_desc">
      <a href="javascript:;" @click="setMailingIndexHandler">点击更换收货方式</a>
    </div>
    <van-popup v-model="areaListShow" position="bottom">
      <van-area value="410101000000" :area-list="areaList" @confirm="areaConfirm" @cancel="areaCancel" />
    </van-popup>
  </div>
</template>
<script>
import NavBar from '@/components/navBar'
import areaList from '@/assets/js/area.js'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      areaListShow: false,
      meta: this.$route.meta,
      isAreaShow: false,
      areaVal: ['410', '4910', '4910'], // 默认河南
      area1: '',
      area2: '',
      area3: '',
      readonly: true,
      areaList: areaList,
      form: {
        addressName: '',
        addressDetail: '',
        name: '',
        tel: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'material_address'
    ])
  },
  created () {
    this.form.name = this.material_address.person
    this.form.tel = this.material_address.mobile
  },
  methods: {
    onSave () {
      Toast('save')
    },
    onDelete () {
      Toast('delete')
    },
    setMailingIndexHandler () {
      this.set_mailing_index(1)
      this.goBack()
    },
    sureAddressHandler () {
      if (this.form.addressName === '') {
        this.$dialog.alert({
          message: '请选择地区'
        })
        return false
      }
      if (this.form.name === '') {
        this.$dialog.alert({
          message: '请输入联系人'
        })
        return false
      }
      let tel = this.form.tel
      if (tel === '') {
        this.$dialog.alert({
          message: '请输入联系电话'
        })
        return false
      }
      if (tel.length !== 11) {
        this.$dialog.alert({
          message: '联系电话格式错误'
        })
        return false
      }
      let data = {
        address: this.form.addressName + this.form.addressDetail,
        person: this.form.name,
        mobile: this.form.tel
      }
      this.set_material_address(data)
      this.goBack()
    },

    showSelectAreaHandler () {
      this.areaListShow = true
    },
    areaConfirm (options) {
      if (options) {
        let str = ''
        options.forEach(item => {
          str += item.name
        })
        this.form.addressName = str
      }
      this.areaListShow = false
    },
    areaCancel () {
      this.areaListShow = false
    },
    onChangeDetail (val) {
      if (val) {
        this.searchResult = [{
          name: '黄龙万科中心',
          address: '杭州市西湖区'
        }]
      } else {
        this.searchResult = []
      }
    },
    ...mapMutations({
      set_mailing_index: 'SET_MAILING_INDEX',
      set_material_address: 'SET_MATERIAL_ADDRESS'
    })
  }
}
</script>