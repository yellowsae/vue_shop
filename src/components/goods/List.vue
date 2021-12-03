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
          <el-col :span='8' >
            <el-input
              clearable
              @clear='getGoodsList'
              placeholder='请输入内容'
              v-model='queryInfo.query' >
              <el-button slot='append' icon='el-icon-search' @click='getGoodsList'></el-button>
            </el-input>
<!--           clearable 清空按钮， @clear 清空后执行的函数  -->
          </el-col>

<!--          添加商品按钮 -->
          <el-col :span='4'>
            <el-button type='primary' @click='addGoodPage'>添加商品</el-button>
          </el-col>
        </el-row>

        <!--   table表格区     -->
        <el-table :data='goodslist' border stripe >
          <el-table-column type='index' label='#'></el-table-column>
          <el-table-column prop='goods_name' label='商品名称'></el-table-column>
          <el-table-column prop='goods_price' width='105px' label='商品价格(元)'></el-table-column>
          <el-table-column prop='goods_weight'  width='80px'  label='商品重量'></el-table-column>
          <el-table-column prop='add_time'  width='130px' label='创建时间'>
            <template slot-scope='scope'>
              {{scope.row.add_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column  width='130px' label='操作'>
            <template slot-scope='scope'>
              <el-button type='primary' size='mini' icon='el-icon-edit'></el-button>
              <el-button type='danger' size='mini'  icon='el-icon-delete' @click='removeById(scope.row.goods_id)'></el-button>
            </template>
          </el-table-column>

        </el-table>

<!--        分页区 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :total="total">
        </el-pagination>
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
      this.total = result.data.total
    },

    // 页数发生改变的时候调用函数
    handleSizeChange(newSize) {

      this.queryInfo.pagesize = newSize
      this.getGoodsList()  // 更新模板数据
    },
    // 当页码值发生改变时候调用函数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()  // 更新模板数据
    },
    // 根据id删除数据
    async removeById(goods_id) {
      const confirmResult =  await  this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err )

      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')

      // 删除操作
      const {data: result }  = await this.$http.delete(`goods/${goods_id}`)
      if (result.meta.status !== 200) return this.$message.error('删除商品失败')
      this.$message.success(result.meta.msg)
      // 更新数据
      await this.getGoodsList()  // 更新模板数据
    },
    // 添加商品列表
    addGoodPage() {
      // 跳转页面
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style scoped>

</style>
