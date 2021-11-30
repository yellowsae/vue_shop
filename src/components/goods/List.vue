<template>
    <div>
      <!--  面包屑导航 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>

<!--      卡片视图 区-->
      <el-card>
<!--        row 区域 -->
        <el-row :gutter='20'>
<!--          文本框区 -->
          <el-col :span='8'>
            <el-input placeholder='请输入内容'>
              <el-button slot='append' icon='el-icon-search'></el-button>
            </el-input>
          </el-col>

<!--          添加商品按钮 -->
          <el-col :span='4'>
            <el-button type='primary'>添加商品</el-button>
          </el-col>
        </el-row>

        <!--   table表格区     -->
        <el-table :data='goodslist' border stripe >
          <el-table-column type='index' label='#'></el-table-column>
          <el-table-column prop='goods_name' label='商品名称'></el-table-column>
          <el-table-column prop='goods_price' width='105px' label='商品价格(元)'></el-table-column>
          <el-table-column prop='goods_weight'  width='80px'  label='商品重量'></el-table-column>
          <el-table-column prop='add_time'  width='130px' label='创建时间'></el-table-column>
          <el-table-column  width='130px' label='操作'>
            <template slot-scope=''>
              <el-button type='primary' size='mini' icon='el-icon-edit'></el-button>
              <el-button type='danger' size='mini'  icon='el-icon-delete'></el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'List',
  data () {
    return {
      // 请求获取数据的参数
      queryInfo: {
        query: '',
        pagenum: 1,  // 当前页码
        pagesize: 15 // 每页显示条数
      },
      goodslist: [], // 保存的数据
      total: 0, // 总条数
    }
  },

  created () {
    this.getGoodsList()
  },

  methods: {
    async getGoodsList() {
      const {data: result} = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if(result.meta.status !== 200) return this.$message.error('获取商品列表数据失败')
      this.goodslist = result.data.goods
      console.log(result.data.goods)
      this.total = result.data.total
    }
  }
}
</script>

<style scoped>

</style>
