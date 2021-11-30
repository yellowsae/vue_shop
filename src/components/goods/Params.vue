<template>
  <div>
    <!--  面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

<!--  卡片视图  -->
    <el-card>
<!--      警告文本 -->
      <el-alert
        show-icon
        :closable='false'
        title="注意：只允许为三级分类设置相关参数！"
        type="warning">
      </el-alert>

<!--      选择分类区 -->
      <el-row class='cat_opt'>
        <el-col>
          <span>选择商品的分类： </span>
<!--          级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"></el-cascader>
        </el-col>
      </el-row>

<!--      tabs  标签-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type='primary' size='mini' :disabled='isBtnDisabled' @click='addDialogVisible = true'>添加参数</el-button>
<!--          动态参数表格  -->
          <el-table :data='manyTableData' border stripe>
<!--            展开列-->
            <el-table-column type='expand'>
              <template slot-scope='scope'>
<!--               标签的循环 -->
                <el-tag
                  closable
                  @close='handleClose(i,scope.row)'
                  v-for="(item, i) in scope.row.attr_vals"
                  :key='i'>{{item}}</el-tag>
<!--                添加标签的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
<!--            索引列 -->
            <el-table-column type='index' label='#'></el-table-column>
            <el-table-column  label='动态属性' prop='attr_name'></el-table-column>
            <el-table-column  label='操作' >
              <template slot-scope='scope'>
                <el-button size='mini' type="primary" class="el-icon-edit" @click='showEditDialog(scope.row.attr_id)'>编辑</el-button>
                <el-button  size='mini' type="danger" class="el-icon-delete" @click='removeParams(scope.row.attr_id)'>删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button type='primary' size='mini' :disabled='isBtnDisabled' @click='addDialogVisible = true'>添加属性</el-button>
          <el-table :data='onlyTableData' border stripe>
            <!--            展开列-->
            <el-table-column type='expand'>
              <template slot-scope='scope'>
                <!--               标签的循环 -->
                <el-tag
                  closable
                  @close='handleClose(i,scope.row)'
                  v-for="(item, i) in scope.row.attr_vals"
                  :key='i'>{{item}}</el-tag>
                <!--                添加标签的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>            <!--            索引列 -->
            <el-table-column type='index' label='#'></el-table-column>
            <el-table-column  label='静态属性' prop='attr_name'></el-table-column>
            <el-table-column  label='操作' >
              <template slot-scope='scope'>
                <el-button size='mini' type="primary" class="el-icon-edit" @click='showEditDialog(scope.row.attr_id)' >编辑</el-button>
                <el-button  size='mini' type="danger" class="el-icon-delete" @click='removeParams(scope.row.attr_id)' >删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

<!--    添加参数的对话框 -->
    <el-dialog
      :title=" '添加' +  titleText"
      :visible.sync="addDialogVisible"
      @close='addDialogClosed'
      width="50%">
<!--      添加对话框 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
    </el-dialog>

