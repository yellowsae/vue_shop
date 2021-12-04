<template>
<div>
  <!--  面包屑导航 -->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    <el-breadcrumb-item>数据报表</el-breadcrumb-item>
  </el-breadcrumb>

<!--  卡片视图 -->
    <el-card>
      <!-- 2. 为 ECharts 准备一个定义了宽高的 DOM -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
</div>
</template>

<script>
// echarts 的使用
//1. 导入 echarts
// import echarts from 'echarts'
import * as echarts from 'echarts';  // 在项目中引用 eCharts
export default {
  name: 'Report',
  data () {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      },
    }
  },
  created () {},

  // 在模板挂载后执行初始化 echarts
  async mounted () {
    //3.  准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById('main'))

    //4.  指定图表的配置项和数据

    // 发起请求获取数据
    const {data: result} =  await this.$http.get('reports/type/1')

    if (result.meta.status !== 200) return this.$message.error('获取数据折线图失败')

    // 将数据进行合并 
    Object.assign(this.options,result.data)
    //5. 使用刚指定的配置项和数据显示图表。
    myChart.setOption(this.options)
  },
  methods: {},
}
</script>

<style scoped>

</style>
