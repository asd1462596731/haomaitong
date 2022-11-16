import Team from '@/pages/proxy/team'
import TeamManage from '@/pages/proxy/team/manage'
import TeamAdd from '@/pages/proxy/team/add'
import MerchantList from '@/pages/proxy/merchantList'
import MyRate from '@/pages/proxy/myRate'
import DefaultRate from '@/pages/proxy/defaultRate'
import AddShop from '@/pages/proxy/addShop'
import InviteShop from '@/pages/proxy/inviteShop'
import AdSet from '@/pages/proxy/adSet'
import AddEnabled from '@/pages/proxy/adSet/form'
import Edit from '@/pages/proxy/adSet/edit'
// 首页
export default [
  {
    path: '/inviteShop',
    name: 'inviteShop',
    component: InviteShop,
    meta: { title: '邀请商家', left: 'icon_back' }
  },
  {
    path: '/addShop',
    name: 'addShop',
    component: AddShop,
    meta: { title: '协助开户', left: 'icon_back' }
  },
  {
    path: '/myRate',
    name: 'myRate',
    component: MyRate,
    // meta: { title: '我的费率', left: 'icon_back', right: 'default_rate' }
    meta: { title: '我的费率', left: 'icon_back' }
  },
  {
    path: '/adSet',
    name: 'adSet',
    component: AdSet,
    meta: { title: '广告赋能', left: 'icon_back'}
  },
  {
    path: '/addEnabled',
    name: 'addEnabled',
    component: AddEnabled,
    meta: {
      title: '添加',
      left: 'icon_back'
    }
  },
  {
    path: '/edit',
    name: 'edit',
    component: Edit,
    meta: {
      title: '编辑',
      left: 'icon_back'
    }
  },
  {
    path: '/defaultRate',
    name: 'defaultRate',
    component: DefaultRate,
    meta: { title: '默认费率', left: 'icon_back' }
  },
  {
    path: '/merchantList',
    name: 'merchantList',
    component: MerchantList,
    meta: { title: '商家列表', left: 'icon_back', right: 'icon_search' }
  },
  {
    path: '/teamAdd',
    name: 'teamAdd',
    component: TeamAdd,
    meta: { title: '新增下级', left: 'icon_back' }
  },
  {
    path: '/team',
    name: 'team',
    component: Team,
    meta: { title: '团队管理', left: 'icon_back' }
  },
  {
    path: '/teamManage',
    name: 'teamManage',
    component: TeamManage,
    meta: { title: '管理下级', left: 'icon_back' }
  }
]
