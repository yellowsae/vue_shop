// 这是项目发布阶段需要用到的 babel 插件
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')  // 移除开发环境中生成的 console.log 输入
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  // 发布产品时候用到的插件数组
  plugins: [
    "@babel/plugin-syntax-dynamic-import",     // 路由懒加载
    ...prodPlugins,
  ],
}
