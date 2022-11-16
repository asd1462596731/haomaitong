import Home from '@/pages/home/'
import Login from '@/pages/auth/login'
import Register from '@/pages/auth/register'
import Verification from '@/pages/auth/verification'

// 首页
export default [
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: { title: '', left: 'icon_dp', right: 'icon_ld' }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { title: '', left: '', right: '' }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { title: '', left: '', right: '' }
  },
  {
    path: '/verification',
    name: 'verification',
    component: Verification,
    meta: { title: '', left: '', right: '' }
  }
]
