import ApplySale from '@/pages/visitor/applySale'
import ApplyMerchant from '@/pages/visitor/applyMerchant'
import ApplyProxy from '@/pages/visitor/applyProxy'
// 首页
export default [
  {
    path: '/applyMerchant',
    name: 'applyMerchant',
    component: ApplyMerchant,
    meta: { title: '申请商户', left: 'icon_back', right: 'icon_ld' }
  },
  {
    path: '/applyProxy',
    name: 'applyProxy',
    component: ApplyProxy,
    meta: { title: '申请代理', left: 'icon_back', right: 'icon_ld' }
  },
  {
    path: '/applySale',
    name: 'applySale',
    component: ApplySale,
    meta: { title: '申请业务员', left: 'icon_back', right: 'icon_ld' }
  }
]
