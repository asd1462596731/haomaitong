import http from './http'

/**
 * 发送手机验证码
 */
export const post_sms_send = function (mobile, event) {
  return http.post('/sms/send', { mobile, event })
}
/**
 * 注册
 */
export const post_user_register = function (data) {
  return http.post('/user/register', data)
}
/**
 * 手机号码密码登录
 */
export const post_user_login = function (mobile, password,code) {
  return http.post('/user/login', { mobile, password ,code})
}
/**
 * 我的粉丝
 */
export const post_user_myfans = function (page,desk_id,id) {
  return http.get('/user/myfans', { page , desk_id , id})
}
/**
 * 手机验证码登录
 */
export const post_user_mobilelogin = function (mobile, captcha,code) {
  return http.post('/user/mobilelogin', { mobile, captcha ,code})
}
/**
 * 修改个人信息
 */
export const post_user_modify_info = function (data) {
  return http.post('/user/modify-info', data)
}
/**
 * 门店列表
 */
export const get_desk_list = function (merchant_id) {
  return http.get('/desk/desk-list', { merchant_id })
}


/**
 * 代理门店列表
 */
export const get_dalidesk_list = function (mach_id) {
  return http.get('/desk/dali-desk-list', { mach_id })
}

//修改门店名称
export const post_update_desk_name = function (desk_id,desk_name) {
  return http.post('/desk/update_desk_name', { desk_id ,desk_name})
}


// 读取后台配置
export const post_site_config = function (code) {
  return http.post('/common/site-config',{code})
}

/**
 * 业务员查看门店
 */
export const post_salesman_desk = function (subUid) {
  return http.post('/salesman/seeDesk', { subUid })
}

/**
 * 添加门店
 */
export const post_add_desk = function (deskname) {
  return http.post('/desk/add-desk',{deskname})
}
/**
 * 删除门店
 */
export const post_del_desk = function (id) {
  return http.post('/desk/del-desk',{id})
}

/**
 * 业务添加门店
 */
export const post_selesman_add_desk = function (subUid,deskname) {
  return http.post('/salesman/slmAddDesk', { subUid ,deskname})
}
/**
 * 用户提现
 */
export const post_user_withdrawal = function (money) {
  return http.post('/CashWithdrawal/CashWithdrawal', { money })
}

/**
 * 用户充值
 */
export const post_user_recharge = function (price, type, is_web_type) {
  return http.post('/recharge/blance-recharge', { price, type, is_web_type})
}

// 支付回调
export const post_recharge = function () {
  return http.post('/recharge/blance-recharge-notify', {})
}
/**
 * 物料商城物料
 */
export const get_good_list = function (page) {
  return http.get('/goods/index')
}
/**
 * 物料商城的订单
 */
export const get_goods_order = function (page) {
  return http.get('/goods-order/index', { page: page })
}
/**
 * 跨界佣金列表
 */
export const get_money_commission = function (page,desk_id,id) {
  return http.get('/money-log/commission', { page: page , desk_id:desk_id,id:id})
}
/**
 * 资金明细
 */
export const get_money_index = function (page) {
  return http.get('/money-log/index', { page: page })
}
/**
 * 店员列表
 */
export const get_cashier_list = function (desk_id) {
  return http.get('/cashier/list',{desk_id})
}
/**
 * 店员检测
 */
export const get_cashier_checked = function (mobile) {
  return http.get('/cashier/check', { mobile })
}
/**
 * 店员 添加
 */
export const post_cashier_create_cashier = function (data) {
  return http.post('/cashier/create-cashier', data)
}
/**
 * 店员 添加
 */
export const post_cashier_create = function (data) {
  return http.post('/cashier/add', data)
}
/**
 * 删除店员
 */
export const post_del_cashier = function (uid) {
  return http.post('/cashier/del', { uid })
}

/**
 * 添加收款码
 */
export const post_desk_codenums = function (data) {
  return http.post('/desk/add-Codenums', data)
}
/**
 * 业务添加收款码
 */
export const post_selesman_add_code = function (data) {
  return http.post('/salesman/deskAddnums', data)
}
/**
 * 添加云喇叭
 */
export const post_desk_horn = function (data) {
  return http.post('/desk/add-horn', data)
}
/**
 * 业务添加云喇叭
 */
export const post_selesman_add_horn = function (data) {
  return http.post('/salesman/addDeskHorn', data)
}

// 添加pos设备号
export const post_desk_pos = function (data) {
  return http.post('/desk/add-pos', data)
}

/**
 * 业务添加pos
 */
