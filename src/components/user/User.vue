<template>
 <div>
<!--  面包屑导航 -->
   <el-breadcrumb separator="/">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>用户管理</el-breadcrumb-item>
     <el-breadcrumb-item>用户列表</el-breadcrumb-item>
   </el-breadcrumb>

<!--   卡片视图 -->
   <el-card >
<!--    搜索与添加区域-->
     <el-row :gutter="20">
       <el-col :span="8">
         <el-input placeholder="请输入内容"
                   clearable
                   @clear='getUserInfo'
                   v-model='queryInfo.query'>
           <el-button
             slot="append" icon="el-icon-search"
             @click='getUserInfo'
           ></el-button>
<!--         通过 v-model 和  @click='getUserInfo' 实现用户的查询
@clear='getUserInfo' 清空用户数据后， 显示原来的数据
 -->
         </el-input>
       </el-col>
       <el-col :span="4">
         <el-button type="primary" @click='AddUserDialogVisible = true'>添加用户</el-button>
       </el-col>
     </el-row>

<!--     用户列表区-->
     <el-table
       :data='userList'
       stripe
       border>
<!--       列表 -->
       <el-table-column type='index' label='#'></el-table-column>
       <el-table-column label="姓名" prop="username"></el-table-column>
       <el-table-column label="邮箱" prop="email"></el-table-column>
       <el-table-column label="电话" prop="mobile"></el-table-column>
       <el-table-column label="角色" prop="role_name"></el-table-column>
       <el-table-column label="状态">
         <template slot-scope='scope'>
<!--           使用了 ElementUI-Switch 提供的方法 change -->
           <el-switch @change="userStatusChanged(scope.row)"
             v-model="scope.row.mg_state"
             >
           </el-switch>
         </template>
       </el-table-column>
       <el-table-column label="操作" width='180px' >
         <template slot-scope="scope">
<!--           操作列的按钮-->
<!--           修改按钮-->
           <el-button type="primary" icon="el-icon-edit" size='mini' @click='showEditDialog(scope.row.id)'></el-button>
<!--           删除按钮-->
           <el-button type="danger" icon="el-icon-delete" size='mini' @click='removeUser(scope.row.id)'></el-button>
<!--           分配角色按钮 -->
           <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable='false'>
             <el-button type="warning" icon="el-icon-setting"  size='mini' @click='setRole(scope.row)' ></el-button>
           </el-tooltip>
         </template>
       </el-table-column>
     </el-table>
<!--     分页区域-->
     <el-pagination
       @size-change="handleSizeChange"
       @current-change="handleCurrentChange"
       :current-page="queryInfo.pagenum"
       :page-sizes="[1, 2, 5, 10]"
       :page-size="queryInfo.pagesize"
       layout="total, sizes, prev, pager, next, jumper"
       :total="total">
     </el-pagination>
   </el-card>

<!--   添加用户的弹出对话框 -->
   <el-dialog
     title="添加用户"
     :visible.sync="AddUserDialogVisible"
     width="30%"
     @close='addDialogClosed'
   >
<!--     内容主体区 -->
     <el-form
       ref="AddFormRef"
       :model="AddForm"
       :rules='AddFormRules'
       label-width="70px">
       <el-form-item label="用户名" prop="username">
         <el-input v-model="AddForm.username"></el-input>
       </el-form-item>
       <el-form-item label="密码" prop="password">
         <el-input v-model="AddForm.password"></el-input>
       </el-form-item>
       <el-form-item label="邮箱" prop="email">
         <el-input v-model="AddForm.email"></el-input>
       </el-form-item>
       <el-form-item label="电话" prop="mobile">
         <el-input v-model="AddForm.mobile"></el-input>
       </el-form-item>
     </el-form>
<!--     底部区域 -->
     <span slot="footer" class="dialog-footer">
    <el-button @click="AddUserDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
   </el-dialog>

