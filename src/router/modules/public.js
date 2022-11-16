import Corss from '@/pages/public/cross'

import Wallet from '@/pages/public/wallet'

import Withdraw from '@/pages/public/withdraw'

import Pay from '@/pages/public/pay'

import FundDetails from '@/pages/public/fundDetails'

import WithdrawDetail from '@/pages/public/withdrawDetail'

import PayDetail from '@/pages/public/payDetail'

import ApplyShop from '@/pages/public/applyShop'

import MaterialStore from '@/pages/public/materialStore'

import MyOrder from '@/pages/public/materialStore/myOrder'

import StoreAddress from '@/pages/public/materialStore/storeAddress'

import SureOrder from '@/pages/public/materialStore/sureOrder'

import SelectAddress from '@/pages/public/applyShop/selectAddress'

import ChangeCard from '@/pages/public/applyShop/changeCard'

import ApplyRate from '@/pages/public/applyShop/applyRate'

import ChartsMerchant from '@/pages/public/charts/chartsMerchant'

import ChartsSale from '@/pages/public/charts/chartsSale'

// 首页
export default [

	{
		path: '/chartsSale',
		name: 'chartsSale',
		component: ChartsSale,
		meta: {
			title: '分佣报表',
			left: 'icon_back',
			right: ''
		}
	},
	{
		path: '/chartsMerchant',
		name: 'chartsMerchant',
		component: ChartsMerchant,
		meta: {
			title: '经营报表',
			left: 'icon_back',
			right: ''
		}
	},
	{
		path: '/changeCard',
		name: 'changeCard',
		component: ChangeCard,
		meta: {
			title: '换绑卡',
			left: 'icon_back',
			right: ''
		}
	},
	{
		path: '/materialStore',
		name: 'materialStore',
		component: MaterialStore,
		meta: {
			title: '物料商城',
			left: 'icon_back',
			right: 'my_order'
		}
	},
	{
		path: '/myOrder',
		name: 'myOrder',
		component: MyOrder,
		meta: {
			title: '我的订单',
			left: 'icon_back',
			right: ''
		}
	},
	{
		path: '/storeAddress',
		name: 'storeAddress',
		component: StoreAddress,
		meta: {
			title: '填写地址',
			left: 'icon_back',
			right: ''
		}
	},
	{
		path: '/sureOrder',
		name: 'sureOrder',
		component: SureOrder,
		meta: {
			title: '确认订单',
			left: 'icon_back',
			right: ''
		}
	},
	{
		path: '/cross',
		name: 'cross',
		component: Corss,
		meta: {
			title: '跨界佣金',
			left: 'icon_back',
			right: ''
		}
	},
	{
		path: '/wallet',
		name: 'wallet',
		component: Wallet,
		meta: {
			title: '我的钱包',
			left: 'icon_back',
			right: 'wallet_detail'
		}
	},
	{
		path: '/withdraw',
		name: 'withdraw',
		component: Withdraw,
		meta: {
			title: '我要提现',
			left: 'icon_back',
			right: 'withdraw_detail'
		}
	},
	{
		path: '/pay',
		name: 'pay',
		component: Pay,
		meta: {
			title: '我要充值',
			left: 'icon_back',
			right: 'pay_detail'
		}
	},
	{
		path: '/payDetail',
		name: 'payDetail',
		component: PayDetail,
		meta: {
			title: '充值记录',
			left: 'icon_back',
			right: ''
		}
	},
	{
		path: '/fundDetails',
		name: 'fundDetails',
		component: FundDetails,
		meta: {
			title: '资金明细',
			left: 'icon_back',
			right: ''
		}
	},
	{
		path: '/withdrawDetail',
		name: 'withdrawDetail',
		component: WithdrawDetail,
		meta: {
			title: '提现记录',
			left: 'icon_back',
			right: ''
		}
	},
	{
		path: '/selectAddress',
		name: 'selectAddress',
		component: SelectAddress,
		meta: {
			title: '选择地址',
			left: 'icon_back' /* right: 'sure_choose' */
		}
	},
	{
		path: '/applyRate',
		name: 'applyRate',
		component: ApplyRate,
		meta: {
			title: '结算费率',
			left: 'icon_back',
			right: ''
		}
	},
	{
		path: '/applyShop',
		name: 'applyShop',
		component: ApplyShop,
		meta: {
			title: '商家开户',
			left: 'icon_back',
			right: 'change_card'
		}
	}

]