export const post_selesman_add_pos = function (data) {
  return http.post('/salesman/addDeskPos', data)
}



/**
* 添加云喇叭
*/
export const post_create_order = function (data) {
  return http.post('/goods-order/create-order', data)
}
/**
 * 解绑云喇叭
 */
export const post_del_horn = function (id) {
  return http.post('/desk/del-horn', {id})
}
/**
 * 业务解绑云喇叭
 */
export const post_salesman_del_horn = function (data) {
  return http.post('/salesman/deskDelHorn', data)
}


/**
 * 解绑POS设备
 */
export const post_del_pos = function (id) {
  return http.post('/desk/del-pos', {id})
}
/**
 * 业务解绑云喇叭
 */
export const post_salesman_del_pos = function (data) {
  return http.post('/salesman/deskDelPos', data)
}


/**
* 团队 管理
*/
export const get_agent_team = function (page) {
  return http.get('/agent/my-team', { page })
}
/**
 * 下级详情
 */
export const get_agent_lower = function (uid) {
  return http.get('/agent/lower-level', { uid })
}
/**
 * 下级修改费率
 */
export const post_agent_modify = function (data) {
  return http.post('/agent/modify-lower-level', data)
}
/**
 * 新增下级
 */
export const post_agent_add = function (data) {
  return http.post('/agent/add-lower-level', data)
}
/**
 * 获取用户费率
 */
export const get_user_rate = function () {
  return http.get('/user/user-rate-map')
}
/**
 * 实名认证
 */
export const post_profile_identify = function (data) {
  return http.post('/profile/update-identify', data)
}
/**
 * 帮助中心 消息中心
 */
export const get_profile_help = function (cate_type) {
  return http.get('/profile/help-list', { cate_type: cate_type })
}
/**
 * 门店详情
 */
export const get_desk_show = function (id) {
  return http.get('/desk/show', { id })
}

// 获取当前用户赋能
export const get_set_info = function (id) {
  return http.get('/ad/get_set_info', { id })
}

// 门店赋能获取
export const post_combo_info = function (id) {
  return http.post('/combo/info', { id })
}

/**
 * 业务查看门店详情
 */
export const post_salesman_show_desk = function (data) {
  return http.post('/salesman/showuserdesk', data)
}
/**
 * 我的费率 (业务)
 */
export const get_salesman_myrate = function () {
  return http.get('/salesman/myrate')
}

/**
 * 广告赋能
 */
export const get_ad_set = function () {
  return http.get('/ad/ad_set')
}

/**
 *商家收款记录
 */
export const get_merchant_index = function (page, order_value, sort_value, desk_id, uid, create_time, pay_type, status,merchant_id) {
  return http.get('/order/index', { page, order_value, sort_value, desk_id, uid, create_time, pay_type, status,merchant_id })
}


/**
 *代理收款记录
 */
export const get_daili_index = function (page, order_value, sort_value, desk_id,mach_id, create_time, pay_type, status,merchant_id) {
  return http.get('/order/daili-index', { page, order_value, sort_value, desk_id,mach_id, create_time, pay_type, status,merchant_id})
}

/**
 *店员收款记录
 */
export const get_cashier_index = function (page, order_value, sort_value,desk_id, create_time, pay_type, status,merchant_id) {
  return http.get('/order/cashier-desk-detail', { page, order_value, sort_value,desk_id, create_time, pay_type, status,merchant_id })
}
/**
 * 单页面详情
 */
export const get_profile_single = function (id,code) {
  return http.get('/profile/single', { id,code })
}
/**
 * 上传图片公用
 */
export const post_common_upload = function (file) {
  // let data = new FormData()
  // data.append('file', file)
  return http.post('/common/upload',{ file })
}

//获取营业执照信息
export const get_pic_idcard = function (url) {
  return http.get('/common/licenseCard',{ img_url :url })
}


/**
 * 申请商户
 */
export const post_merchant_store = function (data) {
  return http.post('/merchant/store', data)
}
/**
 * 获取bank
 */
export const get_bank_list = function (city_code) {
  return http.get('/common/bankBankList', { city_code })
}
/**
 * 获取分行bank
 */
export const get_bank_union_list = function (city_code, bank_code) {
  return http.get('/common/bankUnionList', { city_code, bank_code })
}
/**
 * 查看商家
 */
export const get_merchant_show = function (uid) {
  return http.get('/merchant/show', { uid })
}
/**
 * 协助开户
 */
export const get_salesman_cooperate = function () {
  return http.get('/salesman/cooperate')
}

