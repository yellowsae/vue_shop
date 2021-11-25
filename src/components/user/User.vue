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
         <el-input placeholder="请输入内容">
           <el-button slot="append" icon="el-icon-search"></el-button>
         </el-input>
       </el-col>
       <el-col :span="4">
         <el-button type="primary">添加用户</el-button>
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
       <el-table-column label="状态" prop="mg_state"></el-table-column>
       <el-table-column label="操作" ></el-table-column>
     </el-table>
   </el-card>
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
    return {
    //  获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0
    }
  },
  methods: {
    async getUserInfo () {
      const {data: result} = await this.$http.get('users', {params: this.queryInfo })
      console.log(result)
      if(result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.userList = result.data.users
      this.total = result.data.total
    }
  }
}
/**
 * 1. 添加面包屑局部和卡片视图 都是ElementUI
 * 添加样式，注册组件
 * row 和 col
 *
 *
 */
</script>

<style scoped>


</style>
