<template>
    <div  class="login_container">
<!--      登录的盒子-->
        <div class="login_box">
<!--          登录Logo图-->
            <div class="avatar_box">
              <img src="../assets/miku.png" alt="logo">
            </div>
<!--          登录的表单-->
          <el-form
            label-width="0px"
            class="login_form"
            :model="LoginForm"
            :rules="LoginFormRules"
            ref="LoginFormRef"
          >
<!--            用户名-->
            <el-form-item
              prop="username"
            >
              <el-input
                type="text"
                prefix-icon="el-icon-user"
                v-model="LoginForm.username"
              ></el-input>
            </el-form-item>
<!--            密码-->
            <el-form-item
              prop="password">
              <el-input
                type="password"
                prefix-icon="el-icon-lock"
                v-model="LoginForm.password"
              ></el-input>
            </el-form-item>
<!--            登录和重置按钮-->
            <el-form-item class="btns" >
              <el-button  type="primary" @click="login">登录</el-button>
              <el-button  type="info"  @click="resetLoginForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'Login',
    data () {
      return {
        // 这是登录表单的数据绑定对象
        LoginForm: {
          username: 'admin',
          password: '123456'
        },
        // LoginFormRules 表单数据的验证对象
        LoginFormRules: {
          // 验证用户名是否合法
          username : [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          // 验证密码是否合法
          password : [
            { required: true, message: '请输入用户密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      // 点击重置按钮， 重置登录表单
      resetLoginForm() {
        // console.log(this)
      //  获取到 refs 中定义的 LoginFormRef， 中具有的重置方法
        this.$refs.LoginFormRef.resetFields()
      },

      // 登录前的预验证
      login() {
        // 发送登录请求
        this.$refs.LoginFormRef.validate(async (valid)=> {
          // console.log(valid)  // valid 是一个布尔值， 查看表单是否通过了
          if(!(valid)) return;
          // 将服务器返回data数据， 使用{}结构为 result
          const {data: result} = await this.$http.post("login", this.LoginForm)
          if(result.meta.status !== 200)  return this.$message.error('登录失败')
          if(result.meta.status === 200){
            this.$message.success('登录成功')
            console.log(result)
            //  token , 保存到客户端的 sessionStorage 中
            window.sessionStorage.setItem('token', result.data.token)
            //  通过编程式导航跳转到后代主页， 路由地址式 /home
            this.$router.push("/home")
          }
        })
      }
    }
  }

  /**
   * 1. 为表单数据进行绑定 （3步骤）
   * 使用 ElementUI的表单From使用 :model="LoginForm" 给绑定 LoginForm 对象，
   * 并且在data() 中进行定义 LoginForm 对象
   * 然后表单(input)下的数据再使用 v-model='LoginForm.xxx' 方法进行绑定
   */

  /**
   * 2. 实现表单数据验证 (3步骤)
   *  在表单中定义rules表单验证对象，  :rules="rules" ,
   *  并且在data()中定义rules 对象
   *  在表单数据中需要进行验证的 form-item 框， 配置 prop='设置规则名称'  （注意，验证规则是加给 Item的而不是 imput ）
   *
   *  配置的规则：
   *  required: true,  必填写
   *  message: '',   错误提示信息
   *  trigger: 'blur'   失去鼠标焦点时候提醒
   *  min   最小字符
   *  max  最大字符
   */

  /**
   * 3. 重置表单数据 （3步骤） （resetFields()）  访问URL查看方法 (https://element.eleme.cn/#/zh-CN/component/form#form-methods)
   *  在ElementUI中定义有重置表单的方法， 只需要定义为表单添加一个 ref='LoginFormRef'， 也就是组件的实例对象
   *  在重置按钮中绑定方法， 并在methods 配置该方法
   *  然后通过 this.$refs.LoginFormRef.resetFields() 重置表单   // resetFields()是ElementUI自己定义的
   *
   */

  /**
   * 4. 登录前表单的数据的预验证 （3步骤）validate() 方法
   *  在ElementUI中定义有表单的的数据的预验证方法 ，  只需要定义为表单添加一个 ref='LoginFormRef'， 也就是组件的实例对象
   *  在重置按钮中绑定方法， 并在methods 配置该方法
   *   然后通过 this.$refs.LoginFormRef.validate() 重置表单   // validate() 是ElementUI自己定义的方法
   *
   *   validate() 方法的使用
   */

  /**
   * 5. ElementUI 的消息弹窗 （3步骤） https://element.eleme.cn/#/zh-CN/component/message
   *  在main.js 中引入 Message ；  import {Message} from 'element-ui'
   *  将消息弹窗功能添加到 Vue的原型对象上  Vue.prototype.$message = Message
   *  使用 this.$message.XXX('xxxxxxx')
   *
   */

  /**
   * 6.  登录添加token和路由跳转
   * 1. 将登录成功之后的 token , 保存到客户端的 sessionStorage 中
   * 将项目中除了登录之外还有其他API接口， 必须在登录之后才能访问
   * token 只应用在当前网站打开期间生效， 所以将 token 保存到 sessionStorage 中
   *
   * 2. 通过编程式导航跳转到后代主页， 路由地址式 /home
   */


</script>

<style  scoped>


.login_container {
    background-color: #2b4b6b;
    height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;

  /* 水平居中 */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  width: 130px;
  height: 130px;
  border: 1px solid #ccc;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ccc;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}

.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
}
</style>
