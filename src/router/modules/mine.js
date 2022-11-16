import Mine from '@/pages/mine'
import UserInfo from '@/pages/mine/userInfo'
import Nickname from '@/pages/mine/userInfo/infos/nickname'
import Verified from '@/pages/mine/userInfo/infos/verified'
import ChangePhone from '@/pages/mine/userInfo/infos/changePhone'
import BindPhone from '@/pages/mine/userInfo/infos/bindPhone'

// 设置
import SetUp from '@/pages/mine/setUp/setUp'
import SetPass from '@/pages/mine/setUp/settings/setPass'
import HelpCenter from '@/pages/mine/setUp/settings/helpCenter'
import HoverCenter from '@/pages/mine/setUp/settings/hoverCenter'
import HoverDetail from '@/pages/mine/setUp/settings/hoverDetail'
import FeedBack from '@/pages/mine/setUp/settings/feedBack'
import VoiceVroad from '@/pages/mine/setUp/settings/voiceVroad'
import AboutUs from '@/pages/mine/setUp/settings/aboutUs'
import AboutIden from '@/pages/mine/setUp/settings/aboutIden'

import WxCode from '@/pages/mine/wxCode/index'


// 首页
export default [
  {
    path: '/aboutUs',
    name: 'aboutUs',
    component: AboutUs,
    meta: { title: '关于我们', left: 'icon_back', right: false }
  },
  {
    path: '/aboutIden',
    name: 'aboutIden',
    component: AboutIden,
    meta: { title: '了解身份', left: 'icon_back', right: false }
  },
  {
    path: '/voiceVroad',
    name: 'voiceVroad',
    component: VoiceVroad,
    meta: { title: '语音播报', left: 'icon_back', right: false }
  },
  {
    path: '/feedBack',
    name: 'feedBack',
    component: FeedBack,
    meta: { title: '建议反馈', left: 'icon_back', right: false }
  },
  {
    path: '/hoverDetail',
    name: 'hoverDetail',
    component: HoverDetail,
    meta: { title: '消息详情', left: 'icon_back', right: false }
  },
  {
    path: '/hoverCenter',
    name: 'hoverCenter',
    component: HoverCenter,
    meta: { title: '消息中心', left: 'icon_back', right: false }
  },
  {
    path: '/wxCode',
    name: 'wxCode',
    component: WxCode,
    meta: { title: '微信实名', left: 'icon_back', right: false }
  },
  {
    path: '/helpCenter',
    name: 'helpCenter',
    component: HelpCenter,
    meta: { title: '帮助中心', left: 'icon_back', right: false }
  },
  {
    path: '/setPass',
    name: 'setPass',
    component: SetPass,
    meta: { title: '登录密码', left: 'icon_back', right: false }
  },
  {
    path: '/setUp',
    name: 'setUp',
    component: SetUp,
    meta: { title: '设置', left: 'icon_back', right: false }
  },
  {
    path: '/bindPhone',
    name: 'bindPhone',
    component: BindPhone,
    meta: { title: '绑定手机', left: 'icon_back', right: false }
  },
  {
    path: '/changePhone',
    name: 'changePhone',
    component: ChangePhone,
    meta: { title: '换绑手机', left: 'icon_back', right: false }
  },
  {
    path: '/verified',
    name: 'verified',
    component: Verified,
    meta: { title: '实名认证', left: 'icon_back', right: false }
  },
  {
    path: '/nickname',
    name: 'nickname',
    component: Nickname,
    meta: { title: '修改昵称', left: 'icon_back', right: false }
  },
  {
    path: '/userInfo',
    name: 'userInfo',
    component: UserInfo,
    meta: { title: '个人信息', left: 'icon_back', right: false }
  },
  {
    path: '/mine',
    name: 'mine',
    component: Mine,
    meta: { title: '我的', left: false, right: false }
  }
]
