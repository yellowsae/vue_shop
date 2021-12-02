<template>
  <div>
<!--    面包屑导肮 -->
    <!--  面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

<!--    卡片视图区-->
    <el-card>

<!--      消息提示区 -->
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        :closable="false"
      >
      </el-alert>

<!--      步骤进度条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

<!--      使用 form 表单包裹标签栏 -->
      <el-form :model="AddForm" :rules="AddFormRules"  label-position='top' ref="AddFormRulesRef" label-width="100px">
      <!--      标签栏 和上边步骤条绑定同一个值 -->
      <el-tabs
        @tab-click='TabClick'
        :tab-position="'left'"
        v-model="activeIndex"
        :before-leave='beforeLeave'>

<!--        表单数据的基本信息 -->
        <el-tab-pane label="基本信息" name='0'>
          <el-form-item label='商品名称' prop='goods_name'>
            <el-input v-model='AddForm.goods_name'></el-input>
          </el-form-item>
          <el-form-item label='商品价格' prop='goods_price'>
            <el-input v-model='AddForm.goods_price' type='number'></el-input>
          </el-form-item>
          <el-form-item label='商品数量' prop='goods_number'>
            <el-input v-model='AddForm.goods_number' type='number' ></el-input>
          </el-form-item>
          <el-form-item label='商品重量' prop='goods_weight'>
            <el-input v-model='AddForm.goods_weight' type='number' ></el-input>
          </el-form-item>
<!--          商品的分类 -->
          <el-form-item label='商品的分类' prop='goods_cat'>
            <el-cascader
              v-model="AddForm.goods_cat"
              :options="catalist"
              :props="cateProps"
              @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>

<!--        分类数据渲染的动态参数属性 -->
        <el-tab-pane label="商品参数"  name='1'>
<!--          渲染表单的Item项 -->
          <el-form-item
            :label='item.attr_name'
            v-for='item in manyTableData'
            :key='item.attr_id'>
<!--            复选框组 -->
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                border
                v-for='(cb, i ) in item.attr_vals'
                :key='i'
                :label="cb"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>

<!--      分类数据渲染的静态属性列表   -->
        <el-tab-pane label="商品属性"  name='2'>
          <el-form-item
            :label='item.attr_name'
            :key='item.attr_id'
            v-for='item in onlyTableData'>
            <el-input v-model='item.attr_vals'></el-input>
          </el-form-item>
        </el-tab-pane>

<!--        图片上传功能 -->
        <el-tab-pane label="商品图片"  name='3'>
          <el-upload
            class="upload-demo"
            :action="UploadUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :headers='headersObj'
            :on-success='handleSuccess'
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容"  name='4'>商品内容</el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Add',
  created() {
    this.getCateList()
  },
  data () {
    return {
      // 进度条默认为 0
      activeIndex: '0',
      // 添加数据得form表单
      AddForm: {
        goods_name: '',   // 商品名称
        goods_price: 0, // 商品价格
        goods_number: 0, // 商品数量
        goods_weight: 0, // 商品重量
        // 商品所属的分类数组
        goods_cat: [],
        pics: [],  // 图片上传后保存上传的地址
      },
      AddFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur'}],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur'}],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur'}],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur'}],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur'}]
      },
      catalist: [],        // 获取商品列表分类数据
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',  // 分类展示的信息
        value: 'cat_id',   //选中的值，传递id
        children: 'children',  // 子数据
      },        // 分类数据展示
      manyTableData: [],        // 分类数据的动态参数
      onlyTableData: [],   ///  分类数据的静态属性

      UploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload', // 上传图片的URL

      // 为上传图片绑定token
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
    }
  },
  methods: {
    // 商品数据的分类数据的获取
    async getCateList() {
      const {data: result} =  await this.$http.get('categories')
      if (result.meta.status !== 200) return this.$message.error('获取商品列表分类数据失败')
      this.catalist = result.data
    },

    // 级联选择器选中项 发生变化后 调用函数
    handleChange() {
      // 确定选中三级分类
      if (this.AddForm.goods_cat.length !== 3) {
        this.AddForm.goods_cat = [] // 清空
      }
    },

    // taps 标签页的函数
    /* 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换*/
    beforeLeave(newActiveName, oldActiveName) {
      // newActiveName, oldActiveName 当前标签页，和即将条状去的标签页
      // 判断是否选中标签页
      if (oldActiveName === '0' && this.AddForm.goods_cat.length !== 3) {
        this.$message.error('请选择标签页')
        return false  // 阻止条状
      }
    },

    //当tabs标签页被点击时候执行函数
    async TabClick() {
      // 判断选中的项 , activeIndex === '1' 证明选中的是动态参数面版
      if (this.activeIndex === '1')  {
        const {data: result} =  await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: 'many'}})
        if (result.meta.status !== 200) return this.$message.error('获取动态参数列表失败')
        // 赋值
        result.data.forEach(item => {
          item.attr_vals =  item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        // 赋值动态参数属性
        this.manyTableData = result.data
      }else if (this.activeIndex === '2') {
        // 判断选中的项，activeIndex === '2' 证明选中的是静态属性面板
        const {data: result} =  await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: 'only'}})
        if (result.meta.status !== 200) return this.$message.error('获取动态参数列表失败')
        // 赋值静态属性
        this.onlyTableData = result.data
      }
    },

    // 图片预览图时触发的函数
    handlePreview(file) {
    },

    // 删除图片时 触发的函数
    handleRemove() {
    },

    // 文件上传成功时的钩子
    handleSuccess(response) {
      // 目的 ： 将图片上传后的数据，添加到 AddForm 表单中
      //1. 将数据变为对象形式
      const picsInfo = {pic : response.data.tmp_path}
      //2. 添加到表单
      this.AddForm.pics.push(picsInfo)
      console.log(this.AddForm)
    }

    //
  },
  computed: {
    // 获取到goods_cat 数组的最后一个值
    cateId() {
      if (this.AddForm.goods_cat.length === 3) {
        return this.AddForm.goods_cat[2]
      }
      return null
    }
  },

}
</script>

<style scoped>

.el-checkbox {
  margin: 0 10px 0 0 !important;
}
</style>
