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
      <div id="main" style="width: 600px;height:400px;"></div>
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
    }
  },
  created () {},

  // 在模板挂载后执行初始化 echarts
  mounted () {
    //3.  准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById('main'))

    //4.  指定图表的配置项和数据
    let option = {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    }

    //5. 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  },
  methods: {},
}
</script>

<style scoped>

</style>