// 开户收益报表
export const post_salesman_openEarnings = function (startdate, enddate, quarter) {
  return http.post('/salesman/openEarnings', { startdate, enddate, quarter})
}

// 开户收益报表下载
export const post_statement_open_downlo = function (startdate, enddate, dow_type) {
  return http.post('/salesman/OpenDownload', { startdate, enddate, dow_type})
}
 
  //开户收益
export const post_statement_ad_downlo = function (startdate, enddate,dow_type) {
  return http.post('/ad/ad_download', { startdate, enddate ,dow_type})
}


//广告收益报表
export const post_salesman_adverEarnings = function (startdate, enddate, quarter) {
  return http.post('/Ad/adEarnings', { startdate, enddate, quarter})
}

/**
 * 游客上级信息
 */
export const get_visitor_parent = function () {
  return http.get('/visitor/show-parent')
}
/**
 * 游客开通商家
 */
export const post_visitor_merchant = function (mobile) {
  return http.post('/visitor/open-merchant', { mobile })
}
/**
 * 会员首页
 */
export const get_user_index = function () {
  return http.get('/user/index')
}
/**
 * 修改手机号码
 */
export const post_user_change_mobile = function (mobile, captcha) {
  return http.post('/user/changemobile', { mobile, captcha })
}
/**
 * 修改登录密码
 */
export const post_reset_password = function (mobile, password, captcha) {
  return http.post('/user/resetpwd', { mobile, password, captcha })
}
/**
 * 语音播报开关
 */
export const post_profile_notice = function (notice_open) {
  return http.post('/profile/set-notice-switch', { notice_open })
}
/**
 * 语音播报时间
 */
export const post_profile_notice_time = function (notice_start, notice_end) {
  return http.post('/profile/set-notice-time', { notice_start, notice_end })
}
/**
 * 换绑卡信息
 */
export const get_merchant_modify = function (merchant_id) {
  return http.get('/merchant-modify/show', { merchant_id })
}
/**
 * 商户换绑卡
 */
export const post_merchant_modify = function (data) {
  return http.post('/merchant-modify/store', data)
}

/**
 * 商家活动列表
 */
export const get_merchant_activity = function (merchant_id) {
  return http.get('/merchant-activity/index', { merchant_id })
}
/**
 * 商家列表
 */
export const get_salesman_merchant = function (page, merchant_alias) {
  return http.get('/salesman/merchant', { page, merchant_alias })
}

//获取商户信息
export const get_get_getMerchants = function (data) {
  return http.get('/order/merchantsList', { id: data})
}

//获取门店信息
export const get_getStores = function () {
  return http.get('/order/storesList')
}

//获取主商家下子商家列表
export const get_list_mer = function (data) {
  return http.get('/merchant/merchantsList', { id: data})
}

/**
 * 我要升级
 */
export const get_salesman_mylevel = function () {
  return http.get('/salesman/mylevel')
}
/**
 * 商家报名活动审核结果
 */
export const get_merchant_activity_show = function (activity_id) {
  return http.get('/merchant-activity/show', { activity_id })
}
/**
 * 商家报名活动
 */
export const post_merchant_activity_store = function (data) {
  return http.post('/merchant-activity/store', data)
}
/**
 * 收益报表
 */
export const post_order_report = function (start_time, end_time,key,mach_id,desk_id) {
  return http.post('/order/report', { start_time, end_time ,key,mach_id,desk_id})
}
//顾客报表
export const post_order_consumer = function (create_time,key) {
  return http.post('/order/consumer', { create_time ,key})
}
//商家邮件发送
export const post_email_send = function (data) {
  return http.post('/send/email_send', { data })
}

//代理邮件发送
export const post_salesman_email_send = function (data) {
  return http.post('/salesman/email_send', { data })
}

//身份证识别
export const post_get_id_identity = function (data) {
  return http.post('/common/idCard', { img_url:data })
}
//银行卡识别
export const post_get_id_idbankCard = function (data) {
  return http.post('/common/bankCard', { img_url:data })
}

/**
 * 收款接口
 */
export const post_pay_reverse_scan = function (data) {
  return http.post('/pay/reverseScan', data)
}
/**
 * 游客开通业务员
 */
export const post_visitor_sales = function (mobile) {
  return http.post('/visitor/open-sales', { mobile })
}
/**
 * 升级代理
 */
export const post_visitor_agent = function () {
  return http.get('/visitor/intro-agent')
}
/**
 * 消息中心，详情
 */
export const get_profile_help_detail = function (id) {
  return http.get('/profile/help-detail', { id })
}
/**
 * 店员启用禁用
 */
