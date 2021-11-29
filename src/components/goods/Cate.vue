<template>
  <div>
    <!--  面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

<!--  卡片视图  -->
    <el-card>
<!--      添加分类区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click='showCateDialog'>添加分类</el-button>
        </el-col>
      </el-row>

<!--  表格视图区     -->
      <tree-table
        class='tree-table'
        :columns='columns'
        :selection-type='false'
        :expand-type='false'
        show-index
        index-text='#'
        border
        :show-row-hover='false'
        :data='cateList'>
<!--        是否有效 -->
        <template
          slot-scope="scope"
          slot='isok'>
          <i class='el-icon-success'
             v-if='scope.row.cat_deleted === "false" '
             style='color: lightgreen'
          ></i>
          <i class='el-icon-error'
             style='color: red'
             v-else ></i>
        </template>

<!--        排序  -->
        <template
          slot-scope='scope'
          slot='order'
        >
        <el-tag size='mini'  type='primary' v-if='scope.row.cat_level === 0' >一级</el-tag>
        <el-tag size='mini' type='success' v-else-if='scope.row.cat_level === 1'>二级</el-tag>
        <el-tag size='mini' type='warning' v-else>三级</el-tag>
        </template>

<!--       操作 -->
        <template slot-scope='' slot='opt'>
          <el-button size='mini' type='primary' icon='el-icon-edit' >编辑</el-button>
          <el-button size='mini' type='danger' icon='el-icon-delete'>删除</el-button>
        </template>
      </tree-table>

<!--   底部页面跳转区  -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

<!--  添加对话框区   -->
    <el-dialog
      title="添加分类"
      :visible.sync="showCateDialogVisible"
      width="50%"
      @close='addCateDialogClosed'
      >
<!--      显示的表单内容 -->
      <el-form ref="CateFormRef" :model="CateForm" :rules='CateFormRules' label-width="100px">
        <el-form-item label="分类名称："  >
          <el-input  v-model="CateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：" >
<!--          :options="CateList" 指定数据源  -->
          <el-cascader
            v-model="seleteKeys"
            :options="CateList"
            :props="cascaderProps"
            clearable
            @change="CateHandleChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="showCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: 'Cate',
  data () {
    return {
      // 定义请求参数
      queryInfo: {
        type: 3,  // 3层分类列表
        pagenum: 1,  // 当前页码值
        pagesize: 5  // 每页显示多少条数据
      },
      // 保存数据的列表
      cateList: [],
      // 总数据条数
      total: 0,
      // 表格数据显示
      columns: [
        {label: '分类名称', prop: 'cat_name'},
        {
          label: '是否有效',
          // 表示当前定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {label: '排序', type: 'template',template: 'order'},
        {label: '操作', type: 'template',template: 'opt'},
      ],

      // 添加分类对话框
      showCateDialogVisible: false,

      // Cate表单的数据
      CateForm: {
        cat_name: '',
        cat_pid: 0,  // 默认为父id
        cat_level: 0  // 分类层级， 默认为0
      },
      // 规则
      CateFormRules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' },]
      },

      // 保存分类列表区
      CateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //
      seleteKeys: [],
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const {data: result} =  await this.$http.get('categories', {params: this.queryInfo})
      if(result.meta.status !== 200) return this.$message.error('获取用户数据失败')
      // 给模板数据赋值
      this.cateList = result.data.result
      // 总数据条数
      this.total = result.data.total
    },

    // 监听 pagesize 改变 显示数据的值
    async handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      await this.getCateList()
    },
    // 页码值更新
    async handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      await this.getCateList()  // 更新数据和模板
    },
    // 添加分类弹出的对话框
    showCateDialog() {
      // 获取分类数据
      this.getCategories()
      this.showCateDialogVisible = true
    },

    // 获取到父级分类内容
    async getCategories() {
      const {data: result} = await this.$http.get('categories', {params: {type: 2}})
      if(result.meta.status !== 200) return this.$message.error('获取分类列表失败')
      this.CateList = result.data
    },

    // 选择项发生变化时的值
    CateHandleChange() {
      if(this.seleteKeys.length > 0) {
        this.CateForm.cat_pid = this.seleteKeys[ this.seleteKeys.length - 1]
        this.CateForm.cat_level = this.seleteKeys.length
        return
      }else {
        this.CateForm.cat_pid = 0
        this.CateForm.cat_level = 0
      }
    },

    // 点击按钮，添加新的分类
    addCate() {
      this.$refs.CateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.CateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功！')
        await this.getCateList()
        this.showCateDialogVisible = false
      })
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.CateFormRef.resetFields()
      this.seleteKeys = []
      this.CateForm.cat_level = 0
      this.CateForm.cat_pid = 0
    }
  },
}
</script>

<style scoped>

.tree-table {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>
