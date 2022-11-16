import Storage from '@/storage/index.js'
const state = {
  user_info: Storage.get('user_info') ? Storage.get('user_info') : {},
  user_token: Storage.get('user_token') ? Storage.get('user_token') : '',
  direction: 'forward',
  count: 60,
  apply_shop_tab: 1,
  apply_info: {},
  address_obj: null,
  material_address: {
    address: '',
    person: '',
    mobile: ''
  },
  mailing_index: 1,
  goods_list: [],
  freight: 0,
  select_goods: [],
  choose_address_name: '',
  apply_info_address: null,
  rate_region: null,
  picture: {
    legal_identity_pica: '',
    legal_identity_picb: '',
    img_idcard_holding: '',
    bank_card_pica: '',
    bank_card_picb: '',
    license_pic: '',
    tax_pic: '',
    org_pic: '',
    store_pic: '',
    store_inside_pic: ''
  },
  pay_rate: null,
  merchant_status_show: false,
  apply_uid: null,
  mq_client_id: null,
  desk_qrcode: '',
  banner_list: [],
  sub_uid: null,
  //朋,用于判断是否什么环境
  is_web_type:'',
  is_code:'',
  index_banner: [],
  show_zy: Storage.get('show_zy') === null ? true : Storage.get('show_zy'),
  device_id: '',
  site_config:[],
  // 1 表示今天未引导  2 表示今天已引导
  banner_page_show: Storage.getAndTime('banner_page_show') ? Storage.getAndTime('banner_page_show') : 1,
  bank_obj: {
    bank_address: '',
    bank_name: '',
    bank_union_name: '',
    bank_code: '',
    bank_city_code: ''
  },
  business_show_key: ''
}


export default state
