import Vue from 'vue'
import VueRouter from 'vue-router'
//登录组件 
import Login from '../components/Login.vue'
Vue.use(VueRouter)

const routes = [{
    path: '/', // 路由根路径
    redirect: '/login' //跳转到 login
}, {
    path: '/login',
    component: Login
}]

const router = new VueRouter({
    routes
})

export default router