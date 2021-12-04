// 修改默认打包入口文件
const echarts = require('echarts')
const nprogress = require('nprogress')
module.exports = {
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      // 修改入口文件
      config.entry('app').clear().add('./src/main-prod.js')

      // 使用外部的CDN资源
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })

      // 自定制首页内容
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      // 修改入口文件
      config.entry('app').clear().add('./src/main-dev.js')
      // 自定制首页内容
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
