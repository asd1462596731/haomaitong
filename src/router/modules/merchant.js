import Receipt from '@/pages/merchant/receipt'
import ReceiptResult from '@/pages/merchant/receiptResult'
import Cashier from '@/pages/merchant/cashier'
import AddCashier from '@/pages/merchant/cashier/add'
import Fans from '@/pages/merchant/fans'
import BlueOceanOasis from '@/pages/merchant/blueOceanOasis'
import BlueOceanOasisApply from '@/pages/merchant/blueOceanOasis/apply'
import Desk from '@/pages/merchant/desk'
import CloudSpeaker from '@/pages/merchant/desk/cloudSpeaker'
import CloudPos from '@/pages/merchant/desk/cloudPos'
import BindQrcodeNum from '@/pages/merchant/desk/bindQrcodeNum'
import Energize  from '@/pages/merchant/desk/energize'
import Qrcode from '@/pages/merchant/desk/qrcode'
// 首页
export default [
  {
    path: '/qrcode',
    name: 'qrcode',
    component: Qrcode,
    meta: { title: '收款二维码', left: 'icon_back', right: 'down_qrcode' }
  },
  {
    path: '/bindQrcodeNum',
    name: 'bindQrcodeNum',
    component: BindQrcodeNum,
    meta: { title: '绑定收款码', left: 'icon_back' }
  },
  {
    path: '/energize',
    name: 'energize',
    component: Energize,
    meta: { title: '赋能设置', left: 'icon_back' }
  },
  {
    path: '/cloudSpeaker',
    name: 'cloudSpeaker',
    component: CloudSpeaker,
    meta: { title: '绑定云喇叭', left: 'icon_back' }
  },
  {
    path: '/cloudPos',
    name: 'cloudPos',
    component: CloudPos,
    meta: { title: '绑定POS', left: 'icon_back' }
  },
  {
    path: '/blueOceanOasisApply',
    name: 'blueOceanOasisApply',
    component: BlueOceanOasisApply,
    meta: { title: '申请', left: 'icon_back' }
  },
  {
    path: '/receipt',
    name: 'receipt',
    component: Receipt,
    meta: { title: '收款', left: 'icon_back' }
  },
  {
    path: '/receiptResult',
    name: 'receiptResult',
    component: ReceiptResult,
    meta: { title: '', left: 'icon_back' }
  },
  {
    path: '/cashier',
    name: 'cashier',
    component: Cashier,
    meta: { title: '店员', left: 'icon_back' }
  },
  {
    path: '/addCashier',
    name: 'addCashier',
    component: AddCashier,
    meta: { title: '', left: 'icon_back' }
  },
  {
    path: '/fans',
    name: 'fans',
    component: Fans,
    meta: { title: '我的粉丝', left: 'icon_back' }
  },
  {
    path: '/blueOceanOasis',
    name: 'blueOceanOasis',
    component: BlueOceanOasis,
    meta: { title: '蓝海绿洲', left: 'icon_back' }
  },
  {
    path: '/desk',
    name: 'desk',
    component: Desk,
    meta: { title: '门店', left: 'icon_back' }
  }
]