export const post_cashier_toggle = function (cashier_id, status) {
  return http.post('/cashier/toggle-status', { cashier_id, status })
}
/**
 * 修改默认费率
 */
export const post_update_default_rate = function (data) {
  return http.post('/salesman/update-default-rate', { default_rate: data })
}
/**
 * 提现记录
 */
export const post_user_cashWithdrawal = function () {
  return http.post('/CashWithdrawal/userCashWithdlist')
}

//充值记录
export const post_recharge_cashWithdrawal = function () {
  return http.post('/recharge/CashWithdlist')
}


/**
 * 绑定微信
 */
export const post_profile_bind_wechat = function (openid, wechat_name) {
  return http.post('/profile/bind-wechat', { openid, wechat_name })
}
/**
 * 解绑微信
 */
export const post_profile_unbind_wechat = function () {
  return http.post('/profile/unbind-wechat')
}
/**
 * 查询支付结果
 */
export const get_order_show = function (id) {
  return http.get('/order/show', { id })
}
/**
 * 退款结果
 */
export const post_order_refund = function (order_no) {
  return http.post('/order/refund', { order_no })
}
/**
 * 收益报表代理业务
 */
export const post_salesman_salesmanReport = function (startdate, enddate, quarter) {
  return http.post('/salesman/salesmanReport', { startdate, enddate, quarter })
}

// 跨界收益报表
export const post_salesman_kjReport = function (startdate, enddate, quarter) {
  return http.post('/money-log/kj-commission', { startdate, enddate, quarter})
}

// 分佣报表下载
export const post_statement_split_download = function (startdate, enddate, dow_type) {
  return http.post('/salesman/split_download', { startdate, enddate, dow_type})
}

// 跨界收益报表下载
export const post_statement_tran_downlo = function (startdate, enddate, dow_type) {
  return http.post('/money-log/split_download', { startdate, enddate, dow_type})
}

// 经验报表下载
export const post_summary_sheet = function () {
  return http.post('/order/SummarySheet', { })
}
/**
 * app 首页
 */
export const get_home_banner = function (code) {
  return http.get('/index/index',{code})
}
/**
 * 更新设备id
 */
export const post_device_id = function (device_id, device_type) {
  return http.post('/profile/update-device', { device_id, device_type })
}
/**
 * 更新设备id
 */
export const post_del_qrcode = function (id) {
  return http.post('/desk/delcode', { id })
}

// H5微信授权
export const post_info_wechat = function (id, url) {
  return http.post('/user/infoh5', { id, url })
}

// 读取用户信息
export const post_info_user = function (id) {
  return http.post('/user/infouser', { id })
}

// 推广二维码
export const post_user_pro = function (invite_code) {
  return http.post('/user/user_pro_qrcode', { invite_code })
}

// 通过扫邀请码注册的用户
export const post_user_shareReg = function (data) {
  return http.post('/user/shareReg', { data })
}

/**
 * 获取用户扣款
 * @param {*} params
 * @returns Promise
 */
export const get_user_money = (params) => {
  return http.get('/ad/get_user_money', params)
}

/**
 * 赋能添加
 * @param {*} params
 * @returns Promise
 */
export const add_combo_set = (params) => {
  return http.post('/ad/ad_combo_set', params)
}

/**
 * 赋能编辑
 * @param {*} params
 * @returns Promise
 */
export const ad_setting_updata = (params) => {
  return http.get('/ad/ad_setting_updata', params)
}

/**
 * 赋能设置
 */
export const get_ad_desk_info = (id) => {
  return http.get('/ad/get_desk_info', {id})
}

/**
 * 赋能设置编辑
 * @param {*} params
 * @returns
 */
export const ad_combo_update = (params) => {
  return http.post('/ad/ad_combo_updata', params)
}


//当前代理费率
export const post_get_rate = (id) => {
  return http.post('/user/rate', {id})
  }
 //读取分享签名

export const  post_comm_share = () => {
  return http.post('/common/share')
  }
/**
 * 获取身份信息（了解身份）
 * @param {*} params
 * @returns
 */
export const getIdentity = (params) => {
  return http.get('/user/getIdentity', {identity:params})

}

//获取微信实名二维码
export const  get_wexin_code = (id) => {
  return http.post('/merchant/getwxcode',{id})
}



//微信静默授权
export const get_auth_weach = (user_id) => {
  return http.get('/common/auth_weach', {user_id:user_id})
}


//播报接口

export const post_audio = (user_id) => {
  return http.get('/common/readAudio', {user_id:user_id})
}
