import axios from 'axios'
import store from '../store'
import router from '../router/index'
import {
	Toast
} from 'vant'
import {
	axios_base_url
} from '../config'

import {
	getUrlParam
} from '@/util/GetUrlParam';

axios.defaults.timeout = 8000
let baseApiUrl
const NODE_ENV_TYPE = process.env.NODE_ENV
if (NODE_ENV_TYPE !== 'development') {
	baseApiUrl = axios_base_url
} else {
	baseApiUrl = '/api'
}
axios.defaults.baseURL = baseApiUrl

axios.defaults.headers = {
	'X-Requested-With': 'XMLHttpRequest',
	token: ''
}

let cancel = {}
const promiseArr = {}
const CancelToken = axios.CancelToken
// http request 拦截器
axios.interceptors.request.use(config => {
	//获取当前code
	// 发起请求时，取消掉当前正在进行的相同请求
	if (promiseArr[config.url]) {
		// promiseArr[config.url]('操作取消')
		promiseArr[config.url] = cancel
	} else {
		promiseArr[config.url] = cancel
	}
	const token = store.state.user_token
	if (token) {
		config.headers.token = token
	}
	return config
}, err => {
	return Promise.reject(err)
})

// http response 拦截器
axios.interceptors.response.use(response => {
	response = response.data
	if (response.code === 401) {
		if (router.currentRoute.name === 'home' || router.currentRoute.name === 'bill' || router.currentRoute
			.name === 'mine') {
			return false
		}
		store.commit('SET_USER_LOGOUT')
		// 只有在当前路由不是登录页面才跳转
		router.currentRoute.path !== 'login' && router.replace({
			path: 'login',
			query: {
				redirect: router.currentRoute.fullPath
			}
		})
	} else {
		return response
	}
}, error => {
	if (error.response) {
		switch (error.response.status) {
			case 401:
				if (router.currentRoute.name === 'home' || router.currentRoute.name === 'bill' || router
					.currentRoute.name === 'mine') {
					return false
				}
				// 401 清除token信息并跳转到登录页面
				store.commit('SET_USER_LOGOUT')

				// 只有在当前路由不是登录页面才跳转
				router.currentRoute.path !== 'login' && router.replace({
					path: 'login',
					query: {
						redirect: router.currentRoute.fullPath
					}
				})
				break
			default:
				console.log(error.response.status)
		}
	}
})

export default {
	// get请求
	get(url, param) {
		return new Promise((resolve, reject) => {
			axios({
				method: 'get',
				url,
				params: param,
				cancelToken: new CancelToken(c => {
					cancel = c
				})
			}).then(res => {
				resolve(res)
			}).catch(error => {
				Toast.fail('请求异常')
				window.API_CLOUD.hideProgress()
				console.log(JSON.stringify(error))
				reject(error)
			})
		})
	},
	// post请求
	post(url, param) {
		return new Promise((resolve, reject) => {
			axios({
				method: 'post',
				url,
				data: param,
				cancelToken: new CancelToken(c => {
					cancel = c
				}),
				validateStatus: function(status) {
					return status
				}
			}).then(res => {
				resolve(res)
			}).catch(error => {
				Toast.fail('请求异常')
				window.API_CLOUD.hideProgress()
				console.log(JSON.stringify(error))
				reject(error)
			})
		})
	}
}
