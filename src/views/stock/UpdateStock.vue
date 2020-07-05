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
      <el-form-item label="变化数量" prop="num">
        <el-input v-model="ruleForm.num"></el-input>
      </el-form-item>
      <el-form-item label="变化类型">
        <el-select v-model="ruleForm.type" prop="type">
          <el-option label="损耗" value="1"></el-option>
          <el-option label="盈余" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="损益原因" prop="description">
        <el-input v-model="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">确认保存</el-button>
        <router-link to='/stock/checkstock'><el-button>取消</el-button></router-link>
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
        num: "",
        type: "",
        description: ""
      },
      rules: {
        num: [
          { required: true, message: "不能为空", trigger: "blur" },
          { pattern: /^[1-9]\d*$/, message: "要求正整数", trigger: "blur" }
        ],
        type:[{required: true, message: "请选择变化类型", trigger: "change"}],
        description:[{required: true, message: "不能为空", trigger: "blur"}]
      }
    };
  },
  methods:{
      save(){
          this.ruleForm["productCode"]=sessionStorage.getItem("productCode");
          this.ruleForm["originNum"]=sessionStorage.getItem("originNum");
          console.log(this.ruleForm)
          requestGet("/api/main/stock/checkstock",this.ruleForm).then(resp=>{
              let reslut=resp.data;
              console.log(reslut)
              if(reslut.code==2){
                  this.$alert("盘点成功")
              }
          })
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