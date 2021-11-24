import Vue from 'vue'
import VueRouter from 'vue-router'
//登录组件
import Login from '../components/Login'
//Home组件
import Home from '../components/Home'
Vue.use(VueRouter)


const router = new VueRouter({
  routes: [
    {path: '/', redirect: '/login'},
    {path: '/login',component: Login},
    {path: '/home', component: Home}
  ],
})
// router.beforeEach((to,from,next)=> {
//   if(to.path === '/login') return next()
//   const tokenStr = window.sessionStorage.getItem('token')
//   console.log(tokenStr)
//   if(!tokenStr) return next("/login")
//   next()
// })
router.beforeEach((to,from,next)=> {
  // to 将要访问那个路径
  // from 代表从那个路径跳转而来
  // next() 是一个函数， 表示放行  ，  next('/login') 强制跳转
  if(to.path === '/login') return next()
  // 获取 token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})
export default router
