<template>
  <div>
    <!--  面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

<!--    卡片视图 -->
    <el-card>
<!--      添加角色按钮去区-->
      <el-row>
        <el-col>
          <el-button type='primary' @click='AddUserDialogVisible = true'>添加角色</el-button>
        </el-col>
      </el-row>
<!--      用户权限列表区-->
      <el-table
        border
        stripe
        :data='RolesList'>
<!--        展开列 -->
        <el-table-column  type='expand' >
          <template slot-scope='scope'>
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key='item1.id'
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter' ]"
            >
<!--              渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close='removeRightById(scope.row, item1.id)'>
                  {{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
<!--              渲染二级权限和三级权限 -->
              <el-col :span="19">
<!--                通过for循环嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key='item2.id'
                >
                  <el-col :span='6'>
                    <el-tag
                      closable
                      @close='removeRightById(scope.row, item2.id)'
                      type='success'>{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

<!--                  三级权限 -->
                  <el-col :span='18'>
                    <el-tag
                      v-for="(item3) in item2.children"
                      :key='item3.id'
                      closable
                      @close='removeRightById(scope.row, item3.id)'
                      type='warning'>{{item3.authName}}</el-tag>
                  </el-col>

                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type='index' label='#'></el-table-column>
        <el-table-column label='角色名称' prop='roleName'></el-table-column>
        <el-table-column label='角色描述' prop='roleDesc'></el-table-column>
        <el-table-column label='操作' width='300px'>
          <template slot-scope='scope'>
            <!--           修改按钮-->
            <el-button
              @click="showEditDialog(scope.row.id)"
              type="primary" icon="el-icon-edit" size='mini'  >编辑</el-button>
            <!--           删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size='mini' @click="removeUser(scope.row.id)" >删除</el-button>
            <!--           分配角色按钮 -->
              <el-button type="warning" icon="el-icon-setting"  size='mini' @click='showRolesInfo(scope.row)'>分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--   添加角色的弹出对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="AddUserDialogVisible"
      width="30%"
      @close='addDialogClosed'
    >
      <!--     内容主体区 -->
      <el-form
        ref="AddFormRef"
        :model="AddForm"
        :rules='AddFormRules'
        label-width="80px">
        <el-form-item label="添加角色" prop="roleName">
          <el-input v-model="AddForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="AddForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!--     底部区域 -->
      <span slot="footer" class="dialog-footer">
    <el-button @click="AddUserDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
    </el-dialog>

    <!--   修改角色信息弹出的对话框 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="editUserDialogVisible"
      width="40%"
    >
      <!--     表单数据  -->
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules='editFormRules'
        @close='restEditInfo'
        label-width="80px">
        <el-form-item label="角色信息">
          <el-input v-model="editForm.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色权限" prop='roleDesc'>
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editUserDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="EditUserInfo">确 定</el-button>
  </span>
    </el-dialog>

<!--    分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="showRolesInfoDialog"
      width="50%"
      @close='setRolesDialogClosed'
    >
      <el-tree
        :props='treeProps'
        show-checkbox
        node-key='id'
        default-expand-all
        :default-checked-keys='defKeys'
        ref='treeRefs'
        :data="rightslist">
      </el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="showRolesInfoDialog = false">取 消</el-button>
    <el-button type="primary" @click="allotRoles">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      RolesList: [],
      AddUserDialogVisible : false,  // 添加用户角色弹框
      //  添加用户数据的表单
      AddForm: {
        roleName: '',  // 角色名称
        roleDesc: '',  // 角色描述
      },
      // 添加用户数据的规则
      AddFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },

      // 控制修改用户弹出对话框
      editUserDialogVisible: false,

      // 定义一个空对象，接收查询到的用户信息
      editForm: {},
      // 修改用户数据的规则
      editFormRules: {
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },

      // 用户权限弹窗
      showRolesInfoDialog: false,
      rightslist: [],  // 所有权限的数据
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',  // 看到的属性
        children: 'children'  // 父子节点属性
      },
      // 默认选中的节点id值数组
      defKeys: [],
      // 保存当前分配权限角色的id
      roleId: '',
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
     const {data: result} =  await this.$http.get('roles')
      if(result.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.RolesList = result.data
    },

    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      //  使用 表单对象中的 rest 方法 清空表单数据
      this.$refs.AddFormRef.resetFields()
    },

    //  点击按钮添加用户
    addUser() {
      //  添加前，对表单数据进行预校验
      this.$refs.AddFormRef.validate(async (valid) => {
        if(!valid) return
        // 发起添加用户的网络请求
        const {data: result} =  await this.$http.post('roles',  this.AddForm)
        if (result.meta.status !== 201) return this.$message.error('添加角色失败')
        this.$message.success('添加角色成功')
        // 隐藏添加用户的对话框
        this.AddUserDialogVisible = false
        // 重新获取用户的列表
        await this.getRolesList()
      })
    },

    // 显示修改用户的弹出对话框
    async showEditDialog(id) {
      // 接收到用户的ID
      // 查询用户的ID
      const {data: result} = await this.$http.get(`roles/${id}`)
      if(result.meta.status !== 200) return this.$message.error('查询用户信息失败')
      this.editForm = result.data
      this.editUserDialogVisible = true
    },

    // 重置修改用户数据的表单
    restEditInfo() {
      this.$refs.editFormRef.resetFields()
    },

    //  修改用户数据并提交
    EditUserInfo() {
      // 修改前的预验证
      this.$refs.editFormRef.validate(async(valid) => {
        if(!valid) return
        // 发起网络请求更新数据
        const {data : result } = await this.$http.put(`roles/${this.editForm.roleId}`,
          {  // 修改数据携带的参数
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          } )
        if(result.meta.status !== 200) return this.$message.error("修改用户数据失败")
        this.editUserDialogVisible = false  // 关闭对话框
        await this.getRolesList()  // 重新获取用户信息
        this.$message.success('成功修改用户数据') // 提示成功修改信息
      })
    },

    // 删除用户角色
    async removeUser(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      // 如果用户点击确认 返回  confirm
      // 如果用户点击取消 返回 cancel
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const {data: result} =  await this.$http.delete(`roles/${id}`)
      if(result.meta.status !== 200) return this.$message.error(result.meta.msg)
      await this.getRolesList()  // 重新获取用户信息
      this.$message.success(result.meta.msg) // 显示成功信息
    },

    // 弹窗用户是否删除权限
    async removeRightById(roleId,rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限，是否继续？",
        "提示",
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if(confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const {data: result} = await this.$http.delete(`roles/${roleId.id}/rights/${rightId}`)
      if(result.meta.status !== 200) return this.$message.error("删除权限失败")
      // 不需要重新获取数据，因为重新获取数据会重新解析模板，页面进行抖动
      roleId.children = result.data  // 将返回的数据赋值给当前对象就行
    },

    // 权限分配的 弹窗
    async showRolesInfo(role) {
      // 保存当前分配角色的id
      this.roleId = role.id
      //获取所有权限的数据
      const {data : result} =  await this.$http.get('rights/tree')
      if(result.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightslist = result.data
      // 调用递归函数获取三级节点
      this.getLeafKeys(role,this.defKeys)
      // this.defKeys = result.data.
      this.showRolesInfoDialog = true
    },

  //  通过递归形式获取节点id值数据，保存到defkeys数组中
    getLeafKeys(node, arr) {
      // 如果当 node 节点不包含 children 属性， 则是第三节点
      if(!node.children) return arr.push(node.id)
    //  如果不是三层节点时， 使用递归
      node.children.forEach(item => this.getLeafKeys(item,arr))
    },

  // 分配权限对话框关闭
    setRolesDialogClosed() {
      this.defKeys = []
    },

  //
    async allotRoles() {
      // 定义数组，将id选中的id进行保存
      // 使用到了element提供的函数 getCheckedNodes |  getHalfCheckedNodes
      const keys = [
        ...this.$refs.treeRefs.getCheckedKeys(),
        ...this.$refs.treeRefs.getHalfCheckedKeys	(),
      ]
      const idStr = keys.join(',')
      // 发起添加权限的请求
      const {data: result} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
      if(result.meta.status !== 200) return this.$message.error('分配用户权限失败')
      this.$message.success('分配用户成功')
      await this.getRolesList()  // 更新模板数据
      this.showRolesInfoDialog = false
    }
  }
}
</script>

<style scoped>

.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
