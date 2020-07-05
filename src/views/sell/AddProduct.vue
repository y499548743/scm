<template>
  <div>
    <h5>
      <span>产品信息</span>
    </h5>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="产品编号" prop="productCode">
        <el-input v-model="ruleForm.productCode"></el-input>
      </el-form-item>
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="数量单位" prop="unitName">
        <el-input v-model="ruleForm.unitName"></el-input>
      </el-form-item>
      <el-form-item label="分类编号" prop="categoryId">
        <el-select v-model="ruleForm.categoryId">
          <el-option
            v-for="(item,index) in category"
            :key="index"
            :label="item.categoryId"
            :value="item.categoryId"
          >
            <span style="float: left">{{ item.categoryId}}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售价" prop="price">
        <el-input v-model="ruleForm.price"></el-input>
      </el-form-item>
      <el-form-item label="添加日期" prop="createDate">
        <el-input v-model="ruleForm.createDate" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input v-model="ruleForm.remark"></el-input>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="save('ruleForm')">确认保存</el-button>
        <router-link to="/sell/productmanager">
        <el-button>取消</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { requestGet } from "../../utils/http";
import { requestPost } from "../../utils/http";
export default {
  data() {
    return {
      ruleForm: {
        productCode: "",
        name: "",
        unitName: "",
        categoryId: "",
        price: "0",
        createDate: new Date(+new Date() + 8 * 3600 * 1000)
          .toISOString()
          .replace("T", " ")
          .substr(0, 19),
        remark: ""
      },
      rules: {
        productCode: [
          { required: true, message: "请输入产品编号", trigger: "blur" },
          {
            pattern: /^[a-z A-Z 0-9]{4,10}$/,
            message: "要求4~10位的数字字母",
            trigger: "blur"
          }
        ],
        name: [
          { required: true, message: "请输入产品名称", trigger: "blur" },
          { min: 1, max: 100, message: "长度不超过100", trigger: "blur" }
        ],
        unitName: [{ required: true, message: "不能为空", trigger: "blur" }],
        categoryId: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
        price: [
          { required: true, message: "不能为空", trigger: "blur" },
          { pattern: /^\d+(\.\d+)?$/, message: "不能为负数", trigger: "blur" }
        ]
      },
      category: []
    };
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          requestPost("/api/main/sell/product/add", this.ruleForm).then(
            resp => {
              let result = resp.data;
              if (result.code == 2) {
                this.$router.push("/sell/productmanager");
              }
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  created() {
    requestGet("/api/main/sell/category/all").then(resp => {
      this.category = resp.data;
    });
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
.Idselect {
  width: 300px;
}
</style>