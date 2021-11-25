<template>
 <div>
<!--   实现退出功能 -->
   <el-button type="info"  @click='logout'>退出</el-button>
 </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    logout() {
      // 清空token
      window.sessionStorage.clear();
      // 强制返回登录页面
      this.$router.push('/login')
      this.$message({
        showClose: true,
        message: '你已退出登录',
      });
    }
  }
}

/**
 * 1. 登录退出功能 （2步骤）
 * 清空token : window.sessionStorage.clear();
 * 跳转到登录页面 : this.$router.push('/login')
 *
 */
</script>

<style scoped>

</style>
