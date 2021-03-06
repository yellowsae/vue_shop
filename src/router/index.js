import Vue from 'vue'
import VueRouter from 'vue-router'

// 使用路由懒加载
//登录组件
// import Login from '../components/Login'
// import Home from '../components/Home'
// import Welcome from '../components/Welcome'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login')   // login_home_welcome 组名
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome')

// import User from '../components/user/User'
// import Rights from '../components/power/Rights'
// import Roles from '../components/power/Roles'
const User = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/user/User')
const Rights = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/power/Rights')
const Roles = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/power/Roles')

// import Cate from '../components/goods/Cate'
// import Params from '../components/goods/Params'
const Cate = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Cate')
const Params = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Params')

// import GoodsList from '../components/goods/List'
// import GoodsAdd from '../components/goods/Add'
const GoodsList = () => import(/* webpackChunkName: "list_add" */ '../components/goods/List')
const GoodsAdd = () => import(/* webpackChunkName: "list_add" */ '../components/goods/Add')

// import Order  from '../components/order/Order'
// import Report from '../components/report/Report'
const Order = () => import(/* webpackChunkName: "order_report" */ '../components/order/Order')
const Report = () => import(/* webpackChunkName: "order_report" */ '../components/report/Report')

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
        {path: '/roles', component: Roles},
        {path: '/categories', component: Cate},
        {path: '/params', component: Params},
        {path: '/goods', component: GoodsList},
        {path: '/goods/add', component: GoodsAdd},
        {path:'/orders', component: Order},
        {path: '/reports', component: Report}
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
