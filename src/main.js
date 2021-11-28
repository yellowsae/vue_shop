import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import 'animate.css';
import TreeTable from 'vue-table-with-tree-grid'

// 全部引入
// import ElementUI from 'element-ui'

// 按需引入
import {
  Button,
  Select,
  Form ,
  Input,
  FormItem,
  Container,
  Message,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Option,
  Cascader,
} from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'

Vue.use(Cascader)
Vue.use(Option)
Vue.use(Select)
Vue.use(Tree)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(FormItem)
Vue.use(Button)
Vue.use(Select)
Vue.use(Form)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)

Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 配置 axios拦截器 加 token 验证 ， 通过axios 请求拦截器添加的token , 保证拥有获取数据的权限
axios.interceptors.request.use(Config => {
  // 为请头添加token 验证的 Authorization 字段
  Config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(Config)    // 返回的是一个请求的参数, 可以配置请求头， 添加参数
  return Config
})


// 将网络请求包 axios 添加到Vue的原型上
Vue.prototype.$http = axios

// 消息提示 Element , 挂载到Vue的原型上
Vue.prototype.$message = Message
// 确认消息 弹框
Vue.prototype.$confirm = MessageBox.confirm

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
