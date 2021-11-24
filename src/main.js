import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
// import ElementUI from 'element-ui'
import { Button, Select,Form ,Input, FormItem, Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'


Vue.use(FormItem)
Vue.use(Button)
Vue.use(Select)
Vue.use(Form)
Vue.use(Input)


Vue.config.productionTip = false

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 将网络请求包 axios 添加到Vue的原型上
Vue.prototype.$http = axios

// 消息提示 Element , 挂载到Vue的原型上
Vue.prototype.$message = Message

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
