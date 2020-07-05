<template>
  <div>
    <p class="blank"></p>
    <el-form>
      <h2>用户登录</h2>
        <el-input v-model="user.username" placeholder="请输入账号" prefix-icon="el-icon-user-solid"></el-input>
        <el-input v-model="user.password" placeholder="请输入密码" prefix-icon="el-icon-lock" show-password></el-input>
        <el-radio v-model="user.role" label="1" value="member">工作人员</el-radio>
        <el-radio v-model="user.role" label="2" value="customer">客户</el-radio>
        <p class="error">{{error}}</p>
        <p><el-button type="primary" @click="login">登录</el-button></p>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: "",
        password: "",
        role: "member"
      },
      error: ""
    };
  },
  methods: {
    login() {
      // TODO:表单验证（账号密码不能为空）

      // 分发action
      this.$store
        .dispatch("loginAction", this.user)
        .then(() => {
          this.$router.push("/home");
        })
        .catch(err => {
          this.error = err;
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
div{
  height:100%;
}
.blank{
  height:100px;
}
.error {
  color: red;
}
.el-form{
  width:500px;
  margin: auto;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid #ccc;
  text-align: center;
}
.el-input{
  width:400px;
}
h2{
  margin-bottom: 20px;
}
.el-button{
  margin:20px 0 20px 0;
}
.el-input{
  margin-bottom: 20px;
}
</style>