import Vue from 'vue'
import VueRouter from 'vue-router'
//登录组件
import Login from '../components/Login'
//Home组件
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import User from '../components/user/User'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
Vue.use(VueRouter)


const router = new VueRouter({
  routes: [
    {path: '/', redirect: '/login'},
    {path: '/login',component: Login},
    {path: '/home', component: Home,
      redirect: '/welcome',  // 配置路由重定向
      children: [
        {path: '/welcome', component: Welcome},
        {path: '/users', component: User},
        {path: '/rights', component: Rights },
        {path: '/roles', component: Roles}
      ]}
  ],
})

// 配置路由守卫
router.beforeEach((to,from,next)=> {
  // to 将要访问那个路径
  // from 代表从那个路径跳转而来
  // next() 是一个函数， 表示放行  ，  next('/login') 强制跳转

  // 判断/login表示可以放行
  if(to.path === '/login') return next()
  // 获取 token
  const tokenStr = window.sessionStorage.getItem('token')
  // 判断是否具有 token , 如果没有token, 或者token为空， 则强制条状 /login
  if(!tokenStr) return next('/login')

  // 其他情况， 放行
  next()
})


export default router