<!--   修改用户弹出的对话框 -->
   <el-dialog
     title="修改用户信息"
     :visible.sync="editUserDialogVisible"
     width="50%"
    >
<!--     表单数据  -->
     <el-form
       ref="editFormRef"
       :model="editForm"
       :rules='editFormRules'
       @close='restEditInfo'
       label-width="70px">
       <el-form-item label="用户名">
         <el-input v-model="editForm.username" disabled></el-input>
       </el-form-item>
       <el-form-item label="邮箱" prop='email'>
         <el-input v-model="editForm.email"></el-input>
       </el-form-item>
       <el-form-item label="电话" prop='mobile'>
         <el-input v-model="editForm.mobile" ></el-input>
       </el-form-item>
     </el-form>
     <span slot="footer" class="dialog-footer">
    <el-button @click="editUserDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="EditUserInfo">确 定</el-button>
  </span>
   </el-dialog>

<!--   用户分配角色的对话框 -->
   <el-dialog
     title="分配角色"
     @close='setRolesDialogClosed'
     :visible.sync="setRoleDialogVisible"
     width="50%"
     >
     <div>
       <p>当前的用户： {{UserInfo.username}}</p>
       <p>当前的角色： {{UserInfo.role_name}}</p>
       <p>分配新角色：
         <el-select v-model="seleteRoleId" placeholder="请选择">
           <el-option
             v-for="item in rolesList"
             :key="item.id"
             :label="item.roleName"
             :value="item.id">
           </el-option>
         </el-select>
       </p>
     </div>
     <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
   </el-dialog>

   <!--&lt;!&ndash;   删除用户弹出的对话框&ndash;&gt;-->
<!--   <el-dialog-->
<!--     title="删除用户"-->
<!--     :visible.sync="DeleteUserDialogVisible"-->
<!--     width="30%"-->
<!--     >-->
<!--     <span>是否删除{{DeleteUserInfoObj.username}}用户</span>-->
<!--     <span slot="footer">-->
<!--    <el-button @click="DeleteUserDialogVisible = false">取 消</el-button>-->
<!--    <el-button type="primary" @click="DeleteUserInfo">确 定</el-button>-->
<!--  </span>-->
<!--   </el-dialog>-->

 </div>
</template>

