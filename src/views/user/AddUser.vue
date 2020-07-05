<template>
  <div>
    <h5>
      <span>基本信息</span>
    </h5>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户账号" prop="account">
        <el-input v-model="ruleForm.account" @input="defaultPassword"></el-input>
      </el-form-item>
      <el-form-item label="用户姓名" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="用户密码" prop="passWord">
        <el-input v-model="ruleForm.passWord" show-password>1</el-input>
      </el-form-item>
      <el-form-item label="添加日期" prop="createDate">
        <el-input v-model="ruleForm.createDate" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="锁定状态" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="权限" prop="modelcodes">
        <el-checkbox-group v-model="ruleForm.modelcodes" @change="checkChange">
          <el-checkbox label="1" name="modelcodes">采购管理</el-checkbox>
          <el-checkbox label="2" name="modelcodes">销售管理</el-checkbox>
          <el-checkbox
            label="3"
            name="modelcodes"
            @change="handleCheckAllChange"
            :checked="checked"
          >系统管理</el-checkbox>
          <el-checkbox label="4" name="modelcodes">财务管理</el-checkbox>
          <el-checkbox label="5" name="modelcodes">仓库管理</el-checkbox>
          <el-checkbox label="6" name="modelcodes">业务报表</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save('ruleForm')">确认保存</el-button>
        <router-link to="/user/manager">
          <el-button>取消</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { requestPost } from "../../utils/http";
let Options = ["1", "2", "3", "4", "5", "6"];
export default {
  data() {
    return {
      ruleForm: {
        account: "",
        name: "",
        passWord: "",
        createDate: new Date(+new Date() + 8 * 3600 * 1000)
          .toISOString()
          .replace("T", " ")
          .substr(0, 19),
        status: "0",
        modelcodes: []
      },
      checked: false,
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 30, message: "标题范围3到30个字符", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        passWord: [{ required: true, message: "请输入密码", trigger: "blur" }],
        createDate: [{ required: true }],
        status: [
          { required: true, message: "请选择锁定状态", trigger: "change" }
        ],
        modelcodes: [
          { required: true, message: "请选择至少一个权限", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          requestPost("/api/main/system/user/add", this.ruleForm).then(resp => {
            let result = resp.data;
            if (result.code == 2) {
              this.$router.push("/user/manager");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCheckAllChange(val) {
      this.ruleForm.modelcodes = val ? Options : [];
    },
    checkChange() {
      if (
        this.ruleForm.modelcodes.indexOf("3") == -1 &&
        this.ruleForm.modelcodes.length == 5
      ) {
        this.ruleForm.modelcodes.push("3");
      }
      // if(this.ruleForm.modelcodes.indexOf("3")>0&&this.ruleForm.modelcodes.length<=5){
      //   for(let i=0;i<this.ruleForm.modelcodes.length;i++){
      //     if (this.ruleForm.modelcodes[i] ==="3")
      //     return i
      //   }
      //   this.ruleForm.modelcodes.splice(i,1)
      // }
      if (this.ruleForm.modelcodes.length < 6) {
        this.checked = false;
      }
    },
    defaultPassword(){
      this.ruleForm.passWord=this.ruleForm.account
    }
  }
};
</script>
<style scoped>
h5 span {
  border-bottom: 3px solid #66c9f3;
  padding: 0 5px 10px 5px;
}
h5 {
  border-bottom: 1px solid #d0dee5;
  padding-bottom: 13px;
  margin-bottom: 20px;
}
.el-input {
  width: 300px;
}
.el-form-item span {
  font-size: 12px;
  color: #7f7f7f;
  padding-left: 20px;
}
</style>