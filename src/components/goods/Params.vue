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
        <el-tab-pane label="动态参数" name="first">
          <el-button type='primary' size='mini' :disabled='isBtnDisabled'>动态参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="动态参数" name="second">
          <el-button type='primary' size='mini' :disabled='isBtnDisabled'>动态参数</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
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

      activeName: 'second'
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
      // 证明选中的数组不是三级分类
      if(this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        return
      }
      //证明选中的三级分类
    },
    // tab 页签点击事件处理函数
    handleTabClick() {
      console.log(this.activeName)
    }
  },

  computed: {
    isBtnDisabled() {
      if(this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    }
  }
}
</script>

<style scoped>
.cat_opt {
  margin: 15px 0;
}
</style>