<script>
export default {
  name: 'User',
  created() {
  //   获取用户数据
    this.getUserInfo()
  },
  data() {
    //   自定义校验邮箱的规则
    var checkEmail = (rule, value, callback) => {
      const regEmail =  /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if(regEmail.test(value)) return  callback()
      callback(new Error('请输入合法的邮箱'))
    }

    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[3456789]\d{9}$/
      if(regMobile.test(value))return  callback()
      callback(new Error('请输入合法的手机号码'))
    }
    return {
    //  获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 页码大小
        pagenum: 1,
        // 页码值
        pagesize: 2
      },
      userList: [],
      total: 0,  // 数据条数
      AddUserDialogVisible: false,  // 添加用户的弹框

    //  添加用户数据的表单
      AddForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
    // 添加用户数据的规则
      AddFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
    // 控制修改用户弹出对话框
      editUserDialogVisible: false,

    // 定义一个空对象，接收查询到的用户信息
      editForm: {},
    // 修改用户数据的规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
    //
    // //  删除用户弹出的对话框
    //   DeleteUserDialogVisible: false,
    // // 定义数据接收删除数据的用户名
    //   DeleteUserInfoObj:  {},

      // 定义分配角色的对话框于隐藏
      setRoleDialogVisible: false,
      // 保存分配角色的对象
      UserInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的Id值
      seleteRoleId: '',
    }
  },
  methods: {
    // 获取用户数据 响应式的
    async getUserInfo () {
      const {data: result} = await this.$http.get('users', {params: this.queryInfo })
      if(result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.userList = result.data.users
      this.total = result.data.total
    },

    // 监听 pagesize 改变 事件来处理页码大小
    handleSizeChange(val) {
    //   接收到参数 val 显示最新的页码值
      this.queryInfo.pagenum = val   // 修改请求的页码大小， 请求参数
      this.getUserInfo()  // 调用函数，重新获取数据

    },

    // 监听最新的页码值
    handleCurrentChange(val) {
      this.queryInfo.pagesize = val  // 修改要显示页码
      this.getUserInfo()  // 重新发起请求
    },

  //  监听Switch开关的状态的改变 然后修改数据库内容
    async userStatusChanged(userInfo) {
      // console.log(userInfo)
    //  发起请求， 修改数据库中的数据
      const {data : result } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if(result.meta.status !== 200) return this.$message.error('更新用户失败')
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
          const {data: result} =  await this.$http.post('users',  this.AddForm)
          if (result.meta.status !== 201) return this.$message.error('创建用户失败')
          this.$message.success('添加用户成功')
          // 隐藏添加用户的对话框
          this.AddUserDialogVisible = false
          // 重新获取用户的列表
          await this.getUserInfo()
      })
    },

    // 显示修改用户的弹出对话框
    async showEditDialog(id) {
      // 接收到用户的ID
      // 查询用户的ID
      const {data: result} = await this.$http.get(`users/${id}`)
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
        const {data : result } = await this.$http.put(`users/${this.editForm.id}`,
          {  // 修改数据携带的参数
            email: this.editForm.email,
            mobile: this.editForm.mobile
          } )
        if(result.meta.status !== 200) return this.$message.error("修改用户数据失败")
        this.editUserDialogVisible = false  // 关闭对话框
        await this.getUserInfo()  // 刷新用户数据
        this.$message.success('成功修改用户数据') // 提示成功修改信息

      })
    },

  //  弹出删除数据对话框
  //   isDeleteUser(DeleteUserInfo) {
  //     this.DeleteUserDialogVisible = true
  //     // 保存删除用户的数据
  //     this.DeleteUserInfoObj = DeleteUserInfo
  //   },

  //  删除用户数据
    async removeUser(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      // 如果用户点击确认 返回  confirm
      // 如果用户点击取消 返回 cancel
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')

      const {data: result} =  await this.$http.delete(`users/${id}`)
      if(result.meta.status !== 200) return this.$message.error(result.meta.msg)
      await this.getUserInfo()  // 更新用户数据
      this.$message.success(result.meta.msg) // 显示成功信息
    },

  //  展示分配角色的对话框
    async setRole(userInfo) {
      this.UserInfo  = userInfo
      const {data: result} =  await this.$http.get('roles')
      if(result.meta.status !== 200) return this.$message.error('获取角色信息失败')
      this.rolesList = result.data
      this.setRoleDialogVisible = true
    },

    // 修改角色信息
    async saveRoleInfo() {
      if(!this.seleteRoleId) return this.$message.error('请选择要分配的角色')
      const {data: result} =  await this.$http.put(`users/${this.UserInfo.id}/role`, {rid: this.seleteRoleId})
      if(result.meta.status !== 200) return this.$message.error('设置角色失败')
      this.$message.success(result.meta.msg)
      await this.getUserInfo()  // 刷新模板
      this.setRoleDialogVisible = false  // 关闭对话框
    },
    // 关闭对话框，清空信息
    setRolesDialogClosed() {
      this.seleteRoleId = ''
      this.UserInfo = {}
    },

  },

}
/**
 * 1. 添加面包屑局部和卡片视图 都是ElementUI
 * 添加样式，注册组件
 * row 和 col
 *
 *
 */

/**
 * 2. 在表格中使用插槽
 * {{scope.row}}
 * 在使用table组件时，定义的:data 中可以使用  slot-scope='scope'类似于插槽， 然后 scope.row 能够获取到当前这条数据
 * 使用了  <template slot-scope='scope'> 后会覆盖掉  prop="mg_state"
 */


</script>

<style scoped>


</style>
