import * as types from './mutation-types'
import Storage from '@/storage/index.js'

const mutations = {
  [types.SET_BUSINESS_SHOW_KEY] (state, str) {
    state.business_show_key = str
  },

  [types.SET_BANK_OBJ] (state, obj) {
    state.bank_obj = obj
  },

  [types.SET_BANNER_PAGE_SHOW] (state, number) {
    let nowDate = new Date()
    let year = nowDate.getFullYear()
    let moneth = nowDate.getMonth() + 1
    let day = nowDate.getDate()
    let endDate = new Date(`${year}/${moneth}/${day} 23:59:59`)
    let diff = endDate - nowDate
    Storage.setAndTime('banner_page_show', number, diff)
    state.banner_page_show = number
  },

  [types.SET_DEVICE_ID] (state, device_id) {
    state.device_id = device_id
  },

  [types.MERCHANT_ID] (state,merchant_id) {
    state.merchant_id = merchant_id
  },

  [types.SET_SHOW_ZY] (state, flag) {
    state.show_zy = flag
    Storage.set('show_zy', flag)
  },

  [types.SET_INDEX_BANNER] (state, list) {
    state.index_banner = list
  },

  [types.SET_SUB_UID] (state, uid) {
    state.sub_uid = uid
  },

  [types.SET_BANNER_LIST] (state, list) {
    state.banner_list = list
  },

  [types.SET_DESK_QRCODE] (state, qrcode) {
    state.desk_qrcode = qrcode
  },

  [types.SET_MQ_CLIENT_ID] (state, id) {
    state.mq_client_id = id
  },

  [types.SET_APPLY_UID] (state, uid) {
    state.apply_uid = uid
  },

  [types.SET_MERCHANT_STATUS_SHOW] (state, flag) {
    state.merchant_status_show = flag
  },

  [types.SET_PAY_RATE] (state, rate) {
    state.pay_rate = rate
  },

  [types.SET_PICTURE] (state, picture) {
    state.picture = picture
  },

  [types.SET_RATE_REGION] (state, rate) {
    state.rate_region = rate
  },

  [types.SET_APPLY_INFO_ADDRESS] (state, obj) {
    state.apply_info_address = obj
  },

  [types.SET_ADDRESS_NAME] (state, name) {
    state.choose_address_name = name
  },

  [types.SET_SELECT_GOODS] (state, list) {
    state.select_goods = list
  },

  [types.SET_FREIGHT] (state, money) {
    state.freight = money
  },

  [types.SET_GOODS_LIST] (state, list) {
    state.goods_list = list
  },

  [types.SET_MATERIAL_ADDRESS] (state, data) {
    state.material_address = data
  },

  [types.SET_MAILING_INDEX] (state, index) {
    state.mailing_index = index
  },

  [types.SET_ADDRESS_OBJ] (state, data) {
    state.address_obj = data
  },
  
  //朋设置环境
  [types.SET_IS_WEB_TYPE] (state, data) {
     state.is_web_type = data
  },
  
  //code
  [types.SET_IS_CODE] (state, data) {
     state.is_code = data
  },
   //网站配置
   
  [types.SET_SITE_CONFIG] (state, data) {
     state.site_config = data
  },
  
  [types.SET_ADDRESS_SELECT_ALGIN] (state, flag) {
    state.address_select_algin = flag
  },
  [types.SET_APPLY_INFO] (state, data) {
    state.apply_info = data
  },
  [types.SET_APPLY_SHOP_TAB] (state, index) {
    state.apply_shop_tab = index
  },
  [types.SET_COUNT] (state, count) {
    state.count = count
  },
  [types.UPDATE_DIRECTION] (state, direction) {
    state.direction = direction
  },
  [types.UPDATE_USER_INFO] (state, info) {
    state.user_info = info
    Storage.set('user_info', info)
  },
  [types.UPDATE_USER_TOKEN] (state, token) {
    state.user_token = token
    Storage.set('user_token', token)
  },
  [types.SET_USER_LOGOUT] (state) {
    Storage.remove('user_info')
    Storage.remove('user_token')
    Storage.remove('show_zy')
    state.show_zy = true
    state.user_token = ''
    state.user_info = {}
    state.apply_info_address = null
    state.rate_region = null
    state.picture = {}
    state.pay_rate = null
    state.merchant_status_show = false
    state.apply_uid = null
  }
}

export default mutations
