<template>
  <div>
    <!--  面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

<!--    卡片视图区-->
    <el-card>
<!--      导航搜索区 -->
      <el-row :gutter='20'>
        <el-col :span='8'>
          <el-input clearable placeholder='请输入内容' >
            <el-button  icon='el-icon-search' ></el-button>
          </el-input>
        </el-col>
      </el-row>

<!--      table 表格区 -->
      <el-table :data='orderlist' border stripe >
        <el-table-column label='#' type='index'></el-table-column>
        <el-table-column prop='order_number' label='订单编号'></el-table-column>
        <el-table-column prop='order_price' width='120px' label='订单价格'></el-table-column>
        <el-table-column prop='order_price' width='120px' label='是否付款'>
          <template slot-scope='scope'>
            <el-tag type="success" v-if="scope.row.order_pay === '1' ">已付款</el-tag>
            <el-tag  type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop='is_send'  width='120px' label='是否发货'></el-table-column>
        <el-table-column prop='create_time'  width='180px' label='下单时间'>
          <template slot-scope='scope'>
<!--            使用时间过滤器 -->
            {{scope.row.create_time | dateFormat  }}
          </template>
        </el-table-column>
        <el-table-column  label='操作' width='130px'>
          <template slot-scope=''>
            <el-button type='primary' size='mini' icon='el-icon-edit' @click='showBox'></el-button>
            <el-button type='success' size='mini' icon='el-icon-location' @click='showProgressBox'></el-button>
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

<!--    编辑的弹窗 -->
    <el-dialog
      title="修改信息"
      :visible.sync="EditDialogVisible"
      @close="addDialogClosed"
      width="50%">
<!--      弹窗内容表单 -->
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
<!--          级联选择器 -->
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
            ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

<!--    物流信息的弹窗 -->
    <el-dialog
      title="物流信息"
      :visible.sync="ProgressVisible"
      width="50%"
     >
<!--      时间线 -->
      <el-timeline >
        <el-timeline-item
          v-for="(activity, index) in ProgressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>

  </div>
</template>

<script>
// 导入city 数据
import cityData from './citydata'
export default {
  name: 'Order',
  data () {
    return {
      // 订单请求数据
      queryInfo: {
        query: '',
        pagenum: 1,  // 当前页码
        pagesize: 10, // 每页显示的条数
      },
      // 订单数据
      orderlist: [],
      // 总条数
      total: 0,
      // 控制编辑按钮的弹框
      EditDialogVisible: false,
      // 保存 dialog 数据的表单
      addressForm: {
        address1: '',
        address2: '',
      },
      addressFormRules: {
        address1: [ { required: true, message: '请选择省市区/县', trigger: 'blur' },],
        address2: [{ required: true, message: '请输入详细地址', trigger: 'blur' },],
      },
      cityData,

      // 控制物流信息的弹窗
      ProgressVisible: false,
      // 保存物流信息
      ProgressInfo: [],

    }
  },
  created () {
    this.getOrderInfo()
  },
  methods: {
    // 获取数据
    async getOrderInfo() {
      const {data: result} = await this.$http.get('orders', {params: this.queryInfo} )
      if (result.meta.status !== 200 ) return  this.$message.error('获取数据失败')

      this.orderlist = result.data.goods
      this.total = result.data.total
    },

    // 展示条数发生改变时调用函数
    handleSizeChange(newSize) {
      // 重新发起请求获取信息
      this.queryInfo.pagesize = newSize
      this.getOrderInfo()
    },

    // 页码发生改变时调用的函数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      // 重新发起请求获取信息
      this.getOrderInfo()
    },
    // 控制编辑的弹窗
    showBox() {
      this.EditDialogVisible = true
    },

    // 关闭对话框时, 执行的函数
    addDialogClosed() {
      // 清除表单数据
      this.$refs.addressFormRef.resetFields()
    },

    // 物流信息的按钮
     showProgressBox() {
      // 发起请求获取物流信息
      // const {data: result} = this.$http.get('/kuaidi/804909574412544580')
      // if (result.meta.status !== 200) return this.$message.error('获取物流信息失败')
      // 发起请求后台服务器回崩

      // 使用现有数据保存
      this.ProgressInfo = [
        {
          "time": "2018-05-10 09:39:00",
          "ftime": "2018-05-10 09:39:00",
          "context": "已签收,感谢使用顺丰,期待再次为您服务",
          "location": ""
        },
        {
          "time": "2018-05-10 08:23:00",
          "ftime": "2018-05-10 08:23:00",
          "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          "location": ""
        },
        {
          "time": "2018-05-10 07:32:00",
          "ftime": "2018-05-10 07:32:00",
          "context": "快件到达 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-10 02:03:00",
          "ftime": "2018-05-10 02:03:00",
          "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-09 23:05:00",
          "ftime": "2018-05-09 23:05:00",
          "context": "快件到达 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 21:21:00",
          "ftime": "2018-05-09 21:21:00",
          "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 13:07:00",
          "ftime": "2018-05-09 13:07:00",
          "context": "顺丰速运 已收取快件",
          "location": ""
        },
        {
          "time": "2018-05-09 12:25:03",
          "ftime": "2018-05-09 12:25:03",
          "context": "卖家发货",
          "location": ""
        },
        {
          "time": "2018-05-09 12:22:24",
          "ftime": "2018-05-09 12:22:24",
          "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          "location": ""
        },
        {
          "time": "2018-05-08 21:36:04",
          "ftime": "2018-05-08 21:36:04",
          "context": "商品已经下单",
          "location": ""
        }
      ]
      this.ProgressVisible = true
    },
  },
}
</script>

<style scoped>

.el-cascader {
  width: 100%;
}
</style>
