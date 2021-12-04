<template>
<!--    整体布局 -->
    <el-container class="home-container">
<!--      头部 -->
      <el-header>
        <div>
          <a href='https://github.com/yellowsae'>
            <img src='../assets/miku.png' alt=''>
          </a>
          <span>电商后台系统</span>
        </div>
        <!--   实现退出功能 -->
        <el-button type="primary"  @click='logout'>退出</el-button>
      </el-header>
<!--      页面主体区-->
      <el-container>
<!--        侧边栏-->
        <el-aside :width="isCollapse ? '64px' : '200px' ">
<!--          折叠和展开功能-->
          <div
            class='toggle-button'
            @click="isCollapse = !isCollapse">
            <i class="el-icon-caret-bottom"></i>
          </div>
<!--          侧边栏菜单-->
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409bff"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition='false'
            router
            :default-active="activePath"
          >
<!--            一级菜单 -->
            <el-submenu
              :index="items.id + '' "
              v-for="items in MenuList" :key="items.id"
            >
<!--              一级菜单模板区-->
              <template slot="title">
<!--                图标-->
                <i :class="iconList[items.id]"></i>
<!--                文本-->
                <span>{{items.authName}}</span>
              </template>
<!--              二级菜单-->
            <el-menu-item
              :index=" '/' + item.path "
              v-for="item in items.children" :key="item.id"
              @click="saveNameState('/' + item.path)"
            >
              <template slot="title">
<!--                图标-->
                <i class="el-icon-menu"></i>
<!--                文本-->
                <span>{{item.authName}}</span>
              </template>
            </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

<!--        main主体 -->
        <el-main>
<!--          home的子组件 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

</template>

<script>
export default {
  name: "Home",

  // 生命周期钩子函数
  created() {
    // 定义函数获取菜单数据
    this.getMenuList()

  //  在创建时候路由路径赋值
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      MenuList: [],
      iconList: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-s-tools',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-s-management',
        '145': 'el-icon-s-data',
      },
      // 是否展开菜单
      isCollapse: false,
      // 路由保存的链接
      activePath: '',
    }
  },
  methods: {
    // 退出登录
    logout() {
      // 清空token
      window.sessionStorage.clear();
      // 强制返回登录页面
      this.$router.push('/login')
      this.$message({
        showClose: true,
        message: '你已退出登录',
      });
    },
  //  请求获取菜单
    async getMenuList () {
      // const {data: result}  将data提出保存为 result
      const {data: result} = await this.$http.get('menus')
      // console.log(result)
      if(result.meta.status !== 200) return  this.$message.error(result.meta.msg)
      // 赋值给数据
      // console.log(result.data)
      this.MenuList = result.data
    },

    // 保存链接的激活状态
    saveNameState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      // 重新赋值
      this.activePath = activePath
    }
  }
}

/**
 * 1. 登录退出功能 （2步骤）
 * 清空token : window.sessionStorage.clear();
 * 跳转到登录页面 : this.$router.push('/login')
 *
 */

/**
 * 2. Home 页面的布局
 * 使用Element中的菜单布局，在修改下样式
 */

/**
 * 3. 通过发送请求获取菜单数据 （2步骤）
 * 配置生命周期钩子函数，在创建模板前就发出请求获取数据
 * 保存数据到data() 中
 */

/**
 * 4. 将数据渲染到模板中 （2步骤）
 * 查看数据，进行分析
 * 使用 v-for 两个for循环将一级菜单和二级菜单 进行数据的渲染
 */


/**
 * 5.配置折叠按钮和动态绑定折叠样式  https://element.eleme.cn/#/zh-CN/component/menu
 * 使用 Element Menu中定义的方法 （  都是加在 Menus 标签中
 * collapse 	是否水平折叠收起菜单
 * collapse-transition 是否开启折叠动画
 * unique-opened 是否只保持一个子菜单的展开
 *)
 * 在模板中动态设置则边栏宽高
 */

/**
 * 6. 实现侧边栏路由链接进行改造
 * 在Menu菜单栏开启路由功能 （ router 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转）
 * 动态配置二级index的值 :index=" '/' + item.path "
 */

</script>

<style scoped>

.home-container {
  height: 100%;
}

/* 在elementUI 给添加样式时，每一个标签就是一个类名 .el-header 这样添加属性就行 */
.el-header {
  background-color: #3d3741;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header div span {
  margin-left: 15px;
}
.el-header img {
  width: 90px;
  height: 90px;
}

.el-aside {
  background-color: #333744;
}

.el-menu {
  border: none;
}

.el-main {
  background-color: #eaedf1;
}

.toggle-button {
  height: 30px;
  background-color: #4A5064;
  cursor: pointer;
  text-align: center;
}

.el-icon-caret-bottom {
  vertical-align: middle;
  font-size: 25px;
  color: #fff;
}
</style>