<!--    修改参数的对话框 -->
    <el-dialog
      :title=" '修改' +  titleText"
      :visible.sync="EditDialogVisible"
      @close='EditDialogClosed'
      width="50%">
      <el-form :model="EditForm" :rules="EditFormRules" ref="EditFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="EditForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="EditDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="EditParams">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data () {
    return {
      catelist: [],
      // 级联选择框的配置对象
      cateProps: {
        expandTrigger: 'hover',
        children: 'children',
        value: 'cat_id',
        label: 'cat_name'
      },
      // 级联选择框双向绑定的数组
      selectedCateKeys: [],
      // tab 动态参数
      activeName: 'only',
      // 存放参数数据
      manyTableData: [],
      onlyTableData: [],

      // 控制对话框
      addDialogVisible: false,

      // 添加对话框的表单数据
      addForm: {
        attr_name: ''
      },
      // 规则
      addFormRules: {
        attr_name: [{required: true, message:"请输入参数名称", trigger: true},]
      },

      //控制修改参数
      EditDialogVisible: false,
      // 修改数据的表单
      EditForm: {
        attr_name: ''
      },
      EditFormRules: {
        attr_name: [{required: true, message:"请输入参数名称", trigger: true},]
      },

    }
  },
  created () {
    this.getCateList()
  },

  methods: {
    async getCateList() {
      const {data:result} =  await this.$http.get('categories')
      if(result.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.catelist = result.data
    },

    // 级联选择框中选项变化， 会触发这个函数
    handleChange() {
      this.getParamsData()
    },

    // tab 页签点击事件处理函数
    handleTabClick() {
      this.getParamsData()
    },

    // 获取参数列表的函数
    async getParamsData() {
      // 证明选中的数组不是三级分类
      if(this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      //证明选中的三级分类
      //根据所选的分类Id，和当前所处的面板，获取对应的参数
      const {data: result} =  await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: this.activeName}})
      if(result.meta.status !== 200) return this.$message.error('获取参数列表失败')

      result.data.forEach( item => {
        // 以空格分割为 数组，在进行添加 , 并判断字符串是否为 空
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })
      // 对获取到的数据进行判断
      if (this.activeName === 'many') {
        this.manyTableData = result.data
      }else {
        this.onlyTableData = result.data
      }
    },

    //监听对话框的关闭
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },

    // 添加属性函数
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if(!valid) return this.$message.info('请正确添加参数')

        const {data: result} = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if(result.meta.status !== 201) return this.$message.error('添加属性失败')
        this.$message.success('添加参数成功')
        await this.getParamsData() // 更新数据
        this.addDialogVisible = false
      })
    },

    // 展示编辑的对话框
    async showEditDialog(atta_id) {
      // 根据id查询相关参数
      const {data: result}  = await this.$http.get(`categories/${this.cateId}/attributes/${atta_id}`, {
        params: {attr_sel: this.activeName }
      })
      if (result.meta.status !== 200) return this.$message.error('查询失败')
      // 赋值
      this.EditForm =  result.data
      this.EditDialogVisible = true
    },
    // 关闭修改对话框
    EditDialogClosed() {
      this.$refs.EditFormRef.resetFields()
    },

    // 确定修改参数的按钮
    EditParams() {
      this.$refs.EditFormRef.validate( async(valid) => {
        if(!valid) return
        const {data: result} = await this.$http.put(`categories/${this.cateId}/attributes/${this.EditForm.attr_id}`, {
          attr_name: this.EditForm.attr_name,
          attr_sel: this.activeName
        })
        if(result.meta.status !== 200) return this.$message.error('更新数据失败 ')
        await this.getParamsData() // 更新数据
      })
      this.EditDialogVisible = false
    },

    // 根据Id参数对应的参数项
    async removeParams(attr_id) {
       const confirmResult =  await this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 用户取消了删除
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // 确认删除操作
      const {data : result } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
      if (result.meta.status !==  200 ) return this.$message.error('删除失败')
      this.$message.success(result.meta.msg)
      await this.getParamsData() // 更新数据
    },

    // 键盘按下，或者失去焦点时候执行的方法
    handleInputConfirm(row) {
      // 没有添加数据
      if(row.inputValue.trim().length === 0) {
        row.inputValue = ''  // 清空
        row.inputVisible = false  // 显示按钮
        return
      }
      // 输入了文本数据， 添加到页面
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''  // 清空
      row.inputVisible = false  // 显示按钮

      this.saveAttribute(row)
    },
    // 按下按钮，执行显示文本框
    showInput(row) {
      row.inputVisible = true
      // this.$nextTick 回调函数 ，当页面上的函数被重新渲染后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        // 找到input框
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    async saveAttribute(row) {
      // 需要发起请求， 将添加的数据 保存到数据库
      const {data: result} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if(result.meta.status !== 200 ) return this.$message.error('添加失败')
    },
    // 删除tag标签可选项
    handleClose(i, row) {
      // 根据 row 的索引列删除 标签
      row.attr_vals.splice(i, 1)
      // 更新数据库
      this.saveAttribute(row)
    }

  },

  computed: {
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的Id
    cateId () {
      if(this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },

    // 动态绑定参数
    titleText() {
      if(this.activeName === 'many') {
        return "动态参数"
      }else {
        return "静态属性"
      }
    }
  }
}
</script>

<style scoped>
.cat_opt {
  margin: 15px 0;
}

.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
