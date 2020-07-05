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
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input v-model="ruleForm.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save('ruleForm')">确认保存</el-button>
        <router-link to="/sell/categorymanager">
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
        name: "",
        remark: ""
      },
      rules: {
        name: [{ required: true, message: "不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          requestPost("/api/main/sell/category/add", this.ruleForm).then(
            resp => {
              let result = resp.data;
              if (result.code == 2) {
                this.$router.push("/sell/categorymanager");
              }
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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