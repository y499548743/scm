<template>
  <div>
    <h5>
      <span>供应商信息</span>
    </h5>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="供应商编号" prop="venderCode">
        <el-input v-model="ruleForm.venderCode" @input="defaultPassword"></el-input>
      </el-form-item>
      <el-form-item label="供应商名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="供应商密码" prop="passWord">
        <el-input v-model="ruleForm.passWord" show-password></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contactor">
        <el-input v-model="ruleForm.contactor"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="ruleForm.address"></el-input>
      </el-form-item>
      <el-form-item label="邮政编码" prop="postCode">
        <el-input v-model="ruleForm.postCode"></el-input>
      </el-form-item>
      <el-form-item label="注册日期" prop="createDate">
        <el-input v-model="ruleForm.createDate" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="tel">
        <el-input v-model="ruleForm.tel"></el-input>
      </el-form-item>
      <el-form-item label="传真" prop="fax">
        <el-input v-model="ruleForm.fax"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save('ruleForm')">确认保存</el-button>
        <router-link to="/purchase/suppliermanager">
          <el-button>取消</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { requestPost } from "../../utils/http";
export default {
  data() {
    return {
      ruleForm: {
        venderCode: "",
        name: "",
        passWord: "",
        contactor: "",
        address: "",
        postCode: "",
        createDate: new Date(+new Date() + 8 * 3600 * 1000)
          .toISOString()
          .replace("T", " ")
          .substr(0, 19),
        tel: "",
        fax: ""
      },
      rules: {
        venderCode: [
          { required: true, message: "请输入供应商编号", trigger: "blur" },
          {
            pattern: /^[a-z A-Z 0-9]{4,20}$/,
            message: "要求4~20位的数字字母",
            trigger: "blur"
          }
        ],
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 1, max: 100, message: "长度不超过100", trigger: "blur" }
        ],
        passWord: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 4, max: 20, message: "要求4~20位字符", trigger: "blur" }
        ],
        address: [{ required: true, message: "地址不能为空", trigger: "blur" }],
        contactor: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        createDate: [{ required: true }],
        tel: [{ required: true, message: "电话不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          requestPost("/api/main/purchase/vender/add", this.ruleForm).then(
            resp => {
              let result = resp.data;
              if (result.code == 2) {
                this.$router.push("/purchase/suppliermanager");
              }
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    defaultPassword() {
      this.ruleForm.passWord = this.ruleForm.venderCode;
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